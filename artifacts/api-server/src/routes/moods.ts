import { Router, type IRouter } from "express";
import { and, desc, eq, gte } from "drizzle-orm";
import { z } from "zod";
import { moodEntriesTable, type Database } from "@workspace/db";
import { currentUser, requireAuth } from "../lib/auth";

const moodSchema = z.object({
  mood: z.number().int().min(1).max(5),
  note: z.string().trim().max(500).optional(),
});

export function createMoodsRouter(db: Database): IRouter {
  const router: IRouter = Router();
  router.use(requireAuth(db));

  router.get("/moods", async (req, res) => {
    const days = Math.min(Number(req.query.days) || 30, 365);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const entries = await db
      .select()
      .from(moodEntriesTable)
      .where(
        and(
          eq(moodEntriesTable.userId, currentUser(res).id),
          gte(moodEntriesTable.createdAt, since),
        ),
      )
      .orderBy(desc(moodEntriesTable.createdAt))
      .limit(500);
    res.json({ entries });
  });

  router.post("/moods", async (req, res) => {
    const parsed = moodSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Pick a mood from 1 to 5" });
      return;
    }
    const rows = await db
      .insert(moodEntriesTable)
      .values({
        userId: currentUser(res).id,
        mood: parsed.data.mood,
        note: parsed.data.note || null,
      })
      .returning();
    res.status(201).json({ entry: rows[0] });
  });

  return router;
}
