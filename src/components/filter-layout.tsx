import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import Link from "next/link";

export default function FilterLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { state?: string; district?: string };
}) {
  const states = [
    "All",
    "Selangor",
    "Kuala Lumpur",
    "Pulau Pinang",
    "Johor",
    "Perak",
    "Perlis",
    "Putrajaya",
    "Kedah",
    "Kelantan",
    "Melaka",
    "Negeri Sembilan",
    "Pahang",
    "Sabah",
    "Sarawak",
    "Terengganu",
    "Labuan",
  ];
  const districts = [
    "Petaling Jaya",
    "Shah Alam",
    "Subang Jaya",
    "Klang",
    "Ampang",
  ];

  const title = params.district
    ? `Dialysis Centers in ${params.district}, ${params.state}`
    : params.state
    ? `Dialysis Centers in ${params.state}`
    : "Dialysis Centers in Malaysia";

  console.log("Xxx", { params });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 md:p-8">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
            <p className="text-gray-600">
              Find the best dialysis centers near you
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

        <div className="mb-6 overflow-x-auto">
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
        </div>
      </div>

      <div className="flex">
        <div className="w-64 bg-white p-4 border-r hidden md:block">
          <h2 className="text-lg font-semibold mb-4">Filter by District</h2>
          {districts.map((district) => (
            <div key={district} className="flex items-center space-x-2 mb-2">
              <Checkbox id={district} />
              <label
                htmlFor={district}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {district}
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
      </div>
    </div>
  );
}
