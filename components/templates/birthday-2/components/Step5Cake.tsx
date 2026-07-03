"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Step5Cake({ onNext, autoPlay = false, compact = false }: { onNext: () => void; autoPlay?: boolean; compact?: boolean }) {
  const [phase, setPhase] = useState<"record" | "blow">("record");
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [blown, setBlown] = useState(false);
  
  const [isRecording, setIsRecording] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const blowSoundRef = useRef<HTMLAudioElement>(null);

  const startRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setIsRecording(true);
      if (navigator.vibrate) navigator.vibrate(50);
    } catch(err) {
      setIsRecording(true);
    }
  };

  const stopRecord = () => {
    if (!isRecording) return;
    setIsRecording(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    setPhase("blow");
  };

  const startHold = () => {
    if (blown) return;
    setHolding(true);
    if (navigator.vibrate) navigator.vibrate(50);
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(intervalRef.current!);
          handleBlow();
          return 100;
        }
        if (p % 25 === 0 && navigator.vibrate) navigator.vibrate(30);
        return p + 2;
      });
    }, 40); // 2 seconds total (100 / 2 * 40 = 2000ms)
  };

  const stopHold = () => {
    if (blown) return;
    setHolding(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(0);
  };

  const handleBlow = () => {
    setBlown(true);
    setHolding(false);
    if (blowSoundRef.current) {
      blowSoundRef.current.currentTime = 0;
      blowSoundRef.current.play().catch(() => {});
    }
    if (navigator.vibrate) navigator.vibrate([100, 50, 200]);
    setTimeout(() => {
      onNext();
    }, 2000); // Wait 2s to show smoke before moving to letter
  };

  useEffect(() => {
    if (autoPlay) {
      const t0 = setTimeout(() => setPhase("blow"), 2000);
      const t = setTimeout(() => startHold(), 4000);
      return () => {
        clearTimeout(t0);
        clearTimeout(t);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay]);

  return (
    <>
    <audio ref={blowSoundRef} src="/assets/vfx/partyblower.mp3" preload="auto" muted={compact && !autoPlay} />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
      className="absolute inset-0 bg-[#0f172a] flex flex-col items-center justify-center p-6 z-50 overflow-hidden"
    >
      {/* Dimmed background layer */}
      <div className="absolute inset-0 bg-radial-gradient from-indigo-900/20 to-transparent pointer-events-none" />

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center z-20 mb-20"
      >
        <h2 className="text-2xl font-black text-amber-200 mb-3 drop-shadow-[0_0_10px_rgba(253,230,138,0.5)]">
          {phase === "record" ? "Điều ước của bạn" : "Make a Wish ✨"}
        </h2>
        <p className="text-slate-300 font-medium leading-relaxed h-12">
          {phase === "record" ? (
            <>Nói điều bạn muốn gửi gắm<br />Bằng cách <span className="text-amber-400 font-bold">nhấn giữ nút Mic</span> bên dưới</>
          ) : (
            <>Nhắm mắt lại, nghĩ về điều ước<br />và <span className="text-amber-400 font-bold">giữ lỳ vào ngọn nến</span> để thổi nhé!</>
          )}
        </p>
      </motion.div>

      <div className="relative mt-10">
        {/* CSS Cake */}
        <div className="relative w-48 h-24 bg-pink-300 rounded-[50%] shadow-[0_10px_0_#d8b4e2,0_20px_0_#ffb7b2,0_30px_0_#e2f0cb] mt-10 z-10 flex justify-center border-t-4 border-pink-200">
          {/* Candle */}
          <div className="absolute -top-16 w-4 h-20 bg-gradient-to-b from-white to-amber-100 rounded-sm border border-amber-200 shadow-inner z-20">
            {/* Wick */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-slate-800" />
            
            {/* Hitbox for interaction */}
            <div 
              className={`absolute -top-20 left-1/2 -translate-x-1/2 w-32 h-32 bg-transparent ${phase === "blow" ? "cursor-pointer" : ""} touch-none z-50 rounded-full flex items-center justify-center`}
              onPointerDown={() => phase === "blow" && startHold()}
              onPointerUp={stopHold}
              onPointerLeave={stopHold}
              onContextMenu={e => e.preventDefault()}
            >
              {/* Flame */}
              <AnimatePresence>
                {!blown && (
                  <motion.div
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute w-6 h-10 bg-gradient-to-t from-amber-500 via-yellow-300 to-white rounded-b-[40%] rounded-t-[50%] origin-bottom shadow-[0_0_40px_20px_rgba(252,211,77,0.4)]"
                    animate={{
                      scale: [1, 1.1, 0.9, 1.05, 1],
                      rotate: [-2, 2, -1, 3, 0],
                      skewX: holding ? [0, -10, 10, -5, 5, 0] : [0, 2, -2, 0]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: holding ? 0.2 : 0.8,
                      ease: "easeInOut"
                    }}
                    style={{ top: '45%' }}
                  />
                )}
              </AnimatePresence>

              {/* Smoke when blown */}
              {blown && (
                <motion.div
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 0.8, 0], y: -50, scale: 2 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute w-4 h-4 bg-slate-300 rounded-full blur-sm"
                  style={{ top: '60%' }}
                />
              )}

              {/* Progress Ring */}
              <svg className="absolute w-24 h-24 pointer-events-none transform -rotate-90">
                <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(251,191,36,0.1)" strokeWidth="4" />
                <circle 
                  cx="48" cy="48" r="44" fill="none" stroke="#fbbf24" strokeWidth="4" 
                  strokeDasharray="276" strokeDashoffset={276 - (276 * progress) / 100} 
                  className="transition-all duration-75"
                />
              </svg>

              {holding && !blown && (
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-amber-400"
                  animate={{ scale: [1, 1.2], opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mic Recording UI */}
      <AnimatePresence>
        {phase === "record" && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-20 flex flex-col items-center z-50"
          >
            <div className="h-10 flex items-center justify-center mb-4">
              {isRecording ? (
                <div className="flex items-center gap-2 text-pink-400 font-bold">
                  <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75"></span><span className="relative inline-flex h-3 w-3 rounded-full bg-pink-500"></span></span>
                  Đang ghi âm điều ước...
                </div>
              ) : (
                <div className="text-slate-400 text-sm">Sẵn sàng ghi âm</div>
              )}
            </div>
            
            <button
              onPointerDown={(e) => { e.preventDefault(); startRecord(); }}
              onPointerUp={(e) => { e.preventDefault(); stopRecord(); }}
              onPointerLeave={(e) => { e.preventDefault(); stopRecord(); }}
              onContextMenu={(e) => e.preventDefault()}
              style={{ WebkitUserSelect: "none", userSelect: "none" }}
              className={`w-20 h-20 rounded-full flex items-center justify-center border-4 border-slate-700 transition-all ${isRecording ? 'bg-pink-500 scale-110 shadow-[0_0_30px_rgba(236,72,153,0.6)]' : 'bg-slate-800'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isRecording ? "text-white" : "text-slate-400"}>
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" x2="12" y1="19" y2="22"></line>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </>
  );
}
