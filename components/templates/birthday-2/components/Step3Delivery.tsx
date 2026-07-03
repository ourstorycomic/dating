"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, MessageCircle, Phone, Compass, Camera, Settings, Map, Calendar, Mail, Music, Video, Cloud, Calculator, Clock, Store, Book, Heart } from "lucide-react";

const APPS = [
  { icon: MessageCircle, color: "bg-green-500", name: "Messages" },
  { icon: Calendar, color: "bg-white text-red-500", name: "Calendar" },
  { icon: Camera, color: "bg-gray-100 text-gray-800", name: "Camera" },
  { icon: Settings, color: "bg-gray-400", name: "Settings" },
  { icon: Cloud, color: "bg-blue-300", name: "Weather" },
  { icon: Calculator, color: "bg-orange-500", name: "Calculator" },
  { icon: Clock, color: "bg-black", name: "Clock" },
  { icon: Store, color: "bg-blue-600", name: "App Store" },
  { icon: Book, color: "bg-orange-400", name: "Books" },
  { icon: Heart, color: "bg-white text-rose-500", name: "Health" },
  { icon: Map, color: "bg-green-600", name: "Maps" },
  { icon: Video, color: "bg-purple-500", name: "Videos" },
];

const DOCK_APPS = [
  { icon: Phone, color: "bg-green-400", name: "Phone" },
  { icon: Compass, color: "bg-blue-400", name: "Safari" },
  { icon: Mail, color: "bg-blue-500", name: "Mail" },
  { icon: Music, color: "bg-rose-500", name: "Music" },
];

export function Step3Delivery({ onNext, autoPlay = false, compact = false, photos = [] }: { onNext: () => void; autoPlay?: boolean; compact?: boolean; photos?: { url: string }[] }) {
  const [showPopup, setShowPopup] = useState(false);
  const [showSignPad, setShowSignPad] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const popupSoundRef = useRef<HTMLAudioElement>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    // Show popup shortly after entering this step (as if interrupted)
    const t = setTimeout(() => {
      setShowPopup(true);
      if (popupSoundRef.current && !(compact && !autoPlay)) {
        popupSoundRef.current.currentTime = 0;
        popupSoundRef.current.play().catch(() => {});
      }
    }, 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (autoPlay) {
      const t1 = setTimeout(() => setShowSignPad(true), 2000);
      const t2 = setTimeout(() => setIsSigned(true), 3500);
      const t3 = setTimeout(() => onNext(), 5000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [autoPlay, onNext]);

  const handleStartDraw = (e: any) => {
    isDrawing.current = true;
    draw(e);
  };

  const handleEndDraw = () => {
    isDrawing.current = false;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      // Only set signed if they actually drew something (we assume if they ended draw, they drew)
      setIsSigned(true);
    }
  };

  const draw = (e: any) => {
    if (!isDrawing.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    
    // Support both mouse and touch
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1e40af"; // dark blue ink

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  return (
    <>
    <audio ref={popupSoundRef} src="/assets/vfx/touch.mp3" preload="auto" muted={compact && !autoPlay} />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 z-30 overflow-hidden"
    >
      {/* Fake Phone Home Screen Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/assets/lovepics/1.jpg')" }} />
      <div className="absolute inset-0 bg-white/20 backdrop-blur-md z-0" />
      
      {/* Fake Widgets and Apps */}
      <div className="absolute inset-0 z-10 w-full h-full p-6 pt-16 flex flex-col gap-6 pointer-events-none">
        {/* Photo Widget */}
        <div className="w-full h-48 bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-white/50">
           {photos.length > 0 ? (
             <>
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={photos[0].url} className="w-full h-full object-cover" alt="Widget" />
             </>
           ) : (
             <div className="w-full h-full bg-slate-200" />
           )}
        </div>

        {/* Fake App Grid */}
        <div className="grid grid-cols-4 gap-x-4 gap-y-6 mt-4">
          {APPS.map((app, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-14 h-14 rounded-[1.2rem] ${app.color} shadow-sm flex items-center justify-center`}>
                <app.icon className={`w-7 h-7 ${app.color.includes('text-') ? '' : 'text-white'}`} strokeWidth={1.5} />
              </div>
            </div>
          ))}
        </div>

        {/* Fake iOS Dock */}
        <div className="absolute bottom-6 left-4 right-4 h-[84px] bg-white/30 backdrop-blur-xl rounded-[2rem] flex items-center justify-around px-3 border border-white/20 shadow-lg pointer-events-none">
          {DOCK_APPS.map((app, i) => (
            <div key={i} className={`w-[60px] h-[60px] rounded-[1.25rem] ${app.color} shadow-sm flex items-center justify-center`}>
              <app.icon className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showPopup && !showSignPad && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-16 w-[90%] bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl flex items-start gap-4 cursor-pointer z-50 border border-gray-100"
            onClick={() => setShowSignPad(true)}
          >
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
              <Package className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800">SHOPEE EXPRESS</h3>
                <span className="text-xs text-gray-500">now</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Bạn có một kiện hàng tối mật. Phí COD: 0đ. Yêu cầu ký nhận!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSignPad && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-[85%] bg-white rounded-3xl p-6 shadow-2xl flex flex-col z-50"
          >
            <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Ký Nhận Điện Tử</h2>
            <p className="text-sm text-gray-500 text-center mb-6">Vui lòng ký vào khung bên dưới</p>

            <div className="w-full h-40 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 relative overflow-hidden mb-6">
              <canvas
                ref={canvasRef}
                width={300} // rough estimate, CSS will scale
                height={160}
                className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                onMouseDown={handleStartDraw}
                onMouseMove={draw}
                onMouseUp={handleEndDraw}
                onMouseLeave={handleEndDraw}
                onTouchStart={handleStartDraw}
                onTouchMove={draw}
                onTouchEnd={handleEndDraw}
              />
              {!isSigned && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-gray-300 font-medium text-2xl rotate-[-10deg]">Ký tên tại đây</span>
                </div>
              )}
            </div>

            <button
              onClick={onNext}
              disabled={!isSigned}
              className={`relative overflow-hidden w-full py-4 rounded-xl font-bold text-white transition-all duration-300 ${isSigned ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-[0_10px_20px_rgba(79,70,229,0.4)] scale-105' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              <span className="relative z-10 text-lg">Mở Kiện Hàng ✨</span>
              {isSigned && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </>
  );
}
