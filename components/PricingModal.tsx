"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const cycleDuration = 5 * 24 * 60 * 60 * 1000;
    const updateCountdown = () => {
      const now = Date.now();
      // Đặt mốc thời gian gần đây (28/08/2026) để thời gian còn lại luôn hiển thị ~4-5 ngày ở thời điểm hiện tại
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

const PACKAGES = [
  {
    tier: "01",
    name: "Theo Mẫu",
    desc: "Bạn chuẩn bị sẵn nội dung, shop làm y hệt mẫu. Nhanh gọn!",
    oldValentine: ["298K", "318K"],
    valentine: ["168K", "188K"],
    oldDating: ["278K", "298K"],
    dating:    ["148K", "168K"],
    popular: false,
    color: "#fce7f3",
    textColor: "#be185d",
  },
  {
    tier: "02",
    name: "Chỉnh Cảm Xúc",
    desc: "Shop sắp xếp ảnh, chỉnh câu chữ cho hợp cảm xúc. Hỗ trợ sửa 1 lần.",
    oldValentine: ["450K", "470K"],
    valentine: ["295K", "315K"],
    oldDating: ["430K", "450K"],
    dating:    ["275K", "295K"],
    popular: false,
    color: "#fdf4ff",
    textColor: "#a21caf",
  },
  {
    tier: "03",
    name: "Đặc Biệt",
    desc: "Tư vấn concept riêng, viết lời nhắn sâu sắc. Hỗ trợ sửa 2 lần.",
    oldValentine: ["990K", "1.010K"],
    valentine: ["450K", "470K"],
    oldDating: ["970K", "990K"],
    dating:    ["430K", "450K"],
    popular: true,
    color: "#fef3c7",
    textColor: "#b45309",
  },
];

const WEDDING = [
  { tier: "01", name: "1 Thiệp Lẻ",      desc: "Chỉ dành cho nhà Trai hoặc nhà Gái.",                           prices: ["139K", "189K"], popular: false },
  { tier: "02", name: "1 Thiệp Chung",   desc: "1 link cho cả 2 bên. Lời mời tự động đổi theo người xem.",      prices: ["209K", "279K"], popular: true },
  { tier: "03", name: "Combo Chung Mẫu", desc: "2 link thiệp rời — nhà Trai & nhà Gái cùng 1 mẫu.",             prices: ["239K", "319K"], popular: false },
  { tier: "04", name: "Combo Khác Mẫu",  desc: "2 link thiệp rời — mỗi nhà được chọn mẫu thiết kế riêng.",      prices: ["269K", "359K"], popular: false },
];

export function PricingModal({
  customTrigger, hideWedding, hideNormal, defaultTab,
}: {
  customTrigger?: React.ReactNode;
  hideWedding?: boolean;
  hideNormal?: boolean;
  defaultTab?: "normal" | "wedding";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<"normal" | "wedding">(
    defaultTab || (hideWedding ? "normal" : "wedding")
  );
  const { days, hours, minutes, seconds } = useCountdown();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      {customTrigger ? (
        <div onClick={() => setIsOpen(true)} className="cursor-pointer inline-block">{customTrigger}</div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 hover:scale-105 active:scale-95 transition-all"
        >
          Xem Bảng Giá
        </button>
      )}

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={close}
                className="absolute inset-0"
                style={{ background: "rgba(80,20,60,0.45)", backdropFilter: "blur(10px)" }}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="relative w-full max-w-2xl rounded-3xl flex flex-col overflow-hidden"
                style={{
                  background: "linear-gradient(160deg, #fff0f8 0%, #fdf5ff 50%, #fff8f0 100%)",
                  boxShadow: "0 0 0 1.5px rgba(236,72,153,0.15), 0 32px 80px rgba(180,50,120,0.22)",
                }}
              >
                {/* Close btn */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); close(); }}
                  className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-gray-400 hover:bg-white hover:text-gray-600 transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Header */}
                <div className="px-6 pt-6 pb-5 text-center">
                  <h2
                    className="text-xl font-black tracking-tight"
                    style={{ background: "linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  >
                    ✦ Bảng Giá Dịch Vụ ✦
                  </h2>
                  <p className="mt-1 text-xs text-gray-400">Cùng Lovora tạo nên những món quà đầy ý nghĩa nhé!</p>

                  {/* Global Sale Countdown */}
                  <div className="mt-4 flex justify-center w-full px-6">
                    <div className="flex flex-col items-center gap-2 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 rounded-2xl px-6 py-3 shadow-lg shadow-rose-500/40 border border-rose-400 w-full relative overflow-hidden">
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-[-150%] opacity-0 hover:opacity-100 transition-opacity" />
                      
                      <span className="text-sm font-black text-white uppercase tracking-widest drop-shadow-md flex items-center gap-2">
                        <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Khuyến mãi kết thúc sau
                      </span>
                      <div className="flex gap-2 items-center z-10">
                        <div className="bg-white text-rose-600 text-xl font-black px-3 py-1.5 rounded-lg shadow-md min-w-[40px] text-center tracking-wider">{String(days).padStart(2, '0')}</div>
                        <span className="text-white font-black text-xl animate-pulse">:</span>
                        <div className="bg-white text-rose-600 text-xl font-black px-3 py-1.5 rounded-lg shadow-md min-w-[40px] text-center tracking-wider">{String(hours).padStart(2, '0')}</div>
                        <span className="text-white font-black text-xl animate-pulse">:</span>
                        <div className="bg-white text-rose-600 text-xl font-black px-3 py-1.5 rounded-lg shadow-md min-w-[40px] text-center tracking-wider">{String(minutes).padStart(2, '0')}</div>
                        <span className="text-white font-black text-xl animate-pulse">:</span>
                        <div className="bg-white text-rose-600 text-xl font-black px-3 py-1.5 rounded-lg shadow-md min-w-[40px] text-center tracking-wider">{String(seconds).padStart(2, '0')}</div>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  {(!hideWedding && !hideNormal) && (
                    <div className="mt-4 inline-flex rounded-full p-1 gap-1" style={{ background: "rgba(236,72,153,0.1)" }}>
                      {(["normal", "wedding"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTab(t)}
                          className="rounded-full px-5 py-1.5 text-xs font-bold transition-all"
                          style={tab === t ? {
                            background: "linear-gradient(135deg, #f43f5e, #ec4899)",
                            color: "#fff",
                            boxShadow: "0 2px 10px rgba(244,63,94,0.35)",
                          } : { color: "#ec4899" }}
                        >
                          {t === "normal" ? "Thiệp Kỷ Niệm" : "Thiệp Cưới"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="px-5 pb-4">
                  {tab === "normal" ? (
                    <>
                      {/* Unified Grid Header */}
                      <div className="grid items-end mb-2 px-4 gap-3" style={{ gridTemplateColumns: "1.8fr 1fr 1fr 1fr 1fr" }}>
                        <div></div> {/* Empty for first col */}
                        <div className="col-span-2 text-center">
                          <p className="text-xs font-black uppercase tracking-wider text-rose-400 mb-2">Valentine & Sinh Nhật</p>
                          <div className="flex justify-around px-2">
                            <span className="text-[11px] font-bold text-gray-400">~24h</span>
                            <span className="text-[11px] font-bold text-gray-400">Vài giờ</span>
                          </div>
                        </div>
                        <div className="col-span-2 text-center">
                          <p className="text-xs font-black uppercase tracking-wider text-violet-400 mb-2 flex flex-col items-center gap-0.5">
                            Tỏ Tình & Xin Lỗi
                            <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-white text-[9px] font-black w-fit">GIẢM 20K</span>
                          </p>
                          <div className="flex justify-around px-2">
                            <span className="text-[11px] font-bold text-gray-400">~24h</span>
                            <span className="text-[11px] font-bold text-gray-400">Vài giờ</span>
                          </div>
                        </div>
                      </div>

                      {/* Package rows as cards */}
                      <div className="flex flex-col gap-3">
                        {PACKAGES.map((pkg) => (
                          <div
                            key={pkg.tier}
                            className="grid items-center gap-3 rounded-2xl px-4 py-4 transition-all hover:scale-[1.01]"
                            style={{
                              background: "white",
                              gridTemplateColumns: "1.8fr 1fr 1fr 1fr 1fr",
                              border: pkg.popular ? "2px solid rgba(236,72,153,0.4)" : "1.5px solid rgba(236,72,153,0.1)",
                              boxShadow: pkg.popular ? "0 8px 24px rgba(236,72,153,0.15)" : "0 2px 8px rgba(0,0,0,0.04)",
                            }}
                          >
                            {/* Package info */}
                            <div className="col-span-1 flex flex-col justify-center">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-xs font-bold text-gray-300">{pkg.tier}</span>
                                <span className="text-base sm:text-lg font-black text-gray-800">{pkg.name}</span>
                                {pkg.popular && (
                                  <span className="rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider" style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899)", color: "#fff" }}>
                                    Hot
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 leading-relaxed pr-2">{pkg.desc}</p>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                              <p className="text-[11px] font-semibold text-gray-400 line-through leading-none mb-1">{pkg.oldValentine[0]}</p>
                              <p className="text-lg sm:text-xl font-black text-rose-500 leading-tight">{pkg.valentine[0]}</p>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                              <p className="text-[11px] font-semibold text-gray-400 line-through leading-none mb-1">{pkg.oldValentine[1]}</p>
                              <p className="text-lg sm:text-xl font-black text-rose-400 leading-tight">{pkg.valentine[1]}</p>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                              <p className="text-[11px] font-semibold text-gray-400 line-through leading-none mb-1">{pkg.oldDating[0]}</p>
                              <p className="text-lg sm:text-xl font-black text-violet-500 leading-tight">{pkg.dating[0]}</p>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                              <p className="text-[11px] font-semibold text-gray-400 line-through leading-none mb-1">{pkg.oldDating[1]}</p>
                              <p className="text-lg sm:text-xl font-black text-violet-400 leading-tight">{pkg.dating[1]}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-2 mb-2 ml-[50%]">
                        <p className="text-center text-[9px] font-semibold text-gray-400">~24h</p>
                        <p className="text-center text-[9px] font-semibold text-gray-400">Vài giờ</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {WEDDING.map((pkg) => (
                          <div
                            key={pkg.tier}
                            className="grid items-center gap-3 rounded-2xl px-4 py-3 hover:scale-[1.01] transition-all"
                            style={{
                              background: "white",
                              gridTemplateColumns: "1fr 90px 90px",
                              border: pkg.popular ? "1.5px solid rgba(236,72,153,0.3)" : "1.5px solid rgba(236,72,153,0.08)",
                              boxShadow: pkg.popular ? "0 2px 16px rgba(236,72,153,0.1)" : "0 1px 6px rgba(0,0,0,0.04)",
                            }}
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-bold text-gray-300">{pkg.tier}</span>
                                <span className="text-sm font-black text-gray-800">{pkg.name}</span>
                                {pkg.popular && (
                                  <span className="rounded-full px-2 py-0.5 text-[8px] font-black" style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899)", color: "#fff" }}>Hot</span>
                                )}
                              </div>
                              <p className="text-[10px] text-gray-400 mt-0.5 ml-5 leading-snug">{pkg.desc}</p>
                            </div>
                            <p className="text-base font-black text-rose-500 text-center">{pkg.prices[0]}</p>
                            <p className="text-base font-black text-rose-400 text-center">{pkg.prices[1]}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <p className="mt-3 text-[10px] text-gray-400 text-center">
                    Mỗi gói có giới hạn chỉnh sửa miễn phí · Sửa thêm sau khi chốt: <strong className="text-gray-500">19K / lần</strong>
                  </p>
                </div>

                {/* Footer */}
                <div className="px-5 py-3.5 border-t flex items-center justify-between gap-4" style={{ borderColor: "rgba(236,72,153,0.1)", background: "rgba(255,255,255,0.6)" }}>
                  <p className="text-xs text-gray-400">Có thắc mắc? Nhắn shop — phản hồi nhanh!</p>
                  <button
                    onClick={() => window.open("https://m.me/lovoraofficial", "_blank")}
                    className="rounded-full px-5 py-2 text-sm font-bold text-white hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                    style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899, #a855f7)", boxShadow: "0 4px 16px rgba(244,63,94,0.35)" }}
                  >
                    Nhắn shop ngay ✨
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
