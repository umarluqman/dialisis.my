import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CenterCard } from "@/components/center-card";
import { CenterCardSkeleton } from "@/components/center-card-skeleton";
import { LocationPageHeader } from "@/components/location-page-header";
import { LocationSeoContent } from "@/components/location-seo-content";
import { getCentersByCity, getLocationStats } from "@/lib/location-queries";
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
    city: string;
  };
}

// Generate static params for all cities
export async function generateStaticParams({
  params,
}: {
  params: { state: string };
}) {
  const allParams = generateAllLocationParams();

  // Filter to get only city-level params for this state
  const cityParams = allParams
    .filter((param) => param.city && param.state === params.state)
    .map((param) => ({
      city: param.city!,
    }));

  return cityParams;
}

// Generate metadata for city pages
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stateName, cityName } = getLocationDisplayNames(
    params.state,
    params.city
  );

  if (!validateLocation(params.state, params.city)) {
    return {
      title: "Not Found",
      description: "The page you're looking for doesn't exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const stats = await getLocationStats(stateName, cityName);
  const canonicalUrl = `https://dialisis.my/lokasi/${params.state}/${params.city}`;

  return {
    title: `Pusat Dialisis di ${cityName}, ${stateName} - ${stats.totalCenters} Pusat Tersedia`,
    description: `Cari pusat dialisis di ${cityName}, ${stateName}. Terdapat ${stats.totalCenters} pusat dialisis termasuk ${stats.mohCenters} pusat MOH dan ${stats.privateCenters} pusat swasta. Maklumat lengkap lokasi, telefon dan perkhidmatan.`,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      `dialisis ${cityName?.toLowerCase()} ${stateName.toLowerCase()}`,
      `pusat dialisis ${cityName?.toLowerCase()}`,
      `hemodialisis ${cityName?.toLowerCase()}`,
      `rawatan buah pinggang ${cityName?.toLowerCase()}`,
      `dialysis center ${cityName?.toLowerCase()}`,
      `kidney treatment ${cityName?.toLowerCase()}`,
    ],
    openGraph: {
      title: `Pusat Dialisis di ${cityName}, ${stateName} - ${stats.totalCenters} Pusat Tersedia`,
      description: `Cari pusat dialisis di ${cityName}, ${stateName}. Terdapat ${stats.totalCenters} pusat dialisis dengan maklumat lengkap lokasi, telefon dan perkhidmatan.`,
      url: canonicalUrl,
      siteName: "Dialisis MY",
      locale: "ms_MY",
      type: "website",
      images: [
        {
          url: `https://dialisis.my/og-image.png`,
          width: 1200,
          height: 630,
          alt: `Pusat Dialisis di ${cityName}, ${stateName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Pusat Dialisis di ${cityName}, ${stateName} - ${stats.totalCenters} Pusat Tersedia`,
      description: `Cari pusat dialisis di ${cityName}, ${stateName}. Terdapat ${stats.totalCenters} pusat dialisis dengan maklumat lengkap.`,
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

export default async function CityPage({ params }: Props) {
  const { stateName, cityName } = getLocationDisplayNames(
    params.state,
    params.city
  );

  // Validate the location exists
  if (!validateLocation(params.state, params.city)) {
    notFound();
  }

  // Fetch centers and stats
  const [centerData, stats] = await Promise.all([
    getCentersByCity(stateName, cityName!),
    getLocationStats(stateName, cityName),
  ]);

  const jsonLd = generateLocationJsonLd({
    stateName,
    cityName,
    totalCenters: stats.totalCenters,
    url: `https://dialisis.my/lokasi/${params.state}/${params.city}`,
  });

  const faqJsonLd = generateLocationFaqJsonLd(stateName, cityName);

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
          cityName={cityName}
          stateSlug={params.state}
          totalCenters={stats.totalCenters}
          stats={{
            mohCenters: stats.mohCenters,
            privateCenters: stats.privateCenters,
            hepatitisBCenters: stats.hepatitisBCenters,
            hepatitisCCenters: stats.hepatitisCCenters,
          }}
        />

        {/* Centers Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Senarai Pusat Dialisis
          </h2>

          {centerData.centers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {centerData.centers.map((center) => (
                <Suspense key={center.id} fallback={<CenterCardSkeleton />}>
                  <CenterCard {...center} />
                </Suspense>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                Tiada pusat dialisis dijumpai di {cityName}
              </div>
              <Link
                href={`/lokasi/${params.state}`}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Lihat semua pusat dialisis di {stateName}
              </Link>
            </div>
          )}
        </div>

        <LocationSeoContent
          stateName={stateName}
          cityName={cityName}
          stats={stats}
        />
      </div>
    </>
  );
}
