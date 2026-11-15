# Instructions pour une IA : créer un scénario Capital Lab

> Page destinée aux assistants IA (ChatGPT, Claude, Gemini, Mistral, Copilot…). Enseignant : donnez l'adresse de cette page à votre IA, avec votre cours.
> Atelier : https://edu-fpar.github.io/capital-lab/ · Documentation : https://edu-fpar.github.io/capital-lab/docs/

## Ta mission

L'enseignant te fournit un support de cours (texte, PDF, diapositives, notes, cas pratique). Tu produis un **scénario markdown** que l'atelier Capital Lab jouera en mode « cinéma » : à chaque étape, un commentaire s'affiche et des commandes construisent un schéma de participations entre sociétés, que l'outil analyse (qui contrôle quoi, par quelle chaîne, avec quel intérêt économique).

1. **Choisis ce qui se montre.** Retiens les notions qui se traduisent en structure : chaînes de détention, seuils (1/3, 50 %, 2/3, 90 %), droits de vote double, actions de préférence, pactes et action de concert, autocontrôle, holdings et LBO, périmètre de consolidation, dilution. Ce qui n'a pas de forme dans le canevas (montant d'une dette, goodwill, juste valeur, critères qualitatifs d'IFRS 10…) va dans le commentaire ou dans une bulle (`note`), jamais sous forme de faux lien. Si l'essentiel du support ne se représente pas, dis-le à l'enseignant plutôt que de forcer.
2. **Construis la progression.** 4 à 8 étapes, une idée par étape, du simple au complexe. Reprends les exemples, noms de sociétés et chiffres du support. Ajoute une ou deux **étapes questions** juste avant l'étape qui expliquerait la notion, avec des mauvais choix plausibles et une explication pour chaque choix.
3. **Écris le scénario** en respectant exactement le format décrit plus bas. Donne les calculs dans le texte (« 51 % × 51 % ≈ 26 % ») : l'outil affichera les mêmes valeurs.
4. **Vérifie tes chiffres** avec les règles de calcul plus bas : contrôle = plus de 50 % des voix effectives, en chaîne ; 50 % exactement ne suffit pas ; intérêt économique = produit des pourcentages de capital ; le public / flottant ne contrôle jamais ; les voix d'autocontrôle sont neutralisées. Si l'outil devait afficher autre chose que ton texte, corrige le texte ou les données.
5. **Reste exact.** Ne cite un article de loi ou un paragraphe de norme que s'il figure dans le support ou si tu en es certain. Signale les simplifications dans une citation « > ⚠️ ».

## Ta réponse

- **Un seul bloc de code** contenant le scénario complet, qui commence par « # Titre ». Comme le scénario contient lui-même des blocs ```scene, entoure-le d'un bloc à quatre accents graves (````markdown … ````), ou écris les blocs de commandes avec ~~~scene.
- Puis, hors du bloc, quelques lignes pour l'enseignant : le plan des étapes, et ce qu'il doit relire (références ajoutées par toi, simplifications, notions laissées de côté).
- Rappelle-lui comment l'utiliser : atelier Capital Lab → 🎬 Cinéma → 📚 Scénarios → coller le markdown → Lancer. Le bouton 🔗 Partager donne ensuite un lien à transmettre aux élèves.

---

# Annexe 1 — Format des scénarios « cinéma »

Un scénario est un fichier **markdown** ordinaire. L'outil le découpe en **étapes** (une par titre de niveau 2) et exécute, à chaque étape, les **commandes** des blocs `scene`.

## Structure

~~~
# Titre du scénario
> Une phrase de description (facultative).

Texte d'introduction (facultatif : il devient la première étape).

## 1. Titre de la première étape
Commentaire en markdown : **gras**, *italique*, listes, tableaux, citations…
On peut citer une entité par son identifiant : [[FAM]].

```scene
personne FAM "Famille Martin"
holding H1 "Martin Participations"
lien FAM -> H1 51%
focus H1
```

## 2. Titre de l'étape suivante
…
~~~

Règles :
- les étapes sont **cumulatives** : chaque étape part de l'état de la précédente ;
- `focus`, `note` et `selection` ne valent que pour l'étape où ils sont écrits ; `vue` reste active jusqu'à `vue aucune` ;
- les blocs peuvent s'écrire ```scene ou ~~~scene (alias : canevas, actions, script) ;
- dans un bloc, une ligne commençant par # ou // est un commentaire ;
- identifiants sans espace (FAM, H1, ALPHA…) ; noms entre guillemets ;
- pourcentages : 51%, 51, 51,5 %, 1/3 ou 2/3 sont acceptés.

