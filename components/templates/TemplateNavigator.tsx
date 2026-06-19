"use client";

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
  if (isHidden) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 z-[9999] flex items-center justify-between gap-3 rounded-full border-2 border-white/20 bg-white p-2 shadow-xl transition-all">
      <button
        className="rounded-full px-6 py-3 text-sm font-bold shadow-md transition-all active:scale-95 disabled:shadow-none disabled:active:scale-100 disabled:cursor-not-allowed"
        style={{ backgroundColor: accentColor, color: "#ffffff" }}
        disabled={currentIndex <= 0}
        onClick={onPrev}
        type="button"
      >
        Lùi
      </button>
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accentColor }}>
        Đoạn {currentIndex + 1}/{totalSteps}
      </span>
      <button
        className="rounded-full px-6 py-3 text-sm font-bold shadow-md transition-all active:scale-95 disabled:shadow-none disabled:active:scale-100 disabled:cursor-not-allowed"
        style={{ backgroundColor: accentColor, color: "#ffffff" }}
        disabled={currentIndex >= totalSteps - 1}
        onClick={onNext}
        type="button"
      >
        Tiếp
      </button>
    </div>
  );
}
