"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/purity, react-hooks/set-state-in-effect, react/no-unescaped-entities */

import { useState, useEffect, useRef, type PointerEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconStar, MediaFrame } from "../shared";

export function Stage3InfinityVoice({
  accent,
  mediaType,
  mediaUrl,
  musicLabel,
  nextButton,
  onNext,
  points,
  messages,
  subtitle,
  title,
}: {
  accent: string;
  mediaType?: string;
  mediaUrl: string;
  musicLabel: string;
  nextButton: string;
  onNext: () => void;
  points: {x: number, y: number}[];
  messages: string[];
  subtitle: string;
  title: string;
}) {
  const [activePoints, setActivePoints] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showVideo, setShowVideo] = useState(false);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (showVideo) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const nextTargetIdx = activePoints.length;
    if (nextTargetIdx < points.length) {
      const target = points[nextTargetIdx];
      const dist = Math.sqrt(Math.pow(x - target.x, 2) + Math.pow(y - target.y, 2));
      if (dist < 15) { // Bán kính hit box
        const newArr = [...activePoints, nextTargetIdx];
        setActivePoints(newArr);
        if (navigator.vibrate) navigator.vibrate(30);
        if (newArr.length === points.length) {
           setTimeout(() => setShowVideo(true), 1500);
        }
      }
    }
  };
  const handlePointerDown = (e: React.PointerEvent) => {
    if (activePoints.length === 0) {
      handlePointerMove(e);
    }
  };

  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center z-10"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute top-10 text-center">
        <h3 className="text-2xl font-bold mb-2" style={{ color: accent }}>{title}</h3>
        <p className="text-sm text-white/60">{subtitle}</p>
        <p className="text-xs text-pink-300 mt-2 animate-pulse">{musicLabel}</p>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full max-w-sm h-64 mt-20 touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]">
          {activePoints.map((idx, i) => {
            if (i === 0) return null;
            const p1 = points[activePoints[i - 1]];
            const p2 = points[idx];
            return (
              <motion.line key={i} x1={`${p1.x}%`} y1={`${p1.y}%`} x2={`${p2.x}%`} y2={`${p2.y}%`} stroke="#f472b6" strokeWidth="4" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }}
              />
            );
          })}
        </svg>

        {points.map((p, i) => (
          <div key={i} className={`absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-transform ${activePoints.includes(i) ? 'scale-125' : 'animate-pulse'}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <div className={`w-3 h-3 rounded-full ${activePoints.includes(i) ? 'bg-pink-400 shadow-[0_0_20px_#f472b6]' : 'bg-white/40'}`} />
          </div>
        ))}
      </div>

      <div className="h-20 flex items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          {activePoints.length > 1 && activePoints.length <= points.length && (
            <motion.p 
              key={activePoints.length}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="text-xl font-serif italic text-pink-200 drop-shadow-md"
            >
              "{messages[activePoints.length - 2]}"
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showVideo && (
          <motion.div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
          >
            <motion.div className="w-full max-w-sm rounded-3xl overflow-hidden border-2 border-pink-500/50 shadow-[0_0_50px_rgba(236,72,153,0.3)] mb-8"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
            >
              {/* Real Video Player */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                <MediaFrame alt="Ảnh hoặc video sau khi nối chòm sao" mediaType={mediaType || "video/mp4"} src={mediaUrl || "https://www.w3schools.com/html/mov_bbb.mp4"} />
              </div>
            </motion.div>
            <button onClick={onNext} className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold transition">
              {nextButton}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

