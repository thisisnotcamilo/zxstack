# zxstack

zxstack is a Claude Code plugin of agent workflows for careful engineering work. `/zxstack:eng-mode` sets the working style: it states the goal first, routes the task to a playbook, writes plain prose, and verifies the work before it reports done. The other skills cover design, review, explanation, parallel subagents, and writing. eng-mode routes to them, and you can also run them directly.

## Install

```sh
claude plugin marketplace add thisisnotcamilo/zxstack
claude plugin install zxstack@zxstack
```

Inside a session, `/plugin` runs the same steps. Then run `/zxstack:setup-zxstack` once. It writes `~/.claude/rules/zxstack-models.md`, which picks the model and reasoning effort for each subagent role.

## Commands

Every skill is a command named `/zxstack:<skill>`.

| Area | Skills |
| --- | --- |
| Working mode | `eng-mode`, `eng-help`, `setup-zxstack` |
| Understand | `how`, `why`, `teach`, `recall`, `recap`, `bro`, `in-your-own-words` |
| Design | `architect`, `arena`, `interrogate`, `figure-it-out`, `sharpen`, `statechart` |
| Build and verify | `tdd`, `swarm`, `blast-radius`, `benchmark-checklist`, `show-me-your-work`, `create-verification-skill`, `maintain-verification-skill`, `create-formal-verification-skill`, `maintain-formal-verification-skill`, `typescript-best-practices` |
| Clean and learn | `no-comments`, `unslop`, `technical-writing`, `reflect`, `correct`, `automate-me` |
| Principles | 24 `principle-*` skills. eng-mode indexes them, and each one says when it applies. |

The plugin also ships two agents. `zxstack:eng-agent` is the delegate that eng-mode spawns for code-writing steps. `zxstack:comment-sicko` is the comment reviewer that `no-comments` spawns.

## Contributing

The repository is the plugin. The `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` files sit at the root, and there is no build step.

To add a skill:

1. Create `skills/<name>/SKILL.md`. The folder name and the frontmatter `name` must match: lowercase words joined by hyphens, at most 64 characters. Write a `description` that says when to use the skill. Set `disable-model-invocation: true` for a skill that should run only when typed or routed to.
2. Route to other skills by linking them, as in `[the **how** skill](../how/SKILL.md)`. The agent reads the linked file. To tell the user what to type, write `/zxstack:<name>`.
3. If eng-mode should trigger the skill, add it to the Non-negotiables or Playbooks section of `skills/eng-mode/SKILL.md`. Also add a row to `skills/eng-help/SKILL.md` and to the Commands table above.

To change a skill, edit its folder in place. A playbook is a file in `skills/eng-mode/playbooks/`, and eng-mode's Playbooks section lists it.

Before you commit:

```sh
claude plugin validate .
(cd skills/eng-mode/scripts && bun install --frozen-lockfile && bun test watch-pr check-plan.test.ts)
(cd skills/statechart/scripts && npm install --no-save fast-check@4.5.3 && npm test)
rg -i 'pstack|poteto' --glob '!README.md' --glob '!LICENSE' --glob '!UPSTREAM.md'
```

The last command must print nothing. Then bump `version` in `.claude-plugin/plugin.json`. Installed copies update only when the version changes. To try local changes before you push, start Claude Code with `claude --plugin-dir /path/to/zxstack`.

## Upstream

zxstack does not sync with upstream automatically. [UPSTREAM.md](UPSTREAM.md) records the commit it was forked from and how to port a fix by hand.

## Credits

zxstack is a fork of [pstack](https://github.com/cursor/plugins/tree/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack) by Lauren Tan, taken from version 0.15.36 at commit `c742dd6` of [cursor/plugins](https://github.com/cursor/plugins). It is used under the MIT License, and the original copyright notice stays in [LICENSE](LICENSE). The fork renames the plugin, rewrites the skills for Claude Code only, and drops the skills and playbooks that only work in Cursor.
