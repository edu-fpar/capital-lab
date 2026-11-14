# Capital ≠ pouvoir : droits de vote double et actions de préférence
> Comment détenir 35 % du capital… et plus de 50 % des voix.

Par défaut, **une action = une voix**. Mais le droit des sociétés permet de dissocier capital et droits de vote. Le canevas affiche alors deux chiffres sur chaque lien : le capital et les droits de vote (**DV**).

## 1. Une société cotée classique
**Delta SA** est cotée. Son fondateur, **Jean**, détient **35 %** du capital ; le reste (65 %) est dans le public. Une action = une voix : Jean est minoritaire.

```scene
personne JEAN "Jean, fondateur"
public PUB "Actionnaires du public"
societe DELTA "Delta SA (cotée)"
lien JEAN -> DELTA 35%
lien PUB -> DELTA 65%
focus DELTA
```
## 2. Les droits de vote double
Depuis la loi Florange (2014), dans les sociétés cotées, les actions inscrites **au nominatif depuis deux ans** au nom du même actionnaire reçoivent automatiquement un **droit de vote double**, sauf clause contraire des statuts.

Jean détient ses titres au nominatif depuis longtemps : ses 35 actions valent **70 voix**. Le public (au porteur) garde 65 voix. Total : 135 voix.

- Jean : 70 / 135 = **51,9 %** des voix → **contrôle** !
- Public : 65 / 135 = 48,1 %

```scene
lien JEAN -> DELTA 35% votes 51.85%
lien PUB -> DELTA 65% votes 48.15%
focus JEAN
note JEAN "35 % du capital, 51,9 % des voix"
```
## 3. Un fonds activiste entre au capital
Un fonds activiste rachète **10 %** du capital au public. Il vient d'acheter : pas de droit de vote double.

Voix : Jean 70, fonds 10, public 55 → total 135. Jean garde **51,9 %** des voix ; le fonds n'a que **7,4 %** des voix pour 10 % du capital.

```scene
fonds ACT "Fonds activiste"
lien ACT -> DELTA 10% votes 7.41%
lien PUB -> DELTA 55% votes 40.74%
focus ACT
```
## 4. Les actions de préférence sans droit de vote
Autre outil : les **actions de préférence** (art. L228-11 C. com.), qui peuvent être privées du droit de vote, par exemple en échange d'un dividende prioritaire.

Dans la start-up **Nova SAS**, la fondatrice **Léa** détient 40 % du capital en actions ordinaires. Un fonds de capital-risque détient 60 % du capital, dont 50 % en actions de préférence **sans droit de vote**.

Voix : Léa 40, fonds 10 → Léa a **80 %** des voix avec 40 % du capital.

```scene
personne LEA "Léa, fondatrice"
fonds VC "Fonds de capital-risque"
societe NOVA "Nova SAS"
lien LEA -> NOVA 40% votes 80%
lien VC -> NOVA 60% votes 20%
focus NOVA
vue LEA
```
## 5. À retenir
- Le **contrôle** se mesure en **droits de vote**, l'**intérêt économique** en **capital**.
- Outils de dissociation : droits de vote double, actions de préférence, et depuis la loi du 13 juin 2024, actions de préférence à **droits de vote multiples** lors d'une introduction en bourse.
- En mode libre, cliquez sur un lien pour régler séparément capital et droits de vote.

```scene
vue aucune
```