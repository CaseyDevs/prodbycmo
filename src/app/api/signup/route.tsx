import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
    try {        
        // Parse the form data
        const formData = await request.formData();

        // Extract the form data
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        }

        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists." }, { status: 409 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        await prisma.user.create({
            data: {
                id: uuid(),
                email,
                password: hashedPassword,
                role: "USER",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        return NextResponse.json({ message: "User created successfully" }, { status: 201 });


    } catch (error: Error | unknown) {
        console.error("Error signing up:", error);
        return NextResponse.json({ error: "Oops, something went wrong :(" }, { status: 500 });
    }
}