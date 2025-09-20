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

// Configure matcher for /_next paths, public files, and old URL patterns
export const config = {
  matcher: [
    "/_next/:path*",
    "/:path*.:ext*", // matches files like favicon.ico, manifest.json, etc.
    "/undefined/:path*", // match old URL pattern
    "/dialysis-center/:path*", // match alternative URL pattern
  ],
};
