import { Role } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// paths that require authentication or authorization
const requireAuth: string[] = [
    "/product",
    "/profile",
    "/shop",
    "/address",
    "/cart",
    "/transactions",
    "/api/address",
    // "/api/product", //kalau pakai ini getProduct akan terhalang middleware
    "/api/profile",
    "/api/shop",
    "/api/cart",
    "/api/transactions/",
    "/resetpassword"
];
const protectedPaths: string[] = ["/admin/console"];

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
  
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const token = await getToken({
      req: request,
      secret: process.env.JWT_SECRET,
    });
    //console.log("ROLE : ", token?.role);
    //check not logged in
    if (!token) {
      const url = new URL(`/admin/login`, request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    } else if(token.role != Role.ADMIN){
      const url = new URL(`/403`, request.url);
      return NextResponse.redirect(url);
    }
  }
  return res;
}
