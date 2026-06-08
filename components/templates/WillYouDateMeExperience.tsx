"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function WillYouDateMeExperience({
  compact = false,
  recipientName = "Em",
  senderName = "Anh",
  questionTitle = "Xin chào xinh đẹp...",
  questionBody = "Bạn có muốn đi chơi cùng mình không?",
  yesButton = "CÓ! ♥",
  noButton = "KHÔNG! ☹",
  successTitle = "Yayyy!!! 🌸",
  successMessage = "Mình rất háo hức được gặp bạn!",
  locationTitle = "Bạn muốn đi đâu nè?",
  datetimeTitle = "Khi nào thì bạn rảnh nè?",
  foodTitle = "Bạn muốn ăn gì nè 😋",
  drinkTitle = "Bạn muốn uống gì?",
  finalTitle = "Đã xong! 💕",
  finalMessage = "Mình rất mong được gặp bạn! Buổi hẹn của chúng ta sẽ thật hoàn hảo.",
  generalAudioUrl = "",
  backgroundImage = "",
  backgroundColor = "#05020a",
  accentColor = "#ec4899",
  onComplete,
}: {
  compact?: boolean;
  recipientName?: string;
  senderName?: string;
  questionTitle?: string;
  questionBody?: string;
  yesButton?: string;
  noButton?: string;
  successTitle?: string;
  successMessage?: string;
  locationTitle?: string;
  datetimeTitle?: string;
  foodTitle?: string;
  drinkTitle?: string;
  finalTitle?: string;
  finalMessage?: string;
  generalAudioUrl?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  accentColor?: string;
  onComplete?: (data: any) => void;
}) {
  const [stage, setStage] = useState<"question" | "success" | "location" | "datetime" | "food" | "drink" | "completion">("question");
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [noHoverCount, setNoHoverCount] = useState(0);

  const [selections, setSelections] = useState<{
    location: string[];
    date: string;
    time: string;
    food: string[];
    drink: string[];
  }>({
    location: [],
    date: "",
    time: "",
    food: [],
    drink: [],
  });
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const noBtnResponses = [
    noButton,
    "Thật sao?",
    "Bạn chắc chứ?",
    "Suy nghĩ lại đi!",
    "Cơ hội cuối cùng...",
    "Đừng ngại!",
    "Nói đồng ý đi nào!"
  ];

  const handleNoHover = () => {
    // Generate position using angle/distance so it always jumps far away
    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * 100; // Nhảy xa ít nhất 120px, tối đa 220px
    setNoBtnPos({
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    });
    setNoHoverCount((c) => c + 1);
  };

  const handleYes = () => {
    setStage("success");
    // Play audio if available
    if (generalAudioUrl) {
      const audio = new Audio(generalAudioUrl);
      audio.loop = true;
      audio.play().catch(() => {});
    }
  };

  const toggleSelection = (category: "location" | "food" | "drink", item: string) => {
    setSelections((prev) => {
      const current = prev[category];
      if (current.includes(item)) {
        return { ...prev, [category]: current.filter((i) => i !== item) };
      }
      return { ...prev, [category]: [...current, item] };
    });
  };

  const finish = () => {
    setStage("completion");
    onComplete?.(selections);
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: -20 },
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden font-sans text-white ${compact ? "h-full w-full" : "h-[800px] min-h-[640px] max-h-[85vh] w-full sm:rounded-2xl border border-white/10"}`}
      style={{ backgroundColor }}
    >
      {backgroundImage ? (
        <>
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${backgroundImage})` }} 
          />
          <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-sm" />
        </>
      ) : (
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900/40 via-[#05020a] to-[#05020a]" />
      )}

      {/* Hiệu ứng 3D Trái tim và Bụi sao rực rỡ */}
      {mounted && (
        <>
          <FloatingHearts3D />
          <GlowingDust />
        </>
      )}

      <AnimatePresence mode="wait">
        {stage === "question" && (
          <motion.div
            key="question"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-md"
          >
            <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{questionTitle}</h1>
            <div className="mx-auto my-6 h-px w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <p className="mb-8 text-lg">{questionBody}</p>
            
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleYes}
                className="rounded-full px-8 py-3 font-bold transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: accentColor, color: "#fff", zIndex: 10 }}
              >
                {yesButton}
              </button>
              <div className="relative h-[48px] w-[140px] shrink-0">
                <motion.button
                  onPointerEnter={compact ? undefined : handleNoHover}
                  onClick={handleNoHover}
                  animate={{ x: noBtnPos.x, y: noBtnPos.y }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute left-0 top-0 z-50 flex h-full min-w-full items-center justify-center whitespace-nowrap rounded-full bg-white/10 px-8 font-bold text-white hover:bg-white/20"
                >
                  {noBtnResponses[noHoverCount % noBtnResponses.length]}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {stage === "success" && (
          <motion.div
            key="success"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-md"
          >
            <h1 className="text-4xl font-bold" style={{ color: accentColor }}>{successTitle}</h1>
            <div className="mx-auto my-6 h-px w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <p className="mb-8 text-xl">{successMessage}</p>
            <button
              onClick={() => setStage("location")}
              className="rounded-full px-8 py-3 font-bold transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: accentColor, color: "#fff" }}
            >
              Chọn địa điểm nhé ♥
            </button>
          </motion.div>
        )}

        {stage === "location" && (
          <motion.div
            key="location"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-md"
          >
            <h1 className="text-2xl font-bold" style={{ color: accentColor }}>{locationTitle}</h1>
            <div className="mx-auto my-6 h-px w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {["Cà phê ☕", "Đi ăn 🍽️", "Xem phim 🎬", "Công viên 🌳", "Mua sắm 🛍️", "Lượn phố 🏙️"].map(loc => (
                <button
                  key={loc}
                  onClick={() => toggleSelection("location", loc)}
                  className={`rounded-xl border p-3 text-sm transition-all ${selections.location.includes(loc) ? 'border-transparent text-white' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                  style={{ backgroundColor: selections.location.includes(loc) ? accentColor : undefined }}
                >
                  {loc}
                </button>
              ))}
            </div>
            
            {selections.location.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setStage("datetime")}
                className="w-full rounded-full px-8 py-3 font-bold transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: accentColor, color: "#fff" }}
              >
                Tiếp tục nhé ♥
              </motion.button>
            )}
          </motion.div>
        )}

        {stage === "datetime" && (
          <motion.div
            key="datetime"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-md"
          >
            <h1 className="text-2xl font-bold" style={{ color: accentColor }}>{datetimeTitle}</h1>
            <div className="mx-auto my-6 h-px w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            
            <div className="grid gap-4 mb-8">
              <label className="text-left">
                <span className="mb-1 block text-sm text-white/60">Ngày hẹn</span>
                <input 
                  type="date" 
                  className="w-full rounded-xl border border-white/20 bg-black/30 p-3 text-white outline-none focus:border-pink-500"
                  value={selections.date}
                  onChange={e => setSelections(s => ({ ...s, date: e.target.value }))}
                />
              </label>
              <label className="text-left">
                <span className="mb-1 block text-sm text-white/60">Giờ hẹn</span>
                <input 
                  type="time" 
                  className="w-full rounded-xl border border-white/20 bg-black/30 p-3 text-white outline-none focus:border-pink-500"
                  value={selections.time}
                  onChange={e => setSelections(s => ({ ...s, time: e.target.value }))}
                />
              </label>
            </div>
            
            {selections.date && selections.time && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setStage("food")}
                className="w-full rounded-full px-8 py-3 font-bold transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: accentColor, color: "#fff" }}
              >
                Giờ chọn đồ ăn nha ♥
              </motion.button>
            )}
          </motion.div>
        )}

        {stage === "food" && (
          <motion.div
            key="food"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-md"
          >
            <h1 className="text-2xl font-bold" style={{ color: accentColor }}>{foodTitle}</h1>
            <div className="mx-auto my-6 h-px w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {["Bún đậu", "Phở", "Bún bò", "Mỳ Quảng", "Mỳ cay", "Xiên bẩn"].map(f => (
                <button
                  key={f}
                  onClick={() => toggleSelection("food", f)}
                  className={`rounded-xl border p-3 text-sm transition-all ${selections.food.includes(f) ? 'border-transparent text-white' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                  style={{ backgroundColor: selections.food.includes(f) ? accentColor : undefined }}
                >
                  {f}
                </button>
              ))}
            </div>
            
            {selections.food.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setStage("drink")}
                className="w-full rounded-full px-8 py-3 font-bold transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: accentColor, color: "#fff" }}
              >
                Tiếp tục chọn nước ♥
              </motion.button>
            )}
          </motion.div>
        )}

        {stage === "drink" && (
          <motion.div
            key="drink"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-md"
          >
            <h1 className="text-2xl font-bold" style={{ color: accentColor }}>{drinkTitle}</h1>
            <div className="mx-auto my-6 h-px w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {["Cà phê", "Trà", "Trà Sữa", "Trà Matcha", "Sinh tố", "Nước ép"].map(d => (
                <button
                  key={d}
                  onClick={() => toggleSelection("drink", d)}
                  className={`rounded-xl border p-3 text-sm transition-all ${selections.drink.includes(d) ? 'border-transparent text-white' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                  style={{ backgroundColor: selections.drink.includes(d) ? accentColor : undefined }}
                >
                  {d}
                </button>
              ))}
            </div>
            
            {selections.drink.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={finish}
                className="w-full rounded-full px-8 py-3 font-bold transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: accentColor, color: "#fff" }}
              >
                Hoàn thành! ♥
              </motion.button>
            )}
          </motion.div>
        )}

        {stage === "completion" && (
          <motion.div
            key="completion"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-md"
          >
            <div className="mb-6 text-6xl">🎉</div>
            <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{finalTitle}</h1>
            <div className="mx-auto my-6 h-px w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <p className="text-lg">{finalMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hiệu ứng Trái tim 3D bay bổng
function FloatingHearts3D({ count = 25 }: { count?: number }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" style={{ perspective: "800px" }}>
      {Array.from({ length: count }).map((_, i) => {
        const size = 15 + Math.random() * 35;
        const left = Math.random() * 100;
        const duration = 12 + Math.random() * 20;
        const delay = Math.random() * 15;
        const depth = Math.random(); // 0 to 1
        const blur = depth > 0.8 ? "blur-[3px]" : depth < 0.2 ? "blur-[1px]" : "";
        
        return (
          <motion.div
            key={`heart-${i}`}
            className={`absolute bottom-[-100px] text-pink-500/50 drop-shadow-[0_0_15px_rgba(236,72,153,0.6)] ${blur}`}
            style={{
              left: `${left}%`,
              fontSize: size,
            }}
            initial={{ y: 0, x: 0, rotateZ: 0, rotateX: 0, rotateY: 0, opacity: 0 }}
            animate={{
              y: -1200 - Math.random() * 500,
              x: (Math.random() - 0.5) * 300,
              rotateZ: (Math.random() - 0.5) * 360,
              rotateX: (Math.random() - 0.5) * 720, // Xoay 3D
              rotateY: (Math.random() - 0.5) * 720, // Xoay 3D
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            ❤
          </motion.div>
        );
      })}
    </div>
  );
}

// Hiệu ứng Bụi sao lấp lánh (Glowing Dust)
function GlowingDust() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={`dust-${i}`}
          className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_8px_#fff]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.1, 1, 0.1],
            scale: [0.5, 2, 0.5],
            y: [0, -40, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
