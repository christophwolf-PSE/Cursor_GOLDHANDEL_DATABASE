-- Audit trail for deal step actions
create table if not exists public.deal_step_audit (
  id bigserial primary key,
  ts timestamptz not null default now(),
  deal_id uuid not null,
  step_no int not null,
  action text not null,
  actor text null,
  reason text null,
  payload jsonb not null default '{}'::jsonb,
  ip text null,
  user_agent text null
);

create index if not exists deal_step_audit_deal_ts_idx
  on public.deal_step_audit (deal_id, ts desc);
