/* Footfall: the list-builder engine.
   Reads the BSData 11th edition rules data (New Recruit's extended BattleScribe format) and answers:
   what can be taken, what it costs, what is hidden, and what is illegal and why.
   Works in the browser (window.FF) and in Node (module.exports) so it can be tested against real lists. */
(function (root) {
  'use strict';
  const PTS = '51b2-306e-1021-d207', DP = '82ae-1066-5107-6ae0', ENH = 'f759-1bc4-cb3a-f0d2';
  const GROUP_KEYS = ['selectionEntries', 'selectionEntryGroups', 'entryLinks'];
  let uidN = 0; const uid = () => 's' + Date.now().toString(36) + (uidN++).toString(36);

  // ---------- data ----------
  function Data(system, cats, primaryId) {
    const D = { idx: {}, cats: {}, system, primaryId, catalogues: cats, R: {}, roots: [] };
    const reg = (o) => {
      if (Array.isArray(o)) { for (const v of o) reg(v); return; }
      if (!o || typeof o !== 'object') return;
      if (o.id && (o.name !== undefined || o.targetId || o.type) && !D.idx[o.id]) D.idx[o.id] = o;
      for (const k in o) if (o[k] && typeof o[k] === 'object') reg(o[k]);
    };
    reg(system); cats.forEach(reg);
    for (const c of [system, ...cats]) for (const ce of c.categoryEntries || []) D.cats[ce.id] = ce;
    D.costTypes = system.costTypes || [];
    D.force = (system.forceEntries || [])[0];
    D.byId = {}; for (const c of cats) D.byId[c.id] = c;
    // root entries: the system's, the primary catalogue's, and those of libraries it imports (and theirs)
    const seen = new Set();
    const addRoots = (c, all) => {
      if (!c || seen.has(c.id)) return; seen.add(c.id);
      if (all) for (const k of ['selectionEntries', 'entryLinks']) for (const e of c[k] || []) D.roots.push(e.id);
      for (const l of c.catalogueLinks || []) addRoots(D.byId[l.targetId], all && !!l.importRootEntries);
    };
    for (const e of system.entryLinks || []) D.roots.push(e.id);
    for (const e of system.selectionEntries || []) D.roots.push(e.id);
    addRoots(D.byId[primaryId], true);
    D.roots = [...new Set(D.roots)];
    // set-up choices (battle size, detachment...) come once: the system's or the army's own, not every library's copy
    const CONFIG = '4ac9-fd30-1e3d-b249'; const names = new Set();
    D.roots = D.roots.filter((k) => { const r = R(D, k); if (!r) return false; if (!r.cats.includes(CONFIG)) return true; if (names.has(r.name)) return false; names.add(r.name); return true; });
    return D;
  }

  // one option (entry, link or group) with its link merged over its target
  function R(D, key) {
    if (D.R[key]) return D.R[key];
    const node = D.idx[key]; if (!node) return null;
    const t = node.targetId ? D.idx[node.targetId] || {} : node;
    const isGroup = node.type === 'selectionEntryGroup' || (!node.targetId && !node.type && (node.selectionEntries || node.entryLinks || node.selectionEntryGroups)) || t.type === undefined && !!(t.selectionEntries || t.entryLinks || t.selectionEntryGroups) && !t.costs;
    const both = (k) => [...(t[k] || []), ...(node !== t ? node[k] || [] : [])];
    const r = {
      key, id: node.targetId || node.id, name: node.name || t.name, type: isGroup ? 'group' : t.type || 'upgrade', isGroup,
      node, t, costs: {}, constraints: both('constraints'), modifiers: both('modifiers'), modifierGroups: both('modifierGroups'),
      cats: both('categoryLinks').map((c) => c.targetId), primaryCat: (both('categoryLinks').find((c) => c.primary) || {}).targetId,
      hidden: !!(node.hidden || t.hidden), def: node.defaultSelectionEntryId || t.defaultSelectionEntryId, collective: !!(node.collective || t.collective),
      assoc: both('associations'), kids: [],
    };
    for (const c of t.costs || []) r.costs[c.typeId] = c.value;
    for (const c of node !== t ? node.costs || [] : []) r.costs[c.typeId] = c.value;
    for (const k of GROUP_KEYS) for (const ch of t[k] || []) r.kids.push(ch.id);
    D.R[key] = r; return r;
  }
  // every non-group option under an option, with the groups it sits in
  function optionTree(D, key, out = [], gids = []) {
    for (const k of R(D, key).kids) {
      const r = R(D, k); if (!r) continue;
      if (r.isGroup) { out.push({ key: k, gids, group: true }); optionTree(D, k, out, [...gids, k, r.id]); }
      else out.push({ key: k, gids });
    }
    return out;
  }

  // ---------- the roster as a tree of nodes ----------
  function build(D, roster) {
    const S = { D, roster, all: [], byU: {} };
    const force = { u: 'force', r: { key: D.force.id, id: D.force.id, name: D.force.name, type: 'force', cats: [], constraints: D.force.constraints || [], modifiers: D.force.modifiers || [], modifierGroups: D.force.modifierGroups || [], costs: {}, kids: D.roots, assoc: [] }, sel: { n: 1, kids: roster.sels, gids: [] }, parent: null, kids: [], force: true };
    S.force = force;
    const mk = (sel, parent) => {
      const r = R(D, sel.k); if (!r) return null;
      const n = { u: sel.u, r, sel, parent, kids: [] };
      S.all.push(n); S.byU[sel.u] = n;
      n.kids = (sel.kids || []).map((s) => mk(s, n)).filter(Boolean);
      return n;
    };
    force.kids = roster.sels.map((s) => mk(s, force)).filter(Boolean);
    for (const n of S.all) n.cats = new Set(n.r.cats);
    // two passes: categories added by modifiers can change what other modifiers see
    for (let pass = 0; pass < 2; pass++) for (const n of S.all) { n.eff = effOf(S, n); n.cats = n.eff.cats; }
    force.eff = effOf(S, force); force.cats = new Set();
    return S;
  }
  const ancestors = (n) => { const a = []; for (let p = n.parent; p; p = p.parent) a.push(p); return a; };
  const matches = (S, n, childId) => {
    if (!childId || childId === 'any') return true;
    if (childId === 'model' || childId === 'unit' || childId === 'upgrade') return n.r.type === childId;
    return n.r.id === childId || n.r.key === childId || (n.sel.gids || []).includes(childId) || (n.cats && n.cats.has(childId));
  };
  function scopeNode(S, scope, n) {
    if (!scope || scope === 'self') return n;
    if (scope === 'parent') return n.parent || S.force;
    if (scope === 'force' || scope === 'roster') return S.force;
    if (scope === 'unit' || scope === 'model' || scope === 'upgrade') { for (let p = n; p; p = p.parent) if (p.r.type === scope) return p; return null; }
    if (scope === 'root-entry') { let p = n; while (p.parent && !p.parent.force) p = p.parent; return p; }
    if (scope === S.D.force.id) return S.force;
    for (let p = n; p; p = p.parent) if (p.r.id === scope || p.r.key === scope || (p.sel.gids || []).includes(scope)) return p;
    return null;
  }
  // how many (or how much cost) of childId sits inside the scope node
  function tally(S, top, field, childId, deep, skipSelf) {
    let v = 0;
    const walk = (list, mult) => {
      for (const k of list) {
        const m = mult * (k.sel.n || 0);
        if (matches(S, k, childId)) v += field === 'selections' ? m : ((k.eff && k.eff.costs[field]) || 0) * m;
        if (deep) walk(k.kids, m);
      }
    };
    walk(top.kids || [], 1);
    if (!skipSelf && top !== S.force && field !== 'selections' && top.kids && childId === 'any') v += ((top.eff && top.eff.costs[field]) || 0);
    return v;
  }
  function assocCount(S, n, childId) {
    let v = 0;
    for (const id in n.sel.as || {}) for (const u of n.sel.as[id]) { const o = S.byU[u]; if (o && (childId === id || matches(S, o, childId) || childId === 'any' || childId === 'unit')) v++; }
    for (const o of S.all) for (const id in o.sel.as || {}) if (o.sel.as[id].includes(n.u) && (childId === id || matches(S, o, childId) || childId === 'any' || childId === 'unit')) v++;
    return v;
  }
  function value(S, c, n) {
    if (c.scope === 'primary-catalogue') return c.childId === S.D.primaryId ? 1 : 0;
    if (c.field === 'forces') return !c.childId || c.childId === 'any' || c.childId === S.D.force.id ? 1 : 0;
    if (c.scope === 'ancestor') return ancestors(n).some((a) => a !== S.force && matches(S, a, c.childId)) ? 1 : 0;
    const top = scopeNode(S, c.scope, n); if (!top) return 0;
    if (c.field === 'associations') return assocCount(S, top, c.childId);
    return tally(S, top, c.field || 'selections', c.childId, !!c.includeChildSelections || top === S.force && c.includeChildForces);
  }
  function cond(S, c, n) {
    const t = c.type;
    if (t === 'instanceOf' || t === 'notInstanceOf') {
      let is;
      if (c.scope === 'primary-catalogue') is = c.childId === S.D.primaryId;
      else if (c.scope === 'ancestor') is = ancestors(n).some((a) => a !== S.force && matches(S, a, c.childId));
      else { const top = scopeNode(S, c.scope, n); is = !!top && top !== S.force && matches(S, top, c.childId); if (top === S.force) is = c.childId === S.D.force.id; }
      return t === 'instanceOf' ? is : !is;
    }
    if (t === 'before') return true;
    const v = value(S, c, n), x = c.value;
    return t === 'atLeast' ? v >= x : t === 'atMost' ? v <= x : t === 'greaterThan' ? v > x : t === 'lessThan' ? v < x : t === 'equalTo' ? v === x : t === 'notEqualTo' ? v !== x : false;
  }
  function localGroup(S, g, n) {
    const top = scopeNode(S, g.scope, n); if (!top) return false;
    let v = 0;
    const walk = (list) => { for (const k of list) { if ((g.conditions || []).every((c) => cond(S, c, k))) v += k.sel.n || 0; if (g.includeChildSelections) walk(k.kids); } };
    walk(top.kids || []);
    const x = g.value; const t = g.type;
    return t === 'atLeast' ? v >= x : t === 'atMost' ? v <= x : t === 'greaterThan' ? v > x : t === 'lessThan' ? v < x : t === 'equalTo' ? v === x : v >= x;
  }
  function group(S, g, n) {
    const res = [...(g.conditions || []).map((c) => cond(S, c, n)), ...(g.conditionGroups || []).map((x) => group(S, x, n))];
    for (const lg of g.localConditionGroups || []) res.push(localGroup(S, lg, n));
    if (g.type === 'or') return res.some(Boolean);
    if (g.type === 'count') { const k = res.filter(Boolean).length; return (g.min === undefined || k >= g.min) && (g.max === undefined || g.max < 0 || k <= g.max); }
    return res.every(Boolean);
  }
  const holds = (S, m, n) => (m.conditions || []).every((c) => cond(S, c, n)) && (m.conditionGroups || []).every((g) => group(S, g, n)) && (m.localConditionGroups || []).every((g) => localGroup(S, g, n));
  function times(S, m, n) {
    if (!m.repeats || !m.repeats.length) return 1;
    let k = 0;
    for (const rp of m.repeats) { const v = value(S, rp, n); const q = v / (rp.value || 1); k += (rp.roundUp ? Math.ceil(q) : Math.floor(q)) * (rp.repeats || 1); }
    return k;
  }

  // ---------- an option's state once its modifiers have run ----------
  function effOf(S, n) {
    const r = n.r;
    const e = { hidden: !!r.hidden, costs: { ...r.costs }, cons: {}, cats: new Set(n.cats || r.cats), errors: [], warnings: [], name: r.name };
    for (const c of r.constraints) e.cons[c.id] = c.value;
    const apply = (m) => {
      if (m.affects) return;
      if (!holds(S, m, n)) return;
      const k = times(S, m, n); if (!k) return;
      const f = m.field, v = m.value, ty = m.type;
      if (f === 'hidden') { if (ty === 'set') e.hidden = v === true || v === 'true'; return; }
      if (f === 'category') { if (ty === 'add' || ty === 'set-primary') e.cats.add(v); else if (ty === 'remove') e.cats.delete(v); return; }
      if (f === 'error' || f === 'warning') { if (ty === 'add' || ty === 'append' || ty === 'set') e[f + 's'].push(String(v)); return; }
      if (f === 'name') { if (ty === 'set') e.name = String(v); else if (ty === 'append') e.name += (m.join !== undefined ? m.join : ' ') + v; else if (ty === 'replace' && m.arg) e.name = e.name.replace(m.arg, v); return; }
      const box = f in e.cons ? e.cons : S.D.costTypes.some((c) => c.id === f) || f in e.costs ? e.costs : null;
      if (!box) return;
      const cur = Number(box[f] || 0), num = Number(v);
      if (ty === 'set') box[f] = num;
      else if (ty === 'increment') box[f] = cur + num * k;
      else if (ty === 'decrement') box[f] = cur - num * k;
      else if (ty === 'multiply') box[f] = cur * num;
      else if (ty === 'divide') box[f] = num ? cur / num : cur;
      else if (ty === 'floor') box[f] = Math.floor(cur);
      else if (ty === 'ceil') box[f] = Math.ceil(cur);
    };
    const runGroup = (g, extra) => {
      const ok = holds(S, g, n); if (!ok) return;
      for (const m of g.modifiers || []) apply(m);
      for (const x of g.modifierGroups || []) runGroup(x);
    };
    for (const m of r.modifiers) apply(m);
    for (const g of r.modifierGroups) runGroup(g);
    return e;
  }
  // an option not (yet) selected, seen from under a parent node
  const virtual = (S, key, parent, gids) => { const n = { u: null, r: R(S.D, key), sel: { n: 0, kids: [], gids: gids || [] }, parent, kids: [], virtual: true }; n.cats = new Set(n.r.cats); n.eff = effOf(S, n); n.cats = n.eff.cats; return n; };

  // ---------- legality ----------
  function check(S) {
    const out = { errors: [], warnings: [] };
    const err = (u, msg) => out.errors.push({ u, msg }); const warn = (u, msg) => out.warnings.push({ u, msg });
    const label = (n) => (n && n.eff ? n.eff.name : n && n.r ? n.r.name : '');
    const seen = new Set();
    const consCheck = (opt, owner, count, where) => {
      for (const c of opt.r.constraints) {
        const v = opt.eff.cons[c.id]; if (v === undefined || v < 0) continue;
        const scope = c.scope || 'parent';
        let top = scope === 'self' || scope === 'root-entry' ? null : scopeNode(S, scope, where);
        if (scope === 'self' || scope === 'root-entry') continue; // handled per selection
        if (!top) continue;
        const key = c.id + '|' + top.u; if (seen.has(key)) continue; seen.add(key);
        let have;
        if (c.field === 'selections') { const id = opt.r.isGroup ? opt.r.key : c.shared === false ? opt.r.key : opt.r.id; have = tally(S, top, 'selections', id, !!c.includeChildSelections || top === S.force && !!c.includeChildForces); if (opt.r.isGroup) have = Math.max(have, tally(S, top, 'selections', opt.r.id, !!c.includeChildSelections)); }
        else if (c.field === 'associations') continue;
        else have = tally(S, top, c.field, opt.r.isGroup ? opt.r.key : opt.r.id, true);
        const what = c.field === 'selections' ? '' : ' ' + ((S.D.costTypes.find((x) => x.id === c.field) || {}).name || '');
        const place = top === S.force ? 'in the army' : 'in ' + label(top);
        if (c.type === 'max' && have > v) err(owner, `${opt.eff.name}: at most ${v}${what} ${place} (has ${have}).`);
        if (c.type === 'min' && have < v && !opt.eff.hidden) err(owner, `${opt.eff.name}: needs at least ${v}${what} ${place} (has ${have}).`);
      }
    };
    // per container: every option it could hold, selected or not
    const containers = [S.force, ...S.all];
    for (const P of containers) {
      const tree = P.force ? S.D.roots.map((k) => ({ key: k, gids: [] })) : optionTree(S.D, P.r.key);
      const shut = new Set();
      for (const o of tree) {
        const v = virtual(S, o.key, P, o.gids);
        if (o.gids.some((g) => shut.has(g))) v.eff.hidden = true;
        if (o.group && v.eff.hidden) shut.add(o.key);
        const chosen = P.kids.filter((k) => k.r.key === o.key || (o.group && (k.sel.gids || []).includes(o.key)));
        if (v.eff.hidden && chosen.length && !o.group) err(chosen[0].u, `${label(chosen[0])} is not available here.`);
        if (P.force && !o.group) { const r = v.r; if (r.type === 'upgrade' && !(r.constraints || []).some((c) => c.type === 'min' && c.value > 0)) { /* optional configuration */ } }
        consCheck(v, chosen[0] ? chosen[0].u : P.u, chosen.length, v);
      }
    }
    // the force itself: points limit, detachment points, enhancements, categories
    const F = S.force;
    for (const c of F.r.constraints) {
      const v = F.eff.cons[c.id]; if (v === undefined || v < 0) continue;
      const have = tally(S, F, c.field, 'any', true);
      const nm = (S.D.costTypes.find((x) => x.id === c.field) || {}).name || c.field;
      if (c.type === 'max' && have > v && !(c.field === PTS && v === 0)) err('force', `Over the ${nm === 'pts' ? 'points' : nm} limit: ${have} of ${v}.`);
    }
    for (const cl of S.D.force.categoryLinks || []) {
      const vn = { u: 'force', r: { key: cl.id, id: cl.targetId, name: cl.name, constraints: cl.constraints || [], modifiers: cl.modifiers || [], modifierGroups: cl.modifierGroups || [], costs: {}, cats: [] }, sel: { n: 0, kids: [], gids: [] }, parent: F, kids: [] };
      vn.eff = effOf(S, vn);
      for (const c of cl.constraints || []) {
        const v = vn.eff.cons[c.id]; if (v === undefined || v < 0) continue;
        const have = tally(S, F, 'selections', cl.targetId, true);
        if (c.type === 'max' && have > v) err('force', `${cl.name}: at most ${v} in the army (has ${have}).`);
        if (c.type === 'min' && have < v) err('force', `${cl.name}: needs at least ${v} in the army.`);
      }
      out.errors.push(...vn.eff.errors.map((m) => ({ u: 'force', msg: m }))); out.warnings.push(...vn.eff.warnings.map((m) => ({ u: 'force', msg: m })));
    }
    out.errors.push(...F.eff.errors.map((m) => ({ u: 'force', msg: m })));
    // per selection: its own scope constraints, error messages from the data, and its associations
    for (const n of S.all) {
      for (const m of n.eff.errors) err(n.u, m);
      for (const m of n.eff.warnings) warn(n.u, m);
      for (const c of n.r.constraints) {
        const scope = c.scope; if (scope !== 'self' && scope !== 'root-entry') continue;
        const v = n.eff.cons[c.id]; if (v === undefined || v < 0) continue;
        const top = scopeNode(S, scope, n);
        const have = c.field === 'associations' ? assocCount(S, n, c.childId || 'any') : tally(S, top, c.field, c.field === 'selections' ? 'any' : 'any', !!c.includeChildSelections || c.field !== 'selections');
        const nm = c.field === 'associations' ? ((S.D.cats[c.childId] || {}).name || 'unit').toLowerCase() + ' attached' : c.field === 'selections' ? 'selections' : (S.D.costTypes.find((x) => x.id === c.field) || {}).name || '';
        if (c.field === 'selections') continue; // counted per container above
        if (c.type === 'max' && have > v) err(n.u, `${label(n)}: at most ${v} ${nm}${c.field === ENH ? ' on one model' : ''} (has ${have}).`);
        if (c.type === 'min' && have < v) err(n.u, `${label(n)}: needs at least ${v} ${nm}.`);
      }
      for (const a of n.r.assoc) {
        const got = ((n.sel.as || {})[a.id] || []).length;
        if (a.max !== undefined && a.max >= 0 && got > a.max) err(n.u, `${label(n)}: ${a.label || a.name} at most ${a.max}.`);
        if (a.min && got < a.min) err(n.u, `${label(n)}: must be ${(a.name || '').toLowerCase() === 'supporting' ? 'supporting a unit' : 'attached to a unit'} (${a.label || a.name}).`);
        for (const u of (n.sel.as || {})[a.id] || []) { const t = S.byU[u]; if (!t) err(n.u, `${label(n)}: the unit it was attached to is gone.`); else if (!assocOK(S, a, t)) err(n.u, `${label(n)} cannot ${(a.name || 'join').toLowerCase() === 'leading' ? 'lead' : 'support'} ${label(t)}.`); }
      }
    }
    const dedupe = (l) => { const s = new Set(); return l.filter((x) => { const k = x.u + x.msg; if (s.has(k)) return false; s.add(k); return true; }); };
    out.errors = dedupe(out.errors); out.warnings = dedupe(out.warnings);
    return out;
  }
  const assocOK = (S, a, t) => t !== undefined && (!a.childId || ['unit', 'model', 'any'].includes(a.childId) ? true : matches(S, t, a.childId)) && (!a.conditions || a.conditions.every((c) => cond(S, c, t))) && (a.conditionGroups || []).every((g) => group(S, g, t));

  // ---------- public: evaluate, options, editing ----------
  function evaluate(D, roster) {
    const S = build(D, roster);
    const res = check(S);
    const cost = (id) => tally(S, S.force, id, 'any', true);
    const limitC = S.force.r.constraints.find((c) => c.field === PTS && c.type === 'max');
    const dpC = S.force.r.constraints.find((c) => c.field === DP && c.type === 'max');
    const enC = S.force.r.constraints.find((c) => c.field === ENH && c.type === 'max');
    return {
      S, errors: res.errors, warnings: res.warnings,
      pts: cost(PTS), limit: limitC ? S.force.eff.cons[limitC.id] : 0,
      dp: cost(DP), dpMax: dpC ? S.force.eff.cons[dpC.id] : null,
      enh: cost(ENH), enhMax: enC ? S.force.eff.cons[enC.id] : null,
      ptsOf: (u) => { const n = S.byU[u]; if (!n) return 0; let v = (n.eff.costs[PTS] || 0) * (n.sel.n || 1); const w = (l, m) => { for (const k of l) { v += (k.eff.costs[PTS] || 0) * m * k.sel.n; w(k.kids, m * k.sel.n); } }; w(n.kids, n.sel.n || 1); return v; },
      node: (u) => S.byU[u], name: (u) => (S.byU[u] ? S.byU[u].eff.name : ''),
    };
  }
  // what can go under a selection (or at the top of the army), with its live state
  function options(D, ev, parentU) {
    const S = ev.S; const P = parentU ? S.byU[parentU] : S.force; if (!P) return [];
    const tree = P.force ? D.roots.map((k) => ({ key: k, gids: [] })) : optionTree(D, P.r.key);
    const out = []; const shut = new Set();
    for (const o of tree) {
      const v = virtual(S, o.key, P, o.gids);
      const r = v.r;
      if (o.gids.some((g) => shut.has(g))) v.eff.hidden = true;
      if (o.group && v.eff.hidden) shut.add(o.key);
      const count = P.kids.filter((k) => (o.group ? (k.sel.gids || []).includes(o.key) : k.r.key === o.key)).reduce((a, k) => a + k.sel.n, 0);
      const inScope = (c) => c.field === 'selections' && (c.scope === 'parent' || !c.scope || (P.force && (c.scope === 'force' || c.scope === 'roster')));
      const max = (() => { const c = r.constraints.find((c) => c.type === 'max' && inScope(c)); return c ? v.eff.cons[c.id] : -1; })();
      const min = (() => { const c = r.constraints.find((c) => c.type === 'min' && inScope(c)); return c ? v.eff.cons[c.id] : 0; })();
      out.push({ key: o.key, gids: o.gids, group: !!o.group, name: v.eff.name, type: r.type, hidden: v.eff.hidden, pts: v.eff.costs[PTS] || 0, dp: v.eff.costs[DP] || 0, count, max, min, cats: [...v.cats], primaryCat: r.primaryCat, def: r.def });
    }
    return out;
  }
  function findSel(roster, u, list = roster.sels, parent = null) { for (const s of list) { if (s.u === u) return { s, list, parent }; const f = findSel(roster, u, s.kids || [], s); if (f) return f; } return null; }
  // add an option under a selection; picks the required wargear and models so the unit starts legal
  function add(D, roster, parentU, key, gids, n, noFill) {
    const r = R(D, key); if (!r) return null;
    const sel = { u: uid(), k: key, n: n || 1, kids: [], gids: gids || [] };
    const list = parentU ? findSel(roster, parentU).s.kids : roster.sels;
    list.push(sel);
    if (!noFill) fillDefaults(D, roster, sel);
    return sel;
  }
  function fillDefaults(D, roster, sel, depth = 0) {
    if (depth > 6) return;
    // required single options first (a sergeant, a pistol), then groups that need N picks
    const ev = evaluate(D, roster);
    for (const o of options(D, ev, sel.u).filter((o) => !o.group && !o.hidden && o.min > o.count)) {
      const s = { u: uid(), k: o.key, n: o.min - o.count, kids: [], gids: o.gids }; sel.kids.push(s); fillDefaults(D, roster, s, depth + 1);
    }
    const ev2 = evaluate(D, roster);
    const opts = options(D, ev2, sel.u);
    // a group's default (or first open) option makes up the numbers; nested groups are filled innermost first
    const groups = opts.filter((o) => o.group && !o.hidden).sort((a, b) => b.gids.length - a.gids.length);
    for (const g0 of groups) {
      const g = options(D, evaluate(D, roster), sel.u).find((o) => o.key === g0.key && o.gids.join() === g0.gids.join());
      if (!g || g.min <= g.count) continue;
      const inside = options(D, evaluate(D, roster), sel.u).filter((o) => !o.group && !o.hidden && o.gids.includes(g.key));
      const pick = inside.find((o) => o.key === g.def || R(D, o.key).id === g.def) || inside.find((o) => o.max < 0 || o.max > o.count); if (!pick) continue;
      const need = g.min - g.count;
      const take = pick.max >= 0 ? Math.min(need, pick.max - pick.count) : need;
      if (take <= 0) continue;
      const have = sel.kids.find((k) => k.k === pick.key);
      if (have) have.n += take; else { const s = { u: uid(), k: pick.key, n: take, kids: [], gids: pick.gids }; sel.kids.push(s); fillDefaults(D, roster, s, depth + 1); }
    }
  }
  // after any change: a required choice with only one open option is made for you (e.g. force disposition after a detachment)
  function settle(D, roster) {
    for (let i = 0; i < 4; i++) {
      let changed = false;
      const ev = evaluate(D, roster);
      const walk = (list) => { for (const s of list) {
        const opts = options(D, ev, s.u);
        for (const g of opts.filter((o) => o.group && !o.hidden && o.min > o.count)) {
          const open = opts.filter((o) => !o.group && !o.hidden && o.gids.includes(g.key));
          if (open.length === 1) { s.kids.push({ u: uid(), k: open[0].key, n: 1, kids: [], gids: open[0].gids }); changed = true; }
        }
        walk(s.kids || []);
      } };
      walk(roster.sels);
      if (!changed) break;
    }
  }
  function remove(roster, u) { const f = findSel(roster, u); if (!f) return; f.list.splice(f.list.indexOf(f.s), 1); const strip = (l) => { for (const s of l) { for (const id in s.as || {}) s.as[id] = s.as[id].filter((x) => x !== u); strip(s.kids || []); } }; strip(roster.sels); }
  function setN(roster, u, n) { const f = findSel(roster, u); if (f) f.s.n = Math.max(0, n); if (f && f.s.n === 0) remove(roster, u); }
  // units a leader (or support unit) could join, by association
  function partners(D, ev, u) {
    const S = ev.S; const n = S.byU[u]; if (!n) return [];
    return n.r.assoc.map((a) => ({ a, can: S.force.kids.filter((t) => t !== n && assocOK(S, a, t)) }));
  }
  function attach(roster, u, assocId, targetU) { const f = findSel(roster, u); if (!f) return; f.s.as = f.s.as || {}; f.s.as[assocId] = targetU ? [targetU] : []; }

  // ---------- reading: profiles and rules for the screen and the Cogitator ----------
  function profiles(D, key) {
    const r = R(D, key); const out = []; const seen = new Set();
    const take = (o, depth) => {
      if (!o || depth > 8) return;
      for (const p of o.profiles || []) { const k = p.typeName + p.name; if (!seen.has(k)) { seen.add(k); out.push({ type: p.typeName, name: p.name, chars: Object.fromEntries((p.characteristics || []).map((c) => [c.name, c.$text || ''])) }); } }
      for (const l of o.infoLinks || []) { const t = D.idx[l.targetId]; if (!t) continue; if (l.type === 'profile') take({ profiles: [t] }, depth + 1); else if (l.type === 'rule' && !seen.has('R' + t.name)) { seen.add('R' + t.name); out.push({ type: 'Rule', name: t.name, chars: { Description: t.description || '' } }); } }
      for (const rr of o.rules || []) if (!seen.has('R' + rr.name)) { seen.add('R' + rr.name); out.push({ type: 'Rule', name: rr.name, chars: { Description: rr.description || '' } }); }
    };
    take(r.node, 0); if (r.t !== r.node) take(r.t, 0);
    return out;
  }
  function newRoster(D, sizeName) {
    const roster = { v: 1, fac: D.primaryId, sels: [] };
    // the mandatory set-up choices (battle size, detachment) start filled
    for (const o of options(D, evaluate(D, roster), null).filter((o) => !o.hidden && o.min > 0)) add(D, roster, null, o.key, o.gids, o.min, /detachment/i.test(o.name));
    if (sizeName) setSize(D, roster, sizeName);
    return roster;
  }
  function setSize(D, roster, sizeName) {
    const bs = roster.sels.find((s) => /battle size/i.test(R(D, s.k).name)); if (!bs) return;
    const ev = evaluate(D, roster);
    const opt = options(D, ev, bs.u).find((o) => !o.group && new RegExp(sizeName, 'i').test(o.name)); if (!opt) return;
    bs.kids = bs.kids.filter((k) => !opt.gids.some((g) => (k.gids || []).includes(g)) || k.k === opt.key);
    if (!bs.kids.some((k) => k.k === opt.key)) bs.kids.push({ u: uid(), k: opt.key, n: 1, kids: [], gids: opt.gids });
  }

  const FF = { Data, R, evaluate, options, add, settle, remove, setN, partners, attach, profiles, newRoster, setSize, findSel, PTS, DP, ENH };
  if (typeof module !== 'undefined' && module.exports) module.exports = FF; else root.FF = FF;
})(typeof window !== 'undefined' ? window : globalThis);
