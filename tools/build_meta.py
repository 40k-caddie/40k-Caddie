"""Chasing the meta: weekly summary for Footfall. Standard library only.

1. 40k-analytics "faction balance" report (static page on GitHub Pages): each army's 11th edition
   win rate, games and rank, and for each unit the share of lists it is in and its effect on win rate.
2. Competitive Innovations (Tabletop Battles): the full lists of top finishers at recent events.
   Counts how many of an army's recent winning lists include each unit.
Only numbers are kept. Writes footfall/meta.json.

Usage: python build_meta.py [analytics_html_file]
"""
import html, json, re, sys, time, urllib.request
from datetime import datetime, timedelta, timezone

UA = 'Mozilla/5.0 (compatible; 40kCaddieMeta/1.0; weekly meta summary for a free fan app)'
ANALYTICS = 'https://40k-analytics.github.io/stateofthegame/'
CI_SEARCH = 'https://www.tabletopbattles.com/?s=competitive+innovations+in+11th'
WEEKS = 8


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode('utf-8', 'replace')


def text(s):
    s = re.sub(r'(?is)<(script|style|svg)[^>]*>.*?</\1>', ' ', s)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()


def num(s):
    s = (s or '').replace(',', '').replace('%', '').replace('+', '').strip()
    m = re.match(r'-?[\d.]+', s)
    return float(m.group(0)) if m else None


def norm(n):
    return re.sub(r'[^a-z0-9]+', ' ', n.lower().replace('’', "'")).strip()


# ---------- 1. faction balance ----------
def analytics(page):
    out = {}
    m = re.search(r'games from ([^:]+?) to ([^:]+?): ([\d,]+) matches from ([\d,]+) events', page)
    info = {'url': ANALYTICS, 'period': f'{m.group(1)} to {m.group(2)}' if m else '', 'matches': int(m.group(3).replace(',', '')) if m else None}
    up = re.search(r'updated (\d{1,2} \w+ \d{4})', page)
    info['updated'] = up.group(1) if up else ''
    for sec in re.split(r'<section class="sec[^"]*" data-faction="', page)[1:]:
        fid = sec[:sec.find('"')]
        h2 = re.search(r'<h2[^>]*>(.*?)</h2>', sec, re.S)
        name = text(h2.group(1)) if h2 else fid
        t = text(sec[:60000])
        w = re.search(r'([\d.]+)% win rate, rank (\d+) of (\d+)\s+([\d,]+) games\s+([\d,]+) lists', t)
        rec = {'win': float(w.group(1)), 'rank': int(w.group(2)), 'of': int(w.group(3)), 'games': int(w.group(4).replace(',', '')), 'lists': int(w.group(5).replace(',', ''))} if w else {}
        units = {}
        for head in ('Most played units', 'Other units with a clear effect'):
            i = sec.find(head)
            if i < 0:
                continue
            j = sec.find('</table>', i)
            for row in re.findall(r'<tr>(.*?)</tr>', sec[i:j], re.S):
                tds = [text(x) for x in re.findall(r'<td[^>]*>(.*?)</td>', row, re.S)]
                if len(tds) < 4:
                    continue
                eff = re.match(r'([+-]?[\d.]+)\s*±\s*([\d.]+)', tds[3])
                units[tds[0]] = {'lists': int(num(tds[1]) or 0), 'pct': num(tds[2]), 'eff': float(eff.group(1)) if eff else None, 'err': float(eff.group(2)) if eff else None, 'z': num(tds[4]) if len(tds) > 4 else None}
        rec['units'] = units
        out[name] = rec
    return info, out


# ---------- 2. recent winning lists ----------
UNIT = re.compile(r'^(.+?) \((\d+) (?:points|pts)\)$', re.I)
SIZE = re.compile(r'^(incursion|strike force|onslaught)\b', re.I)
MONTHS = 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec'
CI_TAG = 'https://www.tabletopbattles.com/tag/competitive-innovations'


def ci_articles():
    urls = []
    cat = 'https://www.tabletopbattles.com/category/columns/40k-competitive-innovations'
    for src in (CI_TAG, cat, CI_TAG + '/page/2', cat + '/page/2', CI_TAG + '?page=2', cat + '?page=2'):
        try:
            page = get(src); time.sleep(1)
        except Exception:
            continue
        for u in re.findall(r'href="(?:https://www\.tabletopbattles\.com)?(/40k-competitive-innovations-in-11th[^"#?]*)"', page):
            u = 'https://www.tabletopbattles.com' + u.rstrip('/')
            if u not in urls:
                urls.append(u)
    print('articles found:', len(urls))
    return urls[:24]


