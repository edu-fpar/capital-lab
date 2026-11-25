/* ============================================================
 * Biblioteca de escenarios: derecho español (es), en español de España.
 * SA como forma de referencia; se señalan las diferencias de la SL.
 * Los bloques de comandos usan ~~~scene (sin acentos graves en las cadenas JS).
 * ============================================================ */
window.P = window.P || {};
P.LIBRARY = P.LIBRARY || [];
P.LIBRARY.push(

{ id: 'es-piramide', lang: 'es', droit: 'es', md: `---
droit: es
---
# La pirámide de sociedades holding
> Cómo una familia controla una gran sociedad cotizada con una pequeña parte de su capital.

Construimos paso a paso una **cascada de holdings**. En cada piso, la familia conserva la mayoría… pero su **interés económico** se reduce.

Fíjese en los colores: una entidad **teñida** está controlada por el accionista del mismo color.

## 1. La familia crea una holding
La familia García aporta sus participaciones a una holding, **García Participaciones SL**, de la que posee el **51 %** del capital. El 49 % restante pertenece a inversores externos (no representados: aparecen como «otros»).

Con más del 50 % de los votos, la familia adopta sola los acuerdos ordinarios de la junta general: **controla** la holding (art. 42 del Código de Comercio: mayoría de los derechos de voto).

~~~scene
persona FAM "Familia García"
holding H1 "García Participaciones SL"
vinculo FAM -> H1 51%
resaltar H1
~~~

## 2. Un segundo piso
La holding adquiere el **51 %** de una segunda holding, **García Industria SL**.

- La familia no posee *directamente* ninguna participación de García Industria.
- Pero controla García Participaciones, que controla García Industria: el control **se transmite** a lo largo de la cadena (el art. 42 CCom habla de control «directo o indirecto»).
- Su **interés económico** (su parte de los dividendos) es solo de 51 % × 51 % ≈ **26 %**.

El modo **punto de vista** (👁) muestra en cada entidad el interés y el control de la familia.

~~~scene
holding H2 "García Industria SL"
vinculo H1 -> H2 51%
vista FAM
resaltar H2
~~~

## 3. La sociedad cotizada
García Industria posee el **51 %** de **Alfa SA**, una gran sociedad cotizada.

La familia controla Alfa SA con un interés económico de 51 % × 51 % × 51 % ≈ **13,3 %**. El 86,7 % restante pertenece a otros inversores… que no tienen el poder.

> ⚠️ En la realidad, quien alcanza el 30 % de los votos de una cotizada debe formular una OPA (RD 1066/2007). Aquí suponemos que la participación se adquirió por una vía que no la exigía (por ejemplo, antes de la salida a bolsa).

~~~scene
sociedad ALFA "Alfa SA (cotizada)"
vinculo H2 -> ALFA 51%
resaltar ALFA
nota ALFA "Controlada con ≈ 13 % del capital económico"
~~~

## 4. Otro piso más
Alfa SA adquiere el 51 % de **Beta SL**. La familia controla ahora Beta con un interés de solo el **6,8 %**.

> 💡 Cada piso divide aproximadamente por dos el interés económico, sin diluir nunca el poder: es el **efecto multiplicador** de la pirámide.

~~~scene
sociedad BETA "Beta SL"
vinculo ALFA -> BETA 51%
resaltar BETA
~~~

## Pregunta: ¿qué poder tiene el Fondo Delta en Alfa SA?
El **Fondo Delta** posee el 49 % restante de García Participaciones: financia la pirámide casi tanto como la familia.

~~~scene
fondo DELTA "Fondo Delta"
vinculo DELTA -> H1 49%
vista ninguna
resaltar DELTA ALFA
~~~

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

~~~scene
vista DELTA
resaltar DELTA ALFA
~~~

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

~~~scene
vista FAM
seleccionar BETA
~~~
` },

{ id: 'es-mayorias', lang: 'es', droit: 'es', md: `---
droit: es
---
# Mayorías y minoría de bloqueo
> Más del 50 %, 2/3, más de 1/3: los umbrales que cambian el poder en la junta general, en la SA y en la SL.

En España, las mayorías de la junta general dependen de la **forma social**. En la **sociedad anónima** (SA) se calculan sobre el capital **presente o representado** en la junta; en la **sociedad de responsabilidad limitada** (SL), sobre los votos correspondientes a **todo el capital social**. Estos umbrales dibujan el mapa del poder.

## 1. Dos accionistas
Gamma SA tiene dos accionistas: **María (60 %)** y **Pablo (40 %)**.

María tiene la mayoría: nombra a los administradores, aprueba las cuentas y decide el reparto de dividendos. Los acuerdos ordinarios se adoptan por **mayoría simple** de los votos del capital presente o representado (art. 201.1 LSC).

~~~scene
persona MARIA "María"
persona PABLO "Pablo"
sociedad GAMMA "Gamma SA"
vinculo MARIA -> GAMMA 60%
vinculo PABLO -> GAMMA 40%
resaltar GAMMA
~~~

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

~~~scene
nota MARIA "Más del 50 %: decide sola, también para modificar estatutos"
resaltar MARIA
~~~

## 3. La misma sociedad, en forma de SL
Gamma se transforma en **Gamma SL**, con el mismo reparto. En la SL, las mayorías se calculan sobre **todo el capital**, haya o no asistido el socio:
- modificar los estatutos, aumentar o reducir el capital: **más de la mitad** de los votos de todas las participaciones (art. 199 a LSC). María puede hacerlo sola;
- transformación, fusión, escisión, cesión global de activo y pasivo, traslado del domicilio al extranjero, **supresión o limitación del derecho de preferencia**, exclusión de socios: al menos **2/3** de los votos (art. 199 b LSC).

~~~scene
renombrar GAMMA "Gamma SL"
resaltar GAMMA
~~~

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

~~~scene
nota PABLO "Más de 1/3: bloquea fusión, transformación…"
nota MARIA "Más del 50 %: decide los acuerdos ordinarios"
resaltar PABLO
~~~

## 5. Pablo cede un 7 %
Pablo vende un 7 % a María. María pasa al **67 %** (≥ 2/3): puede adoptar sola también los acuerdos del art. 199 b. Pablo baja al **33 %**… justo por debajo del tercio: **pierde** su minoría de bloqueo.

> 💡 Unas pocas participaciones pueden cambiar el equilibrio de poder: por eso los paquetes cercanos a los umbrales se negocian a menudo con una **prima de control**.

~~~scene
vinculo MARIA -> GAMMA 67%
vinculo PABLO -> GAMMA 33%
resaltar MARIA PABLO
~~~

## 6. La trampa del 50/50
¿Y si María y Pablo tuvieran el **50 %** cada uno? Nadie tiene *más del* 50 %: **ninguno controla**. Cada uno puede bloquear al otro: es la situación de **bloqueo** (*deadlock*).

Los socios prevén entonces un **pacto parasocial**: voto dirimente, cláusula de salida, mediación… Un bloqueo persistente de los órganos sociales es incluso causa legal de disolución (art. 363.1 d LSC).

~~~scene
vinculo MARIA -> GAMMA 50%
vinculo PABLO -> GAMMA 50%
resaltar GAMMA
nota GAMMA "50/50: nadie controla"
~~~

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

~~~scene
vinculo MARIA -> GAMMA 92%
vinculo PABLO -> GAMMA 8%
nota GAMMA "En una cotizada, 90 % o más: venta forzosa tras una OPA"
~~~
` },

{ id: 'es-derechos-voto', lang: 'es', droit: 'es', md: `---
droit: es
---
# Capital ≠ poder: acciones de lealtad y acciones sin voto
> Cómo tener el 35 % del capital… y más del 50 % de los votos.

Por regla general, el derecho de voto es **proporcional al capital**: en la SA, la ley prohíbe con carácter general las acciones que alteren esa proporción. Pero admite excepciones que separan capital y votos. El lienzo muestra entonces dos cifras en cada vínculo: el capital y los derechos de voto.

## 1. Una sociedad cotizada clásica
**Delta SA** cotiza en bolsa. Su fundador, **Juan**, posee el **35 %** del capital desde antes de la salida a bolsa; el resto (65 %) está en manos del público. Una acción = un voto: Juan es minoritario.

~~~scene
persona JUAN "Juan, fundador"
publico PUB "Accionistas del mercado"
sociedad DELTA "Delta SA (cotizada)"
vinculo JUAN -> DELTA 35%
vinculo PUB -> DELTA 65%
resaltar DELTA
~~~

## 2. Las acciones de lealtad
Desde la **Ley 5/2021**, los estatutos de una sociedad cotizada pueden atribuir un **voto doble** a cada acción que haya pertenecido al mismo accionista durante **dos años ininterrumpidos**, inscrita en un registro especial (art. 527 ter y siguientes LSC). No es automático: hace falta una cláusula estatutaria.

Delta SA ha adoptado esa cláusula y Juan conserva sus acciones desde hace años: sus 35 acciones valen **70 votos**. El público, que compra y vende, conserva 65 votos. Total: 135 votos.

- Juan: 70 / 135 = **51,85 %** de los votos → **control**.
- Público: 65 / 135 = 48,15 %.

> ⚠️ Simplificaciones: suponemos que ningún accionista del público ha inscrito sus acciones en el registro especial; tampoco se trata aquí la incidencia del voto doble en la obligación de formular una OPA al superar el 30 % de los votos.

~~~scene
vinculo JUAN -> DELTA capital=35 votes=51.85
vinculo PUB -> DELTA capital=65 votes=48.15
resaltar JUAN
nota JUAN "35 % del capital, 51,85 % de los votos"
~~~

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

~~~scene
fondo ACT "Fondo activista"
vinculo ACT -> DELTA capital=10 votes=7.41
vinculo PUB -> DELTA capital=55 votes=40.74
resaltar ACT
~~~

## 4. Las participaciones sin voto
Otra herramienta: las **acciones y participaciones sin voto** (art. 98 y siguientes LSC). A cambio de renunciar al voto, su titular recibe un **dividendo mínimo** fijado en los estatutos. Su importe nominal no puede superar la **mitad** del capital (en la SA, del capital desembolsado).

En la start-up **Nova SL**, la fundadora **Lucía** posee el 40 % del capital en participaciones ordinarias. Un fondo de capital riesgo posee el 60 %, del que el 50 % del capital son participaciones **sin voto**.

Votos: Lucía 40, fondo 10 → Lucía tiene el **80 %** de los votos con el 40 % del capital.

~~~scene
persona LUCIA "Lucía, fundadora"
fondo VC "Fondo de capital riesgo"
sociedad NOVA "Nova SL"
vinculo LUCIA -> NOVA capital=40 votes=80
vinculo VC -> NOVA capital=60 votes=20
resaltar NOVA
vista LUCIA
~~~

## 5. Para recordar
- El **control** se mide en **derechos de voto**; el **interés económico**, en **capital**.
- Herramientas de disociación: acciones de lealtad (cotizadas), acciones y participaciones sin voto y, en la **SL**, participaciones con voto plural si lo prevén los estatutos (art. 188.1 LSC).
- En modo libre, haga clic en un vínculo para ajustar por separado capital y derechos de voto.

~~~scene
vista ninguna
~~~
` },

{ id: 'es-autocartera', lang: 'es', droit: 'es', md: `---
droit: es
---
# Autocartera y participaciones recíprocas
> Cuando una sociedad posee sus propias acciones… y una familia se beneficia de ello.

## 1. Alfa y su familia fundadora
La familia Ruiz posee el **46 %** de Alfa SA; el resto está disperso entre muchos pequeños accionistas. Nadie tiene la mayoría absoluta: Alfa **no está controlada**.

~~~scene
persona RUIZ "Familia Ruiz"
sociedad ALFA "Alfa SA"
vinculo RUIZ -> ALFA 46%
resaltar ALFA
~~~

## 2. Alfa controla Beta
Alfa posee el **60 %** de Beta SA: la controla. Beta es una **filial** de Alfa, su **sociedad dominante**.

~~~scene
sociedad BETA "Beta SA"
vinculo ALFA -> BETA 60%
resaltar BETA
~~~

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

~~~scene
vinculo BETA -> ALFA 8%
resaltar RUIZ ALFA
nota ALFA "8 % de votos suspendidos: la familia tiene el 50 % exacto"
~~~

## 4. La autocartera
Alfa recompra además el **2 %** de sus propias acciones (**autocartera**). Sus derechos de voto también quedan **en suspenso** (art. 148 a LSC).

Solo queda un 90 % de votos ejercitables: la familia pesa 46 / 90 = **51,1 %**. ¡**Toma el control** sin comprar una sola acción!

~~~scene
vinculo ALFA -> ALFA 2%
resaltar ALFA
nota ALFA "Autocartera 2 % + acciones en manos de la filial 8 %"
~~~

## 5. Las salvaguardas
- La adquisición de acciones propias o de la dominante está sometida a condiciones: autorización de la junta, patrimonio neto suficiente, acciones íntegramente desembolsadas (art. 146 LSC).
- En las **sociedades cotizadas**, las acciones propias y las de la dominante en manos de sus filiales no pueden superar en conjunto el **10 %** del capital suscrito (art. 509 LSC).
- Una filial no puede **suscribir** acciones de su dominante (art. 134 y siguientes LSC); las **participaciones recíprocas** entre sociedades están limitadas (art. 151 y siguientes LSC).
- Los derechos de voto de la autocartera y de las acciones de la dominante en manos de las filiales quedan **en suspenso** (art. 148 a LSC).

El punto de vista de la familia muestra además un **interés económico** de ≈ **49,4 %** en Alfa, superior a su 46 %: una parte del capital de Alfa se posee a sí misma, directamente o a través de Beta.

> 💡 En el lienzo, los vínculos de autocartera aparecen en **línea discontinua gris**: sus votos se neutralizan y los demás porcentajes se recalculan («efectivos»).

> ⚠️ Simplificación: el art. 148 b LSC computa las acciones propias en el capital para calcular el quórum y las mayorías de la junta. El lienzo, como el análisis del control, razona sobre los votos efectivamente ejercitables.

~~~scene
vista RUIZ
seleccionar ALFA
~~~
` },

{ id: 'es-concierto', lang: 'es', droit: 'es', md: `---
droit: es
---
# Actuación concertada: controlar entre varios
> Dos minoritarios que se ponen de acuerdo pueden controlar juntos… y verse obligados a lanzar una OPA.

## 1. Un capital fragmentado
Omega SA cotiza en bolsa: **A Inversiones SL** posee el 28 %, **B Capital** el 24 % y el mercado el 48 %. Ningún bloque supera el 50 %: Omega **no está controlada**. Ninguno alcanza tampoco el **30 %**, umbral de la OPA obligatoria.

~~~scene
holding A "A Inversiones SL"
fondo B "B Capital"
publico PUB "Mercado"
sociedad OMEGA "Omega SA (cotizada)"
vinculo A -> OMEGA 28%
vinculo B -> OMEGA 24%
vinculo PUB -> OMEGA 48%
resaltar OMEGA
~~~

## 2. El pacto parasocial
A Inversiones y B Capital firman un **pacto parasocial**: se comprometen a votar en el mismo sentido para llevar a cabo una política común duradera. **Actúan de forma concertada** (RD 1066/2007, art. 5): sus derechos de voto se suman.

Juntos reúnen el 52 % de los votos: **controlan conjuntamente** Omega.

> 💡 En las cotizadas, los pactos parasociales que regulan el voto deben comunicarse a la sociedad y a la CNMV y hacerse públicos (art. 530 y 531 LSC).

~~~scene
pacto PACTO "Pacto Omega" A B
resaltar OMEGA
nota OMEGA "Control conjunto: 28 % + 24 %"
~~~

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

~~~scene
nota OMEGA "Concierto: 52 % ≥ 30 % → OPA obligatoria"
resaltar A B OMEGA
~~~

## 4. ¿Quién está detrás de A Inversiones?
A Inversiones está participada al 70 % por la **Sra. Durán**. La Sra. Durán controla A Inversiones y participa así, a través de ella, en el control conjunto de Omega.

El punto de vista de la Sra. Durán muestra su interés económico en Omega: 70 % × 28 % = **19,6 %**.

~~~scene
persona DURAN "Sra. Durán"
vinculo DURAN -> A 70%
vista DURAN
resaltar A
~~~

## 5. Fin del pacto
El pacto se resuelve. Cada uno recupera su libertad de voto: Omega vuelve a estar **sin control**.

> ⚠️ Simplificación: el régimen de la OPA es más complejo (precio equitativo, dispensas, OPA voluntaria previa…). El lienzo calcula el bloque concertado, no las obligaciones bursátiles.

~~~scene
quitar PACTO
vista ninguna
resaltar OMEGA
~~~
` },

{ id: 'es-consolidacion', lang: 'es', droit: 'es', md: `---
droit: es
---
# Perímetro de consolidación
> Integración global, método de la participación… y la diferencia entre porcentaje de control y porcentaje de interés.

En España, un **grupo** existe cuando una sociedad dominante ostenta o puede ostentar, directa o indirectamente, el **control** de otra u otras (art. 42 del Código de Comercio). La dominante formula **cuentas anuales consolidadas**: con las **NIIF adoptadas por la UE** si el grupo tiene valores cotizados, y con las **Normas para la Formulación de Cuentas Anuales Consolidadas** (NOFCAC, RD 1159/2010) en los demás casos.

## 1. La sociedad dominante
**Matriz SA** posee tres participaciones directas. Según el grado de control, cada una recibirá un tratamiento distinto en las cuentas consolidadas.

~~~scene
sociedad M "Matriz SA"
sociedad F1 "Filial 1"
sociedad F2 "Asociada 2"
sociedad F3 "Participada 3"
vinculo M -> F1 80%
vinculo M -> F2 30%
vinculo M -> F3 8%
vista M
~~~

## 2. Control → integración global
Con el 80 % de los votos, Matriz SA controla la **Filial 1**, una sociedad **dependiente**: sus cuentas se incorporan **al 100 %** (integración global). El 20 % de los demás accionistas aparece como **socios externos** (NOFCAC) o **participaciones no dominantes** (NIIF).

~~~scene
resaltar F1
nota F1 "Integración global"
~~~

## 3. Influencia significativa → método de la participación
Con al menos el **20 %** de los votos, se presume una **influencia significativa** (NIC 28; regla equivalente en las normas españolas): Asociada 2 es una **sociedad asociada**, que se registra por el **método de la participación** (puesta en equivalencia): solo se incorpora la parte del patrimonio neto y del resultado que corresponde al grupo.

Por debajo del 20 %, Participada 3 sigue siendo una simple inversión financiera, **no consolidada**.

~~~scene
resaltar F2 F3
nota F2 "Método de la participación"
nota F3 "No consolidada"
~~~

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

~~~scene
sociedad SF "Subfilial"
vinculo F1 -> SF 60%
resaltar SF
nota SF "Control 60 % · Interés 48 %"
~~~

## 5. Control conjunto → negocio conjunto
Matriz SA y un socio industrial crean **JV Co** al 50/50, con un pacto que exige la unanimidad para las decisiones clave: es un **control conjunto**. Con las NIIF (NIIF 11), un **negocio conjunto** se registra por el método de la participación; con las NOFCAC, una **sociedad multigrupo** puede integrarse **proporcionalmente** o por el método de la participación.

> ⚠️ El lienzo representa el acuerdo como un pacto; no verifica la exigencia contractual de unanimidad.

~~~scene
sociedad PART "Socio industrial"
sociedad JV "JV Co"
vinculo M -> JV 50%
vinculo PART -> JV 50%
pacto PACTO_JV "Pacto JV" M PART
resaltar JV
~~~
` },

{ id: 'es-dilucion', lang: 'es', droit: 'es', md: `---
droit: es
---
# Rondas de financiación y dilución
> Cómo los fundadores pierden la mayoría a medida que se suceden las ampliaciones de capital.

## 1. La constitución
Los dos fundadores, **Ana** y **Hugo**, poseen el 50 % cada uno de **Kiwi SL**. Atención: con un 50/50, ninguno controla por sí solo.

~~~scene
persona ANA "Ana"
persona HUGO "Hugo"
sociedad KIWI "Kiwi SL"
vinculo ANA -> KIWI 50%
vinculo HUGO -> KIWI 50%
resaltar KIWI
~~~

## 2. Un pacto entre fundadores
Ana y Hugo firman un **pacto de socios**: votarán siempre en el mismo sentido. **Controlan conjuntamente** Kiwi.

~~~scene
pacto FDR "Pacto de fundadores" ANA HUGO
resaltar KIWI
~~~

## 3. Ronda semilla: 20 %
Un *business angel* invierte y recibe el **20 %** del capital mediante una **ampliación de capital**.

En principio, cada socio tiene un **derecho de preferencia** sobre las nuevas participaciones, en proporción a las que ya posee (art. 304 LSC; en la SA se llama derecho de suscripción preferente). Para que entre el inversor, los fundadores **renuncian** a ejercerlo, o la junta acuerda **suprimirlo**, lo que en la SL exige 2/3 de los votos (art. 199 b LSC).

Los fundadores quedan **diluidos**: 50 % × 0,8 = 40 % cada uno. Juntos: 80 %.

~~~scene
persona ANGEL "Business angel"
vinculo ANA -> KIWI 40%
vinculo HUGO -> KIWI 40%
vinculo ANGEL -> KIWI 20%
resaltar ANGEL
~~~

## 4. Serie A: 25 %
Un fondo de capital riesgo suscribe el **25 %** del capital tras la operación. Todos los socios anteriores quedan diluidos en una cuarta parte: fundadores 30 % cada uno (60 % juntos), angel 15 %.

> 💡 Con el 60 %, los fundadores ya no alcanzan por sí solos los **2/3** necesarios para suprimir el derecho de preferencia en la próxima ronda: tendrán que convencer al angel o al fondo, o que cada socio renuncie a su derecho.

~~~scene
fondo VCA "Fondo Serie A"
vinculo ANA -> KIWI 30%
vinculo HUGO -> KIWI 30%
vinculo ANGEL -> KIWI 15%
vinculo VCA -> KIWI 25%
resaltar VCA
~~~

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

~~~scene
fondo VCB "Fondo Serie B"
vinculo ANA -> KIWI 21%
vinculo HUGO -> KIWI 21%
vinculo ANGEL -> KIWI 10.5%
vinculo VCA -> KIWI 17.5%
vinculo VCB -> KIWI 30%
resaltar KIWI
nota KIWI "Fundadores: 42 % — sin control"
~~~

## 6. Conservar el poder pese a la dilución
Soluciones habituales en una SL, cuyos estatutos admiten una gran flexibilidad:
- **participaciones con voto plural** para los fundadores, si lo prevén los estatutos (art. 188.1 LSC), o participaciones **sin voto** para los inversores (art. 98 LSC);
- **ampliar el pacto**: el angel se suma al concierto (42 % + 10,5 % = **52,5 %**).

~~~scene
pacto FDR "Pacto fundadores + angel" ANA HUGO ANGEL
resaltar KIWI
~~~
` },

{ id: 'es-lbo', lang: 'es', droit: 'es', md: `---
droit: es
---
# LBO: comprar una empresa con apalancamiento
> Sociedad vehículo, deuda de adquisición, consolidación fiscal y plan de incentivos para directivos.

Un **LBO** (*leveraged buy-out*, compra apalancada) es la adquisición de una sociedad por una **sociedad vehículo** que financia la compra en parte con **deuda**. La deuda se devuelve después con los dividendos que la sociedad adquirida reparte a la sociedad vehículo.

> ⚠️ El lienzo muestra las **participaciones** (capital y poder). La deuda bancaria no es una participación: aparece en las notas y los comentarios. Los importes son ejemplos simplificados.

## 1. La sociedad objetivo
**Industria SL** pertenece al 100 % a su fundador, el Sr. Moreno, que quiere vender. Precio acordado: **100 M€** (para simplificar, suponemos que la sociedad objetivo no tiene deuda).

~~~scene
persona MORENO "Sr. Moreno (fundador)"
sociedad TARGET "Industria SL"
vinculo MORENO -> TARGET 100%
resaltar TARGET
nota TARGET "Precio: 100 M€"
~~~

## 2. La sociedad vehículo
Un fondo de capital privado constituye una sociedad nueva, **NewCo SL** (sociedad vehículo o *holding* de adquisición). Aporta **36 M€** y el equipo directivo **4 M€**: 40 M€ de fondos propios en total.

Fondo: **90 %** del capital; directivos: **10 %**. El fondo controla NewCo.

~~~scene
fondo LBO "Fondo de capital privado"
persona MGT "Equipo directivo"
holding NEWCO "NewCo SL (sociedad vehículo)"
vinculo LBO -> NEWCO 90%
vinculo MGT -> NEWCO 10%
resaltar NEWCO
nota NEWCO "Fondos propios: 40 M€"
~~~

## 3. La deuda de adquisición y la compra
NewCo pide prestados **60 M€** a los bancos y compra el **100 %** de Industria por 100 M€ (40 M€ de fondos propios + 60 M€ de deuda).

Es **NewCo** quien se endeuda, no la sociedad objetivo: una SL no puede anticipar fondos, conceder préstamos, prestar garantías ni facilitar asistencia financiera para que un tercero adquiera sus propias participaciones (prohibición de **asistencia financiera**, art. 143.2 LSC; para la SA, art. 150 LSC).

El fondo controla ahora Industria **al 100 %** habiendo aportado solo 36 M€: la sociedad vehículo (palanca **jurídica**) y la deuda (palanca **financiera**) se combinan.

~~~scene
quitar MORENO
vinculo NEWCO -> TARGET 100%
vista LBO
resaltar TARGET
nota NEWCO "Deuda de adquisición: 60 M€"
~~~

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

~~~scene
resaltar NEWCO TARGET
nota TARGET "75 % o más: consolidación fiscal posible"
~~~

## 5. El plan de incentivos para directivos
Los directivos agrupan sus participaciones en una sociedad común, **ManCo SL**. La consejera delegada posee el 60 % de ManCo; el director financiero, el 40 %.

Interés económico de la consejera delegada en Industria: 60 % × 10 % × 100 % = **6 %**. En la práctica, se añaden a menudo mecanismos ligados a los resultados (*ratchet*, participaciones privilegiadas) que aumentan la parte de los directivos si el fondo alcanza sus objetivos de rentabilidad.

~~~scene
quitar MGT
holding MANCO "ManCo SL (directivos)"
persona CEO "Consejera delegada"
persona CFO "Director financiero"
vinculo CEO -> MANCO 60%
vinculo CFO -> MANCO 40%
vinculo MANCO -> NEWCO 10%
vista CEO
resaltar MANCO
~~~

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

~~~scene
vista LBO
nota NEWCO "Deuda pendiente: 30 M€"
nota TARGET "Valor: 130 M€"
~~~

## 7. Síntesis: las cuatro palancas
| Palanca | Mecanismo |
|---|---|
| **Financiera** | la deuda amplifica la rentabilidad de los fondos propios (y el riesgo) |
| **Jurídica** | la sociedad vehículo permite controlar el 100 % de la sociedad objetivo con una inversión limitada |
| **Fiscal** | la consolidación fiscal (75 % o más) compensa los intereses con los beneficios de la sociedad objetivo |
| **Directiva** | los directivos se convierten en socios e interesados en el éxito |

Haga clic en una entidad para volver a ver su análisis: control, cadena, interés económico.

~~~scene
vista LBO
seleccionar TARGET
~~~
` },

{ id: 'es-niif', lang: 'es', droit: 'es', md: `---
droit: es
---
# NIIF: control, perímetro y variaciones del porcentaje
> NIIF 10, NIIF 11, NIC 28 y NIIF 3: lo que cambia cada compra o venta de acciones en las cuentas consolidadas.

Los grupos con valores admitidos a negociación en un mercado regulado de la UE formulan sus cuentas consolidadas con las **NIIF adoptadas por la Unión Europea** (Reglamento (CE) n.º 1606/2002).

> ⚠️ **Lo que muestra la herramienta, y lo que no.** La NIIF 10 define el control con tres elementos: el **poder** sobre la participada, la **exposición a rendimientos variables** y la **capacidad de utilizar ese poder** para influir en esos rendimientos. La herramienta razona sobre los **derechos de voto**, que es el caso más frecuente, pero no el único. Las situaciones en que el control no procede de los votos (contratos, entidades estructuradas, derechos de voto potenciales, una minoría importante frente a un accionariado disperso) requieren **juicio** y no se calculan.

## 1. Una dependiente: control e integración global
Matriz SA posee el **60 %** de los derechos de voto de la Filial A. Salvo circunstancias particulares, la mayoría de los votos da el poder: Matriz SA **controla** A (NIIF 10).

A se consolida por **integración global**: el 100 % de sus activos, pasivos, ingresos y gastos entra en las cuentas del grupo. El 40 % en manos de otros accionistas aparece como **participaciones no dominantes** (*non-controlling interests*), dentro del patrimonio neto.

~~~scene
sociedad M "Matriz SA"
sociedad A "Filial A"
vinculo M -> A 60%
vista M
resaltar A
nota A "Integración global · participaciones no dominantes 40 %"
~~~

## 2. Una subfilial: control en cadena, interés diluido
A posee el **70 %** de la Subfilial B. Matriz SA controla A, que controla B: B también se consolida por **integración global**.

Pero la parte del grupo en B es solo de 60 % × 70 % = **42 %**. Las participaciones no dominantes de B representan el **58 %**: un 30 % de accionistas directos de B + 40 % × 70 % = 28 % que corresponde indirectamente a los minoritarios de A.

> 💡 En consolidación, se integra según el **control**, pero los resultados se reparten según el **interés**.

~~~scene
sociedad B "Subfilial B"
vinculo A -> B 70%
resaltar B
nota B "Control ✔ · parte del grupo 42 %"
~~~

## 3. Influencia significativa y negocio conjunto
- Matriz SA posee el **25 %** de C: con el 20 % o más de los votos, se presume una **influencia significativa** (NIC 28, presunción refutable). C es una **asociada**, registrada por el **método de la participación**.
- Matriz SA y un socio poseen cada uno el **50 %** de JV Co, con un acuerdo que exige su **consentimiento unánime** para las decisiones sobre las actividades relevantes: es un **control conjunto** (NIIF 11). Si el acuerdo da derechos sobre los activos netos, es un **negocio conjunto**, registrado por el método de la participación; si da derechos sobre los activos y obligaciones por los pasivos, es una **operación conjunta**, que se registra según la parte que corresponde a cada partícipe.

En el lienzo, el acuerdo se representa con un pacto. Atención: en la NIIF 11 lo que cuenta es la **unanimidad contractual**, que la herramienta no verifica.

~~~scene
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
~~~

## 4. Matriz SA compra un 20 % de A a los minoritarios
Matriz SA pasa del 60 % al **80 %** de A. El control no cambia: según la NIIF 10, es una **transacción entre propietarios**, registrada **en el patrimonio neto**. Sin nuevo fondo de comercio y sin resultado: simplemente se reclasifica una parte de las participaciones no dominantes a la parte del grupo.

Efecto en cadena: la parte del grupo en B pasa a 80 % × 70 % = **56 %**.

~~~scene
vinculo M -> A 80%
resaltar A B
nota A "Sin cambio de control: patrimonio neto"
~~~

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

~~~scene
vinculo M -> C 55%
resaltar C
nota C "NIIF 3: revalorización del 25 % anterior"
~~~

## 6. Pérdida de control
Matriz SA vende parte de A y pasa del 80 % al **30 %**. **Pierde el control** (NIIF 10):
- da de baja los activos, los pasivos y las participaciones no dominantes de A, **y los de B**, que solo controlaba a través de A;
- la participación conservada (30 %) se **revalúa a valor razonable**; el resultado de la venta va a **resultados**;
- después, si se confirma la influencia significativa, A (con su filial B) se registra por el método de la participación.

Observe el lienzo: A y B pierden el color de Matriz SA. B sigue controlada… por A.

~~~scene
vinculo M -> A 30%
resaltar A B
nota A "Pérdida de control: baja del perímetro"
~~~

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

~~~scene
vista M
seleccionar B
~~~
` }

);
