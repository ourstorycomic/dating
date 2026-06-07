"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type LayerType = "text" | "image" | "shape" | "drawing";

type Layer = {
  id: string;
  type: LayerType;
  label: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  color: string;
};

const presets = [
  { key: "love-password", name: "Mật khẩu tình yêu", scenes: ["Mở khóa", "Album", "Lá thư", "Phản hồi"] },
  { key: "memory-vault", name: "Kho kỷ niệm", scenes: ["Timeline", "Ảnh", "Nhạc", "Lời kết"] },
  { key: "tree-letter", name: "Cây mọc rơi thư", scenes: ["Trồng cây", "Thư rơi", "Ảnh", "Phản hồi"] },
  { key: "firework-letter", name: "Pháo hoa lá thư", scenes: ["Pháo hoa", "Thư", "Ảnh nền", "Phản hồi"] },
  { key: "lucky-wheel", name: "Vòng quay may mắn", scenes: ["Quay", "Phần quà", "Lời nhắn", "Phản hồi"] },
  { key: "puzzle-love", name: "Xếp hình kỷ niệm", scenes: ["Ghép ảnh", "Mở khóa", "Thư", "Phản hồi"] },
  { key: "birthday-gift", name: "Hộp quà sinh nhật", scenes: ["Mở hộp", "Bóng bay", "Lời chúc", "Album"] },
  { key: "scratch-card", name: "Thẻ cào bí mật", scenes: ["Cào thẻ", "Hiện thư", "Ảnh", "Phản hồi"] },
  { key: "calendar-love", name: "Lịch ngày yêu", scenes: ["Chọn ngày", "Đếm ngày", "Kỷ niệm", "Thư"] },
  { key: "music-story", name: "Câu chuyện có nhạc", scenes: ["Play nhạc", "Story", "Ảnh", "Lời kết"] },
  { key: "starry-constellation", name: "Bản đồ sao tình yêu", scenes: ["Nhập tọa độ", "Nối sao", "Ký ức", "Tín hiệu"] },
  { key: "glitch-confession", name: "Lỗi hệ thống", scenes: ["Cảnh báo", "Quét virus", "Giải mã", "Trượt đồng ý"] },
  { key: "magical-gacha", name: "Gacha trứng phép thuật", scenes: ["Kéo xu", "Quay máy", "Đập trứng", "Cào voucher"] },
  { key: "mixtape-cassette", name: "Cuộn băng cassette", scenes: ["Cuộn dây", "Play nhạc", "Polaroid", "Xé vé"] },
  { key: "detective-board", name: "Bảng điều tra vụ án", scenes: ["Soi đèn", "Bằng chứng", "Hồ sơ", "Điểm chỉ"] },
  { key: "treasure-map", name: "Bản đồ kho báu", scenes: ["Mở bản đồ", "Xúc xắc", "Trạm quà", "Đảo bánh"] },
  { key: "glass-vault", name: "Bảo tàng ký ức", scenes: ["Cắm chip", "Lau kính", "Nhịp tim", "Nhận quà"] },
  { key: "tactical-breach", name: "Chiến dịch đột kích", scenes: ["Radar", "Khóa mục tiêu", "Đặt C4", "Đồng ý"] },
  { key: "puzzle-box", name: "Hộp kỹ thuật số", scenes: ["Xoay mã", "Châm nến", "Thổi nến", "Cào quà"] },
];

const palettes = [
  ["#ff4fd8", "#9b5cff", "#12091f"],
  ["#ff6b9f", "#ffd1dc", "#30121f"],
  ["#8b5cf6", "#38bdf8", "#0f1028"],
  ["#fb7185", "#fbbf24", "#27110f"],
  ["#34d399", "#f9a8d4", "#101827"],
];

