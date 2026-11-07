"""One-off probe: fetch candidate Tabletop Battles pages so the parser can be written against real HTML."""
import os, urllib.request
UA = 'Mozilla/5.0 (compatible; 40kCaddieMeta/1.0; weekly meta summary)'
os.makedirs('probe', exist_ok=True)
urls = {
  'feed': 'https://www.tabletopbattles.com/feed/',
  'search': 'https://www.tabletopbattles.com/?s=competitive+innovations+in+11th',
  'tag': 'https://www.tabletopbattles.com/tag/competitive-innovations/',
  'home': 'https://www.tabletopbattles.com/',
  'article': 'https://www.tabletopbattles.com/40k-competitive-innovations-in-11th-supermajor-season-pt-2',
  'sitemap': 'https://www.tabletopbattles.com/sitemap.xml',
}
for k, u in urls.items():
    try:
        req = urllib.request.Request(u, headers={'User-Agent': UA})
        with urllib.request.urlopen(req, timeout=40) as r:
            open(f'probe/{k}.html', 'wb').write(r.read()); print(k, r.status)
    except Exception as e:
        print(k, 'ERR', e)
