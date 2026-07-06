import { LocationDirectory } from "@/components/location-directory";
import { prisma } from "@/lib/db";
import { jsonLdHome } from "@/lib/json-ld";
import { getDbStateName } from "@/lib/location-utils";
import { buildTreatmentUnitsWhere } from "@/lib/treatment-units";
import type { Prisma } from "@/generated/prisma/client";
import { CheckCircle, Loader2 } from "lucide-react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

export const revalidate = 3600;
const MAX_SEARCH_TOKENS = 6;

function getSearchTokens(rawValue?: string) {
  if (!rawValue) return [];

  const normalized = rawValue.trim().replace(/\s+/g, " ");
  if (!normalized) return [];

  const seen = new Set<string>();
  const tokens: string[] = [];

  for (const chunk of normalized.split(/[^\p{L}\p{N}]+/u)) {
    const token = chunk.trim();
    if (!token) continue;

    const key = token.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    tokens.push(token);

    if (tokens.length >= MAX_SEARCH_TOKENS) break;
  }

  return tokens;
}

function buildFlexibleSearchConditions(
  rawValue?: string,
  doctorOnly = false
): Prisma.DialysisCenterWhereInput[] {
  const tokens = getSearchTokens(rawValue);
  if (!tokens.length) return [];

  const tokenFilters = tokens.map((token) => {
    const phoneToken = token.replace(/[^\d]/g, "");
    const tokenConditions: Prisma.DialysisCenterWhereInput[] = doctorOnly
      ? [
          { drInCharge: { contains: token } },
          { panelNephrologist: { contains: token } },
        ]
      : [
          { dialysisCenterName: { contains: token } },
          { title: { contains: token } },
          { drInCharge: { contains: token } },
          { panelNephrologist: { contains: token } },
          { town: { contains: token } },
          { address: { contains: token } },
          { addressWithUnit: { contains: token } },
        ];

    if (phoneToken.length >= 3) {
      tokenConditions.push(
        { phoneNumber: { contains: phoneToken } },
        { tel: { contains: phoneToken } },
        { drInChargeTel: { contains: phoneToken } }
      );
    }

    return { OR: tokenConditions };
  });

  return [{ AND: tokenFilters }];
}

// Dynamically import components with loading fallbacks
const DialysisQuiz = dynamic(
  () => import("./dialysis-quiz").then((mod) => mod.DialysisQuiz),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    ),
    ssr: false, // Only load on client since it's mobile-only
  }
);

const DialysisCenterList = dynamic(
  () => import("./dialysis-center-list").then((mod) => mod.DialysisCenterList),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    ),
  }
);

