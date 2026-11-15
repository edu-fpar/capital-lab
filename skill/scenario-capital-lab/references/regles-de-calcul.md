# Règles de calcul

Cette page décrit ce que calcule le moteur (`js/model.js`) et ce qu'il ne représente pas. Elle sert aussi de référence à la skill de génération de scénarios : le commentaire d'un scénario doit annoncer les mêmes résultats que l'outil.

## Entités et participations

| Type | Commande | Peut être détenu ? | Peut contrôler ? |
|---|---|---|---|
| Personne physique | `personne` | non | oui |
| Société | `societe` | oui | oui |
| Holding | `holding` | oui | oui |
| Fonds | `fonds` | oui | oui |
| État / entité publique | `etat` | non | oui |
| Public / flottant | `public` | non | **non** — il vote, mais un actionnariat dispersé ne forme jamais un bloc |

Une participation (lien `A -> B`) porte deux pourcentages : le **capital** et les **droits de vote** (par défaut égaux). Ce qui n'est attribué à personne est affiché comme « autres actionnaires ». Ces autres votent (ils comptent dans les 100 %), mais ne contrôlent jamais.

## Droits de vote effectifs et autocontrôle

Les voix attachées aux actions détenues par la société **elle-même** (auto-détention, lien `A -> A`) ou par une société **qu'elle contrôle** (autocontrôle) sont **neutralisées**. Les pourcentages des autres actionnaires sont alors recalculés sur la base restante :

> voix effectives = voix détenues ÷ (100 % − voix neutralisées)

Exemple : 46 % des voix, 10 % d'autocontrôle et 5 % d'auto-détention donnent 46 ÷ 85 = 54,1 % de voix effectives. Comme l'autocontrôle dépend du contrôle, et réciproquement, le moteur itère jusqu'à stabilité.

## Contrôle

Un **bloc** est soit une entité seule, soit un **pacte** (commande `concert`) réunissant plusieurs entités.

1. **Majorité** : un bloc contrôle une société s'il dispose de **plus de 50 %** des voix effectives, en additionnant ses propres voix et celles des sociétés qu'il contrôle déjà. C'est le contrôle **en chaîne** : la famille qui contrôle H1, qui contrôle H2, contrôle aussi ce que H2 contrôle.
2. **Contrôle de fait** (option `regle 40 on`, désactivée par défaut) : plus de 40 % des voix, et aucun autre actionnaire direct (hors public) n'en détient davantage. C'est la présomption du Code de commerce (art. L233-3, II), pas une règle IFRS.
3. **Contrôleur ultime** : le bloc qui contrôle une société sans être lui-même contrôlé. Si seul un pacte réunit la majorité, le contrôle est dit **conjoint**.

Exactement 50 % ne donne **pas** le contrôle : 50/50 signifie qu'aucun associé ne contrôle seul.

**Pacte et majoritaire seul.** Si l'un des membres d'un pacte dispose déjà seul de plus de 50 %, c'est lui le contrôleur (contrôle **exclusif**) ; le pacte n'y change rien dans l'outil. Le contrôle n'est affiché comme **conjoint** que lorsqu'aucun membre n'a la majorité seul et que le pacte la réunit. Un droit de veto ou une décision d'un commun accord prévus par le pacte ne sont pas modélisés : c'est au commentaire de les expliquer.

**Filiale ou société contrôlée.** L'outil raisonne en **contrôle** (art. L233-3 C. com.), direct ou indirect. Il ne qualifie pas les « filiales » au sens de l'art. L233-1 (plus de la moitié du capital détenue **directement**) ni les « participations » au sens de l'art. L233-2 (10 à 50 % du capital) : la couleur « participation » d'un lien ne concerne que la détention directe. Une société contrôlée en chaîne (sous-filiale) n'est donc pas une filiale de la société de tête au sens de L233-1 : si le cours pose cette question, la réponse se donne dans le commentaire.

## Intérêt économique

L'intérêt d'un actionnaire dans une société est la somme, sur tous les chemins de détention, du produit des pourcentages de **capital** :


> 51 % × 51 % × 51 % ≈ 13,27 %

Les participations croisées sont prises en compte (calcul itératif). Les actions auto-détenues sont retirées de la base.

## Seuils et couleurs des liens

Les couleurs s'appliquent aux **droits de vote effectifs** du lien :

| Seuil | Couleur | Sens |
|---|---|---|
| 90 % ou plus | vert foncé | retrait obligatoire possible (sociétés cotées) |
| 2/3 ou plus | vert | majorité en AGE |
| plus de 50 % | vert clair | majorité, contrôle |
| plus de 1/3 | orange | minorité de blocage |
| 20 % ou plus | violet | influence notable |
| 10 % ou plus | bleu | participation |
| moins de 10 % | gris | placement |

Liens en pointillés gris : voix neutralisées (autocontrôle, auto-détention).

Une entité **teintée** est contrôlée par le contrôleur ultime de la même couleur. Un contrôleur ultime a une **bordure épaisse** de sa couleur.

## Ce que l'outil ne représente pas

- les dettes, les prêts et les flux financiers (dividendes, intérêts) : on les met dans les commentaires et les bulles ;
- les valeurs : goodwill, juste valeur, prix, résultat de cession ;
- les critères qualitatifs du contrôle (IFRS 10 : pouvoir, rendements variables, lien entre les deux), les droits de vote potentiels, les entités structurées, le contrôle par contrat ;
- l'unanimité exigée par un accord de contrôle conjoint (IFRS 11) : un pacte est seulement traité comme un bloc de vote ;
- les règles propres à chaque forme sociale (statuts de SAS, quorum, majorités statutaires).

Dans ces cas, le canevas montre la structure, et le commentaire porte l'analyse.
