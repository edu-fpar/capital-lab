# Mode cinéma

Le mode cinéma 🎬 déroule un **scénario** : à chaque étape, le canevas s'anime (entités qui apparaissent, liens qui se tracent, bulles et mises en évidence) et le panneau de droite affiche le commentaire.

## Charger un scénario

Bouton **📚 Scénarios** :
- choisir un scénario de la bibliothèque ([liste](scenarios.md)) ;
- ou **coller** le markdown fourni par un collègue ou une IA, puis « ▶ Lancer » ;
- ou **ouvrir un fichier** `.md`. On peut aussi le déposer directement sur la fenêtre.

Lien direct vers un scénario intégré : `index.html?scenario=pyramide`. Vers un fichier servi par le même serveur : `index.html?md=scenarios/mon-cours.md`.

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

## Interagir pendant la présentation

- **Cliquer sur une entité** affiche son analyse complète sous le commentaire.
- **Survoler un nom** surligné dans le commentaire met en évidence l'entité correspondante ; cliquer dessus la sélectionne.
- **Déplacer une entité ou une bulle** : glissez-la. C'est utile quand des bulles se chevauchent ou masquent un lien. Les déplacements sont conservés d'une étape à l'autre. Le bouton **↺ Disposition** remet tout à la place prévue par le scénario. Ces déplacements ne modifient pas le scénario lui-même.
- Le panneau « Plan du scénario » permet de sauter à n'importe quelle étape.

## Modifier ou réutiliser

- **📝 Markdown** ouvre le texte du scénario : on peut le corriger et l'appliquer en restant à la même étape, le copier ou le télécharger.
- **✏️ Explorer librement** recopie l'état affiché dans le mode libre, pour le manipuler (changer un pourcentage, ajouter un actionnaire…).

Si un scénario contient des commandes non comprises, un avertissement apparaît sous le commentaire, avec le numéro de ligne.
