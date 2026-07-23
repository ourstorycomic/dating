import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Chỉ admin mới được xem danh sách người giới thiệu." }, { status: 403 });
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("affiliates")
    .select("id, name, ref_code, email, phone, social_url, is_active, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Load affiliates failed", error);
    return NextResponse.json({ error: "Không tải được danh sách người giới thiệu." }, { status: 500 });
  }

  return NextResponse.json({ affiliates: data ?? [] });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Chỉ admin mới được tạo người giới thiệu." }, { status: 403 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim() || null;
  const phone = String(body.phone || "").trim() || null;
  const socialUrl = String(body.socialUrl || "").trim() || null;

  if (!name) {
    return NextResponse.json({ error: "Nhập tên người giới thiệu." }, { status: 400 });
  }

  // Tạo ref code từ tên (slug-like) + random suffix
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 20);
  const refCode = `${slug}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("affiliates")
    .insert({ name, ref_code: refCode, email, phone, social_url: socialUrl, is_active: true })
    .select("id, name, ref_code, email, phone, social_url, is_active, created_at")
    .single();

  if (error) {
    console.error("Create affiliate failed", error);
    return NextResponse.json({ error: "Không tạo được người giới thiệu." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, affiliate: data });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Chỉ admin mới được sửa người giới thiệu." }, { status: 403 });
  }

  const body = await request.json();
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ error: "Thiếu id." }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (body.name !== undefined) update.name = String(body.name).trim();
  if (body.email !== undefined) update.email = String(body.email).trim() || null;
  if (body.phone !== undefined) update.phone = String(body.phone).trim() || null;
  if (body.socialUrl !== undefined) update.social_url = String(body.socialUrl).trim() || null;
  if (body.isActive !== undefined) update.is_active = Boolean(body.isActive);

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("affiliates")
    .update(update)
    .eq("id", id)
    .select("id, name, ref_code, email, phone, social_url, is_active, created_at")
    .single();

  if (error) {
    console.error("Update affiliate failed", error);
    return NextResponse.json({ error: "Không cập nhật được người giới thiệu." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, affiliate: data });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Chỉ admin mới được xóa người giới thiệu." }, { status: 403 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Thiếu id." }, { status: 400 });

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("affiliates").delete().eq("id", id);

  if (error) {
    console.error("Delete affiliate failed", error);
    return NextResponse.json({ error: "Không xóa được người giới thiệu." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
