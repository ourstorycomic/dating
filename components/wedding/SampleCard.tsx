"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { InteractiveTemplatePreview } from "@/components/templates/InteractiveTemplatePreview";

const renderDescription = (text?: string) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-[#2D2A28]">{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
};

export function SampleCard({ sample, index }: { sample: any; index: number }) {
  const [hovered, setHovered] = useState(false);
  const isLandscape = sample.component_key?.toLowerCase().includes("video");

  return (
    <motion.article 
      initial={{ opacity: 0, y: 24 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, amount: 0.2 }} 
      transition={{ duration: 0.5, delay: index * 0.1 }} 
      whileHover={{ y: -8 }}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-white border border-[#F4EFEA] shadow-[0_4px_20px_rgba(45,42,40,0.04)] hover:shadow-[0_12px_40px_rgba(45,42,40,0.08)] transition-all duration-300 h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`relative w-full overflow-hidden bg-[#FDFBF7] ${isLandscape ? 'aspect-video' : 'aspect-[4/5]'}`}>
        {hovered && sample.component_key ? (
          <div className="absolute inset-0 z-10 bg-black/5 [&>div>div]:!rounded-b-none pointer-events-none">
            <InteractiveTemplatePreview
              noFrame
              compact
              componentKey={sample.component_key}
              hideNavigation={true}
              forceRandomMusic={true}
              isActive={hovered}
            />
          </div>
        ) : (
          <>
            <img src={sample.thumbnail_url || sample.image} alt={sample.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute left-6 bottom-6">
              <span className="rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#4A4542]">
                {sample.visual_label || sample.tag || (isLandscape ? "Video 4K" : "Tối Giản")}
              </span>
            </div>
          </>
        )}
      </div>
      <div className="p-8 flex flex-col flex-1">
        <h3 className="font-serif-elegant text-2xl font-semibold text-[#2D2A28]">{sample.name}</h3>
        <p className="mt-4 text-[15px] leading-relaxed text-[#7A7571] flex-1 whitespace-pre-line line-clamp-4">
          {renderDescription(sample.description)}
        </p>
        <div className="mt-8 pt-6 border-t border-[#F4EFEA] flex flex-wrap gap-4 items-center justify-between">
          <Link 
            href={`/wedding/preview/${sample.component_key}`}
            className="group/btn inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-[#2D2A28] transition-colors hover:text-[#C69C6D]"
          >
            XEM CHI TIẾT MẪU
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
          
          <a
            href={`https://m.me/lovoraofficial?text=${encodeURIComponent(`Chào Lovora, mình muốn được tư vấn và đặt mua mẫu: ${sample.name}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group/msg inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-[#0084FF] transition-colors hover:text-[#006bd6] bg-[#0084FF]/10 hover:bg-[#0084FF]/20 px-3 py-2 rounded-xl"
            title={`Nhắn tin tư vấn mẫu ${sample.name}`}
          >
            <MessageCircle className="w-4 h-4" />
            NHẮN TIN
          </a>
        </div>
      </div>
    </motion.article>
  );
}
