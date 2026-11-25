---
droit: us
---
# Venture rounds and dilution
> How founders lose their majority, round after round.

> ⚠️ Simplified: preferred stock is assumed to vote with the common stock on an as-converted basis (the usual rule), options carry **no vote** until exercised, and SAFEs, liquidation preferences and anti-dilution clauses are left aside.

## 1. Incorporation
The two founders, **Ana** and **Hugo**, form **Kiwi Labs Inc.**, a Delaware corporation, 50/50. Watch out: at 50/50, neither controls alone!

```scene
personne ANA "Ana"
personne HUGO "Hugo"
societe KIWI "Kiwi Labs Inc."
lien ANA -> KIWI 50%
lien HUGO -> KIWI 50%
focus KIWI
```
## 2. A founders' voting agreement
Ana and Hugo sign a **voting agreement**: they will always vote their shares the same way (Delaware enforces such agreements, **DGCL §218(c)**). Together they **control** Kiwi.

```scene
concert FDR "Founders' voting agreement" ANA HUGO
focus KIWI
```
## 3. Seed round: 20%
A seed fund invests and receives **20%** of the shares, newly issued. The founders are **diluted**: 50% × 0.8 = 40% each. Together: 80%.

```scene
fonds SEED "Seed fund"
lien ANA -> KIWI 40%
lien HUGO -> KIWI 40%
lien SEED -> KIWI 20%
focus SEED
```
## Question: after the Series A, do the founders still control Kiwi?
A venture fund buys Series A preferred stock: **25%** of the fully diluted capital after the round. The investors also require an **option pool** of **10%** (post-money) for future employees, created before the round, so it dilutes only the existing holders.

Fully diluted capital: founders 26% each (52% together), seed 13%, Series A 25%, pool 10%.

```scene
fonds VCA "Series A fund"
holding POOL "Option pool (unexercised)"
lien ANA -> KIWI capital=26% votes=28.89%
lien HUGO -> KIWI capital=26% votes=28.89%
lien SEED -> KIWI capital=13% votes=14.44%
lien VCA -> KIWI capital=25% votes=27.78%
lien POOL -> KIWI capital=10% votes=0%
focus KIWI
```
- [x] Yes, through their voting agreement
  Options do not vote: the founders hold 52 of the 90 outstanding votes, 57.8%.
- [ ] Barely: exactly 52%
  52% is their fully diluted share; their share of the votes is higher, because the pool does not vote.
- [ ] No: the Series A fund holds preferred stock, which controls the company
  Preferred stock votes alongside the common, as if converted: 25 of 90 votes, 27.8%.

### Answer
The unexercised options are not **outstanding shares**: they carry no vote. Only 90% of the fully diluted capital votes:
- founders: 26 / 90 = **28.9%** each, **57.8%** together → still in control;
- seed: 14.4%; Series A: 27.8%.

> 💡 In practice the Series A investor also obtains **protective provisions** (a veto on certain decisions voted by the preferred as a class) and a **board seat**: control of the vote is not the whole story.

```scene
focus ANA HUGO
note KIWI "Founders: 52% of capital, 57.8% of votes"
```
## 5. Series B: 30%
New round: a growth fund buys **30%**. Everyone else is diluted by 30%: founders 18.2% each (**36.4%** together), seed 9.1%, Series A 17.5%, pool 7%.

Votes (93 outstanding): founders **19.6%** each, **39.1%** together; seed 9.8%; Series A 18.8%; Series B 32.3%.

The founders' agreement is no longer enough: **nobody controls Kiwi**. The founders remain the largest bloc, but must deal with the investors.

```scene
fonds VCB "Series B fund"
lien ANA -> KIWI capital=18.2% votes=19.57%
lien HUGO -> KIWI capital=18.2% votes=19.57%
lien SEED -> KIWI capital=9.1% votes=9.78%
lien VCA -> KIWI capital=17.5% votes=18.82%
lien VCB -> KIWI capital=30% votes=32.26%
lien POOL -> KIWI capital=7% votes=0%
focus KIWI
note KIWI "Founders: 39.1% of the votes, no control"
```
## 6. Who controls the board?
In US venture deals, the answer is usually written in a **voting agreement** signed by the founders and the main investors: each party agrees to vote for directors designated by the others (for example two founder seats, one per lead investor, one independent).

If the founders, the seed fund and the Series A fund sign it, the group gathers 39.1% + 9.8% + 18.8% = **67.7%** of the votes. The founders keep their seats, but share control.

```scene
concert FDR "Voting agreement (founders + seed + Series A)" ANA HUGO SEED VCA
focus KIWI
```