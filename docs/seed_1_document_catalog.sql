-- Seed document_catalog (idempotent)

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  1, 1, 'NDA-NCNDA', 'NDA / NCNDA (light)', 'GENERATE', 'EN', false,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  2, 1, 'FEE-BUYER', 'Buyer-Side Intermediary Fee Agreement', 'GENERATE', 'EN', true,
  'DRAFT',
  '09',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  2, 2, 'FEE-SELLER', 'Seller-Side Intermediary Fee Agreement', 'GENERATE', 'EN', false,
  'DRAFT',
  '10',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  2, 3, 'FEE-CHAIN', 'Full Chain Master Fee & NCNDA Agreement', 'GENERATE', 'EN', false,
  'DRAFT',
  '11',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  2, 4, 'DPT', 'Discount Participation Table (Annex)', 'GENERATE', 'EN', true,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  3, 1, 'KYC-CIS', 'KYC / CIS Form', 'GENERATE', 'EN', true,
  'DRAFT',
  '01.1',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  3, 2, 'SCREEN-LOG', 'Sanctions/PEP/Embargo Screening Log', 'GENERATE', 'EN', true,
  'DRAFT',
  '12',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  3, 3, 'SOF-SOW', 'Source of Funds / Source of Wealth Declaration', 'GENERATE', 'EN', false,
  'DRAFT',
  '13',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  3, 4, 'ID-UPLOAD', 'ID/Passport/Company Docs (Upload)', 'UPLOAD_SLOT', 'EN', true,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  4, 1, 'COC-TRANSFER', 'Chain-of-Custody Transfer Record', 'GENERATE', 'EN', true,
  'DRAFT',
  '14',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  4, 2, 'ORIGIN-PROOFS', 'Origin / Ownership Proofs (Upload)', 'UPLOAD_SLOT', 'EN', true,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  5, 1, 'SPA', 'Sales and Purchase Agreement', 'GENERATE', 'EN', true,
  'DRAFT',
  '06.1',
  true, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  5, 2, 'SPA-ADD-01', 'SPA Addendum-01', 'GENERATE', 'EN', false,
  'DRAFT',
  '07',
  true, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  5, 3, 'SPA-ADD-02', 'SPA Addendum-02', 'GENERATE', 'EN', false,
  'DRAFT',
  '08',
  true, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  5, 4, 'BCL', 'Bank Comfort Letter', 'GENERATE', 'EN', false,
  'DRAFT',
  '02',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  5, 5, 'PAY-GUAR', 'Payment Guarantee Letter', 'GENERATE', 'EN', false,
  'DRAFT',
  '03',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  6, 1, '72H-COVER', '72h Shipping Documents Cover Sheet', 'GENERATE', 'EN', true,
  'DRAFT',
  '16',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  6, 2, 'PROFORMA', 'Proforma Invoice (Upload/Template)', 'UPLOAD_SLOT', 'EN', true,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  6, 3, 'COO', 'Certificate of Origin (Upload)', 'UPLOAD_SLOT', 'EN', true,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  6, 4, 'OWNERSHIP', 'Ownership Declaration (Upload)', 'UPLOAD_SLOT', 'EN', true,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  6, 5, 'PACKING', 'Packing List (Upload)', 'UPLOAD_SLOT', 'EN', true,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  6, 6, 'ASSAY-PRE', 'Assay Report (Pre) (Upload)', 'UPLOAD_SLOT', 'EN', true,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  6, 7, 'AWB', 'Air Waybill (Upload)', 'UPLOAD_SLOT', 'EN', true,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  6, 8, 'EXPORT-PERMIT', 'Export Permit (Upload)', 'UPLOAD_SLOT', 'EN', true,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  6, 9, 'CUSTOMS-DECL', 'Customs Declaration (Upload)', 'UPLOAD_SLOT', 'EN', true,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  6, 10, 'TAX-REC', 'Tax Receipt (Upload)', 'UPLOAD_SLOT', 'EN', true,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  6, 11, 'INSURANCE', 'Insurance Certificate (Upload)', 'UPLOAD_SLOT', 'EN', true,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  6, 12, 'FREE-CLEAR', 'Free & Clear Declaration (Upload)', 'UPLOAD_SLOT', 'EN', true,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  7, 1, 'LOG-INS', 'Logistics & Insurance Instructions', 'GENERATE', 'EN', true,
  'DRAFT',
  '17',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  8, 1, 'IMPORT-INSTR', 'Customs/Import Instruction Sheet', 'GENERATE', 'EN', true,
  'DRAFT',
  '18',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  8, 2, 'CUSTOMS-NOTES', 'Customs/Handling Notes (Upload)', 'UPLOAD_SLOT', 'EN', false,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  9, 1, 'SEC-HANDOVER', 'Security Logistics Handover Record', 'GENERATE', 'EN', false,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  10, 1, 'RECEIVE-CERT', 'Acceptance & Receiving Certificate', 'GENERATE', 'EN', true,
  'DRAFT',
  '15',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  10, 2, 'PHOTOS-SEALS', 'Photos/Seal Numbers (Upload)', 'UPLOAD_SLOT', 'EN', false,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  11, 1, 'ASSAY-REQ', 'Assay Request Form', 'GENERATE', 'EN', true,
  'DRAFT',
  '19',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  11, 2, 'ASSAY-2ND', 'Second Assay Request/Report (Upload)', 'UPLOAD_SLOT', 'EN', false,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  12, 1, 'ASSAY-FINAL-COVER', 'Final Assay Report Cover + Summary', 'GENERATE', 'EN', true,
  'DRAFT',
  '20',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  12, 2, 'ASSAY-FINAL', 'Final Assay Report (Signed Upload)', 'UPLOAD_SLOT', 'EN', true,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  13, 1, 'PRICE-FIX', 'Price Fixing Sheet (LBMA reference)', 'GENERATE', 'EN', true,
  'DRAFT',
  '21',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  13, 2, 'FX-OVERRIDE', 'Deal FX Override Evidence (Upload)', 'UPLOAD_SLOT', 'EN', false,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  14, 1, 'SETTLEMENT', 'Payment Instruction / Settlement Sheet', 'GENERATE', 'EN', true,
  'DRAFT',
  '22',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  14, 2, 'PAY-CONF', 'Payment Confirmation (Upload)', 'UPLOAD_SLOT', 'EN', false,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  15, 1, 'OWN-TRANSFER', 'Ownership Transfer Certificate', 'GENERATE', 'EN', true,
  'DRAFT',
  '23',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  16, 1, 'REFINE-ORDER', 'Refining Order / Processing Instruction', 'GENERATE', 'EN', false,
  'DRAFT',
  '24',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  16, 2, 'REFINE-CERT', 'Refinery Certificate (Upload)', 'UPLOAD_SLOT', 'EN', false,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  17, 1, 'STORAGE-RELEASE', 'Storage & Buyer Release / Collection Note', 'GENERATE', 'EN', false,
  'DRAFT',
  '25',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  18, 1, 'CLOSING-INDEX', 'Closing Dossier Index', 'GENERATE', 'EN', true,
  'DRAFT',
  '26',
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();

insert into public.document_catalog (
  step_no, sub_no, doc_code, title, doc_kind, language, is_required,
  default_status, source_ref, locked_text, ui_group, active, created_at, updated_at
) values (
  18, 2, 'AUDIT-EXPORT', 'Audit Log Export (auto)', 'EXTERNAL', 'EN', true,
  'DRAFT',
  null,
  false, null, true, now(), now()
) on conflict (doc_code) do update set
  step_no = excluded.step_no,
  sub_no = excluded.sub_no,
  title = excluded.title,
  doc_kind = excluded.doc_kind,
  language = excluded.language,
  is_required = excluded.is_required,
  default_status = excluded.default_status,
  source_ref = excluded.source_ref,
  locked_text = excluded.locked_text,
  ui_group = excluded.ui_group,
  active = excluded.active,
  updated_at = now();
