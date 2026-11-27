import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

const ALLOWED_HOSTS = new Set([
  "kprbltjqxnrvkybjtgmb.supabase.co",
  "lovora-two.vercel.app",
  "lovora.vn",
  "lovora.click",
]);

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");
  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  const requestHost = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let supabaseHost = "";
  if (supabaseUrl) {
    try {
      supabaseHost = new URL(supabaseUrl).hostname;
    } catch {
      supabaseHost = "";
    }
  }

  const isAllowed =
    (parsed.protocol === "https:" || parsed.protocol === "http:") &&
    (ALLOWED_HOSTS.has(parsed.hostname) ||
      parsed.hostname === requestHost.split(":")[0] ||
      (supabaseHost && parsed.hostname === supabaseHost));

  if (!isAllowed) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      next: { revalidate: 86400 },
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: "Upstream fetch failed" }, { status: 502 });
    }

    const arrayBuffer = await upstream.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    try {
      const jpegBuffer = await sharp(inputBuffer)
        .resize(1200, 630, { fit: "cover", position: "center" })
        .jpeg({ quality: 85, mozjpeg: true })
        .toBuffer();

      return new NextResponse(new Uint8Array(jpegBuffer), {
        status: 200,
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      });
    } catch {
      const contentType = upstream.headers.get("content-type") || "image/jpeg";
      return new NextResponse(new Uint8Array(inputBuffer), {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      });
    }
  } catch {
    return NextResponse.json({ error: "Failed to load image" }, { status: 500 });
  }
}
