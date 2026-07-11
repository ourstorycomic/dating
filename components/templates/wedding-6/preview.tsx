"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { WeddingSixExperience } from "./index";
import type { TemplatePreviewProps } from "../previews/types";
import { WEDDING_DATA } from "./config";

export function WeddingSixPreview(props: TemplatePreviewProps) {
  const parsedConfig = (props.customData || {}) as Record<string, any>;

  const experience = (
    <WeddingSixExperience
      compact={props.compact}
      isBuilderPreview={props.isBuilderPreview}
      autoPlay={props.autoPlay}
      groomName={parsedConfig.groomName || WEDDING_DATA.groomName}
      brideName={parsedConfig.brideName || WEDDING_DATA.brideName}
      weddingDate={parsedConfig.weddingDate || WEDDING_DATA.weddingDate}
      weddingMonth={parsedConfig.weddingMonth || WEDDING_DATA.weddingMonth}
      weddingDay={parsedConfig.weddingDay || WEDDING_DATA.weddingDay}
      weddingYear={parsedConfig.weddingYear || WEDDING_DATA.weddingYear}
      weddingDayOfWeek={parsedConfig.weddingDayOfWeek || WEDDING_DATA.weddingDayOfWeek}
      heroImage={parsedConfig.heroImage || WEDDING_DATA.heroImage}
      groomImage={parsedConfig.groomImage || WEDDING_DATA.groomImage}
      brideImage={parsedConfig.brideImage || WEDDING_DATA.brideImage}
      letterText={parsedConfig.letterText || WEDDING_DATA.letterText}
      groomFamily={parsedConfig.groomFamily || WEDDING_DATA.groomFamily}
      brideFamily={parsedConfig.brideFamily || WEDDING_DATA.brideFamily}
      eventAddress={parsedConfig.eventAddress || WEDDING_DATA.eventAddress}
      mapUrl={parsedConfig.mapUrl || WEDDING_DATA.mapUrl}
      mapImage={parsedConfig.mapImage || WEDDING_DATA.mapImage}
      dividerImage={parsedConfig.dividerImage || WEDDING_DATA.dividerImage}
      footerImage={parsedConfig.footerImage || WEDDING_DATA.footerImage}
      musicUrl={props.musicUrl || parsedConfig.musicUrl || WEDDING_DATA.musicUrl}
      onComplete={(data) => {
        props.onResponse?.({
          answer: "RSVP",
          message: `RSVP: ${JSON.stringify(data)}`,
        });
      }}
    />
  );

  return experience;
}
