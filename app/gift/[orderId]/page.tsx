import { notFound } from "next/navigation";
import { GiftFullscreenView } from "@/components/gift/GiftFullscreenView";
import { PaymentLockedView } from "@/components/gift/PaymentLockedView";
import { getOrderByPublicId } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function GiftPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderByPublicId(orderId);

  if (!order) notFound();

  if (order.status !== "ACTIVE" && order.status !== "RESPONDED") {
    return <PaymentLockedView orderId={order.public_id} payment={order.payments} />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-white">
      <GiftFullscreenView order={order} />
    </div>
  );
}
