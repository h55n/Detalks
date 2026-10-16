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

test("export returns the person's own data and delete removes it", async () => {
  const client = new Client(server.baseUrl);
  await signup(client, "export@example.com");
  await client.post("/api/moods", { mood: 4, note: "ok day" });
  await client.post("/api/journal", { content: "private words" });

  const exported = await client.get("/api/account/export");
  assert.equal(exported.status, 200);
  assert.equal((exported.json.moods as unknown[]).length, 1);
  assert.equal((exported.json.journal as unknown[]).length, 1);
  assert.equal((exported.json.account as { email: string }).email, "export@example.com");
  assert.equal(JSON.stringify(exported.json).includes("passwordHash"), false);

  const wrong = await client.delete("/api/account", { password: "not-the-password" });
  assert.equal(wrong.status, 403);

  const gone = await client.delete("/api/account", { password: "a-safe-password" });
  assert.equal(gone.status, 200);

  const me = await client.get("/api/auth/me");
  assert.equal(me.status, 401);
  const login = await new Client(server.baseUrl).post("/api/auth/login", {
    email: "export@example.com",
    password: "a-safe-password",
  });
  assert.equal(login.status, 401);
});

test("export and delete need a signed-in user", async () => {
  const client = new Client(server.baseUrl);
  assert.equal((await client.get("/api/account/export")).status, 401);
  assert.equal((await client.delete("/api/account", { password: "x" })).status, 401);
});

test("a circle post in crisis language is not published", async () => {
  const client = new Client(server.baseUrl);
  await signup(client, "circle@example.com");
  const circles = await client.get("/api/circles");
  const id = (circles.json.circles as { id: string }[])[0].id;
  const blocked = await client.post(`/api/circles/${id}/posts`, { content: "I want to kill myself" });
  assert.equal(blocked.status, 422);
  assert.equal(blocked.json.flagged, true);
  const ok = await client.post(`/api/circles/${id}/posts`, { content: "Exams are stressful this week" });
  assert.equal(ok.status, 201);
  const posts = await client.get(`/api/circles/${id}/posts`);
  assert.equal((posts.json.posts as unknown[]).length, 1);
});
