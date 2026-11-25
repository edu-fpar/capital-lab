# Instrucciones para una IA: crear un escenario de Capital Lab (derecho español)

> Página destinada a los asistentes de IA (ChatGPT, Claude, Gemini, Mistral, Copilot…). Docente: dé la dirección de esta página a su IA, junto con su curso.
> Taller: https://edu-fpar.github.io/capital-lab/?lang=es · Documentación: https://edu-fpar.github.io/capital-lab/docs/#/es/

## Tu misión

El docente te proporciona un material de clase (texto, PDF, diapositivas, apuntes, caso práctico). Produces un **escenario en markdown** que el taller Capital Lab reproducirá en «modo cine»: en cada paso se muestra un comentario y unos comandos construyen un esquema de participaciones entre sociedades, que la herramienta analiza (quién controla qué, a través de qué cadena, con qué interés económico).

El escenario se analiza con el **derecho español** (Ley de Sociedades de Capital, con la sociedad anónima como referencia y remisiones a la sociedad limitada). **Empieza siempre el escenario con este encabezado**, antes del título:

```
---
droit: es
---
```

1. **Elige lo que se puede mostrar.** Quédate con las nociones que se traducen en una estructura: cadenas de participaciones, umbrales (5 %, 30 %, 1/3, 50 %, 2/3, 90 %), acciones de lealtad con voto doble, acciones sin voto, pactos parasociales y actuación concertada, autocartera, sociedades holding y LBO, perímetro de consolidación, dilución. Lo que no tiene forma en el lienzo (importe de una deuda, fondo de comercio, valor razonable, criterios cualitativos de la NIIF 10…) va en el comentario o en un bocadillo (`nota`), nunca como un vínculo falso. Si lo esencial del material no se puede representar, díselo al docente en lugar de forzarlo.
2. **Construye la progresión.** De 4 a 8 pasos, una idea por paso, de lo simple a lo complejo. Retoma los ejemplos, los nombres de sociedades y las cifras del material. Añade uno o dos **pasos con pregunta** justo antes del paso que explicaría la noción, con opciones incorrectas verosímiles y una explicación para cada opción.
3. **Escribe el escenario** respetando exactamente el formato descrito más abajo. Escribe los comandos con sus nombres en español (`persona`, `sociedad`, `vinculo`, `vista`, `resaltar`, `nota`…). Da los cálculos en el texto («51 % × 51 % ≈ 26 %»): la herramienta mostrará los mismos valores.
4. **Comprueba tus cifras** con las reglas de cálculo de más abajo: control = más del 50 % de los votos efectivos, en cadena; el 50 % exacto no basta; interés económico = producto de los porcentajes de capital; el público / capital flotante nunca controla; los votos de la autocartera y de las acciones de la dominante en poder de sus filiales se neutralizan; los miembros de un concierto forman un solo bloque de voto. Si la herramienta fuera a mostrar algo distinto de tu texto, corrige el texto o los datos.
5. **No mezcles derechos.** La presunción de control de hecho con más del 40 % de los votos es propia del derecho francés: no escribas nunca `regle 40` / `regla 40` y no la menciones como regla española. Usa la terminología española (junta general, consejo de administración, OPA, autocartera, pacto parasocial, SA / SL).
6. **Sé exacto.** Cita un artículo de ley o un apartado de una norma solo si figura en el material o si estás seguro. Señala las simplificaciones en una cita «> ⚠️».

## Tu respuesta

- **Un único bloque de código** que contenga el escenario completo, que empiece por el encabezado `droit: es` y luego por «# Título». Como el escenario contiene a su vez bloques ```scene, rodéalo con un bloque de cuatro acentos graves (````markdown … ````), o escribe los bloques de comandos con ~~~scene.
- Después, fuera del bloque, unas líneas para el docente: el plan de los pasos y lo que debe revisar (referencias añadidas por ti, simplificaciones, nociones que se han dejado de lado).
- Recuérdale cómo usarlo: taller Capital Lab → 🎬 Cine → 📚 Escenarios → pegar el markdown → Iniciar. El botón 🔗 Compartir genera después un enlace para enviar a los alumnos.

