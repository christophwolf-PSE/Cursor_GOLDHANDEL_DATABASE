# Tech Stack Report

## Summary
- Frontend framework: Vanilla HTML/CSS/JavaScript (no React/Vue/etc.)
- Backend/runtime: Supabase (hosted backend services; no custom server in repo)
- Database: PostgreSQL (via Supabase)
- PDF generation: jsPDF + jsPDF-AutoTable (client-side)
- Email: No dedicated email-sending library/service found (only mailto links)
- Authentication: Supabase Auth (email/password)
- Hosting/deployment hints: Static site served locally (Python/Node/PHP options); Supabase for backend

## Evidence and Confidence

### A) Frontend framework
- Evidence: `README.md` — "Frontend: Vanilla HTML/CSS/JavaScript (keine Frameworks)".
- Evidence: `index.html` — plain HTML with `<script>` tags and no framework bootstrapping.
- Confidence: High

### B) Backend framework/runtime
- Evidence: `README.md` — "Backend: Supabase (PostgreSQL, Storage, Auth)".
- Evidence: `supabase.js` — uses `@supabase/supabase-js` client and Supabase URL/anon key.
- Confidence: High

### C) Database
- Evidence: `README.md` — Supabase (PostgreSQL, Storage, Auth).
- Evidence: `migrations.sql` — PostgreSQL schema, extensions, and SQL.
- Confidence: High

### D) PDF generation
- Evidence: `index.html` — jsPDF and jsPDF-AutoTable scripts loaded from CDN.
- Evidence: `exports.js` — `const { jsPDF } = window.jspdf;` and `doc.autoTable(...)` usage.
- Confidence: High

### E) Email sending
- Evidence: `app.js` — only `mailto:` links for contacts; no SMTP/SendGrid/Mailgun/etc.
- Evidence: repo has no `package.json` or server email libraries.
- Confidence: Medium (no evidence of backend email; could be external)

### F) Authentication
- Evidence: `supabase.js` — `supabase.auth.getUser()`, `signInWithPassword`, `signUp`.
- Evidence: `README.md` — "Authentifizierung: Supabase Auth mit Email/Password".
- Confidence: High

### G) Hosting/deployment hints
- Evidence: `README.md` — instructions for static local servers (Python/Node/PHP) and no deployment config files.
- Evidence: No `Dockerfile`, no CI workflow files found.
- Confidence: Medium
