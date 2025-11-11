import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/app/lib/jwt";

export default async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();

  // ----- Redirect logged-in users away from public pages -----
  if (url.pathname === "/login" || url.pathname === "/signup") {
    if (token) {
      try {
        const payload = await verifyJWT(token);
        if (payload) {
          return NextResponse.redirect(new URL("/", req.url));
        }
      } catch (err) {
        // Token invalid or expired, allow access to login/signup
      }
    }
  }

  // ----- Protect private routes -----
  if (url.pathname !== "/login" && url.pathname !== "/signup") {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    try {
      const payload = await verifyJWT(token);
      if (!payload) return NextResponse.redirect(new URL("/login", req.url));
    } catch (err) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup"], // include public & private routes
};
