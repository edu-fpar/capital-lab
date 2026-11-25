---
droit: us
---
# The holding company pyramid
> How a family controls a large listed corporation while owning only a small fraction of its equity.

We build a **chain of holding companies** step by step. At each level the family keeps a majority of the votes… but its **economic interest** shrinks.

Watch the colors: a **tinted** entity is controlled by the shareholder of the same color.

## 1. The family sets up a holding company
The Carter family contributes its shares to a holding company, **Carter Holdings LLC**, and keeps **51%** of it. The other 49% belong to outside investors (not shown: they appear under "others").

With more than 50% of the voting power, the family elects the managers alone and decides every matter put to a majority vote: it **controls** the holding company.

```scene
personne FAM "Carter family"
holding H1 "Carter Holdings LLC"
lien FAM -> H1 51%
focus H1
```
## 2. A second level
Carter Holdings acquires **51%** of a second holding company, **Carter Industries Inc.**

- The family owns *no* share of Carter Industries directly.
- But it controls Carter Holdings, which controls Carter Industries: control **passes down** the chain.
- Its **economic interest** (its share of the dividends) is only 51% × 51% ≈ **26%**.

The **perspective** mode (👁) shows the family's interest and control on every entity.

```scene
holding H2 "Carter Industries Inc."
lien H1 -> H2 51%
vue FAM
focus H2
```
## 3. The listed corporation
Carter Industries owns **51%** of **Alpha Corp.**, a large corporation listed on the New York Stock Exchange.

The family controls Alpha Corp. with an economic interest of 51% × 51% × 51% ≈ **13.3%**. The other 86.7% belong to other investors… who have no say.

```scene
societe ALPHA "Alpha Corp. (NYSE-listed)"
lien H2 -> ALPHA 51%
focus ALPHA
note ALPHA "Controlled with about 13% of the economic interest"
```
## 4. One more level
Alpha Corp. acquires 51% of **Beta Inc.** The family now controls Beta with an interest of only **6.8%**.

> 💡 Each level roughly halves the economic interest without ever diluting control: this is the **leverage effect** of the pyramid.

> ⚠️ Deep pyramids are much rarer in the United States than in continental Europe or Asia; the taxation of intercorporate dividends is often cited as one reason. The mechanics of control are the same.

```scene
societe BETA "Beta Inc."
lien ALPHA -> BETA 51%
focus BETA
```
## Question: how much say does the Delta Fund have in Alpha Corp.?
**Delta Fund LP** owns the other 49% of Carter Holdings: it finances the pyramid almost as much as the family.

```scene
fonds DELTA "Delta Fund LP"
lien DELTA -> H1 49%
vue aucune
focus DELTA ALPHA
```
- [ ] 49% of the votes in Alpha Corp.
  Its 49% is in Carter Holdings, not in Alpha Corp.
- [ ] About 12.7% of the votes, like its economic interest
  49% × 51% × 51% ≈ 12.7% measures its share of Alpha's profits, not its votes.
- [x] None: it does not vote at Alpha's stockholder meetings
  Its votes count only in Carter Holdings, where the family holds the majority.
- [ ] A veto over Alpha's charter amendments
  US law gives no statutory blocking minority; in any case its 49% is in Carter Holdings, not in Alpha.

### Answer
The fund has an **economic interest** of about **12.7%** in Alpha Corp. — almost as much as the family (13.3%) — but **no vote** there: it only votes in Carter Holdings, where it is in the minority.

That is the paradox of the pyramid: you can **finance without deciding**. The fund's perspective is now shown on the canvas.

```scene
vue DELTA
focus DELTA ALPHA
```
## 6. Summary
| Company | Family interest | Control |
|---|---|---|
| Carter Holdings LLC | 51% | ✔ |
| Carter Industries Inc. | 26% | ✔ |
| Alpha Corp. | 13.3% | ✔ |
| Beta Inc. | 6.8% | ✔ |

Key points:
- **voting control** ≠ **economic interest**;
- control passes down the chain (a majority of the voting power at each level), interest is **multiplied**;
- holding companies often trade at a **holding company discount**.

Click an entity to see its detailed analysis.

```scene
vue FAM
selection BETA
```