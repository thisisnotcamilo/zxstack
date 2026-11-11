---
name: commit
description: "Commit format and process: Conventional Commits with a closed type list, scope from the file paths, a 72-character subject, and a body that says why. Use whenever you create, amend, or reword a git commit, write a PR title, or write the body of a squash merge, in any session, with or without eng-mode."
---

# Commit

Every commit in every session follows this skill. The user never has to ask for it.

## Process

1. **Review what changed.**
   - Read the conversation and note what this session changed.
   - Run `git status` and `git diff` to read the changes.
   - Run `git log --oneline -20` to see the scopes and the issue-reference style this repo uses.
   - Decide whether the changes are one commit or several. Keep each commit to one change. Leave out files this session did not change.
2. **Plan the commits.**
   - Group the files that belong together.
   - Take each commit's scope from the paths of its files.
   - Write each message in the format below. Say why the change happened, not only what changed.
3. **Get approval or report, depending on the session.**
   - **Interactive session:** list the files and show the message for each commit, then ask: "I plan to create [N] commit(s) with these changes. Shall I proceed?" Wait for the answer. Ask once for the batch, not once for each commit.
   - **Unattended session:** commit without asking. A session is unattended when it runs without a person watching: a subagent, `-p` mode, a full-autonomy grant, a "don't stop", "going to bed", or "run until done" override, or an eng-mode Autonomous run, unattended Hillclimb, or Pause safely. List every commit (short SHA and subject) in the final report.
4. **Commit.**
   - Name each file in `git add`. Never use `git add -A` or `git add .`.
   - Create the commits with the planned messages. Pass a multi-line message with a heredoc or `-F <file>`, so the blank line after the subject survives.
   - Show the result with `git log --oneline -n [N]`.

## Format

Follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/), with these specifics:

- **Type.** Exactly one of `feat`, `fix`, `build`, `chore`, `ci`, `docs`, `perf`, `refactor`, `revert`, `style`, `test`. Never invent a type. Never copy a bare area prefix from `git log`: a docs change under `ai/` is `docs(ai):`, not `ai:`, and a test change is `test:`, not `tests:`.
- **Scope.** A short noun for the area, taken from the common parent directory of the files in the commit (`ai`, `install`, `eng-mode`). Use scopes when the repo's `git log` uses them, and leave them out when it does not. When one commit spans several areas, consider splitting it before you drop the scope.
- **Description.** Imperative mood, lowercase after the colon, no trailing period. Keep the whole subject line within 72 characters. Name a real symbol when one carries the change.
- **Body.** A blank line after the subject, then why you made the change, what changed, and its impact. Write a body whenever the subject alone does not explain the reason. Do not restate the subject. Write it with [the **technical-writing** skill](../technical-writing/SKILL.md) (every layer except Diátaxis).
- **Breaking changes.** Use both `!` before the colon and a `BREAKING CHANGE: <what breaks, and what to do about it>` footer in its own block.
- **Issues.** Match what `git log` shows. Put the issue at the end of the subject (`... (OD-35)`) or in a footer (`Closes #123`). Linear links any issue ID in the message, and an ID in the subject counts against the 72 characters. GitHub closes the issue on merge when you use the footer. Use the footer when the repo shows no precedent.
- **Never** an em dash, and never a `Co-Authored-By` trailer or any other line that credits an agent.

### Examples

```
feat(server): add active connection tracking

- Track active connections so the dashboard can show live status.
- Uses the existing connection pool; no new dependencies.
```

```
feat(api)!: drop the legacy v1 endpoints

Callers moved to v2 last quarter, so the shim now only adds latency.

BREAKING CHANGE: /v1/* now returns 410. Point clients at /v2/*, which
accepts the same payloads.
```

## Unfinished work

A checkpoint commit, such as one from Pause safely, uses the type and scope of the work it holds, never `wip:`. Its body opens with `Work in progress:` and the state of the work, and says so in one line if the tree is broken. Amend or fold it in when work resumes, so it never reaches the main branch as is.

## PR titles and squash merges

A squash merge turns the PR title into the commit subject on the main branch. Write every PR title as a commit subject in the format above, 72 characters included.

## The check

The zxstack plugin runs `hooks/check-commit-message.js` after each Bash call that runs `git commit`. It checks the newest commit's message against the mechanical rules above. When it reports a problem, fix the message with `git commit --amend` and keep the content. It cannot judge the scope choice or the body, so those stay your job.
