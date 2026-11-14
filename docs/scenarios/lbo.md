# LBO : racheter une entreprise avec effet de levier
> Holding de reprise, dette d'acquisition, intégration fiscale et management package.

Un **LBO** (*leveraged buy-out*) est le rachat d'une société par une **holding de reprise** qui finance l'acquisition en partie par **emprunt**. La dette est ensuite remboursée grâce aux dividendes que la société rachetée fait remonter.

> ⚠️ Le canevas montre les **participations** (capital et pouvoir). La dette bancaire n'est pas une participation : elle apparaît dans les bulles et les commentaires. Les montants sont des exemples simplifiés.

## 1. La cible
**Industria SAS** appartient à 100 % à son fondateur, M. Moreau, qui souhaite céder. Prix retenu : **100 M€** (on suppose, pour simplifier, que la cible n'a pas de dette).

```scene
personne MOREAU "M. Moreau (fondateur)"
societe CIBLE "Industria SAS"
lien MOREAU -> CIBLE 100%
focus CIBLE
note CIBLE "Prix : 100 M€"
```
## 2. La holding de reprise
Un fonds de capital-investissement crée une société nouvelle, **NewCo** (holding de reprise). Il y apporte **36 M€** et l'équipe de direction **4 M€** : 40 M€ de fonds propres au total.

Fonds : **90 %** du capital, managers : **10 %**. Le fonds contrôle NewCo.

```scene
fonds LBO "Fonds LBO"
personne MGT "Équipe de direction"
holding NEWCO "NewCo (holding de reprise)"
lien LBO -> NEWCO 90%
lien MGT -> NEWCO 10%
focus NEWCO
note NEWCO "Fonds propres : 40 M€"
```
## 3. La dette d'acquisition et le rachat
NewCo emprunte **60 M€** auprès de banques et achète **100 %** d'Industria pour 100 M€ (40 M€ de fonds propres + 60 M€ de dette).

C'est bien **NewCo** qui s'endette, et non la cible : une société anonyme ne peut pas avancer des fonds, accorder des prêts ou consentir des sûretés pour financer l'achat de ses propres actions par un tiers (interdiction de l'assistance financière, art. L225-216 C. com.).

Le fonds contrôle désormais Industria **à 100 %** en n'ayant apporté que 36 M€ : la holding (levier **juridique**) et la dette (levier **financier**) se combinent.

```scene
retirer MOREAU
lien NEWCO -> CIBLE 100%
vue LBO
focus CIBLE
note NEWCO "Dette d'acquisition : 60 M€"
```
## 4. Le levier fiscal : l'intégration fiscale
NewCo n'a pas d'activité : pour payer les intérêts et rembourser la dette, elle compte sur les **dividendes** d'Industria.

Comme NewCo détient au moins **95 %** d'Industria, les deux sociétés peuvent opter pour l'**intégration fiscale** (art. 223 A CGI) : les charges d'intérêts de NewCo s'imputent sur les bénéfices d'Industria, ce qui réduit l'impôt du groupe — dans les limites prévues par la loi (plafonnement des charges financières, art. 212 bis CGI ; dispositif dit « Charasse », art. 223 B CGI).

> 💡 À 94 %, l'intégration fiscale serait impossible : ici encore, un seuil change tout.

```scene
focus NEWCO CIBLE
note CIBLE "95 % ou plus : intégration fiscale possible"
```
## 5. Le management package
Les dirigeants regroupent leurs titres dans une holding commune, **ManCo**. La directrice générale détient 60 % de ManCo, le directeur financier 40 %.

Intérêt économique de la DG dans Industria : 60 % × 10 % × 100 % = **6 %**. En pratique, s'y ajoutent souvent des mécanismes liés à la performance (**ratchet**, actions de préférence) qui augmentent la part des managers si le fonds atteint ses objectifs de rentabilité.

```scene
retirer MGT
holding MANCO "ManCo (managers)"
personne DG "Directrice générale"
personne DAF "Directeur financier"
lien DG -> MANCO 60%
lien DAF -> MANCO 40%
lien MANCO -> NEWCO 10%
vue DG
focus MANCO
```
## 6. Cinq ans plus tard : la sortie
Hypothèses : sur cinq ans, la trésorerie dégagée par Industria a permis de payer les intérêts (≈ 13 M€) et de rembourser **30 M€** de dette. À la sortie, Industria vaut **130 M€**.

| | Sans dette | Avec LBO |
|---|---|---|
| Mise de fonds | 100 M€ | 40 M€ |
| Trésorerie distribuée pendant 5 ans | ≈ 43 M€ | 0 (sert la dette) |
| Valeur des fonds propres à la sortie | 130 M€ | 130 − 30 = 100 M€ |
| Multiple (avant impôt) | ≈ × 1,7 | × 2,5 |

C'est l'**effet de levier financier** : tant que la rentabilité de la cible dépasse le coût de la dette, l'endettement augmente la rentabilité des fonds propres. Mais il joue aussi **à la baisse** : si l'activité recule, la dette reste due et peut mettre l'entreprise en difficulté.

Le fonds (90 %) récupère 90 M€ pour 36 M€ investis, les managers (10 %) 10 M€ pour 4 M€ — avant ratchet.

```scene
vue LBO
note NEWCO "Dette restante : 30 M€"
note CIBLE "Valeur : 130 M€"
```
## 7. Synthèse : les quatre leviers
| Levier | Mécanisme |
|---|---|
| **Financier** | la dette amplifie la rentabilité des fonds propres (et le risque) |
| **Juridique** | la holding permet de contrôler 100 % de la cible avec une mise limitée |
| **Fiscal** | l'intégration fiscale (95 % ou plus) impute les intérêts sur les bénéfices de la cible |
| **Managérial** | les dirigeants deviennent associés et sont intéressés à la réussite |

Cliquez sur une entité pour revoir son analyse : contrôle, chaîne, intérêt économique.

```scene
vue LBO
selection CIBLE
```