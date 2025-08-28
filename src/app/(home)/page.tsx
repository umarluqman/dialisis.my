import { prisma } from "@/lib/db";
import { jsonLdHome } from "@/lib/json-ld";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

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

  const treatmentMap = {
    hemodialisis: "HD Unit",
    transplant: "TX Unit",
    mrrb: "MRRB Unit",
    "peritoneal dialisis": "PD Unit",
  };

  const where = {
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
          equals: state.replace(/\s+/g, "-"),
        },
      },
    }),
    ...(treatment && {
      units: {
        contains: treatmentMap[treatment as keyof typeof treatmentMap],
      },
    }),
    ...(city && {
      OR: [
        { town: { contains: city } },
        { address: { contains: city } },
        { addressWithUnit: { contains: city } },
        { dialysisCenterName: { contains: city } },
        { title: { contains: city } },
      ],
    }),
    ...(doctor && {
      drInCharge: {
        contains: doctor,
      },
    }),
    ...(name && {
      dialysisCenterName: {
        contains: name,
      },
    }),
    ...(hepatitis &&
      hepatitis !== "tiada hepatitis" && {
        hepatitisBay: {
          equals: hepatitis === "b" ? "Hep B" : "Hep C",
        },
      }),
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

// Add preload hints for critical resources
const preloadResources = [
  { href: "/fonts/your-font.woff2", as: "font", type: "font/woff2" },
];

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  const canonicalUrl = "https://dialisis.my";

  return {
    title: "Cari Pusat Dialisis Berdekatan Dengan Mudah",
    description:
      "Dapatkan maklumat lengkap tentang pusat dialisis di Malaysia mengikut negeri, bandar, dan jenis rawatan dengan mudah.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Cari Pusat Dialisis | Dialisis.my",
      description:
        "Cari pusat dialisis di Malaysia mengikut negeri, bandar, dan jenis rawatan.",
      url: canonicalUrl,
      type: "website",
      siteName: "dialisis.my",
      locale: "ms_MY",
    },
    twitter: {
      card: "summary_large_image",
      title: "Cari Pusat Dialisis | Dialisis.my",
      description:
        "Cari pusat dialisis di Malaysia mengikut negeri, bandar, dan jenis rawatan.",
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
      {/* Add resource hints */}
      {preloadResources.map((resource) => (
        <link
          key={resource.href}
          rel="preload"
          href={resource.href}
          as={resource.as}
          type={resource.type}
          crossOrigin="anonymous"
        />
      ))}

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
    </>
  );
}
