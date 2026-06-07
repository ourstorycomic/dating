-- YeuWeb full Supabase setup.
-- Run this file in Supabase SQL Editor as the single source of truth.
-- It is idempotent for normal reruns. It does not delete orders/users.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.user_role as enum ('ADMIN', 'STAFF', 'EMPLOYEE');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.order_status as enum (
    'PENDING_PAYMENT',
    'ACTIVE',
    'OPENED',
    'RESPONDED',
    'EXPIRED',
    'ARCHIVED',
    'CANCELLED'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.payment_status as enum ('PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.commission_recipient_type as enum ('EMPLOYEE', 'STAFF', 'AFFILIATE');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.commission_status as enum ('PENDING', 'EARNED', 'PAID_OUT', 'CANCELLED');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.recipient_response as enum ('YES', 'NO', 'MAYBE', 'CUSTOM');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.log_action as enum (
    'USER_CREATED',
    'USER_UPDATED',
    'USER_DELETED',
    'TEMPLATE_CREATED',
    'TEMPLATE_UPDATED',
    'TEMPLATE_DELETED',
    'TEMPLATE_PUBLISHED',
    'TEMPLATE_UNPUBLISHED',
    'ORDER_CREATED',
    'ORDER_UPDATED',
    'ORDER_ACTIVATED',
    'ORDER_ARCHIVED',
    'ORDER_CANCELLED',
    'PAYMENT_CREATED',
    'PAYMENT_CONFIRMED',
    'PAYMENT_FAILED',
    'COMMISSION_CREATED',
    'COMMISSION_CANCELLED',
    'COMMISSION_PAID_OUT',
    'GIFT_OPENED',
    'RECIPIENT_RESPONDED',
    'TRACK_PAGE_VIEWED'
  );
exception when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  name text not null,
  email text not null unique,
  role public.user_role not null default 'EMPLOYEE',
  custom_role_id uuid,
  avatar_url text,
  is_active boolean not null default true,
  manager_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.custom_roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  base_role public.user_role not null default 'EMPLOYEE',
  permissions text[] not null default '{}'::text[],
  commission_percentage numeric(5, 2) not null default 0 check (commission_percentage >= 0 and commission_percentage <= 100),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users add column if not exists custom_role_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'users_custom_role_id_fkey'
  ) then
    alter table public.users
    add constraint users_custom_role_id_fkey
    foreign key (custom_role_id) references public.custom_roles(id) on delete set null;
  end if;
end $$;

create table if not exists public.affiliates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  ref_code text not null unique,
  email text,
  phone text,
  social_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.template_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.template_categories(id) on delete restrict,
  slug text not null unique,
  name text not null,
  description text,
  tagline text,
  thumbnail_url text,
  preview_url text,
  component_key text not null,
  visual_label text,
  gradient text,
  base_price numeric(12, 2) not null check (base_price >= 0),
  data_schema jsonb not null default '{}'::jsonb,
  sample_data jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  status_label text not null default 'Dang ban',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  template_id uuid not null references public.templates(id) on delete restrict,
  created_by_id uuid not null references public.users(id) on delete restrict,
  affiliate_id uuid references public.affiliates(id) on delete set null,
  buyer_name text,
  buyer_contact text,
  buyer_social_handle text,
  recipient_name text,
  custom_data jsonb not null default '{}'::jsonb,
  amount numeric(12, 2) not null check (amount >= 0),
  status public.order_status not null default 'PENDING_PAYMENT',
  gift_opened_at timestamptz,
  last_tracked_at timestamptz,
  recipient_response public.recipient_response,
  response_text text,
  responded_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'VND',
  payment_code text not null unique,
  status public.payment_status not null default 'PENDING',
  provider text,
  provider_transaction_id text,
  qr_code_url text,
  raw_webhook_payload jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_transaction_id text not null,
  payment_code text,
  amount numeric(12, 2),
  status text not null default 'RECEIVED',
  raw_payload jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(provider, provider_transaction_id)
);

create table if not exists public.commission_rules (
  id uuid primary key default gen_random_uuid(),
  recipient_type public.commission_recipient_type not null unique,
  percentage numeric(5, 2) not null check (percentage >= 0 and percentage <= 100),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.role_commission_rules (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references public.custom_roles(id) on delete cascade,
  template_id uuid references public.templates(id) on delete cascade,
  percentage numeric(5, 2) not null check (percentage >= 0 and percentage <= 100),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(role_id, template_id)
);

create table if not exists public.user_commission_overrides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  template_id uuid references public.templates(id) on delete cascade,
  recipient_type public.commission_recipient_type not null default 'EMPLOYEE',
  percentage numeric(5, 2) not null check (percentage >= 0 and percentage <= 100),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, template_id, recipient_type)
);

