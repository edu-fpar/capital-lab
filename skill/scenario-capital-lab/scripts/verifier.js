#!/usr/bin/env node
/*
 * Vérifie un scénario « Capital Lab » avec le moteur de l'outil.
 * Usage : node verifier.js scenario.md
 * Affiche, étape par étape, le contrôle et les intérêts calculés, et les problèmes.
 * Code de sortie 1 s'il reste des erreurs bloquantes.
 */
'use strict';
const fs = require('fs');
const path = require('path');

global.window = global;
require(path.join(__dirname, 'lib', 'model.js'));
require(path.join(__dirname, 'lib', 'scenario.js'));
const P = global.P;

const file = process.argv[2];
if (!file) { console.error('Usage : node verifier.js scenario.md'); process.exit(2); }
const md = fs.readFileSync(file, 'utf8');
const sc = P.parseScenario(md);
const pct = v => (Math.round(v * 100) / 100).toLocaleString('fr-FR') + ' %';

let blocking = 0;
const warn = [];
console.log(`Scénario : ${sc.title}`);
console.log(`${sc.steps.length} étape(s)\n`);
if (!sc.steps.length) { console.log('ERREUR : aucune étape (titres « ## » manquants ?)'); process.exit(1); }

const errs = [];
P.buildState(sc, sc.steps.length - 1, errs);
errs.forEach(e => { blocking++; console.log(`ERREUR étape ${e.step + 1}, ligne ${e.line} : « ${e.text} » — ${e.msg}`); });
if (errs.length) console.log('');

sc.steps.forEach((s, i) => {
  const st = P.buildState(sc, i);
  const an = P.analyze(st);
  const name = id => (st.entities[id] ? st.entities[id].name : (an.blockById[id] ? an.blockById[id].name : id));
  console.log(`── [${i + 1}/${sc.steps.length}] ${s.title}${s.title === 'Introduction' ? ' (texte placé avant le premier « ## »)' : ''}`);
  (st.concerts || []).forEach(c => {
    const b = an.blockById['concert:' + c.id];
    if (!b) { console.log(`   pacte ${c.name} : ignoré (moins de deux membres valides)`); return; }
    const where = an.ids.filter(C => an.holders[C].some(h => c.members.includes(h.from)))
      .map(C => `${name(C)} ${pct(an.pct(b.id, C))}`).join(', ');
    console.log(`   pacte « ${c.name} » (${c.members.map(name).join(' + ')}) · voix réunies : ${where || '—'}`);
  });
  if (!s.md.trim()) warn.push(`étape ${i + 1} : pas de commentaire`);
  if (s.md.length > 1600) warn.push(`étape ${i + 1} : commentaire long (${s.md.length} caractères), à scinder ?`);
  Object.entries(st.view.notes || {}).forEach(([id, t]) => { if (t.length > 80) warn.push(`étape ${i + 1} : bulle sur ${id} longue (${t.length} caractères)`); });
  if (st.options.deFacto) console.log('   (présomption de contrôle de fait > 40 % activée)');
  for (const C of an.ids) {
    if (!an.holders[C].length) continue;
    const parts = an.holders[C].map(h => `${name(h.from)} ${pct(h.cap)}${h.votes !== h.cap ? ` (DV ${pct(h.votes)})` : ''}`).join(', ');
    let line = `   ${name(C)} ← ${parts}`;
    if (an.capSum[C] < 99.999) line += ` + autres ${pct(100 - an.capSum[C])}`;
    console.log(line);
    if (an.capSum[C] > 100.001) { blocking++; console.log(`     ERREUR : capital attribué ${pct(an.capSum[C])} > 100 %`); }
    if (an.voteSum[C] > 100.001) { blocking++; console.log(`     ERREUR : droits de vote attribués ${pct(an.voteSum[C])} > 100 %`); }
    if (an.supp[C].total > 0) console.log(`     voix neutralisées (autocontrôle / auto-détention) : ${pct(an.supp[C].total)}`);
    const u = an.ultimate[C];
    if (u) {
      const path = an.path(u.block.id, C);
      console.log(`     → contrôle ${u.type}${u.how === 'fait' ? ' (de fait)' : ''} : ${u.block.name} · DV contrôlés ${pct(an.pct(u.block.id, C))} · intérêt ${pct(an.interestOf(u.block.id, C) * 100)}${path.length > 2 ? ` · chaîne ${path.map(name).join(' → ')}` : ''}`);
    } else console.log('     → aucun contrôle');
    const blk = an.blocs(C).filter(b => b.pct > 100 / 3 + 1e-6 && b.pct < 200 / 3 - 1e-6 && !(u && u.block.id === b.block.id));
    if (blk.length) console.log(`     minorité de blocage : ${blk.map(b => `${b.block.name} (${pct(b.pct)})`).join(', ')}`);
  }
  const pv = st.view.perspective;
  if (pv && st.entities[pv]) {
    const rows = an.ids.filter(c => c !== pv && (an.interestOf(pv, c) > 1e-6 || an.ctrl[pv].has(c)));
    console.log(`   point de vue ${name(pv)} : ${rows.map(c => `${name(c)} intérêt ${pct(an.interestOf(pv, c) * 100)}${an.ctrl[pv].has(c) ? ' contrôle ✔' : ''}`).join(' ; ') || '—'}`);
  }
  console.log('');
});

if (warn.length) { console.log('Avertissements :'); warn.forEach(w => console.log('  - ' + w)); console.log(''); }
console.log(blocking ? `${blocking} erreur(s) à corriger.` : 'Aucune erreur. Comparez les chiffres ci-dessus avec les commentaires.');
process.exit(blocking ? 1 : 0);
