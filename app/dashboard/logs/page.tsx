import { getOrderLogs } from "@/lib/supabase/server";
import { LogManager } from "@/components/dashboard/LogManager";
import { getSession } from "@/lib/auth/session";

export default async function LogsPage() {
  const [logs, session] = await Promise.all([getOrderLogs(), getSession()]);

  return <LogManager initialLogs={logs as never} isAdmin={session?.role === "ADMIN"} />;
}
