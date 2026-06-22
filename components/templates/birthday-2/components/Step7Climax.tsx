"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Ticket } from "lucide-react";

export function Step7Climax({ autoPlay = false, onNext }: { autoPlay?: boolean; onNext?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const myConfetti = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true
    });

    const duration = 5000;
    const end = Date.now() + duration;

    const frame = () => {
      myConfetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981']
      });
      myConfetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    if (autoPlay && onNext) {
      const t = setTimeout(() => onNext(), 7000); // Wait for confetti and then loop
      return () => clearTimeout(t);
    }
  }, [autoPlay, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 z-50 overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)] pointer-events-none" />

      <motion.div
        initial={{ y: 100, rotate: -5 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.5, delay: 0.5 }}
        className="w-full max-w-[320px] bg-gradient-to-b from-amber-200 to-amber-100 rounded-3xl p-8 shadow-[0_20px_50px_rgba(251,191,36,0.3)] relative z-20 border-4 border-amber-300 flex flex-col items-center"
      >
        <div className="absolute -top-10 w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center shadow-lg border-4 border-indigo-900">
          <Ticket className="w-10 h-10 text-indigo-900" />
        </div>

        <h2 className="mt-8 text-2xl font-black text-amber-900 text-center mb-2 tracking-wide uppercase">Voucher Đặc Quyền</h2>
        <div className="w-full h-px border-t-2 border-dashed border-amber-400/50 my-4" />
        
        <p className="text-center font-bold text-lg text-amber-800 leading-relaxed mb-6">
          "Tặng cậu 1 vé ăn sập thành phố đêm nay do tớ bao trọn gói!"
        </p>

        <motion.button
          animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px rgba(0,0,0,0)", "0 0 20px rgba(251,191,36,0.6)", "0 0 0px rgba(0,0,0,0)"] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-full py-4 rounded-xl bg-indigo-900 text-amber-300 font-black text-xl uppercase tracking-wider hover:bg-indigo-800 transition-colors"
          onClick={() => {
            // Usually we'd handle the final action here
            alert("Đã chốt kèo!");
          }}
        >
          Lên đồ thôi! 🛵
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
