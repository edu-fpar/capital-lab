# Le contrôle de fait : 40 % peuvent suffire
> Quand l'actionnariat est dispersé, la majorité absolue n'est pas nécessaire.

## 1. Un actionnariat dispersé
Zeta SA est cotée. **Kappa Holding** détient 42 %. Deux fonds détiennent 8 % et 6 %. Le reste (44 %) est éparpillé entre des milliers de petits porteurs.

Avec la seule règle de la majorité absolue, personne ne contrôle Zeta.

```scene
regle 40 off
holding K "Kappa Holding"
fonds F1 "Fonds Orion"
fonds F2 "Fonds Sirius"
public PUB "Petits porteurs"
societe ZETA "Zeta SA (cotée)"
lien K -> ZETA 42%
lien F1 -> ZETA 8%
lien F2 -> ZETA 6%
lien PUB -> ZETA 44%
focus ZETA
```
## 2. La réalité des assemblées
En pratique, les petits porteurs votent peu. Si seulement 60 % des voix sont présentes en assemblée, les 42 % de Kappa représentent **70 % des votes exprimés** : Kappa décide seule.

La loi pose donc une **présomption de contrôle** : une personne est présumée contrôler une société lorsqu'elle dispose directement ou indirectement d'une fraction des droits de vote **supérieure à 40 %** et qu'aucun autre associé ne détient une fraction **supérieure à la sienne** (art. L233-3, II).

L'option « Contrôle de fait (40 %) » est maintenant activée.

```scene
regle 40 on
focus K ZETA
note ZETA "Contrôle de fait présumé"
```
## 3. Le contrôle remonte la chaîne
Kappa Holding est contrôlée à 60 % par **M. Lefèvre**. Le contrôle de fait exercé par Kappa sur Zeta remonte jusqu'à lui.

```scene
personne LEF "M. Lefèvre"
lien LEF -> K 60%
vue LEF
```
## 4. Un concurrent monte au capital
Le Fonds Orion ramasse des titres en bourse et passe à **45 %** (les petits porteurs descendent à 7 %). Il détient désormais plus que Kappa : la présomption bascule en sa faveur.

> 💡 Ce n'est qu'une présomption : elle peut être renversée par la preuve contraire. Le contrôle de fait s'apprécie au cas par cas.

```scene
lien F1 -> ZETA 45%
lien PUB -> ZETA 7%
focus F1 ZETA
```