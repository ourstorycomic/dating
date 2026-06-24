"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, WifiOff, Trash2, Heart, MessageCircle, ServerCrash, XCircle, Send, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

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

export default function Sorry3Template({ autoPlay = false, compact = false }: { autoPlay?: boolean; compact?: boolean }) {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((s) => Math.min(s + 1, 8));

  return (
    <div className="relative w-full max-w-[400px] h-[800px] max-h-[90vh] bg-[#f8f9fa] overflow-hidden rounded-[2.5rem] shadow-2xl mx-auto border-[10px] border-gray-200 text-gray-800 touch-none font-sans">
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
        onClick={onNext}
        className="self-start px-6 py-3 bg-white text-[#0052a5] font-bold shadow-lg border-2 border-transparent hover:border-white/50 transition-colors"
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
      onClick={onNext}
      className="absolute inset-0 bg-white text-[#5f6368] p-8 flex flex-col pt-32 cursor-pointer z-10"
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
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);

  const jump = () => {
    if (!isJumping) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 500);
    }
  };

  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(onNext, 4000);
      return () => clearTimeout(t);
    }
  }, [autoPlay, onNext]);

  useEffect(() => {
    const interval = setInterval(() => {
      setScore(s => {
        if (s >= 4) {
          clearInterval(interval);
          setTimeout(onNext, 500);
          return 5;
        }
        return s + 1;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={jump}
      className="absolute inset-0 bg-white text-[#5f6368] overflow-hidden cursor-pointer z-10"
    >
      <div className="absolute top-10 right-10 text-xl font-mono font-bold tracking-widest">
        {String(score).padStart(5, '0')}
      </div>

      {/* Ground */}
      <div className="absolute bottom-32 left-0 w-[200%] h-[1px] bg-[#5f6368] opacity-50" />

      {/* Dino */}
      <motion.div
        animate={{ y: isJumping ? -120 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute bottom-[128px] left-10 text-5xl origin-bottom"
      >
        🦖
      </motion.div>

      {/* Obstacles & Hearts */}
      <div className="absolute bottom-[128px] left-0 w-full h-full pointer-events-none">
        {["🎮", "🍺", "📱", "🎮", "📱"].map((obs, i) => (
          <motion.div
            key={`obs-${i}`}
            initial={{ x: 400 }}
            animate={{ x: -100 }}
            transition={{ duration: 2, delay: i * 2, ease: "linear" }}
            className="absolute bottom-0 text-4xl"
          >
            {obs}
          </motion.div>
        ))}
        {["❤️", "❤️", "❤️", "❤️", "❤️"].map((heart, i) => (
          <motion.div
            key={`heart-${i}`}
            initial={{ x: 400, y: -80 }}
            animate={{ x: -100 }}
            transition={{ duration: 2, delay: i * 2 + 0.5, ease: "linear" }}
            className="absolute bottom-0 text-3xl text-rose-500"
          >
            {heart}
          </motion.div>
        ))}
      </div>

      <p className="absolute bottom-10 w-full text-center text-sm opacity-60 animate-pulse">
        Chạm để nhảy qua lỗi lầm!
      </p>
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
            y: (Math.random() - 0.5) * 300, 
            x: (Math.random() - 0.5) * 200,
            rotate: (Math.random() - 0.5) * 30
          }}
          transition={{ type: "spring", damping: 12, delay: i * 0.2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-28 bg-white p-2 shadow-2xl z-10 border border-gray-200"
        >
          <img src={img} className="w-full h-[70px] object-cover bg-gray-200" />
        </motion.div>
      ))}

      {opened && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={onNext}
          className="bg-[#c0c0c0] text-black px-8 py-3 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white font-bold relative z-30 shadow-2xl mt-12"
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
              onClick={onNext}
              className="w-full mt-4 bg-blue-500 text-[#ffffff] py-3 rounded-full font-bold shadow-md hover:bg-blue-600 transition-colors"
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
            onClick={handleAcceptClick}
            animate={{ scale: [1, 1.05, 1], boxShadow: ["0px 0px 0px rgba(59,130,246,0)", "0px 0px 20px rgba(59,130,246,0.6)", "0px 0px 0px rgba(59,130,246,0)"] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-full bg-blue-500 text-[#ffffff] py-4 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 z-20 origin-center text-lg"
          >
            ĐỒNG Ý (CÓ TRÀ SỮA) 🧋
          </motion.button>

          {rejectScale > 0 && (
            <motion.button
              animate={{ scale: rejectScale, opacity: rejectScale }}
              onClick={handleRejectClick}
              className="w-full bg-gray-200 text-gray-600 py-3 rounded-full font-bold shadow-sm flex items-center justify-center gap-2 z-10 absolute bottom-0 origin-center"
            >
              KHÔNG THA 😤
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
