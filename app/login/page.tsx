import { GlassCard } from "@/components/ui/GlassCard";

const errorMessages: Record<string, string> = {
  missing: "Nhập email và mật khẩu.",
  invalid: "Email hoặc mật khẩu không đúng.",
  profile: "Tài khoản chưa được cấp quyền trong hệ thống.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next = "/dashboard", error } = await searchParams;

  return (
    <div className="grid min-h-screen place-items-center px-4 py-8 text-[#321a32] bg-pink-50" style={{ backgroundImage: "url('/assets/bg/bg5.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <GlassCard hover={false} className="w-full max-w-md p-6 sm:p-8 backdrop-blur-xl bg-white/80 border-white/40 shadow-2xl">
        <h1 className="text-3xl font-black text-center text-pink-500 mb-2">Đăng nhập</h1>
        <p className="text-center text-[#7b536b] mb-6 text-sm font-medium">Truy cập vào hệ thống quản lý Lovora</p>

        {error ? (
          <div className="mb-6 rounded-xl border-2 border-rose-300 bg-rose-100 p-3 text-sm text-rose-700 font-bold text-center shadow-sm">
            {errorMessages[error] ?? "Không thể đăng nhập."}
          </div>
        ) : null}

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
          <label className="grid gap-2 text-sm font-semibold mt-2">
            <span className="text-[#7b536b]">Mật khẩu</span>
            <input
              className="rounded-xl border-[2px] border-pink-100 bg-white px-4 py-3 outline-none transition-all focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
              name="password"
              placeholder="••••••••"
              type="password"
            />
          </label>
          <button className="mt-4 rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 px-6 py-3.5 text-base font-black text-white shadow-lg shadow-pink-500/30 transition-all hover:scale-[1.02] hover:shadow-pink-500/40 active:scale-95">
            Đăng nhập vào hệ thống
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
