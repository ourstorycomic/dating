"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { BIRTHDAY_DATA } from "./config";
import { Step1Alarm } from "./components/Step1Alarm";
import { Step2FakeChat } from "./components/Step2FakeChat";
import { Step3Delivery } from "./components/Step3Delivery";
import { Step4Unbox } from "./components/Step4Unbox";
import { Step5Cake } from "./components/Step5Cake";
import { Step6Letter } from "./components/Step6Letter";
import { Step7Climax } from "./components/Step7Climax";

export default function Birthday2Diary({ autoPlay = false }: { autoPlay?: boolean }) {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep((s) => s + 1);

  return (
    <div className="relative w-full max-w-[400px] h-[800px] max-h-[90vh] bg-slate-900 overflow-hidden rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] mx-auto border-[12px] border-gray-800 text-white touch-none font-sans">
      <AnimatePresence mode="wait">
        {step === 1 && <Step1Alarm key="step1" onNext={handleNext} autoPlay={autoPlay} />}
        {step === 2 && <Step2FakeChat key="step2" messages={BIRTHDAY_DATA.fakeMessages} onNext={handleNext} autoPlay={autoPlay} />}
        {step === 3 && <Step3Delivery key="step3" onNext={handleNext} autoPlay={autoPlay} />}
        {step === 4 && <Step4Unbox key="step4" photos={BIRTHDAY_DATA.photos} onNext={handleNext} autoPlay={autoPlay} />}
        {step === 5 && <Step5Cake key="step5" onNext={handleNext} autoPlay={autoPlay} />}
        {step === 6 && <Step6Letter key="step6" letter={BIRTHDAY_DATA.letter} onNext={handleNext} autoPlay={autoPlay} />}
        {step === 7 && <Step7Climax key="step7" autoPlay={autoPlay} onNext={() => autoPlay && setStep(1)} />}
      </AnimatePresence>
    </div>
  );
}
