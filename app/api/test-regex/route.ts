import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data: orders } = await supabase.from("orders").select("public_id, custom_data").order("created_at", { ascending: false }).limit(5);
  
  const results = [];
  
  for (const order of orders || []) {
    const customDataStr = JSON.stringify(order.custom_data);
    const urlRegex = /\/storage\/v1\/object\/public\/media\/(uploads\/[^"'\s]+)/g;
    let match;
    const filePathsToDel: string[] = [];
    
    while ((match = urlRegex.exec(customDataStr)) !== null) {
      if (match[1]) filePathsToDel.push(match[1]);
    }
    
    results.push({
      public_id: order.public_id,
      files: filePathsToDel,
      hasCustomData: !!order.custom_data
    });
  }
  
  return NextResponse.json({ results });
}
