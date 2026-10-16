import { Router, type IRouter } from "express";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import {
  circlePostLikesTable,
  circlePostsTable,
  type Database,
} from "@workspace/db";
import { currentUser, requireAuth } from "../lib/auth";
import { CIRCLES, isCircleId } from "../lib/circles";
import { CRISIS_RESOURCES, kavachScan } from "../lib/kavach";

const postSchema = z.object({
  content: z.string().trim().min(1).max(1000),
});

export function createCirclesRouter(db: Database): IRouter {
  const router: IRouter = Router();
  router.use(requireAuth(db));

  // Circle summaries: the six circles, how many voices each holds, and the
  // latest anonymous excerpt for the list preview.
  router.get("/circles", async (_req, res) => {
    const summaries = await Promise.all(
      CIRCLES.map(async (circle) => {
        const [{ count }] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(circlePostsTable)
          .where(eq(circlePostsTable.circleId, circle.id));
        const latest = await db
          .select()
          .from(circlePostsTable)
          .where(eq(circlePostsTable.circleId, circle.id))
          .orderBy(desc(circlePostsTable.createdAt))
          .limit(1);
        return {
          ...circle,
          voices: count,
          latest: latest[0]
            ? { alias: latest[0].alias, excerpt: latest[0].content.slice(0, 120) }
            : null,
        };
      }),
    );
    res.json({ circles: summaries });
  });

  router.get("/circles/:circleId/posts", async (req, res) => {
    const circleId = req.params.circleId as string;
    if (!isCircleId(circleId)) {
      res.status(404).json({ error: "Circle not found" });
      return;
    }
    const userId = currentUser(res).id;
    const posts = await db
      .select()
      .from(circlePostsTable)
      .where(eq(circlePostsTable.circleId, circleId))
      .orderBy(desc(circlePostsTable.createdAt))
      .limit(100);
    const likes = await db
      .select({
        postId: circlePostLikesTable.postId,
        count: sql<number>`count(*)::int`,
      })
      .from(circlePostLikesTable)
      .groupBy(circlePostLikesTable.postId);
    const myLikes = await db
      .select({ postId: circlePostLikesTable.postId })
      .from(circlePostLikesTable)
      .where(eq(circlePostLikesTable.userId, userId));
    const likeCount = new Map(likes.map((l) => [l.postId, l.count]));
    const mine = new Set(myLikes.map((l) => l.postId));
    res.json({
      posts: posts.map((p) => ({
        id: p.id,
        alias: p.alias,
        content: p.content,
        createdAt: p.createdAt,
        likes: likeCount.get(p.id) ?? 0,
        likedByMe: mine.has(p.id),
      })),
    });
  });

  router.post("/circles/:circleId/posts", async (req, res) => {
    const circleId = req.params.circleId as string;
    if (!isCircleId(circleId)) {
      res.status(404).json({ error: "Circle not found" });
      return;
    }
    const parsed = postSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Write something before posting" });
      return;
    }
    // Kavach also guards the shared spaces: a post in crisis language is not
    // published to the circle, and the writer is pointed to real help instead.
    if (kavachScan(parsed.data.content).flagged) {
      res.status(422).json({
        error:
          "This sounds heavy, and it deserves more care than a shared circle can give. Your post was not shared. Please call Tele-MANAS 14416 (free, 24/7) or 112 if you are in danger. Disha is also here to talk, privately.",
        flagged: true,
        resources: CRISIS_RESOURCES,
      });
      return;
    }
    const user = currentUser(res);
    const [post] = await db
      .insert(circlePostsTable)
      .values({
        circleId,
        userId: user.id,
        alias: user.alias,
        content: parsed.data.content,
      })
      .returning();
    res.status(201).json({
      post: {
        id: post.id,
        alias: post.alias,
        content: post.content,
        createdAt: post.createdAt,
        likes: 0,
        likedByMe: false,
      },
    });
  });

  router.post("/circles/posts/:postId/like", async (req, res) => {
    const postId = req.params.postId as string;
    const userId = currentUser(res).id;
    const existing = await db
      .select()
      .from(circlePostLikesTable)
      .where(
        and(
          eq(circlePostLikesTable.postId, postId),
          eq(circlePostLikesTable.userId, userId),
        ),
      )
      .limit(1);
    if (existing.length > 0) {
      await db
        .delete(circlePostLikesTable)
        .where(
          and(
            eq(circlePostLikesTable.postId, postId),
            eq(circlePostLikesTable.userId, userId),
          ),
        );
    } else {
      await db.insert(circlePostLikesTable).values({ postId, userId });
    }
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(circlePostLikesTable)
      .where(eq(circlePostLikesTable.postId, postId));
    res.json({ likes: count, likedByMe: existing.length === 0 });
  });

  return router;
}
