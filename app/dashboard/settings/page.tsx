import { GlassCard } from "@/components/ui/GlassCard";
import { getRoleLabel, getSession } from "@/lib/auth/session";

export default async function SettingsPage() {
  const session = await getSession();

  return (
    <div className="grid gap-6">
      <header className="glass-panel rounded-2xl p-5 sm:p-6">
        <h1 className="text-3xl font-semibold sm:text-4xl">Cài đặt tài khoản</h1>
      </header>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <GlassCard hover={false}>
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-pink-300 to-fuchsia-400 text-2xl font-bold text-white">
              {session?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={session.name} className="h-full w-full object-cover" src={session.avatarUrl} />
              ) : (
                session?.name?.slice(0, 1).toUpperCase() ?? "U"
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{session?.name}</h2>
              <p className="mt-1 text-sm text-white/58">{session?.email}</p>
              <p className="mt-2 w-fit rounded-full bg-white/10 px-3 py-1 text-xs">
                {session ? getRoleLabel(session.role) : "Chưa đăng nhập"}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <h2 className="text-2xl font-semibold">Thông tin hồ sơ</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="text-white/64">Tên hiển thị</span>
              <input className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none" defaultValue={session?.name} />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-white/64">Email</span>
              <input className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none" defaultValue={session?.email} disabled />
            </label>
            <label className="grid gap-2 text-sm md:col-span-2">
              <span className="text-white/64">Avatar URL</span>
              <input className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none" defaultValue={session?.avatarUrl ?? ""} placeholder="https://..." />
            </label>
          </div>
          <button className="mt-5 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#12091f]">
            Lưu thay đổi
          </button>
        </GlassCard>
      </section>
    </div>
  );
}
