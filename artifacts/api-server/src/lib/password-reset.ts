import { randomBytes } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import {
  authSessionsTable,
  passwordResetsTable,
  usersTable,
  type Database,
} from "@workspace/db";
import { hashToken } from "./auth";

export type PasswordResetSender = (email: string, link: string) => Promise<void>;

// A verified sender/domain must be configured before outbound mail is enabled.
export function passwordResetSenderFromEnv(env: NodeJS.ProcessEnv): PasswordResetSender | undefined {
  if (!env.RESEND_API_KEY || !env.VERIFICATION_FROM || !env.APP_ORIGIN) return undefined;
  return async (email, link) => {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.VERIFICATION_FROM,
        to: [email],
        subject: "Reset your DeTalks password",
        text: `Open this link to choose a new DeTalks password. It expires in 30 minutes.\n\n${link}\n\nIf you did not ask for this, ignore this email. Your password stays unchanged.`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error("Password reset delivery unavailable");
  };
}

// Never reveals whether the email owns an account: unknown addresses are a
// silent no-op while the caller always answers the same way.
export async function requestPasswordReset(
  db: Database,
  email: string,
  send: PasswordResetSender,
  origin: string,
): Promise<void> {
  const rows = await db
    .select({ id: usersTable.id, email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);
  const user = rows[0];
  if (!user) return;
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  await db.insert(passwordResetsTable).values({
    userId: user.id,
    tokenHash,
    expiresAt: new Date(Date.now() + 30 * 60_000),
  });
  try {
    const link = new URL("/reset-password", origin);
    // Fragment keeps the token out of HTTP access logs and referrer headers.
    link.hash = new URLSearchParams({ token }).toString();
    await send(user.email, link.toString());
  } catch {
    await db.delete(passwordResetsTable).where(eq(passwordResetsTable.tokenHash, tokenHash));
    throw new Error("Could not send the reset email. Try again later.");
  }
}

// A password change ends every existing session and burns all outstanding
// reset links for the account, so an old token or cookie cannot outlive it.
export async function consumePasswordReset(
  db: Database,
  token: string,
  passwordHash: string,
): Promise<boolean> {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .delete(passwordResetsTable)
      .where(and(
        eq(passwordResetsTable.tokenHash, hashToken(token)),
        gt(passwordResetsTable.expiresAt, new Date()),
      ))
      .returning();
    if (!row) return false;
    await tx.update(usersTable).set({ passwordHash }).where(eq(usersTable.id, row.userId));
    await tx.delete(authSessionsTable).where(eq(authSessionsTable.userId, row.userId));
    await tx.delete(passwordResetsTable).where(eq(passwordResetsTable.userId, row.userId));
    return true;
  });
}
