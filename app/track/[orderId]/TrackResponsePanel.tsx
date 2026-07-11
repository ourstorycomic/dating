"use client";

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { HostWatchRoomContainer } from "./HostWatchRoomContainer";

type SavedResponse = {
  answer?: string;
  message?: string;
  audioDataUrl?: string | null;
  submittedAt?: string;
};

function parseResponse(raw: string | null): SavedResponse | SavedResponse[] | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SavedResponse | SavedResponse[];
  } catch {
    return { message: raw };
  }
}

function isMovieResponse(response: SavedResponse | SavedResponse[] | null) {
  const first = Array.isArray(response) ? response[0] : response;
  if (!first?.message?.includes('"slug"')) return false;
  try {
    return Boolean(JSON.parse(first.message).slug);
  } catch {
    return false;
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

export function TrackResponsePanel({
  orderId,
  initialResponseText,
  senderName,
  recipientName,
}: {
  orderId: string;
  initialResponseText: string | null;
  senderName: string;
  recipientName: string;
}) {
  const [responseText, setResponseText] = useState<string | null>(initialResponseText);
  const [respondedAt, setRespondedAt] = useState<string | null>(null);
  const [giftOpenedAt, setGiftOpenedAt] = useState<string | null>(null);
  const [recipientResponse, setRecipientResponse] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let mounted = true;

    const refresh = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/response`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json() as {
          responseText?: string | null;
          respondedAt?: string | null;
          giftOpenedAt?: string | null;
          recipientResponse?: string | null;
        };
        if (!mounted) return;
        setResponseText(data.responseText ?? null);
        setRespondedAt(data.respondedAt ?? null);
        setGiftOpenedAt(data.giftOpenedAt ?? null);
        setRecipientResponse(data.recipientResponse ?? null);
      } catch {
        // retry on next interval
      }
    };

    void refresh();
    const timer = window.setInterval(() => void refresh(), 2500);
    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, [orderId]);

  const response = useMemo(() => parseResponse(responseText), [responseText]);
  const isArrayResponse = Array.isArray(response);
  const movieResponse = isMovieResponse(response);

  return (
    <GlassCard
      hover={false}
      className="border border-pink-200 bg-gradient-to-br from-white via-[#fff8fc] to-[#ffeef5] p-5 text-rose-950 shadow-2xl shadow-pink-200/25"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-rose-950">💌 Phản hồi của người nhận</h2>
        <span className="animate-pulse rounded-full bg-gradient-to-r from-pink-100 to-rose-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 border border-pink-200">
          Live
        </span>
      </div>

      {isArrayResponse && response ? (
        <div className="mt-5 grid gap-4">
          <div className="rounded-2xl border border-pink-100 bg-white/85 p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-rose-700/60">Tổng số phản hồi</p>
              <p className="mt-1 text-2xl font-bold text-rose-950">{response.length}</p>
            </div>
            <div>
              <p className="text-sm text-rose-700/60 text-right">Tổng số khách</p>
              <p className="mt-1 text-2xl font-bold text-rose-950 text-right">
                {response.reduce((acc, r) => {
                  try {
                    const data = JSON.parse(r.message?.replace("RSVP: ", "") || "{}");
                    const count = parseInt(data.count);
                    return acc + (isNaN(count) ? 1 : count);
                  } catch { return acc; }
                }, 0)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-pink-100 bg-white/85 p-4 shadow-sm">
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên hoặc SĐT..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-pink-100 rounded-xl bg-white text-sm focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 text-rose-950 placeholder:text-rose-300 mb-4 transition-all shadow-sm"
            />
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {response
                .filter(r => {
                  if (!searchQuery) return true;
                  const msg = r.message?.toLowerCase() || "";
                  return msg.includes(searchQuery.toLowerCase());
                })
                .map((r, i) => {
                  let rsvpData: any = {};
                  try { rsvpData = JSON.parse(r.message?.replace("RSVP: ", "") || "{}"); } catch {}
                  return (
                    <div key={i} className="bg-white border border-pink-50 rounded-xl p-4 shadow-sm text-sm">
                      <div className="flex justify-between items-center mb-3 border-b border-pink-50 pb-2">
                        <strong className="text-rose-900 text-base">{rsvpData.name || "Khách ẩn danh"}</strong>
                        <span className="text-[10px] text-rose-400 font-semibold">{formatTime(r.submittedAt || null)}</span>
                      </div>
                      <ul className="space-y-2 text-rose-800">
                        <li className="flex justify-between items-center"><span className="text-rose-500/70">SĐT:</span> <strong>{rsvpData.phone || "-"}</strong></li>
                        <li className="flex justify-between items-center"><span className="text-rose-500/70">Số lượng:</span> <strong>{rsvpData.count || "1"} người</strong></li>
                      </ul>
                    </div>
                  );
                })}
              {response.length > 0 && response.filter(r => {
                if (!searchQuery) return true;
                const msg = r.message?.toLowerCase() || "";
                return msg.includes(searchQuery.toLowerCase());
              }).length === 0 && (
                <p className="text-center text-sm text-rose-400 py-4">Không tìm thấy phản hồi nào.</p>
              )}
            </div>
          </div>
        </div>
      ) : response && !isArrayResponse ? (
        <div className="mt-5 grid gap-4">
          <div className="rounded-2xl border border-pink-100 bg-white/85 p-4 shadow-sm">
            <p className="text-sm text-rose-700/60">Thời điểm trả lời</p>
            <p className="mt-2 text-lg font-semibold text-rose-950">
              {formatTime(respondedAt ?? (response as SavedResponse).submittedAt ?? null)}
            </p>
          </div>

          {!movieResponse && (
            <div className="rounded-2xl border border-pink-100 bg-white/85 p-4 shadow-sm">
              <p className="text-sm text-rose-700/60 mb-2">Lời nhắn / Phản hồi</p>
              {(response as SavedResponse).message && (response as SavedResponse).message?.startsWith("RSVP: {") ? (
                <div className="bg-white border border-pink-100 rounded-xl p-4 shadow-sm">
                  <p className="text-sm font-semibold text-rose-600 mb-3 border-b border-pink-50 pb-2">Xác Nhận Tham Dự (RSVP)</p>
                  <ul className="space-y-2 text-sm text-rose-900">
                    {(() => {
                      try {
                        const rsvpData = JSON.parse((response as SavedResponse).message!.replace("RSVP: ", ""));
                        return (
                          <>
                            <li className="flex justify-between"><span className="text-rose-500/70">Tên khách:</span> <strong>{rsvpData.name || "Không có"}</strong></li>
                            <li className="flex justify-between"><span className="text-rose-500/70">Số điện thoại:</span> <strong>{rsvpData.phone || "Không có"}</strong></li>
                            <li className="flex justify-between"><span className="text-rose-500/70">Số lượng:</span> <strong>{rsvpData.count || "1"} người</strong></li>
                          </>
                        );
                      } catch (e) {
                        return <li>{(response as SavedResponse).message}</li>;
                      }
                    })()}
                  </ul>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-base leading-7 text-rose-900">
                  {(response as SavedResponse).message || "Người nhận không nhập lời nhắn thêm."}
                </p>
              )}
            </div>
          )}

          {movieResponse && (response as SavedResponse).message ? (
            <HostWatchRoomContainer
              roomId={orderId}
              movieStr={(response as SavedResponse).message!}
              senderName={senderName}
              recipientName={recipientName}
            />
          ) : null}

          {(response as SavedResponse).audioDataUrl ? (
            <div className="rounded-2xl border border-pink-100 bg-white/85 p-4 shadow-sm">
              <p className="mb-3 text-sm text-rose-700/60">Ghi âm người nhận gửi</p>
              <AudioPlayer src={(response as SavedResponse).audioDataUrl!} />
            </div>
          ) : (
            !movieResponse && (
              <div className="rounded-2xl border border-pink-100 bg-white/85 p-4 text-sm text-rose-700/70 shadow-sm">
                Chưa có ghi âm.
              </div>
            )
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs text-rose-500/80">
            <span className="rounded-full bg-pink-100 px-3 py-1 font-semibold">Mở quà: {formatTime(giftOpenedAt)}</span>
            <span className="rounded-full bg-pink-100 px-3 py-1 font-semibold">Phản hồi: {recipientResponse || "Chưa trả lời"}</span>
          </div>
        </div>
      ) : (
        <p className="mt-5 rounded-2xl border border-pink-100 bg-white/85 p-4 text-sm text-rose-700/70 shadow-sm">
          Chưa có phản hồi. Khi người nhận bấm trả lời ở link, nội dung sẽ hiện ở đây.
        </p>
      )}
    </GlassCard>
  );
}