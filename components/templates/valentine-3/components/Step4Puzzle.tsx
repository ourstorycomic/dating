import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Step4Puzzle({ image, onComplete, autoPlay = false }: { image: string; onComplete: () => void; autoPlay?: boolean }) {
  const [pieces, setPieces] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    // Generate shuffled array 0..8
    let arr = Array.from({ length: 9 }, (_, i) => i);
    // Shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // Make sure it's not solved initially
    if (arr.every((val, i) => val === i)) {
      [arr[0], arr[1]] = [arr[1], arr[0]];
    }
    setPieces(arr);
  }, []);

  useEffect(() => {
    if (autoPlay && !isSolved) {
      const t = setTimeout(() => {
        setPieces([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        setIsSolved(true);
        setTimeout(() => {
          setIsFlying(true);
          setTimeout(onComplete, 1200);
        }, 800);
      }, 2500);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, isSolved]);

  const handlePieceClick = (index: number) => {
    if (isSolved) return;
    
    if (selected === null) {
      setSelected(index);
    } else {
      // Swap
      const newPieces = [...pieces];
      [newPieces[selected], newPieces[index]] = [newPieces[index], newPieces[selected]];
      setPieces(newPieces);
      setSelected(null);
      
      // Check win
      if (newPieces.every((val, i) => val === i)) {
        setIsSolved(true);
        setTimeout(() => {
          setIsFlying(true);
          setTimeout(onComplete, 1200);
        }, 800);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10"
    >
      <div className="text-center mb-10">
        <h3 className="text-2xl font-extrabold text-rose-500 drop-shadow-sm">Mảnh Ghép Ký Ức</h3>
        <p className="text-rose-400 mt-2 font-medium">Click 2 mảnh để hoán đổi vị trí nhé!</p>
      </div>

      <motion.div
        animate={isFlying ? { scale: 0, y: -400, opacity: 0 } : isSolved ? { scale: 1.05 } : {}}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="relative w-full max-w-[320px] aspect-square"
      >
        <div className={`grid grid-cols-3 grid-rows-3 gap-1 w-full h-full bg-white/50 p-2 rounded-2xl shadow-xl border-4 ${isSolved ? 'border-emerald-400' : 'border-white'} transition-colors duration-500`}>
          {pieces.map((pieceVal, index) => {
            const isSelected = selected === index;
            // bg-position is determined by pieceVal
            const row = Math.floor(pieceVal / 3);
            const col = pieceVal % 3;
            const bgPosX = col * 50; // 0, 50, 100
            const bgPosY = row * 50;
            
            return (
              <motion.div
                key={pieceVal}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={() => handlePieceClick(index)}
                className={`w-full h-full rounded-lg cursor-pointer overflow-hidden relative ${isSelected ? 'ring-4 ring-rose-500 z-10 scale-95' : 'hover:scale-[0.98]'} transition-transform`}
              >
                {/* We use a div with background image to map the piece */}
                <div 
                  className="w-full h-full bg-cover"
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                    backgroundSize: '300% 300%'
                  }}
                />
                {/* Faint number to help solve */}
                {!isSolved && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-white/60 font-black text-2xl drop-shadow-md bg-black/10 w-8 h-8 rounded-full flex items-center justify-center">
                      {pieceVal + 1}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Flash overlay on win */}
        {isSolved && !isFlying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-white rounded-2xl z-20 pointer-events-none"
          />
        )}
      </motion.div>
    </motion.div>
  );
}
