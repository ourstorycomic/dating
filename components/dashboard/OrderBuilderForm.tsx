"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { TemplateCatalogItem } from "@/lib/supabase/server";
import { InteractiveTemplatePreview } from "@/components/templates/InteractiveTemplatePreview";

type MyOrderRow = {
  amount: number;
  buyer_contact: string | null;
  buyer_name: string | null;
  created_at: string;
  id: string;
  payments:
    | { paid_at: string | null; payment_code: string; status: string }
    | Array<{ paid_at: string | null; payment_code: string; status: string }>
    | null;
  public_id: string;
  recipient_name: string | null;
  status: string;
  templates: { name: string } | { name: string }[] | null;
};

function absoluteUrl(path: string) {
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
}

function mediaPreview(file?: File | null) {
  return file ? URL.createObjectURL(file) : "";
}

function money(value: number) {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
}

function getRelationOne<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

async function copyQrImage(url: string, onCopied?: (message: string) => void) {
  try {
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();
    const pngBlob = blob.type === "image/png" ? blob : new Blob([blob], { type: "image/png" });
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": pngBlob,
      }),
    ]);
    onCopied?.("Đã copy ảnh QR.");
  } catch {
    await copyText(url);
    onCopied?.("Đã copy link QR.");
  }
}

function downloadImage(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.click();
}

