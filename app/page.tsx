// Force recompile to clear stale Next.js cache
export const revalidate = 60;
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { HomePageCatalog } from "@/components/HomePageCatalog";
import { TIKTOK_INBOX_URL } from "@/lib/constants";
import { getPublishedTemplates } from "@/lib/supabase/server";

function tiktokLink(templateSlug?: string) {
  const text = templateSlug
    ? `Tôi muốn đặt mẫu ${templateSlug}. Tư vấn giúp tôi làm web tặng người yêu.`
    : "Tôi muốn được tư vấn làm web tặng người yêu.";

  return `${TIKTOK_INBOX_URL}&text=${encodeURIComponent(text)}`;
}

const categoryOrder = ["valentine", "dating", "birthday"];

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
    searchable.includes("birthday-magic")
  ) {
    return "birthday";
  }
  return "valentine";
}

const categoryCopy = {
  valentine: {
    name: "Valentine",
    description: "Những món quà lãng mạn, gửi gắm lời yêu thương qua những tương tác bất ngờ nhỏ lấp lánh.",
  },
  dating: {
    name: "Dating",
    description: "Những mẫu rủ rê hẹn hò siêu dễ thương, cho phép người ấy chọn ngày, món ăn và địa điểm.",
  },
  birthday: {
    name: "Birthday",
    description: "Gửi lời chúc mừng sinh nhật bất ngờ với bánh nến, lời chúc ghi âm và những hộp quà thú vị.",
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
    <div className="min-h-screen overflow-hidden px-4 pb-24 pt-4 text-[#332035] sm:px-6 sm:pb-10 lg:px-10">
      <header className="mx-auto flex max-w-7xl items-center gap-3 rounded-[28px] border border-white/70 bg-white/72 px-4 py-3 shadow-[0_18px_50px_rgba(215,112,158,0.16)] backdrop-blur-xl sm:px-5">
        <Link className="flex items-center gap-2 text-base font-extrabold tracking-normal sm:text-lg" href="/">
          <img src="/favicon.ico" alt="Lovora Logo" className="h-9 w-9 rounded-[10px] shadow-[0_10px_24px_rgba(255,143,199,0.38)]" />
          <span>
            Lovora <span className="hidden font-semibold text-[#c04b86] sm:inline">thay lời muốn nói</span>
          </span>
        </Link>
        <nav className="ml-auto hidden items-center gap-5 text-sm font-semibold text-[#7b536b] md:flex">
          <a className="transition hover:text-[#d53f8c]" href="#quy-trinh">
            Quy trình
          </a>
          <a className="transition hover:text-[#d53f8c]" href="#mau-web">
            Mẫu web
          </a>
          <Link className="transition hover:text-[#d53f8c]" href="/dashboard">
            Quản trị
          </Link>
        </nav>
        <a
          className="ml-auto rounded-full bg-[#332035] px-4 py-2 text-sm font-bold text-[#fff] shadow-[0_12px_28px_rgba(51,32,53,0.18)] transition hover:bg-[#d53f8c] md:ml-0"
          href={tiktokLink()}
        >
          Nhắn TikTok
        </a>
      </header>

      <main className="mx-auto max-w-7xl">
        <section className="grid min-h-[calc(100vh-88px)] items-center gap-8 py-8 lg:grid-cols-[1.02fr_0.98fr] lg:py-12">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-[#f4bdd8] bg-white/68 px-4 py-2 text-sm font-bold text-[#b83276] shadow-[0_10px_26px_rgba(216,92,145,0.12)]">
              Web tặng người yêu, mở ra là thấy thương
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-normal text-[#321a32] sm:text-5xl lg:text-6xl">
              Gói một lời yêu thành chiếc web nhỏ xinh.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#74536a] sm:text-lg">
              Chọn mẫu, gửi ảnh và lời nhắn qua TikTok. Shop setup thành món quà có ảnh,
              thư, nhạc và các tương tác siêu cute dành riêng cho hai bạn.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                className="rounded-full bg-gradient-to-r from-[#ff7eb8] via-[#ff9fbe] to-[#ffd36f] px-6 py-3 text-center font-extrabold text-[#fff] shadow-[0_18px_38px_rgba(255,126,184,0.32)] transition hover:scale-[1.02]"
                href="#mau-web"
              >
                Xem mẫu ngay
              </a>
              <a
                className="rounded-full border border-[#f4bdd8] bg-white/72 px-6 py-3 text-center font-extrabold text-[#b83276] shadow-[0_12px_28px_rgba(216,92,145,0.12)] backdrop-blur-xl transition hover:bg-white"
                href={tiktokLink()}
              >
                Nhờ shop tư vấn
              </a>
            </div>

            <div id="quy-trinh" className="mt-8 grid gap-3 sm:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  className="rounded-[22px] border border-white/70 bg-white/62 p-4 shadow-[0_14px_34px_rgba(215,112,158,0.12)] backdrop-blur-xl"
                  key={step.title}
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ffe0ef] text-sm font-black text-[#c04b86]">
                    {index + 1}
                  </span>
                  <h2 className="mt-3 text-base font-extrabold text-[#321a32]">{step.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#76556d]">{step.copy}</p>
                </div>
              ))}
            </div>
          </div>

          <GlassCard glow className="float-slow mx-auto w-full max-w-[520px] p-4 sm:p-5">
            <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-[#fff9fc] p-4 shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_16%,rgba(255,142,199,0.34),transparent_28%),radial-gradient(circle_at_82%_34%,rgba(166,222,255,0.42),transparent_30%),radial-gradient(circle_at_50%_92%,rgba(255,221,132,0.38),transparent_32%)]" />
              <div className="relative mx-auto flex aspect-[9/16] max-h-[620px] min-h-[520px] w-full max-w-[340px] flex-col overflow-hidden rounded-[2.2rem] border-[8px] border-[#3a233a] bg-[#fff5fb] shadow-[0_24px_60px_rgba(96,54,91,0.22)]">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,#fff7fb_0%,#ffe8f3_46%,#e8f7ff_100%)]" />
                <div className="relative flex items-center justify-between px-5 pt-5 text-xs font-bold text-[#7f5872]">
                  <span>Preview quà</span>
                  <span className="rounded-full bg-white/70 px-3 py-1 text-[#c04b86]">Món quà bí mật</span>
                </div>
                <div className="relative grid flex-1 place-items-center px-5 text-center">
                  <div>
                    <div className="float-delay mx-auto grid h-28 w-28 place-items-center rounded-full bg-white/78 text-4xl shadow-[0_20px_50px_rgba(255,126,184,0.26)]">
                      <span aria-hidden>♡</span>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold leading-tight text-[#321a32]">
                      Mở khóa món quà nhỏ
                    </h2>
                    <p className="mx-auto mt-3 max-w-[240px] text-sm leading-6 text-[#74536a]">
                      Nhập ngày đặc biệt, xem thư, ảnh và chọn câu trả lời cuối.
                    </p>
                  </div>
                </div>
                <div className="relative m-4 rounded-[24px] border border-white/80 bg-white/76 p-4 shadow-[0_16px_38px_rgba(215,112,158,0.14)] backdrop-blur-xl">
                  <p className="text-center text-sm font-semibold text-[#76556d]">
                    Em có muốn đi hẹn hò với anh không?
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button className="rounded-full bg-[#ff7eb8] px-4 py-3 text-sm font-extrabold text-[#fff]">
                      Có chứ
                    </button>
                    <button className="rounded-full border border-[#f4bdd8] bg-white px-4 py-3 text-sm font-extrabold text-[#b83276]">
                      Để em nghĩ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        <section id="mau-web" className="py-8">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#c04b86]">
                Bộ sưu tập
              </p>
              <h2 className="mt-2 max-w-3xl text-3xl font-extrabold leading-tight text-[#321a32] sm:text-4xl">
                Chọn mẫu theo dịp, mở preview rồi nhắn TikTok
              </h2>
            </div>
            <a
              className="w-fit rounded-full border border-[#f4bdd8] bg-white/72 px-5 py-3 text-sm font-extrabold text-[#b83276] shadow-[0_12px_28px_rgba(216,92,145,0.12)]"
              href={tiktokLink()}
            >
              Tư vấn mẫu hợp nhất
            </a>
          </div>

          <HomePageCatalog grouped={grouped} />
        </section>
      </main>

      <div className="phone-safe-bottom fixed inset-x-3 bottom-0 z-30 sm:hidden">
        <a
          className="block rounded-full bg-gradient-to-r from-[#ff7eb8] to-[#ffd36f] px-5 py-4 text-center text-sm font-extrabold text-[#fff] shadow-[0_18px_38px_rgba(255,126,184,0.38)]"
          href={tiktokLink()}
        >
          Nhắn TikTok để shop làm giúp
        </a>
      </div>
    </div>
  );
}
