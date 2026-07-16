"use client";

import { WeddingFiveExperience } from "./index";
import type { TemplatePreviewProps } from "../previews/types";
import { WEDDING_5_DATA } from "./config";

export function WeddingFivePreview(props: TemplatePreviewProps) {
  const parsedConfig = (props.customData || {}) as Record<string, any>;

  return (
    <WeddingFiveExperience
      compact={props.compact}
      isBuilderPreview={props.isBuilderPreview}
      autoPlay={props.autoPlay}
      groomName={parsedConfig.groomName || WEDDING_5_DATA.groomName}
      brideName={parsedConfig.brideName || WEDDING_5_DATA.brideName}
      weddingDate={parsedConfig.weddingDate || WEDDING_5_DATA.weddingDate}
      groomFamily={parsedConfig.groomFamily || WEDDING_5_DATA.groomFamily}
      brideFamily={parsedConfig.brideFamily || WEDDING_5_DATA.brideFamily}
      heroImage={parsedConfig.heroImage || WEDDING_5_DATA.heroImage}
      gallery={
        [
          parsedConfig.gallery1,
          parsedConfig.gallery2,
          parsedConfig.gallery3,
          parsedConfig.gallery4,
          parsedConfig.gallery5,
          parsedConfig.gallery6,
          parsedConfig.gallery7,
          parsedConfig.gallery8,
        ].filter(Boolean).length > 0
          ? [
              parsedConfig.gallery1,
              parsedConfig.gallery2,
              parsedConfig.gallery3,
              parsedConfig.gallery4,
              parsedConfig.gallery5,
              parsedConfig.gallery6,
              parsedConfig.gallery7,
              parsedConfig.gallery8,
            ].filter(Boolean)
          : parsedConfig.gallery || WEDDING_5_DATA.gallery
      }
      musicUrl={props.musicUrl || parsedConfig.musicUrl || WEDDING_5_DATA.musicUrl}
      eventAddress={parsedConfig.eventAddress || WEDDING_5_DATA.eventAddress}
      mapUrl={parsedConfig.mapUrl || WEDDING_5_DATA.mapUrl}
      onComplete={(data) => {
        props.onResponse?.({
          answer: "RSVP",
          message: `RSVP: ${JSON.stringify(data)}`,
        });
      }}
    />
  );
}
