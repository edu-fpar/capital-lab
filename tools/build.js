#!/usr/bin/env node
/*
 * Synchronise la documentation et la skill avec le code de l'application.
 * Usage (depuis le dossier du projet) : node tools/build.js
 *
 *  - docs/format-scenario.md            ← P.FORMAT_DOC (js/docs.js)
 *  - docs/scenarios/<id>.md             ← scénarios de js/library.js
 *  - skill/scenario-capital-lab/references/format.md, regles-de-calcul.md, exemple.md
 *  - skill/scenario-capital-lab/scripts/lib/model.js, scenario.js (moteur utilisé par verifier.js)
 */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const r = (...p) => path.join(root, ...p);
global.window = global;
['model', 'scenario', 'docs', 'library'].forEach(f => require(r('js', f + '.js')));
const P = global.P;

const write = (file, text) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, text, 'utf8'); console.log('écrit  ' + path.relative(root, file)); };
const copy = (from, to) => { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to); console.log('copié  ' + path.relative(root, to)); };
// les scénarios intégrés utilisent ~~~scene ; les fichiers publiés utilisent la forme usuelle ```scene
const toFences = md => md.replace(/^~~~scene\s*$/gm, '```scene').replace(/^~~~\s*$/gm, '```');

write(r('docs', 'format-scenario.md'), P.FORMAT_DOC);
P.LIBRARY.forEach(s => write(r('docs', 'scenarios', s.id + '.md'), toFences(s.md)));

const skill = r('skill', 'scenario-capital-lab');
write(path.join(skill, 'references', 'format.md'), P.FORMAT_DOC);
copy(r('docs', 'regles-de-calcul.md'), path.join(skill, 'references', 'regles-de-calcul.md'));
write(path.join(skill, 'references', 'exemple.md'), toFences(P.LIBRARY.find(s => s.id === 'pyramide').md));
/* Page d'instructions pour n'importe quelle IA (lisible par URL) : mission + format + règles + exemple.
 * C'est la version « sans outils » de la skill : l'IA ne peut pas lancer le vérificateur, elle refait les calculs. */
const IA_INTRO = `# Instructions pour une IA : créer un scénario Capital Lab

> Page destinée aux assistants IA (ChatGPT, Claude, Gemini, Mistral, Copilot…). Enseignant : donnez l'adresse de cette page à votre IA, avec votre cours.
> Atelier : https://edu-fpar.github.io/capital-lab/ · Documentation : https://edu-fpar.github.io/capital-lab/docs/

## Ta mission

L'enseignant te fournit un support de cours (texte, PDF, diapositives, notes, cas pratique). Tu produis un **scénario markdown** que l'atelier Capital Lab jouera en mode « cinéma » : à chaque étape, un commentaire s'affiche et des commandes construisent un schéma de participations entre sociétés, que l'outil analyse (qui contrôle quoi, par quelle chaîne, avec quel intérêt économique).

1. **Choisis ce qui se montre.** Retiens les notions qui se traduisent en structure : chaînes de détention, seuils (1/3, 50 %, 2/3, 90 %), droits de vote double, actions de préférence, pactes et action de concert, autocontrôle, holdings et LBO, périmètre de consolidation, dilution. Ce qui n'a pas de forme dans le canevas (montant d'une dette, goodwill, juste valeur, critères qualitatifs d'IFRS 10…) va dans le commentaire ou dans une bulle (\`note\`), jamais sous forme de faux lien. Si l'essentiel du support ne se représente pas, dis-le à l'enseignant plutôt que de forcer.
2. **Construis la progression.** 4 à 8 étapes, une idée par étape, du simple au complexe. Reprends les exemples, noms de sociétés et chiffres du support. Ajoute une ou deux **étapes questions** juste avant l'étape qui expliquerait la notion, avec des mauvais choix plausibles et une explication pour chaque choix.
3. **Écris le scénario** en respectant exactement le format décrit plus bas. Donne les calculs dans le texte (« 51 % × 51 % ≈ 26 % ») : l'outil affichera les mêmes valeurs.
4. **Vérifie tes chiffres** avec les règles de calcul plus bas : contrôle = plus de 50 % des voix effectives, en chaîne ; 50 % exactement ne suffit pas ; intérêt économique = produit des pourcentages de capital ; le public / flottant ne contrôle jamais ; les voix d'autocontrôle sont neutralisées. Si l'outil devait afficher autre chose que ton texte, corrige le texte ou les données.
5. **Reste exact.** Ne cite un article de loi ou un paragraphe de norme que s'il figure dans le support ou si tu en es certain. Signale les simplifications dans une citation « > ⚠️ ».

## Ta réponse

- **Un seul bloc de code** contenant le scénario complet, qui commence par « # Titre ». Comme le scénario contient lui-même des blocs \`\`\`scene, entoure-le d'un bloc à quatre accents graves (\`\`\`\`markdown … \`\`\`\`), ou écris les blocs de commandes avec ~~~scene.
- Puis, hors du bloc, quelques lignes pour l'enseignant : le plan des étapes, et ce qu'il doit relire (références ajoutées par toi, simplifications, notions laissées de côté).
- Rappelle-lui comment l'utiliser : atelier Capital Lab → 🎬 Cinéma → 📚 Scénarios → coller le markdown → Lancer. Le bouton 🔗 Partager donne ensuite un lien à transmettre aux élèves.

---

`;
write(r('docs', 'instructions-ia.md'), IA_INTRO + P.FORMAT_DOC.replace(/^# /, '# Annexe 1 — ') + '\n\n---\n\n' +
  fs.readFileSync(r('docs', 'regles-de-calcul.md'), 'utf8').replace(/^# /, '# Annexe 2 — ') + '\n\n---\n\n' +
  '# Annexe 3 — Exemple complet\n\nUn scénario réel de l\'atelier (la pyramide de holdings), avec une étape question :\n\n````markdown\n' +
  toFences(P.LIBRARY.find(s => s.id === 'pyramide').md).trim() + '\n````\n');

copy(r('js', 'model.js'), path.join(skill, 'scripts', 'lib', 'model.js'));
copy(r('js', 'scenario.js'), path.join(skill, 'scripts', 'lib', 'scenario.js'));
console.log('\nTerminé. Pour produire le fichier installable de la skill : voir docs/developpeurs.md');
