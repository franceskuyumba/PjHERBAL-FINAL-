/**
 * PJHERBAL Clinic - database & configuration backup script.
 *
 * Copies the SQLite database into backups/ with a
 * timestamped name, and prunes old backups beyond BACKUP_KEEP.
 *
 * Usage:
 *   npm run backup              # create a backup
 *   node scripts/backup.js --list  # list existing backups
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BACKUP_DIR = path.join(ROOT, "backups");
const DB_PATH = path.join(ROOT, "prisma", "dev.db");
const KEEP = Number(process.env.BACKUP_KEEP || 14);

function stamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_` +
    `${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
  );
}

function listBackups() {
  if (!fs.existsSync(BACKUP_DIR)) return [];
  return fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.endsWith(".zip"))
    .sort()
    .reverse();
}

function prune() {
  const backups = listBackups();
  const excess = backups.slice(KEEP);
  for (const file of excess) {
    fs.unlinkSync(path.join(BACKUP_DIR, file));
    console.log(`  pruned ${file}`);
  }
  return excess.length;
}

function main() {
  if (process.argv.includes("--list")) {
    const backups = listBackups();
    console.log(backups.length === 0 ? "No backups found." : backups.join("\n"));
    return;
  }

  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  const name = `pjherbal_${stamp()}.zip`;
  const target = path.join(BACKUP_DIR, name);

  const { execFileSync } = require("child_process");
  const isWin = process.platform === "win32";

  const files = [];
  if (fs.existsSync(DB_PATH)) files.push(`prisma/dev.db`);

  if (files.length === 0) {
    console.error("Nothing to back up - prisma/dev.db not found.");
    process.exit(1);
  }

  console.log(`Backing up: ${files.join(", ")} -> ${target}`);
  if (isWin) {
    execFileSync("powershell", [
      "-NoProfile",
      "-Command",
      `Compress-Archive -LiteralPath '${files.join("','")}' -DestinationPath '${target}' -Force`,
    ]);
  } else {
    execFileSync("zip", ["-j", target, ...files.map((f) => path.join(ROOT, f))]);
  }

  const pruned = prune();
  console.log(`Done. ${pruned > 0 ? `Pruned ${pruned} old backup(s). ` : ""}${listBackups().length} backup(s) kept.`);
}

main();
