import { getOrderLogs } from "@/lib/supabase/server";
import { LogManager } from "@/components/dashboard/LogManager";
import { getSession } from "@/lib/auth/session";

export default async function LogsPage({ searchParams }: { searchParams: Promise<{ page?: string, query?: string, status?: string, date?: string }> }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1");
  const query = resolvedParams.query || "";
  const status = resolvedParams.status || "";
  const date = resolvedParams.date || "";

  const [session, { logs, totalCount }] = await Promise.all([
    getSession(),
    getOrderLogs(page, 10, { query, status, date })
  ]);

  return <LogManager initialLogs={logs as never} totalCount={totalCount} isAdmin={session?.role === "ADMIN"} initialPage={page} initialQuery={query} initialStatus={status} initialDate={date} />;
}
