"use client";

import { useState, useRef } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eye, EyeOff, Camera, Loader2 } from "lucide-react";

export function getRoleLabel(role: string) {
  if (role === "ADMIN") return "Admin";
  if (role === "STAFF") return "Staff";
  return "Nhân viên";
}

export function SettingsForm({ session }: { session: any }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(session?.avatarUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxSize = 300;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        } else if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/webp", 0.8);
          setAvatarPreview(compressedDataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (password) {
      if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
      }
      if (password.length < 6) {
        alert("Mật khẩu phải dài ít nhất 6 ký tự!");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch("/api/auth/update-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password })
        });
        
        const data = await response.json();
        setLoading(false);
        
        if (!response.ok) {
          alert("Lỗi khi đổi mật khẩu: " + (data.error || "Unknown error"));
        } else {
          alert("Đổi mật khẩu thành công!");
          setPassword("");
          setConfirmPassword("");
        }
      } catch (error: any) {
        setLoading(false);
        alert("Lỗi khi kết nối: " + error.message);
      }
    } else {
      alert("Đã lưu các thay đổi hồ sơ! (Cập nhật thông tin khác đang phát triển)");
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <GlassCard hover={false}>
        <div className="flex flex-col gap-10">
          
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-pink-200/50">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-pink-300 to-fuchsia-400 text-3xl font-bold text-white shadow-md transition-transform group-hover:scale-105">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt={session?.name} className="h-full w-full object-cover" src={avatarPreview} />
                ) : (
                  session?.name?.slice(0, 1).toUpperCase() ?? "U"
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={28} />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-semibold text-pink-900">{session?.name}</h2>
              <p className="mt-1 text-pink-600">{session?.email}</p>
              <p className="mt-2 inline-block rounded-full bg-pink-100 px-4 py-1.5 text-xs font-semibold text-pink-800">
                {session ? getRoleLabel(session.role) : "Chưa đăng nhập"}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-8">
            <div>
              <h3 className="mb-4 text-xl font-semibold text-pink-900">Thông tin hồ sơ</h3>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-pink-800">Tên hiển thị</span>
                  <input className="rounded-xl border border-pink-200 bg-white px-4 py-3 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 text-pink-950 transition-shadow" defaultValue={session?.name} />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-pink-800">Email</span>
                  <input className="rounded-xl border border-pink-200 bg-white px-4 py-3 outline-none opacity-60 text-pink-950 cursor-not-allowed" defaultValue={session?.email} disabled />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-pink-800">Số điện thoại</span>
                  <input className="rounded-xl border border-pink-200 bg-white px-4 py-3 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 text-pink-950 transition-shadow" placeholder="09xxxxxxxx" />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-pink-800">Ngày sinh</span>
                  <input className="rounded-xl border border-pink-200 bg-white px-4 py-3 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 text-pink-950 transition-shadow [color-scheme:light]" type="date" />
                </label>
                <label className="grid gap-2 text-sm md:col-span-2">
                  <span className="font-medium text-pink-800">Địa chỉ</span>
                  <input className="rounded-xl border border-pink-200 bg-white px-4 py-3 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 text-pink-950 transition-shadow" placeholder="Nhập địa chỉ của bạn" />
                </label>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-semibold text-pink-900">Bảo mật</h3>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm relative">
                  <span className="font-medium text-pink-800">Mật khẩu mới</span>
                  <div className="relative">
                    <input 
                      className="w-full rounded-xl border border-pink-200 bg-white pl-4 pr-11 py-3 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 text-pink-950 transition-shadow" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Bỏ trống nếu không đổi"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>
                <label className="grid gap-2 text-sm relative">
                  <span className="font-medium text-pink-800">Xác nhận mật khẩu</span>
                  <div className="relative">
                    <input 
                      className="w-full rounded-xl border border-pink-200 bg-white pl-4 pr-11 py-3 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 text-pink-950 transition-shadow" 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Nhập lại mật khẩu mới"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>
              </div>
            </div>
            
          </div>
          
          <div className="flex justify-end pt-4 border-t border-pink-200/50">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-400 px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
