import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_PATHS = [
    "/login",
    "/signup",
    "/"
]

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const pathName = request.nextUrl.pathname;

    const isPublic = PUBLIC_PATHS.includes(pathName);


    // Redirect to login if user is not authenticated and route is protected
    if (!token && !isPublic) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

    // If logged-in user tries to visit login page, redirect to home
    if (token && pathName === "/login") {
        return NextResponse.redirect(new URL("/", request.url))
    }
}