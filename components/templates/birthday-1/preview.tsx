"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { BirthdayMagicExperience } from "./index";
import type { TemplatePreviewProps } from "../previews/types";

export function BirthdayMagicPreview(props: TemplatePreviewProps) {
  const parsedConfig = (props.customData || {}) as Record<string, any>;

  return (
    <BirthdayMagicExperience
      recipientName={props.recipientName}
      senderName={props.senderName}
      birthdayMessage={parsedConfig.birthdayMessage as string | undefined}
      musicUrl={parsedConfig.musicUrl as string | undefined}
      fullScreen={props.fullScreen}
      compact={props.compact}
      hideNavigation={props.hideNavigation}
      age={parsedConfig.age ? parseInt(parsedConfig.age) : undefined}
      imageUrl={parsedConfig.imageUrl as string | undefined}
      memories={parsedConfig.memories}
      instructionText={parsedConfig.instructionText as string | undefined}
      wishPromptText={parsedConfig.wishPromptText as string | undefined}
      wishAcceptButton={parsedConfig.wishAcceptButton as string | undefined}
      wishDeclineButton={parsedConfig.wishDeclineButton as string | undefined}
      recordingText={parsedConfig.recordingText as string | undefined}
      recordingCompleteButton={parsedConfig.recordingCompleteButton as string | undefined}
      giftPromptText={parsedConfig.giftPromptText as string | undefined}
      balloonText={parsedConfig.balloonText as string | undefined}
      greetingCardSignature={parsedConfig.greetingCardSignature as string | undefined}
      final3DSignature={parsedConfig.final3DSignature as string | undefined}
      onResponse={props.onResponse}
    />
  );
}
