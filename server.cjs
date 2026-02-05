require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");
const { updateStepAndReplanPG } = require("./processService.pg.cjs");

const app = express();
app.use(cors());
app.use(express.json());

function getActor(req) {
  return req.get("x-actor") || req.get("x-user") || null;
}

function getIp(req) {
  const xfwd = req.headers["x-forwarded-for"];
  if (xfwd) return String(xfwd).split(",")[0].trim();
  return req.ip || (req.socket && req.socket.remoteAddress) || null;
}

// Ein Pool für reine Read-Queries (Steps-Laden)
const readPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function auditLogPG({
  dealId,
  stepNo,
  action,
  actor,
  reason,
  payload,
  ip,
  userAgent
}) {
  try {
    await readPool.query(
      `insert into public.deal_step_audit
       (deal_id, step_no, action, actor, reason, payload, ip, user_agent)
       values ($1::uuid, $2::int, $3::text, $4::text, $5::text, $6::jsonb, $7::text, $8::text);`,
      [
        dealId,
        stepNo,
        action,
        actor,
        reason,
        JSON.stringify(payload || {}),
        ip,
        userAgent
      ]
    );
  } catch (e) {
    console.error("auditLogPG failed:", e.message);
  }
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

/**
 * UI (ohne index.html anfassen)
 * http://localhost:8787/ui
 */
app.get("/ui", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ui.html"));
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

    await auditLogPG({
      dealId,
      stepNo: stepNoInt,
      action: "DONE",
      actor: getActor(req),
      reason: null,
      payload: { actual_done },
      ip: getIp(req),
      userAgent: req.get("user-agent")
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
/**
 * Step wieder öffnen (auditfähig)
 * POST /api/deals/:dealId/steps/:stepNo/reopen
 * Body: { "reason": "Pflichtbegründung" }
 */
app.post("/api/deals/:dealId/steps/:stepNo/reopen", async (req, res) => {
  try {
    const { dealId, stepNo } = req.params;
    const stepNoInt = parseInt(stepNo, 10);
    const { reason } = req.body;

    if (!Number.isInteger(stepNoInt)) {
      return res.status(400).json({ ok: false, error: "stepNo muss eine Zahl sein" });
    }
    const reasonTrim = String(reason || "").trim();
    if (!reasonTrim || reasonTrim.length < 5) {
      return res.status(400).json({ ok: false, error: "reason fehlt (mind. 5 Zeichen)" });
    }

    const result = await updateStepAndReplanPG({
      dealId,
      stepNo: stepNoInt,
      patch: {
        status: "Open",
        actual_done: null,
        verification_note: "REOPEN: " + reasonTrim
      },
      triggerReplan: true,
      triggerBlocking: false
    });

    await auditLogPG({
      dealId,
      stepNo: stepNoInt,
      action: "REOPEN",
      actor: getActor(req),
      reason: reasonTrim,
      payload: { reason: reasonTrim },
      ip: getIp(req),
      userAgent: req.get("user-agent")
    });

    res.json({ ok: true, updated: result.updated, steps: result.steps });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});



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

    await auditLogPG({
      dealId,
      stepNo: stepNoInt,
      action: "GATE",
      actor: getActor(req),
      reason: null,
      payload: { gate_status },
      ip: getIp(req),
      userAgent: req.get("user-agent")
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

/**
 * Audit-Events laden
 * GET /api/deals/:dealId/audit?limit=200
 */
app.get("/api/deals/:dealId/audit", async (req, res) => {
  try {
    const { dealId } = req.params;
    const limitRaw = parseInt(req.query.limit, 10);
    const limit = Number.isInteger(limitRaw) ? Math.min(Math.max(limitRaw, 1), 500) : 200;

    const r = await readPool.query(
      `select ts, step_no, action, actor, reason
       from public.deal_step_audit
       where deal_id = $1::uuid
       order by ts desc
       limit $2;`,
      [dealId, limit]
    );

    res.json({ ok: true, events: r.rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});


// UI2 aus Datei (mit REOPEN)
app.get("/ui2", (req, res) => {
  res.sendFile(path.join(__dirname, "ui2.html"));
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
