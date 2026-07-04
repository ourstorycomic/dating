"use client";

import { useMemo, useState, useEffect } from "react";
import { isPast } from "date-fns";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
  expires_at?: string | null;
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

export function LogManager({ initialLogs, totalCount, isAdmin, initialPage = 1, initialQuery = "", initialStatus = "", initialDate = "" }: { initialLogs: LogRow[]; totalCount: number; isAdmin: boolean; initialPage?: number; initialQuery?: string; initialStatus?: string; initialDate?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentQuery = searchParams.get("query") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentDate = searchParams.get("date") || "";

  const [logs, setLogs] = useState(initialLogs);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openedLog, setOpenedLog] = useState<LogRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [query, setQuery] = useState(currentQuery);
  const [statusFilter, setStatusFilter] = useState(currentStatus);
  const [dateFilter, setDateFilter] = useState(currentDate);
  const logsPerPage = 10;

  useEffect(() => {
    setLogs(initialLogs);
    setQuery(currentQuery);
    setStatusFilter(currentStatus);
    setDateFilter(currentDate);
  }, [initialLogs, currentQuery, currentStatus, currentDate]);

  function applyFilters(page: number, q: string, s: string, d: string) {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (q) params.set("query", q);
    if (s) params.set("status", s);
    if (d) params.set("date", d);
    router.push(`${pathname}?${params.toString()}`);
  }

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query !== currentQuery) {
        applyFilters(1, query, statusFilter, dateFilter);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (openedLog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openedLog]);

  const visibleLogs = logs;

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
              className="rounded-full border border-rose-200 bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-600 disabled:opacity-50"
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
            onChange={(e) => {
              setStatusFilter(e.target.value);
              applyFilters(1, query, e.target.value, dateFilter);
            }}
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
             onChange={(e) => {
               setDateFilter(e.target.value);
               applyFilters(1, query, statusFilter, e.target.value);
             }}
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
        
        {totalCount > logsPerPage && (
          <div className="mt-5 flex items-center justify-center gap-3 border-t border-white/5 pt-4">
            <button 
              onClick={() => applyFilters(Math.max(1, currentPage - 1), query, statusFilter, dateFilter)}
              disabled={currentPage <= 1}
              className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition"
              type="button"
            >
              Trước
            </button>
            <span className="text-xs text-white/60 font-medium">
              Trang {currentPage} / {Math.ceil(totalCount / logsPerPage)}
            </span>
            <button 
              onClick={() => applyFilters(currentPage + 1, query, statusFilter, dateFilter)}
              disabled={currentPage >= Math.ceil(totalCount / logsPerPage)}
              className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition"
              type="button"
            >
              Tiếp
            </button>
          </div>
        )}
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
  const isExpired = order?.expires_at ? isPast(new Date(order.expires_at)) : false;
  const senderName = textFrom(customData, "senderName", "Anh");
  const recipientName = textFrom(customData, "recipientName", order?.recipient_name ?? "Em");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="flex flex-col max-h-[92vh] w-[1400px] max-w-[95vw] overflow-hidden rounded-3xl border border-pink-200 bg-pink-50 text-pink-950 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="shrink-0 flex items-center justify-between gap-4 border-b border-pink-200 bg-pink-50 p-5">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-lg md:text-xl font-semibold text-pink-900 truncate">
              Đơn {order?.public_id ?? "N/A"}
              <span className="ml-2 font-normal text-pink-600 text-sm md:text-base hidden sm:inline">
                - {log.action} - {time(log.created_at)}
              </span>
            </h2>
          </div>
          <button className="shrink-0 rounded-full bg-pink-100 px-4 py-2 text-sm font-medium text-pink-700 hover:bg-pink-200 transition" onClick={onClose} type="button">Đóng</button>
        </div>

        <div className="flex-1 min-h-0 grid gap-5 p-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="h-full overflow-y-auto pr-2 grid content-start gap-4">
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

            {isExpired ? (
              <div className="group rounded-2xl border border-pink-200 bg-white/60 p-8 text-center shadow-sm">
                <span className="text-3xl mb-3 block">🗑️</span>
                <p className="text-base font-semibold text-pink-700">Dữ liệu đơn đã bị xóa do hết hạn.</p>
                <p className="text-sm text-pink-600/70 mt-1">Chỉ còn thông tin cơ bản được lưu trữ.</p>
              </div>
            ) : (
            <details className="group rounded-2xl border border-pink-200 bg-white/60 p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold text-pink-900 outline-none">
                Nội dung Form (Custom Data)
                <span className="text-pink-400 transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="mt-4 grid gap-3">
                {SECTIONS.map((section) => {
                  const hasData = section.keys.some((k) => customData[k] !== undefined && customData[k] !== "");
                  if (!hasData) return null;

                  return (
                    <div key={section.title} className="mb-4 last:mb-0">
                      <h4 className="mb-2 text-sm font-semibold text-pink-700">{section.title}</h4>
                      <div className="grid gap-2 rounded-xl bg-pink-100/50 p-3">
                        {section.keys.map((k) => {
                          const v = customData[k];
                          if (v === undefined || v === "") return null;

                          if (k === "memories" && Array.isArray(v)) {
                            return (
                              <div key={k} className="border-b border-pink-200/50 pb-2 last:border-0 last:pb-0">
                                <p className="mb-1 font-mono text-xs font-medium text-pink-500">Tin nhắn các vì sao</p>
                                <div className="mt-1 grid gap-1">
                                  {v.map((m: any, i: number) => (
                                    <p key={i} className="whitespace-pre-wrap text-sm font-medium text-pink-950"><span className="text-pink-400">{m.title || `Sao ${i + 1}`}:</span> {m.message}</p>
                                  ))}
                                </div>
                              </div>
                            );
                          }

                          const label = CUSTOM_DATA_LABELS[k] || k;

                          return (
                            <div key={k} className="border-b border-pink-200/50 pb-2 last:border-0 last:pb-0">
                              <p className="mb-1 font-mono text-xs font-medium text-pink-500">{label}</p>
                              {String(v).startsWith("http") ? (
                                <a href={String(v)} target="_blank" rel="noreferrer" className="break-all text-sm font-medium text-pink-600 hover:underline">
                                  {String(v)}
                                </a>
                              ) : (
                                <p className="whitespace-pre-wrap text-sm font-medium text-pink-950">{String(v)}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {Object.keys(customData).length === 0 && <p className="text-sm font-medium text-pink-500">Không có dữ liệu form.</p>}
              </div>
            </details>
            )}
          </div>

          <div className="h-full flex flex-col rounded-2xl border border-pink-200 bg-white/60 p-4 overflow-y-auto relative">
            {isExpired ? (
              <div className="flex h-full flex-col items-center justify-center text-center p-8 bg-white/80 rounded-xl border border-pink-100">
                <span className="text-4xl mb-4">⌛</span>
                <p className="text-lg font-bold text-pink-800">Đơn đã hết hạn</p>
                <p className="text-sm text-pink-600/80 mt-2">Bản xem trước không khả dụng.</p>
              </div>
            ) : (
            <>
            <div className="mb-4 shrink-0 flex items-center justify-between gap-3 bg-white p-3 rounded-xl z-30 shadow-sm border border-pink-100 relative">
              <h3 className="text-xl font-semibold text-pink-900 ml-2">Live preview</h3>
              <span className="rounded-full border border-pink-200 bg-pink-100/50 px-3 py-1 text-xs font-medium text-pink-700">
                {order?.templates?.name ?? "Template"}
              </span>
            </div>
            <div className="flex-1 min-h-0 flex items-start justify-center w-full pt-4 pb-12">
              <div className="relative flex flex-col items-center justify-center shrink-0 w-[380px] h-[780px]">
                <div 
                  className="w-full h-full rounded-[3.5rem] shadow-2xl border-[16px] border-[#150a21] bg-[#05020a] overflow-hidden ring-4 ring-pink-100/50 flex flex-col relative z-20"
                  style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)', isolation: 'isolate' }}
                >
                  <InteractiveTemplatePreview
                    componentKey={componentKey}
                    customData={customData}
                    recipientName={recipientName}
                    senderName={senderName}
                    visualLabel={order?.templates?.visual_label}
                    compact={true}
                    isBuilderPreview={true}
                    noFrame={true}
                  />
                </div>
              </div>
            </div>
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white/60 p-4">
      <p className="text-xs font-medium text-pink-600">{label}</p>
      <p className="mt-2 break-words font-semibold text-pink-950">{value}</p>
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
  },
  {
    title: "Mẫu hẹn hò (Will You Date Me)",
    keys: ["questionTitle", "questionBody", "yesButton", "noButton", "successTitle", "successMessage", "locationTitle", "datetimeTitle", "foodTitle", "drinkTitle", "backgroundImage", "backgroundColor", "accentColor"],
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

  questionTitle: "Tiêu đề câu hỏi chính",
  questionBody: "Nội dung câu hỏi chính",
  yesButton: "Nút Đồng Ý",
  noButton: "Nút Từ Chối",
  successTitle: "Tiêu đề khi đồng ý",
  successMessage: "Lời nhắn khi đồng ý",
  locationTitle: "Câu hỏi chọn địa điểm",
  datetimeTitle: "Câu hỏi chọn thời gian",
  foodTitle: "Câu hỏi chọn món ăn",
  drinkTitle: "Câu hỏi chọn đồ uống",
  backgroundImage: "Ảnh nền tổng thể",
  backgroundColor: "Màu nền",
  accentColor: "Màu nhấn",
};
