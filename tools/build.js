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
copy(r('js', 'model.js'), path.join(skill, 'scripts', 'lib', 'model.js'));
copy(r('js', 'scenario.js'), path.join(skill, 'scripts', 'lib', 'scenario.js'));
console.log('\nTerminé. Pour produire le fichier installable de la skill : voir docs/developpeurs.md');
