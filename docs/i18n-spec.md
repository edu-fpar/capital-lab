# Capital Lab — langues et droits (spécification de travail)

> Document interne de cadrage de la traduction (EN, ES) et du multi-droit. Les traducteurs de scénarios
> et de documentation s'y réfèrent pour rester cohérents avec le moteur.

## 1. Langues et droits

| Langue de l'interface | Droits proposés | Droit par défaut |
|---|---|---|
| `fr` Français | `fr` France (C. com.) | `fr` |
| `en` English | `uk` United Kingdom (Companies Act 2006, Takeover Code) · `us` United States (Delaware, federal securities law) | `us` si le navigateur est en `en-US`, sinon `uk` |
| `es` Español | `es` España (Ley de Sociedades de Capital, SA de referencia, renvois SL) | `es` |

- Langue : `?lang=en|es|fr`, sinon choix mémorisé (`capital-lab.lang`), sinon langue du navigateur.
- Droit : sélecteur dans la barre d'outils ; un scénario impose son droit par un en-tête (front matter) :

```markdown
---
droit: uk
---
# Title of the scenario
```

- Le droit change **les seuils, couleurs et textes de la légende et de l'analyse**, les références légales,
  et la disponibilité de la règle « contrôle de fait 40 % » (**France uniquement** ; ne jamais écrire
  `regle 40 on` dans un scénario UK, US ou ES).
- Le **contrôle** reste partout : plus de 50 % des droits de vote effectifs, transmis en chaîne ;
  50 % exactement ne suffit pas ; intérêt économique = produit des pourcentages de capital ;
  le public / flottant ne contrôle jamais ; les voix d'autocontrôle (auto-détention, actions détenues par
  une société contrôlée) sont neutralisées ; les membres d'un concert forment un seul bloc de vote.

## 2. Seuils par droit (catégories du moteur, appliquées aux droits de vote effectifs)

Ordre d'évaluation : du plus haut au plus bas, la première catégorie atteinte s'applique.
**Source de vérité : `P.JURIS` dans `js/model.js`.** Chaque droit a aussi une catégorie « influence notable / significant influence / influencia significativa » à 20 % (IAS 28, ASC 323, NIC 28), placée selon sa valeur dans l'ordre ci-dessous.

### France `fr` (inchangé)
| Seuil | Clé | Effet |
|---|---|---|
| ≥ 90 % | retrait | retrait obligatoire possible (sociétés cotées) |
| ≥ 2/3 | qualifiee | majorité qualifiée en AGE |
| > 50 % | majorite | contrôle de droit (art. L233-3, I, 1° C. com.), décide seul en AGO |
| > 1/3 | blocage | minorité de blocage en AGE (SA) |
| ≥ 10 % | participation | participation (art. L233-2) |
| < 10 % | placement | placement financier |

### United Kingdom `uk`
| Threshold | Key | Effect |
|---|---|---|
| ≥ 90 % | squeeze | after a takeover offer, the bidder can buy out the minority (CA 2006, s. 979) |
| ≥ 75 % | special | passes **special resolutions** alone (s. 283): amend the articles (s. 21), disapply pre-emption rights, reduce capital… |
| > 50 % | majority | passes **ordinary resolutions** (s. 282), appoints and removes directors; **control**: subsidiary (s. 1159, majority of voting rights) |
| ≥ 30 % | bid | Takeover Code Rule 9: acquiring 30 % or more of the voting rights of a company subject to the Code triggers a **mandatory offer**; above 25 % it also blocks special resolutions |
| > 25 % | blocking | **blocking minority**: can defeat any special resolution (75 % needed); also a *person with significant control* (PSC register) |
| ≥ 3 % | notifiable | listed companies: holdings of 3 % or more of voting rights must be disclosed (DTR 5) |
| < 3 % | investment | portfolio investment |

### United States `us` (Delaware corporation, listed)
| Threshold | Key | Effect |
|---|---|---|
| ≥ 90 % | shortform | a parent holding at least 90 % of each class can merge the subsidiary without a stockholder vote (DGCL §253) |
| > 50 % | majority | majority of the voting power: elects the board (no cumulative voting by default), approves charter amendments and mergers (DGCL §242, §251: majority of the outstanding stock); **control** |
| ≥ 15 % | interested | **interested stockholder** (DGCL §203): business combinations restricted for 3 years unless approved by the board |
| ≥ 10 % | insider | 10 % beneficial owner: Section 16 insider (reporting, short-swing profits) |
| > 5 % | beneficial | more than 5 % of a registered class: Schedule 13D/13G disclosure (Exchange Act §13(d)) |
| ≤ 5 % | investment | portfolio investment |

No statutory blocking minority: a supermajority exists only if the **charter or bylaws** require it.

