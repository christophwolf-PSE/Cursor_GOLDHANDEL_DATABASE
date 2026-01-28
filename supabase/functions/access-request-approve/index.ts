import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const { request_id, action, admin_email } = await req.json();
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ ok: false, message: 'Service role not configured' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!request_id || !action) {
      return new Response(JSON.stringify({ ok: false, message: 'Missing request_id/action' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { data: request, error } = await supabase
      .from('access_requests')
      .select('*')
      .eq('id', request_id)
      .single();

    if (error || !request) {
      return new Response(JSON.stringify({ ok: false, message: 'Request not found' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'approve') {
      await supabase.auth.admin.inviteUserByEmail(request.email);
      await supabase
        .from('access_requests')
        .update({ status: 'APPROVED', approved_at: new Date().toISOString(), approved_by: admin_email || null })
        .eq('id', request_id);
    } else if (action === 'reject') {
      await supabase
        .from('access_requests')
        .update({ status: 'REJECTED', rejected_at: new Date().toISOString(), approved_by: admin_email || null })
        .eq('id', request_id);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, message: String(err) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
