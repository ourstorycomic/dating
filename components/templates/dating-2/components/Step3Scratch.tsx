import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { TPL_DATA } from "../config";

export function Step3Scratch({ onNext , customData = {}}: { onNext: () => void , customData?: any}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = canvas.parentElement!.clientWidth;
    canvas.height = canvas.parentElement!.clientHeight;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#d1d5db');
    gradient.addColorStop(0.5, '#f3f4f6');
    gradient.addColorStop(1, '#9ca3af');
    
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = "bold 20px 'Poppins', sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("CÀO LỚP BẠC NHÉ", canvas.width / 2, canvas.height / 2);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 35;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let isDrawing = false;
    const getPos = (e: any) => {
      const rect = canvas.getBoundingClientRect();
      let x = e.clientX, y = e.clientY;
      if (e.touches && e.touches.length > 0) { x = e.touches[0].clientX; y = e.touches[0].clientY; }
      return { x: x - rect.left, y: y - rect.top };
    };

    const start = (e: any) => { if (revealed) return; isDrawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); e.preventDefault(); };
    const move = (e: any) => { if (!isDrawing || revealed) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); check(); e.preventDefault(); };
    const end = () => { isDrawing = false; };

    const check = () => {
      const pixels = ctx.getImageData(0,0,canvas.width,canvas.height).data;
      let trans = 0;
      for (let i = 3; i < pixels.length; i += 16) if (pixels[i] < 10) trans++;
      if (trans / (pixels.length/16) > 0.8 && !revealed) {
        setRevealed(true);
        canvas.style.transition = 'opacity 0.8s ease';
        canvas.style.opacity = '0';
        
        const myConfetti = confetti.create(document.getElementById('confetti-canvas') as HTMLCanvasElement, { resize: true });
        myConfetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, zIndex: 100 });
      }
    };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start, {passive: false});
    canvas.addEventListener('touchmove', move, {passive: false});
    window.addEventListener('touchend', end);

    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);
    };
  }, [revealed]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="absolute inset-0 z-10 flex items-center justify-center p-4">
      <div className="glass-panel w-11/12 max-w-md rounded-3xl p-8 relative flex flex-col items-center shadow-2xl text-center bg-white/40">
        <h3 className="text-2xl font-bold text-pink-600 drop-shadow-md mb-2">{(customData.scratchTitle || TPL_DATA.scratchTitle)}</h3>
        <p className="text-gray-700 mb-8 font-medium">{(customData.scratchSubtitle || TPL_DATA.scratchSubtitle)}</p>

        <div className="relative w-full h-36 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(255,105,180,0.4)] border-4 border-pink-300 bg-white flex items-center justify-center">
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-pink-50 p-4 z-0">
            <span className="text-pink-600 font-bold text-lg mb-1 heartbeat">🎉 Bất ngờ chưa 🎉</span>
            <span className="text-pink-600 font-bold text-center text-xl mt-2 drop-shadow-sm leading-relaxed whitespace-pre-line">{(customData.scratchPrize || TPL_DATA.scratchPrize)}</span>
          </div>
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-pointer z-10 touch-none"></canvas>
        </div>

        <AnimatePresence>
          {revealed && (
            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={onNext} className="mt-10 px-8 py-3 bg-pink-500 text-white font-bold rounded-full shadow-lg hover:bg-pink-600 transition-all">
              {(customData.scratchBtn || TPL_DATA.scratchBtn)}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
