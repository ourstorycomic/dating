"use client";

import { TemplatePreviewProps } from "../previews/types";
import Sorry2Template from "./index";

export function Sorry2Preview(props: TemplatePreviewProps) {
  return <Sorry2Template autoPlay={props.autoPlay} compact={props.compact} isBuilderPreview={props.isBuilderPreview} hideNavigation={props.hideNavigation} config={props.customData} generalAudioUrl={props.generalAudioUrl} />;
}
