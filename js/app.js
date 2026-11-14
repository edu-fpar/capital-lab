/* ============================================================
 * Capital Lab — interface : canevas SVG, palette, inspecteur,
 * mode cinéma (lecteur de scénarios), studio d'enregistrement.
 * ============================================================ */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = P.esc, fmt = P.fmt;
  const NW = 190, NH = 78;
  const PALETTE = ['#2563eb', '#dc2626', '#059669', '#9333ea', '#ea580c', '#0891b2', '#db2777', '#65a30d', '#7c3aed', '#b45309'];
  const LS_KEY = 'capital-lab.libre.v1';
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
    studio: { open: false, title: 'Mon scénario', steps: [] },
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
    const done = () => toast('📋 Copié dans le presse-papiers');
    const fallback = () => {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast('Copie impossible'); }
      ta.remove();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
  }

  /* ============================================================ rendu SVG */
  const svg = $('#canvas');
  const marker = (id, color) => `<marker id="${id}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="13" markerHeight="13" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0,0.5 L10,5 L0,9.5 z" fill="${color}"/></marker>`;
  svg.innerHTML = '<defs>' + P.CATS.map(c => marker('m-' + c.key, c.color)).join('') + marker('m-sup', '#94a3b8') + marker('m-tmp', '#4f46e5') +
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
    let txt = votes !== l.capital ? `${fmt(l.capital)} · DV ${fmt(votes)}` : fmt(l.capital);
    if (sup) txt += ' · voix neutralisées';
    else if (Math.abs(eff - votes) > 0.05) txt += ` → ${fmt(eff)} eff.`;
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
      l2 = an.capSum[id] > 100.001 ? '⚠ capital attribué > 100 %' : (rest > 0.001 ? `${T.short} · autres ${fmt(rest)}` : `${T.short} · capital 100 % identifié`);
    }
    if (u) { l3 = (u.type === 'conjoint' ? '🤝 conjoint : ' : '🎯 ') + nameOf(u.block.id) + (u.how === 'fait' ? ' (de fait)' : ''); l3c = color; }
    else if (ctl.length) { l3 = `👑 contrôle ${ctl.length} entité${ctl.length > 1 ? 's' : ''}`; l3c = color; }
    else if (hasH) l3 = '○ aucun contrôle';
    if (pv) {
      if (id === pv) { l3 = '👁 point de vue'; l3c = 'var(--accent)'; }
      else if (!dimmed) {
        const it = an.interestOf(pv, id), ok = an.ctrl[pv].has(id), pc = an.pct(pv, id);
        l3 = `Intérêt ${fmt(it * 100)} · ${ok ? 'contrôle ✔' : 'DV ' + fmt(pc)}`;
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
    let s = `<g class="note" data-note="${esc(id)}"><title>Glisser pour déplacer la bulle</title><path d="${tail}"/><rect x="${x}" y="${y}" width="${lw}" height="${lh}" rx="9"/>`;
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
      const pad = 50, h = Math.max(120, r.height - inset);
      const k = clamp(Math.min(r.width / (x1 - x0 + 2 * pad), h / (y1 - y0 + 2 * pad)), 0.25, 1.3);
      t = { x: (x0 + x1) / 2, y: (y0 + y1) / 2 + inset / 2 / k, k };
    }
    if (animate) App.camT = t; else { App.cam = Object.assign({}, t); App.camT = null; }
    requestRender();
  };

  function updateBanner() {
    const st = App.state, el = $('#banner'), pv = st.view.perspective;
    if (!pv || !st.entities[pv] || !App.an) { el.hidden = true; return; }
    const n = App.an.controlled(pv).length;
    el.innerHTML = `👁 Point de vue : <b>${esc(nameOf(pv))}</b> · contrôle ${n} entité${n > 1 ? 's' : ''} <button data-act="pvoff" title="Quitter le point de vue">×</button>`;
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
    saveT = setTimeout(() => { try { localStorage.setItem(LS_KEY, JSON.stringify(App.state)); } catch (e) { /* stockage indisponible */ } }, 300);
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
    if (!(P.TYPES[te.type] || {}).holdable) { toast(`« ${esc(te.name)} » (${P.TYPES[te.type].label.toLowerCase()}) ne peut pas être détenu(e).`); requestRender(); return; }
    const ex = P.findLink(st, from, to);
    if (ex) { App.select({ kind: 'link', id: P.linkKey(ex) }); return; }
    const an = App.an, rest = 100 - (an.capSum[to] || 0);
    const cap = from === to ? 5 : (rest >= 1 ? Math.min(25, P.round2(rest)) : 10);
    pushUndo();
    const l = P.setLink(st, from, to, cap, null);
    App.sel = { kind: 'link', id: P.linkKey(l) };
    App.commit();
    if (rest < 1 && from !== to) toast('⚠ Le capital de cette société était déjà entièrement attribué.');
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
    if (sup) return '<div class="cat" style="--c:#94a3b8">🔁 Voix neutralisées (autocontrôle / auto-détention)</div>';
    const eff = an.norm[l.to][l.from] || 0, c = P.category(eff), v = l.votes == null ? l.capital : l.votes;
    return `<div class="cat" style="--c:${c.color}" title="${esc(c.text)}">${esc(c.label)}${Math.abs(eff - v) > 0.05 ? ` · ${fmt(eff)} des voix effectives` : ''}</div>`;
  }

  App.analysisHTML = function (id) {
    const an = App.an, st = App.state, e = st.entities[id]; if (!e) return '';
    const T = P.TYPES[e.type] || P.TYPES.societe;
    let h = '<h4>Analyse</h4>';
    const hasH = T.holdable && an.holders[id].length > 0;
    if (hasH) {
      const u = an.ultimate[id];
      if (u) {
        const color = App.colorFor(u.block.id);
        const path = an.path(u.block.id, id), inter = an.interestOf(u.block.id, id);
        h += `<div class="verdict" style="--c:${color}">🎯 <b>${esc(blockLabel(u.block))}</b> ${u.type === 'conjoint' ? 'contrôle <b>conjointement</b>' : 'contrôle'} ${esc(e.name)}${u.how === 'fait' ? ' — <i>contrôle de fait présumé (plus de 40 % et aucun autre associé au-dessus)</i>' : ''}.</div>`;
        if (path.length > 2) h += `<div class="chain">🔗 Chaîne de contrôle : ${path.map(p => esc(nameOf(p))).join(' → ')}</div>`;
        h += `<div class="kv"><span>Droits de vote contrôlés</span><b>${fmt(an.pct(u.block.id, id))}</b></div>`;
        h += `<div class="kv"><span>Intérêt économique (capital)</span><b>${fmt(inter * 100)}</b></div>`;
        if (inter < 0.5 - 1e-9) h += `<div class="insight">⚡ Avec seulement <b>${fmt(inter * 100)}</b> du capital économique, ${esc(blockLabel(u.block))} détient le contrôle : pouvoir et capital sont dissociés${path.length > 2 ? ' grâce à la chaîne de sociétés contrôlées' : ''}.</div>`;
      } else {
        h += `<div class="verdict none">Aucun actionnaire, ni groupe d'actionnaires de concert, ne contrôle ${esc(e.name)} : aucun bloc ne dépasse 50 % des droits de vote${an.deFacto ? ' et aucun ne bénéficie de la présomption de contrôle de fait' : ''}.</div>`;
      }
      const blocs = an.blocs(id), base = 100 - an.supp[id].total;
      const restV = base > 0 ? Math.max(0, 100 - an.voteSum[id]) * 100 / base : 0;
      h += '<table class="mini"><tr><th>Blocs de vote (par contrôleur ultime)</th><th class="n">DV eff.</th><th class="n">Intérêt</th></tr>';
      blocs.forEach(b => {
        const c = P.category(b.pct);
        h += `<tr><td><span class="dot" style="background:${c.color}"></span>${esc(blockLabel(b.block))}</td><td class="n">${fmt(b.pct)}</td><td class="n">${fmt(b.interest * 100)}</td></tr>`;
      });
      if (restV > 0.001) h += `<tr><td class="muted"><span class="dot" style="background:#e2e8f0"></span>Autres actionnaires</td><td class="n muted">${fmt(restV)}</td><td class="n muted">${fmt(Math.max(0, 100 - an.capSum[id]))}</td></tr>`;
      h += '</table>';
      const blockers = blocs.filter(b => b.pct > 100 / 3 + 1e-6 && !(u && u.block.id === b.block.id) && b.pct < 200 / 3 - 1e-6);
      if (blockers.length) h += `<div class="warnbox">🛑 Minorité de blocage (plus d'1/3 des voix en AGE) : ${blockers.map(b => `<b>${esc(blockLabel(b.block))}</b>`).join(', ')}.</div>`;
      if (u && an.pct(u.block.id, id) < 200 / 3 - 1e-6) h += `<div class="muted small">Le contrôleur décide seul en AGO, mais n'atteint pas les 2/3 nécessaires en AGE.</div>`;
      const sp = an.supp[id];
      if (sp.total > 0) h += `<div class="warnbox">🔁 <b>Autocontrôle / auto-détention</b> : ${fmt(sp.total)} des droits de vote sont neutralisés (actions détenues par ${esc(e.name)} elle-même ou par des sociétés qu'elle contrôle — art. L225-210 et L233-31 C. com.). Les pourcentages effectifs sont calculés sur ${fmt(100 - sp.total)}.</div>`;
      if (an.capSum[id] > 100.001) h += `<div class="warnbox">⚠ La somme des participations au capital dépasse 100 % (${fmt(an.capSum[id])}).</div>`;
      if (an.voteSum[id] > 100.001) h += `<div class="warnbox">⚠ La somme des droits de vote dépasse 100 % (${fmt(an.voteSum[id])}).</div>`;
    }
    const ctl = an.controlled(id);
    if (ctl.length) {
      h += `<h5>${esc(e.name)} contrôle ${ctl.length} entité${ctl.length > 1 ? 's' : ''}</h5><table class="mini"><tr><th>Entité</th><th class="n">DV contrôlés</th><th class="n">Intérêt</th></tr>`;
      ctl.forEach(c => { h += `<tr><td><a data-act="sel" data-id="${esc(c)}">${esc(nameOf(c))}</a>${an.how[id][c] === 'fait' ? ' <i class="muted">(de fait)</i>' : ''}</td><td class="n">${fmt(an.pct(id, c))}</td><td class="n">${fmt(an.interestOf(id, c) * 100)}</td></tr>`; });
      h += '</table>';
    }
    const inv = an.ids.filter(c => c !== id && !an.ctrl[id].has(c) && an.interestOf(id, c) > 1e-6);
    if (inv.length) {
      h += `<h5>Intérêts sans contrôle</h5><table class="mini"><tr><th>Entité</th><th class="n">DV</th><th class="n">Intérêt</th></tr>`;
      inv.forEach(c => { h += `<tr><td><a data-act="sel" data-id="${esc(c)}">${esc(nameOf(c))}</a></td><td class="n">${fmt(an.pct(id, c))}</td><td class="n">${fmt(an.interestOf(id, c) * 100)}</td></tr>`; });
      h += '</table>';
    }
    const cs = (st.concerts || []).filter(c => c.members.includes(id));
    cs.forEach(c => {
      const bid = 'concert:' + c.id, cc = an.blockById[bid] ? an.controlled(bid).filter(x => !an.ctrl[id].has(x)) : [];
      if (cc.length) h += `<div class="chain">🤝 Via « ${esc(c.name)} », participe au contrôle conjoint de : ${cc.map(x => esc(nameOf(x))).join(', ')}.</div>`;
    });
    return h;
  };

  function concertAnalysis(cid) {
    const an = App.an, bid = 'concert:' + cid;
    if (!an.blockById[bid]) return '<p class="muted small">Un pacte doit réunir au moins deux membres.</p>';
    const cc = an.controlled(bid).filter(x => an.ultimate[x] && an.ultimate[x].block.id === bid);
    if (!cc.length) return '<h4>Analyse</h4><div class="verdict none">Les membres du pacte ne réunissent la majorité des voix dans aucune société qu\'un membre ne contrôlerait pas déjà seul.</div>';
    return '<h4>Analyse</h4>' + cc.map(c => `<div class="verdict" style="--c:${App.colorFor(bid)}">🤝 Contrôle conjoint de <a data-act="sel" data-id="${esc(c)}"><b>${esc(nameOf(c))}</b></a> avec ${fmt(an.pct(bid, c))} des voix.</div>`).join('');
  }

  /* ============================================================ inspecteur (mode libre) */
  function linkEditor(l, side) {
    const k = P.linkKey(l), st = App.state, linked = l.votes == null, v = linked ? l.capital : l.votes;
    let head = '';
    if (side) {
      const oid = side === 'from' ? l.from : l.to, e = st.entities[oid];
      head = `<div class="le-head"><a data-act="sel" data-id="${esc(oid)}">${iconOf(oid)} ${esc(l.from === l.to ? e.name + ' (auto-détention)' : e.name)}</a><button class="x" data-act="dellink" title="Supprimer cette participation">×</button></div>`;
    }
    return `<div class="le" data-link="${esc(k)}">${head}
      <div class="sl"><span>Capital</span><input type="range" min="0" max="100" step="0.5" value="${l.capital}" data-act="cap"><input type="number" min="0" max="100" step="0.01" value="${P.round2(l.capital)}" data-act="capn"><i>%</i></div>
      <div class="sl${linked ? ' off' : ''}"><span>Droits de vote</span><input type="range" min="0" max="100" step="0.5" value="${v}" data-act="vot"${linked ? ' disabled' : ''}><input type="number" min="0" max="100" step="0.01" value="${P.round2(v)}" data-act="votn"${linked ? ' disabled' : ''}><i>%</i></div>
      <label class="chk"><input type="checkbox" data-act="vlink"${linked ? ' checked' : ''}> droits de vote = capital (1 action = 1 voix)</label>
      ${catBadge(l)}</div>`;
  }

  function overviewHTML() {
    const st = App.state, an = App.an, ids = Object.keys(st.entities);
    if (!ids.length) {
      return `<div class="welcome"><h3>Bienvenue 👋</h3>
        <p>Cet atelier permet de construire des <b>structures de participations</b> et de voir qui contrôle quoi — et avec quel capital réel.</p>
        <ol><li>Glissez des <b>entités</b> depuis la palette.</li><li>Tirez la poignée <b>+</b> d'un actionnaire vers une société.</li><li>Réglez <b>capital</b> et <b>droits de vote</b> dans ce panneau.</li><li>Activez le <b>👁 point de vue</b> d'un actionnaire.</li></ol>
        <div class="btns"><button class="primary" data-act="example">✨ Charger un exemple</button><button data-act="cinema">🎬 Voir les scénarios</button></div></div>`;
    }
    let h = `<h3>Vue d'ensemble</h3><p class="muted small">${ids.length} entité${ids.length > 1 ? 's' : ''} · ${st.links.length} participation${st.links.length > 1 ? 's' : ''} · ${(st.concerts || []).length} pacte(s)</p>`;
    const roots = an.blocks.filter(b => an.controlled(b.id).length && (b.kind === 'concert' ? an.controlled(b.id).some(c => an.ultimate[c] && an.ultimate[c].block.id === b.id) : !an.ultimate[b.id]));
    h += '<h4>Contrôleurs ultimes</h4>';
    if (!roots.length) h += '<p class="muted small">Personne ne contrôle aucune société pour l\'instant.</p>';
    h += '<ul class="ctrl-list">' + roots.map(b => {
      const list = an.controlled(b.id).filter(c => an.ultimate[c] && an.ultimate[c].block.id === b.id);
      return `<li><span class="dot" style="background:${App.colorFor(b.id)}"></span><b>${b.kind === 'concert' ? `<a data-act="selconcert" data-id="${esc(b.id.slice(8))}">${esc(blockLabel(b))}</a>` : `<a data-act="sel" data-id="${esc(b.id)}">${esc(blockLabel(b))}</a>`}</b><br><span class="small">${list.map(c => `${esc(nameOf(c))} <span class="muted">(intérêt ${fmt(an.interestOf(b.id, c) * 100)})</span>`).join(', ')}</span></li>`;
    }).join('') + '</ul>';
    const indep = ids.filter(i => P.TYPES[st.entities[i].type].holdable && an.holders[i].length && !an.ultimate[i]);
    if (indep.length) h += `<h4>Sociétés sans contrôle</h4><p class="small">${indep.map(i => `<a data-act="sel" data-id="${esc(i)}">${esc(nameOf(i))}</a>`).join(', ')}</p>`;
    h += `<h4>Point de vue</h4><select data-act="pvsel" class="add"><option value="">— aucun —</option>${ids.map(i => `<option value="${esc(i)}"${st.view.perspective === i ? ' selected' : ''}>${iconOf(i)} ${esc(nameOf(i))}</option>`).join('')}</select>`;
    h += '<p class="hint">Cliquez sur une entité ou un lien pour le modifier. Glisser le fond déplace la vue, la molette zoome.</p>';
    return h;
  }

  function entityInspector(id) {
    const st = App.state, an = App.an, e = st.entities[id];
    const T = P.TYPES[e.type] || P.TYPES.societe, pv = st.view.perspective === id;
    const hasH = an.holders[id].length > 0;
    let h = `<div class="insp-head"><span class="big">${T.icon}</span><input class="name" data-act="rename" value="${esc(e.name)}" spellcheck="false" title="Renommer"></div>`;
    h += `<div class="row"><label>Type</label><select data-act="type">${Object.keys(P.TYPES).map(k => `<option value="${k}"${k === e.type ? ' selected' : ''}${!P.TYPES[k].holdable && hasH ? ' disabled' : ''}>${P.TYPES[k].icon} ${P.TYPES[k].label}</option>`).join('')}</select></div>`;
    h += `<div class="btns"><button data-act="pv" class="${pv ? 'on' : ''}">👁 ${pv ? 'Quitter le point de vue' : 'Point de vue'}</button><button data-act="del" class="danger">🗑 Supprimer</button></div>`;
    if (T.holdable) {
      h += '<h4>Actionnaires</h4>';
      an.holders[id].forEach(x => { h += linkEditor(x.link, 'from'); });
      const rc = 100 - an.capSum[id], rv = 100 - an.voteSum[id];
      h += `<div class="rest${rc < -0.001 || rv < -0.001 ? ' bad' : ''}">${rc < -0.001 ? '⚠ Le capital attribué dépasse 100 % !' : `Autres actionnaires (non représentés) : <b>${fmt(rc)}</b> du capital${Math.abs(rc - rv) > 0.001 ? ` · <b>${fmt(Math.max(0, rv))}</b> des voix` : ''}`}${rv < -0.001 ? '<br>⚠ Les droits de vote attribués dépassent 100 % !' : ''}</div>`;
      const cand = Object.keys(st.entities).filter(o => !P.findLink(st, o, id));
      if (cand.length) h += `<select data-act="addholder" class="add"><option value="">＋ Ajouter un actionnaire…</option>${cand.map(o => `<option value="${esc(o)}">${o === id ? '↻ elle-même (auto-détention)' : iconOf(o) + ' ' + esc(nameOf(o))}</option>`).join('')}</select>`;
    }
    h += '<h4>Participations détenues</h4>';
    const held = an.held[id].filter(x => x.to !== id);
    if (!held.length) h += '<p class="muted small">Aucune.</p>';
    held.forEach(x => { h += linkEditor(x.link, 'to'); });
    const cand2 = Object.keys(st.entities).filter(o => o !== id && P.TYPES[st.entities[o].type].holdable && !P.findLink(st, id, o));
    if (cand2.length) h += `<select data-act="addheld" class="add"><option value="">＋ Prendre une participation dans…</option>${cand2.map(o => `<option value="${esc(o)}">${iconOf(o)} ${esc(nameOf(o))}</option>`).join('')}</select>`;
    h += '<h4>Pactes / action de concert</h4>';
    (st.concerts || []).filter(c => c.members.includes(id)).forEach(c => { h += `<div class="pill-row"><a data-act="selconcert" data-id="${esc(c.id)}">🤝 ${esc(c.name)}</a></div>`; });
    h += '<button data-act="newconcert" class="small">＋ Nouveau pacte avec…</button>';
    h += `<div id="insp-analysis">${App.analysisHTML(id)}</div>`;
    return h;
  }

  function linkInspector(k) {
    const l = findLinkByKey(k); if (!l) return overviewHTML();
    const an = App.an, sup = an.supp[l.to].set.has(l.from), eff = sup ? 0 : an.norm[l.to][l.from];
    let h = `<h3>🔗 Participation</h3><p><a data-act="sel" data-id="${esc(l.from)}">${iconOf(l.from)} ${esc(nameOf(l.from))}</a> détient ${l.from === l.to ? '<b>ses propres actions</b> (auto-détention)' : `des titres de <a data-act="sel" data-id="${esc(l.to)}">${iconOf(l.to)} ${esc(nameOf(l.to))}</a>`}</p>`;
    h += linkEditor(l, null);
    h += `<p class="small muted">${sup ? "Ces actions sont privées de droit de vote : elles sont détenues par la société elle-même ou par une société qu'elle contrôle." : esc(P.category(eff).text)}</p>`;
    h += '<div class="btns"><button data-act="dellink" class="danger">🗑 Supprimer la participation</button></div>';
    h += `<div id="insp-analysis">${App.analysisHTML(l.to)}</div>`;
    return h;
  }

  function concertInspector(cid) {
    const st = App.state, c = (st.concerts || []).find(x => x.id === cid); if (!c) return overviewHTML();
    let h = `<div class="insp-head"><span class="big">🤝</span><input class="name" data-act="cname" value="${esc(c.name)}" spellcheck="false"></div>`;
    h += '<p class="small muted">Action de concert (art. L233-10 C. com.) : les membres sont traités comme <b>un seul bloc de vote</b>. S\'ils dépassent ensemble 50 % des voix d\'une société, ils la contrôlent conjointement (art. L233-3, III).</p>';
    h += '<h4>Membres</h4><div class="members">' + Object.keys(st.entities).map(id => `<label><input type="checkbox" data-act="cmember" value="${esc(id)}"${c.members.includes(id) ? ' checked' : ''}> ${iconOf(id)} ${esc(nameOf(id))}</label>`).join('') + '</div>';
    h += '<div class="btns"><button data-act="delconcert" class="danger">Dissoudre le pacte</button></div>';
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
    if (ids.length < 2) { toast('Il faut au moins deux entités pour créer un pacte.'); return; }
    const c = App.modal(`<h2>🤝 Nouveau pacte / action de concert</h2>
      <p class="muted small">Les membres d'un pacte votent ensemble : leurs voix sont additionnées pour déterminer le contrôle (contrôle conjoint).</p>
      <label class="field"><span>Nom du pacte</span><input type="text" id="cn-name" value="Pacte ${(st.concerts || []).length + 1}"></label>
      <div class="field"><span>Membres</span><div class="members">${ids.map(id => `<label><input type="checkbox" value="${esc(id)}"${pre.includes(id) ? ' checked' : ''}> ${iconOf(id)} ${esc(nameOf(id))}</label>`).join('')}</div></div>
      <div class="btns"><button class="primary" id="cn-ok">Créer le pacte</button></div>`, 'narrow');
    $('#cn-ok', c).onclick = () => {
      const mem = $$('.members input:checked', c).map(i => i.value);
      if (mem.length < 2) { toast('Choisissez au moins deux membres.'); return; }
      pushUndo();
      let n = 1; while (st.concerts.some(x => x.id === 'C' + n)) n++;
      const cn = { id: 'C' + n, name: $('#cn-name', c).value.trim() || 'Pacte ' + n, members: mem };
      st.concerts.push(cn);
      App.closeModal(); App.sel = { kind: 'concert', id: cn.id }; App.commit();
    };
  }
  $('#tool-concert').onclick = () => openConcertModal(App.sel && App.sel.kind === 'node' ? [App.sel.id] : []);

  /* ============================================================ légende */
  function buildLegend() {
    const el = $('#legend');
    let h = '<div class="lg-h">Légende <span>▾</span></div><div class="lg-body"><div class="lg-sec">Liens (droits de vote effectifs)</div>';
    P.CATS.forEach(c => { h += `<div class="lg-row" title="${esc(c.text)}"><span class="sw" style="border-color:${c.color}"></span>${esc(c.label)}</div>`; });
    h += '<div class="lg-row"><span class="sw dash" style="border-color:#94a3b8"></span>voix neutralisées (autocontrôle)</div>';
    h += '<div class="lg-sec">Entités</div>';
    h += `<div class="lg-row"><span class="box" style="border-color:${PALETTE[0]};border-width:3px"></span>contrôleur ultime (couleur propre)</div>`;
    h += `<div class="lg-row"><span class="box" style="border-color:${PALETTE[0]};background:${tint(PALETTE[0], 0.15)}"></span>contrôlée par l'entité de même couleur</div>`;
    h += '<div class="lg-row"><span class="box" style="border-color:#94a3b8;border-style:dashed"></span>pacte : contrôle conjoint</div></div>';
    el.innerHTML = h;
    let pref = null;
    try { pref = localStorage.getItem('capital-lab.legend'); } catch (e) { /* */ }
    if (pref === '0' || (pref == null && window.innerHeight < 800)) el.classList.add('collapsed');
    $('.lg-h', el).onclick = () => {
      el.classList.toggle('collapsed');
      try { localStorage.setItem('capital-lab.legend', el.classList.contains('collapsed') ? '0' : '1'); } catch (e) { /* */ }
    };
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
    const cards = P.LIBRARY.map(s => {
      const sc = P.parseScenario(s.md);
      return `<div class="lib-card"><h4>${esc(sc.title)}</h4><p>${esc(sc.description)}</p><span class="small muted">${sc.steps.length} étapes</span>
        <div class="btns"><button class="primary" data-run="${s.id}">▶ Lancer</button><button data-see="${s.id}">📝 Markdown</button><button data-dl="${s.id}" title="Télécharger le fichier .md">⬇</button></div></div>`;
    }).join('');
    const c = App.modal(`<h2>📚 Scénarios</h2><div class="lib-grid">${cards}</div>
      <h3>Votre propre scénario</h3>
      <p class="muted small">Collez le markdown fourni par un enseignant ou généré par une IA, ou ouvrez / déposez un fichier .md.</p>
      <textarea id="md-input" placeholder="# Mon scénario&#10;&#10;## 1. Première étape&#10;Commentaire…&#10;&#10;\`\`\`scene&#10;personne FAM &quot;Famille&quot;&#10;societe A &quot;Alpha SA&quot;&#10;lien FAM -> A 51%&#10;\`\`\`"></textarea>
      <div class="btns"><button class="primary" id="md-run">▶ Lancer ce scénario</button><button id="md-file">📂 Ouvrir un fichier .md</button><button id="md-prompt">🤖 Copier le prompt pour une IA</button><button id="md-spec">📄 Format des scénarios</button></div>`);
    c.addEventListener('click', ev => {
      const b = ev.target.closest('button'); if (!b) return;
      const get = id => P.LIBRARY.find(s => s.id === id);
      if (b.dataset.run) { App.closeModal(); App.loadScenario(get(b.dataset.run).md, { id: b.dataset.run }); }
      else if (b.dataset.see) openEditor(get(b.dataset.see).md, false);
      else if (b.dataset.dl) download(b.dataset.dl + '.md', get(b.dataset.dl).md.replace(/~~~scene/g, '```scene').replace(/^~~~$/gm, '```'));
      else if (b.id === 'md-run') { const v = $('#md-input', c).value; if (v.trim()) { App.closeModal(); App.loadScenario(v); } }
      else if (b.id === 'md-file') $('#file-input').click();
      else if (b.id === 'md-prompt') copyText(P.AI_PROMPT);
      else if (b.id === 'md-spec') openHelp('format');
    });
  }

  function openEditor(md, isCurrent) {
    const c = App.modal(`<h2>📝 Markdown du scénario</h2>
      <p class="muted small">Modifiez le texte puis relancez. Les blocs <code>scene</code> contiennent les commandes (voir « Format des scénarios »).</p>
      <textarea id="ed-md" class="big" spellcheck="false"></textarea>
      <div class="btns"><button class="primary" id="ed-run">▶ ${isCurrent ? 'Appliquer (rester à cette étape)' : 'Lancer'}</button><button id="ed-copy">📋 Copier</button><button id="ed-dl">⬇ Télécharger .md</button><button id="ed-spec">📄 Format</button></div>`);
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

  function openHelp(which) {
    const c = App.modal(`<div class="help-doc md">${which === 'format' ? '' : P.md(P.HELP_DOC)}${P.md(P.FORMAT_DOC, { shift: which === 'format' ? 0 : 1 })}</div>
      <div class="btns"><button class="primary" id="hp-prompt">🤖 Copier le prompt pour une IA</button><button id="hp-dl">⬇ Télécharger la spécification (.md)</button><a class="btnlink" href="docs/index.html" target="_blank" rel="noopener">📖 Documentation complète</a></div>`);
    $('#hp-prompt', c).onclick = () => copyText(P.AI_PROMPT);
    $('#hp-dl', c).onclick = () => download('format-scenario.md', P.FORMAT_DOC);
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
          toast('📂 Structure chargée : ' + esc(f.name));
        } catch (e) { toast('⚠ Fichier JSON invalide'); }
      } else { App.closeModal(); App.loadScenario(txt); }
    };
    r.readAsText(f, 'utf-8');
  }
  $('#file-input').addEventListener('change', ev => { const f = ev.target.files[0]; if (f) openFile(f); ev.target.value = ''; });

  function loadExample() {
    const sc = P.parseScenario(P.LIBRARY[0].md);
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
    if (!sc.steps.length) { toast('⚠ Ce scénario ne contient aucune étape.'); return false; }
    const errs = []; P.buildState(sc, sc.steps.length - 1, errs);
    sc.errors = sc.errors.concat(errs);
    App.pause();
    App.scenario = sc; App.scenarioSrc = md; App.origin = origin || null;
    App.colorMap = {}; App.colorIdx = 0; App.disp = {}; App.ldisp = {}; App.step = -1;
    App.cinePos = {}; App.noteOff = {};
    if (App.mode !== 'cinema') setMode('cinema', true);
    App.goStep(startStep || 0);
    if (errs.length) toast(`⚠ ${errs.length} avertissement(s) dans le scénario (voir sous le commentaire).`, 4000);
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
  };

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
    if (!App.origin) { try { App.origin = { packed: await packMd(App.scenarioSrc) }; } catch (e) { toast('Encodage du scénario impossible dans ce navigateur.'); return; } }
    const lib = new URL(base); lib.searchParams.set('scenarios', '');
    const links = [
      ['Cette étape', `Ouvre « ${esc(App.scenario.title)} » directement à l'étape ${App.step + 1}.`, scenarioUrl(base, App.step)],
      ['Début du scénario', 'Ouvre le scénario à sa première étape.', scenarioUrl(base, 0)],
      ['Bibliothèque', 'Ouvre le choix des scénarios.', lib.toString().replace('scenarios=', 'scenarios')]
    ];
    const long = App.origin.packed && links[0][2].length > 6000;
    const c = App.modal(`<h2>🔗 Partager</h2>
      ${App.origin.packed ? '<p class="small muted">Ce scénario ne fait pas partie de la bibliothèque : son texte est encodé dans le lien lui-même (après le #). Aucun serveur ne le reçoit.</p>' : ''}
      ${long ? '<p class="small" style="color:var(--warn)">⚠ Lien très long : certaines messageries peuvent le couper. Pour un long scénario, publiez plutôt le fichier .md et utilisez ?md=adresse-du-fichier.</p>' : ''}
      ${isLocal ? `<p class="small muted">Liens construits sur l'adresse publique <b>${esc(PUBLIC_BASE)}</b>${App.origin.id ? ' : le scénario doit y avoir été publié' : ''}.</p>` : ''}
      ${links.map(([t, d, u], i) => `<div class="share-row"><div><b>${t}</b><span class="small muted"> — ${d}</span></div><div class="share-line"><input type="text" readonly value="${esc(u)}" id="sh-${i}"><button data-copy="${i}">📋 Copier</button><a class="btnlink" href="${esc(u)}" target="_blank" rel="noopener">↗</a></div></div>`).join('')}`, 'narrow');
    c.addEventListener('click', ev => { const b = ev.target.closest('[data-copy]'); if (b) copyText($('#sh-' + b.dataset.copy, c).value); });
    $$('input[readonly]', c).forEach(i => i.addEventListener('focus', () => i.select()));
  }
  $('#btn-share').onclick = openShare;

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
  };

  /** Contenu de la question : en feuille sur le canevas (écran large) ou dans le texte (téléphone). */
  function qsheetHTML(q, inline) {
    const Q = App.q, inl = t => P.md(t, { nameOf });
    let h = `<div class="qs-head" data-qs="toggle" title="Réduire / agrandir"><span class="qs-badge">❓ Question</span><div class="qs-text">${inl(q.text)}</div><div class="qs-actions">`;
    h += Q.revealed ? '<span class="qs-done">✔ Réponse révélée</span>' : '<button class="primary" data-qs="reveal" title="Révéler la réponse (→)">💡 Révéler la réponse</button>';
    h += `<button class="qs-min" data-qs="toggle" title="${Q.collapsed ? 'Agrandir' : 'Réduire'}">${Q.collapsed ? '▴' : '▾'}</button></div></div><div class="qs-body">`;
    if (q.choices.length) {
      h += '<div class="qs-grid">' + q.choices.map((c, i) => {
        const cls = ['qcard', Q.picked === i ? 'picked' : '', Q.revealed ? (c.correct ? 'correct' : 'wrong') : '', Q.revealed && Q.flipped[i] ? 'flipped' : ''].join(' ');
        const pickTag = Q.picked === i ? '<span class="qc-pick">👥 choix de la salle</span>' : '';
        return `<div class="${cls}" data-card="${i}" role="button" tabindex="0"><div class="qc-inner">
          <div class="qc-face qc-front"><span class="qc-letter">${'ABCDEFGHIJ'[i] || i + 1}</span><div class="qc-txt">${inl(c.text)}${pickTag}</div>${Q.revealed ? `<span class="qc-mark">${c.correct ? '✓' : '✗'}</span>` : ''}</div>
          <div class="qc-face qc-back"><div class="qc-verdict">${c.correct ? '✓ Bonne réponse' : '✗ Mauvaise réponse'}</div><div class="qc-txt">${c.explain ? inl(c.explain) : ''}</div></div>
        </div></div>`;
      }).join('') + '</div>';
      h += `<p class="qs-hint">${Q.revealed ? (q.choices.some(c => c.explain) ? 'Cliquez sur une carte (ou tapez son numéro) pour la retourner et lire son explication.' : 'Cliquez sur une carte pour la retourner.') : 'Cliquez sur la réponse choisie par la salle (ou tapez son numéro), puis révélez la réponse (→).'}${inline ? '' : ' Le canevas reste déplaçable au-dessus.'}</p>`;
    } else {
      h += `<p class="qs-open">${Q.revealed ? (inline ? 'La réponse est affichée ci-dessous.' : 'La réponse est affichée dans le panneau de droite.') : 'Question ouverte : échangez avec la salle, puis révélez la réponse (→).'}</p>`;
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
    $('#pl-play').textContent = App.playing ? '⏸ Pause' : '▶ Lecture';
    $('#pl-next').className = cont ? '' : 'primary';
    $('#pl-timer').style.visibility = cont ? 'visible' : 'hidden';
    $('.speed').style.display = cont ? '' : 'none';
    if (!sc) { $('#pl-count').textContent = '–'; $('#pl-dots').innerHTML = ''; return; }
    $('#pl-count').textContent = `${App.step + 1} / ${sc.steps.length}`;
    $('#pl-dots').innerHTML = sc.steps.map((s, i) => `<button data-go="${i}" class="${i === App.step ? 'cur' : i < App.step ? 'done' : ''}" title="${esc((i + 1) + '. ' + s.title)}"></button>`).join('');
    $('#pl-reset').hidden = !Object.keys(App.cinePos).length && !Object.keys(App.noteOff).length;
    $('#pl-prev').disabled = App.step <= 0;
    const pending = !!curQuestion() && !App.q.revealed;
    $('#pl-next').textContent = pending ? (isMobile() ? '💡 Réponse' : '💡 Réponse ▶') : (isMobile() ? 'Suivant' : 'Suivant ▶');
    $('#pl-next').title = pending ? 'Révéler la réponse (→)' : 'Étape suivante (→)';
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
    $('#pl-speed-v').textContent = App.speed.toLocaleString('fr-FR') + '×';
  };
  $('#pl-speed').onchange = () => { if (App.playing) App.schedule(); };

  function perspectiveSummary(pv) {
    const an = App.an, rows = an.ids.filter(c => c !== pv && (an.interestOf(pv, c) > 1e-6 || an.ctrl[pv].has(c)));
    if (!rows.length) return '';
    return `<div class="auto"><div class="auto-h">👁 Point de vue : ${esc(nameOf(pv))}</div><table class="mini"><tr><th>Entité</th><th class="n">Intérêt</th><th class="n">DV contrôlés</th><th class="n">Contrôle</th></tr>${rows.map(c => `<tr><td><span class="ref" data-ref="${esc(c)}">${esc(nameOf(c))}</span></td><td class="n">${fmt(an.interestOf(pv, c) * 100)}</td><td class="n">${fmt(an.pct(pv, c))}</td><td class="n">${an.ctrl[pv].has(c) ? '✔' : '—'}</td></tr>`).join('')}</table></div>`;
  }

  App.renderCommentary = function () {
    const el = $('#commentary'), sc = App.scenario;
    if (!sc) {
      el.innerHTML = '<div class="empty"><h2>🎬 Mode cinéma</h2><p>Un scénario déroule, étape par étape, la construction d\'une structure de participations avec ses commentaires.</p><button class="primary" data-act="lib">📚 Choisir un scénario</button></div>';
      return;
    }
    const s = sc.steps[App.step], st = App.state;
    let h = `<div class="sc-head"><div class="sc-title">${esc(sc.title)}</div><div class="sc-no">Étape ${App.step + 1} / ${sc.steps.length}</div></div>`;
    h += `<h2 class="step-title">${s.question ? '❓ ' : ''}${esc(s.title)}</h2><div class="md">${P.md(s.md, { nameOf })}</div>`;
    if (s.question) {
      const q = s.question, good = q.choices.map((c, i) => c.correct ? `<b>${'ABCDEFGHIJ'[i] || i + 1}</b> — ${P.md(c.text, { nameOf }).replace(/^<p>|<\/p>$/g, '')}` : null).filter(Boolean);
      if (isMobile()) h += `<div class="qinline">${qsheetHTML(q, true)}</div>`;
      if (!App.q.revealed) { if (!isMobile()) h += '<div class="answer-wait">La réponse s\'affichera ici. <button class="small" data-act="reveal">💡 Révéler la réponse</button></div>'; }
      else if (good.length || q.answerMd) {
        h += `<details class="answer" open><summary>💡 Réponse</summary>${good.length ? `<p class="good">${good.length > 1 ? 'Bonnes réponses' : 'Bonne réponse'} : ${good.join(' ; ')}</p>` : ''}<div class="md">${P.md(q.answerMd, { nameOf })}</div></details>`;
      }
    }
    const target = App.sel && App.sel.kind === 'node' ? App.sel.id : null;
    if (target && st.entities[target]) h += `<div class="auto"><div class="auto-h">🔍 ${iconOf(target)} ${esc(nameOf(target))}<button data-act="unsel" title="Fermer">×</button></div>${App.analysisHTML(target)}</div>`;
    else if (st.view.perspective && st.entities[st.view.perspective]) h += perspectiveSummary(st.view.perspective);
    h += `<details class="plan"${App.planOpen ? ' open' : ''}><summary>Plan du scénario</summary><ol>${sc.steps.map((x, i) => `<li class="${i === App.step ? 'cur' : ''}${i < App.step ? ' done' : ''}"><a data-go="${i}">${esc(x.title)}</a></li>`).join('')}</ol></details>`;
    if (sc.errors.length) h += `<details class="errs"><summary>⚠ ${sc.errors.length} avertissement(s) dans le scénario</summary><ul>${sc.errors.map(e => `<li>Étape ${(e.step || 0) + 1}, ligne ${e.line} : <code>${esc(e.text)}</code> — ${esc(e.msg)}</li>`).join('')}</ul></details>`;
    h += '<p class="hint">Cliquez sur une entité du canevas pour afficher son analyse. Glissez une entité ou une bulle pour la déplacer.</p>';
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
    el.innerHTML = `<b>🎞 Studio</b><span>${n} étape${n > 1 ? 's' : ''} capturée${n > 1 ? 's' : ''}</span>
      <button class="primary" data-st="cap">📸 Capturer l'étape</button>
      <button data-st="prev"${n ? '' : ' disabled'}>▶ Prévisualiser</button>
      <button data-st="exp">⬇ Exporter .md</button>
      <button data-st="pop"${n ? '' : ' disabled'} title="Retirer la dernière étape">↶</button>
      <button data-st="clr"${n ? '' : ' disabled'}>Vider</button>
      <button data-st="close" title="Fermer le studio">×</button>`;
  }
  function studioMd() {
    const steps = App.studio.steps.length ? App.studio.steps : [{ title: 'Structure', comment: '', snap: P.clone(App.state) }];
    return P.studioMarkdown(App.studio.title, steps);
  }
  $('#studio').addEventListener('click', ev => {
    const b = ev.target.closest('[data-st]'); if (!b) return;
    const S = App.studio;
    switch (b.dataset.st) {
      case 'cap': {
        const selNode = App.sel && App.sel.kind === 'node' ? App.sel.id : null;
        const c = App.modal(`<h2>📸 Capturer l'étape ${S.steps.length + 1}</h2>
          ${S.steps.length ? '' : `<label class="field"><span>Titre du scénario</span><input type="text" id="sd-title" value="${esc(S.title)}"></label>`}
          <label class="field"><span>Titre de l'étape</span><input type="text" id="sd-step" value="${S.steps.length + 1}. "></label>
          <label class="field"><span>Commentaire (markdown : **gras**, listes « - », citations « > »…)</span><textarea id="sd-com" placeholder="Expliquez ce que montre cette étape…"></textarea></label>
          ${selNode ? `<label class="chk"><input type="checkbox" id="sd-focus" checked> mettre en évidence « ${esc(nameOf(selNode))} »</label>` : ''}
          <div class="btns"><button class="primary" id="sd-ok">Capturer</button></div>`, 'narrow');
        $('#sd-step', c).focus();
        $('#sd-ok', c).onclick = () => {
          const snap = P.clone(App.state);
          snap.view.focus = selNode && $('#sd-focus', c) && $('#sd-focus', c).checked ? [selNode] : [];
          snap.view.notes = {}; snap.view.select = null;
          if ($('#sd-title', c)) S.title = $('#sd-title', c).value.trim() || S.title;
          S.steps.push({ title: $('#sd-step', c).value.trim(), comment: $('#sd-com', c).value, snap });
          App.closeModal(); updateStudio(); toast(`📸 Étape ${S.steps.length} capturée`);
        };
        break;
      }
      case 'prev': App.loadScenario(studioMd()); break;
      case 'exp': {
        const md = studioMd();
        const c = App.modal(`<h2>⬇ Scénario généré</h2><textarea class="big" id="sd-md" spellcheck="false"></textarea>
          <div class="btns"><button class="primary" id="sd-dl">⬇ Télécharger .md</button><button id="sd-cp">📋 Copier</button><button id="sd-play">▶ Lire en mode cinéma</button></div>`);
        $('#sd-md', c).value = md;
        $('#sd-dl', c).onclick = () => download(P.slug(S.title).toLowerCase() + '.md', $('#sd-md').value);
        $('#sd-cp', c).onclick = () => copyText($('#sd-md').value);
        $('#sd-play', c).onclick = () => { const v = $('#sd-md').value; App.closeModal(); App.loadScenario(v); };
        break;
      }
      case 'pop': S.steps.pop(); updateStudio(); break;
      case 'clr': if (confirm('Vider toutes les étapes capturées ?')) { S.steps = []; updateStudio(); } break;
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
    if (Object.keys(App.state.entities).length && !confirm('Vider le canevas ? (Ctrl+Z pour annuler)')) return;
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
    if (lib && Object.keys(lib.entities).length && !confirm('Remplacer la structure du mode libre par l\'état affiché ? (Ctrl+Z pour annuler en mode libre)')) return;
    const st = P.clone(App.state);
    Object.values(st.entities).forEach(e => { e.fixed = true; });
    st.view.focus = []; st.view.notes = {}; st.view.select = null;
    const prevLibre = App.libreState;
    setMode('libre');
    if (prevLibre) App.undoStack.push(JSON.stringify(prevLibre));
    App.state = st; App.commit({ animate: false }); App.fit(false);
    toast('✏️ Vous pouvez maintenant modifier librement cette structure.');
  };
  $('#btn-help').onclick = () => openHelp('all');

  /* ---- mode jour / nuit (le thème initial est posé par le script en tête d'index.html) */
  function applyTheme(t, remember) {
    document.documentElement.setAttribute('data-theme', t);
    const b = $('#btn-theme');
    b.textContent = t === 'dark' ? '☀️' : '🌙';
    b.title = t === 'dark' ? 'Passer en mode jour' : 'Passer en mode nuit';
    if (remember) { try { localStorage.setItem('capital-lab.theme', t); } catch (e) { /* */ } }
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
    const t = ev.changedTouches[0], dx = t.clientX - swipe.x, dy = t.clientY - swipe.y;
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
    const q = new URLSearchParams(location.search);
    const sid = q.get('scenario'), url = q.get('md');
    const step = Math.max(0, (parseInt(q.get('etape') || q.get('step'), 10) || 1) - 1);
    const hash = (location.hash.match(/(?:^#|&)md=([A-Za-z0-9_-]+)/) || [])[1];
    if (sid) {
      const s = P.LIBRARY.find(x => x.id === sid);
      if (s) App.loadScenario(s.md, { id: sid }, step); else { toast('Scénario introuvable : ' + esc(sid)); setMode('cinema'); }
    } else if (hash) {
      unpackMd(hash).then(t => App.loadScenario(t, { packed: hash }, step))
        .catch(() => { toast('⚠ Lien de scénario illisible (incomplet ?)'); setMode('cinema'); });
    } else if (url) {
      fetch(url).then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(t => App.loadScenario(t, { url }, step))
        .catch(() => toast('⚠ Impossible de charger ' + esc(url)));
    } else if (q.has('scenarios') || q.has('bibliotheque') || isMobile()) {
      setMode('cinema');   // ouvre la bibliothèque ; sur téléphone, le mode cinéma est le point d'entrée
    }
  }
  init();
})();
