"use client";

import { useState } from "react";
import { InteractiveTemplatePreview } from "@/components/templates/InteractiveTemplatePreview";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { TemplatePreviewProps } from "@/components/templates/previews/types";
import { PaymentLockedView } from "@/components/gift/PaymentLockedView";

type GiftOrder = {
  custom_data: NonNullable<TemplatePreviewProps["customData"]> & {
    componentKey?: string;
    question?: string;
    recipientName?: string;
    senderName?: string;
    groomData?: Record<string, any>;
    brideData?: Record<string, any>;
    groomTemplateId?: string;
    brideTemplateId?: string;
  };
  public_id: string;
  recipient_name: string | null;
  templates?: {
    component_key?: string | null;
    gradient?: string | null;
    visual_label?: string | null;
  } | null;
  status: string;
  payments?: any;
};

export function GiftFullscreenView({ order, side: sideProp }: { order: GiftOrder; side?: "trai" | "gai" | null }) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const isLocked = order.status !== "ACTIVE" && order.status !== "RESPONDED";
  const [showPayment, setShowPayment] = useState(false);

  const searchParams = useSearchParams();
  const side = sideProp ?? searchParams.get("side");

  let customData = order.custom_data;
  let componentKey = customData.componentKey ?? order.templates?.component_key ?? "val-starry-constellation";

  // Merge Gái data if requested
  if (side === "gai" && (customData as any).gai) {
    customData = { ...customData, ...(customData as any).gai };
    if ((customData as any).gai.templateId) {
      componentKey = (customData as any).gai.templateId;
    }
  }

  const senderName = customData.senderName ?? "Anh";
  const recipientName = customData.recipientName ?? order.recipient_name ?? "Em";
  const isWedding = componentKey.startsWith("wedding");

  useEffect(() => {
    if (!isLocked) return;

    // Poll for payment status
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${order.public_id}/payment`);
        const data = await res.json();
        if (data.unlocked) {
          window.location.reload();
        }
      } catch (err) {}
    }, 5000);

    const stepHandler = (e: any) => {
      // Show payment if they reach halfway through the template
      const current = e.detail?.current || 0;
      const total = e.detail?.total || 1;
      if (current >= Math.floor(total / 2)) {
        setShowPayment(true);
      }
    };

    window.addEventListener('template-step-change', stepHandler);
    
    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('template-step-change', stepHandler);
    };
  }, [isLocked, isWedding, componentKey, order.public_id]);

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
    <div className="absolute inset-0 z-[100] bg-gradient-to-br from-[#fff6fa] via-[#ffe4ef] to-[#ffd4e5] overflow-hidden">
      {/* Scrollable Container for the template */}
      <div 
        className="absolute inset-0 z-0 overflow-y-auto overflow-x-hidden"
        onScrollCapture={(e) => {
          if (!isLocked || showPayment) return;
          const target = e.currentTarget;
          const scrollY = target.scrollTop;
          const scrollHeight = target.scrollHeight;
          const clientHeight = target.clientHeight;
          // Triggers if scrolled past 40% of the scrollable area
          if (scrollHeight > clientHeight && scrollY >= (scrollHeight - clientHeight) * 0.4) {
            setShowPayment(true);
          }
        }}
      >
        <InteractiveTemplatePreview
          componentKey={componentKey}
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
          hostDisplayName={recipientName}
          guestDisplayName={senderName}
          onResponse={handleResponse}
          roomId={order.public_id}
        />
      </div>

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

      {/* FIXED Overlay on top of the scrolling container */}
      {isLocked && (
        <div className="absolute inset-0 z-[999] pointer-events-none overflow-hidden">
          {/* Watermark Pattern Layer (Visible always if locked) */}
          <div 
            className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-25"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200' width='300' height='200'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='32' font-weight='900' font-family='sans-serif' letter-spacing='6' style='filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.8));' transform='rotate(-35, 150, 100)'%3ELOVORA%3C/text%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundPosition: 'center',
            }}
          />
          
          {/* Payment Box and Blur (Only when showPayment is true) */}
          {showPayment && (
            <div className="absolute inset-0 flex flex-col pointer-events-none">
              {/* Faded Gradient Blur Overlay */}
              <div className="absolute inset-0 z-10 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent_30%,black_65%)] backdrop-blur-[24px] bg-gradient-to-t from-white/95 via-white/50 to-transparent" />
              
              {/* Invisible Click Blocker for the entire screen to prevent bypass */}
              <div className="absolute inset-0 z-10 pointer-events-auto" />

              {/* Payment Box Container */}
              <div className="absolute bottom-6 left-0 right-0 z-20 pointer-events-auto flex flex-col items-center px-4">
                <div className="bg-white/95 p-5 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-pink-100/60 w-full max-w-sm flex flex-col items-center text-center backdrop-blur-xl relative overflow-hidden transform hover:scale-[1.01] transition-transform">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500" />
                  <h3 className="text-lg font-bold text-rose-600 mb-2 mt-2 uppercase tracking-wide">Mở khóa thiệp / quà tặng</h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed font-medium">
                    Đây là bản xem trước. Hãy thanh toán để xóa mờ và mở khóa toàn bộ các bước tiếp theo nhé!
                  </p>
                  <div className="w-full scale-[0.98] origin-top">
                    <PaymentLockedView orderId={order.public_id} payment={order.payments} inline={true} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
