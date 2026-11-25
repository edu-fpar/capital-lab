---
droit: us
---
# Leveraged buyout: HoldCo, BidCo and debt
> Acquisition vehicles, acquisition debt, consolidated tax return and management equity.

A **leveraged buyout** (LBO) is the acquisition of a company by a **private equity fund** through newly formed vehicles that finance the price largely with **debt**. The debt is then serviced with the cash flows of the acquired company.

> ⚠️ The canvas shows **ownership** (equity and votes). Bank debt is not ownership: it appears in the notes and the text. The amounts are simplified examples.

## 1. The target
**Prairie Tools Inc.** is 100% owned by its founder, Mr. Moore, who wants to sell. Agreed price: **$100 million** (assume, for simplicity, that the target has no debt).

```scene
personne MOORE "Mr. Moore (founder)"
societe CIBLE "Prairie Tools Inc."
lien MOORE -> CIBLE 100%
focus CIBLE
note CIBLE "Price: $100M"
```
## 2. HoldCo and BidCo
The fund forms two new corporations: **HoldCo**, which receives the equity, and its wholly owned subsidiary **BidCo**, which will borrow and buy the target. The fund puts in **$36 million**, the management team **$4 million**: $40 million of equity.

Fund: **90%** of HoldCo, managers: **10%**. The fund controls HoldCo, which controls BidCo.

> 💡 Two levels separate the lenders: the senior lenders lend to BidCo, closest to the target's assets; any mezzanine or holding-level debt sits higher and is **structurally subordinated**.

```scene
fonds LBO "Buyout Fund I LP"
personne MGT "Management team"
holding HOLDCO "HoldCo Inc."
holding BIDCO "BidCo Inc."
lien LBO -> HOLDCO 90%
lien MGT -> HOLDCO 10%
lien HOLDCO -> BIDCO 100%
focus HOLDCO BIDCO
note HOLDCO "Equity: $40M"
```
## 3. Acquisition debt and the purchase
BidCo borrows **$60 million** from banks and buys **100%** of Prairie Tools for $100 million ($40 million of equity + $60 million of debt).

Delaware has **no general ban on financial assistance**: once the deal closes, the target typically **guarantees** the loan and pledges its assets, or BidCo merges into it so that the debt sits where the cash is. The limits come from elsewhere: **fraudulent transfer** law if the target is left insolvent, and the loan covenants.

The fund now controls Prairie Tools **100%** with only $36 million of its own money: the holding structure (**legal** leverage) and the debt (**financial** leverage) combine.

```scene
retirer MOORE
lien BIDCO -> CIBLE 100%
vue LBO
focus CIBLE
note BIDCO "Acquisition debt: $60M"
```
## Question: what minimum stake lets BidCo and Prairie Tools file a single federal tax return?
BidCo has no business of its own: to pay interest, it relies on the target's cash flows. If both file a **consolidated federal income tax return**, BidCo's interest expense offsets Prairie Tools' taxable income.

```scene
focus BIDCO CIBLE
```
- [ ] More than 50% of the votes
  That is enough for control, not for a consolidated return.
- [x] At least 80% of the voting power and 80% of the value
  The affiliated group test of IRC §1504(a)(2).
- [ ] At least 95%
  That is the French tax consolidation threshold.
- [ ] 100%
  Not required: 80% of vote and value is enough.

### Answer
An **affiliated group** may file a consolidated return when the parent owns, directly or through other members, stock with at least **80% of the total voting power** and at least **80% of the total value** (**IRC §1504(a)(2)**). HoldCo, BidCo and Prairie Tools qualify: 100% at each level.

The interest deduction is capped, however: business interest expense is generally deductible only up to **30% of adjusted taxable income** (**IRC §163(j)**), the excess being carried forward.

> 💡 At 79%, no consolidated return: once again, a threshold changes everything.

```scene
note CIBLE "80% vote and value: consolidated return"
focus HOLDCO BIDCO CIBLE
```
## 5. Management equity
The managers pool their shares in a common vehicle, **ManCo LLC**. The CEO owns 60% of ManCo, the CFO 40%.

The CEO's economic interest in Prairie Tools: 60% × 10% × 100% × 100% = **6%**. On top of this, US deals usually grant **options** or **profits interests** that vest over time and with the fund's returns.

```scene
retirer MGT
holding MANCO "ManCo LLC (managers)"
personne CEO "CEO"
personne CFO "CFO"
lien CEO -> MANCO 60%
lien CFO -> MANCO 40%
lien MANCO -> HOLDCO 10%
vue CEO
focus MANCO
```
## 6. Five years later: the exit
Assumptions: over five years, Prairie Tools' cash flow paid the interest (≈ $13 million) and repaid **$30 million** of debt. At exit, Prairie Tools is worth **$130 million**.

| | No debt | LBO |
|---|---|---|
| Equity invested | $100M | $40M |
| Cash distributed over 5 years | ≈ $43M | 0 (services the debt) |
| Equity value at exit | $130M | 130 − 30 = $100M |
| Multiple (before tax) | ≈ 1.7x | 2.5x |

That is **financial leverage**: as long as the target's return exceeds the cost of debt, debt increases the return on equity. It also works **in reverse**: if the business declines, the debt is still due and can push the company into bankruptcy.

The fund (90%) receives $90 million for $36 million invested, the managers (10%) $10 million for $4 million — before any extra management incentives.

```scene
vue LBO
note BIDCO "Remaining debt: $30M"
note CIBLE "Value: $130M"
```
## 7. Summary: the four levers
| Lever | Mechanism |
|---|---|
| **Financial** | debt amplifies the return on equity (and the risk) |
| **Legal** | the HoldCo/BidCo chain controls 100% of the target with limited equity |
| **Tax** | the consolidated return (80% vote and value) offsets interest against the target's income, within §163(j) |
| **Managerial** | managers become owners and share in the upside |

Click an entity to review its analysis: control, chain, economic interest.

```scene
vue LBO
selection CIBLE
```