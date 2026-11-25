---
droit: uk
---
# The scope of consolidation
> Full consolidation, equity method… and the difference between control and ownership interest.

A parent company prepares **group accounts** (Companies Act 2006, s. 399). Listed groups use **UK-adopted IFRS**; this scenario follows IFRS 10, IFRS 11 and IAS 28.

## 1. The parent
**Merrow plc** holds three direct investments. Depending on the degree of control, each will be treated differently in the consolidated accounts.

```scene
societe M "Merrow plc"
societe F1 "Subsidiary 1 Ltd"
societe F2 "Associate 2 Ltd"
societe F3 "Investment 3 Ltd"
lien M -> F1 80%
lien M -> F2 30%
lien M -> F3 8%
vue M
```
## 2. Control → full consolidation
With 80% of the votes, Merrow **controls** Subsidiary 1 (IFRS 10): its accounts are included **line by line, at 100%** (full consolidation). The other shareholders' 20% appears as **non-controlling interests** (NCI) in equity.

```scene
focus F1
note F1 "Full consolidation · NCI 20%"
```
## 3. Significant influence → equity method
With **20% or more** of the votes, **significant influence** is presumed (IAS 28): Associate 2 is accounted for using the **equity method** (only the group's share of its net assets and profit is recognised).

Below 20%, Investment 3 is simply a financial asset (IFRS 9), **not consolidated**.

```scene
focus F2 F3
note F2 "Equity method (IAS 28)"
note F3 "Financial asset (IFRS 9)"
```
## Question: what share of Sub-subsidiary's profit belongs to Merrow's shareholders?
Subsidiary 1 holds **60%** of **Sub-subsidiary Ltd**.

```scene
societe SF "Sub-subsidiary Ltd"
lien F1 -> SF 60%
focus SF
```
- [ ] 100%: it is fully consolidated
  Full consolidation brings in 100% of the revenue and expenses, but the profit is then shared with the NCI.
- [ ] 60%: the percentage of control
  60% are the votes Merrow commands through Subsidiary 1; it does not own them all.
- [x] 48%: 80% × 60%
  The ownership interest multiplies along the chain.
- [ ] 80%: Merrow's stake in Subsidiary 1
  That is only the first link of the chain.

### Answer
- **Control**: Merrow controls Subsidiary 1, which holds 60% of the votes of Sub-subsidiary → control, **full consolidation**.
- **Ownership interest**: 80% × 60% = **48%** → the share of profit attributable to the owners of the parent. The remaining 52% goes to NCI.

```scene
note SF "Control 60% · interest 48%"
```
## 5. Joint control → joint venture
Merrow and an industrial partner set up **JV Co Ltd** 50/50, with an agreement requiring **unanimous consent** for the key decisions: this is **joint control** (IFRS 11). A joint venture is accounted for using the equity method.

> ⚠️ Unlisted UK groups often apply **FRS 102** instead of IFRS (Section 9 for subsidiaries, Section 14 for associates, Section 15 for joint ventures): the concepts are close, the details differ.

```scene
societe PART "Industrial partner"
societe JV "JV Co Ltd"
lien M -> JV 50%
lien PART -> JV 50%
concert PACTE_JV "JV agreement" M PART
focus JV
```