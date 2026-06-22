"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MEGA_DATA } from "../config";
import confetti from "canvas-confetti";
import { Gift } from "lucide-react";

export function Step10FallingStar({ autoPlay, onNext }: { autoPlay?: boolean, onNext?: () => void }) {
  const [stage, setStage] = useState(0); // 0: Wait for click, 1: Star falling, 2: Explosion & Voucher
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (autoPlay && stage === 0) {
      const t = setTimeout(() => handleStarClick(), 2000);
      return () => clearTimeout(t);
    }
  }, [autoPlay, stage]);

  const handleStarClick = () => {
    setStage(1);
    setTimeout(() => {
      setStage(2);
      triggerConfetti();
      if (autoPlay && onNext) setTimeout(onNext, 6000);
    }, 1500); // 1.5s falling
  };

  const triggerConfetti = () => {
    if (canvasRef.current) {
      const myConfetti = confetti.create(canvasRef.current, { resize: true, useWorker: true });
      myConfetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#fcd34d', '#f59e0b', '#fff'] });
      setTimeout(() => {
        myConfetti({ particleCount: 100, spread: 120, origin: { y: 0.6 }, angle: 60 });
        myConfetti({ particleCount: 100, spread: 120, origin: { y: 0.6 }, angle: 120 });
      }, 500);
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 z-10 bg-indigo-950 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-30" />

      <AnimatePresence>
        {stage === 0 && (
          <motion.div 
            className="flex flex-col items-center justify-center"
            exit={{ opacity: 0 }}
          >
            <motion.button 
              className="w-24 h-24 rounded-full bg-amber-100 shadow-[0_0_50px_rgba(251,191,36,1)] border-4 border-white flex items-center justify-center group"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              onClick={handleStarClick}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full blur-[2px] group-hover:blur-0 transition-all" />
            </motion.button>
            <p className="mt-8 text-amber-200 font-bold tracking-widest uppercase">Chạm vào vì sao</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === 1 && (
          <motion.div 
            className="absolute top-0 right-0 w-10 h-10 bg-white rounded-full shadow-[0_0_50px_rgba(255,255,255,1)]"
            initial={{ x: 200, y: -200, scale: 0.5 }}
            animate={{ x: -150, y: 300, scale: 2 }}
            transition={{ duration: 1.5, ease: "easeIn" }}
          >
            {/* Tail */}
            <div className="absolute top-1/2 left-1/2 w-[300px] h-2 bg-gradient-to-r from-transparent via-white to-white -translate-y-1/2 -rotate-45 blur-[2px] origin-right" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === 2 && (
          <motion.div 
            className="relative z-40 w-[300px] bg-gradient-to-br from-amber-100 to-amber-200 rounded-3xl p-8 shadow-[0_20px_50px_rgba(251,191,36,0.3)] border-4 border-amber-300 flex flex-col items-center text-center"
            initial={{ scale: 0, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <div className="absolute -top-10 w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <Gift className="w-10 h-10 text-white" />
            </div>

            <h2 className="mt-6 text-2xl font-black text-amber-900 tracking-wider">QUÀ TẶNG BÍ MẬT</h2>
            <div className="w-full h-px border-t-2 border-dashed border-amber-400/50 my-4" />
            <p className="text-amber-800 font-medium text-lg leading-relaxed mb-6">
              {MEGA_DATA.voucher}
            </p>

            <motion.button 
              className="w-full py-4 rounded-xl bg-amber-500 text-white font-black text-xl uppercase tracking-widest hover:bg-amber-400 transition-colors shadow-[0_5px_15px_rgba(245,158,11,0.4)]"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              onClick={() => {
                if (!autoPlay && onNext) onNext();
              }}
            >
              Đồng ý nhận quà!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
