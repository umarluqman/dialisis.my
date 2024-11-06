"use client";

import { cn } from "@/lib/utils";

export default function FilterLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const title = "Pusat Dialisis di Malaysia";

  return (
    <div className="min-h-screen bg-[foreground] text-black">
      <div className="py-4 md:py-8">
        <div
          className={cn(
            "mb-8 p-12 flex flex-col md:flex-row justify-center md:items-center"
            // "border-b-[1px] border-[#bcbab2]"
          )}
        >
          <div className={cn("flex flex-col md:items-center space-y-8")}>
            <h1 className={cn("text-3xl md:text-5xl font-bold")}>{title}</h1>
            <p className={cn("text-gray-600 leading-8 text-lg")}>
              {`Cari sekitar lebih 900+ pusat dialisis yang berdekatan dengan anda dengan mudah.`}
            </p>
            {/* <Link href="/peta">
              <Button size="lg">Cari Sekarang </Button>{" "}
            </Link> */}
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
        {/* <div className="w-full flex items-center gap-4 my-8">
          <div className="flex-1 h-[1px] bg-[#bcbab2]"></div>
          <span className="text-gray-600">atau cari secara manual</span>
          <div className="flex-1 h-[1px] bg-[#bcbab2]"></div>
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
