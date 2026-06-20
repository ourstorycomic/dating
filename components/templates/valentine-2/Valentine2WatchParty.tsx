"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";


import { Scrapbook } from "./components/Scrapbook";
import { Step6Popup } from "./components/Step6Popup";
import { Step7Lobby } from "./components/Step7Lobby";
import { WatchRoom } from "./components/WatchRoom";
import { FloatingParticles } from "./components/FloatingParticles";
import { Valentine2ClawMachine } from "./components/Valentine2ClawMachine";
import { TemplateNavigator } from "../TemplateNavigator";

export type Valentine2Data = {
  anniversaryCode: string;
  musicUrl: string;
  coverTitle: string;
  coverImage: string;
  page1Image: string;
  page1Text: string;
  polaroids: { id: number; src: string; caption: string }[];
  page2Text: string;
  page3Hint: string;
  confessionText: string;
};

export const DEFAULT_MEMORY_DATA: Valentine2Data = {
  anniversaryCode: "1402",
  musicUrl: "/valentine-2-music.m4a",
  coverTitle: "Our Memories",
  coverImage: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600",
  page1Image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600",
  page1Text: "Ngày đó, tớ không nghĩ chúng mình lại đi cùng nhau xa đến thế...",
  polaroids: [
    { id: 1, src: "https://images.unsplash.com/photo-1494774116478-eb287e07b8b2?w=400", caption: "Bình yên" },
    { id: 2, src: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400", caption: "Ngốc nghếch" }
  ],
  page2Text: "Tớ yêu cái cách cậu quan tâm đến những điều nhỏ nhất...",
  page3Hint: "Kéo ruy băng nhé",
  confessionText: "Trang sách này tớ muốn để ngỏ, chờ cậu cùng viết tiếp. Tối nay đi xem phim với tớ nhé?",
};

export type MovieData = {
  _id: string;
  name: string;
  slug: string;
  thumb_url: string;
  poster_url: string;
  year: number;
};

export function Valentine2WatchParty({
  compact,
  fullScreen,
  hideNavigation,
  data: inputData,
  roomId,
  isHost = false,
  onResponse
}: {
  compact?: boolean;
  fullScreen?: boolean;
  hideNavigation?: boolean;
  data?: Valentine2Data;
  roomId?: string;
  isHost?: boolean;
  onResponse?: (response: { answer: string; message?: string }) => void;
}) {
  const data = { ...DEFAULT_MEMORY_DATA, ...inputData };
  const [step, setStep] = useState(isHost ? 9 : 2); // Host goes straight to Watch, guest starts at 2
  const audioRef = useRef<HTMLAudioElement>(null);

  const [selectedMovie, setSelectedMovie] = useState<MovieData | null>(null);

  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(e => console.log("Audio play error", e));
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (data.musicUrl && !audio.src.endsWith(data.musicUrl)) {
      audio.src = data.musicUrl;
    }
  }, [data.musicUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (step >= 9) {
      audio.pause();
    }
  }, [step]);

  let containerClass = "w-full overflow-hidden transition-colors duration-[2000ms] mx-auto text-gray-800 touch-none [perspective:1500px] ";

  const isCinemaMode = step >= 7;
  const bgClass = isCinemaMode
    ? "bg-gradient-to-br from-[#fff6fa] via-[#ffe4ef] to-[#ffd4e5] text-rose-950"
    : "bg-gradient-to-br from-[#fffafc] via-[#ffe6f0] to-[#ffd9e7] text-rose-950";

  if (compact) {
    containerClass += `absolute inset-0 border-[6px] border-[#f4c5d6] rounded-[2.5rem] shadow-2xl ${bgClass}`;
  } else if (fullScreen) {
    containerClass += `relative min-h-screen ${bgClass}`;
  } else {
    containerClass += isCinemaMode
      ? `relative max-w-[1200px] w-[95vw] h-[85vh] min-h-[600px] rounded-3xl shadow-[0_0_50px_rgba(244,63,94,0.3)] border-2 border-[#f4c5d6]/50 ${bgClass}`
      : `relative max-w-[400px] h-[800px] max-h-[90vh] rounded-[2.5rem] shadow-2xl border-[12px] border-[#f4c5d6] ${bgClass}`;
  }

  return (
    <div className={containerClass}>
      {data.musicUrl ? <audio ref={audioRef} src={data.musicUrl} loop preload="auto" /> : null}

      {/* Particles: romantic in scrapbook, subtle cinematic in movie steps */}
      {!isCinemaMode && <FloatingParticles fullWidth={fullScreen} cinema={false} />}

      <AnimatePresence mode="wait">
        {step === 2 && (
          <Scrapbook
            key="scrapbook"
            data={data}
            onExtractLetter={() => setStep(5)}
            onFirstInteraction={playMusic}
          />
        )}

        {step === 5 && (
          <Valentine2ClawMachine
            key="clawMachine"
            onEggGrabbed={() => setStep(6)}
          />
        )}

        {step === 6 && (
          <Step6Popup
            key="step6"
            confession={data.confessionText}
            onComplete={() => setStep(7)}
            compact={compact}
          />
        )}

        {step === 7 && (
          <Step7Lobby
            key="step7"
            compact={compact}
            fullScreen={fullScreen}
            onSelectMovie={(movie) => {
              setSelectedMovie(movie);
              onResponse?.({ answer: "YES", message: JSON.stringify(movie) });
              setStep(9);
            }}
          />
        )}

        {step === 9 && selectedMovie && (
          <motion.div 
            key="watchRoom"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950 z-50 overflow-hidden rounded-[inherit]"
          >
            {roomId ? (
              <WatchRoom 
                roomId={roomId} 
                movie={selectedMovie} 
                isHost={true} 
                onBackToLobby={() => setStep(7)} 
                onChangeMovie={(movie) => {
                  setSelectedMovie(movie);
                  onResponse?.({ answer: "YES", message: JSON.stringify(movie) });
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
                <div className="relative w-40 h-60 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-rose-500/40">
                  <img src={selectedMovie.thumb_url} alt={selectedMovie.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                </div>
                <div className="text-center">
                  <p className="text-rose-300 text-xs font-bold uppercase tracking-widest mb-1">Đã chọn phim</p>
                  <h3 className="text-white text-lg font-bold">{selectedMovie.name}</h3>
                  <p className="text-slate-400 text-sm mt-1">{selectedMovie.year}</p>
                </div>
                <div className="text-center text-slate-400 text-sm max-w-[240px]">
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-ping" />
                    <span className="text-rose-300 font-semibold">Đang chờ bên kia xác nhận...</span>
                  </div>
                  <p className="text-xs opacity-70">Khi cả hai đồng ý, phòng chiếu sẽ tự động mở</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <TemplateNavigator
        currentIndex={[2, 5, 6, 7, 9].indexOf(step)}
        totalSteps={5}
        onPrev={() => {
          const s = [2, 5, 6, 7, 9];
          const idx = s.indexOf(step);
          if (idx > 0) setStep(s[idx - 1]);
        }}
        onNext={() => {
          const s = [2, 5, 6, 7, 9];
          const idx = s.indexOf(step);
          if (idx < s.length - 1) setStep(s[idx + 1]);
        }}
        accentColor="#db2777"
        isHidden={compact || hideNavigation}
      />
    </div>
  );
}
