import FilterLayout from "@/components/filter-layout";
import { prisma } from "@/lib/db";

const ITEMS_PER_PAGE = 10;

async function getDialysisCenters(page: number = 1) {
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const [centers, total] = await Promise.all([
    prisma.dialysisCenter.findMany({
      take: ITEMS_PER_PAGE,
      skip,
      orderBy: {
        dialysisCenterName: "asc",
      },
    }),
    prisma.dialysisCenter.count(),
  ]);

  return {
    centers,
    totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
  };
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const delta = 2; // Number of pages to show before and after current page
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

export default async function DialysisCenterDirectory({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const { centers: data, totalPages } = await getDialysisCenters(currentPage);

  return (
    <FilterLayout>
      {/* <div className="min-h-screen bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grid-rows-[repeat(auto-fill,minmax(0,auto))] mb-8">
          {data.map((item) => {
            const units = item.units.split(",");
            const isHemodialysis = units.includes("HD");

            return (
              <Card
                key={item.id}
                className="shadow-sm hover:border-primary transition-shadow"
              >
                <CardHeader className="flex items-center">
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
            );
          })}
        </div>

        <Pagination className="mb-8">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious href={`?page=${currentPage - 1}`} />
              </PaginationItem>
            )}

            {getVisiblePages(currentPage, totalPages).map((page, index) => (
              <PaginationItem key={index}>
                {page === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href={`?page=${page}`}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext href={`?page=${currentPage + 1}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div> */}
    </FilterLayout>
  );
}
