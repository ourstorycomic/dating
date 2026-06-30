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
    <div className="grid min-h-screen place-items-center px-4 py-8 text-white bg-[#05020a]">
      <GlassCard glow hover={false} className="w-full max-w-md p-5 sm:p-6">
        <h1 className="text-3xl font-bold">Đăng nhập</h1>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-300/20 bg-rose-400/10 p-3 text-sm text-rose-100">
            {errorMessages[error] ?? "Không thể đăng nhập."}
          </div>
        ) : null}

        <form action="/api/auth/login" className="mt-5 grid gap-4" method="post">
          <input name="next" type="hidden" value={next} />
          <label className="grid gap-2 text-sm">
            <span className="text-white/64">Email</span>
            <input
              className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none transition focus:border-pink-300/50"
              name="email"
              placeholder="admin@lovora.vn"
              type="email"
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-white/64">Mật khẩu</span>
            <input
              className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none transition focus:border-pink-300/50"
              name="password"
              placeholder="••••••••"
              type="password"
            />
          </label>
          <button className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 text-sm font-semibold shadow-[0_0_30px_rgba(255,79,216,0.28)]">
            Đăng nhập
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
