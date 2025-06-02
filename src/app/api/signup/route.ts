import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Resend } from "resend";

export async function POST(request: NextRequest) {

    // Check if RESEND_API_KEY is available
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is not set in environment variables");
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
        try {
            const emailResult = await resend.emails.send({
                from: "Casey <no-reply@caseydevs.co.uk>",
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

            console.log("Email sent successfully:", emailResult);
            
            if (emailResult.error) {
                console.error("Email sending failed:", emailResult.error);
                throw new Error(`Email sending failed: ${emailResult.error.message}`);
            }
        } catch (emailError) {
            console.error("Error sending verification email:", emailError);
            // Don't fail the signup, but log the error
            // You might want to implement a retry mechanism or queue system here
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