import { NextResponse } from "next/server";

function normalizeTitle(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title = normalizeTitle(url.searchParams.get("title") ?? "");
  const year = url.searchParams.get("year")?.trim();
  const imdbId = url.searchParams.get("imdbId")?.trim();

  if (!title && !imdbId) {
    return NextResponse.json({ error: "Thiếu title hoặc imdbId." }, { status: 400 });
  }

  const apiKey = process.env.OMDB_API_KEY || process.env.IMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      ok: false,
      source: "omdb",
      error: "OMDB_API_KEY chưa được cấu hình.",
    }, { status: 503 });
  }

  const params = new URLSearchParams({ apikey: apiKey });
  if (imdbId) {
    params.set("i", imdbId);
  } else {
    params.set("t", title);
    if (year) params.set("y", year);
    params.set("plot", "short");
    params.set("r", "json");
  }

  const response = await fetch(`https://www.omdbapi.com/?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Không gọi được IMDb metadata." }, { status: 502 });
  }

  const data = await response.json() as {
    Response?: string;
    Title?: string;
    Year?: string;
    imdbRating?: string;
    imdbVotes?: string;
    Genre?: string;
    Rated?: string;
    Type?: string;
    Language?: string;
    imdbID?: string;
    Poster?: string;
  };

  if (data.Response === "False") {
    return NextResponse.json({ ok: false, source: "omdb", error: "Không tìm thấy phim trên IMDb." }, { status: 404 });
  }

  const rating = Number.parseFloat(data.imdbRating || "");
  const votes = Number.parseInt((data.imdbVotes || "").replace(/,/g, ""), 10);

  return NextResponse.json({
    ok: true,
    source: "omdb",
    title: data.Title ?? title,
    year: data.Year ?? year ?? null,
    rating: Number.isFinite(rating) ? rating : null,
    votes: Number.isFinite(votes) ? votes : null,
    genres: data.Genre ? data.Genre.split(",").map((item) => item.trim()).filter(Boolean) : [],
    quality: data.Rated ?? null,
    lang: data.Language ?? null,
    type: data.Type ?? null,
    imdbId: data.imdbID ?? null,
    poster: data.Poster ?? null,
  });
}
