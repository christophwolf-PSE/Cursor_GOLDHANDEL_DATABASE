# Architektur

## Kurzueberblick
Diese App ist eine Single-Page-Webanwendung (Vanilla HTML/CSS/JS) mit Supabase als Backend
(Postgres, Auth, Storage). Dokumente werden entweder generiert (aus Templates) oder als
Originaldatei aus Supabase Storage geladen. Exporte laufen komplett im Browser.

## Technologie-Stack
- Frontend: `index.html`, `styles.css`, `app.js` (ES Modules)
- Generator/Export: `generator.js`, `exports.js`, `grc-planning.js`
- Supabase Client/Helpers: `supabase.js`
- Libraries (via CDN in `index.html`): jsPDF + AutoTable, SheetJS, docx.js

## Hauptmodule und Verantwortung
- `index.html`: UI-Struktur inkl. Modals (Generator & Exports, Export-Dialoge, etc.)
- `styles.css`: globales UI-Design und Layout
- `app.js`: App-Logik (Auth, CRUD, Dokumente, UI-Events, Tabs, Modals)
- `generator.js`: Generator Hub (Dokumentenauswahl, PDF-Preview, SOURCE_UPLOADED Downloads)
- `exports.js`: CSV/XLSX/PDF/DOCX Exporte (Deal-Export und Overview)
- `supabase.js`: Supabase Client, Storage Upload/Download, Auth-Helfer

## Datenfluss (vereinfacht)
1) Login in `app.js` -> Supabase Auth
2) CRUD fuer Deals, Steps, Risks, Contacts in `app.js`
3) Dokumente:
   - Upload: `app.js` -> Supabase Storage Bucket `deal-documents`
   - Download: `app.js` -> Supabase Storage
4) Generator:
   - `generator.js` laedt `document_catalog` + `document_templates`
   - `GENERATE`: Templates + Platzhalter -> PDF-Preview (jsPDF)
   - `SOURCE_UPLOADED`: Datei aus Storage ueber `source_ref` laden

## Generator & Templates
- `document_catalog` steuert, welche Dokumente angezeigt werden.
- `document_templates` enthaelt `body_md` je `doc_code` und Sprache.
- `doc_kind` bestimmt Verhalten:
  - `GENERATE`: aus Template erzeugen
  - `SOURCE_UPLOADED`: Originaldatei aus Storage laden
  - `UPLOAD_SLOT`: Upload-Pflicht im Dokumente-Tab

## Storage
- Standard-Uploads: Bucket `deal-documents` (private)
- Source Templates: `source_ref` im Format `storage:templates/<pfad>`

## Exporte
- Deal-Export (CSV/XLSX/PDF/DOCX) in `exports.js`
- GRC-Export in `grc-planning.js`
- Word-Export ist HTML-basiert (Blob, `.doc`)

## Auth/Rollen
- Supabase Auth (Email/Passwort)
- Admin-Rechte: `supabase.js` prueft `user_metadata.role` oder Whitelist-Email

## Seeds / Initialdaten
- `docs/seed_1_document_catalog.sql` -> `document_catalog`
- `docs/seed_2_document_templates.sql` -> `document_templates`
- `docs/seed_3_email_templates.sql` -> `email_templates`
- Lokale Fallbacks: `src/domain/document_templates_seed.multi.json`,
  `src/domain/email_templates_seed.multi.json`

## Unbenutzte/Platzhalter-Teile (Stand heute)
- `src/services/*Service.js`: mehrere Stub-Funktionen (geben `null`/`[]` zurueck)
  - `addressExportService.js`, `exportService.js`, `documentService.js` (Stubs)
  - `emailService.js`, `auditService.js`, `fxService.js` (nicht sichtbar genutzt)
- Supabase Edge Functions fuer Access Requests sind vorbereitet, aber nicht deployt:
  - `supabase/functions/access-request-approve/index.ts`
  - `supabase/functions/access-request-notify/index.ts`

## Wann dieses Dokument aktualisieren?
Bitte aktualisieren, wenn:
- neue Tabellen/Spalten hinzukommen
- neue Module/Dateien zentrale Logik uebernehmen
- Generator-/Export-Logik geaendert wird
- neue Storage-Buckets oder Pfade verwendet werden

Hinweis: Ich erinnere regelmaessig an Updates, wenn strukturelle Aenderungen passieren.
