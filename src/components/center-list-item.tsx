"use client";

import { ChevronRight, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { getPrimaryCenterPhoneNumber } from "@/lib/center-phone-numbers";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface CenterListItemProps {
  slug: string;
  id: string;
  dialysisCenterName: string;
  address?: string;
  phoneNumber?: string;
  tel?: string;
  state: {
    name: string;
  };
  town: string;
  sector?: string;
  latitude?: number;
  longitude?: number;
}

export function CenterListItem({
  slug,
  dialysisCenterName,
  phoneNumber,
  tel,
  state,
  town,
  sector,
  latitude,
  longitude,
}: CenterListItemProps) {
  const title = dialysisCenterName?.split(",")[0];
  const primaryPhoneNumber = getPrimaryCenterPhoneNumber({ phoneNumber, tel });

  const getSectorLabel = (sector?: string) => {
    if (!sector) return null;
    switch (sector) {
      case "MOH":
        return "Kerajaan";
      case "MOH_PRIVATE":
        return "Kerajaan & Swasta";
      case "PRIVATE":
        return "Swasta";
      default:
        return sector;
    }
  };

  return (
    <div className="group flex items-center justify-between gap-4 px-4 py-4 bg-card border border-border rounded-xl hover:shadow-warm-md transition-all duration-200 ease-out-cubic">
      <div className="flex-1 min-w-0">
        <Link href={`/${slug}`} className="block">
          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5 capitalize">
            {town ? `${town}, ` : ""}{state.name}
          </p>
        </Link>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {sector && (
          <Badge variant="subtle" className="hidden sm:inline-flex">
            {getSectorLabel(sector)}
          </Badge>
        )}

        <div className="hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {primaryPhoneNumber && (
            <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
              <a href={`tel:${primaryPhoneNumber}`}>
                <Phone className="h-4 w-4 text-muted-foreground" />
              </a>
            </Button>
          )}
          {latitude && longitude && (
            <Link
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
          )}
        </div>

        <Link href={`/${slug}`}>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
        </Link>
      </div>
    </div>
  );
}
