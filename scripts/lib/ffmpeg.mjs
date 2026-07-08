import { spawnSync } from "node:child_process";

export function ffprobeDurationSec(filePath) {
  const result = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      filePath,
    ],
    { encoding: "utf8" }
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || `ffprobe failed for ${filePath}`);
  }

  const seconds = Number.parseFloat(result.stdout.trim());
  if (!Number.isFinite(seconds) || seconds <= 0) {
    throw new Error(`Invalid duration for ${filePath}: ${result.stdout}`);
  }
  return seconds;
}

export function runFfmpeg(args) {
  const result = spawnSync("ffmpeg", ["-y", ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || "ffmpeg failed");
  }
}
