# Préparer son cours avec une IA

Deux possibilités : n'importe quelle IA avec la page d'instructions, ou Claude avec la skill, qui vérifie en plus les chiffres.

## 1. Avec n'importe quelle IA

<div class="ai-box">
<ol class="ai-steps">
<li><strong>Copiez la consigne.</strong> Elle contient déjà le lien vers les instructions pour l'IA. Le texte est modifiable : adaptez le public ou le nombre d'étapes avant de copier.
<div class="ai-prompt js-ia-prompt" contenteditable="true" spellcheck="false" title="Texte modifiable">Lis les instructions sur <span class="js-ia-url">https://edu-fpar.github.io/capital-lab/docs/instructions-ia.md</span> et prépare un scénario Capital Lab à partir du cours ci-dessous (ou du fichier joint). Public : L3 droit des affaires, 6 étapes environ, avec une ou deux questions pour la salle.</div>
<button class="ai-btn big" data-copy-sel=".js-ia-prompt">📋 Copier la consigne</button></li>
<li><strong>Collez-la dans votre IA</strong> (ChatGPT, Claude, Gemini, Mistral, Copilot…), puis ajoutez votre cours : texte collé à la suite, ou fichier joint.</li>
<li><strong>Copiez la réponse de l'IA</strong> et collez-la dans l'<a href="../index.html?scenarios" target="_blank" rel="noopener">atelier</a> : 🎬 Cinéma → 📚 Scénarios → Lancer. Vous pouvez coller la réponse entière.</li>
</ol>
<details class="ai-more"><summary>Votre IA ne peut pas ouvrir de lien ?</summary>
<p>Copiez à la place la version complète : les instructions et la consigne réunies en un seul texte. Collez-le dans votre IA, puis ajoutez votre cours.</p>
<button class="ai-btn warn" data-copy-full="instructions-ia.md">📄 Copier la version complète</button> <a class="ai-link" href="instructions-ia.md" target="_blank" rel="noopener">voir les instructions</a>
</details>
<p class="ai-note">💡 Vous utilisez Claude ? La <a href="#/ia-et-skill">skill Capital Lab</a> vérifie en plus chaque chiffre avec le moteur de l'atelier.</p>
<p class="ai-note js-ia-local" hidden>ℹ️ Vous consultez cette documentation en local : la consigne pointe vers la version publiée, qu'une IA en ligne peut lire.</p>
</div>

Une IA générale ne peut pas exécuter le moteur de l'atelier : **relisez les chiffres** du commentaire en les comparant à ce que l'atelier affiche (cliquez sur une entité pour son analyse). Les avertissements de syntaxe s'affichent sous le commentaire.

Les IA qui explorent un site peuvent aussi partir du fichier [`llms.txt`](https://edu-fpar.github.io/capital-lab/llms.txt ':ignore'), qui pointe vers les pages utiles.

## 2. Avec Claude : la skill « scenario-capital-lab » (recommandé)

Une *skill* est un mode d'emploi que Claude charge automatiquement quand la demande s'y rapporte. Celle-ci apprend à Claude à :
1. lire votre **support de cours** (PDF, diapositives, polycopié, cas pratique) ;
2. retenir les notions que l'outil sait **représenter**, et laisser de côté, en vous le signalant, celles qu'il ne peut pas montrer correctement ;
3. écrire un scénario progressif qui reprend **vos exemples et vos chiffres** ;
4. le **rejouer avec le vrai moteur de l'atelier** pour vérifier que les contrôles et les pourcentages annoncés dans le commentaire correspondent à ceux qui s'afficheront ;
5. vous livrer le fichier `.md`, avec la liste de ce qu'il faut relire (références juridiques ajoutées, simplifications).

Les références d'articles de loi ou de normes ne sont ajoutées que si elles figurent dans votre support ou sont certaines ; les simplifications sont signalées dans le scénario.

### Installer la skill

Le fichier à installer est [`skill/scenario-capital-lab.skill`](../skill/scenario-capital-lab.skill ':ignore'). C'est une archive du dossier `skill/scenario-capital-lab/`.

- **Claude (application web ou bureau)** : dans les paramètres, rubrique des compétences (*Skills*), importez ce fichier. Les exécutions de code doivent être autorisées pour que la vérification fonctionne.
- **Claude Code** : copiez le dossier `skill/scenario-capital-lab/` dans `~/.claude/skills/` (pour vous) ou dans `.claude/skills/` d'un projet.

La vérification utilise Node.js. Si l'environnement n'en dispose pas, Claude refait les calculs à la main et vous le signale.

### L'utiliser

Joignez votre support et demandez, par exemple :

> Voici mon chapitre sur les groupes de sociétés. Fais-moi un scénario pour l'outil Capital Lab pour corriger le cas pratique en classe, en 6 étapes environ.

> À partir de ces diapositives sur les pactes d'actionnaires, prépare une animation pas à pas pour mes L3.

Vous recevez un fichier `.md` à ouvrir dans l'atelier : mode 🎬 Cinéma → 📚 Scénarios → ouvrir le fichier, ou déposer le fichier sur la fenêtre.

**Exemple réel** : à partir de ce [support de cours sur les groupes de sociétés](exemples-ia/support-cours-groupes.md), la skill a produit ce [scénario du groupe Vallon](exemples-ia/scenario-groupe-vallon.md), vérifié sans erreur par le moteur. Pour le lancer : [▶ ouvrir dans l'atelier](../index.html?md=docs/exemples-ia/scenario-groupe-vallon.md ':ignore'). Ce lien direct nécessite un serveur web, comme UwAmp.

### Contenu de la skill

| Fichier | Rôle |
|---|---|
| `SKILL.md` | la démarche : lire, choisir, construire, vérifier, livrer |
| `references/format.md` | la syntaxe des scénarios |
| `references/regles-de-calcul.md` | ce que calcule le moteur et ce qu'il ne représente pas |
| `references/exemple.md` | un scénario modèle (la pyramide de holdings) |
| `scripts/verifier.js` | rejoue un scénario avec le moteur et affiche les résultats étape par étape |
| `scripts/lib/` | copie du moteur de l'atelier |

Le vérificateur peut aussi servir sans IA, pour contrôler un scénario écrit à la main :

```bash
node skill/scenario-capital-lab/scripts/verifier.js mon-scenario.md
```
