import type { Session } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

const guestOnlyRoutes = new Set(["/login", "/signup"]);
const protectedPrefixes = ["/dashboard", "/account", "/admin"] as const;

function isPathAtOrBelow(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function authorizeRoute({
  auth,
  request,
}: {
  auth: Session | null;
  request: NextRequest;
}): boolean | NextResponse {
  const { pathname, search } = request.nextUrl;
  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    isPathAtOrBelow(pathname, prefix),
  );
  const isAuthenticated = auth?.user !== undefined;

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (guestOnlyRoutes.has(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return true;
}
