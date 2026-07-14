import { NextRequest, NextResponse } from "next/server";
import { isAuthedRequest } from "@/lib/auth";

// If Google retires this model, swap the name here only.
const GEMINI_MODEL = "gemini-3.5-flash";

const SYSTEM_PROMPT = `You extract structured competition/hackathon listing data from a raw, messy WhatsApp forward.
Return ONLY a single JSON object, no markdown fences, no commentary, matching exactly this shape:

{
  "name": string,
  "organizer": string,
  "category": string,      // one of: Coding, Design, Science, Business, Arts, General
  "deadline": string,       // human readable, e.g. "Jun 30, 2026"
  "eventDate": string,      // human readable, e.g. "Aug\u2013Sep 2026"
  "prize": string,
  "level": string,          // one of: Beginner, Intermediate, Advanced
  "mode": string,           // one of: Online, In-Person, Hybrid
  "teamSize": string,
  "location": string,
  "description": string,    // 1-3 sentences, cleaned up, no emojis, no promotional fluff
  "tags": string[],         // 2-5 short tags
  "global": boolean,
  "featured": boolean,      // true only if the source text itself says it's featured/sponsored/pinned
  "url": string             // application link if present in the text, else ""
}

If a field truly isn't in the text, use your best reasonable guess from context, or an empty string / empty array \u2014 never invent a fake prize amount or deadline date.`;

export async function POST(req: NextRequest) {
  if (!isAuthedRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { text } = await req.json();
  if (typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Server not configured (missing GEMINI_API_KEY)" }, { status: 500 });
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${SYSTEM_PROMPT}\n\nRAW MESSAGE:\n"""\n${text}\n"""` }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      console.error("Gemini error:", errBody);
      return NextResponse.json({ error: "AI parsing failed" }, { status: 502 });
    }

    const data = await geminiRes.json();
    const rawText: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json({ error: "AI returned no content" }, { status: 502 });
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return NextResponse.json({ error: "AI response wasn't valid JSON", raw: rawText }, { status: 502 });
    }

    return NextResponse.json({ result: parsed });
  } catch (err) {
    console.error("Parse route error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
