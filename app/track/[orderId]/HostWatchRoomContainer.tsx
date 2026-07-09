"use client";

import React from "react";
import { WatchRoom } from "@/components/templates/valentine-2/components/WatchRoom";

export function HostWatchRoomContainer({
  roomId,
  movieStr,
  senderName,
  recipientName,
}: {
  roomId: string;
  movieStr: string;
  senderName: string;
  recipientName: string;
}) {
  let movie;
  try {
    movie = JSON.parse(movieStr);
  } catch {
    return null;
  }

  if (!movie || !movie.slug) return null;

  return (
    <div className="mt-4 overflow-x-hidden overflow-y-auto rounded-[2rem] border-2 border-pink-200/80 bg-gradient-to-br from-[#fff8fc] via-[#fff0f7] to-[#ffe4f0] shadow-xl shadow-pink-200/30">
      <WatchRoom
        roomId={roomId}
        movie={movie}
        isHost={false}
        hostDisplayName={senderName}
        guestDisplayName={recipientName}
      />
    </div>
  );
}
