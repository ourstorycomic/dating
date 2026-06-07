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

create index if not exists users_custom_role_id_idx on public.users(custom_role_id);
create index if not exists custom_roles_base_role_idx on public.custom_roles(base_role);
create index if not exists role_commission_rules_role_id_idx on public.role_commission_rules(role_id);
create index if not exists role_commission_rules_template_id_idx on public.role_commission_rules(template_id);
create index if not exists user_commission_overrides_user_id_idx on public.user_commission_overrides(user_id);
create index if not exists user_commission_overrides_template_id_idx on public.user_commission_overrides(template_id);

drop trigger if exists set_custom_roles_updated_at on public.custom_roles;
create trigger set_custom_roles_updated_at before update on public.custom_roles
for each row execute function public.set_updated_at();

drop trigger if exists set_role_commission_rules_updated_at on public.role_commission_rules;
create trigger set_role_commission_rules_updated_at before update on public.role_commission_rules
for each row execute function public.set_updated_at();

drop trigger if exists set_user_commission_overrides_updated_at on public.user_commission_overrides;
create trigger set_user_commission_overrides_updated_at before update on public.user_commission_overrides
for each row execute function public.set_updated_at();

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
