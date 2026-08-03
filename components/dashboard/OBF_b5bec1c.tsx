"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { TemplateCatalogItem } from "@/lib/supabase/server";
import { InteractiveTemplatePreview } from "@/components/templates/InteractiveTemplatePreview";
import { FormStepNavigator } from "./FormStepNavigator";
import { GACHA_DATA } from "@/components/templates/dating-3/config";
import { toast } from "@/components/ui/Toast";
import { ImageCropperModal } from "@/components/ui/ImageCropperModal";
import imageCompression from "browser-image-compression";

const GENERAL_SONGS = [
  "/assets/songs/general/Da LAB - Tß╗½ Ng├áy Em ─Éß║┐n (Official Music Video)_128k.mp3",
  "/assets/songs/general/GREY D - ho├í raΓÇª.mp3",
  "/assets/songs/general/GREY D - y├¬u em nh╞░ΓÇª_128k.mp3",
  "/assets/songs/general/GREY D - ─æ├┤i mß║»t kß║╗ t├¼nh si.mp3",
  "/assets/songs/general/HAN SARA _ Tß╗Ü TH├ìCH Cß║¼U FT H.H.N _ OFFICIAL MUSIC VIDEO_128k.mp3",
  "/assets/songs/general/HIEUTHUHAI - Nghe Nh╞░ T├¼nh Y├¬u (prod. by Kewtiie)  [Official Lyric Video]_128k.mp3",
  "/assets/songs/general/HIEUTHUHAI - Ng╞░ß╗¥i Im Lß║╖ng Gß║╖p Ng╞░ß╗¥i Hay N├│i (prod. by Kewtiie) l Official Music Video_128k.mp3",
  "/assets/songs/general/SEANPOET _ EM TH├ìCH ft. Lß╗¼A _ OFFICIAL MV LYRIC_128k.mp3",
  "/assets/songs/general/Soulloom - Dance in the Rain.m4a",
  "/assets/songs/general/T├îNH Cß╗£ Y├èU EM  Kuun ─Éß╗⌐c Nam ft. Linh Thß╗Ön Official Music Video  KEY ENTERTAINMENT.mp3.mp3",
  "/assets/songs/general/d├¡nh - bß╗ô em_128k.mp3",
  "/assets/songs/general/n├ón. x Ng╞í - t├¼nh ─æß║»ng nh╞░ ly c├á ph├¬ _ tas release_128k.mp3",
  "/assets/songs/general/tlinh - Th├¡ch Qu├í R├╣i N├á (ft. Trung Trß║ºn) _ OFFICIAL LYRICS VIDEO_128k.mp3",
];

const SERVICE_PACKAGES = [
  { id: "goi1-thuong", label: "G├ôI 1: THEO Mß║¬U (L├ám th╞░ß╗¥ng - 99.000─æ)", price: 99000 },
  { id: "goi1-gap", label: "G├ôI 1: THEO Mß║¬U (L├ám gß║Ñp - Tß╗½ 119.000─æ)", price: 119000 },
  { id: "goi2-thuong", label: "G├ôI 2: CHß╗êNH Cß║óM X├ÜC (L├ám th╞░ß╗¥ng - 119.000─æ)", price: 119000 },
  { id: "goi2-gap", label: "G├ôI 2: CHß╗êNH Cß║óM X├ÜC (L├ám gß║Ñp - Tß╗½ 139.000─æ)", price: 139000 },
  { id: "goi3-thuong", label: "G├ôI 3: ─Éß║╢C BIß╗åT (L├ám th╞░ß╗¥ng - 179.000─æ)", price: 179000 },
  { id: "goi3-gap", label: "G├ôI 3: ─Éß║╢C BIß╗åT (L├ám gß║Ñp - Tß╗½ 199.000─æ)", price: 199000 },
];

