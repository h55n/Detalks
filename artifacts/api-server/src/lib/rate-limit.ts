import type { NextFunction, Request, Response } from "express";
import { sql } from "drizzle-orm";
import type { Database } from "@workspace/db";
import { logger } from "./logger";

// Fixed-window rate limiting backed by Postgres, so the limit holds across
// serverless instances and restarts (the in-memory limiter it replaces was
// per process and reset on every cold start). The upsert is one atomic
// statement: concurrent requests cannot overshoot the window together.
export function createDbRateLimit(db: Database, limit: number, windowMs: number) {
  const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000));
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // originalUrl survives the app.use mount strip, so each endpoint gets
    // its own bucket instead of sharing one per mount point.
    const path = (req.originalUrl || req.url || "").split("?")[0];
    const key = `${req.ip ?? "unknown"}:${path}`;
    try {
      const result = await db.execute(sql`
        INSERT INTO rate_limit_buckets AS b (key, count, reset_at)
        VALUES (${key}, 1, now() + make_interval(secs => ${windowSeconds}))
        ON CONFLICT (key) DO UPDATE SET
          count = CASE WHEN b.reset_at <= now() THEN 1 ELSE b.count + 1 END,
          reset_at = CASE WHEN b.reset_at <= now()
            THEN now() + make_interval(secs => ${windowSeconds})
            ELSE b.reset_at END
        RETURNING count
      `);
      const count = Number((result.rows[0] as { count?: number } | undefined)?.count ?? 1);
      if (count > limit) {
        res.status(429).json({ error: "Too many attempts. Wait a few minutes and try again." });
        return;
      }
      // Opportunistic cleanup so expired buckets do not accumulate.
      if (Math.random() < 0.02) {
        await db.execute(sql`DELETE FROM rate_limit_buckets WHERE reset_at <= now()`).catch(() => undefined);
      }
      next();
    } catch (err) {
      // The endpoints behind this limiter need the database anyway, so a
      // limiter outage fails closed with the same busy signal as the pool.
      logger.error({ err }, "Rate limiter unavailable");
      res.setHeader("Retry-After", "10");
      res.status(503).json({ error: "The service is busy. Please try again shortly." });
    }
  };
}
