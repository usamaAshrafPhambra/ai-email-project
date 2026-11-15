#!/usr/bin/env node
// Headless brand review of a campaign folder.
// Usage: node scripts/review.mjs <campaign-folder>
// Exit codes: 0 = no high-severity findings, 1 = high-severity finding(s), 2 = script error.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const folder = process.argv[2];
if (!folder || !existsSync(folder)) {
  console.error("Usage: node scripts/review.mjs <campaign-folder>");
  process.exit(2);
}

const schema = readFileSync("review/findings.schema.json", "utf8");
const prompt = `Review every email in ${folder} against brand/voice.md and .claude/rules/emails.md. Report only real problems.`;

let raw;
try {
  raw = execFileSync(
    "claude",
    ["-p", prompt, "--output-format", "json", "--json-schema", schema, "--allowedTools", "Read,Glob,Grep"],
    { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 }
  );
} catch (err) {
  console.error("Claude run failed:", err.message);
  process.exit(2);
}

// Output may be one object, or a list whose last item is the result.
let parsed = JSON.parse(raw);
const result = Array.isArray(parsed) ? parsed[parsed.length - 1] : parsed;
const output = result?.structured_output;
if (!output || !Array.isArray(output.findings)) {
  console.error("No structured_output.findings in Claude's result.");
  process.exit(2);
}

writeFileSync("review/findings.json", JSON.stringify(output, null, 2) + "\n");

const count = (s) => output.findings.filter((f) => f.severity === s).length;
const high = count("high");
console.log(
  `${folder}: ${output.findings.length} finding(s) — ${high} high, ${count("medium")} medium, ${count("low")} low. Saved to review/findings.json`
);
process.exit(high > 0 ? 1 : 0);
