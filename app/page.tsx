"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Gem, Sparkles, Gift } from "lucide-react";
import { InteractiveTemplatePreview } from "@/components/templates/InteractiveTemplatePreview";
import { TiltPhonePreview } from "@/components/TiltPhonePreview";

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-[#FCFBFB] text-[#332035] overflow-x-hidden selection:bg-pink-200 selection:text-pink-900 font-sans-clean">

      {/* Premium Background Decor - Blending the two vibes */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#FFB6C1]/20 to-[#FF6B9D]/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-[#C5A880]/20 to-[#E8D9C8]/10 blur-[130px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      {/* Header */}
      <header className="relative z-50 pt-8 pb-6 px-6 lg:px-12 flex justify-center lg:justify-between items-center max-w-[1500px] mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex items-center gap-3">
          <img src="/favicon.ico" alt="Lovora" className="w-12 h-12 shadow-[0_4px_20px_rgba(255,107,157,0.3)] rounded-2xl animate-bounce-slow" />
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-[#FF59AB] to-[#C5A880] bg-clip-text text-transparent drop-shadow-sm">
            Lovora
          </h1>
        </motion.div>
      </header>

      <main className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-12 pb-24 pt-2">

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-black/5 shadow-sm mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <span className="text-sm font-semibold tracking-wide text-[#5A5552] uppercase">Hệ sinh thái thiết kế</span>
            <Heart className="w-4 h-4 text-[#FF59AB]" />
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-black leading-[1.1] tracking-tight mb-6 text-[#2D2A28]">
            Lưu giữ những <br className="hidden sm:block" /> khoảnh khắc <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF59AB] to-[#C5A880]">đặc biệt</span>
          </h2>
          <p className="text-lg sm:text-xl text-[#7A726D] font-medium leading-relaxed max-w-2xl mx-auto">
            Từ những trang web tỏ tình ngọt ngào đến nền tảng thiệp cưới online sang trọng. Hãy chọn không gian hoàn hảo cho câu chuyện của bạn.
          </p>
        </motion.div>

        {/* Portal Cards - Unified Design Language */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 group/portal">

          {/* LOVORA LOVE */}
          <div className="group block transition-opacity duration-500 group-hover/portal:opacity-60 hover:!opacity-100 relative h-full">
            <Link href="/love" className="absolute inset-0 z-50 rounded-[2.5rem]" aria-label="Lovora Love" />
            <motion.div
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="relative h-full rounded-[2.5rem] bg-gradient-to-br from-[#FFF5F8] to-white p-8 lg:p-10 overflow-hidden border border-[#FFB6C1]/30 shadow-[0_20px_50px_rgba(255,182,193,0.15)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_30px_70px_rgba(255,182,193,0.3)] pointer-events-auto"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,107,157,0.08),_transparent_60%)] group-hover:opacity-100 opacity-0 transition-opacity duration-700 pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full pointer-events-none">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-[1.2rem] bg-gradient-to-br from-[#FFB6C1] to-[#FF6B9D] flex items-center justify-center shadow-md transition-transform duration-500 group-hover:scale-110">
                    <Heart className="w-7 h-7 text-white stroke-white fill-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-3xl font-black text-[#FF59AB] tracking-tight">
                    Lovora Love
                  </h3>
                </div>

                <p className="text-[#7B536B] text-base lg:text-lg font-medium leading-relaxed mb-8 max-w-sm">
                  Vũ trụ quà tặng ngọt ngào cho các dịp Sinh Nhật, Tỏ Tình, Kỷ Niệm. Khám phá những mẫu web tương tác siêu cute.
                </p>

                {/* Unified Showcase Container */}
                <div className="relative flex-1 min-h-[420px] mb-8 rounded-[1.5rem] bg-white/60 border border-white backdrop-blur-md flex items-center justify-center overflow-hidden shadow-inner group-hover:shadow-[inset_0_10px_30px_rgba(255,182,193,0.1)] transition-shadow duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent z-20 pointer-events-none" />

                  {/* Decorative glow behind phone */}
                  <div className="absolute w-[200px] h-[200px] bg-pink-300/30 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000 ease-out" />

                  {/* Phone Frame */}
                  <div className="relative w-[240px] h-[480px] origin-center translate-y-0 group-hover:-translate-y-2 transition-transform duration-[1s] ease-out z-30">
                    <TiltPhonePreview />
                  </div>

                  <img src="/assets/happy/ami-bụng-bự.webp" alt="cute" className="absolute bottom-6 left-6 w-20 h-20 object-contain z-40 drop-shadow-xl transition-transform duration-700 group-hover:-translate-y-2 group-hover:scale-110" />
                </div>

                <div className="mt-auto inline-flex items-center justify-between w-full">
                  <span className="text-lg font-bold text-[#FF59AB] bg-gradient-to-r from-[#FF59AB] to-[#FF59AB] bg-[length:0%_2px] bg-no-repeat bg-left-bottom group-hover:bg-[length:100%_2px] transition-all duration-500 pb-1">
                    Khám phá Love
                  </span>
                  <div className="w-12 h-12 rounded-full bg-white border border-[#FFB6C1]/50 text-[#FF59AB] flex items-center justify-center transition-all duration-300 shadow-sm group-hover:!bg-[#FF59AB] group-hover:!text-white group-hover:!border-[#FF59AB]">
                    <ArrowRight className="w-5 h-5 group-hover:-rotate-45 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* LOVORA WEDDING */}
          <div className="group block transition-opacity duration-500 group-hover/portal:opacity-60 hover:!opacity-100 relative h-full">
            <Link href="/wedding" className="absolute inset-0 z-50 rounded-[2.5rem]" aria-label="Lovora Wedding" />
            <motion.div
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
              className="relative h-full rounded-[2.5rem] bg-gradient-to-br from-[#FDFBF7] to-white p-8 lg:p-10 overflow-hidden border border-[#C5A880]/30 shadow-[0_20px_50px_rgba(197,168,128,0.15)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_30px_70px_rgba(197,168,128,0.25)] pointer-events-auto"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(197,168,128,0.08),_transparent_60%)] group-hover:opacity-100 opacity-0 transition-opacity duration-700 pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full pointer-events-none">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-[1.2rem] bg-gradient-to-br from-[#E8D9C8] to-[#C5A880] flex items-center justify-center shadow-md transition-transform duration-500 group-hover:scale-110">
                    <Gem className="w-7 h-7 text-white stroke-white fill-transparent" strokeWidth={2} />
                  </div>
                  <h3 className="text-3xl font-black text-[#C5A880] tracking-tight">
                    Lovora Wedding
                  </h3>
                </div>

                <p className="text-[#8C7B6B] text-base lg:text-lg font-medium leading-relaxed mb-8 max-w-sm">
                  Giải pháp thiệp cưới online cao cấp. Thiết kế thanh lịch, tinh tế, tích hợp form xác nhận tham dự và bản đồ dẫn đường thông minh.
                </p>

                {/* Unified Showcase Container */}
                <div className="relative flex-1 min-h-[420px] mb-8 rounded-[1.5rem] bg-[#FAFAF8]/60 border border-white backdrop-blur-md flex items-center justify-center overflow-hidden shadow-inner group-hover:shadow-[inset_0_10px_30px_rgba(197,168,128,0.1)] transition-shadow duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF8]/90 via-[#FAFAF8]/20 to-transparent z-20 pointer-events-none" />

                  {/* Decorative glow behind phone */}
                  <div className="absolute w-[200px] h-[200px] bg-[#C5A880]/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000 ease-out" />

                  {/* Phone Frame */}
                  <div className="relative w-[240px] h-[480px] origin-center translate-y-0 group-hover:-translate-y-2 transition-transform duration-[1s] ease-out shadow-[0_24px_60px_rgba(197,168,128,0.15)] rounded-[2.5rem] z-30 bg-[#2D2A28] border-[8px] border-[#2D2A28]">
                    <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-white">
                      <InteractiveTemplatePreview componentKey="wedding-1" compact={true} noFrame={true} />
                    </div>
                  </div>
                </div>

                <div className="mt-auto inline-flex items-center justify-between w-full">
                  <span className="text-lg font-bold text-[#C5A880] bg-gradient-to-r from-[#C5A880] to-[#C5A880] bg-[length:0%_2px] bg-no-repeat bg-left-bottom group-hover:bg-[length:100%_2px] transition-all duration-500 pb-1">
                    Xem mẫu thiệp cưới
                  </span>
                  <div className="w-12 h-12 rounded-full bg-white border border-[#C5A880]/50 text-[#C5A880] flex items-center justify-center transition-all duration-300 shadow-sm group-hover:!bg-[#C5A880] group-hover:!text-white group-hover:!border-[#C5A880]">
                    <ArrowRight className="w-5 h-5 group-hover:-rotate-45 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </main>

    </div>
  );
}
