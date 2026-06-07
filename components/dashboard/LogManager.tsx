"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { InteractiveTemplatePreview } from "@/components/templates/InteractiveTemplatePreview";
import { GlassCard } from "@/components/ui/GlassCard";

type Payment = {
  amount: number;
  paid_at: string | null;
  payment_code: string;
  qr_code_url: string | null;
  status: string;
};

type Order = {
  amount: number;
  buyer_contact: string | null;
  buyer_name: string | null;
  created_at: string;
  custom_data: Record<string, unknown>;
  payments: Payment | Payment[] | null;
  public_id: string;
  recipient_name: string | null;
  status: string;
  templates: { component_key: string; name: string; visual_label?: string | null } | null;
};

type LogRow = {
  action: string;
  created_at: string;
  id: string;
  metadata: Record<string, unknown>;
  orders: Order | null;
  users: { email: string | null; name: string | null } | null;
};

function money(value: unknown) {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
}

function time(value: string | null | undefined) {
  if (!value) return "Chưa có";
  return new Date(value).toLocaleString("vi-VN");
}

function getPayment(order: Order | null) {
  if (!order?.payments) return null;
  return Array.isArray(order.payments) ? order.payments[0] ?? null : order.payments;
}

function textFrom(data: Record<string, unknown>, key: string, fallback = "") {
  const value = data[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function LogManager({ initialLogs, isAdmin }: { initialLogs: LogRow[]; isAdmin: boolean }) {
  const [logs, setLogs] = useState(initialLogs);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openedLog, setOpenedLog] = useState<LogRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const visibleLogs = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return logs;
    return logs.filter((log) => {
      const order = log.orders;
      return `${log.action} ${log.users?.name ?? ""} ${log.users?.email ?? ""} ${order?.public_id ?? ""} ${order?.buyer_name ?? ""} ${order?.buyer_contact ?? ""} ${order?.recipient_name ?? ""} ${order?.templates?.name ?? ""}`
        .toLowerCase()
        .includes(keyword);
    });
  }, [logs, query]);

  function toggleSelect(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  async function deleteSelected() {
    if (!isAdmin || selectedIds.size === 0) return;
    if (!confirm("Xóa nhật ký đã chọn khỏi database?")) return;

    setIsDeleting(true);
    const response = await fetch("/api/logs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selectedIds) }),
    });
    setIsDeleting(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.error(data.error ?? "Không xóa được nhật ký.");
      return;
    }

    setLogs((current) => current.filter((log) => !selectedIds.has(log.id)));
    setSelectedIds(new Set());
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <header className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <h1 className="text-3xl font-semibold sm:text-4xl">Nhật ký đơn</h1>
          {isAdmin ? (
            <button
              className="rounded-full border border-rose-300/20 bg-rose-400/10 px-5 py-3 text-sm font-semibold text-rose-100 disabled:opacity-50"
              disabled={selectedIds.size === 0 || isDeleting}
              onClick={deleteSelected}
              type="button"
            >
              {isDeleting ? "Đang xóa..." : "Xóa nhật ký đã chọn"}
            </button>
          ) : null}
        </div>
      </header>

      <GlassCard hover={false}>
        <input
          className="mb-4 w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm outline-none transition focus:border-pink-300/50"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tìm theo mã đơn, khách, người nhận, nhân viên hoặc template..."
          value={query}
        />
        <div className="grid gap-3">
          {visibleLogs.length ? visibleLogs.map((log) => {
            const order = log.orders;
            const payment = getPayment(order);
            return (
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4" key={log.id}>
                <div className="grid gap-3 lg:grid-cols-[28px_1fr_150px]">
                  <div>
                    {isAdmin ? (
                      <input
                        checked={selectedIds.has(log.id)}
                        className="mt-1 h-4 w-4 accent-pink-500"
                        onChange={() => toggleSelect(log.id)}
                        type="checkbox"
                      />
                    ) : null}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-pink-500/15 px-3 py-1 text-xs font-semibold text-pink-100">{log.action}</span>
                      <span className="text-xs text-white/46">{time(log.created_at)}</span>
                    </div>
                    <p className="font-semibold">
                      {log.users?.name ?? "Hệ thống"} tạo/cập nhật đơn {order?.public_id ?? "N/A"}
                    </p>
                    <div className="grid gap-1 text-sm text-white/68 md:grid-cols-2">
                      <p>Khách: <b>{order?.buyer_name || "Chưa nhập"}</b> {order?.buyer_contact ? `(${order.buyer_contact})` : ""}</p>
                      <p>Người nhận: <b>{order?.recipient_name || "Chưa nhập"}</b></p>
                      <p>Số tiền: <b>{money(order?.amount)}</b></p>
                      <p>Thanh toán: <b>{payment?.status ?? "Chưa có payment"}</b> {payment?.paid_at ? `- ${time(payment.paid_at)}` : ""}</p>
                      <p>Template: <b>{order?.templates?.name ?? "N/A"}</b></p>
                      <p>Trạng thái đơn: <b>{order?.status ?? "N/A"}</b></p>
                    </div>
                  </div>
                  <button
                    className="h-fit rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm font-semibold"
                    onClick={() => setOpenedLog(log)}
                    type="button"
                  >
                    Xem đơn
                  </button>
                </div>
              </div>
            );
          }) : (
            <p className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-white/58">Chưa có nhật ký.</p>
          )}
        </div>
      </GlassCard>

      {openedLog ? (
        <OrderDetailModal log={openedLog} onClose={() => setOpenedLog(null)} />
      ) : null}
    </div>
  );
}

