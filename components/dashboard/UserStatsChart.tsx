"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

type ChartData = {
  date: string;
  orders: number;
  commission: number;
};

export function UserStatsChart({ data }: { data: ChartData[] }) {
  const [viewMode, setViewMode] = useState<"DAY" | "MONTH">("DAY");

  const chartData = useMemo(() => {
    if (viewMode === "DAY") return data.slice(0, 30).reverse(); // Last 30 days

    // Group by month
    const monthlyData: Record<string, ChartData> = {};
    for (const item of data) {
      const month = item.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { date: month, orders: 0, commission: 0 };
      }
      monthlyData[month].orders += item.orders;
      monthlyData[month].commission += item.commission;
    }
    
    return Object.values(monthlyData).sort((a, b) => a.date.localeCompare(b.date));
  }, [data, viewMode]);

  if (!data.length) return <div className="p-10 text-center opacity-50 font-medium">Chưa có dữ liệu</div>;

  return (
    <div className="grid gap-6">
      <div className="flex justify-end gap-2">
        <button 
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${viewMode === "DAY" ? "bg-white/20 text-white" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`}
          onClick={() => setViewMode("DAY")}
        >
          Theo ngày
        </button>
        <button 
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${viewMode === "MONTH" ? "bg-white/20 text-white" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`}
          onClick={() => setViewMode("MONTH")}
        >
          Theo tháng
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders Line Chart */}
        <div className="rounded-2xl border border-white/10 bg-white/5 shadow-sm p-5">
          <h3 className="mb-6 text-sm font-bold opacity-80 text-white">Số đơn đã tạo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" fontSize={12} tickMargin={10} />
              <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "rgba(255,255,255,0.95)", borderColor: "rgba(0,0,0,0.1)", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
                itemStyle={{ color: "#333", fontWeight: 600 }}
              />
              <Line type="monotone" dataKey="orders" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, fill: "#fff", stroke: "#ec4899", strokeWidth: 2 }} activeDot={{ r: 6, fill: "#ec4899", stroke: "#fff", strokeWidth: 2 }} name="Số đơn" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Commission Bar Chart */}
        <div className="rounded-2xl border border-white/10 bg-white/5 shadow-sm p-5">
          <h3 className="mb-6 text-sm font-bold opacity-80 text-white">Hoa hồng nhận được (VNĐ)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" fontSize={12} tickMargin={10} />
              <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} tickFormatter={(val) => `${val / 1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: "rgba(255,255,255,0.95)", borderColor: "rgba(0,0,0,0.1)", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
                itemStyle={{ color: "#333", fontWeight: 600 }}
                formatter={(value: any) => [`${Number(value || 0).toLocaleString("vi-VN")}đ`, "Hoa hồng"]}
              />
              <Bar dataKey="commission" fill="#fb923c" radius={[4, 4, 0, 0]} name="Hoa hồng" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
