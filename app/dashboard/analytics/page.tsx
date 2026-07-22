import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";
import { EmployeeStatsPanel } from "@/components/dashboard/EmployeeStatsPanel";
import { EmployeeLeaderboardPanel } from "@/components/dashboard/EmployeeLeaderboardPanel";
import { CommissionListPanel } from "@/components/dashboard/CommissionListPanel";
import { GlassCard } from "@/components/ui/GlassCard";
import { getSession } from "@/lib/auth/session";
import {
  getCommissionSummary,
  getDashboardCounts,
  getEmployeeDailyStats,
  getEmployeeMonthlyStats,
} from "@/lib/supabase/server";

function money(value: number) {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
}

export default async function AnalyticsPage() {
  const session = await getSession();
  if (!session || !["ADMIN", "STAFF"].includes(session.role)) redirect("/dashboard");

  const [counts, dailyStats, monthlyStats, commissions] = await Promise.all([
    getDashboardCounts(),
    getEmployeeDailyStats({ days: 14 }),
    getEmployeeMonthlyStats({ months: 12 }),
    getCommissionSummary(),
  ]);

  const revenue = dailyStats.reduce((sum, row) => sum + row.revenue, 0);
  const commissionEarned = dailyStats.reduce((sum, row) => sum + row.commissionEarned, 0);
  const activeOrders = dailyStats.reduce((sum, row) => sum + row.activeOrders, 0);
  const pendingOrders = dailyStats.reduce((sum, row) => sum + row.pendingOrders, 0);

  return (
    <div className="grid gap-6">
      <header className="glass-panel rounded-2xl p-5 sm:p-6">
        <h1 className="text-3xl font-semibold sm:text-4xl">Thống kê</h1>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Tổng đơn", counts.orders],
          ["Đã thanh toán", activeOrders],
          ["Chờ tiền", pendingOrders],
          ["Doanh thu", money(revenue)],
          ["Hoa hồng", money(commissionEarned)],
        ].map(([label, value]) => (
          <GlassCard className="p-5" hover={false} key={label}>
            <p className="text-sm text-white/58">{label}</p>
            <div className="mt-3 text-3xl font-bold">{value}</div>
          </GlassCard>
        ))}
      </section>

      <EmployeeLeaderboardPanel monthlyStats={monthlyStats} />

      <EmployeeStatsPanel dailyStats={dailyStats} monthlyStats={monthlyStats} />

      <CommissionListPanel commissions={commissions as any} />
    </div>
  );
}
