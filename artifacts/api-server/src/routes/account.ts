import { Router, type IRouter } from "express";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import {
  circlePostsTable,
  journalEntriesTable,
  moodEntriesTable,
  sessionMessagesTable,
  talkSessionsTable,
  usersTable,
  type Database,
} from "@workspace/db";
import { clearSessionCookie, currentUser, publicUser, requireAuth } from "../lib/auth";
import { verifyPassword } from "../lib/password";

const deleteSchema = z.object({ password: z.string().min(1).max(200) });

export function createAccountRouter(db: Database): IRouter {
  const router: IRouter = Router();
  router.use(requireAuth(db));

  // Everything DeTalks holds about the signed-in person, as one JSON file.
  router.get("/account/export", async (_req, res) => {
    const user = currentUser(res);
    const [moods, journal, sessions, posts] = await Promise.all([
      db.select().from(moodEntriesTable).where(eq(moodEntriesTable.userId, user.id)),
      db.select().from(journalEntriesTable).where(eq(journalEntriesTable.userId, user.id)),
      db.select().from(talkSessionsTable).where(eq(talkSessionsTable.userId, user.id)),
      db.select().from(circlePostsTable).where(eq(circlePostsTable.userId, user.id)),
    ]);
    const ids = sessions.map((s) => s.id);
    const messages = ids.length
      ? await db.select().from(sessionMessagesTable).where(inArray(sessionMessagesTable.sessionId, ids))
      : [];
    res.setHeader("Content-Disposition", 'attachment; filename="detalks-export.json"');
    res.json({
      exportedAt: new Date().toISOString(),
      account: publicUser(user),
      moods,
      journal,
      sessions: sessions.map((s) => ({
        ...s,
        messages: messages.filter((m) => m.sessionId === s.id),
      })),
      circlePosts: posts,
    });
  });

  // Permanent deletion. Related rows go with the user through ON DELETE CASCADE.
  router.delete("/account", async (req, res) => {
    const parsed = deleteSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Enter your password to confirm" });
      return;
    }
    const user = currentUser(res);
    if (!(await verifyPassword(parsed.data.password, user.passwordHash))) {
      res.status(403).json({ error: "That password doesn't match" });
      return;
    }
    await db.delete(usersTable).where(eq(usersTable.id, user.id));
    clearSessionCookie(res);
    res.json({ ok: true });
  });

  return router;
}
