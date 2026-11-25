---
droit: uk
---
# LBO: buying a company with leverage
> Acquisition vehicle, acquisition debt, group relief and management equity.

A **leveraged buy-out** (LBO) is the purchase of a company by an **acquisition vehicle** (BidCo) which funds the price partly with **borrowing**. The debt is then serviced with the cash the target sends up.

> ⚠️ The canvas shows **shareholdings** (capital and power). Bank debt is not a shareholding: it appears in the bubbles and the text. Amounts are simplified examples; real deals often stack several companies (TopCo, MidCo, BidCo).

## 1. The target
**Ferrowell Ltd** is 100% owned by its founder, Mr Hargreaves, who wants to sell. Agreed price: **£100m** (to keep things simple, the target has no debt).

```scene
personne MOREAU "Mr Hargreaves (founder)"
societe CIBLE "Ferrowell Ltd"
lien MOREAU -> CIBLE 100%
focus CIBLE
note CIBLE "Price: £100m"
```
## 2. The acquisition vehicle
A private equity fund sets up a new company, **BidCo Ltd**. It invests **£36m** and the management team **£4m**: £40m of equity in total.

Fund: **90%** of the capital, managers: **10%**. The fund controls BidCo.

```scene
fonds LBO "Northgate private equity fund"
personne MGT "Management team"
holding NEWCO "BidCo Ltd"
lien LBO -> NEWCO 90%
lien MGT -> NEWCO 10%
focus NEWCO
note NEWCO "Equity: £40m"
```
## 3. Acquisition debt and the purchase
BidCo borrows **£60m** from banks and buys **100%** of Ferrowell for £100m (£40m of equity + £60m of debt).

Can the target help finance its own purchase (guarantees, security over its assets)? Since 2008 the prohibition of **financial assistance** applies only where a **public company** is involved (Companies Act 2006, ss. 678–679). Ferrowell is a private company: it may guarantee BidCo's loans, subject to its directors' duties (s. 172). When the target is a plc, it is often re-registered as private after the deal.

The fund now controls Ferrowell **100%** having put in only £36m: the holding structure (**legal** leverage) and the debt (**financial** leverage) combine.

```scene
retirer MOREAU
lien NEWCO -> CIBLE 100%
vue LBO
focus CIBLE
note NEWCO "Acquisition debt: £60m"
```
## Question: why must BidCo hold at least 75% of Ferrowell?
BidCo has no business of its own: its interest charges create a **tax loss**, while Ferrowell makes taxable profits. Dividends from Ferrowell to BidCo are generally exempt (Corporation Tax Act 2009, Part 9A).

```scene
focus NEWCO CIBLE
```
- [ ] To pass special resolutions in Ferrowell
  True, 75% does that, but it is not the tax point.
- [x] So that BidCo's losses can be set against Ferrowell's profits through group relief
  Group relief requires a 75% relationship (Corporation Tax Act 2010, Part 5).
- [ ] To file a single consolidated tax return
  The UK has no tax consolidation: each company files its own return.

### Answer
**Group relief** lets a company surrender its current-year losses to another company in the same **75% group** (Corporation Tax Act 2010, Part 5; "75% subsidiary", s. 1154). BidCo's interest charges thus reduce the tax on Ferrowell's profits.

Limits: the **corporate interest restriction** caps net interest deductions, broadly at 30% of tax-EBITDA above £2m a year (Taxation (International and Other Provisions) Act 2010, Part 10).

> 💡 At 74%, no group relief: here again, a threshold changes everything.

> ⚠️ Simplification: besides 75% of the ordinary share capital, group relief also requires 75% of the profits and of the assets on a winding-up.

```scene
note CIBLE "75% or more: group relief possible"
```
## 5. Management equity
The managers pool their shares in a common company, **ManCo Ltd**. The chief executive holds 60% of ManCo, the finance director 40%.

The chief executive's economic interest in Ferrowell: 60% × 10% × 100% = **6%**. Performance mechanisms (**sweet equity**, **ratchet**) usually increase the managers' share if the fund reaches its target return.

```scene
retirer MGT
holding MANCO "ManCo Ltd (managers)"
personne DG "Chief executive"
personne DAF "Finance director"
lien DG -> MANCO 60%
lien DAF -> MANCO 40%
lien MANCO -> NEWCO 10%
vue DG
focus MANCO
```
## 6. Five years later: the exit
Assumptions: over five years, Ferrowell's cash flow paid the interest (about £13m) and repaid **£30m** of debt. At exit, Ferrowell is worth **£130m**.

| | Without debt | With LBO |
|---|---|---|
| Equity invested | £100m | £40m |
| Cash distributed over 5 years | about £43m | 0 (services the debt) |
| Equity value at exit | £130m | 130 − 30 = £100m |
| Multiple (before tax) | about 1.7× | 2.5× |

This is **financial leverage**: as long as the target's return exceeds the cost of debt, borrowing increases the return on equity. But it also works **in reverse**: if trading falls, the debt is still due and can push the company into difficulty.

The fund (90%) receives £90m for £36m invested, the managers (10%) £10m for £4m, before any ratchet.

```scene
vue LBO
note NEWCO "Remaining debt: £30m"
note CIBLE "Value: £130m"
```
## 7. Summary: the four levers
| Lever | Mechanism |
|---|---|
| **Financial** | debt magnifies the return on equity (and the risk) |
| **Legal** | the holding structure controls 100% of the target with a limited outlay |
| **Tax** | group relief (75% or more) sets interest against the target's profits |
| **Managerial** | managers become shareholders and share in the success |

Click on an entity to review its analysis: control, chain, economic interest.

```scene
vue LBO
selection CIBLE
```