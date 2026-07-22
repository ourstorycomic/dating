import { NextResponse } from "next/server";
import { proxyJson } from "@/lib/kkphim";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const endpoint = url.searchParams.get("endpoint")?.replace(/^\/+/, "") || "v1/api/danh-sach/phim-le";

  try {
    const params = new URLSearchParams(url.searchParams);
    params.delete("endpoint");
    const searchString = params.toString();
    const query = searchString ? `?${searchString}` : "";
    
    return await proxyJson(`/${endpoint}${query}`, {
      cache: "no-store",
    });
  } catch (error) {
    console.error("kkphim proxy failed", error);
    return NextResponse.json({ error: "Không lấy được dữ liệu phim." }, { status: 502 });
  }
}
