/* Capital Lab – vidéo de présentation (intro.html) dans l'application.
 *
 * - Bouton « 🎬 Intro » dans le bandeau, à côté de l'aide : revoir la vidéo à tout moment.
 * - Première visite : la vidéo s'ouvre d'elle-même, une seule fois (clé capital-lab.introSeen).
 *   Jamais quand on arrive par un lien précis (?scenario=, ?md=, ?scenarios, #md=…), ni dans
 *   un paquet SCORM, ni avec ?intro=0, ni sous un navigateur piloté (captures, tests).
 * - La vidéo est affichée dans une iframe (intro.html?embed=app), dans la langue du navigateur
 *   (ou celle choisie la dernière fois dans la vidéo), en 9:16 sur un téléphone tenu droit.
 *   Elle demande sa fermeture par postMessage ({ capitalLab: "intro-close" }) :
 *   bouton « Passer l'introduction », « Commencer » ou Échap.
 */
(function (global) {
  'use strict';
  if (global.CAPITAL_LAB_EMBED || document.body.classList.contains('embed')) return; // paquet SCORM : pas de vidéo

  const KEY = 'capital-lab.introSeen';
  const tr = s => (global.P && global.P.t ? global.P.t(s) : s);
  let overlay = null, opener = null;

  function lang() {
    if (global.P && global.P.lang) return global.P.lang;   // langue de l'interface (js/i18n.js)
    let l = null;
    try { l = global.localStorage.getItem('anim-kit:lang'); } catch (e) { /* stockage indisponible */ }
    l = l || (global.navigator.language || 'fr').slice(0, 2);
    return ['fr', 'en', 'es'].includes(l) ? l : 'en';
  }

  function open(from) {
    if (overlay) return;
    opener = from || document.activeElement;
    try { global.localStorage.setItem(KEY, '1'); } catch (e) { /* stockage indisponible */ }
    overlay = document.createElement('div');
    overlay.className = 'intro-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', tr('Vidéo de présentation'));
    overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;background:#060a17';
    const portrait = global.innerHeight > global.innerWidth * 1.15;
    const frame = document.createElement('iframe');
    frame.src = 'intro.html?embed=app&lang=' + lang() + (portrait ? '&format=9x16' : '');
    frame.title = tr('Vidéo de présentation');
    frame.allow = 'autoplay; fullscreen';
    frame.style.cssText = 'width:100%;height:100%;border:0;display:block;background:transparent';
    overlay.appendChild(frame);
    document.body.appendChild(overlay);
    document.documentElement.style.overflow = 'hidden';
    frame.addEventListener('load', () => { try { frame.contentWindow.focus(); } catch (e) { /* rien */ } });
  }

  function close() {
    if (!overlay) return;
    overlay.remove(); overlay = null;
    document.documentElement.style.overflow = '';
    if (opener && opener.focus) opener.focus();
  }

  global.addEventListener('message', (e) => {
    const same = e.origin === global.location.origin || (global.location.protocol === 'file:' && e.origin === 'null');
    if (same && e.data && e.data.capitalLab === 'intro-close') close();
  });
  global.addEventListener('keydown', (e) => { if (overlay && e.key === 'Escape') close(); });

  function addButton() {
    const help = document.getElementById('btn-help');
    if (!help || document.getElementById('btn-intro')) return;
    const b = document.createElement('button');
    b.type = 'button'; b.id = 'btn-intro';
    b.title = tr('Revoir la vidéo de présentation');
    b.innerHTML = '🎬<span class="lbl"> Intro</span>';
    b.addEventListener('click', () => open(b));
    help.parentNode.insertBefore(b, help);
  }

  function shouldAutoOpen() {
    try { if (global.localStorage.getItem(KEY)) return false; } catch (e) { return false; }
    if (global.navigator.webdriver) return false;
    if (global.location.hash && global.location.hash.length > 1) return false;
    const p = new URLSearchParams(global.location.search);
    return !['scenario', 'md', 'scenarios', 'bibliotheque', 'etape', 'step'].some((k) => p.has(k)) && p.get('intro') !== '0';
  }

  function start() { addButton(); if (shouldAutoOpen()) open(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  global.CapitalLabIntro = { open, close };
})(window);
