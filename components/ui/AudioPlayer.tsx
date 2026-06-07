"use client";

import { useEffect, useRef, useState } from "react";

const waveformBars = Array.from({ length: 40 }, (_, index) => 24 + ((index * 17) % 58));

export function AudioPlayer({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    };

    const updateDuration = () => {
      if (audio.duration !== Infinity) {
        setDuration(audio.duration);
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pos * duration;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 pr-6">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <button 
        onClick={togglePlay}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:scale-105 transition-transform"
      >
        {isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
          </svg>
        ) : (
          <svg className="ml-1" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M7 4v16l13-8z" />
          </svg>
        )}
      </button>

      <div className="flex flex-1 flex-col justify-center gap-2">
        <div 
          className="relative flex h-8 w-full cursor-pointer items-center justify-between gap-[2px] overflow-hidden"
          onClick={handleSeek}
        >
          {waveformBars.map((baseHeight, i) => {
            const isPlayed = (i / waveformBars.length) * 100 <= progress;
            const height = isPlaying ? baseHeight : 20;
            
            return (
              <div 
                key={i} 
                className={`w-full rounded-full transition-all duration-150 ${isPlayed ? 'bg-pink-400' : 'bg-white/20'}`}
                style={{ height: `${height}%` }}
              />
            )
          })}
        </div>
        
        <div className="flex justify-between text-[11px] font-medium text-white/40">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
