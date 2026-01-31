/**
 * Project Scanner (safe read-only)
 * - Finds probable table names in code/SQL
 * - Looks for supabase.from('...') usage
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const EXCLUDE_DIRS = new Set(['node_modules', '.git', 'out']);
const INCLUDE_EXT = new Set(['.js', '.ts', '.jsx', '.tsx', '.sql', '.md']);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), out);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (INCLUDE_EXT.has(ext)) out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

function addHit(map, key, file, line) {
  if (!map[key]) map[key] = [];
  map[key].push({ file, line });
}

const files = walk(ROOT);

const tableHits = {};
const supabaseHits = {};

const supabaseFromRe = /\.from\(\s*['"]([a-zA-Z0-9_\.]+)['"]\s*\)/g;
const sqlFromRe = /\bfrom\s+([a-zA-Z0-9_\.]+)/gi;
const sqlJoinRe = /\bjoin\s+([a-zA-Z0-9_\.]+)/gi;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    let m;
    while ((m = supabaseFromRe.exec(line))) {
      addHit(supabaseHits, m[1], file, i + 1);
      addHit(tableHits, m[1], file, i + 1);
    }

    while ((m = sqlFromRe.exec(line))) {
      addHit(tableHits, m[1], file, i + 1);
    }

    while ((m = sqlJoinRe.exec(line))) {
      addHit(tableHits, m[1], file, i + 1);
    }
  }
}

function printGrouped(title, map) {
  const keys = Object.keys(map).sort();
  console.log(`\n== ${title} ==`);
  for (const key of keys) {
    console.log(`\n-- ${key} --`);
    for (const hit of map[key]) {
      console.log(`${path.relative(ROOT, hit.file)}:${hit.line}`);
    }
  }
}

printGrouped('Supabase .from() tables', supabaseHits);
printGrouped('All table-like references (from/join + supabase)', tableHits);
