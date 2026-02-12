"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface ModalDialogProps {
  children: React.ReactNode;
}

export function ModalDialog({ children }: ModalDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobileOrTablet(e.matches);
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (isMobileOrTablet === false) {
      router.replace(pathname);
    }
  }, [isMobileOrTablet, pathname, router]);

  if (isMobileOrTablet === null || isMobileOrTablet === false) {
    return null;
  }

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {children}
      </DialogContent>
    </Dialog>
  );
}
