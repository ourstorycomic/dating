import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const allowedTypes = new Set(["EMPLOYEE", "STAFF", "AFFILIATE"]);

type IncomingRule = {
  isActive?: boolean;
  percentage?: number | string;
  recipientType?: string;
};

export async function PATCH(request: Request) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Chỉ admin mới được sửa hoa hồng." }, { status: 403 });
  }

  const body = await request.json();
  const rules: IncomingRule[] = Array.isArray(body.rules) ? body.rules : [];

  if (!rules.length) {
    return NextResponse.json({ error: "Thiếu cấu hình hoa hồng." }, { status: 400 });
  }

  const updates = rules.map((rule) => ({
    is_active: rule.isActive !== false,
    percentage: Number(rule.percentage),
    recipient_type: String(rule.recipientType || "").toUpperCase(),
  }));

  for (const rule of updates) {
    if (!allowedTypes.has(rule.recipient_type)) {
      return NextResponse.json({ error: "Loại hoa hồng không hợp lệ." }, { status: 400 });
    }

    if (!Number.isFinite(rule.percentage) || rule.percentage < 0 || rule.percentage > 100) {
      return NextResponse.json({ error: "Phần trăm hoa hồng phải từ 0 đến 100." }, { status: 400 });
    }
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("commission_rules")
    .upsert(updates, { onConflict: "recipient_type" })
    .select("recipient_type, percentage, is_active");

  if (error) {
    console.error("Failed to update commission rules", error);
    return NextResponse.json({ error: "Không lưu được cấu hình hoa hồng." }, { status: 500 });
  }

  await supabase.from("order_logs").insert({
    action: "COMMISSION_CREATED",
    actor_id: session.userId,
    metadata: { rules: updates, type: "COMMISSION_RULE_UPDATED" },
  });

  return NextResponse.json({ ok: true, rules: data });
}
