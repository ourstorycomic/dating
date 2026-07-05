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

    // --- STEP 1: CLEAN UP EXPIRED ORDERS ---
    const deletedExpiredFiles: string[] = [];
    const cleanedOrders: string[] = [];
    const updateErrors: any[] = [];

    const ordersToProcess = expiredOrders?.filter(o => o.custom_data && Object.keys(o.custom_data).length > 0) || [];
    
    for (const order of ordersToProcess) {
      const customDataStr = JSON.stringify(order.custom_data || {});
      const urlRegex = /\/storage\/v1\/object\/public\/media\/(uploads\/[^"'\s]+)/g;
      let match;
      const filePathsToDel: string[] = [];
      
      while ((match = urlRegex.exec(customDataStr)) !== null) {
        if (match[1]) filePathsToDel.push(match[1]);
      }

      if (filePathsToDel.length > 0) {
        const { error: delError } = await supabase.storage.from("media").remove(filePathsToDel);
        if (delError) {
          console.error(`Failed to delete files for order ${order.public_id}:`, delError);
        } else {
          deletedExpiredFiles.push(...filePathsToDel);
        }
      }

      const { error: updateError } = await supabase
        .from("orders")
        .update({ custom_data: {} })
        .eq("id", order.id);

      if (updateError) {
        updateErrors.push(updateError);
      } else {
        cleanedOrders.push(order.public_id);
      }
    }

    // --- STEP 2: CLEAN UP ORPHANED FILES (abandoned uploads) ---
    // 1. Get all files in media/uploads
    const { data: files } = await supabase.storage.from("media").list("uploads", {
      limit: 1000,
      sortBy: { column: "created_at", order: "asc" }
    });

    const deletedOrphanFiles: string[] = [];
    
    if (files && files.length > 0) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      // Filter files older than 1 hour (ignoring empty folder placeholder '.emptyFolderPlaceholder')
      const oldFiles = files.filter(f => f.created_at && f.created_at < oneHourAgo && f.name !== ".emptyFolderPlaceholder");

      if (oldFiles.length > 0) {
        // 2. Get all custom_data strings across the DB
        const { data: allOrders } = await supabase.from("orders").select("custom_data");
        const { data: allTemplates } = await supabase.from("templates").select("data_schema, sample_data");
        
        const allOrdersStr = JSON.stringify(allOrders || []);
        const allTemplatesStr = JSON.stringify(allTemplates || []);
        const combinedDbStr = allOrdersStr + allTemplatesStr;

        const orphanedFilePaths = [];
        
        for (const file of oldFiles) {
          const filePath = `uploads/${file.name}`;
          // If the file path is not mentioned ANYWHERE in the DB strings, it's orphaned
          if (!combinedDbStr.includes(file.name)) {
            orphanedFilePaths.push(filePath);
          }
        }

        if (orphanedFilePaths.length > 0) {
          const { error: orphanDelError } = await supabase.storage.from("media").remove(orphanedFilePaths);
          if (orphanDelError) {
            console.error("Failed to delete orphaned files:", orphanDelError);
          } else {
            deletedOrphanFiles.push(...orphanedFilePaths);
          }
        }
      }
    }

    return NextResponse.json({
      message: `Cleaned up ${cleanedOrders.length} expired orders and ${deletedOrphanFiles.length} orphaned files.`,
      deletedExpiredFilesCount: deletedExpiredFiles.length,
      deletedOrphanFilesCount: deletedOrphanFiles.length,
      orders: cleanedOrders,
      errors: updateErrors
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
