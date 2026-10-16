import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import type { AddressInfo } from "node:net";
import type { Express } from "express";
import { migrate, type SqlExecutor } from "@workspace/db";
import * as schema from "@workspace/db/schema";
import { createApp } from "../app";
import type { DishaResponder } from "../lib/disha";

export interface TestServer {
  baseUrl: string;
  close: () => Promise<void>;
}

export async function startTestServer(disha?: DishaResponder): Promise<TestServer> {
  const client = new PGlite();
  // PGlite's query() rejects multi-statement strings; exec() handles them.
  const executor: SqlExecutor = {
    query: (text, params) => {
      const multi = text.trim().replace(/;+\s*$/, "").includes(";");
      if (multi) return client.exec(text);
      return client.query(text, params as unknown[] | undefined);
    },
  };
  await migrate(executor);
  const db = drizzle(client, { schema });
  const app: Express = createApp({
    db,
    disha: disha ?? (async () => "I'm here and listening. Tell me more."),
  });
  const server = await new Promise<ReturnType<Express["listen"]>>((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const { port } = server.address() as AddressInfo;
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    close: () =>
      new Promise((resolve, reject) =>
        server.close((err) => (err ? reject(err) : resolve())),
      ),
  };
}

/** Minimal cookie-aware fetch client. */
export class Client {
  private cookie = "";
  constructor(private baseUrl: string) {}

  async req(method: string, path: string, body?: unknown) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(this.cookie ? { Cookie: this.cookie } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      this.cookie = setCookie.split(";")[0];
    }
    let json: unknown = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }
    return { status: res.status, json: json as Record<string, never> & { [k: string]: unknown } };
  }

  get(path: string) {
    return this.req("GET", path);
  }
  post(path: string, body?: unknown) {
    return this.req("POST", path, body);
  }
  put(path: string, body?: unknown) {
    return this.req("PUT", path, body);
  }
  delete(path: string) {
    return this.req("DELETE", path);
  }
}

export async function signup(client: Client, email = "asha@example.com") {
  const res = await client.post("/api/auth/signup", {
    name: "Asha",
    email,
    password: "a-safe-password",
    isStudent: true,
  });
  if (res.status !== 201) throw new Error(`signup failed: ${JSON.stringify(res.json)}`);
  return res.json.user as { id: string; alias: string };
}
