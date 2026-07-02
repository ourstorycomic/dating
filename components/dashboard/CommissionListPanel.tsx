"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

type CommissionItem = {
  id: string;
  amount: number | string;
  percentage: number | string;
  recipient_type: string;
  user_id: string | null;
  users?: any;
  affiliates?: any;
  orders?: any;
};

function money(value: number | string) {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
}

export function CommissionListPanel({ commissions }: { commissions: CommissionItem[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const rowsPerPage = 10;
  
  const filteredCommissions = commissions.filter(c => {
    if (typeFilter !== "ALL" && c.recipient_type !== typeFilter) return false;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const user = Array.isArray(c.users) ? c.users[0] : c.users;
      const affiliate = Array.isArray(c.affiliates) ? c.affiliates[0] : c.affiliates;
      const order = Array.isArray(c.orders) ? c.orders[0] : c.orders;
      
      const userName = (user?.name || "").toLowerCase();
      const affName = (affiliate?.name || "").toLowerCase();
      const orderId = (order?.public_id || "").toLowerCase();
      
      if (!userName.includes(q) && !affName.includes(q) && !orderId.includes(q)) return false;
    }
    
    return true;
  });

  const totalPages = Math.ceil(filteredCommissions.length / rowsPerPage);
  const paginatedCommissions = filteredCommissions.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <GlassCard hover={false}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">Hoa hồng gần đây</h2>
        <div className="flex flex-wrap gap-2">
           <input
             className="w-full sm:w-auto rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-semibold outline-none transition focus:border-pink-300/50"
             placeholder="Tìm mã đơn, tên..."
             value={searchQuery}
             onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
           />
           <select
             className="w-full sm:w-auto rounded-full border border-white/10 bg-[#170d24] px-4 py-2 text-sm font-semibold outline-none"
             value={typeFilter}
             onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
           >
             <option value="ALL">Tất cả loại</option>
             <option value="AFFILIATE">Tiếp thị (Affiliate)</option>
             <option value="EMPLOYEE">Nhân viên (Employee)</option>
           </select>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {paginatedCommissions.length ? paginatedCommissions.map((commission) => {
          const user = Array.isArray(commission.users) ? commission.users[0] : commission.users;
          const affiliate = Array.isArray(commission.affiliates) ? commission.affiliates[0] : commission.affiliates;
          const order = Array.isArray(commission.orders) ? commission.orders[0] : commission.orders;
          return (
            <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.05] p-4 md:grid-cols-[1fr_150px_150px]" key={commission.id}>
              <div>
                {commission.user_id ? (
                  <Link href={`/dashboard/users/${commission.user_id}`} className="font-semibold transition-colors hover:text-pink-300 hover:underline">
                    {user?.name ?? "Không rõ"}
                  </Link>
                ) : (
                  <p className="font-semibold">{affiliate?.name ?? "Không rõ"}</p>
                )}
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

      {filteredCommissions.length > rowsPerPage && (
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
            Trang {currentPage} / {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition"
            type="button"
          >
            Tiếp
          </button>
        </div>
      )}
    </GlassCard>
  );
}
