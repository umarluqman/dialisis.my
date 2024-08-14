"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

const senaraiNegeri = [
  {
    value: "selangor",
    label: "Selangor",
  },
  {
    value: "johor",
    label: "Johor",
  },
  {
    value: "melaka",
    label: "Melaka",
  },
  {
    value: "kuala lumpur",
    label: "Kuala Lumpur",
  },
  {
    value: "serawak",
    label: "Serawak",
  },
  {
    value: "kelantan",
    label: "Kelantan",
  },
  {
    value: "pahang",
    label: "Pahang",
  },
  {
    value: "sabah",
    label: "Sabah",
  },
  {
    value: "perak",
    label: "Perak",
  },
  {
    value: "labuan",
    label: "Labuan",
  },
  {
    value: "putrajaya",
    label: "Putrajaya",
  },
  {
    value: "terengganu",
    label: "Terengganu",
  },
  {
    value: "negeri sembilan",
    label: "Negeri Sembilan",
  },
  {
    value: "pulau pinang",
    label: "Pulau Pinang",
  },
  {
    value: "kedah",
    label: "Kedah",
  },
  {
    value: "perlis",
    label: "Perlis",
  },
];

export default function Component() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  console.log(senaraiNegeri.length);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-muted py-12 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="p-6 mb-8 space-y-8">
            <div className="text-center space-y-6">
              <h2 className="text-5xl font-bold">Dialisis MY</h2>
              <p className="text-muted-foreground">
                Cari pusat dialisis di Malaysia yang berlesen dengan mudah.
              </p>
            </div>
            <div className="flex gap-4 justify-center max-w-xl mx-auto">
              <Select>
                <SelectTrigger className="bg-primary-foreground">
                  <SelectValue placeholder="Pilih Negeri / Wilayah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Johor</SelectItem>
                  <SelectItem value="2">Kedah</SelectItem>
                  <SelectItem value="3">Kelantan</SelectItem>
                  <SelectItem value="4">Melaka</SelectItem>
                  <SelectItem value="5">Negeri Sembilan</SelectItem>
                  <SelectItem value="6">Pahang</SelectItem>
                  <SelectItem value="7">Penang</SelectItem>
                  <SelectItem value="8">Perak</SelectItem>
                  <SelectItem value="9">Perlis</SelectItem>
                  <SelectItem value="10">Sabah</SelectItem>
                  <SelectItem value="11">Sarawak</SelectItem>
                  <SelectItem value="12">Selangor</SelectItem>
                  <SelectItem value="13">Terengganu</SelectItem>
                  <SelectItem value="14">Kuala Lumpur</SelectItem>
                  <SelectItem value="15">Labuan</SelectItem>
                  <SelectItem value="16">Putrajaya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
