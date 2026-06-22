import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

export type ChatMessage = {
  sender: "me" | "you";
  text: string;
};

export function Step5FakeChat({ chat, onComplete }: { chat: ChatMessage[]; onComplete: () => void }) {
  const [visibleCount, setVisibleCount] = useState(1);

  const handleScreenClick = () => {
    if (visibleCount < chat.length) {
      setVisibleCount(c => c + 1);
    }
  };

  const isDone = visibleCount >= chat.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col z-10 bg-gradient-to-b from-[#fff0f5] to-white"
    >
      <div className="pt-10 pb-4 px-6 bg-white/60 backdrop-blur-md border-b border-pink-100 flex items-center justify-center shadow-sm sticky top-0 z-20">
        <h3 className="font-bold text-slate-700">Người ấy ❤️</h3>
      </div>

      <div 
        className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-3 pb-32"
        onClick={handleScreenClick}
      >
        {chat.slice(0, visibleCount).map((msg, idx) => {
          const isMe = msg.sender === "me";
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-[15px] ${isMe ? 'bg-rose-500 text-white rounded-br-sm shadow-md shadow-rose-200' : 'bg-slate-100 text-slate-800 rounded-bl-sm border border-slate-200'}`}>
                {msg.text}
              </div>
            </motion.div>
          );
        })}

        {!isDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-center text-xs text-slate-400 mt-8 pointer-events-none"
          >
            Chạm vào màn hình để tiếp tục...
          </motion.div>
        )}
      </div>

      {isDone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-10 left-0 right-0 flex justify-center z-30 pointer-events-none"
        >
          <button
            onClick={(e) => { e.stopPropagation(); onComplete(); }}
            className="group pointer-events-auto relative inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-full shadow-[0_10px_25px_rgba(244,63,94,0.4)] hover:scale-105 active:scale-95 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out" />
            <span className="relative z-10 text-white drop-shadow-sm">Ngắm nhìn lại nhé 📸</span>
            <ChevronRight size={18} className="relative z-10 text-white drop-shadow-sm group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
