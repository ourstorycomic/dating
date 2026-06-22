"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MEGA_DATA } from "../config";

export function Step1WaxSeal({ onNext, autoPlay }: { onNext: () => void, autoPlay?: boolean }) {
  const [melting, setMelting] = useState(false);
  const [melted, setMelted] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  if (autoPlay && !melted && !melting) {
    setTimeout(() => {
      setMelting(true);
      setTimeout(() => {
        setMelted(true);
        setTimeout(onNext, 1500);
      }, 1000);
    }, 1000);
  }

  const handlePointerDown = () => {
    if (autoPlay) return;
    setMelting(true);
    pressTimer.current = setTimeout(() => {
      setMelted(true);
      setTimeout(onNext, 1500);
    }, 2000); // Hold for 2 seconds
  };

  const handlePointerUp = () => {
    if (autoPlay || melted) return;
    if (pressTimer.current) clearTimeout(pressTimer.current);
    setMelting(false);
  };

  return (
    <motion.div 
      className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center z-10"
      exit={{ opacity: 0, scale: 1.2, transition: { duration: 1 } }}
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />

      <motion.div 
        className="relative w-[300px] h-[200px] bg-amber-50 rounded-lg shadow-2xl flex items-center justify-center border border-amber-200/50"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="absolute top-0 w-0 h-0 border-l-[150px] border-l-transparent border-r-[150px] border-r-transparent border-t-[100px] border-t-amber-100 opacity-80" />
        <div className="absolute bottom-0 w-0 h-0 border-l-[150px] border-l-transparent border-r-[150px] border-r-transparent border-b-[100px] border-b-amber-200 opacity-60" />

        <AnimatePresence>
          {!melted && (
            <motion.div
              className={`absolute w-20 h-20 bg-red-700 rounded-full cursor-pointer flex items-center justify-center shadow-[0_4px_10px_rgba(185,28,28,0.5)] z-20 ${melting ? 'scale-110 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]' : ''}`}
              style={{ filter: melting ? 'contrast(1.2) brightness(1.2)' : '' }}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              exit={{ scale: 2, opacity: 0, filter: "blur(10px)", transition: { duration: 0.8 } }}
            >
              {/* Wax Seal pattern */}
              <div className="w-16 h-16 border-2 border-red-800 rounded-full flex items-center justify-center">
                <span className="text-red-900 font-serif text-3xl font-bold opacity-80">R</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {!melted && (
          <motion.p 
            className="mt-12 text-amber-100/70 tracking-widest text-sm font-medium animate-pulse"
            exit={{ opacity: 0 }}
          >
            {MEGA_DATA.waxSealText}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
