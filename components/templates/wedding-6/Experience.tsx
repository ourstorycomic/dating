"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { MediaDisplay } from "@/components/ui/MediaDisplay";

export function WeddingSixExperience({
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
  footerImage = "/assets/lovepics/6.jpg",
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
  const [isOpened, setIsOpened] = useState(autoPlay || isBuilderPreview || compact);

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
      className={`@container relative w-full h-full bg-white text-[#333] scroll-smooth ${autoPlay ? "overflow-hidden pointer-events-none select-none" : !isOpened ? "overflow-hidden select-none" : "overflow-x-hidden overflow-y-auto"} ${compact ? "rounded-[2.5rem]" : ""}`}
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {/* Intro Traditional Screen */}
      <AnimatePresence>
        {!isOpened && (
          <>
            <motion.div
              key="door-left"
              initial={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 w-1/2 z-[100] bg-[#c62828] border-r-8 border-[#d4af37] shadow-[10px_0_30px_rgba(0,0,0,0.5)] pointer-events-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-30 mix-blend-multiply" />
              <div className="absolute right-4 top-12 bottom-12 flex flex-col justify-between z-10">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-[#ffe55c] via-[#d4af37] to-[#8a6d1c] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),0_3px_5px_rgba(0,0,0,0.6)]" />
                ))}
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[50%] w-48 h-48 bg-gradient-to-br from-[#ffe55c] via-[#d4af37] to-[#8a6d1c] rounded-full border-[6px] border-[#8a6d1c] shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center z-20" style={{ clipPath: "inset(0 50% 0 0)" }}>
                <span className="text-[90px] font-bold text-[#8a0000] drop-shadow-md" style={{ fontFamily: "SimSun, serif" }}>囍</span>
              </div>
            </motion.div>
            
            <motion.div
              key="door-right"
              initial={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 right-0 w-1/2 z-[100] bg-[#c62828] border-l-8 border-[#d4af37] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] pointer-events-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-30 mix-blend-multiply" />
              <div className="absolute left-4 top-12 bottom-12 flex flex-col justify-between z-10">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-[#ffe55c] via-[#d4af37] to-[#8a6d1c] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),0_3px_5px_rgba(0,0,0,0.6)]" />
                ))}
              </div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[50%] w-48 h-48 bg-gradient-to-br from-[#ffe55c] via-[#d4af37] to-[#8a6d1c] rounded-full border-[6px] border-[#8a6d1c] shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center z-20" style={{ clipPath: "inset(0 0 0 50%)" }}>
                <span className="text-[90px] font-bold text-[#8a0000] drop-shadow-md" style={{ fontFamily: "SimSun, serif" }}>囍</span>
              </div>
            </motion.div>

            <motion.div
              key="content"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 z-[101] flex flex-col items-center justify-center cursor-pointer pointer-events-auto bg-transparent overflow-hidden text-white"
              onClick={() => {
                setIsOpened(true);
                if (audioRef.current && !isPlaying) {
                  audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
                }
              }}
            >
              <div className="relative z-10 flex flex-col items-center px-6 text-center w-full max-w-sm mt-32">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] mb-8 font-bold drop-shadow-md bg-black/40 px-4 py-1 rounded-full">Thân Mời</p>
                
                <h1 className="text-5xl @sm:text-6xl font-bold text-[#fdfbf7] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] mb-2 tracking-wider" style={{ fontFamily: "'Dancing Script', cursive" }}>{brideName}</h1>
                <span className="text-3xl text-[#d4af37] font-light italic my-2 drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]" style={{ fontFamily: "'Dancing Script', cursive" }}>&amp;</span>
                <h1 className="text-5xl @sm:text-6xl font-bold text-[#fdfbf7] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] mt-2 tracking-wider" style={{ fontFamily: "'Dancing Script', cursive" }}>{groomName}</h1>
                
                <motion.p 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mt-20 text-[10px] uppercase tracking-[0.3em] font-bold text-[#d4af37] border-b border-[#d4af37] pb-1 drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] bg-black/40 px-4 rounded-full"
                >
                  Chạm để mở thiệp
                </motion.p>
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
          className="fixed top-4 right-4 z-50 w-10 h-10 bg-white/90 backdrop-blur-md border border-[#c62828]/20 rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(198,40,40,0.2)] transition-transform active:scale-95 pointer-events-auto"
        >
          {isPlaying ? (
             <svg className="w-4 h-4 text-[#c62828] animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
          ) : (
             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>
          )}
        </button>
      )}

      {/* 1. HERO SECTION */}
      <section className="relative w-full pb-12 flex flex-col items-center justify-start bg-white">
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="w-full relative">
          <MediaDisplay src={heroImage} alt="Hero" className="w-full aspect-[3/4] @sm:aspect-[16/9] object-cover" />
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
          className="text-center w-full px-6 flex flex-col items-center -mt-16 relative z-10 bg-white"
        >
          <div className="bg-white p-2 rounded-full mb-4 shadow-sm">
            <span className="text-4xl text-[#c62828]" style={{ fontFamily: "SimSun, serif" }}>囍</span>
          </div>
          <p className="text-[#d4af37] text-[10px] uppercase tracking-[0.4em] font-bold mb-4 font-sans border-t border-b border-[#d4af37] py-2 px-6">Wedding Invitation</p>
          <div className="flex flex-col items-center gap-2 text-[#c62828] font-bold text-4xl @sm:text-5xl mt-2 tracking-wider">
            <span>{groomName}</span>
            <span className="text-[#d4af37] text-2xl font-light italic" style={{ fontFamily: "'Dancing Script', cursive" }}>&amp;</span>
            <span>{brideName}</span>
          </div>
        </motion.div>
      </section>

      {/* 2. INVITATION LETTER */}
      <section className="py-12 px-6 relative z-10 bg-white text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true, margin: "0px" }} className="max-w-xl mx-auto border-[1px] border-[#c62828]/20 p-8 relative">
          
          {/* Corner ornaments */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#c62828]" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#c62828]" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#c62828]" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#c62828]" />

          <h2 className="text-[#c62828] text-3xl font-bold tracking-widest mb-6">TRÂN TRỌNG KÍNH MỜI</h2>
          
          <p className="text-sm leading-loose text-gray-700 px-2 mb-8">
            "{letterText}"
          </p>

          <div className="flex justify-between text-xs tracking-widest text-[#333] mb-8">
            <div className="text-center w-1/2 px-2 border-r border-[#d4af37]/50">
              <span className="block text-[10px] uppercase text-[#d4af37] mb-2 font-bold tracking-[0.2em]">Nhà Trai</span>
              <span className="whitespace-pre-wrap leading-relaxed font-bold text-[#c62828]">{groomFamily}</span>
            </div>
            <div className="text-center w-1/2 px-2">
              <span className="block text-[10px] uppercase text-[#d4af37] mb-2 font-bold tracking-[0.2em]">Nhà Gái</span>
              <span className="whitespace-pre-wrap leading-relaxed font-bold text-[#c62828]">{brideFamily}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-[#c62828] font-bold text-2xl mb-1">{dDay} . {dMonth.replace(/\D/g,'')} . {dYear}</p>
            <p className="text-[#d4af37] uppercase tracking-[0.2em] text-[10px] font-bold">Vào lúc {dTime}, {dDayOfWeek}</p>
          </div>
        </motion.div>
      </section>

      {/* 3. GALLERY / OUR STORY */}
      <section className="py-16 bg-[#fafafa]">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <span className="text-3xl text-[#c62828]" style={{ fontFamily: "SimSun, serif" }}>囍</span>
          <h2 className="text-3xl text-[#c62828] font-bold tracking-widest mt-4">KHOẢNH KHẮC</h2>
        </motion.div>
        
        <div className="max-w-md mx-auto space-y-4 px-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="w-full aspect-[4/5] bg-white p-2 shadow-sm border border-gray-200">
             <MediaDisplay src={groomImage} alt="Gallery 1" className="w-full h-full object-cover" />
          </motion.div>
          
          <div className="flex gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-1/2 aspect-[3/4] bg-white p-2 shadow-sm border border-gray-200">
               <MediaDisplay src={brideImage} alt="Gallery 2" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-1/2 aspect-[3/4] bg-white p-2 shadow-sm border border-gray-200">
               <MediaDisplay src={footerImage} alt="Gallery 3" className="w-full h-full object-cover" />
            </motion.div>
          </div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full aspect-video bg-white p-2 shadow-sm border border-gray-200">
             <MediaDisplay src={dividerImage} alt="Gallery 4" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </section>

      {/* 4. RED THEMED CALENDAR */}
      <section className="w-full bg-[#c62828] text-white py-20 px-6 relative overflow-hidden">
        {/* Large faint symbol */}
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] text-[#b71c1c] font-bold opacity-30 pointer-events-none" style={{ fontFamily: "SimSun, serif" }}>囍</span>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="w-full max-w-sm mx-auto text-center relative z-10 bg-white p-8 shadow-2xl"
        >
          <div className="mb-8 text-center border-b-[2px] border-[#c62828] pb-4">
            <h3 className="text-3xl font-bold text-[#c62828] tracking-widest uppercase">{dMonth}</h3>
            <p className="text-sm font-bold tracking-widest uppercase text-[#d4af37] mt-2">{dYear}</p>
          </div>
          
          <div className="grid grid-cols-7 gap-2 text-[10px] @sm:text-xs font-sans text-gray-400 mb-6 tracking-widest uppercase font-bold">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={`day-${i}`}>{d}</div>)}
          </div>
          
          <div className="grid grid-cols-7 gap-y-6 gap-x-2 text-sm @sm:text-base font-sans font-bold text-[#333]">
            <div className="text-transparent">0</div>
            <div className="text-transparent">0</div>
            {calendarDays.map(day => (
              <div key={day} className="relative flex justify-center items-center h-8 w-8 mx-auto">
                {day.toString() === dDay ? (
                  <>
                    <motion.div 
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-[#c62828] shadow-md z-0"
                    />
                    <span className="relative z-10 text-white font-bold">{day}</span>
                  </>
                ) : (
                  <span>{day}</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 5. TIMELINE & ADDRESS */}
      <section className="py-16 px-4 bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16">
            <h3 className="text-[#c62828] text-2xl font-bold tracking-widest mb-6 border-y-[1px] border-[#d4af37] py-2 inline-block">ĐỊA ĐIỂM TỔ CHỨC</h3>
            <p className="text-[#333] text-lg font-bold mb-4 uppercase">Nhà Hàng Tiệc Cưới</p>
            <p className="text-gray-600 text-xs font-medium leading-loose px-4 mb-8 uppercase tracking-[0.1em]">{eventAddress}</p>
            
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="block relative group overflow-hidden shadow-lg border-2 border-white mb-8">
              <MediaDisplay src={mapImage} alt="Map" className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-[#c62828]/80 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-[10px] uppercase font-bold tracking-widest border border-white px-6 py-2">XEM BẢN ĐỒ CHI TIẾT</span>
              </div>
            </a>
          </motion.div>
          
          {/* Timeline */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h3 className="text-[#c62828] text-2xl font-bold tracking-widest mb-10 border-y-[1px] border-[#d4af37] py-2 inline-block">CHƯƠNG TRÌNH</h3>
            <div className="flex justify-between items-start px-4 relative">
              <div className="absolute top-4 left-10 right-10 h-[2px] bg-[#c62828]/20 z-0"></div>
              
              {[
                { time: "09:00", label: "Đón Khách", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> },
                { time: "10:30", label: "Lễ Cưới", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="5"></circle><circle cx="15" cy="12" r="5"></circle></svg> },
                { time: "11:30", label: "Khai Tiệc", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 15v6M12 15s5.5-4 5.5-9v-1a2 2 0 0 0-2-2H8.5a2 2 0 0 0-2 2v1c0 5 5.5 9 5.5 9z"></path></svg> }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center relative z-10 w-1/3">
                  <div className="w-10 h-10 rounded-full bg-white border-[2px] border-[#c62828] text-[#c62828] flex items-center justify-center mb-3">
                    {item.icon}
                  </div>
                  <p className="text-[#c62828] font-bold font-sans text-sm">{item.time}</p>
                  <p className="text-gray-600 text-[9px] uppercase tracking-widest mt-1 font-bold">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. RSVP FORM */}
      <section className="py-20 px-4 bg-[#fafafa] flex justify-center relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full max-w-sm bg-white p-8 shadow-xl border border-gray-200 relative overflow-hidden"
        >
          <div className="text-center mb-8">
            <h2 className="text-[#c62828] text-2xl font-bold tracking-widest mb-2">XÁC NHẬN THAM DỰ</h2>
            <p className="text-[10px] text-gray-500 font-sans uppercase tracking-[0.2em] font-bold">Sự hiện diện của bạn là vinh hạnh cho chúng tôi</p>
          </div>

          {!rsvpSubmitted ? (
            <form onSubmit={handleRSVP} className="space-y-4 font-sans relative z-10">
              <div>
                <input 
                  type="text" required 
                  value={rsvpName} onChange={e => setRsvpName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#c62828] focus:ring-1 focus:ring-[#c62828] focus:outline-none text-sm transition-all text-[#333] placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest" 
                  placeholder="Họ & Tên" 
                />
              </div>
              
              <div>
                <input 
                  type="tel" required 
                  value={rsvpPhone} onChange={e => setRsvpPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#c62828] focus:ring-1 focus:ring-[#c62828] focus:outline-none text-sm transition-all text-[#333] placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest" 
                  placeholder="Số điện thoại" 
                />
              </div>
              
              <div className="mt-6 text-center">
                <label className="block text-[10px] font-bold text-[#c62828] uppercase tracking-widest mb-3">Số lượng tham dự</label>
                <div className="flex justify-center items-center gap-2">
                  {["1", "2", "3"].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRsvpCount(num)}
                      className={`w-10 h-10 text-sm font-bold transition-all shrink-0 border ${rsvpCount === num ? "bg-[#c62828] text-white border-[#c62828]" : "bg-white text-gray-500 border-gray-200 hover:border-[#c62828]"}`}
                    >
                      {num}
                    </button>
                  ))}
                  <div className={`relative flex items-center shrink-0 border transition-all ${!["1", "2", "3"].includes(rsvpCount) ? "bg-[#c62828] border-[#c62828]" : "bg-white border-gray-200"}`}>
                    <input 
                      type="number" min="4" max="100" placeholder="Khác"
                      value={["1", "2", "3"].includes(rsvpCount) ? "" : rsvpCount}
                      onChange={(e) => setRsvpCount(e.target.value)}
                      onFocus={() => { if(["1", "2", "3"].includes(rsvpCount)) setRsvpCount("") }}
                      className={`w-16 h-10 bg-transparent text-center text-sm font-bold focus:outline-none ${!["1", "2", "3"].includes(rsvpCount) ? "text-white placeholder:text-white/70" : "text-gray-500 placeholder:text-gray-400"}`}
                    />
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full py-4 mt-6 bg-[#c62828] text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#b71c1c] transition-all flex items-center justify-center gap-2"
              >
                GỬI PHẢN HỒI
              </button>
            </form>
          ) : (
            <div className="text-center py-10">
              <span className="text-5xl text-[#c62828] mb-4 inline-block" style={{ fontFamily: "SimSun, serif" }}>囍</span>
              <h3 className="text-sm font-bold text-[#c62828] uppercase tracking-widest mt-2">Đã nhận xác nhận</h3>
              <p className="text-gray-500 text-xs uppercase tracking-widest mt-3">Xin trân trọng cảm ơn</p>
            </div>
          )}
        </motion.div>
      </section>

      {/* 7. FOOTER THANK YOU */}
      <section className="py-24 px-4 bg-white text-center flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}
        >
          <div className="w-16 h-16 border-[2px] border-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl text-[#d4af37]" style={{ fontFamily: "SimSun, serif" }}>囍</span>
          </div>
          <h2 className="text-4xl text-[#c62828] font-bold tracking-widest uppercase mb-4">THANK YOU</h2>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-500 border-t border-gray-200 pt-6 mt-6">Cảm ơn vì đã là một phần của chúng tôi</p>
        </motion.div>
      </section>
    </div>
  );
}
