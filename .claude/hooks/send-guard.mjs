// PreToolUse guard for the Resend MCP server.
// Blocks any send that could reach someone other than Resend's test
// addresses (@resend.dev) or my own address (MY_EMAIL).
// Exit 0 = allow. Exit 2 = block (the message on stderr is shown to Claude).

const ALWAYS_BLOCK = new Set([
  "send-broadcast",
  "create-automation",
  "send-inbox-draft",
  "send-new-inbox-email",
]);

const CHECK_RECIPIENTS = new Set(["send-email", "send-batch-emails"]);

function block(reason) {
  process.stderr.write(`Send guard: ${reason}\n`);
  process.exit(2);
}

// Turn a field (string, list, or missing) into a list of bare addresses.
// Handles "Name <someone@example.com>" as well as plain addresses.
function addresses(field) {
  if (field == null) return [];
  const list = Array.isArray(field) ? field : [field];
  return list.map((entry) => {
    const text = String(entry).trim();
    const match = text.match(/<([^>]+)>/);
    return (match ? match[1] : text).trim().toLowerCase();
  });
}

let raw = "";
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) raw += chunk;

let call;
try {
  call = JSON.parse(raw);
} catch {
  block("could not read the tool call, so it was blocked to be safe.");
}

const toolName = String(call.tool_name || "");
const action = toolName.replace(/^mcp__resend__/, "");
const input = call.tool_input || {};

if (ALWAYS_BLOCK.has(action)) {
  block(`${action} is not allowed here because it can reach whole lists of people.`);
}

if (!CHECK_RECIPIENTS.has(action)) {
  process.exit(0);
}

const myEmail = (process.env.MY_EMAIL || "").trim().toLowerCase();
const emails = action === "send-batch-emails" ? input.emails || [] : [input];

for (const email of emails) {
  for (const field of ["to", "cc", "bcc"]) {
    for (const address of addresses(email[field])) {
      const allowed = address.endsWith("@resend.dev") || (myEmail && address === myEmail);
      if (!allowed) {
        block(`${address} (in ${field}) is not allowed. Send only to @resend.dev addresses or to MY_EMAIL.`);
      }
    }
  }
}

process.exit(0);
