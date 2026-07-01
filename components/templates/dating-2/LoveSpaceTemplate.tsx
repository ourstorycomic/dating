"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps, react-hooks/purity */

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";

import { TPL_DATA } from "./config";
import { BackgroundDecorations } from "./components/BackgroundDecorations";
import { Step1Login } from "./components/Step1Login";
import { Step1_5Radio } from "./components/Step1_5Radio";
import { Step2Vibe } from "./components/Step2Vibe";
import { Step3Scratch } from "./components/Step3Scratch";
import { Step4Wheel } from "./components/Step4Wheel";
import { Step5DateTime } from "./components/Step5DateTime";
import { Step6Finale } from "./components/Step6Finale";
import { TemplateNavigator } from "../TemplateNavigator";

const JourneyStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Poppins:wght@300;400;500;600&display=swap');
  
  .journey-container {
      font-family: 'Poppins', sans-serif;
  }

  .glass-panel {
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      box-shadow: 0 8px 32px 0 rgba(255, 105, 180, 0.25);
  }

  .heartbeat { animation: heartBeat 1.5s infinite; }
  @keyframes heartBeat { 0%, 28%, 70% { transform: scale(1); } 14%, 42% { transform: scale(1.15); } }

  .vibrate { animation: vibrate 0.2s linear infinite both; }
  @keyframes vibrate {
      0% { transform: translate(0) }
      20% { transform: translate(-2px, 2px) }
      40% { transform: translate(-2px, -2px) }
      60% { transform: translate(2px, 2px) }
      80% { transform: translate(2px, -2px) }
      100% { transform: translate(0) }
  }

  .glow { box-shadow: 0 0 30px 10px rgba(255,105,180,0.8); border-color: #ff69b4 !important; }

  .letter-font { font-family: 'Dancing Script', cursive; }

  .typing-cursor::after {
      content: '|';
      animation: blink 0.8s step-end infinite;
      color: #ff69b4;
      margin-left: 2px;
  }
  @keyframes blink { 50% { opacity: 0; } }

  .bg-heart { position: absolute; color: rgba(255, 255, 255, 0.3); animation: floatUp linear infinite; z-index: 0; pointer-events: none;}
  @keyframes floatUp { 0% { transform: translateY(800px) rotate(0deg) scale(0.8); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translateY(-100px) rotate(360deg) scale(1.2); opacity: 0; } }

  .dt-btn {
      border: 2px solid rgba(255, 105, 180, 0.4);
      transition: all 0.2s;
      background: rgba(255, 255, 255, 0.6);
      color: #db2777;
      font-weight: 500;
  }
  .dt-btn.selected {
      background-color: #ec4899;
      color: white;
      border-color: #ec4899;
      box-shadow: 0 4px 10px rgba(236, 72, 153, 0.4);
      transform: scale(1.05);
  }

  .no-scrollbar::-webkit-scrollbar {
      display: none;
  }
  .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
  }
`;

export function LoveSpaceTemplate({ compact, fullScreen, hideNavigation, isBuilderPreview, onComplete, autoPlay, customData = {} }: any) {
  const [step, setStep] = useState(1);
  const [wheelResult, setWheelResult] = useState("");
  const [dateTime, setDateTime] = useState({ date: "", time: "" });
  
  useEffect(() => {
    if (customData.previewStep) {
      setStep(customData.previewStep);
    }
  }, [customData.previewStep]);
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null as any);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {});
    } else if (compact && !isBuilderPreview && audioRef.current) {
      audioRef.current.pause();
    }
  }, [autoPlay, compact, isBuilderPreview, customData.audioSrc]);

  let containerClass = "journey-container relative w-full overflow-hidden ";
  if (compact || isBuilderPreview) {
    containerClass += "h-full";
  } else if (fullScreen) {
    containerClass += "h-full";
  } else {
    containerClass += "w-full h-full min-h-[600px] sm:rounded-3xl shadow-2xl mx-auto border-4 border-white";
  }

  const bgStyle = {
    background: `linear-gradient(to bottom right, ${customData.bgFrom || "#ffe6f2"}, ${customData.bgTo || "#ffb3d9"})`,
    backgroundImage: `url('/assets/bg/bg3.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: 'overlay'
  };

  if (!mounted) return <div className={containerClass} style={bgStyle} />;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: JourneyStyles }} />
      <div className={`w-full flex items-center justify-center ${compact ? 'h-full' : 'w-full h-full'} ${fullScreen || compact ? '' : 'p-0'}`}>
        <div id="preview-container" className={containerClass} style={bgStyle}>
          
          {customData.audioSrc ? (
            <audio ref={audioRef} src={customData.audioSrc} autoPlay={autoPlay} loop muted={compact && !autoPlay} />
          ) : (
            <audio ref={audioRef} src={TPL_DATA.audioSrc} autoPlay={autoPlay} loop muted={compact && !autoPlay} />
          )}

          {!compact && <BackgroundDecorations />}

          <canvas id="confetti-canvas" className="absolute inset-0 w-full h-full pointer-events-none z-50"></canvas>

          <AnimatePresence mode="wait">
            {step === 1 && <Step1Login key="step1" customData={customData} onNext={() => setStep(1.5)} autoPlay={autoPlay} />}
            {step === 1.5 && <Step1_5Radio key="step1-5" customData={customData} audioRef={audioRef} onNext={() => setStep(2)} autoPlay={autoPlay} />}
            {step === 2 && <Step2Vibe key="step2" customData={customData} onNext={() => setStep(3)} autoPlay={autoPlay} />}
            {step === 3 && <Step3Scratch key="step3" customData={customData} onNext={() => setStep(4)} autoPlay={autoPlay} />}
            {step === 4 && <Step4Wheel key="step4" customData={customData} onNext={(res) => { setWheelResult(res); setStep(5); }} autoPlay={autoPlay} />}
            {step === 5 && <Step5DateTime key="step5" customData={customData} onNext={(d, t) => { setDateTime({date: d, time: t}); setStep(6); }} autoPlay={autoPlay} />}
            {step === 6 && <Step6Finale key="step6" customData={customData} dateTime={dateTime} wheelResult={wheelResult} onComplete={() => onComplete?.({ answer: "YES", message: "Date Set!" })} autoPlay={autoPlay} />}
          </AnimatePresence>

          <TemplateNavigator
            currentIndex={[1, 1.5, 2, 3, 4, 5, 6].indexOf(step)}
            totalSteps={7}
            onPrev={() => {
              const s = [1, 1.5, 2, 3, 4, 5, 6];
              const idx = s.indexOf(step);
              if (idx > 0) setStep(s[idx - 1]);
            }}
            onNext={() => {
              const s = [1, 1.5, 2, 3, 4, 5, 6];
              const idx = s.indexOf(step);
              if (idx < s.length - 1) setStep(s[idx + 1]);
            }}
            accentColor="#db2777"
            isHidden={hideNavigation || autoPlay}
          />

        </div>
      </div>
    </>
  );
}
