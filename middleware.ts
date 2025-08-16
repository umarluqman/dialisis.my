import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

// Combine the existing middleware with NextAuth middleware
export default withAuth(
  function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    
    // Enhanced URL pattern matching for redirects
    // Handles both /undefined/ and /dialysis-center/ legacy paths
    if (path.match(/^\/undefined\/(.+)$/) || path.match(/^\/dialysis-center\/(.+)$/)) {
      const slug = path.replace(/^\/undefined\/|^\/dialysis-center\//, '');
      return NextResponse.redirect(new URL(`/${slug}`, req.url), {
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
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Protected routes that require authentication
        if (path.startsWith("/dashboard") || path.startsWith("/admin")) {
          return !!token;
        }
        
        // Admin-only routes
        if (path.startsWith("/admin") && token) {
          return token.role === "ADMIN";
        }
        
        return true;
      },
    },
  }
);

// Configure matcher for protected paths and old URL patterns
export const config = {
  matcher: [
    "/_next/:path*",
    "/:path*.:ext*", // matches files like favicon.ico, manifest.json, etc.
    "/undefined/:path*", // match old URL pattern
    "/dialysis-center/:path*", // match alternative URL pattern
    "/dashboard/:path*", // protected user dashboard
    "/admin/:path*", // protected admin routes
    "/api/dialysis-centers/manage/:path*", // protected API routes
  ],
};
