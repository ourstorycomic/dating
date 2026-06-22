"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package } from "lucide-react";

export function Step3Delivery({ onNext, autoPlay = false }: { onNext: () => void; autoPlay?: boolean }) {
  const [showPopup, setShowPopup] = useState(false);
  const [showSignPad, setShowSignPad] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    // Show popup shortly after entering this step (as if interrupted)
    const t = setTimeout(() => setShowPopup(true), 800);
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

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1e40af"; // dark blue ink

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-30"
    >
      <AnimatePresence>
        {showPopup && !showSignPad && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-20 w-[90%] bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl flex items-start gap-4 cursor-pointer"
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
            className="w-[85%] bg-white rounded-3xl p-6 shadow-2xl flex flex-col"
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
              className={`w-full py-4 rounded-xl font-bold text-white transition-all ${isSigned ? 'bg-orange-500 hover:bg-orange-600 shadow-[0_10px_20px_rgba(249,115,22,0.3)]' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              Mở Kiện Hàng
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
