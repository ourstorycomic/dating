"use client";

import { useState } from "react";
import Link from "next/link";
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
  thumbnail_url?: string | null;
};

type HomeTemplateGroup = {
  slug: string;
  category?: {
    name?: string | null;
    description?: string | null;
  } | null;
  templates: HomeTemplate[];
};


function facebookLink(templateName?: string) {
  const text = templateName
    ? `Tôi muốn đặt mẫu ${templateName}. Tư vấn giúp tôi làm web tặng người yêu.`
    : "Tôi muốn được tư vấn làm web tặng người yêu.";
  return `${FACEBOOK_URL}?text=${encodeURIComponent(text)}`;
}

/**
 * Returns { webp, png } thumbnail URLs.
 * Priority: DB thumbnail_url > slug-based convention fallback.
 * The <img> onError handler will fall through to live preview if none exist.
 */
function getThumbnailSrcs(
  slug: string,
  _componentKey: string,
  thumbnailUrl?: string | null
): { webp: string; png: string } {
  if (thumbnailUrl) {
    // DB url — use as-is for both (Supabase serves the actual format)
    return { webp: thumbnailUrl, png: thumbnailUrl };
  }
  // Fallback: try slug-based convention files in /public/thumbnails/
  return {
    webp: `/thumbnails/${slug}.webp`,
    png: `/thumbnails/${slug}.png`,
  };
}


// ─── Per-card hover logic ─────────────────────────────────────────────────────

function TemplatePreviewArea({ template }: { template: HomeTemplate }) {
  const [hovered, setHovered] = useState(false);
  const thumbSrcs = getThumbnailSrcs(template.slug, template.component_key, template.thumbnail_url);
  // Optimistic: assume thumbnail exists; onError on the <img> fallback sets false
  const [thumbnailExists, setThumbnailExists] = useState(true);

  const handleMouseEnter = () => {
    setHovered(true);
  };
  const handleMouseLeave = () => setHovered(false);

  // Phone frame shared style
  const phoneFrameCls =
    "mx-auto flex aspect-[9/19] w-full max-w-[340px] shrink-0 overflow-hidden rounded-[2.5rem] border-[6px] border-[#150a21] bg-[#05020a] shadow-2xl";

  return (
    <div
      className="relative mb-5 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        if (e.nativeEvent.isTrusted) {
          window.open(`/templates/${template.slug}/preview`, "_blank");
        }
      }}
    >
      {thumbSrcs && thumbnailExists ? (
        <>
          {/* ── Static thumbnail — visible when NOT hovered ── */}
          <div
            className={`${phoneFrameCls} relative transition-opacity duration-300`}
            style={{ opacity: hovered ? 0 : 1, visibility: hovered ? "hidden" : "visible" }}
          >
            {/*
              <picture> lets the browser pick WebP (sharp-compressed) when available,
              falling back to PNG automatically — no JS needed.
              onError on <img> is the last resort: if both 404, fall through to live preview.
            */}
            <picture className="h-full w-full">
              <source srcSet={thumbSrcs.webp} type="image/webp" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbSrcs.png}
                alt={`Thumbnail ${template.name}`}
                className="h-full w-full object-cover object-top"
                loading="lazy"
                decoding="async"
                onError={() => setThumbnailExists(false)}
              />
            </picture>
          </div>

          {/* ── Live preview — lazy-mounted, shown on hover ── */}
          {hovered && (
            <div
              className={`${phoneFrameCls} absolute inset-0 transition-opacity duration-300`}
              style={{ opacity: hovered ? 1 : 0, pointerEvents: hovered ? "auto" : "none", WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
            >
              <InteractiveTemplatePreview
                noFrame
                compact
                componentKey={template.component_key}
                gradient={template.gradient}
                visualLabel={template.visual_label}
                hideNavigation={true}
                forceRandomMusic={true}
                isActive={hovered}
              />
            </div>
          )}
        </>
      ) : (
        /* ── No thumbnail: render live preview immediately (fallback) ── */
        <div className={`${phoneFrameCls} w-full h-full`} style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}>
          <InteractiveTemplatePreview
            noFrame
            compact
            componentKey={template.component_key}
            gradient={template.gradient}
            visualLabel={template.visual_label}
            hideNavigation={true}
            forceRandomMusic={true}
            isActive={hovered}
          />
        </div>
      )}
    </div>
  );
}


// ─── Main catalog ──────────────────────────────────────────────────────────────

export function HomePageCatalog({ grouped }: { grouped: HomeTemplateGroup[] }) {
  const [activeTab, setActiveTab] = useState("all");

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
            onClick={() => setActiveTab(group.slug)}
            type="button"
          >
            {group.category?.name || group.slug}
          </button>
        ))}

        {/* Nút Xem bảng giá siêu nổi bật */}
        <div className="ml-auto shrink-0 flex items-center pr-1">
          <PricingModal hideWedding={true} />
        </div>
      </div>

      <div className="grid gap-14">
        {grouped
          .filter((group) => activeTab === "all" || group.slug === activeTab)
          .map((group) => (
            <section className="grid gap-5" id={`category-${group.slug}`} key={group.slug}>
              <div className="rounded-[28px] border border-white/70 bg-white/52 p-5 shadow-[0_14px_34px_rgba(215,112,158,0.1)] backdrop-blur-xl">
                <h3 className="text-2xl font-extrabold text-[#321a32]">{group.category?.name}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#76556d]">
                  {group.category?.description}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {group.templates.map((template) => (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px", amount: 0.1 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    key={template.id}
                    className="group h-full min-w-0"
                    style={{ contain: "layout style" }}
                  >
                    <GlassCard className="shine-card flex h-full min-h-[590px] flex-col p-4 sm:p-5">
                      <TemplatePreviewArea template={template} />

                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#c04b86]">
                            {group.category?.name}
                          </p>
                          <Link
                            href={`/templates/${template.slug}/preview`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <h4 className="mt-2 text-2xl font-extrabold leading-tight text-[#321a32] hover:text-[#d53f8c]">
                              {template.name}
                            </h4>
                          </Link>
                        </div>
                        {/* BỎ GIÁ TIỀN SẢN PHẨM Ở ĐÂY NHƯ USER YÊU CẦU */}
                      </div>

                      <div className="mt-3 flex-grow">
                        <p className="text-sm leading-6 text-[#76556d] whitespace-pre-wrap line-clamp-3">
                          {template.description || "Đang cập nhật mô tả..."}
                        </p>
                      </div>

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
                          href={facebookLink(template.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Chọn mẫu
                        </a>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
