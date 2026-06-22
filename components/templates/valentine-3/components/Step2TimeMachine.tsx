import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

export function Step2TimeMachine({ startDate, onNext, autoPlay = false }: { startDate: string; onNext: () => void; autoPlay?: boolean }) {
  const [days, setDays] = useState(0);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    // Show next button after 3 seconds
    const timer = setTimeout(() => {
      setShowNext(true);
      if (autoPlay) {
        setTimeout(onNext, 1500);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [autoPlay, onNext]);

  useEffect(() => {
    const targetDate = new Date(startDate).getTime();
    
    const updateTime = () => {
      const now = new Date().getTime();
      const diff = now - targetDate;
      
      if (diff > 0) {
        setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
        setTime({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 text-center"
    >
      <h3 className="text-2xl font-bold text-rose-500 mb-10 leading-snug drop-shadow-sm">
        Đã bao lâu kể từ ngày <br /> trái tim lỡ nhịp?
      </h3>

      <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/60 w-full max-w-sm">
        {/* Number Ticker for Days */}
        <div className="flex items-baseline justify-center gap-2 mb-6">
          <NumberTicker value={days} className="text-6xl font-black text-rose-600 drop-shadow-md" />
          <span className="text-xl font-bold text-rose-400">Ngày</span>
        </div>

        {/* Realtime HMS */}
        <div className="flex justify-center gap-4 text-rose-500 font-semibold text-lg">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold bg-white/60 px-3 py-1 rounded-xl min-w-[3rem] shadow-sm">{time.hours.toString().padStart(2, '0')}</span>
            <span className="text-xs uppercase mt-1 opacity-80">Giờ</span>
          </div>
          <span className="text-3xl font-bold self-start mt-1">:</span>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold bg-white/60 px-3 py-1 rounded-xl min-w-[3rem] shadow-sm">{time.minutes.toString().padStart(2, '0')}</span>
            <span className="text-xs uppercase mt-1 opacity-80">Phút</span>
          </div>
          <span className="text-3xl font-bold self-start mt-1">:</span>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold bg-white/60 px-3 py-1 rounded-xl min-w-[3rem] shadow-sm">{time.seconds.toString().padStart(2, '0')}</span>
            <span className="text-xs uppercase mt-1 opacity-80">Giây</span>
          </div>
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showNext ? 1 : 0, y: showNext ? 0 : 20 }}
        onClick={onNext}
        disabled={!showNext}
        className="mt-16 group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold rounded-full shadow-[0_10px_20px_rgba(244,63,94,0.3)] hover:scale-105 active:scale-95 transition-all overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out" />
        <span>Hành trình bắt đầu</span>
        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );
}

// Simple internal NumberTicker
function NumberTicker({ value, className }: { value: number, className?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / value));
    let timer: NodeJS.Timeout;

    const run = () => {
      start += Math.ceil(value / 50);
      if (start >= value) {
        setDisplayValue(value);
      } else {
        setDisplayValue(start);
        timer = setTimeout(run, stepTime);
      }
    };

    if (value > 0) run();
    
    return () => clearTimeout(timer);
  }, [value]);

  return <span className={className}>{displayValue}</span>;
}
