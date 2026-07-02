import { BackButton } from "@/components/back-button";
import { DialysisCenterDetails } from "@/components/center-details";
import { EnhancedDialysisCenterDetails } from "@/components/enhanced-center-details";
import {
  RelatedCenters,
  NearbyCenters,
} from "@/components/internal-linking";
import { prisma } from "@/lib/db";
import { getAvailableHepatitisOptions } from "@/lib/hepatitis";
import { parseTreatmentTypes } from "@/lib/internal-linking-utils";
import { createLocationSlug } from "@/lib/location-utils";
import { getCenterPhoneNumbers } from "@/lib/center-phone-numbers";
import {
  centerDetailSelect,
  type CenterDetail,
} from "@/lib/center-detail-query";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface Props {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export const revalidate = 3600;

async function getCenter(slug: string): Promise<CenterDetail | null> {
  const center = await prisma.dialysisCenter.findUnique({
    where: { slug },
    select: centerDetailSelect,
  });

  if (!center) return null;

  return center;
}

function formatLocationName(value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return "";
  }

  return normalizedValue
    .replace(/-/g, " ")
    .split(/\s+/)
    .map((word) =>
      word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
    )
    .join(" ");
}

function generateJsonLd(center: CenterDetail): any {
  const stateName = formatLocationName(center.state.name);
  const townName = formatLocationName(center.town);
  const locationName = townName ? `${townName}, ${stateName}` : stateName;
  const centerName = center.dialysisCenterName.trim() || formatLocationName(center.slug);
  const phoneNumbers = getCenterPhoneNumbers(center);
  const imageUrls = center.images.map((image) => image.url).filter(Boolean);
  const hepatitisOptions = getAvailableHepatitisOptions(center.hepatitisBay);

  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `https://dialisis.my/${center.slug}`,
    name: centerName,
    description: `Pusat dialisis ${centerName} di ${locationName}. Menyediakan perkhidmatan ${center.units}.`,
    url: `https://dialisis.my/${center.slug}`,
    image:
      imageUrls.length > 0
        ? imageUrls
        : [`https://dialisis.my/api/og/${center.slug}`],
    telephone:
      phoneNumbers.length > 1
        ? phoneNumbers
        : phoneNumbers[0]
        ? phoneNumbers[0]
        : undefined,
    // Removed: email in JSON-LD gets corrupted by Cloudflare Email Obfuscation,
    // breaking the entire structured data block. Emails are still shown via mailto links.
    address: {
      "@type": "PostalAddress",
      streetAddress: center.addressWithUnit || center.address,
      addressLocality: townName || undefined,
      addressRegion: stateName,
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
      ...(hepatitisOptions.length > 0
        ? [
            {
              "@type": "PropertyValue",
              name: "Hepatitis Treatment",
              value: hepatitisOptions.join(", "),
            },
          ]
        : []),
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

  const stateName = formatLocationName(center.state.name);
  const townName = formatLocationName(center.town);
  const location = townName ? `${townName}, ${stateName}` : stateName;
  const centerName =
    center.dialysisCenterName.split(",")[0].trim() || formatLocationName(center.slug);

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
    title: `${centerName} | ${location}`,
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
      title: `${centerName} | ${location}`,
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
      title: `${centerName} | ${location}`,
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
  const stateDisplayName = formatLocationName(center.state.name);
  const stateSlug = createLocationSlug(center.state.name);
  const townName = formatLocationName(center.town);
  const skipTownInStates = new Set(["kuala-lumpur", "labuan", "putrajaya"]);
  const hasTownBreadcrumb =
    townName.length > 0 && !skipTownInStates.has(stateSlug);
  const townSlug = hasTownBreadcrumb ? createLocationSlug(townName) : null;
  const centerBreadcrumbName =
    center.dialysisCenterName.trim() || formatLocationName(center.slug);

  const locationParts = [
    { name: "Dialisis MY", item: "https://dialisis.my" },
    {
      name: stateDisplayName,
      item: `https://dialisis.my/lokasi/${stateSlug}`,
    },
    ...(hasTownBreadcrumb && townSlug
      ? [
          {
            name: townName,
            item: `https://dialisis.my/lokasi/${stateSlug}/${townSlug}`,
          },
        ]
      : []),
    {
      name: centerBreadcrumbName,
      item: `https://dialisis.my/${center.slug}`,
    },
  ];

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: locationParts.reduce<
      Array<{
        "@type": "ListItem";
        position: number;
        name: string;
        item: string;
      }>
    >((items, part) => {
      const name = part.name.trim();

      if (!name) {
        return items;
      }

      items.push({
        "@type": "ListItem",
        position: items.length + 1,
        name,
        item: part.item,
      });

      return items;
    }, []),
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
              href={`/lokasi/${stateSlug}`}
              className="hover:text-foreground"
            >
              {stateDisplayName}
            </Link>
            {hasTownBreadcrumb && townSlug && (
              <>
                <span>/</span>
                <Link
                  href={`/lokasi/${stateSlug}/${townSlug}`}
                  className="hover:text-foreground"
                >
                  {townName}
                </Link>
              </>
            )}
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
