"use client";
import { MediaDisplay } from "@/components/ui/MediaDisplay";


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
  senderName?: string;
  recipientName?: string;
};

export const DEFAULT_MEMORY_DATA: Valentine2Data = {
  anniversaryCode: "1402",
  musicUrl: "/valentine-2-music.m4a",
  coverTitle: "Our Memories",
  coverImage: "/assets/lovepics/1.jpg",
  page1Image: "/assets/lovepics/2.jpg",
  page1Text: "Ngày đó, tớ không nghĩ chúng mình lại đi cùng nhau xa đến thế...",
  polaroids: [
    { id: 1, src: "/assets/lovepics/3.jpg", caption: "Bình yên" },
    { id: 2, src: "/assets/lovepics/4.jpg", caption: "Ngốc nghếch" }
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
  voteAverage?: number;
  voteCount?: number;
  categories?: Array<{ name?: string } | string>;
  quality?: string;
  lang?: string;
  status?: string;
};

function progressStorageKey(roomId: string) {
  return `valentine2-progress:${roomId}`;
}

/** Hard refresh (F5) should restart the flow; tab switch keeps React state in memory. */
function isPageReload() {
  if (typeof window === "undefined") return false;
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  return nav?.type === "reload";
}

function clearStoredProgress(roomId: string) {
  try {
    sessionStorage.removeItem(progressStorageKey(roomId));
  } catch {
    // ignore
  }
}

function parseMovieFromResponse(responseText: string | null): MovieData | null {
  if (!responseText) return null;
  try {
    const parsed = JSON.parse(responseText) as { message?: string };
    if (!parsed.message?.includes('"slug"')) return null;
    const movie = JSON.parse(parsed.message) as MovieData;
    return movie?.slug ? movie : null;
  } catch {
    return null;
  }
}

function readStoredProgress(roomId: string): { step: number; selectedMovie: MovieData } | null {
  try {
    const raw = sessionStorage.getItem(progressStorageKey(roomId));
    if (!raw) return null;
    const data = JSON.parse(raw) as { step?: number; selectedMovie?: MovieData };
    if (data.step === 9 && data.selectedMovie?.slug) {
      return { step: 9, selectedMovie: data.selectedMovie };
    }
  } catch {
    // ignore corrupt storage
  }
  return null;
}

function saveStoredProgress(roomId: string, step: number, selectedMovie: MovieData) {
  try {
    sessionStorage.setItem(
      progressStorageKey(roomId),
      JSON.stringify({ step, selectedMovie }),
    );
  } catch {
    // ignore quota / private mode
  }
}

export function Valentine2WatchParty({
  compact,
  fullScreen,
  hideNavigation,
  data: inputData,
  roomId,
  isHost = false,
  initialStep,
  hostDisplayName,
  guestDisplayName,
  autoPlay = false,
  isBuilderPreview = false,
  onResponse
}: {
  compact?: boolean;
  fullScreen?: boolean;
  hideNavigation?: boolean;
  data?: Valentine2Data;
  roomId?: string;
  isHost?: boolean;
  initialStep?: number;
  hostDisplayName?: string;
  guestDisplayName?: string;
  autoPlay?: boolean;
  isBuilderPreview?: boolean;
  onResponse?: (response: { answer: string; message?: string }) => void;
}) {
  const data = { ...DEFAULT_MEMORY_DATA, ...inputData };
  const [step, setStep] = useState(initialStep ?? (isHost ? 9 : 2));
  const audioRef = useRef<HTMLAudioElement>(null);

  const [selectedMovie, setSelectedMovie] = useState<MovieData | null>(null);
  const [restored, setRestored] = useState(!roomId || roomId === "preview-room");

  const [eggColor, setEggColor] = useState("from-pink-400 to-rose-500");

  // Khôi phục tiến trình khi quay lại gift link trong cùng phiên tab (không phải F5)
  useEffect(() => {
    if (!roomId || roomId === "preview-room") {
      setRestored(true);
      return;
    }

    if (isPageReload()) {
      clearStoredProgress(roomId);
      setRestored(true);
      return;
    }

    const stored = readStoredProgress(roomId);
    if (stored) {
      setSelectedMovie(stored.selectedMovie);
      setStep(stored.step);
      setRestored(true);
      return;
    }

    let mounted = true;
    const restoreFromApi = async () => {
      try {
        const res = await fetch(`/api/orders/${roomId}/response`, { cache: "no-store" });
        if (!res.ok || !mounted) return;
        const data = await res.json() as { responseText?: string | null };
        const movie = parseMovieFromResponse(data.responseText ?? null);
        if (!movie || !mounted) return;
        setSelectedMovie(movie);
        setStep(9);
        saveStoredProgress(roomId, 9, movie);
      } finally {
        if (mounted) setRestored(true);
      }
    };

    void restoreFromApi();
    return () => { mounted = false; };
  }, [roomId, isHost]);

  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(e => console.log("Audio play error", e));
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (data.musicUrl && !audio.src.endsWith(encodeURIComponent(data.musicUrl)) && !audio.src.endsWith(data.musicUrl)) {
      audio.pause();
      audio.src = data.musicUrl;
      if (autoPlay) {
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Audio play error', e));
      }
    }
  }, [data.musicUrl, autoPlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (step >= 9) {
      audio.pause();
    }
  }, [step]);

  useEffect(() => {
    if (autoPlay) {
      playMusic();
    } else if (compact && !isBuilderPreview) {
      audioRef.current?.pause();
    }
  }, [autoPlay, compact, isBuilderPreview]);

  // Remove the blind autoPlay interval. The children components will advance automatically using their callbacks when autoPlay is true.
  // We keep the container class.

  let containerClass = "w-full overflow-x-hidden overflow-y-auto transition-colors duration-[2000ms] mx-auto text-gray-800 [perspective:1500px] ";

  const isCinemaMode = step >= 7;
  const bgClass = isCinemaMode
    ? "bg-gradient-to-br from-[#fff6fa]/80 via-[#ffe4ef]/80 to-[#ffd4e5]/80 text-rose-950 bg-[url('/assets/bg/bg8.jpg')] bg-cover bg-center bg-blend-overlay"
    : "bg-gradient-to-br from-[#fffafc]/80 via-[#ffe6f0]/80 to-[#ffd9e7]/80 text-rose-950 bg-[url('/assets/bg/bg5.jpg')] bg-cover bg-center bg-blend-overlay";

  if (compact) {
    containerClass += `absolute inset-0 border-[6px] border-[#f4c5d6] rounded-[2.5rem] shadow-2xl ${bgClass}`;
  } else if (fullScreen) {
    containerClass += `relative min-h-screen ${bgClass}`;
  } else {
    containerClass += isCinemaMode
      ? `relative max-w-[1200px] w-full h-full min-h-[600px] rounded-3xl shadow-[0_0_50px_rgba(244,63,94,0.3)] border-2 border-[#f4c5d6]/50 ${bgClass}`
      : `relative w-full h-full min-h-[600px] rounded-[2rem] shadow-2xl ${bgClass}`;
  }

  return (
    <div className={containerClass}>
      {data.musicUrl ? <audio ref={audioRef} src={data.musicUrl} loop preload="auto" muted={compact && !autoPlay} /> : null}

      {/* Particles: romantic in scrapbook, subtle cinematic in movie steps */}
      {!compact && !isCinemaMode && <FloatingParticles fullWidth={fullScreen} cinema={false} />}

      <AnimatePresence mode="wait">
        {!restored && (
          <motion.div
            key="restoring"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-[#fff6fa]/80 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-300 border-t-rose-600" />
              <p className="text-sm font-semibold text-rose-700">Đang mở lại phòng xem phim...</p>
            </div>
          </motion.div>
        )}

        {restored && step === 2 && (
          <Scrapbook
            key="scrapbook"
            data={data}
            onExtractLetter={() => setStep(5)}
            onFirstInteraction={playMusic}
            autoPlay={autoPlay}
            compact={compact}
          />
        )}

        {restored && step === 5 && (
          <Valentine2ClawMachine
            key="clawMachine"
            onEggGrabbed={(color) => {
              setEggColor(color);
              setStep(6);
            }}
            autoPlay={autoPlay}
            compact={compact}
          />
        )}

        {restored && step === 6 && (
          <Step6Popup
            key="step6"
            confession={data.confessionText}
            onComplete={() => setStep(7)}
            compact={compact}
            autoPlay={autoPlay}
            eggColor={eggColor}
          />
        )}

        {restored && step === 7 && (
          <Step7Lobby
            key="step7"
            compact={compact}
            fullScreen={fullScreen}
            autoPlay={autoPlay}
            onSelectMovie={(movie) => {
              setSelectedMovie(movie);
              if (roomId && roomId !== "preview-room") {
                saveStoredProgress(roomId, 9, movie);
              }
              onResponse?.({ answer: "YES", message: JSON.stringify(movie) });
              setStep(9);
            }}
          />
        )}

        {restored && step === 9 && selectedMovie && (
          <motion.div 
            key="watchRoom"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-[#fff6fa] via-[#ffe4ef] to-[#ffd4e5] z-50 overflow-x-hidden overflow-y-auto rounded-[inherit]"
          >
            {(roomId || compact || autoPlay || !roomId || roomId === "preview-room") ? (
              <WatchRoom 
                roomId={roomId || "preview-room"} 
                movie={selectedMovie} 
                isHost={isHost}
                hostDisplayName={hostDisplayName ?? data.senderName ?? "Host"}
                guestDisplayName={guestDisplayName ?? data.recipientName ?? "Guest"}
                onBackToLobby={isHost ? () => setStep(7) : undefined}
                onChangeMovie={(movie) => {
                  setSelectedMovie(movie);
                  if (roomId && roomId !== "preview-room") {
                    saveStoredProgress(roomId, 9, movie);
                  }
                  onResponse?.({ answer: "YES", message: JSON.stringify(movie) });
                }}
                compact={compact}
                isPreview={!roomId || roomId === "preview-room"}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-6 p-6 bg-gradient-to-br from-[#fff6fa] via-[#ffe4ef] to-[#ffd4e5]">
                <div className="relative w-40 h-60 rounded-2xl overflow-hidden shadow-xl shadow-pink-200/40 ring-4 ring-pink-200/60">
                  <MediaDisplay src={selectedMovie.thumb_url} alt={selectedMovie.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-900/40 to-transparent" />
                </div>
                <div className="text-center">
                  <p className="text-rose-500 text-xs font-bold uppercase tracking-widest mb-1">Đã chọn phim</p>
                  <h3 className="text-rose-950 text-lg font-bold">{selectedMovie.name}</h3>
                  <p className="text-rose-600 text-sm mt-1">{selectedMovie.year}</p>
                </div>
                <div className="text-center text-rose-600 text-sm max-w-[240px]">
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-ping" />
                    <span className="text-rose-500 font-semibold">Đang chờ bên kia xác nhận...</span>
                  </div>
                  <p className="text-xs opacity-70">Khi cả hai đồng ý, phòng chiếu sẽ tự động mở 💕</p>
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
        isHidden={hideNavigation || autoPlay}
      />
    </div>
  );
}

