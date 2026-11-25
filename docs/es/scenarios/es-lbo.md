---
droit: es
---
# LBO: comprar una empresa con apalancamiento
> Sociedad vehículo, deuda de adquisición, consolidación fiscal y plan de incentivos para directivos.

Un **LBO** (*leveraged buy-out*, compra apalancada) es la adquisición de una sociedad por una **sociedad vehículo** que financia la compra en parte con **deuda**. La deuda se devuelve después con los dividendos que la sociedad adquirida reparte a la sociedad vehículo.

> ⚠️ El lienzo muestra las **participaciones** (capital y poder). La deuda bancaria no es una participación: aparece en las notas y los comentarios. Los importes son ejemplos simplificados.

## 1. La sociedad objetivo
**Industria SL** pertenece al 100 % a su fundador, el Sr. Moreno, que quiere vender. Precio acordado: **100 M€** (para simplificar, suponemos que la sociedad objetivo no tiene deuda).

```scene
persona MORENO "Sr. Moreno (fundador)"
sociedad TARGET "Industria SL"
vinculo MORENO -> TARGET 100%
resaltar TARGET
nota TARGET "Precio: 100 M€"
```
## 2. La sociedad vehículo
Un fondo de capital privado constituye una sociedad nueva, **NewCo SL** (sociedad vehículo o *holding* de adquisición). Aporta **36 M€** y el equipo directivo **4 M€**: 40 M€ de fondos propios en total.

Fondo: **90 %** del capital; directivos: **10 %**. El fondo controla NewCo.

```scene
fondo LBO "Fondo de capital privado"
persona MGT "Equipo directivo"
holding NEWCO "NewCo SL (sociedad vehículo)"
vinculo LBO -> NEWCO 90%
vinculo MGT -> NEWCO 10%
resaltar NEWCO
nota NEWCO "Fondos propios: 40 M€"
```
## 3. La deuda de adquisición y la compra
NewCo pide prestados **60 M€** a los bancos y compra el **100 %** de Industria por 100 M€ (40 M€ de fondos propios + 60 M€ de deuda).

Es **NewCo** quien se endeuda, no la sociedad objetivo: una SL no puede anticipar fondos, conceder préstamos, prestar garantías ni facilitar asistencia financiera para que un tercero adquiera sus propias participaciones (prohibición de **asistencia financiera**, art. 143.2 LSC; para la SA, art. 150 LSC).

El fondo controla ahora Industria **al 100 %** habiendo aportado solo 36 M€: la sociedad vehículo (palanca **jurídica**) y la deuda (palanca **financiera**) se combinan.

```scene
quitar MORENO
vinculo NEWCO -> TARGET 100%
vista LBO
resaltar TARGET
nota NEWCO "Deuda de adquisición: 60 M€"
```
## Pregunta: NewCo solo compra el 74 % de Industria. ¿Pueden tributar en consolidación fiscal?
NewCo no tiene actividad: para pagar los intereses y devolver la deuda, cuenta con los **dividendos** de Industria. Le interesaría compensar sus gastos financieros con los beneficios de Industria.

- [ ] Sí: NewCo controla Industria
  El control (más del 50 % de los votos) basta para consolidar las cuentas, no para la consolidación fiscal.
- [x] No: hace falta al menos el 75 % del capital
  Art. 58 de la Ley 27/2014: participación, directa o indirecta, de al menos el 75 % del capital (70 % si la participada cotiza) y la mayoría de los votos.
- [ ] Sí: basta con poseer al menos el 5 %
  El 5 % es el umbral de la exención de los dividendos (art. 21 LIS), no el de la consolidación fiscal.

### Respuesta
La **consolidación fiscal** (art. 58 de la Ley 27/2014, del Impuesto sobre Sociedades) exige que la dominante posea, directa o indirectamente, al menos el **75 %** del capital de la dependiente (el 70 % si cotiza) y la mayoría de los derechos de voto. Con el 74 %, no hay grupo fiscal; con el 100 %, sí: los gastos financieros de NewCo se compensan con los beneficios de Industria y se reduce el impuesto del grupo.

Con límites: los gastos financieros netos solo son deducibles hasta el **30 % del beneficio operativo** (con un mínimo de 1 M€), y la ley prevé un límite específico para la deuda de adquisición de participaciones (art. 16 LIS).

> 💡 Un 1 % puede cambiarlo todo: de nuevo, un umbral.

```scene
resaltar NEWCO TARGET
nota TARGET "75 % o más: consolidación fiscal posible"
```
## 5. El plan de incentivos para directivos
Los directivos agrupan sus participaciones en una sociedad común, **ManCo SL**. La consejera delegada posee el 60 % de ManCo; el director financiero, el 40 %.

Interés económico de la consejera delegada en Industria: 60 % × 10 % × 100 % = **6 %**. En la práctica, se añaden a menudo mecanismos ligados a los resultados (*ratchet*, participaciones privilegiadas) que aumentan la parte de los directivos si el fondo alcanza sus objetivos de rentabilidad.

```scene
quitar MGT
holding MANCO "ManCo SL (directivos)"
persona CEO "Consejera delegada"
persona CFO "Director financiero"
vinculo CEO -> MANCO 60%
vinculo CFO -> MANCO 40%
vinculo MANCO -> NEWCO 10%
vista CEO
resaltar MANCO
```
## 6. Cinco años después: la salida
Hipótesis: durante cinco años, la tesorería generada por Industria ha permitido pagar los intereses (≈ 13 M€) y devolver **30 M€** de deuda. A la salida, Industria vale **130 M€**.

| | Sin deuda | Con LBO |
|---|---|---|
| Inversión inicial | 100 M€ | 40 M€ |
| Tesorería repartida en 5 años | ≈ 43 M€ | 0 (sirve la deuda) |
| Valor de los fondos propios a la salida | 130 M€ | 130 − 30 = 100 M€ |
| Múltiplo (antes de impuestos) | ≈ × 1,7 | × 2,5 |

Es el **efecto apalancamiento financiero**: mientras la rentabilidad de la sociedad objetivo supere el coste de la deuda, el endeudamiento aumenta la rentabilidad de los fondos propios. Pero también funciona **a la baja**: si la actividad cae, la deuda sigue debiéndose y puede poner en dificultades a la empresa.

El fondo (90 %) recupera 90 M€ por 36 M€ invertidos; los directivos (10 %), 10 M€ por 4 M€, antes del *ratchet*.

```scene
vista LBO
nota NEWCO "Deuda pendiente: 30 M€"
nota TARGET "Valor: 130 M€"
```
## 7. Síntesis: las cuatro palancas
| Palanca | Mecanismo |
|---|---|
| **Financiera** | la deuda amplifica la rentabilidad de los fondos propios (y el riesgo) |
| **Jurídica** | la sociedad vehículo permite controlar el 100 % de la sociedad objetivo con una inversión limitada |
| **Fiscal** | la consolidación fiscal (75 % o más) compensa los intereses con los beneficios de la sociedad objetivo |
| **Directiva** | los directivos se convierten en socios e interesados en el éxito |

Haga clic en una entidad para volver a ver su análisis: control, cadena, interés económico.

```scene
vista LBO
seleccionar TARGET
```