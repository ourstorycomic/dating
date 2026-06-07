import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function normalizeAnswer(answer: string) {
  if (answer === "YES" || answer === "NO" || answer === "MAYBE") return answer;
  return "CUSTOM";
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const body = await request.json();
  const answer = String(body.answer ?? "CUSTOM");
  const message = String(body.message ?? "");
  const audioDataUrl = typeof body.audioDataUrl === "string" ? body.audioDataUrl : null;

  const responsePayload = {
    answer,
    message,
    audioDataUrl,
    audioName: body.audioName ?? "phan-hoi-ghi-am.webm",
    submittedAt: new Date().toISOString(),
  };

  const supabase = createServerSupabaseClient();
  const { data: order, error: loadError } = await supabase
    .from("orders")
    .select("id")
    .eq("public_id", orderId)
    .maybeSingle();

  if (loadError || !order) {
    return NextResponse.json({ error: "Không tìm thấy đơn." }, { status: 404 });
  }

  const { error } = await supabase
    .from("orders")
    .update({
      status: "RESPONDED",
      gift_opened_at: new Date().toISOString(),
      recipient_response: normalizeAnswer(answer),
      response_text: JSON.stringify(responsePayload),
      responded_at: new Date().toISOString(),
    })
    .eq("id", order.id);

  if (error) {
    console.error("Failed to save recipient response", error);
    return NextResponse.json({ error: "Không lưu được phản hồi." }, { status: 500 });
  }

  await supabase.from("order_logs").insert({
    order_id: order.id,
    action: "RECIPIENT_RESPONDED",
    metadata: {
      answer,
      hasAudio: Boolean(audioDataUrl),
      source: "gift_link",
    },
  });

  return NextResponse.json({ ok: true });
}
