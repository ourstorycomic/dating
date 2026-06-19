import React, { useState, useEffect } from "react";

export function Step5DateTimePicker({ onNext, autoPlay, data }: { onNext: (date: string, time: string) => void, autoPlay?: boolean, data?: any }) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    if (autoPlay) {
      const timer1 = setTimeout(() => setSelectedDate("Cuối Tuần"), 1000);
      const timer2 = setTimeout(() => setSelectedTime("Tối"), 2000);
      const timer3 = setTimeout(() => onNext("Cuối Tuần", "Tối"), 3500);
      return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); }
    }
  }, [autoPlay, onNext]);

  const dates = data?.dtDates || ["Tối Nay", "Ngày Mai", "Cuối Tuần", "Tuần Sau"];
  const times = data?.dtTimes || ["Sáng", "Chiều", "Tối"];

  const isValid = selectedDate && selectedTime;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center p-6 overflow-y-auto" style={{ backgroundColor: data?.dtBgColor || '#f8fafc' }}>
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mt-6 mb-2 text-center anim-spring-up">{data?.dtTitle}</h2>
      <p className="text-gray-500 font-medium text-sm mb-10 text-center anim-spring-up delay-100">{data?.dtSub}</p>
      
      <div className="w-full max-w-[320px] space-y-8">
          <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 anim-spring-up delay-100">
                  <i className="far fa-calendar-check text-pink-500 text-xl"></i> {data?.dtDateLabel}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                  {dates.map((date: string, index: number) => (
                      <button 
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`liquid-btn anim-pop-in delay-${(index%2 + 1)*100} py-4 text-sm font-bold rounded-2xl border-2 shadow-sm ${selectedDate === date ? 'selected' : 'bg-white text-gray-600 border-gray-200'}`}
                      >
                          {date}
                      </button>
                  ))}
              </div>
          </div>
          
          <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 anim-spring-up delay-200">
                  <i className="far fa-clock text-blue-500 text-xl"></i> {data?.dtTimeLabel}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                  {times.map((time: string, index: number) => (
                      <button 
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`liquid-btn anim-pop-in delay-${(index + 2)*100} py-3 text-sm font-bold rounded-xl border-2 shadow-sm ${selectedTime === time ? 'selected' : 'bg-white text-gray-600 border-gray-200'}`}
                      >
                          {time}
                      </button>
                  ))}
              </div>
          </div>
      </div>

      <button 
          onClick={() => isValid && onNext(selectedDate, selectedTime)}
          className={`mt-auto mb-10 w-[280px] py-4 rounded-full font-extrabold text-lg transition-all duration-500 ${isValid ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-105 active:scale-95 anim-pulse-glow' : 'bg-gray-300 text-gray-500 pointer-events-none'}`}
      >
          {data?.dtBtn}
      </button>
    </div>
  );
}
