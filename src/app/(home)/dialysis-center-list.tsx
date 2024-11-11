"use client";

import { CenterCard } from "@/components/center-card";
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
import { parseAsInteger, useQueryState } from "nuqs";

interface DialysisCenterListProps {
  initialData: {
    centers: any[];
    totalPages: number;
    currentPage: number;
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

export function DialysisCenterList({ initialData }: DialysisCenterListProps) {
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

  const state = stateParam
    ? decodeURIComponent(stateParam)
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : undefined;

  const handleStateChange = async (value: string) => {
    setPage(1);
    if (value === "semua negeri / wilayah") {
      await setStateParam(null);
      await setCityParam(null);
    } else {
      await setStateParam(value.toLowerCase());
      await setCityParam(null);
    }
  };

  const handleCityChange = async (value: string) => {
    setPage(1);
    if (value === "semua bandar") {
      await setCityParam(null);
    } else {
      await setCityParam(value.toLowerCase());
    }
  };

  const handleTreatmentChange = (value: string) => {
    setPage(1);
    if (value === "semua rawatan") {
      setTreatmentParam(null);
    } else {
      setTreatmentParam(value);
    }
  };

  const handleSectorChange = (value: string) => {
    setPage(1);
    if (value === "semua sektor") {
      setSector(null);
    } else {
      setSector(value.toUpperCase());
    }
  };

  const handleSearch = () => {
    window.location.href = window.location.pathname + window.location.search;
  };

  return (
    <FilterLayout>
      {/* Add the filter section here */}
      <div className="flex flex-col border-[2px] bg-white lg:w-fit md:mx-auto py-8 md:p-8 border-dashed border-b-0">
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
          <Button size="lg" className="mb-8 mt-2 " onClick={handleSearch}>
            Cari Pusat Dialisis
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {/* Centers Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {initialData.centers.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <SearchX className="w-12 h-12 text-zinc-400" />
            <h3 className="mt-4 text-lg font-semibold text-zinc-950">
              Tiada Pusat Dialisis
            </h3>
            <p className="mt-1 text-sm text-zinc-600">
              Maaf, tiada pusat dialisis yang memenuhi kriteria carian anda.
            </p>
          </div>
        ) : (
          initialData.centers.map((item) => (
            <CenterCard key={item.id} {...item} />
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination className="my-16 cursor-pointer">
        <PaginationContent>
          {initialData.currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(initialData.currentPage - 1)}
              />
            </PaginationItem>
          )}

          {getVisiblePages(initialData.currentPage, initialData.totalPages).map(
            (page, index) => (
              <PaginationItem key={index}>
                {page === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => setPage(Number(page))}
                    isActive={initialData.currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            )
          )}

          {initialData.currentPage < initialData.totalPages && (
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(initialData.currentPage + 1)}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </FilterLayout>
  );
}
