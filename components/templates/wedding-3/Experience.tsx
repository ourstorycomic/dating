"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { MediaDisplay } from "@/components/ui/MediaDisplay";

export function WeddingThreeExperience({
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

  const yHero = useTransform(scrollYProgress, [0, 0.4], [0, 250]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div
      ref={containerRef}
      className={`@container relative w-full h-full bg-white text-[#333] scroll-smooth ${autoPlay ? "overflow-hidden pointer-events-none select-none" : !isOpened ? "overflow-hidden select-none" : "overflow-x-hidden overflow-y-auto"} ${compact ? "rounded-[2.5rem]" : ""}`}
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {/* Intro Curtain Screen */}
      <AnimatePresence>
        {!isOpened && (
          <>
            <motion.div
              key="door-left"
              initial={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 w-1/2 z-[100] bg-[#8b0000] border-r border-[#d4af37]/50 shadow-[10px_0_30px_rgba(0,0,0,0.5)] pointer-events-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent mix-blend-overlay" />
              <div className="absolute inset-y-4 left-4 right-2 border-2 border-[#d4af37]/40 rounded-l-sm" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[50%] w-32 h-32 bg-gradient-to-br from-[#c8102e] via-[#9e1b1b] to-[#5a0000] rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.6),inset_0_2px_5px_rgba(255,255,255,0.4),inset_0_-2px_5px_rgba(0,0,0,0.6)] z-10 border-[2px] border-[#3a0000]" style={{ clipPath: "inset(0 50% 0 0)" }}>
                <div className="w-28 h-28 border-[2px] border-[#8b0000] rounded-full flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                  <span className="text-[#d4af37] text-5xl font-bold shadow-sm" style={{ fontFamily: "'Great Vibes', cursive" }}>W</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              key="door-right"
              initial={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 right-0 w-1/2 z-[100] bg-[#8b0000] border-l border-[#d4af37]/50 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] pointer-events-none"
            >
              <div className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent mix-blend-overlay" />
              <div className="absolute inset-y-4 right-4 left-2 border-2 border-[#d4af37]/40 rounded-r-sm" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[50%] w-32 h-32 bg-gradient-to-br from-[#c8102e] via-[#9e1b1b] to-[#5a0000] rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.6),inset_0_2px_5px_rgba(255,255,255,0.4),inset_0_-2px_5px_rgba(0,0,0,0.6)] z-10 border-[2px] border-[#3a0000]" style={{ clipPath: "inset(0 0 0 50%)" }}>
                <div className="w-28 h-28 border-[2px] border-[#8b0000] rounded-full flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                  <span className="text-[#d4af37] text-5xl font-bold shadow-sm" style={{ fontFamily: "'Great Vibes', cursive" }}>W</span>
                </div>
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
              <div className="relative z-10 flex flex-col items-center px-6 text-center text-white">
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/70 mb-6 font-bold">Lễ Thành Hôn</p>
                <h1 className="text-5xl @sm:text-6xl font-normal mb-2" style={{ fontFamily: "'Great Vibes', cursive" }}>{brideName}</h1>
                <span className="text-2xl text-white/50 font-light italic my-1" style={{ fontFamily: "'Great Vibes', cursive" }}>&amp;</span>
                <h1 className="text-5xl @sm:text-6xl font-normal mt-2" style={{ fontFamily: "'Great Vibes', cursive" }}>{groomName}</h1>
                
                <motion.div 
                  animate={{ scale: [1, 1.15, 1], boxShadow: ["0 0 0 0 rgba(255,255,255,0.4)", "0 0 0 20px rgba(255,255,255,0)", "0 0 0 0 rgba(255,255,255,0)"] }} 
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="mt-16 bg-white text-[#9e1b1b] rounded-full w-12 h-12 flex items-center justify-center shadow-xl"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </motion.div>
                <p className="mt-4 text-[9px] uppercase tracking-[0.2em] font-bold text-white/80">Mở Lời Mời</p>
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
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/90 backdrop-blur-md border border-gray-100 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(158,27,27,0.15)] transition-transform active:scale-95 pointer-events-auto"
        >
          {isPlaying ? (
             <svg className="w-4 h-4 text-[#9e1b1b] animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
          ) : (
             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>
          )}
        </button>
      )}

      {/* 1. HERO SECTION (Bright with Red Accent) */}
      <section className="relative h-[95vh] w-full overflow-hidden flex flex-col items-center justify-start pt-16 @sm:pt-20 bg-white">
        <motion.div style={{ y: yHero }} className="absolute inset-0 z-0 origin-top">
          <MediaDisplay src={heroImage} alt="Hero" className="w-full h-[120%] object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/10 to-white/90" />
        </motion.div>
        
        <motion.div 
          style={{ opacity: opacityHero }}
          className="relative z-10 text-center w-full px-6 flex flex-col items-center mt-12"
        >
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#9e1b1b] mb-4 font-bold border-y border-[#9e1b1b] py-2 px-6 inline-block">Save The Date</p>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 1.2 }}
            className="text-4xl @sm:text-6xl font-bold text-[#222] leading-tight tracking-tight mt-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {brideName} &amp; {groomName}
          </motion.h1>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }} className="mt-6 flex gap-4 text-[#9e1b1b] font-bold tracking-widest uppercase text-xs">
             <span>{dDay}</span>
             <span>•</span>
             <span>{dMonth}</span>
             <span>•</span>
             <span>{dYear}</span>
          </motion.div>
        </motion.div>
        
        {/* Glowing Stars Effect on Hero */}
        {isMounted && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute w-1 h-1 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)]"
                initial={{ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 5 }}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. INVITATION & RINGS */}
      <section className="py-24 px-6 relative z-10 bg-white">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-50px" }} className="text-center max-w-2xl mx-auto">
          
          <div className="flex justify-center mb-8">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9e1b1b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="5"></circle><circle cx="15" cy="12" r="5"></circle></svg>
          </div>
          
          <h2 className="text-[#9e1b1b] text-3xl @sm:text-4xl font-normal mb-8" style={{ fontFamily: "'Great Vibes', cursive" }}>Lời Mời Chân Thành</h2>
          
          <p className="text-sm @sm:text-base leading-loose italic text-gray-700 px-4 mb-12">
            Trân trọng kính mời quý khách đến chung vui cùng gia đình chúng tôi.<br/>
            Sự hiện diện của quý khách là niềm vinh hạnh lớn nhất.
          </p>

          <div className="flex justify-between text-xs @sm:text-sm tracking-widest text-[#333] border-t border-gray-100 pt-12">
            <div className="text-center w-1/2 px-4 border-r border-gray-100">
              <span className="block text-[9px] uppercase text-[#9e1b1b] mb-3 font-bold tracking-[0.2em]">Nhà Trai</span>
              <span className="whitespace-pre-wrap leading-loose font-medium text-gray-600">{groomFamily}</span>
            </div>
            <div className="text-center w-1/2 px-4">
              <span className="block text-[9px] uppercase text-[#9e1b1b] mb-3 font-bold tracking-[0.2em]">Nhà Gái</span>
              <span className="whitespace-pre-wrap leading-loose font-medium text-gray-600">{brideFamily}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. BOLD RED STATEMENT & GALLERY */}
      <section className="pt-16 pb-24 px-4 bg-gray-50 overflow-hidden text-center">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}
          className="text-[#9e1b1b] text-5xl @sm:text-7xl font-normal mb-16 mx-auto leading-tight" 
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Love, and you shall<br/>find me.
        </motion.h2>

        <div className="max-w-4xl mx-auto flex flex-col @sm:flex-row gap-4 @sm:gap-8 justify-center items-center">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="w-full @sm:w-1/2 relative group">
            <div className="aspect-[3/4] overflow-hidden rounded-xl border-[6px] border-white shadow-lg">
              <MediaDisplay src={groomImage} alt="Groom" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="w-full @sm:w-1/2 relative group mt-8 @sm:mt-24">
            <div className="aspect-[3/4] overflow-hidden rounded-xl border-[6px] border-white shadow-lg">
              <MediaDisplay src={brideImage} alt="Bride" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* 4. FULL WIDTH GALLERY BREAK */}
      <section className="w-full h-[50vh] @sm:h-[70vh] overflow-hidden relative">
        <motion.div 
          initial={{ scale: 1.1 }} whileInView={{ scale: 1 }} transition={{ duration: 1.5 }} viewport={{ once: true }}
          className="w-full h-full"
        >
          <MediaDisplay src={dividerImage} alt="Divider" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-white text-4xl @sm:text-6xl font-normal drop-shadow-lg" style={{ fontFamily: "'Great Vibes', cursive" }}>Our Love Story</h2>
        </div>
      </section>

      {/* 5. RED THEMED CALENDAR */}
      <section className="py-24 px-6 bg-white relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="w-full max-w-sm mx-auto text-center"
        >
          <div className="mb-10 text-center">
            <h3 className="text-3xl font-bold text-[#222] uppercase tracking-[0.2em]">{dMonth}</h3>
            <p className="text-sm italic text-[#9e1b1b] mt-2">{dYear}</p>
          </div>
          
          <div className="grid grid-cols-7 gap-2 text-[10px] @sm:text-xs font-sans text-gray-400 mb-6 tracking-widest uppercase font-bold border-y border-gray-100 py-3">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={`day-${i}`}>{d}</div>)}
          </div>
          
          <div className="grid grid-cols-7 gap-y-6 gap-x-2 text-sm @sm:text-base font-sans font-medium text-gray-700">
            <div className="text-transparent">0</div>
            <div className="text-transparent">0</div>
            {calendarDays.map(day => (
              <div key={day} className="relative flex justify-center items-center h-8 w-8 mx-auto">
                {day.toString() === dDay ? (
                  <>
                    <motion.div 
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-[#9e1b1b] rounded-full shadow-lg z-0"
                    />
                    <span className="relative z-10 text-white font-bold">{day}</span>
                  </>
                ) : (
                  <span>{day}</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-xs uppercase tracking-widest text-gray-400 font-bold">
            {dDayOfWeek} <span className="text-[#9e1b1b] mx-2">♥</span> {weddingDate ? new Date(weddingDate).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) : "09:00"}
          </div>
        </motion.div>
      </section>

      {/* 6. RED BUTTONS RSVP FORM */}
      <section className="py-24 px-4 bg-gray-50 flex justify-center border-t border-gray-200 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full max-w-sm @sm:max-w-md bg-white p-10 @sm:p-12 rounded-[1rem] shadow-2xl border border-gray-100 relative overflow-hidden"
        >
          <div className="text-center mb-10">
            <h2 className="text-[#9e1b1b] text-4xl font-normal mb-2" style={{ fontFamily: "'Great Vibes', cursive" }}>R S V P</h2>
            <p className="text-xs text-gray-500 font-serif uppercase tracking-[0.2em] font-bold">Xác nhận tham dự</p>
          </div>

          {!rsvpSubmitted ? (
            <form onSubmit={handleRSVP} className="space-y-6 font-sans relative z-10">
              <input 
                type="text" required 
                value={rsvpName} onChange={e => setRsvpName(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-b-2 border-gray-200 focus:border-[#9e1b1b] focus:outline-none text-sm transition-all text-center text-[#222] placeholder:text-[10px] placeholder:uppercase placeholder:tracking-[0.15em] placeholder:text-gray-400" 
                placeholder="Tên của bạn" 
              />
              <input 
                type="tel" required 
                value={rsvpPhone} onChange={e => setRsvpPhone(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-b-2 border-gray-200 focus:border-[#9e1b1b] focus:outline-none text-sm transition-all text-center text-[#222] placeholder:text-[10px] placeholder:uppercase placeholder:tracking-[0.15em] placeholder:text-gray-400" 
                placeholder="Số điện thoại" 
              />
              
              <div className="mt-8 text-center pt-4">
                <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-4">Số lượng người tham dự</label>
                <div className="flex justify-center items-center gap-3">
                  {["1", "2", "3"].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRsvpCount(num)}
                      className={`w-12 h-12 rounded-sm text-sm font-bold transition-all shrink-0 border ${rsvpCount === num ? "bg-[#9e1b1b] text-white border-[#9e1b1b] shadow-lg" : "bg-white text-gray-600 border-gray-200 hover:border-[#9e1b1b]"}`}
                    >
                      {num}
                    </button>
                  ))}
                  <div className={`relative flex items-center shrink-0 ml-1 rounded-sm border transition-all ${!["1", "2", "3"].includes(rsvpCount) ? "bg-[#9e1b1b] border-[#9e1b1b] shadow-lg" : "bg-white border-gray-200"}`}>
                    <input 
                      type="number" min="4" max="100" placeholder="Khác"
                      value={["1", "2", "3"].includes(rsvpCount) ? "" : rsvpCount}
                      onChange={(e) => setRsvpCount(e.target.value)}
                      onFocus={() => { if(["1", "2", "3"].includes(rsvpCount)) setRsvpCount("") }}
                      className={`w-16 h-12 bg-transparent text-center text-sm font-bold focus:outline-none ${!["1", "2", "3"].includes(rsvpCount) ? "text-white placeholder:text-white/70" : "text-gray-600 placeholder:text-gray-400"}`}
                    />
                  </div>
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full py-4 mt-8 bg-[#9e1b1b] text-white text-[11px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-[#7a1515] transition-all shadow-[0_10px_20px_rgba(158,27,27,0.3)] active:scale-[0.98]"
              >
                GỬI PHẢN HỒI
              </button>
            </form>
          ) : (
            <div className="text-center py-12">
              <span className="text-5xl text-[#9e1b1b] mb-6 inline-block">♥</span>
              <h3 className="text-lg font-bold text-[#222] uppercase tracking-widest mt-2">Đã nhận phản hồi</h3>
              <p className="text-gray-500 text-sm mt-3 font-serif italic">Cảm ơn bạn rất nhiều!</p>
            </div>
          )}
        </motion.div>
      </section>

      {/* 7. LOCATION & MAP */}
      <section className="py-24 px-4 bg-white border-t border-gray-100">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto text-center"
        >
          <p className="text-[#9e1b1b] uppercase tracking-[0.3em] text-[10px] font-bold mb-4">Location</p>
          <h2 className="text-3xl @sm:text-4xl text-[#222] mb-8 font-bold tracking-widest uppercase">Wedding Venue</h2>
          
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="block relative group overflow-hidden rounded-xl shadow-lg border border-gray-200 mb-8">
            <MediaDisplay src={mapImage} alt="Map" className="w-full h-48 @sm:h-64 object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end items-center pb-6">
              <span className="bg-[#9e1b1b] text-white text-[10px] uppercase tracking-widest font-bold px-6 py-3 rounded-sm shadow-xl">XEM BẢN ĐỒ CHI TIẾT</span>
            </div>
          </a>
          
          <p className="text-xs @sm:text-sm text-gray-600 leading-loose font-sans font-medium uppercase tracking-[0.1em]">{eventAddress}</p>
        </motion.div>
      </section>

      {/* 8. FOOTER THANK YOU */}
      <section className="relative h-[600px] @sm:h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        <MediaDisplay src={footerImage} alt="Footer" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }} viewport={{ once: true }}
          className="relative z-10 text-center text-white p-8"
        >
          <h2 className="text-6xl @sm:text-8xl font-normal mb-6 drop-shadow-xl" style={{ fontFamily: "'Great Vibes', cursive" }}>Thank You</h2>
          <p className="text-[10px] @sm:text-xs uppercase tracking-[0.4em] font-bold text-white/80 border-t border-white/30 pt-6">Hẹn gặp lại bạn sớm nhé</p>
        </motion.div>
      </section>
    </div>
  );
}
