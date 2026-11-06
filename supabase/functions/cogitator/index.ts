// The Cogitator: answers rules and tactics questions about the battle in front of you.
// Runs on Supabase. The Anthropic key lives in this function's secrets and never reaches a phone.
import { createClient } from 'npm:@supabase/supabase-js@2.118.0';

const MODEL = 'claude-sonnet-5-5';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

const SYSTEM = `You are the Cogitator, a Warhammer 40,000 11th edition rules and tactics coach inside the 40k Caddie app, used at the table mid-game on a phone.
You are given the current game state and the rules data for both armies (datasheets, detachment rules and stratagems) from Wahapedia.
- Answer from that data. Name stratagems exactly, with their CP cost and when they can be used, and check the player has the CP.
- Be practical: what to do now, in this phase, with these units. Lead with the answer, then a short why.
- Keep it short enough to read at the table: a few sentences or a short list. No headings. No em dashes.
- If the rules data given does not cover something, say so plainly rather than guessing, and suggest checking the core rules or the datasheet.
- "My" or "I" means the person asking. "They" or "their" means the opponent.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const sb = createClient(url, service, { auth: { persistSession: false } });
    const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    const { data: who } = await sb.auth.getUser(token);
    const user = who && who.user;
    if (!user || user.is_anonymous || !user.email) return reply({ allowed: false, why: 'Sign in with Google to use the Cogitator.' }, 401);
    const email = user.email.toLowerCase();
    const { data: row } = await sb.from('cogitator_users').select('daily_limit').eq('email', email).maybeSingle();
    if (!row) return reply({ allowed: false, why: 'The Cogitator is not switched on for your account yet.' }, 403);

    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const { count } = await sb.from('cogitator_log').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('at', since);
    const used = count || 0; const limit = row.daily_limit;
    const left = limit === null ? null : Math.max(0, limit - used);

    const body = await req.json().catch(() => ({}));
    if (body.check) return reply({ allowed: true, left, limit });
    if (left === 0) return reply({ allowed: true, left: 0, why: `That is your ${limit} questions for the last 24 hours. More free up as the day rolls on.` }, 429);

    const question = String(body.question || '').slice(0, 2000).trim();
    if (!question) return reply({ error: 'Ask a question.' }, 400);
    const context = String(body.context || '').slice(0, 120000);
    const history = Array.isArray(body.history) ? body.history.slice(-6) : [];
    const messages = [
      ...history.flatMap((h: { q: string; a: string }) => [{ role: 'user', content: String(h.q).slice(0, 2000) }, { role: 'assistant', content: String(h.a).slice(0, 4000) }]),
      { role: 'user', content: `<game>\n${context}\n</game>\n\n${question}` },
    ];
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: MODEL, max_tokens: 900, system: SYSTEM, messages }),
    });
    const out = await r.json();
    if (!r.ok) return reply({ error: 'The Cogitator could not answer (' + ((out.error && out.error.message) || r.status) + ').' }, 502);
    const answer = (out.content || []).filter((c: { type: string }) => c.type === 'text').map((c: { text: string }) => c.text).join('\n').trim();
    await sb.from('cogitator_log').insert({ user_id: user.id, email, question: question.slice(0, 500), tokens_in: out.usage && out.usage.input_tokens, tokens_out: out.usage && out.usage.output_tokens });
    return reply({ answer, left: left === null ? null : left - 1 });
  } catch (e) {
    return reply({ error: 'The Cogitator hit a fault: ' + (e instanceof Error ? e.message : String(e)) }, 500);
  }
});
