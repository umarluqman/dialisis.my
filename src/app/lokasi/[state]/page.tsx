import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CenterCard } from "@/components/center-card";
import {
  CrossLocationLinks,
  RelatedBlogPosts,
} from "@/components/internal-linking";
import { LocationPageHeader } from "@/components/location-page-header";
import { LocationSeoContent } from "@/components/location-seo-content";
import { getCitiesForState } from "@/lib/internal-linking-queries";
import { getCentersByState, getLocationStats } from "@/lib/location-queries";
import {
  generateLocationJsonLd,
  generateLocationFaqJsonLd,
} from "@/lib/location-seo";
import {
  generateAllLocationParams,
  getLocationDisplayNames,
  validateLocation,
} from "@/lib/location-utils";

interface Props {
  params: {
    state: string;
  };
}

// Generate static params for all states
export async function generateStaticParams() {
  const allParams = generateAllLocationParams();

  // Filter to get only state-level params (no city)
  const stateParams = allParams
    .filter((param) => !param.city)
    .map((param) => ({
      state: param.state,
    }));

  return stateParams;
}

// Generate metadata for state pages
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stateName } = getLocationDisplayNames(params.state);

  if (!validateLocation(params.state)) {
    return {
      title: "Not Found",
      description: "The page you're looking for doesn't exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const stats = await getLocationStats(stateName);
  const canonicalUrl = `https://dialisis.my/lokasi/${params.state}`;

  return {
    title: `Pusat Dialisis di ${stateName} - ${stats.totalCenters} Pusat Tersedia`,
    description: `Cari pusat dialisis di ${stateName}. Terdapat ${stats.totalCenters} pusat dialisis termasuk ${stats.mohCenters} pusat MOH dan ${stats.privateCenters} pusat swasta. Maklumat lengkap lokasi, telefon dan perkhidmatan.`,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      `dialisis ${stateName.toLowerCase()}`,
      `pusat dialisis ${stateName.toLowerCase()}`,
      `hemodialisis ${stateName.toLowerCase()}`,
      `rawatan buah pinggang ${stateName.toLowerCase()}`,
      `dialysis center ${stateName.toLowerCase()}`,
      `kidney treatment ${stateName.toLowerCase()}`,
    ],
    openGraph: {
      title: `Pusat Dialisis di ${stateName} - ${stats.totalCenters} Pusat Tersedia`,
      description: `Cari pusat dialisis di ${stateName}. Terdapat ${stats.totalCenters} pusat dialisis dengan maklumat lengkap lokasi, telefon dan perkhidmatan.`,
      url: canonicalUrl,
      siteName: "Dialisis MY",
      locale: "ms_MY",
      type: "website",
      images: [
        {
          url: `https://dialisis.my/og-image.png`,
          width: 1200,
          height: 630,
          alt: `Pusat Dialisis di ${stateName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Pusat Dialisis di ${stateName} - ${stats.totalCenters} Pusat Tersedia`,
      description: `Cari pusat dialisis di ${stateName}. Terdapat ${stats.totalCenters} pusat dialisis dengan maklumat lengkap.`,
      images: [`https://dialisis.my/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function StatePage({ params }: Props) {
  const { stateName } = getLocationDisplayNames(params.state);

  if (!validateLocation(params.state)) {
    notFound();
  }

  const [centerData, stats, cities] = await Promise.all([
    getCentersByState(stateName),
    getLocationStats(stateName),
    getCitiesForState(stateName),
  ]);

  const jsonLd = generateLocationJsonLd({
    stateName,
    totalCenters: stats.totalCenters,
    url: `https://dialisis.my/lokasi/${params.state}`,
  });

  const faqJsonLd = generateLocationFaqJsonLd(stateName);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="container mx-auto px-4 py-8">
        <LocationPageHeader
          stateName={stateName}
          stateSlug={params.state}
          totalCenters={stats.totalCenters}
          stats={{
            mohCenters: stats.mohCenters,
            privateCenters: stats.privateCenters,
            hepatitisBCenters: stats.hepatitisBCenters,
            hepatitisCCenters: stats.hepatitisCCenters,
          }}
        />

        {cities.length > 0 && (
          <section className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Bandar di {stateName}
            </h3>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={city.slug}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  {city.name}
                  <span className="text-xs text-primary/70">
                    ({city.centerCount})
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Senarai Pusat Dialisis
          </h2>
          {centerData.centers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {centerData.centers.map((center) => (
                <CenterCard key={center.id} {...center} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                Tiada pusat dialisis dijumpai di {stateName}
              </div>
            </div>
          )}
        </div>

        <LocationSeoContent stateName={stateName} stats={stats} />

        <Suspense fallback={null}>
          {/* @ts-expect-error Server Component */}
          <CrossLocationLinks stateName={stateName} stateSlug={params.state} />
        </Suspense>

        <RelatedBlogPosts treatmentTypes={["hd", "pd"]} locale="ms" limit={3} />
      </div>
    </>
  );
}
