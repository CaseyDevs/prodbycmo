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

        // Extract the form data
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
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


    } catch (error: Error | unknown) {

    }
}