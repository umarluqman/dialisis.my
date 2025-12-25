import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const locales = ["ms", "en"] as const;
export const defaultLocale = "ms" as const;
export const localePrefix = "as-needed" as const;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix,
});

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createNavigation(routing);
