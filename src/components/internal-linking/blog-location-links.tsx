import Link from "next/link";
import { MapPin } from "lucide-react";
import { getTopLocationsForBlog } from "@/lib/internal-linking-queries";

interface BlogLocationLinksProps {
  treatmentTypes: string[];
  locale?: "ms" | "en";
  limit?: number;
}

export async function BlogLocationLinks({
  treatmentTypes,
  locale = "ms",
  limit = 5,
}: BlogLocationLinksProps) {
  const locations = await getTopLocationsForBlog({ treatmentTypes, limit });

  if (locations.length === 0) return null;

  const title =
    locale === "en" ? "Find Dialysis Centers" : "Cari Pusat Dialisis";

  return (
    <section className="mt-8 pt-6 border-t">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        {title}
      </h2>
      <div className="flex flex-wrap gap-2">
        {locations.map((location) => (
          <Link
            key={location.slug}
            href={location.slug}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-primary/5 hover:bg-primary/10 transition-colors text-sm"
          >
            <span className="text-foreground">
              {locale === "en"
                ? `Dialysis in ${location.name}`
                : `Dialisis di ${location.name}`}
            </span>
            <span className="text-muted-foreground">
              ({location.centerCount})
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
