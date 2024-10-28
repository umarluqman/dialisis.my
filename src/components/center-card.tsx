import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PopiconsGlobeDuotone,
  PopiconsMailDuotone,
  PopiconsPhoneDuotone,
} from "@popicons/react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface CenterCardProps {
  id: string;
  name: string;
  address?: string;
  tel?: string;
  email?: string;
  state: string;
  city: string;
  units?: string;
  hepatitisBay?: string;
  sector?: string;
  treatment?: string;
  website?: string;
}

export function CenterCard({
  id,
  name,
  address,
  tel,
  email,
  state,
  city,
  units,
  hepatitisBay,
  sector,
  treatment,
  website,
}: CenterCardProps) {
  const unitsArray = units ? units.split(",") : [];
  const title = name.split(",")[0];
  const hepatitisArray = hepatitisBay ? hepatitisBay.split(", ") : [];
  const treatmentArray = unitsArray.map((unit) => ({
    name: unit,
    value: unit.toLowerCase().includes("hd unit")
      ? "Hemodialysis"
      : unit.toLowerCase().includes("tx unit")
      ? "Transplant"
      : unit.toLowerCase().includes("mrrb unit")
      ? "MRRB"
      : "Peritoneal Dialysis",
  }));
  console.log({ treatmentArray, unitsArray });
  return (
    <Link
      href={`/${state}/${encodeURIComponent(city)}/${encodeURIComponent(name)}`}
    >
      <Card className="shadow-sm hover:border-primary transition-shadow">
        <CardHeader className="space-y-3">
          <CardTitle>{title}</CardTitle>
          <CardTitle className="text-zinc-500 font-normal capitalize text-sm">{`${city}, ${state}`}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-end flex-col gap-2">
          <Link href={website?.split("?")[0] + "ref=dialysis-my" ?? ""}>
            <Button
              size={"sm"}
              variant={"link"}
              className="px-0 text-primary mb-4"
            >
              <PopiconsGlobeDuotone className="w-4 h-4 stroke-[#2bde80ff] text-[#012f54ff] fill-[#012f54ff]" />
              {website?.split("?")[0]}
            </Button>
          </Link>
          <p className="text-primary mb-4">
            {sector === "MOH" || sector === "NGO" ? (
              sector
            ) : (
              <span className="capitalize">{sector?.toLowerCase() ?? ""}</span>
            )}
          </p>

          <div className="flex flex-wrap gap-2">
            {treatmentArray.map((treatment) => (
              <Badge
                key={treatment.name}
                className="bg-blue-50 text-blue-800 mb-4"
              >
                {treatment.value}
              </Badge>
            ))}{" "}
          </div>
          {/* <p className="text-primary mb-4">{units?.join(", ") ?? ""}</p> */}

          <p className="text-primary mb-4">{address}</p>
          <div className="flex gap-2 items-center">
            <PopiconsPhoneDuotone className="w-4 h-4 stroke-[#2bde80ff]" />
            <p className="text-primary">{tel}</p>
          </div>
          <div className="flex gap-2 items-center">
            <PopiconsMailDuotone className="w-4 h-4 stroke-[#2bde80ff]" />
            <p className="text-primary">{email}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
