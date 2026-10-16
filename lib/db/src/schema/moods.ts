import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const moodEntriesTable = pgTable(
  "mood_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    mood: integer("mood").notNull(),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("mood_entries_user_idx").on(t.userId, t.createdAt)],
);

export type MoodEntry = typeof moodEntriesTable.$inferSelect;
