import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

<<<<<<< HEAD
export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;

  // Protect /user and /admin routes
  if (
    request.nextUrl.pathname.startsWith("/user") ||
    request.nextUrl.pathname.startsWith("/admin")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
=======
// Routes that require authentication
const protectedPaths = [
  "/user",
  "/admin",
  "/purchase",
  "/subscription",
];

// Auth pages - redirect to home if already logged in
const authPaths = ["/login", "/register", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  // Check if the current path is a protected route
  const isProtectedRoute =
    protectedPaths.some((path) => pathname.startsWith(path));

  // Check if the current path is an auth page
  const isAuthRoute = authPaths.some((path) => pathname.startsWith(path));

  // If trying to access protected route without token → redirect to login
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in user tries to access auth pages → redirect to home
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
>>>>>>> 9b8fc83dd18b0deadfb5163f8462cd3a7d74e6be
  }

  return NextResponse.next();
}

export const config = {
<<<<<<< HEAD
  matcher: ["/user/:path*", "/admin/:path*"],
};
=======
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

>>>>>>> 9b8fc83dd18b0deadfb5163f8462cd3a7d74e6be
