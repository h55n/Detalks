import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { Client, startTestServer, signup, type TestServer } from "./helpers";
let server: TestServer;
let lastUser = "";
before(async () => { server = await startTestServer(async (history) => { lastUser = history.filter(t => t.role === "user").at(-1)?.content ?? ""; return "What would help you today?"; }); });
after(async () => { await server.close(); });

test("new accounts have no demo moods, journal entries or sessions", async () => {
  const client = new Client(server.baseUrl);
  await signup(client, "empty@example.com");
  assert.equal(((await client.get("/api/moods")).json.entries as unknown[]).length, 0);
  assert.equal(((await client.get("/api/journal")).json.entries as unknown[]).length, 0);
  assert.equal(((await client.get("/api/sessions")).json.sessions as unknown[]).length, 0);
});

test("the latest turn reaches Disha even beyond the old 40-message limit", async () => {
  const client = new Client(server.baseUrl);
  await signup(client, "long@example.com");
  const started = await client.post("/api/sessions", { arrivalState: "Feeling steady" });
  const id = (started.json.session as { id: string }).id;
  for (let i = 0; i < 22; i++) {
    assert.equal((await client.post(`/api/sessions/${id}/messages`, { content: `Test reflection ${i}` })).status, 201);
    assert.equal(lastUser, `Test reflection ${i}`);
  }
});

test("ending twice does not duplicate moods or erase reflections", async () => {
  const client = new Client(server.baseUrl);
  await signup(client, "end@example.com");
  const started = await client.post("/api/sessions", { arrivalState: "Feeling steady" });
  const id = (started.json.session as { id: string }).id;
  await client.post(`/api/sessions/${id}/end`, { postMood: 4, reflection: "Small steps" });
  await client.post(`/api/sessions/${id}/end`, { postMood: 4, reflection: "Small steps" });
  const final = await client.post(`/api/sessions/${id}/end`, {});
  assert.equal((final.json.session as { reflection: string }).reflection, "Small steps");
  assert.equal(((await client.get("/api/moods")).json.entries as unknown[]).length, 1);
});

test("invalid ids and day filters return client errors, not database errors", async () => {
  const client = new Client(server.baseUrl);
  await signup(client, "ids@example.com");
  assert.equal((await client.get("/api/sessions/not-a-uuid/messages")).status, 404);
  assert.equal((await client.put("/api/journal/invalid", { content: "Hello" })).status, 404);
  assert.equal((await client.delete("/api/journal/invalid")).status, 404);
  assert.equal((await client.get("/api/moods?days=-1")).status, 400);
  assert.equal((await client.get("/api/moods?days=Infinity")).status, 400);
});
