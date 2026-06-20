import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; scale: number; duration: number; type: "flower" | "star" }>>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100 + 100, // Start below screen
        scale: Math.random() * 0.8 + 0.4,
        duration: Math.random() * 8 + 8, // 8-16s
        type: Math.random() > 0.5 ? ("flower" as const) : ("star" as const),
      }));
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: "100%", x: `${p.x}vw` }}
          animate={{ 
            opacity: [0, 0.6, 0], 
            y: "-20%", 
            x: [`${p.x}vw`, `${p.x + (Math.random() * 10 - 5)}vw`] 
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
          className="absolute"
          style={{ scale: p.scale }}
        >
          {p.type === "flower" ? "🌸" : "✨"}
        </motion.div>
      ))}
    </div>
  );
}
