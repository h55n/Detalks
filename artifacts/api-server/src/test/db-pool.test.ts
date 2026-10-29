import assert from "node:assert/strict";
import test from "node:test";
import { createDb } from "@workspace/db";

// Inspect the real pg.Pool without connecting to a database. These checks
// cover client configuration only, not deployed overrides or server capacity.
async function withPool(
  max: string | undefined,
  check: (pool: ReturnType<typeof createDb>["pool"]) => void,
) {
  const previous = process.env["DB_POOL_MAX"];
  if (max === undefined) delete process.env["DB_POOL_MAX"];
  else process.env["DB_POOL_MAX"] = max;
  const { pool } = createDb("postgres://local:unused@127.0.0.1:1/test");
  try {
    check(pool);
    assert.equal(
      pool.totalCount,
      0,
      "constructing a pool must not open sockets",
    );
  } finally {
    await pool.end();
    if (previous === undefined) delete process.env["DB_POOL_MAX"];
    else process.env["DB_POOL_MAX"] = previous;
  }
}

test("database pool defaults to two clients without opening a connection", async () => {
  await withPool(undefined, (pool) => assert.equal(pool.options.max, 2));
});

test("database pool honors an explicit connection limit", async () => {
  await withPool("3", (pool) => assert.equal(pool.options.max, 3));
});

test("database pool recycles idle clients and bounds connection waits", async () => {
  await withPool(undefined, (pool) => {
    assert.equal(pool.options.idleTimeoutMillis, 2_000);
    assert.equal(pool.options.connectionTimeoutMillis, 10_000);
    assert.equal(pool.options.keepAlive, true);
  });
});

test("database pool identifies the app and sets a server-side idle backstop", async () => {
  await withPool(undefined, (pool) => {
    assert.equal(pool.options.application_name, "detalks");
    assert.equal(pool.options.options, "-c idle_session_timeout=60000");
  });
});

test("an idle-client error is handled without taking down the process", async () => {
  await withPool(undefined, (pool) => {
    assert.equal(pool.listenerCount("error"), 1);
    assert.doesNotThrow(() =>
      pool.emit("error", new Error("idle connection dropped")),
    );
  });
});
