"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarNav({ items }: { items: Array<{ href: string; label: string }> }) {
  const pathname = usePathname();

  return (
    <nav className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-1">
      {items.map((item) => {
        // A link is active if the pathname exactly matches or starts with the link's href (for subpages).
        // Except for "/" or "/dashboard", which should only be active if exact match.
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-xl px-3 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-pink-500/10 text-pink-400 border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                : "text-white/68 hover:bg-white/[0.08] hover:text-white border border-transparent"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
