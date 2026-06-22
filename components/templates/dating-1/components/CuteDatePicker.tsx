"use client";

import { useState } from "react";

export function CuteDatePicker({ selected, onSelect, accentColor }: { selected: string; onSelect: (date: string) => void, accentColor: string }) {
  let initialDate = new Date();
  if (selected && !isNaN(new Date(selected).getTime())) {
    initialDate = new Date(selected);
  }
  const [currentDate, setCurrentDate] = useState(initialDate);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleSelect = (day: number) => {
    const d = new Date(year, month, day);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    onSelect(`${yyyy}-${mm}-${dd}`);
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    const [sy, sm, sd] = selected.split('-');
    return Number(sy) === year && Number(sm) === month + 1 && Number(sd) === day;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isPast = (day: number) => {
    const d = new Date(year, month, day);
    return d < today;
  };

  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border-2 border-pink-100 p-4 shadow-sm w-full max-w-[320px] mx-auto text-gray-800">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-pink-100 font-bold text-pink-500 transition-colors">&lt;</button>
        <div className="font-extrabold">{monthNames[month]} {year}</div>
        <button onClick={nextMonth} className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-pink-100 font-bold text-pink-500 transition-colors">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '0.25rem' }}>
        {weekDays.map(d => (
          <div key={d} className="text-center text-xs font-bold text-gray-400">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '0.25rem' }}>
        {blanks.map(b => <div key={`blank-${b}`} />)}
        {days.map(d => {
          const past = isPast(d);
          return (
            <button
              key={d}
              onClick={() => !past && handleSelect(d)}
              disabled={past}
              className={`h-9 w-9 mx-auto flex justify-center items-center rounded-full text-sm font-bold transition-all ${past ? 'text-gray-300 opacity-50 cursor-not-allowed' : isSelected(d) ? 'text-white shadow-md scale-110' : 'hover:bg-pink-100 hover:scale-110'}`}
              style={{ backgroundColor: isSelected(d) ? accentColor : undefined }}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
