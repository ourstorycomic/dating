import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FACEBOOK_URL } from "@/lib/constants";
import { InteractiveTemplatePreview } from "@/components/templates/InteractiveTemplatePreview";
import { MessengerButton } from "@/components/MessengerButton";
import { WeddingGallery } from "@/components/wedding/WeddingGallery";
import { getPublishedTemplates } from "@/lib/supabase/server";

export const revalidate = 300;

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

export default async function WeddingLandingPage() {
  const templates = await getPublishedTemplates();
  const weddingTemplates = templates.filter((t: any) => {
    const searchable = `${t.component_key} ${t.name} ${t.slug}`.toLowerCase();
    return searchable.includes("wedding");
  });

  const videoSamples = weddingTemplates.filter((t: any) => t.component_key?.includes("videowedding"));
  const normalSamples = weddingTemplates.filter((t: any) => !t.component_key?.includes("videowedding"));

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A4542] font-sans selection:bg-[#E8D9C8] selection:text-[#4A4542]">
      <style>{`
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
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
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
            </div>

            <div className="relative flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-8 duration-700 delay-200 fill-mode-both">
              <div className="relative w-full max-w-[320px] lg:max-w-[340px] transform-gpu hover:scale-[1.01] transition-transform duration-700">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#E8D9C8]/40 to-[#F0DFE3]/50 blur-3xl rounded-full opacity-60" />
                <div className="relative shadow-[0_30px_80px_rgba(0,0,0,0.08)] rounded-[2.5rem] ring-1 ring-black/5 bg-white">
                  <InteractiveTemplatePreview componentKey="wedding-1" compact={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-sans-clean">

        <WeddingGallery videoSamples={videoSamples} normalSamples={normalSamples} />

        {/* Why Us Section */}
        <section id="why-us" className="mt-28 mb-16">
          <div className="text-center mb-16">
            <h2 className="font-serif-elegant text-3xl font-semibold text-[#2D2A28] sm:text-4xl mb-4">Lý do chọn Lovora</h2>
            <p className="text-[#7A726D] max-w-2xl mx-auto">Chăm chút từng chi tiết nhỏ nhất để mang đến trải nghiệm tuyệt vời cho ngày trọng đại.</p>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              { title: "Thiết Kế Tinh Tế", desc: "Bộ sưu tập mẫu thiệp được thiết kế tỉ mỉ, sang trọng, đón đầu xu hướng thẩm mỹ hiện đại.", icon: "✨" },
              { title: "Dễ Dàng Tùy Biến", desc: "Chỉ vài thao tác đơn giản, bạn có ngay một trang thiệp mang đậm phong cách cá nhân.", icon: "🎨" },
              { title: "Chia Sẻ Nhanh Chóng", desc: "Gửi thiệp đến hàng trăm khách mời chỉ với một đường link duy nhất, hiển thị mượt mà trên mọi thiết bị.", icon: "🚀" }
            ].map((item, i) => (
              <div key={i} className="text-center p-8 rounded-3xl bg-white border border-[#F4EFEA] hover:shadow-[0_12px_40px_rgba(45,42,40,0.06)] transition-all duration-300">
                <div className="w-16 h-16 mx-auto bg-[#FDFBF7] rounded-full flex items-center justify-center text-2xl mb-6 shadow-sm border border-[#E8D9C8]/50">{item.icon}</div>
                <h3 className="font-serif-elegant text-xl font-bold mb-3 text-[#2D2A28]">{item.title}</h3>
                <p className="text-[#7A726D] leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Packages Section */}
        <section id="packages" className="mt-28 relative">
          <div className="absolute inset-0 bg-[#C5A880]/5 rounded-[3rem] -z-10 transform -rotate-1" />
          <div className="text-center mb-16 pt-10">
            <h2 className="font-serif-elegant text-3xl font-semibold text-[#2D2A28] sm:text-4xl mb-4">Bảng Giá Dịch Vụ</h2>
            <p className="text-[#7A726D] max-w-2xl mx-auto">Chọn gói dịch vụ phù hợp nhất với nhu cầu của bạn.</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {packages.map((pkg, i) => (
              <div key={i} className={`relative flex flex-col rounded-[2rem] bg-white p-8 shadow-[0_8px_30px_rgba(45,42,40,0.04)] border ${pkg.featured ? 'border-[#C5A880] ring-1 ring-[#C5A880]/50 transform md:-translate-y-4' : 'border-[#F4EFEA]'} transition-all hover:shadow-[0_20px_50px_rgba(45,42,40,0.08)]`}>
                {pkg.featured && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#C5A880] px-4 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-sm">
                    Phổ Biến Nhất
                  </span>
                )}
                <div className="flex-1">
                  <h3 className="font-serif-elegant text-xl font-bold mb-2 text-[#2D2A28]">{pkg.name}</h3>
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
            <div>
              <Link href="/" className="inline-block mb-6">
                <img src="/favicon.ico" alt="Lovora Logo" className="h-10 w-10 rounded-xl shadow-sm" />
              </Link>
              <p className="text-sm text-[#7A726D] leading-relaxed">
                Lovora Wedding – Nơi khởi đầu hoàn hảo cho ngày chung đôi. Chúng tôi mang đến giải pháp thiệp cưới online sang trọng, tinh tế và trọn vẹn cảm xúc nhất.
              </p>
            </div>
            <div>
              <h3 className="font-serif-elegant font-bold text-lg text-[#2D2A28] mb-6">Khám phá</h3>
              <ul className="space-y-4 text-sm text-[#7A726D]">
                <li><a href="#hero" className="transition hover:text-[#C5A880]">Về chúng tôi</a></li>
                <li><a href="#samples" className="transition hover:text-[#C5A880]">Mẫu thiệp</a></li>
                <li><a href="#packages" className="transition hover:text-[#C5A880]">Bảng giá</a></li>
                <li><a href="#why-us" className="transition hover:text-[#C5A880]">Câu hỏi thường gặp</a></li>
              </ul>
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
