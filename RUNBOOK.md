# RUNBOOK – Lokaler Start & Debug

## Terminal-Regel
- Terminal A: Server läuft (`node server.cjs`)
- Terminal B: Befehle, Tests, Git, Skripte

## Start
1) Terminal A:
   node server.cjs
2) Browser:
   /api/health
   /ui

## Typische Fixes
- Port blockiert:
  kill -9 $(lsof -ti tcp:8787)

## Tests
- STOP/GO: Step 20 (G7) in /ui
- Done+Replan: Step 14 auf späteres Datum setzen
