require("dotenv").config({ quiet: true });
const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL fehlt in .env");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function updateStepAndReplanPG({
  dealId,
  stepNo,
  patch,
  triggerReplan = true,
  triggerBlocking = true
}) {
  if (!dealId) throw new Error("dealId fehlt");
  if (!Number.isInteger(stepNo)) throw new Error("stepNo muss Integer sein");
  if (!patch || typeof patch !== "object") throw new Error("patch muss Objekt sein");

  const allowed = new Set([
    "status",
    "actual_done",
    "gate_status",
    "done_at",
    "done_by",
    "verification_note",
    "verified_at",
    "verified_by"
  ]);

  const keys = Object.keys(patch).filter(k => allowed.has(k));
  if (keys.length === 0) throw new Error("patch enthält keine erlaubten Felder");

  const setSql = keys.map((k, i) => `"${k}" = $${i + 1}`).join(", ");
  const values = keys.map(k => patch[k]);

  const client = await pool.connect();
  try {
    await client.query("begin");

    const sqlUpdate = `
      update public.deal_steps
      set ${setSql}, updated_at = now()
      where deal_id = $${keys.length + 1}::uuid
        and step_no = $${keys.length + 2}::int
      returning id, deal_id, step_no, status, actual_done, gate_status, gate_code;
    `;

    const updRes = await client.query(sqlUpdate, [...values, dealId, stepNo]);
    if (updRes.rowCount !== 1) {
      throw new Error("Kein Step aktualisiert (deal_id/step_no prüfen)");
    }

    const updated = updRes.rows[0];

    if (triggerReplan) {
      await client.query(
        "select public.replan_from_step($1::uuid, $2::int, $3::boolean);",
        [dealId, stepNo + 1, true]
      );
    }

    if (triggerBlocking) {
      await client.query("select public.apply_gate_blocking($1::uuid);", [dealId]);
    }

    await client.query("commit");

    const stepsRes = await client.query(
      `select step_no, title, status, gate_code, gate_level, gate_status,
              block_reason, planned_start, planned_due, actual_done, waiver_reason
       from public.deal_steps
       where deal_id = $1::uuid
       order by step_no asc;`,
      [dealId]
    );

    return { updated, steps: stepsRes.rows };
  } catch (e) {
    await client.query("rollback");
    throw e;
  } finally {
    client.release();
  }
}

module.exports = { updateStepAndReplanPG };
