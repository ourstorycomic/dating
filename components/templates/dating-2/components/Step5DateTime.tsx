import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TPL_DATA } from "../config";
import { CuteDatePicker } from "../../dating-1/components/CuteDatePicker";
import { CuteTimePicker } from "../../dating-1/components/CuteTimePicker";

export function Step5DateTime({ onNext , customData = {}, autoPlay}: { onNext: (date: string, time: string) => void , customData?: any, autoPlay?: boolean}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const canNext = selectedDate !== "" && selectedTime !== "";

  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(() => {
        setSelectedDate("2024-02-14");
        setSelectedTime("19:00");
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [autoPlay]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4">
      <h3 className="text-3xl font-bold text-pink-600 mb-6 letter-font drop-shadow-md">{(customData.dtTitle || TPL_DATA.dtTitle)}</h3>
      <div className="w-11/12 max-w-[400px] mb-8 flex flex-col gap-4 max-h-[60vh] overflow-y-auto no-scrollbar pb-10">
        
        <p className="font-bold text-gray-700 text-lg flex items-center bg-white/70 py-2 px-4 rounded-full shadow-sm w-fit mx-auto">
            <svg className="w-5 h-5 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/></svg>
            Chọn Ngày:
        </p>
        <div className="mx-auto w-full">
            <CuteDatePicker selected={selectedDate} onSelect={setSelectedDate} accentColor="#ec4899" />
        </div>
        
        <p className="font-bold text-gray-700 text-lg flex items-center bg-white/70 py-2 px-4 rounded-full shadow-sm w-fit mx-auto mt-4">
            <svg className="w-5 h-5 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
            Chọn Giờ:
        </p>
        <div className="mx-auto w-full">
            <CuteTimePicker selected={selectedTime} onSelect={setSelectedTime} accentColor="#ec4899" />
        </div>

      </div>
      <button 
        onClick={() => { 
            if(canNext) {
                const dateParts = selectedDate.split('-');
                const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
                onNext(formattedDate, selectedTime); 
            }
        }} 
        className={`px-10 py-3 bg-pink-500 text-white font-bold rounded-full shadow-xl transition-all hover:bg-pink-600 text-lg absolute bottom-10 ${canNext ? '' : 'opacity-50 pointer-events-none'}`}
      >
        {(customData.dtBtn || TPL_DATA.dtBtn)}
      </button>
    </motion.div>
  );
}
