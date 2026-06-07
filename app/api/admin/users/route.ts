import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Chỉ admin mới được thêm nhân sự." }, { status: 403 });
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Thiếu cấu hình Supabase." }, { status: 500 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const role = String(body.role || "").toUpperCase();
  const managerId = body.managerId ? String(body.managerId) : null;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Nhập đủ tên, email và mật khẩu." }, { status: 400 });
  }

  if (!["ADMIN", "STAFF", "EMPLOYEE"].includes(role)) {
    return NextResponse.json({ error: "Role không hợp lệ." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Mật khẩu tối thiểu 6 ký tự." }, { status: 400 });
  }

  const adminAuthClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: authData, error: authError } = await adminAuthClient.auth.admin.createUser({
    email,
    email_confirm: true,
    password,
    user_metadata: { name, role },
  });

  if (authError || !authData.user) {
    console.error("Create auth user failed", authError);
    return NextResponse.json({ error: authError?.message ?? "Không tạo được tài khoản auth." }, { status: 500 });
  }

  const supabase = createServerSupabaseClient();
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .insert({
      auth_user_id: authData.user.id,
      email,
      is_active: true,
      manager_id: role === "EMPLOYEE" ? managerId : null,
      name,
      role,
    })
    .select("id, name, email, role, is_active, manager_id, created_at")
    .single();

  if (profileError || !profile) {
    await adminAuthClient.auth.admin.deleteUser(authData.user.id);
    console.error("Create profile failed", profileError);
    return NextResponse.json({ error: "Không tạo được hồ sơ nhân sự." }, { status: 500 });
  }

  await supabase.from("order_logs").insert({
    action: "USER_CREATED",
    actor_id: session.userId,
    metadata: { email, name, role },
  });

  return NextResponse.json({ ok: true, user: profile });
}

export async function PATCH(request: Request) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Chỉ admin mới được sửa nhân sự." }, { status: 403 });
  }

  const body = await request.json();
  const userId = String(body.userId || "");
  const role = String(body.role || "").toUpperCase();
  const customRoleId = body.customRoleId ? String(body.customRoleId) : null;
  const managerId = body.managerId ? String(body.managerId) : null;
  const isActive = typeof body.isActive === "boolean" ? body.isActive : undefined;

  if (!userId) {
    return NextResponse.json({ error: "Thiếu nhân sự cần sửa." }, { status: 400 });
  }

  if (!["ADMIN", "STAFF", "EMPLOYEE"].includes(role)) {
    return NextResponse.json({ error: "Role không hợp lệ." }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const updateData: Record<string, unknown> = {
    custom_role_id: customRoleId,
    manager_id: role === "EMPLOYEE" ? managerId : null,
    role,
  };

  if (typeof isActive === "boolean") updateData.is_active = isActive;

  const { data: user, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", userId)
    .select("id, name, email, role, custom_role_id, is_active, manager_id, created_at, custom_roles(id, name, base_role, commission_percentage)")
    .single();

  if (error || !user) {
    console.error("Update user failed", error);
    return NextResponse.json({ error: "Không cập nhật được nhân sự." }, { status: 500 });
  }

  await supabase.from("order_logs").insert({
    action: "USER_UPDATED",
    actor_id: session.userId,
    metadata: { customRoleId, role, targetUserId: userId },
  });

  return NextResponse.json({ ok: true, user });
}
