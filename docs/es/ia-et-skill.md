# Preparar la clase con una IA

Dos posibilidades: cualquier IA con la página de instrucciones, o Claude con la skill, que además comprueba las cifras.

## 1. Con cualquier IA

<div class="ai-box">
<ol class="ai-steps">
<li><strong>Copie la consigna.</strong> Ya contiene el enlace a las instrucciones para la IA. El texto se puede modificar: adapte el público o el número de pasos antes de copiarlo.
<div class="ai-prompt js-ia-prompt" contenteditable="true" spellcheck="false" title="Texto modificable">Lee las instrucciones en <span class="js-ia-url">https://edu-fpar.github.io/capital-lab/docs/es/instructions-ia.md</span> y prepara un escenario de Capital Lab (derecho español) a partir del curso siguiente (o del archivo adjunto). Público: 3.º del Grado en Derecho, unos 6 pasos, con una o dos preguntas para el aula.</div>
<button class="ai-btn big" data-copy-sel=".js-ia-prompt">📋 Copiar la consigna</button></li>
<li><strong>Péguela en su IA</strong> (ChatGPT, Claude, Gemini, Mistral, Copilot…) y añada su curso: texto pegado a continuación o archivo adjunto.</li>
<li><strong>Copie la respuesta de la IA</strong> y péguela en el <a href="https://edu-fpar.github.io/capital-lab/?lang=es&scenarios" target="_blank" rel="noopener">taller</a>: 🎬 Cine → 📚 Escenarios → Iniciar. Puede pegar la respuesta completa.</li>
</ol>
<details class="ai-more"><summary>¿Su IA no puede abrir enlaces?</summary>
<p>Copie en su lugar la versión completa: las instrucciones y la consigna reunidas en un solo texto. Péguela en su IA y añada su curso.</p>
<button class="ai-btn warn" data-copy-full="es/instructions-ia.md">📄 Copiar la versión completa</button> <a class="ai-link" href="es/instructions-ia.md" target="_blank" rel="noopener">ver las instrucciones</a>
</details>
<p class="ai-note">💡 ¿Usa Claude? La <a href="#/es/ia-et-skill">skill de Capital Lab</a> comprueba además cada cifra con el motor del taller.</p>
<p class="ai-note js-ia-local" hidden>ℹ️ Está consultando esta documentación en local: la consigna apunta a la versión publicada, que una IA en línea puede leer.</p>
</div>

La consigna pide un escenario de **derecho español**: la IA debe empezar el escenario con el encabezado `droit: es`, para que el taller aplique los umbrales y las referencias de la Ley de Sociedades de Capital.

Una IA generalista no puede ejecutar el motor del taller: **revise las cifras** del comentario comparándolas con lo que muestra el taller (haga clic en una entidad para ver su análisis). Los avisos de sintaxis aparecen bajo el comentario. Revise también las **referencias legales**: las IA tienden a confundir la normativa española con la francesa (por ejemplo, la presunción de control con el 40 % de los votos, que no existe en derecho español).

Las IA que exploran un sitio web también pueden partir del archivo [`llms.txt`](https://edu-fpar.github.io/capital-lab/llms.txt ':ignore'), que apunta a las páginas útiles.

## 2. Con Claude: la skill «scenario-capital-lab» (recomendado)

Una *skill* es un manual de uso que Claude carga automáticamente cuando la petición tiene que ver con él. Esta enseña a Claude a:
1. leer su **material de clase** (PDF, diapositivas, apuntes, caso práctico);
2. quedarse con las nociones que la herramienta sabe **representar** y dejar de lado, avisándole, las que no puede mostrar correctamente;
3. escribir un escenario progresivo que retome **sus ejemplos y sus cifras**;
4. **reproducirlo con el motor real del taller** para comprobar que los controles y los porcentajes anunciados en el comentario coinciden con los que se mostrarán;
5. entregarle el archivo `.md`, con la lista de lo que conviene revisar (referencias jurídicas añadidas, simplificaciones).

Las referencias a artículos de ley o de normas solo se añaden si figuran en su material o son seguras; las simplificaciones se señalan en el escenario.

> ⚠️ La skill está redactada en francés y sus referencias (formato, reglas de cálculo, ejemplo) son las del derecho francés. Si le pide un escenario de derecho español, indíquelo expresamente (encabezado `droit: es`) y adjunte, si es posible, la página [Reglas de cálculo](regles-de-calcul.md) en español.

### Instalar la skill

El archivo que hay que instalar es [`skill/scenario-capital-lab.skill`](https://edu-fpar.github.io/capital-lab/skill/scenario-capital-lab.skill ':ignore'). Es un archivo comprimido de la carpeta `skill/scenario-capital-lab/`.

- **Claude (aplicación web o de escritorio)**: en la configuración, apartado de habilidades (*Skills*), importe este archivo. La ejecución de código debe estar permitida para que funcione la comprobación.
- **Claude Code**: copie la carpeta `skill/scenario-capital-lab/` en `~/.claude/skills/` (para usted) o en `.claude/skills/` de un proyecto.

La comprobación utiliza Node.js. Si el entorno no dispone de él, Claude rehace los cálculos a mano y se lo indica.

### Usarla

Adjunte su material y pida, por ejemplo:

> Este es mi tema sobre los grupos de sociedades. Prepárame un escenario de derecho español para la herramienta Capital Lab para corregir el caso práctico en clase, en unos 6 pasos.

> A partir de estas diapositivas sobre los pactos parasociales, prepara una animación paso a paso para mis alumnos de 3.º de Derecho (derecho español).

Recibirá un archivo `.md` para abrir en el taller: modo 🎬 Cine → 📚 Escenarios → abrir el archivo, o soltar el archivo sobre la ventana.

**Ejemplo real** (en francés): a partir de este [material de clase sobre los grupos de sociedades](../exemples-ia/support-cours-groupes.md), la skill produjo este [escenario del grupo Vallon](../exemples-ia/scenario-groupe-vallon.md), verificado sin errores por el motor.

### Contenido de la skill

| Archivo | Función |
|---|---|
| `SKILL.md` | el método: leer, elegir, construir, comprobar, entregar |
| `references/format.md` | la sintaxis de los escenarios |
| `references/regles-de-calcul.md` | lo que calcula el motor y lo que no representa |
| `references/exemple.md` | un escenario modelo (la pirámide de sociedades holding) |
| `scripts/verifier.js` | reproduce un escenario con el motor y muestra los resultados paso a paso |
| `scripts/lib/` | copia del motor del taller |

El verificador también puede usarse sin IA, para comprobar un escenario escrito a mano:

```bash
node skill/scenario-capital-lab/scripts/verifier.js mi-escenario.md
```
