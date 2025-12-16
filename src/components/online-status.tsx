"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function OnlineStatusHandler() {
  useEffect(() => {
    const handleOnline = () => {
      toast.success("Sambungan internet dipulihkan", {
        description: "Anda kini boleh menggunakan semua ciri aplikasi.",
        duration: 4000,
      });
    };

    const handleOffline = () => {
      toast.error("Tiada sambungan internet", {
        description: "Beberapa ciri mungkin tidak tersedia.",
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
