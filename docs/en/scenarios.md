# Available scenarios

The English interface comes with two sets of built-in scenarios, one for each law. Each "▶" link opens the online workshop directly on the scenario; the "markdown" link shows its text, which can serve as a model. The law of a scenario is set by its header (`droit: uk` or `droit: us`): the workshop switches to it automatically.

## United Kingdom

| Scenario | Notions | |
|---|---|---|
| **The holding pyramid** | chained control, economic interest, leverage effect, holding company discount | [▶](https://edu-fpar.github.io/capital-lab/?lang=en&scenario=uk-pyramid ':ignore') · [markdown](scenarios/uk-pyramid.md) |
| **Majorities and blocking minorities** | ordinary and special resolutions, 50% and 75%, blocking minority above 25%, deadlock at 50/50 | [▶](https://edu-fpar.github.io/capital-lab/?lang=en&scenario=uk-majorities ':ignore') · [markdown](scenarios/uk-majorities.md) |
| **Capital ≠ power: weighted votes and non-voting shares** | dual-class shares, non-voting preference shares | [▶](https://edu-fpar.github.io/capital-lab/?lang=en&scenario=uk-voting-rights ':ignore') · [markdown](scenarios/uk-voting-rights.md) |
| **Cross-holdings and treasury shares** | votes of treasury shares, a subsidiary holding shares in its parent | [▶](https://edu-fpar.github.io/capital-lab/?lang=en&scenario=uk-treasury-shares ':ignore') · [markdown](scenarios/uk-treasury-shares.md) |
| **Acting in concert: the 30% mandatory bid** | shareholders' agreement, persons acting in concert, Rule 9 mandatory offer at 30% | [▶](https://edu-fpar.github.io/capital-lab/?lang=en&scenario=uk-concert ':ignore') · [markdown](scenarios/uk-concert.md) |
| **The scope of consolidation** | IFRS 10, IFRS 11, IAS 28: consolidation, equity method, control ≠ interest, joint venture | [▶](https://edu-fpar.github.io/capital-lab/?lang=en&scenario=uk-consolidation ':ignore') · [markdown](scenarios/uk-consolidation.md) |
| **Funding rounds and dilution** | share issues, pre-emption rights (s. 561), loss of the majority | [▶](https://edu-fpar.github.io/capital-lab/?lang=en&scenario=uk-dilution ':ignore') · [markdown](scenarios/uk-dilution.md) |
| **LBO: buying a company with leverage** | bidco, acquisition debt, group relief at 75%, management equity, leverage | [▶](https://edu-fpar.github.io/capital-lab/?lang=en&scenario=uk-lbo ':ignore') · [markdown](scenarios/uk-lbo.md) |
| **IFRS: control, scope and changes in ownership** | IFRS 10, 11, IAS 28, IFRS 3: changes in ownership, gaining and losing control | [▶](https://edu-fpar.github.io/capital-lab/?lang=en&scenario=uk-ifrs ':ignore') · [markdown](scenarios/uk-ifrs.md) |

## United States

| Scenario | Notions | |
|---|---|---|
| **The holding company pyramid** | chained control, economic interest, leverage effect | [▶](https://edu-fpar.github.io/capital-lab/?lang=en&scenario=us-pyramid ':ignore') · [markdown](scenarios/us-pyramid.md) |
| **Majority rule and supermajority provisions** | majority of the voting power, election of the board, charter amendments and mergers; supermajority only if the charter requires it | [▶](https://edu-fpar.github.io/capital-lab/?lang=en&scenario=us-majority ':ignore') · [markdown](scenarios/us-majority.md) |
| **Equity ≠ votes: dual-class stock** | high-vote and low-vote shares, founders' control with a minority of the equity | [▶](https://edu-fpar.github.io/capital-lab/?lang=en&scenario=us-dual-class ':ignore') · [markdown](scenarios/us-dual-class.md) |
| **Treasury stock and circular holdings** | treasury stock and shares held by a majority-owned subsidiary are not voted (DGCL §160(c)) | [▶](https://edu-fpar.github.io/capital-lab/?lang=en&scenario=us-treasury-stock ':ignore') · [markdown](scenarios/us-treasury-stock.md) |
| **Acting as a group: 13(d) and §203** | Section 13(d) group, aggregated holdings, interested stockholder at 15% (DGCL §203) | [▶](https://edu-fpar.github.io/capital-lab/?lang=en&scenario=us-group ':ignore') · [markdown](scenarios/us-group.md) |
| **Scope of consolidation under US GAAP** | ASC 810 (consolidation), ASC 323 (equity method), control ≠ interest | [▶](https://edu-fpar.github.io/capital-lab/?lang=en&scenario=us-consolidation ':ignore') · [markdown](scenarios/us-consolidation.md) |
| **Venture rounds and dilution** | seed and series rounds, founders' dilution, loss of the majority | [▶](https://edu-fpar.github.io/capital-lab/?lang=en&scenario=us-dilution ':ignore') · [markdown](scenarios/us-dilution.md) |
| **Leveraged buyout: HoldCo, BidCo and debt** | acquisition vehicle, acquisition debt, consolidated tax return at 80%, management equity | [▶](https://edu-fpar.github.io/capital-lab/?lang=en&scenario=us-lbo ':ignore') · [markdown](scenarios/us-lbo.md) |

There is no US version of the IFRS scenario: for US GAAP, see *Scope of consolidation under US GAAP*.

The library link: [▶ all scenarios](https://edu-fpar.github.io/capital-lab/?lang=en&scenarios ':ignore').

## Not translated

The French scenario on **de facto control** relies on a presumption specific to French law (more than 40% of the votes, with no other shareholder holding more: art. L233-3, II of the French Commercial Code). UK and US law have no equivalent statutory presumption, so this scenario exists only in French. The French scenarios remain available in the French interface ([French documentation](../scenarios.md)).

## Accepted limitations

- **LBO**: debt is not a shareholding. It appears in the bubbles and the commentary, not as a link.
- **IFRS / US GAAP**: the tool reasons on voting rights. The scenarios flag what calls for judgement (de facto control under IFRS 10, potential voting rights, structured entities or variable interest entities) and what is not quantified (goodwill, fair value). See [Calculation rules](regles-de-calcul.md#what-the-tool-does-not-represent).

## Other possible topics

With the same building blocks, you can also cover: disclosure of major holdings (3% in the UK, 5% in the US), mandatory offers and creeping control, state holdings and privatisation, family groups and succession, poison pills and staggered boards (in the commentary: the tool does not model them). To create one: [scenario format](format-scenario.md) or [AI skill](ia-et-skill.md).
