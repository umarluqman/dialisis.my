import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow auth routes
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  // Allow public routes
  const publicRoutes = [
    "/",
    "/peta",
    "/tentang-kami",
    "/hubungi-kami",
    "/polisi-privasi",
    "/terma-dan-syarat",
    "/api/center-list",
    "/api/centers-map",
    "/api/sitemap",
    "/api/og",
  ];

  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  );

  // Allow public API routes and static files
  if (
    isPublicRoute ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Protected routes - require authentication
  const protectedRoutes = ["/admin", "/dashboard"];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session?.user) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
      }

      // Check role-based access
      if (pathname.startsWith("/admin") && session.user.role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      if (pathname.startsWith("/dashboard") && !["SUPER_ADMIN", "BUSINESS_OWNER"].includes(session.user.role)) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
      }

    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};