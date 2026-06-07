import { redirect } from "next/navigation";
import { UserManager } from "@/components/dashboard/UserManager";
import { getSession } from "@/lib/auth/session";
import { getCustomRoles, getUsers } from "@/lib/supabase/server";

export default async function UsersPage() {
  const session = await getSession();

  if (!session || !["ADMIN", "STAFF"].includes(session.role)) {
    redirect("/dashboard/orders/new");
  }

  const [users, roles] = await Promise.all([getUsers(), getCustomRoles()]);

  return (
    <UserManager
      currentRole={session.role as "ADMIN" | "STAFF"}
      initialRoles={roles as never}
      initialUsers={users as never}
    />
  );
}
