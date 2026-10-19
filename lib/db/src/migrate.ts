import { migrations } from "./migrations";

export interface SqlExecutor {
  query(text: string, params?: unknown[]): Promise<unknown>;
}

/**
 * Applies pending migrations in order, tracked in _migrations.
 * Safe to run on every boot: already-applied migrations are skipped.
 */
export async function migrate(executor: SqlExecutor): Promise<string[]> {
  await executor.query(
    "CREATE TABLE IF NOT EXISTS _migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())",
  );
  const appliedResult = (await executor.query("SELECT name FROM _migrations")) as {
    rows: { name: string }[];
  };
  const applied = new Set(appliedResult.rows.map((r) => r.name));
  const ran: string[] = [];
  for (const m of migrations) {
    if (applied.has(m.name)) continue;
    await executor.query(m.sql);
    await executor.query("INSERT INTO _migrations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING", [m.name]);
    ran.push(m.name);
  }
  return ran;
}
