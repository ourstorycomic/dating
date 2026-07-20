import { notFound } from "next/navigation";
import { GiftFullscreenView } from "@/components/gift/GiftFullscreenView";
import { PaymentLockedView } from "@/components/gift/PaymentLockedView";
import { getOrderByPublicId } from "@/lib/supabase/server";

import { Metadata } from "next";

export const dynamic = "force-dynamic";

/** Strip -trai / -gai suffix to get the real DB orderId */
function parseOrderId(raw: string): { baseId: string; side: "trai" | "gai" | null } {
  if (raw.endsWith("-trai")) return { baseId: raw.slice(0, -5), side: "trai" };
  if (raw.endsWith("-gai"))  return { baseId: raw.slice(0, -4), side: "gai" };
  return { baseId: raw, side: null };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderId: string }>;
}): Promise<Metadata> {
  const { orderId: rawId } = await params;
  const { baseId } = parseOrderId(rawId);
  const order = await getOrderByPublicId(baseId);

  if (!order) {
    return { title: "Không tìm thấy món quà | Lovora" };
  }

  const recipient = order.recipient_name || "bạn";
  const title = `Một món quà đặc biệt dành cho ${recipient} 🎁 | Lovora`;
  const description = "Bạn có một món quà bất ngờ đã được chuẩn bị sẵn. Hãy mở ra xem nhé!";
  const thumbnail = order.templates?.thumbnail_url || "/thumbnails/valentine1.png";
  // Use absolute URL for Zalo/social crawlers
  const imageUrl = thumbnail.startsWith('http') ? thumbnail : `https://lovora.click${thumbnail}`;
  const images = [{ url: imageUrl, width: 1200, height: 630, alt: title }];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://lovora.click/gift/${rawId}`,
      siteName: "Lovora",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export default async function GiftPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId: rawId } = await params;
  const { baseId, side } = parseOrderId(rawId);
  const order = await getOrderByPublicId(baseId);

  if (!order) notFound();

  const cd = (order.custom_data || {}) as any;
  let componentKey = cd.componentKey ?? (order.templates as any)?.component_key ?? "";
  
  // Resolve side overrides if gai
  if (side === "gai" && cd.gai) {
    if (cd.gai.templateId) componentKey = cd.gai.templateId;
  }
  
  const isWedding = componentKey.startsWith("wedding");

  const isLocked = order.status !== "ACTIVE" && order.status !== "RESPONDED";

  if (isLocked && order.custom_data) {
    // Server-side data obfuscation to prevent bypassing via DevTools
    const hide = "Nội dung này đã bị ẩn. Hãy thanh toán để mở khóa toàn bộ món quà/thiệp nhé!";
    
    if (cd.memories && Array.isArray(cd.memories)) {
      cd.memories = cd.memories.map((m: any) => ({ ...m, message: hide, title: "Đã khóa" }));
    }
    
    // Obfuscate text content for later stages
    const fieldsToHide = [
      'stage4RevealBody', 'finalSubtitle', 'finalMessage', 'confessionText', 
      'page2Text', 'giftAcceptedBody', 'contractBody', 'letterText', 'stage2Quote'
    ];
    fieldsToHide.forEach(field => {
      if (cd[field]) cd[field] = hide;
    });

    // Remove media to save bandwidth for unpaid orders
    if (cd.musicUrl) cd.musicUrl = "";
    if (cd.generalAudioUrl) cd.generalAudioUrl = "";
  }

  return (
    <div className={`min-h-[100dvh] w-full bg-[#f5e6ee] flex items-start justify-center relative ${!isWedding ? "overflow-hidden" : ""}`}>
      <div className={`relative w-full min-h-[100dvh] shadow-2xl bg-gradient-to-br from-[#fff6fa] via-[#ffe4ef] to-[#ffd4e5] text-rose-950 ${isWedding ? "max-w-[430px]" : "h-[100dvh] overflow-hidden"}`}>
        <GiftFullscreenView order={order} side={side} />
        
        {isLocked && (
          <div className="absolute inset-0 z-[999] pointer-events-none overflow-hidden flex flex-col">
            {/* Watermark Pattern Layer (Visible on both light and dark backgrounds) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <div className="absolute w-[200%] h-[200%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 flex flex-wrap gap-x-10 gap-y-16 justify-center items-center content-center select-none opacity-25">
                {Array.from({length: 150}).map((_, i) => (
                  <span key={i} className="text-2xl md:text-3xl font-black text-white uppercase tracking-[0.2em] whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    Bản Xem Trước
                  </span>
                ))}
              </div>
            </div>

            {/* Faded Gradient Blur Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent_30%,black_65%)] backdrop-blur-[24px] bg-gradient-to-t from-white/95 via-white/50 to-transparent" />
            
            {/* Invisible Click Blocker for the blurred area */}
            <div className="absolute bottom-0 left-0 right-0 h-[60vh] z-10 pointer-events-auto" />

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
    </div>
  );
}
