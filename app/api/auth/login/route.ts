import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(req: Request) {
  if (!supabaseUrl || !anonKey) {
    return NextResponse.json(
      { error: "Thiếu cấu hình Supabase Auth" },
      { status: 500 },
    );
  }

  const formData = await req.formData();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const nextPath = String(formData.get("next") || "/dashboard");

  if (!email || !password) {
    return NextResponse.redirect(
      new URL(`/login?error=missing&next=${encodeURIComponent(nextPath)}`, req.url),
      303,
    );
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: authData, error: authError } =
    await authClient.auth.signInWithPassword({ email, password });

  if (authError || !authData.user) {
    return NextResponse.redirect(
      new URL(`/login?error=invalid&next=${encodeURIComponent(nextPath)}`, req.url),
      303,
    );
  }

  const supabase = createServerSupabaseClient();
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, auth_user_id, name, email, role, avatar_url, is_active")
    .or(`auth_user_id.eq.${authData.user.id},email.eq.${email}`)
    .limit(1)
    .maybeSingle();

  if (profileError || !profile || !profile.is_active) {
    return NextResponse.redirect(
      new URL(`/login?error=profile&next=${encodeURIComponent(nextPath)}`, req.url),
      303,
    );
  }

  if (!profile.auth_user_id) {
    await supabase
      .from("users")
      .update({ auth_user_id: authData.user.id })
      .eq("id", profile.id);
  }

  const response = NextResponse.redirect(new URL(nextPath, req.url), 303);
  response.cookies.set(
    "yeuweb_session",
    JSON.stringify({
      authUserId: authData.user.id,
      userId: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      avatarUrl: profile.avatar_url,
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    },
  );

  return response;
}
