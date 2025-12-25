import { Link } from "@/i18n/routing";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CenterCard } from "@/components/center-card";
import { CenterCardSkeleton } from "@/components/center-card-skeleton";
import { LocationPageHeader } from "@/components/location-page-header";
import { LocationSeoContent } from "@/components/location-seo-content";
import { getCentersByCity, getLocationStats } from "@/lib/location-queries";
import { generateLocationJsonLd } from "@/lib/location-seo";
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
  const t = await getTranslations("location.metadata.city");
  const locale = await getLocale();
  const { stateName, cityName } = getLocationDisplayNames(
    params.state,
    params.city
  );

  if (!validateLocation(params.state, params.city)) {
    return {
      title: t("notFoundTitle"),
      description: t("notFoundDescription"),
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const stats = await getLocationStats(stateName, cityName);
  const canonicalUrl = `https://dialisis.my/lokasi/${params.state}/${params.city}`;
  const ogLocale = locale === "ms" ? "ms_MY" : "en_US";
  const displayCityName = cityName || params.city;

  return {
    title: t("title", {
      cityName: displayCityName,
      stateName,
      total: stats.totalCenters,
    }),
    description: t("description", {
      cityName: displayCityName,
      stateName,
      total: stats.totalCenters,
      moh: stats.mohCenters,
      private: stats.privateCenters,
    }),
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      `dialisis ${displayCityName?.toLowerCase()} ${stateName.toLowerCase()}`,
      `pusat dialisis ${displayCityName?.toLowerCase()}`,
      `hemodialisis ${displayCityName?.toLowerCase()}`,
      `rawatan buah pinggang ${displayCityName?.toLowerCase()}`,
      `dialysis center ${displayCityName?.toLowerCase()}`,
      `kidney treatment ${displayCityName?.toLowerCase()}`,
    ],
    openGraph: {
      title: t("ogTitle", { cityName: displayCityName, stateName, total: stats.totalCenters }),
      description: t("ogDescription", {
        cityName: displayCityName,
        stateName,
        total: stats.totalCenters,
      }),
      url: canonicalUrl,
      siteName: t("siteName"),
      locale: ogLocale,
      type: "website",
      images: [
        {
          url: `https://dialisis.my/og-image.png`,
          width: 1200,
          height: 630,
          alt: t("ogImageAlt", { cityName: displayCityName, stateName }),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle", { cityName: displayCityName, stateName, total: stats.totalCenters }),
      description: t("twitterDescription", { cityName: displayCityName, stateName }),
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
  const displayCityName = cityName || params.city;
  const tList = useTranslations("location.stateList");
  const tCity = useTranslations("location.cityPage");

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
    cityName: displayCityName,
    totalCenters: stats.totalCenters,
    url: `https://dialisis.my/lokasi/${params.state}/${params.city}`,
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
          cityName={displayCityName}
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
            {tList("listTitleTown", { town: displayCityName })}
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
                {tCity("empty", { cityName: displayCityName })}
              </div>
              <Link
                href={`/lokasi/${params.state}`}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {tCity("viewState", { stateName })}
              </Link>
            </div>
          )}
        </div>

        <LocationSeoContent
          stateName={stateName}
          cityName={displayCityName}
          stats={stats}
        />
      </div>
    </>
  );
}
