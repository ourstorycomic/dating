"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MEGA_DATA } from "../config";
import { ChevronRight } from "lucide-react";

export function Step9Letter({ onNext, autoPlay }: { onNext: () => void, autoPlay?: boolean }) {
  const [showScroll, setShowScroll] = useState(false);
  const [text, setText] = useState("");
  const fullText = MEGA_DATA.letter;

  useEffect(() => {
    const t = setTimeout(() => setShowScroll(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (showScroll) {
      let index = 0;
      const interval = setInterval(() => {
        setText(fullText.slice(0, index));
        index++;
        if (index > fullText.length) {
          clearInterval(interval);
          if (autoPlay) setTimeout(onNext, 3000);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [showScroll, fullText, autoPlay, onNext]);

  return (
    <motion.div 
      className="absolute inset-0 z-10 bg-indigo-950 flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)", transition: { duration: 1 } }}
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none" />

      <AnimatePresence>
        {showScroll && (
          <motion.div 
            className="relative w-full max-w-[320px] bg-[#fdf6e3] rounded shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 border-[8px] border-[#e6c27a]"
            initial={{ y: 200, opacity: 0, scale: 0.5, rotateX: 60 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ type: "spring", bounce: 0.4, duration: 1.5 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Scroll rolls */}
            <div className="absolute -top-4 left-[-10px] right-[-10px] h-8 bg-[#d4af37] rounded-full shadow-lg border-2 border-[#b8860b]" />
            <div className="absolute -bottom-4 left-[-10px] right-[-10px] h-8 bg-[#d4af37] rounded-full shadow-lg border-2 border-[#b8860b]" />

            <div className="min-h-[200px] whitespace-pre-wrap text-neutral-800 font-serif leading-relaxed text-lg font-medium">
              {text}
              <span className="animate-pulse">|</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showScroll && text.length >= fullText.length && !autoPlay && (
        <motion.button 
          className="absolute bottom-12 flex items-center gap-2 px-6 py-3 bg-amber-500 text-amber-950 rounded-full font-bold shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:bg-amber-400 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onNext}
        >
          Tiếp tục <ChevronRight className="w-5 h-5" />
        </motion.button>
      )}

    </motion.div>
  );
}
