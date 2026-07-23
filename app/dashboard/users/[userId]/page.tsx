import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getUserDetails } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { UserStatsChart } from "@/components/dashboard/UserStatsChart";

export default async function UserDetailPage(props: { params: Promise<{ userId: string }> }) {
  const session = await getSession();

  if (!session || !["ADMIN", "STAFF"].includes(session.role)) {
    redirect("/dashboard");
  }

  const { userId } = await props.params;
  const data = await getUserDetails(userId);

  if (!data || !data.user) {
    return (
      <div className="p-10 text-center text-white">
        Không tìm thấy nhân viên. <Link href="/dashboard/users" className="text-pink-400">Quay lại</Link>
      </div>
    );
  }

  const { user, orders, commissions } = data;

  // Process stats
  let totalCommission = 0;
  for (const c of commissions) {
    if (c.status === "EARNED") {
      totalCommission += Number(c.amount ?? 0);
    }
  }

  const activeOrders = orders.filter(o => o.status === "ACTIVE" || o.status === "RESPONDED");
  
  // Group by date for chart
  const dailyDataMap = new Map<string, { date: string; orders: number; commission: number }>();
  
  // Populate all days from the first order or commission to today
  const sortedDates = [...orders.map(o => o.created_at), ...commissions.map(c => c.created_at)].sort();
  if (sortedDates.length > 0) {
    const firstDate = new Date(sortedDates[0]);
    const today = new Date();
    for (let d = firstDate; d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      dailyDataMap.set(dateStr, { date: dateStr, orders: 0, commission: 0 });
    }
  }

  for (const o of orders) {
    const dateStr = new Date(o.created_at).toISOString().split("T")[0];
    if (dailyDataMap.has(dateStr)) {
      dailyDataMap.get(dateStr)!.orders += 1;
    }
  }

  for (const c of commissions) {
    if (c.status === "EARNED") {
      const dateStr = new Date(c.created_at).toISOString().split("T")[0];
      if (dailyDataMap.has(dateStr)) {
        dailyDataMap.get(dateStr)!.commission += Number(c.amount ?? 0);
      }
    }
  }

  const chartData = Array.from(dailyDataMap.values()).sort((a, b) => b.date.localeCompare(a.date)); // descending for easier processing, but chart might want ascending. Chart handles it.

  return (
    <div className="grid gap-6">
      <header className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-2">
          <Link href="/dashboard/users" className="text-sm text-pink-400 hover:underline mb-2 flex items-center gap-1">
            &larr; Quay lại danh sách nhân sự
          </Link>
          <h1 className="text-3xl font-semibold sm:text-4xl text-white">{user.name}</h1>
          <p className="text-white/60">{user.email} &bull; Vai trò: {user.role}</p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <GlassCard hover={false} className="p-5">
          <p className="text-sm text-white/58">Tổng số đơn tạo</p>
          <div className="mt-2 text-3xl font-bold">{orders.length}</div>
        </GlassCard>
        <GlassCard hover={false} className="p-5">
          <p className="text-sm text-white/58">Đơn thành công (Active)</p>
          <div className="mt-2 text-3xl font-bold text-green-400">{activeOrders.length}</div>
        </GlassCard>
        <GlassCard hover={false} className="p-5">
          <p className="text-sm text-white/58">Tổng hoa hồng nhận được</p>
          <div className="mt-2 text-3xl font-bold text-pink-400">{totalCommission.toLocaleString("vi-VN")}đ</div>
        </GlassCard>
      </div>

      <GlassCard hover={false} className="p-5">
        <h2 className="text-xl font-semibold mb-6 text-white">Biểu đồ hoạt động</h2>
        <UserStatsChart data={chartData} />
      </GlassCard>

      <GlassCard hover={false} className="p-0">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-xl font-semibold text-white">Lịch sử đơn đã làm</h2>
        </div>
        
        {orders.length === 0 ? (
          <div className="p-10 text-center text-white/50">Chưa có đơn nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="text-white/50 border-b border-white/10">
                <tr>
                  <th className="px-5 py-3 font-medium">Mã đơn</th>
                  <th className="px-5 py-3 font-medium">Trạng thái</th>
                  <th className="px-5 py-3 font-medium">Số tiền</th>
                  <th className="px-5 py-3 font-medium">Ngày tạo</th>
                  <th className="px-5 py-3 font-medium">Hoa hồng nhận</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const com = commissions.find(c => c.order_id === order.id && c.status === "EARNED");
                  return (
                    <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                      <td className="px-5 py-4 font-semibold text-pink-300">
                        <Link href={`/dashboard/orders/${order.public_id}`} className="hover:underline">
                          {order.public_id}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-white/10 px-2 py-1 text-xs">{order.status}</span>
                      </td>
                      <td className="px-5 py-4">{Number(order.amount).toLocaleString("vi-VN")}đ</td>
                      <td className="px-5 py-4 text-white/60">{new Date(order.created_at).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</td>
                      <td className="px-5 py-4 font-semibold text-green-300">{com ? `+${Number(com.amount).toLocaleString("vi-VN")}đ` : "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
