import { DialysisCenterDetails } from "@/components/center-details";
import { prisma } from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModalDialog } from "./modal-dialog";

interface Props {
  params: {
    slug: string;
  };
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const center = await getCenter(params.slug);

  if (!center) {
    return {
      title: "Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${center.dialysisCenterName} - Pusat Dialisis di ${center.state.name}`,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `https://dialisis.my/${params.slug}`,
    },
  };
}

export default async function DialysisCenterModal({ params }: Props) {
  const center = await getCenter(params.slug);

  if (!center) {
    notFound();
  }

  return (
    <ModalDialog>
      <DialysisCenterDetails center={center} isModal />
    </ModalDialog>
  );
}
