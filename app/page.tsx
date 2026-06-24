// Force recompile to clear stale Next.js cache
export const revalidate = 0;
export const dynamic = "force-dynamic";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { HomePageCatalog } from "@/components/HomePageCatalog";
import { TiltPhonePreview } from "@/components/TiltPhonePreview";
import { Footer } from "@/components/Footer";
import { TIKTOK_INBOX_URL } from "@/lib/constants";
import { getPublishedTemplates } from "@/lib/supabase/server";

function tiktokLink(templateSlug?: string) {
  const text = templateSlug
    ? `Tôi muốn đặt mẫu ${templateSlug}. Tư vấn giúp tôi làm web tặng người yêu.`
    : "Tôi muốn được tư vấn làm web tặng người yêu.";

  return `${TIKTOK_INBOX_URL}&text=${encodeURIComponent(text)}`;
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

  // Inject Sorry 1 for demo since it's not in DB yet
  templates.push({
    id: "sorry-1-mock",
    slug: "sorry-1",
    name: "Sorry #1",
    component_key: "sorry-1",
    description: "Trải nghiệm 6 bước xoa dịu cơn giận từ việc đập tan lớp băng giá đến bản hiệp ước hòa bình hồng rực rỡ.",
    tagline: "Làm Hòa",
    base_price: 2000,
    visual_label: "HOT",
    gradient: "from-slate-400 to-rose-400",
    status_label: "Mới",
    sort_order: 20,
    data_schema: {},
    sample_data: { screens: ["Đập băng", "Thú tội", "Vòng quay", "Kỷ niệm", "Ký tên"] },
    template_categories: { slug: "sorry", name: "Sorry", description: null }
  } as any);
  templates.push({
    id: "sorry-2-mock",
    slug: "sorry-2",
    name: "Sorry #2",
    component_key: "sorry-2",
    description: "Đập tan cơn tức giận với minigame 'Whack-a-Lover' rồi xoa dịu bằng lời hứa chân thành và trà sữa.",
    tagline: "Xả Giận",
    base_price: 2000,
    visual_label: "FUN",
    gradient: "from-orange-400 to-rose-400",
    status_label: "Mới",
    sort_order: 21,
    data_schema: {},
    sample_data: { screens: ["Châm ngòi", "Chọn vũ khí", "Xả giận", "Băng bó", "Xin lỗi", "Tha thứ"] },
    template_categories: { slug: "sorry", name: "Sorry", description: null }
  } as any);

  templates.push({
    id: "sorry-3-mock",
    slug: "sorry-3",
    name: "Sorry #3",
    component_key: "sorry-3",
    description: "Hành trình chuộc lỗi đầy tính công nghệ và hài hước, từ màn hình xanh tử thần đến minigame khủng long.",
    tagline: "Chuộc Lỗi",
    base_price: 2000,
    visual_label: "FUN",
    gradient: "from-blue-400 to-indigo-400",
    status_label: "Mới",
    sort_order: 22,
    data_schema: {},
    sample_data: { screens: ["Lỗi hệ thống", "Mất kết nối", "Khủng long vượt ải", "Cảnh báo", "Thùng rác", "Cài đặt lại", "Tin nhắn", "Chốt kèo"] },
    template_categories: { slug: "sorry", name: "Sorry", description: null }
  } as any);

  templates.push({
    id: "birthday-3-mock",
    slug: "birthday-3",
    name: "Birthday #3",
    component_key: "birthday-3",
    description: "Lộ trình sinh nhật 8 bước sang trọng, từ gõ cửa, bật đèn, đập bóng bay đến xé quà bất ngờ.",
    tagline: "Sinh Nhật",
    base_price: 2000,
    visual_label: "LUXURY",
    gradient: "from-amber-200 to-yellow-500",
    status_label: "Mới",
    sort_order: 12,
    data_schema: {},
    sample_data: { screens: ["Gõ cửa", "Bật đèn", "Bóng bay", "Thổi nến", "Lật thiệp", "Ảnh kỷ niệm", "Xé quà", "Nhận quà"] },
    template_categories: { slug: "birthday", name: "Birthday", description: null }
  } as any);


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
              <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-[#fff9fc] p-4 shadow-inner" style={{ perspective: 1200 }}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_16%,rgba(255,142,199,0.34),transparent_28%),radial-gradient(circle_at_82%_34%,rgba(166,222,255,0.42),transparent_30%),radial-gradient(circle_at_50%_92%,rgba(255,221,132,0.38),transparent_32%)]" />
                <TiltPhonePreview />
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
      </div>

      <Footer />

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
