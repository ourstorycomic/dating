"use client";

import { WeddingThreeExperience } from "./Experience";
import type { TemplatePreviewProps } from "../previews/types";
import { WEDDING_3_DATA } from "./config";

export function WeddingThreePreview(props: TemplatePreviewProps) {
  const parsedConfig = (props.customData || {}) as Record<string, any>;

  return (
    <WeddingThreeExperience
      compact={props.compact}
      isBuilderPreview={props.isBuilderPreview}
      autoPlay={props.autoPlay}
      fullScreen={props.fullScreen}
      groomName={parsedConfig.groomName || WEDDING_3_DATA.groomName}
      brideName={parsedConfig.brideName || WEDDING_3_DATA.brideName}
      weddingDate={parsedConfig.weddingDate || WEDDING_3_DATA.weddingDate}
      groomFamily={parsedConfig.groomFamily || WEDDING_3_DATA.groomFamily}
      brideFamily={parsedConfig.brideFamily || WEDDING_3_DATA.brideFamily}
      heroImage={parsedConfig.heroImage || WEDDING_3_DATA.heroImage}
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
          : parsedConfig.gallery || WEDDING_3_DATA.gallery
      }
      musicUrl={props.musicUrl || parsedConfig.musicUrl || WEDDING_3_DATA.musicUrl}
      eventAddress={parsedConfig.eventAddress || WEDDING_3_DATA.eventAddress}
      mapUrl={parsedConfig.mapUrl || WEDDING_3_DATA.mapUrl}
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
