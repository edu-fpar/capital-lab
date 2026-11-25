---
droit: uk
---
# Acting in concert: the 30% mandatory bid
> Two minority shareholders who cooperate are treated as one, and 30% is the line not to cross.

## 1. A widely held company
Omega plc is listed: **Arden Investments Ltd** holds 20%, **Bexley Capital** 8%, the public 72%. No block exceeds 50%: Omega is **not controlled**.

Both holdings exceed 3% of the voting rights: they have been disclosed to the market (DTR 5).

```scene
holding A "Arden Investments Ltd"
fonds B "Bexley Capital"
public PUB "Public shareholders"
societe OMEGA "Omega plc (listed)"
lien A -> OMEGA 20%
lien B -> OMEGA 8%
lien PUB -> OMEGA 72%
focus OMEGA
```
## 2. The agreement
Arden and Bexley agree to cooperate to **obtain control** of Omega: they will vote together and coordinate their purchases. Under the Takeover Code they are **persons acting in concert** (Code, Definitions): their interests are **added together**.

Together they hold **28%**: still no control, and still below 30%.

```scene
concert PACTE "Omega agreement" A B
focus OMEGA
note OMEGA "Concert party: 20% + 8% = 28%"
```
## Question: Bexley buys another 3% on the market. What happens?
The concert party now holds 20% + 11% = **31%** of the voting rights.

```scene
lien B -> OMEGA 11%
lien PUB -> OMEGA 69%
focus B OMEGA
```
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

```scene
note OMEGA "30% or more in concert: mandatory offer (Rule 9)"
```
## 4. After the offer
Bexley makes the offer. Acceptances bring it to **36%**; the public keeps 44%. Together, Arden (20%) and Bexley (36%) hold **56%**: they **jointly control** Omega. Neither controls it alone.

Had acceptances reached 90% of the shares the offer related to, the bidder could have **squeezed out** the rest (s. 979).

```scene
lien B -> OMEGA 36%
lien PUB -> OMEGA 44%
focus OMEGA
note OMEGA "Joint control: 20% + 36%"
```
## 5. Who is behind Arden?
Arden Investments is 70% owned by **Mrs Whitfield**. She controls Arden, and through it takes part in the joint control of Omega. She is also a **person with significant control** of Arden (Part 21A).

Her perspective shows her economic interest in Omega: 70% × 20% = **14%**.

```scene
personne DURAND "Mrs Whitfield"
lien DURAND -> A 70%
vue DURAND
focus A
```
## 6. End of the agreement
The agreement is terminated. Each party votes freely again: Omega is **no longer controlled**.

> 💡 Bexley alone still holds 36%. A holder between 30% and 50% who acquires **any** further interest triggers Rule 9 again (Rule 9.1(b)).

> ⚠️ Simplification: whether shareholders are acting in concert is a question of fact for the Takeover Panel; merely voting the same way on a resolution does not usually make them a concert party.

```scene
retirer PACTE
vue aucune
focus OMEGA
```