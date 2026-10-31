import { test } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { sql } from "drizzle-orm";
import { createApp } from "../app";
import { Client, signup, startTestServer } from "./helpers";

const badLogin = (client: Client) =>
  client.post("/api/auth/login", { email: "asha@example.com", password: "wrong-password" });

test("auth endpoints are limited after the configured attempts", async () => {
  const server = await startTestServer(undefined, { authRateLimit: { limit: 2, windowMs: 15 * 60_000 } });
  try {
    const client = new Client(server.baseUrl);
    await signup(client);
    assert.equal((await badLogin(client)).status, 401);
    assert.equal((await badLogin(client)).status, 401);
    const limited = await badLogin(client);
    assert.equal(limited.status, 429);
    assert.match(limited.json.error as string, /Too many attempts/);
  } finally {
    await server.close();
  }
});

test("the limit holds across app instances sharing the database", async () => {
  const server = await startTestServer(undefined, { authRateLimit: { limit: 1, windowMs: 15 * 60_000 } });
  let second: ReturnType<ReturnType<typeof createApp>["listen"]> | null = null;
  try {
    const client = new Client(server.baseUrl);
    await signup(client);
    assert.equal((await badLogin(client)).status, 401);
    assert.equal((await badLogin(client)).status, 429);

    // A second instance (another serverless function, a restart) must not
    // reset the window: the bucket lives in Postgres, not in memory.
    const app2 = createApp({
      db: server.db,
      disha: async () => "I'm here and listening. Tell me more.",
      authRateLimit: { limit: 1, windowMs: 15 * 60_000 },
    });
    second = app2.listen(0);
    await new Promise<void>((resolve) => second!.once("listening", resolve));
    const { port } = second.address() as AddressInfo;
    const client2 = new Client(`http://127.0.0.1:${port}`);
    assert.equal((await badLogin(client2)).status, 429);
  } finally {
    second?.close();
    await server.close();
  }
});

test("requests are allowed again after the window expires", async () => {
  const server = await startTestServer(undefined, { authRateLimit: { limit: 1, windowMs: 15 * 60_000 } });
  try {
    const client = new Client(server.baseUrl);
    await signup(client);
    assert.equal((await badLogin(client)).status, 401);
    assert.equal((await badLogin(client)).status, 429);

    await server.db.execute(sql`UPDATE rate_limit_buckets SET reset_at = now() - interval '1 second'`);
    assert.equal((await badLogin(client)).status, 401);
  } finally {
    await server.close();
  }
});

test("the limiter counts per endpoint, not across the whole API", async () => {
  const server = await startTestServer(undefined, { authRateLimit: { limit: 1, windowMs: 15 * 60_000 } });
  try {
    const client = new Client(server.baseUrl);
    await signup(client);
    assert.equal((await badLogin(client)).status, 401);
    assert.equal((await badLogin(client)).status, 429);
    // A different limited path still has its own bucket.
    const other = await client.post("/api/auth/password/forgot", { email: "asha@example.com" });
    assert.notEqual(other.status, 429);
    // And an unlimited route is untouched.
    const health = await client.get("/api/healthz");
    assert.equal(health.status, 200);
  } finally {
    await server.close();
  }
});
