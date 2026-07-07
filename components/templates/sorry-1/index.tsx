"use client";
import { MediaDisplay } from "@/components/ui/MediaDisplay";


import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Frown, HandHeart, RefreshCcw, ScrollText, CheckCircle2, XCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { APOLOGY_DATA } from "./config";
import { TemplateNavigator } from "../TemplateNavigator";

// --- BACKGROUND PARTICLES ---
function FloatingParticles() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const p = Array.from({ length: isMobile ? 10 : 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    }));
    setParticles(p);
  }, [isMobile]);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute bg-[#ffffff] rounded-full opacity-30"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// --- STEP 1: BREAK THE ICE ---
function Step1Ice({ onNext, autoPlay, config, isMuted }: { onNext: () => void; autoPlay: boolean; config: any; isMuted: boolean }) {
  const [cracks, setCracks] = useState(0);
  const crackAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (autoPlay && cracks < 3) {
      const t = setInterval(() => {
        setCracks(c => Math.min(c + 1, 3));
        if (crackAudioRef.current && !isMuted) {
          crackAudioRef.current.currentTime = 0;
          crackAudioRef.current.play().catch(() => {});
        }
      }, 300);
      return () => clearInterval(t);
    }
  }, [autoPlay, cracks, isMuted]);

  useEffect(() => {
    if (cracks >= 3) {
      const t = setTimeout(onNext, autoPlay ? 100 : 500);
      return () => clearTimeout(t);
    }
  }, [cracks, autoPlay, onNext]);

  const handleTap = () => {
    if (cracks < 3) {
      setCracks(c => Math.min(c + 1, 3));
      if (crackAudioRef.current && !isMuted) {
        crackAudioRef.current.currentTime = 0;
        crackAudioRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <>
      <audio ref={crackAudioRef} src="/assets/vfx/glass-break.mp3" preload="auto" muted={isMuted} />
      <motion.div
      key="step1"
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center cursor-pointer z-10"
      onClick={handleTap}
    >
      <div className="absolute inset-0 bg-white/20 backdrop-blur-md pointer-events-none" />
      
      {/* CSS/SVG Cracks based on state */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50" preserveAspectRatio="none">
        {cracks > 0 && <polyline points="0,0 150,200 200,400 100,600 300,800" stroke="white" strokeWidth="2" fill="none" />}
        {cracks > 1 && <polyline points="400,0 250,300 350,500 200,800" stroke="white" strokeWidth="3" fill="none" />}
        {cracks > 2 && <polyline points="0,400 200,400 400,600" stroke="white" strokeWidth="4" fill="none" />}
      </svg>

      <motion.div
        animate={cracks > 0 ? { x: [-10, 10, -10, 10, 0], y: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="relative z-10"
      >
        <img src="/assets/sad/rat-cute-cry.webp" className="w-32 h-32 object-contain mx-auto mb-4 drop-shadow-lg" alt="sad" />
        <h2 className="text-2xl font-bold text-slate-800 drop-shadow-md">
          {config?.iceTitle || "đang giận tớ lắm đúng không...?"}
        </h2>
        <p className="mt-4 text-slate-700 font-medium bg-white/40 px-4 py-2 rounded-full inline-block backdrop-blur-sm">
          {config?.iceSubtitle || "Bấm vào màn hình để đập vỡ lớp băng này nhé, lạnh quá..."}
        </p>
      </motion.div>
    </motion.div>
    </>
  );
}

// --- STEP 2: CONFESSION ---
function Step2Confession({ onNext, autoPlay, config }: { onNext: () => void; autoPlay: boolean; config: any }) {
  const [text, setText] = useState("");
  const fullText = config?.confessText || `Tớ biết tớ sai rồi. Tớ vô tâm, tớ hư, tớ đáng bị đòn...`;
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(t);
        setDone(true);
      }
    }, 50); // type speed
    return () => clearInterval(t);
  }, [fullText, autoPlay]);

  useEffect(() => {
    if (autoPlay && done) {
      const t = setTimeout(onNext, 1500);
      return () => clearTimeout(t);
    }
  }, [autoPlay, done, onNext]);

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10"
    >
      <motion.div
        animate={{ y: [-5, 5, -5], rotate: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="mb-8 relative"
      >
        <img src="/assets/sad/lots-of-tears-crying-hard.webp" className="w-40 h-40 object-contain drop-shadow-xl mx-auto" alt="crying" />
        <img src="/assets/sad/cat-blah.webp" className="absolute -bottom-4 -right-8 w-16 h-16 object-contain drop-shadow-md" alt="blah" />
      </motion.div>
      <div className="bg-white/60 p-6 rounded-2xl shadow-lg backdrop-blur-md border border-white/40 min-h-[150px] flex items-center justify-center w-full relative">
        <p className="text-lg font-medium text-slate-800 leading-relaxed">
          "{text}"<span className="animate-pulse">|</span>
        </p>
      </div>

      <AnimatePresence>
        {done && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onNext}
            className="mt-10 px-8 py-4 bg-pink-500 text-white rounded-full font-bold shadow-xl hover:scale-105 transition-transform"
          >
            {config?.confessBtn || "Đúng, cậu rất đáng đòn! 😡"}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- STEP 3: PENALTY WHEEL ---
function Step3Wheel({ onNext, autoPlay, config, isMuted }: { onNext: () => void; autoPlay: boolean; config: any; isMuted?: boolean }) {
  const options = [
    config?.wheelOpt1 || "Trà sữa 1 tuần", 
    config?.wheelOpt2 || "Đấm 3 cái", 
    config?.wheelOpt3 || "Rửa bát 1 tháng", 
    config?.wheelOpt4 || "Làm osin 1 ngày", 
    config?.wheelOpt5 || "Mua quà xịn", 
    config?.wheelOpt6 || "Bao đi ăn tối"
  ];
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const spinAudioRef = useRef<HTMLAudioElement>(null);
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    };
  }, []);

  const spin = () => {
    if (spinning || result) return;
    setSpinning(true);
    if (spinAudioRef.current && !autoPlay) {
      spinAudioRef.current.currentTime = 0;
      spinAudioRef.current.play().catch(() => {});
    }
    const spins = Math.floor(Math.random() * 10) + 15; // 15-25 full spins
    const targetIndex = Math.floor(Math.random() * options.length);
    const degreePerOpt = 360 / options.length;
    const finalRot = spins * 360 + targetIndex * degreePerOpt + (degreePerOpt / 2);
    
    setRotation(finalRot);
    
    spinTimeoutRef.current = setTimeout(() => {
      setSpinning(false);
      // Because we spun positively, the selected index is actually backwards
      // Or we can just randomly pick one and not worry about exact pointer math for now.
      setResult(options[options.length - 1 - targetIndex] || options[0]);
    }, 10000);
  };

  useEffect(() => {
    if (autoPlay) {
      const t1 = setTimeout(spin, 1000);
      return () => clearTimeout(t1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  useEffect(() => {
    if (autoPlay && result) {
      const t = setTimeout(onNext, 2500);
      return () => clearTimeout(t);
    }
  }, [autoPlay, result, onNext]);

  return (
    <>
    <audio ref={spinAudioRef} src="/assets/vfx/spinning-wheel.mp3" preload="auto" muted={isMuted} />
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10"
    >
      <img src="/assets/sad/tisramissu.webp" className="w-24 h-24 object-contain mx-auto mb-2 drop-shadow-md" alt="dumb" />
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{config?.wheelTitle || "Vòng Quay Đền Tội"}</h2>
      <p className="text-sm font-medium text-slate-600 mb-8 bg-white/50 p-2 rounded-xl backdrop-blur-sm">{config?.wheelSubtitle || "Trước khi tha lỗi, cho cậu quyền phạt tớ đấy! Quay đi, tớ chịu hết!"}</p>

      <div className="relative w-64 h-64 mb-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 z-20 text-rose-500 drop-shadow-md">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21l-12-18h24z"/></svg>
        </div>
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 10, ease: [0.2, 0.8, 0.2, 1] }}
          className="w-full h-full rounded-full border-4 border-slate-700 overflow-hidden relative shadow-2xl"
          style={{ background: "conic-gradient(#fecdd3 0 60deg, #fbcfe8 60deg 120deg, #fecdd3 120deg 180deg, #fbcfe8 180deg 240deg, #fecdd3 240deg 300deg, #fbcfe8 300deg 360deg)" }}
        >
          {options.map((opt, i) => {
            const rot = (360 / options.length) * i;
            return (
              <div
                key={opt}
                className="absolute inset-0 flex items-start justify-center pt-4 origin-center"
                style={{ transform: `rotate(${rot}deg)` }}
              >
                <span className="text-xs font-bold text-slate-800 w-16 text-center -rotate-90 origin-bottom">{opt}</span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {!result ? (
        <button
          onClick={spin}
          disabled={spinning}
          className="px-8 py-4 bg-rose-500 text-[#ffffff] rounded-full font-bold shadow-xl hover:bg-rose-600 transition-colors flex items-center gap-2"
        >
          <RefreshCcw className={spinning ? "animate-spin" : ""} /> {spinning ? "Đang quay..." : (config?.wheelBtn || "QUAY NGAY")}
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4">
          <div className="bg-white p-4 rounded-xl shadow-lg border border-rose-100 w-full">
            <p className="text-sm text-slate-500 font-semibold mb-1">Chốt kèo phạt:</p>
            <p className="text-xl font-black text-rose-600">{result}</p>
          </div>
          <button
            onClick={onNext}
            className="px-8 py-3 bg-pink-500 text-[#ffffff] rounded-full font-bold shadow-xl hover:scale-105 transition-transform"
          >
            {config?.wheelNextBtn || "Tạm bớt giận 👉"}
          </button>
        </motion.div>
      )}
    </motion.div>
    </>
  );
}

// --- STEP 4: NOSTALGIA ---
function Step4Nostalgia({ onNext, autoPlay, config }: { onNext: () => void; autoPlay: boolean; config: any }) {
  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(onNext, 2500);
      return () => clearTimeout(t);
    }
  }, [autoPlay, onNext]);

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10"
    >
      <div className="relative w-full h-[300px] mb-12">
        {[config?.memory1, config?.memory2, config?.memory3].filter(Boolean).length > 0 
          ? [config?.memory1, config?.memory2, config?.memory3].filter(Boolean).map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, rotate: (i - 1) * -15 }}
              animate={{ opacity: 1, y: 0, rotate: (i - 1) * 10 }}
              transition={{ delay: i * 0.5, type: "spring" }}
              className="absolute top-0 w-40 h-48 bg-white p-2 pb-8 shadow-2xl rounded-sm border border-slate-200"
              style={{ left: `calc(50% - 5rem + ${(i - 1) * 2}rem)`, zIndex: i }}
            >
              <MediaDisplay src={img} alt="memory" className="w-full h-full object-cover" />
            </motion.div>
          ))
          : APOLOGY_DATA.memories.slice(0,3).map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50, rotate: (i - 1) * -15 }}
            animate={{ opacity: 1, y: 0, rotate: (i - 1) * 10 }}
            transition={{ delay: i * 0.5, type: "spring" }}
            className="absolute top-0 w-40 h-48 bg-white p-2 pb-8 shadow-2xl rounded-sm border border-slate-200"
            style={{ left: `calc(50% - 5rem + ${(i - 1) * 2}rem)`, zIndex: i }}
          >
            <MediaDisplay src={img} alt="memory" className="w-full h-full object-cover" />
          </motion.div>
        ))}
      </div>
      <motion.img
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
        src="/assets/happy/cute-love.webp"
        className="w-32 h-32 object-contain mx-auto mb-6 drop-shadow-xl relative z-10"
        alt="love"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="text-lg font-medium text-slate-800 text-center mb-8 px-4 bg-white/60 backdrop-blur-sm py-3 rounded-2xl"
      >
        {config?.nostalgiaText || "\"Tớ không muốn vì một phút ngu ngốc mà đánh mất những nụ cười này...\""}
      </motion.p>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        onClick={onNext}
        className="px-8 py-3 bg-amber-500 text-[#ffffff] rounded-full font-bold shadow-xl hover:scale-105 transition-transform"
      >
        {config?.nostalgiaBtn || "Xem tiếp"}
      </motion.button>
    </motion.div>
  );
}

