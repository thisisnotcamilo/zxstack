# Prompts worth copying

Swap in the real paths, skills, and done checks. Informal wording works.

## Understand

- `/zxstack:eng-mode read <thread>. restate the underlying issue in your own words, in plain english.`
- `/zxstack:in-your-own-words <long or messy ask>`
- `/zxstack:sharpen <the prompt you're about to send>`
- `/zxstack:eng-mode investigate why <symptom>. give me what we know, what data you used, and your best hypotheses. don't change any code yet.`
- `use /zxstack:how to understand <subsystem>. then use /zxstack:why to find out why it broke recently.`
- `/zxstack:recall my work on <topic> from last week, then read <issue>.`
- `/zxstack:teach me why you implemented it this way and not <other way>. what did you trade off?`
- `/zxstack:eng-mode take over this branch. read the decision log, find what's done, and continue. don't redo finished work.`

## Build

- Bug: `/zxstack:eng-mode <symptom>. repro first, then fix and verify.`
- Bug in an app: `/zxstack:eng-mode repro this with /verify-<app>. if it repros on main, fix it and show me a video as proof.`
- Bug with a cheap test: `/zxstack:eng-mode repro <bug> first. if there's a cheap test path, /zxstack:tdd it. then fix and rerun.`
- Feature: `/zxstack:eng-mode add <behavior>. <current output> stays byte-identical. verify both.`
- Refactor: `/zxstack:eng-mode move <code> into one module, zero behavior change. record the current output first and prove it's unchanged after.`
- Perf: `/zxstack:eng-mode <operation> takes <time> on <fixture>. trace it, fix the measured cause, show me before and after.`

## Design and plan

- `/zxstack:eng-mode prototype a few options for <feature>. take screenshots or videos for me to compare.`
- `/zxstack:eng-mode we need <feature>. /zxstack:architect it first, and answer open questions with prototypes. let me review before proceeding.`
- `/zxstack:eng-mode write a tutorial for how i would use <new package> first. then /zxstack:teach me why it beats the current one.`
- `ask /zxstack:arena for a second opinion on this thread and our approach.`
- `/zxstack:eng-mode turn this design into a plan. small verifiable PRs, each with its own verification steps.`
- `/zxstack:eng-mode plan the migration of <library> to <target>. small verifiable PRs. the result must match the original exactly, bugs included.`

## Review and ship

- `/zxstack:interrogate the whole branch, but skeptically. don't change anything yet. no nitpicks unless it's a real bug or regression.` Read the Dropped list too.
- `/zxstack:create-formal-verification-skill prove <property> holds in <module>, even when <steps> interleave or retry.` After merges or refactors in that code: `/zxstack:maintain-formal-verification-skill`.
- `/zxstack:swarm check every package under <dir> against its check script. one worker per package. one report.`
- `/zxstack:eng-mode open the pr. small ordered commits, evidence in the description.`
- `/zxstack:eng-mode babysit this pr. get it green.` For status only: `/zxstack:eng-mode check on pr <number>. anything outstanding?`
- `/zxstack:eng-mode land the stack.`

## Away and back

- `/zxstack:eng-mode im going to bed. <goal> in a fresh worktree off <base>. done means <checks>. keep a decision log. don't ask me before committing. /loop until done. if you're truly stuck after a few hours, stop and write up why.`
- `/zxstack:show-me-your-work catch me up on what you did last night.` Read its Attention section first.
- `/zxstack:ketchup` catches you up on this chat since your last message and lists every call that waits on you.
- `/zxstack:reflect capture what we learned so the next run doesn't repeat it.` Approve only edits that change a future decision.
- `/zxstack:bro` restates the last reply in plain words.
