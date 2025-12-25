"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  const t = useTranslations("common.actions");

  return (
    <Button
      variant="outline"
      onClick={() => router.back()}
      size="sm"
      className="hover:text-foreground transition-colors"
    >
      <ChevronLeft className="w-4 h-4" /> {t("backToList")}
    </Button>
  );
}
