"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

import { Step123Machine } from "./components/Step123Machine";
import { Step4Capsule } from "./components/Step4Capsule";
import { Step4Wheel } from "./components/Step4Wheel";
import { Step5DateTimePicker } from "./components/Step5DateTimePicker";
import { Step6Letter } from "./components/Step6Letter";
import { Step7Verification } from "./components/Step7Verification";
import { Step8Success } from "./components/Step8Success";

import { FloatingHearts3D } from "../dating-1/components/FloatingHearts3D";
import { TemplateNavigator } from "../TemplateNavigator";

const GachaStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
  
  .gacha-container * {
      font-family: 'Poppins', sans-serif;
  }
  
  /* Premium CSS Animations */
  @keyframes float-anim {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
  }
  .anim-float { animation: float-anim 3s ease-in-out infinite; }

  @keyframes pulse-glow-anim {
      0%, 100% { box-shadow: 0 0 10px rgba(236, 72, 153, 0.4); }
      50% { box-shadow: 0 0 25px rgba(236, 72, 153, 1); }
  }
  .anim-pulse-glow { animation: pulse-glow-anim 1.5s infinite; }

  @keyframes shake-anim {
      0%, 100% { transform: translateX(0) rotate(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-6px) rotate(-3deg); }
      20%, 40%, 60%, 80% { transform: translateX(6px) rotate(3deg); }
  }
  .anim-shake { animation: shake-anim 0.6s cubic-bezier(.36,.07,.19,.97) both; }

  @keyframes egg-bounce-anim {
      0% { transform: translateY(-150px) scale(0.8) rotate(-15deg); opacity: 0; }
      50% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
      65% { transform: translateY(-30px) scale(0.95); }
      80% { transform: translateY(0) scale(1); }
      90% { transform: translateY(-10px); }
      100% { transform: translateY(0); opacity: 1; }
  }
  .anim-egg-bounce { animation: egg-bounce-anim 1.2s cubic-bezier(0.28, 0.84, 0.42, 1) forwards; }

  @keyframes wiggle-anim {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-5deg); }
      50% { transform: rotate(5deg); }
      75% { transform: rotate(-5deg); }
  }
  .anim-wiggle { animation: wiggle-anim 1s ease-in-out infinite; }

  @keyframes heartbeat-anim {
      0%, 100% { transform: scale(1); }
      15% { transform: scale(1.1); }
      30% { transform: scale(1); }
      45% { transform: scale(1.1); }
  }
  .anim-heartbeat { animation: heartbeat-anim 1.5s ease-in-out infinite; }

  .liquid-btn { transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s, box-shadow 0.3s; }
  .liquid-btn:active { transform: scale(0.9) !important; }

  .ray-explosion {
      animation: explode-light 1s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
  }
  @keyframes explode-light {
      0% { box-shadow: 0 0 0 0 rgba(255,255,255,1), 0 0 40px 20px rgba(255,255,255,0.8); background: white; }
      100% { box-shadow: 0 0 0 1000px rgba(255,255,255,0), 0 0 100px 50px rgba(255,255,255,0); background: transparent; }
  }

  .capsule-top, .capsule-bottom { transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s; }
  .capsule-open .capsule-top { transform: translateY(-60px) rotate(-30deg) translateX(-40px); opacity: 0; }
  .capsule-open .capsule-bottom { transform: translateY(60px) rotate(30deg) translateX(40px); opacity: 0; }
  
  @keyframes pop-in-anim {
      0% { transform: scale(0); opacity: 0; }
      80% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
  }
  .anim-pop-in { animation: pop-in-anim 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; opacity: 0; }

  @keyframes floatLetter { 
      0%, 100% { transform: translateY(0px) rotate(-2deg); } 
      50% { transform: translateY(-15px) rotate(1deg); } 
  }
  .anim-float-letter {
      animation: floatLetter 4s ease-in-out infinite;
  }



  .stardust {
      position: absolute; border-radius: 50%; background: white;
      box-shadow: 0 0 8px 2px rgba(255,255,255,0.8);
      animation: drift 4s infinite linear;
  }
  @keyframes drift {
      0% { transform: translateY(0) translateX(0); opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
  }

  .holo-ticket {
      animation: holo-rotate 6s infinite ease-in-out alternate;
      transform-style: preserve-3d;
      perspective: 1000px;
  }
  @keyframes holo-rotate {
      0% { transform: perspective(1000px) rotateY(-10deg) rotateX(5deg); }
      100% { transform: perspective(1000px) rotateY(10deg) rotateX(-5deg); }
  }

  .scanline {
      position: absolute; left: -50%; width: 200%; height: 20px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.9), transparent);
      transform: rotate(-30deg);
      animation: scan 2.5s infinite linear;
  }
  @keyframes scan { 
      0% { top: -50%; }
      100% { top: 150%; } 
  }
