/* The engine sweep: after each weekly data update, every unit in every army is added, grown to full size,
   given each of its options, priced and removed, so a data change that breaks Footfall is caught before a player hits it.
   Usage: node tools/check_footfall.js footfall   (writes footfall/check.json; exits 1 if anything crashed) */
const fs = require('fs'); const path = require('path');
const FF = require(path.join(__dirname, '..', 'footfall.js'));
const DIR = process.argv[2] || 'footfall';
const J = (f) => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
const idx = J('index.json'); const all = [...idx.factions, ...idx.libraries]; const sys = J('system.json');
const report = { built: new Date().toISOString(), source: idx.source || null, armies: [], totals: { units: 0, options: 0, crashes: 0, warnings: 0 } };
const MAX_OPTS = 40;
for (const fac of idx.factions.filter((f) => !process.env.ONLY || f.name.includes(process.env.ONLY))) {
  const A = { name: fac.name, units: 0, options: 0, crashes: [], warnings: [] };
  const crash = (what, e) => { A.crashes.push(what + ': ' + String(e && e.message || e).slice(0, 160)); };
  const warn = (what) => { if (A.warnings.length < 60) A.warnings.push(what); };
  let D;
  try { const files = []; const seen = new Set(); const go = (f) => { if (seen.has(f)) return; seen.add(f); files.push(J(f)); const r = all.find((x) => x.file === f); (r ? r.libs : []).forEach(go); }; go(fac.file); D = FF.Data(sys, files, fac.id); }
  catch (e) { crash('loading the army', e); report.armies.push(A); continue; }
  let roster, roots;
  try { roster = FF.newRoster(D, 'Strike Force'); roots = FF.options(D, FF.evaluate(D, roster), null).filter((o) => !o.hidden && !o.group && (o.type === 'unit' || o.type === 'model')); }
  catch (e) { crash('starting a list', e); report.armies.push(A); continue; }
  const seenNames = new Set();
  for (const o of roots) {
    if (seenNames.has(o.name)) continue; seenNames.add(o.name);
    A.units++;
    const ro = roster; let s;
    try { s = FF.add(D, ro, null, o.key, o.gids, 1); if (!s) { warn(o.name + ': could not be added'); continue; } }
    catch (e) { crash(o.name + ' (adding)', e); continue; }
    let ev, base;
    try { ev = FF.evaluate(D, ro); base = ev.ptsOf(s.u); if (!(base > 0)) warn(o.name + ': costs ' + base + ' pts'); }
    catch (e) { crash(o.name + ' (pricing)', e); continue; }
    // full size: grow every model entry to its limit, and the price should not fall
    try {
      for (let g = 0; g < 30; g++) {
        ev = FF.evaluate(D, ro); const mo = FF.options(D, ev, s.u).filter((x) => x.type === 'model' && !x.hidden && (x.max < 0 ? x.count < 20 : x.count < x.max));
        if (!mo.length) break; const k = s.kids.find((x) => x.k === mo[0].key); if (k) k.n += 1; else FF.add(D, ro, s.u, mo[0].key, mo[0].gids, 1);
      }
      ev = FF.evaluate(D, ro); const big = ev.ptsOf(s.u); if (big < base) warn(o.name + ': full size costs less (' + big + ') than minimum (' + base + ')');
    } catch (e) { crash(o.name + ' (growing to full size)', e); }
    // every option once: it must price without breaking
    try {
      ev = FF.evaluate(D, ro); const opts = FF.options(D, ev, s.u).filter((x) => !x.group && !x.hidden && x.type !== 'model').slice(0, MAX_OPTS);
      for (const op of opts) { A.options++; try { const t = FF.add(D, ro, s.u, op.key, op.gids, 1); FF.evaluate(D, ro).ptsOf(s.u); if (t) FF.remove(ro, t.u); } catch (e) { crash(o.name + ' > ' + op.name, e); } }
    } catch (e) { crash(o.name + ' (options)', e); }
    try { FF.remove(ro, s.u); } catch (e) { crash(o.name + ' (removing)', e); }
    // copies: later copies may cost more, never less
    try {
      const made = []; let last = FF.evaluate(D, ro).pts, prevStep = null;
      for (let i = 1; i <= 4; i++) { const t = FF.add(D, ro, null, o.key, o.gids, 1); if (!t) break; made.push(t); const p = FF.evaluate(D, ro).pts; const step = p - last; if (prevStep !== null && step < prevStep) warn(o.name + ': copy ' + i + ' costs less than copy ' + (i - 1)); prevStep = step; last = p; }
      made.forEach((t) => FF.remove(ro, t.u));
    } catch (e) { crash(o.name + ' (several copies)', e); }
  }
  report.armies.push(A);
  report.totals.units += A.units; report.totals.options += A.options; report.totals.crashes += A.crashes.length; report.totals.warnings += A.warnings.length;
  console.log(`${fac.name}: ${A.units} units, ${A.options} options, ${A.crashes.length} crashes, ${A.warnings.length} warnings`);
}
fs.writeFileSync(path.join(DIR, 'check.json'), JSON.stringify(report));
console.log(`TOTAL ${report.totals.units} units, ${report.totals.options} options, ${report.totals.crashes} crashes, ${report.totals.warnings} warnings`);
process.exit(report.totals.crashes ? 1 : 0);
