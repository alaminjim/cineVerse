import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Decode JWT payload (base64) to get role — no verification needed, server handles that
  let userRole: string | null = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userRole = payload.role || null;
    } catch {
      userRole = null;
    }
  }

  // Admin routes — must be ADMIN
  if (pathname.startsWith("/admin")) {
    if (!token || userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // User dashboard routes — must be logged in
  if (pathname.startsWith("/user")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
