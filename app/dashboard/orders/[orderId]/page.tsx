import { redirect } from "next/navigation";
import { OrderBuilderForm } from "@/components/dashboard/OrderBuilderForm";
import { getSession } from "@/lib/auth/session";
import { getOrdersByCreator, getPublishedTemplates, createServerSupabaseClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function EditOrderPage({ params }: Props) {
  const { orderId } = await params;
  const session = await getSession();

  if (!session) redirect("/login");

  const supabase = createServerSupabaseClient();

  const [templates, myOrders, userRecord, orderResult] = await Promise.all([
    getPublishedTemplates(),
    session.userId ? getOrdersByCreator(session.userId) : Promise.resolve([]),
    session.userId
      ? supabase
          .from("users")
          .select("role, custom_roles(permissions)")
          .eq("id", session.userId)
          .single()
          .then((res) => res.data)
      : Promise.resolve(null),
    supabase
      .from("orders")
      .select(
        "id, public_id, template_id, buyer_name, buyer_contact, recipient_name, custom_data, amount, status, created_at, expires_at, created_by_id, templates(id, name, component_key), payments(payment_code, status, paid_at)",
      )
      .eq("public_id", orderId)
      .maybeSingle(),
  ]);

  const order = orderResult.data;

  // If order doesn't exist or user doesn't own it, redirect to new order page
  if (!order) redirect("/dashboard/orders/new");
  if (session.role !== "ADMIN" && order.created_by_id !== session.userId) {
    redirect("/dashboard/orders/new");
  }

  const permissions = (userRecord?.custom_roles as any)?.permissions || [];
  const canCreateFree =
    session?.role === "ADMIN" ||
    userRecord?.role === "ADMIN" ||
    permissions.includes("orders:create_free");

  return (
    <div className="grid gap-6">
      <header className="glass-panel rounded-2xl p-5 sm:p-6">
        <p className="text-sm font-medium text-white/50">Chỉnh sửa đơn</p>
        <h1 className="text-3xl font-semibold sm:text-4xl">{orderId}</h1>
      </header>

      {templates.length === 0 ? (
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-2xl font-semibold">Chưa có template khả dụng</h2>
        </div>
      ) : (
        <OrderBuilderForm
          currentRole={session?.role ?? "EMPLOYEE"}
          myOrders={myOrders as never}
          templates={templates}
          canCreateFree={canCreateFree}
          initialOrder={order}
        />
      )}
    </div>
  );
}
