import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { TemplateManager } from "@/components/dashboard/TemplateManager";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function TemplatesPage() {
  const session = await getSession();
  if (session?.role !== "ADMIN") redirect("/dashboard");

  const supabase = createServerSupabaseClient();
  const { data: templates } = await supabase
    .from("templates")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="grid gap-6">
      <header className="rounded-2xl border border-pink-200 bg-pink-50/50 p-5 sm:p-6">
        <h1 className="text-3xl font-semibold sm:text-4xl text-pink-900">Quản lý Template</h1>
        <p className="mt-2 text-pink-700">Chỉnh sửa thông tin, giá bán và cấu hình của các mẫu web.</p>
      </header>

      <section>
        <TemplateManager initialTemplates={templates ?? []} />
      </section>
    </div>
  );
}
