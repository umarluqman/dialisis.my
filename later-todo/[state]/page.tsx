import { StatePagination } from "@/components/state-pagination";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import { Suspense } from "react";

// SEO metadata
export async function generateMetadata({
  params,
}: {
  params: { state: string };
}): Promise<Metadata> {
  return { title: `Dialysis Centers in ${params.state}` };
}

// Like getStaticPaths
export async function generateStaticParams() {
  const states = await prisma.state.findMany();
  return states.map((state) => ({
    state: state.name.replace(/\s+/g, "-").toLowerCase(),
  }));
}

const ITEMS_PER_PAGE = 10;

async function getDialysisCenters(
  state: string,
  page: number = 1,
  treatment?: string
) {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const whereClause: any = {
    state: {
      name: state,
    },
  };

  if (treatment?.toLowerCase() === "hemodialysis") {
    whereClause.units = { contains: "HD" };
  } else if (treatment?.toLowerCase() === "peritoneal dialysis") {
    whereClause.units = { contains: "PD" };
  } else if (treatment?.toLowerCase() === "transplant") {
    whereClause.units = { contains: "TX" };
  } else if (treatment?.toLowerCase() === "mrrb") {
    whereClause.units = { contains: "MRRB" };
  }

  const [centers, total] = await Promise.all([
    prisma.dialysisCenter.findMany({
      where: whereClause,
      include: { state: true },
      take: ITEMS_PER_PAGE,
      skip,
      orderBy: { dialysisCenterName: "asc" },
    }),
    prisma.dialysisCenter.count({ where: whereClause }),
  ]);

  return {
    centers,
    totalPages: Math.ceil(total / ITEMS_PER_PAGE),
  };
}

export default async function StateLayout({
  params,
  searchParams,
}: {
  params: { state: string };
  searchParams: { page?: string; treatment?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const { centers, totalPages } = await getDialysisCenters(
    params.state,
    currentPage,
    searchParams.treatment
  );

  if (!centers || centers.length === 0) {
    return <p>No dialysis centers found for: {params.state}</p>;
  }

  return (
    <div className="min-h-screen">
      <Suspense fallback={<div>Loading centers...</div>}>
        <StatePagination
          initialData={centers}
          state={params.state}
          totalPages={totalPages}
          currentPage={currentPage}
          treatment={searchParams.treatment}
        />
      </Suspense>
    </div>
  );
}
