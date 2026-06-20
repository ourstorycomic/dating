import { motion, useAnimation } from "framer-motion";
import { Fingerprint } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Step1Fingerprint({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const isHolding = useRef(false);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    isHolding.current = true;
    let currentProgress = progress;
    const interval = 20; // 20ms steps
    const step = 100 / (2000 / interval); // 100% over 2 seconds

    holdTimer.current = setInterval(() => {
      if (!isHolding.current) {
        if (holdTimer.current) clearInterval(holdTimer.current);
        return;
      }
      currentProgress += step;
      if (currentProgress >= 100) {
        currentProgress = 100;
        if (holdTimer.current) clearInterval(holdTimer.current);
        onComplete();
      }
      setProgress(currentProgress);
    }, interval);
  };

  const endHold = () => {
    isHolding.current = false;
    if (holdTimer.current) clearInterval(holdTimer.current);
    // Decrease progress when released
    const interval = 20;
    let currentProgress = progress;
    holdTimer.current = setInterval(() => {
      if (isHolding.current) {
        if (holdTimer.current) clearInterval(holdTimer.current);
        return;
      }
      currentProgress -= 5;
      if (currentProgress <= 0) {
        currentProgress = 0;
        if (holdTimer.current) clearInterval(holdTimer.current);
      }
      setProgress(currentProgress);
    }, interval);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (holdTimer.current) clearInterval(holdTimer.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10"
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl font-extrabold text-pink-500 mb-3 drop-shadow-sm">Nhật Ký Tình Yêu</h2>
        <p className="text-pink-400 font-medium">Chạm và giữ để xác thực nhịp tim 💓</p>
      </div>

      <div className="relative flex items-center justify-center w-48 h-48">
        {/* Progress Circle SVG */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
          <circle
            cx="96"
            cy="96"
            r="80"
            fill="transparent"
            stroke="#ffe4e6"
            strokeWidth="8"
          />
          <circle
            cx="96"
            cy="96"
            r="80"
            fill="transparent"
            stroke="#f43f5e"
            strokeWidth="8"
            strokeDasharray={502} // 2 * pi * 80
            strokeDashoffset={502 - (502 * progress) / 100}
            strokeLinecap="round"
            className="transition-all duration-75 ease-linear"
          />
        </svg>

        {/* Fingerprint Button */}
        <motion.button
          onPointerDown={startHold}
          onPointerUp={endHold}
          onPointerLeave={endHold}
          // Support for touch devices
          onTouchStart={startHold}
          onTouchEnd={endHold}
          animate={{ scale: isHolding.current ? 0.95 : 1 }}
          className="relative w-32 h-32 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.4)] cursor-pointer touch-none select-none"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 rounded-full bg-pink-400/30 blur-md"
          />
          <Fingerprint size={64} className="text-white drop-shadow-lg z-10" />
        </motion.button>
      </div>
      
      <p className="mt-12 text-sm text-pink-400/70 font-semibold animate-pulse">
        {progress > 0 ? "Đang xác thực..." : "Waiting for fingerprint..."}
      </p>
    </motion.div>
  );
}
