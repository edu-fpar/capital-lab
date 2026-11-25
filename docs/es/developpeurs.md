# Desarrolladores

La documentación técnica completa está en francés: [Développeurs](../developpeurs.md). Esta página resume lo esencial y lo propio de la versión española.

## Arquitectura

Aplicación estática, sin dependencias ni compilación. `index.html` carga los scripts, que comparten el objeto global `P` (motor) y `App` (interfaz).

| Archivo | Función |
|---|---|
| `js/model.js` | tipos de entidades, estado, **motor de análisis** (`P.analyze`): votos efectivos, autocartera, control en cadena, concierto, controlador último, intereses; disposición automática (`P.layout`) |
| `js/scenario.js` | tokenizador y **comandos** (`P.runCommand`, con los alias españoles `persona`, `sociedad`, `vinculo`, `vista`, `resaltar`…), lectura de los escenarios (`P.parseScenario`, `P.buildState`), exportación del estudio, mini-renderizado markdown |
| `js/docs.js` | ayuda integrada, formato (`P.FORMAT_DOC`), prompt para IA, en francés |
| `js/docs-es.js` | los mismos textos en español (`P.DOCS_I18N.es`): `HELP_LIBRE`, `HELP_CINEMA`, `HELP_THANKS`, `IA_INSTRUCTIONS_URL`, `IA_CONSIGNE`, `noLink`, `FORMAT_DOC`, `AI_PROMPT` |
| `js/library.js`, `js/library-es.js` | escenarios integrados (`P.LIBRARY`); los españoles llevan `lang: 'es'`, `droit: 'es'` y un identificador `es-…` |
| `js/app.js` | lienzo SVG y animaciones, interacciones, inspector, reproductor del modo cine, estudio, ventanas |
| `js/scorm.js`, `js/scorm-runtime.js` | exportación SCORM |

## Idioma y derecho

- Idioma: `?lang=es`, si no la elección guardada (`capital-lab.lang`), si no el idioma del navegador.
- Derecho: la interfaz española aplica `es` (Ley de Sociedades de Capital). Un escenario impone su derecho con el encabezado `droit: es`. Umbrales, claves de categoría y referencias legales: véase [Reglas de cálculo](regles-de-calcul.md).
- La regla del control de hecho del 40 % es exclusiva del derecho francés: nunca debe aparecer `regle 40 on` en un escenario español.

## Añadir un escenario español integrado

Añada un objeto `` { id: 'es-…', lang: 'es', droit: 'es', md: `…` } `` a `P.LIBRARY` en `js/library-es.js`; el markdown empieza por el encabezado `droit: es`. En ese archivo, los bloques de comandos se escriben `~~~scene` (y no con acentos graves, que cerrarían la cadena JavaScript), y el texto no debe contener acentos graves ni `${`. Las cifras del texto deben coincidir con lo que calcula el motor:

```bash
node skill/scenario-capital-lab/scripts/verifier.js mi-escenario.md
```

## Esta documentación

Las páginas de `docs/es/` tienen los mismos nombres de archivo que las francesas y reutilizan las capturas de `docs/images/` (interfaz francesa). `node tools/build.js` regenera `docs/es/format-scenario.md` (a partir de `P.DOCS_I18N.es.FORMAT_DOC`) y `docs/es/scenarios/<id>.md` (a partir de `js/library-es.js`). `docs/es/instructions-ia.md` reúne la misión para la IA, el formato, las reglas de cálculo y un ejemplo verificado; por ahora no se regenera automáticamente: si cambia `js/docs-es.js` o `docs/es/regles-de-calcul.md`, actualícela también.
