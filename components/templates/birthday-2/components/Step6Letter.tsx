"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import type { Birthday2Config } from "../config";
export function Step6Letter({ letter, onNext, autoPlay = false, compact = false, config = {} }: { letter: string; onNext: () => void; autoPlay?: boolean; compact?: boolean; config?: Birthday2Config }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingFinished, setIsTypingFinished] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [autoPlay]);

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < letter.length) {
        i++;
        setDisplayedText(letter.slice(0, i));
      } else {
        clearInterval(typingInterval);
        setTimeout(() => setIsTypingFinished(true), 800);
      }
    }, 80); // slow typewriter effect

    return () => clearInterval(typingInterval);
  }, [letter]);

  useEffect(() => {
    if (autoPlay && isTypingFinished) {
      const t = setTimeout(() => onNext(), 3000);
      return () => clearTimeout(t);
    }
  }, [autoPlay, isTypingFinished, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] p-6 z-50"
    >
      <audio ref={audioRef} autoPlay loop src="https://assets.mixkit.co/sfx/preview/mixkit-soft-piano-melody-2972.mp3" muted={compact && !autoPlay} />

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-full max-w-[320px] bg-[#fdfbf7] border border-amber-200 p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative"
      >
        <div className="absolute top-0 right-0 w-10 h-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
        
        <p className="font-serif text-slate-800 font-medium text-lg leading-loose min-h-[200px]">
          {displayedText}
          {!isTypingFinished && <span className="animate-pulse">_</span>}
        </p>

        <AnimatePresence>
          {isTypingFinished && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 flex justify-center"
            >
              <button
                onClick={onNext}
                className="px-8 py-4 rounded-full bg-indigo-600 text-white font-bold tracking-wide hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all"
              >
                {config?.Mqutht || "Mở quà thật 🎁"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
