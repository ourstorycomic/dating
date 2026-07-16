"use client";

import { WeddingTwoExperience } from "./index";
import type { TemplatePreviewProps } from "../previews/types";
import { WEDDING_2_DATA } from "./config";

export function WeddingTwoPreview(props: TemplatePreviewProps) {
  const parsedConfig = (props.customData || {}) as Record<string, any>;

  return (
    <WeddingTwoExperience
      compact={props.compact}
      isBuilderPreview={props.isBuilderPreview}
      autoPlay={props.autoPlay}
      groomName={parsedConfig.groomName || WEDDING_2_DATA.groomName}
      brideName={parsedConfig.brideName || WEDDING_2_DATA.brideName}
      weddingDate={parsedConfig.weddingDate || WEDDING_2_DATA.weddingDate}
      weddingTime={parsedConfig.weddingTime || WEDDING_2_DATA.weddingTime}
      groomFamily={parsedConfig.groomFamily || WEDDING_2_DATA.groomFamily}
      brideFamily={parsedConfig.brideFamily || WEDDING_2_DATA.brideFamily}
      heroImage={parsedConfig.heroImage || WEDDING_2_DATA.heroImage}
      gallery={parsedConfig.gallery || WEDDING_2_DATA.gallery}
      musicUrl={props.musicUrl || parsedConfig.musicUrl || WEDDING_2_DATA.musicUrl}
      eventAddress={parsedConfig.eventAddress || WEDDING_2_DATA.eventAddress}
      mapUrl={parsedConfig.mapUrl || WEDDING_2_DATA.mapUrl}
      onComplete={(data) => {
        props.onResponse?.({
          answer: "RSVP",
          message: `RSVP: ${JSON.stringify(data)}`,
        });
      }}
    />
  );
}
