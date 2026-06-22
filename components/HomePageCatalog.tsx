"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { InteractiveTemplatePreview } from "@/components/templates/InteractiveTemplatePreview";
import { TIKTOK_INBOX_URL } from "@/lib/constants";

type HomeTemplate = {
  id: string | number;
  slug: string;
  name: string;
  base_price: number;
  component_key: string;
  gradient?: string | null;
  visual_label?: string | null;
  tagline?: string | null;
  description?: string | null;
  sample_data?: unknown;
};

type HomeTemplateGroup = {
  slug: string;
  category?: {
    name?: string | null;
    description?: string | null;
  } | null;
  templates: HomeTemplate[];
};

function formatPrice(value: number) {
  return `${Math.round(value / 1000).toLocaleString("vi-VN")}K`;
}

function getScreens(sampleData: unknown) {
  const data = sampleData as { screens?: string[] } | undefined;
  return data?.screens ?? [];
}

function tiktokLink(templateSlug?: string) {
  const text = templateSlug
    ? `Tôi muốn đặt mẫu ${templateSlug}. Tư vấn giúp tôi làm web tặng người yêu.`
    : "Tôi muốn được tư vấn làm web tặng người yêu.";
  return `${TIKTOK_INBOX_URL}&text=${encodeURIComponent(text)}`;
}

export function HomePageCatalog({ grouped }: { grouped: HomeTemplateGroup[] }) {
  const [activeTab, setActiveTab] = useState(grouped[0]?.slug);
  const router = useRouter();

  if (grouped.length === 0) {
    return (
      <GlassCard hover={false}>
        <h3 className="text-2xl font-extrabold text-[#321a32]">Chưa có template</h3>
      </GlassCard>
    );
  }

  return (
    <div className="grid gap-8">
      <div className="sticky top-3 z-20 -mx-1 flex gap-2 overflow-x-auto rounded-full border border-white/72 bg-white/72 p-2 shadow-[0_16px_38px_rgba(215,112,158,0.14)] backdrop-blur-xl">
        {grouped.map((group) => (
          <button
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-extrabold transition-all ${
              activeTab === group.slug
                ? "bg-[#ff7eb8] text-white shadow-[0_10px_24px_rgba(255,126,184,0.34)]"
                : "bg-white/58 text-[#7b536b] hover:bg-white hover:text-[#c04b86]"
            }`}
            key={group.slug}
            onClick={() => {
              setActiveTab(group.slug);
              const el = document.getElementById(`category-${group.slug}`);
              if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY - 112;
                window.scrollTo({ top: y, behavior: "smooth" });
              }
            }}
            type="button"
          >
            {group.category?.name || group.slug}
          </button>
        ))}
      </div>

      <div className="grid gap-14">
        {grouped.map((group) => (
          <section className="grid gap-5" id={`category-${group.slug}`} key={group.slug}>
            <div className="rounded-[28px] border border-white/70 bg-white/52 p-5 shadow-[0_14px_34px_rgba(215,112,158,0.1)] backdrop-blur-xl">
              <h3 className="text-2xl font-extrabold text-[#321a32]">{group.category?.name}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#76556d]">
                {group.category?.description}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {group.templates.map((template) => {
                const screens = getScreens(template.sample_data);
                const visibleScreens = (
                  screens.length
                    ? screens
                    : ["Mở đầu", "Tương tác", "Ảnh", "Lá thư", "Phản hồi"]
                ).slice(0, 4);

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                    key={template.id}
                    className="h-full"
                  >
                    <GlassCard
                      className="shine-card flex h-full min-h-[590px] flex-col p-4 sm:p-5"
                    >
                    <div 
                      className="mb-5 block cursor-pointer" 
                      onClick={(e) => {
                        if (e.nativeEvent.isTrusted) {
                          router.push(`/templates/${template.slug}/preview`);
                        }
                      }}
                    >
                      <InteractiveTemplatePreview
                        compact
                        componentKey={template.component_key}
                        gradient={template.gradient}
                        visualLabel={template.visual_label}
                      />
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#c04b86]">
                          {group.category?.name}
                        </p>
                        <Link href={`/templates/${template.slug}/preview`}>
                          <h4 className="mt-2 text-2xl font-extrabold leading-tight text-[#321a32] hover:text-[#d53f8c]">
                            {template.name}
                          </h4>
                        </Link>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#fff0b8] px-3 py-1 text-sm font-black text-[#8d5c00] shadow-[0_10px_22px_rgba(255,211,111,0.24)]">
                        {formatPrice(template.base_price)}
                      </span>
                    </div>

                    <p className="mt-3 flex-grow text-sm leading-6 text-[#76556d]">
                      {template.tagline || template.description}
                    </p>

                    <div className="mt-4 grid gap-2">
                      <p className="text-xs font-extrabold text-[#c04b86]">
                        Gồm {screens.length || 5} cảnh bên trong
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {visibleScreens.map((screen) => (
                          <span
                            className="rounded-full border border-[#f4bdd8] bg-white/68 px-3 py-1 text-[11px] font-semibold text-[#76556d]"
                            key={screen}
                          >
                            {screen}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <Link
                        className="rounded-full border border-[#f4bdd8] bg-white/78 px-4 py-3 text-center text-sm font-extrabold text-[#b83276] transition hover:bg-white"
                        href={`/templates/${template.slug}/preview`}
                      >
                        Mở preview
                      </Link>
                      <a
                        className="rounded-full bg-gradient-to-r from-[#ff7eb8] to-[#ffd36f] px-4 py-3 text-center text-sm font-extrabold text-[#fff] shadow-[0_14px_30px_rgba(255,126,184,0.28)] transition hover:scale-[1.02]"
                        href={tiktokLink(template.slug)}
                      >
                        Chọn mẫu
                      </a>
                    </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
