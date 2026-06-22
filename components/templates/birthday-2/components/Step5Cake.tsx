"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Step5Cake({ onNext, autoPlay = false }: { onNext: () => void; autoPlay?: boolean }) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [blown, setBlown] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
    if (navigator.vibrate) navigator.vibrate([100, 50, 200]);
    setTimeout(() => {
      onNext();
    }, 2000); // Wait 2s to show smoke before moving to letter
  };

  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(() => startHold(), 2000);
      return () => {
        clearTimeout(t);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay]);

  return (
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
        <h2 className="text-2xl font-black text-amber-200 mb-3 drop-shadow-[0_0_10px_rgba(253,230,138,0.5)]">Make a Wish ✨</h2>
        <p className="text-slate-300 font-medium leading-relaxed">
          Nhắm mắt lại, ước một điều<br />và <span className="text-amber-400 font-bold">giữ lỳ vào ngọn nến</span> để thổi nhé!
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
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-32 h-32 bg-transparent cursor-pointer touch-none z-50 rounded-full flex items-center justify-center"
              onPointerDown={startHold}
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
    </motion.div>
  );
}
