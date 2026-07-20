import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function parseResponseText(raw: string | null) {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return { message: raw };
  }
}

function normalizeAnswer(answer: string) {
  if (answer === "YES" || answer === "NO" || answer === "MAYBE") return answer;
  return "CUSTOM";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const supabase = createServerSupabaseClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("public_id, status, recipient_response, response_text, responded_at, gift_opened_at")
    .eq("public_id", orderId)
    .maybeSingle();

  if (error || !order) {
    return NextResponse.json({ error: "Không tìm thấy đơn." }, { status: 404 });
  }

  const response = parseResponseText(order.response_text);

  return NextResponse.json({
    orderId: order.public_id,
    status: order.status,
    recipientResponse: order.recipient_response,
    responseText: order.response_text,
    respondedAt: order.responded_at,
    giftOpenedAt: order.gift_opened_at,
    response,
  });
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
    .select("id, response_text, status")
    .eq("public_id", orderId)
    .maybeSingle();

  if (loadError || !order) {
    return NextResponse.json({ error: "Không tìm thấy đơn." }, { status: 404 });
  }

  // Security check: Only allow responses if the order is ACTIVE or already RESPONDED
  if (order.status !== "ACTIVE" && order.status !== "RESPONDED") {
    return NextResponse.json({ error: "Đơn hàng chưa được thanh toán nên không thể gửi phản hồi." }, { status: 403 });
  }

  let newResponseText;
  if (message.startsWith("RSVP: {")) {
    let existingResponses: any[] = [];
    if (order.response_text) {
      try {
        const parsed = JSON.parse(order.response_text);
        if (Array.isArray(parsed)) existingResponses = parsed;
        else existingResponses = [parsed];
      } catch {
        existingResponses = [{ message: order.response_text }];
      }
    }
    existingResponses.unshift(responsePayload);
    newResponseText = JSON.stringify(existingResponses);
  } else {
    newResponseText = JSON.stringify(responsePayload);
  }

  const { error } = await supabase
    .from("orders")
    .update({
      status: "RESPONDED",
      gift_opened_at: new Date().toISOString(),
      recipient_response: normalizeAnswer(answer),
      response_text: newResponseText,
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
