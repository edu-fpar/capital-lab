# La pyramide de holdings
> Comment une famille contrôle une grande société en ne détenant qu'une petite fraction de son capital.

On construit pas à pas une **cascade de holdings**. À chaque étage, la famille garde la majorité… mais son **intérêt économique** fond.

Observez les couleurs : une entité **teintée** est contrôlée par l'actionnaire de la même couleur.

## 1. La famille crée une holding
La famille Martin apporte ses titres à une holding, **Martin Participations**, dont elle détient **51 %** du capital. Les 49 % restants appartiennent à des investisseurs extérieurs (non représentés : ils apparaissent dans « autres »).

Avec plus de 50 % des droits de vote, la famille décide seule en assemblée générale ordinaire : elle **contrôle** la holding (art. L233-3 C. com.).

```scene
personne FAM "Famille Martin"
holding H1 "Martin Participations"
lien FAM -> H1 51%
focus H1
```
## 2. Un deuxième étage
La holding prend **51 %** d'une seconde holding, **Martin Industrie**.

- La famille ne détient *directement* aucune action de Martin Industrie.
- Mais elle contrôle Martin Participations, qui contrôle Martin Industrie : le contrôle **se transmet** le long de la chaîne.
- Son **intérêt économique** (sa part des dividendes) n'est plus que de 51 % × 51 % ≈ **26 %**.

Le mode **point de vue** (👁) affiche sur chaque entité l'intérêt et le contrôle de la famille.

```scene
holding H2 "Martin Industrie"
lien H1 -> H2 51%
vue FAM
focus H2
```
## 3. La société cotée
Martin Industrie détient **51 %** d'**Alpha SA**, une grande société cotée.

La famille contrôle Alpha SA avec un intérêt économique de 51 % × 51 % × 51 % ≈ **13,3 %**. Les 86,7 % restants appartiennent à d'autres investisseurs… qui n'ont pas le pouvoir.

```scene
societe ALPHA "Alpha SA (cotée)"
lien H2 -> ALPHA 51%
focus ALPHA
note ALPHA "Contrôlée avec ≈ 13 % du capital économique"
```
## 4. Encore un étage
Alpha SA prend 51 % de **Beta SAS**. La famille contrôle désormais Beta avec un intérêt de **6,8 %** seulement.

> 💡 Chaque étage divise à peu près par deux l'intérêt économique, sans jamais diluer le pouvoir : c'est l'**effet multiplicateur** de la pyramide.

```scene
societe BETA "Beta SAS"
lien ALPHA -> BETA 51%
focus BETA
```
## Question : quel pouvoir le Fonds Delta a-t-il dans Alpha SA ?
Le **Fonds Delta** détient les 49 % restants de Martin Participations : il finance la pyramide presque autant que la famille.

```scene
fonds DELTA "Fonds Delta"
lien DELTA -> H1 49%
vue aucune
focus DELTA ALPHA
```
- [ ] 49 % des droits de vote d'Alpha SA
  Ses 49 % portent sur Martin Participations, pas sur Alpha SA.
- [ ] Environ 12,7 % des droits de vote, comme son intérêt économique
  49 % × 51 % × 51 % ≈ 12,7 % mesure sa part des bénéfices d'Alpha SA, pas ses voix.
- [x] Aucun : il ne vote pas à l'assemblée d'Alpha SA
  Ses voix ne comptent qu'à l'assemblée de Martin Participations, où la famille est majoritaire.
- [ ] Une minorité de blocage
  Il en a une dans Martin Participations (49 %, plus d'un tiers), mais pas dans Alpha SA.

### Réponse
Le fonds a un **intérêt économique** d'environ **12,7 %** dans Alpha SA — presque autant que la famille (13,3 %) — mais **aucun droit de vote** : il ne vote qu'à l'assemblée de Martin Participations, où il est minoritaire.

C'est le paradoxe de la pyramide : on peut **financer sans décider**. Le point de vue du fonds s'affiche maintenant sur le canevas.

```scene
vue DELTA
focus DELTA ALPHA
```
## 6. Synthèse
| Société | Intérêt de la famille | Contrôle |
|---|---|---|
| Martin Participations | 51 % | ✔ |
| Martin Industrie | 26 % | ✔ |
| Alpha SA | 13,3 % | ✔ |
| Beta SAS | 6,8 % | ✔ |

À retenir :
- **pourcentage de contrôle** ≠ **pourcentage d'intérêt** ;
- le contrôle se transmet en chaîne (art. L233-3 et L233-4 C. com.), l'intérêt se **multiplie** ;
- les marchés appliquent souvent une **décote de holding** aux sociétés de tête.

Cliquez sur une entité pour voir son analyse détaillée.

```scene
vue FAM
selection BETA
```