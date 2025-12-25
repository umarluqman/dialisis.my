"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useCallback } from "react";

interface TownFilterProps {
  towns: string[];
  stateName: string;
}

export function TownFilter({ towns, stateName }: TownFilterProps) {
  const t = useTranslations("location.townFilter");
  const [town, setTown] = useQueryState("town", {
    shallow: true,
  });

  const handleTownChange = useCallback(
    (value: string) => {
      if (value === "semua bandar") {
        setTown(null);
      } else {
        setTown(value);
      }
    },
    [setTown]
  );

  if (towns.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-xs">
      <Select
        value={town || "semua bandar"}
        onValueChange={handleTownChange}
      >
        <SelectTrigger>
          <SelectValue placeholder={t("placeholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="semua bandar">
            {t("allTowns", { state: stateName })}
          </SelectItem>
          {towns.map((townName) => (
            <SelectItem key={townName} value={townName}>
              {townName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
