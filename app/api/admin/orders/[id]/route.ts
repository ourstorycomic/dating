import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params; // this is the public_id or the internal id, let's assume it's public_id
    const supabase = createServerSupabaseClient();

    // 1. Fetch order custom_data
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, custom_data")
      .eq("public_id", id)
      .maybeSingle();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2. Delete associated media files from storage
    if (order.custom_data) {
      const customDataStr = JSON.stringify(order.custom_data);
      const urlRegex = /\/storage\/v1\/object\/public\/media\/(uploads\/[^"'\s]+)/g;
      let match;
      const filePathsToDel: string[] = [];
      
      while ((match = urlRegex.exec(customDataStr)) !== null) {
        if (match[1]) filePathsToDel.push(match[1]);
      }

      if (filePathsToDel.length > 0) {
        const { error: delError } = await supabase.storage.from("media").remove(filePathsToDel);
        if (delError) {
          console.error(`Failed to delete files for order ${id}:`, delError);
        }
      }
    }

    // 3. Delete order from database (will cascade to payments, logs, etc.)
    const { error: deleteError } = await supabase
      .from("orders")
      .delete()
      .eq("id", order.id);

    if (deleteError) {
      console.error(`Failed to delete order ${id}:`, deleteError);
      return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
