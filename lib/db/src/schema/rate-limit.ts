import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const rateLimitBucketsTable = pgTable("rate_limit_buckets", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
});

export type RateLimitBucket = typeof rateLimitBucketsTable.$inferSelect;
