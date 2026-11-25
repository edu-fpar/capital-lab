/* ============================================================
 * Capital Lab — moteur de calcul
 * Entités, participations (capital / droits de vote), contrôle
 * en chaîne, autocontrôle, action de concert, intérêts indirects.
 * ============================================================ */
(function () {
  'use strict';
  const P = window.P = window.P || {};

  const t = s => (P.t ? P.t(s) : s);
  P.TYPES = {
    personne: { label: t('Personne physique'), short: t('Personne'), icon: '👤', prefix: 'P', holdable: false },
    societe: { label: t('Société'), short: t('Société'), icon: '🏢', prefix: 'S', holdable: true },
    holding: { label: 'Holding', short: 'Holding', icon: '🏦', prefix: 'H', holdable: true },
    fonds: { label: t("Fonds d'investissement"), short: t('Fonds'), icon: '💼', prefix: 'F', holdable: true },
    etat: { label: t('État / entité publique'), short: t('État'), icon: '🏛️', prefix: 'E', holdable: false },
    public: { label: t('Public / flottant'), short: t('Public'), icon: '👥', prefix: 'PUB', holdable: false }
  };

  P.norm = s => String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

  const aliases = {
    personne: ['personne', 'physique', 'personne-physique', 'person', 'famille', 'individu', 'dirigeant', 'individual', 'family', 'persona', 'familia'],
    societe: ['societe', 'entreprise', 'company', 'corporation', 'subsidiary', 'target', 'filiale', 'cible', 'sociedad', 'empresa', 'filial'],
    holding: ['holding'],
    fonds: ['fonds', 'fund', 'investor', 'investisseur', 'fondo', 'inversor'],
    etat: ['etat', 'state', 'government', 'estado'],
    public: ['public', 'flottant', 'float', 'marche', 'bourse', 'market', 'publico', 'mercado', 'bolsa']
  };
  P.TYPE_ALIASES = {};
  Object.keys(aliases).forEach(t => aliases[t].forEach(a => { P.TYPE_ALIASES[a] = t; }));

  P.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  P.slug = s => (P.norm(s).replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').toUpperCase().slice(0, 16)) || 'X';

  /** "51%", "51,5", "1/3" → nombre (pourcentage) */
  P.num = function (v) {
    if (v == null) return null;
    const s = String(v).trim().replace(/\s/g, '').replace(',', '.').replace(/%$/, '');
    let m = s.match(/^(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
    if (m) return +m[2] ? 100 * m[1] / m[2] : null;
    m = s.match(/^-?\d+(?:\.\d+)?$/);
    return m ? parseFloat(s) : null;
  };

  P.round2 = v => Math.round(v * 100) / 100;
  P.fmt = function (v) {
    if (!isFinite(v)) v = 0;
    return P.round2(v).toLocaleString(P.locale || 'fr-FR', { maximumFractionDigits: 2 }) + (P.lang === 'en' ? '%' : ' %');
  };

  /* ------------------------------------------------------------ droits applicables
   * Chaque droit a ses seuils (catégories appliquées aux droits de vote effectifs, du plus haut au plus bas),
   * ses références légales et ses règles propres. Le contrôle reste partout : plus de 50 % des voix
   * effectives, transmis en chaîne. La présomption de contrôle de fait (40 %) est propre au droit français.
   * Spécification : docs/i18n-spec.md. */
  const PLACEMENT = '#94a3b8';
  P.JURIS = {
    fr: {
      code: 'fr', lang: 'fr', flag: '🇫🇷', name: 'France', deFacto: true,
      cats: [
        { key: 'retrait', test: v => v >= 90 - 1e-9, color: '#065f46', label: '≥ 90 % — retrait obligatoire possible',
          text: "Au moins 90 % du capital et des droits de vote : dans une société cotée, l'actionnaire majoritaire peut mettre en œuvre un retrait obligatoire (squeeze-out) des minoritaires." },
        { key: 'qualifiee', test: v => v >= 200 / 3 - 1e-6, color: '#15803d', label: '≥ 2/3 — majorité qualifiée (AGE)',
          text: "Au moins les deux tiers des voix : l'actionnaire décide seul en assemblée générale extraordinaire (modification des statuts, augmentation de capital, fusion…)." },
        { key: 'majorite', test: v => v > 50 + 1e-9, color: '#22c55e', label: '> 50 % — majorité, contrôle',
          text: "Plus de 50 % des droits de vote : contrôle exclusif « de droit » (art. L233-3, I, 1° C. com.). L'actionnaire décide seul en assemblée générale ordinaire." },
        { key: 'blocage', test: v => v > 100 / 3 + 1e-6, color: '#f97316', label: '> 1/3 — minorité de blocage',
          text: "Plus d'un tiers des voix : minorité de blocage en AGE (SA). L'actionnaire peut empêcher toute modification des statuts." },
        { key: 'influence', test: v => v >= 20 - 1e-9, color: '#a855f7', label: '≥ 20 % — influence notable',
          text: "Au moins 20 % des voix : influence notable présumée — en consolidation, la société est en principe mise en équivalence." },
        { key: 'participation', test: v => v >= 10 - 1e-9, color: '#3b82f6', label: '≥ 10 % — participation',
          text: "Entre 10 % et 50 % du capital : « participation » au sens de l'art. L233-2 C. com." },
        { key: 'placement', test: () => true, color: PLACEMENT, label: '< 10 % — placement',
          text: "Moins de 10 % : simple placement financier (dans les sociétés cotées, les franchissements de seuils sont déclarés dès 5 %)." }
      ],
      txt: {
        control: 'art. L233-3 C. com.',
        autocontrol: "actions détenues par {name} elle-même ou par des sociétés qu'elle contrôle — art. L225-210 et L233-31 C. com.",
        concert: "Action de concert (art. L233-10 C. com.) : les membres sont traités comme <b>un seul bloc de vote</b>. S'ils dépassent ensemble 50 % des voix d'une société, ils la contrôlent conjointement (art. L233-3, III).",
        deFacto: 'Présomption de contrôle de fait : plus de 40 % des voix et aucun autre associé au-dessus (art. L233-3 II C. com.)'
      }
    },
    uk: {
      code: 'uk', lang: 'en', flag: '🇬🇧', name: 'United Kingdom', deFacto: false,
      cats: [
        { key: 'uk-squeeze', test: v => v >= 90 - 1e-9, color: '#065f46', label: '≥ 90% — squeeze-out',
          text: 'At least 90%: after a takeover offer, the bidder can compulsorily buy out the remaining shareholders (Companies Act 2006, s. 979).' },
        { key: 'uk-special', test: v => v >= 75 - 1e-9, color: '#15803d', label: '≥ 75% — special resolution',
          text: 'At least 75% of the votes: passes special resolutions alone (s. 283) — amending the articles (s. 21), disapplying pre-emption rights, reducing capital…' },
        { key: 'uk-majority', test: v => v > 50 + 1e-9, color: '#22c55e', label: '> 50% — ordinary resolution, control',
          text: 'More than 50% of the voting rights: passes ordinary resolutions (s. 282), appoints and removes directors. The company is its subsidiary (s. 1159): control.' },
        { key: 'uk-bid', test: v => v >= 30 - 1e-9, color: '#ea580c', label: '≥ 30% — mandatory bid (Rule 9)',
          text: 'At least 30% of the voting rights of a company subject to the Takeover Code: acquiring this stake triggers a mandatory offer for the rest (Rule 9). Above 25%, it also blocks special resolutions.' },
        { key: 'uk-blocking', test: v => v > 25 + 1e-9, color: '#f97316', label: '> 25% — blocking minority',
          text: 'More than 25% of the votes: can defeat any special resolution (75% needed). Also a person with significant control (PSC register).' },
        { key: 'uk-influence', test: v => v >= 20 - 1e-9, color: '#a855f7', label: '≥ 20% — significant influence',
          text: 'At least 20% of the votes: significant influence is presumed (IAS 28 / FRS 102) — in group accounts, the company is normally an associate, accounted for using the equity method.' },
        { key: 'uk-notifiable', test: v => v >= 3 - 1e-9, color: '#3b82f6', label: '≥ 3% — notifiable holding',
          text: 'At least 3% of the voting rights of a listed company: the holding must be disclosed (FCA Disclosure Guidance and Transparency Rules, DTR 5).' },
        { key: 'uk-investment', test: () => true, color: PLACEMENT, label: '< 3% — investment',
          text: 'Less than 3%: a portfolio investment.' }
      ],
      txt: {
        control: 'Companies Act 2006, s. 1159 and s. 1162',
        autocontrol: 'shares held by {name} itself (treasury shares carry no votes, s. 726) or by a company it controls (a subsidiary cannot be a member of its holding company, s. 136)',
        concert: 'Persons acting in concert (Takeover Code, Definitions): the members are treated as <b>a single voting block</b>. If together they hold more than 50% of the votes of a company, they control it jointly.',
        deFacto: ''
      }
    },
    us: {
      code: 'us', lang: 'en', flag: '🇺🇸', name: 'United States', deFacto: false,
      cats: [
        { key: 'us-shortform', test: v => v >= 90 - 1e-9, color: '#065f46', label: '≥ 90% — short-form merger',
          text: 'At least 90% of each class: the parent can merge the subsidiary without a stockholder vote (DGCL §253).' },
        { key: 'us-majority', test: v => v > 50 + 1e-9, color: '#22c55e', label: '> 50% — majority, control',
          text: 'More than 50% of the voting power: elects the board and approves charter amendments and mergers (DGCL §242, §251: majority of the outstanding stock). Control. There is no statutory blocking minority: a supermajority applies only if the charter or bylaws require it.' },
        { key: 'us-influence', test: v => v >= 20 - 1e-9, color: '#a855f7', label: '≥ 20% — significant influence',
          text: 'At least 20% of the voting stock: significant influence is presumed (ASC 323) — the investor normally uses the equity method. From 15%, the holder is also an interested stockholder (DGCL §203).' },
        { key: 'us-interested', test: v => v >= 15 - 1e-9, color: '#f97316', label: '≥ 15% — interested stockholder',
          text: 'At least 15% of the voting stock: interested stockholder (DGCL §203) — business combinations with the corporation are restricted for 3 years unless approved by the board.' },
        { key: 'us-insider', test: v => v >= 10 - 1e-9, color: '#0ea5e9', label: '≥ 10% — Section 16 insider',
          text: 'At least 10% of a registered class: beneficial owner treated as an insider (Exchange Act §16): ownership reports and short-swing profit rule.' },
        { key: 'us-beneficial', test: v => v > 5 + 1e-9, color: '#3b82f6', label: '> 5% — Schedule 13D/13G',
          text: 'More than 5% of a registered class of equity: the beneficial owner must file Schedule 13D (or the short-form 13G) with the SEC (Exchange Act §13(d)).' },
        { key: 'us-investment', test: () => true, color: PLACEMENT, label: '≤ 5% — investment',
          text: '5% or less: a portfolio investment.' }
      ],
      txt: {
        control: 'majority of the voting power',
        autocontrol: 'shares held by {name} itself (treasury stock) or by a majority-owned subsidiary: they are not voted (DGCL §160(c))',
        concert: 'A "group" (Exchange Act §13(d)(3)): the members acting together are treated as <b>a single voting block</b>. If together they hold more than 50% of the votes of a company, they control it jointly.',
        deFacto: ''
      }
    },
    es: {
      code: 'es', lang: 'es', flag: '🇪🇸', name: 'España', deFacto: false,
      cats: [
        { key: 'es-venta', test: v => v >= 90 - 1e-9, color: '#065f46', label: '≥ 90 % — venta forzosa',
          text: 'Al menos el 90 %: tras una OPA sobre la totalidad del capital, el oferente puede exigir la venta forzosa de las acciones de los minoritarios (squeeze-out).' },
        { key: 'es-reforzada', test: v => v >= 200 / 3 - 1e-6, color: '#15803d', label: '≥ 2/3 — mayoría reforzada',
          text: 'Al menos dos tercios: en la SA, si en la junta concurre menos del 50 % del capital, modificar los estatutos exige 2/3 del capital presente o representado (art. 201.2 LSC); en la SL, la transformación, la fusión, la escisión o la supresión del derecho de preferencia exigen 2/3 de los votos (art. 199 b LSC).' },
        { key: 'es-mayoria', test: v => v > 50 + 1e-9, color: '#22c55e', label: '> 50 % — mayoría, control',
          text: 'Más del 50 % de los derechos de voto: mayoría absoluta en la junta y control de la sociedad (art. 42 del Código de Comercio).' },
        { key: 'es-bloqueo', test: v => v > 100 / 3 + 1e-6, color: '#f97316', label: '> 1/3 — minoría de bloqueo',
          text: 'Más de un tercio de los votos: puede impedir los acuerdos que exigen dos tercios (SL, art. 199 b LSC; SA con quórum inferior al 50 %).' },
        { key: 'es-opa', test: v => v >= 30 - 1e-9, color: '#ea580c', label: '≥ 30 % — OPA obligatoria',
          text: 'Al menos el 30 % de los derechos de voto de una sociedad cotizada: quien lo alcanza debe formular una OPA sobre la totalidad del capital (RD 1066/2007, art. 4).' },
        { key: 'es-influencia', test: v => v >= 20 - 1e-9, color: '#a855f7', label: '≥ 20 % — influencia significativa',
          text: 'Al menos el 20 % de los votos: se presume influencia significativa (NIC 28) — en las cuentas consolidadas, la sociedad se integra por el método de la participación.' },
        { key: 'es-minoria', test: v => v >= 5 - 1e-9, color: '#3b82f6', label: '≥ 5 % — derechos de minoría',
          text: 'Al menos el 5 % del capital: derechos de minoría — solicitar la convocatoria de la junta, el complemento del orden del día, ejercer la acción social de responsabilidad (3 % en las sociedades cotizadas).' },
        { key: 'es-inversion', test: () => true, color: PLACEMENT, label: '< 5 % — inversión',
          text: 'Menos del 5 %: inversión financiera (en las sociedades cotizadas, las participaciones se comunican desde el 3 %).' }
      ],
      txt: {
        control: 'art. 42 del Código de Comercio',
        autocontrol: 'acciones de {name} en su propia cartera (autocartera, art. 148 LSC) o en manos de sociedades que controla (art. 134 y ss. LSC): sus derechos de voto quedan en suspenso',
        concert: 'Actuación concertada (RD 1066/2007, art. 5): los miembros se tratan como <b>un solo bloque de voto</b>. Si juntos superan el 50 % de los votos de una sociedad, la controlan conjuntamente.',
        deFacto: ''
      }
    }
  };
  /** Droits proposés dans chaque langue de l'interface */
  P.LAWS_BY_LANG = { fr: ['fr'], en: ['uk', 'us'], es: ['es'] };
  P.lawsFor = l => P.LAWS_BY_LANG[l] || ['fr'];
  /** Droit par défaut : le dernier choisi, sinon celui de la langue (anglais : US si le navigateur est en en-US, sinon UK) */
  P.defaultJuris = function () {
    const laws = P.lawsFor(P.lang || 'fr');
    try { const s = localStorage.getItem('capital-lab.droit'); if (laws.includes(s)) return s; } catch (e) { /* */ }
    if (P.lang === 'en') return typeof navigator !== 'undefined' && /^en-us$/i.test(navigator.language || '') ? 'us' : 'uk';
    return laws[0];
  };
  /** Toutes les catégories de tous les droits (marqueurs SVG des flèches) */
  P.CATS_ALL = Object.values(P.JURIS).reduce((a, j) => a.concat(j.cats), []);
  /** Traduction des textes d'un droit dans la langue de l'interface (js/juris-i18n.js), s'il en a une */
  const jurL10n = code => ((P.JURIS_I18N || {})[code] || {})[P.lang] || null;
  /** Droit en vigueur pour l'affichage (seuils, légende, textes), dans la langue de l'interface */
  P.setJuris = function (code) {
    if (!P.JURIS[code]) code = 'fr';
    const L = jurL10n(code);
    P.juris = code;
    P.CATS = P.JURIS[code].cats.map(c => (L && L.cats && L.cats[c.key]) ? Object.assign({}, c, { label: L.cats[c.key][0], text: L.cats[c.key][1] }) : c);
    return P.JURIS[code];
  };
  P.jur = () => {
    const J = P.JURIS[P.juris] || P.JURIS.fr, L = jurL10n(J.code);
    return L && L.txt ? Object.assign({}, J, { txt: Object.assign({}, J.txt, L.txt) }) : J;
  };
  P.setJuris(P.defaultJuris());
  P.category = v => P.CATS.find(c => c.test(v));

  /* ------------------------------------------------------------ état */
  P.newState = () => ({
    entities: {}, links: [], concerts: [],
    options: { deFacto: false, droit: P.juris || 'fr' },
    view: { perspective: null, focus: [], notes: {}, select: null }
  });
  P.clone = s => JSON.parse(JSON.stringify(s));
  P.linkKey = l => l.from + '>' + l.to;

  P.uid = function (st, type) {
    const pre = (P.TYPES[type] || P.TYPES.societe).prefix;
    let n = 1;
    while (st.entities[pre + n]) n++;
    return pre + n;
  };

  P.addEntity = function (st, o) {
    const id = o.id || P.uid(st, o.type);
    const prev = st.entities[id];
    const clean = {};
    Object.keys(o).forEach(k => { if (o[k] !== undefined) clean[k] = o[k]; });
    st.entities[id] = Object.assign({ id, type: 'societe', name: id, x: 0, y: 0, fixed: false }, prev || {}, clean, { id });
    return id;
  };

  P.findLink = (st, from, to) => st.links.find(l => l.from === from && l.to === to);

  P.setLink = function (st, from, to, capital, votes) {
    const c = v => Math.max(0, Math.min(100, +v || 0));
    let l = P.findLink(st, from, to);
    if (!l) { l = { from, to, capital: c(capital), votes: votes == null ? null : c(votes) }; st.links.push(l); }
    else { l.capital = c(capital); l.votes = votes == null ? null : c(votes); }
    return l;
  };

  P.removeLink = (st, from, to) => { st.links = st.links.filter(l => !(l.from === from && l.to === to)); };

  P.removeEntity = function (st, id) {
    delete st.entities[id];
    st.links = st.links.filter(l => l.from !== id && l.to !== id);
    st.concerts = (st.concerts || []).map(c => Object.assign(c, { members: c.members.filter(m => m !== id) })).filter(c => c.members.length >= 2);
    if (st.view.perspective === id) st.view.perspective = null;
    st.view.focus = (st.view.focus || []).filter(f => f !== id);
    if (st.view.notes) delete st.view.notes[id];
    if (st.view.select === id) st.view.select = null;
  };

  /* ------------------------------------------------------------ analyse */
  function computeControl(blocks, ids, holders, norm, deFacto, passive) {
    const ctrl = {}, how = {};
    blocks.forEach(b => { ctrl[b.id] = new Set(b.members); how[b.id] = {}; });
    const pct = (b, C) => { let s = 0; for (const h of holders[C]) if (ctrl[b.id].has(h.from)) s += norm[C][h.from]; return s; };
    let changed = true, guard = 0;
    while (changed && guard++ < 300) {
      changed = false;
      for (const C of ids) {
        if (!holders[C].length) continue;
        for (const b of blocks) {
          if (b.passive || ctrl[b.id].has(C)) continue;
          if (pct(b, C) > 50 + 1e-9) { ctrl[b.id].add(C); how[b.id][C] = 'majorite'; changed = true; }
        }
      }
      if (!changed && deFacto) {
        /* Présomption de contrôle de fait (art. L233-3, II) : plus de 40 % des voix
         * et aucun autre associé ne détient directement ou indirectement une fraction supérieure. */
        for (const C of ids) {
          if (!holders[C].length) continue;
          const majo = blocks.some(b => !b.members.includes(C) && how[b.id][C] === 'majorite');
          if (majo) continue;
          for (const b of blocks) {
            if (b.passive || ctrl[b.id].has(C)) continue;
            const p = pct(b, C);
            if (p <= 40 + 1e-9) continue;
            let other = 0;
            for (const h of holders[C]) if (!ctrl[b.id].has(h.from) && !passive.has(h.from)) other = Math.max(other, norm[C][h.from]);
            if (p > other + 1e-9) { ctrl[b.id].add(C); how[b.id][C] = 'fait'; changed = true; }
          }
        }
      }
    }
    return { ctrl, how };
  }

  P.analyze = function (st) {
    const E = st.entities, ids = Object.keys(E);
    const holders = {}, held = {}, capSum = {}, voteSum = {}, selfCap = {};
    ids.forEach(i => { holders[i] = []; held[i] = []; capSum[i] = 0; voteSum[i] = 0; selfCap[i] = 0; });
    st.links.forEach(l => {
      if (!E[l.from] || !E[l.to]) return;
      const v = l.votes == null ? l.capital : l.votes;
      holders[l.to].push({ from: l.from, cap: l.capital, votes: v, link: l });
      held[l.from].push({ to: l.to, cap: l.capital, votes: v, link: l });
      capSum[l.to] += l.capital; voteSum[l.to] += v;
      if (l.from === l.to) selfCap[l.to] += l.capital;
    });

    const blocks = [], blockById = {};
    /* le public / flottant est dispersé : il vote, mais ne forme jamais un bloc de contrôle */
    const passive = new Set(ids.filter(i => E[i].type === 'public'));
    ids.forEach(i => { const b = { id: i, kind: 'entity', members: [i], name: E[i].name, passive: passive.has(i) }; blocks.push(b); blockById[i] = b; });
    (st.concerts || []).forEach(c => {
      const m = Array.from(new Set(c.members)).filter(x => E[x]);
      if (m.length < 2) return;
      const b = { id: 'concert:' + c.id, kind: 'concert', members: m, name: c.name || c.id, concert: c };
      blocks.push(b); blockById[b.id] = b;
    });

    const J = P.JURIS[(st.options && st.options.droit) || P.juris] || P.JURIS.fr;
    const deFacto = !!(st.options && st.options.deFacto) && J.deFacto;
    let ctrl = null, how = null, norm = {}, supp = {}, prevSig = '';
    /* Point fixe : les voix des actions d'autocontrôle (détenues par la société elle-même
     * ou par une société qu'elle contrôle) sont neutralisées (art. L233-31, L225-210). */
    for (let pass = 0; pass < 8; pass++) {
      norm = {}; supp = {};
      ids.forEach(C => {
        const set = new Set(); let tot = 0;
        holders[C].forEach(h => {
          if (h.from === C || (ctrl && ctrl[C] && ctrl[C].has(h.from))) { set.add(h.from); tot += h.votes; }
        });
        const base = 100 - tot;
        norm[C] = {};
        holders[C].forEach(h => { norm[C][h.from] = (set.has(h.from) || base <= 1e-9) ? 0 : h.votes * 100 / base; });
        supp[C] = { total: tot, set };
      });
      const r = computeControl(blocks, ids, holders, norm, deFacto, passive);
      ctrl = r.ctrl; how = r.how;
      const sig = blocks.map(b => b.id + ':' + Array.from(ctrl[b.id]).sort().join(',')).join('|');
      if (sig === prevSig) break;
      prevSig = sig;
    }

    const controllersOf = {};
    ids.forEach(C => { controllersOf[C] = blocks.filter(b => !b.members.includes(C) && ctrl[b.id].has(C)); });
    const ultimate = {};
    ids.forEach(C => {
      const cs = controllersOf[C];
      if (!cs.length) { ultimate[C] = null; return; }
      const top = cs.filter(b => b.kind === 'entity' && !controllersOf[b.id].length);
      let pick, type;
      if (top.length) { pick = top[0]; type = 'exclusif'; }
      else {
        const conc = cs.filter(b => b.kind === 'concert');
        if (conc.length) { pick = conc[0]; type = 'conjoint'; }
        else { pick = cs[0]; type = 'exclusif'; }
      }
      ultimate[C] = { block: pick, type, how: how[pick.id][C] };
    });

    /* Intérêts économiques : somme sur les chemins du produit des % de capital
     * (les actions auto-détenues sont exclues de la base). */
    const interest = {};
    ids.forEach(Eid => {
      const x = {}; ids.forEach(i => { x[i] = 0; }); x[Eid] = 1;
      for (let it = 0; it < 400; it++) {
        let d = 0;
        for (const C of ids) {
          if (C === Eid) continue;
          const base = 100 - selfCap[C]; let s = 0;
          if (base > 1e-9) for (const h of holders[C]) { if (h.from !== C) s += x[h.from] * h.cap / base; }
          d = Math.max(d, Math.abs(s - x[C])); x[C] = s;
        }
        if (d < 1e-11) break;
      }
      interest[Eid] = x;
    });

    const an = { ids, holders, held, capSum, voteSum, selfCap, blocks, blockById, ctrl, how, norm, supp, controllersOf, ultimate, interest, deFacto };
    an.pct = (bid, C) => {
      if (!ctrl[bid] || !holders[C]) return 0;
      let s = 0; for (const h of holders[C]) if (ctrl[bid].has(h.from)) s += norm[C][h.from]; return s;
    };
    an.interestOf = (bid, C) => {
      const b = blockById[bid]; if (!b) return 0;
      if (b.kind === 'entity') return interest[bid][C] || 0;
      return Math.min(1, b.members.reduce((s, m) => s + (m === C ? 0 : (interest[m][C] || 0)), 0));
    };
    an.controlled = bid => {
      const b = blockById[bid]; if (!b) return [];
      return Array.from(ctrl[bid]).filter(x => !b.members.includes(x));
    };
    an.path = (bid, C) => {
      const b = blockById[bid]; if (!b || !ctrl[bid].has(C)) return [];
      const prev = {}, q = [];
      b.members.forEach(m => { prev[m] = null; q.push(m); });
      while (q.length) {
        const u = q.shift();
        if (u === C) break;
        for (const h of held[u]) {
          if (h.to in prev || !ctrl[bid].has(h.to)) continue;
          prev[h.to] = u; q.push(h.to);
        }
      }
      if (!(C in prev)) return [];
      const p = []; let u = C;
      while (u != null) { p.unshift(u); u = prev[u]; }
      return p;
    };
    /** Blocs de vote dans C, regroupés par contrôleur ultime de chaque actionnaire direct */
    an.blocs = C => {
      const m = new Map();
      for (const h of holders[C]) {
        if (supp[C].set.has(h.from)) continue;
        const u = ultimate[h.from];
        const b = u ? u.block : blockById[h.from];
        const cur = m.get(b.id) || { block: b, pct: 0 };
        cur.pct += norm[C][h.from];
        m.set(b.id, cur);
      }
      return Array.from(m.values()).map(x => Object.assign(x, { interest: an.interestOf(x.block.id, C) })).sort((a, b) => b.pct - a.pct);
    };
    return an;
  };

  /* ------------------------------------------------------------ disposition automatique */
  P.layout = function (st) {
    const E = st.entities, ids = Object.keys(E);
    if (!ids.some(i => !E[i].fixed)) return;
    const out = {}, indeg = {};
    ids.forEach(i => { out[i] = []; indeg[i] = 0; });
    st.links.forEach(l => { if (l.from !== l.to && E[l.from] && E[l.to]) { out[l.from].push(l.to); indeg[l.to]++; } });
    const mark = {}, back = new Set();
    const dfs = u => { mark[u] = 1; for (const v of out[u]) { if (mark[v] === 1) back.add(u + '>' + v); else if (!mark[v]) dfs(v); } mark[u] = 2; };
    ids.filter(i => !indeg[i]).forEach(i => { if (!mark[i]) dfs(i); });
    ids.forEach(i => { if (!mark[i]) dfs(i); });
    const edges = [];
    ids.forEach(u => out[u].forEach(v => { if (!back.has(u + '>' + v)) edges.push([u, v]); }));
    const lvl = {}; ids.forEach(i => { lvl[i] = 0; });
    for (let it = 0; it <= ids.length; it++) {
      let ch = false;
      edges.forEach(([u, v]) => { if (lvl[v] < lvl[u] + 1) { lvl[v] = lvl[u] + 1; ch = true; } });
      if (!ch) break;
    }
    // les actionnaires « racines » descendent juste au-dessus de leur première participation
    ids.forEach(u => {
      if (edges.some(e => e[1] === u)) return;
      const ch = edges.filter(e => e[0] === u).map(e => lvl[e[1]]);
      if (ch.length) lvl[u] = Math.max(0, Math.min.apply(null, ch) - 1);
    });
    const layers = {};
    ids.forEach(i => { (layers[lvl[i]] = layers[lvl[i]] || []).push(i); });
    const keys = Object.keys(layers).map(Number).sort((a, b) => a - b);
    const DX = 240, DY = 175, pos = {};
    const place = k => { const L = layers[k], w = (L.length - 1) * DX; L.forEach((id, j) => { pos[id] = { x: j * DX - w / 2, y: k * DY }; }); };
    keys.forEach(place);
    const bary = (id, up) => {
      const ns = up ? edges.filter(e => e[1] === id).map(e => e[0]) : edges.filter(e => e[0] === id).map(e => e[1]);
      if (!ns.length) return null;
      return ns.reduce((s, n) => s + pos[n].x, 0) / ns.length;
    };
    for (let sweep = 0; sweep < 4; sweep++) {
      const up = sweep % 2 === 0;
      (up ? keys : keys.slice().reverse()).forEach(k => {
        const b = {};
        layers[k].forEach(id => { const v = bary(id, up); b[id] = v == null ? pos[id].x : v; });
        layers[k].sort((a, c) => b[a] - b[c]);
        place(k);
      });
    }
    ids.forEach(id => { if (!E[id].fixed) { E[id].x = pos[id].x; E[id].y = pos[id].y; } });
  };
})();