### España `es` (SA de referencia)
| Umbral | Clave | Efecto |
|---|---|---|
| ≥ 90 % | venta | tras una OPA sobre la totalidad del capital, venta forzosa (*squeeze-out*) de los minoritarios |
| ≥ 2/3 | reforzada | **mayoría reforzada**: en la SA, si concurre menos del 50 % del capital, modificar los estatutos exige 2/3 del capital presente o representado (art. 201.2 LSC); en la SL, transformación, fusión, escisión, supresión del derecho de preferencia… exigen 2/3 de los votos (art. 199 b LSC) |
| > 50 % | mayoria | mayoría absoluta; **control** (art. 42 del Código de Comercio: mayoría de los derechos de voto) |
| > 1/3 | bloqueo | **minoría de bloqueo** frente a los acuerdos de 2/3 (SL; SA con quórum bajo) |
| ≥ 30 % | opa | sociedad cotizada: alcanzar el 30 % de los derechos de voto obliga a formular una **OPA** (RD 1066/2007, art. 4) |
| ≥ 5 % | minoria | **derechos de minoría**: solicitar la convocatoria de la junta, complemento del orden del día, acción social (3 % en cotizadas) |
| < 5 % | inversion | inversión financiera |

## 3. Références légales par notion (texte de l'analyse)

| Notion | fr | uk | us | es |
|---|---|---|---|---|
| Contrôle | art. L233-3 C. com. | CA 2006 s. 1159 (subsidiary), s. 1162 (parent undertaking) | majority of the voting power | art. 42 Código de Comercio |
| Autocontrôle | art. L225-210 et L233-31 C. com. | treasury shares carry no votes (s. 726); a subsidiary cannot be a member of its holding company (s. 136) | treasury stock and shares held by a majority-owned subsidiary are not voted (DGCL §160(c)) | autocartera: derechos de voto suspendidos (art. 148 LSC), también las acciones de la dominante adquiridas por sus filiales (art. 134 y ss. LSC) |
| Concert | art. L233-10 C. com. | persons acting in concert (Takeover Code, Definitions) | a "group" under Exchange Act §13(d)(3) | actuación concertada (RD 1066/2007, art. 5) |
| Contrôle de fait 40 % | art. L233-3, II | — | — | — |

## 4. Scénarios par droit

Identifiants : préfixe du droit + nom anglais / espagnol. Fichiers : `js/library-uk.js`, `js/library-us.js`, `js/library-es.js`.

| Scénario français | uk | us | es |
|---|---|---|---|
| pyramide | ✅ `uk-pyramid` | ✅ `us-pyramid` | ✅ `es-piramide` |
| majorites | ✅ `uk-majorities` (75 % / 25 %) | ✅ `us-majority` (majority rule, supermajority only by charter) | ✅ `es-mayorias` (SA art. 201, SL art. 199) |
| droits-de-vote | ✅ `uk-voting-rights` (dual-class, non-voting preference shares) | ✅ `us-dual-class` (dual-class stock) | ✅ `es-derechos-voto` (acciones de lealtad, art. 527 ter LSC; acciones sin voto) |
| autocontrole | ✅ `uk-treasury-shares` | ✅ `us-treasury-stock` | ✅ `es-autocartera` |
| concert | ✅ `uk-concert` (Rule 9, 30 %) | ✅ `us-group` (13(d) group, §203 15 %) | ✅ `es-concierto` (OPA 30 %) |
| controle-de-fait | ❌ (présomption propre au droit français) | ❌ | ❌ |
| consolidation | ✅ `uk-consolidation` (IFRS 10, IFRS 11, IAS 28) | ✅ `us-consolidation` (ASC 810, ASC 323) | ✅ `es-consolidacion` (NIIF 10/11, NIC 28; NOFCAC) |
| dilution | ✅ `uk-dilution` (pre-emption, s. 561) | ✅ `us-dilution` (VC rounds) | ✅ `es-dilucion` (derecho de suscripción preferente) |
| lbo | ✅ `uk-lbo` (group relief 75 %) | ✅ `us-lbo` (consolidated return 80 %) | ✅ `es-lbo` (consolidación fiscal 75 %) |
| ifrs | ✅ `uk-ifrs` | ❌ (US GAAP : voir us-consolidation) | ✅ `es-niif` |

## 5. Contrat des fichiers

```js
/* js/library-uk.js */
window.P = window.P || {};
P.LIBRARY = P.LIBRARY || [];
P.LIBRARY.push(
{ id: 'uk-pyramid', lang: 'en', droit: 'uk', md: `---
droit: uk
---
# The holding pyramid
…` },
…
);
```

- Les blocs de commandes s'écrivent `~~~scene … ~~~` (pas d'accent grave dans les chaînes JS) ; aucun `${` ni accent grave dans le markdown.
- Les mots-clés des commandes restent ceux du format (`personne`, `societe`, `holding`, `fonds`, `etat`, `public`, `lien A -> B 51%`, `capital=… votes=…`, `concert`, `vue`, `focus`, `note`, `retirer`, `renommer`, `selection`, `disposition`, `deplacer`, `effacer`). Les alias anglais existants sont acceptés (`person`, `company`, `fund`, `state`, `link`, `view`, `highlight`, `remove`, `rename`, `select`, `clear`, `move`, `layout`), les alias espagnols seront ajoutés (`persona`, `sociedad`, `fondo`, `estado`, `publico`, `vinculo`, `vista`, `nota`, `quitar`…).
- Questions : titre `## Question: …` / `## Pregunta: …`, choix `- [ ]` / `- [x]` avec explication indentée, réponse sous `### Answer` / `### Respuesta`.
- Les nombres du texte doivent correspondre à ce que calcule le moteur (vérifier avec `node skill/scenario-capital-lab/scripts/verifier.js fichier.md`).
- Ne citer un article que si l'on en est sûr ; signaler les simplifications par une citation `> ⚠️ …`.
