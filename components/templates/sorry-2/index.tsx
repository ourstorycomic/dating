"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { WHACK_DATA } from "./config";
import { AlertTriangle, ChevronRight, Heart, HeartHandshake, ShieldAlert } from "lucide-react";

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
      className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-slate-800 text-white"
    >
      <motion.div
        animate={{ opacity: [0, 0.2, 0, 0.5, 0], backgroundColor: ["transparent", "#ffffff", "transparent", "#ffffff", "transparent"] }}
        transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
        className="absolute inset-0 pointer-events-none"
      />
      <AlertTriangle size={64} className="text-red-500 mb-6 drop-shadow-md animate-pulse" />
      <div className="bg-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-md border border-white/20 min-h-[200px] flex items-center justify-center w-full relative">
        <p className="text-lg font-bold leading-relaxed text-red-100">
          {text}<span className="animate-pulse">|</span>
        </p>
      </div>

      <AnimatePresence>
        {done && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onNext}
            className="mt-10 px-8 py-4 bg-red-600 text-white rounded-full font-black shadow-xl hover:bg-red-700 hover:scale-105 transition-all flex items-center gap-2"
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
      <ShieldAlert size={48} className="text-orange-500 mb-4" />
      <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase">Chọn Vũ Khí</h2>
      <p className="text-sm font-medium text-slate-600 mb-8">Hãy chọn một món binh khí thuận tay nhất để xả giận!</p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-[280px]">
        {weapons.map(w => (
          <motion.button
            key={w.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(w.id)}
            className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border-4 transition-colors ${
              selected === w.id ? "bg-orange-100 border-orange-500 shadow-lg" : "bg-white border-transparent shadow"
            }`}
          >
            <span className="text-4xl">{w.emoji}</span>
            <span className="text-xs font-bold text-slate-700">{w.name}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onNext}
            className="mt-10 px-8 py-3 bg-slate-800 text-white rounded-full font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
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
      <h2 className="text-2xl font-black text-slate-800 mt-8 mb-4 uppercase text-center">Đập nó đi!</h2>
      
      {/* Health Bar */}
      <div className="w-full max-w-[280px] h-6 bg-slate-200 rounded-full mb-10 overflow-hidden border-2 border-slate-300 relative shadow-inner">
        <motion.div 
          className="h-full bg-gradient-to-r from-red-500 to-rose-600"
          initial={{ width: 0 }}
          animate={{ width: `${(health / 10) * 100}%` }}
          transition={{ type: "spring", stiffness: 100 }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-md">
          {health}/10
        </div>
      </div>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[300px]">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="relative w-full aspect-square bg-slate-800 rounded-full border-4 border-slate-700 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.5)] overflow-hidden flex items-end justify-center">
            {/* The character */}
            <AnimatePresence>
              {activeHole === i && (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: "10%" }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-[80%] h-[80%] origin-bottom absolute bottom-0 cursor-pointer"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    handlePointerDown();
                    const rect = e.currentTarget.getBoundingClientRect();
                    handleHit(i, rect.left + rect.width / 2, rect.top);
                  }}
                >
                  <div className="w-full h-full rounded-full bg-orange-200 border-4 border-slate-900 overflow-hidden relative shadow-lg">
                    <img src={WHACK_DATA.avatar} alt="avatar" className="w-full h-full object-cover pointer-events-none" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Front lip of the hole to cover bottom of character */}
            <div className="absolute bottom-0 w-full h-[20%] bg-slate-700 rounded-b-full pointer-events-none" />
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
        animate={{ scale: 1, rotate: [0, -2, 2, 0] }}
        transition={{ type: "spring", bounce: 0.5, duration: 1 }}
        className="relative w-48 h-48 rounded-full border-8 border-white shadow-2xl mb-8 overflow-hidden bg-orange-100"
      >
        <img src={WHACK_DATA.avatar} alt="avatar" className="w-full h-full object-cover filter brightness-90 sepia-[0.2]" />
        
        {/* Band-aids */}
        <div className="absolute top-1/4 left-1/4 w-12 h-4 bg-[#e8ba98] rotate-45 border border-[#d29b74] rounded-full opacity-90 shadow-sm" />
        <div className="absolute top-1/4 left-1/4 w-12 h-4 bg-[#e8ba98] -rotate-45 border border-[#d29b74] rounded-full opacity-90 shadow-sm" />
        
        <div className="absolute bottom-1/3 right-1/4 w-10 h-3 bg-[#e8ba98] rotate-12 border border-[#d29b74] rounded-full opacity-90 shadow-sm" />

        {/* Tears */}
        <motion.div 
          animate={{ y: [0, 40], opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute top-1/2 left-1/3 text-2xl"
        >💧</motion.div>
        <motion.div 
          animate={{ y: [0, 50], opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.5 }}
          className="absolute top-[40%] right-1/3 text-2xl"
        >💧</motion.div>
      </motion.div>

      <div className="bg-white/80 p-5 rounded-2xl shadow-lg backdrop-blur-sm border border-white/40 mb-8 relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[12px] border-b-white/80" />
        <p className="text-slate-700 font-medium leading-relaxed">
          "Ui cha mẹ ơi... Đánh xong rồi, đằng ấy đã xả hết giận chưa? Xót người ta chưa? 🥺 Nếu bớt giận rồi thì cho người ta giải thích nhé?"
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="px-8 py-3 bg-slate-800 text-white rounded-full font-bold shadow-xl flex items-center gap-2"
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
        className="bg-[#fff7ed] p-8 rounded-lg shadow-2xl w-full max-w-sm relative min-h-[300px]"
        style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #fdba74 31px, #fdba74 32px)", lineHeight: "32px", backgroundAttachment: "local" }}
      >
        <div className="absolute top-4 left-4 w-4 h-4 bg-red-400 rounded-full shadow-inner opacity-80" /> {/* pin */}
        <p className="text-slate-800 font-medium text-lg italic font-serif pt-6">
          {text}<span className="animate-pulse">_</span>
        </p>
      </motion.div>

      <AnimatePresence>
        {done && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onNext}
            className="mt-10 px-8 py-3 bg-orange-500 text-white rounded-full font-bold shadow-xl hover:bg-orange-600 transition-transform"
          >
            Đọc tiếp <ChevronRight className="inline" size={18} />
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
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10"
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="bg-[#fff7ed] p-8 rounded-lg shadow-2xl w-full max-w-sm relative min-h-[300px]"
        style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #fdba74 31px, #fdba74 32px)", lineHeight: "32px", backgroundAttachment: "local" }}
      >
        <div className="absolute top-4 right-4 w-4 h-4 bg-red-400 rounded-full shadow-inner opacity-80" /> {/* pin right */}
        <p className="text-slate-800 font-medium text-lg italic font-serif pt-6">
          {text}<span className="animate-pulse">_</span>
        </p>
      </motion.div>

      <AnimatePresence>
        {done && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onNext}
            className="mt-10 px-8 py-3 bg-orange-500 text-white rounded-full font-bold shadow-xl hover:bg-orange-600 transition-transform flex items-center gap-2"
          >
            Chốt kèo <HeartHandshake size={20} />
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
      <div className="text-6xl mb-6">⚖️</div>
      <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-wide">Tòa Tuyên Án</h2>
      <p className="text-slate-600 font-medium mb-12">Bị cáo đã nhận tội, quan tòa phán quyết sao đây?</p>

      <div className="flex flex-col gap-6 w-full max-w-xs relative h-[160px] justify-center">
        <motion.button
          onClick={onNext}
          animate={{ scale: [1, 1.05, 1], boxShadow: ["0px 0px 0px rgba(249,115,22,0)", "0px 0px 20px rgba(249,115,22,0.6)", "0px 0px 0px rgba(249,115,22,0)"] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="px-6 py-4 bg-gradient-to-r from-orange-400 to-rose-500 text-white rounded-full font-bold shadow-xl border-2 border-white flex items-center justify-center gap-2 z-20"
        >
          <Heart size={20} fill="currentColor" /> THA THỨ (KÈM TRÀ SỮA) 🧋
        </motion.button>

        <motion.button
          animate={noPos}
          transition={{ type: "spring", stiffness: 1200, damping: 14, mass: 0.2 }}
          onHoverStart={moveNo}
          onPointerEnter={moveNo}
          onTouchStart={moveNo}
          onClick={forceNoClick}
          className="px-6 py-4 bg-slate-200 text-slate-500 rounded-full font-bold border-2 border-slate-300 flex items-center justify-center gap-2 z-10 transition-colors hover:bg-slate-300 absolute w-full bottom-0"
        >
          ĐÁNH TIẾP 🔨
        </motion.button>
      </div>

      <AnimatePresence>
        {pleading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-10 bg-slate-800 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold max-w-[80%]"
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
    <div className={`relative w-full overflow-hidden transition-colors duration-1000 bg-gradient-to-b ${currentBg} text-slate-800 touch-none mx-auto ${compact ? 'h-full' : 'max-w-[400px] h-[800px] max-h-[90vh] rounded-[3rem] shadow-2xl border-[10px] border-white'}`}>
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
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 text-white"
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
