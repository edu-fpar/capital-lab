# Formato de los escenarios del modo cine

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
