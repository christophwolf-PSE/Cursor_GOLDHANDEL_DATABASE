-- Seed email_templates (idempotent)

insert into public.email_templates (email_code, language, version, subject, placeholders, body_md, is_active, updated_at) values (
  'EMAIL_PRINTPACK_SEND_EN', 'EN', 1, 'Print Pack Ready', '["contact.name", "deal_no", "sender.name", "missing_docs"]'::jsonb, 'Dear {{contact.name}},

The print pack for deal {{deal_no}} is ready. Please review the attached documents and confirm receipt.

Best regards,
{{sender.name}}', true, now()
) on conflict (email_code, language, version) do update set
  subject = excluded.subject,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.email_templates (email_code, language, version, subject, placeholders, body_md, is_active, updated_at) values (
  'EMAIL_PRINTPACK_SEND_DE', 'DE', 1, 'Print-Pack bereit', '["contact.name", "deal_no", "sender.name", "missing_docs"]'::jsonb, 'Sehr geehrte/r {{contact.name}},

der Print-Pack für das Geschäft {{deal_no}} ist bereit. Bitte prüfen Sie die beigefügten Dokumente und bestätigen Sie den Erhalt.

Mit freundlichen Grüßen
{{sender.name}}', true, now()
) on conflict (email_code, language, version) do update set
  subject = excluded.subject,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.email_templates (email_code, language, version, subject, placeholders, body_md, is_active, updated_at) values (
  'EMAIL_PRINTPACK_SEND_FR', 'FR', 1, 'Print pack prêt', '["contact.name", "deal_no", "sender.name", "missing_docs"]'::jsonb, 'Bonjour {{contact.name}},

Le print pack pour le dossier {{deal_no}} est prêt. Merci de vérifier les documents joints et de confirmer la réception.

Cordialement,
{{sender.name}}', true, now()
) on conflict (email_code, language, version) do update set
  subject = excluded.subject,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.email_templates (email_code, language, version, subject, placeholders, body_md, is_active, updated_at) values (
  'EMAIL_MISSING_DOCS_EN', 'EN', 1, 'Missing Documents', '["contact.name", "deal_no", "sender.name", "missing_docs"]'::jsonb, 'Dear {{contact.name}},

For deal {{deal_no}}, the following documents are missing:
{{missing_docs}}

Please provide them at your earliest convenience.

Best regards,
{{sender.name}}', true, now()
) on conflict (email_code, language, version) do update set
  subject = excluded.subject,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.email_templates (email_code, language, version, subject, placeholders, body_md, is_active, updated_at) values (
  'EMAIL_MISSING_DOCS_DE', 'DE', 1, 'Fehlende Dokumente', '["contact.name", "deal_no", "sender.name", "missing_docs"]'::jsonb, 'Sehr geehrte/r {{contact.name}},

für das Geschäft {{deal_no}} fehlen folgende Dokumente:
{{missing_docs}}

Bitte reichen Sie diese zeitnah nach.

Mit freundlichen Grüßen
{{sender.name}}', true, now()
) on conflict (email_code, language, version) do update set
  subject = excluded.subject,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.email_templates (email_code, language, version, subject, placeholders, body_md, is_active, updated_at) values (
  'EMAIL_MISSING_DOCS_FR', 'FR', 1, 'Documents manquants', '["contact.name", "deal_no", "sender.name", "missing_docs"]'::jsonb, 'Bonjour {{contact.name}},

pour le dossier {{deal_no}}, les documents suivants manquent :
{{missing_docs}}

Merci de les transmettre dès que possible.

Cordialement,
{{sender.name}}', true, now()
) on conflict (email_code, language, version) do update set
  subject = excluded.subject,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.email_templates (email_code, language, version, subject, placeholders, body_md, is_active, updated_at) values (
  'EMAIL_CLOSING_FX_OVERRIDE_EN', 'EN', 1, 'FX Override Approval Needed', '["contact.name", "deal_no", "sender.name", "missing_docs"]'::jsonb, 'Dear {{contact.name}},

An FX override is requested for deal {{deal_no}}. Please review the justification and approve or reject.

Best regards,
{{sender.name}}', true, now()
) on conflict (email_code, language, version) do update set
  subject = excluded.subject,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.email_templates (email_code, language, version, subject, placeholders, body_md, is_active, updated_at) values (
  'EMAIL_CLOSING_FX_OVERRIDE_DE', 'DE', 1, 'FX Override Freigabe erforderlich', '["contact.name", "deal_no", "sender.name", "missing_docs"]'::jsonb, 'Sehr geehrte/r {{contact.name}},

für das Geschäft {{deal_no}} wurde ein FX Override beantragt. Bitte prüfen Sie die Begründung und geben Sie den Antrag frei oder lehnen Sie ihn ab.

Mit freundlichen Grüßen
{{sender.name}}', true, now()
) on conflict (email_code, language, version) do update set
  subject = excluded.subject,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.email_templates (email_code, language, version, subject, placeholders, body_md, is_active, updated_at) values (
  'EMAIL_CLOSING_FX_OVERRIDE_FR', 'FR', 1, 'Approbation FX override requise', '["contact.name", "deal_no", "sender.name", "missing_docs"]'::jsonb, 'Bonjour {{contact.name}},

Un FX override est demandé pour le dossier {{deal_no}}. Merci d’examiner la justification et d’approuver ou de refuser.

Cordialement,
{{sender.name}}', true, now()
) on conflict (email_code, language, version) do update set
  subject = excluded.subject,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  is_active = excluded.is_active,
  updated_at = now();
