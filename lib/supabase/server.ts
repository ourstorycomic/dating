import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function createServerSupabaseClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase server environment variables");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export type TemplateCatalogItem = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  tagline: string | null;
  component_key: string;
  visual_label: string | null;
  gradient: string | null;
  base_price: number;
  data_schema: unknown;
  sample_data: unknown;
  status_label: string;
  sort_order: number;
  template_categories: {
    slug: string;
    name: string;
    description: string | null;
  } | null;
};

const allowedTemplateMatches = [
  "valentine-1",
  "valentine #1",
  "valentine-2",
  "valentine #2",
  "valentine-3",
  "valentine #3",
  "val-starry-constellation",
  "dating-1",
  "dating #1",
  "will-you-date-me",
  "dating-2",
  "dating #2",
  "dating-3",
  "dating #3",
  "gacha",
  "birthday-1",
  "birthday #1",
  "birthday-magic",
  "birthday-2",
  "birthday #2",
  "birthday 2",
  "birthday2",
  "birthday_2",
  "sorry-1",
  "sorry #1",
  "sorry-2",
  "sorry #2",
];

function isSupportedTemplate(template: Pick<TemplateCatalogItem, "component_key" | "name" | "slug">) {
  const searchable = `${template.component_key} ${template.name} ${template.slug}`.toLowerCase();
  return allowedTemplateMatches.some((match) => searchable.includes(match));
}

function normalizeTemplateRelations(item: unknown) {
  const template = item as TemplateCatalogItem & {
    template_categories: TemplateCatalogItem["template_categories"] | TemplateCatalogItem["template_categories"][];
  };

  return {
    ...template,
    template_categories: Array.isArray(template.template_categories)
      ? template.template_categories[0] ?? null
      : template.template_categories,
  } as TemplateCatalogItem;
}

export async function getPublishedTemplates() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("templates")
    .select(
      "id, slug, name, description, tagline, component_key, visual_label, gradient, base_price, data_schema, sample_data, status_label, sort_order, template_categories(slug, name, description)",
    )
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load templates", error);
    return [];
  }

  return (data ?? []).map(normalizeTemplateRelations).filter(isSupportedTemplate);
}

export async function getTemplateBySlug(slug: string) {
  if (slug === "sorry-1") {
    return {
      id: "sorry-1-mock",
      slug: "sorry-1",
      name: "Sorry #1",
      component_key: "sorry-1",
      description: "Trải nghiệm 6 bước xoa dịu cơn giận từ việc đập tan lớp băng giá đến bản hiệp ước hòa bình hồng rực rỡ.",
      tagline: "Làm Hòa",
      base_price: 2000,
      visual_label: "HOT",
      gradient: "from-slate-400 to-rose-400",
      status_label: "Mới",
      sort_order: 20,
      data_schema: {},
      sample_data: { screens: ["Đập băng", "Thú tội", "Vòng quay", "Kỷ niệm", "Ký tên"] },
      template_categories: { slug: "sorry", name: "Sorry", description: null }
    } as any;
  }
  if (slug === "sorry-2") {
    return {
      id: "sorry-2-mock",
      slug: "sorry-2",
      name: "Sorry #2",
      component_key: "sorry-2",
      description: "Đập tan cơn tức giận với minigame 'Whack-a-Lover' rồi xoa dịu bằng lời hứa chân thành và trà sữa.",
      tagline: "Xả Giận",
      base_price: 2000,
      visual_label: "FUN",
      gradient: "from-orange-400 to-rose-400",
      status_label: "Mới",
      sort_order: 21,
      data_schema: {},
      sample_data: { screens: ["Châm ngòi", "Chọn vũ khí", "Xả giận", "Băng bó", "Xin lỗi", "Tha thứ"] },
      template_categories: { slug: "sorry", name: "Sorry", description: null }
    } as any;
  }
  if (slug === "sorry-3") {
    return {
      id: "sorry-3-mock",
      slug: "sorry-3",
      name: "Sorry #3",
      component_key: "sorry-3",
      description: "Hành trình chuộc lỗi đầy tính công nghệ và hài hước, từ màn hình xanh tử thần đến minigame khủng long.",
      tagline: "Chuộc Lỗi",
      base_price: 2000,
      visual_label: "FUN",
      gradient: "from-blue-400 to-indigo-400",
      status_label: "Mới",
      sort_order: 22,
      data_schema: {},
      sample_data: { screens: ["Lỗi hệ thống", "Mất kết nối", "Khủng long vượt ải", "Cảnh báo", "Thùng rác", "Cài đặt lại", "Tin nhắn", "Chốt kèo"] },
      template_categories: { slug: "sorry", name: "Sorry", description: null }
    } as any;
  }
  if (slug === "birthday-3") {
    return {
      id: "birthday-3-mock",
      slug: "birthday-3",
      name: "Birthday #3",
      component_key: "birthday-3",
      description: "Lộ trình sinh nhật 8 bước sang trọng, từ gõ cửa, bật đèn, đập bóng bay đến xé quà bất ngờ.",
      tagline: "Sinh Nhật",
      base_price: 2000,
      visual_label: "LUXURY",
      gradient: "from-amber-200 to-yellow-500",
      status_label: "Mới",
      sort_order: 12,
      data_schema: {},
      sample_data: { screens: ["Gõ cửa", "Bật đèn", "Bóng bay", "Thổi nến", "Lật thiệp", "Ảnh kỷ niệm", "Xé quà", "Nhận quà"] },
      template_categories: { slug: "birthday", name: "Birthday", description: null }
    } as any;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("templates")
    .select(
      "id, slug, name, description, tagline, component_key, visual_label, gradient, base_price, data_schema, sample_data, status_label, sort_order, template_categories(slug, name, description)",
    )
    .or(`slug.eq.${slug},component_key.eq.${slug}`)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("Failed to load template", error);
    return null;
  }

  const template = normalizeTemplateRelations(data);
  return isSupportedTemplate(template) ? template : null;
}

