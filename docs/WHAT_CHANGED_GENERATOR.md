# Generator Tables Migration

This change adds a new Supabase migration that creates the generator catalog and template tables if they do not already exist.

Migration added:
- `supabase/migrations/20260123_create_document_tables.sql`

Tables created (idempotent):
- `public.document_catalog`
- `public.document_templates`
- `public.email_templates`

Supabase SQL Editor execution order:
1) `supabase/migrations/20260123_create_document_tables.sql`
2) `supabase/migrations/20260123_add_language_to_templates.sql`
3) `docs/supabase_seed.sql`
