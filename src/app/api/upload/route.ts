import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuid } from "uuid";

// Create a Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file:File | null = formData.get("file") as unknown as File;
    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string;
    const genre = formData.get("genre") as string;
    const bpm = formData.get("bpm") as string;
    // const coverImg = formData.get("coverImg") as string;

    // if (!file || !title || !artist || !genre || !bpm) {
    //   return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
    // }

    // Generate a unique filename
    const fileName = `${uuid()}-${file.name}`;

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("beats")
      .upload(fileName, file);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "File uploaded successfully", data });

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}