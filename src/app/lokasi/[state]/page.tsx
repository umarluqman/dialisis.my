import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { LocationPageHeader } from "@/components/location-page-header";
import { LocationSeoContent } from "@/components/location-seo-content";
import { StateCenterList } from "@/components/state-center-list";
import { getCentersByState, getLocationStats } from "@/lib/location-queries";
import { generateLocationJsonLd } from "@/lib/location-seo";
import {
  generateAllLocationParams,
  getLocationDisplayNames,
  getTownsForState,
  validateLocation,
} from "@/lib/location-utils";

interface Props {
  params: {
    state: string;
  };
  searchParams: {
    town?: string;
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

  // Validate the location exists
  if (!validateLocation(params.state)) {
    notFound();
  }

  // Get available towns for this state
  const availableTowns = getTownsForState(stateName);

  // Fetch initial centers and stats (without town filter for initial load)
  const [centerData, stats] = await Promise.all([
    getCentersByState(stateName),
    getLocationStats(stateName),
  ]);

  const jsonLd = generateLocationJsonLd({
    stateName,
    totalCenters: stats.totalCenters,
    url: `https://dialisis.my/lokasi/${params.state}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

        {/* Client-side Center List with Town Filter */}
        <Suspense fallback={<div>Loading...</div>}>
          <StateCenterList
            initialData={{
              centers: centerData.centers,
              totalCenters: centerData.totalCenters,
            }}
            stateName={stateName}
            stateSlug={params.state}
            availableTowns={availableTowns}
          />
        </Suspense>

        <LocationSeoContent stateName={stateName} stats={stats} />
      </div>
    </>
  );
}