create table if not exists public.commissions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  recipient_type public.commission_recipient_type not null,
  user_id uuid references public.users(id) on delete set null,
  affiliate_id uuid references public.affiliates(id) on delete set null,
  amount numeric(12, 2) not null check (amount >= 0),
  percentage numeric(5, 2) not null check (percentage >= 0 and percentage <= 100),
  status public.commission_status not null default 'EARNED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint commissions_single_recipient check (
    (recipient_type in ('EMPLOYEE', 'STAFF') and user_id is not null and affiliate_id is null)
    or
    (recipient_type = 'AFFILIATE' and affiliate_id is not null and user_id is null)
  )
);

create table if not exists public.order_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  actor_id uuid references public.users(id) on delete set null,
  action public.log_action not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists users_role_idx on public.users(role);
create index if not exists users_custom_role_id_idx on public.users(custom_role_id);
create index if not exists users_manager_id_idx on public.users(manager_id);
create index if not exists custom_roles_base_role_idx on public.custom_roles(base_role);
create index if not exists role_commission_rules_role_id_idx on public.role_commission_rules(role_id);
create index if not exists role_commission_rules_template_id_idx on public.role_commission_rules(template_id);
create index if not exists user_commission_overrides_user_id_idx on public.user_commission_overrides(user_id);
create index if not exists user_commission_overrides_template_id_idx on public.user_commission_overrides(template_id);
create index if not exists affiliates_ref_code_idx on public.affiliates(ref_code);
create index if not exists templates_category_id_idx on public.templates(category_id);
create index if not exists templates_published_idx on public.templates(is_published);
create index if not exists orders_template_id_idx on public.orders(template_id);
create index if not exists orders_created_by_id_idx on public.orders(created_by_id);
create index if not exists orders_affiliate_id_idx on public.orders(affiliate_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists payments_payment_code_idx on public.payments(payment_code);
create index if not exists payments_status_idx on public.payments(status);
create unique index if not exists payments_provider_transaction_paid_uidx
on public.payments(provider, provider_transaction_id)
where provider_transaction_id is not null and status = 'PAID';
create index if not exists webhook_events_payment_code_idx on public.webhook_events(payment_code);
create index if not exists webhook_events_created_at_idx on public.webhook_events(created_at);
create index if not exists commissions_order_id_idx on public.commissions(order_id);
create index if not exists commissions_user_id_idx on public.commissions(user_id);
create index if not exists commissions_affiliate_id_idx on public.commissions(affiliate_id);
create index if not exists order_logs_order_id_idx on public.order_logs(order_id);
create index if not exists order_logs_actor_id_idx on public.order_logs(actor_id);
create index if not exists order_logs_action_idx on public.order_logs(action);

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists set_custom_roles_updated_at on public.custom_roles;
create trigger set_custom_roles_updated_at before update on public.custom_roles
for each row execute function public.set_updated_at();

drop trigger if exists set_affiliates_updated_at on public.affiliates;
create trigger set_affiliates_updated_at before update on public.affiliates
for each row execute function public.set_updated_at();

drop trigger if exists set_template_categories_updated_at on public.template_categories;
create trigger set_template_categories_updated_at before update on public.template_categories
for each row execute function public.set_updated_at();

drop trigger if exists set_templates_updated_at on public.templates;
create trigger set_templates_updated_at before update on public.templates
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at before update on public.payments
for each row execute function public.set_updated_at();

drop trigger if exists set_commission_rules_updated_at on public.commission_rules;
create trigger set_commission_rules_updated_at before update on public.commission_rules
for each row execute function public.set_updated_at();

drop trigger if exists set_role_commission_rules_updated_at on public.role_commission_rules;
create trigger set_role_commission_rules_updated_at before update on public.role_commission_rules
for each row execute function public.set_updated_at();

drop trigger if exists set_user_commission_overrides_updated_at on public.user_commission_overrides;
create trigger set_user_commission_overrides_updated_at before update on public.user_commission_overrides
for each row execute function public.set_updated_at();

drop trigger if exists set_commissions_updated_at on public.commissions;
create trigger set_commissions_updated_at before update on public.commissions
for each row execute function public.set_updated_at();

insert into public.commission_rules (recipient_type, percentage)
values
  ('EMPLOYEE', 30),
  ('STAFF', 10),
  ('AFFILIATE', 15)
on conflict (recipient_type)
do update set percentage = excluded.percentage, updated_at = now();

insert into public.custom_roles (name, description, base_role, permissions, commission_percentage)
values
  ('Admin mặc định', 'Toàn quyền quản trị hệ thống.', 'ADMIN', array['orders:create', 'orders:view_all', 'users:view', 'users:edit', 'logs:view', 'logs:delete', 'analytics:view', 'commissions:edit'], 0),
  ('Staff mặc định', 'Quản lý nhân viên và xem nhật ký team.', 'STAFF', array['users:view', 'logs:view', 'analytics:view'], 10),
  ('Content', 'Tiếp nhận khách từ TikTok và tạo đơn.', 'EMPLOYEE', array['orders:create'], 30)
on conflict (name)
do update set
  description = excluded.description,
  base_role = excluded.base_role,
  permissions = excluded.permissions,
  commission_percentage = excluded.commission_percentage,
  is_active = true,
  updated_at = now();

insert into public.template_categories (slug, name, description, sort_order)
values
  ('valentine', 'Valentine', 'Template qua tang tinh yeu va ky niem ngay yeu.', 1),
  ('confession', 'To tinh', 'Template to tinh se duoc them lai tung mau rieng sau.', 2),
  ('birthday', 'Sinh nhat', 'Template sinh nhat se duoc them lai tung mau rieng sau.', 3)
on conflict (slug)
do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

with category_map as (
  select id, slug from public.template_categories
)
insert into public.templates (
  category_id,
  slug,
  name,
  description,
  tagline,
  component_key,
  visual_label,
  gradient,
  base_price,
  data_schema,
  sample_data,
  is_published,
  status_label,
  sort_order
)
values (
  (select id from category_map where slug = 'valentine'),
  'val-starry-constellation-01',
  'Valentine #1',
  'Ban do sao tinh yeu voi mat ma ngay ky niem, kinh vien vong, cac chang ky uc, cau tra loi va ghi am.',
  'Nguoi nhan mo bau troi sao, di qua tung chang ky uc, tra loi va gui ghi am cho nguoi mua xem lai.',
  'val-starry-constellation',
  'Sao',
  'from-[#05020d] via-fuchsia-950 to-pink-500',
  2000,
  '{
    "fields": [
      {"key":"senderName","type":"string","required":true},
      {"key":"recipientName","type":"string","required":true},
      {"key":"anniversaryCode","type":"string","required":true},
      {"key":"introTitle","type":"string","required":true},
      {"key":"introSubtitle","type":"string","required":true},
      {"key":"connectInstruction","type":"string","required":true},
      {"key":"stage2Title","type":"string","required":true},
      {"key":"stage2Subtitle","type":"string","required":true},
      {"key":"stage3Title","type":"string","required":true},
      {"key":"stage3Subtitle","type":"string","required":true},
      {"key":"stage3MusicLabel","type":"string","required":false},
      {"key":"stage4Prompt","type":"string","required":true},
      {"key":"stage4MicInstruction","type":"string","required":true},
      {"key":"stage4FallbackButton","type":"string","required":true},
      {"key":"finalTitle","type":"string","required":true},
      {"key":"finalCta","type":"string","required":true},
      {"key":"question","type":"string","required":true},
      {"key":"memories","type":"array","required":true},
      {"key":"colors","type":"object","required":true}
    ]
  }'::jsonb,
  '{
    "screens": ["Mo bau troi sao", "Quy dao hon loan", "Chom sao thanh am", "Mua sao bang", "Ket thuc va phan hoi"],
    "senderName": "Anh",
    "recipientName": "Em",
    "anniversaryCode": "1402",
    "introTitle": "Moi vi sao la mot ngay chung ta ben nhau",
    "introSubtitle": "Nhap dung ngay ky niem de mo bau troi ky uc cua hai dua.",
    "connectInstruction": "Noi cac ngoi sao",
    "question": "Em co dong y cung anh viet tiep cau chuyen nay khong?"
  }'::jsonb,
  true,
  'Dang ban',
  1
)
on conflict (slug)
do update set
  category_id = excluded.category_id,
  name = excluded.name,
  description = excluded.description,
  tagline = excluded.tagline,
  component_key = excluded.component_key,
  visual_label = excluded.visual_label,
  gradient = excluded.gradient,
  base_price = excluded.base_price,
  data_schema = excluded.data_schema,
  sample_data = excluded.sample_data,
  is_published = true,
  status_label = excluded.status_label,
  sort_order = excluded.sort_order,
  updated_at = now();

update public.templates
set is_published = false,
    updated_at = now()
where slug <> 'val-starry-constellation-01';

alter table public.users enable row level security;
alter table public.affiliates enable row level security;
alter table public.template_categories enable row level security;
alter table public.templates enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.webhook_events enable row level security;
alter table public.commission_rules enable row level security;
alter table public.commissions enable row level security;
alter table public.order_logs enable row level security;

drop policy if exists "Public can read active categories" on public.template_categories;
create policy "Public can read active categories"
on public.template_categories
for select
using (is_active = true);

drop policy if exists "Public can read published templates" on public.templates;
create policy "Public can read published templates"
on public.templates
for select
using (is_published = true);

-- Optional profile attach examples. Create users in Supabase Auth first, then edit email/name/role.
-- insert into public.users (auth_user_id, name, email, role, is_active)
-- select id, 'Admin YeuWeb', email, 'ADMIN', true
-- from auth.users
-- where email = 'admin@yeuweb.vn'
-- on conflict (email)
-- do update set auth_user_id = excluded.auth_user_id, name = excluded.name, role = excluded.role, is_active = true, updated_at = now();
