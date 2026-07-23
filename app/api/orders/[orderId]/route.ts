import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Bạn cần đăng nhập để thực hiện thao tác này." }, { status: 401 });
  }

  const { orderId } = await params;
  if (!orderId) {
    return NextResponse.json({ error: "Thiếu mã đơn." }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, status, created_by_id, custom_data")
    .eq("public_id", orderId)
    .maybeSingle();

  if (orderError || !order) {
    return NextResponse.json({ error: "Không tìm thấy đơn." }, { status: 404 });
  }

  // Check permissions: only ADMIN or the creator of the order can delete it
  if (session.role === "EMPLOYEE" && order.created_by_id !== session.userId) {
    return NextResponse.json({ error: "Bạn không có quyền xóa đơn này." }, { status: 403 });
  }

  try {
    // 1. Delete associated files from Supabase Storage
    // Find any custom_data values that are string URLs containing the supabase storage path
    const customData = order.custom_data as Record<string, any>;
    const filePathsToDelete: string[] = [];
    
    // We can recursively search for string values in customData
    const findMediaUrls = (obj: any) => {
      if (!obj) return;
      if (typeof obj === "string") {
        if (obj.includes("supabase.co/storage/v1/object/public/media/uploads/")) {
          const parts = obj.split("/media/uploads/");
          if (parts.length > 1) {
            filePathsToDelete.push(`uploads/${parts[1].split("?")[0]}`);
          }
        }
      } else if (typeof obj === "object") {
        for (const key in obj) {
          findMediaUrls(obj[key]);
        }
      }
    };
    findMediaUrls(customData);

    if (filePathsToDelete.length > 0) {
      // Supabase remove takes an array of paths
      const { error: storageError } = await supabase.storage.from("media").remove(filePathsToDelete);
      if (storageError) {
        console.error("Failed to delete some storage files:", storageError);
        // We still proceed to delete the order even if some files fail to delete
      }
    }

    // 2. Delete the order
    // Since orders might have payments, order_logs, etc., ensure they cascade or delete them first.
    // Supabase foreign keys usually have ON DELETE CASCADE.
    // Let's explicitly delete payments and order_logs just in case, or rely on cascade.
    // Actually, ON DELETE CASCADE is set up in our schema for `payments.order_id` and `order_logs.order_id`.
    
    const { error: deleteError } = await supabase.from("orders").delete().eq("id", order.id);

    if (deleteError) {
      console.error("Failed to delete order:", deleteError);
      return NextResponse.json({ error: "Lỗi khi xóa đơn hàng khỏi database." }, { status: 500 });
    }

    // Log the deletion (Optional, since we just deleted it. We could log it globally if needed).
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Error deleting order:", err);
    return NextResponse.json({ error: "Lỗi hệ thống khi xóa đơn." }, { status: 500 });
  }
}
