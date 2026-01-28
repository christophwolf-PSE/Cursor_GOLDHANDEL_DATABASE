import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

serve(async (req) => {
  try {
    const { request_id, email, full_name, company, note } = await req.json();
    const adminEmail = Deno.env.get('ACCESS_REQUEST_ADMIN_EMAIL');
    const resendKey = Deno.env.get('RESEND_API_KEY');
    const from = Deno.env.get('EMAIL_FROM');

    if (!adminEmail || !resendKey || !from) {
      return new Response(JSON.stringify({ ok: false, message: 'Email not configured' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = {
      from,
      to: [adminEmail],
      subject: 'Neue Zugriffsanfrage',
      html: `
        <p>Neue Zugriffsanfrage:</p>
        <ul>
          <li>Name: ${full_name || '-'} </li>
          <li>E-Mail: ${email || '-'} </li>
          <li>Firma: ${company || '-'} </li>
          <li>Nachricht: ${note || '-'} </li>
          <li>Request ID: ${request_id || '-'} </li>
        </ul>
      `
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendKey}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(JSON.stringify({ ok: false, message: text }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
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
