"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { ChevronDown, Gift, Image as ImageIcon, Flame, Maximize2, X } from "lucide-react";
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
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&q=80",
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80"
  ],
  giftText: "VOUCHER BAO ĐI ĂN BUFFET & XEM PHIM 🎟️"
};

export default function Birthday3Template({ autoPlay = false, compact = false }: { autoPlay?: boolean; compact?: boolean }) {
  const [step, setStep] = useState(1);

  const nextStep = useCallback(() => {
    setStep(s => Math.min(s + 1, 8));
  }, []);

  return (
    <div className={`relative w-full overflow-hidden text-gray-800 touch-none font-sans mx-auto ${compact ? 'h-full bg-transparent' : 'max-w-[400px] h-[800px] max-h-[90vh] bg-[#fdfbf7] rounded-[2.5rem] shadow-2xl border-[10px] border-white'}`}>
      <AnimatePresence mode="wait">
        {step === 1 && <Step1Knock key="step1" onNext={nextStep} autoPlay={autoPlay} />}
        {step === 2 && <Step2Surprise key="step2" onNext={nextStep} autoPlay={autoPlay} />}
        {step === 3 && <Step3Balloons key="step3" onNext={nextStep} autoPlay={autoPlay} />}
        {step === 4 && <Step4Cake key="step4" onNext={nextStep} autoPlay={autoPlay} />}
        {step === 5 && <Step5Cards key="step5" onNext={nextStep} autoPlay={autoPlay} />}
        {step === 6 && <Step6Memory key="step6" onNext={nextStep} autoPlay={autoPlay} />}
        {step === 7 && <Step7Unboxing key="step7" onNext={nextStep} autoPlay={autoPlay} />}
        {step === 8 && <Step8Afterparty key="step8" autoPlay={autoPlay} />}
      </AnimatePresence>
    </div>
  );
}

// --- STEP 1: THE KNOCK ---
function Step1Knock({ onNext, autoPlay }: { onNext: () => void; autoPlay: boolean }) {
  const [knocks, setKnocks] = useState(0);

  const handleKnock = () => {
    if (knocks < 3 && !autoPlay) {
      setKnocks(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (knocks >= 3) {
      setTimeout(onNext, 800);
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
      }, 600);
      return () => clearInterval(interval);
    }
  }, [autoPlay]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 bg-[#3e2723] flex flex-col items-center justify-center cursor-pointer z-10"
      onClick={handleKnock}
    >
      {/* Wooden Door Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-40 mix-blend-multiply" />
      
      <motion.div
        animate={{
          x: knocks > 0 ? [-5, 5, -5, 5, 0] : 0,
          rotate: knocks > 0 ? [-1, 1, -1, 1, 0] : 0,
        }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="w-64 h-96 border-4 border-[#5d4037] rounded-md bg-[#4e342e] shadow-2xl relative flex flex-col items-center justify-center overflow-hidden">
          {/* Door panels */}
          <div className="absolute top-8 w-48 h-32 border-2 border-[#3e2723] rounded-sm opacity-50" />
          <div className="absolute bottom-8 w-48 h-40 border-2 border-[#3e2723] rounded-sm opacity-50" />
          
          {/* Doorknob */}
          <div className="absolute right-4 top-1/2 w-6 h-6 rounded-full bg-yellow-600 shadow-md border-2 border-yellow-700" />
          
          {knocks < 3 ? (
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-yellow-100 font-bold text-center px-4 mt-8 drop-shadow-md text-xl"
            >
              Cốc cốc!<br />Có ai ở nhà không?
            </motion.p>
          ) : (
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-yellow-300 font-black text-3xl drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]"
            >
              MỞ CỬA!
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Knock indicators */}
      <div className="absolute bottom-16 flex gap-3 z-10">
        {[1, 2, 3].map(i => (
          <div key={i} className={`w-4 h-4 rounded-full border-2 border-yellow-500 transition-colors duration-300 ${knocks >= i ? 'bg-yellow-400 shadow-[0_0_10px_#facc15]' : 'bg-transparent'}`} />
        ))}
      </div>
    </motion.div>
  );
}

