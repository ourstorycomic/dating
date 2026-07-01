"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { InteractiveTemplatePreview } from "@/components/templates/InteractiveTemplatePreview";
import { PricingModal } from "@/components/PricingModal";
import { FACEBOOK_URL } from "@/lib/constants";

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

function facebookLink(templateSlug?: string) {
  const text = templateSlug
    ? `Tôi muốn đặt mẫu ${templateSlug}. Tư vấn giúp tôi làm web tặng người yêu.`
    : "Tôi muốn được tư vấn làm web tặng người yêu.";
  return `${FACEBOOK_URL}?text=${encodeURIComponent(text)}`;
}

export function HomePageCatalog({ grouped }: { grouped: HomeTemplateGroup[] }) {
  const [activeTab, setActiveTab] = useState("all");
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
        <button
          className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-extrabold transition-all ${
            activeTab === "all"
              ? "bg-[#ff7eb8] text-white shadow-[0_10px_24px_rgba(255,126,184,0.34)]"
              : "bg-white/58 text-[#7b536b] hover:bg-white hover:text-[#c04b86]"
          }`}
          onClick={() => setActiveTab("all")}
          type="button"
        >
          Tất cả
        </button>
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
            }}
            type="button"
          >
            {group.category?.name || group.slug}
          </button>
        ))}
        
        {/* Nút Xem bảng giá siêu nổi bật */}
        <div className="ml-auto shrink-0 flex items-center pr-1">
          <PricingModal />
        </div>
      </div>

      <div className="grid gap-14">
        {grouped.filter(group => activeTab === "all" || group.slug === activeTab).map((group) => (
          <section className="grid gap-5" id={`category-${group.slug}`} key={group.slug}>
            <div className="rounded-[28px] border border-white/70 bg-white/52 p-5 shadow-[0_14px_34px_rgba(215,112,158,0.1)] backdrop-blur-xl">
              <h3 className="text-2xl font-extrabold text-[#321a32]">{group.category?.name}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#76556d]">
                {group.category?.description}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {group.templates.map((template) => {


                return (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                    key={template.id}
                    className="h-full min-w-0"
                  >
                    <GlassCard
                      className="shine-card flex h-full min-h-[590px] flex-col p-4 sm:p-5"
                    >
                    <div 
                      className="mb-5 block cursor-pointer" 
                      onClick={(e) => {
                        if (e.nativeEvent.isTrusted) {
                          window.open(`/templates/${template.slug}/preview`, '_blank');
                        }
                      }}
                    >
                      <InteractiveTemplatePreview
                        compact
                        componentKey={template.component_key}
                        gradient={template.gradient}
                        visualLabel={template.visual_label}
                        hideNavigation={true}
                        forceRandomMusic={true}
                      />
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#c04b86]">
                          {group.category?.name}
                        </p>
                        <Link href={`/templates/${template.slug}/preview`} target="_blank" rel="noopener noreferrer">
                          <h4 className="mt-2 text-2xl font-extrabold leading-tight text-[#321a32] hover:text-[#d53f8c]">
                            {template.name}
                          </h4>
                        </Link>
                      </div>
                      {/* BỎ GIÁ TIỀN SẢN PHẨM Ở ĐÂY NHƯ USER YÊU CẦU */}
                    </div>

                    <p className="mt-3 flex-grow text-sm leading-6 text-[#76556d]">
                      {template.tagline || template.description}
                    </p>



                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <Link
                        className="rounded-full border border-[#f4bdd8] bg-white/78 px-4 py-3 text-center text-sm font-extrabold text-[#b83276] transition hover:bg-white"
                        href={`/templates/${template.slug}/preview`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Mở preview
                      </Link>
                      <a
                        className="rounded-full bg-gradient-to-r from-[#ff7eb8] to-[#ffd36f] px-4 py-3 text-center text-sm font-extrabold text-[#fff] shadow-[0_14px_30px_rgba(255,126,184,0.28)] transition hover:scale-[1.02]"
                        href={facebookLink(template.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
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
