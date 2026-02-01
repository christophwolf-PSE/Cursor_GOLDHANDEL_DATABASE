// supabase.node.cjs (Node/CommonJS)
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

// Wichtig: URL immer gleich, Key bitte aus .env (nicht im Code hardcoden)
const SUPABASE_URL = process.env.SUPABASE_URL;

// Für Backend ideal: Service Role Key (geheim)
// Fallback: Anon Key (kann wegen RLS evtl. nicht reichen)
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  throw new Error("SUPABASE_URL fehlt in .env");
}
if (!SUPABASE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY oder SUPABASE_ANON_KEY fehlt in .env");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

module.exports = { supabase };
