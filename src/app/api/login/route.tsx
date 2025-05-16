import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuid } from "uuid";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";


// Create a Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {

        // Parse the form data
        const formData = await request.formData();

        const email = formData.get("email") as string;
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
        const isPasswordValid = await prisma.user.findFirst({
            where: {
                email,
                password,
            },
        });

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        // Return user data
        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt, 
            }}, { status: 200 });

    } catch (error: Error | unknown) {
        console.error("Error logging in:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}