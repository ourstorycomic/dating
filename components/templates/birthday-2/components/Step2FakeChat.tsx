"use client";

import { useState, useEffect as import_react_useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Info, Phone, Video } from "lucide-react";

export function Step2FakeChat({ messages, onNext, autoPlay = false }: { messages: string[]; onNext: () => void; autoPlay?: boolean }) {
  const [visibleCount, setVisibleCount] = useState(0);

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
            className="text-center text-xs text-gray-400 mt-auto mb-10 animate-pulse"
          >
            Chạm vào màn hình để xem tin nhắn...
          </motion.div>
        )}

        <AnimatePresence>
          {visibleCount >= messages.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-auto flex justify-end"
            >
              <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="max-w-[80%] px-4 py-2.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium text-[15px] rounded-2xl rounded-tr-sm transition-colors shadow-sm"
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
