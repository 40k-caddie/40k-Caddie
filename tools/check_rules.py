"""Weekly rules check for 40k Caddie.

Reads every army's Wahapedia faction page, pulls the book version from its Books table
(for example "2.8.1 October 2026") and writes rules-status.json, which the app compares
with the versions its rules were taken from. Standard library only.
"""
import html, json, re, sys, time, urllib.request
from datetime import datetime, timezone

APP = open('app.js', encoding='utf-8').read()
pages = json.loads(re.search(r'const FACTION_PAGE = (\{.*?\});', APP).group(1))
slugs = sorted({u.rstrip('/').split('/factions/')[1] for u in pages.values()} | {'space-marines', 'necrons', 'aeldari'})

VER = re.compile(r'(\d+(?:\.\d+)+)\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})')
UA = 'Mozilla/5.0 (compatible; 40kCaddieRulesCheck/1.0; weekly book-version check)'

def text_of(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'text/html'})
    with urllib.request.urlopen(req, timeout=40) as r:
        raw = r.read().decode('utf-8', 'replace')
    raw = re.sub(r'(?is)<(script|style)[^>]*>.*?</\1>', ' ', raw)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', raw)))

try:
    old = json.load(open('rules-status.json', encoding='utf-8'))
except Exception:
    old = {}
found, errors = {}, {}
for slug in slugs:
    url = 'https://wahapedia.ru/wh40k11ed/factions/' + slug + '/'
    try:
        t = text_of(url)
        at = re.search(r'BOOKS|Last update', t, re.I)
        m = VER.search(t[at.start():]) if at else None
        if m:
            found[slug] = f'{m.group(1)} {m.group(2)} {m.group(3)}'
        else:
            errors[slug] = 'no version on page'
    except Exception as e:
        errors[slug] = str(e)[:120]
    time.sleep(2)  # be gentle with Wahapedia

# keep last week's answer for any page that failed this time, so one bad read does not blank an army
for slug, v in (old.get('factions') or {}).items():
    if slug not in found and slug in errors:
        found[slug] = v
out = {'checked': datetime.now(timezone.utc).isoformat(timespec='seconds'), 'factions': dict(sorted(found.items())), 'errors': errors}
json.dump(out, open('rules-status.json', 'w', encoding='utf-8'), indent=1)
print(f'{len(found)} versions, {len(errors)} errors')
if not found:
    sys.exit(1)
