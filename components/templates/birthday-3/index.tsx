"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { TemplateNavigator } from "../TemplateNavigator";
import { ChevronDown, Gift, Image as ImageIcon, Flame, Maximize2, X, Heart } from "lucide-react";
import confetti from "canvas-confetti";

const BIRTHDAY_DATA = {
  name: "Cục Cưng",
  age: 22,
  wishes: [
    "Chúc bé tuổi mới luôn xinh đẹp, rạng rỡ và ngập tràn niềm vui nhé! 💖",
    "Tuổi 22 sẽ là một năm đầy hứa hẹn. Chúc mọi dự định của cậu đều thành công rực rỡ! ✨",
    "Dù có chuyện gì xảy ra thì vẫn luôn có tớ ở đây ủng hộ cậu. Happy Birthday! 🎂",
    "Cảm ơn vì đã xuất hiện và làm thanh xuân của tớ trở nên tuyệt vời hơn rất nhiều. 🥰"
  ],
  photos: [
    "/assets/lovepics/1.jpg",
    "/assets/lovepics/2.jpg",
    "/assets/lovepics/3.jpg"
  ],
  letter: "Mong mọi điều tốt đẹp nhất sẽ đến với cậu. Tuổi mới thật rực rỡ nhé!",
  giftText: "VOUCHER BAO ĐI ĂN BUFFET & XEM PHIM 🎟️"
};

