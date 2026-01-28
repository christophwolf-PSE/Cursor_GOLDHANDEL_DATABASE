-- KYC/CIS Schema (minimal)
-- Run in Supabase SQL editor

create extension if not exists "uuid-ossp";

create table if not exists public.kyc_profiles (
    id uuid primary key default uuid_generate_v4(),
    deal_id uuid not null references public.deals(id) on delete cascade,
    deal_no text,
    company_name text,
    authorized_signatory_name text,
    authorized_signatory_title text,
    passport_no text,
    street text,
    city text,
    postal_code text,
    country text,
    phone text,
    business_email text,
    business_website text,
    tax_id text,
    vat_no text,
    company_roles jsonb default '[]'::jsonb,
    product_raw_material boolean,
    product_refined_bars boolean,
    product_refinery_machinery boolean,
    type_of_business text,
    incorporation_date date,
    shareholder_owner text,
    employees_count integer,
    subsidiaries text,
    primary_contact_first_name text,
    primary_contact_last_name text,
    primary_contact_function text,
    primary_contact_phone text,
    primary_contact_email text,
    legal_counsel_name text,
    legal_counsel_street text,
    legal_counsel_postal_code text,
    legal_counsel_city text,
    legal_counsel_country text,
    legal_counsel_phone text,
    legal_counsel_email text,
    legal_counsel_website text,
    bank_name text,
    bank_street text,
    bank_postal_code text,
    bank_city text,
    bank_country text,
    bank_phone text,
    bank_officer text,
    bank_officer_phone text,
    bank_officer_email text,
    account_name text,
    account_number text,
    iban text,
    swift_bic text,
    account_signatory text,
    bank_contacts jsonb default '[]'::jsonb,
    bank_reference_letter_appendix boolean,
    products jsonb default '[]'::jsonb,
    trade_references jsonb default '[]'::jsonb,
    cif_basis boolean,
    fixtures_last_three text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(deal_id)
);

create index if not exists idx_kyc_profiles_deal_id on public.kyc_profiles(deal_id);

alter table public.kyc_profiles enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'kyc_profiles'
      and policyname = 'Users can manage kyc_profiles'
  ) then
    create policy "Users can manage kyc_profiles"
    on public.kyc_profiles
    for all
    using (auth.role() = 'authenticated');
  end if;
end $$;
