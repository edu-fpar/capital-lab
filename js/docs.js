/* ============================================================
 * Documentation intégrée : prise en main, format des scénarios,
 * prompt pour une IA.
 * ============================================================ */
window.P = window.P || {};

P.HELP_DOC = `## Prise en main

**Mode libre ✏️**
- Glissez une entité de la palette (à gauche) sur le canevas — ou cliquez dessus.
- Tirez la poignée **+** située sous une entité vers une autre entité : la première devient **actionnaire** de la seconde. Tirez-la sur l'entité elle-même pour de l'**auto-détention**.
- Cliquez sur une entité ou un lien : le panneau de droite permet de régler le **capital** et les **droits de vote** avec des curseurs, et affiche l'**analyse** (qui contrôle, par quelle chaîne, avec quel intérêt économique).
- **👁 Point de vue** : choisissez un actionnaire ; chaque entité affiche alors son intérêt économique et son contrôle.
- **🤝 Pacte** : regroupez des actionnaires qui agissent de concert (contrôle conjoint).
- Molette = zoom, glisser le fond = déplacer la vue, **F** = tout afficher, **Suppr** = supprimer, **Ctrl+Z / Ctrl+Y** = annuler / rétablir.
- **📸 Studio** : capturez des étapes successives avec un commentaire, puis exportez-les en scénario markdown.

**Mode cinéma 🎬**
- Choisissez un scénario dans la bibliothèque, collez le markdown d'un enseignant ou d'une IA, ou déposez un fichier .md sur la fenêtre.
- **Pas à pas** : l'utilisateur passe lui-même à l'étape suivante (→ ou Espace).
- **Lecture continue** : les étapes s'enchaînent ; le curseur **Rythme** accélère ou ralentit.
- ← / → : étape précédente / suivante. Cliquez sur une entité pour afficher son analyse.
- **Étapes questions** : une fenêtre monte en bas du canevas. Cliquez sur le choix de la salle (ou tapez son numéro), puis → révèle la réponse ; cliquez sur une carte pour lire son explication. ▾ réduit la fenêtre ; le canevas reste déplaçable au-dessus.
- **🔗 Partager** : liens vers l'étape affichée, le début du scénario ou la bibliothèque (ex. ?scenario=pyramide&etape=6, ?scenarios). Un scénario personnel est encodé dans le lien lui-même.
- **Sur téléphone** : schéma en haut, explications en bas (boutons 🗺 / ◫ / 📖), balayer le texte pour changer d'étape, pincer le schéma pour zoomer.

## Couleurs et règles de calcul

- **Couleur d'un lien** : seuil atteint par les droits de vote *effectifs* (voir la légende). Pointillés gris : voix neutralisées (autocontrôle).
- **Bordure épaisse colorée** : contrôleur ultime. **Fond teinté de la même couleur** : entité qu'il contrôle, directement ou en chaîne.
- **Contrôle** : un bloc contrôle une société s'il dispose de **plus de 50 %** des droits de vote, en additionnant ses propres voix et celles des sociétés qu'il contrôle déjà (contrôle en chaîne, art. L233-3 et L233-4 C. com.).
- **Contrôle de fait** (option) : plus de 40 % des voix et aucun autre associé n'en détient davantage (art. L233-3, II).
- **Action de concert** : les membres d'un pacte forment un seul bloc ; s'il contrôle, c'est un **contrôle conjoint**.
- **Autocontrôle** : les voix des actions détenues par la société elle-même ou par une société qu'elle contrôle sont neutralisées ; les pourcentages des autres actionnaires sont recalculés.
- **Intérêt économique** : somme, sur tous les chemins, du produit des pourcentages de capital (ex. 51 % × 51 % = 26 %).
- Les actionnaires non représentés sont regroupés dans « autres ». Une entité **Public / flottant** vote, mais ne forme jamais un bloc de contrôle (actionnariat dispersé).

## Remerciements

Merci à **Tao**, dont l'outil imaginé pour montrer à sa classe de droit financier comment on peut contrôler une société tout en y étant minoritaire est à l'origine de ce projet, et à **Yannick**, qui nous a transmis cette idée.
`;

