# Mode cinéma

Le mode cinéma 🎬 déroule un **scénario** : à chaque étape, le canevas s'anime (entités qui apparaissent, liens qui se tracent, bulles et mises en évidence) et le panneau de droite affiche le commentaire.

## Charger un scénario

Bouton **📚 Scénarios** :
- choisir un scénario de la bibliothèque ([liste](scenarios.md)) ;
- ou **coller** le markdown fourni par un collègue ou une IA, puis « ▶ Lancer » ;
- ou **ouvrir un fichier** `.md`. On peut aussi le déposer directement sur la fenêtre.

## Partager un lien

L'atelier est en ligne à l'adresse **https://edu-fpar.github.io/capital-lab/**. Le bouton **🔗 Partager** propose trois liens à copier : vers **l'étape affichée**, vers **le début du scénario**, ou vers **la bibliothèque**. Pendant la lecture, l'adresse du navigateur suit d'ailleurs l'étape en cours : on peut aussi la copier directement.

| Lien | Ouvre |
|---|---|
| `…/capital-lab/?scenarios` | la bibliothèque des scénarios |
| `…/capital-lab/?scenario=pyramide` | un scénario intégré, à sa première étape |
| `…/capital-lab/?scenario=pyramide&etape=6` | ce scénario, directement à l'étape 6 |
| `…/capital-lab/?md=adresse-du-fichier.md` | un scénario publié sous forme de fichier |
| `…/capital-lab/#md=…` | un scénario personnel (collé ou généré par une IA), dont le texte est encodé dans le lien |

Pour un scénario personnel, le lien contient le texte compressé du scénario après le `#` : il n'est envoyé à aucun serveur et fonctionne sans rien publier. Pour un très long scénario, le lien peut devenir trop long pour certaines messageries : publiez plutôt le fichier `.md` et utilisez `?md=`. Dans tous les cas, `&etape=N` choisit l'étape d'arrivée.

## Sur téléphone

L'atelier s'adapte aux écrans étroits. Sur téléphone, il s'ouvre directement sur la bibliothèque des scénarios :
- le **schéma** occupe le haut de l'écran, les **explications** le bas ;
- les boutons **🗺 / ◫ / 📖** de la barre du bas affichent le schéma seul, les deux, ou le texte seul ;
- on **balaie** les explications vers la gauche ou la droite pour changer d'étape ; les boutons **◀ / Suivant** restent disponibles ;
- on **pince** le schéma pour zoomer, on le fait glisser pour se déplacer, et on touche une entité pour afficher son analyse sous le texte ;
- les **questions** s'affichent dans le texte, avec les choix empilés : toucher un choix pour indiquer sa réponse, « Révéler la réponse », puis toucher une carte pour la retourner.

Le mode libre reste accessible, mais il est conçu pour un écran plus large.

## Pas à pas ou lecture continue

En bas de l'écran :

| Contrôle | Effet |
|---|---|
| ⏮ ◀ | revenir au début, ou à l'étape précédente |
| Suivant ▶ | étape suivante |
| barres de progression | cliquer sur une barre pour aller à cette étape |
| Mode **Pas à pas** | c'est l'utilisateur qui avance |
| Mode **Lecture continue** | les étapes s'enchaînent ; ▶ / ⏸ pour lancer ou mettre en pause |
| Rythme | de 0,25× à 3× |

En lecture continue, la durée d'une étape dépend de la longueur de son commentaire (entre 5 et 45 secondes à vitesse 1×), sauf si le scénario la fixe avec `duree`. Une fine barre orange montre le temps restant.

Clavier : **→** / **←** pour avancer ou reculer, **Espace** pour avancer (pas à pas) ou faire lecture/pause (continu), **Origine** / **Fin** pour la première et la dernière étape, **F** pour recadrer.

## Étapes questions

Certaines étapes interrogent l'audience. Leur titre est précédé de ❓, et une fenêtre monte en bas du canevas avec la question et les choix en grandes cartes (A, B, C…).

1. **Laisser la salle répondre** : à main levée, à l'oral… Cliquez sur la carte choisie par la majorité, ou tapez son numéro : elle est marquée « 👥 choix de la salle ».
2. **Révéler la réponse** : bouton « 💡 Révéler la réponse », touche **→**, ou bouton « 💡 Réponse ▶ » de la barre du bas. Une télécommande de présentation fonctionne donc : un premier appui révèle, le suivant passe à l'étape d'après.
3. **Commenter chaque choix** : les bonnes réponses passent au vert, les autres s'estompent. Cliquez sur une carte, ou tapez son numéro, pour la **retourner** et lire pourquoi ce choix est juste ou faux.
4. **L'explication générale** s'ouvre dans le panneau de droite, en accordéon. La réponse peut aussi modifier le canevas : point de vue, mise en évidence, bulle.

La fenêtre ne masque pas la structure : le canevas se recadre automatiquement au-dessus d'elle, il reste déplaçable et zoomable, et le bouton **▾** réduit la fenêtre à une simple barre. En lecture continue, le défilement s'arrête sur une question jusqu'à la révélation, puis reprend.

Pour écrire une question, voir le [format des scénarios](format-scenario.md#étapes-questions).

## Interagir pendant la présentation

- **Cliquer sur une entité** affiche son analyse complète sous le commentaire.
- **Survoler un nom** surligné dans le commentaire met en évidence l'entité correspondante ; cliquer dessus la sélectionne.
- **Déplacer une entité ou une bulle** : glissez-la. C'est utile quand des bulles se chevauchent ou masquent un lien. Les déplacements sont conservés d'une étape à l'autre. Le bouton **↺ Disposition** remet tout à la place prévue par le scénario. Ces déplacements ne modifient pas le scénario lui-même.
- Le panneau « Plan du scénario » permet de sauter à n'importe quelle étape.

## Modifier ou réutiliser

- **📝 Markdown** ouvre le texte du scénario : on peut le corriger et l'appliquer en restant à la même étape, le copier ou le télécharger.
- **✏️ Explorer librement** recopie l'état affiché dans le mode libre, pour le manipuler (changer un pourcentage, ajouter un actionnaire…).

Si un scénario contient des commandes non comprises, un avertissement apparaît sous le commentaire, avec le numéro de ligne.
