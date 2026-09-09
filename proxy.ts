export { auth as proxy } from "@/auth";

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/account/:path*",
    "/admin/:path*",
  ],
};
