"use client";

import React, { useEffect, useRef, useState } from "react";
import type { TemplatePreviewProps } from "./previews/types";
import { StarryConstellationPreview } from "./valentine-1/preview";
import { Valentine2Preview } from "./valentine-2/preview";
import { Valentine3Preview } from "./valentine-3/preview";
import { WillYouDateMePreview } from "./dating-1/preview";
import { BirthdayMagicPreview } from "./birthday-1/preview";
import { DatingTwoPreview } from "./dating-2/preview";
import { DatingThreePreview } from "./dating-3/preview";
import Birthday2Preview from "./birthday-2/preview";
import { Sorry1Preview } from "./sorry-1/preview";
import { Sorry2Preview } from "./sorry-2/preview";
import { Sorry3Preview } from "./sorry-3/preview";

type InteractiveTemplatePreviewProps = TemplatePreviewProps & {
  componentKey: string;
  roomId?: string;
};

const previewRegistry = [
  { match: "val-starry-constellation", Component: StarryConstellationPreview },
  { match: "constellation", Component: StarryConstellationPreview },
  { match: "starry", Component: StarryConstellationPreview },
  { match: "valentine-1", Component: StarryConstellationPreview },
  { match: "valentine #1", Component: StarryConstellationPreview },
  { match: "valentine-2", Component: Valentine2Preview },
  { match: "valentine #2", Component: Valentine2Preview },
  { match: "valentine-3", Component: Valentine3Preview },
  { match: "valentine #3", Component: Valentine3Preview },
  { match: "will-you-date-me", Component: WillYouDateMePreview },
  { match: "dating-1", Component: WillYouDateMePreview },
  { match: "dating #1", Component: WillYouDateMePreview },
  { match: "dating-2", Component: DatingTwoPreview },
  { match: "dating #2", Component: DatingTwoPreview },
  { match: "dating-3", Component: DatingThreePreview },
  { match: "dating #3", Component: DatingThreePreview },
  { match: "birthday-magic", Component: BirthdayMagicPreview },
  { match: "birthday-1", Component: BirthdayMagicPreview },
  { match: "birthday #1", Component: BirthdayMagicPreview },
  { match: "birthday-2", Component: Birthday2Preview },
  { match: "birthday #2", Component: Birthday2Preview },
  { match: "sorry-1", Component: Sorry1Preview },
  { match: "sorry #1", Component: Sorry1Preview },
  { match: "sorry-2", Component: Sorry2Preview },
  { match: "sorry #2", Component: Sorry2Preview },
  { match: "sorry-3", Component: Sorry3Preview },
  { match: "sorry #3", Component: Sorry3Preview },
];

