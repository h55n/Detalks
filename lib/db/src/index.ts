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
  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });
  return {
    db,
    pool,
    migrate: () => migrate(pool as SqlExecutor),
  };
}

export * from "./schema";
export { migrate, type SqlExecutor };
