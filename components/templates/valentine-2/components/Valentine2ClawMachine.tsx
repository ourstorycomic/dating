"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useAnimation, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { FloatingParticles } from "./FloatingParticles";
import { playClick, playCoin } from "./soundFX";

type GameStep = "insert" | "play" | "dropping" | "miss" | "success";

const HIT_TOLERANCE = 14;
// Glass box effective width: card(340) - px-3 padding(24) = 316px
const GLASS_W = 316;
// Convert percentage position to actual pixels for Framer Motion x transform
// (FM x% = % of element's OWN width, not parent, so we must use px)
const pxX = (pct: number) => (pct / 100) * GLASS_W - 20;

// Eggs shifted right so they don't overlap the chute on the left
const EGGS = [
  { id: 1, x: 35, gradientClass: "from-blue-400 to-indigo-500",    rotation: -12 },
  { id: 2, x: 75, gradientClass: "from-pink-400 to-rose-500",      rotation:   4 },
];
// X % inside glass box where the chute opening center is
const CHUTE_X = 9;

function playMissSound(compact?: boolean) {
  if (compact) return;
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AC(); const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.45, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.22);
  } catch (_) {}
}

function playSuccessSound(compact?: boolean) {
  if (compact) return;
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AC(); const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.setValueAtTime(554, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
  } catch (_) {}
}

