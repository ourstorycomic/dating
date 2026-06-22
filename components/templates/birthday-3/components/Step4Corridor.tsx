"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MEGA_DATA } from "../config";
import { ChevronUp } from "lucide-react";

export function Step4Corridor({ onNext, autoPlay }: { onNext: () => void, autoPlay?: boolean }) {
  const [position, setPosition] = useState(0); // 0, 1, 2, 3 (end)
  const exhibits = MEGA_DATA.exhibits;

  useEffect(() => {
    if (autoPlay) {
      let currentPos = 0;
      const interval = setInterval(() => {
        currentPos += 1;
        setPosition(currentPos);
        if (currentPos >= exhibits.length) {
          clearInterval(interval);
          setTimeout(onNext, 2000);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, exhibits.length, onNext]);

  const handleNext = () => {
    if (position >= exhibits.length) return;
    const newPos = position + 1;
    setPosition(newPos);
    if (newPos >= exhibits.length) {
      setTimeout(onNext, 2000);
    }
  };

  // The Z translation for the entire corridor based on position
  const translateZ = position * 600;

  return (
    <motion.div 
      className="absolute inset-0 bg-neutral-900 z-10 flex items-center justify-center overflow-hidden"
      style={{ perspective: "1000px" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 1 } }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.1)_0%,rgba(0,0,0,0.8)_100%)] z-20 pointer-events-none" />

      {/* 3D World */}
      <motion.div 
        className="relative w-full h-full transform-style-3d"
        animate={{ z: translateZ }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        {/* Floor */}
        <div className="absolute bottom-0 left-[-100%] w-[300%] h-[150vh] bg-neutral-800 border-t border-neutral-700" style={{ transform: "rotateX(90deg) translateZ(-400px)", backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)", backgroundSize: "50px 50px" }} />

        {/* Walls */}
        <div className="absolute top-[-50%] left-0 w-[4000px] h-[200%] bg-neutral-900 border-b border-neutral-700" style={{ transform: "rotateY(90deg) translateZ(-150px)" }} />
        <div className="absolute top-[-50%] right-0 w-[4000px] h-[200%] bg-neutral-900 border-b border-neutral-700" style={{ transform: "rotateY(-90deg) translateZ(-150px)" }} />

        {/* Exhibits */}
        {exhibits.map((exhibit, index) => {
          const zPos = -600 * (index + 1);
          const isLeft = index % 2 === 0;
          return (
            <motion.div 
              key={exhibit.id}
              className="absolute top-1/2 left-1/2 w-[240px] h-[320px] -mt-[160px] -ml-[120px] bg-neutral-800 border-4 border-amber-600/50 shadow-[0_0_50px_rgba(251,191,36,0.2)] rounded flex flex-col items-center p-2"
              style={{
                transform: `translateZ(${zPos}px) translateX(${isLeft ? '-200px' : '200px'}) rotateY(${isLeft ? '30deg' : '-30deg'})`
              }}
            >
              <div className="w-full h-[240px] bg-black overflow-hidden relative">
                <img src={exhibit.image} alt={exhibit.caption} className="w-full h-full object-cover opacity-80" />
                {/* Spotlight */}
                <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[100px] border-l-transparent border-r-[100px] border-r-transparent border-b-[300px] border-b-amber-200/20 pointer-events-none" />
              </div>
              <div className="mt-4 text-center">
                <p className="text-amber-100/90 font-serif text-sm italic">{exhibit.caption}</p>
              </div>
            </motion.div>
          );
        })}

        {/* End of Corridor Door */}
        <div 
          className="absolute top-1/2 left-1/2 w-[200px] h-[400px] -mt-[200px] -ml-[100px] border border-amber-500/30 flex items-center justify-center bg-black/80"
          style={{ transform: `translateZ(${-600 * (exhibits.length + 0.8)}px)` }}
        >
          <div className="w-[180px] h-[380px] border border-amber-500/20 flex flex-col items-center justify-center">
             <div className="w-20 h-20 bg-amber-500/10 rounded-full blur-xl" />
          </div>
        </div>

      </motion.div>

      {/* Control UI */}
      {position < exhibits.length && !autoPlay && (
        <motion.button 
          className="absolute bottom-12 z-30 flex flex-col items-center text-amber-200/70 hover:text-amber-200 transition-colors"
          onClick={handleNext}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronUp className="w-8 h-8" />
          <span className="text-sm font-medium tracking-widest uppercase mt-2">Đi Tiếp</span>
        </motion.button>
      )}
    </motion.div>
  );
}
