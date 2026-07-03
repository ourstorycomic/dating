import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { TPL_DATA } from "../config";

export function Step3Scratch({ onNext, customData = {}, autoPlay }: { onNext: () => void; customData?: any; autoPlay?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [revealed, setRevealed] = useState(false);
  const revealedRef = useRef(false); // stable ref for callbacks inside useEffect

  // ── Draw the scratch layer ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    canvas.width = canvas.parentElement!.clientWidth;
    canvas.height = canvas.parentElement!.clientHeight;

    // Silver gradient scratch layer
    ctx.globalCompositeOperation = "source-over";
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#d1d5db");
    gradient.addColorStop(0.5, "#f3f4f6");
    gradient.addColorStop(1, "#9ca3af");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 18px 'Poppins', sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦  CÀO LỚP BẠC NHÉ  ✦", canvas.width / 2, canvas.height / 2);

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 38;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []); // only on mount — re-runs handled via revealed gate

  // ── Check reveal threshold ─────────────────────────────────────────────────
  const checkAndReveal = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (revealedRef.current) return;
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 16) if (pixels[i] < 10) transparent++;
    if (transparent / (pixels.length / 16) > 0.75) {
      doReveal(canvas);
    }
  };

  const doReveal = (canvas: HTMLCanvasElement) => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setRevealed(true);
    canvas.style.transition = "opacity 0.8s ease";
    canvas.style.opacity = "0";
    // Confetti
    const cc = confetti.create(document.getElementById("confetti-canvas") as HTMLCanvasElement, { resize: true });
    cc({ particleCount: 60, spread: 70, origin: { y: 0.8 }, zIndex: 100 });
    // SFX
    const audio = new Audio("/assets/vfx/you-found-bojuka_2.mp3");
    audio.play().catch(() => {});
  };

  // ── Manual scratch (mouse + touch) ─────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    let isDrawing = false;

    const getPos = (e: any) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clientX = e.touches?.[0]?.clientX ?? e.clientX ?? 0;
      const clientY = e.touches?.[0]?.clientY ?? e.clientY ?? 0;
      return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    };

    const start = (e: any) => {
      if (revealedRef.current) return;
      isDrawing = true;
      const p = getPos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      e.preventDefault();
    };
    const move = (e: any) => {
      if (!isDrawing || revealedRef.current) return;
      const p = getPos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      checkAndReveal(ctx, canvas);
      e.preventDefault();
    };
    const end = () => { isDrawing = false; };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", end);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", end);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
    };
  }, []);

  // ── Auto-play: animate scratch strokes via rAF ─────────────────────────────
  useEffect(() => {
    if (!autoPlay || revealedRef.current) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    // Wait 2s then animate scratch rows from left→right
    const startDelay = setTimeout(() => {
      const W = canvas.width;
      const H = canvas.height;
      const rows = 6;          // number of scratch strokes
      const rowH = H / rows;
      const speed = W / 25;    // pixels per frame ~60fps → ~25 frames to cross full width
      let row = 0;
      let x = 10;

      const animate = () => {
        if (revealedRef.current) return;

        // Move the "finger" across the current row
        const y = rowH * row + rowH / 2;
        if (row === 0 && x === 10) {
          ctx.beginPath();
          ctx.moveTo(x, y);
        }
        ctx.lineTo(x + speed, y);
        ctx.stroke();
        x += speed;

        if (x >= W - 10) {
          // Row done — start next row
          row++;
          x = 10;
          if (row < rows) {
            ctx.beginPath();
            ctx.moveTo(x, rowH * row + rowH / 2);
          } else {
            // All rows done → reveal
            doReveal(canvas);
            return;
          }
        }

        checkAndReveal(ctx, canvas);
        if (!revealedRef.current) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, 2000);

    return () => clearTimeout(startDelay);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  // ── Auto-advance after reveal ──────────────────────────────────────────────
  useEffect(() => {
    if (!autoPlay || !revealed) return;
    // Wait for confetti + SFX to play, then advance
    const t = setTimeout(() => onNext(), 2200);
    return () => clearTimeout(t);
  }, [autoPlay, revealed, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-10 flex items-center justify-center p-4"
    >
      <div className="glass-panel w-11/12 max-w-md rounded-3xl p-8 relative flex flex-col items-center shadow-2xl text-center bg-white/40">
        <h3 className="text-2xl font-bold text-pink-600 drop-shadow-md mb-2">
          {customData.scratchTitle || TPL_DATA.scratchTitle}
        </h3>
        <p className="text-gray-700 mb-8 font-medium">
          {customData.scratchSubtitle || TPL_DATA.scratchSubtitle}
        </p>

        <div className="relative w-full h-36 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(255,105,180,0.4)] border-4 border-pink-300 bg-white flex items-center justify-center">
          {/* Prize underneath */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-pink-50 p-4 z-0">
            <span className="text-pink-600 font-bold text-lg mb-1 heartbeat">🎉 Bất ngờ chưa 🎉</span>
            <span className="text-pink-600 font-bold text-center text-xl mt-2 drop-shadow-sm leading-relaxed whitespace-pre-line">
              {customData.scratchPrize || TPL_DATA.scratchPrize}
            </span>
          </div>
          {/* Scratch canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-pointer z-10 touch-none"
          />
        </div>

        <AnimatePresence>
          {revealed && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onNext}
              className="mt-10 px-8 py-3 bg-pink-500 text-white font-bold rounded-full shadow-lg hover:bg-pink-600 transition-all"
            >
              {customData.scratchBtn || TPL_DATA.scratchBtn}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
