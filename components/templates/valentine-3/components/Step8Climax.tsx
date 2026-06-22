import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";

export function Step8Climax({ onResponse, autoPlay = false }: { onResponse?: (res: { answer: string; message: string }) => void; autoPlay?: boolean }) {
  const [noPos, setNoPos] = useState({ top: "65%", left: "50%" });
  const [isAccepted, setIsAccepted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const moveNoButton = () => {
    const safeZones = [
      { top: "20%", left: "25%" },
      { top: "20%", left: "75%" },
      { top: "85%", left: "25%" },
      { top: "85%", left: "75%" },
      { top: "35%", left: "15%" },
      { top: "35%", left: "85%" },
      { top: "85%", left: "50%" },
      { top: "15%", left: "50%" }
    ];
    let nextPos = safeZones[Math.floor(Math.random() * safeZones.length)];
    while (nextPos.top === noPos.top && nextPos.left === noPos.left) {
      nextPos = safeZones[Math.floor(Math.random() * safeZones.length)];
    }
    setNoPos(nextPos);
  };

  const handleAccept = () => {
    setIsAccepted(true);
    
    if (canvasRef.current) {
      const myConfetti = confetti.create(canvasRef.current, {
        resize: true,
        useWorker: true
      });

      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        myConfetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff0000', '#ff69b4', '#ff1493']
        });
        myConfetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff0000', '#ff69b4', '#ff1493']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }

    if (onResponse) {
      onResponse({ answer: "YES", message: "Đồng ý" });
    }
  };

  useEffect(() => {
    if (autoPlay && !isAccepted) {
      const t = setTimeout(() => {
        handleAccept();
      }, 2000);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, isAccepted]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-20 flex flex-col items-center p-6"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-50" />

      {!isAccepted ? (
        <>
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-black text-rose-600 mb-4 drop-shadow-sm">Thế tóm lại là...</h2>
            <p className="text-rose-500 font-semibold text-lg">Cậu có chịu làm người yêu tớ không? 🥺</p>
          </div>

          <div className="relative flex-1 w-full mt-12">
            <button
              onClick={handleAccept}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-[200px] py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-lg rounded-full shadow-[0_10px_25px_rgba(225,29,72,0.4)] hover:scale-110 active:scale-95 transition-transform"
            >
              ĐỒNG Ý LUÔN 💖
            </button>

            <button
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              onClick={moveNoButton}
              style={{
                position: "absolute",
                top: noPos.top,
                left: noPos.left,
                transform: "translate(-50%, -50%)",
              }}
              className="z-20 px-6 py-3 bg-white text-slate-500 font-bold rounded-full shadow-md border border-slate-200 transition-all duration-300 ease-out select-none whitespace-nowrap"
            >
              TỪ CHỐI 💔
            </button>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          className="m-auto w-full max-w-sm bg-white p-8 rounded-3xl shadow-2xl text-center border-4 border-rose-200 relative z-40"
        >
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-black text-rose-600 mb-4">Chốt Đơn!</h2>
          <p className="text-slate-600 font-medium text-lg">
            Lên đồ lẹ lênnnn!<br />Tớ qua đón đi chơi ngay và luôn! 🛵💨
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
