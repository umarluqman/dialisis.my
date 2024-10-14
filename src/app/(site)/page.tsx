"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import { useState } from "react";

export default function DialysisCenterDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const states = [
    "All",
    "Selangor",
    "Kuala Lumpur",
    "Penang",
    "Johor",
    "Perak",
  ];
  const districts = [
    "Petaling Jaya",
    "Shah Alam",
    "Subang Jaya",
    "Klang",
    "Ampang",
  ];

  const centers = [
    {
      name: "Dialysis Center 1",
      state: "Selangor",
      district: "Petaling Jaya",
      height: "h-64",
    },
    {
      name: "Dialysis Center 2",
      state: "Kuala Lumpur",
      district: "Ampang",
      height: "h-80",
    },
    {
      name: "Dialysis Center 3",
      state: "Penang",
      district: "George Town",
      height: "h-72",
    },
    {
      name: "Dialysis Center 4",
      state: "Johor",
      district: "Johor Bahru",
      height: "h-96",
    },
    {
      name: "Dialysis Center 5",
      state: "Perak",
      district: "Ipoh",
      height: "h-64",
    },
    {
      name: "Dialysis Center 6",
      state: "Selangor",
      district: "Shah Alam",
      height: "h-80",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 md:p-8">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Dialysis Center MY
            </h1>
            <p className="text-gray-600">
              Find the best dialysis centers in Malaysia
            </p>
          </div>
          <div className="w-full md:w-64 mt-4 md:mt-0 relative">
            <Input
              type="search"
              placeholder="Search centers..."
              className="w-full pr-10"
              value={searchQuery}
              onChange={handleSearchChange}
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
              <Button
                key={state}
                variant={selectedState === state ? "default" : "outline"}
                onClick={() => setSelectedState(state)}
                className="whitespace-nowrap"
              >
                {state}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex">
        <div
          className={`w-64 bg-white p-4 border-r ${
            sidebarOpen ? "block" : "hidden"
          } md:block`}
        >
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

        <div className="flex-1 p-4 md:p-8">
          <Button
            variant="outline"
            className="md:hidden mb-4"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[minmax(0,auto)]">
            {centers.map((center, index) => (
              <div
                key={index}
                className={`${center.height} ${
                  index % 3 === 0 ? "md:col-span-2" : ""
                }`}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {center.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Location: {center.state}
                      </p>
                      <p className="text-sm text-gray-600">
                        District: {center.district}
                      </p>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