export async function getDashboardCounts() {
  const supabase = createServerSupabaseClient();

  const [orders, templates, users, logs] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("templates").select("id", { count: "exact", head: true }),
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("order_logs").select("id", { count: "exact", head: true }),
  ]);

  return {
    orders: orders.count ?? 0,
    templates: templates.count ?? 0,
    users: users.count ?? 0,
    logs: logs.count ?? 0,
  };
}

export async function getRecentOrders(filters?: { query?: string; status?: string; startDate?: string; endDate?: string }) {
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("orders")
    .select(
      "id, public_id, buyer_name, buyer_contact, recipient_name, amount, status, created_at, templates(name), users(name)",
    )
    .order("created_at", { ascending: false });

  if (filters?.query) {
    query = query.or(`public_id.ilike.%${filters.query}%,buyer_name.ilike.%${filters.query}%,buyer_contact.ilike.%${filters.query}%`);
  }
  if (filters?.status && filters.status !== "ALL") {
    query = query.eq("status", filters.status);
  }
  if (filters?.startDate) {
    query = query.gte("created_at", filters.startDate);
  }
  if (filters?.endDate) {
    query = query.lte("created_at", filters.endDate);
  }

  // Allow up to 50 items if filtering, else default 8
  const hasFilters = filters?.query || (filters?.status && filters.status !== "ALL") || filters?.startDate || filters?.endDate;
  query = query.limit(hasFilters ? 50 : 8);

  const { data, error } = await query;

  if (error) {
    console.error("Failed to load recent orders", error);
    return [];
  }

  return data ?? [];
}

export async function getOrdersByCreator(userId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, public_id, template_id, buyer_name, buyer_contact, recipient_name, custom_data, amount, status, created_at, templates(id, name, component_key), payments(payment_code, status, paid_at)")
    .eq("created_by_id", userId)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error("Failed to load creator orders", error);
    return [];
  }

  return data ?? [];
}

