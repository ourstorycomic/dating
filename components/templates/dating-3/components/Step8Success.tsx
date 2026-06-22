import React, { useEffect } from "react";

export function Step8Success({ location, date, time, onComplete, autoPlay, data }: { location: string, date: string, time: string, onComplete: () => void, autoPlay?: boolean, data?: any }) {
  
  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => onComplete(), 5000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, onComplete]);

  return (
    <div className="absolute inset-0 bg-black/85 backdrop-blur-xl z-[80] flex flex-col items-center justify-center p-6">
      
      <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-10 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)] anim-spring-up text-center uppercase tracking-widest">
          {data?.step8Title}
      </h1>

      <div className="holo-ticket w-full max-w-[340px] rounded-3xl overflow-hidden relative anim-spring-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-5 flex justify-between items-center text-white shadow-md">
              <span className="font-black tracking-[0.2em] text-sm"><i className="fas fa-plane-departure mr-3"></i>LOVE AIRLINES</span>
              <i className="fas fa-heart text-xl animate-pulse"></i>
          </div>
          <div className="p-8 bg-white/90">
              <div className="flex justify-between border-b-2 border-dashed border-gray-300 pb-5 mb-5">
                  <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Passenger</p>
                      <p className="text-xl font-black text-gray-800">CẬU & TỚ</p>
                  </div>
                  <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Class</p>
                      <p className="text-xl font-black text-pink-600 bg-pink-100 px-2 py-0.5 rounded text-center">VIP DATE</p>
                  </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Date & Time</p>
                      <p className="font-bold text-gray-800 text-lg">{date} - {time}</p>
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Destination</p>
                      <p className="font-bold text-gray-800 text-lg">{location}</p>
                  </div>
              </div>
              
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-xl text-center border border-pink-100">
                  <p className="text-sm font-semibold text-pink-600">{data?.step8Sub}</p>
              </div>

              <div className="mt-6 flex justify-center opacity-40">
                  <div className="w-full h-8 bg-[repeating-linear-gradient(90deg,#000,#000_2px,transparent_2px,transparent_4px,#000_4px,#000_8px,transparent_8px,transparent_10px)]"></div>
              </div>
          </div>
          <div className="absolute top-[60px] -left-4 w-8 h-8 bg-black/85 rounded-full shadow-inner"></div>
          <div className="absolute top-[60px] -right-4 w-8 h-8 bg-black/85 rounded-full shadow-inner"></div>
      </div>
      
      <p className="text-white/60 text-xs mt-8 anim-pop-in text-center" style={{ animationDelay: '0.6s' }}>
          Chụp màn hình lại để làm bằng chứng nha!
      </p>

      <button 
          onClick={onComplete}
          className="mt-4 text-white/80 underline text-sm hover:text-white"
      >
          {data?.step8Btn}
      </button>
    </div>
  );
}
