"use client";

import { Input } from "@/components/ui/input";
import { CITIES, STATES } from "@/constants";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
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
    if (value === "all states") {
      router.push("/");
    } else {
      router.push(`/${value.replace(/\s+/g, "-").toLowerCase()}`);
    }
  };

  const handleCityChange = (value: string) => {
    if (state) {
      if (value === "all cities") {
        router.push(`/${state?.toLowerCase()}`);
      } else {
        router.push(`/${state?.toLowerCase()}/${value}`);
      }
    }
  };
  const isHomepage = !state && !city;
  const hasCity = state && Boolean(CITIES?.[state]);
  console.log("hasCity", hasCity);
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 md:p-8">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
            <p className="text-gray-600">
              {`Cari pusat dialisis yang berdekatan dengan anda`}
            </p>
          </div>
          <div className="w-full md:w-64 mt-4 md:mt-0 relative">
            <Input
              type="search"
              placeholder="Search centers..."
              className="w-full pr-10"
            />
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-64">
            <Select
              defaultValue={state?.toLowerCase() || "all states"}
              onValueChange={handleStateChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a state" />
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
          {(isHomepage || hasCity) && (
            <div className="w-full sm:w-64">
              <Select
                onValueChange={handleCityChange}
                defaultValue={city?.toLowerCase() || "all cities"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key={"all"} value={"all cities".toLowerCase()}>
                    All Cities
                  </SelectItem>
                  {!isHomepage &&
                    state &&
                    CITIES?.[state]?.map((city: string) => (
                      <SelectItem key={city} value={city.toLowerCase()}>
                        {city}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        {/* <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {states.map((state) => (
              <Link key={state} href={`/${state.toLowerCase()}`}>
                <Button
                  variant={
                    params.state?.toLowerCase() === state.toLowerCase()
                      ? "default"
                      : "outline"
                  }
                  className="whitespace-nowrap"
                >
                  {state}
                </Button>
              </Link>
            ))}
          </div>
        </div> */}
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
