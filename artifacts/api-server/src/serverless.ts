// Serverless entrypoint (e.g. Vercel Node function): wraps the same Express
// app that index.ts serves in the long-running deployment. Migrations run
// once per function instance before the first request is handled.
import type { IncomingMessage, ServerResponse } from "node:http";
import { createDb } from "@workspace/db";
import { createApp } from "./app";
import { logger } from "./lib/logger";

const databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required but was not provided.");
}

const { db, migrate } = createDb(databaseUrl);
const app = createApp({ db });
const ready = migrate().then((applied) => {
  if (applied.length > 0) {
    logger.info({ applied }, "Database migrations applied");
  }
});

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  await ready;
  return new Promise((resolve, reject) => {
    res.on("finish", resolve);
    res.on("error", reject);
    app(req, res);
  });
}
