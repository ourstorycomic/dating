import React, { useState, useEffect, useRef } from "react";

export function Step4Wheel({ onNext, autoPlay, data }: { onNext: (location: string) => void, autoPlay?: boolean, data?: any }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors = ["#ff9a9e", "#ffb3d9", "#ff7eb3", "#fecfef", "#ff66b2", "#ff99cc"];
  const options = data?.wheelOptions || ["Xem Phim 🍿", "Cà Phê ☕", "Lượn Phố 🛵", "Ăn Ngon 🍝"];

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const w = canvasRef.current.width, h = canvasRef.current.height;
    const r = w / 2;
    const arc = (Math.PI * 2) / options.length;
    
    ctx.clearRect(0,0,w,h);
    options.forEach((opt: string, i: number) => {
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
  }, [options]);

  useEffect(() => {
    if (autoPlay && !spinning && !result) {
      const timer = setTimeout(() => spinWheel(), 2500);
      return () => clearTimeout(timer);
    }
    if (autoPlay && result) {
      const timer = setTimeout(() => onNext(result.replace(' 🎉', '')), 2000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, spinning, result, onNext]);

  const spinWheel = () => {
    if (spinning || result) return;
    setSpinning(true);
    
    const minSpins = 5;
    const extraDegrees = Math.floor(Math.random() * 360);
    const spinAngle = (360 * minSpins) + extraDegrees; 
    const newRot = rotation + spinAngle;
    setRotation(newRot);
    
    setTimeout(() => {
      setSpinning(false);
      const deg = newRot % 360;
      const sliceAngle = 360 / options.length;
      const index = Math.floor((360 - deg) / sliceAngle) % options.length;
      const safeIndex = index < 0 ? index + options.length : index;
      const resText = options[safeIndex];
      setResult(resText);
    }, 4000);
  };

  return (
    <div 
      className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6"
      style={{ background: `linear-gradient(to bottom right, ${data?.wheelBgFrom || '#ffecd2'}, ${data?.wheelBgTo || '#fcb69f'})` }}
    >
      <h2 className="text-4xl font-extrabold text-pink-600 mb-2 text-center drop-shadow-sm anim-spring-up flex flex-col items-center">
        <img src="/assets/dumb/hm.webp" className="w-24 h-24 object-contain mb-2 drop-shadow-xl" alt="wheel" />
        {data?.stepWheelTitle}
      </h2>
      <p className="text-pink-800/80 font-medium mb-10 text-center anim-spring-up delay-100">{data?.stepWheelSub}</p>
      
      <div className="relative w-[300px] h-[300px] anim-spring-up delay-200">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-b from-red-500 to-red-700 rounded-full z-20 border-4 border-white shadow-[0_5px_15px_rgba(0,0,0,0.3)] flex items-center justify-center">
              <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-red-600 absolute -bottom-4 drop-shadow-sm"></div>
          </div>
          
          <div className="w-full h-full rounded-full border-[10px] border-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] bg-white relative overflow-hidden">
             <canvas ref={canvasRef} width="320" height="320" className="w-full h-full" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 4s cubic-bezier(0.12, 0.8, 0.25, 1)' : 'none' }}></canvas>
          </div>
      </div>
      
      <div className="h-28 flex flex-col items-center justify-center mt-8 w-full">
          {!result && (
            <button onClick={spinWheel} className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xl px-10 py-4 rounded-full font-black shadow-[0_15px_30px_rgba(236,72,153,0.4)] anim-pulse-glow hover:scale-110 active:scale-95 transition-transform w-56">
                {data?.stepWheelBtn1}
            </button>
          )}
          {result && (
            <div className="text-center flex flex-col items-center anim-pop-in">
                <p className="text-pink-800 font-semibold text-sm mb-1 opacity-80">{data?.stepWheelResultPrefix}</p>
                <p className="text-3xl font-black text-pink-600 uppercase bg-white/50 px-6 py-2 rounded-2xl shadow-inner border border-white/60 backdrop-blur-sm">
                    {result}
                </p>
            </div>
          )}
      </div>
      
      {result && (
        <button 
            onClick={() => onNext(result)}
            className="mt-2 bg-white text-pink-600 border-2 border-pink-300 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-pink-50 anim-wiggle"
        >
            {data?.stepWheelBtn2}
        </button>
      )}
    </div>
  );
}
