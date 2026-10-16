import { pgTable, uuid, text, timestamp, primaryKey, index } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const circlePostsTable = pgTable(
  "circle_posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    circleId: text("circle_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    alias: text("alias").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("circle_posts_circle_idx").on(t.circleId, t.createdAt)],
);

export const circlePostLikesTable = pgTable(
  "circle_post_likes",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => circlePostsTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.postId, t.userId] })],
);

export type CirclePost = typeof circlePostsTable.$inferSelect;
