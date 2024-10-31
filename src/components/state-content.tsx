"use client";
import { StatePagination } from "./state-pagination";

export function StateContent({
  centers,
  state,
  totalPages,
  currentPage,
  treatment,
}: {
  centers: any[];
  state: string;
  totalPages: number;
  currentPage: number;
  treatment?: string;
}) {
  return (
    <StatePagination
      initialData={centers}
      state={state}
      totalPages={totalPages}
      currentPage={currentPage}
      treatment={treatment}
    />
  );
}
