"use client";

import { useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

type CustomRole = {
  base_role: "ADMIN" | "STAFF" | "EMPLOYEE";
  commission_percentage: number;
  created_at: string;
  description: string | null;
  id: string;
  is_active: boolean;
  name: string;
  permissions: string[];
  system?: boolean;
  role_commission_rules?: Array<{
    is_active: boolean;
    percentage: number;
    template_id: string;
  }>;
};

type TemplateOption = {
  id: string;
  name: string;
};

const permissionOptions = [
  { key: "orders:create", label: "Tạo đơn" },
  { key: "orders:create_free", label: "Tạo đơn Miễn phí/Test" },
  { key: "orders:view_all", label: "Xem mọi đơn" },
  { key: "users:view", label: "Xem nhân sự" },
  { key: "users:edit", label: "Sửa nhân sự" },
  { key: "logs:view", label: "Xem nhật ký" },
  { key: "logs:delete", label: "Xóa nhật ký" },
  { key: "analytics:view", label: "Xem thống kê" },
  { key: "commissions:edit", label: "Chỉnh hoa hồng" },
  { key: "templates:edit", label: "Quản lý kho template" },
];

const emptyForm = {
  commissionPercentage: 0,
  description: "",
  id: "",
  isActive: true,
  name: "",
  permissions: ["orders:create"],
  productRules: [] as Array<{ isActive: boolean; percentage: number; templateId: string }>,
};

const defaultRoles: CustomRole[] = [
  {
    base_role: "ADMIN",
    commission_percentage: 0,
    created_at: "",
    description: "Full quyền hệ thống. Vai trò này cố định và không chỉnh sửa.",
    id: "system-admin",
    is_active: true,
    name: "Admin",
    permissions: permissionOptions.map((item) => item.key),
    system: true,
  },
  {
    base_role: "STAFF",
    commission_percentage: 10,
    created_at: "",
    description: "Quản lý content/nhân viên, xem nhật ký và thống kê team.",
    id: "system-staff",
    is_active: true,
    name: "Staff",
    permissions: ["users:view", "logs:view", "analytics:view"],
    system: true,
  },
  {
    base_role: "EMPLOYEE",
    commission_percentage: 30,
    created_at: "",
    description: "Content tiếp nhận khách từ TikTok và tạo đơn.",
    id: "system-content",
    is_active: true,
    name: "Content",
    permissions: ["orders:create"],
    system: true,
  },
];

function normalizeRoleName(name: string) {
  return name.trim().toLowerCase();
}

function mergeRoles(initialRoles: CustomRole[]) {
  const existingNames = initialRoles.map((role) => normalizeRoleName(role.name));
  const hasAdmin = initialRoles.some((role) => role.base_role === "ADMIN") || existingNames.some((name) => name.includes("admin"));
  const hasStaff = initialRoles.some((role) => role.base_role === "STAFF") || existingNames.some((name) => name.includes("staff"));
  const hasContent = initialRoles.some((role) => role.base_role === "EMPLOYEE") || existingNames.some((name) => name.includes("content") || name.includes("nhân viên"));
  const missingDefaults = defaultRoles.filter((role) => {
    if (role.base_role === "ADMIN") return !hasAdmin;
    if (role.base_role === "STAFF") return !hasStaff;
    return !hasContent;
  });
  return [...initialRoles, ...missingDefaults];
}

function inferBaseRole(permissions: string[]) {
  if (permissions.includes("users:edit") || permissions.includes("logs:delete") || permissions.includes("commissions:edit") || permissions.includes("templates:edit")) {
    return "ADMIN";
  }

  if (permissions.includes("users:view") || permissions.includes("logs:view") || permissions.includes("analytics:view") || permissions.includes("orders:view_all")) {
    return "STAFF";
  }

  return "EMPLOYEE";
}

export function RoleManager({ initialRoles, templates }: { initialRoles: CustomRole[]; templates: TemplateOption[] }) {
  const [roles, setRoles] = useState(() => mergeRoles(initialRoles));
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const visibleRoles = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return roles;
    return roles.filter((role) =>
      `${role.name} ${role.description ?? ""} ${role.base_role} ${(role.permissions ?? []).join(" ")}`
        .toLowerCase()
        .includes(keyword),
    );
  }, [query, roles]);

  function openCreate() {
    setForm(emptyForm);
    setMessage("");
    setOpen(true);
  }

  function openEdit(role: CustomRole) {
    if (role.name === "Admin" || role.name === "Admin mặc định" || role.base_role === "ADMIN") {
      setMessage("Admin là vai trò full quyền cố định, không chỉnh sửa.");
      return;
    }

    setForm({
      commissionPercentage: Number(role.commission_percentage),
      description: role.description ?? "",
      id: role.system ? "" : role.id,
      isActive: role.is_active,
      name: role.name,
      permissions: role.permissions ?? [],
      productRules: (role.role_commission_rules ?? []).map((rule) => ({
        isActive: rule.is_active,
        percentage: Number(rule.percentage),
        templateId: rule.template_id,
      })),
    });
    setMessage("");
    setOpen(true);
  }

  function togglePermission(permission: string) {
    setForm((current) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((item) => item !== permission)
        : [...current.permissions, permission],
    }));
  }

  function getProductPercentage(templateId: string) {
    return form.productRules.find((rule) => rule.templateId === templateId)?.percentage ?? 0;
  }

  function setProductPercentage(templateId: string, percentage: number) {
    setForm((current) => {
      const exists = current.productRules.some((rule) => rule.templateId === templateId);
      return {
        ...current,
        productRules: exists
          ? current.productRules.map((rule) => rule.templateId === templateId ? { ...rule, isActive: true, percentage } : rule)
          : [...current.productRules, { isActive: true, percentage, templateId }],
      };
    });
  }

  async function saveRole() {
    setSaving(true);
    setMessage("");

    const response = await fetch("/api/admin/roles", {
      method: form.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        baseRole: inferBaseRole(form.permissions),
      }),
    });
    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(data.error ?? "Không lưu được vai trò.");
      return;
    }

    setRoles((current) => {
      const exists = current.some((role) => role.id === data.role.id);
      return exists
        ? current.map((role) => (role.id === data.role.id ? data.role : role))
        : [data.role, ...current];
    });
    setOpen(false);
    setForm(emptyForm);
  }

  async function deleteRole() {
    if (!form.id) return;
    if (!confirm("Xóa vai trò này? Nhân sự đang dùng vai trò này sẽ bị bỏ gán vai trò tuỳ chỉnh.")) return;

    setSaving(true);
    setMessage("");
    const response = await fetch(`/api/admin/roles?id=${form.id}`, { method: "DELETE" });
    const data = await response.json().catch(() => ({}));
    setSaving(false);

    if (!response.ok) {
      setMessage(data.error ?? "Không xóa được vai trò.");
      return;
    }

    setRoles((current) => current.filter((role) => role.id !== form.id));
    setOpen(false);
    setForm(emptyForm);
  }

  return (
    <div className="grid gap-6">
      <header className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold sm:text-4xl">Vai trò</h1>
          <button
            className="rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-400 px-5 py-3 text-sm font-semibold text-white"
            onClick={openCreate}
            type="button"
          >
            Thêm vai trò
          </button>
        </div>
      </header>

      <GlassCard hover={false} className="p-0">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-2xl font-semibold">Danh sách vai trò</h2>
        </div>
        <div className="border-b border-white/10 px-5 pb-4">
          <input
            className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm outline-none transition focus:border-pink-300/50"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm vai trò, quyền hoặc mô tả..."
            value={query}
          />
        </div>
        <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleRoles.length ? visibleRoles.map((role) => {
              const isLockedAdmin = role.name === "Admin" || role.name === "Admin mặc định" || role.base_role === "ADMIN";
              return (
            <button
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-left transition hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-80"
              disabled={isLockedAdmin}
              key={role.id}
              onClick={() => openEdit(role)}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">{role.name}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-white/58">{role.description || "Không có mô tả"}</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                  {isLockedAdmin ? "Full quyền" : `${Number(role.commission_percentage).toLocaleString("vi-VN")}%`}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(role.permissions ?? []).slice(0, 5).map((permission) => (
                  <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs" key={permission}>
                    {permissionOptions.find((item) => item.key === permission)?.label ?? permission}
                  </span>
                ))}
              </div>
            </button>
              );
            }) : (
            <p className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-white/58">
              Chưa có vai trò.
            </p>
          )}
        </div>
      </GlassCard>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm p-4" onMouseDown={() => setOpen(false)}>
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-pink-200 bg-pink-50 text-pink-950 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-pink-200 bg-pink-50 p-5">
              <h2 className="text-2xl font-semibold text-pink-900">{form.id ? "Sửa vai trò" : "Thêm vai trò"}</h2>
              <button className="rounded-full bg-pink-100 px-4 py-2 text-sm font-medium text-pink-700 hover:bg-pink-200 transition" onClick={() => setOpen(false)} type="button">Đóng</button>
            </div>

            <div className="grid gap-4 p-5">
              <label className="grid gap-2 text-sm">
                <span className="font-medium text-pink-800">Tên vai trò</span>
                <input
                  className="rounded-xl border border-pink-200 bg-white px-4 py-3 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 text-pink-950"
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  value={form.name}
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="font-medium text-pink-800">Mô tả</span>
                <textarea
                  className="min-h-24 rounded-xl border border-pink-200 bg-white px-4 py-3 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 text-pink-950"
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  value={form.description}
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="font-medium text-pink-800">% hoa hồng mặc định</span>
                <input
                  className="rounded-xl border border-pink-200 bg-white px-4 py-3 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 text-pink-950"
                  max={100}
                  min={0}
                  onChange={(event) => setForm((current) => ({ ...current, commissionPercentage: Number(event.target.value) }))}
                  step="0.1"
                  type="number"
                  value={form.commissionPercentage}
                />
              </label>

              <div className="grid gap-2">
                <p className="text-sm font-medium text-pink-800">Quyền</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {permissionOptions.map((permission) => (
                    <label className="flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-3 py-2 text-sm" key={permission.key}>
                      <input
                        checked={form.permissions.includes(permission.key)}
                        onChange={() => togglePermission(permission.key)}
                        type="checkbox"
                      />
                      {permission.label}
                    </label>
                  ))}
                </div>
              </div>

              {templates.length ? (
                <div className="grid gap-2">
                  <p className="text-sm font-medium text-pink-800">Hoa hồng riêng theo sản phẩm</p>
                  <div className="grid gap-2">
                    {templates.map((template) => (
                      <label
                        className="grid gap-2 rounded-xl border border-pink-200 bg-white px-3 py-2 text-sm sm:grid-cols-[1fr_120px]"
                        key={template.id}
                      >
                        <span className="text-pink-950 font-medium">{template.name}</span>
                        <input
                          className="rounded-lg border border-pink-200 bg-white px-3 py-2 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 text-pink-950"
                          max={100}
                          min={0}
                          onChange={(event) => setProductPercentage(template.id, Number(event.target.value))}
                          step="0.1"
                          type="number"
                          value={getProductPercentage(template.id)}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}

              <label className="flex items-center gap-2 text-sm font-medium text-pink-800">
                <input
                  checked={form.isActive}
                  onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
                  type="checkbox"
                />
                Đang hoạt động
              </label>

              {message ? <p className="rounded-xl border border-pink-200 bg-pink-100 p-3 text-sm text-pink-900">{message}</p> : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-400 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                  disabled={saving}
                  onClick={saveRole}
                  type="button"
                >
                  {saving ? "Đang lưu..." : "Lưu vai trò"}
                </button>
                {form.id ? (
                  <button
                    className="rounded-full border border-red-300/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-100 disabled:opacity-50"
                    disabled={saving}
                    onClick={deleteRole}
                    type="button"
                  >
                    Xóa vai trò
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
