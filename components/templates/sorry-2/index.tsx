"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { TemplateNavigator } from "../TemplateNavigator";
import { WHACK_DATA } from "./config";
import { AlertTriangle, ChevronRight, Heart, HeartHandshake, ShieldAlert } from "lucide-react";

// --- BACKGROUND PARTICLES ---
function FloatingParticles({ step }: { step: number }) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number; emoji: string }[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const emojis = step >= 5 ? ["💖", "✨", "🌸"] : ["💧", "🌧️", "💧"];
    const p = Array.from({ length: isMobile ? 8 : 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 10,
      delay: Math.random() * 2,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setParticles(p);
  }, [step, isMobile]);

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
function Step1Trigger({ onNext, autoPlay, config }: { onNext: () => void; autoPlay: boolean; config: any }) {
  const [text, setText] = useState("");
  const fullText = config?.warnDesc || "Người này đã làm bạn giận. Bạn có quyền được xả giận ngay bây giờ!";
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
    }, 40);
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
      className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-pink-50/50 backdrop-blur-sm text-slate-800 overflow-hidden"
    >
      {/* Caution tape background */}
      <motion.div
        animate={{ y: [0, -40] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-[100%] pointer-events-none opacity-40"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, #fbcfe8 0, #fbcfe8 40px, #f9a8d4 40px, #f9a8d4 80px)", backgroundSize: "200% 200%" }}
      />

      <motion.div
        animate={{ opacity: [0, 0.3, 0, 0.6, 0], backgroundColor: ["rgba(255,255,255,0)", "#fecdd3", "rgba(255,255,255,0)", "#fecdd3", "rgba(255,255,255,0)"] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
        className="absolute inset-0 pointer-events-none mix-blend-color-burn"
      />

      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>
        <img src="/assets/sad/roflandz-mad-kitten.webp" className="w-24 h-24 object-contain mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" alt="mad" />
      </motion.div>

      <div className="bg-white/60 p-8 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.1)] backdrop-blur-xl border border-pink-200/50 min-h-[220px] flex items-center justify-center w-full relative z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-300 to-transparent opacity-50" />
        <p className="text-lg font-bold leading-relaxed text-slate-800">
          {text}<span className="animate-pulse text-pink-500">|</span>
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
            onClick={autoPlay ? undefined : onNext}
            disabled={autoPlay}
            className="mt-12 px-8 py-4 bg-gradient-to-b from-pink-500 to-rose-600 text-[#ffffff] rounded-full font-black shadow-2xl flex items-center gap-2 border-2 border-pink-300 z-10"
          >
            {config?.warnBtn || "Bắt đầu xả giận"}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- STEP 2: CHOOSE WEAPON ---
function Step2Weapon({ onNext, autoPlay, setWeapon, config }: { onNext: () => void; autoPlay: boolean; setWeapon: (w: string) => void; config: any }) {
  const weapons = [
    { id: "slipper", name: config?.weapon1 || "Dép Lào", emoji: "🩴" },
    { id: "pan", name: config?.weapon2 || "Chổi chà", emoji: "🧹" },
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
        <img src="/assets/dumb/hm.webp" className="w-24 h-24 object-contain mb-4 drop-shadow-lg" alt="weapon" />
      </motion.div>
      <h2 className="text-3xl font-black text-rose-800 mb-2 uppercase tracking-wide">{config?.weaponTitle || "Chọn Vũ Khí"}</h2>
      <p className="text-sm font-medium text-rose-700 mb-10 bg-white/60 px-4 py-2 rounded-full shadow-sm backdrop-blur-sm">Hãy chọn binh khí thuận tay nhất!</p>

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
            className={`p-5 rounded-3xl flex flex-col items-center justify-center gap-3 border-[4px] transition-colors relative overflow-hidden ${selected === w.id ? "bg-gradient-to-b from-orange-50 to-orange-100 border-orange-500" : "bg-white border-white hover:border-orange-200"
              }`}
          >
            {selected === w.id && (
              <motion.div layoutId="weapon-outline" className="absolute inset-0 border-4 border-orange-400 rounded-2xl pointer-events-none" />
            )}
            <span className="text-5xl drop-shadow-md">{w.emoji}</span>
            <span className="text-xs font-black text-rose-700 uppercase tracking-wider">{w.name}</span>
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
            onClick={autoPlay ? undefined : onNext}
            disabled={autoPlay}
            className="mt-12 px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-[#ffffff] rounded-full font-black shadow-[0_10px_30px_rgba(225,29,72,0.5)] flex items-center gap-2 border-2 border-pink-400"
          >
            Bắt đầu xả giận <ChevronRight size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- STEP 3: WHACK-A-LOVER ---
function Step3Whack({ onNext, autoPlay, weapon, compact, config }: { onNext: () => void; autoPlay: boolean; weapon: string; compact?: boolean; config: any }) {
  const [activeHole, setActiveHole] = useState<number>(-1);
  const [health, setHealth] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState<{ id: number, text: string, x: number, y: number }[]>([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const [whacking, setWhacking] = useState(false);
  const hitSoundRef = useRef<HTMLAudioElement>(null);
  
  const maxHealth = parseInt(config?.gameTarget) || 10;

  // Random active hole
  useEffect(() => {
    if (health >= maxHealth) return;
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
    if (autoPlay && activeHole !== -1 && health < maxHealth) {
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
    if (index !== activeHole || health >= maxHealth) return;

    if (hitSoundRef.current && !(compact && !autoPlay)) {
      hitSoundRef.current.currentTime = 0;
      hitSoundRef.current.play().catch(() => {});
    }

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

    if (newHealth >= maxHealth) {
      setTimeout(onNext, 1500);
    }
  };

  return (
    <>
    <audio ref={hitSoundRef} src="/assets/vfx/glass-break.mp3" preload="auto" muted={compact && !autoPlay} />
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
      <div className="w-full max-w-[280px] h-8 bg-pink-200 rounded-full mb-10 overflow-hidden border-4 border-pink-300 relative shadow-[inset_0_5px_10px_rgba(0,0,0,0.1)]">
        <motion.div
          className="h-full bg-gradient-to-r from-rose-500 via-red-500 to-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${(health / maxHealth) * 100}%` }}
          transition={{ type: "spring", stiffness: 100 }}
        />
        {/* Shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-[#ffffff] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          {health} / {maxHealth}
        </div>
      </div>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-[320px] p-4 bg-pink-100/50 rounded-3xl backdrop-blur-sm border border-white/40 shadow-xl">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="relative w-full aspect-square bg-gradient-to-b from-pink-200 to-rose-300 rounded-full border-[6px] border-pink-300 shadow-[inset_0_-10px_20px_rgba(244,63,94,0.3),_0_5px_15px_rgba(0,0,0,0.1)] overflow-hidden flex items-end justify-center">
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
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-100 to-pink-300 border-4 border-slate-900 overflow-hidden relative shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
                    <img src={WHACK_DATA.avatar || "/assets/sad/el-gato.webp"} alt="avatar" className="w-full h-full object-cover pointer-events-none" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Front lip of the hole to cover bottom of character */}
            <div className="absolute bottom-[-5%] w-[110%] h-[30%] bg-gradient-to-b from-rose-300 to-rose-400 rounded-t-[50%] rounded-b-full pointer-events-none shadow-[inset_0_2px_5px_rgba(255,255,255,0.4)] border-t border-rose-300" />
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
    </>
  );
}

// --- STEP 4: BANDAGED FACE ---
function Step4Bandaged({ onNext, autoPlay, config }: { onNext: () => void; autoPlay: boolean; config: any }) {
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
        <img src={WHACK_DATA.photo2 || "/assets/sad/lots-of-tears-crying-hard.webp"} alt="avatar" className="w-full h-full object-cover filter brightness-90 sepia-[0.2]" />

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
        <h3 className="text-slate-900 font-bold mb-2 text-lg text-center">{config?.bandageTitle || "Á ui... đau quá!"}</h3>
        <p className="text-slate-800 font-medium leading-relaxed text-[15px]">
          {config?.bandageDesc || "\"Ui cha mẹ ơi... Đánh xong rồi, đằng ấy đã xả hết giận chưa? Xót người ta chưa? 🥺 Nếu bớt giận rồi thì cho người ta giải thích nhé?\""}
        </p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-[#ffffff] rounded-full font-black shadow-[0_10px_20px_rgba(244,63,94,0.4)] flex items-center gap-2 border-2 border-pink-300"
      >
        {config?.bandageBtn || "Giải thích đi nghe thử 😒"}
      </motion.button>
    </motion.div>
  );
}

// --- STEP 5: CONFESSION ---
function Step5Confession({ onNext, autoPlay, config }: { onNext: () => void; autoPlay: boolean; config: any }) {
  const [text, setText] = useState("");
  const fullText = config?.apologyText || WHACK_DATA.letter;
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
    }, 60);
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
            {config?.apologyBtn || "Tha thứ"} <ChevronRight className="inline" size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- STEP 6: PROMISE ---
function Step6Promise({ onNext, autoPlay, config }: { onNext: () => void; autoPlay: boolean; config: any }) {
  const [text, setText] = useState("");
  const fullText = config?.successDesc || "Từ nay tớ hứa sẽ ngoan, không cãi lời, không làm đằng ấy phải dỗi nữa. Cho tớ một cơ hội chuộc lỗi bằng một cốc trà sữa to chà bá nhé? 🧋";
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
            onClick={autoPlay ? undefined : onNext}
            disabled={autoPlay}
            className="mt-12 px-8 py-4 bg-gradient-to-r from-orange-400 to-rose-500 text-[#ffffff] rounded-full font-black shadow-[0_10px_20px_rgba(244,63,94,0.4)] transition-transform flex items-center gap-2 border-2 border-white"
          >
            {config?.successTitle || "Hòa nhé!"} <img src="/assets/happy/kiss-love.webp" className="w-8 h-8 object-contain" alt="kiss" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- STEP 7: VERDICT ---
function Step7Verdict({ onNext, autoPlay, config }: { onNext: () => void; autoPlay: boolean; config: any }) {
  const [noClickCount, setNoClickCount] = useState(0);
  const [pleading, setPleading] = useState(false);

  const handleNoClick = () => {
    if (autoPlay) return;
    setNoClickCount(prev => prev + 1);
    setPleading(true);
    setTimeout(() => setPleading(false), 2000);
  };

  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(onNext, 2000);
      return () => clearTimeout(t);
    }
  }, [autoPlay, onNext]);

  const yesScale = 1 + noClickCount * 0.3;
  const noScale = Math.max(0, 1 - noClickCount * 0.25);
  const showNo = noClickCount < 4;

  const pleadingTexts = [
    "Tha cho tui đi mà! 😭",
    "Đừng đánh nữa đau quá! 🤕",
    "Nút nhỏ xíu rồi kìa! 😱",
    "Chết tui rồi... 👻"
  ];
  const pleadingText = pleadingTexts[Math.min(noClickCount > 0 ? noClickCount - 1 : 0, pleadingTexts.length - 1)];

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
      >
        <img src="/assets/dumb/auau.webp" className="w-24 h-24 object-contain mx-auto drop-shadow-xl" alt="verdict" />
      </motion.div>
      <h2 className="text-4xl font-black text-rose-600 mb-4 uppercase tracking-wider drop-shadow-sm">Tòa Tuyên Án</h2>
      <p className="text-slate-700 font-bold mb-12 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-white/50">
        Bị cáo đã nhận tội, quan tòa phán quyết sao đây?
      </p>

      <div className="flex flex-col gap-6 w-full max-w-xs relative h-[180px] justify-center items-center">
        <motion.button
          onClick={onNext}
          animate={{ scale: [yesScale, yesScale * 1.05, yesScale], boxShadow: ["0px 0px 0px rgba(244,63,94,0)", "0px 0px 30px rgba(244,63,94,0.8)", "0px 0px 0px rgba(244,63,94,0)"] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="px-6 py-5 bg-gradient-to-r from-orange-400 to-rose-500 text-[#ffffff] rounded-full font-black shadow-2xl border-4 border-white flex items-center justify-center gap-2 z-20 origin-center whitespace-nowrap"
          style={{ width: "100%" }}
        >
          <img src="/assets/happy/love-valentines.webp" className="w-6 h-6 object-contain" alt="heart" /> THA THỨ (KÈM TRÀ SỮA) 🧋
        </motion.button>

        {showNo && (
          <motion.button
            animate={{ scale: noScale }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={handleNoClick}
            className="px-6 py-4 bg-slate-800 text-[#ffffff] rounded-full font-bold border-4 border-slate-700 flex items-center justify-center gap-2 z-10 transition-colors shadow-[0_5px_15px_rgba(0,0,0,0.3)] absolute w-full bottom-0 origin-center"
          >
            ĐÁNH TIẾP 🔨
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {pleading && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-10 bg-gradient-to-r from-red-600 to-rose-600 text-[#ffffff] px-6 py-3 rounded-2xl shadow-xl font-bold whitespace-nowrap z-30"
          >
            {pleadingText}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-rose-600 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- MAIN TEMPLATE ---
export default function Sorry2Template({ compact = false, autoPlay = false, hideNavigation = false, isBuilderPreview = false, config, generalAudioUrl }: { compact?: boolean; autoPlay?: boolean; hideNavigation?: boolean; isBuilderPreview?: boolean; config?: any; generalAudioUrl?: string }) {
  const [step, setStep] = useState(1);
  const [weapon, setWeapon] = useState("🔨");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().catch(() => {});
    } else if (compact && !isBuilderPreview && audioRef.current) {
      audioRef.current.pause();
    }
  }, [autoPlay, compact, isBuilderPreview, generalAudioUrl]);

  const bgImages = [
    "url('/assets/bg/bg1.jpg')",
    "url('/assets/bg/bg2.jpg')",
    "url('/assets/bg/bg3.jpg')",
    "url('/assets/bg/bg4.jpg')",
    "url('/assets/bg/bg5.jpg')",
    "url('/assets/bg/bg6.jpg')",
    "url('/assets/bg/bg7.jpg')",
    "url('/assets/bg/bg8.jpg')",
  ];

  const bgColors = [
    "from-pink-100 to-rose-100", // 1 trigger
    "from-pink-50 to-pink-100", // 2 weapon
    "from-rose-100 to-pink-200",   // 3 whack
    "from-pink-100 to-rose-200", // 4 bandaged
    "from-rose-100 to-pink-200", // 5 confession
    "from-pink-100 to-fuchsia-100",   // 6 promise
    "from-fuchsia-100 to-pink-200",   // 7 verdict
    "from-pink-100 to-rose-200", // 8 end
  ];

  const currentBg = bgColors[step - 1] || bgColors[bgColors.length - 1];
  const currentImg = bgImages[step - 1] || bgImages[bgImages.length - 1];

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
    <div 
      className={`relative w-full overflow-hidden transition-colors duration-1000 text-slate-800 mx-auto ${compact || isBuilderPreview ? 'h-full' : 'max-w-[400px] h-[800px] max-h-[90vh] rounded-[3rem] shadow-2xl border-[10px] border-pink-200'}`}
      style={{ backgroundImage: currentImg, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${currentBg} backdrop-blur-sm bg-opacity-80`} />
      {generalAudioUrl && <audio ref={audioRef} src={generalAudioUrl} loop autoPlay={autoPlay} muted={compact && !isBuilderPreview && !autoPlay} />}
      <FloatingParticles step={step} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-50" />

      <AnimatePresence mode="wait">
        {step === 1 && <Step1Trigger key="s1" onNext={handleNext} autoPlay={autoPlay} config={config} />}
        {step === 2 && <Step2Weapon key="s2" onNext={handleNext} autoPlay={autoPlay} setWeapon={setWeapon} config={config} />}
        {step === 3 && <Step3Whack key="s3" onNext={handleNext} autoPlay={autoPlay} weapon={weapon} compact={compact} config={config} />}
        {step === 4 && <Step4Bandaged key="s4" onNext={handleNext} autoPlay={autoPlay} config={config} />}
        {step === 5 && <Step5Confession key="s5" onNext={handleNext} autoPlay={autoPlay} config={config} />}
        {step === 6 && <Step6Promise key="s6" onNext={handleNext} autoPlay={autoPlay} config={config} />}
        {step === 7 && <Step7Verdict key="s7" onNext={handleNext} autoPlay={autoPlay} config={config} />}
        {step === 8 && (
          <motion.div
            key="s8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 text-[#ffffff]"
          >
            <h2 className="text-4xl font-black mb-6 drop-shadow-lg text-center leading-tight bg-white/70 text-pink-600 px-4 py-2 rounded-full">{config?.successTitle || "Yayyy! Cảm ơn cục cưng! 🥰"}</h2>
            <div className="bg-white/40 p-6 rounded-3xl backdrop-blur-md border border-white/60 shadow-2xl text-slate-800">
              <p className="text-xl font-bold mb-4">{config?.successDesc || "Tớ qua đón đi chơi liền đây!"}</p>
              <img src={WHACK_DATA.photo3 || "/assets/happy/cute-love.webp"} className="w-32 h-32 object-cover mx-auto animate-bounce mt-4 drop-shadow-xl rounded-2xl border-4 border-white" alt="cute" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <TemplateNavigator
        currentIndex={step - 1}
        totalSteps={8}
        onPrev={() => setStep(s => Math.max(1, s - 1))}
        onNext={() => setStep(s => Math.min(8, s + 1))}
        accentColor="#f97316"
        isHidden={hideNavigation || autoPlay}
      />
    </div>
  );
}
