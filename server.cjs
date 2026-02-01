require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { updateStepAndReplanPG } = require("./processService.pg.cjs");

const app = express();
app.use(cors());
app.use(express.json());

// Ein Pool für reine Read-Queries (Steps-Laden)
const readPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

/**
 * UI (ohne index.html anfassen)
 * http://localhost:8787/ui
 */
app.get("/ui", (req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>KORAS – Deal Steps UI</title>
  <style>
    body { font-family: Arial, sans-serif; padding:16px; }
    table { width:100%; border-collapse:collapse; min-width:1100px; }
    th, td { padding:8px; border-bottom:1px solid #eee; text-align:left; vertical-align: top; }
    thead { background:#f7f7f7; }
    .pill { display:inline-block; padding:2px 8px; border-radius:999px; color:#fff; font-size:12px; }
    .ok { background:#2e7d32; }
    .bad { background:#c62828; }
    .warn { background:#ef6c00; }
    .info { background:#1565c0; }
    .na { background:#777; }
    .gate { background:#6a1b9a; }
    .wrap { overflow:auto; border:1px solid #ddd; border-radius:8px; }
    input[type="text"] { width:110px; }
    button { margin-left:4px; }
  </style>
</head>
<body>
  <h2>Deal Steps (Live aus DB)</h2>

  <div style="margin: 8px 0; display:flex; gap:8px; align-items:center; flex-wrap: wrap;">
    <label>Deal ID:
      <input id="dealIdInput" style="width:380px;" />
    </label>
    <button id="btnReload">Neu laden</button>
    <span id="statusLine" style="margin-left:8px; color:#555;"></span>
  </div>

  <div class="wrap">
    <table id="stepsTable">
      <thead>
        <tr>
          <th>#</th><th>Titel</th><th>Status</th><th>Gate</th><th>Gate-Status</th>
          <th>Planned Start</th><th>Planned Due</th><th>Actual Done</th><th>Block Reason</th><th>Aktionen</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>

<script>
  // gleiche Origin/Port wie Server
  const API_BASE = "";
  const DEFAULT_DEAL_ID = "81b78c8f-c22c-41ce-8214-9ad8f85db84c";
  const $ = (id) => document.getElementById(id);

  function fmtDate(d) {
    if (!d) return "";
    const dt = new Date(d);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return yyyy + "-" + mm + "-" + dd;
  }

  function pill(text, cls) {
    return '<span class="pill ' + cls + '">' + text + '</span>';
  }

  async function apiGetSteps(dealId) {
    const r = await fetch(API_BASE + "/api/deals/" + dealId + "/steps");
    const j = await r.json();
    if (!j.ok) throw new Error(j.error || "API Fehler");
    return j.steps;
  }

  async function apiMarkDone(dealId, stepNo, actual_done) {
    const r = await fetch(API_BASE + "/api/deals/" + dealId + "/steps/" + stepNo + "/done", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actual_done })
    });
    const j = await r.json();
    if (!j.ok) throw new Error(j.error || "API Fehler");
    return j.steps;
  }

  async function apiSetGate(dealId, stepNo, gate_status) {
    const r = await fetch(API_BASE + "/api/deals/" + dealId + "/steps/" + stepNo + "/gate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gate_status })
    });
    const j = await r.json();
    if (!j.ok) throw new Error(j.error || "API Fehler");
    return j.steps;
  }

  function renderRow(step) {
    const statusP =
      step.status === "Done" ? pill("Done","ok") :
      step.status === "Blocked" ? pill("Blocked","bad") :
      step.status === "In Progress" ? pill("In Progress","info") :
      pill("Open","na");

    const gateP = step.gate_code ? pill(step.gate_code, "gate") : "";

    const gateStatusP =
      step.gate_status === "go" ? pill("go","ok") :
      step.gate_status === "stop" ? pill("stop","bad") :
      step.gate_status === "pending" ? pill("pending","warn") :
      step.gate_status === "optional" ? pill("optional","info") :
      pill("na","na");

    const isHard = step.gate_level === "hard";
    const canStopGo = isHard && step.gate_status !== "na";

    const doneDisabled = step.status === "Blocked" ? "disabled" : "";
    const stopDisabled = canStopGo ? "" : "disabled";
    const goDisabled = canStopGo ? "" : "disabled";

    const doneDate = fmtDate(step.actual_done) || fmtDate(step.planned_due) || "";

    const br = (step.block_reason || "");
    const brSafe = br.replace(/</g,"&lt;").replace(/>/g,"&gt;");

    return \`
      <tr>
        <td>\${step.step_no}</td>
        <td>\${step.title}</td>
        <td>\${statusP}</td>
        <td>\${gateP}</td>
        <td>\${gateStatusP}</td>
        <td>\${fmtDate(step.planned_start)}</td>
        <td>\${fmtDate(step.planned_due)}</td>
        <td>\${fmtDate(step.actual_done)}</td>
        <td style="color:#666;">\${brSafe}</td>
        <td style="white-space:nowrap;">
          <input data-action="doneDate" data-step="\${step.step_no}" type="text" value="\${doneDate}" />
          <button data-action="done" data-step="\${step.step_no}" \${doneDisabled}>Done</button>
          <button data-action="stop" data-step="\${step.step_no}" \${stopDisabled}>STOP</button>
          <button data-action="go" data-step="\${step.step_no}" \${goDisabled}>GO</button>
        </td>
      </tr>\`;
  }

  async function refresh() {
    const dealId = $("dealIdInput").value.trim();
    $("statusLine").textContent = "Lade...";
    try {
      const steps = await apiGetSteps(dealId);
      $("stepsTable").querySelector("tbody").innerHTML = steps.map(renderRow).join("");
      $("statusLine").textContent = "OK – " + steps.length + " Steps geladen";
    } catch (e) {
      console.error(e);
      $("statusLine").textContent = "Fehler: " + e.message;
    }
  }

  document.addEventListener("click", async (ev) => {
    const el = ev.target;
    const action = el && el.getAttribute && el.getAttribute("data-action");
    const stepNoStr = el && el.getAttribute && el.getAttribute("data-step");
    if (!action || !stepNoStr) return;

    const dealId = $("dealIdInput").value.trim();
    const stepNo = parseInt(stepNoStr, 10);

    try {
      $("statusLine").textContent = "Sende...";
      if (action === "done") {
        const input = document.querySelector('input[data-action="doneDate"][data-step="' + stepNo + '"]');
        const dateVal = (input && input.value || "").trim();
        if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(dateVal)) throw new Error("Datum bitte als YYYY-MM-DD");
        await apiMarkDone(dealId, stepNo, dateVal);
      }
      if (action === "stop") await apiSetGate(dealId, stepNo, "stop");
      if (action === "go") await apiSetGate(dealId, stepNo, "go");
      await refresh();
    } catch (e) {
      console.error(e);
      $("statusLine").textContent = "Fehler: " + e.message;
    }
  });

  window.addEventListener("load", () => {
    $("dealIdInput").value = DEFAULT_DEAL_ID;
    $("btnReload").addEventListener("click", refresh);
    refresh();
  });
</script>

</body>
</html>`);
});

/**
 * Step DONE setzen + Replan ab nächstem Step
 * POST /api/deals/:dealId/steps/:stepNo/done
 * Body: { "actual_done": "YYYY-MM-DD" }
 */
app.post("/api/deals/:dealId/steps/:stepNo/done", async (req, res) => {
  try {
    const { dealId, stepNo } = req.params;
    const stepNoInt = parseInt(stepNo, 10);
    const { actual_done } = req.body;

    if (!Number.isInteger(stepNoInt)) {
      return res.status(400).json({ ok: false, error: "stepNo muss eine Zahl sein" });
    }
    if (!actual_done) {
      return res.status(400).json({ ok: false, error: "actual_done fehlt (YYYY-MM-DD)" });
    }

    const result = await updateStepAndReplanPG({
      dealId,
      stepNo: stepNoInt,
      patch: { status: "Done", actual_done },
      triggerReplan: true,
      triggerBlocking: false
    });

    res.json({ ok: true, updated: result.updated, steps: result.steps });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/**
 * Gate setzen + Blocking anwenden
 * POST /api/deals/:dealId/steps/:stepNo/gate
 * Body: { "gate_status": "go" | "stop" | "pending" | "na" | "optional" }
 */
app.post("/api/deals/:dealId/steps/:stepNo/gate", async (req, res) => {
  try {
    const { dealId, stepNo } = req.params;
    const stepNoInt = parseInt(stepNo, 10);
    const { gate_status } = req.body;

    if (!Number.isInteger(stepNoInt)) {
      return res.status(400).json({ ok: false, error: "stepNo muss eine Zahl sein" });
    }
    if (!["go", "stop", "pending", "na", "optional"].includes(gate_status)) {
      return res.status(400).json({ ok: false, error: "gate_status ungueltig" });
    }

    const result = await updateStepAndReplanPG({
      dealId,
      stepNo: stepNoInt,
      patch: { gate_status },
      triggerReplan: false,
      triggerBlocking: true
    });

    res.json({ ok: true, updated: result.updated, steps: result.steps });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/**
 * Steps laden (fuer UI)
 * GET /api/deals/:dealId/steps
 */
app.get("/api/deals/:dealId/steps", async (req, res) => {
  try {
    const { dealId } = req.params;

    const r = await readPool.query(
      `select step_no, title, status, gate_code, gate_level, gate_status,
              block_reason, planned_start, planned_due, actual_done, waiver_reason
       from public.deal_steps
       where deal_id = $1::uuid
       order by step_no asc;`,
      [dealId]
    );

    res.json({ ok: true, steps: r.rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

const PORT = process.env.PORT || 8787;
const server = app.listen(PORT, () => {
  console.log(`API laeuft auf http://localhost:${PORT}`);
  console.log(`UI: http://localhost:${PORT}/ui`);
});

// sauber beenden
process.on("SIGINT", async () => {
  try {
    await readPool.end();
  } catch (_) {}
  server.close(() => process.exit(0));
});
