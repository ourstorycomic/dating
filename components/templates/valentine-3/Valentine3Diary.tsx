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
import { TemplateNavigator } from "../TemplateNavigator";

export function Valentine3Diary({
  compact = false,
  fullScreen = false,
  data = DEFAULT_APP_DATA,
  autoPlay = false,
  isBuilderPreview = false,
  onResponse,
  forceStep,
  onStepChange,
  hideNavigation = false,
}: {
  compact?: boolean;
  fullScreen?: boolean;
  hideNavigation?: boolean;
  data?: any;
  roomId?: string;
  autoPlay?: boolean;
  isBuilderPreview?: boolean;
  onResponse?: (res: { answer: string; message: string }) => void;
  forceStep?: number;
  onStepChange?: (step: number, total: number) => void;
}) {
  const [step, setStep] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (forceStep !== undefined) {
      setStep(forceStep + 1);
    }
  }, [forceStep]);

  useEffect(() => {
    onStepChange?.(step - 1, 8);
  }, [step, onStepChange]);

  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((e) => console.log("Audio play prevented:", e));
    }
  };

  // No blind interval here. Children handle their own autoPlay.

  let containerClass = "w-full overflow-hidden transition-colors duration-[2000ms] mx-auto text-gray-800 select-none ";
  
  if (compact) {
    containerClass += `absolute inset-0 border-[6px] border-pink-200 rounded-[2.5rem] shadow-[0_20px_50px_rgba(255,105,180,0.3)] mx-auto max-w-[400px]`;
  } else if (fullScreen) {
    containerClass += `relative min-h-full`;
  } else {
    containerClass += `relative w-full h-full min-h-[600px] shadow-[0_20px_50px_rgba(255,105,180,0.3)] mx-auto sm:border-[10px] border-pink-200 sm:rounded-[2.5rem]`;
  }

  const mergedData = {
    startDate: data?.startDate || DEFAULT_APP_DATA.startDate,
    musicUrl: data?.musicUrl || DEFAULT_APP_DATA.musicUrl,
    quiz: data?.quiz?.length ? data.quiz : DEFAULT_APP_DATA.quiz,
    puzzleImage: data?.puzzleImage || DEFAULT_APP_DATA.puzzleImage,
    fakeChat: data?.fakeChat?.length ? data.fakeChat : DEFAULT_APP_DATA.fakeChat,
    photos: data?.photos?.length ? data.photos : DEFAULT_APP_DATA.photos,
    letterTitle: data?.letterTitle || DEFAULT_APP_DATA.letterTitle,
    letterContent: data?.letterContent || DEFAULT_APP_DATA.letterContent,
  };

  // Auto play music logic could be placed here if needed, but Step 1 handles user interaction

  // Mute on the homepage catalog to avoid bot auto-play sounds,
  // but allow it on the showcase preview (isBuilderPreview)
  const isMuted = compact && !isBuilderPreview && !autoPlay;

  return (
    <div className={containerClass} style={{ backgroundImage: "url('/assets/bg/bg5.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-pink-50/70 backdrop-blur-[2px] pointer-events-none" />
      {mergedData.musicUrl && <audio ref={audioRef} src={mergedData.musicUrl} loop preload="auto" muted={compact && !autoPlay} />}

      {!compact && <FloatingParticles />}

      <div className="relative w-full h-full max-w-[400px] mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <Step1Fingerprint
              key="step1"
              autoPlay={autoPlay}
              onComplete={() => {
                playMusic();
                setStep(2);
              }}
            />
          )}
          
          {step === 2 && (
            <Step2TimeMachine
              key="step2"
              startDate={mergedData.startDate}
              onNext={() => setStep(3)}
              autoPlay={autoPlay}
            />
          )}

          {step === 3 && (
            <Step3Quiz
              key="step3"
              quiz={mergedData.quiz}
              onComplete={() => setStep(4)}
              autoPlay={autoPlay}
            />
          )}

          {step === 4 && (
            <Step4Puzzle
              key="step4"
              image={mergedData.puzzleImage}
              onComplete={() => setStep(5)}
              autoPlay={autoPlay}
            />
          )}

          {step === 5 && (
            <Step5FakeChat
              key="step5"
              chat={mergedData.fakeChat}
              onComplete={() => setStep(6)}
              autoPlay={autoPlay}
            />
          )}

          {step === 6 && (
            <Step6PolaroidSwipe
              key="step6"
              photos={mergedData.photos}
              onComplete={() => setStep(7)}
              autoPlay={autoPlay}
            />
          )}

          {step === 7 && (
            <Step7Letter
              key="step7"
              title={mergedData.letterTitle}
              content={mergedData.letterContent}
              onComplete={() => setStep(8)}
              autoPlay={autoPlay}
            />
          )}

          {step === 8 && (
            <Step8Climax
              key="step8"
              onResponse={onResponse}
              autoPlay={autoPlay}
            />
          )}
        </AnimatePresence>
        
        <TemplateNavigator
          currentIndex={step - 1}
          totalSteps={8}
          onPrev={() => setStep(Math.max(1, step - 1))}
          onNext={() => setStep(Math.min(8, step + 1))}
          accentColor="#ec4899"
          isHidden={hideNavigation || autoPlay}
        />
      </div>
    </div>
  );
}
