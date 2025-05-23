import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get("url");  // Get the URL from the query parameters
    if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 });

    const response = await fetch(url);
    if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch the URL" }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json(data, {
        status: 200,
        // Set the headers to allow caching
        headers: {
            "Content-Type": response.headers.get("Content-Type") || "audipo/mpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    });
}