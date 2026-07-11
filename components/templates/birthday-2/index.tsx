"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { BIRTHDAY_DATA, type Birthday2Config } from "./config";
import { Step1Alarm } from "./components/Step1Alarm";
import { Step2FakeChat } from "./components/Step2FakeChat";
import { Step3Delivery } from "./components/Step3Delivery";
import { Step4Unbox } from "./components/Step4Unbox";
import { Step5Cake } from "./components/Step5Cake";
import { Step6Letter } from "./components/Step6Letter";
import { Step7Climax } from "./components/Step7Climax";
import { TemplateNavigator } from "../TemplateNavigator";

export default function Birthday2Diary({ autoPlay = false, compact = false, isBuilderPreview = false, generalAudioUrl, forceStep, onStepChange, hideNavigation = false, config = {} }: { autoPlay?: boolean; compact?: boolean; isBuilderPreview?: boolean; generalAudioUrl?: string; forceStep?: number; onStepChange?: (step: number, total: number) => void; hideNavigation?: boolean; config?: Birthday2Config }) {
  const [step, setStep] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().catch(() => {});
    } else if (compact && !isBuilderPreview && audioRef.current) {
      audioRef.current.pause();
    }
  }, [autoPlay, compact, isBuilderPreview, generalAudioUrl]);

  useEffect(() => {
    if (forceStep !== undefined) {
      setStep(forceStep + 1);
    }
  }, [forceStep]);

  useEffect(() => {
    onStepChange?.(step - 1, 7);
  }, [step, onStepChange]);

  const handleNext = () => setStep((s) => s + 1);

  return (
    <div 
      className={`relative w-full overflow-hidden text-slate-800 font-sans mx-auto h-full bg-pink-50`}
      style={{ backgroundImage: "url('/assets/bg/bg2.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {generalAudioUrl && <audio ref={audioRef} src={generalAudioUrl} loop muted={compact && !autoPlay} />}
      <div className="absolute inset-0 bg-pink-100/60 backdrop-blur-sm" />
      <AnimatePresence mode="wait">
        {step === 1 && <Step1Alarm key="step1" onNext={handleNext} autoPlay={autoPlay} compact={compact} config={config} />}
        {step === 2 && <Step2FakeChat key="step2" messages={BIRTHDAY_DATA.fakeMessages} onNext={handleNext} autoPlay={autoPlay} compact={compact} config={config} />}
        {step === 3 && <Step3Delivery key="step3" onNext={handleNext} autoPlay={autoPlay} compact={compact} photos={BIRTHDAY_DATA.photos} config={config} />}
        {step === 4 && <Step4Unbox key="step4" photos={BIRTHDAY_DATA.photos} onNext={handleNext} autoPlay={autoPlay} compact={compact} config={config} />}
        {step === 5 && <Step5Cake key="step5" onNext={handleNext} autoPlay={autoPlay} compact={compact} config={config} />}
        {step === 6 && <Step6Letter key="step6" letter={config.letterText || BIRTHDAY_DATA.letter} onNext={handleNext} autoPlay={autoPlay} compact={compact} config={config} />}
        {step === 7 && <Step7Climax key="step7" autoPlay={autoPlay} onNext={() => autoPlay && setStep(1)} config={config} />}
      </AnimatePresence>
      <TemplateNavigator
        currentIndex={step - 1}
        totalSteps={7}
        onPrev={() => setStep(Math.max(1, step - 1))}
        onNext={() => setStep(Math.min(7, step + 1))}
        accentColor="#db2777"
        isHidden={hideNavigation || autoPlay}
      />
    </div>
  );
}
