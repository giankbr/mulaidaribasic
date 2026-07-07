import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, "..", "..");
export const REPO_ROOT = join(ROOT, "..");

/** Load .env from project root (does not override existing process.env). */
export function loadEnv() {
  for (const envPath of [join(ROOT, ".env"), join(REPO_ROOT, ".env")]) {
    if (!existsSync(envPath)) continue;
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m && !process.env[m[1].trim()]) {
        process.env[m[1].trim()] = m[2].trim();
      }
    }
  }
}

export function requireEnv(name) {
  const value = process.env[name];
  if (!value || value.startsWith("your-")) {
    console.error(`Missing ${name} — copy .env.example to .env and fill it in.`);
    process.exit(1);
  }
  return value;
}
