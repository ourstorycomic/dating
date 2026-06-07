import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const supabase = createServerSupabaseClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("public_id, status, payments(payment_code, amount, status, qr_code_url, paid_at)")
    .eq("public_id", orderId)
    .maybeSingle();

  if (error || !order) {
    return NextResponse.json({ error: "Không tìm thấy đơn." }, { status: 404 });
  }

  const payment = Array.isArray(order.payments) ? order.payments[0] : order.payments;

  return NextResponse.json({
    orderId: order.public_id,
    payment,
    status: order.status,
    unlocked: order.status === "ACTIVE" || order.status === "RESPONDED",
  });
}
