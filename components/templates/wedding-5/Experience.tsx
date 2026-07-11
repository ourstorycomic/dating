"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { MediaDisplay } from "@/components/ui/MediaDisplay";

export function WeddingFiveExperience({
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
    if (autoPlay && containerRef.current) {
      let scrollAmount = 0;
      const speed = 0.3; // Much slower scroll
      let reqId: number;

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
      return () => cancelAnimationFrame(reqId);
    }
  }, [autoPlay]);

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
      className={`@container relative w-full h-full bg-[#f6f4ed] text-[#2c4623] scroll-smooth ${autoPlay ? "overflow-hidden pointer-events-none select-none" : !isOpened ? "overflow-hidden select-none" : "overflow-x-hidden overflow-y-auto"} ${compact ? "rounded-[2.5rem]" : ""}`}
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {/* Intro Envelope Screen */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#e9e4d5] cursor-pointer pointer-events-auto"
            onClick={() => {
              setIsOpened(true);
              if (audioRef.current && !isPlaying) {
                audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
              }
            }}
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-60 mix-blend-multiply" />
            
            <div className="relative z-10 flex flex-col items-center px-6 text-center w-full max-w-sm">
              <p className="text-[12px] uppercase tracking-[0.4em] text-[#6e855a] mb-6 font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>Save our date</p>
              
              {/* Envelope Graphic */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="relative w-56 h-40 bg-[#2c4623] rounded-md shadow-2xl mb-8 flex items-end justify-center border-t border-[#3e6132] overflow-hidden"
              >
                {/* Photo sticking out of envelope */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-white p-1 rounded-sm shadow-inner -mt-10 rotate-[-5deg]">
                  <MediaDisplay src={heroImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
                
                {/* Envelope flap bottom */}
                <div className="absolute bottom-0 w-0 h-0 border-l-[112px] border-l-transparent border-r-[112px] border-r-transparent border-b-[80px] border-b-[#233a1b]" />
                
                {/* Wax seal */}
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute z-10 w-12 h-12 bg-[#c43333] rounded-full shadow-lg flex items-center justify-center border-2 border-[#9b2626] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <span className="text-white text-xl">♥</span>
                </motion.div>
              </motion.div>

              <h1 className="text-4xl font-bold text-[#c43333] mb-1">{brideName}</h1>
              <span className="text-lg text-[#6e855a] font-light italic my-0" style={{ fontFamily: "'Dancing Script', cursive" }}>&amp;</span>
              <h1 className="text-4xl font-bold text-[#c43333] mt-1">{groomName}</h1>
              
              <p className="mt-12 text-[10px] uppercase tracking-[0.2em] font-bold text-[#2c4623] border-b border-[#6e855a] pb-1">Chạm để mở thiệp</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Music & Floating Toggle */}
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" autoPlay={autoPlay} muted={compact && !autoPlay} />
      )}
      {!autoPlay && (
        <button 
          onClick={toggleAudio}
          className="fixed top-4 right-4 z-50 w-10 h-10 bg-white/80 backdrop-blur-md border border-[#2c4623]/20 rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(44,70,35,0.15)] transition-transform active:scale-95 pointer-events-auto"
        >
          {isPlaying ? (
             <svg className="w-4 h-4 text-[#2c4623] animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
          ) : (
             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>
          )}
        </button>
      )}

      {/* 1. TOP PHOTO & NAMES */}
      <section className="relative w-full pb-16 flex flex-col items-center justify-start bg-[#f6f4ed]">
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="w-full relative">
          <MediaDisplay src={heroImage} alt="Hero" className="w-full aspect-[4/3] @sm:aspect-[16/9] object-cover" />
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#f6f4ed] to-transparent" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
          className="text-center w-full px-6 flex flex-col items-center -mt-8 relative z-10 bg-[#f6f4ed]"
        >
          {/* Decorative Leaves */}
          <svg className="w-16 h-16 text-[#6e855a] mb-2 opacity-60" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 10 C30 10, 10 30, 10 50 C10 70, 30 90, 50 90 C70 90, 90 70, 90 50 C90 30, 70 10, 50 10 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M50 20 C40 30, 40 70, 50 80 C60 70, 60 30, 50 20 Z" />
          </svg>
          
          <p className="text-[#6e855a] text-xs uppercase tracking-widest font-bold mb-4 font-sans">Wedding Invitation</p>
          <div className="flex flex-col items-center gap-1 text-[#c43333] font-bold text-4xl @sm:text-5xl mt-2 tracking-wide leading-tight">
            <span>{groomName}</span>
            <span className="text-[#6e855a] text-2xl font-light italic" style={{ fontFamily: "'Dancing Script', cursive" }}>&amp;</span>
            <span>{brideName}</span>
          </div>
          
          <p className="text-[#c43333] text-2xl mt-6" style={{ fontFamily: "'Dancing Script', cursive" }}>Thân Mời</p>
        </motion.div>
      </section>

      {/* 2. INVITATION LETTER */}
      <section className="py-8 px-6 relative z-10 bg-[#f6f4ed] text-center border-t border-[#6e855a]/20 mx-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true, margin: "0px" }} className="max-w-xl mx-auto">
          
          <p className="text-sm leading-relaxed italic text-[#2c4623] px-4 mb-10">
            "{letterText}"
          </p>

          <div className="flex justify-between text-xs tracking-widest text-[#2c4623] mb-10">
            <div className="text-center w-1/2 px-2 border-r border-[#6e855a]/30">
              <span className="block text-[9px] uppercase text-[#c43333] mb-2 font-bold tracking-[0.2em]">Nhà Trai</span>
              <span className="whitespace-pre-wrap leading-relaxed font-bold">{groomFamily}</span>
            </div>
            <div className="text-center w-1/2 px-2">
              <span className="block text-[9px] uppercase text-[#c43333] mb-2 font-bold tracking-[0.2em]">Nhà Gái</span>
              <span className="whitespace-pre-wrap leading-relaxed font-bold">{brideFamily}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-[#6e855a] uppercase tracking-widest text-[10px] font-bold">Lễ cưới tổ chức lúc</p>
            <p className="text-2xl text-[#2c4623] font-bold mt-2 font-sans tracking-tight">{dTime}</p>
            <p className="text-[#6e855a] uppercase tracking-widest text-xs font-bold mt-1 mb-2">{dDayOfWeek}</p>
            <div className="flex items-center justify-center gap-4 text-xl text-[#2c4623] mt-2 border-y border-[#6e855a]/50 py-3 px-8">
              <span className="uppercase text-xs tracking-widest font-bold">Tháng {dMonth.replace(/\D/g,'')}</span>
              <span className="text-4xl text-[#c43333] font-bold mx-2">{dDay}</span>
              <span className="uppercase text-xs tracking-widest font-bold">Năm {dYear}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. FULL PHOTO BREAK */}
      <section className="w-full py-12 bg-[#f6f4ed]">
        <motion.div 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1.5 }} viewport={{ once: true }}
          className="w-full aspect-[4/5] @sm:aspect-[16/9] relative overflow-hidden"
        >
          <MediaDisplay src={groomImage} alt="Divider" className="w-full h-full object-cover rounded-3xl max-w-[90%] mx-auto" />
        </motion.div>
      </section>

      {/* 4. OUR STORY (POLAROID OVERLAPPING) */}
      <section className="py-16 px-4 bg-[#f6f4ed] overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-5xl text-[#6e855a] mb-2" style={{ fontFamily: "'Dancing Script', cursive" }}>
            Our Story
          </h2>
          <p className="text-[#2c4623] text-[10px] uppercase tracking-[0.2em] font-bold">Tình yêu của chúng ta</p>
        </motion.div>
        
        <div className="max-w-md mx-auto relative h-[600px] flex justify-center">
          <motion.div 
            initial={{ opacity: 0, x: -50, rotate: -15 }} 
            whileInView={{ opacity: 1, x: 0, rotate: -5 }} 
            viewport={{ once: true, margin: "-100px" }} 
            transition={{ duration: 1, type: "spring" }} 
            className="absolute top-0 left-4 @sm:left-12 w-64 p-3 bg-white shadow-xl z-10 border border-gray-100"
          >
            <div className="aspect-[3/4] overflow-hidden">
               <MediaDisplay src={brideImage} alt="Gallery 1" className="w-full h-full object-cover" />
            </div>
            <p className="text-center mt-3 text-xs italic text-gray-500 font-serif">Ngày đầu tiên</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50, rotate: 15 }} 
            whileInView={{ opacity: 1, x: 0, rotate: 5 }} 
            viewport={{ once: true, margin: "-100px" }} 
            transition={{ duration: 1, delay: 0.3, type: "spring" }} 
            className="absolute top-48 right-4 @sm:right-12 w-64 p-3 bg-white shadow-xl z-20 border border-gray-100"
          >
            <div className="aspect-[4/3] overflow-hidden">
               <MediaDisplay src={footerImage} alt="Gallery 2" className="w-full h-full object-cover" />
            </div>
            <p className="text-center mt-3 text-xs italic text-gray-500 font-serif">Hiện tại và mãi mãi</p>
          </motion.div>
        </div>
      </section>

      {/* 5. DARK GREEN CALENDAR */}
      <section className="w-full bg-[#1e2f17] text-white py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="w-full max-w-sm mx-auto text-center"
        >
          <div className="mb-10 text-center">
            <h3 className="text-4xl text-[#e9e4d5] mb-2" style={{ fontFamily: "'Dancing Script', cursive" }}>{dMonth}</h3>
            <p className="text-sm tracking-widest uppercase font-bold text-[#6e855a]">{dYear}</p>
          </div>
          
          <div className="grid grid-cols-7 gap-2 text-[10px] @sm:text-xs font-sans text-[#6e855a] mb-6 tracking-widest uppercase font-bold border-b border-[#3e6132] pb-3">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={`day-${i}`}>{d}</div>)}
          </div>
          
          <div className="grid grid-cols-7 gap-y-6 gap-x-2 text-sm @sm:text-base font-sans font-medium text-gray-300">
            <div className="text-transparent">0</div>
            <div className="text-transparent">0</div>
            {calendarDays.map(day => (
              <div key={day} className="relative flex justify-center items-center h-8 w-8 mx-auto">
                {day.toString() === dDay ? (
                  <>
                    <motion.div 
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-[#c43333] rounded-full shadow-lg z-0"
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

      {/* 6. TIMELINE */}
      <section className="py-16 px-4 bg-[#f6f4ed]">
        <div className="max-w-md mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h3 className="text-[#6e855a] text-4xl mb-12" style={{ fontFamily: "'Dancing Script', cursive" }}>Timeline</h3>
            <div className="flex justify-between items-start px-4 relative">
              
              {[
                { time: "09:00", label: "Đón Khách", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> },
                { time: "10:30", label: "Lễ Cưới", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="5"></circle><circle cx="15" cy="12" r="5"></circle></svg> },
                { time: "11:30", label: "Khai Tiệc", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 15v6M12 15s5.5-4 5.5-9v-1a2 2 0 0 0-2-2H8.5a2 2 0 0 0-2 2v1c0 5 5.5 9 5.5 9z"></path></svg> }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center relative z-10 w-1/3">
                  <div className="text-[#2c4623] mb-4">
                    {item.icon}
                  </div>
                  <p className="text-[#c43333] font-bold font-sans text-sm">{item.time}</p>
                  <p className="text-[#2c4623] text-[9px] uppercase tracking-widest mt-1 font-bold">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7. EVENT VENUE */}
      <section className="py-12 px-4 bg-[#f6f4ed] border-b border-[#6e855a]/20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto relative rounded-[2rem] overflow-hidden shadow-xl"
        >
          <MediaDisplay src={mapImage} alt="Map" className="w-full h-64 object-cover" />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-6 text-center">
            <h2 className="text-2xl font-bold tracking-widest uppercase mb-4">Nhà Hàng Tiệc Cưới</h2>
            <p className="text-xs leading-loose font-sans font-medium uppercase tracking-[0.1em] mb-6">{eventAddress}</p>
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="bg-[#2c4623] text-white text-[10px] uppercase font-bold tracking-widest py-3 px-6 rounded-full hover:bg-[#1e2f17] transition-colors border border-[#6e855a]">
              Chỉ đường
            </a>
          </div>
        </motion.div>
      </section>

      {/* 8. COUNTDOWN (GREEN BLOCKS) */}
      <section className="py-16 px-4 bg-[#f6f4ed] text-center">
        <h2 className="text-[#6e855a] text-3xl mb-8" style={{ fontFamily: "'Dancing Script', cursive" }}>Countdown</h2>
        
        <div className="flex gap-3 justify-center font-sans max-w-md mx-auto">
          {[
            { label: 'Ngày', value: days },
            { label: 'Giờ', value: hours },
            { label: 'Phút', value: minutes },
            { label: 'Giây', value: seconds }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#2c4623] flex items-center justify-center text-xl font-bold text-white rounded shadow-lg">
                {item.value}
              </div>
              <span className="text-[10px] uppercase tracking-widest mt-3 text-[#2c4623] font-bold">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 9. ALBUM OF LOVE */}
      <section className="py-16 px-2 bg-[#f6f4ed]">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-[#2c4623] text-3xl font-bold uppercase tracking-[0.2em] mb-1">Album</h2>
          <p className="text-[#6e855a] text-4xl" style={{ fontFamily: "'Dancing Script', cursive" }}>Of Love</p>
        </motion.div>
        
        <div className="max-w-md mx-auto grid grid-cols-2 gap-2">
          <div className="col-span-2 aspect-[21/9] overflow-hidden rounded-lg">
            <MediaDisplay src={heroImage} alt="A1" className="w-full h-full object-cover" />
          </div>
          <div className="col-span-1 aspect-square overflow-hidden rounded-lg">
            <MediaDisplay src={brideImage} alt="A2" className="w-full h-full object-cover" />
          </div>
          <div className="col-span-1 aspect-square overflow-hidden rounded-lg">
            <MediaDisplay src={groomImage} alt="A3" className="w-full h-full object-cover" />
          </div>
          <div className="col-span-2 aspect-[21/9] overflow-hidden rounded-lg">
            <MediaDisplay src={dividerImage} alt="A4" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* 10. RSVP FORM WITH RED ICON */}
      <section className="py-20 px-4 bg-[#f6f4ed] flex justify-center relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full max-w-sm bg-[#e9e4d5] p-8 rounded-xl border border-[#d3ccb8] relative overflow-hidden"
        >
          <div className="text-center mb-8">
            <h2 className="text-[#2c4623] text-lg font-bold uppercase tracking-widest mb-1">Xác nhận tham dự</h2>
          </div>

          {!rsvpSubmitted ? (
            <form onSubmit={handleRSVP} className="space-y-4 font-sans relative z-10">
              <div>
                <input 
                  type="text" required 
                  value={rsvpName} onChange={e => setRsvpName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#d3ccb8] focus:border-[#2c4623] focus:ring-1 focus:ring-[#2c4623] focus:outline-none text-sm transition-all text-[#2c4623] placeholder:text-[#a09e93] placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest" 
                  placeholder="Tên khách mời" 
                />
              </div>
              
              <div>
                <input 
                  type="tel" required 
                  value={rsvpPhone} onChange={e => setRsvpPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#d3ccb8] focus:border-[#2c4623] focus:ring-1 focus:ring-[#2c4623] focus:outline-none text-sm transition-all text-[#2c4623] placeholder:text-[#a09e93] placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest" 
                  placeholder="Số điện thoại" 
                />
              </div>
              
              <div className="mt-6">
                <label className="block text-[10px] font-bold text-[#6e855a] uppercase tracking-widest mb-2">Số lượng tham dự</label>
                <div className="flex items-center gap-2">
                  {["1", "2", "3"].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRsvpCount(num)}
                      className={`w-10 h-10 text-sm font-bold transition-all shrink-0 border ${rsvpCount === num ? "bg-[#2c4623] text-white border-[#2c4623]" : "bg-white text-gray-500 border-[#d3ccb8] hover:border-[#2c4623]"}`}
                    >
                      {num}
                    </button>
                  ))}
                  <div className={`relative flex items-center shrink-0 border transition-all ${!["1", "2", "3"].includes(rsvpCount) ? "bg-[#2c4623] border-[#2c4623]" : "bg-white border-[#d3ccb8]"}`}>
                    <input 
                      type="number" min="4" max="100" placeholder="Khác"
                      value={["1", "2", "3"].includes(rsvpCount) ? "" : rsvpCount}
                      onChange={(e) => setRsvpCount(e.target.value)}
                      onFocus={() => { if(["1", "2", "3"].includes(rsvpCount)) setRsvpCount("") }}
                      className={`w-16 h-10 bg-transparent text-center text-sm font-bold focus:outline-none ${!["1", "2", "3"].includes(rsvpCount) ? "text-white placeholder:text-white/70" : "text-gray-500 placeholder:text-[#a09e93]"}`}
                    />
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full py-4 mt-6 bg-[#2c4623] text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#1e2f17] transition-all flex items-center justify-center"
              >
                Gửi Xác Nhận
              </button>
            </form>
          ) : (
            <div className="text-center py-10">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-4xl text-[#c43333] mb-4 inline-block">♥</motion.div>
              <h3 className="text-sm font-bold text-[#2c4623] uppercase tracking-widest mt-2">Đã nhận phản hồi</h3>
            </div>
          )}
        </motion.div>
      </section>

      {/* 11. FOOTER THANK YOU */}
      <section className="py-24 px-4 bg-[#f6f4ed] text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}
        >
          <MediaDisplay src={footerImage} alt="Footer" className="w-full max-w-sm mx-auto aspect-video object-cover rounded-xl mb-8" />
          <h2 className="text-5xl text-[#6e855a]" style={{ fontFamily: "'Dancing Script', cursive" }}>Thank you!</h2>
        </motion.div>
      </section>
    </div>
  );
}
