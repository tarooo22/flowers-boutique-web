import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Generates a bouquet image from a free-text description.
 *
 * If OPENAI_API_KEY is configured the request is forwarded to the OpenAI image
 * API. Without a key the endpoint stays useful by matching the description to a
 * bouquet already shot in our studio, and says so via `mode: "demo"` so the UI
 * can be honest about what the customer is looking at.
 */

const STUDIO_LIBRARY = [
  { src: "/manus-storage/studio-5_c8839d18.png", tags: ["pink", "rose", "lily", "romantic", "blush", "peony"] },
  { src: "/manus-storage/studio-3_71040.png", tags: ["pink", "lily", "soft", "romantic", "rose"] },
  { src: "/manus-storage/studio-1_47c32a42.png", tags: ["pink", "rose", "classic", "red"] },
  { src: "/manus-storage/studio-2_0117c5d8.png", tags: ["peach", "coral", "warm", "orange", "yellow", "sunny"] },
  { src: "/manus-storage/studio-4_b73dad7b.png", tags: ["white", "cream", "elegant", "wedding", "green"] },
  { src: "/manus-storage/shot-1_c1aaea3a.webp", tags: ["blush", "cream", "spray", "large", "pastel", "white"] },
  { src: "/manus-storage/shot-2_9a94dc79.webp", tags: ["chrysanthemum", "purple", "lilac", "white", "seasonal"] },
  { src: "/manus-storage/shot-3_db9224d2.webp", tags: ["red", "orange", "bright", "joy", "coral", "sunset"] },
  { src: "/manus-storage/shot-5_966554ed.webp", tags: ["pink", "magenta", "spray", "rose", "bold"] },
  { src: "/manus-storage/editorial-roses_39a060f9.webp", tags: ["red", "burgundy", "rose", "vase", "deep", "purple"] },
];

/** Cheap keyword overlap so the demo answer still reflects what was asked for. */
function pickFromLibrary(prompt: string): string {
  const words = prompt.toLowerCase().match(/[a-z]+/g) ?? [];
  let best = STUDIO_LIBRARY[0];
  let bestScore = -1;

  for (const entry of STUDIO_LIBRARY) {
    const score = entry.tags.reduce(
      (sum, tag) => sum + (words.some((w) => w.startsWith(tag) || tag.startsWith(w)) ? 1 : 0),
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  // nothing matched (e.g. a Georgian or Russian description) — vary the answer
  if (bestScore <= 0) {
    return STUDIO_LIBRARY[Math.floor(Math.random() * STUDIO_LIBRARY.length)].src;
  }
  return best.src;
}

interface FlowerSelection {
  name?: unknown;
  quantity?: unknown;
}

/** Turn a stem selection plus an optional style note into one description. */
function describe(flowers: FlowerSelection[], note: string): string {
  const parts = flowers
    .filter((f) => typeof f.name === "string" && Number(f.quantity) > 0)
    .map((f) => `${Number(f.quantity)} ${String(f.name).toLowerCase()}`);
  if (!parts.length) return note;
  const list = parts.join(", ");
  return note ? `${list}. ${note}` : list;
}

export async function POST(request: Request) {
  let prompt = "";
  try {
    const body = (await request.json()) as {
      prompt?: unknown;
      flowers?: unknown;
      note?: unknown;
    };
    if (Array.isArray(body.flowers)) {
      const note = typeof body.note === "string" ? body.note.trim() : "";
      prompt = describe(body.flowers as FlowerSelection[], note).trim();
    } else {
      prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    }
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!prompt) {
    return NextResponse.json({ error: "empty_prompt" }, { status: 400 });
  }
  if (prompt.length > 500) prompt = prompt.slice(0, 500);

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      mode: "demo",
      image: pickFromLibrary(prompt),
      prompt,
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1-mini",
        prompt:
          `A professional florist studio photograph of a hand-tied flower bouquet: ${prompt}. ` +
          `Centred composition on a clean seamless warm-cream background, soft natural daylight, ` +
          `photorealistic, high detail, no text, no watermark, no people.`,
        size: "1024x1536",
        quality: "medium",
        n: 1,
      }),
      // image generation is slow; fail rather than hang the request forever
      signal: AbortSignal.timeout(90_000),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.warn("[bouquet/generate] live provider unavailable; returning labelled studio fallback", response.status, detail.slice(0, 400));
      return NextResponse.json({
        mode: "demo",
        image: pickFromLibrary(prompt),
        prompt,
      });
    }

    const data = (await response.json()) as {
      data?: Array<{ b64_json?: string; url?: string }>;
    };
    const item = data.data?.[0];

    if (item?.b64_json) {
      return NextResponse.json({
        mode: "live",
        image: `data:image/png;base64,${item.b64_json}`,
        prompt,
      });
    }
    if (item?.url) {
      return NextResponse.json({ mode: "live", image: item.url, prompt });
    }

    console.warn("[bouquet/generate] live provider returned no image; returning labelled studio fallback");
    return NextResponse.json({
      mode: "demo",
      image: pickFromLibrary(prompt),
      prompt,
    });
  } catch (error) {
    console.warn("[bouquet/generate] live provider request failed; returning labelled studio fallback", error);
    return NextResponse.json({
      mode: "demo",
      image: pickFromLibrary(prompt),
      prompt,
    });
  }
}
