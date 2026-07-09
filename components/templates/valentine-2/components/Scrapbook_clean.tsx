import { MediaDisplay } from "@/components/ui/MediaDisplay";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { playPop, playTada, playSwoosh } from "./soundFX";
import { Caveat, Dancing_Script } from "next/font/google";

const caveatFont = Caveat({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-caveat" });
const dancingScriptFont = Dancing_Script({ subsets: ["latin", "vietnamese"], weight: ["400", "700"], variable: "--font-dancing" });

const slowFlipVariants = {
  initial: { rotateY: 0, zIndex: 10 },
  flipped: { 
    rotateY: -180, 
    zIndex: 0, 
    transition: { duration: 2, ease: "easeInOut" as const } 
  }
};

const PAPER_BG = "bg-[#fdfbf7]";
const LEFT_PAGE_SHADOW = "shadow-[inset_-15px_0_20px_rgba(0,0,0,0.05)]";
const RIGHT_PAGE_SHADOW = "shadow-[inset_15px_0_20px_rgba(0,0,0,0.05)]";
const NOTEBOOK_LINES = "bg-[linear-gradient(transparent_95%,_#cbd5e1_95%)] bg-[length:100%_2rem]";
const WASHI_TAPE = "absolute w-12 h-5 bg-white/40 backdrop-blur-sm border-x border-white/20 rotate-[-2deg] shadow-sm";

export function Scrapbook({ 
  data, 
  onExtractLetter,
  onFirstInteraction,
  autoPlay = false,
  compact = false,
}: { 
  data: any; 
  onExtractLetter: () => void;
  onFirstInteraction?: () => void;
  autoPlay?: boolean;
  compact?: boolean;
}) {
  const [currentPage, setCurrentPage] = useState(0);

  const [page1TextDone, setPage1TextDone] = useState(false);
  const [page1ShowNext, setPage1ShowNext] = useState(false);
  const [page1Typed, setPage1Typed] = useState("");

  const [page2TextDone, setPage2TextDone] = useState(false);
  const [page2ShowNext, setPage2ShowNext] = useState(false);
  const [page2Typed, setPage2Typed] = useState("");

  const [dragY, setDragY] = useState({ y: 0, extracted: false });

  useEffect(() => {
    if (currentPage === 1) {
      let i = 0;
      setPage1Typed("");
      setPage1TextDone(false);
      setPage1ShowNext(false);
      const text = data.page1Text;
      const interval = setInterval(() => {
        setPage1Typed(text.substring(0, i));
        i++;
        if (i > text.length) {
          clearInterval(interval);
          setPage1TextDone(true);
          setTimeout(() => setPage1ShowNext(true), 2000);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [currentPage, data.page1Text]);

  useEffect(() => {
    if (currentPage === 2) {
      let i = 0;
      setPage2Typed("");
      setPage2TextDone(false);
      setPage2ShowNext(false);
      const text = data.page2Text;
      const interval = setInterval(() => {
        setPage2Typed(text.substring(0, i));
        i++;
        if (i > text.length) {
          clearInterval(interval);
          setPage2TextDone(true);
          setTimeout(() => setPage2ShowNext(true), 2000);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [currentPage, data.page2Text]);

  useEffect(() => {
    if (!autoPlay) return;
    
    if (currentPage === 0) {
      const t = setTimeout(() => setCurrentPage(1), 3000);
      return () => clearTimeout(t);
    } else if (currentPage === 1 && page1ShowNext) {
      const t = setTimeout(() => setCurrentPage(2), 2000);
      return () => clearTimeout(t);
    } else if (currentPage === 2 && page2ShowNext) {
      const t = setTimeout(() => setCurrentPage(3), 2000);
      return () => clearTimeout(t);
    } else if (currentPage === 3) {
      const t = setTimeout(() => {
        setDragY({ y: -150, extracted: true });
        playTada(compact && !autoPlay);
        setTimeout(() => {
          onExtractLetter();
        }, 1500);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [autoPlay, currentPage, page1ShowNext, page2ShowNext, onExtractLetter]);

  const nextPage = () => {
    onFirstInteraction?.();
    playSwoosh(compact && !autoPlay);
    if (currentPage < 3) setCurrentPage(p => p + 1);
  };

  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 z-10 [perspective:1500px] ${caveatFont.variable} ${dancingScriptFont.variable}`}>
      <style>{`
        .font-\\[Caveat\\] { font-family: var(--font-caveat) !important; }
        .font-\\[Dancing_Script\\] { font-family: var(--font-dancing) !important; }
      `}</style>
      {/* Book wrapper */}
      <motion.div 
        initial={{ y: 50, opacity: 0, x: 0 }}
        animate={{ y: 0, opacity: 1, x: currentPage > 0 ? 20 : 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative w-full max-w-[300px] aspect-[3/4] bg-[#fdfbf7] shadow-[0_30px_60px_rgba(0,0,0,0.3)] rounded-r-2xl rounded-l-md border-l-[16px] border-[#8b5a2b] flex [transform-style:preserve-3d]"
      >
        {/* Book Spine Rings (Metallic) */}
        <div className="absolute left-[-16px] top-0 bottom-0 w-[16px] flex flex-col justify-evenly py-4 z-50">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="h-2 w-6 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-400 rounded-full translate-x-0.5 shadow-[1px_2px_3px_rgba(0,0,0,0.3)] border border-gray-400" />
          ))}
        </div>

        {/* PAGE 3 (Pocket - Static Back Page) */}
        <div className={`absolute inset-0 ${PAPER_BG} rounded-r-2xl p-6 flex flex-col items-center justify-center z-[1] ${RIGHT_PAGE_SHADOW}`}>
          <h3 className="text-slate-800 font-[Dancing_Script] text-2xl font-bold mb-8 text-center px-4 leading-relaxed">
            {data.page3Hint}
          </h3>
          
          <div className="relative w-full h-48 mt-auto flex items-end justify-center pb-4">
            <div className={`absolute bottom-0 w-4/5 h-32 ${PAPER_BG} rounded-t-xl border-t-2 border-dashed border-slate-300 shadow-[0_-5px_10px_rgba(0,0,0,0.05)] z-20 flex items-center justify-center`}>
              <span className="text-slate-400 font-bold tracking-widest opacity-60">SECRET POCKET</span>
            </div>
            
            <AnimatePresence>
              {!dragY.extracted && (
                <motion.div
                  key="ribbon-card"
                  drag="y"
                  dragConstraints={{ top: -170, bottom: 0 }}
                  dragElastic={0.08}
                  onDrag={(_e, info) => {
                    // Only track position during drag ??? NOT activate
                    setDragY({ y: info.offset.y, extracted: false });
                  }}
                  onDragEnd={(_e, info) => {
                    // Activate ONLY when released past threshold (-130px)
                    if (info.offset.y < -130) {
                      setDragY({ y: info.offset.y, extracted: true });
                      playTada(compact && !autoPlay);
                    } else {
                      setDragY({ y: 0, extracted: false }); // snap back
                    }
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="absolute z-10 flex flex-col items-center cursor-grab active:cursor-grabbing"
                  style={{ bottom: 36, y: dragY.y }}
                >
                  {/* Card body */}
                  <div className="w-14 h-36 bg-gradient-to-b from-[#be123c] to-[#9f1239] rounded-t-md shadow-lg flex flex-col items-center pt-3 gap-2 border-x border-t border-[#7f1d1d]">
                    <div className="w-9 h-9 rounded-full bg-[#7f1d1d] border-2 border-[#fca5a5]/30 flex items-center justify-center shadow-inner">
                      <div className="w-3 h-3 bg-[#fca5a5]/60 rounded-full" />
                    </div>
                    <div className="w-8 h-px bg-white/20" />
                    <div className="w-6 h-px bg-white/15" />
                    {/* Hint text: changes to checkmark when past threshold */}
                    {dragY.y < -130 ? (
                      <div className="text-green-300 text-[9px] font-bold tracking-widest mt-auto mb-2 select-none">??? TH???!</div>
                    ) : (
                      <motion.div
                        animate={compact ? undefined : { y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                        className="text-white/50 text-[9px] font-bold tracking-widest mt-auto mb-2 select-none"
                      >K??O ???</motion.div>
                    )}
                  </div>
                  {/* XU ??? ????y card */}
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-full border-[3px] border-yellow-200 flex items-center justify-center shadow-[0_6px_18px_rgba(234,179,8,0.5)]">
                    <span className="text-yellow-900 font-black text-xs tracking-tight select-none">1 XU</span>
                  </div>
                </motion.div>
              )}

              {/* Xu bay l??n sau khi extracted */}
              {dragY.extracted && (
                <motion.div
                  key="coin-extracted"
                  initial={{ opacity: 0, y: 0, scale: 0.6 }}
                  animate={{ opacity: 1, y: -140, scale: 1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14 }}
                  className="absolute z-30 flex flex-col items-center"
                  style={{ bottom: 36 }}
                >
                  <motion.div
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-full shadow-[0_12px_28px_rgba(234,179,8,0.55)] border-4 border-yellow-200 flex items-center justify-center"
                  >
                    <span className="text-yellow-100 font-black text-xl drop-shadow-md tracking-tighter select-none">1 XU</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pocket envelope ??? z-20 che xu ??? ????y card */}
            <div className={`absolute bottom-0 w-4/5 h-28 ${PAPER_BG} rounded-t-xl border-t-2 border-dashed border-slate-300 shadow-[0_-5px_15px_rgba(0,0,0,0.07)] z-20 flex flex-col items-center justify-center gap-1`}>
              <span className="text-slate-400 text-[9px] font-bold tracking-[0.2em] opacity-50 uppercase">Secret Pocket</span>
              <div className="w-12 h-px bg-slate-200 opacity-60" />
              <div className="w-8 h-px bg-slate-200 opacity-40" />
            </div>
          </div>

          {/* Overlay sau khi extracted */}
          <AnimatePresence>
            {dragY.extracted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute inset-0 bg-[#fdfbf7]/96 backdrop-blur-sm z-40 rounded-r-2xl flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-full shadow-[0_10px_25px_rgba(234,179,8,0.5)] border-4 border-yellow-200 flex items-center justify-center mb-4 animate-pulse">
                  <span className="text-yellow-100 font-black text-2xl drop-shadow-md">1 XU</span>
                </div>
                <p className="text-slate-800 font-[Dancing_Script] text-xl font-bold mb-6 leading-relaxed">
                  T??? c?? m???t m??n qu?? b?? m???t, nh??ng c???u ph???i t??? tay gi??nh l???y n?? nh??!
                </p>
                <button
                  onClick={() => { playTada(compact && !autoPlay); onExtractLetter(); }}
                  className="bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-[0_10px_20px_rgba(225,29,72,0.4)] hover:scale-105 transition-transform"
                >
                  ??i l???y qu?? ???????
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Escape n???u b??? k???t */}
          {!dragY.extracted && currentPage === 3 && (
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5 }}
              onClick={onExtractLetter}
              className="absolute bottom-3 right-3 z-50 text-slate-400 text-xs underline opacity-50 hover:opacity-100 transition-opacity"
            >
              B??? qua ???
            </motion.button>
          )}
        </div>

        {/* PAGE 2 (Polaroids) */}
        <motion.div 
          variants={slowFlipVariants}
          initial="initial"
          animate={currentPage > 2 ? "flipped" : "initial"}
          style={{ transformOrigin: "left center" }}
          className="absolute inset-0 origin-left [transform-style:preserve-3d] z-[2]"
        >
          {/* Front Face (Right Page) */}
          <div
            className={`absolute inset-0 ${PAPER_BG} rounded-r-2xl px-4 pt-3 pb-4 flex flex-col ${RIGHT_PAGE_SHADOW} border-l border-black/5 [backface-visibility:hidden] cursor-pointer`}
            onClick={() => { if (page2ShowNext) nextPage(); }}
          >
            <div className="relative w-full flex-shrink-0" style={{ height: '60%' }}>
              {currentPage >= 2 && data.polaroids.map((p: any, i: number) => (
                <motion.div
                  key={p.id}
                  className="absolute bg-white p-2 pb-8 rounded shadow-lg drop-shadow-xl border border-gray-100"
                  style={{ 
                    top: i === 0 ? '8%' : '14%', 
                    left: i === 0 ? '4%' : '22%',
                    rotate: i === 0 ? '-3deg' : '4deg',
                    width: '58%',
                    zIndex: i === 0 ? 1 : 2,
                  }}
                  initial={{ y: -200, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15, delay: 1 + i * 0.5 }}
                >
                  <div className="aspect-square bg-gray-200 w-full mb-2">
                    <MediaDisplay src={p.src} className="w-full h-full object-cover" alt="" />
                  </div>
                  <p className="text-center font-[Caveat] text-lg text-slate-800 font-bold">{p.caption}</p>
                  <div className={`${WASHI_TAPE} -top-2 left-1/2 -translate-x-1/2`} />
                </motion.div>
              ))}
            </div>

            <div className="flex-1 w-full pt-4 px-2">
              {currentPage >= 2 && (
                <p className="text-slate-800 font-[Dancing_Script] text-xl leading-relaxed font-bold">
                  {page2Typed}
                  {!page2TextDone && <span className="animate-pulse opacity-50">|</span>}
                </p>
              )}
            </div>
          </div>
          
          {/* Back Face (Left Page for Page 3) */}
          <div className={`absolute inset-0 ${PAPER_BG} rounded-l-2xl border-r border-black/5 [transform:rotateY(180deg)] [backface-visibility:hidden] ${LEFT_PAGE_SHADOW} p-6 overflow-hidden`}>
             <div className={`absolute inset-0 ${NOTEBOOK_LINES} opacity-30`} />
             <div className="relative h-full flex flex-col opacity-60">
                <div className="text-right text-slate-500 font-[Caveat] text-xl font-bold italic rotate-[-5deg] mt-4">
                  14 Feb 2024
                </div>
                <div className="mt-auto flex justify-start pl-4 pb-4">
                  <Heart className="text-rose-300 w-12 h-12 rotate-[-15deg] opacity-40" strokeWidth={1} />
                </div>
             </div>
          </div>
        </motion.div>

        {/* PAGE 1 (First Meeting) */}
        <motion.div 
          variants={slowFlipVariants}
          initial="initial"
          animate={currentPage > 1 ? "flipped" : "initial"}
          style={{ transformOrigin: "left center" }}
          className="absolute inset-0 origin-left [transform-style:preserve-3d] z-[3]"
        >
          {/* Front Face (Right Page) ??? absolute layout so text never pushes image */}
          <div
            className={`absolute inset-0 ${PAPER_BG} rounded-r-2xl ${RIGHT_PAGE_SHADOW} border-l border-black/5 [backface-visibility:hidden] cursor-pointer overflow-hidden`}
            onClick={() => { if (page1ShowNext) nextPage(); }}
          >
            {/* Text pinned to top area ??? overflows upward only, never affects image */}
            <div className="absolute top-0 left-0 right-0 px-5 pt-6 overflow-hidden" style={{ bottom: '185px' }}>
              {currentPage >= 1 && (
                <p className="text-slate-800 font-[Dancing_Script] text-2xl leading-relaxed font-bold whitespace-pre-line">
                  {page1Typed}
                  {!page1TextDone && <span className="animate-pulse opacity-50">|</span>}
                </p>
              )}
            </div>

            {/* Image pinned to bottom ??? always same position regardless of text length */}
            <div className="absolute bottom-5 left-5 right-5 h-[165px] bg-white p-3 pb-8 shadow-md drop-shadow-xl rotate-[-2deg]">
              {currentPage >= 1 && (
                <motion.img
                  initial={{ filter: "blur(10px)", opacity: 0 }}
                  animate={{ filter: "blur(0px)", opacity: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                  src={data.page1Image || undefined}
                  className="w-full h-full object-cover border border-slate-100"
                  alt=""
                />
              )}
              <div className={`${WASHI_TAPE} -top-2 -left-2 rotate-[-12deg]`} />
              <div className={`${WASHI_TAPE} -bottom-2 -right-2 rotate-[10deg]`} />
            </div>
          </div>
          
          {/* Back Face (Left Page for Page 2) */}
          <div className={`absolute inset-0 ${PAPER_BG} rounded-l-2xl border-r border-black/5 [transform:rotateY(180deg)] [backface-visibility:hidden] ${LEFT_PAGE_SHADOW} p-6 overflow-hidden`}>
            <div className={`absolute inset-0 ${NOTEBOOK_LINES} opacity-30`} />
             <div className="relative h-full flex flex-col opacity-60">
                <div className="text-right text-slate-500 font-[Caveat] text-xl font-bold italic rotate-[-2deg] mt-4">
                  14 Feb 2024
                </div>
                <div className="mt-auto flex justify-start pl-4 pb-4">
                  <div className="w-16 h-16 border-2 border-dashed border-rose-300 rounded-full flex items-center justify-center rotate-[15deg] opacity-40">
                     <span className="text-rose-300 font-[Caveat] text-xs">xoxo</span>
                  </div>
                </div>
             </div>
          </div>
        </motion.div>

        {/* COVER */}
        <motion.div 
          variants={slowFlipVariants}
          initial="initial"
          animate={currentPage > 0 ? "flipped" : "initial"}
          style={{ transformOrigin: "left center" }}
          className="absolute inset-0 origin-left [transform-style:preserve-3d] z-[4]"
        >
          {/* Front Face */}
          <div className="absolute inset-0 bg-[#8b5a2b] rounded-r-2xl p-6 flex flex-col items-center justify-center shadow-[inset_-10px_0_20px_rgba(0,0,0,0.4)] [backface-visibility:hidden] border-2 border-[#714820]">

            
            <div className="w-3/4 aspect-square rounded-lg overflow-hidden border-[6px] border-[#fdfbf7] shadow-[0_10px_20px_rgba(0,0,0,0.5)] mb-12 relative z-10 rotate-[2deg]">
              <MediaDisplay src={data.coverImage || undefined} className="w-full h-full object-cover opacity-90 sepia-[0.2]" alt="Cover" />
            </div>
            
            <h2 className="text-4xl font-[Dancing_Script] font-bold text-[#fdfbf7] text-center drop-shadow-[2px_4px_4px_rgba(0,0,0,0.6)] mb-8 px-4 leading-tight relative z-10">
              {data.coverTitle}
            </h2>
            
            <button 
              onClick={nextPage} 
              className={`${compact ? '' : 'animate-pulse'} bg-[#fdfbf7]/90 text-slate-800 px-8 py-3 rounded border border-slate-300 font-serif font-bold tracking-widest shadow-[0_5px_15px_rgba(0,0,0,0.5)] hover:bg-white transition-colors relative z-10`}
            >
              M??? S??? TAY
            </button>
          </div>
          
          {/* Back Face (Inside Cover - Left Page for Page 1) */}
          <div className={`absolute inset-0 ${PAPER_BG} rounded-l-2xl border-r border-black/5 [transform:rotateY(180deg)] [backface-visibility:hidden] ${LEFT_PAGE_SHADOW} p-6 overflow-hidden`}>
             <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/5 to-transparent" />
             <div className="w-full h-full border-4 border-double border-slate-300 opacity-50 flex items-center justify-center p-4">
                <div className="border border-slate-300 w-full h-full flex flex-col items-center justify-center">
                   <Heart className="w-16 h-16 text-rose-200 opacity-60 mb-4" />
                   <span className="text-slate-400 font-[Dancing_Script] text-xl">Our Memories</span>
                </div>
             </div>
          </div>
        </motion.div>

      </motion.div>

      {/* "Trang ti???p" button ??? absolutely positioned so it never shifts the book */}
      <AnimatePresence>
        {(page1ShowNext && currentPage === 1) && (
          <motion.button
            key="next1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={nextPage}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/90 hover:bg-white text-slate-800 px-7 py-2.5 rounded-full font-bold text-sm shadow-xl border border-slate-200 transition-colors backdrop-blur-sm whitespace-nowrap z-20"
          >
            Trang ti???p ???
          </motion.button>
        )}
        {(page2ShowNext && currentPage === 2) && (
          <motion.button
            key="next2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={nextPage}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/90 hover:bg-white text-slate-800 px-7 py-2.5 rounded-full font-bold text-sm shadow-xl border border-slate-200 transition-colors backdrop-blur-sm whitespace-nowrap z-20"
          >
            Trang ti???p ???
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
