import React, { useEffect, useRef, useState } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { Play } from "lucide-react";
import { VideoWeddingTwoComposition } from "./Composition";

const RANDOM_SONGS = [
  "/assets/songs/general/Da LAB - Từ Ngày Em Đến (Official Music Video)_128k.mp3",
  "/assets/songs/general/GREY D - hoá ra….mp3",
  "/assets/songs/general/GREY D - yêu em như…_128k.mp3",
  "/assets/songs/general/GREY D - đôi mắt kẻ tình si.mp3",
  "/assets/songs/general/HAN SARA _ TỚ THÍCH CẬU FT H.H.N _ OFFICIAL MUSIC VIDEO_128k.mp3"
];

export default function VideoWeddingTwoPreview({
  customData,
  buyerName,
  recipientName,
  senderName,
  isActive,
  noFrame,
  autoPlay = true,
  forceRandomMusic,
  compact = false
}: any) {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    p.addEventListener("play", handlePlay);
    p.addEventListener("pause", handlePause);
    return () => {
      p.removeEventListener("play", handlePlay);
      p.removeEventListener("pause", handlePause);
    };
  }, []);

  const enhancedCustomData = React.useMemo(() => {
    let song = customData?.generalAudioUrl;
    if (forceRandomMusic) {
      song = RANDOM_SONGS[Math.floor(Math.random() * RANDOM_SONGS.length)];
    }
    return { 
      ...customData, 
      generalAudioUrl: song, 
      isCompact: compact,
      groomName: senderName || customData?.groomName,
      brideName: recipientName || customData?.brideName
    };
  }, [customData, forceRandomMusic, compact, senderName, recipientName]);

  useEffect(() => {
    let playTimeout: any;
    let rAF: any;
    const shouldPlay = compact ? autoPlay : false;

    const tryPlay = () => {
      if (!shouldPlay) {
        playerRef.current?.pause();
        if (rAF) cancelAnimationFrame(rAF);
        return;
      }
      
      if (playerRef.current) {
        try {
          if (!playerRef.current.isPlaying()) {
            playerRef.current.play();
          }
        } catch (e) {
          console.warn("Player play() failed:", e);
        }

        // If it's still not playing (blocked by browser), manually advance frames
        if (!playerRef.current.isPlaying()) {
          let simulatedFrame = playerRef.current.getCurrentFrame() || 0;
          const advanceFrame = () => {
            if (playerRef.current && !playerRef.current.isPlaying() && shouldPlay) {
              try {
                simulatedFrame = Math.floor(simulatedFrame + (compact ? 3 : 1)) % 3600;
                playerRef.current.seekTo(simulatedFrame);
              } catch (e) {}
              rAF = requestAnimationFrame(advanceFrame);
            } else {
              rAF = null;
            }
          };
          if (!rAF) rAF = requestAnimationFrame(advanceFrame);
        }
      } 
      
      playTimeout = setTimeout(tryPlay, 100);
    };

    tryPlay();
    return () => {
      clearTimeout(playTimeout);
      if (rAF) cancelAnimationFrame(rAF);
    };
  }, [autoPlay, compact]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#1a0b0f] overflow-hidden rounded-[2.5rem]">
      <Player
        ref={playerRef}
        component={VideoWeddingTwoComposition}
        inputProps={{ customData: enhancedCustomData }}
        durationInFrames={3600}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        controls={!compact}
        autoPlay={compact ? autoPlay : false}
        loop
        initialFrame={0}
        playbackRate={compact ? 3 : 1}
        spaceKeyToPlayOrPause={false}
        clickToPlay={false}
        renderLoading={() => <div className="flex items-center justify-center w-full h-full bg-[#05020a]"><div className="w-8 h-8 border-4 border-[#C69C6D]/30 border-t-[#C69C6D] rounded-full animate-spin" /></div>}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          cursor: compact ? "default" : (!hasInteracted ? "pointer" : "default")
        }}
      />
      {!compact && !hasInteracted && (
        <div 
          className="absolute inset-0 z-50 flex items-center justify-center cursor-pointer bg-black/40 backdrop-blur-sm"
          onClick={() => {
            setHasInteracted(true);
            playerRef.current?.play();
          }}
        >
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-black/60 rounded-full flex items-center justify-center border-2 border-[#C5A880]/50 shadow-[0_0_40px_rgba(197,168,128,0.3)] transition-transform hover:scale-110 mb-4 animate-pulse">
              <Play className="w-10 h-10 text-white fill-white ml-2" />
            </div>
            <span className="text-white/90 font-medium tracking-widest text-sm uppercase">Bấm để phát Video</span>
          </div>
        </div>
      )}
    </div>
  );
}
