"use client";

import { useState } from "react";

export function CuteTimePicker({ selected, onSelect, accentColor }: { selected: string; onSelect: (time: string) => void, accentColor: string }) {
  const [hour, setHour] = useState(selected ? selected.split(':')[0] : "");
  const [minute, setMinute] = useState(selected ? selected.split(':')[1] : "");

  const handleUpdate = (h: string, m: string) => {
    setHour(h);
    setMinute(m);
    if (h && m) {
      onSelect(`${h}:${m}`);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 bg-white/80 backdrop-blur-md rounded-2xl border-2 border-pink-100 p-4 shadow-sm w-full max-w-[320px] mx-auto">
      <div className="relative">
        <select 
          value={hour} 
          onChange={e => handleUpdate(e.target.value, minute)}
          className="text-3xl font-black bg-transparent outline-none cursor-pointer appearance-none text-center pr-2 transition-transform hover:scale-110"
          style={{ color: hour ? accentColor : '#9ca3af' }}
        >
          <option value="" disabled>--</option>
          {Array.from({length: 24}, (_, i) => String(i).padStart(2, '0')).map(h => <option key={h} value={h} style={{color: '#374151'}}>{h}</option>)}
        </select>
      </div>
      <span className="text-3xl font-black text-gray-300">:</span>
      <div className="relative">
        <select 
          value={minute} 
          onChange={e => handleUpdate(hour, e.target.value)}
          className="text-3xl font-black bg-transparent outline-none cursor-pointer appearance-none text-center pr-2 transition-transform hover:scale-110"
          style={{ color: minute ? accentColor : '#9ca3af' }}
        >
          <option value="" disabled>--</option>
          {["00", "15", "30", "45"].map(m => <option key={m} value={m} style={{color: '#374151'}}>{m}</option>)}
        </select>
      </div>
    </div>
  );
}
