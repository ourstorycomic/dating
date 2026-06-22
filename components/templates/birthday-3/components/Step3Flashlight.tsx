"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { MEGA_DATA } from "../config";
import { Power } from "lucide-react";

export function Step3Flashlight({ onNext, autoPlay }: { onNext: () => void, autoPlay?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 200);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 400);
  
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const [found, setFound] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);

  useEffect(() => {
    if (autoPlay) {
      // Simulate moving flashlight and clicking switch
      const t1 = setTimeout(() => {
        mouseX.set(300);
        mouseY.set(100);
      }, 1000);
      
      const t2 = setTimeout(() => {
        setFound(true);
        setLightsOn(true);
      }, 3000);

      const t3 = setTimeout(onNext, 4500);

      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [autoPlay, mouseX, mouseY, onNext]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (lightsOn || autoPlay) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };

  const turnOnLights = () => {
    if (lightsOn) return;
    setFound(true);
    setLightsOn(true);
    setTimeout(onNext, 1500);
  };

  return (
    <motion.div 
      ref={containerRef}
      className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center z-10 overflow-hidden"
      onPointerMove={handlePointerMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "brightness(2)", transition: { duration: 1.2 } }}
    >
      {/* Background that will be revealed */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518991669955-9c7e78ec80ca?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
      
      {/* Switch Button (always in a fixed spot, say top right) */}
      <div className="absolute top-20 right-16 z-20">
        <button 
          onClick={turnOnLights}
          className={`w-16 h-20 rounded-xl bg-neutral-800 border-2 border-neutral-700 shadow-xl flex items-center justify-center flex-col gap-2 transition-all duration-300 ${lightsOn ? 'bg-amber-100 border-amber-300 shadow-[0_0_50px_rgba(251,191,36,0.8)]' : 'hover:bg-neutral-700'}`}
        >
          <div className={`w-8 h-10 rounded shadow-inner flex items-center justify-center ${lightsOn ? 'bg-gradient-to-b from-amber-300 to-amber-500 translate-y-[-4px]' : 'bg-gradient-to-b from-neutral-600 to-neutral-900 translate-y-[4px]'}`}>
            <Power className={`w-4 h-4 ${lightsOn ? 'text-amber-900' : 'text-neutral-500'}`} />
          </div>
        </button>
      </div>

      {/* Dark Overlay with Flashlight Mask */}
      <motion.div 
        className="absolute inset-0 bg-black z-10 pointer-events-none"
        animate={{ opacity: lightsOn ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        style={{
          maskImage: `radial-gradient(circle 120px at var(--x) var(--y), transparent 0%, black 100%)`,
          WebkitMaskImage: `radial-gradient(circle 120px at var(--x) var(--y), transparent 0%, black 100%)`,
          // @ts-ignore
          "--x": useSpring(springX, { stiffness: 100 }),
          "--y": useSpring(springY, { stiffness: 100 })
        }}
      />

      {/* Lights On Flash */}
      <motion.div 
        className="absolute inset-0 bg-white z-30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: lightsOn ? [0, 1, 0] : 0 }}
        transition={{ duration: 0.8, times: [0, 0.2, 1] }}
      />

      <motion.div 
        className="absolute bottom-20 z-20 pointer-events-none"
        animate={{ opacity: lightsOn ? 0 : 1 }}
      >
        <p className="text-neutral-500 tracking-widest text-sm font-medium animate-pulse">
          {MEGA_DATA.flashlightInstruction}
        </p>
      </motion.div>
    </motion.div>
  );
}
