"use client";

import { IntakeLeadForm } from "@/components/intake-lead-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ReactNode } from "react";

type IntakeLeadDialogProps = {
  centerId: string;
  centerName: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
};

export function IntakeLeadDialog({
  centerId,
  centerName,
  open,
  onOpenChange,
  children,
}: IntakeLeadDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-lg p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Borang temujanji dialisis
          </DialogTitle>
          <DialogDescription>
            Lengkapkan maklumat untuk dihantar kepada {centerName}.
          </DialogDescription>
        </DialogHeader>
        <IntakeLeadForm
          centerId={centerId}
          centerName={centerName}
          hideHeader
          className="border-t-0 pt-0"
        />
      </DialogContent>
    </Dialog>
  );
}
