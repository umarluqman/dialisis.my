"use client";

import { DialysisCenterDetails } from "@/components/center-details";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { prisma } from "@/lib/db";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const center = await getCenter(params.slug);

  if (!center) {
    return null;
  }

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialysisCenterDetails center={center} isModal />
      </DialogContent>
    </Dialog>
  );
}
