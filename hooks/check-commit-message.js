#!/usr/bin/env node
// PostToolUse hook: after a Bash call that ran `git commit`, check the newest commit message
// against the commit skill's mechanical rules and hand any problems back to Claude to amend.
"use strict";
const { execFileSync } = require("node:child_process");

const TYPES = ["feat", "fix", "build", "chore", "ci", "docs", "perf", "refactor", "revert", "style", "test"];
const SUBJECT = /^(?<type>[a-z]+)(?:\((?<scope>[^()\s]+)\))?(?<bang>!)?: (?<description>\S.*)$/;
const GIT_COMMIT = /(?:^|[;&|(]\s*|\s)git(?:\s+-[Cc]\s+\S+)*\s+commit(?=\s|$)/;
// git writes these subjects for autosquash, and they are meant to disappear in a rebase.
const AUTOSQUASH = /^(?:fixup|squash|amend)! /;
const RECENT_SECONDS = 300;

function checkMessage(message) {
	const lines = message.replace(/\s+$/, "").split("\n");
	const subject = lines[0];
	const problems = [];
	const match = SUBJECT.exec(subject);
	if (!match) {
		problems.push(`subject is not "type(scope): description" or "type: description": "${subject}"`);
	} else {
		const { type, bang, description } = match.groups;
		if (!TYPES.includes(type)) problems.push(`type "${type}" is not one of ${TYPES.join(", ")}`);
		// An all-caps first word is an acronym or identifier (API, README), not a capitalized sentence.
		if (/^[A-Z][a-z]/.test(description)) problems.push("description must start lowercase");
		if (description.endsWith(".")) problems.push("description must not end with a period");
		if (bang && !/^BREAKING CHANGE: \S/m.test(message)) problems.push('"!" needs a "BREAKING CHANGE: ..." footer');
	}
	if (subject.length > 72) problems.push(`subject is ${subject.length} characters, the limit is 72`);
	if (lines.length > 1 && lines[1].trim() !== "") problems.push("the line after the subject must be blank");
	if (message.includes("\u2014")) problems.push("message contains an em dash, use a plain dash");
	if (/^co-authored-by:/im.test(message)) problems.push("message contains a Co-Authored-By trailer");
	return problems;
}

function git(cwd, args) {
	return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
}

function newestCommitToCheck(cwd, nowSeconds) {
	try {
		if (!git(cwd, ["reflog", "-1", "--format=%gs"]).startsWith("commit")) return null;
		const [committed, parents] = git(cwd, ["log", "-1", "--format=%ct%n%p"]).split("\n");
		if (nowSeconds - Number(committed) > RECENT_SECONDS) return null;
		if (parents.trim().split(" ").length > 1) return null;
		const message = git(cwd, ["log", "-1", "--format=%B"]);
		return AUTOSQUASH.test(message) ? null : message;
	} catch {
		return null;
	}
}

function main() {
	let input = "";
	process.stdin.on("data", (chunk) => (input += chunk));
	process.stdin.on("end", () => {
		let event;
		try {
			event = JSON.parse(input);
		} catch {
			return;
		}
		const command = event.tool_input?.command ?? "";
		if (!GIT_COMMIT.test(command)) return;
		// shortcut: checks the repository at the session cwd, so `cd other && git commit` or `git -C other commit` is checked against the cwd repo; upgrade if agents commit outside the cwd often.
		const message = newestCommitToCheck(event.cwd || process.cwd(), Math.floor(Date.now() / 1000));
		if (message === null) return;
		const problems = checkMessage(message);
		if (problems.length === 0) return;
		const reason =
			`The commit message breaks the commit skill's format:\n${problems.map((p) => `- ${p}`).join("\n")}\n` +
			"Fix the message with `git commit --amend` and keep the content.";
		process.stdout.write(JSON.stringify({ decision: "block", reason }));
	});
}

if (require.main === module) main();
module.exports = { checkMessage, GIT_COMMIT };
