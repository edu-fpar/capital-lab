# "Cinema" scenario format

A scenario is an ordinary **markdown** file. The tool splits it into **steps** (one per level-2 heading) and, at each step, runs the **commands** in the `scene` blocks.

## Structure

~~~
---
droit: uk
---
# Title of the scenario
> A one-sentence description (optional).

Introductory text (optional: it becomes the first step).

## 1. Title of the first step
Commentary in markdown: **bold**, *italics*, lists, tables, quotes…
An entity can be mentioned by its identifier: [[FAM]].

```scene
person FAM "Harrison family"
holding H1 "Harrison Holdings Ltd"
link FAM -> H1 51%
highlight H1
```

## 2. Title of the next step
…
~~~

Rules:
- steps are **cumulative**: each step starts from the state left by the previous one;
- `highlight`, `note` and `select` apply only to the step where they are written; `view` stays active until `view none`;
- blocks can be written ```scene or ~~~scene (aliases: canvas, actions, script);
- inside a block, a line starting with # or // is a comment;
- identifiers without spaces (FAM, H1, ALPHA…); names in double quotes;
- percentages: 51%, 51, 51.5 %, 1/3 or 2/3 are accepted.

## Applicable law

The optional header (*front matter*) at the very top of the file sets the law used for the thresholds, colours, legend and legal references of the analysis:

| Header | Law |
|---|---|
| `droit: uk` | United Kingdom: Companies Act 2006, Takeover Code |
| `droit: us` | United States: Delaware corporation law (DGCL), federal securities law |
| `droit: fr` | France (Code de commerce) |

Without a header, the scenario uses the law selected in the toolbar. Control itself is computed in the same way under every law (more than 50% of the effective voting rights, passed down the chain).

## Question steps

A step can quiz the audience. A panel then slides up at the bottom of the canvas with the question and the choices as large cards. The teacher can click the class's choice, then reveal the answer: button, **→** or presentation remote. The cards change colour; clicking a card flips it to show its explanation. The general explanation appears in the right-hand panel. In continuous play, playback waits for the answer to be revealed.

~~~
## Question: who controls Alpha plc?
Optional context, shown in the right-hand panel.

```scene
highlight ALPHA
```

- [ ] Nobody
  Explanation of this choice (indented lines under the choice).
- [x] The Harrison family
  It controls the holding company, which holds 51% of Alpha plc.
- [ ] The Delta Fund

### Answer
General explanation, shown once the answer is revealed.

```scene
view FAM
note ALPHA "Controlled through the chain"
```
~~~

Rules:
- a step is a question if its heading starts with "Question" (or "Quiz", "❓"), if it contains `- [ ]` / `- [x]` choices, or an `### Answer` section (also: Explanation, Solution);
- `[x]` marks a correct answer; there may be several, or no box at all for an **open question**;
- the question text is the heading, without the "Question:" prefix;
- the context goes **before** the choices; indented lines (or "> ") just under a choice are its explanation;
- commands placed **after** `### Answer` run only when the answer is revealed, so the answer can be shown on the canvas; they remain in force in the following steps (except `highlight`, `note` and `select`, which belong to their step);
- make sure the text of earlier steps does not already give the answer away.

## Commands

| Command | Effect |
|---|---|
| `person ID "Name"` | creates or updates an individual |
| `company ID "Name"` | same for a company (also: `corporation`, `holding`, `fund`, `state`, `public`) |
| `company ID "Name" at 200 150` | fixed position; without `at`, automatic layout (shareholders above) |
| `link A -> B 51%` | A holds 51% of the shares and voting rights of B |
| `link A -> B 35% votes 52%` | different shares and voting rights |
| `A -> B 20%` | short form of `link` |
| `link A -> A 5%` | treasury shares (a company holding its own shares) |
| `link A -> B 0%` or `remove A -> B` | deletes the holding |
| `remove ID` | deletes an entity (or a pact) |
| `rename ID "New name"` | renames |
| `concert ID "Name of the pact" A B C` | concert party: A, B and C vote together |
| `view ID` / `view none` | point of view: ID's interest and control shown on every entity |
| `highlight ID ID…` | highlights entities |
| `note ID "text"` | explanatory bubble above an entity |
| `select ID` | shows the detailed analysis of ID under the commentary |
| `duration 12` | duration of the step in continuous play (seconds) |
| `move ID X Y` | moves an entity |
| `layout auto` | puts every entity back in automatic layout |
| `clear` | empties the canvas |

An entity mentioned in a `link` without having been declared is created automatically as a company. The French keywords (`personne`, `societe`, `lien`, `vue`, `focus`…) are accepted too. The French-law option `regle 40` (presumption of de facto control above 40%) does not exist under UK or US law: never use it in a `droit: uk` or `droit: us` scenario.

## Writing tips

- 4 to 8 steps; each step adds only one idea (one or two entities, one or two links).
- Use `highlight` and `note` to guide the eye, and `view` to show a shareholder's indirect interest.
- Check that the holdings in a company do not add up to more than 100%; the rest is shown as "others".
- Give the key figures in the commentary (e.g. 51% × 51% ≈ 26%): the tool computes and displays them again, so students can check.
- For weighted voting (dual-class shares), compute the share of the votes: 20% of the shares × 10 votes / (20 × 10 + 80 × 1) votes = 200 / 280 = 71.43%.
