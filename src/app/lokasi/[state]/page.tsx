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
import { generateLocationJsonLd } from "@/lib/location-seo";
import {
  generateAllLocationParams,
  getLocationDisplayNames,
  validateLocation,
} from "@/lib/location-utils";

interface Props {
  params: {
    state: string;
  };
  searchParams: {
    page?: string | string[];
  };
}

const PAGE_SIZE = 24;

function normalizePage(page?: string | string[]) {
  const rawPage = Array.isArray(page) ? page[0] : page;
  const value = Number(rawPage);
  if (!Number.isInteger(value) || value < 1) return 1;
  return value;
}

function buildPageUrl(state: string, page: number) {
  if (page <= 1) return `/lokasi/${state}`;
  return `/lokasi/${state}?page=${page}`;
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
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
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { stateName } = getLocationDisplayNames(params.state);
  const page = normalizePage(searchParams.page);

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
  const baseUrl = `https://dialisis.my/lokasi/${params.state}`;
  const canonicalUrl = page > 1 ? `${baseUrl}?page=${page}` : baseUrl;
  const titleSuffix = page > 1 ? ` (Halaman ${page})` : "";

  return {
    title: `Pusat Dialisis di ${stateName} - ${stats.totalCenters} Pusat Tersedia${titleSuffix}`,
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
      title: `Pusat Dialisis di ${stateName} - ${stats.totalCenters} Pusat Tersedia${titleSuffix}`,
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
      title: `Pusat Dialisis di ${stateName} - ${stats.totalCenters} Pusat Tersedia${titleSuffix}`,
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

export default async function StatePage({ params, searchParams }: Props) {
  const { stateName } = getLocationDisplayNames(params.state);
  const page = normalizePage(searchParams.page);

  if (!validateLocation(params.state)) {
    notFound();
  }

  const [centerData, stats, cities] = await Promise.all([
    getCentersByState(stateName, undefined, { page, pageSize: PAGE_SIZE }),
    getLocationStats(stateName),
    getCitiesForState(stateName),
  ]);

  if (page > centerData.totalPages && centerData.totalCenters > 0) {
    notFound();
  }

  const currentUrl =
    page > 1
      ? `https://dialisis.my/lokasi/${params.state}?page=${page}`
      : `https://dialisis.my/lokasi/${params.state}`;

  const jsonLd = generateLocationJsonLd({
    stateName,
    totalCenters: stats.totalCenters,
    url: currentUrl,
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

        {cities.length > 0 && (
          <section className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {["Kuala Lumpur", "Labuan", "Putrajaya"].includes(stateName)
                ? stateName
                : `Bandar di ${stateName}`}
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
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {centerData.centers.map((center) => (
                  <CenterCard key={center.id} {...center} />
                ))}
              </div>

              {centerData.totalPages > 1 && (
                <nav
                  className="mt-8 flex flex-wrap items-center justify-center gap-2"
                  aria-label="Navigasi halaman pusat dialisis"
                >
                  {page > 1 && (
                    <Link
                      href={buildPageUrl(params.state, page - 1)}
                      rel="prev"
                      className="px-3 py-1.5 rounded-md border border-border text-sm hover:bg-muted"
                    >
                      Sebelum
                    </Link>
                  )}

                  {getVisiblePages(page, centerData.totalPages).map(
                    (pageNumber) => (
                      <Link
                        key={pageNumber}
                        href={buildPageUrl(params.state, pageNumber)}
                        aria-current={pageNumber === page ? "page" : undefined}
                        className={`px-3 py-1.5 rounded-md border text-sm ${
                          pageNumber === page
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        {pageNumber}
                      </Link>
                    )
                  )}

                  {page < centerData.totalPages && (
                    <Link
                      href={buildPageUrl(params.state, page + 1)}
                      rel="next"
                      className="px-3 py-1.5 rounded-md border border-border text-sm hover:bg-muted"
                    >
                      Seterusnya
                    </Link>
                  )}
                </nav>
              )}
            </>
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
