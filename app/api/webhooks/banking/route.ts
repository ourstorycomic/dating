import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type BankingWebhookPayload = {
  amount?: number | string;
  content?: string;
  description?: string;
  gateway?: string;
  id?: number | string;
  paymentCode?: string;
  referenceCode?: string;
  transactionId?: string;
  transferAmount?: number | string;
  transferType?: string;
};

type CommissionInsert = {
  affiliate_id?: string;
  amount: number;
  order_id: string;
  percentage: number;
  recipient_type: "AFFILIATE" | "EMPLOYEE" | "STAFF";
  user_id?: string;
};

type CommissionRuleRow = {
  percentage: number | string;
  recipient_type: string;
};

function getGlobalPercentage(rules: CommissionRuleRow[] | null | undefined, recipientType: string) {
  const rule = rules?.find((item) => item.recipient_type === recipientType);
  return Number(rule?.percentage ?? 0);
}

async function getUserCommissionPercentage({
  fallbackRecipientType,
  fallbackRules,
  supabase,
  templateId,
  userId,
}: {
  fallbackRecipientType: "EMPLOYEE" | "STAFF";
  fallbackRules: CommissionRuleRow[] | null | undefined;
  supabase: ReturnType<typeof createServerSupabaseClient>;
  templateId: string;
  userId?: string | null;
}) {
  if (!userId) return 0;

  const { data: user } = await supabase
    .from("users")
    .select("id, custom_role_id, custom_roles(id, commission_percentage)")
    .eq("id", userId)
    .maybeSingle();

  const { data: userOverride } = await supabase
    .from("user_commission_overrides")
    .select("percentage")
    .eq("user_id", userId)
    .eq("template_id", templateId)
    .eq("recipient_type", fallbackRecipientType)
    .eq("is_active", true)
    .maybeSingle();

  if (userOverride) return Number(userOverride.percentage);

  if (user?.custom_role_id) {
    const { data: roleRule } = await supabase
      .from("role_commission_rules")
      .select("percentage")
      .eq("role_id", user.custom_role_id)
      .eq("template_id", templateId)
      .eq("is_active", true)
      .maybeSingle();

    if (roleRule) return Number(roleRule.percentage);

    const customRole = Array.isArray(user.custom_roles) ? user.custom_roles[0] : user.custom_roles;
    const rolePercentage = Number(customRole?.commission_percentage ?? 0);
    if (rolePercentage > 0) return rolePercentage;
  }

  return getGlobalPercentage(fallbackRules, fallbackRecipientType);
}

function toAmount(value: unknown) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}

function extractPaymentCode(payload: BankingWebhookPayload) {
  const explicitCode = payload.paymentCode;
  if (explicitCode) return explicitCode.trim().toUpperCase();

  const content = `${payload.content ?? ""} ${payload.description ?? ""}`.toUpperCase();
  const match = content.match(/PAY[A-Z0-9]{6,12}/);
  return match?.[0] ?? "";
}

function normalizePayload(payload: BankingWebhookPayload) {
  return {
    paymentCode: extractPaymentCode(payload),
    provider: payload.gateway || "BANKING_WEBHOOK",
    providerTransactionId: String(payload.referenceCode || payload.transactionId || payload.id || ""),
    receivedAmount: toAmount(payload.transferAmount ?? payload.amount),
    transferType: payload.transferType,
  };
}

