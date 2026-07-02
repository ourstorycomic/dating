"use client";

import { useState } from "react";
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
};

export function TemplateManager({ initialTemplates }: { initialTemplates: Template[] }) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [editing, setEditing] = useState<Template | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);

    try {
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

      setTemplates(templates.map((t) => (t.id === editing.id ? editing : t)));
      setEditing(null);
      toast.success("Đã cập nhật template thành công!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <GlassCard hover={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-pink-200/60 text-pink-800">
              <tr>
                <th className="px-4 py-3 font-semibold">Tên (Slug)</th>
                <th className="px-4 py-3 font-semibold">Mô tả</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-100">
              {templates.map((template) => (
                <tr key={template.id} className="transition-colors hover:bg-pink-50/50">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-pink-950">{template.name}</p>
                    <p className="text-xs text-pink-600">{template.slug}</p>
                  </td>
                  <td className="px-4 py-4 max-w-[300px]">
                    <p className="truncate text-xs text-pink-600">{template.description}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        template.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {template.is_published ? "Công khai" : "Đã ẩn"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => setEditing({ ...template })}
                      className="rounded-lg bg-pink-100 px-3 py-1.5 text-xs font-semibold text-pink-700 transition hover:bg-pink-200"
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm p-4" onMouseDown={() => !saving && setEditing(null)}>
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-pink-200 bg-pink-50 text-pink-950 shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-pink-200 bg-pink-50 p-5">
              <h2 className="text-xl font-semibold text-pink-900">Sửa Template: {editing.name}</h2>
              <button 
                disabled={saving}
                className="rounded-full bg-pink-100 px-4 py-2 text-sm font-medium text-pink-700 hover:bg-pink-200 transition disabled:opacity-50" 
                onClick={() => setEditing(null)}
              >
                Đóng
              </button>
            </div>
            
            <form onSubmit={handleSave} className="grid gap-5 p-5">
              <div className="grid grid-cols-2 gap-4">
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-pink-800">Tên hiển thị</span>
                  <input
                    required
                    className="rounded-xl border border-pink-200 bg-white px-4 py-2.5 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-pink-800">Slug (Đường dẫn)</span>
                  <input
                    required
                    className="rounded-xl border border-pink-200 bg-white px-4 py-2.5 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50"
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm">
                <span className="font-medium text-pink-800">Mô tả</span>
                <textarea
                  className="min-h-[80px] rounded-xl border border-pink-200 bg-white px-4 py-2.5 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50"
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </label>

              <div className="grid grid-cols-3 gap-4">
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-pink-800">Nhãn trạng thái (New, Hot)</span>
                  <input
                    className="rounded-xl border border-pink-200 bg-white px-4 py-2.5 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50"
                    value={editing.status_label || ""}
                    onChange={(e) => setEditing({ ...editing, status_label: e.target.value })}
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-pink-800">Nhãn giao diện (Màu)</span>
                  <input
                    className="rounded-xl border border-pink-200 bg-white px-4 py-2.5 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50"
                    value={editing.visual_label || ""}
                    onChange={(e) => setEditing({ ...editing, visual_label: e.target.value })}
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-pink-800">Thứ tự hiển thị</span>
                  <input
                    type="number"
                    className="rounded-xl border border-pink-200 bg-white px-4 py-2.5 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50"
                    value={editing.sort_order}
                    onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                  />
                </label>
              </div>

              <label className="flex items-center gap-3 text-sm mt-2">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-pink-300 text-pink-500 focus:ring-pink-500"
                  checked={editing.is_published}
                  onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })}
                />
                <span className="font-medium text-pink-900">Công khai (Hiển thị cho khách)</span>
              </label>

              <div className="mt-4 flex justify-end border-t border-pink-200 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-pink-500 px-6 py-2.5 font-bold text-white shadow-lg transition hover:bg-pink-600 active:scale-95 disabled:opacity-50"
                >
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
