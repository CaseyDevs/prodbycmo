import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {

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
        

    } catch (error: Error | unknown) {
        console.error("Error logging in:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}