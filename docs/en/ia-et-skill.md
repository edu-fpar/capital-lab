# Prepare your lesson with an AI

Two options: any AI with the instructions page, or Claude with the skill, which also checks the figures.

## 1. With any AI

<div class="ai-box">
<ol class="ai-steps">
<li><strong>Copy the request.</strong> It already contains the link to the instructions for the AI. The text can be edited: adjust the law (UK or US), the audience or the number of steps before copying.
<div class="ai-prompt js-ia-prompt" contenteditable="true" spellcheck="false" title="Editable text">Read the instructions at <span>https://edu-fpar.github.io/capital-lab/docs/en/instructions-ia.md</span> and prepare a Capital Lab scenario (UK law) from the course below (or the attached file). Audience: undergraduate company law students, about 6 steps, with one or two questions for the class.</div>
<button class="ai-btn big" data-copy-sel=".js-ia-prompt">📋 Copy the request</button></li>
<li><strong>Paste it into your AI</strong> (ChatGPT, Claude, Gemini, Mistral, Copilot…), then add your course material: text pasted after it, or an attached file.</li>
<li><strong>Copy the AI's answer</strong> and paste it into the <a href="../index.html?lang=en&scenarios" target="_blank" rel="noopener">workshop</a>: 🎬 Cinema → 📚 Scenarios → Play. You can paste the whole answer.</li>
</ol>
<details class="ai-more"><summary>Your AI cannot open links?</summary>
<p>Copy the full version instead: the instructions and the request combined in a single text. Paste it into your AI, then add your course material.</p>
<button class="ai-btn warn" data-copy-full="en/instructions-ia.md">📄 Copy the full version</button> <a class="ai-link" href="instructions-ia.md" target="_blank" rel="noopener">see the instructions</a>
</details>
<p class="ai-note">💡 Using Claude? The <a href="#/en/ia-et-skill">Capital Lab skill</a> also checks every figure with the workshop's engine.</p>
</div>

For a course on US law, replace "(UK law)" with "(US law)" in the request. The AI then starts the scenario with the header `droit: us`, and the workshop switches to US thresholds when it plays it.

A general-purpose AI cannot run the workshop's engine: **check the figures** in the commentary against what the workshop displays (click an entity to see its analysis). Syntax warnings are shown under the commentary.

AIs that browse a website can also start from the [`llms.txt`](https://edu-fpar.github.io/capital-lab/llms.txt ':ignore') file, which points to the useful pages.

## 2. With Claude: the "scenario-capital-lab" skill (recommended)

A *skill* is a set of instructions that Claude loads automatically when a request relates to it. This one teaches Claude to:
1. read your **course material** (PDF, slides, handout, case study);
2. keep the notions that the tool can **represent**, and leave aside, telling you so, those it cannot show properly;
3. write a progressive scenario that reuses **your examples and figures**;
4. **replay it with the workshop's real engine** to check that the control and percentages stated in the commentary match what will be displayed;
5. deliver the `.md` file, with a list of what you should review (legal references it added, simplifications).

References to statutory sections, rules or standards are added only if they appear in your material or are certain; simplifications are flagged in the scenario.

> ⚠️ The skill's own instructions and reference files are written in French. Claude handles this without difficulty: ask in English, state the law (UK or US), and it will write the scenario in English with the right header.

### Installing the skill

The file to install is [`skill/scenario-capital-lab.skill`](../../skill/scenario-capital-lab.skill ':ignore'). It is an archive of the `skill/scenario-capital-lab/` folder.

- **Claude (web or desktop app)**: in the settings, *Skills* section, import this file. Code execution must be allowed for the check to work.
- **Claude Code**: copy the `skill/scenario-capital-lab/` folder into `~/.claude/skills/` (for yourself) or into a project's `.claude/skills/`.

The check uses Node.js. If the environment does not have it, Claude redoes the calculations by hand and tells you so.

### Using it

Attach your material and ask, for example:

> Here is my chapter on groups of companies. Make me a Capital Lab scenario under UK law to go through the case study in class, in about 6 steps.

> From these slides on Delaware anti-takeover rules, prepare a step-by-step animation (US law) for my second-year students.

You receive a `.md` file to open in the workshop: 🎬 Cinema mode → 📚 Scenarios → open the file, or drop the file onto the window.

**A real example** (in French): from this [course handout on groups of companies](../exemples-ia/support-cours-groupes.md), the skill produced this [Vallon group scenario](../exemples-ia/scenario-groupe-vallon.md), checked without errors by the engine.

### Contents of the skill

| File | Role |
|---|---|
| `SKILL.md` | the method: read, choose, build, check, deliver |
| `references/format.md` | the scenario syntax |
| `references/regles-de-calcul.md` | what the engine computes and what it does not represent |
| `references/exemple.md` | a model scenario (the holding pyramid) |
| `scripts/verifier.js` | replays a scenario with the engine and shows the results step by step |
| `scripts/lib/` | a copy of the workshop's engine |

The checker can also be used without any AI, to check a scenario written by hand:

```bash
node skill/scenario-capital-lab/scripts/verifier.js my-scenario.md
```
