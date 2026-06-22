"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MEGA_DATA } from "../config";
import { ChevronUp } from "lucide-react";

export function Step7Ascension({ onNext, autoPlay }: { onNext: () => void, autoPlay?: boolean }) {
  const steps = MEGA_DATA.ascensionSteps;
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (autoPlay) {
      let step = 0;
      const interval = setInterval(() => {
        step += 1;
        setCurrentStep(step);
        if (step >= steps.length) {
          clearInterval(interval);
          setTimeout(onNext, 2000);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, steps.length, onNext]);

  const handleNext = () => {
    if (currentStep >= steps.length) return;
    const newStep = currentStep + 1;
    setCurrentStep(newStep);
    if (newStep >= steps.length) {
      setTimeout(onNext, 2000);
    }
  };

  const yOffset = currentStep * 150;

  return (
    <motion.div 
      className="absolute inset-0 z-10 overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-900 to-orange-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50, transition: { duration: 1 } }}
    >
      <motion.div 
        className="relative w-full h-full"
        animate={{ y: yOffset }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
         {/* Stairs & Keywords */}
         {steps.map((word, index) => {
           // As currentStep increases, yOffset increases (moves container down).
           // So steps should be positioned higher up (negative Y) so they come into view.
           const topPos = -index * 150 + 400; 
           const isActive = currentStep >= index;

           return (
             <div key={index} className="absolute w-full flex flex-col items-center" style={{ top: topPos }}>
               <AnimatePresence>
                 {isActive && (
                   <motion.div 
                     initial={{ opacity: 0, y: 50, scale: 0.8 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     transition={{ duration: 0.8, ease: "easeOut" }}
                     className="flex flex-col items-center"
                   >
                     {/* The glowing word */}
                     <h3 className="text-3xl font-serif text-amber-100 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)] mb-8 tracking-widest uppercase">
                       {word}
                     </h3>
                     
                     {/* The step (glass platform) */}
                     <div className="w-[200px] h-[20px] bg-white/10 backdrop-blur-md rounded-[100%] border border-white/30 shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_2px_10px_rgba(255,255,255,0.2)]" />
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
           );
         })}
      </motion.div>

      {/* Button */}
      {currentStep < steps.length && !autoPlay && (
        <motion.button 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center text-amber-200 hover:text-white transition-colors"
          onClick={handleNext}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronUp className="w-8 h-8 drop-shadow-md" />
          <span className="text-sm font-bold tracking-widest uppercase mt-2 drop-shadow-md">Bước Tiếp</span>
        </motion.button>
      )}

    </motion.div>
  );
}
