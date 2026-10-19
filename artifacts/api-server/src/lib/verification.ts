import { randomBytes } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { emailVerificationsTable, usersTable, type Database, type User } from "@workspace/db";
import { hashToken } from "./auth";

export type VerificationSender = (email: string, link: string) => Promise<void>;

// A verified sender/domain must be configured before outbound mail is enabled.
export function verificationSenderFromEnv(env: NodeJS.ProcessEnv): VerificationSender | undefined {
  if (!env.RESEND_API_KEY || !env.VERIFICATION_FROM || !env.APP_ORIGIN) return undefined;
  return async (email, link) => {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: env.VERIFICATION_FROM, to: [email], subject: "Verify your DeTalks email", text: `Open this link to verify your DeTalks email. It expires in 30 minutes.\n\n${link}\n\nIf you did not request this, ignore this email.` }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error("Verification delivery unavailable");
  };
}

export async function requestVerification(db: Database, user: User, send: VerificationSender, origin: string) {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  await db.insert(emailVerificationsTable).values({ userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 30 * 60_000) });
  try {
    const link = new URL("/verify-email", origin);
    // Fragment keeps the token out of HTTP access logs and referrer headers.
    link.hash = new URLSearchParams({ token }).toString();
    await send(user.email, link.toString());
  } catch {
    await db.delete(emailVerificationsTable).where(eq(emailVerificationsTable.tokenHash, tokenHash));
    throw new Error("Could not send verification. Try again later.");
  }
}

export async function consumeVerification(db: Database, token: string, userId: string): Promise<boolean> {
  return db.transaction(async (tx) => {
    const [row] = await tx.delete(emailVerificationsTable).where(and(
      eq(emailVerificationsTable.tokenHash, hashToken(token)),
      eq(emailVerificationsTable.userId, userId),
      gt(emailVerificationsTable.expiresAt, new Date()),
    )).returning();
    if (!row) return false;
    await tx.update(usersTable).set({ emailVerifiedAt: new Date() }).where(eq(usersTable.id, userId));
    await tx.delete(emailVerificationsTable).where(eq(emailVerificationsTable.userId, userId));
    return true;
  });
}
