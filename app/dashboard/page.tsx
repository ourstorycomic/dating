import { GlassCard } from "@/components/ui/GlassCard";
import { getDashboardCounts, getRecentOrders } from "@/lib/supabase/server";
import { OrderFilters } from "@/components/dashboard/OrderFilters";

export default async function DashboardPage(props: { searchParams?: Promise<{ query?: string; status?: string; startDate?: string; endDate?: string }> }) {
  const searchParams = await props.searchParams;
  const [counts, recentOrders] = await Promise.all([getDashboardCounts(), getRecentOrders(searchParams)]);

  const stats = [
    { label: "Đơn", value: counts.orders },
    { label: "Nhân sự", value: counts.users },
    { label: "Nhật ký", value: counts.logs },
    { label: "Template", value: counts.templates },
  ];

  return (
    <div className="grid gap-6">
      <header className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <h1 className="text-3xl font-semibold sm:text-4xl">Tổng quan</h1>
          <a
            className="w-full rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-400 px-5 py-3 text-center text-sm font-semibold text-white sm:w-auto"
            href="/dashboard/orders/new"
          >
            Tạo đơn mới
          </a>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <GlassCard key={item.label} hover={false} className="p-5">
            <p className="text-sm text-white/58">{item.label}</p>
            <div className="mt-3 text-3xl font-bold">{item.value}</div>
          </GlassCard>
        ))}
      </section>

      <GlassCard hover={false} className="p-0">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-2xl font-semibold mb-4">Đơn gần đây</h2>
          <OrderFilters />
        </div>

        {recentOrders.length === 0 ? (
          <div className="grid min-h-40 place-items-center px-5 py-10 text-center text-sm text-white/58">
            Chưa có đơn.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="text-white/52">
                <tr className="border-b border-white/10">
                  <th className="px-5 py-4 font-medium">Mã đơn</th>
                  <th className="px-5 py-4 font-medium">Khách</th>
                  <th className="px-5 py-4 font-medium">Người nhận</th>
                  <th className="px-5 py-4 font-medium">Số tiền</th>
                  <th className="px-5 py-4 font-medium">Trạng thái</th>
                  <th className="px-5 py-4 font-medium">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr className="border-b border-white/8 last:border-0" key={order.id}>
                    <td className="px-5 py-4 font-semibold text-pink-100">{order.public_id}</td>
                    <td className="px-5 py-4">
                      <p>{order.buyer_name || "Chưa nhập"}</p>
                      <p className="mt-1 text-xs text-white/44">{order.buyer_contact}</p>
                    </td>
                    <td className="px-5 py-4 text-white/70">{order.recipient_name || "Chưa nhập"}</td>
                    <td className="px-5 py-4 font-semibold">{Number(order.amount).toLocaleString("vi-VN")}đ</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-xs font-semibold">{order.status}</span>
                    </td>
                    <td className="px-5 py-4 text-white/58">{new Date(order.created_at).toLocaleString("vi-VN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
