# Instructions for an AI: creating a Capital Lab scenario

> Page intended for AI assistants (ChatGPT, Claude, Gemini, Mistral, Copilot…). Teachers: give the address of this page to your AI, together with your course material.
> Workshop: https://edu-fpar.github.io/capital-lab/?lang=en · Documentation: https://edu-fpar.github.io/capital-lab/docs/#/en/

## Your task

The teacher gives you course material (text, PDF, slides, notes, case study). You produce a **markdown scenario** that the Capital Lab workshop will play in "cinema" mode: at each step, a commentary is displayed and commands build a diagram of shareholdings between companies, which the tool analyses (who controls what, through which chain, with what economic interest).

1. **Choose the law.** The scenario is written in English under **UK law** (Companies Act 2006, Takeover Code) or **US law** (Delaware corporation law, federal securities law). Use the law stated by the teacher; otherwise infer it from the material; if it is still unclear, choose UK law and say so. The scenario **must begin** with this front-matter header (`uk` or `us`), before the title:

   ```
   ---
   droit: uk
   ---
   # Title of the scenario
   ```

   The header sets the thresholds, colours and legal references used by the tool. Never write `regle 40 on` (or `rule 40 on`): the 40% de facto control presumption exists only in French law.
2. **Choose what can be shown.** Keep the notions that translate into a structure: chains of holdings, thresholds (UK: 3%, 25%, 30%, 50%, 75%, 90%; US: 5%, 10%, 15%, 50%, 90%), dual-class shares, non-voting preference shares, shareholders' agreements and concert parties (13(d) groups in the US), treasury shares and cross-holdings, holding companies and LBOs, scope of consolidation, dilution. What has no shape on the canvas (amount of a debt, goodwill, fair value, qualitative criteria of IFRS 10 or ASC 810, board appointment rights, poison pills…) goes in the commentary or in a bubble (`note`), never as a fake link. If most of the material cannot be represented, tell the teacher rather than forcing it.
3. **Build the progression.** 4 to 8 steps, one idea per step, from simple to complex. Reuse the examples, company names and figures of the material. Add one or two **question steps** just before the step that would explain the notion, with plausible wrong choices and an explanation for each choice.
4. **Write the scenario** following exactly the format described below. Give the calculations in the text ("51% × 51% ≈ 26%"): the tool will display the same values.
5. **Check your figures** with the calculation rules below: control = more than 50% of the effective votes, along the chain; exactly 50% is not enough; economic interest = product of the capital percentages; the public / free float never controls; votes of treasury shares and of shares held by a controlled company are neutralised; members of a concert party form a single voting block. If the tool would display something other than your text, correct the text or the data.
6. **Stay accurate.** Cite a section, rule or standard only if it appears in the material or if you are certain of it. Flag simplifications in a "> ⚠️" quote (for example: resolutions are passed on the votes cast, not on all the votes).

## Your answer

