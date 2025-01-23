"use client";

import { CenterCard } from "@/components/center-card";
import { CenterCardSkeleton } from "@/components/center-card-skeleton";
import FilterLayout from "@/components/filter-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CITIES, SECTOR, STATES, TREATMENT_TYPES } from "@/constants";
import { ArrowRight, SearchX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useTransition,
} from "react";

// Memoize components that don't need frequent updates
const MemoizedCenterCard = memo(CenterCard);
const MemoizedPaginationItem = memo(PaginationItem);

interface DialysisCenterListProps {
  initialData: {
    centers: any[];
    totalPages: number;
    currentPage: number;
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

export function DialysisCenterList({ initialData }: DialysisCenterListProps) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Memoize state setters
  const [stateParam, setStateParam] = useQueryState("state", {
    shallow: true,
  });
  const [cityParam, setCityParam] = useQueryState("city", {
    shallow: true,
  });
  const [treatment, setTreatmentParam] = useQueryState("treatment", {
    shallow: true,
  });
  const [doctorName, setDoctorName] = useQueryState("doctor");
  const [name, setName] = useQueryState("name");
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({
      shallow: false,
    })
  );
  const [sector, setSector] = useQueryState("sector", {
    shallow: true,
    parse: (value) => value.toUpperCase(),
  });

  // Memoize derived state
  const state = useMemo(
    () =>
      stateParam
        ? decodeURIComponent(stateParam)
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : undefined,
    [stateParam]
  );

  // Scroll position management
  useEffect(() => {
    const scrollPosition = sessionStorage.getItem(
      `scroll-${searchParams.toString()}`
    );

    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition));
      sessionStorage.removeItem(`scroll-${searchParams.toString()}`);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem(
        `scroll-${searchParams.toString()}`,
        window.scrollY.toString()
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [searchParams]);

  // Memoize handlers with synchronous transitions
  const handleStateChange = useCallback(
    (value: string) => {
      startTransition(() => {
        setPage(1);
        if (value === "semua negeri / wilayah") {
          setStateParam(null);
          setCityParam(null);
        } else {
          setStateParam(value.toLowerCase());
          setCityParam(null);
        }
      });
    },
    [setPage, setStateParam, setCityParam]
  );

  const handleCityChange = useCallback(
    (value: string) => {
      startTransition(() => {
        setPage(1);
        if (value === "semua bandar") {
          setCityParam(null);
        } else {
          setCityParam(value.toLowerCase());
        }
      });
    },
    [setPage, setCityParam]
  );

  const handleTreatmentChange = useCallback(
    (value: string) => {
      startTransition(() => {
        setPage(1);
        if (value === "semua rawatan") {
          setTreatmentParam(null);
        } else {
          setTreatmentParam(value);
        }
      });
    },
    [setPage, setTreatmentParam]
  );

  const handleSectorChange = useCallback(
    (value: string) => {
      startTransition(() => {
        setPage(1);
        if (value === "semua sektor") {
          setSector(null);
        } else {
          setSector(value.toUpperCase());
        }
      });
    },
    [setPage, setSector]
  );

  const handleSearch = useCallback(() => {
    window.location.href = window.location.pathname + window.location.search;
  }, []);

  // Memoize centers grid to prevent unnecessary re-renders
  const centersGrid = useMemo(() => {
    if (initialData.centers.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-12">
          <SearchX className="w-12 h-12 text-zinc-400" />
          <h3 className="mt-4 text-lg font-semibold text-zinc-950">
            Tiada Pusat Dialisis
          </h3>
          <p className="mt-1 text-sm text-zinc-600">
            Maaf, tiada pusat dialisis yang memenuhi kriteria carian anda.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {initialData.centers.map((center) => (
          <Suspense key={center.id} fallback={<CenterCardSkeleton />}>
            <MemoizedCenterCard {...center} />
          </Suspense>
        ))}
      </div>
    );
  }, [initialData.centers]);

  return (
    <FilterLayout>
      <div className="flex flex-col bg-white lg:w-fit md:mx-auto py-8 md:p-8 border-b-0">
        <div className="pt-4 mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_150px] justify-items-center gap-3 max-w-7xl md:mx-auto px-4">
          <div className="w-full">
            <Input
              type="text"
              placeholder="Nama Pusat Dialisis"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="w-full">
            <Select
              defaultValue={
                stateParam?.toLowerCase() || "semua negeri / wilayah"
              }
              onValueChange={handleStateChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih negeri / wilayah" />
              </SelectTrigger>
              <SelectContent>
                {STATES.map((state) => (
                  <SelectItem key={state} value={state.toLowerCase()}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Select
              onValueChange={handleCityChange}
              defaultValue={cityParam?.toLowerCase() || "semua bandar"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih bandar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key={"all"} value={"semua bandar".toLowerCase()}>
                  Semua Bandar
                </SelectItem>
                {state &&
                  CITIES?.[state]?.map((city: string) => (
                    <SelectItem key={city} value={city.toLowerCase()}>
                      {city}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Select
              key="rawatan"
              onValueChange={handleTreatmentChange}
              defaultValue={treatment?.toLowerCase() || "semua rawatan"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key={"all"} value={"semua rawatan".toLowerCase()}>
                  Semua Rawatan
                </SelectItem>
                {TREATMENT_TYPES?.map((treatment: string) => (
                  <SelectItem key={treatment} value={treatment.toLowerCase()}>
                    {treatment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <Input
              type="text"
              placeholder="Nama Doktor Bertugas"
              value={doctorName || ""}
              onChange={(e) => setDoctorName(e.target.value)}
            />
          </div>
          <div className="w-full">
            <Select
              key="sektor"
              onValueChange={handleSectorChange}
              defaultValue={sector || "semua sektor"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key={"all"} value={"semua sektor"}>
                  Semua Sektor
                </SelectItem>
                {SECTOR?.map((sector: string) => (
                  <SelectItem key={sector} value={sector.toUpperCase()}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            className="mb-8 mt-2"
            onClick={handleSearch}
            disabled={isPending}
          >
            {isPending ? "Mencari..." : "Cari Pusat Dialisis"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {centersGrid}

      <Pagination className="my-16 cursor-pointer">
        <PaginationContent>
          {initialData.currentPage > 1 && (
            <MemoizedPaginationItem>
              <PaginationPrevious
                onClick={() => setPage(initialData.currentPage - 1)}
              />
            </MemoizedPaginationItem>
          )}

          {getVisiblePages(initialData.currentPage, initialData.totalPages).map(
            (pageNum, index) => (
              <MemoizedPaginationItem key={index}>
                {pageNum === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => setPage(Number(pageNum))}
                    isActive={initialData.currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </MemoizedPaginationItem>
            )
          )}

          {initialData.currentPage < initialData.totalPages && (
            <MemoizedPaginationItem>
              <PaginationNext
                onClick={() => setPage(initialData.currentPage + 1)}
              />
            </MemoizedPaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </FilterLayout>
  );
}
