"use client";

import "@/app/animations.css";
import "@/app/templates.css";

/* eslint-disable @next/next/no-img-element, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/purity, react-hooks/set-state-in-effect, react/no-unescaped-entities */

import { useState, useEffect, useRef, type PointerEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Stage1Telescope, Stage2Orbit, Stage3InfinityVoice, Stage4MeteorMic, Stage5Supernova } from "./stages";
import { TemplateNavigator } from "../TemplateNavigator";
import { playSwoosh } from "../valentine-2/components/soundFX";

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
  stage1ImageUrl = "/assets/lovepics/2.jpg",
  stage1MediaType = "",
  stage1RevealBody = "Trạm không gian vừa bắt được một dải sáng tuyệt đẹp. Vũ trụ bao la, nhưng radar chỉ hướng về một người duy nhất thôi!",
  stage1RevealButton = "Khôi phục từ trường",
  stage1RevealTitle = "Vì Sao Của Riêng Tớ",
  stage2Accent = "#60a5fa",
  stage2Background = "#05020a",
  stage2ImageCaption = "Our Orbit",
  stage2ImageUrl = "/assets/lovepics/1.jpg",
  stage2MediaType = "",
  stage2NextButton = "Tiếp tục hành trình",
  stage2Quote = "\"Dỗi thì dỗi nhưng vẫn phải về đúng quỹ đạo của nhau thôi. Cảm ơn vì đã luôn nhường nhịn cái sự bướng bỉnh của tớ.\"",
  stage3Accent = "#f472b6",
  stage3Background = "#05020a",
  stage3MediaType = "image/jpeg",
  stage3MediaUrl = "/assets/lovepics/3.jpg",
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
  forceStage,
  autoPlay = false,
  isBuilderPreview = false,
}: {
  isBuilderPreview?: boolean;
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
  forceStage?: number;
  autoPlay?: boolean;
}) {
  const [stage, setStage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const generalAudioRef = useRef<HTMLAudioElement>(null);
  const stage3AudioRef = useRef<HTMLAudioElement>(null);
  const [recordedAudio, setRecordedAudio] = useState<string | undefined>();

  useEffect(() => {
    if (forceStage && forceStage >= 1 && forceStage <= 5) {
      setStage(forceStage);
    }
  }, [forceStage]);

  // If it's on the homepage catalog (compact and not builder preview), we must mute it
  // so the BotAutoPlayer doesn't cause a cacophony of sounds.
  const isMuted = compact && !isBuilderPreview && !autoPlay;

  const changeStage = (newStage: number) => {
    if (!isMuted) {
      playSwoosh();
    }
    setStage(newStage);
  };

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
        generalAudioRef.current.volume = micActive ? 0.02 : 0.2;
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
  }, [stage, mounted, stage3AudioUrl, micActive]);

  return (
    <div className={`template-preview-surface ${fullScreen ? "relative w-full min-h-screen h-full" : compact ? "absolute inset-0" : "relative min-h-[640px] h-full sm:h-[800px] sm:max-h-[85vh] sm:rounded-2xl border border-white/10"} w-full overflow-hidden text-white font-sans selection:bg-pink-500/30 transition-colors duration-1000`} style={{ background: stage === 5 ? finalBackground : [stage1Background, stage2Background, stage3Background, stage4Background][stage - 1] ?? "#0a0514" }}>
      {mounted && (
        <>
          {generalAudioUrl && <audio ref={generalAudioRef} src={generalAudioUrl} loop className="hidden" muted={compact && !autoPlay} />}
          {stage3AudioUrl && <audio ref={stage3AudioRef} src={stage3AudioUrl} className="hidden" muted={compact && !autoPlay} />}
          {/* Nền vũ trụ chung (Dạng chấm trắng mượt mà) */}
          {stage > 1 && stage < 5 && !compact && (
            <div className="absolute inset-0 pointer-events-none" style={{ background: [stage1Background, stage2Background, stage3Background, stage4Background][stage - 1] ?? "#05020a" }}>
               {Array.from({ length: 50 }).map((_, i) => (
                 <motion.div key={`bgstar-${i}`}
                   className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_#fff]"
                   initial={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() }}
                   animate={{ opacity: [0.1, 0.8, 0.1], scale: [0.8, 1.2, 0.8] }}
                   transition={{ duration: 4 + Math.random() * 5, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
                 />
               ))}
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15)_0%,transparent_100%)] pointer-events-none" />
            </div>
          )}

          <AnimatePresence mode="wait">
            {stage === 1 && <Stage1Telescope accent={stage1Accent} connectInstruction={connectInstruction} imageUrl={stage1ImageUrl} mediaType={stage1MediaType} introSubtitle={introSubtitle} introTitle={introTitle} key="stage1" onNext={() => changeStage(2)} revealBody={stage1RevealBody} revealButton={stage1RevealButton} revealTitle={stage1RevealTitle} autoPlay={autoPlay} />}
            {stage === 2 && <Stage2Orbit accent={stage2Accent} imageCaption={stage2ImageCaption} imageUrl={stage2ImageUrl} mediaType={stage2MediaType} nextButton={stage2NextButton} key="stage2" onNext={() => changeStage(3)} quote={stage2Quote} subtitle={stage2Subtitle} title={stage2Title} autoPlay={autoPlay} />}
            {stage === 3 && <Stage3InfinityVoice accent={stage3Accent} key="stage3" mediaType={stage3MediaType} mediaUrl={stage3MediaUrl} musicLabel={stage3MusicLabel} nextButton={stage3NextButton} points={constellationPoints} messages={constellationMessages} onNext={() => changeStage(4)} subtitle={stage3Subtitle} title={stage3Title} autoPlay={autoPlay} />}
            {stage === 4 && <Stage4MeteorMic accent={stage4Accent} fallbackButton={stage4FallbackButton} imageUrl={stage4ImageUrl} mediaType={stage4MediaType} key="stage4" micInstruction={stage4MicInstruction} onNext={() => changeStage(5)} prompt={stage4Prompt} revealBody={stage4RevealBody} revealButton={stage4RevealButton} revealTitle={stage4RevealTitle} onRecord={(url) => setRecordedAudio(url)} autoPlay={autoPlay} onRecordingStart={() => setMicActive(true)} onRecordingStop={() => setMicActive(false)} />}
            {stage === 5 && <Stage5Supernova contractBody={contractBody} contractHoldInstruction={contractHoldInstruction} contractRejectButton={contractRejectButton} contractTitle={contractTitle} finalAccent={finalAccent} finalBackground={finalBackground} finalCta={finalCta} finalSubtitle={finalSubtitle} finalTitle={finalTitle} giftAcceptButton={giftAcceptButton} giftAcceptedBody={giftAcceptedBody} giftAcceptedTitle={giftAcceptedTitle} giftBackButton={giftBackButton} giftBody={giftBody} giftDeclineButton={giftDeclineButton} giftDeclinedBody={giftDeclinedBody} giftDeclinedTitle={giftDeclinedTitle} giftRescheduleButton={giftRescheduleButton} giftTitle={giftTitle} key="stage5" onResponse={(answer, date) => onResponse?.({ answer, date, audioDataUrl: recordedAudio })} proposedDate={proposedDate} autoPlay={autoPlay} />}
          </AnimatePresence>
          <TemplateNavigator
            currentIndex={stage - 1}
            totalSteps={5}
            onPrev={() => changeStage(Math.max(1, stage - 1))}
            onNext={() => changeStage(Math.min(5, stage + 1))}
            accentColor={stage === 5 ? finalAccent : [stage1Accent, stage2Accent, stage3Accent, stage4Accent][stage - 1] ?? "#fff"}
            isHidden={hideNavigation || autoPlay}
          />
        </>
      )}
    </div>
  );
}
