---
droit: es
---
# Actuación concertada: controlar entre varios
> Dos minoritarios que se ponen de acuerdo pueden controlar juntos… y verse obligados a lanzar una OPA.

## 1. Un capital fragmentado
Omega SA cotiza en bolsa: **A Inversiones SL** posee el 28 %, **B Capital** el 24 % y el mercado el 48 %. Ningún bloque supera el 50 %: Omega **no está controlada**. Ninguno alcanza tampoco el **30 %**, umbral de la OPA obligatoria.

```scene
holding A "A Inversiones SL"
fondo B "B Capital"
publico PUB "Mercado"
sociedad OMEGA "Omega SA (cotizada)"
vinculo A -> OMEGA 28%
vinculo B -> OMEGA 24%
vinculo PUB -> OMEGA 48%
resaltar OMEGA
```
## 2. El pacto parasocial
A Inversiones y B Capital firman un **pacto parasocial**: se comprometen a votar en el mismo sentido para llevar a cabo una política común duradera. **Actúan de forma concertada** (RD 1066/2007, art. 5): sus derechos de voto se suman.

Juntos reúnen el 52 % de los votos: **controlan conjuntamente** Omega.

> 💡 En las cotizadas, los pactos parasociales que regulan el voto deben comunicarse a la sociedad y a la CNMV y hacerse públicos (art. 530 y 531 LSC).

```scene
pacto PACTO "Pacto Omega" A B
resaltar OMEGA
nota OMEGA "Control conjunto: 28 % + 24 %"
```
## Pregunta: ¿qué consecuencia tiene el pacto en el mercado de valores?
Ninguno de los dos firmantes ha comprado una sola acción de Omega.

- [ ] Ninguna: no han comprado acciones
  La OPA obligatoria no depende solo de las compras: también de los acuerdos de voto.
- [x] Deben formular una OPA sobre la totalidad de Omega
  Al actuar de forma concertada, sus votos se suman: 52 %, por encima del umbral del 30 %.
- [ ] Solo A Inversiones debe formular una OPA, por ser el mayor accionista
  Su 28 % no alcanza el 30 % por sí solo; es el bloque concertado el que lo supera.

### Respuesta
Se considera que una persona alcanza el **control** de una cotizada cuando llega, directa o indirectamente, a un porcentaje de derechos de voto **igual o superior al 30 %** (RD 1066/2007, art. 4). La obligación nace tanto de una adquisición de acciones como de un **pacto parasocial** con otros accionistas (art. 3), y para el cómputo se suman los votos de quienes actúan de forma concertada (art. 5).

Con el pacto, el bloque A + B reúne el **52 %**: los firmantes están obligados a formular una **OPA sobre la totalidad** de las acciones de Omega, a un precio equitativo. Es la contrapartida de la toma de control: los minoritarios pueden salir.

```scene
nota OMEGA "Concierto: 52 % ≥ 30 % → OPA obligatoria"
resaltar A B OMEGA
```
## 4. ¿Quién está detrás de A Inversiones?
A Inversiones está participada al 70 % por la **Sra. Durán**. La Sra. Durán controla A Inversiones y participa así, a través de ella, en el control conjunto de Omega.

El punto de vista de la Sra. Durán muestra su interés económico en Omega: 70 % × 28 % = **19,6 %**.

```scene
persona DURAN "Sra. Durán"
vinculo DURAN -> A 70%
vista DURAN
resaltar A
```
## 5. Fin del pacto
El pacto se resuelve. Cada uno recupera su libertad de voto: Omega vuelve a estar **sin control**.

> ⚠️ Simplificación: el régimen de la OPA es más complejo (precio equitativo, dispensas, OPA voluntaria previa…). El lienzo calcula el bloque concertado, no las obligaciones bursátiles.

```scene
quitar PACTO
vista ninguna
resaltar OMEGA
```