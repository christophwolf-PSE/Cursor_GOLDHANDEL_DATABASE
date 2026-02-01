/**
 * Checks template_steps content (counts + step_no range + sample rows)
 * Read-only.
 *
 * Requires:
 *   npm i pg dotenv
 *   .env with DATABASE_URL="postgresql://..."
 */

import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const { Client } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env');
  process.exit(1);
}

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();

  // Count rows
  const countRes = await client.query(`select count(*)::int as cnt from public.template_steps;`);
  console.log("template_steps rows:", countRes.rows[0].cnt);

  // step_no stats (if column exists)
  try {
    const stats = await client.query(`
      select
        min(step_no)::int as min_step_no,
        max(step_no)::int as max_step_no,
        count(distinct step_no)::int as distinct_step_no
      from public.template_steps;
    `);
    console.log("step_no stats:", stats.rows[0]);
  } catch (e) {
    console.log("step_no stats: column not found or not numeric:", e.message);
  }

  // If you have a template id column, group by it
  // Common names: template_id, process_template_id
  const possibleCols = ["template_id", "process_template_id", "process_id"];
  let groupCol = null;

  for (const col of possibleCols) {
    const exists = await client.query(
      `select 1 from information_schema.columns
       where table_schema='public' and table_name='template_steps' and column_name=$1 limit 1;`,
      [col]
    );
    if (exists.rowCount > 0) {
      groupCol = col;
      break;
    }
  }

  if (groupCol) {
    const byTpl = await client.query(`
      select ${groupCol}::text as template_key,
             count(*)::int as steps,
             min(step_no)::int as min_no,
             max(step_no)::int as max_no
      from public.template_steps
      group by ${groupCol}
      order by steps desc
      limit 20;
    `);
    console.log(`\nGrouped by ${groupCol} (top 20):`);
    console.table(byTpl.rows);
  } else {
    console.log("\nNo template_id/process_template_id column detected in template_steps.");
  }

  // Show sample rows (first 25 by step_no if possible)
  try {
    const sample = await client.query(`
      select *
      from public.template_steps
      order by step_no asc
      limit 25;
    `);
    console.log("\nSample rows (first 25 by step_no):");
    console.table(sample.rows.map(r => ({
      step_no: r.step_no,
      title: r.title,
      responsible_role: r.responsible_role,
      gate_level: r.gate_level,
      gate_code: r.gate_code
    })));
  } catch {
    const sample = await client.query(`select * from public.template_steps limit 10;`);
    console.log("\nSample rows (first 10):");
    console.table(sample.rows);
  }

  await client.end();
  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
