import React, { useState } from "react";
import { motion } from "framer-motion";
import { TPL_DATA } from "../config";

export function Step1Login({ onNext , customData = {}}: { onNext: () => void , customData?: any}) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const pressPin = (num: number) => {
    setError(false);
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => {
          if (newPin === (customData.pinCode || TPL_DATA.pinCode)) {
            onNext();
          } else {
            setError(true);
            setPin("");
          }
        }, 300);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} transition={{ duration: 0.5 }} className="absolute inset-0 z-10 flex items-center justify-center p-4">
      <motion.div animate={error ? { x: [-10, 10, -10, 10, 0] } : {}} className="glass-panel p-8 rounded-3xl w-[90%] text-center shadow-xl">
        <div className="text-4xl text-pink-500 mb-4 drop-shadow-md flex justify-center">
           <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-6 drop-shadow-md">
          {customData.loginTitle || TPL_DATA.loginTitle}
          <br/>
          <span className="text-xs font-normal text-gray-600">
            {(customData.loginHint || TPL_DATA.loginHint).replace("{pin}", customData.pinCode || TPL_DATA.pinCode)}
          </span>
        </h2>
        
        <div className="flex justify-center gap-4 mb-6">
          {[0,1,2,3].map(i => (
            <div key={i} className={`w-4 h-4 rounded-full border-2 border-pink-400 transition-colors ${i < pin.length ? 'bg-pink-500' : 'bg-transparent'}`}></div>
          ))}
        </div>
        {error && <p className="text-red-500 text-sm mb-4 font-medium">{customData.loginErrorText || TPL_DATA.loginErrorText}</p>}

        <div className="grid grid-cols-3 gap-3 mb-2">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} onClick={() => pressPin(n)} className="w-14 h-14 mx-auto rounded-full bg-white/50 hover:bg-white/80 active:bg-white/90 text-pink-600 text-xl font-semibold shadow-sm transition-all">{n}</button>
          ))}
          <div />
          <button onClick={() => pressPin(0)} className="w-14 h-14 mx-auto rounded-full bg-white/50 hover:bg-white/80 active:bg-white/90 text-pink-600 text-xl font-semibold shadow-sm transition-all">0</button>
          <button onClick={() => setPin(pin.slice(0, -1))} className="w-14 h-14 mx-auto rounded-full bg-pink-100/50 hover:bg-pink-200 text-pink-600 text-lg flex items-center justify-center shadow-sm transition-all">
             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"/></svg>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
