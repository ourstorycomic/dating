"use client";

import React from "react";
import { WatchRoom } from "@/components/templates/valentine-2/components/WatchRoom";

export function HostWatchRoomContainer({
  roomId,
  movieStr,
  senderName,
}: {
  roomId: string;
  movieStr: string;
  senderName: string;
}) {
  let movie;
  try {
    movie = JSON.parse(movieStr);
  } catch {
    return null;
  }

  if (!movie || !movie.slug) return null;

  return (
    <div className="mt-4 overflow-hidden rounded-[2rem] border border-pink-200 bg-white/80 shadow-2xl shadow-pink-200/30 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 border-b border-pink-100 px-4 py-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-rose-400">Phòng xem chung</p>
          <h3 className="mt-1 text-lg font-black text-rose-950">{movie.name}</h3>
        </div>
        <div className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-rose-500 animate-pulse">
          Tự mở phòng
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <WatchRoom
          roomId={roomId}
          movie={movie}
          isHost={false}
          guestName={senderName}
        />
      </div>
    </div>
  );
}
