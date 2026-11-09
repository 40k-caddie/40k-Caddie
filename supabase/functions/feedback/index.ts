// Feedback: bug reports and requests sent from the app's vessel. Saves each one to the feedback table
// and, when RESEND_API_KEY and FEEDBACK_TO are set in this function's secrets, emails it to the owner.
import { createClient } from 'npm:@supabase/supabase-js@2.118.0';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
const KINDS = ['bug', 'idea', 'other'];
const cut = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : null);
// a few reports per address every ten minutes is plenty for a person; more is a script
const recent = new Map<string, number[]>();

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
    const now = Date.now();
    const hits = (recent.get(ip) || []).filter((t) => now - t < 600000);
    if (hits.length >= 5) return reply({ ok: false, why: 'Too many reports in a short time. Try again in a few minutes.' }, 429);
    const b = await req.json().catch(() => ({}));
    const text = cut(b.text, 4000);
    if (!text || text.length < 3) return reply({ ok: false, why: 'Write a few words first.' }, 400);
    const kind = KINDS.includes(b.kind) ? b.kind : 'other';

    const url = Deno.env.get('SUPABASE_URL')!;
    const sb = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
    const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    let user: { id: string; email?: string | null } | null = null;
    if (token.split('.').length === 3) { try { const { data } = await sb.auth.getUser(token); user = data && data.user ? data.user : null; } catch (_) { user = null; } }

    const row = {
      kind, body: text, screen: cut(b.screen, 40), army: cut(b.army, 60), faction: cut(b.faction, 80), app_version: cut(b.version, 20),
      ua: cut(req.headers.get('user-agent'), 300), user_id: user ? user.id : null, user_email: user && user.email ? user.email : null,
    };
    const { data: saved, error } = await sb.from('feedback').insert(row).select('id').single();
    if (error) return reply({ ok: false, why: 'Could not save the report.' }, 500);
    hits.push(now); recent.set(ip, hits);

    const key = Deno.env.get('RESEND_API_KEY'); const to = Deno.env.get('FEEDBACK_TO');
    if (key && to) {
      const subject = `[40k Caddie] ${kind === 'bug' ? 'Bug' : kind === 'idea' ? 'Idea' : 'Feedback'} #${saved.id}: ${text.replace(/\s+/g, ' ').slice(0, 60)}`;
      const lines = [text, '', `Kind: ${kind}`, `Screen: ${row.screen || '-'}`, `Army: ${row.army || '-'} (${row.faction || '-'})`, `Version: ${row.app_version || '-'}`, `From: ${row.user_email || 'not signed in'}`, `Device: ${row.ua || '-'}`];
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: Deno.env.get('FEEDBACK_FROM') || '40k Caddie <onboarding@resend.dev>', to: [to], subject, text: lines.join('\n') }),
          signal: AbortSignal.timeout(8000),
        });
      } catch (_) { /* the report is saved either way */ }
    }
    return reply({ ok: true, id: saved.id });
  } catch (_) {
    return reply({ ok: false, why: 'Could not send the report.' }, 400);
  }
});
