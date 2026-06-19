import React, { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { GACHA_DATA } from "../config";

export function Step6Success({ onComplete }: { onComplete?: () => void }) {
  useEffect(() => {
    // Fire confetti when this step mounts
    const myConfetti = confetti.create(document.getElementById('confetti-canvas') as HTMLCanvasElement, { resize: true });
    myConfetti({ particleCount: 150, spread: 160, origin: { y: 0.6 }, zIndex: 100 });
    
    const timer = setTimeout(() => {
        if(onComplete) onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 1 }}
      className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4"
    >
      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ delay: 0.5, duration: 1 }}
        className="text-pink-400 text-4xl font-bold font-[Dancing_Script] drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] text-center leading-tight"
      >
        {GACHA_DATA.step6Title}<br/>
        <span className="text-2xl text-white font-[Poppins]">{GACHA_DATA.step6Sub}</span>
      </motion.h1>
    </motion.div>
  );
}
