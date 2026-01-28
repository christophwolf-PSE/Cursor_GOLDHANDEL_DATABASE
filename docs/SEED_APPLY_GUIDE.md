# Seed Apply Guide (Generator Templates)

1) Open Supabase SQL Editor → New snippet.
2) Run migration:
   - `supabase/migrations/20260123_add_language_to_templates.sql`
3) Run seed SQL:
   - `docs/supabase_seed.sql`
4) Reload the app.
5) Open "Generator & Exports" modal → select EN/DE/FR.

Notes:
- The seed is idempotent (UPSERT). Re-running it updates existing rows.
- Templates with `locked_text=true` remain `SOURCE_UPLOADED`.
