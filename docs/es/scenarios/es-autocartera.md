---
droit: es
---
# Autocartera y participaciones recíprocas
> Cuando una sociedad posee sus propias acciones… y una familia se beneficia de ello.

## 1. Alfa y su familia fundadora
La familia Ruiz posee el **46 %** de Alfa SA; el resto está disperso entre muchos pequeños accionistas. Nadie tiene la mayoría absoluta: Alfa **no está controlada**.

```scene
persona RUIZ "Familia Ruiz"
sociedad ALFA "Alfa SA"
vinculo RUIZ -> ALFA 46%
resaltar ALFA
```
## 2. Alfa controla Beta
Alfa posee el **60 %** de Beta SA: la controla. Beta es una **filial** de Alfa, su **sociedad dominante**.

```scene
sociedad BETA "Beta SA"
vinculo ALFA -> BETA 60%
resaltar BETA
```
## Pregunta: Beta compra el 8 % de Alfa. ¿Controla ahora la familia Ruiz Alfa SA?
Beta adquiere el **8 %** del capital de Alfa, su propia dominante. La ley **suspende el derecho de voto** de las acciones de la dominante en manos de sus filiales, igual que el de las acciones propias (art. 148 a LSC): si no, los administradores de Alfa votarían… por sí mismos, con el dinero de la sociedad.

- [ ] No: sigue teniendo el 46 % de los votos
  Las acciones de Beta no votan: los votos ejercitables ya no son el 100 %.
- [x] No: tiene exactamente el 50 % de los votos, y el 50 % no basta
  46 / 92 = 50 %: le falta un voto para tener la mayoría.
- [ ] Sí: tiene más del 50 % de los votos
  Haga la cuenta: solo queda un 92 % de votos ejercitables, y 46 / 92 = 50 % exacto.

### Respuesta
Solo queda un **92 %** de votos ejercitables. La familia Ruiz pesa 46 / 92 = **50 %** de los votos: exactamente la mitad, **no más**. Un empate no da el control: Alfa sigue **sin controlar**.

```scene
vinculo BETA -> ALFA 8%
resaltar RUIZ ALFA
nota ALFA "8 % de votos suspendidos: la familia tiene el 50 % exacto"
```
## 4. La autocartera
Alfa recompra además el **2 %** de sus propias acciones (**autocartera**). Sus derechos de voto también quedan **en suspenso** (art. 148 a LSC).

Solo queda un 90 % de votos ejercitables: la familia pesa 46 / 90 = **51,1 %**. ¡**Toma el control** sin comprar una sola acción!

```scene
vinculo ALFA -> ALFA 2%
resaltar ALFA
nota ALFA "Autocartera 2 % + acciones en manos de la filial 8 %"
```
## 5. Las salvaguardas
- La adquisición de acciones propias o de la dominante está sometida a condiciones: autorización de la junta, patrimonio neto suficiente, acciones íntegramente desembolsadas (art. 146 LSC).
- En las **sociedades cotizadas**, las acciones propias y las de la dominante en manos de sus filiales no pueden superar en conjunto el **10 %** del capital suscrito (art. 509 LSC).
- Una filial no puede **suscribir** acciones de su dominante (art. 134 y siguientes LSC); las **participaciones recíprocas** entre sociedades están limitadas (art. 151 y siguientes LSC).
- Los derechos de voto de la autocartera y de las acciones de la dominante en manos de las filiales quedan **en suspenso** (art. 148 a LSC).

El punto de vista de la familia muestra además un **interés económico** de ≈ **49,4 %** en Alfa, superior a su 46 %: una parte del capital de Alfa se posee a sí misma, directamente o a través de Beta.

> 💡 En el lienzo, los vínculos de autocartera aparecen en **línea discontinua gris**: sus votos se neutralizan y los demás porcentajes se recalculan («efectivos»).

> ⚠️ Simplificación: el art. 148 b LSC computa las acciones propias en el capital para calcular el quórum y las mayorías de la junta. El lienzo, como el análisis del control, razona sobre los votos efectivamente ejercitables.

```scene
vista RUIZ
seleccionar ALFA
```