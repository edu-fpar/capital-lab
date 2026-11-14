# Levées de fonds et dilution
> Comment les fondateurs perdent la majorité au fil des augmentations de capital.

## 1. La création
Les deux fondateurs, **Ana** et **Hugo**, détiennent 50 % chacun de **Kiwi SAS**. Attention : à 50/50, aucun ne contrôle seul !

```scene
personne ANA "Ana"
personne HUGO "Hugo"
societe KIWI "Kiwi SAS"
lien ANA -> KIWI 50%
lien HUGO -> KIWI 50%
focus KIWI
```
## 2. Un pacte entre fondateurs
Ana et Hugo signent un pacte d'associés : ils votent toujours ensemble. Ils **contrôlent conjointement** Kiwi.

```scene
concert FDR "Pacte des fondateurs" ANA HUGO
focus KIWI
```
## 3. Tour d'amorçage : 20 %
Un business angel investit et reçoit **20 %** du capital via une augmentation de capital. Les fondateurs sont **dilués** : 50 % × 0,8 = 40 % chacun. Ensemble : 80 %.

```scene
personne ANGEL "Business angel"
lien ANA -> KIWI 40%
lien HUGO -> KIWI 40%
lien ANGEL -> KIWI 20%
focus ANGEL
```
## 4. Série A : 25 %
Un fonds de capital-risque souscrit **25 %** du capital après l'opération. Tous les anciens sont dilués d'un quart : fondateurs 30 % chacun (60 % ensemble), angel 15 %.

```scene
fonds VCA "Fonds Série A"
lien ANA -> KIWI 30%
lien HUGO -> KIWI 30%
lien ANGEL -> KIWI 15%
lien VCA -> KIWI 25%
focus VCA
```
## 5. Série B : 30 %
Nouveau tour : un fonds de croissance prend **30 %**. Fondateurs : 21 % chacun (**42 %** ensemble), angel 10,5 %, Série A 17,5 %.

Le pacte des fondateurs ne suffit plus : **plus personne ne contrôle Kiwi**. Les fondateurs restent le premier bloc, mais doivent composer.

```scene
fonds VCB "Fonds Série B"
lien ANA -> KIWI 21%
lien HUGO -> KIWI 21%
lien ANGEL -> KIWI 10.5%
lien VCA -> KIWI 17.5%
lien VCB -> KIWI 30%
focus KIWI
note KIWI "Fondateurs : 42 % — plus de contrôle"
```
## 6. Garder le pouvoir malgré la dilution
Solutions classiques en SAS, où les statuts sont très libres :
- **actions de préférence** à droits de vote multiples pour les fondateurs ;
- **élargir le pacte** : l'angel rejoint le concert (42 % + 10,5 % = **52,5 %**).

```scene
concert FDR "Pacte fondateurs + angel" ANA HUGO ANGEL
focus KIWI
```