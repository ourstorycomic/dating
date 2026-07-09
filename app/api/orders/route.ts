import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createServerSupabaseClient, MOCK_TEMPLATES } from "@/lib/supabase/server";

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

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Bạn cần đăng nhập để tạo đơn." }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();
  const { data: userRecord } = await supabase.from("users").select("role, custom_roles(permissions)").eq("id", session.userId).single();
  const permissions = (userRecord?.custom_roles as any)?.permissions || [];
  const canCreateFree = session.role === "ADMIN" || userRecord?.role === "ADMIN" || permissions.includes("orders:create_free");

  const body = await request.json();
  const templateId = body.templateId as string | undefined;
  const customData = body.customData ?? {};

  if (!templateId) {
    return NextResponse.json({ error: "Thiếu template." }, { status: 400 });
  }

  const { data: template, error: templateError } = await supabase
    .from("templates")
    .select("id, base_price, is_published")
    .eq("id", templateId)
    .maybeSingle();

  let finalTemplate = template;

  if (templateError || !template || !template.is_published) {
    const mockMatch = MOCK_TEMPLATES.find(m => m.id === templateId || m.slug === templateId);
    if (mockMatch) {
      finalTemplate = {
        id: mockMatch.id,
        base_price: mockMatch.base_price,
        is_published: true
      };
    } else {
      if (templateError) console.error("Template lookup failed", templateError);
      return NextResponse.json({ error: "Template không hợp lệ hoặc đã tắt." }, { status: 400 });
    }
  }

  const isFreeOrder = session.role === "ADMIN" || (Boolean(body.isFreeOrder) && canCreateFree);

  // Cho phép client truyền giá (dùng cho các gói dịch vụ khác nhau)
  const amount = isFreeOrder
    ? 0
    : (body.amount && Number(body.amount) >= 2000 ? Number(body.amount) : Number(finalTemplate?.base_price || 0));

  if (!isFreeOrder && (!amount || amount < 2000)) {
    return NextResponse.json({ error: "Giá không hợp lệ (tối thiểu 2,000đ)." }, { status: 400 });
  }

  const publicId = randomCode("LOVE");
  const paymentCode = randomCode("PAY", 6);
  const qrCodeUrl = createVietQrUrl({ amount, paymentCode });

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      amount,
      buyer_contact: body.buyerContact ?? null,
      buyer_name: body.buyerName ?? null,
      buyer_social_handle: body.buyerContact ?? null,
      created_by_id: session.userId,
      custom_data: customData,
      public_id: publicId,
      recipient_name: body.recipientName ?? customData.recipientName ?? null,
      status: isFreeOrder ? "ACTIVE" : "PENDING_PAYMENT",
      template_id: templateId,
      expires_at: customData.expiresAtDate ? new Date(customData.expiresAtDate).toISOString() : null,
    })
    .select("id, public_id")
    .single();

  if (orderError || !order) {
    console.error("Failed to create order", orderError);
    return NextResponse.json({ error: "Không tạo được đơn trong database." }, { status: 500 });
  }

  if (!isFreeOrder) {
    const { error: paymentError } = await supabase.from("payments").insert({
      amount,
      order_id: order.id,
      payment_code: paymentCode,
      provider: "VIETQR_BANKING",
      qr_code_url: qrCodeUrl,
      status: "PENDING",
    });

    if (paymentError) {
      console.error("Failed to create payment", paymentError);
      return NextResponse.json({ error: "Đã tạo đơn nhưng lỗi tạo thanh toán." }, { status: 500 });
    }
  }

  await supabase.from("order_logs").insert({
    action: "ORDER_CREATED",
    actor_id: session.userId,
    metadata: {
      paymentCode: isFreeOrder ? "FREE" : paymentCode,
      source: "dashboard_order_builder",
      templateId,
      isFreeOrder,
    },
    order_id: order.id,
  });

  return NextResponse.json({
    amount,
    giftPath: `/gift/${order.public_id}`,
    orderId: order.public_id,
    paymentCode: isFreeOrder ? "FREE" : paymentCode,
    paymentStatus: isFreeOrder ? "PAID" : "PENDING",
    qrCodeUrl: isFreeOrder ? null : qrCodeUrl,
    status: isFreeOrder ? "ACTIVE" : "PENDING_PAYMENT",
    trackPath: `/track/${order.public_id}`,
    unlocked: isFreeOrder,
  });
}

export async function PATCH(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Bạn cần đăng nhập để sửa đơn." }, { status: 401 });
  }

  const body = await request.json();
  const orderId = String(body.orderId || "");
  const customData = body.customData ?? {};
  const recipientName = body.recipientName ?? customData.recipientName ?? null;
  const buyerName = body.buyerName ?? null;
  // Update template_id when user switches template on an existing order
  const newTemplateId = body.templateId ? String(body.templateId) : null;

  if (!orderId) {
    return NextResponse.json({ error: "Thiếu mã đơn." }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, status, created_by_id")
    .eq("public_id", orderId)
    .maybeSingle();

  if (orderError || !order) {
    return NextResponse.json({ error: "Không tìm thấy đơn." }, { status: 404 });
  }

  if (order.status === "PENDING_PAYMENT" && session.role !== "ADMIN") {
    return NextResponse.json({ error: "Đơn chưa thanh toán, chưa được chỉnh template." }, { status: 403 });
  }

  if (session.role === "EMPLOYEE" && order.created_by_id !== session.userId) {
    return NextResponse.json({ error: "Bạn không có quyền sửa đơn này." }, { status: 403 });
  }

  const { error } = await supabase
    .from("orders")
    .update({
      custom_data: customData,
      recipient_name: recipientName,
      buyer_name: buyerName !== null ? buyerName : undefined,
      ...(newTemplateId ? { template_id: newTemplateId } : {}),
      expires_at: customData.expiresAtDate ? new Date(customData.expiresAtDate).toISOString() : undefined,
    })
    .eq("id", order.id);

  if (error) {
    console.error("Failed to update order", error);
    return NextResponse.json({ error: "Không lưu được chỉnh sửa." }, { status: 500 });
  }

  await supabase.from("order_logs").insert({
    action: "ORDER_UPDATED",
    actor_id: session.userId,
    metadata: {
      source: "dashboard_order_builder",
      ...(newTemplateId ? { newTemplateId } : {}),
    },
    order_id: order.id,
  });

  return NextResponse.json({ ok: true });
}
