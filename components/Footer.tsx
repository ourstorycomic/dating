import Link from "next/link";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/40 bg-white/30 backdrop-blur-xl pt-16 pb-8 text-[#5a3a4e]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 md:grid-cols-3 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-[#321a32]" href="/">
              <img src="/favicon.ico" alt="Lovora Logo" className="h-10 w-10 rounded-[12px] shadow-[0_10px_24px_rgba(255,143,199,0.38)]" />
              <span>Lovora</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#76556d]">
              Gói một lời yêu thành chiếc web nhỏ xinh. Trao gửi cảm xúc chân thành qua những tương tác lãng mạn.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="https://web.facebook.com/lovoraofficial/" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/60 p-2 text-[#c04b86] transition-colors hover:bg-[#c04b86] hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://www.instagram.com/lovora.ilx/" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/60 p-2 text-[#c04b86] transition-colors hover:bg-[#c04b86] hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-extrabold text-[#321a32]">Sản phẩm</h4>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li><a href="#" className="transition-colors hover:text-[#c04b86]">Mẫu Valentine</a></li>
              <li><a href="#" className="transition-colors hover:text-[#c04b86]">Mẫu Sinh nhật</a></li>
              <li><a href="#" className="transition-colors hover:text-[#c04b86]">Mẫu Hẹn hò</a></li>
              <li><a href="#" className="transition-colors hover:text-[#c04b86]">Thiết kế theo yêu cầu</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-[#321a32]">Hỗ trợ</h4>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li><a href="https://web.facebook.com/lovoraofficial/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#c04b86]">Đặt hàng</a></li>
              <li><a href="https://web.facebook.com/lovoraofficial/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#c04b86]">Tư vấn trực tiếp</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-white/40 pt-6 text-center flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-sm text-[#76556d]">© {new Date().getFullYear()} Lovora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
