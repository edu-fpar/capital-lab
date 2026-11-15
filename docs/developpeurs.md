# Développeurs

## Architecture

Application statique, sans dépendance ni compilation. Les scripts sont chargés dans cet ordre par `index.html` et partagent l'objet global `P` (moteur) et `App` (interface).

| Fichier | Rôle |
|---|---|
| `js/model.js` | types d'entités, état, **moteur d'analyse** (`P.analyze`) : voix effectives, autocontrôle, contrôle en chaîne, concert, contrôle de fait, contrôleur ultime, intérêts ; disposition automatique (`P.layout`) |
| `js/scenario.js` | tokeniseur et **commandes** (`P.runCommand`), lecture des scénarios (`P.parseScenario`, `P.buildState`), export du studio (`P.toCommands`), mini-rendu markdown (`P.md`) |
| `js/docs.js` | aide intégrée, spécification du format (`P.FORMAT_DOC`), prompt IA |
| `js/library.js` | scénarios intégrés (`P.LIBRARY`) |
| `js/app.js` | canevas SVG et animations, interactions, inspecteur, lecteur cinéma, studio, modales |
| `css/app.css` | styles |

### Principes

- **L'état** (`App.state`) est un objet JSON : `entities`, `links` (`from`, `to`, `capital`, `votes` — `null` = égal au capital), `concerts`, `options`, `view` (point de vue, focus, bulles). Toute modification passe par `App.commit()`, qui relance l'analyse et le rendu.
- **En mode cinéma**, l'état de l'étape *n* est reconstruit en rejouant les commandes des étapes 0 à *n* (`P.buildState`). Revenir en arrière est donc exact. Les déplacements manuels faits pendant la présentation sont stockés à part (`App.cinePos`, `App.noteOff`) et appliqués après la disposition automatique.
- **Le rendu** reconstruit le SVG à chaque image tant qu'une animation est en cours ; les positions affichées (`App.disp`) glissent vers les positions cibles.

## Ajouter un scénario intégré

Ajoutez un objet `{ id, md }` à `P.LIBRARY` dans `js/library.js`. Dans ce fichier, les blocs de commandes s'écrivent `~~~scene` (et non avec des accents graves, qui fermeraient la chaîne JavaScript), et le texte ne doit contenir ni accent grave ni `${`.

Vérifiez-le ensuite :

```bash
node tools/build.js
node skill/scenario-capital-lab/scripts/verifier.js docs/scenarios/<id>.md
```

## Synchroniser la documentation et la skill

`tools/build.js` régénère, à partir du code :
- `docs/format-scenario.md` (depuis `P.FORMAT_DOC`) et `docs/scenarios/*.md` ;
- `docs/instructions-ia.md`, la page à donner à n'importe quelle IA : mission (texte dans `tools/build.js`) + format + règles de calcul + exemple ;
- les références de la skill (`format.md`, `regles-de-calcul.md` copiée depuis `docs/`, `exemple.md`) ;
- la copie du moteur dans `skill/scenario-capital-lab/scripts/lib/`.

À relancer après toute modification du moteur, du format ou des scénarios. Puis, pour reconstruire le fichier installable de la skill (archive zip du dossier, extension `.skill`) :

```bash
python tools/package_skill.py
```

## Captures d'écran

Les captures de la documentation (`docs/images/*.jpg`) sont produites par un script, pour pouvoir les refaire quand l'interface change :

```bash
node tools/screenshots.js
```

Il pilote Microsoft Edge ou Chrome sans fenêtre (variable `BROWSER` pour un autre chemin), sans rien installer. Chaque capture est décrite dans le tableau `SHOTS` du script : page, taille (écran ou téléphone), thème jour ou nuit, et mise en scène (étape, question révélée, carte retournée…). L'aide de l'atelier réutilise deux de ces images.

## Documentation

Ce site utilise [Docsify](https://docsify.js.org) 4.13.1, chargé depuis un CDN : chaque page est un simple fichier `.md` de `docs/`, et la barre latérale est `docs/_sidebar.md`. Le fichier `.nojekyll` à la racine est indispensable : sans lui, GitHub Pages ignore les fichiers commençant par `_`, et la barre latérale disparaît. L'encart « Préparer son cours avec une IA » est du HTML dans le markdown ; ses boutons sont gérés par le script de `docs/index.html`. Le fichier `llms.txt` à la racine oriente les IA qui explorent le site. La page `regles-de-calcul.md` sert aussi de référence à la skill : gardez-la exacte.
