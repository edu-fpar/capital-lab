---
droit: uk
---
# Majorities and blocking minorities
> 50%, 25%, 75%: why a few thresholds decide who runs a UK company.

Shareholders decide by **ordinary resolution** (a simple majority, Companies Act 2006, s. 282) or by **special resolution** (at least 75%, s. 283). These two thresholds draw the map of power.

## 1. Two shareholders
Grayson Ltd has two shareholders: **Mary (60%)** and **Paul (40%)**.

Mary has the majority: she passes ordinary resolutions alone, so she can appoint and remove the directors (s. 168) and, through them, run the company.

```scene
personne MARIE "Mary"
personne PAUL "Paul"
societe GAMMA "Grayson Ltd"
lien MARIE -> GAMMA 60%
lien PAUL -> GAMMA 40%
focus GAMMA
```
## Question: can Mary amend the articles of Grayson Ltd on her own?
Mary holds 60% of the votes and Paul 40%. Both take part in the vote.

- [ ] Yes: with 60% she has the majority
  A simple majority is enough for an **ordinary** resolution, not to amend the articles.
- [x] No: amending the articles needs a special resolution, 75% of the votes
  60% < 75%: without Paul, the resolution fails (ss. 21 and 283).
- [ ] No: it needs unanimity
  Unanimity is not the default rule. It is needed only if the articles entrench the provision (s. 22) or for a written resolution of all members on some matters.

### Answer
To **amend the articles** (s. 21), **reduce the share capital** (s. 641) or **disapply pre-emption rights** (ss. 570–571), a **special resolution** is needed: a majority of **not less than 75%** (s. 283). With 60%, Mary can change nothing without Paul.

Paul holds more than 25% of the votes: he has a **blocking minority**. He is also a **person with significant control** of Grayson Ltd (more than 25%).

> ⚠️ At a meeting, the 75% is counted on the votes cast; for a written resolution of a private company, on the total voting rights of eligible members. The tool assumes everyone votes.

```scene
note PAUL "More than 25%: can block any special resolution"
note MARIE "Majority: passes ordinary resolutions"
focus PAUL
```
## 3. Paul sells 15%
Paul sells 15% to Mary. Mary reaches exactly **75%**: "not less than 75%" is enough, she now passes special resolutions alone. Paul falls to **25%**… which is not *more than* 25%: he **loses** his blocking minority.

> 💡 A handful of shares can tip the balance: blocks close to a threshold often change hands at a **control premium**.

```scene
lien MARIE -> GAMMA 75%
lien PAUL -> GAMMA 25%
focus MARIE PAUL
```
## 4. The 50/50 trap
What if Mary and Paul each held **50%**? Neither has *more than* 50%: **neither controls**. Each can block the other: this is **deadlock**.

Joint venturers therefore sign a **shareholders' agreement** with deadlock provisions: escalation to mediation, a chair's casting vote at board level, put and call options, a "Russian roulette" or "Texas shoot-out" clause… As a last resort, a shareholder may petition the court for **unfair prejudice** (s. 994) or for a **just and equitable winding-up** (Insolvency Act 1986, s. 122(1)(g)).

```scene
lien MARIE -> GAMMA 50%
lien PAUL -> GAMMA 50%
focus GAMMA
note GAMMA "50/50: nobody controls"
```
## 5. Thresholds to remember
| Threshold | Main effect |
|---|---|
| 3%, then each 1% | Listed companies: notification of major holdings of voting rights (DTR 5) |
| 5% | Members can require the directors to call a general meeting (s. 303) |
| more than 25% | Blocking minority on special resolutions; person with significant control (Part 21A) |
| 30% | Mandatory offer for companies subject to the Takeover Code (Rule 9) |
| more than 50% | Ordinary resolutions; control, subsidiary (s. 1159) |
| 75% | Special resolutions (s. 283) |
| 90% | Squeeze-out of the minority after a takeover offer (s. 979) |

The canvas **legend** uses the same colours.

> ⚠️ The 90% of s. 979 is counted on the shares to which the offer relates (excluding those the bidder already held), not on the whole capital.

```scene
lien MARIE -> GAMMA 92%
lien PAUL -> GAMMA 8%
note GAMMA "90% or more: squeeze-out possible after a takeover offer"
```