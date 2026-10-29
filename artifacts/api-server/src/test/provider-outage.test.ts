import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { createDishaResponder } from "../lib/disha";

// Exercise the real HTTP client against a disposable local provider, never Groq.
for (const mode of [
  "quota",
  "server-error",
  "malformed",
  "disconnect",
  "timeout",
] as const) {
  test(`Disha labels ${mode} as a saved prompt, not an AI reply`, async () => {
    let calls = 0;
    const server = createServer((_request, response) => {
      calls++;
      if (mode === "disconnect") {
        response.destroy();
        return;
      }
      if (mode === "timeout") return;
      response.writeHead(
        mode === "quota" ? 429 : mode === "server-error" ? 503 : 200,
      );
      response.end(mode === "malformed" ? "not json" : "unavailable");
    });
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve),
    );
    try {
      const { port } = server.address() as AddressInfo;
      const reply = await createDishaResponder({
        apiKey: "local-test-placeholder",
        baseUrl: `http://127.0.0.1:${port}/chat/completions`,
        models: ["local-test"],
      })([{ role: "user", content: "I feel anxious about exams" }]);
      assert.match(reply, /AI is unavailable right now/);
      assert.match(reply, /saved check-in prompt, not an AI reply/);
      assert.ok(reply.length > 100);
      assert.equal(calls, 1);
    } finally {
      server.closeAllConnections();
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    }
  });
}
