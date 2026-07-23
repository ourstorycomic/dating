"use client";

import "@/app/templates.css";
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import type { BirthdayMagicExperienceProps, BirthdayPhase } from "./types";
import { PHASES } from "./types";
import { TemplateNavigator } from "../TemplateNavigator";
import { MODELS, FIRST_PAINT_MODELS, DEFAULT_BIRTHDAY_MUSIC, TOUCH_SOUND } from "./models";
import {
  Model,
  NormalizedModel,
  CameraRig,
  DreamLights,
  DreamSparkles,
  TwinkleGarland,
  LightBulbGlow,
  HeroLightSwitch,
  ComicCallout,
  CartoonPop,
  RotatableGramophone,
  MusicNotes,
  MusicCatWalk,
  CandleSequence,
  HangingGallery,
  GiftFinale,
  BirthdayBanner,
  MagicDecorWand,
  CakeBackgroundEffects,
  RotatableCake,
  CelebrationEffects,
  CakeSet,
  BalloonShower,
  prepareScene
} from "./components";

function ConfettiOverlay({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-3 w-3"
          style={{
            background: ["#ff7eb3", "#ff758c", "#ff9a9e", "#fecfef", "#ffcc00", "#73e8ff"][i % 6],
            left: `${Math.random() * 100}%`,
            top: "-5%",
            borderRadius: i % 3 === 0 ? "50%" : "0%",
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 300],
            rotate: [0, Math.random() * 720 + 360],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function BirthdayScene({
  recipientName,
  finalMessage,
  memories,
  messages,
  musicUrl,
  age,
  compact = false,
  autoPlay = false,
  isBuilderPreview = false,
  instructionText,
  wishPromptText,
  recordingText,
  giftPromptText,
  bannerTitle,
  bannerName,
  forceStep,
  onStepChange,
  onResponse,
  hideNavigation,
}: {
  recipientName: string;
  finalMessage: string;
  memories: { imageUrl: string; message: string }[];
  messages: string[];
  musicUrl?: string;
  age: number;
  compact?: boolean;
  autoPlay?: boolean;
  isBuilderPreview?: boolean;
  instructionText?: string;
  wishPromptText?: string;
  recordingText?: string;
  giftPromptText?: string;
  bannerTitle?: string;
  bannerName?: string;
  forceStep?: number;
  onStepChange?: (step: number, total: number) => void;
  onResponse?: (res: any) => void;
  hideNavigation?: boolean;
}) {
  const [phase, setPhase] = useState<BirthdayPhase>("dark");

  useEffect(() => {
    if (forceStep !== undefined) {
      if (forceStep >= 0 && forceStep < PHASES.length) {
        // Reset all overlay/transition states when jumping phases so we don't get stuck in a black screen
        setBlackout(false);
        setWhiteout(false);
        setCircleWipeActive(false);
        setBalloonCoverActive(false);
        setVintageElapsed(0);
        setPhase(PHASES[forceStep] as BirthdayPhase);
      }
    }
  }, [forceStep]);

  useEffect(() => {
    const currentStep = PHASES.indexOf(phase);
    onStepChange?.(currentStep, PHASES.length - 1);
  }, [phase, onStepChange]);

  const [musicActive, setMusicActive] = useState(false);
  const [catChanged, setCatChanged] = useState(false);

  // Transition overlays
  const [balloonCoverActive, setBalloonCoverActive] = useState(false);
  const [circleWipeActive, setCircleWipeActive] = useState(false);
  const [circleWipeType, setCircleWipeType] = useState<"switch" | "recording">("switch");
  const [whiteout, setWhiteout] = useState(false);
  const [blackout, setBlackout] = useState(false);

  // Interaction variables
  const [switchSignal, setSwitchSignal] = useState(0);
  const [gramophoneSignal, setGramophoneSignal] = useState(0);
  const [resumeCatSignal, setResumeCatSignal] = useState(0);

  // Celebration & Gift opening
  const [celebrationState, setCelebrationState] = useState("idle");
  const [celebrationZoom, setCelebrationZoom] = useState(false);
  const [giftSignal, setGiftSignal] = useState(0);
  const [giftOpened, setGiftOpened] = useState(false);
  const [giftZoomInside, setGiftZoomInside] = useState(false);

  // Vintage pan timer
  const [vintageElapsed, setVintageElapsed] = useState(0);

  // Messages in Phase 2
  const [messageIndex, setMessageIndex] = useState(-1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const touchAudioRef = useRef<HTMLAudioElement | null>(null);
  const meowAudioRef = useRef<HTMLAudioElement | null>(null);
  const patAudioRef = useRef<HTMLAudioElement | null>(null);

  // Sound triggers
  const playTouch = useCallback(() => {
    if (compact && !autoPlay) return;
    touchAudioRef.current && (touchAudioRef.current.currentTime = 0);
    touchAudioRef.current?.play().catch(() => { });
  }, [compact, autoPlay]);
  const playMeow = useCallback(() => {
    if (compact && !autoPlay) return;
    meowAudioRef.current && (meowAudioRef.current.currentTime = 0);
    meowAudioRef.current?.play().catch(() => { });
  }, [compact, autoPlay]);
  const playPat = useCallback(() => {
    if (compact && !autoPlay) return;
    patAudioRef.current && (patAudioRef.current.currentTime = 0);
    patAudioRef.current?.play().catch(() => { });
  }, [compact, autoPlay]);

  // Force reset everything on mount
  useEffect(() => {
    setMusicActive(false);
    setCatChanged(false);
    setBalloonCoverActive(false);
    setCircleWipeActive(false);
    setCircleWipeType("switch");
    setWhiteout(false);
    setBlackout(false);
    setCelebrationZoom(false);
    setGiftOpened(false);
    setGiftZoomInside(false);
    setPhase("dark");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  // AutoPlay progression
  useEffect(() => {
    if (!autoPlay) return;

    let timer: number;
    if (phase === "dark") {
      timer = window.setTimeout(turnOnLights, 2000);
    } else if (phase === "music") {
      if (!musicActive) {
        timer = window.setTimeout(startMusic, 2000);
      }
    } else if (phase === "decorate-popup") {
      timer = window.setTimeout(handleWandClicked, 2000);
    } else if (phase === "match-ignite") {
      timer = window.setTimeout(handleCandleLit, 4000);
    } else if (phase === "wish-record") {
      timer = window.setTimeout(() => handleWishRecorded(""), 4000);
    }
    return () => window.clearTimeout(timer);
  }, [autoPlay, phase, musicActive]);

  // Preload audio on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.load();
    }
  }, []);

  // Phase 1 transitions
  function turnOnLights() {
    playTouch();
    setSwitchSignal((v) => v + 1);
    setCircleWipeType("switch");
    setCircleWipeActive(true);

    setTimeout(() => {
      setPhase("music");
    }, 2800);

    setTimeout(() => {
      setCircleWipeActive(false);
    }, 5000);
  }

  function startMusic() {
    playTouch();
    setGramophoneSignal((v) => v + 1);
    setMusicActive(true);
    audioRef.current?.play().catch((e) => console.warn("Audio play failed:", e));
  }

  // Trigger magic wand appearance 20 seconds after music starts
  useEffect(() => {
    if (musicActive) {
      const timer = setTimeout(() => {
        setPhase("decorate-popup");
      }, 20000); 
      return () => clearTimeout(timer);
    }
  }, [musicActive]);

  function handleWandClicked() {
    setBalloonCoverActive(true);
    
    setTimeout(() => {
      setPhase("cake-messages");
      setMessageIndex(0);
    }, 9000);

    setTimeout(() => {
      setBalloonCoverActive(false);
    }, 18000);
  }

  // Message cycler for Phase 2
  useEffect(() => {
    if (phase === "cake-messages" && messageIndex >= 0 && messageIndex < messages.length) {
      const timer = setTimeout(() => {
        setMessageIndex((idx) => idx + 1);
      }, 3500);
      return () => clearTimeout(timer);
    } else if (phase === "cake-messages" && messageIndex === messages.length) {
      setBalloonCoverActive(true);
      
      setTimeout(() => {
        setPhase("match-ignite");
      }, 9000); 

      setTimeout(() => {
        setBalloonCoverActive(false);
      }, 18000);
    }
  }, [phase, messageIndex, messages.length]);

  function handleCandleLit() {
    setPhase("wish-record");
  }

  function handleWishRecorded(audioUrl: string) {
    if (audioUrl && onResponse) {
      onResponse({ answer: "WISH_RECORDED", audioDataUrl: audioUrl });
    }
    setPhase("celebration");
    setCelebrationState("landed");
  }

  useEffect(() => {
    if (phase === "celebration") {
      const timer = setTimeout(() => {
        setCelebrationZoom(true);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  function handleGiftOpen() {
    setPhase("gift-reveal");
    setGiftSignal((v) => v + 1);

    setTimeout(() => {
      setGiftZoomInside(true);
      setWhiteout(true);
    }, 500);

    setTimeout(() => {
      setPhase("vintage-gallery");
      setWhiteout(false);
    }, 3000);
  }

  useEffect(() => {
    if (phase !== "vintage-gallery") {
      setVintageElapsed(0);
      return;
    }
    
    const startTime = performance.now();
    let animFrame: number;
    
    const update = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      setVintageElapsed(elapsed);
      
      if (elapsed > 30.0) {
        setPhase("end");
        return; // stop timer
      }
      
      animFrame = requestAnimationFrame(update);
    };
    
    animFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animFrame);
  }, [phase]);

  const isBright = phase !== "dark" && phase !== "wish-record" && phase !== "match-ignite" && phase !== "vintage-gallery" && phase !== "end";

  return (
    <>
      <style>{`
        @keyframes balloon-sweep-anim {
          0% { transform: translate(-50%, 100vh) scale(1); }
          50% { transform: translate(-50%, -50vh) scale(2.5); }
          100% { transform: translate(-50%, -200vh) scale(1); }
        }
        .balloon-sweep-el {
          animation: balloon-sweep-anim 2.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      {circleWipeActive && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-40">
          <defs>
            <mask id="circle-wipe-mask">
              <rect width="100%" height="100%" fill="white" />
              {circleWipeType === "switch" ? (
                <motion.circle
                  cx="50%"
                  cy="50%"
                  fill="black"
                  initial={{ r: "120vmax" }}
                  animate={{
                    r: ["120vmax", "15vmax", "15vmax", "0vmax", "0vmax", "120vmax"],
                  }}
                  transition={{
                    duration: 5.0,
                    times: [0, 0.2, 0.44, 0.52, 0.8, 1.0],
                    ease: ["easeOut", "linear", "easeIn", "linear", "easeInOut"],
                  }}
                />
              ) : (
                <motion.circle
                  cx="50%"
                  cy="50%"
                  fill="black"
                  initial={{ r: "0vmax" }}
                  animate={{
                    r: ["0vmax", "120vmax"],
                  }}
                  transition={{
                    duration: 2.0,
                    ease: "easeInOut",
                  }}
                />
              )}
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="#16081d" mask="url(#circle-wipe-mask)" />
        </svg>
      )}

      <AnimatePresence>
        {whiteout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 z-[100] bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {blackout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3.0, ease: "easeInOut" }}
            className="absolute inset-0 z-[100] bg-[#0c050f] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <audio src={musicUrl || DEFAULT_BIRTHDAY_MUSIC} loop preload="auto" ref={audioRef} muted={compact && !autoPlay && !isBuilderPreview} />
      <audio preload="auto" ref={touchAudioRef} src={TOUCH_SOUND} muted={compact && !autoPlay && typeof window !== 'undefined' && window.location.pathname.includes('dashboard')} />
      <audio preload="auto" ref={meowAudioRef} src="/assets/vfx/meow-1.mp3" muted={compact && !autoPlay && typeof window !== 'undefined' && window.location.pathname.includes('dashboard')} />
      <audio preload="auto" ref={patAudioRef} src="/assets/vfx/lopi.mp3" muted={compact && !autoPlay && typeof window !== 'undefined' && window.location.pathname.includes('dashboard')} />

      <div className="absolute inset-0 z-10">
        <Canvas
          resize={{ offsetSize: true }}
          camera={{ fov: 46, position: [0, 0.35, 2.65] }}
          shadows={{ type: THREE.PCFShadowMap }}
          gl={{ alpha: false, antialias: true }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.16;
          }}
        >
          {/* ÉP NỀN ĐEN 100% LÚC QUẸT DIÊM VÀ ƯỚC */}
          <color attach="background" args={[phase === "match-ignite" || phase === "wish-record" ? "#000000" : phase === "vintage-gallery" || phase === "end" ? "#1a0f05" : isBright ? "#ffdff2" : "#16081d"]} />
          {/* TĂNG TẦM NHÌN FOG LÊN TỐI ĐA 50 ĐỂ BACKGROUND LUÔN RỰC RỠ */}
          <fog attach="fog" args={[phase === "vintage-gallery" || phase === "end" ? "#1a0f05" : isBright ? "#ffdff2" : "#16081d", 20, 50]} />

          {musicActive && (
            <group visible={false}>
              <NormalizedModel url={MODELS.cake} materialTone="glow" desiredHeight={2.0} />
            </group>
          )}

          <DreamLights active={isBright} />
          <Environment preset="city" environmentIntensity={isBright ? 0.75 : 0.05} />

          <CameraRig
            musicActive={musicActive}
            phase={phase}
            celebrationZoom={celebrationZoom}
            giftZoomInside={giftZoomInside}
            vintageElapsed={vintageElapsed}
            memoriesCount={memories && memories.length > 0 ? memories.length : 4}
          />

          {/* MẶT SÀN THÔNG MINH 3 CẤP ĐỘ */}
          <mesh 
            receiveShadow 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[
              0, 
              (phase === "dark" || phase === "music" || phase === "decorate-popup") 
                ? -1.05 // Nấc 1: Đỡ máy hát và mèo
                : phase === "cake-messages" 
                  ? -1.42 // Nấc 2: Đỡ chiếc bánh lúc hiện lời chúc
                  : -2.35, // Nấc 3: Đỡ chiếc bánh lúc cắm nến, mở quà
              0
            ]} 
            visible={isBright}
          >
            <circleGeometry args={[7, 80]} />
            <meshStandardMaterial color="#ffe9f8" roughness={0.86} />
          </mesh>

          {phase === "dark" ? (
            <>
              <HeroLightSwitch onClick={turnOnLights} signal={switchSignal} />
              <pointLight color="#fff6ff" distance={5} intensity={6.5} position={[0, 0.15, 1.1]} />
              <pointLight color="#ff8fd1" distance={3.5} intensity={3.2} position={[-0.45, 0.55, 0.7]} />
              <ComicCallout exitSignal={switchSignal} position={[0.75, 0.1, 0.2]} onClick={turnOnLights}>
                Mở đèn!
              </ComicCallout>
            </>
          ) : null}

          {isBright && (
            <group>
              <Model materialTone="glow" position={[0.08, 3.42, -4.75]} scale={0.58} url={MODELS.stars} />
              <DreamSparkles active={true} />
              <TwinkleGarland active={true} />
              <LightBulbGlow position={[-1.1, 1.75, -1.1]} />
              <LightBulbGlow position={[0, 2.02, -1.35]} />
              <LightBulbGlow position={[1.1, 1.75, -1.1]} />
              <pointLight color="#ffd9f0" distance={7} intensity={8} position={[0, 2.1, -1.5]} />
            </group>
          )}

          {/* FIX LỖI MẤT BÓNG BAY: Hiển thị hiệu ứng nền chỉ ở phase music để tránh phase quẹt diêm bị thừa */}
          {(phase === "music" || phase === "decorate-popup") && (
             <CakeBackgroundEffects active={true} />
          )}

          {(phase === "music" || phase === "decorate-popup") && (
            <group>
              {musicActive && (
              <MusicCatWalk
                hideHtml={false}
                interactive={true}
                musicActive={musicActive}
                resumeSignal={resumeCatSignal}
                onPlayMeow={playMeow}
                onPlayPat={playPat}
                onPlayTouch={playTouch}
                onCatChanged={() => { if (!catChanged) setCatChanged(true); }}
              />
              )}

              <CartoonPop position={[0, -0.85, 0.05]} signal={gramophoneSignal}>
                <RotatableGramophone interactive={true} musicActive={musicActive} onClick={musicActive ? () => { } : startMusic} />
                <MusicNotes active={musicActive} />
                <pointLight color="#ff88ce" distance={4} intensity={gramophoneSignal > 0 ? 5.6 : 2.2} position={[0, 0.65, 0.35]} />
              </CartoonPop>

              {!musicActive && (
                <ComicCallout exitSignal={musicActive ? 1 : 0} onClick={startMusic} position={[0.88, -0.85, 0.05]}>
                  Bật nhạc!
                </ComicCallout>
              )}
            </group>
          )}

          {phase === "decorate-popup" && (
            <MagicDecorWand onDone={handleWandClicked} onMagic={() => {}} onTouch={playTouch} autoPlay={autoPlay} />
          )}

          {phase === "cake-messages" && (
              <RotatableCake />
          )}

          {(phase === "match-ignite" || phase === "wish-record" || phase === "celebration" || phase === "gift-reveal") && (
            <CandleSequence
              phase={phase}
              age={age}
              recipientName={recipientName}
              onCandleLit={handleCandleLit}
              onWishRecorded={handleWishRecorded}
              onGiftOpen={handleGiftOpen}
              celebrationZoom={celebrationZoom}
              autoPlay={autoPlay}
            />
          )}

          {phase === "vintage-gallery" && (
            <HangingGallery
              active={true}
              memories={memories}
              finalMessage={finalMessage}
              vintageElapsed={vintageElapsed}
            />
          )}

          <BalloonShower active={balloonCoverActive} />
        </Canvas>
      </div>
      
      <ConfettiOverlay active={phase === "celebration" || phase === "gift-reveal"} />

      <AnimatePresence mode="wait">
        {phase === "cake-messages" && messageIndex >= 0 && messageIndex < messages.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            key={messageIndex}
            className="birthday-message-bubble pointer-events-none absolute left-1/2 top-[15%] max-w-[85%] -translate-x-1/2 px-8 py-5 text-center text-2xl font-black drop-shadow-xl z-20"
            style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(255,100,180,0.6), 0 0 20px rgba(255,100,180,0.3)" }}
          >
            {messages[messageIndex]}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
      </AnimatePresence>
      
      {(!hideNavigation && !autoPlay) && (
        <TemplateNavigator
          currentIndex={PHASES.indexOf(phase)}
          totalSteps={PHASES.length}
          onPrev={() => setPhase(PHASES[Math.max(0, PHASES.indexOf(phase) - 1)] as BirthdayPhase)}
          onNext={() => setPhase(PHASES[Math.min(PHASES.length - 1, PHASES.indexOf(phase) + 1)] as BirthdayPhase)}
          accentColor="#db2777"
        />
      )}
    </>
  );
}

export function BirthdayMagicExperience(props: BirthdayMagicExperienceProps) {
  return (
    <div className={`overflow-hidden bg-black font-sans selection:bg-pink-500/30 ${props.compact ? 'absolute inset-0 rounded-[2.5rem]' : props.fullScreen ? 'relative w-full min-h-[100dvh]' : 'relative h-full w-full'}`}>
      <div className="absolute inset-0 w-full h-full">
        <BirthdayScene
          age={props.age || 20}
          finalMessage={props.finalMessage || "Chúc Mừng Sinh Nhật!"}
          memories={props.memories || []}
          messages={props.messages || [
            "Chúc cậu tuổi mới ngập tràn niềm vui và hạnh phúc! ✨",
            "Mong rằng mọi điều ước hôm nay đều sẽ thành sự thật! 💖",
            "Hãy trân trọng từng giây phút ngọt ngào này nhé! 🥰",
            "Và giờ... hãy đón nhận món quà bí mật tiếp theo! 🎁",
          ]}
          instructionText={props.instructionText}
          wishPromptText={props.wishPromptText}
          recordingText={props.recordingText}
          giftPromptText={props.giftPromptText}
          bannerTitle={props.bannerTitle}
          bannerName={props.bannerName}
          musicUrl={props.musicUrl}
          recipientName={props.recipientName || "Bạn"}
          compact={props.compact}
          autoPlay={props.autoPlay}
          isBuilderPreview={props.isBuilderPreview}
          onResponse={props.onResponse}
          forceStep={props.forceStep}
          onStepChange={props.onStepChange}
          hideNavigation={props.hideNavigation}
        />
      </div>
    </div>
  );
}