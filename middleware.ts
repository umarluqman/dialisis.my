import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Enhanced URL pattern matching for redirects
  // Handles both /undefined/ and /dialysis-center/ legacy paths
  if (path.match(/^\/undefined\/(.+)$/) || path.match(/^\/dialysis-center\/(.+)$/)) {
    const slug = path.replace(/^\/undefined\/|^\/dialysis-center\//, '');
    return NextResponse.redirect(new URL(`/${slug}`, request.url), {
      status: 301, // Permanent redirect
    });
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
