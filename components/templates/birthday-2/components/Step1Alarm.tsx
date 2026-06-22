"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { Bell, ChevronRight } from "lucide-react";

export function Step1Alarm({ onNext, autoPlay = false }: { onNext: () => void; autoPlay?: boolean }) {
  const [currentTime, setCurrentTime] = useState("07:00");
  const audioRef = useRef<HTMLAudioElement>(null);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 150], [1, 0]);
  const bgOpacity = useTransform(x, [0, 200], [0, 0.4]);
  const controls = useAnimation();

  useEffect(() => {
    // We would play an alarm sound here.
    // For now we'll just try to play a generic beep or simulate it
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    
    // Auto update time for realism
    const interval = setInterval(() => {
      const d = new Date();
      setCurrentTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(() => {
        if (audioRef.current) audioRef.current.pause();
        controls.start({ x: 200, transition: { duration: 0.6 } }).then(() => {
          controls.start({ opacity: 0, scale: 1.1 }).then(() => onNext());
        });
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [autoPlay, controls, onNext]);

  const handleDragEnd = (e: any, info: any) => {
    if (info.offset.x > 150) {
      if (audioRef.current) audioRef.current.pause();
      controls.start({ opacity: 0, scale: 1.1 }).then(() => {
        onNext();
      });
    } else {
      controls.start({ x: 0 });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "brightness(1.5)" }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 flex flex-col items-center justify-between py-16 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop')] z-10"
    >
      <div className="absolute inset-0 bg-pink-900/20 backdrop-blur-[2px] z-0" />
      <motion.div className="absolute inset-0 bg-white z-0 pointer-events-none" style={{ opacity: bgOpacity }} />
      
      <audio ref={audioRef} src="https://assets.mixkit.co/sfx/preview/mixkit-classic-alarm-995.mp3" loop />

      <div className="relative z-10 text-center mt-10">
        <h1 className="text-7xl font-extrabold tracking-tight mb-2 drop-shadow-lg text-white">{currentTime}</h1>
        <p className="text-lg font-bold text-white/90 tracking-wide drop-shadow-md">Thứ 2, ngày 14 tháng 2</p>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 w-full px-8">
        <div className="flex flex-col items-center animate-pulse mb-8">
          <div className="bg-pink-500/80 p-4 rounded-full backdrop-blur-md mb-3 shadow-[0_0_30px_rgba(236,72,153,0.6)]">
            <Bell className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white drop-shadow-md">Báo thức</h2>
          <p className="text-pink-100 font-medium text-lg mt-1 drop-shadow-md">Dậy thôi lợn con ơi! 🐷</p>
        </div>

        <div className="relative w-full h-16 bg-pink-500/30 backdrop-blur-md rounded-full border border-pink-200/50 flex items-center overflow-hidden shadow-[0_8px_32px_rgba(236,72,153,0.3)]">
          <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity }}>
            <span className="text-white font-bold tracking-widest pl-10 text-lg">Vuốt để tắt báo thức</span>
          </motion.div>
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 200 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            animate={controls}
            style={{ x }}
            className="w-14 h-14 bg-white rounded-full ml-1 flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing z-20 border-2 border-pink-100"
          >
            <ChevronRight className="w-6 h-6 text-pink-500" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
