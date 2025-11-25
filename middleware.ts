import { getAllLocationData } from "@/lib/location-utils";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

// Cache location data to avoid repeated computation
let locationSlugs: Set<string> | null = null;

function getLocationSlugs(): Set<string> {
  if (!locationSlugs) {
    const locationData = getAllLocationData();
    locationSlugs = new Set();

    locationData.forEach(({ stateSlug, cities }) => {
      locationSlugs!.add(`lokasi/${stateSlug}`);
      cities.forEach((city) => {
        const citySlug = city
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9\-]/g, "")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");
        locationSlugs!.add(`lokasi/${stateSlug}/${citySlug}`);
      });
    });
  }

  return locationSlugs;
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const hostname = request.headers.get("host") || "";

  // Redirect www to non-www
  if (hostname.startsWith("www.")) {
    const newUrl = new URL(request.url);
    newUrl.hostname = hostname.replace("www.", "");
    return NextResponse.redirect(newUrl, {
      status: 301, // Permanent redirect
    });
  }

  // Enhanced URL pattern matching for redirects
  // Handles both /undefined/ and /dialysis-center/ legacy paths
  if (
    path.match(/^\/undefined\/(.+)$/) ||
    path.match(/^\/dialysis-center\/(.+)$/)
  ) {
    const slug = path.replace(/^\/undefined\/|^\/dialysis-center\//, "");
    return NextResponse.redirect(new URL(`/${slug}`, request.url), {
      status: 301, // Permanent redirect
    });
  }

  // Route conflict resolution: Check if path matches location routes
  // This ensures location routes take precedence over center slugs
  const pathWithoutLeadingSlash = path.substring(1);
  if (pathWithoutLeadingSlash) {
    const locationSlugs = getLocationSlugs();

    // If it's a valid location route, let it proceed
    if (locationSlugs.has(pathWithoutLeadingSlash)) {
      return NextResponse.next();
    }
  }

  // Check if the path starts with /_next or is a public file
  if (path.startsWith("/_next") || PUBLIC_FILE.test(path)) {
    const response = NextResponse.next();

    // Add X-Robots-Tag header
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  return NextResponse.next();
}

// Configure matcher for all paths except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|js|css|woff|woff2|ttf|otf)$).*)",
  ],
};
