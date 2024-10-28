import { CenterCard } from "@/components/center-card";
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

// SEO metadata
import type { Metadata } from "next";
export async function generateMetadata({
  params,
}: {
  params: { state: string; city: string };
}): Promise<Metadata> {
  return { title: `Dialysis Centers in ${params.city}, ${params.state}` };
}

// Like getStaticPaths
export async function generateStaticParams() {
  const centers = await prisma.dialysisCenter.findMany({
    select: {
      state: { select: { name: true } },
      town: true,
    },
    distinct: ["stateId", "town"],
  });

  return centers.map((center) => ({
    state: center.state.name.toLowerCase(),
    city: center.town,
  }));
}

const ITEMS_PER_PAGE = 10;

async function getDialysisCenters(
  state: string,
  page: number = 1,
  treatment?: string,
  town?: string
) {
  const skip = (page - 1) * ITEMS_PER_PAGE;

  // Capitalize each word in town and replace dashes with spaces
  if (town) {
    town = town
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const whereClause: any = {
    state: {
      name: state,
    },
    town: town, // Add town filter
  };

  // Add treatment filter if specified
  if (treatment === "hemodialysis") {
    whereClause.units = {
      contains: "HD",
    };
  } else if (treatment === "peritoneal dialysis") {
    whereClause.units = {
      contains: "PD",
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

async function debugDatabase() {
  // Get all unique towns
  const towns = await prisma.dialysisCenter.findMany({
    select: {
      town: true,
      state: {
        select: {
          name: true,
        },
      },
    },
    distinct: ["town", "stateId"],
  });

  console.log(
    "Available towns in database:",
    towns.map((t) => ({
      town: t.town,
      state: t.state.name,
    }))
  );
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

const CityLayout = async ({
  params,
  searchParams,
}: {
  params: { state: string; city: string };
  searchParams: { page?: string; treatment?: string };
}) => {
  const currentPage = Number(searchParams.page) || 1;
  const { centers: data, totalPages } = await getDialysisCenters(
    params.state,
    currentPage,
    searchParams.treatment,
    params.city // Add town parameter
  );

  if (!data || data.length === 0) {
    return (
      <p>
        No dialysis centers found in {params.city}, {params.state}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-8 max-w-screen-xl mx-auto">
        {data.map((item) => (
          <CenterCard
            key={item.id}
            id={item.id}
            name={item.dialysisCenterName}
            address={item.address}
            tel={item.tel}
            email={item?.email || undefined}
            state={params.state}
            city={params.city}
            units={item.units}
            hepatitisBay={item.hepatitisBay}
            sector={item.sector}
            treatment={searchParams.treatment}
          />
        ))}
      </div>

      <Pagination className="mb-8">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href={`/${params.state}/${params.city}?page=${currentPage - 1}${
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
                  href={`/${params.state}/${params.city}?page=${page}${
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
                href={`/${params.state}/${params.city}?page=${currentPage + 1}${
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

export default CityLayout;
