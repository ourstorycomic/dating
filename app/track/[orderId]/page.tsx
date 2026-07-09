import { notFound } from "next/navigation";
import { formatDistanceToNow, isPast } from "date-fns";
import { vi } from "date-fns/locale";
import { GlassCard } from "@/components/ui/GlassCard";
import { getOrderByPublicId } from "@/lib/supabase/server";
import { TrackResponsePanel } from "./TrackResponsePanel";

export const dynamic = "force-dynamic";

type SavedResponse = {
  answer?: string;
  message?: string;
  audioDataUrl?: string | null;
  submittedAt?: string;
};

function parseResponse(raw: string | null): SavedResponse | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SavedResponse;
  } catch {
    return { message: raw };
  }
}


function getExpiresStatus(expiresAt: string | null) {
  if (!expiresAt) return { label: "Ngày hết hạn", value: "Không hết hạn" };
  const d = new Date(expiresAt);
  if (isPast(d)) {
    return { label: "Ngày hết hạn", value: "Đã hết hạn vào " + formatTime(expiresAt) };
  }
  return { 
    label: "Ngày hết hạn", 
    value: formatTime(expiresAt) + " (còn " + formatDistanceToNow(d, { locale: vi }) + ")" 
  };
}

function formatTime(value: string | null) {
  if (!value) return "Chưa có";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  }).format(new Date(value));
}

function answerLabel(answer?: string | null) {
  if (answer === "YES") return "Có chứ";
  if (answer === "NO") return "Từ chối";
  if (answer === "MAYBE") return "Để em nghĩ";
  if (answer === "CUSTOM") return "Có lời nhắn riêng";
  return "Chưa trả lời";
}

function getOrderName(customData: unknown, key: "senderName" | "recipientName", fallback: string) {
  if (!customData || typeof customData !== "object") return fallback;
  const value = (customData as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderByPublicId(orderId);

  if (!order) notFound();

  return (
    <div className="min-h-screen px-4 py-8 text-rose-950 sm:px-6 lg:px-10">
      <main className="mx-auto grid max-w-5xl gap-6">
        <header className="relative overflow-hidden rounded-2xl border border-pink-200/60 bg-gradient-to-br from-white via-[#fff8fc] to-[#ffeef5] p-5 text-rose-950 shadow-xl shadow-pink-200/25 sm:p-6">
          <div className="pointer-events-none absolute -right-4 -top-4 text-5xl opacity-20">💕</div>
          <div className="pointer-events-none absolute bottom-2 right-16 text-2xl opacity-15">🌸</div>
          <p className="text-sm font-semibold text-rose-500">Track link cho người mua</p>
          <h1 className="mt-2 text-3xl font-semibold text-rose-950 sm:text-4xl">Theo dõi phản hồi đơn {order.public_id}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-rose-700/75">
            Link này dùng để xem người nhận đã mở quà, trả lời gì và xem phim cùng nhau nếu đã chọn phim nhé 💕
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Trạng thái đơn", order.status],
            ["Thời điểm mở", formatTime(order.gift_opened_at)],
            ["Câu trả lời", answerLabel(order.recipient_response)],
            [getExpiresStatus((order as any).expires_at).label, getExpiresStatus((order as any).expires_at).value],
          ].map(([label, value]) => (
            <GlassCard key={label} hover={false} className="border border-pink-100 bg-white/95 p-5 text-rose-950 shadow-lg shadow-pink-100/40">
              <p className="text-sm font-medium text-rose-500/80">{label}</p>
              <p className="mt-3 text-xl font-bold text-rose-950 sm:text-2xl">{value}</p>
            </GlassCard>
          ))}
        </section>

        <TrackResponsePanel
          orderId={order.public_id}
          initialResponseText={order.response_text}
          senderName={getOrderName(order.custom_data, "senderName", "Host")}
          recipientName={getOrderName(order.custom_data, "recipientName", order.recipient_name ?? "Guest")}
        />
      </main>
    </div>
  );
}
