import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate, usersTable, emailVerificationsTable, type SqlExecutor } from "@workspace/db";
import * as schema from "@workspace/db/schema";
import { requestVerification, consumeVerification } from "../lib/verification";
import { Client, startTestServer, signup, type TestServer } from "./helpers";

let server: TestServer;
before(async () => { server = await startTestServer(); });
after(async () => { await server.close(); });

test("unverified accounts keep private tools but cannot write or react in circles", async () => {
  const client = new Client(server.baseUrl);
  const user = await signup(client, "unverified@example.com");
  assert.equal(((await client.get("/api/auth/me")).json.user as { emailVerified: boolean }).emailVerified, false);
  assert.equal((await client.post("/api/journal", { content: "Private reflection" })).status, 201);
  assert.equal((await client.post("/api/circles/academic/posts", { content: "Hello" })).status, 403);
  assert.equal((await client.post(`/api/circles/posts/${user.id}/like`)).status, 403);
  assert.equal((await client.post("/api/auth/verification/request")).status, 503);
  assert.equal((await client.post("/api/auth/verification/confirm", { token: "bad" })).status, 400);
});

test("verification tokens are hashed, account-bound, expiring and single-use", async () => {
  const pg = new PGlite();
  const executor: SqlExecutor = { query: (sql, params) => sql.trim().replace(/;+\s*$/, "").includes(";") ? pg.exec(sql) : pg.query(sql, params as unknown[]) };
  await migrate(executor);
  const db = drizzle(pg, { schema });
  const [a, b] = await db.insert(usersTable).values([
    { name: "A", email: "a@example.com", passwordHash: "unused", alias: "QuietMoon" },
    { name: "B", email: "b@example.com", passwordHash: "unused", alias: "QuietSun" },
  ]).returning();
  let link = "";
  await requestVerification(db, a, async (_email, url) => { link = url; }, "https://detalks.vercel.app");
  const token = new URLSearchParams(new URL(link).hash.slice(1)).get("token")!;
  const [stored] = await db.select().from(emailVerificationsTable);
  assert.notEqual(stored.tokenHash, token);
  assert.equal(new URL(link).search, "");
  assert.equal(await consumeVerification(db, token, b.id), false);
  assert.equal(await consumeVerification(db, token, a.id), true);
  assert.equal(await consumeVerification(db, token, a.id), false);
  await requestVerification(db, b, async (_email, url) => { link = url; }, "https://detalks.vercel.app");
  await db.update(emailVerificationsTable).set({ expiresAt: new Date(0) });
  const expired = new URLSearchParams(new URL(link).hash.slice(1)).get("token")!;
  assert.equal(await consumeVerification(db, expired, b.id), false);
  await assert.rejects(requestVerification(db, b, async () => { throw new Error("offline"); }, "https://detalks.vercel.app"));
  assert.equal((await db.select().from(emailVerificationsTable)).length, 1);
  await pg.close();
});
