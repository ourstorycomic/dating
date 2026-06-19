"use client";

import { useEffect } from "react";

export function DashboardThemeReset() {
  useEffect(() => {
    document.documentElement.removeAttribute("data-theme");
    window.localStorage.removeItem("yeuweb_theme");
  }, []);

  return null;
}
