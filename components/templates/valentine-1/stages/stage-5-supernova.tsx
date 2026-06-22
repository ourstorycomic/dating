"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/purity, react-hooks/set-state-in-effect, react/no-unescaped-entities */

import { useState, useEffect, useRef, type PointerEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconStar, MediaFrame } from "../shared";
import { CuteDatePicker } from "../../dating-1/components/CuteDatePicker";

export function Stage5Supernova({
  contractBody = "\"Thời hạn dùng thử trái tim tớ đã hết.\n\nCậu có muốn gia hạn gói Premium (yêu thương trọn đời) không?\"",
  contractHoldInstruction = "Giữ vân tay 3 giây",
  contractRejectButton = "Xem xét lại",
  contractTitle = "Bản Hợp Đồng",
  finalAccent = "#ec4899",
  finalBackground = "#fb7185",
  finalCta = "Nhận Quà Đi Chơi",
  finalSubtitle = "Cảm ơn vì đã là ngoại lệ tuyệt vời nhất của nhau.",
  finalTitle = "Happy Valentine's Day!",
  giftAcceptButton = "Lên đồ thôi!",
  giftAcceptedBody = "Lịch hẹn đã được lưu lại thành công.\nHẹn gặp cậu vào ngày hôm đó nhé!",
  giftAcceptedTitle = "Chốt đơn!",
  giftBackButton = "Quay lại",
  giftBody = "Cuối tuần này, cùng nhau đi dạo phố và uống chút gì đó ấm áp nhé? Tớ biết một quán view rất xinh!",
  giftDeclineButton = "Để khi khác",
  giftDeclinedBody = "Chọn một ngày cậu rảnh để chúng mình set kèo lại nhé!",
  giftDeclinedTitle = "Vậy hẹn ngày khác nha!",
  giftRescheduleButton = "Gửi lịch hẹn",
  giftTitle = "Thư Mời Hẹn Hò",
  hideNavigation = false,
  proposedDate,
  onNext,
  onResponse,
}: {
  contractBody?: string;
  contractHoldInstruction?: string;
  contractRejectButton?: string;
  contractTitle?: string;
  finalAccent?: string;
  finalBackground?: string;
  finalCta?: string;
  finalSubtitle?: string;
  finalTitle?: string;
  giftAcceptButton?: string;
  giftAcceptedBody?: string;
  giftAcceptedTitle?: string;
  giftBackButton?: string;
  giftBody?: string;
  giftDeclineButton?: string;
  giftDeclinedBody?: string;
  giftDeclinedTitle?: string;
  giftRescheduleButton?: string;
  giftTitle?: string;
  hideNavigation?: boolean;
  proposedDate?: string;
  onNext?: () => void;
  onResponse?: (answer: string, date?: string) => void;
}) {
  const [rejectFallen, setRejectFallen] = useState(false);
  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [exploded, setExploded] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [giftAccepted, setGiftAccepted] = useState(false);
  const [giftDeclined, setGiftDeclined] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleError, setRescheduleError] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    if (exploded) return;
    setHolding(true);
    if (navigator.vibrate) navigator.vibrate(50);
    intervalRef.current = setInterval(() => {
      setHoldProgress(p => {
        if (p >= 100) {
          clearInterval(intervalRef.current!);
          triggerExplosion();
          return 100;
        }
        if (p % 30 === 0 && navigator.vibrate) navigator.vibrate(30); // Rung theo nhịp
        return p + 2;
      });
    }, 60); // 3 seconds
  };

  const stopHold = () => {
    if (exploded) return;
    setHolding(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setHoldProgress(0);
  };

  const triggerExplosion = () => {
    if (navigator.vibrate) navigator.vibrate([300, 100, 500]);
    setExploded(true);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      {!exploded ? (
        <motion.div className="w-full max-w-sm px-6 flex flex-col items-center relative"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
        >
          {/* Scroll Hợp đồng */}
          <div className="w-full bg-orange-50 p-8 rounded-b-3xl rounded-t-sm shadow-2xl relative border-t-8 border-orange-200" style={{ color: "#1f2937" }}>
            <div className="absolute top-0 inset-x-0 h-full bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-50 pointer-events-none" />
            <h2 className="text-2xl font-black text-center mb-6 uppercase tracking-widest drop-shadow-sm" style={{ color: "#78350f" }}>{contractTitle}</h2>
            <p className="font-serif text-lg leading-relaxed text-center mb-8 font-medium" style={{ color: "#1f2937" }}>
              {contractBody}
            </p>

            <div className="flex flex-col gap-4 relative z-10">
              <motion.button 
                onHoverStart={() => setRejectFallen(true)}
                onPointerDown={() => setRejectFallen(true)}
                animate={rejectFallen ? { y: 600, rotate: 60, opacity: 0 } : {}}
                transition={{ duration: 1, ease: "easeIn" }}
                className="w-full py-4 rounded-xl border-2 border-gray-300 text-gray-500 font-bold bg-white outline-none"
              >
                {contractRejectButton}
              </motion.button>
              
              <div className="relative mt-2">
                {/* Fingerprint area */}
                <div 
                  onPointerDown={startHold}
                  onPointerUp={stopHold}
                  onPointerLeave={stopHold}
                  className="w-24 h-24 mx-auto rounded-full border-4 border-red-500/20 bg-red-50 flex items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.3)] touch-none select-none"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
                  {/* Quét radar line */}
                  {holding && <motion.div className="absolute inset-x-0 h-1 bg-red-500 shadow-[0_0_10px_red]" animate={{ y: [-40, 40, -40] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />}
                </div>
                <p className="text-center text-xs font-bold mt-4 uppercase tracking-widest" style={{ color: "#ef4444" }}>{contractHoldInstruction}</p>
                
                {/* Progress Circle (around the fingerprint) */}
                <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 pointer-events-none transform -rotate-90">
                  <circle cx="48" cy="48" r="46" fill="none" stroke="rgba(239,68,68,0.1)" strokeWidth="4" />
                  <circle cx="48" cy="48" r="46" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="289" strokeDashoffset={289 - (289 * holdProgress) / 100} className="transition-all duration-75" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* SUPERNOVA EXPLOSION */
        <motion.div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
          style={{ background: finalBackground }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
        >
          {/* Flash Trắng */}
          <motion.div className="absolute inset-0 bg-white z-50 pointer-events-none" animate={{ opacity: [1, 0] }} transition={{ duration: 1.5, ease: "easeOut" }} />
          
          {/* Hàng ngàn vì sao bắn ra */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 150 }).map((_, i) => {
              const angle = Math.random() * Math.PI * 2;
              const dist = 50 + Math.random() * 500;
              return (
                <motion.div key={i} className="absolute w-2 h-2 rounded-full shadow-[0_0_10px_#fff] bg-white top-1/2 left-1/2"
                  initial={{ x: 0, y: 0, scale: 0 }}
                  animate={{ 
                    x: Math.cos(angle) * dist, 
                    y: Math.sin(angle) * dist,
                    scale: Math.random() * 2,
                    opacity: [1, 0]
                  }}
                  transition={{ duration: 2.5, ease: "easeOut", delay: Math.random() * 0.2 }}
                />
              )
            })}
          </div>

          <motion.div className="relative z-10 w-full max-w-md px-6"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: "spring", bounce: 0.5 }}
          >
            <div className="text-9xl text-white drop-shadow-[0_0_50px_rgba(255,255,255,1)] animate-pulse mb-6">
              ♥
            </div>
            
            <AnimatePresence mode="wait">
              {!showGift ? (
                <motion.div key="intro" className="bg-white/20 backdrop-blur-xl p-8 rounded-3xl border border-white/40 shadow-2xl"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }}
                >
                  <h1 className="text-3xl font-black text-white drop-shadow-lg mb-4">
                    {finalTitle}
                  </h1>
                  <p className="text-white/90 font-medium mb-8">
                    {finalSubtitle}
                  </p>
                  <button onClick={() => setShowGift(true)} className="px-8 py-4 rounded-full bg-white font-black shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform uppercase tracking-wider text-sm" style={{ color: finalAccent }}>
                    {finalCta}
                  </button>
                </motion.div>
              ) : (
                <motion.div key="gift" className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl text-pink-600 relative overflow-hidden w-full max-w-sm mx-auto"
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: "spring", bounce: 0.6 }}
                >
                  {!giftAccepted && !giftDeclined && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                      <div className="w-20 h-20 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
                        ☕
                      </div>
                      <h2 className="text-2xl font-black mb-3 text-center">{giftTitle}</h2>
                      <p className="text-gray-600 mb-4 font-medium text-center leading-relaxed">
                        {giftBody}
                      </p>
                      {proposedDate && (
                        <div className="mb-8 inline-block w-full rounded-xl bg-pink-50 p-3 text-center text-sm font-bold text-pink-600 border border-pink-100">
                          📅 Lịch hẹn: {(() => {
                            try {
                              const d = new Date(proposedDate);
                              if (isNaN(d.getTime())) return proposedDate;
                              return new Intl.DateTimeFormat('vi-VN', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              }).format(d);
                            } catch {
                              return proposedDate;
                            }
                          })()}
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <motion.button onClick={() => { setGiftDeclined(true); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-pink-100 text-pink-400 font-bold hover:bg-pink-50 hover:border-pink-200 transition">
                          {giftDeclineButton}
                        </motion.button>
                        <motion.button onClick={() => { setGiftAccepted(true); onResponse?.("YES"); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-[0_10px_20px_rgba(244,114,182,0.4)]">
                          {giftAcceptButton}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {giftAccepted && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }} className="text-center">
                      <div className="text-6xl mb-6 animate-bounce">🎉</div>
                      <h2 className="text-3xl font-black text-pink-500 mb-4">{giftAcceptedTitle}</h2>
                      <p className="text-gray-600 font-medium text-lg leading-relaxed">
                        {giftAcceptedBody}
                      </p>
                      {/* Thêm ít kim tuyến bay lên */}
                      <div className="absolute inset-0 pointer-events-none">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <motion.div key={i} className="absolute w-3 h-3 bg-pink-400 rounded-sm bottom-0 left-1/2"
                            animate={{ y: -400, x: (Math.random() - 0.5) * 300, rotate: Math.random() * 360, opacity: [1, 1, 0] }}
                            transition={{ duration: 2.5 + Math.random(), ease: "easeOut" }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {giftDeclined && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }} className="text-center">
                      <div className="text-6xl mb-6 animate-pulse">📅</div>
                      <h2 className="text-2xl font-black text-gray-700 mb-4">{giftDeclinedTitle}</h2>
                      <p className="text-gray-600 font-medium mb-6">
                        {giftDeclinedBody}
                      </p>
                      <div className="mt-4 relative z-50 w-[105%] -ml-[2.5%] sm:w-full sm:ml-0 text-gray-800">
                        <CuteDatePicker
                          selected={rescheduleDate}
                          onSelect={(d) => {
                            setRescheduleDate(d);
                            setRescheduleError("");
                          }}
                          accentColor="#ec4899"
                        />
                      </div>
                      {rescheduleError ? <p className="mt-4 mb-4 text-sm font-bold text-red-500">{rescheduleError}</p> : <div className="mb-4 mt-4" />}
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <motion.button onClick={() => { setGiftDeclined(false); setShowGift(false); }} whileHover={{ scale: 1.05 }} className="w-full sm:w-auto px-6 py-3 rounded-full border border-gray-300 text-gray-500 font-bold hover:bg-gray-50">
                          {giftBackButton}
                        </motion.button>
                        <motion.button onClick={() => {
                          if (!rescheduleDate) {
                            setRescheduleError("Chọn ngày trước đã nha.");
                            return;
                          }
                          setGiftDeclined(false);
                          setGiftAccepted(true);
                          onResponse?.("RESCHEDULE", rescheduleDate);
                        }} whileHover={{ scale: 1.05 }} className="w-full sm:w-auto px-8 py-3 rounded-full bg-pink-500 text-white font-bold shadow-lg hover:bg-pink-600">
                          {giftRescheduleButton}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
      
    </div>
  );
}
