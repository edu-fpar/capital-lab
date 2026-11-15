/* ============================================================
 * Documentation intégrée : prise en main, format des scénarios,
 * prompt pour une IA.
 * ============================================================ */
window.P = window.P || {};

/* Aide rapide (fenêtre ❔ Aide) : l'essentiel, le détail est dans la documentation (docs/). */
P.HELP_LIBRE = `- Glissez une **entité** de la palette sur le canevas, puis tirez la poignée **+** d'un actionnaire vers une société.
- Cliquez sur une entité ou un lien : **curseurs** capital / droits de vote et **analyse** du contrôle à droite.
- **👁 Point de vue**, **🤝 Pacte**, **📸 Studio** (transformer une construction en scénario).`;

P.HELP_CINEMA = `- **📚 Scénarios** : choisir, coller ou déposer un scénario markdown.
- **→ / Espace** : étape suivante (révèle d'abord la réponse d'une question) ; **←** : précédente.
- **🔗 Partager** : lien vers une étape ou un scénario. Fonctionne aussi sur téléphone.`;

P.HELP_THANKS = `Merci à **Tao**, dont l'outil imaginé pour montrer à sa classe de droit financier comment on peut contrôler une société tout en y étant minoritaire est à l'origine de ce projet, et à **Yannick**, qui nous a transmis cette idée.`;

P.IA_INSTRUCTIONS_URL = 'https://edu-fpar.github.io/capital-lab/docs/instructions-ia.md';
P.IA_CONSIGNE = `Lis les instructions sur ${P.IA_INSTRUCTIONS_URL} et prépare un scénario Capital Lab à partir du cours ci-dessous (ou du fichier joint). Public : L3 droit des affaires, 6 étapes environ, avec une ou deux questions pour la salle.`;
/** Version pour une IA qui n'ouvre pas les liens : la consigne sans le lien, à placer après les instructions. */
P.iaConsigneSansLien = c => c.trim().replace(/^Lis les instructions sur \S+ et prépare/, 'En suivant les instructions ci-dessus, prépare');

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
