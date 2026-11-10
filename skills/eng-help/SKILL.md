---
name: eng-help
description: Guides users through zxstack setup, /zxstack:eng-mode, and picking the skill, playbook, or principle for a task. Type /zxstack:eng-help with a question.
disable-model-invocation: true
---

# Eng help

Answer the user's question about zxstack, hand them a prompt they can send, and link the file the answer came from. For a help question, don't start the work. The user asked how, and a zxstack run spends real tokens, so let them send the prompt.

A message that asks for work, such as "use zxstack to fix this bug", is not a help question. Read [`eng-mode`](../eng-mode/SKILL.md) and do the work under it.

This file maps questions to the skills and the README that hold the answers. Those files own the details. Read the file you route to before you quote it, and trust it when it disagrees with this map. The links here point into the installed plugin, which the user may not be able to open, so give the user the file's public copy: `https://github.com/thisisnotcamilo/zxstack/blob/main/` followed by its path.

## Find out what they need

Infer the need from the message and the conversation. A named situation, such as "which skill reviews a PR?", goes straight to its section. If the need is still unclear, ask one multiple-choice question with these options, then answer only the section they pick:

- Get set up
- Start a task with `/zxstack:eng-mode`
- Pick a skill for a situation
- Fix a run that went wrong
- Make zxstack my own

Check the state that changes the answer, and mention it only when it does:

- No `~/.claude/rules/zxstack-models.md` means `/zxstack:setup-zxstack` hasn't run for this user, so every role uses its default model.
- No `verify-*` skill or other app harness in the project means agents have no scripted way to drive the app. Mention `/zxstack:create-verification-skill` when the question is about proving a change works.
- No formal verification skill in the project means no property is checked past what tests reach. Mention `/zxstack:create-formal-verification-skill` when the question is about a race, an invariant, or another case tests rarely hit. When one exists and the code it covers changed after the commit it records as last in sync, mention `/zxstack:maintain-formal-verification-skill` if the question touches that code.

When the model rule is missing and it matters, ask whether the user wants to pick a model for each role and a reasoning budget now. It matters when the user is new, the question is about setup or cost, or the answer depends on which models run. Ask at most once per chat. If the need is also unclear, ask both questions together. Offer two choices:

- Now: give them `/zxstack:setup-zxstack` to type, and answer their question too.
- Later: answer their question, and add one line saying every role keeps its default model until they run `/zxstack:setup-zxstack`.

## Get set up

1. Install from a terminal with `claude plugin marketplace add thisisnotcamilo/zxstack`, then `claude plugin install zxstack@zxstack`. Inside a session, run the same commands through `/plugin`: `/plugin marketplace add thisisnotcamilo/zxstack`, then `/plugin install zxstack@zxstack`.
2. Run [`/zxstack:setup-zxstack`](../setup-zxstack/SKILL.md). It asks for a reasoning budget, maps a model to each role, and writes a rule file. The rule applies to new sessions. Then it offers once each to generate a verification skill and a formal verification skill for the project, unless the project already has one.
3. Start a real task with `/zxstack:eng-mode`, a goal, and a check that can pass or fail.

Installing changes nothing until the user invokes a skill. Only `/zxstack:setup-zxstack` loads from the user's words. The [README](../../README.md) has the details. Offer to word their first prompt with them, per [`references/prompting.md`](references/prompting.md).

If cost is the worry, say where the tokens go and how to spend fewer. zxstack spends extra tokens on subagents and review panels. Rerun `/zxstack:setup-zxstack` and pick a smaller budget or cheaper models. A role set to `inherit-parent` runs on the session's model, which saves tokens when the session runs on a cheaper model. A shorter panel list runs fewer subagents, one for each entry. Save `/zxstack:eng-mode` for work that needs rigor.

## Start a task with `/zxstack:eng-mode`

`/zxstack:eng-mode` matches the task to a playbook, copies the playbook's steps into the todo list, and runs the other skills as the steps need them. A step it skips stays in the list as `skip: <reason>`. A good prompt states the goal and how to tell it's done. It doesn't list skills, because a hand-written sequence tends to drop or reorder steps the playbook would keep. Read [`references/prompting.md`](references/prompting.md) before you help word one. The [README](../../README.md) has examples.

Typing `/zxstack:eng-mode` loads the skill into the conversation for the task at hand. It fades as the chat moves on, so start each new task with `/zxstack:eng-mode`. Mid-chat, "new task" makes the mode match a fresh playbook. `/zxstack:eng-mode` already uses `zxstack:eng-agent` for the subagents its playbook steps spawn. To get the same style from a subagent of your own, spawn it with `subagent_type: "zxstack:eng-agent"`.

## Pick a skill

