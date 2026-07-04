"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import { useEffect, useMemo, useRef, useState } from "react";
import type { TemplateCatalogItem } from "@/lib/supabase/server";
import { InteractiveTemplatePreview } from "@/components/templates/InteractiveTemplatePreview";
import { FormStepNavigator } from "./FormStepNavigator";
import { GACHA_DATA } from "@/components/templates/dating-3/config";
import { toast } from "@/components/ui/Toast";
import { ImageCropperModal } from "@/components/ui/ImageCropperModal";
import imageCompression from "browser-image-compression";

const GENERAL_SONGS = [
  "/assets/songs/general/Da LAB - Từ Ngày Em Đến (Official Music Video)_128k.mp3",
  "/assets/songs/general/GREY D - hoá ra….mp3",
  "/assets/songs/general/GREY D - yêu em như…_128k.mp3",
  "/assets/songs/general/GREY D - đôi mắt kẻ tình si.mp3",
  "/assets/songs/general/HAN SARA _ TỚ THÍCH CẬU FT H.H.N _ OFFICIAL MUSIC VIDEO_128k.mp3",
  "/assets/songs/general/HIEUTHUHAI - Nghe Như Tình Yêu (prod. by Kewtiie)  [Official Lyric Video]_128k.mp3",
  "/assets/songs/general/HIEUTHUHAI - Người Im Lặng Gặp Người Hay Nói (prod. by Kewtiie) l Official Music Video_128k.mp3",
  "/assets/songs/general/SEANPOET _ EM THÍCH ft. LỬA _ OFFICIAL MV LYRIC_128k.mp3",
  "/assets/songs/general/Soulloom - Dance in the Rain.m4a",
  "/assets/songs/general/TÌNH CỜ YÊU EM  Kuun Đức Nam ft. Linh Thộn Official Music Video  KEY ENTERTAINMENT.mp3.mp3",
  "/assets/songs/general/dính - bồ em_128k.mp3",
  "/assets/songs/general/nân. x Ngơ - tình đắng như ly cà phê _ tas release_128k.mp3",
  "/assets/songs/general/tlinh - Thích Quá Rùi Nà (ft. Trung Trần) _ OFFICIAL LYRICS VIDEO_128k.mp3",
];

const SERVICE_PACKAGES = [
  { id: "goi1-thuong", label: "GÓI 1: THEO MẪU (Làm thường - 59.000đ)", price: 59000 },
  { id: "goi1-gap", label: "GÓI 1: THEO MẪU (Làm gấp - Từ 88.000đ)", price: 88000 },
  { id: "goi2-thuong", label: "GÓI 2: CHỈNH CẢM XÚC (Làm thường - 99.000đ)", price: 99000 },
  { id: "goi2-gap", label: "GÓI 2: CHỈNH CẢM XÚC (Làm gấp - Từ 128.000đ)", price: 128000 },
  { id: "goi3-thuong", label: "GÓI 3: ĐẶC BIỆT (Làm thường - 149.000đ)", price: 149000 },
  { id: "goi3-gap", label: "GÓI 3: ĐẶC BIỆT (Làm gấp - Từ 178.000đ)", price: 178000 },
];

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
  custom_data?: any;
};

function absoluteUrl(path: string) {
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
}

function mediaPreview(file?: File | null) {
  return file ? URL.createObjectURL(file) : "";
}

function money(value: number) {
  if (value === null || value === undefined || isNaN(Number(value))) return "0đ";
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
}

function getRelationOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    // If it's payments, we want the most recent one. The DB usually orders by created_at desc, but let's be safe.
    // Or we can just get the last element if it's ordered ASC. 
    // Actually, Supabase returns array. We'll return the FIRST element assuming it's DESC, or we can find the PENDING one.
    const pending = (value as any[]).find(v => v && v.status === "PENDING");
    if (pending) return pending as T;
    return value[0] ?? null;
  }
  return value ?? null;
}

async function copyText(value: string) {
  try {
    if (navigator.clipboard && window.isSecureContext && document.hasFocus()) {
      await navigator.clipboard.writeText(value);
    } else {
      throw new Error("Clipboard API unavailable or document not focused");
    }
  } catch (error) {
    const textArea = document.createElement("textarea");
    textArea.value = value;
    textArea.style.position = "absolute";
    textArea.style.left = "-999999px";
    document.body.prepend(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Lỗi copy text:", err);
    } finally {
      textArea.remove();
    }
  }
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

export function getThemeFromComponentKey(key: string) {
  const k = (key || "").toLowerCase();
  if (k.includes("birthday")) return "birthday";
  if (k.includes("sorry")) return "sorry";
  if (k.includes("dating") || k.includes("will")) return "dating";
  if (k.includes("val") || k.includes("starry")) return "valentine";
  return "valentine";
}

function ThemeMusicSelector({
  theme,
  value,
  onChange,
  label
}: {
  theme: string;
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const themeSongs: Record<string, { label: string, url: string }[]> = {
    dating: [
      { label: "Dating - Nhạc 1", url: "/assets/songs/dating/dating-1.mp3" },
      { label: "Dating - Nhạc 2", url: "/assets/songs/dating/dating-2.mp3" },
      { label: "Dating - Nhạc 3", url: "/assets/songs/dating/dating-3.mp3" },
      { label: "Dating - Nhạc 4", url: "/assets/songs/dating/dating-4.mp3" },
      { label: "Dating - Nhạc 5", url: "/assets/songs/dating/dating-5.m4a" },
    ],
    birthday: [
      { label: "Sinh Nhật - Nhạc 1", url: "/assets/songs/birthday/birthday-1.mp3" },
      { label: "Sinh Nhật - Nhạc 2", url: "/assets/songs/birthday/birthday-2.mp3" },
      { label: "Sinh Nhật - Nhạc 3", url: "/assets/songs/birthday/birthday-3.m4a" },
    ],
    valentine: [
      { label: "Valentine - Nhạc 1", url: "/assets/songs/valentine/valentine-1.mp3" },
      { label: "Valentine - Nhạc 2", url: "/assets/songs/valentine/valentine-2.mp3" },
      { label: "Valentine - Nhạc 3", url: "/assets/songs/valentine/valentine-3.mp3" },
    ],
    sorry: [
      { label: "Xin Lỗi - Nhạc 1", url: "/assets/songs/sorry/sorry-1.mp3" },
      { label: "Xin Lỗi - Nhạc 2", url: "/assets/songs/sorry/sorry-2.mp3" },
    ],
  };

  const options = themeSongs[theme] || themeSongs.valentine;
  const isCustom = value && !options.some(o => o.url === value);

  return (
    <div className="grid gap-2 text-sm md:col-span-2">
      <span className="text-white/64">{label}</span>
      <select 
        className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none focus:border-pink-300/50 text-white"
        value={isCustom ? "custom" : value || ""}
        onChange={(e) => {
           if (e.target.value !== "custom") {
             onChange(e.target.value);
           } else {
             onChange(""); // reset for custom input
           }
        }}
      >
        <option value="" className="text-black">-- Chọn nhạc có sẵn --</option>
        {options.map((o) => (
          <option key={o.url} value={o.url} className="text-black">{o.label}</option>
        ))}
        <option value="custom" className="text-black">Tải lên nhạc khác...</option>
      </select>
      {(isCustom || value === "") && (
         <div className="mt-2">
           <MediaInput label="" accept="audio/*" onChange={(url) => onChange(url)} />
         </div>
      )}
    </div>
  );
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
        value={value ?? ""}
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
  accept = "image/*,video/*,audio/*",
}: {
  label: string;
  onChange: (url: string, type: string) => void;
  accept?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropSrc, setCropSrc] = useState<string>("");

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      let fileToUpload = file;
      // Nén ảnh nếu là định dạng hình ảnh (bỏ qua gif, video, audio)
      if (file.type.startsWith("image/") && file.type !== "image/gif") {
        const options = {
          maxSizeMB: 0.3, // Nén xuống tối đa 300KB
          maxWidthOrHeight: 1920, // Kích thước tối đa
          useWebWorker: true,
          initialQuality: 0.8
        };
        try {
          fileToUpload = await imageCompression(file, options);
          console.log(`Đã nén ảnh từ ${(file.size / 1024 / 1024).toFixed(2)}MB xuống ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`);
        } catch (error) {
          console.error("Lỗi nén ảnh, tiếp tục up ảnh gốc", error);
        }
      }

      const formData = new FormData();
      formData.append("file", fileToUpload);
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
         const errData = await res.json().catch(() => ({}));
         throw new Error(errData.error || "Upload failed");
      }
      const data = await res.json();
      
      onChange(data.url, file.type);
    } catch (error: any) {
      console.error("Upload error", error);
      toast.error("Lỗi tải file: " + error.message);
    } finally {
      setIsUploading(false);
      setCropFile(null);
      setCropSrc("");
    }
  };

  return (
    <label className="grid gap-2 text-sm md:col-span-2">
      {label && <span className="text-white/64">{label}</span>}
      <input
        accept={accept}
        disabled={isUploading}
        className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-500/10 file:text-pink-500 hover:file:bg-pink-500/20 disabled:opacity-50"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) {
            onChange("", "");
            return;
          }
          if (file.type.startsWith("image/")) {
            setCropFile(file);
            setCropSrc(URL.createObjectURL(file));
          } else {
            uploadFile(file);
          }
        }}
        type="file"
      />
      {isUploading && <span className="text-xs font-semibold text-pink-400">Đang tải file lên đám mây...</span>}
      {cropSrc && (
        <ImageCropperModal
          isOpen={!!cropSrc}
          onClose={() => { setCropSrc(""); setCropFile(null); }}
          imageSrc={cropSrc}
          onCropComplete={async (croppedDataUrl) => {
            if (!cropFile) return;
            const res = await fetch(croppedDataUrl);
            const blob = await res.blob();
            const newFile = new File([blob], cropFile.name, { type: "image/jpeg" });
            uploadFile(newFile);
          }}
        />
      )}
    </label>
  );
}

export type MemoryItem = { imageUrl: string; message: string };

function MemoryArrayInput({
  label,
  values,
  onChange,
}: {
  label: string;
  values: MemoryItem[];
  onChange: (v: MemoryItem[]) => void;
}) {
  return (
    <div className="grid gap-2 md:col-span-2">
      <span className="text-white/64">{label}</span>
      {values.map((v, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-xl border border-white/10 p-4 bg-white/[0.02]">
           <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold text-pink-300">Ảnh kỉ niệm {i + 1}</span>
              <button type="button" onClick={() => onChange(values.filter((_, idx) => idx !== i))} className="text-red-400 text-xs hover:underline px-2 py-1 bg-red-400/10 rounded-lg">Xóa ảnh này</button>
           </div>
           
           <MediaInput label="" accept="image/*,video/*" onChange={(url) => {
              const newValues = [...values];
              newValues[i].imageUrl = url;
              onChange(newValues);
           }} />
           
           <input type="text" value={v.message} placeholder="Nhập dòng chú thích ngắn dưới ảnh..." onChange={(e) => {
              const newValues = [...values];
              newValues[i].message = e.target.value;
              onChange(newValues);
           }} className="rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2 outline-none text-sm focus:border-pink-500/50 mt-1" />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...values, { imageUrl: "", message: "" }])} className="rounded-xl border border-dashed border-white/20 p-3 text-center text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-white transition-colors mt-2">
        + Thêm một tấm ảnh nữa
      </button>
    </div>
  );
}

