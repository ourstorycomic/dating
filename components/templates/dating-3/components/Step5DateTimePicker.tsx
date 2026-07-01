import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Step5DateTimePicker({ onNext, autoPlay, data }: { onNext: (date: string, time: string) => void, autoPlay?: boolean, data?: any }) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    if (autoPlay) {
      const timer1 = setTimeout(() => setSelectedDate("Cuối Tuần"), 1500);
      const timer2 = setTimeout(() => setSelectedTime("Tối"), 3000);
      const timer3 = setTimeout(() => onNext("Cuối Tuần", "Tối"), 4500);
      return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); }
    }
  }, [autoPlay, onNext]);

  const dates = data?.dtDates || ["Tối Nay", "Ngày Mai", "Cuối Tuần", "Tuần Sau"];
  const times = data?.dtTimes || ["Sáng", "Chiều", "Tối"];

  const isValid = selectedDate && selectedTime;

  // Icons matching function
  const getIcon = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes("tối") || t.includes("đêm")) return "🌙";
    if (t.includes("mai") || t.includes("sáng") || t.includes("trưa") || t.includes("chiều")) return "☀️";
    if (t.includes("cuối tuần")) return "🎉";
    if (t.includes("tuần")) return "📅";
    return "✨";
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center p-6 overflow-y-auto bg-gradient-to-b from-pink-50 via-white to-pink-100">
      
      {/* Decorative background elements */}
      <div className="fixed top-[-10%] left-[-10%] w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="fixed top-[-10%] right-[-10%] w-64 h-64 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="w-full max-w-sm mt-8 mb-6 relative z-10 text-center">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-violet-500 drop-shadow-sm mb-3">
          {data?.dtTitle}
        </h2>
        <p className="text-gray-500 font-medium text-base">
          {data?.dtSub}
        </p>
      </motion.div>
      
      <div className="w-full max-w-[340px] space-y-8 relative z-10 pb-24">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="bg-white/60 backdrop-blur-2xl p-5 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-3 text-lg">
                    <span className="w-8 h-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center text-sm shadow-inner shadow-pink-200">1</span>
                    {data?.dtDateLabel}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {dates.map((date: string, index: number) => {
                        const isSel = selectedDate === date;
                        return (
                          <motion.button 
                              key={date}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedDate(date)}
                              className={`relative overflow-hidden py-4 px-2 flex flex-col items-center justify-center gap-2 text-sm font-bold rounded-2xl transition-all duration-300 shadow-sm ${isSel ? 'bg-gradient-to-br from-pink-400 to-rose-400 text-white shadow-pink-300/50 shadow-lg border-transparent' : 'bg-white text-gray-600 border border-pink-100 hover:border-pink-300 hover:shadow-md'}`}
                          >
                              {isSel && <motion.div layoutId="date-bg" className="absolute inset-0 bg-white/20" />}
                              <span className="text-2xl drop-shadow-sm">{getIcon(date)}</span>
                              <span className="relative z-10">{date}</span>
                          </motion.button>
                        );
                    })}
                </div>
              </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <div className="bg-white/60 backdrop-blur-2xl p-5 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-3 text-lg">
                    <span className="w-8 h-8 rounded-full bg-violet-100 text-violet-500 flex items-center justify-center text-sm shadow-inner shadow-violet-200">2</span>
                    {data?.dtTimeLabel}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    {times.map((time: string, index: number) => {
                        const isSel = selectedTime === time;
                        return (
                          <motion.button 
                              key={time}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedTime(time)}
                              className={`relative overflow-hidden py-4 text-sm font-bold rounded-2xl transition-all duration-300 shadow-sm ${isSel ? 'bg-gradient-to-br from-violet-400 to-purple-500 text-white shadow-violet-300/50 shadow-lg border-transparent' : 'bg-white text-gray-600 border border-violet-100 hover:border-violet-300 hover:shadow-md'}`}
                          >
                              {isSel && <motion.div layoutId="time-bg" className="absolute inset-0 bg-white/20" />}
                              <span className="relative z-10">{time}</span>
                          </motion.button>
                        );
                    })}
                </div>
              </div>
          </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
        className="fixed bottom-0 inset-x-0 p-6 bg-gradient-to-t from-pink-50 via-white/80 to-transparent pointer-events-none z-20 flex justify-center"
      >
        <button 
            onClick={() => isValid && onNext(selectedDate, selectedTime)}
            className={`pointer-events-auto w-full max-w-[340px] py-5 rounded-[2rem] font-black text-lg transition-all duration-500 ${isValid ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_15px_30px_-10px_rgba(244,114,182,0.6)] hover:scale-[1.02] active:scale-95 hover:shadow-[0_20px_40px_-10px_rgba(244,114,182,0.8)]' : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-80'}`}
        >
            {data?.dtBtn}
        </button>
      </motion.div>
    </div>
  );
}

