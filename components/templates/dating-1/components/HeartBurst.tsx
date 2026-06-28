"use client";

import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";

export const HeartBurst = memo(function HeartBurst({ trigger }: { trigger: number }) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (trigger === 0) return null;
  
  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden" key={trigger}>
      {Array.from({ length: isMobile ? 10 : 24 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 200 + Math.random() * 300;
        const emojis = ["💖", "🌸", "✨", "🥰", "🎉", "💕"];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const size = 30 + Math.random() * 30;
        return (
          <motion.div
            key={`burst-${trigger}-${i}`}
            className="absolute"
            style={{ fontSize: size, willChange: "transform, opacity" }}
            initial={{ opacity: 1, scale: 0.2, x: 0, y: 0 }}
            animate={{ 
              opacity: [1, 1, 0], 
              scale: [0.5, 1.2, 0.5], 
              x: Math.cos(angle) * velocity, 
              y: Math.sin(angle) * velocity + 200
            }}
            transition={{ duration: 1.2 + Math.random() * 0.5, ease: "easeOut" }}
          >
            {emoji}
          </motion.div>
        );
      })}
    </div>
  );
});