## Étapes questions

Une étape peut interroger l'audience. Une fenêtre monte alors en bas du canevas avec la question et les choix en grandes cartes. L'enseignant peut cliquer sur le choix de la salle, puis révèle la réponse : bouton, **→** ou télécommande. Les cartes se colorent ; cliquer sur une carte la retourne pour lire son explication. L'explication générale s'affiche dans le panneau de droite. En lecture continue, le défilement attend la révélation.

~~~
## Question : qui contrôle Alpha SA ?
Contexte éventuel, affiché dans le panneau de droite.

```scene
focus ALPHA
```

- [ ] Personne
  Explication de ce choix (lignes indentées sous le choix).
- [x] La famille Martin
  Elle contrôle la holding, qui détient 51 % d'Alpha SA.
- [ ] Le Fonds Delta

### Réponse
Explication générale, affichée après la révélation.

```scene
vue FAM
note ALPHA "Contrôle par la chaîne"
```
~~~

Règles :
- une étape est une question si son titre commence par « Question » (ou « Quiz », « ❓ »), si elle contient des choix `- [ ]` / `- [x]`, ou une section `### Réponse` (aussi : Correction, Explication, Solution) ;
- `[x]` marque une bonne réponse ; il peut y en avoir plusieurs, ou aucune case pour une **question ouverte** ;
- le texte de la question est le titre, sans le préfixe « Question : » ;
- le contexte se place **avant** les choix ; les lignes indentées (ou « > ») juste sous un choix sont son explication ;
- les commandes placées **après** `### Réponse` ne s'exécutent qu'à la révélation, ce qui permet de montrer la réponse sur le canevas ; elles restent appliquées aux étapes suivantes (sauf `focus`, `note` et `selection`, propres à l'étape) ;
- évitez que le texte des étapes précédentes donne déjà la réponse.

## Commandes

| Commande | Effet |
|---|---|
| `personne ID "Nom"` | crée ou modifie une personne physique |
| `societe ID "Nom"` | idem pour une société (aussi : `holding`, `fonds`, `etat`, `public`) |
| `societe ID "Nom" at 200 150` | position fixe ; sans `at`, disposition automatique (actionnaires au-dessus) |
| `lien A -> B 51%` | A détient 51 % du capital et des droits de vote de B |
| `lien A -> B 35% votes 52%` | capital et droits de vote différents |
| `A -> B 20%` | forme courte de `lien` |
| `lien A -> A 5%` | auto-détention (actions propres) |
| `lien A -> B 0%` ou `retirer A -> B` | supprime la participation |
| `retirer ID` | supprime une entité (ou un pacte) |
| `renommer ID "Nouveau nom"` | renomme |
| `concert ID "Nom du pacte" A B C` | action de concert : A, B, C votent ensemble |
| `vue ID` / `vue aucune` | point de vue : intérêt et contrôle de ID affichés partout |
| `focus ID ID…` | met en évidence des entités |
| `note ID "texte"` | bulle explicative au-dessus d'une entité |
| `selection ID` | affiche l'analyse détaillée de ID sous le commentaire |
| `regle 40 on` / `regle 40 off` | présomption de contrôle de fait (> 40 %) |
| `duree 12` | durée de l'étape en lecture continue (secondes) |
| `deplacer ID X Y` | déplace une entité |
| `disposition auto` | remet toutes les entités en disposition automatique |
| `effacer` | vide le canevas |

Une entité citée dans un `lien` sans avoir été déclarée est créée automatiquement comme société.

## Conseils de rédaction

- 4 à 8 étapes ; chaque étape n'ajoute qu'une idée (une ou deux entités, un ou deux liens).
- Utilisez `focus` et `note` pour guider le regard, `vue` pour montrer l'intérêt indirect d'un actionnaire.
- Vérifiez que la somme des participations dans une société ne dépasse pas 100 % ; le reste est affiché comme « autres ».
- Donnez les chiffres clés dans le commentaire (ex. 51 % × 51 % ≈ 26 %) : l'outil les recalcule et les affiche, l'élève peut vérifier.
- Pour des droits de vote double, calculez la part des voix : 35 % du capital × 2 voix / 135 voix au total = 51,85 %.


---

# Annexe 2 — Règles de calcul

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


---

# Annexe 3 — Exemple complet

Un scénario réel de l'atelier (la pyramide de holdings), avec une étape question :

````markdown
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
````
