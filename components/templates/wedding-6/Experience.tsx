"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, MapPin, Heart } from "lucide-react";
import { WeddingFooter } from "../WeddingFooter";

interface WeddingSixProps {
  compact?: boolean;
  isBuilderPreview?: boolean;
  autoPlay?: boolean;
  fullScreen?: boolean;
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
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

export function WeddingSixExperience({
  compact,
  isBuilderPreview,
  autoPlay,
  fullScreen,
  groomName,
  brideName,
  weddingDate,
  weddingTime,
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
}: WeddingSixProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [allowScroll, setAllowScroll] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpCount, setRsvpCount] = useState("Có");
  const [customCount, setCustomCount] = useState("");
  const [giftTab, setGiftTab] = useState<'groom'|'bride'>('groom');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (autoPlay || fullScreen) {
      const openTimer = setTimeout(() => {
        setIsOpened(true);
        setTimeout(() => setAllowScroll(true), 1500);
        if (audioRef.current && !compact) {
          audioRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }, 1500);
      return () => clearTimeout(openTimer);
    }
  }, [compact, autoPlay, fullScreen]);

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
      }, 3500); // Wait for door animation
      
      return () => {
        clearTimeout(timeoutId);
        if (reqId) cancelAnimationFrame(reqId);
      };
    }
  }, [autoPlay, isOpened]);

  const handleOpen = () => {
    setIsOpened(true);
    setTimeout(() => setAllowScroll(true), 1500);
    if (audioRef.current && !compact) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Date Parsing for Calendar
  const safeDate = weddingDate || '2026-12-14T09:30:00';
  let parsedDDate = new Date(safeDate);
  if (isNaN(parsedDDate.getTime())) {
    parsedDDate = new Date('2026-12-14T09:30:00');
  }
  const parsedEDate = new Date(customData?.engagementDate || engagementDate || '2026-12-12T09:00:00.000Z');
  const dMonth = parsedDDate.getMonth() + 1;
  const dDate = parsedDDate.getDate();
  const dYear = parsedDDate.getFullYear();
  const dDayOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][parsedDDate.getDay()];
  const dHours = parsedDDate.getHours().toString().padStart(2, '0');
  const dMinutes = parsedDDate.getMinutes().toString().padStart(2, '0');
  
  const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month - 1, 1).getDay();
  
  const daysInMonth = getDaysInMonth(dYear, dMonth);
  const firstDay = getFirstDayOfMonth(dYear, dMonth);
  
  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  return (
    <div ref={containerRef} className={`relative w-full h-full bg-[#FAFAFA] text-[#2C2C2C] scroll-smooth ${allowScroll ? "overflow-y-auto overflow-x-hidden no-scrollbar" : "overflow-hidden"} ${compact ? "rounded-3xl" : ""}`}>
      
      {/* Background Music */}
      {!compact && musicUrl && <audio ref={audioRef} src={musicUrl} loop />}

      {/* MAIN CONTENT (Only visible when opened) */}
      <div className={`relative z-10 w-full flex flex-col items-center transition-opacity duration-1000 ${allowScroll ? "opacity-100" : "opacity-0"}`}>
        
        <div className="w-full max-w-sm mx-auto flex flex-col items-center pt-16 px-6 md:px-12 pb-16">
          
          {/* Header */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="flex flex-col items-center w-full mb-10 text-center">
            <h2 className="text-[40px] sm:text-5xl text-[#2C2C2C] mb-4" style={{ fontFamily: 'var(--font-dancing)' }}>Save the Date</h2>
            <div className="text-2xl sm:text-3xl text-[#555] whitespace-nowrap" style={{ fontFamily: 'var(--font-dancing)' }}>
              <span className="flex flex-col items-center gap-1 sm:gap-2"><span>{groomName}</span> <span className="text-[#e8c0c4] mx-2 text-xl">&amp;</span> <span>{brideName}</span></span>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="relative w-full aspect-[3/4] mb-12 bg-white p-2 sm:p-3 shadow-sm border border-[#f0f0f0]">
            <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
          </motion.div>

          {/* Elegant Date */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="flex items-center justify-center gap-6 mb-12 relative w-full px-4">
            <div className="flex flex-col items-end text-right">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#888] mb-1 font-medium">{dDayOfWeek}</span>
              <span className="text-xs sm:text-sm font-serif uppercase tracking-[0.2em] text-[#444]">Tháng {String(dMonth).padStart(2, '0')}</span>
            </div>
            <div className="text-6xl sm:text-7xl font-serif text-[#2C2C2C] font-light leading-none">{String(dDate).padStart(2, '0')}</div>
            <div className="flex flex-col items-start text-left">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#888] mb-1 font-medium">Năm</span>
              <span className="text-xs sm:text-sm font-serif tracking-[0.2em] text-[#444]">{dYear}</span>
            </div>
          </motion.div>

          <div className="w-12 h-[1px] bg-[#e8c0c4] mb-8"></div>

          <p className="text-[11px] sm:text-xs text-center italic text-[#888] font-serif leading-relaxed mb-16 px-6 max-w-xs">
            "Hạnh phúc không phải là điểm đến, mà là hành trình chúng ta đang đi cùng nhau."
          </p>

          {/* Groom & Bride Info */}
          <div className="w-full flex flex-col gap-12 mb-20 relative px-2">
             {/* Groom */}
             <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="flex gap-5 items-center bg-white p-3 shadow-sm border border-[#f5f5f5]">
               <div className="w-1/2 aspect-[3/4] overflow-hidden">
                 <img src={gallery[6] || "/assets/wedding/wedding-6/chure.jpg"} alt="Groom" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
               </div>
               <div className="w-1/2 flex flex-col items-center text-center px-1">
                 <h3 className="text-2xl text-[#2C2C2C] mb-2" style={{ fontFamily: 'var(--font-dancing)' }}>{groomName}</h3>
                 <p className="text-[9px] uppercase tracking-[0.2em] text-[#a4656c] font-bold mb-4">Chú Rể</p>
                 <p className="text-[8px] uppercase tracking-widest text-[#999] mb-1 border-b border-[#eee] pb-1 w-2/3">Nhà Trai</p>
                 <p className="text-2xl sm:text-3xl whitespace-pre-line leading-relaxed font-normal  font-medium text-[#555] leading-relaxed mt-2" style={{ fontFamily: 'var(--font-dancing)' }}>{(groomFamily || "Ông Phạm Văn Long\nBà Lê Thị Mai").replace(/ & /g, '\n').replace(/\\n/g, '\n')}</p>
               </div>
             </motion.div>
             
             {/* Bride */}
             <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="flex gap-5 items-center flex-row-reverse bg-white p-3 shadow-sm border border-[#f5f5f5]">
               <div className="w-1/2 aspect-[3/4] overflow-hidden">
                 <img src={gallery[7] || "/assets/wedding/wedding-6/codau.jpg"} alt="Bride" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
               </div>
               <div className="w-1/2 flex flex-col items-center text-center px-1">
                 <h3 className="text-2xl text-[#2C2C2C] mb-2" style={{ fontFamily: 'var(--font-dancing)' }}>{brideName}</h3>
                 <p className="text-[9px] uppercase tracking-[0.2em] text-[#a4656c] font-bold mb-4">Cô Dâu</p>
                 <p className="text-[8px] uppercase tracking-widest text-[#999] mb-1 border-b border-[#eee] pb-1 w-2/3">Nhà Gái</p>
                 <p className="text-2xl sm:text-3xl whitespace-pre-line leading-relaxed font-normal  font-medium text-[#555] leading-relaxed mt-2" style={{ fontFamily: 'var(--font-dancing)' }}>{(brideFamily || "Ông Nguyễn Văn Hùng\nBà Trần Thị Hoa").replace(/ & /g, '\n').replace(/\\n/g, '\n')}</p>
               </div>
             </motion.div>
          </div>

          {/* Photo Grid */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="w-full mb-20 flex flex-col items-center">
            <h3 className="text-4xl text-[#2C2C2C] mb-1" style={{ fontFamily: 'var(--font-dancing)' }}>Photo Album</h3>
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#999] mb-8 font-medium">Lưu giữ khoảnh khắc</p>
            <div className="grid grid-cols-3 gap-2 w-full">
              {gallery.slice(3, 6).map((img, i) => (
                <div key={i} className="aspect-[3/4] overflow-hidden border border-[#eee]">
                  <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Calendar Section */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="w-full flex flex-col items-center mb-16 px-4">
            <h3 className="text-[11px] font-bold text-[#555] mb-6 uppercase tracking-[0.3em]">Tháng {String(dMonth).padStart(2, '0')} Năm {dYear}</h3>
            <div className="grid grid-cols-7 gap-y-4 gap-x-2 w-full max-w-[280px] text-center text-[10px] sm:text-xs">
              {['CN','T2','T3','T4','T5','T6','T7'].map((day, i) => (
                <div key={day} className={`font-bold ${i===0 ? 'text-[#e58a93]' : 'text-[#888]'}`}>{day}</div>
              ))}
              {blanks.map(b => <div key={`blank-${b}`} />)}
              {monthDays.map(day => {
                const isWedding = day === dDate && parsedDDate.getMonth() + 1 === dMonth && parsedDDate.getFullYear() === dYear;
                return (
                  <div key={day} className={`relative flex items-center justify-center font-medium ${isWedding ? 'text-[#e58a93] font-bold' : 'text-[#444]'}`}>
                    <span className="relative z-10">{day}</span>
                    {isWedding && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5, type: "spring" }} className="absolute inset-0 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-[#f5d0d4] fill-[#f5d0d4]/30" strokeWidth={1.5} />
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-[9px] font-sans font-bold uppercase tracking-widest text-[#e58a93]">
                <Heart className="w-3 h-3 text-[#f5d0d4] fill-[#f5d0d4]" /> Lễ Cưới
              </div>
            </div>
          </motion.div>

          {/* Event Details */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="border border-[#e8c0c4]/40 pt-10 pb-8 px-6 flex flex-col items-center text-center w-full mb-16 bg-[#fffcfc] shadow-sm relative">
            <h3 className="text-3xl text-[#2C2C2C] mb-2" style={{ fontFamily: 'var(--font-dancing)' }}>Lễ Cưới</h3>
            <p className="text-[9px] uppercase tracking-widest text-[#999] mb-8 font-bold">Sự hiện diện của bạn là niềm vinh hạnh</p>
            
            <p className="text-[10px] font-bold text-[#a4656c] uppercase tracking-widest mb-3">Thời gian</p>
            <p className="text-3xl font-serif text-[#2C2C2C] mb-1">{dHours}:{dMinutes}</p>
            <p className="text-[11px] text-[#666] uppercase tracking-widest mb-6 font-medium">{dDayOfWeek}, {String(dDate).padStart(2, '0')}/{String(dMonth).padStart(2, '0')}/{dYear}</p>
            
            <div className="w-8 h-[1px] bg-[#e8c0c4] mb-6"></div>
            
            <p className="text-[10px] font-bold text-[#a4656c] uppercase tracking-widest mb-3">Địa điểm</p>
            <p className="text-[13px] font-semibold text-[#333] uppercase leading-relaxed mb-2 max-w-[200px]">
              Tại Tư Gia
            </p>
            <p className="text-[11px] text-[#666] leading-relaxed mb-4 max-w-[220px]">
              {eventAddress}
            </p>
            {mapUrl && (
              <a href={mapUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 border border-[#e8c0c4] text-[#a4656c] bg-white w-full py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#fffcfc] transition-colors shadow-sm mb-4">
                Xem Bản Đồ
              </a>
            )}
            
            {hasTiecMung && (
              <div className="w-full flex flex-col items-center mt-12 pt-10 border-t border-[#e8c0c4]/40 px-6">
                <h3 className="text-3xl text-[#2C2C2C] mb-2 uppercase" style={{ fontFamily: 'var(--font-dancing)' }}>TIỆC MỪNG LỄ THÀNH HÔN {hasTiecMungGai ? "(NHÀ TRAI)" : ""}</h3>
                <p className="text-[10px] font-bold text-[#a4656c] uppercase tracking-widest mb-3 mt-4">Thời gian</p>
                <p className="text-3xl font-serif text-[#2C2C2C] mb-1">{tiecTrai.time}</p>
                <p className="text-[11px] text-[#666] uppercase tracking-widest mb-6 font-medium">{tiecTrai.date}</p>
                
                <div className="w-8 h-[1px] bg-[#e8c0c4] mb-6"></div>
                
                <p className="text-[10px] font-bold text-[#a4656c] uppercase tracking-widest mb-3">Địa điểm</p>
                <p className="text-[11px] text-[#666] leading-relaxed mb-8 max-w-[220px]">
                <strong>{customData?.tiecName}</strong><br/>
                {customData?.tiecAddress}
              </p>
                
                {customData?.tiecMapUrl && (
                  <a href={customData.tiecMapUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 border border-[#e8c0c4] text-[#a4656c] bg-white w-full py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#fffcfc] transition-colors shadow-sm">
                    <MapPin size={14} />
                    Chỉ đường
                  </a>
                )}
              </div>
            )}
            
            {hasTiecMungGai && (
              <div className="w-full flex flex-col items-center mt-12 pt-10 border-t border-[#e8c0c4]/40 px-6">
                <h3 className="text-3xl text-[#2C2C2C] mb-2 uppercase" style={{ fontFamily: 'var(--font-dancing)' }}>TIỆC MỪNG LỄ THÀNH HÔN (NHÀ GÁI)</h3>
                <p className="text-[10px] font-bold text-[#a4656c] uppercase tracking-widest mb-3 mt-4">Thời gian</p>
                <p className="text-3xl font-serif text-[#2C2C2C] mb-1">{tiecGai.time}</p>
                <p className="text-[11px] text-[#666] uppercase tracking-widest mb-6 font-medium">{tiecGai.date}</p>
                
                <div className="w-8 h-[1px] bg-[#e8c0c4] mb-6"></div>
                
                <p className="text-[10px] font-bold text-[#a4656c] uppercase tracking-widest mb-3">Địa điểm</p>
                <p className="text-[11px] text-[#666] leading-relaxed mb-8 max-w-[220px]">
                <strong>{customData?.tiecNameGai}</strong><br/>
                {customData?.tiecAddressGai}
              </p>
                
                {customData?.tiecMapUrlGai && (
                  <a href={customData.tiecMapUrlGai} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 border border-[#e8c0c4] text-[#a4656c] bg-white w-full py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#fffcfc] transition-colors shadow-sm">
                    <MapPin size={14} />
                    Chỉ đường
                  </a>
                )}
              </div>
            )}
            
          </motion.div>

          {/* Map Iframe */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="w-full mb-16 bg-white p-2 shadow-sm">
            <div className="w-full h-48 bg-gray-100 overflow-hidden">
              <iframe 
                src={`https://maps.google.com/maps?q=${encodeURIComponent(eventAddress || 'Hanoi, Vietnam')}&t=&z=15&ie=UTF8&iwloc=&output=embed`} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
              ></iframe>
            </div>
          </motion.div>

          {/* Full Gallery Masonry */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="w-full mb-16">
            <div className="columns-2 gap-2 w-full space-y-2">
              {gallery.map((img, index) => (
                <div key={index} className="relative w-full overflow-hidden inline-block bg-white p-1 shadow-sm">
                  <img src={img} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" alt={`Gallery ${index}`} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* RSVP Form */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="w-full flex flex-col items-center mb-20 px-6">
            <div className="w-full bg-[#fdfdfd] p-8 shadow-sm border border-[#eee] flex flex-col gap-5 relative">
              <div className="flex flex-col items-center text-center mb-2">
                <h3 className="text-3xl text-[#2C2C2C] mb-1" style={{ fontFamily: 'var(--font-dancing)' }}>Tham Dự</h3>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#999] font-bold">Phản hồi trước ngày {String(dDate).padStart(2, '0')}/{String(dMonth).padStart(2, '0')}</p>
              </div>
              
              <input type="text" value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="Tên của bạn" className="w-full bg-[#fafafa] text-[#333] text-xs px-4 py-3 border border-[#eaeaea] outline-none focus:border-[#e8c0c4] transition-colors" />
              <select value={rsvpCount} onChange={e => setRsvpCount(e.target.value)} className="w-full bg-[#fafafa] text-[#333] text-xs px-4 py-3 border border-[#eaeaea] outline-none focus:border-[#e8c0c4] transition-colors appearance-none">
                <option value="Có">Có tham dự</option>
                <option value="Không">Không tham dự</option>
                <option value="Khác">Có, dắt theo người thân</option>
              </select>
              {rsvpCount === "Khác" && (
                <input type="number" min="1" value={customCount} onChange={e => setCustomCount(e.target.value)} placeholder="Nhập tổng số người..." className="w-full bg-[#fafafa] text-[#333] text-xs px-4 py-3 border border-[#eaeaea] outline-none focus:border-[#e8c0c4] transition-colors mt-4" required />
              )}
              
              <div className="flex gap-2 w-full mt-2">
                <button 
                  onClick={() => !compact && onComplete?.({ name: rsvpName, phone: rsvpPhone, count: rsvpCount === "Khác" ? customCount : rsvpCount })}
                  className="flex-1 bg-[#2C2C2C] text-[#fff] text-[10px] font-bold uppercase tracking-widest py-3 hover:bg-[#1a1a1a] transition-colors shadow-sm"
                >
                  Gửi Lời Nhắn
                </button>
                <button 
                  onClick={() => setShowQR(true)}
                  className="flex-[0.8] bg-transparent border border-[#2C2C2C] text-[#2C2C2C] text-[10px] font-bold uppercase tracking-widest py-3 hover:bg-[#fafafa] transition-colors shadow-sm"
                >
                  Mừng Cưới
                </button>
              </div>
            </div>
          </motion.div>
          
        </div>

        {/* Footer Full Image */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative w-full aspect-[4/5] flex flex-col items-center justify-end pb-12 overflow-hidden">
          <img src={heroImage} alt="Thank You" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-5xl text-[#1a1a1a] mb-4" style={{ fontFamily: 'var(--font-dancing)' }}>Thank You</h2>
            <div className="w-12 h-[1px] bg-[#1a1a1a] mb-4"></div>
            <p className="text-[10px] text-[#1a1a1a] uppercase tracking-widest font-bold"><span className="flex flex-col items-center gap-1 sm:gap-2"><span>{groomName}</span> <span className="text-sm font-sans mx-2 opacity-80">&amp;</span> <span>{brideName}</span></span></p>
          </div>
        </motion.div>

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
              className="bg-[#FAFAFA] p-8 flex flex-col items-center max-w-sm w-full border border-[#eee] rounded-xl shadow-xl" 
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-3xl text-[#2C2C2C] mb-4" style={{ fontFamily: 'var(--font-dancing)' }}>Mừng Cưới</h3>
              
              <div className="flex justify-center gap-4 mb-4">
                <button onClick={() => setGiftTab('groom')} className={`pb-1 px-2 border-b-2 font-sans font-bold uppercase tracking-widest text-[10px] ${giftTab === 'groom' ? 'border-[#2C2C2C] text-[#2C2C2C]' : 'border-transparent text-[#999]'}`}>Mừng Chú Rể</button>
                <button onClick={() => setGiftTab('bride')} className={`pb-1 px-2 border-b-2 font-sans font-bold uppercase tracking-widest text-[10px] ${giftTab === 'bride' ? 'border-[#2C2C2C] text-[#2C2C2C]' : 'border-transparent text-[#999]'}`}>Mừng Cô Dâu</button>
              </div>
              
              <div className="w-48 h-48 bg-white p-2 border border-[#eee] mb-6 flex items-center justify-center overflow-hidden rounded-xl shadow-inner">
                <img src={giftTab === 'groom' ? (groomQR || "/assets/wedding/wedding-1/QR.jpg") : (brideQR || "/assets/wedding/wedding-1/QR.jpg")} alt="QR Mừng Cưới" className="w-full h-full object-contain" />
              </div>
              
              <button 
                onClick={() => setShowQR(false)} 
                className="w-full py-3 bg-[#2C2C2C] text-[#FFFFFF] font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#1a1a1a] transition-colors"
              >
                Đóng
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opening Doors Animation */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div 
            exit={{ opacity: 0 }} 
            transition={{ duration: 3.5 }}
            className="absolute inset-0 z-50 overflow-hidden cursor-pointer flex" 
            onClick={handleOpen}
          >
             {/* Left Door */}
             <motion.div 
               initial={{ x: 0 }}
               exit={{ x: "-200%" }}
               transition={{ duration: 3.5, ease: [0.4, 0, 0.2, 1] }}
               className="w-1/2 h-full relative z-30 flex items-center justify-start border-r border-[#eee] bg-[#FAFAFA]"
             >
               <img src="/assets/wedding/wedding-6/side.webp" alt="Door Left" className="absolute top-0 left-0 h-[100vh] w-[200%] sm:w-[150%] max-w-none object-cover object-left pointer-events-none opacity-90" />
               <div className="absolute inset-0 flex items-center justify-end pr-4">
                  <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-[#e8c0c4] to-transparent opacity-50"></div>
               </div>
             </motion.div>
             
             {/* Right Door */}
             <motion.div 
               initial={{ x: 0 }}
               exit={{ x: "200%" }}
               transition={{ duration: 3.5, ease: [0.4, 0, 0.2, 1] }}
               className="w-1/2 h-full relative z-20 flex items-center justify-end border-l border-[#eee] bg-[#FAFAFA]"
             >
               <img src="/assets/wedding/wedding-6/side.webp" alt="Door Right" className="absolute top-0 right-0 h-[100vh] w-[200%] sm:w-[150%] max-w-none object-cover object-left pointer-events-none scale-x-[-1] opacity-90" />
               <div className="absolute inset-0 flex items-center justify-start pl-4">
                  <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-[#e8c0c4] to-transparent opacity-50"></div>
               </div>
             </motion.div>
             
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Button */}
      {isOpened && !compact && (
        <button
          onClick={toggleAudio}
          className="fixed bottom-6 left-6 z-50 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-[#eee] hover:scale-110 transition-transform text-[#666]"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-1" />}
        </button>
      )}


      <WeddingFooter />
    </div>
  );
}