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
  const imageUrl = thumbnail.startsWith('http') ? thumbnail : `https://lovora.vn${thumbnail}`;
  const images = [{ url: imageUrl, width: 1200, height: 630, alt: title }];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
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

  if (order.status !== "ACTIVE" && order.status !== "RESPONDED") {
    return <PaymentLockedView orderId={order.public_id} payment={order.payments} />;
  }

  return (
    <div className="min-h-screen w-full bg-[#f5e6ee] flex items-start justify-center">
      <div className="relative w-full max-w-[430px] min-h-screen shadow-2xl overflow-hidden bg-gradient-to-br from-[#fff6fa] via-[#ffe4ef] to-[#ffd4e5] text-rose-950">
        <GiftFullscreenView order={order} side={side} />
      </div>
    </div>
  );
}
