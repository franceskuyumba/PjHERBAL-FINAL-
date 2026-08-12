/**
 * Root seed helper — delegates to the backend seed script.
 *
 * Usage:
 *   npm run seed
 *
 * Prerequisites:
 *   - PostgreSQL running with DATABASE_URL configured in backend/.env
 *   - `npm install` completed
 */
const { spawnSync } = require("child_process");
const path = require("path");

const result = spawnSync(
  process.execPath,
  [path.join(__dirname, "..", "backend", "src", "scripts", "seed.js")],
  { stdio: "inherit", env: { ...process.env } }
);

process.exit(result.status ?? 1);
