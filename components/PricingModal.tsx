"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export function PricingModal({ customTrigger }: { customTrigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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
              className="relative w-full max-w-3xl max-h-[95vh] overflow-y-auto no-scrollbar rounded-[2.5rem] bg-gradient-to-br from-white via-[#fff5fb] to-[#ffe5f3] p-5 shadow-[0_30px_60px_-15px_rgba(255,126,184,0.4)] md:p-8 border-[4px] border-white ring-4 ring-pink-100"
            >
              {/* Decorative background shapes */}
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-pink-200 to-pink-100 blur-2xl opacity-60"></div>
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr from-purple-200 to-pink-100 blur-2xl opacity-60"></div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-xl font-black text-pink-400 shadow-sm transition-all hover:bg-pink-500 hover:text-white hover:scale-110 active:scale-95"
              >
                ✕
              </button>
              
              <div className="relative z-10 text-center mb-8">
                <h3 className="inline-flex items-center gap-3 text-3xl font-black text-[#ff59ab] drop-shadow-sm">
                  <span className="text-4xl animate-bounce-slow">✨</span>
                  BẢNG GIÁ DỊCH VỤ
                  <span className="text-4xl animate-bounce-slow" style={{ animationDelay: '0.5s' }}>✨</span>
                </h3>
                <p className="mt-2 text-[#a37c93] font-medium text-sm">Cùng Lovora tạo nên những món quà đầy ý nghĩa nhé!</p>
              </div>
              
              <div className="relative z-10 overflow-hidden rounded-3xl bg-white/80 shadow-inner backdrop-blur-sm border border-pink-100">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-left border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-pink-50 to-purple-50">
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-[13px] sm:text-sm font-extrabold text-[#7b536b] w-1/2 uppercase tracking-wide rounded-tl-3xl">Gói Dịch Vụ</th>
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-[13px] sm:text-sm font-extrabold text-[#7b536b] w-1/4 uppercase tracking-wide">
                          <div className="flex items-center gap-2">Làm Thường</div>
                          <span className="block text-[10px] sm:text-[11px] font-semibold normal-case text-[#a37c93] mt-1">(Xong trong 24h)</span>
                        </th>
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-[13px] sm:text-sm font-extrabold text-[#7b536b] w-1/4 uppercase tracking-wide rounded-tr-3xl">
                          <div className="flex items-center gap-2">Làm Gấp</div>
                          <span className="block text-[10px] sm:text-[11px] font-semibold normal-case text-[#a37c93] mt-1">(Xong trong vài giờ)</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-100/50 text-[#321a32]">
                      <tr className="transition-all hover:bg-white hover:shadow-[0_4px_15px_rgba(255,182,193,0.15)] group relative">
                        <td className="px-4 py-4 sm:px-6 sm:py-5 pr-4">
                          <p className="text-sm sm:text-base font-black flex items-center gap-2">
                            GÓI 1: THEO MẪU
                          </p>
                          <p className="mt-1 text-[13px] sm:text-sm font-medium text-[#76556d] leading-relaxed">Dành cho bạn đã chuẩn bị sẵn nội dung. Nhận link web y hệt mẫu có sẵn.</p>
                        </td>
                        <td className="px-4 py-4 sm:px-6 sm:py-5 text-base sm:text-lg font-black text-[#ff59ab]">59K</td>
                        <td className="px-4 py-4 sm:px-6 sm:py-5 text-base sm:text-lg font-black text-[#ff59ab]">Từ 88K</td>
                      </tr>
                      <tr className="transition-all bg-pink-50/30 hover:bg-white hover:shadow-[0_4px_15px_rgba(255,182,193,0.15)] group relative">
                        <td className="px-4 py-4 sm:px-6 sm:py-5 pr-4">
                          <p className="text-sm sm:text-base font-black flex flex-wrap items-center gap-2">
                            GÓI 2: CHỈNH CẢM XÚC
                            <span className="inline-flex animate-pulse items-center rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-2 py-0.5 text-[9px] font-bold uppercase text-white shadow-sm">Hot nhất</span>
                          </p>
                          <p className="mt-1 text-[13px] sm:text-sm font-medium text-[#76556d] leading-relaxed">Sắp xếp ảnh, mông má lại câu chữ cho hợp cảm xúc. Hỗ trợ chỉnh sửa 1 lần.</p>
                        </td>
                        <td className="px-4 py-4 sm:px-6 sm:py-5 text-base sm:text-lg font-black text-[#ff59ab]">99K</td>
                        <td className="px-4 py-4 sm:px-6 sm:py-5 text-base sm:text-lg font-black text-[#ff59ab]">Từ 128K</td>
                      </tr>
                      <tr className="transition-all hover:bg-white hover:shadow-[0_4px_15px_rgba(255,182,193,0.15)] group relative">
                        <td className="px-4 py-4 sm:px-6 sm:py-5 pr-4">
                          <p className="text-sm sm:text-base font-black flex items-center gap-2">
                            GÓI 3: ĐẶC BIỆT
                          </p>
                          <p className="mt-1 text-[13px] sm:text-sm font-medium text-[#76556d] leading-relaxed">Tư vấn concept riêng, viết lời nhắn sâu sắc. Ưu tiên hoàn thành, hỗ trợ chỉnh sửa 2 lần.</p>
                        </td>
                        <td className="px-4 py-4 sm:px-6 sm:py-5 text-base sm:text-lg font-black text-[#ff59ab]">149K</td>
                        <td className="px-4 py-4 sm:px-6 sm:py-5 text-base sm:text-lg font-black text-[#ff59ab]">Từ 178K</td>
                      </tr>
                      <tr className="transition-all bg-yellow-50/50 hover:bg-white hover:shadow-[0_4px_15px_rgba(255,182,193,0.15)] group relative border-t-2 border-dashed border-pink-200">
                        <td className="px-4 py-4 sm:px-6 sm:py-5 pr-4" colSpan={3}>
                          <p className="text-[13px] sm:text-sm font-black flex items-center gap-2 text-[#7b536b]">
                            ⚠️ LƯU Ý VỀ CHỈNH SỬA
                          </p>
                          <p className="mt-1 text-[12px] sm:text-[13px] font-medium text-[#76556d] leading-relaxed">
                            Mỗi gói có giới hạn số lần sửa miễn phí. Sau khi chốt đơn, mọi yêu cầu chỉnh sửa thêm sẽ tính phí <b className="text-[#ff59ab]">19K / lần</b>.
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center relative z-10">
                <a
                  className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#ff7eb8] via-[#ff6b9d] to-[#ffd36f] p-[3px] shadow-[0_14px_30px_rgba(255,126,184,0.35)] transition-all hover:scale-105 active:scale-95"
                  href="https://m.me/lovoraofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="relative flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff7eb8] to-[#ffb347] px-10 py-4 transition-all group-hover:bg-opacity-0">
                    <span className="text-base font-black text-white">Nhắn shop làm ngay!</span>
                  </div>
                  <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
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
