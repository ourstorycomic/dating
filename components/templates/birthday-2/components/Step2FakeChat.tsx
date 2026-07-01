"use client";

import { useState, useRef, useEffect as import_react_useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Info, Phone, Video, Pointer, ArrowDown } from "lucide-react";

export function Step2FakeChat({ messages, onNext, autoPlay = false, compact = false }: { messages: string[]; onNext: () => void; autoPlay?: boolean; compact?: boolean }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const msgSoundRef = useRef<HTMLAudioElement>(null);
  
  import_react_useEffect(() => {
    if (visibleCount > 0 && visibleCount <= messages.length) {
      if (msgSoundRef.current && !(compact && !autoPlay)) {
        msgSoundRef.current.currentTime = 0;
        msgSoundRef.current.play().catch(() => {});
      }
    }
  }, [visibleCount, messages.length]);

  const handleClick = () => {
    if (visibleCount < messages.length) {
      setVisibleCount(c => c + 1);
    }
  };

  import_react_useEffect(() => {
    if (autoPlay) {
      if (visibleCount < messages.length) {
        const t = setTimeout(() => setVisibleCount(c => c + 1), 1500);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => onNext(), 2000);
        return () => clearTimeout(t);
      }
    }
  }, [autoPlay, visibleCount, messages.length, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex flex-col bg-white text-black z-20"
      onClick={handleClick}
    >
      <audio ref={msgSoundRef} src="/assets/vfx/touch.mp3" preload="auto" muted={compact && !autoPlay} />
      {/* iOS style header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3 bg-gray-100/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center gap-2 text-blue-500">
          <ChevronLeft className="w-6 h-6" />
          <span className="text-[17px]">Back</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full mb-1 flex items-center justify-center overflow-hidden">
            <span className="text-xl">👤</span>
          </div>
          <span className="text-[11px] font-semibold text-gray-800">Người ấy &gt;</span>
        </div>
        <div className="flex items-center gap-4 text-blue-500">
          <Video className="w-6 h-6" />
          <Phone className="w-5 h-5" />
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2 bg-white">
        <div className="text-center text-[11px] font-medium text-gray-400 my-4">Today 7:05 AM</div>
        
        <AnimatePresence>
          {messages.slice(0, visibleCount).map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="flex w-full"
            >
              <div className="max-w-[75%] px-4 py-2.5 bg-gray-200 text-black text-[15px] rounded-2xl rounded-tl-sm leading-snug">
                {msg}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {visibleCount < messages.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-auto mb-10 flex flex-col items-center justify-center gap-2 pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="bg-blue-500/10 text-blue-600 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
            >
              <Pointer className="w-4 h-4" />
              Chạm màn hình để đọc tiếp
            </motion.div>
          </motion.div>
        )}

        <AnimatePresence>
          {visibleCount >= messages.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-auto flex flex-col items-end gap-2"
            >
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                className="flex items-center gap-2 text-pink-500 text-sm font-bold animate-bounce mr-4"
              >
                Bấm gửi ngay! <ArrowDown className="w-4 h-4" />
              </motion.div>
              <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="max-w-[80%] px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:scale-95 text-white font-bold text-[15px] rounded-2xl rounded-tr-sm transition-all shadow-[0_4px_15px_rgba(59,130,246,0.4)]"
              >
                Hôm nay sinh nhật tớ mà 🥺
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* iOS Input area */}
      <div className="px-4 py-3 bg-gray-100/80 border-t border-gray-200 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-gray-500 font-bold text-xl">+</div>
        <div className="flex-1 bg-white border border-gray-300 rounded-full h-9 px-4 flex items-center">
          <span className="text-gray-400 text-[15px]">iMessage</span>
        </div>
      </div>
    </motion.div>
  );
}