// --- STEP 2: THE SURPRISE (LIGHT SWITCH) ---
function Step2Surprise({ onNext, autoPlay }: { onNext: () => void; autoPlay: boolean }) {
  const [isOn, setIsOn] = useState(false);

  const handleDragEnd = (e: any, info: any) => {
    if (info.offset.y > 50 && !autoPlay) {
      setIsOn(true);
      setTimeout(onNext, 1500);
    }
  };

  useEffect(() => {
    if (autoPlay) {
      const t1 = setTimeout(() => setIsOn(true), 1500);
      const t2 = setTimeout(onNext, 3000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [autoPlay, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, backgroundColor: isOn ? "#fff7ed" : "#0f172a" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
    >
      <AnimatePresence>
        {!isOn && (
          <motion.p
            exit={{ opacity: 0 }}
            className="absolute top-32 text-slate-300 font-medium text-lg tracking-wide animate-pulse"
          >
            Kéo công tắc xuống để bật đèn nhé!
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ y: isOn ? 60 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-16 h-32 bg-slate-800 rounded-full border-4 border-slate-700 shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)] relative overflow-hidden flex items-start justify-center pt-2"
      >
        <motion.div
          drag={isOn ? false : "y"}
          dragConstraints={{ top: 0, bottom: 60 }}
          onDragEnd={handleDragEnd}
          animate={{ y: isOn ? 60 : autoPlay ? 0 : [0, 10, 0] }}
          transition={!isOn && !autoPlay ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" } : {}}
          className={`w-10 h-14 rounded-full shadow-lg flex items-center justify-center ${isOn ? 'bg-orange-400' : 'bg-slate-300'}`}
          style={{ cursor: isOn ? 'default' : 'grab' }}
        >
          <ChevronDown className={isOn ? 'text-orange-100' : 'text-slate-500'} />
        </motion.div>
      </motion.div>

      {isOn && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center pt-48"
        >
          <h1 className="text-5xl font-black text-orange-500 drop-shadow-md mb-4 text-center">SURPRISE!</h1>
          <p className="text-xl text-orange-400 font-bold">Happy Birthday {BIRTHDAY_DATA.name}! 🎉</p>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        </motion.div>
      )}
    </motion.div>
  );
}

// --- STEP 3: THE BALLOONS ---
function Step3Balloons({ onNext, autoPlay }: { onNext: () => void; autoPlay: boolean }) {
  const [poppedCount, setPoppedCount] = useState(0);
  const [balloons, setBalloons] = useState<{ id: number, x: number, delay: number, color: string, text: string, popped: boolean }[]>([]);

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
    if (autoPlay) return;
    setBalloons(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    setPoppedCount(prev => {
      const next = prev + 1;
      if (next >= 3) {
        setTimeout(onNext, 2000);
      }
      return next;
    });
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#fbcfe8', '#bfdbfe', '#fef08a']
    });
  };

  useEffect(() => {
    if (autoPlay && balloons.length > 0) {
      let count = 0;
      const interval = setInterval(() => {
        if (count < 3) {
          const unpopped = balloons.filter(b => !b.popped);
          if (unpopped.length > 0) {
            handlePop(unpopped[0].id);
          }
          count++;
        } else {
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
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
      <h2 className="text-2xl font-bold text-center px-6 text-slate-700 leading-relaxed z-20 bg-white/50 backdrop-blur-sm py-4 rounded-3xl mx-4">
        Chào mừng <span className="text-pink-500 font-black">{BIRTHDAY_DATA.name}</span> chính thức bước sang tuổi <span className="text-pink-500 font-black">{BIRTHDAY_DATA.age}</span>!
      </h2>
      <p className="text-slate-500 mt-2 z-20 text-sm font-medium">Chạm vào 3 quả bóng bay để xem điều bất ngờ!</p>

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
              onClick={() => handlePop(b.id)}
            >
              <div className={`w-20 h-24 ${b.color} rounded-[50%] shadow-inner flex items-center justify-center relative cursor-pointer hover:brightness-110`}>
                <div className="absolute -bottom-2 w-2 h-3 bg-white/50 rounded-sm" />
                <div className="absolute -bottom-16 w-[1px] h-16 bg-white/80" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: [0, 1, 1, 0], scale: 1, y: -50 }}
              transition={{ duration: 2 }}
              className="absolute z-20 font-black text-xl text-pink-500 drop-shadow-md whitespace-nowrap"
              style={{ left: `${b.x}%`, top: '40%' }} // approximate pop position
            >
              {b.text}
            </motion.div>
          )}
        </AnimatePresence>
      ))}
      
      <div className="absolute bottom-10 z-20 font-bold text-slate-400">
        Đã vỡ: {poppedCount}/3
      </div>
    </motion.div>
  );
}

