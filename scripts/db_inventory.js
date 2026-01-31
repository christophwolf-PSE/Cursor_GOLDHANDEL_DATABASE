/**
 * DB Inventory for Supabase Postgres (safe read-only)
 * - Lists schemas/tables/views
 * - Lists columns for key tables
 * - Tries to detect "deals" and "steps" table candidates
 *
 * Usage:
 *   1) npm init -y
 *   2) npm i pg dotenv
 *   3) create .env with DATABASE_URL="postgresql://..."
 *   4) node scripts/db_inventory.js
 */

const fs = require("fs");
const path = require("path");
const process = require("process");
const dotenv = require("dotenv");
const pg = require("pg");

dotenv.config();

const { Client } = pg;

function die(msg) {
  console.error("\n❌ " + msg + "\n");
  process.exit(1);
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  die(
    `DATABASE_URL missing. Create .env with:
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/postgres"
`
  );
}

const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function q(sql, params = []) {
  const res = await client.query(sql, params);
  return res.rows;
}

function toCSV(rows) {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]);
  const escape = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (/[,"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [cols.join(",")];
  for (const r of rows) lines.push(cols.map((c) => escape(r[c])).join(","));
  return lines.join("\n");
}

async function main() {
  await client.connect();

  console.log("✅ Connected.\n");

  // 1) Schemas
  const schemas = await q(`
    select schema_name
    from information_schema.schemata
    where schema_name not in ('pg_catalog','information_schema')
    order by schema_name;
  `);
  console.log("== Schemas ==");
  console.table(schemas);

  // 2) Tables + views
  const rels = await q(`
    select
      table_schema,
      table_name,
      table_type
    from information_schema.tables
    where table_schema not in ('pg_catalog','information_schema')
    order by table_schema, table_type, table_name;
  `);
  console.log("\n== Tables / Views ==");
  console.table(rels);

  // 3) Candidate tables for deals/steps (heuristic)
  const candidates = await q(`
    select table_schema, table_name
    from information_schema.tables
    where table_schema not in ('pg_catalog','information_schema')
      and table_type='BASE TABLE'
      and (
        lower(table_name) like '%deal%' or
        lower(table_name) like '%trade%' or
        lower(table_name) like '%order%' or
        lower(table_name) like '%step%' or
        lower(table_name) like '%process%' or
        lower(table_name) like '%risk%' or
        lower(table_name) like '%contact%' or
        lower(table_name) like '%document%' or
        lower(table_name) like '%attachment%'
      )
    order by table_schema, table_name;
  `);
  console.log("\n== Candidate domain tables (heuristic) ==");
  console.table(candidates);

  // 4) Columns for candidates
  const cols = await q(`
    select
      table_schema,
      table_name,
      column_name,
      data_type,
      is_nullable
    from information_schema.columns
    where table_schema not in ('pg_catalog','information_schema')
    order by table_schema, table_name, ordinal_position;
  `);

  // Save full columns inventory
  fs.mkdirSync("out", { recursive: true });
  fs.writeFileSync("out/db_columns_inventory.csv", toCSV(cols), "utf8");
  console.log("\n📄 Wrote out/db_columns_inventory.csv (all columns).");

  // 5) Show columns for candidate tables only (quick view)
  const candidateSet = new Set(candidates.map((c) => `${c.table_schema}.${c.table_name}`));
  const filtered = cols.filter((c) => candidateSet.has(`${c.table_schema}.${c.table_name}`));
  console.log("\n== Columns for candidate tables ==");
  // print in chunks to avoid huge console spam
  const grouped = {};
  for (const r of filtered) {
    const k = `${r.table_schema}.${r.table_name}`;
    grouped[k] ??= [];
    grouped[k].push({ column: r.column_name, type: r.data_type, nullable: r.is_nullable });
  }
  for (const [k, arr] of Object.entries(grouped)) {
    console.log(`\n-- ${k} --`);
    console.table(arr);
  }

  // 6) Try to detect if "steps" stored as JSON in a deal table
  // Look for json/jsonb columns named like steps/process/flow in candidate deal tables
  const jsonCols = filtered.filter(
    (c) =>
      (c.data_type === "json" || c.data_type === "jsonb") &&
      /step|steps|process|flow|workflow/i.test(c.column_name)
  );
  console.log("\n== JSON/JSONB columns that look like steps/workflow ==");
  console.table(jsonCols);

  await client.end();
  console.log("\n✅ Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
