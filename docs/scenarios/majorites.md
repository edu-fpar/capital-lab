# Majorités et minorité de blocage
> 50 %, 1/3, 2/3 : pourquoi certains seuils changent tout en assemblée générale.

Dans une société anonyme, les décisions se prennent en **assemblée générale ordinaire** (AGO) ou **extraordinaire** (AGE), avec des majorités différentes. Ces seuils dessinent la carte du pouvoir.

## 1. Deux associés
Gamma SA a deux actionnaires : **Marie (60 %)** et **Paul (40 %)**.

Marie a la majorité : elle nomme les administrateurs, approuve les comptes, décide des dividendes (AGO).

```scene
personne MARIE "Marie"
personne PAUL "Paul"
societe GAMMA "Gamma SA"
lien MARIE -> GAMMA 60%
lien PAUL -> GAMMA 40%
focus GAMMA
```
## Question : Marie peut-elle modifier seule les statuts de Gamma SA ?
Marie détient 60 % des voix, Paul 40 %. Tous deux participent à l'assemblée et votent.

- [ ] Oui : avec 60 %, elle est majoritaire
  La majorité simple suffit en assemblée **ordinaire**, pas pour modifier les statuts.
- [x] Non : il faut les deux tiers des voix en assemblée extraordinaire
  60 % < 66,67 % : sans l'accord de Paul, la résolution est rejetée.
- [ ] Non : il faut l'unanimité
  L'unanimité n'est exigée que pour quelques décisions, par exemple augmenter les engagements des actionnaires.

### Réponse
Pour **modifier les statuts**, augmenter le capital, fusionner… il faut, dans une SA, les **2/3** des voix exprimées par les actionnaires présents ou représentés en AGE. Avec 60 %, Marie ne peut rien changer sans Paul.

Paul détient plus d'un tiers des voix : il dispose d'une **minorité de blocage** (lien orange).

```scene
note PAUL "Plus de 1/3 : peut bloquer toute AGE"
note MARIE "Majorité simple : décide en AGO"
focus PAUL
```
## 3. Paul cède 7 %
Paul vend 7 % à Marie. Marie passe à **67 %** (≥ 2/3) : elle domine aussi l'AGE. Paul tombe à **33 %**… juste sous le tiers : il **perd** sa minorité de blocage.

> 💡 Quelques actions peuvent faire basculer le pouvoir : c'est pourquoi les blocs proches des seuils se négocient souvent avec une **prime de contrôle**.

```scene
lien MARIE -> GAMMA 67%
lien PAUL -> GAMMA 33%
focus MARIE PAUL
```
## 4. Le piège du 50/50
Et si Marie et Paul détenaient chacun **50 %** ? Personne n'a *plus de* 50 % : **aucun ne contrôle**. Chacun peut bloquer l'autre : c'est la situation de **blocage** (*deadlock*).

Les associés prévoient alors un **pacte d'actionnaires** : voix prépondérante, clause de sortie, médiation…

```scene
lien MARIE -> GAMMA 50%
lien PAUL -> GAMMA 50%
focus GAMMA
note GAMMA "50/50 : personne ne contrôle"
```
## 5. Les seuils à connaître
| Seuil | Effet principal |
|---|---|
| 5, 10, 15, 20, 25, 30 %, 1/3, 1/2, 2/3, 90, 95 % | Déclaration de franchissement de seuil dans les sociétés cotées (art. L233-7) |
| 30 % | Dépôt obligatoire d'une offre publique (sociétés cotées) |
| plus de 1/3 | Minorité de blocage en AGE |
| plus de 50 % | Majorité en AGO — contrôle |
| 2/3 | Majorité en AGE |
| 90 % | Retrait obligatoire possible après une offre publique |

La **légende** du canevas reprend ces couleurs.

```scene
lien MARIE -> GAMMA 92%
lien PAUL -> GAMMA 8%
note GAMMA "90 % et plus : retrait obligatoire possible"
```