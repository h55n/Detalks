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

export interface LlmConfig {
  apiKey: string;
  baseUrl?: string; // OpenAI-compatible chat completions URL
  models?: string[];
}

const MAX_HISTORY_TURNS = 20;

async function hfReply(history: ChatTurn[], cfg: LlmConfig): Promise<string> {
  const token = cfg.apiKey;
  const url = cfg.baseUrl ?? HF_ROUTER_URL;
  let lastError: unknown = null;
  for (const model of cfg.models ?? MODELS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history.slice(-MAX_HISTORY_TURNS)],
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

// Without a model, Disha still listens: it picks up the theme of what was
// said and asks one gentle question about it, instead of repeating itself.
const THEMES: { match: RegExp; reflect: string; asks: string[] }[] = [
  {
    match: /\b(exam|exams|marks|result|results|backlog|study|studying|jee|neet|upsc|cgpa|grades?|test|viva)\b/i,
    reflect: "Exam and marks pressure can feel like it decides everything, even when it doesn't.",
    asks: [
      "What part of it is weighing on you most right now?",
      "When you picture the next small step, even ten minutes of it, what is it?",
    ],
  },
  {
    match: /\b(sleep|sleepless|insomnia|tired|exhausted|awake|nightmare)\b/i,
    reflect: "Being worn out makes everything feel heavier.",
    asks: [
      "What has your sleep been like the past few nights?",
      "Is there something that keeps your mind busy once the lights go off?",
    ],
  },
  {
    match: /\b(lonely|alone|no friends?|isolated|left out|nobody)\b/i,
    reflect: "Feeling alone is painful, and it is more common among students than people say out loud.",
    asks: [
      "Is there one person, even from far back, who made you feel at ease?",
      "When did you last feel a little connected to someone?",
    ],
  },
  {
    match: /\b(anxious|anxiety|panic|nervous|worried|worry|scared|afraid|overthink\w*)\b/i,
    reflect: "That sounds like a worried mind working overtime.",
    asks: [
      "Where do you feel it in your body right now?",
      "If you slow your breath for a minute, does the worry shift at all? The Breathe tab can walk you through it.",
    ],
  },
  {
    match: /\b(parents?|family|mom|dad|mother|father|home|brother|sister|relatives?)\b/i,
    reflect: "Family can be both our support and our pressure, sometimes in the same hour.",
    asks: [
      "What do you wish they understood about how you're doing?",
      "Is there one thing you could tell them, in your own words, that would ease it a little?",
    ],
  },
  {
    match: /\b(sad|cry|crying|empty|numb|low|down|hopeless|depressed|miserable)\b/i,
    reflect: "I'm sorry it feels this low. You don't have to dress it up here.",
    asks: [
      "Has it been like this for a few days, or did something happen today?",
      "What is one small, ordinary thing that has felt okay lately, even slightly?",
    ],
  },
  {
    match: /\b(angry|anger|frustrated|irritated|furious|annoyed|fed up)\b/i,
    reflect: "That frustration makes sense. Something matters to you there.",
    asks: [
      "What do you think is underneath the anger, hurt or tiredness?",
      "What would help you let a little of it out safely?",
    ],
  },
  {
    match: /\b(friend|friends|relationship|breakup|broke up|crush|partner|girlfriend|boyfriend)\b/i,
    reflect: "Relationships can take up so much of our heart.",
    asks: [
      "What has been the hardest part of it for you?",
      "What would you say to a friend who was going through the same thing?",
    ],
  },
  {
    match: /\b(thanks|thank you|better|feeling good|good now|helped)\b/i,
    reflect: "I'm glad to hear that.",
    asks: [
      "What helped most just now? It is worth remembering for another day.",
      "Is there anything else you want to put down before you go?",
    ],
  },
];

export function fallbackResponder(history: ChatTurn[]): Promise<string> {
  const userTurns = history.filter((t) => t.role === "user");
  const lastUser = userTurns[userTurns.length - 1];
  const n = userTurns.length;
  const text = lastUser?.content ?? "";
  const theme = THEMES.find((t) => t.match.test(text));
  if (theme) {
    const ask = theme.asks[n % theme.asks.length];
    return Promise.resolve(`${theme.reflect} ${ask}`);
  }
  const opener = FALLBACK_OPENERS[n % FALLBACK_OPENERS.length];
  const question = FALLBACK_QUESTIONS[n % FALLBACK_QUESTIONS.length];
  return Promise.resolve(`${opener} ${question}`);
}

export function createDishaResponder(token?: string | LlmConfig): DishaResponder {
  const cfg: LlmConfig | null =
    typeof token === "string" ? (token ? { apiKey: token } : null) : token?.apiKey ? token : null;
  if (!cfg) return fallbackResponder;
  return async (history) => {
    try {
      return await hfReply(history, cfg);
    } catch {
      return fallbackResponder(history);
    }
  };
}

/** Reads provider settings from the environment. Any OpenAI-compatible
 * endpoint works through LLM_API_KEY / LLM_BASE_URL / LLM_MODEL; HF_TOKEN
 * keeps the original Hugging Face router default. */
export function dishaConfigFromEnv(env: NodeJS.ProcessEnv): LlmConfig | undefined {
  if (env.LLM_API_KEY) {
    return {
      apiKey: env.LLM_API_KEY,
      baseUrl: env.LLM_BASE_URL,
      models: env.LLM_MODEL ? env.LLM_MODEL.split(",").map((m) => m.trim()) : undefined,
    };
  }
  if (env.HF_TOKEN) return { apiKey: env.HF_TOKEN };
  return undefined;
}