export async function POST(request: Request) {
  const secret = process.env.BANK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "BANK_WEBHOOK_SECRET is not configured" }, { status: 500 });
  }

  if (request.headers.get("x-webhook-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized webhook" }, { status: 401 });
  }

  const payload = (await request.json()) as BankingWebhookPayload;
  const { paymentCode, provider, providerTransactionId, receivedAmount, transferType } = normalizePayload(payload);

  if (!paymentCode || receivedAmount <= 0) {
    return NextResponse.json({ error: "Webhook thiếu mã đơn hoặc số tiền." }, { status: 400 });
  }

  if (transferType && transferType.toLowerCase() !== "in") {
    return NextResponse.json({ ok: true, ignored: "Không phải giao dịch tiền vào." });
  }

  const supabase = createServerSupabaseClient();

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .select("id, order_id, amount, status, payment_code")
    .eq("payment_code", paymentCode)
    .maybeSingle();

  if (paymentError || !payment) {
    if (paymentError) console.error("Payment lookup failed", paymentError);
    return NextResponse.json({ error: "Không tìm thấy paymentCode." }, { status: 404 });
  }

  const expectedAmount = Number(payment.amount);
  if (payment.status === "PAID") {
    return NextResponse.json({ ok: true, message: "Payment already paid" });
  }

  if (providerTransactionId) {
    const { data: existingTransaction } = await supabase
      .from("payments")
      .select("id, payment_code")
      .eq("provider_transaction_id", providerTransactionId)
      .eq("status", "PAID")
      .maybeSingle();

    if (existingTransaction) {
      return NextResponse.json({ error: "Duplicate provider transaction." }, { status: 409 });
    }
  }

  if (receivedAmount !== expectedAmount) {
    await supabase
      .from("payments")
      .update({
        raw_webhook_payload: {
          ...payload,
          mismatch: {
            expectedAmount,
            receivedAmount,
          },
        },
      })
      .eq("id", payment.id);

    await supabase.from("order_logs").insert({
      action: "PAYMENT_FAILED",
      metadata: {
        expectedAmount,
        paymentCode,
        provider,
        providerTransactionId,
        receivedAmount,
        reason: "AMOUNT_MISMATCH",
      },
      order_id: payment.order_id,
    });

    return NextResponse.json({ error: "Sai số tiền chuyển khoản.", expectedAmount, receivedAmount }, { status: 400 });
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, amount, affiliate_id, created_by_id, template_id")
    .eq("id", payment.order_id)
    .single();

  if (orderError || !order) {
    if (orderError) console.error("Order lookup failed", orderError);
    return NextResponse.json({ error: "Không tìm thấy đơn hàng." }, { status: 404 });
  }

  const { data: creator } = await supabase
    .from("users")
    .select("id, manager_id")
    .eq("id", order.created_by_id)
    .maybeSingle();

  const { data: commissionRules } = await supabase
    .from("commission_rules")
    .select("recipient_type, percentage")
    .eq("is_active", true);

  const orderAmount = Number(order.amount);

  const { error: updatePaymentError } = await supabase
    .from("payments")
    .update({
      paid_at: new Date().toISOString(),
      provider,
      provider_transaction_id: providerTransactionId || null,
      raw_webhook_payload: payload,
      status: "PAID",
    })
    .eq("id", payment.id)
    .eq("status", "PENDING");

  if (updatePaymentError) {
    console.error("Payment update failed", updatePaymentError);
    return NextResponse.json({ error: "Không cập nhật được payment." }, { status: 500 });
  }

  const { error: updateOrderError } = await supabase
    .from("orders")
    .update({ status: "ACTIVE" })
    .eq("id", payment.order_id);

  if (updateOrderError) {
    console.error("Order activation failed", updateOrderError);
    return NextResponse.json({ error: "Không mở khóa được đơn." }, { status: 500 });
  }

  const commissions: CommissionInsert[] = [];

  const employeePercentage = await getUserCommissionPercentage({
    fallbackRecipientType: "EMPLOYEE",
    fallbackRules: commissionRules,
    supabase,
    templateId: order.template_id,
    userId: creator?.id,
  });

  if (employeePercentage > 0 && creator?.id) {
    commissions.push({
      amount: (orderAmount * employeePercentage) / 100,
      order_id: order.id,
      percentage: employeePercentage,
      recipient_type: "EMPLOYEE",
      user_id: creator.id,
    });
  }

  const staffPercentage = await getUserCommissionPercentage({
    fallbackRecipientType: "STAFF",
    fallbackRules: commissionRules,
    supabase,
    templateId: order.template_id,
    userId: creator?.manager_id,
  });

  if (staffPercentage > 0 && creator?.manager_id) {
    commissions.push({
      amount: (orderAmount * staffPercentage) / 100,
      order_id: order.id,
      percentage: staffPercentage,
      recipient_type: "STAFF",
      user_id: creator.manager_id,
    });
  }

  const affiliatePercentage = getGlobalPercentage(commissionRules, "AFFILIATE");

  if (affiliatePercentage > 0 && order.affiliate_id) {
    commissions.push({
      affiliate_id: order.affiliate_id,
      amount: (orderAmount * affiliatePercentage) / 100,
      order_id: order.id,
      percentage: affiliatePercentage,
      recipient_type: "AFFILIATE",
    });
  }

  if (commissions.length) {
    await supabase.from("commissions").insert(commissions);
  }

  await supabase.from("order_logs").insert([
    {
      action: "PAYMENT_CONFIRMED",
      metadata: { paymentCode, provider, providerTransactionId, receivedAmount },
      order_id: payment.order_id,
    },
    {
      action: "ORDER_ACTIVATED",
      metadata: { reason: "Payment confirmed by banking webhook" },
      order_id: payment.order_id,
    },
  ]);

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    status: "ACTIVE",
  });
}
