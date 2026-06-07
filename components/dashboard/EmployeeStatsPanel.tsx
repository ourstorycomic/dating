"use client";

import { useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

type StatRow = {
  activeOrders: number;
  commissionEarned: number;
  createdOrders: number;
  employeeEmail: string;
  employeeId: string;
  employeeName: string;
  pendingOrders: number;
  revenue: number;
};

type DailyRow = StatRow & { date: string };
type MonthlyRow = StatRow & { month: string };

function money(value: number) {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
}

export function EmployeeStatsPanel({
  dailyStats,
  monthlyStats,
}: {
  dailyStats: DailyRow[];
  monthlyStats: MonthlyRow[];
}) {
  const [mode, setMode] = useState<"day" | "month">("day");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const employeeOptions = useMemo(() => {
    const map = new Map<string, { email: string; name: string }>();
    [...dailyStats, ...monthlyStats].forEach((row) => {
      if (!map.has(row.employeeId)) {
        map.set(row.employeeId, { email: row.employeeEmail, name: row.employeeName });
      }
    });
    return Array.from(map, ([id, value]) => ({ id, ...value })).sort((a, b) => a.name.localeCompare(b.name, "vi"));
  }, [dailyStats, monthlyStats]);
  const sourceRows = mode === "day" ? dailyStats : monthlyStats;
  const rows = employeeFilter === "all" ? sourceRows : sourceRows.filter((row) => row.employeeId === employeeFilter);

  return (
    <GlassCard hover={false}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">Đơn theo nhân viên</h2>
        <div className="flex flex-wrap gap-2">
        <select
          className="rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-semibold outline-none"
          onChange={(event) => setMode(event.target.value as "day" | "month")}
          value={mode}
        >
          <option value="day">Theo ngày</option>
          <option value="month">Theo tháng</option>
        </select>
        <select
          className="rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-semibold outline-none"
          onChange={(event) => setEmployeeFilter(event.target.value)}
          value={employeeFilter}
        >
          <option value="all">Tất cả nhân viên</option>
          {employeeOptions.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[940px] text-left text-sm">
          <thead className="text-white/48">
            <tr className="border-b border-white/10">
              <th className="py-3 pr-4">{mode === "day" ? "Ngày" : "Tháng"}</th>
              <th className="py-3 pr-4">Nhân viên</th>
              <th className="py-3 pr-4">Tổng đơn</th>
              <th className="py-3 pr-4">Đã thanh toán</th>
              <th className="py-3 pr-4">Chờ tiền</th>
              <th className="py-3 pr-4">Doanh thu</th>
              <th className="py-3 pr-4">Hoa hồng</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? rows.map((row) => (
              <tr className="border-b border-white/8" key={`${"date" in row ? row.date : row.month}-${row.employeeId}`}>
                <td className="py-3 pr-4 font-semibold">{"date" in row ? row.date : row.month}</td>
                <td className="py-3 pr-4">
                  <p className="font-semibold text-pink-100">{row.employeeName}</p>
                  <p className="text-xs text-white/42">{row.employeeEmail}</p>
                </td>
                <td className="py-3 pr-4">{row.createdOrders}</td>
                <td className="py-3 pr-4">{row.activeOrders}</td>
                <td className="py-3 pr-4">{row.pendingOrders}</td>
                <td className="py-3 pr-4 font-semibold">{money(row.revenue)}</td>
                <td className="py-3 pr-4 font-semibold text-pink-100">{money(row.commissionEarned)}</td>
              </tr>
            )) : (
              <tr>
                <td className="py-5 text-white/54" colSpan={7}>
                  Chưa có đơn trong khoảng này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
