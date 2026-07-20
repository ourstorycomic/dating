"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, MapPin } from "lucide-react";
import { WeddingFooter } from "../WeddingFooter";

interface WeddingFiveProps {
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

export function WeddingFiveExperience({
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
}: WeddingFiveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpCount, setRsvpCount] = useState("Có");
  const [customCount, setCustomCount] = useState("");
  const [giftTab, setGiftTab] = useState<'groom'|'bride'>('groom');

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

  // Auto-scroll logic if needed
  useEffect(() => {
    if (autoPlay && containerRef.current) {
      let reqId: number;
      const timeoutId = setTimeout(() => {
        let scrollAmount = 0;
        const speed = 0.3;
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
      }, 2000);
      
      return () => {
        clearTimeout(timeoutId);
        if (reqId) cancelAnimationFrame(reqId);
      };
    }
  }, [autoPlay]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  // Date Parsing
  const parsedDDate = new Date(customData?.weddingDate || weddingDate || '2026-12-14T11:30:00.000Z');
  const dMonthNumber = parsedDDate.getMonth() + 1;
  const dMonth = dMonthNumber.toString().padStart(2, '0');
  const dDate = parsedDDate.getDate().toString().padStart(2, '0');
  const dYear = parsedDDate.getFullYear().toString();
  const dDayOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][parsedDDate.getDay()];
  const dHours = parsedDDate.getHours().toString().padStart(2, '0');
  const dMinutes = parsedDDate.getMinutes().toString().padStart(2, '0');

