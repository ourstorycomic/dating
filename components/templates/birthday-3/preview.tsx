"use client";

import { TemplatePreviewProps } from "../previews/types";
import Birthday3Template from "./index";

export default function Birthday3Preview(props: TemplatePreviewProps) {
  return <Birthday3Template autoPlay={props.autoPlay} compact={props.compact} />;
}
