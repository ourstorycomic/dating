"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export function PricingModal({ customTrigger, hideWedding, hideNormal, defaultTab }: { customTrigger?: React.ReactNode, hideWedding?: boolean, hideNormal?: boolean, defaultTab?: 'normal' | 'wedding' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<'normal' | 'wedding'>(defaultTab || (hideWedding ? 'normal' : 'wedding'));

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {customTrigger ? (
        <div onClick={() => setIsOpen(true)} className="cursor-pointer inline-block">
          {customTrigger}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#ffb347] to-[#ff7eb8] px-6 py-2.5 text-center text-sm font-black text-white shadow-[0_8px_20px_rgba(255,126,184,0.4)] transition-all hover:scale-105 hover:shadow-[0_12px_25px_rgba(255,126,184,0.6)] active:scale-95"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            💎 Xem Bảng Giá
          </span>
          <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      )}

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white via-[#fff5fb] to-[#ffe5f3] p-5 shadow-[0_30px_60px_-15px_rgba(255,126,184,0.4)] md:p-6 border-[4px] border-white ring-4 ring-pink-100 flex flex-col max-h-[90vh]"
              >
                {/* Decorative background shapes */}
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-pink-200 to-pink-100 blur-2xl opacity-60"></div>
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr from-purple-200 to-pink-100 blur-2xl opacity-60"></div>

                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(false); }}
                  className="absolute right-5 top-5 z-[100] flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-black text-pink-400 shadow-sm transition-all hover:bg-pink-500 hover:text-white hover:scale-110 active:scale-95 cursor-pointer"
                >
                  ✕
                </button>

                <div className="relative z-10 text-center mb-4 shrink-0 mt-4 sm:mt-0">
                  <h3 className="inline-flex items-center gap-2 text-2xl font-black text-[#ff59ab] drop-shadow-sm">
                    <span className="text-3xl animate-bounce-slow">✨</span>
                    BẢNG GIÁ DỊCH VỤ
                    <span className="text-3xl animate-bounce-slow" style={{ animationDelay: '0.5s' }}>✨</span>
                  </h3>
                  <p className="mt-1 text-[#a37c93] font-medium text-xs sm:text-sm">Cùng Lovora tạo nên những món quà đầy ý nghĩa nhé!</p>
                </div>

                {/* Tabs */}
                {(!hideWedding && !hideNormal) && (
                  <div className="relative z-10 flex justify-center gap-2 mb-4 shrink-0">
                    <button 
                      onClick={() => setTab('wedding')} 
                      className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${tab === 'wedding' ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-md' : 'bg-white text-pink-400 border border-pink-200 hover:bg-pink-50'}`}
                    >
                      Thiệp Cưới
                    </button>
                    <button 
                      onClick={() => setTab('normal')} 
                      className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${tab === 'normal' ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-md' : 'bg-white text-pink-400 border border-pink-200 hover:bg-pink-50'}`}
                    >
                      Thiệp Kỷ Niệm
                    </button>
                  </div>
                )}

                <div className="relative z-10 overflow-y-auto rounded-3xl bg-white/80 shadow-inner backdrop-blur-sm border border-pink-100 flex-1 no-scrollbar">
                  {tab === 'normal' ? (
                    <table className="w-full min-w-[500px] text-left border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-pink-50 to-purple-50 sticky top-0 z-20">
                          <th className="px-3 py-2 sm:px-4 sm:py-3 text-[12px] sm:text-sm font-extrabold text-[#7b536b] w-1/2 uppercase tracking-wide">Gói Dịch Vụ</th>
                          <th className="px-3 py-2 sm:px-4 sm:py-3 text-[12px] sm:text-sm font-extrabold text-[#7b536b] w-1/4 uppercase tracking-wide">
                            <div className="flex items-center gap-1">Làm Thường</div>
                            <span className="block text-[9px] sm:text-[10px] font-semibold normal-case text-[#a37c93] mt-0.5">(2-3 ngày)</span>
                          </th>
                          <th className="px-3 py-2 sm:px-4 sm:py-3 text-[12px] sm:text-sm font-extrabold text-[#7b536b] w-1/4 uppercase tracking-wide">
                            <div className="flex items-center gap-1">Làm Gấp</div>
                            <span className="block text-[9px] sm:text-[10px] font-semibold normal-case text-[#a37c93] mt-0.5">(1-2 ngày)</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-pink-100/50 text-[#321a32]">
                        <tr className="transition-all hover:bg-white group relative">
                          <td className="px-3 py-3 sm:px-4 sm:py-4 pr-3">
                            <p className="text-sm sm:text-base font-black">GÓI 1: THEO MẪU</p>
                            <p className="mt-0.5 text-[11px] sm:text-xs font-medium text-[#76556d] leading-snug">Dành cho bạn đã chuẩn bị sẵn nội dung. Nhận link web y hệt mẫu có sẵn.</p>
                          </td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base font-black text-[#ff59ab]">99K</td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base font-black text-[#ff59ab]">119K</td>
                        </tr>
                        <tr className="transition-all bg-pink-50/30 hover:bg-white group relative">
                          <td className="px-3 py-3 sm:px-4 sm:py-4 pr-3">
                            <p className="text-sm sm:text-base font-black flex items-center gap-2">
                              GÓI 2: CHỈNH CẢM XÚC
                              <span className="inline-flex animate-pulse items-center rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-1.5 py-0.5 text-[8px] font-bold uppercase text-white shadow-sm">Hot nhất</span>
                            </p>
                            <p className="mt-0.5 text-[11px] sm:text-xs font-medium text-[#76556d] leading-snug">Sắp xếp ảnh, mông má lại câu chữ cho hợp cảm xúc. Hỗ trợ chỉnh sửa 1 lần.</p>
                          </td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base font-black text-[#ff59ab]">119K</td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base font-black text-[#ff59ab]">139K</td>
                        </tr>
                        <tr className="transition-all hover:bg-white group relative">
                          <td className="px-3 py-3 sm:px-4 sm:py-4 pr-3">
                            <p className="text-sm sm:text-base font-black">GÓI 3: ĐẶC BIỆT</p>
                            <p className="mt-0.5 text-[11px] sm:text-xs font-medium text-[#76556d] leading-snug">Tư vấn concept riêng, viết lời nhắn sâu sắc. Ưu tiên hoàn thành, hỗ trợ chỉnh sửa 2 lần.</p>
                          </td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base font-black text-[#ff59ab]">179K</td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base font-black text-[#ff59ab]">199K</td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full min-w-[500px] text-left border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-pink-50 to-purple-50 sticky top-0 z-20">
                          <th className="px-3 py-2 sm:px-4 sm:py-3 text-[12px] sm:text-sm font-extrabold text-[#7b536b] w-[45%] uppercase tracking-wide">Gói Thiệp Cưới</th>
                          <th className="px-3 py-2 sm:px-4 sm:py-3 text-[12px] sm:text-sm font-extrabold text-[#7b536b] w-1/4 uppercase tracking-wide">
                            <div className="flex items-center gap-1">Làm Thường</div>
                            <span className="block text-[9px] sm:text-[10px] font-semibold normal-case text-[#a37c93] mt-0.5">(2-3 ngày)</span>
                          </th>
                          <th className="px-3 py-2 sm:px-4 sm:py-3 text-[12px] sm:text-sm font-extrabold text-[#7b536b] w-1/4 uppercase tracking-wide">
                            <div className="flex items-center gap-1">Làm Gấp</div>
                            <span className="block text-[9px] sm:text-[10px] font-semibold normal-case text-[#a37c93] mt-0.5">(1-2 ngày)</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-pink-100/50 text-[#321a32]">
                        <tr className="transition-all hover:bg-white group relative">
                          <td className="px-3 py-3 sm:px-4 sm:py-4 pr-3">
                            <p className="text-sm sm:text-base font-black">GÓI 1 (1 Thiệp Lẻ)</p>
                            <p className="mt-0.5 text-[11px] sm:text-xs font-medium text-[#76556d] leading-snug">Chỉ dành cho nhà Trai <b className="text-[#ff59ab]">HOẶC</b> nhà Gái.</p>
                          </td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base font-black text-[#ff59ab]">139K</td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base font-black text-[#ff59ab]">189K</td>
                        </tr>
                        <tr className="transition-all bg-pink-50/30 hover:bg-white group relative">
                          <td className="px-3 py-3 sm:px-4 sm:py-4 pr-3">
                            <p className="text-sm sm:text-base font-black flex items-center gap-2">
                              GÓI 2 (1 Thiệp Chung)
                              <span className="inline-flex animate-pulse items-center rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-1.5 py-0.5 text-[8px] font-bold uppercase text-white shadow-sm">Phổ biến</span>
                            </p>
                            <p className="mt-0.5 text-[11px] sm:text-xs font-medium text-[#76556d] leading-snug">1 link thiệp tích hợp cho cả 2 bên. Lời mời tự động thay đổi theo người xem.</p>
                          </td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base font-black text-[#ff59ab]">209K</td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base font-black text-[#ff59ab]">279K</td>
                        </tr>
                        <tr className="transition-all hover:bg-white group relative">
                          <td className="px-3 py-3 sm:px-4 sm:py-4 pr-3">
                            <p className="text-sm sm:text-base font-black">GÓI 3 (Combo Chung Mẫu)</p>
                            <p className="mt-0.5 text-[11px] sm:text-xs font-medium text-[#76556d] leading-snug">Nhận 2 link thiệp rời (1 Trai + 1 Gái) nhưng <b className="text-[#ff59ab]">Cùng sử dụng 1 mẫu thiết kế</b>.</p>
                          </td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base font-black text-[#ff59ab]">239K</td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base font-black text-[#ff59ab]">319K</td>
                        </tr>
                        <tr className="transition-all bg-pink-50/30 hover:bg-white group relative">
                          <td className="px-3 py-3 sm:px-4 sm:py-4 pr-3">
                            <p className="text-sm sm:text-base font-black flex items-center gap-2">
                              GÓI 4 (Combo Khác Mẫu)
                              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-400 to-pink-500 px-1.5 py-0.5 text-[8px] font-bold uppercase text-white shadow-sm">Premium</span>
                            </p>
                            <p className="mt-0.5 text-[11px] sm:text-xs font-medium text-[#76556d] leading-snug">Nhận 2 link thiệp rời, được chọn <b className="text-[#ff59ab]">2 mẫu thiết kế hoàn toàn khác nhau</b> cho 2 bên gia đình.</p>
                          </td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base font-black text-[#ff59ab]">269K</td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base font-black text-[#ff59ab]">359K</td>
                        </tr>
                      </tbody>
                    </table>
                  )}

                  {/* Warning Footer inside the container */}
                  <div className="bg-yellow-50/80 border-t-2 border-dashed border-pink-200 px-4 py-3 sticky bottom-0 z-20">
                    <p className="text-[11px] sm:text-xs font-black flex items-center gap-1.5 text-[#7b536b]">
                      ⚠️ LƯU Ý VỀ CHỈNH SỬA
                    </p>
                    <p className="mt-0.5 text-[10px] sm:text-[11px] font-medium text-[#76556d] leading-snug">
                      Mỗi gói có giới hạn số lần sửa miễn phí. Sau khi chốt đơn, mọi yêu cầu chỉnh sửa thêm sẽ tính phí <b className="text-[#ff59ab]">19K / lần</b>.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-center relative z-10 shrink-0">
                  <button
                    className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#ff7eb8] via-[#ff6b9d] to-[#ffd36f] p-[3px] shadow-[0_14px_30px_rgba(255,126,184,0.35)] transition-all hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto"
                    onClick={() => window.open('https://m.me/lovoraofficial', '_blank')}
                  >
                    <div className="relative flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff7eb8] to-[#ffb347] px-8 py-3 transition-all group-hover:bg-opacity-0">
                      <span className="text-sm font-black text-white">Nhắn shop làm ngay!</span>
                    </div>
                    <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
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
