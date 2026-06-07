import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function DELETE(request: Request) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Chỉ admin mới được xóa nhật ký." }, { status: 403 });
  }

  const { ids } = await request.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "Thiếu log cần xóa." }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("order_logs").delete().in("id", ids);

  if (error) {
    console.error("Failed to delete logs", error);
    return NextResponse.json({ error: "Không xóa được nhật ký." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
