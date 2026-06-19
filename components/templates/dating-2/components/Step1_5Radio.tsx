import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TPL_DATA } from "../config";

export function Step1_5Radio({ onNext, audioRef , customData = {}}: { onNext: () => void, audioRef: React.RefObject<HTMLAudioElement> , customData?: any}) {
  const [clicked, setClicked] = useState(false);
  const [notes, setNotes] = useState<{id: number, left: number, delay: number}[]>([]);

  useEffect(() => {
    if (clicked) {
        // Generate random music notes
        const newNotes = Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            left: 20 + Math.random() * 60, // random start X %
            delay: Math.random() * 2 // random start delay
        }));
        setNotes(newNotes);
    }
  }, [clicked]);

  const activateRadio = () => {
    if(clicked) return;
    setClicked(true);
    if(audioRef.current) {
        audioRef.current.play().catch(()=>{});
    }
    setTimeout(() => {
        onNext();
    }, 4000); // Tăng thời gian nghe nhạc chill một chút trước khi chuyển
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0 z-10 flex items-center justify-center p-4">
      
      {/* Floating Music Notes */}
      <AnimatePresence>
        {clicked && notes.map(note => (
            <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
                animate={{ opacity: [0, 1, 0], y: -150 - Math.random() * 100, x: (Math.random() - 0.5) * 100, scale: [0.5, 1.2, 0.8] }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: note.delay, ease: "linear" }}
                className="absolute z-20 text-pink-500 drop-shadow-md"
                style={{ left: `${note.left}%`, bottom: '45%' }}
            >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    {note.id % 2 === 0 ? (
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    ) : (
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    )}
                </svg>
            </motion.div>
        ))}
      </AnimatePresence>

      <div 
        className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105 active:scale-95 z-30" 
        onClick={activateRadio}
      >
        <motion.div 
            animate={clicked ? { rotate: [-1, 1, -1], y: [-3, 3, -3] } : { y: [0, -10, 0] }}
            transition={clicked ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className={`relative drop-shadow-2xl ${clicked ? 'glow rounded-[40px]' : ''}`}
        >
            <svg width="240" height="200" viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Antenna */}
                <path d="M190 60 L220 10" stroke="#9ca3af" strokeWidth="6" strokeLinecap="round" />
                <circle cx="220" cy="10" r="6" fill="#cbd5e1" />
                
                {/* Handle */}
                <path d="M60 50 C60 20, 180 20, 180 50" stroke="#f472b6" strokeWidth="16" strokeLinecap="round" />
                
                {/* Body */}
                <rect x="20" y="50" width="200" height="130" rx="30" fill="#fbcfe8" stroke="#f472b6" strokeWidth="6" />
                <rect x="20" y="50" width="200" height="110" rx="30" fill="#fce7f3" />
                
                {/* Speaker Grill */}
                <circle cx="80" cy="115" r="40" fill="#f9a8d4" />
                <circle cx="80" cy="115" r="30" fill="#f472b6" />
                <circle cx="80" cy="115" r="10" fill="#be185d" opacity="0.5" />
                <path d="M60 115 H100 M80 95 V135 M65 100 L95 130 M65 130 L95 100" stroke="#be185d" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
                
                {/* Dial Screen */}
                <rect x="140" y="70" width="60" height="30" rx="10" fill="#fef08a" stroke="#fbbf24" strokeWidth="3" />
                <path d="M150 85 L190 85" stroke="#fbbf24" strokeWidth="2" />
                <rect x="165" y="75" width="4" height="20" rx="2" fill="#ef4444" />
                
                {/* Knobs */}
                <circle cx="155" cy="130" r="12" fill="#f472b6" />
                <circle cx="155" cy="130" r="6" fill="#f9a8d4" />
                <circle cx="185" cy="130" r="12" fill="#f472b6" />
                <circle cx="185" cy="130" r="6" fill="#f9a8d4" />
                
                {/* Decorative Heart */}
                <path d="M200 170 C200 170 195 160 190 165 C185 170 190 180 190 180 C190 180 195 185 200 180 C205 175 200 170 200 170 Z" fill="#ec4899" />
            </svg>
        </motion.div>
        
        <p className="mt-10 text-pink-600 font-bold heartbeat text-lg bg-white/60 px-6 py-2 rounded-full shadow-sm z-30">
            {(customData.radioHint || TPL_DATA.radioHint)}
        </p>
      </div>
    </motion.div>
  );
}
