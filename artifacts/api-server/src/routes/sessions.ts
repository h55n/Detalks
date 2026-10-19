import { Router, type IRouter, type Request, type Response } from "express";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import {
  moodEntriesTable,
  sessionMessagesTable,
  talkSessionsTable,
  type Database,
} from "@workspace/db";
import { currentUser, requireAuth } from "../lib/auth";
import { kavachReply, kavachScan } from "../lib/kavach";
import type { SafetyScanner } from "../lib/model-safety";
import type { ChatTurn, DishaResponder } from "../lib/disha";

const SESSION_LIMIT_MINUTES = 45;
const MESSAGE_LIMIT = 200;

const startSchema = z.object({
  arrivalState: z.string().trim().min(1).max(120),
  consentVersion: z.literal("groq-v1"),
});

const messageSchema = z.object({
  content: z.string().trim().min(1).max(2000),
});

const endSchema = z.object({
  postMood: z.number().int().min(1).max(5).optional(),
  reflection: z.string().trim().max(1000).optional(),
});

function openingMessage(arrivalState: string): string {
  const openings: Record<string, string> = {
    "Feeling steady":
      "Good to have you here, and lovely that you're arriving steady. What's been going well lately?",
    "A little wobbly":
      "Thanks for being honest about that — wobbly is welcome here. What's been shaking things up?",
    "Carrying something heavy":
      "I'm really glad you came. Whatever the heavy thing is, you don't have to hold it alone for the next while. Do you want to tell me about it?",
    "I just need to be heard":
      "Then I'm all ears, no fixing, no judgement. Say it however it comes.",
  };
  return (
    openings[arrivalState] ??
    "I'm here and listening. What's been on your mind today?"
  );
}

