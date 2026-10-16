/**
 * Disha: the check-in companion. Replies come from a small open model over
 * the Hugging Face inference router when a token is configured. When no
 * token is set (local dev, missing secret), a simple reflective listener
 * answers instead so the app always works.
 */

export interface ChatTurn {
  role: "user" | "assistant" | "system";
  content: string;
}

export type DishaResponder = (history: ChatTurn[]) => Promise<string>;

const SYSTEM_PROMPT = `You are Disha, a warm check-in companion inside DeTalks, a mental wellness app for students in India. You are not a therapist, doctor, or crisis service, and you say so plainly when someone needs more than a listening ear.

How you talk:
- Warm, calm, plain language. Short replies: two to four sentences, never a lecture.
- Reflect what the person said before asking anything. Ask one gentle, open question at a time.
- Never diagnose, never prescribe, never give medical advice. No clinical jargon.
- Acknowledge feelings without judgement. Small steps and ordinary things (sleep, food, a walk, telling one person) are good suggestions.
- If someone seems to be in crisis, say you care and point them to Tele-MANAS 14416 (free, 24/7, India) or emergency 112.
- You remember only this conversation.`;

const MODELS = [
  "meta-llama/Llama-3.2-3B-Instruct",
  "Qwen/Qwen2.5-7B-Instruct",
  "HuggingFaceTB/SmolLM2-1.7B-Instruct",
];

const HF_ROUTER_URL = "https://router.huggingface.co/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 25_000;

async function hfReply(history: ChatTurn[], token: string): Promise<string> {
  let lastError: unknown = null;
  for (const model of MODELS) {
    try {
      const res = await fetch(HF_ROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
          max_tokens: 220,
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (!res.ok) {
        lastError = new Error(`HF ${model} responded ${res.status}`);
        continue;
      }
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = data.choices?.[0]?.message?.content?.trim();
      if (content) return content;
      lastError = new Error(`HF ${model} returned no content`);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Disha is unavailable");
}

const FALLBACK_OPENERS = [
  "Thank you for sharing that with me. It takes something to put it into words.",
  "I'm glad you told me. That sounds like a lot to carry.",
  "I hear you. Let's sit with that for a moment.",
];

const FALLBACK_QUESTIONS = [
  "What has been the hardest part of it today?",
  "How long has this been sitting with you?",
  "If tonight could feel even a little lighter, what would that look like?",
  "Who is one person you could share a small piece of this with?",
  "What usually helps, even a tiny bit, when it feels like this?",
];

export function fallbackResponder(history: ChatTurn[]): Promise<string> {
  const userTurns = history.filter((t) => t.role === "user").length;
  const lastUser = [...history].reverse().find((t) => t.role === "user");
  const opener = FALLBACK_OPENERS[userTurns % FALLBACK_OPENERS.length];
  const question = FALLBACK_QUESTIONS[userTurns % FALLBACK_QUESTIONS.length];
  const echo = lastUser
    ? `You said, "${lastUser.content.slice(0, 120)}${lastUser.content.length > 120 ? "…" : ""}" — I hear that. `
    : "";
  return Promise.resolve(`${opener} ${echo}${question}`);
}

export function createDishaResponder(token?: string): DishaResponder {
  if (!token) return fallbackResponder;
  return async (history) => {
    try {
      return await hfReply(history, token);
    } catch {
      return fallbackResponder(history);
    }
  };
}
