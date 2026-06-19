/* eslint-disable @next/next/no-img-element */
export const IconStar = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export function MediaFrame({
  alt,
  className = "",
  mediaType,
  src,
}: {
  alt: string;
  className?: string;
  mediaType?: string;
  src: string;
}) {
  if (mediaType?.startsWith("video")) {
    return (
      <video
        aria-label={alt}
        autoPlay
        className={`h-full w-full object-cover ${className}`}
        loop
        muted
        playsInline
        src={src}
      />
    );
  }

  return <img src={src} className={`h-full w-full object-cover ${className}`} alt={alt} />;
}

