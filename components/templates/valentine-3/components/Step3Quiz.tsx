import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check, X } from "lucide-react";

export type QuizItem = {
  question: string;
  options: string[];
  correctIndex: number;
  correctText: string;
  wrongText: string;
};

export function Step3Quiz({ quiz, onComplete, autoPlay = false }: { quiz: QuizItem[]; onComplete: () => void; autoPlay?: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [shakeKey, setShakeKey] = useState(0); // to re-trigger shake animation

  const currentQ = quiz[currentIndex];

  const handleSelect = (index: number) => {
    if (status === "correct") return; // block input if already transitioning

    setSelectedOpt(index);
    if (index === currentQ.correctIndex) {
      setStatus("correct");
      setTimeout(() => {
        if (currentIndex < quiz.length - 1) {
          setCurrentIndex(c => c + 1);
          setSelectedOpt(null);
          setStatus("idle");
        } else {
          onComplete();
        }
      }, 1500);
    } else {
      setStatus("wrong");
      setShakeKey(k => k + 1);
      setTimeout(() => {
        setStatus("idle");
        setSelectedOpt(null);
      }, 1500);
    }
  };

  useEffect(() => {
    if (autoPlay && status === "idle") {
      const t = setTimeout(() => {
        handleSelect(currentQ.correctIndex);
      }, 2000);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, currentIndex, status]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10"
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-pink-400 font-bold uppercase tracking-widest text-sm mb-2">Trạm Trí Nhớ {currentIndex + 1}/{quiz.length}</p>
          <h3 className="text-2xl font-extrabold text-rose-600 leading-tight">
            {currentQ.question}
          </h3>
        </div>

        <motion.div
          key={shakeKey}
          animate={status === "wrong" ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4"
        >
          {currentQ.options.map((opt, i) => {
            const isSelected = selectedOpt === i;
            const isCorrect = i === currentQ.correctIndex;
            
            let btnClass = "relative w-full py-4 px-6 rounded-2xl border-2 text-lg font-bold transition-all overflow-hidden text-left shadow-sm ";
            
            if (status === "idle") {
              btnClass += isSelected ? "border-rose-400 bg-rose-50 text-rose-700" : "border-pink-100 bg-white/80 hover:bg-pink-50 hover:border-pink-200 text-slate-700";
            } else if (status === "correct") {
              if (isSelected && isCorrect) {
                btnClass += "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-[0_0_20px_rgba(52,211,153,0.3)]";
              } else {
                btnClass += "border-pink-100 bg-white/50 text-slate-400 opacity-50";
              }
            } else if (status === "wrong") {
              if (isSelected) {
                btnClass += "border-red-400 bg-red-50 text-red-600";
              } else {
                btnClass += "border-pink-100 bg-white/80 text-slate-700";
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={btnClass}
              >
                <div className="flex items-center justify-between relative z-10">
                  <span>{opt}</span>
                  {status === "correct" && isSelected && isCorrect && <Check className="text-emerald-500" />}
                  {status === "wrong" && isSelected && <X className="text-red-500" />}
                </div>
              </button>
            );
          })}
        </motion.div>

        <div className="h-16 mt-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {status === "correct" && (
              <motion.p
                key="correct"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-emerald-600 font-bold bg-emerald-100 px-4 py-2 rounded-full"
              >
                {currentQ.correctText}
              </motion.p>
            )}
            {status === "wrong" && (
              <motion.p
                key="wrong"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-red-500 font-bold bg-red-100 px-4 py-2 rounded-full"
              >
                {currentQ.wrongText}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
