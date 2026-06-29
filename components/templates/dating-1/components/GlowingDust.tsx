"use client";

import { memo, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

export const GlowingDust = memo(function GlowingDust() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) return null;

  const dusts = useMemo(() => Array.from({ length: isMobile ? 12 : 40 }).map((_, i) => {
    const isBubble = Math.random() > 0.7;
    const isPink = Math.random() > 0.5;
    return {
      id: i,
      isBubble,
      isPink,
      width: isBubble ? 12 + Math.random() * 20 : 4,
      left: Math.random() * 100,
      top: Math.random() * 100,
      y: isMobile ? -50 - Math.random() * 100 : -100 - Math.random() * 150,
      x: isMobile ? (Math.random() - 0.5) * 30 : (Math.random() - 0.5) * 80,
      duration: isMobile ? 5 + Math.random() * 5 : 3 + Math.random() * 5,
      delay: -(Math.random() * 10),
    };
  }), [isMobile]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {dusts.map((d) => (
        <motion.div
          key={`dust-${d.id}`}
          className={`absolute rounded-full ${d.isBubble ? 'bg-white/30 border border-white/60' : d.isPink ? 'bg-pink-300 shadow-[0_0_12px_#f9a8d4]' : 'bg-white shadow-[0_0_12px_#fff]'}`}
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.width, height: d.width, willChange: "transform, opacity" }}
          animate={{
            opacity: d.isBubble ? [0, 0.8, 0] : [0, 0.6, 0],
            scale: [0.5, 1.5, 0.5],
            y: [0, d.y],
            x: [0, d.x]
          }}
          transition={{ duration: d.duration, repeat: Infinity, delay: d.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
});
