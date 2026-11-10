/* 40k Caddie, stage 1. Vanilla JS, state in localStorage. */
(function () {
  'use strict';
  const D = window.IT_DATA;
  const KEY = 'imperium-tactica-v1';
  const PHASES = ['Command', 'Movement', 'Shooting', 'Charge', 'Fight'];
  const DISPOSITIONS = ['Take and Hold', 'Purge the Foe', 'Reconnaissance', 'Priority Assets', 'Disruption'];
  const VOWS = ['Uphold the Honour of the Emperor', 'Accept Any Challenge, No Matter the Odds', 'Abhor the Witch, Destroy the Witch'];
  const M = D.missions;
  // Foe rules from the Wahapedia 11th edition export: army rules, detachments, stratagems and datasheets per faction
  const FOES = (window.IT_FOES && window.IT_FOES.factions) || {};
  const FD = (faction) => FOES[faction] || null;
  // Every other army ships as its own file and loads only when someone picks it; versions are each army's Wahapedia book at pull time
  const FACTION_FILES = {"Adeptus Custodes": "adeptus-custodes", "Grey Knights": "grey-knights", "Adepta Sororitas": "adepta-sororitas", "Astra Militarum": "astra-militarum", "Adeptus Mechanicus": "adeptus-mechanicus", "Imperial Knights": "imperial-knights", "Imperial Agents": "imperial-agents", "World Eaters": "world-eaters", "Death Guard": "death-guard", "Thousand Sons": "thousand-sons", "Emperor's Children": "emperor-s-children", "Chaos Space Marines": "chaos-space-marines", "Alpha Legion": "alpha-legion", "Chaos Daemons": "chaos-daemons", "Chaos Knights": "chaos-knights", "Orks": "orks", "Tyranids": "tyranids", "Genestealer Cults": "genestealer-cults", "T'au Empire": "t-au-empire", "Drukhari": "drukhari", "Leagues of Votann": "leagues-of-votann", "Black Templars": "black-templars", "Blood Angels": "blood-angels", "Ultramarines": "ultramarines", "Carcharodons": "carcharodons", "Space Marines (other chapter)": "space-marines-other-chapter"};
  const FACTION_VER = {"Necrons": "2.8.1 October 2026", "Aeldari": "1.4 October 2026", "Adeptus Custodes": "2.8.1 October 2026", "Grey Knights": "2.8.1 October 2026", "Adepta Sororitas": "1.4 October 2026", "Astra Militarum": "2.8.1 October 2026", "Adeptus Mechanicus": "1.4 October 2026", "Imperial Knights": "2.8.1 October 2026", "Imperial Agents": "1.3 October 2026", "World Eaters": "2.8.1 October 2026", "Death Guard": "2.8.1 October 2026", "Thousand Sons": "2.8.1 October 2026", "Emperor's Children": "2.8.1 October 2026", "Chaos Space Marines": "2.8.1 October 2026", "Alpha Legion": "2.8.1 October 2026", "Chaos Daemons": "2.8.1 October 2026", "Chaos Knights": "2.8.1 October 2026", "Orks": "2.8.1 October 2026", "Tyranids": "1.3 October 2026", "Genestealer Cults": "2.8.1 October 2026", "T'au Empire": "2.8.1 October 2026", "Drukhari": "2.8.1 October 2026", "Leagues of Votann": "1.2 October 2026", "Black Templars": "2.8.1 October 2026", "Blood Angels": "2.8.1 October 2026", "Dark Angels": "2.8.1 October 2026", "Space Wolves": "2.8.1 October 2026", "Ultramarines": "2.8.1 October 2026", "Carcharodons": "2.8.1 October 2026", "Space Marines (other chapter)": "2.8.1 October 2026", "Imperial Fists": "2.8.1 October 2026"};
  const FACTION_PAGE = {"Necrons": "https://wahapedia.ru/wh40k11ed/factions/necrons", "Aeldari": "https://wahapedia.ru/wh40k11ed/factions/aeldari", "Adeptus Custodes": "https://wahapedia.ru/wh40k11ed/factions/adeptus-custodes", "Grey Knights": "https://wahapedia.ru/wh40k11ed/factions/grey-knights", "Adepta Sororitas": "https://wahapedia.ru/wh40k11ed/factions/adepta-sororitas", "Astra Militarum": "https://wahapedia.ru/wh40k11ed/factions/astra-militarum", "Adeptus Mechanicus": "https://wahapedia.ru/wh40k11ed/factions/adeptus-mechanicus", "Imperial Knights": "https://wahapedia.ru/wh40k11ed/factions/imperial-knights", "Imperial Agents": "https://wahapedia.ru/wh40k11ed/factions/imperial-agents", "World Eaters": "https://wahapedia.ru/wh40k11ed/factions/world-eaters", "Death Guard": "https://wahapedia.ru/wh40k11ed/factions/death-guard", "Thousand Sons": "https://wahapedia.ru/wh40k11ed/factions/thousand-sons", "Emperor's Children": "https://wahapedia.ru/wh40k11ed/factions/emperor-s-children", "Chaos Space Marines": "https://wahapedia.ru/wh40k11ed/factions/chaos-space-marines", "Alpha Legion": "https://wahapedia.ru/wh40k11ed/factions/chaos-space-marines", "Chaos Daemons": "https://wahapedia.ru/wh40k11ed/factions/chaos-daemons", "Chaos Knights": "https://wahapedia.ru/wh40k11ed/factions/chaos-knights", "Orks": "https://wahapedia.ru/wh40k11ed/factions/orks", "Tyranids": "https://wahapedia.ru/wh40k11ed/factions/tyranids", "Genestealer Cults": "https://wahapedia.ru/wh40k11ed/factions/genestealer-cults", "T'au Empire": "https://wahapedia.ru/wh40k11ed/factions/t-au-empire", "Drukhari": "https://wahapedia.ru/wh40k11ed/factions/drukhari", "Leagues of Votann": "https://wahapedia.ru/wh40k11ed/factions/leagues-of-votann", "Black Templars": "https://wahapedia.ru/wh40k11ed/factions/space-marines", "Blood Angels": "https://wahapedia.ru/wh40k11ed/factions/space-marines", "Dark Angels": "https://wahapedia.ru/wh40k11ed/factions/space-marines", "Space Wolves": "https://wahapedia.ru/wh40k11ed/factions/space-marines", "Ultramarines": "https://wahapedia.ru/wh40k11ed/factions/space-marines", "Carcharodons": "https://wahapedia.ru/wh40k11ed/factions/space-marines", "Space Marines (other chapter)": "https://wahapedia.ru/wh40k11ed/factions/space-marines", "Imperial Fists": "https://wahapedia.ru/wh40k11ed/factions/space-marines"};
  const FACTION_FILES_V = 2;
  // armies that borrow another army's rules file (the Deathwatch fight from the Space Marine codex)
  const FACTION_ALIAS = { Deathwatch: 'Space Marines (other chapter)', 'Imperial Fists': 'Space Marines (other chapter)' }; FACTION_FILES.Deathwatch = FACTION_FILES[FACTION_ALIAS.Deathwatch]; FACTION_FILES['Imperial Fists'] = FACTION_FILES[FACTION_ALIAS['Imperial Fists']];
  const factionLoading = {}, factionTried = {};
  function loadFaction(name) {
    if (!name || FOES[name] || factionLoading[name] || !FACTION_FILES[name]) return;
    factionLoading[name] = true;
    const sc = document.createElement('script'); sc.src = 'factions/' + FACTION_FILES[name] + '.js?v=' + FACTION_FILES_V;
    sc.onload = () => { const f = window.IT_FOES_MORE && (window.IT_FOES_MORE[name] || window.IT_FOES_MORE[FACTION_ALIAS[name]]); if (f) { FOES[name] = f; delete unitCache[name]; } factionLoading[name] = false; factionTried[name] = true; render(); checkFaction(name); };
    sc.onerror = () => { factionLoading[name] = 'failed'; render(); };
    document.head.appendChild(sc);
  }
  // resolves once an army's datasheets are in (or there are none to fetch)
  function ensureFaction(name) {
    return new Promise((res) => {
      if (!name || FOES[name] || !FACTION_FILES[name]) return res();
      loadFaction(name); let n = 0;
      const t = setInterval(() => { if (FOES[name] || factionLoading[name] === 'failed' || ++n > 100) { clearInterval(t); res(); } }, 100);
    });
  }
  // the army a pasted list belongs to, as this app names it (chapter first, then the codex)
  const listFaction = (L) => (L ? [L.subfaction, L.faction].find((n) => n && (FACTION_FILES[n] || FOES[n])) || '' : '');
  // The Macragge test for one army: open its Wahapedia page in the laptop's browser and compare the book version with the one this app holds
  // the installed app reads the weekly check's results instead of a browser (fetched at most once per visit unless asked)
  let rulesStatusP = null;
  function rulesStatus(fresh) {
    if (!rulesStatusP || fresh) rulesStatusP = fetch('rules-status.json?t=' + Date.now(), { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    return rulesStatusP;
  }
  // the live check: our server reads the army's rules page now (it keeps the answer for a few hours); null when it can't
  async function rulesLive(slug) {
    if (!STANDALONE || !STANDALONE.client) return null;
    try {
      const go = STANDALONE.client.functions.invoke('rules-live', { body: { slugs: [slug] } });
      const { data, error } = await Promise.race([go, new Promise((r) => setTimeout(() => r({ error: 'slow' }), 9000))]);
      return !error && data && data.versions ? data.versions[slug] || null : null;
    } catch (e) { return null; }
  }
  // before a battle: are the rules this app holds for both armies still the current ones?
  async function rulesGate() {
    const names = [...new Set([listFaction(list()), foe().faction])].filter((n) => n && FACTION_PAGE[n] && FACTION_VER[n]);
    if (!names.length) { UI.gatePassed = true; ACT.fight(); save(); render(); return; }
    UI.sheet = { type: 'rulesGate', busy: true }; render();
    await Promise.all(names.map((n) => checkFaction(n, false)));
    if (!UI.sheet || UI.sheet.type !== 'rulesGate') return;
    const res = names.map((n) => ({ n, c: S.factionChecks[n] || {} }));
    const stale = res.filter((x) => x.c.ver && !x.c.ok);
    if (!stale.length) {
      UI.sheet = null; UI.gatePassed = true;
      toast(res.some((x) => x.c.error || x.c.unknown) ? 'Could not check the rules just now' : 'Rules current for both armies');
      ACT.fight(); save(); render(); return;
    }
    UI.sheet = { type: 'rulesGate', stale: stale.map((x) => ({ n: x.n, ver: x.c.ver })) }; render();
  }
  async function checkFaction(name, force) {
    if (!name || !FACTION_PAGE[name] || !FACTION_VER[name]) return;
    S.factionChecks = S.factionChecks || {};
    const prev = S.factionChecks[name];
    if (!force && prev && prev.ok && Date.now() - new Date(prev.at).getTime() < 12 * 3600 * 1000) return;
    if (STANDALONE || !(window.claude && window.claude.use)) {
      S.factionChecks[name] = { busy: true, at: new Date().toISOString() }; render();
      const slug = FACTION_PAGE[name].split('/factions/')[1];
      const live = await rulesLive(slug);
      const st = live ? { factions: { [slug]: live } } : await rulesStatus(force); const ver = st && st.factions ? st.factions[slug] : null;
      S.factionChecks[name] = st ? { at: new Date().toISOString(), ver, ok: ver === FACTION_VER[name], unknown: !ver } : { at: new Date().toISOString(), error: true };
      save(); render(); return;
    }
    try {
      const mcp = window.claude && window.claude.use ? await window.claude.use('mcp') : null; if (!mcp) return;
      S.factionChecks[name] = { busy: true, at: new Date().toISOString() }; render();
      const { ver } = await readBook(mcp, FACTION_PAGE[name] + '/');
      S.factionChecks[name] = { at: new Date().toISOString(), ver, ok: ver === FACTION_VER[name], unknown: !ver };
    } catch (e) { S.factionChecks[name] = { at: new Date().toISOString(), error: true }; }
    save(); render();
  }
  // Opens a Wahapedia faction page in the laptop's browser and reads the book version from its Books table.
  // The page can still be loading when it opens, so it waits and reads again a few times.
  async function readBook(mcp, url) {
    const opened = await mcp.callTool('host:claude_browser', 'preview_start', { url });
    const openedText = JSON.stringify(opened || {});
    const tab = (openedText.match(/tabId[^A-Za-z0-9]+([A-Za-z0-9_-]+)/) || [])[1];
    const VER = /(\d+(?:\.\d+)+)\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/;
    let text = '';
    for (let i = 0; i < 5; i++) {
      await new Promise((r) => setTimeout(r, i ? 2000 : 1200));
      const got = await mcp.callTool('host:claude_browser', 'get_page_text', tab ? { tabId: tab, max_chars: 20000 } : { max_chars: 20000 });
      text = (JSON.stringify(got || '')).replace(/\\[nt]/g, ' ').replace(/\\u00a0/g, ' ');
      const at = text.search(/BOOKS|Last update/i);
      const m = at >= 0 ? text.slice(at).match(VER) : null;
      if (m) return { ver: m[1] + ' ' + m[2] + ' ' + m[3] };
    }
    return { ver: null, sample: (openedText.slice(0, 160) + ' | ' + text.slice(0, 260)).replace(/\s+/g, ' ') };
  }
  function factionCheckLine(name) {
    if (!FACTION_VER[name]) return '';
    const c = (S.factionChecks || {})[name];
    if (!c) return `<p class="small muted" style="margin: 0">Rules: Wahapedia ${esc(FACTION_VER[name])}. ${STANDALONE ? 'Checking against the weekly rules check.' : 'Open the app on your laptop to check they\'re current.'}</p>`;
    if (c.busy) return `<p class="small muted" style="margin: 0">Checking ${esc(factionInfo(name).display)} rules on Wahapedia…</p>`;
    if (c.ok) return `<p class="small muted" style="margin: 0">Rules up to date: Wahapedia ${esc(c.ver)}.</p>`;
    if (c.ver) return `<p class="small" style="margin: 0; color: var(--gold)"><b>Their rules have changed</b> (Wahapedia ${esc(c.ver)}, app has ${esc(FACTION_VER[name])}). Tell Claude "refresh the 40k Caddie rules for ${esc(factionInfo(name).display)}".</p>`;
    return `<p class="small muted" style="margin: 0">Couldn't read Wahapedia just now. Rules held: ${esc(FACTION_VER[name])}.</p>`;
  }
  const unitCache = {};
  // every unit that can be a Warlord pick: the army's characters, sorted by name
  function foeCharacters(faction) {
    const U = foeUnits(faction);
    return Object.keys(U).filter((n) => (U[n].kw || []).some((k) => /^character$/i.test(k))).sort((x, y) => x.localeCompare(y));
  }
  // a short card: the leader's profile and what their abilities do
  function warlordCard(faction, name, foeStyle) {
    const d = foeUnits(faction)[name]; if (!d) return '';
    const m = d.m && d.m[0];
    const abil = (d.ab || []).filter((x) => x[1]).map((x) => `<div class="small"><b>${esc(x[0])}</b><br>${esc(x[1])}</div>`).join('');
    const core = (d.ab || []).filter((x) => !x[1]).map((x) => x[0]).join(', ');
    return `<div class="${foeStyle ? 'foe-panel' : 'panel'} stack" style="padding: 10px 12px; gap: 6px">
      <div class="row" style="justify-content: space-between; align-items: baseline"><b>${esc(name)}</b><span class="small foe-ink">${d.p ? d.p + ' pts' : ''}</span></div>
      ${m ? `<div class="small tnum">M ${esc(m.M)} · T ${esc(m.T)} · Sv ${esc(m.Sv)}${m.InSv ? ' (' + esc(m.InSv) + ' invuln)' : ''} · W ${esc(m.W)} · Ld ${esc(m.LD)} · OC ${esc(m.OC)}</div>` : ''}
      ${core ? `<div class="small muted">${esc(core)}</div>` : ''}${abil}</div>`;
  }
  function foeUnits(faction) {
    if (unitCache[faction]) return unitCache[faction];
    const f = FD(faction); if (!f) return FRESH[faction] || {};
    return (unitCache[faction] = Object.assign({}, f.base === 'SM' ? window.IT_FOES.smUnits : {}, f.units, FRESH[faction] || {}));
  }
  // current datasheets from the weekly community data (the same files Footfall uses), laid over the app's built-in copy
  const FRESH = {}; const freshTried = {};
  const FRESH_ALIAS = { 'Imperial Agents': 'Agents of the Imperium', 'Space Marines (other chapter)': 'Space Marines', Carcharodons: 'Space Marines', 'Alpha Legion': 'Chaos Space Marines' };
  function freshLoad(faction) {
    if (!STANDALONE || !faction || freshTried[faction] || typeof FF === 'undefined') return;
    freshTried[faction] = true;
    const want = FRESH_ALIAS[faction] || faction;
    ffIndex().then((idx) => { const f = idx.factions.find((x) => ffShort(x.name) === want); if (!f) return null; return ffData(f.file); })
      .then((Dd) => { if (!Dd) return; FRESH[faction] = FF.datasheets(Dd); delete unitCache[faction]; render(); }).catch(() => {});
  }
  const OBJ_DEFAULT = [['Your home', 'home'], ['Centre', 'central'], ['Their home', 'foehome'], ['Flank 1', 'expansion'], ['Flank 2', 'expansion']];
  const HDR = /^(ANY BATTLE ROUND|FIRST BATTLE ROUND|FIRST AND SECOND BATTLE ROUND|SECOND BATTLE ROUND ONWARDS|SECOND TO FOURTH BATTLE ROUND|SECOND AND THIRD BATTLE ROUND|THIRD BATTLE ROUND ONWARDS|FOURTH BATTLE ROUND ONWARDS|FIFTH BATTLE ROUND|END OF THE BATTLE)$/;
  function roundsFor(h) {
    return ({ 'FIRST BATTLE ROUND': [1], 'FIRST AND SECOND BATTLE ROUND': [1, 2], 'SECOND BATTLE ROUND ONWARDS': [2, 3, 4, 5], 'SECOND TO FOURTH BATTLE ROUND': [2, 3, 4], 'SECOND AND THIRD BATTLE ROUND': [2, 3], 'THIRD BATTLE ROUND ONWARDS': [3, 4, 5], 'FOURTH BATTLE ROUND ONWARDS': [4, 5], 'FIFTH BATTLE ROUND': [5], 'END OF THE BATTLE': [5] })[h] || [1, 2, 3, 4, 5];
  }
  // Turns a mission card's text into scoring rows: when it scores, what you need, how many VP.
  function parseCard(text, tactical) {
    const rows = [], notes = [];
    let hdr = 'ANY BATTLE ROUND', when = '', cond = null, inAction = false;
    String(text || '').split(' | ').map((s) => s.trim()).forEach((s) => {
      if (HDR.test(s)) { hdr = s; inAction = false; return; }
      if (/ACTION$/.test(s)) { inAction = true; return; }
      if (inAction) return;
      if (/^(STARTS|UNITS|USE LIMIT|COMPLETES|EFFECT|RESTRICTIONS):/.test(s)) return;
      if (/^(WHEN DRAWN|START OF YOUR TURN|START OF THE BATTLE|WHEN DRAWN \/ START OF YOUR TURN):/.test(s)) { notes.push(s); return; }
      if (s.startsWith('WHEN:')) { when = s.slice(5).trim(); return; }
      if (s === 'OR' || s === '+' || s === 'OR (TACTICAL)') return;
      if (s.startsWith('(UP TO')) { if (rows.length) rows[rows.length - 1].cap = s.replace(/[()]/g, '').toLowerCase(); return; }
      const vm = s.match(/^(\+?)(\d+)VP(?:\s+FIXED\s*\/\s*(\d+)VP TACTICAL)?/);
      if (vm && cond) { rows.push({ hdr, rounds: roundsFor(hdr), when, cond, vp: tactical && vm[3] ? +vm[3] : +vm[2], bonus: !!vm[1], each: /^For each/i.test(cond) }); cond = null; return; }
      cond = s;
    });
    return { rows, notes };
  }
  const titleCase = (s) => s.split(' ').map((w) => (/^(and|the|of|on|no)$/i.test(w) ? w.toLowerCase() : w.charAt(0) + w.slice(1).toLowerCase())).join(' ').replace(/^./, (c) => c.toUpperCase());
  function primaryName(mine, theirs) {
    if (!mine || !theirs) return null;
    let m = M.matchups.find((x) => x[0] === mine && x[1] === theirs);
    if (m) return { me: m[2], foe: m[3] };
    m = M.matchups.find((x) => x[0] === theirs && x[1] === mine);
    return m ? { me: m[3], foe: m[2] } : null;
  }
  function primaries() {
    const F = S.field, L = list();
    const p = primaryName(F.myDisp || (L && L.force_disposition), F.foeDisp);
    if (!p) return null;
    if (F.twist === 'Scrambled Communications') return { me: p.foe, foe: p.me };
    if (F.twist === 'Mirrored World' && F.mirror) return { me: F.mirror, foe: F.mirror };
    return p;
  }
  function myDispOptions() {
    const L = list(); const set = new Set();
    if (L) { (L.detachments || []).forEach((d) => (M.detachmentDispositions[d] || []).forEach((x) => set.add(x))); if (L.force_disposition) set.add(L.force_disposition); }
    return set.size ? [...set] : DISPOSITIONS.slice();
  }
  function foeDispOptions() {
    const F = foe();
    if (FD(F.faction) && F.detachments.length) {
      const set = new Set();
      FD(F.faction).detachments.filter((d) => F.detachments.includes(d.name)).forEach((d) => d.disposition.split(', ').forEach((x) => set.add(x)));
      return [...set];
    }
    return DISPOSITIONS.slice();
  }
  const secTactical = () => S.field.secMode !== 'fixed';
  const foeSecTactical = () => S.field.foeSecMode !== 'fixed';
  const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const casual = () => S.field.mode === 'casual';
  const secOnF = () => !casual() && S.field.secOn !== false;
  const secN = () => (S.field.secCount === 1 ? 1 : 2);
  // the app rolls both dispositions (which set the primaries) and the deployment
  function rollMission() {
    const F = S.field; F.myDisp = pickOne(myDispOptions()); F.foeDisp = pickOne(foeDispOptions()); F.deployment = pickOne(M.deployments);
    if (casual()) { F.twist = ''; F.mirror = ''; }
  }
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // the app as the secondary deck: top a player's hand up to the agreed number of cards
  function dealUp(who, r, quiet) {
    const B = S.battle; if (!B.secOn || !B.secRandom) return [];
    const got = []; let guard = 0;
    while (activeCards(who, r).filter((c) => c.status === 'active').length < B.secCount && B.deck[who].length && guard++ < 40) {
      const name = B.deck[who].shift();
      // Defend Stronghold must be shuffled back if drawn in the first battle round
      if (r === 1 && name === 'Defend Stronghold') { B.deck[who].splice(Math.floor(Math.random() * (B.deck[who].length + 1)), 0, name); continue; }
      drawCard(who, name, r); got.push(name);
    }
    if (got.length && !quiet) toast((who === 'me' ? 'You drew: ' : 'They drew: ') + got.join(', '));
    return got;
  }

  // ---------- deployment maps (60" x 44" table, approximate shapes) ----------
  // a/b: zone outlines; names: what each zone is called; la/lb: label spots; obj: [home A, centre, home B, flank 1, flank 2]
  const DEPLOY = {
    'Dawn of War': { a: 'M0 32H60V44H0Z', b: 'M0 0H60V12H0Z', names: ['Bottom long edge', 'Top long edge'], la: [30, 41], lb: [30, 6], obj: [[16, 38], [30, 22], [44, 6], [8, 22], [52, 22]] },
    'Hammer and Anvil': { a: 'M0 0H18V44H0Z', b: 'M42 0H60V44H42Z', names: ['Left short edge', 'Right short edge'], la: [9, 6], lb: [51, 6], obj: [[9, 22], [30, 22], [51, 22], [30, 7], [30, 37]] },
    'Search and Destroy': { a: 'M0 22H21A9 9 0 0 0 30 31V44H0Z', b: 'M60 22H39A9 9 0 0 0 30 13V0H60Z', names: ['Bottom-left quarter', 'Top-right quarter'], la: [9, 40], lb: [51, 5], obj: [[12, 33], [30, 22], [48, 11], [12, 9], [48, 35]] },
    'Sweeping Engagement': { a: 'M0 44V36H30V30H60V44Z', b: 'M60 0V8H30V14H0V0Z', names: ['Bottom long edge', 'Top long edge'], la: [15, 41], lb: [45, 4.5], obj: [[46, 37], [30, 22], [14, 7], [9, 24], [51, 20]] },
    'Crucible of Battle': { a: 'M0 6L28 44H0Z', b: 'M60 38L32 0H60Z', names: ['Bottom-left corner', 'Top-right corner'], la: [6, 40], lb: [54, 5], obj: [[7, 33], [30, 22], [53, 11], [20, 8], [40, 36]] },
    'Tipping Point': { a: 'M0 0H12V22H20V44H0Z', b: 'M60 44H48V22H40V0H60Z', names: ['Left short edge', 'Right short edge'], la: [6, 5], lb: [54, 40], obj: [[9, 33], [30, 22], [51, 11], [28, 6], [32, 38]] }
  };
  const DEPLOY_NONE = { a: 'M0 0H24V44H0Z', b: 'M36 0H60V44H36Z', names: ['Left side', 'Right side'], la: [12, 6], lb: [48, 6], obj: [[10, 22], [30, 22], [50, 22], [30, 7], [30, 37]] };
  const mySide = () => (S.field.side === 'right' || S.field.side === 'b' ? 'b' : 'a');
  const depDef = (name) => DEPLOY[name] || DEPLOY_NONE;
  function zoneName() { return depDef(S.field.deployment).names[mySide() === 'a' ? 0 : 1]; }
  // opts: { mode: 'side' | 'round' | null, r, R, mini }
  // ---------- official maps: GW's deployment cards and tournament terrain layouts, shown straight from Wahapedia ----------
  const WAHA_IMG = 'https://wahapedia.ru/wh40k11ed/img/maps/';
  const LAYOUTS = {"Purge the Foe|Take and Hold": ["37_Take_and_Hold_vs_Purge_the_Foe_Layout_A", "38_Take_and_Hold_vs_Purge_the_Foe_Layout_B", "39_Take_and_Hold_vs_Purge_the_Foe_Layout_C"], "Disruption|Take and Hold": ["31_Take_and_Hold_vs_Disruption_Layout_A", "32_Take_and_Hold_vs_Disruption_Layout_B", "33_Take_and_Hold_vs_Disruption_Layout_C"], "Priority Assets|Take and Hold": ["34_Take_and_Hold_vs_Priority_Assets_Layout_A", "35_Take_and_Hold_vs_Priority_Assets_Layout_B", "36_Take_and_Hold_vs_Priority_Assets_Layout_C"], "Reconnaissance|Reconnaissance": ["28_Reconnaissance_vs_Reconnaissance_Layout_A", "29_Reconnaissance_vs_Reconnaissance_Layout_B", "30_Reconnaissance_vs_Reconnaissance_Layout_C"], "Priority Assets|Reconnaissance": ["25_Reconnaissance_vs_Priority_Assets_Layout_A", "26_Reconnaissance_vs_Priority_Assets_Layout_B", "27_Reconnaissance_vs_Priority_Assets_Layout_C"], "Purge the Foe|Reconnaissance": ["22_Purge_the_Foe_vs_Reconnaissance_Layout_A", "23_Purge_the_Foe_vs_Reconnaissance_Layout_B", "24_Purge_the_Foe_vs_Reconnaissance_Layout_C"], "Take and Hold|Take and Hold": ["43_Take_and_Hold_vs_Take_and_Hold_Layout_A", "44_Take_and_Hold_vs_Take_and_Hold_Layout_B", "45_Take_and_Hold_vs_Take_and_Hold_Layout_C"], "Reconnaissance|Take and Hold": ["40_Take_and_Hold_vs_Reconnaissance_Layout_A", "41_Take_and_Hold_vs_Reconnaissance_Layout_B", "42_Take_and_Hold_vs_Reconnaissance_Layout_C"], "Purge the Foe|Purge the Foe": ["19_Purge_the_Foe_vs_Purge_the_Foe_Layout_A", "20_Purge_the_Foe_vs_Purge_the_Foe_Layout_B", "21_Purge_the_Foe_vs_Purge_the_Foe_Layout_C"], "Priority Assets|Purge the Foe": ["16_Purge_the_Foe_vs_Priority_Assets_Layout_A", "17_Purge_the_Foe_vs_Priority_Assets_Layout_B", "18_Purge_the_Foe_vs_Priority_Assets_Layout_C"], "Disruption|Purge the Foe": ["13_Purge_the_Foe_vs_Disruption_Layout_A", "14_Purge_the_Foe_vs_Disruption_Layout_B", "15_Purge_the_Foe_vs_Disruption_Layout_C"], "Disruption|Reconnaissance": ["07_Disruption_vs_Reconnaissance_Layout_A", "08_Disruption_vs_Reconnaissance_Layout_B", "09_Disruption_vs_Reconnaissance_Layout_C"], "Disruption|Priority Assets": ["04_Disruption_vs_Priority_Assets_Layout_A", "05_Disruption_vs_Priority_Assets_Layout_B", "06_Disruption_vs_Priority_Assets_Layout_C"], "Priority Assets|Priority Assets": ["10_Priority_Assets_vs_Priority_Assets_Layout_A", "11_Priority_Assets_vs_Priority_Assets_Layout_B", "12_Priority_Assets_vs_Priority_Assets_Layout_C"], "Disruption|Disruption": ["01_Disruption_vs_Disruption_Layout_A", "02_Disruption_vs_Disruption_Layout_B", "03_Disruption_vs_Disruption_Layout_C"]};
  const depCard = (dep) => dep ? WAHA_IMG + 'cards/CA7_' + dep.replace(/[^A-Za-z ]/g, '').split(' ').map((w) => w[0].toUpperCase() + w.slice(1)).join('') + '.png' : '';
  function layoutFiles(d1, d2) { if (!d1 || !d2) return null; return LAYOUTS[[d1, d2].sort().join('|')] || null; }
  function officialMaps(F, where) {
    const dep = F.deployment, files = layoutFiles(F.myDisp || (list() && list().force_disposition), F.foeDisp);
    const pick = F.layout || 'A'; const idx = 'ABC'.indexOf(pick);
    const img = (src, alt) => `<a href="${src}" target="_blank" rel="noopener" class="offmap"><img src="${src}" alt="${esc(alt)}" loading="lazy" onerror="this.parentNode.classList.add('failed')"><span class="offmap-fail small muted">Couldn't load this from Wahapedia. Tap to open it there.</span></a>`;
    return `<section class="stack" style="gap: 8px"><div class="eyebrow">Official maps</div>
      ${dep ? `<div class="small muted">Deployment card: ${esc(dep)}</div>${img(depCard(dep), dep + ' deployment card')}` : '<p class="small muted" style="margin: 0">Choose or roll a deployment to see its card.</p>'}
      ${files ? `<div class="row" style="justify-content: space-between; align-items: center"><span class="small muted">Terrain layout for this matchup</span><span class="row" style="gap: 4px">${'ABC'.split('').map((x) => `<button class="chip ${x === pick ? 'on' : ''}" data-act="layoutPick" data-k="${x}" style="min-height: 34px; min-width: 40px; justify-content: center">${x}</button>`).join('')}</span></div>${img(WAHA_IMG + 'layouts/' + files[idx] + '.png', 'Terrain layout ' + pick)}` : '<p class="small muted" style="margin: 0">Set both dispositions to see the tournament terrain layouts for your matchup.</p>'}
      <p class="small muted" style="margin: 0">GW's official cards and layouts, loaded from Wahapedia, so they need signal. Tap one to open it full size.</p></section>`;
  }
  function tableMap(opts) {
    const o = opts || {}; const d = depDef(S.field.deployment); const me = mySide();
    const fi = factionInfo(foe().faction);
    const zone = (k) => {
      const mine = k === me;
      const attrs = o.mode === 'side' ? `data-act="side" data-k="${k}" role="button" aria-label="Deploy in the ${esc(d.names[k === 'a' ? 0 : 1])} zone" style="cursor: pointer"` : '';
      return `<path d="${d[k]}" ${attrs} style="fill: ${mine ? 'var(--accent)' : 'var(--foe-c)'}; fill-opacity: ${o.mode === 'round' ? 0.07 : mine ? 0.62 : 0.34}; stroke: ${mine ? 'var(--accent-text)' : 'var(--foe-c)'}; stroke-width: 0.35; ${o.mode === 'side' ? 'cursor: pointer' : 'pointer-events: none'}"></path>`;
    };
    const lbl = (k) => { const p = d[k === 'a' ? 'la' : 'lb']; const mine = k === me; return o.mini ? '' : `<text x="${p[0]}" y="${p[1]}" text-anchor="middle" dominant-baseline="middle" style="pointer-events: none; font: 700 2.6px var(--body); letter-spacing: 0.1px; fill: ${mine ? 'var(--text)' : 'var(--foe-a)'}">${mine ? 'YOU' : esc(fi.display.toUpperCase())}</text>`; };
    // objective index 0 is always "your home"; swap home spots when you take zone B
    const pos = (i) => (i === 0 ? d.obj[me === 'a' ? 0 : 2] : i === 2 ? d.obj[me === 'a' ? 2 : 0] : d.obj[i]);
    const names = (S.battle && S.battle.objNames) || OBJ_DEFAULT.map((x) => x[0]);
    const R = o.R;
    const cells = o.mode === 'round' ? (R.grid || []).map((st, i) => { const x = (i % 6) * 10, y = Math.floor(i / 6) * 11; return `<rect x="${x}" y="${y}" width="10" height="11" data-act="cell" data-k="${i}" data-r="${o.r}" role="button" aria-label="Table square ${i + 1}: ${st === 'foe' ? 'enemy here' : st === 'me' ? 'your forces here' : 'empty'}" style="cursor: pointer; fill: ${st === 'foe' ? 'var(--foe-c)' : st === 'me' ? 'var(--accent)' : 'transparent'}; fill-opacity: ${st ? 0.5 : 0}; stroke: var(--line2); stroke-width: 0.15"></rect>`; }).join('') : '';
    const objs = d.obj.map((_, i) => {
      const p = pos(i); const st = R ? R.obj[i] || '' : '';
      const fill = st === 'me' ? 'var(--accent-text)' : st === 'foe' ? 'var(--foe-b)' : o.mode === 'round' ? 'var(--bg)' : 'var(--text)';
      const hit = o.mode === 'round' ? `data-act="objCycle" data-k="${i}" data-r="${o.r}" role="button" aria-label="${esc(names[i] || '')}: change who holds it" style="cursor: pointer"` : 'style="pointer-events: none"';
      const tag = o.mini ? '' : `<text x="${p[0]}" y="${p[1] + 4.6}" text-anchor="middle" style="pointer-events: none; font: 600 2.1px var(--body); fill: var(--muted)">${esc(names[i] || '')}${R && st ? (st === 'me' ? ' · yours' : ' · theirs') : ''}</text>`;
      return `<g ${hit}><circle cx="${p[0]}" cy="${p[1]}" r="${o.mini ? 2.4 : 4.6}" fill="transparent"></circle><circle cx="${p[0]}" cy="${p[1]}" r="${o.mini ? 2 : 2.4}" style="fill: ${fill}; stroke: var(--text); stroke-width: 0.4"></circle></g>${tag}`;
    }).join('');
    return `<svg viewBox="0 0 60 44" ${o.mini ? 'aria-hidden="true"' : `role="img" aria-label="${esc(S.field.deployment || 'Table')} map"`} style="display: block; width: 100%; height: auto; background: var(--panel2); border: 1px solid var(--line2)">
      <line x1="30" y1="0" x2="30" y2="44" style="stroke: var(--line2); stroke-width: 0.2; stroke-dasharray: 1 1; pointer-events: none"></line><line x1="0" y1="22" x2="60" y2="22" style="stroke: var(--line2); stroke-width: 0.2; stroke-dasharray: 1 1; pointer-events: none"></line>
      ${zone('a')}${zone('b')}${cells}${lbl('a')}${lbl('b')}${objs}</svg>`;
  }

  // what's new, newest first (shown on Ulthwé)
  const UPDATES = [
    { d: '11 Nov 2026', items: [
      'The Astra Militarum can be a main army, and have their own look as an opponent. Pick your regiment in Orders of Battle: Cadian Shock Troops, Catachan Jungle Fighters, Death Korps of Krieg, Vostroyan Firstborn, Mordian Iron Guard, Tallarn Desert Raiders, Valhallan Ice Warriors or Armageddon Steel Legion. Your regiment\'s home world takes Terra\'s place at the heart of the map, its badge and colours run through the app, and the battle cry is its own ("Cadia stands!", "No remorse, no mercy, no forgiveness."). The battle screen is a command hall: the aquila window is the Round, the gantry the Lord General, the blast doors your regiment and the enemy.',
      'Footfall: tap a chosen enhancement (or any single upgrade) again to take it off, without removing the unit.',
      'My collection now has two modes: Complete, one collection of every unit you own across all your armies (a Rhino or an Inquisitor counts for every army that can take one), and By army, where each army keeps its own counts.',
      'Footfall points: the second and later copies of a unit that costs more after the first (such as a second Banesword) are now priced correctly; the first is no longer charged the higher price.',
      'Scoring follows the mission caps: 15 VP primary and 15 VP secondary a round, 45 of each a game, and 20 VP for a fixed secondary card. Each primary condition scores once a round (twice where it can score at the end of either turn); tap it again to take it back.',
      'Lists with a comma in their points now read correctly, whether pasted ("1,250 pts") or exported from the Warhammer app ("Strike Force (2,000 points)"), so no unit is dropped, and a list saved with missing numbers no longer stops the muster screen opening.',
    ] },
    { d: '9 Nov 2026', items: [
      'Report bugs and send ideas: your army\'s watchers now fly every screen, scanning worlds and buttons as they go. Tap the vessel to write to them. The Imperium, Orks, Tyranids, Genestealer Cults and Votann answer to the Inquisition\'s cruiser; T\'au to the Edification Corps\' Manta; Necrons to the Triarch Praetorians\' Night Scythe; Chaos to the Cognitae\'s cruiser; Drukhari to the Incubi\'s Raider; and Aeldari to the Harlequins, whose Starweaver comes and goes through the Webway. Now and then another faction\'s vessel tries to intercept your reports. Yours always wins.',
    ] },
    { d: '7 Nov 2026', items: [
      'The Adeptus Custodes can be a main army, and have their own look as an opponent: the Ten Thousand. The Imperial Palace takes Terra\'s place at the heart of the map; the battle screen is the Palace\'s spires, the golden tower the Round, the balcony your Shield Host and the great lions the Captain-General and the Threat; crimson-and-gold armour trim runs under the header; the battle cry is "We are the Ten Thousand.". Pick your Shield Host in the Tower of Hegemon: Emperor\'s Chosen, Solar Watch, Dread Host, Aquilan Shield, Shadowkeepers or Emissaries Imperatus.',
      'Orks can be a main army, and have their own look as an opponent. Da Rok, an asteroid fortress, takes Terra\'s place at the heart of the map and Roks drift between the worlds; the battle screen is a Rok comin\' down, its burning hatches Da Boyz and the Round, the incoming meteor Da Gitz and the Nob\'s glyph banner Da Warboss; rusted choppas and shootas run under the header. Pick yer klan on Da Mob (Goffs, Bad Moons, Evil Sunz, Blood Axes, Snakebites, Deathskulls or Freebooterz) for its badge and colours. WAAAGH!',
      'Imperial Fists can be a main army, and have their own look as an opponent: the Sentinels of Terra. Terra stays at the heart of the map and you board the Phalanx, their star-fortress, to fight; the battle screen is the Phalanx\'s great hall, its arches your Company, Round and Besieger doors and the aquila the Strategium; black-and-yellow siege chevrons run under the header; the battle cry is "Primarch-Progenitor, to your glory!".',
      'Coming soon, at the bottom of the main screen: which armies already have their own full look, as your army and as an opponent, and which are still on the way.',
      'My collection, in Footfall: record the units you actually own. Choose Complete (one collection of everything you own, where each unit counts for every army that can field it) or By army (each army keeps its own counts). Open any Footfall list, tap My collection at the bottom, and set how many of each unit is on your shelf. Then, when adding units to a list, turn on "Only units I own": the builder offers only what you have (and no more copies than you own), and its suggestions for spare points stick to your shelf too. Your collection is saved to your account and never takes up a list slot.',
      'Chasing the meta, in Footfall: your army\'s 11th edition win rate and rank, and beside each unit when you add one, how often it is taken, whether it clearly lifts the win rate, and how many recent winning lists took it. The Chasing the meta panel lists what recent winners took and the units that lift results, with one tap to add. Numbers update weekly from the 40k-analytics report and the Competitive Innovations column on Tabletop Battles.',
      'Footfall, the list builder: the void port on the main screen. A legal list carries its army\'s seal (Chapter Master Approved, High Marshal Approved, Silent King Approved, Nurgle Approved and more), and you send it to battle the way that army goes to war: Board the Thunderhawks, Board the Night Scythes, Launch the Tyrannocytes. Build a list for any army from the current points and rules, with every wargear choice, enhancements, leaders and support units. It checks the list as you go and says exactly what is wrong. The seal fills as you reach the points limit; when the list is legal, tap it to take the list to your home world. If you are 30 or more points short it suggests units that fit. Mark what you own in My collection and build only from that. The Cogitator can explain enhancements and detachments, or why something is not legal.',
      'Before every battle, the app checks the rules it holds for both armies against the current ones. If either army\'s rules have changed, it tells you before the fight starts, so you can check points and datasheets first.',
      'Your battle world is named for your army\'s home: Fenris for the Vlka Fenryka, The Tomb World for the Infinite Empire, The Craftworld for the Asuryani, Erioch for the Deathwatch. Dark Angels live on the Rock, so they keep Terra. Black Templars keep Terra at the heart of the map, but you board the Eternal Crusader to fight: tap the ship as it circles the world.',
      'Lists can come from anywhere: paste text from the Warhammer 40,000 app, Warmind, New Recruit, Listforge or BattleScribe, or type it yourself with one unit per line and its points. The app finds the army, detachment, units, model counts and your warlord.',
      'Black Templars: the battle screen is now the chapel aboard the Eternal Crusader. The great window (Sigismund against Abaddon) holds the round, phase, CP and VP; the four lesser windows are your Crusade, Counsel, Round and Foe buttons; censers, incense and candles from the chapel spill past the frame.',
      'Deathwatch can be a main army: the Watch Fortress, the Omega Vault as the battle emblem, Kill Team and Inquisitor wording, and "The Xenos" or "The Target" depending on who you face. Deathwatch can now also be picked as an opponent.',
      'Other users\' armies can now be their main army: load a Space Wolves, Dark Angels, Necron or Aeldari list through Other and tap "Make ... your main army". Each gets its own frame, words, battle cry and battle emblem, checked against the lore.',
      'Vlka Fenryka: Fenris storm fading into the feast halls, the wolf badge as the emblem. Dark Angels: the Rock, stained glass, a lancet window emblem. The Infinite Empire: the tomb city, a monolith emblem, and dynasty colours to choose from. Asuryani: the craftworld, a spirit-stone emblem.',
      'Each army is called by its own name by its own player (Vlka Fenryka, The Infinite Empire, Asuryani) and by its standard name when it is the foe.',
      'Your opponent\'s side now carries their own army\'s flavour, built from their lore: Space Wolves (Fenris winter, fur, runes, a cord of fangs and runestones), Dark Angels (the Rock, stained glass, a hidden shame), Necrons (tomb world dust, waking glyphs) and Aeldari (wraithbone, the infinity circuit, spirit stones).',
      'The band under the header splits: your chain on your half, their army\'s equivalent on theirs.',
      'Their headers carry their sigil, their own fonts and wording, and one slow living detail each.',
    ] },
    { d: '6 Nov 2026', items: [
      'The ships between the worlds follow your army: the Gloriana for the Imperium, the Nicor for Carcharodons, and their own vessels for Aeldari, Necrons, Tyranids and Drukhari.',
      'Army buttons are your own: new players start with Other, and each army they load gets a button (the last two, plus Other).',
      'Ulthwé joins the worlds: what has changed in the app, newest first.',
      'Glimpses: now and then a distant ship or rift drifts behind the worlds.',
      'The Cogitator on Mars: ask about the battle in front of you, answered from both armies\' real rules.',
      'The Webway: link your opponent\'s phone. They scan a QR code (no app needed) or type a code, then each of you runs your own side live.',
      'Any army you load gets its real datasheets and wounds, not just Space Marines.',
      'The installed app: home screen icon, works offline, Google sign-in keeps everything in your account.',
      'A weekly check reads every army\'s book version on Wahapedia and flags anything that has changed.',
      'Pre-game sequence: the 12 Chapter Approved steps with ticks and your army\'s extras.',
    ] },
  ];
  const ARMY = {
    templars: { label: 'Black Templars', cls: 'army-templars', muster: 'Muster', eyebrow: 'BEFORE THE BATTLE', steps: ['I · Your Force', 'II · Your Foe', 'III · The Field'], fightingAs: 'Fighting as', cry: 'For the God-Emperor!', counsel: 'Counsel', log: 'Battle Log', vox: 'Vox Report', voxShort: 'VOX', armyQ: 'My Crusade', foeQ: 'The Foe', results: 'Reckoning', emblem: 'chapel', oath: 'Your vow', oathText: 'Score before you slay', roll: 'Roll Call', end: 'End the battle', hist: 'Archives' },
    carcharodons: { label: 'Carcharodons', cls: 'army-carc', muster: 'The Gathering', eyebrow: 'BEFORE THE HUNT', steps: ['I · The Pack', 'II · The Prey', 'III · Hunting Grounds'], fightingAs: 'Hunting as', cry: "In Rangu's Name!", counsel: 'The Deep', log: 'The Wake', vox: 'Blood Scent', voxShort: 'SCENT', armyQ: 'The Pack', foeQ: 'The Prey', results: 'The Red Tithe', emblem: 'jaws', oath: 'Your oath', oathText: 'Feed on objectives first', roll: 'Count the Pack', end: 'End the hunt', hist: 'The Voyage' },
    wolves: { label: 'Vlka Fenryka', cls: 'army-wolves', muster: 'The Fang', eyebrow: 'BEFORE THE HUNT', steps: ['I · The Great Company', 'II · The Quarry', 'III · The Hunting Ground'], fightingAs: 'Running with', cry: 'For Russ and the Allfather!', counsel: 'Rune Priest', log: 'The Saga', vox: 'Mark the Saga', voxShort: 'SAGA', armyQ: 'The Pack', foeQ: 'The Quarry', results: 'The Saga Told', emblem: 'ward', oath: 'Your saga', oathText: 'Earn a deed worth the telling', roll: 'Count the Pack', end: 'End the hunt', hist: 'The Sagas', lib: 'Space Wolves' },
    dark: { label: 'Dark Angels', cls: 'army-dark', muster: 'The Rock', eyebrow: 'THE INNER CIRCLE CONVENES', steps: ['I · The Order', 'II · The Unrepentant', 'III · The Field of Battle'], fightingAs: 'Sworn to', cry: 'Repent! For tomorrow you die!', counsel: 'The Inner Circle', log: 'The Record', vox: 'Seal the Record', voxShort: 'SEAL', armyQ: 'The Order', foeQ: 'The Unrepentant', results: 'Judgement', emblem: 'lancet', oath: 'Your penance', oathText: 'Make the foe repent', roll: 'Call the Order', end: 'End the battle', hist: 'The Sealed Archive', lib: 'Dark Angels', libRe: /dab3|darkangel/ },
    necron: { label: 'The Infinite Empire', short: 'Infinite Empire', cls: 'army-necron', muster: 'The Tomb', eyebrow: 'STASIS ENDED', steps: ['I · The Phalanx', 'II · The Lesser Race', 'III · The Battlefield'], fightingAs: 'Awakened as', cry: 'The stars are ours once more!', counsel: 'The Cryptek', log: 'Dynastic Record', vox: 'Record this', voxShort: 'RECORD', armyQ: 'The Phalanx', foeQ: 'The Lesser Race', results: 'The Reckoning of Ages', emblem: 'monolith', oath: 'Your directive', oathText: 'Reclaim what was ours', roll: 'Count the Legions', end: 'End the engagement', hist: 'The Eternal Archive', lib: 'Necrons' },
    asuryani: { label: 'Asuryani', cls: 'army-asuryani', muster: 'The Craftworld', eyebrow: 'THE SEER COUNCIL GATHERS', steps: ['I · The Warhost', 'II · The Enemy', 'III · The Path of Battle'], fightingAs: 'Walking the path of', cry: 'By the light of Asuryan!', counsel: 'The Farseer', log: 'The Skeins', vox: 'Read the runes', voxShort: 'RUNES', armyQ: 'The Warhost', foeQ: 'The Enemy', results: 'The Weave of Fate', emblem: 'stone', oath: 'Your path', oathText: 'Spend no life that fate does not demand', roll: 'Count the Host', end: 'End the battle', hist: 'The Infinity Circuit', lib: 'Aeldari', libRe: /^eldar$/ },
    fists: { label: 'Imperial Fists', cls: 'army-fists', muster: 'The Phalanx', eyebrow: 'SENTINELS OF TERRA', steps: ['I · The Company', 'II · The Besieger', 'III · The Bastion'], fightingAs: 'Standing as', cry: 'Primarch-Progenitor, to your glory!', counsel: 'The Strategium', log: 'Siege Log', vox: 'Vox to the Phalanx', voxShort: 'VOX', armyQ: 'The Company', foeQ: 'The Besieger', results: 'The Reckoning', emblem: 'phalanx', oath: 'Your duty', oathText: 'Hold the line. Break the siege.', roll: 'Muster the Company', end: 'End the battle', hist: 'Hall of Honour', lib: 'Imperial Fists', libRe: /^ifshoulder/ },
    guard: { label: 'Astra Militarum', short: 'Militarum', cls: 'army-guard', muster: 'Orders of Battle', eyebrow: 'THE HAMMER OF THE EMPEROR', steps: ['I · The Regiment', 'II · The Enemy', 'III · The Front'], fightingAs: 'Serving with', cry: 'Cadia stands!', counsel: 'The Lord General', log: 'The War Diary', vox: 'Vox to Command', voxShort: 'VOX', armyQ: 'The Regiment', foeQ: 'The Enemy', results: 'After-Action Report', emblem: 'hall', oath: 'Standing orders', oathText: 'Hold the line', roll: 'Muster the Regiment', end: 'End the battle', hist: 'The Regimental Records', lib: 'Astra Militarum' },
    orks: { label: 'Orks', cls: 'army-orks', muster: 'Da Mob', eyebrow: 'DA WAAAGH! GATHERS', steps: ['I · Da Boyz', 'II · Da Gitz', 'III · Da Fight'], fightingAs: 'Krumpin\' as', cry: 'WAAAGH!', counsel: 'Da Warboss', log: 'Da Tally', vox: 'Shout it', voxShort: 'OI!', armyQ: 'Da Boyz', foeQ: 'Da Gitz', results: 'Who Won?', emblem: 'rok', oath: 'Da plan', oathText: 'Krump \'em all', roll: 'Count da Boyz', end: 'Stop da fight', hist: 'Da Trophy Rack', lib: 'Orks' },
    custodes: { label: 'Adeptus Custodes', short: 'Custodes', cls: 'army-custodes', muster: 'The Tower of Hegemon', eyebrow: 'THE TEN THOUSAND', steps: ['I · The Shield Host', 'II · The Threat', 'III · The Field'], fightingAs: 'Standing vigil as', cry: 'We are the Ten Thousand.', counsel: 'The Captain-General', log: 'The Annals', vox: 'Report to Hegemon', voxShort: 'VOX', armyQ: 'The Shield Host', foeQ: 'The Threat', results: 'Judgement', emblem: 'spires', oath: 'Your vigil', oathText: 'Guard the Emperor\'s will', roll: 'Muster the Host', end: 'End the battle', hist: 'The Annals of Hegemon', lib: 'Adeptus Custodes', libRe: /^adeptuscustodesicon/ },
    deathwatch: { label: 'Deathwatch', cls: 'army-deathwatch', muster: 'The Watch Fortress', eyebrow: 'THE LONG VIGIL', steps: ['I · The Kill Team', 'II · The Target', 'III · The Hunting Grounds'], fightingAs: 'Keeping watch as', cry: 'Suffer not the alien to live!', counsel: 'The Inquisitor', log: 'The Bestiarium', vox: 'Report to the Ordo', voxShort: 'ORDO', armyQ: 'The Kill Team', foeQ: 'The Target', results: 'Sworn to Silence', emblem: 'vault', oath: 'Your vigil', oathText: 'Leave no xenos threat standing', roll: 'Muster the Kill Team', end: 'End the mission', hist: 'The Catacombs', lib: 'Deathwatch' },
    other: { label: 'Other', cls: 'army-other', muster: 'Setup', eyebrow: 'BEFORE THE GAME', steps: ['I · Your Army', 'II · Opponent', 'III · Mission'], fightingAs: 'Playing as', cry: 'Fight', counsel: 'Advice', log: 'Battle Log', vox: 'Mark moment', voxShort: 'MARK', armyQ: 'Your Army', foeQ: 'Opponent', results: 'Results', emblem: 'plain', oath: 'Your focus', oathText: 'Score before you kill', roll: 'Roll Call', end: 'End the game', hist: 'Battle history' }
  };

  const FOE_THEMES = {
    necron: ['#FFE0EC', '#FF8FC0', '#FF4F9C', '#F0287F', '#1A0510', '#FF8FC0', '#1E0C15', '#8A2A58'],
    da: ['#D6F5E2', '#7FD6A2', '#2E8A57', '#14492C', '#06170D', '#9FE0B8', '#0D1A12', '#2E6B47'],
    sw: ['#DCE6EE', '#9AB4C9', '#6A8BA6', '#3D566B', '#0A1016', '#BFD2E2', '#111920', '#56728A'],
    ae: ['#DDFCFF', '#8FF2FF', '#2DB3C4', '#0F5F6A', '#04191C', '#A6F4FF', '#08191C', '#227A86'],
    custodes: ['#FFF4CC', '#E8C766', '#B88A2E', '#7A5A1A', '#1A1205', '#E8C766', '#1C160A', '#8A6A2A'],
    ultra: ['#E3ECFF', '#8FB0F0', '#3A5BA0', '#1E3366', '#060D1C', '#9FBAF2', '#0D1424', '#3A5BA0'],
    khorne: ['#F2C9A0', '#C8833A', '#9E1B1B', '#4A0808', '#1A0505', '#E39A6A', '#1E0A08', '#8A2A1E'],
    nurgle: ['#E6EFB8', '#B9CC63', '#7A8A2E', '#3A4214', '#12160A', '#C8D88A', '#141709', '#6B7A2A'],
    tzeentch: ['#C9E8FF', '#4FA3F0', '#B04FD0', '#FF6FAE', '#08081A', '#9FC8F5', '#0F0E1E', '#5A4FA0'],
    slaanesh: ['#FFD9F5', '#D98AE8', '#8E3AB0', '#E8C766', '#180A1C', '#E7A9F0', '#180D1C', '#7A3A90'],
    alpha: ['#CFF7EE', '#4FC2B0', '#2F5F78', '#7A8A99', '#061412', '#8FDCCF', '#0B1716', '#3A7A86'],
    chaos: ['#E8D3A0', '#B8863A', '#5A3A1A', '#2A1A0E', '#140C06', '#E0B97A', '#1A120A', '#7A5A2A'],
    if: ['#FFF3BF', '#F2CF3C', '#D9A916', '#7E5E08', '#171103', '#F2CF3C', '#1A1508', '#8A6A1E'],
    dw: ['#E8ECEF', '#B9C2CA', '#7E8A94', '#3A4148', '#07090B', '#D6DEE4', '#0E1216', '#5E6A74'],
    loyal: ['#E6E9EE', '#A9B4C2', '#5E6B7D', '#2C3440', '#0B0E12', '#C3CBD6', '#12151A', '#4E5968'],
    blood: ['#FFD6D0', '#E8786A', '#B0261E', '#5A0E0A', '#1A0505', '#F09A8E', '#1E0A0A', '#8A2A24'],
    templars: ['#F2EAD6', '#B8AE98', '#6B5B45', '#2A2520', '#0B0A09', '#E8DFC9', '#14110E', '#6B5B45'],
    carc: ['#E6DDC8', '#A8B0B6', '#59636B', '#2A3138', '#070A0D', '#C9D3DA', '#0E1419', '#59636B'],
    xenos: ['#E8F5D0', '#A9D46A', '#5E8A2E', '#2C4214', '#0E1606', '#C3E39A', '#121A0B', '#4E6B2A'],
    tau: ['#FFF0D6', '#F0C27A', '#C8833A', '#5A3A14', '#160E04', '#F0C27A', '#1A130A', '#8A6A3A'],
    tyranid: ['#F3D6FF', '#C07AE0', '#7A2E9E', '#2E0E40', '#12061A', '#D7A6F0', '#170A1E', '#6B2E8A'],
    guard: ['#E4E2C8', '#B8B27A', '#6F7A45', '#3A4022', '#10120A', '#CFCB98', '#14160E', '#5E6A3A'],
    ork: ['#E6F5C8', '#9ED45A', '#4E8A1E', '#22400A', '#0C1604', '#B9E38A', '#111A08', '#4E7A2A']
  };
  const FACTIONS = [
    ['Necrons', 'necron'], ['Dark Angels', 'da'], ['Space Wolves', 'sw'], ['Aeldari', 'ae'], ['Adeptus Custodes', 'custodes'],
    ['Ultramarines', 'ultra', 'Parade-Born'], ['Deathwatch', 'dw'], ['Imperial Fists', 'if'], ['Blood Angels', 'blood'], ['Black Templars', 'templars'], ['Carcharodons', 'carc'],
    ['Space Marines (other chapter)', 'loyal'], ['Grey Knights', 'loyal'], ['Adepta Sororitas', 'blood'], ['Astra Militarum', 'guard'],
    ['Adeptus Mechanicus', 'blood'], ['Imperial Knights', 'loyal'], ['Imperial Agents', 'loyal'],
    ['World Eaters', 'khorne'], ['Death Guard', 'nurgle'], ['Thousand Sons', 'tzeentch'], ["Emperor's Children", 'slaanesh'],
    ['Chaos Space Marines', 'chaos'], ['Alpha Legion', 'alpha'], ['Chaos Daemons', 'khorne'], ['Chaos Knights', 'chaos'],
    ['Orks', 'ork'], ['Tyranids', 'tyranid'], ['Genestealer Cults', 'tyranid'], ["T'au Empire", 'tau'], ['Drukhari', 'slaanesh'], ['Leagues of Votann', 'tau']
  ];
  const RIVALS = [['necrons', 'Necrons', 'Pink dynasty'], ['darkangels', 'Dark Angels', ''], ['spacewolves', 'Space Wolves', ''], ['aeldari', 'Aeldari', '']];

  // ---------- heraldry: icons from game-icons.net (Lorc, Delapouite and contributors, CC BY 3.0) ----------
  const GI = {"laurels":"<path d=\"M234.7 18.05c-21 .2-38.8 2.5-62 10.2c-4.1 2-8.2 4.1-12.2 6.2c.8 5.26 3.2 10.77 5.5 14.7c-4.9 4.2-9.6 8.4-14.1 12.8c-3.7-5.5-6.6-11.4-8.3-17.4c-14.2 9.2-27.7 19.6-40.1 31.4c1.9 9.5 9.2 18.21 15.2 24.15c-3.7 5.2-7.2 10.4-10.5 15.7c-8.22-7.2-15.12-15.5-19.32-24.65C74.97 108.1 61.92 126 53.08 142.3c5.29 13 19.01 22.7 29.8 28.4c-2 6.1-3.7 12.2-5.1 18.4c-13.5-6.4-26.3-15.7-34.5-26.6c-8.7 20.1-14.7 40.7-18.2 61.4c9.63 15.5 30.57 22.9 46 25.9q.15 9.6.9 19.2c-17.79-2.7-37.26-9.6-49.9-20.4c-1.6 22.3-.5 44.5 3.4 66.2c15.25 13.7 41.14 15.3 58.6 13.7c2 6.1 4.1 12.2 6.5 18.1c-18.61 4.5-43.29 1.1-59.3-6.2c6.6 23.7 16.4 46.4 29.2 67.4c19.33 8.6 44.52 3.6 61.72-2.5c3.7 5.3 7.6 10.5 11.6 15.5c-17.8 9.5-39.9 11.5-57.52 10.1c12.3 16.3 26.62 31.2 42.72 44.4c4.9 1.1 10.5 1.1 16.7.3c11.7-1.7 25.2-7 37.9-14.7c16.7 13.5 34.9 24.7 54.1 33.1l7.5-17.2c-16-6.9-31.3-16.2-45.6-27.3c13.3-10.9 24.3-24 30.2-36.5c4.7-9.7 6.3-18.4 4.5-26.3c-10.7-5.7-20.6-12.5-29.5-20.3c-7.8 20.8-26.4 36.1-43.5 46c-4-4.9-7.9-9.9-11.6-15c16.8-9.8 39.9-27.5 39.1-47.1c-8.9-10.3-16.6-21.8-22.9-34.1c-12 14-30.7 22.5-46.5 26.7c-2.4-5.8-4.6-11.6-6.6-17.6c16.8-5.2 37.9-13 44.1-29.7c-4.3-11.5-7.5-23.6-9.7-36c-13.8 8.4-32 11.1-46.32 10.9c-.6-6.2-1-12.4-1.2-18.7c15.52-.6 33.92-2.5 44.92-14.3c-.8-12.6-.5-25.5.9-38.5c-13.4 2.8-29 .3-40.42-3.2c1.3-6 2.9-12.1 4.8-18.1c12.82 3.2 27.12 6.7 38.82.8c2.7-13.6 6.7-27.3 12-40.8c-9.9-1.8-20.2-6.3-27.7-10.7c3.3-5.3 6.8-10.5 10.5-15.7c8.1 4.2 16.3 8.8 25.2 8.4c5.7-11.6 12.3-22.65 19.5-32.75c-5.1-2.7-10-6.4-14.4-10.6c4.4-4.3 9.1-8.5 13.9-12.7c3.8 3.54 8 6.18 12.3 8.2c15.9-18.6 35.9-36.23 49-53.8zm38.4 0c15.4 20.75 33.8 35.63 48.9 53.7c4.6-1.76 9.1-5.23 12.3-8.1c4.9 4.2 9.5 8.4 13.9 12.7c-4.4 4.2-9.2 7.9-14.4 10.6c7.3 10.1 13.9 21.05 19.6 32.65c9-.1 18.4-4.4 25.2-8.4c3.7 5.2 7.2 10.4 10.4 15.7c-8.8 5.9-18.2 9.6-27.6 10.7c5.3 13.5 9.3 27.2 12 40.8c12.3 5.4 27.3 2.7 38.7-.8c1.9 6 3.5 12.1 4.9 18.1c-14.2 3.4-27.3 6.2-40.4 3.3c1.4 12.9 1.6 25.8.8 38.5c11.4 12.3 30.2 14.4 44.9 14.2c-.2 6.3-.5 12.5-1.2 18.7c-17.1-.5-32.8-2.5-46.3-10.9c-2.1 12.4-5.3 24.5-9.6 36.1c8.2 17.4 27.8 25.3 44.1 29.6c-2 6-4.2 11.8-6.6 17.6c-18.5-5.6-34.9-13-46.6-26.7c-6.3 12.4-13.9 23.8-22.9 34.1c1.5 22.4 22.4 37.8 39.2 47.1c-3.7 5.1-7.6 10.1-11.6 15c-19-11.8-36.6-25.8-43.5-46c-9 7.8-18.8 14.6-29.6 20.3c-1.8 7.9-.1 16.6 4.5 26.3c6 12.5 17 25.6 30.3 36.5c-14.3 11.1-29.6 20.4-45.6 27.3l7.4 17.2c19.3-8.4 37.4-19.6 54.1-33.2c12.7 7.8 26.2 13.1 38 14.8c6.2.8 11.8.8 16.7-.3c16.1-13.2 30.4-28.1 42.7-44.4c-18 1.7-37.9-2.3-56.5-9.7c-.3-.1-.7-.3-1.1-.4c4.1-5 7.9-10.2 11.7-15.5c18.2 7.8 43.7 11.7 61.6 2.5c12.8-21 22.6-43.7 29.2-67.4c-.4.2-.8.4-1.2.5c-20.5 6.4-40.1 7.6-58.1 5.7c2.4-5.9 4.5-12 6.5-18c19.1 1.7 45.2.1 58.6-13.8c3.9-21.7 5.1-43.9 3.4-66.2c-14.4 10.7-34.9 17.9-49.9 20.4c.5-6.4.9-12.8 1-19.2c16.8-4.8 37.9-10 45.9-25.9c-3.5-20.7-9.5-41.3-18.2-61.4c-9.4 11.6-23.1 21-34.4 26.5c-1.5-6.1-3.2-12.2-5.2-18.3c12-7.4 25.1-15.3 29.9-28.4c-10.1-18.7-22.2-35.8-35.9-51.05c-4.2 9.05-11.1 17.45-19.2 24.65c-3.3-5.3-6.8-10.5-10.6-15.7c6.2-7.17 14.2-14.71 15.2-24.15c-12.4-11.8-25.8-22.2-40-31.4c-1.8 6-4.7 11.9-8.3 17.4c-4.5-4.4-9.2-8.6-14.1-12.8c2.7-4.82 4.7-9.62 5.4-14.7c-4-2.1-8.1-4.2-12.2-6.2c-24.7-8.2-43.3-10.3-66.2-10.2\"/>","iron-cross": "<path  d=\"M486 371.316V142.75a399.06 399.06 0 0 1-185.685 69.28a399.14 399.14 0 0 1 70.973-186.002H142.72A399.06 399.06 0 0 1 212 211.714A399.14 399.14 0 0 1 26 140.74v228.57a399.06 399.06 0 0 1 185.685-69.28a399.14 399.14 0 0 1-70.973 185.944H369.28A399.06 399.06 0 0 1 300 300.342a399.14 399.14 0 0 1 186 70.974\"/>", "shark-jaws": "<path  d=\"M257.97 20.22C150.394 88.557 72.1 275.18 69.874 494.374h375.188c-2.2-219.194-79.52-405.817-187.094-474.156zm-18.845 163.06l18.344 36.282l18.342-36.28c9.99 2.326 19.72 6.537 29.063 12.437l4.156 48.56l20.095-28.624c7.938 8.123 15.48 17.558 22.594 28.156L345.436 279l18.375-15.344c24.39 44.295 42.05 103.6 49.532 170.78c-10.036-32.144-26.553-60.393-47.625-82.342l4-35.813L344.093 333a158 158 0 0 0-19.03-12.156l-3.345-40.97l-26.314 28.876c-7.31-2.074-14.792-3.58-22.437-4.438l-15.5-33.25l-15.5 33.282c-8.14.916-16.12 2.522-23.876 4.812l-24.875-27.28l-3.157 38.874a158.5 158.5 0 0 0-19.22 12.25l-25.624-16.72l4.03 35.814c-21.08 21.95-37.618 50.19-47.656 82.344c7.482-67.188 25.17-126.485 49.562-170.782L169.5 279l-6.28-35.188c7.37-10.983 15.213-20.71 23.468-29.03l19.25 27.374l3.937-46.312c9.4-5.963 19.193-10.22 29.25-12.563z\"/>", "eagle-emblem": "<path  d=\"M35.31 22.3C27.498 42.766 22.138 64.643 20 87.378l103.705 27.79l-4.838 18.052l-99.873-26.763c-.012.954-.035 1.905-.035 2.86a245 245 0 0 0 3.48 41.23h94.146v18.687H26.393a241.5 241.5 0 0 0 13.29 38.547l79.184-21.216l4.838 18.05l-75.64 20.27a243 243 0 0 0 20.396 31.636l61.933-35.756l9.343 16.183l-59.22 34.192a243 243 0 0 0 25.132 24.4l44.73-44.726l13.214 13.215l-43.055 43.052a240 240 0 0 0 28.186 17.357l28.734-49.772l16.186 9.346l-27.987 48.472a237.3 237.3 0 0 0 39.156 12.87c.99 3.566 2.08 7.103 3.25 10.593c-12.36 9.993-24.163 20.49-35.12 31.728a33.7 33.7 0 0 0-14.75-3.373c-18.707 0-33.874 15.164-33.874 33.873c0 1.715.13 3.402.377 5.05c2.02-11.514 12.06-20.265 24.153-20.265c3.103 0 6.068.582 8.8 1.633c-10.103 12.102-19.193 25.08-26.906 39.23c13.897-7.544 27.684-15.755 41.15-24.764a24.5 24.5 0 0 1 1.485 8.43c0 12.122-8.796 22.184-20.352 24.168a34 34 0 0 0 5.168.393c18.71 0 33.873-15.168 33.873-33.875c0-4.17-.757-8.16-2.134-11.848c10.033-7.467 19.823-15.43 29.26-23.984c2.978 5.705 6.203 11.034 9.65 15.818l-43.53 87.17c48.267 22.47 115.7 22.76 157.872 0l-42.13-84.36c3.722-4.81 7.21-10.25 10.426-16.14c8.577 7.617 17.428 14.77 26.483 21.508a33.8 33.8 0 0 0-2.13 11.836c0 18.707 15.165 33.873 33.874 33.873c1.758 0 3.486-.132 5.172-.39c-11.56-1.983-20.355-12.045-20.355-24.168c0-2.964.525-5.805 1.49-8.435c13.464 9.006 27.247 17.223 41.143 24.767c-7.71-14.148-16.78-27.136-26.877-39.238a24.5 24.5 0 0 1 8.775-1.623c12.09 0 22.13 8.75 24.15 20.262c.246-1.647.377-3.332.377-5.047c0-18.71-15.166-33.873-33.875-33.873a33.76 33.76 0 0 0-14.72 3.355c-10.007-10.27-20.74-19.908-31.946-29.12a209 209 0 0 0 5.132-16.886a238 238 0 0 0 23.2-8.283l-28.497-49.356l16.186-9.346l29.34 50.816c9.98-5.11 19.555-10.9 28.672-17.308l-44.146-44.147l13.215-13.216l45.926 45.922a243 243 0 0 0 25.666-24.6l-60.95-35.19l9.343-16.182l63.748 36.804a243 243 0 0 0 20.87-32.07l-77.93-20.883l4.837-18.05l81.534 21.847a241.7 241.7 0 0 0 13.584-39.178h-92.836v-18.687h96.777a245.4 245.4 0 0 0 3.48-41.23c0-1.19-.025-2.376-.044-3.563L397.652 133.22l-4.836-18.054L499.09 86.69c-2.18-22.49-7.52-44.13-15.254-64.39h-.004c-26.517 41.51-83.592 73.934-154.764 87.02c12.67 15.603 20.442 35.52 20.442 57.233c0 31.196-15.723 58.718-39.604 75c-21.27-12.407-42.907-28.878-45.52-43.814l17.653-3.81l-2.235-10.352c15.67-11.335 33.936-9.138 53.433-.01l-18.302-40.414l-41.903 9.04l-2.846-13.188V139l-80.87 17.453l20.458 30.266c-8.595 19.678-2.717 41.68 5.45 58.56c-27.204-15.57-45.592-44.998-45.592-78.73c0-21.713 7.772-41.63 20.44-57.232C118.904 96.234 61.83 63.81 35.312 22.3zm216.45 132.567c5.244-.056 9.98 3.573 11.13 8.9c1.312 6.085-2.557 12.084-8.644 13.397s-12.085-2.556-13.398-8.643c-1.314-6.085 2.556-12.086 8.642-13.4c.76-.163 1.52-.245 2.27-.253z\"/>", "daemon-skull": "<path  d=\"M142.026 16.89C94.242 38.888 62.71 74.257 62.71 113.927c0 26.11 13.42 50.288 36.22 70.04c-11.664 25.398-18.99 53.91-20.81 84.212c17.194.562 33.53 4.205 48.192 11.7c41.566 21.25 61.083 66.944 57.787 121.093a287 287 0 0 0 23.122 4.58c.894-16.76.83-33.468-.496-50.122l18.63-1.485c1.438 18.035 1.466 36.014.458 53.938c8.022.76 16.14 1.21 24.322 1.382V353.03h18.687v56.13c7.83-.25 15.693-.755 23.565-1.514c-.995-17.845-.96-35.745.47-53.7l18.63 1.485c-1.323 16.597-1.39 33.247-.504 49.95c7.307-1.07 14.6-2.355 21.863-3.843c-3.467-54.395 16.04-100.333 57.748-121.656c14.66-7.497 30.998-11.142 48.19-11.702c-1.843-30.716-9.343-59.594-21.284-85.252c22.08-19.56 35.044-43.346 35.044-69c0-39.67-31.532-75.04-79.316-97.035C386.283 33.46 394.32 53.31 394.32 74.27c0 42.688-31.51 79.614-77.026 97.146l-6.14-14.3c11.148-4.44 21.233-10.197 29.876-16.964c10.1-7.905 18.202-17.087 23.91-27.154c-29.85-25.333-66.642-40.283-106.488-40.283c-40.34 0-77.554 15.314-107.6 41.223c5.674 9.7 13.588 18.555 23.372 26.214c9.67 7.57 21.145 13.877 33.894 18.49l-6.125 14.264c-47.677-16.863-81.06-54.696-81.06-98.636c0-20.96 8.038-40.81 21.093-57.377zm10.286 183.128c.054-.004.1.004.127.037c18.414 23.35 51.93 39.697 91.086 43.162c-5.892 19.698-26.99 34.53-52.67 34.53c-30.21 0-55.148-20.584-55.148-45.517c.002-12.465 6.205-23.997 16.11-32.173c.083.094.33-.027.494-.04zm211.668.002c.053-.003.1.006.138.04c9.907 8.175 16.112 19.707 16.112 32.173c0 24.93-24.937 45.515-55.15 45.515c-25.68 0-46.776-14.83-52.67-34.53c39.156-3.466 72.673-19.813 91.087-43.16c.112.085.322-.03.483-.038M258.4 244.174c5.625 27.42 13.928 54.84 32.91 82.26c-20.274 5.432-44.818 5.627-65.82 0c17.968-27.42 26.834-54.84 32.91-82.26m-76.31 175.54c-2.34 15.4-6.413 31.3-12.25 47.372a169 169 0 0 0 27.663 14.637c3.627-19.225 6.537-38.376 8.33-57.455a309 309 0 0 1-23.744-4.553zm152.802.48a409 409 0 0 1-22.526 3.888c1.777 18.972 4.655 38.015 8.248 57.13a169 169 0 0 0 26.452-14.126c-5.776-15.906-9.824-31.644-12.174-46.893zm-41.094 6.115c-8.335.8-16.668 1.323-24.975 1.58v65.694a158 158 0 0 0 33.973-6.01c-3.898-20.343-7.058-40.766-8.998-61.265zm-69.402.237c-1.953 20.54-5.13 41.002-9.043 61.385a158 158 0 0 0 34.783 5.773v-65.713a349 349 0 0 1-25.74-1.445\"/>", "alien-skull": "<path  d=\"M257.656 19.625c-65.485.31-130.968 43.688-156.375 129.563C177.4 179.51 212.086 215.23 208.47 236v.063c-2.34 13.46-20.787 20.62-54.47 16.093c-6.255-.098-12.713-1.27-19.094-3.5c-11.202-2.527-23.665-6.108-37.344-10.844c24.63 22.796 53.14 39.59 83.47 50.125c5.516 101.8 24.05 168.38 46.437 199.407c.95-143.2 15.592-215.647 30.186-216.063c14.642-.425 29.205 71.648 30.063 217.314c22.446-30.322 40.966-96.94 46.436-200.28c28.115-9.725 54.978-25.102 79.03-46.345c-9.928 3.08-19.13 5.504-27.592 7.31c-5.366 1.7-10.762 2.68-16.03 2.876c-33.8 4.578-52.314-2.61-54.658-16.094V236c-2.255-12.955 10.413-31.72 38.72-51.375c15.652-10.87 36.077-22.02 61.437-32.594c-24.647-88.774-91.028-132.72-157.407-132.405zM132.47 191.655c-.922.003-1.822.05-2.69.126c-6.93.6-11.378 3.226-13.436 6.564s-2.198 7.545.562 13.156c2.76 5.61 8.615 11.848 16.875 16.313s17.1 6.16 24.032 5.562c6.933-.598 11.38-3.225 13.438-6.563s2.167-7.545-.594-13.156c-2.76-5.61-8.583-11.816-16.844-16.28c-7.227-3.908-14.895-5.73-21.343-5.72zm257.467 0a39 39 0 0 0-2.843.126c-5.796.44-12.305 2.246-18.5 5.595c-8.26 4.465-14.115 10.67-16.875 16.28c-2.762 5.612-2.622 9.82-.564 13.157c2.058 3.338 6.506 5.965 13.438 6.563s15.77-1.098 24.03-5.563s14.084-10.7 16.845-16.312c2.76-5.61 2.65-9.82.592-13.156c-2.058-3.338-6.505-5.965-13.437-6.563a32 32 0 0 0-2.688-.124z\"/>", "ankh": "<path  d=\"M79.625 22.03c-16.694.274-31.01 5.33-41.22 15.658C5.743 70.735 27.53 145.313 87.22 204.313c39.992 39.53 91.568 45.025 125.03 56.593c-38.19 35.214-80.874 67.594-130.438 99.28l61.594 60.876c33.267-53.395 68.052-99.412 106.406-140.593c66.466 44.55 113.05 126.476 157.594 206.967l85.5-86.5c-82.206-44.252-164.58-88.96-209.25-154.687c41.214-39.214 86.72-74.14 138.656-107.344L360.72 78.03c-30.47 48.903-61.926 91.685-96.845 130.564c-11.704-33.438-18.262-84.475-58.28-124.032C164.556 44 116.35 21.43 79.624 22.032zm16.97 47.064c20.94.415 50.89 16.01 77.436 42.25c36.934 36.505 53.305 79.782 36.595 96.687c-16.71 16.907-60.194 1.037-97.125-35.468C76.57 136.06 60.165 92.75 76.875 75.844c4.7-4.755 11.525-6.913 19.72-6.75\"/>", "winged-sword": "<path  d=\"M246.78 18.656v101.22c7.988.266 16.003.267 24 0V18.655zm-72.155 110.406v30.813h168.313v-30.813c-55.755 12.73-113.104 12.604-168.313 0m-150.28 35.063l9.343 37.594l132.187 8.093l9.406.562l-.655 9.406c-2.594 38.077 5.257 78.673 25.563 112.44l7.625-146.47l-183.47-21.625zm463.186 0l-177.842 20.97l7.187 137.843c16.457-31.775 22.736-68.503 20.375-103.157l-.625-9.405l9.375-.563l132.188-8.093zm-260.624 14.438L216.25 383.188v44.187l44.375 66.53l43.03-65.342l-13-250h-22.53V429.5h-18.688V178.562zM38.186 220.72c3.52 11.234 8.043 23.026 13.345 34.936l104.5-8.562a232 232 0 0 1-.28-19.188zm435.502 0l-117.563 7.186c.172 6.353.077 12.768-.28 19.188l104.5 8.562c5.3-11.91 9.825-23.702 13.342-34.937zm-315.844 45l-97.72 8a439 439 0 0 0 17.782 31.81l84.063-18.28a219 219 0 0 1-4.126-21.53zm196.187 0a219 219 0 0 1-4.092 21.53l84.03 18.28a438 438 0 0 0 17.782-31.81zM167.19 305.25l-78.44 17.063c6.694 9.8 13.67 19.05 20.75 27.468l64.938-26.342a196 196 0 0 1-7.25-18.188zm177.5 0a197 197 0 0 1-7.25 18.188l64.937 26.343c7.08-8.415 14.056-17.666 20.75-27.467l-78.438-17.063z\"/>", "wolf-head": "<path  d=\"M179.3 38.94C154.7 77.7 142.7 139.7 168.4 185.9l-16.3 9.2c-6.7-11.9-11.2-24.4-13.9-37.2c-34.5-6.3-69.42-7.5-104.98-2.1c34.07 10.1 52.77 23.7 76.68 46.7c-26.82 9.7-60.25 30.2-92.93 70.2c35.47-8.8 64.83-11.5 89.43-6.3c-36.94 22.5-64.06 56.1-88.34 114.1c35.9-17.2 64.89-18.8 102.94-18.8c-23.07 32.7-35.27 77.2-36.31 112.8c24.51-26 57.61-60.2 87.21-79c3 29.9 15 58.3 35.9 85.3c-.2-43.9 10.3-88.3 31.6-133.4c-18.8 9-32.4 18.1-49.9 29.3c6.2-27.9 12.4-55.8 18.7-83.7c-23.3 2.4-39 10-60.5 18.5c16.3-33.1 32.7-66.1 49.1-99.2l16.8 8.3l-28.4 57.4c18.4-4.4 28.7-4.1 45.7-1.3c-4.5 20.4-9 40.7-13.6 61c65.3-36.2 148.3-45.9 226.7-50c7.6-12.9 13.8-24.2 18.8-34.8l-6.3-24.4l-24.4 30.8l-7.8-27.5l-22.5 29.2l-7.5-26.1l-23.9 31.5l-7.7-28.2l-23.8 31.4l1.2-41.1l22.6-42.7l7.6 28.3l23.9-31.5l7.6 28.2l23.5-30l6.5 26.9l24.5-30.8l7.8 27.5l24.6-32c2.3-10.8 4.6-22.4 7.4-35.7c-55.5-3.7-106.3 4.8-154 9.8c-38-20.8-80.8-26.8-121.9-18.5c-13.6-29.69-27.2-59.38-40.9-89.06M325.5 158.3c-4.5 14.2-13 18.3-24.7 20.6c-16.1-4.4-28.3-15.5-34.4-30.2c20.4-3.8 42.4 3.4 59.1 9.6\"/>", "fire-gem": "<path  d=\"M201.2 32L215 87h82l13.8-55zm-17 5.84L73.24 121.1l53.36 13.3l71.1-42.69zm143.6 0l-13.5 53.87l71.1 42.69l53.4-13.3zM210.4 105L137 149.1v213.8l73.4 44.1h91.2l73.4-44.1V149.1L301.6 105zM64 137.2v237.6l55-13.8V151zm384 0L393 151v210l55 13.8zm-192.1 2.4c-14.6 14.6-21.8 29.1-7.3 50.9c20.2 30.3 95 51.9 94.7 116.5c0 43.6-36.5 65.4-87.4 65.4s-87.3-36.4-87.3-72.7c0-14.5 7.3-29.2 29.1-43.7c-14.6 36.4 0 58.2 21.9 58.2c21.7 0 36.3-21.8 36.3-36.4c0-36.3-43.6-43.6-43.6-87.3c0-23.3 14.5-43.6 43.6-50.9m-129.3 238l-53.36 13.3l110.96 83.3l13.5-53.9zm258.8 0l-71.1 42.7l13.5 53.9l111-83.3zM215 425l-13.8 55h109.6L297 425z\"/>", "crested-helmet": "<path  d=\"m207.47 18.875l35.968 162.25c.29 1.087.86 1.863 2.562 2.813c1.7.95 4.433 1.66 7.22 1.656c2.785-.003 5.543-.703 7.25-1.656c1.704-.954 2.276-1.75 2.56-2.813L299 18.875zm88.936 98.03l-15.22 68.657l-.06.22l-.032.187c-1.747 6.52-6.404 11.432-11.5 14.28s-10.738 4.026-16.344 4.03c-5.606.007-11.24-1.15-16.344-4c-5.104-2.847-9.782-7.784-11.53-14.31l-.032-.19l-.063-.218l-14.686-66.218C175 133.818 147.157 164.56 135.53 202.97a459 459 0 0 0 32.314 15.468c26.527 11.43 60.506 22.55 88.5 22.406c28.003-.145 61.81-11.56 88.156-23.22a449 449 0 0 0 32.938-16.25c-12.624-39.968-42.853-71.398-81.032-84.468zm88.97 101.376c-8.365 4.538-19.865 10.487-33.313 16.44c-27.522 12.18-62.797 24.673-95.625 24.843c-32.838.17-68.293-12-96-23.938c-13.614-5.866-25.276-11.744-33.72-16.22c-.51 70.485-3.647 138.64 9.626 188.376c7.135 26.737 18.683 47.874 37.375 62.595c12.092 9.525 27.443 16.584 47.25 20.375V330.125c-28.654 16.12-67.847 2.81-81.064-30.625c8.825-22.322 30.127-33.074 50.78-33c24.583.087 48.224 15.532 48.876 45.094h.094v89h36.03l.002-87.72q-.017-.013-.032-.03c0-.422.022-.834.03-1.25c.655-29.562 24.327-45.007 48.908-45.094c20.654-.074 41.926 10.678 50.75 33c-13.204 33.403-52.324 46.702-80.97 30.656v160.47c19.544-3.867 34.6-11 46.438-20.595c18.396-14.908 29.6-36.337 36.375-63.342c12.59-50.184 8.804-118.532 8.188-188.407z\"/>", "omega": "<path  d=\"M259.05 73.105C155.53 73.105 71.2 163.14 71.2 274.65c0 42.674 12.272 82.822 33.265 115.45c-24.44-13.235-48.45-29.26-72.4-48.92v95.108H206.87c-48-33.257-81.532-82.232-81.532-138.158c0-74.567 59.88-135.015 133.71-135.015c73.832 0 133.712 60.448 133.712 135.015c0 55.926-33.53 104.9-81.53 138.158h174.803V341.18c-24.02 19.865-48.295 36.2-73.052 49.57c21.297-32.77 33.92-73.09 33.92-116.1c0-111.51-84.33-201.545-187.85-201.545z\"/>", "angel-wings": "<path  d=\"M92.438 28.97C75.263 47.722 60.826 69.69 49.593 94L167.5 204.656l-12.78 13.625L41.905 112.407c-9.19 24.257-15.377 50.455-18.156 77.844l116.156 58.72l-8.437 16.686L22.312 210.47c-.963 24.45.777 49.666 5.437 75.155l100.53 8.313l-1.53 18.625l-94.97-7.844c.743 3.09 1.515 6.185 2.345 9.28c4.43 16.51 9.94 32.34 16.375 47.438c8.757-1.615 17.808-3.274 27.813-5.157c26.754-5.033 53.093-10.06 53.093-10.06l3.5 18.342s-26.368 5.054-53.156 10.094c-8.012 1.508-15.797 2.97-23.188 4.344c8.65 17.507 18.62 33.887 29.657 49l60.843-34.28L158.22 410l-58.407 32.938c12.202 14.79 25.482 28.186 39.624 40l17.157-20.344c1.38-20.537 4.963-37.725 14.375-51.72c6.338-9.425 15.44-16.826 27.155-21.937C189.86 376.115 183.3 361.62 179 345.594c-14.526-54.15.58-108.49 36.406-138.094L92.436 28.97zm330.843 0L300.314 207.5c35.826 29.604 50.964 83.943 36.437 138.094c-4.26 15.877-10.768 30.237-18.938 42.97c12.345 5.384 21.554 13.502 27.5 23.655c7.81 13.333 10.495 29.117 11.407 47.467l19.592 23.25c14.14-11.813 27.423-25.208 39.625-40L357.5 410l9.188-16.28L427.53 428c11.04-15.117 21.006-31.49 29.658-49c-7.4-1.374-15.207-2.836-23.22-4.344c-26.787-5.04-53.156-10.094-53.156-10.094l3.5-18.343s26.372 5.027 53.125 10.06a8378 8378 0 0 0 27.813 5.19a357 357 0 0 0 16.375-47.47c.83-3.095 1.602-6.19 2.344-9.28L389 312.56l-1.53-18.625l100.53-8.31c4.66-25.49 6.37-50.705 5.406-75.156L384.25 265.655l-8.438-16.687L492 190.25c-2.783-27.4-8.956-53.61-18.156-77.875L361.03 218.28l-12.81-13.624L466.124 94c-11.236-24.31-25.668-46.277-42.844-65.03zM256.095 290.03c-10.452 0-20.172 5.342-27.78 15.126c-7.61 9.784-12.658 23.895-12.658 39.688s5.047 29.903 12.656 39.687c7.61 9.785 17.33 15.158 27.782 15.158s20.14-5.373 27.75-15.157s12.656-23.893 12.656-39.686s-5.047-29.904-12.656-39.688s-17.298-15.125-27.75-15.125zm39.625 111.19c-10.36 11.14-24.236 18.342-39.626 18.342c-14.957 0-28.49-6.798-38.75-17.406c-2.662.66-5.147 1.384-7.438 2.188c-11.464 4.02-18.388 9.46-23.437 16.97c-9.19 13.66-11.542 37.05-11.907 69.248h163.812c-.135-31.55-1.154-55.19-9.188-68.906c-4.42-7.55-10.596-12.946-21.562-17.062c-3.467-1.302-7.433-2.437-11.906-3.375z\"/>", "fleur-de-lys": "<path  d=\"M256 24c-31.466 48-62.932 96-62.932 160c0 56.794 37.144 113.568 45.514 148h34.836c8.37-34.432 45.514-91.206 45.514-148c0-64-31.466-112-62.932-160M98.637 206c-47.2 0-78.664 32-78.664 80c0 32 22.115 63.526 62.93 64c-15.732-16 .002-64 31.468-64c31.89 0 56.58 21.916 69.253 46h33.828c-13.744-47.52-49.108-126-118.813-126zm314.726 0c-69.705 0-105.07 78.48-118.814 126h33.827c12.673-24.084 37.362-46 69.252-46c31.465 0 47.2 48 31.466 64c40.816-.474 62.93-32 62.93-64c0-48-31.464-80-78.663-80zM153.076 350c-38.705 0-54.44 16-54.44 48c0 16 15.734 48 47.2 48c35.4 0 61.948-27 73.01-54h-35.682c-4.657 3.57-11.5 6-21.596 6c-15.733 0-31.464-32-8.492-48m37.694 0c.017.064.03.127.048.19c-13.29 2.16-12.694 23.343 1.793 23.79v.02H319.39l-.003-.02c14.486-.447 15.083-21.63 1.792-23.79c.017-.063.03-.126.048-.19zm168.154 0c22.972 16 7.24 48-8.492 48c-10.096 0-16.94-2.43-21.596-6h-35.682c11.062 27 37.61 54 73.01 54c31.466 0 47.2-32 47.2-48c0-32-15.735-48-54.44-48m-118.656 42c-15.733 16-15.734 48-31.467 64l31.468-16c0 16 0 32 15.732 48c15.733-16 15.732-32 15.732-48l31.467 16c-15.734-16-15.735-48-31.468-64z\"/>", "cog": "<path  d=\"M234.875 18.78c-26.087 2.367-51.557 8.56-74.875 18.782c15.37 32.763 14.222 66.706-6.72 82.407c-20.835 15.617-54.055 7.965-81.124-15.69c-16.246 19.452-29.336 41.36-38.875 65.626c33.83 12.333 56.635 37.665 52.94 63.5c-3.698 25.835-32.697 43.74-68.626 46.094c2.338 25.796 8.91 50.778 18.937 73.875c17.81-8.182 35.793-11.09 51.095-8.938c13.032 1.87 23.927 7.015 31.156 16.657c15.817 21.097 7.603 54.713-16.78 81.97c19.516 16.35 42.216 29.444 66.594 39.03c12.33-33.828 37.655-56.634 63.5-52.938c25.844 3.697 43.74 32.696 46.094 68.625c26.087-2.365 51.557-8.555 74.875-18.78c-15.766-32.997-14.26-67.588 6.843-83.406c9.64-7.23 22.568-9.022 35.594-7.125c15.112 2.16 31.19 10.25 45.563 22.78c16.088-19.345 29.4-41.51 38.875-65.594c-33.83-12.332-56.635-37.653-52.938-63.5c3.697-25.846 32.665-43.772 68.594-46.125c-2.36-25.944-8.774-50.663-18.906-73.874c-32.612 15.117-66.66 13.145-82.282-7.687c-15.696-20.944-7.252-53.86 16.688-81c-19.52-16.352-42.248-29.447-66.625-39.032c-12.332 33.828-37.657 56.66-63.5 52.968c-25.846-3.693-43.744-32.696-46.095-68.625zm21.656 95.126c79.626 0 144.376 64.752 144.376 144.375c0 79.626-64.75 144.376-144.375 144.376c-79.624 0-144.374-64.75-144.374-144.375c0-79.624 64.75-144.374 144.375-144.374zm0 18.688c-69.524 0-125.686 56.162-125.686 125.687s56.162 125.69 125.687 125.69s125.69-56.164 125.69-125.69c0-69.522-56.164-125.686-125.69-125.686zm.033 15.125c61.094 0 110.625 49.53 110.625 110.624c0 61.095-49.53 110.625-110.625 110.625s-110.625-49.53-110.625-110.626c0-61.095 49.53-110.625 110.625-110.625z\"/>", "black-knight-helm": "<path  d=\"M256 16c-36.446 0-73.264 13.433-139.97 40h279.94C329.263 29.433 292.445 16 256 16M95.344 72L64 448c56 28 112 31.5 168 31.938V240H112v-48h288v48H280v239.938C336 479.5 392 476 448 448L416.656 72zm64.875 88a8 8 0 0 1 7.78 8a8 8 0 0 1-16 0a8 8 0 0 1 8.22-8m48 0a8 8 0 0 1 7.78 8a8 8 0 0 1-16 0a8 8 0 0 1 8.22-8m48 0a8 8 0 0 1 7.78 8a8 8 0 0 1-16 0a8 8 0 0 1 8.22-8m48 0a8 8 0 0 1 7.78 8a8 8 0 0 1-16 0a8 8 0 0 1 8.22-8m48 0a8 8 0 0 1 7.78 8a8 8 0 0 1-16 0a8 8 0 0 1 8.22-8M248 240v240q4 .002 8 0c4-.002 5.333.002 8 0V240zm-120 48h16v16h-16zm32 0h16v16h-16zm32 0h16v16h-16zm112 0h16v16h-16zm32 0h16v16h-16zm32 0h16v16h-16zm-240 32h16v16h-16zm32 0h16v16h-16zm32 0h16v16h-16zm112 0h16v16h-16zm32 0h16v16h-16zm32 0h16v16h-16zm-240 32h16v16h-16zm32 0h16v16h-16zm32 0h16v16h-16zm112 0h16v16h-16zm32 0h16v16h-16zm32 0h16v16h-16z\"/>", "shining-sword": "<path  d=\"M302.5 20.875c-67.34.686-140.223 31.223-198 89C30.546 183.83 1.717 282.77 22.812 362.97l61.938-36.19l-51.28 15.783l12.624-38.5l48.75-20.344l-41.688 1.405l20.25-38.563l64.53-2.03l-51.374-17.595L115 188.813l49.78 17.032l-34.468-34.5l34.22-34.22l35.562 35.564l-17.125-51.844l38.593-28.906l16.468 49.28l1.72-60.968l39.53-21.22L290 107.126l8.688-55.656l37.03-11.19l2.594 43.97l19-56.875c-17.53-4.543-35.956-6.692-54.812-6.5m134.688 53.72l-81.72 31.25L194.126 266.78c.514 2.04.78 4.178.78 6.376c0 14.36-11.638 26-26 26c-14.36 0-26-11.64-26-26c0-1.422.125-2.827.345-4.187c-12.834 13.486-19.27 30.975-19.375 48.31c14.055 0 28.187 4.393 40.25 12.845c-20.046 11.696-45.246 36.88-56.97 56.938c-3.675-2.41-7.454-4.202-11.03-5.032q-2.491-.574-4.406-.655c-3.83-.17-6.058.963-7.376 2.28c-1.757 1.758-3.166 5.112-1.625 11.75c3.08 13.28 19.22 29.42 32.5 32.5c6.64 1.542 9.992.133 11.75-1.624c1.756-1.756 3.165-5.14 1.624-11.78c-.86-3.7-2.745-7.612-5.28-11.406c20.157-11.808 45.466-37.173 57.06-57.25c9.418 12.487 14.32 27.4 14.376 42.312c17.233-.035 34.447-6.443 47.875-19.03a27 27 0 0 1-1.72.062c-14.36 0-26-11.67-26-26.032c0-14.36 11.64-26 26-26c1.5 0 2.978.132 4.407.375l161.125-160.717l30.75-82.22zm-63.313 50.343l13.22 13.218L200.968 324.25l-13.22-13.22l186.127-186.09zm111.313 30.812L427.5 173.72l43.47 1.81l-11.158 37.064l-59.406 5.312L452.22 232l-20.658 40.063l-60.968 1.718l49.25 16.47l-28.906 38.594l-52.907-18.188l36.658 36.625l-34.25 34.22l-33.407-33.406l15.94 48.72l-38.095 28.436l-17.625-51.375l-2 64.53l-39.125 19.69l1.75-43.908l-20.688 51l-38.468 12.625l14.843-48.312l-37 59.344c80.686 22.506 180.95-6.048 255.906-81c73.73-73.73 103.107-172.08 82.717-252.094z\"/>", "dread-skull": "<path  d=\"M220.09 25.297c-34.308 4.9-67.18 17.336-94.668 37.256l69.03 139.824l-109.487-99.363c-28.304 39.302-42.5 93.27-31.61 163.675l15.22 94.37l70.474-13.275l3.458 18.365l-15.444 2.91l44.65 127.653H197.2l-7.827-62.03l18.533-2.34l8.123 64.37h29.72V431.22h18.688v65.493h29.724l8.12-64.37l18.536 2.34l-7.828 62.03h25.578l44.465-127.135l-18.195-3.428l3.46-18.365l70.362 13.252l18.28-94.455c10.763-69.744-3.717-123.52-32.372-162.865l-108.713 98.66L384.36 63.613c-27.52-20.056-60.386-32.763-94.653-37.982l-34.52 164.485zm-92.182 192.266c4.232.063 8.63.81 13.186 2.208c-7.603 6.918-12.375 16.89-12.375 27.978c0 20.887 16.93 37.816 37.813 37.816c15.928 0 29.548-9.85 35.12-23.793l29.136 22.365l-81.8 26.383l-.226.062c-15.9 4.26-30.327.71-40.15-7.498c-9.82-8.21-15.218-20.12-17.12-32.207s-.44-24.64 5.342-35.068c5.78-10.43 17.11-18.454 31.072-18.244zm216.53 16.656a37.7 37.7 0 0 0-2.502 13.528c0 20.887 16.93 37.816 37.814 37.816s37.814-16.93 37.814-37.816c0-.565-.018-1.125-.043-1.684c2.2 7.927 2.488 16.48 1.177 24.81c-1.902 12.087-7.3 24-17.12 32.208c-9.823 8.21-24.248 11.76-40.15 7.498l-.226-.062l-81.8-26.383l65.038-49.916zm-89.21 57.173l40.026 101.834l-17.07 7.064l-22.957-35.558l-22.957 35.56l-17.66-7.065l40.617-101.834z\"/>", "horned-skull": "<path  d=\"m162.406 17.094l-2.5 5.468A93 93 0 0 0 155.5 34.25C97.803 42.108 55.046 78.007 34.562 126.188c-24.72 58.145-17.926 133.66 28.313 199.968l18.75 26.875l-1.875-32.717c-2.258-39.849 6.348-76.108 24.813-105.125c1.163 4.493 3.05 8.937 5.5 13.125c6.947 11.873 18.43 22.89 33.124 31.375c10.822 6.247 21.975 10.296 32.594 12.03l-16.655 153.594l-.625 5.72l4.813 3.124l88.187 57.25l5.063 3.28l5.093-3.28l88.78-57.22l4.845-3.123l-.624-5.75l-16.625-153.438c10.954-1.626 22.518-5.72 33.72-12.188c14.695-8.484 26.177-19.5 33.125-31.375c2.217-3.788 3.975-7.79 5.156-11.843c17.908 28.798 26.226 64.58 24 103.843l-1.842 32.718l18.75-26.874c46.238-66.307 53-141.823 28.28-199.97c-20.405-47.997-62.914-83.802-120.28-91.842a90 90 0 0 0-5.282-12.25l-2.625-5H162.406zm12.28 18.687h164.75c12.584 29.53 5.358 68.857-19.28 104.47l-7.437 10.78l12.592 3.564c18.38 5.154 33.995 12.365 45.407 20.53c-12.85.732-26.853 5.117-40.345 12.907c-14.695 8.486-26.208 19.502-33.156 31.376q-.619 1.053-1.19 2.125l-.03-.03c-23.524 44.524-31.757 128.354-22.656 218.156l17.812-11.5c-5.25-63.274-1.185-123.153 9.188-164.156c5.136 4.396 11.757 6.967 18.875 8.063l16.217 149.562l-2.718 1.75l.092.125l-71.093 45.844l-5.095 3.28l-5.063-3.28l-70.625-45.844l.094-.125l-2.718-1.75L194.5 272.22c7.398-.96 14.313-3.467 19.688-7.908c10.354 41.11 14.392 101.066 9.093 164.375l17.782 11.563c8.678-84.91 1.864-164.532-18.718-210.75c-1.156-3.452-2.728-6.85-4.625-10.094c-6.95-11.874-18.43-22.89-33.126-31.375c-13.383-7.725-27.268-12.09-40.03-12.874c11.265-7.91 26.54-14.9 44.5-20L200.186 152l-5.438-10.22c-21.613-40.676-31.158-75.677-20.063-106zm-22.905 17.626c-2.428 27.328 6.36 56.236 20.876 85.938c-31.03 11.238-56.185 29.474-74.562 52.875l14.312-45l-38.437 32.03l7.843-49.125l-31.344 50.53l-4.845-30.374c1.69-5.79 3.72-11.403 6.03-16.843c17.48-41.113 51.72-71.697 100.126-80.03zm211.657.282c47.646 8.687 81.383 39.045 98.688 79.75a153.4 153.4 0 0 1 7.5 22.312l-37.906-31.53l25.967 57.155l-60.5-42l33.47 46.28l-31.688-11.56a160 160 0 0 0-11.533-9.69c-.028-.022-.065-.038-.093-.06c-6.315-5.24-13.66-9.945-21.844-14.126c-.128-.067-.247-.155-.375-.22c-.326-.175-.672-.326-1-.5a180 180 0 0 0-21.72-9.72c16.575-27.99 24.514-58.36 21.033-86.093zm-222.718 140c9.668.056 22.326 3.454 34.53 10.5s21.46 16.31 26.344 24.656c4.883 8.345 5.113 14.647 2.906 18.47c-2.207 3.82-7.77 6.742-17.438 6.686c-2.976-.017-6.245-.34-9.687-1a19.72 19.72 0 0 0 4.125-12.094c0-10.982-8.893-19.906-19.875-19.906c-9.475 0-17.41 6.63-19.406 15.5c-7.13-5.62-12.642-11.83-16.032-17.625c-2.257-3.856-3.513-7.278-4-10.22h.093c0-3.024.52-6.028 1.532-9.03c2.49-3.437 7.905-5.99 16.907-5.938zm233.5 0c9.046-.053 14.496 2.505 16.967 5.968c.005.007-.004.025 0 .03c.99 2.987 1.47 5.978 1.47 8.97h.093c-.488 2.94-1.744 6.363-4 10.22c-3.583 6.122-9.553 12.697-17.28 18.56c-1.64-9.33-9.762-16.436-19.564-16.436c-10.982 0-19.875 8.924-19.875 19.906c0 4.653 1.606 8.894 4.283 12.28c-2.986.512-5.822.8-8.438.814c-9.67.056-15.23-2.866-17.438-6.688c-2.206-3.82-1.976-10.123 2.907-18.468s14.17-17.61 26.375-24.656c12.203-7.046 24.83-10.444 34.5-10.5\"/>", "fly": "<path  d=\"m230.885 20.055l-13.77 11.593l6.04 7.172a55.4 55.4 0 0 0-9.505 2.094c-9.973 3.122-18.352 8.67-24.072 15.83s-8.89 16.632-6.168 25.797a23.6 23.6 0 0 0 1.639 4.047c-1.28 2.858-2.049 5.954-2.049 9.263c0 9.994 4.36 22.052 16.104 29.64c.098.063.205.121.304.185a56 56 0 0 0-7.584 8.629l-40.709-13.569l-30.576-91.73l-17.078 5.691l33.424 100.27l47.28 15.76c-.774 3.14-1.165 6.214-1.165 9.124v.64l4.637 32.458a204 204 0 0 1 16.338-9.148c.166-.083.337-.156.505-.235l-2.607-18.246c20.454-8.814 37.288-13.142 54.121-13.084c16.815.058 33.654 4.492 54.125 13.14l-2.598 18.19c.168.079.339.152.504.235a204 204 0 0 1 16.338 9.148L329 160.49v-.639c0-2.91-.387-5.985-1.158-9.127l47.273-15.757l33.424-100.27l-17.078-5.691l-30.576 91.73l-40.705 13.568a56.2 56.2 0 0 0-8.455-9.435C323.115 117.577 329 106.51 329 95.851c0-3.31-.769-6.405-2.049-9.263a23.6 23.6 0 0 0 1.639-4.047c2.722-9.165-.448-18.636-6.168-25.797c-5.72-7.16-14.099-12.708-24.072-15.83a55.4 55.4 0 0 0-9.506-2.094l6.04-7.172l-13.769-11.593l-21.148 25.113a27.7 27.7 0 0 0-3.965 3.568a27.6 27.6 0 0 0-3.967-3.566zm-2.27 36.474c3.079-.065 5.88.314 8.178 1.024c4.596 1.418 6.709 3.642 7.398 5.962c.69 2.321.147 5.379-2.896 9.188s-8.478 7.675-15.29 9.807c-6.81 2.131-13.423 2.035-18.019.617s-6.707-3.642-7.396-5.963s-.147-5.378 2.896-9.188c3.043-3.809 8.479-7.674 15.29-9.806c3.405-1.066 6.76-1.576 9.84-1.64zm54.77 0c3.078.065 6.434.575 9.84 1.64c6.81 2.133 12.244 5.998 15.287 9.807s3.588 6.865 2.898 9.186s-2.802 4.546-7.398 5.965s-11.207 1.514-18.018-.617c-6.81-2.132-12.244-6-15.287-9.809c-3.043-3.81-3.588-6.865-2.898-9.186c.689-2.32 2.802-4.544 7.398-5.962c2.298-.71 5.1-1.09 8.178-1.024M255.998 82.89q.39.53.799 1.045c5.72 7.161 14.099 12.707 24.072 15.828c9.974 3.122 19.94 3.319 28.58.653c.336-.104.667-.222 1-.336c-.977 3.412-3.471 6.69-9.08 10.055c-2.06 1.235-4.582 2.417-7.578 3.494c-10.16-4.362-22.672-7.069-37.791-7.069c-15.691 0-28.579 2.913-38.938 7.569c-3.44-1.157-6.152-2.441-8.19-3.758c-5.206-3.363-7.034-6.489-7.62-10.39a35 35 0 0 0 1.299.435c8.64 2.666 18.608 2.47 28.582-.653c9.973-3.121 18.35-8.667 24.07-15.828c.273-.341.534-.693.795-1.045m.002 41.67c27.754 0 42.266 9.836 49.26 19.66c-17.278-6.13-33.264-9.267-49.254-9.314c-15.946-.047-31.902 2.982-49.154 9.152c7.037-9.77 21.547-19.498 49.148-19.498M34.846 183.312l-5.692 17.078l43.73 14.577l17.304 51.906l27.69-7.912c6.314-8.508 13.038-16.716 20.204-24.494l-36.27 10.363l-14.697-44.094zm442.308 0l-52.27 17.424l-14.697 44.094l-36.269-10.363c7.166 7.778 13.89 15.986 20.203 24.494l27.692 7.912l17.302-51.906l43.73-14.577zm-263.357 15.844c-.26.023-.71.216-1.772.746c-60.828 30.414-104.05 96.492-127.537 159.08c-11.743 31.294-18.567 61.648-20.494 85.58c-1.926 23.933 2.616 41.173 6.37 44.926c1.759 1.76 4.358 2.784 9.677 2.363c5.32-.42 12.717-2.639 21.07-6.642c16.708-8.007 37.225-22.893 56.707-41.305C196.783 407.081 231 355.348 231 319.851c0-16-.046-51.745-3.922-80.81c-1.938-14.533-5.06-27.476-8.582-34.324c-1.761-3.425-3.516-4.99-4.088-5.288c-.286-.148-.352-.296-.611-.273m84.406 0c-.259-.023-.325.125-.611.273c-.572.298-2.327 1.863-4.088 5.288c-3.522 6.848-6.644 19.791-8.582 34.324c-3.876 29.065-3.922 64.81-3.922 80.81c0 35.497 34.217 87.23 73.182 124.053c19.482 18.412 40 33.298 56.707 41.305c8.353 4.003 15.75 6.222 21.07 6.642c5.32.421 7.918-.604 9.678-2.363c3.753-3.753 8.295-20.993 6.369-44.926c-1.927-23.932-8.75-54.286-20.494-85.58c-23.487-62.588-66.71-128.666-127.537-159.08c-1.061-.53-1.513-.723-1.772-.746M256 262.851a77 77 0 0 0-8.512.473c.408 6.14.708 12.198.924 18.02a60 60 0 0 1 7.588-.493a41 41 0 0 1 7.578.735a626 626 0 0 1 .924-18.11a60 60 0 0 0-8.502-.625M222.324 395.37c-3.43 5.326-7.116 10.594-10.994 15.783c4.639 6.388 9.726 12.19 15.275 17c8.513 7.378 18.395 12.7 29.395 12.7s20.882-5.322 29.395-12.7c5.55-4.81 10.636-10.612 15.275-17c-3.878-5.189-7.565-10.457-10.994-15.783c-5.005 7.675-10.559 14.405-16.07 19.182c-6.488 5.622-12.606 8.3-17.606 8.3s-11.118-2.678-17.605-8.3c-5.512-4.777-11.066-11.507-16.07-19.182z\"/>", "eye-of-horus": "<path  d=\"M167.844 103.406c-51.02.152-100.492 27.427-130.875 51.344a10.225 10.225 0 1 0 12.655 16.063c32.636-25.69 91.61-55.075 141.625-44.688c19.426 4.034 65.063 20.658 116.906 34.25s110.76 24.492 161.75 16.438a10.22 10.22 0 1 0-3.22-20.188c-45.672 7.215-102.65-2.71-153.342-16c-50.694-13.29-94.236-29.577-117.938-34.5c-7.522-1.562-15.09-2.416-22.625-2.656a135 135 0 0 0-4.936-.064zM157.25 192.97c-24.192-.214-47.535 5.535-68.22 21.75c-5.46 4.28-17.325 14.996-28.905 27.093c-5.79 6.048-11.367 12.32-15.813 18.28c-4.445 5.962-8.345 10.69-9 18.72c-.288 3.542.914 9.19 5.126 12.312c4.21 3.12 8.204 2.782 10.937 2.406c5.466-.75 9.55-2.78 14-4.655s8.895-3.714 11.78-4.47c.94-.244 1.203-.234 1.626-.28c12.617 11.568 27.404 18.405 43.095 21.625c1.378 9.367 1.992 16.297 2.188 21.25c-1.443-1.247-3.184-2.63-8.157-2.594c-3.154.024-7.63 2.35-9.47 5.125c-1.836 2.777-2.06 4.986-2.186 6.845c-.623 9.155 2.688 16.01 5.063 20.938c2.374 4.926 4.582 9.548 5.78 20.968c1.323 12.59 1.3 11.762 1.282 12.908c-.017 1.145-.087 4.432 1.063 21.375a10.227 10.227 0 1 0 20.406-1.407c-1.137-16.762-1.084-18.207-1.063-19.656c.023-1.45-.052-2.756-1.374-15.344c-1.135-10.816-3.6-18.323-5.875-23.687c3.072-.027 6.512-.81 9.095-3.095c4.126-3.65 5.072-7.907 5.656-12.25c.904-6.707.504-15.36-1.28-28.344c41.292 38.376 67.568 62.575 92.53 78.658c25.6 16.49 49.865 23.933 84.47 28.5c25.058 3.306 58.41 4.946 88.063-.688c14.826-2.817 28.813-7.448 40.375-15.25c11.56-7.802 20.63-19.3 23.78-34c3.47-16.188-6.37-30.54-18.25-40.438c-11.88-9.896-27.095-16.847-42.468-13.625c-12.115 2.54-20.626 11.56-26.47 21.844c-2.92 5.144-5.082 10.818-5.06 17.22c.02 6.402 3.28 13.846 9.467 18a10.223 10.223 0 1 0 11.407-16.97c-.77-.515-.434.158-.438-1.092s.69-4.094 2.375-7.063c3.374-5.937 11.07-11.553 12.908-11.938c5.578-1.17 16.894 2.38 25.218 9.313s12.36 15.725 11.344 20.47c-1.983 9.254-7.022 15.79-15.25 21.342c-8.228 5.554-19.71 9.647-32.75 12.125c-26.083 4.957-58.073 3.604-81.594.5c-33.082-4.365-52.926-10.53-76.062-25.437c-20.04-12.91-42.648-32.91-76.344-64.063c10.808-1.54 21.75-3.933 32.72-6.843c45.45-12.058 91.97-32.94 128-40.875c45.925 8.557 92.254 8.56 138.56-3.5a10.218 10.218 0 0 0-2.436-20.126a10.2 10.2 0 0 0-2.72.344c-45.82 11.935-91.592 11.27-137.874 1.562a10.2 10.2 0 0 0-3.375-.125c-35.68-8.707-75.075-25.725-113.938-35.875c-15.675-4.094-31.543-7.024-47.093-7.656c-1.62-.066-3.23-.11-4.844-.125zm1.375 20.31c1.055.026 2.122.044 3.188.095c13.332.643 27.435 3.295 42.218 7.156c27.964 7.304 57.475 18.91 86.907 28.157c-30.342 9.936-62.537 22.768-93.218 30.907c-8.37 2.22-16.604 4.077-24.595 5.437c11.364-6.918 19.063-19.127 19.063-33.155c0-19.417-14.72-35.375-33.563-38.594zm-18.938 1.157c-16.412 4.936-28.593 19.753-28.593 37.438c0 15.4 9.24 28.612 22.47 35.03c-16.355-1.81-30.32-7.407-42.283-18.967c-3.2-3.094-7.37-4.215-10.624-4.375c-3.253-.16-6.013.37-8.656 1.062c-2.393.625-4.683 1.43-6.906 2.28a224 224 0 0 1 9.812-10.936c10.864-11.35 23.386-22.52 26.75-25.157c11.7-9.17 24.4-14.253 38.03-16.375\"/>", "lotus": "<path  d=\"M254.963 40.213c-37.634 31.356-62.038 67.976-77.916 109.394c8.544 12.5 16.607 25.44 24.228 38.594c15.642-5.553 32.468-8.587 49.995-8.587c17.886 0 35.046 3.156 50.96 8.93c9.07-14.52 18.652-28.856 28.89-42.66c-15.736-38.504-39.406-74.025-76.157-105.67zM434.593 72.5c-46.74 28.5-83.334 74.49-114.616 123.826c21.934 11.372 40.696 28.023 54.636 48.244c23.212-22.514 48.206-44.643 75.58-66.82c-.882-31.955-5.798-67.033-15.6-105.25m-353.03 1.094c-9.435 37.96-14.433 72.695-15.74 104.27c23.62 20.078 45.453 40.406 65.78 61.603c13.77-18.29 31.614-33.345 52.194-43.774c-28.336-48.245-62.472-92.77-102.234-122.1zm-54.59 96.7C9.708 278.34 31.295 358.165 72.27 411.517c22.427 29.2 50.77 50.62 82.128 64.363c-20.892-35.934-25.973-76.777-16.613-116.112c4.668-19.617 12.848-38.864 24.274-57.09c-38.14-48.11-82.083-90.01-135.087-132.383zm462.588.464c-59.87 45.918-108.408 90.682-151.36 138.615c9.625 17.744 16.24 36.16 19.722 54.732c7.08 37.78 1.012 76.134-18.31 109.926c32.2-14.254 62.005-35.988 86.51-65.214c44.98-53.64 72.394-132.675 63.44-238.058zM251.27 198.3c-44.09 0-83.025 21.667-106.764 54.954a713 713 0 0 1 28.64 33.42c18.55-24.415 43.224-46.48 73.372-64.422l5.072-3.02l4.906 3.286c30.383 20.345 54.374 44.323 71.65 70.185a1010 1010 0 0 1 33.012-34.85c-23.354-35.875-63.803-59.552-109.888-59.552zm-.268 43.182c-51.58 32.272-84.19 77.032-95.035 122.612c-10.94 45.97-.302 92.658 35.986 130.607h108.904c34.806-36.38 47.222-81.652 38.696-127.15c-8.466-45.177-37.988-90.634-88.55-126.068z\"/>", "hydra": "<path  d=\"M345.594 20.28c-11.443.087-23.37 1.194-36.094 3.845c33.485 7.004 54.532 21.844 65.844 39.22c-15.476-2.647-30.64-4.472-45.47-5.532L311 40.374l-19.28 16.438c-7.537.167-14.98.55-22.314 1.156L239.97 41.78l-14.907 22.814a308 308 0 0 0-23.844 6.22l-29.47-14.97l-11.313 30.75c-8.783 4.197-17.31 8.868-25.593 13.937l-32.688-5.31l-.47 29.03a293 293 0 0 0-18.374 16.656H48l3.563 36.656c-4.38 5.908-8.603 12.045-12.688 18.375L18.47 192.25v39.5q-.017.03-.032.063V493.28h18.5c23.523-92.965 94.565-130.4 168.968-85.25c42.127 25.566 93.783 62.296 149.063 41.158a64.3 64.3 0 0 1-6.908 22.562l95.344 19.188c2.99-7.75 5.584-15.712 7.625-23.563c-3.557 2.29-10.352 4.79-19.78 3.313c-41.302-6.47-33.15-54.034-.53-58.407c10.915-1.456 21.15 3.22 27.56 11.25l18.283-38.874c-68.1 6.078-129.61-30.834-197.47-16.687c35.468 7.415 56.983 23.64 67.75 42.342a151 151 0 0 1-21.28.157l-10.813-10.25l-13.625 6.436a128 128 0 0 1-17.313-5.75l-7.718-15.47l-10.906 5.97c-7.152-4.38-13.924-9.414-20.344-15.062l-1.813-26.75l-19.436 5.03c-7.508-7.63-15.15-13.68-22.875-18.343l-1.282-19.75l-23.875 9.408c-11.712-2.7-23.455-2.622-35.063-.25c44.223-90.392 134.06-92.4 180.813-64.563c-5.227 5.68-11.388 10.355-18.125 13.78l66.562 70.908c6.928-4.58 13.63-9.564 19.844-14.782c-4.228-.204-14.15-5.01-17.47-8.06c-34.53-31.74 7.1-63.854 32.876-48.626c9.484 5.603 15.366 14.898 15.938 25.156l34.75-23.875c-59.015-34.522-85.098-97.445-148.594-125.25c23.092 24.968 31.707 49.115 30.97 69.75c-8.93-6.752-18.606-12.1-28.845-16.188l-13.845-21.25l-18.188 12.75a164 164 0 0 0-15.78-1.5l-19.094-18.093l-15.25 19.687a223 223 0 0 0-23.844 4.564l-15.75-13l-9.75 20.812a268 268 0 0 0-20.782 8.594l-23.594-8.28l-8.625 25.874c-12.263 7.768-23.966 16.49-34.876 26.062C124.307 122.443 296.518 88.99 384.938 108.562a64.4 64.4 0 0 1-6.47 19.344l95.344 19.188c2.99-7.75 5.585-15.71 7.625-23.563c-3.558 2.29-7.502 5.33-11.968 4.72c-46.308-6.31-43.81-54.725-8.345-59.813c10.903-1.57 21.15 3.193 27.563 11.22c1-10.184 1.808-35.654 2.187-45.907c-55.332 4.938-95.695-13.84-145.28-13.47z\"/>", "orc-head": "<path  d=\"M256 51c-1.216 1.157-3.235 3.694-5.595 7.47c-4.552 7.283-10.594 19.233-18.383 34.8v9.94c6.19 4.752 14.906 7.626 23.978 7.626s17.787-2.874 23.978-7.627v-9.94c-7.79-15.567-13.83-27.517-18.383-34.8c-2.36-3.776-4.38-6.313-5.595-7.47zm-42.743 54.286c-28.17 6.895-55.87 20.62-82.175 41.132c-16.04 80.706-31.2 175.83-16.89 254.565c6.188 2.322 12.687 4.44 19.403 6.398l-3.062-12.257l-4.305-6.455l7.807-5.204c6.304-4.203 13.54-7.85 21.487-10.99c-5.028-6.777-8.326-15.44-11.545-24.286c-5.46-15.013-9.66-31.84-13.654-44.028l-9.792-29.87l24.565 19.616c24.47 19.543 49.132 32.704 82.918 56.314l10.07 7.037c5.944-.26 11.928-.39 17.917-.39s11.973.13 17.916.39l10.07-7.037c33.787-23.61 58.45-36.77 82.92-56.314l24.563-19.616l-9.793 29.87c-3.995 12.19-8.193 29.015-13.654 44.028c-3.22 8.847-6.517 17.51-11.545 24.287c7.948 3.138 15.183 6.786 21.487 10.99l7.807 5.203l-4.305 6.455l-3.062 12.258c6.716-1.956 13.215-4.075 19.402-6.397c14.31-78.736-.85-173.86-16.89-254.565c-26.305-20.51-54.004-34.237-82.174-41.132v6.31l-2.75 2.746c-10.55 10.552-25.398 15.26-39.993 15.26s-29.442-4.708-39.994-15.26l-2.75-2.746v-6.31zm75.98 55.876l13.39 13.145l-6.572 6.695c-12.91 13.147-27.168 19.604-41.277 18.865c-14.108-.74-26.793-8.077-38.39-18.442l-6.995-6.253l12.504-13.99l6.996 6.25c9.774 8.735 18.788 13.273 26.867 13.696s16.495-2.67 26.905-13.272zm-149.998 3.885c19.807 0 41.364 9.12 60.852 19.946c19.487 10.826 36.416 23.397 45.862 32.843l-13.268 13.267c-7.234-7.234-23.665-19.683-41.708-29.707s-38.186-17.584-51.74-17.584v-18.765zm233.52 0v18.765c-13.552 0-33.695 7.56-51.738 17.584s-34.474 22.473-41.708 29.707l-13.268-13.267c9.446-9.446 26.375-22.017 45.862-32.843s41.045-19.946 60.853-19.946zm-226.887 36.11c16.68 16.68 47.577 47.29 93.447 47.29v.316l16.757-24.214l16.603 24.475v-.578c45.87 0 76.767-30.61 93.447-47.29l13.268 13.266c-8.234 8.233-21.14 21.197-38.61 32.218c4.916 4.755 7.998 11.397 7.998 18.697c0 14.283-11.78 26.063-26.063 26.063s-26.062-11.78-26.062-26.063c0-.183.01-.364.014-.546c-3.9.798-7.922 1.415-12.06 1.828l28.074 41.386l-3.79 5.315c-7.152 10.026-16.657 15.68-26.033 18.204s-18.523 2.41-26.863 2.41s-17.496.107-26.944-2.4s-19.065-8.05-26.67-17.95l-4.17-5.425l28.773-41.58c-4-.41-7.887-1.017-11.662-1.79c.004.183.014.364.014.547c0 14.283-11.78 26.063-26.062 26.063s-26.063-11.78-26.063-26.063c0-7.3 3.082-13.942 7.998-18.696c-17.47-11.02-30.376-23.984-38.61-32.217l13.268-13.267zm-128.076 16.11c2.95 6.932 8.367 15.73 16.54 27.413c12.455 17.8 29.556 41.635 46.575 75.674c1.848 3.697 4.587 6.08 8.64 7.774c.07-13.807.677-27.726 1.7-41.656l-24.876-21.55l12.286-14.184l14.638 12.68a899 899 0 0 1 3.23-26.948c-7.94-6.23-17.723-10.416-28.564-13.373c-16.628-4.535-34.943-5.58-50.17-5.83zm476.406 0c-15.226.25-33.54 1.295-50.17 5.83c-10.84 2.957-20.623 7.142-28.562 13.373a899 899 0 0 1 3.23 26.947l14.638-12.68l12.286 14.185l-24.875 21.55c1.02 13.93 1.628 27.848 1.7 41.656c4.05-1.694 6.79-4.077 8.638-7.774c17.02-34.04 34.12-57.873 46.575-75.674c8.173-11.682 13.59-20.48 16.54-27.412zm-238.28 40.48L221.81 307.04c3.74 3.347 7.608 5.175 12.06 6.356c6.265 1.663 13.79 1.772 22.13 1.772s15.874-.117 21.982-1.762c4.345-1.17 8.01-2.94 11.476-6.216zm-66.643.292c-4.142 0-7.298 3.155-7.298 7.297c0 4.14 3.156 7.297 7.298 7.297c4.14 0 7.297-3.156 7.297-7.297c0-4.142-3.156-7.298-7.297-7.298zm133.44 0c-4.14 0-7.297 3.155-7.297 7.297c0 4.14 3.156 7.297 7.297 7.297c4.142 0 7.298-3.156 7.298-7.297c0-4.142-3.156-7.298-7.298-7.298zm-166.322 67.34c1.684 5.604 3.355 11.28 5.214 16.392c4.053 11.14 9.25 19.18 12.498 22.424l27.458-9.153c-16.38-10.857-31.114-20.08-45.17-29.662zm199.204 0c-14.056 9.583-28.79 18.806-45.17 29.663l27.458 9.153c3.247-3.245 8.445-11.283 12.498-22.424c1.86-5.112 3.53-10.788 5.214-16.39zM256 375.634c-41.212 0-82.64 7.558-105.97 20.12l13.58 54.32c61.668 14.57 123.112 14.57 184.78 0l13.58-54.32c-23.33-12.562-64.758-20.12-105.97-20.12m-.018 10.543c23.4-.08 46.826 4.167 70.074 13.005l8.77 3.334l-6.67 17.542l-8.77-3.336c-42.466-16.144-84.223-15.572-126.88.04l-8.814 3.226l-6.448-17.623l8.81-3.223c23.152-8.473 46.527-12.883 69.928-12.964z\"/>", "triple-claws": "<path  d=\"M280.762 21.63c-15.912-.117-32 1.523-47.983 5.08c-42.948 9.563-58.997 38.668-57.135 66.495c9.325.534 19.01 1.876 28.914 3.988c28.983 6.18 59.948 19.074 89.05 38.418c100.28-25.29 162.228 51.005 184.7 152.18c49.7-147.744-67.984-265.215-197.548-266.16zm-112.535 90.128c-16.8-.114-31.245 2.938-41.717 8.74l-.04-.074c-14.14 7.645-23.816 19.428-29.15 32.687c14.63 4.844 28.782 13.83 41.955 25.466c17.72 15.652 33.85 36.317 47.06 59.662c116.927 2.378 161.504 103.39 150.673 215.26c79.5-106.87 42.174-229.74-43.856-295.404c-29.984-21.936-62.82-36.296-92.492-42.623c-11.425-2.436-22.354-3.644-32.433-3.712zM75.29 167.963c-54.213-1.358-85.38 80.807-27.324 108.247c104.435 49.363 94.912 140.96 34.844 222.71c115.134-47.87 134.337-172.24 81.997-260.066l.152-.01c-11.28-18.202-24.378-34.178-38.056-46.26c-14.62-12.914-29.74-21.183-43.76-23.836a55 55 0 0 0-7.855-.785z\"/>", "tentacles-skull": "<path  d=\"M255.672 18.535c-71.2 0-127.248 47.1-127.248 102.24c0 25.67 12.008 49.233 32.187 67.452l2.925 2.638l2.14 55.63l57.368-31.026l33.887 54.335l33.3-53.743l55.303 30.272l1.598-54.844l3.026-2.68c20.666-18.306 32.764-41.967 32.764-68.035c0-55.14-56.048-102.24-127.248-102.24zm-79.76 89.14c23.366-.295 58.385 18.522 58.385 18.522c0 21.772-17.648 39.422-39.422 39.422s-39.424-17.65-39.424-39.423h.003c.416-13.678 9.048-18.38 20.46-18.523zm159.516 0c11.41.142 20.043 4.844 20.46 18.522c0 21.772-17.65 39.424-39.423 39.424c-21.772 0-39.422-17.65-39.422-39.423c0 0 35.02-18.817 58.385-18.523m-79.756 48.118l20.334 45.418h-40.67l20.336-45.417zm-39.192 84.47l-22.2 12.008c6.823 35.1 2.77 66.833-17.956 98.933c-17.857 27.644-63.35 49.007-95.68 28.678c-40.016-25.15-11.61-63.596 12.72-39.98c-1.513-52.516-48.833-47.87-63.393-16.078c-40.502 88.417 95.507 149.848 170.432 82.79c.808 41.927 23.872 78.693 72.996 84.695c39.8 4.862 72.77-38.585 22.364-71.606c8.466 37.96-46.156 42.623-46.707-11.58c-.213-20.954 10.71-39.112 26.29-52.454c7.443 13.896 16.868 27.638 28.616 41.078C376 479.168 526.48 416.23 484.147 323.822c-14.56-31.79-61.88-36.438-63.394 16.078c24.33-23.616 52.737 14.83 12.723 39.98c-32.332 20.33-77.825-1.033-95.682-28.677c-20.493-31.74-24.678-63.12-18.176-97.75l-22.828-12.496l-39.808 64.248l-40.502-64.94z\"/>", "sunrise": "<path  d=\"M259.375 16.25c-132.32 0-239.78 107.46-239.78 239.78s107.46 239.783 239.78 239.783s239.78-107.462 239.78-239.782s-107.46-239.78-239.78-239.78zm33.5 20.406c26.563 4.015 51.57 12.708 74.156 25.25L308.907 209.03c-14.573-7.215-30.96-11.344-48.312-11.53zm-67.72.094l23.97 161.22c-17.2 1.56-33.28 6.986-47.313 15.436l-51-151a220.4 220.4 0 0 1 74.344-25.656zm193.25 64.5c17.683 18.164 32.28 39.32 42.94 62.688l-107.658 85.468a111.7 111.7 0 0 0-34.968-34.875l99.686-113.28zm-319.092 1.063L192.5 219.686a111.7 111.7 0 0 0-32.063 37.75L56.5 166c10.527-23.725 25.082-45.226 42.813-63.688zm378.75 115.906a224 224 0 0 1 3.218 37.81c0 11.49-.882 22.768-2.56 33.783l-107.876 16.062a111.2 111.2 0 0 0-12-47.375l119.22-40.28zM40.25 221.093l115.844 45.75a111.3 111.3 0 0 0-8.188 39l-107.844-16.03A224 224 0 0 1 37.5 256.03c0-11.89.954-23.554 2.75-34.936zm130.563 89.53h177.125L467 334.532c-31.674 83.843-112.62 143.376-207.625 143.376c-95.018 0-175.968-59.548-207.625-143.406l119.063-23.875z\"/>", "barbed-spear": "<path  d=\"m18.156 14.938l1.188 109.812l19.5 17.22c15.49-23.43 36.69-41.66 65.094-51.47l-80.5-75.563h-5.282zm168.125 53.78c-.396 44.894-10.642 82.204-31.155 111.5C272.262 286.142 455.438 453.28 455.438 464.407c-11.175 0-197.844-161.162-316.75-264.594c-25.878 25.887-62.488 43.38-110.313 52c68.746 39.904 126.46 57.79 191.594 69.282c-19.723 11.207-43.54 19.43-71.157 24.406c67.254 39.04 123.215 55.186 187.687 65.906c-16.78 9.55-36.457 17.074-59.97 21.313C354.206 477.804 413.56 487 498.314 497.5v-.03c-18.824-85.7-40.233-141.38-96.625-209.845c-.202 22.858-3.87 42.68-10.594 60.5c-19.436-63.145-45.6-114.738-94.438-174.03c-.235 26.606-4.35 50.287-12.094 71.093c-20.53-63.15-48.564-116.11-98.28-176.47zm-68.936 37.126c-29.56 7.767-49.585 24.63-64.406 48.53l30.312 26.75c7.968-26.825 21.017-51.348 34.094-75.28m15.062 11.406c-13.92 25.673-26.966 50.952-33.562 77.656l9.844 8.688c19.153-15.05 40.11-42.41 47.906-63.656z\"/>", "dwarf-helmet": "<path  d=\"M240.028 26v221.481L257.065 256l17.037-8.519V26zM222.99 60.074c-80.22 0-136.297 56.077-136.297 136.296h119.26l17.037 17.037zm66.018 0v153.333l17.037-17.037h119.26c0-80.219-56.077-136.296-136.297-136.296M69.657 213.407v34.074h50.047l-33.01-34.074zm41.528 0l34.074 34.074h34.074l-34.074-34.074zm58.565 0l34.074 34.074h19.167v-8.518l-25.556-25.556zm144.815 0l-25.556 25.556v8.518h19.167l34.074-34.074zm52.176 0l-34.074 34.074h34.074l34.074-34.074zm58.565 0l-33.01 34.074h50.047v-34.074zM86.694 264.52v34.074l120.325 60.694l5.68-36.497l-100.449-41.234l-8.519-17.037zm321.575 0l-8.519 17.037l-100.448 41.234l5.68 36.497l120.324-60.694V264.52zm-168.241 2.13L222.99 366.74l34.074 17.037l34.074-17.037l-17.037-100.093l-17.037 8.519l-17.037-8.519zM78.176 314.564l-46.852 41.528v59.63l61.76-93.704zm355.648 0l-14.907 7.454l61.759 93.703v-59.63zm-324.768 15.972L40.907 432.759l64.954 44.722l58.565-119.259zm293.888 0l-55.37 27.685l58.565 119.26l64.954-44.723zm-222.546 35.139L120.768 486h89.445l12.778-51.111h25.555v-36.204zm151.204 0l-68.148 33.01v36.203h25.555L301.787 486h89.444z\"/>", "crossed-swords": "<path  d=\"M19.75 14.438c59.538 112.29 142.51 202.35 232.28 292.718l3.626 3.75l.063-.062c21.827 21.93 44.04 43.923 66.405 66.25c-18.856 14.813-38.974 28.2-59.938 40.312l28.532 28.53l68.717-68.717c42.337 27.636 76.286 63.646 104.094 105.81l28.064-28.06c-42.47-27.493-79.74-60.206-106.03-103.876l68.936-68.938l-28.53-28.53c-11.115 21.853-24.413 42.015-39.47 60.593c-43.852-43.8-86.462-85.842-130.125-125.47c-.224-.203-.432-.422-.656-.625C183.624 122.75 108.515 63.91 19.75 14.437zm471.875 0c-83.038 46.28-154.122 100.78-221.97 161.156l22.814 21.562l56.81-56.812l13.22 13.187l-56.438 56.44l24.594 23.186c61.802-66.92 117.6-136.92 160.97-218.72zm-329.53 125.906l200.56 200.53a403 403 0 0 1-13.405 13.032L148.875 153.53zm-76.69 113.28l-28.5 28.532l68.907 68.906c-26.29 43.673-63.53 76.414-106 103.907l28.063 28.06c27.807-42.164 61.758-78.174 104.094-105.81l68.718 68.717l28.53-28.53c-20.962-12.113-41.08-25.5-59.937-40.313c17.865-17.83 35.61-35.433 53.157-52.97l-24.843-25.655l-55.47 55.467c-4.565-4.238-9.014-8.62-13.374-13.062l55.844-55.844l-24.53-25.374c-18.28 17.856-36.602 36.06-55.158 54.594c-15.068-18.587-28.38-38.758-39.5-60.625z\"/>", "scroll-unfurled": "<path  d=\"M103.432 17.844a87 87 0 0 0-3.348.08q-3.822.163-7.604.678c-20.167 2.747-39.158 13.667-52.324 33.67c-24.613 37.4 2.194 98.025 56.625 98.025c.536 0 1.058-.012 1.583-.022v.704h60.565c-10.758 31.994-30.298 66.596-52.448 101.43a283 283 0 0 0-6.29 10.406l34.878 35.733l-56.263 9.423c-32.728 85.966-27.42 182.074 48.277 182.074v-.002l9.31.066c23.83-.57 46.732-4.298 61.325-12.887c4.174-2.458 7.63-5.237 10.467-8.42h-32.446c-20.33 5.95-40.8-6.94-47.396-25.922c-8.956-25.77 7.52-52.36 31.867-60.452a55.6 55.6 0 0 1 17.565-2.834v-.406h178.33c-.57-44.403 16.35-90.125 49.184-126c23.955-26.176 42.03-60.624 51.3-94.846l-41.225-24.932l38.272-6.906l-43.37-25.807h-.005l.002-.002l.002.002l52.127-8.85c-5.232-39.134-28.84-68.113-77.37-68.113C341.14 32.26 222.11 35.29 149.34 28.496c-14.888-6.763-30.547-10.723-45.908-10.652m.464 18.703c13.137.043 27.407 3.804 41.247 10.63l.033-.07c4.667 4.735 8.542 9.737 11.68 14.985H82.92l10.574 14.78c10.608 14.83 19.803 31.99 21.09 42.024c.643 5.017-.11 7.167-1.814 8.836c-1.705 1.67-6.228 3.875-15.99 3.875c-40.587 0-56.878-44.952-41.012-69.06C66.238 46.64 79.582 39.22 95.002 37.12a64 64 0 0 1 8.894-.573M118.5 80.78h46.28c4.275 15.734 3.656 33.07-.544 51.51H131.52c1.9-5.027 2.268-10.574 1.6-15.77c-1.527-11.913-7.405-24.065-14.62-35.74m101.553 317.095c6.44 6.84 11.192 15.31 13.37 24.914c3.797 16.736 3.092 31.208-1.767 43.204c-4.526 11.175-12.576 19.79-22.29 26h237.19c14.448 0 24.887-5.678 32.2-14.318c7.312-8.64 11.2-20.514 10.705-32.352a47.7 47.7 0 0 0-2.407-13.18l-69.91-8.205l42.017-20.528c-8.32-3.442-18.64-5.537-31.375-5.537H220.053zm-42.668.506a37 37 0 0 0-3.457.153a34.8 34.8 0 0 0-7.824 1.63c-15.11 5.02-25.338 21.54-20.11 36.583c3.673 10.57 15.347 17.71 25.654 13.938l1.555-.57h43.354c.946-6.36.754-13.882-1.358-23.192c-3.71-16.358-20.543-28.483-37.815-28.54z\"/>", "artificial-intelligence": "<path  d=\"M256.016 17.824C153.28 17.824 68 123.394 68 255.984c0 55.725 15.08 106.68 40.17 147.034c42.033 17.992 95.622 27.594 149.34 27.644c51.828.046 103.59-8.786 145.04-25.588C428.41 364.4 444 312.66 444 255.982c0-132.59-85.25-238.156-187.982-238.158zm1.746 18.7c80.525 0 145.63 65.072 145.63 145.6c0 80.526-65.105 145.63-145.63 145.63c-80.53 0-145.6-65.104-145.6-145.63c0-80.53 65.07-145.6 145.6-145.6m-27.69 40.02c-2.586 5.774-5.09 11.292-7.52 16.843c-.543 1.243-1.193 1.538-2.622 1.636c-5.436.377-10.875.927-16.25 1.8c-1.77.29-2.69.21-3.723-1.294c-3.335-4.866-6.823-9.626-10.352-14.565L167.268 97.3c3.778 5.304 7.298 10.362 10.962 15.315c.976 1.318.846 2.18.102 3.567c-1.747 3.258-3.268 6.647-4.7 10.058c-.835 1.984-.724 4.898-2.126 5.967c-1.56 1.19-4.355.774-6.615 1.035c-4.747.548-9.5 1.08-14.443 1.64l2.727 27.526c6.937-.78 13.47-1.57 20.017-2.195c1.164-.11 2.92.056 3.503.8c3.262 4.16 6.248 8.535 9.602 13.22l-9.477 21.26l25.057 11.216c3.057-6.812 6.036-13.325 8.89-19.894c.658-1.518 1.386-2.035 3.143-2.064c4.032-.066 8.11-.283 12.063-1.02c2.293-.426 3.46-.018 4.757 1.844c3.998 5.74 8.2 11.337 12.386 17.076l16.084-11.722l5.537 9.588l-19.986 20.01l-24.428-14.034l-13.035 23.715c8.287 4.824 16.284 9.48 23.567 13.722c-2.152 9.085-4.15 17.682-6.29 26.244c-.156.616-1.35 1.37-2.072 1.383c-6.587.105-13.18.063-19.77.063h-6.585v26.434q1.006.476 2.02.935h26.087c.75 3.174 1.477 6.206 2.182 9.203A136 136 0 0 0 254 311c15.906 0 31.138-2.728 45.236-7.723c-8.264-13.37-6.265-30.49 3.118-41.173c13.284-15.13 36.56-16.175 50.794-2.032a40 40 0 0 1 3.21 3.61C374.897 241.53 386 213.237 386 182.412a127 127 0 0 0-1.314-18.18c-.236-.12-.427-.22-.686-.35c-.132-.068-.31-.047-.664-.09c-4.587 7.96-9.21 15.986-13.56 23.54l-27.532-7.566v-27.21h-27.32v27.24c-9.023 2.44-17.696 4.787-26.645 7.206c-4.342-7.55-8.898-15.472-13.47-23.426l-18.232 10.235c-1.31-1.825-2.425-3.512-3.685-5.087c-.825-1.03-.648-1.725-.028-2.86c2.178-3.98 4.357-7.992 6.06-12.185c.805-1.988 1.693-2.632 3.73-2.81c6.453-.557 12.885-1.36 19.616-2.102c-.92-9.32-1.82-18.397-2.72-27.522c-6.795.652-13.1 1.22-19.396 1.89c-1.49.157-2.1-.388-2.888-1.66c-2.787-4.495-5.686-8.944-8.89-13.144c-1.16-1.518-1.426-2.46-.63-4.148c2.537-5.387 4.9-10.854 7.393-16.438c-8.45-3.774-16.663-7.445-25.068-11.2zm-13.455 42.845c12.335.102 22.195 10.073 22.092 22.337c-.105 12.433-10.133 22.24-22.595 22.093c-12.426-.145-22.047-10.12-21.908-22.72c.134-12.086 10.174-21.814 22.41-21.71zm-45.183 214.63c18.315 0 33.066 14.8 33.066 33.41c0 18.608-14.75 33.437-33.064 33.437c-18.315 0-33.036-14.83-33.036-33.437c0-18.61 14.72-33.41 33.034-33.41m165.334.732a33 33 0 0 1 33 33a33 33 0 0 1-33 33a33 33 0 0 1-33-33a33 33 0 0 1 33-33m-208.372 96.002v.006l.008.002zm.008.008c11.484 13.443 24.29 25.074 38.108 34.586l-7.076-26.303a358 358 0 0 1-31.032-8.283m253.89 1.52a361 361 0 0 1-27.33 7.046l-6.42 23.903c12.14-8.723 23.46-19.12 33.75-30.943v-.004zM179.82 443l9.565 35.686c11.31 5.452 23.12 9.55 35.31 12.156l-5.048-43.006a435 435 0 0 1-39.828-4.838zm154.793.252a448 448 0 0 1-30.85 3.96l-4.802 40.702c9.11-2.72 17.96-6.292 26.522-10.63l9.133-34.028v-.002zm-49.77 5.297l-.005.03h.006l-.002-.03zm-.005.03c-9.08.502-18.206.753-27.324.753a489 489 0 0 1-19.012-.377l5.297 44.72c4.04.377 8.112.503 12.216.503c8.003 0 15.89-.626 23.652-1.905l5.17-43.692z\"/>", "archive-research": "<path  d=\"M149.7 85.6c-1.2 0-2.5 0-3.7.1c-33.9.8-75.5 10.7-127.3 33.7v243.4c60.8-28.8 106.7-37.1 144.2-33.1c13.7 1.4 26.3 4.5 37.9 8.6l-45.1-78.8c-8.6 3.5-17.9 5.5-27.7 5.5c-40.21 0-73-32.8-73-73s32.79-73 73-73c40.2 0 73 32.8 73 73c0 24-11.7 45.3-29.7 58.7l57.3 100c6.2 3.2 12.1 6.7 17.9 10.2v-243c-23.2-17.7-50.2-30-86-32q-5.25-.3-10.8-.3m212 0c-3.7 0-7.4.1-10.9.3c-35.8 2-62.7 14.3-86 32v243c23.9-14.6 50.1-27.7 83.6-31.2c37.5-4 83.5 4.3 144.2 33.1V119.4c-51.7-23-93.3-32.9-127.2-33.7c-1.3 0-2.5-.1-3.7-.1M128 137c-30.48 0-55 24.5-55 55s24.52 55 55 55c30.5 0 55-24.5 55-55s-24.5-55-55-55m2.3 13.9h2.8C109 169.1 98.32 193 99.73 221.1c-26.06-38.8 1.27-69.4 30.57-70.2m13.1 196.5c-32 .3-71.8 9.8-124.7 36v42.5c60.8-28.8 106.7-37.1 144.2-33.1c18.6 2 34.9 6.9 49.8 13.3c-4.7 6.1-9.3 13.3-13.9 21.7h53.3l-36-62.7c-16.6-8.3-34.3-14.6-55.1-16.8c-5.6-.6-11.5-.9-17.6-.9m220.9 0c-4.8.1-9.4.4-13.9.9c-34 3.6-59.6 18-85.6 34.4v.3c-6.1-1.9-12.3-2.3-18.3-1.2l26.3 46H316c-6-8.2-11.8-15.4-17.7-21.6c15-6.5 31.4-11.4 50.1-13.4c37.5-4 83.5 4.3 144.2 33.1v-42.5c-53.1-26.3-93.1-35.9-125.2-36z\"/>", "cycle": "<path  d=\"M252.314 19.957c-72.036.363-142.99 33.534-189.18 95.97c-69.83 94.39-59.125 223.32 19.85 304.993l-37.238 50.332l151.22-22.613L174.35 297.42l-43.137 58.308c-44.08-54.382-47.723-133.646-4.16-192.53c30.676-41.466 77.863-63.504 125.758-63.753a156.8 156.8 0 0 1 48.645 7.467l-6.963-46.55a191 191 0 0 0-71.017-.997c-59.232 7.322-113.994 39.918-148.157 91.215c35.65-65.89 103.774-105.918 176.043-107.744a204.3 204.3 0 0 1 49.62 4.84l48.608-7.268c-31.14-13.906-64.32-20.62-97.274-20.453zm212.93 22.055l-151.217 22.61l22.614 151.22l41.126-55.588c42.204 54.29 45.092 132.048 2.187 190.043c-40.22 54.367-108.82 75.32-170.19 57.566l6.522 43.598a192.7 192.7 0 0 0 86.203-3.07c37.448-5.957 73.34-22.05 103.16-47.728c-49.196 54.65-122.615 77.514-191.744 64.34l-55.8 8.344c99.03 43.7 218.402 14.77 285.51-75.938c69.13-93.445 59.34-220.743-17.483-302.53l39.114-52.866z\"/>", "linked-rings": "<path  d=\"M321.7 21.36c-43.2 0-86.4 16.5-119.4 49.5c-19.1 19.08-32.6 41.54-40.7 65.44c16.9-2.4 32.9-2.7 48.7-1.1q5.85-8.25 13.2-15.6c23.3-23.26 53.8-34.9 84.4-34.9s61.2 11.64 84.5 34.9c46.6 46.6 46.6 122.4 0 168.9c-46.5 46.6-122.4 46.6-168.9 0c-22.2-22.2-33.9-51.1-34.9-80.2c-11.5 1.8-22.8 5.6-33.2 11.4c5.8 33 21.4 64.5 46.9 90c66 66 172.9 66.1 238.9 0c66-66 66-172.8 0-238.84c-33-33-76.3-49.5-119.5-49.5M147.6 158.2c-27.9 7.7-58.94 25.4-76.75 44c-47.5 47.4-60.8 116-40.1 175.3c8.91 24.1 23.56 47.1 40.1 63.6c66.05 66 172.95 66 238.95 0c19.1-19.1 32.6-41.6 40.7-65.5c-16.2 2.5-32.6 2.9-48.8 1.2c-3.8 5.4-8.2 10.6-13.1 15.5c-62.7 39.7-137.8 40.6-173.3-4.4c-20.57-26-32.05-58.8-30.55-85.8c2.58-41.6 26.85-79.9 57.75-98.5c10.2-5.9 37.6-15.1 61.6-15.1c33.7 1.5 60.6 11.1 84.5 34.9c22.3 22.1 33.8 51.1 34.8 80.3c11.6-1.8 22.9-5.6 33.3-11.4c-9.4-41.6-26.9-73.2-53.9-96.7c-21.4-18.7-44.1-31.4-70.6-37.6c-28.4-7-58.6-6.5-84.6.2\"/>", "newspaper": "<path  d=\"M41 66.91V415.8c86.5 1 147.5 14.8 206 29.3V141.4c-45.3-30.1-90.4-58.75-206-74.49m430 0C355.4 82.65 310.3 111.3 265 141.4v303.7c58.5-14.5 119.5-28.3 206-29.3zm-20.9 26.6l.8 66.99c-59.4 17.6-114.5 37.9-168.9 56c-.4-20.9-.7-41.7-1.1-62.6c52.8-29.2 111.2-48.1 169.2-60.39M69.01 105.3C129.8 119.4 184.1 136 226.1 150.1l.2 19c-41.6-13.9-101.3-32.3-161.35-46.3zm.12 46.6l35.97 6.5l-3.2 17.8l-35.97-6.5zm54.17 11.3l32.5 6.2l-3.4 17.6l-32.5-6.2zm53.2 10.5l49.6 9.6l-3.4 17.6l-49.6-9.6zm263.1 19.9l5.2 17.2l-56 16.9l-5.2-17.2zm-377.68 4.7C119.2 205 176 212.2 223.8 225l-4.6 17.4c-46-12.4-102.2-19.6-159.38-26.3zM357.1 216l4.8 17.4l-71.7 19.8l-4.8-17.4zm86.4 21l4.8 17.4l-32.8 9.1l-4.8-17.4zm-378.3 1.6l49.9 5.2l-2 18l-49.8-5.4zm76.9 9.8l82.1 12.3l-2.6 17.8l-82.1-12.3zm248.5 3.7l4.8 17.4L288.5 299l-4.8-17.4zm55.8 22.9l4.6 17.4L348.5 319l-4.6-17.4zm-388.06 6.4c29.84 3.1 61.96 7.5 84.46 13v111L59.2 398c-.33-38.9-.48-77.7-.86-116.6m104.56 14.7l61.5 7.5l-2.2 17.8l-61.5-7.5zm161.5 11.8l4.2 17.5l-37.8 9.1l-4.2-17.5zm129.1 4.1l.4 82.2l-78.5 10.2c-.3-23.8-.4-47.7-.7-71.5zM164 334.4l59.8 9.8l-3 17.8l-59.8-9.8zm271.7 1l-42.8 11.3l.3 37.3l42.7-5.6zm-81.4 9.8l3.4 17.6l-68.9 13.1l-3.4-17.6zm-191.1 29.1l62.6 12.4l-3.4 17.6l-62.6-12.4zm186.6 6.8l4 17.6l-62.5 13.9l-4-17.6z\"/>", "info": "<path  d=\"M256 21C126.426 21 21 126.426 21 256s105.426 235 235 235s235-105.426 235-235S385.574 21 256 21m0 36c110.118 0 199 88.882 199 199s-88.882 199-199 199S57 366.118 57 256S145.882 57 256 57m-7.352 36.744q-12.34 0-21.27 8.928q-8.664 8.928-8.665 21.008q.001 12.341 8.666 21.006q8.925 8.665 21.268 8.666q12.342-.001 21.006-8.666q8.666-8.666 8.666-21.006q0-12.08-8.927-21.008q-8.666-8.928-20.745-8.928zm-62.757 82.453v28.096h46.215v186.13H185.89v27.833h140.22v-27.834h-45.69V176.197z\"/>"};
  const gi = (n, attrs) => `<g ${attrs || ''}>${GI[n]}</g>`;
  const SIGIL_BY_FACTION = { 'Necrons': 'ankh', 'Dark Angels': 'winged-sword', 'Space Wolves': 'wolf-head', 'Aeldari': 'fire-gem', 'Adeptus Custodes': 'crested-helmet', 'Ultramarines': 'omega', 'Blood Angels': 'angel-wings', 'Black Templars': 'iron-cross', 'Carcharodons': 'shark-jaws', 'Adepta Sororitas': 'fleur-de-lys', 'Adeptus Mechanicus': 'cog', 'Imperial Knights': 'black-knight-helm', 'Grey Knights': 'shining-sword', 'World Eaters': 'dread-skull', 'Chaos Daemons': 'daemon-skull', 'Chaos Space Marines': 'daemon-skull', 'Chaos Knights': 'horned-skull', 'Death Guard': 'fly', 'Thousand Sons': 'eye-of-horus', "Emperor's Children": 'lotus', 'Alpha Legion': 'hydra', 'Orks': 'orc-head', 'Tyranids': 'triple-claws', 'Genestealer Cults': 'tentacles-skull', "T'au Empire": 'sunrise', 'Drukhari': 'barbed-spear', 'Leagues of Votann': 'dwarf-helmet' };
  let sigilSeq = 0;
  const reduceMotion = (() => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
  // A foe's sigil, filled with its army's colours drifting at the same 9s pace as the plasma panels
  const PAULDRON = new Set(['Dark Angels', 'Space Wolves', 'Ultramarines', 'Blood Angels', 'Black Templars', 'Carcharodons', 'Space Marines (other chapter)', 'Grey Knights']);
  const gradDefs = (t, id) => `<defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1024" y2="0"><stop offset="0" stop-color="${t[0]}"></stop><stop offset="0.33" stop-color="${t[1]}"></stop><stop offset="0.66" stop-color="${t[2]}"></stop><stop offset="1" stop-color="${t[3]}"></stop>${reduceMotion ? '' : '<animateTransform attributeName="gradientTransform" type="translate" values="-512 0; 0 0; -512 0" dur="9s" calcMode="spline" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" repeatCount="indefinite"></animateTransform>'}</linearGradient></defs>`;
  // A foe's heraldry. Marine chapters get a pauldron in their shifting colours with the chapter mark on it;
  // everyone else is the mark itself filled with the colours. An uploaded emblem replaces either.
  function sigil(faction, rival) {
    const fi = factionInfo(faction); const t = FOE_THEMES[fi.theme] || FOE_THEMES.loyal; const id = 'sg' + (sigilSeq++);
    const it = rival && poolItem(rival.emblemId);
    if (it) {
      if (rival.emblemTint !== false) {
        const m = it[rival.emblemInvert ? 'm1' : 'm0'];
        if (!m) { ensureMask(it, !!rival.emblemInvert); return `<img class="sigil" alt="" src="${it.src}" style="object-fit: contain; opacity: 0.4">`; }
        return `<span class="sigil sigil-mask" aria-hidden="true" style="-webkit-mask-image: url(${m}); mask-image: url(${m}); background-image: linear-gradient(90deg, ${t[0]}, ${t[1]}, ${t[2]}, ${t[3]})"></span>`;
      }
      return `<img class="sigil" alt="" src="${it.src}" style="object-fit: contain">`;
    }
    const n = SIGIL_BY_FACTION[faction] || 'eagle-emblem';
    const flip = n === 'omega' ? ' transform="rotate(180 256 256)"' : '';
    if (PAULDRON.has(faction)) {
      const mark = faction === 'Black Templars' ? '#0E0D0C' : '#EFE8D6';
      return `<svg class="sigil" aria-hidden="true" viewBox="0 0 512 512">${gradDefs(t, id)}
        <path d="M44 474 V262 C44 128 140 34 256 34 C372 34 468 128 468 262 V474 Z" fill="url(#${id})" stroke="#0B0A09" stroke-width="10"></path>
        <path d="M44 474 V262 C44 128 140 34 256 34 C372 34 468 128 468 262 V474 Z" fill="none" stroke="#000" stroke-opacity="0.55" stroke-width="30" transform="translate(256 254) scale(0.9) translate(-256 -254)"></path>
        <path d="M40 474 H472" stroke="#0B0A09" stroke-width="26"></path>
        <path d="M70 250 C80 140 160 74 256 70" fill="none" stroke="#fff" stroke-opacity="0.22" stroke-width="10" stroke-linecap="round"></path>
        <g transform="translate(256 278) scale(0.56) translate(-256 -256)"><g${flip} fill="${mark}" ${faction === 'Black Templars' ? 'stroke="#EFE8D6" stroke-width="14" paint-order="stroke"' : ''}>${GI[n]}</g></g></svg>`;
    }
    return `<svg class="sigil" aria-hidden="true" viewBox="0 0 512 512">${gradDefs(t, id)}${gi(n, `fill="url(#${id})"${flip}`)}</svg>`;
  }
  // ---------- image library ("pool"): your own pictures, kept on this phone only ----------
  const POOL_KEY = 'imperium-tactica-pool';
  // ---------- battle history: every finished or abandoned game, kept on the device and in the account ----------
  const HIST_KEY = 'imperium-tactica-history';
  let HIST = (() => { try { return JSON.parse(localStorage.getItem(HIST_KEY)) || []; } catch (e) { return []; } })();
  let HIST_DEL = (() => { try { return JSON.parse(localStorage.getItem(HIST_KEY + '-deleted')) || []; } catch (e) { return []; } })();
  function histSave() {
    HIST.sort((x, y) => (y.date || '').localeCompare(x.date || ''));
    try { localStorage.setItem(HIST_KEY, JSON.stringify(HIST)); localStorage.setItem(HIST_KEY + '-deleted', JSON.stringify(HIST_DEL.slice(-500))); }
    catch (e) { toast('Phone storage is full. Older battles are still safe in your account if you are synced.'); }
  }
  // sync tracker (see account sync near the end)
  // outside Claude (the installed app), account storage is Supabase; inside Claude it is the artifact's own
  const STANDALONE = !(window.claude && window.claude.use) && window.CADDIE_SB ? window.CADDIE_SB : null;
  const assetSrc = (id) => (id && id.startsWith('sb:') && window.CADDIE_SB ? window.CADDIE_SB.publicUrl(id.slice(3)) : '/_blob/' + id);
  const LIVE = { on: false, id: '', role: '', ch: null, me: Math.random().toString(36).slice(2, 10), clock: 0, snap: null, pt: 0, other: null, err: '' };
  const SYNC = { on: false, db: null, assets: null, appRef: null, poolRef: null, st: 0, pt: 0, busyS: false, busyP: false, again: { s: false, p: false }, deleted: [] };
  try { SYNC.deleted = JSON.parse(localStorage.getItem(POOL_KEY + '-deleted')) || []; } catch (e) { SYNC.deleted = []; }
  let POOL = (() => { try { return JSON.parse(localStorage.getItem(POOL_KEY)) || []; } catch (e) { return []; } })();
  // The shared library ships inside the app itself, so anyone who opens it, anywhere, gets the owner's images
  const LIB = window.IT_LIB || { items: [], slots: {}, rivals: {} };
  (() => {
    let changed = false;
    // images withdrawn from the shared library leave every phone too
    const n0 = POOL.length; POOL = POOL.filter((x) => !(x.lib && !LIB.items.some((li) => li.id === x.id))); if (POOL.length !== n0) changed = true;
    LIB.items.forEach((li) => {
      if (SYNC.deleted.includes(li.id)) return;
      const mine = POOL.find((x) => x.id === li.id || (li.assetId && x.assetId === li.assetId));
      if (!mine) { POOL.push({ id: li.id, name: li.name, assetId: li.assetId, mono: li.mono, src: li.file, lib: true }); changed = true; }
      else if (mine.src !== li.file && (!mine.src || mine.src.startsWith('/_blob/') || mine.src.startsWith('data:'))) { mine.src = li.file; mine.lib = true; changed = true; }
    });
    if (changed) { try { localStorage.setItem(POOL_KEY, JSON.stringify(POOL)); } catch (e) { /* the library still shows this visit */ } }
  })();
  function poolSave() { schedulePoolPush(); try { localStorage.setItem(POOL_KEY, JSON.stringify(POOL)); return true; } catch (e) { toast('Phone storage is full. Remove an image from the library and try again.'); return false; } }
  const poolItem = (id) => (id ? POOL.find((x) => x.id === id) : null);
  const maskPending = {};
  function ensureMask(item, inv) {
    const k = inv ? 'm1' : 'm0'; if (item[k] || maskPending[item.id + k]) return;
    maskPending[item.id + k] = true;
    makeMask(item.src, inv, (m) => { item[k] = m; delete maskPending[item.id + k]; poolSave(); render(); });
  }
  function slotLabel(slot) {
    if (slot === 'terra') return 'Terra (main page)';
    if (slot === 'army:templars') return 'Black Templars button';
    if (slot === 'army:carcharodons') return 'Carcharodons button';
    if (slot === 'army:other') return 'Other button (40k symbol, when no army image)';
    if (slot === 'list:other') return 'Other button (your pasted army)';
    const R = S.rivals[slot.slice(6)]; return R ? factionInfo(R.faction).display + (R.name ? ' (' + R.name + ')' : '') : slot;
  }
  function allSlots() { return ['terra', 'army:templars', 'army:carcharodons', 'army:other', 'list:other'].concat(Object.keys(S.rivals).map((k) => 'rival:' + k)); }
  function slotId(slot) { return slot.startsWith('rival:') ? (S.rivals[slot.slice(6)] || {}).emblemId : S.slots[slot]; }
  function assignSlot(slot, id) {
    if (slot.startsWith('rival:')) { const R = S.rivals[slot.slice(6)]; if (!R) return; const it = poolItem(id); R.emblemId = id; R.emblemTint = !!(it && it.mono !== false); R.emblemInvert = false; if (it && R.emblemTint) ensureMask(it, false); }
    else S.slots[slot] = id;
  }
  function clearSlot(slot) { if (slot.startsWith('rival:')) { const R = S.rivals[slot.slice(6)]; if (R) delete R.emblemId; } else delete S.slots[slot]; }
  const stem = (w) => w.replace(/ves$/, 'f').replace(/es$/, 'e').replace(/s$/, '');
  // short names people actually give files
  const ALIASES = { "T'au Empire": ['tau'], 'Tyranids': ['tyranid', 'nids'], 'Leagues of Votann': ['votann', 'squats'], 'Adeptus Custodes': ['custodes', 'custodian'], 'Astra Militarum': ['militarum', 'guard', 'imperialguard'], 'Adepta Sororitas': ['sororitas', 'sisters'], 'Adeptus Mechanicus': ['mechanicus', 'admech'], 'Chaos Space Marines': ['chaosspacemarine', 'csm'], 'Genestealer Cults': ['genestealer', 'gsc'], "Emperor's Children": ['emperorschildren'], 'Imperial Knights': ['imperialknight'], 'Chaos Knights': ['chaosknight'], 'Chaos Daemons': ['daemon'], 'Drukhari': ['drukhari', 'darkeldar'], 'Aeldari': ['aeldari', 'eldar', 'craftworld'], 'Orks': ['ork'], 'World Eaters': ['worldeater'], 'Death Guard': ['deathguard'], 'Thousand Sons': ['thousandson'], 'Grey Knights': ['greyknight'], 'Ultramarines': ['ultramarine'], 'Space Wolves': ['spacewolf', 'wolves'], 'Dark Angels': ['darkangel'], 'Blood Angels': ['bloodangel'], 'Alpha Legion': ['alphalegion'], 'Necrons': ['necron'] };
  function nameMatches(n, label) {
    if (!label) return false;
    const al = ALIASES[label] || []; if (al.some((x) => n.includes(x))) return true;
    const words = label.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3 && !['other', 'chapter', 'born', 'empire'].includes(w)).map(stem);
    return words.length > 0 && words.every((w) => n.includes(w));
  }
  const fileKey = (name) => name.toLowerCase().replace(/\.[a-z0-9]+$/, '').replace(/[^a-z0-9]/g, '');
  // Matches a file name to an empty slot: templars.png, dark-angels.jpg, necrons.webp and so on
  function autoSlot(fileName) {
    const n = fileKey(fileName);
    const fixed = [['terra', /aquila/], ['army:templars', /templar/], ['army:carcharodons', /carcharodon|carcharadon|shark/], ['army:other', /warhammer|40k/]];
    for (const [slot, re] of fixed) if (re.test(n) && !slotId(slot)) return slot;
    const OL = S.lists.other;
    if (OL && !slotId('list:other') && (nameMatches(n, OL.faction) || nameMatches(n, OL.subfaction))) return 'list:other';
    for (const k of Object.keys(S.rivals)) {
      const R = S.rivals[k]; if (R.emblemId) continue;
      if ((R.name && n.includes(R.name.toLowerCase().replace(/[^a-z0-9]/g, ''))) || nameMatches(n, R.faction)) return 'rival:' + k;
    }
    return null;
  }
  function addToPool(files) {
    const list2 = [...files]; let done = 0; const matched = [];
    list2.forEach((f) => shrinkImage(f, (src, mono) => {
      const id = 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const item = { id, name: f.name.replace(/\.[a-z0-9]+$/i, ''), src, mono }; POOL.push(item); uploadImage(item);
      const slot = autoSlot(f.name); if (slot) { assignSlot(slot, id); matched.push(slotLabel(slot)); }
      if (++done === list2.length) {
        if (poolSave()) toast(`${list2.length} image${list2.length > 1 ? 's' : ''} added.` + (matched.length ? ' Placed by file name: ' + matched.join(', ') + '.' : ' Tap one to choose where it goes.'));
        save(); render();
      }
    }));
  }

  // Turns a picture into a stencil: the symbol becomes opaque, the background clear. invert flips which part is which.
  function makeMask(src, invert, done) {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height); const px = d.data; const W = c.width, H = c.height;
      const lum = (i) => (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255;
      let edge = 0, ne = 0;
      // judge the background by the middle value round the edge, so a dark strip along one side does not fool it
      // sample a ring a little inside the edge: photos of screens often have dark bezels or toolbars at the very edge
      const ix = Math.round(W * 0.07), iy = Math.round(H * 0.07); const ev = [];
      for (let i = ix; i < W - ix; i++) ev.push(lum((iy * W + i) * 4), lum(((H - 1 - iy) * W + i) * 4));
      for (let j = iy; j < H - iy; j++) ev.push(lum((j * W + ix) * 4), lum((j * W + W - 1 - ix) * 4));
      ev.sort((m, n) => m - n); edge = ev[ev.length >> 1]; ne = 1;
      let darkSymbol = edge / ne > 0.5; if (invert) darkSymbol = !darkSymbol;
      for (let i = 0; i < px.length; i += 4) {
        let a = lum(i); if (darkSymbol) a = 1 - a;
        a = Math.max(0, Math.min(1, (a - 0.3) / 0.35)) * (px[i + 3] / 255);
        px[i] = px[i + 1] = px[i + 2] = 255; px[i + 3] = Math.round(a * 255);
      }
      x.putImageData(d, 0, 0); done(c.toDataURL('image/webp', 0.9));
    };
    img.src = src;
  }
  function shrinkImage(file, done) {
    const img = new Image(); const url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, 400 / Math.max(img.width, img.height)); const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      // clear a plain background that touches the edges (white or flat colour behind a pauldron)
      const cx = c.getContext('2d'); const id0 = cx.getImageData(0, 0, c.width, c.height); const P = id0.data; const W = c.width, H = c.height;
      const border = []; for (let x = 0; x < W; x++) border.push(x, (H - 1) * W + x); for (let y = 0; y < H; y++) border.push(y * W, y * W + W - 1);
      const med = [0, 1, 2].map((ch) => { const v = border.map((q) => P[q * 4 + ch]).sort((m, n) => m - n); return v[v.length >> 1]; });
      const near = (q) => Math.abs(P[q * 4] - med[0]) + Math.abs(P[q * 4 + 1] - med[1]) + Math.abs(P[q * 4 + 2] - med[2]) < 60;
      if (border.filter(near).length / border.length > 0.7) {
        const seen = new Uint8Array(W * H); const st = border.filter((q) => near(q));
        st.forEach((q) => { seen[q] = 1; });
        while (st.length) { const q = st.pop(); P[q * 4 + 3] = 0; const x = q % W, y = (q / W) | 0;
          [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].forEach(([u, v]) => { if (u < 0 || v < 0 || u >= W || v >= H) return; const r = v * W + u; if (!seen[r] && near(r)) { seen[r] = 1; st.push(r); } }); }
        cx.putImageData(id0, 0, 0);
      }
      // how colourful is it? black and white symbols suit the army-colour stencil, painted pauldrons do not
      const px = P; let sat = 0, cnt = 0;
      for (let i = 0; i < px.length; i += 16) { if (px[i + 3] < 128) continue; const mx = Math.max(px[i], px[i + 1], px[i + 2]), mn = Math.min(px[i], px[i + 1], px[i + 2]); sat += mx ? (mx - mn) / mx : 0; cnt++; }
      done(c.toDataURL('image/webp', 0.86), cnt ? sat / cnt < 0.18 : true);
    };
    img.onerror = () => toast('That file could not be read as a picture');
    img.src = url;
  }
  // Your own army's heraldry for the "Fighting as" picker; an uploaded emblem replaces the icon
  function herald(k) {
    const own = poolItem(S.slots['army:' + k]);
    if (own) return `<img src="${own.src}" alt="" style="width: 100%; height: 100%; object-fit: contain">`;
    if (k === 'guard') return `<img src="lib/pmwam_c_${amReg()[1]}.webp" alt="" style="width: 100%; height: 100%; object-fit: contain">`;
    if (k === 'orks') { const it = POOL.find((x) => x.name === 'orks-clan-' + orkClan()[1]); if (it) return `<img src="${it.src}" alt="" style="width: 100%; height: 100%; object-fit: contain">`; }
    if (k === 'templars') return `<svg aria-hidden="true" viewBox="-24 -24 560 560">${gi('iron-cross', 'fill="#0E0D0C" stroke="#E8E0CC" stroke-width="18" stroke-linejoin="round" paint-order="stroke"')}</svg>`;
    if (ARMY[k] && ARMY[k].lib) { const ok = (x) => !/^(bg|fleet)-/i.test(x.name); const it = (ARMY[k].libRe && POOL.find((x) => ok(x) && ARMY[k].libRe.test(fileKey(x.name)))) || POOL.find((x) => ok(x) && nameMatches(fileKey(x.name), ARMY[k].lib)); if (it) return `<img src="${it.src}" alt="" style="width: 100%; height: 100%; object-fit: contain">`; }
    if (k === 'carcharodons') return `<svg aria-hidden="true" viewBox="0 0 512 512">${gi('shark-jaws', 'fill="#CDBE9C"')}</svg>`;
    return `<svg aria-hidden="true" viewBox="0 0 768 512"><g transform="translate(224 0) scale(0.6)">${gi('eagle-emblem', 'fill="#D9C27A"')}</g><g transform="translate(70 230) scale(0.52)">${gi('daemon-skull', 'fill="#C9473A"')}</g><g transform="translate(432 230) scale(0.52)">${gi('alien-skull', 'fill="#9CCB5A"')}</g></svg>`;
  }

  // ---------- state ----------
  function fresh() {
    return {
      v: 1, screen: 'home', army: STANDALONE ? 'other' : 'templars', mine: STANDALONE ? [] : undefined, facs: [],
      lists: { templars: D.rosters.templars, carcharodons: D.rosters.carcharodons, other: null },
      foeKey: 'necrons',
      rivals: {
        necrons: { faction: 'Necrons', name: '', detachments: [], warlord: 'Overlord', notes: '', record: [0, 0] },
        darkangels: { faction: 'Dark Angels', name: '', detachments: [], warlord: '', notes: '', record: [0, 0] },
        spacewolves: { faction: 'Space Wolves', name: '', detachments: [], warlord: '', notes: '', record: [0, 0] },
        aeldari: { faction: 'Aeldari', name: '', detachments: [], warlord: '', notes: '', record: [0, 0] }
      },
      field: { mission: '', deployment: '', twist: '', mirror: '', secMode: 'tactical', fixed: ['', ''], foeSecMode: 'tactical', foeSec: ['', ''], mode: 'comp', missionPick: 'choose', secOn: true, secCount: 2, secPick: 'choose', side: 'a', first: 'me', myDisp: null, foeDisp: '', vow: VOWS[0] },
      battle: null
    };
  }
  let S = load() || fresh();
  S.field = Object.assign(fresh().field, S.field || {});
  if (!S.slots) S.slots = {};
  // the owner's placements are the starting point for everyone; anything a person has placed themselves stays theirs
  Object.keys(LIB.slots || {}).forEach((k) => { if (!S.slots[k] && POOL.some((x) => x.id === LIB.slots[k])) S.slots[k] = LIB.slots[k]; });
  Object.keys(S.rivals || {}).forEach((k) => { const R = S.rivals[k], d = R && (LIB.rivals || {})[R.faction]; if (d && !R.emblemId && POOL.some((x) => x.id === d.id)) { R.emblemId = d.id; R.emblemTint = d.tint; R.emblemInvert = d.invert; } });
  if (S.screen !== 'battle') S.screen = 'home';
  (() => { const o = S.slots['army:other']; const it = o && POOL.find((x) => x.id === o); if (it && /aquila|eagle/i.test(it.name) && !S.slots.terra) { S.slots.terra = o; delete S.slots['army:other']; } })();
  // Terra wears the aquila. An earlier build matched "imperium" too and put the Agents of the Imperium badge there by mistake.
  function fixTerra() {
    const cur = POOL.find((x) => x.id === S.slots.terra);
    if (cur && /aquila/i.test(cur.name)) return false;
    if (cur && !/imperium|inquisit/i.test(cur.name)) return false;
    const aq = POOL.find((x) => /aquila/i.test(x.name)); if (!aq) { if (cur) { delete S.slots.terra; return true; } return false; }
    S.slots.terra = aq.id; return true;
  }
  if (fixTerra()) setTimeout(save, 0);
  // move pictures added before the library existed into it
  (() => {
    let moved = false; const put = (src, name) => { const id = 'p' + Math.random().toString(36).slice(2, 10); POOL.push({ id, name, src }); moved = true; return id; };
    Object.keys(S.emblems || {}).forEach((k) => { S.slots['army:' + k] = put(S.emblems[k], ARMY[k] ? ARMY[k].label : k); });
    delete S.emblems;
    Object.keys(S.rivals).forEach((k) => { const R = S.rivals[k]; if (R.emblemSrc) { R.emblemId = put(R.emblemSrc, R.faction); delete R.emblemSrc; delete R.emblemMask; } });
    if (moved) poolSave();
  })();
  if (S.field.side === 'left') S.field.side = 'a'; else if (S.field.side === 'right') S.field.side = 'b';
  let UI = { overlay: null, sheet: null, view: 'emblem', math: {}, assign: null, libPick: null, undo: [] };
  // every battle-changing tap can be undone; the label says what was undone
  const UNDO_LABEL = { adj: 'score change', cpBoth: '+1 CP each', phase: 'phase change', useStrat: 'stratagem', foeUsed: 'their stratagem', hurt: 'wound', kill: 'model removed', heal: 'heal',
    spotPick: 'spotted unit', spotN: 'model count', removeSpot: 'spotted unit removed', rv: 'points change', priAdd: 'primary points', secAdd: 'secondary points', cardDone: 'card achieved',
    cardDrop: 'card discarded', objCycle: 'objective change', cell: 'table square', rkill: 'kill count', ready: 'Battle Ready', startRound: 'new round', doctrine: 'doctrine', dealNow: 'card draw',
    vox: 'marked moment', logAdd: 'log entry', quarter: 'table quarter', drawSel: 'card draw' };
  function undoMark(label, before) {
    if (!S.battle || S.screen !== 'battle') return;
    if (JSON.stringify(S.battle) === before) return;
    UI.undo.push({ b: before, label }); if (UI.undo.length > 40) UI.undo.shift();
  }
  function load() { try { const s = JSON.parse(localStorage.getItem(KEY)); return s && s.v === 1 ? s : null; } catch (e) { return null; } }
  // stamp only real changes, so an untouched device never outranks one that was used
  let lastSaved = '';
  function save() {
    const body = JSON.stringify(Object.assign({}, S, { updatedAt: 0 }));
    if (body !== lastSaved) { if (lastSaved) S.updatedAt = Date.now(); lastSaved = body; scheduleStatePush(); if (LIVE.on) livePush(); }
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage unavailable */ }
  }

  // ---------- helpers ----------
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const A = () => { const a = ARMY[S.army]; if (S.army === 'guard') return Object.assign({}, a, { cry: amReg()[4] }); if (S.army !== 'deathwatch') return a; const xen = foe() && XENOS.test(foe().faction); return xen ? Object.assign({}, a, { foeQ: 'The Xenos', steps: [a.steps[0], 'II · The Xenos', a.steps[2]] }) : a; };
  const list = () => S.lists[S.army];
  const foe = () => S.rivals[S.foeKey];
  function factionInfo(name) { const f = FACTIONS.find((x) => x[0] === name); return { theme: f ? f[1] : 'loyal', display: f && f[2] ? f[2] : name }; }
  // For the "Other" army, the pasted army decides the frame colours and the picture used inside its screens
  function myOtherTheme() {
    const L = S.lists.other; if (!L) return null;
    const hit = [L.subfaction, L.faction].map((n) => FACTIONS.find((x) => x[0] === n)).find(Boolean);
    if (hit) return FOE_THEMES[hit[1]];
    return /space marine|astartes/i.test(L.faction || '') ? FOE_THEMES.loyal : null;
  }
  // whose armies get their own buttons: the owner's two, or none for everyone else (they build theirs up through Other)
  const XENOS = /necron|aeldari|drukhari|ork|tyranid|genestealer|t'au|votann|harlequin/i;
  // the battle world is your army's home: Templars and Dark Angels live on a ship and a rock, so they keep Terra
  const HOMEWORLDS = { wolves: ['Fenris', 'wolves-storm'], necron: ['The Tomb World', 'necrons-tomb-city'], asuryani: ['The Craftworld', 'aeldari-autarch'], deathwatch: ['Erioch', 'deathwatch-fortress'], orks: ['Da Rok', 'orks-rok'], custodes: ['The Imperial Palace', 'custodes-palace'] };
  function homeWorld() { if (S.army === 'guard') return { name: amReg()[2], img: 'lib/pmwam_w_' + amReg()[1] + '.webp' }; const h = HOMEWORLDS[S.army]; if (!h) return { name: 'Terra', img: '' }; const it = POOL.find((x) => x.name === h[1]); return { name: h[0], img: it ? it.src : '' }; }
  const OWNER = /^f\.weir88@gmail\.com$/i;
  const MAINABLE = { 'Space Wolves': 'wolves', 'Dark Angels': 'dark', Necrons: 'necron', Aeldari: 'asuryani', Deathwatch: 'deathwatch', 'Imperial Fists': 'fists', Orks: 'orks', 'Adeptus Custodes': 'custodes', 'Astra Militarum': 'guard' };
  const myArmies = () => (!Array.isArray(S.mine) ? ['templars'] : S.mine.filter((k) => ARMY[k] && k !== 'carcharodons'));
  const mainFor = (L) => (L ? MAINABLE[listFaction(L)] || MAINABLE[L.subfaction] || MAINABLE[L.faction] || null : null);
  // a list loaded through Other is kept by its army: the last one per army, the two most recent armies
  function rememberFac(r) {
    const f = listFaction(r) || r.subfaction || r.faction || r.name; if (!f) return;
    S.facs = [{ f, list: r }].concat((S.facs || []).filter((x) => x.f !== f)).slice(0, 2); S.facKey = f;
  }
  const otherPic = () => (S.army === 'other' ? poolItem(S.slots['list:other']) : null);
  function applyArmyTheme() {
    const st = document.body.style; const t = S.army === 'other' ? myOtherTheme() : null;
    ['--bg', '--panel', '--panel2', '--line', '--line2', '--accent', '--accent-text'].forEach((k) => st.removeProperty(k));
    if (!t) return;
    st.setProperty('--bg', `color-mix(in srgb, ${t[6]}, #000 40%)`);
    st.setProperty('--panel', `color-mix(in srgb, ${t[6]}, ${t[3]} 22%)`);
    st.setProperty('--panel2', `color-mix(in srgb, ${t[6]}, ${t[3]} 30%)`);
    st.setProperty('--line', `color-mix(in srgb, ${t[7]}, #000 25%)`);
    st.setProperty('--line2', t[7]);
    st.setProperty('--accent', `color-mix(in srgb, ${t[2]}, #000 35%)`);
    st.setProperty('--accent-text', t[1]);
  }
  // ---------- Necron dynasty colours: the whole Infinite Empire frame is drawn in pink, then turned to the player's chosen hue ----------
  const NEC_CSS = "/* ===== Necrons as YOUR army: the Infinite Empire. The tomb city above, the waking halls below, all lit in your dynasty's pink ===== */\nbody.army-necron {\n  --bg: #07050A; --panel: #130D12; --panel2: #170F15; --line: #3A1E2E; --line2: #8A2A58;\n  --text: #F3E6EE; --muted: #C2AAB8; --dim: #8E7A86; --accent: #F0287F; --accent-text: #FF8FC0; --gold: #FF8FC0; --good: #FF8FC0;\n  --head: 'Oxanium', 'Chakra Petch', sans-serif; --head-weight: 600; --head-size: 0.82;\n}\nbody.army-necron #void { display: block; background: #07050A; }\nbody.army-necron #void::before { content: \"\"; position: absolute; left: 0; right: 0; top: 0; height: 66%;\n  background: linear-gradient(rgba(7,5,10,0.45), rgba(7,5,10,0.4)), url(\"lib/pmwnec3.webp\") 50% 0 / cover no-repeat; filter: hue-rotate(__IMGROT__) saturate(0.95);\n  -webkit-mask-image: linear-gradient(#000 55%, transparent); mask-image: linear-gradient(#000 55%, transparent); }\nbody.army-necron #void::after { content: \"\"; position: absolute; left: 0; right: 0; bottom: 0; height: 58%;\n  background: linear-gradient(rgba(7,5,10,0.55), rgba(7,5,10,0.6)), url(\"lib/pmwnec2.webp\") 50% 50% / cover no-repeat; filter: hue-rotate(__IMGROT__) saturate(0.95);\n  -webkit-mask-image: linear-gradient(transparent, #000 45%); mask-image: linear-gradient(transparent, #000 45%); }\n.emblem.monolith .nec-art { filter: hue-rotate(__IMGROT__) saturate(0.95) brightness(0.8); }\n.emblem.monolith .nec-edge { animation: necEdge 5s ease-in-out infinite; }\n@keyframes necEdge { 0%, 100% { opacity: 0.45; } 50% { opacity: 1; } }\nbody.army-necron .band { padding-bottom: 34px !important; border-top-color: #F0287F; background-color: rgba(19,13,18,0.92);\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='18' preserveAspectRatio='none'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%236E6158' stop-opacity='0'/%3E%3Cstop offset='0.55' stop-color='%235A4E46' stop-opacity='0.55'/%3E%3Cstop offset='1' stop-color='%233A322D' stop-opacity='0.85'/%3E%3C/linearGradient%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' seed='2'/%3E%3CfeColorMatrix values='0 0 0 0 0.45 0 0 0 0 0.4 0 0 0 0 0.36 0 0 0 1.2 -0.45'/%3E%3CfeComposite in2='SourceGraphic' operator='in'/%3E%3C/filter%3E%3C/defs%3E%3Cpath d='M0 18 L0 9 Q 40 4 80 8 T 160 7 T 240 9 T 320 9 L320 18 Z' fill='url(%23g)'/%3E%3Cpath d='M0 18 L0 9 Q 40 4 80 8 T 160 7 T 240 9 T 320 9 L320 18 Z' fill='%23000' filter='url(%23n)'/%3E%3C/svg%3E\"), var(--grime), var(--stain), linear-gradient(180deg, rgba(36,26,32,0.92), rgba(14,10,13,0.95));\n  background-size: 320px 14px, 180px 180px, 420px 420px, 100% 100%; background-position: -40px calc(100% - 28px), 0 0, 0 0, 0 0; background-repeat: repeat-x, repeat, repeat, no-repeat; }\nbody.army-necron .band::after { content: \"\"; position: absolute; left: 0; right: 0; bottom: 3px; height: 26px; pointer-events: none;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='168' height='26'%3E%3Cdefs%3E%3ClinearGradient id='m' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23332C31'/%3E%3Cstop offset='0.5' stop-color='%231B171A'/%3E%3Cstop offset='1' stop-color='%230B090B'/%3E%3C/linearGradient%3E%3Cfilter id='o'%3E%3CfeGaussianBlur stdDeviation='0.8' result='b'/%3E%3CfeMerge%3E%3CfeMergeNode in='b'/%3E%3CfeMergeNode in='SourceGraphic'/%3E%3C/feMerge%3E%3C/filter%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.3' numOctaves='2' seed='9'/%3E%3CfeColorMatrix values='0 0 0 0 0.3 0 0 0 0 0.26 0 0 0 0 0.23 0 0 0 1.4 -0.6'/%3E%3CfeComposite in2='SourceGraphic' operator='in'/%3E%3C/filter%3E%3C/defs%3E%3Crect x='0' y='11' width='168' height='3' fill='%230A080A'/%3E%3Cg%3E%3Crect x='1' y='5' width='26' height='15' rx='1.5' fill='url(%23m)'/%3E%3Crect x='1' y='5' width='26' height='1' fill='%238A7A84' fill-opacity='0.3'/%3E%3Crect x='29' y='5' width='26' height='15' rx='1.5' fill='url(%23m)'/%3E%3Crect x='29' y='5' width='26' height='1' fill='%238A7A84' fill-opacity='0.3'/%3E%3Crect x='57' y='5' width='26' height='15' rx='1.5' fill='url(%23m)'/%3E%3Crect x='57' y='5' width='26' height='1' fill='%238A7A84' fill-opacity='0.3'/%3E%3Crect x='85' y='5' width='26' height='15' rx='1.5' fill='url(%23m)'/%3E%3Crect x='85' y='5' width='26' height='1' fill='%238A7A84' fill-opacity='0.3'/%3E%3Crect x='113' y='5' width='26' height='15' rx='1.5' fill='url(%23m)'/%3E%3Crect x='113' y='5' width='26' height='1' fill='%238A7A84' fill-opacity='0.3'/%3E%3Crect x='141' y='5' width='26' height='15' rx='1.5' fill='url(%23m)'/%3E%3Crect x='141' y='5' width='26' height='1' fill='%238A7A84' fill-opacity='0.3'/%3E%3C/g%3E%3Cg filter='url(%23w)'%3E%3Crect x='1' y='5' width='26' height='15' rx='1.5' fill='url(%23m)'/%3E%3Crect x='1' y='5' width='26' height='1' fill='%238A7A84' fill-opacity='0.3'/%3E%3Crect x='29' y='5' width='26' height='15' rx='1.5' fill='url(%23m)'/%3E%3Crect x='29' y='5' width='26' height='1' fill='%238A7A84' fill-opacity='0.3'/%3E%3Crect x='57' y='5' width='26' height='15' rx='1.5' fill='url(%23m)'/%3E%3Crect x='57' y='5' width='26' height='1' fill='%238A7A84' fill-opacity='0.3'/%3E%3Crect x='85' y='5' width='26' height='15' rx='1.5' fill='url(%23m)'/%3E%3Crect x='85' y='5' width='26' height='1' fill='%238A7A84' fill-opacity='0.3'/%3E%3Crect x='113' y='5' width='26' height='15' rx='1.5' fill='url(%23m)'/%3E%3Crect x='113' y='5' width='26' height='1' fill='%238A7A84' fill-opacity='0.3'/%3E%3Crect x='141' y='5' width='26' height='15' rx='1.5' fill='url(%23m)'/%3E%3Crect x='141' y='5' width='26' height='1' fill='%238A7A84' fill-opacity='0.3'/%3E%3C/g%3E%3Cg filter='url(%23o)' opacity='0.8'%3E%3Cg transform='translate(14 12.6) scale(0.8)' fill='none' stroke='%23FF7FB8' stroke-width='1.1' stroke-linecap='round'%3E%3Cpath d='M-3 -4 A4 4 0 1 0 3 -4'/%3E%3Cpath d='M0 -1 V7'/%3E%3Ccircle cx='0' cy='-5' r='0.9' fill='%23FF7FB8'/%3E%3C/g%3E%3Cg transform='translate(42 12.6) scale(0.8)' fill='none' stroke='%23FF7FB8' stroke-width='1.1' stroke-linecap='round'%3E%3Ccircle cx='0' cy='0' r='3.6'/%3E%3Cpath d='M0 -3.6 V3.6 M-3.6 6.5 H3.6'/%3E%3C/g%3E%3Cg transform='translate(70 12.6) scale(0.8)' fill='none' stroke='%23FF7FB8' stroke-width='1.1' stroke-linecap='round'%3E%3Ccircle cx='0' cy='-2' r='3'/%3E%3Cpath d='M0 1 V7 M-2.5 7 H2.5'/%3E%3C/g%3E%3Cg transform='translate(98 12.6) scale(0.8)' fill='none' stroke='%23FF7FB8' stroke-width='1.1' stroke-linecap='round'%3E%3Cpath d='M-3.2 2 A3.2 3.2 0 0 1 3.2 2'/%3E%3Cpath d='M0 -6 V7'/%3E%3C/g%3E%3Cg transform='translate(126 12.6) scale(0.8)' fill='none' stroke='%23FF7FB8' stroke-width='1.1' stroke-linecap='round'%3E%3Cpath d='M-3 -5 V7 M3 -5 V7'/%3E%3Ccircle cx='0' cy='1' r='1.8'/%3E%3C/g%3E%3Cg transform='translate(154 12.6) scale(0.8)' fill='none' stroke='%23FF7FB8' stroke-width='1.1' stroke-linecap='round'%3E%3Cpath d='M-3 -5 L0 -2 L3 -5 M0 -2 V7'/%3E%3Cpath d='M-2 3 H2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\") repeat-x 0 0 / 168px 26px; animation: necBand 5s ease-in-out infinite; }\nbody.army-necron .panel { position: relative; background-color: rgba(19,13,18,0.9);\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='18' preserveAspectRatio='none'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%236E6158' stop-opacity='0'/%3E%3Cstop offset='0.55' stop-color='%235A4E46' stop-opacity='0.55'/%3E%3Cstop offset='1' stop-color='%233A322D' stop-opacity='0.85'/%3E%3C/linearGradient%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' seed='2'/%3E%3CfeColorMatrix values='0 0 0 0 0.45 0 0 0 0 0.4 0 0 0 0 0.36 0 0 0 1.2 -0.45'/%3E%3CfeComposite in2='SourceGraphic' operator='in'/%3E%3C/filter%3E%3C/defs%3E%3Cpath d='M0 18 L0 9 Q 40 4 80 8 T 160 7 T 240 9 T 320 9 L320 18 Z' fill='url(%23g)'/%3E%3Cpath d='M0 18 L0 9 Q 40 4 80 8 T 160 7 T 240 9 T 320 9 L320 18 Z' fill='%23000' filter='url(%23n)'/%3E%3C/svg%3E\"), repeating-linear-gradient(90deg, rgba(240,40,127,0.45) 0 16px, rgba(20,6,12,0.9) 16px 19px),\n    url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' fill='none' stroke='%23FF4F9C' stroke-opacity='0.07' stroke-width='1.2'%3E%3Cpath d='M0 30H40V70H92M60 0V20H112M22 120V96H70V58M120 84H100V110'/%3E%3C/svg%3E\"),\n    var(--grime), var(--stain), linear-gradient(180deg, rgba(30,21,27,0.92), rgba(14,10,13,0.95));\n  background-size: 320px 12px, 100% 3px, 120px 120px, 180px 180px, 420px 420px, 100% 100%;\n  background-position: -100px bottom, top left, 0 0, 0 0, 0 0, 0 0; background-repeat: repeat-x, no-repeat, repeat, repeat, repeat, no-repeat; border-color: #4A2238; }\nbody.army-necron .eyebrow { font-family: 'Share Tech Mono', monospace; letter-spacing: 0.12em; }\nbody.army-necron .banner { background-color: rgba(19,13,18,0.92); border-color: #8A2A58; background-image: var(--grime), linear-gradient(180deg, rgba(36,26,32,0.92), rgba(14,10,13,0.95)); background-size: 180px 180px, 100% 100%; }\nbody.army-necron .sheet { background: #0C080B; }\nbody.army-necron .clash .mine { background-image: var(--grime), linear-gradient(100deg, #3A1E2E, #160D13); background-size: 180px 180px, 100% 100%; }\nbody.army-necron .fight-btn { background-image: linear-gradient(180deg, #C21E66, #6A0E36); border-color: #FF8FC0; font-family: 'Oxanium', sans-serif; }\n";
  const ORK_CLANS = [['Goffs', 'goffs', '#B3231B'], ['Bad Moons', 'badmoons', '#D9A916'], ['Evil Sunz', 'evilsunz', '#C8361C'], ['Blood Axes', 'bloodaxes', '#7E7A4E'], ['Snakebites', 'snakebites', '#8A6A2E'], ['Deathskulls', 'deathskulls', '#3F72B8'], ['Freebooterz', 'freebooterz', '#8C8577']];
  const orkClan = () => ORK_CLANS.find((c) => c[1] === S.orkClan) || ORK_CLANS[0];
  // the Custodes' Shield Hosts (sourced: Warhammer Community 2021 and the Custodes histories)
  const CU_HOSTS = ["Emperor's Chosen", 'Solar Watch', 'Dread Host', 'Aquilan Shield', 'Shadowkeepers', 'Emissaries Imperatus'];
  // Astra Militarum regiments: name, key, home world, colour, battle cry (cries from the regiments' own lines in the lore)
  const AM_REGS = [
    ['Cadian Shock Troops', 'cadia', 'Cadia', '#7C8A4A', 'Cadia stands!'],
    ['Catachan Jungle Fighters', 'catachan', 'Catachan', '#B23A2C', 'We draw the line here!'],
    ['Death Korps of Krieg', 'krieg', 'Krieg', '#8A866A', 'We never retreat. We fight and we die.'],
    ['Vostroyan Firstborn', 'vostroya', 'Vostroya', '#A8302A', 'For Vostroya, and the Firstborn!'],
    ['Mordian Iron Guard', 'mordian', 'Mordian', '#3A5BA0', 'No remorse, no mercy, no forgiveness.'],
    ['Tallarn Desert Raiders', 'tallarn', 'Tallarn', '#C49A5A', 'Swift and silent, as the desert wind.'],
    ['Valhallan Ice Warriors', 'valhalla', 'Valhalla', '#A9BCC6', 'Things can always get worse.'],
    ['Armageddon Steel Legion', 'armageddon', 'Armageddon', '#9A8258', 'Steel Legion, advance!'],
  ];
  const amReg = () => AM_REGS.find((r) => r[1] === S.amReg) || AM_REGS[0];
  const cuHost = () => (CU_HOSTS.includes(S.cuHost) ? S.cuHost : CU_HOSTS[0]);
  const NEC_HUES = [['Sautekh green', 125], ['Pink', 333], ['Mephrit gold', 45], ['Novokh blood-red', 356], ['Nihilakh verdigris', 168], ['Void blue', 210], ['Purple', 280]];
  const necHue = () => (S.hue && S.hue.necron !== undefined ? S.hue.necron : 125);
  function hueShift(str, to) {
    const turn = (r, g, b) => {
      r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
      if (d < 0.08) return [r, g, b].map((v) => Math.round(v * 255));
      const sat = d / (1 - Math.abs(2 * l - 1)); let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h = h * 60;
      h = (h - 333 + to + 720) % 360;
      const c = (1 - Math.abs(2 * l - 1)) * sat, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
      const [a, bb, cc] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
      return [a + m, bb + m, cc + m].map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255));
    };
    const hex = (v) => v.map((n) => n.toString(16).padStart(2, '0')).join('').toUpperCase();
    return str.replace(/(#|%23)([0-9A-Fa-f]{6})\b/g, (m0, pre, h6) => pre + hex(turn(parseInt(h6.slice(0, 2), 16), parseInt(h6.slice(2, 4), 16), parseInt(h6.slice(4, 6), 16))))
      .replace(/rgba\((\d+),\s*(\d+),\s*(\d+),/g, (m0, r, g, b) => 'rgba(' + turn(+r, +g, +b).join(',') + ',');
  }
  let necApplied = null;
  function applyNecronTheme() {
    let el = document.getElementById('nec-theme');
    if (S.army !== 'necron') { if (el) el.textContent = ''; necApplied = null; return; }
    const h = necHue(); if (necApplied === h && el && el.textContent) return;
    if (!el) { el = document.createElement('style'); el.id = 'nec-theme'; document.head.appendChild(el); }
    el.textContent = hueShift(NEC_CSS, h).replace(/__IMGROT__/g, ((h - 120 + 360) % 360) + 'deg'); necApplied = h;
  }
  let lastFoeVP = null;
  function foeScoredFx() {
    const v = S.battle && !S.battle.ended ? S.battle.vp.foe : null;
    if (v !== null && lastFoeVP !== null && v > lastFoeVP && !reduceMotion) { document.body.classList.remove('foe-scored'); void document.body.offsetWidth; document.body.classList.add('foe-scored'); clearTimeout(foeScoredFx.t); foeScoredFx.t = setTimeout(() => document.body.classList.remove('foe-scored'), 1600); }
    lastFoeVP = v;
  }
  function applyFoeTheme() {
    const key = factionInfo(foe().faction).theme; const t = FOE_THEMES[key] || FOE_THEMES.loyal;
    document.body.dataset.foe = key; // the opponent's texture pack (panels, bars, living detail)
    const r = document.documentElement.style;
    ['--foe-a', '--foe-b', '--foe-c', '--foe-d', '--foe-text', '--foe-soft', '--foe-deep', '--foe-line'].forEach((k, i) => r.setProperty(k, t[i]));
  }
  function toast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => { t.hidden = true; }, 2200); }
  const ICON = {
    back: '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 L8 12 L15 19"></path></svg>',
    next: '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5 L16 12 L9 19"></path></svg>',
    close: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6 L18 18 M18 6 L6 18"></path></svg>',
    cross: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path d="M9 2 H15 L13.2 10.8 L22 9 V15 L13.2 13.2 L15 22 H9 L10.8 13.2 L2 15 V9 L10.8 10.8 Z" fill="currentColor"></path></svg>',
    omega: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 17 H7 V14 A6.5 6.5 0 1 1 13 14 V17 H17"></path></svg>',
    tear: '<svg aria-hidden="true" width="14" height="22" viewBox="0 0 14 22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 1 C 9 7 13 11 13 15 A6 6 0 0 1 1 15 C 1 11 5 7 7 1 Z"></path><circle cx="7" cy="15" r="2" fill="currentColor"></circle></svg>',
    glyph: '<svg aria-hidden="true" width="16" height="22" viewBox="-8 -11 16 22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="0" cy="-3" r="4"></circle><path d="M0 1 V10 M-3.5 10 H3.5 M-6 -3 H-4 M4 -3 H6 M0 -9 V-7"></path></svg>',
    blade: '<svg aria-hidden="true" width="14" height="24" viewBox="0 0 14 26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M7 1 V5"></path><path d="M2 5.5 H12"></path><path d="M5.4 6 V17 L7.4 15.4 L6.2 18.4 L8.6 16.6 V6"></path><path d="M6.6 21 L7.6 20 L8 23.4 L7 25.6 L6.2 23 Z" fill="currentColor" fill-opacity="0.5"></path></svg>',
    ward: '<svg aria-hidden="true" width="16" height="22" viewBox="0 0 16 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M8 1 L15 11 L8 21 L1 11 Z"></path><path d="M8 4 V18"></path><circle cx="8" cy="11" r="1.8" fill="currentColor"></circle></svg>',
    tooth: '<svg aria-hidden="true" width="16" height="20" viewBox="-9 -21 18 26"><path d="M-6.5 0 L-4.6 -5.4 L-2.9 -10.9 L-1.2 -16.3 L2.2 -19 L3.4 -13.6 L4.5 -8.1 L5.6 -2.7 L6.5 0 Q0 5 -6.5 0 Z" fill="currentColor"></path></svg>',
    vox: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="9" width="14" height="12" rx="1"></rect><path d="M8 13 H16 M8 16 H16 M12 9 V3 M9 4 L12 3 L15 4"></path></svg>',
    undo: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5 L4 10 L9 15"></path><path d="M4 10 H15 A5 5 0 0 1 15 20 H10"></path></svg>',
    list: '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M8 6 H20 M8 12 H20 M8 18 H20 M4 6 H4.5 M4 12 H4.5 M4 18 H4.5"></path></svg>'
  };
  const cryIcon = () => (S.army === 'carcharodons' ? ICON.tooth : S.army === 'wolves' ? ICON.ward : S.army === 'dark' ? ICON.blade : S.army === 'necron' ? ICON.glyph : S.army === 'asuryani' ? ICON.tear : S.army === 'fists' ? ICON.blade : S.army === 'orks' ? ICON.tooth : S.army === 'custodes' ? ICON.blade : S.army === 'deathwatch' ? ICON.omega : ICON.cross);

  // ---------- list parser (40k app text export) ----------
  // Any list as plain text (Warhammer app, Warmind, New Recruit, Listforge, BattleScribe, typed by hand):
  // try the Warhammer app layout first; if that doesn't fit, read the text for units, points, models, the army and detachment.
  // a saved list with a missing or broken number (an import that read "1,250" as nothing) is mended, not fatal
  function cleanList(L) {
    if (!L || typeof L !== 'object') return L;
    if (!Array.isArray(L.units)) L.units = [];
    if (!Array.isArray(L.detachments)) L.detachments = L.detachments ? [String(L.detachments)] : [];
    L.units.forEach((u) => { if (!Number.isFinite(+u.points) || u.points === null) u.points = 0; else u.points = +u.points; if (!Array.isArray(u.models)) u.models = [{ count: 1, name: u.name || 'Unit', wargear: [] }]; if (!Array.isArray(u.enhancements)) u.enhancements = []; if (!u.name) u.name = 'Unknown unit'; });
    L.points_total = L.units.reduce((a, u) => a + u.points, 0);
    if (L.points_limit !== null && L.points_limit !== undefined && !Number.isFinite(+L.points_limit)) L.points_limit = null;
    if (!L.name) L.name = (L.subfaction || L.faction || 'My army') + ' list';
    return L;
  }
  function parseList(text) {
    // "(1,045 points)" and "2,000 pts": drop the thousands comma so every unit and the points limit are read
    text = String(text || '').replace(/(\d{1,3}),(\d{3})(?=\s*(?:points|pts|pt|p)\b)/gi, '$1$2');
    return cleanList(parseListRaw(text));
  }
  function parseListRaw(text) {
    let r = null, err = null;
    try { r = parseGW(text); } catch (e) { err = e; }
    if (r && r.units.length && r.units.every((u) => u.points)) return r;
    const g = parseAnyText(text);
    if (g.units.length) return g;
    if (r) return r;
    throw err || new Error('No units found. Paste a list with each unit and its points, for example "Necron Warriors (90 points)".');
  }
  function knownUnitNames() {
    const set = new Set(Object.keys(D.units));
    Object.values(FOES).forEach((f) => { if (f && f.units) Object.keys(f.units).forEach((n) => set.add(n)); });
    Object.keys((window.IT_FOES && window.IT_FOES.smUnits) || {}).forEach((n) => set.add(n));
    return [...set];
  }
  function parseAnyText(text) {
    const lines = text.replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+$/, ''));
    const PTS = /[\(\[\{]?\s*(\d{1,2},\d{3}|\d{2,4})\s*(?:pts|points|pt|p)\b\.?\s*[\)\]\}]?/i;
    const LEAD = /^\s*(?:[-*•▪◦+>.]\s*)*/;
    const COUNT = /^(\d+)\s*[x×]\s*(.+)$|^(.+?)\s*[x×]\s*(\d+)$|^(.+?)\s+(\d+)\s*[x×]$/i;
    const cnum = (m) => +(m[1] || m[4] || m[6]), cname = (m) => (m[2] || m[3] || m[5]).trim();
    const SKIP = /^(characters?|battleline|other datasheets|dedicated transports|allied units|attached units?|epic heroes|infantry|vehicles?|monsters?|beasts?|fast attack|heavy support|elites|troops|hq|lord of war|flyers?|fortifications?|units?|enhancements?|total|army|list)\s*:?$/i;
    const ind = (l) => l.length - l.replace(/^\s+/, '').length;
    const known = knownUnitNames(); const kn = known.map((n) => [n, norm(n)]);
    const findUnit = (name) => { const n = norm(name); return (kn.find((x) => x[1] === n) || kn.find((x) => x[1] === n.replace(/s$/, '')) || kn.find((x) => n.startsWith(x[1] + ' ') || x[1].startsWith(n + ' ')) || [null])[0]; };
    const facNames = FACTIONS.map((f) => f[0]).concat(['Space Marines', 'Adeptus Astartes']);
    const allDets = D.rulesSM.detachments.map((d) => d.name).concat(...Object.values(FOES).map((f) => ((f && f.detachments) || []).map((d) => d.name)));
    const low = text.toLowerCase();
    const r = { name: '', faction: null, subfaction: null, detachments: [], detachment_points: null, force_disposition: null, battle_size: null, points_limit: null, units: [] };
    // the army: Space Marine chapters sit under "Space Marines"
    const facHits = facNames.filter((f) => new RegExp('\\b' + f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(text));
    const chapter = facHits.find((f) => f !== 'Space Marines' && f !== 'Adeptus Astartes' && FACTION_FILES[f] && /space-marines|templars|angels|wolves|ultramarines|carcharodons/.test(FACTION_FILES[f] || ''));
    if (chapter || facHits.some((f) => /Space Marines|Adeptus Astartes|Black Templars|Dark Angels|Space Wolves|Blood Angels|Ultramarines|Deathwatch|Imperial Fists/.test(f))) { r.faction = 'Space Marines'; r.subfaction = chapter || facHits.find((f) => /Black Templars|Dark Angels|Space Wolves|Blood Angels|Ultramarines|Deathwatch/.test(f)) || null; }
    else r.faction = facHits[0] || null;
    r.detachments = [...new Set(allDets.filter((d) => low.includes(d.toLowerCase())))];
    let unit = null, firstText = '';
    lines.forEach((raw) => {
      if (/^\s*\+/.test(raw) && !/\d\s*(pts|points)/i.test(raw)) return;
      const lineTxt = raw.replace(LEAD, '').replace(/^\++\s*|\s*\++$/g, '').trim(); if (!lineTxt) return;
      if (!firstText) firstText = lineTxt;
      if (SKIP.test(lineTxt.replace(PTS, '').trim())) return;
      if (/warlord/i.test(lineTxt) && unit && !PTS.test(lineTxt)) { unit.warlord = true; return; }
      const enh = lineTxt.match(/^enhancements?\s*:\s*(.+?)(?:\s*[\(\[].*)?$/i);
      if (enh && unit) { unit.enhancements.push(enh[1].trim()); return; }
      const pm = lineTxt.match(PTS);
      if (pm) pm[1] = String(+pm[1].replace(/,/g, '') || 0);
      if (pm) {
        let name = lineTxt.replace(PTS, '').replace(/[-–—:|,]+\s*$/, '').replace(/^[-–—:|,]+/, '').trim();
        let cnt = null; name = name.replace(/\s*:\s*.*$/, '').trim(); const cm = name.match(COUNT); if (cm) { cnt = cnum(cm); name = cname(cm); }
        if (/warlord/i.test(name)) { name = name.replace(/\s*[\(\[]?\s*warlord\s*[\)\]]?\s*/i, ' ').trim(); }
        const hit = findUnit(name);
        if (!hit && (+pm[1] >= 500 || /strike force|incursion|onslaught|combat patrol/i.test(lineTxt) || r.units.length === 0 && !findUnit(name) && lineTxt === firstText)) { if (+pm[1] >= 500) { r.points_limit = r.points_limit || +pm[1]; r.battle_size = r.battle_size || name; } if (!r.name) r.name = name; return; }
        unit = { name: hit || name, points: +pm[1], section: null, attached_group: null, role: null, battleline: false, warlord: /warlord/i.test(lineTxt), enhancements: [], models: [], wargear: [], depth: ind(raw) };
        if (cnt) unit.models.push({ count: cnt, name: hit || name, wargear: [] });
        r.units.push(unit); return;
      }
      if (!unit) { if (!r.name) r.name = lineTxt.replace(/\s*[\(\[].*$/, '').replace(/\s*[-–—]\s*\d.*$/, '').trim(); return; }
      const head = lineTxt.split(':')[0].trim();
      const cx = head.match(COUNT), cy = cx ? null : head.match(/^(\d+)\s+(.+)$/);
      if (cx || cy) {
        const n = cx ? cnum(cx) : +cy[1], what = cx ? cname(cx) : cy[2].trim();
        // a model line names a model or the unit; anything else is wargear
        const isModel = findUnit(what) || norm(unit.name).includes(norm(what).replace(/s$/, '')) || norm(what).includes(norm(unit.name).replace(/s$/, '')) || (ds(unit.name) && (ds(unit.name).m || []).some((m) => norm(m.name).replace(/s$/, '') === norm(what).replace(/s$/, '')));
        if (isModel) unit.models.push({ count: n, name: what, wargear: [] });
        else unit.wargear.push({ count: n, name: what });
      }
    });
    r.units.forEach((u) => { if (!u.models.length) u.models = [{ count: 1, name: u.name, wargear: u.wargear }]; delete u.wargear; delete u.depth; u.model_count = u.models.reduce((a, m) => a + m.count, 0); });
    if (!r.name) r.name = (r.subfaction || r.faction || 'My army') + ' list';
    r.points_total = r.units.reduce((a, u) => a + u.points, 0);
    r.source = 'text';
    return r;
  }
  function parseGW(text) {
    const lines = text.replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+$/, ''));
    const unitRe = /^(.+?) \((\d+) points\)$/;
    const countRe = /^(\d+)x (.+)$/;
    const SECTIONS = ['ATTACHED UNITS', 'BATTLELINE', 'OTHER DATASHEETS', 'CHARACTERS', 'DEDICATED TRANSPORTS', 'ALLIED UNITS'];
    const ind = (l) => l.length - l.replace(/^ +/, '').length;
    const nonEmpty = lines.filter((l) => l.trim());
    if (!nonEmpty.length) throw new Error('The list is empty.');
    const first = nonEmpty[0].trim();
    const r = { name: unitRe.test(first) ? first.match(unitRe)[1] : first, faction: null, subfaction: null, detachments: [], detachment_points: null, force_disposition: null, battle_size: null, points_limit: null, units: [] };
    let i = lines.indexOf(nonEmpty[0]) + 1;
    for (; i < lines.length; i++) {
      const s = lines[i].trim();
      if (!s) continue;
      if (SECTIONS.includes(s.toUpperCase()) || /^Attached Unit \d+$/.test(s)) break;
      const m = s.match(/^(.+) \((\d+) Detachment Points\)$/);
      if (m) { r.detachments = m[1].split(/, | and /).map((x) => x.trim()).filter(Boolean); r.detachment_points = +m[2]; }
      else if (unitRe.test(s)) { const b = s.match(unitRe); r.battle_size = b[1]; r.points_limit = +b[2]; }
      else if (!r.faction) r.faction = s;
      else if (!r.detachments.length && !r.subfaction) r.subfaction = s;
      else r.force_disposition = s;
    }
    let group = null, section = null, unit = null;
    const body = lines.slice(i);
    body.forEach((l, idx) => {
      const s = l.trim();
      if (!s || s.startsWith('Exported with')) return;
      if (SECTIONS.includes(s.toUpperCase())) { section = s.charAt(0) + s.slice(1).toLowerCase(); group = null; return; }
      const g = s.match(/^Attached Unit (\d+)$/);
      if (g) { group = +g[1]; return; }
      if (ind(l) === 0 && unitRe.test(s)) {
        const um = s.match(unitRe);
        unit = { name: um[1], points: +um[2], section, attached_group: group, role: null, battleline: section === 'Battleline', warlord: false, enhancements: [], models: [], wargear: [] };
        r.units.push(unit); return;
      }
      if (!unit) return;
      const bullet = s.startsWith('•');
      const content = s.replace(/^•\s*/, '').trim();
      if (content.startsWith('Attached as:')) { const role = content.split(':')[1].trim(); unit.battleline = unit.battleline || role.includes('Battleline'); unit.role = role.split(' (')[0].toLowerCase(); return; }
      if (content === 'Warlord') { unit.warlord = true; return; }
      if (content.startsWith('Enhancement:')) { unit.enhancements.push(content.split(':').slice(1).join(':').trim().replace(/ \(Upgrade\)$/, '')); return; }
      const cm = content.match(countRe);
      if (!cm) return;
      const nxt = body.slice(idx + 1).find((x) => x.trim()) || '';
      const isModel = bullet && ind(nxt) > ind(l) && nxt.trim().startsWith('•');
      const entry = { count: +cm[1], name: cm[2] };
      if (isModel) { entry.wargear = []; unit.models.push(entry); }
      else if (unit.models.length && ind(l) > 2) unit.models[unit.models.length - 1].wargear.push(entry);
      else unit.wargear.push(entry);
    });
    r.units.forEach((u) => {
      if (!u.models.length) u.models = [{ count: 1, name: u.name, wargear: u.wargear }];
      delete u.wargear;
      u.model_count = u.models.reduce((a, m) => a + m.count, 0);
    });
    r.points_total = r.units.reduce((a, u) => a + u.points, 0);
    if (!r.units.length) throw new Error('No units found.');
    return r;
  }

  // ---------- rules lookups ----------
  const norm = (s) => String(s || '').toLowerCase().replace(/➤/g, '').replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();
  const sing = (s) => s.replace(/s$/, '');
  function ds(name) { const mine = [listFaction(list()), ARMY[S.army] && ARMY[S.army].lib, ARMY[S.army] && ARMY[S.army].label].find((f) => f && FRESH[f] && FRESH[f][name]); if (mine) return FRESH[mine][name]; return D.units[name] || (S.army === 'other' && list() ? foeUnits(listFaction(list()))[name] : ARMY[S.army] && ARMY[S.army].lib ? foeUnits(ARMY[S.army].lib)[name] : null) || null; }
  function matchProfile(profiles, modelName) {
    const n = norm(modelName);
    return profiles.find((p) => norm(p.name) === n) || profiles.find((p) => norm(p.name).includes(n) || n.includes(norm(p.name))) || profiles.find((p) => !/sergeant|captain|champion/i.test(p.name) || /sergeant/i.test(modelName)) || profiles[0];
  }
  function unitWeapons(rosterUnit) {
    const d = ds(rosterUnit.name);
    if (!d) return [];
    const counts = {};
    rosterUnit.models.forEach((m) => (m.wargear || []).forEach((w) => { counts[w.name] = (counts[w.name] || 0) + w.count; }));
    const out = [];
    Object.entries(counts).forEach(([wname, n]) => {
      const key = sing(norm(wname));
      const pools = [['ranged', d.r], ['melee', d.ml]];
      pools.forEach(([kind, pool]) => pool.forEach((w) => {
        const base = sing(norm(w.name).split(' - ')[0]);
        const alt = key.replace(/ sword$/, ' weapon');
        if (base === key || base === alt || base.startsWith(key + ' ') || key.startsWith(base + ' ') || base.endsWith(' ' + key)) out.push({ kind, w, n, label: w.name.replace(/^➤\s*/, '') });
      }));
    });
    return out;
  }
  function armyKeywords() {
    const set = new Set();
    (list() ? list().units : []).forEach((u) => {
      const d = ds(u.name);
      if (d) d.kw.concat(d.fk).forEach((k) => set.add(k.toUpperCase()));
      u.name.toUpperCase().split(/[^A-Z]+/).forEach((w) => w && set.add(w));
    });
    return set;
  }
  const REQS = ['TERMINATOR', 'PHOBOS', 'SCOUT', 'CHAPLAIN', 'JUDICIAR', 'VEHICLE', 'MONSTER', 'SMOKE', 'GRENADES', 'EXPLOSIVES', 'CHARACTER', 'WALKER'];
  function stratUsable(s, kws) {
    const t = (s.target || '').toUpperCase();
    const reqs = REQS.filter((r) => t.includes(r));
    if (!reqs.length) return true;
    return reqs.some((r) => kws.has(r) || kws.has(r + 'S'));
  }
  // every stratagem your army has: Space Marine books for Astartes, the army's own book for anyone else, plus the core ones
  function allMyStrats() {
    const L = list(); const dets = (L && L.detachments) || [];
    const lib = (ARMY[S.army] && ARMY[S.army].lib) || (S.army === 'other' ? listFaction(L) : ''); const fd = lib && FD(lib);
    const own = !isAstartes() && fd ? fd.stratagems.filter((x) => dets.includes(x[0])).map((x) => ({ det: x[0], name: x[1], cp: x[2], turn: x[3], phases: x[4], effect: x[5], when: x[6] || '', target: x[7] || '' }))
      : D.rulesSM.stratagems.filter((x) => dets.includes(x.det));
    return own.concat(D.rulesSM.core.map((x) => ({ ...x, det: 'Core' })));
  }
  function myStrats(phase, myTurn) {
    const kws = armyKeywords();
    const all = allMyStrats();
    return all.filter((s) => (s.phases.includes(phase.toLowerCase()) || s.phases.includes('any')) && (s.turn === 'either' || (s.turn === 'yours') === myTurn) && stratUsable(s, kws));
  }
  function foeStrats(phase, myTurn) {
    const f = FD(foe().faction); if (!f) return [];
    const dets = foe().detachments || [];
    return f.stratagems
      .filter((s) => dets.includes(s[0]))
      .map((s) => ({ det: s[0], name: s[1], cp: s[2], turn: s[3], phases: s[4], effect: s[5], when: s[6] || '', target: s[7] || '' }))
      .filter((s) => (s.phases.includes(phase.toLowerCase()) || s.phases.includes('any')) && (s.turn === 'either' || (s.turn === 'yours') === !myTurn));
  }

  // ---------- maths ----------
  function avg(v) {
    v = String(v || '').trim().toUpperCase();
    const m = v.match(/^(\d*)D(\d+)(?:\+(\d+))?$/);
    if (m) return (+(m[1] || 1)) * ((+m[2] + 1) / 2) + (+(m[3] || 0));
    const n = parseFloat(v); return isNaN(n) ? 0 : n;
  }
  const pRoll = (need) => { need = Math.max(2, need); return need > 6 ? 0 : (7 - need) / 6; };
  function woundNeed(S2, T) { if (S2 >= 2 * T) return 2; if (S2 > T) return 3; if (S2 === T) return 4; if (S2 * 2 <= T) return 6; return 5; }
  function expected(w, n, tgt) {
    const kw = (w.Keywords || '').toLowerCase();
    const attacks = avg(w.A) * n;
    const torrent = kw.includes('torrent');
    const skill = parseInt(w.BS || w.WS, 10) || 4;
    const pHit = torrent ? 1 : pRoll(skill);
    const crit = torrent ? 0 : 1 / 6;
    const sus = +((kw.match(/sustained hits (\d)/) || [])[1] || 0);
    const lethal = kw.includes('lethal hits');
    const dev = kw.includes('devastating wounds');
    const twin = kw.includes('twin-linked');
    const normalHits = attacks * (pHit - crit) + attacks * crit * (lethal ? 0 : 1) + attacks * crit * sus;
    const autoWounds = lethal ? attacks * crit : 0;
    const need = woundNeed(avg(w.S), tgt.T);
    let pW = pRoll(need); if (twin) pW = pW + (1 - pW) * pW;
    const rolledWounds = normalHits * pW;
    const devWounds = dev ? normalHits * (1 / 6) : 0;
    const wounds = rolledWounds + autoWounds;
    const ap = Math.abs(parseInt(w.AP, 10) || 0);
    const saveNeed = Math.min(tgt.Sv + ap, tgt.Inv || 99);
    const pFail = 1 - pRoll(saveNeed);
    const unsaved = (wounds - devWounds) * pFail + devWounds;
    const D2 = avg(w.D);
    const perHit = Math.min(D2, tgt.W) * (tgt.FNP ? 1 - pRoll(tgt.FNP) : 1);
    const dmg = unsaved * perHit;
    const toKill = Math.ceil(tgt.W / Math.max(0.0001, Math.min(D2, tgt.W)));
    const kills = Math.min(tgt.models, (unsaved * (tgt.FNP ? 1 - pRoll(tgt.FNP) : 1)) / toKill);
    return { attacks, hits: normalHits + autoWounds, wounds, unsaved, dmg, kills, need, saveNeed };
  }
  const f1 = (x) => (Math.round(x * 10) / 10).toString();

  // ---------- battle ----------
  // snapshot the battle into the history (status: 'finished' or 'unfinished'); called again later it updates the same entry
  function archiveBattle(status) {
    const B = S.battle; if (!B) return null;
    syncScores();
    const F = foe(), fi = factionInfo(F.faction), L = list();
    const g = {
      id: B.archived || ('g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)),
      date: B.archivedAt || new Date().toISOString(), status,
      army: S.army, armyLabel: S.army === 'other' ? ((L && (L.subfaction || L.faction)) || 'Other') : ARMY[S.army].label,
      list: L ? L.name : '', foeKey: S.foeKey, foe: fi.display, foeFaction: F.faction, foeName: F.name || '', foeDets: (F.detachments || []).slice(), warlord: F.warlord || '',
      mode: B.mode || 'comp', primary: B.primary || {}, deployment: S.field.deployment || '', twist: S.field.twist || '',
      first: S.field.first, vp: { me: B.vp.me, foe: B.vp.foe }, round: B.round, rounds: B.rounds, log: B.log, cards: B.cards,
      units: B.units.map((u) => ({ name: u.name, alive: alive(u), total: u.models.length }))
    };
    g.result = status === 'unfinished' ? 'Unfinished' : g.vp.me > g.vp.foe ? 'Victory' : g.vp.me < g.vp.foe ? 'Defeat' : 'Draw';
    if (status === 'ended early') g.early = true;
    B.archived = g.id; B.archivedAt = g.date;
    HIST = HIST.filter((x) => x.id !== g.id); HIST.unshift(g); histSave(); pushGame(g);
    return g;
  }
  // keep a finished game, and let the rival's record follow its result
  function saveFinished() {
    const B = S.battle; if (!B) return;
    const g = archiveBattle(B.round >= 5 ? 'finished' : 'ended early');
    if (g && !B.recorded && g.result !== 'Draw') { foe().record[g.result === 'Victory' ? 0 : 1]++; B.recorded = true; }
  }
  function buildUnits(L) {
    // Space Marine datasheets first, then the list's own army (any of the 25 other armies)
    const fu = foeUnits(listFaction(L) || (ARMY[S.army] && ARMY[S.army].lib) || '');
    return L.units.map((u, i) => {
      const d = ds(u.name) || fu[u.name] || null;
      const profs = d ? d.m : [];
      const models = [];
      u.models.forEach((m) => {
        const p = profs.length ? matchProfile(profs, m.name) : null;
        const W = p ? parseInt(p.W, 10) || 1 : 1;
        for (let k = 0; k < m.count; k++) models.push({ n: m.name, W, wl: W });
      });
      return { id: 'u' + i, name: u.name, pts: u.points, group: u.attached_group, role: u.role, warlord: u.warlord, enh: u.enhancements, models };
    });
  }
  function newBattle() {
    const L = list(); if (LIVE.on) liveClose();
    const units = buildUnits(L);
    const p = primaries();
    S.battle = { round: 1, turn: S.field.first, phase: 0, cp: { me: 0, foe: 0 }, vp: { me: 0, foe: 0 }, obj: { me: 0, foe: 0 }, units, spotted: [], log: [], ended: false,
      primary: p || { me: '', foe: '' }, tactical: secTactical(), foeTactical: foeSecTactical(), rounds: {}, cards: { me: [], foe: [] }, ready: { me: false, foe: false },
      objNames: OBJ_DEFAULT.map((o) => o[0]) };
    const B0 = S.battle; B0.mode = S.field.mode || 'comp'; autoCP(B0, true); B0.secOn = secOnF(); B0.secCount = secN(); B0.secRandom = B0.secOn && S.field.secPick === 'random';
    if (B0.secRandom) {
      // the app is the deck for both players
      B0.tactical = true; B0.foeTactical = true; B0.deck = { me: shuffle(Object.keys(M.secondary)), foe: shuffle(Object.keys(M.secondary)) };
      ensureRound(1); dealUp('me', 1, true); dealUp('foe', 1, true);
    } else if (B0.secOn) {
      // opening cards picked in The Field (Fixed picks, or an opening Tactical draw)
      [...new Set((S.field.fixed || []).filter(Boolean))].slice(0, B0.secCount).forEach((n) => B0.cards.me.push({ name: n, from: 1, to: null, status: 'active', vp: 0 }));
      [...new Set((S.field.foeSec || []).filter(Boolean))].slice(0, B0.secCount).forEach((n) => B0.cards.foe.push({ name: n, from: 1, to: null, status: 'active', vp: 0 }));
    }
    ensureRound(1);
    addLog('Battle begins. ' + (S.field.first === 'me' ? 'You' : 'They') + ' go first.' + (p ? ' Your primary: ' + p.me + '.' : ''), 'event');
  }
  function ensureRound(r) {
    const B = S.battle;
    if (!B.rounds) B.rounds = {};
    if (!B.objNames) B.objNames = OBJ_DEFAULT.map((o) => o[0]);
    if (!B.cards) B.cards = { me: [], foe: [] };
    if (!B.ready) B.ready = { me: false, foe: false };
    if (B.tactical === undefined) B.tactical = true;
    if (B.foeTactical === undefined) B.foeTactical = true;
    if (B.secOn === undefined) B.secOn = true;
    if (!B.secCount) B.secCount = 2;
    if (!B.primary) B.primary = primaries() || { me: '', foe: '' };
    if (!B.rounds[r]) {
      const prev = B.rounds[r - 1];
      B.rounds[r] = { pri: { me: 0, foe: 0 }, sec: { me: 0, foe: 0 }, obj: prev ? prev.obj.slice() : B.objNames.map(() => ''), kills: 0, quarters: [false, false, false, false], grid: prev && prev.grid ? prev.grid.slice() : Array(24).fill(''), notes: '', foeCards: '' };
    }
    if (!B.rounds[r].grid) B.rounds[r].grid = Array(24).fill('');
    if (!B.doctrine) B.doctrine = { active: '', used: {} };
    return B.rounds[r];
  }
  const CAPS = Object.assign({ primaryPerRound: 15, primaryTotal: 45, secondaryPerRound: 15, secondaryTotal: 45, fixedCardMax: 20, battleReady: 10 }, (D.missions && D.missions.caps) || {});
  // what a player has banked so far, each round capped, then the game capped
  function vpBank(who, kind, skip) {
    let t = 0; Object.keys(S.battle.rounds || {}).forEach((r) => { if (+r !== skip) t += Math.min(CAPS[kind + 'PerRound'], S.battle.rounds[r][kind === 'primary' ? 'pri' : 'sec'][who]); });
    return Math.min(CAPS[kind + 'Total'], t);
  }
  // how much more can go on: the round cap and what is left of the game cap
  function vpRoom(who, kind, r) {
    const R = ensureRound(r), cur = R[kind === 'primary' ? 'pri' : 'sec'][who];
    return Math.max(0, Math.min(CAPS[kind + 'PerRound'], CAPS[kind + 'Total'] - vpBank(who, kind, r)) - cur);
  }
  function vpAdd(who, kind, r, v) {
    const room = vpRoom(who, kind, r), got = Math.min(v, room);
    ensureRound(r)[kind === 'primary' ? 'pri' : 'sec'][who] += got;
    if (got < v) toast(got ? `+${got} VP: the ${kind} cap (${CAPS[kind + 'PerRound']} a round, ${CAPS[kind + 'Total']} a game) holds the rest` : `${kind === 'primary' ? 'Primary' : 'Secondary'} is capped: ${CAPS[kind + 'PerRound']} VP a round, ${CAPS[kind + 'Total']} a game`);
    return got;
  }
  function vpTotal(who) {
    const B = S.battle;
    return vpBank(who, 'primary') + vpBank(who, 'secondary') + (B.ready && B.ready[who] ? CAPS.battleReady : 0);
  }
  function syncScores() {
    const B = S.battle; if (!B || !B.rounds) return;
    const R = ensureRound(B.round);
    B.vp = { me: vpTotal('me'), foe: vpTotal('foe') };
    B.obj = { me: R.obj.filter((x) => x === 'me').length, foe: R.obj.filter((x) => x === 'foe').length };
  }
  function activeCards(who, r) { return (S.battle.cards[who] || []).filter((c) => c.from <= r && (c.to == null || c.to >= r)); }
  function drawCard(who, name, r) {
    const B = S.battle;
    if (activeCards(who, r).some((c) => c.name === name && c.status === 'active')) return;
    B.cards[who].push({ name, from: r, to: null, status: 'active', vp: 0 });
    addLog((who === 'me' ? 'You drew ' : 'They drew ') + name + '.', 'event');
  }
  function addLog(text, kind, extra) {
    const B = S.battle;
    B.log.push(Object.assign({ id: Date.now() + '' + Math.random().toString(36).slice(2, 6), r: B.round, turn: B.turn, phase: PHASES[B.phase], text, kind: kind || 'event', note: '' }, extra || {}));
  }
  function alive(u) { return u.models.filter((m) => m.wl > 0).length; }
  // ---------- automatic CP ----------
  // Who earns what, from the Wahapedia datasheets: 'wl' = gains 1CP at the start of each battle round while your Warlord
  // (Transhuman Strategist, Aquila Commander, Da Boss); 'cmd' = 1CP at the start of its controller's Command phase while on the battlefield;
  // 'roll' = a dice roll for CP the app reminds you to make.
  const CP_ABIL = {"lord solar leontus":[{"k":"cmd","a":"The Lord Solar"}],"acolyte hybrids with autopistols":[{"k":"roll","a":"Claimed for the Cult","x":"At the start of your Command phase, roll one D6 for each objective marker you control that has one or more units from your army with this ability within range o"}],"imotekh the stormlord":[{"k":"cmd","a":"Grand Strategist"}],"eldrad ulthran":[{"k":"cmd","a":"Diviner of Futures"}],"warboss":[{"k":"wl","a":"Da Boss"}],"warboss in mega armour":[{"k":"wl","a":"Da Boss"}],"warboss on warbike":[{"k":"wl","a":"Da Boss"}],"ghazghkull thraka":[{"k":"wl","a":"Da Boss"}],"deffkilla wartrike":[{"k":"wl","a":"Da Boss"}],"beastboss":[{"k":"wl","a":"Da Boss"}],"beastboss on squigosaur":[{"k":"wl","a":"Da Boss"}],"nazdreg":[{"k":"wl","a":"Da Boss"}],"ethereal":[{"k":"roll","a":"Coordinated Leadership","x":"At the end of your Command phase, roll one D6: on a 4+, you gain 1CP."}],"tallyman":[{"k":"roll","a":"Sevenfold Chant","x":"In your Command phase, if this model is on the battlefield, roll 2D6: on a 7+, you gain 1CP."}],"captain":[{"k":"wl","a":"Transhuman Strategist"}],"captain with jump pack":[{"k":"wl","a":"Transhuman Strategist"}],"iron father feirros":[{"k":"wl","a":"Transhuman Strategist"}],"captain in terminator armour":[{"k":"wl","a":"Transhuman Strategist"}],"roboute guilliman":[{"k":"wl","a":"Transhuman Strategist"}],"commander dante":[{"k":"wl","a":"Transhuman Strategist"}],"chief librarian mephiston":[{"k":"wl","a":"Transhuman Strategist"}],"azrael":[{"k":"wl","a":"Transhuman Strategist"}],"belial":[{"k":"wl","a":"Transhuman Strategist"}],"asmodai":[{"k":"wl","a":"Transhuman Strategist"}],"logan grimnar":[{"k":"wl","a":"Transhuman Strategist"}],"ragnar blackmane":[{"k":"wl","a":"Transhuman Strategist"}],"captain in gravis armour":[{"k":"wl","a":"Transhuman Strategist"}],"chief librarian tigurius":[{"k":"wl","a":"Transhuman Strategist"}],"adrax agatone":[{"k":"wl","a":"Transhuman Strategist"}],"darnath lysander":[{"k":"wl","a":"Transhuman Strategist"}],"sammael":[{"k":"wl","a":"Transhuman Strategist"}],"lazarus":[{"k":"wl","a":"Transhuman Strategist"}],"tor garadon":[{"k":"wl","a":"Transhuman Strategist"}],"lion el\u2019jonson":[{"k":"wl","a":"Transhuman Strategist"}],"captain in phobos armour":[{"k":"wl","a":"Transhuman Strategist"}],"captain on bike":[{"k":"wl","a":"Transhuman Strategist"}],"kayvaan shrike":[{"k":"wl","a":"Transhuman Strategist"}],"kor\u2019sarro khan":[{"k":"wl","a":"Transhuman Strategist"}],"vulkan he\u2019stan":[{"k":"wl","a":"Transhuman Strategist"}],"high marshal helbrecht":[{"k":"wl","a":"Transhuman Strategist"}],"marshal":[{"k":"wl","a":"Transhuman Strategist"}],"blood angels captain":[{"k":"wl","a":"Transhuman Strategist"}],"watch master":[{"k":"wl","a":"Transhuman Strategist"}],"watch captain artemis":[{"k":"wl","a":"Transhuman Strategist"}],"aethon shaan":[{"k":"wl","a":"Transhuman Strategist"}],"caanok var":[{"k":"wl","a":"Transhuman Strategist"}],"suboden khan":[{"k":"wl","a":"Transhuman Strategist"}],"cato sicarius":[{"k":"wl","a":"Transhuman Strategist"}],"captain titus":[{"k":"wl","a":"Transhuman Strategist"}],"marneus calgar":[{"k":"wl","a":"Transhuman Strategist"}],"the swarmlord":[{"k":"cmd","a":"Hive Commander"}],"trajann valoris":[{"k":"wl","a":"Aquila Commander"}],"shield-captain":[{"k":"wl","a":"Aquila Commander"}],"shield-captain in allarus terminator armour":[{"k":"wl","a":"Aquila Commander"}],"shield-captain on dawneagle jetbike":[{"k":"wl","a":"Aquila Commander"}],"valerian":[{"k":"wl","a":"Aquila Commander"}]};
  const cpOf = (name) => CP_ABIL[String(name || '').toLowerCase()] || [];
  function myWarlord(B) { return (B.units || []).find((u) => u.warlord) || null; }
  // works out what each side gains at this moment, applies it once, and logs it
  function autoCP(B, atRoundStart) {
    B.cpDone = B.cpDone || {};
    const key = B.round + '-' + B.turn; if (B.cpDone[key]) return; B.cpDone[key] = true;
    const gain = { me: [['Core', 1]], foe: [['Core', 1]] };
    const wl = myWarlord(B), wlAlive = wl && alive(wl) > 0;
    const foeWl = foe() && foe().warlord, foeAlive = !B.foeWarlordDead;
    if (atRoundStart) {
      if (wlAlive && cpOf(wl.name).some((e) => e.k === 'wl')) gain.me.push([wl.name + ', ' + cpOf(wl.name).find((e) => e.k === 'wl').a, 1]);
      if (foeWl && foeAlive && cpOf(foeWl).some((e) => e.k === 'wl')) gain.foe.push([foeWl + ', ' + cpOf(foeWl).find((e) => e.k === 'wl').a, 1]);
    }
    if (B.turn === 'me') (B.units || []).filter((u) => alive(u) > 0).forEach((u) => cpOf(u.name).filter((e) => e.k === 'cmd').forEach((e) => gain.me.push([u.name + ', ' + e.a, 1])));
    else if (foeWl && foeAlive) cpOf(foeWl).filter((e) => e.k === 'cmd').forEach((e) => gain.foe.push([foeWl + ', ' + e.a, 1]));
    if (B.link) gain.foe = []; // linked: their phone adds their own
    const sum = (a) => a.reduce((t, x) => t + x[1], 0);
    B.cp.me += sum(gain.me); B.cp.foe += sum(gain.foe);
    B.cpLast = { r: B.round, turn: B.turn, me: gain.me, foe: gain.foe };
    addLog(`CP: you +${sum(gain.me)}, them +${sum(gain.foe)}${gain.me.length + gain.foe.length > 2 ? ' (' + gain.me.concat(gain.foe).filter((x) => x[0] !== 'Core').map((x) => x[0]).join('; ') + ')' : ''}`, 'event');
  }
  function cpRolls(B) {
    const out = [];
    if (B.turn === 'me') (B.units || []).filter((u) => alive(u) > 0).forEach((u) => cpOf(u.name).filter((e) => e.k === 'roll').forEach((e) => out.push(u.name + ': ' + e.a)));
    else if (foe() && foe().warlord && !B.foeWarlordDead) cpOf(foe().warlord).filter((e) => e.k === 'roll').forEach((e) => out.push(foe().warlord + ': ' + e.a));
    return out;
  }
  function nextPhase(dir) {
    const B = S.battle;
    if (dir > 0) {
      if (B.phase < 4) B.phase++;
      else {
        B.phase = 0;
        if (B.turn === S.field.first) { B.turn = B.turn === 'me' ? 'foe' : 'me'; autoCP(B, false); toast('Turn over. CP added for the new Command phase.'); dealUp(B.turn, B.round); }
        else if (B.round >= 5) { B.phase = 4; UI.sheet = { type: 'round', r: 5, recap: true }; return; }
        else { B.phase = 4; UI.sheet = { type: 'round', r: B.round, recap: true }; return; }
      }
    } else {
      if (B.phase > 0) B.phase--;
      else if (!(B.round === 1 && B.turn === S.field.first)) {
        B.phase = 4;
        if (B.turn !== S.field.first) B.turn = S.field.first;
        else { B.round--; B.turn = S.field.first === 'me' ? 'foe' : 'me'; }
      }
    }
  }
  const roman = (n) => ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][n] || n;

  // ---------- world transitions: a surge of light from the world you touch, in that world's character ----------
  function fxInner(kind) {
    const glyph = (n, attrs) => `<svg class="fx-glyph" viewBox="0 0 512 512">${gi(n, attrs || 'fill="currentColor"')}</svg>`;
    if (kind === 'mars') return `<span class="fx-burst"></span><span class="fx-bin">0110 1101 0101 0011 1001 0110</span>${glyph('cog')}${glyph('artificial-intelligence')}`;
    if (kind === 'macragge') return `<span class="fx-burst"></span><span class="fx-ring"></span>${glyph('laurels')}`;
    if (kind === 'prospero') return `<span class="fx-burst"></span>${[0, 1, 2, 3, 4, 5, 6].map((i) => oldPage(i)).join('')}`;
    if (kind === 'webway') return `${[0, 1, 2, 3, 4, 5].map((i) => `<span class="fx-wring" style="animation-delay: ${i * 70}ms"></span>`).join('')}<span class="fx-burst"></span>`;
    if (kind === 'solemnace') {
      const G = '\u25c7\u25c6\u25b3\u25bd\u22ee\u2234\u2235\u2261\u22a5\u22a4\u22a2\u22a3\u2316\u25cb\u25cf\u25a1'; const col = (i) => { let t = ''; for (let k = 0; k < 22; k++) t += G[(i * 7 + k * 5) % G.length]; return `<span class="fx-glyphs" style="left: ${(i * 100 / 16 + 1).toFixed(1)}%; animation-delay: ${((i * 37) % 9) * 30}ms">${t}</span>`; };
      return `<span class="fx-burst"></span>${Array.from({ length: 16 }, (_, i) => col(i)).join('')}<span class="fx-sweep"></span>`;
    }
    if (kind === 'astronomican') return `<span class="fx-beam"></span><span class="fx-burst"></span>`;
    const t = poolItem(S.slots.terra);
    return `<span class="fx-burst"></span>${t ? `<img class="fx-glyph" src="${t.src}" alt="">` : glyph('eagle-emblem')}`;
  }
  // pin each network line to the real centre of each world's orb (labels sit below the orbs, so the button centre is wrong)
  function layoutNet() {
    const sol = document.querySelector('.sol'); const net = sol && sol.querySelector('.net'); if (!net) return;
    const box = sol.getBoundingClientRect(); if (!box.width) return;
    const at = (k) => { const o = sol.querySelector(`.world.${k === 'astro' ? 'astronomican' : k} .orb`); if (!o) return null; const r = o.getBoundingClientRect(); return [((r.left + r.width / 2 - box.left) / box.width * 100).toFixed(2), ((r.top + r.height / 2 - box.top) / box.height * 100).toFixed(2), r.width / 2]; };
    net.querySelectorAll('line').forEach((l) => { const a = at(l.dataset.a), b = at(l.dataset.b); if (!a || !b) return; l.setAttribute('x1', a[0]); l.setAttribute('y1', a[1]); l.setAttribute('x2', b[0]); l.setAttribute('y2', b[1]); });
    launchFleet(net, at);
  }
  window.addEventListener('resize', () => layoutNet());
  // Battle barges plying the lanes between the worlds, drawn from the ship picture in the library (a Gloriana, Invincible Reason, or any file named for a ship)
  let bargeSrc = null, bargeFor = null, bargeBusy = false;
  // the ships plying the lanes follow the army you're playing: the Gloriana for the Imperium, the Nicor for Carcharodons,
  // and each xenos fleet its own vessel. Armies with no vessel yet leave the lanes empty.
  const IMPERIUM = /space marines|templar|blood angels|dark angels|space wolves|ultramarines|deathwatch|grey knights|custodes|sororitas|mechanicus|astra militarum|imperial knights|imperial agents|adeptus astartes/i;
  function fleetKey() {
    if (S.army === 'carcharodons') return 'carcharodons'; if (S.army === 'templars') return 'imperium';
    const L = list(); if (!L) return 'imperium';
    const f = [listFaction(L), L.faction, L.subfaction].filter(Boolean).join(' ');
    if (/carcharod/i.test(f)) return 'carcharodons';
    const x = ['aeldari', 'necrons', 'tyranids', 'drukhari', 'orks'].find((k) => new RegExp(k, 'i').test(f)); if (x) return x;
    return IMPERIUM.test(f) ? 'imperium' : '';
  }
  function bargeItem() {
    const k = fleetKey(); if (!k) return null;
    if (k !== 'imperium') { const it = POOL.find((x) => x.name === 'fleet-' + k); if (it) return it; }
    return POOL.find((x) => !/^(bg|fleet)-/i.test(x.name) && /gloriana|invincible|reason|barge|battleship|vessel|ship/i.test(x.name));
  }
  function makeBarge(it, done) {
    const img = new Image();
    // fleet ships come already cut out and facing the right way
    if (/^fleet-/.test(it.name)) { img.onload = () => done({ src: it.src, ratio: img.naturalHeight / img.naturalWidth }); img.onerror = () => done(null); img.src = it.src; return; }
    img.onload = () => {
      try {
        const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
        const d = g.getImageData(0, 0, c.width, c.height), p = d.data; let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
        const lift = (v) => Math.min(255, Math.round(255 * Math.pow(v / 255, 0.55) * 1.15 + 10));
        for (let i = 0; i < p.length; i += 4) {
          if (!p[i + 3]) continue;
          const r = p[i], gg = p[i + 1], b = p[i + 2], mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
          // white backdrop and the pale fringe left around the hull go; the dark hull is lifted so it reads on the night sky
          if ((r + gg + b) / 3 > 120 && mx - mn < 0.2 * mx) { p[i + 3] = 0; continue; }
          p[i] = lift(r); p[i + 1] = lift(gg); p[i + 2] = lift(b);
          const k = i / 4, x = k % c.width, y = (k - x) / c.width; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
        }
        if (x1 < 0) return done(null);
        g.putImageData(d, 0, 0);
        const W = 128, H = Math.max(1, Math.round((y1 - y0 + 1) * W / (x1 - x0 + 1)));
        const o = document.createElement('canvas'); o.width = W; o.height = H; const og = o.getContext('2d'); og.imageSmoothingQuality = 'high';
        og.drawImage(c, x0, y0, x1 - x0 + 1, y1 - y0 + 1, 0, 0, W, H);
        done({ src: o.toDataURL('image/png'), ratio: H / W });
      } catch (e) { done(null); }
    };
    img.onerror = () => done(null);
    img.src = it.src;
  }
  let flagSrc = '', flagBusy = false;
  const FLAG = () => S.army === 'templars' || S.army === 'fists';
  const FLAGSHIP = () => (S.army === 'fists' ? 'the Phalanx' : 'the Eternal Crusader');
  function prepFlag() {
    if (flagSrc || flagBusy) return; const it = POOL.find((x) => !/^(bg|fleet)-/i.test(x.name) && /gloriana|invincible|reason|barge|battleship|vessel|ship/i.test(x.name)); if (!it) return;
    flagBusy = true; makeBarge(it, (r) => { flagBusy = false; if (r) { flagSrc = r.src; document.querySelectorAll('.flagship img').forEach((im) => { im.src = flagSrc; }); } });
  }
  function launchFleet(net, at) {
    if (FLAG()) { prepFlag(); const fl = document.querySelector('.sol .fleet'); if (fl) fl.innerHTML = ''; return; }
    const fleet = document.querySelector('.sol .fleet'); if (!fleet || reduceMotion) return;
    fleet.innerHTML = '';
    const it = bargeItem(); if (!it || !it.src) return;
    if (bargeFor !== it.id) {
      if (bargeBusy) return; bargeBusy = true;
      makeBarge(it, (r) => { bargeBusy = false; bargeFor = it.id; bargeSrc = r; if (r) layoutNet(); });
      return;
    }
    if (!bargeSrc) return;
    const lines = [...net.querySelectorAll('line')]; const box = document.querySelector('.sol').getBoundingClientRect();
    const px = (k) => { const c = at(k); return c && [c[0] / 100 * box.width, c[1] / 100 * box.height, c[2]]; };
    [[0, false, 0], [4, true, 3], [7, false, 7], [9, true, 11], [2, true, 15]].forEach(([li, back, delay]) => {
      const l = lines[li]; if (!l) return; let a = px(l.dataset.a), b = px(l.dataset.b); if (!a || !b) return; if (back) [a, b] = [b, a];
      const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy); if (len < 60) return;
      const ux = dx / len, uy = dy / len; const s0 = a[2] + 30, s1 = len - b[2] - 30; if (s1 - s0 < 40) return; // depart and arrive clear of the worlds themselves
      const ang = Math.atan2(dy, dx) * 180 / Math.PI; const flip = dx < 0 ? ' scaleY(-1)' : '';
      const pos = (t) => `translate(${(a[0] + ux * t).toFixed(1)}px, ${(a[1] + uy * t).toFixed(1)}px) translate(-50%, -50%) rotate(${ang.toFixed(1)}deg)${flip}`;
      const el = document.createElement('div'); el.className = 'barge'; el.style.height = (67 * bargeSrc.ratio).toFixed(1) + 'px'; el.innerHTML = `<img src="${bargeSrc.src}" alt="">`; fleet.appendChild(el);
      el.animate([{ transform: pos(s0), opacity: 0 }, { opacity: 1, offset: 0.12 }, { opacity: 1, offset: 0.88 }, { transform: pos(s1), opacity: 0 }],
        { duration: Math.max(14000, len * 90), delay: -delay * 1000, iterations: Infinity, easing: 'linear' });
    });
  }
  let fxBusy = false;
  // A leaf from an old tome: foxed, stained, ragged at the edge, written in a hand nobody can read any more
  function oldPage(seed) {
    let r = seed * 9301 + 49297; const rnd = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; };
    const edge = []; for (let k = 0; k <= 12; k++) edge.push(`${(97 + rnd() * 3).toFixed(1)}% ${(k * 100 / 12).toFixed(1)}%`);
    const top = []; for (let k = 11; k >= 1; k--) top.push(`${(k * 100 / 12).toFixed(1)}% ${(rnd() * 1.6).toFixed(1)}%`);
    const bot = []; for (let k = 1; k <= 11; k++) bot.push(`${(k * 100 / 12).toFixed(1)}% ${(98.4 + rnd() * 1.6).toFixed(1)}%`);
    const clip = `polygon(0 0, ${top.reverse().join(', ')}, ${edge.join(', ')}, ${bot.reverse().join(', ')}, 0 100%)`;
    // pseudo-script: each glyph a few hooked strokes in a small cell, words of uneven length, lines that wander slightly
    const strokes = ['M0 0 L0 4', 'M0 0 L2 1', 'M2 0 L0 4', 'M0 2 L2 2', 'M1 0 L1 4 M0 1 L2 1', 'M0 4 Q1 1 2 4', 'M0 0 Q2 2 0 4', 'M2 0 L2 3 Q1 4 0 3', 'M0 1 L1 0 L2 1', 'M0 3 L1 4 L2 3'];
    let ink = ''; let y = 14; const cap = rnd() > 0.45;
    if (cap) ink += `<rect x="10" y="11" width="11" height="13" fill="#6E1E12" opacity="0.75"></rect><path d="M12.5 21.5 L15.5 13 L18.5 21.5 M13.6 18.4 L17.4 18.4" stroke="#D9B45A" stroke-width="0.9" fill="none"></path>`;
    while (y < 124) {
      let x = (cap && y < 26) ? 24 : 10; const end = 89 - rnd() * 6; const tilt = (rnd() - 0.5) * 0.8;
      while (x < end) {
        const len = 2 + Math.floor(rnd() * 6);
        for (let g = 0; g < len && x < end; g++) {
          const n = 1 + Math.floor(rnd() * 3); let d = '';
          for (let k = 0; k < n; k++) d += strokes[Math.floor(rnd() * strokes.length)] + ' ';
          ink += `<path transform="translate(${x.toFixed(1)} ${(y + tilt * (x - 10) / 10).toFixed(1)}) scale(${(0.8 + rnd() * 0.25).toFixed(2)})" d="${d}"></path>`;
          x += 2.6 + rnd() * 0.8;
        }
        x += 2.4;
      }
      y += 6.4 + rnd() * 0.6; if (rnd() > 0.93) y += 5;
    }
    const stains = [0, 1, 2].map(() => `radial-gradient(${(8 + rnd() * 16).toFixed(0)}% ${(6 + rnd() * 14).toFixed(0)}% at ${(rnd() * 100).toFixed(0)}% ${(rnd() * 100).toFixed(0)}%, rgba(110,70,25,${(0.18 + rnd() * 0.2).toFixed(2)}), transparent 70%)`).join(', ');
    return `<span class="fx-page" style="clip-path: ${clip}; background: ${stains}, radial-gradient(120% 90% at 30% 45%, #D9C28C 0%, #C8A866 55%, #8E6B32 100%)"><svg viewBox="0 0 100 135" preserveAspectRatio="none"><g stroke="#3A2210" stroke-width="0.55" fill="none" stroke-linecap="round" opacity="0.78">${ink}</g></svg></span>`;
  }
  function playFx(el, then) {
    const kind = el.dataset.fx;
    if (reduceMotion || !kind) { if (then) then(); return; }
    const r = el.querySelector('.orb') ? el.querySelector('.orb').getBoundingClientRect() : el.getBoundingClientRect();
    const fx = document.createElement('div'); fx.className = 'fx fx-' + kind; fx.setAttribute('aria-hidden', 'true');
    fx.style.setProperty('--x', (r.left + r.width / 2) + 'px'); fx.style.setProperty('--y', (r.top + r.height / 2) + 'px');
    fx.innerHTML = fxInner(kind); document.body.appendChild(fx);
    if (kind === 'solemnace') { document.body.classList.add('stasis'); setTimeout(() => document.body.classList.remove('stasis'), 700); }
    if (then) setTimeout(then, 620);
    setTimeout(() => fx.remove(), 1250);
  }

  // ---------- render: main page ----------
  const NEWS_KEY = 'imperium-tactica-news';
  let NEWS = (() => { try { return JSON.parse(localStorage.getItem(NEWS_KEY)) || null; } catch (e) { return null; } })();
  // the book versions this app's rules were taken from (Wahapedia faction pages, Books table)
  const RULES_BOOKS = { 'space-marines': '2.8.1 October 2026', necrons: '2.8.1 October 2026', aeldari: '1.4 October 2026' };
  const RULES_ASOF = '30 Oct 2026';
  const DATA_STAMP = '2026-10-30 22:19:16'; // Wahapedia's own "last updated" stamp for the data in this app
  // ask Wahapedia (through the Claude desktop app's browser) when its rules data last changed
  async function checkRules() {
    UI.rulesBusy = true; render();
    const done = (o) => { S.rulesCheck = Object.assign({ at: new Date().toISOString() }, o); UI.rulesBusy = false; save(); render(); };
    try {
      const mcp = window.claude && window.claude.use ? await window.claude.use('mcp') : null;
      if (!mcp && !STANDALONE) return done({ error: 'This window cannot use the desktop browser. Open 40k Caddie in the Claude desktop app on your laptop and try again.' });
      // Wahapedia's export stamp is a download the browser pane won't show, so read each faction page's Books table instead:
      // the version and month of each army's rules. When Games Workshop updates a book, those change.
      const books = { 'Space Marines (incl. Templars, Dark Angels, Space Wolves)': ['space-marines', RULES_BOOKS['space-marines']], Necrons: ['necrons', RULES_BOOKS.necrons], Aeldari: ['aeldari', RULES_BOOKS.aeldari] };
      // plus every other army you have set up as an opponent (Space Marine chapters share the Space Marines book)
      Object.values(S.rivals || {}).forEach((R) => { const n = R && R.faction; if (!n || !FACTION_PAGE[n] || /space-marines$/.test(FACTION_PAGE[n]) || n === 'Necrons' || n === 'Aeldari') return; books[n] = [FACTION_PAGE[n].split('/factions/')[1], FACTION_VER[n]]; });
      const seen = {}, changed = [];
      if (!mcp) {
        // the installed app: a weekly job on GitHub reads every Wahapedia faction page and leaves the versions in rules-status.json
        const st = await rulesStatus(true);
        if (!st) return done({ error: 'Could not reach the rules check. Are you online? Try again in a minute.' });
        for (const [label, [slug, known]] of Object.entries(books)) {
          const v = st.factions && st.factions[slug];
          if (!v) return done({ error: 'The weekly check could not read the ' + label + ' page on Wahapedia last time it ran (' + (st.checked || '').slice(0, 10) + '). It tries again each week.' });
          seen[label] = v; if (v !== known) changed.push(label + ': now ' + v + ' (app has ' + known + ')');
        }
        return done({ books: seen, changed, server: st.checked });
      }
      for (const [label, [slug, known]] of Object.entries(books)) {
        const r = await readBook(mcp, 'https://wahapedia.ru/wh40k11ed/factions/' + slug + '/');
        if (!r.ver) return done({ error: 'Wahapedia answered, but its ' + label + ' page had no version in it. What the app saw: ' + r.sample });

        seen[label] = r.ver;
        if (seen[label] !== known) changed.push(label + ': now ' + seen[label] + ' (app has ' + known + ')');
      }
      done({ books: seen, changed });
    } catch (e) {
      const code = e && e.code;
      done({ error: code === 'server_not_connected' ? 'The desktop browser is only reachable from the Claude desktop app on your laptop. Open 40k Caddie there and check again.' : code === 'cancelled' ? 'The check was cancelled.' : /tool|grant|permission|not_found|unknown/i.test(String(code || (e && e.message) || '')) ? 'This button still needs one more browser permission switched on. Until then, ask Claude to "check the 40k Caddie rules" and it will compare everything for you.' : 'The check could not finish (' + (code || 'error') + '). Try again from your laptop.' });
    }
  }
  function renderHome() {
    const a = A(); const L = list();
    const B = S.battle && !S.battle.ended ? S.battle : null;
    const games = HIST.filter((g) => !HIST_DEL.includes(g.id));
    const w = games.filter((g) => g.result === 'Victory').length, l = games.filter((g) => g.result === 'Defeat').length, d = games.filter((g) => g.result === 'Draw').length;
    const top = NEWS && NEWS.items && NEWS.items[0];
    // the Sol system: Terra is the battle, the other worlds are everything else
    const world = (cls, act, x, y, size, name, label, sub, soon, art) => `<button class="world ${cls} ${soon === true ? 'soon' : ''}" data-fx="${cls}" data-act="${act}" data-k="${esc(label)}" style="left: ${x}%; top: ${y}%; --s: ${size}px" aria-label="${esc(name)}: ${esc(label)}${soon === true ? ', coming soon' : soon ? ', ' + esc(soon) : ''}">
        <span class="orb" aria-hidden="true">${art ? `<img class="orb-art" src="${art}" alt="">` : ''}</span><span class="w-name">${esc(name)}</span><span class="w-label">${esc(label)}</span>${sub ? `<span class="w-sub">${esc(sub)}</span>` : ''}${soon ? `<span class="w-soon">${soon === true ? 'Coming' : esc(soon)}</span>` : ''}</button>`;
    return `
    <header class="wrap" style="padding-block: 14px 0; text-align: center; position: relative; z-index: 2">
      <h1 class="h" style="font-size: calc(40px * var(--head-size))">40k Caddie</h1>
    </header>
    <main class="sol" aria-label="Main page">
      ${(() => {
        // the worlds as one network: Terra to every world, plus an outer ring between neighbours
        const P = { terra: [50, 45], solemnace: [80, 21], mars: [86, 50], astro: [18, 22], macragge: [15, 61], prospero: [47, 79], webway: [84, 80], ulthwe: [49, 11], footfall: [14, 41] };
        const E = [['terra', 'footfall'], ['terra', 'solemnace'], ['terra', 'mars'], ['terra', 'astro'], ['terra', 'macragge'], ['terra', 'prospero'], ['terra', 'webway'], ['terra', 'ulthwe'],
          ['astro', 'ulthwe'], ['ulthwe', 'solemnace'], ['solemnace', 'mars'], ['mars', 'webway'], ['webway', 'prospero'], ['prospero', 'macragge'], ['macragge', 'footfall'], ['footfall', 'astro']];
        const line = (e, cls, i) => `<line class="${cls}" x1="${P[e[0]][0]}" y1="${P[e[0]][1]}" x2="${P[e[1]][0]}" y2="${P[e[1]][1]}" data-a="${e[0]}" data-b="${e[1]}" style="animation-delay: ${(-i * 0.7).toFixed(1)}s"></line>`;
        return `<svg class="net" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${E.map((e, i) => line(e, e[0] === 'terra' ? 'spoke' : 'ring', i)).join('')}</svg><div class="fleet" aria-hidden="true"></div>`;
      })()}
      <span class="sun" aria-hidden="true"></span>
      <${FLAG() ? 'div' : 'button'} class="world terra ${FLAG() ? 'static' : ''}" ${FLAG() ? '' : 'data-fx="terra" data-act="terra"'} style="left: 50%; top: 45%; --s: 124px" ${FLAG() ? 'aria-hidden="true"' : `aria-label="${esc(homeWorld().name)}: ${B ? 'resume the battle in progress' : 'battle'}"`}>
        <span class="orb" aria-hidden="true">${homeWorld().img ? `<span class="terra-art home-art"><img src="${homeWorld().img}" alt=""></span>` : `<span class="terra-art">${(() => { const t = poolItem(S.slots.terra); return t ? `<img src="${t.src}" alt="">` : `<svg viewBox="0 0 512 512">${gi('eagle-emblem', 'fill="#E8C766"')}</svg>`; })()}</span>`}</span>
        <span class="w-name">${esc(homeWorld().name)}</span>${FLAG() ? `<span class="w-sub">${B ? 'Board ' + FLAGSHIP() + ' to resume' : 'Board ' + FLAGSHIP() + ' to fight'}</span></div>
      <div class="flag-orbit" aria-hidden="false"><button class="flagship" data-act="terra" aria-label="${FLAGSHIP().replace(/^t/, 'T')}: ${B ? 'resume the battle in progress' : 'battle'}"><img src="${flagSrc || ''}" alt=""></button></div>` : `<span class="w-label">${B ? 'Resume' : 'Battle'}</span>${B ? `<span class="w-sub">Round ${roman(B.round)} vs ${esc(factionInfo(foe().faction).display)} · ${B.vp.me}–${B.vp.foe}</span>` : ''}</button>`}
      ${world('ulthwe', 'updates', 49, 11, 32, 'Ulthwé', 'App updates', '', false, (() => { const it = POOL.find((x) => /ulthwe|craftworld/.test(fileKey(x.name))); return it ? it.src : ''; })())}
      ${world('solemnace', 'hist', 80, 21, 46, 'Solemnace', a.hist, games.length ? `${w} won · ${l} lost${d ? ' · ' + d + ' drawn' : ''}` : 'No battles yet', false)}
      ${world('mars', 'cogitator', 86, 50, 50, 'Mars', 'The Cogitator', '', !UI.cogOK)}
      <a class="world astronomican" data-fx="astronomican" href="https://www.warhammer-community.com/en-gb/" target="_blank" rel="noopener" style="left: 18%; top: 22%; --s: 40px" aria-label="The Astronomican: 40k News, opens Warhammer Community"><span class="orb" aria-hidden="true"></span><span class="w-name">Astronomican</span><span class="w-label">40k News</span></a>
      ${world('macragge', 'rulesInfo', 15, 61, 60, 'Macragge', 'Rules data', RULES_ASOF, false)}
      ${world('prospero', 'gloss', 47, 79, 52, 'Prospero', 'Rules glossary', '', false)}
      ${world('webway', 'webway', 84, 80, 36, 'The Webway', 'Link a device', '', !STANDALONE)}
      ${world('footfall', 'footfall', 14, 41, 44, 'Footfall', 'List builder', '', STANDALONE ? false : 'In the app', (() => { const it = POOL.find((x) => x.name === 'footfall-station'); return it ? it.src : ''; })())}
    </main>
    ${B ? `<div class="wrap"><button class="btn block" data-act="endBattle" style="border-color: var(--accent-text); color: var(--accent-text)">${esc(a.end.toUpperCase())} · ROUND ${roman(B.round)}, ${B.vp.me}–${B.vp.foe}</button></div>` : ''}
    <footer class="wrap stack" style="gap: 6px; padding-block: 0 calc(16px + env(safe-area-inset-bottom, 0px)); align-items: center">
      <div class="row" style="justify-content: center; gap: 18px"><button class="dim" data-act="library" style="border: 0; background: transparent; font-size: 12px; text-decoration: underline; min-height: 32px">Image library</button><button class="dim" data-act="dice" style="border: 0; background: transparent; font-size: 12px; text-decoration: underline; min-height: 32px">Dice odds</button><button class="dim" data-act="moveOpen" style="border: 0; background: transparent; font-size: 12px; text-decoration: underline; min-height: 32px">${STANDALONE ? 'Bring my setup' : 'Move to the app'}</button><button class="dim" data-act="comingSoon" style="border: 0; background: transparent; font-size: 12px; text-decoration: underline; min-height: 32px">Coming soon</button><button class="dim" data-act="about" style="border: 0; background: transparent; font-size: 12px; text-decoration: underline; min-height: 32px">About</button></div>
      ${syncLine()}
    </footer>`;
  }

  // ---------- render: muster ----------
  function renderMuster() {
    const a = A(), L = list(), F = foe(), fi = factionInfo(F.faction);
    const myDisp = S.field.myDisp || (L && L.force_disposition) || '';
    // your own armies, then the last two factions you loaded, then Other for anything new
    const facOn = (f) => S.army === 'other' && S.facKey === f;
    const armyBtns = myArmies().map((k) => `<button class="army-btn ${S.army === k ? 'on' : ''}" data-act="army" data-k="${k}" aria-label="${esc(ARMY[k].label)}" aria-pressed="${S.army === k}" title="${esc(ARMY[k].label)}">${herald(k)}</button>`).join('')
      + (S.facs || []).map((x) => { const pic = POOL.find((it) => nameMatches(fileKey(it.name), x.f)); return `<button class="army-btn ${facOn(x.f) ? 'on' : ''}" data-act="armyFac" data-k="${esc(x.f)}" aria-label="${esc(x.f)}" aria-pressed="${facOn(x.f)}" title="${esc(x.f)}">${pic ? `<img src="${pic.src}" alt="" style="width: 100%; height: 100%; object-fit: contain">` : `<span class="fac-txt">${esc(x.f)}</span>`}</button>`; }).join('')
      + `<button class="army-btn ${S.army === 'other' && !S.facKey ? 'on' : ''}" data-act="army" data-k="other" aria-label="Any other army" aria-pressed="${S.army === 'other' && !S.facKey}" title="Any other army">${herald('other')}</button>`;
    const listCard = L
      ? `<div class="panel row" style="justify-content: space-between; padding: 6px 4px 6px 12px">${otherPic() ? `<img src="${otherPic().src}" alt="" style="flex: 0 0 48px; width: 48px; height: 48px; object-fit: contain">` : ''}<div style="min-width: 0; flex: 1"><div style="font-size: 16px; font-weight: 600">${esc(L.name)}</div><div class="small muted">${L.units.length} units · ${L.points_total.toLocaleString()} pts · ${esc(L.detachments.join(', '))}</div></div><button class="btn small" data-act="overlay" data-k="paste">PASTE NEW</button></div>`
      : `<button class="btn block" data-act="overlay" data-k="paste">Paste your list from the 40k app</button>`;
    const foeLine = [F.detachments.length ? F.detachments.join(', ') : 'Detachment not set', F.warlord ? 'Warlord: ' + F.warlord : ''].filter(Boolean).join(' · ');
    return `
    <header class="band wrap" style="padding-block: 10px 8px; text-align: center">
      <button class="icon-btn" data-act="home" aria-label="Main page" style="position: absolute; left: 4px; top: 8px">${ICON.back}</button>
      <div class="eyebrow">${esc(S.army === 'custodes' ? a.eyebrow + ' · ' + cuHost().toUpperCase() : S.army === 'guard' ? a.eyebrow + ' · ' + amReg()[0].toUpperCase() : a.eyebrow)}</div>
      <h1 class="h" style="font-size: calc(${a.muster.length > 15 ? 30 : 38}px * var(--head-size)); padding-inline: 40px">${esc(a.muster)}</h1>
    </header>
    <main class="main wrap stack">
      <nav class="grid3" aria-label="Setup steps">
        <button class="step-btn on" data-act="noop"><b>${esc(a.steps[0])}</b><span>${esc(a.label === 'Other' ? (L ? L.faction || 'Army' : 'Army') : a.label)}</span></button>
        <button class="step-btn" data-act="overlay" data-k="foe" style="border-color: var(--foe-line)"><b>${esc(a.steps[1])}</b><span class="foe-ink">${esc(fi.display)}</span></button>
        <button class="step-btn" data-act="overlay" data-k="field"><b>${esc(a.steps[2])}</b><span>${primaries() && S.field.deployment ? 'Set' : 'Not set'}</span></button>
      </nav>
      <section class="stack" style="gap: 6px"><div class="eyebrow">${esc(a.fightingAs)}</div><div style="display: grid; gap: 8px; grid-template-columns: repeat(${myArmies().length + (S.facs || []).length + 1}, minmax(0, 1fr))">${armyBtns}</div>
</section>
      ${S.army === 'guard' ? `<section class="stack" style="gap: 6px"><div class="eyebrow">Your regiment</div><div class="row" style="gap: 6px; flex-wrap: wrap">${AM_REGS.map(([n, k]) => `<button class="am-reg ${amReg()[1] === k ? 'on' : ''}" data-act="amReg" data-k="${k}" aria-label="${esc(n)}" aria-pressed="${amReg()[1] === k}" title="${esc(n)}"><img src="lib/pmwam_c_${k}.webp" alt=""></button>`).join('')}</div><p class="small muted" style="margin: 0">${esc(amReg()[0])} · ${esc(amReg()[2])} · "${esc(amReg()[4])}"</p></section>` : ''}${S.army === 'custodes' ? `<section class="stack" style="gap: 6px"><div class="eyebrow">Shield Host</div><div class="row" style="gap: 6px; flex-wrap: wrap">${CU_HOSTS.map((h) => `<button class="chip ${cuHost() === h ? 'on' : ''}" data-act="cuHost" data-k="${esc(h)}">${esc(h)}</button>`).join('')}</div></section>` : ''}${S.army === 'orks' ? `<section class="stack" style="gap: 6px"><div class="eyebrow">Yer klan</div><div class="row" style="gap: 6px; flex-wrap: wrap">${ORK_CLANS.map(([n, k]) => { const it = POOL.find((x) => x.name === 'orks-clan-' + k); return `<button class="ork-clan ${orkClan()[1] === k ? 'on' : ''}" data-act="orkClan" data-k="${k}" aria-label="${esc(n)}" title="${esc(n)}">${it ? `<img src="${it.src}" alt="">` : esc(n)}</button>`; }).join('')}</div><p class="small muted" style="margin: 0">${esc(orkClan()[0])}</p></section>` : ''}${S.army === 'necron' ? `<section class="stack" style="gap: 6px"><div class="eyebrow">Dynasty colours</div><div class="row" style="gap: 8px; flex-wrap: wrap">${NEC_HUES.map(([n, h]) => `<button class="hue-sw ${necHue() === h ? 'on' : ''}" data-act="necHue" data-k="${h}" aria-label="${esc(n)}" title="${esc(n)}" style="background: hsl(${h} 85% 55%)"></button>`).join('')}</div><p class="small muted" style="margin: 0">${esc((NEC_HUES.find((x) => x[1] === necHue()) || ['Custom'])[0])}</p></section>` : ''}<section class="stack" style="gap: 6px"><div class="eyebrow">Your list</div>${listCard}${S.army === 'other' && mainFor(L) && !myArmies().includes(mainFor(L)) ? `<button class="btn block" data-act="makeMain" style="border-color: var(--gold); color: var(--gold)">MAKE ${esc(ARMY[mainFor(L)].label.toUpperCase())} YOUR MAIN ARMY</button><p class="small muted" style="margin: 0">Gives ${esc(ARMY[mainFor(L)].label)} the full treatment on every screen: their own frame, words, battle emblem and button.</p>` : ''}</section>
      <button class="foe-panel row" data-act="overlay" data-k="foe" style="gap: 12px; padding: 10px 12px; text-align: left; color: var(--text); align-items: center">
        <span style="flex: 0 0 64px; width: 64px; height: 64px; display: block">${sigil(F.faction, F)}</span>
        <span class="stack" style="gap: 3px; flex: 1; min-width: 0">
        <span class="row" style="justify-content: space-between"><span class="eyebrow foe-ink">${esc(a.steps[1])}</span><span class="foe-ink small" style="font-weight: 700">CHANGE</span></span>
        <span style="font-size: 18px; font-weight: 700">${esc(fi.display)}${F.name ? ' · ' + esc(F.name) : ''}</span>
        <span class="small">${esc(foeLine)}</span>
        ${F.notes ? `<span class="small" style="font-style: italic; opacity: 0.85">"${esc(F.notes)}"</span>` : ''}
      </span></button>
      <button class="panel row" data-act="overlay" data-k="field" style="gap: 12px; padding: 10px 12px; text-align: left; color: var(--text)">
        ${miniMap()}
        <span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span class="eyebrow">${esc(a.steps[2])}</span>
        <span style="font-size: 16px; font-weight: 600">${primaries() ? 'Your primary: ' + esc(primaries().me) : 'Pick both dispositions'}</span>
        <span class="small muted">${S.field.deployment ? esc(S.field.deployment) + ' · you take the ' + esc(zoneName().toLowerCase()) : 'Deployment not set'} · ${S.field.first === 'me' ? 'you go first' : 'they go first'}</span></span>
      </button>
      ${clashStrip()}
      ${S.battle && !S.battle.ended ? `<button class="btn gold block" data-act="resume">Resume the battle in progress (Round ${roman(S.battle.round)})</button>` : ''}
    </main>
    <footer class="wrap stack" style="gap: 8px; padding-block: 0 calc(16px + env(safe-area-inset-bottom, 0px))">
      <button class="btn block" data-act="overlay" data-k="roll">${ICON.list} ${esc(a.roll.toUpperCase())}</button>
      <button class="btn block" data-act="overlay" data-k="pregame" ${L ? '' : 'disabled'}>PRE-GAME SEQUENCE ${(() => { const d = Object.values(S.field.pre || {}).filter(Boolean).length; return d ? '· ' + d + ' of 12 done' : ''; })()}</button>
      <button class="fight-btn" data-act="fight" ${L ? '' : 'disabled'}>${cryIcon()} ${esc(a.cry)}</button>
      <div class="row" style="justify-content: center; gap: 18px"><button class="dim" data-act="hist" style="border: 0; background: transparent; font-size: 12px; text-decoration: underline; min-height: 32px">${esc(a.hist)}${HIST.length ? ' (' + HIST.length + ')' : ''}</button><button class="dim" data-act="library" style="border: 0; background: transparent; font-size: 12px; text-decoration: underline; min-height: 32px">Image library</button></div>
      ${syncLine()}
      <p class="dim" style="margin: 0; font-size: 11px; text-align: center">Heraldry icons by Lorc, Delapouite and contributors, game-icons.net, CC BY 3.0</p>
    </footer>`;
  }
  function miniMap() {
    return `<span aria-hidden="true" style="flex: 0 0 96px; display: block">${tableMap({ mini: true })}</span>`;
  }
  function clashStrip() {
    const fi = factionInfo(foe().faction);
    let deco = '';
    if (S.army === 'templars') {
      deco = '<svg class="chainrun" aria-hidden="true" style="position: absolute; inset: 0; width: 100%; height: 100%"></svg>';
    } else if (S.army === 'carcharodons') {
      deco = `<span class="maw-dark" style="position: absolute; inset: 0; background: #000"></span>
        <svg class="maw-top" aria-hidden="true" width="230" height="13" style="position: absolute; left: 0; top: 0"><defs><pattern id="fd" width="11" height="13" patternUnits="userSpaceOnUse"><path d="M0 0 L11 0 L5.5 12.5 Z" fill="#E6DDC8" stroke="#14110E" stroke-width="0.9"></path><path d="M3 2.2 L5.5 8 L8 2.2" fill="none" stroke="#14110E" stroke-width="0.8"></path></pattern></defs><rect width="230" height="13" fill="url(#fd)"></rect></svg>
        <svg class="maw-bot" aria-hidden="true" width="230" height="13" style="position: absolute; left: 0; bottom: 0"><defs><pattern id="fu" width="11" height="13" patternUnits="userSpaceOnUse" x="5.5"><path d="M0 13 L11 13 L5.5 0.5 Z" fill="#E6DDC8" stroke="#14110E" stroke-width="0.9"></path><path d="M3 10.8 L5.5 5 L8 10.8" fill="none" stroke="#14110E" stroke-width="0.8"></path></pattern></defs><rect width="230" height="13" fill="url(#fu)"></rect></svg>`;
    }
    return `<div class="clash" aria-label="${esc(A().label)} versus ${esc(fi.display)}">
      <div class="mine" style="${S.army === 'templars' ? 'border-bottom: 3px solid var(--accent)' : ''}">${deco}${otherPic() ? `<img src="${otherPic().src}" alt="" style="position: relative; height: 44px; width: 44px; object-fit: contain; margin-right: 8px">` : ''}<span class="name">${esc(S.army === 'other' ? (list() ? list().subfaction || list().faction || 'You' : 'You') : A().short || A().label)}</span></div>
      <div class="theirs foe-fill"><span class="name foe-font ${fi.display.length > 12 ? 'long' : ''}" style="font-family: var(--foe-font); font-weight: 700">${esc(fi.display)}</span></div>
      <div class="vs"><span>VS</span></div></div>`;
  }

  // Chainsword chain: interlocking links (face-on rings, edge-on links with teeth) carried round the panel edge
  let chainRAF = 0;
  function startChains() {
    cancelAnimationFrame(chainRAF);
    const NS = 'http://www.w3.org/2000/svg';
    const chains = [...document.querySelectorAll('svg.chainrun')].map((svg) => {
      const w = svg.clientWidth, h = svg.clientHeight; if (!w || !h) return null;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      const i = 9;
      const pts = [[i, i], [0.58 * w - 15, i], [0.5 * w - 10, 0.44 * h], [0.55 * w - 13, 0.56 * h], [0.43 * w - 11, h - i], [i, h - i]];
      const seg = []; let L = 0;
      pts.forEach((p, k) => { const q = pts[(k + 1) % pts.length]; const len = Math.hypot(q[0] - p[0], q[1] - p[1]); seg.push({ p, q, len, start: L }); L += len; });
      let n = Math.floor(L / 12); n -= n % 2; const pitch = L / n;
      const at = (d) => { d = ((d % L) + L) % L; const g = seg.find((x) => d >= x.start && d < x.start + x.len) || seg[seg.length - 1]; const f = (d - g.start) / g.len; return [g.p[0] + (g.q[0] - g.p[0]) * f, g.p[1] + (g.q[1] - g.p[1]) * f, Math.atan2(g.q[1] - g.p[1], g.q[0] - g.p[0]) * 180 / Math.PI]; };
      svg.innerHTML = `<defs><linearGradient id="steelV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9ECEF"></stop><stop offset="0.45" stop-color="#9AA1A8"></stop><stop offset="1" stop-color="#3C4146"></stop></linearGradient>
        <g id="lkRing"><rect x="-8.6" y="-5" width="17.2" height="10" rx="5" fill="none" stroke="#111315" stroke-width="4.4"></rect><rect x="-8.6" y="-5" width="17.2" height="10" rx="5" fill="none" stroke="url(#steelV)" stroke-width="2.6"></rect></g>
        <g id="lkBar"><path d="M-4 -1.6 L4 -1.6 L1.5 -7.2 Z" fill="#7C8389" stroke="#111315" stroke-width="0.8" stroke-linejoin="round"></path><rect x="-8.6" y="-1.9" width="17.2" height="3.8" rx="1.9" fill="url(#steelV)" stroke="#111315" stroke-width="0.9"></rect></g></defs>`;
      const bars = document.createElementNS(NS, 'g'), rings = document.createElementNS(NS, 'g');
      svg.appendChild(bars); svg.appendChild(rings);
      const links = [];
      for (let k = 0; k < n; k++) { const u = document.createElementNS(NS, 'use'); u.setAttribute('href', k % 2 ? '#lkBar' : '#lkRing'); (k % 2 ? bars : rings).appendChild(u); links.push(u); }
      return { place(off) { links.forEach((u, k) => { const r = at(k * pitch + off * pitch / 12); u.setAttribute('transform', `translate(${r[0].toFixed(2)} ${r[1].toFixed(2)}) rotate(${r[2].toFixed(1)})`); }); } };
    }).filter(Boolean);
    if (!chains.length) return;
    if (reduceMotion) { chains.forEach((c) => c.place(0)); return; }
    let last = 0, off = 0;
    const step = (t) => { if (last) off = (off + (t - last) * 0.02) % 24; last = t; chains.forEach((c) => c.place(off)); chainRAF = requestAnimationFrame(step); };
    chainRAF = requestAnimationFrame(step);
  }

  // ---------- overlays ----------
  // ---------- pre-game sequence ----------
  const PREG = {"lieutenant with combi-weapon":{"c":["Infiltrators","Lone Operative","Stealth"],"p":[]},"librarian in terminator armour":{"c":["Deep Strike"],"p":[]},"captain with jump pack":{"c":["Deep Strike"],"p":[]},"drop pod":{"c":["Deep Strike"],"p":[]},"chaplain with jump pack":{"c":["Deep Strike"],"p":[]},"storm speeder hammerstrike":{"c":["Deep Strike"],"p":[]},"chaplain in terminator armour":{"c":["Deep Strike"],"p":[]},"terminator assault squad":{"c":["Deep Strike"],"p":[]},"librarian in phobos armour":{"c":["Deep Strike","Infiltrators","Scouts 6\"","Stealth"],"p":[]},"storm speeder hailstrike":{"c":["Deep Strike"],"p":[]},"inceptor squad":{"c":["Deep Strike"],"p":[]},"infiltrator squad":{"c":["Infiltrators"],"p":[]},"captain in terminator armour":{"c":["Deep Strike"],"p":[]},"scout bike squad":{"c":["Scouts 9\""],"p":[]},"vanguard veteran squad with jump packs":{"c":["Deep Strike"],"p":[]},"commander dante":{"c":["Deep Strike"],"p":[]},"chief librarian mephiston":{"c":["Lone Operative"],"p":[]},"the sanguinor":{"c":["Deep Strike","Lone Operative"],"p":[]},"astorath":{"c":["Deep Strike"],"p":[]},"lemartes":{"c":["Deep Strike"],"p":[]},"sanguinary guard":{"c":["Deep Strike"],"p":[]},"belial":{"c":["Deep Strike"],"p":[]},"deathwing terminator squad":{"c":["Deep Strike"],"p":[]},"deathwing knights":{"c":["Deep Strike"],"p":[]},"ravenwing darkshroud":{"c":["Deep Strike","Lone Operative 15\""],"p":[]},"land speeder vengeance":{"c":["Deep Strike"],"p":[]},"logan grimnar":{"c":["Deep Strike"],"p":[]},"grey hunters":{"c":[],"p":["Old Greymanes"]},"arjac rockfist":{"c":["Deep Strike"],"p":[]},"wolf guard terminators":{"c":["Deep Strike"],"p":[]},"corvus blackstar":{"c":["Stealth"],"p":[]},"vanguard veteran squad":{"c":["Scouts 6\""],"p":[]},"invictor tactical warsuit":{"c":["Scouts 8\""],"p":[]},"incursor squad":{"c":["Scouts 6\""],"p":[]},"scout squad":{"c":["Infiltrators","Scouts 6\""],"p":[]},"terminator squad":{"c":["Deep Strike"],"p":[]},"storm speeder thunderstrike":{"c":["Deep Strike"],"p":[]},"eliminator squad":{"c":["Infiltrators","Stealth"],"p":[]},"terrax-pattern termite":{"c":["Deep Strike"],"p":[]},"darnath lysander":{"c":["Deep Strike"],"p":[]},"lieutenant in phobos armour":{"c":["Deep Strike","Infiltrators","Scouts 6\""],"p":[]},"impulsor":{"c":["Firing Deck 7"],"p":[]},"ancient in terminator armour":{"c":["Deep Strike"],"p":[]},"lion el\u2019jonson":{"c":["Deep Strike"],"p":[]},"captain in phobos armour":{"c":["Deep Strike","Infiltrators","Scouts 6\"","Stealth"],"p":[]},"kayvaan shrike":{"c":["Deep Strike","Lone Operative"],"p":[]},"land speeder":{"c":["Deep Strike"],"p":[]},"reiver squad":{"c":["Scouts 6\""],"p":[]},"rhino":{"c":["Firing Deck 2"],"p":[]},"death company marines with jump packs":{"c":["Deep Strike"],"p":[]},"assault intercessors with jump packs":{"c":["Deep Strike"],"p":[]},"spectrus kill team":{"c":["Infiltrators","Scouts 6\""],"p":[]},"emperor\u2019s champion":{"c":["Lone Operative"],"p":[]},"death company captain with jump pack":{"c":["Deep Strike"],"p":[]},"deathwatch terminator squad":{"c":["Deep Strike"],"p":[]},"talonstrike kill team":{"c":["Deep Strike"],"p":[]},"kill team cassius":{"c":["Deep Strike"],"p":[]},"wolf guard headtakers":{"c":[],"p":["Let Loose the Wolves"]},"aethon shaan":{"c":["Deep Strike","Lone Operative","Stealth"],"p":[]},"caanok var":{"c":["Deep Strike"],"p":["Cerebrex Logic Engine"]},"wolf scouts":{"c":["Infiltrators","Scouts 8\""],"p":[]},"wardens of ultramar":{"c":[],"p":["Strategium Command"]},"marneus calgar":{"c":["Deep Strike"],"p":["Thunderhawk Insertion"]}};
  const pregOf = (name) => PREG[String(name || '').toLowerCase()] || { c: [], p: [] };
  function pregameSteps() {
    const L = list(), F = S.field, fo = foe(), fi = factionInfo(fo.faction);
    const units = (L && L.units) || [];
    const withAb = (re) => units.filter((u) => pregOf(u.name).c.some((c) => re.test(c))).map((u) => u.name);
    const uniq = (a) => [...new Set(a)];
    const deep = uniq(withAb(/Deep Strike/)), inf = uniq(withAb(/Infiltrators/)), scouts = uniq(units.filter((u) => pregOf(u.name).c.some((c) => /Scouts/.test(c))).map((u) => u.name + ' (' + pregOf(u.name).c.find((c) => /Scouts/.test(c)) + ')'));
    const transports = uniq(units.filter((u) => /Land Raider|Rhino|Razorback|Impulsor|Repulsor|Drop Pod|Stormraven|Storm Wolf|Corvus/i.test(u.name)).map((u) => u.name));
    const groups = {}; units.forEach((u) => { if (u.attached_group) (groups[u.attached_group] = groups[u.attached_group] || []).push(u.name); });
    const attached = Object.values(groups).filter((g) => g.length > 1).map((g) => g.join(' + '));
    const p = primaries(); const myD = F.myDisp || (L && L.force_disposition) || '';
    const li = (a) => a.length ? '<ul>' + a.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '';
    const vows = L && L.detachments.includes('Vow-sworn Crusaders');
    return [
      { n: 1, title: 'Muster armies', text: 'Each player brings their army roster.', extra: `You: <b>${esc(L ? L.name : 'no list')}</b>${L && L.points_total ? ' · ' + L.points_total + ' pts' : ''}${L ? ' · ' + esc((L.detachments || []).join(', ')) : ''}<br>Them: <b class="foe-ink">${esc(fi.display)}</b>${fo.detachments.length ? ' · ' + esc(fo.detachments.join(', ')) : ''}${fo.warlord ? ' · Warlord ' + esc(fo.warlord) : ''}` },
      { n: 2, title: 'Determine mission', text: 'Each player secretly picks one Force Disposition card their detachments allow, then both reveal. Your Primary Mission is the one listed under your opponent\'s symbol on your card.', extra: `Your options: ${esc(myDispOptions().join(', '))}. Theirs: ${esc(foeDispOptions().join(', ') || 'set their detachment')}.${myD && F.foeDisp ? `<br>Picked: <b>${esc(myD)}</b> vs <b class="foe-ink">${esc(F.foeDisp)}</b>.` : ''}${p ? `<br>Your primary: <b>${esc(p.me)}</b>. Theirs: <b class="foe-ink">${esc(p.foe)}</b>.` : ''} <button class="linkish" data-act="overlay" data-k="field">Set in Hunting Grounds</button>` },
      { n: 3, title: 'Determine deployment', text: 'Shuffle the Deployment cards face-down and draw one. Optional: if both players agree, add one Twist card.', extra: `Deployment: <b>${esc(F.deployment || 'not set')}</b>${F.twist ? ' · Twist: <b>' + esc(F.twist) + '</b>' : ''}.` },
      { n: 4, title: 'Create the battlefield', text: 'The battlefield is 44" by 60". Use a suggested tournament layout, or build your own: roll a D6, on a 6 use two central objectives 6" either side of the centre along the territory line. Roll off, then take turns placing terrain, starting with the winner. Each objective point gets a terrain feature covering it (a terrain objective), then place the rest.', extra: `<button class="linkish" data-act="maps">Show the official deployment card and layouts</button>` },
      { n: 5, title: 'Attacker and Defender', text: 'Agree which table edges match the Attacker and Defender edges on the card. Roll off: the winner decides who is Attacker and who is Defender.', extra: '' },
      { n: 6, title: 'Select Secondary Missions', text: 'Each player secretly notes Tactical or Fixed. Fixed: note your two Fixed cards and display them face-up (they score all game, up to 20VP each). Tactical: shuffle your deck; draw two at the start of each of your Command phases. Once per battle you can pay 1CP at the end of your Command phase to swap one. Then reveal.', extra: `You: <b>${F.secMode === 'fixed' ? 'Fixed' + (F.fixed && F.fixed.filter(Boolean).length ? ' (' + esc(F.fixed.filter(Boolean).join(', ')) + ')' : '') : 'Tactical'}</b>. Them: <b class="foe-ink">${F.foeSecMode === 'fixed' ? 'Fixed' : 'Tactical'}</b>.` },
      { n: 7, title: 'Declare battle formations', text: 'Each player secretly notes, in order: which units start embarked in which Transports, then which units start in Strategic Reserves. Then reveal.', extra: `${attached.length ? '<b>Your attached units</b>' + li(attached) : ''}${transports.length ? '<b>Your transports</b>' + li(transports) : ''}${deep.length ? '<b>Deep Strike options for reserves</b>' + li(deep) : '<span class="muted">None of your units have Deep Strike.</span>'}` },
      { n: 8, title: 'Deploy armies', text: 'Take turns setting up one unit at a time, wholly within your deployment zone, starting with the Defender (reserves excluded). Setting up a TITANIC unit skips your next go. When one player is done, the other sets up the rest.', extra: inf.length ? '<b>Your Infiltrators</b> can set up anywhere more than 8" horizontally from the enemy deployment zone and all enemy units' + li(inf) : '' },
      { n: 9, title: 'Redeploy units', text: 'Rules that redeploy units after both armies are down happen now. Players alternate, starting with the Attacker.', extra: '' },
      { n: 10, title: 'Determine first turn', text: 'Roll off: the winner takes the first turn.', extra: `In the app: <b>${F.first === 'me' ? 'you go first' : 'they go first'}</b>. Change it in Hunting Grounds if the roll says otherwise.` },
      { n: 11, title: 'Resolve pre-battle rules', text: 'Players alternate resolving pre-battle rules, starting with the player taking the first turn. Scouts happen here: a unit wholly in its deployment zone can make its Scouts move (ending more than 8" from all enemy units), or one in Strategic Reserves can instead set up wholly within its deployment zone.', extra: scouts.length ? '<b>Your Scouts</b>' + li(scouts) : '' },
      { n: 12, title: 'Begin the battle', text: 'The first battle round begins. The app adds Command Points automatically from here. Score 10VP each for a Battle Ready (painted) army at the end.', extra: vows ? `<b>Templar Vow</b>: chosen at the start of the first battle round. Current pick: <b>${esc(F.vow || 'none yet')}</b>.` : '' }
    ];
  }
  // ---------- dice maths ----------
  function diceCalc(c) {
    const avgD = (d) => ({ D3: 2, 'D3+1': 3, D6: 3.5, 'D6+1': 4.5, 'D6+2': 5.5, '2D6': 7 }[d] || +d || 1);
    const rr = (p, mode, fail1) => (mode === 'all' ? p + (1 - p) * p : mode === '1' ? p + fail1 * p : p);
    const hitNeed = Math.min(6, Math.max(2, +c.bs - Math.max(-1, Math.min(1, +c.hitM))));
    const S = +c.s, T = +c.t;
    const base = S >= 2 * T ? 2 : S > T ? 3 : S === T ? 4 : 2 * S <= T ? 6 : 5;
    const woundNeed = Math.min(6, Math.max(2, base - Math.max(-1, Math.min(1, +c.woundM))));
    let hits, critHits;
    if (c.torrent) { hits = +c.a; critHits = 0; }
    else {
      const ph = (7 - hitNeed) / 6, pc = 1 / 6;
      const f = (p) => rr(p, c.rrH, 1 / 6);
      hits = +c.a * f(ph); critHits = +c.a * f(pc);
    }
    const sus = critHits * (+c.sus || 0);
    const autoW = c.lethal ? critHits : 0;
    const rolledHits = hits - autoW + sus;
    const pw = rr((7 - woundNeed) / 6, c.rrW, 1 / 6), pcw = rr(1 / 6, c.rrW, 1 / 6);
    const wounds = autoW + rolledHits * pw;
    const devW = c.dev ? rolledHits * pcw : 0;
    const armour = +c.sv + (+c.ap || 0), inv = +c.inv || 0;
    const saveNeed = inv && inv < armour ? inv : armour; const usedInv = !!(inv && inv < armour);
    const fail = saveNeed >= 7 ? 1 : (saveNeed - 1) / 6;
    const unsaved = (wounds - devW) * fail + devW;
    const fnp = +c.fnp ? (+c.fnp - 1) / 6 : 1;
    return { hits: hits + sus, wounds, unsaved, dmg: unsaved * avgD(c.d) * fnp, hitNeed: c.torrent ? 'auto' : hitNeed, woundNeed, saveNeed, usedInv };
  }
  // ---------- Prospero: the glossary ----------
  let glossLoading = false;
  function loadGlossary() {
    if (window.IT_GLOSSARY || glossLoading) return; glossLoading = true;
    const sc = document.createElement('script'); sc.src = 'glossary.js?v=1'; sc.onload = () => { glossLoading = false; render(); }; sc.onerror = () => { glossLoading = false; }; document.head.appendChild(sc);
  }
  function glossaryItems() {
    const G = window.IT_GLOSSARY || { core: [], abilities: [] };
    const out = G.abilities.concat(G.core);
    (D.rulesSM.core || []).forEach((st) => out.push({ t: st.name, c: 'Core stratagems', x: `${st.cp} CP · ${st.turn === 'either' ? "Either player's turn" : st.turn === 'yours' ? 'Your turn' : "Opponent's turn"}\nWHEN: ${st.when}\nTARGET: ${st.target}\nEFFECT: ${st.effect}` }));
    (D.rulesSM.armyRules || []).forEach((r) => out.push({ t: r.name, c: 'Army rules', x: 'Space Marines. ' + r.text }));
    Object.entries(FOES).forEach(([fn, F]) => (F.army_rules || []).forEach((r) => { if (!out.some((y) => y.t === r.name && y.c === 'Army rules')) out.push({ t: r.name, c: 'Army rules', x: fn + '. ' + r.text }); }));
    const order = ['Weapon abilities', 'Unit abilities', 'Core rules', 'Core stratagems', 'Army rules'];
    return out.sort((a, b) => order.indexOf(a.c) - order.indexOf(b.c) || a.t.replace(/[\[\]]/g, '').localeCompare(b.t.replace(/[\[\]]/g, '')));
  }
  function filterGlossary() {
    const q = ((document.getElementById('gl-q') || {}).value || '').trim().toLowerCase(); const cat = UI.glossCat || 'All';
    let shown = 0; const els = [...document.querySelectorAll('#gl-list .gl')];
    els.forEach((el) => { const ok = (cat === 'All' || el.dataset.c === cat) && (!q || el.dataset.s.includes(q)); el.hidden = !ok; if (ok) shown++; el.style.order = q && el.dataset.t.includes(q) ? -1 : 0; if (q && ok && el.dataset.t === q) el.open = true; });
    const none = document.getElementById('gl-none'); if (none) none.hidden = shown > 0;
  }
  function sheet(title, body, foot, foeStyle) {
    return `<div class="scrim" data-act="closeAll"></div><section class="sheet ${foeStyle ? 'foe-sheet' : ''}" role="dialog" aria-label="${esc(title)}">
      <div class="sheet-head"><h2 class="h ${foeStyle ? 'foe-font' : ''}" style="font-size: calc(26px * var(--head-size)); ${foeStyle ? 'font-family: var(--foe-font); font-weight: 700' : ''}">${esc(title)}</h2><span class="row" style="gap: 2px">${S.screen === 'battle' && S.battle && UI.undo.length ? `<button class="btn small" data-act="undo" style="min-height: 36px; gap: 4px; border-color: var(--gold); color: var(--gold)" aria-label="Undo the last change: ${esc(UI.undo[UI.undo.length - 1].label)}">${ICON.undo} UNDO</button>` : ''}<button class="icon-btn" data-act="closeAll" aria-label="Close">${ICON.close}</button></span></div>
      <div class="sheet-body wrap">${body}</div>${foot ? `<div class="sheet-foot wrap">${foot}</div>` : ''}</section>`;
  }
  function renderOverlay() {
    const o = UI.overlay, a = A();
    if (!o) return '';
    if (o === 'paste') {
      const isOther = S.army === 'other'; const li = poolItem(S.slots['list:other']);
      const otherTop = isOther ? `<div class="panel row" style="gap: 12px; padding: 10px 12px; align-items: center"><span style="flex: 0 0 64px; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; border: 1px dashed var(--line2)">${li ? `<img src="${li.src}" alt="" style="width: 100%; height: 100%; object-fit: contain">` : '<span class="small muted">No image</span>'}</span>
        <span class="stack" style="gap: 4px; flex: 1; min-width: 0"><span class="eyebrow">Army image</span><span class="small muted">${li ? 'Change it from Image library at the bottom of the main screen.' : 'Add one from Image library at the bottom of the main screen.'}</span></span></div>
        ${list() ? `<div class="small">Current list: <b>${esc(list().name)}</b> · ${list().units.length} units. Paste below only to replace it.</div>` : ''}` : '';
      return sheet(isOther ? 'Your army' : 'Paste your list', `${otherTop}<p class="muted" style="margin: 0">Paste your list as text from any app (Warhammer 40,000, Warmind, New Recruit, Listforge, BattleScribe) or type it: one unit per line with its points.</p>
        <label class="field"><span class="eyebrow">List text</span><textarea id="paste-text" rows="10" placeholder="Paste the full export, including the line with Detachment Points"></textarea></label>
        <div id="paste-err" class="small" style="color: var(--accent-text)"></div>`,
        isOther && list() ? `<div class="grid2"><button class="btn" data-act="closeAll">KEEP CURRENT</button><button class="btn solid" data-act="parse">LOAD NEW LIST</button></div>` : `<button class="btn solid block" data-act="parse">LOAD THIS LIST</button>`);
    }
    if (o === 'rules') {
      const c = S.rulesCheck || {};
      const fmt = (d) => { try { return new Date(d).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }); } catch (e) { return d; } };
      const verdict = UI.rulesBusy ? '<div class="panel small" style="padding: 10px 12px">Checking Wahapedia…</div>'
        : c.error ? `<div class="panel small" style="padding: 10px 12px; border-color: var(--accent-text)">${esc(c.error)}</div>`
        : c.books ? (c.changed.length ? `<div class="panel small" style="padding: 10px 12px; border-color: var(--gold)"><b style="color: var(--gold)">Updates available.</b> ${c.changed.map(esc).join('<br>')}<br>Tell Claude "refresh the 40k Caddie rules" to bring them in.<br><span class="muted">Checked ${esc(fmt(c.at))}</span></div>` : `<div class="panel small" style="padding: 10px 12px"><b>Up to date.</b> Every army's rules match Wahapedia: ${Object.entries(c.books).map(([k, v]) => esc(k.split(' (')[0]) + ' ' + esc(v)).join(', ')}.<br><span class="muted">Checked ${esc(fmt(c.at))}</span></div>`)
        : c.remote ? (c.remote > DATA_STAMP ? `<div class="panel small" style="padding: 10px 12px; border-color: var(--gold)"><b style="color: var(--gold)">Updates available.</b> Wahapedia changed on ${esc(c.remote.slice(0, 10))}, after this app's data. Tell Claude "refresh the 40k Caddie rules" to bring them in.<br><span class="muted">Checked ${esc(fmt(c.at))}</span></div>`
          : `<div class="panel small" style="padding: 10px 12px"><b>Up to date.</b> Wahapedia hasn't changed since this app's data.<br><span class="muted">Checked ${esc(fmt(c.at))}</span></div>`) : '';
      return sheet('Macragge · Rules data', `
        <div class="panel stack" style="padding: 10px 12px; gap: 4px"><span class="eyebrow">Opponents' armies and the missions</span><span>Wahapedia 11th edition data, as of <b>${RULES_ASOF}</b>: Necrons, Dark Angels, Space Wolves and Aeldari (army rules, detachments, stratagems, datasheets), plus the 2026-27 Mission Deck.</span></div>
        <div class="panel stack" style="padding: 10px 12px; gap: 4px"><span class="eyebrow">Your armies</span><span>The full Space Marine codex with every chapter supplement, Black Templars included: ${D.rulesSM.detachments.length} detachments, ${D.rulesSM.stratagems.length} detachment stratagems, ${D.rulesSM.enhancements.length} enhancements and the ${D.rulesSM.core.length} core stratagems. Same Wahapedia export, as of <b>${RULES_ASOF}</b>.</span></div>
        ${verdict}
        <button class="btn solid block" data-act="rulesCheck" ${UI.rulesBusy ? 'disabled' : ''}>CHECK FOR UPDATES</button>
        <p class="small muted" style="margin: 0">${STANDALONE ? 'A job on GitHub reads every army\'s book version on Wahapedia each week; this shows what it found' + (c.server ? ' (last run ' + esc(fmt(c.server)) + ')' : '') + '.' : 'The check reads Wahapedia\'s book versions through the browser in the Claude desktop app, so run it from your laptop. It uses no Claude tokens.'}</p>`,
        `<button class="btn block" data-act="closeAll">DONE</button>`);
    }
    if (o === 'move') {
      const msg = UI.moveMsg ? `<div class="panel small" style="padding: 10px 12px; border-color: ${UI.moveErr ? 'var(--accent-text)' : 'var(--gold)'}">${esc(UI.moveMsg)}</div>` : '';
      if (!STANDALONE) return sheet('Move to the app', `<p class="small muted" style="margin: 0">Copies your armies, opponents, image placements, battle history and field setup, so the installed app starts exactly where this one is.</p>
        <ol class="small" style="margin: 0; padding-left: 18px; line-height: 1.5"><li>Tap <b>COPY MY SETUP</b>.</li><li>Open the installed 40k Caddie and tap <b>Bring my setup</b> at the bottom of the main screen.</li><li>Paste and tap <b>LOAD</b>.</li></ol>
        ${UI.moveCode ? `<label class="field"><span class="eyebrow">Your setup (already copied if your phone allowed it)</span><textarea id="move-code" rows="4" readonly>${esc(UI.moveCode)}</textarea></label>` : ''}${msg}`,
        `<button class="btn solid block" data-act="moveCopy">COPY MY SETUP</button>`);
      return sheet('Bring my setup', `<p class="small muted" style="margin: 0">In the Claude version of 40k Caddie, tap <b>Move to the app</b> at the bottom of the main screen, then <b>COPY MY SETUP</b>. Paste it here. It replaces what is in this app now.</p>
        <label class="field"><span class="eyebrow">Paste here</span><textarea id="move-code" rows="5" placeholder="CADDIE1:..."></textarea></label>${msg}`,
        `<button class="btn solid block" data-act="moveLoad">LOAD</button>`);
    }
    if (o === 'webway') {
      const B = S.battle && !S.battle.ended ? S.battle : null;
      const err = LIVE.err ? `<div class="panel small" style="padding: 10px 12px; border-color: var(--accent-text)">${esc(LIVE.err)}</div>` : '';
      if (!B) return sheet('The Webway', `<p style="margin: 0">Link your opponent's phone to this battle, so you each run your own side and see the other's live.</p>
        <p class="small muted" style="margin: 0">Start the battle first (Terra), then open the Webway from the WEBWAY button at the top of the battle screen. Joining someone else's battle? Use <b>Join a battle</b>.</p>`,
        `<div class="grid2"><button class="btn" data-act="closeAll">CLOSE</button><button class="btn solid" data-act="wwJoinOpen">JOIN A BATTLE</button></div>`);
      if (!LIVE.on) return sheet('The Webway', `<p style="margin: 0">Link your opponent's phone to this battle. You each run your own side (CP, VP, secondaries, units) and see the other's live. Whoever's turn it is moves the game on.</p>
        <p class="small muted" style="margin: 0">They don't need the app: they scan a QR code and paste their list in their browser. If they have the app, they type a 6 letter code.</p>${err}`,
        `<button class="btn solid block" data-act="wwOpen" ${UI.liveBusy ? 'disabled' : ''}>${UI.liveBusy ? 'OPENING…' : 'OPEN THE WEBWAY'}</button>`);
      const link = liveLink(LIVE.id);
      let qr = ''; try { if (window.qrcode) { const q = window.qrcode(0, 'M'); q.addData(link); q.make(); qr = q.createSvgTag({ cellSize: 5, margin: 3, scalable: true }); } } catch (e) { qr = ''; }
      const who = LIVE.other ? `<div class="panel small" style="padding: 10px 12px; border-color: var(--gold)"><b style="color: var(--gold)">Linked</b> with ${esc(LIVE.other.name || 'your opponent')}${LIVE.other.faction ? ' (' + esc(LIVE.other.faction) + ')' : ''}.</div>` : `<div class="panel small" style="padding: 10px 12px">Waiting for your opponent to join…</div>`;
      return sheet('The Webway', `${who}${err}
        ${LIVE.role === 'host' ? `<div class="stack" style="align-items: center; gap: 8px">${qr ? `<div class="ww-qr" aria-label="QR code to join">${qr}</div>` : ''}
          <div class="ww-code" aria-label="Join code">${esc(LIVE.id)}</div>
          <p class="small muted" style="margin: 0; text-align: center">No app: scan the code with the phone camera. With the app: Webway, then Join a battle, then type the code.</p>
          <button class="btn small" data-act="wwShare">SHARE THE LINK</button></div>` : `<p class="small muted" style="margin: 0">Battle code ${esc(LIVE.id)}.</p>`}`,
        `<div class="grid2"><button class="btn" data-act="wwClose">UNLINK</button><button class="btn solid" data-act="closeAll">DONE</button></div>`);
    }
    if (o === 'wwjoin') {
      const err = LIVE.err ? `<div class="panel small" style="padding: 10px 12px; border-color: var(--accent-text)">${esc(LIVE.err)}</div>` : '';
      // someone joining from a link in their browser always brings their own list (this phone's saved armies are not theirs)
      const L = UI.wwNeedList && !(S.army === 'other' && list() && UI.wwPasted) ? null : list();
      return sheet('Join a battle', `<label class="field"><span class="eyebrow">Battle code</span><input id="ww-code" autocapitalize="characters" autocomplete="off" maxlength="7" value="${esc(UI.wwCode || '')}" placeholder="ABC123" style="font-size: 22px; letter-spacing: 0.2em; text-transform: uppercase"></label>
        ${L ? `<p class="small" style="margin: 0">You'll play <b>${esc(L.name)}</b>${L.faction ? ' (' + esc(L.faction) + ')' : ''}. <button class="linkish" data-act="wwNewList">Use a different list</button></p>`
          : `<p class="small muted" style="margin: 0">Paste your list as text from any app (Warhammer 40,000, Warmind, New Recruit, Listforge, BattleScribe) or type it: one unit per line with its points.</p>
        <label class="field"><span class="eyebrow">Your army list</span><textarea id="paste-text" rows="7" placeholder="Paste the full export"></textarea></label><div id="paste-err" class="small" style="color: var(--accent-text)"></div>`}${err}`,
        `<button class="btn solid block" data-act="wwJoin" ${UI.liveBusy ? 'disabled' : ''}>${UI.liveBusy ? 'JOINING…' : 'JOIN THE BATTLE'}</button>`);
    }
    if (o === 'cog') {
      const items = (UI.cog || []).map((x) => `<div class="cog-q">${esc(x.q)}</div><div class="cog-a ${x.err ? 'err' : ''}">${x.a ? cogFmt(x.a) : '<span class="muted">Consulting the archives…</span>'}</div>`).join('');
      const B = S.battle && !S.battle.ended;
      return sheet('The Cogitator', `${items || (S.screen === 'footfall' ? `<p class="small muted" style="margin: 0">Ask about your list: what an enhancement or detachment does, which wargear suits a unit, why something is not legal, or what to add with the points left.</p>` : `<p class="small muted" style="margin: 0">Ask about the battle in front of you. It knows ${B ? 'the round, phase, CP, both armies\' units and' : 'your army and'} every stratagem and datasheet in the app. For example: <i>"Their Wraiths are about to charge my Crusaders. What helps?"</i></p>`)}
        <label class="field"><span class="eyebrow">Your question</span><textarea id="cog-q" rows="3" placeholder="Their Wraiths are charging my Crusaders. What stratagem helps?"></textarea></label>
        <p class="small muted" style="margin: 0">${UI.cogLeft === null || UI.cogLeft === undefined ? 'No daily limit on your account.' : UI.cogLeft + ' questions left in the last 24 hours.'}</p>`,
        `<div class="grid2"><button class="btn" data-act="closeAll">CLOSE</button><button class="btn solid" data-act="cogAsk" ${UI.cogBusy ? 'disabled' : ''}>${UI.cogBusy ? 'THINKING…' : 'ASK'}</button></div>`);
    }
    if (o === 'updates') {
      return sheet('Ulthwé · App updates', UPDATES.map((u) => `<section class="panel stack" style="padding: 10px 12px; gap: 6px"><span class="eyebrow">${esc(u.d)}</span><ul class="small" style="margin: 0; padding-left: 18px; line-height: 1.5">${u.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section>`).join(''),
        '<button class="btn solid block" data-act="closeAll">DONE</button>');
    }
    if (o === 'account') {
      const signed = SYNC.on && SYNC.email;
      const msg = UI.accMsg ? `<div class="panel small" style="padding: 10px 12px; border-color: ${UI.accErr ? 'var(--accent-text)' : 'var(--gold)'}">${esc(UI.accMsg)}</div>` : '';
      if (signed) return sheet('Your account', `<p style="margin: 0">Signed in as <b>${esc(SYNC.email)}</b>.</p>
        <p class="small muted" style="margin: 0">Your armies, images, setup and battle history are saved to this account. Sign in with the same email on any other phone or computer and it all follows you.</p>${msg}`,
        `<div class="grid2"><button class="btn" data-act="accOut">SIGN OUT</button><button class="btn solid" data-act="closeAll">DONE</button></div>`);
      return sheet('Sign in to sync', `<p class="small muted" style="margin: 0">Everything already saves on this phone. Sign in to keep it in your account too, so it follows you to other devices. You'll go to Google and come straight back.</p>${msg}`,
        `<button class="btn solid block" data-act="accGoogle" ${UI.accBusy ? 'disabled' : ''}>SIGN IN WITH GOOGLE</button>`);
    }
    if (o === 'news') {
      const items = (NEWS && NEWS.items) || [];
      const fmt = (d) => { try { return new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }); } catch (e) { return ''; } };
      return sheet('40k News', `${items.length ? items.map((n) => `<a class="strat" href="${esc(n.url)}" target="_blank" rel="noopener" style="text-decoration: none"><span style="min-width: 0"><span class="nm">${esc(n.title)}</span><br><span class="ds">${esc(n.date ? fmt(n.date) + ' · ' : '')}${esc(n.summary || '')}</span></span>${ICON.next}</a>`).join('') : '<div class="panel small muted" style="padding: 12px">No headlines loaded yet.</div>'}
        <p class="small muted" style="margin: 0">From Warhammer Community${NEWS && NEWS.updated ? ', updated ' + esc(fmt(NEWS.updated)) : ''}. Tap a headline to read it there.</p>`,
        `<button class="btn solid block" data-act="closeAll">DONE</button>`);
    }
    if (o === 'pregame') {
      const steps = pregameSteps(); const done = S.field.pre || {};
      const n = steps.filter((x) => done[x.n]).length;
      return sheet('Pre-game sequence', `<p class="small muted" style="margin: 0">The Chapter Approved battle sequence, in order, with what applies to your army. Tick each step as you go. ${n} of ${steps.length} done.</p>
        ${steps.map((x) => `<section class="panel stack pre-step ${done[x.n] ? 'done' : ''}" style="padding: 10px 12px; gap: 6px">
          <button class="row pre-head" data-act="preTick" data-k="${x.n}" aria-pressed="${!!done[x.n]}"><span class="pre-n">${done[x.n] ? '\u2713' : x.n}</span><b>${esc(x.title)}</b></button>
          <div class="small" style="line-height: 1.45">${x.text}</div>${x.extra ? `<div class="pre-extra small">${x.extra}</div>` : ''}</section>`).join('')}
        <button class="btn small" data-act="preReset" style="align-self: flex-start">CLEAR TICKS</button>`, `<button class="fight-btn" data-act="fight">${cryIcon()} ${esc(a.cry)}</button>`);
    }
    if (o === 'maps') {
      return sheet('The field', `${S.battle ? tableMap({ mode: 'side' }) : ''}${officialMaps(S.field, 'battle')}`, '<button class="btn solid block" data-act="closeAll">DONE</button>');
    }
    if (o === 'dice') {
      const pc = (x) => Math.round(x * 100) + '%';
      const need = [2, 3, 4, 5, 6];
      const p = (n) => (7 - n) / 6;
      const oddsRows = need.map((n) => `<tr><td><b>${n}+</b></td><td>${pc(p(n))}</td><td>${pc(p(n) + p(n) / 6)}</td><td>${pc(p(n) + (1 - p(n)) * p(n))}</td></tr>`).join('');
      const two = [];
      for (let t = 2; t <= 12; t++) { let c = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b >= t) c++; two.push(`<tr><td><b>${t}+</b></td><td>${pc(c / 36)}</td></tr>`); }
      const c = UI.calc || (UI.calc = { a: 10, bs: 3, s: 4, ap: 0, d: '1', t: 4, sv: 3, inv: 0, fnp: 0, lethal: false, sus: 0, dev: false, rrH: '', rrW: '', torrent: false, hitM: 0, woundM: 0 });
      const num = (k, label, min, max) => `<label class="calc-f"><span>${label}</span><input type="number" inputmode="numeric" id="calc-${k}" value="${esc(c[k])}" min="${min}" max="${max}"></label>`;
      const sel = (k, label, opts) => `<label class="calc-f"><span>${label}</span><select id="calc-${k}">${opts.map((o) => `<option value="${o[0]}" ${String(c[k]) === String(o[0]) ? 'selected' : ''}>${o[1]}</option>`).join('')}</select></label>`;
      const tog = (k, label) => `<button class="chip ${c[k] ? 'on' : ''}" data-act="calcTog" data-k="${k}" style="min-height: 34px">${label}</button>`;
      const r = diceCalc(c);
      return sheet('Dice odds', `
        <section class="panel stack" style="padding: 10px 12px; gap: 8px"><div class="eyebrow">Quick calculator · average result</div>
          <div class="calc-grid">${num('a', 'Attacks', 1, 200)}${sel('bs', 'BS / WS', [[2, '2+'], [3, '3+'], [4, '4+'], [5, '5+'], [6, '6+']])}${num('s', 'Strength', 1, 30)}${sel('ap', 'AP', [[0, '0'], [1, '-1'], [2, '-2'], [3, '-3'], [4, '-4'], [5, '-5']])}${sel('d', 'Damage', [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['D3', 'D3'], ['D3+1', 'D3+1'], ['D6', 'D6'], ['D6+1', 'D6+1'], ['D6+2', 'D6+2'], ['2D6', '2D6']])}
          ${num('t', 'Target T', 1, 30)}${sel('sv', 'Target Sv', [[2, '2+'], [3, '3+'], [4, '4+'], [5, '5+'], [6, '6+'], [7, 'none']])}${sel('inv', 'Invuln', [[0, 'none'], [2, '2+'], [3, '3+'], [4, '4+'], [5, '5+'], [6, '6+']])}${sel('fnp', 'Feel No Pain', [[0, 'none'], [4, '4+'], [5, '5+'], [6, '6+']])}
          ${sel('rrH', 'Re-roll hits', [['', 'no'], ['1', 'ones'], ['all', 'all fails']])}${sel('rrW', 'Re-roll wounds', [['', 'no'], ['1', 'ones'], ['all', 'all fails']])}${sel('sus', 'Sustained Hits', [[0, 'no'], [1, '1'], [2, '2'], [3, '3']])}${sel('hitM', 'Hit modifier', [[1, '+1'], [0, '0'], [-1, '-1']])}${sel('woundM', 'Wound modifier', [[1, '+1'], [0, '0'], [-1, '-1']])}</div>
          <div class="row" style="gap: 6px; flex-wrap: wrap">${tog('lethal', 'Lethal Hits')}${tog('dev', 'Devastating Wounds')}${tog('torrent', 'Torrent')}</div>
          <div class="calc-out tnum"><div><b>${r.hits.toFixed(1)}</b><span>hits</span></div><div><b>${r.wounds.toFixed(1)}</b><span>wounds</span></div><div><b>${r.unsaved.toFixed(1)}</b><span>through saves</span></div><div class="big"><b>${r.dmg.toFixed(1)}</b><span>damage</span></div></div>
          <p class="small muted" style="margin: 0">Needs ${r.hitNeed}+ to hit, ${r.woundNeed}+ to wound, ${r.saveNeed <= 6 ? r.saveNeed + '+ to save' + (r.usedInv ? ' (invuln)' : '') : 'no save'}. Averages only: a single roll can land far either side.</p></section>
        <section class="panel stack" style="padding: 10px 12px; gap: 6px"><div class="eyebrow">To wound</div>
          <table class="dt"><tr><td>S is double T or more</td><td><b>2+</b></td></tr><tr><td>S is greater than T</td><td><b>3+</b></td></tr><tr><td>S equals T</td><td><b>4+</b></td></tr><tr><td>S is less than T</td><td><b>5+</b></td></tr><tr><td>S is half T or less</td><td><b>6+</b></td></tr></table>
          <p class="small muted" style="margin: 0">An unmodified 1 always fails and an unmodified 6 is always a critical (hits and wounds). Hit and wound modifiers cap at +1 or -1.</p></section>
        <section class="panel stack" style="padding: 10px 12px; gap: 6px"><div class="eyebrow">One D6: chance to pass</div>
          <table class="dt"><tr><th>Need</th><th>Plain</th><th>Re-roll 1s</th><th>Re-roll fails</th></tr>${oddsRows}</table></section>
        <section class="panel stack" style="padding: 10px 12px; gap: 6px"><div class="eyebrow">Saves</div>
          <p class="small" style="margin: 0">Armour save needed = Sv plus the AP (3+ against AP -2 needs 5+). Use the invulnerable save instead if it's better: AP never changes it. A needed roll of 7+ means no save.</p></section>
        <section class="panel stack" style="padding: 10px 12px; gap: 6px"><div class="eyebrow">2D6: charges, Leadership, Battle-shock</div>
          <table class="dt two">${two.join('')}</table>
          <p class="small muted" style="margin: 0">Charge: the 2D6 roll is your maximum charge distance. Leadership and Battle-shock: pass on 2D6 equal to or over the unit's Ld (Ld 6+ passes 72% of the time).</p></section>
        <section class="panel stack" style="padding: 10px 12px; gap: 6px"><div class="eyebrow">Averages</div>
          <p class="small" style="margin: 0">D3 = 2 · D6 = 3.5 · D6+1 = 4.5 · 2D6 = 7 · D3 is a D6 halved, rounding up.</p></section>`, '<button class="btn solid block" data-act="closeAll">DONE</button>');
    }
    if (o === 'glossary') {
      const G = window.IT_GLOSSARY;
      if (!G) { loadGlossary(); return sheet('Prospero · Rules glossary', '<div class="panel small" style="padding: 10px 12px">Opening the archive…</div>', '<button class="btn solid block" data-act="closeAll">DONE</button>'); }
      const items = glossaryItems();
      const cats = ['All'].concat([...new Set(items.map((x) => x.c))]);
      const cat = UI.glossCat || 'All';
      setTimeout(filterGlossary, 0);
      const list = items.map((x, i) => `<details class="gl" data-c="${esc(x.c)}" data-s="${esc((x.t + ' ' + x.x).toLowerCase())}" data-t="${esc(x.t.toLowerCase())}" ${cat !== 'All' && x.c !== cat ? 'hidden' : ''}><summary><b>${esc(x.t)}</b><span class="small muted">${esc(x.c)}</span></summary><div class="gl-x">${esc(x.x).replace(/\n/g, '<br>')}</div></details>`).join('');
      return sheet('Prospero · Rules glossary', `<input id="gl-q" type="search" value="${esc(UI.glossQ || '')}" placeholder="Search a rule, ability or word…" autocomplete="off" style="width: 100%; min-height: 44px; padding: 0 12px; background: var(--panel); border: 1px solid var(--line2); color: var(--text); font-size: 16px">
        <div class="row" style="gap: 6px; flex-wrap: wrap">${cats.map((c) => `<button class="chip ${c === cat ? 'on' : ''}" data-act="glossCat" data-k="${esc(c)}" style="min-height: 34px">${esc(c)}</button>`).join('')}</div>
        <p id="gl-none" class="small muted" style="margin: 0" hidden>Nothing matches that.</p>
        <div id="gl-list" style="display: flex; flex-direction: column; gap: 4px">${list}</div>
        <p class="small muted" style="margin: 0">Official wording from the Wahapedia 11th edition core rules and army rules, as of ${RULES_ASOF}. Opponents' army rules appear once their army has been picked.</p>`, '<button class="btn solid block" data-act="closeAll">DONE</button>');
    }
    if (o === 'coming') {
      // which armies have their full look so far; everything else works fully, with the standard look
      const DONE_MAIN = ['Black Templars', 'Vlka Fenryka (Space Wolves)', 'Dark Angels', 'The Infinite Empire (Necrons)', 'Asuryani (Aeldari)', 'Deathwatch', 'Imperial Fists', 'Orks (with all seven klans)', 'Adeptus Custodes (with the six Shield Hosts)', 'Astra Militarum (with eight regiments)'];
      const DONE_FOE = ['Space Wolves', 'Dark Angels', 'Necrons', 'Aeldari', 'Deathwatch', 'Imperial Fists', 'Orks', 'Adeptus Custodes', 'Astra Militarum'];
      const done = new Set(['Black Templars', 'Space Wolves', 'Dark Angels', 'Necrons', 'Aeldari', 'Deathwatch', 'Imperial Fists', 'Orks', 'Adeptus Custodes', 'Space Marines (other chapter)', 'Alpha Legion', 'Astra Militarum']);
      // the rest, most played first (11th edition games, from the weekly meta numbers), so they get their look in that order
      ffMetaLoad();
      const GAMES = { Tyranids: 14375, "T'au Empire": 12428, 'Chaos Space Marines': 11376, 'World Eaters': 11067, "Emperor's Children": 10869, 'Death Guard': 10700, 'Imperial Knights': 10119, 'Chaos Daemons': 9717, 'Leagues of Votann': 8977, 'Astra Militarum': 8718, 'Thousand Sons': 8439, 'Blood Angels': 7337, 'Chaos Knights': 6405, 'Grey Knights': 6390, 'Adepta Sororitas': 6110, 'Adeptus Mechanicus': 6049, Drukhari: 5917, 'Black Templars': 3830, 'Genestealer Cults': 3734, 'Imperial Agents': 893 };
      const META_NAME = { 'Genestealer Cults': 'Genestealer Cult' };
      const games = (n) => { const f = FFMETA && FFMETA.factions && FFMETA.factions[META_NAME[n] || n]; return f && f.games ? f.games : GAMES[n] || 0; };
      const todo = FACTIONS.map((f) => f[0]).filter((n) => !done.has(n)).concat(['Black Templars as an opponent'])
        .map((n) => ({ n, g: games(n.replace(' as an opponent', '')) })).sort((a, b) => b.g - a.g);
      const li = (l) => l.map((n) => `<li>${esc(n)}</li>`).join('');
      const liG = (l) => l.map((x) => `<li>${esc(x.n)}${x.g ? ` <span class="muted">· ${x.g.toLocaleString()} games</span>` : ' <span class="muted">· counted with Space Marines</span>'}</li>`).join('');
      return sheet('Coming soon', `<p style="margin: 0">Every army works fully in the app: lists, battles, rules, the Cogitator and Footfall. Some armies also have their own look: frames, words, battle screen, colours and art. The rest use the standard look for now, and all of them will get theirs.</p>
        <div class="stack" style="gap: 4px"><span class="eyebrow">Full look as your main army</span><ul class="small" style="margin: 0; padding-left: 18px">${li(DONE_MAIN)}</ul></div>
        <div class="stack" style="gap: 4px"><span class="eyebrow">Full look as an opponent</span><ul class="small" style="margin: 0; padding-left: 18px">${li(DONE_FOE)}</ul></div>
        <div class="stack" style="gap: 4px"><span class="eyebrow">Standard look for now, theirs on the way · most played first</span><ul class="small" style="margin: 0; padding-left: 18px">${liG(todo)}</ul></div>
        <p class="small muted" style="margin: 0">Order by games played in 11th edition, from the weekly 40k-analytics numbers.</p>`,
        `<button class="btn solid block" data-act="closeAll">DONE</button>`);
    }
    if (o === 'about') {
      return sheet('About 40k Caddie', `
        <p style="margin: 0">A free, unofficial, fan-made battle companion for Warhammer 40,000. Not for sale, and not affiliated with or endorsed by Games Workshop.</p>
        <p class="small" style="margin: 0">Warhammer 40,000 and all associated names, factions and marks belong to Games Workshop Limited.</p>
        <div class="small stack" style="gap: 4px"><span class="eyebrow">Data and art</span>
          <span>Rules data: powered by <a href="https://wahapedia.ru" target="_blank" rel="noopener" style="color: var(--gold)">Wahapedia</a> (data export) and the <a href="https://github.com/BSData/wh40k-11e" target="_blank" rel="noopener" style="color: var(--gold)">BSData</a> community project. Both are volunteer-run, so they can lag behind new releases.</span>
          <span>Heraldry icons: Lorc, Delapouite and contributors, <a href="https://game-icons.net" target="_blank" rel="noopener" style="color: var(--gold)">game-icons.net</a>, CC BY 3.0.</span>
          <span>Images you add in the Image library are your own and are kept in your account.</span></div>
        <p class="small muted" style="margin: 0">Always check the official rules when in doubt.</p>`,
        `<button class="btn solid block" data-act="closeAll">DONE</button>`);
    }
    if (o === 'history') {
      const fmt = (d) => { try { return new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return ''; } };
      const games = HIST.filter((g) => !HIST_DEL.includes(g.id));
      const wins = games.filter((g) => g.result === 'Victory').length, losses = games.filter((g) => g.result === 'Defeat').length, draws = games.filter((g) => g.result === 'Draw').length;
      const tone = (r) => (r === 'Victory' ? 'var(--accent-text)' : r === 'Defeat' ? 'var(--muted)' : 'var(--gold)');
      const rows = games.map((g) => `<button class="strat" data-act="game" data-k="${g.id}" style="align-items: center"><span style="min-width: 0"><span class="nm">vs ${esc(g.foe)}${g.foeName ? ' · ' + esc(g.foeName) : ''}</span><br><span class="ds">${esc(fmt(g.date))} · ${esc(g.armyLabel)} · ${esc((g.primary && g.primary.me) || 'No primary')}${g.deployment ? ' · ' + esc(g.deployment) : ''}${g.mode === 'casual' ? ' · Casual' : ''}</span></span><span style="flex: 0 0 auto; text-align: right"><b class="tnum" style="font-size: 18px">${g.vp.me}–${g.vp.foe}</b><br><span class="small" style="font-weight: 700; color: ${tone(g.result)}">${esc(g.result)}</span></span></button>`).join('');
      return sheet(a.hist, `${games.length ? `<div class="grid3 tnum" style="text-align: center"><div class="panel" style="padding: 8px"><b style="font-size: 22px">${wins}</b><br><span class="small muted">won</span></div><div class="panel" style="padding: 8px"><b style="font-size: 22px">${losses}</b><br><span class="small muted">lost</span></div><div class="panel" style="padding: 8px"><b style="font-size: 22px">${draws}</b><br><span class="small muted">drawn</span></div></div>
        <div class="stack" style="gap: 6px">${rows}</div>` : '<div class="panel small muted" style="padding: 12px">No battles yet. Every game you finish is kept here, and a game you leave unfinished is kept too.</div>'}`,
        `<button class="btn solid block" data-act="closeAll">DONE</button>`);
    }
    if (o === 'game') {
      const g = HIST.find((x) => x.id === UI.gameId); if (!g) return '';
      const fmt = (d) => { try { return new Date(d).toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } };
      const R = g.rounds || {};
      const table = Object.keys(R).length ? `<div class="tbl-wrap panel" style="padding: 6px 8px"><table class="wpn"><thead><tr><th>Round</th><th>Your pri</th><th>Your sec</th><th>Their pri</th><th>Their sec</th><th>Kills</th></tr></thead><tbody>${Object.keys(R).map((r) => { const x = R[r]; return `<tr><td>${roman(+r)}</td><td>${x.pri.me}</td><td>${x.sec.me}</td><td class="foe-ink">${x.pri.foe}</td><td class="foe-ink">${x.sec.foe}</td><td>${x.kills}</td></tr>`; }).join('')}</tbody></table></div>` : '';
      const vox = (g.log || []).filter((e) => e.kind === 'vox');
      const lost = (g.units || []).filter((u) => !u.alive).map((u) => u.name);
      const cards = (who) => ((g.cards && g.cards[who]) || []).map((c) => `${c.name} (${c.vp} VP${c.status === 'achieved' ? ', achieved' : c.status === 'discarded' ? ', discarded' : ''})`).join(', ');
      return sheet(`vs ${g.foe}`, `
        <div class="panel row" style="justify-content: space-between; padding: 10px 12px"><span><b style="font-size: 20px">${esc(g.result)}</b><br><span class="small muted">${esc(fmt(g.date))}</span></span><b class="tnum" style="font-size: 30px">${g.vp.me}<span class="muted" style="font-size: 18px"> – </span><span class="foe-ink">${g.vp.foe}</span></b></div>
        <div class="small stack" style="gap: 4px">
          <div><span class="muted">You:</span> ${esc(g.armyLabel)}${g.list ? ' · ' + esc(g.list) : ''}</div>
          <div><span class="muted">Them:</span> ${esc(g.foe)}${g.foeName ? ' (' + esc(g.foeName) + ')' : ''}${g.foeDets && g.foeDets.length ? ' · ' + esc(g.foeDets.join(', ')) : ''}${g.warlord ? ' · Warlord ' + esc(g.warlord) : ''}</div>
          <div><span class="muted">Mission:</span> ${esc((g.primary && g.primary.me) || 'none')} against ${esc((g.primary && g.primary.foe) || 'none')}${g.deployment ? ' · ' + esc(g.deployment) : ''}${g.twist ? ' · ' + esc(g.twist) : ''} · ${g.mode === 'casual' ? 'Casual' : 'Comp'} · ${g.first === 'me' ? 'you went first' : 'they went first'}</div>
          ${g.status === 'unfinished' || g.early ? `<div><span class="muted">${g.early ? 'Ended early in' : 'Stopped in'}:</span> Round ${roman(g.round)}</div>` : ''}
          ${cards('me') ? `<div><span class="muted">Your secondaries:</span> ${esc(cards('me'))}</div>` : ''}
          ${cards('foe') ? `<div><span class="muted">Their secondaries:</span> ${esc(cards('foe'))}</div>` : ''}
          <div><span class="muted">Units you lost:</span> ${lost.length ? esc(lost.join(', ')) : 'none'}</div>
        </div>
        ${table}
        ${vox.length ? `<section class="stack" style="gap: 6px"><div class="eyebrow" style="color: var(--gold)">${esc(a.vox)} · ${vox.length}</div>${vox.map((e) => `<div class="panel small" style="padding: 8px 12px"><b>R${e.r} · ${e.turn === 'me' ? 'Your' : 'Their'} ${esc(e.phase)}</b>${e.note ? '<br>' + esc(e.note) : ''}</div>`).join('')}</section>` : ''}
        <details class="panel" style="padding: 10px 12px"><summary style="cursor: pointer; min-height: 32px"><span class="eyebrow">${esc(a.log)} · ${(g.log || []).length} entries</span></summary><div class="stack" style="gap: 2px; padding-top: 6px">${(g.log || []).slice().reverse().map((e) => `<div class="small"><span class="muted tnum">R${e.r} ${e.turn === 'me' ? 'You' : 'Them'} ${esc(e.phase || '')}:</span> ${esc(e.text)}${e.note ? ' <i>(' + esc(e.note) + ')</i>' : ''}</div>`).join('')}</div></details>`,
        `<div class="grid2"><button class="btn" data-act="hist">BACK</button><button class="btn" data-act="gameDel">REMOVE</button></div>`);
    }
    if (o === 'library') {
      const used = new Set(allSlots().map(slotId).filter(Boolean));
      const tray = POOL.filter((x) => !used.has(x.id));
      const pick = poolItem(UI.libPick);
      const thumbs = tray.map((x) => `<button data-act="poolPick" data-k="${x.id}" style="min-width: 0; padding: 6px; border: ${UI.libPick === x.id ? '2px solid var(--text)' : '1px solid var(--line2)'}; background: var(--panel); color: var(--text); display: flex; flex-direction: column; gap: 4px; align-items: center"><img src="${x.src}" alt="" style="width: 100%; aspect-ratio: 1; object-fit: contain"><span class="small" style="overflow-wrap: anywhere; line-height: 1.1">${esc(x.name)}</span></button>`).join('');
      const empty = allSlots().filter((sl) => !slotId(sl));
      const placed = allSlots().filter((sl) => poolItem(slotId(sl)));
      const where = pick && !UI.assign ? `<div class="panel stack" style="padding: 10px 12px; gap: 6px"><div class="eyebrow">Put "${esc(pick.name)}" on</div>
        ${empty.length ? `<div class="grid2">${empty.map((sl) => `<button class="btn small" data-act="poolUse" data-k="${esc(sl)}" style="line-height: 1.1; padding: 4px 6px; min-height: 44px">${esc(slotLabel(sl))}</button>`).join('')}</div>` : '<p class="small muted" style="margin: 0">Every button already has an image. Take one off first, from its army.</p>'}
        <button class="btn small" data-act="poolDelete">DELETE THIS IMAGE</button></div>` : '';
      return sheet(UI.assign ? 'Choose an image' : 'Image library', `
        ${UI.assign ? `<p class="small" style="margin: 0">For: <b>${esc(slotLabel(UI.assign))}</b>. Tap an image to place it.</p>` : '<p class="small muted" style="margin: 0">Images waiting to be placed. Once placed, an image lives on its button and leaves this list.</p>'}
        <label class="btn block" style="cursor: pointer; position: relative">+ ADD IMAGES FROM YOUR PHONE<input type="file" id="pool-files" accept="image/*" multiple style="position: absolute; width: 1px; height: 1px; opacity: 0"></label>
        <p class="small muted" style="margin: 0">Name files after the army before adding (necrons.png, dark-angels.jpg, templars.png, carcharodons.png, warhammer.png) and they go straight onto the right button.</p>
        ${tray.length ? `<div class="grid3">${thumbs}</div>` : '<div class="panel small muted" style="padding: 12px">No images waiting.</div>'}${where}
        ${!UI.assign && empty.length ? `<p class="small muted" style="margin: 0">Still without an image: ${esc(empty.map(slotLabel).join(', '))}.</p>` : ''}
        ${!UI.assign && placed.length ? `<div class="eyebrow">Placed</div><div class="stack" style="gap: 6px">${placed.map((sl) => { const it = poolItem(slotId(sl)); return `<div class="panel row" style="gap: 10px; padding: 6px 6px 6px 8px; align-items: center"><img src="${it.src}" alt="" style="flex: 0 0 44px; width: 44px; height: 44px; object-fit: contain"><span class="small" style="flex: 1; min-width: 0; font-weight: 600">${esc(slotLabel(sl))}</span><button class="btn small" data-act="poolUnuse" data-k="${esc(sl)}">TAKE OFF</button></div>`; }).join('')}</div><p class="small muted" style="margin: 0">Taking an image off puts it back in the list above, ready to place again.</p>` : ''}`,
        `<button class="btn solid block" data-act="libBack">DONE</button>`);
    }
    if (o === 'roll') {
      const L = list();
      const rows = L ? L.units.map((u) => `<div class="panel row" style="justify-content: space-between; padding: 8px 12px; gap: 10px"><span style="min-width: 0"><b>${u.warlord ? ICON.cross + ' ' : ''}${esc(u.name)}</b><br><span class="small muted">${u.models.map((m) => m.count + '× ' + esc(m.name)).join(', ')}${u.enhancements.length ? ' · ' + esc(u.enhancements.join(', ')) : ''}</span></span><span class="tnum small muted">${u.points}</span></div>`).join('') : '<p class="muted">No list loaded yet.</p>';
      return sheet(a.roll, `<div class="eyebrow">${L ? L.units.length + ' units · ' + L.points_total.toLocaleString() + ' pts' : ''}</div><div class="stack" style="gap: 4px">${rows}</div>`);
    }
    if (o === 'foe') {
      const tile = (k) => {
        const R = S.rivals[k]; const fi = factionInfo(R.faction); const t = FOE_THEMES[fi.theme] || FOE_THEMES.loyal; const on = S.foeKey === k;
        return `<div class="rival-wrap"><button class="rival ${on ? 'on' : ''}" data-act="pickRival" data-k="${esc(k)}" style="--glow: ${t[2]}" aria-label="${esc(fi.display + (R.name ? ', ' + R.name : ''))}. Record ${R.record[0]} wins, ${R.record[1]} losses">
          ${sigil(R.faction, R)}<span class="rival-name">${esc(R.name || fi.display)}</span><span class="small muted tnum">${R.name ? esc(fi.display) + ' · ' : ''}${R.record[0]}–${R.record[1]}</span></button></div>`;
      };
      const keys = RIVALS.map((r) => r[0]).concat(Object.keys(S.rivals).filter((k) => !RIVALS.some((r) => r[0] === k)));
      return sheet(a.steps[1], `<div class="eyebrow">Your rivals · tap one to choose and edit</div><div class="rivals">${keys.map(tile).join('')}</div>
        <button class="btn block" data-act="overlay" data-k="newfoe" style="border-style: dashed">+ NEW OPPONENT</button>`, `<button class="btn solid block" data-act="closeAll">DONE</button>`);
    }
    if (o === 'newfoe') {
      return sheet('New opponent', `<label class="field"><span class="eyebrow">Army</span><select id="nf-faction">${FACTIONS.map((f) => `<option value="${esc(f[0])}">${esc(f[2] || f[0])}</option>`).join('')}</select></label>
        <label class="field"><span class="eyebrow">Their name (optional)</span><input type="text" id="nf-name" autocomplete="off"></label>`,
        `<button class="btn solid block" data-act="addFoe">ADD OPPONENT</button>`);
    }
    if (o === 'foedetail') {
      const F = foe(), fi = factionInfo(F.faction);
      const fd = FD(F.faction);
      const detUI = fd
        ? `<div class="stack" style="gap: 6px">${fd.detachments.map((d) => `<button class="row" data-act="toggleDet" data-k="${esc(d.name)}" style="justify-content: space-between; min-height: 48px; padding: 0 12px; border: 1px solid ${F.detachments.includes(d.name) ? 'var(--foe-c)' : 'var(--foe-line)'}; background: ${F.detachments.includes(d.name) ? 'var(--foe-deep)' : 'transparent'}; color: var(--text); text-align: left"><span><b>${esc(d.name)}</b><br><span class="small muted">${esc(d.disposition)}</span></span><span class="small foe-ink">${d.dp} DP ${F.detachments.includes(d.name) ? '✓' : ''}</span></button>`).join('')}</div>`
        : `<label class="field"><span class="eyebrow foe-ink">Detachments (comma separated)</span><input type="text" id="fd-dets" value="${esc(F.detachments.join(', '))}"></label><p class="small muted" style="margin: 0">${FACTION_FILES[F.faction] ? 'Loading ' + esc(fi.display) + ' rules…' : 'No rules held for ' + esc(fi.display) + '. Their name, detachments and notes are saved now.'}</p>`;
      return sheet('Foe details', `${factionCheckLine(F.faction)}
        <div class="row" style="gap: 14px"><span style="flex: 0 0 56px; width: 56px; height: 56px; display: block">${sigil(F.faction, F)}</span><div><div class="foe-font" style="font-family: var(--foe-font); font-size: 26px; font-weight: 700; line-height: 1">${esc(fi.display)}</div><div class="small foe-ink">Record: ${F.record[0]} won · ${F.record[1]} lost</div></div></div>
        <label class="field"><span class="eyebrow foe-ink">Their name</span><input type="text" id="fd-name" value="${esc(F.name)}" placeholder="Add a name"></label>
        <div class="foe-panel stack" style="padding: 10px 12px; gap: 8px"><div class="eyebrow foe-ink">Their emblem</div>
          <div class="row" style="gap: 12px; align-items: center"><span style="flex: 0 0 88px; width: 88px; height: 88px; display: block">${sigil(F.faction, F)}</span>
          <div class="stack" style="gap: 6px; flex: 1; min-width: 0">${F.emblemId ? '' : '<span class="small muted">No image yet. Add one from Image library at the bottom of the main screen.</span>'}
          ${F.emblemId ? `<div class="grid2"><button class="btn small ${F.emblemTint !== false ? 'solid' : ''}" data-act="emTint" data-k="1" style="line-height: 1.1">ARMY COLOURS</button><button class="btn small ${F.emblemTint === false ? 'solid' : ''}" data-act="emTint" data-k="0">ORIGINAL</button></div>
          ${F.emblemTint !== false ? '<button class="btn small" data-act="emInvert" style="line-height: 1.1">SWAP SYMBOL AND BACKGROUND</button>' : ''}<button class="btn small" data-act="emClear" style="line-height: 1.1">TAKE OFF (BACK TO LIBRARY)</button>` : ''}</div></div>
          ${F.emblemId ? '<p class="small muted" style="margin: 0">Army colours fills the symbol with their shifting colours. If the background lights up instead of the symbol, tap Swap.</p>' : ''}</div>
        <div class="eyebrow foe-ink">Detachments</div>${detUI}
        ${fd ? (() => { const chars = foeCharacters(F.faction); const known = chars.includes(F.warlord);
          return `<label class="field"><span class="eyebrow foe-ink">Warlord</span><select id="fd-warlord"><option value="">Not sure yet</option>${!known && F.warlord ? `<option selected>${esc(F.warlord)}</option>` : ''}${chars.map((n) => `<option ${n === F.warlord ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select></label>
          <p class="small muted" style="margin: 0">Every character in the ${esc(fi.display)} army. Pick one to see what they do.</p>${known ? warlordCard(F.faction, F.warlord, true) : ''}`; })()
          : `<label class="field"><span class="eyebrow foe-ink">Warlord</span><input type="text" id="fd-warlord" value="${esc(F.warlord)}"></label>`}
        <label class="field"><span class="eyebrow foe-ink">Your notes on this foe</span><textarea id="fd-notes" rows="3">${esc(F.notes)}</textarea></label>`,
        `<button class="btn block foe-fill" data-act="saveFoe" style="border: 0; font-weight: 700">SAVE FOE</button>`, true);
    }
    if (o === 'field') {
      const L = list(), F = S.field;
      const myDisp = F.myDisp || (L && L.force_disposition) || '';
      const hasVows = L && L.detachments.includes('Vow-sworn Crusaders');
      const mine = myDispOptions(), theirs = foeDispOptions();
      const opts = (allowed, v) => ['<option value="">Choose…</option>'].concat(allowed.map((d) => `<option ${d === v ? 'selected' : ''}>${d}</option>`)).concat(DISPOSITIONS.filter((d) => !allowed.includes(d)).map((d) => `<option value="${d}" ${d === v ? 'selected' : ''}>${d} (not in detachments)</option>`)).join('');
      const p = primaries();
      const cardBox = (name, foeSide) => {
        const pc = parseCard(M.primary[name], true);
        return `<details class="${foeSide ? 'foe-panel' : 'panel'}" style="padding: 10px 12px"><summary style="cursor: pointer; min-height: 32px"><span class="eyebrow ${foeSide ? 'foe-ink' : ''}">${foeSide ? 'Their primary' : 'Your primary'}</span><br><b style="font-size: 18px">${esc(name)}</b></summary>
          <div class="stack" style="gap: 6px; padding-top: 8px">${pc.notes.map((n) => `<div class="small">${esc(n)}</div>`).join('')}${pc.rows.map((r) => `<div class="small"><span class="muted">${esc(titleCase(r.hdr))} · ${esc(r.when)}</span><br>${esc(r.cond)} <b>${r.bonus ? '+' : ''}${r.vp} VP</b></div>`).join('')}</div></details>`;
      };
      const secNames = Object.keys(M.secondary);
      const secOpts = (v, other) => ['<option value="">Choose a card…</option>'].concat(secNames.filter((n) => n !== other || n === v).map((n) => `<option ${n === v ? 'selected' : ''}>${esc(n)}</option>`)).join('');
      const secBlock = (who) => {
        const isMe = who === 'me'; const tac = isMe ? secTactical() : foeSecTactical(); const vals = (isMe ? F.fixed : F.foeSec) || ['', ''];
        const id = isMe ? 'fl-fx' : 'fl-fs'; const ink = isMe ? '' : 'foe-ink';
        return `<div class="${isMe ? 'panel' : 'foe-panel'} stack" style="padding: 10px 12px; gap: 8px">
          <div class="eyebrow ${ink}">${isMe ? 'Your' : 'Their'} ${secN() === 1 ? 'secondary' : 'two secondaries'}</div>
          <div class="grid2"><button class="btn small ${tac ? 'solid' : ''}" data-act="${isMe ? 'secMode' : 'foeSecMode'}" data-k="tactical">TACTICAL</button><button class="btn small ${!tac ? 'solid' : ''}" data-act="${isMe ? 'secMode' : 'foeSecMode'}" data-k="fixed">FIXED</button></div>
          <label class="field"><span class="small ${ink}" style="font-weight: 700">${tac ? 'Opening card 1' : 'Fixed card 1'}</span><select id="${id}0">${secOpts(vals[0], vals[1])}</select></label>
          ${secN() === 2 ? `<label class="field"><span class="small ${ink}" style="font-weight: 700">${tac ? 'Opening card 2' : 'Fixed card 2'}</span><select id="${id}1">${secOpts(vals[1], vals[0])}</select></label>` : ''}
          <p class="small muted" style="margin: 0">${tac ? `Tactical: ${secN() === 1 ? 'one card' : 'two cards'} in hand at a time. When one is achieved or discarded, draw a new one from the round panel. You can leave these blank and draw in Round I.` : `Fixed: the same ${secN() === 1 ? 'card' : 'two cards'} all battle, up to 20 VP each.`}</p></div>`;
      };
      const d = depDef(F.deployment); const me = mySide();
      const sect = (n, title) => `<div class="row" style="gap: 10px; padding-top: 6px; border-top: 1px solid var(--line)"><span class="h" style="font-size: calc(22px * var(--head-size)); color: var(--accent-text)">${n}</span><span class="eyebrow" style="color: var(--text)">${title}</span></div>`;
      const cas = casual(), rolled = cas || F.missionPick === 'random';
      const seg = (act, val, cur, label) => `<button class="btn small ${cur ? 'solid' : ''}" data-act="${act}" data-k="${val}" style="min-height: 44px">${label}</button>`;
      return sheet(a.steps[2], `
        ${sect('0', 'Game type')}
        <div class="grid2">${seg('gameMode', 'comp', !cas, 'COMP')}${seg('gameMode', 'casual', cas, 'CASUAL')}</div>
        <p class="small muted" style="margin: 0">${cas ? 'Casual: no twists or secondaries. The app rolls the primary and the deployment.' : 'Comp: full matched play. Choose or roll the mission, add a twist, and set up secondaries.'}</p>
        ${sect('1', 'Primary missions')}
        ${cas ? '' : `<div class="grid2">${seg('missionPick', 'choose', !rolled, 'I CHOOSE')}${seg('missionPick', 'random', rolled, 'APP ROLLS')}</div>`}
        ${rolled ? `<div class="panel stack" style="padding: 10px 12px; gap: 6px"><span class="small">Dispositions: <b>${esc(myDisp || 'not rolled')}</b> <span class="muted">vs</span> <b class="foe-ink">${esc(F.foeDisp || 'not rolled')}</b><br>Deployment: <b>${esc(F.deployment || 'not rolled')}</b></span><button class="btn small" data-act="reroll">ROLL AGAIN</button></div>
        <p class="small muted" style="margin: 0">Rolled from the dispositions each army's detachments allow. The two dispositions set each player's primary.</p>` : `<label class="field"><span class="eyebrow">Your disposition</span><select id="fl-my">${opts(mine, myDisp)}</select></label>
        <label class="field"><span class="eyebrow foe-ink">Their disposition</span><select id="fl-foe">${opts(theirs, F.foeDisp)}</select></label>
        <p class="small muted" style="margin: 0">Choices come from your detachments${FD(foe().faction) && foe().detachments.length ? ' and theirs' : ''}. Each player gets one primary, set by the two dispositions.</p>`}
        ${p ? cardBox(p.me, false) + cardBox(p.foe, true) : '<div class="panel small muted" style="padding: 10px 12px">Pick both dispositions to see each primary mission.</div>'}
        ${cas ? '' : `<label class="field"><span class="eyebrow">Twist (optional)</span><select id="fl-twist"><option value="">No twist</option>${Object.keys(M.twists).map((x) => `<option ${x === F.twist ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
        ${F.twist ? `<div class="small panel" style="padding: 8px 12px">${esc(M.twists[F.twist])}</div>` : ''}
        ${F.twist === 'Mirrored World' ? `<label class="field"><span class="eyebrow">Shared primary</span><select id="fl-mirror"><option value="">Choose…</option>${['Battlefield Dominance', 'Meatgrinder', 'Outmanoeuvre', 'Gather Intel', 'Sabotage'].map((x) => `<option ${x === F.mirror ? 'selected' : ''}>${x}</option>`).join('')}</select></label>` : ''}`}
        ${sect('2', 'The table')}
        ${rolled ? `<div class="small">Deployment: <b>${esc(F.deployment || 'not rolled')}</b> (rolled)</div>` : `<label class="field"><span class="eyebrow">Deployment</span><select id="fl-dep"><option value="">Choose…</option>${M.deployments.map((x) => `<option ${x === F.deployment ? 'selected' : ''}>${x}</option>`).join('')}</select></label>`}
        ${tableMap({ mode: 'side' })}
        ${officialMaps(F, 'field')}
        <p class="small muted" style="margin: 0">${F.deployment ? 'Tap a zone, or use the buttons, to set where you deploy. Shapes and objective spots are approximate; your deployment card has the exact distances.' : 'Choose a deployment to draw its zones.'}</p>
        <div class="stack" style="gap: 6px"><span class="eyebrow">Your deployment zone</span>
          <div class="grid2"><button class="btn small ${me === 'a' ? 'solid' : ''}" data-act="side" data-k="a" style="min-height: 44px; line-height: 1.1; padding: 4px 8px">${esc(d.names[0].toUpperCase())}</button><button class="btn small ${me === 'b' ? 'solid' : ''}" data-act="side" data-k="b" style="min-height: 44px; line-height: 1.1; padding: 4px 8px">${esc(d.names[1].toUpperCase())}</button></div></div>
        <div class="stack" style="gap: 6px"><span class="eyebrow">Who takes the first turn</span>
          <div class="grid2"><button class="btn small ${F.first === 'me' ? 'solid' : ''}" data-act="first" data-k="me" style="min-height: 44px">I GO FIRST</button><button class="btn small ${F.first === 'foe' ? 'solid' : ''}" data-act="first" data-k="foe" style="min-height: 44px">THEY GO FIRST</button></div></div>
        ${cas ? '' : `${sect('3', 'Secondary missions')}
        <div class="grid2">${seg('secOnOff', 'on', F.secOn !== false, 'SECONDARIES ON')}${seg('secOnOff', 'off', F.secOn === false, 'OFF')}</div>
        ${F.secOn !== false ? `<div class="stack" style="gap: 6px"><span class="eyebrow">Cards each player holds</span><div class="grid2">${seg('secCount', '1', secN() === 1, '1 CARD')}${seg('secCount', '2', secN() === 2, '2 CARDS')}</div></div>
        <div class="stack" style="gap: 6px"><span class="eyebrow">Who picks the cards</span><div class="grid2">${seg('secPick', 'random', F.secPick === 'random', 'APP DEALS')}${seg('secPick', 'choose', F.secPick !== 'random', 'I CHOOSE')}</div></div>
        ${F.secPick === 'random' ? `<p class="small muted" style="margin: 0">The app is the deck for both of you: it deals ${secN()} card${secN() > 1 ? 's' : ''} each when the battle starts, and draws replacements at the start of each player's turn after a card is achieved or discarded.</p>` : secBlock('me') + secBlock('foe')}` : '<p class="small muted" style="margin: 0">No secondaries this game. Only primaries score.</p>'}`}
        ${hasVows ? `${sect('4', 'Your vow')}<label class="field"><span class="eyebrow">Templar Vow (detachment rule)</span><select id="fl-vow">${VOWS.map((v) => `<option ${v === F.vow ? 'selected' : ''}>${v}</option>`).join('')}</select></label><p class="small muted" style="margin: 0">Suggested: Uphold the Honour of the Emperor. It secures objectives your infantry control, which fits your vow to score before you slay.</p>` : ''}`,
        `<button class="btn solid block" data-act="saveField">DONE</button>`);
    }
    return '';
  }

  // ---------- render: battle ----------
  function renderBattle() {
    const B = S.battle, a = A();
    const myTurn = B.turn === 'me';
    const tabs = [['emblem', a.emblem === 'jaws' ? 'Jaws' : a.emblem === 'cross' ? 'Cross' : 'Overview'], ['counsel', a.counsel], ['army', a.armyQ], ['foe', a.foeQ], ['log', a.log]];
    const view = UI.view;
    let body = '';
    const endBtn = `<button class="btn block" data-act="endBattle" style="margin-top: 14px; border-color: var(--accent-text); color: var(--accent-text)">${esc(a.end.toUpperCase())}</button>`;
    if (view === 'emblem') body = roundTrack() + renderEmblem() + endBtn;
    else if (view === 'counsel') body = renderCounsel() + endBtn;
    else if (view === 'army') body = renderArmy();
    else if (view === 'foe') body = renderFoeView();
    else body = renderLog();
    return `
    <header class="band bhead wrap" style="padding-block: 6px 6px">
      <div class="row" style="justify-content: space-between">
        <button class="icon-btn" data-act="toMuster" aria-label="Back to the main page">${ICON.back}</button>
        <span class="eyebrow tnum">ROUND ${roman(B.round)} · <span style="color: ${myTurn ? 'var(--text)' : 'var(--foe-soft)'}">${myTurn ? 'YOUR TURN' : 'THEIR TURN'}</span></span>
        <span class="row" style="gap: 6px"><button class="btn small" data-act="maps" aria-label="Maps" style="min-height: 40px; padding: 0 ${STANDALONE ? 8 : 10}px">MAP</button><button class="btn small" data-act="dice" aria-label="Dice odds and calculator" style="min-height: 40px; padding: 0 ${STANDALONE ? 8 : 10}px">DICE</button>${STANDALONE ? `<button class="btn small ${LIVE.on ? 'gold' : ''}" data-act="webway" aria-label="Webway: link your opponent's phone" style="min-height: 40px; padding: 0 8px">${LIVE.on ? (LIVE.other ? 'LINKED' : 'LINK…') : 'LINK'}</button>` : ''}<button class="btn small gold" data-act="vox" aria-label="${esc(a.vox)}: mark this moment" ${STANDALONE ? 'style="min-height: 40px; padding: 0 8px"' : ''}>${ICON.vox}${STANDALONE ? '' : ' ' + esc(a.voxShort)}</button></span>
      </div>
      <div class="phase-row"><button class="icon-btn" data-act="phase" data-k="-1" aria-label="Previous phase">${ICON.back}</button><span class="phase-name">${PHASES[B.phase]}</span><button class="icon-btn" data-act="phase" data-k="1" aria-label="Next phase">${ICON.next}</button></div>
    </header>
    <main class="main wrap stack">${body}</main>
    <nav class="bnav" aria-label="Battle views">${tabs.map(([k, l]) => `<button class="${view === k ? 'on' : ''} ${k === 'foe' ? 'foe-tab' : ''}" data-act="view" data-k="${k}">${esc(l)}</button>`).join('')}</nav>`;
  }
  // ---------- Combat Doctrines (11th edition Space Marine army rule) and phase reminders ----------
  const DOCTRINES = { assault: ['Assault Doctrine', 'Units can still declare a charge after Advancing.'], devastator: ['Devastator Doctrine', 'Ranged weapons gain [ASSAULT].'], tactical: ['Tactical Doctrine', 'Units can still shoot and declare a charge after Falling Back.'] };
  function isAstartes() {
    if (S.army !== 'other') return ['templars', 'carcharodons', 'wolves', 'dark', 'deathwatch', 'fists'].includes(S.army);
    const L = list(); return !!(L && /space marine|astartes|dark angels|blood angels|space wolves|deathwatch|templar|carcharodon|imperial fists/i.test((L.faction || '') + ' ' + (L.detachments || []).join(' ')));
  }
  function docLimits() {
    const det = (list() && list().detachments) || [];
    return { assault: det.includes('Assault Brethren') ? 2 : 1, devastator: det.includes('Devastator Brethren') ? 2 : 1, tactical: det.includes('Tactical Brethren') ? 2 : 1 };
  }
  function doctrineUI() {
    if (!isAstartes()) return '';
    const B = S.battle; const D0 = B.doctrine || { active: '', used: {} }; const lim = docLimits();
    const btn = (k) => { const left = lim[k] - (D0.used[k] || 0); const on = D0.active === k;
      return `<button class="btn small ${on ? 'solid' : ''}" data-act="doctrine" data-k="${k}" ${!on && left <= 0 ? 'disabled style="opacity: 0.4; flex-direction: column; line-height: 1.1; min-height: 50px"' : 'style="flex-direction: column; line-height: 1.1; min-height: 50px"'}>${DOCTRINES[k][0].split(' ')[0].toUpperCase()}<span style="font-size: 11px; font-weight: 600; letter-spacing: 0.02em">${on ? 'Active' : left + ' left'}</span></button>`; };
    return `<div class="panel stack" style="padding: 10px 12px; gap: 8px"><div><div class="eyebrow">Combat Doctrine</div><div class="small muted">Each once per battle${lim.assault > 1 ? ' (Assault twice, from Assault Brethren)' : ''}. Tap to make one active.</div></div>
      <div class="grid3">${btn('assault')}${btn('devastator')}${btn('tactical')}</div>
      <div class="small">${D0.active ? `<b>${esc(DOCTRINES[D0.active][0])}:</b> ${esc(DOCTRINES[D0.active][1])}` : '<span class="muted">No doctrine active.</span>'}</div></div>`;
  }
  function reminders() {
    const B = S.battle; const ph = PHASES[B.phase]; const mine = B.turn === 'me'; const det = (list() && list().detachments) || []; const out = [];
    const act = B.doctrine && B.doctrine.active;
    if (mine && ph === 'Command') {
      if (det.includes('Assault Brethren')) out.push('Assault Mastery: you can pick Assault Doctrine one extra time this battle.');
      const held = activeCards('me', B.round).filter((c) => c.status === 'active').length;
      if (B.secOn && !B.secRandom && B.tactical && held < B.secCount) out.push(`You hold ${held} of ${B.secCount} secondary card${B.secCount > 1 ? 's' : ''}. Draw up to ${B.secCount} in the Round ${roman(B.round)} panel.`);
      if (B.secOn && B.secRandom) out.push(`Your secondaries: ${activeCards('me', B.round).filter((c) => c.status === 'active').map((c) => c.name).join(' and ') || 'none in hand'}. Open the Round ${roman(B.round)} panel to score them.`);
    }
    if (mine && ph === 'Movement') {
      if (B.round >= 2) out.push('Units waiting in reserve: bring them in now if they are coming this turn.');
      if (act === 'tactical') out.push('Tactical Doctrine: units that Fall Back can still shoot and charge.');
      if (act === 'assault') out.push('Assault Doctrine: units that Advance can still charge.');
    }
    if (mine && ph === 'Shooting') {
      if (act === 'devastator') out.push('Devastator Doctrine: ranged weapons have [ASSAULT].');
      if (det.includes('Phobos Shadow Force')) out.push('Shadow Masters: after a Phobos or Scout Squad shoots, it can stay hidden, or make a normal move of up to D6" (no charge this turn).');
    }
    if (mine && ph === 'Charge') {
      if (det.includes('Terminator Storm Force')) out.push('Death Blow: your Terminator units get +1 to charge rolls.');
      if (act === 'assault') out.push('Assault Doctrine: units that Advanced can still declare a charge.');
    }
    if ((ph === 'Charge' || ph === 'Fight') && det.includes('Vow-sworn Crusaders')) out.push(`Templar Vow: ${S.field.vow}.`);
    // what their army rule does this phase
    const ff = foe().faction;
    if (!mine && ph === 'Command' && ff === 'Necrons') out.push('Their Reanimation Protocols: at the end of their Command phase each Necron unit heals D3 wounds, which can bring models back. Finish units off rather than leaving them wounded.');
    if (ph === 'Command' && ff === 'Aeldari' && B.turn === S.field.first) out.push('New battle round: the Aeldari get fresh Battle Focus tokens (4 at Strike Force) for extra moves, and units using Flitting Shadows cannot be shot by Fire Overwatch.');
    if (!mine && ph === 'Command' && (ff === 'Dark Angels' || ff === 'Space Wolves')) out.push('They can switch Combat Doctrine now: Assault (charge after Advancing), Devastator (ranged [ASSAULT]) or Tactical (shoot and charge after Falling Back).');
    if (!mine && ph === 'Command' && ff === 'Space Wolves') out.push('Curse of the Wulfen: their Wulfen get extra OC near a Space Wolves Character or Wolf Priest. Count it before you contest an objective.');
    return out.length ? `<div class="panel stack" style="padding: 10px 12px; gap: 6px"><div class="eyebrow">Remember · ${esc(ph)}</div>${out.map((t) => `<div class="small" style="padding-left: 10px; border-left: 2px solid var(--accent-text)">${esc(t)}</div>`).join('')}</div>` : '';
  }
  function scoreboard() {
    const B = S.battle;
    const ctr = (stat, who) => `<div class="ctr ${who === 'foe' ? 'foe' : ''}"><button data-act="adj" data-k="${stat}" data-w="${who}" data-d="-1" aria-label="Decrease ${who === 'me' ? 'your' : 'their'} ${stat}">−</button><b class="tnum">${B[stat][who]}</b><button data-act="adj" data-k="${stat}" data-w="${who}" data-d="1" aria-label="Increase ${who === 'me' ? 'your' : 'their'} ${stat}">+</button></div>`;
    const tap = (stat, who) => `<button class="ctr ${who === 'foe' ? 'foe' : ''}" data-act="round" data-k="${B.round}" style="justify-content: center; min-height: 42px; color: var(--text)" aria-label="Open the Round ${roman(B.round)} record"><b class="tnum">${B[stat][who]}</b></button>`;
    return `<div class="score"><span></span><span class="eyebrow" style="text-align: center">CP</span><span class="eyebrow" style="text-align: center">VP</span><span class="eyebrow" style="text-align: center">OBJ</span>
      <span class="small" style="font-weight: 700">You</span>${ctr('cp', 'me')}${tap('vp', 'me')}${tap('obj', 'me')}
      <span class="small foe-ink" style="font-weight: 700">Them</span>${ctr('cp', 'foe')}${tap('vp', 'foe')}${tap('obj', 'foe')}</div>${roundTrack()}`;
  }
  function roundTrack() {
    const B = S.battle;
    return `<nav class="grid5" aria-label="Battle rounds" style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px">${[1, 2, 3, 4, 5].map((r) => {
      const R = B.rounds && B.rounds[r]; const cur = r === B.round; const done = r < B.round;
      const sc = R ? `${Math.min(15, R.pri.me) + Math.min(15, R.sec.me)}<span class="foe-ink">–${Math.min(15, R.pri.foe) + Math.min(15, R.sec.foe)}</span>` : '–';
      const nxt = r === B.round + 1, later = r > B.round + 1;
      return `<button data-act="${nxt ? 'nextRound' : 'round'}" data-k="${r}" ${later ? 'disabled' : ''} aria-label="${nxt ? 'Finish Round ' + roman(B.round) + ' and start Round ' + roman(r) : 'Round ' + roman(r) + ' record'}" style="min-height: 52px; padding: 2px; border: ${cur ? '2px solid var(--gold)' : nxt ? '1px dashed var(--gold)' : '1px solid var(--line)'}; background: ${done ? 'var(--panel2)' : 'var(--panel)'}; color: var(--text); opacity: ${later ? 0.35 : 1}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; line-height: 1.1"><span class="eyebrow" style="letter-spacing: 0.08em; ${cur || nxt ? 'color: var(--gold)' : ''}">R${roman(r)}${cur ? ' · now' : ''}</span><span class="tnum" style="font-weight: 700; font-size: 14px">${nxt ? '<span style="color: var(--gold)">START</span>' : sc}</span></button>`;
    }).join('')}</nav>`;
  }
  function scoringNow() {
    const B = S.battle; const myTurn = B.turn === 'me'; if (!B.primary || !B.primary.me) return '';
    const ph = PHASES[B.phase];
    const rows = parseCard(M.primary[B.primary.me], B.tactical).rows.filter((r) => r.rounds.includes(B.round) && r.hdr !== 'END OF THE BATTLE');
    const relevant = rows.filter((r) => (ph === 'Command' && /Command phase/.test(r.when) && !/opponent/i.test(r.when)) || (ph === 'Fight' && /End of (your|a) turn/.test(r.when)) || (ph === 'Movement' && /Command phase/.test(r.when)));
    if (!myTurn || !relevant.length) return '';
    return `<div class="panel stack" style="padding: 10px 12px; gap: 6px; border-color: var(--gold)"><div class="eyebrow" style="color: var(--gold)">Scoring now · ${esc(B.primary.me)}</div>${relevant.map((r) => `<div class="small">${esc(r.cond)} <b>${r.bonus ? '+' : ''}${r.vp} VP</b><span class="muted"> · ${esc(r.when)}</span></div>`).join('')}<button class="btn small gold" data-act="round" data-k="${B.round}">RECORD IN ROUND ${roman(B.round)}</button></div>`;
  }
  function renderCounsel() {
    const B = S.battle, a = A();
    const myTurn = B.turn === 'me';
    const phase = PHASES[B.phase];
    const mine = myStrats(phase, myTurn);
    const theirs = foeStrats(phase, myTurn);
    const vowBanner = `<div class="banner">${cryIcon()}<div><div class="eyebrow" style="color: var(--accent-text)">${esc(a.oath)} this battle</div><div style="font-size: 16px; font-weight: 600">${esc(a.oathText)}</div></div></div>`;
    const tvow = list() && list().detachments.includes('Vow-sworn Crusaders') ? `<div class="small muted">Templar Vow: <b style="color: var(--text)">${esc(S.field.vow)}</b></div>` : '';
    const cl = B.cpLast && B.cpLast.r === B.round && B.cpLast.turn === B.turn ? B.cpLast : null; const rolls = cpRolls(B);
    const cmdTip = B.phase === 0 ? `<div class="panel stack" style="padding: 8px 12px; gap: 4px"><div class="row" style="justify-content: space-between; gap: 8px"><span class="small"><b>CP added</b>${cl ? `: you +${cl.me.reduce((t, x) => t + x[1], 0)}, them +${cl.foe.reduce((t, x) => t + x[1], 0)}` : ''}</span><button class="btn small" data-act="cpBoth" style="min-height: 34px">+1 EACH</button></div>
      ${cl ? `<span class="small muted">${cl.me.map((x) => 'You: ' + esc(x[0]) + ' +' + x[1]).concat(cl.foe.map((x) => 'Them: ' + esc(x[0]) + ' +' + x[1])).join(' · ')}</span>` : ''}
      ${rolls.length ? `<span class="small" style="color: var(--gold)">Roll for CP: ${rolls.map(esc).join(' · ')}</span>` : ''}
      ${foe() && foe().warlord ? `<button class="small" data-act="foeWlDead" style="align-self: flex-start; background: none; border: 0; padding: 4px 0; color: var(--muted); text-decoration: underline">${B.foeWarlordDead ? 'Their Warlord is back (undo)' : 'Their Warlord is dead'}</button>` : ''}</div>` : '';
    const scoreTip = B.phase === 0 && myTurn ? `<div class="panel" style="padding: 10px 12px; border-color: var(--gold)"><div class="eyebrow" style="color: var(--gold)">Before you move</div><div style="font-size: 15px">Which objectives can you hold or take this turn? Decide what you score before you decide what you kill.</div></div>` : '';
    const sCard = (s) => `<button class="strat" data-act="strat" data-k="${esc(s.name)}" data-d="${esc(s.det)}"><span style="min-width: 0"><span class="nm">${esc(s.name)}</span><br><span class="ds">${esc(s.det)} · ${esc(s.when ? s.when : '')}</span></span><span class="cp">${s.cp} CP</span></button>`;
    const fCard = (s) => `<button class="strat foe" data-act="fstrat" data-k="${esc(s.name)}" data-d="${esc(s.det)}"><span style="min-width: 0"><span class="nm">${esc(s.name)}</span><br><span class="ds" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden">${esc(s.effect)}</span></span><span class="cp">${s.cp} CP</span></button>`;
    const foeNote = !FD(foe().faction) ? `<p class="small muted" style="margin: 0">${factionLoading[foe().faction] === 'failed' ? 'Their rules could not load. Check your signal and reopen the app.' : FACTION_FILES[foe().faction] ? 'Loading ' + esc(factionInfo(foe().faction).display) + ' rules…' : 'No rules held for ' + esc(factionInfo(foe().faction).display) + '.'}</p>` : (!foe().detachments.length ? `<button class="btn small" data-act="openFoeDetail">Set their detachment to see their stratagems</button>` : '') + (B.round === 1 && B.phase === 0 ? factionCheckLine(foe().faction) : '');
    const cogBtn = STANDALONE && UI.cogOK ? `<button class="btn block" data-act="cogitator" style="border-color: var(--gold); color: var(--gold)">ASK THE COGITATOR</button>` : '';
    return `${scoreboard()}${cogBtn}${vowBanner}${tvow}${cmdTip}${reminders()}${B.phase === 0 && myTurn ? doctrineUI() : ''}${scoreTip}${scoringNow()}
      <section class="stack" style="gap: 6px"><div class="eyebrow">Your options now · ${esc(phase)} · ${myTurn ? 'your turn' : 'their turn'}</div>${mine.length ? mine.map(sCard).join('') : '<p class="small muted" style="margin: 0">No stratagems for this moment.</p>'}</section>
      <section class="stack" style="gap: 6px"><div class="eyebrow foe-ink">Watch for · ${esc(factionInfo(foe().faction).display)} · ${B.cp.foe} CP left</div>${theirs.map(fCard).join('')}${foeNote}${!theirs.length && foe().faction === 'Necrons' && foe().detachments.length ? '<p class="small muted" style="margin: 0">Nothing from their detachments in this phase.</p>' : ''}</section>`;
  }
  function renderArmy() {
    const B = S.battle;
    const groups = [];
    B.units.forEach((u) => {
      const g = u.group ? groups.find((x) => x.k === u.group) : null;
      if (g) g.u.push(u); else groups.push({ k: u.group || 'x' + u.id, u: [u] });
    });
    const total = B.units.length, standing = B.units.filter((u) => alive(u) > 0).length;
    return `<div class="row" style="justify-content: space-between"><div class="eyebrow">${standing} of ${total} units standing</div><span class="small muted">Tap a unit for stats and maths</span></div>` + groups.map((g) => {
      const inner = g.u.map(unitCard).join('');
      return g.u.length > 1 ? `<div class="group"><span class="eyebrow" style="padding: 0 4px">Attached unit</span>${inner}</div>` : inner;
    }).join('');
  }
  function unitCard(u) {
    const n = alive(u), tot = u.models.length;
    const pips = u.models.map((m) => m.wl <= 0 ? '<span class="pip gone"></span>' : m.wl < m.W ? `<span class="pip hurt" style="--p: ${Math.round((m.wl / m.W) * 100)}%"></span>` : '<span class="pip"></span>').join('');
    const woundsLeft = u.models.reduce((a, m) => a + Math.max(0, m.wl), 0), woundsMax = u.models.reduce((a, m) => a + m.W, 0);
    return `<div class="unit ${n ? '' : 'dead'}"><div class="unit-top"><button class="name" data-act="unit" data-k="${u.id}">${u.warlord ? ICON.cross + ' ' : ''}${esc(u.name)}<br><span class="small muted" style="font-weight: 500">${n}/${tot} models · ${woundsLeft}/${woundsMax} wounds${u.enh.length ? ' · ' + esc(u.enh.join(', ')) : ''}</span></button></div>
      <div class="pips" aria-label="${n} of ${tot} models alive">${pips}</div>
      <div class="unit-actions"><button data-act="hurt" data-k="${u.id}" ${n ? '' : 'disabled'}>−1 WOUND</button><button data-act="kill" data-k="${u.id}" ${n ? '' : 'disabled'}>MODEL LOST</button><button data-act="heal" data-k="${u.id}">UNDO</button></div></div>`;
  }
  // small in-world wording on the opponent's side (their screens keep plain words otherwise)
  const FOE_WORDS = { sw: { army: 'Law of the Pack', det: 'Saga', spotted: 'Wolves sighted' }, necron: { army: 'Protocol', det: 'Dynastic directive', spotted: 'Phalanxes detected' }, da: { army: 'Rite of the Order', det: 'Edict', spotted: 'Marked by the Watch' }, ae: { army: 'Path', det: 'Host', spotted: 'Seen in the mists' }, if: { army: 'Chapter rule', det: 'Siege doctrine', spotted: 'Sighted on the walls' }, ork: { army: 'Waaagh!', det: 'Da plan', spotted: 'Boyz spotted' }, custodes: { army: 'Martial Ka\'tah', det: 'Shield Host', spotted: 'Custodians sighted' }, guard: { army: 'Standing orders', det: 'Battle plan', spotted: 'Guardsmen sighted' } };
  function renderFoeView() {
    const F = foe(), fi = factionInfo(F.faction), B = S.battle; const W = FOE_WORDS[fi.theme] || { army: 'Army rule', det: 'Detachment', spotted: 'Spotted so far' };
    const fd = FD(F.faction); const isNec = !!fd;
    const spotted = B.spotted.map((s, i) => {
      const d = isNec ? foeUnits(F.faction)[s.name] : null;
      const p = d && d.m[0];
      return `<div class="strat foe" style="cursor: default"><button data-act="spot" data-k="${i}" style="border: 0; background: transparent; color: var(--text); text-align: left; padding: 0; flex: 1; min-width: 0; min-height: 44px"><span class="nm">${esc(s.name)}</span><br><span class="ds">${p ? `T${esc(p.T)} · Sv ${esc(p.Sv)}${p.InSv ? ' · ' + esc(p.InSv) + ' inv' : ''} · W${esc(p.W)} · OC${esc(p.OC)}` : 'Spotted'}</span></button>
        <span class="row" style="gap: 0"><button class="icon-btn" data-act="spotN" data-k="${i}" data-d="-1" aria-label="One fewer model">−</button><b class="tnum" style="min-width: 22px; text-align: center">${s.n}</b><button class="icon-btn" data-act="spotN" data-k="${i}" data-d="1" aria-label="One more model">+</button></span></div>`;
    }).join('');
    const army = isNec ? fd.army_rules.filter(Boolean).map((r) => `<details class="foe-panel" style="padding: 10px 12px"><summary style="cursor: pointer; min-height: 32px"><span class="eyebrow foe-ink">${esc(W.army)}</span><br><b>${esc(r.name)}</b></summary><div class="small" style="white-space: pre-line; padding-top: 6px">${esc(r.text)}</div></details>`).join('') : '';
    const dets = isNec ? fd.detachments.filter((d) => F.detachments.includes(d.name)).map((d) => `<details class="foe-panel" style="padding: 10px 12px" open><summary style="cursor: pointer; min-height: 32px"><span class="eyebrow foe-ink">${esc(W.det)} · ${esc(d.name)}</span></summary><div class="small" style="white-space: pre-line; padding-top: 4px">${esc(d.rule)}</div></details>`).join('') : `<p class="small muted" style="margin: 0">Full ${esc(fi.display)} rules are not in the app yet.</p>`;
    const sigSrc = (() => { const alias = Object.values(ARMY).find((x) => x.lib === F.faction && x.libRe); const it = poolItem(F.emblemId) || POOL.find((x) => !/^(bg|fleet)-/i.test(x.name) && (nameMatches(fileKey(x.name), F.faction) || (alias && alias.libRe.test(fileKey(x.name))))); return it ? it.src : ''; })();
    return `<div class="foe-fill foe-head" style="padding: 12px 14px">${sigSrc ? `<img class="foe-sigil" src="${sigSrc}" alt="">` : ''}<div class="eyebrow" style="color: inherit">${esc(A().foeQ)}${F.name ? ' · ' + esc(F.name) : ''}</div><div style="font-family: var(--foe-font); font-size: 28px; font-weight: 700; line-height: 1">${esc(fi.display)}</div><div class="small" style="font-weight: 600">${esc(F.detachments.join(', ') || 'Detachment not set')}${F.warlord ? ' · Warlord: ' + esc(F.warlord) : ''} · ${B.cp.foe} CP</div></div>
      ${F.notes ? `<div class="foe-panel" style="padding: 10px 12px"><span class="eyebrow foe-ink">Your notes</span><div class="small" style="font-style: italic">${esc(F.notes)}</div></div>` : ''}
      ${army}${dets}
      ${F.warlord && isNec && foeUnits(F.faction)[F.warlord] ? `<details class="foe-panel" style="padding: 10px 12px"><summary style="cursor: pointer; min-height: 32px"><span class="eyebrow foe-ink">Warlord</span><br><b>${esc(F.warlord)}</b></summary><div style="padding-top: 6px">${warlordCard(F.faction, F.warlord, true)}</div></details>` : ''}
      ${(B.foeUnits || []).length ? `<section class="stack" style="gap: 6px"><span class="eyebrow foe-ink">Their army · live from their phone</span>
        ${B.foeUnits.map((u) => { const al = u.models.filter((m) => m.wl > 0).length; const w = u.models.reduce((t, m) => t + m.wl, 0), W = u.models.reduce((t, m) => t + m.W, 0);
          return `<div class="strat foe" style="cursor: default; ${al ? '' : 'opacity: 0.45'}"><span style="min-width: 0; flex: 1"><span class="nm">${esc(u.name)}${u.warlord ? ' · Warlord' : ''}</span><br><span class="ds">${al ? al + ' of ' + u.models.length + ' models · ' + w + ' of ' + W + ' wounds' : 'Destroyed'}</span></span></div>`; }).join('')}</section>` : ''}
      <section class="stack" style="gap: 6px" ${(B.foeUnits || []).length ? 'hidden' : ''}><div class="row" style="justify-content: space-between"><span class="eyebrow foe-ink">${esc(W.spotted)}</span>${isNec ? `<button class="btn small" data-act="addSpot" style="border-color: var(--foe-line)">+ ADD UNIT</button>` : ''}</div>${spotted || '<p class="small muted" style="margin: 0">Add their units as you see them. The maths uses their real stats.</p>'}</section>
      <button class="btn block" data-act="openFoeDetail" style="border-color: var(--foe-line)">Edit foe details</button>`;
  }
  function renderLog() {
    const B = S.battle, a = A();
    const items = B.log.slice().reverse().map((e) => `<div class="logitem ${e.kind === 'vox' ? 'vox' : ''}"><span class="when tnum">R${e.r} · ${e.turn === 'me' ? 'You' : 'Them'}<br>${esc(e.phase)}</span><span style="min-width: 0; flex: 1">${e.kind === 'vox' ? `<b style="color: var(--gold)">${esc(a.vox)}</b> ` : ''}${esc(e.text)}${e.kind === 'vox' ? `<br>${e.note ? `<span class="small">${esc(e.note)}</span>` : `<button class="btn small gold" data-act="voxNote" data-k="${e.id}" style="margin-top: 4px">ADD NOTE</button>`}` : ''}</span></div>`).join('');
    return `<div class="row"><label class="field" style="flex: 1"><span class="eyebrow">Add to the log</span><input type="text" id="log-in" placeholder="Their Wraiths charged my Intercessors…" autocomplete="off"></label><button class="btn solid" data-act="logAdd" style="align-self: flex-end">LOG</button></div>
      <div class="panel" style="padding: 0">${items}</div>
      <button class="btn red block" data-act="endBattle">${esc(a.end.toUpperCase())}</button>`;
  }

  // ---------- emblem ----------
  function pct(x, y, w, h) { return `left: ${(x / 390) * 100}%; top: ${((y - 30) / 780) * 100}%; width: ${(w / 390) * 100}%; height: ${(h / 780) * 100}%`; }
  const CROSS = 'M20 48 L70 60.6 L78 72 L88 65.2 L195 92 L370 48 L334 155.6 L316 166 L326 179.6 L270 347 L384 258 L354 422 L384 560 L373 571 L381 586 L270 497 L370 796 L195 752 L20 796 L65 661 L86 648 L75 631 L120 497 L72 534.4 L60 530 L54 548.6 L6 586 L36 422 L6 258 L120 347 Z';
  function renderEmblem() {
    const B = S.battle, a = A();
    const units = B.units, standing = units.filter((u) => alive(u) > 0).length;
    const key = factionInfo(foe().faction).theme; const t = FOE_THEMES[key] || FOE_THEMES.loyal;
    document.body.dataset.foe = key; // the opponent's texture pack (panels, bars, living detail)
    const grad = `<linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t[0]}"><animate attributeName="stop-color" values="${t[0]};${t[2]};${t[0]}" dur="9s" repeatCount="indefinite"></animate></stop><stop offset="0.5" stop-color="${t[1]}"><animate attributeName="stop-color" values="${t[1]};${t[3]};${t[1]}" dur="9s" repeatCount="indefinite"></animate></stop><stop offset="1" stop-color="${t[2]}"><animate attributeName="stop-color" values="${t[2]};${t[0]};${t[2]}" dur="9s" repeatCount="indefinite"></animate></stop></linearGradient>`;
    const last = B.log.slice(-3).reverse().map((e) => `<span class="small" style="opacity: 0.85; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%">R${e.r} ${esc(e.phase)} · ${esc(e.text)}</span>`).join('');
    const status = `<span class="eyebrow">Round ${roman(B.round)} · ${B.turn === 'me' ? 'Your turn' : 'Their turn'}</span><span class="qt" style="font-size: calc(34px * var(--head-size))">${PHASES[B.phase]}</span>
      <span class="tnum" style="font-size: 18px; font-weight: 700">CP ${B.cp.me}<span class="foe-ink">|${B.cp.foe}</span> · VP ${B.vp.me}<span class="foe-ink">|${B.vp.foe}</span></span><span class="small" style="color: var(--accent-text); font-weight: 600">${esc(a.oath)}: ${esc(a.oathText)}</span>`;
    const armyQ = `<span class="qt" style="font-size: calc(19px * var(--head-size))">${esc(a.armyQ)}</span><span class="small" style="font-weight: 700">${standing} of ${units.length}</span>`;
    const foeQ = `<span class="qt" style="font-size: calc(19px * var(--head-size)); color: ${t[4]}">${esc(a.foeQ)}</span><span class="small" style="font-weight: 700; color: ${t[4]}">${B.spotted.length} seen<br>${B.cp.foe} CP</span>`;
    if (a.emblem === 'hall') {
      // the command hall: the aquila window is the Round, the gantry the Lord General, the two blast doors your regiment and the enemy,
      // the hololith table in the middle the battle's numbers, and the War Diary along the floor
      const sp = (x, y, w, h) => `left: ${(x / 3.9).toFixed(2)}%; top: ${(y / 4.56).toFixed(2)}%; width: ${(w / 3.9).toFixed(2)}%; height: ${(h / 4.56).toFixed(2)}%`;
      const lastS = B.log.slice(-2).reverse().map((e) => `<span class="jw-line">R${e.r} ${esc(e.phase)} · ${esc(e.text)}</span>`).join('');
      const plate = (x, y, w, h, act, k, top, sub, foeTint) => `<button class="q cu-door ${foeTint ? 'cu-foe' : ''}" style="${sp(x, y, w, h)}" data-act="${act}" data-k="${k}" aria-label="${esc(top)}"><span class="cu-plq"><span class="cu-t">${esc(top)}</span>${sub ? `<span class="cu-s">${sub}</span>` : ''}</span></button>`;
      return `<div class="emblem spires am-hall"><img class="cu-art" src="lib/pmwam_hall.webp" alt="">
        <span class="am-skull" aria-hidden="true"></span>
        <button class="q cu-core" style="${sp(100, 236, 190, 74)}" data-act="view" data-k="counsel"><span class="eyebrow">Round ${roman(B.round)} · ${B.turn === 'me' ? 'Your turn' : 'Their turn'}</span><span class="qt">${PHASES[B.phase]}</span><span class="tnum">CP ${B.cp.me}<span class="foe-ink">|${B.cp.foe}</span> · VP ${B.vp.me}<span class="foe-ink">|${B.vp.foe}</span></span></button>
        ${plate(140, 64, 110, 64, 'round', String(B.round), 'Round ' + roman(B.round), 'score')}
        ${plate(150, 150, 120, 60, 'view', 'counsel', 'Lord General', 'counsel')}
        ${plate(14, 300, 124, 70, 'view', 'army', amReg()[2], `${units.filter((u) => alive(u) > 0).length}/${units.length}`)}
        ${plate(252, 300, 124, 70, 'view', 'foe', 'The Enemy', `${B.cp.foe} CP`, true)}
        <button class="q cu-log" style="${sp(16, 384, 358, 66)}" data-act="view" data-k="log"><span class="eyebrow">${esc(a.log)}</span>${lastS}</button></div>`;
    }
    if (a.emblem === 'spires') {
      // the spires of the Imperial Palace: the golden tower is the Round, the balcony of Custodians your Shield Host,
      // the great lions the Captain-General and the Threat, the gothic wall below the battle's numbers and the Annals
      const img = (n) => (POOL.find((x) => x.name === n) || {}).src || '';
      const sp = (x, y, w, h) => `left: ${(x / 3.9).toFixed(2)}%; top: ${(y / 4.56).toFixed(2)}%; width: ${(w / 3.9).toFixed(2)}%; height: ${(h / 4.56).toFixed(2)}%`;
      const lastS = B.log.slice(-2).reverse().map((e) => `<span class="jw-line">R${e.r} ${esc(e.phase)} · ${esc(e.text)}</span>`).join('');
      const plate = (x, y, w, h, act, k, top, sub, foeTint) => `<button class="q cu-door ${foeTint ? 'cu-foe' : ''}" style="${sp(x, y, w, h)}" data-act="${act}" data-k="${k}" aria-label="${esc(top)}"><span class="cu-plq"><span class="cu-t">${esc(top)}</span>${sub ? `<span class="cu-s">${sub}</span>` : ''}</span></button>`;
      return `<div class="emblem spires"><img class="cu-art" src="${img('custodes-spires')}" alt="">
        <svg viewBox="0 0 390 456" aria-hidden="true" class="ch-ov"><defs>${grad}</defs><path d="M190 140 H272 V208 H190 Z" fill="url(#fg)" opacity="0.4" style="mix-blend-mode: color"></path></svg>
        <span class="cu-glint" aria-hidden="true"></span>
        <button class="q cu-core" style="${sp(140, 300, 170, 76)}" data-act="view" data-k="counsel"><span class="eyebrow">Round ${roman(B.round)} · ${B.turn === 'me' ? 'Your turn' : 'Their turn'}</span><span class="qt">${PHASES[B.phase]}</span><span class="tnum">CP ${B.cp.me}<span class="foe-ink">|${B.cp.foe}</span> · VP ${B.vp.me}<span class="foe-ink">|${B.vp.foe}</span></span></button>
        ${plate(40, 120, 84, 74, 'round', String(B.round), 'Round ' + roman(B.round), 'score')}
        ${plate(84, 214, 104, 68, 'view', 'army', 'Shield Host', `${units.filter((u) => alive(u) > 0).length}/${units.length}`)}
        ${plate(190, 140, 82, 68, 'view', 'foe', a.foeQ.replace('The ', ''), `${B.cp.foe} CP`, true)}
        ${plate(282, 100, 92, 78, 'view', 'counsel', 'Captain-General', 'counsel')}
        <button class="q cu-log" style="${sp(16, 384, 358, 66)}" data-act="view" data-k="log"><span class="eyebrow">${esc(a.log)}</span>${lastS}</button></div>`;
    }
    if (a.emblem === 'rok') {
      // da Rok comin' down: the falling asteroid holds the fight's numbers, its burning hatches are the Boyz and the Round,
      // the incoming meteor is Da Gitz, the Nob's glyph banner is Da Warboss, and Da Tally is scratched across the battlefield
      const img = (n) => (POOL.find((x) => x.name === n) || {}).src || '';
      const rp = (x, y, w, h) => `left: ${(x / 3.9).toFixed(2)}%; top: ${(y / 5.6).toFixed(2)}%; width: ${(w / 3.9).toFixed(2)}%; height: ${(h / 5.6).toFixed(2)}%`;
      const lastR = B.log.slice(-2).reverse().map((e) => `<span class="jw-line">R${e.r} ${esc(e.phase)} · ${esc(e.text)}</span>`).join('');
      const sign = (x, y, w, h, act, k, top, sub, foeTint) => `<button class="q rk-sign ${foeTint ? 'rk-foe' : ''}" style="${rp(x, y, w, h)}" data-act="${act}" data-k="${k}" aria-label="${esc(top)}"><span class="rk-plq"><span class="rk-t">${esc(top)}</span>${sub ? `<span class="rk-s">${sub}</span>` : ''}</span></button>`;
      return `<div class="emblem rok"><img class="rk-art" src="${img('orks-rok-battle')}" alt="">
        <svg viewBox="0 0 390 560" aria-hidden="true" class="ch-ov"><defs>${grad}</defs><path d="M6 34 H118 V126 H6 Z" fill="url(#fg)" opacity="0.4" style="mix-blend-mode: color"></path></svg>
        <button class="q rk-core" style="${rp(100, 160, 170, 92)}" data-act="view" data-k="counsel"><span class="eyebrow">Round ${roman(B.round)} · ${B.turn === 'me' ? 'Yer turn' : 'Their turn'}</span><span class="qt">${PHASES[B.phase]}</span><span class="tnum">CP ${B.cp.me}<span class="foe-ink">|${B.cp.foe}</span> · VP ${B.vp.me}<span class="foe-ink">|${B.vp.foe}</span></span></button>
        ${sign(6, 34, 112, 92, 'view', 'foe', a.foeQ, `${B.cp.foe} CP`, true)}
        ${sign(22, 300, 100, 80, 'view', 'army', a.armyQ, `${units.filter((u) => alive(u) > 0).length}/${units.length} standin'`)}
        ${sign(148, 300, 92, 76, 'round', String(B.round), 'Round ' + roman(B.round), 'score')}
        ${sign(252, 296, 92, 78, 'view', 'counsel', a.counsel, 'wot now?')}
        <button class="q rk-log" style="${rp(8, 462, 214, 90)}" data-act="view" data-k="log"><span class="eyebrow">${esc(a.log)}</span>${lastR}</button></div>`;
    }
    if (a.emblem === 'phalanx') {
      // the great hall of the Phalanx: the arches are the screen's doors, the aquila above holds the Strategium's counsel
      const img = (n) => (POOL.find((x) => x.name === n) || {}).src || '';
      const hp = (x, y, w, h) => `left: ${(x / 3.9).toFixed(2)}%; top: ${(y / 5.81).toFixed(2)}%; width: ${(w / 3.9).toFixed(2)}%; height: ${(h / 5.81).toFixed(2)}%`;
      const lastP = B.log.slice(-2).reverse().map((e) => `<span class="jw-line">R${e.r} ${esc(e.phase)} · ${esc(e.text)}</span>`).join('');
      const door = (x, y, w, h, act, k, top, sub, foeTint) => `<button class="q ph-door ${foeTint ? 'ph-foe' : ''}" style="${hp(x, y, w, h)}" data-act="${act}" data-k="${k}" aria-label="${esc(top)}"><span class="ph-plq"><span class="ph-t">${esc(top)}</span>${sub ? `<span class="ph-s">${sub}</span>` : ''}</span></button>`;
      return `<div class="emblem phalanx"><img class="ph-art" src="${img('if-phalanx-hall')}" alt="">
        <svg viewBox="0 0 390 581" aria-hidden="true" class="ch-ov"><defs>${grad}</defs><path d="M304 280 H384 V404 H304 Z" fill="url(#fg)" opacity="0.45" style="mix-blend-mode: color"></path></svg>
        <span class="ph-glow" aria-hidden="true"></span>
        <button class="q ph-eagle" style="${hp(206, 58, 96, 78)}" data-act="view" data-k="counsel" aria-label="${esc(a.counsel)}"><span class="eyebrow">${esc(a.counsel)}</span></button>
        <button class="q ph-core" style="${hp(166, 258, 126, 88)}" data-act="view" data-k="counsel"><span class="eyebrow">Round ${roman(B.round)} · ${B.turn === 'me' ? 'Your turn' : 'Their turn'}</span><span class="qt">${PHASES[B.phase]}</span><span class="tnum">CP ${B.cp.me}<span class="foe-ink">|${B.cp.foe}</span> · VP ${B.vp.me}<span class="foe-ink">|${B.vp.foe}</span></span></button>
        ${door(46, 282, 82, 122, 'view', 'army', a.armyQ.replace('The ', ''), `${units.filter((u) => alive(u) > 0).length}/${units.length}`)}
        ${door(190, 356, 78, 62, 'round', String(B.round), 'Round ' + roman(B.round), 'score')}
        ${door(304, 282, 80, 122, 'view', 'foe', a.foeQ.replace('The ', ''), `${B.cp.foe} CP`, true)}
        <button class="q ph-log" style="${hp(24, 498, 342, 76)}" data-act="view" data-k="log"><span class="eyebrow">${esc(a.log)}</span>${lastP}</button></div>`;
    }
    if (a.emblem === 'vault') {
      // the Omega Vault of the Watch Fortress: the sealed door is the screen; its omega seal is the Inquisitor's counsel
      const img = (n) => (POOL.find((x) => x.name === n) || {}).src || '';
      const vp = (x, y, w, h) => `left: ${(x / 3.9).toFixed(2)}%; top: ${(y / 6.15).toFixed(2)}%; width: ${(w / 3.9).toFixed(2)}%; height: ${(h / 6.15).toFixed(2)}%`;
      const lastV = B.log.slice(-2).reverse().map((e) => `<span class="jw-line">R${e.r} ${esc(e.phase)} · ${esc(e.text)}</span>`).join('');
      return `<div class="emblem vault"><img class="vt-art" src="${img('deathwatch-omega-vault')}" alt="">
        <svg viewBox="0 0 390 615" aria-hidden="true" class="ch-ov"><defs>${grad}</defs><path d="M200 330 H268 V470 H200 Z" fill="url(#fg)" opacity="0.5" style="mix-blend-mode: color"></path><circle cx="194" cy="281" r="50" fill="none" stroke="#D6DEE4" stroke-width="1.5" opacity="0.6" class="vt-seal"></circle></svg>
        <button class="q vt-plq" style="${vp(70, 70, 250, 112)}" data-act="view" data-k="counsel"><span class="eyebrow">Round ${roman(B.round)} · ${B.turn === 'me' ? 'Your turn' : 'Their turn'}</span><span class="qt">${PHASES[B.phase]}</span><span class="tnum">CP ${B.cp.me}<span class="foe-ink">|${B.cp.foe}</span> · VP ${B.vp.me}<span class="foe-ink">|${B.vp.foe}</span></span></button>
        <button class="q vt-seal-btn" style="${vp(144, 231, 100, 100)}" data-act="view" data-k="counsel" aria-label="${esc(a.counsel)}"><span class="eyebrow" style="font-size: 7px">${esc(a.counsel)}</span><span class="qt" style="font-size: 12px">Options<br>now</span></button>
        <button class="q vt-plq" style="${vp(112, 350, 82, 92)}" data-act="view" data-k="army">${armyQ}</button>
        <button class="q vt-plq" style="${vp(200, 350, 82, 92)}" data-act="view" data-k="foe">${foeQ.split(t[4]).join(t[5])}</button>
        <button class="q vt-log" style="${vp(36, 470, 318, 120)}" data-act="view" data-k="log"><span class="eyebrow">${esc(a.log)}</span>${lastV}</button></div>`;
    }
    if (a.emblem === 'chapel') {
      // aboard the Eternal Crusader: the chapel's great window (Sigismund against Abaddon) is the heart of the screen;
      // the four lesser windows are buttons; candles, censers and incense from the chapel itself spill out past the frame
      const img = (n) => (POOL.find((x) => x.name === n) || {}).src || '';
      const cp = (x, y, w, h) => `left: ${(x / 3.9).toFixed(2)}%; top: ${(y / 5.26).toFixed(2)}%; width: ${(w / 3.9).toFixed(2)}%; height: ${(h / 5.26).toFixed(2)}%`;
      const lastC = B.log.slice(-2).reverse().map((e) => `<span class="jw-line">R${e.r} ${esc(e.phase)} · ${esc(e.text)}</span>`).join('');
      const win = (x, y, w, h, act, k, top, sub, foeTint) => `<button class="q ch-win ${foeTint ? 'ch-foe' : ''}" style="${cp(x, y, w, h)}" data-act="${act}" data-k="${k}" aria-label="${esc(top)}"><span class="ch-plq"><span class="ch-t">${esc(top)}</span>${sub ? `<span class="ch-s">${sub}</span>` : ''}</span></button>`;
      return `<div class="emblem chapel"><img class="ch-art" src="${img('tmpl-chapel-emblem')}" alt="">
        <svg viewBox="0 0 390 526" aria-hidden="true" class="ch-ov"><defs>${grad}</defs><path d="M342 145 H381 V279 H342 Z" fill="url(#fg)" opacity="0.55" style="mix-blend-mode: color"></path></svg>
        <span class="ch-censer l"><img src="${img('tmpl-censer')}" alt=""></span><span class="ch-censer r"><img src="${img('tmpl-censer')}" alt=""></span>
        <span class="ch-smoke l"></span><span class="ch-smoke r"></span>
        <span class="ch-candles l"><img src="${img('tmpl-candles-left')}" alt=""></span><span class="ch-candles r"><img src="${img('tmpl-candles-right')}" alt=""></span>
        <button class="q ch-core" style="${cp(132, 226, 145, 66)}" data-act="view" data-k="counsel"><span class="eyebrow">Round ${roman(B.round)} · ${B.turn === 'me' ? 'Your turn' : 'Their turn'}</span><span class="qt">${PHASES[B.phase]}</span><span class="tnum">CP ${B.cp.me}<span class="foe-ink">|${B.cp.foe}</span> · VP ${B.vp.me}<span class="foe-ink">|${B.vp.foe}</span></span></button>
        ${win(9, 145, 42, 134, 'view', 'army', a.armyQ.replace('My ', ''), `${units.filter((u) => alive(u) > 0).length}/${units.length}`)}
        ${win(61, 108, 43, 171, 'view', 'counsel', a.counsel, 'now')}
        ${win(288, 108, 41, 171, 'round', String(B.round), 'Round ' + roman(B.round), 'score')}
        ${win(340, 145, 41, 134, 'view', 'foe', 'Foe', `${B.cp.foe} CP`, true)}
        <button class="q ch-log" style="${cp(46, 410, 298, 104)}" data-act="view" data-k="log"><span class="eyebrow">${esc(a.log)}</span>${lastC}</button></div>`;
    }
    if (a.emblem === 'cross') {
      return `<div class="emblem"><svg viewBox="0 30 390 780" aria-hidden="true"><defs>${grad}<filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="7" result="n"></feTurbulence><feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap></filter></defs>
        <path d="${CROSS}" fill="#141110" stroke="#DCD2BC" stroke-width="7" filter="url(#rough)" style="filter: drop-shadow(0 0 14px rgba(158,27,27,0.5))"></path>
        <path d="M276 355 L377 266 L348 422 L377 557 L368 566 L374 578 L276 489 Z" fill="url(#fg)"></path>
        <path d="M316 166 L298 196 L304 222 L289 251 M86 648 L112 642 L121 664 L146 668" fill="none" stroke="#050404" stroke-width="2.4"></path>
        <rect x="120" y="347" width="150" height="150" fill="#0E0C0B" stroke="#6B5B45" stroke-width="2"></rect><rect x="126" y="353" width="138" height="138" fill="none" stroke="#9E1B1B"></rect></svg>
        <button class="q" style="${pct(40, 100, 310, 200)}" data-act="view" data-k="counsel" aria-label="Open ${esc(a.counsel)}">${status}</button>
        <button class="q" style="${pct(36, 300, 84, 244)}; padding-left: 4px" data-act="view" data-k="army" aria-label="Open ${esc(a.armyQ)}">${armyQ}</button>
        <button class="q" style="${pct(276, 300, 72, 244)}" data-act="view" data-k="foe" aria-label="Open ${esc(a.foeQ)}">${foeQ}</button>
        <button class="q" style="${pct(120, 347, 150, 150)}" data-act="view" data-k="counsel"><span class="eyebrow">${esc(a.counsel)}</span><span class="qt" style="font-size: 20px">Options now</span></button>
        <button class="q" style="${pct(60, 560, 270, 170)}; justify-content: flex-end" data-act="view" data-k="log"><span class="eyebrow">${esc(a.log)}</span>${last}</button></div>`;
    }
    if (a.emblem === 'stone') {
      // a spirit stone: a soul glowing inside a teardrop gem, held in a wraithbone setting
      const jp = (x, y, w, h) => `left: ${(x / 3.9).toFixed(2)}%; top: ${(y / 5.6).toFixed(2)}%; width: ${(w / 3.9).toFixed(2)}%; height: ${(h / 5.6).toFixed(2)}%`;
      const lastS = B.log.slice(-2).reverse().map((e) => `<span class="jw-line">R${e.r} ${esc(e.phase)} · ${esc(e.text)}</span>`).join('');
      const statusS = `<span class="eyebrow" style="font-size: clamp(8px, 2.6cqw, 11px)">Round ${roman(B.round)} · ${B.turn === 'me' ? 'Your turn' : 'Their turn'}</span><span class="qt" style="font-size: clamp(16px, 5.6cqw, 24px)">${PHASES[B.phase]}</span>
        <span class="tnum" style="font-size: clamp(12px, 4cqw, 16px); font-weight: 700">CP ${B.cp.me}<span class="foe-ink">|${B.cp.foe}</span> · VP ${B.vp.me}<span class="foe-ink">|${B.vp.foe}</span></span>`;
      const O = 'M195 8 C 288 118 382 236 382 366 A187 187 0 0 1 8 366 C 8 236 102 118 195 8 Z', I = 'M195 44 C 274 144 352 250 352 366 A157 157 0 0 1 38 366 C 38 250 116 144 195 44 Z';
      const img = (n) => (POOL.find((x) => x.name === n) || {}).src || '';
      return `<div class="emblem jaws stone"><svg viewBox="0 0 390 560" aria-hidden="true"><defs>${grad}
        <radialGradient id="sv" cx="0.5" cy="0.62" r="0.6"><stop offset="0.3" stop-color="#03141A" stop-opacity="0.15"></stop><stop offset="1" stop-color="#03141A" stop-opacity="0.85"></stop></radialGradient>
        <linearGradient id="sh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8FBFF" stop-opacity="0.22"></stop><stop offset="0.35" stop-color="#E8FBFF" stop-opacity="0"></stop></linearGradient>
        <filter id="wb" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.02 0.05" numOctaves="4" seed="31" result="n"></feTurbulence><feDiffuseLighting in="n" surfaceScale="2.5" lighting-color="#E6DCC2" result="l"><feDistantLight azimuth="230" elevation="45"></feDistantLight></feDiffuseLighting><feComposite in="l" in2="SourceGraphic" operator="in"></feComposite></filter>
        <filter id="glo"><feGaussianBlur stdDeviation="4" result="b"></feGaussianBlur><feMerge><feMergeNode in="b"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter>
        <clipPath id="si"><path d="${I}"></path></clipPath></defs>
        <g clip-path="url(#si)"><rect width="390" height="560" fill="#03141A"></rect><image href="${img('aeldari-soul')}" x="20" y="40" width="350" height="500" preserveAspectRatio="xMidYMid slice" style="filter: brightness(0.7) saturate(0.9)"></image>
          <rect width="390" height="560" fill="#0A6A78" opacity="0.28" style="mix-blend-mode: color"></rect><rect width="390" height="560" fill="url(#sv)"></rect>
          <path d="M195 300 H352 V392 H195 Z" fill="url(#fg)" opacity="0.5" style="mix-blend-mode: color"></path><path d="M195 300 H352 V392 H195 Z" fill="url(#fg)" opacity="0.14"></path>
          <rect width="390" height="560" fill="url(#sh)"></rect><ellipse cx="195" cy="380" rx="120" ry="130" fill="#8FF2FF" fill-opacity="0.07" class="as-soul"></ellipse></g>
        <path d="M195 300 V392 M38 300 H352 M38 392 H352" stroke="#CFC4A6" stroke-width="1.4" opacity="0.4"></path>
        <path d="${O} ${I}" fill="#fff" fill-rule="evenodd" filter="url(#wb)"></path><path d="${O} ${I}" fill="#2A2418" fill-rule="evenodd" opacity="0.62"></path>
        <path d="${I}" fill="none" stroke="#8FF2FF" stroke-width="1.6" opacity="0.7" filter="url(#glo)" class="as-soul"></path><path d="${O}" fill="none" stroke="#0C0A06" stroke-width="2"></path>
        <circle cx="195" cy="168" r="38" fill="#03141A" fill-opacity="0.6" stroke="#CFC4A6" stroke-width="2" opacity="0.9"></circle></svg>
        <button class="q jw" style="${jp(161, 134, 68, 68)}; border-radius: 50%" data-act="view" data-k="counsel"><span class="eyebrow" style="font-size: 7px">${esc(a.counsel)}</span><span class="qt" style="font-size: 12px; line-height: 1.1">Options<br>now</span></button>
        <button class="q jw" style="${jp(84, 210, 222, 86)}" data-act="view" data-k="counsel">${statusS}</button>
        <button class="q jw" style="${jp(50, 302, 140, 88)}" data-act="view" data-k="army">${armyQ}</button>
        <button class="q jw" style="${jp(200, 302, 140, 88)}; text-shadow: none" data-act="view" data-k="foe">${foeQ.split(t[4]).join(t[5])}</button>
        <button class="q jw jw-wake" style="${jp(70, 398, 250, 112)}" data-act="view" data-k="log"><span class="eyebrow">${esc(a.log)}</span>${lastS}</button></div>`;
    }
    if (a.emblem === 'monolith') {
      // the monolith: a tapering slab of black necrodermis carved with glyphs, the tomb city glowing through it, the beam's crystal above
      const jp = (x, y, w, h) => `left: ${(x / 3.9).toFixed(2)}%; top: ${(y / 5.6).toFixed(2)}%; width: ${(w / 3.9).toFixed(2)}%; height: ${(h / 5.6).toFixed(2)}%`;
      const lastM = B.log.slice(-2).reverse().map((e) => `<span class="jw-line">R${e.r} ${esc(e.phase)} · ${esc(e.text)}</span>`).join('');
      const statusM = `<span class="eyebrow" style="font-size: clamp(8px, 2.6cqw, 11px)">Round ${roman(B.round)} · ${B.turn === 'me' ? 'Your turn' : 'Their turn'}</span><span class="qt" style="font-size: clamp(16px, 5.6cqw, 24px)">${PHASES[B.phase]}</span>
        <span class="tnum" style="font-size: clamp(12px, 4cqw, 16px); font-weight: 700">CP ${B.cp.me}<span class="foe-ink">|${B.cp.foe}</span> · VP ${B.vp.me}<span class="foe-ink">|${B.vp.foe}</span></span>`;
      const O = 'M8 556 L98 22 L292 22 L382 556 Z', I = 'M40 530 L120 50 L270 50 L350 530 Z';
      const img = (n) => (POOL.find((x) => x.name === n) || {}).src || '';
      return hueShift(`<div class="emblem jaws monolith"><svg viewBox="0 0 390 560" aria-hidden="true"><defs>__GRAD__
        <radialGradient id="mv" cx="0.5" cy="0.35" r="0.75"><stop offset="0.25" stop-color="#05030A" stop-opacity="0.2"></stop><stop offset="1" stop-color="#05030A" stop-opacity="0.85"></stop></radialGradient>
        <filter id="carve" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.05 0.07" numOctaves="5" seed="21" result="n"></feTurbulence><feDiffuseLighting in="n" surfaceScale="3.5" lighting-color="#7A707A" result="l"><feDistantLight azimuth="225" elevation="40"></feDistantLight></feDiffuseLighting><feComposite in="l" in2="SourceGraphic" operator="in"></feComposite></filter>
        <filter id="glo"><feGaussianBlur stdDeviation="3" result="b"></feGaussianBlur><feMerge><feMergeNode in="b"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter>
        <clipPath id="mi"><path d="${I}"></path></clipPath></defs>
        <g clip-path="url(#mi)"><rect width="390" height="560" fill="#05030A"></rect><image href="${img('necrons-tomb-city')}" x="0" y="0" width="390" height="560" preserveAspectRatio="xMidYMin slice" class="nec-art"></image>
          <rect width="390" height="560" fill="url(#mv)"></rect><path d="M195 268 H350 V368 H195 Z" fill="url(#fg)" opacity="0.5" style="mix-blend-mode: color"></path><path d="M195 268 H350 V368 H195 Z" fill="url(#fg)" opacity="0.14"></path></g>
        <path d="M195 268 V368 M66 268 H324 M58 368 H332" stroke="#120D14" stroke-width="7"></path><path d="M195 268 V368 M66 268 H324 M58 368 H332" stroke="#FF4F9C" stroke-width="1" opacity="0.55" filter="url(#glo)"></path>
        <path d="${O} ${I}" fill="#fff" fill-rule="evenodd" filter="url(#carve)"></path><path d="${O} ${I}" fill="#0C0A0E" fill-rule="evenodd" opacity="0.8"></path><path d="${O} ${I}" fill="none" stroke="#020103" stroke-width="2"></path>
        <path d="${I}" fill="none" stroke="#FF4F9C" stroke-width="1.6" opacity="0.7" filter="url(#glo)" class="nec-edge"></path>
        <g fill="none" stroke="#FF6FAE" stroke-width="1.3" stroke-linecap="round" opacity="0.55" filter="url(#glo)">${[120, 190, 260, 330, 400, 470].map((y, k) => { const xl = 24 + (y - 22) * 0.165, xr = 366 - (y - 22) * 0.165; const g = (x) => [`<circle cx="${x}" cy="${y - 4}" r="4"></circle><path d="M${x} ${y} V${y + 10} M${x - 3} ${y + 10} H${x + 3}"></path>`, `<path d="M${x - 4} ${y - 6} L${x} ${y - 2} L${x + 4} ${y - 6} M${x} ${y - 2} V${y + 10}"></path>`, `<path d="M${x - 4} ${y} A4 4 0 0 1 ${x + 4} ${y} M${x} ${y - 8} V${y + 10}"></path>`][k % 3]; return g(xl) + g(xr); }).join('')}</g>
        <circle cx="195" cy="118" r="40" fill="#0C0A0E" fill-opacity="0.6" stroke="#120D14" stroke-width="8"></circle><circle cx="195" cy="118" r="40" fill="none" stroke="#FF4F9C" stroke-width="1.4" opacity="0.8" filter="url(#glo)" class="nec-edge"></circle></svg>
        <button class="q jw" style="${jp(159, 82, 72, 72)}; border-radius: 50%" data-act="view" data-k="counsel"><span class="eyebrow" style="font-size: 7px">${esc(a.counsel)}</span><span class="qt" style="font-size: 12px; line-height: 1.1">Options<br>now</span></button>
        <button class="q jw" style="${jp(96, 168, 198, 90)}" data-act="view" data-k="counsel">${statusM}</button>
        <button class="q jw" style="${jp(70, 276, 120, 86)}" data-act="view" data-k="army">${armyQ}</button>
        <button class="q jw" style="${jp(200, 276, 120, 86)}; text-shadow: none" data-act="view" data-k="foe">__FOEQ__</button>
        <button class="q jw jw-wake" style="${jp(66, 378, 258, 140)}" data-act="view" data-k="log"><span class="eyebrow">${esc(a.log)}</span>${lastM}</button></div>`, necHue()).replace('__GRAD__', grad).replace('__FOEQ__', foeQ.split(t[4]).join(t[5]));
    }
    if (a.emblem === 'lancet') {
      // a lancet window of the Rock: carved dark stone, two lights divided by a mullion, a rose window above, old glass glowing with candlelight from below
      const jp = (x, y, w, h) => `left: ${(x / 3.9).toFixed(2)}%; top: ${(y / 5.6).toFixed(2)}%; width: ${(w / 3.9).toFixed(2)}%; height: ${(h / 5.6).toFixed(2)}%`;
      const lastL = B.log.slice(-2).reverse().map((e) => `<span class="jw-line">R${e.r} ${esc(e.phase)} · ${esc(e.text)}</span>`).join('');
      const statusL = `<span class="eyebrow" style="font-size: clamp(8px, 2.6cqw, 11px)">Round ${roman(B.round)} · ${B.turn === 'me' ? 'Your turn' : 'Their turn'}</span><span class="qt" style="font-size: clamp(16px, 5.6cqw, 24px)">${PHASES[B.phase]}</span>
        <span class="tnum" style="font-size: clamp(12px, 4cqw, 16px); font-weight: 700">CP ${B.cp.me}<span class="foe-ink">|${B.cp.foe}</span> · VP ${B.vp.me}<span class="foe-ink">|${B.vp.foe}</span></span>`;
      const O = 'M14 556 V236 Q14 66 195 8 Q376 66 376 236 V556 Z', I = 'M42 532 V240 Q42 92 195 38 Q348 92 348 240 V532 Z';
      return `<div class="emblem jaws lancet"><svg viewBox="0 0 390 560" aria-hidden="true"><defs>${grad}
        <linearGradient id="stn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3A4A3E"></stop><stop offset="0.5" stop-color="#1E2A22"></stop><stop offset="1" stop-color="#0C120E"></stop></linearGradient>
        <linearGradient id="bone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2D8BE"></stop><stop offset="1" stop-color="#9C907A"></stop></linearGradient>
        <radialGradient id="cdl" cx="0.5" cy="1" r="0.75"><stop offset="0" stop-color="#FFB060" stop-opacity="0.18"></stop><stop offset="1" stop-color="#FFB060" stop-opacity="0"></stop></radialGradient>
        <filter id="grit"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="5"></feTurbulence><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.9 -0.22"></feColorMatrix><feComposite in2="SourceGraphic" operator="in"></feComposite></filter>
        <radialGradient id="vig" cx="0.5" cy="0.42" r="0.7"><stop offset="0.35" stop-color="#030604" stop-opacity="0.25"></stop><stop offset="1" stop-color="#030604" stop-opacity="0.85"></stop></radialGradient><filter id="carve" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.045 0.06" numOctaves="5" seed="9" result="n"></feTurbulence><feDiffuseLighting in="n" surfaceScale="4" lighting-color="#8E9A90" result="l"><feDistantLight azimuth="235" elevation="38"></feDistantLight></feDiffuseLighting><feComposite in="l" in2="SourceGraphic" operator="in"></feComposite></filter><clipPath id="li"><path d="${I}"></path></clipPath></defs>
        <g clip-path="url(#li)"><rect width="390" height="560" fill="#050906"></rect><image href="${(POOL.find((x) => x.name === 'dark-angels-glass-3') || {}).src || ''}" x="42" y="14" width="306" height="545" preserveAspectRatio="xMidYMid slice" style="filter: saturate(0.85) brightness(0.8)"></image><rect width="390" height="560" fill="url(#vig)"></rect>
          <path d="M195 264 H348 V362 H195 Z" fill="url(#fg)" opacity="0.55" style="mix-blend-mode: color"></path><path d="M195 264 H348 V362 H195 Z" fill="url(#fg)" opacity="0.18"></path><rect width="390" height="560" fill="url(#cdl)" class="ln-candle"></rect></g>
        <path d="M195 166 V362" stroke="#1C2820" stroke-width="12"></path><path d="M195 166 V362" stroke="#BDB29A" stroke-width="1.6" opacity="0.6"></path><path d="M42 364 H348" stroke="#1C2820" stroke-width="9"></path><path d="M42 364 H348" stroke="#BDB29A" stroke-width="1.2" opacity="0.5"></path>
        <path d="M42 262 H348" stroke="#1C2820" stroke-width="9"></path><path d="M42 262 H348" stroke="#BDB29A" stroke-width="1.2" opacity="0.5"></path>
        <path d="${O} ${I}" fill="#fff" fill-rule="evenodd" filter="url(#carve)"></path><path d="${O} ${I}" fill="#0A110D" fill-rule="evenodd" opacity="0.78"></path><path d="${O} ${I}" fill="none" stroke="#020403" stroke-width="2"></path><path d="${O} ${I}" fill="#000" fill-rule="evenodd" filter="url(#grit)" opacity="0.5"></path>
        <path d="${I}" fill="none" stroke="url(#bone)" stroke-width="2.5" opacity="0.75"></path>
        <circle cx="195" cy="128" r="42" fill="none" stroke="#000" stroke-opacity="0.6" stroke-width="12"></circle><circle cx="195" cy="128" r="42" fill="none" stroke="#3A443C" stroke-width="7"></circle><circle cx="195" cy="128" r="36" fill="#040705" fill-opacity="0.55"></circle><circle cx="195" cy="128" r="45.5" fill="none" stroke="#BDB29A" stroke-width="1" opacity="0.45"></circle></svg>
        <button class="q jw" style="${jp(159, 92, 72, 72)}; border-radius: 50%" data-act="view" data-k="counsel"><span class="eyebrow" style="font-size: 7px">${esc(a.counsel)}</span><span class="qt" style="font-size: 12px; line-height: 1.1">Options<br>now</span></button>
        <button class="q jw" style="${jp(62, 176, 266, 82)}" data-act="view" data-k="counsel">${statusL}</button>
        <button class="q jw" style="${jp(52, 274, 136, 80)}" data-act="view" data-k="army">${armyQ}</button>
        <button class="q jw" style="${jp(202, 274, 136, 80)}; text-shadow: none" data-act="view" data-k="foe">${foeQ.split(t[4]).join(t[5])}</button>
        <button class="q jw jw-wake" style="${jp(56, 372, 278, 136)}" data-act="view" data-k="log"><span class="eyebrow">${esc(a.log)}</span>${lastL}</button></div>`;
    }
    if (a.emblem === 'ward') {
      // the ward of aversion: a carved iron diamond with a line through its heart, rimed with frost, snow lying on its upper edges
      const jp = (x, y, w, h) => `left: ${(x / 3.9).toFixed(2)}%; top: ${(y / 5.6).toFixed(2)}%; width: ${(w / 3.9).toFixed(2)}%; height: ${(h / 5.6).toFixed(2)}%`;
      const lastW = B.log.slice(-1).reverse().map((e) => `<span class="jw-line">R${e.r} ${esc(e.phase)} · ${esc(e.text)}</span>`).join('');
      const statusW = `<span class="eyebrow" style="font-size: clamp(8px, 2.6cqw, 11px)">Round ${roman(B.round)} · ${B.turn === 'me' ? 'Your turn' : 'Their turn'}</span><span class="qt" style="font-size: clamp(16px, 5.6cqw, 24px)">${PHASES[B.phase]}</span>
        <span class="tnum" style="font-size: clamp(12px, 4cqw, 16px); font-weight: 700">CP ${B.cp.me}<span class="foe-ink">|${B.cp.foe}</span> · VP ${B.vp.me}<span class="foe-ink">|${B.vp.foe}</span></span>`;
      const O = 'M195 12 L382 280 L195 548 L8 280 Z', I = 'M195 48 L349 280 L195 512 L41 280 Z';
      const snowL = 'M8 280 L195 12 L195 20 C 170 40 160 52 150 66 C 128 92 120 104 104 124 C 86 150 70 172 58 194 C 44 216 30 240 16 268 Z';
      const snowR = 'M382 280 L195 12 L195 20 C 214 36 232 58 244 70 C 266 98 276 112 292 132 C 310 158 322 178 336 200 C 350 224 362 246 372 268 Z';
      return `<div class="emblem jaws ward"><svg viewBox="0 0 390 560" aria-hidden="true"><defs>${grad}
        <linearGradient id="iron" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5E6E7C"></stop><stop offset="0.5" stop-color="#2E3A45"></stop><stop offset="1" stop-color="#161D24"></stop></linearGradient>
        <linearGradient id="snw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F1F5F8"></stop><stop offset="1" stop-color="#9FB2C2"></stop></linearGradient>
        <linearGradient id="bone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2D8BE"></stop><stop offset="1" stop-color="#9C907A"></stop></linearGradient>
        <filter id="grit"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="4"></feTurbulence><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.9 -0.25"></feColorMatrix><feComposite in2="SourceGraphic" operator="in"></feComposite></filter>
        <filter id="rime"><feTurbulence type="fractalNoise" baseFrequency="0.05 0.08" numOctaves="4" seed="8"></feTurbulence><feColorMatrix values="0 0 0 0 0.9 0 0 0 0 0.95 0 0 0 0 1 0 0 0 2 -1.05"></feColorMatrix><feComposite in2="SourceGraphic" operator="in"></feComposite></filter>
        <clipPath id="wi"><path d="${I}"></path></clipPath>
        <path id="rl" d="M52 262 L188 66"></path><path id="rr" d="M202 66 L338 262"></path><path id="rb" d="M60 300 L188 486"></path></defs>
        <image href="${(POOL.find((x) => x.name === 'wolves-badge') || {}).src || ''}" x="-6" y="40" width="402" height="456" preserveAspectRatio="xMidYMid meet" style="filter: brightness(0.5) saturate(0.85) contrast(1.05)"></image><path d="M195 52 L360 280 L195 508 L30 280 Z" fill="url(#fg)" opacity="0.0"></path><g clip-path="url(#wi)"><path d="M195 280 L420 120 L420 440 Z" fill="url(#fg)" opacity="0.4" style="mix-blend-mode: color"></path></g><radialGradient id="wv" cx="0.5" cy="0.5" r="0.6"><stop offset="0.3" stop-color="#05080B" stop-opacity="0.15"></stop><stop offset="1" stop-color="#05080B" stop-opacity="0.75"></stop></radialGradient><rect x="0" y="0" width="390" height="560" fill="url(#wv)" clip-path="url(#wi)"></rect><circle cx="195" cy="280" r="40" fill="#05080B" fill-opacity="0.72" stroke="#0A0E12" stroke-width="5"></circle><circle cx="195" cy="280" r="40" fill="none" stroke="#C9962E" stroke-width="1.2" opacity="0.55"></circle></svg>
        <button class="q jw" style="${jp(120, 148, 150, 96)}" data-act="view" data-k="counsel">${statusW}</button>
        <button class="q jw" style="${jp(50, 242, 100, 76)}" data-act="view" data-k="army">${armyQ}</button>
        <button class="q jw" style="${jp(240, 242, 100, 76)}; text-shadow: none" data-act="view" data-k="foe">${foeQ}</button>
        <button class="q jw" style="${jp(161, 246, 68, 68)}; border-radius: 50%" data-act="view" data-k="counsel"><span class="eyebrow" style="font-size: 8px">${esc(a.counsel)}</span><span class="qt" style="font-size: 12px; line-height: 1.1">Options<br>now</span></button>
        <button class="q jw jw-wake" style="${jp(108, 322, 174, 86)}" data-act="view" data-k="log"><span class="eyebrow">${esc(a.log)}</span>${lastW}</button></div>`;
    }
    if (a.emblem === 'jaws') {
      // the jaw spread wide: bone ring, teeth graded big at the front and small at the hinges, every panel sized to sit inside the mouth
      const J = jawGeom(); const jp = (x, y, w, h) => `left: ${(x / 3.9).toFixed(2)}%; top: ${(y / 5.6).toFixed(2)}%; width: ${(w / 3.9).toFixed(2)}%; height: ${(h / 5.6).toFixed(2)}%`;
      const lastJ = B.log.slice(-2).reverse().map((e) => `<span class="jw-line">R${e.r} ${esc(e.phase)} · ${esc(e.text)}</span>`).join('');
      const statusJ = `<span class="eyebrow" style="font-size: clamp(8px, 2.6cqw, 11px)">Round ${roman(B.round)} · ${B.turn === 'me' ? 'Your turn' : 'Their turn'}</span><span class="qt" style="font-size: clamp(16px, 6cqw, 26px)">${PHASES[B.phase]}</span>
      <span class="tnum" style="font-size: clamp(12px, 4.1cqw, 17px); font-weight: 700">CP ${B.cp.me}<span class="foe-ink">|${B.cp.foe}</span> · VP ${B.vp.me}<span class="foe-ink">|${B.vp.foe}</span></span><span class="small" style="font-size: clamp(9.5px, 3.08cqw, 13px); line-height: 1.2; color: var(--accent-text); font-weight: 600">${esc(a.oath)}: ${esc(a.oathText)}</span>`;
      return `<div class="emblem jaws"><svg viewBox="0 0 390 560" aria-hidden="true"><defs>${grad}<radialGradient id="bone" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="#E9DFC6"></stop><stop offset="0.55" stop-color="#C6B693"></stop><stop offset="1" stop-color="#8A7856"></stop></radialGradient><linearGradient id="tooth" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#6E5C40"></stop><stop offset="0.22" stop-color="#9C8A68"></stop><stop offset="0.3" stop-color="#D9CDB0"></stop><stop offset="1" stop-color="#F3ECDB"></stop></linearGradient><clipPath id="inner"><ellipse cx="195" cy="280" rx="164" ry="244"></ellipse></clipPath><filter id="boneTex" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.8 0.12" numOctaves="3" seed="11"></feTurbulence><feColorMatrix values="0 0 0 0 0.18  0 0 0 0 0.13  0 0 0 0 0.08  0 0 0 0.55 0"></feColorMatrix><feComposite in2="SourceGraphic" operator="in"></feComposite></filter></defs>
        <ellipse cx="195" cy="280" rx="164" ry="244" fill="#0B1116" fill-opacity="0.82"></ellipse>
        <g clip-path="url(#inner)"><path d="M195 280 L465 148 L465 412 Z" fill="url(#fg)"></path></g>
        <path d="${J.dividers}" stroke="#C6B693" stroke-width="5" stroke-linecap="round"></path>
        <ellipse cx="195" cy="280" rx="184" ry="264" fill="none" stroke="#4A1812" stroke-width="5"></ellipse>
        ${J.teeth.map((t) => `<g transform="${t.tf}"><path d="${t.d}" fill="url(#tooth)" stroke="#3F3324" stroke-width="0.8" stroke-linejoin="round"></path><path d="${t.root}" fill="#5A4830" opacity="0.85"></path></g>`).join('')}
        <path d="${J.ring}" fill="url(#bone)" fill-rule="evenodd" stroke="#3B2F22" stroke-width="1.6"></path>
        <path d="${J.ring}" fill="#000" fill-rule="evenodd" filter="url(#boneTex)"></path>
        <path d="M110 52 q14 -2 22 6 M290 60 q6 10 2 22 M22 300 q4 16 0 30 M370 230 q-4 14 0 26 M150 528 q16 2 26 -4" fill="none" stroke="#6B5A40" stroke-width="1.4" opacity="0.8"></path>
        <ellipse cx="195" cy="280" rx="173" ry="253" fill="none" stroke="#3B2F22" stroke-width="4" stroke-dasharray="5 4" opacity="0.8"></ellipse>
        <circle cx="195" cy="280" r="56" fill="url(#bone)" stroke="#3B2F22" stroke-width="1.6"></circle><circle cx="195" cy="280" r="56" fill="#000" filter="url(#boneTex)"></circle><circle cx="195" cy="280" r="44" fill="#05080B" stroke="#8E1B1B" stroke-width="2"></circle></svg>
        <button class="q jw" style="${jp(84, 112, 222, 106)}" data-act="view" data-k="counsel">${statusJ}</button>
        <button class="q jw" style="${jp(44, 252, 88, 56)}" data-act="view" data-k="army">${armyQ}</button>
        <button class="q jw" style="${jp(258, 252, 88, 56)}; text-shadow: none" data-act="view" data-k="foe">${foeQ}</button>
        <button class="q jw" style="${jp(153, 238, 84, 84)}; border-radius: 50%" data-act="view" data-k="counsel"><span class="eyebrow" style="font-size: 9px">${esc(a.counsel)}</span><span class="qt" style="font-size: 13px; line-height: 1.1">Options<br>now</span></button>
        <button class="q jw jw-wake" style="${jp(78, 344, 234, 100)}" data-act="view" data-k="log"><span class="eyebrow">${esc(a.log)}</span>${lastJ}</button></div>`;
    }
    return `<div class="emblem" style="aspect-ratio: 390 / 640"><svg viewBox="0 0 390 640" aria-hidden="true"><defs>${grad}</defs>
      <rect x="10" y="10" width="370" height="620" fill="var(--panel)" stroke="var(--line2)" stroke-width="2"></rect>
      <path d="M248 248 L370 130 L370 510 L248 392 Z" fill="url(#fg)"></path>
      <path d="M10 10 L142 248 M380 10 L248 248 M10 630 L142 392 M380 630 L248 392" stroke="var(--line2)" stroke-width="3"></path>
      <rect x="142" y="248" width="106" height="144" fill="var(--bg)" stroke="var(--accent-text)" stroke-width="2"></rect></svg>
      <button class="q" style="left: 15%; top: 4%; width: 70%; height: 30%" data-act="view" data-k="counsel">${status}</button>
      <button class="q" style="left: 4%; top: 35%; width: 30%; height: 30%" data-act="view" data-k="army">${armyQ}</button>
      <button class="q" style="left: 67%; top: 35%; width: 30%; height: 30%" data-act="view" data-k="foe">${foeQ}</button>
      <button class="q" style="left: 37%; top: 39%; width: 26%; height: 22%" data-act="view" data-k="counsel">${otherPic() ? `<img src="${otherPic().src}" alt="" style="width: 70%; aspect-ratio: 1; object-fit: contain">` : ''}<span class="qt" style="font-size: 15px">Options now</span></button>
      <button class="q" style="left: 12%; top: 66%; width: 76%; height: 30%" data-act="view" data-k="log"><span class="eyebrow">${esc(a.log)}</span>${last}</button></div>`;
  }
  // Geometry for the spread jaw: outer bone ellipse 182 x 262, inner 164 x 244, centred at 195, 280 in a 390 x 560 frame (fits above the tab bar)
  let _jaw = null;
  function jawGeom() {
    if (_jaw) return _jaw;
    const cx = 195, cy = 280, OX = 182, OY = 262, IX = 164, IY = 244, f = (n) => n.toFixed(1);
    const ring = `M${cx} ${cy - OY} a${OX} ${OY} 0 1 0 0.1 0 Z M${cx} ${cy - IY} a${IX} ${IY} 0 1 1 -0.1 0 Z`;
    // four dividers from the centre boss to the inner bone: steep above (to frame the reading), flatter below (to give the Wake room)
    const hit = (dx, dy) => 1 / Math.sqrt((dx / IX) ** 2 + (dy / IY) ** 2);
    const seg = (dx, dy) => { const t = hit(dx, dy); return `M${f(cx + dx * 57)} ${f(cy + dy * 57)} L${f(cx + dx * (t - 3))} ${f(cy + dy * (t - 3))}`; };
    const dividers = [seg(-0.898, -0.44), seg(0.898, -0.44), seg(-0.898, 0.44), seg(0.898, 0.44)].join(' ');
    // teeth: evenly spaced round the outer edge, biggest at the front of each jaw, shrinking toward the hinges, each a little different
    let seed = 5; const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const steps = 1440, pts = []; let total = 0;
    for (let i = 0; i <= steps; i++) { const a = (i / steps) * Math.PI * 2; const p = [cx + OX * Math.cos(a), cy + OY * Math.sin(a)]; if (i) total += Math.hypot(p[0] - pts[i - 1].p[0], p[1] - pts[i - 1].p[1]); pts.push({ p, a, s: total }); }
    const at = (s) => { let lo = 0, hi = pts.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (pts[m].s < s) lo = m; else hi = m; } return pts[hi]; };
    const teeth = []; const n = 60;
    for (let i = 0; i < n; i++) {
      const q = at((i * total) / n); const m = q.p; const front = Math.abs(Math.sin(q.a));
      const len = 9 + 9 * front ** 1.6 + (rnd() - 0.5) * 3, w = 8 + 6 * front + (rnd() - 0.5) * 1.5, lean = (rnd() - 0.5) * 2.4;
      const ndx = (m[0] - cx) / (OX * OX), ndy = (m[1] - cy) / (OY * OY); const deg = Math.atan2(ndy, ndx) * 180 / Math.PI + 90;
      // a serrated blade: each edge stepped in tiny notches, a slight curve, and a dark root band where it seats in the gum
      const edge = (x0, y0, x1, y1) => { let d = ''; const k = 7; for (let j = 1; j < k; j++) { const t = j / k; const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; const nx = -(y1 - y0), ny = x1 - x0, nl = Math.hypot(nx, ny); const o = (j % 2 ? 0.55 : -0.2) + Math.sin(t * Math.PI) * 0.9; d += ` L${f(x + (nx / nl) * o)} ${f(y + (ny / nl) * o)}`; } return d; };
      const tip = [lean, -len];
      const d = `M${f(-w / 2)} 0${edge(-w / 2, 0, tip[0], tip[1])} L${f(tip[0])} ${f(tip[1])}${edge(tip[0], tip[1], w / 2, 0)} L${f(w / 2)} 0 Q0 ${f(w * 0.28)} ${f(-w / 2)} 0 Z`;
      const root = `M${f(-w / 2)} 0 L${f(-w * 0.36)} ${f(-len * 0.16)} Q0 ${f(-len * 0.26)} ${f(w * 0.36)} ${f(-len * 0.16)} L${f(w / 2)} 0 Q0 ${f(w * 0.28)} ${f(-w / 2)} 0 Z`;
      teeth.push({ tf: `translate(${f(m[0])} ${f(m[1])}) rotate(${f(deg)})`, d, root });
    }
    _jaw = { ring, dividers, teeth };
    return _jaw;
  }

  // ---------- sheets (battle) ----------
  function renderSheet() {
    const sh = UI.sheet; if (!sh) return '';
    if (sh.type && sh.type.indexOf('ff') === 0) return ffSheet(sh);
    if (sh.type === 'feedback') return feedbackSheet();
    const B = S.battle;
    if (sh.type === 'strat') {
      const s = allMyStrats().find((x) => x.name === sh.name && x.det === sh.det);
      if (!s) return '';
      return sheet(s.name, `<div class="row" style="gap: 8px; flex-wrap: wrap"><span class="chip">${esc(s.det)}</span><span class="chip">${s.cp} CP</span><span class="chip">${s.turn === 'either' ? 'Either turn' : s.turn === 'yours' ? 'Your turn' : "Opponent's turn"}</span></div>
        <div><div class="eyebrow">When</div><div>${esc(s.when)}</div></div><div><div class="eyebrow">Target</div><div>${esc(s.target)}</div></div><div><div class="eyebrow">Effect</div><div style="font-size: 17px">${esc(s.effect)}</div></div>
        <p class="small dim" style="margin: 0">Rule text from Wahapedia's 11th edition data, condensed. You have ${B.cp.me} CP.</p>`,
        `<button class="btn red block" data-act="useStrat" ${B.cp.me >= s.cp ? '' : 'disabled'}>USE IT · −${s.cp} CP</button>`);
    }
    if (sh.type === 'fstrat') {
      const f = FD(foe().faction); const s = f && f.stratagems.find((x) => x[1] === sh.name && x[0] === sh.det);
      if (!s) return '';
      return sheet(s[1], `<div class="row" style="gap: 8px; flex-wrap: wrap"><span class="chip">${esc(s[0])}</span><span class="chip">${s[2]} CP</span></div>${s[6] ? `<div class="small"><span class="eyebrow foe-ink">When</span><br>${esc(s[6])}</div>` : ''}${s[7] ? `<div class="small"><span class="eyebrow foe-ink">Target</span><br>${esc(s[7])}</div>` : ''}<div><span class="eyebrow foe-ink">Effect</span><div style="font-size: 17px">${esc(s[5])}</div></div><p class="small dim" style="margin: 0">From the Wahapedia 11th edition data. They have ${B.cp.foe} CP.</p>`,
        `<button class="btn block foe-fill" data-act="foeUsed" style="border: 0; font-weight: 700">THEY USED IT · −${s[2]} CP</button>`, true);
    }
    if (sh.type === 'unit') return unitSheet(sh.id);
    if (sh.type === 'round') return roundSheet(sh.r, sh.recap);
    if (sh.type === 'spot') {
      const sp = B.spotted[sh.i]; const d = foeUnits(foe().faction)[sp.name];
      return sheet(sp.name, d ? datasheetHTML(d, true) : '', `<button class="btn block" data-act="removeSpot" data-k="${sh.i}">REMOVE FROM SPOTTED</button>`, true);
    }
    if (sh.type === 'addSpot') {
      const q = (sh.q || '').toLowerCase();
      const FU = foeUnits(foe().faction);
      const names = Object.keys(FU).filter((n) => n.toLowerCase().includes(q)).sort().slice(0, 40);
      return sheet('Add a spotted unit', `<label class="field"><span class="eyebrow foe-ink">Search ${esc(factionInfo(foe().faction).display)} units</span><input type="text" id="spot-q" value="${esc(sh.q || '')}" autocomplete="off" placeholder="Warriors, Wraiths, Lychguard…"></label>
        <div class="stack" style="gap: 4px">${names.map((n) => `<button class="strat foe" data-act="spotPick" data-k="${esc(n)}"><span class="nm">${esc(n)}</span><span class="small foe-ink">${FU[n].p ? FU[n].p + ' pts' : ''}</span></button>`).join('')}</div>`, '', true);
    }
    if (sh.type === 'vox') {
      const e = B.log.find((x) => x.id === sh.id);
      return sheet(A().vox, `<p style="margin: 0">Moment saved: <b>Round ${e.r} · ${e.turn === 'me' ? 'your' : 'their'} ${esc(e.phase)}</b>, VP ${B.vp.me}–${B.vp.foe}, CP ${B.cp.me}–${B.cp.foe}.</p>
        <label class="field"><span class="eyebrow">Quick note (optional)</span><input type="text" id="vox-note" value="${esc(e.note)}" placeholder="What happened?" autocomplete="off"></label>
        <p class="small muted" style="margin: 0">Use your keyboard's mic to speak the note. Or leave it for later: it waits in the ${esc(A().log)}.</p>`,
        `<div class="grid2"><button class="btn" data-act="closeAll">LATER</button><button class="btn solid" data-act="voxSave" data-k="${e.id}">SAVE NOTE</button></div>`);
    }
    if (sh.type === 'rulesGate') {
      if (sh.busy) return sheet('Checking the rules', `<p class="small muted" style="margin: 0">Making sure the rules this app holds for both armies are the current ones.</p>`, '');
      return sheet('Rules have changed', `${sh.stale.map((x) => `<p style="margin: 0"><b>${esc(factionInfo(x.n).display)}</b>: now ${esc(x.ver)}. This app holds ${esc(FACTION_VER[x.n])}.</p>`).join('')}
        <p class="small muted" style="margin: 0">Points, datasheets or stratagems may differ from what the app shows. Check the changes before you rely on them.</p>`,
        `<div class="grid2"><button class="btn" data-act="closeAll">BACK</button><button class="btn solid" data-act="gateGo">FIGHT ANYWAY</button></div>`);
    }
    if (sh.type === 'newConfirm') {
      syncScores();
      return sheet('Battle in progress', `<p style="margin: 0">Round ${roman(B.round)} against ${esc(factionInfo(foe().faction).display)}, ${B.vp.me}–${B.vp.foe}.</p><p class="small muted" style="margin: 0">Carry on with it, or end it and set up a new one. You choose whether the old one is kept.</p>`,
        `<div class="stack" style="gap: 8px"><button class="btn solid block" data-act="resume">RESUME IT</button><div class="grid2"><button class="btn" data-act="startNew" data-k="save">SAVE IT, START NEW</button><button class="btn" data-act="startNew" data-k="nosave">DROP IT, START NEW</button></div></div>`);
    }
    if (sh.type === 'gameDel') {
      return sheet('Remove this battle?', `<p style="margin: 0">It is removed from ${esc(A().hist)} on every device. Your record against that opponent stays as it is.</p>`,
        `<div class="grid2"><button class="btn" data-act="closeSheet">KEEP IT</button><button class="btn red" data-act="gameDelYes">REMOVE</button></div>`);
    }
    if (sh.type === 'end') {
      syncScores();
      return sheet(A().end, `<p style="margin: 0">Score now: <b>${B.vp.me} – ${B.vp.foe}</b>, in Round ${roman(B.round)}. Ending closes the battle and shows the results.</p>
        <p class="small muted" style="margin: 0">Save it to ${esc(A().hist)} to keep the game and count it in your record against them. Don't save it for a quick or casual game you don't want on file.</p>`,
        `<div class="stack" style="gap: 8px"><div class="grid2"><button class="btn red" data-act="confirmEnd" data-k="save">END AND SAVE</button><button class="btn" data-act="confirmEnd" data-k="nosave">END, DON'T SAVE</button></div><button class="btn block" data-act="closeSheet">KEEP PLAYING</button></div>`);
    }
    return '';
  }
  function roundSheet(r, recap) {
    const B = S.battle, a = A(), R = ensureRound(r), fi = factionInfo(foe().faction);
    const P = B.primary || {};
    const capNote = (v) => (v > 15 ? ` <span style="color: var(--accent-text)">(capped at 15)</span>` : '');
    const step = (kind, who) => `<div class="ctr ${who === 'foe' ? 'foe' : ''}" style="min-width: 120px"><button data-act="rv" data-k="${kind}" data-w="${who}" data-r="${r}" data-d="-1" aria-label="One less">−</button><b class="tnum">${R[kind][who]}</b><button data-act="rv" data-k="${kind}" data-w="${who}" data-r="${r}" data-d="1" aria-label="One more">+</button></div>`;
    const priRows = (name, who) => {
      if (!name) return '<p class="small muted" style="margin: 0">No primary set. Choose both dispositions in The Field.</p>';
      const hits = (R.priHits && R.priHits[who]) || {};
      return parseCard(M.primary[name], B.tactical).rows.map((row, i) => {
        const ok = row.rounds.includes(r); const max = /end of a turn/i.test(row.when) ? 2 : 1; const n = hits[i] ? hits[i].n : 0; const full = n >= max;
        return `<div class="row" style="justify-content: space-between; gap: 8px; opacity: ${ok ? 1 : 0.45}"><span class="small" style="min-width: 0">${esc(row.cond)}<br><span class="muted">${esc(titleCase(row.hdr))} · ${esc(row.when)}${max > 1 ? ' · up to twice a round' : ''}</span></span><button class="btn small ${who === 'me' ? 'gold' : ''} ${n ? 'solid' : ''}" data-act="priAdd" data-k="${who}" data-r="${r}" data-i="${i}" data-max="${max}" data-v="${row.vp}" ${ok ? '' : 'disabled'} aria-pressed="${n > 0}" aria-label="${full ? 'Scored. Tap to take back' : 'Add ' + row.vp + ' VP'}">${full ? '✓ ' + (max > 1 ? '×2' : row.vp) : n ? '✓ +' + row.vp : '+' + row.vp}</button></div>`;
      }).join('');
    };
    const cardsFor = (who) => {
      const list2 = B.cards[who] || []; const tac = who === 'me' ? B.tactical : B.foeTactical;
      const act = activeCards(who, r);
      const cards = act.map((c) => {
        const idx = list2.indexOf(c);
        const pc = parseCard(M.secondary[c.name], tac);
        const live = c.status === 'active' || c.to === r;
        return `<div class="${who === 'foe' ? 'foe-panel' : 'panel'} stack" style="padding: 10px 12px; gap: 6px">
          <div class="row" style="justify-content: space-between"><b>${esc(c.name)}</b><span class="chip small">${c.status === 'active' ? 'Active' : c.status === 'achieved' ? 'Achieved R' + c.to : 'Discarded R' + c.to} · ${c.vp} VP</span></div>
          ${pc.notes.map((n) => `<div class="small muted">${esc(n)}</div>`).join('')}
          ${live ? pc.rows.map((row) => `<div class="row" style="justify-content: space-between; gap: 8px"><span class="small" style="min-width: 0">${esc(row.cond)}${row.cap ? ' <span class="muted">(' + esc(row.cap) + ')</span>' : ''}<br><span class="muted">${esc(row.when)}</span></span><button class="btn small" data-act="secAdd" data-k="${idx}" data-w="${who}" data-r="${r}" data-v="${row.vp}">+${row.vp}</button></div>`).join('') : ''}
          ${c.status === 'active' && tac ? `<div class="grid2"><button class="btn small" data-act="cardDone" data-k="${idx}" data-w="${who}" data-r="${r}">ACHIEVED</button><button class="btn small" data-act="cardDrop" data-k="${idx}" data-w="${who}" data-r="${r}">DISCARD (+1 CP)</button></div>` : ''}</div>`;
      }).join('');
      const used = new Set(act.filter((c) => c.status === 'active').map((c) => c.name));
      const need = B.secCount - used.size;
      const head = `<div class="small ${who === 'foe' ? 'foe-ink' : 'muted'}">${B.secRandom ? 'App deck' : tac ? 'Tactical' : 'Fixed'} · ${used.size} of ${B.secCount} card${B.secCount > 1 ? 's' : ''} in play${need > 0 ? (B.secRandom ? ' · the app draws at the start of ' + (who === 'me' ? 'your' : 'their') + ' turn' : tac ? ' · draw ' + need + ' more' : ' · pick ' + need + ' more') : ''}</div>`;
      if (B.secRandom) return head + cards + (need > 0 && r === B.round ? `<button class="btn small block" data-act="dealNow" data-w="${who}" data-r="${r}">DRAW ${need} CARD${need > 1 ? 'S' : ''} NOW</button>` : '');
      const draw = need > 0 && r === B.round ? `<label class="field"><span class="eyebrow ${who === 'foe' ? 'foe-ink' : ''}">${tac ? (who === 'me' ? 'Card you drew' : 'Card they drew') : (who === 'me' ? 'Your fixed card' : 'Their fixed card')}</span><select id="draw-sel" data-w="${who}" data-r="${r}"><option value="">Choose…</option>${Object.keys(M.secondary).filter((n) => !used.has(n)).map((n) => `<option>${esc(n)}</option>`).join('')}</select></label>` : '';
      return head + cards + draw;
    };
    const objs = B.objNames.map((n, i) => {
      const st = R.obj[i] || '';
      return `<button data-act="objCycle" data-k="${i}" data-r="${r}" class="${st === 'foe' ? 'foe-fill' : ''}" style="min-height: 52px; padding: 4px; border: 1px solid ${st === 'me' ? 'var(--accent-text)' : st === 'foe' ? 'var(--foe-c)' : 'var(--line2)'}; background: ${st === 'me' ? 'var(--accent)' : st === 'foe' ? '' : 'transparent'}; color: ${st === 'foe' ? 'var(--foe-text)' : 'var(--text)'}; font-weight: 700; font-size: 13px; line-height: 1.1">${esc(n)}<br><span style="font-size: 11px; font-weight: 600">${st === 'me' ? 'Yours' : st === 'foe' ? 'Theirs' : 'Nobody'}</span></button>`;
    }).join('');
    const myLosses = B.log.filter((e) => e.r === r && / destroyed\.$/.test(e.text) && e.kind === 'event').map((e) => e.text.replace(/ destroyed\.$/, ''));
    const qn = ['Top left', 'Top right', 'Bottom left', 'Bottom right'];
    const sumMe = Math.min(15, R.pri.me) + Math.min(15, R.sec.me), sumFoe = Math.min(15, R.pri.foe) + Math.min(15, R.sec.foe);
    const nextNote = recap && r < 5 && r === B.round ? `<div class="panel small" style="padding: 8px 12px; border-color: var(--gold)">Before Round ${roman(r + 1)}: check the points, objectives and cards below, then tap Start Round ${roman(r + 1)}.</div>` : recap && r < 5 ? `<div class="panel small" style="padding: 8px 12px; border-color: var(--gold)">Round ${roman(r)} is over. Check the points, objectives and cards below, then carry on with Round ${roman(r + 1)}.</div>` : '';
    const endBits = r === 5 ? `<div class="grid2"><button class="btn ${B.ready.me ? 'solid' : ''}" data-act="ready" data-k="me">YOUR ARMY BATTLE READY (+10)</button><button class="btn ${B.ready.foe ? 'solid' : ''}" data-act="ready" data-k="foe">THEIRS BATTLE READY (+10)</button></div>` : '';
    return sheet((recap ? 'Round ' + roman(r) + ' complete' : 'Round ' + roman(r)), `${nextNote}
      <div class="grid2 tnum"><div class="panel" style="padding: 8px 12px"><span class="eyebrow">You this round</span><div style="font-size: 26px; font-weight: 700">${sumMe} VP</div><span class="small muted">Primary ${R.pri.me}${capNote(R.pri.me)} · Secondary ${R.sec.me}${capNote(R.sec.me)}</span></div>
        <div class="foe-panel" style="padding: 8px 12px"><span class="eyebrow foe-ink">Them this round</span><div style="font-size: 26px; font-weight: 700" class="foe-ink">${sumFoe} VP</div><span class="small muted">Primary ${R.pri.foe} · Secondary ${R.sec.foe}</span></div></div>
      ${r === B.round && isAstartes() ? `${doctrineUI()}` : (R.doctrine ? `<div class="small muted">Doctrine this round: ${esc(DOCTRINES[R.doctrine][0])}</div>` : '')}
      <section class="stack" style="gap: 6px"><div class="eyebrow">The table</div>${tableMap({ mode: 'round', r, R })}
        <p class="small muted" style="margin: 0">Squares: tap once for the enemy, twice for your forces, a third time to clear. Objectives: once for yours, twice for theirs. Both carry into the next round.</p><div class="grid3">${objs}</div></section>
      <section class="stack" style="gap: 8px"><div class="row" style="justify-content: space-between"><span><span class="eyebrow">Your primary</span><br><b>${esc(P.me || 'Not set')}</b></span>${step('pri', 'me')}</div>${priRows(P.me, 'me')}</section>
      ${B.secOn ? `<section class="stack" style="gap: 8px"><div class="row" style="justify-content: space-between"><span><span class="eyebrow">Your secondaries</span><br></span>${step('sec', 'me')}</div>${cardsFor('me')}</section>` : ''}
      <section class="foe-panel stack" style="gap: 8px; padding: 10px 12px"><div class="row" style="justify-content: space-between"><span><span class="eyebrow foe-ink">Their primary</span><br><b>${esc(P.foe || 'Not set')}</b></span>${step('pri', 'foe')}</div>${priRows(P.foe, 'foe')}</section>
      ${B.secOn ? `<section class="stack" style="gap: 8px"><div class="row" style="justify-content: space-between"><span class="eyebrow foe-ink">Their secondaries</span>${step('sec', 'foe')}</div>${cardsFor('foe')}</section>` : ''}
      <section class="panel stack" style="padding: 10px 12px; gap: 8px"><div class="eyebrow">Casualties this round</div>
        <div class="row" style="justify-content: space-between"><span>${esc(fi.display)} units you destroyed</span><div class="ctr" style="min-width: 120px"><button data-act="rkill" data-r="${r}" data-k="-1" aria-label="One less">−</button><b class="tnum">${R.kills}</b><button data-act="rkill" data-r="${r}" data-k="1" aria-label="One more">+</button></div></div>
        <div class="small"><span class="muted">Your units destroyed:</span> ${myLosses.length ? esc(myLosses.join(', ')) : 'none'}</div></section>
      <section class="stack" style="gap: 6px"><label class="field"><span class="eyebrow">Round notes</span><textarea rows="3" data-rnote="${r}" id="rnote-${r}" placeholder="Where the fight is, what changed, what to remember">${esc(R.notes)}</textarea></label></section>
      ${endBits}`,
      r === 5 ? `<div class="grid2"><button class="btn" data-act="closeAll">DONE</button><button class="btn red" data-act="endBattle">${esc(a.end.toUpperCase())}</button></div>`
        : r === B.round ? `<div class="grid2"><button class="btn" data-act="closeAll">SAVE</button><button class="btn solid" data-act="startRound" style="line-height: 1.1; padding: 4px 8px">START ROUND ${roman(r + 1)}</button></div>`
        : `<button class="btn block" data-act="closeAll">SAVE</button>`);
  }
  function datasheetHTML(d, foeStyle) {
    const stat = (p) => `<div class="statline">${['M', 'T', 'Sv', 'W', 'LD', 'OC', 'InSv'].map((k) => `<div><small>${k === 'InSv' ? 'INV' : k.toUpperCase()}</small><b>${esc(p[k] || '–')}</b></div>`).join('')}<div><small>MODEL</small><b style="font-size: 11px">${esc(p.name.slice(0, 10))}</b></div></div>`;
    const wt = (arr, sk) => arr.length ? `<div class="tbl-wrap"><table class="wpn"><thead><tr><th>Weapon</th><th>R</th><th>A</th><th>${sk}</th><th>S</th><th>AP</th><th>D</th></tr></thead><tbody>${arr.map((w) => `<tr><td>${esc(w.name.replace(/^➤\s*/, ''))}${w.Keywords ? `<br><span class="small muted">${esc(w.Keywords)}</span>` : ''}</td><td>${esc(w.Range)}</td><td>${esc(w.A)}</td><td>${esc(w[sk] || '')}</td><td>${esc(w.S)}</td><td>${esc(w.AP)}</td><td>${esc(w.D)}</td></tr>`).join('')}</tbody></table></div>` : '';
    return `${d.m.map(stat).join('')}${wt(d.r, 'BS')}${wt(d.ml, 'WS')}
      ${d.ab.length ? `<details><summary class="eyebrow" style="cursor: pointer; min-height: 32px">Abilities (${d.ab.length})</summary><div class="stack" style="gap: 8px; padding-top: 6px">${d.ab.map((x) => Array.isArray(x) ? `<div><b>${esc(x[0])}</b><div class="small">${esc(x[1])}</div></div>` : `<b>${esc(x)}</b>`).join('')}</div></details>` : ''}
      <div class="small muted">${esc(d.kw.join(', '))}</div>`;
  }
  function unitSheet(id) {
    const B = S.battle; const u = B.units.find((x) => x.id === id); const L = list();
    const ru = L.units[+id.slice(1)]; const d = ds(u.name);
    const weapons = unitWeapons(ru);
    const m = UI.math;
    const targets = B.spotted.map((s, i) => `<option value="s${i}" ${m.t === 's' + i ? 'selected' : ''}>${esc(s.name)} (${s.n})</option>`).join('');
    const wOpts = weapons.map((w, i) => `<option value="${i}" ${String(m.w) === String(i) ? 'selected' : ''}>${esc(w.label)} ×${w.n} (${w.kind})</option>`).join('');
    let tgt = null;
    if (m.t && m.t[0] === 's') { const sp = B.spotted[+m.t.slice(1)]; const nd = sp && foeUnits(foe().faction)[sp.name]; const p = nd && nd.m[0]; if (p) tgt = { T: +p.T, Sv: parseInt(p.Sv, 10) || 7, Inv: parseInt(p.InSv, 10) || 0, W: +p.W || 1, models: sp.n, FNP: 0 }; }
    if (!tgt) tgt = { T: +(m.T || 4), Sv: +(m.Sv || 4), Inv: +(m.Inv || 0), W: +(m.W || 1), models: +(m.M || 10), FNP: +(m.FNP || 0) };
    const w = weapons[+(m.w || 0)];
    const aliveN = alive(u);
    let res = '';
    if (w) {
      const scale = u.models.length ? aliveN / u.models.length : 1;
      const r = expected(w.w, Math.max(0, Math.round(w.n * scale)), tgt);
      res = `<div class="math"><div><b class="tnum">${f1(r.attacks)}</b><span>attacks</span></div><div><b class="tnum">${f1(r.hits)}</b><span>hits</span></div><div><b class="tnum">${f1(r.unsaved)}</b><span>unsaved</span></div><div style="background: rgba(158,27,27,0.3)"><b class="tnum">${f1(r.kills)}</b><span>models slain</span></div></div>
        <p class="small muted" style="margin: 0">Wounds on ${r.need}+, they save on ${r.saveNeed > 6 ? 'no save' : r.saveNeed + '+'}. Expected damage ${f1(r.dmg)}. Scaled to ${aliveN} of ${u.models.length} models alive. Detachment buffs and stratagems are not included yet.</p>`;
    }
    const manual = !(m.t && m.t[0] === 's') ? `<div class="grid3">${[['T', 'T', 4], ['Sv', 'Save', 4], ['Inv', 'Inv (0 none)', 0], ['W', 'Wounds', 1], ['M', 'Models', 10], ['FNP', 'FNP (0 none)', 0]].map(([k, l, dflt]) => `<label class="field"><span class="eyebrow">${l}</span><input type="number" inputmode="numeric" id="m-${k}" data-math="${k}" value="${esc(m[k] != null ? m[k] : dflt)}"></label>`).join('')}</div>` : '';
    return sheet(u.name, `${u.enh.length ? `<div class="row" style="gap: 6px; flex-wrap: wrap">${u.enh.map((e) => `<span class="chip">Enhancement: ${esc(e)}</span>`).join('')}</div>` : ''}
      ${d ? datasheetHTML(d) : '<p class="muted">Datasheet not found.</p>'}
      <section class="panel stack" style="padding: 12px; gap: 10px"><div class="eyebrow">Attack maths</div>
        ${weapons.length ? `<label class="field"><span class="eyebrow">Weapon</span><select id="m-w" data-math="w">${wOpts}</select></label>` : '<p class="small muted" style="margin: 0">No weapon profiles matched this unit yet.</p>'}
        <label class="field"><span class="eyebrow">Target</span><select id="m-t" data-math="t"><option value="">Enter stats manually</option>${targets}</select></label>
        ${manual}${res}</section>`);
  }

  // ---------- render ----------
  function render() {
    Object.values(S.lists || {}).forEach(cleanList);
    if (S.army !== 'other' && !myArmies().includes(S.army)) { S.army = 'other'; if (!S.facKey) S.lists.other = S.lists.other || null; }
    document.body.className = ARMY[S.army].cls; applyArmyTheme(); applyNecronTheme();
    if (S.army === 'guard') { document.body.dataset.reg = amReg()[1]; document.body.style.setProperty('--reg', amReg()[3]); } else delete document.body.dataset.reg;
    if (S.army === 'orks') { document.body.dataset.clan = orkClan()[1]; document.body.style.setProperty('--clan', orkClan()[2]); } else delete document.body.dataset.clan;
    if (S.army === 'other' && list()) { const lf = listFaction(list()); if (lf && !FOES[lf]) loadFaction(lf); }
    if (S.foeKey && foe()) { const fn = foe().faction; if (!FD(fn)) loadFaction(fn); else if (!factionTried[fn]) { factionTried[fn] = true; checkFaction(fn); } }
    if (STANDALONE) { if (S.foeKey && foe()) freshLoad(foe().faction); if (list()) freshLoad(listFaction(list()) || (ARMY[S.army] && (ARMY[S.army].lib || ARMY[S.army].label))); }
    applyFoeTheme();
    if (S.battle && S.battle.rounds) syncScores();
    const scored = document.body.classList.contains('foe-scored');
    const y = window.scrollY;
    const root = document.getElementById('root');
    if (S.screen === 'home') { root.innerHTML = renderHome(); layoutNet(); if (!GL.t) GL.t = setTimeout(glimpseTick, 4000); }
    else if (S.screen === 'battle' && S.battle) root.innerHTML = renderBattle();
    else if (S.screen === 'results' && S.battle) root.innerHTML = renderResults();
    else if (S.screen === 'footfall') root.innerHTML = renderFootfall();
    else root.innerHTML = renderMuster();
    const gl = document.getElementById('glimpse'); if (gl) gl.hidden = S.screen !== 'home';
    const vd = document.getElementById('void'); if (vd && S.army === 'wolves' && !vd.querySelector('.wolf-snow')) vd.insertAdjacentHTML('beforeend', '<div class="wolf-snow"></div>');
    if (scored) document.body.classList.add('foe-scored'); foeScoredFx();
    const sb = document.querySelector('#overlay .sheet-body'); const sKey = JSON.stringify([UI.overlay, UI.sheet && UI.sheet.type, UI.sheet && UI.sheet.r]);
    const keep = sb && sb.dataset.key === sKey ? sb.scrollTop : 0;
    const last = UI.undo[UI.undo.length - 1];
    document.getElementById('overlay').innerHTML = (UI.sheet ? renderSheet() : renderOverlay())
      + (S.screen === 'battle' && S.battle && last && !UI.sheet && !UI.overlay ? `<button class="undo-fab" data-act="undo" aria-label="Undo the last change: ${esc(last.label)}">${ICON.undo}<span>UNDO</span><small>${esc(last.label)}</small></button>` : '');
    const nb = document.querySelector('#overlay .sheet-body'); if (nb) { nb.dataset.key = sKey; nb.scrollTop = keep; }
    startChains(); vesselSync();
    window.scrollTo(0, y);
  }
  function renderResults() {
    const B = S.battle, a = A(), fi = factionInfo(foe().faction);
    const res = B.vp.me > B.vp.foe ? 'Victory' : B.vp.me < B.vp.foe ? 'Defeat' : 'Draw';
    const standing = B.units.filter((u) => alive(u) > 0);
    const vox = B.log.filter((e) => e.kind === 'vox');
    return `<header class="band wrap" style="padding-block: 10px 10px; text-align: center"><div class="eyebrow">The battle is done</div><h1 class="h" style="font-size: calc(40px * var(--head-size))">${esc(a.results)}</h1></header>
      <main class="main wrap stack">
        <div class="panel row" style="justify-content: space-between; padding: 12px 14px"><span class="h" style="font-size: calc(32px * var(--head-size)); color: var(--accent-text)">${res}</span><span class="tnum" style="font-size: 36px; font-weight: 700">${B.vp.me} <span class="muted" style="font-size: 20px">–</span> <span class="foe-ink">${B.vp.foe}</span></span></div>
        ${B.rounds ? `<div class="tbl-wrap panel" style="padding: 6px 8px"><table class="wpn"><thead><tr><th>Round</th><th>Your primary</th><th>Your secondary</th><th>Their primary</th><th>Their secondary</th><th>Kills</th></tr></thead><tbody>${Object.keys(B.rounds).map((r) => { const R = B.rounds[r]; return `<tr><td>${roman(+r)}</td><td>${R.pri.me}</td><td>${R.sec.me}</td><td class="foe-ink">${R.pri.foe}</td><td class="foe-ink">${R.sec.foe}</td><td>${R.kills}</td></tr>`; }).join('')}</tbody></table></div>` : ''}
        <div class="panel stack" style="padding: 12px 14px; gap: 6px"><div class="eyebrow">Still standing</div><div class="row" style="justify-content: space-between; font-weight: 600"><span>${esc(a.label === 'Other' ? 'You' : a.label)}: ${standing.length} of ${B.units.length}</span><span class="foe-ink">${esc(fi.display)}</span></div>
          <div class="row" style="flex-wrap: wrap; gap: 5px">${standing.map((u) => `<span class="chip">${esc(u.name)}</span>`).join('')}</div></div>
        <section class="stack" style="gap: 6px"><div class="eyebrow" style="color: var(--gold)">${esc(a.vox)} · ${vox.length} marked</div>${vox.map((e) => `<div class="panel" style="padding: 8px 12px"><b>R${e.r} · ${e.turn === 'me' ? 'Your' : 'Their'} ${esc(e.phase)}</b><br>${e.note ? esc(e.note) : `<button class="btn small gold" data-act="voxNote" data-k="${e.id}" style="margin-top: 4px">ADD NOTE</button>`}</div>`).join('') || '<p class="small muted" style="margin: 0">No moments marked this battle.</p>'}</section>
        <p class="small muted" style="margin: 0">The coached debrief arrives in stage 3.</p>
      </main>
      <footer class="wrap stack" style="gap: 8px; padding-block: 0 calc(16px + env(safe-area-inset-bottom, 0px))">
        ${B.archived ? `<p class="small muted" style="margin: 0; text-align: center">Saved to ${esc(a.hist)}. ${res === 'Draw' ? 'A draw leaves your record against them as it was.' : 'Your record against them is updated.'}</p>` : `<p class="small muted" style="margin: 0; text-align: center">Not saved. It won't appear in ${esc(a.hist)} or your record.</p><button class="btn block" data-act="saveLate">SAVE IT AFTER ALL</button>`}
        <button class="btn solid block" data-act="newBattle">BACK TO THE MAIN PAGE</button></footer>`;
  }

  // ---------- actions ----------
  const val = (id) => { const el = document.getElementById(id); return el ? el.value : ''; };
  const ACT = {
    noop() {},
    emTint(k) { stashFoeInputs(); foe().emblemTint = k === '1'; },
    emInvert() { stashFoeInputs(); const R = foe(); R.emblemInvert = !R.emblemInvert; },
    emClear() { stashFoeInputs(); delete foe().emblemId; toast('Image moved back to the library'); },
    army(k) { S.army = k; if (k === 'other') { S.facKey = null; S.lists.other = null; } if (k === 'other' || !list()) UI.overlay = 'paste'; },
    necHue(k) { S.hue = S.hue || {}; S.hue.necron = +k; },
    makeMain() {
      const L = list(); const k = mainFor(L); if (!k || !L) return;
      S.mine = myArmies().filter((x) => x !== k).concat(k); S.lists[k] = L; S.army = k;
      S.facs = (S.facs || []).filter((x) => !MAINABLE[x.f] || MAINABLE[x.f] !== k); S.facKey = null; S.lists.other = null;
      toast(ARMY[k].label + ' is now one of your main armies.'); window.scrollTo(0, 0); return 'top';
    },
    armyFac(k) { const x = (S.facs || []).find((y) => y.f === k); if (!x) return; S.army = 'other'; S.facKey = k; S.lists.other = x.list; S.facs = [x].concat(S.facs.filter((y) => y !== x)); },
    library(k) { UI.overlay = 'library'; UI.sheet = null; UI.assign = k || null; UI.libPick = null; if (k && k.startsWith('rival:')) stashFoeInputs(); },
    poolPick(k) { if (UI.assign) { assignSlot(UI.assign, k); const back = UI.assign.startsWith('rival:') ? 'foedetail' : UI.assign === 'list:other' ? 'paste' : null; if (UI.assign.startsWith('rival:')) S.foeKey = UI.assign.slice(6); toast('Placed on ' + slotLabel(UI.assign)); UI.assign = null; UI.overlay = back; } else UI.libPick = UI.libPick === k ? null : k; },
    poolUse(k) { assignSlot(k, UI.libPick); toast('Placed on ' + slotLabel(k)); },
    poolUnuse(k) { clearSlot(k); toast('Moved back to the library'); },
    poolDelete() { const id = UI.libPick; allSlots().forEach((sl) => { if (slotId(sl) === id) clearSlot(sl); }); const gone = POOL.find((x) => x.id === id); if (gone) forgetImage(gone); POOL = POOL.filter((x) => x.id !== id); poolSave(); UI.libPick = null; toast('Image removed'); },
    libBack() { UI.overlay = UI.assign && UI.assign.startsWith('rival:') ? 'foedetail' : UI.assign === 'list:other' ? 'paste' : null; UI.assign = null; },
    overlay(k) { UI.overlay = k; UI.sheet = null; },
    feedback() { UI.overlay = null; UI.sheet = { type: 'feedback' }; UI.fbErr = ''; },
    fbKind(k) { UI.fbDraft = val('fbText'); UI.fbKind = k; },
    fbSend() { sendFeedback(); return 'skip'; },
    closeAll() { UI.overlay = null; UI.sheet = null; },
    parse() {
      try {
        const r = parseList(val('paste-text')); S.lists[S.army] = r; UI.overlay = null; if (S.army === 'other') rememberFac(r);
        let pic = '';
        if (S.army === 'other') {
          // put the matching library picture on the Other button; a picture for a different army goes back to the library
          const cur = poolItem(S.slots['list:other']); const fits = (it) => nameMatches(fileKey(it.name), r.faction) || nameMatches(fileKey(it.name), r.subfaction);
          if (cur && !fits(cur)) delete S.slots['list:other'];
          if (!S.slots['list:other']) { const used = new Set(allSlots().map(slotId).filter(Boolean)); const hit = POOL.find((it) => !used.has(it.id) && fits(it)); if (hit) { S.slots['list:other'] = hit.id; pic = ' Army image found in your library.'; } }
        }
        toast(r.name + ' loaded: ' + r.units.length + ' units.' + pic);
      }
      catch (e) { const el = document.getElementById('paste-err'); if (el) el.textContent = e.message; return 'skip'; }
    },
    pickRival(k) { S.foeKey = k; UI.overlay = 'foedetail'; },
    addFoe() { const f = val('nf-faction'); const k = 'f' + Date.now(); S.rivals[k] = { faction: f, name: val('nf-name').trim(), detachments: [], warlord: '', notes: '', record: [0, 0] }; S.foeKey = k; UI.overlay = 'foedetail'; },
    toggleDet(k) { const F = foe(); stashFoeInputs(); F.detachments = F.detachments.includes(k) ? F.detachments.filter((d) => d !== k) : F.detachments.concat(k); },
    saveFoe() { stashFoeInputs(); const el = document.getElementById('fd-dets'); if (el && !FD(foe().faction)) foe().detachments = el.value.split(',').map((x) => x.trim()).filter(Boolean); UI.overlay = null; },
    openFoeDetail() { UI.sheet = null; UI.overlay = 'foedetail'; },
    side(k) { stashField(); S.field.side = k; },
    first(k) { stashField(); S.field.first = k; },
    saveField() { stashField(); UI.overlay = null; },
    terra() { if (S.battle && !S.battle.ended) UI.sheet = { type: 'newConfirm' }; else { S.screen = 'muster'; window.scrollTo(0, 0); return 'top'; } },
    fight() {
      if (!list()) return;
      if (S.battle && !S.battle.ended && S.screen !== 'battle') { UI.sheet = { type: 'newConfirm' }; return; }
      if (STANDALONE && !UI.gatePassed) { rulesGate(); return 'skip'; }
      UI.gatePassed = false; UI.sheet = null; UI.overlay = null;
      newBattle(); S.screen = 'battle'; UI.view = 'emblem'; UI.undo = []; window.scrollTo(0, 0);
    },
    gateGo() { UI.gatePassed = true; return ACT.fight(); },
    startNew(k) {
      if (k === 'save') { archiveBattle('unfinished'); toast('Saved to ' + A().hist + ' as unfinished'); }
      UI.sheet = null; S.battle = null; S.screen = 'muster'; UI.undo = []; window.scrollTo(0, 0);
    },
    preTick(k) { stashField(); S.field.pre = S.field.pre || {}; S.field.pre[k] = !S.field.pre[k]; },
    preReset() { S.field.pre = {}; },
    maps() { UI.overlay = 'maps'; UI.sheet = null; },
    layoutPick(k) { stashField(); S.field.layout = k; },
    dice() { UI.overlay = 'dice'; UI.sheet = null; },
    moveOpen() { UI.overlay = 'move'; UI.sheet = null; UI.moveMsg = ''; UI.moveCode = ''; },
    async moveCopy() {
      try {
        // the owner's own uploads that are not in the shared library travel with it; library images are already in the app
        const own = POOL.filter((x) => !x.lib && x.src && x.src.startsWith('data:') && !LIB.items.some((li) => li.id === x.id));
        const json = JSON.stringify({ v: 1, state: S, hist: HIST, histDel: HIST_DEL, own });
        const gz = await new Response(new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer();
        let bin = ''; const u8 = new Uint8Array(gz); for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
        UI.moveCode = 'CADDIE1:' + btoa(bin); UI.moveErr = false;
        try { await navigator.clipboard.writeText(UI.moveCode); UI.moveMsg = 'Copied. Now paste it into the installed app.'; }
        catch (e) { UI.moveMsg = 'Your phone blocked the automatic copy. Press and hold the box above, Select All, then Copy.'; }
      } catch (e) { UI.moveErr = true; UI.moveMsg = 'Could not package your setup: ' + e.message; }
      render(); setTimeout(() => { const t = document.getElementById('move-code'); if (t) t.select(); }, 50);
    },
    async moveLoad() {
      const el = document.getElementById('move-code'); const code = ((el && el.value) || '').trim().replace(/\s+/g, '');
      if (!code.startsWith('CADDIE1:')) { UI.moveErr = true; UI.moveMsg = 'That is not a 40k Caddie setup. Copy it again from the Claude version.'; return; }
      try {
        const bin = atob(code.slice(8)); const u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
        const d = JSON.parse(await new Response(new Blob([u8]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
        if (!d || !d.state || d.state.v !== 1) throw new Error('unknown format');
        (d.own || []).forEach((x) => { if (!POOL.some((y) => y.id === x.id)) POOL.push({ id: x.id, name: x.name, mono: x.mono, src: x.src }); });
        poolSave();
        (d.histDel || []).forEach((id) => { if (!HIST_DEL.includes(id)) HIST_DEL.push(id); });
        (d.hist || []).forEach((g) => { if (!HIST.some((x) => x.id === g.id)) HIST.push(g); });
        HIST = HIST.filter((x) => !HIST_DEL.includes(x.id)); histSave();
        d.state.updatedAt = Date.now(); adoptRemote(d.state); save();
        if (SYNC.on) { for (const it of POOL.filter((x) => !x.assetId && !x.lib)) await uploadImage(it); await pushPool(); await pushState(); if (SYNC.histCol) await syncHistory(); }
        UI.overlay = null; S.screen = 'home'; toast('Setup loaded: ' + HIST.length + ' battles, ' + Object.keys(S.rivals || {}).length + ' opponents.');
      } catch (e) { UI.moveErr = true; UI.moveMsg = 'Could not read that setup (' + e.message + '). Copy it again and paste the whole thing.'; }
      render();
    },
    webway() { if (!STANDALONE) { toast('The Webway works in the installed app, not inside Claude.'); return 'skip'; } LIVE.err = ''; if (S.battle && !S.battle.ended) UI.overlay = 'webway'; else UI.overlay = 'webway'; UI.sheet = null; },
    wwJoinOpen() { LIVE.err = ''; UI.overlay = 'wwjoin'; },
    wwOpen() { liveOpen(); return 'skip'; },
    wwClose() { liveClose(); UI.overlay = null; toast('Unlinked. The battle carries on, on this phone only.'); },
    async wwShare() { const url = liveLink(LIVE.id); try { if (navigator.share) await navigator.share({ title: '40k Caddie battle', text: 'Join my battle: code ' + LIVE.id, url }); else { await navigator.clipboard.writeText(url); toast('Link copied'); } } catch (e) { /* closed */ } return 'skip'; },
    wwNewList() { UI.wwCode = (document.getElementById('ww-code') || {}).value || UI.wwCode; S.army = 'other'; delete S.lists.other; },
    wwJoin() {
      const code = (document.getElementById('ww-code') || {}).value || ''; UI.wwCode = code;
      if (!list() || document.getElementById('paste-text')) {
        try { S.army = 'other'; S.lists.other = parseList(val('paste-text')); rememberFac(S.lists.other); UI.wwPasted = true; }
        catch (e) { const el = document.getElementById('paste-err'); if (el) el.textContent = e.message; return 'skip'; }
      }
      liveJoin(code); return 'skip';
    },
    cogitator() {
      if (!STANDALONE) { toast('The Cogitator works in the installed app.'); return 'skip'; }
      if (!SYNC.on || !SYNC.email) { toast('Sign in first: tap the line at the bottom of the main screen.'); return 'skip'; }
      if (UI.cogOK === false) { toast('The Cogitator is not switched on for your account yet.'); cogCheck(); return 'skip'; }
      UI.overlay = 'cog'; UI.sheet = null; if (UI.cogOK === undefined) cogCheck();
    },
    cogAsk() { cogAsk(); return 'skip'; },
    updates() { UI.overlay = 'updates'; UI.sheet = null; S.seenUpd = UPDATES[0].d; },
    account() { if (!STANDALONE) return; UI.overlay = 'account'; UI.sheet = null; UI.accMsg = ''; },
    async accGoogle() {
      UI.accBusy = true; UI.accMsg = ''; render();
      try { await STANDALONE.signInGoogle(); } catch (e) { UI.accErr = true; UI.accMsg = 'Could not open Google sign-in: ' + e.message; UI.accBusy = false; render(); }
    },
    async accSend() {
      const el = document.getElementById('acc-email'); const email = ((el && el.value) || '').trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { UI.accMsg = 'That email does not look right.'; UI.accErr = true; return; }
      UI.accEmail = email; UI.accBusy = true; UI.accMsg = ''; render();
      try { await STANDALONE.sendCode(email); UI.accSent = true; UI.accErr = false; UI.accMsg = 'Code sent. Check your email (and junk folder), then type the code here.'; }
      catch (e) { UI.accErr = true; UI.accMsg = /rate|seconds/i.test(e.message) ? 'Too many codes asked for. Wait a minute and try again.' : 'Could not send the code: ' + e.message; }
      UI.accBusy = false; render();
    },
    async accVerify() {
      const el = document.getElementById('acc-code'); const code = ((el && el.value) || '').replace(/\D/g, '');
      if (code.length < 6) { UI.accMsg = 'Type the code from the email.'; UI.accErr = true; return; }
      UI.accBusy = true; UI.accMsg = ''; render();
      try { await STANDALONE.verifyCode(UI.accEmail, code); UI.accSent = false; UI.accErr = false; UI.accMsg = 'Signed in. Syncing now.'; UI.accBusy = false; render(); await syncStart(); }
      catch (e) { UI.accErr = true; UI.accMsg = /expired|invalid/i.test(e.message) ? 'That code is wrong or has expired. Ask for a new one.' : 'Could not sign in: ' + e.message; UI.accBusy = false; }
      render();
    },
    async accOut() { await STANDALONE.signOut(); UI.cogOK = false; SYNC.on = false; SYNC.email = ''; SYNC.why = 'signed out'; setSync('local'); UI.accMsg = ''; render(); },
    calcTog(k) { UI.calc[k] = !UI.calc[k]; },
    gloss() { UI.overlay = 'glossary'; UI.sheet = null; loadGlossary(); },
    glossCat(k) { UI.glossCat = k; setTimeout(filterGlossary, 0); },
    hist() { UI.overlay = 'history'; UI.sheet = null; if (!reduceMotion) setTimeout(() => { const b = document.querySelector('#overlay .sheet-body'); if (b) { b.classList.add('decompress'); setTimeout(() => b.classList.remove('decompress'), 1400); } }, 0); },
    game(k) { UI.overlay = 'game'; UI.gameId = k; },
    gameDel() { UI.sheet = { type: 'gameDel' }; },
    gameDelYes() { const id = UI.gameId; HIST = HIST.filter((x) => x.id !== id); HIST_DEL.push(id); histSave(); dropGame(id); UI.sheet = null; UI.overlay = 'history'; toast('Battle removed'); },
    resume() { S.screen = 'battle'; UI.sheet = null; },
    closeSheet() { UI.sheet = null; },
    home() { S.screen = 'home'; UI.overlay = null; UI.sheet = null; window.scrollTo(0, 0); return 'top'; },
    toMusterHome() { S.screen = 'muster'; window.scrollTo(0, 0); return 'top'; },
    soon(k) { toast(k + ' is on its way. It is in the build plan.'); return 'skip'; },
    rulesInfo() { UI.overlay = 'rules'; },
    rulesCheck() { checkRules(); return 'skip'; },
    news() { UI.overlay = 'news'; },
    about() { UI.overlay = 'about'; },
    comingSoon() { UI.overlay = 'coming'; },
    orkClan(k) { S.orkClan = k; },
    cuHost(k) { S.cuHost = k; },
    amReg(k) { S.amReg = k; },
    undo() {
      const u = UI.undo.pop(); if (!u) return;
      S.battle = JSON.parse(u.b); toast('Undone: ' + u.label);
      if (UI.sheet && UI.sheet.type === 'round' && UI.sheet.r > S.battle.round) UI.sheet = null;
    },
    toMuster() { S.screen = 'home'; UI.sheet = null; UI.overlay = null; window.scrollTo(0, 0); },
    view(k) { UI.view = k; UI.sheet = null; window.scrollTo(0, 0); return 'top'; },
    phase(k) { nextPhase(+k); },
    adj(k, el) { const B = S.battle; B[k][el.dataset.w] = Math.max(0, B[k][el.dataset.w] + (+el.dataset.d)); },
    cpBoth() { S.battle.cp.me++; S.battle.cp.foe++; toast('+1 CP each'); },
    foeWlDead() { S.battle.foeWarlordDead = !S.battle.foeWarlordDead; toast(S.battle.foeWarlordDead ? 'Their Warlord is down. No more CP from them.' : 'Their Warlord counts again.'); },
    strat(k, el) { UI.sheet = { type: 'strat', name: k, det: el.dataset.d }; },
    fstrat(k, el) { UI.sheet = { type: 'fstrat', name: k, det: el.dataset.d }; },
    useStrat() { const B = S.battle; const s = allMyStrats().find((x) => x.name === UI.sheet.name && x.det === UI.sheet.det); B.cp.me = Math.max(0, B.cp.me - s.cp); addLog('You used ' + s.name + ' (' + s.cp + ' CP).', 'cp'); UI.sheet = null; toast(s.name + ' used'); },
    foeUsed() { const B = S.battle; const s = FD(foe().faction).stratagems.find((x) => x[1] === UI.sheet.name && x[0] === UI.sheet.det); B.cp.foe = Math.max(0, B.cp.foe - s[2]); addLog('They used ' + s[1] + ' (' + s[2] + ' CP).', 'cp'); UI.sheet = null; },
    unit(k) { UI.sheet = { type: 'unit', id: k }; UI.math = { w: 0, t: S.battle.spotted.length ? 's0' : '' }; },
    hurt(k) { const u = S.battle.units.find((x) => x.id === k); const m = u.models.find((x) => x.wl > 0 && x.wl < x.W) || u.models.find((x) => x.wl > 0); if (!m) return; m.wl--; if (m.wl === 0) { addLog(u.name + ' lost a model (' + alive(u) + ' left).', 'event'); if (!alive(u)) addLog(u.name + ' destroyed.', 'event'); } },
    kill(k) { const u = S.battle.units.find((x) => x.id === k); const m = u.models.slice().reverse().find((x) => x.wl > 0 && x.wl < x.W) || u.models.slice().reverse().find((x) => x.wl > 0); if (!m) return; m.wl = 0; addLog(u.name + ' lost a model (' + alive(u) + ' left).', 'event'); if (!alive(u)) addLog(u.name + ' destroyed.', 'event'); },
    heal(k) { const u = S.battle.units.find((x) => x.id === k); const m = u.models.find((x) => x.wl < x.W && x.wl > 0) || u.models.find((x) => x.wl <= 0); if (m) m.wl = m.wl <= 0 ? m.W : m.wl + 1; },
    addSpot() { UI.sheet = { type: 'addSpot', q: '' }; },
    spotPick(k) { S.battle.spotted.push({ name: k, n: 1 }); addLog('Spotted: ' + k + '.', 'event'); UI.sheet = null; toast(k + ' added. Set its model count.'); },
    spot(k) { UI.sheet = { type: 'spot', i: +k }; },
    spotN(k, el) { const s = S.battle.spotted[+k]; s.n = Math.max(0, s.n + (+el.dataset.d)); },
    removeSpot(k) { S.battle.spotted.splice(+k, 1); UI.sheet = null; },
    vox() { addLog(A().vox + ' marked.', 'vox'); const e = S.battle.log[S.battle.log.length - 1]; e.text = 'Moment marked at VP ' + S.battle.vp.me + '–' + S.battle.vp.foe + '.'; UI.sheet = { type: 'vox', id: e.id }; },
    voxNote(k) { UI.sheet = { type: 'vox', id: k }; },
    voxSave(k) { const e = S.battle.log.find((x) => x.id === k); e.note = val('vox-note').trim(); UI.sheet = null; toast('Note saved'); if (S.battle.archived && S.battle.ended) archiveBattle(S.battle.round >= 5 ? 'finished' : 'ended early'); },
    logAdd() { const t = val('log-in').trim(); if (!t) return 'skip'; addLog(t, 'note'); },
    endBattle() { UI.sheet = { type: 'end' }; },
    round(k) { UI.sheet = { type: 'round', r: +k }; },
    rv(k, el) { const r = +el.dataset.r, R = ensureRound(r), d = +el.dataset.d, w = el.dataset.w; if (d > 0) { vpAdd(w, k === 'pri' ? 'primary' : 'secondary', r, d); return; } R[k][w] = Math.max(0, R[k][w] + d); },
    priAdd(k, el) {
      const r = +el.dataset.r, R = ensureRound(r), i = el.dataset.i, max = +el.dataset.max || 1, v = +el.dataset.v;
      R.priHits = R.priHits || { me: {}, foe: {} }; const h = R.priHits[k] || (R.priHits[k] = {}); const e = h[i] || { n: 0, got: [] };
      if (e.n >= max) { const back = e.got.reduce((a, b) => a + b, 0); R.pri[k] = Math.max(0, R.pri[k] - back); delete h[i]; toast('Taken back: −' + back + ' VP primary'); return; }
      const got = vpAdd(k, 'primary', r, v); if (!got) return;
      e.n++; e.got.push(got); h[i] = e; if (got === v) toast('+' + got + ' VP primary');
    },
    secAdd(k, el) {
      const w = el.dataset.w, c = S.battle.cards[w][+k], r = +el.dataset.r; const tac = w === 'me' ? S.battle.tactical : S.battle.foeTactical;
      let v = +el.dataset.v; if (!tac) v = Math.min(v, Math.max(0, CAPS.fixedCardMax - c.vp));
      if (!v) { toast(c.name + ' is capped at ' + CAPS.fixedCardMax + ' VP as a fixed card'); return; }
      const got = vpAdd(w, 'secondary', r, v); if (!got) return; c.vp += got; if (got === +el.dataset.v) toast('+' + got + ' VP ' + c.name);
    },
    cardDone(k, el) { const c = S.battle.cards[el.dataset.w][+k]; c.status = 'achieved'; c.to = +el.dataset.r; addLog((el.dataset.w === 'me' ? 'You achieved ' : 'They achieved ') + c.name + '.', 'event'); },
    cardDrop(k, el) { const w = el.dataset.w, c = S.battle.cards[w][+k]; c.status = 'discarded'; c.to = +el.dataset.r; S.battle.cp[w]++; addLog((w === 'me' ? 'You discarded ' : 'They discarded ') + c.name + ' (+1 CP).', 'event'); },
    objCycle(k, el) { const R = ensureRound(+el.dataset.r); const cur = R.obj[+k] || ''; R.obj[+k] = cur === '' ? 'me' : cur === 'me' ? 'foe' : ''; },
    rkill(k, el) { const R = ensureRound(+el.dataset.r); R.kills = Math.max(0, R.kills + (+k)); },
    cell(k, el) { const R = ensureRound(+el.dataset.r); const cur = R.grid[+k] || ''; R.grid[+k] = cur === '' ? 'foe' : cur === 'foe' ? 'me' : ''; },
    doctrine(k, el) {
      const B = S.battle; ensureRound(B.round); const lim = docLimits(); const used = B.doctrine.used[k] || 0;
      if (B.doctrine.active === k) { toast(DOCTRINES[k][0] + ' is already active'); return; }
      if (used >= lim[k]) { toast(DOCTRINES[k][0] + ' has no uses left this battle'); return; }
      B.doctrine.used[k] = used + 1; B.doctrine.active = k; B.rounds[B.round].doctrine = k;
      addLog(DOCTRINES[k][0] + ' selected (' + (lim[k] - used - 1) + ' left).', 'event'); toast(DOCTRINES[k][0] + ' active');
    },
    quarter(k, el) { const R = ensureRound(+el.dataset.r); R.quarters[+k] = !R.quarters[+k]; },
    ready(k) { S.battle.ready[k] = !S.battle.ready[k]; },
    secMode(k) { stashField(); S.field.secMode = k; },
    gameMode(k) { stashField(); S.field.mode = k; if (k === 'casual') rollMission(); },
    missionPick(k) { stashField(); S.field.missionPick = k; if (k === 'random') rollMission(); },
    reroll() { stashField(); rollMission(); toast('Mission rolled: ' + (primaries() ? primaries().me : '') + ' on ' + S.field.deployment); },
    secOnOff(k) { stashField(); S.field.secOn = k === 'on'; },
    secCount(k) { stashField(); S.field.secCount = +k; },
    secPick(k) { stashField(); S.field.secPick = k; },
    dealNow(k, el) { dealUp(el.dataset.w, +el.dataset.r); },
    foeSecMode(k) { stashField(); S.field.foeSecMode = k; },
    nextRound() { UI.sheet = { type: 'round', r: S.battle.round, recap: true }; },
    startRound() {
      const B = S.battle; if (B.round >= 5) return;
      B.round++; B.phase = 0; B.turn = S.field.first; ensureRound(B.round); autoCP(B, true);
      addLog('Round ' + roman(B.round) + ' begins.', 'event'); UI.sheet = null; toast('Round ' + roman(B.round) + ' begins. ' + (B.turn === 'me' ? 'Your' : 'Their') + ' Command phase.'); dealUp(B.turn, B.round);
    },
    confirmEnd(k) {
      const B = S.battle; B.ended = true; S.screen = 'results'; UI.sheet = null; UI.undo = []; window.scrollTo(0, 0);
      if (k === 'save') saveFinished();
    },
    saveLate() { saveFinished(); toast('Saved to ' + A().hist); },
    newBattle() { S.screen = 'home'; S.battle = null; window.scrollTo(0, 0); }
  };
  function stashFoeInputs() { const F = foe(); const n = document.getElementById('fd-name'); if (n) F.name = n.value.trim(); const w = document.getElementById('fd-warlord'); if (w) F.warlord = w.value.trim(); const no = document.getElementById('fd-notes'); if (no) F.notes = no.value.trim(); }
  function stashField() {
    const g = (id) => document.getElementById(id);
    if (g('fl-my')) S.field.myDisp = g('fl-my').value || null;
    if (g('fl-foe')) S.field.foeDisp = g('fl-foe').value;
    if (g('fl-mission')) S.field.mission = g('fl-mission').value.trim();
    if (g('fl-dep')) S.field.deployment = g('fl-dep').value.trim();
    if (g('fl-vow')) S.field.vow = g('fl-vow').value;
    if (g('fl-twist')) S.field.twist = g('fl-twist').value;
    if (g('fl-mirror')) S.field.mirror = g('fl-mirror').value;
    if (!S.field.fixed) S.field.fixed = ['', ''];
    if (g('fl-fx0')) S.field.fixed[0] = g('fl-fx0').value;
    if (g('fl-fx1')) S.field.fixed[1] = g('fl-fx1').value;
    if (!S.field.foeSec) S.field.foeSec = ['', ''];
    if (g('fl-fs0')) S.field.foeSec[0] = g('fl-fs0').value;
    if (g('fl-fs1')) S.field.foeSec[1] = g('fl-fs1').value;
    const p = primaries(); S.field.mission = p ? p.me : '';
  }
  document.addEventListener('click', (ev) => {
    // the news beacon is a real link: let it open, and light the beacon as it goes
    const link = ev.target.closest('a[data-fx]'); if (link) { playFx(link); return; }
    const el = ev.target.closest('[data-act]');
    if (!el || el.disabled) return;
    const fn = ACT[el.dataset.act];
    if (!fn) return;
    if (el.dataset.fx) {
      if (!el.dataset.fxGo) { if (fxBusy) return; fxBusy = true; el.dataset.fxGo = '1'; playFx(el, () => { fxBusy = false; el.click(); }); return; }
      delete el.dataset.fxGo;
    }
    const blocked = liveGuard(el.dataset.act, el); if (blocked) { toast(blocked); return; }
    const lab = UNDO_LABEL[el.dataset.act]; const before = lab && S.battle && S.screen === 'battle' ? JSON.stringify(S.battle) : null;
    const r = fn(el.dataset.k, el);
    if (before) undoMark(lab, before);
    if (r === 'skip') return;
    save(); render();
    if (r === 'top') window.scrollTo(0, 0);
  });
  document.addEventListener('input', (ev) => {
    if (ev.target && ev.target.id === 'ff-q') { UI.ffQ = ev.target.value; const pos = ev.target.selectionStart; render(); const el = document.getElementById('ff-q'); if (el) { el.focus(); try { el.setSelectionRange(pos, pos); } catch (e) { /* ignore */ } } }
  });
  document.addEventListener('change', (ev) => {
    const el = ev.target;
    if (el.dataset && el.dataset.math) { UI.math[el.dataset.math] = el.value; render(); }
    else if (el.id && el.id.startsWith('fl-')) { stashField(); save(); render(); }
    else if (el.id === 'fd-warlord') { stashFoeInputs(); save(); render(); }
    else if (el.dataset && el.dataset.rnote) { const R = ensureRound(+el.dataset.rnote); R.notes = el.value; save(); }
    else if (el.id === 'pool-files' && el.files && el.files.length) addToPool(el.files);
    else if (el.id === 'draw-sel' && el.value) { const before = JSON.stringify(S.battle); drawCard(el.dataset.w, el.value, +el.dataset.r); undoMark(UNDO_LABEL.drawSel, before); save(); render(); }
  });
  document.addEventListener('input', (ev) => {
    if (ev.target.id === 'gl-q') { UI.glossQ = ev.target.value; filterGlossary(); return; }
    if (ev.target.id && ev.target.id.startsWith('calc-') && UI.calc) { const k = ev.target.id.slice(5); UI.calc[k] = ev.target.value; const pos = ev.target.selectionStart; const body = document.querySelector('#overlay .sheet-body'); const top = body ? body.scrollTop : 0; render(); const n = document.getElementById(ev.target.id); if (n) { n.focus(); try { if (pos != null) n.setSelectionRange(pos, pos); } catch (e) { /* selects have no caret */ } } const b2 = document.querySelector('#overlay .sheet-body'); if (b2) b2.scrollTop = top; return; }
    if (ev.target.id === 'spot-q') { UI.sheet.q = ev.target.value; const pos = ev.target.selectionStart; render(); const n = document.getElementById('spot-q'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } }
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && ev.target.id === 'log-in') { ev.preventDefault(); ACT.logAdd(); save(); render(); }
    if (ev.key === 'Escape' && (UI.sheet || UI.overlay)) { ACT.closeAll(); render(); }
  });

  // ---------- account sync: your images, setup and battles follow you between devices ----------
  // Everything is saved on the device first (instant, works offline). When this view can reach the
  // owner's private store, it is copied there and other devices catch up. Viewers who cannot write
  // (a mate testing a shared link) simply stay on their own device.
  const richness = (x) => (x.battle ? 5 : 0) + Object.keys(x.slots || {}).length + (x.lists && x.lists.other ? 2 : 0) + (x.field && (x.field.deployment || x.field.foeDisp) ? 1 : 0)
    + Object.values(x.rivals || {}).filter((r) => r.name || r.notes || r.emblemId || (r.detachments || []).length).length;
  function scheduleStatePush() { if (!SYNC.on) return; clearTimeout(SYNC.st); SYNC.st = setTimeout(pushState, 1500); }
  function schedulePoolPush() { if (!SYNC.on) return; clearTimeout(SYNC.pt); SYNC.pt = setTimeout(pushPool, 800); }
  async function pushState() {
    if (!SYNC.on) return; if (SYNC.busyS) { SYNC.again.s = true; return; }
    SYNC.busyS = true;
    try { await SYNC.appRef.set({ state: JSON.stringify(S), updatedAt: S.updatedAt || 0, rich: richness(S) }); setSync(SYNC.upErr ? 'upfail' : 'synced'); }
    catch (e) { setSync(e && e.code === 'invalid_argument' ? 'local' : 'retry'); if (e && e.code === 'invalid_argument') SYNC.on = false; }
    SYNC.busyS = false; if (SYNC.again.s) { SYNC.again.s = false; pushState(); }
  }
  async function pushPool() {
    if (!SYNC.on) return; if (SYNC.busyP) { SYNC.again.p = true; return; }
    SYNC.busyP = true;
    try { await SYNC.poolRef.set({ items: POOL.filter((x) => x.assetId).map((x) => ({ id: x.id, name: x.name, assetId: x.assetId, mono: x.mono !== false })), deleted: SYNC.deleted.slice(-200) }); }
    catch (e) { /* next change retries */ }
    SYNC.busyP = false; if (SYNC.again.p) { SYNC.again.p = false; pushPool(); }
  }
  // battle history: one document per game, plus a list of removed ones so a removal reaches every device
  async function pushGame(g) {
    if (!SYNC.on || !SYNC.histCol) return;
    try { await SYNC.histCol.doc(g.id).set({ date: g.date, game: JSON.stringify(g) }); } catch (e) { /* stays on this device; sent again on the next visit */ }
  }
  async function dropGame(id) {
    if (!SYNC.on || !SYNC.histCol) return;
    try { await SYNC.histRef.set({ deleted: HIST_DEL.slice(-500) }); await SYNC.histCol.doc(id).delete(); } catch (e) { /* retried with the next removal */ }
  }
  async function syncHistory() {
    const t = await SYNC.histRef.get();
    if (t.exists) (t.data().deleted || []).forEach((id) => { if (!HIST_DEL.includes(id)) HIST_DEL.push(id); });
    const q = await SYNC.histCol.get(); const remote = new Set(); let added = 0;
    q.docs.forEach((d) => {
      remote.add(d.id);
      if (HIST_DEL.includes(d.id) || HIST.some((x) => x.id === d.id)) return;
      try { HIST.push(JSON.parse(d.data().game)); added++; } catch (e) { /* skip a damaged copy */ }
    });
    const before = HIST.length; HIST = HIST.filter((x) => !HIST_DEL.includes(x.id));
    for (const g of HIST.filter((x) => !remote.has(x.id))) await pushGame(g);
    if (added || before !== HIST.length) histSave();
    for (const id of HIST_DEL) if (remote.has(id)) { try { await SYNC.histCol.doc(id).delete(); } catch (e) { /* later */ } }
  }
  async function uploadImage(item) {
    if (!SYNC.assets || item.assetId || !item.src || !item.src.startsWith('data:')) return;
    try {
      // build the file from the saved picture directly (no network fetch)
      const [head, b64] = item.src.split(','); const type = (head.match(/data:([^;]+)/) || [])[1] || 'image/png';
      const bin = atob(b64); const u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      const r = await SYNC.assets.upload(new Blob([u8], { type }));
      item.assetId = r.id; SYNC.upErr = ''; poolSave();
    } catch (e) { SYNC.upErr = (e && (e.code || e.message)) || 'unknown'; /* stays on this device; tried again next visit */ }
  }
  function forgetImage(item) {
    SYNC.deleted.push(item.id); try { localStorage.setItem(POOL_KEY + '-deleted', JSON.stringify(SYNC.deleted.slice(-200))); } catch (e) { /* ignore */ }
    if (SYNC.assets && item.assetId) SYNC.assets.delete(item.assetId).catch(() => {});
  }
  function mergePool(remote) {
    if (!remote) return false; let changed = false;
    (remote.deleted || []).forEach((id) => { if (!SYNC.deleted.includes(id)) SYNC.deleted.push(id); if (POOL.some((x) => x.id === id)) { POOL = POOL.filter((x) => x.id !== id); changed = true; } });
    (remote.items || []).forEach((r) => {
      if (SYNC.deleted.includes(r.id)) return;
      const mine = POOL.find((x) => x.id === r.id);
      const li = LIB.items.find((x) => x.id === r.id || x.assetId === r.assetId);
      if (!mine) { POOL.push({ id: r.id, name: r.name, assetId: r.assetId, mono: r.mono, src: li ? li.file : assetSrc(r.assetId) }); changed = true; }
      else if (!mine.assetId) { mine.assetId = r.assetId; changed = true; }
    });
    if (changed) { try { localStorage.setItem(POOL_KEY, JSON.stringify(POOL)); } catch (e) { /* full: images still show from the account */ } }
    return changed;
  }
  function adoptRemote(remote) {
    const old = S;
    S = remote; S.field = Object.assign(fresh().field, S.field || {}); if (!S.slots) S.slots = {};
    // never lose an image placement just because the other device had none for that button
    Object.keys(old.slots || {}).forEach((k) => { if (!S.slots[k] && poolItem(old.slots[k])) S.slots[k] = old.slots[k]; });
    Object.keys(old.rivals || {}).forEach((k) => { const o = old.rivals[k]; if (!o.emblemId) return; if (!S.rivals[k]) S.rivals[k] = o; else if (!S.rivals[k].emblemId) Object.assign(S.rivals[k], { emblemId: o.emblemId, emblemTint: o.emblemTint, emblemInvert: o.emblemInvert }); });
    lastSaved = JSON.stringify(Object.assign({}, S, { updatedAt: 0 }));
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
  }
  const syncLine = () => STANDALONE
    ? `<button class="dim" id="sync-state" data-act="account" style="margin: 0; font-size: 11px; text-align: center; border: 0; background: transparent; text-decoration: underline; min-height: 28px; color: inherit">${syncLabel()}</button>`
    : `<p class="dim" id="sync-state" style="margin: 0; font-size: 11px; text-align: center">${syncLabel()}</p>`;
  function setSync(st) { SYNC.status = st; const el = document.getElementById('sync-state'); if (el) el.textContent = syncLabel(); }
  const syncLabel = () => (SYNC.status === 'upfail' ? `Settings synced, but ${POOL.filter((x) => !x.assetId && !x.lib).length} image(s) could not upload (${SYNC.upErr})` : SYNC.status === 'synced' ? 'Synced to your account' + (POOL.some((x) => !x.assetId && !x.lib) ? `, ${POOL.filter((x) => !x.assetId && !x.lib).length} image(s) still uploading` : '') : SYNC.status === 'retry' ? 'Saved on this device, will sync when online' : 'Saved on this device only' + (SYNC.why ? ' (' + SYNC.why + ')' : ''));
  // headlines live in one shared document that a scheduled refresh keeps current; every viewer can read it
  async function loadNews(db) {
    try {
      const d = await db.doc('news/latest').get();
      if (d.exists) { NEWS = d.data(); try { localStorage.setItem(NEWS_KEY, JSON.stringify(NEWS)); } catch (e) { /* ignore */ } if (S.screen === 'home') render(); }
    } catch (e) { /* keep the saved headlines */ }
  }
  async function syncStart() {
    try {
      const framed = (() => { try { return window.parent !== window; } catch (e) { return true; } })();
      const HOST = window.claude && window.claude.use ? window.claude : STANDALONE;
      if (!HOST) { SYNC.why = 'no account storage here'; return setSync('local'); }
      const [user, db] = await Promise.all([HOST.use('user'), HOST.use('db')]);
      if (db) loadNews(db);
      if (!user || !db) { SYNC.why = framed ? 'account storage not allowed in this window' : 'opened outside Claude'; return setSync('local'); }
      const uid = await user.id(); if (!uid) { SYNC.why = 'not signed in'; return setSync('local'); }
      if (STANDALONE) { try { SYNC.email = await user.email(); } catch (e) { SYNC.email = ''; } }
      const ownerHere = STANDALONE && OWNER.test(SYNC.email || '');
      SYNC.db = db; SYNC.assets = await HOST.use('assets');
      SYNC.appRef = db.doc('data/users/' + uid + '/app'); SYNC.poolRef = db.doc('data/users/' + uid + '/pool');
      try { SYNC.histRef = db.doc('data/users/' + uid + '/hist'); SYNC.histCol = SYNC.histRef.collection('games'); } catch (e) { SYNC.histCol = null; }
      const [a, p] = await Promise.all([SYNC.appRef.get(), SYNC.poolRef.get()]);
      mergePool(p.exists ? p.data() : null);
      if (a.exists) {
        const r = a.data(); const remote = JSON.parse(r.state); const lu = S.updatedAt || 0, ru = remote.updatedAt || 0;
        if (ru > lu || (ru === lu && richness(remote) > richness(S))) adoptRemote(remote);
      }
      SYNC.on = true;
      if (ownerHere && !(S.mine || []).includes('templars')) { S.mine = ['templars'].concat((S.mine || []).filter((k) => k !== 'templars' && k !== 'carcharodons')); save(); }
      else if (STANDALONE && !ownerHere && !Array.isArray(S.mine)) { S.mine = []; save(); }
      // images sitting unplaced in the library go back on their buttons when their names say where
      const used = new Set(allSlots().map(slotId).filter(Boolean)); let placed = 0;
      POOL.filter((x) => !used.has(x.id)).forEach((x) => { const sl = autoSlot(x.name + '.png'); if (sl) { assignSlot(sl, x.id); placed++; } });
      if (fixTerra()) placed++;
      if (placed) save();
      for (const it of POOL.filter((x) => !x.assetId && !x.lib)) await uploadImage(it);
      if (SYNC.upErr) setSync('upfail');
      await pushPool(); await pushState();
      if (SYNC.histCol) { try { await syncHistory(); } catch (e) { /* history catches up next visit */ } }
      render();
      SYNC.appRef.onSnapshot((snap) => {
        if (!snap.exists || snap.metadata.hasPendingWrites) return;
        try { const remote = JSON.parse(snap.data().state); if ((remote.updatedAt || 0) > (S.updatedAt || 0)) { adoptRemote(remote); if (!UI.sheet && !UI.overlay) render(); } } catch (e) { /* ignore bad copy */ }
      }, () => {});
      SYNC.poolRef.onSnapshot((snap) => { if (snap.exists && !snap.metadata.hasPendingWrites && mergePool(snap.data())) render(); }, () => {});
    } catch (e) { SYNC.why = 'error: ' + ((e && (e.code || e.message)) || 'unknown'); setSync('local'); }
  }


  // ---------- glimpses: now and then something vast and distant passes behind the worlds ----------
  // Only images from the library whose names start "bg-". Small, faint and slow, like a trick of the eye.
  // The tendrils image is different: it reaches out of a corner towards one of the worlds, then withdraws.
  const GL = { t: 0, last: '', lastTendril: 0 };
  function glimpseLayer() {
    let el = document.getElementById('glimpse');
    if (!el) { el = document.createElement('div'); el.id = 'glimpse'; el.setAttribute('aria-hidden', 'true'); document.body.insertBefore(el, document.getElementById('root')); }
    return el;
  }
  function glimpseTick() {
    clearTimeout(GL.t);
    GL.t = setTimeout(glimpseTick, 15000 + Math.random() * 15000);
    if (reduceMotion || document.hidden || S.screen !== 'home' || UI.overlay || UI.sheet) return;
    const sol = document.querySelector('.sol'); if (!sol) return;
    const pics = LIB.items.filter((x) => /^bg-/i.test(x.name) && x.glimpse && x.glimpse !== 'off'); if (!pics.length) return;
    const tendril = pics.find((x) => x.glimpse === 'reach');
    const r = sol.getBoundingClientRect(); const layer = glimpseLayer();
    Object.assign(layer.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
    const P = { ulthwe: [49, 11], solemnace: [80, 21], mars: [86, 50], astro: [18, 22], macragge: [15, 61], prospero: [47, 79], webway: [84, 80], terra: [50, 45], footfall: [14, 41] };
    if (tendril && Date.now() - GL.lastTendril > 50000 && Math.random() < 0.35) { GL.lastTendril = Date.now(); return reach(tendril, r, layer, P); }
    const pool = pics.filter((x) => x !== tendril && x.id !== GL.last); const it = pool[Math.floor(Math.random() * pool.length)]; if (!it) return; GL.last = it.id;
    // somewhere empty: well clear of every world
    let x = 0, y = 0;
    for (let k = 0; k < 30; k++) { x = 6 + Math.random() * 88; y = 6 + Math.random() * 88; if (Object.values(P).every(([px, py]) => Math.hypot((px - x) * r.width / 100, (py - y) * r.height / 100) > 95)) break; }
    const w = /rift/i.test(it.name) ? 46 + Math.random() * 30 : 64 + Math.random() * 46;
    const img = new Image(); img.src = it.file; img.alt = ''; img.className = 'gl-pic ' + (it.glimpse === 'rift' ? 'gl-rift' : 'gl-ship');
    img.style.width = w + 'px'; img.style.left = (x * r.width / 100 - w / 2) + 'px'; img.style.top = (y * r.height / 100 - w / 3) + 'px';
    if (Math.random() < 0.5) img.style.transform = 'scaleX(-1)';
    layer.appendChild(img);
    const dx = (Math.random() < 0.5 ? -1 : 1) * (20 + Math.random() * 40), dy = (Math.random() - 0.5) * 18;
    const flip = img.style.transform || '';
    const peak = 0.2 + Math.random() * 0.12, dur = 16000 + Math.random() * 8000;
    const a = img.animate([{ opacity: 0, transform: flip + ' translate(0, 0)' }, { opacity: peak, offset: 0.35 }, { opacity: peak, offset: 0.65 }, { opacity: 0, transform: flip + ` translate(${dx}px, ${dy}px)` }], { duration: dur, easing: 'linear', fill: 'forwards' });
    a.onfinish = () => img.remove();
  }
  function reach(it, r, layer, P) {
    // pick a corner and the world nearest to it
    const corners = [[0, 0, 'astro'], [100, 0, 'solemnace'], [0, 100, 'macragge'], [100, 100, 'webway']];
    const [cx0, cy0, target] = corners[Math.floor(Math.random() * corners.length)];
    const C = [cx0 * r.width / 100, cy0 * r.height / 100], T = [P[target][0] * r.width / 100, P[target][1] * r.height / 100];
    const d = Math.hypot(T[0] - C[0], T[1] - C[1]); const u = [(T[0] - C[0]) / d, (T[1] - C[1]) / d];
    const h = Math.min(300, Math.max(170, d * 0.9)), w = h * 0.56;
    const stop = d - 34; // the tips stop just short of the world
    const tipEnd = [C[0] + u[0] * stop, C[1] + u[1] * stop], tipStart = [C[0] - u[0] * 12, C[1] - u[1] * 12];
    const cEnd = [tipEnd[0] - u[0] * h / 2, tipEnd[1] - u[1] * h / 2], cStart = [tipStart[0] - u[0] * h / 2, tipStart[1] - u[1] * h / 2];
    const ang = Math.atan2(u[1], u[0]) * 180 / Math.PI - 90; // the image's tips point down
    const img = new Image(); img.src = it.file; img.alt = ''; img.className = 'gl-pic gl-reach';
    Object.assign(img.style, { width: w + 'px', height: h + 'px', left: -w / 2 + 'px', top: -h / 2 + 'px' });
    layer.appendChild(img);
    const at = (c, extra) => `translate(${c[0]}px, ${c[1]}px) rotate(${ang + (extra || 0)}deg)`;
    const a = img.animate([
      { opacity: 0, transform: at(cStart) },
      { opacity: 0.42, transform: at(cEnd, -2), offset: 0.42, easing: 'ease-in-out' },
      { opacity: 0.42, transform: at(cEnd, 2.5), offset: 0.55, easing: 'ease-in-out' },
      { opacity: 0.4, transform: at(cEnd, -1), offset: 0.62 },
      { opacity: 0, transform: at(cStart) },
    ], { duration: 17000, easing: 'ease-out', fill: 'forwards' });
    a.onfinish = () => img.remove();
  }

  // ---------- Footfall: the list builder (rules from the BSData 11th edition data, read by footfall.js) ----------
  const FFX = { idx: null, data: {}, loading: {}, err: '' };
  const ffState = () => { S.ff = S.ff || { lists: {}, cur: null, owned: {}, ownedOnly: false }; return S.ff; };
  const ffCur = () => { const st = ffState(); return st.cur ? st.lists[st.cur] || null : null; };
  const ffShort = (n) => String(n || '').split(' - ').pop();
  const ffGroup = (n) => (/^Imperium/.test(n) ? 'Imperium' : /^Chaos/.test(n) ? 'Chaos' : 'Xenos');
  const CONFIG_CAT = '4ac9-fd30-1e3d-b249';
  async function ffIndex() {
    if (FFX.idx) return FFX.idx;
    const r = await fetch('footfall/index.json?t=' + Date.now(), { cache: 'no-store' }); if (!r.ok) throw new Error('The list-builder data could not load.');
    FFX.idx = await r.json(); return FFX.idx;
  }
  function ffData(file) {
    if (FFX.data[file]) return Promise.resolve(FFX.data[file]);
    if (FFX.loading[file]) return FFX.loading[file];
    FFX.loading[file] = (async () => {
      const idx = await ffIndex(); const v = (idx.source && idx.source.commit) || '1';
      const all = [...idx.factions, ...idx.libraries]; const fac = idx.factions.find((x) => x.file === file);
      if (!fac) throw new Error('That army is not in the data.');
      const order = []; const seen = new Set();
      const go = (f) => { if (seen.has(f)) return; seen.add(f); order.push(f); const rec = all.find((x) => x.file === f); (rec ? rec.libs : []).forEach(go); };
      go(file);
      const get = (f) => fetch('footfall/' + f + '?v=' + v).then((r) => { if (!r.ok) throw new Error('Missing ' + f); return r.json(); });
      const [sys, ...cats] = await Promise.all([get(idx.system), ...order.map(get)]);
      const Dd = FF.Data(sys, cats, fac.id); Dd.file = file; Dd.facName = fac.name;
      FFX.data[file] = Dd; delete FFX.loading[file]; return Dd;
    })().catch((e) => { delete FFX.loading[file]; FFX.err = e.message; throw e; });
    return FFX.loading[file];
  }
  // Chasing the meta: weekly numbers from the 40k-analytics report and recent Competitive Innovations winning lists
  let FFMETA = null, ffMetaP = null;
  function ffMetaLoad() {
    if (!ffMetaP) ffMetaP = fetch('footfall/meta.json?t=' + Date.now(), { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).then((m) => { FFMETA = m; if (S.screen === 'footfall') render(); return m; }).catch(() => null);
    return ffMetaP;
  }
  const ffNorm = (n) => String(n || '').toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9']+/g, ' ').trim();
  const FF_META_NAME = { 'Genestealer Cults': 'Genestealer Cult', 'Agents of the Imperium': 'Imperial Agents', Ultramarines: 'Space Marines', 'Imperial Fists': 'Space Marines', 'Iron Hands': 'Space Marines', 'Raven Guard': 'Space Marines', Salamanders: 'Space Marines', 'White Scars': 'Space Marines' };
  function ffMetaFor(Dd) {
    if (!FFMETA || !FFMETA.factions) return null;
    const short = ffShort(Dd.facName); const name = FF_META_NAME[short] || short;
    const f = FFMETA.factions[name] || Object.entries(FFMETA.factions).find(([k]) => ffNorm(k) === ffNorm(name))?.[1];
    if (!f) return null;
    const win = (FFMETA.winning || {})[name] || null;
    const units = {}; Object.entries(f.units || {}).forEach(([k, v]) => { units[ffNorm(k)] = v; });
    const wins = {}; if (win) Object.entries(win.units || {}).forEach(([k, v]) => { wins[ffNorm(k)] = (wins[ffNorm(k)] || 0) + v; });
    return { name, shared: name !== short, f, units, win, wins };
  }
  // the small line beside a unit: how often it is taken, whether it helps, and how often recent winners took it
  function ffMetaLine(M, unitName) {
    if (!M) return '';
    const u = M.units[ffNorm(unitName)]; const w = M.win && M.win.lists >= 5 ? M.wins[ffNorm(unitName)] || 0 : null;
    const bits = [];
    if (u) bits.push(`${Math.round(u.pct)}% of lists`);
    if (u && u.eff !== null && u.z !== null && Math.abs(u.z) >= 2) bits.push(`${u.eff > 0 ? '▲ +' : '▼ '}${u.eff} win rate`);
    if (w) bits.push(`in ${w} of ${M.win.lists} recent winning lists`);
    return bits.join(' · ');
  }
  // the selections that are set-up choices rather than units
  const ffIsConfig = (Dd, s) => { const r = FF.R(Dd, s.k); return !r || r.cats.includes(CONFIG_CAT) || /^(battle size|detachment|force disposition|show\/hide options)$/i.test(r.name); };
  const ffConfigSel = (Dd, L, re) => L.roster.sels.find((s) => re.test(FF.R(Dd, s.k).name));
  function ffAfter(Dd, L) {
    FF.settle(Dd, L.roster);
    const ev = FF.evaluate(Dd, L.roster);
    L.pts = ev.pts; L.limit = ev.limit; L.ok = !ev.errors.length; L.updated = Date.now();
    return ev;
  }
  const ffCatName = (Dd, id) => (Dd.cats[id] || {}).name || 'Other';
  const CAT_ORDER = ['Epic Hero', 'Character', 'Battleline', 'Infantry', 'Mounted', 'Swarm', 'Beast', 'Monster', 'Vehicle', 'Dedicated Transport', 'Fortification'];
  const ffCatRank = (n) => { const i = CAT_ORDER.indexOf(n); return i < 0 ? 50 : i; };
  // a selection's units and points in one line
  function ffSummary(Dd, ev, s) {
    const n = ev.node(s.u); if (!n) return '';
    const models = n.kids.filter((k) => k.r.type === 'model').reduce((a, k) => a + k.sel.n, 0);
    const bits = [];
    if (models) bits.push(models + (models === 1 ? ' model' : ' models'));
    else { const gear = n.kids.filter((k) => k.r.type !== 'model' && !/^warlord$/i.test(k.eff.name) && !(k.sel.gids || []).some((g) => /enhancement/i.test((FF.R(Dd, g) || {}).name || ''))).map((k) => k.eff.name); if (gear.length) bits.push(gear.slice(0, 3).join(', ')); }
    const flat = []; const walk = (l) => l.forEach((k) => { flat.push(k); walk(k.kids); }); walk(n.kids);
    if (flat.some((k) => /^warlord$/i.test(k.eff.name))) bits.push('Warlord');
    flat.filter((k) => (k.sel.gids || []).some((g) => /enhancement/i.test((FF.R(Dd, g) || {}).name || ''))).forEach((k) => bits.push(k.eff.name));
    for (const id in s.as || {}) (s.as[id] || []).forEach((u) => { const t = ev.node(u); if (t) bits.push(((FF.R(Dd, s.k).assoc.find((a) => a.id === id) || {}).name === 'Supporting' ? 'supports ' : 'leads ') + t.eff.name); });
    return bits.join(' · ');
  }
  const ffOwnedKey = (Dd, key) => (FF.R(Dd, key) || {}).id;
  const ffOwned = (Dd) => { const st = ffState(); st.owned[Dd.file] = st.owned[Dd.file] || {}; return st.owned[Dd.file]; };
  // My collection has two modes. Complete: one shelf for everything you own, counted by unit name, so a Rhino counts for every army that can take one.
  // By army: each army keeps its own counts.
  const ffOwnMode = () => (ffState().ownMode === 'complete' ? 'complete' : 'army');
  const ffOwnCount = (Dd, o) => { const st = ffState(); if (ffOwnMode() === 'complete') return (st.ownedAll || {})[o.name] || 0; return ffOwned(Dd)[ffOwnedKey(Dd, o.key)] || 0; };
  const ffInList = (ev, id) => ev.S.force.kids.filter((k) => k.r.id === id).length;
  // what to add when the list is short: the biggest units that fit the points left
  function ffSuggest(Dd, ev) {
    const spare = ev.limit - ev.pts; if (!ev.limit || spare < 30) return [];
    const st = ffState(); const own = ffOwned(Dd);
    // big centrepieces and allies are a choice to make, not a gap-filler
    const pool = FF.options(Dd, ev, null).filter((o) => !o.hidden && !o.group && (o.type === 'unit' || o.type === 'model') && o.pts > 0 && o.pts <= spare && o.pts <= ev.limit * 0.3 && (o.max < 0 || o.count < o.max)
      && !o.cats.some((c) => /^allies|titanic|lord of war|fortification|epic hero/i.test(ffCatName(Dd, c))) && (!st.ownedOnly || ffOwnCount(Dd, o) > ffInList(ev, ffOwnedKey(Dd, o.key))))
      .filter((o, i, l) => l.findIndex((x) => x.name === o.name) === i);
    // the closest fit first, then the most-used kinds of unit
    const inList = new Set(ev.S.force.kids.map((k) => k.r.id));
    return pool.sort((a, b) => (spare - a.pts) - (spare - b.pts) - (inList.has(FF.R(Dd, a.key).id) ? 40 : 0) + (inList.has(FF.R(Dd, b.key).id) ? 40 : 0)).slice(0, 3);
  }
  // who signs off a legal list, and how it goes to war: researched per army (vessels are units in the current data where one fits)
  const FF_SEAL = {
    'Space Marines': ['Chapter Master', 'Board the Thunderhawks'], 'Ultramarines': ['Chapter Master', 'Board the Thunderhawks'], 'Imperial Fists': ['Chapter Master', 'Board the Thunderhawks'],
    'Iron Hands': ['Chapter Master', 'Board the Thunderhawks'], 'Raven Guard': ['Chapter Master', 'Board the Thunderhawks'], 'Salamanders': ['Chapter Master', 'Board the Thunderhawks'],
    'White Scars': ['Chapter Master', 'Board the Thunderhawks'], 'Blood Angels': ['Chapter Master', 'Board the Thunderhawks'],
    'Black Templars': ['High Marshal', 'Board the Thunderhawks'], 'Space Wolves': ['Great Wolf', 'Board the Stormwolves'], 'Dark Angels': ['Supreme Grand Master', 'Board the Thunderhawks'],
    'Deathwatch': ['Watch Master', 'Board the Corvus Blackstars'], 'Grey Knights': ['Supreme Grand Master', 'Board the Stormravens'],
    'Adeptus Custodes': ['Emperor', 'Board the Orions'], 'Adepta Sororitas': ['Abbess Sanctorum', 'Board the Immolators'], 'Astra Militarum': ['Munitorum', 'Board the Valkyries'],
    'Adeptus Mechanicus': ['Fabricator-General', 'Board the Archaeopters'], 'Imperial Knights': ['Emperor', 'Stride to war'], 'Agents of the Imperium': ['Inquisition', 'Board the Valkyries'],
    'Adeptus Titanicus': ['Omnissiah', 'Stride to war'],
    'Chaos Space Marines': ['Dark Gods', 'Board the Rhinos'], 'Death Guard': ['Nurgle', 'Board the Rhinos'], 'Thousand Sons': ['Tzeentch', 'Board the Rhinos'],
    'World Eaters': ['Khorne', 'Board the Rhinos'], "Emperor's Children": ['Slaanesh', 'Board the Rhinos'], 'Chaos Daemons': ['Dark Gods', 'Tear open the Warp'],
    'Chaos Knights': ['Dark Gods', 'Stride to war'], 'Titanicus Traitoris': ['Dark Mechanicum', 'Stride to war'],
    'Necrons': ['Silent King', 'Board the Night Scythes'], 'Aeldari': ['Seer Council', 'Board the Wave Serpents'], 'Drukhari': ['Archon', 'Board the Raiders'],
    'Orks': ['Warboss', 'Get in da Battlewagonz'], "T'au Empire": ['Ethereal', 'Board the Devilfish'], 'Tyranids': ['Hive Mind', 'Launch the Tyrannocytes'],
    'Genestealer Cults': ['Patriarch', 'Board the Goliath Trucks'], 'Leagues of Votann': ['Votann', 'Board the Sagitaurs'],
  };
  const ffSealOf = (Dd) => FF_SEAL[ffShort(Dd.facName)] || ['Commander', 'To war'];
  function ffSeal(Dd, ev) {
    const ok = !ev.errors.length; const pct = ev.limit ? Math.min(1, ev.pts / ev.limit) : 0; const C = 2 * Math.PI * 52;
    const near = ev.limit && ev.limit - ev.pts < 30 && ev.pts <= ev.limit;
    return `<button class="ff-seal ${ok ? 'ok' : 'bad'} ${ok && near ? 'full' : ''}" data-act="ffSeal" aria-label="${ok ? esc(ffSealOf(Dd)[1]) + ': take this list to ' + esc(homeWorld().name) : ev.errors.length + ' problems to fix'}">
      <svg viewBox="0 0 120 120" aria-hidden="true"><circle class="trk" cx="60" cy="60" r="52"></circle><circle class="arc" cx="60" cy="60" r="52" stroke-dasharray="${(C * pct).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 60 60)"></circle><circle class="wax" cx="60" cy="60" r="${(14 + 30 * pct).toFixed(1)}"></circle></svg>
      <span class="ff-seal-in"><b>${ev.pts.toLocaleString()}</b><small>of ${(ev.limit || 0).toLocaleString()}</small></span>
      <span class="ff-seal-cap">${ok ? (near ? esc(ffSealOf(Dd)[0]) + ' Approved' : 'Legal') : ev.errors.length + (ev.errors.length === 1 ? ' problem' : ' problems')}</span>${ok ? `<span class="ff-seal-go">${esc(ffSealOf(Dd)[1])}</span>` : ''}</button>`;
  }
  function renderFootfall() {
    const st = ffState(); const L = ffCur();
    const head = (title, eyebrow, back) => `<header class="band wrap" style="padding-block: 10px 8px; text-align: center">
      <button class="icon-btn" data-act="${back}" aria-label="Back" style="position: absolute; left: 4px; top: 8px">${ICON.back}</button>
      <div class="eyebrow">${esc(eyebrow)}</div><h1 class="h" style="font-size: calc(${title.length > 16 ? 28 : 36}px * var(--head-size)); padding-inline: 40px">${esc(title)}</h1></header>`;
    if (!L || UI.ffView === 'lists') {
      const lists = Object.values(st.lists).sort((a, b) => (b.updated || 0) - (a.updated || 0));
      return `${head('Footfall', 'THE VOID PORT · LIST BUILDER', 'home')}
      <main class="main wrap stack">
        <p class="small muted" style="margin: 0">Build legal lists for any army from the current points and rules. Everything is checked as you go.</p>
        ${lists.length ? lists.map((x) => `<button class="strat" data-act="ffOpenList" data-k="${esc(x.id)}"><span style="min-width: 0"><span class="nm">${esc(x.name)}</span><br><span class="ds">${esc(ffShort(x.facName))} · ${(x.pts || 0).toLocaleString()} of ${(x.limit || 0).toLocaleString()} pts · ${x.ok ? 'legal' : 'not legal yet'}</span></span>${ICON.next}</button>`).join('') : '<div class="panel small muted" style="padding: 12px">No lists yet.</div>'}
        <button class="btn solid block" data-act="ffNew">NEW LIST</button>
        ${FFX.idx && FFX.idx.source ? `<p class="small muted" style="margin: 0">Data from the BSData community project, ${esc(FFX.idx.source.date)}. Unofficial.</p>` : ''}
      </main>`;
    }
    const Dd = FFX.data[L.file];
    if (Dd && !L.roster) { L.roster = FF.newRoster(Dd, UI.ffSize || 'Strike Force'); ffAfter(Dd, L); }
    if (!Dd) { ffData(L.file).then(() => render()).catch(() => render()); return `${head(L.name, ffShort(L.facName).toUpperCase(), 'ffLists')}<main class="main wrap"><div class="panel small muted" style="padding: 12px">${FFX.err ? esc(FFX.err) : 'Loading the ' + esc(ffShort(L.facName)) + ' rules…'}</div></main>`; }
    const ev = FF.evaluate(Dd, L.roster);
    const units = L.roster.sels.filter((s) => !ffIsConfig(Dd, s));
    const det = ffConfigSel(Dd, L, /^detachment$/i), fd = ffConfigSel(Dd, L, /^force disposition$/i), bs = ffConfigSel(Dd, L, /^battle size$/i);
    const dets = det ? (ev.node(det.u) || { kids: [] }).kids.map((k) => k.eff.name) : [];
    const fdOpts = fd ? FF.options(Dd, ev, fd.u).filter((o) => !o.group && !o.hidden) : [];
    const fdOn = fd ? (ev.node(fd.u) || { kids: [] }).kids.map((k) => k.r.key) : [];
    const sizes = bs ? FF.options(Dd, ev, bs.u).filter((o) => !o.group && !o.hidden && /point limit/i.test(o.name)) : [];
    const sizeOn = bs ? (ev.node(bs.u) || { kids: [] }).kids.map((k) => k.r.key) : [];
    const sugg = ffSuggest(Dd, ev);
    // units grouped by their main category
    const byCat = {};
    units.forEach((s) => { const n = ev.node(s.u); const c = n ? ffCatName(Dd, n.r.primaryCat) : 'Other'; (byCat[c] = byCat[c] || []).push(s); });
    const cats = Object.keys(byCat).sort((a, b) => ffCatRank(a) - ffCatRank(b));
    const errs = ev.errors;
    return `${head(L.name, ffShort(L.facName).toUpperCase(), 'ffLists')}
    <main class="main wrap stack">
      <section class="ff-top">${ffSeal(Dd, ev)}
        <div class="stack" style="gap: 6px; min-width: 0; flex: 1">
          <div class="row" style="gap: 6px; flex-wrap: wrap">${sizes.map((o) => `<button class="chip ${sizeOn.includes(o.key) ? 'on' : ''}" data-act="ffSize" data-k="${esc(o.key)}">${esc(o.name.replace(/^\d+\.\s*/, '').replace(/\s*\(.*\)/, ''))}</button>`).join('')}</div>
          <button class="ff-line" data-act="ffDetOpen"><span class="eyebrow">Detachments · ${ev.dp}${ev.dpMax !== null ? ' of ' + ev.dpMax : ''} pts</span><span>${dets.length ? esc(dets.join(', ')) : 'Choose a detachment'}</span></button>
          ${fdOpts.length > 1 || (fdOpts.length && !fdOn.length) ? `<div class="stack" style="gap: 4px"><span class="eyebrow">Force disposition</span><div class="row" style="gap: 6px; flex-wrap: wrap">${fdOpts.map((o) => `<button class="chip ${fdOn.includes(o.key) ? 'on' : ''}" data-act="ffFD" data-k="${esc(o.key)}">${esc(o.name)}</button>`).join('')}</div></div>` : fdOn.length ? `<span class="small muted">Force disposition: ${esc((ev.node(fd.u).kids[0] || { eff: { name: '' } }).eff.name)}</span>` : ''}
          ${ev.enhMax !== null ? `<span class="small muted">Enhancements ${ev.enh} of ${ev.enhMax}</span>` : ''}
        </div>
      </section>
      ${(() => { ffMetaLoad(); const M = ffMetaFor(Dd); if (!M || !M.f.win) return ''; return `<button class="ff-line ff-meta" data-act="ffMetaOpen"><span class="eyebrow">Chasing the meta</span><span>${esc(M.name)}${M.shared ? ' (all chapters)' : ''} win <b>${M.f.win}%</b> of games in 11th edition · ${M.f.games.toLocaleString()} games · rank ${M.f.rank} of ${M.f.of}</span></button>`; })()}
      ${errs.length ? `<section class="panel ff-errs stack" style="gap: 4px; padding: 10px 12px"><span class="eyebrow" style="color: var(--accent-text)">To fix</span>${errs.slice(0, 4).map((e) => `<span class="small">${esc(e.msg)}</span>`).join('')}${errs.length > 4 ? `<span class="small muted">and ${errs.length - 4} more</span>` : ''}
        <div class="row" style="gap: 8px; margin-top: 4px">${errs.length > 4 ? '<button class="btn small" data-act="ffErrs">SEE ALL</button>' : ''}<button class="btn small" data-act="ffCogWhy">ASK THE COGITATOR WHY</button></div></section>` : ''}
      ${sugg.length ? `<section class="stack" style="gap: 6px"><span class="eyebrow">${(ev.limit - ev.pts).toLocaleString()} pts spare · could fit</span><div class="row" style="gap: 6px; flex-wrap: wrap">${sugg.map((o) => `<button class="chip" data-act="ffAddKey" data-k="${esc(o.key)}">+ ${esc(o.name)} · ${o.pts}</button>`).join('')}</div></section>` : ''}
      ${cats.map((c) => `<section class="stack" style="gap: 6px"><span class="eyebrow">${esc(c)}</span>${byCat[c].map((s) => { const bad = errs.some((e) => e.u === s.u); return `<button class="strat ff-unit ${bad ? 'bad' : ''}" data-act="ffUnit" data-k="${esc(s.u)}"><span style="min-width: 0"><span class="nm">${esc(ev.name(s.u))}</span><br><span class="ds">${esc(ffSummary(Dd, ev, s))}</span></span><b class="ff-pts">${ev.ptsOf(s.u)}</b></button>`; }).join('')}</section>`).join('')}
      <button class="btn solid block" data-act="ffAddOpen">ADD A UNIT</button>
      <div class="row" style="justify-content: center; gap: 14px; flex-wrap: wrap">
        <button class="dim ff-link" data-act="ffCog">Ask the Cogitator</button><button class="dim ff-link" data-act="ffOwnOpen">My collection</button><button class="dim ff-link" data-act="ffCopy">Copy as text</button><button class="dim ff-link" data-act="ffMore">Rename or delete</button>
      </div>
    </main>`;
  }
  // the options under a selection, grouped as the data groups them
  function ffOpts(Dd, ev, u, depth) {
    const all = FF.options(Dd, ev, u);
    const imm = (o) => (o.gids.length >= 2 ? o.gids[o.gids.length - 2] : null);
    const kidsOf = (g) => all.filter((o) => imm(o) === g);
    const P = ev.node(u);
    const block = (g) => kidsOf(g).sort((a, b) => (/^warlord$/i.test(b.name) ? 1 : 0) - (/^warlord$/i.test(a.name) ? 1 : 0)).map((o) => {
      if (o.group) {
        if (o.hidden) return '';
        const inner = block(o.key); if (!inner.trim()) return '';
        const hint = o.max === 1 ? 'choose one' : o.min > 0 && o.max > 0 ? `${o.min} to ${o.max}` : o.max > 0 ? `up to ${o.max}` : '';
        const chosen = all.filter((x) => !x.group && x.gids.includes(o.key)).reduce((a, x) => a + x.count, 0);
        return `<details class="ff-grp" ${depth > 0 || chosen || o.min > 0 ? 'open' : ''}><summary><span class="eyebrow">${esc(o.name)}</span>${hint ? `<span class="small muted"> ${esc(hint)}</span>` : ''}</summary><div class="stack" style="gap: 4px">${inner}</div></details>`;
      }
      const sel = P.kids.filter((k) => k.r.key === o.key);
      if (o.hidden && !sel.length) return '';
      const grp = imm(o) ? all.find((x) => x.key === imm(o)) : null;
      const pts = o.pts ? ` <span class="small muted">${o.pts > 0 ? '+' : ''}${o.pts} pts</span>` : '';
      const nested = sel.map((k) => { const inner = ffOpts(Dd, ev, k.u, depth + 1); return inner.trim() ? `<div class="ff-nest">${sel.length > 1 ? `<span class="small muted">${esc(k.eff.name)}</span>` : ''}${inner}</div>` : ''; }).join('');
      if (o.type === 'model' || (o.max !== 1 && !(grp && grp.max === 1))) {
        const n = sel.reduce((a, k) => a + k.sel.n, 0);
        return `<div class="ff-row ${o.hidden ? 'bad' : ''}"><span class="ff-nm">${esc(o.name)}${pts}</span><span class="ff-step"><button class="btn small" data-act="ffN" data-k="${esc(u)}|${esc(o.key)}|-1" ${n <= 0 ? 'disabled' : ''} aria-label="One fewer ${esc(o.name)}">−</button><b>${n}</b><button class="btn small" data-act="ffN" data-k="${esc(u)}|${esc(o.key)}|1" ${(o.max >= 0 && o.count >= o.max) || o.hidden ? 'disabled' : ''} aria-label="One more ${esc(o.name)}">+</button></span></div>${nested}`;
      }
      const on = sel.length > 0;
      // always-carried wargear: shown, not toggled
      if (o.min >= 1 && o.max === 1 && !(grp && grp.max === 1) && on && !o.hidden) return `<div class="ff-row ff-fixed"><span class="ff-nm"><span class="ff-box" aria-hidden="true">✓</span> ${esc(o.name)}${pts}</span></div>${nested}`;
      return `<button class="ff-pick ${on ? 'on' : ''} ${o.hidden ? 'bad' : ''}" data-act="ffPick" data-k="${esc(u)}|${esc(o.key)}|${grp && grp.max === 1 ? esc(grp.key) : ''}" aria-pressed="${on}"><span class="ff-box" aria-hidden="true">${on ? '✓' : ''}</span><span class="ff-nm">${esc(o.name)}${pts}</span></button>${on ? nested : ''}`;
    }).join('');
    return block(null);
  }
  function ffProfiles(Dd, key, ev, u) {
    const ps = ev && u ? FF.unitProfiles(Dd, ev, u) : FF.profiles(Dd, key); if (!ps.length) return '';
    const cell = (r, c) => `<td${(r.mod || []).includes(c) ? ' class="ff-mod" title="Changed by your army, detachment, wargear or enhancement"' : ''}>${esc(r.chars[c])}</td>`;
    const unitP = ps.filter((p) => p.type === 'Unit'), rng = ps.filter((p) => /Ranged/.test(p.type)), mel = ps.filter((p) => /Melee/.test(p.type)), ab = ps.filter((p) => p.type === 'Abilities' || p.type === 'Rule');
    const tbl = (rows) => { if (!rows.length) return ''; const cols = Object.keys(rows[0].chars).filter((c) => c !== 'Keywords'); return `<div class="ff-tbl"><table><tr><th></th>${cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr>${rows.map((r) => `<tr><td>${esc(r.name)}${r.chars.Keywords && r.chars.Keywords !== '-' ? `<br><small class="muted">${esc(r.chars.Keywords)}</small>` : ''}</td>${cols.map((c) => cell(r, c)).join('')}</tr>`).join('')}</table></div>`; };
    return `<details class="ff-grp"><summary><span class="eyebrow">Datasheet</span></summary>${tbl(unitP)}${tbl(rng)}${tbl(mel)}${ab.map((a) => `<p class="small" style="margin: 4px 0"><b>${esc(a.name)}.</b> ${esc(a.chars.Description || '')}</p>`).join('')}${ps.some((p) => (p.mod || []).length) ? '<p class="small muted" style="margin: 4px 0">Gold values are changed by your army, detachment, wargear or enhancements.</p>' : ''}</details>`;
  }
  function ffSheet(sh) {
    const st = ffState(); const L = ffCur(); const Dd = L && L.roster ? FFX.data[L.file] : null;
    if (sh.type === 'ffNew') {
      const idx = FFX.idx;
      if (!idx) { ffIndex().then(() => render()).catch((e) => { FFX.err = e.message; render(); }); return sheet('New list', `<p class="small muted" style="margin: 0">${FFX.err ? esc(FFX.err) : 'Loading the armies…'}</p>`, ''); }
      const groups = ['Imperium', 'Chaos', 'Xenos'];
      const size = UI.ffSize || 'Strike Force';
      return sheet('New list', `<label class="field"><span class="eyebrow">Name</span><input type="text" id="ff-name" value="${esc(UI.ffName || '')}" placeholder="My list" autocomplete="off"></label>
        <div class="stack" style="gap: 4px"><span class="eyebrow">Battle size</span><div class="row" style="gap: 6px; flex-wrap: wrap">${['Incursion', 'Strike Force', 'Onslaught'].map((x) => `<button class="chip ${size === x ? 'on' : ''}" data-act="ffNewSize" data-k="${x}">${x}</button>`).join('')}</div></div>
        ${groups.map((g) => `<div class="stack" style="gap: 4px"><span class="eyebrow">${g}</span>${idx.factions.filter((f) => ffGroup(f.name) === g).sort((a, b) => ffShort(a.name).localeCompare(ffShort(b.name))).map((f) => `<button class="strat" data-act="ffCreate" data-k="${esc(f.file)}" style="min-height: 44px"><span class="nm">${esc(ffShort(f.name))}</span>${ICON.next}</button>`).join('')}</div>`).join('')}`, '');
    }
    if (!L || !Dd) return '';
    const ev = FF.evaluate(Dd, L.roster);
    if (sh.type === 'ffUnit') {
      const n = ev.node(sh.u); if (!n) return '';
      const errs = ev.errors.filter((e) => e.u === sh.u || (ev.node(e.u) && (() => { for (let p = ev.node(e.u); p; p = p.parent) if (p.u === sh.u) return true; return false; })()));
      const partners = FF.partners(Dd, ev, sh.u);
      const attach = partners.map((p) => { const cur = ((n.sel.as || {})[p.a.id] || [])[0]; return `<div class="stack" style="gap: 4px"><span class="eyebrow">${esc(p.a.name === 'Supporting' ? 'Supports' : p.a.name === 'Leading' ? 'Leads' : p.a.name)}</span><div class="row" style="gap: 6px; flex-wrap: wrap"><button class="chip ${!cur ? 'on' : ''}" data-act="ffAttach" data-k="${esc(sh.u)}|${esc(p.a.id)}|">None</button>${p.can.map((t) => `<button class="chip ${cur === t.u ? 'on' : ''}" data-act="ffAttach" data-k="${esc(sh.u)}|${esc(p.a.id)}|${esc(t.u)}">${esc(t.eff.name)}</button>`).join('')}</div>${!p.can.length ? '<span class="small muted">No unit in the list it can join yet.</span>' : ''}</div>`; }).join('');
      return sheet(n.eff.name, `<div class="row" style="justify-content: space-between"><span class="small muted">${esc(ffSummary(Dd, ev, n.sel))}</span><b class="ff-pts">${ev.ptsOf(sh.u)} pts</b></div>
        ${errs.length ? `<div class="panel ff-errs stack" style="gap: 3px; padding: 8px 10px">${errs.map((e) => `<span class="small">${esc(e.msg)}</span>`).join('')}</div>` : ''}
        ${attach}
        <div class="stack" style="gap: 6px">${ffOpts(Dd, ev, sh.u, 0)}</div>
        ${ffProfiles(Dd, n.r.key, ev, sh.u)}
        <div class="row" style="gap: 8px; flex-wrap: wrap"><button class="btn small" data-act="ffCogUnit" data-k="${esc(sh.u)}">ASK THE COGITATOR</button><button class="btn small" data-act="ffDup" data-k="${esc(sh.u)}">DUPLICATE</button><button class="btn small" data-act="ffDel" data-k="${esc(sh.u)}" style="color: var(--accent-text)">REMOVE</button></div>`,
        `<button class="btn solid block" data-act="closeAll">DONE</button>`);
    }
    if (sh.type === 'ffAdd') {
      const own = ffOwned(Dd); const q = (UI.ffQ || '').toLowerCase(); ffMetaLoad(); const M = ffMetaFor(Dd);
      const opts = FF.options(Dd, ev, null).filter((o) => !o.hidden && !o.group && (o.type === 'unit' || o.type === 'model') && (!q || o.name.toLowerCase().includes(q)))
        .filter((o, i, l) => l.findIndex((x) => x.name === o.name) === i);
      const byCat = {}; opts.forEach((o) => { const c = ffCatName(Dd, o.primaryCat); (byCat[c] = byCat[c] || []).push(o); });
      const cats = Object.keys(byCat).sort((a, b) => ffCatRank(a) - ffCatRank(b) || a.localeCompare(b));
      return sheet('Add a unit', `<label class="field"><span class="eyebrow">Search</span><input type="search" id="ff-q" value="${esc(UI.ffQ || '')}" placeholder="Unit name" autocomplete="off"></label>
        <button class="ff-pick ${st.ownedOnly ? 'on' : ''}" data-act="ffOwnedOnly" aria-pressed="${st.ownedOnly}"><span class="ff-box" aria-hidden="true">${st.ownedOnly ? '✓' : ''}</span><span class="ff-nm">Only units I own <span class="small muted">(set them in My collection)</span></span></button>
        ${cats.map((c) => `<div class="stack" style="gap: 4px"><span class="eyebrow">${esc(c)}</span>${byCat[c].map((o) => { const id = ffOwnedKey(Dd, o.key); const have = ffInList(ev, id); const owned = ffOwnCount(Dd, o); const full = o.max >= 0 && o.count >= o.max; const noOwn = st.ownedOnly && owned <= have; const ml = ffMetaLine(M, o.name); const info = [have ? have + ' in list' : '', o.max >= 0 ? 'max ' + o.max : '', owned ? owned + ' owned' : ''].filter(Boolean).join(' · ');
          return `<button class="strat" data-act="ffAddKey" data-k="${esc(o.key)}" ${full || noOwn ? 'disabled' : ''} style="min-height: 46px"><span style="min-width: 0"><span class="nm">${esc(o.name)}</span>${info ? `<br><span class="ds">${esc(info)}</span>` : ''}${ml ? `<br><span class="ds ff-ml">${esc(ml)}</span>` : ''}</span><b class="ff-pts">${o.pts}</b></button>`; }).join('')}</div>`).join('') || '<p class="small muted">Nothing matches.</p>'}`, '');
    }
    if (sh.type === 'ffDet') {
      const det = ffConfigSel(Dd, L, /^detachment$/i); if (!det) return '';
      const opts = FF.options(Dd, ev, det.u).filter((o) => !o.group && !o.hidden);
      const left = ev.dpMax === null ? 99 : ev.dpMax - ev.dp;
      return sheet('Detachments', `<p class="small muted" style="margin: 0">${ev.dpMax !== null ? `${ev.dp} of ${ev.dpMax} detachment points used. ` : ''}Each detachment costs the points shown.</p>
        ${opts.map((o) => { const on = o.count > 0; return `<button class="ff-pick ${on ? 'on' : ''}" data-act="ffDet" data-k="${esc(o.key)}" ${!on && o.dp > left ? 'disabled' : ''} aria-pressed="${on}"><span class="ff-box" aria-hidden="true">${on ? '✓' : ''}</span><span class="ff-nm">${esc(o.name)} <span class="small muted">${o.dp} DP</span></span></button>`; }).join('')}
        ${(ev.node(det.u) || { kids: [] }).kids.map((k) => ffProfiles(Dd, k.r.key).replace('Datasheet', esc(k.eff.name) + ' rules')).join('')}`, `<button class="btn solid block" data-act="closeAll">DONE</button>`);
    }
    if (sh.type === 'ffMeta') {
      const M = ffMetaFor(Dd); if (!M) return sheet('Chasing the meta', '<p class="small muted" style="margin: 0">No meta numbers for this army yet.</p>', '');
      const opts = FF.options(Dd, ev, null).filter((o) => !o.hidden && !o.group && (o.type === 'unit' || o.type === 'model'));
      const keyOf = (n) => (opts.find((o) => ffNorm(o.name) === ffNorm(n)) || {}).key;
      const row = (n, sub) => { const k = keyOf(n); return `<div class="ff-row"><span class="ff-nm">${esc(n)}<br><span class="small muted">${esc(sub)}</span></span>${k ? `<button class="btn small" data-act="ffAddKey" data-k="${esc(k)}">ADD</button>` : ''}</div>`; };
      const us = Object.entries(M.f.units || {});
      const played = us.slice().sort((a, b) => b[1].pct - a[1].pct).slice(0, 10);
      const lifts = us.filter(([, v]) => v.z !== null && v.z >= 2).sort((a, b) => b[1].eff - a[1].eff);
      const wl = M.win && M.win.lists ? Object.entries(M.win.units).filter(([n]) => keyOf(n)).sort((a, b) => b[1] - a[1]).slice(0, 10) : [];
      const arts = (FFMETA.ci && FFMETA.ci.articles) || [];
      return sheet('Chasing the meta', `<p style="margin: 0"><b>${esc(M.name)}</b>${M.shared ? ' (all Space Marine chapters together)' : ''} won <b>${M.f.win}%</b> of ${M.f.games.toLocaleString()} games in 11th edition, rank ${M.f.rank} of ${M.f.of}.</p>
        ${wl.length ? `<div class="stack" style="gap: 2px"><span class="eyebrow">In recent winning lists (${M.win.lists} lists)</span>${M.win.lists < 5 ? '<span class="small muted">Only a few lists so far: read these loosely.</span>' : ''}${wl.map(([n, c]) => row(n, `in ${c} of ${M.win.lists}`)).join('')}</div>` : ''}
        ${lifts.length ? `<div class="stack" style="gap: 2px"><span class="eyebrow">Lift the win rate</span>${lifts.map(([n, v]) => row(n, `+${v.eff} points when taken · in ${Math.round(v.pct)}% of lists`)).join('')}</div>` : ''}
        <div class="stack" style="gap: 2px"><span class="eyebrow">Most played</span>${played.map(([n, v]) => row(n, `in ${Math.round(v.pct)}% of lists${v.z !== null && Math.abs(v.z) >= 2 ? (v.eff > 0 ? ' · ▲ +' : ' · ▼ ') + v.eff + ' win rate' : ''}`)).join('')}</div>
        ${(() => { const st = FFMETA.status || {}; const old = (k) => st[k] && st[k].kept ? st[k].since : ''; const a = old('analytics'), c = old('ci'); return a || c ? `<p class="small" style="margin: 0; color: var(--accent-text)">${a ? 'The win-rate figures could not be refreshed and date from ' + esc(a) + '. ' : ''}${c ? 'The winning lists could not be refreshed and date from ' + esc(c) + '.' : ''}</p>` : ''; })()}
        <p class="small muted" style="margin: 0">"Win rate" effects compare lists with the unit to similar lists without it; small effects are left out. Winners take what wins, and what is popular, so treat these as pointers, not rules.</p>
        <p class="small muted" style="margin: 0">Win rates and unit numbers: <a href="${esc(FFMETA.analytics.url)}" target="_blank" rel="noopener" style="color: var(--gold)">40k-analytics</a>${FFMETA.analytics.updated ? ', updated ' + esc(FFMETA.analytics.updated) : ''}. Winning lists: Competitive Innovations on <a href="https://www.tabletopbattles.com/tag/competitive-innovations" target="_blank" rel="noopener" style="color: var(--gold)">Tabletop Battles</a>${arts.length ? ', ' + arts.length + ' articles from the last eight weeks' : ''}. Unofficial.</p>`,
        `<button class="btn solid block" data-act="closeAll">DONE</button>`);
    }
    if (sh.type === 'ffErrs') return sheet('To fix', `${ev.errors.map((e) => `<p class="small" style="margin: 0">${esc(e.msg)}</p>`).join('') || '<p class="small">Nothing. The list is legal.</p>'}`, `<div class="grid2"><button class="btn" data-act="closeAll">CLOSE</button><button class="btn solid" data-act="ffCogWhy">ASK THE COGITATOR</button></div>`);
    if (sh.type === 'ffOwn') {
      const own = ffOwned(Dd);
      const opts = FF.options(Dd, ev, null).filter((o) => !o.hidden && !o.group && (o.type === 'unit' || o.type === 'model') && !o.cats.some((c) => /^allies/i.test(ffCatName(Dd, c)))).filter((o, i, l) => l.findIndex((x) => x.name === o.name) === i).sort((a, b) => a.name.localeCompare(b.name));
      const mode = ffOwnMode(); const all = ffState().ownedAll || {};
      const row = (o) => { const k = mode === 'complete' ? 'c:' + o.name : 'a:' + ffOwnedKey(Dd, o.key); const v = ffOwnCount(Dd, o); return `<div class="ff-row"><span class="ff-nm">${esc(o.name)}</span><span class="ff-step"><button class="btn small" data-act="ffOwnN" data-k="${esc(k)}|-1" ${v <= 0 ? 'disabled' : ''} aria-label="One fewer">−</button><b>${v}</b><button class="btn small" data-act="ffOwnN" data-k="${esc(k)}|1" aria-label="One more">+</button></span></div>`; };
      const here = new Set(opts.map((o) => o.name)); const elsewhere = Object.keys(all).filter((n) => all[n] > 0 && !here.has(n)).sort();
      const total = Object.values(all).reduce((a, b) => a + b, 0);
      return sheet('My collection', `<div class="grid2"><button class="btn ${mode === 'complete' ? 'solid' : ''}" data-act="ffOwnMode" data-k="complete" aria-pressed="${mode === 'complete'}">COMPLETE</button><button class="btn ${mode === 'army' ? 'solid' : ''}" data-act="ffOwnMode" data-k="army" aria-pressed="${mode === 'army'}">BY ARMY</button></div>
        <p class="small muted" style="margin: 0">${mode === 'complete' ? `One collection of every unit you own, across all your armies (${total} so far). Each unit counts for every army that can field it, so a Rhino or an Inquisitor you own shows up wherever it can be taken. Below: the ${esc(ffShort(L.facName))} units.` : `Counts kept for ${esc(ffShort(L.facName))} only. Other armies keep their own.`} Turn on "Only units I own" when adding units to build from your shelf.</p>
        ${opts.map(row).join('')}
        ${mode === 'complete' && elsewhere.length ? `<div class="stack" style="gap: 4px"><span class="eyebrow">Also in your collection</span><p class="small muted" style="margin: 0">Owned units this army can't field.</p>${elsewhere.map((n) => `<div class="ff-row"><span class="ff-nm">${esc(n)}</span><span class="ff-step"><button class="btn small" data-act="ffOwnN" data-k="${esc('c:' + n)}|-1" aria-label="One fewer">−</button><b>${all[n]}</b><button class="btn small" data-act="ffOwnN" data-k="${esc('c:' + n)}|1" aria-label="One more">+</button></span></div>`).join('')}</div>` : ''}`, `<button class="btn solid block" data-act="closeAll">DONE</button>`);
    }
    if (sh.type === 'ffMore') return sheet('This list', `<label class="field"><span class="eyebrow">Name</span><input type="text" id="ff-rename" value="${esc(L.name)}" autocomplete="off"></label>`, `<div class="grid2"><button class="btn" data-act="ffDelList" style="color: var(--accent-text)">${UI.ffSure ? 'TAP AGAIN TO DELETE' : 'DELETE LIST'}</button><button class="btn solid" data-act="ffRename">SAVE NAME</button></div>`);
    return '';
  }
  // the list as text, in the Warhammer 40,000 app's layout (other apps and this app's own list reader take it)
  function ffText(Dd, ev, L) {
    const fac = Dd.facName.split(' - '); const short = fac[fac.length - 1];
    const astartes = /Adeptus Astartes/.test(Dd.facName);
    const det = ffConfigSel(Dd, L, /^detachment$/i); const dets = det ? (ev.node(det.u) || { kids: [] }).kids.map((k) => k.eff.name) : [];
    const fd = ffConfigSel(Dd, L, /^force disposition$/i); const fdn = fd && ev.node(fd.u) && ev.node(fd.u).kids[0] ? ev.node(fd.u).kids[0].eff.name : '';
    const size = ev.limit >= 3000 ? 'Onslaught' : ev.limit >= 2000 ? 'Strike Force' : 'Incursion';
    const ALIAS = { 'Agents of the Imperium': 'Imperial Agents' };
    const out = [`${L.name} (${ev.pts} points)`, '', ...(astartes ? (short === 'Space Marines' ? ['Space Marines'] : ['Space Marines', short]) : [ALIAS[short] || short])];
    if (dets.length) out.push(`${dets.join(' and ')} (${ev.dp} Detachment Points)`);
    if (fdn) out.push(fdn);
    out.push(`${size} (${ev.limit} points)`, '');
    const isEnh = (k) => (k.sel.gids || []).some((g) => /enhancement/i.test((FF.R(Dd, g) || {}).name || ''));
    for (const s of L.roster.sels.filter((x) => !ffIsConfig(Dd, x))) {
      const n = ev.node(s.u); if (!n) continue;
      out.push(`${n.eff.name} (${ev.ptsOf(s.u)} points)`);
      const flat = []; const walk = (l) => l.forEach((k) => { flat.push(k); walk(k.kids); }); walk(n.kids);
      if (flat.some((k) => /^warlord$/i.test(k.eff.name))) out.push('  • Warlord');
      flat.filter(isEnh).forEach((k) => out.push('  • Enhancement: ' + k.eff.name));
      const gear = (k, mult, pad) => k.kids.filter((x) => !isEnh(x) && !/^warlord$/i.test(x.eff.name)).forEach((x) => { out.push(`${pad}• ${x.sel.n * mult}x ${x.eff.name}`); gear(x, x.sel.n * mult, pad + '  '); });
      n.kids.filter((k) => !isEnh(k) && !/^warlord$/i.test(k.eff.name)).forEach((k) => {
        if (k.r.type === 'model') { out.push(`  • ${k.sel.n}x ${k.eff.name}`); gear(k, k.sel.n, '    '); if (!k.kids.length) out.push(`    • ${k.sel.n}x ${k.eff.name}`); }
        else { out.push(`  • ${k.sel.n}x ${k.eff.name}`); gear(k, k.sel.n, '    '); }
      });
      out.push('');
    }
    out.push('Exported with 40k Caddie (Footfall)');
    return out.join('\n');
  }
  // what the Cogitator is given while you build
  function ffCogContext() {
    const L = ffCur(); const Dd = L && FFX.data[L.file]; if (!Dd) return 'LIST BUILDING: no list open.';
    const ev = FF.evaluate(Dd, L.roster);
    const cut = (t, n) => { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n) + '…' : t; };
    const out = ['LIST BUILDING in Footfall, the app\'s list builder. The person is building an army list before a game, not playing one. Use the BSData rules data below (points, wargear, enhancements, detachment rules, datasheets).'];
    out.push(`Army: ${ffShort(Dd.facName)}. Points: ${ev.pts} of ${ev.limit}. Detachment points: ${ev.dp}${ev.dpMax !== null ? ' of ' + ev.dpMax : ''}. Enhancements: ${ev.enh}${ev.enhMax !== null ? ' of ' + ev.enhMax : ''}.`);
    const det = ffConfigSel(Dd, L, /^detachment$/i);
    (det && ev.node(det.u) ? ev.node(det.u).kids : []).forEach((k) => { out.push(`Detachment: ${k.eff.name}`); FF.profiles(Dd, k.r.key).forEach((p) => out.push(`  ${p.name}: ${cut(Object.values(p.chars).join(' '), 900)}`)); });
    out.push(ev.errors.length ? 'Problems the builder found (the list is NOT legal until these are fixed):' : 'The builder found no problems: the list is legal.');
    ev.errors.forEach((e) => out.push('- ' + (e.u && e.u !== 'force' && ev.node(e.u) ? ev.node(e.u).eff.name + ': ' : '') + e.msg));
    out.push('\nTHE LIST:'); out.push(ffText(Dd, ev, L));
    // enhancements open to the characters in the list, with what they do
    const seenE = new Set();
    for (const s of L.roster.sels.filter((x) => !ffIsConfig(Dd, x))) {
      for (const o of FF.options(Dd, ev, s.u).filter((o) => !o.group && !o.hidden && o.gids.some((g) => /enhancement/i.test((FF.R(Dd, g) || {}).name || '')))) {
        if (seenE.has(o.name)) continue; seenE.add(o.name);
        if (seenE.size === 1) out.push('\nENHANCEMENTS available in the chosen detachments:');
        out.push(`- ${o.name} (${o.pts} pts): ${cut(FF.profiles(Dd, o.key).map((p) => Object.values(p.chars).join(' ')).join(' '), 500)}`);
      }
    }
    out.push('\nDATASHEETS of units in the list:');
    const seenU = new Set();
    for (const s of L.roster.sels.filter((x) => !ffIsConfig(Dd, x))) {
      const n = ev.node(s.u); if (!n || seenU.has(n.r.id)) continue; seenU.add(n.r.id);
      const ps = FF.unitProfiles(Dd, ev, s.u);
      out.push(`- ${n.eff.name}: ` + ps.map((p) => p.type === 'Abilities' || p.type === 'Rule' ? `${p.name}: ${cut(p.chars.Description, 300)}` : `${p.name} [${Object.entries(p.chars).map(([k, v]) => k + ' ' + v).join(', ')}]`).join(' | '));
    }
    const M = ffMetaFor(Dd);
    if (M) {
      out.push(`\nMETA (11th edition tournament data): ${M.name} win ${M.f.win}% of ${M.f.games} games, rank ${M.f.rank} of ${M.f.of}.`);
      out.push('Units by share of lists, with effect on win rate where clear: ' + Object.entries(M.f.units || {}).map(([n, v]) => `${n} ${Math.round(v.pct)}%${v.z !== null && Math.abs(v.z) >= 2 ? ' (' + (v.eff > 0 ? '+' : '') + v.eff + ' win rate)' : ''}`).join('; '));
      if (M.win && M.win.lists) out.push(`Recent winning lists (${M.win.lists}): ` + Object.entries(M.win.units).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([n, c]) => `${n} in ${c}`).join('; '));
    }
    out.push('\nOTHER UNITS that could be added (name, points):');
    out.push(FF.options(Dd, ev, null).filter((o) => !o.hidden && !o.group && (o.type === 'unit' || o.type === 'model')).filter((o, i, l) => l.findIndex((x) => x.name === o.name) === i).map((o) => `${o.name} ${o.pts}`).join('; '));
    return out.join('\n').slice(0, 110000);
  }
  function ffMutate(fn) {
    const L = ffCur(); const Dd = L && FFX.data[L.file]; if (!Dd || !L.roster) return;
    fn(Dd, L); ffAfter(Dd, L);
  }
  const ffFind = (L, u) => FF.findSel(L.roster, u);
  const FF_ACT = {
    footfall() {
      if (!STANDALONE) { toast('Footfall works in the installed app.'); return 'skip'; }
      S.screen = 'footfall'; UI.ffView = ffCur() ? null : 'lists'; UI.overlay = null; UI.sheet = null; window.scrollTo(0, 0);
      ffIndex().then(() => render()).catch(() => {}); return 'top';
    },
    ffLists() { UI.ffView = 'lists'; UI.sheet = null; window.scrollTo(0, 0); return 'top'; },
    ffOpenList(k) { ffState().cur = k; UI.ffView = null; window.scrollTo(0, 0); return 'top'; },
    ffNew() { UI.sheet = { type: 'ffNew' }; UI.ffName = ''; },
    ffNewSize(k) { const el = document.getElementById('ff-name'); UI.ffName = el ? el.value : UI.ffName; UI.ffSize = k; },
    ffCreate(file) {
      const el = document.getElementById('ff-name'); const name = ((el && el.value) || '').trim();
      const fac = (FFX.idx.factions.find((f) => f.file === file) || {}).name || file;
      UI.sheet = null; UI.ffView = null;
      const id = 'L' + Date.now().toString(36);
      const st = ffState();
      st.lists[id] = { id, name: name || ffShort(fac) + ' list', file, facName: fac, roster: null, pts: 0, limit: 0, ok: false, updated: Date.now() };
      st.cur = id;
      ffData(file).then((Dd) => { const L = st.lists[id]; if (L && !L.roster) { L.roster = FF.newRoster(Dd, UI.ffSize || 'Strike Force'); ffAfter(Dd, L); } save(); render(); }).catch(() => render());
      window.scrollTo(0, 0); return 'top';
    },
    ffSize(k) { ffMutate((Dd, L) => { const bs = ffConfigSel(Dd, L, /^battle size$/i); if (!bs) return; const ev = FF.evaluate(Dd, L.roster); const o = FF.options(Dd, ev, bs.u).find((x) => x.key === k); if (o) FF.setSize(Dd, L.roster, o.name.replace(/^\d+\.\s*/, '').replace(/\s*\(.*\)/, '')); }); },
    ffDetOpen() { UI.sheet = { type: 'ffDet' }; },
    ffDet(k) { ffMutate((Dd, L) => { const det = ffConfigSel(Dd, L, /^detachment$/i); if (!det) return; const i = det.kids.findIndex((x) => x.k === k); if (i >= 0) det.kids.splice(i, 1); else { const ev = FF.evaluate(Dd, L.roster); const o = FF.options(Dd, ev, det.u).find((x) => x.key === k); if (o) FF.add(Dd, L.roster, det.u, o.key, o.gids, 1, true); } }); },
    ffFD(k) { ffMutate((Dd, L) => { const fd = ffConfigSel(Dd, L, /^force disposition$/i); if (!fd) return; const ev = FF.evaluate(Dd, L.roster); const o = FF.options(Dd, ev, fd.u).find((x) => x.key === k); fd.kids = []; if (o) FF.add(Dd, L.roster, fd.u, o.key, o.gids, 1, true); }); },
    ffSeal() {
      const L = ffCur(); const Dd = L && FFX.data[L.file]; if (!Dd) return;
      const ev = FF.evaluate(Dd, L.roster);
      if (ev.errors.length) { UI.sheet = { type: 'ffErrs' }; return; }
      // to the home world: the list becomes your army for the next battle
      let parsed; try { parsed = parseList(ffText(Dd, ev, L)); } catch (e) { toast('The list could not be carried over.'); return; }
      const short = ffShort(Dd.facName);
      const key = ({ 'Black Templars': 'templars', ...MAINABLE })[short];
      if (key && myArmies().includes(key)) { S.army = key; S.lists[key] = parsed; }
      else { S.army = 'other'; S.facKey = null; S.lists.other = parsed; rememberFac(parsed); }
      S.screen = 'muster'; UI.sheet = null; toast(ffSealOf(Dd)[1] + ': ' + L.name + ' is bound for ' + homeWorld().name); window.scrollTo(0, 0); return 'top';
    },
    ffUnit(u) { UI.sheet = { type: 'ffUnit', u }; },
    ffAddOpen() { UI.sheet = { type: 'ffAdd' }; UI.ffQ = ''; },
    ffAddKey(k) {
      let made = null;
      ffMutate((Dd, L) => { const ev = FF.evaluate(Dd, L.roster); const o = FF.options(Dd, ev, null).find((x) => x.key === k); if (o) made = FF.add(Dd, L.roster, null, o.key, o.gids, 1); });
      if (made) { UI.sheet = { type: 'ffUnit', u: made.u }; }
    },
    ffN(k) {
      const [pu, key, d] = k.split('|');
      ffMutate((Dd, L) => {
        const P = ffFind(L, pu); if (!P) return;
        const have = P.s.kids.find((x) => x.k === key);
        if (+d > 0) { if (have) have.n += 1; else { const ev = FF.evaluate(Dd, L.roster); const o = FF.options(Dd, ev, pu).find((x) => x.key === key); if (o) FF.add(Dd, L.roster, pu, o.key, o.gids, 1); } }
        else if (have) FF.setN(L.roster, have.u, have.n - 1);
      });
    },
    ffPick(k) {
      const [pu, key, gk] = k.split('|');
      ffMutate((Dd, L) => {
        const P = ffFind(L, pu); if (!P) return;
        const have = P.s.kids.find((x) => x.k === key);
        // tap a chosen option again to take it off (an enhancement, a single upgrade); a choice the unit must make stays, swap it for another instead
        if (have) { const g = gk && FF.options(Dd, FF.evaluate(Dd, L.roster), pu).find((x) => x.key === gk); if (!g || !(g.min > 0)) FF.remove(L.roster, have.u); return; }
        if (gk) P.s.kids.filter((x) => (x.gids || []).includes(gk)).forEach((x) => FF.remove(L.roster, x.u));
        const ev = FF.evaluate(Dd, L.roster); const o = FF.options(Dd, ev, pu).find((x) => x.key === key); if (o) FF.add(Dd, L.roster, pu, o.key, o.gids, 1);
      });
    },
    ffAttach(k) { const [u, a, t] = k.split('|'); ffMutate((Dd, L) => FF.attach(L.roster, u, a, t || null)); },
    ffDup(u) { let made = null; ffMutate((Dd, L) => { const f = ffFind(L, u); if (!f) return; const copy = JSON.parse(JSON.stringify(f.s)); const re = (s) => { s.u = 's' + Math.random().toString(36).slice(2, 10); delete s.as; (s.kids || []).forEach(re); }; re(copy); L.roster.sels.push(copy); made = copy; }); if (made) UI.sheet = { type: 'ffUnit', u: made.u }; },
    ffDel(u) { ffMutate((Dd, L) => FF.remove(L.roster, u)); UI.sheet = null; },
    ffErrs() { UI.sheet = { type: 'ffErrs' }; },
    ffMetaOpen() { UI.sheet = { type: 'ffMeta' }; },
    ffOwnOpen() { UI.sheet = { type: 'ffOwn' }; },
    ffOwnN(k) {
      const L = ffCur(); const Dd = L && FFX.data[L.file]; if (!Dd) return; const i = k.lastIndexOf('|'); const key = k.slice(0, i), d = +k.slice(i + 1);
      const st = ffState(); const own = key.startsWith('c:') ? (st.ownedAll = st.ownedAll || {}) : ffOwned(Dd); const id = key.slice(2);
      own[id] = Math.max(0, (own[id] || 0) + d); if (!own[id]) delete own[id];
    },
    // switching to Complete the first time carries over what this army already counted
    ffOwnMode(k) {
      const st = ffState(); st.ownMode = k === 'complete' ? 'complete' : 'army';
      if (st.ownMode === 'complete') { const L = ffCur(); const Dd = L && FFX.data[L.file]; if (!Dd) return; st.ownedAll = st.ownedAll || {}; const own = ffOwned(Dd);
        FF.options(Dd, FF.evaluate(Dd, L.roster), null).forEach((o) => { const v = own[ffOwnedKey(Dd, o.key)] || 0; if (v > (st.ownedAll[o.name] || 0)) st.ownedAll[o.name] = v; }); }
    },
    ffOwnedOnly() { const st = ffState(); st.ownedOnly = !st.ownedOnly; },
    ffCopy() { const L = ffCur(); const Dd = L && FFX.data[L.file]; if (!Dd) return 'skip'; const t = ffText(Dd, FF.evaluate(Dd, L.roster), L); (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast('List copied'), () => toast('Could not copy on this device')); return 'skip'; },
    ffMore() { UI.sheet = { type: 'ffMore' }; UI.ffSure = false; },
    ffRename() { const L = ffCur(); const el = document.getElementById('ff-rename'); if (L && el && el.value.trim()) L.name = el.value.trim(); UI.sheet = null; },
    ffDelList() { if (!UI.ffSure) { UI.ffSure = true; return; } const st = ffState(); delete st.lists[st.cur]; st.cur = null; UI.sheet = null; UI.ffView = 'lists'; UI.ffSure = false; },
    ffCog() { return ffCogOpen(''); },
    ffCogWhy() { return ffCogOpen('Why is my list not legal, and what is the simplest way to fix each problem?'); },
    ffCogUnit(u) { const L = ffCur(); const Dd = L && FFX.data[L.file]; const n = Dd && FF.evaluate(Dd, L.roster).node(u); return ffCogOpen(n ? `What are the best choices for my ${n.eff.name} (wargear, enhancement, who it should join)?` : ''); },
  };
  function ffCogOpen(q) {
    const r = ACT.cogitator(); if (r === 'skip') return 'skip';
    UI.ffCogQ = q; setTimeout(() => { const el = document.getElementById('cog-q'); if (el && q && !el.value) el.value = q; }, 30);
  }
  Object.assign(ACT, FF_ACT);

  // ---------- the Cogitator: questions about the battle in front of you, answered from the real rules ----------
  function cogContext() {
    if (S.screen === 'footfall') return ffCogContext();
    const B = S.battle && !S.battle.ended ? S.battle : null; const L = list(); const F = foe();
    const cut = (t, n) => { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n) + '…' : t; };
    const st = (m) => `M${m.M} T${m.T} Sv${m.Sv}${m.InSv && m.InSv !== '-+' ? ' (' + m.InSv + ' invuln)' : ''} W${m.W} Ld${m.LD} OC${m.OC}`;
    const wpn = (w) => `${w.name} ${w.Range} A${w.A} ${w.BS ? 'BS' + w.BS : 'WS' + (w.WS || '')} S${w.S} AP${w.AP} D${w.D}${w.Keywords ? ' [' + w.Keywords + ']' : ''}`;
    const sheetOf = (name, d) => !d ? `- ${name}: no datasheet in the app` : `- ${name}: ${d.m.map((m) => m.name + ' ' + st(m)).join('; ')}
  Ranged: ${(d.r || []).map(wpn).join('; ') || 'none'}
  Melee: ${(d.ml || []).map(wpn).join('; ') || 'none'}
  Abilities: ${(d.ab || []).map((a) => a[0] + ': ' + cut(a[1], 260)).join(' | ') || 'none'}
  Keywords: ${(d.kw || []).concat(d.fk || []).join(', ')}`;
    const stratLine = (x) => `- ${x.name} (${x.cp} CP, ${x.det}${x.turn ? ', ' + x.turn + ' turn' : ''}${x.phases ? ', ' + x.phases.join('/') : ''}). When: ${cut(x.when, 220)} Target: ${cut(x.target, 160)} Effect: ${cut(x.effect, 420)}`;
    const foeStratLine = (a) => stratLine({ det: a[0], name: a[1], cp: a[2], turn: a[3], phases: a[4], effect: a[5], when: a[6], target: a[7] });
    const out = [];
    if (B) out.push(`GAME: Round ${B.round} of 5, ${PHASES[B.phase]} phase, ${B.turn === 'me' ? 'MY' : 'THEIR'} turn. CP: me ${B.cp.me}, them ${B.cp.foe}. VP: me ${B.vp.me}, them ${B.vp.foe}.${B.primary && B.primary.me ? ' Primary: me ' + B.primary.me + (B.primary.foe ? ', them ' + B.primary.foe : '') + '.' : ''}${S.field.deployment ? ' Deployment: ' + S.field.deployment + '.' : ''}`);
    else out.push('GAME: not started. Questions are about list building, deployment or rules.');
    // my army
    if (L) {
      const lf = listFaction(L) || (ARMY[S.army] && ARMY[S.army].lib) || ''; const sm = isAstartes() || (FD(lf) && FD(lf).base === 'SM') || /Space Marines|Adeptus Astartes/i.test(L.faction || '');
      out.push(`\nMY ARMY: ${L.name} (${[L.subfaction, L.faction].filter(Boolean).join(', ')}). Detachments: ${(L.detachments || []).join(', ') || 'none listed'}.`);
      if (sm) D.rulesSM.detachments.filter((d) => (L.detachments || []).includes(d.name)).forEach((d) => out.push(`Detachment rule (${d.name}): ${(d.rules || [d.rule]).map((r) => r.name + ': ' + cut(r.text, 600)).join(' | ')}`));
      else if (FD(lf)) FD(lf).detachments.filter((d) => (L.detachments || []).includes(d.name)).forEach((d) => out.push(`Detachment rule (${d.name}): ${cut(typeof d.rule === 'string' ? d.rule : JSON.stringify(d.rule), 600)}`));
      const units = B ? B.units : L.units.map((u) => ({ name: u.name, models: [], warlord: u.warlord }));
      out.push('My units' + (B ? ' (models alive / total, wounds left)' : '') + ':');
      units.forEach((u) => { const al = u.models.filter((m) => m.wl > 0).length; out.push(`- ${u.name}${u.warlord ? ' (Warlord)' : ''}${B ? `: ${al}/${u.models.length} models, ${u.models.reduce((t, m) => t + m.wl, 0)} wounds left${al ? '' : ' DESTROYED'}` : ''}`); });
      out.push('My datasheets:'); [...new Set(units.map((u) => u.name))].forEach((n) => out.push(sheetOf(n, ds(n))));
      out.push('My stratagems:');
      const mine = sm ? D.rulesSM.stratagems.filter((x) => (L.detachments || []).includes(x.det)) : ((FD(lf) && FD(lf).stratagems) || []).filter((a) => (L.detachments || []).includes(a[0])).map((a) => ({ det: a[0], name: a[1], cp: a[2], turn: a[3], phases: a[4], effect: a[5], when: a[6], target: a[7] }));
      mine.concat(D.rulesSM.core.map((x) => ({ ...x, det: 'Core' }))).forEach((x) => out.push(stratLine(x)));
    }
    // their army
    if (F) {
      const fd = FD(F.faction);
      out.push(`\nTHEIR ARMY: ${F.name ? F.name + ', ' : ''}${F.faction}. Detachments: ${(F.detachments || []).join(', ') || 'not known'}.${F.warlord ? ' Warlord: ' + F.warlord + '.' : ''}${B && B.foeWarlordDead ? ' Their warlord is dead.' : ''}`);
      if (fd) {
        (fd.army_rules || []).filter(Boolean).forEach((r) => out.push(`Army rule (${r.name}): ${cut(r.text || r.desc || '', 600)}`));
        fd.detachments.filter((d) => (F.detachments || []).includes(d.name)).forEach((d) => out.push(`Detachment rule (${d.name}): ${cut(typeof d.rule === 'string' ? d.rule : JSON.stringify(d.rule), 600)}`));
        const linked = B && (B.foeUnits || []).length;
        const names = linked ? B.foeUnits.map((u) => u.name) : B ? B.spotted.map((x) => x.name) : [];
        if (linked) { out.push('Their units (live from their phone):'); B.foeUnits.forEach((u) => { const al = u.models.filter((m) => m.wl > 0).length; out.push(`- ${u.name}: ${al}/${u.models.length} models, ${u.models.reduce((t, m) => t + m.wl, 0)} wounds left${al ? '' : ' DESTROYED'}`); }); }
        else if (names.length) out.push('Their units spotted so far: ' + names.join(', ') + '.');
        if (names.length) { out.push('Their datasheets:'); [...new Set(names)].forEach((n) => out.push(sheetOf(n, foeUnits(F.faction)[n]))); }
        const fs = (fd.stratagems || []).filter((a) => !(F.detachments || []).length || (F.detachments || []).includes(a[0]));
        out.push('Their stratagems:'); fs.slice(0, 60).forEach((a) => out.push(foeStratLine(a)));
      }
    }
    return out.join('\n');
  }
  const cogFmt = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
  async function cogCall(body) {
    const { data, error } = await STANDALONE.client.functions.invoke('cogitator', { body });
    if (!error) return data;
    let d = null; try { d = await error.context.json(); } catch (e) { /* no body */ }
    return Object.assign({ error: (d && (d.why || d.error)) || 'The Cogitator could not be reached. Are you online?' }, d || {});
  }
  async function cogCheck() {
    if (!STANDALONE || !SYNC.on || !SYNC.email) { UI.cogOK = false; return; }
    const r = await cogCall({ check: true }).catch(() => null);
    UI.cogOK = !!(r && r.allowed); UI.cogLeft = r ? r.left : null;
    if (S.screen === 'home' && !UI.overlay) render();
  }
  async function cogAsk() {
    const el = document.getElementById('cog-q'); const q = ((el && el.value) || '').trim(); if (!q || UI.cogBusy) return;
    UI.cog = UI.cog || []; const hist = UI.cog.filter((x) => x.a && !x.err).slice(-3).map((x) => ({ q: x.q, a: x.a }));
    const item = { q, a: '' }; UI.cog.push(item); UI.cogBusy = true; render();
    const r = await cogCall({ question: q, context: cogContext(), history: hist }).catch((e) => ({ error: e.message }));
    if (r && r.answer) { item.a = r.answer; if (r.left !== undefined) UI.cogLeft = r.left; }
    else { item.a = (r && r.error) || 'No answer came back.'; item.err = true; if (r && r.left === 0) UI.cogLeft = 0; }
    UI.cogBusy = false; render();
    setTimeout(() => { const b = document.querySelector('#overlay .sheet-body'); if (b) b.scrollTop = b.scrollHeight; }, 30);
  }

  // ---------- the Webway: two phones, one battle ----------
  // The game lives in one shared row (Supabase "live_games"), written from the host's point of view.
  // Each phone owns its own side (CP, VP, cards, units); the shared board (round, phase, turn, objectives)
  // belongs to whoever changed it last. A guest's phone flips everything so "me" is always the person holding it.
  const swapSide = (v) => (v === 'me' ? 'foe' : v === 'foe' ? 'me' : v);
  function flipBattle(b) {
    const x = JSON.parse(JSON.stringify(b));
    const sw = (o) => { if (o && typeof o === 'object' && 'me' in o && 'foe' in o) { const t = o.me; o.me = o.foe; o.foe = t; } };
    ['cp', 'vp', 'obj', 'primary', 'cards', 'ready', 'deck'].forEach((k) => sw(x[k]));
    x.turn = swapSide(x.turn);
    [x.units, x.foeUnits] = [x.foeUnits || [], x.units || []];
    [x.tactical, x.foeTactical] = [x.foeTactical, x.tactical];
    Object.values(x.rounds || {}).forEach((R) => { sw(R.pri); sw(R.sec); if (R.obj) R.obj = R.obj.map(swapSide); if (R.grid) R.grid = R.grid.map(swapSide); });
    return x;
  }
  const LOCAL_ONLY = ['log', 'cpDone', 'cpLast', 'foeWarlordDead', 'spotted', 'doctrine', 'link'];
  // the shared board, piece by piece: game flow, each objective, each table square, each quarter, kills per round.
  // Every piece carries a counter of when it last changed, so two people changing different pieces never clash.
  function boardItems(b) {
    const out = { flow: [b.round, b.phase, b.turn, !!b.ended], on: b.objNames };
    Object.entries(b.rounds || {}).forEach(([r, R]) => {
      (R.obj || []).forEach((v, i) => { out['o:' + r + ':' + i] = v; });
      (R.grid || []).forEach((v, i) => { out['g:' + r + ':' + i] = v; });
      (R.quarters || []).forEach((v, i) => { out['q:' + r + ':' + i] = v; });
      out['k:' + r] = R.kills;
    });
    return out;
  }
  function setItem(b, k, v) {
    if (k === 'flow') { [b.round, b.phase, b.turn, b.ended] = v; return; }
    if (k === 'on') { b.objNames = v; return; }
    const [t, r, i] = k.split(':'); const R = b.rounds && b.rounds[r]; if (!R) return;
    if (t === 'k') R.kills = v; else { const arr = t === 'o' ? 'obj' : t === 'g' ? 'grid' : 'quarters'; if (R[arr]) R[arr][+i] = v; }
  }
  // stamp whatever changed on this phone since the last look
  function stampLocal() {
    const B = S.battle; if (!B) return; B.stamp = B.stamp || {};
    const cur = boardItems(B); const snap = LIVE.snap || {};
    Object.keys(cur).forEach((k) => { if (JSON.stringify(cur[k]) !== JSON.stringify(snap[k])) B.stamp[k] = ++LIVE.clock; });
    LIVE.snap = cur;
  }
  function liveBaseline(b) { b.stamp = b.stamp || {}; LIVE.clock = Math.max(LIVE.clock || 0, ...Object.values(b.stamp), 0); LIVE.snap = boardItems(b); }
  // fold the other phone's copy (already turned to this phone's point of view) into ours
  function mergeLive(local, remote) {
    const base = JSON.parse(JSON.stringify(local));
    const own = (b, side) => ({ cp: b.cp[side], vp: b.vp[side], obj: b.obj && b.obj[side], primary: b.primary && b.primary[side], cards: b.cards[side], ready: b.ready && b.ready[side], deck: b.deck && b.deck[side], tac: side === 'me' ? b.tactical : b.foeTactical, units: side === 'me' ? b.units : b.foeUnits,
      pri: Object.fromEntries(Object.entries(b.rounds || {}).map(([k, R]) => [k, R.pri && R.pri[side]])), sec: Object.fromEntries(Object.entries(b.rounds || {}).map(([k, R]) => [k, R.sec && R.sec[side]])) });
    const put = (b, side, o) => {
      b.cp[side] = o.cp; b.vp[side] = o.vp; if (b.obj) b.obj[side] = o.obj; if (b.primary) b.primary[side] = o.primary; b.cards[side] = o.cards || []; if (b.ready) b.ready[side] = o.ready; if (b.deck && o.deck) b.deck[side] = o.deck;
      if (side === 'me') { b.tactical = o.tac; b.units = o.units || []; } else { b.foeTactical = o.tac; b.foeUnits = o.units || []; }
      Object.keys(o.pri).forEach((k) => { if (!b.rounds[k]) return; if (b.rounds[k].pri) b.rounds[k].pri[side] = o.pri[k] || 0; if (b.rounds[k].sec) b.rounds[k].sec[side] = o.sec[k] || 0; });
    };
    // every round either phone has opened exists on both
    Object.keys(local.rounds || {}).concat(Object.keys(remote.rounds || {})).forEach((k) => { if (!base.rounds[k]) base.rounds[k] = JSON.parse(JSON.stringify((local.rounds || {})[k] || remote.rounds[k])); });
    const ls = local.stamp || {}, rs = remote.stamp || {}; const ri = boardItems(remote); base.stamp = Object.assign({}, ls);
    Object.keys(ri).forEach((k) => { if ((rs[k] || 0) > (ls[k] || 0)) { setItem(base, k, JSON.parse(JSON.stringify(ri[k]))); base.stamp[k] = rs[k]; } });
    LIVE.clock = Math.max(LIVE.clock || 0, ...Object.values(rs), 0);
    put(base, 'me', own(local, 'me')); put(base, 'foe', own(remote, 'foe'));
    LOCAL_ONLY.forEach((k) => { if (local[k] !== undefined) base[k] = local[k]; else delete base[k]; });
    return base;
  }
  const liveCode = () => { const A = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; let s = ''; for (let i = 0; i < 6; i++) s += A[Math.floor(Math.random() * A.length)]; return s; };
  const liveLink = (id) => location.origin + location.pathname + '#ww=' + id;
  async function liveAuth() {
    const sb = STANDALONE && STANDALONE.client; if (!sb) throw new Error('The Webway works in the installed app or in a browser, not inside Claude.');
    if (await STANDALONE.uid()) return sb;
    const { error } = await sb.auth.signInAnonymously(); if (error) throw new Error('Could not open the Webway (' + error.message + ').');
    return sb;
  }
  function liveDoc() {
    const B = S.battle; const b = {}; Object.keys(B).forEach((k) => { if (!LOCAL_ONLY.includes(k)) b[k] = B[k]; });
    const host = LIVE.role === 'host'; const L = list();
    const wl = L && (L.units || []).find((u) => u.warlord);
    const mine = { name: (L && L.name) || '', faction: (L && L.faction) || A().name, sub: (L && L.subfaction) || '', dets: (L && L.detachments) || [], warlord: wl ? wl.name : '', at: new Date().toISOString() };
    return { b: host ? b : flipBattle(b), first: host ? S.field.first : swapSide(S.field.first), writer: LIVE.me,
      host: host ? mine : (LIVE.other || {}), guest: host ? (LIVE.other || null) : mine, mode: S.field.mode || 'comp' };
  }
  function livePush(now) {
    if (!LIVE.on) return; clearTimeout(LIVE.pt);
    LIVE.pt = setTimeout(async () => {
      stampLocal();
      try { const { error } = await LIVE.sb.from('live_games').update({ data: liveDoc(), updated_at: new Date().toISOString() }).eq('id', LIVE.id); if (error) throw error; LIVE.err = ''; }
      catch (e) { LIVE.err = 'Not reaching the Webway. Changes will send when the signal is back.'; }
    }, now ? 0 : 350);
  }
  function liveReceive(d) {
    if (!d || !d.b || d.writer === LIVE.me || !S.battle) return;
    const host = LIVE.role === 'host';
    const was = LIVE.other && LIVE.other.at; LIVE.other = host ? d.guest : d.host;
    if (LIVE.other && LIVE.other.at !== was) { liveRival(LIVE.other); if (host && !was) toast((LIVE.other.name || 'Your opponent') + ' joined through the Webway.'); }
    const remote = host ? d.b : flipBattle(d.b);
    const B0 = S.battle; const wasR = B0.round, wasT = B0.turn;
    stampLocal(); // changes made here but not sent yet keep their place in line
    const merged = mergeLive(S.battle, remote);
    S.battle = merged; LIVE.snap = boardItems(merged);
    if (merged.round !== wasR || merged.turn !== wasT) { autoCP(merged, merged.round !== wasR); if (merged.turn === 'me') toast('Your turn. Command phase.'); }
    if (merged.ended && !B0.ended) { S.screen = 'results'; toast('They ended the battle.'); }
    save(); if (!UI.overlay || UI.overlay === 'webway') render();
    // their copy of my side is out of date: send mine again
    const mineNow = JSON.stringify([merged.cp.me, merged.vp.me, merged.cards.me]); const mineThere = JSON.stringify([remote.cp.me, remote.vp.me, remote.cards.me]);
    if (mineNow !== mineThere) livePush();
  }
  async function liveListen() {
    if (LIVE.ch) { try { LIVE.sb.removeChannel(LIVE.ch); } catch (e) { /* ignore */ } }
    LIVE.ch = LIVE.sb.channel('ww:' + LIVE.id).on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'live_games', filter: 'id=eq.' + LIVE.id }, (p) => liveReceive(p.new && p.new.data)).subscribe();
    // catch up after the phone wakes or the signal drops
    if (!LIVE.vis) { LIVE.vis = true; document.addEventListener('visibilitychange', () => { if (LIVE.on && document.visibilityState === 'visible') liveFetch(); }); }
  }
  async function liveFetch() { try { const { data } = await LIVE.sb.from('live_games').select('data').eq('id', LIVE.id).maybeSingle(); if (data) liveReceive(data.data); } catch (e) { /* next change catches up */ } }
  async function liveOpen() {
    UI.liveBusy = true; LIVE.err = ''; render();
    try {
      const sb = await liveAuth(); LIVE.sb = sb; LIVE.role = 'host'; LIVE.id = liveCode(); LIVE.clock = 0; S.battle.stamp = {}; LIVE.other = null;
      S.battle.link = { id: LIVE.id, role: 'host' };
      const { error } = await sb.from('live_games').insert({ id: LIVE.id, data: liveDoc() }); if (error) throw new Error(error.message);
      liveBaseline(S.battle); LIVE.on = true; await liveListen(); save();
    } catch (e) { LIVE.err = e.message; delete S.battle.link; }
    UI.liveBusy = false; render();
  }
  function liveRival(o) {
    if (!o) return; const known = (n) => n && (FACTION_FILES[n] || FOES[n]);
    const faction = [o.sub, o.faction].find(known) || o.faction || 'Space Marines';
    const prev = S.rivals.webway || {};
    S.rivals.webway = { faction, name: o.name || 'Webway opponent', detachments: o.dets || [], warlord: o.warlord || '', notes: prev.faction === faction ? prev.notes || '' : '', record: prev.record || [0, 0] };
    S.foeKey = 'webway'; if (!FOES[faction]) loadFaction(faction);
  }
  async function liveJoin(code) {
    UI.liveBusy = true; LIVE.err = ''; render();
    try {
      const id = (code || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); if (id.length !== 6) throw new Error('The code is 6 letters and numbers.');
      if (!list()) throw new Error('Load your army list first.');
      const sb = await liveAuth(); LIVE.sb = sb;
      const { data, error } = await sb.from('live_games').select('data').eq('id', id).maybeSingle();
      if (error) throw new Error(error.message); if (!data || !data.data || !data.data.b) throw new Error('No battle with that code. Check it with your opponent.');
      const d = data.data; LIVE.id = id; LIVE.role = 'guest'; LIVE.other = d.host;
      if (S.battle && !S.battle.ended && S.screen === 'battle' && !(S.battle.link && S.battle.link.id === id)) archiveBattle('unfinished');
      const b = flipBattle(d.b);
      // my side comes from my own list; theirs is already in the shared copy
      S.field.first = swapSide(d.first); S.field.mode = d.mode;
      await ensureFaction(listFaction(list()));
      const keep = S.battle; S.battle = b; b.log = []; b.cpDone = {}; b.spotted = []; b.units = buildUnits(list());
      // the host's army becomes this phone's opponent
      liveRival(d.host); ensureRound(b.round);
      b.link = { id, role: 'guest' }; b.cp.me = b.cp.me || 0;
      // CP already handed out this game: the host's phone gave both sides the same amount
      b.cpDone[b.round + '-' + b.turn] = true;
      addLog('Joined ' + ((d.host && d.host.name) || 'the battle') + ' through the Webway.', 'event');
      liveBaseline(b); LIVE.on = true; S.screen = 'battle'; UI.view = 'emblem'; UI.overlay = null; UI.sheet = null;
      await liveListen(); livePush(true); save(); void keep;
      location.hash = '';
      toast('Linked. You run your side; they run theirs.');
    } catch (e) { LIVE.err = e.message; }
    UI.liveBusy = false; render();
  }
  function liveClose() {
    if (LIVE.ch) { try { LIVE.sb.removeChannel(LIVE.ch); } catch (e) { /* ignore */ } }
    LIVE.on = false; LIVE.ch = null; if (S.battle) delete S.battle.link; save();
  }
  // a battle that was linked when the app closed picks the link back up
  async function liveResume() {
    const L = S.battle && !S.battle.ended && S.battle.link; if (!L || !STANDALONE) return;
    try { LIVE.sb = await liveAuth(); LIVE.id = L.id; LIVE.role = L.role; liveBaseline(S.battle); LIVE.on = true; await liveListen(); await liveFetch(); } catch (e) { LIVE.on = false; }
  }
  const liveGuard = (act, el) => {
    if (!LIVE.on || !S.battle) return '';
    const B = S.battle; const w = el.dataset.w || el.dataset.k;
    const theirs = { adj: el.dataset.w === 'foe', rv: el.dataset.w === 'foe', priAdd: el.dataset.k === 'foe', secAdd: w === 'foe', cardDone: el.dataset.w === 'foe', cardDrop: el.dataset.w === 'foe', ready: el.dataset.k === 'foe', foeUsed: true, dealNow: el.dataset.w === 'foe', foeWlDead: true };
    if (theirs[act]) return 'That is their side. They update it on their phone.';
    if ((act === 'phase' || act === 'startRound' || act === 'nextRound') && B.turn !== 'me') return 'Their turn. They move the game on from their phone.';
    return '';
  };
  // ---------- the vessel: each army's watchers fly every screen; tap one to send a report ----------
  const SB_URL = 'https://tgwhmyktpibcpivakwwn.supabase.co';
  const SB_PUB = 'sb_publishable_OQUa3i86YIeb_IG3B8EbjQ_x5oh7VX5'; // the publishable key: public by design
  const VES = {
    inq: { who: 'The Inquisition', ship: 'Inquisitorial cruiser', img: 'lib/pmwves_inq.webp', w: 71, face: 1, beam: '255, 70, 50', line: 'The Inquisition hears every fault. Report a bug, or ask for something the app should do.' },
    tau: { who: 'The Edification Corps', ship: 'Manta', img: 'lib/pmwves_tau.webp', w: 58, face: 0, beam: '90, 190, 255', line: 'The Edification Corps records every fault for the Greater Good. Report a bug, or ask for something the app should do.' },
    nec: { who: 'The Triarch Praetorians', ship: 'Night Scythe', img: 'lib/pmwves_nec.webp', w: 50, face: 0, beam: '120, 255, 110', line: 'The Triarch Praetorians judge every breach of the codes. Report a bug, or ask for something the app should do.' },
    chs: { who: 'The Cognitae', ship: 'Chaos cruiser', img: 'lib/pmwves_chs.webp', w: 71, face: 1, beam: '230, 40, 40', line: 'The Cognitae hear every flaw. Report a bug, or ask for something the app should do.' },
    eld: { who: 'The Harlequins', ship: 'Starweaver', img: 'lib/pmwves_eld.webp', w: 50, face: -1, beam: '120, 240, 230', line: 'The Masque has seen every misstep. Report a bug, or ask for something the app should do.' },
    dru: { who: 'The Incubi', ship: 'Raider', img: 'lib/pmwves_dru.webp', w: 54, face: -1, beam: '200, 80, 255', line: 'The Incubi have marked every weakness. Report a bug, or ask for something the app should do.' },
  };
  const ARMY_VES = { necron: 'nec', asuryani: 'eld' };
  function vesselKey() {
    const vk = (location.search.match(/[?&]vk=(\w+)/) || [])[1]; if (vk && VES[vk]) return vk; // for checking each vessel
    if (ARMY_VES[S.army]) return ARMY_VES[S.army];
    const f = (S.army === 'other' ? listFaction(list()) || (list() && list().faction) || '' : (ARMY[S.army] && (ARMY[S.army].lib || ARMY[S.army].label)) || '').toLowerCase();
    if (/t'?au\b/.test(f)) return 'tau';
    if (/necron/.test(f)) return 'nec';
    if (/drukhari/.test(f)) return 'dru';
    if (/aeldari|asuryani|harlequin|ynnari|craftworld/.test(f)) return 'eld';
    if (/chaos|death guard|thousand sons|world eaters|emperor's children|daemon|heretic/.test(f)) return 'chs';
    return 'inq'; // the Imperium, and Orks, Tyranids, Genestealer Cults and Votann
  }
  const VS = { key: null, gen: 0, el: null, x: 0, y: 0, anim: null, hold: false, shown: false, nextRaid: 0, raiding: false };
  const vwait = (ms) => new Promise((r) => setTimeout(r, ms));
  const vrand = (a, b) => a + Math.random() * (b - a);
  const vlayer = () => { let l = document.getElementById('vessels'); if (!l) { l = document.createElement('div'); l.id = 'vessels'; document.body.appendChild(l); } return l; };
  const vbusy = () => !!(UI.sheet || UI.overlay) || document.hidden;
  function vmake(k, mine) {
    const V = VES[k]; const b = document.createElement(mine ? 'button' : 'div');
    b.className = 'vessel ' + (mine ? 'mine' : 'raider') + ' v-' + k;
    if (mine) { b.type = 'button'; b.dataset.act = 'feedback'; b.setAttribute('aria-label', V.who + ': report a bug or send feedback'); b.title = V.who + ' · report a bug or send feedback'; }
    b.innerHTML = `<img src="${V.img}" alt="" draggable="false" style="width: ${V.w}px">`;
    b.style.setProperty('--beam', V.beam);
    vlayer().appendChild(b); return b;
  }
  const vplace = (el, x, y) => { el.style.transform = `translate(${x}px, ${y}px)`; };
  // turn to face where it is heading (ships drawn side-on flip; top-down ones only tilt)
  function vface(el, k, dx, dy) {
    const V = VES[k]; const img = el.querySelector('img'); if (!img) return;
    const flip = V.face && dx ? (Math.sign(dx) === V.face ? 1 : -1) : 1;
    const tilt = Math.max(-10, Math.min(10, (dy / (Math.abs(dx) + 40)) * 10)) * (V.face ? flip * V.face : 1);
    img.style.transform = `scaleX(${flip}) rotate(${V.face ? tilt * flip : tilt}deg)`;
  }
  async function vmove(el, k, x0, y0, x1, y1, ms, gen, pts) {
    vface(el, k, x1 - x0, y1 - y0);
    const frames = (pts || [[x0, y0], [x1, y1]]).map(([x, y]) => ({ transform: `translate(${x}px, ${y}px)` }));
    const a = el.animate(frames, { duration: ms, easing: pts ? 'linear' : 'cubic-bezier(.45,.05,.4,1)', fill: 'forwards' });
    if (el === VS.el) { VS.anim = a; if (VS.hold) a.pause(); }
    try { await a.finished; } catch (e) { /* cancelled */ }
    if (gen !== VS.gen) return false;
    vplace(el, x1, y1); a.cancel(); if (el === VS.el) { VS.anim = null; VS.x = x1; VS.y = y1; }
    return true;
  }
  // something on screen worth scanning: a world, a button, a heading, a panel
  function vtarget() {
    const W = innerWidth, H = innerHeight;
    const els = [...document.querySelectorAll('#root .world, #root .btn, #root .army-btn, #root h1, #root h2, #root .panel, #root .chip, #root .sol')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 10 && r.bottom > 60 && r.top < H - 60 && r.left < W && r.right > 0; });
    if (els.length && Math.random() < 0.8) { const r = els[Math.floor(Math.random() * els.length)].getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
    return [vrand(40, W - 40), vrand(80, H - 80)];
  }
  const vclamp = (x, y, w) => [Math.max(4, Math.min(innerWidth - w - 4, x)), Math.max(56, Math.min(innerHeight - 90, y))];
  function vscan(fromEl, tx, ty, rgb, ms) {
    const r = fromEl.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const len = Math.hypot(tx - cx, ty - cy); const ang = Math.atan2(ty - cy, tx - cx) * 180 / Math.PI;
    const beam = document.createElement('div'); beam.className = 'vscan';
    Object.assign(beam.style, { left: cx + 'px', top: cy + 'px', width: Math.max(30, len) + 'px', transform: `rotate(${ang}deg)` }); beam.style.setProperty('--beam', rgb);
    const ping = document.createElement('div'); ping.className = 'vping'; Object.assign(ping.style, { left: tx + 'px', top: ty + 'px' }); ping.style.setProperty('--beam', rgb);
    vlayer().append(beam, ping); setTimeout(() => { beam.remove(); ping.remove(); }, ms);
  }
  function vbolt(fromEl, toEl, rgb, hit) {
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    const ax = a.left + a.width / 2, ay = a.top + a.height / 2; let bx = b.left + b.width / 2, by = b.top + b.height / 2;
    if (!hit) { bx += vrand(-1, 1) > 0 ? vrand(40, 70) : -vrand(40, 70); by += vrand(-50, 50); }
    const d = document.createElement('div'); d.className = 'vbolt';
    Object.assign(d.style, { left: ax + 'px', top: ay + 'px', width: Math.hypot(bx - ax, by - ay) + 'px', transform: `rotate(${Math.atan2(by - ay, bx - ax) * 180 / Math.PI}deg)` }); d.style.setProperty('--beam', rgb);
    vlayer().appendChild(d); setTimeout(() => d.remove(), 360);
    if (hit) { const f = document.createElement('div'); f.className = 'vflash'; Object.assign(f.style, { left: bx + 'px', top: by + 'px' }); f.style.setProperty('--beam', rgb); vlayer().appendChild(f); setTimeout(() => f.remove(), 420); }
  }
  // the Webway: a gate opens, the craft comes through, and the gate closes behind it
  async function vgate(x, y, open) {
    const g = document.createElement('div'); g.className = 'vgate'; g.innerHTML = '<img src="lib/pmwves_gate.webp" alt="">';
    Object.assign(g.style, { left: x + 'px', top: y + 'px' }); vlayer().appendChild(g);
    g.animate([{ transform: 'translate(-50%, -50%) scale(.1) rotate(-40deg)', opacity: 0 }, { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1 }], { duration: 700, easing: 'ease-out', fill: 'forwards' });
    await vwait(700); return g;
  }
  async function vgateClose(g) {
    if (!g) return; const a = g.animate([{ transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }, { transform: 'translate(-50%, -50%) scale(.1) rotate(40deg)', opacity: 0 }], { duration: 600, easing: 'ease-in', fill: 'forwards' });
    try { await a.finished; } catch (e) { /* gone */ } g.remove();
  }
  async function vthrough(el, gx, gy, out) {
    const w = el.offsetWidth, h = el.offsetHeight; const x = gx - w / 2, y = gy - h / 2;
    const k0 = { transform: `translate(${x}px, ${y}px) scale(.15)`, opacity: 0 }, k1 = { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 1 };
    const a = el.animate(out ? [k1, k0] : [k0, k1], { duration: 650, easing: out ? 'ease-in' : 'ease-out', fill: 'forwards' });
    try { await a.finished; } catch (e) { /* gone */ } a.cancel(); vplace(el, x, y); el.style.opacity = out ? '0' : '1';
    return [x, y];
  }
  async function vloop(gen) {
    const k = VS.key, V = VES[k], el = VS.el;
    await vwait(50); if (gen !== VS.gen) return;
    const w = el.offsetWidth || V.w, h = el.offsetHeight || 60;
    if (reduceMotion) { el.style.opacity = '1'; vplace(el, innerWidth - w - 8, Math.round(innerHeight * 0.55)); return; }
    let gate = null;
    if (k === 'eld') { const [gx, gy] = [vrand(60, innerWidth - 60), vrand(120, innerHeight - 160)]; gate = await vgate(gx, gy); [VS.x, VS.y] = await vthrough(el, gx, gy, false); }
    else { VS.x = Math.random() < 0.5 ? -w : innerWidth; VS.y = vrand(90, innerHeight * 0.6); vplace(el, VS.x, VS.y); el.style.opacity = '1'; }
    let legs = 0;
    while (gen === VS.gen) {
      while (gen === VS.gen && (vbusy() || VS.raiding)) await vwait(400);
      if (gen !== VS.gen) return;
      if (gate && legs === 0) { await vwait(300); vgateClose(gate); gate = null; }
      const [tx, ty] = vtarget();
      // erratic: sometimes a quick dart, sometimes a slow drift, never straight onto the target
      const [nx, ny] = vclamp(tx - w / 2 + vrand(-90, 90), ty - h / 2 + vrand(-110, -40), w);
      const dist = Math.hypot(nx - VS.x, ny - VS.y);
      const ms = Math.max(700, dist * (Math.random() < 0.3 ? 2.2 : vrand(4, 7)));
      if (k === 'eld' && Math.random() < 0.5) {
        // the Starweaver circles what it is looking at
        const R = vrand(60, 100), a0 = Math.atan2(VS.y + h / 2 - ty, VS.x + w / 2 - tx), pts = [];
        for (let i = 0; i <= 24; i++) { const a = a0 + (i / 24) * Math.PI * 2; const [px, py] = vclamp(tx + Math.cos(a) * R * 1.4 - w / 2, ty + Math.sin(a) * R - h / 2, w); pts.push([px, py]); }
        if (!(await vmove(el, k, VS.x, VS.y, pts[0][0], pts[0][1], Math.max(600, dist * 3), gen))) return;
        if (!(await vmove(el, k, pts[0][0], pts[0][1], pts[24][0], pts[24][1], 4200, gen, pts))) return;
      } else if (!(await vmove(el, k, VS.x, VS.y, nx, ny, ms, gen))) return;
      if (vbusy()) continue;
      vscan(el, tx, ty, V.beam, 1300); await vwait(vrand(1300, 2200));
      legs++;
      if (Date.now() > VS.nextRaid && !vbusy() && !VS.hold) { await vraid(gen); continue; }
      if (k === 'eld' && legs >= 3 + Math.floor(Math.random() * 3)) {
        // back through a gate, and out of another somewhere else a little later
        const cx = VS.x + w / 2, cy = VS.y + h / 2; const g = await vgate(cx, cy); await vthrough(el, cx, cy, true); vgateClose(g);
        await vwait(vrand(2500, 6000)); if (gen !== VS.gen) return;
        while (gen === VS.gen && vbusy()) await vwait(400);
        const [gx, gy] = [vrand(60, innerWidth - 60), vrand(120, innerHeight - 160)]; gate = await vgate(gx, gy); [VS.x, VS.y] = await vthrough(el, gx, gy, false); legs = 0;
      } else await vwait(vrand(200, 900));
    }
  }
  // now and then another faction's watchers come for your reports; yours always win
  async function vraid(gen) {
    VS.nextRaid = Date.now() + vrand(180000, 360000);
    const mine = VS.el, k = VS.key; const others = Object.keys(VES).filter((x) => x !== k); const rk = others[Math.floor(Math.random() * others.length)];
    const R = VES[rk], M = VES[k]; const foe = vmake(rk, false); VS.raiding = true;
    try {
      await vwait(30);
      const fw = foe.offsetWidth || R.w, fh = foe.offsetHeight || 60; const mw = mine.offsetWidth;
      const left = VS.x + mw / 2 > innerWidth / 2; // come in from the far side
      const [sx, sy] = vclamp(left ? VS.x - 190 - fw : VS.x + mw + 190, VS.y + vrand(-60, 60), fw);
      let ex, ey;
      if (rk === 'eld') { const g = await vgate(sx + fw / 2, sy + fh / 2); [ex, ey] = await vthrough(foe, sx + fw / 2, sy + fh / 2, false); vgateClose(g); vface(foe, rk, VS.x - ex, 0); }
      else { const ox = left ? -fw - 10 : innerWidth + 10; vplace(foe, ox, sy); foe.style.opacity = '1'; await vmove(foe, rk, ox, sy, sx, sy, 1600, gen); ex = sx; ey = sy; }
      if (gen !== VS.gen) return;
      vface(mine, k, ex - VS.x, 0); vface(foe, rk, VS.x - ex, 0);
      for (let i = 0; i < 4; i++) {
        vbolt(foe, mine, R.beam, false); await vwait(260);
        vbolt(mine, foe, M.beam, true); await vwait(320);
        foe.animate([{ transform: `translate(${ex}px, ${ey}px)` }, { transform: `translate(${ex + vrand(-6, 6)}px, ${ey + vrand(-6, 6)}px)` }, { transform: `translate(${ex}px, ${ey}px)` }], { duration: 160 });
      }
      const boom = document.createElement('div'); boom.className = 'vboom'; const r = foe.getBoundingClientRect();
      Object.assign(boom.style, { left: r.left + r.width / 2 + 'px', top: r.top + r.height / 2 + 'px' }); boom.style.setProperty('--beam', M.beam); vlayer().appendChild(boom);
      const fall = foe.animate([{ transform: `translate(${ex}px, ${ey}px) rotate(0deg) scale(1)`, opacity: 1, filter: 'brightness(1)' }, { transform: `translate(${ex + (left ? -40 : 40)}px, ${ey + 70}px) rotate(${left ? -35 : 35}deg) scale(.5)`, opacity: 0, filter: 'brightness(3)' }], { duration: 900, easing: 'ease-in', fill: 'forwards' });
      try { await fall.finished; } catch (e) { /* gone */ }
      setTimeout(() => boom.remove(), 300);
      toast(`${R.who} tried to intercept your reports. ${M.who} drove them off.`);
    } finally { foe.remove(); VS.raiding = false; }
  }
  function vesselSync() {
    const l = vlayer(); l.hidden = vbusy() && !VS.raiding;
    const k = vesselKey();
    if (k === VS.key && VS.el && VS.el.isConnected) return;
    VS.gen++; VS.key = k; if (VS.el) VS.el.remove(); l.querySelectorAll('.vessel, .vgate, .vscan, .vping').forEach((e) => e.remove());
    VS.el = vmake(k, true); VS.el.style.opacity = '0'; VS.hold = false; VS.raiding = false;
    if (!VS.nextRaid) VS.nextRaid = /[?&]vraid/.test(location.search) ? 1 : Date.now() + vrand(90000, 180000);
    vloop(VS.gen);
  }
  // hold still while someone reaches for it: a moving target is hard to tap
  const vnear = (x, y) => { if (!VS.el) return false; const r = VS.el.getBoundingClientRect(); return x > r.left - 40 && x < r.right + 40 && y > r.top - 40 && y < r.bottom + 40; };
  const vholdSet = (on) => { if (VS.hold === on) return; VS.hold = on; if (VS.anim) { if (on) VS.anim.pause(); else VS.anim.play(); } };
  document.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') vholdSet(vnear(e.clientX, e.clientY)); }, { passive: true });
  document.addEventListener('pointerdown', (e) => { if (vnear(e.clientX, e.clientY)) { vholdSet(true); clearTimeout(vholdSet.t); vholdSet.t = setTimeout(() => vholdSet(false), 2500); } }, { passive: true });
  async function sendFeedback() {
    const text = val('fbText').trim(); const kind = UI.fbKind || 'bug';
    if (text.length < 3) { toast('Write a few words first.'); return; }
    UI.fbBusy = true; UI.fbErr = ''; UI.fbDraft = text; render();
    const v = (document.querySelector('script[src*="app.js"]') || {}).src || ''; const vm = v.match(/[?&]v=([^&]+)/);
    const body = { kind, text, screen: S.screen, army: ARMY[S.army] ? ARMY[S.army].label : S.army, faction: listFaction(list()) || '', version: vm ? vm[1] : 'claude' };
    let res = null;
    try {
      if (STANDALONE && STANDALONE.client) { const { data } = await STANDALONE.client.functions.invoke('feedback', { body }); res = data; }
      else { const r = await fetch(SB_URL + '/functions/v1/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SB_PUB, Authorization: 'Bearer ' + SB_PUB }, body: JSON.stringify(body) }); res = await r.json(); }
    } catch (e) { res = null; }
    UI.fbBusy = false;
    if (res && res.ok) { UI.fbDraft = ''; UI.sheet = null; toast(`${VES[VS.key || 'inq'].who} received your report. Thank you.`); }
    else UI.fbErr = (res && res.why) || 'Could not send it just now. Check your connection and try again.';
    render();
  }
  function feedbackSheet() {
    const V = VES[vesselKey()]; const kind = UI.fbKind || 'bug';
    const chips = [['bug', 'Bug'], ['idea', 'Idea'], ['other', 'Other']].map(([k, n]) => `<button class="chip ${kind === k ? 'on' : ''}" data-act="fbKind" data-k="${k}" aria-pressed="${kind === k}">${n}</button>`).join('');
    return sheet(V.who, `<div class="row" style="gap: 12px; align-items: center"><img src="${V.img}" alt="" style="width: 92px; flex: none; filter: drop-shadow(0 0 8px rgba(${V.beam}, .45))"><p style="margin: 0">${esc(V.line)}</p></div>
      <div class="row" style="gap: 6px">${chips}</div>
      <label class="stack" style="gap: 4px"><span class="eyebrow">${kind === 'bug' ? 'What went wrong, and where?' : kind === 'idea' ? 'What should the app do?' : 'Your message'}</span><textarea id="fbText" rows="6" maxlength="4000" placeholder="${kind === 'bug' ? 'For example: on the battle screen, tapping Next phase in round 3 did nothing.' : ''}" style="width: 100%; resize: vertical">${esc(UI.fbDraft || '')}</textarea></label>
      <p class="small muted" style="margin: 0">The screen you are on, your army and the app version are sent with it, so the fault can be found. Only the app's owner reads these.</p>
      ${UI.fbErr ? `<p class="small" style="margin: 0; color: var(--red, #e55)">${esc(UI.fbErr)}</p>` : ''}`,
      `<button class="btn solid block" data-act="fbSend" ${UI.fbBusy ? 'disabled' : ''}>${UI.fbBusy ? 'SENDING…' : 'SEND REPORT'}</button>`);
  }
  try { if (navigator.wakeLock) navigator.wakeLock.request('screen').catch(() => {}); } catch (e) { /* optional */ }
  lastSaved = JSON.stringify(Object.assign({}, S, { updatedAt: 0 }));
  render();
  // a battle link (#ww=CODE) opens the join sheet straight away
  (() => { const m = location.hash.match(/ww=([A-Za-z0-9]{6})/); if (m && STANDALONE) { UI.wwCode = m[1].toUpperCase(); UI.wwNeedList = !(window.matchMedia && matchMedia('(display-mode: standalone)').matches); S.screen = 'home'; UI.overlay = 'wwjoin'; render(); } })();
  syncStart().then(() => { liveResume(); cogCheck(); });
})();
