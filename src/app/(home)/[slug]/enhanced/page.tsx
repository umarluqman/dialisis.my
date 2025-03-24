import { EnhancedDialysisCenterDetails } from "@/components/enhanced-center-details";
import { prisma } from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const center = await prisma.dialysisCenter.findUnique({
    where: {
      slug: params.slug,
    },
    select: {
      dialysisCenterName: true,
      town: true,
      state: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!center) {
    return {
      title: "Dialysis Center Not Found",
      description: "The requested dialysis center could not be found.",
    };
  }

  const stateName = center.state.name
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const location = center.town ? `${center.town}, ${stateName}` : stateName;

  return {
    title: `${center.dialysisCenterName} | Dialysis Center`,
    description: `View detailed information about ${center.dialysisCenterName} in ${location}. Find location, contact information, services, and more.`,
    openGraph: {
      title: `${center.dialysisCenterName} | Dialysis Center`,
      description: `View detailed information about ${center.dialysisCenterName} in ${location}. Find location, contact information, services, and more.`,
      url: `https://dialisis.my/${params.slug}/enhanced`,
      siteName: "Dialisis MY",
      locale: "ms_MY",
      type: "website",
    },
  };
}

export default async function EnhancedCenterPage({ params }: Props) {
  const center = await prisma.dialysisCenter.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      state: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!center) {
    notFound();
  }

  return (
    <main>
      <EnhancedDialysisCenterDetails center={center} />
    </main>
  );
}
