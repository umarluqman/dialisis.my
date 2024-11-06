import { DialysisCenterDetails } from "@/components/center-details";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

async function getCenter(id: string) {
  const center = await prisma.dialysisCenter.findUnique({
    where: { id },
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

export default async function DialysisCenterPage({ params }: Props) {
  const center = await getCenter(params.id);

  if (!center) {
    notFound();
  }

  return (
    <main className="w-full mb-14">
      <nav className="container mt-4 flex items-center space-x-2 text-sm text-muted-foreground">
        <a href="/" className="hover:text-foreground transition-colors">
          Senarai Pusat Dialisis
        </a>
        <span>/</span>
        <span className="text-foreground">{center.dialysisCenterName}</span>
      </nav>
      <div className="max-w-5xl pb-6 pt-5 w-full"></div>
      <div className="container max-w-5xl py-6">
        <DialysisCenterDetails center={center} />
      </div>
    </main>
  );
}
