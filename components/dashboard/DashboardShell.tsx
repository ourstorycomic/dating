import Link from "next/link";
import type { ReactNode } from "react";
import { getRoleLabel, getSession, type UserRole } from "@/lib/auth/session";
import { DashboardThemeReset } from "@/components/dashboard/DashboardThemeReset";
import { SidebarNav } from "@/components/dashboard/SidebarNav";

const navItems = [
  { href: "/dashboard", label: "Tổng quan", roles: ["ADMIN", "STAFF", "EMPLOYEE"] },
  { href: "/dashboard/orders/new", label: "Tạo đơn", roles: ["ADMIN", "STAFF", "EMPLOYEE"] },
  { href: "/dashboard/users", label: "Nhân sự", roles: ["ADMIN", "STAFF"] },
  { href: "/dashboard/roles", label: "Vai trò", roles: ["ADMIN"] },
  { href: "/dashboard/logs", label: "Nhật ký đơn", roles: ["ADMIN", "STAFF"] },
  { href: "/dashboard/analytics", label: "Thống kê", roles: ["ADMIN", "STAFF"] },
  { href: "/dashboard/templates", label: "Kho Template", roles: ["ADMIN"] },
  { href: "/dashboard/settings", label: "Cài đặt", roles: ["ADMIN", "STAFF", "EMPLOYEE"] },
] satisfies Array<{ href: string; label: string; roles: UserRole[] }>;

export async function DashboardShell({ children }: { children: ReactNode }) {
  const session = await getSession();
  const role = session?.role ?? "EMPLOYEE";
  const visibleNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <div className="dashboard-pastel min-h-screen px-3 py-4 text-[#332035] sm:px-6 lg:px-8">
      <DashboardThemeReset />
      <div className="mx-auto grid max-w-[1480px] gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="top-4 h-fit rounded-[28px] border border-white/70 bg-white/72 p-4 shadow-[0_18px_50px_rgba(215,112,158,0.16)] backdrop-blur-xl lg:sticky">
          <Link className="flex items-center gap-2 px-3 py-2 text-xl font-extrabold text-[#321a32]" href="/">
            <img src="/favicon.ico" alt="Lovora Logo" className="h-8 w-8 rounded-full" />
            <span>Lovora<span className="text-[#c04b86]"> - Thay lời muốn nói</span></span>
          </Link>

          <div className="mt-4 rounded-[22px] border border-[#f4bdd8] bg-white/66 p-3 shadow-[0_12px_28px_rgba(216,92,145,0.1)]">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#ff7eb8] to-[#b78cff] text-sm font-bold text-white shadow-[0_10px_24px_rgba(255,126,184,0.28)]">
                {session?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt={session.name} className="h-full w-full object-cover" src={session.avatarUrl} />
                ) : (
                  session?.name?.slice(0, 1).toUpperCase() ?? "U"
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#321a32]">{session?.name}</p>
                <p className="truncate text-xs font-medium text-[#76556d]">{session?.email}</p>
              </div>
            </div>
            <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#c04b86]">Vai trò</p>
            <p className="mt-1 text-sm font-bold text-[#321a32]">{getRoleLabel(role)}</p>
          </div>

          <SidebarNav items={visibleNav} />

          <form action="/api/auth/logout" className="mt-4">
            <button className="w-full rounded-xl border border-[#f4bdd8] bg-white/66 px-3 py-3 text-sm font-bold text-[#b83276] transition hover:bg-white">
              Đăng xuất
            </button>
          </form>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
