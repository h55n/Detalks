import { test } from "node:test";
import assert from "node:assert/strict";
import { createSafetyScanner } from "../lib/model-safety";
import { createDishaResponder, dishaConfigFromEnv } from "../lib/disha";

const config = { apiKey: "test-only-not-a-key", baseUrl: "https://example.invalid/chat", models: ["openai/gpt-oss-20b"] };

test("safety rules cannot be overridden and provider failures preserve rule fallback", async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => { calls++; throw new Error("offline"); }) as typeof fetch;
  try {
    const scan = createSafetyScanner(config);
    assert.equal((await scan("I want to kill myself")).flagged, true);
    assert.equal(calls, 0);
    assert.equal((await scan("I feel anxious about exams")).flagged, false);
    assert.equal(calls, 1);
  } finally { globalThis.fetch = original; }
});

test("model safety accepts only a literal boolean and handles malformed JSON", async () => {
  const original = globalThis.fetch;
  try {
    for (const [content, flagged] of [[JSON.stringify({flagged: true}), true], [JSON.stringify({flagged: "true"}), false], ["not json", false]] as const) {
      globalThis.fetch = (async () => new Response(JSON.stringify({ choices: [{ message: { content } }] }), {status: 200})) as typeof fetch;
      assert.equal((await createSafetyScanner(config)("Everything is too much")).flagged, flagged);
    }
  } finally { globalThis.fetch = original; }
});

test("Groq settings override optional providers and Disha labels outages", async () => {
  assert.equal(dishaConfigFromEnv({ GROQ_API_KEY: "test", HF_TOKEN: "other" })?.models?.[0], "openai/gpt-oss-20b");
  const original = globalThis.fetch;
  globalThis.fetch = (async () => new Response("unavailable", {status: 429})) as typeof fetch;
  try { assert.match(await createDishaResponder(config)([{ role: "user", content: "Exams" }]), /not an AI reply/); }
  finally { globalThis.fetch = original; }
});
