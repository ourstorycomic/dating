"use client";

import { useState } from "react";

export function CuteDatePicker({ selected, onSelect, accentColor }: { selected: string; onSelect: (date: string) => void, accentColor: string }) {
  const [isOpen, setIsOpen] = useState(false);

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

  const prevMonth = (e: React.MouseEvent) => { e.preventDefault(); setCurrentDate(new Date(year, month - 1, 1)); };
  const nextMonth = (e: React.MouseEvent) => { e.preventDefault(); setCurrentDate(new Date(year, month + 1, 1)); };

  const handleSelect = (day: number) => {
    const d = new Date(year, month, day);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    onSelect(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
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

  const displayDate = selected ? `${selected.split('-')[2]}/${selected.split('-')[1]}/${selected.split('-')[0]}` : "Chọn ngày hẹn 📅";

  return (
    <div className="w-full max-w-[320px] mx-auto text-gray-800">
      <button 
        onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
        className="w-full flex items-center justify-between bg-white/80 backdrop-blur-md rounded-2xl border-2 p-3 sm:p-4 shadow-sm font-bold text-sm sm:text-base transition-all hover:bg-white"
        style={{ borderColor: isOpen ? accentColor : '#fce7f3', color: selected ? accentColor : '#4b5563' }}
      >
        <span>{displayDate}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {isOpen && (
        <div className="mt-2 bg-white/95 backdrop-blur-xl rounded-2xl border-2 border-pink-100 p-3 sm:p-4 shadow-xl origin-top animate-in fade-in slide-in-from-top-2 duration-200 relative z-50">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <button onClick={prevMonth} className="w-6 h-6 sm:w-8 sm:h-8 flex justify-center items-center rounded-full hover:bg-pink-100 font-bold text-pink-500 transition-colors">&lt;</button>
            <div className="font-extrabold text-sm sm:text-base">{monthNames[month]} {year}</div>
            <button onClick={nextMonth} className="w-6 h-6 sm:w-8 sm:h-8 flex justify-center items-center rounded-full hover:bg-pink-100 font-bold text-pink-500 transition-colors">&gt;</button>
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
                  onClick={(e) => { e.preventDefault(); !past && handleSelect(d); }}
                  disabled={past}
                  className={`h-7 w-7 sm:h-9 sm:w-9 mx-auto flex justify-center items-center rounded-full text-xs sm:text-sm font-bold transition-all ${past ? 'text-gray-300 opacity-50 cursor-not-allowed' : isSelected(d) ? 'text-white shadow-md scale-110' : 'hover:bg-pink-100 hover:scale-110'}`}
                  style={{ backgroundColor: isSelected(d) ? accentColor : undefined }}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
