import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(10, "60 s"),
});

export async function POST(request: NextRequest) {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        // Parse the IP address from the request headers
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
        const { success } = await ratelimit.limit(ip as string);
        if (!success) {
            return NextResponse.json({ error: "Too many requests! Try again later." }, { status: 429 });
        }

        // Parse the form data
        const formData = await request.formData();

        const email = formData.get("email")?.toString().trim().toLowerCase() as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Check if the user exists in the database
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
        }

        if (!user.emailVerified) {
            return NextResponse.json({ error: "Please verify your email address" }, { status: 403 });
        }

        if (isPasswordValid && user.emailVerified) {
            // Generate a JWT token
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET as string,
                {
                    expiresIn: "7d"
                }
            );

            if (!process.env.JWT_SECRET) {
                console.error("JWT_SECRET is not defined!");
            }

            const response = NextResponse.json({
                message: "Login successful",
                token,
                role: user.role,
            }, { status: 200 });

            // Set secure, HTTP-only cookie
            response.cookies.set({
                name: "token",
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });

            return response;
        }

    } catch (error: Error | unknown) {
        console.error("Error logging in:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}