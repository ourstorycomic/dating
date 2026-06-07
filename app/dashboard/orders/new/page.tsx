import { OrderBuilderForm } from "@/components/dashboard/OrderBuilderForm";
import { getSession } from "@/lib/auth/session";
import { getOrdersByCreator, getPublishedTemplates } from "@/lib/supabase/server";

export default async function NewOrderPage() {
  const session = await getSession();
  const [templates, myOrders] = await Promise.all([
    getPublishedTemplates(),
    session?.userId ? getOrdersByCreator(session.userId) : Promise.resolve([]),
  ]);

  return (
    <div className="grid gap-6">
      <header className="glass-panel rounded-2xl p-5 sm:p-6">
        <h1 className="text-3xl font-semibold sm:text-4xl">Tạo đơn cho khách</h1>
      </header>

      {templates.length === 0 ? (
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-2xl font-semibold">Chưa có template khả dụng</h2>
        </div>
      ) : (
        <OrderBuilderForm myOrders={myOrders as never} templates={templates} />
      )}
    </div>
  );
}
