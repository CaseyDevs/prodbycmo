import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  if (decoded.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }
}
