"use client";

import React, { useState } from "react";
import { FACEBOOK_URL } from "@/lib/constants";

export function MessengerButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    const startY = window.scrollY;
    const duration = 1500; // 1.5 seconds for a luxurious slow glide
    let startTime: number | null = null;

    const easeInOutCubic = (t: number, b: number, c: number, d: number) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t * t + b;
      t -= 2;
      return (c / 2) * (t * t * t + 2) + b;
    };

    const animateScroll = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const y = easeInOutCubic(progress, startY, -startY, duration);
      
      window.scrollTo(0, y);
      
      if (progress < duration) {
        window.requestAnimationFrame(animateScroll);
      } else {
        window.scrollTo(0, 0);
      }
    };
    
    window.requestAnimationFrame(animateScroll);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = message.trim() || "Mình muốn nhờ shop tư vấn làm web tặng người yêu.";
    const url = `${FACEBOOK_URL}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setIsOpen(false);
    setMessage("");
  };

  return (
    <>
      {/* Overlay on mobile if open */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[99] bg-black/20 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Window Popup */}
      <div 
        className={`hidden sm:flex flex-col fixed bottom-24 right-4 sm:bottom-24 sm:right-6 z-[100] w-[calc(100vw-2rem)] sm:w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100 pointer-events-auto translate-y-0" : "scale-90 opacity-0 pointer-events-none translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-400 to-rose-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src="/favicon.ico" alt="Lovora" className="w-10 h-10 rounded-full border-2 border-white bg-white object-cover" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="text-white font-bold text-base leading-tight">Lovora</h3>
              <p className="text-blue-100 text-xs">Thường trả lời ngay lập tức</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            aria-label="Đóng chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Chat Area */}
        <div className="p-4 bg-slate-50 h-[300px] overflow-y-auto flex flex-col gap-4">
          <p className="text-center text-[11px] font-medium text-slate-400 uppercase tracking-wider">Hôm nay</p>
          
          <div className="flex gap-2">
            <img src="/favicon.ico" alt="Lovora" className="w-7 h-7 rounded-full bg-white border border-gray-200 shrink-0 shadow-sm" />
            <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 text-sm text-gray-700 leading-relaxed max-w-[85%]">
              Chào bạn! 💕<br/>
              Cảm ơn bạn đã ghé thăm Lovora.<br/>
              Bạn đang cần tìm mẫu web để tỏ tình, xin lỗi hay chúc mừng sinh nhật vậy ạ?
            </div>
          </div>

          <div className="flex gap-2">
            <div className="w-7 shrink-0"></div>
            <div className="flex flex-col gap-2 w-full items-start">
               <button 
                onClick={() => { setMessage("Mình muốn xem các mẫu tỏ tình."); }} 
                className="text-left text-sm text-pink-500 border border-pink-300/30 bg-pink-50 px-4 py-2 rounded-2xl hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all max-w-fit shadow-sm"
               >
                 Mình muốn xem mẫu tỏ tình
               </button>
               <button 
                onClick={() => { setMessage("Mình cần mẫu sinh nhật."); }} 
                className="text-left text-sm text-pink-500 border border-pink-300/30 bg-pink-50 px-4 py-2 rounded-2xl hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all max-w-fit shadow-sm"
               >
                 Mình cần mẫu sinh nhật
               </button>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="bg-white border-t border-gray-100 flex flex-col">
          <div className="flex items-center gap-2 p-3">
            <input 
              type="text" 
              placeholder="Nhập tin nhắn..." 
              className="flex-1 bg-slate-100 border border-transparent rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300/30 focus:border-pink-400/50 focus:bg-white transition-all"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button 
              type="submit"
              className={`${message.trim() ? "text-pink-500 hover:bg-pink-50" : "text-gray-300 pointer-events-none"} p-2 rounded-full transition-colors shrink-0`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-400 pb-2">Sẽ chuyển hướng tới Messenger ⚡</p>
        </form>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-[100] group items-center justify-center animate-bounce-slow"
        aria-label="Mở khung chat"
      >
        <div className={`relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-pink-400 to-rose-500 rounded-full shadow-xl transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 rotate-90' : 'scale-100 opacity-100 rotate-0 group-hover:scale-110'}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className="w-8 h-8 fill-white"
          >
            <path d="M50,0C22.4,0,0,21.3,0,47.6c0,15,6.9,28.2,17.7,37.2v15.2l16.4-9c5,1.4,10.3,2.1,15.9,2.1 C77.6,93.1,100,71.8,100,47.6C100,21.3,77.6,0,50,0z M55.2,65.1L40.9,49.8L12.8,65.1l31.1-33l14.4,15.3l27.9-15.3L55.2,65.1z" />
          </svg>
          
          {/* Tooltip / Label */}
          <span className="absolute right-16 px-4 py-2 bg-white text-pink-500 text-sm font-bold rounded-2xl shadow-xl border-2 border-pink-200 whitespace-nowrap opacity-0 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-2">
            Chat với shop nha! 💖
          </span>
          
          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-full border-2 border-pink-400 animate-ping opacity-75 duration-1000"></div>
        </div>
        
        {/* Close Icon for floating button if open */}
        <div className={`absolute inset-0 flex items-center justify-center w-14 h-14 bg-white border-2 border-slate-200 rounded-full shadow-lg transition-all duration-300 ${isOpen ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </div>
      </button>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed z-[80] right-4 sm:right-6 bottom-[9.5rem] sm:bottom-24 grid h-12 w-12 place-items-center rounded-full bg-white text-pink-500 shadow-xl border-2 border-pink-100 transition-all duration-300 hover:bg-pink-50 hover:-translate-y-1 ${
          showScrollTop && !isOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
        aria-label="Cuộn lên đầu trang"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
      </button>
    </>
  );
}