The default answer is `/zxstack:eng-mode`, which runs most of the others when its steps need them. Name a skill directly when the user wants more or less of something than the playbook gives. Read the skill before you recommend it, and give one example prompt.

| The user wants to | Skill |
|---|---|
| Do any non-trivial task with rigor | [`/zxstack:eng-mode`](../eng-mode/SKILL.md) |
| Check that the agent understood their goal and the problem before it starts | [`/zxstack:in-your-own-words`](../in-your-own-words/SKILL.md) |
| Get a prompt rewritten deeper, not bigger, before sending it: what a top professional would add, their raw material and methods, and an outside check. It returns the prompt and doesn't do the task | [`/zxstack:sharpen`](../sharpen/SKILL.md) |
| Know how code works now, or where new code should live | [`/zxstack:how`](../how/SKILL.md) |
| Know why code is shaped this way, or where a number came from | [`/zxstack:why`](../why/SKILL.md) |
| Understand a change or subsystem, explained plainly | [`/zxstack:teach`](../teach/SKILL.md) |
| Catch up on their own recent work on a topic | [`/zxstack:recall`](../recall/SKILL.md) |
| Catch up on what changed in this chat since their last message, in plain words and small visuals, with every item waiting on them listed and decidable from the reply alone | [`/zxstack:ketchup`](../ketchup/SKILL.md) |
| Know what a small diff could break outside itself | [`/zxstack:blast-radius`](../blast-radius/SKILL.md) |
| Settle types and module shape before code that crosses a function boundary | [`/zxstack:architect`](../architect/SKILL.md) |
| Get several attempts at one brief, merged into the best one | [`/zxstack:arena`](../arena/SKILL.md) |
| Run parallel checks over slices, or race workers, as worktree agents | [`/zxstack:swarm`](../swarm/SKILL.md) |
| Have different models review a diff and try to break it | [`/zxstack:interrogate`](../interrogate/SKILL.md) |
| Fix a bug test-first when a cheap local test exists | [`/zxstack:tdd`](../tdd/SKILL.md) |
| Apply TypeScript rules to `.ts` or `.tsx` work | [`/zxstack:typescript-best-practices`](../typescript-best-practices/SKILL.md) |
| Strip comments before review, using a reviewer that didn't write them | [`/zxstack:no-comments`](../no-comments/SKILL.md) |
| Clean AI tells out of prose | [`/zxstack:unslop`](../unslop/SKILL.md) |
| Write docs, an RFC, a README, a PR description, or a commit message to a standard | [`/zxstack:technical-writing`](../technical-writing/SKILL.md) |
| Hear the last reply again in plain words | [`/zxstack:bro`](../bro/SKILL.md) |
| Give agents a scripted way to drive the app and prove behavior | [`/zxstack:create-verification-skill`](../create-verification-skill/SKILL.md) |
| Bring a verification skill and its feature map back in line with the app | [`/zxstack:maintain-verification-skill`](../maintain-verification-skill/SKILL.md) |
| Formally verify a race, invariant, or other property that tests rarely reach | [`/zxstack:create-formal-verification-skill`](../create-formal-verification-skill/SKILL.md) |
| Bring a formal verification back in line after the code it covers changed, and learn whether a failure is drift or a bug | [`/zxstack:maintain-formal-verification-skill`](../maintain-formal-verification-skill/SKILL.md) |
| Show a PM or designer what the user sees as a chart checked by a TLA+ model, with the shortest path to each state that breaks a rule | [`/zxstack:statechart`](../statechart/SKILL.md) |
| Vet a performance number before reporting or acting on it | [`/zxstack:benchmark-checklist`](../benchmark-checklist/SKILL.md) |
| Run a large or cross-cutting change, or one to review after stepping away | [`/zxstack:figure-it-out`](../figure-it-out/SKILL.md) |
| Keep a decision log during a run, and review it afterward | [`/zxstack:show-me-your-work`](../show-me-your-work/SKILL.md) |
| Pick a model for each role and a reasoning budget | [`/zxstack:setup-zxstack`](../setup-zxstack/SKILL.md) |
| Turn their own working habits into a personal mode skill | [`/zxstack:automate-me`](../automate-me/SKILL.md) |
| Turn what a finished task taught into skill edits | [`/zxstack:reflect`](../reflect/SKILL.md) |
| Stop agents from repeating the same mistakes in this repo | [`/zxstack:correct`](../correct/SKILL.md) |
| Find their way around zxstack | `/zxstack:eng-help` |

If a skill directory next to this one is missing from the table, read its frontmatter and route by its description. The `principle-*` directories are covered under principles below.

Close calls:

