---
droit: es
---
# La pirámide de sociedades holding
> Cómo una familia controla una gran sociedad cotizada con una pequeña parte de su capital.

Construimos paso a paso una **cascada de holdings**. En cada piso, la familia conserva la mayoría… pero su **interés económico** se reduce.

Fíjese en los colores: una entidad **teñida** está controlada por el accionista del mismo color.

## 1. La familia crea una holding
La familia García aporta sus participaciones a una holding, **García Participaciones SL**, de la que posee el **51 %** del capital. El 49 % restante pertenece a inversores externos (no representados: aparecen como «otros»).

Con más del 50 % de los votos, la familia adopta sola los acuerdos ordinarios de la junta general: **controla** la holding (art. 42 del Código de Comercio: mayoría de los derechos de voto).

```scene
persona FAM "Familia García"
holding H1 "García Participaciones SL"
vinculo FAM -> H1 51%
resaltar H1
```
## 2. Un segundo piso
La holding adquiere el **51 %** de una segunda holding, **García Industria SL**.

- La familia no posee *directamente* ninguna participación de García Industria.
- Pero controla García Participaciones, que controla García Industria: el control **se transmite** a lo largo de la cadena (el art. 42 CCom habla de control «directo o indirecto»).
- Su **interés económico** (su parte de los dividendos) es solo de 51 % × 51 % ≈ **26 %**.

El modo **punto de vista** (👁) muestra en cada entidad el interés y el control de la familia.

```scene
holding H2 "García Industria SL"
vinculo H1 -> H2 51%
vista FAM
resaltar H2
```
## 3. La sociedad cotizada
García Industria posee el **51 %** de **Alfa SA**, una gran sociedad cotizada.

La familia controla Alfa SA con un interés económico de 51 % × 51 % × 51 % ≈ **13,3 %**. El 86,7 % restante pertenece a otros inversores… que no tienen el poder.

> ⚠️ En la realidad, quien alcanza el 30 % de los votos de una cotizada debe formular una OPA (RD 1066/2007). Aquí suponemos que la participación se adquirió por una vía que no la exigía (por ejemplo, antes de la salida a bolsa).

```scene
sociedad ALFA "Alfa SA (cotizada)"
vinculo H2 -> ALFA 51%
resaltar ALFA
nota ALFA "Controlada con ≈ 13 % del capital económico"
```
## 4. Otro piso más
Alfa SA adquiere el 51 % de **Beta SL**. La familia controla ahora Beta con un interés de solo el **6,8 %**.

> 💡 Cada piso divide aproximadamente por dos el interés económico, sin diluir nunca el poder: es el **efecto multiplicador** de la pirámide.

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
- [ ] El 49 % de los votos de Alfa SA
  Su 49 % se refiere a García Participaciones, no a Alfa SA.
- [ ] Alrededor del 12,7 % de los votos, como su interés económico
  49 % × 51 % × 51 % ≈ 12,7 % mide su parte de los beneficios de Alfa SA, no sus votos.
- [x] Ninguno: no vota en la junta de Alfa SA
  Sus votos solo cuentan en la junta de García Participaciones, donde la familia es mayoritaria.
- [ ] Una minoría de bloqueo
  La tiene en García Participaciones (49 %, más de un tercio, frente a los acuerdos que exigen 2/3 en una SL), pero no en Alfa SA.

### Respuesta
El fondo tiene un **interés económico** de aproximadamente el **12,7 %** en Alfa SA —casi tanto como la familia (13,3 %)— pero **ningún derecho de voto**: solo vota en la junta de García Participaciones, donde es minoritario.

Es la paradoja de la pirámide: se puede **financiar sin decidir**. El punto de vista del fondo aparece ahora en el lienzo.

```scene
vista DELTA
resaltar DELTA ALFA
```
## 6. Síntesis
| Sociedad | Interés de la familia | Control |
|---|---|---|
| García Participaciones SL | 51 % | ✔ |
| García Industria SL | 26 % | ✔ |
| Alfa SA | 13,3 % | ✔ |
| Beta SL | 6,8 % | ✔ |

Para recordar:
- **porcentaje de control** ≠ **porcentaje de interés**;
- el control se transmite en cadena (art. 42 CCom), el interés se **multiplica**;
- los mercados suelen aplicar un **descuento de holding** a las sociedades cabecera.

Haga clic en una entidad para ver su análisis detallado.

```scene
vista FAM
seleccionar BETA
```