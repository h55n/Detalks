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

test("health route answers", async () => {
  const client = new Client(server.baseUrl);
  const res = await client.get("/api/healthz");
  assert.equal(res.status, 200);
});

test("signup creates a user with an alias and starts a session", async () => {
  const client = new Client(server.baseUrl);
  const res = await client.post("/api/auth/signup", {
    name: "Asha",
    email: "asha@example.com",
    password: "a-safe-password",
    isStudent: true,
  });
  assert.equal(res.status, 201);
  const user = res.json.user as Record<string, unknown>;
  assert.equal(user.name, "Asha");
  assert.equal(user.isStudent, true);
  assert.match(user.alias as string, /^[A-Z][a-z]+[A-Z][a-z]+/);

  const me = await client.get("/api/auth/me");
  assert.equal(me.status, 200);
});

test("signup rejects short passwords and duplicate emails", async () => {
  const client = new Client(server.baseUrl);
  const weak = await client.post("/api/auth/signup", {
    name: "Asha",
    email: "weak@example.com",
    password: "short",
  });
  assert.equal(weak.status, 400);

  await signup(client, "dup@example.com");
  const dup = await client.post("/api/auth/signup", {
    name: "Asha",
    email: "dup@example.com",
    password: "a-safe-password",
  });
  assert.equal(dup.status, 409);
});

test("login works with the right password only", async () => {
  const client = new Client(server.baseUrl);
  await signup(client, "login@example.com");

  const wrong = await client.post("/api/auth/login", {
    email: "login@example.com",
    password: "wrong-password",
  });
  assert.equal(wrong.status, 401);

  const right = await client.post("/api/auth/login", {
    email: "login@example.com",
    password: "a-safe-password",
  });
  assert.equal(right.status, 200);
});

test("logout ends the session", async () => {
  const client = new Client(server.baseUrl);
  await signup(client, "logout@example.com");
  const out = await client.post("/api/auth/logout");
  assert.equal(out.status, 200);
});

test("unauthenticated calls get 401", async () => {
  const client = new Client(server.baseUrl);
  for (const path of ["/api/moods", "/api/journal", "/api/progress", "/api/sessions"]) {
    const res = await client.get(path);
    assert.equal(res.status, 401, path);
  }
});