- `/zxstack:how` explains what the code does. `/zxstack:why` explains the reasons. `/zxstack:teach` runs one or both and explains the result plainly.
- `/zxstack:arena` gives every worker the same brief and merges the best parts. `/zxstack:swarm` splits work into slices or a race and returns one report.
- `/zxstack:architect` implements right after it settles the design. Add "with checkpoint" to review the design before it writes code.
- `/zxstack:interrogate` reviews the diff. `/zxstack:blast-radius` looks for breakage outside the diff and proves the one fact that makes the change safe.
- `/zxstack:recall` rebuilds context across recent chats. `/zxstack:ketchup` covers only this chat since the user's last message. Resuming one specific chat or branch is the Session pickup playbook.
- `/zxstack:figure-it-out` designs one rigorous run. The Autonomous run playbook drives one task to a finish condition.

Not in zxstack:

- `/deslop`, `control-cli`, and `control-ui` ship in other plugins. Route to them only when they are installed.

## Playbooks and principles

Playbooks are step lists inside `/zxstack:eng-mode`, not skills, so they have no slash command. Inside `/zxstack:eng-mode`, describing the task picks one, and these phrases name one directly:

- "babysit this pr" or "check on pr 123" runs Babysit. It drives the PR to merge-ready and stops there. It doesn't merge unless the user asks to merge, land, or ship.
- "land the stack" runs Shipping.
- "take over this branch" runs Session pickup.
- "pause safely" runs Pause safely.
- "run the eval playbook" runs Eval.

The Playbooks section of [`eng-mode`](../eng-mode/SKILL.md) lists every playbook and when it applies. The [Babysit](../eng-mode/playbooks/babysit.md), [Opening a PR](../eng-mode/playbooks/opening-a-pr.md), and [Shipping](../eng-mode/playbooks/shipping.md) playbooks cover opening, babysitting, and landing a PR.

zxstack has no planning skill. Claude Code's plan mode works alongside it. For work that spans phases or stacked PRs, asking `/zxstack:eng-mode` for a plan runs the [Multi-phase plan playbook](../eng-mode/playbooks/multi-phase-plan.md), which writes the plan and doesn't implement it. For a design question, the Prototype playbook or `/zxstack:architect` settles it in code first.

Principles are one-rule skills that `/zxstack:eng-mode` reads and cites in its replies. The user rarely invokes one. They steer with the names instead, as in "apply prove it works. show me the real output." Typing `/zxstack:principle-<name>` still loads one on demand. The Principles section of [`eng-mode`](../eng-mode/SKILL.md) lists them.

## Fix a run that went wrong

| Symptom | Fix |
|---|---|
| The mode stopped applying after a few turns | Start each task with `/zxstack:eng-mode`. |
| A question got treated as the next step of the last task | Say "new task", or say the turn doesn't need the mode. |
| A new model choice had no effect | The rule from `/zxstack:setup-zxstack` applies to new sessions. Start one. |
| Runs cost more than expected | See the cost paragraph under Get set up. |
| A skill didn't load on its own | Only `/zxstack:setup-zxstack` loads from the user's words. The others load when the user types them or when `/zxstack:eng-mode` runs them, and it doesn't run every skill. |
| Parallel agents overwrote each other | Give each agent its own worktree, as worktree agents (`isolation: "worktree"`) get. |
| An overnight run moved but finished nothing | `/loop` needs a check that can pass or fail, not a duration. See the Before stepping away section of [`references/prompting.md`](references/prompting.md). |
| The reply claims success from a green build | Ask for the real command, flow, stored value, or profile. That's the prove-it-works principle. |

For a run that drifts, [`references/prompting.md`](references/prompting.md) has one-line steers. [`references/recipes.md`](references/recipes.md) has the recipes worth copying.

## Make zxstack my own

- [`/zxstack:automate-me`](../automate-me/SKILL.md) drafts a personal mode skill from the user's own history, to use alongside `/zxstack:eng-mode`.
- [`/zxstack:reflect`](../reflect/SKILL.md) after a session turns its lessons into skill edits the user approves.
- `/zxstack:eng-mode write a skill for <workflow>` runs the authoring playbook. The eval playbook tests a skill change blind.
- Put a personal or project skill at `~/.claude/skills/<name>/SKILL.md` or `.claude/skills/<name>/SKILL.md`. Put standing rules in `CLAUDE.md`, or `AGENTS.md` when no `CLAUDE.md` exists.
- To change a zxstack skill itself, edit a fork of the plugin, not the installed copy under `~/.claude/plugins/cache/zxstack/zxstack/<version>/`, which an update overwrites.
- Fix a misbehaving skill in its own PR, not inside the feature work where it went wrong.

The [README](../../README.md) covers each of these.

## Reply

Lead with the answer. Give at most one example prompt in a code block, adapted from [`references/recipes.md`](references/recipes.md) when one fits, then the link to that file. Keep it short unless the user asked for the whole map.
