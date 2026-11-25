---
droit: es
---
# Rondas de financiación y dilución
> Cómo los fundadores pierden la mayoría a medida que se suceden las ampliaciones de capital.

## 1. La constitución
Los dos fundadores, **Ana** y **Hugo**, poseen el 50 % cada uno de **Kiwi SL**. Atención: con un 50/50, ninguno controla por sí solo.

```scene
persona ANA "Ana"
persona HUGO "Hugo"
sociedad KIWI "Kiwi SL"
vinculo ANA -> KIWI 50%
vinculo HUGO -> KIWI 50%
resaltar KIWI
```
## 2. Un pacto entre fundadores
Ana y Hugo firman un **pacto de socios**: votarán siempre en el mismo sentido. **Controlan conjuntamente** Kiwi.

```scene
pacto FDR "Pacto de fundadores" ANA HUGO
resaltar KIWI
```
## 3. Ronda semilla: 20 %
Un *business angel* invierte y recibe el **20 %** del capital mediante una **ampliación de capital**.

En principio, cada socio tiene un **derecho de preferencia** sobre las nuevas participaciones, en proporción a las que ya posee (art. 304 LSC; en la SA se llama derecho de suscripción preferente). Para que entre el inversor, los fundadores **renuncian** a ejercerlo, o la junta acuerda **suprimirlo**, lo que en la SL exige 2/3 de los votos (art. 199 b LSC).

Los fundadores quedan **diluidos**: 50 % × 0,8 = 40 % cada uno. Juntos: 80 %.

```scene
persona ANGEL "Business angel"
vinculo ANA -> KIWI 40%
vinculo HUGO -> KIWI 40%
vinculo ANGEL -> KIWI 20%
resaltar ANGEL
```
## 4. Serie A: 25 %
Un fondo de capital riesgo suscribe el **25 %** del capital tras la operación. Todos los socios anteriores quedan diluidos en una cuarta parte: fundadores 30 % cada uno (60 % juntos), angel 15 %.

> 💡 Con el 60 %, los fundadores ya no alcanzan por sí solos los **2/3** necesarios para suprimir el derecho de preferencia en la próxima ronda: tendrán que convencer al angel o al fondo, o que cada socio renuncie a su derecho.

```scene
fondo VCA "Fondo Serie A"
vinculo ANA -> KIWI 30%
vinculo HUGO -> KIWI 30%
vinculo ANGEL -> KIWI 15%
vinculo VCA -> KIWI 25%
resaltar VCA
```
## Pregunta: tras una Serie B del 30 %, ¿siguen controlando Kiwi los fundadores?
Un fondo de crecimiento suscribe el **30 %** del capital tras la operación. Todos los socios anteriores se diluyen: sus porcentajes se multiplican por 0,7. El pacto de fundadores sigue vigente.

- [ ] Sí: el pacto reúne el 60 % de los votos
  Era antes de la Serie B: 60 % × 0,7 = 42 %.
- [x] No: el pacto solo reúne el 42 % de los votos
  21 % + 21 % = 42 %: menos de la mitad.
- [ ] Sí: siguen siendo el primer bloque
  Ser el primer bloque no basta: el control exige más del 50 % de los votos.

### Respuesta
Fundadores: 21 % cada uno (**42 %** juntos), angel 10,5 %, Serie A 17,5 %, Serie B 30 %.

El pacto de fundadores ya no basta: **nadie controla Kiwi**. Los fundadores siguen siendo el primer bloque, pero tienen que negociar.

```scene
fondo VCB "Fondo Serie B"
vinculo ANA -> KIWI 21%
vinculo HUGO -> KIWI 21%
vinculo ANGEL -> KIWI 10.5%
vinculo VCA -> KIWI 17.5%
vinculo VCB -> KIWI 30%
resaltar KIWI
nota KIWI "Fundadores: 42 % — sin control"
```
## 6. Conservar el poder pese a la dilución
Soluciones habituales en una SL, cuyos estatutos admiten una gran flexibilidad:
- **participaciones con voto plural** para los fundadores, si lo prevén los estatutos (art. 188.1 LSC), o participaciones **sin voto** para los inversores (art. 98 LSC);
- **ampliar el pacto**: el angel se suma al concierto (42 % + 10,5 % = **52,5 %**).

```scene
pacto FDR "Pacto fundadores + angel" ANA HUGO ANGEL
resaltar KIWI
```