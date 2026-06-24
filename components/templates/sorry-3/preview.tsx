"use client";

import { TemplatePreviewProps } from "../previews/types";
import Sorry3Template from "./index";

export function Sorry3Preview(props: TemplatePreviewProps) {
  return <Sorry3Template autoPlay={props.autoPlay} compact={props.compact} />;
}
