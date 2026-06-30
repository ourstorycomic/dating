"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

type BaseRole = "ADMIN" | "STAFF" | "EMPLOYEE";

type CustomRole = {
  base_role: BaseRole;
  commission_percentage: number;
  id: string;
  is_active: boolean;
  name: string;
};

type UserRow = {
  created_at: string;
  custom_role_id: string | null;
  custom_roles?: CustomRole | CustomRole[] | null;
  email: string;
  id: string;
  is_active: boolean;
  manager_id: string | null;
  name: string;
  role: BaseRole;
};

const emptyForm = {
  customRoleId: "",
  email: "",
  managerId: "",
  name: "",
  password: "",
  role: "EMPLOYEE" as BaseRole,
};

function getCustomRole(user: UserRow) {
  if (!user.custom_roles) return null;
  return Array.isArray(user.custom_roles) ? user.custom_roles[0] ?? null : user.custom_roles;
}

export function UserManager({
  currentRole,
  initialRoles,
  initialUsers,
}: {
  currentRole: "ADMIN" | "STAFF";
  initialRoles: CustomRole[];
  initialUsers: UserRow[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [passwordModal, setPasswordModal] = useState<{ open: boolean; userId: string; newPassword: string }>({ open: false, userId: "", newPassword: "" });
  const router = useRouter();

  const activeRoles = useMemo(() => initialRoles.filter((role) => role.is_active), [initialRoles]);
  const staffOptions = useMemo(() => users.filter((user) => user.role === "STAFF" && user.is_active), [users]);
  const visibleUsers = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return users;
    return users.filter((user) => {
      const customRole = getCustomRole(user);
      return `${user.name} ${user.email} ${user.role} ${customRole?.name ?? ""}`.toLowerCase().includes(keyword);
    });
  }, [query, users]);

  function inferRoleFromCustomRole(customRoleId: string, fallback: BaseRole) {
    return activeRoles.find((role) => role.id === customRoleId)?.base_role ?? fallback;
  }

  async function createUser() {
    setSaving(true);
    setError("");

    const customRole = activeRoles.find((role) => role.id === form.customRoleId);
    const role = customRole?.base_role ?? form.role;

    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role }),
    });
    const data = await response.json();

    if (response.ok && form.customRoleId) {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customRoleId: form.customRoleId,
          managerId: form.managerId,
          role,
          userId: data.user.id,
        }),
      });
      data.user.custom_role_id = form.customRoleId;
      data.user.custom_roles = customRole ?? null;
    }

    setSaving(false);

    if (!response.ok) {
      setError(data.error ?? "Không thêm được nhân sự.");
      return;
    }

    setUsers((current) => [data.user, ...current]);
    setOpen(false);
    setForm(emptyForm);
    router.refresh();
  }

  async function updateUser(user: UserRow, patch: Partial<{ customRoleId: string; isActive: boolean; managerId: string; role: BaseRole }>) {
    const customRoleId = patch.customRoleId ?? user.custom_role_id ?? "";
    const role = patch.role ?? inferRoleFromCustomRole(customRoleId, user.role);
    const managerId = patch.managerId ?? user.manager_id ?? "";
    const isActive = patch.isActive ?? user.is_active;

    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customRoleId: customRoleId || null,
        isActive,
        managerId: role === "EMPLOYEE" ? managerId : null,
        role,
        userId: user.id,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Không cập nhật được nhân sự.");
      return;
    }

    setError("");
    setUsers((current) => current.map((item) => (item.id === user.id ? data.user : item)));
    router.refresh();
  }

  async function deleteUser(user: UserRow) {
    if (!confirm(`Xóa nhân sự ${user.name}? Hành động này không thể hoàn tác.`)) return;
    
    setSaving(true);
    setError("");
    
    const response = await fetch(`/api/admin/users?id=${user.id}`, { method: "DELETE" });
    const data = await response.json().catch(() => ({}));
    
    setSaving(false);
    
    if (!response.ok) {
      alert(data.error ?? "Không xóa được nhân sự.");
      return;
    }
    
    setUsers((current) => current.filter((item) => item.id !== user.id));
    router.refresh();
  }

  async function changePassword() {
    if (passwordModal.newPassword.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    
    setSaving(true);
    
    const response = await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: passwordModal.userId, password: passwordModal.newPassword }),
    });
    const data = await response.json();
    
    setSaving(false);
    
    if (!response.ok) {
      alert(data.error ?? "Không đổi được mật khẩu.");
      return;
    }
    
    alert("Đổi mật khẩu thành công!");
    setPasswordModal({ open: false, userId: "", newPassword: "" });
  }

  return (
    <div className="grid gap-6">
      <header className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <h1 className="text-3xl font-semibold sm:text-4xl">Nhân sự</h1>
          {currentRole === "ADMIN" ? (
            <button
              className="rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-400 px-5 py-3 text-sm font-semibold text-white"
              onClick={() => setOpen(true)}
              type="button"
            >
              Thêm nhân sự
            </button>
          ) : null}
        </div>
      </header>

      <GlassCard hover={false} className="p-0">
        <div className="border-b border-white/10 p-4">
          <input
            className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm outline-none transition focus:border-pink-300/50"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm nhân sự theo tên, email hoặc vai trò..."
            value={query}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="text-white/52">
              <tr className="border-b border-white/10">
                <th className="px-5 py-4 font-medium">Tên</th>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Role gốc</th>
                <th className="px-5 py-4 font-medium">Vai trò tuỳ chỉnh</th>
                <th className="px-5 py-4 font-medium">Quản lý</th>
                <th className="px-5 py-4 font-medium">Trạng thái</th>
                <th className="px-5 py-4 font-medium">Ngày tạo</th>
                {currentRole === "ADMIN" && <th className="px-5 py-4 font-medium text-right">Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => {
                const manager = users.find((item) => item.id === user.manager_id);
                const customRole = getCustomRole(user);
                return (
                  <tr className="border-b border-white/8 last:border-0" key={user.id}>
                    <td className="px-5 py-4 font-semibold">
                      <Link href={`/dashboard/users/${user.id}`} className="hover:text-pink-400 hover:underline">
                        {user.name}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-white/70">{user.email}</td>
                    <td className="px-5 py-4">
                      {currentRole === "ADMIN" ? (
                        <select
                          className="rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2 outline-none"
                          onChange={(event) => updateUser(user, { customRoleId: "", role: event.target.value as BaseRole })}
                          value={user.role}
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="STAFF">Staff</option>
                          <option value="EMPLOYEE">Nhân viên</option>
                        </select>
                      ) : user.role}
                    </td>
                    <td className="px-5 py-4">
                      {currentRole === "ADMIN" ? (
                        <select
                          className="min-w-44 rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2 outline-none"
                          onChange={(event) => updateUser(user, { customRoleId: event.target.value })}
                          value={user.custom_role_id ?? ""}
                        >
                          <option value="">Không gán</option>
                          {activeRoles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name} ({role.commission_percentage}%)
                            </option>
                          ))}
                        </select>
                      ) : customRole?.name ?? "-"}
                    </td>
                    <td className="px-5 py-4">
                      {currentRole === "ADMIN" && user.role === "EMPLOYEE" ? (
                        <select
                          className="min-w-44 rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2 outline-none"
                          onChange={(event) => updateUser(user, { managerId: event.target.value })}
                          value={user.manager_id ?? ""}
                        >
                          <option value="">Chưa gán</option>
                          {staffOptions.map((staff) => (
                            <option key={staff.id} value={staff.id}>{staff.name}</option>
                          ))}
                        </select>
                      ) : manager?.name ?? "-"}
                    </td>
                    <td className="px-5 py-4">
                      {currentRole === "ADMIN" ? (
                        <label className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
                          <input
                            checked={user.is_active}
                            onChange={(event) => updateUser(user, { isActive: event.target.checked })}
                            type="checkbox"
                          />
                          {user.is_active ? "Hoạt động" : "Đã khóa"}
                        </label>
                      ) : (
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                          {user.is_active ? "Hoạt động" : "Đã khóa"}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-white/58">{new Date(user.created_at).toLocaleString("vi-VN")}</td>
                    {currentRole === "ADMIN" && (
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setPasswordModal({ open: true, userId: user.id, newPassword: "" })}
                            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20 transition"
                          >
                            Đổi MK
                          </button>
                          <button
                            onClick={() => deleteUser(user)}
                            className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-200 hover:bg-red-500/40 transition"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm p-4" onMouseDown={() => setOpen(false)}>
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-pink-200 bg-pink-50 text-pink-950 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-pink-200 bg-pink-50 p-5">
              <h2 className="text-2xl font-semibold text-pink-900">Thêm nhân sự</h2>
              <button className="rounded-full bg-pink-100 px-4 py-2 text-sm font-medium text-pink-700 hover:bg-pink-200 transition" onClick={() => setOpen(false)} type="button">Đóng</button>
            </div>
            <div className="grid gap-4 p-5">
              <Input label="Tên" onChange={(name) => setForm((current) => ({ ...current, name }))} value={form.name} />
              <Input label="Email đăng nhập" onChange={(email) => setForm((current) => ({ ...current, email }))} value={form.email} />
              <Input label="Mật khẩu" onChange={(password) => setForm((current) => ({ ...current, password }))} type="password" value={form.password} />
              <label className="grid gap-2 text-sm">
                <span className="font-medium text-pink-800">Vai trò tuỳ chỉnh</span>
                <select
                  className="rounded-xl border border-pink-200 bg-white px-4 py-3 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50"
                  onChange={(event) => {
                    const customRole = activeRoles.find((role) => role.id === event.target.value);
                    setForm((current) => ({
                      ...current,
                      customRoleId: event.target.value,
                      role: customRole?.base_role ?? current.role,
                    }));
                  }}
                  value={form.customRoleId}
                >
                  <option value="">Không gán</option>
                  {activeRoles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name} - {role.base_role} - {role.commission_percentage}%</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm">
                <span className="font-medium text-pink-800">Role gốc</span>
                <select
                  className="rounded-xl border border-pink-200 bg-white px-4 py-3 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50"
                  onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as BaseRole, managerId: "" }))}
                  value={form.role}
                >
                  <option value="EMPLOYEE">Nhân viên</option>
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </label>
              {form.role === "EMPLOYEE" ? (
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-pink-800">Staff quản lý</span>
                  <select
                    className="rounded-xl border border-pink-200 bg-white px-4 py-3 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50"
                    onChange={(event) => setForm((current) => ({ ...current, managerId: event.target.value }))}
                    value={form.managerId}
                  >
                    <option value="">Chưa gán</option>
                    {staffOptions.map((staff) => (
                      <option key={staff.id} value={staff.id}>{staff.name} - {staff.email}</option>
                    ))}
                  </select>
                </label>
              ) : null}
              {error ? <p className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
              <button
                className="rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-400 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                disabled={saving}
                onClick={createUser}
                type="button"
              >
                {saving ? "Đang tạo..." : "Tạo tài khoản"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {passwordModal.open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm p-4" onMouseDown={() => setPasswordModal({ open: false, userId: "", newPassword: "" })}>
          <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-pink-200 bg-pink-50 text-pink-950 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-pink-200 p-5">
              <h2 className="text-xl font-semibold text-pink-900">Đổi mật khẩu</h2>
              <button className="text-pink-400 hover:text-pink-700 transition" onClick={() => setPasswordModal({ open: false, userId: "", newPassword: "" })}>Đóng</button>
            </div>
            <div className="grid gap-4 p-5">
              <Input 
                label="Mật khẩu mới" 
                type="password" 
                onChange={(v) => setPasswordModal(curr => ({ ...curr, newPassword: v }))} 
                value={passwordModal.newPassword} 
              />
              <button
                className="mt-2 rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-400 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                disabled={saving}
                onClick={changePassword}
                type="button"
              >
                {saving ? "Đang xử lý..." : "Xác nhận đổi"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Input({
  label,
  onChange,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  type?: string;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-pink-800">{label}</span>
      <input
        className="rounded-xl border border-pink-200 bg-white px-4 py-3 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 text-pink-950 placeholder-pink-300"
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
    </label>
  );
}
