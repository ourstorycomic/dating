import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  
  if (session?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = createServerSupabaseClient();
    
    const { error } = await supabase.from("templates").update(body).eq("id", id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