---

# Anexo 1 — Formato de los escenarios del modo cine

Un escenario es un archivo **markdown** corriente. La herramienta lo divide en **pasos** (uno por cada título de nivel 2) y ejecuta, en cada paso, los **comandos** de los bloques `scene`.

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

```scene
persona FAM "Familia García"
holding H1 "García Participaciones"
vinculo FAM -> H1 51%
resaltar H1
```

## 2. Título del paso siguiente
…
~~~

Reglas:
- el encabezado `droit: es` (entre dos líneas `---`, al principio del archivo) indica que el escenario se analiza con el **derecho español**: umbrales, leyenda y referencias legales de la Ley de Sociedades de Capital;
- los pasos son **acumulativos**: cada paso parte del estado del anterior;
- `resaltar`, `nota` y `seleccionar` solo valen para el paso en el que se escriben; `vista` sigue activa hasta `vista ninguna`;
- los bloques pueden escribirse ```scene o ~~~scene (alias: canevas, canvas, actions, script);
- dentro de un bloque, una línea que empieza por # o // es un comentario;
- identificadores sin espacios (FAM, H1, ALFA…); nombres entre comillas;
- porcentajes: se aceptan 51%, 51, 51,5 %, 1/3 o 2/3.

## Pasos con pregunta

Un paso puede plantear una pregunta al público. Aparece entonces una ventana en la parte inferior del lienzo con la pregunta y las opciones en grandes tarjetas. El docente puede hacer clic en la opción elegida por el aula y después revela la respuesta: botón, tecla **→** o mando de presentación. Las tarjetas se colorean; al hacer clic en una tarjeta, se da la vuelta y muestra su explicación. La explicación general aparece en el panel derecho. En reproducción continua, el avance espera a que se revele la respuesta.

~~~
## Pregunta: ¿quién controla Alfa SA?
Contexto opcional, mostrado en el panel derecho.

```scene
resaltar ALFA
```

- [ ] Nadie
  Explicación de esta opción (líneas sangradas bajo la opción).
- [x] La familia García
  Controla la holding, que posee el 51 % de Alfa SA.
- [ ] El Fondo Delta

### Respuesta
Explicación general, mostrada tras revelar la respuesta.

```scene
vista FAM
nota ALFA "Control a través de la cadena"
```
~~~

Reglas:
- un paso es una pregunta si su título empieza por «Pregunta» (o «Quiz», «❓»), si contiene opciones `- [ ]` / `- [x]`, o una sección `### Respuesta` (también: Solución, Explicación);
- `[x]` marca una respuesta correcta; puede haber varias, o ninguna casilla para una **pregunta abierta**;
- el texto de la pregunta es el título, sin el prefijo «Pregunta:»;
- el contexto se coloca **antes** de las opciones; las líneas sangradas (o con «>») justo debajo de una opción son su explicación;
- los comandos situados **después** de `### Respuesta` solo se ejecutan al revelar la respuesta, lo que permite mostrarla en el lienzo; siguen aplicándose en los pasos siguientes (salvo `resaltar`, `nota` y `seleccionar`, propios de cada paso);
- evite que el texto de los pasos anteriores adelante la respuesta.

## Comandos

