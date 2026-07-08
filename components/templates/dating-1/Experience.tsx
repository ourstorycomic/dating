"use client";
import { MediaDisplay } from "@/components/ui/MediaDisplay";



/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */

import { useState, useRef, useEffect, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { FloatingClouds } from "./components/FloatingClouds";
import { HeartBurst } from "./components/HeartBurst";
import { FloatingHearts3D } from "./components/FloatingHearts3D";
import { GlowingDust } from "./components/GlowingDust";
import { CuteDatePicker } from "./components/CuteDatePicker";
import { CuteTimePicker } from "./components/CuteTimePicker";
import { TemplateNavigator } from "../TemplateNavigator";

export function WillYouDateMeExperience({
  compact = false,
  autoPlay = false,
  recipientName = "Em",
  senderName = "Anh",
  questionTitle = "Xin chào {recipientName} xinh đẹp...",
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
  signOffText = "Thương mến",
  generalAudioUrl = "/dating-1/music/link_nhac_nen_chung.m4a",
  backgroundImage = "",
  backgroundColor = "#fff0f6",
  accentColor = "#f43f5e",
  locationOptions = ["Cà phê ☕", "Đi ăn 🍽️", "Xem phim 🎬", "Công viên 🌳", "Mua sắm 🛍️", "Lượn phố 🏙️"],
  foodOptions = ["Bún đậu", "Phở", "Bún bò", "Mỳ Quảng", "Mỳ cay", "Xiên bẩn"],
  drinkOptions = ["Cà phê", "Trà", "Trà Sữa", "Trà Matcha", "Sinh tố", "Nước ép"],
  questionImage,
  successImage,
  locationImage,
  datetimeImage,
  foodImage,
  drinkImage,
  clickSfxUrl = "/assets/vfx/touch.mp3",
  swooshSfxUrl = "",
  yaySfxUrl = "",
  hideNavigation = false,
  isBuilderPreview = false,
  fullScreen = false,
  forceStage,
  onComplete,
}: {
  compact?: boolean;
  autoPlay?: boolean;
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
  signOffText?: string;
  generalAudioUrl?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  accentColor?: string;
  locationOptions?: string[];
  foodOptions?: string[];
  drinkOptions?: string[];
  questionImage?: string;
  successImage?: string;
  locationImage?: string;
  datetimeImage?: string;
  foodImage?: string;
  drinkImage?: string;
  clickSfxUrl?: string;
  swooshSfxUrl?: string;
  yaySfxUrl?: string;
  hideNavigation?: boolean;
  isBuilderPreview?: boolean;
  fullScreen?: boolean;
  forceStage?: string;
  onComplete?: (data: any) => void;
}) {
  
  const displayQuestionTitle = questionTitle.replace("{recipientName}", recipientName);
  const displayFinalMessage = finalMessage + (senderName ? `\n\n${signOffText || "Thương mến"},\n${senderName}` : "");

  const clickAudioRef = useRef<HTMLAudioElement>(null);
  const swooshAudioRef = useRef<HTMLAudioElement>(null);
  const yayAudioRef = useRef<HTMLAudioElement>(null);

  const playClick = () => {
    if (clickAudioRef.current && !(compact && !autoPlay && typeof window !== 'undefined' && !window.location.pathname.includes('dashboard'))) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch(() => {});
    }
  };

  const playSwoosh = () => {
    if (swooshAudioRef.current && !(compact && !autoPlay && typeof window !== 'undefined' && !window.location.pathname.includes('dashboard'))) {
      swooshAudioRef.current.currentTime = 0;
      swooshAudioRef.current.play().catch(() => {});
    }
  };

  const playYay = () => {
    if (yayAudioRef.current && !(compact && !autoPlay && typeof window !== 'undefined' && !window.location.pathname.includes('dashboard'))) {
      yayAudioRef.current.currentTime = 0;
      yayAudioRef.current.play().catch(() => {});
    }
  };
const [stage, setStage] = useState<"question" | "success" | "location" | "datetime" | "food" | "drink" | "completion">("question");
  const stageOrder: Array<"question" | "success" | "location" | "datetime" | "food" | "drink" | "completion"> = [
    "question", "success", "location", "datetime", "food", "drink", "completion"
  ];
  const currentStageIndex = stageOrder.indexOf(stage);

  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [noHoverCount, setNoHoverCount] = useState(0);
  const [burstTriggers, setBurstTriggers] = useState(0);
  const isMoving = useRef(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  useEffect(() => {
    if (forceStage && stageOrder.includes(forceStage as any)) {
      setStage(forceStage as any);
    }
  }, [forceStage]);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    console.log("WillYouDateMeExperience mounted:", { isBuilderPreview, autoPlay, compact });
  }, [isBuilderPreview, autoPlay, compact]);

  useEffect(() => {
    if (!autoPlay || !mounted) return;

    let timer: number;
    
    if (stage === "question") {
      timer = window.setTimeout(() => setStage("success"), 2500);
    } else if (stage === "success") {
      timer = window.setTimeout(() => setStage("location"), 2500);
    } else if (stage === "location") {
      timer = window.setTimeout(() => { setSelections(prev => ({ ...prev, location: ["Cà phê ☕"] })); setStage("datetime"); }, 2500);
    } else if (stage === "datetime") {
      timer = window.setTimeout(() => { setSelections(prev => ({ ...prev, date: "Ngày mai", time: "19:00" })); setStage("food"); }, 2500);
    } else if (stage === "food") {
      timer = window.setTimeout(() => { setSelections(prev => ({ ...prev, food: ["Bún đậu"] })); setStage("drink"); }, 2500);
    } else if (stage === "drink") {
      timer = window.setTimeout(() => { setSelections(prev => ({ ...prev, drink: ["Trà Sữa"] })); setStage("completion"); }, 2500);
    }

    return () => window.clearTimeout(timer);
  }, [stage, autoPlay, mounted]);

  let noBtnResponses = [
    "KHÔNG! ☹",
    "Thật sao?",
    "Bạn chắc chứ?",
    "Suy nghĩ lại đi!",
    "Cơ hội cuối cùng...",
    "Đừng ngại!",
    "Nói đồng ý đi nào!"
  ];
  if (noButton) {
    const custom = noButton.split('\n').map(t => t.trim()).filter(Boolean);
    if (custom.length > 1) {
      noBtnResponses = custom;
    } else if (custom.length === 1) {
      noBtnResponses[0] = custom[0];
    }
  }

  const handleNoHover = () => {
    if (isMoving.current) return;
    isMoving.current = true;
    setTimeout(() => { isMoving.current = false; }, 100);
    playSwoosh();

    const xRange = compact ? { min: -60, max: 40 } : { min: -120, max: 60 };
    const yRange = compact ? { min: -80, max: -30 } : { min: -140, max: -50 };

    let newX = noBtnPos.x;
    let newY = noBtnPos.y;

    while (Math.hypot(newX - noBtnPos.x, newY - noBtnPos.y) < 60) {
      newX = xRange.min + Math.random() * (xRange.max - xRange.min);
      newY = yRange.min + Math.random() * (yRange.max - yRange.min);
    }

    setNoBtnPos({ x: newX, y: newY });
    setNoHoverCount((c) => c + 1);
  };

  const handleYes = () => {
    setStage("success");
    setBurstTriggers(c => c + 1);
    playYay();
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const toggleSelection = (category: "location" | "food" | "drink", item: string) => {
    setSelections((prev) => {
      const current = prev[category];
      if (current.includes(item)) {
        playClick();
        return { ...prev, [category]: current.filter((i) => i !== item) };
      }
      playClick();
      return { ...prev, [category]: [...current, item] };
    });
  };

  const finish = () => {
    setStage("completion");
    setBurstTriggers(c => c + 1);
    playYay();
    onComplete?.(selections);
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30, rotateX: 15 },
    visible: { opacity: 1, scale: 1, y: 0, rotateX: 0, transition: { type: "spring" as const, stiffness: 300, damping: 20 } },
    exit: { opacity: 0, scale: 0.8, y: -30, rotateX: -15, transition: { duration: 0.2 } },
  };

  return (
    <div
      className={`flex flex-col items-center justify-center overflow-hidden font-sans text-gray-800 ${compact ? "absolute inset-0 rounded-[2.5rem]" : (fullScreen || isBuilderPreview) ? "relative h-full min-h-[640px] w-full sm:rounded-2xl" : "relative h-[800px] min-h-[640px] max-h-[85vh] w-full sm:rounded-2xl border border-pink-100"}`}
      style={{ backgroundColor }}
    >
      {backgroundImage ? (
        <>
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${backgroundImage})` }} 
          />
          <div className="absolute inset-0 z-0 bg-white/40 backdrop-blur-sm" />
        </>
      ) : (
        <>
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center" 
            style={{ backgroundImage: `url('/assets/bg/bg6.jpg')` }} 
          />
          <div className="absolute inset-0 z-0 bg-pink-50/70 backdrop-blur-[2px]" />
        </>
      )}

      {/* Background Elements */}
      {generalAudioUrl && (
        <audio ref={audioRef} src={generalAudioUrl} loop preload="auto" autoPlay={autoPlay} muted={compact && !autoPlay} />
      )}
      {clickSfxUrl && <audio ref={clickAudioRef} src={clickSfxUrl} preload="auto" muted={compact && !autoPlay && typeof window !== 'undefined' && !window.location.pathname.includes('dashboard')} />}
      {swooshSfxUrl && <audio ref={swooshAudioRef} src={swooshSfxUrl} preload="auto" muted={compact && !autoPlay && typeof window !== 'undefined' && !window.location.pathname.includes('dashboard')} />}
      {yaySfxUrl && <audio ref={yayAudioRef} src={yaySfxUrl} preload="auto" muted={compact && !autoPlay && typeof window !== 'undefined' && !window.location.pathname.includes('dashboard')} />}
      <>
        <FloatingClouds />
        <GlowingDust />
        <FloatingHearts3D />
        <HeartBurst trigger={burstTriggers} />
      </>

      <AnimatePresence mode="wait">
        {stage === "question" && (
          <motion.div
            key="question"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 mx-auto w-[85%] sm:w-[90%] max-w-md max-h-[95%] overflow-y-auto [&::-webkit-scrollbar]:hidden rounded-[2rem] border border-white/60 bg-white/70 p-4 sm:p-6 text-center shadow-[0_12px_40px_rgba(255,192,203,0.5)] backdrop-blur-md"
          >
            { questionImage ? (
              <MediaDisplay src={questionImage} alt="question" className="mb-4 h-24 w-24 object-cover mx-auto rounded-2xl animate-bounce shadow-md" />
            ) : (
              <img src="/assets/happy/cat-cute.webp" alt="question" className="mb-4 h-32 w-32 object-cover mx-auto animate-bounce drop-shadow-xl rounded-full border-4 border-white" />
            )}
            <h1 className="text-3xl font-extrabold drop-shadow-sm" style={{ color: accentColor }}>{displayQuestionTitle}</h1>
            <div className="mx-auto my-6 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
            <p className="mb-8 text-lg font-semibold text-gray-700">{questionBody}</p>
            
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              <button
                onClick={handleYes}
                className="rounded-full px-6 py-3 text-lg font-bold shadow-xl transition-transform hover:scale-110 active:scale-95 hover:shadow-pink-300"
                style={{ backgroundColor: accentColor, color: "#fff", zIndex: 10 }}
              >
                {yesButton}
              </button>
              <div className="relative h-[52px] w-[140px] shrink-0">
                <motion.button
                  onMouseEnter={compact ? undefined : handleNoHover}
                  onClick={handleNoHover}
                  animate={{ x: noBtnPos.x, y: noBtnPos.y }}
                  transition={{ type: "spring", stiffness: 800, damping: 25 }}
                  className="absolute left-0 top-0 z-50 flex h-full min-w-full items-center justify-center whitespace-nowrap rounded-full px-6 font-bold text-gray-700 bg-white shadow-md border-2 border-pink-100 hover:bg-pink-50"
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
            className="relative z-10 mx-auto w-[85%] sm:w-[90%] max-w-md max-h-[95%] overflow-y-auto [&::-webkit-scrollbar]:hidden rounded-[2rem] border border-white/60 bg-white/70 p-4 sm:p-6 text-center shadow-[0_12px_40px_rgba(255,192,203,0.5)] backdrop-blur-md"
          >
            { successImage ? (
              <MediaDisplay src={successImage} alt="success" className="mb-4 h-24 w-24 object-cover mx-auto rounded-2xl animate-bounce shadow-md" />
            ) : (
              <img src="/assets/happy/kiss-love.webp" alt="success" className="mb-4 h-40 w-40 object-cover mx-auto animate-bounce drop-shadow-xl rounded-2xl border-4 border-white" />
            )}
            <h1 className="text-4xl font-extrabold drop-shadow-sm" style={{ color: accentColor }}>{successTitle}</h1>
            <div className="mx-auto my-6 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
            <p className="mb-8 text-xl font-semibold text-gray-700">{successMessage}</p>
            <button
              onClick={() => setStage("location")}
              className="rounded-full px-8 py-3 text-lg font-bold shadow-xl transition-transform hover:scale-110 active:scale-95 hover:shadow-pink-300"
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
            className="relative z-10 mx-auto w-[85%] sm:w-[90%] max-w-md max-h-[95%] overflow-y-auto [&::-webkit-scrollbar]:hidden rounded-[2rem] border border-white/60 bg-white/70 p-4 sm:p-6 text-center shadow-[0_12px_40px_rgba(255,192,203,0.5)] backdrop-blur-md"
          >
            { locationImage ? (
              <MediaDisplay src={locationImage} alt="location" className="mb-2 h-16 w-16 sm:mb-4 sm:h-24 sm:w-24 object-cover mx-auto rounded-2xl animate-bounce shadow-md" />
            ) : (
              <img src="/assets/dumb/seal.webp" alt="location" className="mb-2 h-20 w-20 sm:mb-4 sm:h-32 sm:w-32 object-cover mx-auto animate-bounce drop-shadow-xl rounded-2xl border-4 border-white" />
            )}
            <h1 className="text-xl sm:text-2xl font-extrabold drop-shadow-sm leading-tight" style={{ color: accentColor }}>{locationTitle}</h1>
            <div className="mx-auto my-2 sm:my-4 h-1 w-16 sm:w-24 rounded-full bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
            
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-6 w-full max-w-[280px] mx-auto">
              {locationOptions.map(loc => (
                <button
                  key={loc}
                  onClick={() => toggleSelection("location", loc)}
                  className={`rounded-full border-2 px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-sm font-bold transition-all shadow-sm active:scale-95 ${selections.location.includes(loc) ? 'border-transparent text-white scale-105 shadow-md' : 'border-pink-100 text-gray-700 bg-white/80 hover:bg-white hover:border-pink-300'}`}
                  style={{ backgroundColor: selections.location.includes(loc) ? accentColor : undefined }}
                >
                  {loc}
                </button>
              ))}
            </div>
            
            {selections.location.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                onClick={() => setStage("datetime")}
                className="w-full rounded-full px-6 py-2.5 sm:px-8 sm:py-3 text-base sm:text-lg font-bold shadow-xl transition-transform hover:scale-105 active:scale-95 hover:shadow-pink-300"
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
            className="relative z-10 mx-auto w-[85%] sm:w-[90%] max-w-md max-h-[95%] overflow-y-auto [&::-webkit-scrollbar]:hidden rounded-[2rem] border border-white/60 bg-white/70 p-4 sm:p-6 text-center shadow-[0_12px_40px_rgba(255,192,203,0.5)] backdrop-blur-md"
          >
            { datetimeImage ? (
              <MediaDisplay src={datetimeImage} alt="datetime" className="mb-2 h-16 w-16 sm:mb-4 sm:h-24 sm:w-24 object-cover mx-auto rounded-2xl animate-bounce shadow-md" />
            ) : (
              <img src="/assets/happy/bubu-dudu-sseeyall.webp" alt="datetime" className="mb-2 h-20 w-20 sm:mb-4 sm:h-32 sm:w-32 object-cover mx-auto animate-bounce drop-shadow-xl rounded-2xl border-4 border-white" />
            )}
            <h1 className="text-xl sm:text-2xl font-extrabold drop-shadow-sm leading-tight" style={{ color: accentColor }}>{datetimeTitle}</h1>
            <div className="mx-auto my-2 sm:my-4 h-1 w-16 sm:w-24 rounded-full bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
            
            <div className="mb-3 sm:mb-5 text-left">
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-bold text-gray-600">Ngày hẹn ✨</p>
              <CuteDatePicker 
                selected={selections.date} 
                onSelect={d => { setSelections(s => ({ ...s, date: d })); playClick(); }} 
                accentColor={accentColor} 
              />
            </div>

            <div className="mb-4 sm:mb-8 text-left">
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-bold text-gray-600">Giờ hẹn ✨</p>
              <CuteTimePicker 
                selected={selections.time} 
                onSelect={t => { setSelections(s => ({ ...s, time: t })); playClick(); }} 
                accentColor={accentColor} 
              />
            </div>
            
            {selections.date && selections.time && (
              <motion.button
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                onClick={() => setStage("food")}
                className="w-full rounded-full px-6 py-2.5 sm:px-8 sm:py-3 text-base sm:text-lg font-bold shadow-xl transition-transform hover:scale-105 active:scale-95 hover:shadow-pink-300"
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
            className="relative z-10 mx-auto w-[85%] sm:w-[90%] max-w-md max-h-[95%] overflow-y-auto [&::-webkit-scrollbar]:hidden rounded-[2rem] border border-white/60 bg-white/70 p-4 sm:p-6 text-center shadow-[0_12px_40px_rgba(255,192,203,0.5)] backdrop-blur-md"
          >
            { foodImage ? (
              <MediaDisplay src={foodImage} alt="food" className="mb-2 h-16 w-16 sm:mb-4 sm:h-24 sm:w-24 object-cover mx-auto rounded-2xl animate-bounce shadow-md" />
            ) : (
              <img src="/assets/happy/ami-bụng-bự.webp" alt="food" className="mb-2 h-20 w-20 sm:mb-4 sm:h-32 sm:w-32 object-cover mx-auto animate-bounce drop-shadow-xl rounded-2xl border-4 border-white" />
            )}
            <h1 className="text-xl sm:text-2xl font-extrabold drop-shadow-sm leading-tight" style={{ color: accentColor }}>{foodTitle}</h1>
            <div className="mx-auto my-2 sm:my-4 h-1 w-16 sm:w-24 rounded-full bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
            
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-6 w-full max-w-[280px] mx-auto">
              {foodOptions.map(f => (
                <button
                  key={f}
                  onClick={() => toggleSelection("food", f)}
                  className={`rounded-full border-2 px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-sm font-bold transition-all shadow-sm active:scale-95 ${selections.food.includes(f) ? 'border-transparent text-white scale-105 shadow-md' : 'border-pink-100 text-gray-700 bg-white/80 hover:bg-white hover:border-pink-300'}`}
                  style={{ backgroundColor: selections.food.includes(f) ? accentColor : undefined }}
                >
                  {f}
                </button>
              ))}
            </div>
            
            {selections.food.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                onClick={() => setStage("drink")}
                className="w-full rounded-full px-6 py-2.5 sm:px-8 sm:py-3 text-base sm:text-lg font-bold shadow-xl transition-transform hover:scale-105 active:scale-95 hover:shadow-pink-300"
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
            className="relative z-10 mx-auto w-[85%] sm:w-[90%] max-w-md max-h-[95%] overflow-y-auto [&::-webkit-scrollbar]:hidden rounded-[2rem] border border-white/60 bg-white/70 p-4 sm:p-6 text-center shadow-[0_12px_40px_rgba(255,192,203,0.5)] backdrop-blur-md"
          >
            { drinkImage ? (
              <MediaDisplay src={drinkImage} alt="drink" className="mb-2 h-16 w-16 sm:mb-4 sm:h-24 sm:w-24 object-cover mx-auto rounded-2xl animate-bounce shadow-md" />
            ) : (
              <img src="/assets/happy/dudu-bubu.webp" alt="drink" className="mb-2 h-20 w-20 sm:mb-4 sm:h-32 sm:w-32 object-cover mx-auto animate-bounce drop-shadow-xl rounded-2xl border-4 border-white" />
            )}
            <h1 className="text-xl sm:text-2xl font-extrabold drop-shadow-sm leading-tight" style={{ color: accentColor }}>{drinkTitle}</h1>
            <div className="mx-auto my-2 sm:my-4 h-1 w-16 sm:w-24 rounded-full bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
            
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-6 w-full max-w-[280px] mx-auto">
              {drinkOptions.map(d => (
                <button
                  key={d}
                  onClick={() => toggleSelection("drink", d)}
                  className={`rounded-full border-2 px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-sm font-bold transition-all shadow-sm active:scale-95 ${selections.drink.includes(d) ? 'border-transparent text-white scale-105 shadow-md' : 'border-pink-100 text-gray-700 bg-white/80 hover:bg-white hover:border-pink-300'}`}
                  style={{ backgroundColor: selections.drink.includes(d) ? accentColor : undefined }}
                >
                  {d}
                </button>
              ))}
            </div>
            
            {selections.drink.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                onClick={finish}
                className="w-full rounded-full px-6 py-2.5 sm:px-8 sm:py-3 text-base sm:text-lg font-bold shadow-xl transition-transform hover:scale-105 active:scale-95 hover:shadow-pink-300"
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
            className="relative z-10 mx-auto w-[85%] sm:w-[90%] max-w-md max-h-[95%] overflow-y-auto [&::-webkit-scrollbar]:hidden"
          >
            <div className="relative mx-auto w-full rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col border border-pink-200">
              {/* Ticket Header */}
              <div className="bg-pink-500 text-white p-4 sm:p-6 text-center border-b-4 border-dashed border-white relative">
                 <h2 className="text-xl sm:text-3xl font-black tracking-widest uppercase drop-shadow-md">Date Pass</h2>
                 <p className="text-pink-100 font-medium text-sm mt-1 uppercase tracking-widest">Admit Two</p>
                 <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full" style={{ backgroundColor }}></div>
                 <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full" style={{ backgroundColor }}></div>
              </div>
              {/* Ticket Body */}
              <div className="p-4 sm:p-6 bg-white relative">
                 <h3 className="text-xl sm:text-2xl font-bold mb-2 text-center" style={{ color: accentColor }}>{finalTitle}</h3>
                 <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 text-center whitespace-pre-wrap">{displayFinalMessage}</p>
                 
                 <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-6 bg-pink-50/50 p-3 sm:p-5 rounded-xl border border-pink-100">
                    <div className="flex justify-between items-center border-b border-pink-100 pb-2 sm:pb-3">
                      <span className="text-[10px] sm:text-xs font-bold text-pink-400 uppercase tracking-wider">Thời gian</span>
                      <span className="text-xs sm:text-sm font-black text-gray-700">{selections.time || "??:??"} • {selections.date || "??/??/????"}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-pink-100 pb-2 sm:pb-3">
                      <span className="text-[10px] sm:text-xs font-bold text-pink-400 uppercase tracking-wider">Địa điểm</span>
                      <span className="text-xs sm:text-sm font-bold text-gray-700 text-right">{selections.location.length ? selections.location.join(", ") : "Tùy chọn"}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-pink-100 pb-2 sm:pb-3">
                      <span className="text-[10px] sm:text-xs font-bold text-pink-400 uppercase tracking-wider">Món ăn</span>
                      <span className="text-xs sm:text-sm font-bold text-gray-700 text-right">{selections.food.length ? selections.food.join(", ") : "Tùy chọn"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] sm:text-xs font-bold text-pink-400 uppercase tracking-wider">Nước uống</span>
                      <span className="text-xs sm:text-sm font-bold text-gray-700 text-right">{selections.drink.length ? selections.drink.join(", ") : "Tùy chọn"}</span>
                    </div>
                 </div>

                 {/* QR Code Placeholder */}
                 <div className="flex justify-center items-center pt-1 sm:pt-2">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white border-[3px] border-pink-200 rounded-xl flex items-center justify-center p-1 sm:p-1.5 shadow-sm">
                      <svg className="w-full h-full text-pink-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v3h-3v-3zm-2 3h3v3h-3v-3zm3 3h3v3h-3v-3zm-5-3h3v3h-3v-3zm0-3h3v3h-3v-3zm-3 6h3v3h-3v-3zm0-6h3v3h-3v-3z" />
                      </svg>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <TemplateNavigator
        currentIndex={currentStageIndex}
        totalSteps={stageOrder.length - 1} // -1 because completion is not a real step to navigate to via arrows
        onPrev={() => setStage(stageOrder[Math.max(0, currentStageIndex - 1)])}
        onNext={() => setStage(stageOrder[Math.min(stageOrder.length - 2, currentStageIndex + 1)])}
        accentColor={accentColor}
        isHidden={hideNavigation || autoPlay || stage === "completion"}
      />
    </div>
  );
}

