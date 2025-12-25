import { BackButton } from "@/components/back-button";
import { DialysisCenterDetails } from "@/components/center-details";
import { EnhancedDialysisCenterDetails } from "@/components/enhanced-center-details";
import { prisma } from "@/lib/db";
import { DialysisCenter, State } from "@prisma/client";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

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

function buildCenterCopy(
  center: CenterWithState,
  t: (key: string, values?: Record<string, any>) => string
) {
  const location = `${center.town}, ${center.state.name}`;
  const unitsLower = center.units?.toLowerCase() || "";
  const hasHd = unitsLower.includes("hd");
  const hasPd = unitsLower.includes("pd");

  let servicesKey: "both" | "hd" | "pd" | "default" = "default";
  if (hasHd && hasPd) {
    servicesKey = "both";
  } else if (hasHd) {
    servicesKey = "hd";
  } else if (hasPd) {
    servicesKey = "pd";
  }

  const services = t(`services.${servicesKey}`);

  const sectorDescription =
    center.sector === "MOH"
      ? t("sector.moh")
      : center.sector === "NGO"
      ? t("sector.ngo")
      : t("sector.private");

  const title = t("title", {
    centerName: center.dialysisCenterName,
    location,
  });

  const description = t("description", {
    centerName: center.dialysisCenterName,
    location,
    services,
    sectorDescription,
  });

  return {
    title,
    description,
    services,
    sectorDescription,
    location,
    ogTitle: t("ogTitle", { centerName: center.dialysisCenterName, location }),
    ogDescription: t("ogDescription", {
      centerName: center.dialysisCenterName,
      location,
      services,
    }),
    twitterTitle: t("twitterTitle", {
      centerName: center.dialysisCenterName,
      location,
    }),
    twitterDescription: t("twitterDescription", {
      location,
      services,
    }),
    ogImageAlt: t("ogImageAlt", { centerName: center.dialysisCenterName }),
    siteName: t("siteName"),
  };
}

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

function generateJsonLd(
  center: CenterWithState,
  description: string
): any {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `https://dialisis.my/${center.slug}`,
    name: center.dialysisCenterName,
    description,
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
  const t = await getTranslations("center.metadata");
  const locale = await getLocale();
  const center = await getCenter(params.slug);

  if (!center) {
    return {
      title: t("notFoundTitle"),
      description: t("notFoundDescription"),
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = `https://dialisis.my/${params.slug}`;
  const copy = buildCenterCopy(center, t);
  const ogLocale = locale === "ms" ? "ms_MY" : "en_US";

  // Optimize town/state names for better SEO
  const location = `${center.town}, ${center.state.name}`;

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      title: copy.ogTitle,
      description: copy.ogDescription,
      siteName: copy.siteName,
      locale: ogLocale,
      type: "article",
      images: [
        {
          url: "https://dialisis.my/og-image.png",
          width: 1200,
          height: 630,
          alt: copy.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.twitterTitle,
      description: copy.twitterDescription,
      images: ["/og-image.png"],
    },
  };
};

// Add static generation for better performance and SEO
export async function generateStaticParams() {
  // Get all centers for static generation
  const centers = await prisma.dialysisCenter.findMany({
    select: {
      slug: true,
    },
  });

  return centers.map((center) => ({
    slug: center.slug,
  }));
}

export default async function DialysisCenterPage({
  params,
  searchParams,
}: Props) {
  const center = await getCenter(params.slug);

  if (!center) {
    notFound();
  }

  const t = await getTranslations("center.metadata");
  const copy = buildCenterCopy(center, t);
  const jsonLd = generateJsonLd(center, copy.description);
  const isFeatured = !!center?.featured;

  // Format location for breadcrumbs structured data
  const locationParts = [
    { name: "Dialisis MY", item: "https://dialisis.my" },
    {
      name: center.state.name,
      item: `https://dialisis.my/peta?state=${encodeURIComponent(
        center.state.name
      )}`,
    },
    {
      name: center.town,
      item: `https://dialisis.my/peta?town=${encodeURIComponent(center.town)}`,
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
          <nav className="container mt-4 flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
            <BackButton />
            <span>/</span>
            <span className="text-foreground">
              {center.dialysisCenterName.split(",")[0]}
            </span>
          </nav>
          <div className="container max-w-5xl py-6">
            <DialysisCenterDetails center={center} />
          </div>
        </>
      )}
    </main>
  );
}
