---
droit: uk
---
# Capital ≠ power: weighted votes and non-voting shares
> How to hold 35% of the capital… and more than 50% of the votes.

By default, on a poll, **each share carries one vote** (Companies Act 2006, s. 284). But the articles may create **classes of shares** with different rights. The canvas then shows two figures on each link: capital and **votes**.

## 1. A listed company, one share one vote
**Dunmore plc** is listed. Its founder, **Jack**, holds **35%** of the capital; the remaining 65% is held by the public. With one share, one vote, Jack is a minority shareholder.

```scene
personne JEAN "Jack, founder"
public PUB "Public shareholders"
societe DELTA "Dunmore plc (listed)"
lien JEAN -> DELTA 35%
lien PUB -> DELTA 65%
focus DELTA
```
## 2. Founder shares with weighted votes
In fact, Dunmore's articles create two classes: **A shares**, held by the public, with one vote each, and **B shares**, held only by Jack, with **two votes** each.

Jack's 35 shares carry **70 votes**; the public keeps 65 votes. Total: 135 votes.

- Jack: 70 / 135 = **51.9%** of the votes → **control**!
- Public: 65 / 135 = 48.1%

UK law grants no automatic extra vote to long-term holders: weighted votes come only from the **articles**. Changing the rights attached to the B shares is a **variation of class rights**, which needs the consent of that class (s. 630).

> ⚠️ Simplification: dual-class structures were long excluded from the premium segment of the London market. The 2021 and 2024 listing reforms now accept enhanced voting rights for founders, subject to conditions (duration, transfer, size of the multiple): check the current UK Listing Rules.

```scene
lien JEAN -> DELTA 35% votes 51.85%
lien PUB -> DELTA 65% votes 48.15%
focus JEAN
note JEAN "35% of the capital, 51.9% of the votes"
```
## 3. An activist fund buys in
An activist fund buys **10%** of the capital from the public: A shares, one vote each.

Votes: Jack 70, fund 10, public 55 → total 135. Jack keeps **51.9%** of the votes; the fund has only **7.4%** of the votes for 10% of the capital. Above 3% of the voting rights, it must disclose its holding (DTR 5).

```scene
fonds ACT "Activist fund"
lien ACT -> DELTA 10% votes 7.41%
lien PUB -> DELTA 55% votes 40.74%
focus ACT
```
## Question: who controls Nova Ltd?
Another tool: **non-voting preference shares**, which typically give a priority dividend instead of votes.

In the start-up **Nova Ltd**, the founder **Leah** holds 40% of the capital in ordinary shares. A venture capital fund holds 60% of the capital, of which 50 points are **non-voting** preference shares and 10 points ordinary shares.

Votes: Leah 40, fund 10 → 50 votes in total.

```scene
personne LEA "Leah, founder"
fonds VC "Venture capital fund"
societe NOVA "Nova Ltd"
lien LEA -> NOVA 40% votes 80%
lien VC -> NOVA 60% votes 20%
focus NOVA
```
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

```scene
vue LEA
note NOVA "40% of the capital, 80% of the votes"
```
## 5. Key points
- **Control** is measured in **votes**, **economic interest** in **capital**.
- Tools that separate them: classes with weighted votes, non-voting shares, and contractual vetoes in a shareholders' agreement.
- In free mode, click on a link to set capital and votes separately.

```scene
vue aucune
```