`;

import { GACHA_DATA } from "./config";

export function GachaTemplate({ compact, fullScreen, hideNavigation, isBuilderPreview, onComplete, autoPlay, data: customData }: any) {
  const data = { ...GACHA_DATA, ...customData };
  const [step, setStep] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null as any);

  useEffect(() => {
    if (compact) return;
    const handleFirstInteraction = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.4;
        audioRef.current.play().catch(() => {});
      }
      document.removeEventListener("click", handleFirstInteraction);
    };
    document.addEventListener("click", handleFirstInteraction);
    return () => document.removeEventListener("click", handleFirstInteraction);
  }, [compact]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {});
    } else if (compact && !isBuilderPreview && audioRef.current) {
      audioRef.current.pause();
    }
  }, [autoPlay, compact, isBuilderPreview, data.audioSrc]);

  // AutoPlay orchestration logic
  useEffect(() => {
    if (!autoPlay || !mounted) return;
    let timer: any;
    if (step === 9) {
      timer = setTimeout(() => {
        setStep(1);
        setLocation("");
        setDate("");
        setTime("");
      }, 5000); // Wait 5s at the end before restart
    }
    return () => clearTimeout(timer);
  }, [step, autoPlay, mounted]);

  const triggerConfetti = () => {
    const canvas = document.getElementById("confetti-canvas") as HTMLCanvasElement;
    if (canvas) {
      const myConfetti = confetti.create(canvas, { resize: true });
      myConfetti({ particleCount: 200, spread: 160, origin: { y: 0.6 }, zIndex: 100 });
    }
  };

  let outerClass = compact && !isBuilderPreview ? `relative w-full shadow-2xl mx-auto rounded-[3rem] bg-pink-200 p-[10px] h-full max-w-[400px]` : `relative w-full h-full`;
  let containerClass = "gacha-container w-full h-full overflow-hidden transition-colors duration-[2000ms] mx-auto text-gray-800 select-none ";
  
  if (compact || isBuilderPreview) {
    containerClass += `absolute inset-0`;
  } else if (fullScreen) {
    containerClass += `relative min-h-screen`;
  } else {
    containerClass += `relative w-full h-full min-h-[600px] rounded-[2rem] shadow-[0_20px_50px_rgba(255,105,180,0.3)] mx-auto border-2 border-pink-200`;
  }

  if (!mounted) return <div className={outerClass} />;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GachaStyles }} />
      <div className={`w-full flex items-center justify-center ${compact ? 'h-full' : 'w-full h-full'} ${fullScreen || compact ? '' : 'p-0'}`}>
        <div className={outerClass}>
          <div id="preview-container" className={containerClass} style={{ backgroundImage: "url('/assets/bg/bg7.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className={`absolute inset-0 bg-pink-100/60 backdrop-blur-sm pointer-events-none ${!compact && 'rounded-[2rem]'}`} />
          
          <audio ref={audioRef} src={data.audioSrc || GACHA_DATA.audioSrc} loop autoPlay={autoPlay} muted={compact && !isBuilderPreview && !autoPlay} />

          {!compact && <FloatingHearts3D />}
          
          <AnimatePresence>
            {(step === 1 || step === 2 || step === 3) && (
              <Step123Machine key="step123" onEggDropped={() => setStep(4)} autoPlay={autoPlay} compact={compact} data={data} />
            )}
            
            {step === 4 && (
              <Step4Capsule key="step4" onOpened={() => setStep(5)} autoPlay={autoPlay} compact={compact} data={data} />
            )}

            {step === 5 && (
              <Step4Wheel key="stepWheel" onNext={(loc) => { setLocation(loc); setStep(6); }} autoPlay={autoPlay} data={data} />
            )}

            {step === 6 && (
              <Step5DateTimePicker key="stepDateTime" onNext={(d, t) => { setDate(d); setTime(t); setStep(7); }} autoPlay={autoPlay} data={data} />
            )}
            
            {step === 7 && (
              <Step6Letter key="stepLetter" onNext={() => setStep(8)} autoPlay={autoPlay} data={data} />
            )}

            {step === 8 && (
              <Step7Verification key="stepVerify" location={location} date={date} time={time} onNext={() => { setStep(9); triggerConfetti(); }} autoPlay={autoPlay} data={data} />
            )}
            
            {step === 9 && (
              <Step8Success key="stepSuccess" location={location} date={date} time={time} onComplete={() => onComplete?.({ answer: "YES", message: "Gacha Confession accepted!" })} autoPlay={autoPlay} data={data} />
            )}
          </AnimatePresence>

          <TemplateNavigator
            currentIndex={[1, 4, 5, 6, 7, 8, 9].indexOf(step)}
            totalSteps={7}
            onPrev={() => {
              const s = [1, 4, 5, 6, 7, 8, 9];
              const idx = s.indexOf(step);
              if (idx > 0) setStep(s[idx - 1]);
            }}
            onNext={() => {
              const s = [1, 4, 5, 6, 7, 8, 9];
              const idx = s.indexOf(step);
              if (idx < s.length - 1) setStep(s[idx + 1]);
            }}
            accentColor="#ec4899"
            isHidden={hideNavigation || autoPlay}
          />

          <canvas id="confetti-canvas" className="absolute inset-0 w-full h-full pointer-events-none z-[100]"></canvas>

          </div>
        </div>
      </div>
    </>
  );
}
