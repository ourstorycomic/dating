"use client";

import type { TemplatePreviewProps } from "./previews/types";
import { StarryConstellationPreview } from "./valentine-1/preview";
import { Valentine2Preview } from "./valentine-2/preview";
import { Valentine3Preview } from "./valentine-3/preview";
import { WillYouDateMePreview } from "./dating-1/preview";
import { BirthdayMagicPreview } from "./birthday-1/preview";
import { DatingTwoPreview } from "./dating-2/preview";
import { DatingThreePreview } from "./dating-3/preview";

type InteractiveTemplatePreviewProps = TemplatePreviewProps & {
  componentKey: string;
  roomId?: string;
};

const previewRegistry = [
  { match: "val-starry-constellation", Component: StarryConstellationPreview },
  { match: "constellation", Component: StarryConstellationPreview },
  { match: "starry", Component: StarryConstellationPreview },
  { match: "valentine-1", Component: StarryConstellationPreview },
  { match: "valentine #1", Component: StarryConstellationPreview },
  { match: "valentine-2", Component: Valentine2Preview },
  { match: "valentine #2", Component: Valentine2Preview },
  { match: "valentine-3", Component: Valentine3Preview },
  { match: "valentine #3", Component: Valentine3Preview },
  { match: "will-you-date-me", Component: WillYouDateMePreview },
  { match: "dating-1", Component: WillYouDateMePreview },
  { match: "dating #1", Component: WillYouDateMePreview },
  { match: "dating-2", Component: DatingTwoPreview },
  { match: "dating #2", Component: DatingTwoPreview },
  { match: "dating-3", Component: DatingThreePreview },
  { match: "dating #3", Component: DatingThreePreview },
  { match: "birthday-magic", Component: BirthdayMagicPreview },
  { match: "birthday-1", Component: BirthdayMagicPreview },
  { match: "birthday #1", Component: BirthdayMagicPreview },
];

export function InteractiveTemplatePreview({
  componentKey,
  roomId,
  ...props
}: InteractiveTemplatePreviewProps) {
  const normalizedKey = componentKey.toLowerCase();
  const preview = previewRegistry.find((item) => normalizedKey.includes(item.match));

  if (preview) {
    const Component = preview.Component;
    if (props.compact) {
      if (!props.isBuilderPreview) {
        return (
          <div className="mx-auto flex aspect-[9/19] w-[340px] max-w-full shrink-0 flex-col overflow-hidden rounded-[2.5rem] border-[6px] border-[#150a21] bg-[#05020a] shadow-2xl relative pointer-events-none">
            <Component {...props} roomId={roomId} autoPlay={true} />
          </div>
        );
      } else {
        return (
          <div className="mx-auto flex aspect-[9/19] w-[340px] max-w-full shrink-0 flex-col overflow-hidden rounded-[2.5rem] border-[6px] border-[#150a21] bg-[#05020a] shadow-2xl relative">
            <Component {...props} roomId={roomId} autoPlay={true} />
          </div>
        );
      }
    }
    return <Component {...props} roomId={roomId} />;
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
