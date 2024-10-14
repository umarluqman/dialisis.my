"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grid-rows-[repeat(auto-fill,minmax(0,auto))]">
        {centers.map((center, index) => (
          <div key={index}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{center.name}</h3>
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
  );
}