function OrderDetailModal({ log, onClose }: { log: LogRow; onClose: () => void }) {
  const order = log.orders;
  const payment = getPayment(order);
  const customData = order?.custom_data ?? {};
  const componentKey = order?.templates?.component_key ?? textFrom(customData, "componentKey", "valentine-1");
  const senderName = textFrom(customData, "senderName", "Anh");
  const recipientName = textFrom(customData, "recipientName", order?.recipient_name ?? "Em");

  return (
    <div className="modal-overlay fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onMouseDown={onClose}>
      <div className="modal-panel max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-white/12 bg-[#15101d] text-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <h2 className="text-2xl font-semibold">Đơn {order?.public_id ?? "N/A"}</h2>
            <p className="mt-1 text-sm text-white/52">{log.action} - {time(log.created_at)}</p>
          </div>
          <button className="rounded-full bg-white/10 px-4 py-2 text-sm" onClick={onClose} type="button">Đóng</button>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Người thao tác" value={`${log.users?.name ?? "Hệ thống"} ${log.users?.email ? `(${log.users.email})` : ""}`} />
              <Info label="Khách mua" value={`${order?.buyer_name ?? "Chưa nhập"} ${order?.buyer_contact ? `(${order.buyer_contact})` : ""}`} />
              <Info label="Người gửi" value={senderName} />
              <Info label="Người nhận" value={recipientName} />
              <Info label="Số tiền" value={money(order?.amount)} />
              <Info label="Thanh toán" value={payment?.status ?? "Chưa có payment"} />
              <Info label="Mã chuyển khoản" value={payment?.payment_code ?? "Chưa có"} />
              <Info label="Trạng thái đơn" value={order?.status ?? "N/A"} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold">Live preview</h3>
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-white/62">
                {order?.templates?.name ?? "Template"}
              </span>
            </div>
            <div className="mx-auto max-w-[430px]">
              <InteractiveTemplatePreview
                componentKey={componentKey}
                customData={customData}
                recipientName={recipientName}
                senderName={senderName}
                visualLabel={order?.templates?.visual_label}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
      <p className="text-xs text-white/46">{label}</p>
      <p className="mt-2 break-words font-semibold">{value}</p>
    </div>
  );
}
