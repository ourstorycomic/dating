import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Find all expired orders that haven't been cleaned up yet (custom_data is not null/empty)
    const { data: expiredOrders, error } = await supabase
      .from("orders")
      .select("id, public_id, custom_data")
      .lt("expires_at", new Date().toISOString())
      .not("custom_data", "is", null);

    if (error) {
      console.error("Error fetching expired orders:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!expiredOrders || expiredOrders.length === 0) {
      return NextResponse.json({ message: "No expired orders to clean up." });
    }

    const deletedFiles: string[] = [];
    const cleanedOrders: string[] = [];

    for (const order of expiredOrders) {
      // Find all URLs in custom_data
      const customDataStr = JSON.stringify(order.custom_data || {});
      // Extract paths from URLs like .../storage/v1/object/public/media/uploads/123.jpg
      const urlRegex = /\/storage\/v1\/object\/public\/media\/(uploads\/[^"'\s]+)/g;
      let match;
      const filePathsToDel: string[] = [];
      
      while ((match = urlRegex.exec(customDataStr)) !== null) {
        if (match[1]) filePathsToDel.push(match[1]);
      }

      if (filePathsToDel.length > 0) {
        // Delete files from storage
        const { error: delError } = await supabase.storage.from("media").remove(filePathsToDel);
        if (delError) {
          console.error(`Failed to delete files for order ${order.public_id}:`, delError);
        } else {
          deletedFiles.push(...filePathsToDel);
        }
      }

      // Clear custom_data
      const { error: updateError } = await supabase
        .from("orders")
        .update({ custom_data: null })
        .eq("id", order.id);

      if (!updateError) {
        cleanedOrders.push(order.public_id);
      }
    }

    return NextResponse.json({
      message: `Cleaned up ${cleanedOrders.length} expired orders.`,
      deletedFilesCount: deletedFiles.length,
      orders: cleanedOrders
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
