---
droit: uk
---
# IFRS: control, scope and changes in ownership
> IFRS 10, IFRS 11, IAS 28 and IFRS 3: what each purchase or sale of shares changes in the consolidated accounts.

> ⚠️ **What the tool shows, and what it does not.** IFRS 10 defines control through three elements: **power** over the investee, **exposure to variable returns**, and the **ability to use that power** to affect those returns. The tool reasons on **voting rights**, which covers the most common case but not every case. Situations where control does not come from a majority of votes (contracts, structured entities, potential voting rights, a large minority facing dispersed shareholders) call for **judgement** and are not computed.

Groups whose securities are traded on a UK regulated market prepare their consolidated accounts under **UK-adopted IFRS** (Companies Act 2006, s. 403).

## 1. A subsidiary: control and full consolidation
Merrow plc holds **60%** of the voting rights of Subsidiary A. Unless other facts point elsewhere, a majority of the votes gives power: Merrow **controls** A (IFRS 10).

A is **fully consolidated**: 100% of its assets, liabilities, income and expenses enter the group accounts. The 40% held by other shareholders appears as **non-controlling interests** (NCI), within equity.

```scene
societe M "Merrow plc"
societe A "Subsidiary A Ltd"
lien M -> A 60%
vue M
focus A
note A "Full consolidation · NCI 40%"
```
## 2. A sub-subsidiary: control down the chain, diluted interest
A holds **70%** of Sub-subsidiary B. Merrow controls A, which controls B: B is also **fully consolidated**.

But the group's share of B is only 60% × 70% = **42%**. NCI in B amount to **58%**: 30% held directly by B's other shareholders + 40% × 70% = 28% belonging indirectly to A's minority shareholders.

> 💡 In consolidation, you include according to **control**, but you share profits according to **ownership interest**.

```scene
societe B "Sub-subsidiary B Ltd"
lien A -> B 70%
focus B
note B "Control ✔ · group share 42%"
```
## 3. Significant influence and joint venture
- Merrow holds **25%** of C: with 20% or more of the votes, **significant influence** is presumed (IAS 28, a rebuttable presumption). C is an **associate**, accounted for using the **equity method**.
- Merrow and a partner each hold **50%** of JV Co, under an agreement requiring their **unanimous consent** for decisions about the relevant activities: this is **joint control** (IFRS 11). If the arrangement gives rights to the net assets, it is a **joint venture** (equity method); if it gives rights to the assets and obligations for the liabilities, it is a **joint operation**, accounted for line by line for its share.

On the canvas, the agreement is shown as a concert party. Note: under IFRS 11, what counts is **contractual unanimity**, which the tool does not check.

```scene
societe C "Associate C Ltd"
lien M -> C 25%
societe PART "Partner Ltd"
societe JV "JV Co Ltd"
lien M -> JV 50%
lien PART -> JV 50%
concert ACCORD "Joint control agreement (unanimity)" M PART
focus C JV
note C "IAS 28: equity method"
note JV "IFRS 11: joint venture"
```
## Question: Merrow buys 20% of A from the minority. How is it accounted for?
Merrow goes from 60% to **80%** of A. It already had control.

```scene
lien M -> A 80%
focus A B
```
- [ ] New goodwill is recognised on the 20% purchased
  Goodwill is measured only once, when control is obtained.
- [ ] A gain or loss goes to profit or loss
  No gain or loss: nothing changes hands outside the group's owners.
- [x] In equity, as a transaction between owners
  IFRS 10: changes in ownership that do not result in a loss of control are equity transactions.

### Answer
Control does not change: under IFRS 10 this is a **transaction between owners**, recognised **in equity**. No new goodwill, no profit: part of the NCI is simply reclassified as the parent's share.

Knock-on effect: the group's share of B rises to 80% × 70% = **56%**.

```scene
note A "No change of control: equity transaction"
```
## 5. Control achieved in stages
Merrow goes from 25% to **55%** of C: it obtains **control**. This is a **business combination** (IFRS 3), recognised at the acquisition date:
- the 25% already held is **remeasured at fair value**, the difference going to **profit or loss**;
- goodwill is measured at that date;
- C moves from the equity method to **full consolidation**.

```scene
lien M -> C 55%
focus C
note C "IFRS 3: previous 25% remeasured"
```
## 6. Loss of control
Merrow sells part of A and goes from 80% to **30%**. It **loses control** (IFRS 10):
- it derecognises the assets, liabilities and NCI of A, **and those of B**, which it controlled only through A;
- the retained 30% is **remeasured at fair value**; the gain or loss on disposal goes to **profit or loss**;
- afterwards, if significant influence is confirmed, A (with its subsidiary B) is accounted for using the equity method.

Look at the canvas: A and B lose Merrow's colour. B is still controlled… by A.

```scene
lien M -> A 30%
focus A B
note A "Loss of control: deconsolidation"
```
## 7. What the canvas does not show
| IFRS notion | In the tool |
|---|---|
| Control through a majority of voting rights | ✔ computed |
| Control down the chain, group share, NCI | ✔ computed (perspective, analysis) |
| Significant influence (20% or more) | ✔ threshold shown, presumption only |
| Joint control (IFRS 11) | ≈ shown as a concert party; unanimity is not checked |
| De facto control with a large minority | ✘ case-by-case judgement |
| Potential voting rights (options, convertibles) | ✘ not modelled |
| Structured entities, contractual control, agent or principal | ✘ not modelled |
| Goodwill, fair value, disposal gain | ✘ figures to compute separately |

The tool therefore helps visualise the **scope** of consolidation and the effect of **changes in ownership**; the accounting measurement is done alongside.

```scene
vue M
selection B
```