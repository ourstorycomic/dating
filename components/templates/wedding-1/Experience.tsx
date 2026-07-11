"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { MediaDisplay } from "@/components/ui/MediaDisplay";

export function WeddingOneExperience({
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

  return (
    <div
      ref={containerRef}
      className={`@container relative w-full h-full bg-[#fdfbf7] text-[#4a4a4a] scroll-smooth ${autoPlay ? "overflow-hidden pointer-events-none select-none" : !isOpened ? "overflow-hidden select-none" : "overflow-x-hidden overflow-y-auto"} ${compact ? "rounded-[2.5rem]" : ""}`}
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
              className="absolute inset-y-0 left-0 w-1/2 z-[100] bg-[#fdfbf7] shadow-[10px_0_20px_rgba(0,0,0,0.1)] pointer-events-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-60 mix-blend-multiply" />
              <div className="absolute inset-y-3 left-3 right-0 border-y-2 border-l-2 border-[#d8c3a5]/60 rounded-l-md" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[50%] w-[35vh] h-[35vh] border-[2px] border-[#d8c3a5] rounded-full flex items-center justify-center opacity-80 z-10" style={{ clipPath: "inset(0 50% 0 0)" }}>
                <div className="w-[85%] h-[85%] border-[1px] border-[#d8c3a5] rounded-full border-dashed" />
                <div className="absolute w-[70%] h-[70%] border-[2px] border-[#d8c3a5] rounded-full flex items-center justify-center">
                  <div className="w-[50%] h-[50%] bg-[#d8c3a5]/30 rounded-full border border-[#c3ad8c]" />
                </div>
              </div>
            </motion.div>
            
            <motion.div
              key="door-right"
              initial={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 right-0 w-1/2 z-[100] bg-[#fdfbf7] shadow-[-10px_0_20px_rgba(0,0,0,0.1)] pointer-events-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-60 mix-blend-multiply" />
              <div className="absolute inset-y-3 right-3 left-0 border-y-2 border-r-2 border-[#d8c3a5]/60 rounded-r-md" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[50%] w-[35vh] h-[35vh] border-[2px] border-[#d8c3a5] rounded-full flex items-center justify-center opacity-80 z-10" style={{ clipPath: "inset(0 0 0 50%)" }}>
                <div className="w-[85%] h-[85%] border-[1px] border-[#d8c3a5] rounded-full border-dashed" />
                <div className="absolute w-[70%] h-[70%] border-[2px] border-[#d8c3a5] rounded-full flex items-center justify-center">
                  <div className="w-[50%] h-[50%] bg-[#d8c3a5]/30 rounded-full border border-[#c3ad8c]" />
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
                <p className="text-xs uppercase tracking-[0.4em] text-[#a69680] mb-8">You are invited</p>
                <h1 className="text-5xl @sm:text-7xl font-bold text-[#3a3532] italic mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>{brideName}</h1>
                <span className="text-3xl text-[#d8c3a5] font-light italic" style={{ fontFamily: "'Dancing Script', cursive" }}>&amp;</span>
                <h1 className="text-5xl @sm:text-7xl font-bold text-[#3a3532] italic mt-4" style={{ fontFamily: "'Dancing Script', cursive" }}>{groomName}</h1>
                
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], boxShadow: ["0 0 0 0 rgba(216,195,165,0.7)", "0 0 0 15px rgba(216,195,165,0)", "0 0 0 0 rgba(216,195,165,0)"] }} 
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="mt-20 bg-[#d8c3a5] text-white rounded-full w-14 h-14 flex items-center justify-center"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21.5 5.5H2.5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h19a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5zM12 11.23L4.2 6.5h15.6L12 11.23z" /></svg>
                </motion.div>
                <p className="mt-6 text-[10px] uppercase tracking-[0.2em] font-bold text-[#a69680]">Chạm để mở lời mời</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Ambient Particles Layer */}
      {isMounted && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-multiply">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={`ambient-${i}`}
              className="absolute rounded-full bg-[#d8c3a5] shadow-[0_0_8px_rgba(216,195,165,0.6)]"
              style={{
                width: Math.random() * 3 + 1 + "px",
                height: Math.random() * 3 + 1 + "px",
                left: `${Math.random() * 100}vw`,
                top: -20,
              }}
              animate={{
                y: ["0vh", "110vh"],
                x: [`0vw`, `${(Math.random() - 0.5) * 20}vw`],
                opacity: [0, 0.6, 0.6, 0]
              }}
              transition={{
                duration: Math.random() * 15 + 15,
                repeat: Infinity,
                delay: Math.random() * 10,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}
        {/* Background Music */}
        {musicUrl && (
          <audio ref={audioRef} src={musicUrl} loop preload="auto" autoPlay={autoPlay} muted={compact && !autoPlay} />
        )}

      {/* Floating Music Toggle */}
      {!autoPlay && (
        <button 
          onClick={toggleAudio}
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 pointer-events-auto"
        >
          {isPlaying ? (
             <svg className="w-5 h-5 text-gray-700 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
          ) : (
             <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>
          )}
        </button>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[750px] @sm:min-h-[900px] flex flex-col items-center pt-16 pb-32 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
        
        {/* Floating Sparkles */}
        {isMounted && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full bg-[#d8c3a5] opacity-40 shadow-[0_0_10px_rgba(216,195,165,0.8)]"
                initial={{ x: `${Math.random() * 100}%`, y: "110%", scale: Math.random() * 0.5 + 0.5 }}
                animate={{ y: "-10%", x: `${Math.random() * 100}%`, opacity: [0, 1, 0] }}
                transition={{ duration: Math.random() * 12 + 8, repeat: Infinity, delay: Math.random() * 10, ease: "linear" }}
              />
            ))}
          </div>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative z-10 flex flex-col items-center w-full px-6"
        >
          <div className="mb-8 flex items-center justify-center gap-4 w-full opacity-60">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#8a7b66]"></div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8a7b66" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#8a7b66]"></div>
          </div>
          
          <p className="text-xs @sm:text-sm tracking-[0.5em] uppercase mb-10 text-[#8a7b66] font-medium">Save The Date</p>
          
          {/* Arched Image Frame */}
          <div className="relative w-full max-w-[320px] @sm:max-w-[380px] aspect-[3/4] mb-12 group">
             <div className="absolute -inset-3 border-[1px] border-[#d8c3a5]/40 rounded-t-[1000px] rounded-b-3xl"></div>
             <div className="absolute -inset-1.5 border-[1px] border-[#d8c3a5]/60 rounded-t-[1000px] rounded-b-3xl"></div>
             <div className="w-full h-full rounded-t-[1000px] rounded-b-3xl overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-4 ring-white">
                <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-full h-full">
                  <MediaDisplay src={heroImage} alt="Hero" className="w-full h-full object-cover object-center" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#3e3933]/40 via-transparent to-transparent mix-blend-multiply" />
             </div>
          </div>

          <h1 className="text-5xl @sm:text-7xl mb-2 font-bold text-[#3a3532] drop-shadow-sm" style={{ fontFamily: "'Dancing Script', cursive" }}>
            {brideName}
          </h1>
          <div className="flex items-center justify-center my-2 opacity-80">
            <span className="text-3xl @sm:text-4xl text-[#d8c3a5] mx-4 font-light italic" style={{ fontFamily: "'Dancing Script', cursive" }}>&amp;</span>
          </div>
          <h1 className="text-5xl @sm:text-7xl font-bold text-[#3a3532] drop-shadow-sm" style={{ fontFamily: "'Dancing Script', cursive" }}>
            {groomName}
          </h1>
          
          <div className="mt-12 text-center text-[#8a7b66] tracking-widest uppercase text-[10px] @sm:text-xs font-semibold">
            {weddingDate ? new Date(weddingDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "15 . 02 . 2025"}
          </div>
        </motion.div>
      </section>

      {/* Calendar Section */}
      <section className="py-16 @sm:py-24 px-6 bg-white relative z-10 -mt-10 @sm:-mt-20 rounded-t-[3rem] @sm:rounded-t-[4rem] shadow-[0_-10px_30px_rgba(0,0,0,0.03)] border-t border-gray-100 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="w-full max-w-sm text-center"
        >
          <div className="flex items-center justify-between mb-8 border-b border-[#eeeae3] pb-4">
            <h2 className="text-lg @sm:text-xl tracking-widest uppercase text-[#8a7b66] font-light">Our wedding day</h2>
            <h2 className="text-lg @sm:text-xl font-bold text-[#bfa993]">{dMonth} <span className="text-xs">♥</span></h2>
          </div>
          
          <div className="grid grid-cols-7 gap-2 text-xs @sm:text-sm font-sans text-gray-400 mb-4 tracking-widest uppercase">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={`day-${i}`} className="font-medium">{d}</div>)}
          </div>
          
          <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-sm @sm:text-base font-sans">
            {/* Blank spaces for first row based on day of week - simplified for template */}
            <div className="text-transparent">0</div>
            <div className="text-transparent">0</div>
            {calendarDays.map(day => (
              <div key={day} className="relative flex justify-center items-center h-8 w-8 mx-auto">
                {day.toString() === dDay ? (
                  <>
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute text-3xl text-[#d4af37] z-0 opacity-40"
                    >
                      ♥
                    </motion.div>
                    <span className="relative z-10 text-[#5a504a] font-bold">{day}</span>
                  </>
                ) : (
                  <span className="text-gray-500">{day}</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Couple Section */}
      <section className="py-16 bg-[#fdfbf7] relative">
         <div className="max-w-4xl mx-auto px-4 @sm:px-8 relative">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative w-[75%] @sm:w-[50%] ml-auto mb-16"
            >
              <div className="absolute -inset-4 border-[1.5px] border-[#d8c3a5] rounded-t-full z-0 translate-y-4 -translate-x-4"></div>
              <MediaDisplay src={brideImage} alt="Bride" className="w-full aspect-[3/4] object-cover rounded-t-full relative z-10 shadow-lg" />
              <div className="absolute -bottom-6 -left-6 @sm:-left-12 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-md z-20 border border-[#f0eadd]">
                <p className="text-[10px] text-[#8a7b66] uppercase tracking-widest mb-1 text-center">The Bride</p>
                <h3 className="text-2xl @sm:text-3xl font-bold text-[#5a504a]" style={{ fontFamily: "'Dancing Script', cursive" }}>{brideName}</h3>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative w-[75%] @sm:w-[50%] mr-auto"
            >
              <div className="absolute -inset-4 border-[1.5px] border-[#a5b5d8] rounded-t-full z-0 translate-y-4 translate-x-4"></div>
              <MediaDisplay src={groomImage} alt="Groom" className="w-full aspect-[3/4] object-cover rounded-t-full relative z-10 shadow-lg" />
              <div className="absolute -bottom-6 -right-6 @sm:-right-12 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-md z-20 border border-[#e8edf5] text-center">
                <p className="text-[10px] text-[#8a7b66] uppercase tracking-widest mb-1">The Groom</p>
                <h3 className="text-2xl @sm:text-3xl font-bold text-[#5a504a]" style={{ fontFamily: "'Dancing Script', cursive" }}>{groomName}</h3>
              </div>
            </motion.div>
         </div>
      </section>

      {/* Letter Section */}
      <section className="py-24 px-6 @sm:px-12 bg-white relative overflow-hidden flex justify-center">
        {/* Torn paper effect background */}
        <div className="absolute top-0 inset-x-0 h-4 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-30"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-xl w-full bg-[#faf7ef] p-10 @sm:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative rotate-1 @sm:rotate-2 transform border border-[#f0eadd]"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }}
        >
           <h2 className="text-3xl @sm:text-4xl text-center mb-8 text-[#bfa993]" style={{ fontFamily: "'Dancing Script', cursive" }}>Lời mời chân thành</h2>
           <div className="text-center text-sm @sm:text-base leading-relaxed text-gray-600 font-light italic border-l-[1.5px] border-[#d8c3a5] pl-6 @sm:pl-8 text-justify">
             {letterText.split('\n').map((line, i) => <p key={i} className="mb-5">{line}</p>)}
           </div>
        </motion.div>
      </section>

      {/* Event Details Section */}
      <section className="py-20 @sm:py-32 px-4 bg-[#fdfbf7]">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto border-y border-dashed border-[#d8c3a5] py-16 text-center"
        >
          <div className="flex justify-center gap-16 @sm:gap-32 mb-12">
            <div>
              <h3 className="font-semibold text-base @sm:text-lg mb-3 text-[#5a504a] uppercase tracking-widest">Nhà Trai</h3>
              <p className="text-xs @sm:text-sm text-gray-500 whitespace-pre-wrap leading-loose">{groomFamily}</p>
            </div>
            <div>
              <h3 className="font-semibold text-base @sm:text-lg mb-3 text-[#5a504a] uppercase tracking-widest">Nhà Gái</h3>
              <p className="text-xs @sm:text-sm text-gray-500 whitespace-pre-wrap leading-loose">{brideFamily}</p>
            </div>
          </div>

          <h1 className="text-5xl @sm:text-6xl mb-3 text-[#bfa993]" style={{ fontFamily: "'Dancing Script', cursive" }}>{brideName} &amp; {groomName}</h1>
          <p className="uppercase tracking-[0.2em] text-[10px] @sm:text-xs text-[#a69680] my-8 font-semibold">Trân trọng kính mời đến dự tiệc cưới</p>

          <div className="flex items-center justify-center gap-6 my-10">
            <span className="text-sm @sm:text-lg uppercase tracking-widest text-[#8a7b66] font-bold border-y border-[#8a7b66] py-2">{dMonth}</span>
            <span className="text-7xl @sm:text-8xl text-[#d8c3a5] font-sans font-light">{dDay}</span>
            <span className="text-sm @sm:text-lg uppercase tracking-widest text-[#8a7b66] font-bold border-y border-[#8a7b66] py-2">NĂM {dYear}</span>
          </div>

          <div className="text-xs @sm:text-sm text-gray-500 flex justify-center items-center gap-3 mt-6 font-medium tracking-widest uppercase">
            <span className="text-[#d8c3a5] text-xs">♥</span> {dDayOfWeek} <span className="text-[#d8c3a5] text-xs">♥</span>
          </div>

          <div className="mt-16 mx-auto max-w-sm px-6">
             <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="block relative group overflow-hidden rounded-2xl shadow-sm border-[6px] border-white">
                <MediaDisplay src={mapImage} alt="Map" className="w-full h-40 @sm:h-48 object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="bg-white/95 text-[#5a504a] text-[10px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-full shadow-lg backdrop-blur-md">Xem Bản Đồ</span>
                </div>
             </a>
             <p className="mt-6 text-xs @sm:text-sm text-gray-500 leading-loose font-sans uppercase tracking-wider">{eventAddress}</p>
          </div>
        </motion.div>
      </section>

      {/* Divider Image */}
      <section className="h-[400px] @sm:h-[60vh] relative">
        <MediaDisplay src={dividerImage} alt="Divider" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/10" />
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-6 bg-white">
        <h2 className="text-xl @sm:text-2xl text-center mb-16 text-[#bfa993] uppercase tracking-[0.3em]">Timeline</h2>
        <div className="max-w-md mx-auto relative border-l border-[#f0eadd] pl-10 ml-6 @sm:mx-auto @sm:ml-auto">
          {[
            { time: "10:30", label: "Đón khách", icon: "✨" },
            { time: "11:30", label: "Làm lễ", icon: "💍" },
            { time: "12:00", label: "Khai tiệc", icon: "🥂" },
            { time: "13:30", label: "Chụp ảnh", icon: "📸" },
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              className="mb-12 relative"
            >
              <div className="absolute -left-[51px] bg-white border-[3px] border-[#d8c3a5] w-5 h-5 rounded-full flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-[#bfa993] rounded-full"></div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-3xl opacity-80">{item.icon}</span>
                <div>
                  <h4 className="text-xl font-medium text-[#5a504a]">{item.time}</h4>
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-1">{item.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-24 px-4 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] bg-[#fdfbf7] flex justify-center border-t border-[#f0eadd] relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full max-w-sm @sm:max-w-md relative bg-white p-10 @sm:p-12 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-[8px] border-[#fdfbf7] ring-1 ring-[#e8dcc7]"
        >
          {/* Double inner border ornament */}
          <div className="absolute inset-2 border border-[#e8dcc7] rounded-[1.5rem] pointer-events-none opacity-60"></div>
          <div className="absolute inset-3 border border-[#f4efe8] rounded-[1.25rem] pointer-events-none opacity-80"></div>

          <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-60">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#bdae9c" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" />
              <rect x="3" y="5" width="18" height="14" rx="2" />
            </svg>
          </div>
          
          <div className="text-center mb-10 mt-12">
            <h2 className="text-2xl font-bold mt-2 text-[#5a504a] uppercase tracking-[0.2em]">Xác nhận<br/>Tham dự</h2>
            <p className="text-sm text-gray-500 mt-4 font-serif italic capitalize leading-relaxed px-2">Sự hiện diện của bạn là niềm vinh hạnh cho gia đình.</p>
          </div>

          {!rsvpSubmitted ? (
            <form onSubmit={handleRSVP} className="space-y-4 font-sans relative z-10">
              <div>
                <input 
                  type="text" required 
                  value={rsvpName} onChange={e => setRsvpName(e.target.value)}
                  className="w-full px-5 py-3.5 bg-[#faf8f5] border border-[#e8dcc7] rounded-xl focus:border-[#d8c3a5] focus:ring-1 focus:ring-[#d8c3a5] focus:outline-none text-sm transition-all text-center text-[#5a504a] placeholder:text-[10px] placeholder:uppercase placeholder:tracking-[0.15em] placeholder:text-gray-400" 
                  placeholder="Tên của bạn" 
                />
              </div>
              <div>
                <input 
                  type="tel" required 
                  value={rsvpPhone} onChange={e => setRsvpPhone(e.target.value)}
                  className="w-full px-5 py-3.5 bg-[#faf8f5] border border-[#e8dcc7] rounded-xl focus:border-[#d8c3a5] focus:ring-1 focus:ring-[#d8c3a5] focus:outline-none text-sm transition-all text-center text-[#5a504a] placeholder:text-[10px] placeholder:uppercase placeholder:tracking-[0.15em] placeholder:text-gray-400" 
                  placeholder="Số điện thoại" 
                />
              </div>
              <div className="mt-6 text-center">
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Số lượng người tham dự</label>
                <div className="inline-flex items-center rounded-full border border-[#e8dcc7] p-1 bg-[#faf8f5]">
                  {["1", "2", "3"].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRsvpCount(num)}
                      className={`w-10 h-10 rounded-full text-xs font-bold transition-colors shrink-0 ${rsvpCount === num ? "bg-[#d8c3a5] text-white shadow-sm" : "text-gray-400 hover:bg-[#f0eadd]"}`}
                    >
                      {num}
                    </button>
                  ))}
                  <div className={`relative flex items-center shrink-0 ml-1 rounded-full transition-colors ${!["1", "2", "3"].includes(rsvpCount) ? "bg-[#d8c3a5] shadow-sm" : "bg-transparent"}`}>
                    <input 
                      type="number"
                      min="4"
                      max="100"
                      placeholder="Khác"
                      value={["1", "2", "3"].includes(rsvpCount) ? "" : rsvpCount}
                      onChange={(e) => setRsvpCount(e.target.value)}
                      onFocus={() => { if(["1", "2", "3"].includes(rsvpCount)) setRsvpCount("") }}
                      className={`w-14 h-10 bg-transparent text-center text-xs font-bold focus:outline-none rounded-full ${!["1", "2", "3"].includes(rsvpCount) ? "text-white placeholder:text-white/70" : "text-gray-400 placeholder:text-gray-400 hover:bg-[#f0eadd]"}`}
                    />
                  </div>
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full py-4 mt-6 bg-[#d8c3a5] text-[#333333] text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#e4d1b6] transition-all shadow-[0_4px_15px_rgba(216,195,165,0.4)] hover:shadow-[0_6px_20px_rgba(216,195,165,0.6)] active:scale-[0.98]"
              >
                Gửi Xác Nhận
              </button>
            </form>
          ) : (
            <div className="text-center py-10 relative z-10">
              <span className="text-5xl text-[#bfa993] mb-4 inline-block opacity-80">♥</span>
              <h3 className="text-lg font-bold text-[#5a504a] uppercase tracking-widest mt-2">Cảm ơn bạn!</h3>
              <p className="text-gray-500 text-sm mt-3 font-serif italic capitalize leading-relaxed">Chúng tôi rất mong đợi sự hiện diện của bạn.</p>
            </div>
          )}
        </motion.div>
      </section>

      {/* Countdown Section */}
      <section className="relative h-[600px] @sm:h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        <MediaDisplay src={footerImage} alt="Footer" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
        
        <div className="relative z-10 text-center text-white">
          <h2 className="text-4xl @sm:text-6xl font-light mb-12 text-[#f0eadd]" style={{ fontFamily: "'Dancing Script', cursive" }}>Countdown</h2>
          
          <div className="flex gap-4 @sm:gap-8 justify-center font-sans">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 @sm:w-20 @sm:h-20 border border-white/40 flex items-center justify-center text-2xl @sm:text-4xl font-light shadow-xl text-[#f0eadd]">
                {days}
              </div>
              <span className="text-[9px] @sm:text-xs uppercase tracking-[0.2em] mt-4 opacity-70 font-medium">Ngày</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 @sm:w-20 @sm:h-20 border border-white/40 flex items-center justify-center text-2xl @sm:text-4xl font-light shadow-xl text-[#f0eadd]">
                {hours}
              </div>
              <span className="text-[9px] @sm:text-xs uppercase tracking-[0.2em] mt-4 opacity-70 font-medium">Giờ</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 @sm:w-20 @sm:h-20 border border-white/40 flex items-center justify-center text-2xl @sm:text-4xl font-light shadow-xl text-[#f0eadd]">
                {minutes}
              </div>
              <span className="text-[9px] @sm:text-xs uppercase tracking-[0.2em] mt-4 opacity-70 font-medium">Phút</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 @sm:w-20 @sm:h-20 border border-white/40 flex items-center justify-center text-2xl @sm:text-4xl font-light shadow-xl text-[#f0eadd]">
                {seconds}
              </div>
              <span className="text-[9px] @sm:text-xs uppercase tracking-[0.2em] mt-4 opacity-70 font-medium">Giây</span>
            </div>
          </div>

          <p className="mt-16 text-[10px] @sm:text-xs font-light opacity-60 tracking-[0.3em] uppercase">HẸN GẶP LẠI BẠN SỚM NHÉ</p>
        </div>
      </section>
    </div>
  );
}
