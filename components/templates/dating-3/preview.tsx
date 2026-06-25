"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { GachaTemplate } from "./index";
import type { TemplatePreviewProps } from "../previews/types";

export function DatingThreePreview(props: TemplatePreviewProps) {
  const parsedConfig = (props.customData || {}) as Record<string, any>;

  return (
    <GachaTemplate
      compact={props.compact} isBuilderPreview={props.isBuilderPreview}
      recipientName={props.recipientName}
      senderName={props.senderName}
      fullScreen={props.fullScreen}
      hideNavigation={props.hideNavigation}
      autoPlay={props.autoPlay}
      data={parsedConfig}
      onComplete={() => {
        props.onResponse?.({
          answer: "YES",
          message: "Đã chốt deal Gacha!",
        });
      }}
    />
  );
}