P.FORMAT_DOC = `# Format des scénarios « cinéma »

Un scénario est un fichier **markdown** ordinaire. L'outil le découpe en **étapes** (une par titre de niveau 2) et exécute, à chaque étape, les **commandes** des blocs \`scene\`.

## Structure

~~~
# Titre du scénario
> Une phrase de description (facultative).

Texte d'introduction (facultatif : il devient la première étape).

## 1. Titre de la première étape
Commentaire en markdown : **gras**, *italique*, listes, tableaux, citations…
On peut citer une entité par son identifiant : [[FAM]].

\`\`\`scene
personne FAM "Famille Martin"
holding H1 "Martin Participations"
lien FAM -> H1 51%
focus H1
\`\`\`

## 2. Titre de l'étape suivante
…
~~~

Règles :
- les étapes sont **cumulatives** : chaque étape part de l'état de la précédente ;
- \`focus\`, \`note\` et \`selection\` ne valent que pour l'étape où ils sont écrits ; \`vue\` reste active jusqu'à \`vue aucune\` ;
- les blocs peuvent s'écrire \`\`\`scene ou ~~~scene (alias : canevas, actions, script) ;
- dans un bloc, une ligne commençant par # ou // est un commentaire ;
- identifiants sans espace (FAM, H1, ALPHA…) ; noms entre guillemets ;
- pourcentages : 51%, 51, 51,5 %, 1/3 ou 2/3 sont acceptés.

## Étapes questions

Une étape peut interroger l'audience. Une fenêtre monte alors en bas du canevas avec la question et les choix en grandes cartes. L'enseignant peut cliquer sur le choix de la salle, puis révèle la réponse : bouton, **→** ou télécommande. Les cartes se colorent ; cliquer sur une carte la retourne pour lire son explication. L'explication générale s'affiche dans le panneau de droite. En lecture continue, le défilement attend la révélation.

~~~
## Question : qui contrôle Alpha SA ?
Contexte éventuel, affiché dans le panneau de droite.

\`\`\`scene
focus ALPHA
\`\`\`

- [ ] Personne
  Explication de ce choix (lignes indentées sous le choix).
- [x] La famille Martin
  Elle contrôle la holding, qui détient 51 % d'Alpha SA.
- [ ] Le Fonds Delta

### Réponse
Explication générale, affichée après la révélation.

\`\`\`scene
vue FAM
note ALPHA "Contrôle par la chaîne"
\`\`\`
~~~

Règles :
- une étape est une question si son titre commence par « Question » (ou « Quiz », « ❓ »), si elle contient des choix \`- [ ]\` / \`- [x]\`, ou une section \`### Réponse\` (aussi : Correction, Explication, Solution) ;
- \`[x]\` marque une bonne réponse ; il peut y en avoir plusieurs, ou aucune case pour une **question ouverte** ;
- le texte de la question est le titre, sans le préfixe « Question : » ;
- le contexte se place **avant** les choix ; les lignes indentées (ou « > ») juste sous un choix sont son explication ;
- les commandes placées **après** \`### Réponse\` ne s'exécutent qu'à la révélation, ce qui permet de montrer la réponse sur le canevas ; elles restent appliquées aux étapes suivantes (sauf \`focus\`, \`note\` et \`selection\`, propres à l'étape) ;
- évitez que le texte des étapes précédentes donne déjà la réponse.

## Commandes

| Commande | Effet |
|---|---|
| \`personne ID "Nom"\` | crée ou modifie une personne physique |
| \`societe ID "Nom"\` | idem pour une société (aussi : \`holding\`, \`fonds\`, \`etat\`, \`public\`) |
| \`societe ID "Nom" at 200 150\` | position fixe ; sans \`at\`, disposition automatique (actionnaires au-dessus) |
| \`lien A -> B 51%\` | A détient 51 % du capital et des droits de vote de B |
| \`lien A -> B 35% votes 52%\` | capital et droits de vote différents |
| \`A -> B 20%\` | forme courte de \`lien\` |
| \`lien A -> A 5%\` | auto-détention (actions propres) |
| \`lien A -> B 0%\` ou \`retirer A -> B\` | supprime la participation |
| \`retirer ID\` | supprime une entité (ou un pacte) |
| \`renommer ID "Nouveau nom"\` | renomme |
| \`concert ID "Nom du pacte" A B C\` | action de concert : A, B, C votent ensemble |
| \`vue ID\` / \`vue aucune\` | point de vue : intérêt et contrôle de ID affichés partout |
| \`focus ID ID…\` | met en évidence des entités |
| \`note ID "texte"\` | bulle explicative au-dessus d'une entité |
| \`selection ID\` | affiche l'analyse détaillée de ID sous le commentaire |
| \`regle 40 on\` / \`regle 40 off\` | présomption de contrôle de fait (> 40 %) |
| \`duree 12\` | durée de l'étape en lecture continue (secondes) |
| \`deplacer ID X Y\` | déplace une entité |
| \`disposition auto\` | remet toutes les entités en disposition automatique |
| \`effacer\` | vide le canevas |

Une entité citée dans un \`lien\` sans avoir été déclarée est créée automatiquement comme société.

## Conseils de rédaction

- 4 à 8 étapes ; chaque étape n'ajoute qu'une idée (une ou deux entités, un ou deux liens).
- Utilisez \`focus\` et \`note\` pour guider le regard, \`vue\` pour montrer l'intérêt indirect d'un actionnaire.
- Vérifiez que la somme des participations dans une société ne dépasse pas 100 % ; le reste est affiché comme « autres ».
- Donnez les chiffres clés dans le commentaire (ex. 51 % × 51 % ≈ 26 %) : l'outil les recalcule et les affiche, l'élève peut vérifier.
- Pour des droits de vote double, calculez la part des voix : 35 % du capital × 2 voix / 135 voix au total = 51,85 %.
`;

P.AI_PROMPT = `Tu vas rédiger un scénario pédagogique pour un outil de visualisation des structures de participations entre sociétés (droit des sociétés / droit financier français).
Le scénario doit respecter EXACTEMENT le format décrit ci-dessous : un document markdown, un titre de niveau 1, puis une étape par titre de niveau 2, chaque étape contenant un commentaire pédagogique en français et un bloc de commandes \`\`\`scene.
Les calculs (contrôle, intérêts indirects, couleurs) sont faits par l'outil : tes commentaires doivent donner les mêmes chiffres. Réponds uniquement avec le markdown du scénario.

----- SPÉCIFICATION DU FORMAT -----

` + P.FORMAT_DOC + `

----- SUJET DEMANDÉ -----

[Décris ici le concept à expliquer, le public (ex. L3 droit financier) et le nombre d'étapes souhaité.]
`;
