import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

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

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { searchParams } = new URL(_request.url);
  const isFree = searchParams.get("free") === "true";

  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Chỉ Admin được xác nhận thanh toán thủ công." }, { status: 403 });
  }

  const { orderId } = await params;
  const supabase = createServerSupabaseClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, public_id, amount, affiliate_id, created_by_id, status, template_id, payments(id, amount, status, payment_code)")
    .eq("public_id", orderId)
    .maybeSingle();

  if (orderError || !order) {
    return NextResponse.json({ error: "Không tìm thấy đơn." }, { status: 404 });
  }

  const payment = Array.isArray(order.payments) ? order.payments[0] : order.payments;
  if (!payment) {
    return NextResponse.json({ error: "Đơn chưa có payment." }, { status: 404 });
  }

  if (order.status === "ACTIVE" || payment.status === "PAID") {
    return NextResponse.json({ ok: true, status: "ACTIVE" });
  }

  const paidAt = new Date().toISOString();
  const { error: paymentError } = await supabase
    .from("payments")
    .update({
      paid_at: paidAt,
      provider: isFree ? "MANUAL_ADMIN_FREE" : "MANUAL_ADMIN_CONFIRM",
      provider_transaction_id: `manual-${order.public_id}-${Date.now()}`,
      raw_webhook_payload: {
        confirmedBy: session.userId,
        paymentCode: payment.payment_code,
        source: "admin_manual_confirm",
      },
      status: "PAID",
    })
    .eq("id", payment.id)
    .eq("status", "PENDING");

  if (paymentError) {
    console.error("Manual payment update failed", paymentError);
    return NextResponse.json({ error: "Không cập nhật được payment." }, { status: 500 });
  }

  const { error: orderUpdateError } = await supabase
    .from("orders")
    .update({ status: "ACTIVE" })
    .eq("id", order.id);

  if (orderUpdateError) {
    console.error("Manual order activation failed", orderUpdateError);
    return NextResponse.json({ error: "Không mở khóa được đơn." }, { status: 500 });
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
  const commissions = [];
  if (!isFree) {
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

    // --- MULTI-TIER CROSS-ROLE COMMISSION LOGIC ---
    if (creator?.id) {
      const creatorUser = await prisma.user.findUnique({
        where: { id: creator.id },
        select: { customRoleId: true, managerId: true },
      });

      const creatorRoleId = creatorUser?.customRoleId;

      if (creatorRoleId && creatorUser?.managerId) {
        let currentManagerId: string | null = creatorUser.managerId;
        // Guard against infinite loops with max depth
        let depth = 0;
        const MAX_DEPTH = 20;

        while (currentManagerId && depth < MAX_DEPTH) {
          const managerUser = (await prisma.user.findUnique({
            where: { id: currentManagerId },
            select: { id: true, customRoleId: true, managerId: true },
          })) as { id: string; customRoleId: string | null; managerId: string | null } | null;

          if (!managerUser) break;

          if (managerUser.customRoleId) {
            const rule = await prisma.crossRoleCommission.findUnique({
              where: {
                parentRoleId_childRoleId: {
                  parentRoleId: managerUser.customRoleId,
                  childRoleId: creatorRoleId,
                },
              },
              include: { parentRole: true }
            });

            if (rule && rule.isActive) {
              const customPercentage = Number(rule.percentage);
              const rulePercentage = customPercentage > 0 ? customPercentage : Number(rule.parentRole.commissionPercentage);
              
              if (rulePercentage > 0) {
                const alreadyPaid = commissions.some(
                  (c) => c.user_id === managerUser.id && c.recipient_type === "STAFF"
                );
                
                if (!alreadyPaid) {
                  commissions.push({
                    amount: (orderAmount * rulePercentage) / 100,
                    order_id: order.id,
                    percentage: rulePercentage,
                    recipient_type: "STAFF", // using STAFF for manager commissions
                    user_id: managerUser.id,
                  });
                } else {
                  const existingIdx = commissions.findIndex(
                    (c) => c.user_id === managerUser.id && c.recipient_type === "STAFF"
                  );
                  if (existingIdx !== -1) {
                    commissions[existingIdx].percentage = rulePercentage;
                    commissions[existingIdx].amount = (orderAmount * rulePercentage) / 100;
                  }
                }
              }
            }
          }

          currentManagerId = managerUser.managerId;
          depth++;
        }
      }
    }
    // --- END MULTI-TIER ---

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
  }

  await supabase.from("order_logs").insert([
    {
      action: "PAYMENT_CONFIRMED",
      actor_id: session.userId,
      metadata: { paymentCode: payment.payment_code, provider: "MANUAL_ADMIN_CONFIRM" },
      order_id: order.id,
    },
    {
      action: "ORDER_ACTIVATED",
      actor_id: session.userId,
      metadata: { reason: isFree ? "Admin unlocked order without payment" : "Admin confirmed bank transfer manually" },
      order_id: order.id,
    },
  ]);

  return NextResponse.json({ ok: true, paidAt, status: "ACTIVE" });
}
