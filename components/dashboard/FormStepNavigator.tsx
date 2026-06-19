"use client";

import React from "react";

export function FormStepNavigator({
  currentStepIndex,
  totalSteps,
  stepLabels,
  onStepChange,
  onPrev,
  onNext,
}: {
  currentStepIndex: number;
  totalSteps: number;
  stepLabels?: string[];
  onStepChange?: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-4 flex flex-col gap-4 border-t border-white/10 pt-4">
      {/* Tabs / Step Buttons */}
      {onStepChange && (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onStepChange(i)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                currentStepIndex === i
                  ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {stepLabels && stepLabels[i] ? stepLabels[i] : `Đoạn ${i + 1}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
