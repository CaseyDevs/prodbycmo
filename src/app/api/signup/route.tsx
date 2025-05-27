import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Resend } from "resend";

export async function POST(request: NextRequest) {

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {        
        // Generate a verification token
        const verificationToken = uuid();

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
                emailVerified: false,
                emailVerificationToken: verificationToken,
            },
        });

        const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-email?token=${verificationToken}`;
        // Send verification email
        await resend.emails.send({
            from: "prodbycmo@gmail.com",
            to: email,
            subject: "Verify your email",
            html: `<p>Please click the link below to verify your email:</p><p><a href="${verificationLink}">${verificationLink}</a></p>`,
        });

        return NextResponse.json({ message: "Signup successful! Please check your email to verify your account." }, { status: 201 });

    } catch (error: Error | unknown) {
        console.error("Error signing up:", error);
        return NextResponse.json({ error: "Oops, something went wrong :(" }, { status: 500 });
    }
}