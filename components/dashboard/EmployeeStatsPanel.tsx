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
  const [periodFilter, setPeriodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

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

  const periodOptions = useMemo(() => {
    const set = new Set<string>();
    sourceRows.forEach((row) => set.add("date" in row ? row.date : row.month));
    return Array.from(set).sort().reverse();
  }, [sourceRows]);

  const rows = sourceRows.filter((row) => {
    if (employeeFilter !== "all" && row.employeeId !== employeeFilter) return false;
    const periodValue = "date" in row ? row.date : row.month;
    if (periodFilter !== "all" && periodValue !== periodFilter) return false;
    return true;
  });

  const paginatedRows = rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.createdOrders += row.createdOrders;
        acc.activeOrders += row.activeOrders;
        acc.pendingOrders += row.pendingOrders;
        acc.revenue += row.revenue;
        acc.commissionEarned += row.commissionEarned;
        return acc;
      },
      { createdOrders: 0, activeOrders: 0, pendingOrders: 0, revenue: 0, commissionEarned: 0 }
    );
  }, [rows]);

  return (
    <GlassCard hover={false}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">Đơn theo nhân viên</h2>
        <div className="flex flex-wrap gap-2">
          <select
            className="rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-semibold outline-none"
            onChange={(event) => {
              setMode(event.target.value as "day" | "month");
              setPeriodFilter("all");
              setCurrentPage(1);
            }}
            value={mode}
          >
            <option value="day">Theo ngày</option>
            <option value="month">Theo tháng</option>
          </select>
          <select
            className="rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-semibold outline-none"
            onChange={(event) => { setPeriodFilter(event.target.value); setCurrentPage(1); }}
            value={periodFilter}
          >
            <option value="all">Tất cả {mode === "day" ? "ngày" : "tháng"}</option>
            {periodOptions.map((period) => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </select>
          <select
            className="rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-semibold outline-none"
            onChange={(event) => { setEmployeeFilter(event.target.value); setCurrentPage(1); }}
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
            {paginatedRows.length ? paginatedRows.map((row) => (
              <tr className="border-b border-white/8" key={`${"date" in row ? row.date : row.month}-${row.employeeId}`}>
                <td className="py-3 pr-4 font-semibold">{"date" in row ? row.date : row.month}</td>
                <td className="py-3 pr-4">
                  <Link href={`/dashboard/users/${row.employeeId}`} className="font-semibold text-pink-100 transition-colors hover:text-pink-300 hover:underline">
                    {row.employeeName}
                  </Link>
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
                  Chưa có đơn hoặc hoa hồng trong khoảng này.
                </td>
              </tr>
            )}
          </tbody>
          {rows.length > 0 && (
            <tfoot className="border-t border-white/20 bg-white/[0.03] text-sm font-bold">
              <tr>
                <td className="py-4 pr-4" colSpan={2}>
                  Tổng cộng {periodFilter !== "all" ? `trong ${periodFilter}` : ""}
                </td>
                <td className="py-4 pr-4">{totals.createdOrders}</td>
                <td className="py-4 pr-4">{totals.activeOrders}</td>
                <td className="py-4 pr-4">{totals.pendingOrders}</td>
                <td className="py-4 pr-4">{money(totals.revenue)}</td>
                <td className="py-4 pr-4 text-pink-300">{money(totals.commissionEarned)}</td>
              </tr>
            </tfoot>
          )}
        </table>
        
        {rows.length > rowsPerPage && (
          <div className="mt-5 flex items-center justify-center gap-3 border-t border-white/5 pt-4 pb-2">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition"
              type="button"
            >
              Trước
            </button>
            <span className="text-xs text-white/60 font-medium">
              Trang {currentPage} / {Math.ceil(rows.length / rowsPerPage)}
            </span>
            <button 
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= Math.ceil(rows.length / rowsPerPage)}
              className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition"
              type="button"
            >
              Tiếp
            </button>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
