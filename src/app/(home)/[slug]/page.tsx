import { DialysisCenterDetails } from "@/components/center-details";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

async function getCenter(slug: string) {
  const center = await prisma.dialysisCenter.findUnique({
    where: { slug },
    include: {
      state: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!center) return null;

  return {
    ...center,
    state: {
      ...center.state,
      name: center.state.name.replace(/-/g, " "),
    },
  };
}

export default async function DialysisCenterPage({
  params,
  searchParams,
}: Props) {
  const center = await getCenter(params.slug);

  if (!center) {
    notFound();
  }

  return (
    <main className="w-full mb-14">
      <nav className="container mt-4 flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
        <Link
          href={{
            pathname: "/",
            search: new URLSearchParams(
              searchParams as Record<string, string>
            ).toString(),
          }}
          className="hover:text-foreground transition-colors"
        >
          <Button variant="outline" size={"sm"}>
            <ChevronLeft className="w-4 h-4" /> Senarai
          </Button>
        </Link>
        <span>/</span>
        <span className="text-foreground">
          {center.dialysisCenterName.split(",")[0]}
        </span>
      </nav>
      <div className="container max-w-5xl py-6">
        <DialysisCenterDetails center={center} />
      </div>
    </main>
  );
}
