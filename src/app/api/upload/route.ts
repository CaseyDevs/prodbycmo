import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuid } from "uuid";
import { prisma } from "@/lib/prisma";

// Create a Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
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

    // Generate a unique filename
    const fileName = `${uuid()}-${file.name}`;

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("beats")
      .upload(fileName, file);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/beats/${fileName}`; // Construct the file URL

    // Save the file URL and other metadata to the database

    // Create or find the artist first
    const artist = await prisma.artist.upsert({
      where: { name: artistName as string },
      update: {},
      create: { name: artistName as string },
    });

    // Add the beat to the database
    const beat = await prisma.beat.create({
      data: {
        title,
        artists: {
          connect: { id: artist.id },
        },
        genre,
        bpm: parseInt(bpm),
        key,
        coverImg,
        url: fileUrl,
      },
    });

    return NextResponse.json({ message: "Beat created successfully", beat }, { status: 201 });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }

}