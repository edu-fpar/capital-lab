/* ============================================================
 * Bibliothèque de scénarios intégrés (format markdown).
 * Pour ajouter un scénario : ajoutez un objet { id, md } au tableau.
 * (Dans ce fichier, les blocs de commandes utilisent ~~~scene au lieu
 *  de ```scene pour éviter les accents graves dans les chaînes JS.)
 * ============================================================ */
window.P = window.P || {};
P.LIBRARY = [

{ id: 'pyramide', md: `# La pyramide de holdings
> Comment une famille contrôle une grande société en ne détenant qu'une petite fraction de son capital.

On construit pas à pas une **cascade de holdings**. À chaque étage, la famille garde la majorité… mais son **intérêt économique** fond.

Observez les couleurs : une entité **teintée** est contrôlée par l'actionnaire de la même couleur.

## 1. La famille crée une holding
La famille Martin apporte ses titres à une holding, **Martin Participations**, dont elle détient **51 %** du capital. Les 49 % restants appartiennent à des investisseurs extérieurs (non représentés : ils apparaissent dans « autres »).

Avec plus de 50 % des droits de vote, la famille décide seule en assemblée générale ordinaire : elle **contrôle** la holding (art. L233-3 C. com.).

~~~scene
personne FAM "Famille Martin"
holding H1 "Martin Participations"
lien FAM -> H1 51%
focus H1
~~~

## 2. Un deuxième étage
La holding prend **51 %** d'une seconde holding, **Martin Industrie**.

- La famille ne détient *directement* aucune action de Martin Industrie.
- Mais elle contrôle Martin Participations, qui contrôle Martin Industrie : le contrôle **se transmet** le long de la chaîne.
- Son **intérêt économique** (sa part des dividendes) n'est plus que de 51 % × 51 % ≈ **26 %**.

Le mode **point de vue** (👁) affiche sur chaque entité l'intérêt et le contrôle de la famille.

~~~scene
holding H2 "Martin Industrie"
lien H1 -> H2 51%
vue FAM
focus H2
~~~

## 3. La société cotée
Martin Industrie détient **51 %** d'**Alpha SA**, une grande société cotée.

La famille contrôle Alpha SA avec un intérêt économique de 51 % × 51 % × 51 % ≈ **13,3 %**. Les 86,7 % restants appartiennent à d'autres investisseurs… qui n'ont pas le pouvoir.

~~~scene
societe ALPHA "Alpha SA (cotée)"
lien H2 -> ALPHA 51%
focus ALPHA
note ALPHA "Contrôlée avec ≈ 13 % du capital économique"
~~~

## 4. Encore un étage
Alpha SA prend 51 % de **Beta SAS**. La famille contrôle désormais Beta avec un intérêt de **6,8 %** seulement.

> 💡 Chaque étage divise à peu près par deux l'intérêt économique, sans jamais diluer le pouvoir : c'est l'**effet multiplicateur** de la pyramide.

~~~scene
societe BETA "Beta SAS"
lien ALPHA -> BETA 51%
focus BETA
~~~

## 5. Le point de vue des minoritaires
Le **Fonds Delta** détient les 49 % restants de Martin Participations. Il a donc indirectement un intérêt de 49 % × 51 % × 51 % ≈ **12,7 %** dans Alpha SA — presque autant que la famille ! Mais **aucun pouvoir** : ses voix sont minoritaires dès le premier étage.

~~~scene
fonds DELTA "Fonds Delta"
lien DELTA -> H1 49%
vue DELTA
focus DELTA ALPHA
~~~

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

~~~scene
vue FAM
selection BETA
~~~
` },

{ id: 'majorites', md: `# Majorités et minorité de blocage
> 50 %, 1/3, 2/3 : pourquoi certains seuils changent tout en assemblée générale.

Dans une société anonyme, les décisions se prennent en **assemblée générale ordinaire** (AGO, majorité des voix) ou **extraordinaire** (AGE, majorité des **deux tiers**). Ces seuils dessinent la carte du pouvoir.

## 1. Deux associés
Gamma SA a deux actionnaires : **Marie (60 %)** et **Paul (40 %)**.

Marie a la majorité : elle nomme les administrateurs, approuve les comptes, décide des dividendes (AGO).

~~~scene
personne MARIE "Marie"
personne PAUL "Paul"
societe GAMMA "Gamma SA"
lien MARIE -> GAMMA 60%
lien PAUL -> GAMMA 40%
focus GAMMA
~~~

## 2. Le pouvoir de dire non
Pour **modifier les statuts**, augmenter le capital, fusionner… il faut les **2/3** des voix en AGE. Marie n'a que 60 % : sans Paul, elle ne peut rien changer.

Paul détient plus d'un tiers des voix : il dispose d'une **minorité de blocage** (lien orange).

~~~scene
note PAUL "Plus de 1/3 : peut bloquer toute AGE"
note MARIE "Majorité simple : décide en AGO"
focus PAUL
~~~

## 3. Paul cède 7 %
Paul vend 7 % à Marie. Marie passe à **67 %** (≥ 2/3) : elle domine aussi l'AGE. Paul tombe à **33 %**… juste sous le tiers : il **perd** sa minorité de blocage.

> 💡 Quelques actions peuvent faire basculer le pouvoir : c'est pourquoi les blocs proches des seuils se négocient souvent avec une **prime de contrôle**.

~~~scene
lien MARIE -> GAMMA 67%
lien PAUL -> GAMMA 33%
focus MARIE PAUL
~~~

## 4. Le piège du 50/50
Et si Marie et Paul détenaient chacun **50 %** ? Personne n'a *plus de* 50 % : **aucun ne contrôle**. Chacun peut bloquer l'autre : c'est la situation de **blocage** (*deadlock*).

Les associés prévoient alors un **pacte d'actionnaires** : voix prépondérante, clause de sortie, médiation…

~~~scene
lien MARIE -> GAMMA 50%
lien PAUL -> GAMMA 50%
focus GAMMA
note GAMMA "50/50 : personne ne contrôle"
~~~

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

~~~scene
lien MARIE -> GAMMA 92%
lien PAUL -> GAMMA 8%
note GAMMA "90 % et plus : retrait obligatoire possible"
~~~
` },

{ id: 'droits-de-vote', md: `# Capital ≠ pouvoir : droits de vote double et actions de préférence
> Comment détenir 35 % du capital… et plus de 50 % des voix.

Par défaut, **une action = une voix**. Mais le droit des sociétés permet de dissocier capital et droits de vote. Le canevas affiche alors deux chiffres sur chaque lien : le capital et les droits de vote (**DV**).

## 1. Une société cotée classique
**Delta SA** est cotée. Son fondateur, **Jean**, détient **35 %** du capital ; le reste (65 %) est dans le public. Une action = une voix : Jean est minoritaire.

~~~scene
personne JEAN "Jean, fondateur"
public PUB "Actionnaires du public"
societe DELTA "Delta SA (cotée)"
lien JEAN -> DELTA 35%
lien PUB -> DELTA 65%
focus DELTA
~~~

## 2. Les droits de vote double
Depuis la loi Florange (2014), dans les sociétés cotées, les actions inscrites **au nominatif depuis deux ans** au nom du même actionnaire reçoivent automatiquement un **droit de vote double**, sauf clause contraire des statuts.

Jean détient ses titres au nominatif depuis longtemps : ses 35 actions valent **70 voix**. Le public (au porteur) garde 65 voix. Total : 135 voix.

- Jean : 70 / 135 = **51,9 %** des voix → **contrôle** !
- Public : 65 / 135 = 48,1 %

~~~scene
lien JEAN -> DELTA 35% votes 51.85%
lien PUB -> DELTA 65% votes 48.15%
focus JEAN
note JEAN "35 % du capital, 51,9 % des voix"
~~~

## 3. Un fonds activiste entre au capital
Un fonds activiste rachète **10 %** du capital au public. Il vient d'acheter : pas de droit de vote double.

Voix : Jean 70, fonds 10, public 55 → total 135. Jean garde **51,9 %** des voix ; le fonds n'a que **7,4 %** des voix pour 10 % du capital.

~~~scene
fonds ACT "Fonds activiste"
lien ACT -> DELTA 10% votes 7.41%
lien PUB -> DELTA 55% votes 40.74%
focus ACT
~~~

## 4. Les actions de préférence sans droit de vote
Autre outil : les **actions de préférence** (art. L228-11 C. com.), qui peuvent être privées du droit de vote, par exemple en échange d'un dividende prioritaire.

Dans la start-up **Nova SAS**, la fondatrice **Léa** détient 40 % du capital en actions ordinaires. Un fonds de capital-risque détient 60 % du capital, dont 50 % en actions de préférence **sans droit de vote**.

Voix : Léa 40, fonds 10 → Léa a **80 %** des voix avec 40 % du capital.

~~~scene
personne LEA "Léa, fondatrice"
fonds VC "Fonds de capital-risque"
societe NOVA "Nova SAS"
lien LEA -> NOVA 40% votes 80%
lien VC -> NOVA 60% votes 20%
focus NOVA
vue LEA
~~~

## 5. À retenir
- Le **contrôle** se mesure en **droits de vote**, l'**intérêt économique** en **capital**.
- Outils de dissociation : droits de vote double, actions de préférence, et depuis la loi du 13 juin 2024, actions de préférence à **droits de vote multiples** lors d'une introduction en bourse.
- En mode libre, cliquez sur un lien pour régler séparément capital et droits de vote.

~~~scene
vue aucune
~~~
` },

{ id: 'autocontrole', md: `# Participations croisées et autocontrôle
> Quand une société se « contrôle » elle-même… et qu'une famille en profite.

## 1. Alpha et sa famille fondatrice
La famille Roux détient **46 %** d'Alpha SA ; le reste est dispersé dans le public. Personne n'a la majorité absolue : Alpha n'est **pas contrôlée** (la présomption de contrôle de fait est désactivée dans ce scénario).

~~~scene
regle 40 off
personne ROUX "Famille Roux"
societe ALPHA "Alpha SA"
lien ROUX -> ALPHA 46%
focus ALPHA
~~~

## 2. Alpha contrôle Beta
Alpha détient **60 %** de Beta : elle la contrôle.

~~~scene
societe BETA "Beta"
lien ALPHA -> BETA 60%
focus BETA
~~~

## 3. Beta détient 10 % d'Alpha
Beta détient **10 %** du capital d'Alpha (par exemple une participation acquise avant qu'Alpha n'en prenne le contrôle — le Code de commerce encadre strictement ces participations réciproques, art. L233-29 et s.).

Beta étant contrôlée par Alpha, ces actions sont de l'**autocontrôle**. La loi **prive de droit de vote** les actions d'autocontrôle (art. L233-31) : sinon les dirigeants d'Alpha voteraient… pour eux-mêmes, avec l'argent de la société.

Conséquence mécanique : il ne reste que 90 % de voix exerçables. La famille Roux pèse désormais 46 / 90 = **51,1 %** des voix : elle **prend le contrôle** sans acheter une seule action !

~~~scene
lien BETA -> ALPHA 10%
focus ROUX ALPHA
note ALPHA "10 % de voix neutralisées"
~~~

## 4. L'auto-détention
Alpha rachète aussi **5 %** de ses propres actions (programme de rachat). Ces actions sont également **privées de droit de vote** (art. L225-210).

Il ne reste que 85 % de voix exerçables : la famille pèse 46 / 85 = **54,1 %**.

~~~scene
lien ALPHA -> ALPHA 5%
focus ALPHA
note ALPHA "Auto-détention 5 % + autocontrôle 10 %"
~~~

## 5. Les garde-fous
- Une SA ne peut détenir plus de **10 %** de ses propres actions (art. L225-210).
- Les participations réciproques entre sociétés sont plafonnées (art. L233-29 et L233-30).
- Les actions d'autocontrôle sont **privées du droit de vote** (art. L233-31).

> 💡 Dans le canevas, les liens d'autocontrôle apparaissent en **pointillés gris** : leurs voix sont neutralisées et les autres pourcentages sont recalculés (« effectifs »).

~~~scene
vue ROUX
selection ALPHA
~~~
` },

{ id: 'concert', md: `# Action de concert : contrôler à plusieurs
> Deux minoritaires qui s'entendent peuvent contrôler ensemble.

## 1. Un capital éclaté
Omega SA : **A Invest** détient 30 %, **B Capital** 25 %, le public 45 %. Aucun bloc ne dépasse 50 % : Omega n'est **pas contrôlée**.

~~~scene
holding A "A Invest"
fonds B "B Capital"
public PUB "Public"
societe OMEGA "Omega SA"
lien A -> OMEGA 30%
lien B -> OMEGA 25%
lien PUB -> OMEGA 45%
focus OMEGA
~~~

## 2. Le pacte d'actionnaires
A Invest et B Capital signent un **pacte** : ils s'engagent à voter dans le même sens pour mettre en œuvre une politique commune. Ils **agissent de concert** (art. L233-10 C. com.).

Ensemble, ils réunissent 55 % des voix : ils **contrôlent conjointement** Omega (art. L233-3, III).

~~~scene
concert PACTE "Pacte Omega" A B
focus OMEGA
note OMEGA "Contrôle conjoint : 30 % + 25 %"
~~~

## 3. Qui est derrière A Invest ?
A Invest est elle-même détenue à 70 % par **Mme Durand**. Mme Durand contrôle A Invest et participe donc, à travers elle, au contrôle conjoint d'Omega.

Le point de vue de Mme Durand montre son intérêt économique dans Omega : 70 % × 30 % = **21 %**.

~~~scene
personne DURAND "Mme Durand"
lien DURAND -> A 70%
vue DURAND
focus A
~~~

## 4. Fin du pacte
Le pacte est dénoncé. Chacun retrouve sa liberté de vote : Omega redevient **sans contrôle**.

> 💡 Dans une société cotée, des actionnaires qui franchissent **de concert** le seuil de 30 % doivent déposer une **offre publique** obligatoire.

~~~scene
retirer PACTE
vue aucune
focus OMEGA
~~~
` },

{ id: 'controle-de-fait', md: `# Le contrôle de fait : 40 % peuvent suffire
> Quand l'actionnariat est dispersé, la majorité absolue n'est pas nécessaire.

## 1. Un actionnariat dispersé
Zeta SA est cotée. **Kappa Holding** détient 42 %. Deux fonds détiennent 8 % et 6 %. Le reste (44 %) est éparpillé entre des milliers de petits porteurs.

Avec la seule règle de la majorité absolue, personne ne contrôle Zeta.

~~~scene
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
~~~

## 2. La réalité des assemblées
En pratique, les petits porteurs votent peu. Si seulement 60 % des voix sont présentes en assemblée, les 42 % de Kappa représentent **70 % des votes exprimés** : Kappa décide seule.

La loi pose donc une **présomption de contrôle** : une personne est présumée contrôler une société lorsqu'elle dispose directement ou indirectement d'une fraction des droits de vote **supérieure à 40 %** et qu'aucun autre associé ne détient une fraction **supérieure à la sienne** (art. L233-3, II).

L'option « Contrôle de fait (40 %) » est maintenant activée.

~~~scene
regle 40 on
focus K ZETA
note ZETA "Contrôle de fait présumé"
~~~

## 3. Le contrôle remonte la chaîne
Kappa Holding est contrôlée à 60 % par **M. Lefèvre**. Le contrôle de fait exercé par Kappa sur Zeta remonte jusqu'à lui.

~~~scene
personne LEF "M. Lefèvre"
lien LEF -> K 60%
vue LEF
~~~

## 4. Un concurrent monte au capital
Le Fonds Orion ramasse des titres en bourse et passe à **45 %** (les petits porteurs descendent à 7 %). Il détient désormais plus que Kappa : la présomption bascule en sa faveur.

> 💡 Ce n'est qu'une présomption : elle peut être renversée par la preuve contraire. Le contrôle de fait s'apprécie au cas par cas.

~~~scene
lien F1 -> ZETA 45%
lien PUB -> ZETA 7%
focus F1 ZETA
~~~
` },

{ id: 'consolidation', md: `# Périmètre de consolidation
> Intégration globale, mise en équivalence… et la différence entre pourcentage de contrôle et pourcentage d'intérêt.

## 1. La société mère
**Mère SA** détient trois participations directes. Selon le degré de contrôle, chacune sera traitée différemment dans les comptes consolidés.

~~~scene
societe M "Mère SA"
societe F1 "Filiale 1"
societe F2 "Associée 2"
societe F3 "Participation 3"
lien M -> F1 80%
lien M -> F2 30%
lien M -> F3 8%
vue M
~~~

## 2. Contrôle exclusif → intégration globale
Avec 80 % des voix, Mère SA contrôle **Filiale 1** : ses comptes sont repris **à 100 %** (intégration globale). Les 20 % des autres actionnaires apparaissent en **intérêts minoritaires** (participations ne donnant pas le contrôle).

~~~scene
focus F1
note F1 "Intégration globale (IG)"
~~~

## 3. Influence notable → mise en équivalence
Entre **20 % et 50 %** des voix, on présume une **influence notable** : Associée 2 est **mise en équivalence** (on ne reprend que la quote-part de capitaux propres et de résultat).

Sous 20 %, Participation 3 reste un simple titre financier, **non consolidé**.

~~~scene
focus F2 F3
note F2 "Mise en équivalence (MEE)"
note F3 "Non consolidée"
~~~

## 4. Une sous-filiale : contrôle ≠ intérêt
Filiale 1 détient **60 %** de **Sous-filiale**.

- **Pourcentage de contrôle** de Mère SA : 60 % (les voix de la société qu'elle contrôle) → **intégration globale**.
- **Pourcentage d'intérêt** : 80 % × 60 % = **48 %** → c'est la quote-part du résultat qui revient au groupe.

~~~scene
societe SF "Sous-filiale"
lien F1 -> SF 60%
focus SF
note SF "Contrôle 60 % · Intérêt 48 %"
~~~

## 5. Contrôle conjoint → coentreprise
Mère SA et un partenaire industriel créent **JV Co** à 50/50, avec un pacte exigeant l'unanimité pour les décisions clés : c'est un **contrôle conjoint**. En normes IFRS (IFRS 11), une coentreprise est mise en équivalence.

~~~scene
societe PART "Partenaire industriel"
societe JV "JV Co"
lien M -> JV 50%
lien PART -> JV 50%
concert PACTE_JV "Pacte JV" M PART
focus JV
~~~
` },

{ id: 'dilution', md: `# Levées de fonds et dilution
> Comment les fondateurs perdent la majorité au fil des augmentations de capital.

## 1. La création
Les deux fondateurs, **Ana** et **Hugo**, détiennent 50 % chacun de **Kiwi SAS**. Attention : à 50/50, aucun ne contrôle seul !

~~~scene
personne ANA "Ana"
personne HUGO "Hugo"
societe KIWI "Kiwi SAS"
lien ANA -> KIWI 50%
lien HUGO -> KIWI 50%
focus KIWI
~~~

## 2. Un pacte entre fondateurs
Ana et Hugo signent un pacte d'associés : ils votent toujours ensemble. Ils **contrôlent conjointement** Kiwi.

~~~scene
concert FDR "Pacte des fondateurs" ANA HUGO
focus KIWI
~~~

## 3. Tour d'amorçage : 20 %
Un business angel investit et reçoit **20 %** du capital via une augmentation de capital. Les fondateurs sont **dilués** : 50 % × 0,8 = 40 % chacun. Ensemble : 80 %.

~~~scene
personne ANGEL "Business angel"
lien ANA -> KIWI 40%
lien HUGO -> KIWI 40%
lien ANGEL -> KIWI 20%
focus ANGEL
~~~

## 4. Série A : 25 %
Un fonds de capital-risque souscrit **25 %** du capital après l'opération. Tous les anciens sont dilués d'un quart : fondateurs 30 % chacun (60 % ensemble), angel 15 %.

~~~scene
fonds VCA "Fonds Série A"
lien ANA -> KIWI 30%
lien HUGO -> KIWI 30%
lien ANGEL -> KIWI 15%
lien VCA -> KIWI 25%
focus VCA
~~~

## 5. Série B : 30 %
Nouveau tour : un fonds de croissance prend **30 %**. Fondateurs : 21 % chacun (**42 %** ensemble), angel 10,5 %, Série A 17,5 %.

Le pacte des fondateurs ne suffit plus : **plus personne ne contrôle Kiwi**. Les fondateurs restent le premier bloc, mais doivent composer.

~~~scene
fonds VCB "Fonds Série B"
lien ANA -> KIWI 21%
lien HUGO -> KIWI 21%
lien ANGEL -> KIWI 10.5%
lien VCA -> KIWI 17.5%
lien VCB -> KIWI 30%
focus KIWI
note KIWI "Fondateurs : 42 % — plus de contrôle"
~~~

## 6. Garder le pouvoir malgré la dilution
Solutions classiques en SAS, où les statuts sont très libres :
- **actions de préférence** à droits de vote multiples pour les fondateurs ;
- **élargir le pacte** : l'angel rejoint le concert (42 % + 10,5 % = **52,5 %**).

~~~scene
concert FDR "Pacte fondateurs + angel" ANA HUGO ANGEL
focus KIWI
~~~
` },

{ id: 'lbo', md: `# LBO : racheter une entreprise avec effet de levier
> Holding de reprise, dette d'acquisition, intégration fiscale et management package.

Un **LBO** (*leveraged buy-out*) est le rachat d'une société par une **holding de reprise** qui finance l'acquisition en partie par **emprunt**. La dette est ensuite remboursée grâce aux dividendes que la société rachetée fait remonter.

> ⚠️ Le canevas montre les **participations** (capital et pouvoir). La dette bancaire n'est pas une participation : elle apparaît dans les bulles et les commentaires. Les montants sont des exemples simplifiés.

## 1. La cible
**Industria SAS** appartient à 100 % à son fondateur, M. Moreau, qui souhaite céder. Prix retenu : **100 M€** (on suppose, pour simplifier, que la cible n'a pas de dette).

~~~scene
personne MOREAU "M. Moreau (fondateur)"
societe CIBLE "Industria SAS"
lien MOREAU -> CIBLE 100%
focus CIBLE
note CIBLE "Prix : 100 M€"
~~~

## 2. La holding de reprise
Un fonds de capital-investissement crée une société nouvelle, **NewCo** (holding de reprise). Il y apporte **36 M€** et l'équipe de direction **4 M€** : 40 M€ de fonds propres au total.

Fonds : **90 %** du capital, managers : **10 %**. Le fonds contrôle NewCo.

~~~scene
fonds LBO "Fonds LBO"
personne MGT "Équipe de direction"
holding NEWCO "NewCo (holding de reprise)"
lien LBO -> NEWCO 90%
lien MGT -> NEWCO 10%
focus NEWCO
note NEWCO "Fonds propres : 40 M€"
~~~

## 3. La dette d'acquisition et le rachat
NewCo emprunte **60 M€** auprès de banques et achète **100 %** d'Industria pour 100 M€ (40 M€ de fonds propres + 60 M€ de dette).

C'est bien **NewCo** qui s'endette, et non la cible : une société anonyme ne peut pas avancer des fonds, accorder des prêts ou consentir des sûretés pour financer l'achat de ses propres actions par un tiers (interdiction de l'assistance financière, art. L225-216 C. com.).

Le fonds contrôle désormais Industria **à 100 %** en n'ayant apporté que 36 M€ : la holding (levier **juridique**) et la dette (levier **financier**) se combinent.

~~~scene
retirer MOREAU
lien NEWCO -> CIBLE 100%
vue LBO
focus CIBLE
note NEWCO "Dette d'acquisition : 60 M€"
~~~

## 4. Le levier fiscal : l'intégration fiscale
NewCo n'a pas d'activité : pour payer les intérêts et rembourser la dette, elle compte sur les **dividendes** d'Industria.

Comme NewCo détient au moins **95 %** d'Industria, les deux sociétés peuvent opter pour l'**intégration fiscale** (art. 223 A CGI) : les charges d'intérêts de NewCo s'imputent sur les bénéfices d'Industria, ce qui réduit l'impôt du groupe — dans les limites prévues par la loi (plafonnement des charges financières, art. 212 bis CGI ; dispositif dit « Charasse », art. 223 B CGI).

> 💡 À 94 %, l'intégration fiscale serait impossible : ici encore, un seuil change tout.

~~~scene
focus NEWCO CIBLE
note CIBLE "95 % ou plus : intégration fiscale possible"
~~~

## 5. Le management package
Les dirigeants regroupent leurs titres dans une holding commune, **ManCo**. La directrice générale détient 60 % de ManCo, le directeur financier 40 %.

Intérêt économique de la DG dans Industria : 60 % × 10 % × 100 % = **6 %**. En pratique, s'y ajoutent souvent des mécanismes liés à la performance (**ratchet**, actions de préférence) qui augmentent la part des managers si le fonds atteint ses objectifs de rentabilité.

~~~scene
retirer MGT
holding MANCO "ManCo (managers)"
personne DG "Directrice générale"
personne DAF "Directeur financier"
lien DG -> MANCO 60%
lien DAF -> MANCO 40%
lien MANCO -> NEWCO 10%
vue DG
focus MANCO
~~~

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

~~~scene
vue LBO
note NEWCO "Dette restante : 30 M€"
note CIBLE "Valeur : 130 M€"
~~~

## 7. Synthèse : les quatre leviers
| Levier | Mécanisme |
|---|---|
| **Financier** | la dette amplifie la rentabilité des fonds propres (et le risque) |
| **Juridique** | la holding permet de contrôler 100 % de la cible avec une mise limitée |
| **Fiscal** | l'intégration fiscale (95 % ou plus) impute les intérêts sur les bénéfices de la cible |
| **Managérial** | les dirigeants deviennent associés et sont intéressés à la réussite |

Cliquez sur une entité pour revoir son analyse : contrôle, chaîne, intérêt économique.

~~~scene
vue LBO
selection CIBLE
~~~
` },

{ id: 'ifrs', md: `# IFRS : contrôle, périmètre et variations de pourcentage
> IFRS 10, IFRS 11, IAS 28 et IFRS 3 : ce que change chaque achat ou cession de titres dans les comptes consolidés.

> ⚠️ **Ce que l'outil montre — et ne montre pas.** IFRS 10 définit le contrôle par trois éléments : le **pouvoir** sur l'entité, l'**exposition à des rendements variables** et la **capacité d'utiliser ce pouvoir** pour influer sur ces rendements. L'outil raisonne sur les **droits de vote**, ce qui correspond au cas le plus courant, mais pas au seul. Les situations où le contrôle ne vient pas des votes (contrats, entités structurées, droits de vote potentiels, minorité importante face à un actionnariat dispersé) relèvent du **jugement** et ne sont pas calculées. La présomption « 40 % » proposée par l'outil vient du Code de commerce, pas des IFRS : elle reste désactivée ici.

## 1. Une filiale : contrôle et intégration globale
Mère SA détient **60 %** des droits de vote de la Filiale A. Sauf circonstances particulières, la majorité des droits de vote donne le pouvoir : Mère SA **contrôle** A (IFRS 10).

A est consolidée par **intégration globale** : 100 % de ses actifs, passifs, produits et charges entrent dans les comptes du groupe. Les 40 % détenus par d'autres actionnaires apparaissent en **participations ne donnant pas le contrôle** (PNC, ou *non-controlling interests*), dans les capitaux propres.

~~~scene
regle 40 off
societe M "Mère SA"
societe A "Filiale A"
lien M -> A 60%
vue M
focus A
note A "Intégration globale · PNC 40 %"
~~~

## 2. Une sous-filiale : contrôle en chaîne, intérêt dilué
A détient **70 %** de la Sous-filiale B. Mère SA contrôle A, qui contrôle B : B est aussi consolidée par **intégration globale**.

Mais la part du groupe dans B n'est que de 60 % × 70 % = **42 %**. Les PNC de B représentent **58 %** : 30 % d'actionnaires directs de B + 40 % × 70 % = 28 % revenant indirectement aux minoritaires de A.

> 💡 En consolidation, on intègre selon le **contrôle**, mais on partage les résultats selon l'**intérêt**.

~~~scene
societe B "Sous-filiale B"
lien A -> B 70%
focus B
note B "Contrôle ✔ · part du groupe 42 %"
~~~

## 3. Influence notable et coentreprise
- Mère SA détient **25 %** de C : au-delà de 20 % des voix, on présume une **influence notable** (IAS 28, présomption réfutable). C est une **entreprise associée**, comptabilisée par **mise en équivalence**.
- Mère SA et un partenaire détiennent chacun **50 %** de JV Co, avec un accord qui exige leur **consentement unanime** pour les décisions sur les activités pertinentes : c'est un **contrôle conjoint** (IFRS 11). Si l'accord donne des droits sur l'actif net de l'entité, c'est une **coentreprise**, mise en équivalence ; s'il donne des droits sur les actifs et des obligations au titre des passifs, c'est une **activité conjointe**, comptabilisée à hauteur de sa quote-part.

Dans le canevas, l'accord est représenté par un pacte. Attention : en IFRS 11, ce qui compte est l'**unanimité contractuelle**, que l'outil ne vérifie pas.

~~~scene
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
~~~

## 4. Mère SA rachète 20 % de A aux minoritaires
Mère SA passe de 60 % à **80 %** de A. Le contrôle ne change pas : selon IFRS 10, c'est une **transaction entre propriétaires**, comptabilisée **en capitaux propres**. Pas de nouveau goodwill, pas de résultat : on reclasse simplement une partie des PNC en part du groupe.

Effet en chaîne : la part du groupe dans B passe à 80 % × 70 % = **56 %**.

~~~scene
lien M -> A 80%
focus A B
note A "Sans changement de contrôle : capitaux propres"
~~~

## 5. Prise de contrôle par étapes
Mère SA passe de 25 % à **55 %** de C : elle en prend le **contrôle**. C'est un **regroupement d'entreprises** (IFRS 3), constaté à la date de prise de contrôle :
- la participation de 25 % déjà détenue est **réévaluée à la juste valeur**, l'écart passe en **résultat** ;
- le goodwill est calculé à cette date ;
- C passe de la mise en équivalence à l'**intégration globale**.

~~~scene
lien M -> C 55%
focus C
note C "IFRS 3 : réévaluation des 25 % antérieurs"
~~~

## 6. Perte de contrôle
Mère SA cède une partie de A et passe de 80 % à **30 %**. Elle **perd le contrôle** (IFRS 10) :
- elle décomptabilise les actifs, les passifs et les PNC de A — **et ceux de B**, qu'elle ne contrôlait qu'à travers A ;
- la participation conservée (30 %) est **réévaluée à la juste valeur** ; le résultat de cession passe en **résultat** ;
- ensuite, si l'influence notable est confirmée, A (avec sa filiale B) est mise en équivalence.

Observez le canevas : A et B perdent la couleur de Mère SA. B reste contrôlée… par A.

~~~scene
lien M -> A 30%
focus A B
note A "Perte de contrôle : déconsolidation"
~~~

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

~~~scene
vue M
selection B
~~~
` }

];
