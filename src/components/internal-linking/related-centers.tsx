import Link from "next/link";
import { PopiconsMapLine } from "@popicons/react";
import {
  getRelatedCenters,
  RelatedCenter,
} from "@/lib/internal-linking-queries";
import { generateCenterAnchorText } from "@/lib/internal-linking-utils";

interface RelatedCentersProps {
  currentCenterId: string;
  city: string;
  stateName: string;
  treatmentTypes: string[];
  limit?: number;
}

export async function RelatedCenters({
  currentCenterId,
  city,
  stateName,
  treatmentTypes,
  limit = 4,
}: RelatedCentersProps) {
  const centers = await getRelatedCenters({
    excludeId: currentCenterId,
    city,
    stateName,
    treatmentTypes,
    limit,
  });

  if (centers.length === 0) return null;

  return (
    <section className="mt-8 pt-8 border-t">
      <h2 className="text-xl font-semibold mb-4">
        Pusat Dialisis Lain di {city}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {centers.map((center) => (
          <RelatedCenterCard
            key={center.id}
            center={center}
            treatmentTypes={treatmentTypes}
          />
        ))}
      </div>
    </section>
  );
}

function RelatedCenterCard({
  center,
  treatmentTypes,
}: {
  center: RelatedCenter;
  treatmentTypes: string[];
}) {
  const matchingTreatment = center.treatmentTypes.find((t) =>
    treatmentTypes.includes(t)
  );

  const anchorText = generateCenterAnchorText(
    center.name,
    center.city,
    matchingTreatment,
    "ms"
  );

  return (
    <Link
      href={`/${center.slug}`}
      className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
    >
      <PopiconsMapLine className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <span className="font-medium text-foreground line-clamp-1">
          {center.name.split(",")[0]}
        </span>
        <span className="text-sm text-muted-foreground block">
          {anchorText.split(" - ")[1]}
        </span>
      </div>
    </Link>
  );
}
