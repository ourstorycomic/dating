import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const baseRoles = new Set(["ADMIN", "STAFF", "EMPLOYEE"]);

type RolePayload = {
  baseRole?: string;
  commissionPercentage?: number | string;
  description?: string;
  id?: string;
  isActive?: boolean;
  name?: string;
  permissions?: string[];
  productRules?: Array<{
    isActive?: boolean;
    percentage?: number | string;
    templateId?: string;
  }>;
  crossRoleCommissions?: Array<{
    childRoleId: string;
    percentage: number | string;
    isActive?: boolean;
  }>;
};

function normalizePayload(body: RolePayload) {
  return {
    base_role: String(body.baseRole || "EMPLOYEE").toUpperCase(),
    commission_percentage: Number(body.commissionPercentage ?? 0),
    description: String(body.description || "").trim() || null,
    id: body.id ? String(body.id) : "",
    is_active: body.isActive !== false,
    name: String(body.name || "").trim(),
    permissions: Array.isArray(body.permissions)
      ? body.permissions.map((item) => String(item)).filter(Boolean)
      : [],
    productRules: Array.isArray(body.productRules) ? body.productRules : [],
    crossRoleCommissions: Array.isArray(body.crossRoleCommissions) ? body.crossRoleCommissions : [],
  };
}

