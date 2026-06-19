import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TPL_DATA } from "../config";

export function Step2Vibe({ onNext , customData = {}}: { onNext: () => void , customData?: any}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  const checkVibe = (index: number) => {
    if(selectedOpt !== null) return;
    setSelectedOpt(index);
    setShowTooltip(true);
    setTimeout(() => {
        setShowTooltip(false);
        onNext();
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4">
      <h3 className="text-3xl font-bold text-pink-600 mb-10 text-center px-4 letter-font drop-shadow-md whitespace-pre-line">{(customData.vibeTitle || TPL_DATA.vibeTitle)}</h3>
      <div className="flex flex-col gap-5 w-8/12 z-10">
        {(customData.vibeOptions || TPL_DATA.vibeOptions).map((opt: string, i: number) => (
            <button 
                key={i} 
                className={`py-4 rounded-full shadow-lg border-2 font-bold transition-all text-lg ${
                    selectedOpt === i 
                    ? 'bg-pink-500 text-white border-pink-500 scale-110 shadow-[0_0_20px_rgba(236,72,153,0.6)]' 
                    : 'bg-white/90 border-pink-200 text-pink-600 hover:scale-105 active:scale-95'
                }`} 
                onClick={() => checkVibe(i)}
            >
                {opt}
            </button>
        ))}
      </div>
      <AnimatePresence>
        {showTooltip && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-white/40 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: -20 }} className="bg-pink-500 text-white px-8 py-6 rounded-3xl shadow-2xl text-center font-bold text-xl pointer-events-none drop-shadow-md border-4 border-pink-300">
                    {(customData.vibeTooltip || TPL_DATA.vibeTooltip)}
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
