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

export interface TlsConfig {
  cleanedConnectionString: string;
  ssl?: { rejectUnauthorized: boolean; ca?: string };
}

// Managed Postgres providers (Aiven, Render) terminate TLS with a private CA
// the host does not carry. sslmode=require already encrypts the wire; until
// the provider CA is supplied through DATABASE_CA_CERT we skip chain
// verification so the driver can connect without a bundled CA. With
// DATABASE_CA_CERT set (PEM, newlines preserved) the connection upgrades to
// full chain verification - the release gate is providing the CA, not code.
export function resolveTlsConfig(
  connectionString: string,
  env: NodeJS.ProcessEnv = process.env,
): TlsConfig {
  const wantsSsl = /sslmode=(require|verify-ca|verify-full)/.test(connectionString);
  // pg-connection-string maps sslmode=require to verify-full and lets URL
  // params win over the config object, so strip it and pass TLS options
  // directly instead.
  const cleaned = connectionString
    .replace(/([?&])sslmode=[^&]*&?/, "$1")
    .replace(/[?&]$/, "");
  if (!wantsSsl) return { cleanedConnectionString: cleaned };
  const ca = env.DATABASE_CA_CERT;
  if (ca && ca.includes("BEGIN CERTIFICATE")) {
    return { cleanedConnectionString: cleaned, ssl: { rejectUnauthorized: true, ca } };
  }
  return { cleanedConnectionString: cleaned, ssl: { rejectUnauthorized: false } };
}

export function createDb(connectionString: string): DbHandle {
  const { cleanedConnectionString: cleaned, ssl } = resolveTlsConfig(connectionString);
  const pool = new Pool({
    connectionString: cleaned,
    ...(ssl ? { ssl } : {}),
    // Serverless instances idle for a while and the managed Postgres drops
    // quiet connections. Keep the pool small, probe with TCP keepalive and
    // recycle idle clients quickly so a dead socket is not reused.
    max: Number(process.env["DB_POOL_MAX"] ?? 2),
    // Server-side backstop also works while a serverless VM is suspended.
    // Only idle sessions are closed, never an active query or transaction.
    options: "-c idle_session_timeout=60000",
    application_name: "detalks",
    idleTimeoutMillis: 2_000,
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
