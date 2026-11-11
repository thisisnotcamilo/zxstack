"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { checkMessage, GIT_COMMIT } = require("./check-commit-message.js");

const accepted = [
	"feat(server): add active connection tracking\n\n- Track active connections so the dashboard can show live status.\n",
	"feat(api)!: drop the legacy v1 endpoints\n\nCallers moved to v2 last quarter.\n\nBREAKING CHANGE: /v1/* now returns 410.\n",
	"docs: shorten the plugin description and trim the readme",
	"fix: rename the API client after the README rewrite",
	"refactor(skills)!: rename ketchup to recap\n\nBREAKING CHANGE: /zxstack:ketchup is now /zxstack:recap.",
];

const rejected = [
	["ai: document per-tool load path", /type "ai"/],
	["tests: add view and form tests for critical paths", /type "tests"/],
	["wip: half-done routing", /type "wip"/],
	["feat: add the thing.", /period/],
	["feat: Add the thing", /lowercase/],
	["fix: " + "x".repeat(68), /73 characters/],
	["cleanup", /not "type\(scope\)/],
	["feat(api)!: drop v1", /BREAKING CHANGE/],
	["chore: update settings \u2014 bump version", /em dash/],
	["feat: add x\n\nCo-Authored-By: Claude <noreply@anthropic.com>", /Co-Authored-By/],
	["feat: add x\nbody without a blank line", /blank/],
];

test("Given a message in the commit skill's format, when checked, then it passes", () => {
	for (const message of accepted) assert.deepEqual(checkMessage(message), [], message);
});

test("Given a message that breaks one rule, when checked, then the problem names that rule", () => {
	for (const [message, expected] of rejected) {
		const problems = checkMessage(message);
		assert.equal(problems.length, 1, `${message}: ${problems}`);
		assert.match(problems[0], expected);
	}
});

test("Given a Bash command, when it runs git commit in any common form, then the hook triggers", () => {
	for (const command of ["git commit -m x", "cd /r && git commit -F m.txt", "git -C /r commit --amend", 'git add a && git commit -m "$(cat <<\'EOF\'\nx\nEOF\n)"'])
		assert.match(command, GIT_COMMIT, command);
	for (const command of ["git log --oneline", "git commit-tree abc", "echo legit commit"]) assert.doesNotMatch(command, GIT_COMMIT, command);
});

function runHook(cwd, command) {
	const hook = path.join(__dirname, "check-commit-message.js");
	return spawnSync("node", [hook], { input: JSON.stringify({ cwd, tool_input: { command } }), encoding: "utf8" });
}

test("Given a real repository, when Claude commits a bad then a good message, then the hook blocks the first and passes the second", () => {
	const repo = fs.mkdtempSync(path.join(os.tmpdir(), "commit-hook-"));
	const g = (...args) => execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", ...args], { cwd: repo });
	g("init", "-q");
	fs.writeFileSync(path.join(repo, "a"), "1");
	g("add", "a");
	g("commit", "-q", "-m", "tests: Add a.");
	const bad = runHook(repo, "git commit -m 'tests: Add a.'");
	const feedback = JSON.parse(bad.stdout);
	assert.equal(feedback.decision, "block");
	assert.match(feedback.reason, /type "tests"/);
	assert.match(feedback.reason, /git commit --amend/);
	g("commit", "-q", "--amend", "-m", "test: add a");
	assert.equal(runHook(repo, "git commit --amend -m 'test: add a'").stdout, "");
	assert.equal(runHook(repo, "git status").stdout, "");
	fs.rmSync(repo, { recursive: true, force: true });
});
