import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

async function getUserFromRequest(request: NextRequest) {
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

    if (decoded.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    return decoded;
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  // If user is an error response, return it
  if (user instanceof NextResponse) {
    return user;
  }

  if (user.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  // Handle the request
    return NextResponse.json({ message: "Dashboard data fetched successfully" });
}