// Cache homepage for 5 minutes — templates rarely change, no need to re-fetch Supabase on every request
export const revalidate = 300;
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { HomePageCatalog } from "@/components/HomePageCatalog";
import { TiltPhonePreview } from "@/components/TiltPhonePreview";
import { Footer } from "@/components/Footer";
import { MessengerButton } from "@/components/MessengerButton";
import { PricingModal } from "@/components/PricingModal";
import { FACEBOOK_URL } from "@/lib/constants";
import { getPublishedTemplates } from "@/lib/supabase/server";

function facebookLink(templateSlug?: string) {
  const text = templateSlug
    ? `Tôi muốn đặt mẫu ${templateSlug}. Tư vấn giúp tôi làm web tặng người yêu.`
    : "Tôi muốn được tư vấn làm web tặng người yêu.";

  return `${FACEBOOK_URL}?text=${encodeURIComponent(text)}`;
}

const categoryOrder = ["valentine", "dating", "birthday", "sorry"];

function getTemplateKind(template: { component_key: string; name: string; slug: string }) {
  const searchable = `${template.component_key} ${template.name} ${template.slug}`.toLowerCase();
  
  if (searchable.includes("wedding")) {
    return "wedding";
  }
  if (
    searchable.includes("dating-1") ||
    searchable.includes("dating #1") ||
    searchable.includes("dating-2") ||
    searchable.includes("dating #2") ||
    searchable.includes("dating-3") ||
    searchable.includes("dating #3") ||
    searchable.includes("gacha") ||
    searchable.includes("will-you-date-me") ||
    searchable.includes("vé hẹn hò") ||
    searchable.includes("mật mã hẹn hò")
  ) {
    return "dating";
  }
  if (
    searchable.includes("birthday") ||
    searchable.includes("phép thuật sinh nhật") ||
    searchable.includes("báo thức diệu kì") ||
    searchable.includes("hộp quà bất ngờ")
  ) {
    return "birthday";
  }
  if (
    searchable.includes("sorry") ||
    searchable.includes("xin loi") ||
    searchable.includes("xin lỗi") ||
    searchable.includes("làm hòa") ||
    searchable.includes("xả giận") ||
    searchable.includes("khủng long")
  ) {
    return "sorry";
  }
  if (
    searchable.includes("valentine") ||
    searchable.includes("starry") ||
    searchable.includes("constellation") ||
    searchable.includes("vũ trụ trái tim") ||
    searchable.includes("trạm phim kỷ niệm") ||
    searchable.includes("nhật ký tình yêu")
  ) {
    return "valentine";
  }
  return "other";
}

const categoryCopy = {
  valentine: {
    name: "Valentine",
    description: "Những món quà lãng mạn, gửi gắm lời yêu thương qua những tương tác bất ngờ nhỏ lấp lánh.",
  },
  dating: {
    name: "Tỏ tình",
    description: "Những mẫu rủ rê hẹn hò siêu dễ thương, cho phép người ấy chọn ngày, món ăn và địa điểm.",
  },
  birthday: {
    name: "Sinh nhật",
    description: "Gửi lời chúc mừng sinh nhật bất ngờ với bánh nến, lời chúc ghi âm và những hộp quà thú vị.",
  },
  sorry: {
    name: "Xin lỗi",
    description: "Mẫu làm hòa đáng yêu, giúp xoa dịu cơn giận và hàn gắn tình cảm một cách chân thành nhất.",
  },
};

const steps = [
  { title: "Chọn mẫu", copy: "Lướt preview và chọn vibe hợp câu chuyện của hai bạn." },
  { title: "Gửi kỷ niệm", copy: "Gửi ảnh, lời nhắn, bài nhạc và chi tiết muốn giấu bên trong." },
  { title: "Nhận web quà", copy: "Nhận link trang web hoàn chỉnh và gửi ngay cho người ấy để tạo bất ngờ." },
];

