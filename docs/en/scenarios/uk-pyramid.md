---
droit: uk
---
# The holding pyramid
> How a family controls a large listed company while owning only a small slice of its capital.

We build a **cascade of holding companies**, one tier at a time. At each tier the family keeps the majority… but its **economic interest** shrinks.

Watch the colours: a **tinted** entity is controlled by the shareholder of the same colour.

## 1. The family sets up a holding company
The Hartley family transfers its shares to a holding company, **Hartley Holdings Ltd**, in which it holds **51%**. The other 49% belong to outside investors (not shown: they appear as "others").

With more than 50% of the voting rights, the family passes **ordinary resolutions** on its own (Companies Act 2006, s. 282) and can appoint and remove the directors (s. 168): it **controls** Hartley Holdings.

> ⚠️ Strictly, s. 1159 defines when a *company* is the subsidiary of another *company*. A family is not a company, but the test the tool applies is the same: a majority of the voting rights.

```scene
personne FAM "Hartley family"
holding H1 "Hartley Holdings Ltd"
lien FAM -> H1 51%
focus H1
```
## 2. A second tier
Hartley Holdings takes **51%** of a second holding company, **Hartley Industries Ltd**.

- The family holds no shares in Hartley Industries *directly*.
- But it controls Hartley Holdings, which controls Hartley Industries: control **passes down the chain** (a subsidiary of a subsidiary is itself a subsidiary, s. 1159(1)).
- Its **economic interest** (its share of the dividends) is only 51% × 51% ≈ **26%**.

**Perspective** mode (👁) shows the family's interest and control on every entity.

```scene
holding H2 "Hartley Industries Ltd"
lien H1 -> H2 51%
vue FAM
focus H2
```
## 3. The listed company
Hartley Industries holds **51%** of **Albion plc**, a large company listed on the London Stock Exchange.

The family controls Albion plc with an economic interest of 51% × 51% × 51% ≈ **13.3%**. The remaining 86.7% belongs to other investors… who have no say.

```scene
societe ALPHA "Albion plc (listed)"
lien H2 -> ALPHA 51%
focus ALPHA
note ALPHA "Controlled with about 13% of the economic interest"
```
## 4. One more tier
Albion plc takes 51% of **Beacon Ltd**. The family now controls Beacon with an interest of only **6.8%**.

> 💡 Each tier roughly halves the economic interest without ever diluting power: this is the **multiplier effect** of the pyramid.

```scene
societe BETA "Beacon Ltd"
lien ALPHA -> BETA 51%
focus BETA
```
## Question: what power does Thornbury Capital have in Albion plc?
The **Thornbury Capital** fund holds the other 49% of Hartley Holdings: it finances the pyramid almost as much as the family does.

```scene
fonds DELTA "Thornbury Capital"
lien DELTA -> H1 49%
vue aucune
focus DELTA ALPHA
```
- [ ] 49% of the votes in Albion plc
  Its 49% is in Hartley Holdings, not in Albion plc.
- [ ] About 12.7% of the votes, like its economic interest
  49% × 51% × 51% ≈ 12.7% measures its share of Albion's profits, not its votes.
- [x] None: it does not vote at Albion's general meetings
  Its votes only count at Hartley Holdings' general meetings, where the family has the majority.
- [ ] A blocking minority
  It has one in Hartley Holdings (49% is more than 25%, so it can defeat special resolutions there), but not in Albion plc.

### Answer
The fund has an **economic interest** of about **12.7%** in Albion plc (almost as much as the family's 13.3%) but **no votes**: it only votes at Hartley Holdings, where it is in the minority.

This is the paradox of the pyramid: you can **finance without deciding**. The fund's perspective is now shown on the canvas.

```scene
vue DELTA
focus DELTA ALPHA
```
## 6. Summary
| Company | Family's interest | Control |
|---|---|---|
| Hartley Holdings Ltd | 51% | ✔ |
| Hartley Industries Ltd | 26% | ✔ |
| Albion plc | 13.3% | ✔ |
| Beacon Ltd | 6.8% | ✔ |

Key points:
- **control percentage** ≠ **interest percentage**;
- control passes down the chain (s. 1159), interest is **multiplied**;
- transparency: individuals with more than 25% of the shares or votes, held directly or **indirectly**, must appear on the company's register of **persons with significant control** (Companies Act 2006, Part 21A);
- markets often apply a **holding company discount** to the companies at the top.

Click on an entity to see its detailed analysis.

```scene
vue FAM
selection BETA
```