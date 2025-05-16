import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuid } from "uuid";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// Create a Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Get and verify JWT token
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Check admin role
    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    // 🔽 Parse form data
    const formData = await request.formData();
    const file: File | null = formData.get("file") as unknown as File;
    const title = formData.get("title") as string;
    const artistName = formData.get("artist");
    const genre = formData.get("genre") as string;
    const bpm = formData.get("bpm") as string;
    const key = formData.get("key") as string;
    const coverImg = formData.get("coverImg") as string;

    if (
      !file ||
      !title ||
      !artistName ||
      !genre ||
      !bpm ||
      !key ||
      !coverImg
    ) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Upload to Supabase
    const fileName = `${uuid()}-${file.name}`;
    const { error } = await supabase.storage.from("beats").upload(fileName, file);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/beats/${fileName}`;

    // Save metadata to DB
    const artist = await prisma.artist.upsert({
      where: { name: artistName as string },
      update: {},
      create: { name: artistName as string },
    });

    const beat = await prisma.beat.create({
      data: {
        title,
        artists: { connect: { id: artist.id } },
        genre,
        bpm: parseInt(bpm),
        key,
        coverImg,
        url: fileUrl,
      },
    });

    return NextResponse.json({ message: "Beat created successfully", beat }, { status: 201 });

  } catch (error: Error | unknown) {
    console.error("Upload error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