| Comando | Efecto |
|---|---|
| `persona ID "Nombre"` | crea o modifica una persona física |
| `sociedad ID "Nombre"` | lo mismo para una sociedad (también: `holding`, `fondo`, `estado`, `publico`) |
| `sociedad ID "Nombre" en 200 150` | posición fija; sin `en`, disposición automática (accionistas arriba) |
| `vinculo A -> B 51%` | A posee el 51 % del capital y de los derechos de voto de B |
| `vinculo A -> B 35% votes 52%` | capital y derechos de voto distintos (la palabra `votes` no se traduce) |
| `A -> B 20%` | forma corta de `vinculo` |
| `vinculo A -> A 5%` | autocartera (acciones propias) |
| `vinculo A -> B 0%` o `quitar A -> B` | elimina la participación |
| `quitar ID` | elimina una entidad (o un pacto) |
| `renombrar ID "Nuevo nombre"` | cambia el nombre |
| `concierto ID "Nombre del pacto" A B C` | actuación concertada: A, B y C votan juntos (también: `pacto`) |
| `vista ID` / `vista ninguna` | punto de vista: interés y control de ID mostrados en todas las entidades |
| `resaltar ID ID…` | destaca entidades |
| `nota ID "texto"` | bocadillo explicativo encima de una entidad |
| `seleccionar ID` | muestra el análisis detallado de ID bajo el comentario |
| `duracion 12` | duración del paso en reproducción continua (segundos) |
| `mover ID X Y` | desplaza una entidad |
| `disposition auto` | vuelve a colocar todas las entidades en disposición automática |
| `borrar` | vacía el lienzo |

Una entidad citada en un `vinculo` sin haber sido declarada se crea automáticamente como sociedad.

Los comandos originales en francés (`personne`, `societe`, `lien`, `focus`, `vue`…) y en inglés (`person`, `company`, `link`, `view`…) también se aceptan. La regla `regle 40` (presunción de control de hecho con más del 40 %) es propia del derecho francés: no la utilice en un escenario de derecho español.

## Consejos de redacción

- De 4 a 8 pasos; cada paso añade una sola idea (una o dos entidades, uno o dos vínculos).
- Use `resaltar` y `nota` para guiar la mirada, y `vista` para mostrar el interés indirecto de un accionista.
- Compruebe que la suma de las participaciones en una sociedad no supera el 100 %; el resto se muestra como «otros».
- Dé las cifras clave en el comentario (p. ej., 51 % × 51 % ≈ 26 %): la herramienta las recalcula y las muestra, y el alumno puede comprobarlas.
- Con acciones de lealtad (voto doble en sociedades cotizadas), calcule la proporción de votos: 35 % del capital × 2 votos / 135 votos en total = 51,85 %. Las acciones sin voto se representan con `votes 0%`.


---

# Anexo 2 — Reglas de cálculo

Esta página describe lo que calcula el motor (`js/model.js`) y lo que no representa. Sirve también de referencia para generar escenarios: el comentario de un escenario debe anunciar los mismos resultados que la herramienta.

Se refiere al **derecho español** (`droit: es`), el que aplica la interfaz en español: Ley de Sociedades de Capital (LSC), con la **sociedad anónima** como referencia y remisiones a la **sociedad limitada**. Las reglas de cálculo del control y del interés son las mismas en todos los derechos; lo que cambia son los umbrales, la leyenda y las referencias legales.

## Entidades y participaciones

| Tipo | Comando | ¿Puede ser poseída? | ¿Puede controlar? |
|---|---|---|---|
| Persona física | `persona` | no | sí |
| Sociedad | `sociedad` (también `empresa`, `filial`) | sí | sí |
| Holding | `holding` | sí | sí |
| Fondo | `fondo` (también `inversor`) | sí | sí |
| Estado / entidad pública | `estado` | no | sí |
| Público / capital flotante | `publico` (también `mercado`, `bolsa`) | no | **no**: vota, pero un accionariado disperso nunca forma un bloque |

Una participación (vínculo `A -> B`) lleva dos porcentajes: el **capital** y los **derechos de voto** (iguales por defecto). Lo que no se atribuye a nadie se muestra como «otros accionistas». Esos otros votan (cuentan en el 100 %), pero nunca controlan.

## Derechos de voto efectivos y autocartera

