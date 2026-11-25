/* ============================================================
 * Documentación integrada en español (derecho español) :
 * ayuda rápida, formato de los escenarios, prompt para una IA.
 * Se carga después de js/docs.js.
 * ============================================================ */
window.P = window.P || {};
P.DOCS_I18N = P.DOCS_I18N || {};
(function () {
  const IA_URL = 'https://edu-fpar.github.io/capital-lab/docs/es/instructions-ia.md';

  const FORMAT_DOC = `# Formato de los escenarios del modo cine

Un escenario es un archivo **markdown** corriente. La herramienta lo divide en **pasos** (uno por cada título de nivel 2) y ejecuta, en cada paso, los **comandos** de los bloques \`scene\`.

## Estructura

~~~
---
droit: es
---
# Título del escenario
> Una frase de descripción (opcional).

Texto de introducción (opcional: se convierte en el primer paso).

## 1. Título del primer paso
Comentario en markdown: **negrita**, *cursiva*, listas, tablas, citas…
Se puede citar una entidad por su identificador: [[FAM]].

\`\`\`scene
persona FAM "Familia García"
holding H1 "García Participaciones"
vinculo FAM -> H1 51%
resaltar H1
\`\`\`

## 2. Título del paso siguiente
…
~~~

Reglas:
- el encabezado \`droit: es\` (entre dos líneas \`---\`, al principio del archivo) indica que el escenario se analiza con el **derecho español**: umbrales, leyenda y referencias legales de la Ley de Sociedades de Capital;
- los pasos son **acumulativos**: cada paso parte del estado del anterior;
- \`resaltar\`, \`nota\` y \`seleccionar\` solo valen para el paso en el que se escriben; \`vista\` sigue activa hasta \`vista ninguna\`;
- los bloques pueden escribirse \`\`\`scene o ~~~scene (alias: canevas, canvas, actions, script);
- dentro de un bloque, una línea que empieza por # o // es un comentario;
- identificadores sin espacios (FAM, H1, ALFA…); nombres entre comillas;
- porcentajes: se aceptan 51%, 51, 51,5 %, 1/3 o 2/3.

## Pasos con pregunta

Un paso puede plantear una pregunta al público. Aparece entonces una ventana en la parte inferior del lienzo con la pregunta y las opciones en grandes tarjetas. El docente puede hacer clic en la opción elegida por el aula y después revela la respuesta: botón, tecla **→** o mando de presentación. Las tarjetas se colorean; al hacer clic en una tarjeta, se da la vuelta y muestra su explicación. La explicación general aparece en el panel derecho. En reproducción continua, el avance espera a que se revele la respuesta.

~~~
## Pregunta: ¿quién controla Alfa SA?
Contexto opcional, mostrado en el panel derecho.

\`\`\`scene
resaltar ALFA
\`\`\`

- [ ] Nadie
  Explicación de esta opción (líneas sangradas bajo la opción).
- [x] La familia García
  Controla la holding, que posee el 51 % de Alfa SA.
- [ ] El Fondo Delta

### Respuesta
Explicación general, mostrada tras revelar la respuesta.

\`\`\`scene
vista FAM
nota ALFA "Control a través de la cadena"
\`\`\`
~~~

Reglas:
- un paso es una pregunta si su título empieza por «Pregunta» (o «Quiz», «❓»), si contiene opciones \`- [ ]\` / \`- [x]\`, o una sección \`### Respuesta\` (también: Solución, Explicación);
- \`[x]\` marca una respuesta correcta; puede haber varias, o ninguna casilla para una **pregunta abierta**;
- el texto de la pregunta es el título, sin el prefijo «Pregunta:»;
- el contexto se coloca **antes** de las opciones; las líneas sangradas (o con «>») justo debajo de una opción son su explicación;
- los comandos situados **después** de \`### Respuesta\` solo se ejecutan al revelar la respuesta, lo que permite mostrarla en el lienzo; siguen aplicándose en los pasos siguientes (salvo \`resaltar\`, \`nota\` y \`seleccionar\`, propios de cada paso);
- evite que el texto de los pasos anteriores adelante la respuesta.

## Comandos

| Comando | Efecto |
|---|---|
| \`persona ID "Nombre"\` | crea o modifica una persona física |
| \`sociedad ID "Nombre"\` | lo mismo para una sociedad (también: \`holding\`, \`fondo\`, \`estado\`, \`publico\`) |
| \`sociedad ID "Nombre" en 200 150\` | posición fija; sin \`en\`, disposición automática (accionistas arriba) |
| \`vinculo A -> B 51%\` | A posee el 51 % del capital y de los derechos de voto de B |
| \`vinculo A -> B 35% votes 52%\` | capital y derechos de voto distintos (la palabra \`votes\` no se traduce) |
| \`A -> B 20%\` | forma corta de \`vinculo\` |
| \`vinculo A -> A 5%\` | autocartera (acciones propias) |
| \`vinculo A -> B 0%\` o \`quitar A -> B\` | elimina la participación |
| \`quitar ID\` | elimina una entidad (o un pacto) |
| \`renombrar ID "Nuevo nombre"\` | cambia el nombre |
| \`concierto ID "Nombre del pacto" A B C\` | actuación concertada: A, B y C votan juntos (también: \`pacto\`) |
| \`vista ID\` / \`vista ninguna\` | punto de vista: interés y control de ID mostrados en todas las entidades |
| \`resaltar ID ID…\` | destaca entidades |
| \`nota ID "texto"\` | bocadillo explicativo encima de una entidad |
| \`seleccionar ID\` | muestra el análisis detallado de ID bajo el comentario |
| \`duracion 12\` | duración del paso en reproducción continua (segundos) |
| \`mover ID X Y\` | desplaza una entidad |
| \`disposition auto\` | vuelve a colocar todas las entidades en disposición automática |
| \`borrar\` | vacía el lienzo |

Una entidad citada en un \`vinculo\` sin haber sido declarada se crea automáticamente como sociedad.

Los comandos originales en francés (\`personne\`, \`societe\`, \`lien\`, \`focus\`, \`vue\`…) y en inglés (\`person\`, \`company\`, \`link\`, \`view\`…) también se aceptan. La regla \`regle 40\` (presunción de control de hecho con más del 40 %) es propia del derecho francés: no la utilice en un escenario de derecho español.

## Consejos de redacción

- De 4 a 8 pasos; cada paso añade una sola idea (una o dos entidades, uno o dos vínculos).
- Use \`resaltar\` y \`nota\` para guiar la mirada, y \`vista\` para mostrar el interés indirecto de un accionista.
- Compruebe que la suma de las participaciones en una sociedad no supera el 100 %; el resto se muestra como «otros».
- Dé las cifras clave en el comentario (p. ej., 51 % × 51 % ≈ 26 %): la herramienta las recalcula y las muestra, y el alumno puede comprobarlas.
- Con acciones de lealtad (voto doble en sociedades cotizadas), calcule la proporción de votos: 35 % del capital × 2 votos / 135 votos en total = 51,85 %. Las acciones sin voto se representan con \`votes 0%\`.
`;

  P.DOCS_I18N.es = {
    HELP_LIBRE: `- Arrastre una **entidad** de la paleta al lienzo y tire del asa **+** de un accionista hacia una sociedad.
- Haga clic en una entidad o un vínculo: **controles deslizantes** de capital / derechos de voto y **análisis** del control a la derecha.
- **👁 Punto de vista**, **🤝 Pacto**, **📸 Estudio** (convertir una construcción en escenario).`,

    HELP_CINEMA: `- **📚 Escenarios**: elegir, pegar o soltar un escenario en markdown.
- **→ / Espacio**: paso siguiente (primero revela la respuesta de una pregunta); **←**: anterior.
- **🔗 Compartir**: enlace a un paso o a un escenario. Funciona también en el móvil.
- **📦 SCORM**: paquete .zip para Moodle u otro LMS (finalización, reanudación, calificación).`,

    HELP_THANKS: `Gracias a **Tao**, cuya herramienta, ideada para mostrar a su clase de derecho financiero cómo se puede controlar una sociedad siendo minoritario en ella, está en el origen de este proyecto, y a **Yannick**, que nos transmitió la idea.`,

    IA_INSTRUCTIONS_URL: IA_URL,

    IA_CONSIGNE: `Lee las instrucciones en ` + IA_URL + ` y prepara un escenario de Capital Lab (derecho español) a partir del curso siguiente (o del archivo adjunto). Público: 3.º del Grado en Derecho, unos 6 pasos, con una o dos preguntas para el aula.`,

    /** Versión para una IA que no abre enlaces: la consigna sin el enlace, para colocarla después de las instrucciones. */
    noLink: c => c.trim().replace(/^Lee las instrucciones en \S+ y prepara/, 'Siguiendo las instrucciones anteriores, prepara'),

    FORMAT_DOC: FORMAT_DOC,

    AI_PROMPT: `Vas a redactar un escenario didáctico para una herramienta de visualización de las estructuras de participaciones entre sociedades (derecho de sociedades / derecho financiero español: Ley de Sociedades de Capital).
El escenario debe respetar EXACTAMENTE el formato descrito a continuación: un documento markdown que empieza por el encabezado
---
droit: es
---
seguido de un título de nivel 1 y de un paso por cada título de nivel 2; cada paso contiene un comentario didáctico en español y un bloque de comandos \`\`\`scene.
Los cálculos (control, intereses indirectos, colores) los hace la herramienta: tus comentarios deben dar las mismas cifras. No uses la regla del control de hecho del 40 % (\`regle 40\`), que solo existe en derecho francés. Cita un artículo solo si estás seguro. Responde únicamente con el markdown del escenario.

----- ESPECIFICACIÓN DEL FORMATO -----

` + FORMAT_DOC + `

----- TEMA SOLICITADO -----

[Describe aquí el concepto que hay que explicar, el público (p. ej., 3.º del Grado en Derecho, Derecho Mercantil) y el número de pasos deseado.]
`
  };
})();
