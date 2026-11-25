---
droit: us
---
# Treasury stock and circular holdings
> When a corporation "owns itself"… and its largest stockholder benefits.

## 1. Alpha and its founding family
The Reed family owns **46%** of Alpha Corp.; the rest is widely held by the public. Nobody has more than 50% of the votes: Alpha is **not controlled**.

```scene
personne REED "Reed family"
societe ALPHA "Alpha Corp."
lien REED -> ALPHA 46%
focus ALPHA
```
## 2. Alpha controls Beta
Alpha owns **60%** of Beta Inc.: it controls Beta.

```scene
societe BETA "Beta Inc."
lien ALPHA -> BETA 60%
focus BETA
```
## Question: Beta owns 10% of Alpha. Who controls Alpha now?
Beta acquired **10%** of Alpha's stock (for example a stake it held before Alpha took control of it). The Reed family has not bought a single share.

```scene
lien BETA -> ALPHA 10%
focus REED ALPHA
```
- [ ] Nobody: the Reed family still has only 46%
  46% of the shares, yes, but not 46% of the votes that count.
- [x] The Reed family
  Beta's shares are not voted: only 90% of the votes remain, and 46 / 90 = 51.1%.
- [ ] Alpha's management, through Beta's 10%
  This is precisely what the law prevents: those shares cannot be voted.

### Answer
Beta is majority-owned by Alpha. Under **DGCL §160(c)**, shares of a corporation's own stock held by **another corporation a majority of whose voting shares it holds** are neither voted nor counted for quorum purposes. Otherwise Alpha's directors would vote… for themselves, with the company's money.

Mechanical consequence: only 90% of the votes can be cast. The Reed family now weighs 46 / 90 = **51.1%** of the votes: it **gains control** without buying a single share.

```scene
note ALPHA "10% of the votes neutralized"
focus REED ALPHA
```
## 4. Treasury stock
Alpha also buys back **5%** of its own shares (a buyback program). Shares held in the treasury are **not voted** either (DGCL §160(c)).

Only 85% of the votes remain: the family weighs 46 / 85 = **54.1%**.

```scene
lien ALPHA -> ALPHA 5%
focus ALPHA
note ALPHA "Treasury 5% + subsidiary-held 10%"
```
## 5. Safeguards
- Treasury stock and shares held by a majority-owned subsidiary are **not voted** and do not count for the quorum (**DGCL §160(c)**).
- A corporation may not repurchase its shares when its capital is impaired or would become impaired (**DGCL §160(a)**).
- Unlike French or EU law, Delaware sets **no fixed percentage cap** on buybacks; listed companies usually follow the SEC's **Rule 10b-18** safe harbor (volume, timing, price).

> 💡 A buyback mechanically **increases** the voting percentage of every other stockholder: a large holder can cross a threshold (control, 15%, 10%, 5%) without buying anything.

> 💡 On the canvas, the neutralized links appear as **gray dotted lines**: their votes are excluded and the other percentages are recalculated ("effective" votes).

```scene
vue REED
selection ALPHA
```