# Capital Lab — atelier capital & pouvoir

**Capital Lab** est un outil pédagogique pour visualiser les structures de détention entre sociétés et comprendre **qui contrôle quoi, par quelle chaîne, et avec quelle part réelle du capital**.

Il montre notamment comment on peut être **minoritaire en capital** et pourtant **contrôler** une société : pyramides de holdings, pactes d'actionnaires, droits de vote double, autocontrôle, contrôle de fait…

[▶ Ouvrir l'atelier](../index.html ':ignore') — en ligne : **https://edu-fpar.github.io/capital-lab/**, utilisable aussi sur téléphone.

![Mode cinéma : la pyramide de holdings, avec le point de vue de la famille Martin](images/cinema-pyramide-jour.jpg)
<p class="caption">Le mode cinéma : la pyramide de holdings, étape 3. Chaque entité affiche l'intérêt et le contrôle de la famille Martin.</p>


## 🤖 Préparer son cours avec une IA

<div class="ai-box">
<p>Pas besoin d'apprendre la syntaxe : n'importe quelle IA (ChatGPT, Claude, Gemini, Mistral, Copilot…) peut transformer votre cours en scénario animé. Donnez-lui simplement l'adresse de la <strong>page d'instructions pour IA</strong> :</p>
<p class="ai-line"><code class="js-ia-url">https://edu-fpar.github.io/capital-lab/docs/instructions-ia.md</code> <button class="ai-btn" data-copy-sel=".js-ia-url">📋 Copier l'adresse</button> <a class="ai-btn ghost" href="instructions-ia.md" target="_blank" rel="noopener">👁 Voir la page</a></p>
<p class="ai-sub">Puis écrivez par exemple :</p>
<div class="ai-prompt js-ia-prompt">Lis les instructions sur <span class="js-ia-url">https://edu-fpar.github.io/capital-lab/docs/instructions-ia.md</span> et prépare un scénario Capital Lab à partir du cours ci-dessous. Public : L3 droit des affaires, 6 étapes environ, avec une ou deux questions pour la salle.<br>[collez ici votre cours, votre plan ou votre cas pratique — ou joignez le fichier]</div>
<button class="ai-btn" data-copy-sel=".js-ia-prompt">📋 Copier la consigne</button>
<p class="ai-sub">L'IA répond avec un bloc de markdown : dans l'<a href="../index.html?scenarios" target="_blank" rel="noopener">atelier</a>, ouvrez 🎬 Cinéma → 📚 Scénarios, collez-le et lancez. Le bouton 🔗 Partager donne ensuite un lien à transmettre à vos étudiants.</p>
<p class="ai-note">💡 Avec Claude, la <a href="#/ia-et-skill">skill Capital Lab</a> va plus loin : elle rejoue le scénario avec le moteur de l'atelier pour vérifier chaque chiffre avant de vous le livrer.</p>
<p class="ai-note js-ia-local" hidden>ℹ️ Vous consultez cette documentation en local : l'adresse ci-dessus est celle de la version publiée, qu'une IA en ligne peut lire.</p>
<button class="ai-btn warn" data-copy-file="instructions-ia.md">📄 Copier toutes les instructions (pour les IA sans accès web)</button>
</div>

## Deux façons d'utiliser l'atelier

| | Mode libre ✏️ | Mode cinéma 🎬 |
|---|---|---|
| Pour qui | l'enseignant qui prépare, l'étudiant qui expérimente | la classe, pendant le cours ; l'étudiant qui révise sur téléphone |
| Principe | on construit la structure à la souris et on règle les pourcentages avec des curseurs | un scénario markdown déroule la construction étape par étape, avec un commentaire et des questions à la salle |
| Rythme | libre | pas à pas, ou lecture continue à vitesse réglable |

Les deux modes partagent le même moteur de calcul : contrôle en chaîne, intérêt économique, seuils, autocontrôle, pactes.

## Par où commencer ?

- **Découvrir** : ouvrez l'atelier, passez en mode 🎬 Cinéma et lancez « La pyramide de holdings ».
- **Présenter en classe** : [Mode cinéma](mode-cinema.md), [scénarios disponibles](scenarios.md) et [liens de partage](mode-cinema.md#partager-un-lien).
- **Construire sa propre structure** : [Prise en main du mode libre](prise-en-main.md).
- **Écrire un scénario** : avec une IA (ci-dessus, ou la [skill](ia-et-skill.md)), ou à la main avec le [format des scénarios](format-scenario.md).
- **Comprendre un résultat surprenant** : [Règles de calcul](regles-de-calcul.md).

## Installation

Aucune. L'atelier est un ensemble de fichiers HTML, CSS et JavaScript sans dépendance :
- en ligne sur **https://edu-fpar.github.io/capital-lab/** ;
- servi par un serveur web local (UwAmp, par exemple : `http://localhost/edu-fpar/capital-lab/`) ;
- ou ouvert directement en double-cliquant sur `index.html`.

Le bouton 🌙 / ☀️ en haut à droite bascule entre mode jour et mode nuit, ici comme dans l'atelier.

Cette documentation a besoin d'un serveur web et d'une connexion internet (elle utilise [Docsify](https://docsify.js.org)). Sans cela, ses pages restent lisibles telles quelles : ce sont les fichiers `.md` du dossier `docs/`.

## Remerciements

Merci à **Tao**, dont l'outil imaginé pour montrer à sa classe de droit financier comment on peut contrôler une société tout en y étant minoritaire est à l'origine de ce projet, et à **Yannick**, qui nous a transmis cette idée.
