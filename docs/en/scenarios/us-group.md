---
droit: us
---
# Acting as a group: 13(d) and §203
> Two investors who agree to act together are treated as one.

## 1. Two small stakes
Omega Corp. is listed on the NYSE. **Atlas Capital LP** owns **4%**, **Birch Partners LLC** **3%**; the rest is held by the public.

Each stays under the **5%** threshold of **Exchange Act §13(d)**: neither has to disclose its stake.

```scene
fonds ATLAS "Atlas Capital LP"
fonds BIRCH "Birch Partners LLC"
public PUB "Public stockholders"
societe OMEGA "Omega Corp. (NYSE-listed)"
lien ATLAS -> OMEGA 4%
lien BIRCH -> OMEGA 3%
lien PUB -> OMEGA 93%
focus OMEGA
```
## 2. The agreement: a "group"
Atlas and Birch agree to vote together to replace part of Omega's board. When two or more persons agree to act together for the purpose of acquiring, holding, voting or disposing of securities, they form a **group** (**Exchange Act §13(d)(3)**): the group is treated as a single person and their holdings are **aggregated**.

Together: 4% + 3% = **7%**, more than 5%: the group must file a **Schedule 13D** disclosing its holdings, its funding and its plans (for example a proxy fight).

> ⚠️ Since the SEC's 2023 amendments, the initial Schedule 13D is due within 5 business days. Passive investors may file the shorter Schedule 13G instead; an activist campaign rules that out.

```scene
concert GRP "Voting agreement (13(d) group)" ATLAS BIRCH
focus OMEGA
note OMEGA "Group: 4% + 3% = 7%, Schedule 13D"
```
## Question: the group goes on buying and reaches 18%. What does crossing 15% mean?
Atlas buys up to **10%**, Birch up to **8%**. Omega has not opted out of **DGCL §203**, and its board did not approve these purchases.

```scene
lien ATLAS -> OMEGA 10%
lien BIRCH -> OMEGA 8%
lien PUB -> OMEGA 82%
focus OMEGA
```
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

```scene
note OMEGA "Group 18%: interested stockholder (§203)"
focus ATLAS BIRCH
```
## 4. Who is behind Atlas?
Atlas Capital is itself 70% owned by **Ms. Diaz**. Ms. Diaz controls Atlas, and through it takes part in the group.

Ms. Diaz's perspective shows her economic interest in Omega: 70% × 10% = **7%**.

```scene
personne DIAZ "Ms. Diaz"
lien DIAZ -> ATLAS 70%
vue DIAZ
focus ATLAS
```
## 5. Control as a group
After a successful proxy fight, the group keeps buying: Atlas reaches **30%**, Birch **25%**. As a group they hold **55%** of the votes: together they **control** Omega.

> ⚠️ A controlling group (more than 50%) also owes fiduciary duties to the minority under Delaware case law; and long before 55%, the board would usually have reacted (poison pill, negotiation). Simplified.

```scene
lien ATLAS -> OMEGA 30%
lien BIRCH -> OMEGA 25%
lien PUB -> OMEGA 45%
vue aucune
focus OMEGA
note OMEGA "Group: 30% + 25% = 55%, joint control"
```
## 6. End of the agreement
The voting agreement is terminated. Each investor votes freely again: Atlas (30%) and Birch (25%) each remain far from a majority, so **nobody controls** Omega. The members must amend their Schedule 13D filings to report the end of the group.

```scene
retirer GRP
focus OMEGA
```