function TextInput({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-white/64">{label}</span>
      <input
        className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none focus:border-pink-300/50"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function DateInput({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-white/64">{label}</span>
      <input
        type="datetime-local"
        className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none focus:border-pink-300/50 [color-scheme:dark]"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function TextArea({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm md:col-span-2">
      <span className="text-white/64">{label}</span>
      <textarea
        className="min-h-24 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none focus:border-pink-300/50"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function ColorInput({
  label,
  onCommit,
  value,
}: {
  label: string;
  onCommit: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-white/64">{label}</span>
      <input
        className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.07] p-1"
        defaultValue={value}
        onBlur={(event) => onCommit(event.target.value)}
        type="color"
      />
      <span className="text-[11px] text-white/38">Chọn xong màu rồi thả chuột để áp dụng.</span>
    </label>
  );
}

function MediaInput({
  label,
  onChange,
}: {
  label: string;
  onChange: (url: string, type: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm md:col-span-2">
      <span className="text-white/64">{label}</span>
      <input
        accept="image/*,video/*"
        className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none"
        onChange={(event) => {
          const file = event.target.files?.[0];
          onChange(mediaPreview(file), file?.type ?? "");
        }}
        type="file"
      />
    </label>
  );
}

function Section({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="glass-panel rounded-2xl p-5">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

export function OrderBuilderForm({ currentRole, myOrders, templates }: { currentRole: "ADMIN" | "STAFF" | "EMPLOYEE"; myOrders: MyOrderRow[]; templates: TemplateCatalogItem[] }) {
  const valentineOne = templates.find((template) => template.component_key.includes("constellation")) ?? templates[0];
  const [selectedTemplateId, setSelectedTemplateId] = useState(valentineOne?.id ?? "");
  const [templateSearch, setTemplateSearch] = useState(valentineOne?.name ?? "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [buyerName, setBuyerName] = useState("");
  const [buyerContact, setBuyerContact] = useState("");
  const [senderName, setSenderName] = useState("Anh");
  const [recipientName, setRecipientName] = useState("Em");
  const [anniversaryCode, setAnniversaryCode] = useState("1402");
  const [question, setQuestion] = useState("Em có đồng ý cùng anh viết tiếp câu chuyện này không?");
  const [generalAudioUrl, setGeneralAudioUrl] = useState("");

  const [stage1Instruction, setStage1Instruction] = useState("Nối các ngôi sao");
  const [stage1Background, setStage1Background] = useState("#05020a");
  const [stage1Accent, setStage1Accent] = useState("#ec4899");
  const [stage1ImageUrl, setStage1ImageUrl] = useState("");
  const [stage1MediaType, setStage1MediaType] = useState("");
  const [stage1RevealTitle, setStage1RevealTitle] = useState("Vì Sao Của Riêng Tớ");
  const [stage1RevealBody, setStage1RevealBody] = useState("Trạm không gian vừa bắt được một dải sáng tuyệt đẹp. Vũ trụ bao la, nhưng radar chỉ hướng về một người duy nhất thôi!");
  const [stage1RevealButton, setStage1RevealButton] = useState("Khôi phục từ trường");

  const [stage2Title, setStage2Title] = useState("Quỹ Đạo Hỗn Loạn");
  const [stage2Subtitle, setStage2Subtitle] = useState("Từ trường đang nhiễu loạn. Hãy kéo các vì sao về đúng quỹ đạo.");
  const [stage2ImageCaption, setStage2ImageCaption] = useState("Our Orbit");
  const [stage2Quote, setStage2Quote] = useState("\"Dỗi thì dỗi nhưng vẫn phải về đúng quỹ đạo của nhau thôi. Cảm ơn vì đã luôn nhường nhịn cái sự bướng bỉnh của tớ.\"");
  const [stage2NextButton, setStage2NextButton] = useState("Tiếp tục hành trình");
  const [stage2Background, setStage2Background] = useState("#05020a");
  const [stage2Accent, setStage2Accent] = useState("#60a5fa");
  const [stage2ImageUrl, setStage2ImageUrl] = useState("");
  const [stage2MediaType, setStage2MediaType] = useState("");

  const [stage3Title, setStage3Title] = useState("Chòm Sao Thanh Âm");
  const [stage3Subtitle, setStage3Subtitle] = useState("Chạm và kéo một đường qua 5 điểm sáng không nhấc tay.");
  const [stage3MusicLabel, setStage3MusicLabel] = useState("♪ Lofi Piano đang phát");
  const [stage3MediaUrl, setStage3MediaUrl] = useState("");
  const [stage3MediaType, setStage3MediaType] = useState("");
  const [stage3AudioUrl, setStage3AudioUrl] = useState("");
  const [stage3NextButton, setStage3NextButton] = useState("Tiếp tục hành trình");
  const [stage3Message1, setStage3Message1] = useState("Cậu biết không...");
  const [stage3Message2, setStage3Message2] = useState("Dù vũ trụ này có hàng tỷ vì sao...");
  const [stage3Message3, setStage3Message3] = useState("Nhưng trong mắt tớ...");
  const [stage3Message4, setStage3Message4] = useState("Cậu là vì sao sáng nhất và duy nhất.");
  const [stage3Background, setStage3Background] = useState("#05020a");
  const [stage3Accent, setStage3Accent] = useState("#f472b6");

  const [stage4Title, setStage4Title] = useState("Thời gian hẹn");
  const [stage5Title, setStage5Title] = useState("Món ăn yêu thích");

  const [stage4Prompt, setStage4Prompt] = useState("Nhanh tay bắt lấy một vì sao ước nguyện!");
  const [stage4MicInstruction, setStage4MicInstruction] = useState("Và thổi vào Microphone để bay lớp bụi trần...");
  const [stage4FallbackButton, setStage4FallbackButton] = useState("Bấm vào đây nếu Mic lỗi");
  const [stage4RevealTitle, setStage4RevealTitle] = useState("Hãy nhắm mắt, ước một điều");
  const [stage4RevealBody, setStage4RevealBody] = useState("\"Từ khoảnh khắc va chạm đầu tiên, đến những lúc dỗi hờn, chúng ta đã cùng nhau tạo nên một vũ trụ tuyệt đẹp. Tớ mong ngôi sao này sẽ mang đến cho cậu sự bình yên.\"");
  const [stage4RevealButton, setStage4RevealButton] = useState("Đón nhận");
  const [stage4Background, setStage4Background] = useState("#05020a");
  const [stage4Accent, setStage4Accent] = useState("#f472b6");
  const [stage4ImageUrl, setStage4ImageUrl] = useState("");
  const [stage4MediaType, setStage4MediaType] = useState("");

  const [finalTitle, setFinalTitle] = useState("Happy Valentine's Day!");
  const [finalSubtitle, setFinalSubtitle] = useState("Cảm ơn vì đã là ngoại lệ tuyệt vời nhất của nhau.");
  const [finalCta, setFinalCta] = useState("Nhận Quà Đi Chơi");
  const [finalBackground, setFinalBackground] = useState("#fb7185");
  const [finalAccent, setFinalAccent] = useState("#ec4899");
  const [giftTitle, setGiftTitle] = useState("Thư Mời Hẹn Hò");
  const [giftBody, setGiftBody] = useState("Cuối tuần này, cùng nhau đi dạo phố và uống chút gì đó ấm áp nhé? Tớ biết một quán view rất xinh!");
  const [proposedDate, setProposedDate] = useState("");
  const [giftDeclineButton, setGiftDeclineButton] = useState("Để khi khác");
  const [giftAcceptButton, setGiftAcceptButton] = useState("Lên đồ thôi!");
  const [giftAcceptedTitle, setGiftAcceptedTitle] = useState("Chốt đơn!");
  const [giftAcceptedBody, setGiftAcceptedBody] = useState("Lịch hẹn đã được lưu lại thành công. Hẹn gặp cậu vào ngày hôm đó nhé!");
  const [giftDeclinedTitle, setGiftDeclinedTitle] = useState("Vậy hẹn ngày khác nha!");
  const [giftDeclinedBody, setGiftDeclinedBody] = useState("Chọn một ngày cậu rảnh để chúng mình set kèo lại nhé!");
  const [giftBackButton, setGiftBackButton] = useState("Quay lại");
  const [giftRescheduleButton, setGiftRescheduleButton] = useState("Gửi lịch hẹn");
  const [contractTitle, setContractTitle] = useState("Bản Hợp Đồng");
  const [contractBody, setContractBody] = useState("\"Thời hạn dùng thử trái tim tớ đã hết. Cậu có muốn gia hạn gói Premium (yêu thương trọn đời) không?\"");
  const [contractRejectButton, setContractRejectButton] = useState("Xem xét lại");
  const [contractHoldInstruction, setContractHoldInstruction] = useState("Giữ vân tay 3 giây");

  const [result, setResult] = useState<{ amount: number; giftLink: string; orderId: string; paymentCode: string; paymentStatus: string; qrCodeUrl: string | null; status: string; trackLink: string; unlocked: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingEdits, setIsSavingEdits] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) ?? valentineOne,
    [selectedTemplateId, templates, valentineOne],
  );
  const filteredTemplates = useMemo(() => {
    const keyword = templateSearch.trim().toLowerCase();
    return keyword
      ? templates.filter((template) => `${template.name} ${template.tagline ?? ""} ${template.description ?? ""}`.toLowerCase().includes(keyword))
      : templates;
  }, [templateSearch, templates]);
  const selectedComponentKey = useMemo(() => {
    const rawKey = selectedTemplate?.component_key ?? "";
    const templateName = selectedTemplate?.name?.toLowerCase() ?? "";

    if (rawKey.includes("will-you-date-me") || templateName.includes("date me")) {
      return "will-you-date-me";
    }

    if (
      templateName.includes("valentine #1") ||
      rawKey.includes("constellation") ||
      rawKey.includes("starry") ||
      rawKey.includes("password") ||
      rawKey.includes("timeline")
    ) {
      return "val-starry-constellation-01";
    }

    return rawKey || "val-starry-constellation-01";
  }, [selectedTemplate]);

  const isWillYouDateMe = selectedComponentKey === "will-you-date-me";

  const canEditTemplate = result?.unlocked ?? false;

  useEffect(() => {
    if (!result || result.unlocked) return;

    const timer = window.setInterval(async () => {
      const response = await fetch(`/api/orders/${result.orderId}/payment`, { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      const payment = Array.isArray(data.payment) ? data.payment[0] : data.payment;
      const unlocked = Boolean(data.unlocked);

      setResult((current) => current ? {
        ...current,
        paymentStatus: payment?.status ?? current.paymentStatus,
        qrCodeUrl: payment?.qr_code_url ?? current.qrCodeUrl,
        status: data.status ?? current.status,
        unlocked,
      } : current);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [result]);

  const customData = {
    anniversaryCode,
    componentKey: selectedComponentKey,
    connectInstruction: stage1Instruction,
    contractBody,
    contractHoldInstruction,
    contractRejectButton,
    contractTitle,
    finalAccent,
    finalBackground,
    finalCta,
    finalSubtitle,
    finalTitle,
    giftAcceptButton,
    giftAcceptedBody,
    giftAcceptedTitle,
    giftBackButton,
    giftBody,
    proposedDate,
    giftDeclineButton,
    giftDeclinedBody,
    giftDeclinedTitle,
    giftRescheduleButton,
    giftTitle,
    introSubtitle: "",
    introTitle: "",
    question,
    recipientName,
    senderName,
    stage1Accent,
    stage1Background,
    stage1ImageUrl,
    stage1MediaType,
    stage1RevealBody,
    stage1RevealButton,
    stage1RevealTitle,
    stage2Accent,
    stage2Background,
    stage2ImageCaption,
    stage2ImageUrl,
    stage2MediaType,
    stage2NextButton,
    stage2Quote,
    stage2Subtitle,
    stage2Title,
    stage3Accent,
    stage3Background,
    stage3MusicLabel,
    stage3MediaType,
    stage3MediaUrl,
    stage3AudioUrl,
    generalAudioUrl,
    stage3NextButton,
    stage3Subtitle,
    stage3Title,
    stage4Accent,
    stage4Background,
    stage4FallbackButton,
    stage4ImageUrl,
    stage4MediaType,
    stage4MicInstruction,
    stage4Prompt,
    stage4RevealBody,
    stage4RevealButton,
    stage4RevealTitle,
    memories: [
      { message: stage3Message1, title: "Tin nhắn 1" },
      { message: stage3Message2, title: "Tin nhắn 2" },
      { message: stage3Message3, title: "Tin nhắn 3" },
      { message: stage3Message4, title: "Tin nhắn 4" },
    ],
    ...(isWillYouDateMe ? {
      questionTitle: stage1Instruction,
      questionBody: question,
      yesButton: giftAcceptButton,
      noButton: giftDeclineButton,
      successTitle: stage2Title,
      successMessage: stage2Subtitle,
      locationTitle: stage3Title,
      datetimeTitle: stage4Title,
      foodTitle: stage5Title,
      drinkTitle: giftTitle,
      finalTitle: finalTitle,
      finalMessage: finalSubtitle,
      generalAudioUrl: generalAudioUrl,
      backgroundImage: stage1Background,
      backgroundColor: stage2Background,
      accentColor: stage1Accent,
    } : {})
  };

  async function createOrder() {
    setIsSubmitting(true);
    setError("");
    setResult(null);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: selectedTemplate?.base_price ?? 459000,
        buyerContact,
        buyerName,
        customData,
        recipientName,
        templateId: selectedTemplate?.id,
      }),
    });

    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.error ?? "Không tạo được link. Kiểm tra đăng nhập và dữ liệu.");
      return;
    }

    setResult({
      amount: Number(data.amount ?? selectedTemplate?.base_price ?? 0),
      giftLink: absoluteUrl(data.giftPath),
      orderId: data.orderId,
      paymentCode: data.paymentCode,
      paymentStatus: data.paymentStatus ?? "PENDING",
      qrCodeUrl: data.qrCodeUrl ?? null,
      status: data.status ?? "PENDING_PAYMENT",
      trackLink: absoluteUrl(data.trackPath),
      unlocked: Boolean(data.unlocked),
    });
  }

  function showCopyMessage(message: string) {
    setCopyMessage(message);
    window.setTimeout(() => setCopyMessage(""), 1800);
  }

  async function saveOrderEdits() {
    if (!result?.unlocked) return;

    setIsSavingEdits(true);
    setSaveMessage("");
    setError("");

    const response = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customData,
        orderId: result.orderId,
        recipientName,
      }),
    });
    const data = await response.json().catch(() => ({}));
    setIsSavingEdits(false);

    if (!response.ok) {
      setError(data.error ?? "Không lưu được chỉnh sửa.");
      return;
    }

    setSaveMessage("Đã lưu chỉnh sửa template cho đơn này.");
  }

  async function confirmPaymentManually() {
    if (!result || currentRole !== "ADMIN") return;

    setIsConfirmingPayment(true);
    setError("");

    const response = await fetch(`/api/orders/${result.orderId}/confirm-payment`, {
      method: "POST",
    });
    const data = await response.json().catch(() => ({}));
    setIsConfirmingPayment(false);

    if (!response.ok) {
      setError(data.error ?? "Không xác nhận được thanh toán.");
      return;
    }

    setResult((current) => current ? {
      ...current,
      paymentStatus: "PAID",
      status: "ACTIVE",
      unlocked: true,
    } : current);
  }

  const showSetupWorkspace = !result || result.unlocked;

  return (
    <div className={showSetupWorkspace ? "grid items-start gap-6 xl:grid-cols-[1fr_460px]" : "grid items-start gap-6"}>
      <div className="grid content-start gap-5">
        <Section title="Thông tin đơn">
          <TextInput label="Tên khách mua" onChange={setBuyerName} value={buyerName} />
          <TextInput label="TikTok / SĐT khách" onChange={setBuyerContact} value={buyerContact} />
          <div className="relative grid gap-2 text-sm md:col-span-2" ref={dropdownRef}>
            <span className="text-white/64">Mẫu giao diện</span>
            <input
              className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none transition focus:border-pink-300/50"
              onChange={(event) => {
                setTemplateSearch(event.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => {
                setIsDropdownOpen(true);
                // Nếu click vào mà tên template đang khớp, bôi đen để tiện gõ đè (search)
                if (templateSearch === templates.find(t => t.id === selectedTemplateId)?.name) {
                  setTemplateSearch("");
                }
              }}
              placeholder="Tìm nhanh theo tên mẫu, dịp hoặc mô tả..."
              value={templateSearch}
            />
            {isDropdownOpen && (
              <ul className="absolute left-0 top-[76px] z-50 max-h-60 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#170d24] p-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                {filteredTemplates.length === 0 ? (
                  <li className="px-4 py-3 text-white/50">Không tìm thấy mẫu nào phù hợp.</li>
                ) : (
                  filteredTemplates.map((template) => {
                    const isSelected = template.id === selectedTemplateId;
                    return (
                      <li
                        key={template.id}
                        className={`cursor-pointer rounded-lg px-4 py-3 transition hover:bg-white/[0.08] ${isSelected ? "bg-pink-500/20 text-pink-200" : ""}`}
                        onClick={() => {
                          setSelectedTemplateId(template.id);
                          setTemplateSearch(template.name);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{template.name}</p>
                          <p className="text-xs font-bold text-pink-300">{Math.round(template.base_price / 1000)}K</p>
                        </div>
                        {template.description && <p className="mt-1 text-xs text-white/50">{template.description}</p>}
                      </li>
                    );
                  })
                )}
              </ul>
            )}
          </div>
          <TextInput label="Người gửi" onChange={setSenderName} value={senderName} />
          <TextInput label="Người nhận" onChange={setRecipientName} value={recipientName} />
          <div className="md:col-span-2">
            {!result ? (
              <button className="w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 text-sm font-semibold disabled:opacity-50" disabled={isSubmitting} onClick={createOrder} type="button">
                {isSubmitting ? "Đang tạo đơn..." : "Tạo đơn"}
              </button>
            ) : null}
            {result?.unlocked ? (
              <button
                className="w-full rounded-full border border-white/14 bg-white/[0.06] px-6 py-3 text-sm font-semibold disabled:opacity-50"
                disabled={isSavingEdits}
                onClick={saveOrderEdits}
                type="button"
              >
                {isSavingEdits ? "Đang lưu..." : "Lưu chỉnh sửa"}
              </button>
            ) : null}
            {error ? <p className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
            {saveMessage ? <p className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">{saveMessage}</p> : null}
          </div>
        </Section>

        {!result ? (
          <section className="glass-panel rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold">Đơn của tôi</h2>
              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-xs font-semibold text-white/70">
                {myOrders.length} đơn
              </span>
            </div>
            <div className="mt-4 max-h-[390px] space-y-3 overflow-y-auto pr-2">
              {myOrders.length ? myOrders.map((order) => {
                const payment = getRelationOne(order.payments);
                const template = getRelationOne(order.templates);
                const paid = order.status === "ACTIVE" || payment?.status === "PAID";

                return (
                  <article
                    className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-pink-300/35 hover:bg-white/[0.08]"
                    key={order.id}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-pink-100">{order.public_id}</p>
                        <p className="mt-1 text-xs text-white/48">{template?.name ?? "Chưa rõ mẫu"}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${paid ? "bg-emerald-400/15 text-emerald-100" : "bg-yellow-400/15 text-yellow-100"}`}>
                        {paid ? "Đã thanh toán" : "Chờ thanh toán"}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                      <p><span className="text-white/46">Khách:</span> {order.buyer_name || "Chưa nhập"}</p>
                      <p><span className="text-white/46">Người nhận:</span> {order.recipient_name || "Chưa nhập"}</p>
                      <p><span className="text-white/46">Số tiền:</span> <b>{money(order.amount)}</b></p>
                      <p><span className="text-white/46">Mã CK:</span> <b className="text-pink-100">{payment?.payment_code ?? "Chưa có"}</b></p>
                    </div>
                    <p className="mt-3 text-xs text-white/42">
                      Tạo lúc {new Date(order.created_at).toLocaleString("vi-VN")}
                    </p>
                  </article>
                );
              }) : (
                <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.04] p-6 text-sm text-white/55">
                  Chưa có đơn nào. Tạo đơn đầu tiên xong danh sách sẽ tự hiện ở đây.
                </div>
              )}
            </div>
          </section>
        ) : null}

        {canEditTemplate ? (
          <>
            {isWillYouDateMe ? (
              <>
                <Section title="Thiết lập chung">
                  <ColorInput label="Màu nền tổng thể" onCommit={setStage2Background} value={stage2Background} />
                  <ColorInput label="Màu nhấn (Nút, Tiêu đề)" onCommit={setStage1Accent} value={stage1Accent} />
                  <MediaInput label="Ảnh nền trang (Tùy chọn)" onChange={setStage1Background} />
                  <MediaInput label="Nhạc nền chung" onChange={setGeneralAudioUrl} />
                </Section>
                <Section title="Bước 1: Lời mời">
                  <TextInput label="Tiêu đề lời mời" onChange={setStage1Instruction} value={stage1Instruction} />
                  <TextArea label="Nội dung lời mời" onChange={setQuestion} value={question} />
                  <TextInput label="Nút đồng ý" onChange={setGiftAcceptButton} value={giftAcceptButton} />
                  <TextInput label="Nút từ chối" onChange={setGiftDeclineButton} value={giftDeclineButton} />
                </Section>
                <Section title="Bước 2: Phản hồi đồng ý">
                  <TextInput label="Tiêu đề vui sướng" onChange={setStage2Title} value={stage2Title} />
                  <TextArea label="Lời nhắn vui sướng" onChange={setStage2Subtitle} value={stage2Subtitle} />
                </Section>
                <Section title="Bước 3-6: Khảo sát lựa chọn">
                  <TextInput label="Câu hỏi chọn địa điểm" onChange={setStage3Title} value={stage3Title} />
                  <TextInput label="Câu hỏi chọn ngày giờ" onChange={setStage4Title} value={stage4Title} />
                  <TextInput label="Câu hỏi chọn món ăn" onChange={setStage5Title} value={stage5Title} />
                  <TextInput label="Câu hỏi chọn đồ uống" onChange={setGiftTitle} value={giftTitle} />
                </Section>
                <Section title="Bước 7: Chốt đơn">
                  <TextInput label="Tiêu đề kết thúc" onChange={setFinalTitle} value={finalTitle} />
                  <TextArea label="Lời nhắn cuối cùng" onChange={setFinalSubtitle} value={finalSubtitle} />
                </Section>
              </>
            ) : (
              <>
                <Section title="Thiết lập chung của mẫu">
                  <TextInput label="Mật mã mở quà nếu muốn dùng" onChange={setAnniversaryCode} value={anniversaryCode} />
                  <TextInput label="Câu hỏi phản hồi cuối" onChange={setQuestion} value={question} />
                  <MediaInput label="Nhạc nền tổng" onChange={(url) => setGeneralAudioUrl(url)} />
                </Section>

            <Section title="Đoạn 1 - Ống kính dò chòm sao">
              <TextInput label="Hướng dẫn thao tác" onChange={setStage1Instruction} value={stage1Instruction} />
              <TextInput label="Tiêu đề sau khi soi thấy sao" onChange={setStage1RevealTitle} value={stage1RevealTitle} />
              <TextArea label="Nội dung sau khi soi thấy sao" onChange={setStage1RevealBody} value={stage1RevealBody} />
              <TextInput label="Nút sau khi soi thấy sao" onChange={setStage1RevealButton} value={stage1RevealButton} />
              <ColorInput label="Màu nền đoạn 1" onCommit={setStage1Background} value={stage1Background} />
              <ColorInput label="Màu nhấn đoạn 1" onCommit={setStage1Accent} value={stage1Accent} />
              <MediaInput label="Ảnh hoặc video hiện trong ngôi sao đoạn 1" onChange={(url, type) => {
                setStage1ImageUrl(url);
                setStage1MediaType(type);
              }} />
            </Section>

            <Section title="Đoạn 2 - Quỹ đạo hỗn loạn">
              <TextInput label="Tiêu đề đoạn 2" onChange={setStage2Title} value={stage2Title} />
              <TextInput label="Caption ảnh đoạn 2" onChange={setStage2ImageCaption} value={stage2ImageCaption} />
              <TextArea label="Mô tả đoạn 2" onChange={setStage2Subtitle} value={stage2Subtitle} />
              <TextArea label="Câu quote sau khi ghép đủ quỹ đạo" onChange={setStage2Quote} value={stage2Quote} />
              <TextInput label="Nút tiếp đoạn 2" onChange={setStage2NextButton} value={stage2NextButton} />
              <ColorInput label="Màu nền đoạn 2" onCommit={setStage2Background} value={stage2Background} />
              <ColorInput label="Màu nhấn đoạn 2" onCommit={setStage2Accent} value={stage2Accent} />
              <MediaInput label="Ảnh hoặc video polaroid đoạn 2" onChange={(url, type) => {
                setStage2ImageUrl(url);
                setStage2MediaType(type);
              }} />
            </Section>

            <Section title="Đoạn 3 - Chòm sao thanh âm">
              <TextInput label="Tiêu đề đoạn 3" onChange={setStage3Title} value={stage3Title} />
              <TextInput label="Dòng nhạc" onChange={setStage3MusicLabel} value={stage3MusicLabel} />
              <TextArea label="Mô tả đoạn 3" onChange={setStage3Subtitle} value={stage3Subtitle} />
              <MediaInput label="Ảnh hoặc video hiện sau khi nối hết chòm sao" onChange={(url, type) => {
                setStage3MediaUrl(url);
                setStage3MediaType(type);
              }} />
              <MediaInput label="Nhạc/Ghi âm riêng cho đoạn 3" onChange={(url) => setStage3AudioUrl(url)} />
              <TextInput label="Nút tiếp đoạn 3" onChange={setStage3NextButton} value={stage3NextButton} />
              <TextInput label="Tin nhắn sao 1" onChange={setStage3Message1} value={stage3Message1} />
              <TextInput label="Tin nhắn sao 2" onChange={setStage3Message2} value={stage3Message2} />
              <TextInput label="Tin nhắn sao 3" onChange={setStage3Message3} value={stage3Message3} />
              <TextInput label="Tin nhắn sao 4" onChange={setStage3Message4} value={stage3Message4} />
              <ColorInput label="Màu nền đoạn 3" onCommit={setStage3Background} value={stage3Background} />
              <ColorInput label="Màu nhấn đoạn 3" onCommit={setStage3Accent} value={stage3Accent} />
            </Section>

            <Section title="Đoạn 4 - Mưa sao băng và micro">
              <TextInput label="Hướng dẫn bắt sao" onChange={setStage4Prompt} value={stage4Prompt} />
              <TextInput label="Hướng dẫn micro" onChange={setStage4MicInstruction} value={stage4MicInstruction} />
              <TextInput label="Nút dự phòng khi mic lỗi" onChange={setStage4FallbackButton} value={stage4FallbackButton} />
              <TextInput label="Tiêu đề sau khi bắt sao" onChange={setStage4RevealTitle} value={stage4RevealTitle} />
              <TextArea label="Nội dung thư sau khi thổi mic" onChange={setStage4RevealBody} value={stage4RevealBody} />
              <TextInput label="Nút nhận sau khi thổi mic" onChange={setStage4RevealButton} value={stage4RevealButton} />
              <ColorInput label="Màu nền đoạn 4" onCommit={setStage4Background} value={stage4Background} />
              <ColorInput label="Màu nhấn đoạn 4" onCommit={setStage4Accent} value={stage4Accent} />
              <MediaInput label="Ảnh hoặc video phủ trong sao đoạn 4" onChange={(url, type) => {
                setStage4ImageUrl(url);
                setStage4MediaType(type);
              }} />
            </Section>

            <Section title="Đoạn 5 - Kết thúc và nhận quà">
              <TextInput label="Tiêu đề hợp đồng" onChange={setContractTitle} value={contractTitle} />
              <TextArea label="Nội dung hợp đồng" onChange={setContractBody} value={contractBody} />
              <TextInput label="Nút né hợp đồng" onChange={setContractRejectButton} value={contractRejectButton} />
              <TextInput label="Hướng dẫn giữ vân tay" onChange={setContractHoldInstruction} value={contractHoldInstruction} />
              <TextInput label="Tiêu đề cuối" onChange={setFinalTitle} value={finalTitle} />
              <TextArea label="Mô tả cuối" onChange={setFinalSubtitle} value={finalSubtitle} />
              <TextInput label="Nút nhận quà" onChange={setFinalCta} value={finalCta} />
              <TextInput label="Tiêu đề thư mời" onChange={setGiftTitle} value={giftTitle} />
              <TextArea label="Nội dung thư mời" onChange={setGiftBody} value={giftBody} />
              <DateInput label="Ngày giờ đề xuất" onChange={setProposedDate} value={proposedDate} />
              <TextInput label="Nút từ chối" onChange={setGiftDeclineButton} value={giftDeclineButton} />
              <TextInput label="Nút đồng ý" onChange={setGiftAcceptButton} value={giftAcceptButton} />
              <TextInput label="Tiêu đề khi đồng ý" onChange={setGiftAcceptedTitle} value={giftAcceptedTitle} />
              <TextArea label="Nội dung khi đồng ý" onChange={setGiftAcceptedBody} value={giftAcceptedBody} />
              <TextInput label="Tiêu đề khi hẹn ngày khác" onChange={setGiftDeclinedTitle} value={giftDeclinedTitle} />
              <TextArea label="Nội dung khi hẹn ngày khác" onChange={setGiftDeclinedBody} value={giftDeclinedBody} />
              <TextInput label="Nút quay lại" onChange={setGiftBackButton} value={giftBackButton} />
              <TextInput label="Nút gửi lịch hẹn" onChange={setGiftRescheduleButton} value={giftRescheduleButton} />
              <ColorInput label="Màu nền đoạn cuối" onCommit={setFinalBackground} value={finalBackground} />
              <ColorInput label="Màu nút/nhấn đoạn cuối" onCommit={setFinalAccent} value={finalAccent} />
            </Section>
              </>
            )}
          </>
        ) : null}

        {result ? (
            <div className="mt-4 grid gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 font-semibold text-emerald-100">
                <span>Mã chuyển khoản: {result.paymentCode}</span>
                <span className={`rounded-full px-3 py-1 text-xs border ${result.unlocked ? "border-emerald-400/30 bg-emerald-500/20 text-emerald-100" : "border-yellow-500/30 bg-yellow-500/20 text-yellow-200"}`}>
                  {result.unlocked ? "Đã thanh toán - đã mở khóa" : "Chờ thanh toán"}
                </span>
              </div>
              <p className="text-xs text-white/70">
                {result.unlocked
                  ? "Khách đã chuyển tiền thành công. Nhân viên có thể chỉnh template và gửi link cho khách."
                  : "Gửi QR này cho khách. Gift link đang bị khóa tới khi webhook ngân hàng xác nhận đúng mã đơn và số tiền."}
              </p>
              {!result.unlocked ? (
                <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:grid-cols-[160px_1fr]">
                {result.qrCodeUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="QR chuyển khoản" className="h-40 w-40 rounded-2xl bg-white object-contain p-2" src={result.qrCodeUrl} />
                ) : (
                  <div className="grid h-40 w-40 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-center text-xs text-white/50">
                    Chưa cấu hình tài khoản nhận tiền
                  </div>
                )}
                <div className="grid content-center gap-2 text-sm">
                  <p><span className="text-white/50">Số tiền:</span> <b>{result.amount.toLocaleString("vi-VN")}đ</b></p>
                  <p><span className="text-white/50">Nội dung CK:</span> <b className="text-pink-100">{result.paymentCode}</b></p>
                  <p className="text-xs leading-5 text-white/60">Khách chuyển đúng số tiền và đúng nội dung. Webhook sẽ tự mở khóa link sau khi tiền vào tài khoản.</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      className="rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-xs font-semibold"
                      onClick={async () => {
                        await copyText(result.paymentCode);
                        showCopyMessage("Đã copy mã CK.");
                      }}
                      type="button"
                    >
                      Copy mã CK
                    </button>
                    {result.qrCodeUrl ? (
                      <>
                        <button
                          className="rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-xs font-semibold"
                          onClick={() => copyQrImage(result.qrCodeUrl || "", showCopyMessage)}
                          type="button"
                        >
                          Copy QR
                        </button>
                        <button
                          className="rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-xs font-semibold"
                          onClick={() => downloadImage(result.qrCodeUrl || "", `qr-${result.paymentCode}.png`)}
                          type="button"
                        >
                          Download QR
                        </button>
                      </>
                    ) : null}
                    {currentRole === "ADMIN" ? (
                      <button
                        className="rounded-full border border-emerald-300/25 bg-emerald-400/12 px-4 py-2 text-xs font-semibold text-emerald-100 disabled:opacity-50"
                        disabled={isConfirmingPayment}
                        onClick={confirmPaymentManually}
                        type="button"
                      >
                        {isConfirmingPayment ? "Đang mở khóa..." : "Đã nhận tiền - mở khóa"}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
              ) : null}
              {result.unlocked ? (
                <>
                  <div className="mt-2 grid gap-2">
                    <span className="block text-xs font-semibold text-white/50">Link gửi cho người ấy</span>
                    <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                      <input className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none" readOnly value={result.giftLink} />
                      <button className="rounded-xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-semibold" onClick={async () => {
                        await copyText(result.giftLink);
                        showCopyMessage("Đã copy gift link.");
                      }} type="button">Copy</button>
                    </div>
                  </div>
                  <div className="mt-1 grid gap-2">
                    <span className="block text-xs font-semibold text-white/50">Link để xem kết quả</span>
                    <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                      <input className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none" readOnly value={result.trackLink} />
                      <button className="rounded-xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-semibold" onClick={async () => {
                        await copyText(result.trackLink);
                        showCopyMessage("Đã copy track link.");
                      }} type="button">Copy</button>
                    </div>
                  </div>
                </>
              ) : null}
              {copyMessage ? (
                <p className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white/70">
                  {copyMessage}
                </p>
              ) : null}
            </div>
          ) : null}
      </div>

      {showSetupWorkspace ? (
      <aside className="glass-panel-soft rounded-2xl p-4 xl:sticky xl:top-5 xl:h-fit">
        <div className="px-1 pb-4">
          <h2 className="text-2xl font-semibold">Live Preview</h2>
          <p className="mt-1 text-sm text-white/54">Xem trước hiển thị ở đây.</p>
        </div>
        <InteractiveTemplatePreview
          componentKey={selectedComponentKey}
          customData={customData}
          question={question}
          recipientName={recipientName || "Em"}
          senderName={senderName || "Anh"}
          visualLabel={selectedTemplate?.visual_label}
        />
      </aside>
      ) : null}
    </div>
  );
}
