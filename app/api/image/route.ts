export const dynamic = "force-dynamic";
export const runtime = "edge";

const ALLOWED_HOSTS = new Set(["phimapi.com", "img.phimapi.com", "phimimg.com"]);

export async function GET(request: Request) {
  const rawUrl = new URL(request.url).searchParams.get("url");
  if (!rawUrl) return new Response("Missing image URL", { status: 400 });

  const target = new URL(rawUrl);
  if (!ALLOWED_HOSTS.has(target.hostname)) return new Response("Forbidden image host", { status: 403 });

  const upstream = await fetch(rawUrl, { cache: "no-store", headers: { "User-Agent": "Mozilla/5.0" } });
  if (!upstream.ok || !upstream.body) return new Response("Image unavailable", { status: upstream.status });

  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/webp",
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
