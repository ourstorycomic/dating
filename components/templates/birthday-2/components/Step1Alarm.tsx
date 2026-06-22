"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { Bell, ChevronRight } from "lucide-react";

export function Step1Alarm({ onNext }: { onNext: () => void }) {
  const [currentTime, setCurrentTime] = useState("07:00");
  const audioRef = useRef<HTMLAudioElement>(null);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 150], [1, 0]);
  const bgOpacity = useTransform(x, [0, 200], [0, 1]);
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
      exit={{ opacity: 0, scale: 1.1, filter: "brightness(2)" }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 flex flex-col items-center justify-between py-16 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1518621736915-f3b8c41bfd00?q=80&w=600&auto=format&fit=crop')] z-10"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />
      <motion.div className="absolute inset-0 bg-white z-0 pointer-events-none" style={{ opacity: bgOpacity }} />
      
      <audio ref={audioRef} src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" loop />

      <div className="relative z-10 text-center mt-10">
        <h1 className="text-6xl font-thin tracking-wider mb-2 drop-shadow-md">{currentTime}</h1>
        <p className="text-lg font-medium text-white/80 tracking-wide">Thứ 2, ngày 14 tháng 2</p>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 w-full px-8">
        <div className="flex flex-col items-center animate-pulse mb-8">
          <Bell className="w-10 h-10 mb-3 text-white" />
          <h2 className="text-2xl font-semibold">Báo thức</h2>
          <p className="text-white/70 mt-1">Dậy đi làm/đi học thôi!</p>
        </div>

        <div className="relative w-full h-16 bg-white/20 backdrop-blur-md rounded-full border border-white/30 flex items-center overflow-hidden">
          <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity }}>
            <span className="text-white/70 font-medium tracking-widest pl-10">Vuốt để tắt</span>
          </motion.div>
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 200 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            animate={controls}
            style={{ x }}
            className="w-14 h-14 bg-white rounded-full ml-1 flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing z-20"
          >
            <ChevronRight className="w-6 h-6 text-slate-800" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
