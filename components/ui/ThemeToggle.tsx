"use client";

import { useEffect, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.localStorage.getItem("yeuweb_theme") === "dark" ? "dark" : "light";
}

function subscribeToThemeChange(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("yeuweb-theme-change", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("yeuweb-theme-change", onStoreChange);
  };
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const theme = useSyncExternalStore(subscribeToThemeChange, getStoredTheme, () => "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem("yeuweb_theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.dispatchEvent(new Event("yeuweb-theme-change"));
  }

  const label = theme === "dark" ? "Đổi sang giao diện sáng" : "Đổi sang giao diện tối";

  return (
    <button
      aria-label={label}
      className={
        compact
          ? "grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-xs font-bold text-white/58 backdrop-blur-xl transition hover:bg-white/[0.12] hover:text-white"
          : "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white"
      }
      onClick={toggleTheme}
      title={label}
      type="button"
    >
      {compact ? (theme === "dark" ? "D" : "S") : `Giao diện: ${theme === "dark" ? "Tối" : "Sáng"}`}
    </button>
  );
}