  const parsedEDate = new Date(customData?.engagementDate || engagementDate || '2026-12-12T09:00:00.000Z');
  const eMonthNumber = parsedEDate.getMonth() + 1;
  const eMonth = eMonthNumber.toString().padStart(2, '0');
  const eDate = parsedEDate.getDate().toString().padStart(2, '0');
  const eYear = parsedEDate.getFullYear().toString();
  const eDayOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][parsedEDate.getDay()];
  const eHours = parsedEDate.getHours().toString().padStart(2, '0');
  const eMinutes = parsedEDate.getMinutes().toString().padStart(2, '0');

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  return (
    <div className={`@container relative w-full h-full bg-[#f8faeb] text-[#3e4a3d] overflow-hidden ${compact ? "rounded-3xl" : ""}`}>
      
      {/* Fixed Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply"
        style={{ backgroundImage: "url('/assets/wedding/wedding-5/bg.webp')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}
      />

      <div ref={containerRef} className="absolute inset-0 z-10 w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar scroll-smooth">
        {!compact && <audio ref={audioRef} src={musicUrl} loop />}
        
        <div className="w-full max-w-md mx-auto relative min-h-[100dvh] flex flex-col items-center">
          
          {/* FULLSCREEN HERO */}
          <div className="w-full min-h-[100dvh] flex flex-col items-center justify-center relative z-10 overflow-hidden px-6">
            
            {/* Falling Flowers (Particles) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <motion.img
                  key={i}
                  src="/assets/wedding/wedding-5/hoa.webp"
                  className="absolute opacity-70 w-6 sm:w-8 mix-blend-multiply"
                  initial={{ 
                    top: '-10%', 
                    left: `${(i * 13) % 100}%`,
                    rotate: 0 
                  }}
                  animate={{ 
                    top: '120%', 
                    left: `${((i * 13) % 100) + (i % 2 === 0 ? 10 : -10)}%`,
                    rotate: 360 
                  }}
                  transition={{ 
                    duration: 12 + (i % 5) * 2, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: (i % 7) * 1.5 
                  }}
                />
              ))}
            </div>

            {/* --- REFERENCE LAYOUT (THIEPMAUHOASEN) - AGGRESSIVE SCALE & FADE --- */}
            {/* 1. Top Left Decor (hoasengoctren.webp) - Increased size massively */}
            <motion.img 
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 4, ease: "easeOut" }}
              src="/assets/wedding/wedding-5/hoasengoctren.webp" 
              className="absolute top-[-5%] left-[-20%] w-[200%] sm:w-[150%] max-w-none mix-blend-multiply pointer-events-none opacity-80" 
            />

            {/* 2. Top Right Decor (honggoc.webp) */}
            <motion.img 
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 3, ease: "easeOut" }}
              src="/assets/wedding/wedding-5/honggoc.webp" 
              className="absolute top-[-5%] right-[-10%] w-[120%] max-w-none mix-blend-multiply opacity-80 pointer-events-none" 
            />

            {/* --- BOTTOM DECOR WRAPPER (Fades out bottom cut lines perfectly) --- */}
            <div className="absolute inset-0 pointer-events-none z-10 [mask-image:linear-gradient(to_bottom,black_60%,transparent_95%)] [-webkit-mask-image:linear-gradient(to_bottom,black_60%,transparent_95%)]">
              {/* 3a. Bottom Left Leaf Branch (lacay.webp) - Massively scaled to stick out behind lotus */}
              <motion.img 
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 3, ease: "easeOut" }}
                src="/assets/wedding/wedding-5/lacay.webp" 
                className="absolute bottom-[15%] left-[-25%] w-[250%] sm:w-[200%] max-w-none mix-blend-multiply opacity-90 pointer-events-none" 
              />

              {/* 3. Bottom Left Lotus (hoasen.webp) - Taller */}
              <motion.img 
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 3, delay: 0.2, ease: "easeOut" }}
                src="/assets/wedding/wedding-5/hoasen.webp" 
                className="absolute bottom-[8%] left-[-35%] w-[200%] sm:w-[160%] max-w-none mix-blend-multiply opacity-95 pointer-events-none" 
              />

              {/* 4. Bottom Right Leaf (lasen.webp) */}
              <motion.img 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2, ease: "easeOut" }}
                src="/assets/wedding/wedding-5/lasen.webp" 
                className="absolute bottom-[2%] right-[-15%] w-[130%] sm:w-[110%] max-w-none mix-blend-multiply opacity-90 pointer-events-none" 
              />

              {/* 5. Bottom Middle Bud (hoasen.png) - Lowered further */}
              <motion.img 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 6, ease: "easeOut" }}
                src="/assets/wedding/wedding-5/hoasen.png" 
                className="absolute bottom-[1%] right-[10%] w-[120%] sm:w-[100%] max-w-none mix-blend-multiply opacity-90 pointer-events-none" 
              />

              {/* 6. Bottom Right Blooming Lotus (hoasennohoa.webp) */}
              <motion.img 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 6, ease: "easeOut" }}
                src="/assets/wedding/wedding-5/hoasennohoa.webp" 
                className="absolute bottom-[8%] right-[-20%] w-[180%] sm:w-[150%] max-w-none mix-blend-multiply pointer-events-none" 
              />
            </div>
            {/* ----------------------------------- */}

            {/* CENTER TEXT */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none mt-[-12vh]">
              <motion.h3 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 6, ease: "easeOut" }}
                className="text-[#5a6946] uppercase tracking-[0.25em] text-[12px] sm:text-[13px] mb-6 font-serif font-medium"
              >
                Thư Mời Cưới
              </motion.h3>
              
              <motion.h1 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 4, ease: "easeOut" }}
                className="text-[28px] md:text-4xl text-[#2d3a24] mb-8 text-center leading-[1.2] px-2 drop-shadow-sm whitespace-nowrap" style={{ fontFamily: 'var(--font-dancing)' }}
              >
                <span className="flex flex-col items-center gap-1 sm:gap-2"><span>{groomName}</span> <span className="text-[20px] md:text-2xl text-[#5a6946] font-serif font-light mx-2 align-middle opacity-80">&amp;</span> <span>{brideName}</span></span>
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 4, delay: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center text-[#2d3a24]"
              >
                <div className="text-3xl md:text-5xl font-serif font-light tracking-widest flex items-center gap-1">
                  <span>{dDate}</span>
                  <span className="mb-2 text-xl md:text-3xl opacity-50">.</span>
                  <span>{dMonth}</span>
                </div>
                <div className="text-2xl md:text-4xl font-serif font-light tracking-widest mt-2">{dYear}</div>
              </motion.div>
            </div>
            
            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none"
            >
              <span className="text-[9px] uppercase tracking-widest text-[#4a5a40] font-bold">Kéo xuống</span>
              <motion.div 
                animate={{ y: [0, 8, 0] }} 
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-0.5 h-8 bg-gradient-to-b from-[#4a5a40] to-transparent"
              />
            </motion.div>
          </div>
          
          <div className="w-full px-6 mb-20 relative z-20 mt-12">
            {/* INVITATION BOX */}
            <motion.div 
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
              className="w-full bg-[#fffff8]/80 backdrop-blur-sm border-[1.5px] border-[#c5b182] p-8 relative flex flex-col items-center shadow-sm rounded-tr-[40px] rounded-bl-[40px]"
            >
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#b19556]"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#b19556]"></div>
              
              <div className="w-full flex justify-between items-start mb-6">
                <div className="text-center w-[45%]">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-[#b19556] mb-2">Nhà Trai</p>
                  <p className="text-sm text-[#4a5a40] uppercase leading-relaxed font-semibold">{groomFamily}</p>
                </div>
                <div className="text-center w-[45%]">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-[#b19556] mb-2">Nhà Gái</p>
                  <p className="text-sm text-[#4a5a40] uppercase leading-relaxed font-semibold">{brideFamily}</p>
                </div>
              </div>
              
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#555] mb-4">Trân trọng báo tin lễ thành hôn</p>
              
              <div className="text-3xl text-[#4a5a40] flex flex-col items-center gap-1" style={{ fontFamily: 'var(--font-dancing)' }}>
                <span>{groomName}</span>
                <span className="text-[#b19556] text-xl">&amp;</span>
                <span>{brideName}</span>
              </div>
              
              {/* Decorative Corner Flowers */}
              <img src="/assets/wedding/wedding-5/honggoc.webp" className="absolute -bottom-6 -right-6 w-24 opacity-60 mix-blend-multiply pointer-events-none" />
            </motion.div>
          </div>

          {/* BRIDE & GROOM SECTION */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="w-full px-6 mb-16 relative">
            <h3 className="text-3xl text-[#4a5a40] mb-12 text-center" style={{ fontFamily: 'var(--font-dancing)' }}>Cô Dâu &amp; Chú Rể</h3>
            
            {/* Groom */}
            <div className="flex flex-col items-start w-full relative mb-16">
              <div className="w-[55%] aspect-[3/4] relative z-10 border-[4px] border-white shadow-md bg-white rounded-sm overflow-hidden">
                <img src="/assets/wedding/wedding-5/chure.jpg" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-4 w-[60%] z-20 text-right">
                <p className="text-[10px] uppercase tracking-widest text-[#b19556] font-bold mb-1">Chú Rể</p>
                <h4 className="text-3xl text-[#4a5a40]" style={{ fontFamily: 'var(--font-dancing)' }}>{groomName}</h4>
              </div>
              {/* Decorative elements */}
              <img src="/assets/wedding/wedding-5/lasen.webp" className="absolute -top-6 -left-4 w-24 opacity-60 mix-blend-multiply pointer-events-none z-0" />
            </div>
            
            {/* Bride */}
            <div className="flex flex-col items-end w-full relative">
              <div className="w-[55%] aspect-[3/4] relative z-10 border-[4px] border-white shadow-md bg-white rounded-sm overflow-hidden">
                <img src="/assets/wedding/wedding-5/codau.jpg" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 left-4 w-[60%] z-20 text-left">
                <p className="text-[10px] uppercase tracking-widest text-[#b19556] font-bold mb-1">Cô Dâu</p>
                <h4 className="text-3xl text-[#4a5a40]" style={{ fontFamily: 'var(--font-dancing)' }}>{brideName}</h4>
              </div>
              {/* Decorative elements */}
              <img src="/assets/wedding/wedding-5/hoa.webp" className="absolute -bottom-4 right-8 w-16 opacity-80 mix-blend-multiply pointer-events-none z-20" />
              <img src="/assets/wedding/wedding-5/hoasennohoa.webp" className="absolute -left-6 top-1/2 w-28 opacity-40 mix-blend-multiply pointer-events-none z-0 -translate-y-1/2" />
            </div>
            
            {/* Center lotus combination */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none z-0 opacity-20">
               <img src="/assets/wedding/wedding-5/hoasen.png" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
          </motion.div>

          {/* MAIN PHOTO */}
          <motion.div 
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="w-full px-4 mb-16"
          >
            <div className="w-full rounded-sm overflow-hidden shadow-md border-4 border-white bg-white">
              <img src={heroImage} className="w-full h-auto" />
            </div>
            <p className="text-center text-[11px] text-[#4a5a40] italic mt-6 px-4 leading-relaxed font-serif">
              Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi
            </p>
          </motion.div>

          {/* EVENT DETAILS */}
          <div className="w-full px-6 flex flex-col items-center mb-16 gap-10">
            {/* Ceremony */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="w-full flex flex-col items-center text-center relative px-6">
              <img src="/assets/wedding/wedding-5/lacay.webp" className="absolute -top-6 -left-4 w-12 opacity-50 mix-blend-multiply" />
              <h3 className="text-xl font-bold text-[#4a5a40] tracking-widest mb-4">LỄ THÀNH HÔN</h3>
              <p className="text-[11px] uppercase tracking-widest text-[#b19556] font-bold mb-2">{dDayOfWeek}</p>
              <div className="text-2xl font-serif text-[#2d2d2d] mb-2">{dDate} . {dMonth} . {dYear}</div>
              <p className="text-[10px] text-[#666] mb-2">Tại Tư Gia</p>
              <p className="text-[10px] text-[#666] mb-4 max-w-[200px] leading-relaxed">{eventAddress}</p>
              {mapUrl && (
                <a href={mapUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#4a5a40] text-[#FFFFFF] px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#34412c] transition-colors mt-2 mb-2">
                  Xem Bản Đồ
                </a>
              )}
              <p className="text-[11px] text-[#4a5a40] font-bold uppercase tracking-widest mt-2">Vào lúc {dHours}:{dMinutes}</p>
            </motion.div>
            
            <div className="w-16 h-[1px] bg-[#c5b182]"></div>
            
            {/* Party (Trai) */}
            {hasTiecMung && (
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="w-full flex flex-col items-center text-center relative px-6">
                <h3 className="text-xl font-bold text-[#4a5a40] tracking-widest mb-4">TIỆC MỪNG LỄ THÀNH HÔN {hasTiecMungGai ? "(NHÀ TRAI)" : ""}</h3>
                <p className="text-[11px] uppercase tracking-widest text-[#b19556] font-bold mb-2">Vào lúc {tiecTrai.time}</p>
                <div className="text-2xl font-serif text-[#2d2d2d] mb-4">{tiecTrai.date}</div>
                <p className="text-[10px] text-[#666] leading-relaxed px-4 mb-6">
                <strong>{customData?.tiecName}</strong><br/>
                {customData?.tiecAddress}
              </p>
                
                <img src="/assets/wedding/wedding-5/hoasennohoa.webp" className="absolute -bottom-10 -right-4 w-20 opacity-70 mix-blend-multiply pointer-events-none" />
                
                {customData?.tiecMapUrl && (
                  <a href={customData.tiecMapUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#4a5a40] text-[#FFFFFF] px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#34412c] transition-colors shadow-md">
                    <MapPin size={14} />
                    Xem Chỉ Đường
                  </a>
                )}
              </motion.div>
            )}

            {/* Party (Gai) */}
            {hasTiecMungGai && (
              <>
                <div className="w-16 h-[1px] bg-[#c5b182] my-4"></div>
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="w-full flex flex-col items-center text-center relative px-6">
                  <h3 className="text-xl font-bold text-[#4a5a40] tracking-widest mb-4">TIỆC MỪNG LỄ THÀNH HÔN (NHÀ GÁI)</h3>
                  <p className="text-[11px] uppercase tracking-widest text-[#b19556] font-bold mb-2">Vào lúc {tiecGai.time}</p>
                  <div className="text-2xl font-serif text-[#2d2d2d] mb-4">{tiecGai.date}</div>
                  <p className="text-[10px] text-[#666] leading-relaxed px-4 mb-6">
                <strong>{customData?.tiecNameGai}</strong><br/>
                {customData?.tiecAddressGai}
              </p>
                  
                  {customData?.tiecMapUrlGai && (
                    <a href={customData.tiecMapUrlGai} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#4a5a40] text-[#FFFFFF] px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#34412c] transition-colors shadow-md">
                      <MapPin size={14} />
                      Xem Chỉ Đường
                    </a>
                  )}
                </motion.div>
              </>
            )}
          </div>

          {/* MAP IFRAME */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="w-full px-6 mb-16">
            <div className="w-full h-48 bg-gray-200 border-2 border-[#fff] shadow-md rounded-md overflow-hidden p-1">
              <iframe 
                src={`https://maps.google.com/maps?q=${encodeURIComponent(eventAddress || 'Hanoi, Vietnam')}&t=&z=15&ie=UTF8&iwloc=&output=embed`} 
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '4px' }} 
                allowFullScreen 
                loading="lazy"
              ></iframe>
            </div>
          </motion.div>

          {/* RSVP FORM */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="w-full px-6 mb-16">
            <div className="w-full bg-[#fffff8]/90 backdrop-blur-sm border-[1.5px] border-[#c5b182] p-6 rounded-tl-[30px] rounded-br-[30px] shadow-sm flex flex-col items-center relative overflow-hidden">
              <img src="/assets/wedding/wedding-5/lasen.webp" className="absolute top-0 right-0 w-24 opacity-30 mix-blend-multiply pointer-events-none" />
              
              <div className="w-full bg-[#4a5a40] text-[#FFFFFF] py-3 px-4 rounded-full text-center mb-6 relative z-10 shadow-sm">
                <h3 className="text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border border-white/50 rounded-full flex items-center justify-center text-[8px]">✉</span>
                  Xác Nhận Tham Dự Lễ Cưới
                </h3>
              </div>
              
              <div className="w-full flex flex-col gap-4 relative z-10">
                <input type="text" value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="Tên của bạn *" className="w-full bg-transparent border-b border-[#c5b182] text-[#2d2d2d] text-xs px-2 py-2 outline-none focus:border-[#4a5a40] transition-colors placeholder:text-[#999]" />
                <input type="text" value={rsvpPhone} onChange={e => setRsvpPhone(e.target.value)} placeholder="Số điện thoại *" className="w-full bg-transparent border-b border-[#c5b182] text-[#2d2d2d] text-xs px-2 py-2 outline-none focus:border-[#4a5a40] transition-colors placeholder:text-[#999]" />
                <select value={rsvpCount} onChange={e => setRsvpCount(e.target.value)} className="w-full bg-transparent border-b border-[#c5b182] text-[#2d2d2d] text-xs px-2 py-2 outline-none focus:border-[#4a5a40] transition-colors appearance-none">
                  <option value="Có">Có tham dự</option>
                  <option value="Không">Không tham dự</option>
                  <option value="Khác">Có, dắt theo người thân</option>
                </select>
                {rsvpCount === "Khác" && (
                  <input type="number" min="1" value={customCount} onChange={e => setCustomCount(e.target.value)} placeholder="Nhập tổng số người..." className="w-full bg-transparent border-b border-[#c5b182] text-[#2d2d2d] text-xs px-2 py-2 outline-none focus:border-[#4a5a40] transition-colors mt-4" required />
                )}
                
                <div className="flex flex-col gap-3 mt-4">
                  <button 
                    onClick={() => !compact && onComplete?.({ name: rsvpName, phone: rsvpPhone, count: rsvpCount === "Khác" ? customCount : rsvpCount })}
                    className="w-full border border-[#4a5a40] text-[#4a5a40] bg-transparent text-[10px] font-bold uppercase tracking-widest py-3 rounded-full hover:bg-[#4a5a40] hover:text-[#FFFFFF] transition-colors"
                  >
                    Gửi Phản Hồi
                  </button>
                  <button 
                    onClick={() => setShowQR(true)}
                    className="w-full bg-[#4a5a40] text-[#FFFFFF] text-[10px] font-bold uppercase tracking-widest py-3 rounded-full hover:bg-[#34412c] shadow-md transition-colors"
                  >
                    Mừng Cưới
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* GALLERY MASONRY */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="w-full px-4 mb-16 flex flex-col items-center">
            <h3 className="text-3xl text-[#4a5a40] mb-8" style={{ fontFamily: 'var(--font-dancing)' }}>Khoảnh khắc</h3>
            
            <div className="columns-2 gap-3 w-full space-y-3">
              {gallery.map((img, index) => (
                <div key={index} className="relative w-full overflow-hidden inline-block rounded-sm shadow-sm border-[3px] border-white bg-white">
                  <img src={img} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" alt={`Gallery ${index}`} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* FOOTER */}
          <div className="w-full flex flex-col items-center text-center relative pt-8 pb-32 overflow-hidden px-6">
            <p className="text-[12px] uppercase tracking-widest font-serif text-[#b19556] font-bold mb-4">Rất hân hạnh được đón tiếp!</p>
            <h2 className="text-4xl text-[#4a5a40] mb-2" style={{ fontFamily: 'var(--font-dancing)' }}>{groomName}</h2>
            <h2 className="text-4xl text-[#4a5a40] ml-12" style={{ fontFamily: 'var(--font-dancing)' }}>{brideName}</h2>
            
            <img src="/assets/wedding/wedding-5/hoasenfooter.webp" className="absolute bottom-0 left-0 w-full object-cover mix-blend-multiply opacity-90 pointer-events-none" />
          </div>

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
              className="bg-[#f8faeb] p-8 flex flex-col items-center max-w-sm w-full border-[2px] border-[#c5b182] rounded-3xl shadow-xl" 
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-4xl text-[#4a5a40] mb-4" style={{ fontFamily: 'var(--font-dancing)' }}>Mừng Cưới</h3>
              
              <div className="flex justify-center gap-4 mb-4">
                <button onClick={() => setGiftTab('groom')} className={`pb-1 px-2 border-b-2 font-sans font-bold uppercase tracking-widest text-[10px] ${giftTab === 'groom' ? 'border-[#4a5a40] text-[#4a5a40]' : 'border-transparent text-[#b19556]'}`}>Mừng Chú Rể</button>
                <button onClick={() => setGiftTab('bride')} className={`pb-1 px-2 border-b-2 font-sans font-bold uppercase tracking-widest text-[10px] ${giftTab === 'bride' ? 'border-[#4a5a40] text-[#4a5a40]' : 'border-transparent text-[#b19556]'}`}>Mừng Cô Dâu</button>
              </div>
              
              <div className="w-48 h-48 bg-white p-2 border border-[#c5b182]/50 mb-6 flex items-center justify-center overflow-hidden rounded-xl shadow-inner">
                <img src={giftTab === 'groom' ? (groomQR || "/assets/wedding/wedding-1/QR.jpg") : (brideQR || "/assets/wedding/wedding-1/QR.jpg")} alt="QR Mừng Cưới" className="w-full h-full object-contain" />
              </div>
              
              <button 
                onClick={() => setShowQR(false)} 
                className="w-full py-3 bg-[#4a5a40] text-[#FFFFFF] font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-[#34412c] transition-colors"
              >
                Đóng
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Button */}
      {!compact && (
        <button
          onClick={toggleAudio}
          className="fixed bottom-6 left-6 z-50 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-[#c5b182]/50 hover:scale-110 transition-transform text-[#4a5a40]"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
        </button>
      )}


      {/* Footer */}
      <div className="w-full py-8 bg-[#1a1a1a] flex flex-col items-center justify-center text-center px-4 relative z-50">
        <p className="text-[#d6cfc5] text-[10px] uppercase tracking-widest font-sans font-semibold mb-2">Designed by</p>
        <a href="https://www.lovora.click/wedding" target="_blank" rel="noopener noreferrer" className="text-white text-lg font-bold tracking-wider hover:text-[#C5A880] transition-colors" style={{ fontFamily: 'var(--font-dancing)' }}>Lovora Wedding</a>
      </div>
    </div>
  );
}