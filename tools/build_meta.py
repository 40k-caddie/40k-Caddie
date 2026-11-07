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


def ci_articles():
    page = get(CI_SEARCH)
    urls = []
    for u in re.findall(r'href="(https://www\.tabletopbattles\.com/[^"#?]*competitive-innovations-in-11th[^"#?]*)"', page):
        u = u.rstrip('/')
        if u not in urls:
            urls.append(u)
    return urls[:12]


def ci_lists(page):
    """Each list in an article: (faction, [unit names]). Lists are printed as exported text from the 40k app or New Recruit."""
    body = re.sub(r'(?i)<br\s*/?>', '\n', page)
    body = re.sub(r'(?i)</(p|div|li|h\d|pre|code)>', '\n', body)
    lines = [html.unescape(re.sub(r'<[^>]+>', '', l)).replace('\xa0', ' ').rstrip() for l in body.split('\n')]
    lists, cur = [], None
    for raw in lines:
        l = raw.strip()
        if not l:
            continue
        if re.search(r'\(\s*\d[\d,]*\s*(?:points|pts)\s*\)\s*$', l, re.I) and cur is None:
            cur = {'head': [l], 'units': []}
            continue
        if cur is None:
            continue
        if l.startswith('Exported with') or re.match(r'(?i)^(data version|exported)', l):
            lists.append(cur); cur = None; continue
        m = UNIT.match(l)
        if m and not l.startswith(('•', '-', '◦')):
            cur['units'].append(m.group(1).strip())
        elif len(cur['head']) < 8 and not cur['units']:
            cur['head'].append(l)
        if len(cur['units']) > 40:
            lists.append(cur); cur = None
    if cur and cur['units']:
        lists.append(cur)
    return [x for x in lists if len(x['units']) >= 3]


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
            dm = re.search(r'"datePublished"\s*:\s*"([^"]+)"', p)
            when = dm.group(1)[:10] if dm else ''
            if when and datetime.fromisoformat(when).replace(tzinfo=timezone.utc) < now - timedelta(weeks=WEEKS):
                continue
            title = re.search(r'<title>(.*?)</title>', p, re.S)
            got = ci_lists(p)
            meta['ci']['articles'].append({'url': u, 'date': when, 'title': html.unescape(title.group(1)).split(' - ')[0].strip() if title else u, 'lists': len(got)})
            for L in got:
                head = ' '.join(L['head'])
                fac = next((n for n in sorted(names, key=len, reverse=True) if norm(n) in norm(head)), None)
                if not fac:
                    fac = next((n for n in names if norm(n).rstrip('s') in norm(head)), None)
                if not fac:
                    continue
                w = meta['winning'].setdefault(fac, {'lists': 0, 'units': {}})
                w['lists'] += 1
                for un in set(L['units']):
                    w['units'][un] = w['units'].get(un, 0) + 1
    except Exception as e:
        print('competitive innovations failed:', e); meta['ci']['error'] = str(e)[:200]
    json.dump(meta, open('footfall/meta.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print(f"{len(facs)} factions, {sum(len(f.get('units', {})) for f in facs.values())} unit rows, {len(meta['ci']['articles'])} articles, "
          f"{sum(w['lists'] for w in meta['winning'].values())} winning lists")


if __name__ == '__main__':
    main()