- **A single code block** containing the complete scenario, starting with the `---` header and then "# Title". As the scenario itself contains ```scene blocks, wrap it in a block of four backticks (````markdown … ````), or write the command blocks with ~~~scene.
- Then, outside the block, a few lines for the teacher: the outline of the steps, and what they should review (references you added, simplifications, notions left out).
- Remind them how to use it: Capital Lab workshop → 🎬 Cinema → 📚 Scenarios → paste the markdown → Play. The 🔗 Share button then gives a link to send to students.

---

# Appendix 1 — "Cinema" scenario format

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


---

# Appendix 2 — Calculation rules

This page describes what the engine (`js/model.js`) computes and what it does not represent. It is also the reference for AIs that write scenarios: the commentary of a scenario must state the same results as the tool.

The **calculation of control and interest is the same under every law**. The law (`uk` or `us`, chosen in the toolbar or by the scenario's `droit:` header) only changes the **thresholds, colours, legend and legal references** described in the last sections.

## Entities and holdings

| Type | Command | Can be held? | Can control? |
|---|---|---|---|
| Individual | `person` | no | yes |
| Company | `company` (or `corporation`) | yes | yes |
| Holding company | `holding` | yes | yes |
| Fund | `fund` | yes | yes |
| State / public body | `state` | no | yes |
| Public / free float | `public` | no | **no**: it votes, but dispersed shareholders never form a block |

A holding (link `A -> B`) carries two percentages: the **shares** (capital) and the **voting rights** (equal by default). Whatever is not allocated to anyone is shown as "other shareholders". These others vote (they count in the 100%), but never control.

## Effective voting rights, treasury shares and cross-holdings

The votes attached to shares held by the company **itself** (treasury shares, link `A -> A`) or by a company **that it controls** are **neutralised**. The other shareholders' percentages are then recalculated on the remaining base:

> effective votes = votes held ÷ (100% − neutralised votes)

Example: 46% of the votes, 10% held by a controlled subsidiary and 5% of treasury shares give 46 ÷ 85 = 54.1% of the effective votes. As neutralisation depends on control, and vice versa, the engine iterates until the result is stable.

| Law | Basis |
|---|---|
| UK | the company cannot exercise any right, including voting, in respect of treasury shares (Companies Act 2006, s. 726); a subsidiary cannot be a member of its holding company (s. 136) |
| US | shares of a corporation's own stock belonging to it, or to another corporation of which it holds a majority of the voting shares, are neither voted nor counted for quorum (DGCL §160(c)) |

> ⚠️ In the UK, s. 136 *prohibits* a subsidiary from holding shares in its parent (with limited exceptions) rather than merely suspending the votes. The tool shows what would happen to the votes; the commentary should state that the holding itself is in principle not allowed.

## Control

A **block** is either a single entity or a **pact** (command `concert`) bringing several entities together.

1. **Majority**: a block controls a company if it has **more than 50%** of the effective votes, adding its own votes to those of the companies it already controls. This is **chained** control: the family that controls H1, which controls H2, also controls whatever H2 controls.
2. **Ultimate controller**: the block that controls a company without itself being controlled. If only a pact brings the majority together, control is said to be **joint**.

Exactly 50% does **not** give control: 50/50 means that no shareholder controls alone (deadlock).

| Law | Notion of control used by the tool |
|---|---|
| UK | **subsidiary** (Companies Act 2006, s. 1159): a company of which another holds a majority of the voting rights; a subsidiary of a subsidiary is itself a subsidiary of the parent. For accounts, see *parent undertaking* (s. 1162) |
| US | **majority of the voting power**: the holder elects the board and carries the stockholder votes that require a majority |

**No de facto control presumption.** The French option "de facto control (40%)" is a presumption of French law (art. L233-3, II of the French Commercial Code). It is not available under UK or US law, and the command `regle 40 on` must never appear in a `droit: uk` or `droit: us` scenario. A shareholder with 40% of a widely held company may well control it in practice (and IFRS 10 may treat it as control): this is a matter for the commentary, not for the engine.

**Pact and sole majority holder.** If one member of a pact already holds more than 50% on its own, it is the controller (**sole** control); the pact makes no difference in the tool. Control is shown as **joint** only when no member has the majority alone and the pact brings it together. A veto right or a unanimity requirement in the shareholders' agreement is not modelled: the commentary must explain it.

**Persons acting in concert.** The `concert` command treats the members as a single voting block. This matches the idea of:

| Law | Notion |
|---|---|
| UK | **persons acting in concert** (Takeover Code, Definitions): their holdings are aggregated, notably for the 30% threshold of Rule 9 |
| US | a **group** under Exchange Act §13(d)(3): persons who act together to acquire, hold or dispose of shares (and, under SEC rules, to vote them) are treated as one person, notably for the 5% disclosure threshold |

**Direct holding or control.** The colour of a link concerns only the **direct** holding (the effective votes carried by that link). Thresholds that the law applies to direct *and* indirect holdings, or to holdings aggregated with those of other persons, must be explained in the commentary; the analysis panel gives the total votes controlled.

## Economic interest

A shareholder's interest in a company is the sum, over all holding paths, of the product of the **capital** percentages:

> 51% × 51% × 51% ≈ 13.27%

Cross-holdings are taken into account (iterative calculation). Treasury shares are removed from the base.

## Thresholds and link colours

Link colours apply to the **effective voting rights** of the link. The categories are evaluated from the highest to the lowest: the first one reached applies. The legend of the workshop shows the colours for the selected law, from dark green (highest category) to grey (portfolio investment).

Dotted grey links: neutralised votes (treasury shares, shares held by a controlled company).

A **tinted** entity is controlled by the ultimate controller of the same colour. An ultimate controller has a **thick border** in its colour.

### United Kingdom (`droit: uk`)

| Threshold | Category | Meaning |
|---|---|---|
| 90% or more | squeeze-out | after a takeover offer, the bidder can buy out the minority (CA 2006, s. 979) |
| 75% or more | special resolution | passes **special resolutions** alone (s. 283): amending the articles (s. 21), disapplying pre-emption rights, reducing capital… |
| more than 50% | majority | passes **ordinary resolutions** (s. 282), appoints and removes directors; **control**: the company is a subsidiary (s. 1159) |
| 30% or more | mandatory bid | Takeover Code, Rule 9: acquiring an interest in shares carrying 30% or more of the voting rights of a company subject to the Code triggers a **mandatory offer**; above 25%, the holder also blocks special resolutions |
| more than 25% | blocking minority | can defeat any special resolution (75% needed); also a **person with significant control** (PSC register) |
| 3% or more | notifiable | listed companies: holdings of 3% or more of the voting rights must be disclosed (DTR 5) |
| less than 3% | investment | portfolio investment |

> ⚠️ Simplifications. Ordinary and special resolutions are passed by a majority of, or 75% of, the votes **cast** (or of the total voting rights for a written resolution of a private company): with low turnout, a smaller holding may be enough. The 90% of s. 979 is calculated on the shares **to which the offer relates** (those the bidder did not already hold), not on the total. The 3% DTR 5 threshold applies to UK issuers (5% for non-UK issuers). A person can be a PSC on other grounds (right to appoint or remove a majority of the board, significant influence or control).

### United States (`droit: us`, listed Delaware corporation)

| Threshold | Category | Meaning |
|---|---|---|
| 90% or more | short-form merger | a parent holding at least 90% of each class can merge the subsidiary without a stockholder vote (DGCL §253) |
| more than 50% | majority | majority of the voting power: elects the board (no cumulative voting by default), approves charter amendments and mergers (DGCL §242, §251: majority of the outstanding stock); **control** |
| 15% or more | interested stockholder | DGCL §203: business combinations with the corporation are restricted for 3 years unless approved by the board |
| 10% or more | insider | 10% beneficial owner: Section 16 insider (reporting, short-swing profits) |
| more than 5% | beneficial owner | more than 5% of a registered class: Schedule 13D / 13G disclosure (Exchange Act §13(d)) |
| 5% or less | investment | portfolio investment |

There is **no statutory blocking minority** in Delaware: a supermajority exists only if the **certificate of incorporation (charter) or bylaws** require it. The analysis therefore shows no blocking minority under US law.

> ⚠️ Simplifications. §203 has exceptions (prior board approval, 85% owned when becoming an interested stockholder, opt-out in the charter…). §253 requires 90% of **each class** of stock entitled to vote, and the tool reasons on total voting rights. Beneficial ownership under §13(d) and Section 16 includes shares one has the right to acquire within 60 days and shares held through others: the tool counts only the links drawn. Class votes required by the charter or by DGCL §242(b)(2) are not modelled.

### France

The French interface uses the thresholds of the French Commercial Code (1/3, 50%, 2/3, 90%…): see the [French documentation](https://edu-fpar.github.io/capital-lab/docs/#/regles-de-calcul).

## What the tool does not represent

- debts, loans and financial flows (dividends, interest): put them in the commentary and the bubbles;
- values: goodwill, fair value, price, gain on disposal;
- the qualitative criteria of control (IFRS 10: power, variable returns, link between the two; ASC 810: variable interest entities), potential voting rights, structured entities, control by contract;
- the unanimity required by a joint arrangement (IFRS 11): a pact is treated only as a voting block;
- rights to appoint or remove directors, board-level control, staggered boards, poison pills;
- votes cast versus votes outstanding, quorum, class votes, supermajorities set by the articles, the charter or the bylaws;
- whether a company is subject to the Takeover Code, or has a class of securities registered under the Exchange Act.

In these cases, the canvas shows the structure, and the commentary carries the analysis.


---

# Appendix 3 — Complete example

A complete scenario under UK law (the holding pyramid), with a question step. Its figures have been checked with the workshop's engine:

````markdown
---
droit: uk
---
# The holding pyramid
> How a family controls a large listed company while owning only a small fraction of its capital.

We build a **cascade of holding companies** step by step. At each level the family keeps the majority… but its **economic interest** shrinks.

Watch the colours: a **tinted** entity is controlled by the shareholder of the same colour.

## 1. The family sets up a holding company
The Harrison family transfers its shares to a holding company, **Harrison Holdings Ltd**, in which it holds **51%** of the shares. The remaining 49% belong to outside investors (not shown: they appear as "others").

With more than 50% of the voting rights, the family passes ordinary resolutions on its own: it **controls** the holding company, which is its subsidiary (Companies Act 2006, s. 1159).

```scene
person FAM "Harrison family"
holding H1 "Harrison Holdings Ltd"
link FAM -> H1 51%
highlight H1
```
## 2. A second level
The holding company takes **51%** of a second holding company, **Harrison Industries Ltd**.

- The family holds *no* shares directly in Harrison Industries.
- But it controls Harrison Holdings, which controls Harrison Industries: control **passes down** the chain.
- Its **economic interest** (its share of the dividends) is now only 51% × 51% ≈ **26%**.

The **point of view** mode (👁) shows the family's interest and control on every entity.

```scene
holding H2 "Harrison Industries Ltd"
link H1 -> H2 51%
view FAM
highlight H2
```
## 3. The listed company
Harrison Industries holds **51%** of **Alpha plc**, a large listed company.

The family controls Alpha plc with an economic interest of 51% × 51% × 51% ≈ **13.3%**. The other 86.7% belong to other investors… who have no say.

```scene
company ALPHA "Alpha plc (listed)"
link H2 -> ALPHA 51%
highlight ALPHA
note ALPHA "Controlled with ≈ 13% of the economic interest"
```
## 4. One more level
Alpha plc takes 51% of **Beta Ltd**. The family now controls Beta with an interest of only **6.8%**.

> 💡 Each level roughly halves the economic interest without ever diluting power: this is the **leverage effect** of the pyramid.

```scene
company BETA "Beta Ltd"
link ALPHA -> BETA 51%
highlight BETA
```
## Question: what power does the Delta Fund have in Alpha plc?
The **Delta Fund** holds the remaining 49% of Harrison Holdings: it finances the pyramid almost as much as the family does.

```scene
fund DELTA "Delta Fund"
link DELTA -> H1 49%
view none
highlight DELTA ALPHA
```
- [ ] 49% of the voting rights in Alpha plc
  Its 49% is in Harrison Holdings, not in Alpha plc.
- [ ] About 12.7% of the voting rights, like its economic interest
  49% × 51% × 51% ≈ 12.7% measures its share of Alpha's profits, not its votes.
- [x] None: it does not vote at Alpha plc's general meetings
  Its votes count only at Harrison Holdings' general meetings, where the family has the majority.
- [ ] A blocking minority
  It has one in Harrison Holdings (49%, more than 25%: it can defeat a special resolution), but not in Alpha plc.

### Answer
The fund has an **economic interest** of about **12.7%** in Alpha plc, almost as much as the family (13.3%), but **no voting rights** there: it only votes at Harrison Holdings, where it is in the minority.

This is the paradox of the pyramid: you can **finance without deciding**. The fund's point of view is now shown on the canvas.

```scene
view DELTA
highlight DELTA ALPHA
```
## 6. Summary
| Company | Family's interest | Control |
|---|---|---|
| Harrison Holdings Ltd | 51% | ✔ |
| Harrison Industries Ltd | 26% | ✔ |
| Alpha plc | 13.3% | ✔ |
| Beta Ltd | 6.8% | ✔ |

Key points:
- **percentage of control** ≠ **percentage of interest**;
- control passes down the chain (a subsidiary of a subsidiary is itself a subsidiary, s. 1159), whereas interest is **multiplied**;
- markets often apply a **holding company discount** to the company at the top.

Click on an entity to see its detailed analysis.

```scene
view FAM
select BETA
```
````
