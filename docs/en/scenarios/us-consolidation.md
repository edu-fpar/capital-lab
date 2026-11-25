---
droit: us
---
# Scope of consolidation under US GAAP
> Consolidation, equity method, fair value… and the difference between control and ownership interest.

> ⚠️ US GAAP has two consolidation models: the **voting interest model** (shown here) and the **variable interest entity** (VIE) model, where control comes from contracts or economic exposure rather than votes. The tool only computes votes.

## 1. The parent
**Parent Corp.** holds three direct investments. Depending on its level of control, each one is accounted for differently in the consolidated financial statements.

```scene
societe M "Parent Corp."
societe F1 "Subsidiary 1"
societe F2 "Investee 2"
societe F3 "Investee 3"
lien M -> F1 80%
lien M -> F2 30%
lien M -> F3 8%
vue M
```
## 2. Controlling financial interest → consolidation
With 80% of the votes, Parent Corp. has a **controlling financial interest** in **Subsidiary 1** (ASC 810, voting interest model: usually a majority of the voting interests). Subsidiary 1 is **consolidated**: 100% of its assets, liabilities, revenue and expenses. The 20% held by other stockholders is presented as **noncontrolling interest**, within equity.

```scene
focus F1
note F1 "Consolidated · NCI 20%"
```
## 3. Significant influence → equity method
At **20% or more** of the voting stock, **significant influence** is presumed (ASC 323, a rebuttable presumption): Investee 2 is accounted for under the **equity method** (one line: the share of its net assets and of its net income).

Below 20%, Investee 3 is a plain **equity security**: measured at **fair value** through net income (ASC 321), or at cost less impairment when it has no readily determinable fair value.

```scene
focus F2 F3
note F2 "Equity method (ASC 323)"
note F3 "Fair value (ASC 321)"
```
## Question: Subsidiary 1 owns 60% of a sub-subsidiary. How does Parent Corp. account for it?
Parent Corp. holds no share of the Sub-subsidiary directly.

```scene
societe SF "Sub-subsidiary"
lien F1 -> SF 60%
focus SF
```
- [ ] Equity method: Parent's interest is only 48%
  80% × 60% = 48% measures ownership, not control.
- [x] Full consolidation
  Parent controls Subsidiary 1, which controls the Sub-subsidiary with 60% of the votes.
- [ ] Not at all: Parent has no direct holding
  Control passes down the chain: the group includes indirect subsidiaries.

### Answer
- **Control**: Parent Corp. controls the 60% of the votes held by its subsidiary → the Sub-subsidiary is **consolidated**.
- **Ownership interest**: 80% × 60% = **48%** → the share of the Sub-subsidiary's net income attributable to Parent's stockholders. The other **52%** goes to noncontrolling interests (40% held directly by outsiders + 20% × 60% = 12% indirectly through Subsidiary 1).

> 💡 Consolidate according to **control**, split the results according to **ownership**.

```scene
note SF "Control 60% · interest 48%"
focus SF
```
## 5. Joint venture → equity method
Parent Corp. and an industrial partner form **JV Co** 50/50, with an agreement requiring both partners' consent for key decisions: **joint control**. Neither has a majority, so neither consolidates; each accounts for its investment in the corporate joint venture under the **equity method** (ASC 323).

```scene
societe PART "Industrial partner"
societe JV "JV Co"
lien M -> JV 50%
lien PART -> JV 50%
concert PACTE_JV "JV agreement" M PART
focus JV
```
## 6. Summary
| Voting interest | Accounting | Standard |
|---|---|---|
| more than 50% (direct or through a subsidiary) | consolidation, noncontrolling interest | ASC 810 |
| joint control (50/50 with veto) | equity method | ASC 323 |
| 20% to 50% | equity method (significant influence presumed) | ASC 323 |
| below 20% | fair value (or cost less impairment) | ASC 321 |

> ⚠️ Presumptions only: significant influence can exist below 20% (board seat) or be absent above it; a majority holder may lack control if minority holders have substantive participating rights.

```scene
vue M
selection SF
```