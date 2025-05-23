import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get("url");
    if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 });

    // Forward the Range header if present
    const headers: HeadersInit = {};
    const range = request.headers.get("range");
    if (range) {
        headers["range"] = range;
    }

    const response = await fetch(url, { headers });

    // Pass through status for partial content
    const status = response.status;
    const data = await response.arrayBuffer();

    // Copy relevant headers from the source response
    const contentType = response.headers.get("Content-Type") || "audio/mpeg";
    const contentRange = response.headers.get("Content-Range");
    const contentLength = response.headers.get("Content-Length");

    const proxyHeaders: Record<string, string> = {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Accept-Ranges": "bytes",
    };
    if (contentRange) proxyHeaders["Content-Range"] = contentRange;
    if (contentLength) proxyHeaders["Content-Length"] = contentLength;

    return new NextResponse(data, {
        status,
        headers: proxyHeaders,
    });
}