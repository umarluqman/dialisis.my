import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { prisma } from "@/lib/db";
import Link from "next/link";

// SEO metadata
import { CenterCard } from "@/components/center-card";
import type { Metadata } from "next";
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
  console.log({ state, page, treatment });
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const whereClause: any = {
    state: {
      name: state,
    },
  };

  // Add treatment filter if specified
  if (treatment?.toLowerCase() === "hemodialysis") {
    whereClause.units = {
      contains: "HD",
    };
  } else if (treatment?.toLowerCase() === "peritoneal dialysis") {
    whereClause.units = {
      contains: "PD",
    };
  } else if (treatment?.toLowerCase() === "transplant") {
    whereClause.units = {
      contains: "TX",
    };
  } else if (treatment?.toLowerCase() === "mrrb") {
    whereClause.units = {
      contains: "MRRB",
    };
  }

  const [centers, total] = await Promise.all([
    prisma.dialysisCenter.findMany({
      where: whereClause,
      include: {
        state: true,
      },
      take: ITEMS_PER_PAGE,
      skip,
      orderBy: {
        dialysisCenterName: "asc",
      },
    }),
    prisma.dialysisCenter.count({
      where: whereClause,
    }),
  ]);

  return {
    centers,
    totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
  };
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
}

const VariantLayout = async ({
  params,
  searchParams,
}: {
  params: { state: string };
  searchParams: { page?: string; treatment?: string };
}) => {
  console.log({ searchParams });
  const currentPage = Number(searchParams.page) || 1;
  const { centers: data, totalPages } = await getDialysisCenters(
    params.state,
    currentPage,
    searchParams.treatment
  );

  if (!data || data.length === 0) {
    return <p>No dialysis centers found for: {params.state}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-8 max-w-screen-xl mx-auto">
        {data.map((item) => (
          <Link href={`/${encodeURIComponent(item.title)}`} key={item.id}>
            <CenterCard
              name={item.dialysisCenterName}
              city={item.town}
              state={item.state.name}
              website={item.website ?? ""}
              units={item.units ?? []}
              hepatitisBay={item.hepatitisBay ?? ""}
              sector={item.sector ?? ""}
              key={item.id}
              id={item.id}
            />
          </Link>
        ))}
      </div>

      <Pagination className="mb-8">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href={`/${params.state}?page=${currentPage - 1}${
                  searchParams.treatment
                    ? `&treatment=${searchParams.treatment}`
                    : ""
                }`}
              />
            </PaginationItem>
          )}

          {getVisiblePages(currentPage, totalPages).map((page, index) => (
            <PaginationItem key={index}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={`/${params.state}?page=${page}${
                    searchParams.treatment
                      ? `&treatment=${searchParams.treatment}`
                      : ""
                  }`}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext
                href={`/${params.state}?page=${currentPage + 1}${
                  searchParams.treatment
                    ? `&treatment=${searchParams.treatment}`
                    : ""
                }`}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default VariantLayout;
