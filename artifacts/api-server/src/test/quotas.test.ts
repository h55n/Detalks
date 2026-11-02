import { test } from "node:test";
import assert from "node:assert/strict";
import { Client, signup, startTestServer } from "./helpers";

const startSession = async (client: Client) => {
  const res = await client.post("/api/sessions", {
    arrivalState: "Feeling steady",
    consentVersion: "groq-v1",
  });
  assert.equal(res.status, 201, JSON.stringify(res.json));
  return (res.json.session as { id: string }).id;
};

test("circle posting is capped per account per day", async () => {
  const server = await startTestServer(undefined, { quotas: { circlePostsPerDay: 2 } });
  try {
    const client = new Client(server.baseUrl);
    await signup(client, "poster@example.com");
    await server.verifyEmail("poster@example.com");
    const post = () => client.post("/api/circles/academic/posts", { content: "holding steady today" });
    assert.equal((await post()).status, 201);
    assert.equal((await post()).status, 201);
    const limited = await post();
    assert.equal(limited.status, 429);
    // A second account on the same network keeps its own quota.
    const other = new Client(server.baseUrl);
    await signup(other, "other@example.com");
    await server.verifyEmail("other@example.com");
    assert.equal((await other.post("/api/circles/academic/posts", { content: "checking in" })).status, 201);
  } finally {
    await server.close();
  }
});

test("companion messages are capped per account per day", async () => {
  const server = await startTestServer(undefined, { quotas: { sessionMessagesPerDay: 2 } });
  try {
    const client = new Client(server.baseUrl);
    await signup(client);
    const sessionId = await startSession(client);
    const say = () => client.post(`/api/sessions/${sessionId}/messages`, { content: "today was okay" });
    assert.equal((await say()).status, 201);
    assert.equal((await say()).status, 201);
    const limited = await say();
    assert.equal(limited.status, 429);
  } finally {
    await server.close();
  }
});

test("session starts are capped per account per day", async () => {
  const server = await startTestServer(undefined, { quotas: { sessionsPerDay: 1 } });
  try {
    const client = new Client(server.baseUrl);
    await signup(client);
    await startSession(client);
    const limited = await client.post("/api/sessions", {
      arrivalState: "Feeling steady",
      consentVersion: "groq-v1",
    });
    assert.equal(limited.status, 429);
  } finally {
    await server.close();
  }
});

test("signup volume is capped per network per day", async () => {
  const server = await startTestServer(undefined, { quotas: { signupPerDay: 2 } });
  try {
    const client = new Client(server.baseUrl);
    await signup(client, "one@example.com");
    await signup(client, "two@example.com");
    const limited = await client.post("/api/auth/signup", {
      name: "Three",
      email: "three@example.com",
      password: "a-safe-password",
    });
    assert.equal(limited.status, 429);
    assert.match(limited.json.error as string, /try again tomorrow/);
  } finally {
    await server.close();
  }
});
