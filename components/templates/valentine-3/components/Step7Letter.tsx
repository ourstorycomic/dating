import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Mail, ChevronRight } from "lucide-react";

export function Step7Letter({ title, content, onComplete, autoPlay = false }: { title: string; content: string; onComplete: () => void; autoPlay?: boolean }) {
  const [status, setStatus] = useState<"closed" | "opening" | "open">("closed");
  const [typedContent, setTypedContent] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (status !== "open") return;

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
  }, [status, content]);

  useEffect(() => {
    if (autoPlay) {
      if (status === "closed") {
        const t = setTimeout(() => {
          handleOpen();
        }, 1500);
        return () => clearTimeout(t);
      } else if (status === "open" && isTypingComplete) {
        const t = setTimeout(() => {
          onComplete();
        }, 3000);
        return () => clearTimeout(t);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, status, isTypingComplete]);

  const handleOpen = () => {
    if (status !== "closed") return;
    setStatus("opening");
    
    // Play opening sound
    const audio = new Audio("/assets/vfx/touch.mp3");
    audio.play().catch(()=>{});

    setTimeout(() => {
      setStatus("open");
    }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 perspective-[1000px]"
    >
      <AnimatePresence mode="wait">
        {status !== "open" && (
          <motion.div
            key="envelope"
            initial={{ y: -200, rotate: -10 }}
            animate={
              status === "opening" 
                ? { y: 100, scale: 0.8, opacity: 0, transition: { delay: 1.2, duration: 0.5 } } 
                : { y: 0, rotate: 0, transition: { type: "spring", stiffness: 200, damping: 15 } }
            }
            exit={{ opacity: 0, scale: 0.5 }}
            className="cursor-pointer group flex flex-col items-center relative"
            onClick={handleOpen}
          >
            {/* The Envelope Assembly */}
            <div className="relative w-64 h-40 flex items-center justify-center">
              
              {/* Back of envelope */}
              <div className="absolute inset-0 bg-rose-200 rounded-lg shadow-xl" />
              
              {/* The Letter inside */}
              <motion.div 
                initial={{ y: 10 }}
                animate={status === "opening" ? { y: -120, zIndex: 40 } : {}}
                transition={{ delay: 0.4, duration: 0.8, ease: "backOut" }}
                className="absolute inset-x-2 top-2 bottom-2 bg-white rounded-md shadow-sm flex flex-col items-center pt-4"
              >
                <div className="w-12 h-1 bg-rose-100 rounded-full mb-2" />
                <div className="w-3/4 h-1 bg-rose-50 rounded-full mb-2" />
                <div className="w-1/2 h-1 bg-rose-50 rounded-full" />
                <span className="text-2xl mt-2">💖</span>
              </motion.div>

              {/* Envelope Flap (Top) */}
              <motion.div 
                initial={{ rotateX: 0 }}
                animate={status === "opening" ? { rotateX: 180, zIndex: 0 } : {}}
                transition={{ duration: 0.5 }}
                style={{ transformOrigin: "top" }}
                className="absolute top-0 w-0 h-0 border-l-[128px] border-r-[128px] border-t-[80px] border-transparent border-t-rose-300 z-30 drop-shadow-md"
              />

              {/* Envelope Front (Bottom) */}
              <div className="absolute bottom-0 w-0 h-0 border-l-[128px] border-r-[128px] border-b-[80px] border-transparent border-b-rose-100 z-20" />
              
              {/* Seal */}
              <motion.div 
                animate={status === "opening" ? { opacity: 0, scale: 0 } : {}}
                className="absolute w-14 h-14 rounded-full bg-rose-500 flex items-center justify-center shadow-md z-40 group-hover:bg-rose-400 transition-colors"
              >
                <Mail className="text-white" size={24} />
              </motion.div>
            </div>
            
            <motion.p 
              animate={status === "opening" ? { opacity: 0 } : { opacity: 1 }}
              className="mt-12 text-rose-500 font-bold animate-pulse"
            >
              Chạm để mở thư 💌
            </motion.p>
          </motion.div>
        )}

        {status === "open" && (
          <motion.div
            key="letter"
            initial={{ scale: 0.5, y: 100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
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
      </AnimatePresence>
    </motion.div>
  );
}
