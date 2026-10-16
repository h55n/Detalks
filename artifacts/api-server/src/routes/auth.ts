import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { usersTable, type Database } from "@workspace/db";
import { hashPassword, verifyPassword } from "../lib/password";
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

export function createAuthRouter(db: Database): IRouter {
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
        if (attempt === 4) throw err;
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

  router.post("/auth/logout", requireAuth(db), async (_req, res) => {
    clearSessionCookie(res);
    res.json({ ok: true });
  });

  router.get("/auth/me", requireAuth(db), async (_req, res) => {
    res.json({ user: publicUser(currentUser(res)) });
  });

  return router;
}
