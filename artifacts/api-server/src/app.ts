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
import { createInternalRouter } from "./routes/internal";
import { createDishaResponder, dishaConfigFromEnv, type DishaResponder } from "./lib/disha";
import { verificationSenderFromEnv, type VerificationSender } from "./lib/verification";
import { passwordResetSenderFromEnv, type PasswordResetSender } from "./lib/password-reset";
import { createDbRateLimit } from "./lib/rate-limit";
import { createSafetyScanner, type SafetyScanner } from "./lib/model-safety";
import type { Database } from "@workspace/db";
import { logger } from "./lib/logger";

export interface AppDeps {
  db: Database;
  disha?: DishaResponder;
  sendVerification?: VerificationSender;
  sendPasswordReset?: PasswordResetSender;
  // Tests shrink the window/limit; production uses the defaults.
  authRateLimit?: { limit: number; windowMs: number };
  safety?: SafetyScanner;
  // Per-account/per-network volume quotas (release gate 3); tests shrink
  // these to tiny numbers, production uses the defaults.
  quotas?: {
    signupPerDay?: number;
    circlePostsPerDay?: number;
    circleLikesPerDay?: number;
    sessionsPerDay?: number;
    sessionMessagesPerDay?: number;
  };
}

export function createApp({ db, disha, sendVerification, sendPasswordReset, safety, authRateLimit, quotas }: AppDeps): Express {
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

  const authLimiter = createDbRateLimit(db, authRateLimit?.limit ?? 30, authRateLimit?.windowMs ?? 15 * 60 * 1000);
  // The burst limiter slows credential attacks; this one caps account
  // creation volume per network per day (release gate 3).
  const signupDailyLimiter = createDbRateLimit(db, quotas?.signupPerDay ?? 10, 24 * 60 * 60 * 1000, {
    bucket: "signup-daily",
    message: "Too many new accounts from this network today. Please try again tomorrow.",
  });

  app.use("/api", healthRouter);
  app.use("/api/auth/signup", signupDailyLimiter);
  app.use(["/api/auth/login", "/api/auth/signup", "/api/auth/verification/request", "/api/auth/verification/confirm", "/api/auth/password/forgot", "/api/auth/password/reset"], authLimiter);
  app.use("/api", createAuthRouter(db, sendVerification ?? verificationSenderFromEnv(process.env), sendPasswordReset ?? passwordResetSenderFromEnv(process.env)));
  app.use("/api", createMoodsRouter(db));
  app.use("/api", createJournalRouter(db));
  app.use("/api", createProgressRouter(db));
  const modelConfig = dishaConfigFromEnv(process.env);
  const scan = safety ?? createSafetyScanner(modelConfig);
  app.use("/api", createSessionsRouter(db, disha ?? createDishaResponder(modelConfig), scan, {
    sessionsPerDay: quotas?.sessionsPerDay,
    messagesPerDay: quotas?.sessionMessagesPerDay,
  }));
  app.use("/api", createCirclesRouter(db, scan, {
    postsPerDay: quotas?.circlePostsPerDay,
    likesPerDay: quotas?.circleLikesPerDay,
  }));
  app.use("/api", createInternalRouter(db));
  app.use("/api", createAccountRouter(db));

  // JSON 404 for unknown API routes
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  // Central error handler: no stack traces leak to clients.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    logger.error({ err }, "Unhandled error");
    // Drizzle may wrap the driver's capacity/unavailable error in `cause`.
    const dbError = err as { code?: string; cause?: { code?: string } };
    if ([dbError?.code, dbError?.cause?.code].some(code => code === "53300" || code === "57P03")) {
      res.setHeader("Retry-After", "10");
      res.status(503).json({ error: "The service is busy. Please try again shortly." });
      return;
    }
    const status = (err as { status?: number })?.status;
    if (status === 400 || status === 413) {
      res.status(status).json({ error: status === 413 ? "That message is too large" : "Invalid request body" });
      return;
    }
    res.status(500).json({ error: "Something went wrong on our side" });
  });

  return app;
}
