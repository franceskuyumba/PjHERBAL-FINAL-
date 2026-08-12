import fs from "fs";
import path from "path";

/**
 * Lightweight server-side logger.
 * Writes structured lines to logs/app.log (dev-friendly) and always mirrors
 * errors to the console. Never throws — logging must not break the app.
 */

const LOG_DIR = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "app.log");

function ensureFile(): void {
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
  } catch {
    /* ignore */
  }
}

function write(level: "INFO" | "WARN" | "ERROR", message: string, detail?: string): void {
  const line = `[${new Date().toISOString()}] ${level} ${message}${detail ? ` | ${detail}` : ""}\n`;
  try {
    ensureFile();
    fs.appendFileSync(LOG_FILE, line, "utf8");
  } catch {
    /* ignore */
  }
  if (level === "ERROR") console.error(message, detail || "");
}

export const logger = {
  info(message: string, detail?: string) {
    write("INFO", message, detail);
  },
  warn(message: string, detail?: string) {
    write("WARN", message, detail);
  },
  error(message: string, detail?: string) {
    write("ERROR", message, detail);
  },
};

/** Sanitizes a thrown value into a safe, loggable string (no secrets). */
export function sanitizeError(e: unknown): string {
  if (!e) return "unknown error";
  if (typeof e === "string") return e.slice(0, 1000);
  if (e instanceof Error) return `${e.message}${e.stack ? ` (${e.stack.slice(0, 500)})` : ""}`.slice(0, 1500);
  try {
    return JSON.stringify(e).slice(0, 1500);
  } catch {
    return String(e).slice(0, 1000);
  }
}