// --- STEP 5: SINCERE APOLOGY ---
function Step5Apology({ onNext, autoPlay, config }: { onNext: () => void; autoPlay: boolean; config: any }) {
  const [text, setText] = useState("");
  const fullText = config?.letterText || APOLOGY_DATA.letter;
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(t);
        setDone(true);
      }
    }, 80); // slower typewriter
    return () => clearInterval(t);
  }, [fullText, autoPlay]);

  useEffect(() => {
    if (autoPlay && done) {
      const t = setTimeout(onNext, 2000);
      return () => clearTimeout(t);
    }
  }, [autoPlay, done, onNext]);

  return (
    <motion.div
      key="step5"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10"
    >
      <img src="/assets/sad/el-gato.webp" className="w-28 h-28 object-contain mx-auto mb-4 drop-shadow-lg z-20" alt="pleading" />
      <motion.div
        animate={{ rotate: [-1, 1, -1] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="bg-pink-50 p-8 rounded-sm shadow-2xl w-full max-w-sm relative border-2 border-pink-200"
        style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #fbcfe8 31px, #fbcfe8 32px)", lineHeight: "32px", backgroundAttachment: "local" }}
      >
        <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-8 h-8 bg-pink-500/40 rounded-full shadow-inner" /> {/* pin */}
        <p className="text-slate-800 font-medium text-lg italic font-serif pt-2 min-h-[200px]">
          {text}<span className="animate-pulse">_</span>
        </p>
      </motion.div>

      <AnimatePresence>
        {done && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onNext}
            className="mt-10 px-8 py-4 bg-rose-500 text-[#ffffff] rounded-full font-bold shadow-xl hover:bg-rose-600 transition-transform flex items-center gap-2"
          >
            {config?.letterBtn || "Chốt hạ"} <ScrollText size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- STEP 6: PEACE TREATY ---
function Step6Treaty({ onNext, autoPlay, config }: { onNext: () => void; autoPlay: boolean; config: any }) {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [pleading, setPleading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const moveNo = () => {
    if (autoPlay) return;
    const spreadX = 120;
    const spreadY = 120;
    let newX = (Math.random() - 0.5) * spreadX;
    let newY = (Math.random() - 0.5) * spreadY;
    
    // Force distance from current position so it doesn't jump into the cursor
    if (Math.abs(newX - noPos.x) < 40) newX = newX > noPos.x ? newX + 40 : newX - 40;
    if (Math.abs(newY - noPos.y) < 40) newY = newY > noPos.y ? newY + 40 : newY - 40;
    
    setNoPos({ x: newX, y: newY });
  };

  const forceNoClick = () => {
    if (!autoPlay) {
      setPleading(true);
      setTimeout(() => setPleading(false), 2000);
    }
  };

  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(onNext, 2000);
      return () => clearTimeout(t);
    }
  }, [autoPlay, onNext]);

  return (
    <motion.div
      key="step6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10"
      ref={containerRef}
    >
      <img src="/assets/happy/kiss-love.webp" className="w-40 h-40 object-contain mx-auto mb-6 drop-shadow-xl" alt="kiss" />
      <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-wide">{config?.treatyTitle || "Hiệp Ước Hòa Bình"}</h2>
      <p className="text-slate-600 font-medium mb-12">{config?.treatySubtitle || "Quyết định nằm trong tay cậu. Xin hãy nương tay..."}</p>

      <div className="flex flex-col gap-6 w-full max-w-xs relative">
        <motion.button
          onClick={onNext}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="px-6 py-4 bg-gradient-to-r from-rose-400 to-pink-500 text-[#ffffff] rounded-full font-bold shadow-xl border-2 border-white flex items-center justify-center gap-2 z-20"
        >
          <CheckCircle2 size={20} /> {config?.treatyBtnYes || "Ký tên, tha mạng"}
        </motion.button>

        <motion.button
          animate={noPos}
          transition={{ type: "spring", stiffness: 1200, damping: 14, mass: 0.2 }}
          onHoverStart={moveNo}
          onPointerEnter={moveNo}
          onTouchStart={moveNo}
          onClick={forceNoClick}
          className="px-6 py-4 bg-slate-200 text-slate-500 rounded-full font-bold border-2 border-slate-300 flex items-center justify-center gap-2 z-10 transition-colors hover:bg-slate-300"
        >
          <XCircle size={20} /> {config?.treatyBtnNo || "GIẬN TIẾP, KHÔNG THA 😤"}
        </motion.button>
      </div>

      <AnimatePresence>
        {pleading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-10 bg-pink-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex flex-col items-center gap-2"
          >
            <img src="/assets/sad/cat-kitty.webp" className="w-16 h-16 object-contain" alt="cry" />
            Thôi màaaa, xin đấyyyy 😭
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- MAIN TEMPLATE COMPONENT ---
export default function Sorry1Template({ compact = false, autoPlay = false, hideNavigation = false, isBuilderPreview = false, config, generalAudioUrl }: { compact?: boolean; autoPlay?: boolean; hideNavigation?: boolean; isBuilderPreview?: boolean; config?: any; generalAudioUrl?: string }) {
  const [step, setStep] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const btnAudioRef = useRef<HTMLAudioElement>(null);
  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().catch(() => {});
    } else if (compact && !isBuilderPreview && audioRef.current) {
      audioRef.current.pause();
    } else if (!compact && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [autoPlay, compact, isBuilderPreview, generalAudioUrl]);

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current && !compact && !autoPlay) {
        audioRef.current.play().catch(() => {});
      }
    };
    document.addEventListener('click', playAudio, { once: true });
    document.addEventListener('touchstart', playAudio, { once: true });
    return () => {
      document.removeEventListener('click', playAudio);
      document.removeEventListener('touchstart', playAudio);
    };
  }, [compact, autoPlay]);

  // Background image and color mapping
  const bgImages = [
    "url('/assets/bg/bg1.jpg')",
    "url('/assets/bg/bg2.jpg')",
    "url('/assets/bg/bg3.jpg')",
    "url('/assets/bg/bg4.jpg')",
    "url('/assets/bg/bg5.jpg')",
    "url('/assets/bg/bg6.jpg')",
    "url('/assets/bg/bg7.jpg')"
  ];
  const bgColors = [
    "from-pink-100/80 to-rose-200/80",   
    "from-pink-200/80 to-fuchsia-300/80",   
    "from-rose-200/80 to-pink-300/80",  
    "from-pink-300/80 to-rose-400/80",    
    "from-fuchsia-200/80 to-pink-300/80",     
    "from-rose-300/80 to-pink-500/80",     
    "from-pink-400/80 to-fuchsia-500/80"   
  ];

  const currentBg = bgColors[step - 1] || bgColors[bgColors.length - 1];
  const currentImg = bgImages[step - 1] || bgImages[bgImages.length - 1];

  const triggerConfetti = () => {
    if (!canvasRef.current) return;
    const myConfetti = confetti.create(canvasRef.current, { resize: true, useWorker: true });

    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      myConfetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#f43f5e', '#ec4899', '#d946ef']
      });
      myConfetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#f43f5e', '#ec4899', '#d946ef']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleNext = () => {
    if (btnAudioRef.current && !(compact && !autoPlay && typeof window !== 'undefined' && !window.location.pathname.includes('dashboard'))) {
      btnAudioRef.current.currentTime = 0;
      btnAudioRef.current.play().catch(() => {});
    }

    if (step === 6) {
      triggerConfetti();
      setStep(7);
      if (autoPlay) {
        loopTimeoutRef.current = setTimeout(() => setStep(1), 4000); // loop
      }
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div 
      className={`relative w-full overflow-hidden transition-all duration-1000 text-slate-800 mx-auto ${compact || isBuilderPreview ? 'h-full' : 'max-w-[400px] h-[800px] max-h-[90vh] rounded-[3rem] shadow-2xl border-[10px] border-pink-200'}`}
      style={{ backgroundImage: currentImg, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <audio ref={btnAudioRef} src="/assets/vfx/touch.mp3" preload="auto" muted={compact && !isBuilderPreview && !autoPlay} />
      <div className={`absolute inset-0 bg-gradient-to-b ${currentBg} backdrop-blur-[2px]`} />
      {generalAudioUrl && <audio ref={audioRef} src={generalAudioUrl} autoPlay loop muted={compact && !autoPlay} />}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-50" />
      <FloatingParticles />
      <AnimatePresence mode="wait">
        {step === 1 && <Step1Ice key="s1" onNext={handleNext} autoPlay={autoPlay} config={config} isMuted={compact && !isBuilderPreview && !autoPlay} />}
        {step === 2 && <Step2Confession key="s2" onNext={handleNext} autoPlay={autoPlay} config={config} />}
        {step === 3 && <Step3Wheel key="s3" onNext={handleNext} autoPlay={autoPlay} config={config} isMuted={compact && !isBuilderPreview && !autoPlay} />}
        {step === 4 && <Step4Nostalgia key="s4" onNext={handleNext} autoPlay={autoPlay} config={config} />}
        {step === 5 && <Step5Apology key="s5" onNext={handleNext} autoPlay={autoPlay} config={config} />}
        {step === 6 && <Step6Treaty key="s6" onNext={handleNext} autoPlay={autoPlay} config={config} />}
        {step === 7 && (
          <motion.div
            key="s7"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 text-[#ffffff]"
          >
            <img src="/assets/happy/love-valentines.webp" className="w-48 h-48 object-contain mx-auto mb-6 drop-shadow-2xl" alt="happy" />
            <h2 className="text-4xl font-black mb-4 drop-shadow-md text-pink-600 bg-white/70 px-6 py-2 rounded-full">{config?.successTitle || "Cảm ơn cậu! ❤️"}</h2>
            <p className="text-xl font-medium bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/40">
              {config?.successDesc || "Tớ qua đón cậu đi ăn đền tội ngay đây!"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <TemplateNavigator
        currentIndex={step - 1}
        totalSteps={7}
        onPrev={() => setStep(s => Math.max(1, s - 1))}
        onNext={() => setStep(s => Math.min(7, s + 1))}
        accentColor="#ec4899"
        isHidden={hideNavigation || autoPlay}
      />
    </div>
  );
}
