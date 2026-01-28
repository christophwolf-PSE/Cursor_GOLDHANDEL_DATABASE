-- SPA Merge Fields (Deals table)
-- Run in Supabase SQL editor to store SPA-specific values.

alter table public.deals
    add column if not exists quantity_kg numeric,
    add column if not exists price_fixing text,
    add column if not exists origin_country text,
    add column if not exists shipment_route text,
    add column if not exists commodity_form text,
    add column if not exists commodity_purity text,
    add column if not exists currency text,
    add column if not exists consignments text,
    add column if not exists seller_name text,
    add column if not exists buyer_name text,
    add column if not exists seller_address text,
    add column if not exists buyer_address text,
    add column if not exists signature_seller text,
    add column if not exists signature_buyer text,
    add column if not exists bank_name text,
    add column if not exists bank_iban text,
    add column if not exists bank_bic text,
    add column if not exists bank_account_holder text;
