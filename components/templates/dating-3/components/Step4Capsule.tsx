import React, { useState, useEffect } from "react";

export function Step4Capsule({ onOpened, autoPlay, compact, data }: { onOpened: () => void, autoPlay?: boolean, compact?: boolean, data?: any }) {
  const [isShaking, setIsShaking] = useState(false);
  const [opened, setOpened] = useState(false);
  const popSoundRef = React.useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => handleOpen(), 1000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay]);

  const handleOpen = () => {
    if (isShaking || opened) return;
    setIsShaking(true);
    
    setTimeout(() => {
        setIsShaking(false);
        setOpened(true);
        if (popSoundRef.current && !compact) {
          popSoundRef.current.currentTime = 0;
          popSoundRef.current.play().catch(() => {});
        }
        if (autoPlay) {
          setTimeout(() => {
            onOpened();
          }, 2000);
        }
    }, 600);
  };

  return (
    <>
    <audio ref={popSoundRef} src="/assets/vfx/touch.mp3" preload="auto" muted={compact && !autoPlay && typeof window !== 'undefined' && !window.location.pathname.includes('dashboard')} />
    <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-40 flex flex-col items-center justify-center">
      <h3 className={`text-2xl font-bold !text-white mb-12 drop-shadow-lg text-center px-4 anim-spring-up transition-opacity duration-300 ${opened ? 'opacity-0' : 'opacity-100'}`} style={{ color: '#ffffff' }}>
        {data?.step4Title}
      </h3>
      
      <div className={`relative w-56 h-56 cursor-pointer ${isShaking ? 'anim-shake' : (opened ? 'capsule-open' : 'anim-float')}`} onClick={handleOpen}>
        <div className="capsule-top absolute top-0 w-full h-28 bg-gradient-to-b from-red-400 to-red-600 rounded-t-full shadow-[0_10px_30px_rgba(220,38,38,0.5),_inset_0_-5px_15px_rgba(0,0,0,0.2)] border-2 border-red-300 z-20 flex items-end justify-center pb-1">
            <div className="w-full h-3 bg-black/30"></div>
        </div>
        <div className="capsule-bottom absolute bottom-0 w-full h-28 bg-gradient-to-b from-gray-100 to-gray-300 rounded-b-full shadow-[0_10px_30px_rgba(0,0,0,0.2)] border-2 border-white z-10"></div>
        
        {opened && <div className="absolute inset-0 rounded-full z-[25] pointer-events-none ray-explosion"></div>}
        
        {opened && (
            <div className="absolute inset-0 flex items-center justify-center z-30 anim-spring-up" style={{ animationDelay: '0.6s' }}>
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-300 border-4 border-yellow-400 p-5 rounded-2xl shadow-[0_20px_50px_rgba(250,204,21,0.4)] w-64 text-center cursor-default anim-float">
                    <i className="fas fa-ticket-alt text-4xl text-yellow-600 mb-2 drop-shadow-sm"></i>
                    <h4 className="font-black text-yellow-800 text-xl uppercase tracking-wider">{data?.step4CardTitle}</h4>
                    <p className="text-sm text-yellow-700 font-semibold mt-1 mb-4">{data?.step4CardSub}</p>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onOpened(); }} 
                        className="bg-gradient-to-r from-pink-500 to-rose-500 text-white w-full py-3 rounded-full font-bold shadow-[0_10px_20px_rgba(236,72,153,0.4)] anim-pulse-glow hover:scale-105 transition-transform"
                    >
                        {data?.step4CardBtn}
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
    </>
  );
}
