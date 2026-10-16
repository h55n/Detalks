import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgDatabase } from "drizzle-orm/pg-core";
import type { PgQueryResultHKT } from "drizzle-orm/pg-core";
import pg from "pg";
import * as schema from "./schema";
import { migrate, type SqlExecutor } from "./migrate";

const { Pool } = pg;

// Works for the production node-postgres driver and for the PGlite driver
// used in tests: both are PgDatabase specialisations.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = PgDatabase<any, typeof schema>;

export interface DbHandle {
  db: NodePgDatabase<typeof schema>;
  pool: pg.Pool;
  migrate: () => Promise<string[]>;
}

export function createDb(connectionString: string): DbHandle {
  // Managed Postgres providers (Aiven, Render) terminate TLS with a private
  // CA the host does not carry. sslmode=require already encrypts the wire;
  // skip chain verification so the driver can connect without a bundled CA.
  const wantsSsl = /sslmode=(require|verify-ca|verify-full)/.test(connectionString);
  // pg-connection-string maps sslmode=require to verify-full and lets URL
  // params win over the config object, so strip it and pass TLS options
  // directly instead.
  const cleaned = connectionString
    .replace(/([?&])sslmode=[^&]*&?/, "$1")
    .replace(/[?&]$/, "");
  const pool = new Pool({
    connectionString: cleaned,
    ...(wantsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
    // Serverless instances idle for a while and the managed Postgres drops
    // quiet connections. Keep the pool small, probe with TCP keepalive and
    // recycle idle clients quickly so a dead socket is not reused.
    max: 5,
    idleTimeoutMillis: 8_000,
    connectionTimeoutMillis: 10_000,
    keepAlive: true,
  });
  // A backend-side disconnect of an idle client must not crash the process.
  pool.on("error", () => undefined);
  const db = drizzle(pool, { schema });
  return {
    db,
    pool,
    migrate: () => migrate(pool as SqlExecutor),
  };
}

export * from "./schema";
export { migrate, type SqlExecutor };
