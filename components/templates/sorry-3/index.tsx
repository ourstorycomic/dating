"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, WifiOff, Trash2, Heart, MessageCircle, ServerCrash, XCircle, Send, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import GameOverImg from './textures/map/GameOver.png';
import ResetImg from './textures/map/Reset.png';
import DinoRun1Img from './textures/Dino/DinoRun1.png';
import DinoRun2Img from './textures/Dino/DinoRun2.png';
import DinoJumpImg from './textures/Dino/DinoJump.png';
import DinoDuck1Img from './textures/Dino/DinoDuck1.png';
import DinoDuck2Img from './textures/Dino/DinoDuck2.png';
import CloudImg from './textures/map/Cloud.png';
import TrackImg from './textures/map/Track.png';

const APOLOGY_DATA = {
  reason: "mải chơi game quên nhắn tin",
  punishment: "Rửa bát 1 tháng",
  memories: [
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&q=80",
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80"
  ],
  letter: "Anh biết lỗi rồi. Anh đã quá vô tâm và trẻ con. Anh hứa sẽ không bao giờ như vậy nữa. Tha lỗi cho anh nha, chiều nay tớ qua đón đi ăn đền tội, chịu không? ❤️"
};

function FloatingParticles({ step }: { step: number }) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number; emoji: string }[]>([]);

  useEffect(() => {
    let emojis = ['❤️', '✨', '🥺', '💦'];
    if (step === 1 || step === 2) emojis = ['💻', '💾', '⚠️', '🔌'];
    else if (step === 3) emojis = ['🦖', '🌵', '💨', '⭐'];
    else if (step === 5) emojis = ['🗑️', '📁', '💔', '📸'];
    else if (step === 6) emojis = ['⚙️', '🔄', '🔋', '📡'];

    const p = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }));
    setParticles(p);
  }, [step]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute drop-shadow-sm"
          style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: p.size }}
          animate={{
            y: [0, -60, 0],
            x: [0, 20, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}

export default function Sorry3Template({ autoPlay = false, compact = false }: { autoPlay?: boolean; compact?: boolean }) {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((s) => Math.min(s + 1, 8));

  return (
    <div className={`relative w-full overflow-hidden text-gray-800 touch-none font-sans mx-auto ${compact ? 'h-full bg-transparent' : 'max-w-[400px] h-[800px] max-h-[90vh] bg-[#f8f9fa] rounded-[2.5rem] shadow-2xl border-[10px] border-gray-200'}`}>
      <FloatingParticles step={step} />
      <AnimatePresence mode="wait">
        {step === 1 && <Step1BSOD key="step1" onNext={nextStep} autoPlay={autoPlay} />}
        {step === 2 && <Step2NoInternet key="step2" onNext={nextStep} autoPlay={autoPlay} />}
        {step === 3 && <Step3DinoRun key="step3" onNext={nextStep} autoPlay={autoPlay} />}
        {step === 4 && <Step4Confession key="step4" onNext={nextStep} autoPlay={autoPlay} />}
        {step === 5 && <Step5RecycleBin key="step5" onNext={nextStep} autoPlay={autoPlay} />}
        {step === 6 && <Step6Reinstalling key="step6" onNext={nextStep} autoPlay={autoPlay} />}
        {step === 7 && <Step7Inbox key="step7" onNext={nextStep} autoPlay={autoPlay} />}
        {step === 8 && <Step8FinalChoice key="step8" autoPlay={autoPlay} />}
      </AnimatePresence>
    </div>
  );
}

// --- STEP 1: BSOD ---
function Step1BSOD({ onNext, autoPlay }: { onNext: () => void; autoPlay: boolean }) {
  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(onNext, 3000);
      return () => clearTimeout(t);
    }
  }, [autoPlay, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeOut" } }}
      className="absolute inset-0 bg-[#0052a5] text-white p-8 flex flex-col justify-center font-mono z-10"
    >
      <p className="text-8xl mb-6">:(</p>
      <h1 className="text-2xl font-bold mb-6">LỖI HỆ THỐNG</h1>
      <p className="text-lg leading-relaxed mb-6">
        MỐI QUAN HỆ ĐANG BỊ GIÁN ĐOẠN.
        <br /><br />
        Nguyên nhân: Tên ngốc này đã <span className="bg-white/20 px-1">{APOLOGY_DATA.reason}</span>.
      </p>
      <p className="text-sm opacity-80 mb-12">
        Mã lỗi: LOVE_NOT_FOUND_404
      </p>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={autoPlay ? undefined : onNext}
        disabled={autoPlay}
        className="self-start px-6 py-3 bg-white text-[#0052a5] font-bold shadow-lg border-2 border-transparent hover:border-white/50 transition-colors disabled:opacity-50"
      >
        [ Tái khởi động ]
      </motion.button>
    </motion.div>
  );
}

// --- STEP 2: NO INTERNET ---
function Step2NoInternet({ onNext, autoPlay }: { onNext: () => void; autoPlay: boolean }) {
  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(onNext, 2000);
      return () => clearTimeout(t);
    }
  }, [autoPlay, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={autoPlay ? undefined : onNext}
      className={`absolute inset-0 bg-white text-[#5f6368] p-8 flex flex-col pt-32 z-10 ${autoPlay ? '' : 'cursor-pointer'}`}
    >
      <div className="w-16 h-16 mb-6 opacity-80">
        <WifiOff size={64} />
      </div>
      <h1 className="text-2xl font-bold mb-4 text-[#202124]">Không có kết nối</h1>
      <p className="text-[15px] leading-relaxed mb-8">
        Mất kết nối với trái tim của người yêu.
      </p>
      <ul className="text-[13px] list-disc pl-5 space-y-2 opacity-80">
        <li>Kiểm tra lại độ thành tâm</li>
        <li>Chuẩn bị sẵn lời xin lỗi</li>
        <li>Chạy qua nhà đền tội ngay lập tức</li>
      </ul>
      <p className="text-[13px] mt-8 text-blue-500 font-medium">ERR_HEART_BROKEN</p>
      
      <p className="absolute bottom-10 left-0 w-full text-center text-sm animate-pulse opacity-60">
        Bấm phím Space hoặc chạm vào màn hình để thử lại.
      </p>
    </motion.div>
  );
}

