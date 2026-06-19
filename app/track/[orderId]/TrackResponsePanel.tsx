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

function parseResponse(raw: string | null): SavedResponse | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SavedResponse;
  } catch {
    return { message: raw };
  }
}

function isMovieResponse(response: SavedResponse | null) {
  if (!response?.message?.includes('"slug"')) return false;
  try {
    return Boolean(JSON.parse(response.message).slug);
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
}: {
  orderId: string;
  initialResponseText: string | null;
  senderName: string;
}) {
  const [responseText, setResponseText] = useState<string | null>(initialResponseText);
  const [respondedAt, setRespondedAt] = useState<string | null>(null);
  const [giftOpenedAt, setGiftOpenedAt] = useState<string | null>(null);
  const [recipientResponse, setRecipientResponse] = useState<string | null>(null);

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
  const movieResponse = isMovieResponse(response);

  return (
    <GlassCard
      hover={false}
      className="border border-pink-200 bg-white/80 p-5 text-rose-950 shadow-2xl shadow-pink-200/20 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Phản hồi của người nhận</h2>
        <span className="animate-pulse rounded-full bg-rose-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">
          Live
        </span>
      </div>

      {response ? (
        <div className="mt-5 grid gap-4">
          <div className="rounded-2xl border border-pink-100 bg-white/85 p-4 shadow-sm">
            <p className="text-sm text-rose-700/60">Thời điểm trả lời</p>
            <p className="mt-2 text-lg font-semibold text-rose-950">
              {formatTime(respondedAt ?? response.submittedAt ?? null)}
            </p>
          </div>

          {!movieResponse && (
            <div className="rounded-2xl border border-pink-100 bg-white/85 p-4 shadow-sm">
              <p className="text-sm text-rose-700/60">Lời nhắn</p>
              <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-rose-900">
                {response.message || "Người nhận không nhập lời nhắn thêm."}
              </p>
            </div>
          )}

          {movieResponse && response.message ? (
            <HostWatchRoomContainer
              roomId={orderId}
              movieStr={response.message}
              senderName={senderName}
            />
          ) : null}

          {response.audioDataUrl ? (
            <div className="rounded-2xl border border-pink-100 bg-white/85 p-4 shadow-sm">
              <p className="mb-3 text-sm text-rose-700/60">Ghi âm người nhận gửi</p>
              <AudioPlayer src={response.audioDataUrl} />
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
          Chưa có phản hồi. Khi người nhận bấm trả lời ở gift link, nội dung sẽ hiện ở đây.
        </p>
      )}
    </GlassCard>
  );
}