---
name: setup-zxstack
description: Configure which models zxstack uses per role and at what reasoning budget. Detects your available models and writes a rule file that Claude Code loads into every session and that overrides the skill defaults. Use for /setup-zxstack, "configure zxstack models", "zxstack budget", or changing zxstack's model choices.
---

# Setup zxstack

Write `~/.claude/rules/zxstack-models.md`, a rule file that sets zxstack's model per role. Claude Code loads every `.md` file in `~/.claude/rules/` into each new session.

## Steps

### 1. Detect available models

The available models are the `model` values the `Agent` tool schema lists (`opus`, `sonnet`, `haiku`, `fable`), each with an effort from the schema's `effort` values (`low`, `medium`, `high`, `xhigh`, `max`). That schema is the dependable source. Write a real model as `<model> <effort>`, such as `opus xhigh`. Never write a model you have not confirmed is in the schema. The alias `inherit-parent` is always valid even though it is not a detected model.

### 2. Load current state

The default role-to-model mapping is the rule shape shown in step 5 below. If `~/.claude/rules/zxstack-models.md` already exists, read it and treat its `# budget` line and its role values as the current choices. Otherwise start from those defaults. A line whose role is not in step 5, such as `how critics`, is from a retired role. Drop it.

### 3. Budget, map, and confirm

**(a) Ask for a budget.** Prefer `AskUserQuestion` over free text (in `-p` mode it is absent, so ask in plain text). Offer these four options with these exact labels, and name the current budget when the rule records one. With no rule, say that `large` matches the skill defaults.

- `unlimited - max reasoning`
- `large - xhigh reasoning`
- `medium - high reasoning`
- `small - medium reasoning`

**(b) Apply it.** Build the working table from the skill defaults, and on a re-run keep any role you changed by model, list, or alias (`inherit-parent`). `unlimited`, `large`, `medium`, and `small` set the effort of every real model, panel entries included, to `max`, `xhigh`, `high`, or `medium`. The effort is the last token, on the ladder `max` > `xhigh` > `high` > `medium` > `low`. If the result is not in the detected set, use the same model's detected effort that is highest at or below the target, else mark the role as needing a choice. `inherit-parent` does not change. So `unlimited` turns `opus xhigh` into `opus max`, `large` keeps the defaults, and `small` turns `opus xhigh` into `opus medium`.

**(c) Show the roles and confirm.** Show every role with its model, marking any real model not in the detected set as needing a choice. Also list each line step 2 dropped. Ask whether to accept as-is or change specific roles, offering the detected models plus `inherit-parent` (this role runs on the parent session model) as the options. Prefer `AskUserQuestion` over free text. For panel roles (arena runners, architect runners, interrogate reviewers) the value is a list, and one subagent runs per entry, alias entries included, so the list length sets the count. `arena cross-judge pool` is also a list, but Arena runs one judge. It tries only values from a model other than the parent's, in list order, so order it by preference. An `inherit-parent` value never judges. `swarm workers` is the default model for every worker unless a race or comparison assigns another model per arm.

### 4. Validate

Every real model written must be in the detected set. `inherit-parent` always passes. If a chosen real model is not available, stop and ask again.

### 5. Write the rule

Write `~/.claude/rules/zxstack-models.md` with no frontmatter: the comment lines, a `# budget` line with the chosen label and its target effort, and one line per role, using the same labels eng-mode uses. Overwrite the whole file so re-runs stay idempotent. Never put the role lines in `CLAUDE.md` or `AGENTS.md`. Shape:

```
# zxstack model configuration. One line per role. Delete a line to fall back to the skill default.
# `inherit-parent` as a value: the role runs on the parent session model (omit Agent `model`). Alias entries in a panel list still count toward its fan-out.
# budget: large (xhigh)
feature, refactoring: inherit-parent
bug-fix: inherit-parent
perf-issue: inherit-parent
hillclimb: inherit-parent
judgment and prose: opus xhigh
hardest tasks: opus xhigh
how explorer: inherit-parent
how explainer: opus xhigh
why investigators: inherit-parent
why synthesizer: opus xhigh
reflect tooling: inherit-parent
reflect judgment, divergent, synthesizer: opus xhigh
arena runners: opus xhigh, inherit-parent
arena cross-judge pool: opus xhigh, sonnet xhigh
swarm workers: inherit-parent
architect runners: opus xhigh, inherit-parent
interrogate reviewers: opus xhigh, inherit-parent
```

### 6. Confirm

Tell the user the rule was written and that it applies to new sessions. Re-running this skill updates it.

### 7. Offer a verification skill (optional)

Check whether the project has a way to drive the real app for proof (a `verify-*` skill, or an existing harness). If not, offer once: "want a project-local verification skill, so agents can drive the app the way a user does and prove changes work? I can generate one with /zxstack:create-verification-skill." On yes, read [the **create-verification-skill** skill](../create-verification-skill/SKILL.md) and follow it. On no, move on without pushing.

### 8. Offer a formal verification skill (optional)

Check whether the project already has a formal verification skill (a project skill that runs a model checker, a proof, or another verifier against the code). If not, offer once: "want a formal verification skill, so agents can prove a key property of your code holds in every case in scope, not only the cases tests reach? I can generate one with /zxstack:create-formal-verification-skill." On yes, read [the **create-formal-verification-skill** skill](../create-formal-verification-skill/SKILL.md) and follow it. On no, move on without pushing.
