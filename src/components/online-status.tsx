"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "sonner";

export function OnlineStatusHandler() {
  const t = useTranslations("onlineStatus");

  useEffect(() => {
    const handleOnline = () => {
      toast.success(t("onlineTitle"), {
        description: t("onlineDescription"),
        duration: 4000,
      });
    };

    const handleOffline = () => {
      toast.error(t("offlineTitle"), {
        description: t("offlineDescription"),
        duration: 0, // Keep showing until back online
      });
    };

    // Check initial status
    if (!navigator.onLine) {
      handleOffline();
    }

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return null;
}
