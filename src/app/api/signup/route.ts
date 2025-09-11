import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Resend } from "resend";

export async function POST(request: NextRequest) {

    if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({ error: "Email service configuration error" }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {        
        // Generate a verification token
        const verificationToken = uuid();

        // Parse the form data
        const formData = await request.formData();

        // Extract the form data
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (!email || !password || !confirmPassword) {
            return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        }

        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
        }

        for (const char of password) {
            if (char === ' ') {
                return NextResponse.json({ error: "Password cannot contain spaces." }, { status: 400 });
            }

            if (char === '\\') {
                return NextResponse.json({ error: "Password cannot contain backslashes." }, { status: 400 });
            }

            if (char === "'") {
                return NextResponse.json({ error: "Password cannot contain single quotes." }, { status: 400 });
            }
        }

        // Password must contain at least one uppercase and one lowercase letter
        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        if (!uppercaseRegex.test(password) || !lowercaseRegex.test(password)) {
            return NextResponse.json({ error: "Password must contain both uppercase and lowercase letters." }, { status: 400 });
        }

        // Password must contain at least one number
        const digitRegex = /[0-9]/;
        if (!digitRegex.test(password)) {
            return NextResponse.json({ error: "Password must contain at least one number." }, { status: 400 });
        }

        // Password must contain atleast one special character
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (!specialCharRegex.test(password)) {
            return NextResponse.json({ error: "Password must contain at least one special character. (!@#$%^&*(),.?\":{}|<> )" }, { status: 400 });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
        }

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
        try {
            const emailResult = await resend.emails.send({
                from: "ProdByCmo <no-reply@caseydevs.co.uk>",
                to: [email],
                subject: "Verify your email",
                html: `
                     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Welcome! Please verify your email address</h2>
                        <p>Thank you for signing up. Please click the button below to verify your email address:</p>
                        <a href="${verificationLink}" style="display: inline-block; background-color: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
                            Verify Email
                        </a>
                        <p>Or copy and paste this link into your browser:</p>
                        <p><a href="${verificationLink}">${verificationLink}</a></p>
                        <p>If you didn't sign up for this account, you can safely ignore this email.</p>
                    </div>
                `,
            });

            console.log("Email sent successfully");
            
            if (emailResult.error) {
                throw new Error(`Email sending failed: ${emailResult.error.message}`);
            }
            
        } catch (emailError: Error | unknown) {
            return NextResponse.json({ error: `Failed to send verification email: ${emailError}` }, { status: 500 });
        }

        return NextResponse.json({ message: "Signup successful! Please check your email to verify your account." }, { status: 201 });

    } catch (error: Error | unknown) {
        console.error("Error signing up:", error);
        
        // Log more details about the error
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
        
        return NextResponse.json({ error: "Oops, something went wrong :(" }, { status: 500 });
    }
}