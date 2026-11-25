---
droit: uk
---
# Funding rounds and dilution
> How founders lose their majority, round after round, and the pre-emption right that could have protected them.

## 1. Incorporation
The two founders, **Priya** and **Tom**, each hold 50% of **Kestrel Ltd**. Beware: at 50/50, neither controls alone!

```scene
personne ANA "Priya"
personne HUGO "Tom"
societe KIWI "Kestrel Ltd"
lien ANA -> KIWI 50%
lien HUGO -> KIWI 50%
focus KIWI
```
## 2. A founders' agreement
Priya and Tom sign a shareholders' agreement: they will always vote together. They **jointly control** Kestrel.

```scene
concert FDR "Founders' agreement" ANA HUGO
focus KIWI
```
## Question: at the seed round, what right did Priya and Tom have by default?
A business angel subscribes for **new shares** and receives **20%** of the enlarged capital. The founders are **diluted**: 50% × 0.8 = 40% each. Together: 80%.

```scene
personne ANGEL "Business angel"
lien ANA -> KIWI 40%
lien HUGO -> KIWI 40%
lien ANGEL -> KIWI 20%
focus ANGEL
```
- [x] To subscribe first for the new shares, in proportion to their holdings
  Statutory pre-emption right (Companies Act 2006, s. 561).
- [ ] To veto any new shareholder
  No such statutory right on an issue of shares; a shareholders' agreement may provide one.
- [ ] None: directors issue shares as they please
  Directors need authority to allot (ss. 550–551), and pre-emption applies.

### Answer
New ordinary shares allotted **for cash** must first be offered to the existing shareholders **pro rata** (s. 561). Priya and Tom could have kept 50% each… by paying for it.

They chose to let the angel in: pre-emption was **disapplied** by special resolution (ss. 570–571), or **excluded** by the articles, which a private company may do (s. 567). With 100% of the votes, the founders passed it easily.

## 4. Series A: 25%
A venture capital fund subscribes for **25%** of the capital after the round. Everyone else is diluted by a quarter: founders 30% each (60% together), angel 15%.

The founders keep control (60%), but no longer reach 75%: the next disapplication of pre-emption will need other votes.

```scene
fonds VCA "Series A fund"
lien ANA -> KIWI 30%
lien HUGO -> KIWI 30%
lien ANGEL -> KIWI 15%
lien VCA -> KIWI 25%
focus VCA
```
## Question: after the Series B round, who controls Kestrel?
A growth fund takes **30%**. Founders: 21% each (**42%** together), angel 10.5%, Series A 17.5%.

```scene
fonds VCB "Growth fund (Series B)"
lien ANA -> KIWI 21%
lien HUGO -> KIWI 21%
lien ANGEL -> KIWI 10.5%
lien VCA -> KIWI 17.5%
lien VCB -> KIWI 30%
focus KIWI
```
- [ ] The founders: with 42% they are the largest block
  The largest block is not a majority: 42% < 50%.
- [ ] The growth fund: it is the largest single shareholder
  30% is far from control.
- [x] Nobody
  No block holds more than 50% of the votes.

### Answer
The founders' agreement no longer suffices: **nobody controls Kestrel**. The founders remain the largest block, but must negotiate.

Yet they keep a **blocking minority**: 42% is more than 25%, so no special resolution (amending the articles, disapplying pre-emption for the next round…) can pass without them. The growth fund, with 30%, has one too.

```scene
note KIWI "Founders: 42%, no control, but blocking minority"
```
## 6. Keeping power despite dilution
Usual solutions, since a private company's articles are very flexible:
- a **class of founder shares** with weighted votes;
- contractual vetoes in the shareholders' agreement;
- **widening the agreement**: the angel joins the concert (42% + 10.5% = **52.5%**): control again, but still well below 75%.

```scene
concert FDR "Founders + angel agreement" ANA HUGO ANGEL
focus KIWI
```