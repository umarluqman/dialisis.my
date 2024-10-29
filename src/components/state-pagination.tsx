"use client";

import Link from "next/link";
import { CenterCard } from "./center-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface StatePaginationProps {
  initialData: any[];
  state: string;
  totalPages: number;
  currentPage: number;
  treatment?: string;
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

export function StatePagination({
  initialData,
  state,
  totalPages,
  currentPage,
  treatment,
}: StatePaginationProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-8 max-w-screen-xl mx-auto">
        {initialData.map((item) => (
          <Link href={`/${state}/${item.town.toLowerCase()}`} key={item.id}>
            <CenterCard
              name={item.dialysisCenterName}
              city={item.town}
              state={item.state.name}
              website={item.website ?? ""}
              units={item.units ?? []}
              hepatitisBay={item.hepatitisBay ?? ""}
              sector={item.sector ?? ""}
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
                href={`/${state}?page=${currentPage - 1}${
                  treatment ? `&treatment=${treatment}` : ""
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
                  href={`/${state}?page=${page}${
                    treatment ? `&treatment=${treatment}` : ""
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
                href={`/${state}?page=${currentPage + 1}${
                  treatment ? `&treatment=${treatment}` : ""
                }`}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
