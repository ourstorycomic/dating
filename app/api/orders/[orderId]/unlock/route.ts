import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function randomCode(prefix: string, length = 8) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let value = prefix;
  for (let index = 0; index < length; index += 1) {
    value += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return value;
}

function createVietQrUrl({
  amount,
  paymentCode,
}: {
  amount: number;
  paymentCode: string;
}) {
  const bankCode = process.env.BANK_CODE || "VCB";
  const accountNo = process.env.BANK_ACCOUNT_NO || "";
  const accountName = process.env.BANK_ACCOUNT_NAME || "";

  if (!accountNo) return null;

  const params = new URLSearchParams({
    addInfo: paymentCode,
    amount: String(Math.round(amount)),
  });

  if (accountName) params.set("accountName", accountName);

  return `https://img.vietqr.io/image/${bankCode}-${accountNo}-compact2.png?${params.toString()}`;
}

export async function POST(request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Bạn cần đăng nhập." }, { status: 401 });
  }

  const { orderId } = await params;
  if (!orderId) {
    return NextResponse.json({ error: "Thiếu mã đơn." }, { status: 400 });
  }

  const body = await request.json();
  const editUnlockCount = body.editUnlockCount || 1;

  const supabase = createServerSupabaseClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, status, created_by_id, amount, custom_data")
    .eq("public_id", orderId)
    .maybeSingle();

  if (orderError || !order) {
    return NextResponse.json({ error: "Không tìm thấy đơn." }, { status: 404 });
  }

  if (session.role === "EMPLOYEE" && order.created_by_id !== session.userId) {
    return NextResponse.json({ error: "Bạn không có quyền sửa đơn này." }, { status: 403 });
  }

  // Create payment record for 19k
  const amount = 19000;
  const paymentCode = randomCode("PAY", 6);
  const qrCodeUrl = createVietQrUrl({ amount, paymentCode });

  const { error: paymentError } = await supabase.from("payments").update({
    amount: 19000,
    payment_code: paymentCode,
    qr_code_url: qrCodeUrl,
    status: "PENDING",
  }).eq("order_id", order.id);

  if (paymentError) {
    console.error("Failed to update payment", paymentError);
    return NextResponse.json({ error: "Lỗi tạo thanh toán (Update)." }, { status: 500 });
  }

  // Update order status back to PENDING_PAYMENT and update amount + unlock count
  const newCustomData = {
    ...(order.custom_data as any || {}),
    isLocked: false,
    editUnlockCount
  };

  const newTotalAmount = (Number(order.amount) || 0) + amount;

  const { error } = await supabase
    .from("orders")
    .update({
      status: "PENDING_PAYMENT",
      amount: newTotalAmount,
      custom_data: newCustomData
    })
    .eq("id", order.id);

  if (error) {
    console.error("Failed to update order", error);
    return NextResponse.json({ error: "Không mở khóa được." }, { status: 500 });
  }

  await supabase.from("order_logs").insert({
    action: "ORDER_UNLOCKED_PAID",
    actor_id: session.userId,
    metadata: { source: "dashboard_order_builder", paymentCode, amount },
    order_id: order.id,
  });

  return NextResponse.json({
    ok: true,
    paymentCode,
    qrCodeUrl,
    amount
  });
}
