# Format des scénarios « cinéma »

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