function createLayer(type: LayerType): Layer {
  const id = crypto.randomUUID();
  if (type === "text") {
    return {
      id,
      type,
      label: "Tiêu đề",
      content: "Gửi người anh thương",
      x: 18,
      y: 18,
      width: 64,
      height: 12,
      rotate: 0,
      color: "#ffffff",
    };
  }

  if (type === "image") {
    return {
      id,
      type,
      label: "Ảnh kỷ niệm",
      content: "Ảnh",
      x: 24,
      y: 34,
      width: 52,
      height: 28,
      rotate: -3,
      color: "#ffffff33",
    };
  }

  if (type === "drawing") {
    return {
      id,
      type,
      label: "Nét vẽ",
      content: "love",
      x: 30,
      y: 28,
      width: 40,
      height: 22,
      rotate: -8,
      color: "#ff8ad8",
    };
  }

  return {
    id,
    type,
    label: "Khối trang trí",
    content: "shape",
    x: 60,
    y: 18,
    width: 18,
    height: 18,
    rotate: 12,
    color: "#ff4fd8",
  };
}

export function TemplateBuilder() {
  const [templateName, setTemplateName] = useState("Template tỏ tình mới");
  const [preset, setPreset] = useState(presets[0]);
  const [palette, setPalette] = useState(palettes[0]);
  const [layers, setLayers] = useState<Layer[]>([
    createLayer("text"),
    createLayer("image"),
    createLayer("shape"),
  ]);
  const [selectedId, setSelectedId] = useState(layers[0]?.id);
  const selectedLayer = useMemo(
    () => layers.find((layer) => layer.id === selectedId),
    [layers, selectedId],
  );

  function updateSelected(patch: Partial<Layer>) {
    setLayers((current) =>
      current.map((layer) => (layer.id === selectedId ? { ...layer, ...patch } : layer)),
    );
  }

  function addLayer(type: LayerType) {
    const next = createLayer(type);
    setLayers((current) => [...current, next]);
    setSelectedId(next.id);
  }

  function deleteSelected() {
    setLayers((current) => current.filter((layer) => layer.id !== selectedId));
    setSelectedId(layers[0]?.id);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[310px_1fr_340px]">
      <aside className="glass-panel rounded-2xl p-5">
        <h2 className="text-2xl font-semibold">Cấu hình</h2>
        <div className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm">
            <span className="text-white/64">Tên template</span>
            <input
              className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none"
              onChange={(event) => setTemplateName(event.target.value)}
              value={templateName}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-white/64">Kiểu tương tác</span>
            <select
              className="rounded-xl border border-white/10 bg-[#170d24] px-4 py-3 outline-none"
              onChange={(event) => {
                const next = presets.find((item) => item.key === event.target.value);
                if (next) setPreset(next);
              }}
              value={preset.key}
            >
              {presets.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <div>
            <p className="mb-2 text-sm text-white/64">Bảng màu</p>
            <div className="grid gap-2">
              {palettes.map((item) => (
                <button
                  className={cn(
                    "flex rounded-xl border p-2 transition",
                    item === palette ? "border-pink-300/60" : "border-white/10",
                  )}
                  key={item.join("-")}
                  onClick={() => setPalette(item)}
                  type="button"
                >
                  {item.map((color) => (
                    <span className="h-8 flex-1 first:rounded-l-lg last:rounded-r-lg" key={color} style={{ background: color }} />
                  ))}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-white/64">Thêm layer</p>
            <div className="grid grid-cols-2 gap-2">
              <button className="rounded-xl bg-white/10 px-3 py-3 text-sm" onClick={() => addLayer("text")} type="button">Text</button>
              <button className="rounded-xl bg-white/10 px-3 py-3 text-sm" onClick={() => addLayer("image")} type="button">Ảnh</button>
              <button className="rounded-xl bg-white/10 px-3 py-3 text-sm" onClick={() => addLayer("shape")} type="button">Khối</button>
              <button className="rounded-xl bg-white/10 px-3 py-3 text-sm" onClick={() => addLayer("drawing")} type="button">Vẽ</button>
            </div>
          </div>
        </div>
      </aside>

      <section className="glass-panel rounded-2xl p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{templateName}</h2>
            <p className="mt-1 text-sm text-white/58">{preset.name} · kéo layer trực tiếp trên canvas</p>
          </div>
          <button className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 text-sm font-semibold">
            Lưu template
          </button>
        </div>

        <div
          className="relative mx-auto aspect-[9/16] max-h-[720px] min-h-[560px] overflow-hidden rounded-[28px] border border-white/15 shadow-[0_28px_80px_rgba(0,0,0,0.34)]"
          style={{
            background: `radial-gradient(circle at 50% 18%, ${palette[0]}66, transparent 34%), linear-gradient(145deg, ${palette[2]}, ${palette[1]}55)`,
          }}
        >
          <div className="absolute inset-x-4 top-4 z-10 rounded-full border border-white/10 bg-black/20 px-4 py-3 text-center text-xs font-semibold backdrop-blur-xl">
            {preset.scenes.join(" · ")}
          </div>

          {layers.map((layer) => (
            <button
              className={cn(
                "absolute grid cursor-move place-items-center border text-center transition",
                selectedId === layer.id ? "border-pink-200 ring-2 ring-pink-300/40" : "border-white/10",
                layer.type === "image" && "rounded-2xl bg-white/15",
                layer.type === "shape" && "rounded-full",
                layer.type === "drawing" && "rounded-[45%] border-dashed",
                layer.type === "text" && "rounded-xl bg-black/10 px-3 font-bold",
              )}
              key={layer.id}
              onClick={() => setSelectedId(layer.id)}
              onMouseDown={(event) => {
                const parentRect = event.currentTarget.parentElement?.getBoundingClientRect();
                if (!parentRect) return;
                const rect = parentRect;
                const startX = event.clientX;
                const startY = event.clientY;
                const baseX = layer.x;
                const baseY = layer.y;

                function onMove(moveEvent: MouseEvent) {
                  const dx = ((moveEvent.clientX - startX) / rect.width) * 100;
                  const dy = ((moveEvent.clientY - startY) / rect.height) * 100;
                  setLayers((current) =>
                    current.map((item) =>
                      item.id === layer.id
                        ? {
                            ...item,
                            x: Math.max(0, Math.min(95, baseX + dx)),
                            y: Math.max(0, Math.min(95, baseY + dy)),
                          }
                        : item,
                    ),
                  );
                }

                function onUp() {
                  window.removeEventListener("mousemove", onMove);
                  window.removeEventListener("mouseup", onUp);
                }

                window.addEventListener("mousemove", onMove);
                window.addEventListener("mouseup", onUp);
              }}
              style={{
                color: layer.type === "text" ? layer.color : "#ffffff",
                backgroundColor: layer.type === "shape" || layer.type === "drawing" ? layer.color : undefined,
                height: `${layer.height}%`,
                left: `${layer.x}%`,
                top: `${layer.y}%`,
                transform: `rotate(${layer.rotate}deg)`,
                width: `${layer.width}%`,
              }}
              type="button"
            >
              {layer.type === "image" ? "Ảnh" : layer.content}
            </button>
          ))}
        </div>
      </section>

      <aside className="glass-panel rounded-2xl p-5">
        <h2 className="text-2xl font-semibold">Layer</h2>
        {selectedLayer ? (
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm">
              <span className="text-white/64">Nội dung</span>
              <input
                className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none"
                onChange={(event) => updateSelected({ content: event.target.value })}
                value={selectedLayer.content}
              />
            </label>
            {[
              ["x", "Ngang"],
              ["y", "Dọc"],
              ["width", "Rộng"],
              ["height", "Cao"],
              ["rotate", "Xoay"],
            ].map(([key, label]) => (
              <label className="grid gap-2 text-sm" key={key}>
                <span className="text-white/64">{label}</span>
                <input
                  className="accent-pink-400"
                  max={key === "rotate" ? 180 : 100}
                  min={key === "rotate" ? -180 : 0}
                  onChange={(event) => updateSelected({ [key]: Number(event.target.value) })}
                  type="range"
                  value={Number(selectedLayer[key as keyof Layer])}
                />
              </label>
            ))}
            <label className="grid gap-2 text-sm">
              <span className="text-white/64">Màu</span>
              <input
                className="h-12 rounded-xl border border-white/10 bg-white/[0.07] p-1"
                onChange={(event) => updateSelected({ color: event.target.value })}
                type="color"
                value={selectedLayer.color}
              />
            </label>
            <button className="rounded-full border border-rose-300/20 bg-rose-400/10 px-5 py-3 text-sm font-semibold text-rose-100" onClick={deleteSelected} type="button">
              Xóa layer
            </button>
          </div>
        ) : (
          <p className="mt-5 text-sm text-white/58">Chọn một layer trên canvas để chỉnh.</p>
        )}
      </aside>
    </div>
  );
}
