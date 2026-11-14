---
name: scenario-capital-lab
description: Génère, à partir d'un support de cours (PDF, diapositives, polycopié, notes, cas pratique), un scénario markdown jouable en mode « cinéma » dans l'atelier Capital Lab, l'outil de visualisation des structures de contrôle entre sociétés. Le scénario est ensuite vérifié par le moteur de calcul de l'outil. Utiliser cette skill dès qu'un enseignant veut transformer un cours, un chapitre ou un exercice de droit des sociétés, droit financier, consolidation, IFRS, LBO, holdings, pactes d'actionnaires, OPA, dilution ou gouvernance en animation pas à pas, ou demande « un scénario pour l'outil Capital Lab », « une animation pour ma classe sur le contrôle », « le markdown cinéma de ce chapitre », même sans nommer l'outil.
---

# Générer un scénario « Capital Lab » à partir d'un support de cours

L'atelier Participations affiche des entités (personnes, sociétés, holdings, fonds, État, public) reliées par des participations (capital et droits de vote). Il calcule qui contrôle quoi, par quelle chaîne, et avec quel intérêt économique. En mode cinéma, il lit un fichier markdown étape par étape : chaque étape a un commentaire et des commandes qui modifient le canevas.

Ton travail : lire le support de l'enseignant, en tirer un scénario **juste**, **progressif** et **vérifié**, et le livrer sous forme de fichier `.md`.

## Ressources

- `references/format.md` — la syntaxe exacte du scénario et toutes les commandes. **À lire avant d'écrire.**
- `references/regles-de-calcul.md` — comment l'outil calcule le contrôle et les intérêts, et ce qu'il ne sait pas représenter. À lire pour que le commentaire et l'affichage concordent.
- `references/exemple.md` — un scénario complet qui fonctionne, comme modèle de ton et de rythme.
- `scripts/verifier.js` — rejoue le scénario avec le vrai moteur de l'outil et affiche, étape par étape, les contrôles et les intérêts calculés (`node scripts/verifier.js scenario.md`).

## Démarche

### 1. Lire le support et choisir ce qui se montre

Repère les notions qui se traduisent en **structure** : chaînes de détention, seuils (1/3, 50 %, 2/3, 90 %…), droits de vote double ou actions de préférence, pactes et action de concert, autocontrôle, holdings et LBO, périmètre et méthodes de consolidation, dilution, contrôle conjoint ou de fait.

L'outil n'affiche que des participations. Certaines notions du cours n'ont pas de forme dans le canevas : montant d'une dette, goodwill, juste valeur, flux de dividendes, critères qualitatifs du contrôle IFRS 10, droits de vote potentiels, entités structurées. Elles peuvent figurer dans le **commentaire** et dans les **bulles** (`note`), jamais sous forme de faux lien. Si l'essentiel du support relève de ces notions, dis-le à l'enseignant plutôt que de forcer un scénario approximatif : un outil pédagogique qui montre une chose fausse fait plus de mal que pas d'outil.

### 2. Construire la progression

- 4 à 8 étapes, chacune centrée sur **une idée** : on ajoute une ou deux entités, on modifie un ou deux liens. Le texte placé avant le premier `##` devient une étape « Introduction » non numérotée, qui ne compte pas dans ce total.
- Commence simple (une société, un actionnaire), complique ensuite (chaîne, pacte, variation de pourcentage).
- Reprends les **exemples, noms de sociétés et chiffres du support** quand il y en a : l'étudiant doit reconnaître son cours. Sinon, invente des noms neutres.
- Une dernière étape de synthèse (tableau, points à retenir) est souvent utile.
- Une ou deux **étapes questions** (voir `references/format.md`) rendent le déroulé interactif. Place-les juste **avant** l'étape qui expliquerait la notion, et vérifie que le texte qui précède ne donne pas déjà la réponse. Les mauvais choix doivent être des erreurs plausibles (confondre intérêt et contrôle, oublier la chaîne, prendre 50 % pour une majorité) ; chaque choix a une explication courte, et la section `### Réponse` peut montrer la solution sur le canevas (`vue`, `focus`, `note`). Si le support contient des exercices ou des questions de cours, reprends-les.

