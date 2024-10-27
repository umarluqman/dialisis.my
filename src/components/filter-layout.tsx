"use client";

import { Input } from "@/components/ui/input";
import { CITIES, SECTOR, STATES, TREATMENT_TYPES } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function FilterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const pathname = usePathname();
  const [_, encodedState, encodedCity] = pathname.split("/");

  const state = encodedState
    ? decodeURIComponent(encodedState)
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : undefined;

  const city = encodedCity
    ? decodeURIComponent(encodedCity)
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : undefined;

  const title = city
    ? `Pusat Dialisis di ${city}, ${state}`
    : state
    ? `Pusat Dialisis di ${state}`
    : "Pusat Dialisis di Malaysia";

  const handleStateChange = (value: string) => {
    if (value === "semua negeri / wilayah") {
      router.push("/");
    } else {
      router.push(`/${value?.toLowerCase().replace(/\s+/g, "-")}`);
    }
  };

  const handleCityChange = (value: string) => {
    if (state) {
      if (value === "semua bandar") {
        router.push(`/${state?.toLowerCase().replace(/\s+/g, "-")}`);
      } else {
        router.push(
          `/${state?.toLowerCase().replace(/\s+/g, "-")}/${value.replace(
            /\s+/g,
            "-"
          )}`
        );
      }
    }
  };
  const [treatment, setTreatment] = useQueryState("treatment");
  const handleTreatmentChange = (value: string) => {
    if (value === "semua rawatan") {
      setTreatment(null);
    } else {
      setTreatment(value);
    }
  };

  // Add this near the top with other state declarations
  const [doctorName, setDoctorName] = useQueryState("doctor");

  return (
    <div className="min-h-screen bg-[foreground] text-black">
      <div className="py-4 md:py-8">
        <div className="mb-8 p-12 flex flex-col md:flex-row justify-center md:items-center border-b-[1px] border-[#bcbab2]">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
            <p className="text-gray-600">
              {`Cari pusat dialisis yang berdekatan dengan anda`}
            </p>
          </div>
          {/* <div className="w-full md:w-64 mt-4 md:mt-0 relative">
            <Input
              type="search"
              placeholder="Search centers..."
              className="w-full pr-10"
            />
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div> */}
        </div>
        <div className="mb-6 flex flex-col sm:flex-row justify-center gap-4">
          <div className="w-full sm:w-64">
            <Select
              defaultValue={state?.toLowerCase() || "semua negeri / wilayah"}
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

          <div className="w-full sm:w-64">
            <Select
              onValueChange={handleCityChange}
              defaultValue={city?.toLowerCase() || "semua bandar"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key={"all"} value={"semua bandar".toLowerCase()}>
                  Semua bandar
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

          <div className="w-full sm:w-64">
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
                  Semua rawatan
                </SelectItem>
                {TREATMENT_TYPES?.map((treatment: string) => (
                  <SelectItem key={treatment} value={treatment.toLowerCase()}>
                    {treatment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Nama doktor yang bertugas"
              value={doctorName || ""}
              onChange={(e) => setDoctorName(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-64">
            <Select
              onValueChange={handleCityChange}
              defaultValue={city?.toLowerCase() || "semua rawatan"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key={"all"} value={"semua rawatan".toLowerCase()}>
                  Semua sektor
                </SelectItem>
                {SECTOR?.map((sector: string) => (
                  <SelectItem key={sector} value={sector.toLowerCase()}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {children}
      {/* <div className="flex">
        <div className="w-64 bg-white p-4 border-r hidden md:block">
          <h2 className="text-lg font-semibold mb-4">Filter by Cities</h2>
          {cities.map((cities) => (
            <div key={cities} className="flex items-center space-x-2 mb-2">
              <Checkbox id={cities} />
              <label
                htmlFor={cities}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {cities}
              </label>
            </div>
          ))}
        </div>

        <div className="flex-1 px-4 md:px-8">
          <Button variant="outline" className="md:hidden mb-4">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>

          {children}
        </div>
      </div> */}
    </div>
  );
}
