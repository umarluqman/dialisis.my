import Link from "next/link";
import { MapPin } from "lucide-react";
import {
  getNearbyCenters,
  NearbyCenter,
} from "@/lib/internal-linking-queries";

interface NearbyCentersProps {
  currentCenterId: string;
  latitude: number;
  longitude: number;
  city: string;
  stateName: string;
  limit?: number;
}

export async function NearbyCenters({
  currentCenterId,
  latitude,
  longitude,
  city,
  stateName,
  limit = 3,
}: NearbyCentersProps) {
  const centers = await getNearbyCenters({
    excludeId: currentCenterId,
    latitude,
    longitude,
    city,
    stateName,
    limit,
  });

  if (centers.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Pusat Dialisis Berdekatan</h2>
      <div className="grid gap-3">
        {centers.map((center) => (
          <NearbyCenterCard key={center.id} center={center} />
        ))}
      </div>
    </section>
  );
}

function NearbyCenterCard({ center }: { center: NearbyCenter }) {
  const distanceText =
    center.distance > 0
      ? `${center.distance.toFixed(1)} km`
      : center.city;

  return (
    <Link
      href={`/${center.slug}`}
      className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-start gap-3 min-w-0">
        <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="min-w-0">
          <span className="font-medium text-foreground line-clamp-1">
            {center.name.split(",")[0]}
          </span>
          <span className="text-sm text-muted-foreground">
            {center.city}
          </span>
        </div>
      </div>
      {center.distance > 0 && (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {distanceText}
        </span>
      )}
    </Link>
  );
}
