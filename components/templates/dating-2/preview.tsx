"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { LoveSpaceTemplate } from "./index";
import type { TemplatePreviewProps } from "../previews/types";

export function DatingTwoPreview(props: TemplatePreviewProps) {
  const parsedConfig = (props.customData || {}) as Record<string, any>;

  return (
    <LoveSpaceTemplate
      compact={props.compact} isBuilderPreview={props.isBuilderPreview}
      recipientName={props.recipientName}
      senderName={props.senderName}
      fullScreen={props.fullScreen}
      hideNavigation={props.hideNavigation}
      autoPlay={props.autoPlay}
      onStepChange={props.onStepChange}
      customData={parsedConfig}
      onComplete={() => {
        props.onResponse?.({
          answer: "YES",
          message: "Đã chốt deal hẹn hò!",
        });
      }}
    />
  );
}
