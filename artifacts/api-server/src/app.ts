import express, { type Express, type NextFunction, type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import pinoHttp from "pino-http";
import healthRouter from "./routes/health";
import { createAuthRouter } from "./routes/auth";
import { createMoodsRouter } from "./routes/moods";
import { createJournalRouter } from "./routes/journal";
import { createProgressRouter } from "./routes/progress";
import { createSessionsRouter } from "./routes/sessions";
import { createCirclesRouter } from "./routes/circles";
import { createAccountRouter } from "./routes/account";
import { createDishaResponder, dishaConfigFromEnv, type DishaResponder } from "./lib/disha";
import type { Database } from "@workspace/db";
import { logger } from "./lib/logger";

export interface AppDeps {
  db: Database;
  disha?: DishaResponder;
}

// Small fixed-window rate limiter for the auth endpoints. In-memory is fine
// for a single-process deployment; it exists to slow down brute force.
const buckets = new Map<string, { count: number; resetAt: number }>();
function rateLimit(limit: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.ip ?? "unknown"}:${req.path}`;
    const now = Date.now();
    if (buckets.size > 5000) {
      for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k);
    }
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt < now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }
    bucket.count += 1;
    if (bucket.count > limit) {
      res.status(429).json({ error: "Too many attempts. Wait a few minutes and try again." });
      return;
    }
    next();
  };
}

export function createApp({ db, disha }: AppDeps): Express {
  const app = express();
  app.disable("x-powered-by");
  // Behind Vercel/Render the client IP arrives in X-Forwarded-For. Without
  // this every visitor shares the proxy address and one rate-limit bucket.
  app.set("trust proxy", 1);
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Cache-Control", "no-store");
    next();
  });

  app.use(
    pinoHttp({
      logger,
      serializers: {
        req(req) {
          return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
        },
        res(res) {
          return { statusCode: res.statusCode };
        },
      },
    }),
  );

  // The app is served same-origin in production and through the Vite proxy
  // in dev, so cross-origin access stays off unless explicitly configured.
  if (process.env.CORS_ORIGIN) {
    app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
  }

  app.use(express.json({ limit: "64kb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  const authRateLimit = rateLimit(30, 15 * 60 * 1000);

  app.use("/api", healthRouter);
  app.use(["/api/auth/login", "/api/auth/signup"], authRateLimit);
  app.use("/api", createAuthRouter(db));
  app.use("/api", createMoodsRouter(db));
  app.use("/api", createJournalRouter(db));
  app.use("/api", createProgressRouter(db));
  app.use("/api", createSessionsRouter(db, disha ?? createDishaResponder(dishaConfigFromEnv(process.env))));
  app.use("/api", createCirclesRouter(db));
  app.use("/api", createAccountRouter(db));

  // JSON 404 for unknown API routes
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  // Central error handler: no stack traces leak to clients.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    logger.error({ err }, "Unhandled error");
    res.status(500).json({ error: "Something went wrong on our side" });
  });

  return app;
}
