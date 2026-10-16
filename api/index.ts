// Serverless entrypoint (Vercel Node function): wraps the same Express app
// that artifacts/api-server serves in the long-running deployment. Migrations
// run once per function instance before the first request is handled.
import { createApp } from "../artifacts/api-server/src/app";
import { createDb } from "@workspace/db";

const databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required but was not provided.");
}

const { db, migrate } = createDb(databaseUrl);
const app = createApp({ db });
const ready = migrate().then((applied) => {
  if (applied.length > 0) {
    console.log("Database migrations applied", applied);
  }
});

// Vercel invokes the default export with (req, res); Express apps are valid
// Node request handlers, so this just awaits migrations first.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  await ready;
  return app(req, res);
}
