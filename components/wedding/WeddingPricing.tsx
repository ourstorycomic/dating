"use client";

import { useState, useEffect } from "react";
import { FACEBOOK_URL } from "@/lib/constants";

function facebookLink(templateName?: string) {
  const text = templateName
    ? `Tôi muốn tư vấn mẫu thiệp cưới ${templateName}. Giúp tôi chọn thiết kế cưới đẹp và sang trọng.`
    : "Tôi muốn tư vấn thiệp cưới sang trọng, tinh tế và dễ dàng.";

  return `${FACEBOOK_URL}?text=${encodeURIComponent(text)}`;
}

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const cycleDuration = 5 * 24 * 60 * 60 * 1000;
    const updateCountdown = () => {
      const now = Date.now();
      const startEpoch = new Date("2026-08-28T00:00:00+07:00").getTime();
      const elapsed = Math.max(0, now - startEpoch);
      const timePassedInCycle = elapsed % cycleDuration;
      const remainingTime = cycleDuration - timePassedInCycle;

      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
      const seconds = Math.floor((remainingTime / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

const packages = [
  {
    subtitle: "TRẢI NGHIỆM TIÊU CHUẨN",
    name: "Gói Cơ bản (1 thiệp)",
    oldPrice: "179.000đ",
    price: "139.000đ",
    description: "Dành cho 1 thiệp (Nhà Trai HOẶC Nhà Gái)",
    features: ["Làm thường (2-3 ngày): 139.000đ", "Làm gấp (<24h): 189.000đ", "Có nhạc nền", "Form xác nhận tham dự"],
    featured: false,
    color: "#2D2A28",
  },
  {
    subtitle: "TRẢI NGHIỆM VƯỢT TRỘI",
    name: "Gói Trọn vẹn (Thiệp chung)",
    oldPrice: "249.000đ",
    price: "209.000đ",
    description: "1 thiệp dùng chung cho cả Nhà Trai & Nhà Gái (gồm thông tin lễ, tiệc cả 2 nhà)",
    features: ["Làm thường (2-3 ngày): 209.000đ", "Làm gấp (<24h): 279.000đ", "Chỉnh sửa nội dung cơ bản", "Đầy đủ nhạc & Form xác nhận"],
    featured: true,
    color: "#C5A880",
  },
  {
    subtitle: "TRẢI NGHIỆM NÂNG CAO",
    name: "Gói Song hành (Combo 2 thiệp)",
    oldPrice: "279.000đ",
    price: "239.000đ",
    description: "Combo 2 thiệp riêng biệt (1 Nhà Trai + 1 Nhà Gái)",
    features: ["Chung mẫu: 239.000đ (Gấp: 319.000đ)", "Khác mẫu: 269.000đ (Gấp: 359.000đ)", "Chỉnh sửa nội dung cơ bản", "Đầy đủ nhạc & Form xác nhận"],
    featured: false,
    color: "#2D2A28",
  },
];

export function WeddingPricing() {
  const { days, hours, minutes, seconds } = useCountdown();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="packages" className="mt-28 relative">
      <div className="absolute inset-0 bg-[#C5A880]/5 rounded-[3rem] -z-10 transform -rotate-1" />
      <div className="text-center mb-12 pt-10">
        <h2 className="font-serif-elegant text-4xl font-semibold text-[#2D2A28] sm:text-5xl mb-4">
          Bảng Giá Dịch Vụ
        </h2>
        <p className="text-[#7A726D] max-w-2xl mx-auto text-lg mb-6">
          Chọn gói dịch vụ phù hợp nhất với nhu cầu của bạn.
        </p>

        {/* 5-day Sale Countdown Banner */}
        {mounted && (
          <div className="flex justify-center w-full px-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 bg-white rounded-[2rem] px-8 py-5 shadow-[0_15px_40px_rgba(197,168,128,0.12)] border border-[#E8D9C8]">
              <span className="text-base font-serif-elegant font-bold text-[#C5A880] tracking-widest flex items-center gap-2">
                <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ưu đãi kết thúc sau:
              </span>
              <div className="flex gap-2 items-center">
                <div className="bg-[#FDFBF7] border border-[#E8D9C8] text-[#2D2A28] text-2xl font-serif-elegant font-semibold px-4 py-2 rounded-xl shadow-sm min-w-[56px] text-center tabular-nums lining-nums">{String(days).padStart(2, '0')}</div>
                <span className="text-[#C5A880] font-medium text-2xl animate-pulse">:</span>
                <div className="bg-[#FDFBF7] border border-[#E8D9C8] text-[#2D2A28] text-2xl font-serif-elegant font-semibold px-4 py-2 rounded-xl shadow-sm min-w-[56px] text-center tabular-nums lining-nums">{String(hours).padStart(2, '0')}</div>
                <span className="text-[#C5A880] font-medium text-2xl animate-pulse">:</span>
                <div className="bg-[#FDFBF7] border border-[#E8D9C8] text-[#2D2A28] text-2xl font-serif-elegant font-semibold px-4 py-2 rounded-xl shadow-sm min-w-[56px] text-center tabular-nums lining-nums">{String(minutes).padStart(2, '0')}</div>
                <span className="text-[#C5A880] font-medium text-2xl animate-pulse">:</span>
                <div className="bg-[#FDFBF7] border border-[#E8D9C8] text-[#2D2A28] text-2xl font-serif-elegant font-semibold px-4 py-2 rounded-xl shadow-sm min-w-[56px] text-center tabular-nums lining-nums">{String(seconds).padStart(2, '0')}</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid gap-8 lg:gap-12 md:grid-cols-3 max-w-6xl mx-auto px-4">
        {packages.map((pkg, i) => (
          <div key={i} className={`relative flex flex-col rounded-[2rem] bg-white p-8 shadow-[0_8px_30px_rgba(45,42,40,0.04)] border ${pkg.featured ? 'border-[#C5A880] ring-1 ring-[#C5A880]/50 transform md:-translate-y-4 shadow-[0_20px_50px_rgba(197,168,128,0.12)] bg-[#FDFBF7]' : 'border-[#F4EFEA]'} transition-all hover:shadow-[0_20px_50px_rgba(45,42,40,0.08)]`}>
            
            <div className="flex-1 text-center">
              {pkg.featured && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#C5A880] px-4 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-sm">
                  Phổ Biến Nhất
                </span>
              )}
              <h3 className="font-serif-elegant font-bold text-xl mb-1 text-[#2D2A28] leading-snug lg:px-4">{pkg.name}</h3>
              <p className="text-xs font-semibold mt-2 mb-6 uppercase tracking-widest text-[#C5A880]">{pkg.subtitle}</p>
              
              <div className="mt-4 flex flex-col items-center justify-center gap-2">
                <span className="text-xl font-semibold text-[#9A918B] line-through decoration-rose-400/80 decoration-2 tabular-nums lining-nums">{pkg.oldPrice}</span>
                <span className="text-5xl font-serif-elegant font-semibold tracking-tight tabular-nums lining-nums" style={{ color: pkg.color }}>{pkg.price}</span>
              </div>
              


              {/* Original Features & Desc */}
              <div className="text-left border-t border-[#F4EFEA] pt-6 mt-8">
                <p className="text-sm mb-4 text-[#7A726D]">{pkg.description}</p>
                <ul className="space-y-3 text-sm text-[#4A4542]">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: pkg.color }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <a href={facebookLink(pkg.name)} target="_blank" rel="noopener noreferrer" className={`w-full block text-center rounded-full py-4 text-sm font-semibold transition hover:-translate-y-0.5 ${pkg.featured ? 'bg-[#C5A880] text-[#2D2A28] shadow-[0_4px_14px_rgba(197,168,128,0.25)] hover:bg-[#B3966D]' : 'border border-[#E8D9C8] text-[#7A726D] hover:bg-[#FDFBF7] hover:text-[#2D2A28]'}`}>
                XEM CHI TIẾT
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
