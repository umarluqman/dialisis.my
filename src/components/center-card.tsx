"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PopiconsArrowRightLine,
  PopiconsGlobeLine,
  PopiconsMailLine,
  PopiconsMapLine,
  PopiconsPhoneLine,
} from "@popicons/react";
import clsx from "clsx";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface CenterCardProps {
  slug: string;
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
  showService?: boolean;
  featured: boolean;
}

export function CenterCard({
  slug,
  id,
  dialysisCenterName,
  address,
  featured,
  phoneNumber,
  email,
  state,
  town,
  hepatitisBay,
  sector,
  units,
  website,
  latitude,
  showService = true,
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

  const isFeatured = featured;
  console.log({ isFeatured, dialysisCenterName });
  return (
    <Card
      className={`shadow-sm transition-shadow flex flex-col min-h-fit relative ${
        isFeatured
          ? "shadow-primary/25 bg-gradient-to-br from-primary/5 to-primary/5 shadow-lg border-primary border-2"
          : ""
      }`}
    >
      {isFeatured && (
        <Badge className="absolute -top-2 right-4 bg-amber-400 text-amber-950 shadow-sm shadow-amber-400/25 px-3 py-1 border-none">
          Featured
        </Badge>
      )}
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-bold text-foreground">
          {title}
        </CardTitle>
        <div className="flex justify-between w-full">
          <CardTitle className="text-zinc-500 font-medium capitalize text-base">{`${
            town ? town + ", " : ""
          }${state.name}`}</CardTitle>

          <p className="text-primary-foreground mb-4 text-sm">
            {sector === "MOH" ||
            sector === "NGO" ||
            sector === "MOH_PRIVATE" ? (
              sector === "MOH" ? (
                "Kerajaan"
              ) : sector === "MOH_PRIVATE" ? (
                "Kerajaan & Swasta"
              ) : (
                sector
              )
            ) : (
              <span className="capitalize">
                {sector?.toLowerCase() === "private"
                  ? "Swasta"
                  : sector?.toLowerCase()}
              </span>
            )}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div
          className={`flex-1 rounded-t-[10px] flex flex-col ${
            isFeatured ? "transparent" : "bg-white"
          }`}
        >
          {/* <p className="mt-3 text-zinc-600">{address}</p> */}
          {showService && (
            <div className="flex flex-col gap-2 my-2">
              <div className="text-sm text-zinc-600">Servis Rawatan</div>
              <div className="flex flex-wrap gap-2">
                {treatmentArray.map((treatment) => (
                  <Badge
                    key={treatment.name}
                    className="bg-[#a3bdffff]/20 text-[#375092ff] shadow-none font-normal border- border-primary-foreground/25"
                  >
                    {treatment.value}
                  </Badge>
                ))}{" "}
              </div>
            </div>
          )}

          {showService && (
            <div className="flex flex-wrap mb-4">
              {hepatitisArray.length > 0 ? (
                <div className="flex items-center gap-2">
                  {hepatitisArray.map((hep) => (
                    <Badge
                      key={hep}
                      className="bg-amber-100 text-base text-amber-800 shadow-none hover:bg-amber-200 font-normal"
                    >
                      {hep}
                    </Badge>
                  ))}
                  {/* <PopiconsCircleInfoLine className="cursor-pointer w-4 h-4 text-zinc-500" /> */}
                </div>
              ) : null}
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-end mt-4">
            <Button
              variant="outline"
              className="px-4 border-primary-foreground/30"
              onClick={() => (window.location.href = `tel:${phoneNumber}`)}
            >
              <PopiconsPhoneLine className="w-4 h-4 text-primary-foreground" />
              Panggil
            </Button>

            <Button
              variant={"outline"}
              className="px-4 border-primary-foreground/30"
              onClick={() => (window.location.href = `mailto:${email}`)}
            >
              <PopiconsMailLine className="w-4 h-4 text-primary-foreground" />
              Emel
            </Button>

            <Link
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target="_blank"
            >
              <Button
                variant="outline"
                className="px-4 border-primary-foreground/30"
              >
                <PopiconsMapLine className="w-4 h-4 text-primary-foreground" />
                Lokasi
              </Button>
            </Link>
            {website && (
              <Link
                href={website.split("?")[0] + "?ref=dialisis.my"}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                <Button
                  variant={"outline"}
                  className="border-primary-foreground/30 mb-4"
                >
                  <PopiconsGlobeLine className="w-4 h-4 text-primary-foreground" />
                  Laman Web
                </Button>
              </Link>
            )}
          </div>

          <div className="mt-auto pt-6">
            <Link href={`/${slug}?modal=true`}>
              <Button
                variant={isFeatured ? "default" : "secondary"}
                className={clsx(
                  "w-full md:w-auto flex items-center justify-center md:justify-self-end",
                  {
                    "bg-[#0565f2] hover:bg-[#0565f2]/95 text-secondary shadow-primary/25 hover:shadow-lg hover:shadow-primary-foreground/25 transition-all":
                      isFeatured,
                  }
                )}
              >
                Info Lanjut
                <PopiconsArrowRightLine className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
