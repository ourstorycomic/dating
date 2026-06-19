import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hls from "hls.js";
import type { MovieData } from "../Valentine2WatchParty";

export function Step9Watch({ movie, conn, isHost }: { movie: MovieData; conn: any; isHost: boolean }) {
  const [streamUrl, setStreamUrl] = useState("");
  const [showRequestPopup, setShowRequestPopup] = useState(false);
  const [showHostConfirmPopup, setShowHostConfirmPopup] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Prevent loop of sync events
  const isSyncing = useRef(false);

  useEffect(() => {
    // Fetch movie details
    fetch(`https://phimapi.com/phim/${movie.slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.status && data.episodes?.length > 0) {
          const firstEp = data.episodes[0].server_data[0];
          setStreamUrl(firstEp.link_m3u8);
        }
      });
  }, [movie.slug]);

  useEffect(() => {
    if (!streamUrl || !videoRef.current) return;

    const video = videoRef.current;
    
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    }

    // PeerJS Event Listeners
    conn.on("data", (data: any) => {
      if (data.type === "play") {
        isSyncing.current = true;
        video.play().catch(e => console.error("Guest play blocked by browser", e));
      } else if (data.type === "pause") {
        isSyncing.current = true;
        video.pause();
      } else if (data.type === "seek") {
        isSyncing.current = true;
        video.currentTime = data.time;
      } else if (data.type === "request_pause") {
        if (isHost) {
          setShowHostConfirmPopup(true);
        }
      } else if (data.type === "request_accepted") {
        if (!isHost) {
          setShowRequestPopup(false);
        }
      }
    });

    return () => {
      conn.off("data");
    };
  }, [streamUrl, conn, isHost]);

  // Host Video Events
  const handleHostPlay = () => {
    if (!isHost || isSyncing.current) {
      isSyncing.current = false;
      return;
    }
    conn.send({ type: "play" });
  };

  const handleHostPause = () => {
    if (!isHost || isSyncing.current) {
      isSyncing.current = false;
      return;
    }
    conn.send({ type: "pause" });
  };

  const handleHostSeek = () => {
    if (!isHost || isSyncing.current) {
      isSyncing.current = false;
      return;
    }
    conn.send({ type: "seek", time: videoRef.current?.currentTime });
  };

  // Guest Request
  const handleGuestClick = () => {
    if (isHost) return;
    setShowRequestPopup(true);
    conn.send({ type: "request_pause" });
  };

  // Host Accept Request
  const handleAcceptPause = () => {
    setShowHostConfirmPopup(false);
    if (videoRef.current) videoRef.current.pause();
    conn.send({ type: "pause" });
    conn.send({ type: "request_accepted" });
  };

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col p-6 z-10 bg-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="flex-1 flex flex-col justify-center relative">
        {/* Glow effect behind video */}
        <div className="absolute inset-0 bg-rose-500/20 blur-[50px] rounded-full pointer-events-none" />

        <div className="relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(244,63,94,0.3)] bg-black/50 z-10">
          <video
            ref={videoRef}
            controls={isHost}
            className="w-full aspect-video object-cover"
            onPlay={handleHostPlay}
            onPause={handleHostPause}
            onSeeked={handleHostSeek}
            onClick={isHost ? undefined : handleGuestClick}
          />
          {!isHost && (
            <div 
              className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40"
              onClick={handleGuestClick}
            >
              <span className="text-white bg-black/60 px-4 py-2 rounded-full text-sm">Chạm để xin dừng phim</span>
            </div>
          )}
        </div>

        <div className="mt-6 text-center z-10">
          <h2 className="text-xl font-bold text-white mb-2">{movie.name}</h2>
          <div className="flex items-center justify-center gap-2 text-rose-400 text-sm">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            {isHost ? "Đang làm chủ phòng (Host)" : "Đang xem cùng người ấy (Guest)"}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {/* Guest waiting for host approval */}
        {showRequestPopup && !isHost && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-10 left-6 right-6 bg-slate-800/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 text-center z-50 shadow-2xl"
          >
            <p className="text-white">Đã gửi yêu cầu tạm dừng. Chờ người ấy đồng ý nhé...</p>
          </motion.div>
        )}

        {/* Host confirming guest request */}
        {showHostConfirmPopup && isHost && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-10 left-6 right-6 bg-slate-800/90 backdrop-blur-md p-4 rounded-xl border border-rose-500/50 text-center z-50 shadow-2xl flex flex-col gap-4"
          >
            <p className="text-white">Người ấy muốn tạm dừng phim!</p>
            <div className="flex gap-2">
              <button 
                onClick={handleAcceptPause}
                className="flex-1 bg-rose-500 text-white py-2 rounded-lg font-bold"
              >
                Đồng ý dừng
              </button>
              <button 
                onClick={() => setShowHostConfirmPopup(false)}
                className="flex-1 bg-slate-700 text-white py-2 rounded-lg font-bold"
              >
                Bỏ qua
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
