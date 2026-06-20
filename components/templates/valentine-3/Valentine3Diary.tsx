"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { DEFAULT_APP_DATA } from "./config";
import { FloatingParticles } from "./components/FloatingParticles";
import { Step1Fingerprint } from "./components/Step1Fingerprint";
import { Step2TimeMachine } from "./components/Step2TimeMachine";
import { Step3Quiz } from "./components/Step3Quiz";
import { Step4Puzzle } from "./components/Step4Puzzle";
import { Step5FakeChat } from "./components/Step5FakeChat";
import { Step6PolaroidSwipe } from "./components/Step6PolaroidSwipe";
import { Step7Letter } from "./components/Step7Letter";
import { Step8Climax } from "./components/Step8Climax";

export function Valentine3Diary({
  compact = false,
  fullScreen = false,
  data = DEFAULT_APP_DATA,
  onResponse,
}: {
  compact?: boolean;
  fullScreen?: boolean;
  hideNavigation?: boolean;
  data?: any;
  roomId?: string;
  onResponse?: (res: { answer: string; message: string }) => void;
}) {
  const [step, setStep] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((e) => console.log("Audio play prevented:", e));
    }
  };

  let containerClass = "w-full overflow-hidden transition-colors duration-[2000ms] mx-auto text-gray-800 touch-none select-none ";
  
  if (compact) {
    containerClass += `absolute inset-0 border-[6px] border-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(255,105,180,0.3)] bg-gradient-to-br from-[#fff0f5] via-[#ffe4e1] to-[#ffb6c1]`;
  } else if (fullScreen) {
    containerClass += `relative min-h-screen bg-gradient-to-br from-[#fff0f5] via-[#ffe4e1] to-[#ffb6c1]`;
  } else {
    containerClass += `relative max-w-[400px] h-[800px] max-h-[90vh] rounded-[2.5rem] shadow-[0_20px_50px_rgba(255,105,180,0.3)] mx-auto border-[10px] border-white bg-gradient-to-br from-[#fff0f5] via-[#ffe4e1] to-[#ffb6c1]`;
  }

  // Auto play music logic could be placed here if needed, but Step 1 handles user interaction

  return (
    <div className={containerClass}>
      {data.musicUrl && <audio ref={audioRef} src={data.musicUrl} loop preload="auto" />}

      <FloatingParticles />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <Step1Fingerprint
            key="step1"
            onComplete={() => {
              playMusic();
              setStep(2);
            }}
          />
        )}
        
        {step === 2 && (
          <Step2TimeMachine
            key="step2"
            startDate={data.startDate}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <Step3Quiz
            key="step3"
            quiz={data.quiz}
            onComplete={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <Step4Puzzle
            key="step4"
            image={data.puzzleImage}
            onComplete={() => setStep(5)}
          />
        )}

        {step === 5 && (
          <Step5FakeChat
            key="step5"
            chat={data.fakeChat}
            onComplete={() => setStep(6)}
          />
        )}

        {step === 6 && (
          <Step6PolaroidSwipe
            key="step6"
            photos={data.photos}
            onComplete={() => setStep(7)}
          />
        )}

        {step === 7 && (
          <Step7Letter
            key="step7"
            title={data.letterTitle}
            content={data.letterContent}
            onComplete={() => setStep(8)}
          />
        )}

        {step === 8 && (
          <Step8Climax
            key="step8"
            onResponse={onResponse}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