def ci_lists(page):
    """Each placed list in an article: a heading "Player - Army (detachments) - Disposition - 1st Place" and its list."""
    out = []
    for m in re.finditer(r'<h2>(.*?)</h2>(.*?)(?=<h2>|$)', page, re.S):
        head = text(m.group(1)); body = m.group(2)
        parts = [x.strip() for x in head.split(' - ')]
        if len(parts) < 3 or not re.search(r'(?i)place|winner|finalist', parts[-1]):
            continue
        eb = body.find('expandBody')
        if eb < 0:
            continue
        chunk = re.sub(r'(?i)<br\s*/?>|</p>|</div>', '\n', body[eb:])
        lines = [html.unescape(re.sub(r'<[^>]+>', '', l)).replace('\xa0', ' ').strip() for l in chunk.split('\n')]
        units = []
        sized = any(SIZE.match(l) for l in lines)
        seen_size = False
        for l in lines:
            if l.startswith('Exported with'):
                break
            if SIZE.match(l):
                seen_size = True; continue
            u = UNIT.match(l)
            # the list's own title line sits above the battle size; skip it
            if u and not l.startswith(('•', '-')) and (seen_size or not sized):
                units.extend(x.strip() for x in re.sub(r'^\d+x\s+', '', u.group(1).strip()).split(' + ') if x.strip())  # "Leader + Bodyguard" lines hold two units
        if len(units) >= 3:
            out.append({'army': parts[1].split(' (')[0].strip(), 'place': parts[-1], 'units': units})
    return out


def main():
    now = datetime.now(timezone.utc)
    try:
        page = open(sys.argv[1], encoding='utf-8').read() if len(sys.argv) > 1 else get(ANALYTICS)
        info, facs = analytics(page)
    except Exception as e:
        print('analytics failed:', e); info, facs = {'url': ANALYTICS, 'error': str(e)[:200]}, {}
    meta = {'built': now.isoformat(timespec='seconds'), 'analytics': info, 'factions': facs, 'winning': {}, 'ci': {'articles': []}}
    names = list(facs.keys())
    try:
        arts = ci_articles()
        for u in arts:
            try:
                p = get(u); time.sleep(2)
            except Exception as e:
                print('article failed', u, e); continue
            dm = re.search(r'(' + MONTHS + r') (\d{2}) (\d{4})', p)
            when = datetime.strptime(' '.join(dm.groups()), '%b %d %Y').replace(tzinfo=timezone.utc) if dm else None
            if when and when < now - timedelta(weeks=WEEKS):
                continue
            when = when.date().isoformat() if when else ''
            title = re.search(r'<title>(.*?)</title>', p, re.S)
            got = ci_lists(p)
            meta['ci']['articles'].append({'url': u, 'date': when, 'title': html.unescape(title.group(1)).split(' - ')[0].strip() if title else u, 'lists': len(got)})
            for L in got:
                a = norm(L['army'])
                fac = next((n for n in names if norm(n) == a), None) or next((n for n in names if norm(n).rstrip('s') == a.rstrip('s')), None)
                if not fac:
                    continue
                w = meta['winning'].setdefault(fac, {'lists': 0, 'units': {}})
                w['lists'] += 1
                for un in set(L['units']):
                    w['units'][un] = w['units'].get(un, 0) + 1
    except Exception as e:
        print('competitive innovations failed:', e); meta['ci']['error'] = str(e)[:200]
    # if a source failed or its page changed shape, keep last week's numbers and say how old they are
    try:
        old = json.load(open('footfall/meta.json', encoding='utf-8'))
    except Exception:
        old = {}
    meta['status'] = {}
    if len(meta['factions']) < 10 and old.get('factions'):
        meta['factions'] = old['factions']; meta['analytics'] = old.get('analytics', meta['analytics'])
        meta['status']['analytics'] = {'kept': True, 'since': (old.get('status', {}).get('analytics') or {}).get('since') or old.get('built', '')[:10]}
    else:
        meta['status']['analytics'] = {'kept': False, 'since': now.date().isoformat()}
    if not meta['winning'] and old.get('winning'):
        meta['winning'] = old['winning']; meta['ci'] = old.get('ci', meta['ci'])
        meta['status']['ci'] = {'kept': True, 'since': (old.get('status', {}).get('ci') or {}).get('since') or old.get('built', '')[:10]}
    else:
        meta['status']['ci'] = {'kept': False, 'since': now.date().isoformat()}
    json.dump(meta, open('footfall/meta.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print(f"{len(facs)} factions, {sum(len(f.get('units', {})) for f in facs.values())} unit rows, {len(meta['ci']['articles'])} articles, "
          f"{sum(w['lists'] for w in meta['winning'].values())} winning lists")


if __name__ == '__main__':
    main()
