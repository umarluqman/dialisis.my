"use client";

import { usePathname } from "next/navigation";

export function NextPathsMeta() {
  const pathname = usePathname();

  if (pathname?.startsWith("/_next")) {
    return (
      <>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </>
    );
  }

  return null;
}
