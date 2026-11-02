// Manual retention pass: DATABASE_URL=postgres://... pnpm --filter @workspace/api-server run retention
import { createDb } from "@workspace/db";
import { runRetention } from "./lib/retention";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const { db, pool } = createDb(connectionString!);
try {
  const deleted = await runRetention(db);
  console.log(JSON.stringify({ ok: true, deleted }));
} finally {
  await pool.end();
}
