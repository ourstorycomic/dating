"use client";

import { memo, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

const EMOJIS = ["❤", "💖", "💕", "🌸", "✨", "🎀", "🧸", "🌷", "🍡"];

export const FloatingHearts3D = memo(function FloatingHearts3D({ count = 30 }: { count?: number }) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const actualCount = isMobile ? Math.min(count, 10) : count;

  const hearts = useMemo(() => Array.from({ length: actualCount }).map((_, i) => {
    const depth = Math.random();
    return {
      id: i,
      size: isMobile ? 15 + Math.random() * 20 : 20 + Math.random() * 30,
      left: Math.random() * 100,
      duration: isMobile ? 10 + Math.random() * 10 : 8 + Math.random() * 10,
      delay: -(Math.random() * 20),
      blur: depth > 0.8 ? "blur-[4px]" : depth < 0.2 ? "blur-[1px]" : "",
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      y: -1000 - Math.random() * 500,
      x: (Math.random() - 0.5) * 300,
      rotZ: (Math.random() - 0.5) * 360,
      rotX: isMobile ? 0 : (Math.random() - 0.5) * 720,
      rotY: isMobile ? 0 : (Math.random() - 0.5) * 720,
    };
  }), [actualCount, isMobile]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" style={{ perspective: "1000px" }}>
      {hearts.map((h) => (
        <motion.div
          key={`heart-${h.id}`}
          className={`absolute bottom-[-100px] text-rose-400 drop-shadow-[0_0_15px_rgba(251,113,133,0.5)] ${h.blur}`}
          style={{ left: `${h.left}%`, fontSize: h.size, opacity: 0, willChange: "transform, opacity" }}
          animate={{
            y: h.y, x: h.x, rotateZ: h.rotZ, rotateX: h.rotX, rotateY: h.rotY,
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: "linear" }}
        >
          {h.emoji}
        </motion.div>
      ))}
    </div>
  );
});
