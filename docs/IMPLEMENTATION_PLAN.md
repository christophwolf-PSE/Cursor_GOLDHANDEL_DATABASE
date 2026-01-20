# Implementation Plan (Read-Only)

## 1) Current architecture summary
- Entry points: `index.html` loads `app.js`, `exports.js`, `grc-planning.js`, `chatbot.js` as ES modules.
- Frontend: Vanilla HTML/CSS/JS (no framework).
- Backend: Supabase (Postgres/Auth/Storage) via `supabase.js`.
- Exports: `exports.js` (CSV/XLSX/PDF/Word) using SheetJS, jsPDF + AutoTable, docx.js.
- Storage: Supabase Storage bucket `deal-documents`.

## 2) Target architecture (modules/services)
- `src/config/`: constants + environment doc.
- `src/lib/`: thin wrappers (supabase client, logger).
- `src/domain/`: core shapes (models), step definitions, document catalog registry.
- `src/services/`: use-case services (documents, exports, FX, email, address import/export, audit).
- `src/utils/`: pure helpers (validation, formatting, ids).
- `src/ui/`: placeholders for modal/component structure.

## 3) Data model proposal (JSON-like shapes)
```json
{
  "Deal": {
    "id": "uuid",
    "deal_no": "G-0001",
    "country": "string",
    "route": "string",
    "commodity_type": "Doré|Hallmark|...",
    "offer_terms": "string",
    "lbma_discount_pct": "number",
    "fx_mode": "AUTO|OVERRIDE",
    "fx_override_rate": "number",
    "fx_override_source": "string",
    "fx_override_timestamp": "datetime",
    "fx_override_document_id": "uuid",
    "fx_override_set_by": "uuid",
    "fx_override_set_at": "datetime"
  },
  "Step": {
    "deal_id": "uuid",
    "step_no": 1,
    "title": "string",
    "status": "Open|In Progress|Blocked|Done|Verified"
  },
  "DocumentInstance": {
    "id": "uuid",
    "deal_id": "uuid",
    "deal_no": "G-0001",
    "step_no": 1,
    "sub_no": 1,
    "doc_no": "S1.1",
    "doc_code": "KYC/CIS",
    "template_no": "01.1",
    "language": "DE|EN",
    "version": "string",
    "status": "DRAFT|FINAL|SIGNED|UPLOADED",
    "rendered_pdf_asset_id": "uuid|null",
    "rendered_docx_asset_id": "uuid|null",
    "source_data_snapshot_hash": "string",
    "created_at": "datetime",
    "created_by": "uuid"
  },
  "AddressBookEntry": {
    "id": "uuid",
    "entry_type": "PERSON|ORG",
    "full_name": "string",
    "org_name": "string|null",
    "email": "string|null",
    "phone": "string|null",
    "country": "string",
    "roles": ["Seller","Buyer","Bank","Intermediary"],
    "bank_details": {"bank_name":"string","iban":"string","bic":"string"},
    "passport": {"passport_no":"string","issuing_country":"string","expiry_date":"date"}
  },
  "DiscountParticipationTable": {
    "id": "uuid",
    "deal_id": "uuid",
    "title": "string",
    "entries": [
      {"party_id":"uuid","role_side":"buyer|seller","active":true,"percent":0}
    ]
  },
  "AuditLog": {
    "id": "uuid",
    "deal_id": "uuid|null",
    "actor": "uuid|null",
    "action": "string",
    "entity": "string",
    "entity_id": "uuid|null",
    "before_json": "object|null",
    "after_json": "object|null",
    "created_at": "datetime"
  }
}
```

## 4) Supabase tables/buckets to add later (plan only)
- Tables: `document_catalog`, `document_instances`, `print_packs`, `email_outbox`, `fx_overrides`, `address_import_jobs`.
- Buckets: `generated-docs` (PDF/DOCX), `print-packs` (merged PDFs/ZIPs).

## 5) Edge Functions plan (email + optional server merge)
- `send-email`: accepts recipients, subject, body, attachments; uses provider abstraction.
- `merge-print-pack`: optional server-side PDF merge for large bundles.
- `audit-log`: standardized audit event writes (export, email, FX override).

## 6) Incremental rollout phases
- Phase 1: Create structure + stubs (this step).
- Phase 2: Wire services into UI flows (generator, exports, print-pack).
- Phase 3: Implement document catalog, generation, email wizard, FX override.

## 7) Risk checklist + testing checklist
- Risks: breaking existing exports; incorrect doc numbering; missing audit trails; email mis-send; FX override misuse.
- Tests: export regression (CSV/PDF), doc numbering order, print-pack merge integrity, email draft review, FX override audit log.

## How to edit the document catalog
- Update the local seed file: `src/domain/documentCatalog.seed.json`.
- If/when `document_catalog` exists in Supabase, keep the table in sync with the seed.
