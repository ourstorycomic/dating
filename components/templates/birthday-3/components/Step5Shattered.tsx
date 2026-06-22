"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { MEGA_DATA } from "../config";

export function Step5Shattered({ onNext, autoPlay }: { onNext: () => void, autoPlay?: boolean }) {
  const [pieces, setPieces] = useState([
    { id: 1, x: -100, y: -120, rot: -30, snapped: false },
    { id: 2, x: 120, y: -60, rot: 45, snapped: false },
    { id: 3, x: -40, y: 140, rot: 15, snapped: false },
  ]);
  
  const [merged, setMerged] = useState(false);

  const p1 = useAnimation();
  const p2 = useAnimation();
  const p3 = useAnimation();
  const controls = [p1, p2, p3];

  useEffect(() => {
    if (autoPlay && !merged) {
      const t = setTimeout(async () => {
        await Promise.all([
          p1.start({ x: 0, y: 0, rotate: 0, transition: { duration: 1.5, ease: "easeInOut" } }),
          p2.start({ x: 0, y: 0, rotate: 0, transition: { duration: 1.5, ease: "easeInOut" } }),
          p3.start({ x: 0, y: 0, rotate: 0, transition: { duration: 1.5, ease: "easeInOut" } }),
        ]);
        setMerged(true);
        setTimeout(onNext, 2000);
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [autoPlay, merged, p1, p2, p3, onNext]);

  const handleDragEnd = (index: number, info: any) => {
    const dist = Math.hypot(info.point.x - window.innerWidth / 2, info.point.y - window.innerHeight / 2);
    // Simple heuristic: if offset is close to center
    if (Math.abs(info.offset.x) < 50 && Math.abs(info.offset.y) < 50) {
      controls[index].start({ x: 0, y: 0, rotate: 0 });
      setPieces(prev => {
        const newP = [...prev];
        newP[index].snapped = true;
        if (newP.every(p => p.snapped)) {
          setTimeout(() => {
            setMerged(true);
            setTimeout(onNext, 2000);
          }, 500);
        }
        return newP;
      });
    } else {
      // Bounce back or stay? Let's just let it be where it was dragged, but if close to center, snap it.
      // Wait, info.offset is relative to where it started dragging.
      // Let's use a simpler approach: just snap if they let go near the center.
      // To keep it simple, we just check if it's close to 0,0.
      // Actually, since it's framer motion, we can just check the motion value or event.
    }
  };

  // Better approach for dragging to center:
  const checkSnap = (index: number, x: number, y: number) => {
    if (Math.abs(x) < 40 && Math.abs(y) < 40) {
      controls[index].start({ x: 0, y: 0, rotate: 0 });
      setPieces(prev => {
        const newP = [...prev];
        newP[index].snapped = true;
        if (newP.every(p => p.snapped)) {
          setTimeout(() => {
            setMerged(true);
            setTimeout(onNext, 2000);
          }, 500);
        }
        return newP;
      });
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] pointer-events-none" />

      {/* Pedestal */}
      <div className="absolute bottom-[20%] w-[200px] h-[40px] bg-neutral-800 rounded-t-full border-t border-blue-500/30 shadow-[0_-10px_40px_rgba(59,130,246,0.1)]" />

      <div className="relative w-[150px] h-[200px] mt-[-100px]">
        {/* Core glow when merged */}
        <motion.div 
          className="absolute inset-0 bg-blue-400 rounded-full blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: merged ? 1 : 0, scale: merged ? 2 : 1 }}
          transition={{ duration: 1 }}
        />

        {/* Piece 1: Top Left */}
        <motion.div
          drag={!pieces[0].snapped && !autoPlay}
          dragMomentum={false}
          onDragEnd={(e, info) => checkSnap(0, info.offset.x + pieces[0].x, info.offset.y + pieces[0].y)}
          animate={controls[0]}
          initial={{ x: pieces[0].x, y: pieces[0].y, rotate: pieces[0].rot }}
          className="absolute top-0 left-0 w-full h-full cursor-grab active:cursor-grabbing z-20"
          style={{ clipPath: "polygon(50% 50%, 0 0, 100% 0, 100% 30%)", backgroundImage: "linear-gradient(135deg, rgba(96,165,250,0.8), rgba(37,99,235,0.6))", backdropFilter: "blur(10px)" }}
        >
           <div className="w-full h-full border-t-2 border-l-2 border-blue-200/50" />
        </motion.div>

        {/* Piece 2: Right */}
        <motion.div
          drag={!pieces[1].snapped && !autoPlay}
          dragMomentum={false}
          onDragEnd={(e, info) => checkSnap(1, info.offset.x + pieces[1].x, info.offset.y + pieces[1].y)}
          animate={controls[1]}
          initial={{ x: pieces[1].x, y: pieces[1].y, rotate: pieces[1].rot }}
          className="absolute top-0 left-0 w-full h-full cursor-grab active:cursor-grabbing z-20"
          style={{ clipPath: "polygon(50% 50%, 100% 30%, 100% 100%, 70% 100%)", backgroundImage: "linear-gradient(45deg, rgba(59,130,246,0.8), rgba(29,78,216,0.6))", backdropFilter: "blur(10px)" }}
        >
           <div className="w-full h-full border-r-2 border-b-2 border-blue-300/50" />
        </motion.div>

        {/* Piece 3: Bottom Left */}
        <motion.div
          drag={!pieces[2].snapped && !autoPlay}
          dragMomentum={false}
          onDragEnd={(e, info) => checkSnap(2, info.offset.x + pieces[2].x, info.offset.y + pieces[2].y)}
          animate={controls[2]}
          initial={{ x: pieces[2].x, y: pieces[2].y, rotate: pieces[2].rot }}
          className="absolute top-0 left-0 w-full h-full cursor-grab active:cursor-grabbing z-20"
          style={{ clipPath: "polygon(50% 50%, 70% 100%, 0 100%, 0 0)", backgroundImage: "linear-gradient(225deg, rgba(147,197,253,0.8), rgba(59,130,246,0.6))", backdropFilter: "blur(10px)" }}
        >
           <div className="w-full h-full border-l-2 border-b-2 border-blue-100/50" />
        </motion.div>
      </div>

      {!merged && (
        <motion.p 
          className="absolute bottom-32 text-blue-200/70 tracking-widest text-sm font-medium animate-pulse"
        >
          {MEGA_DATA.shatteredInstruction}
        </motion.p>
      )}
    </motion.div>
  );
}
