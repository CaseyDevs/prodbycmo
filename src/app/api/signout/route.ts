import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json({ message: "Logout successful", }, { status: 200 });
        // Clear the cookie by setting its expiration date to the past
        response.cookies.set("token", "", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            expires: new Date(0),
            path: "/",
        });

        return response;
    } catch (error) {
        return NextResponse.json({ message: "Logout failed", error }, { status: 500 });
    }
}   