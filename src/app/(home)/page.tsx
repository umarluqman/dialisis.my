import { prisma } from "@/lib/db";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { DialysisCenterList } from "./dialysis-center-list";

async function getInitialCenters(
  page: number = 1,
  sector?: string,
  state?: string,
  treatment?: string,
  town?: string,
  doctor?: string,
  name?: string
) {
  const take = 10;
  const skip = (page - 1) * take;

  const treatmentMap = {
    hemodialysis: "HD Unit",
    transplant: "TX Unit",
    mrrb: "MRRB Unit",
    "peritoneal dialysis": "PD Unit",
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
    ...(town && {
      OR: [
        { town: { contains: town } },
        { address: { contains: town } },
        { addressWithUnit: { contains: town } },
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
  };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { sector, state, treatment, city, doctor, name } = searchParams;
  const initialData = await getInitialCenters(
    page,
    sector,
    state,
    treatment,
    city,
    doctor,
    name
  );

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      }
    >
      <DialysisCenterList initialData={initialData} />
    </Suspense>
  );
}
