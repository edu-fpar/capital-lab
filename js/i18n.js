/* ============================================================
 * Capital Lab — langue de l'interface (français / anglais / espagnol).
 * Chargé en premier. Les chaînes sont écrites en français dans le code
 * et traduites par P.t() à partir des dictionnaires P.I18N.en et P.I18N.es
 * (js/i18n-en.js, js/i18n-es.js). Une chaîne absente reste en français.
 *
 *   P.t('Nouveau')                          → 'New'
 *   P.t('contrôle {n} entité(s)', { n: 3 }) → 'controls 3 entity(ies)'
 *
 * Langue : ?lang=fr|en|es, sinon choix mémorisé (capital-lab.lang),
 * sinon langue du navigateur (français, espagnol, sinon anglais).
 * ============================================================ */
(function () {
  'use strict';
  const P = window.P = window.P || {};
  P.I18N = P.I18N || {};
  P.LANGS = { fr: 'Français', en: 'English', es: 'Español' };
  const KEY = 'capital-lab.lang';

  let lang = null;
  try {
    const q = typeof location !== 'undefined' ? new URLSearchParams(location.search).get('lang') : null;
    if (q && P.LANGS[q]) { lang = q; try { localStorage.setItem(KEY, q); } catch (e) { /* */ } }
    if (!lang) { const s = localStorage.getItem(KEY); if (P.LANGS[s]) lang = s; }
  } catch (e) { /* stockage ou adresse indisponible */ }
  if (!lang && typeof navigator !== 'undefined') {
    const n = (navigator.language || 'fr').toLowerCase();
    lang = n.startsWith('fr') ? 'fr' : n.startsWith('es') ? 'es' : 'en';
  }
  P.lang = lang || 'fr';
  P.locale = { fr: 'fr-FR', en: 'en-GB', es: 'es-ES' }[P.lang];
  if (typeof document !== 'undefined') document.documentElement.lang = P.lang;

  const fill = (s, v) => v ? String(s).replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m)) : s;
  P.t = function (s, vars) {
    if (P.lang !== 'fr') { const d = P.I18N[P.lang] || {}; if (d[s] != null) return fill(d[s], vars); }
    return fill(s, vars);
  };

  /** Change de langue : la page est rechargée (les textes sont calculés au chargement). */
  P.setLang = function (l) {
    if (!P.LANGS[l]) return;
    try { localStorage.setItem(KEY, l); localStorage.removeItem('capital-lab.droit'); } catch (e) { /* */ }
    const u = new URL(location.href);
    u.searchParams.set('lang', l);
    // un scénario d'une autre langue n'a pas de sens après le changement : on revient à l'accueil
    ['scenario', 'etape', 'step', 'md'].forEach(k => u.searchParams.delete(k));
    u.hash = '';
    location.href = u.toString();
  };

  /** Traduit le HTML statique (index.html) : textes et attributs title / placeholder / aria-label. */
  P.translateDom = function (root) {
    if (P.lang === 'fr' || typeof document === 'undefined') return;
    root = root || document.body;
    const d = P.I18N[P.lang] || {};
    const tr = s => { const k = s.trim(); return k && d[k] != null ? s.replace(k, d[k]) : s; };
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => (n.parentNode && /^(SCRIPT|STYLE|TEXTAREA)$/.test(n.parentNode.nodeName)) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    const nodes = []; let n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(t => { const v = tr(t.nodeValue); if (v !== t.nodeValue) t.nodeValue = v; });
    root.querySelectorAll('[title],[placeholder],[aria-label]').forEach(el => {
      ['title', 'placeholder', 'aria-label'].forEach(a => { if (el.hasAttribute(a)) el.setAttribute(a, tr(el.getAttribute(a))); });
    });
  };
})();
