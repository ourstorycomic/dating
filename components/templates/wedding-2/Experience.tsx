"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { MediaDisplay } from "@/components/ui/MediaDisplay";

export function WeddingTwoExperience({
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

  const yHero = useTransform(scrollYProgress, [0, 0.3], [0, 200]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div
      ref={containerRef}
      className={`@container relative w-full h-full bg-[#faf9f5] text-[#3a3532] scroll-smooth ${autoPlay ? "overflow-hidden pointer-events-none select-none" : !isOpened ? "overflow-hidden select-none" : "overflow-x-hidden overflow-y-auto"} ${compact ? "rounded-[2.5rem]" : ""}`}
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
              className="absolute inset-y-0 left-0 w-1/2 z-[100] bg-gradient-to-b from-[#fff0f5] to-[#ffe4e1] border-r border-white/60 shadow-[5px_0_15px_rgba(0,0,0,0.05)] pointer-events-none overflow-hidden"
            >
              <div className="absolute right-0 bottom-0 w-[80vw] h-[40vh] bg-white rounded-full blur-[2px] opacity-60 translate-x-[20%] translate-y-[30%]" />
              <div className="absolute right-0 top-[20%] w-[50vw] h-[30vh] bg-white rounded-full blur-[1px] opacity-70 translate-x-[30%]" />
              <div className="absolute right-0 bottom-[30%] w-[60vw] h-[40vh] bg-white rounded-full blur-[2px] opacity-80 translate-x-[40%]" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[50%] w-48 h-32 z-20" style={{ clipPath: "inset(0 50% 0 0)" }}>
                 <div className="w-full h-full bg-white rounded-[50px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] border-[3px] border-[#fde5e5] flex items-center justify-center">
                    <span className="text-[#e2a8a8] text-3xl font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>Love</span>
                 </div>
              </div>
            </motion.div>
            
            <motion.div
              key="door-right"
              initial={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 right-0 w-1/2 z-[100] bg-gradient-to-b from-[#fff0f5] to-[#ffe4e1] border-l border-white/60 shadow-[-5px_0_15px_rgba(0,0,0,0.05)] pointer-events-none overflow-hidden"
            >
              <div className="absolute left-0 bottom-0 w-[80vw] h-[40vh] bg-white rounded-full blur-[2px] opacity-60 -translate-x-[20%] translate-y-[30%]" />
              <div className="absolute left-0 top-[20%] w-[50vw] h-[30vh] bg-white rounded-full blur-[1px] opacity-70 -translate-x-[30%]" />
              <div className="absolute left-0 bottom-[30%] w-[60vw] h-[40vh] bg-white rounded-full blur-[2px] opacity-80 -translate-x-[40%]" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[50%] w-48 h-32 z-20" style={{ clipPath: "inset(0 0 0 50%)" }}>
                 <div className="w-full h-full bg-white rounded-[50px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] border-[3px] border-[#fde5e5] flex items-center justify-center">
                    <span className="text-[#e2a8a8] text-3xl font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>Love</span>
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
              <div className="relative z-10 flex flex-col items-center px-6 text-center">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#c7b087] mb-6 font-bold">The Wedding Of</p>
                <h1 className="text-5xl @sm:text-6xl font-normal text-[#3a3532] mb-2" style={{ fontFamily: "'Dancing Script', cursive" }}>{brideName}</h1>
                <span className="text-2xl text-[#d8c3a5] font-light italic my-1" style={{ fontFamily: "'Dancing Script', cursive" }}>&amp;</span>
                <h1 className="text-5xl @sm:text-6xl font-normal text-[#3a3532] mt-2" style={{ fontFamily: "'Dancing Script', cursive" }}>{groomName}</h1>
                
                <motion.div 
                  animate={{ scale: [1, 1.15, 1], boxShadow: ["0 0 0 0 rgba(199,176,135,0.4)", "0 0 0 20px rgba(199,176,135,0)", "0 0 0 0 rgba(199,176,135,0)"] }} 
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="mt-16 bg-white border border-[#c7b087] text-[#c7b087] rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </motion.div>
                <p className="mt-4 text-[9px] uppercase tracking-[0.2em] font-bold text-[#c7b087]">Mở thiệp mời</p>
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
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/60 backdrop-blur-md border border-[#f0eadd] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-transform active:scale-95 pointer-events-auto"
        >
          {isPlaying ? (
             <svg className="w-4 h-4 text-[#c7b087] animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
          ) : (
             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>
          )}
        </button>
      )}

      {/* 1. HERO SECTION (Parallax Full Screen) */}
      <section className="relative h-[90vh] @sm:h-[100vh] w-full overflow-hidden flex items-end justify-center pb-20 @sm:pb-32 bg-black">
        <motion.div style={{ y: yHero }} className="absolute inset-0 z-0 origin-top">
          <MediaDisplay src={heroImage} alt="Hero" className="w-full h-[120%] object-cover object-center opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1815]/90 via-[#1a1815]/30 to-transparent" />
        </motion.div>
        
        <motion.div 
          style={{ opacity: opacityHero }}
          className="relative z-10 text-center w-full px-6 flex flex-col items-center"
        >
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }}>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#e8dfcf] mb-4 font-bold">The Wedding</p>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
            className="text-6xl @sm:text-8xl font-bold text-[#fdfbf7] leading-[0.9] tracking-tight mb-2 drop-shadow-xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our Love<br/>
            <span className="text-[#d4ba8a]">Begins</span>
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }} className="mt-8">
             <div className="w-[1px] h-16 bg-gradient-to-b from-[#d4ba8a] to-transparent animate-pulse mx-auto" />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. LETTER & FAMILIES */}
      <section className="py-24 px-6 relative z-10 bg-[#faf9f5] border-t-4 border-[#d4ba8a]">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-100px" }} className="text-center max-w-2xl mx-auto">
          <p className="text-[#c7b087] uppercase tracking-[0.3em] text-[10px] @sm:text-xs font-bold mb-8">Invitation</p>
          <p className="text-sm @sm:text-base leading-loose italic text-gray-600 px-4">"{letterText}"</p>
          
          <div className="my-14 flex flex-col items-center justify-center opacity-60">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c7b087" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            <div className="w-[100px] border-t border-dashed border-[#c7b087] mt-4"></div>
          </div>

          <div className="flex justify-between text-xs @sm:text-sm tracking-widest text-[#5a504a]">
            <div className="text-left w-1/2 pr-6 border-r border-[#e8dfcf]">
              <span className="block text-[9px] uppercase text-[#c7b087] mb-3 font-bold tracking-[0.2em]">Nhà Trai</span>
              <span className="whitespace-pre-wrap leading-loose font-medium text-gray-500">{groomFamily}</span>
            </div>
            <div className="text-right w-1/2 pl-6">
              <span className="block text-[9px] uppercase text-[#c7b087] mb-3 font-bold tracking-[0.2em]">Nhà Gái</span>
              <span className="whitespace-pre-wrap leading-loose font-medium text-gray-500">{brideFamily}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. STAGGERED PORTRAITS */}
      <section className="py-20 px-4 bg-[#f4f1ea] overflow-hidden">
        <div className="max-w-4xl mx-auto flex gap-4 @sm:gap-10 justify-center items-end">
          <motion.div initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }} className="w-[45%] relative group">
            <div className="aspect-[2/3] overflow-hidden rounded-t-[6rem] rounded-b-2xl border-[8px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative z-10">
              <MediaDisplay src={groomImage} alt="Groom" className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
            </div>
            <div className="mt-8 text-center relative z-20">
              <h3 className="text-3xl @sm:text-4xl text-[#5a504a]" style={{ fontFamily: "'Dancing Script', cursive" }}>{groomName}</h3>
              <p className="text-[9px] uppercase tracking-[0.3em] text-[#c7b087] font-bold mt-2">Chú rể</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 150 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, delay: 0.2 }} className="w-[45%] relative group pb-16">
            <div className="aspect-[2/3] overflow-hidden rounded-b-[6rem] rounded-t-2xl border-[8px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative z-10">
              <MediaDisplay src={brideImage} alt="Bride" className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
            </div>
            <div className="mt-8 text-center relative z-20">
              <h3 className="text-3xl @sm:text-4xl text-[#5a504a]" style={{ fontFamily: "'Dancing Script', cursive" }}>{brideName}</h3>
              <p className="text-[9px] uppercase tracking-[0.3em] text-[#c7b087] font-bold mt-2">Cô dâu</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. ELEGANT GALLERY */}
      <section className="py-24 px-4 bg-[#faf9f5]">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-[#c7b087] uppercase tracking-[0.3em] text-[10px] font-bold mb-2">Our Memories</p>
          <h2 className="text-4xl @sm:text-5xl text-[#5a504a]" style={{ fontFamily: "'Dancing Script', cursive" }}>Gallery</h2>
        </motion.div>
        
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="w-full aspect-[4/3] @sm:aspect-[16/9] overflow-hidden rounded-2xl border-4 border-white shadow-lg relative group">
             <MediaDisplay src={dividerImage} alt="Gallery 1" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          </motion.div>
          <div className="flex gap-4 w-full">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="w-1/2 aspect-[3/4] overflow-hidden rounded-2xl border-4 border-white shadow-lg group">
               <MediaDisplay src={footerImage} alt="Gallery 2" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="w-1/2 aspect-[3/4] overflow-hidden rounded-2xl border-4 border-[#e8dfcf] shadow-md bg-white flex flex-col items-center justify-center p-6 text-center">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c7b087" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
               <p className="text-[#c7b087] text-[10px] uppercase tracking-[0.2em] font-bold mb-3">Moments</p>
               <p className="text-xs font-light text-gray-500 italic leading-relaxed">"Tình yêu không phải là nhìn nhau, mà là cùng nhìn về một hướng."</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. SAVE THE DATE & CALENDAR */}
      <section className="py-24 px-6 bg-white relative border-y border-[#f0eadd]">
        <div className="absolute top-0 left-0 w-32 h-32 opacity-20 -translate-x-16 -translate-y-16">
          <svg viewBox="0 0 100 100" fill="#d4ba8a"><path d="M50 0 L100 50 L50 100 L0 50 Z" /></svg>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="w-full max-w-sm mx-auto text-center relative z-10"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-[#c7b087] mb-4 font-bold">Save the Date</p>
          <div className="text-5xl @sm:text-6xl font-light text-[#5a504a] mb-2 font-sans tracking-tight">
             {dDay}.{dMonth.replace(/\D/g,'')}.{dYear}
          </div>
          <p className="text-sm italic text-gray-400 mb-12">{dDayOfWeek}</p>
          
          <div className="grid grid-cols-7 gap-2 text-[10px] @sm:text-xs font-sans text-[#c7b087] mb-6 tracking-widest uppercase font-bold">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={`day-${i}`}>{d}</div>)}
          </div>
          
          <div className="grid grid-cols-7 gap-y-6 gap-x-2 text-sm @sm:text-base font-sans font-medium text-gray-500">
            <div className="text-transparent">0</div>
            <div className="text-transparent">0</div>
            {calendarDays.map(day => (
              <div key={day} className="relative flex justify-center items-center h-8 w-8 mx-auto">
                {day.toString() === dDay ? (
                  <>
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute text-4xl text-[#d4ba8a] z-0 opacity-30"
                    >
                      ♥
                    </motion.div>
                    <span className="relative z-10 text-white bg-[#c7b087] w-7 h-7 flex items-center justify-center rounded-full shadow-md font-bold">{day}</span>
                  </>
                ) : (
                  <span>{day}</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 6. LOCATION */}
      <section className="py-24 px-4 bg-[#faf9f5]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto text-center"
        >
          <p className="text-[#c7b087] uppercase tracking-[0.3em] text-[10px] font-bold mb-4">Location</p>
          <h2 className="text-3xl @sm:text-4xl text-[#5a504a] mb-8" style={{ fontFamily: "'Dancing Script', cursive" }}>Wedding Venue</h2>
          
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="block relative group overflow-hidden rounded-[2rem] shadow-lg border-[6px] border-white mb-8">
            <MediaDisplay src={mapImage} alt="Map" className="w-full h-48 @sm:h-56 object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end items-center pb-6">
              <span className="bg-white text-[#5a504a] text-[10px] uppercase tracking-widest font-bold px-6 py-3 rounded-full shadow-xl">Xem Google Map</span>
            </div>
          </a>
          
          <p className="text-xs @sm:text-sm text-gray-500 leading-loose font-sans uppercase tracking-[0.1em]">{eventAddress}</p>
        </motion.div>
      </section>

      {/* 7. RSVP FORM */}
      <section className="py-24 px-4 bg-white flex justify-center border-t border-[#f0eadd]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full max-w-sm @sm:max-w-md bg-[#faf9f5] p-10 @sm:p-12 rounded-[2.5rem] shadow-xl border border-[#e8dfcf] relative overflow-hidden"
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#5a504a] uppercase tracking-[0.2em] mb-3">Xác nhận<br/>Tham dự</h2>
            <p className="text-xs text-gray-500 font-serif italic">Sự hiện diện của bạn là niềm vinh hạnh cho chúng tôi.</p>
          </div>

          {!rsvpSubmitted ? (
            <form onSubmit={handleRSVP} className="space-y-5 font-sans relative z-10">
              <input 
                type="text" required 
                value={rsvpName} onChange={e => setRsvpName(e.target.value)}
                className="w-full px-5 py-4 bg-white border border-[#e8dfcf] rounded-xl focus:border-[#c7b087] focus:ring-1 focus:ring-[#c7b087] focus:outline-none text-sm transition-all text-center text-[#5a504a] placeholder:text-[10px] placeholder:uppercase placeholder:tracking-[0.15em] placeholder:text-gray-400 shadow-sm" 
                placeholder="Tên của bạn" 
              />
              <input 
                type="tel" required 
                value={rsvpPhone} onChange={e => setRsvpPhone(e.target.value)}
                className="w-full px-5 py-4 bg-white border border-[#e8dfcf] rounded-xl focus:border-[#c7b087] focus:ring-1 focus:ring-[#c7b087] focus:outline-none text-sm transition-all text-center text-[#5a504a] placeholder:text-[10px] placeholder:uppercase placeholder:tracking-[0.15em] placeholder:text-gray-400 shadow-sm" 
                placeholder="Số điện thoại" 
              />
              
              <div className="mt-8 text-center bg-white p-4 rounded-xl border border-[#e8dfcf] shadow-sm">
                <label className="block text-[9px] font-bold text-[#c7b087] uppercase tracking-widest mb-4">Số lượng người tham dự</label>
                <div className="flex justify-center items-center gap-2">
                  {["1", "2", "3"].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRsvpCount(num)}
                      className={`w-10 h-10 rounded-full text-sm font-bold transition-all shrink-0 ${rsvpCount === num ? "bg-[#c7b087] text-white shadow-md scale-110" : "bg-[#f4f1ea] text-gray-500 hover:bg-[#e8dfcf]"}`}
                    >
                      {num}
                    </button>
                  ))}
                  <div className={`relative flex items-center shrink-0 ml-2 rounded-full transition-all ${!["1", "2", "3"].includes(rsvpCount) ? "bg-[#c7b087] shadow-md scale-110" : "bg-[#f4f1ea]"}`}>
                    <input 
                      type="number" min="4" max="100" placeholder="Khác"
                      value={["1", "2", "3"].includes(rsvpCount) ? "" : rsvpCount}
                      onChange={(e) => setRsvpCount(e.target.value)}
                      onFocus={() => { if(["1", "2", "3"].includes(rsvpCount)) setRsvpCount("") }}
                      className={`w-14 h-10 bg-transparent text-center text-sm font-bold focus:outline-none rounded-full ${!["1", "2", "3"].includes(rsvpCount) ? "text-white placeholder:text-white/70" : "text-gray-500 placeholder:text-gray-400"}`}
                    />
                  </div>
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full py-4 mt-8 bg-[#3a3532] text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#1a1815] transition-all shadow-lg active:scale-[0.98]"
              >
                Gửi Hồi Đáp
              </button>
            </form>
          ) : (
            <div className="text-center py-12">
              <span className="text-5xl text-[#c7b087] mb-6 inline-block">♥</span>
              <h3 className="text-lg font-bold text-[#5a504a] uppercase tracking-widest mt-2">Đã nhận phản hồi</h3>
              <p className="text-gray-500 text-sm mt-3 font-serif italic">Cảm ơn bạn rất nhiều!</p>
            </div>
          )}
        </motion.div>
      </section>

      {/* 8. COUNTDOWN */}
      <section className="py-24 px-4 bg-[#1a1815] text-white text-center">
        <h2 className="text-[#c7b087] text-[10px] uppercase tracking-[0.4em] font-bold mb-12">Countdown</h2>
        
        <div className="flex gap-4 @sm:gap-8 justify-center font-sans max-w-md mx-auto">
          {[
            { label: 'Ngày', value: days },
            { label: 'Giờ', value: hours },
            { label: 'Phút', value: minutes },
            { label: 'Giây', value: seconds }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-14 h-16 @sm:w-20 @sm:h-24 bg-[#26231f] border border-[#3e3933] flex items-center justify-center text-2xl @sm:text-4xl font-light text-[#fdfbf7] rounded-lg shadow-xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1/2 bg-white/5 border-b border-black/20" />
                {item.value}
              </div>
              <span className="text-[9px] @sm:text-[10px] uppercase tracking-[0.2em] mt-4 text-[#c7b087] font-bold">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
