"use client";

import { CenterCard } from "@/components/center-card";
import { CenterCardSkeleton } from "@/components/center-card-skeleton";
import { CenterListItem } from "@/components/center-list-item";
import FilterLayout from "@/components/filter-layout";
import { Badge } from "@/components/ui/badge";
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
import { ChevronDown, Search, SearchX, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

const MemoizedCenterCard = memo(CenterCard);
const MemoizedCenterListItem = memo(CenterListItem);
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

const POPULAR_STATES = ["Selangor", "Kuala Lumpur", "Johor", "Pulau Pinang", "Perak"];

export function DialysisCenterList({ initialData }: DialysisCenterListProps) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  const handleStateChange = useCallback(
    (value: string) => {
      startTransition(() => {
        setPage(1);
        if (value === "semua negeri / wilayah" || value === "all") {
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

  const handleStatePillClick = useCallback(
    (stateName: string) => {
      startTransition(() => {
        setPage(1);
        if (stateParam?.toLowerCase() === stateName.toLowerCase()) {
          setStateParam(null);
          setCityParam(null);
        } else {
          setStateParam(stateName.toLowerCase());
          setCityParam(null);
        }
      });
    },
    [setPage, setStateParam, setCityParam, stateParam]
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

  const featuredCenters = useMemo(
    () => initialData.centers.filter((c) => c.featured),
    [initialData.centers]
  );

  const regularCenters = useMemo(
    () => initialData.centers.filter((c) => !c.featured),
    [initialData.centers]
  );

  const totalCenters = initialData.centers.length;

  return (
    <FilterLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* State Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {POPULAR_STATES.map((stateName) => (
            <button
              key={stateName}
              onClick={() => handleStatePillClick(stateName)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-out-cubic ${
                stateParam?.toLowerCase() === stateName.toLowerCase()
                  ? "bg-primary text-primary-foreground shadow-warm-md"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/10"
              }`}
            >
              {stateName}
            </button>
          ))}
          <Select
            value={
              stateParam && !POPULAR_STATES.map((s) => s.toLowerCase()).includes(stateParam.toLowerCase())
                ? stateParam.toLowerCase()
                : "more"
            }
            onValueChange={(value) => {
              if (value !== "more") {
                handleStateChange(value);
              }
            }}
          >
            <SelectTrigger className="w-auto h-10 px-4 rounded-full border-none bg-secondary text-secondary-foreground hover:bg-primary/10 transition-colors [&>span]:flex [&>svg]:hidden">
              <span className="flex items-center gap-1">
                Lagi
                <ChevronDown className="h-4 w-4" />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Negeri</SelectItem>
              {STATES.filter(
                (s) => !POPULAR_STATES.includes(s) && s !== "Semua Negeri / Wilayah"
              ).map((stateName) => (
                <SelectItem key={stateName} value={stateName.toLowerCase()}>
                  {stateName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="relative flex items-center"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari nama pusat atau doktor..."
              value={name || doctorName || ""}
              onChange={(e) => {
                setName(e.target.value);
                setDoctorName(null);
              }}
              className="pl-12 pr-24 h-12 rounded-xl text-base bg-card border-border shadow-warm-sm focus:shadow-warm-md transition-shadow"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-2 h-8 rounded-lg"
              disabled={isPending}
            >
              {isPending ? "Mencari..." : "Cari"}
            </Button>
          </form>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex justify-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-muted-foreground"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Tapis Lanjutan
            <ChevronDown
              className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                showAdvanced ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="max-w-4xl mx-auto mb-8 p-6 bg-card rounded-xl border border-border shadow-warm-sm animate-fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                  Negeri
                </label>
                <Select
                  value={stateParam?.toLowerCase() || "all"}
                  onValueChange={handleStateChange}
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Pilih negeri" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Negeri</SelectItem>
                    {STATES.filter((s) => s !== "Semua Negeri / Wilayah").map(
                      (stateName) => (
                        <SelectItem
                          key={stateName}
                          value={stateName.toLowerCase()}
                        >
                          {stateName}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                  Bandar
                </label>
                <Select
                  value={cityParam?.toLowerCase() || "semua bandar"}
                  onValueChange={handleCityChange}
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Pilih bandar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua bandar">Semua Bandar</SelectItem>
                    {state &&
                      CITIES?.[state]?.map((city: string) => (
                        <SelectItem key={city} value={city.toLowerCase()}>
                          {city}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                  Rawatan
                </label>
                <Select
                  value={treatment?.toLowerCase() || "semua rawatan"}
                  onValueChange={handleTreatmentChange}
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua rawatan">Semua Rawatan</SelectItem>
                    {TREATMENT_TYPES?.map((t: string) => (
                      <SelectItem key={t} value={t.toLowerCase()}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                  Sektor
                </label>
                <Select
                  value={sector || "semua sektor"}
                  onValueChange={handleSectorChange}
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua sektor">Semua Sektor</SelectItem>
                    {SECTOR?.map((s: string) => (
                      <SelectItem key={s} value={s.toUpperCase()}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button onClick={handleSearch} disabled={isPending}>
                {isPending ? "Mencari..." : "Cari"}
              </Button>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(stateParam || cityParam || treatment || sector) && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <span className="text-sm text-muted-foreground">Ditapis:</span>
            {stateParam && (
              <Badge variant="outline" className="capitalize">
                {state}
              </Badge>
            )}
            {cityParam && (
              <Badge variant="outline" className="capitalize">
                {cityParam.replace(/-/g, " ")}
              </Badge>
            )}
            {treatment && (
              <Badge variant="outline" className="capitalize">
                {treatment}
              </Badge>
            )}
            {sector && (
              <Badge variant="outline">
                {sector === "MOH"
                  ? "Kerajaan"
                  : sector === "PRIVATE"
                  ? "Swasta"
                  : sector === "MOH_PRIVATE"
                  ? "Kerajaan & Swasta"
                  : sector}
              </Badge>
            )}
          </div>
        )}

        {/* Results */}
        {initialData.centers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <SearchX className="w-16 h-16 text-muted-foreground/50" />
            <h3 className="mt-6 text-xl font-display font-semibold text-foreground">
              Tiada Pusat Dialisis
            </h3>
            <p className="mt-2 text-muted-foreground text-center max-w-md">
              Maaf, tiada pusat dialisis yang memenuhi kriteria carian anda. Cuba
              ubah tapisan atau cari dengan kata kunci lain.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Centers */}
            {featuredCenters.length > 0 && (
              <section className="mb-12">
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                  Pilihan Utama
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredCenters.map((center) => (
                    <Suspense key={center.id} fallback={<CenterCardSkeleton />}>
                      <MemoizedCenterCard {...center} />
                    </Suspense>
                  ))}
                </div>
              </section>
            )}

            {/* Regular Centers */}
            {regularCenters.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Semua Pusat Dialisis
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {totalCenters} pusat
                  </span>
                </div>
                <div className="space-y-3">
                  {regularCenters.map((center) => (
                    <MemoizedCenterListItem key={center.id} {...center} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Pagination */}
        {initialData.totalPages > 1 && (
          <Pagination className="mt-12">
            <PaginationContent>
              {initialData.currentPage > 1 && (
                <MemoizedPaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(initialData.currentPage - 1)}
                    className="cursor-pointer"
                  />
                </MemoizedPaginationItem>
              )}

              {getVisiblePages(
                initialData.currentPage,
                initialData.totalPages
              ).map((pageNum, index) => (
                <MemoizedPaginationItem key={index}>
                  {pageNum === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => setPage(Number(pageNum))}
                      isActive={initialData.currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  )}
                </MemoizedPaginationItem>
              ))}

              {initialData.currentPage < initialData.totalPages && (
                <MemoizedPaginationItem>
                  <PaginationNext
                    onClick={() => setPage(initialData.currentPage + 1)}
                    className="cursor-pointer"
                  />
                </MemoizedPaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </FilterLayout>
  );
}
