"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function TemplateNavigator({
  currentIndex,
  totalSteps,
  onNext,
  onPrev,
  accentColor = "#f43f5e",
  isHidden = false,
}: {
  currentIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  accentColor?: string;
  isHidden?: boolean;
}) {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById('template-navigator-portal'));
  }, []);

  if (isHidden) return null;

  const content = (
    <div className={portalTarget 
      ? "w-full max-w-sm mx-auto flex items-center justify-between gap-2 rounded-full border border-pink-500/20 bg-pink-500/5 p-2 mt-6 shadow-sm"
      : "absolute bottom-4 left-4 right-4 z-[9999] flex items-center justify-between gap-1 sm:gap-2 rounded-full border border-white/40 bg-white/95 backdrop-blur-md p-1.5 sm:p-2 shadow-2xl transition-all"
    }>
      <button
        className="rounded-full px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 disabled:cursor-not-allowed"
        style={{ backgroundColor: accentColor, color: "#ffffff" }}
        disabled={currentIndex <= 0}
        onClick={onPrev}
        type="button"
      >
        Lùi
      </button>
      <div className="flex flex-col items-center justify-center leading-tight whitespace-nowrap">
        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: accentColor }}>
          Đoạn
        </span>
        <span className="text-[13px] sm:text-sm font-black tracking-widest" style={{ color: accentColor }}>
          {currentIndex + 1}/{totalSteps}
        </span>
      </div>
      <button
        className="rounded-full px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 disabled:cursor-not-allowed"
        style={{ backgroundColor: accentColor, color: "#ffffff" }}
        disabled={currentIndex >= totalSteps - 1}
        onClick={onNext}
        type="button"
      >
        Tiếp
      </button>
    </div>
  );

  return portalTarget ? createPortal(content, portalTarget) : content;
}
