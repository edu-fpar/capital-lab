---
droit: us
---
# Equity ≠ votes: dual-class stock
> How a founder can own 15% of a listed company… and control it.

By default, **one share = one vote**. But a Delaware corporation may issue classes of stock with **different voting powers**, including non-voting stock (**DGCL §151(a)**). The canvas then shows two numbers on each link: equity (capital) and votes.

## 1. A one-share-one-vote company
**Nova Inc.** is listed on Nasdaq. Its founder, **Jane**, owns **15%** of the shares; the public owns the other 85%. One share = one vote: Jane is a large minority stockholder, nothing more.

```scene
personne JANE "Jane, founder"
public PUB "Public stockholders"
societe NOVA "Nova Inc. (Nasdaq-listed)"
lien JANE -> NOVA 15%
lien PUB -> NOVA 85%
focus NOVA
```
## 2. The dual-class structure
Now suppose Nova went public with **two classes** of common stock:
- **Class A**, sold to the public: **1 vote** per share;
- **Class B**, kept by the founder: **10 votes** per share.

Jane's 15 shares (out of 100) are Class B: **150 votes**. The public's 85 Class A shares carry 85 votes. Total: 235 votes.

- Jane: 150 / 235 = **63.8%** of the votes → **control**!
- Public: 85 / 235 = 36.2%

Several well-known US technology companies went public with this kind of structure.

```scene
lien JANE -> NOVA capital=15% votes=63.83%
lien PUB -> NOVA capital=85% votes=36.17%
focus JANE
note JANE "15% of the equity, 63.8% of the votes"
```
## 3. An activist fund buys in
An activist fund buys **10%** of the shares on the market. These are Class A shares: 1 vote each.

Votes: Jane 150, fund 10, public 75 → total 235. Jane keeps **63.8%** of the votes; the fund has only **4.3%** of the votes for 10% of the equity.

```scene
fonds ACT "Activist fund"
lien ACT -> NOVA capital=10% votes=4.26%
lien PUB -> NOVA capital=75% votes=31.91%
focus ACT
```
## Question: Jane sells 5% to the fund. Who controls Nova now?
Nova's charter, like many dual-class charters, provides that a Class B share **automatically converts** into a Class A share when it is transferred outside the founder's circle.

- [x] Jane, still
  She keeps 10 Class B shares = 100 votes out of 190: 52.6%.
- [ ] Nobody: Jane now holds only 10% of the equity
  Control is measured in votes, not in equity.
- [ ] The activist fund, which now owns more shares than Jane
  The fund owns 15% of the equity, but its shares carry 1 vote each: 7.9% of the votes.

### Answer
The 5 shares sold **lose their extra votes**: they become Class A. Votes: Jane 10 × 10 = 100, fund 15, public 75 → total 190.

- Jane: 100 / 190 = **52.6%** → still in control, with **10%** of the equity;
- fund: 15 / 190 = 7.9%; public: 75 / 190 = 39.5%.

Conversion-on-transfer clauses keep the super-voting stock in the founder's hands; many charters add a **sunset** (conversion of all Class B after a number of years, or when the founder's stake falls below a floor).

```scene
lien JANE -> NOVA capital=10% votes=52.63%
lien ACT -> NOVA capital=15% votes=7.89%
lien PUB -> NOVA capital=75% votes=39.47%
vue JANE
focus JANE NOVA
```
## 6. Key points
- **Control** is measured in **votes**, **economic interest** in **equity**.
- Delaware allows classes with different voting rights, and non-voting stock (§151(a)); the details are in the **charter**.
- A listed company in which one person or group holds more than 50% of the voting power is a **"controlled company"**: NYSE and Nasdaq exempt it from some board independence requirements.
- In free mode, click a link to set equity and votes separately.

> ⚠️ Stock exchange rules generally allow dual-class stock at the IPO but restrict measures that reduce the voting rights of existing stockholders afterwards. Index providers and institutional investors also have their own policies.

```scene
vue aucune
selection NOVA
```