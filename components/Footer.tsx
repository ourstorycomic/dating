import Link from "next/link";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 w-full border-t border-white/40 bg-white/30 backdrop-blur-xl pt-16 pb-8 text-[#5a3a4e]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-[#321a32]" href="/">
              <img src="/favicon.ico" alt="Lovora Logo" className="h-10 w-10 rounded-[12px] shadow-[0_10px_24px_rgba(255,143,199,0.38)]" />
              <span>Lovora</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#76556d]">
              Gói một lời yêu thành chiếc web nhỏ xinh. Trao gửi cảm xúc chân thành qua những tương tác lãng mạn.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="rounded-full bg-white/60 p-2 text-[#c04b86] transition-colors hover:bg-[#c04b86] hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="rounded-full bg-white/60 p-2 text-[#c04b86] transition-colors hover:bg-[#c04b86] hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="rounded-full bg-white/60 p-2 text-[#c04b86] transition-colors hover:bg-[#c04b86] hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-extrabold text-[#321a32]">Sản phẩm</h4>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li><a href="#" className="transition-colors hover:text-[#c04b86]">Mẫu Valentine (Coming soon)</a></li>
              <li><a href="#" className="transition-colors hover:text-[#c04b86]">Mẫu Sinh nhật (Coming soon)</a></li>
              <li><a href="#" className="transition-colors hover:text-[#c04b86]">Mẫu Hẹn hò (Coming soon)</a></li>
              <li><a href="#" className="transition-colors hover:text-[#c04b86]">Thiết kế theo yêu cầu (Coming soon)</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-[#321a32]">Hỗ trợ</h4>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li><a href="#" className="transition-colors hover:text-[#c04b86]">Quy trình đặt hàng (Coming soon)</a></li>
              <li><a href="#" className="transition-colors hover:text-[#c04b86]">Câu hỏi thường gặp (Coming soon)</a></li>
              <li><a href="#" className="transition-colors hover:text-[#c04b86]">Chính sách thanh toán (Coming soon)</a></li>
              <li><a href="#" className="transition-colors hover:text-[#c04b86]">Bảo hành & Hoàn tiền (Coming soon)</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-[#321a32]">Công ty</h4>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li><a href="#" className="transition-colors hover:text-[#c04b86]">Về chúng tôi (Coming soon)</a></li>
              <li><a href="#" className="transition-colors hover:text-[#c04b86]">Liên hệ (Coming soon)</a></li>
              <li><a href="#" className="transition-colors hover:text-[#c04b86]">Điều khoản sử dụng (Coming soon)</a></li>
              <li><a href="#" className="transition-colors hover:text-[#c04b86]">Chính sách bảo mật (Coming soon)</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 border-t border-white/40 pt-8 text-center flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#76556d]">© {new Date().getFullYear()} Lovora. All rights reserved.</p>
          <p className="text-sm font-semibold text-[#c04b86] flex items-center gap-2 justify-center">
            <Mail size={16} /> hi@lovora.vn (Coming soon)
          </p>
        </div>
      </div>
    </footer>
  );
}
