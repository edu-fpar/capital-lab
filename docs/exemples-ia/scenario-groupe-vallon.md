# Le groupe Vallon
> Correction pas à pas du cas pratique du chapitre 4 : filiales, participations, contrôle en chaîne et action de concert.

On reconstruit le **groupe Vallon** étage par étage, puis on répond aux trois questions du cas.

Observez les couleurs : une entité **teintée** est contrôlée par l'actionnaire de la même couleur ; un contrôleur ultime a une **bordure épaisse**.

## 1. Au sommet : Vallon Holding
**Vallon Holding** est détenue à **55 %** par la famille Vallon et à **45 %** par le fonds **Arpège Capital**.

Avec plus de la moitié des droits de vote, la famille **contrôle** la holding (L233-3, 1°). Arpège Capital, avec 45 %, dispose d'une **minorité de blocage** (plus d'un tiers) mais ne décide pas.

```scene
personne FAM "Famille Vallon"
fonds ARP "Arpège Capital"
holding VH "Vallon Holding"
lien FAM -> VH 55%
lien ARP -> VH 45%
focus VH
```

## 2. Une filiale : Vallon Industries
Vallon Holding détient **70 %** de **Vallon Industries SA** ; les 30 % restants sont cotés en bourse (flottant).

- Plus de la moitié du capital : Vallon Industries est une **filiale** de Vallon Holding (L233-1).
- Le contrôle **se transmet** : la famille contrôle la holding, qui contrôle Vallon Industries.

```scene
societe VI "Vallon Industries SA"
public BOURSE "Flottant (bourse)"
lien VH -> VI 70%
lien BOURSE -> VI 30%
focus VI
note VI "Filiale : 70 % > 50 % (L233-1)"
```

## 3. Une participation : Logistique du Sud
Vallon Holding détient **30 %** de **Logistique du Sud SAS** ; **Transports Garnier** détient les **70 %** restants.

- Entre 10 et 50 % du capital : c'est une simple **participation** de Vallon Holding (L233-2).
- C'est **Transports Garnier** qui contrôle Logistique du Sud, avec 70 % des voix.

```scene
societe GAR "Transports Garnier"
societe LDS "Logistique du Sud SAS"
lien VH -> LDS 30%
lien GAR -> LDS 70%
focus LDS
note LDS "Participation de Vallon Holding (30 %)"
```

## 4. Le deuxième étage
Vallon Industries détient **52 %** de **Vallon Export SARL** et **15 %** de **Biomat SA**.

**Question a)** — Filiales et participations de Vallon Holding :
- **Vallon Industries** (70 %) : filiale ;
- **Logistique du Sud** (30 %) : participation ;
- **Vallon Export** : filiale de Vallon Industries, donc *sous-filiale* de la holding. Elle n'est pas filiale de la holding au sens de L233-1, qui vise la détention *directe* du capital, mais elle est **contrôlée indirectement** par elle (L233-3 : « directement ou indirectement ») ;
- **Biomat** (15 %) : participation de Vallon Industries ; la holding n'y a qu'un intérêt indirect de 70 % × 15 % = **10,5 %**.

> 💡 Filiale et participation se définissent par la détention **directe** du capital ; le contrôle, lui, s'apprécie **directement ou indirectement**.

```scene
societe VE "Vallon Export SARL"
societe BIO "Biomat SA"
lien VI -> VE 52%
lien VI -> BIO 15%
focus VE BIO
```

## 5. Question b) : la famille contrôle-t-elle Vallon Export ?
**Oui.** La famille contrôle Vallon Holding (55 %), qui contrôle Vallon Industries (70 %), qui contrôle Vallon Export (52 %) : à chaque étage, plus de 50 % des voix. Le contrôle se transmet le long de la chaîne.

Son **intérêt économique** se multiplie le long de la chaîne :
55 % × 70 % × 52 % ≈ **20 %**.

La famille **contrôle** Vallon Export alors qu'elle n'a droit qu'à un cinquième de ses bénéfices.

> 💡 Pourcentage de contrôle ≠ pourcentage d'intérêt.

```scene
vue FAM
focus FAM VE
note VE "Contrôlée avec ≈ 20 % d'intérêt"
```

## 6. Le point de vue d'Arpège Capital
Arpège Capital a, dans Vallon Export, un intérêt de 45 % × 70 % × 52 % ≈ **16,4 %** — presque autant que la famille.

Mais **aucun pouvoir** : ses voix sont minoritaires dès le premier étage, dans Vallon Holding.

```scene
vue ARP
focus ARP VE
```

## 7. Question c) : le pacte dans Logistique du Sud
Vallon Holding et Transports Garnier s'engagent à **voter de concert** dans Logistique du Sud. Ensemble, ils réunissent **100 %** des voix.

- C'est une **action de concert** : les associés liés par le pacte sont regardés comme un seul bloc de vote.
- Mais **Transports Garnier détient déjà 70 %** des voix à elle seule : le pacte ne lui apporte rien pour obtenir la majorité, et elle reste le contrôleur de Logistique du Sud (c'est ce qu'affiche l'outil).
- Pour Vallon Holding, le pacte ne lui donne **pas** la majorité à elle seule (pas de contrôle au sens de L233-3, 2°). On ne pourra parler de **contrôle conjoint** que si le pacte lui donne réellement voix au chapitre (par exemple un droit de veto ou des décisions prises d'un commun accord) : c'est le contenu du pacte qui le dira.

> ⚠️ L'outil traite un pacte uniquement comme un bloc de vote : il ne lit ni les clauses de veto, ni l'unanimité. L'analyse du contrôle conjoint relève du commentaire.

```scene
concert PACTE "Pacte Logistique du Sud" VH GAR
vue aucune
focus VH GAR LDS
selection LDS
```

## 8. Synthèse
| Société | Lien avec Vallon Holding | Contrôle par la famille | Intérêt de la famille |
|---|---|---|---|
| Vallon Holding | — | ✔ (55 %) | 55 % |
| Vallon Industries | filiale (70 %) | ✔ | 38,5 % |
| Vallon Export | sous-filiale (via VI) | ✔ | ≈ 20 % |
| Logistique du Sud | participation (30 %) | ✘ (Garnier, 70 %) | 16,5 % |
| Biomat | participation de VI (15 %) | ✘ | ≈ 5,8 % |

À retenir :
- **filiale** (> 50 %) et **participation** (10 à 50 %) : détention **directe** du capital ;
- **contrôle** : directement ou indirectement, il se transmet en chaîne ;
- l'**intérêt** se multiplie le long de la chaîne ;
- un **pacte** crée une action de concert, mais ne prive pas l'associé majoritaire de son contrôle.

```scene
vue FAM
focus VE LDS
```
