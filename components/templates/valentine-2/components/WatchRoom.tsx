"use client";
import { MediaDisplay } from "@/components/ui/MediaDisplay";


import React, { useEffect, useMemo, useRef, useState } from "react";
import { VideoPlayer, type PlayerPendingRequest } from "@/components/ui/video-player";
import { createClient } from "@/lib/supabase/client";
import { Send, ArrowLeft, ListVideo, Play, Star } from "lucide-react";
import { playClick } from "./soundFX";

// ── Stable per-tab presence ID (survives re-renders and refreshes) ────────────
function getTabPresenceId(roomId: string): string {
  const key = `valentine_presence:${roomId}`;
  try {
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
    return id;
  } catch {
    return crypto.randomUUID(); // fallback if sessionStorage blocked
  }
}

type ControlRequest = {
  id: string;
  guestId: string;
  guestName: string;
  type: "seek" | "pause" | "play";
  time?: number;
};

type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  body: string;
  sentAt: number;
};

// ─────────────────────────────────────────────────────────────────────────────
export function WatchRoom({
  roomId,
  movie,
  isHost,
  guestName = "Guest",
  hostDisplayName = "Host",
  guestDisplayName = guestName,
  onBackToLobby,
  onChangeMovie,
  compact = false,
  isPreview = false,
}: {
  roomId: string;
  movie: { name: string; slug: string };
  isHost: boolean;
  guestName?: string;
  hostDisplayName?: string;
  guestDisplayName?: string;
  onBackToLobby?: () => void;
  onChangeMovie?: (movie: any) => void;
  compact?: boolean;
  isPreview?: boolean;
}) {
  const supabase = useMemo(() => createClient(), []);

  // Stable presence ID — never changes for this tab/session
  const presenceIdRef = useRef<string | null>(null);
  if (!presenceIdRef.current) {
    presenceIdRef.current = getTabPresenceId(roomId);
  }
  const myId = presenceIdRef.current;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const applyingRemoteRef = useRef(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const hostStateRef = useRef({ time: 0, paused: true });

  const applyHostState = (payload: { time?: number; paused?: boolean }) => {
    const video = videoRef.current as HTMLVideoElement & {
      __pmoviesRemoteApplying?: boolean;
      __pmoviesHostState?: { time: number; paused: boolean };
    } | null;
    if (!video || isHost) return;

    const time = typeof payload.time === "number" ? payload.time : hostStateRef.current.time;
    const paused = typeof payload.paused === "boolean" ? payload.paused : hostStateRef.current.paused;
    hostStateRef.current = { time, paused };

    applyingRemoteRef.current = true;
    video.__pmoviesRemoteApplying = true;
    video.__pmoviesHostState = { time, paused };

    const sync = () => {
      if (Math.abs(video.currentTime - time) > 0.75) video.currentTime = time;
      if (paused) video.pause();
      else void video.play().catch(() => undefined);
      window.setTimeout(() => {
        applyingRemoteRef.current = false;
        video.__pmoviesRemoteApplying = false;
      }, 400);
    };

    if (video.readyState >= 1) sync();
    else video.addEventListener("loadedmetadata", sync, { once: true });
  };

  const [streamUrl, setStreamUrl] = useState("");
  const [pendingRequest, setPendingRequest] = useState<ControlRequest | null>(null);
  const [requestResolutionKey, setRequestResolutionKey] = useState("");
  const [viewerCount, setViewerCount] = useState(1);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [showChat, setShowChat] = useState(true);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimeoutRef = useRef<number | null>(null);

  const resetIdle = () => {
    setIsIdle(false);
    if (idleTimeoutRef.current) window.clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = window.setTimeout(() => setIsIdle(true), 3500);
  };

  useEffect(() => {
    resetIdle();
    return () => {
      if (idleTimeoutRef.current) window.clearTimeout(idleTimeoutRef.current);
    };
  }, []);

  const [episodes, setEpisodes] = useState<{name: string, link_m3u8: string}[]>([]);
  const [currentEpIndex, setCurrentEpIndex] = useState(0);
  const [suggestedMovies, setSuggestedMovies] = useState<any[]>([]);

  const getSuggestedRatingText = (movie: any) => {
    const rating = Number(movie.voteAverage);
    if (!Number.isFinite(rating) || rating <= 0) return "Chưa rõ điểm";
    return rating.toFixed(1);
  };

  const getSuggestedGenre = (movie: any) => {
    const raw = movie.categories?.[0];
    if (!raw) return "Chưa rõ thể loại";
    if (typeof raw === "string") return raw;
    return raw.name || "Chưa rõ thể loại";
  };

  const getSuggestedVoteCountText = (movie: any) => {
    if (typeof movie.voteCount !== "number") return "Chưa rõ lượt";
    return `${movie.voteCount.toLocaleString("vi-VN")} lượt`;
  };

  useEffect(() => {
    setCurrentEpIndex(0);
    fetch(`https://phimapi.com/phim/${movie.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.episodes?.length > 0) {
          const eps = data.episodes[0].server_data;
          setEpisodes(eps);
          setStreamUrl(eps[0].link_m3u8);
        }
      })
      .catch(console.error);
  }, [movie.slug]);

  useEffect(() => {
    if (!isHost) return;
    fetch(`https://phimapi.com/v1/api/danh-sach/phim-le?page=1&limit=12`)
      .then(res => res.json())
      .then(data => {
        const imageDomain = "https://img.phimapi.com/";
         const items = data.data?.items || [];
         const formatted = items.slice(0, 12).map((m: any) => ({
            _id: m._id,
            name: m.name,
            slug: m.slug,
            thumb_url: m.thumb_url?.startsWith("http") ? m.thumb_url : `${imageDomain}${m.thumb_url}`,
            poster_url: m.poster_url?.startsWith("http") ? m.poster_url : `${imageDomain}${m.poster_url}`,
            year: m.year,
          voteAverage: typeof m?.tmdb?.vote_average === "number" ? m.tmdb.vote_average : (typeof m?.imdb?.vote_average === "number" ? m.imdb.vote_average : undefined),
          voteCount: typeof m?.tmdb?.vote_count === "number" ? m.tmdb.vote_count : (typeof m?.imdb?.vote_count === "number" ? m.imdb.vote_count : undefined),
          categories: Array.isArray(m.category) ? m.category : [],
         }));
         setSuggestedMovies(formatted.filter((m: any) => m.slug !== movie.slug));
      })
      .catch(console.error);
  }, [isHost, movie.slug]);

  useEffect(() => {
    if (episodes.length > 0 && episodes[currentEpIndex]) {
      setStreamUrl(episodes[currentEpIndex].link_m3u8);
    }
  }, [currentEpIndex, episodes]);

  // ── Supabase Realtime channel ─────────────────────────────────────────────
  useEffect(() => {
    if (isPreview) return;
    
    const channel = supabase
      .channel(`watch-room:${roomId}`, {
        config: { presence: { key: myId } },
      })
      // ── Sync playback state (guest only) ──
      .on("broadcast", { event: "player_state" }, ({ payload }) => {
        if (isHost) return;
        applyHostState(payload);
      })
      .on("broadcast", { event: "request_state" }, () => {
        if (!isHost || !videoRef.current || !channelRef.current) return;
        const video = videoRef.current;
        void channelRef.current.send({
          type: "broadcast",
          event: "player_state",
          payload: {
            reason: "sync",
            time: video.currentTime,
            paused: video.paused,
            at: Date.now(),
          },
        });
      })
      // ── Control requests ──
      .on("broadcast", { event: "control_request" }, ({ payload }) => {
        if (!isHost) return;
        setPendingRequest(payload as ControlRequest);
      })
      .on("broadcast", { event: "control_cancel" }, ({ payload }) => {
        if (!isHost) return;
        setPendingRequest((r) => (r && r.id === payload.requestId ? null : r));
      })
      .on("broadcast", { event: "control_response" }, ({ payload }) => {
        if (payload.guestId !== myId) return;
        setRequestResolutionKey(`${payload.requestId}:${payload.accepted}:${Date.now()}`);
      })
      // ── Chat messages ──
      .on("broadcast", { event: "chat_message" }, ({ payload }) => {
        const msg = payload as ChatMessage;
        if (msg.senderId === myId) return; // ignore own echo
        setMessages((prev) => [...prev.slice(-99), msg]);
      })
      // ── Episode change ──
      .on("broadcast", { event: "change_episode" }, ({ payload }) => {
        if (isHost) return;
        setCurrentEpIndex(payload.index);
      })
      // ── Presence viewer count ──
      .on("presence", { event: "sync" }, () => {
        const count = Object.keys(channel.presenceState()).length;
        setViewerCount(count);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            presence_id: myId,
            name: isHost ? hostDisplayName : guestDisplayName,
            is_host: isHost,
            joined_at: new Date().toISOString(),
          });
          if (!isHost) {
            void channel.send({ type: "broadcast", event: "request_state", payload: { guestId: myId } });
          }
        }
      });

    channelRef.current = channel;
    return () => {
      channelRef.current = null;
      void supabase.removeChannel(channel);
    };
  // myId and guestName are stable; isHost/roomId don't change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, isHost]);

  // Re-sync guest when tab becomes visible again
  useEffect(() => {
    if (isHost || isPreview) return;
    const onVisible = () => {
      if (!document.hidden) {
        void channelRef.current?.send({ type: "broadcast", event: "request_state", payload: { guestId: myId } });
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [isHost, isPreview, myId]);

  // Re-apply last known host position after stream URL changes
  useEffect(() => {
    if (isHost || !streamUrl) return;
    applyHostState(hostStateRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamUrl, isHost]);
  useEffect(() => {
    if (!isHost || isPreview) return;
    let lastSent = 0;
    let attachedVideo: HTMLVideoElement | null = null;
    let heartbeat: number | null = null;

    const sendState = async (video: HTMLVideoElement, reason: "play" | "pause" | "seek" | "heartbeat") => {
      if (applyingRemoteRef.current || !channelRef.current) return;
      const now = Date.now();
      if (reason === "heartbeat" && now - lastSent < 1500) return;
      lastSent = now;
      await channelRef.current.send({
        type: "broadcast",
        event: "player_state",
        payload: { reason, time: video.currentTime, paused: video.paused, at: now },
      });
    };

    const attach = () => {
      const video = videoRef.current;
      if (!video || attachedVideo === video) return;
      attachedVideo = video;
      const onPlay = () => void sendState(video, "play");
      const onPause = () => void sendState(video, "pause");
      const onSeeked = () => void sendState(video, "seek");
      video.addEventListener("play", onPlay);
      video.addEventListener("pause", onPause);
      video.addEventListener("seeked", onSeeked);
      heartbeat = window.setInterval(() => void sendState(video, "heartbeat"), 2000);
      cleanup = () => {
        if (heartbeat) window.clearInterval(heartbeat);
        video.removeEventListener("play", onPlay);
        video.removeEventListener("pause", onPause);
        video.removeEventListener("seeked", onSeeked);
      };
    };

    let cleanup = () => {};
    const poll = window.setInterval(attach, 150);
    attach();
    return () => { window.clearInterval(poll); cleanup(); };
  }, [isHost]);

  // ── Auto-scroll chat ──────────────────────────────────────────────────────
  useEffect(() => {
    if (chatEndRef.current && chatEndRef.current.parentElement) {
      chatEndRef.current.parentElement.scrollTop = chatEndRef.current.parentElement.scrollHeight;
    }
  }, [messages]);

  // ── Send chat message ─────────────────────────────────────────────────────
  function sendChat(e: React.FormEvent) {
    e.preventDefault();
    playClick(compact);
    const text = chatInput.trim();
    if (!text || (!channelRef.current && !isPreview)) return;
    
    setChatInput("");
    const senderDisplayName = isHost ? hostDisplayName : guestDisplayName;
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: myId,
      senderName: `${isHost ? "🎬" : "🍿"} ${senderDisplayName}`,
      body: text,
      sentAt: Date.now(),
    };
    
    setMessages((prev) => [...prev.slice(-99), msg]);
    if (!isPreview && channelRef.current) {
      void channelRef.current.send({ type: "broadcast", event: "chat_message", payload: msg });
    }
  }

  // ── Control request helpers ───────────────────────────────────────────────
  function sendControlRequest(type: "seek" | "pause" | "play", time?: number) {
    const request: ControlRequest = {
      id: crypto.randomUUID(),
      guestId: myId,
      guestName: isHost ? hostDisplayName : guestDisplayName,
      type,
      time: type === "seek" ? time : videoRef.current?.currentTime,
    };
    void channelRef.current?.send({ type: "broadcast", event: "control_request", payload: request });
    return request.id;
  }

  function cancelControlRequest(requestId?: string) {
    if (!requestId) return;
    void channelRef.current?.send({ type: "broadcast", event: "control_cancel", payload: { requestId } });
  }

  async function respondToRequest(accepted: boolean) {
    if (!pendingRequest || !videoRef.current) return;
    const request = pendingRequest;
    setPendingRequest(null);
    if (accepted) {
      if (request.type === "seek" && typeof request.time === "number") videoRef.current.currentTime = request.time;
      if (request.type === "pause") videoRef.current.pause();
      if (request.type === "play") await videoRef.current.play().catch(() => undefined);
      await channelRef.current?.send({
        type: "broadcast", event: "player_state",
        payload: { reason: request.type, time: videoRef.current.currentTime, paused: videoRef.current.paused, at: Date.now() },
      });
    }
    await channelRef.current?.send({
      type: "broadcast", event: "control_response",
      payload: { requestId: request.id, guestId: request.guestId, accepted },
    });
  }

  function handleEpisodeChange(index: number) {
    if (!isHost) return;
    playClick(compact);
    setCurrentEpIndex(index);
    void channelRef.current?.send({ type: "broadcast", event: "change_episode", payload: { index } });
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div 
      className={`relative w-full h-full flex flex-col overflow-x-hidden overflow-y-auto custom-scrollbar bg-gradient-to-br from-[#fff8fc] via-[#fff0f7] to-[#ffe4f0] text-rose-950 ${compact ? "p-0" : ""}`}
      onMouseMove={resetIdle}
      onTouchStart={resetIdle}
      onMouseLeave={() => setIsIdle(true)}
    >
      {/* Cute background blobs */}
      {!compact && (
        <>
          <div className="pointer-events-none absolute -left-10 top-20 h-40 w-40 rounded-full bg-pink-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -right-8 bottom-32 h-48 w-48 rounded-full bg-rose-200/35 blur-3xl" />
          <div className="pointer-events-none absolute left-1/3 top-1/2 text-2xl opacity-20">💕</div>
          <div className="pointer-events-none absolute right-1/4 top-24 text-xl opacity-15">🌸</div>
          <div className="pointer-events-none absolute bottom-20 left-16 text-lg opacity-15">✨</div>
        </>
      )}

      {/* ── Navbar ── */}
      <div className={`relative flex-shrink-0 z-50 sticky top-0 flex items-center justify-between border-b border-pink-200/50 bg-white/70 backdrop-blur-xl shadow-sm shadow-pink-100/30 transition-all duration-700 ${isIdle ? "opacity-0 -translate-y-1 pointer-events-none" : "opacity-100"} ${compact ? "h-12 px-2" : "h-14 px-4"}`}>
        <div className={`flex items-center ${compact ? "gap-1.5" : "gap-3"}`}>
          {isHost && onBackToLobby && (
            <button onClick={() => { playClick(compact); onBackToLobby(); }} className={`flex items-center font-bold text-white transition-all bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 hover:scale-105 rounded-full shadow-md shadow-pink-300/40 ${compact ? "text-xs px-3 py-1.5 gap-1" : "text-sm px-4 py-1.5 gap-2"}`}>
              <ArrowLeft size={compact ? 14 : 16} /> {compact ? "Thoát" : "Quay lại sảnh"}
            </button>
          )}
          {!isHost && (
            <div className={`flex items-center font-bold text-rose-700 bg-pink-100 rounded-full border border-pink-200 shadow-sm ${compact ? "text-xs px-2 py-1 gap-1" : "text-sm px-4 py-1.5 gap-2"}`}>
              🍿 {compact ? guestDisplayName : `Đang xem cùng ${hostDisplayName}`}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isPreview && (
            <span className={`font-semibold text-rose-500 ${compact ? "hidden" : "hidden sm:inline-block text-xs"}`}>
              💕 {viewerCount} người
            </span>
          )}
          <button
            onClick={() => { playClick(compact); setShowChat(v => !v); }}
            className={`font-bold rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md shadow-pink-300/40 hover:from-pink-500 hover:to-rose-500 transition-all ${compact ? "text-[10px] px-2.5 py-1" : "text-xs px-4 py-1.5"}`}
          >
            💬 Chat {showChat ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className={`relative w-full max-w-[1800px] mx-auto flex flex-col z-10 min-w-0 ${compact ? "p-2 gap-2" : "p-4 lg:p-6 gap-4 lg:gap-6"}`}>
        
        {/* ── TOP ROW: Video/Info & Chat ── */}
        <div className={`flex items-stretch ${compact ? "flex-col gap-2" : "flex-col xl:flex-row gap-4 lg:gap-6"}`}>
          
          {/* Left Column: Video & Info */}
          <div className={`flex-[3] min-w-0 flex flex-col ${compact ? "gap-2" : "gap-4 lg:gap-6"}`}>
            
            {/* Video Container */}
            <div className="w-full aspect-video rounded-2xl lg:rounded-3xl overflow-hidden border-[3px] border-pink-200/80 bg-black shadow-xl shadow-pink-200/40 ring-2 ring-pink-100/60 relative">
              <div className={`pointer-events-none absolute left-4 top-4 z-20 max-w-[70%] transition-all duration-500 ${isIdle ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"}`}>
                <div className="rounded-2xl border border-white/15 bg-black/65 px-4 py-2 backdrop-blur-xl shadow-lg shadow-black/20">
                  <p className="truncate text-[10px] font-black tracking-[0.28em] text-white/75 uppercase">
                    {isHost ? "Chủ phòng" : "Khách"}
                  </p>
                  <p className="mt-0.5 truncate text-sm font-black text-pink-200 sm:text-base">
                    {isHost ? hostDisplayName : guestDisplayName}
                  </p>
                </div>
              </div>
              <VideoPlayer
                src={streamUrl}
                externalRef={videoRef}
                locked={!isHost && !isPreview}
                onRequest={(request) => sendControlRequest(request.type, request.time)}
                onCancelRequest={cancelControlRequest}
                pendingRequest={isHost && !isPreview ? (pendingRequest as PlayerPendingRequest | null) : null}
                onRespondRequest={respondToRequest}
                requestResolutionKey={requestResolutionKey}
                compact={compact}
              />
            </div>

            {/* Info bar & Episodes */}
            <div className={`bg-white/90 backdrop-blur-sm border border-pink-200/70 shadow-lg shadow-pink-100/40 overflow-hidden flex flex-col xl:hidden ${compact ? "rounded-xl" : "rounded-2xl lg:rounded-3xl"}`}>
              <div className={`flex items-center bg-gradient-to-r from-pink-50/80 to-rose-50/50 ${compact ? "px-3 py-2 gap-2" : "px-5 py-4 gap-3"}`}>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className={`text-rose-950 font-black truncate ${compact ? "text-base" : "text-xl lg:text-2xl"}`}>{movie.name}</p>
                  <div className={`flex flex-wrap items-center ${compact ? "gap-1.5 mt-1.5" : "gap-2 mt-2"}`}>
                    {!isPreview && (
                      <span className={`font-bold rounded-full shadow-sm ${compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"} ${isHost ? "bg-gradient-to-r from-rose-400 to-pink-400 text-white" : "bg-gradient-to-r from-pink-300 to-fuchsia-300 text-white"}`}>
                        {isHost ? `🎬 ${hostDisplayName}` : `🍿 ${guestDisplayName}`}
                      </span>
                    )}
                    {episodes.length > 1 && (
                      <>
                        <span className="text-pink-300">•</span>
                        <span className="text-rose-600 font-bold text-sm bg-pink-50 px-3 py-1 rounded-full border border-pink-200">Tập {episodes[currentEpIndex]?.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {isHost && episodes.length > 1 && (
                <div className="px-5 pb-5 overflow-y-auto max-h-64 no-scrollbar custom-scrollbar pt-4">
                  <div className="flex flex-wrap gap-2">
                    {episodes.map((ep, i) => (
                      <button
                        key={i}
                        onClick={() => handleEpisodeChange(i)}
                        className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all ${
                          currentEpIndex === i
                            ? "bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-md shadow-pink-300/50 translate-y-[-1px]"
                            : "bg-pink-50 text-rose-700 hover:bg-pink-100 border border-pink-200 shadow-sm"
                        }`}
                      >
                        Tập {ep.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Chat */}
          {showChat && (
            <div className={`w-full flex-[1] flex-shrink-0 flex flex-col ${compact ? "h-[300px]" : "xl:w-[400px]"}`}>
              <div className={`bg-white/95 backdrop-blur-sm border border-pink-200/80 shadow-xl shadow-pink-100/50 flex flex-col overflow-hidden relative ${compact ? "rounded-xl h-full" : "rounded-2xl lg:rounded-3xl h-[350px] sm:h-[400px] xl:h-full"}`}>
                {/* Chat header */}
                <div className={`border-b border-pink-100 flex-shrink-0 bg-gradient-to-r from-pink-50 to-rose-50 ${compact ? "px-3 py-2" : "px-5 py-4"}`}>
                  <h3 className={`text-rose-800 font-black ${compact ? "text-sm" : "text-base"}`}>💬 Trò chuyện</h3>
                  {!isPreview && (
                    <p className={`text-rose-500/80 font-medium ${compact ? "text-[10px] mt-0.5" : "text-xs mt-1"}`}>
                      {isHost ? `Chỉ ${hostDisplayName} mới điều khiển phim nhé 💕` : `Yêu cầu ${hostDisplayName} để tua/dừng nhé 🌸`}
                    </p>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0 custom-scrollbar bg-gradient-to-b from-white to-pink-50/30">
                  {messages.length === 0 && (
                    <p className="text-rose-400/70 text-sm text-center pt-8 font-semibold">Chưa có tin nhắn nào.<br/>Hãy gửi lời chào nhé! 👋💕</p>
                  )}
                  {messages.map((msg) => {
                    const isMine = msg.senderId === myId;
                    return (
                      <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                          isMine
                            ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-tr-sm shadow-pink-200/40"
                            : "bg-pink-50 text-rose-900 border border-pink-100 rounded-tl-sm"
                        }`}>
                          {!isMine && <p className="text-[10px] text-rose-700 font-black mb-1 uppercase tracking-[0.18em]">{msg.senderName}</p>}
                          <p className="leading-relaxed">{msg.body}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendChat} className={`flex-shrink-0 flex border-t border-pink-100 bg-pink-50/50 ${compact ? "p-2 gap-1.5" : "p-4 gap-2"}`}>
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Nhắn gì đó cute..."
                    className={`flex-1 min-w-0 bg-white border border-pink-200 rounded-full text-rose-950 placeholder:text-rose-400 outline-none focus:border-rose-300 focus:ring-2 focus:ring-pink-100 transition-all font-medium ${compact ? "px-3 py-1.5 text-xs" : "px-5 py-3 text-sm"}`}
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className={`flex-shrink-0 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 disabled:opacity-40 flex items-center justify-center text-white transition-all shadow-md shadow-pink-300/40 disabled:shadow-none ${compact ? "w-8 h-8" : "w-11 h-11"}`}
                  >
                    <Send size={compact ? 14 : 18} className="-ml-0.5" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        <div className="hidden w-full xl:flex">
          <div className="w-full bg-white/90 backdrop-blur-sm border border-pink-200/70 shadow-lg shadow-pink-100/40 overflow-hidden flex flex-col rounded-2xl lg:rounded-3xl">
            <div className="flex items-center bg-gradient-to-r from-pink-50/80 to-rose-50/50 px-5 py-4 gap-3">
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <p className="truncate text-xl lg:text-2xl font-black text-rose-950">{movie.name}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {!isPreview && (
                    <span className={`font-bold rounded-full shadow-sm px-3 py-1 text-xs ${isHost ? "bg-gradient-to-r from-rose-400 to-pink-400 text-white" : "bg-gradient-to-r from-pink-300 to-fuchsia-300 text-white"}`}>
                      {isHost ? `🎬 ${hostDisplayName}` : `🍿 ${guestDisplayName}`}
                    </span>
                  )}
                  {episodes.length > 1 && (
                    <>
                      <span className="text-pink-300">•</span>
                      <span className="text-rose-600 font-bold text-sm bg-pink-50 px-3 py-1 rounded-full border border-pink-200">Tập {episodes[currentEpIndex]?.name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {isHost && episodes.length > 1 && (
              <div className="px-5 pb-5 overflow-y-auto max-h-64 no-scrollbar custom-scrollbar pt-4">
                <div className="flex flex-wrap gap-2">
                  {episodes.map((ep, i) => (
                    <button
                      key={i}
                      onClick={() => handleEpisodeChange(i)}
                      className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all ${
                        currentEpIndex === i
                          ? "bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-md shadow-pink-300/50 translate-y-[-1px]"
                          : "bg-pink-50 text-rose-700 hover:bg-pink-100 border border-pink-200 shadow-sm"
                      }`}
                    >
                      Tập {ep.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── BOTTOM ROW: Suggested Movies ── */}
        {isHost && suggestedMovies.length > 0 && onChangeMovie && (
          <div className={`w-full bg-white/85 backdrop-blur-sm border border-pink-200/70 shadow-lg shadow-pink-100/40 mb-10 ${compact ? "rounded-xl p-3" : "rounded-2xl lg:rounded-3xl p-5"}`}>
            <p className={`text-rose-800 font-black flex items-center gap-2 ${compact ? "text-sm mb-3" : "text-lg mb-4 gap-3"}`}>
              <span className={`bg-gradient-to-b from-pink-400 to-rose-400 rounded-full inline-block ${compact ? "w-1 h-4" : "w-1.5 h-6"}`}></span>
              🎬 Phim đề xuất cho bạn
            </p>
            <div className="flex gap-4 overflow-x-auto pb-5 custom-scrollbar snap-x snap-mandatory scroll-px-2">
              {suggestedMovies.map((m) => (
                <div
                  key={m._id}
                  onClick={() => { playClick(compact); onChangeMovie(m); }}
                  className="flex-shrink-0 w-36 sm:w-40 lg:w-44 cursor-pointer group snap-start"
                >
                  <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-md relative border-2 border-pink-100 ring-1 ring-pink-50 group-hover:border-pink-300 transition-colors">
                    <MediaDisplay src={m.thumb_url} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-rose-950/95 via-rose-950/35 to-transparent opacity-95 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <Play size={40} className="text-white drop-shadow-[0_0_15px_rgba(244,114,182,0.8)] ml-1" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 z-10 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="mb-1 flex flex-wrap items-center gap-1 text-[10px] text-rose-100 font-semibold opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 backdrop-blur-md border border-white/10">
                          <Star size={10} fill="currentColor" />
                          <span>{getSuggestedRatingText(m)}</span>
                        </span>
                        <span className="rounded-full bg-black/40 px-2 py-1 backdrop-blur-md border border-white/10 max-w-[92px] truncate">
                          {getSuggestedGenre(m)}
                        </span>
                        <span className="rounded-full bg-black/40 px-2 py-1 backdrop-blur-md border border-white/10">
                          {m.year}
                        </span>
                        <span className="rounded-full bg-black/40 px-2 py-1 backdrop-blur-md border border-white/10">
                          {getSuggestedVoteCountText(m)}
                        </span>
                      </div>
                      <p className="text-sm font-bold truncate drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]" style={{ color: "#fff" }}>
                        {m.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
