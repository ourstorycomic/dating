"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

type StatRow = {
  activeOrders: number;
  commissionEarned: number;
  createdOrders: number;
  employeeEmail: string;
  employeeId: string;
  employeeName: string;
  revenue: number;
};

type MonthlyRow = StatRow & { month: string };

function money(value: number) {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
}

export function EmployeeLeaderboardPanel({ monthlyStats }: { monthlyStats: MonthlyRow[] }) {
  const [periodFilter, setPeriodFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const periodOptions = useMemo(() => {
    const set = new Set<string>();
    monthlyStats.forEach((row) => set.add(row.month));
    return Array.from(set).sort().reverse();
  }, [monthlyStats]);

  const fullLeaderboard = useMemo(() => {
    const map = new Map<string, StatRow>();

    monthlyStats.forEach((row) => {
      if (periodFilter !== "all" && row.month !== periodFilter) return;

      const existing = map.get(row.employeeId);
      if (existing) {
        existing.commissionEarned += row.commissionEarned;
        existing.revenue += row.revenue;
        existing.activeOrders += row.activeOrders;
        existing.createdOrders += row.createdOrders;
      } else {
        map.set(row.employeeId, { ...row });
      }
    });

    return Array.from(map.values())
      .sort((a, b) => b.commissionEarned - a.commissionEarned || b.revenue - a.revenue)
      .map((emp, index) => ({ ...emp, rank: index + 1 }));
  }, [monthlyStats, periodFilter]);

  const displayLeaderboard = useMemo(() => {
    if (!searchQuery.trim()) return fullLeaderboard.slice(0, 10);
    const query = searchQuery.toLowerCase();
    return fullLeaderboard.filter(emp => 
      emp.employeeName.toLowerCase().includes(query) || 
      emp.employeeEmail.toLowerCase().includes(query)
    );
  }, [fullLeaderboard, searchQuery]);

  if (fullLeaderboard.length === 0) return null;

  return (
    <GlassCard hover={false} className="relative overflow-hidden border-2 border-pink-500/30">
      <div className="absolute top-0 right-0 p-32 bg-pink-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🏆 Bảng Xếp Hạng
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Tìm nhân viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-full border border-rose-950/20 bg-rose-950/[0.03] px-4 py-2 text-sm font-semibold outline-none focus:bg-rose-950/[0.05] transition-colors min-w-[200px]"
          />
          <select
            className="rounded-full border border-rose-950/20 bg-rose-950/[0.03] px-4 py-2 text-sm font-semibold outline-none focus:bg-rose-950/[0.05] transition-colors"
            onChange={(event) => setPeriodFilter(event.target.value)}
            value={periodFilter}
          >
            <option value="all">Tất cả thời gian</option>
            {periodOptions.map((period) => (
              <option key={period} value={period}>
                Tháng {period}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 relative z-10">
        {displayLeaderboard.length === 0 ? (
          <div className="text-center py-8 opacity-60 font-medium">Không tìm thấy nhân viên phù hợp</div>
        ) : displayLeaderboard.map((emp) => {
          let rankIcon = null;
          let bgClass = "bg-rose-950/[0.02]";
          let borderClass = "border-rose-950/5";
          
          if (emp.rank === 1) {
            rankIcon = "🥇";
            bgClass = "bg-gradient-to-r from-yellow-500/20 to-amber-500/5";
            borderClass = "border-yellow-500/40";
          } else if (emp.rank === 2) {
            rankIcon = "🥈";
            bgClass = "bg-gradient-to-r from-slate-500/20 to-gray-500/5";
            borderClass = "border-gray-400/40";
          } else if (emp.rank === 3) {
            rankIcon = "🥉";
            bgClass = "bg-gradient-to-r from-orange-600/20 to-amber-700/5";
            borderClass = "border-orange-500/40";
          } else {
            rankIcon = <span className="opacity-40 font-bold">#{emp.rank}</span>;
          }

          return (
            <div key={emp.employeeId} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border ${borderClass} ${bgClass} transition hover:bg-rose-950/[0.05]`}>
              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <div className="flex items-center justify-center w-10 h-10 text-3xl">
                  {rankIcon}
                </div>
                <div>
                  <Link href={`/dashboard/users/${emp.employeeId}`} className="font-bold text-lg hover:text-pink-600 hover:underline">
                    {emp.employeeName}
                  </Link>
                  <p className="text-xs opacity-50 font-medium">{emp.employeeEmail}</p>
                </div>
              </div>
              <div className="text-left sm:text-right ml-14 sm:ml-0">
                <div className="font-bold text-pink-600 text-xl">
                  {money(emp.commissionEarned)} <span className="text-xs font-normal opacity-50">hoa hồng</span>
                </div>
                <div className="text-xs opacity-60 mt-1 font-medium">
                  {emp.activeOrders} đơn thành công - Doanh thu: {money(emp.revenue)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
