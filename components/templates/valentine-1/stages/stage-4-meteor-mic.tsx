"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/purity, react-hooks/set-state-in-effect, react/no-unescaped-entities */

import { useState, useEffect, useRef, type PointerEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconStar, MediaFrame } from "../shared";

export function Stage4MeteorMic({
  accent,
  fallbackButton,
  imageUrl,
  mediaType,
  micInstruction,
  onNext,
  prompt,
  revealBody,
  revealButton,
  revealTitle,
  onRecord,
}: {
  accent: string;
  fallbackButton: string;
  imageUrl: string;
  mediaType?: string;
  micInstruction: string;
  onNext: () => void;
  prompt: string;
  revealBody: string;
  revealButton: string;
  revealTitle: string;
  onRecord?: (audioDataUrl: string) => void;
}) {
  const [caught, setCaught] = useState(false);
  const [blown, setBlown] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startMicListener = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          const url = String(reader.result);
          onRecord?.(url);
        };
        reader.readAsDataURL(blob);
      };

      recorder.start();

      setTimeout(() => {
        if (recorder.state === "recording") {
          setBlown(true);
          recorder.stop();
          stream.getTracks().forEach(t => t.stop());
          if (audioContextRef.current) audioContextRef.current.close();
        }
      }, 30000);

      let blownFrames = 0;
      const checkVolume = () => {
        if (blown) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for(let i = 0; i < bufferLength; i++) { sum += dataArray[i]; }
        const avg = sum / bufferLength;
        
        if (avg > 70) { 
          blownFrames++;
        } else {
          blownFrames = 0;
        }

        // Require 15 consecutive frames (about 250ms) of high volume
        if (blownFrames > 15) { 
          setBlown(true);
          recorder.stop();
          stream.getTracks().forEach(t => t.stop());
          if (audioContextRef.current) audioContextRef.current.close();
        } else {
          requestAnimationFrame(checkVolume);
        }
      };
      checkVolume();
    } catch (err) {
      console.warn("Mic access denied.", err);
    }
  };

  const handleCatch = () => {
    setCaught(true);
    if (navigator.vibrate) navigator.vibrate(50);
    startMicListener();
  };

  return (
    <motion.div className="absolute inset-0 flex items-center justify-center z-10 overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      <style>{`
        @keyframes main-meteor-fall {
          0% { transform: translate(800px, -800px) rotate(135deg); opacity: 0; }
          5% { opacity: 1; }
          75% { transform: translate(-1600px, 1600px) rotate(135deg); opacity: 1; }
          76% { transform: translate(-1600px, 1600px) rotate(135deg); opacity: 0; }
          100% { transform: translate(-1600px, 1600px) rotate(135deg); opacity: 0; }
        }
        @keyframes bg-meteor-fall {
          0% { transform: translate(0px, 0px) rotate(135deg); opacity: 0; }
          10% { opacity: 1; }
          90% { transform: translate(-2000px, 2000px) rotate(135deg); opacity: 1; }
          100% { transform: translate(-2000px, 2000px) rotate(135deg); opacity: 0; }
        }
      `}</style>
      {/* Background Meteors (Luôn hiện để tạo không khí) */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => {
          const isBlue = i % 5 === 0;
          return (
            <div key={`bg-meteor-${i}`}
              className={`absolute w-40 h-[2px] rounded-full ${isBlue ? 'bg-gradient-to-r from-transparent to-cyan-300 shadow-[0_0_15px_#22d3ee]' : 'bg-gradient-to-r from-transparent to-white/60'}`}
              style={{ 
                left: `${Math.random() * 200 - 50}%`, 
                top: `${Math.random() * 200 - 100}%`,
                animation: `bg-meteor-fall ${3 + Math.random() * 4}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: 0
              }}
            />
          );
        })}
      </div>

      {!caught ? (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.p className="absolute top-32 w-full text-center text-cyan-200 font-bold text-lg drop-shadow-md z-20" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}>
            {prompt}
          </motion.p>
          <div
            className="absolute top-0 right-0 z-30 pointer-events-none"
            style={{ animation: 'main-meteor-fall 6s linear infinite' }}
          >
            <motion.button 
              onClick={handleCatch}
              whileHover={{ scale: 1.3 }}
              className="w-64 h-16 flex items-center justify-center outline-none pointer-events-auto"
            >
              <div className="w-56 h-[4px] bg-gradient-to-r from-transparent to-cyan-300" />
              <div className="w-16 h-16 bg-cyan-300 rounded-full shadow-[0_0_60px_#22d3ee] flex-shrink-0 animate-pulse" />
            </motion.button>
          </div>
        </div>
      ) : (
        <motion.div className="flex flex-col items-center w-full px-6" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5, type: "spring", bounce: 0.5 }}>
          {!blown ? (
            <motion.div className="text-center relative"
              animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-56 h-56 mx-auto rounded-full border-2 border-pink-300/30 bg-white/5 backdrop-blur-2xl flex flex-col items-center justify-center shadow-[0_0_80px_rgba(244,114,182,0.2)] mb-10 overflow-hidden relative group">
                 {/* Cố định IconStar vào chuẩn giữa */}
                 <div className="absolute inset-0 flex items-center justify-center z-20">
                   <IconStar className="w-20 h-20 text-pink-100 drop-shadow-[0_0_25px_#fbcfe8] animate-[pulse_3s_infinite]" />
                 </div>
                 {imageUrl ? (
                   <MediaFrame
                     alt="Ảnh hoặc video đoạn sao băng"
                     className="absolute inset-0 opacity-50"
                     mediaType={mediaType}
                     src={imageUrl}
                   />
                 ) : null}
                 {/* Lớp bụi trần */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-80 mix-blend-screen z-30 transition-opacity duration-1000 group-hover:opacity-40" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              </div>
              <h3 className="text-2xl font-black text-pink-200 drop-shadow-lg mb-2">{revealTitle}</h3>
              <p className="text-[15px] text-white/80 leading-relaxed">
                <span style={{ color: accent }}>{micInstruction}</span>
              </p>
              <button onClick={() => setBlown(true)} className="mt-10 px-6 py-2 text-xs text-white/50 border border-white/20 rounded-full bg-white/5 hover:bg-white/10 transition">
                {fallbackButton}
              </button>
            </motion.div>
          ) : (
            <motion.div className="relative flex flex-col items-center w-full max-w-sm" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2, ease: "easeOut" }}>
              {/* Particles blowing away mượt mà */}
              <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
                {Array.from({ length: 80 }).map((_, i) => (
                  <motion.div key={i} className="absolute w-1 h-1 bg-white/80 rounded-full top-1/2 left-1/2"
                    animate={{ 
                      x: Math.random() * 800 - 400, 
                      y: -Math.random() * 800,
                      opacity: [1, 0],
                      scale: Math.random() * 3
                    }}
                    transition={{ duration: 3 + Math.random() * 2, ease: "easeOut" }}
                  />
                ))}
              </div>
              
              {/* Bức Tâm Thư Reveal - rung nhẹ trước khi hiện */}
              <motion.div className="w-full bg-black/40 backdrop-blur-3xl p-8 rounded-3xl border border-pink-500/30 shadow-[0_30px_60px_rgba(0,0,0,0.6)] z-10"
                initial={{ rotate: -5, scale: 0.8 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", bounce: 0.6, duration: 2, delay: 0.5 }}
                whileHover={{ y: -5, boxShadow: "0 40px 80px rgba(236,72,153,0.3)" }}
              >
                <IconStar className="w-10 h-10 mx-auto text-pink-400 mb-6 drop-shadow-[0_0_15px_#f472b6] animate-bounce" />
                <p className="font-serif text-white/90 leading-loose text-center text-lg italic">
                  {revealBody}
                </p>
                <div className="mt-10 flex justify-center">
                  <motion.button onClick={onNext} 
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="px-10 py-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 font-bold shadow-[0_10px_25px_rgba(236,72,153,0.5)] transition text-white uppercase tracking-wider"
                  >
                    {revealButton}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

