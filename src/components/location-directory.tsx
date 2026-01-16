import Link from "next/link";
import { prisma } from "@/lib/db";
import { createLocationSlug } from "@/lib/location-utils";

interface StateWithCount {
  name: string;
  slug: string;
  centerCount: number;
}

async function getAllStatesWithCounts(): Promise<StateWithCount[]> {
  try {
    const states = await prisma.dialysisCenter.groupBy({
      by: ["stateId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    const stateDetails = await prisma.state.findMany({
      where: { id: { in: states.map((s) => s.stateId) } },
      select: { id: true, name: true },
    });

    return states
      .map((s) => {
        const state = stateDetails.find((d) => d.id === s.stateId);
        if (!state) return null;
        const displayName = state.name
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        return {
          name: displayName,
          slug: `/lokasi/${createLocationSlug(state.name)}`,
          centerCount: s._count.id,
        };
      })
      .filter((s): s is StateWithCount => s !== null);
  } catch (error) {
    console.error("Error fetching states with counts:", error);
    return [];
  }
}

export async function LocationDirectory() {
  const states = await getAllStatesWithCounts();

  if (states.length === 0) return null;

  return (
    <section className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">Cari Mengikut Negeri</h2>
      <div className="flex flex-wrap gap-2">
        {states.map((state) => (
          <Link
            key={state.slug}
            href={state.slug}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-card hover:bg-muted/50 transition-colors text-sm"
          >
            <span className="text-foreground">{state.name}</span>
            <span className="text-muted-foreground">
              ({state.centerCount})
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
