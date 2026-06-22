"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Step1WaxSeal } from "./components/Step1WaxSeal";
import { Step2GoldenTicket } from "./components/Step2GoldenTicket";
import { Step3Flashlight } from "./components/Step3Flashlight";
import { Step4Corridor } from "./components/Step4Corridor";
import { Step5Shattered } from "./components/Step5Shattered";
import { Step6Awakening } from "./components/Step6Awakening";
import { Step7Ascension } from "./components/Step7Ascension";
import { Step8StarMap } from "./components/Step8StarMap";
import { Step9Letter } from "./components/Step9Letter";
import { Step10FallingStar } from "./components/Step10FallingStar";
import { TemplateNavigator } from "../TemplateNavigator";

export default function Birthday3Museum({ autoPlay = false, compact = false }: { autoPlay?: boolean; compact?: boolean }) {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep((s) => s + 1);

  let containerClass = "relative w-full bg-neutral-950 overflow-hidden text-white touch-none font-sans mx-auto perspective-[2000px] ";
  if (compact) {
    containerClass += "h-full max-w-[400px]";
  } else {
    containerClass += "max-w-[400px] h-[800px] max-h-[90vh] rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[8px] border-neutral-800";
  }

  return (
    <div className={containerClass}>
      <AnimatePresence mode="wait">
        {step === 1 && <Step1WaxSeal key="step1" onNext={handleNext} autoPlay={autoPlay} />}
        {step === 2 && <Step2GoldenTicket key="step2" onNext={handleNext} autoPlay={autoPlay} />}
        {step === 3 && <Step3Flashlight key="step3" onNext={handleNext} autoPlay={autoPlay} />}
        {step === 4 && <Step4Corridor key="step4" onNext={handleNext} autoPlay={autoPlay} />}
        {step === 5 && <Step5Shattered key="step5" onNext={handleNext} autoPlay={autoPlay} />}
        {step === 6 && <Step6Awakening key="step6" onNext={handleNext} />}
        {step === 7 && <Step7Ascension key="step7" onNext={handleNext} autoPlay={autoPlay} />}
        {step === 8 && <Step8StarMap key="step8" onNext={handleNext} autoPlay={autoPlay} />}
        {step === 9 && <Step9Letter key="step9" onNext={handleNext} autoPlay={autoPlay} />}
        {step === 10 && <Step10FallingStar key="step10" autoPlay={autoPlay} onNext={() => autoPlay && setStep(1)} />}
      </AnimatePresence>

      <TemplateNavigator
        currentIndex={step - 1}
        totalSteps={10}
        onPrev={() => step > 1 && setStep(step - 1)}
        onNext={() => step < 10 && setStep(step + 1)}
        accentColor="#fbbf24"
        isHidden={compact}
      />
    </div>
  );
}