Los votos de las acciones que posee la **propia** sociedad (autocartera, vínculo `A -> A`) o una sociedad **que ella controla** (acciones de la dominante en poder de sus filiales) quedan **neutralizados**. En derecho español, los derechos de voto de la autocartera están suspendidos (art. 148 LSC), y lo mismo ocurre con las acciones de la sociedad dominante adquiridas por sus filiales (art. 134 y ss. LSC). Los porcentajes de los demás accionistas se recalculan entonces sobre la base restante:

> votos efectivos = votos poseídos ÷ (100 % − votos neutralizados)

Ejemplo: el 46 % de los votos, con un 10 % en poder de una filial y un 5 % de autocartera, da 46 ÷ 85 = 54,1 % de votos efectivos. Como la neutralización depende del control, y viceversa, el motor itera hasta que el resultado se estabiliza.

## Control

Un **bloque** es una entidad sola o un **pacto** (comando `concierto`) que reúne varias entidades.

1. **Mayoría**: un bloque controla una sociedad si dispone de **más del 50 %** de los votos efectivos, sumando sus propios votos y los de las sociedades que ya controla. Es el control **en cadena**: la familia que controla H1, que controla H2, controla también lo que controla H2. Corresponde al primer supuesto del art. 42 del Código de Comercio (poseer la mayoría de los derechos de voto), al que remite la LSC para definir el grupo de sociedades (art. 18 LSC).
2. **Sin presunción del 40 %**: la regla del «control de hecho» con más del 40 % de los votos es una presunción del derecho francés. No existe en derecho español: el comando `regla 40` no debe usarse en un escenario `droit: es`. Los demás supuestos del art. 42 del Código de Comercio (facultad de nombrar o destituir a la mayoría del órgano de administración, mayoría de los votos en virtud de acuerdos con terceros, mayoría del consejo designada con sus votos) no se calculan: los acuerdos con terceros pueden representarse con un `concierto`; lo demás va en el comentario.
3. **Controlador último**: el bloque que controla una sociedad sin estar él mismo controlado. Si solo un pacto reúne la mayoría, el control se considera **conjunto**.

Exactamente el 50 % **no** da el control: 50/50 significa que ningún socio controla solo.

**Pacto y socio mayoritario.** Si uno de los miembros de un pacto dispone ya, por sí solo, de más del 50 %, el controlador es él (control **exclusivo**); el pacto no cambia nada en la herramienta. El control solo aparece como **conjunto** cuando ningún miembro tiene la mayoría por sí solo y el pacto la reúne. Un derecho de veto o una decisión de común acuerdo previstos en un pacto parasocial no se modelizan: corresponde al comentario explicarlos.

**Actuación concertada.** Un `concierto` suma los votos de sus miembros, como hace la normativa de OPA con las personas que actúan concertadamente (RD 1066/2007, art. 5).

**Filial o sociedad controlada.** La herramienta razona en términos de **control**, directo o indirecto. El color de un vínculo solo describe la participación directa: una sociedad controlada en cadena (una «nieta») aparece controlada por la sociedad cabecera aunque esta no posea ninguna acción suya. Si el curso plantea una cuestión de participación directa, la respuesta va en el comentario.

## Interés económico

El interés de un accionista en una sociedad es la suma, sobre todos los caminos de tenencia, del producto de los porcentajes de **capital**:


> 51 % × 51 % × 51 % ≈ 13,27 %

Las participaciones cruzadas se tienen en cuenta (cálculo iterativo). Las acciones en autocartera se retiran de la base.

## Umbrales y colores de los vínculos

Las categorías se aplican a los **derechos de voto efectivos** del vínculo. Se evalúan de la más alta a la más baja: se muestra la primera que se alcanza.

