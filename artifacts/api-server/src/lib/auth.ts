import { createHash, randomBytes } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { and, eq, gt } from "drizzle-orm";
import {
  authSessionsTable,
  usersTable,
  type Database,
  type User,
} from "@workspace/db";

export const SESSION_COOKIE = "detalks_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(
  db: Database,
  userId: string,
): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(authSessionsTable).values({
    userId,
    tokenHash: hashToken(token),
    expiresAt,
  });
  return { token, expiresAt };
}

export function setSessionCookie(
  res: Response,
  token: string,
  expiresAt: Date,
): void {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
}

export async function getSessionUser(
  db: Database,
  token: string | undefined,
): Promise<User | null> {
  if (!token) return null;
  const rows = await db
    .select({ user: usersTable, session: authSessionsTable })
    .from(authSessionsTable)
    .innerJoin(usersTable, eq(authSessionsTable.userId, usersTable.id))
    .where(
      and(
        eq(authSessionsTable.tokenHash, hashToken(token)),
        gt(authSessionsTable.expiresAt, new Date()),
      ),
    )
    .limit(1);
  return rows[0]?.user ?? null;
}

export function requireAuth(db: Database) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = (req.cookies as Record<string, string | undefined>)[
      SESSION_COOKIE
    ];
    const user = await getSessionUser(db, token);
    if (!user) {
      res.status(401).json({ error: "Not signed in" });
      return;
    }
    res.locals.user = user;
    next();
  };
}

export function currentUser(res: Response): User {
  return res.locals.user as User;
}

export function publicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    alias: user.alias,
    isStudent: user.isStudent,
    emailVerified: !!user.emailVerifiedAt,
    createdAt: user.createdAt,
  };
}

export function requireVerifiedEmail(_req: Request, res: Response, next: NextFunction) {
  if (!currentUser(res).emailVerifiedAt) {
    res.status(403).json({ error: "Verify your email before posting or reacting in shared circles. Private tools are still available." });
    return;
  }
  next();
}
