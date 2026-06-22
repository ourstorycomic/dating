"use client";

import Sorry1Template from "./index";
import type { TemplatePreviewProps } from "../previews/types";

export function Sorry1Preview(props: TemplatePreviewProps) {
  return <Sorry1Template autoPlay={props.autoPlay} compact={props.compact} />;
}
