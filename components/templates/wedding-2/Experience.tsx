"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";

interface WeddingTwoProps {
  compact?: boolean;
  isBuilderPreview?: boolean;
  autoPlay?: boolean;
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
}

export function WeddingTwoExperience({
  compact,
  isBuilderPreview,
  autoPlay,
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
}: WeddingTwoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [giftTab, setGiftTab] = useState<'groom'|'bride'>('groom');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoPlay) {
      const openTimer = setTimeout(() => {
        setIsOpened(true);
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
      }, 3500); // Wait for door animation
      
      return () => {
        clearTimeout(timeoutId);
        if (reqId) cancelAnimationFrame(reqId);
      };
    }
  }, [autoPlay, isOpened]);

  const handleOpen = () => {
    setIsOpened(true);
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
  const safeDate = weddingDate || '2025-12-14';
  let parsedDDate = new Date(safeDate);
  if (isNaN(parsedDDate.getTime())) {
    parsedDDate = new Date('2025-12-14');
  }
  const safeEDate = engagementDate || '2025-12-12';
  let parsedEDate = new Date(safeEDate);
  if (isNaN(parsedEDate.getTime())) parsedEDate = new Date('2025-12-12');
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

  return (
    <div ref={containerRef} className={`relative w-full h-full bg-[#FFFDF9] text-[#7A1F1F] scroll-smooth ${isOpened ? "overflow-y-auto overflow-x-hidden no-scrollbar" : "overflow-hidden"} ${compact ? "rounded-3xl" : ""}`}>
      
      {/* Background Borders */}
      <div 
        className="fixed inset-y-0 left-0 w-5 md:w-8 z-0 pointer-events-none opacity-80"
        style={{ backgroundImage: "url('/assets/wedding/wedding-2/vien2ben.webp')", backgroundSize: "200% auto", backgroundPosition: "left top", backgroundRepeat: "repeat-y" }}
      />
      <div 
        className="fixed inset-y-0 right-0 w-5 md:w-8 z-0 pointer-events-none scale-x-[-1] opacity-80"
        style={{ backgroundImage: "url('/assets/wedding/wedding-2/vien2ben.webp')", backgroundSize: "200% auto", backgroundPosition: "left top", backgroundRepeat: "repeat-y" }}
      />
      
      {/* Background Music */}
      {!compact && <audio ref={audioRef} src={musicUrl} loop />}

      {/* MAIN CONTENT (Only visible when opened) */}
      <div className={`relative z-10 w-full flex flex-col items-center transition-opacity duration-1000 ${isOpened ? "opacity-100" : "opacity-0"}`}>
        
        <div className="w-full max-w-sm mx-auto flex flex-col items-center pt-16 px-6 md:px-12 pb-16">
          
          {/* Top Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="flex flex-col items-center w-full">
            <p className="text-[10px] tracking-widest text-[#B58B5C] uppercase mb-4 font-sans font-semibold">Thiệp Mời</p>
            <h1 className="text-[26px] sm:text-3xl md:text-4xl text-[#7A1F1F] mb-6 font-bold text-center px-2 leading-tight whitespace-nowrap" style={{ fontFamily: 'var(--font-dancing)' }}>
              {groomName} & {brideName}
            </h1>
            <img src="/assets/wedding/wedding-2/logotrungthu.webp" alt="Double Happiness" className="w-16 h-16 object-contain mb-6 opacity-90 mix-blend-multiply" />
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="flex items-center justify-center gap-2 mb-8">
            <span className="text-xl text-[#F2C583]">✦</span>
            <p className="text-xl font-bold tracking-[0.2em] text-[#7A1F1F] font-serif">{String(dDate).padStart(2, '0')} . {String(dMonth).padStart(2, '0')} . {dYear}</p>
            <span className="text-xl text-[#F2C583]">✦</span>
          </motion.div>

          {/* Hero Frame */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="relative w-full aspect-[2/3] border-[6px] border-[#7A1F1F] p-1 mb-16 shadow-lg bg-white">
            <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
          </motion.div>

          {/* Parents Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="flex flex-col items-center gap-1 mb-12 text-center px-4">
            <img src="/assets/wedding/wedding-2/logotrungthu2.webp" alt="Decor" className="w-12 h-12 opacity-80 mb-4 mix-blend-multiply" />
            <p className="text-[10px] text-[#B58B5C] uppercase tracking-widest mb-1 font-bold">Nhà Trai</p>
            <p className="text-sm font-bold text-[#7A1F1F] uppercase mb-4">{groomFamily || "Ông Phạm Văn Long - Bà Lê Thị Mai"}</p>
            <div className="w-8 h-[2px] bg-[#B58B5C] mb-4"></div>
            <p className="text-[10px] text-[#B58B5C] uppercase tracking-widest mb-1 font-bold">Nhà Gái</p>
            <p className="text-sm font-bold text-[#7A1F1F] uppercase">{brideFamily || "Ông Nguyễn Văn Hùng - Bà Trần Thị Hoa"}</p>
          </motion.div>

          {/* Second Names */}
          <motion.h2 initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="text-[26px] sm:text-[28px] md:text-3xl text-[#7A1F1F] mb-12 text-center px-2 leading-tight whitespace-nowrap" style={{ fontFamily: 'var(--font-dancing)' }}>
            {groomName} & {brideName}
          </motion.h2>

          {/* Red Photo Block */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="w-[110%] -ml-[5%] bg-[#7A1F1F] p-6 mb-16 shadow-inner">
            <img src={gallery[0]} alt="Couple" className="w-full aspect-[4/3] object-cover border-4 border-white shadow-xl" />
          </motion.div>

          {/* Trân Trọng Kính Mời */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="flex flex-col items-center mb-16 w-full text-center">
            <div className="w-16 h-[2px] bg-[#D4AF37] mb-6"></div>
            <h2 className="text-3xl text-[#7A1F1F] mb-6" style={{ fontFamily: 'var(--font-dancing)' }}>Trân Trọng Kính Mời</h2>
            <div className="grid grid-cols-3 gap-2 w-full">
              {gallery.slice(1, 4).map((img, i) => (
                <motion.img initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: i * 0.15 }} key={i} src={img} alt={`Gallery ${i}`} className="w-full aspect-[2/3] object-cover" />
              ))}
            </div>
          </motion.div>

          {/* Event Details */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="flex flex-col items-center text-center mb-16 w-full">
            <h3 className="text-sm font-bold text-[#0047AB] tracking-widest uppercase mb-4">Lễ Thành Hôn</h3>
            <p className="text-xs text-[#5A5552] mb-2 uppercase">Tại Tư Gia</p>
            
            <p className="text-[10px] text-[#A67C52] uppercase tracking-widest font-bold">{dDayOfWeek}</p>
            <p className="text-7xl font-serif text-[#2D2A28] leading-none my-2">{dDate}</p>
            <p className="text-[10px] text-[#A67C52] uppercase tracking-widest font-bold">Tháng {dMonth}</p>
            
            <p className="text-xs text-[#5A5552] mt-4 mb-1">Vào lúc <span className="font-bold">{dHours}:{dMinutes}</span></p>
            <p className="text-[10px] text-[#5A5552] max-w-[200px] leading-relaxed italic">Sự hiện diện của quý khách là vinh hạnh cho gia đình chúng tôi</p>
          </motion.div>

          {/* Dashed Invite Box */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="border border-dashed border-[#7A1F1F] rounded-lg p-6 flex flex-col items-center text-center w-full mb-16 bg-[#FFFDF9]">
            <p className="text-xs font-bold text-[#0047AB] uppercase tracking-widest mb-4">Mời bạn dùng cỗ cùng tụi mình nhé</p>
            <p className="text-[10px] text-[#5A5552] leading-relaxed mb-6 uppercase max-w-[180px] font-bold">
              {eventAddress}
            </p>
            <a href={mapUrl} target="_blank" rel="noreferrer" className="bg-[#7A1F1F] text-[#FFFFFF] text-[10px] px-8 py-3 rounded-full uppercase tracking-widest font-bold shadow-md hover:bg-[#5a1515]">
              Xem Chỉ Đường
            </a>
          </motion.div>

          {/* Calendar Section */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="w-full flex flex-col items-center mb-16">
            <h3 className="text-sm font-serif font-bold text-[#5A5552] mb-6 uppercase tracking-[0.2em]">Tháng {dMonth} - {dYear}</h3>
            <div className="grid grid-cols-7 gap-2 w-full max-w-[280px] text-center text-xs border border-[#C5A880]/30 p-4 rounded-lg bg-white shadow-sm">
              {['T2','T3','T4','T5','T6','T7','CN'].map(day => (
                <div key={day} className="font-bold text-[#A67C52]">{day}</div>
              ))}
              {blanks.map(b => <div key={`blank-${b}`} />)}
              {monthDays.map(day => {
                const isWedding = day === dDate && parsedDDate.getMonth() + 1 === dMonth && parsedDDate.getFullYear() === dYear;
                const isEngagement = day === parsedEDate.getDate() && parsedEDate.getMonth() + 1 === dMonth && parsedEDate.getFullYear() === dYear;
                return (
                  <div key={day} className="relative flex items-center justify-center py-2 text-[#5A5552] font-medium">
                    {day}
                    {isWedding && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5, type: "spring" }} className="absolute inset-0 border border-[#7A1F1F] rounded-full scale-125 opacity-80" />
                    )}
                    {isEngagement && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5, type: "spring" }} className="absolute inset-0 border border-[#A67C52] rounded-full scale-125 opacity-50" />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-[9px] font-sans font-bold uppercase tracking-widest text-[#A67C52]">
                <div className="w-3 h-3 rounded-full border border-[#A67C52] opacity-50"></div> Ăn Hỏi
              </div>
              <div className="flex items-center gap-2 text-[9px] font-sans font-bold uppercase tracking-widest text-[#7A1F1F]">
                <div className="w-3 h-3 rounded-full border border-[#7A1F1F] opacity-80"></div> Lễ Cưới
              </div>
            </div>
          </motion.div>

          {/* RSVP Form */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="w-full flex flex-col items-center mb-16">
            <h2 className="text-[22px] sm:text-2xl text-[#7A1F1F] mb-6 text-center leading-tight px-2 whitespace-nowrap" style={{ fontFamily: 'var(--font-dancing)' }}>
              {groomName} <span className="text-sm font-sans mx-2">&amp;</span> {brideName}
            </h2>
            <div className="w-full bg-[#7A1F1F] rounded-xl p-6 shadow-xl flex flex-col gap-3">
              <input type="text" placeholder="Nhập Tên Bạn..." className="w-full bg-white text-[#2D2A28] text-xs px-4 py-3 rounded-md outline-none" />
              <input type="text" placeholder="Số Điện Thoại..." className="w-full bg-white text-[#2D2A28] text-xs px-4 py-3 rounded-md outline-none" />
              <select className="w-full bg-white text-[#2D2A28] text-xs px-4 py-3 rounded-md outline-none appearance-none">
                <option>Xác Nhận Tham Dự...</option>
                <option>Có</option>
                <option>Không</option>
              </select>
              <textarea placeholder="Gửi Chút Lời Chúc Tới..." rows={2} className="w-full bg-white text-[#2D2A28] text-xs px-4 py-3 rounded-md outline-none resize-none"></textarea>
              <button 
                onClick={() => !compact && onComplete?.({})}
                className="w-full bg-[#FFFFFF] text-[#7A1F1F] text-[10px] font-bold uppercase tracking-widest py-3 rounded-md mt-2 shadow-md hover:bg-stone-100"
              >
                Gửi Xác Nhận
              </button>
            </div>
            <button onClick={() => setShowQR(true)} className="bg-[#7A1F1F] text-[#FFFFFF] text-[10px] uppercase font-bold tracking-widest px-8 py-3 rounded-full shadow-md mt-6 hover:bg-[#5a1515] transition-colors">
              Mừng Cưới (QR)
            </button>
          </motion.div>

          {/* Gallery Grid */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="w-full flex flex-col items-center mb-16">
            <h3 className="text-xs font-serif font-bold text-[#A67C52] mb-2 uppercase tracking-[0.3em]">Album Cưới</h3>
            <div className="w-16 h-px bg-[#C5A880] mb-8"></div>
            
            <div className="grid grid-cols-2 gap-2 w-full">
              {gallery.map((img, idx) => {
                const isFull = (idx % 3 === 0) || (idx === gallery.length - 1 && idx % 3 === 1);
                return (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: (idx % 2) * 0.2 }} key={idx} className={`relative overflow-hidden ${isFull ? 'col-span-2 aspect-[4/3]' : 'aspect-square'}`}>
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          
        </div>

        {/* Footer Thank You */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative w-full aspect-[3/4] flex flex-col items-center justify-end pb-8 overflow-hidden rounded-b-3xl">
          <img src={gallery[gallery.length - 1] || heroImage} alt="Thank You" className="absolute inset-0 w-full h-full object-cover opacity-90 grayscale" />
          <div className="absolute inset-0 bg-[#7A1F1F]/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#7A1F1F] via-[#7A1F1F]/40 to-transparent" />
          <div className="relative z-10 flex flex-col items-center">
            <p className="text-[10px] text-[#F2C583] uppercase tracking-[0.2em] mb-4 font-bold">Trân Trọng Cảm Ơn</p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} className="text-6xl text-white mb-8" style={{ fontFamily: 'var(--font-dancing)' }}>Thank You</motion.h2>
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
               transition={{ duration: 3.5, ease: [0.4, 0, 0.2, 1] }}
               className="w-1/2 h-full relative z-30"
             >
               <img src="/assets/wedding/wedding-2/sidebentrai.webp" alt="Door Left" className="absolute top-0 left-0 h-full w-[200%] max-w-none object-cover object-left pointer-events-none" />
             </motion.div>
             {/* Right Door */}
             <motion.div 
               initial={{ x: 0 }}
               exit={{ x: "200%" }}
               transition={{ duration: 3.5, ease: [0.4, 0, 0.2, 1] }}
               className="w-1/2 h-full relative z-20"
             >
               <img src="/assets/wedding/wedding-2/sidebenphai.webp" alt="Door Right" className="absolute top-0 right-0 h-full w-[200%] max-w-none object-cover object-right pointer-events-none" />
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

    </div>
  );
}
