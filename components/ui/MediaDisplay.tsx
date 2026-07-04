import { ImgHTMLAttributes, VideoHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & VideoHTMLAttributes<HTMLVideoElement> & {
  src?: string;
  fallback?: string;
};

export function MediaDisplay({ src, fallback, className, alt, ...rest }: Props) {
  const actualSrc = src || fallback;
  if (!actualSrc) return null;
  
  const isVideo = actualSrc.endsWith(".mp4") || actualSrc.endsWith(".webm") || actualSrc.endsWith(".mov") || actualSrc.includes("video");

  if (isVideo) {
    return (
      <video 
        src={actualSrc} 
        className={`h-full w-full object-cover ${className || ""}`} 
        autoPlay 
        loop 
        muted 
        playsInline 
        {...(rest as any)}
      />
    );
  }
  return (
    <img 
      src={actualSrc} 
      className={`h-full w-full object-cover ${className || ""}`} 
      alt={alt || "Media"} 
      {...(rest as any)}
    />
  );
}
