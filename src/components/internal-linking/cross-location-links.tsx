import Link from "next/link";
import { getNeighboringLocations } from "@/lib/internal-linking-queries";

interface CrossLocationLinksProps {
  stateName: string;
  cityName?: string;
  stateSlug: string;
}

export async function CrossLocationLinks({
  stateName,
  cityName,
  stateSlug,
}: CrossLocationLinksProps) {
  const locations = await getNeighboringLocations(stateName, cityName);

  if (locations.length === 0) return null;

  const title = cityName
    ? `Kawasan Lain di ${stateName}`
    : `Negeri Berdekatan`;

  return (
    <section className="mt-8 pt-6 border-t">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {locations.map((location) => (
          <Link
            key={location.slug}
            href={location.slug}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-card hover:bg-muted/50 transition-colors text-sm"
          >
            <span className="text-foreground">{location.name}</span>
            <span className="text-muted-foreground">
              ({location.centerCount})
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
