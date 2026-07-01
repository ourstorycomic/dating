import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { TPL_DATA } from "../config";

export function Step6Finale({ dateTime, wheelResult, onComplete, customData = {}, autoPlay }: { dateTime: {date: string, time: string}, wheelResult?: string, onComplete: () => void, customData?: any, autoPlay?: boolean }) {
  const [typedText, setTypedText] = useState("");
  const [done, setDone] = useState(false);
  const [noPos, setNoPos] = useState({ x: 30, y: 30 }); // relative absolute left/bottom initially
  const [isAccepted, setIsAccepted] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isRejectAnimDone, setIsRejectAnimDone] = useState(false);

  const content = (customData.finaleLetterBody || TPL_DATA.finaleLetterBody).replace("{date}", dateTime.date).replace("{time}", dateTime.time);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(content.substring(0, i));
      i++;
      if (i > content.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [content]);

  useEffect(() => {
    if (autoPlay && done && !isAccepted && !isRejected) {
      const t = setTimeout(acceptFinal, 2500);
      return () => clearTimeout(t);
    }
  }, [autoPlay, done, isAccepted, isRejected]);

  const acceptFinal = () => {
    if(isAccepted) return;
    setIsAccepted(true);
    const myConfetti = confetti.create(document.getElementById('confetti-canvas') as HTMLCanvasElement, { resize: true });
    myConfetti({ particleCount: 150, spread: 160, origin: { y: 0.6 }, zIndex: 100 });
    setTimeout(() => {
        onComplete();
    }, 6000);
  };

  const handleReject = () => {
      if (isRejected) return;
      setIsRejected(true);
      setTimeout(() => {
          setIsRejectAnimDone(true);
      }, 1200);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>
      
      <div className="w-11/12 max-w-[360px] bg-[#fffaf0] p-6 pt-10 rounded-sm z-10 flex flex-col items-center shadow-2xl relative border border-[#e2d5c3]" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #f4bfdb 31px, #f4bfdb 32px)', backgroundAttachment: 'local' }}>
        
        {/* Cute Pin/Tape at the top */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-8 bg-pink-200/60 backdrop-blur-sm -rotate-2 transform skew-x-6 shadow-sm"></div>
        
        <h2 className="text-3xl font-bold text-pink-600 mb-6 letter-font w-full text-left bg-[#fffaf0]">{(customData.finaleLetterTitle || TPL_DATA.finaleLetterTitle)}</h2>
        
        <div className="font-medium text-gray-800 text-lg leading-[32px] w-full text-left mb-10 min-h-[160px] whitespace-pre-wrap letter-font font-bold">
            {typedText}
            {!done && <span className="typing-cursor"></span>}
        </div>

        <div className="flex w-full justify-center items-center gap-4 mt-4 h-12" style={{ opacity: done ? 1 : 0, transition: "opacity 0.5s" }}>
            {!isAccepted && !isRejectAnimDone && (
                <motion.button 
                    key="btn-no"
                    layout
                    onClick={handleReject}
                    animate={isRejected ? { 
                        y: [0, 0, 0, 0, 0, 0, 800], 
                        x: [0, -10, 10, -10, 10, -10, 0],
                        rotate: [0, -20, 20, -20, 20, -20, 60], 
                        opacity: 1 
                    } : {}}
                    transition={isRejected ? { duration: 1.2, times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1], ease: "easeInOut" } : {}}
                    className="bg-gray-200 text-gray-600 px-6 py-2 rounded-full font-bold shadow-md hover:bg-gray-300 whitespace-nowrap z-20 border border-gray-300"
                >
                    {(customData.finaleBtnNo || TPL_DATA.finaleBtnNo)}
                </motion.button>
            )}

            <motion.button 
                key="btn-yes"
                layout
                onClick={acceptFinal} 
                className={`bg-gradient-to-r from-pink-400 to-pink-500 text-white px-8 py-2 rounded-full font-bold shadow-lg whitespace-nowrap hover:scale-105 active:scale-95 transition-transform z-10 ${!isAccepted ? 'heartbeat' : 'pointer-events-none'}`}
            >
                {(customData.finaleBtnYes || TPL_DATA.finaleBtnYes)}
            </motion.button>
        </div>

        {/* Small decorative heart */}
        <div className="absolute bottom-4 right-6 opacity-30">
            <svg className="w-10 h-10 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </div>

      </div>

      <AnimatePresence>
        {isAccepted && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 flex flex-col items-center justify-center p-4">
                <motion.h1 initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="text-pink-400 text-4xl font-bold letter-font drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] heartbeat mb-8">
                    {(customData.finaleBtnSuccess || TPL_DATA.finaleBtnSuccess)}
                </motion.h1>
                
                {/* The Ticket */}
                <motion.div 
                    initial={{ y: 50, opacity: 0, rotateX: 90 }} 
                    animate={{ y: 0, opacity: 1, rotateX: 0 }} 
                    transition={{ delay: 1.5, duration: 0.8, type: "spring" }}
                    className="w-full max-w-[320px] bg-white rounded-2xl flex flex-col overflow-hidden relative shadow-[0_10px_40px_rgba(236,72,153,0.3)]"
                    style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.2))" }}
                >
                    {/* Ticket Header */}
                    <div className="bg-pink-500 p-4 text-center relative border-b-4 border-dashed border-white">
                        <h3 className="text-white font-bold tracking-widest text-lg">DATE TICKET</h3>
                        {/* Cutouts */}
                        <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-black rounded-full"></div>
                        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-black rounded-full"></div>
                    </div>
                    
                    {/* Ticket Body */}
                    <div className="p-6 bg-[#fffdf0] flex flex-col gap-4 relative">
                        <div className="absolute top-0 bottom-0 left-4 border-l-2 border-pink-200 border-dashed"></div>
                        
                        <div className="pl-6">
                            <p className="text-xs text-pink-400 font-bold uppercase mb-1">Thời gian</p>
                            <p className="text-gray-800 font-extrabold text-xl">{dateTime.time}</p>
                            <p className="text-gray-500 text-sm font-medium">{dateTime.date}</p>
                        </div>
                        
                        <div className="pl-6">
                            <p className="text-xs text-pink-400 font-bold uppercase mb-1">Địa điểm / Hoạt động</p>
                            <p className="text-gray-800 font-extrabold text-lg leading-tight">{wheelResult || "Bí mật chờ bật mí ✨"}</p>
                        </div>
                        
                        <div className="pl-6 mt-2 pt-4 border-t border-gray-200 flex justify-between items-end">
                            <div>
                                <p className="text-xs text-pink-400 font-bold uppercase mb-1">Mã xác nhận</p>
                                <p className="text-gray-800 font-mono font-bold tracking-widest">LOVE-{Math.floor(Math.random()*9000)+1000}</p>
                            </div>
                            <svg className="w-10 h-10 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        </div>
                    </div>
                </motion.div>
                
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
