import { notFound } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { getOrderByPublicId } from "@/lib/supabase/server";
import { AudioPlayer } from "@/components/ui/AudioPlayer";

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

export default async function TrackPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderByPublicId(orderId);

  if (!order) notFound();

  const response = parseResponse(order.response_text);

  return (
    <div className="min-h-screen px-4 py-8 text-white sm:px-6 lg:px-10">
      <main className="mx-auto grid max-w-5xl gap-6">
        <header className="glass-panel rounded-2xl p-5 sm:p-6">
          <p className="text-sm font-semibold text-pink-100/80">Track link cho người mua</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Theo dõi phản hồi đơn {order.public_id}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-romance-muted">
            Link này dùng để xem người nhận đã mở quà, trả lời gì và nghe lại ghi âm nếu người nhận gửi.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["Trạng thái đơn", order.status],
            ["Thời điểm mở", formatTime(order.gift_opened_at)],
            ["Câu trả lời", answerLabel(order.recipient_response)],
          ].map(([label, value]) => (
            <GlassCard key={label} hover={false} className="p-5">
              <p className="text-sm text-white/58">{label}</p>
              <p className="mt-3 text-2xl font-semibold text-pink-100">{value}</p>
            </GlassCard>
          ))}
        </section>

        <GlassCard hover={false}>
          <h2 className="text-2xl font-semibold">Phản hồi của người nhận</h2>
          {response ? (
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-sm text-white/54">Thời điểm trả lời</p>
                <p className="mt-2 text-lg font-semibold text-pink-100">
                  {formatTime(order.responded_at ?? response.submittedAt ?? null)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-sm text-white/54">Lời nhắn</p>
                <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-white/82">
                  {response.message || "Người nhận không nhập lời nhắn thêm."}
                </p>
              </div>
              {response.audioDataUrl ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <p className="mb-3 text-sm text-white/54">Ghi âm người nhận gửi</p>
                  <AudioPlayer src={response.audioDataUrl} />
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-white/60">
                  Chưa có ghi âm.
                </div>
              )}
            </div>
          ) : (
            <p className="mt-5 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-white/62">
              Chưa có phản hồi. Khi người nhận bấm trả lời ở gift link, nội dung sẽ hiện ở đây.
            </p>
          )}
        </GlassCard>
      </main>
    </div>
  );
}
