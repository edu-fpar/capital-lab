---
droit: us
---
# Majority rule and supermajority provisions
> In a Delaware corporation, the majority decides almost everything. A large minority has no veto… unless the charter gives it one.

Stockholders of a Delaware corporation elect the **board of directors** and vote on the most important corporate changes: charter amendments, mergers, sale of all or substantially all assets, dissolution. The default rule is simple: the **majority** wins.

## 1. Two stockholders
Gamma Inc. has two stockholders: **Mary (60%)** and **Paul (40%)**.

Mary holds a majority of the voting power. With straight voting (the default: no cumulative voting unless the charter provides for it), she elects **every** director: she **controls** Gamma.

```scene
personne MARY "Mary"
personne PAUL "Paul"
societe GAMMA "Gamma Inc."
lien MARY -> GAMMA 60%
lien PAUL -> GAMMA 40%
focus GAMMA
```
## Question: can Mary amend Gamma's certificate of incorporation without Paul?
Gamma's charter contains no special voting provision. Mary holds 60% of the votes, Paul 40%.

- [x] Yes: a majority of the outstanding stock is enough
  The board adopts the amendment (Mary elected it), then a majority of the outstanding voting stock approves it: 60% > 50%.
- [ ] No: a two-thirds supermajority is required
  That is the French or British reflex. Delaware sets no two-thirds rule; a supermajority exists only if the charter requires it.
- [ ] No: Paul's 40% is a blocking minority
  Delaware law has no statutory blocking minority.
- [ ] No: unanimity is required
  Unanimity is never the default for a charter amendment.

### Answer
Under **DGCL §242(b)**, a charter amendment is first adopted by the **board**, then approved by a **majority of the outstanding stock** entitled to vote. Mergers follow the same pattern (**DGCL §251**). Mary, with 60%, decides alone; Paul has **no veto**.

> ⚠️ Some amendments also require a separate **class vote** (for example when they adversely change the rights of a class), and recent amendments to §242 relaxed the vote needed for a few changes in listed companies. The principle remains: majority of the outstanding stock.

```scene
note MARY "Majority: elects the board, amends the charter"
note PAUL "40%: no statutory veto"
focus MARY PAUL
```
## 3. A supermajority clause in the charter
When the company was formed, Paul negotiated a clause: amending the charter requires **two-thirds** of the outstanding stock. Delaware allows the charter to require a **greater vote** than the statute (**DGCL §102(b)(4)**), and such a clause can itself be changed only by that greater vote (**DGCL §242(b)(4)**).

Now Paul's 40% blocks any amendment… because the **contract** says so, not the statute.

Then Paul sells 7% to Mary. Mary reaches **67%** (two-thirds or more): she can amend the charter alone again. Paul, at **33%**, loses his veto.

> 💡 A few shares can tip the balance: blocks close to a threshold often change hands with a **control premium**.

```scene
lien MARY -> GAMMA 67%
lien PAUL -> GAMMA 33%
focus MARY PAUL
note GAMMA "Charter: 2/3 required to amend"
```
## 4. The 50/50 trap
What if Mary and Paul each held **50%**? Neither has *more than* 50%: **nobody controls**. Each can block the other: a **deadlock**.

If the stockholders are so divided that they cannot elect directors, the Court of Chancery may appoint a **custodian** (**DGCL §226**). Stockholders usually prevent this with a **stockholders' agreement**: tie-breaking director, buy-sell ("shotgun") clause, mediation…

```scene
lien MARY -> GAMMA 50%
lien PAUL -> GAMMA 50%
focus GAMMA
note GAMMA "50/50: nobody controls"
```
## 5. The thresholds to know
| Threshold | Main effect (listed Delaware corporation) |
|---|---|
| more than 5% | Schedule 13D or 13G disclosure (Exchange Act §13(d)) |
| 10% | Section 16 insider: reporting, short-swing profit rule |
| 15% | **interested stockholder** (DGCL §203): business combinations restricted for 3 years |
| more than 50% | majority of the voting power: elects the board, approves charter amendments and mergers — **control** |
| set by the charter | **supermajority** (e.g. two-thirds), only if the charter or bylaws require it |
| 90% | **short-form merger** without a stockholder vote (DGCL §253) |

The canvas **legend** uses these colors.

> ⚠️ §253 is available to a parent **corporation** (or other entity) holding at least 90% of each class; an individual like Mary would first hold her shares through a company.

```scene
lien MARY -> GAMMA 92%
lien PAUL -> GAMMA 8%
note GAMMA "90% or more: short-form merger possible"
```