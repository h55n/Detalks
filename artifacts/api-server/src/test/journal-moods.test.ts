import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { Client, startTestServer, signup, type TestServer } from "./helpers";

let server: TestServer;
before(async () => {
  server = await startTestServer();
});
after(async () => {
  await server.close();
});

test("mood check-ins save and list, newest first", async () => {
  const client = new Client(server.baseUrl);
  await signup(client, "moods@example.com");

  const bad = await client.post("/api/moods", { mood: 9 });
  assert.equal(bad.status, 400);

  assert.equal((await client.post("/api/moods", { mood: 4, note: "Steady" })).status, 201);
  assert.equal((await client.post("/api/moods", { mood: 3 })).status, 201);

  const list = await client.get("/api/moods?days=30");
  assert.equal(list.status, 200);
  const entries = list.json.entries as { mood: number; note: string | null }[];
  assert.equal(entries.length, 2);
  assert.equal(entries[0].mood, 3);
  assert.equal(entries[1].note, "Steady");
});

test("journal entries create, update, list and delete", async () => {
  const client = new Client(server.baseUrl);
  await signup(client, "journal@example.com");

  const created = await client.post("/api/journal", {
    content: "A long day, but I wrote anyway.",
    mood: 3,
    prompt: "What is one small thing that did not go wrong today?",
  });
  assert.equal(created.status, 201);
  const entry = created.json.entry as { id: string };

  const updated = await client.put(`/api/journal/${entry.id}`, {
    content: "A long day. Writing helped.",
    mood: 4,
  });
  assert.equal(updated.status, 200);

  const list = await client.get("/api/journal");
  const entries = list.json.entries as { id: string; content: string; mood: number }[];
  assert.equal(entries.length, 1);
  assert.equal(entries[0].content, "A long day. Writing helped.");
  assert.equal(entries[0].mood, 4);

  assert.equal((await client.delete(`/api/journal/${entry.id}`)).status, 200);
  const after = await client.get("/api/journal");
  assert.equal((after.json.entries as unknown[]).length, 0);
});

test("users only ever see their own entries", async () => {
  const a = new Client(server.baseUrl);
  const b = new Client(server.baseUrl);
  await signup(a, "private-a@example.com");
  await signup(b, "private-b@example.com");
  await a.post("/api/journal", { content: "Only for me." });
  const bList = await b.get("/api/journal");
  assert.equal((bList.json.entries as unknown[]).length, 0);
  const bMoods = await b.get("/api/moods");
  assert.equal((bMoods.json.entries as unknown[]).length, 0);
});

test("progress reflects real activity", async () => {
  const client = new Client(server.baseUrl);
  await signup(client, "progress@example.com");
  await client.post("/api/moods", { mood: 4 });
  await client.post("/api/journal", { content: "Today was okay." });

  const res = await client.get("/api/progress");
  assert.equal(res.status, 200);
  assert.equal(res.json.journalCount, 1);
  assert.equal(res.json.daysCheckedIn, 1);
  assert.equal(res.json.streak, 1);
  const history = res.json.moodHistory as (number | null)[];
  assert.equal(history.length, 7);
  assert.equal(history[6], 4);
});
