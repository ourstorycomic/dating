"use client";

import { WeddingFourExperience } from "./index";
import type { TemplatePreviewProps } from "../previews/types";
import { WEDDING_4_DATA } from "./config";

export function WeddingFourPreview(props: TemplatePreviewProps) {
  const parsedConfig = (props.customData || {}) as Record<string, any>;

  return (
    <WeddingFourExperience
      compact={props.compact}
      isBuilderPreview={props.isBuilderPreview}
      autoPlay={props.autoPlay}
      groomName={parsedConfig.groomName || WEDDING_4_DATA.groomName}
      brideName={parsedConfig.brideName || WEDDING_4_DATA.brideName}
      weddingDate={parsedConfig.weddingDate || WEDDING_4_DATA.weddingDate}
      groomFamily={parsedConfig.groomFamily || WEDDING_4_DATA.groomFamily}
      brideFamily={parsedConfig.brideFamily || WEDDING_4_DATA.brideFamily}
      heroImage={parsedConfig.heroImage || WEDDING_4_DATA.heroImage}
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
          : parsedConfig.gallery || WEDDING_4_DATA.gallery
      }
      musicUrl={props.musicUrl || parsedConfig.musicUrl || WEDDING_4_DATA.musicUrl}
      eventAddress={parsedConfig.eventAddress || WEDDING_4_DATA.eventAddress}
      mapUrl={parsedConfig.mapUrl || WEDDING_4_DATA.mapUrl}
      onComplete={(data) => {
        props.onResponse?.({
          answer: "RSVP",
          message: `RSVP: ${JSON.stringify(data)}`,
        });
      }}
      customData={parsedConfig}
    />
  );
}