function BackgroundSparkles() {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    setSparkles(
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 6,
        size: Math.random() * 8 + 4,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute bg-yellow-300 rounded-full blur-[1px] mix-blend-screen"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 0.7, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function Birthday3Template({ autoPlay = false, compact = false, hideNavigation = false, isBuilderPreview = false, config = {} }: { autoPlay?: boolean; compact?: boolean; hideNavigation?: boolean; isBuilderPreview?: boolean; config?: any }) {
  const [step, setStep] = useState(1);

  const nextStep = useCallback(() => {
    setStep(s => Math.min(s + 1, 8));
  }, []);

  return (
    <div className={`relative w-full overflow-hidden text-gray-800 font-sans mx-auto ${compact ? 'h-full bg-transparent' : 'max-w-[400px] h-[800px] max-h-[90vh] bg-pink-50 rounded-[2.5rem] shadow-2xl border-[10px] border-pink-200'}`} style={{ backgroundImage: "url('/assets/bg/bg6.jpg')", backgroundSize: 'cover', backgroundBlendMode: 'overlay' }}>
      <AnimatePresence mode="wait">
        {step === 1 && <Step1Knock key="step1" onNext={nextStep} autoPlay={autoPlay} config={config} />}
        {step === 2 && <Step2Surprise key="step2" onNext={nextStep} autoPlay={autoPlay} config={config} />}
        {step === 3 && <Step3Balloons key="step3" onNext={nextStep} autoPlay={autoPlay} config={config} />}
        {step === 4 && <Step4Cake key="step4" onNext={nextStep} autoPlay={autoPlay} config={config} />}
        {step === 5 && <Step5Cards key="step5" onNext={nextStep} autoPlay={autoPlay} config={config} />}
        {step === 6 && <Step6Memory key="step6" onNext={nextStep} autoPlay={autoPlay} config={config} />}
        {step === 7 && <Step7Unboxing key="step7" onNext={nextStep} autoPlay={autoPlay} config={config} />}
        {step === 8 && <Step8Afterparty key="step8" autoPlay={autoPlay} config={config} />}
      </AnimatePresence>
      <TemplateNavigator
        currentIndex={step - 1}
        totalSteps={8}
        onPrev={() => setStep(s => Math.max(1, s - 1))}
        onNext={() => setStep(s => Math.min(8, s + 1))}
        accentColor="#f43f5e"
        isHidden={hideNavigation || autoPlay}
      />
    </div>
  );
}

// --- DECORATIVE PARTICLES ---
function FloatingParticles({ step }: { step: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const particles = Array.from({ length: 15 });
  const getEmoji = () => {
    if (step === 1) return ["✨", "💌", "💝"];
    if (step === 2) return ["✨", "⭐", "🌙"];
    if (step === 3) return ["🎈", "✨", "🎉"];
    if (step === 4) return ["🎂", "✨", "🔥"];
    if (step === 5) return ["💌", "💖", "✨"];
    if (step === 6) return ["📸", "✨", "💫"];
    if (step === 7) return ["🎁", "✨", "🎊"];
    return ["🎉", "✨", "🥂"];
  };

  const emojis = getEmoji();

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
      {particles.map((_, i) => (
        <motion.div
          key={`${step}-${i}`}
          initial={{
            x: Math.random() * 400,
            y: Math.random() * 800 + 800, // start below
            opacity: 0,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: -100, // float up
            opacity: [0, 0.5, 0],
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
          className="absolute text-xl filter drop-shadow-md"
        >
          {emojis[i % emojis.length]}
        </motion.div>
      ))}
    </div>
  );
}

// --- STEP 1: THE KNOCK ---
function Step1Knock({ onNext, autoPlay, config }: { onNext: () => void; autoPlay: boolean; config: any }) {
  const [knocks, setKnocks] = useState(0);

  const handleKnock = () => {
    if (knocks < 3 && !autoPlay) {
      setKnocks(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (knocks >= 3) {
      setTimeout(onNext, 1800);
    }
  }, [knocks, onNext]);

  useEffect(() => {
    if (autoPlay) {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setKnocks(count);
        if (count >= 3) {
          clearInterval(interval);
        }
      }, 800);
      return () => clearInterval(interval);
    }
  }, [autoPlay]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 bg-gradient-to-br from-pink-100 to-rose-200 flex flex-col items-center justify-center cursor-pointer z-10 overflow-hidden"
      onClick={handleKnock}
    >
      <BackgroundSparkles />
      <FloatingParticles step={1} />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj4KICA8ZmlsdGVyIGlkPSJub2lzZSI+CiAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC45IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wOCIvPgo8L3N2Zz4=')] opacity-20 mix-blend-overlay pointer-events-none" />
      
      <motion.div 
        animate={{ opacity: knocks >= 3 ? 0 : 1, y: knocks >= 3 ? -50 : 0 }}
        className="text-center mb-12 relative z-20"
      >
        <h2 className="text-3xl font-serif font-bold text-rose-500 mb-2 drop-shadow-sm">{config?.doorSign || "A SPECIAL GIFT 💌"}</h2>
        <p className="text-rose-400 font-medium tracking-widest bg-white/50 px-4 py-1 rounded-full shadow-sm">{config?.doorInstruction || "Chạm 3 lần để mở thư!"}</p>
      </motion.div>

      <motion.div
        animate={{
          x: knocks > 0 && knocks < 3 ? [-5, 5, -5, 5, 0] : 0,
          rotate: knocks > 0 && knocks < 3 ? [-2, 2, -2, 2, 0] : 0,
          scale: knocks >= 3 ? 15 : 1,
          opacity: knocks >= 3 ? 0 : 1
        }}
        transition={{ duration: knocks >= 3 ? 1.5 : 0.4, ease: knocks >= 3 ? "easeInOut" : "linear" }}
        className="relative z-10 flex flex-col items-center origin-center"
      >
        <div className="w-72 h-48 bg-white rounded-xl shadow-xl relative flex items-center justify-center overflow-hidden border-4 border-rose-50">
          {/* Glowing Light Inside */}
          <motion.div 
            animate={{ opacity: knocks >= 3 ? 1 : 0, scale: knocks >= 3 ? 3 : 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute top-10 w-full h-full bg-white blur-2xl z-0 rounded-full"
          />

          {/* Envelope Flap */}
          <motion.div 
            animate={{ rotateX: knocks >= 3 ? 180 : 0, zIndex: knocks >= 3 ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="absolute top-0 left-0 w-0 h-0 border-l-[140px] border-r-[140px] border-t-[100px] border-l-transparent border-r-transparent border-t-rose-100 drop-shadow-md origin-top"
          />
          
          <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[140px] border-r-[140px] border-b-[100px] border-l-transparent border-r-transparent border-b-rose-50 z-10" />
          
          {/* The Seal */}
          <motion.div 
            animate={{ scale: knocks >= 3 ? 0 : 1, opacity: knocks >= 3 ? 0 : 1 }}
            className="absolute top-[80px] z-30 w-16 h-16 bg-gradient-to-br from-red-500 to-rose-700 rounded-full flex items-center justify-center shadow-lg border-2 border-red-800"
          >
            <Heart size={24} className="text-white fill-white" />
          </motion.div>
        </div>
      </motion.div>

      {/* Knock indicators */}
      <motion.div 
        animate={{ opacity: knocks >= 3 ? 0 : 1 }}
        className="absolute bottom-16 flex gap-4 z-10"
      >
        {[1, 2, 3].map(i => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${knocks >= i ? 'bg-rose-500 scale-150 shadow-[0_0_10px_#f43f5e]' : 'bg-rose-200'}`} />
        ))}
      </motion.div>

      {/* Flash White on open */}
      <AnimatePresence>
        {knocks >= 3 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="absolute inset-0 bg-[#fdfbf7] z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- STEP 2: THE SURPRISE (LIGHT SWITCH) ---
function Step2Surprise({ onNext, autoPlay, config }: { onNext: () => void; autoPlay: boolean; config: any }) {
  const [isOn, setIsOn] = useState(false);
  const [leverY, setLeverY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const triggerSurprise = () => {
    setIsOn(true);
    if (canvasRef.current) {
      const myConfetti = confetti.create(canvasRef.current, { resize: true, useWorker: true });
      myConfetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#fb923c', '#fcd34d', '#f472b6', '#60a5fa']
      });
    }
  };

  const handleDragEnd = (e: any, info: any) => {
    if (info.offset.y > 50 && !autoPlay && !isOn) {
      triggerSurprise();
      setTimeout(onNext, 3000);
    }
  };

  useEffect(() => {
    if (autoPlay) {
      const t0 = setTimeout(() => setLeverY(60), 1000); // Slow pull
      const t1 = setTimeout(() => {
        triggerSurprise();
      }, 1500);
      const t2 = setTimeout(onNext, 4500);
      return () => {
        clearTimeout(t0);
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, backgroundColor: isOn ? "#fff7ed" : "#0f172a" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center z-10 overflow-hidden"
    >
      <BackgroundSparkles />
      <FloatingParticles step={2} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-50" />
      {/* Decorative Lights */}
      {isOn && (
        <div className="absolute top-0 w-full h-32 flex justify-around px-4 z-0">
          {[1,2,3,4,5].map(i => (
            <motion.div 
              key={i} 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              className="w-4 h-12 bg-gradient-to-b from-yellow-300 to-yellow-100 rounded-b-full shadow-[0_10px_30px_#fde047] origin-top"
            />
          ))}
        </div>
      )}

      {!isOn && (
        <motion.div
          animate={{ rotate: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-20 left-6 z-10"
        >
            <div className="relative px-6 py-4">
              <p 
                className="font-serif font-bold italic text-4xl text-center whitespace-pre-wrap" 
                style={{ color: "#ffffff", textShadow: "0px 4px 10px rgba(0,0,0,0.6)" }}
              >
                {config?.darkRoomText || "Kéo xuống\nnhé!"}
              </p>
              
              {/* Sparks Top-Left */}
              <div className="absolute top-2 left-2 w-8 h-8 pointer-events-none">
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute top-0 left-3 w-1 h-3 bg-yellow-200 rounded-full" />
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="absolute top-3 left-0 w-3 h-1 bg-yellow-200 rounded-full" />
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="absolute top-1 left-1 w-2 h-2 bg-yellow-200 rounded-full rotate-45" />
              </div>

              {/* Sparks Bottom-Right */}
              <div className="absolute bottom-2 right-2 w-8 h-8 pointer-events-none">
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute bottom-0 right-3 w-1 h-3 bg-yellow-200 rounded-full" />
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="absolute bottom-3 right-0 w-3 h-1 bg-yellow-200 rounded-full" />
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="absolute bottom-1 right-1 w-2 h-2 bg-yellow-200 rounded-full rotate-45" />
              </div>

              {/* Arrow pointing to switch */}
              <div className="absolute -bottom-4 -right-4 text-white text-3xl rotate-[40deg]">
                ⤵️
              </div>
            </div>
          </motion.div>
        )}

      <motion.div
        animate={{ opacity: isOn ? 0 : 1, scale: isOn ? 0.9 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-16 h-32 bg-slate-800 rounded-full border-4 border-slate-700 shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)] relative overflow-hidden flex items-start justify-center pt-2 z-20"
      >
        <motion.div
          drag={isOn ? false : "y"}
          dragConstraints={{ top: 0, bottom: 60 }}
          onDragEnd={handleDragEnd}
          animate={{ y: isOn ? 60 : autoPlay ? leverY : [0, 10, 0] }}
          transition={!isOn && !autoPlay ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" } : {}}
          className={`w-10 h-14 rounded-full shadow-lg flex items-center justify-center ${isOn ? 'bg-orange-400 shadow-[0_0_20px_#fb923c]' : 'bg-slate-300'}`}
          style={{ cursor: isOn ? 'default' : 'grab' }}
        >
          <ChevronDown className={isOn ? 'text-orange-100' : 'text-slate-500'} />
        </motion.div>
        
        {/* Sparks when pulled */}
        {isOn && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: 40, scale: 1.5 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-2 w-full flex justify-center gap-2 z-30"
          >
            <div className="w-1 h-6 bg-yellow-300 origin-bottom rotate-[-30deg]" />
            <div className="w-1 h-8 bg-yellow-200 origin-bottom" />
            <div className="w-1 h-6 bg-yellow-300 origin-bottom rotate-[30deg]" />
          </motion.div>
        )}
      </motion.div>

      {isOn && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center pt-10 z-10"
        >
          <h1 className="text-5xl font-black text-orange-500 drop-shadow-md mb-4 text-center">SURPRISE!</h1>
          <p className="text-2xl text-orange-400 font-bold bg-white/50 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm">Happy Birthday {BIRTHDAY_DATA.name}! 🎉</p>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          
          {/* Balloons floating up */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 800, x: Math.random() * 300, scale: 0.6 + Math.random() * 0.4 }}
                animate={{ y: -200, x: Math.random() * 300 + (Math.random() > 0.5 ? 50 : -50) }}
                transition={{ duration: 4 + Math.random() * 2, ease: "easeOut" }}
                className="absolute w-12 h-16 rounded-[50%] opacity-90 shadow-inner flex items-center justify-center"
                style={{ backgroundColor: ['#fbcfe8', '#bfdbfe', '#fef08a', '#bbf7d0'][i % 4] }}
              >
                <div className="absolute -bottom-1 w-1 h-2 bg-white/50 rounded-sm" />
                <div className="absolute -bottom-6 w-0.5 h-6 bg-gray-300/50" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// --- STEP 3: THE BALLOONS ---
function Step3Balloons({ onNext, autoPlay, config }: { onNext: () => void; autoPlay: boolean; config: any }) {
  const [poppedCount, setPoppedCount] = useState(0);
  const [balloons, setBalloons] = useState<{ id: number, x: number, delay: number, color: string, text: string, popped: boolean }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const colors = ["bg-pink-300", "bg-blue-300", "bg-yellow-300", "bg-green-300", "bg-purple-300"];
    const texts = ["Xinh đẹp!", "Thành công!", "Hạnh phúc!", "May mắn!", "Nhiều tiền!"];
    const b = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80, // percentage
      delay: Math.random() * 2,
      color: colors[i],
      text: texts[i],
      popped: false
    }));
    setBalloons(b);
  }, []);

  const handlePop = (id: number) => {
    setBalloons(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    setPoppedCount(prev => prev + 1);
    if (canvasRef.current) {
      const myConfetti = confetti.create(canvasRef.current, { resize: true, useWorker: true });
      myConfetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#fbcfe8', '#bfdbfe', '#fef08a']
      });
    }
  };

  useEffect(() => {
    if (autoPlay && balloons.length > 0) {
      let count = 0;
      let interval: any;
      const timeout = setTimeout(() => {
        interval = setInterval(() => {
          if (count < 3) {
            handlePop(count);
            count++;
          } else {
            clearInterval(interval);
            setTimeout(onNext, 2000);
          }
        }, 1500);
      }, 4000); // Wait 4s for balloons to float up into view
      
      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, balloons.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#fdfbf7] flex flex-col items-center pt-16 z-10 overflow-hidden"
    >
      <BackgroundSparkles />
      <FloatingParticles step={3} />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj4KICA8ZmlsdGVyIGlkPSJub2lzZSI+CiAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC45IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wOCIvPgo8L3N2Zz4=')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      <h2 className="text-2xl font-bold text-center px-6 text-slate-700 leading-relaxed z-20 bg-white/70 backdrop-blur-md py-4 rounded-3xl mx-4 shadow-sm border border-pink-50">
        Chào mừng <span className="text-pink-500 font-black">{BIRTHDAY_DATA.name}</span> bước sang tuổi <span className="text-pink-500 font-black">{BIRTHDAY_DATA.age}</span>!
      </h2>
      <p className="text-slate-500 mt-2 z-20 text-sm font-medium bg-white/50 px-4 py-1 rounded-full">{config?.balloonText || "Chạm vào 3 quả bóng bay để xem điều bất ngờ!"}</p>

      {/* Balloons */}
      {balloons.map((b) => (
        <AnimatePresence key={b.id}>
          {!b.popped ? (
            <motion.div
              initial={{ y: "120vh" }}
              animate={{ y: "-20vh" }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 8 + Math.random() * 4, delay: b.delay, repeat: Infinity, ease: "linear" }}
              className="absolute z-10"
              style={{ left: `${b.x}%` }}
              onClick={autoPlay ? undefined : () => handlePop(b.id)}
            >
              <div className={`w-20 h-24 ${b.color} rounded-[50%] shadow-inner flex items-center justify-center relative cursor-pointer hover:brightness-110 drop-shadow-lg`}>
                <div className="absolute -bottom-2 w-2 h-3 bg-white/50 rounded-sm" />
                <div className="absolute -bottom-16 w-[1px] h-16 bg-white/80" />
                <div className="absolute top-2 right-4 w-4 h-6 bg-white/40 rounded-[50%] rotate-45" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: [0, 1, 1, 0.8], scale: 1, y: -50, rotate: [-5, 5, -5, 5, 0] }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute z-20 font-black text-2xl text-pink-500 drop-shadow-lg whitespace-nowrap bg-white/80 px-4 py-2 rounded-full border-2 border-pink-200"
              style={{ left: `${b.x - 10}%`, top: '40%' }} // approximate pop position
            >
              {b.text}
            </motion.div>
          )}
        </AnimatePresence>
      ))}
      
      {/* Show Next button after popping 3 balloons */}
      <AnimatePresence>
        {poppedCount >= 3 && !autoPlay && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-20 z-30"
          >
            <button 
              onClick={onNext}
              className="bg-pink-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-pink-600 hover:scale-105 transition-all"
            >
              Tiếp tục thôi! 👉
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 z-20 font-bold text-slate-400 bg-white/80 px-4 py-1 rounded-full">
        Đã vỡ: {poppedCount}/3
      </div>
    </motion.div>
  );
}

// --- STEP 4: THE CAKE ---
function Step4Cake({ onNext, autoPlay, config }: { onNext: () => void; autoPlay: boolean; config: any }) {
  const [blowProgress, setBlowProgress] = useState(0);
  const [blown, setBlown] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startBlowing = () => {
    if (blown || autoPlay) return;
    intervalRef.current = setInterval(() => {
      setBlowProgress(prev => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setBlown(true);
          setTimeout(onNext, 2500);
          return 100;
        }
        return prev + 2; // ~1.5s to reach 100 (50 * 30ms) Wait! 3 seconds requested.
      });
    }, 60); // 100 / 2 = 50 steps * 60ms = 3000ms
  };

  const stopBlowing = () => {
    if (blown || autoPlay) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setBlowProgress(0); // reset if they release early
  };

  useEffect(() => {
    if (autoPlay && !blown) {
      let p = 0;
      const t = setInterval(() => {
        p += 2;
        setBlowProgress(p);
        if (p >= 100) {
          clearInterval(t);
          setBlown(true);
          setTimeout(onNext, 2000);
        }
      }, 60);
      return () => clearInterval(t);
    }
  }, [autoPlay, blown, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-between py-16 z-10 backdrop-blur-sm"
    >
      <BackgroundSparkles />
      <FloatingParticles step={4} />

      <div className="text-center px-6">
        <h2 className="text-2xl font-bold text-amber-100 mb-2 drop-shadow-md">{config?.cakeTitle || "Happy Birthday! 🌟"}</h2>
        <p className="text-slate-300 text-sm">{config?.cakeInstruction || "Nhắm mắt lại, chắp tay và ước một điều thật to lớn đi nào!"}</p>
      </div>

      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
        className="relative flex flex-col items-center"
      >
        {/* The Candle */}
        <div className="relative w-4 h-16 bg-red-400 rounded-t-md border-b-4 border-red-500 z-10">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-3 bg-slate-800 rounded-full" />
          <AnimatePresence>
            {!blown && (
              <motion.div
                exit={{ opacity: 0, scale: 0 }}
                animate={{ 
                  rotate: blowProgress > 0 ? [-5, 5, -5, 5, 0] : [-2, 2, -1, 3, 0],
                  scale: blowProgress > 0 ? 1 - (blowProgress/100)*0.5 : [1, 1.1, 1],
                  opacity: 1 - (blowProgress/100)
                }}
                transition={{ repeat: Infinity, duration: 0.2 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 text-4xl origin-bottom"
              >
                🔥
                <div className="absolute inset-0 bg-orange-400 blur-xl opacity-50 rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>
          {blown && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.5, 0], y: -50 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl text-slate-400"
            >
              💨
            </motion.div>
          )}
        </div>
        
        {/* The Cake */}
        <img src="/assets/happy/cute-love.webp" className="w-48 h-48 object-contain z-0 -mt-2 drop-shadow-2xl" alt="cake" />
      </motion.div>

      <div className="relative w-64 h-16">
        <button
          onPointerDown={startBlowing}
          onPointerUp={stopBlowing}
          onPointerLeave={stopBlowing}
          disabled={blown || autoPlay}
          className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full font-bold text-white shadow-[0_5px_20px_rgba(245,158,11,0.4)] disabled:opacity-50 select-none z-10 touch-none flex items-center justify-center gap-2"
        >
          {blown ? "ĐÃ ƯỚC XONG ✨" : (config?.blowBtn || "NHẤN GIỮ ĐỂ THỔI NẾN 🌬️")}
        </button>
        
        {/* Progress Ring Overlay */}
        {!blown && (
          <div 
            className="absolute inset-0 border-4 border-white/40 rounded-full pointer-events-none z-20"
            style={{ 
              clipPath: `inset(0 ${100 - blowProgress}% 0 0)`,
              background: "rgba(255,255,255,0.2)"
            }} 
          />
        )}
      </div>
    </motion.div>
  );
}

// --- STEP 5: THE GREETING CARDS ---
function Step5Cards({ onNext, autoPlay, config }: { onNext: () => void; autoPlay: boolean; config: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => {
    if (autoPlay) return;
    if (currentIndex < BIRTHDAY_DATA.wishes.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onNext();
    }
  };

  useEffect(() => {
    if (autoPlay) {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        if (count < BIRTHDAY_DATA.wishes.length) {
          setCurrentIndex(count);
        } else {
          clearInterval(interval);
          onNext();
        }
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [autoPlay, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#fdfbf7] flex flex-col items-center justify-center z-10"
    >
      <BackgroundSparkles />
      <FloatingParticles step={5} />
      <div className="absolute top-16 text-center w-full px-6">
        <h2 className="text-2xl font-bold text-amber-700 font-serif">{config?.cardTitle || "Lời Chúc Từ Trái Tim"}</h2>
        <p className="text-slate-500 text-sm mt-2">Chạm vào thiệp để đọc tiếp ({currentIndex + 1}/{BIRTHDAY_DATA.wishes.length})</p>
      </div>

      <div className="relative w-full max-w-[280px] aspect-[3/4] perspective-1000">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100, rotateY: -30, rotateZ: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0, rotateZ: 0 }}
            exit={{ opacity: 0, x: -100, rotateY: 30, rotateZ: -10 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={nextCard}
            className={`absolute inset-0 bg-white rounded-2xl shadow-xl border border-amber-100 p-8 flex flex-col items-center justify-center text-center cursor-pointer ${autoPlay ? 'pointer-events-none' : ''}`}
            style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }}
          >
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-6 text-amber-500">
              <Gift size={24} />
            </div>
            <p className="text-lg text-slate-700 font-medium leading-relaxed italic">
              "{BIRTHDAY_DATA.wishes[currentIndex]}"
            </p>
            <div className="absolute bottom-6 text-xs text-amber-400 font-bold uppercase tracking-widest">
              {config?.cardBtn || "Lật thiệp"}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// --- STEP 6: THE MEMORY WALL ---
function Step6Memory({ onNext, autoPlay, config }: { onNext: () => void; autoPlay: boolean; config: any }) {
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const total = BIRTHDAY_DATA.photos.length;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count < total) {
        setPhotoIndex(count);
      } else {
        clearInterval(interval);
        onNext();
      }
    }, 3000); // 3s per photo
    return () => clearInterval(interval);
  }, [onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-10"
    >
      <BackgroundSparkles />
      <FloatingParticles step={6} />
      <h2 className="absolute top-16 text-xl font-medium text-stone-300 text-center px-4 leading-relaxed whitespace-pre-line">
        {[config?.memoryWish1, config?.memoryWish2, config?.memoryWish3, config?.memoryWish4].filter(Boolean)[photoIndex] || "Một năm qua cậu đã rực rỡ thế này cơ mà..."}
      </h2>

      <div className="relative w-full aspect-[4/5] max-w-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={photoIndex}
            initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.05, rotate: 2 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-white p-4 pb-16 rounded-sm shadow-2xl"
          >
            <div className="w-full h-full bg-stone-200 overflow-hidden relative">
              <img 
                src={[config?.memory1, config?.memory2, config?.memory3].filter(Boolean)[photoIndex] || BIRTHDAY_DATA.photos[photoIndex]} 
                alt="Memory" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-5 left-0 w-full text-center text-stone-500 font-handwriting text-xl">
              Memories 📸
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="absolute bottom-16 flex gap-2">
        {BIRTHDAY_DATA.photos.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-colors duration-500 ${i === photoIndex ? 'bg-stone-300' : 'bg-stone-600'}`} />
        ))}
      </div>
    </motion.div>
  );
}

// --- STEP 7: THE UNBOXING ---
function Step7Unboxing({ onNext, autoPlay, config }: { onNext: () => void; autoPlay: boolean; config: any }) {
  const [taps, setTaps] = useState(0);
  const maxTaps = 5;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleTap = () => {
    if (taps < maxTaps && !autoPlay) {
      setTaps(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (taps >= maxTaps) {
      if (canvasRef.current) {
        const myConfetti = confetti.create(canvasRef.current, { resize: true, useWorker: true });
        myConfetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#ffffff']
        });
      }
      setTimeout(onNext, 2000);
    }
  }, [taps, onNext]);

  useEffect(() => {
    if (autoPlay) {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setTaps(count);
        if (count >= maxTaps) {
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [autoPlay]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-amber-50 flex flex-col items-center justify-center z-10 cursor-pointer"
      onClick={handleTap}
    >
      <BackgroundSparkles />
      <FloatingParticles step={7} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-50" />
      <div className="text-center mb-12 relative z-20">
        <h2 className="text-3xl font-black text-amber-600 mb-2 uppercase tracking-wide">Quà của cậu này!</h2>
        <p className="text-amber-700/70 font-medium">{config?.giftInstruction || "Chạm liên tục để xé giấy gói nhé!"}</p>
      </div>

      <motion.div
        animate={{ 
          scale: 1 + (taps * 0.1),
          rotate: taps > 0 && taps < maxTaps ? [-5, 5, -5, 5, 0] : 0 
        }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        {taps < maxTaps ? (
          <img src="/assets/dumb/auau.webp" className="w-40 h-40 object-contain drop-shadow-[0_20px_30px_rgba(245,158,11,0.4)] animate-bounce" alt="gift" />
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-64 bg-white rounded-xl shadow-2xl border-2 border-amber-200 p-6 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Gift size={32} className="text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Wowww!</h3>
            <p className="text-sm font-medium text-amber-600 px-4 py-2 bg-amber-50 rounded-lg">
              {config?.giftName || BIRTHDAY_DATA.giftText}
            </p>
          </motion.div>
        )}
      </motion.div>
      
      {/* Tap Progress */}
      {taps < maxTaps && (
        <div className="absolute bottom-20 w-48 h-3 bg-amber-200/50 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-amber-500"
            animate={{ width: `${(taps / maxTaps) * 100}%` }}
          />
        </div>
      )}
    </motion.div>
  );
}

// --- STEP 8: THE AFTERPARTY ---
function Step8Afterparty({ autoPlay, config }: { autoPlay: boolean; config: any }) {
  const [showPopup, setShowPopup] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleClaim = () => {
    if (autoPlay) return;
    setShowPopup(true);
  };

  useEffect(() => {
    if (showPopup && canvasRef.current) {
      const myConfetti = confetti.create(canvasRef.current, { resize: true, useWorker: true });
      myConfetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#ff0000', '#ff69b4', '#ff1493', '#ffff00']
      });
    }
  }, [showPopup]);

  useEffect(() => {
    if (autoPlay && !showPopup) {
      const t = setTimeout(handleClaim, 2000);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, showPopup]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-gradient-to-br from-pink-400 via-rose-400 to-amber-400 flex flex-col items-center justify-center p-6 z-10"
    >
      <BackgroundSparkles />
      <FloatingParticles step={8} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-50" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj4KICA8ZmlsdGVyIGlkPSJub2lzZSI+CiAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC45IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wOCIvPgo8L3N2Zz4=')] opacity-20 mix-blend-overlay pointer-events-none" />
      
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center relative z-20"
      >
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500 mb-6 uppercase">
          Lên Đồ Thôi!
        </h2>
        
        <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 mb-8 overflow-hidden rounded-md relative flex justify-center">
          {config?.giftImage ? (
            <img src={config.giftImage} alt="Gift" className="w-full h-32 object-cover rounded-md mb-2" />
          ) : null}
          <p className="font-bold text-rose-700 absolute bottom-2 left-0 right-0 bg-white/80 p-2 m-2 rounded-lg backdrop-blur-md">{config?.giftName || BIRTHDAY_DATA.giftText}</p>
        </div>

        <motion.button
          onClick={autoPlay ? undefined : handleClaim}
          disabled={autoPlay}
          animate={{ scale: [1, 1.05, 1], boxShadow: ["0px 0px 0px rgba(244,63,94,0)", "0px 0px 20px rgba(244,63,94,0.6)", "0px 0px 0px rgba(244,63,94,0)"] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-black shadow-lg flex justify-center items-center gap-2 text-lg disabled:opacity-80 disabled:cursor-default"
        >
          {config?.memoryBtn || "NHẬN QUÀ NGAY 👗"}
        </motion.button>
      </motion.div>

      {/* Pop-up */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] bg-white rounded-2xl shadow-2xl p-6 z-50 text-center border-4 border-rose-400"
          >
            <img src="/assets/happy/love-valentines.webp" className="w-24 h-24 object-contain mx-auto mb-4" alt="love" />
            <h3 className="text-2xl font-black text-slate-800 mb-2">Chốt Đơn!</h3>
            <p className="text-slate-600 font-medium">Chuẩn bị xong gọi tớ qua đón nhé!</p>
            <button 
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-rose-500"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Overlay for popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
