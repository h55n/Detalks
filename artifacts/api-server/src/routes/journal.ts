import { Router, type IRouter } from "express";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { journalEntriesTable, type Database } from "@workspace/db";
import { currentUser, requireAuth } from "../lib/auth";

const entrySchema = z.object({
  content: z.string().trim().min(1).max(20000),
  mood: z.number().int().min(1).max(5).optional(),
  prompt: z.string().trim().max(300).optional(),
});

export function createJournalRouter(db: Database): IRouter {
  const router: IRouter = Router();
  router.use(requireAuth(db));

  router.get("/journal", async (_req, res) => {
    const entries = await db
      .select()
      .from(journalEntriesTable)
      .where(eq(journalEntriesTable.userId, currentUser(res).id))
      .orderBy(desc(journalEntriesTable.createdAt))
      .limit(200);
    res.json({ entries });
  });

  router.post("/journal", async (req, res) => {
    const parsed = entrySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Write something before saving" });
      return;
    }
    const rows = await db
      .insert(journalEntriesTable)
      .values({
        userId: currentUser(res).id,
        content: parsed.data.content,
        mood: parsed.data.mood ?? null,
        prompt: parsed.data.prompt ?? null,
      })
      .returning();
    res.status(201).json({ entry: rows[0] });
  });

  router.put("/journal/:id", async (req, res) => {
    const parsed = entrySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Write something before saving" });
      return;
    }
    const rows = await db
      .update(journalEntriesTable)
      .set({
        content: parsed.data.content,
        mood: parsed.data.mood ?? null,
        prompt: parsed.data.prompt ?? null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(journalEntriesTable.id, req.params.id),
          eq(journalEntriesTable.userId, currentUser(res).id),
        ),
      )
      .returning();
    if (rows.length === 0) {
      res.status(404).json({ error: "Entry not found" });
      return;
    }
    res.json({ entry: rows[0] });
  });

  router.delete("/journal/:id", async (req, res) => {
    const rows = await db
      .delete(journalEntriesTable)
      .where(
        and(
          eq(journalEntriesTable.id, req.params.id),
          eq(journalEntriesTable.userId, currentUser(res).id),
        ),
      )
      .returning({ id: journalEntriesTable.id });
    if (rows.length === 0) {
      res.status(404).json({ error: "Entry not found" });
      return;
    }
    res.json({ ok: true });
  });

  return router;
}
