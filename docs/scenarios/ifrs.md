# IFRS : contrôle, périmètre et variations de pourcentage
> IFRS 10, IFRS 11, IAS 28 et IFRS 3 : ce que change chaque achat ou cession de titres dans les comptes consolidés.

> ⚠️ **Ce que l'outil montre — et ne montre pas.** IFRS 10 définit le contrôle par trois éléments : le **pouvoir** sur l'entité, l'**exposition à des rendements variables** et la **capacité d'utiliser ce pouvoir** pour influer sur ces rendements. L'outil raisonne sur les **droits de vote**, ce qui correspond au cas le plus courant, mais pas au seul. Les situations où le contrôle ne vient pas des votes (contrats, entités structurées, droits de vote potentiels, minorité importante face à un actionnariat dispersé) relèvent du **jugement** et ne sont pas calculées. La présomption « 40 % » proposée par l'outil vient du Code de commerce, pas des IFRS : elle reste désactivée ici.

## 1. Une filiale : contrôle et intégration globale
Mère SA détient **60 %** des droits de vote de la Filiale A. Sauf circonstances particulières, la majorité des droits de vote donne le pouvoir : Mère SA **contrôle** A (IFRS 10).

A est consolidée par **intégration globale** : 100 % de ses actifs, passifs, produits et charges entrent dans les comptes du groupe. Les 40 % détenus par d'autres actionnaires apparaissent en **participations ne donnant pas le contrôle** (PNC, ou *non-controlling interests*), dans les capitaux propres.

```scene
regle 40 off
societe M "Mère SA"
societe A "Filiale A"
lien M -> A 60%
vue M
focus A
note A "Intégration globale · PNC 40 %"
```
## 2. Une sous-filiale : contrôle en chaîne, intérêt dilué
A détient **70 %** de la Sous-filiale B. Mère SA contrôle A, qui contrôle B : B est aussi consolidée par **intégration globale**.

Mais la part du groupe dans B n'est que de 60 % × 70 % = **42 %**. Les PNC de B représentent **58 %** : 30 % d'actionnaires directs de B + 40 % × 70 % = 28 % revenant indirectement aux minoritaires de A.

> 💡 En consolidation, on intègre selon le **contrôle**, mais on partage les résultats selon l'**intérêt**.

```scene
societe B "Sous-filiale B"
lien A -> B 70%
focus B
note B "Contrôle ✔ · part du groupe 42 %"
```
## 3. Influence notable et coentreprise
- Mère SA détient **25 %** de C : au-delà de 20 % des voix, on présume une **influence notable** (IAS 28, présomption réfutable). C est une **entreprise associée**, comptabilisée par **mise en équivalence**.
- Mère SA et un partenaire détiennent chacun **50 %** de JV Co, avec un accord qui exige leur **consentement unanime** pour les décisions sur les activités pertinentes : c'est un **contrôle conjoint** (IFRS 11). Si l'accord donne des droits sur l'actif net de l'entité, c'est une **coentreprise**, mise en équivalence ; s'il donne des droits sur les actifs et des obligations au titre des passifs, c'est une **activité conjointe**, comptabilisée à hauteur de sa quote-part.

Dans le canevas, l'accord est représenté par un pacte. Attention : en IFRS 11, ce qui compte est l'**unanimité contractuelle**, que l'outil ne vérifie pas.

```scene
societe C "Associée C"
lien M -> C 25%
societe PART "Partenaire"
societe JV "JV Co"
lien M -> JV 50%
lien PART -> JV 50%
concert ACCORD "Accord conjoint (unanimité)" M PART
focus C JV
note C "IAS 28 : mise en équivalence"
note JV "IFRS 11 : coentreprise"
```
## 4. Mère SA rachète 20 % de A aux minoritaires
Mère SA passe de 60 % à **80 %** de A. Le contrôle ne change pas : selon IFRS 10, c'est une **transaction entre propriétaires**, comptabilisée **en capitaux propres**. Pas de nouveau goodwill, pas de résultat : on reclasse simplement une partie des PNC en part du groupe.

Effet en chaîne : la part du groupe dans B passe à 80 % × 70 % = **56 %**.

```scene
lien M -> A 80%
focus A B
note A "Sans changement de contrôle : capitaux propres"
```
## 5. Prise de contrôle par étapes
Mère SA passe de 25 % à **55 %** de C : elle en prend le **contrôle**. C'est un **regroupement d'entreprises** (IFRS 3), constaté à la date de prise de contrôle :
- la participation de 25 % déjà détenue est **réévaluée à la juste valeur**, l'écart passe en **résultat** ;
- le goodwill est calculé à cette date ;
- C passe de la mise en équivalence à l'**intégration globale**.

```scene
lien M -> C 55%
focus C
note C "IFRS 3 : réévaluation des 25 % antérieurs"
```
## 6. Perte de contrôle
Mère SA cède une partie de A et passe de 80 % à **30 %**. Elle **perd le contrôle** (IFRS 10) :
- elle décomptabilise les actifs, les passifs et les PNC de A — **et ceux de B**, qu'elle ne contrôlait qu'à travers A ;
- la participation conservée (30 %) est **réévaluée à la juste valeur** ; le résultat de cession passe en **résultat** ;
- ensuite, si l'influence notable est confirmée, A (avec sa filiale B) est mise en équivalence.

Observez le canevas : A et B perdent la couleur de Mère SA. B reste contrôlée… par A.

```scene
lien M -> A 30%
focus A B
note A "Perte de contrôle : déconsolidation"
```
## 7. Ce que le canevas ne montre pas
| Notion IFRS | Dans l'outil |
|---|---|
| Contrôle par la majorité des droits de vote | ✔ calculé |
| Contrôle en chaîne, part du groupe, PNC | ✔ calculés (point de vue, analyse) |
| Influence notable (20 % ou plus) | ✔ seuil affiché, présomption seulement |
| Contrôle conjoint (IFRS 11) | ≈ représenté par un pacte ; l'unanimité n'est pas vérifiée |
| Contrôle de fait avec une minorité importante | ✘ jugement au cas par cas |
| Droits de vote potentiels (options, convertibles) | ✘ non modélisés |
| Entités structurées, contrôle contractuel, mandataire ou principal | ✘ non modélisés |
| Goodwill, juste valeur, résultat de cession | ✘ chiffres à calculer à part |

L'outil sert donc à visualiser le **périmètre** et l'effet des **variations de pourcentage** ; l'évaluation comptable se fait à côté.

```scene
vue M
selection B
```