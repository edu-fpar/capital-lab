---
droit: es
---
# Mayorías y minoría de bloqueo
> Más del 50 %, 2/3, más de 1/3: los umbrales que cambian el poder en la junta general, en la SA y en la SL.

En España, las mayorías de la junta general dependen de la **forma social**. En la **sociedad anónima** (SA) se calculan sobre el capital **presente o representado** en la junta; en la **sociedad de responsabilidad limitada** (SL), sobre los votos correspondientes a **todo el capital social**. Estos umbrales dibujan el mapa del poder.

## 1. Dos accionistas
Gamma SA tiene dos accionistas: **María (60 %)** y **Pablo (40 %)**.

María tiene la mayoría: nombra a los administradores, aprueba las cuentas y decide el reparto de dividendos. Los acuerdos ordinarios se adoptan por **mayoría simple** de los votos del capital presente o representado (art. 201.1 LSC).

```scene
persona MARIA "María"
persona PABLO "Pablo"
sociedad GAMMA "Gamma SA"
vinculo MARIA -> GAMMA 60%
vinculo PABLO -> GAMMA 40%
resaltar GAMMA
```
## Pregunta: ¿puede María modificar sola los estatutos de Gamma SA?
María tiene el 60 % de los votos y Pablo el 40 %. Ambos asisten a la junta y votan.

- [x] Sí: con más del 50 % del capital presente, basta la mayoría absoluta
  Art. 201.2 LSC: si el capital presente o representado supera el 50 %, la mayoría absoluta es suficiente.
- [ ] No: hacen falta los dos tercios de los votos
  Los 2/3 solo se exigen en la SA cuando concurre entre el 25 % y el 50 % del capital, en segunda convocatoria.
- [ ] No: hace falta la unanimidad
  La ley no exige la unanimidad para modificar los estatutos.

### Respuesta
Para los acuerdos del **art. 194 LSC** (modificar los estatutos, aumentar o reducir el capital, suprimir o limitar el derecho de suscripción preferente, transformación, fusión, escisión…), la SA exige un **quórum reforzado**: el 50 % del capital suscrito con derecho de voto en primera convocatoria, el 25 % en segunda.

En cuanto a la mayoría (art. 201.2 LSC): si concurre **más del 50 %** del capital, basta la **mayoría absoluta**; si concurre entre el 25 % y el 50 %, se necesitan los **2/3** del capital presente o representado. Aquí asiste el 100 %: con el 60 %, María modifica sola los estatutos.

> 💡 Los estatutos pueden elevar estas mayorías (art. 201.3 LSC): es una protección habitual del socio minoritario.

```scene
nota MARIA "Más del 50 %: decide sola, también para modificar estatutos"
resaltar MARIA
```
## 3. La misma sociedad, en forma de SL
Gamma se transforma en **Gamma SL**, con el mismo reparto. En la SL, las mayorías se calculan sobre **todo el capital**, haya o no asistido el socio:
- modificar los estatutos, aumentar o reducir el capital: **más de la mitad** de los votos de todas las participaciones (art. 199 a LSC). María puede hacerlo sola;
- transformación, fusión, escisión, cesión global de activo y pasivo, traslado del domicilio al extranjero, **supresión o limitación del derecho de preferencia**, exclusión de socios: al menos **2/3** de los votos (art. 199 b LSC).

```scene
renombrar GAMMA "Gamma SL"
resaltar GAMMA
```
## Pregunta: ¿puede María aprobar sola la fusión de Gamma SL con otra sociedad?
María tiene el 60 % de los votos de Gamma SL; Pablo, el 40 %.

- [ ] Sí: tiene la mayoría del capital
  La mayoría del capital basta para modificar los estatutos de una SL, no para fusionarla.
- [x] No: la fusión de una SL exige al menos 2/3 de los votos
  60 % < 66,67 %: sin Pablo, el acuerdo no prospera.
- [ ] Sí, si Pablo no asiste a la junta
  En la SL, la mayoría se calcula sobre los votos de todo el capital social, asistan o no los socios.

### Respuesta
La fusión exige al menos los **2/3** de los votos correspondientes a todas las participaciones (art. 199 b LSC). Pablo tiene **más de un tercio**: dispone de una **minoría de bloqueo** frente a esos acuerdos.

```scene
nota PABLO "Más de 1/3: bloquea fusión, transformación…"
nota MARIA "Más del 50 %: decide los acuerdos ordinarios"
resaltar PABLO
```
## 5. Pablo cede un 7 %
Pablo vende un 7 % a María. María pasa al **67 %** (≥ 2/3): puede adoptar sola también los acuerdos del art. 199 b. Pablo baja al **33 %**… justo por debajo del tercio: **pierde** su minoría de bloqueo.

> 💡 Unas pocas participaciones pueden cambiar el equilibrio de poder: por eso los paquetes cercanos a los umbrales se negocian a menudo con una **prima de control**.

```scene
vinculo MARIA -> GAMMA 67%
vinculo PABLO -> GAMMA 33%
resaltar MARIA PABLO
```
## 6. La trampa del 50/50
¿Y si María y Pablo tuvieran el **50 %** cada uno? Nadie tiene *más del* 50 %: **ninguno controla**. Cada uno puede bloquear al otro: es la situación de **bloqueo** (*deadlock*).

Los socios prevén entonces un **pacto parasocial**: voto dirimente, cláusula de salida, mediación… Un bloqueo persistente de los órganos sociales es incluso causa legal de disolución (art. 363.1 d LSC).

```scene
vinculo MARIA -> GAMMA 50%
vinculo PABLO -> GAMMA 50%
resaltar GAMMA
nota GAMMA "50/50: nadie controla"
```
## 7. Los umbrales que hay que conocer
| Umbral | Efecto principal |
|---|---|
| 3 %, 5 %, 10 %, 15 %… | Comunicación de participaciones significativas en las cotizadas (RD 1362/2007) |
| 5 % (3 % en cotizadas) | Derechos de minoría: pedir la convocatoria de la junta, complemento del orden del día, acción social de responsabilidad |
| 30 % | OPA obligatoria en las cotizadas (RD 1066/2007, art. 4) |
| más de 1/3 | Minoría de bloqueo frente a los acuerdos de 2/3 (SL; SA con quórum bajo) |
| más del 50 % | Mayoría absoluta — control (art. 42 CCom) |
| 2/3 | Mayoría reforzada (SL, art. 199 b; SA con entre el 25 % y el 50 % del capital presente, art. 201.2) |
| 90 % | Venta forzosa de los minoritarios tras una OPA sobre la totalidad |

La **leyenda** del lienzo retoma estos colores.

> ⚠️ El lienzo calcula sobre el 100 % de los votos: no modela la asistencia a la junta, que en la SA cambia la mayoría exigida.

```scene
vinculo MARIA -> GAMMA 92%
vinculo PABLO -> GAMMA 8%
nota GAMMA "En una cotizada, 90 % o más: venta forzosa tras una OPA"
```