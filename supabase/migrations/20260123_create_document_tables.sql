-- Create document generator tables (idempotent)

create table if not exists public.document_catalog (
    id bigserial primary key,
    step_no int not null,
    sub_no numeric(4,1) not null,
    doc_code text not null,
    title text not null,
    doc_kind text not null,
    language text not null default 'EN',
    is_required boolean not null default false,
    default_status text not null default 'DRAFT',
    source_ref text,
    locked_text boolean not null default false,
    ui_group text,
    sort_key int not null default 0,
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint document_catalog_doc_kind_check
        check (doc_kind in ('GENERATE','UPLOAD_SLOT','SOURCE_UPLOADED','EXTERNAL'))
);

create unique index if not exists document_catalog_doc_code_key
    on public.document_catalog (doc_code);

create unique index if not exists document_catalog_step_sub_key
    on public.document_catalog (step_no, sub_no);

create index if not exists document_catalog_sort_key_idx
    on public.document_catalog (sort_key);

create index if not exists document_catalog_step_no_idx
    on public.document_catalog (step_no);

create index if not exists document_catalog_active_idx
    on public.document_catalog (active);

create table if not exists public.document_templates (
    id bigserial primary key,
    doc_code text not null references public.document_catalog(doc_code) on delete cascade,
    language text not null default 'EN',
    version text not null default 'V1.0',
    body_md text not null,
    placeholders jsonb not null default '[]'::jsonb,
    locked_text boolean not null default false,
    updated_at timestamptz not null default now()
);

create unique index if not exists document_templates_doc_code_language_version_key
    on public.document_templates (doc_code, language, version);

create index if not exists document_templates_doc_code_idx
    on public.document_templates (doc_code);

create index if not exists document_templates_language_idx
    on public.document_templates (language);

create table if not exists public.email_templates (
    id bigserial primary key,
    email_code text not null,
    language text not null default 'EN',
    subject text not null,
    body_md text not null,
    placeholders jsonb not null default '[]'::jsonb,
    is_active boolean not null default true,
    updated_at timestamptz not null default now()
);

create unique index if not exists email_templates_email_code_key
    on public.email_templates (email_code);

create index if not exists email_templates_language_idx
    on public.email_templates (language);

create index if not exists email_templates_is_active_idx
    on public.email_templates (is_active);

-- updated_at trigger function (idempotent)
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

do $$
begin
    if not exists (select 1 from pg_trigger where tgname = 'update_document_catalog_updated_at') then
        create trigger update_document_catalog_updated_at
            before update on public.document_catalog
            for each row execute function public.update_updated_at_column();
    end if;
    if not exists (select 1 from pg_trigger where tgname = 'update_document_templates_updated_at') then
        create trigger update_document_templates_updated_at
            before update on public.document_templates
            for each row execute function public.update_updated_at_column();
    end if;
    if not exists (select 1 from pg_trigger where tgname = 'update_email_templates_updated_at') then
        create trigger update_email_templates_updated_at
            before update on public.email_templates
            for each row execute function public.update_updated_at_column();
    end if;
end $$;
