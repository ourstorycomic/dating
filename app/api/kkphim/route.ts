import { NextResponse } from "next/server";

const PHIMAPI_BASE = "https://phimapi.com";
const KKPHIM_BASE = "https://kkphim.com";

async function proxyJson(baseUrl: string, endpoint: string, searchParams: URLSearchParams) {
  const upstreamUrl = new URL(`${baseUrl}/${endpoint}`);
  for (const [key, value] of searchParams.entries()) {
    if (key === "endpoint") continue;
    upstreamUrl.searchParams.set(key, value);
  }

  const upstreamResponse = await fetch(upstreamUrl.toString(), {
    headers: { accept: "application/json" },
    cache: "no-store",
  });

  const contentType = upstreamResponse.headers.get("content-type") || "";
  const bodyText = await upstreamResponse.text();

  try {
    const parsed = JSON.parse(bodyText);
    return NextResponse.json(parsed, {
      status: upstreamResponse.status,
      headers: { "cache-control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      {
        error: "Upstream không trả JSON.",
        status: upstreamResponse.status,
        contentType,
        upstream: baseUrl,
      },
      { status: 502 },
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const endpoint = url.searchParams.get("endpoint")?.replace(/^\/+/, "") || "v1/api/danh-sach/phim-le";

  try {
    try {
      return await proxyJson(PHIMAPI_BASE, endpoint, url.searchParams);
    } catch {
      return await proxyJson(KKPHIM_BASE, endpoint, url.searchParams);
    }
  } catch (error) {
    console.error("kkphim proxy failed", error);
    return NextResponse.json({ error: "Không lấy được dữ liệu phim." }, { status: 502 });
  }
}
