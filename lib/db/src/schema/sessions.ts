import { pgTable, uuid, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const talkSessionsTable = pgTable(
  "talk_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    arrivalState: text("arrival_state"),
    consentVersion: text("consent_version"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    postMood: integer("post_mood"),
    reflection: text("reflection"),
  },
  (t) => [index("talk_sessions_user_idx").on(t.userId, t.createdAt)],
);

export const sessionMessagesTable = pgTable(
  "session_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => talkSessionsTable.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["user", "companion"] }).notNull(),
    content: text("content").notNull(),
    flagged: boolean("flagged").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("session_messages_session_idx").on(t.sessionId, t.createdAt)],
);

export type TalkSession = typeof talkSessionsTable.$inferSelect;
export type SessionMessage = typeof sessionMessagesTable.$inferSelect;
