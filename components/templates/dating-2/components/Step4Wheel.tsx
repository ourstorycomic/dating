import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TPL_DATA } from "../config";

export function Step4Wheel({ onNext , customData = {}}: { onNext: (result: string) => void , customData?: any}) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState("Bấm tim để quay nhé!");
  const [done, setDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = ["#ff9a9e", "#ffb3d9", "#ff7eb3", "#fecfef", "#ff66b2", "#ff99cc"];

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const w = canvasRef.current.width, h = canvasRef.current.height;
    const r = w / 2;
    const arc = (Math.PI * 2) / (customData.wheelOptions || TPL_DATA.wheelOptions).length;
    
    ctx.clearRect(0,0,w,h);
    (customData.wheelOptions || TPL_DATA.wheelOptions).forEach((opt: string, i: number) => {
      const angle = -Math.PI / 2 + i * arc;
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.moveTo(r,r);
      ctx.arc(r,r,r, angle, angle+arc);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.save();
      ctx.translate(r, r);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px 'Poppins'";
      ctx.fillText(opt, r - 30, 6);
      ctx.restore();
    });
  }, []);

  const spin = () => {
    if (spinning || done) return;
    setSpinning(true);
    setResult("Đang quay nè... 😆");
    
    const minSpins = 5;
    const extraDegrees = Math.floor(Math.random() * 360);
    const spinAngle = (360 * minSpins) + extraDegrees; 
    const newRot = rotation + spinAngle;
    setRotation(newRot);

    setTimeout(() => {
      setSpinning(false);
      const deg = newRot % 360;
      const sliceAngle = 360 / (customData.wheelOptions || TPL_DATA.wheelOptions).length;
      const index = Math.floor((360 - deg) / sliceAngle) % (customData.wheelOptions || TPL_DATA.wheelOptions).length;
      const safeIndex = index < 0 ? index + (customData.wheelOptions || TPL_DATA.wheelOptions).length : index;
      const resText = (customData.wheelOptions || TPL_DATA.wheelOptions)[safeIndex];
      setResult(`Chốt: ${resText} 🎉`);
      setDone(true);
    }, 4000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="absolute inset-0 z-10 flex items-center justify-center p-4">
      <div className="glass-panel w-11/12 rounded-3xl p-6 relative flex flex-col items-center shadow-2xl bg-white/40">
        <h3 className="text-3xl font-bold text-pink-600 drop-shadow-md mb-6 letter-font">{(customData.wheelTitle || TPL_DATA.wheelTitle)}</h3>
        
        <div className="relative w-64 h-64 mb-6">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-pink-600 drop-shadow-md">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
          <div className="w-full h-full rounded-full shadow-[0_0_25px_rgba(255,105,180,0.5)] overflow-hidden border-4 border-white">
            <canvas ref={canvasRef} width="320" height="320" className="w-full h-full" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 4s cubic-bezier(0.25, 0.1, 0.15, 1)' : 'none' }}></canvas>
          </div>
          <div onClick={spin} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full z-10 shadow-lg flex flex-col items-center justify-center border-4 border-pink-300 cursor-pointer ${spinning || done ? 'opacity-90' : 'hover:scale-110 active:scale-95 transition-transform'}`}>
            <svg className="w-6 h-6 text-pink-500 heartbeat" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <span className="text-[9px] font-bold text-pink-500 uppercase">Quay</span>
          </div>
        </div>

        <div className="text-lg font-bold text-gray-800 mb-2 h-8 text-center drop-shadow-sm flex items-center justify-center">
          {result}
        </div>

        <AnimatePresence>
          {done && (
            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={() => onNext(result.replace('Chốt: ', '').replace(' 🎉', ''))} className="mt-4 px-8 py-3 bg-pink-500 text-white font-bold rounded-full shadow-lg hover:bg-pink-600 transition-all">
              {(customData.wheelBtn || TPL_DATA.wheelBtn)}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