// Preload data function
async function getInitialCenters(
  page: number = 1,
  sector?: string,
  state?: string,
  treatment?: string,
  city?: string,
  doctor?: string,
  name?: string,
  hepatitis?: string
) {
  const take = 12;
  const skip = (page - 1) * take;

  const andConditions: Prisma.DialysisCenterWhereInput[] = [
    ...(city
      ? [
          {
            OR: [
              { town: { contains: city } },
              { address: { contains: city } },
              { addressWithUnit: { contains: city } },
              { dialysisCenterName: { contains: city } },
              { title: { contains: city } },
            ],
          },
        ]
      : []),
    ...buildFlexibleSearchConditions(name),
    ...buildFlexibleSearchConditions(doctor, true),
  ];

  const where: Prisma.DialysisCenterWhereInput = {
    ...(sector && {
      sector:
        sector === "MOH_PRIVATE"
          ? {
              in: ["MOH", "PRIVATE"],
            }
          : {
              equals: sector.toUpperCase(),
            },
    }),
    ...(state && {
      state: {
        name: {
          equals: getDbStateName(state),
        },
      },
    }),
    ...(buildTreatmentUnitsWhere(treatment) ?? {}),
    ...(hepatitis &&
      hepatitis !== "tiada hepatitis" && {
        hepatitisBay: {
          equals: hepatitis === "b" ? "Hep B" : "Hep C",
        },
      }),
    ...(andConditions.length > 0 && { AND: andConditions }),
  };

  try {
    const [rawCenters, total] = await Promise.all([
      prisma.dialysisCenter.findMany({
        take,
        skip,
        where,
        include: {
          state: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [
          {
            featured: "desc",
          },
          {
            dialysisCenterName: "asc",
          },
        ],
      }),
      prisma.dialysisCenter.count({
        where,
      }),
    ]);

    const centers = rawCenters.map((center: any) => ({
      ...center,
      state: center.state
        ? {
            ...center.state,
            name: center.state.name.replace(/-/g, " "),
          }
        : null,
    }));

    return {
      centers,
      totalPages: Math.ceil(total / take),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching centers:", error);
    return {
      centers: [],
      totalPages: 0,
      currentPage: page,
    };
  }
}

interface MetadataProps {
  searchParams: {
    page?: string;
    sector?: string;
    state?: string;
    treatment?: string;
    city?: string;
    doctor?: string;
    name?: string;
    hepatitis?: string;
  };
}

// Generate metadata
export async function generateMetadata({
  searchParams,
}: MetadataProps): Promise<Metadata> {
  const baseUrl = "https://dialisis.my";
  const hasFilters =
    searchParams.page ||
    searchParams.sector ||
    searchParams.state ||
    searchParams.treatment ||
    searchParams.city ||
    searchParams.doctor ||
    searchParams.name ||
    searchParams.hepatitis;

  // Build current URL with params for self-referencing canonical
  const params = new URLSearchParams();
  if (searchParams.page) params.set("page", searchParams.page);
  if (searchParams.sector) params.set("sector", searchParams.sector);
  if (searchParams.state) params.set("state", searchParams.state);
  if (searchParams.treatment) params.set("treatment", searchParams.treatment);
  if (searchParams.city) params.set("city", searchParams.city);
  if (searchParams.doctor) params.set("doctor", searchParams.doctor);
  if (searchParams.name) params.set("name", searchParams.name);
  if (searchParams.hepatitis) params.set("hepatitis", searchParams.hepatitis);

  const currentUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

  if (hasFilters) {
    return {
      title: "Cari Pusat Dialisis Berdekatan Dengan Mudah",
      description:
        "Dapatkan maklumat lengkap tentang pusat dialisis di Malaysia mengikut negeri, bandar, dan jenis rawatan dengan mudah.",
      robots: { index: false, follow: true },
      alternates: {
        canonical: currentUrl,
      },
    };
  }

  return {
    title: "Cari Pusat Dialisis Berdekatan Dengan Mudah",
    description:
      "Dapatkan maklumat lengkap tentang pusat dialisis di Malaysia mengikut negeri, bandar, dan jenis rawatan dengan mudah.",
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: "Cari Pusat Dialisis | Dialisis.my",
      description:
        "Cari pusat dialisis di Malaysia mengikut negeri, bandar, dan jenis rawatan.",
      url: baseUrl,
      type: "website",
      siteName: "dialisis.my",
      locale: "ms_MY",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Cari pusat dialisis di Malaysia",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Cari Pusat Dialisis | Dialisis.my",
      description:
        "Cari pusat dialisis di Malaysia mengikut negeri, bandar, dan jenis rawatan.",
      images: [`${baseUrl}/og-image.png`],
    },
  };
}

export default async function DialysisCenterDirectory({
  searchParams,
}: {
  searchParams: {
    page?: string;
    sector?: string;
    state?: string;
    treatment?: string;
    city?: string;
    doctor?: string;
    name?: string;
    hepatitis?: string;
  };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { sector, state, treatment, city, doctor, name, hepatitis } =
    searchParams;

  // Preload data in parallel
  const initialDataPromise = getInitialCenters(
    page,
    sector,
    state,
    treatment,
    city,
    doctor,
    name,
    hepatitis
  );

  // Preload critical resources
  const initialData = await initialDataPromise;

  return (
    <>
      {/* Hero Section */}
      <div className="text-center py-8 md:py-12 px-4">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
          Pusat Dialisis di Malaysia
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-6">
          Cari lebih daripada 900 pusat dialisis berdekatan dengan anda.
          Maklumat lengkap untuk membantu anda membuat keputusan yang tepat.
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-primary">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4" /> Maklumat Terkini
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4" /> Sumber Rasmi
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4" /> Seluruh Malaysia
          </span>
        </div>
      </div>

      {/* Add JSON-LD with streaming */}
      <Suspense>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHome) }}
        />
      </Suspense>

      {/* Use client-side detection with optimized loading */}
      <div className="block md:hidden">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="space-y-4 w-full max-w-md mx-auto px-4">
                <div className="h-8 bg-zinc-100 rounded animate-pulse" />
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-12 bg-zinc-100 rounded animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <DialysisQuiz initialData={initialData} />
        </Suspense>
      </div>
      <div className="hidden md:block">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto p-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-48 bg-zinc-100 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          }
        >
          <DialysisCenterList initialData={initialData} />
        </Suspense>
      </div>

      <Suspense fallback={null}>
        {/* @ts-expect-error Server Component */}
        <LocationDirectory />
      </Suspense>
    </>
  );
}