export async function getUsers() {
  const supabase = createServerSupabaseClient();
  const withCustomRole = await supabase
    .from("users")
    .select("id, name, email, role, custom_role_id, is_active, manager_id, created_at, custom_roles(id, name, base_role, commission_percentage)")
    .order("created_at", { ascending: false });

  if (!withCustomRole.error) {
    return withCustomRole.data ?? [];
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, is_active, manager_id, created_at")
    .order("created_at", { ascending: false });

  if (error) return [];

  return (data ?? []).map((user) => ({
    ...user,
    custom_role_id: null,
    custom_roles: null,
  }));
}

export async function getCustomRoles() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("custom_roles")
    .select("id, name, description, base_role, permissions, commission_percentage, is_active, created_at, role_commission_rules(template_id, percentage, is_active)")
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function getOrderLogs() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("order_logs")
    .select("id, action, metadata, created_at, users(name, email), orders(id, public_id, buyer_name, buyer_contact, recipient_name, amount, status, custom_data, created_at, templates(name, component_key, visual_label), payments(payment_code, amount, status, qr_code_url, paid_at), creator:users!orders_created_by_id_fkey(name, email))")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Failed to load order logs", error);
    return [];
  }

  return data ?? [];
}

export async function getOrderByPublicId(publicId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, public_id, recipient_name, custom_data, amount, status, gift_opened_at, recipient_response, response_text, responded_at, created_at, templates(component_key, visual_label, gradient), payments(payment_code, amount, status, qr_code_url)",
    )
    .eq("public_id", publicId)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("Failed to load order", error);
    return null;
  }

  return data as unknown as {
    id: string;
    public_id: string;
    recipient_name: string | null;
    custom_data: Record<string, unknown>;
    amount: number;
    status: string;
    gift_opened_at: string | null;
    recipient_response: string | null;
    response_text: string | null;
    responded_at: string | null;
    created_at: string;
    templates: {
      component_key: string;
      visual_label: string | null;
      gradient: string | null;
    } | null;
    payments:
      | {
          payment_code: string;
          amount: number;
          status: string;
          qr_code_url: string | null;
        }
      | Array<{
          payment_code: string;
          amount: number;
          status: string;
          qr_code_url: string | null;
        }>
      | null;
  };
}

export async function getCommissionRules() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("commission_rules")
    .select("recipient_type, percentage, is_active, updated_at")
    .order("recipient_type", { ascending: true });

  if (error) {
    console.error("Failed to load commission rules", error);
    return [];
  }

  return data ?? [];
}

export async function getEmployeeDailyStats({ days = 14 }: { days?: number } = {}) {
  const supabase = createServerSupabaseClient();
  const since = new Date();
  since.setDate(since.getDate() - days + 1);
  since.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("orders")
    .select("id, amount, status, created_at, created_by_id, users!orders_created_by_id_fkey(id, name, email)")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load employee daily stats", error);
    return [];
  }

  const map = new Map<string, {
    activeOrders: number;
    commissionEarned: number;
    createdOrders: number;
    date: string;
    employeeEmail: string;
    employeeId: string;
    employeeName: string;
    pendingOrders: number;
    revenue: number;
  }>();

  for (const order of data ?? []) {
    const employee = Array.isArray(order.users) ? order.users[0] : order.users;
    const date = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(order.created_at));
    const employeeId = order.created_by_id;
    const key = `${date}:${employeeId}`;

    if (!map.has(key)) {
      map.set(key, {
        activeOrders: 0,
        commissionEarned: 0,
        createdOrders: 0,
        date,
        employeeEmail: employee?.email ?? "",
        employeeId,
        employeeName: employee?.name ?? "Không rõ",
        pendingOrders: 0,
        revenue: 0,
      });
    }

    const row = map.get(key);
    if (!row) continue;

    row.createdOrders += 1;
    if (order.status === "ACTIVE" || order.status === "RESPONDED") {
      row.activeOrders += 1;
      row.revenue += Number(order.amount ?? 0);
    }
    if (order.status === "PENDING_PAYMENT") {
      row.pendingOrders += 1;
    }
  }

  const { data: commissions } = await supabase
    .from("commissions")
    .select("amount, user_id, created_at, users(name, email)")
    .gte("created_at", since.toISOString())
    .eq("status", "EARNED");

  for (const commission of commissions ?? []) {
    const user = Array.isArray(commission.users) ? commission.users[0] : commission.users;
    const date = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(commission.created_at));
    const employeeId = commission.user_id;
    const key = `${date}:${employeeId}`;

    if (!map.has(key)) {
      map.set(key, {
        activeOrders: 0,
        commissionEarned: 0,
        createdOrders: 0,
        date,
        employeeEmail: user?.email ?? "",
        employeeId,
        employeeName: user?.name ?? "Không rõ",
        pendingOrders: 0,
        revenue: 0,
      });
    }

    const row = map.get(key);
    if (row) row.commissionEarned += Number(commission.amount ?? 0);
  }

  return Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date) || b.createdOrders - a.createdOrders);
}

