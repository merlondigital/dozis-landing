import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for better-auth session cookie
  // In production (HTTPS), better-auth prefixes with __Secure-
  const sessionToken =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  // Public routes that don't need auth
  if (pathname === "/" || pathname.startsWith("/api/") || pathname === "/app/login" || pathname.startsWith("/legal")) {
    return NextResponse.next();
  }

  // All /app/* routes require authentication
  if (pathname.startsWith("/app")) {
    if (!sessionToken) {
      const loginUrl = new URL("/app/login", request.url);
      // Store original URL for redirect after login (per D-18)
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all /app/* routes except static files
    "/app/:path*",
  ],
};