// --- STEP 4: THE CAKE ---
function Step4Cake({ onNext, autoPlay }: { onNext: () => void; autoPlay: boolean }) {
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
      className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-between py-16 z-10"
    >
      <div className="text-center px-6">
        <h2 className="text-2xl font-bold text-amber-100 mb-2 drop-shadow-md">Make a Wish! 🌟</h2>
        <p className="text-slate-300 text-sm">Nhắm mắt lại, chắp tay và ước một điều thật to lớn đi nào!</p>
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
        <div className="text-9xl drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-0 -mt-2">
          🎂
        </div>
      </motion.div>

      <div className="relative w-64 h-16">
        <button
          onPointerDown={startBlowing}
          onPointerUp={stopBlowing}
          onPointerLeave={stopBlowing}
          disabled={blown || autoPlay}
          className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full font-bold text-white shadow-[0_5px_20px_rgba(245,158,11,0.4)] disabled:opacity-50 select-none z-10 touch-none flex items-center justify-center gap-2"
        >
          {blown ? "ĐÃ ƯỚC XONG ✨" : "NHẤN GIỮ ĐỂ THỔI NẾN 🌬️"}
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
function Step5Cards({ onNext, autoPlay }: { onNext: () => void; autoPlay: boolean }) {
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
      <div className="absolute top-16 text-center w-full px-6">
        <h2 className="text-2xl font-bold text-amber-700 font-serif">Lời Chúc Từ Trái Tim</h2>
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
              Lật thiệp
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// --- STEP 6: THE MEMORY WALL ---
function Step6Memory({ onNext, autoPlay }: { onNext: () => void; autoPlay: boolean }) {
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
      className="absolute inset-0 bg-stone-900 flex flex-col items-center justify-center p-6 z-10"
    >
      <h2 className="absolute top-16 text-xl font-medium text-stone-300 text-center px-4 leading-relaxed">
        Một năm qua cậu đã rực rỡ thế này cơ mà...
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={BIRTHDAY_DATA.photos[photoIndex]} 
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
function Step7Unboxing({ onNext, autoPlay }: { onNext: () => void; autoPlay: boolean }) {
  const [taps, setTaps] = useState(0);
  const maxTaps = 5;

  const handleTap = () => {
    if (taps < maxTaps && !autoPlay) {
      setTaps(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (taps >= maxTaps) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#ffffff']
      });
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
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-amber-600 mb-2 uppercase tracking-wide">Quà của cậu này!</h2>
        <p className="text-amber-700/70 font-medium">Chạm liên tục để xé giấy gói nhé!</p>
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
          <div className="text-9xl drop-shadow-[0_20px_30px_rgba(245,158,11,0.4)]">
            🎁
          </div>
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
              {BIRTHDAY_DATA.giftText}
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
function Step8Afterparty({ autoPlay }: { autoPlay: boolean }) {
  const [showPopup, setShowPopup] = useState(false);

  const handleClaim = () => {
    if (autoPlay) return;
    setShowPopup(true);
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#ff0000', '#ff69b4', '#ff1493', '#ffff00']
    });
  };

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
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center relative z-20"
      >
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500 mb-6 uppercase">
          Lên Đồ Thôi!
        </h2>
        
        <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 mb-8">
          <p className="font-bold text-rose-700">{BIRTHDAY_DATA.giftText}</p>
        </div>

        <motion.button
          onClick={autoPlay ? undefined : handleClaim}
          disabled={autoPlay}
          animate={{ scale: [1, 1.05, 1], boxShadow: ["0px 0px 0px rgba(244,63,94,0)", "0px 0px 20px rgba(244,63,94,0.6)", "0px 0px 0px rgba(244,63,94,0)"] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-black shadow-lg flex justify-center items-center gap-2 text-lg disabled:opacity-80 disabled:cursor-default"
        >
          NHẬN QUÀ NGAY 👗
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
            <div className="text-5xl mb-4">🥰</div>
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
