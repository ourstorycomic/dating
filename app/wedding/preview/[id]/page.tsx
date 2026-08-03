'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Monitor, Smartphone, Share2, Check, ExternalLink, ArrowRight } from 'lucide-react';
import { InteractiveTemplatePreview } from '@/components/templates/InteractiveTemplatePreview';
import { createClient } from '@/lib/supabase/client';
import { MessengerButton } from '@/components/MessengerButton';

const FACEBOOK_URL = "https://www.facebook.com/messages/t/462153540321288";

function facebookLink(templateName?: string) {
  const text = templateName
    ? `Tôi muốn tư vấn mẫu thiệp cưới ${templateName}. Giúp tôi chọn thiết kế cưới đẹp và sang trọng.`
    : "Tôi muốn tư vấn thiệp cưới sang trọng, tinh tế và dễ dàng.";

  return `${FACEBOOK_URL}?text=${encodeURIComponent(text)}`;
}

const renderDescription = (text?: string) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-[#2D2A28]">{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
};

// Replaced OTHER_TEMPLATES with dynamic fetch from /api/templates/published

export default function TemplatePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [isCopied, setIsCopied] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  const templateId = unwrappedParams.id;
  const componentKey = templateId || 'wedding-1';

  const [dbTemplate, setDbTemplate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplate() {
      const supabase = createClient();
      const { data } = await supabase
        .from('templates')
        .select('*')
        .eq('slug', componentKey)
        .single();
      
      if (data) setDbTemplate(data);
      setIsLoading(false);
    }
    fetchTemplate();
  }, [componentKey]);

  const [randomTemplates, setRandomTemplates] = useState<any[]>([]);

  useEffect(() => {
    async function fetchOthers() {
      try {
        const res = await fetch('/api/templates/published');
        const allTemplates = await res.json();
        const isCurrentVideo = componentKey.toLowerCase().includes("videowedding");
        const weddingTemplates = allTemplates.filter((t: any) => {
          const key = t.component_key?.toLowerCase() || "";
          if (isCurrentVideo) {
            return key.includes("videowedding");
          } else {
            return key.includes("wedding") && !key.includes("videowedding");
          }
        });
        const available = weddingTemplates.filter((t: any) => t.component_key !== componentKey);
        const shuffled = [...available].sort(() => 0.5 - Math.random());
        setRandomTemplates(shuffled.slice(0, 2).map((t: any) => ({
          name: t.name,
          image: t.thumbnail_url || "",
          componentKey: t.component_key
        })));
      } catch (e) {
        console.error("Failed to fetch other templates", e);
      }
    }
    fetchOthers();
  }, [componentKey]);

  useEffect(() => {
    const handleResize = () => setIsMobileScreen(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeDevice = isMobileScreen ? 'mobile' : device;
  const isVideo = componentKey.toLowerCase().includes("video");

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="h-screen bg-[#FDFBF7] flex flex-col font-sans overflow-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
        
        .font-serif-elegant {
          font-family: 'Playfair Display', serif;
        }
        
        .font-sans-clean {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      {/* 1. TOP BAR */}
      <header className="flex-none h-16 bg-white border-b border-[#F4EFEA] px-4 md:px-8 flex items-center justify-between shadow-sm z-50">
        {/* Left */}
        <div className="flex-1">
          <Link href="/wedding" className="inline-flex items-center gap-2 text-sm text-[#7A726D] hover:text-[#C5A880] transition font-medium">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Quay lại danh sách mẫu</span>
            <span className="sm:hidden">Quay lại</span>
          </Link>
        </div>

        {/* Center: Device Toggle */}
        {!isMobileScreen && !isVideo && (
          <div className="flex-1 flex justify-center">
            <div className="bg-[#F8F6F0] p-1 rounded-full flex items-center gap-1 border border-[#F4EFEA]">
              <button
                onClick={() => setDevice('desktop')}
                className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${device === 'desktop'
                  ? 'bg-[#E8D9C8] text-[#2D2A28] shadow-sm'
                  : 'text-[#A89F9A] hover:text-[#7A726D] hover:bg-[#F4EFEA]/50'
                  }`}
              >
                <Monitor className="w-4 h-4" />
                Máy tính
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${device === 'mobile'
                  ? 'bg-[#E8D9C8] text-[#2D2A28] shadow-sm'
                  : 'text-[#A89F9A] hover:text-[#7A726D] hover:bg-[#F4EFEA]/50'
                  }`}
              >
                <Smartphone className="w-4 h-4" />
                Điện thoại
              </button>
            </div>
          </div>
        )}

        {/* Right */}
        <div className="flex-1 flex justify-end items-center gap-3">
          <button
            onClick={handleShare}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-[#F4EFEA] text-[#7A726D] hover:bg-[#F8F6F0] transition"
            title="Chia sẻ link"
          >
            {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
          </button>
          <a
            href={facebookLink(dbTemplate?.name || componentKey)}
            target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-[#C5A880] text-[#2D2A28] px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#B3966D] transition shadow-sm"
          >
            Nhắn tin tư vấn
          </a>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative h-[calc(100vh-4rem)]">

        {/* A. Cột Trái (Preview Area) */}
        <div className="flex-1 bg-[#F8F6F0] relative flex items-center justify-center p-4 lg:p-8 min-h-[850px] lg:min-h-0 lg:overflow-hidden">
          <div
            className={`transition-all duration-500 ease-out flex flex-col bg-white relative shadow-2xl overflow-hidden shrink-0 ${
              isVideo 
                ? 'w-full max-w-[1200px] aspect-video rounded-xl border border-[#E5E5E5]'
                : activeDevice === 'desktop'
                  ? 'w-full max-w-[1200px] rounded-xl border border-[#E5E5E5] h-full max-h-[800px]'
                  : 'w-full max-w-[375px] sm:max-w-[400px] rounded-[2.5rem] border-[8px] border-[#1A1A1A] h-full max-h-[850px]'
              } [transform:translateZ(0)]`}
          >
            {isVideo ? (
              <div className="flex-none w-full bg-[#1A1A1A] border-b border-[#333] flex items-center px-4 py-3 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                </div>
                <div className="mx-auto bg-[#333] rounded-md px-6 py-1 text-xs font-medium text-[#A89F9A] flex items-center gap-2 max-w-sm w-full justify-center">
                  <Monitor className="w-3 h-3" /> Màn hình trình chiếu Video 16:9 (Nhà hàng)
                </div>
              </div>
            ) : activeDevice === 'desktop' ? (
              // Desktop Minimalist Browser Mockup
              <div className="flex-none w-full bg-white border-b border-[#E5E5E5] flex items-center px-4 py-3 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                </div>
                <div className="mx-auto bg-[#F4F4F4] rounded-md px-6 py-1 text-xs font-medium text-[#A89F9A] flex items-center gap-2 max-w-sm w-full justify-center">
                  <ExternalLink className="w-3 h-3" /> lovora.click/wedding/preview/{componentKey}
                </div>
              </div>
            ) : (
              // Mobile Mockup Notch
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50 pointer-events-none">
                <div className="w-1/3 h-5 bg-[#1A1A1A] rounded-b-3xl"></div>
              </div>
            )}

            <div className={`flex-1 w-full relative overflow-y-auto ${isVideo ? 'bg-black' : 'bg-white'}`}>
              <InteractiveTemplatePreview
                componentKey={componentKey}
                noFrame={true}
                compact={false}
                forceRandomMusic={true}
              />
            </div>
          </div>
        </div>

        {/* B. Cột Phải (Sidebar) */}
        <div className="w-full lg:w-[420px] xl:w-[480px] bg-white border-l border-[#F4EFEA] flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.03)] z-10 shrink-0 lg:h-full">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="w-8 h-8 border-4 border-[#C5A880]/30 border-t-[#C5A880] rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-8 lg:p-12">
                <span className="inline-block px-3 py-1 bg-[#FDFBF7] text-[#C5A880] text-[11px] font-bold uppercase tracking-[0.2em] rounded-full mb-6 border border-[#E8D9C8]/60">
                  {dbTemplate?.tagline || dbTemplate?.status_label || "Sang Trọng"}
                </span>

                <h1 className="font-serif-elegant text-4xl lg:text-5xl text-[#2D2A28] mb-5 leading-tight">
                  {dbTemplate?.name || componentKey}
                </h1>

                <p className="text-[#7A726D] text-sm leading-relaxed mb-10 whitespace-pre-line">
                  {renderDescription(dbTemplate?.description || "Template cưới tuyệt đẹp.")}
                </p>


                <a
                  href={facebookLink(dbTemplate?.name || componentKey)}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#C5A880] text-[#2D2A28] py-4 rounded-xl text-base font-bold transition-all shadow-[0_4px_14px_rgba(197,168,128,0.25)] hover:bg-[#B3966D] hover:-translate-y-0.5 mb-2 mt-4"
                >
                  Chọn & Nhắn Page
                  <ArrowRight className="w-5 h-5" />
                </a>
                <p className="text-center text-xs text-[#A89F9A] mb-12 font-medium">Có thể tùy chỉnh toàn bộ nội dung & hình ảnh</p>

                <div className="pt-8 border-t border-[#F4EFEA]">
                  <h3 className="text-xs font-bold text-[#A89F9A] uppercase tracking-widest mb-6">Khám phá mẫu khác</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {randomTemplates.map((t) => (
                      <Link href={`/wedding/preview/${t.componentKey}`} key={t.componentKey} className="group block rounded-xl overflow-hidden border border-[#F4EFEA] hover:border-[#C5A880] transition shadow-sm hover:shadow-md">
                        <div className={`${t.componentKey.toLowerCase().includes('video') ? 'aspect-video' : 'aspect-[3/4]'} overflow-hidden relative bg-[#F8F6F0]`}>
                          {t.image ? (
                            <img src={t.image} alt={t.name} className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-[#C5A880] text-xs">Xem trước</div>
                          )}
                        </div>
                        <div className="p-3 bg-white text-center">
                          <p className="text-xs font-semibold text-[#2D2A28] truncate">{t.name}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      </main>
      <MessengerButton />
    </div>
  );
}
