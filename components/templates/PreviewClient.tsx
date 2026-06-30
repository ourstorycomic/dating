"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { InteractiveTemplatePreview } from "@/components/templates/InteractiveTemplatePreview";
import { MessengerButton } from "@/components/MessengerButton";
import { FACEBOOK_URL } from "@/lib/constants";

function facebookLink(slug: string) {
  return `${FACEBOOK_URL}?text=${encodeURIComponent(
    `Tôi muốn đặt mẫu ${slug}. Tư vấn giúp tôi làm web tặng người yêu.`
  )}`;
}

export function PreviewClient({ template, relatedTemplates = [] }: { template: any, relatedTemplates?: any[] }) {
  const [mode, setMode] = useState<"mobile" | "desktop">("mobile");
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [phoneScale, setPhoneScale] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setIsMobileDevice(isMobile);
      
      // Calculate perfect scale to fit the 780px tall phone into the screen without scrolling
      const availableHeight = window.innerHeight - 140; // Subtract header and paddings
      const availableWidth = isMobile ? window.innerWidth - 40 : (window.innerWidth / 2) - 80;
      
      const scaleH = availableHeight / 820; // 820 is the phone frame height + toggle buttons
      const scaleW = availableWidth / 420; // 420 is phone frame width
      
      setPhoneScale(Math.max(0.4, Math.min(1, Math.min(scaleH, scaleW))));
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isRotated = isMobileDevice && mode === "desktop";

  return (
    <div 
      className={`bg-pink-50 text-gray-800 flex flex-col font-sans relative overflow-hidden ${isRotated ? "fixed inset-0 z-[9999]" : "h-[100dvh] w-full"}`}
      style={isRotated ? {
        transform: "rotate(90deg)",
        transformOrigin: "center center",
        width: "100vh",
        height: "100vw",
        position: "fixed",
        top: "calc(50% - 50vw)",
        left: "calc(50% - 50vh)",
      } : {}}
    >
      {/* Top Header */}
      <header className={`h-[70px] px-6 bg-white/90 backdrop-blur-md border-b border-pink-100 flex items-center justify-between z-50 shadow-sm shrink-0 ${isRotated ? "h-16" : ""}`}>
        <Link href="/" className="bg-pink-100 hover:bg-pink-200 text-pink-600 px-5 py-2.5 rounded-full transition font-bold text-sm shadow-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          <span className="hidden sm:inline">Trang chủ</span>
        </Link>
        <h1 className="text-xl font-black text-pink-500 uppercase tracking-widest hidden sm:block">
          {template.name}
        </h1>
        <div className="w-[120px]"></div> {/* Spacer for perfect centering */}
      </header>

      {/* Main Content Area - Strictly 1 Page */}
      <main className="flex-1 relative flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8 overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-100 via-pink-50 to-white">
         
         {/* Cute Particle Background */}
         {mounted && (
           <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
             {Array.from({ length: 15 }).map((_, i) => (
               <div
                 key={`particle-${i}`}
                 className="absolute rounded-full bg-pink-300/30 blur-[2px]"
                 style={{
                   width: Math.random() * 20 + 10 + 'px',
                   height: Math.random() * 20 + 10 + 'px',
                   left: Math.random() * 100 + '%',
                   top: Math.random() * 100 + '%',
                   animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                   animationDelay: `-${Math.random() * 10}s`,
                 }}
               />
             ))}
             {Array.from({ length: 10 }).map((_, i) => (
               <div
                 key={`heart-${i}`}
                 className="absolute text-pink-200/40 text-xl select-none"
                 style={{
                   left: Math.random() * 100 + '%',
                   top: Math.random() * 100 + '%',
                   animation: `float-up ${Math.random() * 8 + 8}s linear infinite`,
                   animationDelay: `-${Math.random() * 8}s`,
                 }}
               >
                 ❤
               </div>
             ))}
             <style>{`
               @keyframes float {
                 0% { transform: translate(0, 0) rotate(0deg); }
                 33% { transform: translate(30px, -50px) rotate(120deg); }
                 66% { transform: translate(-20px, -100px) rotate(240deg); }
                 100% { transform: translate(0, -150px) rotate(360deg); opacity: 0; }
               }
               @keyframes float-up {
                 0% { transform: translateY(0) scale(0.8); opacity: 0; }
                 20% { opacity: 1; transform: translateY(-20px) scale(1.2); }
                 80% { opacity: 1; transform: translateY(-80px) scale(1); }
                 100% { transform: translateY(-100px) scale(0.8); opacity: 0; }
               }
             `}</style>
           </div>
         )}
         
         {/* Huge Decorative Pets to Fill Whitespace */}
         <div className="absolute left-[5%] top-[10%] animate-[bounce_4s_ease-in-out_infinite] pointer-events-none opacity-40 z-0">
            <img src="/assets/dumb/hm.webp" alt="cute pet" className="w-32 h-32 lg:w-48 lg:h-48 object-contain drop-shadow-2xl" />
         </div>
         <div className="absolute right-[5%] bottom-[10%] animate-[bounce_5s_ease-in-out_infinite] pointer-events-none opacity-40 z-0" style={{ animationDelay: '1s' }}>
            <img src="/assets/dumb/auau.webp" alt="cute pet" className="w-40 h-40 lg:w-64 lg:h-64 object-contain drop-shadow-2xl" />
         </div>
         <div className="absolute left-[40%] bottom-[5%] animate-pulse pointer-events-none opacity-30 z-0">
            <img src="/assets/dumb/suho-cat.webp" alt="cute pet" className="w-24 h-24 lg:w-40 lg:h-40 object-contain drop-shadow-xl" />
         </div>
         <div className="absolute right-[30%] top-[15%] animate-[wiggle_6s_ease-in-out_infinite] pointer-events-none opacity-30 z-0">
            <img src="/assets/dumb/kids.webp" alt="cute pet" className="w-24 h-24 lg:w-40 lg:h-40 object-contain drop-shadow-xl" />
         </div>

         {/* Layout Wrapper to perfectly center Info and Phone side by side */}
         <div className="w-full h-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 z-10">

            {/* Left Column: Info Box */}
            <div className={`w-full max-w-[450px] shrink-0 bg-white/90 backdrop-blur-xl p-8 lg:p-10 rounded-[2.5rem] border-4 border-pink-100 shadow-[0_20px_60px_-15px_rgba(255,192,203,0.6)] flex flex-col items-center text-center max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden ${isRotated ? "hidden" : "block"}`}>
                <div className="bg-pink-100 text-pink-500 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                  {template.template_categories?.name || "Mẫu HOT"}
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-pink-500 mb-6 drop-shadow-sm leading-tight">
                  {template.name}
                </h1>
                <p className="text-gray-600 text-base lg:text-lg font-medium leading-relaxed mb-10 px-4">
                  {template.tagline || template.description || "Gửi gắm yêu thương qua mẫu thiệp xịn xò này. Chắc chắn người ấy sẽ rất bất ngờ và hạnh phúc!"}
                </p>

                <a
                  className="w-full rounded-full bg-gradient-to-r from-pink-400 to-rose-400 px-6 py-5 text-lg font-black shadow-xl hover:shadow-rose-300/50 hover:scale-[1.02] active:scale-95 transition-all text-white border-4 border-white ring-4 ring-pink-100"
                  href={facebookLink(template.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Nhắn shop làm mẫu này ♥
                </a>

                {/* Suggestions Box to fill space */}
                {relatedTemplates.length > 0 && (
                  <div className="mt-8 w-full border-t border-pink-100 pt-6">
                    <h3 className="text-xs font-bold text-pink-300 mb-4 uppercase tracking-widest text-center">Gợi ý mẫu cùng chủ đề:</h3>
                    <div className="flex items-center justify-center gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden snap-x">
                      {relatedTemplates.map((relTemplate) => (
                        <Link 
                          href={`/templates/${relTemplate.slug}/preview`} 
                          key={relTemplate.id} 
                          className="shrink-0 relative w-[80px] h-[140px] rounded-2xl overflow-hidden border-2 border-pink-100 hover:border-pink-400 hover:shadow-[0_10px_20px_-5px_rgba(255,192,203,0.5)] transition-all group snap-start bg-white"
                        >
                          {/* Scaled down interactive preview as thumbnail */}
                          <div className="absolute top-0 left-0 origin-top-left w-[320px] h-[560px] pointer-events-none bg-[#05020a]" style={{ transform: "scale(0.25)" }}>
                            <InteractiveTemplatePreview
                              compact
                              noFrame
                              isBuilderPreview
                              componentKey={relTemplate.component_key}
                              gradient={relTemplate.gradient}
                              visualLabel={relTemplate.visual_label}
                              hideNavigation={true}
                            />
                          </div>
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-pink-900/90 via-pink-900/10 to-transparent pointer-events-none"></div>
                          <span className="absolute bottom-2 left-2 right-2 text-white font-bold text-[10px] leading-tight drop-shadow-md z-10 pointer-events-none truncate text-left">{relTemplate.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Right Column: The Phone / PC Preview */}
            <div className="shrink-0 flex flex-col items-center justify-start relative pt-8">
               
               {/* Mode Toggles */}
               <div className="flex items-center bg-white rounded-full p-1.5 border-2 border-pink-100 shadow-md mb-6 relative z-20">
                 <button
                   onClick={() => setMode("mobile")}
                   className={`px-5 py-2.5 rounded-full transition-all flex items-center gap-2 font-black text-sm ${mode === "mobile" ? "bg-pink-500 text-white shadow-lg scale-105" : "text-pink-300 hover:text-pink-500 hover:bg-pink-50"}`}
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                   Điện thoại
                 </button>
                 <button
                   onClick={() => setMode("desktop")}
                   className={`px-5 py-2.5 rounded-full transition-all flex items-center gap-2 font-black text-sm ${mode === "desktop" ? "bg-pink-500 text-white shadow-lg scale-105" : "text-pink-300 hover:text-pink-500 hover:bg-pink-50"}`}
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
                   Máy tính
                 </button>
               </div>

               {/* Scaled Preview Frame */}
               <div 
                 className="relative shrink-0 flex items-center justify-center"
                 style={{ 
                   width: (mode === "mobile" ? 380 : 800) * (mode === "mobile" ? phoneScale : Math.min(1, phoneScale * 1.2)), 
                   height: (mode === "mobile" ? 780 : 600) * (mode === "mobile" ? phoneScale : Math.min(1, phoneScale * 1.2)),
                 }}
               >
                 <div
                   className="absolute top-0 left-0 origin-top-left transition-all duration-300"
                   style={{ 
                     width: mode === "mobile" ? '380px' : '800px', 
                     height: mode === "mobile" ? '780px' : '600px',
                     transform: `scale(${mode === "mobile" ? phoneScale : Math.min(1, phoneScale * 1.2)})`,
                   }}
                 >
                   <div className="relative w-full h-full">
                   {mode === "mobile" ? (
                     <div 
                       className="w-full h-full rounded-[3.5rem] shadow-[0_30px_80px_-20px_rgba(255,192,203,0.8)] border-[16px] border-white bg-white overflow-hidden ring-4 ring-pink-100 flex flex-col relative z-20"
                       style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)', isolation: 'isolate' }}
                     >
                       <InteractiveTemplatePreview
                         compact={true}
                         isBuilderPreview={true}
                         noFrame={true}
                         componentKey={template.component_key}
                         gradient={template.gradient}
                         message="Đây là nội dung shop sẽ cá nhân hóa theo ảnh, tên và lời nhắn của khách."
                         photoCount={6}
                         question="Người ấy sẽ chọn câu trả lời nào?"
                         recipientName="Người ấy"
                         senderName="Bạn"
                         visualLabel={template.visual_label}
                         hideNavigation={true}
                       />
                     </div>
                   ) : (
                     <div 
                       className="w-full h-full rounded-[2rem] shadow-[0_30px_80px_-20px_rgba(255,192,203,0.8)] border-[12px] border-white bg-white overflow-hidden ring-4 ring-pink-100 flex flex-col relative z-20"
                       style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)', isolation: 'isolate' }}
                     >
                       <InteractiveTemplatePreview
                         compact={false}
                         isBuilderPreview={true}
                         noFrame={true}
                         componentKey={template.component_key}
                         gradient={template.gradient}
                         message="Đây là nội dung shop sẽ cá nhân hóa theo ảnh, tên và lời nhắn của khách."
                         photoCount={6}
                         question="Người ấy sẽ chọn câu trả lời nào?"
                         recipientName="Người ấy"
                         senderName="Bạn"
                         visualLabel={template.visual_label}
                         hideNavigation={true}
                       />
                     </div>
                   )}
                 </div>
               </div>
              </div>
            </div>
            </div>
      </main>

      <MessengerButton />
    </div>
  );
}
