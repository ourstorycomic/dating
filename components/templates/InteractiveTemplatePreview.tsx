"use client";

import type { TemplatePreviewProps } from "./previews/types";
import { StarryConstellationPreview } from "./previews/StarryConstellationPreview";

type InteractiveTemplatePreviewProps = TemplatePreviewProps & {
  componentKey: string;
};

const previewRegistry = [
  { match: "constellation", Component: StarryConstellationPreview },
  { match: "starry", Component: StarryConstellationPreview },
  { match: "valentine-1", Component: StarryConstellationPreview },
  { match: "valentine #1", Component: StarryConstellationPreview },
  { match: "password", Component: StarryConstellationPreview },
  { match: "timeline", Component: StarryConstellationPreview },
];

export function InteractiveTemplatePreview({
  componentKey,
  ...props
}: InteractiveTemplatePreviewProps) {
  const normalizedKey = componentKey.toLowerCase();
  const preview = previewRegistry.find((item) => normalizedKey.includes(item.match));

  if (preview) {
    const Component = preview.Component;
    return <Component {...props} />;
  }

  return <FallbackPreview componentKey={componentKey} {...props} />;
}

function FallbackPreview({
  visualLabel,
  recipientName = "Linh",
  compact = false,
}: TemplatePreviewProps & { componentKey: string }) {
  return (
    <div className="relative grid h-full min-h-56 place-items-center overflow-hidden rounded-2xl border border-white/12 bg-[#12091f] p-5 text-center text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,79,216,0.32),transparent_32%),linear-gradient(145deg,rgba(155,92,255,0.28),transparent)]" />
      <div className="relative">
        <div className="float-slow mx-auto grid h-20 w-20 place-items-center rounded-full border border-white/20 bg-white/12 text-xs font-black shadow-[0_0_36px_rgba(255,79,216,0.28)]">
          {visualLabel || "LOVE"}
        </div>
        <h3 className={compact ? "mt-4 text-2xl font-bold" : "mt-5 text-4xl font-bold"}>
          Quà tặng cho {recipientName}
        </h3>
        <p className="mx-auto mt-3 max-w-xs text-xs leading-5 text-white/64">
          Template này đang chờ visual riêng. Admin có thể thêm preview component theo component_key.
        </p>
      </div>
    </div>
  );
}
