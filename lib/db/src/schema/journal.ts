import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const journalEntriesTable = pgTable(
  "journal_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    mood: integer("mood"),
    prompt: text("prompt"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("journal_entries_user_idx").on(t.userId, t.createdAt)],
);

export type JournalEntry = typeof journalEntriesTable.$inferSelect;
