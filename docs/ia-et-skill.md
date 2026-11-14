# Créer un scénario avec une IA

Deux possibilités, de la plus simple à la plus fiable.

## 1. Le prompt prêt à copier

Dans l'atelier : **❔ Aide** ou **📚 Scénarios**, puis **🤖 Copier le prompt pour une IA**. Le texte copié contient la [spécification du format](format-scenario.md). Collez-le dans l'assistant de votre choix, complétez la dernière section (sujet, public, nombre d'étapes) et joignez votre support si l'assistant accepte les fichiers.

Le résultat se colle ensuite dans 📚 Scénarios → « Votre propre scénario ». **Relisez les chiffres** : avec cette méthode, l'IA n'a pas vérifié ses calculs.

## 2. La skill « scenario-capital-lab » (recommandé)

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
