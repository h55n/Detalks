import { test } from "node:test";
import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { passwordResetsTable } from "@workspace/db";
import { hashToken } from "../lib/auth";
import { Client, signup, startTestServer } from "./helpers";

// Reset links are built from the app origin; tests stand in for the deployed one.
process.env.APP_ORIGIN = process.env.APP_ORIGIN ?? "https://detalks.test";

// Captures the reset link a configured sender would have emailed.
function captureSender() {
  const links: string[] = [];
  return {
    links,
    send: async (_email: string, link: string) => { links.push(link); },
  };
}

function tokenFromLink(link: string): string {
  const hash = new URL(link).hash.slice(1);
  return new URLSearchParams(hash).get("token") ?? "";
}

test("forgot without a configured sender answers an honest unavailable", async () => {
  const server = await startTestServer();
  try {
    const client = new Client(server.baseUrl);
    await signup(client);
    const res = await client.post("/api/auth/password/forgot", { email: "asha@example.com" });
    assert.equal(res.status, 503);
    assert.match(res.json.error as string, /not available yet/);
  } finally {
    await server.close();
  }
});

test("forgot never reveals whether the email owns an account", async () => {
  const sender = captureSender();
  const server = await startTestServer(undefined, { sendPasswordReset: sender.send });
  try {
    const client = new Client(server.baseUrl);
    await signup(client);
    const known = await client.post("/api/auth/password/forgot", { email: "asha@example.com" });
    const unknown = await client.post("/api/auth/password/forgot", { email: "nobody@example.com" });
    assert.equal(known.status, 200);
    assert.equal(unknown.status, 200);
    assert.deepEqual(known.json, unknown.json);
    // Only the real account got an email.
    assert.equal(sender.links.length, 1);
  } finally {
    await server.close();
  }
});

test("a reset link sets a new password and ends existing sessions", async () => {
  const sender = captureSender();
  const server = await startTestServer(undefined, { sendPasswordReset: sender.send });
  try {
    const client = new Client(server.baseUrl);
    await signup(client);
    await client.post("/api/auth/password/forgot", { email: "asha@example.com" });
    const token = tokenFromLink(sender.links[0]);
    assert.ok(token.length > 0);

    const reset = await client.post("/api/auth/password/reset", { token, password: "a-new-safe-password" });
    assert.equal(reset.status, 200);

    // The old session cookie died with the password change.
    const me = await client.get("/api/auth/me");
    assert.equal(me.status, 401);

    const oldLogin = await client.post("/api/auth/login", { email: "asha@example.com", password: "a-safe-password" });
    assert.equal(oldLogin.status, 401);
    const newLogin = await client.post("/api/auth/login", { email: "asha@example.com", password: "a-new-safe-password" });
    assert.equal(newLogin.status, 200);
  } finally {
    await server.close();
  }
});

test("reset links are single-use", async () => {
  const sender = captureSender();
  const server = await startTestServer(undefined, { sendPasswordReset: sender.send });
  try {
    const client = new Client(server.baseUrl);
    await signup(client);
    await client.post("/api/auth/password/forgot", { email: "asha@example.com" });
    const token = tokenFromLink(sender.links[0]);
    const first = await client.post("/api/auth/password/reset", { token, password: "a-new-safe-password" });
    assert.equal(first.status, 200);
    const second = await client.post("/api/auth/password/reset", { token, password: "another-password-1" });
    assert.equal(second.status, 400);
  } finally {
    await server.close();
  }
});

test("expired and malformed reset links are rejected", async () => {
  const sender = captureSender();
  const server = await startTestServer(undefined, { sendPasswordReset: sender.send });
  try {
    const client = new Client(server.baseUrl);
    const user = await signup(client);

    const expiredToken = "x".repeat(43);
    await server.db.insert(passwordResetsTable).values({
      userId: user.id,
      tokenHash: hashToken(expiredToken),
      expiresAt: new Date(Date.now() - 60_000),
    });
    const expired = await client.post("/api/auth/password/reset", { token: expiredToken, password: "a-new-safe-password" });
    assert.equal(expired.status, 400);

    const malformed = await client.post("/api/auth/password/reset", { token: "short", password: "a-new-safe-password" });
    assert.equal(malformed.status, 400);

    const weak = await client.post("/api/auth/password/reset", { token: "y".repeat(43), password: "short" });
    assert.equal(weak.status, 400);
    assert.match(weak.json.error as string, /8 characters/);
  } finally {
    await server.close();
  }
});

test("a new reset request supersedes nothing but a successful send keeps its token", async () => {
  const failing = { send: async () => { throw new Error("provider down"); } };
  const server = await startTestServer(undefined, { sendPasswordReset: failing.send });
  try {
    const client = new Client(server.baseUrl);
    const user = await signup(client);
    const res = await client.post("/api/auth/password/forgot", { email: "asha@example.com" });
    assert.equal(res.status, 503);
    // A failed send leaves no usable token behind.
    const rows = await server.db.select().from(passwordResetsTable).where(eq(passwordResetsTable.userId, user.id));
    assert.equal(rows.length, 0);
  } finally {
    await server.close();
  }
});

test("email-status reports delivery availability without account data", async () => {
  const unavailable = await startTestServer();
  try {
    const client = new Client(unavailable.baseUrl);
    const res = await client.get("/api/auth/email-status");
    assert.equal(res.status, 200);
    assert.deepEqual(res.json, { verification: false, passwordReset: false });
  } finally {
    await unavailable.close();
  }

  const sender = captureSender();
  const available = await startTestServer(undefined, { sendPasswordReset: sender.send });
  try {
    const client = new Client(available.baseUrl);
    const res = await client.get("/api/auth/email-status");
    assert.equal(res.status, 200);
    assert.equal(res.json.passwordReset, true);
    // Verification sender is separate and still unconfigured here.
    assert.equal(res.json.verification, false);
  } finally {
    await available.close();
  }
});
