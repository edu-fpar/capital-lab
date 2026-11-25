# Developers

The full developer documentation is in French: [Développeurs](../developpeurs.md). This page summarises it, with what concerns the English version.

## Architecture

A static application, with no dependencies and no build step. The scripts are loaded by `index.html` and share the global objects `P` (engine) and `App` (interface).

| File | Role |
|---|---|
| `js/model.js` | entity types, state, **analysis engine** (`P.analyze`): effective votes, neutralised votes, chained control, concert parties, ultimate controller, interests; threshold categories; automatic layout (`P.layout`) |
| `js/scenario.js` | tokenizer and **commands** (`P.runCommand`, with French, English and Spanish keywords), scenario parsing (`P.parseScenario`, `P.buildState`, front matter such as `droit: uk`), studio export (`P.toCommands`), mini markdown renderer (`P.md`) |
| `js/docs.js` | built-in help, format specification (`P.FORMAT_DOC`), AI prompt, in French |
| `js/docs-en.js` | the same texts in English (`P.DOCS_I18N.en`: `HELP_LIBRE`, `HELP_CINEMA`, `HELP_THANKS`, `IA_INSTRUCTIONS_URL`, `IA_CONSIGNE`, `noLink`, `FORMAT_DOC`, `AI_PROMPT`) |
| `js/library.js`, `js/library-uk.js`, `js/library-us.js` | built-in scenarios (`P.LIBRARY`); English scenarios carry `lang: 'en'` and `droit: 'uk'` or `'us'` |
| `js/app.js` | SVG canvas and animations, interactions, inspector, cinema player, studio, dialogs |
| `js/scorm.js`, `js/scorm-runtime.js` | SCORM export and runtime |
| `css/app.css` | styles |

The state (`App.state`) is a JSON object: `entities`, `links` (`from`, `to`, `capital`, `votes` — `null` = equal to capital), `concerts`, `options`, `view`. In cinema mode, the state of step *n* is rebuilt by replaying the commands of steps 0 to *n*, so going back is exact.

## Adding a built-in scenario

Add an object `{ id, lang, droit, md }` to `P.LIBRARY` in the library file for that law (`uk-…` or `us-…` ids). In these files, command blocks are written `~~~scene` (backticks would close the JavaScript string), and the text must contain neither a backtick nor `${`. Start the markdown with the front matter `droit: uk` or `droit: us`, and never use `regle 40` outside French law.

Check it with the engine:

```bash
node skill/scenario-capital-lab/scripts/verifier.js my-scenario.md
```

## English documentation

The pages of `docs/en/` have the same file names as the French pages of `docs/`. Two of them are derived from code and texts:
- `docs/en/format-scenario.md` is a copy of `P.DOCS_I18N.en.FORMAT_DOC` (`js/docs-en.js`);
- `docs/en/instructions-ia.md` is the page given to any AI: mission + format (`FORMAT_DOC`) + calculation rules (`docs/en/regles-de-calcul.md`, without images) + a complete example under UK law.

Keep them in sync when the format or the rules change (see `tools/build.js` for the French equivalent). `regles-de-calcul.md` is also a reference for AIs: keep it accurate.

Screenshots (`docs/images/*.jpg`) are produced by `node tools/screenshots.js` and currently show the French interface. The site uses [Docsify](https://docsify.js.org) 4.13.1; the sidebar of this section is `docs/en/_sidebar.md`.
