"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// ── Warm/romantic shapes for light background ──
const ROMANTIC_SHAPES = [
  `<svg viewBox="0 0 20 24" fill="currentColor"><ellipse cx="10" cy="14" rx="7" ry="10" transform="rotate(-20 10 14)"/></svg>`,
  `<svg viewBox="0 0 20 24" fill="currentColor"><ellipse cx="10" cy="12" rx="6" ry="11"/></svg>`,
  `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 17s-7-5.4-7-10a5 5 0 0110 0 5 5 0 0110 0c0 4.6-7 10-7 10z"/></svg>`,
  `<svg viewBox="0 0 20 20" fill="currentColor"><polygon points="10,2 12.3,7.5 18,8.1 13.9,12 15.4,18 10,14.8 4.6,18 6.1,12 2,8.1 7.7,7.5"/></svg>`,
  `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 2l1.5 6H18l-5.3 3.8 2 6.2L10 14.3l-4.7 3.7 2-6.2L2 8h6.5z"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>`,
];

// ── Cool/cinematic shapes for dark background ──
const CINEMA_SHAPES = [
  `<svg viewBox="0 0 20 20" fill="currentColor"><polygon points="10,2 12.3,7.5 18,8.1 13.9,12 15.4,18 10,14.8 4.6,18 6.1,12 2,8.1 7.7,7.5"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M4.2 19.8l2.8-2.8M17 7l2.8-2.8"/></svg>`,
  `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 2l1.5 6H18l-5.3 3.8 2 6.2L10 14.3l-4.7 3.7 2-6.2L2 8h6.5z"/></svg>`,
  `<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="2"/></svg>`,
  `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0L9.5 5.5L15 7L9.5 8.5L8 14L6.5 8.5L1 7L6.5 5.5z"/></svg>`,
];

const ROMANTIC_COLORS = [
  "text-rose-300", "text-pink-300", "text-pink-400",
  "text-red-300", "text-fuchsia-300", "text-violet-300",
  "text-yellow-300", "text-orange-200",
];

const CINEMA_COLORS = [
  "text-rose-400/60", "text-pink-400/50", "text-fuchsia-500/40",
  "text-violet-400/50", "text-white/30", "text-cyan-400/30",
  "text-rose-300/40", "text-amber-400/30",
];

type Particle = {
  id: number;
  shapeIdx: number;
  colorClass: string;
  x: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  rotation: number;
  spinSpeed: number;
  spinDir: 1 | -1;
};

function makeParticles(count: number, cinema: boolean): Particle[] {
  const shapes = cinema ? CINEMA_SHAPES : ROMANTIC_SHAPES;
  const colors = cinema ? CINEMA_COLORS : ROMANTIC_COLORS;
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    shapeIdx:   Math.floor(Math.random() * shapes.length),
    colorClass: colors[Math.floor(Math.random() * colors.length)],
    x:          Math.random() * 100,
    size:       cinema
                  ? Math.random() * 8 + 4   // smaller in cinema
                  : Math.random() * 14 + 7,
    duration:   Math.random() * 14 + 10,
    delay:      Math.random() * 20,
    driftX:     (Math.random() - 0.5) * 140,
    rotation:   Math.random() * 360,
    spinSpeed:  Math.random() * 2 + 0.5,
    spinDir:    Math.random() > 0.5 ? 1 : -1,
  }));
}

export function FloatingParticles({
  fullWidth = false,
  cinema = false,
}: {
  fullWidth?: boolean;
  cinema?: boolean;
}) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    let count = cinema ? 35 : (fullWidth ? 65 : 45);
    if (isMobile) {
      count = Math.min(count, 15);
    }
    setParticles(makeParticles(count, cinema));
  }, [fullWidth, cinema, isMobile]);

  if (particles.length === 0) return null;

  const shapes = cinema ? CINEMA_SHAPES : ROMANTIC_SHAPES;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Ambient glows */}
      {cinema ? (
        <>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-rose-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-fuchsia-900/15 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-56 h-56 bg-violet-900/10 rounded-full blur-3xl translate-x-1/3" />
        </>
      ) : (
        <>
          <div className="absolute top-0 left-0 w-64 h-64 bg-rose-400/15 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
          <div className="absolute top-0 right-0 w-52 h-52 bg-pink-300/12 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-rose-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-36 h-36 bg-fuchsia-400/8 rounded-full blur-2xl" />
          <div className="absolute top-1/3 right-1/5 w-28 h-28 bg-pink-300/10 rounded-full blur-2xl" />
        </>
      )}

      {particles.map(p => (
        <motion.div
          key={p.id}
          className={`absolute select-none ${p.colorClass}`}
          style={{
            left:   `${p.x}%`,
            bottom: "-2rem",
            width:  p.size,
            height: p.size,
            rotate: p.rotation,
          }}
          animate={{
            y:       [0, -(Math.random() * 350 + 380)],
            x:       [0, p.driftX * 0.35, p.driftX],
            opacity: cinema
              ? [0, 0.55, 0.55, 0]
              : [0, 0.8, 0.8, 0],
            rotate:  [p.rotation, p.rotation + 360 * p.spinSpeed * p.spinDir],
            scale:   [0.3, 1, 0.85, 0.15],
          }}
          transition={{
            duration: p.duration,
            repeat:   Infinity,
            delay:    p.delay,
            ease:     "easeOut",
            times:    [0, 0.08, 0.82, 1],
          }}
          dangerouslySetInnerHTML={{ __html: shapes[p.shapeIdx] }}
        />
      ))}
    </div>
  );
}
