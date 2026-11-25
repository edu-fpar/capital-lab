---
droit: es
---
# Capital ≠ poder: acciones de lealtad y acciones sin voto
> Cómo tener el 35 % del capital… y más del 50 % de los votos.

Por regla general, el derecho de voto es **proporcional al capital**: en la SA, la ley prohíbe con carácter general las acciones que alteren esa proporción. Pero admite excepciones que separan capital y votos. El lienzo muestra entonces dos cifras en cada vínculo: el capital y los derechos de voto.

## 1. Una sociedad cotizada clásica
**Delta SA** cotiza en bolsa. Su fundador, **Juan**, posee el **35 %** del capital desde antes de la salida a bolsa; el resto (65 %) está en manos del público. Una acción = un voto: Juan es minoritario.

```scene
persona JUAN "Juan, fundador"
publico PUB "Accionistas del mercado"
sociedad DELTA "Delta SA (cotizada)"
vinculo JUAN -> DELTA 35%
vinculo PUB -> DELTA 65%
resaltar DELTA
```
## 2. Las acciones de lealtad
Desde la **Ley 5/2021**, los estatutos de una sociedad cotizada pueden atribuir un **voto doble** a cada acción que haya pertenecido al mismo accionista durante **dos años ininterrumpidos**, inscrita en un registro especial (art. 527 ter y siguientes LSC). No es automático: hace falta una cláusula estatutaria.

Delta SA ha adoptado esa cláusula y Juan conserva sus acciones desde hace años: sus 35 acciones valen **70 votos**. El público, que compra y vende, conserva 65 votos. Total: 135 votos.

- Juan: 70 / 135 = **51,85 %** de los votos → **control**.
- Público: 65 / 135 = 48,15 %.

> ⚠️ Simplificaciones: suponemos que ningún accionista del público ha inscrito sus acciones en el registro especial; tampoco se trata aquí la incidencia del voto doble en la obligación de formular una OPA al superar el 30 % de los votos.

```scene
vinculo JUAN -> DELTA capital=35 votes=51.85
vinculo PUB -> DELTA capital=65 votes=48.15
resaltar JUAN
nota JUAN "35 % del capital, 51,85 % de los votos"
```
## Pregunta: un fondo activista compra el 10 % del capital al público. ¿Qué parte de los votos obtiene?
El fondo acaba de comprar sus acciones en bolsa. Juan conserva sus 70 votos.

- [ ] El 10 %, como su capital
  Sus acciones no tienen voto doble: pesan menos que su capital porque Juan dispone de votos adicionales.
- [x] Alrededor del 7,4 %
  10 votos sobre un total que sigue siendo de 135: 10 / 135 ≈ 7,41 %.
- [ ] El 20 %: también recibe un voto doble
  El voto doble exige dos años de titularidad ininterrumpida: el fondo tendrá que esperar.

### Respuesta
Votos: Juan 70, fondo 10, público 55 → total 135. Juan conserva el **51,85 %** de los votos; el fondo solo tiene el **7,41 %** de los votos con el 10 % del capital, y el público el 40,74 %.

```scene
fondo ACT "Fondo activista"
vinculo ACT -> DELTA capital=10 votes=7.41
vinculo PUB -> DELTA capital=55 votes=40.74
resaltar ACT
```
## 4. Las participaciones sin voto
Otra herramienta: las **acciones y participaciones sin voto** (art. 98 y siguientes LSC). A cambio de renunciar al voto, su titular recibe un **dividendo mínimo** fijado en los estatutos. Su importe nominal no puede superar la **mitad** del capital (en la SA, del capital desembolsado).

En la start-up **Nova SL**, la fundadora **Lucía** posee el 40 % del capital en participaciones ordinarias. Un fondo de capital riesgo posee el 60 %, del que el 50 % del capital son participaciones **sin voto**.

Votos: Lucía 40, fondo 10 → Lucía tiene el **80 %** de los votos con el 40 % del capital.

```scene
persona LUCIA "Lucía, fundadora"
fondo VC "Fondo de capital riesgo"
sociedad NOVA "Nova SL"
vinculo LUCIA -> NOVA capital=40 votes=80
vinculo VC -> NOVA capital=60 votes=20
resaltar NOVA
vista LUCIA
```
## 5. Para recordar
- El **control** se mide en **derechos de voto**; el **interés económico**, en **capital**.
- Herramientas de disociación: acciones de lealtad (cotizadas), acciones y participaciones sin voto y, en la **SL**, participaciones con voto plural si lo prevén los estatutos (art. 188.1 LSC).
- En modo libre, haga clic en un vínculo para ajustar por separado capital y derechos de voto.

```scene
vista ninguna
```