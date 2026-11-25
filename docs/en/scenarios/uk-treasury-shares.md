---
droit: uk
---
# Cross-holdings and treasury shares
> When a company would end up voting for itself… and a family benefits.

## 1. Corran and its founding family
The Ashworth family holds **46%** of Corran plc; the rest is widely held by the public. Nobody has more than 50%: Corran is **not controlled**.

UK company law has no presumption of control below 50%. The 46% matters elsewhere: above 30%, the family is in the zone watched by the **Takeover Code** (Rule 9).

```scene
personne ROUX "Ashworth family"
societe ALPHA "Corran plc"
lien ROUX -> ALPHA 46%
focus ALPHA
```
## 2. Corran controls Bexmoor
Corran holds **60%** of Bexmoor Ltd: Bexmoor is its **subsidiary** (s. 1159).

```scene
societe BETA "Bexmoor Ltd"
lien ALPHA -> BETA 60%
focus BETA
```
## Question: Bexmoor holds 10% of Corran. Who controls Corran now?
Bexmoor bought **10%** of Corran's shares years ago, before Corran took control of it.

```scene
lien BETA -> ALPHA 10%
focus ROUX ALPHA BETA
```
- [ ] Nobody: the family still has only 46%
  46% of the shares, yes, but not 46% of the votes that can actually be cast.
- [x] The Ashworth family
  Bexmoor's votes are neutralised: 46 / 90 = 51.1% of the votes.
- [ ] Corran itself, through Bexmoor
  This is exactly what the law prevents: Bexmoor cannot vote Corran's shares.
- [ ] Bexmoor, with 10%
  10% would not be enough, and those shares carry no votes anyway.

### Answer
A subsidiary **cannot be a member of its holding company** (Companies Act 2006, s. 136). In the limited cases where it may keep shares acquired earlier, it **cannot vote** them. Otherwise Corran's directors would vote… for themselves, with the company's money.

Mechanical consequence: only 90% of the votes can be cast. The Ashworth family now weighs 46 / 90 = **51.1%** of the votes: it **takes control** without buying a single share!

> ⚠️ Simplification: the exceptions (shares acquired before the company became a subsidiary, shares held as trustee or market intermediary) are narrow; check ss. 136 to 141.

```scene
note ALPHA "10% of the votes neutralised"
```
## 4. Treasury shares
Corran also buys back **5%** of its own shares on the market (a market purchase authorised by ordinary resolution, s. 701) and keeps them **in treasury** (s. 724). Treasury shares carry **no votes** and receive no dividends (s. 726).

Only 85% of the votes remain: the family weighs 46 / 85 = **54.1%**.

> 💡 Takeover Code, Rule 37.1: an increase in a shareholder's percentage of votes caused by a **buyback** is treated as an acquisition for Rule 9. Without Bexmoor's stake, this buyback alone would lift the family from 46% to 48.4% (46 / 95): already between 30% and 50%, it would have to make a mandatory offer, unless independent shareholders approve a **waiver** ("whitewash").

```scene
lien ALPHA -> ALPHA 5%
focus ALPHA
note ALPHA "Treasury 5% + subsidiary-held 10%"
```
## 5. The safeguards
- A subsidiary cannot become a member of its holding company (s. 136).
- A buyback must be financed out of **distributable profits** or a fresh issue (s. 692); only a private company may use capital (s. 709).
- Treasury shares carry **no voting rights** and no dividend (s. 726).

> 💡 On the canvas, these links appear as **grey dashed lines**: their votes are neutralised and the other percentages are recalculated ("effective" votes).

```scene
vue ROUX
selection ALPHA
```