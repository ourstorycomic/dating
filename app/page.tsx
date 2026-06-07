import Link from "next/link";
import { InteractiveTemplatePreview } from "@/components/templates/InteractiveTemplatePreview";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { GlassCard } from "@/components/ui/GlassCard";
import { TIKTOK_INBOX_URL } from "@/lib/constants";
import { getPublishedTemplates } from "@/lib/supabase/server";

function tiktokLink(templateSlug?: string) {
  const text = templateSlug
    ? `Tôi muốn đặt mẫu ${templateSlug}. Tư vấn giúp tôi làm web tặng người yêu.`
    : "Tôi muốn được tư vấn làm web tặng người yêu.";

  return `${TIKTOK_INBOX_URL}&text=${encodeURIComponent(text)}`;
}

function formatPrice(value: number) {
  return `${Math.round(value / 1000).toLocaleString("vi-VN")}K`;
}

function getScreens(sampleData: unknown) {
  const data = sampleData as { screens?: string[] } | undefined;
  return data?.screens ?? [];
}

const categoryOrder = ["valentine", "confession", "birthday"];

export default async function Home() {
  const templates = await getPublishedTemplates();
  const grouped = categoryOrder
    .map((slug) => ({
      slug,
      category: templates.find((template) => template.template_categories?.slug === slug)
        ?.template_categories,
      templates: templates.filter((template) => template.template_categories?.slug === slug),
    }))
    .filter((group) => group.templates.length > 0);

  return (
    <div className="min-h-screen overflow-hidden px-4 pb-24 pt-4 text-white sm:px-6 sm:pb-8 lg:px-10">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 backdrop-blur-xl sm:rounded-full sm:px-5">
        <Link className="text-lg font-bold tracking-wide" href="/">
          Yeuweb<span className="text-neon-pink"> - Thay lời muốn nói</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          <a className="transition hover:text-white" href="#mau-web">Mẫu web</a>
          <Link className="transition hover:text-white" href="/dashboard">Quản trị</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle compact />
          <a
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#13081d] shadow-[0_0_28px_rgba(255,79,216,0.18)] transition hover:bg-pink-50"
            href={tiktokLink()}
          >
            Nhắn TikTok
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl">
        <section className="grid min-h-[calc(100vh-84px)] items-center gap-9 py-8 lg:grid-cols-[1.03fr_0.97fr] lg:py-12">
          <div className="max-w-3xl">
            <h1 className="neon-text max-w-4xl text-4xl font-semibold leading-[1.05] tracking-normal sm:text-5xl lg:text-6xl">
              Web quà tặng mở ra là thấy bất ngờ.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-romance-muted sm:text-lg">
              Chọn mẫu, gửi ảnh và lời nhắn qua TikTok. Shop setup thành 2 link:
              một link gửi người yêu, một link để xem người ấy đã mở và trả lời gì.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                className="pulse-glow rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-400 px-6 py-3 text-center font-semibold text-white transition hover:scale-[1.02]"
                href="#mau-web"
              >
                Xem mẫu
              </a>
              <a
                className="rounded-full border border-white/14 bg-white/[0.06] px-6 py-3 text-center font-semibold text-white backdrop-blur-xl transition hover:bg-white/[0.1]"
                href={tiktokLink()}
              >
                Nhắn shop trên TikTok
              </a>
            </div>
          </div>

          <GlassCard glow className="float-slow mx-auto w-full max-w-[500px] p-4 sm:p-5">
            <div className="template-preview-surface relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/12 bg-[#12091f]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,121,198,0.32),transparent_34%),radial-gradient(circle_at_22%_72%,rgba(168,85,247,0.24),transparent_31%)]" />
              <div className="absolute left-5 right-5 top-5 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.08] px-4 py-3 backdrop-blur-xl">
                <span className="text-sm font-medium text-white/78">Live preview</span>
                <span className="rounded-full bg-pink-400/20 px-3 py-1 text-xs font-semibold text-pink-100">
                  Gift + Track
                </span>
              </div>
              <div className="absolute inset-x-7 top-24 text-center sm:top-28">
                <div className="float-delay mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full border border-pink-200/30 bg-white/10 text-sm font-bold shadow-[0_0_50px_rgba(255,79,216,0.28)] backdrop-blur-xl sm:h-28 sm:w-28">
                  LOVE
                </div>
                <h2 className="text-3xl font-semibold sm:text-4xl">Mở khóa món quà</h2>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-white/68">
                  Nhập ngày đặc biệt, xem ảnh, thư và bấm câu trả lời cuối.
                </p>
              </div>
              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/12 bg-black/24 p-4 backdrop-blur-xl">
                <p className="text-center text-sm text-white/74">Em có đồng ý không?</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button className="rounded-full bg-pink-500 px-4 py-3 text-sm font-semibold">Có chứ</button>
                  <button className="rounded-full border border-white/12 bg-white/10 px-4 py-3 text-sm font-semibold">Để em nghĩ</button>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        <section id="mau-web" className="py-8">
          <div className="mb-7">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Chọn mẫu theo dịp, mở preview rồi nhắn TikTok
            </h2>
          </div>

          {templates.length === 0 ? (
            <GlassCard hover={false}>
              <h3 className="text-2xl font-semibold">Chưa có template</h3>
            </GlassCard>
          ) : (
            <div className="grid gap-9">
              {grouped.map((group) => (
                <section className="grid gap-4" key={group.slug}>
                  <div>
                    <h3 className="text-2xl font-semibold">{group.category?.name}</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
                      {group.category?.description}
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {group.templates.map((template) => (
                      <GlassCard
                        className="shine-card flex min-h-[470px] flex-col p-4 sm:p-5"
                        key={template.id}
                      >
                        <Link className="mb-5 block" href={`/templates/${template.slug}/preview`}>
                          <InteractiveTemplatePreview
                            compact
                            componentKey={template.component_key}
                            gradient={template.gradient}
                            visualLabel={template.visual_label}
                          />
                        </Link>

                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold text-pink-100">
                              {group.category?.name}
                            </p>
                            <Link href={`/templates/${template.slug}/preview`}>
                              <h4 className="mt-2 text-2xl font-semibold leading-tight hover:text-pink-100">
                                {template.name}
                              </h4>
                            </Link>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#13081d]">
                            {formatPrice(template.base_price)}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-white/68">
                          {template.tagline || template.description}
                        </p>
                        <div className="mt-4 grid gap-2">
                          <p className="text-xs font-semibold text-pink-100">
                            Gồm {getScreens(template.sample_data).length || 5} cảnh bên trong
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(getScreens(template.sample_data).length
                              ? getScreens(template.sample_data)
                              : ["Mở đầu", "Tương tác", "Ảnh", "Lá thư", "Phản hồi"]
                            ).slice(0, 4).map((screen) => (
                              <span
                                className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] text-white/66"
                                key={screen}
                              >
                                {screen}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Link
                          className="mt-4 rounded-full border border-white/10 bg-white/[0.06] px-4 py-3 text-center text-sm font-semibold"
                          href={`/templates/${template.slug}/preview`}
                        >
                          Mở web preview
                        </Link>
                        <a
                          className="mt-auto block rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-400 px-5 py-3 text-center text-sm font-semibold text-white shadow-[0_0_28px_rgba(255,79,216,0.18)] transition hover:scale-[1.02]"
                          href={tiktokLink(template.slug)}
                        >
                          Chọn mẫu này
                        </a>
                      </GlassCard>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>
      </main>

      <div className="phone-safe-bottom fixed inset-x-3 bottom-0 z-30 sm:hidden">
        <a
          className="pulse-glow block rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-400 px-5 py-4 text-center text-sm font-bold text-white shadow-[0_0_34px_rgba(255,79,216,0.34)]"
          href={tiktokLink()}
        >
          Nhắn TikTok để shop làm giúp
        </a>
      </div>
    </div>
  );
}
