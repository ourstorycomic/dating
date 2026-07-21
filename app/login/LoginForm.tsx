"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({ next }: { next: string }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action="/api/auth/login" className="mt-5 grid gap-4" method="post">
      <input name="next" type="hidden" value={next} />
      <label className="grid gap-2 text-sm font-semibold">
        <span className="text-[#7b536b]">Email</span>
        <input
          className="rounded-xl border-[2px] border-pink-100 bg-white px-4 py-3 outline-none transition-all focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
          name="email"
          placeholder="admin@lovora.vn"
          type="email"
        />
      </label>
      <div className="grid gap-2 text-sm font-semibold mt-2">
        <span className="text-[#7b536b]">Mật khẩu</span>
        <div className="relative">
          <input
            className="w-full rounded-xl border-[2px] border-pink-100 bg-white px-4 py-3 pr-12 outline-none transition-all focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
            name="password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600 transition-colors p-1"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <button className="mt-4 rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 px-6 py-3.5 text-base font-black text-white shadow-lg shadow-pink-500/30 transition-all hover:scale-[1.02] hover:shadow-pink-500/40 active:scale-95">
        Đăng nhập vào hệ thống
      </button>
    </form>
  );
}
