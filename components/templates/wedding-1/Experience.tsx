"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { MediaDisplay } from "@/components/ui/MediaDisplay";
import { WeddingFooter } from "../WeddingFooter";

export function WeddingOneExperience({
  compact = false,
  autoPlay = false,
  groomName = "Trần Đăng Khoa",
  brideName = "Nguyễn Mai Hoa",
  weddingDate = "2026-12-14T11:30:00.000Z",
  weddingMonth = "Tháng 12",
  weddingDay = "14",
  weddingYear = "2025",
  weddingDayOfWeek = "Chủ Nhật",
  heroImage = "/assets/wedding/wedding-1/anhchung1.jpg",
  groomImage = "/assets/wedding/wedding-1/chure.jpg",
  brideImage = "/assets/wedding/wedding-1/codau.jpg",
  letterText = "Được sự đồng thuận của gia đình hai bên\nChúng tôi trân trọng kính mời quý khách tới dự bữa tiệc chung vui cùng gia đình chúng tôi",
  groomFamily = "Ông Trần Văn A\nBà Nguyễn Thị B",
  brideFamily = "Ông Nguyễn Văn C\nBà Lê Thị D",
  eventAddress = "Trung tâm tiệc cưới Asora Center, 123 Phố Mới, Quận 1, TP. HCM",
  mapUrl = "https://maps.app.goo.gl/xxx",
  mapImage = "/assets/lovepics/map-preview.jpg",
  dividerImage = "/assets/wedding/wedding-1/anhchung2.jpg",
  footerImage = "/assets/wedding/wedding-1/anhchung8.jpg",
  musicUrl = "",
  isBuilderPreview = false,
  onComplete,
  engagementDate,
  groomQR,
  brideQR,
  customData,
  gallery,
  fullScreen,
}: {
  compact?: boolean;
  autoPlay?: boolean;
  fullScreen?: boolean;
  groomName?: string;
  brideName?: string;
  weddingDate?: string;
  weddingMonth?: string;
  weddingDay?: string;
  weddingYear?: string;
  weddingDayOfWeek?: string;
  heroImage?: string;
  groomImage?: string;
  brideImage?: string;
  letterText?: string;
  groomFamily?: string;
  brideFamily?: string;
  eventAddress?: string;
  mapUrl?: string;
  mapImage?: string;
  dividerImage?: string;
  footerImage?: string;
  musicUrl?: string;
  isBuilderPreview?: boolean;
  onComplete?: (data: any) => void;
  engagementDate?: string;
  groomQR?: string;
  brideQR?: string;
  customData?: any;
  gallery?: string[];
}) {
  const parsedDDate = new Date(customData?.weddingDate || weddingDate || '2026-12-14T11:30:00.000Z');
  const parsedEDate = new Date(customData?.engagementDate || engagementDate || '2026-12-12T09:00:00.000Z');
  const dDay = parsedDDate.getDate().toString().padStart(2, '0');
  const dMonthNumber = parsedDDate.getMonth() + 1;
  const dMonth = 'Tháng ' + dMonthNumber;
  const dYear = parsedDDate.getFullYear().toString();
  const dDayOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][parsedDDate.getDay()];
  const dHours = parsedDDate.getHours().toString().padStart(2, '0');
  const dMinutes = parsedDDate.getMinutes().toString().padStart(2, '0');
  const dTime = `${dHours}:${dMinutes}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMounted, setIsMounted] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftTab, setGiftTab] = useState<'groom'|'bride'>('groom');

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpCount, setRsvpCount] = useState("1");
  const [customCount, setCustomCount] = useState("");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  useEffect(() => {
    if (audioRef.current && musicUrl) {
      if (autoPlay) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else if (!compact && !isBuilderPreview && fullScreen) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  }, [autoPlay, compact, isBuilderPreview, musicUrl, fullScreen]);

  useEffect(() => {
    if (autoPlay && containerRef.current) {
      let reqId: number;
      const timeoutId = setTimeout(() => {
        let scrollAmount = 0;
        const speed = 0.4;
        const step = () => {
          if (containerRef.current) {
            scrollAmount += speed;
            containerRef.current.scrollTop = scrollAmount;
            if (containerRef.current.scrollTop + containerRef.current.clientHeight >= containerRef.current.scrollHeight - 2) {
               scrollAmount = 0;
               containerRef.current.scrollTop = 0;
            }
          }
          reqId = requestAnimationFrame(step);
        };
        reqId = requestAnimationFrame(step);
      }, 500); // Start scrolling shortly after mount
      
      return () => {
        clearTimeout(timeoutId);
        if (reqId) cancelAnimationFrame(reqId);
      };
    }
  }, [autoPlay]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const hasTiecMung = !!customData?.tiecName;
  const hasTiecMungGai = !!customData?.tiecNameGai;

  const parseTiec = (dateString?: string) => {
    if (!dateString) return { date: '', time: '' };
    const dt = new Date(dateString);
    if (isNaN(dt.getTime())) return { date: '', time: '' };
    return {
      date: dt.toLocaleDateString('vi-VN'),
      time: dt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const tiecTrai = parseTiec(customData?.tiecDate);
  const tiecGai = parseTiec(customData?.tiecDateGai);

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSubmitted(true);
    onComplete?.({ name: rsvpName, phone: rsvpPhone, count: rsvpCount === "Khác" ? customCount : rsvpCount });
  };

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const targetDate = new Date(customData?.weddingDate || weddingDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setDays(0); setHours(0); setMinutes(0); setSeconds(0);
        return;
      }

      setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  // Calendar logic
  const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month - 1, 1).getDay();
  const daysInMonth = getDaysInMonth(parsedDDate.getFullYear(), dMonthNumber);
  const firstDay = getFirstDayOfMonth(parsedDDate.getFullYear(), dMonthNumber);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div
      ref={containerRef}
      className={`@container relative w-full h-full bg-[#f9f8f6] text-[#4a4a4a] scroll-smooth ${autoPlay ? "overflow-hidden pointer-events-none select-none" : "overflow-x-hidden overflow-y-auto no-scrollbar"} ${compact ? "rounded-[2.5rem]" : ""}`}
      style={{ fontFamily: "'Playfair Display', serif" }}
    >

      {/* Background Music & Floating Controls */}
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" autoPlay={autoPlay} muted={compact && !autoPlay && !isBuilderPreview} />
      )}
      {!autoPlay && (
        <button 
          onClick={toggleAudio}
          className="fixed top-4 right-4 z-50 w-10 h-10 bg-white/80 backdrop-blur-sm border border-[#d6cfc5]/50 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95 pointer-events-auto"
        >
          {isPlaying ? (
             <svg className="w-4 h-4 text-[#8c7b6b] animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
          ) : (
             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>
          )}
        </button>
      )}

      {/* 1. HERO SECTION */}
      <section className="relative w-full pb-16 flex flex-col items-center">
        <div className="relative w-full aspect-[4/5] @sm:aspect-[3/4]">
           <MediaDisplay src={heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#f9f8f6] via-[#f9f8f6]/20 to-transparent" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}
          className="text-center w-full px-6 flex flex-col items-center -mt-32 relative z-10"
        >
          <h1 className="text-5xl @sm:text-6xl font-medium text-[#333] drop-shadow-md mb-2" style={{ fontFamily: "'Dancing Script', cursive" }}>
            <span className="flex flex-col items-center gap-1 sm:gap-2"><span>{groomName}</span> <span className="text-sm font-sans mx-2 opacity-80">&amp;</span> <span>{brideName}</span></span>
          </h1>
          <div className="w-12 h-[1px] bg-[#8c7b6b] my-4 opacity-50"></div>
          <p className="text-[10px] uppercase tracking-[0.4em] font-semibold text-[#666] mb-2 font-sans">Save The Date</p>
          <p className="text-lg tracking-[0.2em] font-medium text-[#444]">{dDay} . {dMonthNumber.toString().padStart(2, '0')} . {dYear}</p>
        </motion.div>
      </section>

      {/* 2. FAMILY & COUPLE */}
      <section className="py-16 px-6 bg-[#f9f8f6] flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}
          className="text-center max-w-sm mb-16"
        >
           <p className="text-[11px] font-sans text-gray-500 uppercase tracking-widest leading-loose">
             {letterText.split('\n').map((line, i) => <span key={i} className="block mb-2">{line}</span>)}
           </p>
        </motion.div>

        <div className="w-full max-w-2xl grid grid-cols-2 gap-4 @sm:gap-12">
          {/* Groom */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="flex flex-col items-center text-center">
             <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-sans font-semibold mb-2">Chú Rể</p>
             <h3 className="text-xl @sm:text-2xl text-[#333] mb-6" style={{ fontFamily: "'Dancing Script', cursive" }}>{groomName}</h3>
             <div className="w-full aspect-[3/4] p-2 border border-[#d6cfc5]/60 bg-white">
                <MediaDisplay src={groomImage} alt="Groom" className="w-full h-full object-cover" />
             </div>
          </motion.div>
          {/* Bride */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="flex flex-col items-center text-center">
             <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-sans font-semibold mb-2">Cô Dâu</p>
             <h3 className="text-xl @sm:text-2xl text-[#333] mb-6" style={{ fontFamily: "'Dancing Script', cursive" }}>{brideName}</h3>
             <div className="w-full aspect-[3/4] p-2 border border-[#d6cfc5]/60 bg-white">
                <MediaDisplay src={brideImage} alt="Bride" className="w-full h-full object-cover" />
             </div>
          </motion.div>
        </div>
      </section>

      {/* 3. EVENT DETAILS */}
      <section className="py-20 px-6 bg-white border-y border-[#d6cfc5]/30">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}
          className="max-w-md mx-auto text-center"
        >
          <h2 className="text-4xl @sm:text-5xl text-[#8c7b6b] mb-10" style={{ fontFamily: "'Dancing Script', cursive" }}>Thân Mời</h2>
          <div className="border border-[#d6cfc5]/50 p-8 @sm:p-12 relative bg-[#f9f8f6]">
             {/* Corner Accents */}
             <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#8c7b6b]/40"></div>
             <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#8c7b6b]/40"></div>
             <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#8c7b6b]/40"></div>
             <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#8c7b6b]/40"></div>
             
             <p className="text-[10px] uppercase font-sans tracking-[0.2em] text-gray-500 mb-6 font-semibold">Sự kiện</p>
             <h3 className="text-2xl @sm:text-3xl text-[#333] font-medium tracking-wide mb-6">LỄ THÀNH HÔN</h3>
             
             <p className="text-[11px] font-sans uppercase tracking-widest text-gray-500 leading-loose mb-6">
               Vào lúc {dTime}<br/>
               Ngày {dDay} {dMonth} năm {dYear}<br/>
               (Tức {dDayOfWeek})
             </p>
             <div className="w-12 h-[1px] bg-[#d6cfc5] mx-auto my-6"></div>
             <p className="text-[11px] font-sans uppercase tracking-widest text-gray-500 font-semibold mb-2">Tại Tư Gia</p>
             <p className="text-[11px] font-sans text-[#444] leading-relaxed uppercase tracking-wide px-4 mb-6">
               {eventAddress}
             </p>
             {mapUrl && (
               <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-block bg-[#8c7b6b] text-[#FFFFFF] text-[9px] px-6 py-3 uppercase tracking-[0.2em] font-bold shadow-md opacity-90 hover:opacity-100 transition-opacity">
                 Xem Bản Đồ
               </a>
             )}
          </div>
          
          {hasTiecMung && (
             <div className="border border-dashed border-[#8c7b6b]/60 p-8 @sm:p-12 relative bg-[#f9f8f6] mt-8">
                <p className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#8c7b6b] mb-6 font-semibold">TIỆC MỪNG LỄ THÀNH HÔN {hasTiecMungGai ? "(NHÀ TRAI)" : ""}</p>
                <h3 className="text-xl @sm:text-2xl text-[#333] font-medium tracking-wide mb-6">TIỆC MỪNG LỄ THÀNH HÔN</h3>
                
                <p className="text-[11px] font-sans uppercase tracking-widest text-gray-500 leading-loose mb-6">
                  Vào lúc {tiecTrai.time}<br/>
                  Ngày {tiecTrai.date}
                </p>
                <div className="w-12 h-[1px] bg-[#d6cfc5] mx-auto my-6"></div>
                <p className="text-[11px] font-sans uppercase tracking-widest text-gray-500 font-semibold mb-2">Tại</p>
                <p className="text-[11px] font-sans text-[#444] leading-relaxed uppercase tracking-wide px-4 mb-6">
                  <strong>{customData?.tiecName}</strong><br/>
                  {customData?.tiecAddress}
                </p>
                {customData?.tiecMapUrl && (
                  <a href={customData.tiecMapUrl} target="_blank" rel="noreferrer" className="bg-[#8c7b6b] text-[#FFFFFF] text-[9px] px-6 py-3 uppercase tracking-[0.2em] font-bold shadow-md opacity-90 hover:opacity-100 transition-opacity">
                    Xem Bản Đồ
                  </a>
                )}
             </div>
           )}

           {hasTiecMungGai && (
             <div className="border border-dashed border-[#8c7b6b]/60 p-8 @sm:p-12 relative bg-[#f9f8f6] mt-8">
                <p className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#8c7b6b] mb-6 font-semibold">TIỆC MỪNG LỄ THÀNH HÔN (NHÀ GÁI)</p>
                <h3 className="text-xl @sm:text-2xl text-[#333] font-medium tracking-wide mb-6">TIỆC MỪNG LỄ THÀNH HÔN</h3>
                
                <p className="text-[11px] font-sans uppercase tracking-widest text-gray-500 leading-loose mb-6">
                  Vào lúc {tiecGai.time}<br/>
                  Ngày {tiecGai.date}
                </p>
                <div className="w-12 h-[1px] bg-[#d6cfc5] mx-auto my-6"></div>
                <p className="text-[11px] font-sans uppercase tracking-widest text-gray-500 font-semibold mb-2">Tại</p>
                <p className="text-[11px] font-sans text-[#444] leading-relaxed uppercase tracking-wide px-4 mb-6">
                  <strong>{customData?.tiecNameGai}</strong><br/>
                  {customData?.tiecAddressGai}
                </p>
                {customData?.tiecMapUrlGai && (
                  <a href={customData.tiecMapUrlGai} target="_blank" rel="noreferrer" className="bg-[#8c7b6b] text-[#FFFFFF] text-[9px] px-6 py-3 uppercase tracking-[0.2em] font-bold shadow-md opacity-90 hover:opacity-100 transition-opacity">
                    Xem Bản Đồ
                  </a>
                )}
             </div>
           )}
        </motion.div>
      </section>

      {/* 4. CALENDAR & COUNTDOWN */}
      <section className="py-20 px-6 bg-[#f9f8f6] flex flex-col items-center">
        <h2 className="text-[11px] uppercase tracking-[0.3em] text-[#8c7b6b] font-bold mb-12 font-sans">Sự kiện sắp tới</h2>
        
        {/* Countdown */}
        <div className="flex gap-2 sm:gap-6 justify-center font-sans mb-20 text-[#444]">
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-4xl font-light">{days}</span>
            <span className="text-[8px] uppercase tracking-[0.2em] mt-2 opacity-60">Ngày</span>
          </div>
          <span className="text-xl sm:text-2xl font-light opacity-30 pt-1">:</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-4xl font-light">{hours}</span>
            <span className="text-[8px] uppercase tracking-[0.2em] mt-2 opacity-60">Giờ</span>
          </div>
          <span className="text-xl sm:text-2xl font-light opacity-30 pt-1">:</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-4xl font-light">{minutes}</span>
            <span className="text-[8px] uppercase tracking-[0.2em] mt-2 opacity-60">Phút</span>
          </div>
          <span className="text-xl sm:text-2xl font-light opacity-30 pt-1">:</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-4xl font-light">{seconds}</span>
            <span className="text-[8px] uppercase tracking-[0.2em] mt-2 opacity-60">Giây</span>
          </div>
        </div>

        {/* Calendar */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="w-full max-w-[300px]">
           <div className="flex items-end gap-2 mb-6 border-b border-[#d6cfc5] pb-2">
              <span className="text-2xl text-[#8c7b6b] font-medium" style={{ fontFamily: "'Dancing Script', cursive" }}>{dMonth}</span>
              <span className="text-2xl text-[#8c7b6b] font-medium" style={{ fontFamily: "'Dancing Script', cursive" }}>{dYear}</span>
           </div>
           
           <div className="grid grid-cols-7 text-center gap-y-4">
              {['S','M','T','W','T','F','S'].map((day, i) => (
                <div key={i} className="text-[10px] font-sans font-bold text-[#8c7b6b]">{day}</div>
              ))}
              {blanks.map(b => <div key={`b-${b}`} />)}
              {monthDays.map(day => {
                const isWedding = day === parsedDDate.getDate() && parsedDDate.getMonth() + 1 === dMonthNumber;
                let isTiec = false;
                if (hasTiecMung && customData?.tiecDate) {
                  const td = new Date(customData.tiecDate);
                  if (!isNaN(td.getTime()) && day.toString() === td.getDate().toString() && td.getMonth() + 1 === dMonthNumber && td.getFullYear() === parsedDDate.getFullYear()) isTiec = true;
                }
                if (hasTiecMungGai && customData?.tiecDateGai) {
                  const td = new Date(customData.tiecDateGai);
                  if (!isNaN(td.getTime()) && day.toString() === td.getDate().toString() && td.getMonth() + 1 === dMonthNumber && td.getFullYear() === parsedDDate.getFullYear()) isTiec = true;
                }
                
                return (
                  <div key={day} className="relative flex justify-center items-center text-xs font-sans w-7 h-7 mx-auto">
                    {isWedding && (
                      <svg className="absolute inset-0 w-[120%] h-[120%] -left-[10%] -top-[10%] text-[#8c7b6b]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    )}
                    {isTiec && !isWedding && (
                      <div className="absolute inset-0 w-full h-full rounded-full border-[1.5px] border-dashed border-[#8c7b6b] bg-[#8c7b6b]/5 scale-90"></div>
                    )}
                    <span className={`relative z-10 font-bold ${isWedding ? "text-[11px]" : isTiec ? "" : "text-gray-500 font-normal"}`} style={{ color: isWedding ? "white" : isTiec ? "#8c7b6b" : undefined }}>
                      {day}
                    </span>
                    {isTiec && isWedding && (
                      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, type: "spring" }} className="absolute inset-0 w-[150%] h-[150%] -left-[25%] -top-[25%] rounded-full border-[1.5px] border-dashed border-[#8c7b6b] z-0 opacity-80"></motion.div>
                    )}
                  </div>
                );
              })}
           </div>
           <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-[#d6cfc5]/50">
             <div className="flex items-center gap-2 text-[9px] font-sans font-bold uppercase tracking-widest text-[#8c7b6b]">
               <svg className="w-3.5 h-3.5 text-[#8c7b6b]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> 
               Lễ Cưới
             </div>
             {(hasTiecMung || hasTiecMungGai) && (
               <div className="flex items-center gap-2 text-[9px] font-sans font-bold uppercase tracking-widest text-[#8c7b6b]">
                 <div className="w-3.5 h-3.5 rounded-full border-[1.5px] border-dashed border-[#8c7b6b] bg-[#8c7b6b]/5"></div> 
                 Tiệc Mừng
               </div>
             )}
           </div>
        </motion.div>
      </section>

      {/* 5. MAP */}
      <section className="py-20 px-6 bg-white flex flex-col items-center border-y border-[#d6cfc5]/30">
        <h2 className="text-[11px] uppercase tracking-[0.3em] text-[#8c7b6b] font-bold mb-10 font-sans">Địa điểm tổ chức Lễ thành hôn</h2>
        <div className="w-full max-w-2xl p-3 bg-[#f9f8f6] border border-[#d6cfc5]/50">
           <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="block relative group overflow-hidden bg-gray-100 aspect-video">
              <MediaDisplay src={mapImage} alt="Map" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex flex-col items-center justify-center gap-4">
                <span className="bg-white text-[#4a4a4a] text-[10px] font-sans uppercase tracking-widest font-bold px-6 py-3 shadow-md hover:bg-[#8c7b6b] hover:text-white transition-colors border border-[#d6cfc5]">
                  Xem Trên Google Maps
                </span>
              </div>
           </a>
        </div>
      </section>

      {/* 6. ALBUM */}
      <section className="py-20 px-4 @sm:px-8 bg-[#f9f8f6]">
        <h2 className="text-4xl @sm:text-5xl text-center text-[#8c7b6b] mb-12" style={{ fontFamily: "'Dancing Script', cursive" }}>Album Hình Cưới</h2>
        
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
           {/* Row 1: 1 large */}
           <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
             <MediaDisplay src={gallery?.[0] || dividerImage || "/assets/wedding/wedding-1/anhchung2.jpg"} alt="Album 1" className="w-full h-[400px] object-cover" />
           </motion.div>
           
           {/* Row 2: 2 cols */}
           <div className="grid grid-cols-2 gap-4">
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
               <MediaDisplay src={gallery?.[1] || "/assets/wedding/wedding-1/anhchung3.jpg"} alt="Album 2" className="w-full h-[300px] @sm:h-[400px] object-cover" />
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} viewport={{ once: true }}>
               <MediaDisplay src={gallery?.[2] || "/assets/wedding/wedding-1/anhchung4.jpg"} alt="Album 3" className="w-full h-[300px] @sm:h-[400px] object-cover" />
             </motion.div>
           </div>
           
           {/* Row 3: 2 cols diff ratio */}
           <div className="grid grid-cols-5 gap-4">
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="col-span-2">
               <MediaDisplay src={gallery?.[3] || "/assets/wedding/wedding-1/anhchung5.jpg"} alt="Album 4" className="w-full h-[250px] @sm:h-[350px] object-cover" />
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} viewport={{ once: true }} className="col-span-3">
               <MediaDisplay src={gallery?.[4] || "/assets/wedding/wedding-1/anhchung6.jpg"} alt="Album 5" className="w-full h-[250px] @sm:h-[350px] object-cover" />
             </motion.div>
           </div>
           
           {/* Row 4: 2 cols */}
           <div className="grid grid-cols-2 gap-4">
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
               <MediaDisplay src={gallery?.[5] || "/assets/wedding/wedding-1/anhchung7.jpg"} alt="Album 6" className="w-full h-[300px] @sm:h-[400px] object-cover" />
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} viewport={{ once: true }}>
               <MediaDisplay src={gallery?.[6] || footerImage || "/assets/wedding/wedding-1/anhchung8.jpg"} alt="Album 7" className="w-full h-[300px] @sm:h-[400px] object-cover" />
             </motion.div>
           </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA & RSVP */}
      <section className="py-24 px-6 bg-white flex flex-col items-center relative">
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#f9f8f6] to-transparent"></div>
        <MediaDisplay src={heroImage} alt="Footer BG" className="absolute inset-0 w-full h-full object-cover opacity-[0.03]" />
        
        <div className="relative z-10 w-full max-w-md bg-white p-8 @sm:p-12 border border-[#d6cfc5]/50 shadow-[0_20px_50px_rgba(0,0,0,0.03)] text-center">
          {!rsvpSubmitted ? (
            <>
              <h2 className="text-[11px] uppercase tracking-[0.3em] text-[#8c7b6b] font-bold mb-8 font-sans">Xác nhận tham dự</h2>
              <form onSubmit={handleRSVP} className="space-y-4 font-sans text-left">
                <input 
                  type="text" required value={rsvpName} onChange={e => setRsvpName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f9f8f6] border border-[#d6cfc5] text-sm focus:border-[#8c7b6b] focus:outline-none placeholder:text-xs placeholder:uppercase placeholder:tracking-widest placeholder:text-gray-400" 
                  placeholder="Tên của bạn" 
                />
                <input 
                  type="tel" required value={rsvpPhone} onChange={e => setRsvpPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f9f8f6] border border-[#d6cfc5] text-sm focus:border-[#8c7b6b] focus:outline-none placeholder:text-xs placeholder:uppercase placeholder:tracking-widest placeholder:text-gray-400" 
                  placeholder="Số điện thoại" 
                />
                <div className="pt-2">
                  <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Số lượng tham dự</label>
                  <div className="flex gap-2">
                    {["1", "2", "3", "Khác"].map(num => (
                      <button
                        key={num} type="button"
                        onClick={() => setRsvpCount(num)}
                        className={`flex-1 py-2 text-xs transition-colors border ${rsvpCount === num ? "bg-[#8c7b6b] text-white border-[#8c7b6b]" : "bg-transparent text-gray-500 border-[#d6cfc5] hover:bg-[#f9f8f6]"}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  {rsvpCount === "Khác" && (
                    <input type="number" min="1" value={customCount} onChange={e => setCustomCount(e.target.value)} placeholder="Nhập số lượng..." className="w-full mt-3 px-4 py-3 bg-[#f9f8f6] border border-[#d6cfc5] text-sm focus:border-[#8c7b6b] focus:outline-none placeholder:text-xs placeholder:uppercase placeholder:tracking-widest placeholder:text-gray-400" required />
                  )}
                </div>
                <button type="submit" className="w-full py-4 mt-6 bg-[#8c7b6b] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#736355] transition-colors">
                  Gửi Xác Nhận
                </button>
              </form>
            </>
          ) : (
            <div className="py-10">
              <h3 className="text-3xl text-[#8c7b6b] mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>Cảm ơn bạn!</h3>
              <p className="text-gray-500 text-sm font-sans leading-relaxed">{customData?.inviteText || "Sự hiện diện của bạn là niềm vinh hạnh lớn nhất của gia đình chúng tôi."}</p>
            </div>
          )}
          
          <div className="w-full h-[1px] bg-[#d6cfc5]/50 my-10"></div>
          
          <button 
            type="button" 
            onClick={() => setShowGiftModal(true)}
            className="w-full py-4 border border-[#8c7b6b] text-[#8c7b6b] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#f9f8f6] transition-colors"
          >
            Gửi Lời Chúc / Mừng Cưới
          </button>
        </div>
      </section>

      {/* Gift Modal */}
      <AnimatePresence>
        {showGiftModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={() => setShowGiftModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white p-8 max-w-sm w-full relative border-[4px] border-[#8c7b6b] text-center"
            >
              <button onClick={() => setShowGiftModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-800">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
              <h3 className="text-4xl text-[#8c7b6b] mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>Gửi Mừng Cưới</h3>
              
              <div className="flex justify-center gap-4 mb-6">
                <button onClick={() => setGiftTab('groom')} className={`pb-1 px-2 border-b-2 font-sans font-bold uppercase tracking-widest text-[10px] ${giftTab === 'groom' ? 'border-[#8c7b6b] text-[#8c7b6b]' : 'border-transparent text-gray-400'}`}>Mừng Chú Rể</button>
                <button onClick={() => setGiftTab('bride')} className={`pb-1 px-2 border-b-2 font-sans font-bold uppercase tracking-widest text-[10px] ${giftTab === 'bride' ? 'border-[#8c7b6b] text-[#8c7b6b]' : 'border-transparent text-gray-400'}`}>Mừng Cô Dâu</button>
              </div>

              <div className="w-full aspect-square border-4 border-[#9a1a24] p-2 mb-4 bg-white relative flex items-center justify-center">
                 <div className="absolute inset-1 border-[2px] border-dashed border-[#9a1a24]/30 pointer-events-none"></div>
                 <img src={giftTab === 'groom' ? (customData?.groomQR || groomQR || "/assets/wedding/wedding-1/QR.jpg") : (customData?.brideQR || brideQR || "/assets/wedding/wedding-1/QR.jpg")} alt="QR Code" className="w-[85%] h-[85%] object-contain relative z-10" />
              </div>
              
              <div className="font-sans">
                <p className="font-bold text-[#444] text-[10px] uppercase tracking-widest">Quét mã QR để mừng cưới</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <WeddingFooter />
    </div>
  );
}
