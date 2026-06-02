import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedPaths = [
  "/user",
  "/admin",
];

// Auth pages - redirect to home if already logged in
const authPaths = ["/login", "/register", "/forgot-password", "/reset-password"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Decode JWT payload (base64) to get role
  let userRole: string | null = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userRole = payload?.role || null;
    } catch {
      userRole = null;
    }
  }

  // Check if it is an auth page
  const isAuthRoute = authPaths.some((path) => pathname.startsWith(path));

  // Allow logged-in users to access auth pages (remove automatic redirect)
  // Users should be able to navigate between login and register freely

  // Admin routes — must be ADMIN
  if (pathname.startsWith("/admin")) {
    if (!token || userRole !== "ADMIN") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Other protected routes (user, purchase, subscription)
  const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path) && !pathname.startsWith("/admin"));
  
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
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
