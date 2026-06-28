"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/purity, react-hooks/set-state-in-effect, react/no-unescaped-entities */

import { useState, useEffect, useRef, type PointerEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconStar, MediaFrame } from "../shared";

export function Stage1Telescope({
  accent,
  connectInstruction,
  imageUrl,
  mediaType,
  introSubtitle,
  introTitle,
  onNext,
  revealBody,
  revealButton,
  revealTitle,
  autoPlay = false,
}: {
  accent: string;
  connectInstruction: string;
  imageUrl: string;
  mediaType?: string;
  introSubtitle: string;
  introTitle: string;
  onNext: () => void;
  revealBody: string;
  revealButton: string;
  revealTitle: string;
  autoPlay?: boolean;
}) {
  const [found, setFound] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [mrBeanShrink, setMrBeanShrink] = useState(false);
  const [mrBeanPos, setMrBeanPos] = useState({ x: 0, y: 0 });
  const [showReveal, setShowReveal] = useState(false);
  const [targetPercent, setTargetPercent] = useState({ x: 0.74, y: 0.24 });
  const [canScan, setCanScan] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const zones = [
      { x: 0.25, y: 0.25 },
      { x: 0.75, y: 0.25 },
      { x: 0.25, y: 0.75 },
      { x: 0.75, y: 0.75 },
      { x: 0.25, y: 0.5 },
      { x: 0.75, y: 0.5 },
    ];
    const zone = zones[Math.floor(Math.random() * zones.length)];
    setTargetPercent({
      x: zone.x + (Math.random() - 0.5) * 0.08,
      y: zone.y + (Math.random() - 0.5) * 0.08,
    });
    const timer = window.setTimeout(() => setCanScan(true), 600);
    
    if (autoPlay) {
      const autoTimer = window.setTimeout(() => {
        revealTarget();
      }, 2000);
      return () => {
        window.clearTimeout(timer);
        window.clearTimeout(autoTimer);
      };
    }
    
    return () => window.clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  const revealTarget = (point?: { x: number; y: number }) => {
    if (found || !canScan) return;
    const rect = containerRef.current?.getBoundingClientRect();
    setFound(true);
    if (point && rect) {
      setMrBeanPos({ x: point.x - rect.left, y: point.y - rect.top });
    } else if (rect) {
      setMrBeanPos({ x: rect.width * targetPercent.x, y: rect.height * targetPercent.y });
    }
    if (navigator.vibrate) navigator.vibrate([60, 40, 160]);
    setTimeout(() => setDrawing(true), 120);
    setTimeout(() => setMrBeanShrink(true), 1700);
    setTimeout(() => setShowReveal(true), 2600);
  };

  const handleDrag = (e: any, info: any) => {
    if (found || !canScan) return;
    const rect = containerRef.current?.getBoundingClientRect();
    const lensRect = lensRef.current?.getBoundingClientRect();
    if (!rect || !lensRect) return;

    const targetX = rect.left + rect.width * targetPercent.x;
    const targetY = rect.top + rect.height * targetPercent.y;
    
    const lensCenterX = lensRect.left + lensRect.width / 2;
    const lensCenterY = lensRect.top + lensRect.height / 2;

    const dist = Math.hypot(lensCenterX - targetX, lensCenterY - targetY);

    if (dist < Math.max(70, rect.width * 0.22)) {
      revealTarget({ x: lensCenterX, y: lensCenterY });
    }
  };

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden z-10 flex flex-col items-center justify-center"
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
      ref={containerRef}
    >
      
      {/* Dòng chữ hướng dẫn - Ẩn đi khi bắt đầu thu nhỏ Mr Bean */}
      {!showReveal && (
        <motion.div 
          animate={{ opacity: mrBeanShrink ? 0 : 1 }}
          className="absolute inset-0 flex flex-col items-center justify-between px-5 pb-24 pt-10 pointer-events-none z-50"
        >
          {introTitle || introSubtitle ? (
            <div className="max-w-sm rounded-3xl border border-white/15 bg-black/35 p-5 text-center backdrop-blur-xl">
              {introTitle ? <h2 className="text-2xl font-black text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.35)]">{introTitle}</h2> : null}
              {introSubtitle ? <p className="mt-2 text-sm leading-6 text-white/70">{introSubtitle}</p> : null}
            </div>
          ) : (
            <div />
          )}
          <p className="text-white animate-pulse text-lg font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] px-6 py-2 bg-black/30 rounded-full backdrop-blur-md border border-white/20">
            {connectInstruction}
          </p>
        </motion.div>
      )}

      {/* Chòm sao gợi ý nằm ở vị trí mục tiêu */}
      {!showReveal && (
        <button
          aria-label="Vùng chòm sao"
          className="absolute z-40 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
          onClick={() => revealTarget()}
          style={{ left: `${targetPercent.x * 100}%`, top: `${targetPercent.y * 100}%` }}
          type="button"
        >
          <IconStar className="absolute left-5 top-4 h-3 w-3 text-pink-300" />
          <IconStar className="absolute left-16 top-8 h-4 w-4 text-pink-100" />
          <IconStar className="absolute left-9 top-16 h-3 w-3 text-pink-300" />
        </button>
      )}

      {/* Kính viễn vọng */}
      <AnimatePresence>
        {!showReveal && (
          <motion.div 
            ref={lensRef}
            drag={!found} 
            dragConstraints={containerRef}
            dragElastic={0.1}
            dragMomentum={false}
            onDrag={handleDrag}
            animate={mrBeanShrink ? { width: 0, height: 0, borderWidth: 0, boxShadow: "0 0 0 9999px rgba(0,0,0,1)" } : found ? { width: 224, height: 224, borderWidth: 10, scale: [1, 1.03, 0.98, 1.04, 1] } : { width: 224, height: 224, borderWidth: 10 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="rounded-full border-[#2a1b3d] shadow-[0_0_0_9999px_rgba(10,5,20,0.98)] flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ cursor: found ? 'default' : 'grab' }}
          >
            <div className="absolute inset-0 rounded-full border border-pink-500/30 shadow-[inset_0_0_50px_rgba(236,72,153,0.3)]" />
            <div className="w-full h-[1px] bg-red-500/30 absolute top-1/2" />
            <div className="h-full w-[1px] bg-red-500/30 absolute left-1/2" />
            {found && !mrBeanShrink ? (
              <motion.div
                className="relative z-40 grid h-28 w-28 place-items-center"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={drawing ? {
                  opacity: [0, 1, 1, 0],
                  rotate: [-8, 8, -10, 10, -6, 6, 0],
                  scale: [0.55, 1, 1.15, 1.35],
                  x: [-8, 8, -7, 7, -4, 4, 0],
                } : { opacity: 1, scale: 1 }}
                transition={{ duration: 1.45, ease: "easeInOut" }}
              >
                <IconStar className="h-24 w-24 text-pink-300 drop-shadow-[0_0_28px_rgba(244,114,182,0.95)]" />
                {drawing ? (
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 18 }).map((_, index) => {
                      const angle = (Math.PI * 2 * index) / 18;
                      return (
                        <motion.span
                          className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-pink-200 shadow-[0_0_12px_rgba(251,207,232,0.95)]"
                          key={index}
                          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                          animate={{
                            opacity: [0, 1, 0],
                            x: Math.cos(angle) * 95,
                            y: Math.sin(angle) * 95,
                            scale: [0, 1.1, 0],
                          }}
                          transition={{ delay: 0.65, duration: 0.7, ease: "easeOut" }}
                        />
                      );
                    })}
                  </div>
                ) : null}
              </motion.div>
            ) : null}
            
            {/* Vẽ ngôi sao bên trong kính khi đã lock mục tiêu */}
            {false && drawing && (
              <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_20px_#f472b6] z-30" viewBox="0 0 100 100">
                 <motion.polygon 
                   points="50,15 61,40 88,40 66,57 74,82 50,66 26,82 34,57 12,40 39,40"
                   fill="none" stroke="#f472b6" strokeWidth="2"
                   initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }}
                 />
              </svg>
            )}
            {found && !drawing && <p className="absolute -top-10 text-pink-400 font-bold animate-pulse whitespace-nowrap">Đang khóa mục tiêu...</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Màn hình Sáng lên & Ảnh bên trong ngôi sao */}
      <AnimatePresence>
        {showReveal && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center p-6 overflow-hidden z-30">
            <motion.div
              className="absolute inset-0 z-[70] bg-black pointer-events-none"
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 1, 0] }}
              transition={{ duration: 1.2, times: [0, 0.35, 1], ease: "easeInOut" }}
            />
            
            {/* Lớp phủ Mr Bean Explosion (Lỗ tròn mở rộng ra từ chấm nhỏ) */}
            <motion.div 
              className="absolute rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,1)] z-50 pointer-events-none"
              initial={{ width: 0, height: 0, left: mrBeanPos.x, top: mrBeanPos.y, x: "-50%", y: "-50%" }}
              animate={{ width: 3000, height: 3000, boxShadow: "0 0 0 9999px rgba(0,0,0,0)" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Tự tạo nền vũ trụ CSS */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0a0514] to-[#0a0514] opacity-80" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-60 mix-blend-screen" />

            {/* Confetti Particles bay ra TỪ TRUNG TÂM (chỗ cái ảnh) */}
            <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
              {Array.from({ length: 60 }).map((_, i) => {
                const angle = Math.random() * Math.PI * 2;
                const dist = 100 + Math.random() * 300; // Bay tỏa ra từ tâm
                return (
                  <motion.div key={i} className="absolute w-2 h-2 rounded-full"
                    style={{ backgroundColor: ['#f472b6', '#60a5fa', '#34d399', '#fbbf24', '#c084fc'][i % 5] }}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{ 
                      x: Math.cos(angle) * dist, 
                      y: Math.sin(angle) * dist, 
                      scale: [0, Math.random() * 2 + 1, 0],
                      opacity: [1, 1, 0],
                      rotate: Math.random() * 360
                    }}
                    transition={{ duration: 2.5 + Math.random() * 2, ease: "easeOut" }}
                  />
                )
              })}
            </div>

            <motion.div className="relative z-10 flex items-center justify-center mb-8" 
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
            >
              {/* Vòng Glow rực rỡ đằng sau */}
              <div className="absolute w-64 h-64 bg-pink-500/20 rounded-full blur-[50px] animate-pulse" />
              
              {/* Ảnh được CẮT (Clip) thành hình Ngôi Sao */}
              <motion.div className="relative z-10 w-64 h-64"
                style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}
                initial={{ scale: 0, rotate: -180 }} 
                animate={{ scale: 1, rotate: 0 }} 
                transition={{ duration: 2, type: "spring", bounce: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <MediaFrame alt="Ảnh hoặc video kỷ niệm" mediaType={mediaType} src={imageUrl || "/assets/lovepics/2.jpg"} />
              </motion.div>
              
              {/* Viền Ngôi sao đè lên trên cho nét */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_15px_#f472b6] z-20" viewBox="0 0 100 100">
                 <polygon 
                   points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"
                   fill="none" stroke="#f472b6" strokeWidth="1.5"
                 />
              </svg>
            </motion.div>

            {/* Thông báo căn giữa màn hình */}
            <motion.div className="w-full max-w-sm bg-black/60 backdrop-blur-2xl border border-pink-500/30 p-8 rounded-3xl text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20"
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1, duration: 1.5 }}
            >
              <h3 className="text-2xl font-black mb-4 drop-shadow-md tracking-wide" style={{ color: accent }}>{revealTitle}</h3>
              <p className="text-white/90 leading-relaxed text-[15px] font-serif">
                {revealBody}
              </p>
              <motion.button onClick={onNext} 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-[0_5px_20px_rgba(236,72,153,0.5)] w-full uppercase tracking-widest text-sm"
              >
                {revealButton}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

