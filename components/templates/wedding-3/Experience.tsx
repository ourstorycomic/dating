"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { WeddingFooter } from "../WeddingFooter";

interface WeddingThreeProps {
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

export function WeddingThreeExperience({
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
}: WeddingThreeProps) {
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
    if (autoPlay) {
      const openTimer = setTimeout(() => {
        setIsOpened(true);
        setTimeout(() => setAllowScroll(true), 1500);
      }, 500);
      return () => clearTimeout(openTimer);
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
      }, 1500); // Wait for door animation
      
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

  // Date Parsing
  const safeDate = weddingDate || '2026-12-14';
  let parsedDDate = new Date(safeDate);
  if (isNaN(parsedDDate.getTime())) {
    parsedDDate = new Date('2026-12-14');
  }
  const safeEDate = engagementDate || '2026-12-12';
  let parsedEDate = new Date(safeEDate);
  if (isNaN(parsedEDate.getTime())) {
    parsedEDate = new Date('2026-12-12');
  }
  
  const dDay = String(parsedDDate.getDate()).padStart(2, '0');
  const dMonthNumber = parsedDDate.getMonth() + 1;
  const dMonth = 'Tháng ' + dMonthNumber;
  const dYear = parsedDDate.getFullYear().toString();
  const dDayOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][parsedDDate.getDay()];
  const dHours = parsedDDate.getHours().toString().padStart(2, '0');
  const dMinutes = parsedDDate.getMinutes().toString().padStart(2, '0');
  const dTime = `${dHours}:${dMinutes}`;

  const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month - 1, 1).getDay();
  
  const daysInMonth = getDaysInMonth(Number(dYear), dMonthNumber);
  const firstDay = getFirstDayOfMonth(Number(dYear), dMonthNumber);
  
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div ref={containerRef} className={`relative w-full h-full bg-[#FFFFFF] text-[#2D2A28] scroll-smooth ${allowScroll ? "overflow-y-auto overflow-x-hidden no-scrollbar" : "overflow-hidden"} ${compact ? "rounded-3xl" : ""}`}>
      
      {/* Background Music */}
      {!compact && <audio ref={audioRef} src={musicUrl} loop />}

      {/* MAIN CONTENT (Only visible when opened) */}
      <div className={`relative z-10 w-full flex flex-col items-center transition-opacity duration-1000 ${allowScroll ? "opacity-100" : "opacity-0"}`}>
        
        <div className="w-full max-w-sm mx-auto flex flex-col items-center pt-16 px-6 md:px-12 pb-16">
          
          {/* Top Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="flex flex-col items-center w-full">
            <p className="text-[10px] tracking-[0.3em] text-[#7A9DBA] uppercase mb-4 font-serif font-bold">Happy Marriage</p>
            <h1 className="text-[26px] sm:text-3xl md:text-4xl text-[#2D2A28] mb-6 font-bold text-center px-2 leading-tight whitespace-nowrap" style={{ fontFamily: 'var(--font-dancing)' }}>
              <span className="flex flex-col items-center gap-1 sm:gap-2"><span>{groomName}</span> <span className="text-sm font-sans mx-2 opacity-80">&amp;</span> <span>{brideName}</span></span>
            </h1>
          </motion.div>
          
          {/* Hero Image */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="w-full aspect-[3/4] rounded-sm overflow-hidden mb-8 shadow-md">
            <img src={heroImage} alt="Wedding Couple" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="flex flex-col items-center mb-10 w-full">
            <h2 className="text-sm font-serif tracking-[0.3em] text-[#2D2A28] mb-6 uppercase text-center w-full">Let's Celebrate</h2>
            <div className="w-full flex justify-center mb-8">
              <div className="flex gap-2 text-[#C5A880]">
                <div className="w-1 h-1 rounded-full bg-[#C5A880]"></div>
                <div className="w-1 h-1 rounded-full bg-[#C5A880]"></div>
                <div className="w-1 h-1 rounded-full bg-[#C5A880]"></div>
              </div>
            </div>

            <div className="flex justify-between items-center w-full px-4 gap-4 mb-8">
              <div className="flex flex-col flex-1 text-left">
                <p className="text-xs font-serif font-bold text-[#2D2A28] mb-2 uppercase">Thiệp Mời Cưới</p>
                <div className="flex flex-col gap-1 mb-4">
                  <p className="text-[9px] uppercase tracking-widest text-[#7A1F1F]">Nhà Trai</p>
                  <p className="text-2xl sm:text-3xl whitespace-pre-line leading-relaxed font-normal  text-[#2D2A28] whitespace-pre-line" style={{ fontFamily: 'var(--font-dancing)' }}>{groomFamily || "Ông Phạm Văn Long\nBà Lê Thị Mai"}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[9px] uppercase tracking-widest text-[#7A1F1F]">Nhà Gái</p>
                  <p className="text-2xl sm:text-3xl whitespace-pre-line leading-relaxed font-normal  text-[#2D2A28] whitespace-pre-line" style={{ fontFamily: 'var(--font-dancing)' }}>{brideFamily || "Ông Nguyễn Văn Hùng\nBà Trần Thị Hoa"}</p>
                </div>
              </div>
              <div className="w-16 h-40 bg-[#7A1F1F] rounded-t-md rounded-b-md flex flex-col items-center justify-between py-4 shadow-lg shrink-0 relative overflow-hidden">
                <img src="/assets/wedding/wedding-3/ring.webp" alt="Ring" className="w-10 h-10 object-contain z-10" />
                <img src="/assets/wedding/wedding-3/textthiep.webp" alt="Thiệp Mời" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] z-10" />
              </div>
            </div>

            <p className="text-[11px] text-[#7A9DBA] uppercase tracking-[0.1em] mb-4 text-center">Lời Mời Trân Trọng Từ Gia Đình Chúng Tôi</p>
          </motion.div>

          {/* Second Names */}
          <motion.h2 initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="text-[26px] sm:text-[28px] md:text-3xl text-[#2D2A28] mb-12 text-center px-2 leading-tight whitespace-nowrap" style={{ fontFamily: 'var(--font-dancing)' }}>
            <span className="flex flex-col items-center gap-1 sm:gap-2"><span>{groomName}</span> <span className="font-sans text-sm mx-1">&amp;</span> <span>{brideName}</span></span>
          </motion.h2>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="w-full mb-12">
            <img src={gallery[0] || heroImage} alt="Couple" className="w-full h-auto object-cover rounded-sm" />
            <div className="w-full bg-gradient-to-t from-white via-white/80 to-transparent -mt-16 pt-20 pb-4 relative z-10 flex justify-center">
              <h3 className="text-sm font-serif tracking-[0.2em] text-[#2D2A28] uppercase">Happy Wedding!</h3>
            </div>
          </motion.div>


          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="flex flex-col items-center mb-12 text-center w-full px-4">
            <h3 className="text-xs font-serif font-bold text-[#2D2A28] uppercase mb-4 tracking-[0.2em]">Lời Mời Đến</h3>
            <p className="text-[10px] text-[#2D2A28] uppercase font-bold tracking-widest mb-1">{dDayOfWeek} | {dTime}</p>
            <p className="text-sm font-serif text-[#7A1F1F] mb-4 tracking-[0.2em]">{dDay} . {dMonthNumber} . {dYear}</p>
            <p className="text-[9px] text-[#2D2A28] leading-relaxed max-w-[280px]">Sự hiện diện của quý vị là niềm vinh hạnh<br/>cho gia đình chúng tôi</p>
          </motion.div>

          {/* Calendar */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="w-full max-w-[280px] mb-12 px-2">
            <h3 className="text-center font-serif text-sm tracking-widest text-[#2D2A28] uppercase mb-6">{dMonth} . {dYear}</h3>
            <div className="grid grid-cols-7 gap-y-4 text-center text-xs mb-4">
              <span className="text-[#7A1F1F] font-bold">SU</span>
              <span className="font-bold text-[#2D2A28]">MO</span>
              <span className="font-bold text-[#2D2A28]">TU</span>
              <span className="font-bold text-[#2D2A28]">WE</span>
              <span className="font-bold text-[#2D2A28]">TH</span>
              <span className="font-bold text-[#2D2A28]">FR</span>
              <span className="font-bold text-[#2D2A28]">SA</span>
              
              {/* Empties for offset */}
              {[...Array(new Date(Number(dYear), dMonthNumber - 1, 1).getDay())].map((_, i) => (
                <span key={`empty-${i}`}></span>
              ))}
              
              {/* Days */}
              {monthDays.map(day => {
                const isWedding = day === Number(dDay) && parsedDDate.getMonth() + 1 === dMonthNumber && parsedDDate.getFullYear() === Number(dYear);
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
                    <span className={`relative z-10 ${isWedding ? "text-white font-bold text-[11px]" : isTiec ? "text-[#7A1F1F] font-bold" : "text-[#2D2A28]"}`}>{day}</span>
                    {isTiec && isWedding && (
                      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, type: "spring" }} className="absolute inset-0 w-[140%] h-[140%] -left-[20%] -top-[20%] rounded-full border-[1.5px] border-dashed border-[#7A1F1F] z-0 opacity-70"></motion.div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-[9px] font-sans font-bold uppercase tracking-widest text-[#7A1F1F]">
                <svg className="w-4 h-4 text-[#7A1F1F]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> Lễ Cưới
              </div>
              {(hasTiecMung || hasTiecMungGai) && (
                <div className="flex items-center gap-2 text-[9px] font-sans font-bold uppercase tracking-widest text-[#7A1F1F]">
                  <div className="w-3.5 h-3.5 rounded-full border-[1.5px] border-dashed border-[#7A1F1F] bg-[#7A1F1F]/5"></div> Tiệc Mừng
                </div>
              )}
            </div>
            <div className="w-full h-px bg-[#C5A880]/30 mt-4"></div>
          </motion.div>

          {/* Address Box */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="text-center mb-8 px-4 w-full">
            <h3 className="text-xs font-bold text-[#2D2A28] uppercase mb-2">Địa điểm tổ chức Lễ thành hôn</h3>
            <p className="text-[10px] text-[#2D2A28] leading-relaxed font-bold uppercase">Tại Tư Gia</p>
            <p className="text-[10px] text-[#2D2A28] leading-relaxed mb-4">{eventAddress}</p>
            {mapUrl && (
              <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-block bg-[#7A1F1F] text-white text-[10px] uppercase font-bold tracking-widest px-5 py-2 rounded-sm shadow-md hover:bg-opacity-80">
                Xem Bản Đồ
              </a>
            )}
          </motion.div>
          
          {hasTiecMung && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="border border-dashed border-[#7A1F1F] rounded-lg p-6 flex flex-col items-center text-center w-full mb-12 bg-white/50">
              <h3 className="text-xs font-bold text-[#7A1F1F] uppercase tracking-widest mb-4">TIỆC MỪNG LỄ THÀNH HÔN {hasTiecMungGai ? "(NHÀ TRAI)" : ""}</h3>
              <p className="text-[10px] text-[#2D2A28] leading-relaxed mb-2 uppercase max-w-[200px] font-bold">
                Vào lúc {tiecTrai.time} | {tiecTrai.date}
              </p>
              <p className="text-[10px] text-[#2D2A28] leading-relaxed mb-6 uppercase max-w-[200px] font-bold">
                <span className="block font-bold mb-1">{customData?.tiecName}</span>
                {customData?.tiecAddress}
              </p>
              {customData?.tiecMapUrl && (
                <a href={customData.tiecMapUrl} target="_blank" rel="noreferrer" className="bg-[#7A1F1F]  text-[10px] px-8 py-3 rounded-sm uppercase tracking-widest font-bold shadow-md hover:bg-opacity-80 text-white">
                  Xem Chỉ Đường
                </a>
              )}
            </motion.div>
          )}

          {hasTiecMungGai && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="border border-dashed border-[#7A1F1F] rounded-lg p-6 flex flex-col items-center text-center w-full mb-12 bg-white/50">
              <h3 className="text-xs font-bold text-[#7A1F1F] uppercase tracking-widest mb-4">TIỆC MỪNG LỄ THÀNH HÔN (NHÀ GÁI)</h3>
              <p className="text-[10px] text-[#2D2A28] leading-relaxed mb-2 uppercase max-w-[200px] font-bold">
                Vào lúc {tiecGai.time} | {tiecGai.date}
              </p>
              <p className="text-[10px] text-[#2D2A28] leading-relaxed mb-6 uppercase max-w-[200px] font-bold">
                <span className="block font-bold mb-1">{customData?.tiecNameGai}</span>
                {customData?.tiecAddressGai}
              </p>
              {customData?.tiecMapUrlGai && (
                <a href={customData.tiecMapUrlGai} target="_blank" rel="noreferrer" className="bg-[#7A1F1F]  text-[10px] px-8 py-3 rounded-sm uppercase tracking-widest font-bold shadow-md hover:bg-opacity-80 text-white">
                  Xem Chỉ Đường
                </a>
              )}
            </motion.div>
          )}

          {/* RSVP Form */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="w-full bg-[#7A1F1F] p-8 mb-12 flex flex-col items-center">
            <h2 className="text-[10px] uppercase tracking-widest text-[#FFFFFF] mb-2 text-center font-bold">Xác Nhận Tham Dự</h2>
            <h2 className="text-[10px] uppercase tracking-widest text-[#FFFFFF] mb-6 text-center font-bold">Gửi Lời Chúc</h2>
            <div className="w-full max-w-[280px] flex flex-col gap-3">
              <input type="text" value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="Tên Của Bạn..." className="w-full bg-[#FFFFFF] text-[#2D2A28] text-xs px-4 py-3 rounded-sm outline-none" />
              <input type="text" value={rsvpPhone} onChange={e => setRsvpPhone(e.target.value)} placeholder="Số Điện Thoại..." className="w-full bg-[#FFFFFF] text-[#2D2A28] text-xs px-4 py-3 rounded-sm outline-none" />
              <select value={rsvpCount} onChange={e => setRsvpCount(e.target.value)} className="w-full bg-[#FFFFFF] text-[#2D2A28] text-xs px-4 py-3 rounded-sm outline-none appearance-none appearance-none">
                <option value="Có">Có tham dự</option>
                <option value="Không">Không tham dự</option>
                <option value="Khác">Có, dắt theo người thân</option>
              </select>
              {rsvpCount === "Khác" && (
                <input type="number" min="1" value={customCount} onChange={e => setCustomCount(e.target.value)} placeholder="Nhập tổng số người..." className="w-full bg-[#FFFFFF] text-[#2D2A28] text-xs px-4 py-3 rounded-sm outline-none appearance-none mt-2" required />
              )}
              <textarea placeholder="Gửi Lời Chúc Tới..." rows={2} className="w-full bg-[#FFFFFF] text-[#2D2A28] text-xs px-4 py-3 rounded-sm outline-none resize-none"></textarea>
              <button 
                onClick={() => !compact && onComplete?.({ name: rsvpName, phone: rsvpPhone, count: rsvpCount === "Khác" ? customCount : rsvpCount })}
                className="w-full bg-[#FFFFFF] text-[#7A1F1F] text-[10px] font-bold uppercase tracking-widest py-3 rounded-sm mt-2 shadow-md hover:bg-stone-100"
              >
                Gửi Xác Nhận
              </button>
            </div>
            <button onClick={() => setShowQR(true)} className="bg-[#FFFFFF] text-[#7A1F1F] text-[10px] uppercase font-bold tracking-widest px-8 py-3 rounded-full shadow-md mt-6 hover:bg-stone-100 transition-colors">
              Mừng Cưới (QR)
            </button>
          </motion.div>

          {/* Gallery Grid */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="w-full flex flex-col items-center mb-16 px-4">
            <h3 className="text-[10px] font-serif font-bold text-[#7A9DBA] mb-8 uppercase tracking-[0.2em] italic">Để Đám Cưới Trở Nên Đẹp Hơn</h3>
            
            <div className="grid grid-cols-2 gap-2 w-full">
              {gallery.map((img, idx) => {
                const isFull = idx === 0 || idx === gallery.length - 1 || (gallery.length % 2 !== 0 && idx === 1);
                return (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: (idx % 2) * 0.2 }} key={idx} className={`relative overflow-hidden ${isFull ? (idx === gallery.length - 1 ? 'col-span-2 aspect-[3/4]' : 'col-span-2 aspect-[4/3]') : 'aspect-square'}`}>
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          
        </div>

        {/* Footer Thank You */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative w-full aspect-[3/4] flex flex-col items-center justify-end pb-8 overflow-hidden rounded-b-3xl">
          <img src={gallery[gallery.length - 1] || heroImage} alt="Thank You" className="absolute inset-0 w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
          <div className="relative z-10 flex flex-col items-center">
            <p className="text-[10px] text-[#2D2A28] uppercase tracking-[0.1em] mb-4 font-bold">Để lễ cưới thêm rực rỡ hơn</p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} className="text-6xl text-[#7A1F1F] mb-8" style={{ fontFamily: 'var(--font-dancing)' }}>Thank You</motion.h2>
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
            className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center p-6" 
            onClick={() => setShowQR(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#FFFDF9] p-8 rounded-3xl flex flex-col items-center max-w-sm w-full shadow-2xl border-2 border-[#C5A880]/30" 
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-3xl text-[#7A1F1F] mb-4" style={{ fontFamily: 'var(--font-dancing)' }}>Mừng Cưới</h3>
              
              <div className="flex justify-center gap-4 mb-4">
                <button onClick={() => setGiftTab('groom')} className={`pb-1 px-2 border-b-2 font-sans font-bold uppercase tracking-widest text-[10px] ${giftTab === 'groom' ? 'border-[#7A1F1F] text-[#7A1F1F]' : 'border-transparent text-[#A67C52]'}`}>Mừng Chú Rể</button>
                <button onClick={() => setGiftTab('bride')} className={`pb-1 px-2 border-b-2 font-sans font-bold uppercase tracking-widest text-[10px] ${giftTab === 'bride' ? 'border-[#7A1F1F] text-[#7A1F1F]' : 'border-transparent text-[#A67C52]'}`}>Mừng Cô Dâu</button>
              </div>
              
              <div className="w-48 h-48 bg-white p-2 border-2 border-[#C5A880]/50 rounded-xl mb-6 shadow-inner flex items-center justify-center overflow-hidden">
                <img src={giftTab === 'groom' ? (groomQR || "/assets/wedding/wedding-1/QR.jpg") : (brideQR || "/assets/wedding/wedding-1/QR.jpg")} alt="QR Mừng Cưới" className="w-full h-full object-contain" />
              </div>
              
              <button 
                onClick={() => setShowQR(false)} 
                className="w-full py-3 bg-[#7A1F1F] text-[#FFFFFF] font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#5a1515] transition-colors"
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
          <div className="absolute inset-0 z-50 overflow-hidden cursor-pointer flex" onClick={handleOpen}>
             {/* Left Door */}
             <motion.div 
               initial={{ x: 0 }}
               exit={{ x: "-200%" }}
               transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
               className="w-1/2 h-full relative z-30"
             >
               <img src="/assets/wedding/wedding-3/sidebentrai.webp" alt="Door Left" className="absolute top-0 left-0 h-full w-[200%] max-w-none object-cover object-left pointer-events-none" />
             </motion.div>
             {/* Right Door */}
             <motion.div 
               initial={{ x: 0 }}
               exit={{ x: "200%" }}
               transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
               className="w-1/2 h-full relative z-20"
             >
               <img src="/assets/wedding/wedding-3/sidebenphai.webp" alt="Door Right" className="absolute top-0 right-0 h-full w-[200%] max-w-none object-cover object-right pointer-events-none" />
             </motion.div>
             

          </div>
        )}
      </AnimatePresence>

      {/* Audio Button */}
      {isOpened && !compact && (
        <button
          onClick={toggleAudio}
          className="fixed bottom-6 left-6 z-50 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-[#C5A880]/30 hover:scale-110 transition-transform"
        >
          {isPlaying ? <Pause className="w-4 h-4 text-[#7A1F1F]" /> : <Play className="w-4 h-4 text-[#7A1F1F]" />}
        </button>
      )}


      <WeddingFooter />
    </div>
  );
}