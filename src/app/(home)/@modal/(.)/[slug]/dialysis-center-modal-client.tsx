"use client";

import { DialysisCenterDetails } from "@/components/center-details";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialysisCenter } from "@prisma/client";
import { useRouter } from "next/navigation";

interface DialysisCenterModalClientProps {
  center: DialysisCenter & {
    state: {
      name: string;
    };
  };
}

export function DialysisCenterModalClient({
  center,
}: DialysisCenterModalClientProps) {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialysisCenterDetails center={center} isModal />
      </DialogContent>
    </Dialog>
  );
}
