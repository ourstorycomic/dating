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

  const cd = (order.custom_data || {}) as any;
  let componentKey = cd.componentKey ?? (order.templates as any)?.component_key ?? "";
  if (side === "gai" && cd.gai) {
    if (cd.gai.templateId) componentKey = cd.gai.templateId;
  }
  const isWedding = componentKey.startsWith("wedding");

  let title, description;
  
  if (isWedding) {
     const groom = cd.groomName || "Chú Rể";
     const bride = cd.brideName || "Cô Dâu";
     const guest = order.recipient_name ? ` ${order.recipient_name}` : " bạn";
     title = `Thiệp Mời Đám Cưới | ${groom} & ${bride}`;
     description = `Trân trọng kính mời${guest} đến chung vui cùng gia đình chúng tôi.`;
  } else {
     const guest = order.recipient_name || "bạn";
     title = `Một món quà đặc biệt dành cho ${guest} 🎁 | Lovora`;
     description = `${guest} có một món quà bất ngờ đã được chuẩn bị sẵn. Hãy mở ra xem nhé!`;
  }

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
      </div>
    </div>
  );
}
