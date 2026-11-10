# Upstream

zxstack was forked from pstack 0.15.36, which ships in `harness/pstack/claude-code/` of [cursor/plugins](https://github.com/cursor/plugins) at commit `c742dd61706fbacc1b95f1a20b7b988cf096ce6c`.

Upstream changes are ported by hand. zxstack renamed the plugin, rewrote Cursor terms into Claude Code terms, and dropped some files, so an upstream patch does not apply as is.

## Port a fix

1. Clone or update upstream, and list what changed since the last port:

   ```sh
   git clone https://github.com/cursor/plugins.git /tmp/upstream-plugins
   cd /tmp/upstream-plugins
   git log --oneline c742dd6..origin/main -- pstack/skills pstack/agents
   git diff c742dd6..origin/main -- pstack/skills pstack/agents
   ```

   Read the diffs in `pstack/`, which is the source. `harness/` is generated from it.

2. Skip changes to files zxstack does not have: `make-bot-ui`, `ketchup-video`, the Orchestrate, Autopilot-full, and Autopilot-stack playbooks, `references/bugbot-triage.md`, `docs/`, and `automations/`.

3. Apply each change you want by hand to the matching zxstack file. The renames are: `poteto-mode` to `eng-mode`, `poteto-agent` to `eng-agent`, `poteto-help` to `eng-help`, `setup-pstack` to `setup-zxstack`, and `pstack-models.mdc` to `~/.claude/rules/zxstack-models.md`. Write Claude Code terms directly. For example, `Task` becomes `Agent`, and `claude-opus-5-5-xhigh` becomes `opus xhigh`.

4. Run the checks in the README's Contributing section, bump the version, and update the commit SHA at the top of this file to the upstream commit you ported up to.
