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