const WEDDING_SERVICE_PACKAGES = [
  { id: "wedding-goi1-thuong", label: "G├ôI 1 (1 thiß╗çp Nh├á Trai HOß║╢C Nh├á G├íi) - L├ám th╞░ß╗¥ng (2-3 ng├áy): 139.000 VN─É", price: 139000 },
  { id: "wedding-goi1-gap", label: "G├ôI 1 (1 thiß╗çp Nh├á Trai HOß║╢C Nh├á G├íi) - L├ám gß║Ñp (<24h): 189.000 VN─É", price: 189000 },
  { id: "wedding-goi2-thuong", label: "G├ôI 2 (1 thiß╗çp chung cho cß║ú 2 nh├á) - L├ám th╞░ß╗¥ng (2-3 ng├áy): 209.000 VN─É", price: 209000 },
  { id: "wedding-goi2-gap", label: "G├ôI 2 (1 thiß╗çp chung cho cß║ú 2 nh├á) - L├ám gß║Ñp (<24h): 279.000 VN─É", price: 279000 },
  { id: "wedding-goi3-chung-thuong", label: "G├ôI 3 (Combo 2 thiß╗çp) Chung mß║½u - L├ám th╞░ß╗¥ng (2-3 ng├áy): 239.000 VN─É", price: 239000 },
  { id: "wedding-goi3-chung-gap", label: "G├ôI 3 (Combo 2 thiß╗çp) Chung mß║½u - L├ám gß║Ñp (<24h): 319.000 VN─É", price: 319000 },
  { id: "wedding-goi3-khac-thuong", label: "G├ôI 3 (Combo 2 thiß╗çp) Kh├íc mß║½u - L├ám th╞░ß╗¥ng (2-3 ng├áy): 269.000 VN─É", price: 269000 },
  { id: "wedding-goi3-khac-gap", label: "G├ôI 3 (Combo 2 thiß╗çp) Kh├íc mß║½u - L├ám gß║Ñp (<24h): 359.000 VN─É", price: 359000 },
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
  if (value === null || value === undefined || isNaN(Number(value))) return "0─æ";
  return `${Number(value || 0).toLocaleString("vi-VN")}─æ`;
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
      console.error("Lß╗ùi copy text:", err);
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
    onCopied?.("─É├ú copy ß║únh QR.");
  } catch {
    await copyText(url);
    onCopied?.("─É├ú copy link QR.");
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



function TextInput({
  label,
  onChange,
  value,
  placeholder,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-white/64">{label}</span>
      <input
        className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none focus:border-pink-300/50 placeholder-white/20"
        onChange={(event) => onChange(event.target.value)}
        value={value ?? ""}
        placeholder={placeholder}
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
  placeholder,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm md:col-span-2">
      <span className="text-white/64">{label}</span>
      <textarea
        className="min-h-24 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none focus:border-pink-300/50 placeholder-white/20"
        onChange={(event) => onChange(event.target.value)}
        value={value ?? ""}
        placeholder={placeholder}
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
      <span className="text-[11px] text-white/38">Chß╗ìn xong m├áu rß╗ôi thß║ú chuß╗Öt ─æß╗â ├íp dß╗Ñng.</span>
    </label>
  );
}

function PinCodeInput({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const digits = (value ?? "").replace(/\D/g, "").slice(0, 4);

  useEffect(() => {
    const clean = (value ?? "").replace(/\D/g, "").slice(0, 4);
    if (clean !== (value ?? "")) onChange(clean);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chß╗ë sanitize khi value ─æß╗òi
  }, [value]);

  const pressDigit = (num: number) => {
    if (digits.length < 4) onChange(digits + String(num));
  };

  const backspace = () => onChange(digits.slice(0, -1));

  return (
    <div className="grid gap-2 text-sm md:col-span-2">
      <span className="text-white/64">{label}</span>
      <div className="rounded-xl border border-white/10 bg-white/[0.07] p-4">
        <div className="mb-4 flex justify-center gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex h-12 w-10 items-center justify-center rounded-xl border-2 text-xl font-semibold tabular-nums transition-colors ${
                digits[i]
                  ? "border-pink-400 bg-pink-500/15 text-pink-100"
                  : "border-white/20 bg-white/[0.04] text-white/20"
              }`}
            >
              {digits[i] ?? ""}
            </div>
          ))}
        </div>
        <div className="mx-auto grid max-w-[220px] grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => pressDigit(n)}
              disabled={digits.length >= 4}
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-lg font-semibold text-pink-200 transition-all hover:bg-white/[0.14] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {n}
            </button>
          ))}
          <div />
          <button
            type="button"
            onClick={() => pressDigit(0)}
            disabled={digits.length >= 4}
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-lg font-semibold text-pink-200 transition-all hover:bg-white/[0.14] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            0
          </button>
          <button
            type="button"
            onClick={backspace}
            disabled={digits.length === 0}
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-pink-500/10 text-pink-200 transition-all hover:bg-pink-500/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="X├│a sß╗æ cuß╗æi"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z" />
            </svg>
          </button>
        </div>
        <p className="mt-3 text-center text-[11px] text-white/38">Bß║Ñm sß╗æ tr├¬n b├án ph├¡m ─æß╗â ─æß║╖t mß║¡t m├ú (─æ├║ng 4 sß╗æ).</p>
      </div>
    </div>
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
      // N├⌐n ß║únh nß║┐u l├á ─æß╗ïnh dß║íng h├¼nh ß║únh (bß╗Å qua gif, video, audio)
      if (file.type.startsWith("image/") && file.type !== "image/gif") {
        const options = {
          maxSizeMB: 0.3, // N├⌐n xuß╗æng tß╗æi ─æa 300KB
          maxWidthOrHeight: 1920, // K├¡ch th╞░ß╗¢c tß╗æi ─æa
          useWebWorker: true,
          initialQuality: 0.8
        };
        try {
          fileToUpload = await imageCompression(file, options);
          console.log(`─É├ú n├⌐n ß║únh tß╗½ ${(file.size / 1024 / 1024).toFixed(2)}MB xuß╗æng ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`);
        } catch (error) {
          console.error("Lß╗ùi n├⌐n ß║únh, tiß║┐p tß╗Ñc up ß║únh gß╗æc", error);
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
      toast.error("Lß╗ùi tß║úi file: " + error.message);
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
      {isUploading && <span className="text-xs font-semibold text-pink-400">─Éang tß║úi file l├¬n ─æ├ím m├óy...</span>}
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
              <span className="text-sm font-bold text-pink-300">ß║ónh kß╗ë niß╗çm {i + 1}</span>
              <button type="button" onClick={() => onChange(values.filter((_, idx) => idx !== i))} className="text-red-400 text-xs hover:underline px-2 py-1 bg-red-400/10 rounded-lg">X├│a ß║únh n├áy</button>
           </div>
           
           <MediaInput label="" accept="image/*,video/*" onChange={(url) => {
              const newValues = [...values];
              newValues[i].imageUrl = url;
              onChange(newValues);
           }} />
           
           <input type="text" value={v.message} placeholder="Nhß║¡p d├▓ng ch├║ th├¡ch ngß║»n d╞░ß╗¢i ß║únh..." onChange={(e) => {
              const newValues = [...values];
              newValues[i].message = e.target.value;
              onChange(newValues);
           }} className="rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2 outline-none text-sm focus:border-pink-500/50 mt-1" />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...values, { imageUrl: "", message: "" }])} className="rounded-xl border border-dashed border-white/20 p-3 text-center text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-white transition-colors mt-2">
        + Th├¬m mß╗Öt tß║Ñm ß║únh nß╗»a
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

export function OrderBuilderForm({ currentRole, myOrders, templates, canCreateFree, initialOrder }: { currentRole: "ADMIN" | "STAFF" | "EMPLOYEE"; myOrders: MyOrderRow[]; templates: TemplateCatalogItem[]; canCreateFree?: boolean; initialOrder?: any }) {
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(!!initialOrder);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const valentineOne = templates.find((template) => template.component_key.includes("constellation")) ?? templates[0];
  const [selectedTemplateId, setSelectedTemplateId] = useState(valentineOne?.id ?? "");
  const [selectedPackage, setSelectedPackage] = useState(SERVICE_PACKAGES[2].id); // Mß║╖c ─æß╗ïnh g├│i phß╗ò biß║┐n
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

  useEffect(() => {
    const updateMobileState = () => setIsMobileDevice(window.innerWidth < 1024);
    updateMobileState();
    window.addEventListener("resize", updateMobileState);
    return () => window.removeEventListener("resize", updateMobileState);
  }, []);

  // If an initialOrder is provided (e.g. navigating directly to /dashboard/orders/[orderId]), auto-load it
  useEffect(() => {
    if (initialOrder) {
      // Small delay so templates list is ready
      const t = setTimeout(() => {
        loadOrder(initialOrder);
        setIsInitializing(false);
      }, 50);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dating1Stages = ["question", "success", "location", "datetime", "food", "drink", "completion"];
  const [previewStepIndex, setPreviewStepIndex] = useState(0);

  const [dating2Config, setDating2Config] = useState<Record<string, any>>({
    previewStep: 1,
    bgFrom: "#ffe6f2",
    bgTo: "#ffb3d9",
    pinCode: "0401",
    radioHint: "Chß║ím ─æß╗â d├▓ ─æ├║ng tß║ºn sß╗æ cß╗ºa tß╗¢ nh├⌐ ≡ƒô╗",
    vibeTitle: "Xin ch├áo!\nH├┤m nay cß╗ºa cß║¡u thß║┐ n├áo?",
    vibeOptions: ["─Éang ─æ├│i ≡ƒìò", "H╞íi mß╗çt ≡ƒÑ║", "Rß║Ñt vui Γ£¿"],
    vibeTooltips: ["Ngoan tß╗¢ dß║½n ─æi ─ân nh├⌐! ≡ƒìò", "Thß║┐ th├¼ ─æß╗â tß╗¢ sß║íc n─âng l╞░ß╗úng cho cß║¡u nh├⌐! ΓÜí", "Tuyß╗çt vß╗¥i! C├╣ng tß║¡n h╞░ß╗ƒng n├áo! Γ£¿"],
    scratchTitle: "Trß║ím sß║íc sß╗æ 1:",
    scratchSubtitle: "C├áo thß║╗ b├¬n d╞░ß╗¢i nh├⌐ ≡ƒÄü",
    scratchPrize: "Mß╗Öt buß╗òi hß║╣n h├▓\nbao trß╗ìn g├│i!",
    scratchBtn: "D├╣ng v├⌐ ngay ≡ƒæë",
    wheelTitle: "V├▓ng Quay Hß║╣n H├▓",
    wheelOptions: ["Nh├á H├áng ≡ƒºæΓÇì≡ƒì│", "─Éi B╞íi ≡ƒÅèΓÇìΓÖÇ∩╕Å", "Xem Phim ≡ƒÄ¼", "Dß║ío phß╗æ ≡ƒìí", "Tr├á Sß╗»a ≡ƒºï", "C├á Ph├¬ Γÿò"],
    wheelBtn: "L├¬n lß╗ïch th├┤i! ≡ƒæë",
    dtTitle: "Chß╗æt Thß╗¥i Gian",
    dtDates: ["T7 Tuß║ºn N├áy", "CN Tuß║ºn N├áy", "T2 Tuß║ºn Sau", "Ng├áy kh├íc"],
    dtTimes: ["S├íng (9h)", "Chiß╗üu (15h)", "Tß╗æi (19h)"],
    dtBtn: "Ho├án tß║Ñt ≡ƒÆû",
    finaleLetterTitle: "Gß╗¡i Cß║¡u,",
    finaleLetterBody: "Cß║¡u biß║┐t kh├┤ng, kß╗â tß╗½ ng├áy ─æß║ºu ti├¬n ch├║ng m├¼nh n├│i chuyß╗çn, tß╗¢ ─æ├ú cß║úm thß║Ñy ß╗ƒ cß║¡u mß╗Öt sß╗▒ ß║Ñm ├íp ─æß║╖c biß╗çt.\n\nTß╗¢ kh├┤ng hß╗⌐a sß║╜ mang lß║íi cho cß║¡u nhß╗»ng ─æiß╗üu ho├án hß║úo nhß║Ñt, nh╞░ng tß╗¢ hß╗⌐a sß║╜ lu├┤n cß╗æ gß║»ng ─æß╗â mang lß║íi nß╗Ñ c╞░ß╗¥i cho cß║¡u mß╗ùi ng├áy.\n\nMß╗ìi thß╗⌐ ─æ├ú sß║╡n s├áng. Cß║¡u c├│ muß╗æn ─æi ch╞íi vß╗¢i tß╗¢ v├áo {date}, {time} tß╗¢i ─æ├óy kh├┤ng?",
    finaleBtnNo: "Tß╗¬ CHß╗ÉI ≡ƒ½ú",
    finaleBtnYes: "─Éß╗ÆNG ├¥ ≡ƒÑ░",
    finaleBtnSuccess: "Chß╗æt deal! ≡ƒÄë"
  });

  const [dating3Config, setDating3Config] = useState<Record<string, any>>({
    previewStep: 1,
    ...GACHA_DATA
  });
  const [buyerName, setBuyerName] = useState("");
  const [buyerContact, setBuyerContact] = useState("");
  const [senderName, setSenderName] = useState("Anh");
  const [recipientName, setRecipientName] = useState("Em");
  const [affiliateId, setAffiliateId] = useState("");
  const [affiliates, setAffiliates] = useState<Array<{ id: string; name: string; ref_code: string }>>([]);
  const [qrTimeLeft, setQrTimeLeft] = useState(600);
  const [qrKey, setQrKey] = useState<number>(0);
  const [anniversaryCode, setAnniversaryCode] = useState("1402");
  const [question, setQuestion] = useState("Em c├│ ─æß╗ông ├╜ c├╣ng anh viß║┐t tiß║┐p c├óu chuyß╗çn n├áy kh├┤ng?");
  const [generalAudioUrl, setGeneralAudioUrl] = useState("");

  const [birthdayAge, setBirthdayAge] = useState("18");
  const [birthdayMessage, setBirthdayMessage] = useState("Ch├║c cß║¡u tuß╗òi mß╗¢i ngß║¡p tr├án niß╗üm vui v├á hß║ính ph├║c! Γ£¿\nMong rß║▒ng mß╗ìi ─æiß╗üu ╞░ß╗¢c h├┤m nay ─æß╗üu sß║╜ th├ánh sß╗▒ thß║¡t! ≡ƒÆû\nH├úy tr├ón trß╗ìng tß╗½ng gi├óy ph├║t ngß╗ìt ng├áo n├áy nh├⌐! ≡ƒÑ░\nV├á giß╗¥... h├úy ─æ├│n nhß║¡n m├│n qu├á b├¡ mß║¡t tiß║┐p theo! ≡ƒÄü");
  const [birthdayMemories, setBirthdayMemories] = useState<MemoryItem[]>([
    { imageUrl: "", message: "Nhß╗¢ ng├áy ─æß║ºu ti├¬n ─æ├┤i ta gß║╖p gß╗í..." },
    { imageUrl: "", message: "Nß╗Ñ c╞░ß╗¥i ß║Ñy ─æ├ú l├ám tr├íi tim anh xao xuyß║┐n" }
  ]);
  
  const [birthdayInstructionText, setBirthdayInstructionText] = useState("Giß╗» bß║¡t lß╗¡a v├á k├⌐o ─æß║┐n mß╗ôi lß╗¡a nß║┐n nh├⌐! ≡ƒöÑ");
  const [birthdayWishPromptText, setBirthdayWishPromptText] = useState("─É├ú ─æß║┐n l├║c thß╗▒c hiß╗çn ─æiß╗üu ╞░ß╗¢c rß╗ôi! Γ£¿");
  const [birthdayWishAcceptButton, setBirthdayWishAcceptButton] = useState("─Éß╗ông ├╜");
  const [birthdayWishDeclineButton, setBirthdayWishDeclineButton] = useState("Ch╞░a ngh─⌐ ra");
  const [birthdayRecordingText, setBirthdayRecordingText] = useState("─Éang ghi ├óm ─æiß╗üu ╞░ß╗¢c cß╗ºa bß║ín...");
  const [birthdayRecordingCompleteButton, setBirthdayRecordingCompleteButton] = useState("Ho├án tß║Ñt ghi ├óm");
  const [birthdayGiftPromptText, setBirthdayGiftPromptText] = useState("H├úy nhß║Ñn v├áo hß╗Öp qu├á ─æß╗â mß╗ƒ ─æiß╗üu bß║Ñt ngß╗¥! ≡ƒÄü");
  const [birthdayBalloonText, setBirthdayBalloonText] = useState("HPBD Em!");
  const [birthdayGreetingCardSignature, setBirthdayGreetingCardSignature] = useState("CH├ÜC Mß╗¬NG SINH NHß║¼T");
  const [birthdayFinal3DSignature, setBirthdayFinal3DSignature] = useState("EM");
  const [birthdayFinalMessage, setBirthdayFinalMessage] = useState("Ch├║c Mß╗½ng Sinh Nhß║¡t!");

  const [stage1Instruction, setStage1Instruction] = useState("Nß╗æi c├íc ng├┤i sao");
  const [stage1Background, setStage1Background] = useState("#05020a");
  const [stage1Accent, setStage1Accent] = useState("#ec4899");
  const [stage1ImageUrl, setStage1ImageUrl] = useState("");
  const [stage1MediaType, setStage1MediaType] = useState("");
  const [stage1RevealTitle, setStage1RevealTitle] = useState("V├¼ Sao Cß╗ºa Ri├¬ng Tß╗¢");
  const [stage1RevealBody, setStage1RevealBody] = useState("Trß║ím kh├┤ng gian vß╗½a bß║»t ─æ╞░ß╗úc mß╗Öt dß║úi s├íng tuyß╗çt ─æß║╣p. V┼⌐ trß╗Ñ bao la, nh╞░ng radar chß╗ë h╞░ß╗¢ng vß╗ü mß╗Öt ng╞░ß╗¥i duy nhß║Ñt th├┤i!");
  const [stage1RevealButton, setStage1RevealButton] = useState("Kh├┤i phß╗Ñc tß╗½ tr╞░ß╗¥ng");

  const [stage2Title, setStage2Title] = useState("Quß╗╣ ─Éß║ío Hß╗ùn Loß║ín");
  const [stage2Subtitle, setStage2Subtitle] = useState("Tß╗½ tr╞░ß╗¥ng ─æang nhiß╗àu loß║ín. H├úy k├⌐o c├íc v├¼ sao vß╗ü ─æ├║ng quß╗╣ ─æß║ío.");
  const [stage2ImageCaption, setStage2ImageCaption] = useState("Our Orbit");
  const [stage2Quote, setStage2Quote] = useState("\"Dß╗ùi th├¼ dß╗ùi nh╞░ng vß║½n phß║úi vß╗ü ─æ├║ng quß╗╣ ─æß║ío cß╗ºa nhau th├┤i. Cß║úm ╞ín v├¼ ─æ├ú lu├┤n nh╞░ß╗¥ng nhß╗ïn c├íi sß╗▒ b╞░ß╗¢ng bß╗ënh cß╗ºa tß╗¢.\"");
  const [stage2NextButton, setStage2NextButton] = useState("Tiß║┐p tß╗Ñc h├ánh tr├¼nh");
  const [stage2Background, setStage2Background] = useState("#05020a");
  const [stage2Accent, setStage2Accent] = useState("#60a5fa");
  const [stage2ImageUrl, setStage2ImageUrl] = useState("");
  const [stage2MediaType, setStage2MediaType] = useState("");

  const [stage3Title, setStage3Title] = useState("Ch├▓m Sao Thanh ├ém");
  const [stage3Subtitle, setStage3Subtitle] = useState("Chß║ím v├á k├⌐o mß╗Öt ─æ╞░ß╗¥ng qua 5 ─æiß╗âm s├íng kh├┤ng nhß║Ñc tay.");
  const [stage3MusicLabel, setStage3MusicLabel] = useState("ΓÖ¬ Lofi Piano ─æang ph├ít");
  const [stage3MediaUrl, setStage3MediaUrl] = useState("");
  const [stage3MediaType, setStage3MediaType] = useState("");
  const [stage3AudioUrl, setStage3AudioUrl] = useState("");
  const [stage3NextButton, setStage3NextButton] = useState("Tiß║┐p tß╗Ñc h├ánh tr├¼nh");
  const [stage3Message1, setStage3Message1] = useState("Cß║¡u biß║┐t kh├┤ng...");
  const [stage3Message2, setStage3Message2] = useState("D├╣ v┼⌐ trß╗Ñ n├áy c├│ h├áng tß╗╖ v├¼ sao...");
  const [stage3Message3, setStage3Message3] = useState("Nh╞░ng trong mß║»t tß╗¢...");
  const [stage3Message4, setStage3Message4] = useState("Cß║¡u l├á v├¼ sao s├íng nhß║Ñt v├á duy nhß║Ñt.");
  const [stage3Background, setStage3Background] = useState("#05020a");
  const [stage3Accent, setStage3Accent] = useState("#f472b6");

  const [stage4Title, setStage4Title] = useState("Thß╗¥i gian hß║╣n");
  const [stage5Title, setStage5Title] = useState("M├│n ─ân y├¬u th├¡ch");
  const [locationOptions, setLocationOptions] = useState<string[]>(["C├á ph├¬ Γÿò", "─Éi ─ân ≡ƒì╜∩╕Å", "Xem phim ≡ƒÄ¼", "C├┤ng vi├¬n ≡ƒî│", "Mua sß║»m ≡ƒ¢ì∩╕Å", "L╞░ß╗ún phß╗æ ≡ƒÅÖ∩╕Å"]);
  const [foodOptions, setFoodOptions] = useState<string[]>(["B├║n ─æß║¡u", "Phß╗ƒ", "B├║n b├▓", "Mß╗│ Quß║úng", "Mß╗│ cay", "Xi├¬n bß║⌐n"]);
  const [drinkOptions, setDrinkOptions] = useState<string[]>(["C├á ph├¬", "Tr├á", "Tr├á Sß╗»a", "Tr├á Matcha", "Sinh tß╗æ", "N╞░ß╗¢c ├⌐p"]);

  const [stage4Prompt, setStage4Prompt] = useState("Nhanh tay bß║»t lß║Ñy mß╗Öt v├¼ sao ╞░ß╗¢c nguyß╗çn!");
  const [stage4MicInstruction, setStage4MicInstruction] = useState("V├á thß╗òi v├áo Microphone ─æß╗â bay lß╗¢p bß╗Ñi trß║ºn...");
  const [stage4FallbackButton, setStage4FallbackButton] = useState("Bß║Ñm v├áo ─æ├óy nß║┐u Mic lß╗ùi");
  const [stage4RevealTitle, setStage4RevealTitle] = useState("H├úy nhß║»m mß║»t, ╞░ß╗¢c mß╗Öt ─æiß╗üu");
  const [stage4RevealBody, setStage4RevealBody] = useState("\"Tß╗½ khoß║únh khß║»c va chß║ím ─æß║ºu ti├¬n, ─æß║┐n nhß╗»ng l├║c dß╗ùi hß╗¥n, ch├║ng ta ─æ├ú c├╣ng nhau tß║ío n├¬n mß╗Öt v┼⌐ trß╗Ñ tuyß╗çt ─æß║╣p. Tß╗¢ mong ng├┤i sao n├áy sß║╜ mang ─æß║┐n cho cß║¡u sß╗▒ b├¼nh y├¬n.\"");
  const [stage4RevealButton, setStage4RevealButton] = useState("─É├│n nhß║¡n");
  const [stage4Background, setStage4Background] = useState("#05020a");
  const [stage4Accent, setStage4Accent] = useState("#f472b6");
  const [stage4ImageUrl, setStage4ImageUrl] = useState("");
  const [stage4MediaType, setStage4MediaType] = useState("");

  const [finalTitle, setFinalTitle] = useState("Happy Valentine's Day!");
  const [finalSubtitle, setFinalSubtitle] = useState("Cß║úm ╞ín v├¼ ─æ├ú l├á ngoß║íi lß╗ç tuyß╗çt vß╗¥i nhß║Ñt cß╗ºa nhau.");
  const [signOffText, setSignOffText] = useState("Th╞░╞íng mß║┐n");
  const [finalCta, setFinalCta] = useState("Nhß║¡n Qu├á ─Éi Ch╞íi");
  const [finalBackground, setFinalBackground] = useState("#fb7185");
  const [finalAccent, setFinalAccent] = useState("#ec4899");
  const [giftTitle, setGiftTitle] = useState("Th╞░ Mß╗¥i Hß║╣n H├▓");
  const [giftBody, setGiftBody] = useState("Cuß╗æi tuß║ºn n├áy, c├╣ng nhau ─æi dß║ío phß╗æ v├á uß╗æng ch├║t g├¼ ─æ├│ ß║Ñm ├íp nh├⌐? Tß╗¢ biß║┐t mß╗Öt qu├ín view rß║Ñt xinh!");
  const [val1StartDate, setVal1StartDate] = useState("2023-02-14T00:00:00");
  const [expiresAtDate, setExpiresAtDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().slice(0, 16);
  });
  const [proposedDate, setProposedDate] = useState("");
  const [giftDeclineButton, setGiftDeclineButton] = useState("─Éß╗â khi kh├íc");
  const [giftAcceptButton, setGiftAcceptButton] = useState("L├¬n ─æß╗ô th├┤i!");
  const [giftAcceptedTitle, setGiftAcceptedTitle] = useState("Chß╗æt ─æ╞ín!");
  const [giftAcceptedBody, setGiftAcceptedBody] = useState("Lß╗ïch hß║╣n ─æ├ú ─æ╞░ß╗úc l╞░u lß║íi th├ánh c├┤ng. Hß║╣n gß║╖p cß║¡u v├áo ng├áy h├┤m ─æ├│ nh├⌐!");
  const [giftDeclinedTitle, setGiftDeclinedTitle] = useState("Vß║¡y hß║╣n ng├áy kh├íc nha!");
  const [giftDeclinedBody, setGiftDeclinedBody] = useState("Chß╗ìn mß╗Öt ng├áy cß║¡u rß║únh ─æß╗â ch├║ng m├¼nh set k├¿o lß║íi nh├⌐!");
  const [giftBackButton, setGiftBackButton] = useState("Quay lß║íi");
  const [giftRescheduleButton, setGiftRescheduleButton] = useState("Gß╗¡i lß╗ïch hß║╣n");
  const [contractTitle, setContractTitle] = useState("Bß║ún Hß╗úp ─Éß╗ông");
  const [contractBody, setContractBody] = useState("\"Thß╗¥i hß║ín d├╣ng thß╗¡ tr├íi tim tß╗¢ ─æ├ú hß║┐t. Cß║¡u c├│ muß╗æn gia hß║ín g├│i Premium (y├¬u th╞░╞íng trß╗ìn ─æß╗¥i) kh├┤ng?\"");
  const [contractRejectButton, setContractRejectButton] = useState("Xem x├⌐t lß║íi");
  const [contractHoldInstruction, setContractHoldInstruction] = useState("Giß╗» v├ón tay 3 gi├óy");

  const [valentine2Config, setValentine2Config] = useState({
    anniversaryCode: "1402",
    musicUrl: "/valentine-2-music.m4a",
    coverTitle: "Our Memories",
    coverImage: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600",
    page1Image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600",
    page1Text: "Ng├áy ─æ├│, tß╗¢ kh├┤ng ngh─⌐ ch├║ng m├¼nh lß║íi ─æi c├╣ng nhau xa ─æß║┐n thß║┐...",
    polaroids: [
      { id: 1, src: "https://images.unsplash.com/photo-1494774116478-eb287e07b8b2?w=400", caption: "B├¼nh y├¬n" },
      { id: 2, src: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400", caption: "Ngß╗æc nghß║┐ch" }
    ],
    page2Text: "Tß╗¢ y├¬u c├íi c├ích cß║¡u quan t├óm ─æß║┐n nhß╗»ng ─æiß╗üu nhß╗Å nhß║Ñt...",
    page3Hint: "K├⌐o ruy b─âng nh├⌐",
    page3SecretText: "Tß╗¢ c├│ mß╗Öt m├│n qu├á b├¡ mß║¡t, nh╞░ng cß║¡u phß║úi tß╗▒ tay gi├ánh lß║Ñy n├│ nh├⌐!",
    page3ButtonText: "─Éi lß║Ñy qu├á ≡ƒò╣∩╕Å",
    confessionText: "Trang s├ích n├áy tß╗¢ muß╗æn ─æß╗â ngß╗Å, chß╗¥ cß║¡u c├╣ng viß║┐t tiß║┐p. Tß╗æi nay ─æi xem phim vß╗¢i tß╗¢ nh├⌐?",
  });

  const [dynamicData, setDynamicData] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<"trai" | "gai">("trai");
  const isGoi3 = selectedPackage?.includes("wedding-goi3") || false;
  const isGoi2 = selectedPackage?.includes("wedding-goi2") || false;
  const isGoi1 = selectedPackage?.includes("wedding-goi1") || false;
  const isGoi3KhacMau = selectedPackage?.includes("wedding-goi3-khac") || false;
  const activeTemplateId = (isGoi3KhacMau && activeTab === "gai") ? (dynamicData?.gai?.templateId || selectedTemplateId) : selectedTemplateId;

  const getVal = (key: string) => (isGoi3 && activeTab === "gai") ? (dynamicData.gai?.[key] ?? "") : (dynamicData[key] ?? "");
  const setVal = (key: string, val: any) => setDynamicData((d: any) => {
    if (isGoi3 && activeTab === "gai") {
      return { ...d, gai: { ...(d.gai || {}), [key]: val } };
    }
    return { ...d, [key]: val };
  });
  const [result, setResult] = useState<{ amount: number; giftLink: string; orderId: string; paymentCode: string; paymentStatus: string; qrCodeUrl: string | null; status: string; trackLink: string; unlocked: boolean; templateKey?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [isConfirmingFree, setIsConfirmingFree] = useState(false);
  const [isSavingEdits, setIsSavingEdits] = useState(false);
  const [isDeletingOrder, setIsDeletingOrder] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [builderVolume, setBuilderVolume] = useState(0.5);
  
  async function handleDeleteOrder(targetId?: string) {
    const idToDelete = typeof targetId === "string" ? targetId : result?.orderId;
    if (!idToDelete) return;
    setIsDeletingOrder(true);
    try {
      const response = await fetch(`/api/orders/${idToDelete}`, {
        method: "DELETE"
      });
      if (response.ok) {
        toast.success("─É├ú x├│a ─æ╞ín th├ánh c├┤ng.");
        if (idToDelete === result?.orderId) {
          router.push("/dashboard/orders/new");
        } else {
          window.location.reload();
        }
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error ?? "Lß╗ùi x├│a ─æ╞ín.");
      }
    } catch (e) {
      toast.error("Lß╗ùi kß║┐t nß╗æi.");
    }
    setIsDeletingOrder(false);
  }
  

  const [orderPage, setOrderPage] = useState(1);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL");
  const [orderDateFilter, setOrderDateFilter] = useState("");
  const ordersPerPage = 5;
  const [isLocked, setIsLocked] = useState(false);
  const [editUnlockCount, setEditUnlockCount] = useState(0);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; type: "LOCK" | "UNLOCK" | "DELETE"; title: string; desc: string; onConfirm: () => void } | null>(null);

  const templateId = selectedTemplateId || (valentineOne?.id ?? "");
  const isConstellation = !!templateId && (templateId.includes("constellation") || templateId.includes("starry") || templateId.includes("valentine-1"));
  const isBirthday1 = !!templateId && templateId.includes("birthday-1");

  const selectedTemplate = useMemo(
    () => {
      // If we have a loaded template and its ID matches what's selected, use it
      // (covers cases where the template is a MOCK and not in the DB templates array)
      if (loadedTemplate && String(loadedTemplate.id) === String(activeTemplateId)) {
        return loadedTemplate as any;
      }
      return templates.find((template) => String(template.id) === String(activeTemplateId)) ?? valentineOne;
    },
    [activeTemplateId, templates, valentineOne, loadedTemplate],
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

  const [orderCategory, setOrderCategory] = useState<"ALL" | "REGULAR" | "WEDDING">("ALL");

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
  const isWedding1 = selectedComponentKey === "wedding-1" || selectedComponentKey === "wedding #1";
  const isWedding = selectedComponentKey.includes("wedding");
  const ALL_PACKAGES = [...SERVICE_PACKAGES, ...WEDDING_SERVICE_PACKAGES];

  useEffect(() => {
    // Load danh s├ích affiliate (ng╞░ß╗¥i giß╗¢i thiß╗çu) nß║┐u l├á ADMIN
    if (currentRole === "ADMIN") {
      fetch("/api/admin/affiliates")
        .then((res) => res.json())
        .then((data) => {
          if (data.affiliates) setAffiliates(data.affiliates);
        })
        .catch(() => {});
    }
  }, [currentRole]);

  useEffect(() => {
    // Tß╗▒ ─æß╗Öng chuyß╗ân Mß║½u giao diß╗çn nß║┐u G├│i dß╗ïch vß╗Ñ thay ─æß╗òi loß║íi (C╞░ß╗¢i <-> Th╞░ß╗¥ng)
    // ─Éiß╗üu n├áy ng─ân chß║╖n lß╗ùi "nhß║úy vß╗ü g├│i th╞░ß╗¥ng" khi ng╞░ß╗¥i d├╣ng cß╗æ chß╗ìn g├│i c╞░ß╗¢i.
    const isCurrentPackageWedding = selectedPackage.includes("wedding");
    if (isCurrentPackageWedding && !isWedding) {
      const firstWedding = templates.find(t => t.component_key.includes("wedding"));
      if (firstWedding) {
        setSelectedTemplateId(firstWedding.id);
        setTemplateSearch(firstWedding.name);
      }
    } else if (!isCurrentPackageWedding && isWedding) {
      setSelectedTemplateId(valentineOne?.id ?? templates[0]?.id);
      setTemplateSearch(valentineOne?.name ?? templates[0]?.name ?? "");
    }
  }, [selectedPackage, isWedding, templates, valentineOne]);
  const isEditing = !!result;
  const canEditTemplate = isEditing;

  useEffect(() => {
    // Tß╗▒ ─æß╗Öng ─æiß╗ün dß╗» liß╗çu mß║½u (mock data) nß║┐u l├á mß║½u Wedding v├á ch╞░a c├│ dß╗» liß╗çu (chß╗ë ├íp dß╗Ñng cho tß║ío ─æ╞ín mß╗¢i)
    if (isWedding && !initialOrder && Object.keys(dynamicData).length === 0) {
      const mockData = {
        groomName: "Minh Ho├áng",
        brideName: "Mai H╞░╞íng",
        heroImage: "/assets/wedding/wedding-1/anhchung1.jpg",
        groomImage: "/assets/wedding/wedding-1/chure.jpg",
        brideImage: "/assets/wedding/wedding-1/codau.jpg",
        dividerImage: "/assets/wedding/wedding-1/anhchung2.jpg",
        footerImage: "/assets/wedding/wedding-1/anhchung8.jpg",
        letterText: "─É╞░ß╗úc sß╗▒ ─æß╗ông thuß║¡n cß╗ºa gia ─æ├¼nh hai b├¬n\nCh├║ng t├┤i tr├ón trß╗ìng k├¡nh mß╗¥i qu├╜ kh├ích tß╗¢i dß╗▒ bß╗»a tiß╗çc chung vui c├╣ng gia ─æ├¼nh ch├║ng t├┤i",
        groomFather: "├öng Trß║ºn V─ân Nam",
        groomMother: "B├á Nguyß╗àn Thß╗ï My",
        brideFather: "├öng Nguyß╗àn V─ân C╞░ß╗¥ng",
        brideMother: "B├á L├¬ Thß╗ï Dung",
        weddingDate: "2026-12-14T11:30",
        eventAddress: "T╞░ gia nh├á trai: Sß╗æ 10, ─É╞░ß╗¥ng V╞░ß╗¥n L├ái, T├ón Ph├║, TP. HCM",
        mapUrl: "https://maps.app.goo.gl/xxx",
        mapImage: "/assets/lovepics/map-preview.jpg",
        // tiecDate and tiecName removed to prevent showing uneditable sections
        // for qr codes
        qrBankName: "MB BANK",
        qrBankAccount: "123456789",
        qrBankOwner: "MINH HOANG",
        qrBankNameGai: "VCB",
        qrBankAccountGai: "987654321",
        qrBankOwnerGai: "MAI HUONG",
        musicUrl: "/assets/songs/general/Da LAB - Tß╗½ Ng├áy Em ─Éß║┐n (Official Music Video)_128k.mp3"
      };
      
      setDynamicData({
        ...mockData,
        gai: { ...mockData }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWedding, initialOrder]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const previewContainer = document.getElementById("builder-preview");
    if (!previewContainer) return;
    const audios = previewContainer.querySelectorAll("audio");
    audios.forEach(audio => {
      audio.volume = builderVolume;
      audio.muted = builderVolume === 0;
      if (builderVolume > 0 && audio.paused && audio.src && !audio.src.includes("click") && !audio.src.includes("yay") && !audio.src.includes("meow") && !audio.src.includes("lopi") && !audio.src.includes("touch")) {
        // Attempt to play background music in preview if it's paused
        audio.play().catch(() => {});
      }
    });
  }, [builderVolume, generalAudioUrl, selectedComponentKey, previewStepIndex]);

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
    ...dynamicData,
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
    forceStep: previewStepIndex,
    forceStage: selectedComponentKey === "dating-1" ? dating1Stages[previewStepIndex] : (previewStepIndex + 1),
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
    ...(isValentine2 ? { ...valentine2Config, musicUrl: generalAudioUrl } : {}),
    ...(!isBirthdayMagic ? {
      memories: [
        { message: stage3Message1, title: "Tin nhß║»n 1" },
        { message: stage3Message2, title: "Tin nhß║»n 2" },
        { message: stage3Message3, title: "Tin nhß║»n 3" },
        { message: stage3Message4, title: "Tin nhß║»n 4" },
      ],
    } : {}),
    ...(isBirthdayMagic ? {
      messages: birthdayMessage ? birthdayMessage.split('\n').filter(Boolean) : undefined,
      musicUrl: generalAudioUrl,
      age: birthdayAge,
      imageUrl: stage1ImageUrl,
      memories: birthdayMemories.map((memory, index) => ({
        ...memory,
        title: `Kß╗╖ niß╗çm ${index + 1}`,
      })),
      instructionText: birthdayInstructionText,
      wishPromptText: birthdayWishPromptText,
      wishAcceptButton: birthdayWishAcceptButton,
      wishDeclineButton: birthdayWishDeclineButton,
      recordingText: birthdayRecordingText,
      recordingCompleteButton: birthdayRecordingCompleteButton,
      giftPromptText: birthdayGiftPromptText,
      balloonText: birthdayBalloonText,
      bannerTitle: birthdayGreetingCardSignature,
      bannerName: birthdayFinal3DSignature,
      finalMessage: birthdayFinalMessage,
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
      accentColor: stage1Accent,
    } : {}),
    // Wedding: inject hasTiecMung flags derived from package type
    ...(isWedding ? {
      // hasTiecMung = true nß║┐u c├│ tiecName hoß║╖c tiecDate (Nh├á Trai)
      hasTiecMung: !!(dynamicData.tiecName || dynamicData.tiecDate),
      // hasTiecMungGai = true chß╗ë khi G├│i 2 (cß║ú 2 tiß╗çc) V├Ç c├│ data Nh├á G├íi
      hasTiecMungGai: isGoi2 ? !!(dynamicData.tiecNameGai || dynamicData.tiecDateGai) : false,
      ...(!isGoi2 ? {
        tiecNameGai: undefined,
        tiecDateGai: undefined,
        tiecAddressGai: undefined,
        tiecMapUrlGai: undefined
      } : {})
    } : {}),
    groomFamily: (dynamicData.groomFather !== undefined || dynamicData.groomMother !== undefined) 
      ? [dynamicData.groomFather, dynamicData.groomMother].filter(Boolean).join("\n") 
      : dynamicData.groomFamily,
    brideFamily: (dynamicData.brideFather !== undefined || dynamicData.brideMother !== undefined)
      ? [dynamicData.brideFather, dynamicData.brideMother].filter(Boolean).join("\n")
      : dynamicData.brideFamily,
    ...(function() {
      const wdStr = dynamicData.weddingDate || "2026-12-14T11:30";
      let d = new Date(wdStr);
      if (isNaN(d.getTime())) d = new Date("2026-12-14T11:30");
      const dayNames = ["Chß╗º Nhß║¡t", "Thß╗⌐ Hai", "Thß╗⌐ Ba", "Thß╗⌐ T╞░", "Thß╗⌐ N─âm", "Thß╗⌐ S├íu", "Thß╗⌐ Bß║úy"];
      
      // If the user is currently interacting with weddingDate, we MUST recompute the parts
      // rather than using the statically saved ones in dynamicData.
      const hasWeddingDateInput = dynamicData.weddingDate !== undefined;
      
      return {
        weddingDay: hasWeddingDateInput ? d.getDate().toString() : (dynamicData.weddingDay || d.getDate().toString()),
        weddingMonth: hasWeddingDateInput ? `Th├íng ${d.getMonth() + 1}` : (dynamicData.weddingMonth || `Th├íng ${d.getMonth() + 1}`),
        weddingYear: hasWeddingDateInput ? d.getFullYear().toString() : (dynamicData.weddingYear || d.getFullYear().toString()),
        weddingDayOfWeek: hasWeddingDateInput ? dayNames[d.getDay()] : (dynamicData.weddingDayOfWeek || dayNames[d.getDay()])
      };
    })()
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

  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Control audio volume inside the preview
  useEffect(() => {
    if (typeof document === "undefined") return;
    const audios = document.querySelectorAll("#builder-preview audio");
    audios.forEach((audio: any) => {
      audio.volume = builderVolume;
    });
    if (previewAudioRef.current) {
      previewAudioRef.current.volume = builderVolume;
    }
  }, [builderVolume, selectedTemplateId, selectedComponentKey, customData]);

  // Dedicated background music previewer
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    let urlToPlay = generalAudioUrl;
    if (!urlToPlay) {
      urlToPlay = GENERAL_SONGS[Math.floor(Math.random() * GENERAL_SONGS.length)];
    }
    
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
    
    const audio = new Audio(urlToPlay);
    previewAudioRef.current = audio;
    audio.volume = builderVolume;
    audio.loop = true;
    
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [generalAudioUrl]);


  async function createOrder() {
    setIsSubmitting(true);
    setError("");
    setResult(null);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: ALL_PACKAGES.find(p => p.id === selectedPackage)?.price ?? (isWedding ? 209000 : 99000),
        buyerContact,
        buyerName,
        customData,
        recipientName,
        templateId: selectedTemplateId,
        isFreeOrder: canCreateFree,
        affiliateId: affiliateId || undefined,
      }),
    });

    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      toast.error(data.error ?? "Kh├┤ng tß║ío ─æ╞░ß╗úc link. Kiß╗âm tra ─æ─âng nhß║¡p v├á dß╗» liß╗çu.");
      return;
    }
    toast.success("Tß║ío ─æ╞ín th├ánh c├┤ng!");

    setResult({
      amount: Number(data.amount ?? ALL_PACKAGES.find(p => p.id === selectedPackage)?.price ?? (isWedding ? 209000 : 0)),
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

    // Update URL to the newly created order so it's bookmarkable and shareable
    if (data.orderId) {
      router.replace(`/dashboard/orders/${data.orderId}`, { scroll: false });
    }
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
    
    const mergedData: Record<string, any> = overrideData ? { ...customData, ...overrideData } : { ...customData };

    if (selectedComponentKey.includes("wedding")) {
      const separator = "\n";
      
      if (mergedData.groomFather !== undefined || mergedData.groomMother !== undefined) {
        mergedData.groomFamily = [mergedData.groomFather, mergedData.groomMother].filter(Boolean).join(separator);
      }
      if (mergedData.brideFather !== undefined || mergedData.brideMother !== undefined) {
        mergedData.brideFamily = [mergedData.brideFather, mergedData.brideMother].filter(Boolean).join(separator);
      }
      
      if (mergedData.weddingDate) {
        let d = new Date(mergedData.weddingDate);
        if (!isNaN(d.getTime())) {
          const dayNames = ["Chß╗º Nhß║¡t", "Thß╗⌐ Hai", "Thß╗⌐ Ba", "Thß╗⌐ T╞░", "Thß╗⌐ N─âm", "Thß╗⌐ S├íu", "Thß╗⌐ Bß║úy"];
          mergedData.weddingDay = d.getDate().toString();
          mergedData.weddingMonth = `Th├íng ${d.getMonth() + 1}`;
          mergedData.weddingYear = d.getFullYear().toString();
          mergedData.weddingDayOfWeek = dayNames[d.getDay()];
        }
      }
    }

    const response = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customData: mergedData,
        orderId: result.orderId,
        recipientName,
        buyerName,
        templateId: selectedTemplateId,
        affiliateId: affiliateId || undefined,
      }),
    });
    const data = await response.json().catch(() => ({}));
    setIsSavingEdits(false);

    if (!response.ok) {
      toast.error(data.error ?? "Kh├┤ng l╞░u ─æ╞░ß╗úc chß╗ënh sß╗¡a.");
      return;
    }

    toast.success("─É├ú l╞░u chß╗ënh sß╗¡a template cho ─æ╞ín n├áy.");
  }

  async function confirmPaymentManually(isFree = false) {
    if (!result || currentRole !== "ADMIN") return;

    if (isFree) setIsConfirmingFree(true);
    else setIsConfirmingPayment(true);
    
    setError("");

    const response = await fetch(`/api/orders/${result.orderId}/confirm-payment${isFree ? "?free=true" : ""}`, {
      method: "POST",
    });
    const data = await response.json().catch(() => ({}));
    
    if (isFree) setIsConfirmingFree(false);
    else setIsConfirmingPayment(false);

    if (!response.ok) {
      toast.error(data.error ?? "Kh├┤ng x├íc nhß║¡n ─æ╞░ß╗úc thanh to├ín.");
      return;
    }
    toast.success(isFree ? "─É├ú mß╗ƒ kh├│a miß╗àn ph├¡." : "─É├ú x├íc nhß║¡n thanh to├ín.");

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
    // Chß╗ë cho kh├│a khi ─æ╞ín ─æ├ú ─æ╞░ß╗úc thanh to├ín
    if (!result?.unlocked) {
      toast.error("─É╞ín ch╞░a ─æ╞░ß╗úc thanh to├ín, kh├┤ng thß╗â kh├│a!");
      return;
    }
    setConfirmModal({
      open: true,
      type: "LOCK",
      title: "X├íc nhß║¡n kh├│a ─æ╞ín",
      desc: "Bß║ín c├│ chß║»c chß║»n muß╗æn kh├│a ─æ╞ín n├áy? Kh├│a xong sß║╜ kh├┤ng thß╗â chß╗ënh sß╗¡a trß╗½ khi mß╗ƒ kh├│a (c├│ thß╗â tß╗æn ph├¡).",
      onConfirm: async () => {
        setIsLocked(true);
        await saveOrderEdits({ isLocked: true });
        toast.success("─É├ú kh├│a ─æ╞ín th├ánh c├┤ng!");
      }
    });
  }

  async function handleUnlock() {
    const freeEdits = getFreeEdits(selectedPackage);
    const hasFreeEdit = editUnlockCount < freeEdits;
    
    setConfirmModal({
      open: true,
      type: "UNLOCK",
      title: hasFreeEdit ? `Mß╗ƒ kh├│a miß╗àn ph├¡ (lß║ºn ${editUnlockCount + 1}/${freeEdits})` : "Mß╗ƒ kh├│a t├¡nh ph├¡",
      desc: hasFreeEdit 
        ? `Bß║ín c├▓n ${freeEdits - editUnlockCount} lß║ºn mß╗ƒ kh├│a miß╗àn ph├¡ theo g├│i dß╗ïch vß╗Ñ.\n\nX├íc nhß║¡n mß╗ƒ kh├│a ─æß╗â sß╗¡a tiß║┐p?`
        : `─É╞ín n├áy ─É├â Hß║╛T l╞░ß╗út sß╗¡a miß╗àn ph├¡ theo g├│i.\n\nViß╗çc mß╗ƒ kh├│a sß╗¡a tiß║┐p sß║╜ T├ìNH PH├ì TH├èM 19.000─æ (Vui l├▓ng thu ph├¡ tß╗½ kh├ích).\n\nHß╗ç thß╗æng sß║╜ tß║ío QR thanh to├ín. Sau khi thanh to├ín xong, ─æ╞ín mß╗¢i ─æ╞░ß╗úc mß╗ƒ kh├│a.`,
      onConfirm: async () => {
        const newCount = editUnlockCount + 1;
        
        if (hasFreeEdit) {
          // Mß╗ƒ kh├│a miß╗àn ph├¡: mß╗ƒ ngay
          setIsLocked(false);
          setEditUnlockCount(newCount);
          await saveOrderEdits({ isLocked: false, editUnlockCount: newCount });
          toast.success(`─É├ú mß╗ƒ kh├│a miß╗àn ph├¡ (lß║ºn ${newCount}/${freeEdits})! Bß║ín c├│ thß╗â sß╗¡a tiß║┐p.`);
        } else {
          // Hß║┐t l╞░ß╗út miß╗àn ph├¡: tß║ío QR thanh to├ín, giß╗» kh├│a ─æß║┐n khi thanh to├ín xong
          setIsSavingEdits(true);
          try {
            const res = await fetch(`/api/orders/${result?.orderId}/unlock`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ editUnlockCount: newCount })
            });
            const data = await res.json();
            
            if (!res.ok) {
              toast.error(data.error || "Kh├┤ng thß╗â tß║ío thanh to├ín mß╗ƒ kh├│a.");
            } else {
              toast.success("─É├ú tß║ío QR thanh to├ín 19K. Sau khi kh├ích chuyß╗ân khoß║ún, ─æ╞ín sß║╜ tß╗▒ ─æß╗Öng mß╗ƒ kh├│a!");
              // Giß╗» isLocked = true, ─æß╗úi thanh to├ín xong webhook mß╗¢i mß╗ƒ
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
            toast.error("─É├ú xß║úy ra lß╗ùi.");
          }
          setIsSavingEdits(false);
        }
      }
    });
  }

  function loadOrder(order: any) {
    const cd = order.custom_data || {};
    const partialTemplate = getRelationOne(order.templates);

    // Always resolve to a FULL template from the templates prop array.
    // The DB join only returns {id, name, component_key} ΓÇö not enough for selectedComponentKey derivation.
    const fullTemplate =
      // 1. Match by template_id (UUID or MOCK id)
      templates.find(t => String(t.id) === String(order.template_id)) ||
      // 2. Match by the partial template's id from DB join
      (partialTemplate ? templates.find(t => String(t.id) === String((partialTemplate as any).id)) : null) ||
      // 3. Match by component_key stored in customData
      templates.find(t => t.component_key === cd.componentKey || t.slug === cd.componentKey) ||
      // 4. Match by component_key from DB join
      (partialTemplate ? templates.find(t => t.component_key === (partialTemplate as any).component_key) : null) ||
      // 5. Fall back to partial from DB join (may still work for display)
      partialTemplate ||
      null;

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
    setSenderName(order.custom_data?.senderName || "Anh");
    setAffiliateId(order.affiliate_id || "");
    if (fullTemplate) {
      setLoadedTemplate(fullTemplate as any);
      setSelectedTemplateId((fullTemplate as any).id);
      setTemplateSearch((fullTemplate as any).name);
    } else {
      setSelectedTemplateId(order.template_id);
    }
    
    // Nß║┐u c├│ package ─æ╞░ß╗úc l╞░u trong customData th├¼ load l├¬n
    if (cd.servicePackage) setSelectedPackage(cd.servicePackage);

    const loadedTemplateKey = `${fullTemplate?.component_key ?? cd.componentKey ?? ""} ${fullTemplate?.name ?? ""}`.toLowerCase();
    
    // Split family fields for backward compatibility if it's a wedding template
    if (loadedTemplateKey.includes("wedding")) {
      const isW1 = loadedTemplateKey.includes("wedding-1") || loadedTemplateKey.includes("wedding-6");
      const sep = isW1 ? "\\n" : " & ";
      if (cd.groomFamily && !cd.groomFather) {
        const parts = String(cd.groomFamily).split(sep === "\\n" ? /\n|\\n/ : / & | - /);
        cd.groomFather = parts[0]?.trim();
        cd.groomMother = parts[1]?.trim();
      }
      if (cd.brideFamily && !cd.brideFather) {
        const parts = String(cd.brideFamily).split(sep === "\\n" ? /\n|\\n/ : / & | - /);
        cd.brideFather = parts[0]?.trim();
        cd.brideMother = parts[1]?.trim();
      }
    }
    
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
    if (cd.messages && Array.isArray(cd.messages)) {
      setBirthdayMessage(cd.messages.join('\n'));
    } else if (cd.birthdayMessage) {
      setBirthdayMessage(cd.birthdayMessage);
    }
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
    if (cd.bannerTitle) setBirthdayGreetingCardSignature(cd.bannerTitle);
    else if (cd.greetingCardSignature) setBirthdayGreetingCardSignature(cd.greetingCardSignature);
    
    if (cd.bannerName) setBirthdayFinal3DSignature(cd.bannerName);
    else if (cd.final3DSignature) setBirthdayFinal3DSignature(cd.final3DSignature);
    
    if (cd.finalMessage) setBirthdayFinalMessage(cd.finalMessage);
    if (cd.stage1Instruction) setStage1Instruction(cd.stage1Instruction);
    if (cd.stage1Background) setStage1Background(cd.stage1Background);
    if (cd.stage1Accent) setStage1Accent(cd.stage1Accent);
    if (cd.stage1ImageUrl) setStage1ImageUrl(cd.stage1ImageUrl);
    if (cd.stage1MediaType) setStage1MediaType(cd.stage1MediaType);
    if (cd.stage1RevealTitle) setStage1RevealTitle(cd.stage1RevealTitle);
    if (cd.stage1RevealBody) setStage1RevealBody(cd.stage1RevealBody);
    if (cd.stage1RevealButton) setStage1RevealButton(cd.stage1RevealButton);
    if (cd.stage2Title) setStage2Title(cd.stage2Title);
    if (cd.stage2Subtitle) setStage2Subtitle(cd.stage2Subtitle);
    if (cd.stage2ImageCaption) setStage2ImageCaption(cd.stage2ImageCaption);
    if (cd.stage2Quote) setStage2Quote(cd.stage2Quote);
    if (cd.stage2NextButton) setStage2NextButton(cd.stage2NextButton);
    if (cd.stage2Background) setStage2Background(cd.stage2Background);
    if (cd.stage2Accent) setStage2Accent(cd.stage2Accent);
    if (cd.stage2ImageUrl) setStage2ImageUrl(cd.stage2ImageUrl);
    if (cd.stage2MediaType) setStage2MediaType(cd.stage2MediaType);
    if (cd.stage3Title) setStage3Title(cd.stage3Title);
    if (cd.stage3Subtitle) setStage3Subtitle(cd.stage3Subtitle);
    if (cd.stage3MusicLabel) setStage3MusicLabel(cd.stage3MusicLabel);
    if (cd.stage3MediaUrl) setStage3MediaUrl(cd.stage3MediaUrl);
    if (cd.stage3MediaType) setStage3MediaType(cd.stage3MediaType);
    if (cd.stage3AudioUrl) setStage3AudioUrl(cd.stage3AudioUrl);
    if (cd.stage3NextButton) setStage3NextButton(cd.stage3NextButton);
    if (cd.stage3Message1) setStage3Message1(cd.stage3Message1);
    if (cd.stage3Message2) setStage3Message2(cd.stage3Message2);
    if (cd.stage3Message3) setStage3Message3(cd.stage3Message3);
    if (cd.stage3Message4) setStage3Message4(cd.stage3Message4);
    if (cd.stage3Background) setStage3Background(cd.stage3Background);
    if (cd.stage3Accent) setStage3Accent(cd.stage3Accent);
    if (cd.stage4Title) setStage4Title(cd.stage4Title);
    if (cd.stage5Title) setStage5Title(cd.stage5Title);
    if (cd.stage4Prompt) setStage4Prompt(cd.stage4Prompt);
    if (cd.stage4MicInstruction) setStage4MicInstruction(cd.stage4MicInstruction);
    if (cd.stage4FallbackButton) setStage4FallbackButton(cd.stage4FallbackButton);
    if (cd.stage4RevealTitle) setStage4RevealTitle(cd.stage4RevealTitle);
    if (cd.stage4RevealBody) setStage4RevealBody(cd.stage4RevealBody);
    if (cd.stage4RevealButton) setStage4RevealButton(cd.stage4RevealButton);
    if (cd.stage4Background) setStage4Background(cd.stage4Background);
    if (cd.stage4Accent) setStage4Accent(cd.stage4Accent);
    if (cd.stage4ImageUrl) setStage4ImageUrl(cd.stage4ImageUrl);
    if (cd.stage4MediaType) setStage4MediaType(cd.stage4MediaType);
    if (cd.finalTitle) setFinalTitle(cd.finalTitle);
    if (cd.finalSubtitle) setFinalSubtitle(cd.finalSubtitle);
    if (cd.finalCta) setFinalCta(cd.finalCta);
    if (cd.finalBackground) setFinalBackground(cd.finalBackground);
    if (cd.finalAccent) setFinalAccent(cd.finalAccent);
    if (cd.giftTitle) setGiftTitle(cd.giftTitle);
    if (cd.giftBody) setGiftBody(cd.giftBody);
    if (cd.proposedDate) setProposedDate(cd.proposedDate);
    if (cd.giftDeclineButton) setGiftDeclineButton(cd.giftDeclineButton);
    if (cd.giftAcceptButton) setGiftAcceptButton(cd.giftAcceptButton);
    if (cd.giftAcceptedTitle) setGiftAcceptedTitle(cd.giftAcceptedTitle);
    if (cd.giftAcceptedBody) setGiftAcceptedBody(cd.giftAcceptedBody);
    if (cd.giftDeclinedTitle) setGiftDeclinedTitle(cd.giftDeclinedTitle);
    if (cd.giftDeclinedBody) setGiftDeclinedBody(cd.giftDeclinedBody);
    if (cd.giftBackButton) setGiftBackButton(cd.giftBackButton);
    if (cd.giftRescheduleButton) setGiftRescheduleButton(cd.giftRescheduleButton);
    if (cd.contractTitle) setContractTitle(cd.contractTitle);
    if (cd.contractBody) setContractBody(cd.contractBody);
    if (cd.contractRejectButton) setContractRejectButton(cd.contractRejectButton);
    if (cd.contractHoldInstruction) setContractHoldInstruction(cd.contractHoldInstruction);
    
    setDynamicData(cd);
    
    setIsLocked(cd.isLocked ?? false);
    setEditUnlockCount(cd.editUnlockCount ?? 0);

    window.scrollTo({ top: 0, behavior: "smooth" });
    // Update URL to reflect the order being edited (without full page reload)
    if (order.public_id) {
      router.replace(`/dashboard/orders/${order.public_id}`, { scroll: false });
    }
  }

  // ─É╞ín ─æ╞░ß╗úc coi l├á kh├│a nß║┐u: ─æ├ú c├│ result (tß║ío ─æ╞ín xong) V├Ç ─æ╞░ß╗úc bß║¡t kh├│a thß╗º c├┤ng
  const orderIsLocked = !!result && isLocked;
  // Hiß╗ân thß╗ï workspace sß╗¡a khi: ch╞░a c├│ ─æ╞ín, hoß║╖c ─æ╞ín ─æ├ú mß╗ƒ kh├│a (thanh to├ín ─æ╞░ß╗úc)
  const showSetupWorkspace = !result || result.unlocked;

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
        <div className="w-8 h-8 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mb-4"></div>
        <p className="text-white/60">─Éang tß║úi dß╗» liß╗çu ─æ╞ín...</p>
      </div>
    );
  }

  return (
    <div className={showSetupWorkspace ? "grid items-start gap-6 xl:grid-cols-[1fr_460px]" : "grid items-start gap-6"}>
      <div className="grid content-start gap-5">
        <Section title="Th├┤ng tin ─æ╞ín" className={`relative z-50 ${orderIsLocked ? "pointer-events-none opacity-60" : ""}`}>
          <TextInput label="T├¬n kh├ích mua" onChange={setBuyerName} value={buyerName} />
          <TextInput label="TikTok / S─ÉT kh├ích" onChange={setBuyerContact} value={buyerContact} />
          {currentRole === "ADMIN" && affiliates.length > 0 && (
            <label className="grid gap-2 text-sm md:col-span-2">
              <span className="text-white/64 flex items-center gap-2">
                <span>Ng╞░ß╗¥i giß╗¢i thiß╗çu</span>
                <span className="text-[10px] text-pink-400/80 font-normal bg-pink-500/10 px-2 py-0.5 rounded-full">Hoa hß╗ông Affiliate</span>
              </span>
              <select
                className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none focus:border-pink-300/50 text-white"
                value={affiliateId}
                onChange={(e) => setAffiliateId(e.target.value)}
              >
                <option value="" className="text-black">-- Kh├┤ng c├│ ng╞░ß╗¥i giß╗¢i thiß╗çu --</option>
                {affiliates.map((af) => (
                  <option key={af.id} value={af.id} className="text-black">
                    {af.name} ({af.ref_code})
                  </option>
                ))}
              </select>
            </label>
          )}
          {/* Bß╗ÿ Lß╗îC LOß║áI ─É╞áN */}
          <div className="md:col-span-2 mt-2 mb-2 flex items-center gap-6">
            <span className="text-white/64 text-sm font-medium">Ph├ón loß║íi:</span>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="radio" disabled={!!result} checked={orderCategory === "ALL"} onChange={() => setOrderCategory("ALL")} className="text-pink-500" />
              <span className={orderCategory === "ALL" ? "text-pink-300 font-bold" : "text-white/80"}>Tß║Ñt cß║ú</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="radio" disabled={!!result} checked={orderCategory === "REGULAR"} onChange={() => {
                setOrderCategory("REGULAR");
                if (selectedPackage.includes("wedding")) setSelectedPackage(SERVICE_PACKAGES[2]?.id || SERVICE_PACKAGES[0].id);
              }} className="text-pink-500" />
              <span className={orderCategory === "REGULAR" ? "text-pink-300 font-bold" : "text-white/80"}>Thiß╗çp Th╞░ß╗¥ng</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="radio" disabled={!!result} checked={orderCategory === "WEDDING"} onChange={() => {
                setOrderCategory("WEDDING");
                if (!selectedPackage.includes("wedding")) setSelectedPackage(WEDDING_SERVICE_PACKAGES[0].id);
              }} className="text-pink-500" />
              <span className={orderCategory === "WEDDING" ? "text-pink-300 font-bold" : "text-white/80"}>Thiß╗çp C╞░ß╗¢i</span>
            </label>
          </div>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="text-white/64">G├│i dß╗ïch vß╗Ñ (T├¡nh gi├í)</span>
            <select
              className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none focus:border-pink-300/50 text-white disabled:opacity-50"
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              disabled={!!result}
            >
              {orderCategory !== "WEDDING" && (
                <optgroup label="G├│i Thiß╗çp Th╞░ß╗¥ng (Valentine, Sinh nhß║¡t, Tß╗Å t├¼nh)">
                  {SERVICE_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id} className="text-black">
                      {pkg.label}
                    </option>
                  ))}
                </optgroup>
              )}
              {orderCategory !== "REGULAR" && (
                <optgroup label="G├│i Thiß╗çp C╞░ß╗¢i (Wedding)">
                  {WEDDING_SERVICE_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id} className="text-black">
                      {pkg.label}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </label>

          <div className="relative grid gap-2 text-sm md:col-span-2" ref={dropdownRef}>
            <span className="text-white/64">Mß║½u giao diß╗çn</span>
            <input
              className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none transition focus:border-pink-300/50"
              onChange={(event) => {
                setTemplateSearch(event.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => {
                setIsDropdownOpen(true);
                // Nß║┐u click v├áo m├á t├¬n template ─æang khß╗¢p, b├┤i ─æen ─æß╗â tiß╗çn g├╡ ─æ├¿ (search)
                if (templateSearch === templates.find(t => String(t.id) === String(selectedTemplateId))?.name) {
                  setTemplateSearch("");
                }
              }}
              placeholder="T├¼m nhanh theo t├¬n mß║½u, dß╗ïp hoß║╖c m├┤ tß║ú..."
              value={templateSearch}
            />
            {isDropdownOpen && (
              <ul className="absolute left-0 top-[76px] z-50 max-h-60 w-full overflow-y-auto rounded-xl border border-white/20 bg-white shadow-2xl text-gray-800">
                {filteredTemplates.length === 0 ? (
                  <li className="px-4 py-3 text-gray-500">Kh├┤ng t├¼m thß║Ñy mß║½u n├áo ph├╣ hß╗úp.</li>
                ) : (
                  Object.entries(
                    filteredTemplates.reduce((acc, template) => {
                      const searchable = `${template.component_key} ${template.name} ${(template as any).slug || ""}`.toLowerCase();
                      let categoryName = "Valentine";
                      if (searchable.includes("wedding")) categoryName = "C╞░ß╗¢i hß╗Åi";
                      else if (searchable.includes("dating") || searchable.includes("gacha") || searchable.includes("will-you-date-me") || searchable.includes("v├⌐ hß║╣n h├▓") || searchable.includes("mß║¡t m├ú")) categoryName = "Tß╗Å t├¼nh";
                      else if (searchable.includes("birthday") || searchable.includes("sinh nhß║¡t") || searchable.includes("b├ío thß╗⌐c") || searchable.includes("hß╗Öp qu├á")) categoryName = "Sinh nhß║¡t";
                      else if (searchable.includes("sorry") || searchable.includes("xin lß╗ùi") || searchable.includes("l├ám h├▓a") || searchable.includes("xß║ú giß║¡n") || searchable.includes("khß╗ºng long")) categoryName = "Xin lß╗ùi";

                      const isWeddingTemp = categoryName === "C╞░ß╗¢i hß╗Åi";
                      const isPackageWedding = selectedPackage.includes("wedding");
                      
                      // Bß║»t buß╗Öc: Loß║íi Mß║½u giao diß╗çn phß║úi khß╗¢p ho├án to├án vß╗¢i loß║íi G├│i dß╗ïch vß╗Ñ ─æ├ú chß╗ìn
                      if (isPackageWedding && !isWeddingTemp) return acc;
                      if (!isPackageWedding && isWeddingTemp) return acc;
                      
                      if (!acc[categoryName]) acc[categoryName] = [];
                      acc[categoryName].push(template);
                      return acc;
                    }, {} as Record<string, typeof filteredTemplates>)
                  ).map(([categoryName, templatesInCategory]) => (
                    <div key={categoryName}>
                      <li className="px-4 py-2 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider sticky top-0 z-10 border-b border-gray-100">
                        {categoryName}
                      </li>
                      {templatesInCategory.map((template) => {
                        const isSelected = template.id === activeTemplateId;
                        return (
                      <li
                        key={template.id}
                        className={`cursor-pointer rounded-lg px-4 py-3 transition hover:bg-gray-100 ${isSelected ? "bg-pink-50 text-pink-600" : ""}`}
                        onClick={() => {
                          if (isGoi3KhacMau && activeTab === "gai") {
                            setDynamicData((d: any) => ({ ...d, gai: { ...(d.gai || {}), templateId: template.id, componentKey: template.component_key } }));
                          } else {
                            if (isGoi3KhacMau && !dynamicData?.gai?.templateId) {
                              setDynamicData((d: any) => ({ ...d, gai: { ...(d.gai || {}), templateId: selectedTemplateId } }));
                            }
                            setSelectedTemplateId(template.id);
                          }
                          setTemplateSearch(template.name);
                          setIsDropdownOpen(false);
                          // Clear loaded template so the dropdown selection takes effect
                          setLoadedTemplate(null);
                          // Load defaults manually so it doesn't overwrite loadOrder
                          const rawKey = template.component_key ?? "";
                          const templateName = template.name?.toLowerCase() ?? "";
                          const isDating = rawKey.includes("will-you-date-me") || templateName.includes("date me") || templateName.includes("dating");

                          if (isDating) {
                            setStage1Instruction("Xin ch├áo xinh ─æß║╣p...");
                            setQuestion("Bß║ín c├│ muß╗æn ─æi ch╞íi c├╣ng m├¼nh kh├┤ng?");
                            setGiftAcceptButton("C├ô! ΓÖÑ");
                            setGiftDeclineButton("KH├öNG! Γÿ╣\nThß║¡t sao?\nBß║ín chß║»c chß╗⌐?\nSuy ngh─⌐ lß║íi ─æi!\nC╞í hß╗Öi cuß╗æi c├╣ng...\n─Éß╗½ng ngß║íi!\nN├│i ─æß╗ông ├╜ ─æi n├áo!");
                            setStage2Title("Yayyy!!! ≡ƒî╕");
                            setStage2Subtitle("M├¼nh rß║Ñt h├ío hß╗⌐c ─æ╞░ß╗úc gß║╖p bß║ín!");
                            setStage3Title("Bß║ín muß╗æn ─æi ─æ├óu n├¿?");
                            setLocationOptions(["C├á ph├¬ Γÿò", "─Éi ─ân ≡ƒì╜∩╕Å", "Xem phim ≡ƒÄ¼", "C├┤ng vi├¬n ≡ƒî│", "Mua sß║»m ≡ƒ¢ì∩╕Å", "L╞░ß╗ún phß╗æ ≡ƒÅÖ∩╕Å"]);
                            setStage4Title("Khi n├áo th├¼ bß║ín rß║únh n├¿?");
                            setStage5Title("Bß║ín muß╗æn ─ân g├¼ n├¿ ≡ƒÿï");
                            setFoodOptions(["B├║n ─æß║¡u", "Phß╗ƒ", "B├║n b├▓", "Mß╗│ Quß║úng", "Mß╗│ cay", "Xi├¬n bß║⌐n"]);
                            setGiftTitle("Bß║ín muß╗æn uß╗æng g├¼?");
                            setDrinkOptions(["C├á ph├¬", "Tr├á", "Tr├á Sß╗»a", "Tr├á Matcha", "Sinh tß╗æ", "N╞░ß╗¢c ├⌐p"]);
                            setFinalTitle("─É├ú xong! ≡ƒÆò");
                            setFinalSubtitle("M├¼nh rß║Ñt mong ─æ╞░ß╗úc gß║╖p bß║ín! Buß╗òi hß║╣n cß╗ºa ch├║ng ta sß║╜ thß║¡t ho├án hß║úo.");
                            setSignOffText("Th╞░╞íng mß║┐n");
                            setStage1Background(""); // backgroundImage
                            setStage2Background("#fff0f6"); // backgroundColor
                            setStage1Accent("#f43f5e"); // accentColor
                          } else if (rawKey.includes("birthday") || templateName.includes("birthday")) {
                            setStage1Background("");
                            setStage2Background("#16081d");
                            setStage1Accent("#a855f7");
                          } else {
                            setStage1Instruction("Nß╗æi c├íc ng├┤i sao");
                            setQuestion("Em c├│ ─æß╗ông ├╜ c├╣ng anh viß║┐t tiß║┐p c├óu chuyß╗çn n├áy kh├┤ng?");
                            setGiftAcceptButton("L├¬n ─æß╗ô th├┤i!");
                            setGiftDeclineButton("─Éß╗â khi kh├íc");
                            setStage2Title("Quß╗╣ ─Éß║ío Hß╗ùn Loß║ín");
                            setStage2Subtitle("Tß╗½ tr╞░ß╗¥ng ─æang nhiß╗àu loß║ín. H├úy k├⌐o c├íc v├¼ sao vß╗ü ─æ├║ng quß╗╣ ─æß║ío.");
                            setStage3Title("Ch├▓m Sao Thanh ├ém");
                            setStage4Title("Thß╗¥i gian hß║╣n");
                            setStage5Title("M├│n ─ân y├¬u th├¡ch");
                            setGiftTitle("Th╞░ Mß╗¥i Hß║╣n H├▓");
                            setFinalTitle("Happy Valentine's Day!");
                            setFinalSubtitle("Cß║úm ╞ín v├¼ ─æ├ú l├á ngoß║íi lß╗ç tuyß╗çt vß╗¥i nhß║Ñt cß╗ºa nhau.");
                            setSignOffText("Th╞░╞íng mß║┐n");
                            setStage1Background("#05020a");
                            setStage2Background("#05020a");
                            setStage1Accent("#ec4899");
                          }
                        }}
                      >
                          <p className="font-semibold">{template.name}</p>
                      </li>
                    );
                  })}
                    </div>
                  ))
                )}
              </ul>
            )}
          </div>
          <TextInput label="Ng╞░ß╗¥i gß╗¡i" onChange={setSenderName} value={senderName} />
          <TextInput label="Ng╞░ß╗¥i nhß║¡n" onChange={setRecipientName} value={recipientName} />
          
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold opacity-90">Nhß║íc nß╗ün (General)</label>
            <select
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 outline-none focus:border-pink-500/50"
              value={generalAudioUrl}
              onChange={(e) => setGeneralAudioUrl(e.target.value)}
            >
              <option value="" className="text-gray-900">Mß║╖c ─æß╗ïnh (Random theo template)</option>
              {GENERAL_SONGS.map(song => (
                <option key={song} value={song} className="text-gray-900">
                  {song.split('/').pop()?.replace('_128k.mp3', '').replace('.mp3', '')}
                </option>
              ))}
            </select>
          </div>

            <div className="md:col-span-2 mt-4">
              <label className="mb-2 block text-sm font-semibold opacity-90">Ng├áy hß║┐t hß║ín ─æ╞ín (Mß║╖c ─æß╗ïnh 10 ng├áy)</label>
              <input
                type="datetime-local"
                suppressHydrationWarning
                min={new Date().toISOString().slice(0, 16)}
                value={expiresAtDate}
                onChange={(e) => setExpiresAtDate(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 outline-none focus:border-pink-500/50 text-slate-900"
              />
              <p className="text-xs text-slate-500 mt-2">Sau thß╗¥i gian n├áy, to├án bß╗Ö dß╗» liß╗çu ─æ╞ín sß║╜ bß╗ï x├│a ─æß╗â tiß║┐t kiß╗çm dung l╞░ß╗úng. C├íc th├┤ng tin nhß║¡t k├╜, thß╗æng k├¬ vß║½n ─æ╞░ß╗úc giß╗» nguy├¬n.</p>
            </div>

          <div className="md:col-span-2">
            {!result ? (
              <button className="w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 text-sm font-semibold disabled:opacity-50" disabled={isSubmitting} onClick={createOrder} type="button">
                {isSubmitting ? "─Éang tß║ío ─æ╞ín..." : "Tß║ío ─æ╞ín"}
              </button>
            ) : null}
          </div>
        </Section>

        {!result ? (
          <section className="glass-panel rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold">─É╞ín cß╗ºa t├┤i</h2>
              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-xs font-semibold text-white/70">
                {myOrders.length} ─æ╞ín
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <input 
                type="text" 
                placeholder="T├¼m m├ú ─æ╞ín, t├¬n kh├ích, S─ÉT..."
                value={orderSearchQuery}
                onChange={(e) => {
                  setOrderSearchQuery(e.target.value);
                  setOrderPage(1);
                }}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 outline-none focus:border-pink-500/50 text-white placeholder-white/50"
              />
              <select
                value={orderStatusFilter}
                onChange={(e) => {
                  setOrderStatusFilter(e.target.value);
                  setOrderPage(1);
                }}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 outline-none focus:border-pink-500/50 text-white [&>option]:text-slate-900"
              >
                <option value="ALL">Tß║Ñt cß║ú trß║íng th├íi</option>
                <option value="PAID">─É├ú thanh to├ín (Mß╗ƒ kh├│a)</option>
                <option value="UNPAID">Chß╗¥ thanh to├ín</option>
              </select>
              <input 
                type="date" 
                value={orderDateFilter}
                onChange={(e) => {
                  setOrderDateFilter(e.target.value);
                  setOrderPage(1);
                }}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 outline-none focus:border-pink-500/50 text-white"
              />
            </div>
            <div className="mt-4 space-y-3 pr-2">
              {myOrders.filter(order => {
                const payment = getRelationOne(order.payments);
                const paid = order.status === "ACTIVE" || payment?.status === "PAID";
                
                if (orderStatusFilter === "PAID" && !paid) return false;
                if (orderStatusFilter === "UNPAID" && paid) return false;

                if (orderDateFilter) {
                  const orderDate = new Date(order.created_at).toISOString().split('T')[0];
                  if (orderDate !== orderDateFilter) return false;
                }

                const query = orderSearchQuery.toLowerCase();
                if (!query) return true;
                return (
                  order.public_id?.toLowerCase().includes(query) ||
                  order.buyer_name?.toLowerCase().includes(query) ||
                  order.buyer_contact?.toLowerCase().includes(query) ||
                  order.recipient_name?.toLowerCase().includes(query) ||
                  payment?.payment_code?.toLowerCase().includes(query)
                );
              }).length ? myOrders.filter(order => {
                const payment = getRelationOne(order.payments);
                const paid = order.status === "ACTIVE" || payment?.status === "PAID";
                
                if (orderStatusFilter === "PAID" && !paid) return false;
                if (orderStatusFilter === "UNPAID" && paid) return false;

                if (orderDateFilter) {
                  const orderDate = new Date(order.created_at).toISOString().split('T')[0];
                  if (orderDate !== orderDateFilter) return false;
                }

                const query = orderSearchQuery.toLowerCase();
                if (!query) return true;
                return (
                  order.public_id?.toLowerCase().includes(query) ||
                  order.buyer_name?.toLowerCase().includes(query) ||
                  order.buyer_contact?.toLowerCase().includes(query) ||
                  order.recipient_name?.toLowerCase().includes(query) ||
                  payment?.payment_code?.toLowerCase().includes(query)
                );
              }).slice((orderPage - 1) * ordersPerPage, orderPage * ordersPerPage).map((order) => {
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
                        <p className="mt-1 text-xs text-white/48">{template?.name ?? "Ch╞░a r├╡ mß║½u"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.custom_data?.isLocked ? (
                          <div className="flex items-center justify-center rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-[11px] leading-none font-bold text-yellow-600 dark:text-yellow-500">
                            ≡ƒöÆ ─É├ú chß╗æt
                          </div>
                        ) : null}
                        {paid ? (
                          <div
                            onClick={() => loadOrder(order)}
                            className="cursor-pointer flex items-center justify-center rounded-full bg-pink-500/10 border border-pink-500/20 px-3 py-1 text-[11px] leading-none font-bold text-pink-500 hover:bg-pink-500/20 transition-colors"
                          >
                            {order.custom_data?.isLocked ? "Sß╗¡a tiß║┐p" : "Sß╗¡a"}
                          </div>
                        ) : (
                          <div
                            onClick={() => loadOrder(order)}
                            className="cursor-pointer flex items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 text-[11px] leading-none font-bold text-yellow-600 dark:text-yellow-500 hover:bg-yellow-500/20 transition-colors"
                          >
                            Xem QR / Thanh to├ín
                          </div>
                        )}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmModal({
                              open: true,
                              type: "DELETE",
                              title: "X├íc nhß║¡n x├│a ─æ╞ín",
                              desc: "H├ánh ─æß╗Öng n├áy sß║╜ x├│a v─⌐nh viß╗àn ─æ╞ín h├áng v├á Tß║ñT Cß║ó h├¼nh ß║únh ─æ├¡nh k├¿m. Kh├┤ng thß╗â ho├án t├íc!",
                              onConfirm: () => handleDeleteOrder(order.public_id)
                            });
                          }}
                          className="cursor-pointer flex items-center justify-center rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-[11px] leading-none font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                        >
                          X├│a
                        </div>
                        <div className={`flex items-center justify-center rounded-full border px-3 py-1 text-[11px] leading-none font-bold ${paid ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "border-pink-200 bg-pink-50 text-pink-500 dark:border-pink-500/20 dark:bg-pink-500/10"}`}>
                          {paid ? "─É├ú thanh to├ín" : "Chß╗¥ thanh to├ín"}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                      <p><span className="text-white/48">Kh├ích:</span> {order.buyer_name || "Ch╞░a nhß║¡p"}</p>
                      <p><span className="text-white/48">Ng╞░ß╗¥i nhß║¡n:</span> {order.recipient_name || "Ch╞░a nhß║¡p"}</p>
                      <p><span className="text-white/48">Sß╗æ tiß╗ün:</span> <b>{money(order.amount)}</b></p>
                      <p><span className="text-white/48">M├ú CK:</span> <b className="text-pink-100">{payment?.payment_code ?? "Ch╞░a c├│"}</b></p>
                    </div>
                    <p className="mt-3 text-xs text-white/48">
                      Tß║ío l├║c {new Date(order.created_at).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                    </p>
                  </article>
                );
              }) : (
                <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.04] p-6 text-sm text-white/54">
                  Ch╞░a c├│ ─æ╞ín n├áo. Tß║ío ─æ╞ín ─æß║ºu ti├¬n xong danh s├ích sß║╜ tß╗▒ hiß╗çn ß╗ƒ ─æ├óy.
                </div>
              )}
            </div>
            
            {myOrders.filter(order => {
                const payment = getRelationOne(order.payments);
                const paid = order.status === "ACTIVE" || payment?.status === "PAID";
                
                if (orderStatusFilter === "PAID" && !paid) return false;
                if (orderStatusFilter === "UNPAID" && paid) return false;

                if (orderDateFilter) {
                  const orderDate = new Date(order.created_at).toISOString().split('T')[0];
                  if (orderDate !== orderDateFilter) return false;
                }

                const query = orderSearchQuery.toLowerCase();
                if (!query) return true;
                return (
                  order.public_id?.toLowerCase().includes(query) ||
                  order.buyer_name?.toLowerCase().includes(query) ||
                  order.buyer_contact?.toLowerCase().includes(query) ||
                  order.recipient_name?.toLowerCase().includes(query) ||
                  payment?.payment_code?.toLowerCase().includes(query)
                );
              }).length > ordersPerPage && (
              <div className="mt-5 flex items-center justify-center gap-3 border-t border-white/5 pt-4">
                <button 
                  onClick={() => setOrderPage(p => Math.max(1, p - 1))}
                  disabled={orderPage === 1}
                  className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition"
                  type="button"
                >
                  Tr╞░ß╗¢c
                </button>
                <span className="text-xs text-white/60 font-medium">
                  Trang {orderPage} / {Math.ceil(myOrders.filter(order => {
                const payment = getRelationOne(order.payments);
                const paid = order.status === "ACTIVE" || payment?.status === "PAID";
                if (orderStatusFilter === "PAID" && !paid) return false;
                if (orderStatusFilter === "UNPAID" && paid) return false;
                if (orderDateFilter) {
                  const orderDate = new Date(order.created_at).toISOString().split('T')[0];
                  if (orderDate !== orderDateFilter) return false;
                }
                const query = orderSearchQuery.toLowerCase();
                if (!query) return true;
                return (
                  order.public_id?.toLowerCase().includes(query) ||
                  order.buyer_name?.toLowerCase().includes(query) ||
                  order.buyer_contact?.toLowerCase().includes(query) ||
                  order.recipient_name?.toLowerCase().includes(query) ||
                  payment?.payment_code?.toLowerCase().includes(query)
                );
              }).length / ordersPerPage)}
                </span>
                <button 
                  onClick={() => setOrderPage(p => Math.min(Math.ceil(myOrders.filter(order => {
                const payment = getRelationOne(order.payments);
                const paid = order.status === "ACTIVE" || payment?.status === "PAID";
                if (orderStatusFilter === "PAID" && !paid) return false;
                if (orderStatusFilter === "UNPAID" && paid) return false;
                if (orderDateFilter) {
                  const orderDate = new Date(order.created_at).toISOString().split('T')[0];
                  if (orderDate !== orderDateFilter) return false;
                }
                const query = orderSearchQuery.toLowerCase();
                if (!query) return true;
                return (
                  order.public_id?.toLowerCase().includes(query) ||
                  order.buyer_name?.toLowerCase().includes(query) ||
                  order.buyer_contact?.toLowerCase().includes(query) ||
                  order.recipient_name?.toLowerCase().includes(query) ||
                  payment?.payment_code?.toLowerCase().includes(query)
                );
              }).length / ordersPerPage), p + 1))}
                  disabled={orderPage >= Math.ceil(myOrders.filter(order => {
                const payment = getRelationOne(order.payments);
                const paid = order.status === "ACTIVE" || payment?.status === "PAID";
                if (orderStatusFilter === "PAID" && !paid) return false;
                if (orderStatusFilter === "UNPAID" && paid) return false;
                if (orderDateFilter) {
                  const orderDate = new Date(order.created_at).toISOString().split('T')[0];
                  if (orderDate !== orderDateFilter) return false;
                }
                const query = orderSearchQuery.toLowerCase();
                if (!query) return true;
                return (
                  order.public_id?.toLowerCase().includes(query) ||
                  order.buyer_name?.toLowerCase().includes(query) ||
                  order.buyer_contact?.toLowerCase().includes(query) ||
                  order.recipient_name?.toLowerCase().includes(query) ||
                  payment?.payment_code?.toLowerCase().includes(query)
                );
              }).length / ordersPerPage)}
                  className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition"
                  type="button"
                >
                  Tiß║┐p
                </button>
              </div>
            )}
          </section>
        ) : null}

        {canEditTemplate ? (
          isLocked ? (
            <div className="rounded-3xl border border-yellow-400/30 bg-yellow-500/10 p-8 md:p-12 text-center flex flex-col items-center shadow-lg backdrop-blur-sm mx-auto max-w-2xl mt-4">
              <div className="text-6xl mb-6 drop-shadow-md">≡ƒöÆ</div>
              <h3 className="text-2xl md:text-3xl font-black text-yellow-500 tracking-tight">─É╞ín ─æ├ú bß╗ï kh├│a!</h3>
              <p className="mt-4 text-sm md:text-base text-yellow-600/90 font-medium max-w-md leading-relaxed mb-8">
                ─É╞ín n├áy ─æ├ú ─æ╞░ß╗úc chß╗æt xong v├á kh├│a lß║íi ─æß╗â tr├ính chß╗ënh sß╗¡a nhß║ºm. Nß║┐u muß╗æn tiß║┐p tß╗Ñc sß╗¡a, bß║ín phß║úi mß╗ƒ kh├│a ─æ╞ín.
              </p>
              <button
                className="rounded-full bg-gradient-to-b from-yellow-400 to-orange-500 px-10 py-4 text-sm font-bold text-white shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all"
                onClick={handleUnlock}
                type="button"
              >
                Mß╗ƒ kh├│a ─æß╗â sß╗¡a
              </button>
            </div>
          ) : (
          <>
            {isWedding ? (
              <>
                
                {isGoi3 && (
                  <div className="mb-6 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setActiveTab("trai")} className={`flex-1 rounded-xl py-3 text-sm font-bold transition-colors ${activeTab === "trai" ? "bg-pink-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>Thiß╗çp Nh├á Trai</button>
                      <button type="button" onClick={() => setActiveTab("gai")} className={`flex-1 rounded-xl py-3 text-sm font-bold transition-colors ${activeTab === "gai" ? "bg-pink-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>Thiß╗çp Nh├á G├íi</button>
                    </div>
                    {activeTab === "gai" && (
                      <button type="button" onClick={() => {
                        const copyData = { ...dynamicData };
                        delete copyData.gai;
                        setDynamicData(d => ({ ...d, gai: { ...copyData } }));
                      }} className="w-full text-xs py-2 bg-pink-500/10 text-pink-300 rounded-lg font-medium hover:bg-pink-500/20 transition-colors">
                        Γ£¿ Sao ch├⌐p to├án bß╗Ö th├┤ng tin tß╗½ Nh├á Trai qua ─æ├óy
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : isBirthdayMagic ? (
              <>
                <Section title="─Éoß║ín 4/10: Lß╗¥i ch├║c (Bong b├│ng)">
                  <div className="md:col-span-2">
                    <TextArea label="Lß╗¥i ch├║c khi bong b├│ng xuß║Ñt hiß╗çn (Mß╗ùi c├óu 1 d├▓ng)" onChange={setBirthdayMessage} value={birthdayMessage} />
                  </div>
                </Section>
                <Section title="─Éoß║ín 5/10: B├ính kem & Thß║»p nß║┐n">
                  <TextInput label="─Éß╗Ö tuß╗òi (Cß║»m nß║┐n sß╗æ)" onChange={setBirthdayAge} value={birthdayAge} />
                  <TextInput label="Chß╗ë dß║½n thß║»p nß║┐n" onChange={setBirthdayInstructionText} value={birthdayInstructionText} />
                </Section>
                <Section title="─Éoß║ín 6/10: Thß╗▒c hiß╗çn ─æiß╗üu ╞░ß╗¢c">
                  <TextInput label="Ti├¬u ─æß╗ü gß╗úi ├╜ ─æiß╗üu ╞░ß╗¢c" onChange={setBirthdayWishPromptText} value={birthdayWishPromptText} />
                  <TextInput label="Trß║íng th├íi khi ─æang ghi ├óm" onChange={setBirthdayRecordingText} value={birthdayRecordingText} />
                </Section>
                <Section title="─Éoß║ín 7/10: Ch├║c mß╗½ng (B─âng r├┤n)">
                  <TextInput label="Ti├¬u ─æß╗ü b─âng r├┤n" onChange={setBirthdayGreetingCardSignature} value={birthdayGreetingCardSignature} />
                  <TextInput label="T├¬n ng╞░ß╗¥i nhß║¡n (Trß╗ìng t├óm b─âng r├┤n)" onChange={setBirthdayFinal3DSignature} value={birthdayFinal3DSignature} />
                </Section>
                <Section title="─Éoß║ín 8/10: Chß╗¥ mß╗ƒ hß╗Öp qu├á">
                  <div className="md:col-span-2">
                    <TextInput label="Chß╗ë dß║½n mß╗ƒ hß╗Öp qu├á" onChange={setBirthdayGiftPromptText} value={birthdayGiftPromptText} />
                  </div>
                  <MediaInput label="ß║ónh bß║Ñt ngß╗¥ bß║¡t ra tß╗½ hß╗Öp qu├á" accept="image/*,video/*" onChange={(url) => setStage1ImageUrl(url)} />
                </Section>
                <Section title="─Éoß║ín 9/10 & 10/10: Kß╗╖ niß╗çm">
                  <MemoryArrayInput label="Danh s├ích ß║únh kß╗╖ niß╗çm quay quanh khung h├¼nh" values={birthdayMemories} onChange={setBirthdayMemories} />
                  <div className="md:col-span-2">
                    <TextInput label="Lß╗¥i nhß║»n cuß╗æi c├╣ng (Chß║╖ng 10)" onChange={setBirthdayFinalMessage} value={birthdayFinalMessage} />
                  </div>
                </Section>
              </>
            ) : isDating2 ? (
              <>

                <Section title="B╞░ß╗¢c 1: Mß║¡t m├ú mß╗ƒ kh├│a">
                  <PinCodeInput label="Mß║¡t m├ú mß╗ƒ kh├│a (4 sß╗æ)" value={dating2Config.pinCode} onChange={(v) => setDating2Config({ ...dating2Config, pinCode: v })} />
                  <TextInput label="Ti├¬u ─æß╗ü nhß║¡p mß║¡t khß║⌐u" value={dating2Config.loginTitle || "Nhß║¡p Mß║¡t Khß║⌐u"} onChange={(v) => setDating2Config({ ...dating2Config, loginTitle: v })} />
                  <TextInput label="D├▓ng gß╗úi ├╜ mß║¡t khß║⌐u" value={dating2Config.loginHint || "(Gß╗úi ├╜: {pin})"} onChange={(v) => setDating2Config({ ...dating2Config, loginHint: v })} />
                  <TextInput label="Th├┤ng b├ío sai mß║¡t khß║⌐u" value={dating2Config.loginErrorText || "Sai mß║¡t khß║⌐u rß╗ôi!"} onChange={(v) => setDating2Config({ ...dating2Config, loginErrorText: v })} />
                  <TextInput label="T├¬n ng╞░ß╗¥i nhß║¡n (─æß╗â x╞░ng h├┤)" value={recipientName} onChange={setRecipientName} />
                  <ColorInput label="M├áu nß╗ün (bß║»t ─æß║ºu gradient)" value={dating2Config.bgFrom} onCommit={(v) => setDating2Config({ ...dating2Config, bgFrom: v })} />
                  <ColorInput label="M├áu nß╗ün (kß║┐t th├║c gradient)" value={dating2Config.bgTo} onCommit={(v) => setDating2Config({ ...dating2Config, bgTo: v })} />
                </Section>
                <Section title="B╞░ß╗¢c 2: D├▓ ─æ├ái Radio">
                  <TextInput label="Gß╗úi ├╜ d├▓ ─æ├ái Radio" value={dating2Config.radioHint} onChange={(v) => setDating2Config({ ...dating2Config, radioHint: v })} />
                </Section>
                <Section title="B╞░ß╗¢c 3: T├óm trß║íng">
                  <TextArea label="Ti├¬u ─æß╗ü hß╗Åi th─âm" value={dating2Config.vibeTitle} onChange={(v) => setDating2Config({ ...dating2Config, vibeTitle: v })} />
                  <div className="md:col-span-2">
                     <ArrayInput label="C├íc lß╗▒a chß╗ìn t├óm trß║íng" values={dating2Config.vibeOptions} onChange={(v) => setDating2Config({ ...dating2Config, vibeOptions: v })} />
                  </div>
                  <div className="md:col-span-2">
                     <ArrayInput label="C├íc c├óu dß╗ù d├ánh (t╞░╞íng ß╗⌐ng vß╗¢i tß╗½ng t├óm trß║íng tr├¬n)" values={dating2Config.vibeTooltips || []} onChange={(v) => setDating2Config({ ...dating2Config, vibeTooltips: v })} />
                  </div>
                </Section>
                <Section title="B╞░ß╗¢c 4: Thß║╗ c├áo">
                  <TextInput label="Ti├¬u ─æß╗ü thß║╗ c├áo" value={dating2Config.scratchTitle} onChange={(v) => setDating2Config({ ...dating2Config, scratchTitle: v })} />
                  <TextInput label="Phß╗Ñ ─æß╗ü (HD c├áo)" value={dating2Config.scratchSubtitle} onChange={(v) => setDating2Config({ ...dating2Config, scratchSubtitle: v })} />
                  <TextArea label="Phß║ºn th╞░ß╗ƒng sau lß╗¢p c├áo" value={dating2Config.scratchPrize} onChange={(v) => setDating2Config({ ...dating2Config, scratchPrize: v })} />
                  <TextInput label="N├║t bß║Ñm nhß║¡n qu├á" value={dating2Config.scratchBtn} onChange={(v) => setDating2Config({ ...dating2Config, scratchBtn: v })} />
                </Section>
                <Section title="B╞░ß╗¢c 5: V├▓ng quay">
                  <TextInput label="Ti├¬u ─æß╗ü v├▓ng quay" value={dating2Config.wheelTitle} onChange={(v) => setDating2Config({ ...dating2Config, wheelTitle: v })} />
                  <ArrayInput label="C├íc t├╣y chß╗ìn tr├¬n v├▓ng quay" values={dating2Config.wheelOptions} onChange={(v) => setDating2Config({ ...dating2Config, wheelOptions: v })} />
                </Section>

                <Section title="B╞░ß╗¢c 6: Thß╗¥i gian">
                  <TextInput label="Ti├¬u ─æß╗ü thß╗¥i gian" value={dating2Config.dtTitle} onChange={(v) => setDating2Config({ ...dating2Config, dtTitle: v })} />
                  <TextInput label="N├║t ho├án tß║Ñt chß╗ìn giß╗¥" value={dating2Config.dtBtn} onChange={(v) => setDating2Config({ ...dating2Config, dtBtn: v })} />
                  <p className="md:col-span-2 text-xs leading-5 text-white/45">
                    Kh├ích tß╗▒ chß╗ìn ng├áy v├á giß╗¥ tr├¬n lß╗ïch trong sß║ún phß║⌐m ΓÇö kh├┤ng cß║ºn cß║Ñu h├¼nh danh s├ích lß╗▒a chß╗ìn.
                  </p>
                </Section>
                <Section title="B╞░ß╗¢c 7: L├í th╞░ chß╗æt ─æ╞ín">
                  <TextInput label="Ti├¬u ─æß╗ü l├í th╞░" value={dating2Config.finaleLetterTitle} onChange={(v) => setDating2Config({ ...dating2Config, finaleLetterTitle: v })} />
                  <TextInput label="T├¬n ng╞░ß╗¥i gß╗¡i (k├╜ t├¬n cuß╗æi th╞░)" value={senderName} onChange={setSenderName} />
                  <TextArea label="Nß╗Öi dung l├í th╞░" value={dating2Config.finaleLetterBody} onChange={(v) => setDating2Config({ ...dating2Config, finaleLetterBody: v })} />
                  <TextInput label="N├║t bß║Ñm Tß╗½ Chß╗æi" value={dating2Config.finaleBtnNo} onChange={(v) => setDating2Config({ ...dating2Config, finaleBtnNo: v })} />
                  <TextInput label="N├║t bß║Ñm ─Éß╗ông ├¥" value={dating2Config.finaleBtnYes} onChange={(v) => setDating2Config({ ...dating2Config, finaleBtnYes: v })} />
                  <TextInput label="Lß╗¥i nhß║»n chß╗æt ─æ╞ín th├ánh c├┤ng" value={dating2Config.finaleBtnSuccess} onChange={(v) => setDating2Config({ ...dating2Config, finaleBtnSuccess: v })} />
                </Section>
              </>
            ) : isDating3 ? (
              <>
                <Section title="B╞░ß╗¢c 1: Cß╗ù M├íy X├¿ng">
                  <TextInput label="Ti├¬u ─æß╗ü ch├¡nh 1" value={dating3Config.step1Title1} onChange={(v) => setDating3Config({ ...dating3Config, step1Title1: v })} />
                  <TextInput label="Ti├¬u ─æß╗ü ch├¡nh 2 (khi nhß║¡n xu)" value={dating3Config.step1Title2} onChange={(v) => setDating3Config({ ...dating3Config, step1Title2: v })} />
                  <TextInput label="Ti├¬u ─æß╗ü phß╗Ñ 1" value={dating3Config.step1Sub1} onChange={(v) => setDating3Config({ ...dating3Config, step1Sub1: v })} />
                  <TextInput label="Ti├¬u ─æß╗ü phß╗Ñ 2" value={dating3Config.step1Sub2} onChange={(v) => setDating3Config({ ...dating3Config, step1Sub2: v })} />
                  <TextInput label="Tooltip 1 (Nh├⌐t xu)" value={dating3Config.step1Tooltip1} onChange={(v) => setDating3Config({ ...dating3Config, step1Tooltip1: v })} />
                  <TextInput label="Tooltip 2 (Vß║╖n n├║m)" value={dating3Config.step1Tooltip2} onChange={(v) => setDating3Config({ ...dating3Config, step1Tooltip2: v })} />
                  <TextInput label="Chß╗» tr├¬n ─æß╗ông xu" value={dating3Config.step1CoinText} onChange={(v) => setDating3Config({ ...dating3Config, step1CoinText: v })} />
                </Section>
                <Section title="B╞░ß╗¢c 2: Quß║ú Trß╗⌐ng Gacha">
                  <TextInput label="D├▓ng chß╗» h╞░ß╗¢ng dß║½n" value={dating3Config.step4Title} onChange={(v) => setDating3Config({ ...dating3Config, step4Title: v })} />
                  <TextInput label="T├¬n v├⌐ VIP" value={dating3Config.step4CardTitle} onChange={(v) => setDating3Config({ ...dating3Config, step4CardTitle: v })} />
                  <TextInput label="M├┤ tß║ú v├⌐ VIP" value={dating3Config.step4CardSub} onChange={(v) => setDating3Config({ ...dating3Config, step4CardSub: v })} />
                  <TextInput label="N├║t tiß║┐p tß╗Ñc" value={dating3Config.step4CardBtn} onChange={(v) => setDating3Config({ ...dating3Config, step4CardBtn: v })} />
                </Section>
                <Section title="B╞░ß╗¢c 3: V├▓ng Quay V┼⌐ Trß╗Ñ">
                  <TextInput label="Ti├¬u ─æß╗ü v├▓ng quay" value={dating3Config.stepWheelTitle} onChange={(v) => setDating3Config({ ...dating3Config, stepWheelTitle: v })} />
                  <TextInput label="Phß╗Ñ ─æß╗ü v├▓ng quay" value={dating3Config.stepWheelSub} onChange={(v) => setDating3Config({ ...dating3Config, stepWheelSub: v })} />
                  <TextInput label="N├║t bß║»t ─æß║ºu quay" value={dating3Config.stepWheelBtn1} onChange={(v) => setDating3Config({ ...dating3Config, stepWheelBtn1: v })} />
                  <TextInput label="D├▓ng th├┤ng b├ío kß║┐t quß║ú" value={dating3Config.stepWheelResultPrefix} onChange={(v) => setDating3Config({ ...dating3Config, stepWheelResultPrefix: v })} />
                  <TextInput label="N├║t chuyß╗ân tiß║┐p sau khi c├│ kß║┐t quß║ú" value={dating3Config.stepWheelBtn2} onChange={(v) => setDating3Config({ ...dating3Config, stepWheelBtn2: v })} />
                  <ColorInput label="M├áu nß╗ün bß║»t ─æß║ºu" value={dating3Config.wheelBgFrom} onCommit={(v) => setDating3Config({ ...dating3Config, wheelBgFrom: v })} />
                  <ColorInput label="M├áu nß╗ün kß║┐t th├║c" value={dating3Config.wheelBgTo} onCommit={(v) => setDating3Config({ ...dating3Config, wheelBgTo: v })} />
                  <div className="md:col-span-2">
                     <ArrayInput label="C├íc t├╣y chß╗ìn tr├¬n v├▓ng quay" values={dating3Config.wheelOptions} onChange={(v) => setDating3Config({ ...dating3Config, wheelOptions: v })} />
                  </div>
                </Section>
                <Section title="B╞░ß╗¢c 4: Thß╗¥i Gian Hß║╣n H├▓">
                  <TextInput label="Ti├¬u ─æß╗ü trang" value={dating3Config.dtTitle} onChange={(v) => setDating3Config({ ...dating3Config, dtTitle: v })} />
                  <TextInput label="Phß╗Ñ ─æß╗ü" value={dating3Config.dtSub} onChange={(v) => setDating3Config({ ...dating3Config, dtSub: v })} />
                  <TextInput label="C├óu hß╗Åi chß╗ìn ng├áy" value={dating3Config.dtDateLabel} onChange={(v) => setDating3Config({ ...dating3Config, dtDateLabel: v })} />
                  <TextInput label="C├óu hß╗Åi chß╗ìn giß╗¥" value={dating3Config.dtTimeLabel} onChange={(v) => setDating3Config({ ...dating3Config, dtTimeLabel: v })} />
                  <TextInput label="N├║t x├íc nhß║¡n" value={dating3Config.dtBtn} onChange={(v) => setDating3Config({ ...dating3Config, dtBtn: v })} />
                  <ColorInput label="M├áu nß╗ün" value={dating3Config.dtBgColor} onCommit={(v) => setDating3Config({ ...dating3Config, dtBgColor: v })} />
                  <div className="md:col-span-2">
                     <ArrayInput label="C├íc t├╣y chß╗ìn Ng├áy" values={dating3Config.dtDates} onChange={(v) => setDating3Config({ ...dating3Config, dtDates: v })} />
                     <div className="h-4" />
                     <ArrayInput label="C├íc t├╣y chß╗ìn Giß╗¥" values={dating3Config.dtTimes} onChange={(v) => setDating3Config({ ...dating3Config, dtTimes: v })} />
                  </div>
                </Section>
                <Section title="B╞░ß╗¢c 5: L├í Th╞░ Cß║úm X├║c">
                  <TextArea label="Nß╗Öi dung l├í th╞░" value={dating3Config.step6LetterBody} onChange={(v) => setDating3Config({ ...dating3Config, step6LetterBody: v })} />
                  <TextInput label="N├║t ─æ├│ng dß║Ñu x├íc nhß║¡n" value={dating3Config.step6Btn} onChange={(v) => setDating3Config({ ...dating3Config, step6Btn: v })} />
                </Section>
                <Section title="B╞░ß╗¢c 6: X├íc Nhß║¡n Cuß╗æi C├╣ng">
                  <TextInput label="Ti├¬u ─æß╗ü tr├¬n c├╣ng (nhß╗Å)" value={dating3Config.step7Title} onChange={(v) => setDating3Config({ ...dating3Config, step7Title: v })} />
                  <TextInput label="Ti├¬u ─æß╗ü ch├¡nh" value={dating3Config.step7Title2} onChange={(v) => setDating3Config({ ...dating3Config, step7Title2: v })} />
                  <TextArea label="C├óu hß╗Åi x├íc nhß║¡n (D├╣ng {time}, {date}, {location} ─æß╗â tß╗▒ ─æß╗Öng ch├¿n)" value={dating3Config.step7Sub} onChange={(v) => setDating3Config({ ...dating3Config, step7Sub: v })} />
                  <TextInput label="N├║t ─Éß╗ông ├¥" value={dating3Config.step7BtnYes} onChange={(v) => setDating3Config({ ...dating3Config, step7BtnYes: v })} />
                  <ColorInput label="M├áu nß╗ün" value={dating3Config.step7Bg} onCommit={(v) => setDating3Config({ ...dating3Config, step7Bg: v })} />
                  <div className="md:col-span-2 mt-2">
                    <ArrayInput 
                      label="C├íc c├óu tß╗½ chß╗æi (Nhß║úy thay ─æß╗òi ngß║½u nhi├¬n)" 
                      onChange={(arr) => setDating3Config({ ...dating3Config, step7BtnNoOptions: arr })} 
                      values={dating3Config.step7BtnNoOptions} 
                    />
                  </div>
                </Section>
                <Section title="B╞░ß╗¢c 7: Th├ánh C├┤ng">
                  <TextInput label="Ti├¬u ─æß╗ü ch├║c mß╗½ng" value={dating3Config.step8Title} onChange={(v) => setDating3Config({ ...dating3Config, step8Title: v })} />
                  <TextInput label="D├▓ng nhß║»n nhß╗º th├¬m" value={dating3Config.step8Sub} onChange={(v) => setDating3Config({ ...dating3Config, step8Sub: v })} />
                  <TextInput label="N├║t quay vß╗ü" value={dating3Config.step8Btn} onChange={(v) => setDating3Config({ ...dating3Config, step8Btn: v })} />
                  <ColorInput label="M├áu nß╗ün bß║»t ─æß║ºu" value={dating3Config.step8BgFrom} onCommit={(v) => setDating3Config({ ...dating3Config, step8BgFrom: v })} />
                  <ColorInput label="M├áu nß╗ün kß║┐t th├║c" value={dating3Config.step8BgTo} onCommit={(v) => setDating3Config({ ...dating3Config, step8BgTo: v })} />
                </Section>
              </>
            ) : isWillYouDateMe ? (
              <>
                <div className="md:col-span-2 hidden">
                  {/* Keep to not break DOM diffing immediately, will be handled by FormStepNavigator */}
                </div>

                <Section title="Thiß║┐t lß║¡p chung" className={orderIsLocked ? "pointer-events-none opacity-60" : ""}>
                
                  <ColorInput label="M├áu nß╗ün tß╗òng thß╗â" onCommit={setStage2Background} value={stage2Background} />
                  <ColorInput label="M├áu nhß║Ñn (N├║t, Ti├¬u ─æß╗ü)" onCommit={setStage1Accent} value={stage1Accent} />
                  <MediaInput label="ß║ónh nß╗ün trang (T├╣y chß╗ìn)" onChange={setStage1Background} />
                </Section>
                <Section title="B╞░ß╗¢c 1: Lß╗¥i mß╗¥i">
                  <TextInput label="Ti├¬u ─æß╗ü lß╗¥i mß╗¥i" onChange={setStage1Instruction} value={stage1Instruction} />
                  <TextArea label="Nß╗Öi dung lß╗¥i mß╗¥i" onChange={setQuestion} value={question} />
                  <TextInput label="N├║t ─æß╗ông ├╜" onChange={setGiftAcceptButton} value={giftAcceptButton} />
                  <div className="md:col-span-2 mt-2">
                    <ArrayInput 
                      label="C├íc c├óu tß╗½ chß╗æi (Nhß║úy n├║t khi hover)" 
                      onChange={(arr) => setGiftDeclineButton(arr.join('\n'))} 
                      values={giftDeclineButton ? giftDeclineButton.split('\n') : []} 
                    />
                  </div>
                </Section>
                <Section title="B╞░ß╗¢c 2: Phß║ún hß╗ôi ─æß╗ông ├╜">
                  <TextInput label="Ti├¬u ─æß╗ü vui s╞░ß╗¢ng" onChange={setStage2Title} value={stage2Title} />
                  <TextArea label="Lß╗¥i nhß║»n vui s╞░ß╗¢ng" onChange={setStage2Subtitle} value={stage2Subtitle} />
                </Section>
                <Section title="B╞░ß╗¢c 3-6: Khß║úo s├ít lß╗▒a chß╗ìn">
                  <div className="md:col-span-2">
                    <TextInput label="C├óu hß╗Åi chß╗ìn ─æß╗ïa ─æiß╗âm" onChange={setStage3Title} value={stage3Title} />
                    <div className="mt-4" />
                    <ArrayInput label="C├íc lß╗▒a chß╗ìn ─æß╗ïa ─æiß╗âm" onChange={setLocationOptions} values={locationOptions} />
                  </div>
                  
                  <div className="md:col-span-2">
                    <TextInput label="C├óu hß╗Åi chß╗ìn ng├áy giß╗¥" onChange={setStage4Title} value={stage4Title} />
                  </div>
                  
                  <div className="md:col-span-2">
                    <TextInput label="C├óu hß╗Åi chß╗ìn m├│n ─ân" onChange={setStage5Title} value={stage5Title} />
                    <div className="mt-4" />
                    <ArrayInput label="C├íc lß╗▒a chß╗ìn m├│n ─ân" onChange={setFoodOptions} values={foodOptions} />
                  </div>
                  
                  <div className="md:col-span-2">
                    <TextInput label="C├óu hß╗Åi chß╗ìn ─æß╗ô uß╗æng" onChange={setGiftTitle} value={giftTitle} />
                    <div className="mt-4" />
                    <ArrayInput label="C├íc lß╗▒a chß╗ìn ─æß╗ô uß╗æng" onChange={setDrinkOptions} values={drinkOptions} />
                  </div>
                </Section>
                <Section title="B╞░ß╗¢c 7: Chß╗æt ─æ╞ín">
                  <TextInput label="Ti├¬u ─æß╗ü kß║┐t th├║c" onChange={setFinalTitle} value={finalTitle} />
                  <TextArea label="Lß╗¥i nhß║»n cuß╗æi c├╣ng" onChange={setFinalSubtitle} value={finalSubtitle} />
                  <TextInput label="Chß╗» k├╜ (VD: Th╞░╞íng mß║┐n)" onChange={setSignOffText} value={signOffText} />
                </Section>
              </>
            ) : isValentine2 ? (
              <>
                <Section title="B╞░ß╗¢c 1: Cuß╗æn Sß╗ò Kß╗╖ Niß╗çm">

                  <TextInput label="Ti├¬u ─æß╗ü b├¼a" value={valentine2Config.coverTitle} onChange={(v) => setValentine2Config({ ...valentine2Config, coverTitle: v })} />
                  <MediaInput label="ß║ónh ngo├ái b├¼a" accept="image/*,video/*" onChange={(url) => setValentine2Config({ ...valentine2Config, coverImage: url })} />
                  <MediaInput label="ß║ónh trang 1" accept="image/*,video/*" onChange={(url) => setValentine2Config({ ...valentine2Config, page1Image: url })} />
                  <TextArea label="Lß╗¥i nhß║»n trang 1" value={valentine2Config.page1Text} onChange={(v) => setValentine2Config({ ...valentine2Config, page1Text: v })} />
                  
                  <div className="md:col-span-2 space-y-4 mt-4">
                    <span className="text-white/64 text-sm font-semibold block border-b border-white/10 pb-2">ß║ónh Polaroid (Tß╗æi ─æa 3 ß║únh)</span>
                    {valentine2Config.polaroids.map((p, idx) => (
                      <div key={p.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl relative border border-white/10">
                        <button type="button" onClick={() => setValentine2Config({ ...valentine2Config, polaroids: valentine2Config.polaroids.filter(item => item.id !== p.id) })} className="absolute top-2 right-2 text-xs text-red-400 hover:text-red-300">X├│a</button>
                        <MediaInput label={`ß║ónh Polaroid ${idx + 1}`} accept="image/*,video/*" onChange={(url) => {
                          const newPolaroids = [...valentine2Config.polaroids];
                          newPolaroids[idx].src = url;
                          setValentine2Config({ ...valentine2Config, polaroids: newPolaroids });
                        }} />
                        <TextInput label="Ghi ch├║ ß║únh" value={p.caption} onChange={(v) => {
                          const newPolaroids = [...valentine2Config.polaroids];
                          newPolaroids[idx].caption = v;
                          setValentine2Config({ ...valentine2Config, polaroids: newPolaroids });
                        }} />
                      </div>
                    ))}
                    {valentine2Config.polaroids.length < 3 && (
                      <button type="button" onClick={() => setValentine2Config({ ...valentine2Config, polaroids: [...valentine2Config.polaroids, { id: Date.now(), src: "", caption: "Kß╗╖ niß╗çm mß╗¢i" }] })} className="px-4 py-2 bg-white/10 text-white text-sm rounded-xl font-semibold hover:bg-white/20">
                        + Th├¬m Polaroid
                      </button>
                    )}
                  </div>

                  <div className="md:col-span-2 mt-4 pt-4 border-t border-white/10">
                    <TextArea label="Lß╗¥i nhß║»n trang 2" value={valentine2Config.page2Text} onChange={(v) => setValentine2Config({ ...valentine2Config, page2Text: v })} />
                    <div className="mt-4" />
                    <TextInput label="Gß╗úi ├╜ k├⌐o ruy b─âng" value={valentine2Config.page3Hint} onChange={(v) => setValentine2Config({ ...valentine2Config, page3Hint: v })} />
                    <div className="mt-4" />
                    <TextArea label="Nß╗Öi dung b├¡ mß║¡t trong t├║i" value={valentine2Config.page3SecretText} onChange={(v) => setValentine2Config({ ...valentine2Config, page3SecretText: v })} />
                    <div className="mt-4" />
                    <TextInput label="N├║t lß║Ñy qu├á" value={valentine2Config.page3ButtonText} onChange={(v) => setValentine2Config({ ...valentine2Config, page3ButtonText: v })} />
                  </div>
                </Section>
                <Section title="B╞░ß╗¢c 2: Lß╗¥i Ngß╗Å Th╞░ Tay">
                  <TextArea label="Nß╗Öi dung lß╗¥i ngß╗Å (Popup)" value={valentine2Config.confessionText} onChange={(v) => setValentine2Config({ ...valentine2Config, confessionText: v })} />
                </Section>
            
              </>
            ) : isBirthday2 ? (
              <>
                <Section title="─Éoß║ín - Step1Alarm">
                  <TextInput label={"Thß╗⌐ 2, ng├áy 14 th├íng 2"} value={dynamicData.Th2ngy14thng2 || "Thß╗⌐ 2, ng├áy 14 th├íng 2"} onChange={(v) => setDynamicData(d => ({ ...d, Th2ngy14thng2: v }))} />
                  <TextInput label={"alarm"} value={dynamicData.alarm || "alarm"} onChange={(v) => setDynamicData(d => ({ ...d, alarm: v }))} />
                  <TextInput label={"B├ío thß╗⌐c"} value={dynamicData.Bothc || "B├ío thß╗⌐c"} onChange={(v) => setDynamicData(d => ({ ...d, Bothc: v }))} />
                  <TextInput label={"Dß║¡y th├┤i lß╗ún con ╞íi! ≡ƒÉ╖"} value={dynamicData.Dythilnconi || "Dß║¡y th├┤i lß╗ún con ╞íi! ≡ƒÉ╖"} onChange={(v) => setDynamicData(d => ({ ...d, Dythilnconi: v }))} />
                  <TextInput label={"Vuß╗æt ─æß╗â tß║»t b├ío thß╗⌐c"} value={dynamicData.Vutttbothc || "Vuß╗æt ─æß╗â tß║»t b├ío thß╗⌐c"} onChange={(v) => setDynamicData(d => ({ ...d, Vutttbothc: v }))} />
                </Section>
                <Section title="─Éoß║ín - Step2FakeChat">
                  <TextInput label={"Back"} value={dynamicData.Back || "Back"} onChange={(v) => setDynamicData(d => ({ ...d, Back: v }))} />
                  <TextInput label={"Ng╞░ß╗¥i ß║Ñy &gt;"} value={dynamicData.Ngiygt || "Ng╞░ß╗¥i ß║Ñy &gt;"} onChange={(v) => setDynamicData(d => ({ ...d, Ngiygt: v }))} />
                  <TextInput label={"Today 7:05 AM"} value={dynamicData.Today705AM || "Today 7:05 AM"} onChange={(v) => setDynamicData(d => ({ ...d, Today705AM: v }))} />
                  <TextInput label={"Chß║ím m├án h├¼nh ─æß╗â ─æß╗ìc tiß║┐p"} value={dynamicData.Chmmnhnhctip || "Chß║ím m├án h├¼nh ─æß╗â ─æß╗ìc tiß║┐p"} onChange={(v) => setDynamicData(d => ({ ...d, Chmmnhnhctip: v }))} />
                  <TextInput label={"Bß║Ñm gß╗¡i ngay!"} value={dynamicData.Bmgingay || "Bß║Ñm gß╗¡i ngay!"} onChange={(v) => setDynamicData(d => ({ ...d, Bmgingay: v }))} />
                  <TextInput label={"H├┤m nay sinh nhß║¡t tß╗¢ m├á ≡ƒÑ║"} value={dynamicData.Hmnaysinhnhttm || "H├┤m nay sinh nhß║¡t tß╗¢ m├á ≡ƒÑ║"} onChange={(v) => setDynamicData(d => ({ ...d, Hmnaysinhnhttm: v }))} />
                  <TextInput label={"iMessage"} value={dynamicData.iMessage || "iMessage"} onChange={(v) => setDynamicData(d => ({ ...d, iMessage: v }))} />
                </Section>
                <Section title="─Éoß║ín - Step3Delivery">
                  <TextInput label={"Widget"} value={dynamicData.Widget || "Widget"} onChange={(v) => setDynamicData(d => ({ ...d, Widget: v }))} />
                  <TextInput label={"SHOPEE EXPRESS"} value={dynamicData.SHOPEEEXPRESS || "SHOPEE EXPRESS"} onChange={(v) => setDynamicData(d => ({ ...d, SHOPEEEXPRESS: v }))} />
                  <TextInput label={"now"} value={dynamicData.now || "now"} onChange={(v) => setDynamicData(d => ({ ...d, now: v }))} />
                  <TextArea label={"Bß║ín c├│ mß╗Öt kiß╗çn h├áng tß╗æi mß║¡t. Ph├¡ COD: 0─æ. Y├¬u cß║ºu"} value={dynamicData.Bncmtkinhngtimt || "Bß║ín c├│ mß╗Öt kiß╗çn h├áng tß╗æi mß║¡t. Ph├¡ COD: 0─æ. Y├¬u cß║ºu k├╜ nhß║¡n!"} onChange={(v) => setDynamicData(d => ({ ...d, Bncmtkinhngtimt: v }))} />
                  <TextInput label={"K├╜ Nhß║¡n ─Éiß╗çn Tß╗¡"} value={dynamicData.KNhninT || "K├╜ Nhß║¡n ─Éiß╗çn Tß╗¡"} onChange={(v) => setDynamicData(d => ({ ...d, KNhninT: v }))} />
                  <TextInput label={"Vui l├▓ng k├╜ v├áo khung b├¬n d╞░ß╗¢i"} value={dynamicData.Vuilngkvokhungb || "Vui l├▓ng k├╜ v├áo khung b├¬n d╞░ß╗¢i"} onChange={(v) => setDynamicData(d => ({ ...d, Vuilngkvokhungb: v }))} />
                  <TextInput label={"K├╜ t├¬n tß║íi ─æ├óy"} value={dynamicData.Ktntiy || "K├╜ t├¬n tß║íi ─æ├óy"} onChange={(v) => setDynamicData(d => ({ ...d, Ktntiy: v }))} />
                  <TextInput label={"Mß╗ƒ Kiß╗çn H├áng Γ£¿"} value={dynamicData.MKinHng || "Mß╗ƒ Kiß╗çn H├áng Γ£¿"} onChange={(v) => setDynamicData(d => ({ ...d, MKinHng: v }))} />
                </Section>
                <Section title="─Éoß║ín - Step4Unbox">
                  <TextInput label={"Xem Tiß║┐p Γ£¿"} value={dynamicData.XemTip || "Xem Tiß║┐p Γ£¿"} onChange={(v) => setDynamicData(d => ({ ...d, XemTip: v }))} />
                </Section>
                <Section title="─Éoß║ín - Step5Cake">
                  <TextInput label={"N├│i ─æiß╗üu bß║ín muß╗æn gß╗¡i gß║»m"} value={dynamicData.Niiubnmungigm || "N├│i ─æiß╗üu bß║ín muß╗æn gß╗¡i gß║»m"} onChange={(v) => setDynamicData(d => ({ ...d, Niiubnmungigm: v }))} />
                  <TextInput label={"Bß║▒ng c├ích"} value={dynamicData.Bngcch || "Bß║▒ng c├ích"} onChange={(v) => setDynamicData(d => ({ ...d, Bngcch: v }))} />
                  <TextInput label={"nhß║Ñn giß╗» n├║t Mic"} value={dynamicData.nhngintMic || "nhß║Ñn giß╗» n├║t Mic"} onChange={(v) => setDynamicData(d => ({ ...d, nhngintMic: v }))} />
                  <TextInput label={"b├¬n d╞░ß╗¢i"} value={dynamicData.bndi || "b├¬n d╞░ß╗¢i"} onChange={(v) => setDynamicData(d => ({ ...d, bndi: v }))} />
                  <TextInput label={"Nhß║»m mß║»t lß║íi, ngh─⌐ vß╗ü ─æiß╗üu ╞░ß╗¢c"} value={dynamicData.Nhmmtlinghviuc || "Nhß║»m mß║»t lß║íi, ngh─⌐ vß╗ü ─æiß╗üu ╞░ß╗¢c"} onChange={(v) => setDynamicData(d => ({ ...d, Nhmmtlinghviuc: v }))} />
                  <TextInput label={"v├á"} value={dynamicData.v || "v├á"} onChange={(v) => setDynamicData(d => ({ ...d, v: v }))} />
                  <TextInput label={"giß╗» lß╗│ v├áo ngß╗ìn nß║┐n"} value={dynamicData.gilvongnnn || "giß╗» lß╗│ v├áo ngß╗ìn nß║┐n"} onChange={(v) => setDynamicData(d => ({ ...d, gilvongnnn: v }))} />
                  <TextInput label={"─æß╗â thß╗òi nh├⌐!"} value={dynamicData.thinh || "─æß╗â thß╗òi nh├⌐!"} onChange={(v) => setDynamicData(d => ({ ...d, thinh: v }))} />
                  <TextInput label={"─Éang ghi ├óm ─æiß╗üu ╞░ß╗¢c..."} value={dynamicData.angghimiuc || "─Éang ghi ├óm ─æiß╗üu ╞░ß╗¢c..."} onChange={(v) => setDynamicData(d => ({ ...d, angghimiuc: v }))} />
                  <TextInput label={"Sß║╡n s├áng ghi ├óm"} value={dynamicData.Snsngghim || "Sß║╡n s├áng ghi ├óm"} onChange={(v) => setDynamicData(d => ({ ...d, Snsngghim: v }))} />
                </Section>
                <Section title="─Éoß║ín - Step6Letter">
                  <TextInput label={"Mß╗ƒ qu├á thß║¡t ≡ƒÄü"} value={dynamicData.Mqutht || "Mß╗ƒ qu├á thß║¡t ≡ƒÄü"} onChange={(v) => setDynamicData(d => ({ ...d, Mqutht: v }))} />
                </Section>
                <Section title="─Éoß║ín - Step7Climax">
                  <TextInput label={"Voucher ─Éß║╖c Quyß╗ün"} value={dynamicData.VouchercQuyn || "Voucher ─Éß║╖c Quyß╗ün"} onChange={(v) => setDynamicData(d => ({ ...d, VouchercQuyn: v }))} />
                  <TextArea label={"&quot;Tß║╖ng cß║¡u 1 v├⌐ ─ân sß║¡p th├ánh phß╗æ ─æ├¬m nay do tß╗¢"} value={dynamicData.Tngcu1vnspthnhp || "&quot;Tß║╖ng cß║¡u 1 v├⌐ ─ân sß║¡p th├ánh phß╗æ ─æ├¬m nay do tß╗¢ bao trß╗ìn g├│i!&quot;"} onChange={(v) => setDynamicData(d => ({ ...d, Tngcu1vnspthnhp: v }))} />
                  <TextInput label={"L├¬n ─æß╗ô th├┤i! ≡ƒ¢╡"} value={dynamicData.Lnthi || "L├¬n ─æß╗ô th├┤i! ≡ƒ¢╡"} onChange={(v) => setDynamicData(d => ({ ...d, Lnthi: v }))} />
                </Section>
              </>

            ) : isBirthday3 ? (
              <>
                <Section title="─Éoß║ín - H├│a ─æ╞ín thanh to├ín">
                  <TextInput label={"Chß╗ìn Ng├áy Hß║╣n"} value={dynamicData.dtTitle || "Chß╗ìn Ng├áy Hß║╣n"} onChange={(v) => setDynamicData(d => ({ ...d, dtTitle: v }))} />
                  <TextInput label={"─Éß╗â tß╗¢ chuß║⌐n bß╗ï nha"} value={dynamicData.dtSub || "─Éß╗â tß╗¢ chuß║⌐n bß╗ï nha"} onChange={(v) => setDynamicData(d => ({ ...d, dtSub: v }))} />
                  <TextInput label={"Ng├áy n├áo hß╗úp l├╜ nhß╗ë?"} value={dynamicData.dtDateLabel || "Ng├áy n├áo hß╗úp l├╜ nhß╗ë?"} onChange={(v) => setDynamicData(d => ({ ...d, dtDateLabel: v }))} />
                  <TextInput label={"Mß║Ñy giß╗¥ th├¼ tiß╗çn cho cß║¡u?"} value={dynamicData.dtTimeLabel || "Mß║Ñy giß╗¥ th├¼ tiß╗çn cho cß║¡u?"} onChange={(v) => setDynamicData(d => ({ ...d, dtTimeLabel: v }))} />
                  <TextInput label={"CHß╗ÉT ─É╞áN! ≡ƒÄë"} value={dynamicData.dtBtn || "CHß╗ÉT ─É╞áN! ≡ƒÄë"} onChange={(v) => setDynamicData(d => ({ ...d, dtBtn: v }))} />
                  <TextInput label={"giftText"} value={dynamicData.giftText || "giftText"} onChange={(v) => setDynamicData(d => ({ ...d, giftText: v }))} />
                  <TextInput label={"A SPECIAL GIFT ≡ƒÆî"} value={dynamicData.doorSign || "A SPECIAL GIFT ≡ƒÆî"} onChange={(v) => setDynamicData(d => ({ ...d, doorSign: v }))} />
                  <TextInput label={"Chß║ím 3 lß║ºn ─æß╗â mß╗ƒ th╞░!"} value={dynamicData.doorInstruction || "Chß║ím 3 lß║ºn ─æß╗â mß╗ƒ th╞░!"} onChange={(v) => setDynamicData(d => ({ ...d, doorInstruction: v }))} />
                  <TextInput label={"K├⌐o xuß╗æng nh├⌐!"} value={dynamicData.darkRoomText || "K├⌐o xuß╗æng nh├⌐!"} onChange={(v) => setDynamicData(d => ({ ...d, darkRoomText: v }))} />
                  <TextInput label={"compact"} value={dynamicData.compact || "compact"} onChange={(v) => setDynamicData(d => ({ ...d, compact: v }))} />
                  <TextInput label={"autoPlay"} value={dynamicData.autoPlay || "autoPlay"} onChange={(v) => setDynamicData(d => ({ ...d, autoPlay: v }))} />
                  <TextInput label={"Chß║ím v├áo 3 quß║ú b├│ng bay ─æß╗â xem ─æiß╗üu bß║Ñt ngß╗¥!"} value={dynamicData.balloonText || "Chß║ím v├áo 3 quß║ú b├│ng bay ─æß╗â xem ─æiß╗üu bß║Ñt ngß╗¥!"} onChange={(v) => setDynamicData(d => ({ ...d, balloonText: v }))} />
                  <TextInput label={"Happy Birthday! ≡ƒîƒ"} value={dynamicData.cakeTitle || "Happy Birthday! ≡ƒîƒ"} onChange={(v) => setDynamicData(d => ({ ...d, cakeTitle: v }))} />
                  <TextArea label={"Nhß║»m mß║»t lß║íi, chß║»p tay v├á ╞░ß╗¢c mß╗Öt ─æiß╗üu thß║¡t to lß╗¢n"} value={dynamicData.cakeInstruction || "Nhß║»m mß║»t lß║íi, chß║»p tay v├á ╞░ß╗¢c mß╗Öt ─æiß╗üu thß║¡t to lß╗¢n ─æi n├áo!"} onChange={(v) => setDynamicData(d => ({ ...d, cakeInstruction: v }))} />
                  <TextInput label={"NHß║ñN GIß╗« ─Éß╗é THß╗öI Nß║╛N ≡ƒî¼∩╕Å"} value={dynamicData.blowBtn || "NHß║ñN GIß╗« ─Éß╗é THß╗öI Nß║╛N ≡ƒî¼∩╕Å"} onChange={(v) => setDynamicData(d => ({ ...d, blowBtn: v }))} />
                  <TextInput label={"Lß╗¥i Ch├║c Tß╗½ Tr├íi Tim"} value={dynamicData.cardTitle || "Lß╗¥i Ch├║c Tß╗½ Tr├íi Tim"} onChange={(v) => setDynamicData(d => ({ ...d, cardTitle: v }))} />
                  <TextInput label={"Lß║¡t thiß╗çp"} value={dynamicData.cardBtn || "Lß║¡t thiß╗çp"} onChange={(v) => setDynamicData(d => ({ ...d, cardBtn: v }))} />
                  <TextInput label={"Mß╗Öt n─âm qua cß║¡u ─æ├ú rß╗▒c rß╗í thß║┐ n├áy c╞í m├á..."} value={dynamicData.memoryWish1 || "Mß╗Öt n─âm qua cß║¡u ─æ├ú rß╗▒c rß╗í thß║┐ n├áy c╞í m├á..."} onChange={(v) => setDynamicData(d => ({ ...d, memoryWish1: v }))} />
                  <TextInput label={"Mß╗Öt n─âm qua cß║¡u ─æ├ú rß╗▒c rß╗í thß║┐ n├áy c╞í m├á..."} value={dynamicData.memoryWish2 || "Mß╗Öt n─âm qua cß║¡u ─æ├ú rß╗▒c rß╗í thß║┐ n├áy c╞í m├á..."} onChange={(v) => setDynamicData(d => ({ ...d, memoryWish2: v }))} />
                  <TextInput label={"Mß╗Öt n─âm qua cß║¡u ─æ├ú rß╗▒c rß╗í thß║┐ n├áy c╞í m├á..."} value={dynamicData.memoryWish3 || "Mß╗Öt n─âm qua cß║¡u ─æ├ú rß╗▒c rß╗í thß║┐ n├áy c╞í m├á..."} onChange={(v) => setDynamicData(d => ({ ...d, memoryWish3: v }))} />
                  <TextInput label={"Mß╗Öt n─âm qua cß║¡u ─æ├ú rß╗▒c rß╗í thß║┐ n├áy c╞í m├á..."} value={dynamicData.memoryWish4 || "Mß╗Öt n─âm qua cß║¡u ─æ├ú rß╗▒c rß╗í thß║┐ n├áy c╞í m├á..."} onChange={(v) => setDynamicData(d => ({ ...d, memoryWish4: v }))} />
                  <MediaInput label={"memory1"} onChange={(url) => setDynamicData(d => ({ ...d, memory1: url }))} />
                  <MediaInput label={"memory2"} onChange={(url) => setDynamicData(d => ({ ...d, memory2: url }))} />
                  <MediaInput label={"memory3"} onChange={(url) => setDynamicData(d => ({ ...d, memory3: url }))} />
                  <TextInput label={"Chß║ím li├¬n tß╗Ñc ─æß╗â x├⌐ giß║Ñy g├│i nh├⌐!"} value={dynamicData.giftInstruction || "Chß║ím li├¬n tß╗Ñc ─æß╗â x├⌐ giß║Ñy g├│i nh├⌐!"} onChange={(v) => setDynamicData(d => ({ ...d, giftInstruction: v }))} />
                  <TextInput label={"giftName"} value={dynamicData.giftName || "giftName"} onChange={(v) => setDynamicData(d => ({ ...d, giftName: v }))} />
                  <MediaInput label={"giftImage"} onChange={(url) => setDynamicData(d => ({ ...d, giftImage: url }))} />
                  <TextInput label={"NHß║¼N QU├Ç NGAY ≡ƒæù"} value={dynamicData.memoryBtn || "NHß║¼N QU├Ç NGAY ≡ƒæù"} onChange={(v) => setDynamicData(d => ({ ...d, memoryBtn: v }))} />
                </Section>
              </>

            ) : isSorry1 ? (
              <>
                <Section title="─Éoß║ín - Khß╗ƒi ─æß║ºu (Ph├í B─âng)">
                  <TextInput label={"─æang giß║¡n tß╗¢ lß║»m ─æ├║ng kh├┤ng...?"} value={dynamicData.iceTitle || "─æang giß║¡n tß╗¢ lß║»m ─æ├║ng kh├┤ng...?"} onChange={(v) => setDynamicData(d => ({ ...d, iceTitle: v }))} />
                  <TextArea label={"Bß║Ñm v├áo m├án h├¼nh ─æß╗â ─æß║¡p vß╗í lß╗¢p b─âng n├áy nh├⌐, lß║ính "} value={dynamicData.iceSubtitle || "Bß║Ñm v├áo m├án h├¼nh ─æß╗â ─æß║¡p vß╗í lß╗¢p b─âng n├áy nh├⌐, lß║ính qu├í..."} onChange={(v) => setDynamicData(d => ({ ...d, iceSubtitle: v }))} />
                  <TextInput label={"confessText"} value={dynamicData.confessText || "confessText"} onChange={(v) => setDynamicData(d => ({ ...d, confessText: v }))} />
                  <TextInput label={"─É├║ng, cß║¡u rß║Ñt ─æ├íng ─æ├▓n! ≡ƒÿí"} value={dynamicData.confessBtn || "─É├║ng, cß║¡u rß║Ñt ─æ├íng ─æ├▓n! ≡ƒÿí"} onChange={(v) => setDynamicData(d => ({ ...d, confessBtn: v }))} />
                </Section>
                <Section title="─Éoß║ín - V├▓ng quay (─Éß╗ün tß╗Öi)">
                  <TextInput label={"Tr├á sß╗»a 1 tuß║ºn"} value={dynamicData.wheelOpt1 || "Tr├á sß╗»a 1 tuß║ºn"} onChange={(v) => setDynamicData(d => ({ ...d, wheelOpt1: v }))} />
                  <TextInput label={"─Éß║Ñm 3 c├íi"} value={dynamicData.wheelOpt2 || "─Éß║Ñm 3 c├íi"} onChange={(v) => setDynamicData(d => ({ ...d, wheelOpt2: v }))} />
                  <TextInput label={"Rß╗¡a b├ít 1 th├íng"} value={dynamicData.wheelOpt3 || "Rß╗¡a b├ít 1 th├íng"} onChange={(v) => setDynamicData(d => ({ ...d, wheelOpt3: v }))} />
                  <TextInput label={"L├ám osin 1 ng├áy"} value={dynamicData.wheelOpt4 || "L├ám osin 1 ng├áy"} onChange={(v) => setDynamicData(d => ({ ...d, wheelOpt4: v }))} />
                  <TextInput label={"Mua qu├á xß╗ïn"} value={dynamicData.wheelOpt5 || "Mua qu├á xß╗ïn"} onChange={(v) => setDynamicData(d => ({ ...d, wheelOpt5: v }))} />
                  <TextInput label={"Bao ─æi ─ân tß╗æi"} value={dynamicData.wheelOpt6 || "Bao ─æi ─ân tß╗æi"} onChange={(v) => setDynamicData(d => ({ ...d, wheelOpt6: v }))} />
                  <TextInput label={"V├▓ng Quay ─Éß╗ün Tß╗Öi"} value={dynamicData.wheelTitle || "V├▓ng Quay ─Éß╗ün Tß╗Öi"} onChange={(v) => setDynamicData(d => ({ ...d, wheelTitle: v }))} />
                  <TextArea label={"Tr╞░ß╗¢c khi tha lß╗ùi, cho cß║¡u quyß╗ün phß║ít tß╗¢ ─æß║Ñy! Quay"} value={dynamicData.wheelSubtitle || "Tr╞░ß╗¢c khi tha lß╗ùi, cho cß║¡u quyß╗ün phß║ít tß╗¢ ─æß║Ñy! Quay ─æi, tß╗¢ chß╗ïu hß║┐t!"} onChange={(v) => setDynamicData(d => ({ ...d, wheelSubtitle: v }))} />
                  <TextInput label={"QUAY NGAY"} value={dynamicData.wheelBtn || "QUAY NGAY"} onChange={(v) => setDynamicData(d => ({ ...d, wheelBtn: v }))} />
                  <TextInput label={"Tß║ím bß╗¢t giß║¡n ≡ƒæë"} value={dynamicData.wheelNextBtn || "Tß║ím bß╗¢t giß║¡n ≡ƒæë"} onChange={(v) => setDynamicData(d => ({ ...d, wheelNextBtn: v }))} />
                </Section>
                <Section title="─Éoß║ín - Chß╗æt hß║í">
                  <MediaInput label={"memory1"} onChange={(url) => setDynamicData(d => ({ ...d, memory1: url }))} />
                  <MediaInput label={"memory2"} onChange={(url) => setDynamicData(d => ({ ...d, memory2: url }))} />
                  <MediaInput label={"memory3"} onChange={(url) => setDynamicData(d => ({ ...d, memory3: url }))} />
                  <TextArea label={"&quot;Tß╗¢ kh├┤ng muß╗æn v├¼ mß╗Öt ph├║t ngu ngß╗æc m├á ─æ├ính m"} value={dynamicData.nostalgiaText || "&quot;Tß╗¢ kh├┤ng muß╗æn v├¼ mß╗Öt ph├║t ngu ngß╗æc m├á ─æ├ính mß║Ñt nhß╗»ng nß╗Ñ c╞░ß╗¥i n├áy...&quot;"} onChange={(v) => setDynamicData(d => ({ ...d, nostalgiaText: v }))} />
                  <TextInput label={"Xem tiß║┐p"} value={dynamicData.nostalgiaBtn || "Xem tiß║┐p"} onChange={(v) => setDynamicData(d => ({ ...d, nostalgiaBtn: v }))} />
                  <TextInput label={"letterText"} value={dynamicData.letterText || "letterText"} onChange={(v) => setDynamicData(d => ({ ...d, letterText: v }))} />
                  <TextInput label={"Chß╗æt hß║í"} value={dynamicData.letterBtn || "Chß╗æt hß║í"} onChange={(v) => setDynamicData(d => ({ ...d, letterBtn: v }))} />
                  <TextInput label={"Hiß╗çp ╞»ß╗¢c H├▓a B├¼nh"} value={dynamicData.treatyTitle || "Hiß╗çp ╞»ß╗¢c H├▓a B├¼nh"} onChange={(v) => setDynamicData(d => ({ ...d, treatyTitle: v }))} />
                  <TextInput label={"Quyß║┐t ─æß╗ïnh nß║▒m trong tay cß║¡u. Xin h├úy n╞░╞íng tay..."} value={dynamicData.treatySubtitle || "Quyß║┐t ─æß╗ïnh nß║▒m trong tay cß║¡u. Xin h├úy n╞░╞íng tay..."} onChange={(v) => setDynamicData(d => ({ ...d, treatySubtitle: v }))} />
                  <TextInput label={"K├╜ t├¬n, tha mß║íng"} value={dynamicData.treatyBtnYes || "K├╜ t├¬n, tha mß║íng"} onChange={(v) => setDynamicData(d => ({ ...d, treatyBtnYes: v }))} />
                  <TextInput label={"GIß║¼N TIß║╛P, KH├öNG THA ≡ƒÿñ"} value={dynamicData.treatyBtnNo || "GIß║¼N TIß║╛P, KH├öNG THA ≡ƒÿñ"} onChange={(v) => setDynamicData(d => ({ ...d, treatyBtnNo: v }))} />
                  <TextInput label={"Cß║úm ╞ín cß║¡u! Γ¥ñ∩╕Å"} value={dynamicData.successTitle || "Cß║úm ╞ín cß║¡u! Γ¥ñ∩╕Å"} onChange={(v) => setDynamicData(d => ({ ...d, successTitle: v }))} />
                  <TextInput label={"Tß╗¢ qua ─æ├│n cß║¡u ─æi ─ân ─æß╗ün tß╗Öi ngay ─æ├óy!"} value={dynamicData.successDesc || "Tß╗¢ qua ─æ├│n cß║¡u ─æi ─ân ─æß╗ün tß╗Öi ngay ─æ├óy!"} onChange={(v) => setDynamicData(d => ({ ...d, successDesc: v }))} />
                </Section>
              </>

            ) : isSorry2 ? (
              <>
                <Section title="─Éoß║ín - Quyß║┐t ─æß╗ïnh">
                  <TextArea label={"Ng╞░ß╗¥i n├áy ─æ├ú l├ám bß║ín giß║¡n. Bß║ín c├│ quyß╗ün ─æ╞░ß╗úc xß║ú gi"} value={dynamicData.warnDesc || "Ng╞░ß╗¥i n├áy ─æ├ú l├ám bß║ín giß║¡n. Bß║ín c├│ quyß╗ün ─æ╞░ß╗úc xß║ú giß║¡n ngay b├óy giß╗¥!"} onChange={(v) => setDynamicData(d => ({ ...d, warnDesc: v }))} />
                  <TextInput label={"Bß║»t ─æß║ºu xß║ú giß║¡n"} value={dynamicData.warnBtn || "Bß║»t ─æß║ºu xß║ú giß║¡n"} onChange={(v) => setDynamicData(d => ({ ...d, warnBtn: v }))} />
                  <TextInput label={"D├⌐p L├áo"} value={dynamicData.weapon1 || "D├⌐p L├áo"} onChange={(v) => setDynamicData(d => ({ ...d, weapon1: v }))} />
                  <TextInput label={"Chß╗òi ch├á"} value={dynamicData.weapon2 || "Chß╗òi ch├á"} onChange={(v) => setDynamicData(d => ({ ...d, weapon2: v }))} />
                  <TextInput label={"Chß╗ìn V┼⌐ Kh├¡"} value={dynamicData.weaponTitle || "Chß╗ìn V┼⌐ Kh├¡"} onChange={(v) => setDynamicData(d => ({ ...d, weaponTitle: v }))} />
                  <MediaInput label={"gameTarget"} onChange={(url) => setDynamicData(d => ({ ...d, gameTarget: url }))} />
                  <TextInput label={"├ü ui... ─æau qu├í!"} value={dynamicData.bandageTitle || "├ü ui... ─æau qu├í!"} onChange={(v) => setDynamicData(d => ({ ...d, bandageTitle: v }))} />
                  <TextArea label={"&quot;Ui cha mß║╣ ╞íi... ─É├ính xong rß╗ôi, ─æß║▒ng ß║Ñy ─æ├ú xß║ú"} value={dynamicData.bandageDesc || "&quot;Ui cha mß║╣ ╞íi... ─É├ính xong rß╗ôi, ─æß║▒ng ß║Ñy ─æ├ú xß║ú hß║┐t giß║¡n ch╞░a? X├│t ng╞░ß╗¥i ta ch╞░a? ≡ƒÑ║ Nß║┐u bß╗¢t giß║¡n rß╗ôi th├¼ cho ng╞░ß╗¥i ta giß║úi th├¡ch nh├⌐?&quot;"} onChange={(v) => setDynamicData(d => ({ ...d, bandageDesc: v }))} />
                  <TextInput label={"Giß║úi th├¡ch ─æi nghe thß╗¡ ≡ƒÿÆ"} value={dynamicData.bandageBtn || "Giß║úi th├¡ch ─æi nghe thß╗¡ ≡ƒÿÆ"} onChange={(v) => setDynamicData(d => ({ ...d, bandageBtn: v }))} />
                  <TextArea label={"Tß╗½ nay tß╗¢ hß╗⌐a sß║╜ ngoan, kh├┤ng c├úi lß╗¥i, kh├┤ng l├ám ─æ"} value={dynamicData.successDesc || "Tß╗½ nay tß╗¢ hß╗⌐a sß║╜ ngoan, kh├┤ng c├úi lß╗¥i, kh├┤ng l├ám ─æß║▒ng ß║Ñy phß║úi dß╗ùi nß╗»a. Cho tß╗¢ mß╗Öt c╞í hß╗Öi chuß╗Öc lß╗ùi bß║▒ng mß╗Öt cß╗æc tr├á sß╗»a to ch├á b├í nh├⌐? ≡ƒºï"} onChange={(v) => setDynamicData(d => ({ ...d, successDesc: v }))} />
                  <TextInput label={"H├▓a nh├⌐!"} value={dynamicData.successTitle || "H├▓a nh├⌐!"} onChange={(v) => setDynamicData(d => ({ ...d, successTitle: v }))} />
                </Section>
                <Section title="─Éoß║ín - Th╞░ xin lß╗ùi">
                  <TextInput label={"apologyText"} value={dynamicData.apologyText || "apologyText"} onChange={(v) => setDynamicData(d => ({ ...d, apologyText: v }))} />
                  <TextInput label={"Tha thß╗⌐"} value={dynamicData.apologyBtn || "Tha thß╗⌐"} onChange={(v) => setDynamicData(d => ({ ...d, apologyBtn: v }))} />
                </Section>
              </>

            ) : isSorry3 ? (
              <>
                <Section title="─Éoß║ín - Lß╗ùi hß╗ç thß╗æng (BSOD)">
                  <TextInput label={"Lß╗ûI Hß╗å THß╗ÉNG"} value={dynamicData.bsodTitle || "Lß╗ûI Hß╗å THß╗ÉNG"} onChange={(v) => setDynamicData(d => ({ ...d, bsodTitle: v }))} />
                  <TextInput label={"Mß╗ÉI QUAN Hß╗å ─ÉANG Bß╗è GI├üN ─ÉOß║áN."} value={dynamicData.bsodMessage || "Mß╗ÉI QUAN Hß╗å ─ÉANG Bß╗è GI├üN ─ÉOß║áN."} onChange={(v) => setDynamicData(d => ({ ...d, bsodMessage: v }))} />
                  <TextInput label={"reason"} value={dynamicData.reason || "reason"} onChange={(v) => setDynamicData(d => ({ ...d, reason: v }))} />
                  <TextInput label={"M├ú lß╗ùi: LOVE_NOT_FOUND_404"} value={dynamicData.bsodCode || "M├ú lß╗ùi: LOVE_NOT_FOUND_404"} onChange={(v) => setDynamicData(d => ({ ...d, bsodCode: v }))} />
                  <TextInput label={"[ T├íi khß╗ƒi ─æß╗Öng ]"} value={dynamicData.bsodButton || "[ T├íi khß╗ƒi ─æß╗Öng ]"} onChange={(v) => setDynamicData(d => ({ ...d, bsodButton: v }))} />
                </Section>
                <Section title="─Éoß║ín - Mß║Ñt kß║┐t nß╗æi & Khß╗ºng long">
                  <TextInput label={"Kh├┤ng c├│ kß║┐t nß╗æi"} value={dynamicData.noConnTitle || "Kh├┤ng c├│ kß║┐t nß╗æi"} onChange={(v) => setDynamicData(d => ({ ...d, noConnTitle: v }))} />
                  <TextInput label={"Mß║Ñt kß║┐t nß╗æi vß╗¢i tr├íi tim cß╗ºa ng╞░ß╗¥i y├¬u."} value={dynamicData.noConnMessage || "Mß║Ñt kß║┐t nß╗æi vß╗¢i tr├íi tim cß╗ºa ng╞░ß╗¥i y├¬u."} onChange={(v) => setDynamicData(d => ({ ...d, noConnMessage: v }))} />
                  <TextInput label={"Kiß╗âm tra lß║íi ─æß╗Ö th├ánh t├óm"} value={dynamicData.noConnHint1 || "Kiß╗âm tra lß║íi ─æß╗Ö th├ánh t├óm"} onChange={(v) => setDynamicData(d => ({ ...d, noConnHint1: v }))} />
                  <TextInput label={"Chuß║⌐n bß╗ï sß║╡n lß╗¥i xin lß╗ùi"} value={dynamicData.noConnHint2 || "Chuß║⌐n bß╗ï sß║╡n lß╗¥i xin lß╗ùi"} onChange={(v) => setDynamicData(d => ({ ...d, noConnHint2: v }))} />
                  <TextInput label={"Chß║íy qua nh├á ─æß╗ün tß╗Öi ngay lß║¡p tß╗⌐c"} value={dynamicData.noConnHint3 || "Chß║íy qua nh├á ─æß╗ün tß╗Öi ngay lß║¡p tß╗⌐c"} onChange={(v) => setDynamicData(d => ({ ...d, noConnHint3: v }))} />
                  <TextInput label={"ERR_HEART_BROKEN"} value={dynamicData.noConnErr || "ERR_HEART_BROKEN"} onChange={(v) => setDynamicData(d => ({ ...d, noConnErr: v }))} />
                  <TextInput label={"Bß║Ñm ph├¡m Space hoß║╖c chß║ím v├áo m├án h├¼nh ─æß╗â thß╗¡ lß║íi."} value={dynamicData.dinoHelpText || "Bß║Ñm ph├¡m Space hoß║╖c chß║ím v├áo m├án h├¼nh ─æß╗â thß╗¡ lß║íi."} onChange={(v) => setDynamicData(d => ({ ...d, dinoHelpText: v }))} />
                  <MediaInput label={"dinoFaceImg"} onChange={(url) => setDynamicData(d => ({ ...d, dinoFaceImg: url }))} />
                  <MediaInput label={"avatar"} onChange={(url) => setDynamicData(d => ({ ...d, avatar: url }))} />
                  <MediaInput label={"memories"} onChange={(url) => setDynamicData(d => ({ ...d, memories: url }))} />
                  <TextInput label={"NHß║óY (W)"} value={dynamicData.dinoJumpBtn || "NHß║óY (W)"} onChange={(v) => setDynamicData(d => ({ ...d, dinoJumpBtn: v }))} />
                  <TextInput label={"C├ÜI (S)"} value={dynamicData.dinoDuckBtn || "C├ÜI (S)"} onChange={(v) => setDynamicData(d => ({ ...d, dinoDuckBtn: v }))} />
                </Section>
                <Section title="─Éoß║ín - Cß║únh b├ío & Bß║▒ng chß╗⌐ng">
                  <TextInput label={"Cß║únh_B├ío.exe"} value={dynamicData.alertTitle || "Cß║únh_B├ío.exe"} onChange={(v) => setDynamicData(d => ({ ...d, alertTitle: v }))} />
                  <TextArea label={"Cß║óNH B├üO: T├¬n ngß╗æc n├áy ─æ├ú nhß║¡n ra lß╗ùi lß║ºm!  Hß║»n th"} value={dynamicData.alertMessage || "Cß║óNH B├üO: T├¬n ngß╗æc n├áy ─æ├ú nhß║¡n ra lß╗ùi lß║ºm!  Hß║»n thß╗½a nhß║¡n m├¼nh v├┤ t├óm, trß║╗ con v├á hß╗⌐a sß║╜ sß╗¡a ─æß╗òi. Bß║ín c├│ muß╗æn xem bß║▒ng chß╗⌐ng kh├┤ng?"} onChange={(v) => setDynamicData(d => ({ ...d, alertMessage: v }))} />
                  <TextInput label={"Xem bß║▒ng chß╗⌐ng"} value={dynamicData.alertBtnYes || "Xem bß║▒ng chß╗⌐ng"} onChange={(v) => setDynamicData(d => ({ ...d, alertBtnYes: v }))} />
                  <TextInput label={"Hß╗ºy"} value={dynamicData.alertBtnNo || "Hß╗ºy"} onChange={(v) => setDynamicData(d => ({ ...d, alertBtnNo: v }))} />
                  <TextArea label={"Tß╗¢ ─æ├ú mß║Ñt rß║Ñt nhiß╗üu thß╗¥i gian ─æß╗â thu thß║¡p nhß╗»ng b├í"} value={dynamicData.trashMessage || "Tß╗¢ ─æ├ú mß║Ñt rß║Ñt nhiß╗üu thß╗¥i gian ─æß╗â thu thß║¡p nhß╗»ng b├íu vß║¡t n├áy..."} onChange={(v) => setDynamicData(d => ({ ...d, trashMessage: v }))} />
                  <MediaInput label={"memory1"} onChange={(url) => setDynamicData(d => ({ ...d, memory1: url }))} />
                  <MediaInput label={"memory2"} onChange={(url) => setDynamicData(d => ({ ...d, memory2: url }))} />
                  <MediaInput label={"memory3"} onChange={(url) => setDynamicData(d => ({ ...d, memory3: url }))} />
                  <TextInput label={"Xem tiß║┐p"} value={dynamicData.trashBtn || "Xem tiß║┐p"} onChange={(v) => setDynamicData(d => ({ ...d, trashBtn: v }))} />
                </Section>
                <Section title="─Éoß║ín - C├ái ─æß║╖t lß║íi H─ÉH">
                  <TextInput label={"─Éang tß║úi... Sß╗▒ quan t├óm"} value={dynamicData.installStep1 || "─Éang tß║úi... Sß╗▒ quan t├óm"} onChange={(v) => setDynamicData(d => ({ ...d, installStep1: v }))} />
                  <TextInput label={"─Éang c├ái ─æß║╖t... T├¡nh tß╗▒ gi├íc"} value={dynamicData.installStep2 || "─Éang c├ái ─æß║╖t... T├¡nh tß╗▒ gi├íc"} onChange={(v) => setDynamicData(d => ({ ...d, installStep2: v }))} />
                  <TextInput label={"─Éang x├│a bß╗Å... Th├│i quen v├┤ t├óm"} value={dynamicData.installStep3 || "─Éang x├│a bß╗Å... Th├│i quen v├┤ t├óm"} onChange={(v) => setDynamicData(d => ({ ...d, installStep3: v }))} />
                  <TextInput label={"Ho├án tß║Ñt! Hß╗ç thß╗æng ─æ├ú ─æ╞░ß╗úc n├óng cß║Ñp."} value={dynamicData.installSuccess || "Ho├án tß║Ñt! Hß╗ç thß╗æng ─æ├ú ─æ╞░ß╗úc n├óng cß║Ñp."} onChange={(v) => setDynamicData(d => ({ ...d, installSuccess: v }))} />
                </Section>
                <Section title="─Éoß║ín - Lß╗¥i xin lß╗ùi cuß╗æi">
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
                <Section title="─Éoß║ín - Step1Fingerprint">
                  <TextInput label={"Nhß║¡t K├╜ T├¼nh Y├¬u"} value={dynamicData.NhtKTnhYu || "Nhß║¡t K├╜ T├¼nh Y├¬u"} onChange={(v) => setDynamicData(d => ({ ...d, NhtKTnhYu: v }))} />
                  <TextInput label={"Chß║ím v├á giß╗» ─æß╗â x├íc thß╗▒c nhß╗ïp tim ≡ƒÆô"} value={dynamicData.Chmvgixcthcnhpt || "Chß║ím v├á giß╗» ─æß╗â x├íc thß╗▒c nhß╗ïp tim ≡ƒÆô"} onChange={(v) => setDynamicData(d => ({ ...d, Chmvgixcthcnhpt: v }))} />
                </Section>
                <Section title="─Éoß║ín - Step2TimeMachine">
                  <TextInput label={"─É├ú bao l├óu kß╗â tß╗½ ng├áy"} value={dynamicData.baoluktngy || "─É├ú bao l├óu kß╗â tß╗½ ng├áy"} onChange={(v) => setDynamicData(d => ({ ...d, baoluktngy: v }))} />
                  <TextInput label={"tr├íi tim lß╗í nhß╗ïp?"} value={dynamicData.tritimlnhp || "tr├íi tim lß╗í nhß╗ïp?"} onChange={(v) => setDynamicData(d => ({ ...d, tritimlnhp: v }))} />
                  <TextInput label={"Ng├áy"} value={dynamicData.Ngy || "Ng├áy"} onChange={(v) => setDynamicData(d => ({ ...d, Ngy: v }))} />
                  <TextInput label={"Giß╗¥"} value={dynamicData.Gi || "Giß╗¥"} onChange={(v) => setDynamicData(d => ({ ...d, Gi: v }))} />
                  <TextInput label={"Ph├║t"} value={dynamicData.Pht || "Ph├║t"} onChange={(v) => setDynamicData(d => ({ ...d, Pht: v }))} />
                  <TextInput label={"Gi├óy"} value={dynamicData.Giy || "Gi├óy"} onChange={(v) => setDynamicData(d => ({ ...d, Giy: v }))} />
                  <TextInput label={"H├ánh tr├¼nh bß║»t ─æß║ºu"} value={dynamicData.Hnhtrnhbtu || "H├ánh tr├¼nh bß║»t ─æß║ºu"} onChange={(v) => setDynamicData(d => ({ ...d, Hnhtrnhbtu: v }))} />
                </Section>
                <Section title="─Éoß║ín - Step3Quiz">
                  <TextInput label={"Trß║ím Tr├¡ Nhß╗¢"} value={dynamicData.TrmTrNh || "Trß║ím Tr├¡ Nhß╗¢"} onChange={(v) => setDynamicData(d => ({ ...d, TrmTrNh: v }))} />
                </Section>
                <Section title="─Éoß║ín - Step4Puzzle">
                  <TextInput label={"Mß║únh Gh├⌐p K├╜ ß╗¿c"} value={dynamicData.MnhGhpKc || "Mß║únh Gh├⌐p K├╜ ß╗¿c"} onChange={(v) => setDynamicData(d => ({ ...d, MnhGhpKc: v }))} />
                  <TextInput label={"Click 2 mß║únh ─æß╗â ho├ín ─æß╗òi vß╗ï tr├¡ nh├⌐!"} value={dynamicData.Click2mnhhonivt || "Click 2 mß║únh ─æß╗â ho├ín ─æß╗òi vß╗ï tr├¡ nh├⌐!"} onChange={(v) => setDynamicData(d => ({ ...d, Click2mnhhonivt: v }))} />
                </Section>
                <Section title="─Éoß║ín - Step5FakeChat">
                  <TextInput label={"Ng╞░ß╗¥i ß║Ñy Γ¥ñ∩╕Å"} value={dynamicData.Ngiy || "Ng╞░ß╗¥i ß║Ñy Γ¥ñ∩╕Å"} onChange={(v) => setDynamicData(d => ({ ...d, Ngiy: v }))} />
                  <TextInput label={"Chß║ím v├áo m├án h├¼nh ─æß╗â tiß║┐p tß╗Ñc..."} value={dynamicData.Chmvomnhnhtiptc || "Chß║ím v├áo m├án h├¼nh ─æß╗â tiß║┐p tß╗Ñc..."} onChange={(v) => setDynamicData(d => ({ ...d, Chmvomnhnhtiptc: v }))} />
                  <TextInput label={"Ngß║»m nh├¼n lß║íi nh├⌐ ≡ƒô╕"} value={dynamicData.Ngmnhnlinh || "Ngß║»m nh├¼n lß║íi nh├⌐ ≡ƒô╕"} onChange={(v) => setDynamicData(d => ({ ...d, Ngmnhnlinh: v }))} />
                </Section>
                <Section title="─Éoß║ín - Step6PolaroidSwipe">
                  <TextInput label={"Triß╗ân L├úm K├╜ ß╗¿c"} value={dynamicData.TrinLmKc || "Triß╗ân L├úm K├╜ ß╗¿c"} onChange={(v) => setDynamicData(d => ({ ...d, TrinLmKc: v }))} />
                  <TextInput label={"Vuß╗æt tr├íi/phß║úi ─æß╗â xem ß║únh tiß║┐p theo"} value={dynamicData.Vuttriphixemnht || "Vuß╗æt tr├íi/phß║úi ─æß╗â xem ß║únh tiß║┐p theo"} onChange={(v) => setDynamicData(d => ({ ...d, Vuttriphixemnht: v }))} />
                  <TextInput label={"H├ánh tr├¼nh n├áy thß║¡t ─æß║╣p,"} value={dynamicData.Hnhtrnhnythtp || "H├ánh tr├¼nh n├áy thß║¡t ─æß║╣p,"} onChange={(v) => setDynamicData(d => ({ ...d, Hnhtrnhnythtp: v }))} />
                  <TextInput label={"nh╞░ng tß╗¢ muß╗æn n├│"} value={dynamicData.nhngtmunn || "nh╞░ng tß╗¢ muß╗æn n├│"} onChange={(v) => setDynamicData(d => ({ ...d, nhngtmunn: v }))} />
                  <TextInput label={"d├ái h╞ín nß╗»a..."} value={dynamicData.dihnna || "d├ái h╞ín nß╗»a..."} onChange={(v) => setDynamicData(d => ({ ...d, dihnna: v }))} />
                  <TextInput label={"Mß╗ƒ bß╗⌐c th╞░ cuß╗æi"} value={dynamicData.Mbcthcui || "Mß╗ƒ bß╗⌐c th╞░ cuß╗æi"} onChange={(v) => setDynamicData(d => ({ ...d, Mbcthcui: v }))} />
                </Section>
                <Section title="─Éoß║ín - Step7Letter">
                  <TextInput label={"Chß║ím ─æß╗â mß╗ƒ th╞░ ≡ƒÆî"} value={dynamicData.Chmmth || "Chß║ím ─æß╗â mß╗ƒ th╞░ ≡ƒÆî"} onChange={(v) => setDynamicData(d => ({ ...d, Chmmth: v }))} />
                  <TextInput label={"Tiß║┐p tß╗Ñc"} value={dynamicData.Tiptc || "Tiß║┐p tß╗Ñc"} onChange={(v) => setDynamicData(d => ({ ...d, Tiptc: v }))} />
                </Section>
                <Section title="─Éoß║ín - Step8Climax">
                  <TextInput label={"Thß║┐ t├│m lß║íi l├á..."} value={dynamicData.Thtmlil || "Thß║┐ t├│m lß║íi l├á..."} onChange={(v) => setDynamicData(d => ({ ...d, Thtmlil: v }))} />
                  <TextArea label={"Cuß╗æi tuß║ºn n├áy cß║¡u c├│ rß║únh kh├┤ng, ─æi ch╞íi vß╗¢i tß╗¢ nh"} value={dynamicData.Cuitunnycucrnhk || "Cuß╗æi tuß║ºn n├áy cß║¡u c├│ rß║únh kh├┤ng, ─æi ch╞íi vß╗¢i tß╗¢ nh├⌐? ≡ƒÑ║"} onChange={(v) => setDynamicData(d => ({ ...d, Cuitunnycucrnhk: v }))} />
                  <TextInput label={"─Éß╗ÆNG ├¥ LU├öN ≡ƒÆû"} value={dynamicData.NGLUN || "─Éß╗ÆNG ├¥ LU├öN ≡ƒÆû"} onChange={(v) => setDynamicData(d => ({ ...d, NGLUN: v }))} />
                  <TextInput label={"Tß╗¬ CHß╗ÉI ≡ƒÆö"} value={dynamicData.TCHI || "Tß╗¬ CHß╗ÉI ≡ƒÆö"} onChange={(v) => setDynamicData(d => ({ ...d, TCHI: v }))} />
                  <TextInput label={"Chß╗æt ─É╞ín!"} value={dynamicData.Chtn || "Chß╗æt ─É╞ín!"} onChange={(v) => setDynamicData(d => ({ ...d, Chtn: v }))} />
                  <TextInput label={"L├¬n ─æß╗ô lß║╣ l├¬nnnn!"} value={dynamicData.Lnllnnnn || "L├¬n ─æß╗ô lß║╣ l├¬nnnn!"} onChange={(v) => setDynamicData(d => ({ ...d, Lnllnnnn: v }))} />
                  <TextInput label={"Tß╗¢ qua ─æ├│n ─æi ch╞íi ngay v├á lu├┤n! ≡ƒ¢╡≡ƒÆ¿"} value={dynamicData.Tquanichingayvl || "Tß╗¢ qua ─æ├│n ─æi ch╞íi ngay v├á lu├┤n! ≡ƒ¢╡≡ƒÆ¿"} onChange={(v) => setDynamicData(d => ({ ...d, Tquanichingayvl: v }))} />
                </Section>
              </>
            ) : !(Array.isArray(selectedTemplate?.data_schema) && selectedTemplate.data_schema.length !== 0) ? (
              <>
                <div className="md:col-span-2 hidden">
                </div>


                  <Section title="─Éoß║ín 1 - ß╗Éng k├¡nh d├▓ ch├▓m sao">
                    <TextInput label="H╞░ß╗¢ng dß║½n thao t├íc" onChange={setStage1Instruction} value={stage1Instruction} />
                    <TextInput label="Ti├¬u ─æß╗ü sau khi soi thß║Ñy sao" onChange={setStage1RevealTitle} value={stage1RevealTitle} />
                    <TextArea label="Nß╗Öi dung sau khi soi thß║Ñy sao" onChange={setStage1RevealBody} value={stage1RevealBody} />
                    <TextInput label="N├║t sau khi soi thß║Ñy sao" onChange={setStage1RevealButton} value={stage1RevealButton} />
                    <ColorInput label="M├áu nß╗ün ─æoß║ín 1" onCommit={setStage1Background} value={stage1Background} />
                    <ColorInput label="M├áu nhß║Ñn ─æoß║ín 1" onCommit={setStage1Accent} value={stage1Accent} />
                    <MediaInput label="ß║ónh hoß║╖c video hiß╗çn trong ng├┤i sao ─æoß║ín 1" onChange={(url, type) => {
                      setStage1ImageUrl(url);
                      setStage1MediaType(type);
                    }} />
                  </Section>

                  <Section title="─Éoß║ín 2 - Quß╗╣ ─æß║ío hß╗ùn loß║ín">
                    <TextInput label="Ti├¬u ─æß╗ü ─æoß║ín 2" onChange={setStage2Title} value={stage2Title} />
                    <TextInput label="Caption ß║únh ─æoß║ín 2" onChange={setStage2ImageCaption} value={stage2ImageCaption} />
                    <TextArea label="M├┤ tß║ú ─æoß║ín 2" onChange={setStage2Subtitle} value={stage2Subtitle} />
                    <TextArea label="C├óu quote sau khi gh├⌐p ─æß╗º quß╗╣ ─æß║ío" onChange={setStage2Quote} value={stage2Quote} />
                    <TextInput label="N├║t tiß║┐p ─æoß║ín 2" onChange={setStage2NextButton} value={stage2NextButton} />
                    <ColorInput label="M├áu nß╗ün ─æoß║ín 2" onCommit={setStage2Background} value={stage2Background} />
                    <ColorInput label="M├áu nhß║Ñn ─æoß║ín 2" onCommit={setStage2Accent} value={stage2Accent} />
                    <MediaInput label="ß║ónh hoß║╖c video polaroid ─æoß║ín 2" onChange={(url, type) => {
                      setStage2ImageUrl(url);
                      setStage2MediaType(type);
                    }} />
                  </Section>

                  <Section title="─Éoß║ín 3 - Ch├▓m sao thanh ├óm">
                    <TextInput label="Ti├¬u ─æß╗ü ─æoß║ín 3" onChange={setStage3Title} value={stage3Title} />
                    <TextInput label="D├▓ng nhß║íc" onChange={setStage3MusicLabel} value={stage3MusicLabel} />
                    <TextArea label="M├┤ tß║ú ─æoß║ín 3" onChange={setStage3Subtitle} value={stage3Subtitle} />
                    <MediaInput label="ß║ónh hoß║╖c video hiß╗çn sau khi nß╗æi hß║┐t ch├▓m sao" onChange={(url, type) => {
                      setStage3MediaUrl(url);
                      setStage3MediaType(type);
                    }} />
                    <MediaInput label="Nhß║íc/Ghi ├óm ri├¬ng cho ─æoß║ín 3" onChange={(url) => setStage3AudioUrl(url)} />
                    <TextInput label="N├║t tiß║┐p ─æoß║ín 3" onChange={setStage3NextButton} value={stage3NextButton} />
                    <TextInput label="Tin nhß║»n sao 1" onChange={setStage3Message1} value={stage3Message1} />
                    <TextInput label="Tin nhß║»n sao 2" onChange={setStage3Message2} value={stage3Message2} />
                    <TextInput label="Tin nhß║»n sao 3" onChange={setStage3Message3} value={stage3Message3} />
                    <TextInput label="Tin nhß║»n sao 4" onChange={setStage3Message4} value={stage3Message4} />
                    <ColorInput label="M├áu nß╗ün ─æoß║ín 3" onCommit={setStage3Background} value={stage3Background} />
                    <ColorInput label="M├áu nhß║Ñn ─æoß║ín 3" onCommit={setStage3Accent} value={stage3Accent} />
                  </Section>

                  <Section title="─Éoß║ín 4 - M╞░a sao b─âng v├á micro">
                    <TextInput label="H╞░ß╗¢ng dß║½n bß║»t sao" onChange={setStage4Prompt} value={stage4Prompt} />
                    <TextInput label="H╞░ß╗¢ng dß║½n micro" onChange={setStage4MicInstruction} value={stage4MicInstruction} />
                    <TextInput label="N├║t dß╗▒ ph├▓ng khi mic lß╗ùi" onChange={setStage4FallbackButton} value={stage4FallbackButton} />
                    <TextInput label="Ti├¬u ─æß╗ü sau khi bß║»t sao" onChange={setStage4RevealTitle} value={stage4RevealTitle} />
                    <TextArea label="Nß╗Öi dung th╞░ sau khi thß╗òi mic" onChange={setStage4RevealBody} value={stage4RevealBody} />
                    <TextInput label="N├║t nhß║¡n sau khi thß╗òi mic" onChange={setStage4RevealButton} value={stage4RevealButton} />
                    <ColorInput label="M├áu nß╗ün ─æoß║ín 4" onCommit={setStage4Background} value={stage4Background} />
                    <ColorInput label="M├áu nhß║Ñn ─æoß║ín 4" onCommit={setStage4Accent} value={stage4Accent} />
                    <MediaInput label="ß║ónh hoß║╖c video phß╗º trong sao ─æoß║ín 4" onChange={(url, type) => {
                      setStage4ImageUrl(url);
                      setStage4MediaType(type);
                    }} />
                  </Section>

                  <Section title="─Éoß║ín 5 - Kß║┐t th├║c v├á nhß║¡n qu├á">
                    <TextInput label="Ti├¬u ─æß╗ü hß╗úp ─æß╗ông" onChange={setContractTitle} value={contractTitle} />
                    <TextArea label="Nß╗Öi dung hß╗úp ─æß╗ông" onChange={setContractBody} value={contractBody} />
                    <TextInput label="N├║t n├⌐ hß╗úp ─æß╗ông" onChange={setContractRejectButton} value={contractRejectButton} />
                    <TextInput label="H╞░ß╗¢ng dß║½n giß╗» v├ón tay" onChange={setContractHoldInstruction} value={contractHoldInstruction} />
                    <TextInput label="Ti├¬u ─æß╗ü cuß╗æi" onChange={setFinalTitle} value={finalTitle} />
                    <TextArea label="M├┤ tß║ú cuß╗æi" onChange={setFinalSubtitle} value={finalSubtitle} />
                    <TextInput label="N├║t nhß║¡n qu├á" onChange={setFinalCta} value={finalCta} />
                    <TextInput label="Ti├¬u ─æß╗ü th╞░ mß╗¥i" onChange={setGiftTitle} value={giftTitle} />
                    <TextArea label="Nß╗Öi dung th╞░ mß╗¥i" onChange={setGiftBody} value={giftBody} />
                    <DateInput label="Ng├áy giß╗¥ ─æß╗ü xuß║Ñt" onChange={setProposedDate} value={proposedDate} />
                    <TextArea label="C├íc c├óu tß╗½ chß╗æi (Mß╗ùi c├óu 1 d├▓ng, enter ─æß╗â xuß╗æng d├▓ng)" onChange={setGiftDeclineButton} value={giftDeclineButton} />
                    <TextInput label="N├║t ─æß╗ông ├╜" onChange={setGiftAcceptButton} value={giftAcceptButton} />
                    <TextInput label="Ti├¬u ─æß╗ü khi ─æß╗ông ├╜" onChange={setGiftAcceptedTitle} value={giftAcceptedTitle} />
                    <TextArea label="Nß╗Öi dung khi ─æß╗ông ├╜" onChange={setGiftAcceptedBody} value={giftAcceptedBody} />
                    <TextInput label="Ti├¬u ─æß╗ü khi hß║╣n ng├áy kh├íc" onChange={setGiftDeclinedTitle} value={giftDeclinedTitle} />
                    <TextArea label="Nß╗Öi dung khi hß║╣n ng├áy kh├íc" onChange={setGiftDeclinedBody} value={giftDeclinedBody} />
                    <TextInput label="N├║t quay lß║íi" onChange={setGiftBackButton} value={giftBackButton} />
                    <TextInput label="N├║t gß╗¡i lß╗ïch hß║╣n" onChange={setGiftRescheduleButton} value={giftRescheduleButton} />
                    <ColorInput label="M├áu nß╗ün ─æoß║ín cuß╗æi" onCommit={setFinalBackground} value={finalBackground} />
                    <ColorInput label="M├áu n├║t/nhß║Ñn ─æoß║ín cuß╗æi" onCommit={setFinalAccent} value={finalAccent} />
                  </Section>
              </>
            ) : null}

            {Array.isArray(selectedTemplate?.data_schema) && selectedTemplate.data_schema.length !== 0 && (() => {
              let schema = [...selectedTemplate.data_schema];
              if (isWedding) {
                // Remove engagementDate
                schema = schema.filter((f: any) => f.key !== 'engagementDate');
                
                // Only wedding-1 uses letterText, remove for others
                if (selectedComponentKey !== 'wedding-1') {
                  schema = schema.filter((f: any) => f.key !== 'letterText');
                }

                // Add template-specific text fields so users can edit hardcoded text
                if (selectedComponentKey === 'wedding-1') {
                  schema.push(
                    { section: "5. Th╞░ Viß╗çn ß║ónh", key: "gallery1", label: "ß║ónh Album 1", type: "media" },
                    { section: "5. Th╞░ Viß╗çn ß║ónh", key: "gallery2", label: "ß║ónh Album 2", type: "media" },
                    { section: "5. Th╞░ Viß╗çn ß║ónh", key: "gallery3", label: "ß║ónh Album 3", type: "media" },
                    { section: "5. Th╞░ Viß╗çn ß║ónh", key: "gallery4", label: "ß║ónh Album 4", type: "media" },
                    { section: "5. Th╞░ Viß╗çn ß║ónh", key: "gallery5", label: "ß║ónh Album 5", type: "media" },
                    { section: "5. Th╞░ Viß╗çn ß║ónh", key: "gallery6", label: "ß║ónh Album 6", type: "media" },
                    { section: "5. Th╞░ Viß╗çn ß║ónh", key: "gallery7", label: "ß║ónh Album 7", type: "media" }
                  );
                } else if (selectedComponentKey === 'wedding-5') {
                  schema.push(
                    { section: "3. Lß╗¥i Mß╗¥i", key: "inviteTitle", label: "Ti├¬u ─æß╗ü lß╗¥i mß╗¥i", type: "text", default: "Tr├ón trß╗ìng b├ío tin lß╗à th├ánh h├┤n" },
                    { section: "3. Lß╗¥i Mß╗¥i", key: "inviteText", label: "Nß╗Öi dung lß╗¥i mß╗¥i", type: "textarea", default: "Sß╗▒ hiß╗çn diß╗çn cß╗ºa qu├╜ kh├ích l├á niß╗üm vinh hß║ính cho gia ─æ├¼nh ch├║ng t├┤i" },
                    { section: "3. Lß╗¥i Mß╗¥i", key: "closingText", label: "Lß╗¥i kß║┐t", type: "text", default: "Rß║Ñt h├ón hß║ính ─æ╞░ß╗úc ─æ├│n tiß║┐p!" },
                    { section: "5. Th╞░ Viß╗çn ß║ónh", key: "groomImage", label: "ß║ónh ch├ón dung Ch├║ Rß╗â", type: "media" },
                    { section: "5. Th╞░ Viß╗çn ß║ónh", key: "brideImage", label: "ß║ónh ch├ón dung C├┤ D├óu", type: "media" }
                  );
                } else if (selectedComponentKey === 'wedding-6') {
                  schema.push(
                    { section: "3. Lß╗¥i Mß╗¥i", key: "inviteText", label: "Nß╗Öi dung lß╗¥i mß╗¥i", type: "textarea", default: "Sß╗▒ hiß╗çn diß╗çn cß╗ºa bß║ín l├á niß╗üm vinh hß║ính" },
                    { section: "5. Th╞░ Viß╗çn ß║ónh", key: "groomImage", label: "ß║ónh ch├ón dung Ch├║ Rß╗â", type: "media" },
                    { section: "5. Th╞░ Viß╗çn ß║ónh", key: "brideImage", label: "ß║ónh ch├ón dung C├┤ D├óu", type: "media" },
                    { section: "5. Th╞░ Viß╗çn ß║ónh", key: "footerImage", label: "ß║ónh nß╗ün cuß╗æi trang (Thank You)", type: "media" }
                  );
                } else if (selectedComponentKey === 'wedding-3') {
                  schema.push(
                    { section: "3. Lß╗¥i Mß╗¥i", key: "inviteTitle", label: "Ti├¬u ─æß╗ü lß╗¥i mß╗¥i", type: "text", default: "Lß╗¥i Mß╗¥i Tr├ón Trß╗ìng Tß╗½ Gia ─É├¼nh Ch├║ng T├┤i" },
                    { section: "3. Lß╗¥i Mß╗¥i", key: "inviteText", label: "Nß╗Öi dung lß╗¥i mß╗¥i", type: "textarea", default: "Sß╗▒ hiß╗çn diß╗çn cß╗ºa qu├╜ vß╗ï l├á niß╗üm vinh hß║ính\\ncho gia ─æ├¼nh ch├║ng t├┤i" }
                  );
                } else if (selectedComponentKey === 'wedding-2') {
                  schema.push(
                    { section: "3. Lß╗¥i Mß╗¥i", key: "inviteTitle", label: "Ti├¬u ─æß╗ü lß╗¥i mß╗¥i", type: "text", default: "Thiß╗çp Mß╗¥i" },
                    { section: "3. Lß╗¥i Mß╗¥i", key: "inviteText", label: "Nß╗Öi dung lß╗¥i mß╗¥i", type: "textarea", default: "Mß╗¥i bß║ín d├╣ng cß╗ù c├╣ng tß╗Ñi m├¼nh nh├⌐" },
                    { section: "3. Lß╗¥i Mß╗¥i", key: "closingText", label: "Lß╗¥i kß║┐t", type: "text", default: "Tr├ón Trß╗ìng Cß║úm ╞án" }
                  );
                } else if (selectedComponentKey === 'wedding-4') {
                  schema.push(
                    { section: "3. Lß╗¥i Mß╗¥i", key: "inviteTitle", label: "Ti├¬u ─æß╗ü lß╗¥i mß╗¥i", type: "text", default: "Tr├ón Trß╗ìng K├¡nh Mß╗¥i Tß╗¢i Dß╗▒ Bß╗»a Tiß╗çc" },
                    { section: "3. Lß╗¥i Mß╗¥i", key: "inviteText", label: "Nß╗Öi dung lß╗¥i mß╗¥i", type: "textarea", default: "Sß╗▒ hiß╗çn diß╗çn cß╗ºa qu├╜ kh├ích l├á vinh hß║ính\\ncho gia ─æ├¼nh ch├║ng t├┤i" },
                    { section: "3. Lß╗¥i Mß╗¥i", key: "closingText", label: "Lß╗¥i kß║┐t", type: "text", default: "Tr├ón Trß╗ìng Cß║úm ╞án" }
                  );
                }

                // Rename existing wedding fields for clarity
                schema = schema.map((f: any) => {
                  if (f.key === 'weddingDate') return { ...f, label: "Ng├áy & Giß╗¥ (Lß╗à C╞░ß╗¢i)" };
                  if (f.key === 'eventAddress') return { ...f, label: "T├¬n & ─Éß╗ïa chß╗ë nh├á h├áng (Lß╗à C╞░ß╗¢i)" };
                  if (f.key === 'mapUrl') return { ...f, label: "Link Google Maps (Lß╗à C╞░ß╗¢i)" };
                  if (f.key === 'mapImage') return { ...f, label: "ß║ónh bß║ún ─æß╗ô (Lß╗à C╞░ß╗¢i)" };
                  return f;
                });

                if (!schema.some((f: any) => f.key === 'tiecName')) {
                  // Add Tiß╗çc Mß╗½ng dates to Thß╗¥i Gian
                  const thoiGianIndex = schema.findIndex(f => f.section === "2. Thß╗¥i Gian");
                  if (thoiGianIndex !== -1) {
                    schema.splice(thoiGianIndex + 1, 0, { section: "2. Thß╗¥i Gian", key: "tiecDate", label: "Ng├áy & Giß╗¥ (Tiß╗çc Mß╗½ng)", type: "datetime" });
                    if (isGoi2) {
                      schema.splice(thoiGianIndex + 2, 0, { section: "2. Thß╗¥i Gian", key: "tiecDateGai", label: "Ng├áy & Giß╗¥ (Nh├á G├íi)", type: "datetime" });
                    }
                  } else {
                    schema.push({ section: "2. Thß╗¥i Gian", key: "tiecDate", label: "Ng├áy & Giß╗¥ (Tiß╗çc Mß╗½ng)", type: "datetime" });
                    if (isGoi2) schema.push({ section: "2. Thß╗¥i Gian", key: "tiecDateGai", label: "Ng├áy & Giß╗¥ (Nh├á G├íi)", type: "datetime" });
                  }

                  // Add Tiß╗çc Mß╗½ng locations to ─Éß╗ïa ─Éiß╗âm
                  schema.push(
                    { section: "4. ─Éß╗ïa ─Éiß╗âm", key: "tiecName", label: "T├¬n nh├á h├áng (Tiß╗çc Mß╗½ng)", type: "text" },
                    { section: "4. ─Éß╗ïa ─Éiß╗âm", key: "tiecAddress", label: "─Éß╗ïa chß╗ë cß╗Ñ thß╗â (Tiß╗çc Mß╗½ng)", type: "textarea" },
                    { section: "4. ─Éß╗ïa ─Éiß╗âm", key: "tiecMapUrl", label: "Link Google Maps (Tiß╗çc Mß╗½ng)", type: "text" }
                  );
                  if (isGoi2) {
                    schema.push(
                      { section: "4. ─Éß╗ïa ─Éiß╗âm", key: "tiecNameGai", label: "T├¬n nh├á h├áng (Nh├á G├íi)", type: "text" },
                      { section: "4. ─Éß╗ïa ─Éiß╗âm", key: "tiecAddressGai", label: "─Éß╗ïa chß╗ë cß╗Ñ thß╗â (Nh├á G├íi)", type: "textarea" },
                      { section: "4. ─Éß╗ïa ─Éiß╗âm", key: "tiecMapUrlGai", label: "Link Google Maps (Nh├á G├íi)", type: "text" }
                    );
                  }
                }
              }
              return (
              <>
                {Array.from(new Set(schema.map((f: any) => f.section || "T├╣y chß╗ënh nß╗Öi dung")))
                  .filter((sectionName: any) => sectionName !== "6. ├ém Nhß║íc")
                  .map((sectionName: any, secIdx) => (
                  <Section key={secIdx} title={sectionName}>
                    {schema
                      .filter((f: any) => (f.section || "T├╣y chß╗ënh nß╗Öi dung") === sectionName)
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
                        if (field.type === "date" || field.type === "datetime") {
                          return <DateInput key={i} label={field.label} value={val} onChange={v => setDynamicData(d => ({ ...d, [field.key]: v }))} />;
                        }
                        return <TextInput key={i} label={field.label} value={val} onChange={v => setDynamicData(d => ({ ...d, [field.key]: v }))} />;
                      })}
                  </Section>
                ))}
              </>
              );
            })()}
            
            <div className="sticky bottom-0 z-50 mt-8 pb-2 bg-transparent">
              <div className="flex gap-3 py-4 justify-center">
                <button
                  className="group relative overflow-hidden rounded-[2rem] border-[2px] border-white/20 bg-gradient-to-r from-[#ff477e] via-[#ff7eb8] to-[#ff477e] bg-[length:200%_auto] px-8 py-3 text-base font-black !text-white shadow-[0_10px_25px_rgba(255,71,126,0.4)] backdrop-blur-md transition-all animate-gradient-x hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(255,71,126,0.6)] active:scale-95 disabled:opacity-50"
                  disabled={isSavingEdits}
                  onClick={() => saveOrderEdits()}
                  type="button"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="relative z-10 drop-shadow-md tracking-wide">
                    {isSavingEdits ? "─Éang l╞░u..." : "≡ƒÆ╛ L╞░u chß╗ënh sß╗¡a"}
                  </span>
                </button>
                <button
                  className="group relative overflow-hidden rounded-[2rem] border-[2px] border-white/20 bg-gradient-to-r from-[#ff9100] via-[#ffb347] to-[#ff9100] bg-[length:200%_auto] px-8 py-3 text-base font-black !text-white shadow-[0_10px_25px_rgba(255,145,0,0.4)] backdrop-blur-md transition-all animate-gradient-x hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(255,145,0,0.6)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={isSavingEdits || !result?.unlocked}
                  onClick={handleLock}
                  title={!result?.unlocked ? "─É╞ín phß║úi ─æ╞░ß╗úc thanh to├ín tr╞░ß╗¢c khi kh├│a" : "Kh├│a ─æ╞ín sau khi ─æ├ú ho├án tß║Ñt chß╗ënh sß╗¡a"}
                  type="button"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="relative z-10 drop-shadow-md tracking-wide">
                    {result?.unlocked ? "≡ƒöÆ Kh├│a ─æ╞ín" : "≡ƒöÆ Chß╗¥ thanh to├ín"}
                  </span>
                </button>
                <button
                  className="group relative overflow-hidden rounded-[2rem] border-[2px] border-white/20 bg-gradient-to-r from-red-500 to-red-600 bg-[length:200%_auto] px-8 py-3 text-base font-black !text-white shadow-[0_10px_25px_rgba(239,68,68,0.4)] backdrop-blur-md transition-all animate-gradient-x hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(239,68,68,0.6)] active:scale-95 disabled:opacity-50"
                  disabled={isDeletingOrder || isSavingEdits}
                  onClick={() => setConfirmModal({
                    open: true,
                    type: "DELETE",
                    title: "X├íc nhß║¡n x├│a ─æ╞ín",
                    desc: "H├ánh ─æß╗Öng n├áy sß║╜ x├│a v─⌐nh viß╗àn ─æ╞ín h├áng v├á Tß║ñT Cß║ó h├¼nh ß║únh ─æ├¡nh k├¿m. Kh├┤ng thß╗â ho├án t├íc!",
                    onConfirm: handleDeleteOrder
                  })}
                  type="button"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="relative z-10 drop-shadow-md tracking-wide">
                    {isDeletingOrder ? "─Éang x├│a..." : "≡ƒùæ∩╕Å X├│a ─æ╞ín"}
                  </span>
                </button>
              </div>
            </div>
          </>
          )
        ) : null}

        {result ? (
            <div className="mt-4 grid gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 font-semibold text-emerald-900">
                <span>M├ú chuyß╗ân khoß║ún: {result.paymentCode}</span>
                <span className={`rounded-full px-3 py-1 text-xs border ${result.unlocked ? "border-emerald-300 bg-emerald-100 text-emerald-800" : "border-yellow-300 bg-yellow-100 text-yellow-800"}`}>
                  {result.unlocked ? "─É├ú thanh to├ín - ─æ├ú mß╗ƒ kh├│a" : "Chß╗¥ thanh to├ín"}
                </span>
              </div>
              <p className="text-xs text-emerald-800/70">
                {result.unlocked
                  ? "Kh├ích ─æ├ú chuyß╗ân tiß╗ün th├ánh c├┤ng. Nh├ón vi├¬n c├│ thß╗â chß╗ënh template v├á gß╗¡i link cho kh├ích."
                  : "Gß╗¡i QR n├áy cho kh├ích. Gift link ─æang bß╗ï kh├│a tß╗¢i khi webhook ng├ón h├áng x├íc nhß║¡n ─æ├║ng m├ú ─æ╞ín v├á sß╗æ tiß╗ün."}
              </p>
              {!result.unlocked ? (
                <div className="grid gap-4 rounded-2xl border border-pink-200 bg-white p-5 md:grid-cols-[160px_1fr] shadow-sm">
                {result.qrCodeUrl ? (
                  <div className="flex flex-col items-center justify-center gap-2 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="QR chuyß╗ân khoß║ún" className="h-40 w-40 rounded-2xl bg-white object-contain p-2" src={`${result.qrCodeUrl}${result.qrCodeUrl.includes("?") ? "&" : "?"}_t=${qrKey}`} />
                    <span className="text-[11px] font-medium text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200 shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      L├ám mß╗¢i sau: {Math.floor(qrTimeLeft / 60)}:{String(qrTimeLeft % 60).padStart(2, '0')}
                    </span>
                  </div>
                ) : (
                  <div className="grid h-40 w-40 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-center text-xs text-white/50">
                    Ch╞░a cß║Ñu h├¼nh t├ái khoß║ún nhß║¡n tiß╗ün
                  </div>
                )}
                <div className="grid content-center gap-2 text-sm text-gray-800">
                  <p><span className="text-gray-500 font-medium">Sß╗æ tiß╗ün:</span> <b className="text-pink-600 text-lg">{result.amount.toLocaleString("vi-VN")}─æ</b></p>
                  <p><span className="text-gray-500 font-medium">Nß╗Öi dung CK:</span> <b className="text-pink-600">{result.paymentCode}</b></p>
                  <p className="text-xs leading-5 text-gray-500">Kh├ích chuyß╗ân ─æ├║ng sß╗æ tiß╗ün v├á ─æ├║ng nß╗Öi dung. Webhook sß║╜ tß╗▒ mß╗ƒ kh├│a link sau khi tiß╗ün v├áo t├ái khoß║ún.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      className="rounded-full border border-pink-200 text-pink-700 bg-transparent px-4 py-2 text-xs font-semibold hover:bg-pink-50 hover:border-pink-300 transition-colors"
                      onClick={async () => {
                        await copyText(result.paymentCode);
                        showCopyMessage("─É├ú copy m├ú CK.");
                      }}
                      type="button"
                    >
                      Copy m├ú CK
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
                      <div className="flex gap-2">
                        <button
                          className="rounded-full border border-emerald-400 bg-emerald-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                          disabled={isConfirmingPayment || isConfirmingFree}
                          onClick={() => confirmPaymentManually(false)}
                          type="button"
                        >
                          {isConfirmingPayment ? "─Éang mß╗ƒ kh├│a..." : "─É├ú nhß║¡n tiß╗ün - mß╗ƒ kh├│a"}
                        </button>
                        <button
                          className="rounded-full border border-purple-400 bg-purple-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-purple-500/30 hover:bg-purple-600 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                          disabled={isConfirmingPayment || isConfirmingFree}
                          onClick={() => {
                            if (confirm("X├íc nhß║¡n mß╗ƒ kh├│a MIß╗äN PH├ì cho ─æ╞ín n├áy? ─É╞ín sß║╜ kh├┤ng ─æ╞░ß╗úc t├¡nh hoa hß╗ông.")) {
                              confirmPaymentManually(true);
                            }
                          }}
                          type="button"
                        >
                          {isConfirmingFree ? "─Éang mß╗ƒ kh├│a..." : "Miß╗àn thanh to├ín"}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              ) : null}
              {true ? (
                 <>
                    <div className="mt-2 grid gap-2">
                    <span className="block text-xs font-semibold text-pink-300">Link gß╗¡i cho ng╞░ß╗¥i ß║Ñy</span>
                    {isGoi3 ? (
                      <div className="grid gap-2">
                        <div className="grid gap-1">
                          <span className="text-[11px] text-pink-300/70 font-medium">≡ƒñ╡ Thiß╗çp Nh├á Trai</span>
                          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                            <input className="w-full rounded-xl border border-pink-300/30 bg-pink-900/30 px-4 py-3 text-pink-100 outline-none text-sm" readOnly value={`${result.giftLink}-trai`} />
                            <button className="rounded-xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-semibold" onClick={async () => {
                              await copyText(`${result.giftLink}-trai`);
                              showCopyMessage("─É├ú copy link Nh├á Trai.");
                            }} type="button">Copy</button>
                          </div>
                        </div>
                        <div className="grid gap-1">
                          <span className="text-[11px] text-pink-300/70 font-medium">≡ƒæ░ Thiß╗çp Nh├á G├íi</span>
                          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                            <input className="w-full rounded-xl border border-pink-300/30 bg-pink-900/30 px-4 py-3 text-pink-100 outline-none text-sm" readOnly value={`${result.giftLink}-gai`} />
                            <button className="rounded-xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-semibold" onClick={async () => {
                              await copyText(`${result.giftLink}-gai`);
                              showCopyMessage("─É├ú copy link Nh├á G├íi.");
                            }} type="button">Copy</button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                        <input className="w-full rounded-xl border border-pink-300/30 bg-pink-900/30 px-4 py-3 text-pink-100 outline-none" readOnly value={result.giftLink} />
                        <button className="rounded-xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-semibold" onClick={async () => {
                          await copyText(result.giftLink);
                          showCopyMessage("─É├ú copy gift link.");
                        }} type="button">Copy</button>
                      </div>
                    )}
                  </div>
                  <div className="mt-1 grid gap-2">
                    <span className="block text-xs font-semibold text-pink-300">Link ─æß╗â xem kß║┐t quß║ú</span>
                    <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                      <input className="w-full rounded-xl border border-pink-300/30 bg-pink-900/30 px-4 py-3 text-pink-100 outline-none" readOnly value={result.trackLink} />
                      <button className="rounded-xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-semibold" onClick={async () => {
                        await copyText(result.trackLink);
                        showCopyMessage("─É├ú copy track link.");
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

      {showSetupWorkspace ? (() => {
        const previewStepsMap: Record<string, { totalSteps: number, labels?: string[] }> = {
          "will-you-date-me": { totalSteps: 7, labels: ["Lß╗¥i mß╗¥i", "Phß║ún hß╗ôi", "─Éß╗ïa ─æiß╗âm", "Ng├áy giß╗¥", "M├│n ─ân", "N╞░ß╗¢c", "Lß╗¥i kß║┐t"] },
          "dating-1": { totalSteps: 7, labels: ["Lß╗¥i mß╗¥i", "Phß║ún hß╗ôi", "─Éß╗ïa ─æiß╗âm", "Ng├áy giß╗¥", "M├│n ─ân", "N╞░ß╗¢c", "Lß╗¥i kß║┐t"] },
          "dating-2": { totalSteps: 6, labels: ["Chß╗¥", "Rung ─æß╗Öng", "Nß║íp ─æß║ín", "Bß║»n tim", "Th├ánh c├┤ng", "Chß╗æt ─æ╞ín"] },
          "dating-3": { totalSteps: 8, labels: ["Bß║»t ─æß║ºu", "Gacha", "Mß╗ƒ nß║»p", "Bß║Ñt ngß╗¥", "Hß╗ôi hß╗Öp", "Ho├án tß║Ñt", "Lß╗¥i kß║┐t", "Th├ánh c├┤ng"] },
          "val-starry-constellation-01": { totalSteps: 5, labels: ["Bß║»t ─æß║ºu", "Xß║┐p sao", "Nhß║íc", "Thu thß║¡p", "Th├ánh c├┤ng"] },
          "valentine-1": { totalSteps: 5, labels: ["Bß║»t ─æß║ºu", "Xß║┐p sao", "Nhß║íc", "Thu thß║¡p", "Th├ánh c├┤ng"] },
          "valentine-2": { totalSteps: 8, labels: ["Bß║»t ─æß║ºu", "─Éß║┐m ng╞░ß╗úc", "Phim", "Phß║ún hß╗ôi", "Thß╗¡ th├ích", "C├óu hß╗Åi", "Ho├án tß║Ñt", "Cuß╗æi"] },
          "valentine-3": { totalSteps: 8, labels: ["Bß║»t ─æß║ºu", "V├ón tay", "M├íy", "Quiz", "Puzzle", "Chat", "ß║ónh", "Cuß╗æi"] },
          "birthday-1": { totalSteps: 10, labels: ["Tß╗æi", "Nhß║íc", "Trang tr├¡", "Lß╗¥i ch├║c", "Thß║»p nß║┐n", "─Éiß╗üu ╞░ß╗¢c", "Ph├ío", "Qu├á", "ß║ónh", "Cuß╗æi"] },
          "birthday-2": { totalSteps: 7, labels: ["B├ío thß╗⌐c", "Chat", "Giao h├áng", "Mß╗ƒ hß╗Öp", "B├ính", "Th╞░", "Cuß╗æi"] },
          "birthday-3": { totalSteps: 8, labels: ["G├╡ cß╗¡a", "V├áo nh├á", "K├⌐o r├¿m", "Thß║»p nß║┐n", "Ph├ío hoa", "Mß╗ƒ b├ính", "Qu├á", "Ch├║c mß╗½ng"] },
          "sorry-1": { totalSteps: 6, labels: ["Bß║»t ─æß║ºu", "Th╞░", "X├íc nhß║¡n", "Phß║ít", "Cam kß║┐t", "Cuß╗æi"] },
          "sorry-2": { totalSteps: 5, labels: ["Lß╗ùi", "Khß╗ºng long", "Th├╣ng r├íc", "C├ái ─æß║╖t", "Th├ánh c├┤ng"] },
          "sorry-3": { totalSteps: 6, labels: ["Chß║╖n", "N─ân nß╗ë", "Mß║¡t khß║⌐u", "Game", "X├íc nhß║¡n", "Th├ánh c├┤ng"] },
        };
        const normalizedKey = selectedComponentKey.replace(" #", "-");
        const currentConfig = previewStepsMap[normalizedKey] || { totalSteps: 1, labels: ["Preview"] };
        const previewIsCompact = !isMobileDevice;

        return (
      <aside className="glass-panel-soft rounded-2xl p-4 xl:sticky xl:top-5 xl:h-[calc(100dvh-40px)] min-h-[72svh] xl:min-h-0 flex flex-col w-full xl:w-[450px]">
        <div className="px-1 pb-4 shrink-0 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Live Preview</h2>
            <p className="mt-1 text-sm text-white/54">Xem tr╞░ß╗¢c hiß╗ân thß╗ï ß╗ƒ ─æ├óy.</p>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span className="text-xs text-white/64">├ém l╞░ß╗úng</span>
            <input type="range" min="0" max="1" step="0.05" value={builderVolume} onChange={(e) => setBuilderVolume(Number(e.target.value))} className="w-24 accent-pink-500" />
          </div>
        </div>
        <div id="builder-preview" className="flex-1 w-full min-h-[58svh] xl:min-h-0 flex items-center justify-center relative xl:pb-16">
            <InteractiveTemplatePreview
              componentKey={selectedComponentKey}
              customData={isGoi3 && activeTab === "gai" ? { ...customData, ...(dynamicData.gai || {}) } : customData}
              question={question}
              recipientName={recipientName || "Em"}
              senderName={senderName || "Anh"}
              visualLabel={selectedTemplate?.visual_label}
              generalAudioUrl={generalAudioUrl}
              musicUrl={generalAudioUrl}
              compact={previewIsCompact}
              isBuilderPreview={true}
              fullScreen={false}
            />
        </div>
      </aside>
      );
      })() : null}

      {/* Lock/Unlock Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[99999] grid place-items-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setConfirmModal(null)}>
          <div className="w-full max-w-sm rounded-3xl border border-pink-200 bg-[#fff5fb] p-6 text-center text-pink-950 shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="text-5xl mb-4 drop-shadow-md">{confirmModal.type === "LOCK" ? "≡ƒöÆ" : confirmModal.type === "DELETE" ? "≡ƒùæ∩╕Å" : "≡ƒöô"}</div>
            <h2 className="text-xl font-black text-pink-900 mb-3">{confirmModal.title}</h2>
            <p className="text-sm text-pink-800/80 mb-8 whitespace-pre-line leading-relaxed font-medium">{confirmModal.desc}</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                className="rounded-full bg-pink-100 py-3.5 text-sm font-bold text-pink-700 hover:bg-pink-200 transition-colors"
                onClick={() => setConfirmModal(null)}
              >
                Hß╗ºy
              </button>
              <button 
                className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-500/30 hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(null);
                }}
              >
                ─Éß╗ông ├╜
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
          + Th├¬m lß╗▒a chß╗ìn
        </button>
      </div>
    </div>
  );
}
