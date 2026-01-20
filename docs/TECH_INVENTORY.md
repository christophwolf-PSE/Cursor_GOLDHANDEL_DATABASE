# Tech Inventory

## PDF / Document Libraries
- jsPDF: `index.html` (CDN), used in `exports.js`, `grc-planning.js`.
- jsPDF-AutoTable: `index.html` (CDN), used in `exports.js`.
- docx.js: `index.html` (CDN), used in `exports.js`, `grc-planning.js`.
- SheetJS (XLSX): `index.html` (CDN), used in `exports.js`, `grc-planning.js`.

## Export entrypoints
- Deal export modal: `index.html` (export modal), `app.js` (open modal + handle), `exports.js` (CSV/XLSX/PDF/DOCX).
- GRC planning exports: `grc-planning.js`.
- Deal overview export: `exports.js` (PDF).

## Email usage
- Mailto links only: `app.js` (contact list uses `mailto:` buttons).
- No dedicated email service/library detected.

## Supabase usage
- Supabase client: `supabase.js`.
- Auth usage: `app.js` (login/signup/session).
- Storage: `supabase.js`, `app.js` (document upload/download).
- Data access: `app.js` (deals, steps, contacts, documents, risks), `exports.js` (exports), `grc-planning.js` (planning data).
