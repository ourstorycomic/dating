"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";

export const GlowingDust = memo(function GlowingDust() {
  const dusts = useMemo(() => Array.from({ length: 40 }).map((_, i) => {
    const isBubble = Math.random() > 0.7;
    const isPink = Math.random() > 0.5;
    return {
      id: i,
      isBubble,
      isPink,
      width: isBubble ? 12 + Math.random() * 20 : 4,
      left: Math.random() * 100,
      top: Math.random() * 100,
      y: -100 - Math.random() * 150,
      x: (Math.random() - 0.5) * 80,
      duration: 3 + Math.random() * 5,
      delay: -(Math.random() * 10),
    };
  }), []);

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
