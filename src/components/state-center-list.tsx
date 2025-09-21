"use client";

import { CenterCard } from "@/components/center-card";
import { CenterCardSkeleton } from "@/components/center-card-skeleton";
import { TownFilter } from "@/components/town-filter";
import { useQueryState } from "nuqs";
import { useEffect, useState, useTransition } from "react";

interface StateCenterListProps {
  initialData: {
    centers: any[];
    totalCenters: number;
  };
  stateName: string;
  stateSlug: string;
  availableTowns: string[];
}

interface CenterData {
  centers: any[];
  totalCenters: number;
}

export function StateCenterList({
  initialData,
  stateName,
  stateSlug,
  availableTowns,
}: StateCenterListProps) {
  const [town] = useQueryState("town", {
    shallow: true,
  });
  const [centerData, setCenterData] = useState<CenterData>(initialData);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!town) {
      // If no town filter, use initial data
      setCenterData(initialData);
      return;
    }

    // Fetch filtered data when town changes
    startTransition(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `/api/centers-by-state?state=${encodeURIComponent(
              stateName
            )}&town=${encodeURIComponent(town)}`
          );
          if (response.ok) {
            const data = await response.json();
            setCenterData(data);
          }
        } catch (error) {
          console.error("Error fetching filtered centers:", error);
        }
      };

      fetchData();
    });
  }, [town, stateName, initialData]);

  return (
    <div>
      {/* Town Filter */}
      {availableTowns.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Tapis mengikut bandar:
            </h3>
            <TownFilter towns={availableTowns} stateName={stateName} />
          </div>
        </div>
      )}

      {/* Centers Grid */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Senarai Pusat Dialisis
          {town && ` di ${town}`}
        </h2>

        {isPending ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <CenterCardSkeleton key={i} />
            ))}
          </div>
        ) : centerData.centers.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {centerData.centers.map((center) => (
              <CenterCard key={center.id} {...center} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              Tiada pusat dialisis dijumpai di {stateName}
              {town && ` untuk bandar ${town}`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
