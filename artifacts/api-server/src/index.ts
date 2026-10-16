import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createDb } from "@workspace/db";
import { createApp } from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];
if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required but was not provided.");
}

const { db, migrate } = createDb(databaseUrl);

const applied = await migrate();
if (applied.length > 0) {
  logger.info({ applied }, "Database migrations applied");
}

const app = createApp({ db });

// Serve the built frontend (artifacts/detalks/dist) in production, with an
// SPA fallback so client-side routes load directly.
const webDist = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "detalks",
  "dist",
);
app.use(express.static(webDist));
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api")) {
    next();
    return;
  }
  res.sendFile(path.join(webDist, "index.html"), (err) => {
    if (err) next(err);
  });
});

app.listen(port, () => {
  logger.info({ port }, "Server listening");
});
