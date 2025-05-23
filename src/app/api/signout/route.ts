import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json({ message: "Logout successful", }, { status: 200 });
        response.cookies.set("token", "", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            expires: new Date(0),
            path: "/",
        });
    } catch (error) {
        return NextResponse.json({ message: "Logout failed", error }, { status: 500 });
    }
}   