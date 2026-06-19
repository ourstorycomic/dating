import React, { useState, useEffect } from "react";

export function Step7Verification({ location, date, time, onNext, autoPlay, data }: { location: string, date: string, time: string, onNext: () => void, autoPlay?: boolean, data?: any }) {
  const [noCount, setNoCount] = useState(0);

  const noPhrases = data?.step7BtnNoOptions || [
    "HỦY BỎ ☹",
    "Đừng vậy mà 🥺",
    "Suy nghĩ lại điii 😭",
    "Cho tớ cơ hội đi 🥺",
    "Cậu nhẫn tâm vậy sao 💔",
    "Đi mà đi mà đi mà 🥺",
    "Bấm nhầm đúng không? 😢",
    "Đừng chối từ tớ 😭",
    "Tớ khóc đó 💦",
    "Nha nha nha 🥺",
    "Bấm nút kia điiii 😡"
  ];

  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => onNext(), 2000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, onNext]);

  const handleNo = () => {
    setNoCount(prev => prev + 1);
  };

  const currentNoText = noPhrases[Math.min(noCount, noPhrases.length - 1)];

  return (
    <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center p-6" style={{ backgroundColor: data?.step7Bg || '#fce7f3' }}>
      <div className="w-full max-w-[360px] bg-white rounded-[2rem] shadow-2xl p-8 text-center border-[6px] border-pink-200 relative overflow-hidden anim-spring-up">
          <div className="absolute top-0 left-0 w-full bg-pink-500 text-white font-black py-1.5 text-xs tracking-[0.3em] uppercase">{data?.step7Title}</div>
          
          <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mt-6 mb-4 anim-heartbeat shadow-inner">
              <i className="fas fa-shield-heart text-5xl text-pink-500 drop-shadow-md"></i>
          </div>
          
          <h3 className="text-2xl font-extrabold text-gray-800 mb-3">{data?.step7Title2}</h3>
          <p className="text-base text-gray-600 mb-8 leading-relaxed font-medium">
              {(data?.step7Sub || "Đồng ý đi chơi với tớ vào {time} - {date} đi {location} không?").replace('{time}', time).replace('{date}', date).replace('{location}', location)}
          </p>

          <div className="relative w-full min-h-[140px] flex flex-col items-center justify-center gap-6 mt-4">
              <button 
                  onClick={onNext}
                  style={{ transform: `scale(${1 + noCount * 0.35})` }}
                  className={`bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-full font-extrabold shadow-[0_10px_20px_rgba(236,72,153,0.4)] anim-heartbeat z-30 whitespace-nowrap transition-transform duration-300 ease-out origin-center ${noCount >= noPhrases.length ? 'absolute inset-0 m-auto w-max h-max' : ''}`}
              >
                  CHẮC CHẮN RỒI 🥰
              </button>
              
              {noCount < noPhrases.length && (
                  <button 
                      onClick={handleNo}
                      style={{ transform: `scale(${Math.max(0.1, 1 - noCount * 0.15)})` }}
                      className="bg-gray-200 text-gray-600 border border-gray-300 px-6 py-2.5 rounded-full font-bold shadow-sm z-20 whitespace-nowrap transition-transform duration-300 ease-out origin-center"
                  >
                      {currentNoText}
                  </button>
              )}
          </div>
      </div>
    </div>
  );
}
