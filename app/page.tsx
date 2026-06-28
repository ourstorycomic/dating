// Force recompile to clear stale Next.js cache
export const revalidate = 0;
export const dynamic = "force-dynamic";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { HomePageCatalog } from "@/components/HomePageCatalog";
import { TiltPhonePreview } from "@/components/TiltPhonePreview";
import { Footer } from "@/components/Footer";
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
  if (
    searchable.includes("dating-1") ||
    searchable.includes("dating #1") ||
    searchable.includes("dating-2") ||
    searchable.includes("dating #2") ||
    searchable.includes("dating-3") ||
    searchable.includes("dating #3") ||
    searchable.includes("gacha") ||
    searchable.includes("will-you-date-me")
  ) {
    return "dating";
  }
  if (
    searchable.includes("birthday-1") ||
    searchable.includes("birthday #1") ||
    searchable.includes("birthday-2") ||
    searchable.includes("birthday #2") ||
    searchable.includes("birthday 2") ||
    searchable.includes("birthday2") ||
    searchable.includes("birthday_2") ||
    searchable.includes("birthday-3") ||
    searchable.includes("birthday #3") ||
    searchable.includes("birthday-magic")
  ) {
    return "birthday";
  }
  if (
    searchable.includes("sorry") ||
    searchable.includes("xin loi") ||
    searchable.includes("xin lỗi")
  ) {
    return "sorry";
  }
  return "valentine";
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
      <div className="flex-1 px-4 pt-4 pb-16 sm:px-6 sm:pb-20 lg:px-10">
        <header className="mx-auto flex max-w-7xl items-center gap-3 rounded-full border-[3px] border-[#ffe0ef] bg-white/80 px-4 py-3 shadow-[0_18px_50px_rgba(255,182,193,0.2)] backdrop-blur-xl sm:px-5">
          <Link className="flex items-center gap-2 text-base font-extrabold tracking-normal sm:text-lg" href="/">
            <img src="/favicon.ico" alt="Lovora Logo" className="h-10 w-10 rounded-[12px] shadow-[0_10px_24px_rgba(255,143,199,0.38)] animate-bounce-slow" />
            <span className="text-[#ff59ab]">
              Lovora <span className="hidden font-semibold text-[#ffa07a] sm:inline">thay lời muốn nói</span>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-5 text-sm font-bold text-[#7b536b] md:flex">
            <a className="transition hover:text-[#ff6b9d] hover:-translate-y-1 inline-block" href="#quy-trinh">
              Quy trình
            </a>
            <a className="transition hover:text-[#ff6b9d] hover:-translate-y-1 inline-block" href="#mau-web">
              Mẫu web
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <a
              className="rounded-full border-[2px] border-[#ffb6c1] bg-white px-5 py-2.5 text-sm font-bold text-[#ff6b9d] shadow-[0_8px_20px_rgba(255,182,193,0.3)] transition-all hover:bg-[#ff6b9d] hover:text-white hover:scale-105"
              href={facebookLink()}
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
              `}</style>
              
              {/* Cute floating images - Positioned in empty spaces */}
              <img src="/assets/happy/dudu-bubu.webp" alt="cute" className="absolute -top-6 -right-12 w-28 h-28 object-contain anim-float-cute opacity-80 pointer-events-none drop-shadow-xl z-[-1]" style={{ animationDelay: '0s' }} />
              <img src="/assets/happy/ami-bụng-bự.webp" alt="cute" className="absolute top-[40%] -left-16 w-32 h-32 object-contain anim-float-cute opacity-80 pointer-events-none drop-shadow-xl z-[-1]" style={{ animationDelay: '1.5s' }} />
              <img src="/assets/happy/salute-peach-and-goma.webp" alt="cute" className="absolute -bottom-20 right-10 w-24 h-24 object-contain anim-float-cute opacity-90 pointer-events-none drop-shadow-xl z-[-1]" style={{ animationDelay: '3s' }} />

              <p className="inline-flex items-center gap-2 rounded-full border-[3px] border-[#ffb6c1] bg-white/90 px-5 py-2.5 text-sm font-extrabold text-[#ff59ab] shadow-[0_8px_16px_rgba(255,182,193,0.3)] transition-transform cursor-default backdrop-blur-md">
                Web tặng người yêu, mở ra là rụng tim!
              </p>
              
              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.15] tracking-tight text-[#ff6b9d] sm:text-6xl lg:text-7xl drop-shadow-sm">
                Gói trọn lời yêu <br/>
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

            <GlassCard glow className="float-slow mx-auto w-full max-w-[520px] p-4 sm:p-5 relative z-20">
              <div className="relative overflow-hidden rounded-[30px] border-[4px] border-[#ffe0ef] bg-[#fff9fc] p-4 shadow-inner" style={{ perspective: 1200 }}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_16%,rgba(255,142,199,0.34),transparent_28%),radial-gradient(circle_at_82%_34%,rgba(166,222,255,0.42),transparent_30%),radial-gradient(circle_at_50%_92%,rgba(255,221,132,0.38),transparent_32%)]" />
                <TiltPhonePreview />
              </div>
            </GlassCard>
          </section>

          <section id="mau-web" className="py-12">
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
          className="block rounded-[2rem] border-[3px] border-[#ffb6c1] bg-gradient-to-r from-[#ff7eb8] to-[#ffb347] px-6 py-4 text-center text-lg font-black text-white shadow-[0_15px_30px_rgba(255,126,184,0.5)] transition-transform active:scale-95 animate-bounce-slow"
          href={facebookLink()}
        >
          Nhắn Fanpage shop tư vấn nha!
        </a>
      </div>
    </div>
  );
}
