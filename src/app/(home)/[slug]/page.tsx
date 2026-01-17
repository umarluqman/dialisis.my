import { BackButton } from "@/components/back-button";
import { DialysisCenterDetails } from "@/components/center-details";
import { EnhancedDialysisCenterDetails } from "@/components/enhanced-center-details";
import {
  RelatedCenters,
  NearbyCenters,
} from "@/components/internal-linking";
import { prisma } from "@/lib/db";
import { parseTreatmentTypes } from "@/lib/internal-linking-utils";
import { createLocationSlug } from "@/lib/location-utils";
import { DialysisCenter, State } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface Props {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

type CenterWithState = {
  featured: boolean;
} & DialysisCenter & {
    state: Pick<State, "name">;
  };

async function getCenter(slug: string): Promise<CenterWithState | null> {
  const center = await prisma.dialysisCenter.findUnique({
    where: { slug },
    include: {
      state: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!center) return null;

  return center as CenterWithState;
}

function generateJsonLd(center: CenterWithState): any {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `https://dialisis.my/${center.slug}`,
    name: center.dialysisCenterName,
    description: `Pusat dialisis ${center.dialysisCenterName} di ${center.town}, ${center.state.name}. Menyediakan perkhidmatan ${center.units}.`,
    url: `https://dialisis.my/${center.slug}`,
    telephone: center.phoneNumber || center.tel,
    email: center.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: center.addressWithUnit || center.address,
      addressLocality: center.town,
      addressRegion: center.state.name,
      addressCountry: "MY",
    },
    geo:
      center.latitude && center.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: center.latitude,
            longitude: center.longitude,
          }
        : undefined,
    medicalSpecialty: ["Nephrology", "Dialysis"],
    availableService: center.units?.split(",").map((unit: string) => ({
      "@type": "MedicalProcedure",
      name: unit.trim(),
      procedureType: unit.toLowerCase().includes("hd")
        ? "Hemodialysis"
        : unit.toLowerCase().includes("pd")
        ? "Peritoneal Dialysis"
        : "Dialysis Treatment",
    })),
    healthcareType: [
      center.sector === "MOH"
        ? "Public Hospital Department"
        : center.sector === "NGO"
        ? "Nonprofit Organization"
        : "Private Medical Center",
    ],
    medicalConditionsTreated: [
      "Chronic Kidney Disease",
      "End-Stage Renal Disease",
      "Kidney Failure",
    ],
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Hepatitis Treatment",
        value: center.hepatitisBay || "Not Available",
      },
      {
        "@type": "PropertyValue",
        name: "Sector",
        value: center.sector,
      },
    ],
    // Enhanced structured data
    // openingHours: center.operatingHours || "Mo-Fr 08:00-17:00",
    // priceRange: "$$",
    sameAs: center.website ? [center.website] : undefined,
    hasMap:
      center.latitude && center.longitude
        ? `https://www.google.com/maps?q=${center.latitude},${center.longitude}`
        : undefined,
  };
}

