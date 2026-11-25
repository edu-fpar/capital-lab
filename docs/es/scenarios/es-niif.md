---
droit: es
---
# NIIF: control, perímetro y variaciones del porcentaje
> NIIF 10, NIIF 11, NIC 28 y NIIF 3: lo que cambia cada compra o venta de acciones en las cuentas consolidadas.

Los grupos con valores admitidos a negociación en un mercado regulado de la UE formulan sus cuentas consolidadas con las **NIIF adoptadas por la Unión Europea** (Reglamento (CE) n.º 1606/2002).

> ⚠️ **Lo que muestra la herramienta, y lo que no.** La NIIF 10 define el control con tres elementos: el **poder** sobre la participada, la **exposición a rendimientos variables** y la **capacidad de utilizar ese poder** para influir en esos rendimientos. La herramienta razona sobre los **derechos de voto**, que es el caso más frecuente, pero no el único. Las situaciones en que el control no procede de los votos (contratos, entidades estructuradas, derechos de voto potenciales, una minoría importante frente a un accionariado disperso) requieren **juicio** y no se calculan.

## 1. Una dependiente: control e integración global
Matriz SA posee el **60 %** de los derechos de voto de la Filial A. Salvo circunstancias particulares, la mayoría de los votos da el poder: Matriz SA **controla** A (NIIF 10).

A se consolida por **integración global**: el 100 % de sus activos, pasivos, ingresos y gastos entra en las cuentas del grupo. El 40 % en manos de otros accionistas aparece como **participaciones no dominantes** (*non-controlling interests*), dentro del patrimonio neto.

```scene
sociedad M "Matriz SA"
sociedad A "Filial A"
vinculo M -> A 60%
vista M
resaltar A
nota A "Integración global · participaciones no dominantes 40 %"
```
## 2. Una subfilial: control en cadena, interés diluido
A posee el **70 %** de la Subfilial B. Matriz SA controla A, que controla B: B también se consolida por **integración global**.

Pero la parte del grupo en B es solo de 60 % × 70 % = **42 %**. Las participaciones no dominantes de B representan el **58 %**: un 30 % de accionistas directos de B + 40 % × 70 % = 28 % que corresponde indirectamente a los minoritarios de A.

> 💡 En consolidación, se integra según el **control**, pero los resultados se reparten según el **interés**.

```scene
sociedad B "Subfilial B"
vinculo A -> B 70%
resaltar B
nota B "Control ✔ · parte del grupo 42 %"
```
## 3. Influencia significativa y negocio conjunto
- Matriz SA posee el **25 %** de C: con el 20 % o más de los votos, se presume una **influencia significativa** (NIC 28, presunción refutable). C es una **asociada**, registrada por el **método de la participación**.
- Matriz SA y un socio poseen cada uno el **50 %** de JV Co, con un acuerdo que exige su **consentimiento unánime** para las decisiones sobre las actividades relevantes: es un **control conjunto** (NIIF 11). Si el acuerdo da derechos sobre los activos netos, es un **negocio conjunto**, registrado por el método de la participación; si da derechos sobre los activos y obligaciones por los pasivos, es una **operación conjunta**, que se registra según la parte que corresponde a cada partícipe.

En el lienzo, el acuerdo se representa con un pacto. Atención: en la NIIF 11 lo que cuenta es la **unanimidad contractual**, que la herramienta no verifica.

```scene
sociedad C "Asociada C"
vinculo M -> C 25%
sociedad PART "Socio"
sociedad JV "JV Co"
vinculo M -> JV 50%
vinculo PART -> JV 50%
pacto ACUERDO "Acuerdo conjunto (unanimidad)" M PART
resaltar C JV
nota C "NIC 28: método de la participación"
nota JV "NIIF 11: negocio conjunto"
```
## 4. Matriz SA compra un 20 % de A a los minoritarios
Matriz SA pasa del 60 % al **80 %** de A. El control no cambia: según la NIIF 10, es una **transacción entre propietarios**, registrada **en el patrimonio neto**. Sin nuevo fondo de comercio y sin resultado: simplemente se reclasifica una parte de las participaciones no dominantes a la parte del grupo.

Efecto en cadena: la parte del grupo en B pasa a 80 % × 70 % = **56 %**.

```scene
vinculo M -> A 80%
resaltar A B
nota A "Sin cambio de control: patrimonio neto"
```
## Pregunta: Matriz SA pasa del 25 % al 55 % de C. ¿Qué ocurre en las cuentas consolidadas?
Matriz SA compra un 30 % adicional de la Asociada C.

- [ ] Nada especial: se suma el coste de las nuevas acciones a la participación
  Al superar el 50 % de los votos, Matriz SA toma el control: C deja de ser una asociada.
- [x] Es una combinación de negocios: el 25 % anterior se revalúa a valor razonable y C pasa a integración global
  Es una adquisición por etapas (NIIF 3): la diferencia de revalorización va a resultados.
- [ ] Es una transacción entre propietarios, registrada en el patrimonio neto
  Ese tratamiento corresponde a las variaciones de porcentaje sin cambio de control, como en el paso anterior.

### Respuesta
Matriz SA toma el **control** de C. Es una **combinación de negocios** (NIIF 3), reconocida en la fecha de toma de control:
- la participación del 25 % ya poseída se **revalúa a valor razonable**, y la diferencia va a **resultados**;
- el fondo de comercio se calcula en esa fecha;
- C pasa del método de la participación a la **integración global**.

```scene
vinculo M -> C 55%
resaltar C
nota C "NIIF 3: revalorización del 25 % anterior"
```
## 6. Pérdida de control
Matriz SA vende parte de A y pasa del 80 % al **30 %**. **Pierde el control** (NIIF 10):
- da de baja los activos, los pasivos y las participaciones no dominantes de A, **y los de B**, que solo controlaba a través de A;
- la participación conservada (30 %) se **revalúa a valor razonable**; el resultado de la venta va a **resultados**;
- después, si se confirma la influencia significativa, A (con su filial B) se registra por el método de la participación.

Observe el lienzo: A y B pierden el color de Matriz SA. B sigue controlada… por A.

```scene
vinculo M -> A 30%
resaltar A B
nota A "Pérdida de control: baja del perímetro"
```
## 7. Lo que el lienzo no muestra
| Noción NIIF | En la herramienta |
|---|---|
| Control por la mayoría de los derechos de voto | ✔ calculado |
| Control en cadena, parte del grupo, participaciones no dominantes | ✔ calculados (punto de vista, análisis) |
| Influencia significativa (20 % o más) | ✔ presunción solamente |
| Control conjunto (NIIF 11) | ≈ representado por un pacto; la unanimidad no se verifica |
| Control de hecho con una minoría importante | ✘ juicio caso por caso |
| Derechos de voto potenciales (opciones, convertibles) | ✘ no modelizados |
| Entidades estructuradas, control contractual, agente o principal | ✘ no modelizados |
| Fondo de comercio, valor razonable, resultado de la venta | ✘ cifras que se calculan aparte |

La herramienta sirve, pues, para visualizar el **perímetro** y el efecto de las **variaciones del porcentaje**; la valoración contable se hace aparte.

```scene
vista M
seleccionar B
```