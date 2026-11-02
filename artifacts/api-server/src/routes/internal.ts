import { Router, type IRouter, type Request, type Response } from "express";
import { timingSafeEqual } from "node:crypto";
import type { Database } from "@workspace/db";
import { runRetention } from "../lib/retention";

// Operational endpoints, never linked from the app. The retention pass is
// triggered by the daily Vercel cron, which authenticates with
// `Authorization: Bearer $CRON_SECRET`, and can also be run by hand with
// `pnpm --filter @workspace/api-server run retention`.
export function createInternalRouter(db: Database): IRouter {
  const router: IRouter = Router();

  const retention = async (req: Request, res: Response) => {
    const secret = process.env.CRON_SECRET;
    if (!secret) {
      // Not configured: behave like any unknown route rather than advertise
      // that an operational endpoint exists here.
      res.status(404).json({ error: "Not found" });
      return;
    }
    const presented = (req.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
    const ok =
      presented.length === secret.length &&
      timingSafeEqual(Buffer.from(presented), Buffer.from(secret));
    if (!ok) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const deleted = await runRetention(db);
    res.json({ ok: true, deleted });
  };

  // Vercel cron only issues GET; allow POST for manual triggers.
  router.get("/internal/retention", retention);
  router.post("/internal/retention", retention);
  return router;
}
