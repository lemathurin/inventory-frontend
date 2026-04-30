import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/login", "/signup", "/terms", "/privacy"];
const publicPathPrefixes = ["/onboarding"];
const publicApiPaths = [
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/register",
];
const protectedApiPathPrefix = "/api/";

const isPublicPath = (pathname: string) =>
  publicPaths.includes(pathname) ||
  publicPathPrefixes.some((prefix) => pathname.startsWith(prefix));

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname) || publicApiPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const isProtectedApi = pathname.startsWith(protectedApiPathPrefix);

  if (isProtectedApi && !token) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    if (!isPublicPath(pathname)) {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
