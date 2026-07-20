'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import { FACEBOOK_URL } from "@/lib/constants";
import { InteractiveTemplatePreview } from "@/components/templates/InteractiveTemplatePreview";
import { useState } from "react";
import { MessengerButton } from "@/components/MessengerButton";

function SampleCard({ sample, index }: { sample: any; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article 
      initial={{ opacity: 0, y: 24 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, amount: 0.2 }} 
      transition={{ duration: 0.5, delay: index * 0.1 }} 
      className="group overflow-hidden rounded-[2.5rem] bg-white shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-[#F4EFEA] transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-[480px] overflow-hidden bg-[#FDFBF7]">
        {hovered && sample.componentKey ? (
          <div className="absolute inset-0 z-10 bg-black/5 [&>div>div]:!rounded-b-none pointer-events-none">
            <InteractiveTemplatePreview
              noFrame
              compact
              componentKey={sample.componentKey}
              hideNavigation={true}
              forceRandomMusic={true}
              isActive={hovered}
            />
          </div>
        ) : (
          <>
            <img src={sample.image} alt={sample.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute left-6 bottom-6">
              <span className="rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#4A4542]">{sample.tag}</span>
            </div>
          </>
        )}
      </div>
      <div className="p-8 flex flex-col flex-1">
        <h3 className="font-serif-elegant text-2xl font-semibold text-[#2D2A28]">{sample.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-[#7A726D]">{sample.description}</p>
        <div className="mt-auto pt-8">
          <div className="flex gap-3 border-t border-[#F4EFEA] pt-6">
            <Link href={`/wedding/preview/${sample.componentKey}`} className="flex-1 text-center py-2.5 rounded-full border border-[#E8D9C8] text-[#4A4542] text-sm font-semibold transition hover:bg-[#FDFBF7] hover:text-[#2D2A28]">
              Xem chi tiết
            </Link>
            <a href={facebookLink(sample.name)} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2.5 rounded-full bg-[#C5A880] text-[#2D2A28] text-sm font-bold shadow-sm transition hover:bg-[#B3966D]">
              Nhắn tin tư vấn
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

const samples = [
  {
    name: "Classic Elegance",
    tag: "Được yêu thích",
    description: "Template cưới sang trọng, thanh lịch với thiết kế tinh giản, kết hợp màu sắc nhẹ nhàng cùng các tính năng tiện ích như form xác nhận tham dự, Countdown và Album ảnh.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
    componentKey: "wedding-1",
  },
  {
    name: "Traditional Oriental",
    tag: "Trending",
    description: "Mẫu thiệp mang đậm âm hưởng Á Đông truyền thống với sắc đỏ rực rỡ, họa tiết chữ Hỷ và hiệu ứng mở cửa mượt mà.",
    image: "/assets/wedding/wedding-2/anhchung2.jpg",
    componentKey: "wedding-2",
  },
  {
    name: "Floral Garden",
    tag: "Lãng mạn",
    description: "Tone đỏ thắm và vàng ánh kim cao cấp kết hợp họa tiết cổ điển, tạo nên một bản giao hưởng sang trọng nhưng đầy ấm áp cho ngày chung đôi.",
    image: "/assets/wedding/wedding-3/anhchung.jpg",
    componentKey: "wedding-3",
  },
  {
    name: "Royal Envelope",
    tag: "Mới ra mắt",
    description: "Thiết kế dạng phong thư sang trọng với con dấu sáp vàng hoàng gia. Hiệu ứng mở thư độc đáo mang lại trải nghiệm đầy bất ngờ và đẳng cấp.",
    image: "/assets/wedding-4/matsauthu.webp",
    componentKey: "wedding-4",
  },
  {
    name: "Lotus Serenity",
    tag: "Truyền thống",
    description: "Mang nét đẹp thanh tao của đóa hoa sen mộc mạc kết hợp cùng màu sắc nhã nhặn, tạo nên một phong cách thiệp cưới truyền thống nhưng không kém phần thanh lịch.",
    image: "/assets/wedding/wedding-5/anhchung.jpg",
    componentKey: "wedding-5",
  },
  {
    name: "Pure Elegance",
    tag: "Tối giản",
    description: "Thiết kế tối giản và thanh lịch với điểm nhấn họa tiết hoa nhạt mộc mạc, hiệu ứng mở cánh cửa mượt mà tinh tế.",
    image: "/assets/wedding/wedding-6/anhchung.jpg",
    componentKey: "wedding-6",
  },
];

const packages = [
  {
    name: "Gói Cơ bản (1 thiệp)",
    price: "139.000đ",
    description: "Dành cho 1 thiệp (Nhà Trai HOẶC Nhà Gái)",
    features: ["Làm thường (2-3 ngày): 139.000đ", "Làm gấp (<24h): 189.000đ", "Có nhạc nền", "Form xác nhận tham dự"],
    featured: false,
  },
  {
    name: "Gói Trọn vẹn (Thiệp chung)",
    price: "209.000đ",
    description: "1 thiệp dùng chung cho cả Nhà Trai & Nhà Gái (gồm thông tin lễ, tiệc cả 2 nhà)",
    features: ["Làm thường (2-3 ngày): 209.000đ", "Làm gấp (<24h): 279.000đ", "Chỉnh sửa nội dung cơ bản", "Đầy đủ nhạc & Form xác nhận"],
    featured: true,
  },
  {
    name: "Gói Song hành (Combo 2 thiệp)",
    price: "239.000đ",
    description: "Combo 2 thiệp riêng biệt (1 Nhà Trai + 1 Nhà Gái)",
    features: ["Chung mẫu: 239k (Gấp: 319k)", "Khác mẫu: 269k (Gấp: 359k)", "Chỉnh sửa nội dung cơ bản", "Đầy đủ nhạc & Form xác nhận"],
    featured: false,
  },
];

function facebookLink(templateName?: string) {
  const text = templateName
    ? `Tôi muốn tư vấn mẫu thiệp cưới ${templateName}. Giúp tôi chọn thiết kế cưới đẹp và sang trọng.`
    : "Tôi muốn tư vấn thiệp cưới sang trọng, tinh tế và dễ dàng.";

  return `${FACEBOOK_URL}?text=${encodeURIComponent(text)}`;
}

export default function WeddingLandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A4542] font-sans selection:bg-[#E8D9C8] selection:text-[#4A4542]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
        
        .font-serif-elegant {
          font-family: 'Playfair Display', serif;
        }
        
        .font-sans-clean {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#E8D9C8]/40 bg-[#FDFBF7]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-[#4A4542]">
            <img src="/favicon.ico" alt="Lovora Logo" className="h-10 w-10 rounded-xl shadow-sm" />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[#7A726D] md:flex">
            <a href="#hero" className="transition hover:text-[#C5A880]">Trang chủ</a>
            <a href="#samples" className="transition hover:text-[#C5A880]">Mẫu thiệp</a>
            <a href="#why-us" className="transition hover:text-[#C5A880]">Lợi ích</a>
            <a href="#packages" className="transition hover:text-[#C5A880]">Bảng giá</a>
          </nav>

          <a
            href={facebookLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#C5A880] px-6 py-2.5 text-sm font-semibold text-[#2D2A28] shadow-sm transition hover:bg-[#B3966D]"
          >
            Tạo thiệp ngay
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative w-full overflow-hidden bg-white border-b border-[#E8D9C8]/40">
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-20 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(232,217,200,0.2),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(240,223,227,0.3),_transparent_40%)]" />
          
          <div className="relative grid gap-12 lg:grid-cols-2 items-center">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C5A880] mb-4">Lovora Wedding</p>
              <h1 className="font-serif-elegant text-5xl leading-[1.15] text-[#2D2A28] sm:text-6xl lg:text-[4rem]">
                Khởi đầu hoàn hảo cho <span className="italic text-[#C5A880]">ngày chung đôi.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#7A726D]">
                Tạo thiệp cưới online độc bản, mang đậm dấu ấn cá nhân và gửi trao lời mời trân trọng đến những người thân yêu nhất một cách dễ dàng, nhanh chóng.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a href="#samples" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C5A880] px-8 py-4 text-base font-medium text-white shadow-[0_10px_30px_rgba(197,168,128,0.25)] transition hover:bg-[#B3966D]">
                  Khám phá mẫu thiệp
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#packages" className="inline-flex items-center justify-center rounded-full border border-[#E8D9C8] bg-transparent px-8 py-4 text-base font-medium text-[#4A4542] transition hover:bg-[#FDFBF7]">
                  Xem bảng giá
                </a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }} className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[320px] lg:max-w-[340px] transform-gpu hover:scale-[1.01] transition-transform duration-700">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#E8D9C8]/40 to-[#F0DFE3]/50 blur-3xl rounded-full opacity-60" />
                <div className="relative shadow-[0_30px_80px_rgba(0,0,0,0.08)] rounded-[2.5rem] ring-1 ring-black/5 bg-white">
                  <InteractiveTemplatePreview componentKey="wedding-1" compact={true} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-sans-clean">

        {/* Samples Section */}
        <section id="samples" className="mt-24">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between text-center md:text-left">
            <div>
              <h2 className="font-serif-elegant text-3xl text-[#2D2A28] sm:text-4xl">Câu chuyện tình yêu qua từng thiết kế</h2>
              <p className="mt-4 text-[#7A726D] max-w-2xl text-base">Những mẫu thiệp cưới được chăm chút từng chi tiết, lãng mạn và tinh tế.</p>
            </div>
            <a href={facebookLink("thiệp cưới")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#C5A880] transition hover:text-[#B3966D] mx-auto md:mx-0 mt-4 md:mt-0">
              Nhận tư vấn thiết kế riêng →
            </a>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3 justify-center">
            {samples.map((sample, index) => (
              <SampleCard key={sample.name} sample={sample} index={index} />
            ))}
          </div>
        </section>

        <section id="why-us" className="mt-28">
           <h2 className="font-serif-elegant text-3xl text-[#2D2A28] sm:text-4xl text-center mb-16">Vì sao chọn Lovora?</h2>
           <div className="grid gap-8 lg:grid-cols-3">
            {[
              ["Đội ngũ thiết kế tận tâm", "Bạn không cần tự thao tác phức tạp. Chỉ cần gửi thông tin, hình ảnh và lời mời, nhân viên của Lovora sẽ trực tiếp chỉnh sửa và hoàn thiện thiệp cưới cho bạn từ A-Z một cách nhanh chóng, chỉn chu nhất."],
              ["Quản lý khách mời thảnh thơi", "Tạm biệt cảnh gọi điện xác nhận từng người. Form phản hồi tự động giúp dâu rể nắm bắt chính xác số lượng khách tham dự và lời chúc chỉ với vài cú chạm."],
              ["Đồng hành trọn vẹn ngày vui", "Website thiệp cưới sẽ được đội ngũ Lovora thiết lập và duy trì hoạt động mượt mà trong suốt thời gian diễn ra sự kiện cưới của hai bạn, đảm bảo khách mời luôn cập nhật thông tin dễ dàng."],
            ].map(([title, copy], i) => (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={title} className="rounded-[2rem] bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-[#F4EFEA]">
                <h3 className="font-serif-elegant text-xl font-semibold text-[#2D2A28]">{title}</h3>
                <p className="mt-4 text-base leading-relaxed text-[#7A726D]">{copy}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Packages */}
        <section id="packages" className="mt-32 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif-elegant text-3xl text-[#2D2A28] sm:text-4xl lg:text-5xl">Lựa chọn hoàn hảo cho ngày vui của bạn</h2>
            <p className="mt-6 text-base leading-relaxed text-[#7A726D]">
              Bảng giá công khai, minh bạch. Tùy chọn đa dạng để đáp ứng mọi nhu cầu gửi lời mời cưới của cặp đôi.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <div key={pkg.name} className={`flex flex-col rounded-[2.5rem] p-8 transition-all hover:-translate-y-2 bg-white ${pkg.featured ? "shadow-[0_20px_60px_rgba(197,168,128,0.15)] border-2 border-[#C5A880]/50 scale-[1.03]" : "shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-[#F4EFEA]"}`}>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <p className="font-serif-elegant text-xl font-semibold text-[#2D2A28]">{pkg.name}</p>
                    {pkg.featured && <span className="rounded-full bg-gradient-to-r from-[#FDFBF7] to-[#F4EFEA] border border-[#C5A880]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#C5A880] shadow-sm">Được yêu thích nhất</span>}
                  </div>
                  <p className="text-sm mb-6 text-[#7A726D]">{pkg.description}</p>
                  <p className="text-4xl font-serif-elegant font-semibold mb-8 text-[#2D2A28]">{pkg.price}</p>
                  
                  <ul className="space-y-4 text-sm text-[#4A4542]">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 bg-[#C5A880]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8 flex flex-col gap-3">
                  <a href={facebookLink(pkg.name)} target="_blank" rel="noopener noreferrer" className="w-full block text-center rounded-full py-4 text-sm font-bold bg-[#C5A880] text-[#2D2A28] shadow-[0_4px_14px_rgba(197,168,128,0.25)] transition hover:bg-[#B3966D] hover:-translate-y-0.5">
                    Chọn & Nhắn Page
                  </a>
                  <a href="#why-us" className="w-full block text-center rounded-full py-3.5 text-sm font-semibold border border-[#E8D9C8] text-[#7A726D] transition hover:bg-[#FDFBF7] hover:text-[#2D2A28]">
                    Xem chi tiết
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 max-w-4xl mx-auto rounded-[2.5rem] bg-white border border-[#F4EFEA] shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-10 text-sm text-[#7A726D]">
            <h3 className="font-serif-elegant text-xl text-[#2D2A28] mb-6 font-semibold">Dịch vụ đi kèm & Lưu ý</h3>
            <ul className="grid gap-5 md:grid-cols-2">
              <li className="flex gap-3"><span className="text-[#C5A880]">✦</span> Làm thiệp bổ sung từ thẻ thứ 3 trở đi (VD: thiệp báo hỷ): 85.000đ / Thiệp</li>
              <li className="flex gap-3"><span className="text-[#C5A880]">✦</span> Tùy chỉnh nội dung chuyên sâu (VD: thay ảnh, timeline, dresscode): 45.000đ / Yêu cầu</li>
              <li className="flex gap-3"><span className="text-[#C5A880]">✦</span> Đổi mẫu sau khi hoàn thiện: Sẽ áp dụng tính theo giá Làm gấp.</li>
              <li className="flex gap-3 md:col-span-2"><span className="text-[#C5A880]">✦</span> Chính sách chỉnh sửa: Hỗ trợ miễn phí 3 lần đầu. Từ lần thứ 4 trở đi, tính phí 10% giá trị đơn hàng / Lần (Không tính phí nếu lỗi sai thông tin từ phía chúng tôi).</li>
            </ul>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="mt-28 mb-10 text-center">
           <div className="max-w-3xl mx-auto rounded-[3rem] bg-white p-12 sm:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-[#E8D9C8]/40">
              <h2 className="font-serif-elegant text-3xl font-medium text-[#2D2A28] sm:text-4xl">
                Khởi đầu hoàn hảo cho một chặng đường mới.
              </h2>
              <p className="mt-6 mb-10 text-base text-[#7A726D] max-w-lg mx-auto">
                Hãy để Lovora giúp bạn gửi gắm những yêu thương trọn vẹn nhất đến khách mời của mình qua từng thiết kế tinh xảo.
              </p>
              <a
                href={facebookLink("thiệp cưới premium")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#C5A880] px-10 py-4 text-base font-medium text-white shadow-lg shadow-[#C5A880]/20 transition hover:bg-[#B3966D] hover:-translate-y-1"
              >
                Nhận tư vấn ngay
              </a>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#FAFAFA] border-t border-[#E8D9C8]/40 pt-20 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 font-sans-clean">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {/* Cột 1 */}
            <div>
              <Link href="/" className="inline-block mb-6">
                <img src="/favicon.ico" alt="Lovora Logo" className="h-10 w-10 rounded-xl shadow-sm" />
              </Link>
              <p className="text-sm text-[#7A726D] leading-relaxed">
                Lovora Wedding – Nơi khởi đầu hoàn hảo cho ngày chung đôi. Chúng tôi mang đến giải pháp thiệp cưới online sang trọng, tinh tế và trọn vẹn cảm xúc nhất.
              </p>
            </div>
            {/* Cột 2 */}
            <div>
              <h3 className="font-serif-elegant font-bold text-lg text-[#2D2A28] mb-6">Khám phá</h3>
              <ul className="space-y-4 text-sm text-[#7A726D]">
                <li><a href="#hero" className="transition hover:text-[#C5A880]">Về chúng tôi</a></li>
                <li><a href="#samples" className="transition hover:text-[#C5A880]">Mẫu thiệp</a></li>
                <li><a href="#packages" className="transition hover:text-[#C5A880]">Bảng giá</a></li>
                <li><a href="#why-us" className="transition hover:text-[#C5A880]">Câu hỏi thường gặp</a></li>
              </ul>
            </div>
            {/* Cột 3 */}
            <div>
              <h3 className="font-serif-elegant font-bold text-lg text-[#2D2A28] mb-6">Kết nối</h3>
              <div className="flex items-center gap-4">
                <a href="https://web.facebook.com/lovoraofficial/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[#E8D9C8]/60 flex items-center justify-center text-[#7A726D] shadow-sm transition hover:bg-[#C5A880] hover:text-white hover:border-[#C5A880]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com/lovora.ilx/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[#E8D9C8]/60 flex items-center justify-center text-[#7A726D] shadow-sm transition hover:bg-[#C5A880] hover:text-white hover:border-[#C5A880]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-[#E8D9C8]/40 pt-8 text-center">
            <p className="text-xs text-[#A89F9A]">© 2026 Lovora Wedding. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      <MessengerButton />
    </div>
  );
}
