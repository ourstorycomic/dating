import { getSession } from "@/lib/auth/session";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const session = await getSession();

  return (
    <div className="grid gap-6">
      <header className="glass-panel rounded-2xl p-5 sm:p-6 bg-pink-50/50">
        <h1 className="text-3xl font-semibold sm:text-4xl text-pink-900">Cài đặt tài khoản</h1>
      </header>

      <section>
        <SettingsForm session={session} />
      </section>
    </div>
  );
}
