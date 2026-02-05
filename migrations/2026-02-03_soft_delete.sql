-- Soft delete support for deals and contacts
alter table if exists public.deals
  add column if not exists deleted_at timestamptz,
  add column if not exists deleted_by uuid,
  add column if not exists delete_reason text;

alter table if exists public.contacts
  add column if not exists deleted_at timestamptz,
  add column if not exists deleted_by uuid,
  add column if not exists delete_reason text;

create index if not exists deals_deleted_at_idx on public.deals (deleted_at);
create index if not exists contacts_deleted_at_idx on public.contacts (deleted_at);
