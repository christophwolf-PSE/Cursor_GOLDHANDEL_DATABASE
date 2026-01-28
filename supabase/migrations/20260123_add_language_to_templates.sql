-- Add language support to document_templates and email_templates

alter table if exists public.document_templates
    add column if not exists language text not null default 'EN';

alter table if exists public.document_templates
    add column if not exists version integer not null default 1;

create unique index if not exists document_templates_doc_code_language_version_key
    on public.document_templates (doc_code, language, version);

alter table if exists public.email_templates
    add column if not exists language text not null default 'EN';

alter table if exists public.email_templates
    add column if not exists version integer not null default 1;

create unique index if not exists email_templates_email_code_language_version_key
    on public.email_templates (email_code, language, version);
