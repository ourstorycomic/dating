"use client";

import { WillYouDateMeExperience } from "../WillYouDateMeExperience";
import type { TemplatePreviewProps } from "./types";

export function WillYouDateMePreview(props: TemplatePreviewProps) {
  // Translate the common preview props into WillYouDateMe config
  const parsedConfig = (props.customData || {}) as Record<string, any>;

  return (
    <WillYouDateMeExperience
      accentColor={parsedConfig.accentColor as string | undefined}
      backgroundColor={parsedConfig.backgroundColor as string | undefined}
      backgroundImage={parsedConfig.backgroundImage as string | undefined}
      compact={props.compact}
      datetimeTitle={parsedConfig.datetimeTitle as string | undefined}
      drinkTitle={parsedConfig.drinkTitle as string | undefined}
      finalMessage={parsedConfig.finalMessage as string | undefined}
      finalTitle={parsedConfig.finalTitle as string | undefined}
      foodTitle={parsedConfig.foodTitle as string | undefined}
      generalAudioUrl={parsedConfig.generalAudioUrl as string | undefined}
      locationTitle={parsedConfig.locationTitle as string | undefined}
      noButton={parsedConfig.noButton as string | undefined}
      questionBody={parsedConfig.questionBody as string | undefined}
      questionTitle={parsedConfig.questionTitle as string | undefined}
      recipientName={props.recipientName}
      senderName={props.senderName}
      successMessage={parsedConfig.successMessage as string | undefined}
      successTitle={parsedConfig.successTitle as string | undefined}
      yesButton={parsedConfig.yesButton as string | undefined}
    />
  );
}
