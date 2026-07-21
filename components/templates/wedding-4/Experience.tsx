"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { WeddingFooter } from "../WeddingFooter";

interface WeddingFourProps {
  compact?: boolean;
  isBuilderPreview?: boolean;
  autoPlay?: boolean;
  groomName: string;
  brideName: string;
  weddingDate: string;
  heroImage: string;
  gallery: string[];
  musicUrl: string;
  eventAddress: string;
  mapUrl: string;
  groomFamily?: string;
  brideFamily?: string;
  onComplete?: (data: any) => void;
  engagementDate?: string;
  groomQR?: string;
  brideQR?: string;
  customData?: any;
}

export function WeddingFourExperience({
  compact,
  isBuilderPreview,
  autoPlay,
  groomName,
  brideName,
  weddingDate,
  heroImage,
  gallery,
  musicUrl,
  eventAddress,
  mapUrl,
  groomFamily,
  brideFamily,
  onComplete,
  engagementDate,
  groomQR,
  brideQR,
  customData,
}: WeddingFourProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  
  const [isOpened, setIsOpened] = useState(autoPlay || false);
  const [allowScroll, setAllowScroll] = useState(autoPlay || false);
  const [isPlaying, setIsPlaying] = useState(autoPlay || false);
  const [showQR, setShowQR] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpCount, setRsvpCount] = useState("Có");
  const [customCount, setCustomCount] = useState("");
  const [giftTab, setGiftTab] = useState<'groom'|'bride'>('groom');
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  
  const [envelopeState, setEnvelopeState] = useState<"closed" | "opening" | "opened">("closed");
  const [heroHeight, setHeroHeight] = useState<string>("100vh");

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

  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const activeThumb = thumbnailContainerRef.current.children[activeGalleryIndex] as HTMLElement;
      if (activeThumb) {
        const container = thumbnailContainerRef.current;
        const scrollLeft = activeThumb.offsetLeft - (container.clientWidth / 2) + (activeThumb.clientWidth / 2);
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [activeGalleryIndex]);

  useEffect(() => {
    if (autoPlay) {
      setEnvelopeState("opened");
      setIsOpened(true);
      setAllowScroll(true);
    }
  }, [autoPlay]);

  useEffect(() => {
    if (autoPlay && isOpened && containerRef.current) {
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
      }, 1000);
      
      return () => {
        clearTimeout(timeoutId);
        if (reqId) cancelAnimationFrame(reqId);
      };
    }
  }, [autoPlay, isOpened]);

  // Auto-open logic
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setEnvelopeState("opening");
      
      if (audioRef.current && musicUrl) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }

      setTimeout(() => {
        setEnvelopeState("opened");
        setIsOpened(true);
        setAllowScroll(true);
      }, 1000);
    }, 1500); // Wait 1.5s before automatically opening

    return () => {
      clearTimeout(timer1);
    };
  }, []); // Run only once on mount

  const handleOpen = () => {
    // Removed because it auto-opens, but kept for manual override if user clicks early
    if (envelopeState !== "closed") return;
    setEnvelopeState("opening");
    if (audioRef.current && musicUrl) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
    setTimeout(() => {
      setEnvelopeState("opened");
      setIsOpened(true);
    }, 1000);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  // Date Parsing
  const parsedDDate = new Date(customData?.weddingDate || weddingDate || '2026-12-14T11:30:00.000Z');
  const parsedEDate = new Date(customData?.engagementDate || engagementDate || '2026-12-12T09:00:00.000Z');
  const dMonthNumber = parsedDDate.getMonth() + 1;
  const dMonth = 'Tháng ' + dMonthNumber;
  const dDate = parsedDDate.getDate().toString().padStart(2, '0');
  const dYear = parsedDDate.getFullYear().toString();
  const dDayOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][parsedDDate.getDay()];
  const dHours = parsedDDate.getHours().toString().padStart(2, '0');
  const dMinutes = parsedDDate.getMinutes().toString().padStart(2, '0');
  
  const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month - 1, 1).getDay();
  
  const daysInMonth = getDaysInMonth(Number(dYear), dMonthNumber);
  const firstDay = getFirstDayOfMonth(Number(dYear), dMonthNumber);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className={`@container relative w-full h-full bg-[#FAF5F0] text-[#7A1F1F] overflow-hidden ${compact ? "rounded-3xl" : ""}`}>
      
      {/* Background Image fixed for the whole template */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40"
        style={{ backgroundImage: "url('/assets/wedding-4/bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
      />

      <div ref={containerRef} className={`absolute inset-0 z-10 w-full h-full scroll-smooth ${allowScroll ? "overflow-y-auto overflow-x-hidden no-scrollbar" : "overflow-hidden"}`}>
      
        {/* Background Music */}
        {!compact && <audio ref={audioRef} src={musicUrl} loop />}

        {/* HERO SECTION */}
        {/* HERO SECTION */}
        <div className="relative w-full min-h-[100vh] flex flex-col items-center justify-start overflow-hidden shrink-0 pb-8">
          
          {/* Text Content */}
          <div className="w-full flex flex-col items-center text-center px-6 pt-16 z-[20]">
            <motion.h3 
              initial={{ y: -50, opacity: 0 }}
              animate={isOpened ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
              transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
              className="text-3xl text-[#2D2A28] mb-4" 
              style={{ fontFamily: 'var(--font-dancing)' }}
            >
              Thư Mời Cưới
            </motion.h3>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={isOpened ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="w-16 h-[1px] bg-[#2D2A28] mb-6"
            />
            
            <h2 className="text-3xl text-[#7A1F1F] mb-6 flex gap-2 overflow-hidden justify-center items-center" style={{ fontFamily: 'var(--font-dancing)' }}>
              <motion.span
                initial={{ x: -100, opacity: 0 }}
                animate={isOpened ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
                transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
              >
                {groomName}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={isOpened ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                &amp;
              </motion.span>
              <motion.span
                initial={{ x: 100, opacity: 0 }}
                animate={isOpened ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
                transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
              >
                {brideName}
              </motion.span>
            </h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={isOpened ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="text-[12px] uppercase tracking-[0.3em] font-serif text-[#2D2A28] mb-8"
            >
              {dDate}.{dMonthNumber}.{dYear}
            </motion.p>
          </div>

          {/* Envelope Container Wrapper to bypass flexbox safe-centering bugs and explicitly control layout height */}
          <div className="w-full relative mt-[260px]" style={{ height: "80vw", maxHeight: "320px" }}>
            {/* Envelope Container */}
            <div 
              className="absolute top-0 w-[115%] max-w-[460px] left-1/2 -translate-x-1/2 cursor-pointer" 
              style={{ zIndex: 30, clipPath: "polygon(-50% -200%, 150% -200%, 150% 45%, -50% 45%)" }} 
              onClick={() => setIsOpened(true)}
            >
              
              {/* Envelope Flap (z: 10) */}
              <motion.div 
                initial={{ rotateX: 0, scaleY: 1 }}
                animate={isOpened ? { rotateX: [0, -15, 195, 180], scaleY: [1, 1.1, 0.95, 1] } : { rotateX: 0, scaleY: 1 }}
                transition={{ duration: 1.0, delay: 0.2, times: [0, 0.2, 0.7, 1], ease: "easeInOut" }}
                style={{ transformOrigin: "top", zIndex: 10 }}
                className="absolute top-0 left-0 w-full"
              >
                <img src="/assets/wedding-4/headerthu.png" alt="Flap" className="w-full h-auto drop-shadow-xl" />
              </motion.div>

              {/* Photo Wrapper (z: 20) */}
              {/* Pushed high up and explicitly constrained so it naturally sits inside the red pocket without reaching the transparent bottom. */}
              <div 
                className="absolute inset-x-0 w-full flex justify-center top-[-15%]" 
                style={{ zIndex: 20 }}
              >
                <motion.div 
                  initial={{ y: 0, opacity: 0 }}
                  animate={isOpened ? { y: -100, opacity: 1 } : { y: 0, opacity: 0 }}
                  transition={{ duration: 1.0, delay: 0.8, ease: "easeOut" }}
                  className="w-[65%] aspect-[3/4] bg-white p-2 shadow-lg rounded-md relative"
                >
                  <img src={gallery[0] || heroImage} className="w-full h-full object-cover rounded-sm" />
                </motion.div>
              </div>

              {/* Envelope Pocket (z: 30) */}
              <img src="/assets/wedding-4/bodythu.png" alt="Body" className="w-full h-auto relative drop-shadow-2xl pointer-events-none" style={{ zIndex: 30 }} />
              
              {/* Wax Seal (z: 40) */}
              <motion.img 
                src="/assets/wedding-4/dauthu.png" 
                alt="Seal" 
                initial={{ scale: 1, opacity: 1 }}
                animate={isOpened ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0 }}
                className="absolute w-16 h-16 sm:w-20 sm:h-20 top-[40%] left-1/2 -translate-x-1/2 drop-shadow-md pointer-events-none"
                style={{ zIndex: 40 }}
              />
            </div>
          </div>
          
        </div>

        {/* REST OF CONTENT */}
        <div className={`relative z-10 w-full flex flex-col items-center transition-all duration-1000 bg-transparent ${allowScroll ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div className="w-full max-w-md mx-auto flex flex-col items-center px-6 pb-20 pt-8">

          {/* Invitation Text */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="text-center mb-16 w-full">
            <p className="text-[9px] uppercase tracking-widest text-[#2D2A28] mb-4 font-bold">Trân Trọng Kính Mời Tới Dự Bữa Tiệc</p>
            <h2 className="text-4xl text-[#7A1F1F] mb-2" style={{ fontFamily: 'var(--font-dancing)' }}>Lễ Thành Hôn</h2>
            <div className="w-12 h-[1px] bg-[#D6C1A5] mx-auto my-6"></div>
            
            <div className="flex justify-between items-start w-full px-1 mb-8">
              <div className="text-center w-[46%]">
                <p className="text-[10px] text-[#A67C52] uppercase tracking-widest font-bold mb-2">Nhà Trai</p>
                <p className="text-base font-serif text-[#2D2A28] font-bold mb-1">{groomName}</p>
                <p className="text-xl sm:text-2xl text-[#2D2A28] whitespace-pre-line leading-relaxed" style={{ fontFamily: 'var(--font-dancing)' }}>{groomFamily?.replace(/ & /g, '\n')}</p>
              </div>
              <div className="text-xl text-[#7A1F1F] px-1 mt-6" style={{ fontFamily: 'var(--font-dancing)' }}>&amp;</div>
              <div className="text-center w-[46%]">
                <p className="text-[10px] text-[#A67C52] uppercase tracking-widest font-bold mb-2">Nhà Gái</p>
                <p className="text-base font-serif text-[#2D2A28] font-bold mb-1">{brideName}</p>
                <p className="text-xl sm:text-2xl text-[#2D2A28] whitespace-pre-line leading-relaxed" style={{ fontFamily: 'var(--font-dancing)' }}>{brideFamily?.replace(/ & /g, '\n')}</p>
              </div>
            </div>
            
            <p className="text-[10px] text-[#5A5552] italic leading-relaxed">Sự hiện diện của quý khách là vinh hạnh<br/>cho gia đình chúng tôi</p>
          </motion.div>

          {/* Event Details Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="w-full flex flex-col gap-6 mb-16">
            <div className="w-full bg-[#FFFDF9] border border-[#D6C1A5]/50 p-6 shadow-sm relative flex flex-col items-center text-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#7A1F1F]"></div>
              <h3 className="text-lg text-[#7A1F1F] font-bold uppercase tracking-widest mb-4">LỄ THÀNH HÔN</h3>
              <p className="text-[10px] text-[#A67C52] uppercase font-bold tracking-widest mb-2">{dDayOfWeek}</p>
              <p className="text-3xl font-serif text-[#2D2A28] mb-2">{dDate}</p>
              <p className="text-[10px] text-[#A67C52] uppercase font-bold tracking-widest mb-4">Tháng {dMonthNumber} Năm {dYear}</p>
              <p className="text-xs text-[#5A5552] mb-1">Vào lúc <span className="font-bold">{dHours}:{dMinutes}</span></p>
              
              <div className="w-12 h-[1px] bg-[#D6C1A5] mx-auto my-6"></div>
              
              <h3 className="text-[12px] font-serif font-bold text-[#7A1F1F] mb-3 uppercase tracking-[0.2em]">Địa điểm tổ chức Lễ thành hôn Tổ Chức</h3>
              <p className="text-[11px] text-[#5A5552] uppercase font-bold tracking-wider leading-relaxed px-2 mb-1">Tại Tư Gia</p>
              <p className="text-[11px] text-[#5A5552] uppercase tracking-wider leading-relaxed px-2 font-medium mb-4">{eventAddress}</p>
              {mapUrl && (
                <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-2 px-6 py-2 border border-[#7A1F1F] text-[#7A1F1F] text-[9px] uppercase tracking-[0.2em] font-bold hover:bg-[#7A1F1F] hover:text-[#FFFFFF] transition-colors">
                  Xem Bản Đồ
                </a>
              )}
            </div>
            
            {hasTiecMung && (
              <div className="w-full bg-[#FFFDF9] border border-[#D6C1A5]/50 p-6 shadow-sm relative flex flex-col items-center text-center mt-2">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#2C3B2E]"></div>
                <h3 className="text-lg text-[#2C3B2E] font-bold uppercase tracking-widest mb-4">TIỆC MỪNG LỄ THÀNH HÔN {hasTiecMungGai ? "(NHÀ TRAI)" : ""}</h3>
                <p className="text-[10px] text-[#A67C52] uppercase font-bold tracking-widest mb-2">Vào lúc</p>
                <p className="text-3xl font-serif text-[#2D2A28] mb-2">{tiecTrai.time}</p>
                <p className="text-[10px] text-[#A67C52] uppercase font-bold tracking-widest mb-4">{tiecTrai.date}</p>
                
                <div className="w-12 h-[1px] bg-[#D6C1A5] mx-auto my-4"></div>
                
                <p className="text-[11px] text-[#5A5552] uppercase tracking-wider leading-relaxed px-2 font-medium mb-4">
                <span className="block font-bold mb-1">{customData?.tiecName}</span>
                {customData?.tiecAddress}
              </p>
                
                {customData?.tiecMapUrl && (
                  <a href={customData.tiecMapUrl} target="_blank" rel="noreferrer" className="mt-2 px-6 py-2 border border-[#2C3B2E] text-[#2C3B2E] text-[9px] uppercase tracking-[0.2em] font-bold hover:bg-[#2C3B2E] hover:text-[#FFFFFF] transition-colors">Xem Bản Đồ</a>
                )}
              </div>
            )}
            
            {hasTiecMungGai && (
              <div className="w-full bg-[#FFFDF9] border border-[#D6C1A5]/50 p-6 shadow-sm relative flex flex-col items-center text-center mt-2">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#2C3B2E]"></div>
                <h3 className="text-lg text-[#2C3B2E] font-bold uppercase tracking-widest mb-4">TIỆC MỪNG LỄ THÀNH HÔN (NHÀ GÁI)</h3>
                <p className="text-[10px] text-[#A67C52] uppercase font-bold tracking-widest mb-2">Vào lúc</p>
                <p className="text-3xl font-serif text-[#2D2A28] mb-2">{tiecGai.time}</p>
                <p className="text-[10px] text-[#A67C52] uppercase font-bold tracking-widest mb-4">{tiecGai.date}</p>
                
                <div className="w-12 h-[1px] bg-[#D6C1A5] mx-auto my-4"></div>
                
                <p className="text-[11px] text-[#5A5552] uppercase tracking-wider leading-relaxed px-2 font-medium mb-4">
                <span className="block font-bold mb-1">{customData?.tiecNameGai}</span>
                {customData?.tiecAddressGai}
              </p>
                
                {customData?.tiecMapUrlGai && (
                  <a href={customData.tiecMapUrlGai} target="_blank" rel="noreferrer" className="mt-2 px-6 py-2 border border-[#2C3B2E] text-[#2C3B2E] text-[9px] uppercase tracking-[0.2em] font-bold hover:bg-[#2C3B2E] hover:text-[#FFFFFF] transition-colors">Xem Bản Đồ</a>
                )}
              </div>
            )}
            
          </motion.div>

          {/* Calendar */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="w-full bg-[#FFFDF9] border border-[#D6C1A5]/50 p-6 shadow-sm mb-16">
            <h3 className="text-center font-serif text-sm tracking-widest text-[#2D2A28] uppercase mb-6">{dMonth} . {dYear}</h3>
            <div className="grid grid-cols-7 gap-y-4 text-center text-xs mb-2">
              <span className="text-[#7A1F1F] font-bold">SU</span>
              <span className="font-bold text-[#2D2A28]">MO</span>
              <span className="font-bold text-[#2D2A28]">TU</span>
              <span className="font-bold text-[#2D2A28]">WE</span>
              <span className="font-bold text-[#2D2A28]">TH</span>
              <span className="font-bold text-[#2D2A28]">FR</span>
              <span className="font-bold text-[#2D2A28]">SA</span>
              
              {/* Empties */}
              {[...Array(firstDay)].map((_, i) => (
                <span key={`empty-${i}`}></span>
              ))}
              
              {/* Days */}
              {monthDays.map(day => {
                const isWedding = day === Number(dDate) && parsedDDate.getMonth() + 1 === dMonthNumber && parsedDDate.getFullYear() === Number(dYear);
                let tiecDay = 0, tiecMonth = 0, tiecYear = 0;
                const tiecToUse = (!hasTiecMungGai) ? tiecTrai : tiecGai;
                if (tiecToUse && tiecToUse.date) {
                  const [td, tm, ty] = tiecToUse.date.split("/");
                  tiecDay = parseInt(td); tiecMonth = parseInt(tm); tiecYear = parseInt(ty);
                }
                const isTiec = tiecDay === day && tiecMonth === dMonthNumber && tiecYear === Number(dYear);
                return (
                  <div key={day} className="relative flex justify-center items-center w-7 h-7 mx-auto">
                    {isWedding && (
                      <motion.svg initial={{ scale: 0 }} whileInView={{ scale: 1.15 }} viewport={{ once: true }} transition={{ delay: 0.5, type: "spring" }} className="absolute inset-0 w-[120%] h-[120%] -left-[10%] -top-[10%] text-[#7A1F1F]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </motion.svg>
                    )}
                    {isTiec && !isWedding && (
                      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 0.9 }} viewport={{ once: true }} transition={{ delay: 0.6, type: "spring" }} className="absolute inset-0 border-[1.5px] border-dashed border-[#7A1F1F] rounded-full bg-[#7A1F1F]/5" />
                    )}
                    <span className={`relative z-10 ${isWedding ? "text-[#FFFFFF] font-bold text-[11px]" : isTiec ? "text-[#7A1F1F] font-bold" : "text-[#5A5552]"}`}>{day}</span>
                    {isTiec && isWedding && (
                      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, type: "spring" }} className="absolute inset-0 w-[140%] h-[140%] -left-[20%] -top-[20%] rounded-full border-[1.5px] border-dashed border-[#7A1F1F] z-0 opacity-70"></motion.div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-[9px] font-sans font-bold uppercase tracking-widest text-[#7A1F1F]">
                <svg className="w-4 h-4 text-[#7A1F1F]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> Lễ Cưới
              </div>
              {(hasTiecMung || hasTiecMungGai) && (
                <div className="flex items-center gap-2 text-[9px] font-sans font-bold uppercase tracking-widest text-[#7A1F1F]">
                  <div className="w-3.5 h-3.5 rounded-full border-[1.5px] border-dashed border-[#7A1F1F] bg-[#7A1F1F]/5"></div> Tiệc Mừng
                </div>
              )}
            </div>
          </motion.div>

          {/* Decorative Open Envelope Block */}
          <div className="w-full px-6 mb-16 overflow-visible">
            <div className="flex justify-between items-start w-full mb-8 pt-4">
              <div className="flex flex-col mt-2">
                <h3 className="text-4xl text-[#2D2A28] leading-none mb-2" style={{ fontFamily: 'var(--font-dancing)' }}>Save The</h3>
                <h3 className="text-4xl text-[#2D2A28] leading-none ml-6" style={{ fontFamily: 'var(--font-dancing)' }}>Date</h3>
              </div>
              <div className="flex items-center text-[#7A1F1F] font-serif mr-2">
                <span className="text-[3.5rem] leading-none -mt-12">{dDate}</span>
                <span className="text-[4rem] font-light opacity-40 mx-[-6px]">/</span>
                <span className="text-[3.5rem] leading-none mt-12">{dMonthNumber}</span>
              </div>
            </div>
            
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="relative w-[130%] max-w-[480px] aspect-square flex justify-center mx-auto -rotate-[6deg] -translate-x-12 mt-12 mb-12">
              
              <div className="relative w-full h-full">
                {/* Back of Envelope */}
                <img src="/assets/wedding-4/matsauthu.webp" alt="Back" className="absolute top-0 left-0 w-full h-auto pointer-events-none z-[10] opacity-90 -translate-y-[28%]" />
                
                <div className="absolute inset-0 w-full h-full z-[20] pointer-events-none">
                  <motion.div initial={{ y: 80, rotate: -5 }} whileInView={{ y: 0, rotate: -5 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="w-[38%] aspect-[3/4] bg-white p-[4px] shadow-md absolute left-[28%] top-[2%] origin-bottom-left">
                    <img src={gallery[1] || heroImage} className="w-full h-full object-cover" />
                  </motion.div>
                  <motion.div initial={{ y: 80, rotate: 8 }} whileInView={{ y: 0, rotate: 8 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }} className="w-[38%] aspect-[3/4] bg-white p-[4px] shadow-md absolute right-[28%] top-[6%] origin-bottom-right">
                    <img src={gallery[2] || gallery[0] || heroImage} className="w-full h-full object-cover" />
                  </motion.div>
                </div>
                
                {/* Front Pocket Layer */}
                <img src="/assets/wedding-4/mattruocthu.webp" alt="Front" className="absolute top-0 left-0 w-full h-auto pointer-events-none z-[30] drop-shadow-xl -translate-y-[28%]" />
              </div>
            </motion.div>
          </div>

          {/* Gallery Slider */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="w-full flex flex-col items-center mb-16 px-4">
            <h3 className="text-[12px] font-serif font-bold text-[#2D2A28] mb-6 uppercase tracking-[0.2em]">Khoảnh Khắc</h3>
            
            {gallery.length > 0 && (
              <div className="w-full">
                {/* Thumbnail Grid (Masonry 2-col) */}
                <div className="columns-2 gap-3 w-full mb-6 space-y-3">
                  {gallery.map((img, index) => (
                    <button 
                      key={index} 
                      onClick={() => setActiveGalleryIndex(index)} 
                      className={`relative w-full overflow-hidden transition-all inline-block ${index === activeGalleryIndex ? 'opacity-100 ring-2 ring-[#7A1F1F] ring-offset-2' : 'opacity-80 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-auto object-cover rounded-[2px]" />
                    </button>
                  ))}
                </div>
                
                {/* Main Slider Image */}
                <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] bg-gray-100 overflow-hidden group mb-4">
                  <img src={gallery[activeGalleryIndex]} alt={`Gallery ${activeGalleryIndex}`} className="w-full h-full object-cover transition-opacity duration-500" />
                  
                  {/* Navigation Arrows */}
                  <button onClick={() => setActiveGalleryIndex(prev => prev > 0 ? prev - 1 : gallery.length - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#FFFFFF] drop-shadow-md opacity-70 hover:opacity-100 transition-opacity z-10">
                    <ChevronLeft size={28} />
                  </button>
                  <button onClick={() => setActiveGalleryIndex(prev => prev < gallery.length - 1 ? prev + 1 : 0)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#FFFFFF] drop-shadow-md opacity-70 hover:opacity-100 transition-opacity z-10">
                    <ChevronRight size={28} />
                  </button>
                </div>

                {/* Thumbnail Row */}
                <div ref={thumbnailContainerRef} className="flex w-full gap-2 overflow-x-auto snap-x pb-2 no-scrollbar">
                  {gallery.map((img, index) => (
                    <button 
                      key={index} 
                      onClick={() => setActiveGalleryIndex(index)} 
                      className={`relative flex-shrink-0 w-20 aspect-square overflow-hidden snap-center transition-all ${index === activeGalleryIndex ? 'opacity-100 ring-2 ring-[#7A1F1F] ring-offset-1' : 'opacity-50 hover:opacity-80'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* RSVP Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="w-full bg-[#FFFDF9] border border-[#D6C1A5]/50 p-6 shadow-sm relative flex flex-col items-center mb-16">
            <h3 className="text-[12px] font-serif font-bold text-[#7A1F1F] mb-6 uppercase tracking-[0.2em]">Xác Nhận Tham Dự</h3>
            <div className="w-full flex flex-col gap-4">
              <input type="text" value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="Tên của bạn..." className="w-full bg-transparent border-b border-[#D6C1A5] text-[#2D2A28] text-xs px-2 py-3 outline-none" />
              <input type="text" value={rsvpPhone} onChange={e => setRsvpPhone(e.target.value)} placeholder="Số điện thoại..." className="w-full bg-transparent border-b border-[#D6C1A5] text-[#2D2A28] text-xs px-2 py-3 outline-none" />
              <select value={rsvpCount} onChange={e => setRsvpCount(e.target.value)} className="w-full bg-transparent border-b border-[#D6C1A5] text-[#2D2A28] text-xs px-2 py-3 outline-none appearance-none">
                <option value="Có">Có tham dự</option>
                <option value="Không">Không tham dự</option>
                <option value="Khác">Có, dắt theo người thân</option>
              </select>
              {rsvpCount === "Khác" && (
                <input type="number" min="1" value={customCount} onChange={e => setCustomCount(e.target.value)} placeholder="Nhập tổng số người..." className="w-full bg-transparent border-b border-[#D6C1A5] text-[#2D2A28] text-xs px-2 py-3 outline-none mt-4" required />
              )}
              <textarea placeholder="Gửi lời chúc..." rows={2} className="w-full bg-transparent border-b border-[#D6C1A5] text-[#2D2A28] text-xs px-2 py-3 outline-none resize-none"></textarea>
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => !compact && onComplete?.({ name: rsvpName, phone: rsvpPhone, count: rsvpCount === "Khác" ? customCount : rsvpCount })}
                  className="flex-1 bg-[#7A1F1F] text-[#FFFFFF] text-[10px] font-bold uppercase tracking-widest py-3 hover:bg-[#5a1515] transition-colors"
                >
                  Gửi Phản Hồi
                </button>
                <button 
                  onClick={() => setShowQR(true)}
                  className="flex-[0.5] border border-[#7A1F1F] text-[#7A1F1F] flex items-center justify-center text-[10px] font-bold uppercase tracking-widest py-3 hover:bg-[#7A1F1F]/10 transition-colors"
                >
                  Mừng Cưới
                </button>
              </div>
            </div>
          </motion.div>

        </div>
        
        {/* Footer */}
        <div className="w-full pt-12 pb-24 flex flex-col items-center relative z-10 bg-transparent text-center px-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-xl sm:text-3xl text-[#7A1F1F] font-serif whitespace-nowrap">{groomName}</span>
            <span className="text-2xl sm:text-4xl text-[#2D2A28] mx-1" style={{ fontFamily: 'var(--font-dancing)' }}>&amp;</span>
            <span className="text-xl sm:text-3xl text-[#7A1F1F] font-serif whitespace-nowrap">{brideName}</span>
          </div>
          <p className="text-[12px] uppercase tracking-[0.3em] font-serif text-[#2D2A28] mb-8">
            {dDate}.{dMonthNumber}.{dYear}
          </p>
          <h2 className="text-2xl sm:text-4xl text-[#2D2A28]" style={{ fontFamily: 'var(--font-dancing)' }}>
            Rất Hân Hạnh Được Đón Tiếp!
          </h2>
        </div>

      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center p-6 backdrop-blur-sm" 
            onClick={() => setShowQR(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#FFFDF9] p-8 flex flex-col items-center max-w-sm w-full border border-[#D6C1A5]" 
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-3xl text-[#7A1F1F] mb-4" style={{ fontFamily: 'var(--font-dancing)' }}>Mừng Cưới</h3>
              
              <div className="flex justify-center gap-4 mb-4">
                <button onClick={() => setGiftTab('groom')} className={`pb-1 px-2 border-b-2 font-sans font-bold uppercase tracking-widest text-[10px] ${giftTab === 'groom' ? 'border-[#7A1F1F] text-[#7A1F1F]' : 'border-transparent text-[#A67C52]'}`}>Mừng Chú Rể</button>
                <button onClick={() => setGiftTab('bride')} className={`pb-1 px-2 border-b-2 font-sans font-bold uppercase tracking-widest text-[10px] ${giftTab === 'bride' ? 'border-[#7A1F1F] text-[#7A1F1F]' : 'border-transparent text-[#A67C52]'}`}>Mừng Cô Dâu</button>
              </div>
              
              <div className="w-48 h-48 bg-white p-2 border border-[#D6C1A5]/50 mb-6 flex items-center justify-center overflow-hidden">
                <img src={giftTab === 'groom' ? (groomQR || "/assets/wedding/wedding-1/QR.jpg") : (brideQR || "/assets/wedding/wedding-1/QR.jpg")} alt="QR Mừng Cưới" className="w-full h-full object-contain" />
              </div>
              
              <button 
                onClick={() => setShowQR(false)} 
                className="w-full py-3 bg-[#7A1F1F] text-[#FFFFFF] font-bold text-[10px] uppercase tracking-widest hover:bg-[#5a1515] transition-colors"
              >
                Đóng
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Button */}
      {isOpened && !compact && (
        <button
          onClick={toggleAudio}
          className="fixed bottom-6 left-6 z-50 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-[#D6C1A5]/30 hover:scale-110 transition-transform"
        >
          {isPlaying ? <Pause size={16} className="text-[#7A1F1F]" /> : <Play size={16} className="text-[#7A1F1F] ml-1" />}
        </button>
      )}

      <WeddingFooter />
      </div>
    </div>
  );
}