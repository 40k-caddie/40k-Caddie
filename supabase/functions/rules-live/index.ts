// Rules check before a battle: reads an army's Wahapedia faction page now and returns its book version
// (for example "2.8.1 October 2026"). Answers are kept for 6 hours so repeat battles don't re-read the page.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
const VER = /(\d+(?:\.\d+)+)\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/;
const KEEP = 6 * 3600 * 1000;
const cache = new Map<string, { ver: string | null; at: number }>();

async function readVersion(slug: string): Promise<string | null> {
  const hit = cache.get(slug);
  if (hit && Date.now() - hit.at < KEEP) return hit.ver;
  const r = await fetch('https://wahapedia.ru/wh40k11ed/factions/' + slug + '/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; 40kCaddieRulesCheck/1.0; pre-battle book-version check)', Accept: 'text/html' },
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) return null;
  const text = (await r.text()).replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
  const at = text.search(/BOOKS|Last update/i);
  const m = at >= 0 ? VER.exec(text.slice(at)) : null;
  const ver = m ? `${m[1]} ${m[2]} ${m[3]}` : null;
  cache.set(slug, { ver, at: Date.now() });
  return ver;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const { slugs } = await req.json();
    const list = (Array.isArray(slugs) ? slugs : []).filter((s) => typeof s === 'string' && /^[a-z0-9-]{2,40}$/.test(s)).slice(0, 2);
    const versions: Record<string, string | null> = {};
    await Promise.all(list.map(async (s) => { try { versions[s] = await readVersion(s); } catch (_) { versions[s] = null; } }));
    return reply({ versions });
  } catch (_) {
    return reply({ versions: {} }, 400);
  }
});
