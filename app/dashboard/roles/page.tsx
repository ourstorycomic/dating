import { redirect } from "next/navigation";
import { RoleManager } from "@/components/dashboard/RoleManager";
import { getSession } from "@/lib/auth/session";
import { getCustomRoles, getPublishedTemplates } from "@/lib/supabase/server";

export default async function RolesPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [roles, templates] = await Promise.all([getCustomRoles(), getPublishedTemplates()]);

  return <RoleManager initialRoles={roles as never} templates={templates.map((template) => ({ id: template.id, name: template.name }))} />;
}
