import Link from "next/link";
import { notFound } from "next/navigation";
import { InteractiveTemplatePreview } from "@/components/templates/InteractiveTemplatePreview";
import { getTemplateBySlug } from "@/lib/supabase/server";
import { TIKTOK_INBOX_URL } from "@/lib/constants";

function tiktokLink(slug: string) {
  return `${TIKTOK_INBOX_URL}&text=${encodeURIComponent(
    `Tôi muốn đặt mẫu ${slug}. Tư vấn giúp tôi làm web tặng người yêu.`,
  )}`;
}

function getScreens(sampleData: unknown) {
  const data = sampleData as { screens?: string[] } | undefined;
  return data?.screens ?? ["Mở đầu", "Tương tác", "Kỷ niệm", "Lá thư", "Phản hồi"];
}

export default async function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);

  if (!template) notFound();

  const screens = getScreens(template.sample_data);

  return (
    <div className="min-h-screen px-4 py-5 text-white sm:px-6 lg:px-10 relative">
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Link href="/" className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20 shadow-lg text-sm font-bold flex items-center gap-2">
          <span>&larr;</span> Trang chủ
        </Link>
      </div>
      <main className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.86fr_1.14fr] pt-10 md:pt-0">
        <section className="glass-panel rounded-2xl p-5 sm:p-6">
          <Link className="hidden md:inline-block text-sm font-semibold text-white/58 hover:text-white" href="/#mau-web">
            Quay lại danh sách mẫu
          </Link>
          <p className="mt-6 text-sm font-semibold text-pink-100/80">
            {template.template_categories?.name}
          </p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{template.name}</h1>
          <p className="mt-4 text-base leading-8 text-romance-muted">
            {template.tagline || template.description}
          </p>

          <div className="mt-6 grid gap-3">
            <p className="text-sm font-semibold text-white/72">Template này gồm:</p>
            <div className="flex flex-wrap gap-2">
              {screens.map((screen) => (
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70" key={screen}>
                  {screen}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a
              className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 text-center text-sm font-bold"
              href={tiktokLink(template.slug)}
            >
              Chọn mẫu này
            </a>
            <Link
              className="rounded-full border border-white/14 bg-white/[0.06] px-6 py-3 text-center text-sm font-bold"
              href={`/track/${template.slug}`}
            >
              Xem track link
            </Link>
          </div>
        </section>

        <section className="glass-panel rounded-2xl p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-4 px-1">
            <div>
              <h2 className="text-2xl font-semibold">Live preview</h2>
              <p className="mt-1 text-sm text-white/58">
                Có thể bấm các chấm cảnh, chuyển cảnh và bấm nút phản hồi.
              </p>
            </div>
            <span className="rounded-full bg-pink-300/10 px-3 py-1 text-xs font-bold text-pink-100">
              Web demo
            </span>
          </div>
          <div className="mx-auto max-w-[520px]">
            <InteractiveTemplatePreview
              componentKey={template.component_key}
              gradient={template.gradient}
              message="Đây là nội dung shop sẽ cá nhân hóa theo ảnh, tên và lời nhắn của khách."
              photoCount={6}
              question="Người ấy sẽ chọn câu trả lời nào?"
              recipientName="Người ấy"
              senderName="Bạn"
              visualLabel={template.visual_label}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