export const generateMetadata = async ({ params }: Props) => {
  const center = await getCenter(params.slug);

  if (!center) {
    return {
      title: "Not Found",
      description: "The page you're looking for doesn't exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = `https://dialisis.my/${params.slug}`;

  // Optimize town/state names for better SEO
  const location = `${center.town}, ${center.state.name}`;

  // Get service types for more descriptive metadata
  const services = center.units
    ? center.units.toLowerCase().includes("hd") &&
      center.units.toLowerCase().includes("pd")
      ? "Hemodialisis dan Peritoneal Dialisis"
      : center.units.toLowerCase().includes("hd")
      ? "Hemodialisis"
      : center.units.toLowerCase().includes("pd")
      ? "Peritoneal Dialisis"
      : "Perkhidmatan Dialisis"
    : "Perkhidmatan Dialisis";

  return {
    title: `${center.dialysisCenterName} - Pusat Dialisis di ${location}`,
    description: `Pusat dialisis ${
      center.dialysisCenterName
    } di ${location}. Menyediakan ${services} untuk pesakit buah pinggang. ${
      center.sector === "MOH"
        ? "Hospital kerajaan"
        : center.sector === "NGO"
        ? "Pusat NGO"
        : "Pusat swasta"
    }.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      title: `${center.dialysisCenterName} - Pusat Dialisis di ${location}`,
      description: `Pusat dialisis ${center.dialysisCenterName} di ${location}. Menyediakan ${services} untuk pesakit buah pinggang.`,
      siteName: "Dialisis MY",
      locale: "ms_MY",
      type: "article",
      images: [
        {
          url: `https://dialisis.my/api/og/${params.slug}`,
          width: 1200,
          height: 630,
          alt: `Pusat Dialisis ${center.dialysisCenterName}`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${center.dialysisCenterName} - Pusat Dialisis di ${location}`,
      description: `Pusat dialisis di ${location}. Menyediakan ${services}.`,
      images: [`https://dialisis.my/api/og/${params.slug}`],
    },
  };
};

// Add static generation for better performance and SEO
export async function generateStaticParams() {
  try {
    const centers = await prisma.dialysisCenter.findMany({
      select: {
        slug: true,
      },
    });

    return centers.map((center) => ({
      slug: center.slug,
    }));
  } catch {
    // During build without DB access, return empty array (pages will be generated on-demand)
    return [];
  }
}

export default async function DialysisCenterPage({
  params,
  searchParams,
}: Props) {
  const center = await getCenter(params.slug);

  if (!center) {
    notFound();
  }

  const jsonLd = generateJsonLd(center);
  const isFeatured = !!center?.featured;

  // Format location for breadcrumbs structured data
  const locationParts = [
    { name: "Dialisis MY", item: "https://dialisis.my" },
    {
      name: center.state.name,
      item: `https://dialisis.my/lokasi/${createLocationSlug(center.state.name)}`,
    },
    {
      name: center.town,
      item: `https://dialisis.my/lokasi/${createLocationSlug(center.state.name)}/${createLocationSlug(center.town)}`,
    },
    {
      name: center.dialysisCenterName,
      item: `https://dialisis.my/${center.slug}`,
    },
  ];

  // Create breadcrumbs structured data
  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: locationParts.map((part, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: part.name,
      item: part.item,
    })),
  };

  return (
    <main className="w-full mb-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      {isFeatured ? (
        <EnhancedDialysisCenterDetails center={center} />
      ) : (
        <>
          <nav
            className="container mt-4 flex items-center gap-2 text-xs md:text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-foreground">
              Utama
            </Link>
            <span>/</span>
            <Link
              href={`/lokasi/${createLocationSlug(center.state.name)}`}
              className="hover:text-foreground"
            >
              {center.state.name}
            </Link>
            <span>/</span>
            <Link
              href={`/lokasi/${createLocationSlug(center.state.name)}/${createLocationSlug(center.town)}`}
              className="hover:text-foreground"
            >
              {center.town}
            </Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">
              {center.dialysisCenterName.split(",")[0]}
            </span>
          </nav>
          <div className="container max-w-5xl py-6">
            <DialysisCenterDetails center={center} />

            <Suspense fallback={null}>
              {/* @ts-expect-error Server Component */}
              <RelatedCenters
                currentCenterId={center.id}
                city={center.town}
                stateName={center.state.name}
                treatmentTypes={parseTreatmentTypes(center.units)}
                limit={4}
              />
            </Suspense>

            {center.latitude && center.longitude && (
              <Suspense fallback={null}>
                {/* @ts-expect-error Server Component */}
                <NearbyCenters
                  currentCenterId={center.id}
                  latitude={center.latitude}
                  longitude={center.longitude}
                  city={center.town}
                  stateName={center.state.name}
                  limit={3}
                />
              </Suspense>
            )}
          </div>
        </>
      )}
    </main>
  );
}
