import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import sharp from "sharp";

// ── Config ────────────────────────────────────────────────────────────────────
const BUCKET = "assets";

const COMPRESS = {
  maxWidth: 680,            // 2× the 340px phone frame → sharp on Retina
  maxHeight: 1440,          // 2× phone height
  webpQuality: 82,          // visually lossless, ~3-5× smaller than PNG
  skipIfUnderBytes: 150_000, // already small → just resize, keep as PNG
};

/** Ensure the storage bucket exists, creating it (public) if not. */
async function ensureBucket(supabase: ReturnType<typeof createServerSupabaseClient>) {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets?.some((b) => b.name === BUCKET)) return; // already exists

  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
  });

  // "already exists" can race — treat it as success
  if (error && !error.message.toLowerCase().includes("already exist")) {
    throw new Error(`Không thể tạo storage bucket: ${error.message}`);
  }
}

/** Extract the storage object path from a Supabase public URL. Returns null if not parseable. */
function extractStoragePath(publicUrl: string): string | null {
  try {
    const url = new URL(publicUrl);
    const marker = `/object/public/${BUCKET}/`;
    const idx = url.pathname.indexOf(marker);
    if (idx === -1) return null;
    return url.pathname.slice(idx + marker.length);
  } catch {
    return null;
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const slug = formData.get("slug") as string | null;

    if (!file || !slug) {
      return NextResponse.json({ error: "Thiếu file hoặc slug" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Chỉ chấp nhận file ảnh" }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File quá lớn (tối đa 10MB)" }, { status: 400 });
    }

    // ── Compress ──────────────────────────────────────────────────────────────
    const rawBuffer = Buffer.from(await file.arrayBuffer());
    const originalSize = rawBuffer.byteLength;

    let outputBuffer: Buffer;
    let mimeType: string;
    let ext: string;

    if (originalSize <= COMPRESS.skipIfUnderBytes) {
      outputBuffer = await sharp(rawBuffer)
        .rotate()
        .resize(COMPRESS.maxWidth, COMPRESS.maxHeight, { fit: "inside", withoutEnlargement: true })
        .png({ compressionLevel: 8 })
        .toBuffer();
      mimeType = "image/png";
      ext = "png";
    } else {
      outputBuffer = await sharp(rawBuffer)
        .rotate()
        .resize(COMPRESS.maxWidth, COMPRESS.maxHeight, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: COMPRESS.webpQuality, effort: 4, smartSubsample: true })
        .toBuffer();
      mimeType = "image/webp";
      ext = "webp";
    }

    const ratio = ((1 - outputBuffer.byteLength / originalSize) * 100).toFixed(1);
    console.log(
      `[thumbnail] ${slug}: ${(originalSize / 1024).toFixed(0)}KB → ` +
      `${(outputBuffer.byteLength / 1024).toFixed(0)}KB (-${ratio}%) .${ext}`
    );

    const supabase = createServerSupabaseClient();
    const newPath = `thumbnails/${slug}.${ext}`;

    // ── Ensure bucket exists ──────────────────────────────────────────────────
    await ensureBucket(supabase);

    // ── Delete old file if different path (different extension) ───────────────
    const { data: existing } = await supabase
      .from("templates")
      .select("thumbnail_url")
      .eq("id", id)
      .maybeSingle();

    if (existing?.thumbnail_url) {
      const oldPath = extractStoragePath(existing.thumbnail_url);
      if (oldPath && oldPath !== newPath) {
        const { error: delError } = await supabase.storage.from(BUCKET).remove([oldPath]);
        if (delError) {
          console.warn("[thumbnail] could not delete old file:", delError.message);
        } else {
          console.log(`[thumbnail] deleted old: ${oldPath}`);
        }
      }
      // Same path → upsert below overwrites in-place, no delete needed
    }

    // ── Upload ────────────────────────────────────────────────────────────────
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(newPath, outputBuffer, { contentType: mimeType, upsert: true });

    if (uploadError) {
      console.error("[thumbnail upload] storage error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // ── Public URL + DB update ────────────────────────────────────────────────
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(newPath);

    const { error: dbError } = await supabase
      .from("templates")
      .update({ thumbnail_url: publicUrl })
      .eq("id", id);

    if (dbError) {
      console.error("[thumbnail upload] db error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      stats: {
        originalKB: Math.round(originalSize / 1024),
        outputKB: Math.round(outputBuffer.byteLength / 1024),
        savedPercent: Number(ratio),
        format: ext,
      },
    });
  } catch (err: any) {
    console.error("[thumbnail upload error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
