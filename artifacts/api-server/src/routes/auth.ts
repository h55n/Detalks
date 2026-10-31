import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { usersTable, type Database } from "@workspace/db";
import { hashPassword, verifyPassword } from "../lib/password";
import { consumeVerification, requestVerification, type VerificationSender } from "../lib/verification";
import { consumePasswordReset, requestPasswordReset, type PasswordResetSender } from "../lib/password-reset";
import { generateAlias } from "../lib/alias";
import {
  clearSessionCookie,
  createSession,
  currentUser,
  publicUser,
  requireAuth,
  setSessionCookie,
} from "../lib/auth";

const signupSchema = z.object({
  name: z.string().trim().min(1).max(60),
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(8).max(200),
  isStudent: z.boolean().optional().default(false),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

export function createAuthRouter(db: Database, sendVerification?: VerificationSender, sendPasswordReset?: PasswordResetSender): IRouter {
  const router: IRouter = Router();

  router.post("/auth/signup", async (req, res) => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const field = issue?.path[0];
      if (field === "password") {
        res.status(400).json({ error: "Password needs at least 8 characters" });
        return;
      }
      res.status(400).json({ error: "Check your name, email and password" });
      return;
    }
    const { name, email, password, isStudent } = parsed.data;

    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "An account with this email already exists" });
      return;
    }

    // Retry a few times on the small chance of an alias collision.
    let user = null;
    for (let attempt = 0; attempt < 5 && !user; attempt++) {
      const alias =
        attempt === 0
          ? generateAlias()
          : `${generateAlias()}${Math.floor(Math.random() * 90 + 10)}`;
      try {
        const rows = await db
          .insert(usersTable)
          .values({
            name,
            email,
            passwordHash: await hashPassword(password),
            alias,
            isStudent,
          })
          .returning();
        user = rows[0];
      } catch (err) {
        const pgError = err as { code?: string; constraint?: string; cause?: { code?: string; constraint?: string } };
        const detail = pgError.cause ?? pgError;
        if (detail.code === "23505" && detail.constraint?.includes("email")) {
          res.status(409).json({ error: "An account with this email already exists" });
          return;
        }
        if (detail.code !== "23505" || !detail.constraint?.includes("alias") || attempt === 4) throw err;
      }
    }

    const { token, expiresAt } = await createSession(db, user!.id);
    setSessionCookie(res, token, expiresAt);
    res.status(201).json({ user: publicUser(user!) });
  });

  router.post("/auth/login", async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Enter your email and password" });
      return;
    }
    const { email, password } = parsed.data;
    const rows = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    const user = rows[0];
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      res.status(401).json({ error: "Email or password doesn't match" });
      return;
    }
    const { token, expiresAt } = await createSession(db, user.id);
    setSessionCookie(res, token, expiresAt);
    res.json({ user: publicUser(user) });
  });

  router.post("/auth/verification/request", requireAuth(db), async (_req, res) => {
    const user = currentUser(res);
    if (user.emailVerifiedAt) { res.json({ ok: true }); return; }
    if (!sendVerification || !process.env.APP_ORIGIN) {
      res.status(503).json({ error: "Email verification is not available yet. Private tools work; shared posting stays locked." });
      return;
    }
    try {
      await requestVerification(db, user, sendVerification, process.env.APP_ORIGIN);
      res.json({ ok: true });
    } catch {
      res.status(503).json({ error: "Could not send verification. Try again later." });
    }
  });

  router.post("/auth/verification/confirm", requireAuth(db), async (req, res) => {
    const parsed = z.object({ token: z.string().regex(/^[A-Za-z0-9_-]{43}$/) }).safeParse(req.body);
    if (!parsed.success || !(await consumeVerification(db, parsed.data.token, currentUser(res).id))) {
      res.status(400).json({ error: "This verification link is invalid or expired. Request a new one." });
      return;
    }
    res.json({ ok: true });
  });

  // Answers the same way whether or not the email owns an account, so the
  // endpoint cannot be used to enumerate registered addresses.
  router.post("/auth/password/forgot", async (req, res) => {
    const parsed = z.object({ email: z.string().trim().toLowerCase().email().max(200) }).safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Enter the email you signed up with" });
      return;
    }
    if (!sendPasswordReset || !process.env.APP_ORIGIN) {
      res.status(503).json({ error: "Password reset by email is not available yet. If you are locked out, contact us and we will help." });
      return;
    }
    try {
      await requestPasswordReset(db, parsed.data.email, sendPasswordReset, process.env.APP_ORIGIN);
      res.json({ ok: true });
    } catch {
      res.status(503).json({ error: "Could not send the reset email. Try again later." });
    }
  });

  router.post("/auth/password/reset", async (req, res) => {
    const parsed = z.object({
      token: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
      password: z.string().min(8).max(200),
    }).safeParse(req.body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      if (issue?.path[0] === "password") {
        res.status(400).json({ error: "Password needs at least 8 characters" });
        return;
      }
      res.status(400).json({ error: "This reset link is invalid or expired. Request a new one." });
      return;
    }
    const ok = await consumePasswordReset(db, parsed.data.token, await hashPassword(parsed.data.password));
    if (!ok) {
      res.status(400).json({ error: "This reset link is invalid or expired. Request a new one." });
      return;
    }
    res.json({ ok: true });
  });

  router.post("/auth/logout", requireAuth(db), async (_req, res) => {
    clearSessionCookie(res);
    res.json({ ok: true });
  });

  router.get("/auth/me", requireAuth(db), async (_req, res) => {
    res.json({ user: publicUser(currentUser(res)) });
  });

  return router;
}
