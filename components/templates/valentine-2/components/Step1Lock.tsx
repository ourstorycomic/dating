import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";

export function Step1Lock({ code, onUnlock }: { code: string; onUnlock: () => void }) {
  const [input, setInput] = useState(["", "", "", ""]);
  const [unlocked, setUnlocked] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const currentInput = input.join("");
    if (currentInput.length === 4) {
      if (currentInput === code) {
        setIsError(false);
        setUnlocked(true);
        setTimeout(() => onUnlock(), 2000); // Wait 2s before going to Step 2
      } else {
        // Wrong password
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
          setInput(["", "", "", ""]);
          inputRefs.current[0]?.focus();
        }, 600);
      }
    } else {
      setIsError(false);
    }
  }, [input, code, onUnlock]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newInputs = [...input];
    newInputs[index] = value;
    setInput(newInputs);

    if (value !== "" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && input[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 bg-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
    >
      <motion.div
        animate={
          isError 
            ? { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } } 
            : unlocked 
              ? { scale: 1.2, opacity: 0, rotateY: 180 } 
              : { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 3 } }
        }
        transition={unlocked ? { duration: 1.5, ease: "easeInOut" } : {}}
        className={`mb-8 drop-shadow-[0_0_15px_rgba(251,113,133,0.8)] [transform-style:preserve-3d] ${isError ? "text-red-500" : "text-rose-300"}`}
      >
        {unlocked ? <Unlock size={80} /> : <Lock size={80} />}
      </motion.div>

      <motion.div 
        animate={unlocked ? { opacity: 0, y: 50, transition: { duration: 1.5 } } : { opacity: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-2 tracking-wide font-serif">Cánh Cửa Ký Ức</h2>
        <p className="text-rose-200/70 text-sm mb-8 text-center px-4">
          Nhập ngày bắt đầu của chúng mình<br/>
          (Gợi ý: {code})
        </p>

        <motion.div 
          animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex gap-4"
        >
          {input.map((val, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="text"
              maxLength={1}
              value={val}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-14 h-16 text-center text-3xl font-bold bg-white/20 border-2 ${isError ? "border-red-500 text-red-500 bg-red-500/20" : "border-rose-300/50 text-white focus:border-rose-300 focus:bg-white/30"} rounded-xl outline-none transition-all shadow-[0_8px_32px_rgba(0,0,0,0.1)]`}
              readOnly={unlocked}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
