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
  creator?: { name: string | null; email: string | null } | { name: string | null; email: string | null }[] | null;
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
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const router = useRouter();

  const visibleLogs = useMemo(() => {
    return logs.filter((log) => {
      const order = log.orders;
      
      const keyword = query.trim().toLowerCase();
      if (keyword) {
        const textToSearch = `${log.action} ${log.users?.name ?? ""} ${log.users?.email ?? ""} ${order?.public_id ?? ""} ${order?.buyer_name ?? ""} ${order?.buyer_contact ?? ""} ${order?.recipient_name ?? ""} ${order?.templates?.name ?? ""}`.toLowerCase();
        if (!textToSearch.includes(keyword)) return false;
      }

      if (statusFilter && order?.status !== statusFilter) return false;

      if (dateFilter) {
        const logDate = log.created_at.split("T")[0];
        if (logDate !== dateFilter) return false;
      }

      return true;
    });
  }, [logs, query, statusFilter, dateFilter]);

  function toggleSelect(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  function toggleSelectAll() {
    if (visibleLogs.length === 0) return;
    if (selectedIds.size === visibleLogs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(visibleLogs.map((l) => l.id)));
    }
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
        <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <input
            className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm outline-none transition focus:border-pink-300/50"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm theo mã đơn, khách, nhân viên, template..."
            value={query}
          />
          <select 
            className="rounded-xl border border-white/10 bg-[#170d24] px-4 py-3 text-sm outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Thành công (ACTIVE)</option>
            <option value="PENDING_PAYMENT">Chờ thanh toán (PENDING)</option>
            <option value="COMPLETED">Đã mở quà (COMPLETED)</option>
          </select>
          <input
             type="date"
             className="rounded-xl border border-white/10 bg-[#170d24] px-4 py-3 text-sm outline-none [color-scheme:dark]"
             value={dateFilter}
             onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        {isAdmin && (
           <div className="mb-3 flex items-center gap-2 px-1">
             <input 
               type="checkbox" 
               className="h-4 w-4 accent-pink-500" 
               checked={visibleLogs.length > 0 && selectedIds.size === visibleLogs.length}
               onChange={toggleSelectAll}
             />
             <span className="text-sm font-semibold text-white/70">Chọn tất cả trang ({visibleLogs.length} dòng)</span>
           </div>
        )}

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
                      <p>Trạng thái đơn: <span className="font-semibold text-pink-300">{order?.status ?? "N/A"}</span></p>
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
    <div className="modal-overlay fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <div className="modal-panel max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-white/12 bg-[#15101d] text-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header sticky top-0 z-[60] flex items-start justify-between gap-4 border-b border-white/10 bg-[#15101d] p-5">
          <div>
            <h2 className="text-2xl font-semibold">Đơn {order?.public_id ?? "N/A"}</h2>
            <p className="mt-1 text-sm text-white/52">{log.action} - {time(log.created_at)}</p>
          </div>
          <button className="rounded-full bg-white/10 px-4 py-2 text-sm" onClick={onClose} type="button">Đóng</button>
        </div>

        <div className="grid items-start gap-5 p-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="grid content-start gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Người thao tác Log" value={`${log.users?.name ?? "Hệ thống"} ${log.users?.email ? `(${log.users.email})` : ""}`} />
              <Info label="Người tạo đơn (Nhân sự)" value={`${Array.isArray(order?.creator) ? order?.creator[0]?.name : (order?.creator?.name ?? "N/A")} ${Array.isArray(order?.creator) ? (order?.creator[0]?.email ? `(${order?.creator[0]?.email})` : "") : (order?.creator?.email ? `(${order?.creator?.email})` : "")}`} />
              <Info label="Khách mua" value={`${order?.buyer_name ?? "Chưa nhập"} ${order?.buyer_contact ? `(${order.buyer_contact})` : ""}`} />
              <Info label="Người nhận (hiển thị)" value={recipientName} />
              <Info label="Số tiền" value={money(order?.amount)} />
              <Info label="Trạng thái thanh toán" value={`${payment?.status ?? "Chưa có payment"} ${payment?.paid_at ? `(${time(payment.paid_at)})` : ""}`} />
              <Info label="Mã chuyển khoản" value={payment?.payment_code ?? "Chưa có"} />
              <Info label="Trạng thái đơn" value={order?.status ?? "N/A"} />
            </div>

            <details className="group rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold outline-none">
                Nội dung Form (Custom Data)
                <span className="text-white/40 transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="mt-4 grid gap-3">
                {SECTIONS.map((section) => {
                  const hasData = section.keys.some((k) => customData[k] !== undefined && customData[k] !== "");
                  if (!hasData) return null;

                  return (
                    <div key={section.title} className="mb-4 last:mb-0">
                      <h4 className="mb-2 text-sm font-semibold text-pink-200">{section.title}</h4>
                      <div className="grid gap-2 rounded-xl bg-black/20 p-3">
                        {section.keys.map((k) => {
                          const v = customData[k];
                          if (v === undefined || v === "") return null;

                          if (k === "memories" && Array.isArray(v)) {
                            return (
                              <div key={k} className="border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                <p className="mb-1 font-mono text-xs text-white/50">Tin nhắn các vì sao</p>
                                <div className="mt-1 grid gap-1">
                                  {v.map((m: any, i: number) => (
                                    <p key={i} className="whitespace-pre-wrap text-sm font-medium"><span className="text-white/40">{m.title || `Sao ${i + 1}`}:</span> {m.message}</p>
                                  ))}
                                </div>
                              </div>
                            );
                          }

                          const label = CUSTOM_DATA_LABELS[k] || k;

                          return (
                            <div key={k} className="border-b border-white/5 pb-2 last:border-0 last:pb-0">
                              <p className="mb-1 font-mono text-xs text-white/50">{label}</p>
                              {String(v).startsWith("http") ? (
                                <a href={String(v)} target="_blank" rel="noreferrer" className="break-all text-sm font-medium text-pink-300 hover:underline">
                                  {String(v)}
                                </a>
                              ) : (
                                <p className="whitespace-pre-wrap text-sm font-medium">{String(v)}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {Object.keys(customData).length === 0 && <p className="text-sm text-white/50">Không có dữ liệu form.</p>}
              </div>
            </details>
          </div>

          <div className="sticky top-[90px] h-fit rounded-2xl border border-white/10 bg-white/[0.05] p-4">
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

const SECTIONS = [
  {
    title: "Cấu hình chung",
    keys: ["generalAudioUrl", "stage3AudioUrl"],
  },
  {
    title: "Đoạn 1 - Ống kính",
    keys: ["introTitle", "introSubtitle", "connectInstruction", "stage1RevealTitle", "stage1RevealBody", "stage1RevealButton", "stage1Background", "stage1Accent", "stage1ImageUrl"],
  },
  {
    title: "Đoạn 2 - Quỹ đạo",
    keys: ["stage2Title", "stage2Subtitle", "stage2ImageCaption", "stage2Quote", "stage2NextButton", "stage2Background", "stage2Accent", "stage2ImageUrl"],
  },
  {
    title: "Đoạn 3 - Chòm sao",
    keys: ["stage3Title", "stage3Subtitle", "stage3MusicLabel", "stage3MediaUrl", "stage3NextButton", "stage3Background", "stage3Accent", "memories"],
  },
  {
    title: "Đoạn 4 - Bắt sao & Mic",
    keys: ["stage4Prompt", "stage4MicInstruction", "stage4FallbackButton", "stage4RevealTitle", "stage4RevealBody", "stage4RevealButton", "stage4Background", "stage4Accent", "stage4ImageUrl"],
  },
  {
    title: "Đoạn 5 - Hợp đồng & Quà",
    keys: ["contractTitle", "contractBody", "contractRejectButton", "contractHoldInstruction", "finalTitle", "finalSubtitle", "finalCta", "finalBackground", "finalAccent", "giftTitle", "giftBody", "proposedDate", "giftDeclineButton", "giftAcceptButton", "giftAcceptedTitle", "giftAcceptedBody", "giftDeclinedTitle", "giftDeclinedBody", "giftBackButton", "giftRescheduleButton"],
  }
];

const CUSTOM_DATA_LABELS: Record<string, string> = {
  generalAudioUrl: "Nhạc nền tổng",
  
  introTitle: "Tiêu đề mở màn",
  introSubtitle: "Mô tả mở màn",
  connectInstruction: "Hướng dẫn dò chòm sao",
  stage1Background: "Màu nền Đ1",
  stage1Accent: "Màu nhấn Đ1",
  stage1ImageUrl: "Ảnh/Video Đ1",
  stage1RevealTitle: "Tiêu đề sau khi bắt sao Đ1",
  stage1RevealBody: "Nội dung thư Đ1",
  stage1RevealButton: "Nút khôi phục Đ1",
  
  stage2Title: "Tiêu đề Đ2",
  stage2Subtitle: "Mô tả Đ2",
  stage2ImageCaption: "Caption ảnh Đ2",
  stage2Quote: "Câu quote Đ2",
  stage2NextButton: "Nút tiếp Đ2",
  stage2Background: "Màu nền Đ2",
  stage2Accent: "Màu nhấn Đ2",
  stage2ImageUrl: "Ảnh/Video Đ2",
  
  stage3Title: "Tiêu đề Đ3",
  stage3Subtitle: "Mô tả Đ3",
  stage3MusicLabel: "Dòng nhạc Đ3",
  stage3MediaUrl: "Ảnh/Video Đ3",
  stage3AudioUrl: "Nhạc/Ghi âm Đ3",
  stage3NextButton: "Nút tiếp Đ3",
  stage3Background: "Màu nền Đ3",
  stage3Accent: "Màu nhấn Đ3",

  stage4Prompt: "Hướng dẫn bắt sao Đ4",
  stage4MicInstruction: "Hướng dẫn micro Đ4",
  stage4FallbackButton: "Nút dự phòng mic lỗi Đ4",
  stage4RevealTitle: "Tiêu đề sau khi thổi mic Đ4",
  stage4RevealBody: "Nội dung thư Đ4",
  stage4RevealButton: "Nút nhận Đ4",
  stage4Background: "Màu nền Đ4",
  stage4Accent: "Màu nhấn Đ4",
  stage4ImageUrl: "Ảnh/Video Đ4",

  contractTitle: "Tiêu đề hợp đồng",
  contractBody: "Nội dung hợp đồng",
  contractRejectButton: "Nút né hợp đồng",
  contractHoldInstruction: "Hướng dẫn giữ vân tay",
  
  finalTitle: "Tiêu đề cuối",
  finalSubtitle: "Mô tả cuối",
  finalCta: "Nút nhận quà",
  finalBackground: "Màu nền đoạn cuối",
  finalAccent: "Màu nhấn đoạn cuối",
  
  giftTitle: "Tiêu đề thư mời",
  giftBody: "Nội dung thư mời",
  proposedDate: "Ngày giờ đề xuất",
  giftDeclineButton: "Nút từ chối",
  giftAcceptButton: "Nút đồng ý",
  giftAcceptedTitle: "Tiêu đề khi đồng ý",
  giftAcceptedBody: "Nội dung khi đồng ý",
  giftDeclinedTitle: "Tiêu đề hẹn ngày khác",
  giftDeclinedBody: "Nội dung hẹn ngày khác",
  giftBackButton: "Nút quay lại",
  giftRescheduleButton: "Nút gửi lịch hẹn",
};
