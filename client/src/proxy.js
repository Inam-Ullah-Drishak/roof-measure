import { NextResponse } from "next/server";

// Quick check before protected pages load: no login cookie -> go to login.
// This is only a convenience redirect. The real security is on the API,
// which verifies the token and role on every request.
export function proxy(request) {
  const hasSession = request.cookies.has("token");

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
