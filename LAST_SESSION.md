# LAST_SESSION – Goldhandel Workflow (Dev)

## Stand (zuletzt erfolgreich)
- PG-basierter Service: `processService.pg.cjs` (Update + Replan + Gate-Blocking)
- Express API: `server.cjs`
  - GET  /api/health
  - GET  /api/deals/:dealId/steps
  - POST /api/deals/:dealId/steps/:stepNo/done   (setzt Done + Replan)
  - POST /api/deals/:dealId/steps/:stepNo/gate   (setzt Gate + Blocking)
- UI läuft ohne index.html: http://localhost:8787/ui
  - Buttons: Done / STOP / GO
- Deal für Tests: G-0004
  - deal_id: 81b78c8f-c22c-41ce-8214-9ad8f85db84c
- Validiert:
  - Gate STOP blockt Folgeschritte, GO entblockt
  - Done mit späterem Datum verschiebt Folgetermine (Workdays)

## Offener Punkt / Next
1) Reopen (auditfähig) implementieren:
   - Endpoint: POST /api/deals/:dealId/steps/:stepNo/reopen  { reason }
   - setzt status=Open, actual_done=null, schreibt Begründung (verification_note)
   - triggert Replan ab Folgeschritt
2) Reopen Button in UI (/ui)
3) Optional: Admin/4-Augen-Mechanik für Reopen

## Server Start
Terminal A:
- node server.cjs

Health:
- http://localhost:8787/api/health
UI:
- http://localhost:8787/ui
