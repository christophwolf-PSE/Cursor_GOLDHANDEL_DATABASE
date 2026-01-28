-- Enable multiple KYC profiles per deal (Buyer + Seller)
-- Run in Supabase SQL editor

alter table public.kyc_profiles
    add column if not exists party_role text default 'Buyer';

update public.kyc_profiles
set party_role = 'Buyer'
where party_role is null;

alter table public.kyc_profiles
    alter column party_role set not null;

alter table public.kyc_profiles
    add constraint kyc_profiles_party_role_check
    check (party_role in ('Buyer', 'Seller'))
    not valid;

alter table public.kyc_profiles
    validate constraint kyc_profiles_party_role_check;

alter table public.kyc_profiles
    drop constraint if exists kyc_profiles_deal_id_key;

alter table public.kyc_profiles
    add constraint kyc_profiles_deal_role_key unique (deal_id, party_role);