// This bot automatically plays through ANY template by clicking buttons intelligently
function BotAutoPlayer({ children, enabled }: { children: React.ReactNode; enabled: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    let isActive = true;
    const interval = setInterval(() => {
      if (!isActive || !containerRef.current) return;
      
      const buttons = Array.from(containerRef.current.querySelectorAll('button'));
      const clickableTexts = ["CÓ", "YES", "Tiếp tục", "Chọn", "Mở", "Xem Tiếp", "Lên đồ", "Hoàn thành", "Bắt đầu", "Click", "Tiếp", "Next", "Đáng đòn", "Quay", "Bớt giận", "Chốt hạ", "Ký tên", "Đưa nó ra", "xả giận", "Giải thích", "Đọc tiếp", "Chốt kèo", "THA THỨ"];
      
      let clicked = false;
      
      // Visual click effect
      const showClick = (btn: HTMLElement) => {
        const rect = btn.getBoundingClientRect();
        const parentRect = containerRef.current!.getBoundingClientRect();
        const x = rect.left - parentRect.left + rect.width / 2;
        const y = rect.top - parentRect.top + rect.height / 2;

        const ripple = document.createElement("div");
        ripple.style.position = "absolute";
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.width = "40px";
        ripple.style.height = "40px";
        ripple.style.marginLeft = "-20px";
        ripple.style.marginTop = "-20px";
        ripple.style.borderRadius = "50%";
        ripple.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
        ripple.style.transform = "scale(0)";
        ripple.style.transition = "transform 0.4s ease-out, opacity 0.4s ease-out";
        ripple.style.pointerEvents = "none";
        ripple.style.zIndex = "9999";
        
        containerRef.current!.appendChild(ripple);
        
        requestAnimationFrame(() => {
          ripple.style.transform = "scale(1.5)";
          ripple.style.opacity = "0";
        });

        setTimeout(() => ripple.remove(), 400);
      };

      // 1. Try to find a primary 'next' or 'yes' button
      for (const btn of buttons) {
        const text = btn.textContent || "";
        if (clickableTexts.some(t => text.toLowerCase().includes(t.toLowerCase()))) {
           if (btn.disabled) continue;
           showClick(btn);
           btn.click();
           clicked = true;
           break;
        }
      }
      
      // 2. If no clear 'next' button, just click a random option (useful for selecting food/movie/etc)
      if (!clicked && buttons.length > 0) {
        const enabledButtons = buttons.filter(b => !b.disabled);
        if (enabledButtons.length > 0) {
          const randomBtn = enabledButtons[Math.floor(Math.random() * enabledButtons.length)];
          showClick(randomBtn);
          randomBtn.click();
        }
      }
      
    }, 3500);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [enabled]);

  const handleContainerClick = (e: React.MouseEvent) => {
    // If this click was generated by our script (BotAutoPlayer), stop it from bubbling up to the <Link> parent
    if (!e.nativeEvent.isTrusted) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return <div ref={containerRef} className="w-full h-full relative" onClick={handleContainerClick}>{children}</div>;
}

export function InteractiveTemplatePreview({
  componentKey,
  roomId,
  ...props
}: InteractiveTemplatePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const normalizedKey = componentKey.toLowerCase();
  const preview = previewRegistry.find((item) => normalizedKey.includes(item.match));

  if (preview) {
    const Component = preview.Component;
    if (props.compact) {
      if (!props.isBuilderPreview) {
        return (
          <div 
            ref={containerRef} 
            className="mx-auto flex aspect-[9/19] w-[340px] max-w-full shrink-0 flex-col overflow-hidden rounded-[2.5rem] border-[6px] border-[#150a21] bg-[#05020a] shadow-2xl relative isolate z-0 ring-1 ring-inset ring-black/10"
            style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            {/* Overlay to catch hover/touch events but block user clicks. BotAutoPlayer still works! */}
            <div className="absolute inset-0 z-50" />
            
            <div className="absolute inset-0 pointer-events-none">
              <BotAutoPlayer enabled={isHovered} key={isHovered ? "active" : "idle"}>
                <Component {...props} roomId={roomId} autoPlay={isHovered} compact={true} />
              </BotAutoPlayer>
            </div>
          </div>
        );
      } else {
        return (
          <div ref={containerRef} className="mx-auto flex aspect-[9/19] w-[340px] max-w-full shrink-0 flex-col overflow-hidden rounded-[2.5rem] border-[6px] border-[#150a21] bg-[#05020a] shadow-2xl relative">
            <Component {...props} roomId={roomId} autoPlay={false} />
          </div>
        );
      }
    }
    return <Component {...props} roomId={roomId} />;
  }

  return <FallbackPreview componentKey={componentKey} {...props} />;
}

function FallbackPreview({
  visualLabel,
  recipientName = "Linh",
  compact = false,
}: TemplatePreviewProps & { componentKey: string }) {
  return (
    <div className="relative grid h-full min-h-56 place-items-center overflow-hidden rounded-2xl border border-white/12 bg-[#12091f] p-5 text-center text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,79,216,0.32),transparent_32%),linear-gradient(145deg,rgba(155,92,255,0.28),transparent)]" />
      <div className="relative">
        <div className="float-slow mx-auto grid h-20 w-20 place-items-center rounded-full border border-white/20 bg-white/12 text-xs font-black shadow-[0_0_36px_rgba(255,79,216,0.28)]">
          {visualLabel || "LOVE"}
        </div>
        <h3 className={compact ? "mt-4 text-2xl font-bold" : "mt-5 text-4xl font-bold"}>
          Quà tặng cho {recipientName}
        </h3>
        <p className="mx-auto mt-3 max-w-xs text-xs leading-5 text-white/64">
          Template này đang chờ visual riêng. Admin có thể thêm preview component theo component_key.
        </p>
      </div>
    </div>
  );
}
