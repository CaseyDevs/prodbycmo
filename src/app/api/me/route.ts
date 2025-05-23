import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.json({ role: null }, { status: 200 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role?: string; email?: string; id?: string };
        return NextResponse.json({
            role: decoded.role ?? null,
            email: decoded.email ?? null,
            id: decoded.id ?? null,
        });
    } catch {
        return NextResponse.json({ role: null }, { status: 200 });
    }
}