// --- STEP 3: MINIGAME DINO ---
function Step3DinoRun({ onNext, autoPlay }: { onNext: () => void; autoPlay: boolean }) {
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);
  
  // Game State Refs to avoid dependency issues in loop
  const state = useRef({
    score: 0, // Hearts collected
    speed: 5,
    isWon: false,
    isLost: false,
    dino: { x: 50, y: 0, vy: 0, state: 'run', frame: 0, width: 44, height: 47, ducking: false },
    obstacles: [] as { x: number, y: number, type: 'ground' | 'flying' | 'heart', width: number, height: number, emoji: string, passed: boolean }[],
    clouds: [] as { x: number, y: number, scale: number }[],
    trackX: 0,
    frame: 0,
    keys: { jump: false, duck: false }
  });

  // Load images
  const imgs = useRef<{ [key: string]: HTMLImageElement }>({});
  useEffect(() => {
    const load = (src: string) => {
      const img = new Image();
      img.src = src;
      return img;
    };
    imgs.current = {
      run1: load(DinoRun1Img.src),
      run2: load(DinoRun2Img.src),
      jump: load(DinoJumpImg.src),
      duck1: load(DinoDuck1Img.src),
      duck2: load(DinoDuck2Img.src),
      cloud: load(CloudImg.src),
      track: load(TrackImg.src)
    };
    
    // Init clouds
    state.current.clouds = Array.from({length: 3}).map(() => ({
      x: Math.random() * 400,
      y: 20 + Math.random() * 50,
      scale: 0.5 + Math.random() * 0.5
    }));
  }, []);

  const resetGame = useCallback(() => {
    state.current = {
      score: 0,
      speed: 5,
      isWon: false,
      isLost: false,
      dino: { x: 50, y: 0, vy: 0, state: 'run', frame: 0, width: 44, height: 47, ducking: false },
      obstacles: [],
      clouds: state.current.clouds,
      trackX: 0,
      frame: 0,
      keys: { jump: false, duck: false }
    };
    setScore(0);
    setGameState("playing");
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      state.current.keys.jump = true;
    }
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      e.preventDefault();
      state.current.keys.duck = true;
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') state.current.keys.jump = false;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') state.current.keys.duck = false;
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isActive = true;

    const loop = () => {
      if (!isActive) return;
      const st = state.current;
      st.frame++;

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Won Sequence
      if (st.isWon) {
        st.dino.x += 3;
        st.dino.frame = (Math.floor(st.frame / 5) % 2 === 0) ? 1 : 2;
        st.dino.state = 'run';
        st.dino.ducking = false;
        st.dino.y = 0;
      } else if (!st.isLost) {
        // --- GAME PLAY LOGIC ---
        
        // AutoPlay Bot
        if (autoPlay) {
          const nextObs = st.obstacles.find(o => o.type !== 'heart' && o.x + 30 > st.dino.x && !o.passed);
          if (nextObs && nextObs.x - (st.dino.x + st.dino.width) < 80) {
            if (nextObs.type === 'flying') {
              st.keys.duck = true;
              st.keys.jump = false;
            } else {
              st.keys.jump = true;
              st.keys.duck = false;
            }
          } else {
            st.keys.jump = false;
            st.keys.duck = false;
          }
        }

        // Dino Physics
        if (st.keys.jump && st.dino.y === 0 && !st.dino.ducking) {
          st.dino.vy = -12;
          st.dino.state = 'jump';
        }
        
        st.dino.y += st.dino.vy;
        st.dino.vy += 0.8; // Gravity
        
        if (st.dino.y > 0) {
          st.dino.y = 0;
          st.dino.vy = 0;
          if (st.keys.duck) {
            st.dino.state = 'duck';
            st.dino.ducking = true;
          } else {
            st.dino.state = 'run';
            st.dino.ducking = false;
          }
        }

        if (st.dino.state === 'run' || st.dino.state === 'duck') {
          st.dino.frame = (Math.floor(st.frame / 5) % 2 === 0) ? 1 : 2;
        }

        // Spawn Obstacles
        if (st.frame % 90 === 0) {
          const isHeart = st.frame % 360 === 0; // Every 4th item is a heart
          const type = isHeart ? 'heart' : (Math.random() > 0.5 ? 'flying' : 'ground');
          st.obstacles.push({
            x: 400,
            y: type === 'flying' ? 45 : (type === 'heart' ? 30 : 10),
            type: type,
            width: 30,
            height: 30,
            emoji: type === 'heart' ? '❤️' : (type === 'flying' ? '🎮' : '🍺'),
            passed: false
          });
        }

        // Move Obstacles
        for (let i = st.obstacles.length - 1; i >= 0; i--) {
          const obs = st.obstacles[i];
          obs.x -= st.speed;
          
          if (!obs.passed) {
            if (obs.type === 'heart') {
              // Heart collection collision
              const dx = (st.dino.x + 22) - (obs.x + 15);
              const dy = (150 - (st.dino.ducking ? 30 : 47) + st.dino.y + 20) - (150 - obs.y - 15);
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 40) {
                obs.passed = true;
                obs.emoji = ''; // Hide heart
                st.score += 1;
                setScore(st.score);
                if (st.score >= 5 && !st.isWon) {
                   st.isWon = true;
                   setGameState("won");
                   setTimeout(onNext, 2500);
                }
              }
            } else {
              // Obstacle collision
              const dx = (st.dino.x + 22) - (obs.x + 15);
              const dy = (150 - (st.dino.ducking ? 30 : 47) + st.dino.y + 20) - (150 - obs.y - 15);
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 35 && !autoPlay) {
                st.isLost = true;
                setGameState("lost");
              } else if (obs.x < st.dino.x) {
                obs.passed = true;
              }
            }
          }
          
          if (obs.x < -50) {
            st.obstacles.splice(i, 1);
          }
        }

        st.trackX -= st.speed;
        if (st.trackX <= -1200) st.trackX = 0;

        // Move Clouds
        st.clouds.forEach(c => {
          c.x -= st.speed * 0.2;
          if (c.x < -50) c.x = 450;
        });
      }

      // --- RENDER ---
      
      // Clouds
      st.clouds.forEach(c => {
        if (imgs.current.cloud) {
          ctx.globalAlpha = 0.5;
          ctx.drawImage(imgs.current.cloud, c.x, c.y, 46 * c.scale, 14 * c.scale);
          ctx.globalAlpha = 1;
        }
      });

      // Track
      if (imgs.current.track) {
        ctx.globalAlpha = 0.5;
        ctx.drawImage(imgs.current.track, st.trackX, 150 - 15, 1200, 12);
        ctx.drawImage(imgs.current.track, st.trackX + 1200, 150 - 15, 1200, 12);
        ctx.globalAlpha = 1;
      }

      // Obstacles
      ctx.font = "28px sans-serif";
      st.obstacles.forEach(obs => {
        ctx.fillText(obs.emoji, obs.x, 150 - obs.y);
      });

      // Dino
      ctx.save();
      
      let dinoImg = imgs.current.jump;
      if (st.dino.state === 'run') dinoImg = st.dino.frame === 1 ? imgs.current.run1 : imgs.current.run2;
      if (st.dino.state === 'duck') dinoImg = st.dino.frame === 1 ? imgs.current.duck1 : imgs.current.duck2;
      
      if (dinoImg) {
        ctx.drawImage(dinoImg, st.dino.x, 150 - (st.dino.ducking ? 30 : 47) + st.dino.y, st.dino.ducking ? 59 : 44, st.dino.ducking ? 30 : 47);
      }
      ctx.restore();

      if (isActive) {
        requestRef.current = requestAnimationFrame(loop);
      }
    };

    requestRef.current = requestAnimationFrame(loop);
    
    return () => {
      isActive = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, autoPlay, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-pink-50 text-[#5f6368] overflow-hidden z-10 select-none"
      onPointerDown={() => {
        if (!autoPlay) state.current.keys.jump = true;
      }}
      onPointerUp={() => {
        if (!autoPlay) state.current.keys.jump = false;
      }}
    >
      <div className="absolute top-10 right-10 text-lg font-bold bg-pink-200/50 text-pink-700 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm z-20 flex items-center gap-1">
        ❤️ {score}/5
      </div>
      
      <div className="absolute bottom-10 w-full flex justify-center gap-4 z-20 opacity-60 text-xs">
        <div className="flex gap-2 items-center">
          <div className="bg-white px-2 py-1 rounded border border-pink-200 shadow-sm font-bold text-pink-500">W / SPACE</div>
          <span className="text-pink-400 font-medium">Nhảy</span>
        </div>
        <div className="flex gap-2 items-center">
          <div className="bg-white px-2 py-1 rounded border border-pink-200 shadow-sm font-bold text-pink-500">S / XUỐNG</div>
          <span className="text-pink-400 font-medium">Cúi</span>
        </div>
      </div>

      <canvas 
        ref={canvasRef} 
        width={400} 
        height={200} 
        className="absolute top-[30%] w-full h-[200px]"
      />

      {gameState === "lost" && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[20px] flex flex-col items-center gap-4 z-30">
          <img src={GameOverImg.src} alt="Game Over" className="h-8 object-contain drop-shadow-md" />
          <button onClick={resetGame} className="hover:scale-110 active:scale-95 transition-transform bg-white/20 p-2 rounded-full backdrop-blur-md">
            <img src={ResetImg.src} alt="Reset" className="h-10 object-contain drop-shadow-md" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

// --- STEP 4: CONFESSION WINDOW ---
function Step4Confession({ onNext, autoPlay }: { onNext: () => void; autoPlay: boolean }) {
  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(onNext, 2500);
      return () => clearTimeout(t);
    }
  }, [autoPlay, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 bg-[#008080] flex items-center justify-center p-4 z-10"
    >
      <div className="bg-[#c0c0c0] w-full max-w-sm border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-[2px_2px_0_0_#000]">
        <div className="bg-[#000080] text-white px-2 py-1 flex items-center justify-between font-bold text-sm">
          <span>Cảnh_Báo.exe</span>
          <button className="bg-[#c0c0c0] text-black px-2 border-t border-l border-white border-b border-r border-[#808080] font-bold">X</button>
        </div>
        <div className="p-6 flex flex-col items-center text-center">
          <AlertTriangle size={48} className="text-[#ffff00] mb-4 fill-[#ffff00] text-black" />
          <p className="text-black mb-6 text-[15px] leading-relaxed">
            CẢNH BÁO: Tên ngốc này đã nhận ra lỗi lầm!<br /><br />
            Hắn thừa nhận mình vô tâm, trẻ con và hứa sẽ sửa đổi. Bạn có muốn xem bằng chứng không?
          </p>
          <div className="flex gap-4 w-full">
            <button
              onClick={onNext}
              className="flex-1 bg-[#c0c0c0] text-black py-2 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white font-bold"
            >
              Xem bằng chứng
            </button>
            <button
              onClick={onNext}
              className="flex-1 bg-[#c0c0c0] text-black py-2 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white font-bold"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- STEP 5: RECYCLE BIN ---
function Step5RecycleBin({ onNext, autoPlay }: { onNext: () => void; autoPlay: boolean }) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (autoPlay && !opened) {
      const t = setTimeout(() => setOpened(true), 1500);
      return () => clearTimeout(t);
    }
  }, [autoPlay, opened]);

  useEffect(() => {
    if (autoPlay && opened) {
      const t = setTimeout(onNext, 2500);
      return () => clearTimeout(t);
    }
  }, [autoPlay, opened, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#008080] flex flex-col items-center justify-center p-6 text-center z-10"
    >
      <motion.button
        onClick={() => setOpened(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="mb-8 relative z-20"
      >
        <Trash2 size={80} className={`text-white transition-all ${opened ? 'opacity-50' : 'opacity-100'}`} />
        <p className="text-white mt-2 font-mono text-sm">Recycle Bin</p>
      </motion.button>

      <p className="text-white mb-10 font-mono text-sm bg-black/40 p-4 border border-white/20">
        Tớ đã lỡ vứt những thói quen xấu vào thùng rác rồi.<br/>Bù lại, tớ tìm thấy cái này...
      </p>

      {/* Memories flying out */}
      {opened && APOLOGY_DATA.memories.map((img, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, y: -50 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: (Math.random() - 0.5) * 350, 
            x: (Math.random() - 0.5) * 250,
            rotate: (Math.random() - 0.5) * 30
          }}
          transition={{ type: "spring", damping: 12, delay: i * 0.2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-40 bg-white p-2 shadow-2xl z-30 border border-gray-200"
        >
          <img src={img} className="w-full h-[120px] object-cover bg-gray-200" />
        </motion.div>
      ))}

      {opened && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={onNext}
          className="bg-[#c0c0c0] text-black px-8 py-3 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white font-bold relative z-40 shadow-2xl mt-12"
        >
          Xem tiếp
        </motion.button>
      )}
    </motion.div>
  );
}

// --- STEP 6: REINSTALLING ---
function Step6Reinstalling({ onNext, autoPlay }: { onNext: () => void; autoPlay: boolean }) {
  const [progress, setProgress] = useState(0);

  const getStatus = (p: number) => {
    if (p < 30) return "Đang tải... Sự quan tâm";
    if (p < 60) return "Đang cài đặt... Tính tự giác";
    if (p < 90) return "Đang xóa bỏ... Thói quen vô tâm";
    return "Hoàn tất! Hệ thống đã được nâng cấp.";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onNext, 1000);
          return 100;
        }
        return p + Math.floor(Math.random() * 15);
      });
    }, 400);
    return () => clearInterval(interval);
  }, [onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#008080] flex items-center justify-center p-6 z-10"
    >
      <div className="bg-[#c0c0c0] w-full max-w-sm border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] p-6 shadow-[2px_2px_0_0_#000]">
        <h3 className="font-bold mb-4 text-black">Cài Đặt Lại Tình Yêu</h3>
        <p className="text-black mb-2 text-sm">{getStatus(progress)}</p>
        
        {/* Progress Bar */}
        <div className="w-full h-6 border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white bg-white p-[2px]">
          <div 
            className="h-full bg-[#000080]" 
            style={{ width: `${Math.min(progress, 100)}%`, transition: "width 0.3s ease" }} 
          />
        </div>
        <p className="text-right mt-1 text-sm text-black">{Math.min(progress, 100)}%</p>
      </div>
    </motion.div>
  );
}

