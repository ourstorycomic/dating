import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { getRoleLabel, getSession, type UserRole } from "@/lib/auth/session";

const navItems = [
  { href: "/dashboard", label: "Tổng quan", roles: ["ADMIN", "STAFF", "EMPLOYEE"] },
  { href: "/dashboard/orders/new", label: "Tạo đơn", roles: ["ADMIN", "STAFF", "EMPLOYEE"] },
  { href: "/dashboard/users", label: "Nhân sự", roles: ["ADMIN", "STAFF"] },
  { href: "/dashboard/roles", label: "Vai trò", roles: ["ADMIN"] },
  { href: "/dashboard/logs", label: "Nhật ký đơn", roles: ["ADMIN", "STAFF"] },
  { href: "/dashboard/analytics", label: "Thống kê", roles: ["ADMIN", "STAFF"] },
  { href: "/dashboard/settings", label: "Cài đặt", roles: ["ADMIN", "STAFF", "EMPLOYEE"] },
] satisfies Array<{ href: string; label: string; roles: UserRole[] }>;

export async function DashboardShell({ children }: { children: ReactNode }) {
  const session = await getSession();
  const role = session?.role ?? "EMPLOYEE";
  const visibleNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <div className="min-h-screen px-3 py-4 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1480px] gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="glass-panel-soft top-4 h-fit rounded-2xl p-4 lg:sticky">
          <Link className="block px-3 py-2 text-xl font-bold" href="/">
            Yeuweb<span className="text-neon-pink"> - Thay lời muốn nói</span>
          </Link>
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.06] p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-pink-300 to-fuchsia-400 text-sm font-bold text-white">
                {session?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt={session.name} className="h-full w-full object-cover" src={session.avatarUrl} />
                ) : (
                  session?.name?.slice(0, 1).toUpperCase() ?? "U"
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{session?.name}</p>
                <p className="truncate text-xs text-white/44">{session?.email}</p>
              </div>
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/42">Vai trò</p>
            <p className="mt-1 text-sm font-semibold">{getRoleLabel(role)}</p>
          </div>
          <nav className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-1">
            {visibleNav.map((item) => (
              <Link
                className="rounded-xl px-3 py-3 text-sm font-medium text-white/68 transition hover:bg-white/[0.08] hover:text-white"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action="/api/auth/logout" className="mt-4">
            <button className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white">
              Đăng xuất
            </button>
          </form>
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
