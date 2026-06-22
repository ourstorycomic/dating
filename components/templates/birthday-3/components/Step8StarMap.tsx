"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MEGA_DATA } from "../config";

export function Step8StarMap({ onNext, autoPlay }: { onNext: () => void, autoPlay?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Cake shape: base left, base right, middle left, middle right, top (candle)
  const stars = [
    { id: 0, x: 100, y: 500 },
    { id: 1, x: 300, y: 500 },
    { id: 2, x: 100, y: 400 },
    { id: 3, x: 300, y: 400 },
    { id: 4, x: 200, y: 300 }, // candle
  ];

  const targetLines = [
    [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 4]
  ];

  const [connectedLines, setConnectedLines] = useState<number[][]>([]);
  const [activePath, setActivePath] = useState<{ x: number, y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastStar, setLastStar] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (autoPlay && !completed) {
      let step = 0;
      const sequence = [0, 1, 3, 2, 0, 2, 4, 3];
      const interval = setInterval(() => {
        if (step < sequence.length - 1) {
          const from = sequence[step];
          const to = sequence[step+1];
          // Check if line exists
          setConnectedLines(prev => {
            const exists = prev.find(l => (l[0]===from && l[1]===to) || (l[0]===to && l[1]===from));
            if (!exists) return [...prev, [from, to]];
            return prev;
          });
          step++;
        } else {
          clearInterval(interval);
          setCompleted(true);
          setTimeout(onNext, 2500);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [autoPlay, completed, onNext]);

  useEffect(() => {
    if (!autoPlay && connectedLines.length >= targetLines.length && !completed) {
      setCompleted(true);
      setTimeout(onNext, 2500);
    }
  }, [connectedLines, targetLines.length, completed, autoPlay, onNext]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (autoPlay || completed) return;
    setIsDrawing(true);
    updatePath(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || autoPlay || completed) return;
    updatePath(e);
  };

  const handlePointerUp = () => {
    if (autoPlay || completed) return;
    setIsDrawing(false);
    setActivePath([]);
    setLastStar(null);
  };

  const updatePath = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setActivePath([{ x: lastStar !== null ? stars[lastStar].x : x, y: lastStar !== null ? stars[lastStar].y : y }, { x, y }]);

    // Check collision with stars
    const hitStar = stars.find(s => Math.hypot(s.x - x, s.y - y) < 30);
    if (hitStar) {
      if (lastStar === null) {
        setLastStar(hitStar.id);
        setActivePath([{ x: hitStar.x, y: hitStar.y }, { x, y }]);
      } else if (lastStar !== hitStar.id) {
        // Add line
        const exists = connectedLines.find(l => (l[0] === lastStar && l[1] === hitStar.id) || (l[0] === hitStar.id && l[1] === lastStar));
        if (!exists) {
          setConnectedLines(prev => [...prev, [lastStar, hitStar.id]]);
        }
        setLastStar(hitStar.id);
        setActivePath([{ x: hitStar.x, y: hitStar.y }, { x, y }]);
      }
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className="absolute inset-0 z-10 bg-indigo-950 overflow-hidden touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 1 } }}
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 pointer-events-none" />

      {/* SVG for lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {connectedLines.map((line, i) => {
          const s1 = stars[line[0]];
          const s2 = stars[line[1]];
          return (
            <motion.line 
              key={i}
              x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y}
              stroke="#fcd34d" strokeWidth="4"
              filter="url(#glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          );
        })}

        {isDrawing && activePath.length === 2 && (
          <line 
            x1={activePath[0].x} y1={activePath[0].y} x2={activePath[1].x} y2={activePath[1].y}
            stroke="#fcd34d" strokeWidth="2" strokeDasharray="4"
          />
        )}
      </svg>

      {/* Stars */}
      {stars.map((s) => (
        <motion.div 
          key={s.id}
          className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-amber-100 shadow-[0_0_15px_rgba(251,191,36,0.8)] z-30"
          style={{ left: s.x, top: s.y }}
          animate={{ scale: completed ? [1, 1.5, 1] : [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 + s.id * 0.2 }}
        />
      ))}

      {/* Cake details when completed */}
      {completed && (
        <motion.div 
          className="absolute inset-0 pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Base */}
          <div className="absolute left-[100px] top-[400px] w-[200px] h-[100px] bg-gradient-to-b from-amber-200/20 to-amber-500/10 backdrop-blur-sm border-x border-b border-amber-300/50" />
          {/* Flame */}
          <motion.div 
            className="absolute left-[200px] top-[260px] w-4 h-8 -ml-2 rounded-[50%] bg-orange-400 blur-[2px] shadow-[0_0_20px_rgba(249,115,22,1)]"
            animate={{ scale: [1, 1.2, 1], y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />
        </motion.div>
      )}

      {!completed && (
        <motion.p 
          className="absolute bottom-20 w-full text-center text-amber-200/70 tracking-widest text-sm font-medium animate-pulse"
        >
          {MEGA_DATA.starMapInstruction}
        </motion.p>
      )}
    </motion.div>
  );
}
