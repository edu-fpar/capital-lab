/* ============================================================
 * Capital Lab — scénarios markdown, commandes, rendu markdown
 * ============================================================ */
(function () {
  'use strict';
  const P = window.P;

  /* ------------------------------------------------------------ mots-clés */
  const KW = {
    lien: ['lien', 'participation', 'detient', 'link'],
    retirer: ['retirer', 'supprimer', 'enlever', 'remove', 'delete'],
    renommer: ['renommer', 'rename'],
    concert: ['concert', 'pacte', 'pact'],
    vue: ['vue', 'perspective', 'view'],
    focus: ['focus', 'surligner', 'highlight', 'montrer'],
    note: ['note', 'bulle'],
    effacer: ['effacer', 'vider', 'reset', 'clear'],
    duree: ['duree', 'duration'],
    regle: ['regle', 'option', 'rule'],
    disposition: ['disposition', 'layout'],
    deplacer: ['deplacer', 'placer', 'move'],
    selection: ['selection', 'selectionner', 'select', 'analyse', 'analyser'],
    type: ['type']
  };
  const KWMAP = {};
  Object.keys(KW).forEach(k => KW[k].forEach(w => { KWMAP[w] = k; }));
  const NONE = ['aucun', 'aucune', 'aucuns', 'aucunes', 'rien', 'none', 'off', '-'];
  const isNone = tok => tok && NONE.includes(P.norm(tok.v));

  P.tokenize = function (s) {
    s = String(s).replace(/→|⇒/g, ' -> ');
    const re = /"([^"]*)"|“([^”]*)”|«\s*([^»]*?)\s*»|(\S+)/g;
    const out = []; let m;
    while ((m = re.exec(s))) {
      if (m[4] !== undefined) m[4].split(/(->)/).filter(Boolean).forEach(p => out.push({ v: p, q: false }));
      else out.push({ v: m[1] != null ? m[1] : (m[2] != null ? m[2] : m[3]), q: true });
    }
    return out;
  };

  P.resolve = function (st, tok, create) {
    if (!tok) return null;
    const v = tok.v, E = st.entities;
    if (!tok.q && E[v]) return v;
    const n = P.norm(v);
    for (const id in E) if (P.norm(id) === n) return id;
    for (const id in E) if (P.norm(E[id].name) === n) return id;
    if (!create) return null;
    let id = tok.q ? P.slug(v) : v; const base = id; let k = 2;
    while (E[id]) id = base + '_' + (k++);
    P.addEntity(st, { id, type: 'societe', name: v });
    return id;
  };
  const findConcert = (st, v) => (st.concerts || []).find(c => P.norm(c.id) === P.norm(v) || P.norm(c.name) === P.norm(v));

  /* ------------------------------------------------------------ exécution d'une commande */
  P.runCommand = function (st, text, errs, line) {
    const t = P.tokenize(text);
    if (!t.length) return;
    const err = msg => { if (errs) errs.push({ line, text, msg }); };

    if (t.length >= 3 && t[1].v === '->') return linkCmd(t);
    const kw = P.norm(t[0].v);
    if (P.TYPE_ALIASES[kw]) return declCmd(P.TYPE_ALIASES[kw], t.slice(1));
    const cmd = KWMAP[kw];
    if (!cmd) return err('Commande inconnue : « ' + t[0].v + ' »');
    const a = t.slice(1);

    switch (cmd) {
      case 'lien': return linkCmd(a);
      case 'retirer': {
        if (!a.length) return err('Que faut-il retirer ?');
        if (a.length >= 3 && a[1].v === '->') {
          const f = P.resolve(st, a[0]), to = P.resolve(st, a[2]);
          if (!f || !to || !P.findLink(st, f, to)) return err('Participation introuvable');
          P.removeLink(st, f, to); return;
        }
        for (const tok of a) {
          const c = findConcert(st, tok.v);
          if (c) { st.concerts = st.concerts.filter(x => x !== c); continue; }
          const id = P.resolve(st, tok);
          if (id) P.removeEntity(st, id); else err('Introuvable : ' + tok.v);
        }
        return;
      }
      case 'renommer': {
        const id = P.resolve(st, a[0]);
        if (!id || !a[1]) return err('Syntaxe : renommer ID "Nouveau nom"');
        st.entities[id].name = a.slice(1).map(x => x.v).join(' '); return;
      }
      case 'type': {
        const id = P.resolve(st, a[0]), ty = a[1] && P.TYPE_ALIASES[P.norm(a[1].v)];
        if (!id || !ty) return err('Syntaxe : type ID societe|holding|fonds|personne|etat|public');
        st.entities[id].type = ty; return;
      }
      case 'concert': {
        if (!a.length) return err('Syntaxe : concert ID "Nom" MEMBRE1 MEMBRE2…');
        let name = a[0].q ? a[0].v : null;
        const cid = a[0].q ? P.slug(a[0].v) : a[0].v;
        const mem = [];
        for (const tok of a.slice(1)) {
          if (tok.q && name == null) { name = tok.v; continue; }
          const id = P.resolve(st, tok, true); if (id) mem.push(id);
        }
        let c = findConcert(st, cid);
        if (!c) {
          if (mem.length < 2) return err('Un concert réunit au moins deux membres');
          c = { id: cid, name: name || cid, members: [] }; st.concerts.push(c);
        }
        if (name) c.name = name;
        if (mem.length) c.members = Array.from(new Set(mem));
        return;
      }
      case 'vue': {
        if (!a.length || isNone(a[0])) { st.view.perspective = null; return; }
        const id = P.resolve(st, a[0]);
        if (!id) return err('Entité introuvable : ' + a[0].v);
        st.view.perspective = id; return;
      }
      case 'focus': {
        st.view.focus = [];
        if (!a.length || isNone(a[0])) return;
        a.forEach(tok => { const id = P.resolve(st, tok); if (id) st.view.focus.push(id); else err('Entité introuvable : ' + tok.v); });
        return;
      }
      case 'note': {
        if (!a.length || isNone(a[0])) { st.view.notes = {}; return; }
        const id = P.resolve(st, a[0]);
        if (!id) return err('Entité introuvable : ' + a[0].v);
        if (!a[1] || isNone(a[1])) { delete st.view.notes[id]; return; }
        st.view.notes[id] = a.slice(1).map(x => x.v).join(' '); return;
      }
      case 'effacer': {
        const opt = st.options; Object.assign(st, P.newState()); st.options = opt; return;
      }
      case 'duree': return;
      case 'regle': {
        const w = a.map(x => P.norm(x.v));
        const on = w.some(x => ['on', 'oui', 'actif', 'active', 'activee', 'vrai', 'true'].includes(x));
        const off = w.some(x => ['off', 'non', 'inactif', 'inactive', 'desactivee', 'faux', 'false'].includes(x));
        if (!on && !off) return err('Syntaxe : regle 40 on|off');
        st.options.deFacto = on; return;
      }
      case 'disposition': Object.values(st.entities).forEach(e => { e.fixed = false; }); return;
      case 'deplacer': {
        const id = P.resolve(st, a[0]), x = P.num(a[1] && a[1].v), y = P.num(a[2] && a[2].v);
        if (!id || x == null || y == null) return err('Syntaxe : deplacer ID X Y');
        Object.assign(st.entities[id], { x, y, fixed: true }); return;
      }
      case 'selection': {
        if (!a.length || isNone(a[0])) { st.view.select = null; return; }
        const id = P.resolve(st, a[0]);
        if (!id) return err('Entité introuvable : ' + a[0].v);
        st.view.select = id; return;
      }
    }

    function declCmd(type, a) {
      if (!a.length) return err('Identifiant manquant');
      let id, name = null;
      if (a[0].q) { name = a[0].v; id = P.resolve(st, a[0], false) || P.slug(a[0].v); }
      else id = a[0].v;
      let x = null, y = null;
      for (let k = 1; k < a.length; k++) {
        const tok = a[k], w = P.norm(tok.v);
        if (tok.q) { if (name == null) name = tok.v; continue; }
        if (['at', 'en', '@', 'pos', 'position', 'a'].includes(w)) {
          x = P.num(a[k + 1] && a[k + 1].v); y = P.num(a[k + 2] && a[k + 2].v); k += 2;
          if (x == null || y == null) err('Coordonnées invalides');
          continue;
        }
        let m = w.match(/^x=(.+)$/); if (m) { x = P.num(m[1]); continue; }
        m = w.match(/^y=(.+)$/); if (m) { y = P.num(m[1]); continue; }
        name = name == null ? tok.v : name + ' ' + tok.v;
      }
      const ex = st.entities[id];
      const o = { id, type };
      if (name != null) o.name = name; else if (!ex) o.name = id;
      if (x != null && y != null) { o.x = x; o.y = y; o.fixed = true; }
      P.addEntity(st, o);
      if (!P.TYPES[type].holdable && st.links.some(l => l.to === id))
        err('« ' + st.entities[id].name + ' » a des actionnaires mais son type ne peut pas être détenu');
    }

    function linkCmd(a) {
      if (a.length < 3 || a[1].v !== '->') return err('Syntaxe attendue : lien A -> B 51%');
      const f = P.resolve(st, a[0], true), to = P.resolve(st, a[2], true);
      const te = st.entities[to];
      if (!(P.TYPES[te.type] || {}).holdable) return err('« ' + te.name + ' » (' + P.TYPES[te.type].label.toLowerCase() + ') ne peut pas être détenu(e)');
      let cap = null, votes = null;
      for (let k = 3; k < a.length; k++) {
        const w = P.norm(a[k].v);
        let m = w.match(/^(capital|cap|c)=(.+)$/); if (m) { cap = P.num(m[2]); continue; }
        m = w.match(/^(votes|vote|dv|ddv|droits)=(.+)$/); if (m) { votes = P.num(m[2]); continue; }
        if (['capital', 'cap'].includes(w)) { cap = P.num(a[++k] && a[k].v); continue; }
        if (['votes', 'vote', 'dv', 'ddv', 'droits'].includes(w)) { votes = P.num(a[++k] && a[k].v); continue; }
        if (['de', 'du', 'des', 'et', '%', 'de vote'].includes(w)) continue;
        const n = P.num(a[k].v);
        if (n != null) { if (cap == null) cap = n; else if (votes == null) votes = n; continue; }
        err('Mot non compris : « ' + a[k].v + ' »');
      }
      if (cap == null && votes == null) return err('Pourcentage manquant');
      const ex = P.findLink(st, f, to);
      if (cap == null) cap = ex ? ex.capital : votes;
      if (votes != null && Math.abs(votes - cap) < 1e-9) votes = null;
      if (cap <= 0 && (votes == null || votes <= 0)) { P.removeLink(st, f, to); return; }
      if (cap > 100 || (votes || 0) > 100) err('Pourcentage supérieur à 100 % ramené à 100 %');
      P.setLink(st, f, to, cap, votes);
    }
  };

  /* ------------------------------------------------------------ analyse d'un scénario */
  const SCENE_LANGS = ['scene', 'canevas', 'canvas', 'actions', 'script', 'commandes'];

  P.parseScenario = function (src) {
    const lines = String(src || '').replace(/\r/g, '').split('\n');
    const sc = { title: 'Scénario', description: '', steps: [], errors: [], meta: {} };
    let cur = { title: 'Introduction', md: [], commands: [], duration: null, intro: true };
    let inFence = null, isScene = false, gotTitle = false, i = 0;
    const push = () => {
      const md = cur.md.join('\n').trim();
      if (cur.intro && !md && !cur.commands.length) return;
      sc.steps.push({ title: cur.title, md, commands: cur.commands, duration: cur.duration });
    };
    if (lines[0] && lines[0].trim() === '---') {
      let j = 1;
      while (j < lines.length && lines[j].trim() !== '---') {
        const m = lines[j].match(/^([\wÀ-ſ-]+)\s*:\s*(.*)$/);
        if (m) sc.meta[P.norm(m[1])] = m[2].trim();
        j++;
      }
      i = j + 1;
    }
    for (; i < lines.length; i++) {
      const line = lines[i];
      if (inFence) {
        if (line.trim().startsWith(inFence)) { if (!isScene) cur.md.push(line); inFence = null; continue; }
        if (isScene) {
          const tl = line.trim();
          if (tl && !tl.startsWith('#') && !tl.startsWith('//')) {
            cur.commands.push({ text: tl, line: i + 1 });
            const t = P.tokenize(tl);
            if (t.length > 1 && ['duree', 'duration'].includes(P.norm(t[0].v))) cur.duration = P.num(t[1].v);
          }
        } else cur.md.push(line);
        continue;
      }
      const f = line.match(/^\s*(```+|~~~+)\s*([^\s`]*)/);
      if (f) {
        inFence = f[1];
        isScene = SCENE_LANGS.includes(P.norm(f[2] || '').replace('è', 'e'));
        if (!isScene) cur.md.push(line);
        continue;
      }
      const h1 = line.match(/^#\s+(.*)$/);
      if (h1 && !gotTitle) { sc.title = h1[1].trim(); gotTitle = true; continue; }
      const h2 = line.match(/^##\s+(.*)$/);
      if (h2) { push(); cur = { title: h2[1].trim(), md: [], commands: [], duration: null }; continue; }
      cur.md.push(line);
    }
    push();
    if (sc.meta.titre || sc.meta.title) sc.title = sc.meta.titre || sc.meta.title;
    // description : première citation ou premier paragraphe de l'introduction
    const intro = sc.steps[0] && sc.steps[0].title === 'Introduction' ? sc.steps[0].md : '';
    const q = intro.match(/^>\s?(.+)$/m);
    sc.description = sc.meta.description || (q ? q[1] : (intro.split(/\n\s*\n/)[0] || '')).replace(/[*_`]/g, '').trim();
    return sc;
  };

  P.buildState = function (sc, n, errs) {
    const st = P.newState();
    for (let i = 0; i <= n && i < sc.steps.length; i++) {
      st.view.focus = []; st.view.notes = {}; st.view.select = null;
      const sink = errs ? { push: e => errs.push(Object.assign(e, { step: i })) } : null;
      sc.steps[i].commands.forEach(c => P.runCommand(st, c.text, sink, c.line));
    }
    return st;
  };

  P.stepDuration = function (s) {
    if (s.duration) return s.duration * 1000;
    const words = (s.md || '').replace(/[#*_>|`~-]/g, ' ').split(/\s+/).filter(Boolean).length;
    return Math.max(5000, Math.min(45000, 3500 + words * 290));
  };

  /* ------------------------------------------------------------ export (studio) */
  const n2 = v => String(P.round2(v));
  const q = s => '"' + String(s).replace(/"/g, "'") + '"';

  P.toCommands = function (prev, cur) {
    const out = [], pe = prev.entities;
    Object.keys(pe).forEach(id => { if (!cur.entities[id]) out.push('retirer ' + id); });
    prev.links.forEach(l => { if (!P.findLink(cur, l.from, l.to) && cur.entities[l.from] && cur.entities[l.to]) out.push(`retirer ${l.from} -> ${l.to}`); });
    (prev.concerts || []).forEach(c => { if (!(cur.concerts || []).find(d => d.id === c.id)) out.push('retirer ' + c.id); });
    Object.keys(cur.entities).forEach(id => {
      const e = cur.entities[id], p = pe[id], x = Math.round(e.x), y = Math.round(e.y);
      if (!p || p.name !== e.name || p.type !== e.type) out.push(`${e.type} ${id} ${q(e.name)} at ${x} ${y}`);
      else if (Math.round(p.x) !== x || Math.round(p.y) !== y) out.push(`deplacer ${id} ${x} ${y}`);
    });
    cur.links.forEach(l => {
      const p = P.findLink(prev, l.from, l.to);
      if (!p || p.capital !== l.capital || p.votes !== l.votes)
        out.push(`lien ${l.from} -> ${l.to} ${n2(l.capital)}%` + (l.votes != null && l.votes !== l.capital ? ` votes ${n2(l.votes)}%` : ''));
    });
    (cur.concerts || []).forEach(c => {
      const p = (prev.concerts || []).find(d => d.id === c.id);
      if (!p || p.name !== c.name || p.members.join() !== c.members.join()) out.push(`concert ${c.id} ${q(c.name)} ${c.members.join(' ')}`);
    });
    if (!!prev.options.deFacto !== !!cur.options.deFacto) out.push('regle 40 ' + (cur.options.deFacto ? 'on' : 'off'));
    if (prev.view.perspective !== cur.view.perspective) out.push('vue ' + (cur.view.perspective || 'aucune'));
    if (cur.view.focus && cur.view.focus.length) out.push('focus ' + cur.view.focus.join(' '));
    Object.keys(cur.view.notes || {}).forEach(id => out.push(`note ${id} ${q(cur.view.notes[id])}`));
    if (cur.view.select) out.push('selection ' + cur.view.select);
    return out;
  };

  P.studioMarkdown = function (title, steps) {
    let md = `# ${title}\n\n> Scénario créé avec le studio de l'atelier Capital Lab.\n\n`;
    let prev = P.newState();
    steps.forEach((s, i) => {
      const cmds = P.toCommands(prev, s.snap);
      md += `## ${s.title || 'Étape ' + (i + 1)}\n\n${(s.comment || '').trim()}\n\n\`\`\`scene\n${cmds.join('\n')}\n\`\`\`\n\n`;
      prev = s.snap;
    });
    return md;
  };

  /* ------------------------------------------------------------ mini rendu markdown */
  P.md = function (src, opt) {
    opt = opt || {};
    const nameOf = opt.nameOf || (x => x);
    const L = String(src || '').replace(/\r/g, '').split('\n');
    let i = 0, out = '';
    const inline = s => {
      let t = P.esc(s); const codes = [];
      t = t.replace(/`([^`]+)`/g, (m, c) => { codes.push(c); return '\u0000' + (codes.length - 1) + '\u0000'; });
      t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/__(.+?)__/g, '<strong>$1</strong>');
      t = t.replace(/(^|[^\w*])\*(?!\s)(.+?)\*(?!\w)/g, '$1<em>$2</em>').replace(/(^|[^\w])_(?!\s)(.+?)_(?!\w)/g, '$1<em>$2</em>');
      t = t.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (m, id, lab) => `<span class="ref" data-ref="${id.trim()}">${lab ? lab : P.esc(nameOf(id.trim()))}</span>`);
      t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
      t = t.replace(/\u0000(\d+)\u0000/g, (m, n) => '<code>' + codes[n] + '</code>');
      return t;
    };
    const blockStart = l => /^(#{1,6}\s|```|~~~|\s*>|\s*[-*+]\s|\s*\d+[.)]\s|\s*\|)/.test(l) || /^(-{3,}|\*{3,})\s*$/.test(l);
    const listRe = /^\s*([-*+]|\d+[.)])\s+/;
    while (i < L.length) {
      const l = L[i]; let m;
      if (!l.trim()) { i++; continue; }
      if ((m = l.match(/^\s*(```+|~~~+)/))) {
        const f = m[1], buf = []; i++;
        while (i < L.length && !L[i].trim().startsWith(f)) buf.push(L[i++]);
        i++; out += `<pre><code>${P.esc(buf.join('\n'))}</code></pre>`; continue;
      }
      if ((m = l.match(/^(#{1,6})\s+(.*)$/))) { const n = Math.min(6, m[1].length + (opt.shift || 0)); out += `<h${n}>${inline(m[2])}</h${n}>`; i++; continue; }
      if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(l)) { out += '<hr>'; i++; continue; }
      if (/^\s*>/.test(l)) {
        const buf = [];
        while (i < L.length && /^\s*>/.test(L[i])) buf.push(L[i++].replace(/^\s*>\s?/, ''));
        out += `<blockquote>${P.md(buf.join('\n'), opt)}</blockquote>`; continue;
      }
      if (/^\s*\|/.test(l) && i + 1 < L.length && /^\s*\|?\s*:?-{2,}/.test(L[i + 1])) {
        const row = s => s.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
        let t = '<table><thead><tr>' + row(l).map(c => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>';
        i += 2;
        while (i < L.length && /^\s*\|/.test(L[i])) { t += '<tr>' + row(L[i]).map(c => `<td>${inline(c)}</td>`).join('') + '</tr>'; i++; }
        out += t + '</tbody></table>'; continue;
      }
      if (listRe.test(l)) {
        const ordered = /^\s*\d/.test(l), items = [];
        while (i < L.length && listRe.test(L[i])) {
          let it = L[i].replace(listRe, ''); i++;
          while (i < L.length && L[i].trim() && !blockStart(L[i]) && /^\s{2,}/.test(L[i])) it += ' ' + L[i++].trim();
          items.push(it);
        }
        const tag = ordered ? 'ol' : 'ul';
        out += `<${tag}>` + items.map(x => `<li>${inline(x)}</li>`).join('') + `</${tag}>`; continue;
      }
      const buf = [l]; i++;
      while (i < L.length && L[i].trim() && !blockStart(L[i])) buf.push(L[i++]);
      out += `<p>${inline(buf.join(' '))}</p>`;
    }
    return out;
  };
})();
