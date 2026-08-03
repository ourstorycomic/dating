"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/purity, react-hooks/set-state-in-effect, react/no-unescaped-entities */

import { useState, useEffect, useRef, type PointerEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconStar, MediaFrame } from "../shared";

export function Stage2Orbit({
  accent,
  imageCaption,
  imageUrl,
  mediaType,
  nextButton,
  onNext,
  quote,
  subtitle,
  title,
  autoPlay = false,
}: {
  accent: string;
  imageCaption: string;
  imageUrl: string;
  mediaType?: string;
  nextButton: string;
  onNext: () => void;
  quote: string;
  subtitle: string;
  title: string;
  autoPlay?: boolean;
}) {
  const [placed, setPlaced] = useState<number[]>([]);
  const [evasiveJumps, setEvasiveJumps] = useState(0);
  const [evasivePos, setEvasivePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (e: any, info: any, id: number) => {
    if (info.offset.y > 50) { // Đã kéo xuống khu vực slots
      if (!placed.includes(id)) {
        setPlaced([...placed, id]);
        if (navigator.vibrate) navigator.vibrate(50);
      }
    }
  };

  useEffect(() => {
    if (autoPlay) {
      if (placed.length < 3) {
        const t = setTimeout(() => {
          setPlaced(prev => [...prev, prev.length]);
        }, 1200);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          onNext();
        }, 3000);
        return () => clearTimeout(t);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, placed]);

  const handleEvasiveHover = () => {
    if (evasiveJumps < 3 && !placed.includes(2)) {
      setEvasiveJumps(j => j + 1);
      setEvasivePos({ x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200 });
    }
  };

  const done = placed.length === 3;

  return (
    <motion.div ref={containerRef} className="absolute inset-0 flex flex-col items-center justify-between p-6 z-10"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="mt-10 text-center">
        <h3 className="text-2xl font-bold mb-2 drop-shadow-md" style={{ color: accent }}>{title}</h3>
        <p className="text-sm text-white/70">{subtitle}</p>
      </div>

      <div className="relative w-full h-64 flex items-center justify-center">
        {!done && (
          <>
            {/* Sao bình thường 1 */}
            {!placed.includes(0) && (
              <motion.div drag dragConstraints={containerRef} dragElastic={0.1} onDragEnd={(e, info) => handleDragEnd(e, info, 0)} className="absolute top-10 left-10 w-12 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing z-50">
                <IconStar className="w-8 h-8 text-blue-300 drop-shadow-[0_0_15px_#93c5fd]" />
              </motion.div>
            )}
            {/* Sao bình thường 2 */}
            {!placed.includes(1) && (
              <motion.div drag dragConstraints={containerRef} dragElastic={0.1} onDragEnd={(e, info) => handleDragEnd(e, info, 1)} className="absolute top-20 right-10 w-12 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing z-50">
                <IconStar className="w-8 h-8 text-blue-300 drop-shadow-[0_0_15px_#93c5fd]" />
              </motion.div>
            )}
            {/* Sao bướng bỉnh */}
            {!placed.includes(2) && (
              <motion.div
                drag={evasiveJumps >= 3} 
                dragConstraints={containerRef} dragElastic={0.1} 
                onDragEnd={(e, info) => handleDragEnd(e, info, 2)} 
                onPointerEnter={handleEvasiveHover} // Sửa giật lag: Dùng pointer enter nhạy hơn hover
                animate={evasiveJumps < 3 ? { x: evasivePos.x, y: evasivePos.y } : undefined}
                className={`absolute bottom-10 left-1/2 -ml-6 w-12 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing z-50`}
              >
                <IconStar className={`w-8 h-8 ${evasiveJumps < 3 ? 'text-red-400 drop-shadow-[0_0_15px_#f87171] animate-pulse' : 'text-blue-300 drop-shadow-[0_0_15px_#93c5fd]'}`} />
                {evasiveJumps < 3 && <span className="absolute -top-6 text-xs text-red-300 whitespace-nowrap">Bướng bỉnh!</span>}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Target Slots */}
      <div className="w-full flex justify-center gap-6 mb-20 relative">
        {[0, 1, 2].map((id) => (
          <div key={id} className={`w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center transition-colors ${placed.includes(id) ? 'border-blue-400 bg-blue-500/20' : 'border-white/20 bg-white/5'}`}>
            {placed.includes(id) && <IconStar className="w-8 h-8 text-blue-300 drop-shadow-[0_0_20px_#93c5fd] scale-125" />}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {done && (
          <motion.div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
          >
            <motion.div 
              className="w-64 h-80 rounded-2xl border border-white/20 shadow-[0_0_50px_rgba(147,197,253,0.3)] bg-white/10 p-3 pb-12 relative cursor-pointer"
              initial={{ rotate: 2 }}
              whileHover={{ scale: 1.05, rotate: 0, boxShadow: "0 0 80px rgba(147,197,253,0.6)", zIndex: 50 }}
            >
              <div className="w-full h-full rounded-xl overflow-hidden relative">
                <motion.div
                  className="h-full w-full opacity-80"
                  whileHover={{ scale: 1.1, filter: "grayscale(0%)" }}
                  initial={{ filter: "grayscale(100%)" }}
                  transition={{ duration: 0.4 }}
                >
                  <MediaFrame alt="Ảnh hoặc video làm hòa" mediaType={mediaType} src={imageUrl || "/assets/lovepics/1.jpg"} />
                </motion.div>
              </div>
              <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
                 <p className="font-serif text-blue-200 font-bold">{imageCaption}</p>
              </div>
            </motion.div>
            <p className="mt-8 text-center text-white/90 leading-relaxed font-serif italic max-w-sm">
              {quote}
            </p>
            <button onClick={onNext} className="mt-8 px-8 py-3 rounded-full bg-blue-500/20 border border-blue-400 text-blue-200 font-bold hover:bg-blue-500/40 transition">
              {nextButton}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

