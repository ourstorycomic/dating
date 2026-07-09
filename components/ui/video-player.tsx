"use client";

import Hls from "hls.js";
import { Check, Loader2, Maximize, Minimize, Pause, PictureInPicture2, Play, Volume2, VolumeX, X } from "lucide-react";
import { type ReactNode, type RefObject, useEffect, useRef, useState } from "react";

type PlayerRequest = {
  type: "seek" | "pause" | "play";
  time?: number;
};

export type PlayerPendingRequest = PlayerRequest & {
  id: string;
  guestName: string;
};

type LockableOrientation = ScreenOrientation & {
  lock?: (orientation: "landscape") => Promise<void>;
};

type PictureInPictureDocument = Document & {
  pictureInPictureElement?: Element | null;
  pictureInPictureEnabled?: boolean;
  exitPictureInPicture?: () => Promise<void>;
};

type PictureInPictureVideo = HTMLVideoElement & {
  requestPictureInPicture?: () => Promise<PictureInPictureWindow>;
};

type DocumentPictureInPictureController = {
  requestWindow: (options?: { width?: number; height?: number }) => Promise<Window>;
};

type WindowWithDocumentPictureInPicture = Window & {
  documentPictureInPicture?: DocumentPictureInPictureController;
};

type WatchPartyVideo = HTMLVideoElement & {
  __pmoviesRemoteApplying?: boolean;
  __pmoviesHostState?: { time: number; paused: boolean };
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

export function VideoPlayer({
  src,
  poster,
  externalRef,
  locked = false,
  onRequest,
  onCancelRequest,
  pendingRequest,
  onRespondRequest,
  resumeKey,
  introStart = 0,
  introEnd = 0,
  requestResolutionKey,
  fullscreenOverlay,
  compact = false,
}: {
  src?: string;
  poster?: string;
  externalRef?: RefObject<HTMLVideoElement | null>;
  locked?: boolean;
  onRequest?: (request: PlayerRequest) => string | void;
  onCancelRequest?: (requestId?: string) => void;
  pendingRequest?: PlayerPendingRequest | null;
  onRespondRequest?: (accepted: boolean) => void;
  resumeKey?: string;
  introStart?: number;
  introEnd?: number;
  requestResolutionKey?: string;
  fullscreenOverlay?: ReactNode;
  compact?: boolean;
}) {
  const ownRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = externalRef ?? ownRef;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoSlotRef = useRef<HTMLDivElement | null>(null);
  const documentPipWindowRef = useRef<Window | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [ready, setReady] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [paused, setPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [levels, setLevels] = useState<{ height: number; index: number }[]>([]);
  const [level, setLevel] = useState(-1);
  const [speed, setSpeed] = useState(1);
  const [resumeTime, setResumeTime] = useState<number | null>(null);
  const [localRequest, setLocalRequest] = useState<(PlayerRequest & { id?: string }) | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFakeFullscreen, setIsFakeFullscreen] = useState(false);
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);
  const [hoverProgress, setHoverProgress] = useState<number | null>(null);
  const [pictureInPictureSupported, setPictureInPictureSupported] = useState(false);
  const [streamError, setStreamError] = useState("");
  const hideTimerRef = useRef<number | null>(null);
  const lastLockedStateRef = useRef({ time: 0, paused: true });
  const nativeGuardRef = useRef(false);
  const handlersRef = useRef<any>({});
  handlersRef.current = { togglePlay, cancelLocalRequest, seekTo, onRespondRequest };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    let hls: Hls | null = null;
    setStreamError("");

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        startLevel: 0,
        capLevelToPlayerSize: true,
        maxBufferLength: 20,
        maxMaxBufferLength: 40,
        backBufferLength: 15,
      });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLevels(hls!.levels.map((item, index) => ({ height: item.height, index })).filter((item) => item.height));
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setStreamError(data.type === Hls.ErrorTypes.NETWORK_ERROR ? "This stream is blocked or temporarily unavailable." : "This stream could not be decoded.");
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls?.startLoad();
        }
      });
    } else {
      video.src = src;
    }

    const sync = () => {
      setPaused(video.paused);
      setCurrentTime(video.currentTime || 0);
      setDuration(video.duration || 0);
      setVolume(video.volume);
      setMuted(video.muted);
      setReady(true);
    };
    const onWaiting = () => setBuffering(true);
    const onPlaying = () => { setBuffering(false); sync(); };

    video.addEventListener("loadedmetadata", sync);
    video.addEventListener("timeupdate", sync);
    video.addEventListener("play", onPlaying);
    video.addEventListener("pause", sync);
    video.addEventListener("volumechange", sync);
    video.addEventListener("durationchange", sync);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("canplay", onPlaying);
    const onEnterPictureInPicture = () => setIsPictureInPicture(true);
    const onLeavePictureInPicture = () => setIsPictureInPicture(false);

    video.addEventListener("enterpictureinpicture", onEnterPictureInPicture);
    video.addEventListener("leavepictureinpicture", onLeavePictureInPicture);

    return () => {
      video.removeEventListener("loadedmetadata", sync);
      video.removeEventListener("timeupdate", sync);
      video.removeEventListener("play", onPlaying);
      video.removeEventListener("pause", sync);
      video.removeEventListener("volumechange", sync);
      video.removeEventListener("durationchange", sync);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("canplay", onPlaying);
      video.removeEventListener("enterpictureinpicture", onEnterPictureInPicture);
      video.removeEventListener("leavepictureinpicture", onLeavePictureInPicture);
      hls?.destroy();
      hlsRef.current = null;
    };
  }, [src, videoRef]);

  useEffect(() => {
    const pipDocument = document as PictureInPictureDocument;
    const docPip = window as WindowWithDocumentPictureInPicture;
    queueMicrotask(() => setPictureInPictureSupported(Boolean(pipDocument.pictureInPictureEnabled || docPip.documentPictureInPicture)));
  }, []);

  useEffect(() => {
    if (!resumeKey) return;
    const raw = localStorage.getItem(`pmovies_resume:${resumeKey}`);
    if (!raw) return;
    const saved = JSON.parse(raw) as { time?: number; duration?: number; updated_at?: number };
    if (saved.time && saved.time > 20 && (!saved.duration || saved.time < saved.duration - 30)) {
      queueMicrotask(() => setResumeTime(saved.time!));
    }
  }, [resumeKey]);

  useEffect(() => {
    if (!resumeKey) return;
    const video = videoRef.current;
    if (!video) return;
    const resumeStorageKey = `pmovies_resume:${resumeKey}`;
    const indexKey = "pmovies_resume_index";

    const touchResumeIndex = () => {
      const raw = localStorage.getItem(indexKey);
      const items = raw ? JSON.parse(raw) as string[] : [];
      const next = [resumeStorageKey, ...items.filter((item) => item !== resumeStorageKey)].slice(0, 3);
      for (const stale of items.slice(3)) localStorage.removeItem(stale);
      localStorage.setItem(indexKey, JSON.stringify(next));
    };

    const clearResume = () => {
      localStorage.removeItem(resumeStorageKey);
      const raw = localStorage.getItem(indexKey);
      const items = raw ? JSON.parse(raw) as string[] : [];
      localStorage.setItem(indexKey, JSON.stringify(items.filter((item) => item !== resumeStorageKey)));
    };

    const timer = window.setInterval(() => {
      if (video.duration && video.currentTime > video.duration - 20) {
        clearResume();
        return;
      }
      if (video.currentTime > 5) {
        localStorage.setItem(resumeStorageKey, JSON.stringify({
          time: video.currentTime,
          duration: video.duration || 0,
          updated_at: Date.now(),
        }));
        touchResumeIndex();
      }
    }, 5000);

    video.addEventListener("ended", clearResume);
    return () => {
      window.clearInterval(timer);
      video.removeEventListener("ended", clearResume);
    };
  }, [resumeKey, videoRef]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    onFullscreenChange();
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (requestResolutionKey) queueMicrotask(() => setLocalRequest(null));
  }, [requestResolutionKey]);

  useEffect(() => {
    updateDocumentPictureInPictureUi();
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !locked) return;

    const lockedVideo = video as WatchPartyVideo;
    const isRemoteApplying = () => Boolean(lockedVideo.__pmoviesRemoteApplying);
    const hostState = () => lockedVideo.__pmoviesHostState ?? lastLockedStateRef.current;
    const rememberState = () => {
      if (!nativeGuardRef.current) {
        lastLockedStateRef.current = hostState();
      }
    };
    const restoreHostState = () => {
      nativeGuardRef.current = true;
      const last = hostState();
      if (Math.abs(video.currentTime - last.time) > 0.5) video.currentTime = last.time;
      if (last.paused) {
        video.pause();
      } else {
        void video.play().catch(() => undefined);
      }
      window.setTimeout(() => {
        nativeGuardRef.current = false;
      }, 250);
    };
    const requestNativeChange = (request: PlayerRequest) => {
      if (nativeGuardRef.current || isRemoteApplying()) {
        rememberState();
        return;
      }
      const requestId = onRequest?.(request);
      setLocalRequest({ ...request, id: typeof requestId === "string" ? requestId : undefined });
      restoreHostState();
    };

    const onPlay = () => requestNativeChange({ type: "play", time: hostState().time });
    const onPause = () => {
      if (document.hidden && !document.pictureInPictureElement) return; // Ignore auto-pause when switching tabs, unless in PiP
      requestNativeChange({ type: "pause", time: hostState().time });
    };
    const onSeeking = () => requestNativeChange({ type: "seek", time: video.currentTime });

    video.addEventListener("timeupdate", rememberState);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("seeking", onSeeking);
    return () => {
      video.removeEventListener("timeupdate", rememberState);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("seeking", onSeeking);
    };
  }, [locked, onRequest, videoRef]);

  if (!src) {
    return <div className="flex aspect-video items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-300 backdrop-blur-xl">No HLS stream available.</div>;
  }

  function requestOrRun(request: PlayerRequest, run: () => void) {
    if (locked) {
      const requestId = onRequest?.(request);
      setLocalRequest({ ...request, id: typeof requestId === "string" ? requestId : undefined });
      return;
    }
    run();
  }

  function cancelLocalRequest(event?: React.MouseEvent) {
    event?.stopPropagation();
    onCancelRequest?.(localRequest?.id);
    setLocalRequest(null);
  }

  function visibleRequest() {
    return pendingRequest ?? (localRequest?.type === "seek" ? { ...localRequest, id: localRequest.id ?? "local", guestName: "You" } : null);
  }

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    requestOrRun({ type: video.paused ? "play" : "pause", time: video.currentTime }, () => {
      if (video.paused) void video.play().catch(() => undefined);
      else video.pause();
    });
  }

  function seekTo(time: number) {
    const video = videoRef.current;
    if (!video) return;
    requestOrRun({ type: "seek", time }, () => {
      video.currentTime = time;
    });
  }

  function handleTimeline(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    seekTo(((event.clientX - rect.left) / rect.width) * (duration || 0));
  }

  function handleTimelineHover(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverProgress(Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)));
  }

  function changeVolume(next: number) {
    const video = videoRef.current;
    if (!video) return;
    video.volume = next;
    video.muted = next === 0;
  }

  function changeLevel(next: number) {
    setLevel(next);
    if (hlsRef.current) hlsRef.current.currentLevel = next;
  }

  function changeSpeed(next: number) {
    const video = videoRef.current;
    if (!video || locked) return;
    video.playbackRate = next;
    setSpeed(next);
  }

  function toggleFullscreen() {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
      return;
    }

    if (container.requestFullscreen) {
      void container.requestFullscreen({ navigationUI: "hide" } as FullscreenOptions).catch(() => {
        setIsFakeFullscreen((prev) => !prev);
      });
      return;
    }

    setIsFakeFullscreen((prev) => !prev);
  }

  async function togglePictureInPicture() {
    const video = videoRef.current as PictureInPictureVideo | null;
    const pipDocument = document as PictureInPictureDocument;
    if (!video) return;

    try {
      if (documentPipWindowRef.current) {
        documentPipWindowRef.current.close();
        return;
      }
      const openedDocumentPip = await openDocumentPictureInPicture(video);
      if (openedDocumentPip) return;
      if (pipDocument.pictureInPictureElement) {
        await pipDocument.exitPictureInPicture?.();
        return;
      }
      if (!pipDocument.pictureInPictureEnabled) return;
      if (document.fullscreenElement) await document.exitFullscreen();
      await video.requestPictureInPicture?.();
    } catch {
      setIsPictureInPicture(Boolean(pipDocument.pictureInPictureElement));
    }
  }

  async function openDocumentPictureInPicture(video: HTMLVideoElement) {
    const api = (window as WindowWithDocumentPictureInPicture).documentPictureInPicture;
    if (!api) return false;
    if (document.fullscreenElement) await document.exitFullscreen();

    const pipWindow = await api.requestWindow({ width: 760, height: 430 });
    documentPipWindowRef.current = pipWindow;
    setIsPictureInPicture(true);

    pipWindow.document.body.innerHTML = `
      <style>
        html, body { margin: 0; height: 100%; overflow: hidden; background: #030712; font-family: ui-sans-serif, system-ui, sans-serif; color: white; }
        .shell { position: relative; height: 100vh; width: 100vw; background: black; }
        .video-slot, video { height: 100%; width: 100%; }
        video { object-fit: contain; background: black; }
        .shade { pointer-events: none; position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,.85), transparent 42%, rgba(0,0,0,.25)); }
        .controls { position: absolute; inset-inline: 0; bottom: 0; padding: 12px; display: grid; gap: 10px; transition: opacity .25s, transform .25s; }
        .shell.idle { cursor: none; }
        .shell.idle .controls, .shell.idle .request-card { opacity: 0; transform: translateY(10px); pointer-events: none; }
        .timeline { height: 20px; cursor: pointer; display: flex; align-items: center; }
        .track { position: relative; height: 5px; flex: 1; border-radius: 999px; background: rgba(255,255,255,.22); }
        .progress { height: 100%; width: 0%; border-radius: inherit; background: #f472b6; box-shadow: 0 0 18px rgba(244,114,182,.65); }
        .marker { display: none; position: absolute; top: 50%; height: 17px; width: 4px; transform: translateY(-50%); border-radius: 999px; background: #fcd34d; box-shadow: 0 0 16px rgba(252,211,77,.85); }
        .bubble { position: absolute; bottom: 18px; left: 50%; transform: translateX(-50%); white-space: nowrap; border: 1px solid rgba(252,211,77,.28); background: rgba(0,0,0,.78); border-radius: 8px; padding: 7px 9px; font-size: 12px; color: #fef3c7; backdrop-filter: blur(14px); }
        .row { display: flex; align-items: center; gap: 10px; }
        button { border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.1); color: white; border-radius: 8px; height: 34px; min-width: 34px; font-weight: 800; cursor: pointer; }
        select { height: 34px; border-radius: 8px; border: 1px solid rgba(255,255,255,.1); background: rgba(0,0,0,.62); color: white; }
        .time { min-width: 78px; font-size: 13px; font-weight: 700; }
        .request-card { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: none; align-items: center; gap: 10px; border: 1px solid rgba(252,211,77,.28); background: rgba(0,0,0,.72); color: #fef3c7; border-radius: 10px; padding: 10px 12px; box-shadow: 0 18px 40px rgba(0,0,0,.4); backdrop-filter: blur(16px); }
        .cancel { background: rgba(244,63,94,.78); }
        .accept { background: rgba(52,211,153,.78); color: #022c22; }
        .reject { background: rgba(244,63,94,.78); color: white; }
        .actions { display: none; gap: 6px; }
        .loader { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: none; color: #f472b6; animation: spin 1s linear infinite; pointer-events: none; }
        @keyframes spin { 100% { transform: translate(-50%, -50%) rotate(360deg); } }
      </style>
      <div class="shell">
        <div class="video-slot"></div>
        <div class="shade"></div>
        <div class="loader"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></div>
        <div class="request-card">
          <span class="request-text"></span>
          <button class="cancel">×</button>
          <div class="actions"><button class="accept">✔</button><button class="reject">✖</button></div>
        </div>
        <div class="controls">
          <div class="timeline"><div class="track"><div class="progress"></div><div class="marker"><div class="bubble"><span class="bubble-text"></span><div class="actions" style="display:inline-flex;margin-left:8px;vertical-align:middle;"><button class="accept" style="height:24px;min-width:24px;font-size:10px;">✔</button><button class="reject" style="height:24px;min-width:24px;font-size:10px;">✖</button></div></div></div></div></div>
          <div class="row"><button class="play">▶</button><span class="time">0:00</span><button class="mute">🔊</button><select class="quality"><option value="-1">Auto</option></select><button class="close">×</button></div>
        </div>
      </div>
    `;

    const shell = pipWindow.document.querySelector(".shell") as HTMLElement;
    const slot = pipWindow.document.querySelector(".video-slot");
    slot?.append(video);
    video.className = "";

    const onClose = () => {
      videoSlotRef.current?.append(video);
      video.className = "h-full w-full object-contain";
      documentPipWindowRef.current = null;
      setIsPictureInPicture(false);
    };

    let idleTimer: number | null = null;
    const showControls = () => {
      shell.classList.remove("idle");
      if (idleTimer) pipWindow.clearTimeout(idleTimer);
      idleTimer = pipWindow.setTimeout(() => shell.classList.add("idle"), 2600);
    };
    shell.addEventListener("mousemove", showControls);
    shell.addEventListener("click", (e) => {
      showControls();
      if (e.target === shell || e.target === slot || e.target === video) {
        handlersRef.current.togglePlay();
      }
    });
    showControls();

    (pipWindow.document.querySelector(".play") as HTMLButtonElement).onclick = () => handlersRef.current.togglePlay();
    (pipWindow.document.querySelector(".mute") as HTMLButtonElement).onclick = () => { video.muted = !video.muted; };
    (pipWindow.document.querySelector(".close") as HTMLButtonElement).onclick = () => pipWindow.close();
    (pipWindow.document.querySelector(".cancel") as HTMLButtonElement).onclick = () => handlersRef.current.cancelLocalRequest();
    pipWindow.document.querySelectorAll(".accept").forEach(el => (el as HTMLButtonElement).onclick = (e) => { e.stopPropagation(); handlersRef.current.onRespondRequest?.(true); });
    pipWindow.document.querySelectorAll(".reject").forEach(el => (el as HTMLButtonElement).onclick = (e) => { e.stopPropagation(); handlersRef.current.onRespondRequest?.(false); });
    (pipWindow.document.querySelector(".timeline") as HTMLElement).onclick = (event) => {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      handlersRef.current.seekTo(((event.clientX - rect.left) / rect.width) * (video.duration || 0));
    };
    const quality = pipWindow.document.querySelector(".quality") as HTMLSelectElement;
    quality.onchange = () => changeLevel(Number(quality.value));

    pipWindow.addEventListener("pagehide", onClose, { once: true });
    updateDocumentPictureInPictureUi();
    return true;
  }

  function updateDocumentPictureInPictureUi() {
    const pipWindow = documentPipWindowRef.current;
    if (!pipWindow) return;
    const progressValue = duration ? (currentTime / duration) * 100 : 0;
    const request = visibleRequest();
    const requestPercent = request?.type === "seek" && duration ? ((request.time ?? 0) / duration) * 100 : null;

    const progressEl = pipWindow.document.querySelector(".progress") as HTMLElement | null;
    const markerEl = pipWindow.document.querySelector(".marker") as HTMLElement | null;
    const bubbleEl = pipWindow.document.querySelector(".bubble") as HTMLElement | null;
    const requestCard = pipWindow.document.querySelector(".request-card") as HTMLElement | null;
    const requestText = pipWindow.document.querySelector(".request-text") as HTMLElement | null;
    const playButton = pipWindow.document.querySelector(".play") as HTMLButtonElement | null;
    const muteButton = pipWindow.document.querySelector(".mute") as HTMLButtonElement | null;
    const timeEl = pipWindow.document.querySelector(".time") as HTMLElement | null;
    const quality = pipWindow.document.querySelector(".quality") as HTMLSelectElement | null;
    const loader = pipWindow.document.querySelector(".loader") as HTMLElement | null;

    if (loader) loader.style.display = (!ready || buffering) && !streamError ? "block" : "none";
    if (progressEl) progressEl.style.width = `${progressValue}%`;
    if (playButton) playButton.textContent = paused ? "▶" : "Ⅱ";
    if (muteButton) muteButton.textContent = muted || volume === 0 ? "🔇" : "🔊";
    if (timeEl) timeEl.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    if (quality && quality.options.length !== levels.length + 1) {
      quality.innerHTML = `<option value="-1">Auto</option>${levels.map((item) => `<option value="${item.index}">${item.height}p</option>`).join("")}`;
      quality.value = String(level);
    }

    if (markerEl && bubbleEl) {
      markerEl.style.display = requestPercent === null ? "none" : "block";
      if (requestPercent !== null) {
        markerEl.style.left = `${requestPercent}%`;
        const text = bubbleEl.querySelector(".bubble-text");
        if (text) text.textContent = `${request?.guestName ?? "You"} requests ${formatTime(request?.time ?? 0)}`;
        
        const actions = bubbleEl.querySelector(".actions") as HTMLElement | null;
        if (actions) actions.style.display = pendingRequest ? "inline-flex" : "none";
      }
    }
    if (requestCard && requestText) {
      const showLocalCard = Boolean(locked && localRequest && localRequest.type !== "seek");
      const showPendingCard = Boolean(pendingRequest && pendingRequest.type !== "seek");
      requestCard.style.display = (showLocalCard || showPendingCard) ? "flex" : "none";
      if (showPendingCard) {
        requestText.textContent = `${pendingRequest!.guestName} requests ${pendingRequest!.type}`;
        (requestCard.querySelector(".cancel") as HTMLElement).style.display = "none";
        (requestCard.querySelector(".actions") as HTMLElement).style.display = "flex";
      } else if (showLocalCard) {
        requestText.textContent = `You requested ${localRequest?.type}`;
        (requestCard.querySelector(".cancel") as HTMLElement).style.display = "block";
        (requestCard.querySelector(".actions") as HTMLElement).style.display = "none";
      }
    }
  }

  function showControlsTemporarily() {
    setControlsVisible(true);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 2600);
  }

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const shownRequest = visibleRequest();
  const requestProgress = shownRequest?.type === "seek" && duration ? ((shownRequest.time ?? 0) / duration) * 100 : null;
  const showSkipIntro = introEnd > introStart && currentTime >= Math.max(0, introStart - 1) && currentTime < introEnd - 4;

  return (
    <div
      ref={containerRef}
      onMouseMove={showControlsTemporarily}
      onMouseEnter={showControlsTemporarily}
      onTouchStart={showControlsTemporarily}
      className={`pmovies-player group ${(isFullscreen || isFakeFullscreen) ? "fixed inset-0 z-[9999] overflow-hidden rounded-none bg-black" : "relative aspect-video overflow-hidden rounded-md bg-black shadow-2xl shadow-black/60"} ${controlsVisible ? "cursor-auto" : "cursor-none"}`}
    >
      <div ref={videoSlotRef} className="absolute inset-0">
        <video ref={videoRef} poster={poster} playsInline muted={locked} preload="auto" className="h-full w-full object-contain" />
      </div>
      <button type="button" onClick={togglePlay} className="absolute inset-0 z-10" aria-label={locked ? "Request playback change" : "Toggle playback"} />
      <div className={`pointer-events-none absolute inset-0 transition ${isFullscreen || isFakeFullscreen ? "bg-gradient-to-t from-black/65 via-transparent to-black/5" : "bg-gradient-to-t from-black/90 via-transparent to-black/15"}`} />
      {(!ready || buffering) && !streamError && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center text-pink-400 drop-shadow-[0_0_12px_rgba(244,114,182,0.8)]">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      )}
      {streamError && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/45 p-4 text-center backdrop-blur-sm">
          <div className="max-w-md rounded-md border border-rose-400/25 bg-black/75 px-4 py-3 text-sm text-rose-100 shadow-2xl">
            {streamError}
          </div>
        </div>
      )}
      {resumeTime !== null && !locked && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="rounded-md border border-white/10 bg-black/80 p-4 text-white shadow-2xl">
            <p className="font-bold">Resume from {formatTime(resumeTime)}?</p>
            <div className="mt-3 flex gap-2">
              <button className="rounded-md bg-pink-400 px-3 py-2 text-sm font-bold text-slate-950" onClick={() => { seekTo(resumeTime); setResumeTime(null); }}>Resume</button>
              <button className="rounded-md bg-white/10 px-3 py-2 text-sm" onClick={() => setResumeTime(null)}>Start over</button>
            </div>
          </div>
        </div>
      )}
      {pendingRequest && pendingRequest.type !== "seek" && (
        <div className="absolute inset-0 z-30 flex pointer-events-none items-center justify-center">
          <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-amber-300/40 bg-slate-900/90 px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <div className="rounded-md bg-amber-300 p-2 text-slate-950">{pendingRequest.type === "play" ? <Play size={18} /> : <Pause size={18} />}</div>
            <div className="text-white">
              <p className="text-sm font-bold text-white">{pendingRequest.guestName}</p>
              <p className="text-xs text-amber-100">yêu cầu {pendingRequest.type === "play" ? "phát" : "dừng"}</p>
            </div>
            <button onClick={() => onRespondRequest?.(true)} className="rounded-md bg-emerald-400 p-2 text-slate-950"><Check size={16} /></button>
            <button onClick={() => onRespondRequest?.(false)} className="rounded-md bg-rose-400 p-2 text-white"><X size={16} /></button>
          </div>
        </div>
      )}
      {locked && localRequest && localRequest.type !== "seek" && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-amber-300/40 bg-slate-900/90 px-4 py-3 text-amber-50 shadow-2xl backdrop-blur-xl">
            <span className="font-semibold text-amber-50">Đã gửi yêu cầu: {localRequest.type === "play" ? "phát" : "dừng"}</span>
            <button onClick={cancelLocalRequest} className="rounded-md bg-white/15 p-1.5 text-white hover:bg-rose-400">
              <X size={14} />
            </button>
          </div>
        </div>
      )}
      {showSkipIntro && (
        <button
          type="button"
          onClick={() => seekTo(introEnd)}
          className="absolute bottom-20 right-3 z-30 rounded-md border border-pink-400/30 bg-black/70 px-3 py-2 text-xs font-bold text-pink-100 shadow-xl backdrop-blur-xl hover:bg-pink-400 hover:text-slate-950 sm:bottom-24 sm:right-4 sm:px-4 sm:text-sm"
        >
          Skip intro
        </button>
      )}
      
      {/* ── Skip Ads Button ── */}
      {currentTime >= 901 && currentTime < 934 && (
        <button
          type="button"
          onClick={() => seekTo(934)}
          className="absolute bottom-20 right-3 z-30 rounded-md border border-pink-400/30 bg-black/70 px-4 py-2 text-xs font-bold text-pink-100 shadow-xl backdrop-blur-xl hover:bg-pink-400 hover:text-slate-950 sm:bottom-24 sm:right-4 sm:px-5 sm:text-sm transition-all animate-in fade-in slide-in-from-right-4"
        >
          Skip Ad / Bỏ qua quảng cáo
        </button>
      )}

      {fullscreenOverlay && (isFullscreen || isFakeFullscreen) && (
        <div className={`pointer-events-none absolute right-3 top-3 z-30 hidden w-[min(340px,32vw)] transition duration-300 md:block ${controlsVisible ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"}`}>
          <div className="pointer-events-auto">{fullscreenOverlay}</div>
        </div>
      )}
      <div className={`absolute inset-x-0 bottom-0 z-20 space-y-2 p-2 transition duration-300 sm:space-y-3 sm:p-4 ${controlsVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>
        <div onClick={handleTimeline} onMouseMove={handleTimelineHover} onMouseLeave={() => setHoverProgress(null)} className="group/timeline h-7 cursor-pointer py-3 sm:h-6 sm:py-2">
          <div className="relative h-1.5 rounded-full bg-white/20">
            {hoverProgress !== null && (
              <div
                className="absolute bottom-full mb-2 -translate-x-1/2 rounded bg-pink-500 px-2.5 py-1 text-[10px] sm:text-xs font-bold text-white shadow-lg shadow-pink-500/30 transition-all pointer-events-none whitespace-nowrap"
                style={{ left: `${hoverProgress * 100}%` }}
              >
                {formatTime(hoverProgress * duration)}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-pink-500"></div>
              </div>
            )}
            <div className="h-full rounded-full bg-pink-400 shadow-[0_0_18px_rgba(244,114,182,.65)]" style={{ width: `${progress}%` }} />
            {requestProgress !== null && (
              <div className="absolute top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-amber-300 shadow-[0_0_16px_rgba(252,211,77,.85)]" style={{ left: `${requestProgress}%` }}>
                <div className="absolute bottom-5 left-1/2 w-44 -translate-x-1/2 rounded-lg border border-amber-300/40 bg-slate-900/95 p-2.5 text-xs shadow-xl backdrop-blur-xl sm:w-52">
                  <p className="font-bold text-amber-50">
                    {shownRequest?.guestName} {pendingRequest ? "yêu cầu tua" : "đã yêu cầu tua"} {formatTime(shownRequest?.time ?? 0)}
                  </p>
                  {pendingRequest && (
                    <div className="mt-2 flex gap-2">
                      <button onClick={(event) => { event.stopPropagation(); onRespondRequest?.(true); }} className="rounded-md bg-emerald-400 p-1.5 text-slate-950"><Check size={14} /></button>
                      <button onClick={(event) => { event.stopPropagation(); onRespondRequest?.(false); }} className="rounded-md bg-rose-400 p-1.5 text-white"><X size={14} /></button>
                    </div>
                  )}
                  {!pendingRequest && localRequest?.type === "seek" && (
                    <button onClick={cancelLocalRequest} className="mt-2 rounded-md bg-white/15 p-1.5 text-white hover:bg-rose-400">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-nowrap items-center gap-1 sm:gap-2 text-white overflow-x-auto no-scrollbar pmovies-controls-scroll">
          <button type="button" onClick={togglePlay} className={`shrink-0 rounded-md p-1.5 sm:p-2 transition-colors ${compact ? "bg-pink-500 hover:bg-pink-400" : "bg-pink-500/80 hover:bg-pink-500"}`}>
            {paused ? <Play size={compact ? 14 : 16} fill="currentColor" /> : <Pause size={compact ? 14 : 16} fill="currentColor" />}
          </button>
          <span className={`shrink-0 font-bold tracking-wide ${compact ? "min-w-[3rem] text-[9px]" : "min-w-[3.5rem] text-[10px] sm:text-[11px]"}`} style={{ color: "white", textShadow: "0px 2px 4px rgba(0,0,0,0.8), 0px 0px 10px rgba(0,0,0,0.6)" }}>
            {formatTime(currentTime)} <span className="hidden sm:inline" style={{ color: "rgba(255,255,255,0.7)" }}>/ {formatTime(duration)}</span>
          </span>
          <button type="button" onClick={() => { const video = videoRef.current; if (video) video.muted = !video.muted; }} className={`shrink-0 rounded-md p-1.5 sm:p-2 transition-colors ${compact ? "bg-pink-500 hover:bg-pink-400" : "bg-pink-500/80 hover:bg-pink-500"}`}>
            {muted || volume === 0 ? <VolumeX size={compact ? 14 : 16} /> : <Volume2 size={compact ? 14 : 16} />}
          </button>
          
          {!compact && (
            <>
              <input type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume} onChange={(event) => changeVolume(Number(event.target.value))} className="pmovies-range accent-pink-500 w-16 hidden md:block shrink-0" />
              
              {!locked && (
                <select value={speed} onChange={(event) => changeSpeed(Number(event.target.value))} className="rounded-md bg-pink-500 hover:bg-pink-400 text-white font-bold appearance-none text-center px-1.5 py-1 text-[10px] sm:text-xs cursor-pointer shadow-sm hidden sm:block shrink-0">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((item) => <option key={item} value={item} className="bg-slate-900 text-white">{item}x</option>)}
                </select>
              )}
              
              <select value={level} onChange={(event) => changeLevel(Number(event.target.value))} className="min-w-0 rounded-md bg-pink-500 hover:bg-pink-400 text-white font-bold appearance-none text-center px-1.5 py-1 text-[10px] sm:text-xs cursor-pointer shadow-sm hidden md:block shrink-0">
                <option value={-1} className="bg-slate-900 text-white">Auto</option>
                {levels.map((item) => <option key={item.index} value={item.index} className="bg-slate-900 text-white">{item.height}p</option>)}
              </select>
              
              {pictureInPictureSupported && (
                <button type="button" onClick={togglePictureInPicture} className="shrink-0 rounded-md p-1.5 sm:p-2 transition-colors bg-pink-500/80 hover:bg-pink-500 hidden sm:block" title={isPictureInPicture ? "Close mini player" : "Mini player"}>
                  <PictureInPicture2 size={16} className={isPictureInPicture ? "text-pink-200" : undefined} />
                </button>
              )}
            </>
          )}
          
          <button type="button" onClick={toggleFullscreen} className={`ml-auto shrink-0 rounded-md p-1.5 sm:p-2 transition-colors ${compact ? "bg-pink-500 hover:bg-pink-400" : "bg-pink-500/80 hover:bg-pink-500"}`}>
            {(isFullscreen || isFakeFullscreen) ? <Minimize size={compact ? 14 : 16} /> : <Maximize size={compact ? 14 : 16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
