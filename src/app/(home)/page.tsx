import { prisma } from "@/lib/db";
import { jsonLdHome } from "@/lib/json-ld";
import { getUserAgent } from "@/lib/user-agent";
import { Loader2 } from "lucide-react";
import { headers } from "next/headers";
import { Suspense } from "react";
import { DialysisCenterList } from "./dialysis-center-list";
import { DialysisQuiz } from "./dialysis-quiz";

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
      sector: {
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
      orderBy: {
        dialysisCenterName: "asc",
      },
    }),
    prisma.dialysisCenter.count({
      where,
    }),
  ]);

  const centers = rawCenters.map((center) => ({
    ...center,
    state: {
      ...center.state,
      name: center.state.name.replace(/-/g, " "),
    },
  }));

  return {
    centers,
    totalPages: Math.ceil(total / take),
    currentPage: page,
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
  const initialData = await getInitialCenters(
    page,
    sector,
    state,
    treatment,
    city,
    doctor,
    name,
    hepatitis
  );
  console.log("initialData", initialData);

  // Get user agent to determine device type
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = getUserAgent(userAgent).isMobile;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHome) }}
      />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        }
      >
        {isMobile ? (
          <DialysisQuiz initialData={initialData} />
        ) : (
          <DialysisCenterList initialData={initialData} />
        )}
      </Suspense>
    </>
  );
}