export function createSessionsRouter(
  db: Database,
  disha: DishaResponder,
  scan: SafetyScanner = async (text) => kavachScan(text),
): IRouter {
  const router: IRouter = Router();
  router.use(requireAuth(db));

  // History list, newest first, with duration and message counts.
  router.get("/sessions", async (_req, res) => {
    const userId = currentUser(res).id;
    const sessions = await db
      .select()
      .from(talkSessionsTable)
      .where(eq(talkSessionsTable.userId, userId))
      .orderBy(desc(talkSessionsTable.createdAt))
      .limit(50);
    const sessionIds = sessions.map(s => s.id);
    const counts = sessionIds.length ? await db
      .select({
        sessionId: sessionMessagesTable.sessionId,
        count: sql<number>`count(*)::int`,
      })
      .from(sessionMessagesTable)
      .where(inArray(sessionMessagesTable.sessionId, sessionIds))
      .groupBy(sessionMessagesTable.sessionId) : [];
    const countBySession = new Map(counts.map((c) => [c.sessionId, c.count]));
    res.json({
      sessions: sessions.map((s) => {
        const end = s.endedAt ?? new Date();
        const durationMin = Math.max(
          1,
          Math.round((end.getTime() - new Date(s.createdAt).getTime()) / 60000),
        );
        return {
          id: s.id,
          arrivalState: s.arrivalState,
          createdAt: s.createdAt,
          endedAt: s.endedAt,
          durationMin,
          messageCount: countBySession.get(s.id) ?? 0,
          reflection: s.reflection,
          postMood: s.postMood,
        };
      }),
    });
  });

  router.post("/sessions", async (req, res) => {
    const parsed = startSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Review chat consent, then pick how you are arriving today" });
      return;
    }
    const userId = currentUser(res).id;
    const [session] = await db
      .insert(talkSessionsTable)
      .values({ userId, arrivalState: parsed.data.arrivalState, consentVersion: parsed.data.consentVersion })
      .returning();
    const [opening] = await db
      .insert(sessionMessagesTable)
      .values({
        sessionId: session.id,
        role: "companion",
        content: openingMessage(parsed.data.arrivalState),
      })
      .returning();
    res.status(201).json({ session, messages: [opening] });
  });

  async function loadOwnedSession(req: Request, res: Response) {
    if (!z.string().uuid().safeParse(req.params.id).success) return null;
    const rows = await db
      .select()
      .from(talkSessionsTable)
      .where(
        and(
          eq(talkSessionsTable.id, req.params.id as string),
          eq(talkSessionsTable.userId, currentUser(res).id),
        ),
      )
      .limit(1);
    return rows[0] ?? null;
  }

  router.get("/sessions/:id/messages", async (req, res) => {
    const session = await loadOwnedSession(req, res);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }
    const messages = await db
      .select()
      .from(sessionMessagesTable)
      .where(eq(sessionMessagesTable.sessionId, session.id))
      .orderBy(asc(sessionMessagesTable.createdAt))
      .limit(MESSAGE_LIMIT + 10);
    res.json({ session, messages });
  });

  router.post("/sessions/:id/messages", async (req, res) => {
    const session = await loadOwnedSession(req, res);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }
    if (session.consentVersion !== "groq-v1") {
      res.status(409).json({ error: "This older session needs updated AI consent. Start a new session from Talk." });
      return;
    }
    if (session.endedAt) {
      res.status(409).json({ error: "This session has ended" });
      return;
    }
    const ageMs = Date.now() - new Date(session.createdAt).getTime();
    if (ageMs > SESSION_LIMIT_MINUTES * 60 * 1000) {
      await db
        .update(talkSessionsTable)
        .set({ endedAt: new Date() })
        .where(eq(talkSessionsTable.id, session.id));
      res.status(409).json({ error: "This session has ended" });
      return;
    }
    const parsed = messageSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Say something first" });
      return;
    }

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(sessionMessagesTable)
      .where(eq(sessionMessagesTable.sessionId, session.id));
    if (count >= MESSAGE_LIMIT) {
      res
        .status(429)
        .json({ error: "This session is full. Start a fresh one when you're ready." });
      return;
    }

    const content = parsed.data.content;
    const { flagged } = await scan(content);
    const [userMessage] = await db
      .insert(sessionMessagesTable)
      .values({ sessionId: session.id, role: "user", content, flagged })
      .returning();

    let replyText: string;
    let replyFlagged = false;
    if (flagged) {
      replyText = kavachReply();
      replyFlagged = true;
    } else {
      const historyRows = await db
        .select()
        .from(sessionMessagesTable)
        .where(eq(sessionMessagesTable.sessionId, session.id))
        .orderBy(desc(sessionMessagesTable.createdAt))
        .limit(20);
      const history: ChatTurn[] = historyRows.reverse().map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));
      replyText = await disha(history);
      // Never show generated crisis instructions as an ordinary companion reply.
      if (kavachScan(replyText).flagged) { replyText = kavachReply(); replyFlagged = true; }
    }

    const [companionMessage] = await db
      .insert(sessionMessagesTable)
      .values({
        sessionId: session.id,
        role: "companion",
        content: replyText,
        flagged: replyFlagged,
      })
      .returning();

    res.status(201).json({ userMessage, companionMessage, flagged });
  });

  router.post("/sessions/:id/end", async (req, res) => {
    const session = await loadOwnedSession(req, res);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }
    const parsed = endSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid reflection" });
      return;
    }
    const [updated] = await db
      .update(talkSessionsTable)
      .set({
        endedAt: session.endedAt ?? new Date(),
        postMood: parsed.data.postMood ?? session.postMood,
        reflection: parsed.data.reflection ?? session.reflection,
      })
      .where(eq(talkSessionsTable.id, session.id))
      .returning();

    // A post-session mood also counts as a check-in.
    if (parsed.data.postMood && session.postMood === null) {
      await db.insert(moodEntriesTable).values({
        userId: currentUser(res).id,
        mood: parsed.data.postMood,
        note: "After a companion session",
      });
    }

    res.json({ session: updated });
  });

  return router;
}
