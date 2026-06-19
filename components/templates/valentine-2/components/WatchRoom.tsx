"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { VideoPlayer, type PlayerPendingRequest } from "@/components/ui/video-player";
import { createClient } from "@/lib/supabase/client";
import { Send, ArrowLeft, ListVideo, Play } from "lucide-react";

// ── Stable per-tab presence ID (survives re-renders, not page refreshes) ──────
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
  onBackToLobby,
  onChangeMovie,
}: {
  roomId: string;
  movie: { name: string; slug: string };
  isHost: boolean;
  guestName?: string;
  onBackToLobby?: () => void;
  onChangeMovie?: (movie: any) => void;
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

  const [streamUrl, setStreamUrl] = useState("");
  const [pendingRequest, setPendingRequest] = useState<ControlRequest | null>(null);
  const [requestResolutionKey, setRequestResolutionKey] = useState("");
  const [viewerCount, setViewerCount] = useState(1);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [showChat, setShowChat] = useState(true);

  const [episodes, setEpisodes] = useState<{name: string, link_m3u8: string}[]>([]);
  const [currentEpIndex, setCurrentEpIndex] = useState(0);
  const [suggestedMovies, setSuggestedMovies] = useState<any[]>([]);

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
         const imageDomain = "https://phimimg.com/";
         const items = data.data?.items || [];
         const formatted = items.slice(0, 12).map((m: any) => ({
            _id: m._id,
            name: m.name,
            slug: m.slug,
            thumb_url: m.thumb_url?.startsWith("http") ? m.thumb_url : `${imageDomain}${m.thumb_url}`,
            poster_url: m.poster_url?.startsWith("http") ? m.poster_url : `${imageDomain}${m.poster_url}`,
            year: m.year,
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
    const channel = supabase
      .channel(`watch-room:${roomId}`, {
        config: { presence: { key: myId } },
      })
      // ── Sync playback state (guest only) ──
      .on("broadcast", { event: "player_state" }, ({ payload }) => {
        if (isHost || !videoRef.current) return;
        const video = videoRef.current as HTMLVideoElement & { __pmoviesRemoteApplying?: boolean, __pmoviesHostState?: { time: number, paused: boolean } };
        applyingRemoteRef.current = true;
        video.__pmoviesRemoteApplying = true;
        video.__pmoviesHostState = { time: payload.time, paused: payload.paused };
        if (typeof payload.time === "number" && Math.abs(video.currentTime - payload.time) > 0.75)
          video.currentTime = payload.time;
        if (payload.paused === false) void video.play().catch(() => undefined);
        if (payload.paused === true) video.pause();
        window.setTimeout(() => {
          applyingRemoteRef.current = false;
          video.__pmoviesRemoteApplying = false;
        }, 400);
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
            name: guestName,
            is_host: isHost,
            joined_at: new Date().toISOString(),
          });
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

  // ── Host: broadcast playback state ───────────────────────────────────────
  useEffect(() => {
    if (!isHost) return;
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
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send chat message ─────────────────────────────────────────────────────
  function sendChat(e: React.FormEvent) {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text || !channelRef.current) return;
    setChatInput("");
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: myId,
      senderName: isHost ? "🎬 " + guestName : "🍿 " + guestName,
      body: text,
      sentAt: Date.now(),
    };
    setMessages((prev) => [...prev.slice(-99), msg]);
    void channelRef.current.send({ type: "broadcast", event: "chat_message", payload: msg });
  }

  // ── Control request helpers ───────────────────────────────────────────────
  function sendControlRequest(type: "seek" | "pause" | "play", time?: number) {
    const request: ControlRequest = {
      id: crypto.randomUUID(),
      guestId: myId,
      guestName,
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
    setCurrentEpIndex(index);
    void channelRef.current?.send({ type: "broadcast", event: "change_episode", payload: { index } });
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100 overflow-y-auto custom-scrollbar text-rose-950">
      {/* ── Navbar ── */}
      <div className="flex-shrink-0 h-14 bg-white/60 backdrop-blur-xl border-b border-pink-200/60 flex items-center justify-between px-4 z-50 sticky top-0">
        <div className="flex items-center gap-3">
          {isHost && onBackToLobby && (
            <button onClick={onBackToLobby} className="flex items-center gap-2 text-rose-700 hover:text-rose-950 transition-colors text-sm font-bold bg-white/60 hover:bg-white/90 px-3 py-1.5 rounded-full shadow-sm">
              <ArrowLeft size={16} /> Quay lại sảnh
            </button>
          )}
          {!isHost && (
            <div className="flex items-center gap-2 text-rose-700 text-sm font-bold bg-white/60 px-3 py-1.5 rounded-full shadow-sm">
              🍿 Đang xem cùng Host
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-rose-700/80 text-xs font-bold">
            {viewerCount} người trong phòng
          </span>
          <button
            onClick={() => setShowChat(v => !v)}
            className="text-xs font-bold px-4 py-1.5 rounded-full bg-rose-500 text-white shadow-lg shadow-rose-200/50 hover:bg-rose-400 transition-colors"
          >
            💬 Chat {showChat ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="w-full max-w-[1600px] mx-auto p-4 lg:p-6 flex flex-col gap-6 z-10">
        
        {/* ── TOP ROW: Video/Info & Chat ── */}
        <div className="flex flex-col xl:flex-row gap-6 items-stretch">
          
          {/* Left Column: Video & Info */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">
            
            {/* Video Container */}
            <div className="w-full aspect-video bg-black rounded-3xl shadow-2xl overflow-hidden border border-rose-900/50 relative">
              <VideoPlayer
                src={streamUrl}
                externalRef={videoRef}
                locked={!isHost}
                onRequest={(request) => sendControlRequest(request.type, request.time)}
                onCancelRequest={cancelControlRequest}
                pendingRequest={isHost ? (pendingRequest as PlayerPendingRequest | null) : null}
                onRespondRequest={respondToRequest}
                requestResolutionKey={requestResolutionKey}
              />
            </div>

            {/* Info bar & Episodes */}
            <div className="bg-white/60 backdrop-blur-xl border border-pink-200/60 rounded-3xl shadow-lg overflow-hidden flex flex-col">
              <div className="px-5 py-4 flex items-center gap-3">
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="text-rose-950 font-black text-xl lg:text-2xl truncate">{movie.name}</p>
                  <div className="text-xs mt-2 flex flex-wrap items-center gap-2">
                    <span className={`font-bold px-2.5 py-1 rounded-md shadow-sm ${isHost ? "bg-rose-500 text-white" : "bg-fuchsia-500 text-white"}`}>
                      {isHost ? "HOST" : "GUEST"}
                    </span>
                    {episodes.length > 1 && (
                      <>
                        <span className="text-rose-400 opacity-60">•</span>
                        <span className="text-rose-700/80 font-bold text-sm">Tập {episodes[currentEpIndex]?.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {isHost && episodes.length > 1 && (
                <div className="px-5 pb-5 overflow-y-auto max-h-64 no-scrollbar custom-scrollbar border-t border-pink-100/50 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {episodes.map((ep, i) => (
                      <button
                        key={i}
                        onClick={() => handleEpisodeChange(i)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          currentEpIndex === i
                            ? "bg-rose-500 text-white shadow-[0_4px_15px_rgba(244,63,94,0.4)] translate-y-[-2px]"
                            : "bg-white text-rose-900 hover:bg-pink-50 border border-pink-200 shadow-sm hover:shadow-md"
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
            <div className="w-full xl:w-[400px] flex-shrink-0 flex flex-col">
              <div className="bg-white/90 backdrop-blur-xl border border-pink-200/60 rounded-3xl shadow-lg flex flex-col h-[500px] xl:h-full overflow-hidden">
                {/* Chat header */}
                <div className="px-5 py-4 border-b border-pink-100 flex-shrink-0 bg-white/50">
                  <h3 className="text-rose-950 font-black text-base">💬 Trò chuyện</h3>
                  <p className="text-rose-600/80 text-xs mt-1 font-medium">
                    {isHost ? "Chỉ Host mới điều khiển phim" : "Yêu cầu Host để tua/dừng"}
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0 custom-scrollbar">
                  {messages.length === 0 && (
                    <p className="text-rose-500/80 text-sm text-center pt-8 font-semibold">Chưa có tin nhắn nào.<br/>Hãy gửi lời chào nhé! 👋</p>
                  )}
                  {messages.map((msg) => {
                    const isMine = msg.senderId === myId;
                    return (
                      <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-md ${
                          isMine
                            ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-tr-sm"
                            : "bg-white text-rose-950 border border-pink-100 rounded-tl-sm"
                        }`}>
                          {!isMine && (
                            <p className="text-[10px] text-fuchsia-600 font-black mb-1 uppercase tracking-wider">{msg.senderName}</p>
                          )}
                          <p className="leading-relaxed">{msg.body}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendChat} className="flex-shrink-0 flex gap-2 p-4 border-t border-pink-100 bg-white/50">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Nhắn gì đó..."
                    className="flex-1 min-w-0 bg-white border border-pink-200 rounded-full px-5 py-3 text-sm text-rose-950 placeholder:text-rose-300 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 disabled:opacity-40 flex items-center justify-center text-white transition-all shadow-[0_4px_12px_rgba(244,63,94,0.4)] disabled:shadow-none"
                  >
                    <Send size={18} className="-ml-0.5" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* ── BOTTOM ROW: Suggested Movies ── */}
        {isHost && suggestedMovies.length > 0 && onChangeMovie && (
          <div className="w-full bg-white/60 backdrop-blur-xl border border-pink-200/60 rounded-3xl shadow-lg p-5">
            <p className="text-rose-950 text-base font-black mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-rose-500 rounded-full inline-block"></span>
              Phim đề xuất cho bạn
            </p>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar custom-scrollbar">
              {suggestedMovies.map((m) => (
                <div
                  key={m._id}
                  onClick={() => onChangeMovie(m)}
                  className="flex-shrink-0 w-36 lg:w-40 cursor-pointer group"
                >
                  <div className="w-full aspect-[2/3] rounded-xl overflow-hidden shadow-md mb-2 relative border border-pink-200">
                    <img src={m.thumb_url} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-rose-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play size={32} className="text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <p className="text-sm text-rose-950 font-bold truncate group-hover:text-rose-600 transition-colors">{m.name}</p>
                  <p className="text-[11px] text-rose-500 font-semibold">{m.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