| Umbral | Clave | Significado (sociedad anónima de referencia) |
|---|---|---|
| 90 % o más | `venta` | tras una OPA dirigida a la totalidad del capital, **venta forzosa** (*squeeze-out*) de los minoritarios, en las condiciones de la normativa de OPA |
| 2/3 o más | `reforzada` | **mayoría reforzada**: en la SA, si concurre menos del 50 % del capital, modificar los estatutos exige 2/3 del capital presente o representado (art. 201.2 LSC); en la SL, la transformación, la fusión, la escisión o la supresión del derecho de preferencia exigen 2/3 de los votos (art. 199 b LSC) |
| más del 50 % | `mayoria` | **mayoría absoluta**: adopta sola los acuerdos de la junta general; **control** (art. 42 del Código de Comercio) |
| más de 1/3 | `bloqueo` | **minoría de bloqueo** frente a los acuerdos que exigen 2/3 (SL; SA con quórum bajo) |
| 30 % o más | `opa` | sociedad cotizada: alcanzar el 30 % de los derechos de voto obliga a formular una **OPA** (RD 1066/2007, art. 4) |
| 5 % o más | `minoria` | **derechos de minoría**: solicitar la convocatoria de la junta, el complemento del orden del día, ejercer la acción social de responsabilidad (3 % en las cotizadas) |
| menos del 5 % | `inversion` | inversión financiera |

Los colores van del verde oscuro (umbral más alto) al gris (inversión); la leyenda del taller los muestra. Vínculos en gris punteado: votos neutralizados (autocartera, acciones de la dominante en poder de filiales).

Una entidad **teñida** está controlada por el controlador último del mismo color. Un controlador último tiene un **borde grueso** de su color.

> ⚠️ Simplificaciones. La herramienta razona como si todos los votos estuvieran presentes en la junta. En la SA, las mayorías dependen en realidad del capital presente o representado: mayoría simple de los votos para los acuerdos ordinarios, mayoría absoluta o 2/3 para las modificaciones estatutarias según el quórum (art. 201 LSC). Como solo se muestra la categoría más alta, una participación del 40 % aparece como **minoría de bloqueo**, aunque también supere el umbral de OPA del 30 %: el comentario debe recordarlo cuando sea relevante. La presunción de **influencia significativa** a partir del 20 % (NIC 28) no es una categoría de la leyenda: si el curso trata de consolidación, va en el comentario.

## Lo que la herramienta no representa

- las deudas, los préstamos y los flujos financieros (dividendos, intereses): se ponen en los comentarios y los bocadillos;
- los valores: fondo de comercio, valor razonable, precio, resultado de la venta;
- los demás supuestos de control del art. 42 del Código de Comercio (nombramiento de la mayoría del órgano de administración) y los criterios cualitativos del control (NIIF 10: poder, rendimientos variables, vínculo entre ambos), los derechos de voto potenciales, las entidades estructuradas, el control por contrato;
- la unanimidad exigida por un acuerdo conjunto (NIIF 11): un pacto solo se trata como un bloque de voto;
- las reglas propias de cada forma social (estatutos de la SL, quórum de constitución de la SA, mayorías estatutarias reforzadas, condiciones exactas de la venta forzosa).

En esos casos, el lienzo muestra la estructura y el comentario aporta el análisis.


---

# Anexo 3 — Ejemplo completo

Un escenario completo de derecho español (la pirámide de sociedades holding), con un paso con pregunta. Sus cifras se han comprobado con el motor del taller:

````markdown
---
droit: es
---
# La pirámide de sociedades holding
> Cómo una familia controla una gran sociedad cotizada con una pequeña parte de su capital.

Construimos paso a paso una **cascada de sociedades holding**. En cada nivel, la familia conserva la mayoría… pero su **interés económico** se reduce.

Fíjese en los colores: una entidad **teñida** está controlada por el accionista del mismo color.

## 1. La familia crea una holding
La familia García aporta sus acciones a una holding, **García Participaciones**, de la que posee el **51 %** del capital. El 49 % restante pertenece a inversores externos (no representados: aparecen en «otros»).

