"use client";

/* eslint-disable @next/next/no-img-element, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/purity, react-hooks/set-state-in-effect, react/no-unescaped-entities */

import { useState, useEffect, useRef, type PointerEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IconStar = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

function MediaFrame({
  alt,
  className = "",
  mediaType,
  src,
}: {
  alt: string;
  className?: string;
  mediaType?: string;
  src: string;
}) {
  if (mediaType?.startsWith("video")) {
    return (
      <video
        aria-label={alt}
        autoPlay
        className={`h-full w-full object-cover ${className}`}
        loop
        muted
        playsInline
        src={src}
      />
    );
  }

  return <img src={src} className={`h-full w-full object-cover ${className}`} alt={alt} />;
}

export function ConstellationVaultExperience({
  senderName = "Anh",
  recipientName = "Em",
  compact = false,
  connectInstruction = "Giữ và di chuyển ống kính để dò tìm chòm sao",
  constellationPoints = [
    { x: 20, y: 50 },
    { x: 50, y: 30 },
    { x: 80, y: 50 },
    { x: 50, y: 70 },
    { x: 20, y: 50 },
  ],
  constellationMessages = [
    "Cậu biết không...",
    "Dù vũ trụ này có hàng tỷ vì sao...",
    "Nhưng trong mắt tớ...",
    "Cậu là vì sao sáng nhất và duy nhất."
  ],
  finalCta = "Nhận Quà Đi Chơi",
  finalTitle = "Happy Valentine's Day!",
  finalSubtitle = "Cảm ơn vì đã là ngoại lệ tuyệt vời nhất của nhau.",
  giftAcceptButton = "Lên đồ thôi!",
  giftAcceptedBody = "Lịch hẹn đã được lưu lại thành công.\nHẹn gặp cậu vào ngày hôm đó nhé!",
  giftAcceptedTitle = "Chốt đơn!",
  giftBody = "Cuối tuần này, cùng nhau đi dạo phố và uống chút gì đó ấm áp nhé? Tớ biết một quán view rất xinh!",
  giftDeclineButton = "Để khi khác",
  giftDeclinedBody = "Chọn một ngày cậu rảnh để chúng mình set kèo lại nhé!",
  giftDeclinedTitle = "Vậy hẹn ngày khác nha!",
  giftRescheduleButton = "Gửi lịch hẹn",
  giftTitle = "Thư Mời Hẹn Hò",
  proposedDate,
  giftBackButton = "Quay lại",
  contractBody = "\"Thời hạn dùng thử trái tim tớ đã hết.\n\nCậu có muốn gia hạn gói Premium (yêu thương trọn đời) không?\"",
  contractHoldInstruction = "Giữ vân tay 3 giây",
  contractRejectButton = "Xem xét lại",
  contractTitle = "Bản Hợp Đồng",
  finalAccent = "#ec4899",
  finalBackground = "#fb7185",
  introSubtitle = "",
  introTitle = "",
  stage1Accent = "#ec4899",
  stage1Background = "#05020a",
  stage1ImageUrl = "https://picsum.photos/id/1025/400/400",
  stage1MediaType = "",
  stage1RevealBody = "Trạm không gian vừa bắt được một dải sáng tuyệt đẹp. Vũ trụ bao la, nhưng radar chỉ hướng về một người duy nhất thôi!",
  stage1RevealButton = "Khôi phục từ trường",
  stage1RevealTitle = "Vì Sao Của Riêng Tớ",
  stage2Accent = "#60a5fa",
  stage2Background = "#05020a",
  stage2ImageCaption = "Our Orbit",
  stage2ImageUrl = "https://picsum.photos/id/1014/400/500",
  stage2MediaType = "",
  stage2NextButton = "Tiếp tục hành trình",
  stage2Quote = "\"Dỗi thì dỗi nhưng vẫn phải về đúng quỹ đạo của nhau thôi. Cảm ơn vì đã luôn nhường nhịn cái sự bướng bỉnh của tớ.\"",
  stage3Accent = "#f472b6",
  stage3Background = "#05020a",
  stage3MediaType = "",
  stage3MediaUrl = "https://www.w3schools.com/html/mov_bbb.mp4",
  stage3NextButton = "Tiếp tục hành trình",
  stage2Subtitle = "Từ trường đang nhiễu loạn vì vụ cãi nhau tuần trước. Hãy kéo các vì sao về đúng quỹ đạo (phía dưới)!",
  stage2Title = "Quỹ Đạo Hỗn Loạn",
  stage3MusicLabel = "♪ Lofi Piano đang phát",
  stage3Subtitle = "Chạm và kéo một đường qua 5 điểm sáng không nhấc tay.",
  stage3Title = "Chòm Sao Thanh Âm",
  stage4FallbackButton = "Bấm vào đây nếu Mic lỗi",
  stage4Accent = "#f472b6",
  stage4Background = "#05020a",
  stage4ImageUrl = "",
  stage4MediaType = "",
  stage4MicInstruction = "Và thổi vào Microphone để bay lớp bụi trần...",
  stage4Prompt = "Nhanh tay bắt lấy một vì sao ước nguyện!",
  stage4RevealBody = "\"Từ khoảnh khắc va chạm đầu tiên, đến những lúc dỗi hờn, chúng ta đã cùng nhau tạo nên một vũ trụ tuyệt đẹp.\n\nTớ mong ngôi sao này sẽ mang đến cho cậu sự bình yên.\"",
  stage4RevealButton = "Đón nhận",
  stage4RevealTitle = "Hãy nhắm mắt, ước một điều",
  anniversaryCode = "1402",
  generalAudioUrl,
  stage3AudioUrl,
  hideNavigation,
  fullScreen,
  onResponse,
}: {
  anniversaryCode?: string;
  connectInstruction?: string;
  finalCta?: string;
  finalTitle?: string;
  finalSubtitle?: string;
  giftAcceptButton?: string;
  giftAcceptedBody?: string;
  giftAcceptedTitle?: string;
  giftBackButton?: string;
  giftBody?: string;
  giftDeclineButton?: string;
  giftDeclinedBody?: string;
  giftDeclinedTitle?: string;
  giftRescheduleButton?: string;
  giftTitle?: string;
  proposedDate?: string;
  contractBody?: string;
  contractHoldInstruction?: string;
  contractRejectButton?: string;
  contractTitle?: string;
  finalAccent?: string;
  finalBackground?: string;
  introSubtitle?: string;
  introTitle?: string;
  stage1Accent?: string;
  stage1Background?: string;
  stage1ImageUrl?: string;
  stage1MediaType?: string;
  stage1RevealBody?: string;
  stage1RevealButton?: string;
  stage1RevealTitle?: string;
  stage2Accent?: string;
  stage2Background?: string;
  stage2ImageCaption?: string;
  stage2ImageUrl?: string;
  stage2MediaType?: string;
  stage2NextButton?: string;
  stage2Quote?: string;
  stage3Accent?: string;
  stage3Background?: string;
  stage3MediaType?: string;
  stage3MediaUrl?: string;
  stage3NextButton?: string;
  stage2Subtitle?: string;
  stage2Title?: string;
  stage3MusicLabel?: string;
  stage3Subtitle?: string;
  stage3Title?: string;
  stage4Accent?: string;
  stage4Background?: string;
  stage4FallbackButton?: string;
  stage4ImageUrl?: string;
  stage4MediaType?: string;
  stage4MicInstruction?: string;
  stage4Prompt?: string;
  stage4RevealBody?: string;
  stage4RevealButton?: string;
  stage4RevealTitle?: string;
  senderName?: string;
  recipientName?: string;
  compact?: boolean;
  constellationPoints?: {x: number, y: number}[];
  constellationMessages?: string[];
  generalAudioUrl?: string;
  stage3AudioUrl?: string;
  hideNavigation?: boolean;
  fullScreen?: boolean;
  onResponse?: (response: { answer: string; date?: string; audioDataUrl?: string }) => void;
}) {
  const [stage, setStage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const generalAudioRef = useRef<HTMLAudioElement>(null);
  const stage3AudioRef = useRef<HTMLAudioElement>(null);
  const [recordedAudio, setRecordedAudio] = useState<string | undefined>();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    
    if (stage === 3 && stage3AudioUrl) {
      if (generalAudioRef.current) {
        generalAudioRef.current.volume = 0;
      }
      if (stage3AudioRef.current) {
        stage3AudioRef.current.play().catch(() => {});
        stage3AudioRef.current.volume = 1;
      }
    } else if (stage === 4) {
      if (stage3AudioRef.current) {
        stage3AudioRef.current.pause();
      }
      if (generalAudioRef.current) {
        generalAudioRef.current.volume = 0.2;
        generalAudioRef.current.play().catch(() => {});
      }
    } else {
      if (stage3AudioRef.current) {
        stage3AudioRef.current.pause();
      }
      if (generalAudioRef.current) {
        generalAudioRef.current.volume = 1;
        generalAudioRef.current.play().catch(() => {});
      }
    }
  }, [stage, mounted, stage3AudioUrl]);

  return (
    <div className={`template-preview-surface relative ${fullScreen ? "w-full h-full" : compact ? "min-h-56 h-full" : "min-h-[640px] h-full sm:h-[800px] sm:max-h-[85vh] sm:rounded-2xl border border-white/10"} w-full overflow-hidden text-white font-sans selection:bg-pink-500/30 transition-colors duration-1000`} style={{ background: stage === 5 ? finalBackground : [stage1Background, stage2Background, stage3Background, stage4Background][stage - 1] ?? "#0a0514" }}>
      {mounted && (
        <>
          {generalAudioUrl && <audio ref={generalAudioRef} src={generalAudioUrl} loop className="hidden" />}
          {stage3AudioUrl && <audio ref={stage3AudioRef} src={stage3AudioUrl} className="hidden" />}
          {/* Nền vũ trụ chung (Dạng chấm trắng mượt mà) */}
          {stage > 1 && stage < 5 && (
            <div className="absolute inset-0 pointer-events-none" style={{ background: [stage1Background, stage2Background, stage3Background, stage4Background][stage - 1] ?? "#05020a" }}>
               {Array.from({ length: 50 }).map((_, i) => (
                 <motion.div key={`bgstar-${i}`}
                   className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_#fff]"
                   initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: Math.random() }}
                   animate={{ opacity: [0.1, 0.8, 0.1], scale: [0.8, 1.2, 0.8], x: `+=${(Math.random() - 0.5) * 50}` }}
                   transition={{ duration: 4 + Math.random() * 5, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
                 />
               ))}
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15)_0%,transparent_100%)] pointer-events-none" />
            </div>
          )}

          <AnimatePresence mode="wait">
            {stage === 1 && <Stage1Telescope accent={stage1Accent} connectInstruction={connectInstruction} imageUrl={stage1ImageUrl} mediaType={stage1MediaType} introSubtitle={introSubtitle} introTitle={introTitle} key="stage1" onNext={() => setStage(2)} revealBody={stage1RevealBody} revealButton={stage1RevealButton} revealTitle={stage1RevealTitle} />}
            {stage === 2 && <Stage2Orbit accent={stage2Accent} imageCaption={stage2ImageCaption} imageUrl={stage2ImageUrl} mediaType={stage2MediaType} nextButton={stage2NextButton} key="stage2" onNext={() => setStage(3)} quote={stage2Quote} subtitle={stage2Subtitle} title={stage2Title} />}
            {stage === 3 && <Stage3InfinityVoice accent={stage3Accent} key="stage3" mediaType={stage3MediaType} mediaUrl={stage3MediaUrl} musicLabel={stage3MusicLabel} nextButton={stage3NextButton} points={constellationPoints} messages={constellationMessages} onNext={() => setStage(4)} subtitle={stage3Subtitle} title={stage3Title} />}
            {stage === 4 && <Stage4MeteorMic accent={stage4Accent} fallbackButton={stage4FallbackButton} imageUrl={stage4ImageUrl} mediaType={stage4MediaType} key="stage4" micInstruction={stage4MicInstruction} onNext={() => setStage(5)} prompt={stage4Prompt} revealBody={stage4RevealBody} revealButton={stage4RevealButton} revealTitle={stage4RevealTitle} onRecord={(url) => setRecordedAudio(url)} />}
            {stage === 5 && <Stage5Supernova contractBody={contractBody} contractHoldInstruction={contractHoldInstruction} contractRejectButton={contractRejectButton} contractTitle={contractTitle} finalAccent={finalAccent} finalBackground={finalBackground} finalCta={finalCta} finalSubtitle={finalSubtitle} finalTitle={finalTitle} giftAcceptButton={giftAcceptButton} giftAcceptedBody={giftAcceptedBody} giftAcceptedTitle={giftAcceptedTitle} giftBackButton={giftBackButton} giftBody={giftBody} giftDeclineButton={giftDeclineButton} giftDeclinedBody={giftDeclinedBody} giftDeclinedTitle={giftDeclinedTitle} giftRescheduleButton={giftRescheduleButton} giftTitle={giftTitle} key="stage5" onResponse={(answer, date) => onResponse?.({ answer, date, audioDataUrl: recordedAudio })} proposedDate={proposedDate} />}
          </AnimatePresence>
          {!compact && !hideNavigation ? (
            <div className="absolute bottom-4 left-4 right-4 z-[80] flex items-center justify-between gap-3 rounded-full border border-white/15 bg-black/45 p-2 backdrop-blur-xl">
              <button
                className="preview-nav-button rounded-full border border-white/12 bg-white/10 px-5 py-3 text-sm font-bold text-white disabled:opacity-40"
                disabled={stage <= 1}
                onClick={() => setStage((current) => Math.max(1, current - 1))}
                type="button"
              >
                Lùi
              </button>
              <span className="preview-nav-label text-xs font-semibold text-white/70">Đoạn {stage}/5</span>
              <button
                className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 text-sm font-bold text-white disabled:opacity-40"
                disabled={stage >= 5}
                onClick={() => setStage((current) => Math.min(5, current + 1))}
                type="button"
              >
                Tiếp
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

// ================= THAO TÁC 1: ỐNG KÍNH VIỄN VỌNG =================
function Stage1Telescope({
  accent,
  connectInstruction,
  imageUrl,
  mediaType,
  introSubtitle,
  introTitle,
  onNext,
  revealBody,
  revealButton,
  revealTitle,
}: {
  accent: string;
  connectInstruction: string;
  imageUrl: string;
  mediaType?: string;
  introSubtitle: string;
  introTitle: string;
  onNext: () => void;
  revealBody: string;
  revealButton: string;
  revealTitle: string;
}) {
  const [found, setFound] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [mrBeanShrink, setMrBeanShrink] = useState(false);
  const [mrBeanPos, setMrBeanPos] = useState({ x: 0, y: 0 });
  const [showReveal, setShowReveal] = useState(false);
  const [targetPercent, setTargetPercent] = useState({ x: 0.74, y: 0.24 });
  const [canScan, setCanScan] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const zones = [
      { x: 0.25, y: 0.25 },
      { x: 0.75, y: 0.25 },
      { x: 0.25, y: 0.75 },
      { x: 0.75, y: 0.75 },
      { x: 0.25, y: 0.5 },
      { x: 0.75, y: 0.5 },
    ];
    const zone = zones[Math.floor(Math.random() * zones.length)];
    setTargetPercent({
      x: zone.x + (Math.random() - 0.5) * 0.08,
      y: zone.y + (Math.random() - 0.5) * 0.08,
    });
    const timer = window.setTimeout(() => setCanScan(true), 600);
    return () => window.clearTimeout(timer);
  }, []);

  const revealTarget = (point?: { x: number; y: number }) => {
    if (found || !canScan) return;
    const rect = containerRef.current?.getBoundingClientRect();
    setFound(true);
    if (point && rect) {
      setMrBeanPos({ x: point.x - rect.left, y: point.y - rect.top });
    } else if (rect) {
      setMrBeanPos({ x: rect.width * targetPercent.x, y: rect.height * targetPercent.y });
    }
    if (navigator.vibrate) navigator.vibrate([60, 40, 160]);
    setTimeout(() => setDrawing(true), 120);
    setTimeout(() => setMrBeanShrink(true), 1700);
    setTimeout(() => setShowReveal(true), 2600);
  };

  const handleDrag = (e: any, info: any) => {
    if (found || !canScan) return;
    const rect = containerRef.current?.getBoundingClientRect();
    const lensRect = lensRef.current?.getBoundingClientRect();
    if (!rect || !lensRect) return;

    const targetX = rect.left + rect.width * targetPercent.x;
    const targetY = rect.top + rect.height * targetPercent.y;
    
    const lensCenterX = lensRect.left + lensRect.width / 2;
    const lensCenterY = lensRect.top + lensRect.height / 2;

    const dist = Math.hypot(lensCenterX - targetX, lensCenterY - targetY);

    if (dist < Math.max(70, rect.width * 0.22)) {
      revealTarget({ x: lensCenterX, y: lensCenterY });
    }
  };

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden z-10 flex flex-col items-center justify-center"
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
      ref={containerRef}
    >
      
      {/* Dòng chữ hướng dẫn - Ẩn đi khi bắt đầu thu nhỏ Mr Bean */}
      {!showReveal && (
        <motion.div 
          animate={{ opacity: mrBeanShrink ? 0 : 1 }}
          className="absolute inset-0 flex flex-col items-center justify-between px-5 pb-24 pt-10 pointer-events-none z-50"
        >
          {introTitle || introSubtitle ? (
            <div className="max-w-sm rounded-3xl border border-white/15 bg-black/35 p-5 text-center backdrop-blur-xl">
              {introTitle ? <h2 className="text-2xl font-black text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.35)]">{introTitle}</h2> : null}
              {introSubtitle ? <p className="mt-2 text-sm leading-6 text-white/70">{introSubtitle}</p> : null}
            </div>
          ) : (
            <div />
          )}
          <p className="text-white animate-pulse text-lg font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] px-6 py-2 bg-black/30 rounded-full backdrop-blur-md border border-white/20">
            {connectInstruction}
          </p>
        </motion.div>
      )}

      {/* Chòm sao gợi ý nằm ở vị trí mục tiêu */}
      {!showReveal && (
        <button
          aria-label="Vùng chòm sao"
          className="absolute z-40 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
          onClick={() => revealTarget()}
          style={{ left: `${targetPercent.x * 100}%`, top: `${targetPercent.y * 100}%` }}
          type="button"
        >
          <IconStar className="absolute left-5 top-4 h-3 w-3 text-pink-300" />
          <IconStar className="absolute left-16 top-8 h-4 w-4 text-pink-100" />
          <IconStar className="absolute left-9 top-16 h-3 w-3 text-pink-300" />
        </button>
      )}

      {/* Kính viễn vọng */}
      <AnimatePresence>
        {!showReveal && (
          <motion.div 
            ref={lensRef}
            drag={!found} 
            dragConstraints={containerRef}
            dragElastic={0.1}
            dragMomentum={false}
            onDrag={handleDrag}
            animate={mrBeanShrink ? { width: 0, height: 0, borderWidth: 0, boxShadow: "0 0 0 9999px rgba(0,0,0,1)" } : found ? { width: 224, height: 224, borderWidth: 10, scale: [1, 1.03, 0.98, 1.04, 1] } : { width: 224, height: 224, borderWidth: 10 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="rounded-full border-[#2a1b3d] shadow-[0_0_0_9999px_rgba(10,5,20,0.98)] flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ cursor: found ? 'default' : 'grab' }}
          >
            <div className="absolute inset-0 rounded-full border border-pink-500/30 shadow-[inset_0_0_50px_rgba(236,72,153,0.3)]" />
            <div className="w-full h-[1px] bg-red-500/30 absolute top-1/2" />
            <div className="h-full w-[1px] bg-red-500/30 absolute left-1/2" />
            {found && !mrBeanShrink ? (
              <motion.div
                className="relative z-40 grid h-28 w-28 place-items-center"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={drawing ? {
                  opacity: [0, 1, 1, 0],
                  rotate: [-8, 8, -10, 10, -6, 6, 0],
                  scale: [0.55, 1, 1.15, 1.35],
                  x: [-8, 8, -7, 7, -4, 4, 0],
                } : { opacity: 1, scale: 1 }}
                transition={{ duration: 1.45, ease: "easeInOut" }}
              >
                <IconStar className="h-24 w-24 text-pink-300 drop-shadow-[0_0_28px_rgba(244,114,182,0.95)]" />
                {drawing ? (
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 18 }).map((_, index) => {
                      const angle = (Math.PI * 2 * index) / 18;
                      return (
                        <motion.span
                          className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-pink-200 shadow-[0_0_12px_rgba(251,207,232,0.95)]"
                          key={index}
                          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                          animate={{
                            opacity: [0, 1, 0],
                            x: Math.cos(angle) * 95,
                            y: Math.sin(angle) * 95,
                            scale: [0, 1.1, 0],
                          }}
                          transition={{ delay: 0.65, duration: 0.7, ease: "easeOut" }}
                        />
                      );
                    })}
                  </div>
                ) : null}
              </motion.div>
            ) : null}
            
            {/* Vẽ ngôi sao bên trong kính khi đã lock mục tiêu */}
            {false && drawing && (
              <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_20px_#f472b6] z-30" viewBox="0 0 100 100">
                 <motion.polygon 
                   points="50,15 61,40 88,40 66,57 74,82 50,66 26,82 34,57 12,40 39,40"
                   fill="none" stroke="#f472b6" strokeWidth="2"
                   initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }}
                 />
              </svg>
            )}
            {found && !drawing && <p className="absolute -top-10 text-pink-400 font-bold animate-pulse whitespace-nowrap">Đang khóa mục tiêu...</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Màn hình Sáng lên & Ảnh bên trong ngôi sao */}
      <AnimatePresence>
        {showReveal && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center p-6 overflow-hidden z-30">
            <motion.div
              className="absolute inset-0 z-[70] bg-black pointer-events-none"
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 1, 0] }}
              transition={{ duration: 1.2, times: [0, 0.35, 1], ease: "easeInOut" }}
            />
            
            {/* Lớp phủ Mr Bean Explosion (Lỗ tròn mở rộng ra từ chấm nhỏ) */}
            <motion.div 
              className="absolute rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,1)] z-50 pointer-events-none"
              initial={{ width: 0, height: 0, left: mrBeanPos.x, top: mrBeanPos.y, x: "-50%", y: "-50%" }}
              animate={{ width: 3000, height: 3000, boxShadow: "0 0 0 9999px rgba(0,0,0,0)" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Tự tạo nền vũ trụ CSS */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0a0514] to-[#0a0514] opacity-80" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-60 mix-blend-screen" />

            {/* Confetti Particles bay ra TỪ TRUNG TÂM (chỗ cái ảnh) */}
            <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
              {Array.from({ length: 60 }).map((_, i) => {
                const angle = Math.random() * Math.PI * 2;
                const dist = 100 + Math.random() * 300; // Bay tỏa ra từ tâm
                return (
                  <motion.div key={i} className="absolute w-2 h-2 rounded-full"
                    style={{ backgroundColor: ['#f472b6', '#60a5fa', '#34d399', '#fbbf24', '#c084fc'][i % 5] }}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{ 
                      x: Math.cos(angle) * dist, 
                      y: Math.sin(angle) * dist, 
                      scale: [0, Math.random() * 2 + 1, 0],
                      opacity: [1, 1, 0],
                      rotate: Math.random() * 360
                    }}
                    transition={{ duration: 2.5 + Math.random() * 2, ease: "easeOut" }}
                  />
                )
              })}
            </div>

            <motion.div className="relative z-10 flex items-center justify-center mb-8" 
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
            >
              {/* Vòng Glow rực rỡ đằng sau */}
              <div className="absolute w-64 h-64 bg-pink-500/20 rounded-full blur-[50px] animate-pulse" />
              
              {/* Ảnh được CẮT (Clip) thành hình Ngôi Sao */}
              <motion.div className="relative z-10 w-64 h-64"
                style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}
                initial={{ scale: 0, rotate: -180 }} 
                animate={{ scale: 1, rotate: 0 }} 
                transition={{ duration: 2, type: "spring", bounce: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <MediaFrame alt="Ảnh hoặc video kỷ niệm" mediaType={mediaType} src={imageUrl || "https://picsum.photos/id/1025/400/400"} />
              </motion.div>
              
              {/* Viền Ngôi sao đè lên trên cho nét */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_15px_#f472b6] z-20" viewBox="0 0 100 100">
                 <polygon 
                   points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"
                   fill="none" stroke="#f472b6" strokeWidth="1.5"
                 />
              </svg>
            </motion.div>

            {/* Thông báo căn giữa màn hình */}
            <motion.div className="w-full max-w-sm bg-black/60 backdrop-blur-2xl border border-pink-500/30 p-8 rounded-3xl text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20"
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1, duration: 1.5 }}
            >
              <h3 className="text-2xl font-black mb-4 drop-shadow-md tracking-wide" style={{ color: accent }}>{revealTitle}</h3>
              <p className="text-white/90 leading-relaxed text-[15px] font-serif">
                {revealBody}
              </p>
              <motion.button onClick={onNext} 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-[0_5px_20px_rgba(236,72,153,0.5)] w-full uppercase tracking-widest text-sm"
              >
                {revealButton}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ================= THAO TÁC 2: QUỸ ĐẠO HỖN LOẠN =================
function Stage2Orbit({
  accent,
  imageCaption,
  imageUrl,
  mediaType,
  nextButton,
  onNext,
  quote,
  subtitle,
  title,
}: {
  accent: string;
  imageCaption: string;
  imageUrl: string;
  mediaType?: string;
  nextButton: string;
  onNext: () => void;
  quote: string;
  subtitle: string;
  title: string;
}) {
  const [placed, setPlaced] = useState<number[]>([]);
  const [evasiveJumps, setEvasiveJumps] = useState(0);
  const [evasivePos, setEvasivePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (e: any, info: any, id: number) => {
    if (info.offset.y > 50) { // Đã kéo xuống khu vực slots
      if (!placed.includes(id)) {
        setPlaced([...placed, id]);
        if (navigator.vibrate) navigator.vibrate(50);
      }
    }
  };

  const handleEvasiveHover = () => {
    if (evasiveJumps < 3 && !placed.includes(2)) {
      setEvasiveJumps(j => j + 1);
      setEvasivePos({ x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200 });
    }
  };

  const done = placed.length === 3;

  return (
    <motion.div ref={containerRef} className="absolute inset-0 flex flex-col items-center justify-between p-6 z-10"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="mt-10 text-center">
        <h3 className="text-2xl font-bold mb-2 drop-shadow-md" style={{ color: accent }}>{title}</h3>
        <p className="text-sm text-white/70">{subtitle}</p>
      </div>

      <div className="relative w-full h-64 flex items-center justify-center">
        {!done && (
          <>
            {/* Sao bình thường 1 */}
            {!placed.includes(0) && (
              <motion.div drag dragConstraints={containerRef} dragElastic={0.1} onDragEnd={(e, info) => handleDragEnd(e, info, 0)} className="absolute top-10 left-10 w-12 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing z-50">
                <IconStar className="w-8 h-8 text-blue-300 drop-shadow-[0_0_15px_#93c5fd]" />
              </motion.div>
            )}
            {/* Sao bình thường 2 */}
            {!placed.includes(1) && (
              <motion.div drag dragConstraints={containerRef} dragElastic={0.1} onDragEnd={(e, info) => handleDragEnd(e, info, 1)} className="absolute top-20 right-10 w-12 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing z-50">
                <IconStar className="w-8 h-8 text-blue-300 drop-shadow-[0_0_15px_#93c5fd]" />
              </motion.div>
            )}
            {/* Sao bướng bỉnh */}
            {!placed.includes(2) && (
              <motion.div
                drag={evasiveJumps >= 3} 
                dragConstraints={containerRef} dragElastic={0.1} 
                onDragEnd={(e, info) => handleDragEnd(e, info, 2)} 
                onHoverStart={handleEvasiveHover}
                onPointerDown={handleEvasiveHover} // Cho mobile
                animate={evasiveJumps < 3 ? { x: evasivePos.x, y: evasivePos.y } : undefined}
                className={`absolute bottom-10 left-1/2 -ml-6 w-12 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing z-50 ${evasiveJumps < 3 ? 'transition-transform duration-300' : ''}`}
              >
                <IconStar className={`w-8 h-8 ${evasiveJumps < 3 ? 'text-red-400 drop-shadow-[0_0_15px_#f87171] animate-pulse' : 'text-blue-300 drop-shadow-[0_0_15px_#93c5fd]'}`} />
                {evasiveJumps < 3 && <span className="absolute -top-6 text-xs text-red-300 whitespace-nowrap">Bướng bỉnh!</span>}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Target Slots */}
      <div className="w-full flex justify-center gap-6 mb-20 relative">
        {[0, 1, 2].map((id) => (
          <div key={id} className={`w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center transition-colors ${placed.includes(id) ? 'border-blue-400 bg-blue-500/20' : 'border-white/20 bg-white/5'}`}>
            {placed.includes(id) && <IconStar className="w-8 h-8 text-blue-300 drop-shadow-[0_0_20px_#93c5fd] scale-125" />}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {done && (
          <motion.div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
          >
            <motion.div 
              className="w-64 h-80 rounded-2xl border border-white/20 shadow-[0_0_50px_rgba(147,197,253,0.3)] bg-white/10 p-3 pb-12 relative cursor-pointer"
              initial={{ rotate: 2 }}
              whileHover={{ scale: 1.05, rotate: 0, boxShadow: "0 0 80px rgba(147,197,253,0.6)", zIndex: 50 }}
            >
              <div className="w-full h-full rounded-xl overflow-hidden relative">
                <motion.div
                  className="h-full w-full opacity-80"
                  whileHover={{ scale: 1.1, filter: "grayscale(0%)" }}
                  initial={{ filter: "grayscale(100%)" }}
                  transition={{ duration: 0.4 }}
                >
                  <MediaFrame alt="Ảnh hoặc video làm hòa" mediaType={mediaType} src={imageUrl || "https://picsum.photos/id/1014/400/500"} />
                </motion.div>
              </div>
              <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
                 <p className="font-serif text-blue-200 font-bold">{imageCaption}</p>
              </div>
            </motion.div>
            <p className="mt-8 text-center text-white/90 leading-relaxed font-serif italic max-w-sm">
              {quote}
            </p>
            <button onClick={onNext} className="mt-8 px-8 py-3 rounded-full bg-blue-500/20 border border-blue-400 text-blue-200 font-bold hover:bg-blue-500/40 transition">
              {nextButton}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ================= THAO TÁC 3: CHÒM SAO THANH ÂM (VÔ CỰC) =================
function Stage3InfinityVoice({
  accent,
  mediaType,
  mediaUrl,
  musicLabel,
  nextButton,
  onNext,
  points,
  messages,
  subtitle,
  title,
}: {
  accent: string;
  mediaType?: string;
  mediaUrl: string;
  musicLabel: string;
  nextButton: string;
  onNext: () => void;
  points: {x: number, y: number}[];
  messages: string[];
  subtitle: string;
  title: string;
}) {
  const [activePoints, setActivePoints] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showVideo, setShowVideo] = useState(false);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (showVideo) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const nextTargetIdx = activePoints.length;
    if (nextTargetIdx < points.length) {
      const target = points[nextTargetIdx];
      const dist = Math.sqrt(Math.pow(x - target.x, 2) + Math.pow(y - target.y, 2));
      if (dist < 15) { // Bán kính hit box
        const newArr = [...activePoints, nextTargetIdx];
        setActivePoints(newArr);
        if (navigator.vibrate) navigator.vibrate(30);
        if (newArr.length === points.length) {
           setTimeout(() => setShowVideo(true), 1500);
        }
      }
    }
  };
  const handlePointerDown = (e: React.PointerEvent) => {
    if (activePoints.length === 0) {
      handlePointerMove(e);
    }
  };

  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center z-10"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute top-10 text-center">
        <h3 className="text-2xl font-bold mb-2" style={{ color: accent }}>{title}</h3>
        <p className="text-sm text-white/60">{subtitle}</p>
        <p className="text-xs text-pink-300 mt-2 animate-pulse">{musicLabel}</p>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full max-w-sm h-64 mt-20 touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]">
          {activePoints.map((idx, i) => {
            if (i === 0) return null;
            const p1 = points[activePoints[i - 1]];
            const p2 = points[idx];
            return (
              <motion.line key={i} x1={`${p1.x}%`} y1={`${p1.y}%`} x2={`${p2.x}%`} y2={`${p2.y}%`} stroke="#f472b6" strokeWidth="4" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }}
              />
            );
          })}
        </svg>

        {points.map((p, i) => (
          <div key={i} className={`absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-transform ${activePoints.includes(i) ? 'scale-125' : 'animate-pulse'}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <div className={`w-3 h-3 rounded-full ${activePoints.includes(i) ? 'bg-pink-400 shadow-[0_0_20px_#f472b6]' : 'bg-white/40'}`} />
          </div>
        ))}
      </div>

      <div className="h-20 flex items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          {activePoints.length > 1 && activePoints.length <= points.length && (
            <motion.p 
              key={activePoints.length}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="text-xl font-serif italic text-pink-200 drop-shadow-md"
            >
              "{messages[activePoints.length - 2]}"
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showVideo && (
          <motion.div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
          >
            <motion.div className="w-full max-w-sm rounded-3xl overflow-hidden border-2 border-pink-500/50 shadow-[0_0_50px_rgba(236,72,153,0.3)] mb-8"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
            >
              {/* Real Video Player */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                <MediaFrame alt="Ảnh hoặc video sau khi nối chòm sao" mediaType={mediaType || "video/mp4"} src={mediaUrl || "https://www.w3schools.com/html/mov_bbb.mp4"} />
              </div>
            </motion.div>
            <button onClick={onNext} className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold transition">
              {nextButton}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ================= THAO TÁC 4: MƯA SAO BĂNG & MICRO =================
function Stage4MeteorMic({
  accent,
  fallbackButton,
  imageUrl,
  mediaType,
  micInstruction,
  onNext,
  prompt,
  revealBody,
  revealButton,
  revealTitle,
  onRecord,
}: {
  accent: string;
  fallbackButton: string;
  imageUrl: string;
  mediaType?: string;
  micInstruction: string;
  onNext: () => void;
  prompt: string;
  revealBody: string;
  revealButton: string;
  revealTitle: string;
  onRecord?: (audioDataUrl: string) => void;
}) {
  const [caught, setCaught] = useState(false);
  const [blown, setBlown] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startMicListener = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          const url = String(reader.result);
          onRecord?.(url);
        };
        reader.readAsDataURL(blob);
      };

      recorder.start();

      setTimeout(() => {
        if (recorder.state === "recording") {
          setBlown(true);
          recorder.stop();
          stream.getTracks().forEach(t => t.stop());
          if (audioContextRef.current) audioContextRef.current.close();
        }
      }, 30000);

      let blownFrames = 0;
      const checkVolume = () => {
        if (blown) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for(let i = 0; i < bufferLength; i++) { sum += dataArray[i]; }
        const avg = sum / bufferLength;
        
        if (avg > 70) { 
          blownFrames++;
        } else {
          blownFrames = 0;
        }

        // Require 15 consecutive frames (about 250ms) of high volume
        if (blownFrames > 15) { 
          setBlown(true);
          recorder.stop();
          stream.getTracks().forEach(t => t.stop());
          if (audioContextRef.current) audioContextRef.current.close();
        } else {
          requestAnimationFrame(checkVolume);
        }
      };
      checkVolume();
    } catch (err) {
      console.warn("Mic access denied.", err);
    }
  };

  const handleCatch = () => {
    setCaught(true);
    if (navigator.vibrate) navigator.vibrate(50);
    startMicListener();
  };

  return (
    <motion.div className="absolute inset-0 flex items-center justify-center z-10 overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      {/* Background Meteors (Luôn hiện để tạo không khí) */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => {
          const isBlue = i % 5 === 0; // Những cái chỉ định thì màu xanh nước sáng
          return (
            <motion.div key={`bg-meteor-${i}`}
              className={`absolute w-32 h-[2px] rounded-full ${isBlue ? 'bg-gradient-to-r from-transparent to-cyan-300 shadow-[0_0_15px_#22d3ee]' : 'bg-gradient-to-r from-transparent to-white/60'}`}
              style={{ rotate: 135, left: `${Math.random() * 200}%`, top: -300 }}
              animate={{ x: -2000, y: 2000, opacity: [0, 1, 0] }}
              transition={{ duration: 1.5 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 5, ease: "linear" }}
            />
          );
        })}
      </div>

      {!caught ? (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.p className="absolute top-32 w-full text-center text-cyan-200 font-bold text-lg drop-shadow-md z-20" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}>
            {prompt}
          </motion.p>
          <motion.button 
            onClick={handleCatch}
            whileHover={{ scale: 1.2 }}
            className="absolute top-0 right-0 w-48 h-10 flex items-center justify-center outline-none z-30 pointer-events-auto"
            animate={{ x: [500, -1000], y: [-500, 1000] }}
            transition={{ duration: 2.5, ease: "linear", repeat: Infinity, repeatDelay: 1.5 }}
            style={{ rotate: 135 }}
          >
            <div className="w-40 h-[3px] bg-gradient-to-r from-transparent to-cyan-300" />
            <div className="w-10 h-10 bg-cyan-300 rounded-full shadow-[0_0_50px_#22d3ee] flex-shrink-0" />
          </motion.button>
        </div>
      ) : (
        <motion.div className="flex flex-col items-center w-full px-6" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5, type: "spring", bounce: 0.5 }}>
          {!blown ? (
            <motion.div className="text-center relative"
              animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-56 h-56 mx-auto rounded-full border-2 border-pink-300/30 bg-white/5 backdrop-blur-2xl flex flex-col items-center justify-center shadow-[0_0_80px_rgba(244,114,182,0.2)] mb-10 overflow-hidden relative group">
                 {/* Cố định IconStar vào chuẩn giữa */}
                 <div className="absolute inset-0 flex items-center justify-center z-20">
                   <IconStar className="w-20 h-20 text-pink-100 drop-shadow-[0_0_25px_#fbcfe8] animate-[pulse_3s_infinite]" />
                 </div>
                 {imageUrl ? (
                   <MediaFrame
                     alt="Ảnh hoặc video đoạn sao băng"
                     className="absolute inset-0 opacity-50"
                     mediaType={mediaType}
                     src={imageUrl}
                   />
                 ) : null}
                 {/* Lớp bụi trần */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-80 mix-blend-screen z-30 transition-opacity duration-1000 group-hover:opacity-40" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              </div>
              <h3 className="text-2xl font-black text-pink-200 drop-shadow-lg mb-2">{revealTitle}</h3>
              <p className="text-[15px] text-white/80 leading-relaxed">
                <span style={{ color: accent }}>{micInstruction}</span>
              </p>
              <button onClick={() => setBlown(true)} className="mt-10 px-6 py-2 text-xs text-white/50 border border-white/20 rounded-full bg-white/5 hover:bg-white/10 transition">
                {fallbackButton}
              </button>
            </motion.div>
          ) : (
            <motion.div className="relative flex flex-col items-center w-full max-w-sm" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2, ease: "easeOut" }}>
              {/* Particles blowing away mượt mà */}
              <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
                {Array.from({ length: 80 }).map((_, i) => (
                  <motion.div key={i} className="absolute w-1 h-1 bg-white/80 rounded-full top-1/2 left-1/2"
                    animate={{ 
                      x: Math.random() * 800 - 400, 
                      y: -Math.random() * 800,
                      opacity: [1, 0],
                      scale: Math.random() * 3
                    }}
                    transition={{ duration: 3 + Math.random() * 2, ease: "easeOut" }}
                  />
                ))}
              </div>
              
              {/* Bức Tâm Thư Reveal - rung nhẹ trước khi hiện */}
              <motion.div className="w-full bg-black/40 backdrop-blur-3xl p-8 rounded-3xl border border-pink-500/30 shadow-[0_30px_60px_rgba(0,0,0,0.6)] z-10"
                initial={{ rotate: -5, scale: 0.8 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", bounce: 0.6, duration: 2, delay: 0.5 }}
                whileHover={{ y: -5, boxShadow: "0 40px 80px rgba(236,72,153,0.3)" }}
              >
                <IconStar className="w-10 h-10 mx-auto text-pink-400 mb-6 drop-shadow-[0_0_15px_#f472b6] animate-bounce" />
                <p className="font-serif text-white/90 leading-loose text-center text-lg italic">
                  {revealBody}
                </p>
                <div className="mt-10 flex justify-center">
                  <motion.button onClick={onNext} 
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="px-10 py-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 font-bold shadow-[0_10px_25px_rgba(236,72,153,0.5)] transition text-white uppercase tracking-wider"
                  >
                    {revealButton}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// ================= STAGE 5: SIÊU TÂN TINH (CLIMAX) =================
function Stage5Supernova({
  contractBody = "\"Thời hạn dùng thử trái tim tớ đã hết.\n\nCậu có muốn gia hạn gói Premium (yêu thương trọn đời) không?\"",
  contractHoldInstruction = "Giữ vân tay 3 giây",
  contractRejectButton = "Xem xét lại",
  contractTitle = "Bản Hợp Đồng",
  finalAccent = "#ec4899",
  finalBackground = "#fb7185",
  finalCta = "Nhận Quà Đi Chơi",
  finalSubtitle = "Cảm ơn vì đã là ngoại lệ tuyệt vời nhất của nhau.",
  finalTitle = "Happy Valentine's Day!",
  giftAcceptButton = "Lên đồ thôi!",
  giftAcceptedBody = "Lịch hẹn đã được lưu lại thành công.\nHẹn gặp cậu vào ngày hôm đó nhé!",
  giftAcceptedTitle = "Chốt đơn!",
  giftBackButton = "Quay lại",
  giftBody = "Cuối tuần này, cùng nhau đi dạo phố và uống chút gì đó ấm áp nhé? Tớ biết một quán view rất xinh!",
  giftDeclineButton = "Để khi khác",
  giftDeclinedBody = "Chọn một ngày cậu rảnh để chúng mình set kèo lại nhé!",
  giftDeclinedTitle = "Vậy hẹn ngày khác nha!",
  giftRescheduleButton = "Gửi lịch hẹn",
  giftTitle = "Thư Mời Hẹn Hò",
  proposedDate,
  onNext,
  onResponse,
}: {
  contractBody?: string;
  contractHoldInstruction?: string;
  contractRejectButton?: string;
  contractTitle?: string;
  finalAccent?: string;
  finalBackground?: string;
  finalCta?: string;
  finalSubtitle?: string;
  finalTitle?: string;
  giftAcceptButton?: string;
  giftAcceptedBody?: string;
  giftAcceptedTitle?: string;
  giftBackButton?: string;
  giftBody?: string;
  giftDeclineButton?: string;
  giftDeclinedBody?: string;
  giftDeclinedTitle?: string;
  giftRescheduleButton?: string;
  giftTitle?: string;
  proposedDate?: string;
  onNext?: () => void;
  onResponse?: (answer: string, date?: string) => void;
}) {
  const [rejectFallen, setRejectFallen] = useState(false);
  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [exploded, setExploded] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [giftAccepted, setGiftAccepted] = useState(false);
  const [giftDeclined, setGiftDeclined] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleError, setRescheduleError] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    if (exploded) return;
    setHolding(true);
    if (navigator.vibrate) navigator.vibrate(50);
    intervalRef.current = setInterval(() => {
      setHoldProgress(p => {
        if (p >= 100) {
          clearInterval(intervalRef.current!);
          triggerExplosion();
          return 100;
        }
        if (p % 30 === 0 && navigator.vibrate) navigator.vibrate(30); // Rung theo nhịp
        return p + 2;
      });
    }, 60); // 3 seconds
  };

  const stopHold = () => {
    if (exploded) return;
    setHolding(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setHoldProgress(0);
  };

  const triggerExplosion = () => {
    if (navigator.vibrate) navigator.vibrate([300, 100, 500]);
    setExploded(true);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      {!exploded ? (
        <motion.div className="w-full max-w-sm px-6 flex flex-col items-center relative"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
        >
          {/* Scroll Hợp đồng */}
          <div className="w-full bg-[#fdf5e6] text-[#4a3b32] p-8 rounded-b-3xl rounded-t-sm shadow-2xl relative border-t-8 border-[#d4bca4]">
            <div className="absolute top-0 inset-x-0 h-full bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-50 pointer-events-none" />
            <h2 className="text-2xl font-black text-center mb-6 uppercase tracking-widest text-[#8b5a2b]">{contractTitle}</h2>
            <p className="font-serif text-lg leading-relaxed text-center mb-8 font-medium">
              {contractBody}
            </p>

            <div className="flex flex-col gap-4 relative z-10">
              <motion.button 
                onHoverStart={() => setRejectFallen(true)}
                onPointerDown={() => setRejectFallen(true)}
                animate={rejectFallen ? { y: 600, rotate: 60, opacity: 0 } : {}}
                transition={{ duration: 1, ease: "easeIn" }}
                className="w-full py-4 rounded-xl border-2 border-gray-300 text-gray-500 font-bold bg-white outline-none"
              >
                {contractRejectButton}
              </motion.button>
              
              <div className="relative mt-2">
                {/* Fingerprint area */}
                <div 
                  onPointerDown={startHold}
                  onPointerUp={stopHold}
                  onPointerLeave={stopHold}
                  className="w-24 h-24 mx-auto rounded-full border-4 border-red-500/20 bg-red-50 flex items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.3)] touch-none select-none"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
                  {/* Quét radar line */}
                  {holding && <motion.div className="absolute inset-x-0 h-1 bg-red-500 shadow-[0_0_10px_red]" animate={{ y: [-40, 40, -40] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />}
                </div>
                <p className="text-center text-xs font-bold text-red-400 mt-4 uppercase tracking-widest">{contractHoldInstruction}</p>
                
                {/* Progress Circle (around the fingerprint) */}
                <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 pointer-events-none transform -rotate-90">
                  <circle cx="48" cy="48" r="46" fill="none" stroke="rgba(239,68,68,0.1)" strokeWidth="4" />
                  <circle cx="48" cy="48" r="46" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="289" strokeDashoffset={289 - (289 * holdProgress) / 100} className="transition-all duration-75" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* SUPERNOVA EXPLOSION */
        <motion.div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
          style={{ background: finalBackground }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
        >
          {/* Flash Trắng */}
          <motion.div className="absolute inset-0 bg-white z-50 pointer-events-none" animate={{ opacity: [1, 0] }} transition={{ duration: 1.5, ease: "easeOut" }} />
          
          {/* Hàng ngàn vì sao bắn ra */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 150 }).map((_, i) => {
              const angle = Math.random() * Math.PI * 2;
              const dist = 50 + Math.random() * 500;
              return (
                <motion.div key={i} className="absolute w-2 h-2 rounded-full shadow-[0_0_10px_#fff] bg-white top-1/2 left-1/2"
                  initial={{ x: 0, y: 0, scale: 0 }}
                  animate={{ 
                    x: Math.cos(angle) * dist, 
                    y: Math.sin(angle) * dist,
                    scale: Math.random() * 2,
                    opacity: [1, 0]
                  }}
                  transition={{ duration: 2.5, ease: "easeOut", delay: Math.random() * 0.2 }}
                />
              )
            })}
          </div>

          <motion.div className="relative z-10 w-full max-w-md px-6"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: "spring", bounce: 0.5 }}
          >
            <div className="text-9xl text-white drop-shadow-[0_0_50px_rgba(255,255,255,1)] animate-pulse mb-6">
              ♥
            </div>
            
            <AnimatePresence mode="wait">
              {!showGift ? (
                <motion.div key="intro" className="bg-white/20 backdrop-blur-xl p-8 rounded-3xl border border-white/40 shadow-2xl"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }}
                >
                  <h1 className="text-3xl font-black text-white drop-shadow-lg mb-4">
                    {finalTitle}
                  </h1>
                  <p className="text-white/90 font-medium mb-8">
                    {finalSubtitle}
                  </p>
                  <button onClick={() => setShowGift(true)} className="px-8 py-4 rounded-full bg-white font-black shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform uppercase tracking-wider text-sm" style={{ color: finalAccent }}>
                    {finalCta}
                  </button>
                </motion.div>
              ) : (
                <motion.div key="gift" className="bg-white p-8 rounded-3xl shadow-2xl text-pink-600 relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: "spring", bounce: 0.6 }}
                >
                  {!giftAccepted && !giftDeclined && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                      <div className="w-20 h-20 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
                        ☕
                      </div>
                      <h2 className="text-2xl font-black mb-3 text-center">{giftTitle}</h2>
                      <p className="text-gray-600 mb-4 font-medium text-center leading-relaxed">
                        {giftBody}
                      </p>
                      {proposedDate && (
                        <div className="mb-8 inline-block w-full rounded-xl bg-pink-50 p-3 text-center text-sm font-bold text-pink-600 border border-pink-100">
                          📅 Lịch hẹn: {(() => {
                            try {
                              const d = new Date(proposedDate);
                              if (isNaN(d.getTime())) return proposedDate;
                              return new Intl.DateTimeFormat('vi-VN', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              }).format(d);
                            } catch {
                              return proposedDate;
                            }
                          })()}
                        </div>
                      )}
                      <div className="flex gap-4 justify-center">
                        <motion.button onClick={() => { setGiftDeclined(true); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 rounded-xl border-2 border-pink-100 text-pink-400 font-bold hover:bg-pink-50 hover:border-pink-200 transition whitespace-nowrap">
                          {giftDeclineButton}
                        </motion.button>
                        <motion.button onClick={() => { setGiftAccepted(true); onResponse?.("YES"); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-[0_10px_20px_rgba(244,114,182,0.4)] whitespace-nowrap">
                          {giftAcceptButton}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {giftAccepted && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }} className="text-center">
                      <div className="text-6xl mb-6 animate-bounce">🎉</div>
                      <h2 className="text-3xl font-black text-pink-500 mb-4">{giftAcceptedTitle}</h2>
                      <p className="text-gray-600 font-medium text-lg leading-relaxed">
                        {giftAcceptedBody}
                      </p>
                      {/* Thêm ít kim tuyến bay lên */}
                      <div className="absolute inset-0 pointer-events-none">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <motion.div key={i} className="absolute w-3 h-3 bg-pink-400 rounded-sm bottom-0 left-1/2"
                            animate={{ y: -400, x: (Math.random() - 0.5) * 300, rotate: Math.random() * 360, opacity: [1, 1, 0] }}
                            transition={{ duration: 2.5 + Math.random(), ease: "easeOut" }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {giftDeclined && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }} className="text-center">
                      <div className="text-6xl mb-6 animate-pulse">📅</div>
                      <h2 className="text-2xl font-black text-gray-700 mb-4">{giftDeclinedTitle}</h2>
                      <p className="text-gray-600 font-medium mb-6">
                        {giftDeclinedBody}
                      </p>
                      <input
                        type="date"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 mb-2 font-bold outline-none focus:border-pink-400 transition"
                        onChange={(event) => {
                          setRescheduleDate(event.target.value);
                          setRescheduleError("");
                        }}
                        value={rescheduleDate}
                      />
                      {rescheduleError ? <p className="mb-4 text-sm font-bold text-red-500">{rescheduleError}</p> : <div className="mb-4" />}
                      <div className="flex gap-4 justify-center">
                        <motion.button onClick={() => { setGiftDeclined(false); setShowGift(false); }} whileHover={{ scale: 1.05 }} className="px-6 py-3 rounded-full border border-gray-300 text-gray-500 font-bold hover:bg-gray-50">
                          {giftBackButton}
                        </motion.button>
                        <motion.button onClick={() => {
                          if (!rescheduleDate) {
                            setRescheduleError("Chọn ngày trước đã nha.");
                            return;
                          }
                          setGiftDeclined(false);
                          setGiftAccepted(true);
                          onResponse?.("RESCHEDULE", rescheduleDate);
                        }} whileHover={{ scale: 1.05 }} className="px-8 py-3 rounded-full bg-pink-500 text-white font-bold shadow-lg hover:bg-pink-600">
                          {giftRescheduleButton}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
