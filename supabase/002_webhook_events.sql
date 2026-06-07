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

create index if not exists webhook_events_payment_code_idx on public.webhook_events(payment_code);
create index if not exists webhook_events_created_at_idx on public.webhook_events(created_at);

alter table public.webhook_events enable row level security;
