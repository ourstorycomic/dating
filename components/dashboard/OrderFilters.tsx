"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

export function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      router.push(`?${createQueryString("query", e.target.value)}`);
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      router.push(`?${createQueryString("status", e.target.value)}`);
    });
  };

  const handleStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      let val = e.target.value;
      if (val) {
        val = new Date(val).toISOString();
      }
      router.push(`?${createQueryString("startDate", val)}`);
    });
  };

  const handleEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      let val = e.target.value;
      if (val) {
        // end of day
        const d = new Date(val);
        d.setHours(23, 59, 59, 999);
        val = d.toISOString();
      }
      router.push(`?${createQueryString("endDate", val)}`);
    });
  };

  const currentStartDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!).toISOString().split('T')[0] : "";
  const currentEndDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!).toISOString().split('T')[0] : "";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex-1">
        <input
          type="search"
          placeholder="Tìm mã đơn, tên hoặc sđt khách..."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/40 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400"
          defaultValue={searchParams.get("query")?.toString()}
          onChange={(e) => {
            const val = e.target.value;
            // Debounce simple
            setTimeout(() => handleSearch({ target: { value: val } } as any), 300);
          }}
        />
      </div>
      <div className="flex gap-2">
        <select
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400"
          value={searchParams.get("status")?.toString() || "ALL"}
          onChange={handleStatusChange}
        >
          <option value="ALL" className="bg-slate-800">Tất cả trạng thái</option>
          <option value="PENDING_PAYMENT" className="bg-slate-800">Chờ thanh toán</option>
          <option value="ACTIVE" className="bg-slate-800">Đã thanh toán (Active)</option>
          <option value="RESPONDED" className="bg-slate-800">Đã phản hồi</option>
        </select>
        
        <input
          type="date"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 [color-scheme:dark]"
          value={currentStartDate}
          onChange={handleStartDate}
          title="Từ ngày"
        />
        
        <input
          type="date"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 [color-scheme:dark]"
          value={currentEndDate}
          onChange={handleEndDate}
          title="Đến ngày"
        />
      </div>
    </div>
  );
}
