"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Step6Awakening({ onNext }: { onNext: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1000); // Start shaking
    const t2 = setTimeout(() => setStage(2), 3000); // Shatter and reveal
    const t3 = setTimeout(onNext, 6000); // Go to next
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onNext]);

  return (
    <motion.div 
      className="absolute inset-0 z-10 overflow-hidden bg-neutral-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      {/* Background Sunset (Revealed at stage 2) */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-orange-800 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 2 ? 1 : 0 }}
        transition={{ duration: 2 }}
      />

      {/* The shattering dark room */}
      <AnimatePresence>
        {stage < 2 && (
          <motion.div 
            className="absolute inset-0 bg-neutral-950 z-10 flex items-center justify-center"
            animate={stage === 1 ? {
              x: [-10, 10, -10, 10, -5, 5, -2, 2, 0],
              y: [-5, 5, -5, 5, -2, 2, -1, 1, 0],
            } : {}}
            transition={{ duration: 2, ease: "linear" }}
            exit={{ opacity: 0, scale: 1.5, filter: "brightness(2) blur(10px)", transition: { duration: 1 } }}
          >
             {/* Bright light from center before shatter */}
             <motion.div 
               className="absolute w-20 h-20 bg-white rounded-full blur-xl"
               animate={{ scale: stage === 1 ? [1, 2, 5, 20] : 1, opacity: stage === 1 ? [0.5, 1] : 0 }}
               transition={{ duration: 2 }}
             />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating particles (Stars/Dust) */}
      {stage >= 2 && (
        <div className="absolute inset-0 z-20 pointer-events-none">
           {[...Array(20)].map((_, i) => (
             <motion.div 
               key={i}
               className="absolute w-1 h-1 bg-white rounded-full"
               style={{
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`,
               }}
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: [0, 1, 0], y: -100 }}
               transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
             />
           ))}
        </div>
      )}

    </motion.div>
  );
}
