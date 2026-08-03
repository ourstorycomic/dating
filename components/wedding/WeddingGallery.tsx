"use client";

import React, { useState } from "react";
import { SampleCard } from "./SampleCard";

export function WeddingGallery({ videoSamples, normalSamples }: { videoSamples: any[]; normalSamples: any[] }) {
  const [activeTab, setActiveTab] = useState<"thiep" | "video">("thiep");

  return (
    <section id="samples" className="mt-24">
      <div className="flex flex-col gap-6 text-center md:text-left mt-8">
        <div className="flex justify-center md:justify-start gap-4 mb-4">
          <button 
            onClick={() => setActiveTab("thiep")}
            className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === "thiep" ? "bg-[#C5A880] text-white shadow-lg scale-105" : "bg-white text-[#7A726D] hover:bg-[#F4EFEA] border border-[#E8D9C8]"}`}
          >
            Thiệp Cưới Online
          </button>
          <button 
            onClick={() => setActiveTab("video")}
            className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === "video" ? "bg-[#C5A880] text-white shadow-lg scale-105" : "bg-white text-[#7A726D] hover:bg-[#F4EFEA] border border-[#E8D9C8]"}`}
          >
            Video Trình Chiếu
          </button>
        </div>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {activeTab === "video" ? (
          videoSamples.map((sample, index) => (
            <SampleCard key={sample.component_key} sample={sample} index={index} />
          ))
        ) : (
          normalSamples.map((sample, index) => (
            <SampleCard key={sample.component_key} sample={sample} index={index} />
          ))
        )}
      </div>
    </section>
  );
}
