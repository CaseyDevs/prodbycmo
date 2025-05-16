import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_PATHS = ["/login", "/signup", "/"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathName = request.nextUrl.pathname;

  const isPublic = PUBLIC_PATHS.includes(pathName);

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };

      // Block non-admins from /upload
      if (pathName.startsWith("/upload") && decoded.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  } catch (err) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("token");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api/login|api/signup).*)"], // Don't run middleware on static or API routes
};
