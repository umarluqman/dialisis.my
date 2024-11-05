"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PopiconsArrowRightLine,
  PopiconsGlobeLine,
  PopiconsMailLine,
  PopiconsMapLine,
  PopiconsPhoneLine,
} from "@popicons/react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface CenterCardProps {
  id: string;
  dialysisCenterName: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  state: {
    name: string;
  };
  town: string;
  units?: string;
  hepatitisBay?: string;
  sector?: string;
  treatment?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
}

export function CenterCard({
  id,
  dialysisCenterName,
  address,
  phoneNumber,
  email,
  state,
  town,
  hepatitisBay,
  sector,
  units,
  website,
  latitude,
  longitude,
}: CenterCardProps) {
  const unitsArray = units ? units.split(",") : [];
  const title = dialysisCenterName?.split(",")[0];

  const hepatitisArray = hepatitisBay ? hepatitisBay.split(", ") : [];
  const treatmentArray = unitsArray.map((unit) => ({
    name: unit,
    value: unit.toLowerCase().includes("hd unit")
      ? "Hemodialisis"
      : unit.toLowerCase().includes("tx unit")
      ? "Transplant"
      : unit.toLowerCase().includes("mrrb unit")
      ? "MRRB"
      : "Peritoneal Dialisis",
  }));
  console.log(state);
  return (
    <Card className="shadow-sm transition-shadow flex flex-col min-h-fit">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          {title}
        </CardTitle>
        <p className="text-primary-foreground mb-4 text-sm">
          {sector === "MOH" || sector === "NGO" ? (
            sector
          ) : (
            <span className="capitalize">{sector?.toLowerCase() ?? ""}</span>
          )}
        </p>
        <CardTitle className="text-zinc-600 font-medium capitalize text-sm">{`${
          town ? town + ", " : ""
        }${state.name}`}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div className="flex-1 rounded-t-[10px] bg-white flex flex-col">
          {/* <p className="mt-3 text-zinc-600">{address}</p> */}
          <div className="flex flex-col gap-2 my-2">
            <div className="text-sm text-zinc-600">Servis Rawatan</div>
            <div className="flex flex-wrap gap-2">
              {treatmentArray.map((treatment) => (
                <Badge
                  key={treatment.name}
                  className="bg-[#a3bdffff]/50 text-[#375092ff] hover:bg-[#a3bdffff]/50 shadow-none font-normal text-base"
                >
                  {treatment.value}
                </Badge>
              ))}{" "}
            </div>
          </div>

          <div className="flex flex-wrap mb-4">
            {hepatitisArray.length > 0 ? (
              <div className="flex items-center gap-2">
                {hepatitisArray.map((hep) => (
                  <Badge
                    key={hep}
                    className="bg-amber-200 text-base text-amber-800 shadow-none hover:bg-amber-200 font-normal"
                  >
                    {hep}
                  </Badge>
                ))}
                {/* <PopiconsCircleInfoLine className="cursor-pointer w-4 h-4 text-zinc-500" /> */}
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3 justify-end mt-4">
            <Button
              variant="outline"
              className="px-4"
              onClick={() => (window.location.href = `tel:${phoneNumber}`)}
            >
              <PopiconsPhoneLine className="w-4 h-4 text-primary-foreground" />
              Panggil
            </Button>

            <Button
              variant={"outline"}
              className="px-4"
              onClick={() => (window.location.href = `mailto:${email}`)}
            >
              <PopiconsMailLine className="w-4 h-4 text-primary-foreground" />
              Emel
            </Button>

            <Link
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target="_blank"
            >
              <Button variant="outline" className="px-4">
                <PopiconsMapLine className="w-4 h-4 text-primary-foreground" />
                Lokasi
              </Button>
            </Link>
            {website && (
              <Link
                href={website?.split("?")[0] + "?ref=dialisis.my" ?? ""}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                <Button
                  variant={"outline"}
                  className="text-primary-foreground mb-4"
                >
                  <PopiconsGlobeLine className="w-4 h-4 text-primary-foreground" />
                  Laman Web
                </Button>
              </Link>
            )}
          </div>

          <div className="mt-auto pt-6">
            <Button
              variant={"secondary"}
              className="w-full md:w-auto flex items-center justify-center md:justify-self-end"
            >
              Info Lanjut
              <PopiconsArrowRightLine className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
