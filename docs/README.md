# Capital Lab — atelier capital & pouvoir

**Capital Lab** est un outil pédagogique pour visualiser les structures de détention entre sociétés et comprendre **qui contrôle quoi, par quelle chaîne, et avec quelle part réelle du capital**.

Il montre notamment comment on peut être **minoritaire en capital** et pourtant **contrôler** une société : pyramides de holdings, pactes d'actionnaires, droits de vote double, autocontrôle, contrôle de fait…

[▶ Ouvrir l'atelier](../index.html ':ignore') — en ligne : **https://edu-fpar.github.io/capital-lab/**, utilisable aussi sur téléphone. Le bouton 🔗 Partager du mode cinéma donne un lien vers un scénario ou une étape précise ([détails](mode-cinema.md#partager-un-lien)).

## Deux façons de l'utiliser

| | Mode libre ✏️ | Mode cinéma 🎬 |
|---|---|---|
| Pour qui | l'enseignant qui prépare, l'étudiant qui expérimente | la classe, pendant le cours |
| Principe | on construit la structure à la souris et on règle les pourcentages avec des curseurs | un scénario markdown déroule la construction étape par étape, avec un commentaire |
| Rythme | libre | pas à pas, ou lecture continue à vitesse réglable |

Les deux modes partagent le même moteur de calcul : contrôle en chaîne, intérêt économique, seuils, autocontrôle, pactes.

## Par où commencer ?

- **Découvrir** : ouvrez l'atelier, passez en mode 🎬 Cinéma et lancez « La pyramide de holdings ».
- **Construire sa propre structure** : [Prise en main](prise-en-main.md).
- **Présenter en classe** : [Mode cinéma](mode-cinema.md) et [scénarios disponibles](scenarios.md).
- **Écrire un scénario** : à la main avec le [format des scénarios](format-scenario.md), ou à partir de votre support de cours avec une IA grâce à la [skill](ia-et-skill.md).
- **Vérifier un résultat surprenant** : [Règles de calcul](regles-de-calcul.md).

## Installation

Aucune. L'atelier est un ensemble de fichiers HTML, CSS et JavaScript sans dépendance :
- servi par un serveur web local (UwAmp, par exemple : `http://localhost/edu-fpar/capital-lab/`) ;
- ou ouvert directement en double-cliquant sur `index.html`.

Le bouton 🌙 / ☀️ en haut à droite bascule entre mode jour et mode nuit, ici comme dans l'atelier.

Cette documentation, elle, a besoin d'un serveur web et d'une connexion internet (elle utilise [Docsify](https://docsify.js.org)). Sans cela, ses pages restent lisibles telles quelles : ce sont les fichiers `.md` du dossier `docs/`.

## Remerciements

Merci à **Tao**, dont l'outil imaginé pour montrer à sa classe de droit financier comment on peut contrôler une société tout en y étant minoritaire est à l'origine de ce projet, et à **Yannick**, qui nous a transmis cette idée.
