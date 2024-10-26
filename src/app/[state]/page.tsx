import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { MailIcon, PhoneCallIcon } from "lucide-react";
import Link from "next/link";

// SEO metadata
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
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const whereClause: any = {
    state: {
      name: state,
    },
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
            <Card className="shadow-sm hover:border-primary transition-shadow">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p className="text-primary mb-4">{item.address}</p>
                <div className="flex gap-2 items-center">
                  <PhoneCallIcon className="w-4 h-4" />
                  <p className="text-primary">{item.tel}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <MailIcon className="w-4 h-4" />
                  <p className="text-primary">{item.email}</p>
                </div>
              </CardContent>
            </Card>
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