// --- STEP 7: INBOX ---
function Step7Inbox({ onNext, autoPlay }: { onNext: () => void; autoPlay: boolean }) {
  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    if (typedChars < APOLOGY_DATA.letter.length) {
      const timeout = setTimeout(() => {
        setTypedChars(prev => prev + 1);
      }, 50); // Typing speed
      return () => clearTimeout(timeout);
    } else if (autoPlay) {
      const timeout = setTimeout(onNext, 2000);
      return () => clearTimeout(timeout);
    }
  }, [typedChars, autoPlay, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-white flex flex-col z-10"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center shadow-sm z-20">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold mr-3">
          Me
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Tên Ngốc</h3>
          <p className="text-xs text-green-500 font-medium">Đang hoạt động</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 bg-[#f0f2f5] overflow-y-auto flex flex-col gap-4">
        <div className="self-center text-xs text-gray-500 bg-black/5 px-3 py-1 rounded-full mb-2">Hôm nay 14:02</div>
        
        {/* The message */}
        <div className="self-start bg-white border border-gray-200 text-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] relative">
          <p className="whitespace-pre-wrap leading-relaxed text-[15px]">
            {APOLOGY_DATA.letter.slice(0, typedChars)}
            {typedChars < APOLOGY_DATA.letter.length && (
              <span className="inline-block w-1.5 h-4 bg-blue-500 ml-1 animate-pulse align-middle" />
            )}
          </p>
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="w-full bg-gray-100 rounded-full px-4 py-3 text-gray-400 text-sm flex items-center justify-between">
          <span>Nhập tin nhắn...</span>
          <Send size={18} className="text-blue-500" />
        </div>
        <AnimatePresence>
          {typedChars >= APOLOGY_DATA.letter.length && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={autoPlay ? undefined : onNext}
              disabled={autoPlay}
              className="w-full mt-4 bg-blue-500 text-[#ffffff] py-3 rounded-full font-bold shadow-md hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              Phản hồi ngay
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// --- STEP 8: FINAL CHOICE ---
function Step8FinalChoice({ autoPlay }: { autoPlay: boolean }) {
  const [rejectScale, setRejectScale] = useState(1);
  const [accepted, setAccepted] = useState(false);

  const handleRejectClick = () => {
    if (autoPlay) return;
    setRejectScale(prev => Math.max(prev - 0.2, 0));
  };

  const handleAcceptClick = () => {
    setAccepted(true);
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#ff69b4', '#ff1493', '#ffffff']
    });
  };

  useEffect(() => {
    if (autoPlay && !accepted) {
      const t = setTimeout(handleAcceptClick, 2000);
      return () => clearTimeout(t);
    }
  }, [autoPlay, accepted]);

  if (accepted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute inset-0 bg-pink-500 flex flex-col items-center justify-center p-8 text-center z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Heart size={80} className="text-white fill-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] mb-6" />
        </motion.div>
        <h2 className="text-4xl font-black text-white mb-4 drop-shadow-md">Chốt kèo!</h2>
        <p className="text-xl text-pink-100 font-bold bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
          Tớ qua ngay đây! 🛵💨
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-[#f0f2f5] flex flex-col z-10"
    >
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <MessageCircle size={64} className="text-blue-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Trả lời thế nào đây?</h2>
        
        <div className="flex flex-col gap-4 w-full max-w-xs relative h-[200px] justify-center items-center">
          <motion.button
            onClick={autoPlay ? undefined : handleAcceptClick}
            disabled={autoPlay}
            animate={{ scale: [1, 1.05, 1], boxShadow: ["0px 0px 0px rgba(59,130,246,0)", "0px 0px 20px rgba(59,130,246,0.6)", "0px 0px 0px rgba(59,130,246,0)"] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-full bg-blue-500 text-[#ffffff] py-4 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 z-20 origin-center text-lg disabled:opacity-80"
          >
            ĐỒNG Ý (CÓ TRÀ SỮA) 🧋
          </motion.button>

          {rejectScale > 0 && (
            <motion.button
              animate={{ scale: rejectScale, opacity: rejectScale }}
              onClick={autoPlay ? undefined : handleRejectClick}
              disabled={autoPlay}
              className="w-full bg-gray-200 text-gray-600 py-3 rounded-full font-bold shadow-sm flex items-center justify-center gap-2 z-10 absolute bottom-0 origin-center disabled:opacity-50"
            >
              KHÔNG THA 😤
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
