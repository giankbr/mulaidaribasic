/**
 * Generate a PNG illustration via Gemini image API.
 */

const MODELS = [
  "gemini-2.5-flash-image",
  "gemini-3.1-flash-image",
  "gemini-3.1-flash-lite-image",
];

export function buildImagePrompt(sceneDescription) {
  return [
    `Minimalist flat editorial illustration for IT education: ${sceneDescription}.`,
    "Soft light blue (#DBEAFE) and white palette, clean educational style for Indonesian beginners,",
    "watercolor-soft edges, abstract metaphor, no text, no letters, no words, light background.",
  ].join(" ");
}

export async function generateGeminiImage(apiKey, prompt, outPath, { model, aspectRatio = "9:16" } = {}) {
  const models = model ? [model] : MODELS;
  let lastError;

  for (const modelId of models) {
    try {
      await generateWithModel(apiKey, modelId, prompt, outPath, aspectRatio);
      return outPath;
    } catch (err) {
      lastError = err;
      const msg = String(err.message);
      if (!msg.includes("404") && !msg.includes("429") && !msg.includes("NOT_FOUND")) {
        throw err;
      }
    }
  }

  if (String(lastError?.message).includes("429")) {
    throw new Error("Gemini quota exceeded — enable billing or use --skip-ai for SVG fallback");
  }

  throw lastError ?? new Error("All Gemini image models failed");
}

async function generateWithModel(apiKey, model, prompt, outPath, aspectRatio) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: { aspectRatio },
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API ${res.status} (${model}): ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData?.data);

  if (!imagePart?.inlineData?.data) {
    throw new Error(`No image in Gemini response (${model})`);
  }

  const { writeFileSync, mkdirSync } = await import("node:fs");
  const { dirname } = await import("node:path");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, Buffer.from(imagePart.inlineData.data, "base64"));
}