function validateRole(role: ReturnType<typeof normalizePayload>) {
  if (!role.name) return "Nhập tên vai trò.";
  if (!baseRoles.has(role.base_role)) return "Base role không hợp lệ.";
  if (!Number.isFinite(role.commission_percentage) || role.commission_percentage < 0 || role.commission_percentage > 100) {
    return "Hoa hồng phải từ 0 đến 100%.";
  }
  return "";
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Chỉ admin mới được xem vai trò." }, { status: 403 });
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("custom_roles")
    .select("id, name, description, base_role, permissions, commission_percentage, is_active, created_at, role_commission_rules(template_id, percentage, is_active), cross_role_commissions:CrossRoleCommission!CrossRoleCommission_parentRoleId_fkey(child_role_id:childRoleId, percentage, is_active)")
    .order("created_at", { ascending: false });

  // If the explicit foreign key name fails, we will try the other one in a fallback, or just use Prisma later if needed.
  if (error) {
    console.error("Load roles failed", error);
    // Fallback try without cross_role_commissions if it fails due to relationship name
    const fallback = await supabase
      .from("custom_roles")
      .select("id, name, description, base_role, permissions, commission_percentage, is_active, created_at, role_commission_rules(template_id, percentage, is_active)")
      .order("created_at", { ascending: false });
    
    if (fallback.error) {
      return NextResponse.json({ error: "Không tải được vai trò." }, { status: 500 });
    }
    return NextResponse.json({ roles: fallback.data ?? [] });
  }

  return NextResponse.json({ roles: data ?? [] });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Chỉ admin mới được tạo vai trò." }, { status: 403 });
  }

  const role = normalizePayload(await request.json());
  const errorMessage = validateRole(role);
  if (errorMessage) return NextResponse.json({ error: errorMessage }, { status: 400 });
  const { productRules } = role;

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("custom_roles")
    .insert({
      base_role: role.base_role,
      commission_percentage: role.commission_percentage,
      description: role.description,
      is_active: role.is_active,
      name: role.name,
      permissions: role.permissions,
    })
    .select("id, name, description, base_role, permissions, commission_percentage, is_active, created_at")
    .single();

  if (error) {
    console.error("Create role failed", error);
    return NextResponse.json({ error: "Không tạo được vai trò." }, { status: 500 });
  }

  try {
    await saveProductRules(supabase, data.id, productRules);
    await saveCrossRoleCommissions(data.id, role.crossRoleCommissions);
  } catch (err: any) {
    console.error("Save associated rules error:", err);
    return NextResponse.json({ error: err.message || "Lỗi lưu cấu hình phụ của vai trò." }, { status: 500 });
  }

  const { data: fullRole } = await supabase
    .from("custom_roles")
    .select("id, name, description, base_role, permissions, commission_percentage, is_active, created_at, role_commission_rules(template_id, percentage, is_active), cross_role_commissions:CrossRoleCommission!CrossRoleCommission_parentRoleId_fkey(child_role_id:childRoleId, percentage, is_active)")
    .eq("id", data.id)
    .single();

  const finalRole = fullRole ?? data;
  if (!fullRole?.cross_role_commissions) {
     const { prisma } = await import("@/lib/prisma");
     const crossData = await prisma.crossRoleCommission.findMany({ where: { parentRoleId: data.id } });
     (finalRole as any).cross_role_commissions = crossData.map(c => ({ child_role_id: c.childRoleId, percentage: Number(c.percentage), is_active: c.isActive }));
  }

  await supabase.from("order_logs").insert({
    action: "USER_UPDATED",
    actor_id: session.userId,
    metadata: { roleId: data.id, type: "CUSTOM_ROLE_CREATED" },
  });

  return NextResponse.json({ ok: true, role: finalRole });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Chỉ admin mới được sửa vai trò." }, { status: 403 });
  }

  const role = normalizePayload(await request.json());
  if (!role.id) return NextResponse.json({ error: "Thiếu role id." }, { status: 400 });
  const { productRules } = role;

  const errorMessage = validateRole(role);
  if (errorMessage) return NextResponse.json({ error: errorMessage }, { status: 400 });

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("custom_roles")
    .update({
      base_role: role.base_role,
      commission_percentage: role.commission_percentage,
      description: role.description,
      is_active: role.is_active,
      name: role.name,
      permissions: role.permissions,
    })
    .eq("id", role.id)
    .select("id, name, description, base_role, permissions, commission_percentage, is_active, created_at")
    .single();

  if (error) {
    console.error("Update role failed", error);
    return NextResponse.json({ error: "Không lưu được vai trò." }, { status: 500 });
  }

  try {
    await saveProductRules(supabase, data.id, productRules);
    await saveCrossRoleCommissions(data.id, role.crossRoleCommissions);
  } catch (err: any) {
    console.error("Save associated rules error:", err);
    return NextResponse.json({ error: err.message || "Lỗi lưu cấu hình phụ của vai trò." }, { status: 500 });
  }

  const { data: fullRole } = await supabase
    .from("custom_roles")
    .select("id, name, description, base_role, permissions, commission_percentage, is_active, created_at, role_commission_rules(template_id, percentage, is_active), cross_role_commissions:CrossRoleCommission!CrossRoleCommission_parentRoleId_fkey(child_role_id:childRoleId, percentage, is_active)")
    .eq("id", role.id)
    .single();

  const finalRole = fullRole ?? data;
  if (!fullRole?.cross_role_commissions) {
     const { prisma } = await import("@/lib/prisma");
     const crossData = await prisma.crossRoleCommission.findMany({ where: { parentRoleId: data.id } });
     (finalRole as any).cross_role_commissions = crossData.map(c => ({ child_role_id: c.childRoleId, percentage: Number(c.percentage), is_active: c.isActive }));
  }

  await supabase.from("order_logs").insert({
    action: "USER_UPDATED",
    actor_id: session.userId,
    metadata: { roleId: data.id, type: "CUSTOM_ROLE_UPDATED" },
  });

  return NextResponse.json({ ok: true, role: finalRole });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Chỉ admin mới được xóa vai trò." }, { status: 403 });
  }

  const roleId = new URL(request.url).searchParams.get("id");
  if (!roleId) {
    return NextResponse.json({ error: "Thiếu role id." }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  await supabase
    .from("users")
    .update({ custom_role_id: null })
    .eq("custom_role_id", roleId);

  const { error } = await supabase
    .from("custom_roles")
    .delete()
    .eq("id", roleId);

  if (error) {
    console.error("Delete role failed", error);
    return NextResponse.json({ error: "Không xóa được vai trò." }, { status: 500 });
  }

  await supabase.from("order_logs").insert({
    action: "USER_UPDATED",
    actor_id: session.userId,
    metadata: { roleId, type: "CUSTOM_ROLE_DELETED" },
  });

  return NextResponse.json({ ok: true });
}

async function saveProductRules(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  roleId: string,
  productRules: ReturnType<typeof normalizePayload>["productRules"],
) {
  const rows = productRules
    .map((rule) => ({
      is_active: rule.isActive !== false,
      percentage: Number(rule.percentage ?? 0),
      role_id: roleId,
      template_id: rule.templateId ? String(rule.templateId) : "",
    }))
    .filter((rule) => rule.template_id && Number.isFinite(rule.percentage) && rule.percentage >= 0 && rule.percentage <= 100);

  if (!rows.length) return;

  await supabase
    .from("role_commission_rules")
    .upsert(rows, { onConflict: "role_id,template_id" });
}

async function saveCrossRoleCommissions(parentRoleId: string, crossRoleCommissions?: any[]) {
  if (!crossRoleCommissions) return;
  const { prisma } = await import("@/lib/prisma");

  const validRules = crossRoleCommissions
    .filter((rule) => rule.childRoleId && Number.isFinite(Number(rule.percentage)) && Number(rule.percentage) >= 0 && Number(rule.percentage) <= 100)
    .map((rule) => ({
      parentRoleId,
      childRoleId: String(rule.childRoleId),
      percentage: Number(rule.percentage),
      isActive: rule.isActive !== false,
    }));

  try {
    await prisma.$transaction(async (tx) => {
      await tx.crossRoleCommission.deleteMany({ where: { parentRoleId } });
      if (validRules.length > 0) {
        await tx.crossRoleCommission.createMany({ data: validRules });
      }
    });
  } catch (error) {
    console.error("saveCrossRoleCommissions Error:", error);
    throw error;
  }
}
