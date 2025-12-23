import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export default async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  // Redirect logged-in users away from login/signup
  if (url.pathname === "/login" || url.pathname === "/signup") {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, secret, {
          algorithms: ["HS256"],
          maxTokenAge: "1d",
        });
        if (payload) {
          console.log(payload);
          return NextResponse.redirect(new URL("/", req.url));
        }
      } catch {
        // no-op, token invalid or expired
      }
    }
  }

  // Protect other routes
  if (url.pathname !== "/login" && url.pathname !== "/signup") {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    try {
      const { payload } = await jwtVerify(token, secret, {
        algorithms: ["HS256"],
        maxTokenAge: "1d",
      });
      if (!payload) return NextResponse.redirect(new URL("/login", req.url));
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup"],
};
