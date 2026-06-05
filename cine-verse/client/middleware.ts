import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedPaths = ["/user", "/admin"];

// Auth pages — redirect to home if already logged in
const authPaths = ["/login", "/register", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Decode JWT payload (base64) to get role — no external deps needed
  let userRole: string | null = null;
  if (token && token !== "undefined" && token !== "null" && token.length > 10) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userRole = payload?.role || null;
    } catch {
      userRole = null;
    }
  }

  // Admin routes — must be ADMIN
  if (pathname.startsWith("/admin")) {
    if (!token || userRole !== "ADMIN") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Other protected routes (user)
  const isProtectedRoute = protectedPaths.some(
    (path) => pathname.startsWith(path) && !pathname.startsWith("/admin")
  );

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user/:path*",
    "/admin/:path*",
    "/purchase/:path*",
    "/subscription/:path*",
  ],
};
