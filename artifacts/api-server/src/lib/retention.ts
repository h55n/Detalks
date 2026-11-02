import { sql } from "drizzle-orm";
import type { Database } from "@workspace/db";
import { logger } from "./logger";

export interface RetentionResult {
  authSessions: number;
  emailVerifications: number;
  passwordResets: number;
  rateLimitBuckets: number;
}

// Data retention, applied in one pass. Personal content (moods, journal,
// sessions, circle posts) belongs to the account holder and stays until they
// export or delete it. What expires here is operational state that outlives
// its purpose: dead login sessions, burnt verification and reset tokens, and
// spent rate-limit windows. See docs/RETENTION.md.
async function deleteExpired(db: Database, statement: ReturnType<typeof sql>): Promise<number> {
  const result = await db.execute(statement);
  return result.rows.length;
}

export async function runRetention(db: Database): Promise<RetentionResult> {
  // RETURNING lets one statement report what it removed on both the
  // node-postgres and PGlite drivers.
  const result: RetentionResult = {
    authSessions: await deleteExpired(db, sql`DELETE FROM auth_sessions WHERE expires_at <= now() RETURNING 1`),
    emailVerifications: await deleteExpired(db, sql`DELETE FROM email_verifications WHERE expires_at <= now() RETURNING 1`),
    passwordResets: await deleteExpired(db, sql`DELETE FROM password_resets WHERE expires_at <= now() RETURNING 1`),
    rateLimitBuckets: await deleteExpired(db, sql`DELETE FROM rate_limit_buckets WHERE reset_at <= now() RETURNING 1`),
  };
  logger.info({ deleted: result }, "Retention pass complete");
  return result;
}
