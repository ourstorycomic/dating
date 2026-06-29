"use client";

import { memo, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

export const FloatingClouds = memo(function FloatingClouds() {
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

  const clouds = useMemo(() => Array.from({ length: isMobile ? 2 : 5 }).map((_, i) => ({
    id: i,
    width: 200 + Math.random() * 200,
    height: 80 + Math.random() * 80,
    top: 10 + Math.random() * 70,
    durationX: isMobile ? 40 + Math.random() * 40 : 30 + Math.random() * 30,
    delayX: -(Math.random() * 30),
    durationY: 10 + Math.random() * 10,
  })), [isMobile]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-50">
      {clouds.map((c) => (
        <motion.div
          key={`cloud-${c.id}`}
          className="absolute bg-white/50 blur-[20px] rounded-full"
          style={{ width: c.width, height: c.height, top: `${c.top}%`, left: `-400px`, willChange: "transform" }}
          animate={{ x: ['0vw', '150vw'], y: [0, -30, 0, 30, 0] }}
          transition={{
            x: { duration: c.durationX, repeat: Infinity, ease: "linear", delay: c.delayX },
            y: { duration: c.durationY, repeat: Infinity, ease: "easeInOut" }
          }}
        />
      ))}
    </div>
  );
});