function Section({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title: string;
  className?: string;
}) {
  return (
    <section className={`glass-panel rounded-2xl p-5 ${className || ""}`}>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

export function OrderBuilderForm({ currentRole, myOrders, templates, canCreateFree }: { currentRole: "ADMIN" | "STAFF" | "EMPLOYEE"; myOrders: MyOrderRow[]; templates: TemplateCatalogItem[]; canCreateFree?: boolean }) {
  const valentineOne = templates.find((template) => template.component_key.includes("constellation")) ?? templates[0];
  const [selectedTemplateId, setSelectedTemplateId] = useState(valentineOne?.id ?? "");
  const [selectedPackage, setSelectedPackage] = useState(SERVICE_PACKAGES[2].id); // Mặc định gói phổ biến
  const [templateSearch, setTemplateSearch] = useState(valentineOne?.name ?? "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loadedTemplate, setLoadedTemplate] = useState<{ id: string; name: string; component_key: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const dating1Stages = ["question", "success", "location", "datetime", "food", "drink", "completion"];
  const [dating1Stage, setDating1Stage] = useState(dating1Stages[0]);

  const [valentine1Stage, setValentine1Stage] = useState(1);

  const [dating2Config, setDating2Config] = useState<Record<string, any>>({
    previewStep: 1,
    bgFrom: "#ffe6f2",
    bgTo: "#ffb3d9",
    pinCode: "0401",
    radioHint: "Chạm để dò đúng tần số của tớ nhé 📻",
    vibeTitle: "Xin chào!\nHôm nay của cậu thế nào?",
    vibeOptions: ["Đang đói 🍕", "Hơi mệt 🥺", "Rất vui ✨"],
    vibeTooltip: "Thế thì để tớ sạc năng lượng cho cậu nhé! ⚡",
    scratchTitle: "Trạm sạc số 1:",
    scratchSubtitle: "Cào thẻ bên dưới nhé 🎁",
    scratchPrize: "Một buổi hẹn hò\nbao trọn gói!",
    scratchBtn: "Dùng vé ngay 👉",
    wheelTitle: "Vòng Quay Hẹn Hò",
    wheelOptions: ["Nhà Hàng 🧑‍🍳", "Đi Bơi 🏊‍♀️", "Xem Phim 🎬", "Dạo phố 🍡", "Trà Sữa 🧋", "Cà Phê ☕"],
    wheelBtn: "Lên lịch thôi! 👉",
    dtTitle: "Chốt Thời Gian",
    dtDates: ["T7 Tuần Này", "CN Tuần Này", "T2 Tuần Sau", "Ngày khác"],
    dtTimes: ["Sáng (9h)", "Chiều (15h)", "Tối (19h)"],
    dtBtn: "Hoàn tất 💖",
    finaleLetterTitle: "Gửi Cậu,",
    finaleLetterBody: "Cậu biết không, kể từ ngày đầu tiên chúng mình nói chuyện, tớ đã cảm thấy ở cậu một sự ấm áp đặc biệt.\n\nTớ không hứa sẽ mang lại cho cậu những điều hoàn hảo nhất, nhưng tớ hứa sẽ luôn cố gắng để mang lại nụ cười cho cậu mỗi ngày.\n\nMọi thứ đã sẵn sàng. Cậu có muốn đi chơi với tớ vào {date}, {time} tới đây không?",
    finaleBtnNo: "TỪ CHỐI 🫣",
    finaleBtnYes: "ĐỒNG Ý 🥰",
    finaleBtnSuccess: "Chốt deal! 🎉"
  });

  const [dating3Config, setDating3Config] = useState<Record<string, any>>({
    previewStep: 1,
    ...GACHA_DATA
  });
  const [buyerName, setBuyerName] = useState("");
  const [buyerContact, setBuyerContact] = useState("");
  const [senderName, setSenderName] = useState("Anh");
  const [recipientName, setRecipientName] = useState("Em");
  const [qrTimeLeft, setQrTimeLeft] = useState(600);
  const [qrKey, setQrKey] = useState<number>(0);
  const [anniversaryCode, setAnniversaryCode] = useState("1402");
  const [question, setQuestion] = useState("Em có đồng ý cùng anh viết tiếp câu chuyện này không?");
  const [generalAudioUrl, setGeneralAudioUrl] = useState("");

  const [birthdayAge, setBirthdayAge] = useState("18");
  const [birthdayMessage, setBirthdayMessage] = useState("Chúc mừng sinh nhật cục cưng! Tuổi mới luôn rực rỡ và vui vẻ nha! ❤️");
  const [birthdayMemories, setBirthdayMemories] = useState<MemoryItem[]>([
    { imageUrl: "", message: "Nhớ ngày đầu tiên đôi ta gặp gỡ..." },
    { imageUrl: "", message: "Nụ cười ấy đã làm trái tim anh xao xuyến" }
  ]);
  
  const [birthdayInstructionText, setBirthdayInstructionText] = useState("Giữ bật lửa và kéo đến mồi lửa nến nhé! 🔥");
  const [birthdayWishPromptText, setBirthdayWishPromptText] = useState("Đã đến lúc thực hiện điều ước rồi! ✨");
  const [birthdayWishAcceptButton, setBirthdayWishAcceptButton] = useState("Đồng ý");
  const [birthdayWishDeclineButton, setBirthdayWishDeclineButton] = useState("Chưa nghĩ ra");
  const [birthdayRecordingText, setBirthdayRecordingText] = useState("Đang ghi âm điều ước của bạn...");
  const [birthdayRecordingCompleteButton, setBirthdayRecordingCompleteButton] = useState("Hoàn tất ghi âm");
  const [birthdayGiftPromptText, setBirthdayGiftPromptText] = useState("Hãy nhấn vào hộp quà để mở điều bất ngờ! 🎁");
  const [birthdayBalloonText, setBirthdayBalloonText] = useState("HPBD Em!");
  const [birthdayGreetingCardSignature, setBirthdayGreetingCardSignature] = useState("Từ: Anh");
  const [birthdayFinal3DSignature, setBirthdayFinal3DSignature] = useState("- Từ Anh -");

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
  const [locationOptions, setLocationOptions] = useState<string[]>(["Cà phê ☕", "Đi ăn 🍽️", "Xem phim 🎬", "Công viên 🌳", "Mua sắm 🛍️", "Lượn phố 🏙️"]);
  const [foodOptions, setFoodOptions] = useState<string[]>(["Bún đậu", "Phở", "Bún bò", "Mỳ Quảng", "Mỳ cay", "Xiên bẩn"]);
  const [drinkOptions, setDrinkOptions] = useState<string[]>(["Cà phê", "Trà", "Trà Sữa", "Trà Matcha", "Sinh tố", "Nước ép"]);

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
  const [signOffText, setSignOffText] = useState("Thương mến");
  const [finalCta, setFinalCta] = useState("Nhận Quà Đi Chơi");
  const [finalBackground, setFinalBackground] = useState("#fb7185");
  const [finalAccent, setFinalAccent] = useState("#ec4899");
  const [giftTitle, setGiftTitle] = useState("Thư Mời Hẹn Hò");
  const [giftBody, setGiftBody] = useState("Cuối tuần này, cùng nhau đi dạo phố và uống chút gì đó ấm áp nhé? Tớ biết một quán view rất xinh!");
  const [val1StartDate, setVal1StartDate] = useState("2023-02-14T00:00:00");
  const [expiresAtDate, setExpiresAtDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().split('T')[0];
  });
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

  const [valentine2Config, setValentine2Config] = useState({
    anniversaryCode: "1402",
    musicUrl: "/valentine-2-music.m4a",
    coverTitle: "Our Memories",
    coverImage: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600",
    page1Image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600",
    page1Text: "Ngày đó, tớ không nghĩ chúng mình lại đi cùng nhau xa đến thế...",
    polaroids: [
      { id: 1, src: "https://images.unsplash.com/photo-1494774116478-eb287e07b8b2?w=400", caption: "Bình yên" },
      { id: 2, src: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400", caption: "Ngốc nghếch" }
    ],
    page2Text: "Tớ yêu cái cách cậu quan tâm đến những điều nhỏ nhất...",
    page3Hint: "Kéo ruy băng nhé",
    confessionText: "Trang sách này tớ muốn để ngỏ, chờ cậu cùng viết tiếp. Tối nay đi xem phim với tớ nhé?",
  });

  const [dynamicData, setDynamicData] = useState<Record<string, any>>({});
  const [result, setResult] = useState<{ amount: number; giftLink: string; orderId: string; paymentCode: string; paymentStatus: string; qrCodeUrl: string | null; status: string; trackLink: string; unlocked: boolean; templateKey?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingEdits, setIsSavingEdits] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [builderVolume, setBuilderVolume] = useState(0.5);
  const [orderPage, setOrderPage] = useState(1);
  const ordersPerPage = 5;
  const [isLocked, setIsLocked] = useState(false);
  const [editUnlockCount, setEditUnlockCount] = useState(0);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; type: "LOCK" | "UNLOCK"; title: string; desc: string; onConfirm: () => void } | null>(null);

  const templateId = selectedTemplateId || (valentineOne?.id ?? "");
  const isConstellation = !!templateId && (templateId.includes("constellation") || templateId.includes("starry") || templateId.includes("valentine-1"));
  const isBirthday1 = !!templateId && templateId.includes("birthday-1");

  const selectedTemplate = useMemo(
    () =>
      loadedTemplate?.id === selectedTemplateId
        ? (loadedTemplate as any)
        : templates.find((template) => template.id === selectedTemplateId) ?? valentineOne,
    [selectedTemplateId, templates, valentineOne, loadedTemplate],
  );

  const dating3ConfigMemo = useMemo(() => {
    const keyword = templateSearch.trim().toLowerCase();
    return keyword
      ? templates.filter((template) => `${template.name} ${template.tagline ?? ""} ${template.description ?? ""}`.toLowerCase().includes(keyword))
      : templates;
  }, [templateSearch, templates]);
  const filteredTemplates = useMemo(() => {
    const keyword = templateSearch.trim().toLowerCase();
    return keyword
      ? templates.filter((template) => `${template.name} ${template.tagline ?? ""} ${template.description ?? ""}`.toLowerCase().includes(keyword))
      : templates;
  }, [templateSearch, templates]);
  const selectedComponentKey = useMemo(() => {
    const rawKey = selectedTemplate?.component_key || selectedTemplate?.slug || "";
    if (rawKey) return rawKey;

    const templateName = selectedTemplate?.name?.toLowerCase() ?? "";
    if (templateName.includes("date me") || templateName.includes("dating")) return "will-you-date-me";
    if (templateName.includes("birthday")) return "birthday-magic";
    return "val-starry-constellation-01";
  }, [selectedTemplate]);

  const isWillYouDateMe = selectedComponentKey === "will-you-date-me" || selectedComponentKey === "dating-1" || selectedComponentKey === "dating #1";
  const isBirthdayMagic = selectedComponentKey === "birthday-magic" || selectedComponentKey === "birthday-1" || selectedComponentKey === "birthday #1";
  const isDating2 = selectedComponentKey === "dating-2" || selectedComponentKey === "dating #2";
  const isDating3 = selectedComponentKey === "dating-3" || selectedComponentKey === "dating #3";
  const isValentine2 = selectedComponentKey.includes("valentine-2") || selectedComponentKey.includes("valentine #2");
  const isValentine3 = selectedComponentKey.includes("valentine-3") || selectedComponentKey.includes("valentine #3");
  const isBirthday2 = selectedComponentKey.includes("birthday-2") || selectedComponentKey.includes("birthday #2");
  const isBirthday3 = selectedComponentKey.includes("birthday-3") || selectedComponentKey.includes("birthday #3");
  const isSorry1 = selectedComponentKey.includes("sorry-1") || selectedComponentKey.includes("sorry #1");
  const isSorry2 = selectedComponentKey.includes("sorry-2") || selectedComponentKey.includes("sorry #2");
  const isSorry3 = selectedComponentKey.includes("sorry-3") || selectedComponentKey.includes("sorry #3");
  const canEditTemplate = !result || result.unlocked;

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
      expiresAtDate,
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
    signOffText,
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
    servicePackage: selectedPackage,
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

    ...(isDating2 ? { ...dating2Config, audioSrc: generalAudioUrl } : {}),
    ...(isDating3 ? { ...dating3Config, audioSrc: generalAudioUrl } : {}),
    ...(isValentine2 ? valentine2Config : {}),
    ...(!isBirthdayMagic ? {
      memories: [
        { message: stage3Message1, title: "Tin nhắn 1" },
        { message: stage3Message2, title: "Tin nhắn 2" },
        { message: stage3Message3, title: "Tin nhắn 3" },
        { message: stage3Message4, title: "Tin nhắn 4" },
      ],
    } : {}),
    ...(isBirthdayMagic ? {
      birthdayMessage: birthdayMessage,
      musicUrl: generalAudioUrl,
      age: birthdayAge,
      imageUrl: stage1ImageUrl,
      memories: birthdayMemories.map((memory, index) => ({
        ...memory,
        title: `Kỷ niệm ${index + 1}`,
      })),
      instructionText: birthdayInstructionText,
      wishPromptText: birthdayWishPromptText,
      wishAcceptButton: birthdayWishAcceptButton,
      wishDeclineButton: birthdayWishDeclineButton,
      recordingText: birthdayRecordingText,
      recordingCompleteButton: birthdayRecordingCompleteButton,
      giftPromptText: birthdayGiftPromptText,
      balloonText: birthdayBalloonText,
      greetingCardSignature: birthdayGreetingCardSignature,
      final3DSignature: birthdayFinal3DSignature,
    } : isWillYouDateMe ? {
      questionTitle: stage1Instruction,
      questionBody: question,
      yesButton: giftAcceptButton,
      noButton: giftDeclineButton,
      successTitle: stage2Title,
      successMessage: stage2Subtitle,
      locationTitle: stage3Title,
      locationOptions,
      datetimeTitle: stage4Title,
      foodTitle: stage5Title,
      foodOptions,
      drinkTitle: giftTitle,
      drinkOptions,
      finalTitle: finalTitle,
      finalMessage: finalSubtitle,
      signOffText,
      generalAudioUrl: generalAudioUrl,
      backgroundImage: stage1Background,
      backgroundColor: stage2Background,
      forceStage: dating1Stage,
      accentColor: stage1Accent,
    } : {
      forceStage: valentine1Stage,
    }),
  };

  useEffect(() => {
    if (!result || result.unlocked || !result.qrCodeUrl) return;

    const interval = setInterval(() => {
      setQrTimeLeft((prev) => {
        if (prev <= 1) {
          setQrKey(Date.now());
          return 600; // Reset to 10 minutes
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [result]);

  // Control audio volume inside the preview
  useEffect(() => {
    if (typeof document === "undefined") return;
    const audios = document.querySelectorAll("#builder-preview audio");
    audios.forEach((audio: any) => {
      audio.volume = builderVolume;
      audio.play().catch(() => {});
    });
  }, [generalAudioUrl, builderVolume, selectedTemplateId, selectedComponentKey, customData]);

  async function createOrder() {
    setIsSubmitting(true);
    setError("");
    setResult(null);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: SERVICE_PACKAGES.find(p => p.id === selectedPackage)?.price ?? 99000,
        buyerContact,
        buyerName,
        customData,
        recipientName,
        templateId: selectedTemplate?.id,
        isFreeOrder: canCreateFree,
      }),
    });

    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      toast.error(data.error ?? "Không tạo được link. Kiểm tra đăng nhập và dữ liệu.");
      return;
    }
    toast.success("Tạo đơn thành công!");

    setResult({
      amount: Number(data.amount ?? SERVICE_PACKAGES.find(p => p.id === selectedPackage)?.price ?? 0),
      giftLink: absoluteUrl(data.giftPath),
      orderId: data.orderId,
      paymentCode: data.paymentCode,
      paymentStatus: data.paymentStatus ?? "PENDING",
      qrCodeUrl: data.qrCodeUrl ?? null,
      status: data.status ?? "PENDING_PAYMENT",
      trackLink: absoluteUrl(data.trackPath),
      unlocked: Boolean(data.unlocked),
    });
    
    setQrTimeLeft(600);
    setQrKey(Date.now());
    setIsLocked(false);
    setEditUnlockCount(0);
  }

  function showCopyMessage(message: string) {
    setCopyMessage(message);
    window.setTimeout(() => setCopyMessage(""), 1800);
  }

  async function saveOrderEdits(overrideData?: Record<string, any>) {
    if (!result?.orderId) return;

    setIsSavingEdits(true);
    setSaveMessage("");
    setError("");
    
    const mergedData = overrideData ? { ...customData, ...overrideData } : customData;

    const response = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customData: mergedData,
        orderId: result.orderId,
        recipientName,
        buyerName: senderName,
      }),
    });
    const data = await response.json().catch(() => ({}));
    setIsSavingEdits(false);

    if (!response.ok) {
      toast.error(data.error ?? "Không lưu được chỉnh sửa.");
      return;
    }

    toast.success("Đã lưu chỉnh sửa template cho đơn này.");
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
      toast.error(data.error ?? "Không xác nhận được thanh toán.");
      return;
    }
    toast.success("Đã xác nhận thanh toán.");

    setResult((current) => current ? {
      ...current,
      paymentStatus: "PAID",
      status: "ACTIVE",
      unlocked: true,
    } : current);
  }
  
  function getFreeEdits(pkgId: string) {
    if (pkgId?.startsWith("goi3")) return 2;
    if (pkgId?.startsWith("goi2")) return 1;
    return 0;
  }

  function handleLock() {
    setConfirmModal({
      open: true,
      type: "LOCK",
      title: "Xác nhận khóa đơn",
      desc: "Bạn có chắc chắn muốn khóa đơn này? Khóa xong sẽ không thể chỉnh sửa trừ khi mở khóa (có thể tốn phí).",
      onConfirm: async () => {
        setIsLocked(true);
        await saveOrderEdits({ isLocked: true });
        toast.success("Đã khóa đơn thành công!");
      }
    });
  }

  async function handleUnlock() {
    const freeEdits = getFreeEdits(selectedPackage);
    const hasFreeEdit = editUnlockCount < freeEdits;
    
    setConfirmModal({
      open: true,
      type: "UNLOCK",
      title: hasFreeEdit ? "Mở khóa miễn phí" : "Mở khóa tính phí",
      desc: hasFreeEdit 
        ? `Bạn còn ${freeEdits - editUnlockCount} lần mở khóa miễn phí.\n\nXác nhận mở khóa?`
        : `Đơn này ĐÃ HẾT lượt sửa miễn phí.\n\nViệc mở khóa sửa tiếp sẽ TÍNH PHÍ THÊM 19K (Vui lòng thu phí 19K từ khách).\n\nBạn có chắc chắn mở khóa?`,
      onConfirm: async () => {
        const newCount = editUnlockCount + 1;
        
        if (hasFreeEdit) {
          setIsLocked(false);
          setEditUnlockCount(newCount);
          await saveOrderEdits({ isLocked: false, editUnlockCount: newCount });
          toast.success("Đã mở khóa sửa miễn phí!");
        } else {
          // Trả phí: Gọi API tạo thanh toán mở khóa
          setIsSavingEdits(true);
          try {
            const res = await fetch(`/api/orders/${result?.orderId}/unlock`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ editUnlockCount: newCount })
            });
            const data = await res.json();
            
            if (!res.ok) {
              toast.error(data.error || "Không thể tạo thanh toán mở khóa.");
            } else {
              toast.success("Vui lòng thanh toán phí 19K để mở khóa!");
              setIsLocked(false);
              setEditUnlockCount(newCount);
              // Cập nhật lại UI hiển thị QR code
              setResult({
                ...result!,
                status: "PENDING_PAYMENT",
                unlocked: false,
                paymentCode: data.paymentCode,
                paymentStatus: "PENDING",
                qrCodeUrl: data.qrCodeUrl,
                amount: data.amount,
              });
            }
          } catch (e) {
            toast.error("Đã xảy ra lỗi.");
          }
          setIsSavingEdits(false);
        }
      }
    });
  }

  function loadOrder(order: any) {
    const template = getRelationOne(order.templates);
    const payment = getRelationOne(order.payments);
    const paid = order.status === "ACTIVE" || payment?.status === "PAID";
    
    setResult({
      amount: order.amount,
      giftLink: absoluteUrl(`/gift/${order.public_id}`),
      orderId: order.public_id,
      paymentCode: payment?.payment_code ?? "",
      paymentStatus: payment?.status ?? "PENDING",
      qrCodeUrl: payment?.qr_code_url ?? null,
      status: order.status,
      trackLink: absoluteUrl(`/track/${order.public_id}`),
      unlocked: paid,
    });
    setQrTimeLeft(600);
    setQrKey(Date.now());

    setBuyerName(order.buyer_name || "");
    setBuyerContact(order.buyer_contact || "");
    setRecipientName(order.recipient_name || "");
    if (template) {
      setLoadedTemplate(template);
      setSelectedTemplateId(template.id);
      setTemplateSearch(template.name);
    } else {
      setSelectedTemplateId(order.template_id);
    }
    
    // Nếu có package được lưu trong customData thì load lên
    const cd = order.custom_data || {};
    if (cd.servicePackage) setSelectedPackage(cd.servicePackage);
    
    if (cd.question) setQuestion(cd.question);
    if (cd.questionTitle) setStage1Instruction(cd.questionTitle);
    if (cd.connectInstruction) setStage1Instruction(cd.connectInstruction);
    if (cd.age) setStage1Instruction(String(cd.age));
    if (cd.giftAcceptButton) setGiftAcceptButton(cd.giftAcceptButton);
    if (cd.yesButton) setGiftAcceptButton(cd.yesButton);
    if (cd.giftDeclineButton) setGiftDeclineButton(cd.giftDeclineButton);
    if (cd.noButton) setGiftDeclineButton(cd.noButton);
    if (cd.stage2Title) setStage2Title(cd.stage2Title);
    if (cd.successTitle) setStage2Title(cd.successTitle);
    if (cd.stage2Subtitle) setStage2Subtitle(cd.stage2Subtitle);
    if (cd.successMessage) setStage2Subtitle(cd.successMessage);
    if (cd.stage3Title) setStage3Title(cd.stage3Title);
    if (cd.locationTitle) setStage3Title(cd.locationTitle);
    if (cd.stage4Title) setStage4Title(cd.stage4Title);
    if (cd.datetimeTitle) setStage4Title(cd.datetimeTitle);
    if (cd.stage5Title) setStage5Title(cd.stage5Title);
    if (cd.foodTitle) setStage5Title(cd.foodTitle);
    if (cd.giftTitle) setGiftTitle(cd.giftTitle);
    if (cd.drinkTitle) setGiftTitle(cd.drinkTitle);
    if (cd.finalTitle) setFinalTitle(cd.finalTitle);
    if (cd.finalSubtitle) setFinalSubtitle(cd.finalSubtitle);
    if (cd.finalMessage) setFinalSubtitle(cd.finalMessage);
    if (cd.signOffText) setSignOffText(cd.signOffText);
    if (cd.locationOptions) setLocationOptions(cd.locationOptions);
    if (cd.foodOptions) setFoodOptions(cd.foodOptions);
    if (cd.drinkOptions) setDrinkOptions(cd.drinkOptions);
    if (cd.generalAudioUrl) setGeneralAudioUrl(cd.generalAudioUrl);
    if (cd.stage1Background) setStage1Background(cd.stage1Background);
    if (cd.stage1Accent) setStage1Accent(cd.stage1Accent);
    if (cd.stage2Background) setStage2Background(cd.stage2Background);

    const loadedTemplateKey = `${template?.component_key ?? ""} ${template?.name ?? ""}`.toLowerCase();
    if (loadedTemplateKey.includes("valentine-2") || loadedTemplateKey.includes("valentine #2")) {
      setValentine2Config((current) => ({
        ...current,
        anniversaryCode: cd.anniversaryCode ?? current.anniversaryCode,
        musicUrl: cd.musicUrl ?? current.musicUrl,
        coverTitle: cd.coverTitle ?? current.coverTitle,
        page1Image: cd.page1Image ?? current.page1Image,
        page1Text: cd.page1Text ?? current.page1Text,
        polaroids: Array.isArray(cd.polaroids) && cd.polaroids.length > 0 ? cd.polaroids : current.polaroids,
        page2Text: cd.page2Text ?? current.page2Text,
        page3Hint: cd.page3Hint ?? current.page3Hint,
        confessionText: cd.confessionText ?? current.confessionText,
      }));
    }

    if (cd.previewStep) setDating2Config(cd);

    
    // Birthday Magic specific
    if (cd.birthdayMessage) setBirthdayMessage(cd.birthdayMessage);
    if (cd.musicUrl) setGeneralAudioUrl(cd.musicUrl);
      if (cd.expiresAtDate) setExpiresAtDate(cd.expiresAtDate);
    if (cd.imageUrl) setStage1ImageUrl(cd.imageUrl);
    if (cd.age) setBirthdayAge(String(cd.age));
    if (cd.memories) setBirthdayMemories(cd.memories);
    
    if (cd.instructionText) setBirthdayInstructionText(cd.instructionText);
    if (cd.wishPromptText) setBirthdayWishPromptText(cd.wishPromptText);
    if (cd.wishAcceptButton) setBirthdayWishAcceptButton(cd.wishAcceptButton);
    if (cd.wishDeclineButton) setBirthdayWishDeclineButton(cd.wishDeclineButton);
    if (cd.recordingText) setBirthdayRecordingText(cd.recordingText);
    if (cd.recordingCompleteButton) setBirthdayRecordingCompleteButton(cd.recordingCompleteButton);
    if (cd.giftPromptText) setBirthdayGiftPromptText(cd.giftPromptText);
    if (cd.balloonText) setBirthdayBalloonText(cd.balloonText);
    if (cd.greetingCardSignature) setBirthdayGreetingCardSignature(cd.greetingCardSignature);
    if (cd.final3DSignature) setBirthdayFinal3DSignature(cd.final3DSignature);
    setDynamicData(cd);
    
    setIsLocked(cd.isLocked ?? false);
    setEditUnlockCount(cd.editUnlockCount ?? 0);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const orderIsLocked = !!result && !result.unlocked;
  const showSetupWorkspace = !result || result.unlocked;

  return (
    <div className={showSetupWorkspace ? "grid items-start gap-6 xl:grid-cols-[1fr_460px]" : "grid items-start gap-6"}>
      <div className="grid content-start gap-5">
        <Section title="Thông tin đơn" className={`relative z-50 ${orderIsLocked ? "pointer-events-none opacity-60" : ""}`}>
          <TextInput label="Tên khách mua" onChange={setBuyerName} value={buyerName} />
          <TextInput label="TikTok / SĐT khách" onChange={setBuyerContact} value={buyerContact} />
          
          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="text-white/64">Gói dịch vụ (Tính giá)</span>
            <select
              className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none focus:border-pink-300/50 text-white disabled:opacity-50"
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              disabled={!!result}
            >
              {SERVICE_PACKAGES.map((pkg) => (
                <option key={pkg.id} value={pkg.id} className="text-black">
                  {pkg.label}
                </option>
              ))}
            </select>
          </label>

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
              <ul className="absolute left-0 top-[76px] z-50 max-h-60 w-full overflow-y-auto rounded-xl border border-white/20 bg-white shadow-2xl text-gray-800">
                {filteredTemplates.length === 0 ? (
                  <li className="px-4 py-3 text-gray-500">Không tìm thấy mẫu nào phù hợp.</li>
                ) : (
                  filteredTemplates.map((template) => {
                    const isSelected = template.id === selectedTemplateId;
                    return (
                      <li
                        key={template.id}
                        className={`cursor-pointer rounded-lg px-4 py-3 transition hover:bg-gray-100 ${isSelected ? "bg-pink-50 text-pink-600" : ""}`}
                        onClick={() => {
                          setSelectedTemplateId(template.id);
                          setTemplateSearch(template.name);
                          setIsDropdownOpen(false);

                          // Load defaults manually so it doesn't overwrite loadOrder
                          const rawKey = template.component_key ?? "";
                          const templateName = template.name?.toLowerCase() ?? "";
                          const isDating = rawKey.includes("will-you-date-me") || templateName.includes("date me") || templateName.includes("dating");

                          if (isDating) {
                            setStage1Instruction("Xin chào xinh đẹp...");
                            setQuestion("Bạn có muốn đi chơi cùng mình không?");
                            setGiftAcceptButton("CÓ! ♥");
                            setGiftDeclineButton("KHÔNG! ☹\nThật sao?\nBạn chắc chứ?\nSuy nghĩ lại đi!\nCơ hội cuối cùng...\nĐừng ngại!\nNói đồng ý đi nào!");
                            setStage2Title("Yayyy!!! 🌸");
                            setStage2Subtitle("Mình rất háo hức được gặp bạn!");
                            setStage3Title("Bạn muốn đi đâu nè?");
                            setLocationOptions(["Cà phê ☕", "Đi ăn 🍽️", "Xem phim 🎬", "Công viên 🌳", "Mua sắm 🛍️", "Lượn phố 🏙️"]);
                            setStage4Title("Khi nào thì bạn rảnh nè?");
                            setStage5Title("Bạn muốn ăn gì nè 😋");
                            setFoodOptions(["Bún đậu", "Phở", "Bún bò", "Mỳ Quảng", "Mỳ cay", "Xiên bẩn"]);
                            setGiftTitle("Bạn muốn uống gì?");
                            setDrinkOptions(["Cà phê", "Trà", "Trà Sữa", "Trà Matcha", "Sinh tố", "Nước ép"]);
                            setFinalTitle("Đã xong! 💕");
                            setFinalSubtitle("Mình rất mong được gặp bạn! Buổi hẹn của chúng ta sẽ thật hoàn hảo.");
                            setSignOffText("Thương mến");
                            setStage1Background(""); // backgroundImage
                            setStage2Background("#fff0f6"); // backgroundColor
                            setStage1Accent("#f43f5e"); // accentColor
                          } else if (rawKey.includes("birthday") || templateName.includes("birthday")) {
                            setStage1Background("");
                            setStage2Background("#16081d");
                            setStage1Accent("#a855f7");
                          } else {
                            setStage1Instruction("Nối các ngôi sao");
                            setQuestion("Em có đồng ý cùng anh viết tiếp câu chuyện này không?");
                            setGiftAcceptButton("Lên đồ thôi!");
                            setGiftDeclineButton("Để khi khác");
                            setStage2Title("Quỹ Đạo Hỗn Loạn");
                            setStage2Subtitle("Từ trường đang nhiễu loạn. Hãy kéo các vì sao về đúng quỹ đạo.");
                            setStage3Title("Chòm Sao Thanh Âm");
                            setStage4Title("Thời gian hẹn");
                            setStage5Title("Món ăn yêu thích");
                            setGiftTitle("Thư Mời Hẹn Hò");
                            setFinalTitle("Happy Valentine's Day!");
                            setFinalSubtitle("Cảm ơn vì đã là ngoại lệ tuyệt vời nhất của nhau.");
                            setSignOffText("Thương mến");
                            setStage1Background("#05020a");
                            setStage2Background("#05020a");
                            setStage1Accent("#ec4899");
                          }
                        }}
                      >
                          <p className="font-semibold">{template.name}</p>
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
            <label className="mb-2 block text-sm font-semibold opacity-90">Nhạc nền (General)</label>
            <select
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 outline-none focus:border-pink-500/50"
              value={generalAudioUrl}
              onChange={(e) => setGeneralAudioUrl(e.target.value)}
            >
              <option value="" className="text-gray-900">Mặc định (Random theo template)</option>
              {GENERAL_SONGS.map(song => (
                <option key={song} value={song} className="text-gray-900">
                  {song.split('/').pop()?.replace('_128k.mp3', '').replace('.mp3', '')}
                </option>
              ))}
            </select>
          </div>

            <div className="md:col-span-2 mt-4">
              <label className="mb-2 block text-sm font-semibold opacity-90">Ngày hết hạn đơn (Mặc định 10 ngày)</label>
              <input
                type="date"
                value={expiresAtDate}
                onChange={(e) => setExpiresAtDate(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 outline-none focus:border-pink-500/50 text-slate-900"
              />
              <p className="text-xs text-slate-500 mt-2">Sau ngày này, toàn bộ dữ liệu đơn sẽ bị xóa để tiết kiệm dung lượng. Các thông tin nhật ký, thống kê vẫn được giữ nguyên.</p>
            </div>

          <div className="md:col-span-2">
            {!result ? (
              <button className="w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 text-sm font-semibold disabled:opacity-50" disabled={isSubmitting} onClick={createOrder} type="button">
                {isSubmitting ? "Đang tạo đơn..." : "Tạo đơn"}
              </button>
            ) : null}
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
            <div className="mt-4 space-y-3 pr-2">
              {myOrders.length ? myOrders.slice((orderPage - 1) * ordersPerPage, orderPage * ordersPerPage).map((order) => {
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
                      <div className="flex items-center gap-2">
                        {order.custom_data?.isLocked ? (
                          <div className="flex items-center justify-center rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-[11px] leading-none font-bold text-yellow-600 dark:text-yellow-500">
                            🔒 Đã chốt
                          </div>
                        ) : null}
                        {paid ? (
                          <div
                            onClick={() => loadOrder(order)}
                            className="cursor-pointer flex items-center justify-center rounded-full bg-pink-500/10 border border-pink-500/20 px-3 py-1 text-[11px] leading-none font-bold text-pink-500 hover:bg-pink-500/20 transition-colors"
                          >
                            {order.custom_data?.isLocked ? "Sửa tiếp" : "Sửa"}
                          </div>
                        ) : (
                          <div
                            onClick={() => loadOrder(order)}
                            className="cursor-pointer flex items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 text-[11px] leading-none font-bold text-yellow-600 dark:text-yellow-500 hover:bg-yellow-500/20 transition-colors"
                          >
                            Xem QR / Thanh toán
                          </div>
                        )}
                        <div className={`flex items-center justify-center rounded-full border px-3 py-1 text-[11px] leading-none font-bold ${paid ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "border-pink-200 bg-pink-50 text-pink-500 dark:border-pink-500/20 dark:bg-pink-500/10"}`}>
                          {paid ? "Đã thanh toán" : "Chờ thanh toán"}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                      <p><span className="text-white/48">Khách:</span> {order.buyer_name || "Chưa nhập"}</p>
                      <p><span className="text-white/48">Người nhận:</span> {order.recipient_name || "Chưa nhập"}</p>
                      <p><span className="text-white/48">Số tiền:</span> <b>{money(order.amount)}</b></p>
                      <p><span className="text-white/48">Mã CK:</span> <b className="text-pink-100">{payment?.payment_code ?? "Chưa có"}</b></p>
                    </div>
                    <p className="mt-3 text-xs text-white/48">
                      Tạo lúc {new Date(order.created_at).toLocaleString("vi-VN")}
                    </p>
                  </article>
                );
              }) : (
                <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.04] p-6 text-sm text-white/54">
                  Chưa có đơn nào. Tạo đơn đầu tiên xong danh sách sẽ tự hiện ở đây.
                </div>
              )}
            </div>
            
            {myOrders.length > ordersPerPage && (
              <div className="mt-5 flex items-center justify-center gap-3 border-t border-white/5 pt-4">
                <button 
                  onClick={() => setOrderPage(p => Math.max(1, p - 1))}
                  disabled={orderPage === 1}
                  className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition"
                  type="button"
                >
                  Trước
                </button>
                <span className="text-xs text-white/60 font-medium">
                  Trang {orderPage} / {Math.ceil(myOrders.length / ordersPerPage)}
                </span>
                <button 
                  onClick={() => setOrderPage(p => Math.min(Math.ceil(myOrders.length / ordersPerPage), p + 1))}
                  disabled={orderPage >= Math.ceil(myOrders.length / ordersPerPage)}
                  className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition"
                  type="button"
                >
                  Tiếp
                </button>
              </div>
            )}
          </section>
        ) : null}

        {canEditTemplate ? (
          isLocked ? (
            <div className="rounded-3xl border border-yellow-400/30 bg-yellow-500/10 p-8 md:p-12 text-center flex flex-col items-center shadow-lg backdrop-blur-sm mx-auto max-w-2xl mt-4">
              <div className="text-6xl mb-6 drop-shadow-md">🔒</div>
              <h3 className="text-2xl md:text-3xl font-black text-yellow-500 tracking-tight">Đơn đã bị khóa!</h3>
              <p className="mt-4 text-sm md:text-base text-yellow-600/90 font-medium max-w-md leading-relaxed mb-8">
                Đơn này đã được chốt xong và khóa lại để tránh chỉnh sửa nhầm. Nếu muốn tiếp tục sửa, bạn phải mở khóa đơn.
              </p>
              <button
                className="rounded-full bg-gradient-to-b from-yellow-400 to-orange-500 px-10 py-4 text-sm font-bold text-white shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all"
                onClick={handleUnlock}
                type="button"
              >
                Mở khóa để sửa
              </button>
            </div>
          ) : (
          <>
            {isBirthdayMagic ? (
              <>
                <Section title="Khối 1: Giao diện Bánh kem & Thắp nến">
                  <TextInput label="Độ tuổi (Cắm nến số)" onChange={setBirthdayAge} value={birthdayAge} />
                  <TextInput label="Dòng chữ nổi trên bánh (Bong bóng 3D)" onChange={setBirthdayBalloonText} value={birthdayBalloonText} />
                  <MediaInput label="Ảnh/Video in trên thân bánh" onChange={(url) => setStage1ImageUrl(url)} />
                  <MediaInput label="Nhạc nền tổng thể" accept="audio/*" onChange={(url) => setGeneralAudioUrl(url)} />
                  <div className="md:col-span-2">
                    <TextInput label="Chỉ dẫn thắp nến" onChange={setBirthdayInstructionText} value={birthdayInstructionText} />
                  </div>
                </Section>
                <Section title="Khối 2: Lời chúc & Thực hiện điều ước">
                  <TextInput label="Chữ ký trên thiệp chúc mừng (Từ: ...)" onChange={setBirthdayGreetingCardSignature} value={birthdayGreetingCardSignature} />
                  <TextInput label="Tiêu đề gợi ý điều ước" onChange={setBirthdayWishPromptText} value={birthdayWishPromptText} />
                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <TextInput label="Nút đồng ý ước" onChange={setBirthdayWishAcceptButton} value={birthdayWishAcceptButton} />
                    <TextInput label="Nút từ chối ước (Sẽ bỏ chạy khi trỏ chuột)" onChange={setBirthdayWishDeclineButton} value={birthdayWishDeclineButton} />
                  </div>
                  <TextInput label="Trạng thái khi đang ghi âm" onChange={setBirthdayRecordingText} value={birthdayRecordingText} />
                  <TextInput label="Nút hoàn tất ghi âm" onChange={setBirthdayRecordingCompleteButton} value={birthdayRecordingCompleteButton} />
                </Section>
                <Section title="Khối 3: Chờ mở hộp quà">
                  <div className="md:col-span-2">
                    <TextInput label="Chỉ dẫn mở hộp quà" onChange={setBirthdayGiftPromptText} value={birthdayGiftPromptText} />
                  </div>
                </Section>
                <Section title="Khối 4: Hành Trình Kỉ Niệm">
                  <MemoryArrayInput label="Danh sách ảnh trôi dọc theo dây (Camera sẽ trôi qua từng tấm)" values={birthdayMemories} onChange={setBirthdayMemories} />
                  <div className="md:col-span-2">
                    <TextArea label="Lời chúc cuối cùng (Thả nổi 3D khổng lồ ở trạm dừng cuối)" onChange={setBirthdayMessage} value={birthdayMessage} />
                  </div>
                  <div className="md:col-span-2">
                    <TextInput label="Chữ ký nổi 3D (- Từ ... -)" onChange={setBirthdayFinal3DSignature} value={birthdayFinal3DSignature} />
                  </div>
                </Section>
              </>
            ) : isDating2 ? (
              <>

                <Section title="Bước 1: Mật mã mở khóa">
                  <TextInput label="Mật mã mở khóa (4 số)" value={dating2Config.pinCode} onChange={(v) => setDating2Config({ ...dating2Config, pinCode: v })} />
                  <TextInput label="Tiêu đề nhập mật khẩu" value={dating2Config.loginTitle || "Nhập Mật Khẩu"} onChange={(v) => setDating2Config({ ...dating2Config, loginTitle: v })} />
                  <TextInput label="Dòng gợi ý mật khẩu" value={dating2Config.loginHint || "(Gợi ý: {pin})"} onChange={(v) => setDating2Config({ ...dating2Config, loginHint: v })} />
                  <TextInput label="Thông báo sai mật khẩu" value={dating2Config.loginErrorText || "Sai mật khẩu rồi!"} onChange={(v) => setDating2Config({ ...dating2Config, loginErrorText: v })} />
                  <TextInput label="Tên người nhận (để xưng hô)" value={recipientName} onChange={setRecipientName} />
                  <ColorInput label="Màu nền (bắt đầu gradient)" value={dating2Config.bgFrom} onCommit={(v) => setDating2Config({ ...dating2Config, bgFrom: v })} />
                  <ColorInput label="Màu nền (kết thúc gradient)" value={dating2Config.bgTo} onCommit={(v) => setDating2Config({ ...dating2Config, bgTo: v })} />
                </Section>
                <Section title="Bước 2: Dò đài Radio">
                  <TextInput label="Gợi ý dò đài Radio" value={dating2Config.radioHint} onChange={(v) => setDating2Config({ ...dating2Config, radioHint: v })} />
                  <MediaInput label="Link nhạc nền chung (.mp3)" accept="audio/*" onChange={(url) => setGeneralAudioUrl(url)} />
                </Section>
                <Section title="Bước 3: Tâm trạng">
                  <TextArea label="Tiêu đề hỏi thăm" value={dating2Config.vibeTitle} onChange={(v) => setDating2Config({ ...dating2Config, vibeTitle: v })} />
                  <TextInput label="Câu tooltip dỗ dành" value={dating2Config.vibeTooltip} onChange={(v) => setDating2Config({ ...dating2Config, vibeTooltip: v })} />
                  <div className="md:col-span-2">
                     <ArrayInput label="Các lựa chọn tâm trạng" values={dating2Config.vibeOptions} onChange={(v) => setDating2Config({ ...dating2Config, vibeOptions: v })} />
                  </div>
                </Section>
                <Section title="Bước 4: Thẻ cào">
                  <TextInput label="Tiêu đề thẻ cào" value={dating2Config.scratchTitle} onChange={(v) => setDating2Config({ ...dating2Config, scratchTitle: v })} />
                  <TextInput label="Phụ đề (HD cào)" value={dating2Config.scratchSubtitle} onChange={(v) => setDating2Config({ ...dating2Config, scratchSubtitle: v })} />
                  <TextArea label="Phần thưởng sau lớp cào" value={dating2Config.scratchPrize} onChange={(v) => setDating2Config({ ...dating2Config, scratchPrize: v })} />
                  <TextInput label="Nút bấm nhận quà" value={dating2Config.scratchBtn} onChange={(v) => setDating2Config({ ...dating2Config, scratchBtn: v })} />
                </Section>
                <Section title="Bước 5: Vòng quay">
                  <TextInput label="Tiêu đề vòng quay" value={dating2Config.wheelTitle} onChange={(v) => setDating2Config({ ...dating2Config, wheelTitle: v })} />
                  <ArrayInput label="Các tùy chọn trên vòng quay" values={dating2Config.wheelOptions} onChange={(v) => setDating2Config({ ...dating2Config, wheelOptions: v })} />
                </Section>

                <Section title="Bước 6: Thời gian">
                  <TextInput label="Tiêu đề thời gian" value={dating2Config.dtTitle} onChange={(v) => setDating2Config({ ...dating2Config, dtTitle: v })} />
                  <TextInput label="Nút hoàn tất chọn giờ" value={dating2Config.dtBtn} onChange={(v) => setDating2Config({ ...dating2Config, dtBtn: v })} />
                  <div className="md:col-span-2">
                     <ArrayInput label="Các tùy chọn Ngày" values={dating2Config.dtDates} onChange={(v) => setDating2Config({ ...dating2Config, dtDates: v })} />
                     <div className="h-4" />
                     <ArrayInput label="Các tùy chọn Giờ" values={dating2Config.dtTimes} onChange={(v) => setDating2Config({ ...dating2Config, dtTimes: v })} />
                  </div>
                </Section>
                <Section title="Bước 7: Lá thư chốt đơn">
                  <TextInput label="Tiêu đề lá thư" value={dating2Config.finaleLetterTitle} onChange={(v) => setDating2Config({ ...dating2Config, finaleLetterTitle: v })} />
                  <TextInput label="Tên người gửi (ký tên cuối thư)" value={senderName} onChange={setSenderName} />
                  <TextArea label="Nội dung lá thư" value={dating2Config.finaleLetterBody} onChange={(v) => setDating2Config({ ...dating2Config, finaleLetterBody: v })} />
                  <TextInput label="Nút bấm Từ Chối" value={dating2Config.finaleBtnNo} onChange={(v) => setDating2Config({ ...dating2Config, finaleBtnNo: v })} />
                  <TextInput label="Nút bấm Đồng Ý" value={dating2Config.finaleBtnYes} onChange={(v) => setDating2Config({ ...dating2Config, finaleBtnYes: v })} />
                  <TextInput label="Lời nhắn chốt đơn thành công" value={dating2Config.finaleBtnSuccess} onChange={(v) => setDating2Config({ ...dating2Config, finaleBtnSuccess: v })} />
                </Section>
              </>
            ) : isDating3 ? (
              <>
                <Section title="Bước 1: Cỗ Máy Xèng">
                  <TextInput label="Tiêu đề chính 1" value={dating3Config.step1Title1} onChange={(v) => setDating3Config({ ...dating3Config, step1Title1: v })} />
                  <TextInput label="Tiêu đề chính 2 (khi nhận xu)" value={dating3Config.step1Title2} onChange={(v) => setDating3Config({ ...dating3Config, step1Title2: v })} />
                  <TextInput label="Tiêu đề phụ 1" value={dating3Config.step1Sub1} onChange={(v) => setDating3Config({ ...dating3Config, step1Sub1: v })} />
                  <TextInput label="Tiêu đề phụ 2" value={dating3Config.step1Sub2} onChange={(v) => setDating3Config({ ...dating3Config, step1Sub2: v })} />
                  <TextInput label="Tooltip 1 (Nhét xu)" value={dating3Config.step1Tooltip1} onChange={(v) => setDating3Config({ ...dating3Config, step1Tooltip1: v })} />
                  <TextInput label="Tooltip 2 (Vặn núm)" value={dating3Config.step1Tooltip2} onChange={(v) => setDating3Config({ ...dating3Config, step1Tooltip2: v })} />
                  <TextInput label="Chữ trên đồng xu" value={dating3Config.step1CoinText} onChange={(v) => setDating3Config({ ...dating3Config, step1CoinText: v })} />
                </Section>
                <Section title="Bước 2: Quả Trứng Gacha">
                  <TextInput label="Dòng chữ hướng dẫn" value={dating3Config.step4Title} onChange={(v) => setDating3Config({ ...dating3Config, step4Title: v })} />
                  <TextInput label="Tên vé VIP" value={dating3Config.step4CardTitle} onChange={(v) => setDating3Config({ ...dating3Config, step4CardTitle: v })} />
                  <TextInput label="Mô tả vé VIP" value={dating3Config.step4CardSub} onChange={(v) => setDating3Config({ ...dating3Config, step4CardSub: v })} />
                  <TextInput label="Nút tiếp tục" value={dating3Config.step4CardBtn} onChange={(v) => setDating3Config({ ...dating3Config, step4CardBtn: v })} />
                </Section>
                <Section title="Bước 3: Vòng Quay Vũ Trụ">
                  <TextInput label="Tiêu đề vòng quay" value={dating3Config.stepWheelTitle} onChange={(v) => setDating3Config({ ...dating3Config, stepWheelTitle: v })} />
                  <TextInput label="Phụ đề vòng quay" value={dating3Config.stepWheelSub} onChange={(v) => setDating3Config({ ...dating3Config, stepWheelSub: v })} />
                  <TextInput label="Nút bắt đầu quay" value={dating3Config.stepWheelBtn1} onChange={(v) => setDating3Config({ ...dating3Config, stepWheelBtn1: v })} />
                  <TextInput label="Dòng thông báo kết quả" value={dating3Config.stepWheelResultPrefix} onChange={(v) => setDating3Config({ ...dating3Config, stepWheelResultPrefix: v })} />
                  <TextInput label="Nút chuyển tiếp sau khi có kết quả" value={dating3Config.stepWheelBtn2} onChange={(v) => setDating3Config({ ...dating3Config, stepWheelBtn2: v })} />
                  <ColorInput label="Màu nền bắt đầu" value={dating3Config.wheelBgFrom} onCommit={(v) => setDating3Config({ ...dating3Config, wheelBgFrom: v })} />
                  <ColorInput label="Màu nền kết thúc" value={dating3Config.wheelBgTo} onCommit={(v) => setDating3Config({ ...dating3Config, wheelBgTo: v })} />
                  <div className="md:col-span-2">
                     <ArrayInput label="Các tùy chọn trên vòng quay" values={dating3Config.wheelOptions} onChange={(v) => setDating3Config({ ...dating3Config, wheelOptions: v })} />
                  </div>
                </Section>
                <Section title="Bước 4: Thời Gian Hẹn Hò">
                  <TextInput label="Tiêu đề trang" value={dating3Config.dtTitle} onChange={(v) => setDating3Config({ ...dating3Config, dtTitle: v })} />
                  <TextInput label="Phụ đề" value={dating3Config.dtSub} onChange={(v) => setDating3Config({ ...dating3Config, dtSub: v })} />
                  <TextInput label="Câu hỏi chọn ngày" value={dating3Config.dtDateLabel} onChange={(v) => setDating3Config({ ...dating3Config, dtDateLabel: v })} />
                  <TextInput label="Câu hỏi chọn giờ" value={dating3Config.dtTimeLabel} onChange={(v) => setDating3Config({ ...dating3Config, dtTimeLabel: v })} />
                  <TextInput label="Nút xác nhận" value={dating3Config.dtBtn} onChange={(v) => setDating3Config({ ...dating3Config, dtBtn: v })} />
                  <ColorInput label="Màu nền" value={dating3Config.dtBgColor} onCommit={(v) => setDating3Config({ ...dating3Config, dtBgColor: v })} />
                  <div className="md:col-span-2">
                     <ArrayInput label="Các tùy chọn Ngày" values={dating3Config.dtDates} onChange={(v) => setDating3Config({ ...dating3Config, dtDates: v })} />
                     <div className="h-4" />
                     <ArrayInput label="Các tùy chọn Giờ" values={dating3Config.dtTimes} onChange={(v) => setDating3Config({ ...dating3Config, dtTimes: v })} />
                  </div>
                </Section>
                <Section title="Bước 5: Lá Thư Cảm Xúc">
                  <TextArea label="Nội dung lá thư" value={dating3Config.step6LetterBody} onChange={(v) => setDating3Config({ ...dating3Config, step6LetterBody: v })} />
                  <TextInput label="Nút đóng dấu xác nhận" value={dating3Config.step6Btn} onChange={(v) => setDating3Config({ ...dating3Config, step6Btn: v })} />
                </Section>
                <Section title="Bước 6: Xác Nhận Cuối Cùng">
                  <TextInput label="Tiêu đề trên cùng (nhỏ)" value={dating3Config.step7Title} onChange={(v) => setDating3Config({ ...dating3Config, step7Title: v })} />
                  <TextInput label="Tiêu đề chính" value={dating3Config.step7Title2} onChange={(v) => setDating3Config({ ...dating3Config, step7Title2: v })} />
                  <TextArea label="Câu hỏi xác nhận (Dùng {time}, {date}, {location} để tự động chèn)" value={dating3Config.step7Sub} onChange={(v) => setDating3Config({ ...dating3Config, step7Sub: v })} />
                  <TextInput label="Nút Đồng Ý" value={dating3Config.step7BtnYes} onChange={(v) => setDating3Config({ ...dating3Config, step7BtnYes: v })} />
                  <ColorInput label="Màu nền" value={dating3Config.step7Bg} onCommit={(v) => setDating3Config({ ...dating3Config, step7Bg: v })} />
                  <div className="md:col-span-2 mt-2">
                    <ArrayInput 
                      label="Các câu từ chối (Nhảy thay đổi ngẫu nhiên)" 
                      onChange={(arr) => setDating3Config({ ...dating3Config, step7BtnNoOptions: arr })} 
                      values={dating3Config.step7BtnNoOptions} 
                    />
                  </div>
                </Section>
                <Section title="Bước 7: Thành Công">
                  <TextInput label="Tiêu đề chúc mừng" value={dating3Config.step8Title} onChange={(v) => setDating3Config({ ...dating3Config, step8Title: v })} />
                  <TextInput label="Dòng nhắn nhủ thêm" value={dating3Config.step8Sub} onChange={(v) => setDating3Config({ ...dating3Config, step8Sub: v })} />
                  <TextInput label="Nút quay về" value={dating3Config.step8Btn} onChange={(v) => setDating3Config({ ...dating3Config, step8Btn: v })} />
                  <ColorInput label="Màu nền bắt đầu" value={dating3Config.step8BgFrom} onCommit={(v) => setDating3Config({ ...dating3Config, step8BgFrom: v })} />
                  <ColorInput label="Màu nền kết thúc" value={dating3Config.step8BgTo} onCommit={(v) => setDating3Config({ ...dating3Config, step8BgTo: v })} />
                </Section>
              </>
            ) : isWillYouDateMe ? (
              <>
                <div className="md:col-span-2 hidden">
                  {/* Keep to not break DOM diffing immediately, will be handled by FormStepNavigator */}
                </div>

                <Section title="Thiết lập chung" className={orderIsLocked ? "pointer-events-none opacity-60" : ""}>
                
                  <ColorInput label="Màu nền tổng thể" onCommit={setStage2Background} value={stage2Background} />
                  <ColorInput label="Màu nhấn (Nút, Tiêu đề)" onCommit={setStage1Accent} value={stage1Accent} />
                  <MediaInput label="Ảnh nền trang (Tùy chọn)" onChange={setStage1Background} />
                  <ThemeMusicSelector theme={getThemeFromComponentKey(selectedComponentKey)} label="Nhạc nền chung" value={generalAudioUrl} onChange={setGeneralAudioUrl} />
                </Section>
                <Section title="Bước 1: Lời mời">
                  <TextInput label="Tiêu đề lời mời" onChange={setStage1Instruction} value={stage1Instruction} />
                  <TextArea label="Nội dung lời mời" onChange={setQuestion} value={question} />
                  <TextInput label="Nút đồng ý" onChange={setGiftAcceptButton} value={giftAcceptButton} />
                  <div className="md:col-span-2 mt-2">
                    <ArrayInput 
                      label="Các câu từ chối (Nhảy nút khi hover)" 
                      onChange={(arr) => setGiftDeclineButton(arr.join('\n'))} 
                      values={giftDeclineButton ? giftDeclineButton.split('\n') : []} 
                    />
                  </div>
                </Section>
                <Section title="Bước 2: Phản hồi đồng ý">
                  <TextInput label="Tiêu đề vui sướng" onChange={setStage2Title} value={stage2Title} />
                  <TextArea label="Lời nhắn vui sướng" onChange={setStage2Subtitle} value={stage2Subtitle} />
                </Section>
                <Section title="Bước 3-6: Khảo sát lựa chọn">
                  <div className="md:col-span-2">
                    <TextInput label="Câu hỏi chọn địa điểm" onChange={setStage3Title} value={stage3Title} />
                    <div className="mt-4" />
                    <ArrayInput label="Các lựa chọn địa điểm" onChange={setLocationOptions} values={locationOptions} />
                  </div>
                  
                  <div className="md:col-span-2">
                    <TextInput label="Câu hỏi chọn ngày giờ" onChange={setStage4Title} value={stage4Title} />
                  </div>
                  
                  <div className="md:col-span-2">
                    <TextInput label="Câu hỏi chọn món ăn" onChange={setStage5Title} value={stage5Title} />
                    <div className="mt-4" />
                    <ArrayInput label="Các lựa chọn món ăn" onChange={setFoodOptions} values={foodOptions} />
                  </div>
                  
                  <div className="md:col-span-2">
                    <TextInput label="Câu hỏi chọn đồ uống" onChange={setGiftTitle} value={giftTitle} />
                    <div className="mt-4" />
                    <ArrayInput label="Các lựa chọn đồ uống" onChange={setDrinkOptions} values={drinkOptions} />
                  </div>
                </Section>
                <Section title="Bước 7: Chốt đơn">
                  <TextInput label="Tiêu đề kết thúc" onChange={setFinalTitle} value={finalTitle} />
                  <TextArea label="Lời nhắn cuối cùng" onChange={setFinalSubtitle} value={finalSubtitle} />
                  <TextInput label="Chữ ký (VD: Thương mến)" onChange={setSignOffText} value={signOffText} />
                </Section>
              </>
            ) : isValentine2 ? (
              <>
                <Section title="Bước 1: Cuốn Sổ Kỷ Niệm">
                  <ThemeMusicSelector theme={getThemeFromComponentKey(selectedComponentKey)} label="Nhạc nền (.mp3)" value={valentine2Config.musicUrl} onChange={(url) => setValentine2Config({ ...valentine2Config, musicUrl: url })} />
                  <TextInput label="Tiêu đề bìa" value={valentine2Config.coverTitle} onChange={(v) => setValentine2Config({ ...valentine2Config, coverTitle: v })} />
                  <MediaInput label="Ảnh ngoài bìa" accept="image/*,video/*" onChange={(url) => setValentine2Config({ ...valentine2Config, coverImage: url })} />
                  <MediaInput label="Ảnh trang 1" accept="image/*,video/*" onChange={(url) => setValentine2Config({ ...valentine2Config, page1Image: url })} />
                  <TextArea label="Lời nhắn trang 1" value={valentine2Config.page1Text} onChange={(v) => setValentine2Config({ ...valentine2Config, page1Text: v })} />
                  
                  <div className="md:col-span-2 space-y-4 mt-4">
                    <span className="text-white/64 text-sm font-semibold block border-b border-white/10 pb-2">Ảnh Polaroid (Tối đa 3 ảnh)</span>
                    {valentine2Config.polaroids.map((p, idx) => (
                      <div key={p.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl relative border border-white/10">
                        <button type="button" onClick={() => setValentine2Config({ ...valentine2Config, polaroids: valentine2Config.polaroids.filter(item => item.id !== p.id) })} className="absolute top-2 right-2 text-xs text-red-400 hover:text-red-300">Xóa</button>
                        <MediaInput label={`Ảnh Polaroid ${idx + 1}`} accept="image/*,video/*" onChange={(url) => {
                          const newPolaroids = [...valentine2Config.polaroids];
                          newPolaroids[idx].src = url;
                          setValentine2Config({ ...valentine2Config, polaroids: newPolaroids });
                        }} />
                        <TextInput label="Ghi chú ảnh" value={p.caption} onChange={(v) => {
                          const newPolaroids = [...valentine2Config.polaroids];
                          newPolaroids[idx].caption = v;
                          setValentine2Config({ ...valentine2Config, polaroids: newPolaroids });
                        }} />
                      </div>
                    ))}
                    {valentine2Config.polaroids.length < 3 && (
                      <button type="button" onClick={() => setValentine2Config({ ...valentine2Config, polaroids: [...valentine2Config.polaroids, { id: Date.now(), src: "", caption: "Kỷ niệm mới" }] })} className="px-4 py-2 bg-white/10 text-white text-sm rounded-xl font-semibold hover:bg-white/20">
                        + Thêm Polaroid
                      </button>
                    )}
                  </div>

                  <div className="md:col-span-2 mt-4 pt-4 border-t border-white/10">
                    <TextArea label="Lời nhắn trang 2" value={valentine2Config.page2Text} onChange={(v) => setValentine2Config({ ...valentine2Config, page2Text: v })} />
                    <div className="mt-4" />
                    <TextInput label="Gợi ý kéo ruy băng" value={valentine2Config.page3Hint} onChange={(v) => setValentine2Config({ ...valentine2Config, page3Hint: v })} />
                  </div>
                </Section>
                <Section title="Bước 2: Lời Ngỏ Thư Tay">
                  <TextArea label="Nội dung lời ngỏ (Popup)" value={valentine2Config.confessionText} onChange={(v) => setValentine2Config({ ...valentine2Config, confessionText: v })} />
                </Section>
            
              </>
            ) : isBirthday2 ? (
              <>
                <Section title="Đoạn - Step1Alarm">
                  <TextInput label={"Thứ 2, ngày 14 tháng 2"} value={dynamicData.Th2ngy14thng2 || "Thứ 2, ngày 14 tháng 2"} onChange={(v) => setDynamicData(d => ({ ...d, Th2ngy14thng2: v }))} />
                  <TextInput label={"alarm"} value={dynamicData.alarm || "alarm"} onChange={(v) => setDynamicData(d => ({ ...d, alarm: v }))} />
                  <TextInput label={"Báo thức"} value={dynamicData.Bothc || "Báo thức"} onChange={(v) => setDynamicData(d => ({ ...d, Bothc: v }))} />
                  <TextInput label={"Dậy thôi lợn con ơi! 🐷"} value={dynamicData.Dythilnconi || "Dậy thôi lợn con ơi! 🐷"} onChange={(v) => setDynamicData(d => ({ ...d, Dythilnconi: v }))} />
                  <TextInput label={"Vuốt để tắt báo thức"} value={dynamicData.Vutttbothc || "Vuốt để tắt báo thức"} onChange={(v) => setDynamicData(d => ({ ...d, Vutttbothc: v }))} />
                </Section>
                <Section title="Đoạn - Step2FakeChat">
                  <TextInput label={"Back"} value={dynamicData.Back || "Back"} onChange={(v) => setDynamicData(d => ({ ...d, Back: v }))} />
                  <TextInput label={"Người ấy &gt;"} value={dynamicData.Ngiygt || "Người ấy &gt;"} onChange={(v) => setDynamicData(d => ({ ...d, Ngiygt: v }))} />
                  <TextInput label={"Today 7:05 AM"} value={dynamicData.Today705AM || "Today 7:05 AM"} onChange={(v) => setDynamicData(d => ({ ...d, Today705AM: v }))} />
                  <TextInput label={"Chạm màn hình để đọc tiếp"} value={dynamicData.Chmmnhnhctip || "Chạm màn hình để đọc tiếp"} onChange={(v) => setDynamicData(d => ({ ...d, Chmmnhnhctip: v }))} />
                  <TextInput label={"Bấm gửi ngay!"} value={dynamicData.Bmgingay || "Bấm gửi ngay!"} onChange={(v) => setDynamicData(d => ({ ...d, Bmgingay: v }))} />
                  <TextInput label={"Hôm nay sinh nhật tớ mà 🥺"} value={dynamicData.Hmnaysinhnhttm || "Hôm nay sinh nhật tớ mà 🥺"} onChange={(v) => setDynamicData(d => ({ ...d, Hmnaysinhnhttm: v }))} />
                  <TextInput label={"iMessage"} value={dynamicData.iMessage || "iMessage"} onChange={(v) => setDynamicData(d => ({ ...d, iMessage: v }))} />
                </Section>
                <Section title="Đoạn - Step3Delivery">
                  <TextInput label={"Widget"} value={dynamicData.Widget || "Widget"} onChange={(v) => setDynamicData(d => ({ ...d, Widget: v }))} />
                  <TextInput label={"SHOPEE EXPRESS"} value={dynamicData.SHOPEEEXPRESS || "SHOPEE EXPRESS"} onChange={(v) => setDynamicData(d => ({ ...d, SHOPEEEXPRESS: v }))} />
                  <TextInput label={"now"} value={dynamicData.now || "now"} onChange={(v) => setDynamicData(d => ({ ...d, now: v }))} />
                  <TextArea label={"Bạn có một kiện hàng tối mật. Phí COD: 0đ. Yêu cầu"} value={dynamicData.Bncmtkinhngtimt || "Bạn có một kiện hàng tối mật. Phí COD: 0đ. Yêu cầu ký nhận!"} onChange={(v) => setDynamicData(d => ({ ...d, Bncmtkinhngtimt: v }))} />
                  <TextInput label={"Ký Nhận Điện Tử"} value={dynamicData.KNhninT || "Ký Nhận Điện Tử"} onChange={(v) => setDynamicData(d => ({ ...d, KNhninT: v }))} />
                  <TextInput label={"Vui lòng ký vào khung bên dưới"} value={dynamicData.Vuilngkvokhungb || "Vui lòng ký vào khung bên dưới"} onChange={(v) => setDynamicData(d => ({ ...d, Vuilngkvokhungb: v }))} />
                  <TextInput label={"Ký tên tại đây"} value={dynamicData.Ktntiy || "Ký tên tại đây"} onChange={(v) => setDynamicData(d => ({ ...d, Ktntiy: v }))} />
                  <TextInput label={"Mở Kiện Hàng ✨"} value={dynamicData.MKinHng || "Mở Kiện Hàng ✨"} onChange={(v) => setDynamicData(d => ({ ...d, MKinHng: v }))} />
                </Section>
                <Section title="Đoạn - Step4Unbox">
                  <TextInput label={"Xem Tiếp ✨"} value={dynamicData.XemTip || "Xem Tiếp ✨"} onChange={(v) => setDynamicData(d => ({ ...d, XemTip: v }))} />
                </Section>
                <Section title="Đoạn - Step5Cake">
                  <TextInput label={"Nói điều bạn muốn gửi gắm"} value={dynamicData.Niiubnmungigm || "Nói điều bạn muốn gửi gắm"} onChange={(v) => setDynamicData(d => ({ ...d, Niiubnmungigm: v }))} />
                  <TextInput label={"Bằng cách"} value={dynamicData.Bngcch || "Bằng cách"} onChange={(v) => setDynamicData(d => ({ ...d, Bngcch: v }))} />
                  <TextInput label={"nhấn giữ nút Mic"} value={dynamicData.nhngintMic || "nhấn giữ nút Mic"} onChange={(v) => setDynamicData(d => ({ ...d, nhngintMic: v }))} />
                  <TextInput label={"bên dưới"} value={dynamicData.bndi || "bên dưới"} onChange={(v) => setDynamicData(d => ({ ...d, bndi: v }))} />
                  <TextInput label={"Nhắm mắt lại, nghĩ về điều ước"} value={dynamicData.Nhmmtlinghviuc || "Nhắm mắt lại, nghĩ về điều ước"} onChange={(v) => setDynamicData(d => ({ ...d, Nhmmtlinghviuc: v }))} />
                  <TextInput label={"và"} value={dynamicData.v || "và"} onChange={(v) => setDynamicData(d => ({ ...d, v: v }))} />
                  <TextInput label={"giữ lỳ vào ngọn nến"} value={dynamicData.gilvongnnn || "giữ lỳ vào ngọn nến"} onChange={(v) => setDynamicData(d => ({ ...d, gilvongnnn: v }))} />
                  <TextInput label={"để thổi nhé!"} value={dynamicData.thinh || "để thổi nhé!"} onChange={(v) => setDynamicData(d => ({ ...d, thinh: v }))} />
                  <TextInput label={"Đang ghi âm điều ước..."} value={dynamicData.angghimiuc || "Đang ghi âm điều ước..."} onChange={(v) => setDynamicData(d => ({ ...d, angghimiuc: v }))} />
                  <TextInput label={"Sẵn sàng ghi âm"} value={dynamicData.Snsngghim || "Sẵn sàng ghi âm"} onChange={(v) => setDynamicData(d => ({ ...d, Snsngghim: v }))} />
                </Section>
                <Section title="Đoạn - Step6Letter">
                  <TextInput label={"Mở quà thật 🎁"} value={dynamicData.Mqutht || "Mở quà thật 🎁"} onChange={(v) => setDynamicData(d => ({ ...d, Mqutht: v }))} />
                </Section>
                <Section title="Đoạn - Step7Climax">
                  <TextInput label={"Voucher Đặc Quyền"} value={dynamicData.VouchercQuyn || "Voucher Đặc Quyền"} onChange={(v) => setDynamicData(d => ({ ...d, VouchercQuyn: v }))} />
                  <TextArea label={"&quot;Tặng cậu 1 vé ăn sập thành phố đêm nay do tớ"} value={dynamicData.Tngcu1vnspthnhp || "&quot;Tặng cậu 1 vé ăn sập thành phố đêm nay do tớ bao trọn gói!&quot;"} onChange={(v) => setDynamicData(d => ({ ...d, Tngcu1vnspthnhp: v }))} />
                  <TextInput label={"Lên đồ thôi! 🛵"} value={dynamicData.Lnthi || "Lên đồ thôi! 🛵"} onChange={(v) => setDynamicData(d => ({ ...d, Lnthi: v }))} />
                </Section>
              </>

            ) : isBirthday3 ? (
              <>
                <Section title="Đoạn - Hóa đơn thanh toán">
                  <TextInput label={"Chọn Ngày Hẹn"} value={dynamicData.dtTitle || "Chọn Ngày Hẹn"} onChange={(v) => setDynamicData(d => ({ ...d, dtTitle: v }))} />
                  <TextInput label={"Để tớ chuẩn bị nha"} value={dynamicData.dtSub || "Để tớ chuẩn bị nha"} onChange={(v) => setDynamicData(d => ({ ...d, dtSub: v }))} />
                  <TextInput label={"Ngày nào hợp lý nhỉ?"} value={dynamicData.dtDateLabel || "Ngày nào hợp lý nhỉ?"} onChange={(v) => setDynamicData(d => ({ ...d, dtDateLabel: v }))} />
                  <TextInput label={"Mấy giờ thì tiện cho cậu?"} value={dynamicData.dtTimeLabel || "Mấy giờ thì tiện cho cậu?"} onChange={(v) => setDynamicData(d => ({ ...d, dtTimeLabel: v }))} />
                  <TextInput label={"CHỐT ĐƠN! 🎉"} value={dynamicData.dtBtn || "CHỐT ĐƠN! 🎉"} onChange={(v) => setDynamicData(d => ({ ...d, dtBtn: v }))} />
                  <TextInput label={"giftText"} value={dynamicData.giftText || "giftText"} onChange={(v) => setDynamicData(d => ({ ...d, giftText: v }))} />
                  <TextInput label={"A SPECIAL GIFT 💌"} value={dynamicData.doorSign || "A SPECIAL GIFT 💌"} onChange={(v) => setDynamicData(d => ({ ...d, doorSign: v }))} />
                  <TextInput label={"Chạm 3 lần để mở thư!"} value={dynamicData.doorInstruction || "Chạm 3 lần để mở thư!"} onChange={(v) => setDynamicData(d => ({ ...d, doorInstruction: v }))} />
                  <TextInput label={"Kéo xuống nhé!"} value={dynamicData.darkRoomText || "Kéo xuống nhé!"} onChange={(v) => setDynamicData(d => ({ ...d, darkRoomText: v }))} />
                  <TextInput label={"compact"} value={dynamicData.compact || "compact"} onChange={(v) => setDynamicData(d => ({ ...d, compact: v }))} />
                  <TextInput label={"autoPlay"} value={dynamicData.autoPlay || "autoPlay"} onChange={(v) => setDynamicData(d => ({ ...d, autoPlay: v }))} />
                  <TextInput label={"Chạm vào 3 quả bóng bay để xem điều bất ngờ!"} value={dynamicData.balloonText || "Chạm vào 3 quả bóng bay để xem điều bất ngờ!"} onChange={(v) => setDynamicData(d => ({ ...d, balloonText: v }))} />
                  <TextInput label={"Happy Birthday! 🌟"} value={dynamicData.cakeTitle || "Happy Birthday! 🌟"} onChange={(v) => setDynamicData(d => ({ ...d, cakeTitle: v }))} />
                  <TextArea label={"Nhắm mắt lại, chắp tay và ước một điều thật to lớn"} value={dynamicData.cakeInstruction || "Nhắm mắt lại, chắp tay và ước một điều thật to lớn đi nào!"} onChange={(v) => setDynamicData(d => ({ ...d, cakeInstruction: v }))} />
                  <TextInput label={"NHẤN GIỮ ĐỂ THỔI NẾN 🌬️"} value={dynamicData.blowBtn || "NHẤN GIỮ ĐỂ THỔI NẾN 🌬️"} onChange={(v) => setDynamicData(d => ({ ...d, blowBtn: v }))} />
                  <TextInput label={"Lời Chúc Từ Trái Tim"} value={dynamicData.cardTitle || "Lời Chúc Từ Trái Tim"} onChange={(v) => setDynamicData(d => ({ ...d, cardTitle: v }))} />
                  <TextInput label={"Lật thiệp"} value={dynamicData.cardBtn || "Lật thiệp"} onChange={(v) => setDynamicData(d => ({ ...d, cardBtn: v }))} />
                  <TextInput label={"Một năm qua cậu đã rực rỡ thế này cơ mà..."} value={dynamicData.memoryWish1 || "Một năm qua cậu đã rực rỡ thế này cơ mà..."} onChange={(v) => setDynamicData(d => ({ ...d, memoryWish1: v }))} />
                  <TextInput label={"Một năm qua cậu đã rực rỡ thế này cơ mà..."} value={dynamicData.memoryWish2 || "Một năm qua cậu đã rực rỡ thế này cơ mà..."} onChange={(v) => setDynamicData(d => ({ ...d, memoryWish2: v }))} />
                  <TextInput label={"Một năm qua cậu đã rực rỡ thế này cơ mà..."} value={dynamicData.memoryWish3 || "Một năm qua cậu đã rực rỡ thế này cơ mà..."} onChange={(v) => setDynamicData(d => ({ ...d, memoryWish3: v }))} />
                  <TextInput label={"Một năm qua cậu đã rực rỡ thế này cơ mà..."} value={dynamicData.memoryWish4 || "Một năm qua cậu đã rực rỡ thế này cơ mà..."} onChange={(v) => setDynamicData(d => ({ ...d, memoryWish4: v }))} />
                  <MediaInput label={"memory1"} onChange={(url) => setDynamicData(d => ({ ...d, memory1: url }))} />
                  <MediaInput label={"memory2"} onChange={(url) => setDynamicData(d => ({ ...d, memory2: url }))} />
                  <MediaInput label={"memory3"} onChange={(url) => setDynamicData(d => ({ ...d, memory3: url }))} />
                  <TextInput label={"Chạm liên tục để xé giấy gói nhé!"} value={dynamicData.giftInstruction || "Chạm liên tục để xé giấy gói nhé!"} onChange={(v) => setDynamicData(d => ({ ...d, giftInstruction: v }))} />
                  <TextInput label={"giftName"} value={dynamicData.giftName || "giftName"} onChange={(v) => setDynamicData(d => ({ ...d, giftName: v }))} />
                  <MediaInput label={"giftImage"} onChange={(url) => setDynamicData(d => ({ ...d, giftImage: url }))} />
                  <TextInput label={"NHẬN QUÀ NGAY 👗"} value={dynamicData.memoryBtn || "NHẬN QUÀ NGAY 👗"} onChange={(v) => setDynamicData(d => ({ ...d, memoryBtn: v }))} />
                </Section>
              </>

            ) : isSorry1 ? (
              <>
                <Section title="Đoạn - Khởi đầu (Phá Băng)">
                  <TextInput label={"đang giận tớ lắm đúng không...?"} value={dynamicData.iceTitle || "đang giận tớ lắm đúng không...?"} onChange={(v) => setDynamicData(d => ({ ...d, iceTitle: v }))} />
                  <TextArea label={"Bấm vào màn hình để đập vỡ lớp băng này nhé, lạnh "} value={dynamicData.iceSubtitle || "Bấm vào màn hình để đập vỡ lớp băng này nhé, lạnh quá..."} onChange={(v) => setDynamicData(d => ({ ...d, iceSubtitle: v }))} />
                  <TextInput label={"confessText"} value={dynamicData.confessText || "confessText"} onChange={(v) => setDynamicData(d => ({ ...d, confessText: v }))} />
                  <TextInput label={"Đúng, cậu rất đáng đòn! 😡"} value={dynamicData.confessBtn || "Đúng, cậu rất đáng đòn! 😡"} onChange={(v) => setDynamicData(d => ({ ...d, confessBtn: v }))} />
                </Section>
                <Section title="Đoạn - Vòng quay (Đền tội)">
                  <TextInput label={"Trà sữa 1 tuần"} value={dynamicData.wheelOpt1 || "Trà sữa 1 tuần"} onChange={(v) => setDynamicData(d => ({ ...d, wheelOpt1: v }))} />
                  <TextInput label={"Đấm 3 cái"} value={dynamicData.wheelOpt2 || "Đấm 3 cái"} onChange={(v) => setDynamicData(d => ({ ...d, wheelOpt2: v }))} />
                  <TextInput label={"Rửa bát 1 tháng"} value={dynamicData.wheelOpt3 || "Rửa bát 1 tháng"} onChange={(v) => setDynamicData(d => ({ ...d, wheelOpt3: v }))} />
                  <TextInput label={"Làm osin 1 ngày"} value={dynamicData.wheelOpt4 || "Làm osin 1 ngày"} onChange={(v) => setDynamicData(d => ({ ...d, wheelOpt4: v }))} />
                  <TextInput label={"Mua quà xịn"} value={dynamicData.wheelOpt5 || "Mua quà xịn"} onChange={(v) => setDynamicData(d => ({ ...d, wheelOpt5: v }))} />
                  <TextInput label={"Bao đi ăn tối"} value={dynamicData.wheelOpt6 || "Bao đi ăn tối"} onChange={(v) => setDynamicData(d => ({ ...d, wheelOpt6: v }))} />
                  <TextInput label={"Vòng Quay Đền Tội"} value={dynamicData.wheelTitle || "Vòng Quay Đền Tội"} onChange={(v) => setDynamicData(d => ({ ...d, wheelTitle: v }))} />
                  <TextArea label={"Trước khi tha lỗi, cho cậu quyền phạt tớ đấy! Quay"} value={dynamicData.wheelSubtitle || "Trước khi tha lỗi, cho cậu quyền phạt tớ đấy! Quay đi, tớ chịu hết!"} onChange={(v) => setDynamicData(d => ({ ...d, wheelSubtitle: v }))} />
                  <TextInput label={"QUAY NGAY"} value={dynamicData.wheelBtn || "QUAY NGAY"} onChange={(v) => setDynamicData(d => ({ ...d, wheelBtn: v }))} />
                  <TextInput label={"Tạm bớt giận 👉"} value={dynamicData.wheelNextBtn || "Tạm bớt giận 👉"} onChange={(v) => setDynamicData(d => ({ ...d, wheelNextBtn: v }))} />
                </Section>
                <Section title="Đoạn - Chốt hạ">
                  <MediaInput label={"memory1"} onChange={(url) => setDynamicData(d => ({ ...d, memory1: url }))} />
                  <MediaInput label={"memory2"} onChange={(url) => setDynamicData(d => ({ ...d, memory2: url }))} />
                  <MediaInput label={"memory3"} onChange={(url) => setDynamicData(d => ({ ...d, memory3: url }))} />
                  <TextArea label={"&quot;Tớ không muốn vì một phút ngu ngốc mà đánh m"} value={dynamicData.nostalgiaText || "&quot;Tớ không muốn vì một phút ngu ngốc mà đánh mất những nụ cười này...&quot;"} onChange={(v) => setDynamicData(d => ({ ...d, nostalgiaText: v }))} />
                  <TextInput label={"Xem tiếp"} value={dynamicData.nostalgiaBtn || "Xem tiếp"} onChange={(v) => setDynamicData(d => ({ ...d, nostalgiaBtn: v }))} />
                  <TextInput label={"letterText"} value={dynamicData.letterText || "letterText"} onChange={(v) => setDynamicData(d => ({ ...d, letterText: v }))} />
                  <TextInput label={"Chốt hạ"} value={dynamicData.letterBtn || "Chốt hạ"} onChange={(v) => setDynamicData(d => ({ ...d, letterBtn: v }))} />
                  <TextInput label={"Hiệp Ước Hòa Bình"} value={dynamicData.treatyTitle || "Hiệp Ước Hòa Bình"} onChange={(v) => setDynamicData(d => ({ ...d, treatyTitle: v }))} />
                  <TextInput label={"Quyết định nằm trong tay cậu. Xin hãy nương tay..."} value={dynamicData.treatySubtitle || "Quyết định nằm trong tay cậu. Xin hãy nương tay..."} onChange={(v) => setDynamicData(d => ({ ...d, treatySubtitle: v }))} />
                  <TextInput label={"Ký tên, tha mạng"} value={dynamicData.treatyBtnYes || "Ký tên, tha mạng"} onChange={(v) => setDynamicData(d => ({ ...d, treatyBtnYes: v }))} />
                  <TextInput label={"GIẬN TIẾP, KHÔNG THA 😤"} value={dynamicData.treatyBtnNo || "GIẬN TIẾP, KHÔNG THA 😤"} onChange={(v) => setDynamicData(d => ({ ...d, treatyBtnNo: v }))} />
                  <TextInput label={"Cảm ơn cậu! ❤️"} value={dynamicData.successTitle || "Cảm ơn cậu! ❤️"} onChange={(v) => setDynamicData(d => ({ ...d, successTitle: v }))} />
                  <TextInput label={"Tớ qua đón cậu đi ăn đền tội ngay đây!"} value={dynamicData.successDesc || "Tớ qua đón cậu đi ăn đền tội ngay đây!"} onChange={(v) => setDynamicData(d => ({ ...d, successDesc: v }))} />
                </Section>
              </>

            ) : isSorry2 ? (
              <>
                <Section title="Đoạn - Quyết định">
                  <TextArea label={"Người này đã làm bạn giận. Bạn có quyền được xả gi"} value={dynamicData.warnDesc || "Người này đã làm bạn giận. Bạn có quyền được xả giận ngay bây giờ!"} onChange={(v) => setDynamicData(d => ({ ...d, warnDesc: v }))} />
                  <TextInput label={"Bắt đầu xả giận"} value={dynamicData.warnBtn || "Bắt đầu xả giận"} onChange={(v) => setDynamicData(d => ({ ...d, warnBtn: v }))} />
                  <TextInput label={"Dép Lào"} value={dynamicData.weapon1 || "Dép Lào"} onChange={(v) => setDynamicData(d => ({ ...d, weapon1: v }))} />
                  <TextInput label={"Chổi chà"} value={dynamicData.weapon2 || "Chổi chà"} onChange={(v) => setDynamicData(d => ({ ...d, weapon2: v }))} />
                  <TextInput label={"Chọn Vũ Khí"} value={dynamicData.weaponTitle || "Chọn Vũ Khí"} onChange={(v) => setDynamicData(d => ({ ...d, weaponTitle: v }))} />
                  <MediaInput label={"gameTarget"} onChange={(url) => setDynamicData(d => ({ ...d, gameTarget: url }))} />
                  <TextInput label={"Á ui... đau quá!"} value={dynamicData.bandageTitle || "Á ui... đau quá!"} onChange={(v) => setDynamicData(d => ({ ...d, bandageTitle: v }))} />
                  <TextArea label={"&quot;Ui cha mẹ ơi... Đánh xong rồi, đằng ấy đã xả"} value={dynamicData.bandageDesc || "&quot;Ui cha mẹ ơi... Đánh xong rồi, đằng ấy đã xả hết giận chưa? Xót người ta chưa? 🥺 Nếu bớt giận rồi thì cho người ta giải thích nhé?&quot;"} onChange={(v) => setDynamicData(d => ({ ...d, bandageDesc: v }))} />
                  <TextInput label={"Giải thích đi nghe thử 😒"} value={dynamicData.bandageBtn || "Giải thích đi nghe thử 😒"} onChange={(v) => setDynamicData(d => ({ ...d, bandageBtn: v }))} />
                  <TextArea label={"Từ nay tớ hứa sẽ ngoan, không cãi lời, không làm đ"} value={dynamicData.successDesc || "Từ nay tớ hứa sẽ ngoan, không cãi lời, không làm đằng ấy phải dỗi nữa. Cho tớ một cơ hội chuộc lỗi bằng một cốc trà sữa to chà bá nhé? 🧋"} onChange={(v) => setDynamicData(d => ({ ...d, successDesc: v }))} />
                  <TextInput label={"Hòa nhé!"} value={dynamicData.successTitle || "Hòa nhé!"} onChange={(v) => setDynamicData(d => ({ ...d, successTitle: v }))} />
                </Section>
                <Section title="Đoạn - Thư xin lỗi">
                  <TextInput label={"apologyText"} value={dynamicData.apologyText || "apologyText"} onChange={(v) => setDynamicData(d => ({ ...d, apologyText: v }))} />
                  <TextInput label={"Tha thứ"} value={dynamicData.apologyBtn || "Tha thứ"} onChange={(v) => setDynamicData(d => ({ ...d, apologyBtn: v }))} />
                </Section>
              </>

            ) : isSorry3 ? (
              <>
                <Section title="Đoạn - Lỗi hệ thống (BSOD)">
                  <TextInput label={"LỖI HỆ THỐNG"} value={dynamicData.bsodTitle || "LỖI HỆ THỐNG"} onChange={(v) => setDynamicData(d => ({ ...d, bsodTitle: v }))} />
                  <TextInput label={"MỐI QUAN HỆ ĐANG BỊ GIÁN ĐOẠN."} value={dynamicData.bsodMessage || "MỐI QUAN HỆ ĐANG BỊ GIÁN ĐOẠN."} onChange={(v) => setDynamicData(d => ({ ...d, bsodMessage: v }))} />
                  <TextInput label={"reason"} value={dynamicData.reason || "reason"} onChange={(v) => setDynamicData(d => ({ ...d, reason: v }))} />
                  <TextInput label={"Mã lỗi: LOVE_NOT_FOUND_404"} value={dynamicData.bsodCode || "Mã lỗi: LOVE_NOT_FOUND_404"} onChange={(v) => setDynamicData(d => ({ ...d, bsodCode: v }))} />
                  <TextInput label={"[ Tái khởi động ]"} value={dynamicData.bsodButton || "[ Tái khởi động ]"} onChange={(v) => setDynamicData(d => ({ ...d, bsodButton: v }))} />
                </Section>
                <Section title="Đoạn - Mất kết nối & Khủng long">
                  <TextInput label={"Không có kết nối"} value={dynamicData.noConnTitle || "Không có kết nối"} onChange={(v) => setDynamicData(d => ({ ...d, noConnTitle: v }))} />
                  <TextInput label={"Mất kết nối với trái tim của người yêu."} value={dynamicData.noConnMessage || "Mất kết nối với trái tim của người yêu."} onChange={(v) => setDynamicData(d => ({ ...d, noConnMessage: v }))} />
                  <TextInput label={"Kiểm tra lại độ thành tâm"} value={dynamicData.noConnHint1 || "Kiểm tra lại độ thành tâm"} onChange={(v) => setDynamicData(d => ({ ...d, noConnHint1: v }))} />
                  <TextInput label={"Chuẩn bị sẵn lời xin lỗi"} value={dynamicData.noConnHint2 || "Chuẩn bị sẵn lời xin lỗi"} onChange={(v) => setDynamicData(d => ({ ...d, noConnHint2: v }))} />
                  <TextInput label={"Chạy qua nhà đền tội ngay lập tức"} value={dynamicData.noConnHint3 || "Chạy qua nhà đền tội ngay lập tức"} onChange={(v) => setDynamicData(d => ({ ...d, noConnHint3: v }))} />
                  <TextInput label={"ERR_HEART_BROKEN"} value={dynamicData.noConnErr || "ERR_HEART_BROKEN"} onChange={(v) => setDynamicData(d => ({ ...d, noConnErr: v }))} />
                  <TextInput label={"Bấm phím Space hoặc chạm vào màn hình để thử lại."} value={dynamicData.dinoHelpText || "Bấm phím Space hoặc chạm vào màn hình để thử lại."} onChange={(v) => setDynamicData(d => ({ ...d, dinoHelpText: v }))} />
                  <MediaInput label={"dinoFaceImg"} onChange={(url) => setDynamicData(d => ({ ...d, dinoFaceImg: url }))} />
                  <MediaInput label={"avatar"} onChange={(url) => setDynamicData(d => ({ ...d, avatar: url }))} />
                  <MediaInput label={"memories"} onChange={(url) => setDynamicData(d => ({ ...d, memories: url }))} />
                  <TextInput label={"NHẢY (W)"} value={dynamicData.dinoJumpBtn || "NHẢY (W)"} onChange={(v) => setDynamicData(d => ({ ...d, dinoJumpBtn: v }))} />
                  <TextInput label={"CÚI (S)"} value={dynamicData.dinoDuckBtn || "CÚI (S)"} onChange={(v) => setDynamicData(d => ({ ...d, dinoDuckBtn: v }))} />
                </Section>
                <Section title="Đoạn - Cảnh báo & Bằng chứng">
                  <TextInput label={"Cảnh_Báo.exe"} value={dynamicData.alertTitle || "Cảnh_Báo.exe"} onChange={(v) => setDynamicData(d => ({ ...d, alertTitle: v }))} />
                  <TextArea label={"CẢNH BÁO: Tên ngốc này đã nhận ra lỗi lầm!  Hắn th"} value={dynamicData.alertMessage || "CẢNH BÁO: Tên ngốc này đã nhận ra lỗi lầm!  Hắn thừa nhận mình vô tâm, trẻ con và hứa sẽ sửa đổi. Bạn có muốn xem bằng chứng không?"} onChange={(v) => setDynamicData(d => ({ ...d, alertMessage: v }))} />
                  <TextInput label={"Xem bằng chứng"} value={dynamicData.alertBtnYes || "Xem bằng chứng"} onChange={(v) => setDynamicData(d => ({ ...d, alertBtnYes: v }))} />
                  <TextInput label={"Hủy"} value={dynamicData.alertBtnNo || "Hủy"} onChange={(v) => setDynamicData(d => ({ ...d, alertBtnNo: v }))} />
                  <TextArea label={"Tớ đã mất rất nhiều thời gian để thu thập những bá"} value={dynamicData.trashMessage || "Tớ đã mất rất nhiều thời gian để thu thập những báu vật này..."} onChange={(v) => setDynamicData(d => ({ ...d, trashMessage: v }))} />
                  <MediaInput label={"memory1"} onChange={(url) => setDynamicData(d => ({ ...d, memory1: url }))} />
                  <MediaInput label={"memory2"} onChange={(url) => setDynamicData(d => ({ ...d, memory2: url }))} />
                  <MediaInput label={"memory3"} onChange={(url) => setDynamicData(d => ({ ...d, memory3: url }))} />
                  <TextInput label={"Xem tiếp"} value={dynamicData.trashBtn || "Xem tiếp"} onChange={(v) => setDynamicData(d => ({ ...d, trashBtn: v }))} />
                </Section>
                <Section title="Đoạn - Cài đặt lại HĐH">
                  <TextInput label={"Đang tải... Sự quan tâm"} value={dynamicData.installStep1 || "Đang tải... Sự quan tâm"} onChange={(v) => setDynamicData(d => ({ ...d, installStep1: v }))} />
                  <TextInput label={"Đang cài đặt... Tính tự giác"} value={dynamicData.installStep2 || "Đang cài đặt... Tính tự giác"} onChange={(v) => setDynamicData(d => ({ ...d, installStep2: v }))} />
                  <TextInput label={"Đang xóa bỏ... Thói quen vô tâm"} value={dynamicData.installStep3 || "Đang xóa bỏ... Thói quen vô tâm"} onChange={(v) => setDynamicData(d => ({ ...d, installStep3: v }))} />
                  <TextInput label={"Hoàn tất! Hệ thống đã được nâng cấp."} value={dynamicData.installSuccess || "Hoàn tất! Hệ thống đã được nâng cấp."} onChange={(v) => setDynamicData(d => ({ ...d, installSuccess: v }))} />
                </Section>
                <Section title="Đoạn - Lời xin lỗi cuối">
                  <TextInput label={"letter"} value={dynamicData.letter || "letter"} onChange={(v) => setDynamicData(d => ({ ...d, letter: v }))} />
                  <TextInput label={"successTitle"} value={dynamicData.successTitle || "successTitle"} onChange={(v) => setDynamicData(d => ({ ...d, successTitle: v }))} />
                  <TextInput label={"successMessage"} value={dynamicData.successMessage || "successMessage"} onChange={(v) => setDynamicData(d => ({ ...d, successMessage: v }))} />
                  <TextInput label={"choiceTitle"} value={dynamicData.choiceTitle || "choiceTitle"} onChange={(v) => setDynamicData(d => ({ ...d, choiceTitle: v }))} />
                  <TextInput label={"acceptText"} value={dynamicData.acceptText || "acceptText"} onChange={(v) => setDynamicData(d => ({ ...d, acceptText: v }))} />
                  <TextInput label={"rejectText"} value={dynamicData.rejectText || "rejectText"} onChange={(v) => setDynamicData(d => ({ ...d, rejectText: v }))} />
                </Section>
              </>

            ) : isValentine3 ? (
              <>
                <Section title="Đoạn - Step1Fingerprint">
                  <TextInput label={"Nhật Ký Tình Yêu"} value={dynamicData.NhtKTnhYu || "Nhật Ký Tình Yêu"} onChange={(v) => setDynamicData(d => ({ ...d, NhtKTnhYu: v }))} />
                  <TextInput label={"Chạm và giữ để xác thực nhịp tim 💓"} value={dynamicData.Chmvgixcthcnhpt || "Chạm và giữ để xác thực nhịp tim 💓"} onChange={(v) => setDynamicData(d => ({ ...d, Chmvgixcthcnhpt: v }))} />
                </Section>
                <Section title="Đoạn - Step2TimeMachine">
                  <TextInput label={"Đã bao lâu kể từ ngày"} value={dynamicData.baoluktngy || "Đã bao lâu kể từ ngày"} onChange={(v) => setDynamicData(d => ({ ...d, baoluktngy: v }))} />
                  <TextInput label={"trái tim lỡ nhịp?"} value={dynamicData.tritimlnhp || "trái tim lỡ nhịp?"} onChange={(v) => setDynamicData(d => ({ ...d, tritimlnhp: v }))} />
                  <TextInput label={"Ngày"} value={dynamicData.Ngy || "Ngày"} onChange={(v) => setDynamicData(d => ({ ...d, Ngy: v }))} />
                  <TextInput label={"Giờ"} value={dynamicData.Gi || "Giờ"} onChange={(v) => setDynamicData(d => ({ ...d, Gi: v }))} />
                  <TextInput label={"Phút"} value={dynamicData.Pht || "Phút"} onChange={(v) => setDynamicData(d => ({ ...d, Pht: v }))} />
                  <TextInput label={"Giây"} value={dynamicData.Giy || "Giây"} onChange={(v) => setDynamicData(d => ({ ...d, Giy: v }))} />
                  <TextInput label={"Hành trình bắt đầu"} value={dynamicData.Hnhtrnhbtu || "Hành trình bắt đầu"} onChange={(v) => setDynamicData(d => ({ ...d, Hnhtrnhbtu: v }))} />
                </Section>
                <Section title="Đoạn - Step3Quiz">
                  <TextInput label={"Trạm Trí Nhớ"} value={dynamicData.TrmTrNh || "Trạm Trí Nhớ"} onChange={(v) => setDynamicData(d => ({ ...d, TrmTrNh: v }))} />
                </Section>
                <Section title="Đoạn - Step4Puzzle">
                  <TextInput label={"Mảnh Ghép Ký Ức"} value={dynamicData.MnhGhpKc || "Mảnh Ghép Ký Ức"} onChange={(v) => setDynamicData(d => ({ ...d, MnhGhpKc: v }))} />
                  <TextInput label={"Click 2 mảnh để hoán đổi vị trí nhé!"} value={dynamicData.Click2mnhhonivt || "Click 2 mảnh để hoán đổi vị trí nhé!"} onChange={(v) => setDynamicData(d => ({ ...d, Click2mnhhonivt: v }))} />
                </Section>
                <Section title="Đoạn - Step5FakeChat">
                  <TextInput label={"Người ấy ❤️"} value={dynamicData.Ngiy || "Người ấy ❤️"} onChange={(v) => setDynamicData(d => ({ ...d, Ngiy: v }))} />
                  <TextInput label={"Chạm vào màn hình để tiếp tục..."} value={dynamicData.Chmvomnhnhtiptc || "Chạm vào màn hình để tiếp tục..."} onChange={(v) => setDynamicData(d => ({ ...d, Chmvomnhnhtiptc: v }))} />
                  <TextInput label={"Ngắm nhìn lại nhé 📸"} value={dynamicData.Ngmnhnlinh || "Ngắm nhìn lại nhé 📸"} onChange={(v) => setDynamicData(d => ({ ...d, Ngmnhnlinh: v }))} />
                </Section>
                <Section title="Đoạn - Step6PolaroidSwipe">
                  <TextInput label={"Triển Lãm Ký Ức"} value={dynamicData.TrinLmKc || "Triển Lãm Ký Ức"} onChange={(v) => setDynamicData(d => ({ ...d, TrinLmKc: v }))} />
                  <TextInput label={"Vuốt trái/phải để xem ảnh tiếp theo"} value={dynamicData.Vuttriphixemnht || "Vuốt trái/phải để xem ảnh tiếp theo"} onChange={(v) => setDynamicData(d => ({ ...d, Vuttriphixemnht: v }))} />
                  <TextInput label={"Hành trình này thật đẹp,"} value={dynamicData.Hnhtrnhnythtp || "Hành trình này thật đẹp,"} onChange={(v) => setDynamicData(d => ({ ...d, Hnhtrnhnythtp: v }))} />
                  <TextInput label={"nhưng tớ muốn nó"} value={dynamicData.nhngtmunn || "nhưng tớ muốn nó"} onChange={(v) => setDynamicData(d => ({ ...d, nhngtmunn: v }))} />
                  <TextInput label={"dài hơn nữa..."} value={dynamicData.dihnna || "dài hơn nữa..."} onChange={(v) => setDynamicData(d => ({ ...d, dihnna: v }))} />
                  <TextInput label={"Mở bức thư cuối"} value={dynamicData.Mbcthcui || "Mở bức thư cuối"} onChange={(v) => setDynamicData(d => ({ ...d, Mbcthcui: v }))} />
                </Section>
                <Section title="Đoạn - Step7Letter">
                  <TextInput label={"Chạm để mở thư 💌"} value={dynamicData.Chmmth || "Chạm để mở thư 💌"} onChange={(v) => setDynamicData(d => ({ ...d, Chmmth: v }))} />
                  <TextInput label={"Tiếp tục"} value={dynamicData.Tiptc || "Tiếp tục"} onChange={(v) => setDynamicData(d => ({ ...d, Tiptc: v }))} />
                </Section>
                <Section title="Đoạn - Step8Climax">
                  <TextInput label={"Thế tóm lại là..."} value={dynamicData.Thtmlil || "Thế tóm lại là..."} onChange={(v) => setDynamicData(d => ({ ...d, Thtmlil: v }))} />
                  <TextArea label={"Cuối tuần này cậu có rảnh không, đi chơi với tớ nh"} value={dynamicData.Cuitunnycucrnhk || "Cuối tuần này cậu có rảnh không, đi chơi với tớ nhé? 🥺"} onChange={(v) => setDynamicData(d => ({ ...d, Cuitunnycucrnhk: v }))} />
                  <TextInput label={"ĐỒNG Ý LUÔN 💖"} value={dynamicData.NGLUN || "ĐỒNG Ý LUÔN 💖"} onChange={(v) => setDynamicData(d => ({ ...d, NGLUN: v }))} />
                  <TextInput label={"TỪ CHỐI 💔"} value={dynamicData.TCHI || "TỪ CHỐI 💔"} onChange={(v) => setDynamicData(d => ({ ...d, TCHI: v }))} />
                  <TextInput label={"Chốt Đơn!"} value={dynamicData.Chtn || "Chốt Đơn!"} onChange={(v) => setDynamicData(d => ({ ...d, Chtn: v }))} />
                  <TextInput label={"Lên đồ lẹ lênnnn!"} value={dynamicData.Lnllnnnn || "Lên đồ lẹ lênnnn!"} onChange={(v) => setDynamicData(d => ({ ...d, Lnllnnnn: v }))} />
                  <TextInput label={"Tớ qua đón đi chơi ngay và luôn! 🛵💨"} value={dynamicData.Tquanichingayvl || "Tớ qua đón đi chơi ngay và luôn! 🛵💨"} onChange={(v) => setDynamicData(d => ({ ...d, Tquanichingayvl: v }))} />
                </Section>
              </>
            ) : !(Array.isArray(selectedTemplate?.data_schema) && selectedTemplate.data_schema.length !== 0) ? (
              <>
                <div className="md:col-span-2 hidden">
                </div>


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
                    <TextArea label="Các câu từ chối (Mỗi câu 1 dòng, enter để xuống dòng)" onChange={setGiftDeclineButton} value={giftDeclineButton} />
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
            ) : null}

            {Array.isArray(selectedTemplate?.data_schema) && selectedTemplate.data_schema.length !== 0 && (
              <>
                {Array.from(new Set(selectedTemplate.data_schema.map((f: any) => f.section || "Tùy chỉnh nội dung"))).map((sectionName: any, secIdx) => (
                  <Section key={secIdx} title={sectionName}>
                    {selectedTemplate.data_schema
                      .filter((f: any) => (f.section || "Tùy chỉnh nội dung") === sectionName)
                      .map((field: any, i: number) => {
                        const val = dynamicData[field.key] ?? field.default ?? "";
                        if (field.type === "color") {
                          return <ColorInput key={i} label={field.label} value={val} onCommit={v => setDynamicData(d => ({ ...d, [field.key]: v }))} />;
                        }
                        if (field.type === "media" || field.type === "image" || field.type === "audio" || field.type === "video") {
                          return <MediaInput key={i} label={field.label} onChange={(v) => setDynamicData(d => ({ ...d, [field.key]: v }))} />;
                        }
                        if (field.type === "textarea") {
                          return <TextArea key={i} label={field.label} value={val} onChange={v => setDynamicData(d => ({ ...d, [field.key]: v }))} />;
                        }
                        return <TextInput key={i} label={field.label} value={val} onChange={v => setDynamicData(d => ({ ...d, [field.key]: v }))} />;
                      })}
                  </Section>
                ))}
              </>
            )}
            
            <div className="sticky bottom-4 z-50 mt-8 grid grid-cols-2 gap-4">
              <button
                className="group relative w-full overflow-hidden rounded-[2rem] border-[2px] border-white/20 bg-gradient-to-r from-[#ff477e] via-[#ff7eb8] to-[#ff477e] bg-[length:200%_auto] py-4 text-base font-black !text-white shadow-[0_10px_25px_rgba(255,71,126,0.4)] backdrop-blur-md transition-all animate-gradient-x hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(255,71,126,0.6)] active:scale-95 disabled:opacity-50"
                disabled={isSavingEdits}
                onClick={() => saveOrderEdits()}
                type="button"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative z-10 drop-shadow-md tracking-wide">
                  {isSavingEdits ? "Đang lưu..." : "Lưu chỉnh sửa"}
                </span>
              </button>
              <button
                className="group relative w-full overflow-hidden rounded-[2rem] border-[2px] border-white/20 bg-gradient-to-r from-[#ff9100] via-[#ffb347] to-[#ff9100] bg-[length:200%_auto] py-4 text-base font-black !text-white shadow-[0_10px_25px_rgba(255,145,0,0.4)] backdrop-blur-md transition-all animate-gradient-x hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(255,145,0,0.6)] active:scale-95 disabled:opacity-50"
                disabled={isSavingEdits}
                onClick={handleLock}
                type="button"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative z-10 drop-shadow-md tracking-wide">
                  Khóa đơn
                </span>
              </button>
            </div>
          </>
          )
        ) : null}

        {result ? (
            <div className="mt-4 grid gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 font-semibold text-emerald-900">
                <span>Mã chuyển khoản: {result.paymentCode}</span>
                <span className={`rounded-full px-3 py-1 text-xs border ${result.unlocked ? "border-emerald-300 bg-emerald-100 text-emerald-800" : "border-yellow-300 bg-yellow-100 text-yellow-800"}`}>
                  {result.unlocked ? "Đã thanh toán - đã mở khóa" : "Chờ thanh toán"}
                </span>
              </div>
              <p className="text-xs text-emerald-800/70">
                {result.unlocked
                  ? "Khách đã chuyển tiền thành công. Nhân viên có thể chỉnh template và gửi link cho khách."
                  : "Gửi QR này cho khách. Gift link đang bị khóa tới khi webhook ngân hàng xác nhận đúng mã đơn và số tiền."}
              </p>
              {!result.unlocked ? (
                <div className="grid gap-4 rounded-2xl border border-pink-200 bg-white p-5 md:grid-cols-[160px_1fr] shadow-sm">
                {result.qrCodeUrl ? (
                  <div className="flex flex-col items-center justify-center gap-2 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="QR chuyển khoản" className="h-40 w-40 rounded-2xl bg-white object-contain p-2" src={`${result.qrCodeUrl}${result.qrCodeUrl.includes("?") ? "&" : "?"}_t=${qrKey}`} />
                    <span className="text-[11px] font-medium text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200 shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Làm mới sau: {Math.floor(qrTimeLeft / 60)}:{String(qrTimeLeft % 60).padStart(2, '0')}
                    </span>
                  </div>
                ) : (
                  <div className="grid h-40 w-40 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-center text-xs text-white/50">
                    Chưa cấu hình tài khoản nhận tiền
                  </div>
                )}
                <div className="grid content-center gap-2 text-sm text-gray-800">
                  <p><span className="text-gray-500 font-medium">Số tiền:</span> <b className="text-pink-600 text-lg">{result.amount.toLocaleString("vi-VN")}đ</b></p>
                  <p><span className="text-gray-500 font-medium">Nội dung CK:</span> <b className="text-pink-600">{result.paymentCode}</b></p>
                  <p className="text-xs leading-5 text-gray-500">Khách chuyển đúng số tiền và đúng nội dung. Webhook sẽ tự mở khóa link sau khi tiền vào tài khoản.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      className="rounded-full border border-pink-200 text-pink-700 bg-transparent px-4 py-2 text-xs font-semibold hover:bg-pink-50 hover:border-pink-300 transition-colors"
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
                          className="rounded-full border border-pink-200 text-pink-700 bg-transparent px-4 py-2 text-xs font-semibold hover:bg-pink-50 hover:border-pink-300 transition-colors"
                          onClick={() => copyQrImage(result.qrCodeUrl || "", showCopyMessage)}
                          type="button"
                        >
                          Copy QR
                        </button>
                        <button
                          className="rounded-full border border-pink-200 text-pink-700 bg-transparent px-4 py-2 text-xs font-semibold hover:bg-pink-50 hover:border-pink-300 transition-colors"
                          onClick={() => downloadImage(result.qrCodeUrl || "", `qr-${result.paymentCode}.png`)}
                          type="button"
                        >
                          Download QR
                        </button>
                      </>
                    ) : null}
                    {currentRole === "ADMIN" ? (
                      <button
                        className="rounded-full border border-emerald-400 bg-emerald-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
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
                    <span className="block text-xs font-semibold text-pink-300">Link gửi cho người ấy</span>
                    <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                      <input className="w-full rounded-xl border border-pink-300/30 bg-pink-900/30 px-4 py-3 text-pink-100 outline-none" readOnly value={result.giftLink} />
                      <button className="rounded-xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-semibold" onClick={async () => {
                        await copyText(result.giftLink);
                        showCopyMessage("Đã copy gift link.");
                      }} type="button">Copy</button>
                    </div>
                  </div>
                  <div className="mt-1 grid gap-2">
                    <span className="block text-xs font-semibold text-pink-300">Link để xem kết quả</span>
                    <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                      <input className="w-full rounded-xl border border-pink-300/30 bg-pink-900/30 px-4 py-3 text-pink-100 outline-none" readOnly value={result.trackLink} />
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
      <aside className="glass-panel-soft rounded-2xl p-4 xl:sticky xl:top-5 xl:h-[calc(100dvh-40px)] flex flex-col w-full xl:w-[450px]">
        <div className="px-1 pb-4 shrink-0 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Live Preview</h2>
            <p className="mt-1 text-sm text-white/54">Xem trước hiển thị ở đây.</p>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span className="text-xs text-white/64">Âm lượng</span>
            <input type="range" min="0" max="1" step="0.05" value={builderVolume} onChange={(e) => setBuilderVolume(Number(e.target.value))} className="w-24 accent-pink-500" />
          </div>
        </div>
        <div id="builder-preview" className="flex-1 w-full flex items-center justify-center">
            <InteractiveTemplatePreview
              componentKey={selectedComponentKey}
              customData={customData}
              question={question}
              recipientName={recipientName || "Em"}
              senderName={senderName || "Anh"}
              visualLabel={selectedTemplate?.visual_label}
              compact={true}
              isBuilderPreview={true}
              fullScreen={false}
            />
        </div>
      </aside>
      ) : null}

      {/* Lock/Unlock Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[99999] grid place-items-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setConfirmModal(null)}>
          <div className="w-full max-w-sm rounded-3xl border border-pink-200 bg-[#fff5fb] p-6 text-center text-pink-950 shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="text-5xl mb-4 drop-shadow-md">{confirmModal.type === "LOCK" ? "🔒" : "🔓"}</div>
            <h2 className="text-xl font-black text-pink-900 mb-3">{confirmModal.title}</h2>
            <p className="text-sm text-pink-800/80 mb-8 whitespace-pre-line leading-relaxed font-medium">{confirmModal.desc}</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                className="rounded-full bg-pink-100 py-3.5 text-sm font-bold text-pink-700 hover:bg-pink-200 transition-colors"
                onClick={() => setConfirmModal(null)}
              >
                Hủy
              </button>
              <button 
                className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-500/30 hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(null);
                }}
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ArrayInput({ label, onChange, values }: { label: string; onChange: (v: string[]) => void; values: string[] }) {
  return (
    <div className="grid gap-2 text-sm">
      <span className="text-white/64">{label}</span>
      <div className="grid gap-2">
        {values.map((val, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none transition focus:border-pink-300/50"
              value={val}
              onChange={(e) => {
                const newValues = [...values];
                newValues[i] = e.target.value;
                onChange(newValues);
              }}
            />
            <button
              type="button"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-red-500/10 text-red-400 hover:bg-red-500/20"
              onClick={() => {
                onChange(values.filter((_, idx) => idx !== i));
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          className="rounded-xl border border-dashed border-white/20 p-3 text-center text-white/60 hover:bg-white/5 hover:text-white"
          onClick={() => onChange([...values, ""])}
        >
          + Thêm lựa chọn
        </button>
      </div>
    </div>
  );
}
