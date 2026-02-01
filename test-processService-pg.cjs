const { updateStepAndReplanPG } = require("./processService.pg.cjs");

(async () => {
  try {
    const dealId = "81b78c8f-c22c-41ce-8214-9ad8f85db84c";

    const res = await updateStepAndReplanPG({
      dealId,
      stepNo: 12,
      patch: { status: "Done", actual_done: "2026-02-24" },
      triggerReplan: true,
      triggerBlocking: true
    });

    console.log("✅ updated:", res.updated);
    console.log("✅ steps:", res.steps.length);
  } catch (e) {
    console.error("❌ Fehler:", e.message);
    console.error(e.stack);
    process.exit(1);
  }
})();
