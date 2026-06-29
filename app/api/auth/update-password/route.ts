import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const session = await getSession();

  if (!session || !session.authUserId) {
    return NextResponse.json({ error: "Chưa đăng nhập hoặc phiên hết hạn." }, { status: 401 });
  }

  try {
    const { password } = await req.json();

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Mật khẩu phải dài ít nhất 6 ký tự." }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    
    // Use admin API to update password since we are using service role key
    const { error } = await supabase.auth.admin.updateUserById(
      session.authUserId,
      { password }
    );

    if (error) {
      console.error("Lỗi đổi mật khẩu:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Lỗi API đổi mật khẩu:", error);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ." }, { status: 500 });
  }
}
