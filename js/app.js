/* ============================================================
 * Capital Lab — interface : canevas SVG, palette, inspecteur,
 * mode cinéma (lecteur de scénarios), studio d'enregistrement.
 * ============================================================ */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = P.esc, fmt = P.fmt;
  const t = P.t;
  /* minorité de blocage et majorité renforcée selon le droit (textes dans la langue du droit, comme P.JURIS) ;
   * droit américain : pas de minorité de blocage légale (supermajorité seulement si les statuts la prévoient) */
  const BLOCKING = {
    fr: { lo: 100 / 3 + 1e-6, hi: 200 / 3 - 1e-6,
      minority: "🛑 Minorité de blocage (plus d'1/3 des voix en AGE) : {names}.",
      controller: "Le contrôleur décide seul en AGO, mais n'atteint pas les 2/3 nécessaires en AGE." },
    uk: { lo: 25 + 1e-9, hi: 75 - 1e-9,
      minority: '🛑 Blocking minority (more than 25% of the votes: can defeat a special resolution): {names}.',
      controller: 'The controller passes ordinary resolutions alone, but does not reach the 75% needed for a special resolution.' },
    es: { lo: 100 / 3 + 1e-6, hi: 200 / 3 - 1e-6,
      minority: '🛑 Minoría de bloqueo (más de un tercio de los votos frente a los acuerdos de mayoría reforzada): {names}.',
      controller: 'El controlador decide solo por mayoría absoluta, pero no alcanza los 2/3 de la mayoría reforzada.' }
  };
  const NW = 190, NH = 78;
  const PALETTE = ['#2563eb', '#dc2626', '#059669', '#9333ea', '#ea580c', '#0891b2', '#db2777', '#65a30d', '#7c3aed', '#b45309'];
  const LS_KEY = 'capital-lab.libre.v1';
  /* paquet SCORM exporté : scénario embarqué (js/scenario-data.js) et plateforme (js/scorm-runtime.js) */
  const EMBED = window.CAPITAL_LAB_EMBED || null, host = window.CapitalLabHost || null;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  /* téléphone en portrait : disposition empilée (voir css, @media max-width 760px) */
  const mqMobile = window.matchMedia ? window.matchMedia('(max-width: 760px)') : null;
  function isMobile() { return !!(mqMobile && mqMobile.matches); }

  const App = window.App = {
    mode: 'libre', state: P.newState(), an: null, sel: null,
    undoStack: [], redoStack: [], editing: false,
    colorMap: {}, colorIdx: 0, disp: {}, ldisp: {},
    cam: { x: 0, y: 150, k: 1 }, camT: null,
    scenario: null, scenarioSrc: '', step: 0, playing: false, speed: 1, playMode: 'pas', timer: null,
    studio: { open: false, title: t('Mon scénario'), steps: [] },
    hoverRef: null, libreState: null, planOpen: false, drag: null,
    cinePos: {},   // positions d'entités déplacées à la main pendant la lecture d'un scénario
    noteOff: {},   // décalages des bulles déplacées à la main
    q: { revealed: false, collapsed: false, picked: null, flipped: {} }  // étape question en cours
  };

  /* ============================================================ utilitaires */
  function tint(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; }
  function trunc(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
  const ease = a => 1 - Math.pow(1 - a, 3);
  const easeBack = a => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(a - 1, 3) + c1 * Math.pow(a - 1, 2); };
  App.colorFor = id => { if (!App.colorMap[id]) App.colorMap[id] = PALETTE[App.colorIdx++ % PALETTE.length]; return App.colorMap[id]; };

  function nameOf(id) {
    const st = App.state;
    if (st.entities[id]) return st.entities[id].name;
    const cid = String(id).replace(/^concert:/, '');
    const c = (st.concerts || []).find(x => x.id === cid);
    return c ? c.name : id;
  }
  function blockLabel(b) { return b.kind === 'concert' ? '🤝 ' + nameOf(b.id) : nameOf(b.id); }
  function iconOf(id) { const e = App.state.entities[id]; return e ? (P.TYPES[e.type] || P.TYPES.societe).icon : '🤝'; }
  const findLinkByKey = k => App.state.links.find(l => P.linkKey(l) === k);
  /* titre d'étape : seule l'introduction implicite (sans titre « ## ») porte un nom fixé par le moteur */
  const stepTitle = s => (s.title === 'Introduction' ? t('Introduction') : s.title);

  /* ============================================================ langues, droits, bibliothèque */
  /* textes d'aide et de documentation dans la langue de l'interface (js/docs-en.js, js/docs-es.js) */
  const DOCS = P.DOCS_I18N && P.DOCS_I18N[P.lang];
  if (P.lang !== 'fr' && DOCS) {
    ['HELP_LIBRE', 'HELP_CINEMA', 'HELP_THANKS', 'IA_INSTRUCTIONS_URL', 'IA_CONSIGNE', 'FORMAT_DOC', 'AI_PROMPT'].forEach(k => { if (DOCS[k] != null) P[k] = DOCS[k]; });
    if (typeof DOCS.noLink === 'function') P.iaConsigneSansLien = DOCS.noLink;
  }
  /* textes statiques d'index.html (écrits en français) */
  if (P.lang !== 'fr') { P.translateDom(document.body); document.title = t(document.title); }
  /** Lien vers une page de la documentation (docs/index.html#/page, #/en/page, #/es/page) */
  const docHref = page => 'docs/index.html#/' + (P.lang === 'fr' ? '' : P.lang + '/') + page;

  /* scénarios intégrés : les entrées françaises (js/library.js) n'ont ni langue ni droit */
  const libLang = s => s.lang || 'fr';
  const libDroit = s => s.droit || 'fr';
  const libFind = id => (P.LIBRARY || []).find(s => s.id === id);
  const langLibrary = () => (P.LIBRARY || []).filter(s => libLang(s) === P.lang);
  /** Scénario par défaut (« Charger un exemple ») : la pyramide du droit en vigueur, sinon un scénario de la langue, sinon le français */
  const PYRAMID = { fr: 'pyramide', uk: 'uk-pyramid', us: 'us-pyramid', es: 'es-piramide' };
  function defaultScenario() {
    const list = langLibrary();
    return libFind(PYRAMID[P.juris]) || list.find(s => libDroit(s) === P.juris) || list[0] || libFind('pyramide') || P.LIBRARY[0];
  }
  /** Droit d'un scénario : en-tête « droit: », sinon celui de son entrée de bibliothèque, sinon le droit choisi */
  function scenarioDroit(sc, origin) {
    const m = P.norm(sc.meta.droit || sc.meta.law || sc.meta.derecho || '');
    if (P.JURIS[m]) return m;
    const e = origin && origin.id ? libFind(origin.id) : null;
    if (e) return libDroit(e);
    if (EMBED && EMBED.droit && P.JURIS[EMBED.droit]) return EMBED.droit;   // paquet SCORM
    return P.defaultJuris();
  }
  /** Applique le droit de l'état affiché ; en mode libre, il doit être l'un des droits de la langue de l'interface. */
  function applyJuris() {
    const st = App.state, laws = P.lawsFor(P.lang);
    if (App.mode === 'libre' && !laws.includes(st.options.droit)) st.options.droit = P.defaultJuris();
    P.setJuris(st.options.droit || P.defaultJuris());
    const legend = $('#legend');
    if (legend.dataset.juris && legend.dataset.juris !== P.juris) buildLegend(true);
    updateLawUI();
  }
  function updateLawUI() {
    const lab = $('#opt-defacto').closest('label');
    if (lab) lab.hidden = !P.jur().deFacto;
    const sel = $('#opt-droit'); if (!sel) return;
    const laws = P.lawsFor(P.lang);
    sel.hidden = laws.length < 2;
    if (sel.hidden) return;
    const codes = laws.includes(P.juris) ? laws : laws.concat(P.juris);
    if (sel.dataset.codes !== codes.join()) {
      sel.innerHTML = codes.map(c => `<option value="${c}">${P.JURIS[c].flag} ${c.toUpperCase()}</option>`).join('');
      sel.dataset.codes = codes.join();
    }
    sel.value = P.juris;
    // pendant la lecture d'un scénario, le droit est celui du scénario
    const locked = App.mode === 'cinema' && !!App.scenario;
    sel.disabled = locked;
    sel.title = locked ? t('Droit applicable : fixé par le scénario') : t('Droit applicable');
  }

  let toastT;
  function toast(msg, ms) {
    const el = $('#toast'); el.innerHTML = msg; el.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), ms || 2800);
  }
  function download(name, text, type) {
    const b = new Blob([text], { type: (type || 'text/markdown') + ';charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  }
  function copyText(text) {
    const done = () => toast(t('📋 Copié dans le presse-papiers'));
    const fallback = () => {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast(t('Copie impossible')); }
      ta.remove();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
  }

  /* ============================================================ rendu SVG */
  const svg = $('#canvas');
  const marker = (id, color) => `<marker id="${id}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="13" markerHeight="13" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0,0.5 L10,5 L0,9.5 z" fill="${color}"/></marker>`;
  svg.innerHTML = '<defs>' + P.CATS_ALL.map(c => marker('m-' + c.key, c.color)).join('') + marker('m-sup', '#94a3b8') + marker('m-tmp', '#4f46e5') +
    '<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><circle class="gdot" cx="2" cy="2" r="1.3"/></pattern>' +
    '<filter id="shadow" x="-20%" y="-30%" width="140%" height="170%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0f172a" flood-opacity=".10"/></filter>' +
    '</defs><rect class="bg" x="-50000" y="-50000" width="100000" height="100000"/><g id="world"></g>';
  const world = $('#world', svg);

  let raf = null;
  function requestRender() { if (!raf) raf = requestAnimationFrame(frame); }
  App.requestRender = requestRender;

  function frame() {
    raf = null;
    const now = performance.now(); let busy = false;
    const st = App.state;
    for (const id in App.disp) {
      const d = App.disp[id], e = st.entities[id];
      if (!e || d.drag) continue;
      const dx = e.x - d.x, dy = e.y - d.y;
      if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3) { d.x += dx * 0.16; d.y += dy * 0.16; busy = true; } else { d.x = e.x; d.y = e.y; }
      if (now - d.born < 700) busy = true;
    }
    for (const k in App.ldisp) { const l = App.ldisp[k]; if (now - l.born < 900 || now - l.changed < 1200) busy = true; }
    if (App.camT) {
      const c = App.cam, t = App.camT;
      c.x += (t.x - c.x) * 0.13; c.y += (t.y - c.y) * 0.13; c.k += (t.k - c.k) * 0.13;
      if (Math.abs(t.x - c.x) < 0.5 && Math.abs(t.y - c.y) < 0.5 && Math.abs(t.k - c.k) < 0.002) { Object.assign(c, t); App.camT = null; } else busy = true;
    }
    if ((st.view.focus && st.view.focus.length) || App.hoverRef) busy = true;
    draw(now);
    if (busy) requestRender();
  }

  function clipRect(c, tx, ty, m) {
    const dx = tx - c.x, dy = ty - c.y;
    if (!dx && !dy) return { x: c.x, y: c.y };
    const hw = NW / 2 + m, hh = NH / 2 + m;
    const t = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity);
    return { x: c.x + dx * t, y: c.y + dy * t };
  }
  function linkGeom(l) {
    const a = App.disp[l.from], b = App.disp[l.to];
    if (l.from === l.to) {
      const x = a.x + NW / 2, y = a.y;
      return { d: `M${x},${y - 16} C${x + 75},${y - 55} ${x + 75},${y + 55} ${x + 3},${y + 16}`, lx: x + 58, ly: y };
    }
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
    const rev = App.state.links.some(m => m.from === l.to && m.to === l.from);
    const off = rev ? 48 : 0;
    const cx = (a.x + b.x) / 2 + nx * off, cy = (a.y + b.y) / 2 + ny * off;
    const p0 = clipRect(a, cx, cy, 2), p2 = clipRect(b, cx, cy, 6);
    return {
      d: `M${p0.x.toFixed(1)},${p0.y.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`,
      lx: 0.25 * p0.x + 0.5 * cx + 0.25 * p2.x, ly: 0.25 * p0.y + 0.5 * cy + 0.25 * p2.y
    };
  }

  function linkSVG(l, now, chain, dim) {
    const an = App.an, k = P.linkKey(l), ld = App.ldisp[k] || { born: -1e9, changed: -1e9 };
    const sup = an.supp[l.to].set.has(l.from);
    const eff = sup ? 0 : (an.norm[l.to][l.from] || 0);
    const votes = l.votes == null ? l.capital : l.votes;
    const cat = P.category(eff);
    const col = sup ? '#94a3b8' : cat.color;
    const w = sup ? 2 : 2 + eff / 13;
    const g = linkGeom(l);
    const a = clamp((now - ld.born) / 700, 0, 1);
    const sel = App.sel && App.sel.kind === 'link' && App.sel.id === k;
    const inChain = chain.has(k);
    const faded = dim.has(l.from) && dim.has(l.to);
    let dash = '';
    if (sup) dash = 'stroke-dasharray:.025 .02;';
    else if (a < 1) dash = `stroke-dasharray:1;stroke-dashoffset:${(1 - ease(a)).toFixed(3)};`;
    let s = `<g class="link${sel ? ' sel' : ''}" data-link="${esc(k)}" style="opacity:${faded ? 0.25 : 1}">`;
    s += `<path class="hit" d="${g.d}"/>`;
    if (inChain || sel) s += `<path class="halo" d="${g.d}" style="stroke-width:${w + 9}px"/>`;
    s += `<path class="stroke" d="${g.d}" pathLength="1" style="stroke:${col};stroke-width:${w.toFixed(1)}px;${dash}"${a > 0.9 ? ` marker-end="url(#m-${sup ? 'sup' : cat.key})"` : ''}/>`;
    s += '</g>';
    let txt = votes !== l.capital ? t('{cap} · DV {votes}', { cap: fmt(l.capital), votes: fmt(votes) }) : fmt(l.capital);
    if (sup) txt += t(' · voix neutralisées');
    else if (Math.abs(eff - votes) > 0.05) txt += t(' → {v} eff.', { v: fmt(eff) });
    const lw = txt.length * 6.3 + 16;
    const pulse = now - ld.changed < 1200 ? 1 + 0.18 * Math.sin(Math.PI * (now - ld.changed) / 1200) : 1;
    const label = `<g class="llabel${sel ? ' sel' : ''}" data-link="${esc(k)}" transform="translate(${g.lx.toFixed(1)},${g.ly.toFixed(1)}) scale(${pulse.toFixed(3)})" style="opacity:${(faded ? 0.3 : 1) * a}"><rect x="${-lw / 2}" y="-10" width="${lw}" height="20" rx="10" style="stroke:${col}"/><text y="4" text-anchor="middle">${esc(txt)}</text></g>`;
    return { path: s, label };
  }

  function nodeSVG(id, now, pv, dimmed) {
    const st = App.state, an = App.an, e = st.entities[id], d = App.disp[id];
    const T = P.TYPES[e.type] || P.TYPES.societe;
    const u = an.ultimate[id];
    const ctl = an.controlled(id);
    let color = '#94a3b8', fill = 'var(--node-bg)', sw = 1.5;
    if (u) { color = App.colorFor(u.block.id); fill = tint(color, 0.13); sw = 2.5; }
    else if (ctl.length) { color = App.colorFor(id); fill = tint(color, 0.05); sw = 4; }
    const hasH = T.holdable && an.holders[id].length > 0;
    let l2 = T.short, l3 = '', l3c = 'var(--muted)';
    if (hasH) {
      const rest = 100 - an.capSum[id];
      l2 = an.capSum[id] > 100.001 ? t('⚠ capital attribué > 100 %') : (rest > 0.001 ? t('{type} · autres {v}', { type: T.short, v: fmt(rest) }) : t('{type} · capital 100 % identifié', { type: T.short }));
    }
    if (u) { l3 = (u.type === 'conjoint' ? t('🤝 conjoint : ') : '🎯 ') + nameOf(u.block.id) + (u.how === 'fait' ? t(' (de fait)') : ''); l3c = color; }
    else if (ctl.length) { l3 = ctl.length > 1 ? t('👑 contrôle {n} entités', { n: ctl.length }) : t('👑 contrôle {n} entité', { n: ctl.length }); l3c = color; }
    else if (hasH) l3 = t('○ aucun contrôle');
    if (pv) {
      if (id === pv) { l3 = t('👁 point de vue'); l3c = 'var(--accent)'; }
      else if (!dimmed) {
        const it = an.interestOf(pv, id), ok = an.ctrl[pv].has(id), pc = an.pct(pv, id);
        l3 = t('Intérêt {v}', { v: fmt(it * 100) }) + ' · ' + (ok ? t('contrôle ✔') : t('DV {v}', { v: fmt(pc) }));
        l3c = ok ? 'var(--ok)' : 'var(--ink)';
      }
    }
    const a = clamp((now - d.born) / 600, 0, 1);
    const sc = 0.7 + 0.3 * easeBack(a);
    const sel = App.sel && App.sel.kind === 'node' && App.sel.id === id;
    const focus = (st.view.focus || []).includes(id);
    const x0 = -NW / 2, y0 = -NH / 2;
    let s = `<g class="node${sel ? ' sel' : ''}" data-node="${esc(id)}" transform="translate(${d.x.toFixed(1)},${d.y.toFixed(1)}) scale(${sc.toFixed(3)})" style="opacity:${(a * (dimmed ? 0.35 : 1)).toFixed(3)}">`;
    if (focus) s += `<rect class="ring" x="${x0 - 8}" y="${y0 - 8}" width="${NW + 16}" height="${NH + 16}" rx="18" style="stroke-opacity:${(0.35 + 0.5 * (0.5 + 0.5 * Math.sin(now / 260))).toFixed(2)}"/>`;
    if (App.hoverRef === id) s += `<rect class="hovring" x="${x0 - 5}" y="${y0 - 5}" width="${NW + 10}" height="${NH + 10}" rx="16"/>`;
    if (sel) s += `<rect class="selring" x="${x0 - 5}" y="${y0 - 5}" width="${NW + 10}" height="${NH + 10}" rx="16"/>`;
    // fond opaque sous la teinte (sinon la grille transparaît, surtout en mode nuit)
    if (fill !== 'var(--node-bg)') s += `<rect x="${x0}" y="${y0}" width="${NW}" height="${NH}" rx="12" style="fill:var(--node-bg)"/>`;
    s += `<rect class="body" x="${x0}" y="${y0}" width="${NW}" height="${NH}" rx="12" style="fill:${fill};stroke:${color};stroke-width:${sw}px"/>`;
    s += `<text class="icon" x="${x0 + 11}" y="${y0 + 24}">${T.icon}</text>`;
    s += `<text class="name" x="${x0 + 35}" y="${y0 + 23}">${esc(trunc(e.name, 20))}</text>`;
    s += `<text class="sub" x="${x0 + 12}" y="${y0 + 45}">${esc(trunc(l2, 31))}</text>`;
    s += `<text class="st" x="${x0 + 12}" y="${y0 + 65}" style="fill:${l3c}">${esc(trunc(l3, 30))}</text>`;
    if (an.capSum[id] > 100.001 || an.voteSum[id] > 100.001) s += `<g class="warn"><circle cx="${NW / 2 - 4}" cy="${y0 + 4}" r="9"/><text x="${NW / 2 - 4}" y="${y0 + 8}" text-anchor="middle">!</text></g>`;
    if (App.mode === 'libre') s += `<g class="port" data-port="${esc(id)}"><circle cx="0" cy="${NH / 2}" r="9"/><text x="0" y="${NH / 2 + 4.5}" text-anchor="middle">+</text></g>`;
    s += `<title>${esc(e.name)}</title></g>`;
    return s;
  }

  function concertSVG(cn) {
    const ms = cn.members.filter(m => App.disp[m]);
    if (ms.length < 2) return '';
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    ms.forEach(m => { const d = App.disp[m]; x0 = Math.min(x0, d.x - NW / 2); x1 = Math.max(x1, d.x + NW / 2); y0 = Math.min(y0, d.y - NH / 2); y1 = Math.max(y1, d.y + NH / 2); });
    x0 -= 16; x1 += 16; y0 -= 30; y1 += 18;
    const color = App.colorFor('concert:' + cn.id);
    const sel = App.sel && App.sel.kind === 'concert' && App.sel.id === cn.id;
    return `<g class="concert${sel ? ' sel' : ''}" data-concert="${esc(cn.id)}"><rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="20" style="stroke:${color};fill:${tint(color, 0.05)}"/><text x="${x0 + 14}" y="${y0 + 19}" style="fill:${color}">🤝 ${esc(cn.name)}</text></g>`;
  }

  function wrap(text, n) {
    const words = String(text).split(/\s+/), lines = []; let cur = '';
    words.forEach(w => { if ((cur + ' ' + w).trim().length > n && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); });
    if (cur) lines.push(cur);
    return lines;
  }
  function noteSVG(id, text) {
    const d = App.disp[id]; const lines = wrap(text, 34);
    const lw = Math.max.apply(null, lines.map(l => l.length)) * 6.8 + 22, lh = lines.length * 16 + 12;
    // décalée à droite du centre pour ne pas masquer les liens entrants et leurs étiquettes
    // l'utilisateur peut la déplacer : la pointe suit alors l'entité
    const o = App.noteOff[id] || { dx: 0, dy: 0 };
    const x = d.x + 36 + o.dx, y = d.y - NH / 2 - 14 - lh + o.dy;
    const cx = clamp(d.x + 30, x + 12, x + lw - 12), ax = d.x + 30, ay = d.y - NH / 2 + 2;
    const tail = (o.dx || o.dy)
      ? (ay > y + lh ? `M${cx - 8},${y + lh - 0.5} L${ax},${ay} L${cx + 8},${y + lh - 0.5}` : `M${cx - 8},${y + 0.5} L${ax},${d.y + NH / 2 - 2} L${cx + 8},${y + 0.5}`)
      : `M${x + 14},${y + lh - 0.5} L${x + 12},${y + lh + 12} L${x + 28},${y + lh - 0.5}`;
    let s = `<g class="note" data-note="${esc(id)}"><title>${esc(t('Glisser pour déplacer la bulle'))}</title><path d="${tail}"/><rect x="${x}" y="${y}" width="${lw}" height="${lh}" rx="9"/>`;
    lines.forEach((l, i) => { s += `<text x="${(x + lw / 2).toFixed(1)}" y="${(y + 20 + i * 16).toFixed(1)}" text-anchor="middle">${esc(l)}</text>`; });
    return s + '</g>';
  }

  function draw(now) {
    const st = App.state, an = App.an; if (!an) return;
    const r = svg.getBoundingClientRect(), Wd = r.width || 800, Hd = r.height || 600, c = App.cam;
    svg.setAttribute('viewBox', `${c.x - Wd / 2 / c.k} ${c.y - Hd / 2 / c.k} ${Wd / c.k} ${Hd / c.k}`);
    const pv = st.view.perspective && st.entities[st.view.perspective] ? st.view.perspective : null;
    const dim = new Set();
    if (pv) for (const id in st.entities) if (id !== pv && an.interestOf(pv, id) < 1e-9 && an.pct(pv, id) < 1e-9 && !an.ctrl[pv].has(id)) dim.add(id);
    const chain = new Set();
    const addPath = (bid, C) => { const p = an.path(bid, C); for (let i = 0; i + 1 < p.length; i++) chain.add(p[i] + '>' + p[i + 1]); };
    if (App.sel && App.sel.kind === 'node' && st.entities[App.sel.id]) { const u = an.ultimate[App.sel.id]; if (u) addPath(u.block.id, App.sel.id); }
    if (pv) an.controlled(pv).forEach(C => addPath(pv, C));
    let g = '', labels = '', nodes = '', notes = '';
    (st.concerts || []).forEach(cn => { g += concertSVG(cn); });
    st.links.forEach(l => {
      if (!App.disp[l.from] || !App.disp[l.to]) return;
      const o = linkSVG(l, now, chain, dim); g += o.path; labels += o.label;
    });
    for (const id in st.entities) if (App.disp[id]) nodes += nodeSVG(id, now, pv, dim.has(id));
    for (const id in (st.view.notes || {})) if (App.disp[id]) notes += noteSVG(id, st.view.notes[id]);
    let tmp = '';
    const dr = App.drag;
    if (dr && dr.kind === 'port' && App.disp[dr.from]) { const a = App.disp[dr.from]; tmp = `<path class="tmp" d="M${a.x},${a.y + NH / 2} L${dr.x},${dr.y}" marker-end="url(#m-tmp)"/>`; }
    world.innerHTML = g + nodes + labels + notes + tmp;
  }

  /* ============================================================ cycle de mise à jour */
  function syncDisp(animate) {
    const now = performance.now(), st = App.state;
    for (const id in App.disp) if (!st.entities[id]) delete App.disp[id];
    for (const id in st.entities) {
      const e = st.entities[id];
      if (!App.disp[id]) App.disp[id] = { x: e.x, y: e.y, born: animate ? now : -1e9 };
    }
    const seen = {};
    st.links.forEach(l => {
      const k = P.linkKey(l); seen[k] = 1;
      const v = l.capital + '/' + l.votes, ld = App.ldisp[k];
      if (!ld) App.ldisp[k] = { born: animate ? now : -1e9, changed: -1e9, v };
      else if (ld.v !== v) { ld.v = v; ld.changed = animate ? now : -1e9; }
    });
    for (const k in App.ldisp) if (!seen[k]) delete App.ldisp[k];
  }
  function selExists(s) {
    const st = App.state;
    if (s.kind === 'node') return !!st.entities[s.id];
    if (s.kind === 'link') return !!findLinkByKey(s.id);
    if (s.kind === 'concert') return (st.concerts || []).some(c => c.id === s.id);
    return false;
  }

  App.commit = function (o) {
    o = o || {};
    const st = App.state;
    if (App.mode === 'cinema') {
      P.layout(st);
      for (const id in App.cinePos) if (st.entities[id]) Object.assign(st.entities[id], App.cinePos[id]);
    }
    applyJuris();
    App.an = P.analyze(st);
    syncDisp(o.animate !== false);
    if (App.sel && !selExists(App.sel)) App.sel = null;
    requestRender();
    updateBanner();
    $('#opt-defacto').checked = !!st.options.deFacto;
    if (App.mode === 'libre') {
      if (o.inspector === false) refreshAnalysis(); else App.renderInspector();
      saveLocal();
      updateStudio();
    } else App.renderCommentary();
  };

  App.fit = function (animate) {
    const st = App.state, ids = Object.keys(st.entities), r = svg.getBoundingClientRect();
    if (!r.width) return;
    let t;
    if (!ids.length) t = { x: 0, y: 150, k: 1 };
    else {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      ids.forEach(id => {
        const e = st.entities[id];
        const self = st.links.some(l => l.from === id && l.to === id);
        const note = (st.view.notes || {})[id];
        x0 = Math.min(x0, e.x - NW / 2); x1 = Math.max(x1, e.x + NW / 2 + (self ? 80 : 0), note ? e.x + 60 + Math.min(34, note.length) * 6.8 : -Infinity);
        y0 = Math.min(y0, e.y - NH / 2 - ((st.view.notes || {})[id] ? 70 : 0) - 30); y1 = Math.max(y1, e.y + NH / 2 + 10);
      });
      // la feuille de question occupe le bas du canevas : on cadre dans l'espace restant au-dessus
      const sheet = $('#qsheet');
      const inset = App.mode === 'cinema' && !sheet.hidden ? Math.min(sheet.offsetHeight, r.height * 0.7) : 0;
      // le bandeau « point de vue » occupe le haut : on réserve aussi sa place
      const banner = $('#banner'), top = banner.hidden ? 0 : banner.offsetHeight + 12;
      const pad = 50, h = Math.max(120, r.height - inset - top);
      const k = clamp(Math.min(r.width / (x1 - x0 + 2 * pad), h / (y1 - y0 + 2 * pad)), 0.25, 1.3);
      t = { x: (x0 + x1) / 2, y: (y0 + y1) / 2 + (inset - top) / 2 / k, k };
    }
    if (animate) App.camT = t; else { App.cam = Object.assign({}, t); App.camT = null; }
    requestRender();
  };

  function updateBanner() {
    const st = App.state, el = $('#banner'), pv = st.view.perspective;
    if (!pv || !st.entities[pv] || !App.an) { el.hidden = true; return; }
    const n = App.an.controlled(pv).length;
    el.innerHTML = t('👁 Point de vue : <b>{name}</b>', { name: esc(nameOf(pv)) }) + ' · ' + (n > 1 ? t('contrôle {n} entités', { n }) : t('contrôle {n} entité', { n })) + ` <button data-act="pvoff" title="${esc(t('Quitter le point de vue'))}">×</button>`;
    el.hidden = false;
  }
  $('#banner').addEventListener('click', ev => {
    if (!ev.target.closest('[data-act=pvoff]')) return;
    if (App.mode === 'libre') pushUndo();
    App.state.view.perspective = null; App.commit();
  });

  /* ============================================================ annuler / persistance */
  function pushUndo() {
    App.undoStack.push(JSON.stringify(App.state));
    if (App.undoStack.length > 120) App.undoStack.shift();
    App.redoStack = [];
  }
  function beginEdit() { if (!App.editing) { pushUndo(); App.editing = true; } }
  function endEdit() { App.editing = false; }
  function undo() {
    if (App.mode !== 'libre' || !App.undoStack.length) return;
    App.redoStack.push(JSON.stringify(App.state));
    App.state = JSON.parse(App.undoStack.pop()); App.commit({ animate: false });
  }
  function redo() {
    if (App.mode !== 'libre' || !App.redoStack.length) return;
    App.undoStack.push(JSON.stringify(App.state));
    App.state = JSON.parse(App.redoStack.pop()); App.commit({ animate: false });
  }
  function sanitize(o) {
    const s = P.newState();
    if (!o || typeof o !== 'object') return s;
    s.entities = o.entities || {}; s.links = o.links || []; s.concerts = o.concerts || [];
    s.options = Object.assign(s.options, o.options || {});
    s.view = Object.assign(s.view, o.view || {});
    s.view.focus = []; s.view.notes = {}; s.view.select = null;
    Object.values(s.entities).forEach(e => { e.fixed = true; });
    return s;
  }
  let saveT;
  function saveLocal() {
    clearTimeout(saveT);
    // l'état est capturé maintenant : dans 300 ms, App.state peut être celui d'un scénario (mode cinéma)
    const snap = App.state;
    saveT = setTimeout(() => { try { localStorage.setItem(LS_KEY, JSON.stringify(snap)); } catch (e) { /* stockage indisponible */ } }, 300);
  }

  /* ============================================================ interactions canevas */
  function toWorld(ev) {
    const r = svg.getBoundingClientRect(), c = App.cam;
    return { x: c.x + (ev.clientX - r.left - r.width / 2) / c.k, y: c.y + (ev.clientY - r.top - r.height / 2) / c.k };
  }

  /* pincer à deux doigts pour zoomer (écrans tactiles) */
  const touches = new Map();
  function startPinch() {
    const [a, b] = Array.from(touches.values());
    const d = App.drag;
    if (d && d.kind === 'node') { const dd = App.disp[d.id]; if (dd) dd.drag = false; }
    const mid = { clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 };
    App.drag = { kind: 'pinch', d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, k0: App.cam.k, w0: toWorld(mid) };
    App.camT = null;
  }
  svg.addEventListener('pointerdown', ev => {
    if (ev.pointerType === 'touch') {
      touches.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
      if (touches.size === 2) { startPinch(); return; }
      if (touches.size > 2) return;
    }
    if (ev.button !== 0 && ev.button !== 1) return;
    const w = toWorld(ev), t = ev.target;
    const port = t.closest('[data-port]'), node = t.closest('[data-node]'), link = t.closest('[data-link]'), conc = t.closest('[data-concert]'), note = t.closest('[data-note]');
    try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* pointeur déjà relâché */ }
    if (note && ev.button === 0) {
      const id = note.dataset.note, o = App.noteOff[id] || { dx: 0, dy: 0 };
      App.drag = { kind: 'note', id, sx: w.x, sy: w.y, dx0: o.dx, dy0: o.dy };
      return;
    }
    if (port && App.mode === 'libre' && ev.button === 0) { App.drag = { kind: 'port', from: port.dataset.port, x: w.x, y: w.y }; return; }
    if (node && ev.button === 0) {
      const id = node.dataset.node, d = App.disp[id];
      App.select({ kind: 'node', id });
      // en mode cinéma, le déplacement ne touche pas au scénario : il est mémorisé à part (App.cinePos)
      App.drag = { kind: App.mode === 'libre' ? 'node' : 'cnode', id, ox: w.x - d.x, oy: w.y - d.y, sx: w.x, sy: w.y, moved: false };
      return;
    }
    if (link && ev.button === 0) { App.select({ kind: 'link', id: link.dataset.link }); return; }
    if (conc && ev.button === 0) { App.select({ kind: 'concert', id: conc.dataset.concert }); return; }
    App.drag = { kind: 'pan', sx: ev.clientX, sy: ev.clientY, cx: App.cam.x, cy: App.cam.y, moved: false };
  });
  svg.addEventListener('pointermove', ev => {
    if (touches.has(ev.pointerId)) touches.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    const dr = App.drag; if (!dr) return;
    if (dr.kind === 'pinch') {
      if (touches.size < 2) return;
      const [a, b] = Array.from(touches.values()), r = svg.getBoundingClientRect();
      const k = clamp(dr.k0 * Math.hypot(a.x - b.x, a.y - b.y) / dr.d0, 0.2, 3);
      const mx = (a.x + b.x) / 2 - r.left - r.width / 2, my = (a.y + b.y) / 2 - r.top - r.height / 2;
      App.cam = { x: dr.w0.x - mx / k, y: dr.w0.y - my / k, k };   // le point pincé reste sous les doigts
      requestRender(); return;
    }
    const w = toWorld(ev);
    if (dr.kind === 'node' || dr.kind === 'cnode') {
      const e = App.state.entities[dr.id], d = App.disp[dr.id]; if (!e) return;
      if (!dr.moved) {
        if (Math.hypot(w.x - dr.sx, w.y - dr.sy) * App.cam.k < 4) return;
        if (dr.kind === 'node') pushUndo();
        dr.moved = true;
      }
      e.x = Math.round(w.x - dr.ox); e.y = Math.round(w.y - dr.oy); e.fixed = true;
      if (dr.kind === 'cnode') App.cinePos[dr.id] = { x: e.x, y: e.y };
      d.x = e.x; d.y = e.y; d.drag = true; requestRender();
    } else if (dr.kind === 'note') {
      App.noteOff[dr.id] = { dx: dr.dx0 + w.x - dr.sx, dy: dr.dy0 + w.y - dr.sy }; requestRender();
    } else if (dr.kind === 'port') { dr.x = w.x; dr.y = w.y; requestRender(); }
    else if (dr.kind === 'pan') {
      if (Math.hypot(ev.clientX - dr.sx, ev.clientY - dr.sy) > 3) dr.moved = true;
      App.cam.x = dr.cx - (ev.clientX - dr.sx) / App.cam.k; App.cam.y = dr.cy - (ev.clientY - dr.sy) / App.cam.k;
      App.camT = null; requestRender();
    }
  });
  function endDrag(ev) {
    touches.delete(ev.pointerId);
    const dr = App.drag; if (!dr) return;
    if (dr.kind === 'pinch') { if (touches.size < 2) App.drag = null; return; }
    App.drag = null;
    if (dr.kind === 'node') { const d = App.disp[dr.id]; if (d) d.drag = false; if (dr.moved) App.commit({ animate: false }); }
    else if (dr.kind === 'cnode') { const d = App.disp[dr.id]; if (d) d.drag = false; updatePlayer(); }
    else if (dr.kind === 'note') updatePlayer();
    else if (dr.kind === 'port') {
      const el = document.elementFromPoint(ev.clientX, ev.clientY);
      const tn = el && el.closest && el.closest('[data-node]');
      if (tn) createLink(dr.from, tn.dataset.node); else requestRender();
    } else if (dr.kind === 'pan' && !dr.moved) App.select(null);
  }
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', ev => { touches.delete(ev.pointerId); App.drag = null; requestRender(); });
  svg.addEventListener('wheel', ev => {
    ev.preventDefault();
    const w = toWorld(ev), c = App.cam;
    const k = clamp(c.k * Math.exp(-ev.deltaY * 0.0015), 0.2, 3);
    c.x = w.x - (w.x - c.x) * c.k / k; c.y = w.y - (w.y - c.y) * c.k / k; c.k = k;
    App.camT = null; requestRender();
  }, { passive: false });
  $('#zoom').addEventListener('click', ev => {
    const b = ev.target.closest('[data-z]'); if (!b) return;
    const z = b.dataset.z, base = App.camT || App.cam;
    if (z === 'fit') App.fit(true);
    else App.camT = { x: base.x, y: base.y, k: clamp(base.k * (z === 'in' ? 1.25 : 0.8), 0.2, 3) };
    requestRender();
  });
  let lastW = 0;
  const onResize = () => {
    const w = svg.getBoundingClientRect().width;
    if ((!lastW && w) || (App.mode === 'cinema' && w)) App.fit(!!lastW);
    lastW = w; requestRender();
  };
  if (window.ResizeObserver) new ResizeObserver(onResize).observe(svg); else window.addEventListener('resize', onResize);

  function createLink(from, to) {
    const st = App.state, te = st.entities[to];
    if (!te || !st.entities[from]) return;
    if (!(P.TYPES[te.type] || {}).holdable) { toast(t('« {name} » ({type}) ne peut pas être détenu(e).', { name: esc(te.name), type: P.TYPES[te.type].label.toLowerCase() })); requestRender(); return; }
    const ex = P.findLink(st, from, to);
    if (ex) { App.select({ kind: 'link', id: P.linkKey(ex) }); return; }
    const an = App.an, rest = 100 - (an.capSum[to] || 0);
    const cap = from === to ? 5 : (rest >= 1 ? Math.min(25, P.round2(rest)) : 10);
    pushUndo();
    const l = P.setLink(st, from, to, cap, null);
    App.sel = { kind: 'link', id: P.linkKey(l) };
    App.commit();
    if (rest < 1 && from !== to) toast(t('⚠ Le capital de cette société était déjà entièrement attribué.'));
  }

  function addEntityAt(type, x, y) {
    if (App.mode !== 'libre') return;
    const st = App.state, T = P.TYPES[type];
    pushUndo();
    const n = Object.values(st.entities).filter(e => e.type === type).length + 1;
    const id = P.addEntity(st, { type, name: `${T.short} ${n}`, x: Math.round(x), y: Math.round(y), fixed: true });
    App.sel = { kind: 'node', id };
    App.commit();
    const inp = $('#inspector input.name'); if (inp) { inp.focus(); inp.select(); }
  }
  $$('.tool[data-type]').forEach(el => {
    el.addEventListener('dragstart', ev => { ev.dataTransfer.setData('text/x-type', el.dataset.type); ev.dataTransfer.effectAllowed = 'copy'; });
    el.addEventListener('click', () => {
      // place libre la plus proche du centre de la vue (spirale)
      const c = App.camT || App.cam, es = Object.values(App.state.entities);
      const free = (x, y) => es.every(e => Math.abs(e.x - x) > NW + 30 || Math.abs(e.y - y) > NH + 50);
      let x = c.x, y = c.y;
      for (let i = 0; i < 200 && !free(x, y); i++) { const a = i * 0.9, r = 60 + i * 18; x = c.x + Math.cos(a) * r * 1.6; y = c.y + Math.sin(a) * r; }
      addEntityAt(el.dataset.type, x, y);
    });
  });
  const stage = $('#stage');
  stage.addEventListener('dragover', ev => { if (Array.from(ev.dataTransfer.types).includes('text/x-type')) { ev.preventDefault(); ev.dataTransfer.dropEffect = 'copy'; } });
  stage.addEventListener('drop', ev => {
    const t = ev.dataTransfer.getData('text/x-type');
    if (!t) return;
    ev.preventDefault(); ev.stopPropagation();
    const w = toWorld(ev); addEntityAt(t, w.x, w.y);
  });
  window.addEventListener('dragover', ev => { if (Array.from(ev.dataTransfer.types).includes('Files')) ev.preventDefault(); });
  window.addEventListener('drop', ev => {
    const f = ev.dataTransfer.files && ev.dataTransfer.files[0];
    if (!f) return; ev.preventDefault(); openFile(f);
  });

  App.select = function (sel) {
    App.sel = sel;
    if (App.mode === 'libre') { endEdit(); App.renderInspector(); } else App.renderCommentary();
    requestRender();
  };

  function deleteSel() {
    const s = App.sel; if (!s || App.mode !== 'libre') return;
    pushUndo();
    if (s.kind === 'node') P.removeEntity(App.state, s.id);
    else if (s.kind === 'link') { const l = findLinkByKey(s.id); if (l) P.removeLink(App.state, l.from, l.to); }
    else if (s.kind === 'concert') App.state.concerts = App.state.concerts.filter(c => c.id !== s.id);
    App.sel = null; App.commit();
  }

  /* ============================================================ analyse (texte) */
  function catBadge(l) {
    const an = App.an;
    const sup = an.supp[l.to] && an.supp[l.to].set.has(l.from);
    if (sup) return '<div class="cat" style="--c:#94a3b8">' + t('🔁 Voix neutralisées (autocontrôle / auto-détention)') + '</div>';
    const eff = an.norm[l.to][l.from] || 0, c = P.category(eff), v = l.votes == null ? l.capital : l.votes;
    return `<div class="cat" style="--c:${c.color}" title="${esc(c.text)}">${esc(c.label)}${Math.abs(eff - v) > 0.05 ? t(' · {v} des voix effectives', { v: fmt(eff) }) : ''}</div>`;
  }

  App.analysisHTML = function (id) {
    const an = App.an, st = App.state, e = st.entities[id]; if (!e) return '';
    const T = P.TYPES[e.type] || P.TYPES.societe;
    let h = '<h4>' + t('Analyse') + '</h4>';
    const hasH = T.holdable && an.holders[id].length > 0;
    if (hasH) {
      const u = an.ultimate[id];
      if (u) {
        const color = App.colorFor(u.block.id);
        const path = an.path(u.block.id, id), inter = an.interestOf(u.block.id, id);
        const vv = { who: esc(blockLabel(u.block)), name: esc(e.name) };
        h += `<div class="verdict" style="--c:${color}">🎯 ${u.type === 'conjoint' ? t('<b>{who}</b> contrôle <b>conjointement</b> {name}', vv) : t('<b>{who}</b> contrôle {name}', vv)}${u.how === 'fait' ? t(' — <i>contrôle de fait présumé (plus de 40 % et aucun autre associé au-dessus)</i>') : ''}.</div>`;
        if (path.length > 2) h += `<div class="chain">${t('🔗 Chaîne de contrôle : {chain}', { chain: path.map(p => esc(nameOf(p))).join(' → ') })}</div>`;
        h += `<div class="kv"><span>${t('Droits de vote contrôlés')}</span><b>${fmt(an.pct(u.block.id, id))}</b></div>`;
        h += `<div class="kv"><span>${t('Intérêt économique (capital)')}</span><b>${fmt(inter * 100)}</b></div>`;
        if (inter < 0.5 - 1e-9) {
          const iv = { v: fmt(inter * 100), who: esc(blockLabel(u.block)) };
          h += `<div class="insight">${path.length > 2
            ? t('⚡ Avec seulement <b>{v}</b> du capital économique, {who} détient le contrôle : pouvoir et capital sont dissociés grâce à la chaîne de sociétés contrôlées.', iv)
            : t('⚡ Avec seulement <b>{v}</b> du capital économique, {who} détient le contrôle : pouvoir et capital sont dissociés.', iv)}</div>`;
        }
      } else {
        h += `<div class="verdict none">${an.deFacto
          ? t("Aucun actionnaire, ni groupe d'actionnaires de concert, ne contrôle {name} : aucun bloc ne dépasse 50 % des droits de vote et aucun ne bénéficie de la présomption de contrôle de fait.", { name: esc(e.name) })
          : t("Aucun actionnaire, ni groupe d'actionnaires de concert, ne contrôle {name} : aucun bloc ne dépasse 50 % des droits de vote.", { name: esc(e.name) })}</div>`;
      }
      const blocs = an.blocs(id), base = 100 - an.supp[id].total;
      const restV = base > 0 ? Math.max(0, 100 - an.voteSum[id]) * 100 / base : 0;
      h += `<table class="mini"><tr><th>${t('Blocs de vote (par contrôleur ultime)')}</th><th class="n">${t('DV eff.')}</th><th class="n">${t('Intérêt')}</th></tr>`;
      blocs.forEach(b => {
        const c = P.category(b.pct);
        h += `<tr><td><span class="dot" style="background:${c.color}"></span>${esc(blockLabel(b.block))}</td><td class="n">${fmt(b.pct)}</td><td class="n">${fmt(b.interest * 100)}</td></tr>`;
      });
      if (restV > 0.001) h += `<tr><td class="muted"><span class="dot" style="background:#e2e8f0"></span>${t('Autres actionnaires')}</td><td class="n muted">${fmt(restV)}</td><td class="n muted">${fmt(Math.max(0, 100 - an.capSum[id]))}</td></tr>`;
      h += '</table>';
      const BK = BLOCKING[P.juris];
      if (BK) {
        const blockers = blocs.filter(b => b.pct > BK.lo && !(u && u.block.id === b.block.id) && b.pct < BK.hi);
        if (blockers.length) h += `<div class="warnbox">${BK.minority.replace('{names}', blockers.map(b => `<b>${esc(blockLabel(b.block))}</b>`).join(', '))}</div>`;
        if (u && an.pct(u.block.id, id) < BK.hi) h += `<div class="muted small">${BK.controller}</div>`;
      }
      const sp = an.supp[id];
      if (sp.total > 0) h += `<div class="warnbox">${t('🔁 <b>Autocontrôle / auto-détention</b> : {v} des droits de vote sont neutralisés ({why}). Les pourcentages effectifs sont calculés sur {base}.', { v: fmt(sp.total), why: P.jur().txt.autocontrol.replace('{name}', esc(e.name)), base: fmt(100 - sp.total) })}</div>`;
      if (an.capSum[id] > 100.001) h += `<div class="warnbox">${t('⚠ La somme des participations au capital dépasse 100 % ({v}).', { v: fmt(an.capSum[id]) })}</div>`;
      if (an.voteSum[id] > 100.001) h += `<div class="warnbox">${t('⚠ La somme des droits de vote dépasse 100 % ({v}).', { v: fmt(an.voteSum[id]) })}</div>`;
    }
    const ctl = an.controlled(id);
    if (ctl.length) {
      const cv = { name: esc(e.name), n: ctl.length };
      h += `<h5>${ctl.length > 1 ? t('{name} contrôle {n} entités', cv) : t('{name} contrôle {n} entité', cv)}</h5><table class="mini"><tr><th>${t('Entité')}</th><th class="n">${t('DV contrôlés')}</th><th class="n">${t('Intérêt')}</th></tr>`;
      ctl.forEach(c => { h += `<tr><td><a data-act="sel" data-id="${esc(c)}">${esc(nameOf(c))}</a>${an.how[id][c] === 'fait' ? ` <i class="muted">${t('(de fait)')}</i>` : ''}</td><td class="n">${fmt(an.pct(id, c))}</td><td class="n">${fmt(an.interestOf(id, c) * 100)}</td></tr>`; });
      h += '</table>';
    }
    const inv = an.ids.filter(c => c !== id && !an.ctrl[id].has(c) && an.interestOf(id, c) > 1e-6);
    if (inv.length) {
      h += `<h5>${t('Intérêts sans contrôle')}</h5><table class="mini"><tr><th>${t('Entité')}</th><th class="n">${t('DV')}</th><th class="n">${t('Intérêt')}</th></tr>`;
      inv.forEach(c => { h += `<tr><td><a data-act="sel" data-id="${esc(c)}">${esc(nameOf(c))}</a></td><td class="n">${fmt(an.pct(id, c))}</td><td class="n">${fmt(an.interestOf(id, c) * 100)}</td></tr>`; });
      h += '</table>';
    }
    const cs = (st.concerts || []).filter(c => c.members.includes(id));
    cs.forEach(c => {
      const bid = 'concert:' + c.id, cc = an.blockById[bid] ? an.controlled(bid).filter(x => !an.ctrl[id].has(x)) : [];
      if (cc.length) h += `<div class="chain">${t('🤝 Via « {name} », participe au contrôle conjoint de : {list}.', { name: esc(c.name), list: cc.map(x => esc(nameOf(x))).join(', ') })}</div>`;
    });
    return h;
  };

  function concertAnalysis(cid) {
    const an = App.an, bid = 'concert:' + cid;
    if (!an.blockById[bid]) return '<p class="muted small">' + t('Un pacte doit réunir au moins deux membres.') + '</p>';
    const cc = an.controlled(bid).filter(x => an.ultimate[x] && an.ultimate[x].block.id === bid);
    if (!cc.length) return '<h4>' + t('Analyse') + '</h4><div class="verdict none">' + t("Les membres du pacte ne réunissent la majorité des voix dans aucune société qu'un membre ne contrôlerait pas déjà seul.") + '</div>';
    return '<h4>' + t('Analyse') + '</h4>' + cc.map(c => `<div class="verdict" style="--c:${App.colorFor(bid)}">${t('🤝 Contrôle conjoint de {name} avec {v} des voix.', { name: `<a data-act="sel" data-id="${esc(c)}"><b>${esc(nameOf(c))}</b></a>`, v: fmt(an.pct(bid, c)) })}</div>`).join('');
  }

  /* ============================================================ inspecteur (mode libre) */
  function linkEditor(l, side) {
    const k = P.linkKey(l), st = App.state, linked = l.votes == null, v = linked ? l.capital : l.votes;
    let head = '';
    if (side) {
      const oid = side === 'from' ? l.from : l.to, e = st.entities[oid];
      head = `<div class="le-head"><a data-act="sel" data-id="${esc(oid)}">${iconOf(oid)} ${esc(l.from === l.to ? e.name + t(' (auto-détention)') : e.name)}</a><button class="x" data-act="dellink" title="${esc(t('Supprimer cette participation'))}">×</button></div>`;
    }
    return `<div class="le" data-link="${esc(k)}">${head}
      <div class="sl"><span>${t('Capital')}</span><input type="range" min="0" max="100" step="0.5" value="${l.capital}" data-act="cap"><input type="number" min="0" max="100" step="0.01" value="${P.round2(l.capital)}" data-act="capn"><i>%</i></div>
      <div class="sl${linked ? ' off' : ''}"><span>${t('Droits de vote')}</span><input type="range" min="0" max="100" step="0.5" value="${v}" data-act="vot"${linked ? ' disabled' : ''}><input type="number" min="0" max="100" step="0.01" value="${P.round2(v)}" data-act="votn"${linked ? ' disabled' : ''}><i>%</i></div>
      <label class="chk"><input type="checkbox" data-act="vlink"${linked ? ' checked' : ''}> ${t('droits de vote = capital (1 action = 1 voix)')}</label>
      ${catBadge(l)}</div>`;
  }

  function overviewHTML() {
    const st = App.state, an = App.an, ids = Object.keys(st.entities);
    if (!ids.length) {
      return `<div class="welcome"><h3>${t('Bienvenue 👋')}</h3>
        <p>${t('Cet atelier permet de construire des <b>structures de participations</b> et de voir qui contrôle quoi — et avec quel capital réel.')}</p>
        <ol><li>${t('Glissez des <b>entités</b> depuis la palette.')}</li><li>${t("Tirez la poignée <b>+</b> d'un actionnaire vers une société.")}</li><li>${t('Réglez <b>capital</b> et <b>droits de vote</b> dans ce panneau.')}</li><li>${t("Activez le <b>👁 point de vue</b> d'un actionnaire.")}</li></ol>
        <div class="btns"><button class="primary" data-act="example">${t('✨ Charger un exemple')}</button><button data-act="cinema">${t('🎬 Voir les scénarios')}</button></div></div>`;
    }
    const nE = ids.length, nL = st.links.length;
    let h = `<h3>${t("Vue d'ensemble")}</h3><p class="muted small">${nE > 1 ? t('{n} entités', { n: nE }) : t('{n} entité', { n: nE })} · ${nL > 1 ? t('{n} participations', { n: nL }) : t('{n} participation', { n: nL })} · ${t('{n} pacte(s)', { n: (st.concerts || []).length })}</p>`;
    const roots = an.blocks.filter(b => an.controlled(b.id).length && (b.kind === 'concert' ? an.controlled(b.id).some(c => an.ultimate[c] && an.ultimate[c].block.id === b.id) : !an.ultimate[b.id]));
    h += '<h4>' + t('Contrôleurs ultimes') + '</h4>';
    if (!roots.length) h += '<p class="muted small">' + t("Personne ne contrôle aucune société pour l'instant.") + '</p>';
    h += '<ul class="ctrl-list">' + roots.map(b => {
      const list = an.controlled(b.id).filter(c => an.ultimate[c] && an.ultimate[c].block.id === b.id);
      return `<li><span class="dot" style="background:${App.colorFor(b.id)}"></span><b>${b.kind === 'concert' ? `<a data-act="selconcert" data-id="${esc(b.id.slice(8))}">${esc(blockLabel(b))}</a>` : `<a data-act="sel" data-id="${esc(b.id)}">${esc(blockLabel(b))}</a>`}</b><br><span class="small">${list.map(c => `${esc(nameOf(c))} <span class="muted">${t('(intérêt {v})', { v: fmt(an.interestOf(b.id, c) * 100) })}</span>`).join(', ')}</span></li>`;
    }).join('') + '</ul>';
    const indep = ids.filter(i => P.TYPES[st.entities[i].type].holdable && an.holders[i].length && !an.ultimate[i]);
    if (indep.length) h += `<h4>${t('Sociétés sans contrôle')}</h4><p class="small">${indep.map(i => `<a data-act="sel" data-id="${esc(i)}">${esc(nameOf(i))}</a>`).join(', ')}</p>`;
    h += `<h4>${t('Point de vue')}</h4><select data-act="pvsel" class="add"><option value="">${t('— aucun —')}</option>${ids.map(i => `<option value="${esc(i)}"${st.view.perspective === i ? ' selected' : ''}>${iconOf(i)} ${esc(nameOf(i))}</option>`).join('')}</select>`;
    h += '<p class="hint">' + t('Cliquez sur une entité ou un lien pour le modifier. Glisser le fond déplace la vue, la molette zoome.') + '</p>';
    return h;
  }

  function entityInspector(id) {
    const st = App.state, an = App.an, e = st.entities[id];
    const T = P.TYPES[e.type] || P.TYPES.societe, pv = st.view.perspective === id;
    const hasH = an.holders[id].length > 0;
    let h = `<div class="insp-head"><span class="big">${T.icon}</span><input class="name" data-act="rename" value="${esc(e.name)}" spellcheck="false" title="${esc(t('Renommer'))}"></div>`;
    h += `<div class="row"><label>${t('Type')}</label><select data-act="type">${Object.keys(P.TYPES).map(k => `<option value="${k}"${k === e.type ? ' selected' : ''}${!P.TYPES[k].holdable && hasH ? ' disabled' : ''}>${P.TYPES[k].icon} ${P.TYPES[k].label}</option>`).join('')}</select></div>`;
    h += `<div class="btns"><button data-act="pv" class="${pv ? 'on' : ''}">👁 ${pv ? t('Quitter le point de vue') : t('Point de vue')}</button><button data-act="del" class="danger">${t('🗑 Supprimer')}</button></div>`;
    if (T.holdable) {
      h += '<h4>' + t('Actionnaires') + '</h4>';
      an.holders[id].forEach(x => { h += linkEditor(x.link, 'from'); });
      const rc = 100 - an.capSum[id], rv = 100 - an.voteSum[id];
      h += `<div class="rest${rc < -0.001 || rv < -0.001 ? ' bad' : ''}">${rc < -0.001 ? t('⚠ Le capital attribué dépasse 100 % !') : t('Autres actionnaires (non représentés) : <b>{v}</b> du capital', { v: fmt(rc) }) + (Math.abs(rc - rv) > 0.001 ? t(' · <b>{v}</b> des voix', { v: fmt(Math.max(0, rv)) }) : '')}${rv < -0.001 ? '<br>' + t('⚠ Les droits de vote attribués dépassent 100 % !') : ''}</div>`;
      const cand = Object.keys(st.entities).filter(o => !P.findLink(st, o, id));
      if (cand.length) h += `<select data-act="addholder" class="add"><option value="">${t('＋ Ajouter un actionnaire…')}</option>${cand.map(o => `<option value="${esc(o)}">${o === id ? t('↻ elle-même (auto-détention)') : iconOf(o) + ' ' + esc(nameOf(o))}</option>`).join('')}</select>`;
    }
    h += '<h4>' + t('Participations détenues') + '</h4>';
    const held = an.held[id].filter(x => x.to !== id);
    if (!held.length) h += '<p class="muted small">' + t('Aucune.') + '</p>';
    held.forEach(x => { h += linkEditor(x.link, 'to'); });
    const cand2 = Object.keys(st.entities).filter(o => o !== id && P.TYPES[st.entities[o].type].holdable && !P.findLink(st, id, o));
    if (cand2.length) h += `<select data-act="addheld" class="add"><option value="">${t('＋ Prendre une participation dans…')}</option>${cand2.map(o => `<option value="${esc(o)}">${iconOf(o)} ${esc(nameOf(o))}</option>`).join('')}</select>`;
    h += '<h4>' + t('Pactes / action de concert') + '</h4>';
    (st.concerts || []).filter(c => c.members.includes(id)).forEach(c => { h += `<div class="pill-row"><a data-act="selconcert" data-id="${esc(c.id)}">🤝 ${esc(c.name)}</a></div>`; });
    h += '<button data-act="newconcert" class="small">' + t('＋ Nouveau pacte avec…') + '</button>';
    h += `<div id="insp-analysis">${App.analysisHTML(id)}</div>`;
    return h;
  }

  function linkInspector(k) {
    const l = findLinkByKey(k); if (!l) return overviewHTML();
    const an = App.an, sup = an.supp[l.to].set.has(l.from), eff = sup ? 0 : an.norm[l.to][l.from];
    const la = `<a data-act="sel" data-id="${esc(l.from)}">${iconOf(l.from)} ${esc(nameOf(l.from))}</a>`;
    let h = `<h3>${t('🔗 Participation')}</h3><p>${l.from === l.to ? t('{a} détient <b>ses propres actions</b> (auto-détention)', { a: la }) : t('{a} détient des titres de {b}', { a: la, b: `<a data-act="sel" data-id="${esc(l.to)}">${iconOf(l.to)} ${esc(nameOf(l.to))}</a>` })}</p>`;
    h += linkEditor(l, null);
    h += `<p class="small muted">${sup ? t("Ces actions sont privées de droit de vote : elles sont détenues par la société elle-même ou par une société qu'elle contrôle.") : esc(P.category(eff).text)}</p>`;
    h += '<div class="btns"><button data-act="dellink" class="danger">' + t('🗑 Supprimer la participation') + '</button></div>';
    h += `<div id="insp-analysis">${App.analysisHTML(l.to)}</div>`;
    return h;
  }

  function concertInspector(cid) {
    const st = App.state, c = (st.concerts || []).find(x => x.id === cid); if (!c) return overviewHTML();
    let h = `<div class="insp-head"><span class="big">🤝</span><input class="name" data-act="cname" value="${esc(c.name)}" spellcheck="false"></div>`;
    h += '<p class="small muted">' + P.jur().txt.concert + '</p>';
    h += '<h4>' + t('Membres') + '</h4><div class="members">' + Object.keys(st.entities).map(id => `<label><input type="checkbox" data-act="cmember" value="${esc(id)}"${c.members.includes(id) ? ' checked' : ''}> ${iconOf(id)} ${esc(nameOf(id))}</label>`).join('') + '</div>';
    h += '<div class="btns"><button data-act="delconcert" class="danger">' + t('Dissoudre le pacte') + '</button></div>';
    h += `<div id="insp-analysis">${concertAnalysis(cid)}</div>`;
    return h;
  }

  App.renderInspector = function () {
    const el = $('#inspector'), s = App.sel;
    if (!App.an) return;
    if (!s) el.innerHTML = overviewHTML();
    else if (s.kind === 'node') el.innerHTML = entityInspector(s.id);
    else if (s.kind === 'link') el.innerHTML = linkInspector(s.id);
    else if (s.kind === 'concert') el.innerHTML = concertInspector(s.id);
  };
  function refreshAnalysis() {
    const s = App.sel, box = $('#insp-analysis');
    if (!s) { $('#inspector').innerHTML = overviewHTML(); return; }
    if (box) {
      if (s.kind === 'node') box.innerHTML = App.analysisHTML(s.id);
      else if (s.kind === 'link') { const l = findLinkByKey(s.id); if (l) box.innerHTML = App.analysisHTML(l.to); }
      else if (s.kind === 'concert') box.innerHTML = concertAnalysis(s.id);
    }
    $$('#inspector .le').forEach(le => {
      const l = findLinkByKey(le.dataset.link), c = le.querySelector('.cat');
      if (l && c) c.outerHTML = catBadge(l);
    });
  }

  const insp = $('#inspector');
  insp.addEventListener('input', ev => {
    const t = ev.target, act = t.dataset.act; if (!act) return;
    const st = App.state;
    if (act === 'rename') { beginEdit(); st.entities[App.sel.id].name = t.value; App.commit({ inspector: false, animate: false }); return; }
    if (act === 'cname') { beginEdit(); const c = st.concerts.find(x => x.id === App.sel.id); if (c) c.name = t.value; App.commit({ inspector: false, animate: false }); return; }
    if (!['cap', 'capn', 'vot', 'votn'].includes(act)) return;
    const le = t.closest('.le'), l = le && findLinkByKey(le.dataset.link); if (!l) return;
    const raw = parseFloat(String(t.value).replace(',', '.'));
    if (isNaN(raw)) return;
    const v = clamp(raw, 0, 100);
    beginEdit();
    const set = (a, val) => { const i = le.querySelector(`[data-act=${a}]`); if (i && i !== t) i.value = a.endsWith('n') ? P.round2(val) : val; };
    if (act === 'cap' || act === 'capn') {
      l.capital = v; set('cap', v); set('capn', v);
      if (l.votes == null) { set('vot', v); set('votn', v); }
    } else { l.votes = v; set('vot', v); set('votn', v); }
    App.commit({ inspector: false, animate: false });
  });
  insp.addEventListener('change', ev => {
    const t = ev.target, act = t.dataset.act, st = App.state;
    if (!act) return;
    if (['cap', 'capn', 'vot', 'votn', 'rename', 'cname'].includes(act)) { endEdit(); App.renderInspector(); return; }
    if (act === 'type') { pushUndo(); st.entities[App.sel.id].type = t.value; App.commit(); return; }
    if (act === 'vlink') {
      const l = findLinkByKey(t.closest('.le').dataset.link); if (!l) return;
      pushUndo(); l.votes = t.checked ? null : l.capital; App.commit(); return;
    }
    if (act === 'addholder' && t.value) { createLink(t.value, App.sel.id); return; }
    if (act === 'addheld' && t.value) { createLink(App.sel.id, t.value); return; }
    if (act === 'cmember') {
      const c = st.concerts.find(x => x.id === App.sel.id); if (!c) return;
      pushUndo();
      c.members = t.checked ? Array.from(new Set(c.members.concat(t.value))) : c.members.filter(m => m !== t.value);
      App.commit(); return;
    }
    if (act === 'pvsel') { pushUndo(); st.view.perspective = t.value || null; App.commit(); }
  });
  insp.addEventListener('click', ev => {
    const b = ev.target.closest('[data-act]'); if (!b) return;
    const st = App.state, act = b.dataset.act;
    switch (act) {
      case 'sel': App.select({ kind: 'node', id: b.dataset.id }); break;
      case 'selconcert': App.select({ kind: 'concert', id: b.dataset.id }); break;
      case 'del': case 'delconcert': deleteSel(); break;
      case 'dellink': {
        const le = b.closest('.le');
        const l = le ? findLinkByKey(le.dataset.link) : findLinkByKey(App.sel.id);
        if (!l) return;
        pushUndo(); P.removeLink(st, l.from, l.to); App.commit(); break;
      }
      case 'pv': pushUndo(); st.view.perspective = st.view.perspective === App.sel.id ? null : App.sel.id; App.commit(); break;
      case 'newconcert': openConcertModal(App.sel && App.sel.kind === 'node' ? [App.sel.id] : []); break;
      case 'example': loadExample(); break;
      case 'cinema': setMode('cinema'); break;
    }
  });

  function openConcertModal(pre) {
    const st = App.state, ids = Object.keys(st.entities);
    if (ids.length < 2) { toast(t('Il faut au moins deux entités pour créer un pacte.')); return; }
    const c = App.modal(`<h2>${t('🤝 Nouveau pacte / action de concert')}</h2>
      <p class="muted small">${t("Les membres d'un pacte votent ensemble : leurs voix sont additionnées pour déterminer le contrôle (contrôle conjoint).")}</p>
      <label class="field"><span>${t('Nom du pacte')}</span><input type="text" id="cn-name" value="${esc(t('Pacte {n}', { n: (st.concerts || []).length + 1 }))}"></label>
      <div class="field"><span>${t('Membres')}</span><div class="members">${ids.map(id => `<label><input type="checkbox" value="${esc(id)}"${pre.includes(id) ? ' checked' : ''}> ${iconOf(id)} ${esc(nameOf(id))}</label>`).join('')}</div></div>
      <div class="btns"><button class="primary" id="cn-ok">${t('Créer le pacte')}</button></div>`, 'narrow');
    $('#cn-ok', c).onclick = () => {
      const mem = $$('.members input:checked', c).map(i => i.value);
      if (mem.length < 2) { toast(t('Choisissez au moins deux membres.')); return; }
      pushUndo();
      let n = 1; while (st.concerts.some(x => x.id === 'C' + n)) n++;
      const cn = { id: 'C' + n, name: $('#cn-name', c).value.trim() || t('Pacte {n}', { n }), members: mem };
      st.concerts.push(cn);
      App.closeModal(); App.sel = { kind: 'concert', id: cn.id }; App.commit();
    };
  }
  $('#tool-concert').onclick = () => openConcertModal(App.sel && App.sel.kind === 'node' ? [App.sel.id] : []);

  /* ============================================================ légende */
  function buildLegend(refresh) {
    const el = $('#legend');
    let h = '<div class="lg-h">' + t('Légende') + ' <span>▾</span></div><div class="lg-body"><div class="lg-sec">' + t('Liens (droits de vote effectifs)') + '</div>';
    P.CATS.forEach(c => { h += `<div class="lg-row" title="${esc(c.text)}"><span class="sw" style="border-color:${c.color}"></span>${esc(c.label)}</div>`; });
    h += '<div class="lg-row"><span class="sw dash" style="border-color:#94a3b8"></span>' + t('voix neutralisées (autocontrôle)') + '</div>';
    h += '<div class="lg-sec">' + t('Entités') + '</div>';
    h += `<div class="lg-row"><span class="box" style="border-color:${PALETTE[0]};border-width:3px"></span>${t('contrôleur ultime (couleur propre)')}</div>`;
    h += `<div class="lg-row"><span class="box" style="border-color:${PALETTE[0]};background:${tint(PALETTE[0], 0.15)}"></span>${t("contrôlée par l'entité de même couleur")}</div>`;
    h += '<div class="lg-row"><span class="box" style="border-color:#94a3b8;border-style:dashed"></span>' + t('pacte : contrôle conjoint') + '</div></div>';
    el.innerHTML = h;
    el.dataset.juris = P.juris;
    if (refresh) { $('.lg-h', el).onclick = toggleLegend; return; }
    let pref = null;
    try { pref = localStorage.getItem('capital-lab.legend'); } catch (e) { /* */ }
    if (pref === '0' || (pref == null && window.innerHeight < 800)) el.classList.add('collapsed');
    $('.lg-h', el).onclick = toggleLegend;
  }
  function toggleLegend() {
    const el = $('#legend');
    el.classList.toggle('collapsed');
    try { localStorage.setItem('capital-lab.legend', el.classList.contains('collapsed') ? '0' : '1'); } catch (e) { /* */ }
  }

  /* ============================================================ modales */
  App.modal = function (html, cls) {
    const m = $('#modal'); m.className = cls || '';
    const c = $('.content', m); c.innerHTML = html; m.hidden = false;
    return c;
  };
  App.closeModal = () => { $('#modal').hidden = true; };
  $('#modal').addEventListener('click', ev => { if (ev.target.id === 'modal' || ev.target.closest('.close')) App.closeModal(); });

  function openLibrary() {
    const card = s => {
      const sc = P.parseScenario(s.md);
      return `<div class="lib-card"><h4>${esc(sc.title)}</h4><p>${esc(sc.description)}</p><span class="small muted">${t('{n} étapes', { n: sc.steps.length })}</span>
        <div class="btns"><button class="primary" data-run="${s.id}">${t('▶ Lancer')}</button><button data-see="${s.id}">📝 Markdown</button><button data-dl="${s.id}" title="${esc(t('Télécharger le fichier .md'))}">⬇</button></div></div>`;
    };
    const list = langLibrary(), laws = P.lawsFor(P.lang);
    let cards;
    if (laws.length > 1) {
      // plusieurs droits pour cette langue (anglais : Royaume-Uni, États-Unis) : un groupe par droit, celui en vigueur d'abord
      const order = laws.includes(P.juris) ? [P.juris].concat(laws.filter(l => l !== P.juris)) : laws;
      cards = order.map(l => {
        const items = list.filter(s => libDroit(s) === l); if (!items.length) return '';
        const J = P.JURIS[l];
        return `<h3 class="lib-law">${J.flag} ${esc(J.name)}</h3><div class="lib-grid">${items.map(card).join('')}</div>`;
      }).join('');
      const other = list.filter(s => !laws.includes(libDroit(s)));
      if (other.length) cards += `<div class="lib-grid">${other.map(card).join('')}</div>`;
    } else cards = `<div class="lib-grid">${list.map(card).join('')}</div>`;
    const c = App.modal(`<h2>${t('📚 Scénarios')}</h2>${cards}
      <h3>${t('Votre propre scénario')}</h3>
      <p class="muted small">${t('Collez le markdown fourni par un enseignant ou généré par une IA, ou ouvrez / déposez un fichier .md.')}</p>
      <textarea id="md-input" placeholder="${esc(t('# Mon scénario\n\n## 1. Première étape\nCommentaire…')).replace(/\n/g, '&#10;')}&#10;&#10;\`\`\`scene&#10;${esc(t('personne FAM "Famille"\nsociete A "Alpha SA"\nlien FAM -> A 51%')).replace(/\n/g, '&#10;')}&#10;\`\`\`"></textarea>
      <div class="btns"><button class="primary" id="md-run">${t('▶ Lancer ce scénario')}</button><button id="md-file">${t('📂 Ouvrir un fichier .md')}</button><button id="md-prompt" title="${esc(t('Consigne à donner à une IA avec votre cours'))}">${t('🤖 Consigne pour une IA')}</button><button id="md-spec">${t('📄 Format des scénarios')}</button></div>`);
    c.addEventListener('click', ev => {
      const b = ev.target.closest('button'); if (!b) return;
      const get = libFind;
      if (b.dataset.run) { App.closeModal(); App.loadScenario(get(b.dataset.run).md, { id: b.dataset.run }); }
      else if (b.dataset.see) openEditor(get(b.dataset.see).md, false);
      else if (b.dataset.dl) download(b.dataset.dl + '.md', get(b.dataset.dl).md.replace(/~~~scene/g, '```scene').replace(/^~~~$/gm, '```'));
      else if (b.id === 'md-run') { const v = $('#md-input', c).value; if (v.trim()) { App.closeModal(); App.loadScenario(v); } }
      else if (b.id === 'md-file') $('#file-input').click();
      else if (b.id === 'md-prompt') copyText(P.IA_CONSIGNE);
      else if (b.id === 'md-spec') openHelp('format');
    });
  }

  function openEditor(md, isCurrent) {
    const c = App.modal(`<h2>${t('📝 Markdown du scénario')}</h2>
      <p class="muted small">${t('Modifiez le texte puis relancez. Les blocs <code>scene</code> contiennent les commandes (voir « Format des scénarios »).')}</p>
      <textarea id="ed-md" class="big" spellcheck="false"></textarea>
      <div class="btns"><button class="primary" id="ed-run">▶ ${isCurrent ? t('Appliquer (rester à cette étape)') : t('Lancer')}</button><button id="ed-copy">${t('📋 Copier')}</button><button id="ed-dl">${t('⬇ Télécharger .md')}</button><button id="ed-spec">${t('📄 Format')}</button></div>`);
    $('#ed-md', c).value = md;
    $('#ed-run', c).onclick = () => {
      const keep = App.step; App.closeModal();
      const v = $('#ed-md').value;
      // un scénario modifié n'est plus celui de la bibliothèque : il sera partagé par son texte
      const origin = isCurrent && v === App.scenarioSrc ? App.origin : null;
      if (App.loadScenario(v, origin) && isCurrent) App.goStep(keep);
    };
    $('#ed-copy', c).onclick = () => copyText($('#ed-md').value);
    $('#ed-dl', c).onclick = () => download('scenario.md', $('#ed-md').value);
    $('#ed-spec', c).onclick = () => openHelp('format');
  }

  /* Instructions complètes pour une IA : la page publiée (à jour), sinon la version embarquée (hors ligne). */
  function copyAllInstructions(consigne) {
    const demande = '\n\n---\n\n# ' + t('Ma demande') + '\n\n' + P.iaConsigneSansLien(consigne) + '\n\n';
    fetch(P.lang === 'fr' ? 'docs/instructions-ia.md' : `docs/${P.lang}/instructions-ia.md`).then(r => { if (!r.ok) throw 0; return r.text(); })
      .catch(() => fetch(P.IA_INSTRUCTIONS_URL).then(r => { if (!r.ok) throw 0; return r.text(); }))
      .then(txt => copyText(txt.trim() + demande), () => copyText(P.AI_PROMPT.trim() + demande));
  }

  function openHelp(which) {
    if (which === 'format') {
      const c = App.modal(`<div class="help-doc md">${P.md(P.FORMAT_DOC)}</div>
        <div class="btns"><button class="primary" id="hp-dl">${t('⬇ Télécharger la spécification (.md)')}</button><a class="btnlink" href="${docHref('format-scenario')}" target="_blank" rel="noopener">${t('📖 Dans la documentation')}</a></div>`);
      $('#hp-dl', c).onclick = () => download('format-scenario.md', P.FORMAT_DOC);
      return;
    }
    const doc = (page, label, sub) => `<a class="doc-link" href="${docHref(page)}" target="_blank" rel="noopener">${label}${sub != null ? `<small>${sub}</small>` : ''}</a>`;
    const c = App.modal(`<h2>${t('❔ Aide')}</h2>
      <div class="help-cols">
        <div class="help-card"><h3>${t('✏️ Mode libre')}</h3><a href="${docHref('prise-en-main')}" target="_blank" rel="noopener" title="${esc(t('Voir la page « Mode libre » de la documentation'))}"><img src="docs/images/libre-analyse-jour.jpg" alt="${esc(t('Mode libre : palette, structure et analyse'))}" loading="lazy"></a>${P.md(P.HELP_LIBRE)}</div>
        <div class="help-card"><h3>${t('🎬 Mode cinéma')}</h3><a href="${docHref('mode-cinema')}" target="_blank" rel="noopener" title="${esc(t('Voir la page « Mode cinéma » de la documentation'))}"><img src="docs/images/question-revelee-nuit.jpg" alt="${esc(t('Mode cinéma : une question révélée, en mode nuit'))}" loading="lazy"></a>${P.md(P.HELP_CINEMA)}</div>
      </div>
      <div class="help-ai">
        <h3>${t('🤖 Préparer son cours avec une IA')}</h3>
        <ol class="help-steps">
          <li>${t('<b>Copiez la consigne</b> (elle contient le lien vers les instructions ; le texte est modifiable) :')}
            <div class="help-prompt" id="hp-text" contenteditable="true" spellcheck="false">${esc(P.IA_CONSIGNE)}</div>
            <button id="hp-consigne" class="big">${t('📋 Copier la consigne')}</button></li>
          <li>${t('<b>Collez-la dans votre IA</b> (ChatGPT, Claude, Gemini, Mistral…), puis ajoutez votre cours.')}</li>
          <li>${t('<b>Collez la réponse</b> dans 📚 Scénarios, puis Lancer.')}</li>
        </ol>
        <details class="help-more"><summary>${t('Votre IA ne peut pas ouvrir de lien ?')}</summary>
          <p>${t('Copiez la version complète (instructions et consigne en un seul texte), puis ajoutez votre cours.')}</p>
          <div class="btns"><button id="hp-all" class="warn">${t('📄 Copier la version complète')}</button>${doc('ia-et-skill', t('En savoir plus →'))}</div>
        </details>
      </div>
      <h3>${t('📖 Documentation complète')}</h3>
      <div class="doc-links">
        ${doc('mode-cinema', t('🎬 Mode cinéma'), t('lecture, questions, téléphone, partage'))}
        ${doc('prise-en-main', t('✏️ Mode libre'), t('construire, analyser, studio'))}
        ${doc('scenarios', t('📚 Scénarios'), t('les 10 scénarios intégrés'))}
        ${doc('regles-de-calcul', t('🧮 Règles de calcul'), t('contrôle, intérêts, couleurs, limites'))}
        ${doc('format-scenario', t('📄 Format des scénarios'), t('écrire ou corriger un scénario'))}
        ${doc('', t('🏠 Accueil de la documentation'), t('tout le reste'))}
      </div>
      <p class="help-thanks">${P.md(P.HELP_THANKS).replace(/^<p>|<\/p>$/g, '')}</p>`);
    $('#hp-consigne', c).onclick = () => copyText($('#hp-text', c).innerText.trim());
    $('#hp-all', c).onclick = () => copyAllInstructions($('#hp-text', c).innerText);
  }

  /* ============================================================ fichiers */
  function openFile(f) {
    const r = new FileReader();
    r.onload = () => {
      const txt = String(r.result);
      if (/\.json$/i.test(f.name)) {
        try {
          const o = JSON.parse(txt);
          const st = sanitize(o.state || o);
          if (App.mode !== 'libre') setMode('libre');
          pushUndo(); App.state = st; App.sel = null; App.disp = {}; App.commit({ animate: true }); App.fit(true);
          toast(t('📂 Structure chargée : {name}', { name: esc(f.name) }));
        } catch (e) { toast(t('⚠ Fichier JSON invalide')); }
      } else { App.closeModal(); App.loadScenario(txt); }
    };
    r.readAsText(f, 'utf-8');
  }
  $('#file-input').addEventListener('change', ev => { const f = ev.target.files[0]; if (f) openFile(f); ev.target.value = ''; });

  function loadExample() {
    const sc = P.parseScenario(defaultScenario().md);
    const st = P.buildState(sc, sc.steps.length - 1);
    P.layout(st);
    Object.values(st.entities).forEach(e => { e.fixed = true; });
    st.view.focus = []; st.view.notes = {}; st.view.select = null;
    pushUndo(); App.state = st; App.sel = null; App.commit(); App.fit(true);
  }
  $('#tool-example').onclick = loadExample;

  /* ============================================================ mode cinéma */
  /** origin : d'où vient le scénario, pour pouvoir le partager par lien —
   *  { id } (bibliothèque), { url } (fichier servi), { packed } (texte encodé dans le lien) ou rien. */
  App.loadScenario = function (md, origin, startStep) {
    const sc = P.parseScenario(md);
    if (!sc.steps.length) { toast(t('⚠ Ce scénario ne contient aucune étape.')); return false; }
    sc.meta.droit = scenarioDroit(sc, origin);
    const errs = []; P.buildState(sc, sc.steps.length - 1, errs);
    sc.errors = sc.errors.concat(errs);
    App.pause();
    App.scenario = sc; App.scenarioSrc = md; App.origin = origin || null;
    App.colorMap = {}; App.colorIdx = 0; App.disp = {}; App.ldisp = {}; App.step = -1;
    App.cinePos = {}; App.noteOff = {};
    if (App.mode !== 'cinema') setMode('cinema', true);
    App.goStep(startStep || 0);
    if (errs.length) toast(t('⚠ {n} avertissement(s) dans le scénario (voir sous le commentaire).', { n: errs.length }), 4000);
    return true;
  };

  App.goStep = function (n) {
    const sc = App.scenario; if (!sc || !sc.steps.length) return;
    n = clamp(n, 0, sc.steps.length - 1);
    const changed = n !== App.step;
    if (changed) App.q = { revealed: false, collapsed: false, picked: null, flipped: {} };
    App.state = P.buildState(sc, n, null, App.q.revealed); App.step = n;
    App.sel = App.state.view.select ? { kind: 'node', id: App.state.view.select } : null;
    renderQSheet();
    App.commit();
    App.fit(true);
    updatePlayer();
    if (changed) $('#side').scrollTop = 0;
    App.schedule();
    syncUrl();
    notifyHost('step');
  };

  /* informe la plateforme d'apprentissage (paquet SCORM) de la progression */
  function notifyHost(kind) {
    const sc = App.scenario;
    if (!host || !sc || !host[kind]) return;
    const q = sc.steps[App.step].question;
    host[kind]({
      step: App.step, total: sc.steps.length,
      questions: sc.steps.filter(s => s.question && s.question.choices.some(c => c.correct)).length,
      correct: q && q.choices.some(c => c.correct) ? App.q.picked != null && !!(q.choices[App.q.picked] || {}).correct : null
    });
  }

  /* ---- liens profonds : ?scenario=id | ?md=url | #md=texte-encodé, + &etape=N ; ?scenarios ouvre la bibliothèque */
  const PUBLIC_BASE = 'https://edu-fpar.github.io/capital-lab/';
  function baseUrl() {
    // depuis un fichier local ou un serveur local, on partage l'adresse publique
    const local = location.protocol === 'file:' || /^(localhost|127\.|\[::1\])/.test(location.hostname);
    return local ? PUBLIC_BASE : location.origin + location.pathname;
  }
  function scenarioUrl(base, step) {
    const o = App.origin; if (!o) return null;
    const u = new URL(base);
    if (P.lang !== 'fr') u.searchParams.set('lang', P.lang);   // le lien garde la langue de l'interface
    if (o.id) u.searchParams.set('scenario', o.id);
    else if (o.url) u.searchParams.set('md', o.url);
    if (step > 0) u.searchParams.set('etape', step + 1);
    if (o.packed) u.hash = 'md=' + o.packed;
    return u.toString();
  }
  function syncUrl() {
    try {
      const here = location.origin + location.pathname;
      const target = App.mode === 'cinema' && App.scenario ? scenarioUrl(location.protocol === 'file:' ? location.href.split(/[?#]/)[0] : here, App.step) : null;
      history.replaceState(null, '', target || location.href.split(/[?#]/)[0]);
    } catch (e) { /* adresse non modifiable (fichier local selon le navigateur) */ }
  }
  /* texte du scénario compressé dans le lien (deflate + base64url), préfixe z ; repli non compressé, préfixe b */
  async function packMd(md) {
    const toB64 = bytes => { let bin = ''; bytes.forEach(b => { bin += String.fromCharCode(b); }); return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
    const raw = new TextEncoder().encode(md);
    if (!window.CompressionStream) return 'b' + toB64(raw);
    const buf = await new Response(new Blob([raw]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer();
    return 'z' + toB64(new Uint8Array(buf));
  }
  async function unpackMd(code) {
    const bin = atob(code.slice(1).replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
    if (code[0] === 'b') return new TextDecoder().decode(bytes);
    return await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text();
  }

  async function openShare() {
    if (!App.scenario) { openLibrary(); return; }
    const base = baseUrl(), isLocal = base !== location.origin + location.pathname;
    if (!App.origin) { try { App.origin = { packed: await packMd(App.scenarioSrc) }; } catch (e) { toast(t('Encodage du scénario impossible dans ce navigateur.')); return; } }
    const lib = new URL(base); lib.searchParams.set('scenarios', '');
    const links = [
      [t('Cette étape'), t("Ouvre « {title} » directement à l'étape {n}.", { title: esc(App.scenario.title), n: App.step + 1 }), scenarioUrl(base, App.step)],
      [t('Début du scénario'), t('Ouvre le scénario à sa première étape.'), scenarioUrl(base, 0)],
      [t('Bibliothèque'), t('Ouvre le choix des scénarios.'), lib.toString().replace('scenarios=', 'scenarios')]
    ];
    const long = App.origin.packed && links[0][2].length > 6000;
    const c = App.modal(`<h2>${t('🔗 Partager')}</h2>
      ${App.origin.packed ? '<p class="small muted">' + t('Ce scénario ne fait pas partie de la bibliothèque : son texte est encodé dans le lien lui-même (après le #). Aucun serveur ne le reçoit.') + '</p>' : ''}
      ${long ? '<p class="small" style="color:var(--warn)">' + t('⚠ Lien très long : certaines messageries peuvent le couper. Pour un long scénario, publiez plutôt le fichier .md et utilisez ?md=adresse-du-fichier.') + '</p>' : ''}
      ${isLocal ? `<p class="small muted">${App.origin.id ? t("Liens construits sur l'adresse publique <b>{url}</b> : le scénario doit y avoir été publié.", { url: esc(PUBLIC_BASE) }) : t("Liens construits sur l'adresse publique <b>{url}</b>.", { url: esc(PUBLIC_BASE) })}</p>` : ''}
      ${links.map(([lt, d, u], i) => `<div class="share-row"><div><b>${lt}</b><span class="small muted"> — ${d}</span></div><div class="share-line"><input type="text" readonly value="${esc(u)}" id="sh-${i}"><button data-copy="${i}">${t('📋 Copier')}</button><a class="btnlink" href="${esc(u)}" target="_blank" rel="noopener">↗</a></div></div>`).join('')}`, 'narrow');
    c.addEventListener('click', ev => { const b = ev.target.closest('[data-copy]'); if (b) copyText($('#sh-' + b.dataset.copy, c).value); });
    $$('input[readonly]', c).forEach(i => i.addEventListener('focus', () => i.select()));
  }
  $('#btn-share').onclick = openShare;

  /* ---- export SCORM : l'atelier et le scénario dans un paquet pour Moodle ou un autre LMS (js/scorm.js) */
  function openScorm() {
    if (!App.scenario) { openLibrary(); return; }
    const sc = App.scenario, nq = sc.steps.filter(s => s.question && s.question.choices.some(c => c.correct)).length;
    const c = App.modal(`<h2>${t('📦 Exporter en SCORM')}</h2>
      <p class="small muted">${t("Un fichier .zip à déposer dans Moodle (activité « Paquetage SCORM ») ou dans une autre plateforme d'apprentissage. Il contient l'atelier et ce scénario : les élèves le suivent seuls, en pas à pas, sans connexion à ce site.")}</p>
      <label class="field"><span>${t('Titre dans la plateforme')}</span><input type="text" id="sc-title" value="${esc(sc.title)}"></label>
      <label class="field"><span>${t('Version')}</span><select id="sc-ver"><option value="1.2">${t('SCORM 1.2 (recommandé, Moodle)')}</option><option value="2004">${t('SCORM 2004 4ᵉ édition')}</option></select></label>
      ${nq ? `<label class="chk"><input type="checkbox" id="sc-score" checked> ${nq > 1 ? t("Transmettre une note sur 100 : part des {n} questions où l'élève choisit une bonne carte avant de révéler la réponse", { n: nq }) : t("Transmettre une note sur 100 : 100 si l'élève choisit une bonne carte avant de révéler la réponse")}</label>` : ''}
      <ul class="small muted">
        <li>${t("Activité <b>terminée</b> quand l'élève atteint la dernière étape ({n}).", { n: sc.steps.length })}</li>
        <li>${t("En revenant, l'élève reprend à l'étape où il s'était arrêté.")}</li>
      </ul>
      <div class="btns"><button class="primary" id="sc-ok">${t('⬇ Télécharger le paquet SCORM')}</button></div>`, 'narrow');
    $('#sc-ok', c).onclick = async () => {
      const b = $('#sc-ok', c), title = $('#sc-title', c).value.trim() || sc.title, version = $('#sc-ver', c).value;
      b.disabled = true; b.textContent = t('⏳ Préparation…');
      try {
        const blob = await P.scormPackage({ md: App.scenarioSrc, title, version, score: !!($('#sc-score', c) || {}).checked, publicBase: PUBLIC_BASE, lang: P.lang, droit: App.state.options.droit });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
        a.download = 'scorm-' + (P.slug(title).toLowerCase().replace(/_/g, '-') || 'scenario') + '.zip';
        document.body.appendChild(a); a.click();
        setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
        App.closeModal(); toast(t('📦 Paquet SCORM téléchargé'));
      } catch (e) {
        b.disabled = false; b.textContent = t('⬇ Télécharger le paquet SCORM');
        toast(t('⚠ Paquet impossible à construire : fichiers de l’atelier inaccessibles (ouvrez l’atelier depuis un serveur web ou en ligne).'), 6000);
      }
    };
  }
  $('#btn-scorm').onclick = openScorm;

  const curQuestion = () => App.mode === 'cinema' && App.scenario && App.scenario.steps[App.step] ? App.scenario.steps[App.step].question : null;

  /** Révèle la réponse de l'étape question : cartes, explication et commandes « réponse » du canevas. */
  App.reveal = function () {
    const q = curQuestion();
    if (!q || App.q.revealed) return;
    App.q.revealed = true;
    const sel = App.sel;
    App.state = P.buildState(App.scenario, App.step, null, true);
    App.sel = App.state.view.select ? { kind: 'node', id: App.state.view.select } : sel;
    renderQSheet();
    App.commit();
    App.fit(true);
    updatePlayer();
    App.schedule();
    notifyHost('reveal');
  };

  /** Contenu de la question : en feuille sur le canevas (écran large) ou dans le texte (téléphone). */
  function qsheetHTML(q, inline) {
    const Q = App.q, inl = x => P.md(x, { nameOf });
    let h = `<div class="qs-head" data-qs="toggle" title="${esc(t('Réduire / agrandir'))}"><span class="qs-badge">${t('❓ Question')}</span><div class="qs-text">${inl(q.text)}</div><div class="qs-actions">`;
    h += Q.revealed ? '<span class="qs-done">' + t('✔ Réponse révélée') + '</span>' : `<button class="primary" data-qs="reveal" title="${esc(t('Révéler la réponse (→)'))}">${t('💡 Révéler la réponse')}</button>`;
    h += `<button class="qs-min" data-qs="toggle" title="${Q.collapsed ? t('Agrandir') : t('Réduire')}">${Q.collapsed ? '▴' : '▾'}</button></div></div><div class="qs-body">`;
    if (q.choices.length) {
      h += '<div class="qs-grid">' + q.choices.map((c, i) => {
        const cls = ['qcard', Q.picked === i ? 'picked' : '', Q.revealed ? (c.correct ? 'correct' : 'wrong') : '', Q.revealed && Q.flipped[i] ? 'flipped' : ''].join(' ');
        const pickTag = Q.picked === i ? '<span class="qc-pick">' + t('👥 choix de la salle') + '</span>' : '';
        return `<div class="${cls}" data-card="${i}" role="button" tabindex="0"><div class="qc-inner">
          <div class="qc-face qc-front"><span class="qc-letter">${'ABCDEFGHIJ'[i] || i + 1}</span><div class="qc-txt">${inl(c.text)}${pickTag}</div>${Q.revealed ? `<span class="qc-mark">${c.correct ? '✓' : '✗'}</span>` : ''}</div>
          <div class="qc-face qc-back"><div class="qc-verdict">${c.correct ? t('✓ Bonne réponse') : t('✗ Mauvaise réponse')}</div><div class="qc-txt">${c.explain ? inl(c.explain) : ''}</div></div>
        </div></div>`;
      }).join('') + '</div>';
      h += `<p class="qs-hint">${Q.revealed ? (q.choices.some(c => c.explain) ? t('Cliquez sur une carte (ou tapez son numéro) pour la retourner et lire son explication.') : t('Cliquez sur une carte pour la retourner.')) : t('Cliquez sur la réponse choisie par la salle (ou tapez son numéro), puis révélez la réponse (→).')}${inline ? '' : t(' Le canevas reste déplaçable au-dessus.')}</p>`;
    } else {
      h += `<p class="qs-open">${Q.revealed ? (inline ? t('La réponse est affichée ci-dessous.') : t('La réponse est affichée dans le panneau de droite.')) : t('Question ouverte : échangez avec la salle, puis révélez la réponse (→).')}</p>`;
    }
    return h + '</div>';
  }
  function renderQSheet() {
    const el = $('#qsheet'), q = curQuestion();
    // sur téléphone, la question s'affiche dans le texte (voir renderCommentary)
    if (!q || isMobile()) { el.hidden = true; stage.style.setProperty('--sheet-h', '0px'); return; }
    el.innerHTML = qsheetHTML(q, false);
    el.hidden = false;
    el.classList.toggle('collapsed', App.q.collapsed);
    stage.style.setProperty('--sheet-h', el.offsetHeight + 'px');
  }

  $('#qsheet').addEventListener('click', ev => {
    const a = ev.target.closest('[data-qs]');
    if (a && a.dataset.qs === 'reveal') { ev.stopPropagation(); App.reveal(); return; }
    if (a && a.dataset.qs === 'toggle') { App.q.collapsed = !App.q.collapsed; renderQSheet(); App.fit(true); return; }
    const c = ev.target.closest('[data-card]');
    if (c) clickCard(+c.dataset.card);
  });
  function clickCard(i) {
    const q = curQuestion(); if (!q || !q.choices[i]) return;
    if (App.q.revealed) {
      App.q.flipped[i] = !App.q.flipped[i];
      $$(`[data-card="${i}"]`).forEach(el => el.classList.toggle('flipped', App.q.flipped[i]));
    } else { App.q.picked = App.q.picked === i ? null : i; refreshQuestion(); }
  }
  function refreshQuestion() {
    renderQSheet();
    if (isMobile() && App.mode === 'cinema') { const y = $('#side').scrollTop; App.renderCommentary(); $('#side').scrollTop = y; }
  }

  App.schedule = function () {
    clearTimeout(App.timer);
    const bar = $('#pl-timer i');
    bar.style.transition = 'none'; bar.style.width = '0%';
    if (!(App.playing && App.mode === 'cinema' && App.playMode === 'continu' && App.scenario)) return;
    // la lecture continue attend que l'enseignant révèle la réponse d'une question
    if (curQuestion() && !App.q.revealed) return;
    const d = P.stepDuration(App.scenario.steps[App.step], App.q.revealed) / App.speed;
    void bar.offsetWidth;
    bar.style.transition = `width ${d}ms linear`; bar.style.width = '100%';
    App.timer = setTimeout(() => {
      if (App.step < App.scenario.steps.length - 1) App.goStep(App.step + 1);
      else { App.playing = false; updatePlayer(); App.schedule(); }
    }, d);
  };
  App.pause = function () { App.playing = false; clearTimeout(App.timer); updatePlayer(); const bar = $('#pl-timer i'); bar.style.transition = 'none'; bar.style.width = '0%'; };
  function togglePlay() {
    if (!App.scenario) return;
    if (App.playing) { App.pause(); return; }
    App.playing = true;
    if (App.step >= App.scenario.steps.length - 1) App.goStep(0); else { updatePlayer(); App.schedule(); }
  }
  function next() {
    if (curQuestion() && !App.q.revealed) { App.reveal(); return; }   // 1er appui : la réponse ; 2e : la suite
    if (App.scenario && App.step < App.scenario.steps.length - 1) App.goStep(App.step + 1);
  }
  function prev() { if (App.scenario && App.step > 0) App.goStep(App.step - 1); }

  function updatePlayer() {
    const sc = App.scenario, cont = App.playMode === 'continu';
    $('#pl-play').hidden = !cont;
    $('#pl-play').textContent = App.playing ? t('⏸ Pause') : t('▶ Lecture');
    $('#pl-next').className = cont ? '' : 'primary';
    $('#pl-timer').style.visibility = cont ? 'visible' : 'hidden';
    $('.speed').style.display = cont ? '' : 'none';
    if (!sc) { $('#pl-count').textContent = '–'; $('#pl-dots').innerHTML = ''; return; }
    $('#pl-count').textContent = `${App.step + 1} / ${sc.steps.length}`;
    $('#pl-dots').innerHTML = sc.steps.map((s, i) => `<button data-go="${i}" class="${i === App.step ? 'cur' : i < App.step ? 'done' : ''}" title="${esc((i + 1) + '. ' + stepTitle(s))}"></button>`).join('');
    $('#pl-reset').hidden = !Object.keys(App.cinePos).length && !Object.keys(App.noteOff).length;
    $('#pl-prev').disabled = App.step <= 0;
    const pending = !!curQuestion() && !App.q.revealed;
    $('#pl-next').textContent = pending ? (isMobile() ? t('💡 Réponse') : t('💡 Réponse ▶')) : (isMobile() ? t('Suivant') : t('Suivant ▶'));
    $('#pl-next').title = pending ? t('Révéler la réponse (→)') : t('Étape suivante (→)');
    $('#pl-next').disabled = !pending && App.step >= sc.steps.length - 1;
  }
  $('#pl-first').onclick = () => App.goStep(0);
  $('#pl-prev').onclick = prev;
  $('#pl-next').onclick = next;
  $('#pl-play').onclick = togglePlay;
  $('#pl-reset').onclick = () => { App.cinePos = {}; App.noteOff = {}; App.goStep(App.step); };
  $('#pl-dots').addEventListener('click', ev => { const b = ev.target.closest('[data-go]'); if (b) App.goStep(+b.dataset.go); });
  $('#pl-mode').onchange = ev => {
    App.playMode = ev.target.value;
    try { localStorage.setItem('capital-lab.playmode', App.playMode); } catch (e) { /* */ }
    if (App.playMode === 'pas') App.pause(); else { App.playing = true; updatePlayer(); App.schedule(); }
  };
  $('#pl-speed').oninput = ev => {
    App.speed = parseFloat(ev.target.value);
    $('#pl-speed-v').textContent = App.speed.toLocaleString(P.locale || 'fr-FR') + '×';
  };
  $('#pl-speed').onchange = () => { if (App.playing) App.schedule(); };

  function perspectiveSummary(pv) {
    const an = App.an, rows = an.ids.filter(c => c !== pv && (an.interestOf(pv, c) > 1e-6 || an.ctrl[pv].has(c)));
    if (!rows.length) return '';
    return `<div class="auto"><div class="auto-h">${t('👁 Point de vue : {name}', { name: esc(nameOf(pv)) })}</div><table class="mini"><tr><th>${t('Entité')}</th><th class="n">${t('Intérêt')}</th><th class="n">${t('DV contrôlés')}</th><th class="n">${t('Contrôle')}</th></tr>${rows.map(c => `<tr><td><span class="ref" data-ref="${esc(c)}">${esc(nameOf(c))}</span></td><td class="n">${fmt(an.interestOf(pv, c) * 100)}</td><td class="n">${fmt(an.pct(pv, c))}</td><td class="n">${an.ctrl[pv].has(c) ? '✔' : '—'}</td></tr>`).join('')}</table></div>`;
  }

  App.renderCommentary = function () {
    const el = $('#commentary'), sc = App.scenario;
    if (!sc) {
      el.innerHTML = '<div class="empty"><h2>' + t('🎬 Mode cinéma') + '</h2><p>' + t("Un scénario déroule, étape par étape, la construction d'une structure de participations avec ses commentaires.") + '</p><button class="primary" data-act="lib">' + t('📚 Choisir un scénario') + '</button></div>';
      return;
    }
    const s = sc.steps[App.step], st = App.state;
    let h = `<div class="sc-head"><div class="sc-title">${esc(sc.title)}</div><div class="sc-no">${t('Étape {n} / {total}', { n: App.step + 1, total: sc.steps.length })}</div></div>`;
    h += `<h2 class="step-title">${s.question ? '❓ ' : ''}${esc(stepTitle(s))}</h2><div class="md">${P.md(s.md, { nameOf })}</div>`;
    if (s.question) {
      const q = s.question, good = q.choices.map((c, i) => c.correct ? `<b>${'ABCDEFGHIJ'[i] || i + 1}</b> — ${P.md(c.text, { nameOf }).replace(/^<p>|<\/p>$/g, '')}` : null).filter(Boolean);
      if (isMobile()) h += `<div class="qinline">${qsheetHTML(q, true)}</div>`;
      if (!App.q.revealed) { if (!isMobile()) h += '<div class="answer-wait">' + t("La réponse s'affichera ici.") + ' <button class="small" data-act="reveal">' + t('💡 Révéler la réponse') + '</button></div>'; }
      else if (good.length || q.answerMd) {
        h += `<details class="answer" open><summary>${t('💡 Réponse')}</summary>${good.length ? `<p class="good">${good.length > 1 ? t('Bonnes réponses : {list}', { list: good.join(' ; ') }) : t('Bonne réponse : {list}', { list: good.join(' ; ') })}</p>` : ''}<div class="md">${P.md(q.answerMd, { nameOf })}</div></details>`;
      }
    }
    const target = App.sel && App.sel.kind === 'node' ? App.sel.id : null;
    if (target && st.entities[target]) h += `<div class="auto"><div class="auto-h">🔍 ${iconOf(target)} ${esc(nameOf(target))}<button data-act="unsel" title="${esc(t('Fermer'))}">×</button></div>${App.analysisHTML(target)}</div>`;
    else if (st.view.perspective && st.entities[st.view.perspective]) h += perspectiveSummary(st.view.perspective);
    h += `<details class="plan"${App.planOpen ? ' open' : ''}><summary>${t('Plan du scénario')}</summary><ol>${sc.steps.map((x, i) => `<li class="${i === App.step ? 'cur' : ''}${i < App.step ? ' done' : ''}"><a data-go="${i}">${esc(stepTitle(x))}</a></li>`).join('')}</ol></details>`;
    if (sc.errors.length) h += `<details class="errs"><summary>${t('⚠ {n} avertissement(s) dans le scénario', { n: sc.errors.length })}</summary><ul>${sc.errors.map(e => `<li>${t('Étape {n}, ligne {line} :', { n: (e.step || 0) + 1, line: e.line })} <code>${esc(e.text)}</code> — ${esc(e.msg)}</li>`).join('')}</ul></details>`;
    h += '<p class="hint">' + t('Cliquez sur une entité du canevas pour afficher son analyse. Glissez une entité ou une bulle pour la déplacer.') + '</p>';
    el.innerHTML = h;
    const d = $('details.plan', el); if (d) d.addEventListener('toggle', () => { App.planOpen = d.open; });
  };
  const com = $('#commentary');
  com.addEventListener('click', ev => {
    const qs = ev.target.closest('[data-qs="reveal"]'); if (qs) { App.reveal(); return; }
    const card = ev.target.closest('[data-card]'); if (card) { clickCard(+card.dataset.card); return; }
    const g = ev.target.closest('[data-go]'); if (g) { App.goStep(+g.dataset.go); return; }
    const r = ev.target.closest('.ref'); if (r) { const id = P.resolve(App.state, { v: r.dataset.ref }); if (id) App.select({ kind: 'node', id }); return; }
    const b = ev.target.closest('[data-act]'); if (!b) return;
    if (b.dataset.act === 'reveal') App.reveal();
    else if (b.dataset.act === 'lib') openLibrary();
    else if (b.dataset.act === 'unsel') App.select(null);
    else if (b.dataset.act === 'sel') App.select({ kind: 'node', id: b.dataset.id });
  });
  com.addEventListener('mouseover', ev => {
    const r = ev.target.closest('.ref');
    const id = r ? P.resolve(App.state, { v: r.dataset.ref }) : null;
    if (id !== App.hoverRef) { App.hoverRef = id; requestRender(); }
  });

  /* ============================================================ studio */
  function updateStudio() {
    const el = $('#studio');
    el.hidden = !(App.studio.open && App.mode === 'libre');
    $('#btn-studio').classList.toggle('on', App.studio.open);
    if (el.hidden) return;
    const n = App.studio.steps.length;
    el.innerHTML = `<b>${t('🎞 Studio')}</b><span>${n > 1 ? t('{n} étapes capturées', { n }) : t('{n} étape capturée', { n })}</span>
      <button class="primary" data-st="cap">${t("📸 Capturer l'étape")}</button>
      <button data-st="prev"${n ? '' : ' disabled'}>${t('▶ Prévisualiser')}</button>
      <button data-st="exp">${t('⬇ Exporter .md')}</button>
      <button data-st="pop"${n ? '' : ' disabled'} title="${esc(t('Retirer la dernière étape'))}">↶</button>
      <button data-st="clr"${n ? '' : ' disabled'}>${t('Vider')}</button>
      <button data-st="close" title="${esc(t('Fermer le studio'))}">×</button>`;
  }
  function studioMd() {
    const steps = App.studio.steps.length ? App.studio.steps : [{ title: t('Structure'), comment: '', snap: P.clone(App.state) }];
    // droit autre que français : en-tête « droit: » pour que le scénario se rejoue avec les bons seuils
    const d = App.state.options.droit || P.juris;
    return (d && d !== 'fr' ? `---\ndroit: ${d}\n---\n` : '') + P.studioMarkdown(App.studio.title, steps);
  }
  $('#studio').addEventListener('click', ev => {
    const b = ev.target.closest('[data-st]'); if (!b) return;
    const S = App.studio;
    switch (b.dataset.st) {
      case 'cap': {
        const selNode = App.sel && App.sel.kind === 'node' ? App.sel.id : null;
        const c = App.modal(`<h2>${t("📸 Capturer l'étape {n}", { n: S.steps.length + 1 })}</h2>
          ${S.steps.length ? '' : `<label class="field"><span>${t('Titre du scénario')}</span><input type="text" id="sd-title" value="${esc(S.title)}"></label>`}
          <label class="field"><span>${t("Titre de l'étape")}</span><input type="text" id="sd-step" value="${S.steps.length + 1}. "></label>
          <label class="field"><span>${t('Commentaire (markdown : **gras**, listes « - », citations « > »…)')}</span><textarea id="sd-com" placeholder="${esc(t('Expliquez ce que montre cette étape…'))}"></textarea></label>
          ${selNode ? `<label class="chk"><input type="checkbox" id="sd-focus" checked> ${t('mettre en évidence « {name} »', { name: esc(nameOf(selNode)) })}</label>` : ''}
          <div class="btns"><button class="primary" id="sd-ok">${t('Capturer')}</button></div>`, 'narrow');
        $('#sd-step', c).focus();
        $('#sd-ok', c).onclick = () => {
          const snap = P.clone(App.state);
          snap.view.focus = selNode && $('#sd-focus', c) && $('#sd-focus', c).checked ? [selNode] : [];
          snap.view.notes = {}; snap.view.select = null;
          if ($('#sd-title', c)) S.title = $('#sd-title', c).value.trim() || S.title;
          S.steps.push({ title: $('#sd-step', c).value.trim(), comment: $('#sd-com', c).value, snap });
          App.closeModal(); updateStudio(); toast(t('📸 Étape {n} capturée', { n: S.steps.length }));
        };
        break;
      }
      case 'prev': App.loadScenario(studioMd()); break;
      case 'exp': {
        const md = studioMd();
        const c = App.modal(`<h2>${t('⬇ Scénario généré')}</h2><textarea class="big" id="sd-md" spellcheck="false"></textarea>
          <div class="btns"><button class="primary" id="sd-dl">${t('⬇ Télécharger .md')}</button><button id="sd-cp">${t('📋 Copier')}</button><button id="sd-play">${t('▶ Lire en mode cinéma')}</button></div>`);
        $('#sd-md', c).value = md;
        $('#sd-dl', c).onclick = () => download(P.slug(S.title).toLowerCase() + '.md', $('#sd-md').value);
        $('#sd-cp', c).onclick = () => copyText($('#sd-md').value);
        $('#sd-play', c).onclick = () => { const v = $('#sd-md').value; App.closeModal(); App.loadScenario(v); };
        break;
      }
      case 'pop': S.steps.pop(); updateStudio(); break;
      case 'clr': if (confirm(t('Vider toutes les étapes capturées ?'))) { S.steps = []; updateStudio(); } break;
      case 'close': S.open = false; updateStudio(); break;
    }
  });

  /* ============================================================ modes */
  function setMode(m, silent) {
    if (m === App.mode) return;
    endEdit();
    if (m === 'cinema') {
      App.libreState = App.state;
      App.mode = 'cinema';
      document.body.classList.remove('libre'); document.body.classList.add('cinema');
      App.disp = {}; App.ldisp = {};
      if (App.scenario && !silent) { App.step = -1; App.goStep(Math.max(0, App._lastStep || 0)); }
      else if (!silent) { App.state = P.newState(); App.sel = null; App.commit(); openLibrary(); }
    } else {
      App._lastStep = App.step;
      App.pause();
      App.mode = 'libre';
      document.body.classList.remove('cinema'); document.body.classList.add('libre');
      App.state = App.libreState || P.newState(); App.sel = null; App.disp = {}; App.ldisp = {};
      App.commit({ animate: false }); App.fit(false);
    }
    $$('.modes button').forEach(b => b.classList.toggle('active', b.dataset.mode === App.mode));
    $('#actions-libre').hidden = App.mode !== 'libre';
    $('#actions-cinema').hidden = App.mode !== 'cinema';
    $('#player').hidden = App.mode !== 'cinema';
    $('#inspector').hidden = App.mode !== 'libre';
    $('#commentary').hidden = App.mode !== 'cinema';
    updateStudio(); updatePlayer(); renderQSheet();
    requestAnimationFrame(() => { requestRender(); });
  }
  $$('.modes button').forEach(b => { b.onclick = () => setMode(b.dataset.mode); });

  /* ============================================================ barre d'actions */
  $('#btn-new').onclick = () => {
    if (Object.keys(App.state.entities).length && !confirm(t('Vider le canevas ? (Ctrl+Z pour annuler)'))) return;
    pushUndo(); App.state = P.newState(); App.sel = null; App.colorMap = {}; App.colorIdx = 0; App.commit(); App.fit(true);
  };
  $('#btn-undo').onclick = undo;
  $('#btn-redo').onclick = redo;
  $('#btn-layout').onclick = () => {
    pushUndo();
    const st = App.state;
    Object.values(st.entities).forEach(e => { e.fixed = false; });
    P.layout(st);
    Object.values(st.entities).forEach(e => { e.fixed = true; });
    App.commit(); App.fit(true);
  };
  $('#btn-open').onclick = () => $('#file-input').click();
  $('#btn-save').onclick = () => download('structure-capital-lab.json', JSON.stringify({ format: 'capital-lab', version: 1, state: App.state }, null, 2), 'application/json');
  $('#btn-studio').onclick = () => { App.studio.open = !App.studio.open; updateStudio(); };
  $('#btn-library').onclick = openLibrary;
  $('#btn-edit-md').onclick = () => { if (App.scenario) openEditor(App.scenarioSrc, true); else openLibrary(); };
  $('#btn-to-libre').onclick = () => {
    const lib = App.libreState;
    if (lib && Object.keys(lib.entities).length && !confirm(t("Remplacer la structure du mode libre par l'état affiché ? (Ctrl+Z pour annuler en mode libre)"))) return;
    const st = P.clone(App.state);
    Object.values(st.entities).forEach(e => { e.fixed = true; });
    st.view.focus = []; st.view.notes = {}; st.view.select = null;
    const prevLibre = App.libreState;
    setMode('libre');
    if (prevLibre) App.undoStack.push(JSON.stringify(prevLibre));
    App.state = st; App.commit({ animate: false }); App.fit(false);
    toast(t('✏️ Vous pouvez maintenant modifier librement cette structure.'));
  };
  $('#btn-help').onclick = () => openHelp('all');

  /* ---- mode jour / nuit (le thème initial est posé par le script en tête d'index.html) */
  function applyTheme(th, remember) {
    document.documentElement.setAttribute('data-theme', th);
    const b = $('#btn-theme');
    b.textContent = th === 'dark' ? '☀️' : '🌙';
    b.title = th === 'dark' ? t('Passer en mode jour') : t('Passer en mode nuit');
    if (remember) { try { localStorage.setItem('capital-lab.theme', th); } catch (e) { /* */ } }
    requestRender();
  }
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);
  $('#btn-theme').onclick = () => applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  if (window.matchMedia) {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const follow = e => { let saved = null; try { saved = localStorage.getItem('capital-lab.theme'); } catch (x) { /* */ } if (!saved) applyTheme(e.matches ? 'dark' : 'light', false); };
    if (mq.addEventListener) mq.addEventListener('change', follow);
  }
  $('#opt-defacto').onchange = ev => {
    if (App.mode === 'libre') pushUndo();
    App.state.options.deFacto = ev.target.checked; App.commit();
  };
  /* langue de l'interface (la page est rechargée) et droit applicable (anglais : Royaume-Uni ou États-Unis) */
  const langSel = $('#opt-lang');
  if (langSel) { langSel.value = P.lang; langSel.onchange = () => P.setLang(langSel.value); }
  const lawSel = $('#opt-droit');
  if (lawSel) lawSel.onchange = () => {
    const d = lawSel.value;
    if (!P.JURIS[d] || (App.mode === 'cinema' && App.scenario)) return;
    try { localStorage.setItem('capital-lab.droit', d); } catch (e) { /* */ }
    if (App.mode === 'libre') pushUndo();
    else if (App.libreState) App.libreState.options.droit = d;
    App.state.options.droit = d;
    App.commit();
    if (App.mode === 'cinema' && !$('#modal').hidden && $('#modal .lib-grid')) openLibrary();
  };

  document.addEventListener('keydown', ev => {
    if (ev.target.matches && ev.target.matches('input, textarea, select')) return;
    if (!$('#modal').hidden) { if (ev.key === 'Escape') App.closeModal(); return; }
    const ctrl = ev.ctrlKey || ev.metaKey;
    if (App.mode === 'cinema') {
      if (ev.key === 'ArrowRight' || ev.key === 'PageDown') { next(); ev.preventDefault(); }
      else if (ev.key === 'ArrowLeft' || ev.key === 'PageUp') { prev(); ev.preventDefault(); }
      else if (ev.key === ' ') { if (App.playMode === 'continu') togglePlay(); else next(); ev.preventDefault(); }
      else if (/^[1-9]$/.test(ev.key) && curQuestion()) clickCard(+ev.key - 1);
      else if (ev.key === 'Home') App.goStep(0);
      else if (ev.key === 'End' && App.scenario) App.goStep(App.scenario.steps.length - 1);
    } else {
      if (ev.key === 'Delete' || ev.key === 'Backspace') { deleteSel(); ev.preventDefault(); }
      else if (ctrl && ev.key.toLowerCase() === 'z' && !ev.shiftKey) { undo(); ev.preventDefault(); }
      else if (ctrl && (ev.key.toLowerCase() === 'y' || (ev.key.toLowerCase() === 'z' && ev.shiftKey))) { redo(); ev.preventDefault(); }
    }
    if (ev.key === 'f' || ev.key === 'F') App.fit(true);
    else if (ev.key === 'Escape') App.select(null);
  });

  /* ============================================================ téléphone */
  // vue « split » (schéma en haut, explications en bas), « schema » ou « texte » seuls
  function setMobileView(v) {
    App.mview = v;
    document.body.classList.toggle('m-schema', v === 'schema');
    document.body.classList.toggle('m-texte', v === 'texte');
    $$('#pl-view button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  }
  $('#pl-view').addEventListener('click', ev => { const b = ev.target.closest('[data-v]'); if (b) setMobileView(b.dataset.v); });
  setMobileView('split');

  // balayer horizontalement les explications pour changer d'étape
  let swipe = null;
  $('#side').addEventListener('touchstart', ev => {
    if (App.mode !== 'cinema' || ev.touches.length !== 1) { swipe = null; return; }
    swipe = { x: ev.touches[0].clientX, y: ev.touches[0].clientY, t: Date.now() };
  }, { passive: true });
  $('#side').addEventListener('touchend', ev => {
    if (!swipe) return;
    const tc = ev.changedTouches[0], dx = tc.clientX - swipe.x, dy = tc.clientY - swipe.y;
    const ok = Math.abs(dx) > 60 && Math.abs(dx) > 1.6 * Math.abs(dy) && Date.now() - swipe.t < 800;
    swipe = null;
    if (ok) { if (dx < 0) next(); else prev(); }
  }, { passive: true });

  // passage écran large ↔ téléphone (rotation, fenêtre redimensionnée)
  if (mqMobile && mqMobile.addEventListener) mqMobile.addEventListener('change', () => {
    if (App.mode !== 'cinema') return;
    renderQSheet(); App.renderCommentary(); App.fit(false);
  });

  /* ============================================================ démarrage */
  function init() {
    buildLegend();
    try {
      const pm = localStorage.getItem('capital-lab.playmode');
      if (pm) { App.playMode = pm; $('#pl-mode').value = pm; }
      const s = localStorage.getItem(LS_KEY);
      if (s) App.state = sanitize(JSON.parse(s));
    } catch (e) { /* stockage indisponible */ }
    App.commit({ animate: false });
    updatePlayer();
    requestAnimationFrame(() => App.fit(false));
    if (EMBED) {   // paquet SCORM : uniquement ce scénario, en mode cinéma
      App.loadScenario(EMBED.md, null, host ? host.startStep : 0);
      return;
    }
    const q = new URLSearchParams(location.search);
    const sid = q.get('scenario'), url = q.get('md');
    const step = Math.max(0, (parseInt(q.get('etape') || q.get('step'), 10) || 1) - 1);
    const hash = (location.hash.match(/(?:^#|&)md=([A-Za-z0-9_-]+)/) || [])[1];
    if (sid) {
      const s = libFind(sid);
      if (s) App.loadScenario(s.md, { id: sid }, step); else { toast(t('Scénario introuvable : {id}', { id: esc(sid) })); setMode('cinema'); }
    } else if (hash) {
      unpackMd(hash).then(txt => App.loadScenario(txt, { packed: hash }, step))
        .catch(() => { toast(t('⚠ Lien de scénario illisible (incomplet ?)')); setMode('cinema'); });
    } else if (url) {
      fetch(url).then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(txt => App.loadScenario(txt, { url }, step))
        .catch(() => toast(t('⚠ Impossible de charger {url}', { url: esc(url) })));
    } else if (q.has('scenarios') || q.has('bibliotheque') || isMobile()) {
      setMode('cinema');   // ouvre la bibliothèque ; sur téléphone, le mode cinéma est le point d'entrée
    }
  }
  init();
})();
