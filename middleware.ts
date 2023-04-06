import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// paths that require authentication or authorization
const requireAuth: string[] = [
    "/product",
    "/profile",
    "/shop",
    "/address",
    "/api/address",
    "/api/product",
    "/api/profile",
    "/api/shop",
];

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  if (requireAuth.some((path) => pathname.startsWith(path))) {
    const token = await getToken({
      req: request,
      secret: process.env.JWT_SECRET,
    });

    //check not logged in
    if (!token) {
      const url = new URL(`/login`, request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }
  return res;
}
