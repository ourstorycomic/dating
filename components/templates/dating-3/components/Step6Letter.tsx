import React, { useState, useEffect } from "react";

export function Step6Letter({ onNext, autoPlay, data }: { onNext: () => void, autoPlay?: boolean, data?: any }) {
  const [typedText, setTypedText] = useState("");
  const [done, setDone] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let timer1 = setTimeout(() => {
        setPhase(1);
        const audio = new Audio("/assets/vfx/touch.mp3");
        if (!(data?.compact && !autoPlay)) audio.play().catch(()=>{});
    }, 500);  // Open flap
    let timer2 = setTimeout(() => setPhase(2), 1200); // Slide letter up
    let timer3 = setTimeout(() => {
        setPhase(3);
        const audio = new Audio("/assets/vfx/you-found-bojuka_2.mp3");
        if (!(data?.compact && !autoPlay)) audio.play().catch(()=>{});
    }, 2000); // Pop letter up & center
    let timer4 = setTimeout(startTypewriter, 3000);   // Start typing
    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); clearTimeout(timer4); }
  }, []);

  useEffect(() => {
    if (autoPlay && done) {
      const timer = setTimeout(() => onNext(), 4000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, done, onNext]);

  const letterContent = data?.step6LetterBody || "Chào cậu,\nCó lẽ cậu sẽ hơi bất ngờ khi nhận được những dòng này. Tớ đã suy nghĩ rất nhiều, viết đi viết lại không biết bao nhiêu lần mới dám gửi.\nTừ những ngày đầu tiên nói chuyện, tớ đã nhận ra quỹ đạo của tớ cứ vô tình hướng về phía cậu. Cách cậu cười, những câu chuyện vô tri chúng mình nói với nhau, hay đôi khi chỉ là sự im lặng bình yên... tất cả đều khiến tớ cảm thấy đặc biệt.\nCậu biết không? Mỗi ngày trôi qua, tớ lại muốn được hiểu thêm về cậu, muốn được là người đồng hành cùng cậu trong những ngày nắng đẹp lẫn những chiều mưa buồn.\nCậu làm tớ vui lắm. Vì vậy... cậu cho tớ một cơ hội để bước vào thế giới của cậu nhé?";

  const startTypewriter = () => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(letterContent.substring(0, i));
      i++;
      if (i > letterContent.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 30);
  };

  // Determine classes based on phase
  let paperClasses = 'translate-y-0 scale-90 h-[170px] bottom-2 overflow-hidden';
  let paperZIndex = 10;

  if (phase === 2) {
      paperClasses = '-translate-y-[160px] scale-90 h-[170px] bottom-2 overflow-hidden';
      paperZIndex = 10; // Still behind front flaps, sliding out
  } else if (phase === 3) {
      paperClasses = '-translate-y-[15px] md:-translate-y-[20px] scale-[1.05] h-[300px] md:h-[360px] bottom-4';
      paperZIndex = 50; // Pop out in front of everything, center, and expand
  }

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-[60] flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Stardust */}
      <div className="stardust w-2 h-2 left-10 top-1/4"></div>
      <div className="stardust w-3 h-3 right-12 top-1/3" style={{ animationDelay: '1s' }}></div>
      <div className="stardust w-1 h-1 left-20 bottom-1/4" style={{ animationDelay: '2s' }}></div>
      <div className="stardust w-2 h-2 right-20 top-2/3" style={{ animationDelay: '1.5s' }}></div>
      
      <div className="relative w-[320px] h-[200px] mt-10 md:m-auto flex-shrink-0 scale-[0.85] sm:scale-100 origin-center self-center flex items-center justify-center">
          {/* Envelope Back */}
          <div className="absolute inset-0 bg-pink-300 rounded-xl shadow-lg border border-pink-400 z-0"></div>
          
          {/* Paper */}
          <div 
              className={`absolute inset-x-0 mx-auto w-[85%] max-w-[320px] bg-[#fffbf0] rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.2)] flex flex-col origin-center transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${paperClasses}`}
              style={{ zIndex: paperZIndex }}
          >
              <div className={`flex flex-col h-full w-full p-6 ${phase === 3 ? 'anim-float-letter' : ''}`} style={{ animationDelay: '0.8s' }}>
                  <div className="text-slate-800 text-lg md:text-xl leading-relaxed font-[Dancing_Script] text-left whitespace-pre-line overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-transparent">
                      <span>{typedText}</span>
                      {!done && phase === 3 && <span className="font-bold text-pink-500 animate-pulse ml-1">|</span>}
                  </div>
              </div>
          </div>

          {/* Envelope Front Flaps */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-xl z-20">
              <div className="absolute top-0 left-0 w-0 h-0 border-t-[100px] border-b-[100px] border-l-[160px] border-l-pink-400 border-t-transparent border-b-transparent"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[100px] border-b-[100px] border-r-[160px] border-r-pink-400 border-t-transparent border-b-transparent"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[160px] border-r-[160px] border-b-[120px] border-b-pink-500 border-l-transparent border-r-transparent drop-shadow-md"></div>
          </div>

          {/* Envelope Top Flap (Animated) */}
          <div 
              className={`absolute top-0 left-0 w-0 h-0 border-l-[160px] border-r-[160px] border-t-[110px] border-t-pink-200 border-l-transparent border-r-transparent drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)] flex justify-center origin-top transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${phase > 0 ? 'rotate-x-180 z-0' : 'rotate-x-0 z-30'}`}
              style={{ transform: phase > 0 ? 'rotateX(180deg)' : 'rotateX(0deg)' }}
          >
              <div className="absolute -top-[100px] w-10 h-10 bg-red-500 rounded-full shadow-md border-2 border-white flex items-center justify-center" style={{ transform: phase > 0 ? 'rotateX(180deg)' : 'rotateX(0deg)' }}>
                  <i className="fas fa-stamp text-white text-xs"></i>
              </div>
          </div>
      </div>
      
      {/* Action Button */}
      <button 
          onClick={onNext}
          className={`absolute bottom-8 md:bottom-12 bg-white text-slate-800 border-[3px] border-pink-300 px-8 py-3.5 rounded-full font-bold shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 z-[70] transition-all duration-1000 ${done ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
          {data?.step6Btn || "Đóng Dấu Xác Nhận 🔏"}
      </button>
    </div>
  );
}
