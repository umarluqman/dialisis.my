"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { useEffect } from "react";

const MAP_HOSTS = [
  "google.com/maps",
  "google.com/maps/search",
  "maps.app.goo.gl",
  "waze.com/ul",
];
const WHATSAPP_HOSTS = ["wa.me", "api.whatsapp.com", "whatsapp.com"];
const CONTEXT_SELECTOR = [
  "[data-ga-context]",
  "[data-center-id]",
  "[data-center-slug]",
  "[data-center-name]",
].join(", ");

function getAnchor(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLAnchorElement>("a[href]");
}

function isMapLink(href: string) {
  const normalizedHref = href.toLowerCase();
  return MAP_HOSTS.some((host) => normalizedHref.includes(host));
}

function isWhatsAppLink(href: string) {
  const normalizedHref = href.toLowerCase();
  if (normalizedHref.startsWith("whatsapp:")) return true;
  return WHATSAPP_HOSTS.some((host) => normalizedHref.includes(host));
}

function cleanValue(value?: string | null) {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function getContextPayload(target: Element) {
  const contextElement = target.closest<HTMLElement>(CONTEXT_SELECTOR);
  if (!contextElement) return {};

  const {
    gaContext,
    centerId,
    centerSlug,
    centerName,
    centerTown,
    centerState,
  } = contextElement.dataset;

  return {
    ga_context: cleanValue(gaContext),
    center_id: cleanValue(centerId),
    center_slug: cleanValue(centerSlug),
    center_name: cleanValue(centerName),
    center_town: cleanValue(centerTown),
    center_state: cleanValue(centerState),
  };
}

function getLinkText(anchor: HTMLAnchorElement) {
  const text = cleanValue(anchor.textContent);
  if (!text) return undefined;
  return text.slice(0, 120);
}

function sendLeadEvent(eventName: string, payload: Record<string, unknown>) {
  sendGAEvent("event", eventName, payload);
}

function trackLeadClick(eventName: string, anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");
  if (!href) return;

  sendLeadEvent(eventName, {
    link_url: href,
    link_text: getLinkText(anchor),
    page_path: window.location.pathname,
    ...getContextPayload(anchor),
  });
}

export function GaEventTracker() {
  useEffect(() => {
    const startedForms = new WeakSet<HTMLFormElement>();

    const handleClick = (event: MouseEvent) => {
      const anchor = getAnchor(event.target);
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const normalizedHref = href.toLowerCase();

      if (normalizedHref.startsWith("tel:")) {
        trackLeadClick("lead_phone_click", anchor);
        return;
      }

      if (isWhatsAppLink(normalizedHref)) {
        trackLeadClick("lead_whatsapp_click", anchor);
        return;
      }

      if (isMapLink(normalizedHref)) {
        trackLeadClick("lead_map_click", anchor);
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) return;

      const field = event.target.closest("input, textarea, select");
      if (!field) return;

      const form = field.closest("form");
      if (!(form instanceof HTMLFormElement)) return;
      if (startedForms.has(form)) return;

      const eventName = form.dataset.gaStartEvent;
      if (!eventName) return;

      startedForms.add(form);
      sendLeadEvent(eventName, {
        form_id: form.id || "unknown_form",
        page_path: window.location.pathname,
        ...getContextPayload(form),
      });
    };

    const handleSubmit = (event: SubmitEvent) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;

      const eventName = form.dataset.gaSubmitEvent;
      if (!eventName) return;

      sendLeadEvent(eventName, {
        form_id: form.id || "unknown_form",
        page_path: window.location.pathname,
        ...getContextPayload(form),
      });
    };

    document.addEventListener("click", handleClick, true);
    document.addEventListener("focusin", handleFocusIn, true);
    document.addEventListener("submit", handleSubmit, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("focusin", handleFocusIn, true);
      document.removeEventListener("submit", handleSubmit, true);
    };
  }, []);

  return null;
}
