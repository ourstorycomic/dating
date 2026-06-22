"use client";

import Birthday3Museum from "./index";
import { TemplatePreviewProps } from "../types";

export function Birthday3Preview({ autoPlay, compact }: TemplatePreviewProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Birthday3Museum autoPlay={autoPlay} compact={compact} />
    </div>
  );
}
