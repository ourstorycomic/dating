"use client";

import { ConstellationVaultExperience } from "./index";
import type { TemplatePreviewProps } from "../previews/types";

export function StarryConstellationPreview({
  recipientName = "Linh",
  senderName = "Minh",
  compact = false,
  fullScreen = false,
  hideNavigation = false,
  onResponse,
  customData,
  autoPlay = false,
  isBuilderPreview = false,
  onStepChange,
}: TemplatePreviewProps) {
  const messages = customData?.memories?.length
    ? customData.memories.map((memory) => memory.message || memory.title)
    : undefined;

  return (
    <ConstellationVaultExperience
      onStepChange={onStepChange}
      autoPlay={autoPlay}
      forceStage={typeof customData?.forceStage === 'number' ? customData.forceStage : (customData?.forceStage ? parseInt(customData.forceStage as string) : undefined)}
      anniversaryCode={customData?.anniversaryCode ?? "1402"}
      connectInstruction={customData?.connectInstruction ?? "Giữ và di chuyển ống kính để dò tìm chòm sao"}
      constellationMessages={messages}
      finalCta={customData?.finalCta}
      finalSubtitle={customData?.finalSubtitle}
      finalTitle={customData?.finalTitle}
      contractBody={customData?.contractBody}
      contractHoldInstruction={customData?.contractHoldInstruction}
      contractRejectButton={customData?.contractRejectButton}
      contractTitle={customData?.contractTitle}
      giftAcceptButton={customData?.giftAcceptButton}
      giftAcceptedBody={customData?.giftAcceptedBody}
      giftAcceptedTitle={customData?.giftAcceptedTitle}
      giftBackButton={customData?.giftBackButton}
      giftBody={customData?.giftBody}
      giftDeclineButton={customData?.giftDeclineButton}
      giftDeclinedBody={customData?.giftDeclinedBody}
      giftDeclinedTitle={customData?.giftDeclinedTitle}
      giftRescheduleButton={customData?.giftRescheduleButton}
      giftTitle={customData?.giftTitle}
      proposedDate={customData?.proposedDate}
      introSubtitle={customData?.introSubtitle}
      introTitle={customData?.introTitle}
      stage1Accent={customData?.stage1Accent}
      stage1Background={customData?.stage1Background}
      stage1ImageUrl={customData?.stage1ImageUrl}
      stage1MediaType={customData?.stage1MediaType}
      stage1RevealBody={customData?.stage1RevealBody}
      stage1RevealButton={customData?.stage1RevealButton}
      stage1RevealTitle={customData?.stage1RevealTitle}
      stage2Accent={customData?.stage2Accent}
      stage2Background={customData?.stage2Background}
      stage2ImageCaption={customData?.stage2ImageCaption}
      stage2ImageUrl={customData?.stage2ImageUrl}
      stage2MediaType={customData?.stage2MediaType}
      stage2NextButton={customData?.stage2NextButton}
      stage2Quote={customData?.stage2Quote}
      stage3Accent={customData?.stage3Accent}
      stage3Background={customData?.stage3Background}
      stage3MediaType={customData?.stage3MediaType}
      stage3MediaUrl={customData?.stage3MediaUrl}
      stage3NextButton={customData?.stage3NextButton}
      stage2Subtitle={customData?.stage2Subtitle}
      stage2Title={customData?.stage2Title}
      stage3MusicLabel={customData?.stage3MusicLabel}
      stage3Subtitle={customData?.stage3Subtitle}
      stage3Title={customData?.stage3Title}
      stage4Accent={customData?.stage4Accent}
      stage4Background={customData?.stage4Background}
      stage4FallbackButton={customData?.stage4FallbackButton}
      stage4ImageUrl={customData?.stage4ImageUrl}
      stage4MediaType={customData?.stage4MediaType}
      stage4MicInstruction={customData?.stage4MicInstruction}
      stage4Prompt={customData?.stage4Prompt}
      stage4RevealBody={customData?.stage4RevealBody}
      stage4RevealButton={customData?.stage4RevealButton}
      stage4RevealTitle={customData?.stage4RevealTitle}
      finalAccent={customData?.finalAccent}
      finalBackground={customData?.finalBackground}
      generalAudioUrl={customData?.generalAudioUrl}
      stage3AudioUrl={customData?.stage3AudioUrl}
      senderName={senderName}
      recipientName={recipientName}
      compact={compact}
      isBuilderPreview={isBuilderPreview}
      fullScreen={fullScreen}
      hideNavigation={hideNavigation}
      onResponse={(r) => onResponse?.({ answer: r.answer, date: r.date, audioDataUrl: r.audioDataUrl })}
    />
  );
}
