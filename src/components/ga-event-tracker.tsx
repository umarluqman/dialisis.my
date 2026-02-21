"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { useEffect } from "react";

const MAP_HOSTS = ["google.com/maps", "google.com/maps/search", "waze.com/ul"];

function getHref(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return null;
  const anchor = target.closest("a[href]");
  if (!anchor) return null;
  return anchor.getAttribute("href");
}

function isMapLink(href: string) {
  return MAP_HOSTS.some((host) => href.includes(host));
}

function trackLeadClick(eventName: string, href: string) {
  sendGAEvent("event", eventName, {
    link_url: href,
    page_path: window.location.pathname,
  });
}

export function GaEventTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const href = getHref(event.target);
      if (!href) return;

      if (href.startsWith("tel:")) {
        trackLeadClick("lead_phone_click", href);
        return;
      }

      if (href.includes("wa.me")) {
        trackLeadClick("lead_whatsapp_click", href);
        return;
      }

      if (isMapLink(href)) {
        trackLeadClick("lead_map_click", href);
      }
    };

    const handleSubmit = (event: SubmitEvent) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      const eventName = form.dataset.gaSubmitEvent;
      if (!eventName) return;

      sendGAEvent("event", eventName, {
        form_id: form.id || "unknown_form",
        page_path: window.location.pathname,
      });
    };

    document.addEventListener("click", handleClick, true);
    document.addEventListener("submit", handleSubmit, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("submit", handleSubmit, true);
    };
  }, []);

  return null;
}
