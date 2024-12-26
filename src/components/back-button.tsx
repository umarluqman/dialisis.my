"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      onClick={() => router.back()}
      size="sm"
      className="hover:text-foreground transition-colors"
    >
      <ChevronLeft className="w-4 h-4" /> Senarai
    </Button>
  );
}
