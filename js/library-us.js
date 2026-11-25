/* ============================================================
 * Scenario library: United States (Delaware corporate law,
 * federal securities law, US GAAP, federal income tax), in American English.
 * Adapted from the French library (js/library.js), not translated.
 * (Command blocks use ~~~scene instead of backtick fences so that the
 *  markdown can live in JS template strings.)
 * ============================================================ */
window.P = window.P || {};
P.LIBRARY = P.LIBRARY || [];
P.LIBRARY.push(

{ id: 'us-pyramid', lang: 'en', droit: 'us', md: `---
droit: us
---
# The holding company pyramid
> How a family controls a large listed corporation while owning only a small fraction of its equity.

We build a **chain of holding companies** step by step. At each level the family keeps a majority of the votes… but its **economic interest** shrinks.

Watch the colors: a **tinted** entity is controlled by the shareholder of the same color.

## 1. The family sets up a holding company
The Carter family contributes its shares to a holding company, **Carter Holdings LLC**, and keeps **51%** of it. The other 49% belong to outside investors (not shown: they appear under "others").

With more than 50% of the voting power, the family elects the managers alone and decides every matter put to a majority vote: it **controls** the holding company.

~~~scene
personne FAM "Carter family"
holding H1 "Carter Holdings LLC"
lien FAM -> H1 51%
focus H1
~~~

## 2. A second level
Carter Holdings acquires **51%** of a second holding company, **Carter Industries Inc.**

- The family owns *no* share of Carter Industries directly.
- But it controls Carter Holdings, which controls Carter Industries: control **passes down** the chain.
- Its **economic interest** (its share of the dividends) is only 51% × 51% ≈ **26%**.

The **perspective** mode (👁) shows the family's interest and control on every entity.

~~~scene
holding H2 "Carter Industries Inc."
lien H1 -> H2 51%
vue FAM
focus H2
~~~

## 3. The listed corporation
Carter Industries owns **51%** of **Alpha Corp.**, a large corporation listed on the New York Stock Exchange.

The family controls Alpha Corp. with an economic interest of 51% × 51% × 51% ≈ **13.3%**. The other 86.7% belong to other investors… who have no say.

~~~scene
societe ALPHA "Alpha Corp. (NYSE-listed)"
lien H2 -> ALPHA 51%
focus ALPHA
note ALPHA "Controlled with about 13% of the economic interest"
~~~

## 4. One more level
Alpha Corp. acquires 51% of **Beta Inc.** The family now controls Beta with an interest of only **6.8%**.

> 💡 Each level roughly halves the economic interest without ever diluting control: this is the **leverage effect** of the pyramid.

> ⚠️ Deep pyramids are much rarer in the United States than in continental Europe or Asia; the taxation of intercorporate dividends is often cited as one reason. The mechanics of control are the same.

~~~scene
societe BETA "Beta Inc."
lien ALPHA -> BETA 51%
focus BETA
~~~

## Question: how much say does the Delta Fund have in Alpha Corp.?
**Delta Fund LP** owns the other 49% of Carter Holdings: it finances the pyramid almost as much as the family.

~~~scene
fonds DELTA "Delta Fund LP"
lien DELTA -> H1 49%
vue aucune
focus DELTA ALPHA
~~~

- [ ] 49% of the votes in Alpha Corp.
  Its 49% is in Carter Holdings, not in Alpha Corp.
- [ ] About 12.7% of the votes, like its economic interest
  49% × 51% × 51% ≈ 12.7% measures its share of Alpha's profits, not its votes.
- [x] None: it does not vote at Alpha's stockholder meetings
  Its votes count only in Carter Holdings, where the family holds the majority.
- [ ] A veto over Alpha's charter amendments
  US law gives no statutory blocking minority; in any case its 49% is in Carter Holdings, not in Alpha.

### Answer
The fund has an **economic interest** of about **12.7%** in Alpha Corp. — almost as much as the family (13.3%) — but **no vote** there: it only votes in Carter Holdings, where it is in the minority.

That is the paradox of the pyramid: you can **finance without deciding**. The fund's perspective is now shown on the canvas.

~~~scene
vue DELTA
focus DELTA ALPHA
~~~

## 6. Summary
| Company | Family interest | Control |
|---|---|---|
| Carter Holdings LLC | 51% | ✔ |
| Carter Industries Inc. | 26% | ✔ |
| Alpha Corp. | 13.3% | ✔ |
| Beta Inc. | 6.8% | ✔ |

Key points:
- **voting control** ≠ **economic interest**;
- control passes down the chain (a majority of the voting power at each level), interest is **multiplied**;
- holding companies often trade at a **holding company discount**.

Click an entity to see its detailed analysis.

~~~scene
vue FAM
selection BETA
~~~
` },

{ id: 'us-majority', lang: 'en', droit: 'us', md: `---
droit: us
---
# Majority rule and supermajority provisions
> In a Delaware corporation, the majority decides almost everything. A large minority has no veto… unless the charter gives it one.

Stockholders of a Delaware corporation elect the **board of directors** and vote on the most important corporate changes: charter amendments, mergers, sale of all or substantially all assets, dissolution. The default rule is simple: the **majority** wins.

## 1. Two stockholders
Gamma Inc. has two stockholders: **Mary (60%)** and **Paul (40%)**.

Mary holds a majority of the voting power. With straight voting (the default: no cumulative voting unless the charter provides for it), she elects **every** director: she **controls** Gamma.

~~~scene
personne MARY "Mary"
personne PAUL "Paul"
societe GAMMA "Gamma Inc."
lien MARY -> GAMMA 60%
lien PAUL -> GAMMA 40%
focus GAMMA
~~~

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

~~~scene
note MARY "Majority: elects the board, amends the charter"
note PAUL "40%: no statutory veto"
focus MARY PAUL
~~~

## 3. A supermajority clause in the charter
When the company was formed, Paul negotiated a clause: amending the charter requires **two-thirds** of the outstanding stock. Delaware allows the charter to require a **greater vote** than the statute (**DGCL §102(b)(4)**), and such a clause can itself be changed only by that greater vote (**DGCL §242(b)(4)**).

Now Paul's 40% blocks any amendment… because the **contract** says so, not the statute.

Then Paul sells 7% to Mary. Mary reaches **67%** (two-thirds or more): she can amend the charter alone again. Paul, at **33%**, loses his veto.

> 💡 A few shares can tip the balance: blocks close to a threshold often change hands with a **control premium**.

~~~scene
lien MARY -> GAMMA 67%
lien PAUL -> GAMMA 33%
focus MARY PAUL
note GAMMA "Charter: 2/3 required to amend"
~~~

## 4. The 50/50 trap
What if Mary and Paul each held **50%**? Neither has *more than* 50%: **nobody controls**. Each can block the other: a **deadlock**.

If the stockholders are so divided that they cannot elect directors, the Court of Chancery may appoint a **custodian** (**DGCL §226**). Stockholders usually prevent this with a **stockholders' agreement**: tie-breaking director, buy-sell ("shotgun") clause, mediation…

~~~scene
lien MARY -> GAMMA 50%
lien PAUL -> GAMMA 50%
focus GAMMA
note GAMMA "50/50: nobody controls"
~~~

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

~~~scene
lien MARY -> GAMMA 92%
lien PAUL -> GAMMA 8%
note GAMMA "90% or more: short-form merger possible"
~~~
` },

{ id: 'us-dual-class', lang: 'en', droit: 'us', md: `---
droit: us
---
# Equity ≠ votes: dual-class stock
> How a founder can own 15% of a listed company… and control it.

By default, **one share = one vote**. But a Delaware corporation may issue classes of stock with **different voting powers**, including non-voting stock (**DGCL §151(a)**). The canvas then shows two numbers on each link: equity (capital) and votes.

## 1. A one-share-one-vote company
**Nova Inc.** is listed on Nasdaq. Its founder, **Jane**, owns **15%** of the shares; the public owns the other 85%. One share = one vote: Jane is a large minority stockholder, nothing more.

~~~scene
personne JANE "Jane, founder"
public PUB "Public stockholders"
societe NOVA "Nova Inc. (Nasdaq-listed)"
lien JANE -> NOVA 15%
lien PUB -> NOVA 85%
focus NOVA
~~~

## 2. The dual-class structure
Now suppose Nova went public with **two classes** of common stock:
- **Class A**, sold to the public: **1 vote** per share;
- **Class B**, kept by the founder: **10 votes** per share.

Jane's 15 shares (out of 100) are Class B: **150 votes**. The public's 85 Class A shares carry 85 votes. Total: 235 votes.

- Jane: 150 / 235 = **63.8%** of the votes → **control**!
- Public: 85 / 235 = 36.2%

Several well-known US technology companies went public with this kind of structure.

~~~scene
lien JANE -> NOVA capital=15% votes=63.83%
lien PUB -> NOVA capital=85% votes=36.17%
focus JANE
note JANE "15% of the equity, 63.8% of the votes"
~~~

## 3. An activist fund buys in
An activist fund buys **10%** of the shares on the market. These are Class A shares: 1 vote each.

Votes: Jane 150, fund 10, public 75 → total 235. Jane keeps **63.8%** of the votes; the fund has only **4.3%** of the votes for 10% of the equity.

~~~scene
fonds ACT "Activist fund"
lien ACT -> NOVA capital=10% votes=4.26%
lien PUB -> NOVA capital=75% votes=31.91%
focus ACT
~~~

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

~~~scene
lien JANE -> NOVA capital=10% votes=52.63%
lien ACT -> NOVA capital=15% votes=7.89%
lien PUB -> NOVA capital=75% votes=39.47%
vue JANE
focus JANE NOVA
~~~

## 6. Key points
- **Control** is measured in **votes**, **economic interest** in **equity**.
- Delaware allows classes with different voting rights, and non-voting stock (§151(a)); the details are in the **charter**.
- A listed company in which one person or group holds more than 50% of the voting power is a **"controlled company"**: NYSE and Nasdaq exempt it from some board independence requirements.
- In free mode, click a link to set equity and votes separately.

> ⚠️ Stock exchange rules generally allow dual-class stock at the IPO but restrict measures that reduce the voting rights of existing stockholders afterwards. Index providers and institutional investors also have their own policies.

~~~scene
vue aucune
selection NOVA
~~~
` },

{ id: 'us-treasury-stock', lang: 'en', droit: 'us', md: `---
droit: us
---
# Treasury stock and circular holdings
> When a corporation "owns itself"… and its largest stockholder benefits.

## 1. Alpha and its founding family
The Reed family owns **46%** of Alpha Corp.; the rest is widely held by the public. Nobody has more than 50% of the votes: Alpha is **not controlled**.

~~~scene
personne REED "Reed family"
societe ALPHA "Alpha Corp."
lien REED -> ALPHA 46%
focus ALPHA
~~~

## 2. Alpha controls Beta
Alpha owns **60%** of Beta Inc.: it controls Beta.

~~~scene
societe BETA "Beta Inc."
lien ALPHA -> BETA 60%
focus BETA
~~~

## Question: Beta owns 10% of Alpha. Who controls Alpha now?
Beta acquired **10%** of Alpha's stock (for example a stake it held before Alpha took control of it). The Reed family has not bought a single share.

~~~scene
lien BETA -> ALPHA 10%
focus REED ALPHA
~~~

- [ ] Nobody: the Reed family still has only 46%
  46% of the shares, yes, but not 46% of the votes that count.
- [x] The Reed family
  Beta's shares are not voted: only 90% of the votes remain, and 46 / 90 = 51.1%.
- [ ] Alpha's management, through Beta's 10%
  This is precisely what the law prevents: those shares cannot be voted.

### Answer
Beta is majority-owned by Alpha. Under **DGCL §160(c)**, shares of a corporation's own stock held by **another corporation a majority of whose voting shares it holds** are neither voted nor counted for quorum purposes. Otherwise Alpha's directors would vote… for themselves, with the company's money.

Mechanical consequence: only 90% of the votes can be cast. The Reed family now weighs 46 / 90 = **51.1%** of the votes: it **gains control** without buying a single share.

~~~scene
note ALPHA "10% of the votes neutralized"
focus REED ALPHA
~~~

## 4. Treasury stock
Alpha also buys back **5%** of its own shares (a buyback program). Shares held in the treasury are **not voted** either (DGCL §160(c)).

Only 85% of the votes remain: the family weighs 46 / 85 = **54.1%**.

~~~scene
lien ALPHA -> ALPHA 5%
focus ALPHA
note ALPHA "Treasury 5% + subsidiary-held 10%"
~~~

## 5. Safeguards
- Treasury stock and shares held by a majority-owned subsidiary are **not voted** and do not count for the quorum (**DGCL §160(c)**).
- A corporation may not repurchase its shares when its capital is impaired or would become impaired (**DGCL §160(a)**).
- Unlike French or EU law, Delaware sets **no fixed percentage cap** on buybacks; listed companies usually follow the SEC's **Rule 10b-18** safe harbor (volume, timing, price).

> 💡 A buyback mechanically **increases** the voting percentage of every other stockholder: a large holder can cross a threshold (control, 15%, 10%, 5%) without buying anything.

> 💡 On the canvas, the neutralized links appear as **gray dotted lines**: their votes are excluded and the other percentages are recalculated ("effective" votes).

~~~scene
vue REED
selection ALPHA
~~~
` },

{ id: 'us-group', lang: 'en', droit: 'us', md: `---
droit: us
---
# Acting as a group: 13(d) and §203
> Two investors who agree to act together are treated as one.

## 1. Two small stakes
Omega Corp. is listed on the NYSE. **Atlas Capital LP** owns **4%**, **Birch Partners LLC** **3%**; the rest is held by the public.

Each stays under the **5%** threshold of **Exchange Act §13(d)**: neither has to disclose its stake.

~~~scene
fonds ATLAS "Atlas Capital LP"
fonds BIRCH "Birch Partners LLC"
public PUB "Public stockholders"
societe OMEGA "Omega Corp. (NYSE-listed)"
lien ATLAS -> OMEGA 4%
lien BIRCH -> OMEGA 3%
lien PUB -> OMEGA 93%
focus OMEGA
~~~

## 2. The agreement: a "group"
Atlas and Birch agree to vote together to replace part of Omega's board. When two or more persons agree to act together for the purpose of acquiring, holding, voting or disposing of securities, they form a **group** (**Exchange Act §13(d)(3)**): the group is treated as a single person and their holdings are **aggregated**.

Together: 4% + 3% = **7%**, more than 5%: the group must file a **Schedule 13D** disclosing its holdings, its funding and its plans (for example a proxy fight).

> ⚠️ Since the SEC's 2023 amendments, the initial Schedule 13D is due within 5 business days. Passive investors may file the shorter Schedule 13G instead; an activist campaign rules that out.

~~~scene
concert GRP "Voting agreement (13(d) group)" ATLAS BIRCH
focus OMEGA
note OMEGA "Group: 4% + 3% = 7%, Schedule 13D"
~~~

## Question: the group goes on buying and reaches 18%. What does crossing 15% mean?
Atlas buys up to **10%**, Birch up to **8%**. Omega has not opted out of **DGCL §203**, and its board did not approve these purchases.

~~~scene
lien ATLAS -> OMEGA 10%
lien BIRCH -> OMEGA 8%
lien PUB -> OMEGA 82%
focus OMEGA
~~~

- [ ] The group must launch a takeover bid for all the shares
  The United States has no mandatory bid rule, unlike the UK or France (30%).
- [ ] The group controls Omega
  18% is far from a majority of the voting power.
- [x] Each member becomes an "interested stockholder"
  An agreement to vote together counts as ownership under §203: the 18% are added up, above 15%.

### Answer
Under **DGCL §203**, a person who owns **15% or more** of the voting stock — counting the shares of anyone with whom it has an agreement for voting — is an **interested stockholder**. For **three years**, it cannot complete a **business combination** with Omega (merger, asset sale, etc.), unless:
- the board approved the transaction or the share purchase **beforehand**;
- or the investor reached **85%** in the same transaction;
- or the board **and** two-thirds of the shares not owned by the interested stockholder approve it.

At 18%, each member of the group is also a **10% beneficial owner** for Section 16 purposes (reporting, short-swing profits).

> ⚠️ §203 applies to listed corporations (or those with more than 2,000 holders of record) unless the charter or bylaws opt out. Simplified: only the main exceptions are listed.

~~~scene
note OMEGA "Group 18%: interested stockholder (§203)"
focus ATLAS BIRCH
~~~

## 4. Who is behind Atlas?
Atlas Capital is itself 70% owned by **Ms. Diaz**. Ms. Diaz controls Atlas, and through it takes part in the group.

Ms. Diaz's perspective shows her economic interest in Omega: 70% × 10% = **7%**.

~~~scene
personne DIAZ "Ms. Diaz"
lien DIAZ -> ATLAS 70%
vue DIAZ
focus ATLAS
~~~

## 5. Control as a group
After a successful proxy fight, the group keeps buying: Atlas reaches **30%**, Birch **25%**. As a group they hold **55%** of the votes: together they **control** Omega.

> ⚠️ A controlling group (more than 50%) also owes fiduciary duties to the minority under Delaware case law; and long before 55%, the board would usually have reacted (poison pill, negotiation). Simplified.

~~~scene
lien ATLAS -> OMEGA 30%
lien BIRCH -> OMEGA 25%
lien PUB -> OMEGA 45%
vue aucune
focus OMEGA
note OMEGA "Group: 30% + 25% = 55%, joint control"
~~~

## 6. End of the agreement
The voting agreement is terminated. Each investor votes freely again: Atlas (30%) and Birch (25%) each remain far from a majority, so **nobody controls** Omega. The members must amend their Schedule 13D filings to report the end of the group.

~~~scene
retirer GRP
focus OMEGA
~~~
` },

{ id: 'us-consolidation', lang: 'en', droit: 'us', md: `---
droit: us
---
# Scope of consolidation under US GAAP
> Consolidation, equity method, fair value… and the difference between control and ownership interest.

> ⚠️ US GAAP has two consolidation models: the **voting interest model** (shown here) and the **variable interest entity** (VIE) model, where control comes from contracts or economic exposure rather than votes. The tool only computes votes.

## 1. The parent
**Parent Corp.** holds three direct investments. Depending on its level of control, each one is accounted for differently in the consolidated financial statements.

~~~scene
societe M "Parent Corp."
societe F1 "Subsidiary 1"
societe F2 "Investee 2"
societe F3 "Investee 3"
lien M -> F1 80%
lien M -> F2 30%
lien M -> F3 8%
vue M
~~~

## 2. Controlling financial interest → consolidation
With 80% of the votes, Parent Corp. has a **controlling financial interest** in **Subsidiary 1** (ASC 810, voting interest model: usually a majority of the voting interests). Subsidiary 1 is **consolidated**: 100% of its assets, liabilities, revenue and expenses. The 20% held by other stockholders is presented as **noncontrolling interest**, within equity.

~~~scene
focus F1
note F1 "Consolidated · NCI 20%"
~~~

## 3. Significant influence → equity method
At **20% or more** of the voting stock, **significant influence** is presumed (ASC 323, a rebuttable presumption): Investee 2 is accounted for under the **equity method** (one line: the share of its net assets and of its net income).

Below 20%, Investee 3 is a plain **equity security**: measured at **fair value** through net income (ASC 321), or at cost less impairment when it has no readily determinable fair value.

~~~scene
focus F2 F3
note F2 "Equity method (ASC 323)"
note F3 "Fair value (ASC 321)"
~~~

## Question: Subsidiary 1 owns 60% of a sub-subsidiary. How does Parent Corp. account for it?
Parent Corp. holds no share of the Sub-subsidiary directly.

~~~scene
societe SF "Sub-subsidiary"
lien F1 -> SF 60%
focus SF
~~~

- [ ] Equity method: Parent's interest is only 48%
  80% × 60% = 48% measures ownership, not control.
- [x] Full consolidation
  Parent controls Subsidiary 1, which controls the Sub-subsidiary with 60% of the votes.
- [ ] Not at all: Parent has no direct holding
  Control passes down the chain: the group includes indirect subsidiaries.

### Answer
- **Control**: Parent Corp. controls the 60% of the votes held by its subsidiary → the Sub-subsidiary is **consolidated**.
- **Ownership interest**: 80% × 60% = **48%** → the share of the Sub-subsidiary's net income attributable to Parent's stockholders. The other **52%** goes to noncontrolling interests (40% held directly by outsiders + 20% × 60% = 12% indirectly through Subsidiary 1).

> 💡 Consolidate according to **control**, split the results according to **ownership**.

~~~scene
note SF "Control 60% · interest 48%"
focus SF
~~~

## 5. Joint venture → equity method
Parent Corp. and an industrial partner form **JV Co** 50/50, with an agreement requiring both partners' consent for key decisions: **joint control**. Neither has a majority, so neither consolidates; each accounts for its investment in the corporate joint venture under the **equity method** (ASC 323).

~~~scene
societe PART "Industrial partner"
societe JV "JV Co"
lien M -> JV 50%
lien PART -> JV 50%
concert PACTE_JV "JV agreement" M PART
focus JV
~~~

## 6. Summary
| Voting interest | Accounting | Standard |
|---|---|---|
| more than 50% (direct or through a subsidiary) | consolidation, noncontrolling interest | ASC 810 |
| joint control (50/50 with veto) | equity method | ASC 323 |
| 20% to 50% | equity method (significant influence presumed) | ASC 323 |
| below 20% | fair value (or cost less impairment) | ASC 321 |

> ⚠️ Presumptions only: significant influence can exist below 20% (board seat) or be absent above it; a majority holder may lack control if minority holders have substantive participating rights.

~~~scene
vue M
selection SF
~~~
` },

{ id: 'us-dilution', lang: 'en', droit: 'us', md: `---
droit: us
---
# Venture rounds and dilution
> How founders lose their majority, round after round.

> ⚠️ Simplified: preferred stock is assumed to vote with the common stock on an as-converted basis (the usual rule), options carry **no vote** until exercised, and SAFEs, liquidation preferences and anti-dilution clauses are left aside.

## 1. Incorporation
The two founders, **Ana** and **Hugo**, form **Kiwi Labs Inc.**, a Delaware corporation, 50/50. Watch out: at 50/50, neither controls alone!

~~~scene
personne ANA "Ana"
personne HUGO "Hugo"
societe KIWI "Kiwi Labs Inc."
lien ANA -> KIWI 50%
lien HUGO -> KIWI 50%
focus KIWI
~~~

## 2. A founders' voting agreement
Ana and Hugo sign a **voting agreement**: they will always vote their shares the same way (Delaware enforces such agreements, **DGCL §218(c)**). Together they **control** Kiwi.

~~~scene
concert FDR "Founders' voting agreement" ANA HUGO
focus KIWI
~~~

## 3. Seed round: 20%
A seed fund invests and receives **20%** of the shares, newly issued. The founders are **diluted**: 50% × 0.8 = 40% each. Together: 80%.

~~~scene
fonds SEED "Seed fund"
lien ANA -> KIWI 40%
lien HUGO -> KIWI 40%
lien SEED -> KIWI 20%
focus SEED
~~~

## Question: after the Series A, do the founders still control Kiwi?
A venture fund buys Series A preferred stock: **25%** of the fully diluted capital after the round. The investors also require an **option pool** of **10%** (post-money) for future employees, created before the round, so it dilutes only the existing holders.

Fully diluted capital: founders 26% each (52% together), seed 13%, Series A 25%, pool 10%.

~~~scene
fonds VCA "Series A fund"
holding POOL "Option pool (unexercised)"
lien ANA -> KIWI capital=26% votes=28.89%
lien HUGO -> KIWI capital=26% votes=28.89%
lien SEED -> KIWI capital=13% votes=14.44%
lien VCA -> KIWI capital=25% votes=27.78%
lien POOL -> KIWI capital=10% votes=0%
focus KIWI
~~~

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

~~~scene
focus ANA HUGO
note KIWI "Founders: 52% of capital, 57.8% of votes"
~~~

## 5. Series B: 30%
New round: a growth fund buys **30%**. Everyone else is diluted by 30%: founders 18.2% each (**36.4%** together), seed 9.1%, Series A 17.5%, pool 7%.

Votes (93 outstanding): founders **19.6%** each, **39.1%** together; seed 9.8%; Series A 18.8%; Series B 32.3%.

The founders' agreement is no longer enough: **nobody controls Kiwi**. The founders remain the largest bloc, but must deal with the investors.

~~~scene
fonds VCB "Series B fund"
lien ANA -> KIWI capital=18.2% votes=19.57%
lien HUGO -> KIWI capital=18.2% votes=19.57%
lien SEED -> KIWI capital=9.1% votes=9.78%
lien VCA -> KIWI capital=17.5% votes=18.82%
lien VCB -> KIWI capital=30% votes=32.26%
lien POOL -> KIWI capital=7% votes=0%
focus KIWI
note KIWI "Founders: 39.1% of the votes, no control"
~~~

## 6. Who controls the board?
In US venture deals, the answer is usually written in a **voting agreement** signed by the founders and the main investors: each party agrees to vote for directors designated by the others (for example two founder seats, one per lead investor, one independent).

If the founders, the seed fund and the Series A fund sign it, the group gathers 39.1% + 9.8% + 18.8% = **67.7%** of the votes. The founders keep their seats, but share control.

~~~scene
concert FDR "Voting agreement (founders + seed + Series A)" ANA HUGO SEED VCA
focus KIWI
~~~
` },

{ id: 'us-lbo', lang: 'en', droit: 'us', md: `---
droit: us
---
# Leveraged buyout: HoldCo, BidCo and debt
> Acquisition vehicles, acquisition debt, consolidated tax return and management equity.

A **leveraged buyout** (LBO) is the acquisition of a company by a **private equity fund** through newly formed vehicles that finance the price largely with **debt**. The debt is then serviced with the cash flows of the acquired company.

> ⚠️ The canvas shows **ownership** (equity and votes). Bank debt is not ownership: it appears in the notes and the text. The amounts are simplified examples.

## 1. The target
**Prairie Tools Inc.** is 100% owned by its founder, Mr. Moore, who wants to sell. Agreed price: **$100 million** (assume, for simplicity, that the target has no debt).

~~~scene
personne MOORE "Mr. Moore (founder)"
societe CIBLE "Prairie Tools Inc."
lien MOORE -> CIBLE 100%
focus CIBLE
note CIBLE "Price: $100M"
~~~

## 2. HoldCo and BidCo
The fund forms two new corporations: **HoldCo**, which receives the equity, and its wholly owned subsidiary **BidCo**, which will borrow and buy the target. The fund puts in **$36 million**, the management team **$4 million**: $40 million of equity.

Fund: **90%** of HoldCo, managers: **10%**. The fund controls HoldCo, which controls BidCo.

> 💡 Two levels separate the lenders: the senior lenders lend to BidCo, closest to the target's assets; any mezzanine or holding-level debt sits higher and is **structurally subordinated**.

~~~scene
fonds LBO "Buyout Fund I LP"
personne MGT "Management team"
holding HOLDCO "HoldCo Inc."
holding BIDCO "BidCo Inc."
lien LBO -> HOLDCO 90%
lien MGT -> HOLDCO 10%
lien HOLDCO -> BIDCO 100%
focus HOLDCO BIDCO
note HOLDCO "Equity: $40M"
~~~

## 3. Acquisition debt and the purchase
BidCo borrows **$60 million** from banks and buys **100%** of Prairie Tools for $100 million ($40 million of equity + $60 million of debt).

Delaware has **no general ban on financial assistance**: once the deal closes, the target typically **guarantees** the loan and pledges its assets, or BidCo merges into it so that the debt sits where the cash is. The limits come from elsewhere: **fraudulent transfer** law if the target is left insolvent, and the loan covenants.

The fund now controls Prairie Tools **100%** with only $36 million of its own money: the holding structure (**legal** leverage) and the debt (**financial** leverage) combine.

~~~scene
retirer MOORE
lien BIDCO -> CIBLE 100%
vue LBO
focus CIBLE
note BIDCO "Acquisition debt: $60M"
~~~

## Question: what minimum stake lets BidCo and Prairie Tools file a single federal tax return?
BidCo has no business of its own: to pay interest, it relies on the target's cash flows. If both file a **consolidated federal income tax return**, BidCo's interest expense offsets Prairie Tools' taxable income.

~~~scene
focus BIDCO CIBLE
~~~

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

~~~scene
note CIBLE "80% vote and value: consolidated return"
focus HOLDCO BIDCO CIBLE
~~~

## 5. Management equity
The managers pool their shares in a common vehicle, **ManCo LLC**. The CEO owns 60% of ManCo, the CFO 40%.

The CEO's economic interest in Prairie Tools: 60% × 10% × 100% × 100% = **6%**. On top of this, US deals usually grant **options** or **profits interests** that vest over time and with the fund's returns.

~~~scene
retirer MGT
holding MANCO "ManCo LLC (managers)"
personne CEO "CEO"
personne CFO "CFO"
lien CEO -> MANCO 60%
lien CFO -> MANCO 40%
lien MANCO -> HOLDCO 10%
vue CEO
focus MANCO
~~~

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

~~~scene
vue LBO
note BIDCO "Remaining debt: $30M"
note CIBLE "Value: $130M"
~~~

## 7. Summary: the four levers
| Lever | Mechanism |
|---|---|
| **Financial** | debt amplifies the return on equity (and the risk) |
| **Legal** | the HoldCo/BidCo chain controls 100% of the target with limited equity |
| **Tax** | the consolidated return (80% vote and value) offsets interest against the target's income, within §163(j) |
| **Managerial** | managers become owners and share in the upside |

Click an entity to review its analysis: control, chain, economic interest.

~~~scene
vue LBO
selection CIBLE
~~~
` }

);
