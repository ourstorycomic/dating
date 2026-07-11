"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { MediaDisplay } from "@/components/ui/MediaDisplay";

export function WeddingFourExperience({
  compact = false,
  autoPlay = false,
  groomName = "Minh Trí",
  brideName = "Thanh Hằng",
  weddingDate = "2025-02-15T09:00:00.000Z",
  weddingMonth = "Tháng 2",
  weddingDay = "15",
  weddingYear = "2025",
  weddingDayOfWeek = "Thứ Hai",
  heroImage = "/assets/lovepics/1.jpg",
  groomImage = "/assets/lovepics/2.jpg",
  brideImage = "/assets/lovepics/3.jpg",
  letterText = "Tình yêu không phải là tìm thấy một người hoàn hảo, mà là học cách nhìn một người không hoàn hảo một cách hoàn hảo. Chúng tôi rất vui mừng được mời bạn đến chung vui cùng chúng tôi trong ngày trọng đại này.",
  groomFamily = "Ông Nguyễn Văn A\nBà Trần Thị B",
  brideFamily = "Ông Lê Văn C\nBà Phạm Thị D",
  eventAddress = "Trung tâm tiệc cưới mẫu, 123 Đường Tình Yêu, Quận Hạnh Phúc, TP. HCM",
  mapUrl = "https://maps.app.goo.gl/xxx",
  mapImage = "/assets/lovepics/map-preview.jpg",
  dividerImage = "/assets/lovepics/5.jpg",
  footerImage = "/assets/lovepics/4.jpg",
  musicUrl = "",
  isBuilderPreview = false,
  onComplete,
}: {
  compact?: boolean;
  autoPlay?: boolean;
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
}) {
  const parsedDDate = new Date(weddingDate || '2025-02-15T09:00:00.000Z');
  const dDay = parsedDDate.getDate().toString().padStart(2, '0');
  const dMonth = 'Tháng ' + (parsedDDate.getMonth() + 1);
  const dYear = parsedDDate.getFullYear().toString();
  const dDayOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][parsedDDate.getDay()];
  const dHours = parsedDDate.getHours().toString().padStart(2, '0');
  const dMinutes = parsedDDate.getMinutes().toString().padStart(2, '0');
  const dTime = `${dHours}:${dMinutes}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMounted, setIsMounted] = useState(false);
  const [isOpened, setIsOpened] = useState(isBuilderPreview);

  useEffect(() => {
    if (autoPlay && !isBuilderPreview && !isOpened) {
      const timer = setTimeout(() => setIsOpened(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, isBuilderPreview, isOpened]);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpCount, setRsvpCount] = useState("1");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  useEffect(() => {
    if (audioRef.current && musicUrl) {
      if (autoPlay) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else if (!compact && !isBuilderPreview) {
        // Automatically play music on the Preview Page
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  }, [autoPlay, compact, isBuilderPreview, musicUrl]);

  useEffect(() => {
    if (autoPlay && isOpened && containerRef.current) {
      let reqId: number;
      const timeoutId = setTimeout(() => {
        let scrollAmount = 0;
        const speed = 0.3; // Much slower scroll

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
      }, 1500); // Wait for doors to open
      
      return () => {
        clearTimeout(timeoutId);
        if (reqId) cancelAnimationFrame(reqId);
      };
    }
  }, [autoPlay, isOpened]);

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

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSubmitted(true);
    onComplete?.({ name: rsvpName, phone: rsvpPhone, count: rsvpCount });
  };

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const targetDate = new Date(weddingDate).getTime();
    
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

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  const yHero = useTransform(scrollYProgress, [0, 0.4], [0, 150]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div
      ref={containerRef}
      className={`@container relative w-full h-full bg-[#fdfbf7] text-[#455a64] scroll-smooth ${autoPlay ? "overflow-hidden pointer-events-none select-none" : !isOpened ? "overflow-hidden select-none" : "overflow-x-hidden overflow-y-auto"} ${compact ? "rounded-[2.5rem]" : ""}`}
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {/* Intro Envelope Screen */}
      <AnimatePresence>
        {!isOpened && (
          <>
            <motion.div
              key="door-left"
              initial={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 w-1/2 z-[100] bg-[#5480a2] border-r border-[#416886] shadow-[5px_0_20px_rgba(0,0,0,0.3)] pointer-events-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-20 mix-blend-overlay" />
              <div className="absolute right-0 top-0 w-full h-[50vh] bg-[#6691b1]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}>
                 <div className="absolute inset-0 border-r-[2px] border-b-[2px] border-white/10" />
              </div>
              <div className="absolute right-0 bottom-0 w-full h-[50vh] bg-[#436e8e]" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}>
                 <div className="absolute inset-0 border-r-[2px] border-t-[2px] border-white/5" />
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[50%] w-24 h-24 bg-gradient-to-br from-[#d4ba8a] to-[#aa8f5d] rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.4)] flex items-center justify-center z-20 border-[3px] border-[#fff1d0]" style={{ clipPath: "inset(0 50% 0 0)" }}>
                <span className="text-white text-3xl font-bold tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>W</span>
              </div>
            </motion.div>
            
            <motion.div
              key="door-right"
              initial={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 right-0 w-1/2 z-[100] bg-[#5480a2] border-l border-[#416886] shadow-[-5px_0_20px_rgba(0,0,0,0.3)] pointer-events-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-20 mix-blend-overlay" />
              <div className="absolute left-0 top-0 w-full h-[50vh] bg-[#6691b1]" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}>
                 <div className="absolute inset-0 border-l-[2px] border-b-[2px] border-white/10" />
              </div>
              <div className="absolute left-0 bottom-0 w-full h-[50vh] bg-[#436e8e]" style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}>
                 <div className="absolute inset-0 border-l-[2px] border-t-[2px] border-white/5" />
              </div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[50%] w-24 h-24 bg-gradient-to-br from-[#d4ba8a] to-[#aa8f5d] rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.4)] flex items-center justify-center z-20 border-[3px] border-[#fff1d0]" style={{ clipPath: "inset(0 0 0 50%)" }}>
                <span className="text-white text-3xl font-bold tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>W</span>
              </div>
            </motion.div>
            
            <motion.div
              key="content"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 z-[101] flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
              onClick={() => {
                setIsOpened(true);
                if (audioRef.current && !isPlaying) {
                  audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
                }
              }}
            >
              <div className="relative z-10 flex flex-col items-center px-6 text-center">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4ba8a] mb-8 font-bold">Thân Mời</p>
                
                

                <h1 className="text-5xl @sm:text-6xl font-normal text-[#fdfbf7] drop-shadow-lg mb-2" style={{ fontFamily: "'Dancing Script', cursive" }}>{brideName}</h1>
                <span className="text-xl text-[#d4ba8a] font-light italic my-1 drop-shadow-md" style={{ fontFamily: "'Dancing Script', cursive" }}>&amp;</span>
                <h1 className="text-5xl @sm:text-6xl font-normal text-[#fdfbf7] drop-shadow-lg mt-2" style={{ fontFamily: "'Dancing Script', cursive" }}>{groomName}</h1>
                
                <p className="mt-12 text-[10px] uppercase tracking-[0.2em] font-bold text-[#455a64] border-b border-[#d4ba8a] pb-1">Chạm để mở thiệp</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Background Music & Floating Toggle */}
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" autoPlay={autoPlay} muted={compact && !autoPlay} />
      )}
      {!autoPlay && (
        <button 
          onClick={toggleAudio}
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/80 backdrop-blur-md border border-[#3a6186]/20 rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(58,97,134,0.15)] transition-transform active:scale-95 pointer-events-auto"
        >
          {isPlaying ? (
             <svg className="w-4 h-4 text-[#fdfbf7] drop-shadow-md animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
          ) : (
             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>
          )}
        </button>
      )}

      {/* 1. HERO SECTION (Torn edge / Soft blend) */}
      <section className="relative w-full pb-16 flex flex-col items-center justify-start pt-16 bg-[#fdfbf7]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
          className="text-center w-full px-6 flex flex-col items-center mb-8 relative z-10"
        >
          <p className="text-[#d4ba8a] text-2xl @sm:text-3xl mb-2" style={{ fontFamily: "'Dancing Script', cursive" }}>Save the Date</p>
          <div className="flex items-center gap-4 text-[#fdfbf7] drop-shadow-md font-bold text-3xl @sm:text-4xl mt-2 tracking-wide">
            <span>{groomName}</span>
            <span className="text-[#d4ba8a] text-2xl font-light">&amp;</span>
            <span>{brideName}</span>
          </div>
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#455a64] mt-4">
            <span className="border-t border-b border-[#d4ba8a] py-1 px-2">{weddingDate ? new Date(weddingDate).toLocaleDateString('en-US', {month: 'short'}) : "FEB"}</span>
            <span className="text-xl font-bold text-[#fdfbf7] drop-shadow-md">{dDay}</span>
            <span className="border-t border-b border-[#d4ba8a] py-1 px-2">{dYear}</span>
          </div>
        </motion.div>

        <motion.div style={{ y: yHero, opacity: opacityHero }} className="w-full max-w-[90%] @sm:max-w-2xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl relative">
          <MediaDisplay src={heroImage} alt="Hero" className="w-full aspect-[4/5] @sm:aspect-[16/10] object-cover" />
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#fdfbf7] to-transparent" />
        </motion.div>
      </section>

      {/* 2. INVITATION LETTER */}
      <section className="py-16 px-6 relative z-10 bg-[#fdfbf7] text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true, margin: "0px" }} className="max-w-xl mx-auto">
          
          <h2 className="text-[#fdfbf7] drop-shadow-md text-3xl @sm:text-4xl font-normal mb-8" style={{ fontFamily: "'Dancing Script', cursive" }}>Trân trọng kính mời</h2>
          
          <p className="text-sm leading-relaxed italic text-[#455a64] px-4 mb-10">
            "{letterText}"<br/>Đến dự buổi tiệc chung vui cùng gia đình chúng tôi.
          </p>

          <div className="flex justify-between text-xs tracking-widest text-[#455a64] mb-12">
            <div className="text-center w-1/2 px-2 border-r border-[#d4ba8a]/30">
              <span className="block text-[9px] uppercase text-[#d4ba8a] mb-2 font-bold tracking-[0.2em]">Nhà Trai</span>
              <span className="whitespace-pre-wrap leading-relaxed font-medium">{groomFamily}</span>
            </div>
            <div className="text-center w-1/2 px-2">
              <span className="block text-[9px] uppercase text-[#d4ba8a] mb-2 font-bold tracking-[0.2em]">Nhà Gái</span>
              <span className="whitespace-pre-wrap leading-relaxed font-medium">{brideFamily}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-[#d4ba8a] uppercase tracking-widest text-[10px] font-bold">Vào lúc</p>
            <p className="text-2xl text-[#fdfbf7] drop-shadow-md font-bold mt-2 font-sans tracking-tight">{dTime}, {dDayOfWeek}</p>
            <div className="flex items-center justify-center gap-4 text-xl text-[#455a64] mt-2 border-y border-[#d4ba8a]/50 py-3 w-full">
              <span className="uppercase text-xs tracking-widest font-bold">Tháng {dMonth.replace(/\D/g,'')}</span>
              <span className="text-4xl text-[#fdfbf7] drop-shadow-md font-bold mx-2">{dDay}</span>
              <span className="uppercase text-xs tracking-widest font-bold">Năm {dYear}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. EVENT TIMELINE & ADDRESS */}
      <section className="py-12 px-4 bg-[#fdfbf7] border-b border-[#d4ba8a]/20">
        <div className="max-w-md mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12">
            <p className="text-[#fdfbf7] drop-shadow-md text-xl font-bold uppercase tracking-widest mb-2 font-sans">Tiệc Đám Cưới</p>
            <p className="text-[#455a64] text-xs uppercase tracking-widest mb-4">Nhà Hàng Tiệc Cưới</p>
            <p className="text-[#455a64] text-sm font-medium leading-relaxed px-4 mb-6">{eventAddress}</p>
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#3a6186] text-white text-[10px] uppercase font-bold tracking-widest py-3 px-8 rounded-full hover:bg-[#2d4b68] transition-colors shadow-lg shadow-[#3a6186]/30">
              Chỉ đường
            </a>
          </motion.div>
          
          {/* Icons Timeline */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mt-16">
            <h3 className="text-[#d4ba8a] text-3xl mb-8" style={{ fontFamily: "'Dancing Script', cursive" }}>Timeline</h3>
            <div className="flex justify-between items-start px-4 relative">
              <div className="absolute top-4 left-10 right-10 h-[1px] bg-[#d4ba8a]/50 z-0"></div>
              
              {[
                { time: "09:00", label: "Đón Khách", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> },
                { time: "10:30", label: "Lễ Cưới", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="5"></circle><circle cx="15" cy="12" r="5"></circle></svg> },
                { time: "11:30", label: "Khai Tiệc", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 15v6M12 15s5.5-4 5.5-9v-1a2 2 0 0 0-2-2H8.5a2 2 0 0 0-2 2v1c0 5 5.5 9 5.5 9z"></path></svg> }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center relative z-10 w-1/3">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#3a6186] text-[#fdfbf7] drop-shadow-md flex items-center justify-center mb-3 shadow-md">
                    {item.icon}
                  </div>
                  <p className="text-[#fdfbf7] drop-shadow-md font-bold font-sans text-sm">{item.time}</p>
                  <p className="text-[#455a64] text-[9px] uppercase tracking-widest mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. DRESS CODE */}
      <section className="py-16 px-4 bg-white text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h3 className="text-[#d4ba8a] text-3xl mb-8" style={{ fontFamily: "'Dancing Script', cursive" }}>Dress Code</h3>
          
          <div className="flex justify-center gap-4 mb-6">
            {[
              { color: "#3a6186", label: "Blue" },
              { color: "#111111", label: "Black" },
              { color: "#e8dfcf", label: "Beige" },
              { color: "#ffffff", label: "White", border: true }
            ].map((dc, i) => (
              <motion.div 
                key={i}
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                className={`w-10 h-10 rounded-full shadow-md ${dc.border ? 'border-2 border-gray-200' : ''}`}
                style={{ backgroundColor: dc.color }}
              />
            ))}
          </div>
          <p className="text-[#455a64] text-[10px] uppercase tracking-[0.15em] leading-relaxed max-w-xs mx-auto">
            Khuyến khích quý khách mặc trang phục theo tone màu trên để những bức hình thêm phần đẹp mắt.
          </p>
        </motion.div>
      </section>

      {/* 5. BIG RED HEART & FULL PHOTO */}
      <section className="relative pt-12 pb-24 bg-[#fdfbf7] flex flex-col items-center overflow-hidden">
        <div className="w-full px-4 relative max-w-md mx-auto group">
          <div className="absolute -bottom-8 right-8 z-20 text-[#e53935] text-6xl animate-pulse drop-shadow-xl select-none">
            ♥
          </div>
          <div className="aspect-[3/4] overflow-hidden rounded-t-full rounded-b-xl border-4 border-white shadow-xl relative z-10">
            <MediaDisplay src={groomImage} alt="Groom" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          </div>
        </div>
        
        <div className="flex justify-between items-end w-full max-w-md px-12 -mt-6 relative z-30">
          <div className="text-center">
            <p className="text-[10px] uppercase text-[#d4ba8a] font-bold tracking-widest mb-1">Groom</p>
            <p className="text-[#fdfbf7] drop-shadow-md font-bold text-lg font-sans">{groomName}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase text-[#d4ba8a] font-bold tracking-widest mb-1">Bride</p>
            <p className="text-[#fdfbf7] drop-shadow-md font-bold text-lg font-sans">{brideName}</p>
          </div>
        </div>
      </section>

      {/* 6. OUR STORY (GALLERY) */}
      <section className="py-16 px-4 bg-white relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-4xl text-[#fdfbf7] drop-shadow-md flex items-center justify-center gap-2" style={{ fontFamily: "'Dancing Script', cursive" }}>
            Chuyện của chúng mình <span className="text-xl text-[#e53935]">♥</span>
          </h2>
          <p className="text-[#455a64] text-xs italic mt-4 max-w-sm mx-auto leading-relaxed px-4">
            "Không có tình yêu nào hoàn hảo, chỉ có hai người yêu nhau cố gắng làm mọi thứ trở nên hoàn hảo vì nhau."
          </p>
        </motion.div>
        
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3 px-2">
          {/* Vertical */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="col-span-1 row-span-2 aspect-[2/3] overflow-hidden rounded-xl border border-gray-100 shadow-sm">
             <MediaDisplay src={brideImage} alt="Gallery 1" className="w-full h-full object-cover" />
          </motion.div>
          
          {/* Calendar element disguised as a gallery item */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="col-span-1 aspect-square bg-[#fdfbf7] rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center p-2 relative">
             <p className="text-[#fdfbf7] drop-shadow-md font-bold font-sans text-xs uppercase mb-2">{dMonth}</p>
             <div className="grid grid-cols-7 gap-1 text-[8px] font-sans text-gray-400 font-bold w-full text-center">
               {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={`day-${i}`}>{d}</div>)}
               <div className="text-transparent">0</div>
               <div className="text-transparent">0</div>
               {calendarDays.slice(0, 15).map(day => (
                 <div key={day} className="relative w-full h-4 flex items-center justify-center">
                   {day.toString() === dDay ? (
                     <span className="absolute z-10 text-white bg-[#e53935] w-4 h-4 flex items-center justify-center rounded-full text-[8px]">♥</span>
                   ) : (
                     <span className="text-gray-600">{day}</span>
                   )}
                 </div>
               ))}
             </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="col-span-1 aspect-square overflow-hidden rounded-xl border border-gray-100 shadow-sm">
             <MediaDisplay src={footerImage} alt="Gallery 2" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="col-span-2 aspect-[16/9] overflow-hidden rounded-xl border border-gray-100 shadow-sm mt-2">
             <MediaDisplay src={dividerImage} alt="Gallery 3" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </section>

      {/* 7. RSVP FORM WITH BLUE ENVELOPE THEME */}
      <section className="py-20 px-4 bg-[#fdfbf7] flex justify-center border-t border-[#d4ba8a]/20 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-[0_10px_40px_rgba(58,97,134,0.1)] border border-[#3a6186]/10 relative overflow-hidden"
        >
          <div className="text-center mb-8">
            <p className="text-[10px] text-[#fdfbf7] drop-shadow-md font-sans uppercase tracking-[0.2em] font-bold">Hy vọng bạn sẽ đến</p>
            <h2 className="text-[#fdfbf7] drop-shadow-md text-4xl mt-1" style={{ fontFamily: "'Dancing Script', cursive" }}>R.S.V.P</h2>
          </div>

          {!rsvpSubmitted ? (
            <form onSubmit={handleRSVP} className="space-y-4 font-sans relative z-10">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 ml-2">Tên của bạn</label>
                <input 
                  type="text" required 
                  value={rsvpName} onChange={e => setRsvpName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#3a6186] focus:ring-1 focus:ring-[#3a6186] focus:outline-none text-sm transition-all text-[#fdfbf7] drop-shadow-md shadow-sm" 
                  placeholder="VD: Tuấn Anh" 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 ml-2 mt-4">Số điện thoại</label>
                <input 
                  type="tel" required 
                  value={rsvpPhone} onChange={e => setRsvpPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#3a6186] focus:ring-1 focus:ring-[#3a6186] focus:outline-none text-sm transition-all text-[#fdfbf7] drop-shadow-md shadow-sm" 
                  placeholder="09xx..." 
                />
              </div>
              
              <div className="mt-6 text-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block text-[10px] font-bold text-[#fdfbf7] drop-shadow-md uppercase tracking-widest mb-3">Số lượng người tham dự</label>
                <div className="flex justify-center items-center gap-2">
                  {["1", "2", "3"].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRsvpCount(num)}
                      className={`w-10 h-10 rounded-md text-sm font-bold transition-all shrink-0 ${rsvpCount === num ? "bg-[#3a6186] text-white shadow-md" : "bg-white text-gray-500 border border-gray-200 hover:border-[#3a6186]"}`}
                    >
                      {num}
                    </button>
                  ))}
                  <div className={`relative flex items-center shrink-0 ml-1 rounded-md transition-all ${!["1", "2", "3"].includes(rsvpCount) ? "bg-[#3a6186] shadow-md" : "bg-white border border-gray-200"}`}>
                    <input 
                      type="number" min="4" max="100" placeholder="Khác"
                      value={["1", "2", "3"].includes(rsvpCount) ? "" : rsvpCount}
                      onChange={(e) => setRsvpCount(e.target.value)}
                      onFocus={() => { if(["1", "2", "3"].includes(rsvpCount)) setRsvpCount("") }}
                      className={`w-16 h-10 bg-transparent text-center text-sm font-bold focus:outline-none rounded-md ${!["1", "2", "3"].includes(rsvpCount) ? "text-white placeholder:text-white/70" : "text-gray-500 placeholder:text-gray-400"}`}
                    />
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full py-4 mt-6 bg-[#3a6186] text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-[#2d4b68] transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Gửi Xác Nhận <span className="text-xl">✉</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-10">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-5xl text-[#e53935] mb-4 inline-block">♥</motion.div>
              <h3 className="text-lg font-bold text-[#fdfbf7] drop-shadow-md uppercase tracking-widest mt-2">Đã nhận phản hồi</h3>
              <p className="text-gray-500 text-sm mt-3 font-serif italic">Hẹn gặp bạn tại tiệc cưới nhé!</p>
            </div>
          )}
        </motion.div>
      </section>

      {/* 8. FOOTER THANK YOU */}
      <section className="relative h-[500px] flex flex-col items-center justify-center overflow-hidden bg-white">
        <MediaDisplay src={heroImage} alt="Footer" className="absolute inset-0 w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}
          className="relative z-10 text-center text-[#fdfbf7] drop-shadow-md p-8 mt-40"
        >
          <p className="text-xs uppercase tracking-[0.3em] font-bold mb-2">Trân trọng</p>
          <h2 className="text-5xl font-normal mb-2 drop-shadow-sm" style={{ fontFamily: "'Dancing Script', cursive" }}>Thank You</h2>
        </motion.div>
      </section>
    </div>
  );
}
