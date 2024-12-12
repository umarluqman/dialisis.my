import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path starts with /_next or is a public file
  if (path.startsWith("/_next") || PUBLIC_FILE.test(path)) {
    const response = NextResponse.next();

    // Add X-Robots-Tag header
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  return NextResponse.next();
}

// Configure matcher for /_next paths and public files
export const config = {
  matcher: [
    "/_next/:path*",
    "/:path*.:ext*", // matches files like favicon.ico, manifest.json, etc.
  ],
};
