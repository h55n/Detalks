import { Router, type IRouter } from "express";
import { and, desc, eq, gte } from "drizzle-orm";
import {
  journalEntriesTable,
  moodEntriesTable,
  talkSessionsTable,
  type Database,
} from "@workspace/db";
import { currentUser, requireAuth } from "../lib/auth";

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function createProgressRouter(db: Database): IRouter {
  const router: IRouter = Router();
  router.use(requireAuth(db));

  router.get("/progress", async (_req, res) => {
    const userId = currentUser(res).id;
    const [moods, journals, sessions] = await Promise.all([
      db
        .select()
        .from(moodEntriesTable)
        .where(eq(moodEntriesTable.userId, userId))
        .orderBy(desc(moodEntriesTable.createdAt))
        .limit(1000),
      db
        .select({ id: journalEntriesTable.id })
        .from(journalEntriesTable)
        .where(eq(journalEntriesTable.userId, userId)),
      db
        .select({ id: talkSessionsTable.id })
        .from(talkSessionsTable)
        .where(eq(talkSessionsTable.userId, userId)),
    ]);

    const daySet = new Set(moods.map((m) => dayKey(new Date(m.createdAt))));

    // Streak: consecutive days with a check-in, counting back from today
    // (or yesterday, if today has no check-in yet).
    let streak = 0;
    const cursor = new Date();
    if (!daySet.has(dayKey(cursor))) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (daySet.has(dayKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    // Last 7 days of mood, most recent entry of the day wins.
    const moodHistory: (number | null)[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const key = dayKey(day);
      const entry = moods.find((m) => dayKey(new Date(m.createdAt)) === key);
      moodHistory.push(entry ? entry.mood : null);
    }

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentMoods = await db
      .select()
      .from(moodEntriesTable)
      .where(
        and(
          eq(moodEntriesTable.userId, userId),
          gte(moodEntriesTable.createdAt, since),
        ),
      );

    res.json({
      sessionsCount: sessions.length,
      journalCount: journals.length,
      daysCheckedIn: daySet.size,
      streak,
      moodHistory,
      moodsLast30Days: recentMoods.length,
    });
  });

  return router;
}
