import { motion, useAnimation, PanInfo } from "framer-motion";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

export function Step6PolaroidSwipe({ photos, onComplete }: { photos: string[]; onComplete: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [leaveX, setLeaveX] = useState(0);

  const handleDragEnd = (e: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      setLeaveX(1000);
      nextPhoto();
    } else if (info.offset.x < -100) {
      setLeaveX(-1000);
      nextPhoto();
    }
  };

  const nextPhoto = () => {
    setTimeout(() => {
      setCurrentIndex(c => c + 1);
      setLeaveX(0);
    }, 200);
  };

  const isDone = currentIndex >= photos.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 overflow-hidden"
    >
      {!isDone ? (
        <>
          <div className="absolute top-16 text-center z-20 pointer-events-none">
            <h3 className="text-2xl font-bold text-rose-500 drop-shadow-sm mb-2">Triển Lãm Ký Ức</h3>
            <p className="text-slate-500 text-sm font-medium">Vuốt trái/phải để xem ảnh tiếp theo</p>
          </div>

          <div className="relative w-full max-w-[280px] aspect-[3/4] flex items-center justify-center mt-10">
            {photos.map((photo, index) => {
              // Only render current and next few for performance
              if (index < currentIndex) return null;
              
              const isFront = index === currentIndex;
              const rotation = (index % 3 - 1) * 4; // -4, 0, 4 degrees
              
              return (
                <motion.div
                  key={index}
                  drag={isFront ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={isFront ? handleDragEnd : undefined}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ 
                    scale: isFront ? 1 : 0.95 - (index - currentIndex) * 0.05,
                    y: isFront ? 0 : (index - currentIndex) * 15,
                    rotate: isFront ? 0 : rotation,
                    x: isFront ? leaveX : 0,
                    opacity: isFront ? 1 : 1 - (index - currentIndex) * 0.2,
                    zIndex: photos.length - index
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`absolute w-full h-full bg-white p-3 pb-12 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-100 ${isFront ? 'cursor-grab active:cursor-grabbing' : ''}`}
                >
                  <div className="w-full h-full relative rounded-md overflow-hidden bg-gray-100">
                    <img src={photo} alt="" className="w-full h-full object-cover pointer-events-none" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center w-full max-w-xs"
        >
          <h3 className="text-2xl font-bold text-rose-600 leading-relaxed mb-10">
            Hành trình này thật đẹp,<br />nhưng tớ muốn nó<br />dài hơn nữa...
          </h3>
          <button
            onClick={onComplete}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold rounded-full shadow-[0_10px_20px_rgba(244,63,94,0.3)] hover:scale-105 active:scale-95 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out" />
            <span>Mở bức thư cuối</span>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
