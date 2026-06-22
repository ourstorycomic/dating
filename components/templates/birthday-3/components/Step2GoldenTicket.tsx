"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { MEGA_DATA } from "../config";
import { Ticket } from "lucide-react";

export function Step2GoldenTicket({ onNext, autoPlay }: { onNext: () => void, autoPlay?: boolean }) {
  const controls = useAnimation();
  const [swiped, setSwiped] = useState(false);

  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(() => {
        setSwiped(true);
        controls.start({ x: 400, rotate: 45, opacity: 0, transition: { duration: 0.8 } }).then(onNext);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [autoPlay, controls, onNext]);

  const handleDragEnd = (e: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      setSwiped(true);
      controls.start({ x: info.offset.x > 0 ? 400 : -400, rotate: info.offset.x > 0 ? 45 : -45, opacity: 0, transition: { duration: 0.5 } }).then(onNext);
    } else {
      controls.start({ x: 0, rotate: 0 });
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.15)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        animate={controls}
        whileDrag={{ scale: 1.05 }}
        className="relative w-[300px] h-[160px] bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-500 rounded-xl shadow-[0_0_40px_rgba(251,191,36,0.4)] flex flex-col items-center justify-center border-2 border-yellow-200 cursor-grab active:cursor-grabbing overflow-hidden"
      >
        {/* Shine effect */}
        <motion.div 
          className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-45deg] z-10"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        />

        <Ticket className="w-10 h-10 text-amber-900 mb-2 opacity-80" />
        <h2 className="text-2xl font-black text-amber-900 tracking-widest">{MEGA_DATA.ticket.title}</h2>
        <p className="text-xs font-bold text-amber-800 mt-1 uppercase opacity-80">{MEGA_DATA.ticket.subtitle}</p>

        {/* Perforation line */}
        <div className="absolute top-0 bottom-0 left-[20%] w-px border-l-2 border-dashed border-amber-600/30" />
      </motion.div>

      {!swiped && (
        <motion.p 
          className="mt-12 text-amber-200/70 tracking-widest text-sm font-medium animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {MEGA_DATA.ticket.instruction}
        </motion.p>
      )}
    </motion.div>
  );
}
