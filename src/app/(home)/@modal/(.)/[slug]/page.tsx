import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DialysisCenterModalClient } from "./dialysis-center-modal-client";

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

export default async function DialysisCenterModal({ params }: Props) {
  const center = await getCenter(params.slug);

  if (!center) {
    redirect("/");
  }

  return <DialysisCenterModalClient center={center} />;
}
