import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Mail, ChevronRight } from "lucide-react";

export function Step7Letter({ title, content, onComplete }: { title: string; content: string; onComplete: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [typedContent, setTypedContent] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let i = 0;
    const interval = setInterval(() => {
      setTypedContent(content.substring(0, i));
      i++;
      if (i > content.length) {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isOpen, content]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10"
    >
      {!isOpen ? (
        <motion.div
          initial={{ y: -200, rotate: -10 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="cursor-pointer group flex flex-col items-center"
          onClick={() => setIsOpen(true)}
        >
          <div className="relative w-64 h-40 bg-white rounded-lg shadow-xl border border-rose-100 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
            <div className="absolute top-0 w-0 h-0 border-l-[128px] border-r-[128px] border-t-[80px] border-transparent border-t-rose-100/50 z-10 drop-shadow-sm" />
            <div className="absolute bottom-0 w-0 h-0 border-l-[128px] border-r-[128px] border-b-[80px] border-transparent border-b-rose-50/80 z-20" />
            
            <div className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center shadow-md z-30 group-hover:bg-rose-400 transition-colors">
              <Mail className="text-white" size={28} />
            </div>
          </div>
          <p className="mt-8 text-rose-500 font-bold animate-pulse">Chạm để mở thư 💌</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-sm bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-rose-100 relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-2xl">💖</span>
          </div>
          
          <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center mt-2">{title}</h3>
          
          <div className="min-h-[200px]">
            <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
              {typedContent}
              {!isTypingComplete && <span className="animate-pulse">|</span>}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isTypingComplete ? 1 : 0 }}
            className="mt-8 flex justify-center"
          >
            <button
              onClick={onComplete}
              disabled={!isTypingComplete}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all w-full"
            >
              Tiếp tục
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
