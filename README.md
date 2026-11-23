# Capital Lab — atelier capital & pouvoir

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.24464409.svg)](https://doi.org/10.5281/zenodo.24464409)

[![Capital Lab en mode libre : un groupe avec filiale, associée, sous-filiale et coentreprise sous pacte, le point de vue de la société mère et l'analyse de la filiale sélectionnée](capital-lab-libre.png)](https://edu-fpar.github.io/capital-lab/)

Outil pédagogique pour visualiser et expliquer les structures de participations entre sociétés :
on peut être **minoritaire** dans une société et pourtant la **contrôler** via des chaînes de participations,
des pactes, des droits de vote double, l'autocontrôle…

**▶ En ligne : [edu-fpar.github.io/capital-lab](https://edu-fpar.github.io/capital-lab/)** (aussi sur téléphone) ·
[documentation](https://edu-fpar.github.io/capital-lab/docs/)

Aucune installation : ouvrez `index.html` (double-clic) ou servez le dossier avec UwAmp
(`http://localhost/edu-fpar/capital-lab/`). Pas de dépendance externe, fonctionne hors ligne.

## Deux modes

- **✏️ Libre** : palette d'entités à glisser sur le canevas, liens tirés depuis la poignée `+`,
  curseurs capital / droits de vote, analyse automatique (contrôleur ultime, chaîne de contrôle,
  intérêt économique, minorité de blocage, autocontrôle), point de vue d'un actionnaire, pactes.
  Le **📸 Studio** capture des étapes commentées et les exporte en scénario markdown.
- **🎬 Cinéma** : déroule un scénario markdown, en **pas à pas** ou en **lecture continue**
  (rythme réglable), avec des **questions à la salle** et une vue adaptée au téléphone.
  Lien direct : `?scenario=pyramide&etape=6`, `?scenarios`, ou le bouton 🔗 Partager.
  Le bouton **📦 SCORM** exporte le scénario en paquet pour Moodle ou un autre LMS (achèvement, reprise, note).

  ![Capital Lab en mode cinéma : une pyramide de holdings et une question posée à la salle](capital-lab.png)

## Scénarios intégrés

`pyramide`, `majorites`, `droits-de-vote`, `autocontrole`, `concert`, `controle-de-fait`,
`consolidation`, `dilution`, `lbo`, `ifrs` — dans `js/library.js`.

## Écrire un scénario (enseignant ou IA)

Le format complet est dans l'application (❔ Aide → « Format des scénarios »), avec un bouton
**🤖 Copier le prompt pour une IA** qui contient la spécification prête à coller dans un assistant.

```markdown
# Mon scénario
> Description courte.

## 1. Première étape
Commentaire en **markdown**.

```scene
personne FAM "Famille Martin"
holding H1 "Martin Participations"
lien FAM -> H1 51%
focus H1
```
```

## Documentation et skill IA

- Documentation complète : `docs/index.html` (Docsify, à ouvrir via un serveur web, comme UwAmp). Les pages sont aussi lisibles directement : ce sont les fichiers `docs/*.md`.
- Skill Claude pour générer un scénario à partir d'un support de cours : `skill/scenario-capital-lab.skill` (voir `docs/ia-et-skill.md`).
- Après une modification du moteur, du format ou des scénarios : `node tools/build.js`, puis `python tools/package_skill.py`.

## Fichiers

| Fichier | Rôle |
|---|---|
| `js/model.js` | moteur : contrôle en chaîne, autocontrôle, concert, contrôle de fait, intérêts, disposition auto |
| `js/scenario.js` | parseur markdown → étapes, commandes, export studio, rendu markdown |
| `js/app.js` | interface : canevas SVG, inspecteur, lecteur cinéma, studio |
| `js/library.js` | scénarios intégrés |
| `js/docs.js` | aide, spécification du format, prompt IA |
| `js/scorm.js`, `js/scorm-runtime.js` | export SCORM et dialogue avec la plateforme dans le paquet |

## Remerciements

Merci à **Tao**, dont l'outil imaginé pour montrer à sa classe de droit financier comment on peut contrôler une société tout en y étant minoritaire est à l'origine de ce projet, et à **Yannick**, qui nous a transmis cette idée.

## Licence et citation

© 2026 François Parlant — [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr). L'usage en classe et en formation est libre, en citant l'auteur ; vos adaptations se partagent sous la même licence. Voir [LICENSE](LICENSE).

**Usage commercial** (organisme de formation, éditeur, marque blanche, scénarios sur mesure, paquets SCORM personnalisés) : une licence commerciale est possible sur accord. [Me contacter](https://edu-fpar.github.io/about.html).

**Citer cet outil** (bouton *Cite this repository* de GitHub, d'après [CITATION.cff](CITATION.cff)) :

> Parlant, F. (2026). *Capital Lab* [Logiciel pédagogique]. Zenodo. https://doi.org/10.5281/zenodo.24464409

Vous l'utilisez en cours ? [Dites-le-moi](https://www.linkedin.com/in/francois-parlant/) : ces retours m'aident à faire connaître et améliorer l'outil.

### License and citation

© 2026 François Parlant — [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Using it in class or in training is free, with credit to the author; adaptations must be shared under the same license. See [LICENSE](LICENSE).

**Commercial use** (training company, publisher, white label, custom scenarios, tailored SCORM packages): a commercial license is available by agreement. [Get in touch](https://edu-fpar.github.io/about.html?lang=en).

**How to cite** (GitHub's *Cite this repository* button, from [CITATION.cff](CITATION.cff)):

> Parlant, F. (2026). *Capital Lab* [Educational software]. Zenodo. https://doi.org/10.5281/zenodo.24464409

Using it in class? [Let me know](https://www.linkedin.com/in/francois-parlant/): this feedback helps me improve the tool and spread the word.
