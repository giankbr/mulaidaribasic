import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { ffprobeDurationSec, runFfmpeg, buildAtempoFilter } from "./ffmpeg.mjs";

const REEL_FPS = 30;
const REEL_DURATION_SEC = 52;
/**
 * Indonesian neural voices (Edge TTS):
 * - id-ID-GadisNeural — female, warmer / more conversational
 * - id-ID-ArdiNeural — male
 * Override with TTS_VOICE in .env
 */
const VOICE = process.env.TTS_VOICE ?? "id-ID-ArdiNeural";
/** Slightly brisk so full narration fits each scene slot */
const TTS_RATE = process.env.TTS_RATE ?? "+10%";
/** Prefer speeding up over clipping so all words are spoken */
const MAX_SPEEDUP = Number(process.env.TTS_MAX_SPEEDUP ?? "1.35");

/** Mirrors remotion/src/lib/constants.ts SCENES */
const SCENES = [
  { id: "hook", from: 0, duration: 120 },
  { id: "p1", from: 120, duration: 405 },
  { id: "p2", from: 525, duration: 435 },
  { id: "p3", from: 960, duration: 405 },
  { id: "cta", from: 1365, duration: 195 },
];

function sceneStartMs(scene) {
  return Math.round((scene.from / REEL_FPS) * 1000);
}

function sceneDurationMs(scene) {
  return Math.round((scene.duration / REEL_FPS) * 1000);
}

function joinSentences(...parts) {
  return parts
    .map((p) => p?.trim())
    .filter(Boolean)
    .join(". ")
    .replace(/\.+/g, ".")
    .trim();
}

export function buildNarrationSegments(parsed) {
  const ctaText = parsed.cta.replace(/\bfollow\s+@mulaidaribasic\b/gi, "").trim();

  return [
    {
      id: "hook",
      // Subtitle stays on-screen; voice reads headline only so hook isn't rushed
      text: parsed.hook.trim(),
      ...SCENES[0],
    },
    {
      id: "p1",
      text: joinSentences(parsed.points[0]?.title, parsed.points[0]?.body),
      ...SCENES[1],
    },
    {
      id: "p2",
      text: joinSentences(parsed.points[1]?.title, parsed.points[1]?.body),
      ...SCENES[2],
    },
    {
      id: "p3",
      text: joinSentences(parsed.points[2]?.title, parsed.points[2]?.body),
      ...SCENES[3],
    },
    {
      id: "cta",
      text: joinSentences(ctaText, "Follow mulai dari basic"),
      ...SCENES[4],
    },
  ].filter((segment) => segment.text.length > 0);
}

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Azure/Edge TTS timestamps are in 100-nanosecond units */
const TICKS_PER_MS = 10_000;

async function synthesizeSegment(text, outPath) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3, {
    wordBoundaryEnabled: true,
  });
  const workDir = join(dirname(outPath), basename(outPath, ".mp3"));
  mkdirSync(workDir, { recursive: true });
  const { audioFilePath, metadataFilePath } = await tts.toFile(
    workDir,
    escapeXml(text),
    { rate: TTS_RATE }
  );
  renameSync(audioFilePath, outPath);

  if (!metadataFilePath) return [];

  const metadata = JSON.parse(readFileSync(metadataFilePath, "utf8"));
  return metadata.Metadata ?? [];
}

function wordBoundariesToCaptions(boundaries, sceneStartMs, tempo = 1) {
  return boundaries
    .filter((entry) => entry.Type === "WordBoundary")
    .map((entry, index) => {
      const offsetMs = entry.Data.Offset / TICKS_PER_MS / tempo;
      const endOffsetMs =
        (entry.Data.Offset + entry.Data.Duration) / TICKS_PER_MS / tempo;
      const word = entry.Data.text.Text;

      return {
        text: index === 0 ? word : ` ${word}`,
        startMs: Math.round(sceneStartMs + offsetMs),
        endMs: Math.round(sceneStartMs + endOffsetMs),
        timestampMs: Math.round(sceneStartMs + offsetMs),
        confidence: 1,
      };
    });
}

