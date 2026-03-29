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

  // /app/register is accessible with session (no profile check needed in middleware)
  if (pathname === "/app/register") {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/app/login", request.url));
    }
    return NextResponse.next();
  }

  // All other /app/* routes require authentication
  if (pathname.startsWith("/app")) {
    if (!sessionToken) {
      const loginUrl = new URL("/app/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check session data cookie for profileCompleted
    const sessionDataCookie =
      request.cookies.get("better-auth.session_data") ||
      request.cookies.get("__Secure-better-auth.session_data");

    if (sessionDataCookie?.value) {
      try {
        const sessionData = JSON.parse(sessionDataCookie.value);
        const profileCompleted = sessionData?.user?.profileCompleted;
        if (profileCompleted === false || profileCompleted === 0) {
          return NextResponse.redirect(new URL("/app/register", request.url));
        }
      } catch {
        // Can't parse session data - let the page handle it
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/app/:path*",
  ],
};
