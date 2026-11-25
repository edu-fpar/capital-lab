/* ============================================================
 * Built-in scenario library: United Kingdom (English law, in English).
 * Contract: docs/i18n-spec.md, section 5.
 * (Command blocks use ~~~scene instead of three backticks so that the
 *  markdown can live inside JS template strings.)
 * ============================================================ */
window.P = window.P || {};
P.LIBRARY = P.LIBRARY || [];
P.LIBRARY.push(

{ id: 'uk-pyramid', lang: 'en', droit: 'uk', md: `---
droit: uk
---
# The holding pyramid
> How a family controls a large listed company while owning only a small slice of its capital.

We build a **cascade of holding companies**, one tier at a time. At each tier the family keeps the majority… but its **economic interest** shrinks.

Watch the colours: a **tinted** entity is controlled by the shareholder of the same colour.

## 1. The family sets up a holding company
The Hartley family transfers its shares to a holding company, **Hartley Holdings Ltd**, in which it holds **51%**. The other 49% belong to outside investors (not shown: they appear as "others").

With more than 50% of the voting rights, the family passes **ordinary resolutions** on its own (Companies Act 2006, s. 282) and can appoint and remove the directors (s. 168): it **controls** Hartley Holdings.

> ⚠️ Strictly, s. 1159 defines when a *company* is the subsidiary of another *company*. A family is not a company, but the test the tool applies is the same: a majority of the voting rights.

~~~scene
personne FAM "Hartley family"
holding H1 "Hartley Holdings Ltd"
lien FAM -> H1 51%
focus H1
~~~

## 2. A second tier
Hartley Holdings takes **51%** of a second holding company, **Hartley Industries Ltd**.

- The family holds no shares in Hartley Industries *directly*.
- But it controls Hartley Holdings, which controls Hartley Industries: control **passes down the chain** (a subsidiary of a subsidiary is itself a subsidiary, s. 1159(1)).
- Its **economic interest** (its share of the dividends) is only 51% × 51% ≈ **26%**.

**Perspective** mode (👁) shows the family's interest and control on every entity.

~~~scene
holding H2 "Hartley Industries Ltd"
lien H1 -> H2 51%
vue FAM
focus H2
~~~

## 3. The listed company
Hartley Industries holds **51%** of **Albion plc**, a large company listed on the London Stock Exchange.

The family controls Albion plc with an economic interest of 51% × 51% × 51% ≈ **13.3%**. The remaining 86.7% belongs to other investors… who have no say.

~~~scene
societe ALPHA "Albion plc (listed)"
lien H2 -> ALPHA 51%
focus ALPHA
note ALPHA "Controlled with about 13% of the economic interest"
~~~

## 4. One more tier
Albion plc takes 51% of **Beacon Ltd**. The family now controls Beacon with an interest of only **6.8%**.

> 💡 Each tier roughly halves the economic interest without ever diluting power: this is the **multiplier effect** of the pyramid.

~~~scene
societe BETA "Beacon Ltd"
lien ALPHA -> BETA 51%
focus BETA
~~~

## Question: what power does Thornbury Capital have in Albion plc?
The **Thornbury Capital** fund holds the other 49% of Hartley Holdings: it finances the pyramid almost as much as the family does.

~~~scene
fonds DELTA "Thornbury Capital"
lien DELTA -> H1 49%
vue aucune
focus DELTA ALPHA
~~~

- [ ] 49% of the votes in Albion plc
  Its 49% is in Hartley Holdings, not in Albion plc.
- [ ] About 12.7% of the votes, like its economic interest
  49% × 51% × 51% ≈ 12.7% measures its share of Albion's profits, not its votes.
- [x] None: it does not vote at Albion's general meetings
  Its votes only count at Hartley Holdings' general meetings, where the family has the majority.
- [ ] A blocking minority
  It has one in Hartley Holdings (49% is more than 25%, so it can defeat special resolutions there), but not in Albion plc.

### Answer
The fund has an **economic interest** of about **12.7%** in Albion plc (almost as much as the family's 13.3%) but **no votes**: it only votes at Hartley Holdings, where it is in the minority.

This is the paradox of the pyramid: you can **finance without deciding**. The fund's perspective is now shown on the canvas.

~~~scene
vue DELTA
focus DELTA ALPHA
~~~

## 6. Summary
| Company | Family's interest | Control |
|---|---|---|
| Hartley Holdings Ltd | 51% | ✔ |
| Hartley Industries Ltd | 26% | ✔ |
| Albion plc | 13.3% | ✔ |
| Beacon Ltd | 6.8% | ✔ |

Key points:
- **control percentage** ≠ **interest percentage**;
- control passes down the chain (s. 1159), interest is **multiplied**;
- transparency: individuals with more than 25% of the shares or votes, held directly or **indirectly**, must appear on the company's register of **persons with significant control** (Companies Act 2006, Part 21A);
- markets often apply a **holding company discount** to the companies at the top.

Click on an entity to see its detailed analysis.

~~~scene
vue FAM
selection BETA
~~~
` },

{ id: 'uk-majorities', lang: 'en', droit: 'uk', md: `---
droit: uk
---
# Majorities and blocking minorities
> 50%, 25%, 75%: why a few thresholds decide who runs a UK company.

Shareholders decide by **ordinary resolution** (a simple majority, Companies Act 2006, s. 282) or by **special resolution** (at least 75%, s. 283). These two thresholds draw the map of power.

## 1. Two shareholders
Grayson Ltd has two shareholders: **Mary (60%)** and **Paul (40%)**.

Mary has the majority: she passes ordinary resolutions alone, so she can appoint and remove the directors (s. 168) and, through them, run the company.

~~~scene
personne MARIE "Mary"
personne PAUL "Paul"
societe GAMMA "Grayson Ltd"
lien MARIE -> GAMMA 60%
lien PAUL -> GAMMA 40%
focus GAMMA
~~~

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

~~~scene
note PAUL "More than 25%: can block any special resolution"
note MARIE "Majority: passes ordinary resolutions"
focus PAUL
~~~

## 3. Paul sells 15%
Paul sells 15% to Mary. Mary reaches exactly **75%**: "not less than 75%" is enough, she now passes special resolutions alone. Paul falls to **25%**… which is not *more than* 25%: he **loses** his blocking minority.

> 💡 A handful of shares can tip the balance: blocks close to a threshold often change hands at a **control premium**.

~~~scene
lien MARIE -> GAMMA 75%
lien PAUL -> GAMMA 25%
focus MARIE PAUL
~~~

## 4. The 50/50 trap
What if Mary and Paul each held **50%**? Neither has *more than* 50%: **neither controls**. Each can block the other: this is **deadlock**.

Joint venturers therefore sign a **shareholders' agreement** with deadlock provisions: escalation to mediation, a chair's casting vote at board level, put and call options, a "Russian roulette" or "Texas shoot-out" clause… As a last resort, a shareholder may petition the court for **unfair prejudice** (s. 994) or for a **just and equitable winding-up** (Insolvency Act 1986, s. 122(1)(g)).

~~~scene
lien MARIE -> GAMMA 50%
lien PAUL -> GAMMA 50%
focus GAMMA
note GAMMA "50/50: nobody controls"
~~~

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

~~~scene
lien MARIE -> GAMMA 92%
lien PAUL -> GAMMA 8%
note GAMMA "90% or more: squeeze-out possible after a takeover offer"
~~~
` },

{ id: 'uk-voting-rights', lang: 'en', droit: 'uk', md: `---
droit: uk
---
# Capital ≠ power: weighted votes and non-voting shares
> How to hold 35% of the capital… and more than 50% of the votes.

By default, on a poll, **each share carries one vote** (Companies Act 2006, s. 284). But the articles may create **classes of shares** with different rights. The canvas then shows two figures on each link: capital and **votes**.

## 1. A listed company, one share one vote
**Dunmore plc** is listed. Its founder, **Jack**, holds **35%** of the capital; the remaining 65% is held by the public. With one share, one vote, Jack is a minority shareholder.

~~~scene
personne JEAN "Jack, founder"
public PUB "Public shareholders"
societe DELTA "Dunmore plc (listed)"
lien JEAN -> DELTA 35%
lien PUB -> DELTA 65%
focus DELTA
~~~

## 2. Founder shares with weighted votes
In fact, Dunmore's articles create two classes: **A shares**, held by the public, with one vote each, and **B shares**, held only by Jack, with **two votes** each.

Jack's 35 shares carry **70 votes**; the public keeps 65 votes. Total: 135 votes.

- Jack: 70 / 135 = **51.9%** of the votes → **control**!
- Public: 65 / 135 = 48.1%

UK law grants no automatic extra vote to long-term holders: weighted votes come only from the **articles**. Changing the rights attached to the B shares is a **variation of class rights**, which needs the consent of that class (s. 630).

> ⚠️ Simplification: dual-class structures were long excluded from the premium segment of the London market. The 2021 and 2024 listing reforms now accept enhanced voting rights for founders, subject to conditions (duration, transfer, size of the multiple): check the current UK Listing Rules.

~~~scene
lien JEAN -> DELTA 35% votes 51.85%
lien PUB -> DELTA 65% votes 48.15%
focus JEAN
note JEAN "35% of the capital, 51.9% of the votes"
~~~

## 3. An activist fund buys in
An activist fund buys **10%** of the capital from the public: A shares, one vote each.

Votes: Jack 70, fund 10, public 55 → total 135. Jack keeps **51.9%** of the votes; the fund has only **7.4%** of the votes for 10% of the capital. Above 3% of the voting rights, it must disclose its holding (DTR 5).

~~~scene
fonds ACT "Activist fund"
lien ACT -> DELTA 10% votes 7.41%
lien PUB -> DELTA 55% votes 40.74%
focus ACT
~~~

## Question: who controls Nova Ltd?
Another tool: **non-voting preference shares**, which typically give a priority dividend instead of votes.

In the start-up **Nova Ltd**, the founder **Leah** holds 40% of the capital in ordinary shares. A venture capital fund holds 60% of the capital, of which 50 points are **non-voting** preference shares and 10 points ordinary shares.

Votes: Leah 40, fund 10 → 50 votes in total.

~~~scene
personne LEA "Leah, founder"
fonds VC "Venture capital fund"
societe NOVA "Nova Ltd"
lien LEA -> NOVA 40% votes 80%
lien VC -> NOVA 60% votes 20%
focus NOVA
~~~

- [ ] The venture capital fund: it holds 60% of the capital
  Capital measures the economic interest, not power.
- [x] Leah: she holds 80% of the votes
  40 votes out of 50: she passes ordinary resolutions, and even special resolutions (80% ≥ 75%).
- [ ] Nobody: capital and votes point in different directions
  Control follows the votes alone.

### Answer
Control is measured in **voting rights**: a majority of the voting rights is the first test of a subsidiary (s. 1159), and the Takeover Code and DTR 5 also count votes, not capital. Leah controls Nova Ltd with **80% of the votes** and 40% of the capital.

The fund protects itself by contract: in the **shareholders' agreement** it typically obtains vetoes ("investor consents") over new issues, sale of the company, budget…

> ⚠️ Stylised example: in UK venture deals, investors' preference shares usually carry votes. Non-voting shares are more common in family companies.

~~~scene
vue LEA
note NOVA "40% of the capital, 80% of the votes"
~~~

## 5. Key points
- **Control** is measured in **votes**, **economic interest** in **capital**.
- Tools that separate them: classes with weighted votes, non-voting shares, and contractual vetoes in a shareholders' agreement.
- In free mode, click on a link to set capital and votes separately.

~~~scene
vue aucune
~~~
` },

{ id: 'uk-treasury-shares', lang: 'en', droit: 'uk', md: `---
droit: uk
---
# Cross-holdings and treasury shares
> When a company would end up voting for itself… and a family benefits.

## 1. Corran and its founding family
The Ashworth family holds **46%** of Corran plc; the rest is widely held by the public. Nobody has more than 50%: Corran is **not controlled**.

UK company law has no presumption of control below 50%. The 46% matters elsewhere: above 30%, the family is in the zone watched by the **Takeover Code** (Rule 9).

~~~scene
personne ROUX "Ashworth family"
societe ALPHA "Corran plc"
lien ROUX -> ALPHA 46%
focus ALPHA
~~~

## 2. Corran controls Bexmoor
Corran holds **60%** of Bexmoor Ltd: Bexmoor is its **subsidiary** (s. 1159).

~~~scene
societe BETA "Bexmoor Ltd"
lien ALPHA -> BETA 60%
focus BETA
~~~

## Question: Bexmoor holds 10% of Corran. Who controls Corran now?
Bexmoor bought **10%** of Corran's shares years ago, before Corran took control of it.

~~~scene
lien BETA -> ALPHA 10%
focus ROUX ALPHA BETA
~~~

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

~~~scene
note ALPHA "10% of the votes neutralised"
~~~

## 4. Treasury shares
Corran also buys back **5%** of its own shares on the market (a market purchase authorised by ordinary resolution, s. 701) and keeps them **in treasury** (s. 724). Treasury shares carry **no votes** and receive no dividends (s. 726).

Only 85% of the votes remain: the family weighs 46 / 85 = **54.1%**.

> 💡 Takeover Code, Rule 37.1: an increase in a shareholder's percentage of votes caused by a **buyback** is treated as an acquisition for Rule 9. Without Bexmoor's stake, this buyback alone would lift the family from 46% to 48.4% (46 / 95): already between 30% and 50%, it would have to make a mandatory offer, unless independent shareholders approve a **waiver** ("whitewash").

~~~scene
lien ALPHA -> ALPHA 5%
focus ALPHA
note ALPHA "Treasury 5% + subsidiary-held 10%"
~~~

## 5. The safeguards
- A subsidiary cannot become a member of its holding company (s. 136).
- A buyback must be financed out of **distributable profits** or a fresh issue (s. 692); only a private company may use capital (s. 709).
- Treasury shares carry **no voting rights** and no dividend (s. 726).

> 💡 On the canvas, these links appear as **grey dashed lines**: their votes are neutralised and the other percentages are recalculated ("effective" votes).

~~~scene
vue ROUX
selection ALPHA
~~~
` },

{ id: 'uk-concert', lang: 'en', droit: 'uk', md: `---
droit: uk
---
# Acting in concert: the 30% mandatory bid
> Two minority shareholders who cooperate are treated as one, and 30% is the line not to cross.

## 1. A widely held company
Omega plc is listed: **Arden Investments Ltd** holds 20%, **Bexley Capital** 8%, the public 72%. No block exceeds 50%: Omega is **not controlled**.

Both holdings exceed 3% of the voting rights: they have been disclosed to the market (DTR 5).

~~~scene
holding A "Arden Investments Ltd"
fonds B "Bexley Capital"
public PUB "Public shareholders"
societe OMEGA "Omega plc (listed)"
lien A -> OMEGA 20%
lien B -> OMEGA 8%
lien PUB -> OMEGA 72%
focus OMEGA
~~~

## 2. The agreement
Arden and Bexley agree to cooperate to **obtain control** of Omega: they will vote together and coordinate their purchases. Under the Takeover Code they are **persons acting in concert** (Code, Definitions): their interests are **added together**.

Together they hold **28%**: still no control, and still below 30%.

~~~scene
concert PACTE "Omega agreement" A B
focus OMEGA
note OMEGA "Concert party: 20% + 8% = 28%"
~~~

## Question: Bexley buys another 3% on the market. What happens?
The concert party now holds 20% + 11% = **31%** of the voting rights.

~~~scene
lien B -> OMEGA 11%
lien PUB -> OMEGA 69%
focus B OMEGA
~~~

- [ ] Nothing: neither Arden nor Bexley holds 30% on its own
  Interests of persons acting in concert are aggregated.
- [ ] They now control Omega
  31% is far from a majority of the votes.
- [x] They must make a mandatory offer for all the other shares
  Crossing 30% together triggers Rule 9 of the Takeover Code.
- [ ] Bexley must sell its new shares
  The Code does not cancel the purchase: it imposes an offer.

### Answer
**Rule 9.1**: a person who, together with persons acting in concert with it, acquires an interest in shares carrying **30% or more** of the voting rights must make an offer to **all** the other shareholders. The offer must be in cash (or with a cash alternative) at **not less than the highest price** paid by the concert party in the previous 12 months (Rule 9.5), and its only condition is acceptances bringing the bidders above 50% (Rule 9.3).

> 💡 The rationale: whoever acquires effective control must give the other shareholders the chance to exit at a fair price.

~~~scene
note OMEGA "30% or more in concert: mandatory offer (Rule 9)"
~~~

## 4. After the offer
Bexley makes the offer. Acceptances bring it to **36%**; the public keeps 44%. Together, Arden (20%) and Bexley (36%) hold **56%**: they **jointly control** Omega. Neither controls it alone.

Had acceptances reached 90% of the shares the offer related to, the bidder could have **squeezed out** the rest (s. 979).

~~~scene
lien B -> OMEGA 36%
lien PUB -> OMEGA 44%
focus OMEGA
note OMEGA "Joint control: 20% + 36%"
~~~

## 5. Who is behind Arden?
Arden Investments is 70% owned by **Mrs Whitfield**. She controls Arden, and through it takes part in the joint control of Omega. She is also a **person with significant control** of Arden (Part 21A).

Her perspective shows her economic interest in Omega: 70% × 20% = **14%**.

~~~scene
personne DURAND "Mrs Whitfield"
lien DURAND -> A 70%
vue DURAND
focus A
~~~

## 6. End of the agreement
The agreement is terminated. Each party votes freely again: Omega is **no longer controlled**.

> 💡 Bexley alone still holds 36%. A holder between 30% and 50% who acquires **any** further interest triggers Rule 9 again (Rule 9.1(b)).

> ⚠️ Simplification: whether shareholders are acting in concert is a question of fact for the Takeover Panel; merely voting the same way on a resolution does not usually make them a concert party.

~~~scene
retirer PACTE
vue aucune
focus OMEGA
~~~
` },

{ id: 'uk-consolidation', lang: 'en', droit: 'uk', md: `---
droit: uk
---
# The scope of consolidation
> Full consolidation, equity method… and the difference between control and ownership interest.

A parent company prepares **group accounts** (Companies Act 2006, s. 399). Listed groups use **UK-adopted IFRS**; this scenario follows IFRS 10, IFRS 11 and IAS 28.

## 1. The parent
**Merrow plc** holds three direct investments. Depending on the degree of control, each will be treated differently in the consolidated accounts.

~~~scene
societe M "Merrow plc"
societe F1 "Subsidiary 1 Ltd"
societe F2 "Associate 2 Ltd"
societe F3 "Investment 3 Ltd"
lien M -> F1 80%
lien M -> F2 30%
lien M -> F3 8%
vue M
~~~

## 2. Control → full consolidation
With 80% of the votes, Merrow **controls** Subsidiary 1 (IFRS 10): its accounts are included **line by line, at 100%** (full consolidation). The other shareholders' 20% appears as **non-controlling interests** (NCI) in equity.

~~~scene
focus F1
note F1 "Full consolidation · NCI 20%"
~~~

## 3. Significant influence → equity method
With **20% or more** of the votes, **significant influence** is presumed (IAS 28): Associate 2 is accounted for using the **equity method** (only the group's share of its net assets and profit is recognised).

Below 20%, Investment 3 is simply a financial asset (IFRS 9), **not consolidated**.

~~~scene
focus F2 F3
note F2 "Equity method (IAS 28)"
note F3 "Financial asset (IFRS 9)"
~~~

## Question: what share of Sub-subsidiary's profit belongs to Merrow's shareholders?
Subsidiary 1 holds **60%** of **Sub-subsidiary Ltd**.

~~~scene
societe SF "Sub-subsidiary Ltd"
lien F1 -> SF 60%
focus SF
~~~

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

~~~scene
note SF "Control 60% · interest 48%"
~~~

## 5. Joint control → joint venture
Merrow and an industrial partner set up **JV Co Ltd** 50/50, with an agreement requiring **unanimous consent** for the key decisions: this is **joint control** (IFRS 11). A joint venture is accounted for using the equity method.

> ⚠️ Unlisted UK groups often apply **FRS 102** instead of IFRS (Section 9 for subsidiaries, Section 14 for associates, Section 15 for joint ventures): the concepts are close, the details differ.

~~~scene
societe PART "Industrial partner"
societe JV "JV Co Ltd"
lien M -> JV 50%
lien PART -> JV 50%
concert PACTE_JV "JV agreement" M PART
focus JV
~~~
` },

{ id: 'uk-dilution', lang: 'en', droit: 'uk', md: `---
droit: uk
---
# Funding rounds and dilution
> How founders lose their majority, round after round, and the pre-emption right that could have protected them.

## 1. Incorporation
The two founders, **Priya** and **Tom**, each hold 50% of **Kestrel Ltd**. Beware: at 50/50, neither controls alone!

~~~scene
personne ANA "Priya"
personne HUGO "Tom"
societe KIWI "Kestrel Ltd"
lien ANA -> KIWI 50%
lien HUGO -> KIWI 50%
focus KIWI
~~~

## 2. A founders' agreement
Priya and Tom sign a shareholders' agreement: they will always vote together. They **jointly control** Kestrel.

~~~scene
concert FDR "Founders' agreement" ANA HUGO
focus KIWI
~~~

## Question: at the seed round, what right did Priya and Tom have by default?
A business angel subscribes for **new shares** and receives **20%** of the enlarged capital. The founders are **diluted**: 50% × 0.8 = 40% each. Together: 80%.

~~~scene
personne ANGEL "Business angel"
lien ANA -> KIWI 40%
lien HUGO -> KIWI 40%
lien ANGEL -> KIWI 20%
focus ANGEL
~~~

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

~~~scene
fonds VCA "Series A fund"
lien ANA -> KIWI 30%
lien HUGO -> KIWI 30%
lien ANGEL -> KIWI 15%
lien VCA -> KIWI 25%
focus VCA
~~~

## Question: after the Series B round, who controls Kestrel?
A growth fund takes **30%**. Founders: 21% each (**42%** together), angel 10.5%, Series A 17.5%.

~~~scene
fonds VCB "Growth fund (Series B)"
lien ANA -> KIWI 21%
lien HUGO -> KIWI 21%
lien ANGEL -> KIWI 10.5%
lien VCA -> KIWI 17.5%
lien VCB -> KIWI 30%
focus KIWI
~~~

- [ ] The founders: with 42% they are the largest block
  The largest block is not a majority: 42% < 50%.
- [ ] The growth fund: it is the largest single shareholder
  30% is far from control.
- [x] Nobody
  No block holds more than 50% of the votes.

### Answer
The founders' agreement no longer suffices: **nobody controls Kestrel**. The founders remain the largest block, but must negotiate.

Yet they keep a **blocking minority**: 42% is more than 25%, so no special resolution (amending the articles, disapplying pre-emption for the next round…) can pass without them. The growth fund, with 30%, has one too.

~~~scene
note KIWI "Founders: 42%, no control, but blocking minority"
~~~

## 6. Keeping power despite dilution
Usual solutions, since a private company's articles are very flexible:
- a **class of founder shares** with weighted votes;
- contractual vetoes in the shareholders' agreement;
- **widening the agreement**: the angel joins the concert (42% + 10.5% = **52.5%**): control again, but still well below 75%.

~~~scene
concert FDR "Founders + angel agreement" ANA HUGO ANGEL
focus KIWI
~~~
` },

{ id: 'uk-lbo', lang: 'en', droit: 'uk', md: `---
droit: uk
---
# LBO: buying a company with leverage
> Acquisition vehicle, acquisition debt, group relief and management equity.

A **leveraged buy-out** (LBO) is the purchase of a company by an **acquisition vehicle** (BidCo) which funds the price partly with **borrowing**. The debt is then serviced with the cash the target sends up.

> ⚠️ The canvas shows **shareholdings** (capital and power). Bank debt is not a shareholding: it appears in the bubbles and the text. Amounts are simplified examples; real deals often stack several companies (TopCo, MidCo, BidCo).

## 1. The target
**Ferrowell Ltd** is 100% owned by its founder, Mr Hargreaves, who wants to sell. Agreed price: **£100m** (to keep things simple, the target has no debt).

~~~scene
personne MOREAU "Mr Hargreaves (founder)"
societe CIBLE "Ferrowell Ltd"
lien MOREAU -> CIBLE 100%
focus CIBLE
note CIBLE "Price: £100m"
~~~

## 2. The acquisition vehicle
A private equity fund sets up a new company, **BidCo Ltd**. It invests **£36m** and the management team **£4m**: £40m of equity in total.

Fund: **90%** of the capital, managers: **10%**. The fund controls BidCo.

~~~scene
fonds LBO "Northgate private equity fund"
personne MGT "Management team"
holding NEWCO "BidCo Ltd"
lien LBO -> NEWCO 90%
lien MGT -> NEWCO 10%
focus NEWCO
note NEWCO "Equity: £40m"
~~~

## 3. Acquisition debt and the purchase
BidCo borrows **£60m** from banks and buys **100%** of Ferrowell for £100m (£40m of equity + £60m of debt).

Can the target help finance its own purchase (guarantees, security over its assets)? Since 2008 the prohibition of **financial assistance** applies only where a **public company** is involved (Companies Act 2006, ss. 678–679). Ferrowell is a private company: it may guarantee BidCo's loans, subject to its directors' duties (s. 172). When the target is a plc, it is often re-registered as private after the deal.

The fund now controls Ferrowell **100%** having put in only £36m: the holding structure (**legal** leverage) and the debt (**financial** leverage) combine.

~~~scene
retirer MOREAU
lien NEWCO -> CIBLE 100%
vue LBO
focus CIBLE
note NEWCO "Acquisition debt: £60m"
~~~

## Question: why must BidCo hold at least 75% of Ferrowell?
BidCo has no business of its own: its interest charges create a **tax loss**, while Ferrowell makes taxable profits. Dividends from Ferrowell to BidCo are generally exempt (Corporation Tax Act 2009, Part 9A).

~~~scene
focus NEWCO CIBLE
~~~

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

~~~scene
note CIBLE "75% or more: group relief possible"
~~~

## 5. Management equity
The managers pool their shares in a common company, **ManCo Ltd**. The chief executive holds 60% of ManCo, the finance director 40%.

The chief executive's economic interest in Ferrowell: 60% × 10% × 100% = **6%**. Performance mechanisms (**sweet equity**, **ratchet**) usually increase the managers' share if the fund reaches its target return.

~~~scene
retirer MGT
holding MANCO "ManCo Ltd (managers)"
personne DG "Chief executive"
personne DAF "Finance director"
lien DG -> MANCO 60%
lien DAF -> MANCO 40%
lien MANCO -> NEWCO 10%
vue DG
focus MANCO
~~~

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

~~~scene
vue LBO
note NEWCO "Remaining debt: £30m"
note CIBLE "Value: £130m"
~~~

## 7. Summary: the four levers
| Lever | Mechanism |
|---|---|
| **Financial** | debt magnifies the return on equity (and the risk) |
| **Legal** | the holding structure controls 100% of the target with a limited outlay |
| **Tax** | group relief (75% or more) sets interest against the target's profits |
| **Managerial** | managers become shareholders and share in the success |

Click on an entity to review its analysis: control, chain, economic interest.

~~~scene
vue LBO
selection CIBLE
~~~
` },

{ id: 'uk-ifrs', lang: 'en', droit: 'uk', md: `---
droit: uk
---
# IFRS: control, scope and changes in ownership
> IFRS 10, IFRS 11, IAS 28 and IFRS 3: what each purchase or sale of shares changes in the consolidated accounts.

> ⚠️ **What the tool shows, and what it does not.** IFRS 10 defines control through three elements: **power** over the investee, **exposure to variable returns**, and the **ability to use that power** to affect those returns. The tool reasons on **voting rights**, which covers the most common case but not every case. Situations where control does not come from a majority of votes (contracts, structured entities, potential voting rights, a large minority facing dispersed shareholders) call for **judgement** and are not computed.

Groups whose securities are traded on a UK regulated market prepare their consolidated accounts under **UK-adopted IFRS** (Companies Act 2006, s. 403).

## 1. A subsidiary: control and full consolidation
Merrow plc holds **60%** of the voting rights of Subsidiary A. Unless other facts point elsewhere, a majority of the votes gives power: Merrow **controls** A (IFRS 10).

A is **fully consolidated**: 100% of its assets, liabilities, income and expenses enter the group accounts. The 40% held by other shareholders appears as **non-controlling interests** (NCI), within equity.

~~~scene
societe M "Merrow plc"
societe A "Subsidiary A Ltd"
lien M -> A 60%
vue M
focus A
note A "Full consolidation · NCI 40%"
~~~

## 2. A sub-subsidiary: control down the chain, diluted interest
A holds **70%** of Sub-subsidiary B. Merrow controls A, which controls B: B is also **fully consolidated**.

But the group's share of B is only 60% × 70% = **42%**. NCI in B amount to **58%**: 30% held directly by B's other shareholders + 40% × 70% = 28% belonging indirectly to A's minority shareholders.

> 💡 In consolidation, you include according to **control**, but you share profits according to **ownership interest**.

~~~scene
societe B "Sub-subsidiary B Ltd"
lien A -> B 70%
focus B
note B "Control ✔ · group share 42%"
~~~

## 3. Significant influence and joint venture
- Merrow holds **25%** of C: with 20% or more of the votes, **significant influence** is presumed (IAS 28, a rebuttable presumption). C is an **associate**, accounted for using the **equity method**.
- Merrow and a partner each hold **50%** of JV Co, under an agreement requiring their **unanimous consent** for decisions about the relevant activities: this is **joint control** (IFRS 11). If the arrangement gives rights to the net assets, it is a **joint venture** (equity method); if it gives rights to the assets and obligations for the liabilities, it is a **joint operation**, accounted for line by line for its share.

On the canvas, the agreement is shown as a concert party. Note: under IFRS 11, what counts is **contractual unanimity**, which the tool does not check.

~~~scene
societe C "Associate C Ltd"
lien M -> C 25%
societe PART "Partner Ltd"
societe JV "JV Co Ltd"
lien M -> JV 50%
lien PART -> JV 50%
concert ACCORD "Joint control agreement (unanimity)" M PART
focus C JV
note C "IAS 28: equity method"
note JV "IFRS 11: joint venture"
~~~

## Question: Merrow buys 20% of A from the minority. How is it accounted for?
Merrow goes from 60% to **80%** of A. It already had control.

~~~scene
lien M -> A 80%
focus A B
~~~

- [ ] New goodwill is recognised on the 20% purchased
  Goodwill is measured only once, when control is obtained.
- [ ] A gain or loss goes to profit or loss
  No gain or loss: nothing changes hands outside the group's owners.
- [x] In equity, as a transaction between owners
  IFRS 10: changes in ownership that do not result in a loss of control are equity transactions.

### Answer
Control does not change: under IFRS 10 this is a **transaction between owners**, recognised **in equity**. No new goodwill, no profit: part of the NCI is simply reclassified as the parent's share.

Knock-on effect: the group's share of B rises to 80% × 70% = **56%**.

~~~scene
note A "No change of control: equity transaction"
~~~

## 5. Control achieved in stages
Merrow goes from 25% to **55%** of C: it obtains **control**. This is a **business combination** (IFRS 3), recognised at the acquisition date:
- the 25% already held is **remeasured at fair value**, the difference going to **profit or loss**;
- goodwill is measured at that date;
- C moves from the equity method to **full consolidation**.

~~~scene
lien M -> C 55%
focus C
note C "IFRS 3: previous 25% remeasured"
~~~

## 6. Loss of control
Merrow sells part of A and goes from 80% to **30%**. It **loses control** (IFRS 10):
- it derecognises the assets, liabilities and NCI of A, **and those of B**, which it controlled only through A;
- the retained 30% is **remeasured at fair value**; the gain or loss on disposal goes to **profit or loss**;
- afterwards, if significant influence is confirmed, A (with its subsidiary B) is accounted for using the equity method.

Look at the canvas: A and B lose Merrow's colour. B is still controlled… by A.

~~~scene
lien M -> A 30%
focus A B
note A "Loss of control: deconsolidation"
~~~

## 7. What the canvas does not show
| IFRS notion | In the tool |
|---|---|
| Control through a majority of voting rights | ✔ computed |
| Control down the chain, group share, NCI | ✔ computed (perspective, analysis) |
| Significant influence (20% or more) | ✔ threshold shown, presumption only |
| Joint control (IFRS 11) | ≈ shown as a concert party; unanimity is not checked |
| De facto control with a large minority | ✘ case-by-case judgement |
| Potential voting rights (options, convertibles) | ✘ not modelled |
| Structured entities, contractual control, agent or principal | ✘ not modelled |
| Goodwill, fair value, disposal gain | ✘ figures to compute separately |

The tool therefore helps visualise the **scope** of consolidation and the effect of **changes in ownership**; the accounting measurement is done alongside.

~~~scene
vue M
selection B
~~~
` }

);
