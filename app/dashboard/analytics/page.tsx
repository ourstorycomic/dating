import { redirect } from "next/navigation";
import { CommissionRulesForm } from "@/components/dashboard/CommissionRulesForm";
import { EmployeeStatsPanel } from "@/components/dashboard/EmployeeStatsPanel";
import { GlassCard } from "@/components/ui/GlassCard";
import { getSession } from "@/lib/auth/session";
import {
  getCommissionRules,
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

  const [counts, dailyStats, monthlyStats, commissionRules, commissions] = await Promise.all([
    getDashboardCounts(),
    getEmployeeDailyStats({ days: 14 }),
    getEmployeeMonthlyStats({ months: 12 }),
    getCommissionRules(),
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

      <EmployeeStatsPanel dailyStats={dailyStats} monthlyStats={monthlyStats} />

      {session.role === "ADMIN" ? (
        <GlassCard hover={false}>
          <h2 className="text-2xl font-semibold">Chia hoa hồng</h2>
          <div className="mt-5">
            <CommissionRulesForm
              rules={commissionRules.map((rule) => ({
                is_active: Boolean(rule.is_active),
                percentage: Number(rule.percentage),
                recipient_type: rule.recipient_type as "AFFILIATE" | "EMPLOYEE" | "STAFF",
              }))}
            />
          </div>
        </GlassCard>
      ) : null}

      <GlassCard hover={false}>
        <h2 className="text-2xl font-semibold">Hoa hồng gần đây</h2>
        <div className="mt-5 grid gap-3">
          {commissions.length ? commissions.map((commission) => {
            const user = Array.isArray(commission.users) ? commission.users[0] : commission.users;
            const affiliate = Array.isArray(commission.affiliates) ? commission.affiliates[0] : commission.affiliates;
            const order = Array.isArray(commission.orders) ? commission.orders[0] : commission.orders;
            return (
              <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.05] p-4 md:grid-cols-[1fr_150px_150px]" key={commission.id}>
                <div>
                  <p className="font-semibold">{user?.name ?? affiliate?.name ?? "Không rõ"}</p>
                  <p className="text-xs text-white/48">Đơn {order?.public_id ?? "N/A"} - {commission.recipient_type}</p>
                </div>
                <p className="text-sm text-white/68">{Number(commission.percentage).toLocaleString("vi-VN")}%</p>
                <p className="font-semibold text-pink-100">{money(Number(commission.amount))}</p>
              </div>
            );
          }) : (
            <p className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-white/58">
              Chưa có hoa hồng.
            </p>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
