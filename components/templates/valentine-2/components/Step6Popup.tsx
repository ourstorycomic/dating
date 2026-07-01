import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Ticket } from "lucide-react";
import { FloatingParticles } from "./FloatingParticles";
import { playPop, playTada, playSwoosh } from "./soundFX";
import { Dancing_Script } from "next/font/google";

const dancingScriptFont = Dancing_Script({ subsets: ["latin", "vietnamese"], weight: ["400", "700"], variable: "--font-dancing" });

export function Step6Popup({ confession, onComplete, compact, autoPlay = false, eggColor = "from-pink-400 to-rose-500" }: { confession: string; onComplete: () => void; compact?: boolean; autoPlay?: boolean; eggColor?: string }) {
  const [noHoverCount, setNoHoverCount] = useState(0);
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  
  // Phase 0: Egg drops in. Phase 0.5: Shake. Phase 1: Egg splits & light rays. Phase 2: Letter types.
  const [phase, setPhase] = useState(0);
  const [typedConfession, setTypedConfession] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);

  const [ticketViewed, setTicketViewed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMoving = useRef(false);

  useEffect(() => {
    if (phase === 0) {
      playSwoosh(compact && !autoPlay);
      setTimeout(() => setPhase(0.5), 1000);
    } else if (phase === 0.5) {
      setTimeout(() => { playTada(compact && !autoPlay); setPhase(1); }, 1800);
    } else if (phase === 1) {
      setTimeout(() => setPhase(2), 2200);
    } else if (phase === 2) {
      setIsTyping(true);
      let i = 0;
      const interval = setInterval(() => {
        setTypedConfession(confession.substring(0, i));
        i++;
        if (i > confession.length) {
          clearInterval(interval);
          setIsTyping(false);
          setTimeout(() => setButtonsVisible(true), 800);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [phase, confession]);

  useEffect(() => {
    if (autoPlay && buttonsVisible) {
      const t = setTimeout(() => handleAccept(), 2000);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, buttonsVisible]);

  const handleNoHover = () => {
    if (isMoving.current) return;
    isMoving.current = true;
    playPop(compact && !autoPlay);
    setTimeout(() => { isMoving.current = false; }, 80);

    const side = Math.random() > 0.5 ? 1 : -1;
    const newX = side * (30 + Math.random() * 50);
    const newY = 30 + Math.random() * 50;

    setNoBtnPos({ x: newX, y: newY });
    setNoHoverCount(c => c + 1);
  };

  const handleAccept = () => {
    setPhase(3); // Phase 3: Accepted -> show ticket
    playTada(compact && !autoPlay);
    if (!compact && canvasRef.current) {
      const myConfetti = confetti.create(canvasRef.current, { resize: true, useWorker: true });
      myConfetti({ particleCount: 100, spread: 120, origin: { y: 0.8 }, colors: ['#f43f5e', '#ec4899', '#fbcfe8'], gravity: 0.3, ticks: 300 });
    }
    
    setTimeout(() => {
      setTicketViewed(true);
      setTimeout(onComplete, 1000); 
    }, 4000);
  };

  const noPhrases = [
    "ĐỂ TỚ SUY NGHĨ 🤔",
    "Thôi mà!!",
    "Đồng ý đi!!",
    "Đừng trốn tớ!!",
    "Cho tớ cơ hội đi!",
    "Bấm nhầm nút rồi!"
  ];

  return (
    <motion.div 
      className={`absolute inset-0 flex flex-col items-center justify-center p-6 z-20 bg-slate-900/80 backdrop-blur-sm [perspective:1500px] ${dancingScriptFont.variable}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
    >
      <style>{`
        .font-\\[Dancing_Script\\] { font-family: var(--font-dancing) !important; }
      `}</style>
      <FloatingParticles />
      <canvas ref={canvasRef} className="absolute inset-0 z-50 pointer-events-none w-full h-full" />

      {/* Full Screen Flash */}
      <AnimatePresence>
        {phase === 1 && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.5, times: [0, 0.1, 0.4, 1], ease: "easeOut" }}
            className="fixed inset-0 bg-white z-[100] pointer-events-none mix-blend-screen"
          />
        )}
      </AnimatePresence>

      {/* Phase 0 & 0.5 & 1: The Egg */}
      <AnimatePresence>
        {phase < 2 && (
          <motion.div 
            key="egg-container"
            initial={{ y: -300, opacity: 0, rotate: -20, scale: 0.5 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
              rotate: phase === 0.5 ? [-5, 5, -5, 5, -8, 8, -5, 5, 0] : 0,
            }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.5 } }}
            transition={{
              rotate: { duration: 1.5, ease: "easeInOut", times: [0, 0.1, 0.2, 0.3, 0.5, 0.6, 0.8, 0.9, 1] },
              default: { type: "spring", stiffness: 100, damping: 10 }
            }}
            className="absolute z-30 flex flex-col items-center"
          >
            <div className="relative w-32 h-40">
              {/* Light Rays Reveal */}
              {phase === 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.2 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0], 
                    scale: [0.2, 3, 5, 8],
                    rotate: 180
                  }}
                  transition={{ duration: 2.2, ease: "easeOut" }}
                  className="absolute inset-[-100%] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.9)_10deg,transparent_20deg,rgba(255,255,255,0.6)_45deg,transparent_55deg,rgba(255,255,255,1)_65deg,transparent_75deg,rgba(255,255,255,0.8)_110deg,transparent_130deg,rgba(255,255,255,1)_150deg,transparent_180deg,rgba(255,255,255,0.5)_200deg,transparent_220deg,rgba(255,255,255,0.9)_250deg,transparent_270deg,rgba(255,255,255,0.8)_290deg,transparent_310deg,rgba(255,255,255,1)_340deg,transparent_360deg)] z-15 mix-blend-overlay pointer-events-none"
                />
              )}
              {/* Top half */}
              <motion.div 
                animate={{ 
                  y: phase === 1 ? -60 : 0, 
                  rotate: phase === 1 ? -25 : 0,
                  x: phase === 1 ? -20 : 0,
                  opacity: phase === 1 ? 0 : 1
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className={`absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br ${eggColor} rounded-t-[50%_50%] origin-bottom shadow-lg z-20 overflow-hidden`}
              >
                <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </motion.div>

              {/* Teddy Bear inside */}
              <motion.div 
                animate={{ 
                  scale: phase === 1 ? 1 : 0.5, 
                  y: phase === 1 ? -40 : 20,
                  opacity: phase === 1 ? 1 : 0
                }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute inset-0 flex flex-col items-center justify-center z-10"
              >
                <div className="text-[140px] drop-shadow-2xl mt-[-20px]">🧸</div>
                <div className="w-14 h-10 bg-white border border-slate-200 mt-[-30px] rounded-lg shadow-xl rotate-12 flex items-center justify-center text-xs font-black text-rose-500 z-10">
                  Thư nè
                </div>
              </motion.div>

              {/* Bottom half */}
              <motion.div 
                animate={{ 
                  y: phase === 1 ? 20 : 0, 
                  rotate: phase === 1 ? 15 : 0,
                  x: phase === 1 ? 10 : 0,
                  opacity: phase === 1 ? 0 : 1
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className={`absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-br ${eggColor} rounded-b-[50%_50%] origin-top shadow-lg z-20`}
              />
            </div>
            {phase === 0 && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} 
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-16 h-4 bg-black/30 blur-md rounded-[100%] mt-2"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 2: The Letter */}
      <AnimatePresence mode="wait">
        {phase === 2 && (
          <motion.div 
            key="letter"
            initial={{ scale: 0.2, y: 150, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            className="w-full max-w-[320px] bg-[#fffbf0] rounded-xl p-8 shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-[#e2d5c5] flex flex-col items-center relative [transform-style:preserve-3d] z-40"
          >
            <div className="absolute -top-4 -right-4 text-4xl rotate-12 drop-shadow-md">🎀</div>
            
            <p className="text-[#6b4226] text-xl leading-relaxed font-[Dancing_Script] text-center font-bold mb-8 min-h-[100px]">
              {typedConfession}
              {isTyping && <span className="animate-pulse text-rose-400">|</span>}
            </p>

            <div className="w-full flex flex-col gap-4 relative min-h-[120px]">
              <AnimatePresence>
                {buttonsVisible && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col gap-4">
                    <button 
                      onClick={handleAccept}
                      className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-full font-bold shadow-[0_5px_15px_rgba(225,29,72,0.4)] animate-pulse hover:scale-105 transition-transform"
                    >
                      ĐỒNG Ý LUÔN 🥰
                    </button>
                    
                    <div className="relative h-[48px] w-full mt-2" style={{ overflow: 'visible' }}>
                      <motion.button
                        onMouseEnter={compact ? undefined : handleNoHover}
                        onTouchStart={handleNoHover}
                        onClick={handleNoHover}
                        animate={{ x: noBtnPos.x, y: noBtnPos.y }}
                        transition={{ type: "tween", duration: 0.12, ease: "easeOut" }}
                        className="absolute left-0 right-0 mx-auto w-fit px-6 h-full flex items-center justify-center rounded-full font-bold text-gray-500 bg-gray-100 border-2 border-gray-200 whitespace-nowrap"
                      >
                        {noPhrases[Math.min(noHoverCount, noPhrases.length - 1)]}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
        
        {phase === 3 && (
          <motion.div 
            key="ticket"
            initial={{ opacity: 0, scale: 0.5, rotateY: 180, y: 50 }}
            animate={{ opacity: ticketViewed ? 0 : 1, scale: ticketViewed ? 1.5 : 1, rotateY: ticketViewed ? 90 : 0, y: 0 }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
            className="flex flex-col items-center z-40"
          >
            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-1 rounded-2xl shadow-[0_20px_50px_rgba(79,70,229,0.5)] overflow-hidden group">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent pointer-events-none z-10" 
                initial={{ x: "-150%" }}
                animate={{ x: "150%" }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              />
              
              <div className="bg-slate-900 border border-indigo-300/30 rounded-xl p-6 flex flex-col items-center text-white min-w-[280px]">
                <div className="flex items-center gap-3 mb-4">
                  <Ticket className="text-yellow-400" size={32} />
                  <h3 className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 drop-shadow-md">
                    VIP TICKET
                  </h3>
                </div>
                <div className="w-full h-px bg-white/20 border-dashed border-b border-white/20 mb-4"></div>
                <p className="text-sm text-indigo-200 uppercase tracking-widest mb-1">Valentine's Cinema</p>
                <p className="text-2xl font-bold mb-4 text-center text-rose-100">Rạp Phim Của<br/>Hai Ta</p>
                <div className="bg-white/10 px-4 py-2 rounded-lg text-xs tracking-widest border border-white/10">
                  ADMIT TWO
                </div>
              </div>
            </div>
            
            {!ticketViewed && (
              <p className="mt-8 text-white/70 font-serif text-sm tracking-widest animate-pulse">
                Đang chuẩn bị rạp chiếu...
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
