import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

export function Step123Machine({ onEggDropped, autoPlay, data }: { onEggDropped: () => void, autoPlay?: boolean, data?: any }) {
  const [step, setStep] = useState(1); // 1: Idle, 1.5: Dropped, 2: Inserted, 3: Spinning
  const [isDragging, setIsDragging] = useState(false);
  const slotRef = useRef<HTMLDivElement>(null);
  const coinRef = useRef<HTMLDivElement>(null);
  const coinControls = useAnimation();

  useEffect(() => {
    if (step === 1 && !autoPlay) {
      coinControls.start({
        y: [0, -15, 0],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      });
    }
  }, [step, autoPlay, coinControls]);

  useEffect(() => {
    if (!autoPlay) return;
    let timer: any;
    if (step === 1) {
      timer = setTimeout(() => {
        setStep(1.5);
        coinControls.start({
          scale: 0.2, opacity: 0, y: -200, transition: { duration: 0.5 }
        });
        setTimeout(() => setStep(2), 500);
      }, 2000);
    } else if (step === 2) {
      timer = setTimeout(() => spinKnob(), 1000);
    }
    return () => clearTimeout(timer);
  }, [autoPlay, step]);

  const handleDragEnd = async (event: any, info: any) => {
    if (step !== 1) return;
    if (!slotRef.current || !coinRef.current) return;

    const slotRect = slotRef.current.getBoundingClientRect();
    const coinRect = coinRef.current.getBoundingClientRect();

    const slotCX = slotRect.left + slotRect.width / 2;
    const slotCY = slotRect.top + slotRect.height / 2;
    const coinCX = coinRect.left + coinRect.width / 2;
    const coinCY = coinRect.top + coinRect.height / 2;

    const dist = Math.hypot(coinCX - slotCX, coinCY - slotCY);

    if (dist < 180) {
      setStep(1.5);
      await coinControls.start({
        scale: 0, opacity: 0, transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }
      });
      setTimeout(() => setStep(2), 400);
    } else {
      coinControls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }).then(() => {
        if (step === 1 && !autoPlay) {
          coinControls.start({
            y: [0, -15, 0],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          });
        }
      });
    }
  };

  const spinKnob = () => {
    if (step !== 2) return;
    setStep(3);
    setTimeout(() => {
        onEggDropped();
    }, 2000);
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center z-10 p-4">
      <div className={`absolute top-10 left-0 w-full text-center z-20 px-6 transition-opacity duration-500 ${step >= 3 ? 'opacity-0' : 'opacity-100'}`}>
        <h2 className={`text-white text-2xl font-extrabold drop-shadow-md anim-spring-up ${step >= 2 ? 'text-pink-200' : ''}`}>
            {step >= 2 ? data?.step1Title2 : data?.step1Title1}
        </h2>
        <p className="text-white/90 mt-2 font-medium drop-shadow anim-spring-up delay-100">
            {step >= 2 ? data?.step1Sub2 : data?.step1Sub1}
        </p>
      </div>

      <div className="absolute top-36 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
        <div className={`w-64 h-64 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/60 shadow-[inset_0_-20px_40px_rgba(0,0,0,0.1),_0_20px_40px_rgba(0,0,0,0.2)] relative overflow-hidden z-20 ${step === 3 ? 'anim-shake' : ''}`}>
            <div className="scanline z-50"></div>
            <div className="absolute top-4 left-6 w-24 h-10 bg-white/50 rounded-full rotate-[-30deg] blur-[4px]"></div>
            
            <div className="absolute bottom-2 left-10 w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full border-2 border-pink-300 shadow-lg"></div>
            <div className="absolute bottom-4 left-24 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-blue-300 shadow-lg"></div>
            <div className="absolute bottom-1 right-12 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-2 border-yellow-300 shadow-lg"></div>
            <div className="absolute bottom-12 left-16 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-green-300 shadow-lg"></div>
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full border-2 border-red-300 shadow-lg"></div>
        </div>

        <div className="w-[300px] h-72 bg-gradient-to-b from-white to-gray-100 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] -mt-8 relative z-30 flex flex-col items-center border-t border-white overflow-hidden">
            <div className="w-full h-10 bg-gradient-to-r from-pink-200 via-pink-100 to-pink-200 border-b border-pink-300 shadow-sm"></div>
            
            <div ref={slotRef} className="absolute top-14 right-10 w-14 h-20 flex items-center justify-center">
                {step === 1 && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[11px] font-bold text-white bg-pink-500 anim-float px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap z-[100] border border-pink-400">
                        {data?.step1Tooltip1}
                    </div>
                )}
                <div className={`w-4 h-12 bg-gray-900 rounded-full border-[3px] shadow-[inset_0_0_8px_rgba(0,0,0,1)] transition-all duration-300 ${step >= 2 ? 'anim-pulse-glow border-yellow-300' : 'border-gray-400'}`}></div>
            </div>
            
            <div 
                onClick={spinKnob}
                className={`absolute top-14 left-10 w-[72px] h-[72px] bg-gradient-to-br from-pink-400 to-pink-600 rounded-full border-4 border-pink-200 flex items-center justify-center transition-all duration-700 ${step >= 2 ? 'shadow-[0_10px_20px_rgba(236,72,153,0.4),_inset_0_5px_10px_rgba(255,255,255,0.5)] cursor-pointer' : 'opacity-50 pointer-events-none shadow-none'} ${step === 2 ? 'anim-pulse-glow hover:scale-105' : ''} ${step === 3 ? 'pointer-events-none' : ''}`}
                style={{ transform: step === 3 ? 'rotate(360deg)' : 'rotate(0deg)' }}
            >
                {step === 2 && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[11px] font-bold text-white bg-pink-500 anim-float px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap z-[100] border border-pink-400">
                        {data?.step1Tooltip2}
                    </div>
                )}
                <div className="w-12 h-3 bg-white/90 rounded-full shadow-sm pointer-events-none"></div>
            </div>

            <div className="absolute bottom-6 w-28 h-28 bg-gray-900 rounded-b-3xl rounded-t-lg border-t-8 border-gray-700 shadow-[inset_0_15px_25px_rgba(0,0,0,0.8)] flex items-end justify-center pb-2 overflow-hidden">
                <div className="absolute top-0 w-full h-6 bg-black/60 z-10"></div>
                
                <div className={`w-16 h-16 relative z-0 ${step === 3 ? 'anim-egg-bounce block' : 'hidden'}`}>
                    <div className="absolute inset-0 bg-gradient-to-b from-red-400 to-red-600 h-1/2 rounded-t-full border-t border-x border-red-300 shadow-[inset_0_-5px_10px_rgba(0,0,0,0.2)]"></div>
                    <div className="absolute inset-0 top-1/2 bg-gradient-to-b from-gray-100 to-gray-300 h-1/2 rounded-b-full border-b border-x border-gray-400 shadow-[inset_0_5px_10px_rgba(0,0,0,0.1)]"></div>
                    <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-gray-800 -translate-y-1/2 shadow-sm"></div>
                </div>
            </div>
        </div>
      </div>

      {step < 2 && (
        <motion.div 
            ref={coinRef}
            drag
            dragMomentum={false}
            onDragStart={() => { coinControls.stop(); setIsDragging(true); }}
            onDragEnd={(e, info) => { setIsDragging(false); handleDragEnd(e, info); }}
            animate={coinControls}
            style={{ left: 'calc(50% - 40px)' }}
            className={`absolute bottom-12 w-20 h-20 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-full border-[5px] border-yellow-100 flex items-center justify-center cursor-grab active:cursor-grabbing z-50 shadow-[0_10px_25px_rgba(250,204,21,0.5),_inset_0_0_15px_rgba(255,255,255,0.8)] touch-none`}
        >
            <div className="absolute inset-0 rounded-full border border-yellow-500 opacity-50 pointer-events-none"></div>
            <span className="text-yellow-100 font-black text-xl tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-10 pointer-events-none">{data?.step1CoinText}</span>
        </motion.div>
      )}

    </div>
  );
}
