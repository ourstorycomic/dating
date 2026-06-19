"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarNav({ items }: { items: Array<{ href: string; label: string }> }) {
  const pathname = usePathname();

  return (
    <nav className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-1">
      {items.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
              isActive
                ? "border-[#ff9fbe] bg-[#ffe0ef] text-[#b83276] shadow-[0_10px_24px_rgba(255,126,184,0.16)]"
                : "border-transparent text-[#76556d] hover:border-[#f4bdd8] hover:bg-white/72 hover:text-[#c04b86]"
            }`}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
