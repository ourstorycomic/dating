"use client";

import { useState, useRef } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "@/components/ui/Toast";

type Template = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  tagline: string | null;
  base_price: number;
  is_published: boolean;
  status_label: string | null;
  visual_label: string | null;
  sort_order: number;
  thumbnail_url?: string | null;
  component_key?: string | null;
};

export function TemplateManager({ initialTemplates }: { initialTemplates: Template[] }) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [editing, setEditing] = useState<Template | null>(null);
  const [saving, setSaving] = useState(false);

  // Thumbnail upload
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  /** Blob URL created from the selected file — shown immediately for instant preview */
  const [thumbBlobUrl, setThumbBlobUrl] = useState<string | null>(null);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Helpers ────────────────────────────────────────────────────────────────

  /** Current thumbnail to show in table: prefer DB url, fallback to nothing */
  function getTableThumb(template: Template) {
    return template.thumbnail_url ?? null;
  }

  /** Thumbnail shown in the edit modal: blob (just selected) > DB url > null */
  function getModalThumb() {
    return thumbBlobUrl ?? editing?.thumbnail_url ?? null;
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleOpenEdit = (template: Template) => {
    setEditing({ ...template });
    setThumbFile(null);
    // Revoke previous blob url to avoid memory leaks
    if (thumbBlobUrl) {
      URL.revokeObjectURL(thumbBlobUrl);
      setThumbBlobUrl(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke old blob
    if (thumbBlobUrl) URL.revokeObjectURL(thumbBlobUrl);

    setThumbFile(file);
    // Create blob URL → instant preview without uploading yet
    setThumbBlobUrl(URL.createObjectURL(file));
  };

  const clearThumbSelection = () => {
    if (thumbBlobUrl) URL.revokeObjectURL(thumbBlobUrl);
    setThumbFile(null);
    setThumbBlobUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadThumbnail = async (id: string, slug: string, file: File): Promise<string | null> => {
    setUploadingThumb(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("slug", slug);

      const res = await fetch(`/api/templates/${id}/thumbnail`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload thất bại");

      if (data.stats) {
        const { originalKB, outputKB, savedPercent, format } = data.stats;
        toast.success(`✅ Upload OK · ${originalKB}KB → ${outputKB}KB (-${savedPercent}%) · .${format}`);
      }
      return data.url as string;
    } finally {
      setUploadingThumb(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);

    try {
      let newThumbUrl = editing.thumbnail_url;

      // 1. Upload thumbnail first (gets Supabase Storage URL)
      if (thumbFile) {
        newThumbUrl = await uploadThumbnail(editing.id, editing.slug, thumbFile);
      }

      // 2. Save metadata
      const res = await fetch(`/api/templates/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editing.name,
          slug: editing.slug,
          description: editing.description,
          tagline: editing.tagline,
          base_price: editing.base_price,
          is_published: editing.is_published,
          status_label: editing.status_label,
          visual_label: editing.visual_label,
          sort_order: editing.sort_order,
        }),
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");

      // 3. Update local state with new thumbnail_url
      const updated = { ...editing, thumbnail_url: newThumbUrl ?? editing.thumbnail_url };
      setTemplates(templates.map((t) => (t.id === editing.id ? updated : t)));

      // Cleanup
      if (thumbBlobUrl) URL.revokeObjectURL(thumbBlobUrl);
      setThumbFile(null);
      setThumbBlobUrl(null);
      setEditing(null);

      toast.success("Đã cập nhật template thành công!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const modalThumb = getModalThumb();
  const isBusy = saving || uploadingThumb;

  return (
    <>
      <GlassCard hover={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-pink-200/60 text-pink-800">
              <tr>
                <th className="px-4 py-3 font-semibold">Thumbnail</th>
                <th className="px-4 py-3 font-semibold">Tên (Slug)</th>
                <th className="px-4 py-3 font-semibold">Mô tả</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-100">
              {templates.map((template) => {
                const thumb = getTableThumb(template);
                return (
                  <tr key={template.id} className="transition-colors hover:bg-pink-50/50">
                    {/* Thumbnail preview */}
                    <td className="px-4 py-3">
                      <div className="relative h-16 w-8 overflow-hidden rounded-lg border border-pink-200 bg-[#05020a] shadow-sm">
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb} alt="" className="h-full w-full object-cover object-top" />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <svg className="h-4 w-4 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-pink-950">{template.name}</p>
                      <p className="text-xs text-pink-600">{template.slug}</p>
                    </td>
                    <td className="px-4 py-4 max-w-[300px]">
                      <p className="truncate text-xs text-pink-600">{template.description}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${template.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                        {template.is_published ? "Công khai" : "Đã ẩn"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(template)}
                        className="rounded-lg bg-pink-100 px-3 py-1.5 text-xs font-semibold text-pink-700 transition hover:bg-pink-200"
                      >
                        Sửa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm p-4" onMouseDown={() => !isBusy && setEditing(null)}>
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-pink-200 bg-pink-50 text-pink-950 shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-pink-200 bg-pink-50 p-5">
              <h2 className="text-xl font-semibold text-pink-900">Sửa Template: {editing.name}</h2>
              <button disabled={isBusy} className="rounded-full bg-pink-100 px-4 py-2 text-sm font-medium text-pink-700 hover:bg-pink-200 transition disabled:opacity-50" onClick={() => setEditing(null)}>
                Đóng
              </button>
            </div>

            <form onSubmit={handleSave} className="grid gap-5 p-5">

              {/* ── Thumbnail Upload ─────────────────────────────────────── */}
              <div className="grid gap-3">
                <span className="text-sm font-semibold text-pink-800">🖼 Thumbnail trang chủ</span>
                <div className="flex items-start gap-4">

                  {/* Phone-frame thumbnail preview — updates instantly on file select */}
                  <div
                    className={`relative flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-pink-300 bg-[#05020a] shadow transition hover:border-pink-500 ${editing?.component_key?.toLowerCase().includes('video') ? 'w-32 h-18 aspect-video' : 'h-32 w-16'}`}
                    onClick={() => fileInputRef.current?.click()}
                    title="Click để chọn ảnh"
                  >
                    {modalThumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={modalThumb}            /* key forces re-render on src change */
                        src={modalThumb}
                        alt="thumbnail preview"
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <svg className="h-6 w-6 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 transition hover:opacity-100 rounded-2xl">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl border-2 border-dashed border-pink-300 bg-white px-4 py-2.5 text-sm font-semibold text-pink-600 transition hover:border-pink-500 hover:bg-pink-50 text-left"
                    >
                      {thumbFile ? (
                        <span className="flex items-center gap-2">
                          <span className="text-green-600">✓</span> {thumbFile.name}
                        </span>
                      ) : "Chọn ảnh thumbnail…"}
                    </button>

                    <p className="text-xs text-pink-400">PNG / JPG / WebP · {editing?.component_key?.toLowerCase().includes('video') ? 'Tỉ lệ 16:9 (ngang)' : 'Tỉ lệ 9:19 (điện thoại)'} · Max 10MB</p>
                    <p className="text-xs text-pink-400">Ảnh sẽ được nén tự động và lưu lên Supabase Storage.</p>

                    {thumbFile && (
                      <button type="button" className="self-start text-xs text-pink-400 underline hover:text-pink-600" onClick={clearThumbSelection}>
                        Bỏ chọn
                      </button>
                    )}
                  </div>
                </div>

                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFileChange} />
              </div>

              <hr className="border-pink-200" />

              {/* ── Metadata ─────────────────────────────────────────────── */}
              <div className="grid grid-cols-2 gap-4">
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-pink-800">Tên hiển thị</span>
                  <input required className="rounded-xl border border-pink-200 bg-white px-4 py-2.5 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-pink-800">Slug (Đường dẫn)</span>
                  <input required className="rounded-xl border border-pink-200 bg-white px-4 py-2.5 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
                </label>
              </div>

              <label className="grid gap-2 text-sm">
                <span className="font-medium text-pink-800">Mô tả</span>
                <textarea className="min-h-[80px] rounded-xl border border-pink-200 bg-white px-4 py-2.5 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50" value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </label>

              <div className="grid grid-cols-3 gap-4">
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-pink-800">Nhãn trạng thái (New, Hot)</span>
                  <input className="rounded-xl border border-pink-200 bg-white px-4 py-2.5 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50" value={editing.status_label || ""} onChange={(e) => setEditing({ ...editing, status_label: e.target.value })} />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-pink-800">Nhãn giao diện (Màu)</span>
                  <input className="rounded-xl border border-pink-200 bg-white px-4 py-2.5 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50" value={editing.visual_label || ""} onChange={(e) => setEditing({ ...editing, visual_label: e.target.value })} />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-pink-800">Thứ tự hiển thị</span>
                  <input type="number" className="rounded-xl border border-pink-200 bg-white px-4 py-2.5 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
                </label>
              </div>

              <label className="flex items-center gap-3 text-sm mt-2">
                <input type="checkbox" className="h-5 w-5 rounded border-pink-300 text-pink-500 focus:ring-pink-500" checked={editing.is_published} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} />
                <span className="font-medium text-pink-900">Công khai (Hiển thị cho khách)</span>
              </label>

              <div className="mt-4 flex justify-end border-t border-pink-200 pt-4">
                <button type="submit" disabled={isBusy} className="rounded-xl bg-pink-500 px-6 py-2.5 font-bold text-white shadow-lg transition hover:bg-pink-600 active:scale-95 disabled:opacity-50">
                  {isBusy ? "Đang lưu…" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
