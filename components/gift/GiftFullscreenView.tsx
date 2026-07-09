"use client";

import { useState } from "react";
import { InteractiveTemplatePreview } from "@/components/templates/InteractiveTemplatePreview";
import type { TemplatePreviewProps } from "@/components/templates/previews/types";

type GiftOrder = {
  custom_data: NonNullable<TemplatePreviewProps["customData"]> & {
    componentKey?: string;
    question?: string;
    recipientName?: string;
    senderName?: string;
  };
  public_id: string;
  recipient_name: string | null;
  templates?: {
    component_key?: string | null;
    gradient?: string | null;
    visual_label?: string | null;
  } | null;
};

export function GiftFullscreenView({ order }: { order: GiftOrder }) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const customData = order.custom_data;
  const senderName = customData.senderName ?? "Anh";
  const recipientName = customData.recipientName ?? order.recipient_name ?? "Em";

  async function handleResponse(response: { answer: string; message?: string; audioDataUrl?: string; date?: string }) {
    try {
      const res = await fetch(`/api/orders/${order.public_id}/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: response.answer,
          message: response.date ? `Ngày được chọn: ${response.date}` : response.message || "",
          audioDataUrl: response.audioDataUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Không gửi được phản hồi.");
        setTimeout(() => setError(""), 4000);
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Có lỗi xảy ra khi gửi phản hồi.");
      setTimeout(() => setError(""), 4000);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-[#fff6fa] via-[#ffe4ef] to-[#ffd4e5]">
      <InteractiveTemplatePreview
        componentKey={customData.componentKey ?? order.templates?.component_key ?? "val-starry-constellation"}
        customData={customData}
        gradient={order.templates?.gradient}
        question={customData.question}
        recipientName={recipientName}
        senderName={senderName}
        visualLabel={order.templates?.visual_label}
        hideNavigation
        fullScreen
        isHost
        initialStep={2}
        hostDisplayName={senderName}
        guestDisplayName={recipientName}
        onResponse={handleResponse}
        roomId={order.public_id}
      />
      {error ? (
        <div className="absolute left-1/2 top-4 z-[200] -translate-x-1/2 rounded-full bg-red-500 px-4 py-2 font-bold text-white shadow-lg">
          {error}
        </div>
      ) : null}
      {saved ? (
        <div className="absolute left-1/2 top-4 z-[200] -translate-x-1/2 rounded-full bg-green-500 px-4 py-2 font-bold text-white shadow-lg">
          Đã gửi phản hồi thành công!
        </div>
      ) : null}
    </div>
  );
}