export function Valentine2ClawMachine({ onEggGrabbed, autoPlay = false, compact }: { onEggGrabbed: (colorClass: string) => void; autoPlay?: boolean; compact?: boolean }) {
  const [step,          setStep]          = useState<GameStep>("insert");
  const [clawX,         setClawX]         = useState(50);
  const [showMiss,      setShowMiss]      = useState(false);
  const [isAnimating,   setIsAnimating]   = useState(false);
  const [grabbedEggId,  setGrabbedEggId]  = useState<number | null>(null);
  // clawCarrying: egg is ON the claw (between grab and drop into chute)
  const [clawCarrying,  setClawCarrying]  = useState(false);
  // eggInChute: egg has been dropped into the prize compartment
  const [eggInChute,    setEggInChute]    = useState(false);

  const clawControls = useAnimation();
  const coinControls = useAnimation();
  const slotRef         = useRef<HTMLDivElement>(null);
  const coinRef         = useRef<HTMLDivElement>(null);
  const moveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clawXRef        = useRef(50); // mirror of clawX for use inside intervals

  const grabbedEgg = EGGS.find(e => e.id === grabbedEggId);

  // Sync clawX → pixel position animation while in play mode
  useEffect(() => {
    if (step !== "play") return;
    clawXRef.current = clawX;
    clawControls.start({
      x: pxX(clawX), y: 0,
      transition: { type: "spring", stiffness: 320, damping: 12 },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clawX, step]);

  useEffect(() => {
    if (!autoPlay) return;
    
    if (step === "insert") {
      const t = setTimeout(() => {
        try { coinControls.start({ scale: 0, opacity: 0, transition: { duration: 0.15 } }); } catch (e) {}
        setStep("play");
      }, 1500);
      return () => clearTimeout(t);
    } else if (step === "play") {
      const t = setTimeout(() => {
        setClawX(25);
        setTimeout(() => grabEgg(), 800);
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [autoPlay, step, coinControls]);

  // ── Coin insert ──
  const coinX = useMotionValue(0);
  const coinY = useMotionValue(0);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const [isCoinDragging, setIsCoinDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (step !== "insert") return;
    setIsCoinDragging(true);
    dragStartRef.current = { x: e.clientX - coinX.get() * getScale(), y: e.clientY - coinY.get() * getScale() };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const getScale = () => {
    if (!coinRef.current) return 1;
    const parent = coinRef.current.closest('.template-preview-surface') as HTMLElement;
    return parent ? parent.getBoundingClientRect().width / parent.offsetWidth : 1;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isCoinDragging) return;
    const scale = getScale();
    coinX.set((e.clientX - dragStartRef.current.x) / scale);
    coinY.set((e.clientY - dragStartRef.current.y) / scale);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isCoinDragging) return;
    setIsCoinDragging(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

    if (!slotRef.current || !coinRef.current) return;
    const slotR = slotRef.current.getBoundingClientRect();
    const coinR = coinRef.current.getBoundingClientRect();
    const dist  = Math.hypot(
      (coinR.left + coinR.width / 2)  - (slotR.left + slotR.width / 2),
      (coinR.top  + coinR.height / 2) - (slotR.top  + slotR.height / 2),
    );

    if (dist < 110) {
      playCoin(compact && !autoPlay);
      try { coinControls.start({ scale: 0, opacity: 0, transition: { duration: 0.15 } }); } catch(e) {}
      setTimeout(() => setStep("play"), 180);
    } else {
      animate(coinX, 0, { type: "spring", stiffness: 320, damping: 22 });
      animate(coinY, 0, { type: "spring", stiffness: 320, damping: 22 });
    }
  };

  // ── Move (single tap) ──
  const moveClaw = useCallback((dir: -1 | 1) => {
    if (step !== "play" || isAnimating) return;
    playClick(compact && !autoPlay);
    setClawX(prev => {
      const next = Math.max(5, Math.min(90, prev + dir * 8));
      clawXRef.current = next;
      return next;
    });
  }, [step, isAnimating]);

  // ── Hold-to-move: start continuous movement ──
  const startMoving = useCallback((dir: -1 | 1) => {
    if (step !== "play" || isAnimating) return;
    moveClaw(dir); // immediate first move
    moveIntervalRef.current = setInterval(() => {
      setClawX(prev => {
        const next = Math.max(5, Math.min(90, prev + dir * 8));
        clawXRef.current = next;
        return next;
      });
    }, 130);
  }, [step, isAnimating, moveClaw]);

  // ── Release (onPointerUp): stop interval + 1 swing ──
  const stopMoving = useCallback((dir: -1 | 1) => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
    if (step !== "play") return;
    const deg = dir * 12;
    try {
      clawControls.start({
        rotate: [0, deg, 0],
        transition: { duration: 0.45, times: [0, 0.5, 1], ease: "easeInOut" },
      });
    } catch(e) {}
  }, [step, clawControls]);

  // ── Leave (onPointerLeave): only stop interval, NO animation ──
  const clearMoving = useCallback(() => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  }, []);

  // ── Grab → carry → drop into chute ──
  const grabEgg = useCallback(async () => {
    if (step !== "play" || isAnimating) return;
    setIsAnimating(true);
    setStep("dropping");

    try {
      const nearest = EGGS.reduce((best, egg) =>
        Math.abs(egg.x - clawX) < Math.abs(best.x - clawX) ? egg : best
      );
      const isHit = autoPlay || Math.abs(nearest.x - clawX) <= HIT_TOLERANCE;

      // 1) Drop down
      await clawControls.start({ y: 148, transition: { duration: 0.85, ease: "easeIn" } });

      if (isHit) {
        // 2) Snap horizontally to egg (px)
        await clawControls.start({ x: pxX(nearest.x), transition: { duration: 0.15 } });
        // 3) Close claws & show egg on claw
        setGrabbedEggId(nearest.id);
        setClawCarrying(true);
        await new Promise<void>(r => setTimeout(r, 300));

        // 4) Pull up with egg
        await clawControls.start({ y: 0, transition: { duration: 0.9, ease: "easeOut" } });

        // 5) Glide to above chute (px)
        await clawControls.start({
          x: pxX(CHUTE_X),
          transition: { duration: 0.85, ease: "easeInOut", delay: 0.1 },
        });

        // 6) Lower into chute
        await clawControls.start({ y: 110, transition: { duration: 0.55, ease: "easeIn" } });

        // 7) Open claws → egg drops
        setClawCarrying(false);
        setEggInChute(true);
        playSuccessSound(compact && !autoPlay);
        await new Promise<void>(r => setTimeout(r, 350));

        // 8) Pull claw back up
        await clawControls.start({ y: 0, transition: { duration: 0.6, ease: "easeOut" } });
        await new Promise<void>(r => setTimeout(r, 400));

        // 9) Success!
        setIsAnimating(false);
        setStep("success");
        setTimeout(() => onEggGrabbed(nearest.gradientClass), 1600);

      } else {
        // MISS
        await clawControls.start({ y: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.3 } });
        await clawControls.start({
          x: [pxX(clawX), pxX(clawX+5), pxX(clawX-5), pxX(clawX)],
          transition: { duration: 0.35, times: [0, 0.33, 0.66, 1] },
        });
        await clawControls.start({ x: pxX(50), transition: { duration: 0.5 } });
        playMissSound(compact && !autoPlay);
        setShowMiss(true);
        setStep("miss");
        await new Promise<void>(r => setTimeout(r, 1000));
        setShowMiss(false);
        setClawX(50);
        setStep("play");
        setIsAnimating(false);
      }
    } catch (e) {
      console.log("Animation interrupted");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, isAnimating, clawX, clawControls, onEggGrabbed, autoPlay]);

  // Claws CLOSED when claw is carrying an egg
  const clawClosed = clawCarrying;
  const guideStep  = step === "insert" ? 0 : step === "play" ? 1 : 2;

  return (
    <motion.div
      initial={{ y: -500, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center p-3 bg-slate-900/80 backdrop-blur-sm"
    >
      <FloatingParticles />
      <div className="w-full max-w-[340px] bg-indigo-950 rounded-3xl shadow-[0_0_50px_rgba(236,72,153,0.3)] border-4 border-pink-500 flex flex-col items-center relative z-10">

        {/* Header */}
        <div className="w-full bg-pink-500 text-white text-center py-2 font-black tracking-widest uppercase rounded-t-[calc(1.5rem-4px)] shadow-[0_0_15px_rgba(236,72,153,0.8)]">
          ❤️ Love Catcher ❤️
        </div>

        {/* Guide bar */}
        <div className="w-full bg-indigo-900/60 flex items-center justify-around px-4 py-1.5">
          {[{ icon: "🪙", label: "Nhét xu" }, { icon: "⬅️➡️", label: "Di chuyển" }, { icon: "🎯", label: "GẮP!" }].map((g, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
              <motion.div
                animate={i === guideStep ? { scale: [1, 1.25, 1], opacity: 1 } : { scale: 1, opacity: 0.3 }}
                transition={{ repeat: i === guideStep ? Infinity : 0, duration: 1.1 }}
                className="text-sm"
              >{g.icon}</motion.div>
              <span className={`text-[9px] font-bold ${i === guideStep ? "text-yellow-300" : "text-slate-500"}`}>{g.label}</span>
              <motion.div animate={{ opacity: i === guideStep ? 1 : 0 }} className="w-1 h-1 rounded-full bg-yellow-400" />
            </div>
          ))}
        </div>

        {/* Glass play box */}
        <div className="w-full px-3 pt-2">
          <div className="w-full h-56 bg-cyan-950/40 border-4 border-cyan-400/30 rounded-xl relative overflow-hidden shadow-inner">
            <FloatingParticles cinema={true} />

            {/* MISS flash */}
            <AnimatePresence>
              {showMiss && (
                <motion.div key="miss"
                  initial={{ opacity: 0 }} animate={{ opacity: [0, 0.8, 0.5, 0.8, 0] }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.75, times: [0, 0.15, 0.4, 0.7, 1] }}
                  className="absolute inset-0 z-30 bg-red-500/40 flex items-center justify-center pointer-events-none rounded-lg"
                >
                  <motion.span
                    initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: [0.4, 1.4, 1], opacity: [0, 1, 1] }}
                    transition={{ duration: 0.35 }}
                    className="text-white font-black text-4xl select-none"
                    style={{ textShadow: "0 0 24px #ff4444, 0 2px 8px #000" }}
                  >💨 TẠCH!</motion.span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rail */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-slate-800 z-10" />

            {/* Claw — initial at center in pixels */}
            <motion.div
              animate={clawControls}
              initial={{ x: pxX(50), y: 0 }}
              className="absolute top-4 w-10 flex flex-col items-center z-20"
            >
              <div className="w-0.5 bg-slate-400/60 absolute bottom-full h-56 origin-bottom" />
              <div className="w-8 h-5 bg-yellow-400 rounded-t-lg shadow-md z-10" />
              <div className="relative w-10 h-8 flex justify-between -mt-1">
                <motion.div animate={{ rotate: clawClosed ? -15 : 30 }} transition={{ type: "spring", stiffness: 220, damping: 18 }} className="w-1.5 h-10 bg-slate-300 rounded-full origin-top" />
                <motion.div animate={{ rotate: clawClosed ? 15 : -30 }} transition={{ type: "spring", stiffness: 220, damping: 18 }} className="w-1.5 h-10 bg-slate-300 rounded-full origin-top" />
              </div>
              {/* Egg on claw while carrying */}
              <AnimatePresence>
                {clawCarrying && grabbedEgg && (
                  <motion.div
                    key="egg-on-claw"
                    initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: 30 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`absolute top-8 w-9 h-11 bg-gradient-to-br ${grabbedEgg.gradientClass} rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-lg z-0`}
                  >
                    <div className="absolute top-2 left-1.5 w-2.5 h-2.5 bg-white/60 rounded-full blur-[1px]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Eggs on floor */}
            <div className="absolute bottom-0 w-full z-0">
              {EGGS.map(egg => (
                <div key={egg.id}
                  className={`absolute w-12 h-14 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-br ${egg.gradientClass} shadow-[inset_-5px_-5px_10px_rgba(0,0,0,0.3)] border-2 border-white/20 transition-opacity duration-300`}
                  style={{
                    left: `${egg.x}%`, bottom: "-10px",
                    transform: `rotate(${egg.rotation}deg) translateX(-50%)`,
                    opacity: egg.id === grabbedEggId ? 0 : 1,
                  }}
                >
                  <div className="absolute top-2 left-2 w-3 h-3 bg-white/60 rounded-full blur-[1px]" />
                </div>
              ))}
            </div>

            {/* ── Glass Prize Compartment (chute) ── */}
            <div className="absolute bottom-0 left-0 w-[22%] h-[52%] z-10">
              {/* Glass walls */}
              <div
                className="absolute inset-0 rounded-tr-xl border-r-2 border-t-2 border-cyan-300/50"
                style={{
                  background: "linear-gradient(135deg, rgba(8,145,178,0.15) 0%, rgba(6,182,212,0.08) 100%)",
                  backdropFilter: "blur(2px)",
                  boxShadow: "inset 0 0 12px rgba(103,232,249,0.1), 2px 0 8px rgba(0,0,0,0.3)",
                }}
              />
              {/* Glass sheen */}
              <div className="absolute top-1 left-1 w-2 h-8 bg-white/10 rounded-full" />
              {/* Label */}
              <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                <span className="text-cyan-400/60 text-[8px] font-bold tracking-widest">🎁</span>
              </div>
              {/* Opening slot indicator at top */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-cyan-400/40 rounded-full" />

              {/* Egg inside chute after drop */}
              <AnimatePresence>
                {eggInChute && grabbedEgg && (
                  <motion.div
                    key="egg-in-chute"
                    initial={{ y: -60, opacity: 0, scale: 0.7 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-10 bg-gradient-to-br ${grabbedEgg.gradientClass} rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[0_0_12px_rgba(236,72,153,0.5)]`}
                  >
                    <div className="absolute top-1.5 left-1.5 w-2 h-2 bg-white/60 rounded-full blur-[1px]" />
                    {/* Success sparkle */}
                    <motion.div
                      animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="absolute -top-2 -right-2 text-lg"
                    >✨</motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Bottom panel */}
        <div className="w-full px-3 pt-2 pb-3">
          <AnimatePresence mode="wait">

            {/* Coin slot */}
            {step === "insert" && (
              <motion.div key="coin-panel"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="w-full bg-indigo-900/70 rounded-2xl border-2 border-yellow-400/30 p-3"
              >
                <p className="text-yellow-300 text-[10px] font-bold text-center tracking-widest mb-2 uppercase">
                  🪙 Kéo xu bỏ vào khe để chơi!
                </p>
                <div className="flex items-center justify-between px-2">
                  {/* Coin — z-50 on wrapper so it floats above slot when dragged */}
                  <div className="relative z-50">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.85 }}
                      className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm pointer-events-none select-none">👆</motion.div>
                    <motion.div
                      ref={coinRef}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      style={{ x: coinX, y: coinY, touchAction: "none" }}
                      animate={coinControls} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }}
                      className="w-16 h-16 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-full shadow-[0_8px_24px_rgba(234,179,8,0.55)] border-4 border-yellow-200 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
                    >
                      <span className="text-yellow-900 font-black text-[10px]">1 XU</span>
                    </motion.div>
                  </div>
                  {/* Arrow */}
                  <motion.div animate={{ x: [0, 6, 0], opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 0.75 }}
                    className="text-yellow-400 text-2xl font-black select-none z-10">→</motion.div>
                  {/* Slot — lower z so coin can overlap it */}
                  <div className="flex flex-col items-center gap-1 z-10">
                    <span className="text-yellow-300/70 text-[8px] font-bold tracking-widest uppercase">Khe xu</span>
                    <div ref={slotRef} className="w-5 h-14 rounded-full bg-black border-2 border-yellow-500/70 relative overflow-hidden"
                      style={{ boxShadow: "0 0 14px rgba(250,204,21,0.55), inset 0 0 8px rgba(0,0,0,0.8)" }}>
                      <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.1 }}
                        className="absolute inset-0 rounded-full bg-yellow-400/25" />
                    </div>
                    <span className="text-yellow-400/60 text-[10px]">🪙</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Controls */}
            {step !== "insert" && (
              <motion.div key="controls-panel"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="w-full grid grid-cols-2 gap-3"
              >
                <div className="flex flex-col items-center gap-1.5 bg-indigo-900/60 rounded-2xl p-2 border border-indigo-700/50">
                  <div className="text-pink-300 font-bold text-[10px] tracking-wider">DI CHUYỂN</div>
                  <div className="flex gap-2">
                    <button
                      onPointerDown={() => startMoving(-1)}
                      onPointerUp={() => stopMoving(-1)}
                      onPointerLeave={clearMoving}
                      disabled={step !== "play"}
                      className="w-11 h-11 bg-slate-700 active:bg-slate-600 active:scale-95 rounded-full flex items-center justify-center text-lg shadow-md disabled:opacity-40 transition-all select-none touch-none"
                    >⬅️</button>
                    <button
                      onPointerDown={() => startMoving(1)}
                      onPointerUp={() => stopMoving(1)}
                      onPointerLeave={clearMoving}
                      disabled={step !== "play"}
                      className="w-11 h-11 bg-slate-700 active:bg-slate-600 active:scale-95 rounded-full flex items-center justify-center text-lg shadow-md disabled:opacity-40 transition-all select-none touch-none"
                    >➡️</button>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1.5 bg-indigo-900/60 rounded-2xl p-2 border border-indigo-700/50">
                  <div className="text-pink-300 font-bold text-[10px] tracking-wider">GẮP</div>
                  <button onClick={() => { playClick(compact && !autoPlay); grabEgg(); }} disabled={step !== "play"}
                    className="w-full h-11 bg-gradient-to-r from-pink-500 to-rose-500 active:scale-95 rounded-full text-white font-black shadow-[0_4px_0_#9f1239] active:shadow-none active:translate-y-1 transition-all disabled:opacity-40 disabled:grayscale text-sm">
                    GẮP! 🎯
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status hint */}
        <div className="h-6 -mt-1 flex items-center justify-center pb-2">
          <AnimatePresence mode="wait">
            {showMiss && (
              <motion.p key="h-miss" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-yellow-300 text-[11px] font-bold">Hụt rồi~ Căn lại thử nào! 🐣</motion.p>
            )}
            {step === "play" && !showMiss && (
              <motion.p key="h-play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-pink-300 text-[11px] font-semibold">Căn móc vào trứng rồi GẮP!</motion.p>
            )}
            {eggInChute && step !== "play" && (
              <motion.p key="h-chute" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="text-green-300 text-[12px] font-black">🎉 Thả vào rồi!</motion.p>
            )}
            {step === "success" && (
              <motion.p key="h-win" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="text-yellow-300 text-[12px] font-black animate-pulse">✨ Gắp thành công!</motion.p>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}