export default async function Home() {
  const templates = await getPublishedTemplates();


  const grouped = categoryOrder
    .map((slug) => ({
      slug,
      category: categoryCopy[slug as keyof typeof categoryCopy],
      templates: templates.filter((template) => getTemplateKind(template) === slug),
    }))
    .filter((group) => group.templates.length > 0);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden text-[#332035]">
      <div className="flex-1 px-4 pt-4 pb-16 sm:px-6 sm:pb-4 lg:px-10">
        <header className="mx-auto flex max-w-7xl items-center gap-3 rounded-full border-[3px] border-[#ffe0ef] bg-white/80 px-4 py-3 shadow-[0_18px_50px_rgba(255,182,193,0.2)] backdrop-blur-xl sm:px-5">
          <Link className="flex items-center gap-2 text-base font-extrabold tracking-normal sm:text-lg" href="/">
            <img src="/favicon.ico" alt="Lovora Logo" className="h-10 w-10 rounded-[12px] shadow-[0_10px_24px_rgba(255,143,199,0.38)] animate-bounce-slow" />
            <span className="text-[#ff59ab]">
              Lovora <span className="hidden font-semibold text-[#ffa07a] sm:inline">thay lời muốn nói</span>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-5 text-sm font-bold text-[#7b536b] md:flex">
            <PricingModal
              customTrigger={
                <span className="transition hover:text-[#ff6b9d] hover:-translate-y-1 inline-block">
                  Bảng giá
                </span>
              }
            />
            <Link className="transition hover:text-[#ff6b9d] hover:-translate-y-1 inline-block" href="/wedding">
              Thiệp cưới
            </Link>
            <a className="transition hover:text-[#ff6b9d] hover:-translate-y-1 inline-block" href="#quy-trinh">
              Quy trình
            </a>
            <a className="transition hover:text-[#ff6b9d] hover:-translate-y-1 inline-block" href="#mau-web">
              Mẫu web
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <a
              className="rounded-full border-[2px] border-pink-200 bg-white px-5 py-2.5 text-sm font-bold text-pink-500 shadow-md transition-all hover:bg-pink-50 hover:text-pink-600 hover:scale-105"
              href={facebookLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Nhắn Fanpage
            </a>
          </div>
        </header>

        <main className="mx-auto max-w-7xl">
          <section className="relative grid min-h-[calc(100vh-88px)] items-center gap-8 py-8 lg:grid-cols-[1.02fr_0.98fr] lg:py-12">
            <div className="max-w-3xl relative z-10">
              <style>{`
                @keyframes float-cute {
                  0%, 100% { transform: translateY(0) rotate(0); }
                  25% { transform: translateY(-8px) rotate(-2deg); }
                  75% { transform: translateY(8px) rotate(2deg); }
                }
                .anim-float-cute { animation: float-cute 4s ease-in-out infinite; }
                @keyframes bounce-slow {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-3px); }
                }
                .animate-bounce-slow { animation: bounce-slow 2s infinite; }
                @keyframes pulse-glow {
                  0%, 100% { box-shadow: 0 0 15px rgba(255,107,157,0.5); transform: scale(1); }
                  50% { box-shadow: 0 0 25px rgba(255,107,157,0.8); transform: scale(1.02); }
                }
                .animate-pulse-glow { animation: pulse-glow 2.5s ease-in-out infinite; }
                @keyframes shimmer {
                  0% { transform: translateX(-150%) skewX(-15deg); }
                  100% { transform: translateX(250%) skewX(-15deg); }
                }
                .animate-shimmer { animation: shimmer 2.5s infinite; }
                @keyframes gradient-x {
                  0%, 100% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                }
                .animate-gradient-x { animation: gradient-x 3s ease infinite; }
              `}</style>
              
              {/* Cute floating images - Positioned in empty spaces */}
              <img src="/assets/happy/dudu-bubu.webp" alt="cute" className="absolute -top-6 -right-12 w-28 h-28 object-contain anim-float-cute opacity-80 pointer-events-none drop-shadow-xl z-[-1]" style={{ animationDelay: '0s' }} />
              <img src="/assets/happy/ami-bụng-bự.webp" alt="cute" className="absolute top-[40%] -left-16 w-32 h-32 object-contain anim-float-cute opacity-80 pointer-events-none drop-shadow-xl z-[-1]" style={{ animationDelay: '1.5s' }} />
              <img src="/assets/happy/salute-peach-and-goma.webp" alt="cute" className="absolute -bottom-20 right-10 w-24 h-24 object-contain anim-float-cute opacity-90 pointer-events-none drop-shadow-xl z-[-1]" style={{ animationDelay: '3s' }} />

              <p className="inline-flex items-center gap-2 rounded-full border-[3px] border-[#ffb6c1] bg-white/90 px-5 py-2.5 text-sm font-extrabold text-[#ff59ab] shadow-[0_8px_16px_rgba(255,182,193,0.3)] transition-transform cursor-default backdrop-blur-md">
                Web tặng người yêu, mở ra là rụng tim!
              </p>
              
              <h1 className="mt-6 max-w-4xl text-[2.75rem] font-black leading-[1.15] tracking-tight text-[#ff6b9d] sm:text-6xl lg:text-7xl drop-shadow-sm">
                Gói trọn lời yêu <br className="hidden sm:block" />
                vào chiếc web <span className="text-[#ffa07a] inline-block hover:scale-105 transition-transform cursor-pointer">siêu cuthée!</span>
              </h1>
              
              <p className="mt-6 max-w-2xl text-lg font-semibold leading-relaxed text-[#7b536b] sm:text-xl z-10 relative">
                Chỉ cần chọn mẫu, gửi ảnh và vài dòng nhắn nhủ thầm kín qua Fanpage thui! <br/>
                Shop sẽ úm ba la biến thành một món quà tràn ngập tương tác đáng yêu dành riêng cho hai bạn.
              </p>
              
              <div className="mt-8 flex flex-col gap-4 sm:flex-row relative z-10">
                <a
                  className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#ff7eb8] via-[#ff9fbe] to-[#ffb347] px-8 py-4 text-center text-lg font-black text-white shadow-[0_15px_30px_rgba(255,126,184,0.4)] transition-all hover:scale-105 hover:shadow-[0_20px_40px_rgba(255,126,184,0.6)] active:scale-95"
                  href="#mau-web"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Xem mẫu ngay nào!
                  </span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
                <a
                  className="group rounded-[2rem] border-[4px] border-[#ffb6c1] bg-white/90 px-8 py-4 text-center text-lg font-black text-[#ff6b9d] shadow-[0_10px_20px_rgba(255,182,193,0.2)] backdrop-blur-xl transition-all hover:bg-pink-50 hover:scale-105 active:scale-95"
                  href={facebookLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="flex items-center justify-center gap-2">
                    Nhờ shop tư vấn xíu
                  </span>
                </a>
              </div>

              <div id="quy-trinh" className="mt-12 grid gap-4 sm:grid-cols-3 relative z-10">
                {steps.map((step, index) => (
                  <div
                    className="relative rounded-[2rem] border-[3px] border-[#ffe0ef] bg-white/80 p-5 shadow-[0_15px_35px_rgba(255,182,193,0.15)] backdrop-blur-xl transition-transform hover:-translate-y-2 hover:shadow-[0_25px_45px_rgba(255,182,193,0.3)]"
                    key={step.title}
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#ffb6c1] to-[#ff6b9d] text-base font-black text-white shadow-md">
                      {index + 1}
                    </span>
                    <h2 className="mt-4 text-lg font-black text-[#ff59ab]">{step.title}</h2>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-[#7b536b]">{step.copy}</p>
                  </div>
                ))}
              </div>
            </div>

            <GlassCard glow className="float-slow mx-auto w-full max-w-[520px] p-2 sm:p-3 self-end relative z-20">
              <div className="relative overflow-hidden rounded-[30px] border-[4px] border-[#ffe0ef] bg-[#fff9fc] p-3 sm:p-4 shadow-inner" style={{ perspective: 1200 }}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_16%,rgba(255,142,199,0.34),transparent_28%),radial-gradient(circle_at_82%_34%,rgba(166,222,255,0.42),transparent_30%),radial-gradient(circle_at_50%_92%,rgba(255,221,132,0.38),transparent_32%)]" />
                <TiltPhonePreview />
              </div>
            </GlassCard>
          </section>

          <section id="mau-web" className="pt-12 pb-4">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#ff59ab]">
                  Kho tàng cute
                </p>
                <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-[#ff6b9d] sm:text-5xl">
                  Chọn mẫu xinh yêu, xem thử rồi nhắn shop liền nha!
                </h2>
              </div>
              <a
                className="group w-fit rounded-[2rem] border-[3px] border-[#ffb6c1] bg-white/90 px-6 py-4 text-base font-black text-[#ff6b9d] shadow-[0_12px_28px_rgba(255,182,193,0.3)] transition-all hover:bg-[#ff6b9d] hover:text-white hover:scale-105 active:scale-95"
                href={facebookLink()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Tư vấn mẫu hợp nhất
              </a>
            </div>

            <HomePageCatalog grouped={grouped} />
          </section>
        </main>
      </div>

      <Footer />

      <div className="phone-safe-bottom fixed inset-x-4 bottom-4 z-50 sm:hidden">
        <a
          className="group relative flex items-center justify-center gap-2.5 overflow-hidden rounded-[2rem] border-[2px] border-white/60 bg-gradient-to-r from-[#ff59ab] via-[#ff7eb8] to-[#ffb347] bg-[length:200%_auto] px-6 py-4 text-center text-lg font-black text-white backdrop-blur-md transition-all active:scale-95 animate-gradient-x shadow-[0_12px_25px_rgba(255,107,157,0.4)]"
          href={facebookLink()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="absolute top-0 bottom-0 left-0 w-[50%] bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
          <svg className="h-7 w-7 animate-bounce-slow drop-shadow-md" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.13 2 11.23c0 2.92 1.48 5.48 3.79 7.12V22l3.47-1.92c.87.24 1.79.37 2.74.37 5.52 0 10-4.13 10-9.22S17.52 2 12 2zm1.61 12.35l-2.47-2.63-4.8 2.63 5.27-5.59 2.53 2.61 4.75-2.63-5.28 5.61z" />
          </svg>
          <span className="relative z-10 drop-shadow-md tracking-wide">Nhắn Fanpage shop tư vấn nha!</span>
        </a>
      </div>
      <MessengerButton />
    </div>
  );
}