function fitAudioToDuration(inputPath, outputPath, targetSec) {
  const actualSec = ffprobeDurationSec(inputPath);
  if (actualSec <= targetSec + 0.05) {
    runFfmpeg(["-i", inputPath, "-c", "copy", outputPath]);
    return { durationSec: actualSec, tempo: 1 };
  }

  const neededTempo = actualSec / targetSec;
  const tempo = Math.min(neededTempo, MAX_SPEEDUP);

  const args = ["-i", inputPath, "-c:a", "libmp3lame", "-q:a", "4"];
  const atempo = buildAtempoFilter(tempo);
  if (atempo) {
    args.splice(2, 0, "-filter:a", atempo);
  }
  if (neededTempo > MAX_SPEEDUP) {
    args.push("-t", String(targetSec));
  }
  args.push(outputPath);
  runFfmpeg(args);

  const durationSec = Math.min(ffprobeDurationSec(outputPath), targetSec);
  return { durationSec, tempo };
}

function textToWordCaptions(text, startMs, endMs) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const spanMs = Math.max(endMs - startMs, 1);
  const stepMs = spanMs / words.length;

  return words.map((word, index) => {
    const tokenStart = Math.round(startMs + index * stepMs);
    const tokenEnd = Math.round(startMs + (index + 1) * stepMs);
    return {
      text: index === 0 ? word : ` ${word}`,
      startMs: tokenStart,
      endMs: tokenEnd,
      timestampMs: tokenStart,
      confidence: 1,
    };
  });
}

function mixSceneAudio(sceneFiles, totalSec, outputPath) {
  const silencePath = outputPath.replace(/\.mp3$/i, ".silence.mp3");
  runFfmpeg([
    "-f",
    "lavfi",
    "-i",
    `anullsrc=r=24000:cl=mono`,
    "-t",
    String(totalSec),
    "-c:a",
    "libmp3lame",
    "-q:a",
    "4",
    silencePath,
  ]);

  const filterParts = [];
  const mixInputs = ["[0:a]"];

  sceneFiles.forEach((scene, index) => {
    const delayMs = scene.startMs;
    const label = `a${index + 1}`;
    filterParts.push(`[${index + 1}:a]adelay=${delayMs}|${delayMs}[${label}]`);
    mixInputs.push(`[${label}]`);
  });

  const filter = `${filterParts.join(";")};${mixInputs.join("")}amix=inputs=${mixInputs.length}:duration=first:dropout_transition=0`;

  runFfmpeg([
    "-i",
    silencePath,
    ...sceneFiles.flatMap((scene) => ["-i", scene.path]),
    "-filter_complex",
    filter,
    "-c:a",
    "libmp3lame",
    "-q:a",
    "4",
    outputPath,
  ]);
}

/**
 * Generate scene-synced voiceover + karaoke caption tokens.
 * @returns {{ audioPath: string, captions: import('@remotion/captions').Caption[], voiceoverSrc: string }}
 */
export async function generateVoiceover(slug, parsed, { workDir, publicDir }) {
  mkdirSync(workDir, { recursive: true });
  mkdirSync(publicDir, { recursive: true });

  const segments = buildNarrationSegments(parsed);
  const sceneAudio = [];
  const captions = [];

  for (const segment of segments) {
    const rawPath = join(workDir, `${segment.id}.raw.mp3`);
    const fittedPath = join(workDir, `${segment.id}.mp3`);
    const targetSec = sceneDurationMs(segment) / 1000;

    const metadata = await synthesizeSegment(segment.text, rawPath);
    const { durationSec: fittedSec, tempo } = fitAudioToDuration(
      rawPath,
      fittedPath,
      targetSec
    );
    const startMs = sceneStartMs(segment);
    const maxCaptionEndMs = startMs + Math.round(fittedSec * 1000);

    const wordCaptions =
      metadata.length > 0
        ? wordBoundariesToCaptions(metadata, startMs, tempo).filter(
            (caption) => caption.startMs < maxCaptionEndMs
          )
        : textToWordCaptions(
            segment.text,
            startMs,
            maxCaptionEndMs
          );

    sceneAudio.push({ path: fittedPath, startMs });
    captions.push(...wordCaptions);
  }

  const mixedPath = join(workDir, "voiceover.mp3");
  mixSceneAudio(sceneAudio, REEL_DURATION_SEC, mixedPath);

  const publicPath = join(publicDir, `${slug}.mp3`);
  runFfmpeg(["-i", mixedPath, "-c", "copy", publicPath]);

  const captionsPath = join(workDir, "captions.json");
  writeFileSync(captionsPath, JSON.stringify(captions, null, 2));

  return {
    audioPath: publicPath,
    captionsPath,
    captions,
    voiceoverSrc: `voiceovers/${slug}.mp3`,
  };
}