export async function getEmployeeMonthlyStats({ months = 12 }: { months?: number } = {}) {
  const supabase = createServerSupabaseClient();
  const since = new Date();
  since.setMonth(since.getMonth() - months + 1);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("orders")
    .select("id, amount, status, created_at, created_by_id, users!orders_created_by_id_fkey(id, name, email)")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load employee monthly stats", error);
    return [];
  }

  const map = new Map<string, {
    activeOrders: number;
    commissionEarned: number;
    createdOrders: number;
    employeeEmail: string;
    employeeId: string;
    employeeName: string;
    month: string;
    pendingOrders: number;
    revenue: number;
  }>();

  for (const order of data ?? []) {
    const employee = Array.isArray(order.users) ? order.users[0] : order.users;
    const month = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
    }).format(new Date(order.created_at));
    const key = `${month}:${order.created_by_id}`;

    if (!map.has(key)) {
      map.set(key, {
        activeOrders: 0,
        commissionEarned: 0,
        createdOrders: 0,
        employeeEmail: employee?.email ?? "",
        employeeId: order.created_by_id,
        employeeName: employee?.name ?? "Không rõ",
        month,
        pendingOrders: 0,
        revenue: 0,
      });
    }

    const row = map.get(key);
    if (!row) continue;
    row.createdOrders += 1;
    if (order.status === "ACTIVE" || order.status === "RESPONDED") {
      row.activeOrders += 1;
      row.revenue += Number(order.amount ?? 0);
    }
    if (order.status === "PENDING_PAYMENT") row.pendingOrders += 1;
  }

  const { data: commissions } = await supabase
    .from("commissions")
    .select("amount, user_id, created_at, users(name, email)")
    .gte("created_at", since.toISOString())
    .eq("status", "EARNED");

  for (const commission of commissions ?? []) {
    const user = Array.isArray(commission.users) ? commission.users[0] : commission.users;
    const month = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
    }).format(new Date(commission.created_at));
    const key = `${month}:${commission.user_id}`;

    if (!map.has(key)) {
      map.set(key, {
        activeOrders: 0,
        commissionEarned: 0,
        createdOrders: 0,
        employeeEmail: user?.email ?? "",
        employeeId: commission.user_id,
        employeeName: user?.name ?? "Không rõ",
        month,
        pendingOrders: 0,
        revenue: 0,
      });
    }

    const row = map.get(key);
    if (row) row.commissionEarned += Number(commission.amount ?? 0);
  }

  return Array.from(map.values()).sort((a, b) => b.month.localeCompare(a.month) || b.createdOrders - a.createdOrders);
}

export async function getCommissionSummary() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("commissions")
    .select("id, user_id, amount, percentage, recipient_type, status, created_at, users(name, email), affiliates(name, ref_code), orders(public_id)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Failed to load commission summary", error);
    return [];
  }

  return data ?? [];
}

export async function getUserDetails(userId: string) {
  const supabase = createServerSupabaseClient();
  
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, name, email, role, is_active, created_at")
    .eq("id", userId)
    .single();

  if (userError || !user) return null;

  const [ordersResponse, commissionsResponse] = await Promise.all([
    supabase
      .from("orders")
      .select("id, public_id, amount, status, created_at")
      .eq("created_by_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("commissions")
      .select("id, amount, percentage, status, created_at, order_id, orders(public_id, status)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
  ]);

  return {
    user,
    orders: ordersResponse.data ?? [],
    commissions: commissionsResponse.data ?? [],
  };
}