Con más del 50 % de los derechos de voto, la familia adopta sola los acuerdos ordinarios de la junta general: **controla** la holding (art. 42 del Código de Comercio).

```scene
persona FAM "Familia García"
holding H1 "García Participaciones"
vinculo FAM -> H1 51%
resaltar H1
```
## 2. Un segundo nivel
La holding adquiere el **51 %** de una segunda holding, **García Industria**.

- La familia no posee *directamente* ninguna acción de García Industria.
- Pero controla García Participaciones, que controla García Industria: el control **se transmite** a lo largo de la cadena.
- Su **interés económico** (su parte de los dividendos) ya solo es de 51 % × 51 % ≈ **26 %**.

El modo **punto de vista** (👁) muestra en cada entidad el interés y el control de la familia.

```scene
holding H2 "García Industria"
vinculo H1 -> H2 51%
vista FAM
resaltar H2
```
## 3. La sociedad cotizada
García Industria posee el **51 %** de **Alfa SA**, una gran sociedad cotizada.

La familia controla Alfa SA con un interés económico de 51 % × 51 % × 51 % ≈ **13,3 %**. El 86,7 % restante pertenece a otros inversores… que no tienen el poder.

```scene
sociedad ALFA "Alfa SA (cotizada)"
vinculo H2 -> ALFA 51%
resaltar ALFA
nota ALFA "Controlada con ≈ 13 % del capital económico"
```
## 4. Un nivel más
Alfa SA adquiere el 51 % de **Beta SL**. La familia controla ahora Beta con un interés de solo el **6,8 %**.

> 💡 Cada nivel divide aproximadamente por dos el interés económico, sin diluir nunca el poder: es el **efecto multiplicador** de la pirámide.

```scene
sociedad BETA "Beta SL"
vinculo ALFA -> BETA 51%
resaltar BETA
```
## Pregunta: ¿qué poder tiene el Fondo Delta en Alfa SA?
El **Fondo Delta** posee el 49 % restante de García Participaciones: financia la pirámide casi tanto como la familia.

```scene
fondo DELTA "Fondo Delta"
vinculo DELTA -> H1 49%
vista ninguna
resaltar DELTA ALFA
```
- [ ] El 49 % de los derechos de voto de Alfa SA
  Su 49 % se refiere a García Participaciones, no a Alfa SA.
- [ ] Alrededor del 12,7 % de los derechos de voto, como su interés económico
  49 % × 51 % × 51 % ≈ 12,7 % mide su parte de los beneficios de Alfa SA, no sus votos.
- [x] Ninguno: no vota en la junta general de Alfa SA
  Sus votos solo cuentan en la junta de García Participaciones, donde la familia es mayoritaria.
- [ ] Una minoría de bloqueo
  La tiene en García Participaciones (49 %, más de un tercio), pero no en Alfa SA.

### Respuesta
El fondo tiene un **interés económico** de alrededor del **12,7 %** en Alfa SA —casi tanto como la familia (13,3 %)— pero **ningún derecho de voto**: solo vota en la junta de García Participaciones, donde es minoritario.

Es la paradoja de la pirámide: se puede **financiar sin decidir**. El punto de vista del fondo aparece ahora en el lienzo.

```scene
vista DELTA
resaltar DELTA ALFA
```
## 6. Síntesis
| Sociedad | Interés de la familia | Control |
|---|---|---|
| García Participaciones | 51 % | ✔ |
| García Industria | 26 % | ✔ |
| Alfa SA | 13,3 % | ✔ |
| Beta SL | 6,8 % | ✔ |

Para recordar:
- **porcentaje de control** ≠ **porcentaje de interés**;
- el control se transmite en cadena (art. 42 del Código de Comercio), el interés se **multiplica**;
- los mercados suelen aplicar un **descuento de holding** a las sociedades cabecera.

Haga clic en una entidad para ver su análisis detallado.

```scene
vista FAM
seleccionar BETA
```
````
