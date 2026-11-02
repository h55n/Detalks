import { test } from "node:test";
import assert from "node:assert/strict";
import {
  authSessionsTable,
  emailVerificationsTable,
  passwordResetsTable,
  rateLimitBucketsTable,
} from "@workspace/db";
import { Client, signup, startTestServer } from "./helpers";

const HOUR = 60 * 60 * 1000;

test("retention: auth, expiry sweep and unconfigured behaviour", async (t) => {
  process.env.CRON_SECRET = "test-cron-secret";
  const server = await startTestServer();
  try {
    const client = new Client(server.baseUrl);
    const user = await signup(client);

    const past = new Date(Date.now() - HOUR);
    const future = new Date(Date.now() + HOUR);
    await server.db.insert(authSessionsTable).values([
      { userId: user.id, tokenHash: "expired-session", expiresAt: past },
      { userId: user.id, tokenHash: "live-session", expiresAt: future },
    ]);
    await server.db.insert(emailVerificationsTable).values([
      { userId: user.id, tokenHash: "expired-verification", expiresAt: past },
      { userId: user.id, tokenHash: "live-verification", expiresAt: future },
    ]);
    await server.db.insert(passwordResetsTable).values([
      { userId: user.id, tokenHash: "expired-reset", expiresAt: past },
      { userId: user.id, tokenHash: "live-reset", expiresAt: future },
    ]);
    await server.db.insert(rateLimitBucketsTable).values([
      { key: "expired-bucket", count: 5, resetAt: past },
      { key: "live-bucket", count: 5, resetAt: future },
    ]);

    await t.test("rejects a missing or wrong secret", async () => {
      assert.equal((await client.req("GET", "/api/internal/retention")).status, 401);
      assert.equal(
        (await client.req("GET", "/api/internal/retention", undefined, { Authorization: "Bearer wrong" })).status,
        401,
      );
    });

    await t.test("deletes expired operational rows and keeps live ones", async () => {
      const deleted = await client.req("GET", "/api/internal/retention", undefined, {
        Authorization: "Bearer test-cron-secret",
      });
      assert.equal(deleted.status, 200);
      assert.deepEqual(deleted.json.deleted, {
        authSessions: 1,
        emailVerifications: 1,
        passwordResets: 1,
        rateLimitBuckets: 1,
      });

      const sessions = await server.db.select().from(authSessionsTable);
      assert.ok(sessions.every((r) => r.tokenHash !== "expired-session"));
      assert.ok(sessions.some((r) => r.tokenHash === "live-session"));
      assert.deepEqual(
        (await server.db.select().from(emailVerificationsTable)).map((r) => r.tokenHash),
        ["live-verification"],
      );
      assert.deepEqual(
        (await server.db.select().from(passwordResetsTable)).map((r) => r.tokenHash),
        ["live-reset"],
      );
      const buckets = (await server.db.select().from(rateLimitBucketsTable)).map((r) => r.key);
      assert.ok(!buckets.includes("expired-bucket"));
      assert.ok(buckets.includes("live-bucket"));
    });

    await t.test("is invisible when CRON_SECRET is not configured", async () => {
      process.env.CRON_SECRET = "";
      assert.equal((await client.req("GET", "/api/internal/retention")).status, 404);
      process.env.CRON_SECRET = "test-cron-secret";
    });
  } finally {
    delete process.env.CRON_SECRET;
    await server.close();
  }
});
