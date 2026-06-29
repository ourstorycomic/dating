"use client";

import { useState } from "react";

export function CuteTimePicker({ selected, onSelect, accentColor }: { selected: string; onSelect: (time: string) => void, accentColor: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState(selected ? selected.split(':')[0] : "");
  const [minute, setMinute] = useState(selected ? selected.split(':')[1] : "");

  const handleUpdate = (h: string, m: string) => {
    setHour(h);
    setMinute(m);
    if (h && m) {
      onSelect(`${h}:${m}`);
      // Close automatically after selecting both
      setTimeout(() => setIsOpen(false), 300);
    }
  };

  const displayTime = selected ? `${hour}:${minute}` : "Chọn giờ hẹn ⏰";

  return (
    <div className="w-full max-w-[320px] mx-auto text-gray-800">
      <button 
        onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
        className="w-full flex items-center justify-between bg-white/80 backdrop-blur-md rounded-2xl border-2 p-3 sm:p-4 shadow-sm font-bold text-sm sm:text-base transition-all hover:bg-white"
        style={{ borderColor: isOpen ? accentColor : '#fce7f3', color: selected ? accentColor : '#4b5563' }}
      >
        <span>{displayTime}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {isOpen && (
        <div className="mt-2 bg-white/95 backdrop-blur-xl rounded-2xl border-2 border-pink-100 p-4 shadow-xl origin-top animate-in fade-in slide-in-from-top-2 duration-200 relative z-50 flex items-center justify-center gap-4">
          <div className="relative">
            <select 
              value={hour} 
              onChange={e => handleUpdate(e.target.value, minute)}
              className="text-2xl sm:text-3xl font-black bg-transparent outline-none cursor-pointer appearance-none text-center pr-2 transition-transform hover:scale-110"
              style={{ color: hour ? accentColor : '#9ca3af' }}
            >
              <option value="" disabled>--</option>
              {Array.from({length: 24}, (_, i) => String(i).padStart(2, '0')).map(h => <option key={h} value={h} style={{color: '#374151'}}>{h}</option>)}
            </select>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-gray-300">:</span>
          <div className="relative">
            <select 
              value={minute} 
              onChange={e => handleUpdate(hour, e.target.value)}
              className="text-2xl sm:text-3xl font-black bg-transparent outline-none cursor-pointer appearance-none text-center pr-2 transition-transform hover:scale-110"
              style={{ color: minute ? accentColor : '#9ca3af' }}
            >
              <option value="" disabled>--</option>
              {["00", "15", "30", "45"].map(m => <option key={m} value={m} style={{color: '#374151'}}>{m}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
