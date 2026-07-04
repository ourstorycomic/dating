"use client";
import { MediaDisplay } from "@/components/ui/MediaDisplay";


import { useEffect, useRef } from "react";
import { motion, Variants } from "framer-motion";
import { PackageOpen } from "lucide-react";

export function Step4Unbox({ photos, onNext, autoPlay = false, compact = false }: { photos: { url: string; note: string }[]; onNext: () => void; autoPlay?: boolean; compact?: boolean }) {
  const popSoundRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    const t = setTimeout(() => {
      if (popSoundRef.current && !(compact && !autoPlay)) {
        popSoundRef.current.currentTime = 0;
        popSoundRef.current.play().catch(() => {});
      }
    }, 1000);
    return () => clearTimeout(t);
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.8,
        delayChildren: 1,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 300, scale: 0, opacity: 0, rotate: -20 },
    show: (i: number) => ({
      y: 0,
      scale: 1,
      opacity: 1,
      rotate: i % 2 === 0 ? -6 : 8,
      transition: { type: "spring", bounce: 0.5, duration: 1.5 }
    })
  };

  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(() => onNext(), 6000); // Wait for photos to appear
      return () => clearTimeout(t);
    }
  }, [autoPlay, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-orange-100 flex flex-col items-center justify-center p-6 z-40 overflow-hidden"
    >
      <audio ref={popSoundRef} src="/assets/vfx/you-found-bojuka_2.mp3" preload="auto" muted={compact && !autoPlay} />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

      {/* The box at the bottom */}
      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="absolute bottom-10 z-10"
      >
        <PackageOpen className="w-32 h-32 text-orange-800/80 drop-shadow-xl" />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative w-full h-[60%] flex items-center justify-center z-20 mb-20"
      >
        {photos.map((photo, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={itemVariants}
            className="absolute bg-white p-3 pb-8 shadow-2xl border border-gray-100"
            style={{ width: '80%', maxWidth: '280px', top: i * 20 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <MediaDisplay src={photo.url} alt={`Memory ${i}`} className="w-full aspect-square object-cover bg-gray-100" />
            <p className="font-serif text-center mt-4 text-gray-700 text-sm leading-relaxed" style={{ transform: "rotate(-1deg)" }}>
              {photo.note}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.5 }}
        className="absolute bottom-32 z-30 w-full px-8"
      >
        <button
          onClick={() => {
            if (popSoundRef.current) {
              popSoundRef.current.currentTime = 0;
              popSoundRef.current.play().catch(() => {});
            }
            onNext();
          }}
          className="w-full py-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg shadow-[0_10px_20px_rgba(225,29,72,0.3)] hover:scale-105 active:scale-95 transition-transform"
        >
          Xem Tiếp ✨
        </button>
      </motion.div>
    </motion.div>
  );
}
