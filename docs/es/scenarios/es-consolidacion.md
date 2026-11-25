---
droit: es
---
# Perímetro de consolidación
> Integración global, método de la participación… y la diferencia entre porcentaje de control y porcentaje de interés.

En España, un **grupo** existe cuando una sociedad dominante ostenta o puede ostentar, directa o indirectamente, el **control** de otra u otras (art. 42 del Código de Comercio). La dominante formula **cuentas anuales consolidadas**: con las **NIIF adoptadas por la UE** si el grupo tiene valores cotizados, y con las **Normas para la Formulación de Cuentas Anuales Consolidadas** (NOFCAC, RD 1159/2010) en los demás casos.

## 1. La sociedad dominante
**Matriz SA** posee tres participaciones directas. Según el grado de control, cada una recibirá un tratamiento distinto en las cuentas consolidadas.

```scene
sociedad M "Matriz SA"
sociedad F1 "Filial 1"
sociedad F2 "Asociada 2"
sociedad F3 "Participada 3"
vinculo M -> F1 80%
vinculo M -> F2 30%
vinculo M -> F3 8%
vista M
```
## 2. Control → integración global
Con el 80 % de los votos, Matriz SA controla la **Filial 1**, una sociedad **dependiente**: sus cuentas se incorporan **al 100 %** (integración global). El 20 % de los demás accionistas aparece como **socios externos** (NOFCAC) o **participaciones no dominantes** (NIIF).

```scene
resaltar F1
nota F1 "Integración global"
```
## 3. Influencia significativa → método de la participación
Con al menos el **20 %** de los votos, se presume una **influencia significativa** (NIC 28; regla equivalente en las normas españolas): Asociada 2 es una **sociedad asociada**, que se registra por el **método de la participación** (puesta en equivalencia): solo se incorpora la parte del patrimonio neto y del resultado que corresponde al grupo.

Por debajo del 20 %, Participada 3 sigue siendo una simple inversión financiera, **no consolidada**.

```scene
resaltar F2 F3
nota F2 "Método de la participación"
nota F3 "No consolidada"
```
## Pregunta: Filial 1 adquiere el 60 % de una Subfilial. ¿Cómo la trata Matriz SA?
Matriz SA posee el 80 % de Filial 1, que adquiere el **60 %** de la **Subfilial**.

- [ ] Método de la participación: el grupo solo tiene el 48 %
  El 48 % es el porcentaje de interés; el método de consolidación depende del control.
- [x] Integración global: el grupo la controla a través de Filial 1
  Matriz SA controla Filial 1, que controla la Subfilial con el 60 % de los votos.
- [ ] No se consolida: Matriz SA no posee ninguna participación directa
  El control indirecto, a través de una dependiente, también cuenta (art. 42 CCom).

### Respuesta
- **Porcentaje de control** de Matriz SA: 60 % (los votos de la sociedad que controla) → **integración global**.
- **Porcentaje de interés**: 80 % × 60 % = **48 %** → es la parte del resultado que corresponde al grupo; el 52 % restante corresponde a los socios externos.

```scene
sociedad SF "Subfilial"
vinculo F1 -> SF 60%
resaltar SF
nota SF "Control 60 % · Interés 48 %"
```
## 5. Control conjunto → negocio conjunto
Matriz SA y un socio industrial crean **JV Co** al 50/50, con un pacto que exige la unanimidad para las decisiones clave: es un **control conjunto**. Con las NIIF (NIIF 11), un **negocio conjunto** se registra por el método de la participación; con las NOFCAC, una **sociedad multigrupo** puede integrarse **proporcionalmente** o por el método de la participación.

> ⚠️ El lienzo representa el acuerdo como un pacto; no verifica la exigencia contractual de unanimidad.

```scene
sociedad PART "Socio industrial"
sociedad JV "JV Co"
vinculo M -> JV 50%
vinculo PART -> JV 50%
pacto PACTO_JV "Pacto JV" M PART
resaltar JV
```