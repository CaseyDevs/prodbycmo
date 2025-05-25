import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const beats = await prisma.beat.findMany();
  return NextResponse.json(beats);
}

export async function POST(req: Request) {
  const data = await req.json();
  const song = await prisma.beat.create({
    data,
  });
  return NextResponse.json(song);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const deletedSong = await prisma.beat.delete({
    where: { id },
  });

  return NextResponse.json(deletedSong);
}