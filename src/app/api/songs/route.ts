import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const songs = await prisma.beat.findMany();
  return NextResponse.json(songs);
}

export async function POST(req: Request) {
  const data = await req.json();
  const song = await prisma.beat.create({
    data,
  });
  return NextResponse.json(song);
}
