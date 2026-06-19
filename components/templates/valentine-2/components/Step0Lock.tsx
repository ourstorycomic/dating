import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";

export function Step0Lock({ code, onUnlock }: { code: string; onUnlock: () => void }) {
  const [input, setInput] = useState(["", "", "", ""]);
  const [unlocked, setUnlocked] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (input.join("") === code) {
      setUnlocked(true);
      setTimeout(() => onUnlock(), 1500);
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
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.5, rotateY: 90, transition: { duration: 0.8, type: "spring" } }}
    >
      <motion.div
        animate={unlocked ? { scale: 1.5, opacity: 0, rotate: 90 } : { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 2 } }}
        className="mb-8 text-rose-300 drop-shadow-[0_0_15px_rgba(251,113,133,0.8)]"
      >
        {unlocked ? <Unlock size={80} /> : <Lock size={80} />}
      </motion.div>

      <motion.div 
        animate={unlocked ? { opacity: 0, y: 50 } : { opacity: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-2 tracking-wide">The Portal</h2>
        <p className="text-rose-200/70 text-sm mb-8 text-center px-4">
          Nhập đúng "Ngày chúng mình bắt đầu"<br/>
          (Gợi ý: {code})
        </p>

        <div className="flex gap-4">
          {input.map((val, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="text"
              maxLength={1}
              value={val}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-14 h-16 text-3xl font-bold text-center bg-white/10 border-2 border-rose-300/50 rounded-xl focus:border-rose-400 focus:bg-white/20 outline-none transition-all text-white shadow-[0_0_10px_rgba(251,113,133,0.3)]"
              readOnly={unlocked}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