### 3. Écrire le scénario

Respecte `references/format.md`. Points qui comptent pour que le rendu soit bon :
- Le commentaire est lu à l'écran pendant que le canevas s'anime : phrases courtes, chiffres clés en **gras**, une citation `> 💡` pour l'idée à retenir.
- Donne les calculs dans le texte (« 51 % × 51 % ≈ 26 % ») : l'outil affiche les mêmes valeurs et l'étudiant peut vérifier.
- `focus` et `note` guident le regard ; ils ne valent que pour leur étape. Une bulle doit rester courte (environ 60 caractères).
- `vue ID` affiche partout l'intérêt et le contrôle d'un actionnaire : idéal pour les chaînes et les montages.
- Pour une société « mère » qui ne doit pas apparaître comme contrôlée, ne lui donne pas d'actionnaire, ou mets un `public`.
- Les sommes de participations dans une société ne doivent pas dépasser 100 %. Le reste est affiché automatiquement comme « autres ».

**Quand le cours pose une question dont la réponse est nuancée** (« y a-t-il contrôle conjoint ? », « est-ce une filiale ? »), donne la réponse que l'outil et le droit permettent de justifier, explique la nuance dans le commentaire, et signale-la à l'enseignant dans ton message de livraison plutôt que de bloquer en posant la question. Il pourra adapter l'étape. Attention aux écarts entre le vocabulaire du cours et celui de l'outil : l'outil parle de **contrôle** (direct ou en chaîne), pas de « filiale » au sens strict (voir `references/regles-de-calcul.md`).

**Exactitude juridique et comptable.** Cite un article de loi ou un paragraphe de norme seulement s'il figure dans le support, ou si tu en es certain. En cas de doute, décris la règle sans numéro. Signale les simplifications dans une citation `> ⚠️` (par exemple « montants simplifiés », « la dette n'est pas représentée par un lien »). L'enseignant préférera une référence absente à une référence fausse.

### 4. Vérifier avec le moteur

Enregistre le scénario dans un fichier, puis lance le script en donnant son chemin complet (il se trouve dans le dossier de cette skill) :

```bash
node <dossier-de-la-skill>/scripts/verifier.js chemin/du/scenario.md
```

Le script liste les commandes non comprises et, pour chaque étape, le contrôleur de chaque société, la chaîne, les droits de vote contrôlés, l'intérêt économique, ainsi que les voix réunies par chaque pacte. Il signale aussi les incohérences (sommes > 100 %, étapes sans commentaire, bulles trop longues).

Compare ces chiffres avec ton commentaire. Si l'outil dit « aucun contrôle » là où ton texte annonce un contrôle, c'est le texte ou les données qu'il faut corriger. Ne livre pas tant qu'il reste des erreurs ou des écarts. Si Node n'est pas disponible, refais les calculs à la main avec `references/regles-de-calcul.md` et indique à l'enseignant que la vérification automatique n'a pas été faite.

### 5. Livrer

Livre le fichier `.md` (nommé d'après le sujet, ex. `scenario-pactes-actionnaires.md`). Le fichier ne contient que le scénario, car il est affiché tel quel aux étudiants. Dans ton message, ajoute en quelques lignes :
- le plan des étapes ;
- comment l'utiliser : dans l'atelier, mode 🎬 Cinéma → 📚 Scénarios → coller le markdown ou ouvrir le fichier (on peut aussi le déposer sur la fenêtre) ;
- ce que l'enseignant devrait relire : références juridiques ajoutées par toi et non tirées du support, simplifications, notions du cours laissées de côté parce que l'outil ne les représente pas.
