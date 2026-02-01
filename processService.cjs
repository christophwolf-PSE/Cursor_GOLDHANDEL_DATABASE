// processService.cjs

async function updateStepAndReplan(supabase, {
  dealId,
  stepNo,
  patch,
  triggerReplan = true,
  triggerBlocking = true
}) {
  if (!dealId) throw new Error("dealId fehlt");
  if (!Number.isInteger(stepNo)) throw new Error("stepNo muss Integer sein");
  if (!patch || typeof patch !== "object") throw new Error("patch muss Objekt sein");
  if (!supabase || typeof supabase.from !== "function") {
    throw new Error("supabase client fehlt oder ist nicht korrekt initialisiert");
  }

  // 1) Step aktualisieren
  const { data: updated, error: updErr } = await supabase
    .from("deal_steps")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("deal_id", dealId)
    .eq("step_no", stepNo)
    .select("id, deal_id, step_no, status, actual_done, gate_status, gate_code")
    .single();

  if (updErr) throw new Error(`deal_steps update failed: ${updErr.message}`);
  if (!updated) throw new Error("Kein Step aktualisiert (deal_id/step_no prüfen)");

  // 2) Replan ab nächstem Step
  if (triggerReplan) {
    const { error: rpErr } = await supabase.rpc("replan_from_step", {
      p_deal_id: dealId,
      p_from_step_no: stepNo + 1,
      p_use_actual: true
    });
    if (rpErr) throw new Error(`replan_from_step failed: ${rpErr.message}`);
  }

  // 3) Gate-Blocking anwenden
  if (triggerBlocking) {
    const { error: gbErr } = await supabase.rpc("apply_gate_blocking", {
      p_deal_id: dealId
    });
    if (gbErr) throw new Error(`apply_gate_blocking failed: ${gbErr.message}`);
  }

  // 4) Steps neu laden (UI Refresh)
  const { data: steps, error: stepsErr } = await supabase
    .from("deal_steps")
    .select("step_no,title,status,gate_code,gate_level,gate_status,block_reason,planned_start,planned_due,actual_done,waiver_reason")
    .eq("deal_id", dealId)
    .order("step_no", { ascending: true });

  if (stepsErr) throw new Error(`fetch deal_steps failed: ${stepsErr.message}`);

  return { updated, steps };
}

module.exports = { updateStepAndReplan };
