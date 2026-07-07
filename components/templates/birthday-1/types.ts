export const PHASES = [
  "dark",
  "music",
  "decorate-popup",
  "cake-messages",
  "match-ignite",
  "wish-record",
  "celebration",
  "gift-reveal",
  "vintage-gallery",
  "end"
] as const;

export type BirthdayPhase = typeof PHASES[number];

export type MaterialTone = "switch" | "switch-single" | "glow" | "fire";

export interface BirthdayMagicExperienceProps {
  recipientName?: string;
  senderName?: string;
  birthdayMessage?: string;
  musicUrl?: string;
  fullScreen?: boolean;
  compact?: boolean;
  autoPlay?: boolean;
  isBuilderPreview?: boolean;
  age?: number;
  imageUrl?: string;
  hideNavigation?: boolean;
  memories?: { imageUrl: string; message: string; }[];
  instructionText?: string;
  wishPromptText?: string;
  recordingText?: string;
  giftPromptText?: string;
  messages?: string[];
  finalMessage?: string;
  bannerTitle?: string;
  bannerName?: string;
  onResponse?: (response: { answer: string; message?: string; audioDataUrl?: string; date?: string }) => void;
  forceStep?: number;
  onStepChange?: (step: number, total: number) => void;
}

