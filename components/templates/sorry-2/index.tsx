"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { WHACK_DATA } from "./config";
import { AlertTriangle, ChevronRight, Heart, HeartHandshake, ShieldAlert } from "lucide-react";

// --- BACKGROUND PARTICLES ---
function FloatingParticles({ step }: { step: number }) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number; emoji: string }[]>([]);
  
  useEffect(() => {
    let emojis = ['✨', '💖', '🌸', '🎀'];
    if (step === 1) emojis = ['💢', '🌩️', '😡', '🔥'];
    else if (step === 2 || step === 3) emojis = ['💢', '💥', '💦', '💨'];
    else if (step === 4) emojis = ['🩹', '💧', '🥺', '💔'];

    const p = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }));
    setParticles(p);
  }, [step]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: p.size }}
          animate={{
            y: [0, -50, 0],
            x: [0, 30, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}

// --- STEP 1: TRIGGER ---
function Step1Trigger({ onNext, autoPlay }: { onNext: () => void; autoPlay: boolean }) {
  const [text, setText] = useState("");
  const fullText = "Phát hiện có người đang rất cục súc và giận dữ! Cục tức này nếu không xả ra sẽ rất hại sức khỏe. Muốn đập cho tên đáng ghét kia một trận không?";
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
    }, autoPlay ? 5 : 40);
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
      key="step1"
      exit={{ opacity: 0, scale: 1.1 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-slate-900 text-[#ffffff] overflow-hidden"
    >
      {/* Caution tape background */}
      <motion.div 
        animate={{ y: [0, -40] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-[100%] pointer-events-none opacity-10" 
        style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 0, #000 40px, #f59e0b 40px, #f59e0b 80px)", backgroundSize: "200% 200%" }} 
      />
      
      <motion.div
        animate={{ opacity: [0, 0.3, 0, 0.6, 0], backgroundColor: ["transparent", "#ef4444", "transparent", "#ef4444", "transparent"] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
        className="absolute inset-0 pointer-events-none mix-blend-color-burn"
      />
      
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>
        <AlertTriangle size={80} className="text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
      </motion.div>
      
      <div className="bg-slate-800/80 p-8 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-xl border border-red-500/30 min-h-[220px] flex items-center justify-center w-full relative z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
        <p className="text-lg font-bold leading-relaxed text-red-50">
          {text}<span className="animate-pulse text-red-500">|</span>
        </p>
      </div>

      <AnimatePresence>
        {done && (
          <motion.button
            key="btn-step1"
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(220,38,38,0.6)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="mt-12 px-8 py-4 bg-gradient-to-b from-red-500 to-red-700 text-[#ffffff] rounded-full font-black shadow-2xl flex items-center gap-2 border-2 border-red-400 z-10"
          >
            Đưa nó ra đây cho bà! 😡
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- STEP 2: CHOOSE WEAPON ---
function Step2Weapon({ onNext, autoPlay, setWeapon }: { onNext: () => void; autoPlay: boolean; setWeapon: (w: string) => void }) {
  const weapons = [
    { id: "slipper", name: "Dép Lào", emoji: "🩴" },
    { id: "pan", name: "Chảo Chống Dính", emoji: "🍳" },
    { id: "hammer", name: "Búa Nhựa", emoji: "🔨" },
    { id: "radish", name: "Củ Cải", emoji: "🥖" }, // standard baguette as radish placeholder if missing, or we can use 🥕
  ];
  
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (autoPlay) {
      const t1 = setTimeout(() => setSelected("hammer"), 1000);
      const t2 = setTimeout(onNext, 2500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [autoPlay, onNext]);

  useEffect(() => {
    if (selected) {
      const w = weapons.find(x => x.id === selected);
      if (w) setWeapon(w.emoji);
    }
  }, [selected, weapons, setWeapon]);

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10"
    >
      <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
        <ShieldAlert size={60} className="text-orange-500 mb-4 drop-shadow-lg" />
      </motion.div>
      <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-wide">Chọn Vũ Khí</h2>
      <p className="text-sm font-medium text-slate-600 mb-10 bg-white/50 px-4 py-2 rounded-full shadow-sm backdrop-blur-sm">Hãy chọn binh khí thuận tay nhất!</p>

      <div className="grid grid-cols-2 gap-5 w-full max-w-[300px]">
        {weapons.map((w, i) => (
          <motion.button
            key={w.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, boxShadow: selected === w.id ? "0 10px 25px -5px rgba(249,115,22,0.5)" : "0 4px 6px -1px rgba(0,0,0,0.1)" }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(w.id)}
            className={`p-5 rounded-3xl flex flex-col items-center justify-center gap-3 border-[4px] transition-colors relative overflow-hidden ${
              selected === w.id ? "bg-gradient-to-b from-orange-50 to-orange-100 border-orange-500" : "bg-white border-white hover:border-orange-200"
            }`}
          >
            {selected === w.id && (
              <motion.div layoutId="weapon-outline" className="absolute inset-0 border-4 border-orange-400 rounded-2xl pointer-events-none" />
            )}
            <span className="text-5xl drop-shadow-md">{w.emoji}</span>
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">{w.name}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.button
            key="btn-step2"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="mt-12 px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-[#ffffff] rounded-full font-black shadow-[0_10px_30px_rgba(15,23,42,0.5)] flex items-center gap-2 border-2 border-slate-700"
          >
            Bắt đầu xả giận <ChevronRight size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- STEP 3: WHACK-A-LOVER ---
function Step3Whack({ onNext, autoPlay, weapon }: { onNext: () => void; autoPlay: boolean; weapon: string }) {
  const [activeHole, setActiveHole] = useState<number>(-1);
  const [health, setHealth] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState<{id: number, text: string, x: number, y: number}[]>([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const [whacking, setWhacking] = useState(false);

  // Random active hole
  useEffect(() => {
    if (health >= 10) return;
    const interval = setInterval(() => {
      let nextHole;
      do {
        nextHole = Math.floor(Math.random() * 9);
      } while (nextHole === activeHole);
      setActiveHole(nextHole);
    }, 800 - (health * 30)); // speed up as health increases

    return () => clearInterval(interval);
  }, [activeHole, health]);

  // Autoplay bot
  useEffect(() => {
    if (autoPlay && activeHole !== -1 && health < 10) {
      const t = setTimeout(() => {
        handleHit(activeHole, 150 + Math.random() * 50, 300 + Math.random() * 100);
      }, 400);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, activeHole, health]);

  const handlePointerMove = (e: React.PointerEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
    setShowCursor(true);
  };

  const handlePointerDown = () => {
    setWhacking(true);
    setTimeout(() => setWhacking(false), 150);
  };

  const handleHit = (index: number, cx: number, cy: number) => {
    if (index !== activeHole || health >= 10) return;
    
    // Add floating text
    const randomText = WHACK_DATA.hitVoices[Math.floor(Math.random() * WHACK_DATA.hitVoices.length)];
    const newId = Date.now();
    setFloatingTexts(prev => [...prev, { id: newId, text: randomText, x: cx, y: cy }]);
    
    // Clean up floating text
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== newId));
    }, 1000);

    // Increase progress
    const newHealth = health + 1;
    setHealth(newHealth);
    setActiveHole(-1); // hide immediately

    if (newHealth >= 10) {
      setTimeout(onNext, 1500);
    }
  };

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`absolute inset-0 flex flex-col items-center p-6 z-10 ${showCursor && !autoPlay ? 'cursor-none' : ''}`}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
    >
      <motion.h2 
        animate={{ scale: [1, 1.1, 1] }} 
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="text-4xl font-black text-rose-600 mt-8 mb-4 uppercase text-center drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]"
      >
        Đập nó đi!
      </motion.h2>
      
      {/* Health Bar */}
      <div className="w-full max-w-[280px] h-8 bg-slate-800 rounded-full mb-10 overflow-hidden border-4 border-slate-900 relative shadow-[inset_0_5px_10px_rgba(0,0,0,0.5)]">
        <motion.div 
          className="h-full bg-gradient-to-r from-rose-500 via-red-500 to-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${(health / 10) * 100}%` }}
          transition={{ type: "spring", stiffness: 100 }}
        />
        {/* Shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-[#ffffff] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          {health} / 10
        </div>
      </div>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-[320px] p-4 bg-slate-800/20 rounded-3xl backdrop-blur-sm border border-white/10 shadow-xl">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="relative w-full aspect-square bg-gradient-to-b from-slate-900 to-black rounded-full border-[6px] border-slate-700 shadow-[inset_0_-15px_25px_rgba(0,0,0,0.8),_0_5px_15px_rgba(0,0,0,0.5)] overflow-hidden flex items-end justify-center">
            {/* The character */}
            <AnimatePresence>
              {activeHole === i && (
                <motion.div
                  key={`hole-${i}`}
                  initial={{ y: "100%" }}
                  animate={{ y: "15%" }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="w-[85%] h-[85%] origin-bottom absolute bottom-0 cursor-pointer"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    handlePointerDown();
                    const rect = e.currentTarget.getBoundingClientRect();
                    handleHit(i, rect.left + rect.width / 2, rect.top);
                  }}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-100 to-orange-300 border-4 border-slate-900 overflow-hidden relative shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
                    <img src={WHACK_DATA.avatar} alt="avatar" className="w-full h-full object-cover pointer-events-none" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Front lip of the hole to cover bottom of character */}
            <div className="absolute bottom-[-5%] w-[110%] h-[30%] bg-gradient-to-b from-slate-700 to-slate-800 rounded-t-[50%] rounded-b-full pointer-events-none shadow-[inset_0_2px_5px_rgba(255,255,255,0.1)] border-t border-slate-500" />
          </div>
        ))}
      </div>

      {/* Floating texts */}
      <AnimatePresence>
        {floatingTexts.map(ft => (
          <motion.div
            key={ft.id}
            initial={{ opacity: 1, y: 0, x: (Math.random() - 0.5) * 50, scale: 0.5 }}
            animate={{ opacity: 0, y: -100, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed text-2xl font-black text-red-500 drop-shadow-[0_2px_2px_rgba(255,255,255,1)] pointer-events-none z-40 whitespace-nowrap"
            style={{ left: ft.x - 40, top: ft.y - 40 }}
          >
            {ft.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Custom Cursor Weapon */}
      {!autoPlay && showCursor && (
        <motion.div
          className="fixed pointer-events-none z-50 text-6xl drop-shadow-2xl"
          style={{ left: cursorPos.x - 30, top: cursorPos.y - 30 }}
          animate={{ rotate: whacking ? -45 : 0, scale: whacking ? 0.8 : 1 }}
          transition={{ duration: 0.05 }}
        >
          {weapon}
        </motion.div>
      )}
    </motion.div>
  );
}

// --- STEP 4: BANDAGED FACE ---
function Step4Bandaged({ onNext, autoPlay }: { onNext: () => void; autoPlay: boolean }) {
  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(onNext, 3000);
      return () => clearTimeout(t);
    }
  }, [autoPlay, onNext]);

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, -5, 5, -5, 5, 0] }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="relative w-56 h-56 rounded-full border-[10px] border-white shadow-[0_15px_35px_rgba(0,0,0,0.3)] mb-10 overflow-hidden bg-orange-100"
      >
        <img src={WHACK_DATA.avatar} alt="avatar" className="w-full h-full object-cover filter brightness-90 sepia-[0.2]" />
        
        {/* Band-aids */}
        <div className="absolute top-[20%] left-[20%] w-16 h-5 bg-[#e8ba98] rotate-45 border-2 border-[#d29b74] rounded-full opacity-95 shadow-md flex items-center justify-center overflow-hidden">
          <div className="w-2 h-2 rounded-full bg-[#d29b74]/50" />
        </div>
        <div className="absolute top-[20%] left-[20%] w-16 h-5 bg-[#e8ba98] -rotate-45 border-2 border-[#d29b74] rounded-full opacity-95 shadow-md flex items-center justify-center overflow-hidden">
          <div className="w-2 h-2 rounded-full bg-[#d29b74]/50" />
        </div>
        
        <div className="absolute bottom-[30%] right-[20%] w-12 h-4 bg-[#e8ba98] rotate-[15deg] border-2 border-[#d29b74] rounded-full opacity-95 shadow-md flex items-center justify-center overflow-hidden">
          <div className="w-1 h-1 rounded-full bg-[#d29b74]/50" />
        </div>

        {/* Tears */}
        <motion.div 
          animate={{ y: [0, 50], opacity: [1, 0], scale: [1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeIn" }}
          className="absolute top-[40%] left-[30%] text-3xl drop-shadow-sm"
        >💧</motion.div>
        <motion.div 
          animate={{ y: [0, 60], opacity: [1, 0], scale: [1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.6, ease: "easeIn" }}
          className="absolute top-[45%] right-[30%] text-3xl drop-shadow-sm"
        >💧</motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/95 p-6 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur-md border-2 border-white mb-10 relative w-full max-w-[320px]"
      >
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[20px] border-b-white/95" />
        <p className="text-slate-800 font-bold leading-relaxed text-[15px]">
          "Ui cha mẹ ơi... Đánh xong rồi, đằng ấy đã xả hết giận chưa? Xót người ta chưa? 🥺 Nếu bớt giận rồi thì cho người ta giải thích nhé?"
        </p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="px-8 py-4 bg-slate-800 text-[#ffffff] rounded-full font-black shadow-[0_10px_20px_rgba(15,23,42,0.4)] flex items-center gap-2 border-2 border-slate-700"
      >
        Giải thích đi nghe thử 😒
      </motion.button>
    </motion.div>
  );
}

// --- STEP 5: CONFESSION ---
function Step5Confession({ onNext, autoPlay }: { onNext: () => void; autoPlay: boolean }) {
  const [text, setText] = useState("");
  const fullText = WHACK_DATA.letter;
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
    }, autoPlay ? 5 : 60);
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
      <motion.div
        className="bg-[#fffdf8] p-8 rounded-sm shadow-[5px_15px_30px_rgba(0,0,0,0.2)] w-full max-w-sm relative min-h-[350px] border border-[#f5ebd7]"
        style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e2e8f0 31px, #e2e8f0 32px)", lineHeight: "32px", backgroundAttachment: "local" }}
      >
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/60 backdrop-blur-md -rotate-3 border border-white/40 shadow-sm rounded-sm" /> {/* Tape */}
        <p className="text-slate-700 font-medium text-lg italic pt-6 px-2 drop-shadow-sm font-serif">
          {text}<span className="animate-pulse text-rose-500">_</span>
        </p>
      </motion.div>

      <AnimatePresence>
        {done && (
          <motion.button
            key="btn-step5"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="mt-12 px-8 py-4 bg-gradient-to-r from-orange-400 to-rose-500 text-[#ffffff] rounded-full font-black shadow-[0_10px_20px_rgba(244,63,94,0.4)] transition-transform border-2 border-white flex items-center gap-2"
          >
            Đọc tiếp <ChevronRight className="inline" size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- STEP 6: PROMISE ---
function Step6Promise({ onNext, autoPlay }: { onNext: () => void; autoPlay: boolean }) {
  const [text, setText] = useState("");
  const fullText = "Từ nay tớ hứa sẽ ngoan, không cãi lời, không làm đằng ấy phải dỗi nữa. Cho tớ một cơ hội chuộc lỗi bằng một cốc trà sữa to chà bá nhé? 🧋";
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
    }, autoPlay ? 5 : 60);
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
      key="step6"
      initial={{ opacity: 0, rotateY: -90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6, type: "spring", damping: 15 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10"
      style={{ perspective: 1500 }}
    >
      <motion.div
        className="bg-[#fffdf8] p-8 rounded-sm shadow-[5px_15px_30px_rgba(0,0,0,0.2)] w-full max-w-sm relative min-h-[350px] border border-[#f5ebd7]"
        style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e2e8f0 31px, #e2e8f0 32px)", lineHeight: "32px", backgroundAttachment: "local" }}
      >
        <div className="absolute -top-4 right-8 w-24 h-8 bg-white/60 backdrop-blur-md rotate-6 border border-white/40 shadow-sm rounded-sm" /> {/* Tape right */}
        <p className="text-slate-700 font-medium text-lg italic pt-6 px-2 drop-shadow-sm font-serif">
          {text}<span className="animate-pulse text-rose-500">_</span>
        </p>
      </motion.div>

      <AnimatePresence>
        {done && (
          <motion.button
            key="btn-step6"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="mt-12 px-8 py-4 bg-gradient-to-r from-orange-400 to-rose-500 text-[#ffffff] rounded-full font-black shadow-[0_10px_20px_rgba(244,63,94,0.4)] transition-transform flex items-center gap-2 border-2 border-white"
          >
            Chốt kèo <HeartHandshake size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- STEP 7: VERDICT ---
function Step7Verdict({ onNext, autoPlay }: { onNext: () => void; autoPlay: boolean }) {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [pleading, setPleading] = useState(false);

  const moveNo = () => {
    if (autoPlay) return;
    const spreadX = 220;
    const spreadY = 220;
    let newX = (Math.random() - 0.5) * spreadX;
    let newY = (Math.random() - 0.5) * spreadY;
    if (Math.abs(newX - noPos.x) < 70) newX = newX > noPos.x ? newX + 70 : newX - 70;
    if (Math.abs(newY - noPos.y) < 70) newY = newY > noPos.y ? newY + 70 : newY - 70;
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
      key="step7"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10"
    >
      <motion.div 
        animate={{ rotate: [-5, 5, -5] }} 
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="text-7xl mb-8 drop-shadow-[0_5px_15px_rgba(244,63,94,0.4)]"
      >
        ⚖️
      </motion.div>
      <h2 className="text-4xl font-black text-rose-600 mb-4 uppercase tracking-wider drop-shadow-sm">Tòa Tuyên Án</h2>
      <p className="text-slate-700 font-bold mb-12 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-white/50">
        Bị cáo đã nhận tội, quan tòa phán quyết sao đây?
      </p>

      <div className="flex flex-col gap-6 w-full max-w-xs relative h-[180px] justify-center">
        <motion.button
          onClick={onNext}
          animate={{ scale: [1, 1.05, 1], boxShadow: ["0px 0px 0px rgba(244,63,94,0)", "0px 0px 30px rgba(244,63,94,0.8)", "0px 0px 0px rgba(244,63,94,0)"] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="px-6 py-5 bg-gradient-to-r from-orange-400 to-rose-500 text-[#ffffff] rounded-full font-black shadow-2xl border-4 border-white flex items-center justify-center gap-2 z-20"
        >
          <Heart size={24} fill="currentColor" /> THA THỨ (KÈM TRÀ SỮA) 🧋
        </motion.button>

        <motion.button
          animate={noPos}
          transition={{ type: "spring", stiffness: 1200, damping: 14, mass: 0.2 }}
          onHoverStart={moveNo}
          onPointerEnter={moveNo}
          onTouchStart={moveNo}
          onClick={forceNoClick}
          className="px-6 py-4 bg-slate-800 text-slate-300 rounded-full font-bold border-4 border-slate-700 flex items-center justify-center gap-2 z-10 transition-colors shadow-[0_5px_15px_rgba(0,0,0,0.3)] absolute w-full bottom-0"
        >
          ĐÁNH TIẾP 🔨
        </motion.button>
      </div>

      <AnimatePresence>
        {pleading && (
          <motion.div
            key="pleading-toast"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="absolute bottom-10 bg-gradient-to-r from-red-600 to-rose-600 text-[#ffffff] px-6 py-4 rounded-3xl shadow-2xl font-bold max-w-[85%] border-2 border-red-400"
          >
            Máu tụt đáy rồi, đánh nữa là chầu ông bà đó 😭 Tha đi!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- MAIN TEMPLATE ---
export default function Sorry2Template({ compact = false, autoPlay = false }: { compact?: boolean; autoPlay?: boolean }) {
  const [step, setStep] = useState(1);
  const [weapon, setWeapon] = useState("🔨");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const bgColors = [
    "from-slate-800 to-slate-900", // 1 trigger
    "from-slate-100 to-orange-50", // 2 weapon
    "from-red-50 to-orange-100",   // 3 whack
    "from-orange-100 to-amber-50", // 4 bandaged
    "from-orange-200 to-rose-200", // 5 confession
    "from-rose-200 to-pink-200",   // 6 promise
    "from-pink-100 to-rose-100",   // 7 verdict
    "from-rose-400 to-orange-400", // 8 end
  ];

  const currentBg = bgColors[step - 1] || bgColors[bgColors.length - 1];

  const triggerConfetti = useCallback(() => {
    if (!canvasRef.current) return;
    const myConfetti = confetti.create(canvasRef.current, { resize: true, useWorker: true });
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      myConfetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors: ['#fb923c', '#f43f5e', '#fbbf24'] });
      myConfetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors: ['#fb923c', '#f43f5e', '#fbbf24'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const handleNext = useCallback(() => {
    if (step === 7) {
      triggerConfetti();
      setStep(8);
      if (autoPlay) {
        setTimeout(() => setStep(1), 4000);
      }
    } else {
      setStep(s => s + 1);
    }
  }, [step, autoPlay, triggerConfetti]);

  return (
    <div className={`relative w-full overflow-hidden transition-colors duration-1000 bg-gradient-to-b ${currentBg} text-slate-800 touch-none mx-auto ${compact ? 'h-full' : 'max-w-[400px] h-[800px] max-h-[90vh] rounded-[3rem] shadow-2xl border-[10px] border-[#ffffff]'}`}>
      <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0" />
      <FloatingParticles step={step} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-50" />
      
      <AnimatePresence mode="wait">
        {step === 1 && <Step1Trigger key="s1" onNext={handleNext} autoPlay={autoPlay} />}
        {step === 2 && <Step2Weapon key="s2" onNext={handleNext} autoPlay={autoPlay} setWeapon={setWeapon} />}
        {step === 3 && <Step3Whack key="s3" onNext={handleNext} autoPlay={autoPlay} weapon={weapon} />}
        {step === 4 && <Step4Bandaged key="s4" onNext={handleNext} autoPlay={autoPlay} />}
        {step === 5 && <Step5Confession key="s5" onNext={handleNext} autoPlay={autoPlay} />}
        {step === 6 && <Step6Promise key="s6" onNext={handleNext} autoPlay={autoPlay} />}
        {step === 7 && <Step7Verdict key="s7" onNext={handleNext} autoPlay={autoPlay} />}
        {step === 8 && (
          <motion.div
            key="s8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 text-[#ffffff]"
          >
            <h2 className="text-4xl font-black mb-6 drop-shadow-lg text-center leading-tight">Yayyy! Cảm ơn cục cưng! 🥰</h2>
            <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-md border border-white/40 shadow-2xl">
              <p className="text-xl font-medium mb-4">Tớ qua đón đi chơi liền đây!</p>
              <div className="text-6xl animate-bounce mt-4">🛵💨</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
