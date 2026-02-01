const path = require("path");

// 1) Prozessservice laden
let updateStepAndReplan;
try {
  ({ updateStepAndReplan } = require(path.join(__dirname, "processService.cjs")));
  console.log("✅ processService.cjs geladen");
} catch (e) {
  console.error("❌ Konnte processService.cjs nicht laden:", e.message);
  process.exit(1);
}

// 2) Supabase laden (bitte ggf. Pfad anpassen!)
let supabase;
try {
  // WICHTIG:
  // - Wenn eure Datei "supabase.js" im gleichen Ordner liegt, dann ist "./supabase" korrekt.
  // - Wenn sie woanders liegt: Pfad anpassen, z.B. "./src/supabase" oder "./lib/supabase"
  const supabaseModule = require(path.join(__dirname, "supabase"));

  // Variante 1: module.exports = { supabase }
  // Variante 2: module.exports = supabase
  supabase = supabaseModule.supabase || supabaseModule;

  console.log("✅ supabase client geladen");
} catch (e) {
  console.error("❌ Konnte supabase nicht laden (Pfad falsch?):", e.message);
  console.error("   -> Bitte Pfad in test-processService.cjs anpassen.");
  process.exit(1);
}

// 3) Grundcheck
console.log("supabase typeof:", typeof supabase);
console.log("supabase.from typeof:", typeof (supabase && supabase.from));

(async () => {
  try {
    const dealId = "81b78c8f-c22c-41ce-8214-9ad8f85db84c";
    const stepNo = 12;

    const res = await updateStepAndReplan(supabase, {
      dealId,
      stepNo,
      patch: { status: "Done", actual_done: "2026-02-24" },
      triggerReplan: true,
      triggerBlocking: true
    });

    console.log("✅ OK, updated:", res.updated);
    console.log("✅ steps length:", res.steps?.length);
  } catch (e) {
    console.error("❌ Laufzeitfehler:", e.message);
    console.error(e.stack);
    process.exit(1);
  }
})();
