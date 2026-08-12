/**
 * Cross-platform dev launcher.
 *
 *   npm run dev           -> next dev
 *   npm run dev:clean     -> remove .next (fixes a hung "Starting..." server), then next dev
 *
 * Uses the portable Node bundled in .node/ when node is not on PATH.
 */
const { spawn, execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORTABLE = path.join(ROOT, ".node");
const NEXT_BIN = path.join(ROOT, "node_modules", "next", "dist", "bin", "next");
const DOTNEXT = path.join(ROOT, ".next");

function findNode() {
  try {
    execFileSync("node", ["-v"]);
    return "node";
  } catch {
    const candidate = path.join(PORTABLE, "node.exe");
    if (fs.existsSync(candidate)) return candidate;
    throw new Error("Node.js not found. Install it or restore the .node/ folder.");
  }
}

const clean = process.argv.includes("clean");
if (clean) {
  if (fs.existsSync(DOTNEXT)) {
    console.log("Removing stale .next cache...");
    fs.rmSync(DOTNEXT, { recursive: true, force: true });
  }
}

const node = findNode();
const nextArgs = process.argv.slice(2).filter((a) => a !== "clean");
console.log(`Starting dev server with ${node}`);
spawn(node, [NEXT_BIN, "dev", ...nextArgs], {
  stdio: "inherit",
  cwd: ROOT,
}).on("exit", (code) => process.exit(code ?? 0));
